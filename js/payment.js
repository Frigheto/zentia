/**
 * payment.js — ZENT I.A.
 * Mantém os links de pagamento Asaas para referência e exibe botão
 * de pagamento após captação de lead pelo formulário de demonstração.
 *
 * O checkout completo (form + validação + redirect) está em js/checkout.js
 * e é usado pela página checkout.html?plan=X
 */
(function () {
    'use strict';

    // ----------------------------------------------------------------
    // ATIVE O SANDBOX PARA TESTES (mude para false em produção)
    // Mantenha em sincronia com js/checkout.js
    // ----------------------------------------------------------------
    var ASAAS_SANDBOX = false;

    var PLAN_LABELS = {
        'starter':      'Starter — R$ 147/mês',
        'basico':       'Básico — R$ 447/mês',
        'profissional': 'Profissional — R$ 697/mês',
        'premium':      'Premium — R$ 997/mês'
    };

    // Ouve evento de lead capturado com sucesso (disparado por form.js)
    // Exibe botão "Finalizar pagamento" que leva para checkout.html
    document.addEventListener('DOMContentLoaded', function () {
        document.addEventListener('zent:lead:success', function (e) {
            var plan = e.detail && e.detail.plan;
            if (plan && PLAN_LABELS[plan]) {
                showPaymentButton(plan);
            }
        });
    });

    // ----------------------------------------------------------------
    // Botão "Finalizar pagamento" exibido após captação de lead (form demo)
    // ----------------------------------------------------------------
    function showPaymentButton(plan) {
        var successEl = document.getElementById('form-success');
        if (!successEl) return;

        var existingBtn = document.getElementById('asaas-payment-btn');
        if (existingBtn) existingBtn.remove();

        var btn = document.createElement('a');
        btn.id = 'asaas-payment-btn';
        btn.href = 'checkout.html?plan=' + plan;
        btn.className = 'btn btn-primary full-width';
        btn.style.cssText = 'margin-top: 0.75rem; display: flex; justify-content: center;';
        btn.textContent = 'Ir para o pagamento — ' + (PLAN_LABELS[plan] || plan);

        successEl.insertAdjacentElement('afterend', btn);
    }

    // Expõe para uso externo se necessário
    window.zentShowPaymentButton = showPaymentButton;

})();
