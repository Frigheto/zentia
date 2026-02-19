/**
 * admin-dashboard.js — Lógica do dashboard administrativo
 * Carrega métricas e estatísticas
 */

(function () {
    'use strict';

    // Inicializa Supabase (NEW PROJECT CREDENTIALS)
    const SUPABASE_URL = 'https://tohqjcsrgfvlotnkcmqy.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_KNJ58eZVQ2dlelSph-JNhA_6iYaHUbn';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    const PLAN_PRICES = {
        'starter': 197,
        'basico': 397,
        'profissional': 697,
        'premium': 997
    };

    // DOMContentLoaded
    document.addEventListener('DOMContentLoaded', async function () {
        // Verifica autenticação
        if (!window.adminAuth.isAuthenticated()) {
            window.location.href = '../admin-login.html';
            return;
        }

        // Mostra nome do admin
        const adminSession = window.adminAuth.getSession();
        document.getElementById('admin-user-name').textContent = adminSession.name || 'Admin';

        // Carrega dados do dashboard
        await loadDashboardData();
    });

    async function loadDashboardData() {
        try {
            // Busca todos os perfis de usuários
            const { data: profiles, error } = await supabase
                .from('profiles')
                .select('id, plan');

            if (error) throw error;

            // Calcula métricas
            const metrics = {
                totalUsers: profiles.length,
                byPlan: {
                    starter: 0,
                    basico: 0,
                    profissional: 0,
                    premium: 0,
                    noPlan: 0
                }
            };

            profiles.forEach(profile => {
                if (!profile.plan || profile.plan === '') {
                    metrics.byPlan.noPlan++;
                } else {
                    metrics.byPlan[profile.plan]++;
                }
            });

            // Calcula receita
            const revenue =
                (metrics.byPlan.starter * PLAN_PRICES['starter']) +
                (metrics.byPlan.basico * PLAN_PRICES['basico']) +
                (metrics.byPlan.profissional * PLAN_PRICES['profissional']) +
                (metrics.byPlan.premium * PLAN_PRICES['premium']);

            const activeSubs = Object.values(metrics.byPlan).reduce((a, b) => a + b, 0) - metrics.byPlan.noPlan;

            // Renderiza métricas
            document.getElementById('metric-total-users').textContent = metrics.totalUsers;
            document.getElementById('metric-active-subs').textContent = activeSubs;
            document.getElementById('metric-no-plan').textContent = metrics.byPlan.noPlan;
            document.getElementById('metric-revenue').textContent = 'R$ ' + revenue.toLocaleString('pt-BR');

            // Renderiza breakdown por plano
            const totalWithPlan = activeSubs || 1; // Evita divisão por 0
            const plans = ['starter', 'basico', 'profissional', 'premium'];

            plans.forEach(plan => {
                const count = metrics.byPlan[plan];
                const percentage = (count / totalWithPlan) * 100 || 0;

                document.getElementById(`plan-${plan}-count`).textContent = count;
                document.getElementById(`plan-${plan}-fill`).style.width = percentage + '%';
            });

        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
            alert('Erro ao carregar dados do dashboard');
        }
    }
})();
