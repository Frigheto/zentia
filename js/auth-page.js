/**
 * auth-page.js — ZENT I.A.
 * Lógica da página auth.html: tabs login/cadastro, submit, feedback.
 * Depende de js/auth.js (window.zentAuth).
 */
(function () {
    'use strict';

    // ----------------------------------------------------------------
    // Helpers de UI
    // ----------------------------------------------------------------
    function showMessage(msg, type) {
        var el = document.getElementById('auth-message');
        if (!el) return;
        el.textContent = msg;
        el.className = 'auth-message auth-message--' + (type || 'error');
        el.style.display = 'block';
    }

    function hideMessage() {
        var el = document.getElementById('auth-message');
        if (el) el.style.display = 'none';
    }

    function setFieldError(fieldId, errorId, message) {
        var field = document.getElementById(fieldId);
        var errorEl = document.getElementById(errorId);
        if (field) field.classList.toggle('is-invalid', !!message);
        if (errorEl) errorEl.textContent = message || '';
    }

    function clearErrors(prefix) {
        ['name', 'email', 'password'].forEach(function (field) {
            setFieldError(prefix + '-' + field, prefix + '-error-' + field, '');
        });
    }

    function setLoading(btnId, loading, defaultText) {
        var btn = document.getElementById(btnId);
        if (!btn) return;
        btn.disabled = loading;
        btn.textContent = loading ? 'Aguarde...' : defaultText;
    }

    // ----------------------------------------------------------------
    // Tabs
    // ----------------------------------------------------------------
    function activateTab(tabName) {
        var isLogin = tabName === 'login';
        document.getElementById('tab-login').classList.toggle('active', isLogin);
        document.getElementById('tab-register').classList.toggle('active', !isLogin);
        document.getElementById('form-login').style.display    = isLogin ? '' : 'none';
        document.getElementById('form-register').style.display = isLogin ? 'none' : '';
        document.getElementById('auth-verify').style.display   = 'none';
        hideMessage();
    }

    // ----------------------------------------------------------------
    // Lê parâmetro ?redirect= da URL para saber para onde ir após login
    // ----------------------------------------------------------------
    function getRedirectUrl() {
        var params = new URLSearchParams(window.location.search);
        var redirect = params.get('redirect');
        if (redirect && redirect.startsWith('http')) {
            // Só aceita redirect para o mesmo origin
            try {
                var u = new URL(redirect);
                if (u.origin === window.location.origin) return redirect;
            } catch (e) { /* ignore */ }
        }
        if (redirect && !redirect.startsWith('http')) {
            return redirect; // caminho relativo (checkout.html?plan=X)
        }
        return 'members.html';
    }

    // ----------------------------------------------------------------
    // Inicialização
    // ----------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', function () {

        // Se já está logado, redireciona direto
        window.zentAuth.getSession().then(function (session) {
            if (session) {
                window.location.href = getRedirectUrl();
            }
        });

        // ---- Tab buttons ----
        document.getElementById('tab-login').addEventListener('click', function () { activateTab('login'); });
        document.getElementById('tab-register').addEventListener('click', function () { activateTab('register'); });
        document.getElementById('go-to-register').addEventListener('click', function () { activateTab('register'); });
        document.getElementById('go-to-login').addEventListener('click', function () { activateTab('login'); });
        document.getElementById('back-to-login').addEventListener('click', function () { activateTab('login'); });

        // ---- Google OAuth Buttons ----
        var googleLoginBtn = document.getElementById('google-login-btn');
        var googleSignupBtn = document.getElementById('google-signup-btn');

        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', function (e) {
                e.preventDefault();
                hideMessage();
                window.zentAuth.signInWithGoogle().catch(function (err) {
                    console.error('Erro ao login com Google:', err);
                    showMessage('Erro ao conectar com Google: ' + (err.message || 'Desconhecido'), 'error');
                });
            });
        }

        if (googleSignupBtn) {
            googleSignupBtn.addEventListener('click', function (e) {
                e.preventDefault();
                hideMessage();
                window.zentAuth.signInWithGoogle().catch(function (err) {
                    console.error('Erro ao criar conta com Google:', err);
                    showMessage('Erro ao conectar com Google: ' + (err.message || 'Desconhecido'), 'error');
                });
            });
        }

        // ---- Verifica se veio com ?tab=register ----
        var params = new URLSearchParams(window.location.search);
        if (params.get('tab') === 'register') activateTab('register');

        // ---- Submit: Login ----
        document.getElementById('form-login').addEventListener('submit', function (e) {
            e.preventDefault();
            hideMessage();
            clearErrors('login');

            var email    = (document.getElementById('login-email')    || {}).value || '';
            var password = (document.getElementById('login-password') || {}).value || '';
            var valid = true;

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setFieldError('login-email', 'login-error-email', 'Informe um e-mail válido.');
                valid = false;
            }
            if (!password) {
                setFieldError('login-password', 'login-error-password', 'Informe sua senha.');
                valid = false;
            }
            if (!valid) return;

            setLoading('login-submit', true, 'Entrar');

            window.zentAuth.signIn(email, password).then(function () {
                window.location.href = getRedirectUrl();
            }).catch(function (err) {
                setLoading('login-submit', false, 'Entrar');
                var msg = err.message || 'Erro ao fazer login.';
                if (msg.toLowerCase().includes('invalid login')) msg = 'E-mail ou senha incorretos.';
                if (msg.toLowerCase().includes('email not confirmed')) msg = 'Confirme seu e-mail antes de fazer login.';
                showMessage(msg, 'error');
            });
        });

        // ---- Submit: Cadastro ----
        document.getElementById('form-register').addEventListener('submit', function (e) {
            e.preventDefault();
            hideMessage();
            clearErrors('reg');

            var name     = (document.getElementById('reg-name')     || {}).value || '';
            var email    = (document.getElementById('reg-email')    || {}).value || '';
            var password = (document.getElementById('reg-password') || {}).value || '';
            var valid = true;

            if (!name || name.trim().length < 3) {
                setFieldError('reg-name', 'reg-error-name', 'Informe seu nome completo.');
                valid = false;
            }
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setFieldError('reg-email', 'reg-error-email', 'Informe um e-mail válido.');
                valid = false;
            }
            if (!password || password.length < 8) {
                setFieldError('reg-password', 'reg-error-password', 'A senha deve ter pelo menos 8 caracteres.');
                valid = false;
            }
            if (!valid) return;

            setLoading('reg-submit', true, 'Criar conta');

            window.zentAuth.signUp(email, password, name.trim()).then(function (data) {
                setLoading('reg-submit', false, 'Criar conta');

                // Se o usuário foi criado mas ainda precisa confirmar e-mail
                var needsConfirmation = data.user && !data.session;
                if (needsConfirmation) {
                    document.getElementById('form-register').style.display = 'none';
                    document.getElementById('tab-register').classList.remove('active');
                    var verifyEl = document.getElementById('auth-verify');
                    var emailSpan = document.getElementById('verify-email-address');
                    if (emailSpan) emailSpan.textContent = email;
                    if (verifyEl) verifyEl.style.display = 'block';
                } else {
                    // Cadastro + login automático (confirmação desativada no Supabase)
                    window.location.href = getRedirectUrl();
                }
            }).catch(function (err) {
                setLoading('reg-submit', false, 'Criar conta');
                var msg = err.message || 'Erro ao criar conta.';
                if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already been registered')) {
                    msg = 'Este e-mail já está cadastrado. Tente fazer login.';
                }
                showMessage(msg, 'error');
            });
        });

    });

})();
