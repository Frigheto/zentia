/**
 * admin-auth.js — Autenticação de administradores
 * Gerencia login e sessão do painel administrativo
 */

(function () {
    'use strict';

    // Inicializa Supabase (NEW PROJECT CREDENTIALS)
    const SUPABASE_URL = 'https://tohqjcsrgfvlotnkcmqy.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_KNJ58eZVQ2dlelSph-JNhA_6iYaHUbn';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // Verifica se está na página de login
    const loginForm = document.getElementById('admin-login-form');
    if (!loginForm) return;

    const emailInput = document.getElementById('admin-email');
    const passwordInput = document.getElementById('admin-password');
    const loginBtn = document.getElementById('admin-login-btn');
    const errorEl = document.getElementById('admin-login-error');
    const loadingEl = document.getElementById('admin-login-loading');
    const passwordToggle = document.getElementById('admin-password-toggle');

    // Toggle: Mostrar/esconder senha
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function (e) {
            e.preventDefault();
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            passwordToggle.classList.toggle('active', type === 'text');
        });
    }

    // Gerencia sessão do admin (localStorage)
    window.adminAuth = {
        setSession: function (adminData) {
            localStorage.setItem('admin_session', JSON.stringify(adminData));
            localStorage.setItem('admin_token', adminData.token || '');
        },
        getSession: function () {
            const session = localStorage.getItem('admin_session');
            return session ? JSON.parse(session) : null;
        },
        clearSession: function () {
            localStorage.removeItem('admin_session');
            localStorage.removeItem('admin_token');
        },
        isAuthenticated: function () {
            return this.getSession() !== null;
        }
    };

    // Verifica autenticação ao carregar página
    if (window.location.pathname.includes('/admin/')) {
        if (!window.adminAuth.isAuthenticated()) {
            window.location.href = 'admin-login.html';
        }
    }

    // Handler: Submit do formulário de login
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            showError('Preencha e-mail e senha');
            return;
        }

        loginBtn.disabled = true;
        loginBtn.style.display = 'none';
        loadingEl.style.display = 'block';
        errorEl.style.display = 'none';

        try {
            // Busca admin na tabela admin_users
            const { data: admins, error: queryError } = await supabase
                .from('admin_users')
                .select('id, email, name, password_hash')
                .eq('email', email)
                .limit(1);

            if (queryError) {
                console.error('[Admin Auth] Erro na query:', queryError);
                throw queryError;
            }

            if (!admins || admins.length === 0) {
                console.warn('[Admin Auth] Admin não encontrado:', email);
                showError('E-mail ou senha incorretos');
                resetForm();
                return;
            }

            const admin = admins[0];
            console.log('[Admin Auth] Admin encontrado:', admin.email);

            // Valida senha usando crypt (simulado com comparação)
            // IMPORTANTE: Na produção, usar bcrypt.js ou similar
            const isPasswordValid = await validatePassword(password, admin.password_hash);
            console.log('[Admin Auth] Senha válida:', isPasswordValid);

            if (!isPasswordValid) {
                console.warn('[Admin Auth] Senha inválida');
                showError('E-mail ou senha incorretos');
                resetForm();
                return;
            }

            // Login bem-sucedido: armazena sessão
            const session = {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                loginTime: new Date().toISOString(),
                token: 'admin_' + Math.random().toString(36).substr(2, 9)
            };

            window.adminAuth.setSession(session);
            console.log('[Admin Auth] Sessão armazenada:', session);

            // Registra no audit_log (não bloqueia o login se falhar)
            try {
                await supabase.from('audit_log').insert({
                    admin_id: admin.id,
                    action: 'LOGIN',
                    resource_type: 'admin',
                    timestamp: new Date().toISOString()
                });
                console.log('[Admin Auth] Audit log registrado');
            } catch (auditError) {
                console.warn('[Admin Auth] Erro ao registrar audit log (não bloqueante):', auditError);
            }

            console.log('[Admin Auth] Login bem-sucedido, redirecionando para admin/dashboard.html');
            // Redireciona para dashboard
            setTimeout(() => {
                window.location.href = 'admin/dashboard.html';
            }, 500);

        } catch (error) {
            console.error('[Admin Auth] Erro no login:', error);
            console.error('[Admin Auth] Stack trace:', error.stack);
            console.error('[Admin Auth] Detalhes do erro:', {
                message: error.message,
                status: error.status,
                code: error.code
            });
            showError('Erro ao conectar com o servidor: ' + (error.message || 'Desconhecido'));
            resetForm();
        }
    });

    function showError(message) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }

    function resetForm() {
        loginBtn.disabled = false;
        loginBtn.style.display = 'block';
        loadingEl.style.display = 'none';
    }

    // Validação de senha (comparação simples)
    // Na produção, usar bcrypt.js para validação segura
    async function validatePassword(plaintext, hash) {
        // DESENVOLVIMENTO: Validação simples (string matching)
        // Em produção, usar bcrypt.js para validação segura
        // Usar um Supabase Function ou Edge Function para validação segura

        // Para agora: compare direto (não recomendado em produção!)
        return plaintext === hash;
    }

    // Logout (disponível em todo admin)
    window.adminLogout = function () {
        window.adminAuth.clearSession();
        window.location.href = 'admin-login.html';
    };
})();
