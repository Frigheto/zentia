/**
 * admin-users.js — Gerenciamento de usuários
 * CRUD de usuários e edição de planos
 */

(function () {
    'use strict';

    const SUPABASE_URL = 'https://tohqjcsrgfvlotnkcmqy.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_KNJ58eZVQ2dlelSph-JNhA_6iYaHUbn';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    let allUsers = [];
    let currentPage = 0;
    const itemsPerPage = 10;
    let editingUserId = null;

    const PLAN_LABELS = {
        'starter': 'Starter',
        'basico': 'Básico',
        'profissional': 'Profissional',
        'premium': 'Premium',
        '': 'Sem plano'
    };

    // DOMContentLoaded
    document.addEventListener('DOMContentLoaded', async function () {
        if (!window.adminAuth.isAuthenticated()) {
            window.location.href = '../admin-login.html';
            return;
        }

        const adminSession = window.adminAuth.getSession();
        document.getElementById('admin-user-name').textContent = adminSession.name || 'Admin';

        // Carrega usuários
        await loadUsers();

        // Event listeners
        document.getElementById('filter-search').addEventListener('input', filterUsers);
        document.getElementById('filter-plan').addEventListener('change', filterUsers);
        document.getElementById('users-prev-btn').addEventListener('click', previousPage);
        document.getElementById('users-next-btn').addEventListener('click', nextPage);
    });

    async function loadUsers() {
        try {
            const { data: profiles, error } = await supabase
                .from('profiles')
                .select('id, email, full_name, plan, created_at');

            if (error) throw error;

            allUsers = (profiles || []).map(p => ({
                id: p.id,
                email: p.email || '—',
                name: p.full_name || 'Sem nome',
                plan: p.plan || '',
                createdAt: p.created_at
            }));

            currentPage = 0;
            renderUsers();

        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            alert('Erro ao carregar usuários');
        }
    }

    function filterUsers() {
        currentPage = 0;
        renderUsers();
    }

    function renderUsers() {
        const searchTerm = document.getElementById('filter-search').value.toLowerCase();
        const planFilter = document.getElementById('filter-plan').value;

        let filtered = allUsers.filter(user => {
            const matchesSearch = user.email.toLowerCase().includes(searchTerm) ||
                user.name.toLowerCase().includes(searchTerm);
            const matchesPlan = planFilter === '' || user.plan === planFilter;
            return matchesSearch && matchesPlan;
        });

        const totalPages = Math.ceil(filtered.length / itemsPerPage);
        const start = currentPage * itemsPerPage;
        const pageUsers = filtered.slice(start, start + itemsPerPage);

        const tbody = document.getElementById('users-tbody');
        tbody.innerHTML = '';

        if (pageUsers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="admin-table-empty">Nenhum usuário encontrado</td></tr>';
        } else {
            pageUsers.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${escapeHtml(user.name)}</td>
                    <td>${escapeHtml(user.email)}</td>
                    <td>
                        <span class="admin-plan-badge admin-plan-badge--${user.plan || 'noplan'}">
                            ${PLAN_LABELS[user.plan]}
                        </span>
                    </td>
                    <td>${formatDate(user.createdAt)}</td>
                    <td>
                        <button type="button" class="admin-btn admin-btn--small" onclick="openUserModal('${user.id}', '${escapeHtml(user.name)}', '${escapeHtml(user.email)}', '${user.plan}')">
                            Editar
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        // Pagination
        const pagination = document.getElementById('users-pagination');
        if (totalPages > 1) {
            pagination.style.display = 'flex';
            document.getElementById('users-page-info').textContent = `Página ${currentPage + 1} de ${totalPages}`;
            document.getElementById('users-prev-btn').disabled = currentPage === 0;
            document.getElementById('users-next-btn').disabled = currentPage === totalPages - 1;
        } else {
            pagination.style.display = 'none';
        }
    }

    function previousPage() {
        if (currentPage > 0) currentPage--;
        renderUsers();
    }

    function nextPage() {
        const searchTerm = document.getElementById('filter-search').value.toLowerCase();
        const planFilter = document.getElementById('filter-plan').value;
        let filtered = allUsers.filter(user => {
            const matchesSearch = user.email.toLowerCase().includes(searchTerm) ||
                user.name.toLowerCase().includes(searchTerm);
            const matchesPlan = planFilter === '' || user.plan === planFilter;
            return matchesSearch && matchesPlan;
        });
        const totalPages = Math.ceil(filtered.length / itemsPerPage);
        if (currentPage < totalPages - 1) currentPage++;
        renderUsers();
    }

    window.openUserModal = function (userId, userName, userEmail, userPlan) {
        editingUserId = userId;
        document.getElementById('edit-user-name').value = userName;
        document.getElementById('edit-user-email').value = userEmail;
        document.getElementById('edit-user-plan').value = userPlan;
        document.getElementById('user-edit-modal').style.display = 'flex';
    };

    window.closeUserModal = function () {
        document.getElementById('user-edit-modal').style.display = 'none';
        editingUserId = null;
    };

    window.saveUserChanges = async function () {
        const newPlan = document.getElementById('edit-user-plan').value;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ plan: newPlan || null })
                .eq('id', editingUserId);

            if (error) throw error;

            // Registra no audit_log
            const adminSession = window.adminAuth.getSession();
            await supabase.from('audit_log').insert({
                admin_id: adminSession.id,
                action: 'UPDATE_USER_PLAN',
                resource_type: 'user',
                resource_id: editingUserId,
                changes: { plan: newPlan },
                timestamp: new Date().toISOString()
            });

            window.closeUserModal();
            await loadUsers();

        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
            alert('Erro ao salvar alterações');
        }
    };

    function formatDate(dateString) {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
})();
