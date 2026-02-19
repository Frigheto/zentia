/**
 * asaas-webhook — Supabase Edge Function
 * Recebe notificações de pagamento do Asaas e atualiza o plano do usuário.
 *
 * DEPLOY: Cole este código no Supabase Dashboard → Edge Functions → New Function "asaas-webhook"
 *
 * SECRETS NECESSÁRIOS (Supabase → Settings → Secrets):
 *   ASAAS_WEBHOOK_TOKEN  — string secreta que você define (ex: "zent_wh_abc123xyz")
 *   (SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são injetados automaticamente)
 *
 * URL DO WEBHOOK (configure no Asaas → Configurações → Webhooks):
 *   https://bhxfvpbfczzvznfwqcga.supabase.co/functions/v1/asaas-webhook?token=SEU_TOKEN
 *
 * EVENTOS ASAAS PARA MARCAR:
 *   PAYMENT_CONFIRMED, PAYMENT_RECEIVED, SUBSCRIPTION_DELETED
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Mapeamento valor do pagamento → chave do plano (fallback quando externalReference vazio)
const PLAN_BY_VALUE: Record<number, string> = {
    147: 'starter',
    447: 'basico',
    697: 'profissional',
    997: 'premium',
};

const VALID_PLANS = new Set(['starter', 'basico', 'profissional', 'premium']);

const ACTIVATION_EVENTS = new Set(['PAYMENT_CONFIRMED', 'PAYMENT_RECEIVED']);
const CANCELLATION_EVENTS = new Set(['SUBSCRIPTION_DELETED']);

// ----------------------------------------------------------------
// Handler principal
// ----------------------------------------------------------------
Deno.serve(async (req: Request) => {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    // Validar token secreto — Asaas envia para: .../asaas-webhook?token=SEU_TOKEN
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const expectedToken = Deno.env.get('ASAAS_WEBHOOK_TOKEN');

    if (expectedToken && token !== expectedToken) {
        console.warn('[asaas-webhook] Token inválido recebido');
        return new Response('Unauthorized', { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
        body = await req.json();
    } catch {
        return new Response('Bad Request: JSON inválido', { status: 400 });
    }

    const event = String(body?.event ?? '');
    console.log(`[asaas-webhook] Evento recebido: ${event}`);

    // Criar cliente Supabase com service role (ignora RLS)
    const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
        { auth: { persistSession: false } }
    );

    // ---- CANCELAMENTO: SUBSCRIPTION_DELETED ----
    if (CANCELLATION_EVENTS.has(event)) {
        const subscription = body.subscription as Record<string, unknown> | undefined;
        const externalRef = subscription?.externalReference as string | undefined
            || (body.payment as Record<string, unknown> | undefined)?.externalReference as string | undefined;

        const userId = extractUserId(externalRef);

        if (userId) {
            const { error } = await supabase
                .from('profiles')
                .update({ plan: null })
                .eq('id', userId);

            if (error) {
                console.error('[asaas-webhook] Erro ao cancelar plano:', error.message);
                return new Response('Internal Server Error', { status: 500 });
            }
            console.log(`[asaas-webhook] Plano cancelado para userId: ${userId}`);
        } else {
            console.warn('[asaas-webhook] SUBSCRIPTION_DELETED sem userId identificável');
        }

        return new Response('OK', { status: 200 });
    }

    // ---- ATIVAÇÃO: PAYMENT_CONFIRMED / PAYMENT_RECEIVED ----
    if (!ACTIVATION_EVENTS.has(event)) {
        // Evento não relevante — responde 200 para Asaas não fazer retry
        return new Response('OK', { status: 200 });
    }

    const payment = body.payment as Record<string, unknown> | undefined;
    if (!payment) {
        console.warn('[asaas-webhook] Payload sem objeto payment');
        return new Response('OK', { status: 200 });
    }

    const externalRef = payment.externalReference as string | undefined;
    const paymentValue = Number(payment.value ?? 0);

    // Determina o plano: prioriza externalReference, fallback pelo valor
    const planFromRef = extractPlan(externalRef);
    const userIdFromRef = extractUserId(externalRef);

    const plan = planFromRef || PLAN_BY_VALUE[Math.round(paymentValue)];

    if (!plan) {
        console.warn(`[asaas-webhook] Plano não identificado — valor: ${paymentValue}, ref: "${externalRef}"`);
        return new Response('OK', { status: 200 });
    }

    if (!userIdFromRef) {
        console.warn(`[asaas-webhook] userId não encontrado em externalReference: "${externalRef}"`);
        // Sem o userId não conseguimos atualizar de forma segura
        return new Response('OK', { status: 200 });
    }

    // Atualiza o plano na tabela public.profiles
    const { error } = await supabase
        .from('profiles')
        .update({ plan })
        .eq('id', userIdFromRef);

    if (error) {
        console.error('[asaas-webhook] Erro ao atualizar plano:', error.message);
        return new Response('Internal Server Error', { status: 500 });
    }

    console.log(`[asaas-webhook] Plano "${plan}" ativado para userId: ${userIdFromRef}`);
    return new Response('OK', { status: 200 });
});

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

/**
 * Extrai o userId de um externalReference no formato:
 *   plan:profissional:uid:aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee
 */
function extractUserId(ref: string | undefined): string | null {
    if (!ref) return null;
    const match = ref.match(/uid:([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
    return match ? match[1] : null;
}

/**
 * Extrai o plano de um externalReference no formato:
 *   plan:profissional:uid:...
 */
function extractPlan(ref: string | undefined): string | null {
    if (!ref) return null;
    const match = ref.match(/plan:([a-z]+)/i);
    const plan = match ? match[1].toLowerCase() : null;
    return plan && VALID_PLANS.has(plan) ? plan : null;
}
