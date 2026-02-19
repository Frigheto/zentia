/**
 * Lead Capture Form — Validation & Submission
 * Handles: validation, WhatsApp formatting, honeypot, webhook POST, analytics tracking.
 */
(function () {
    'use strict';

    var WEBHOOK_URL = '';  // Set via .env / GHL_WEBHOOK_URL

    // --- WhatsApp Formatting ---
    function formatWhatsApp(value) {
        var digits = value.replace(/\D/g, '');
        if (digits.length > 11) digits = digits.substring(0, 11);
        if (digits.length <= 2) return digits;
        if (digits.length <= 7) return '(' + digits.substring(0, 2) + ') ' + digits.substring(2);
        return '(' + digits.substring(0, 2) + ') ' + digits.substring(2, 7) + '-' + digits.substring(7);
    }

    // --- Validation ---
    function validateName(name) {
        return name.trim().length >= 2;
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    }

    function validateWhatsApp(phone) {
        var digits = phone.replace(/\D/g, '');
        return digits.length === 10 || digits.length === 11;
    }

    function showError(fieldId, message) {
        var errorEl = document.getElementById('error-' + fieldId);
        var input = document.getElementById('lead-' + fieldId);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
        if (input) input.classList.add('input-error');
    }

    function clearError(fieldId) {
        var errorEl = document.getElementById('error-' + fieldId);
        var input = document.getElementById('lead-' + fieldId);
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.style.display = 'none';
        }
        if (input) input.classList.remove('input-error');
    }

    function clearAllErrors() {
        ['name', 'email', 'whatsapp'].forEach(clearError);
    }

    // --- UTM Data ---
    function getUTMData() {
        try {
            var data = sessionStorage.getItem('zent_utm');
            return data ? JSON.parse(data) : {};
        } catch (e) {
            return {};
        }
    }

    // --- Form Init ---
    document.addEventListener('DOMContentLoaded', function () {
        var form = document.getElementById('lead-form');
        if (!form) return;

        var whatsappInput = document.getElementById('lead-whatsapp');
        var submitBtn = document.getElementById('lead-submit');
        var successMsg = document.getElementById('form-success');
        var errorMsg = document.getElementById('form-error-msg');

        // Live WhatsApp formatting
        if (whatsappInput) {
            whatsappInput.addEventListener('input', function () {
                var pos = this.selectionStart;
                var before = this.value.length;
                this.value = formatWhatsApp(this.value);
                var after = this.value.length;
                this.setSelectionRange(pos + (after - before), pos + (after - before));
            });
        }

        // Clear errors on input
        ['name', 'email', 'whatsapp'].forEach(function (field) {
            var input = document.getElementById('lead-' + field);
            if (input) {
                input.addEventListener('input', function () {
                    clearError(field);
                });
            }
        });

        // Submit handler
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            clearAllErrors();

            // Honeypot check
            var honeypot = form.querySelector('input[name="website"]');
            if (honeypot && honeypot.value) return;

            var name = document.getElementById('lead-name').value;
            var email = document.getElementById('lead-email').value;
            var whatsapp = document.getElementById('lead-whatsapp').value;
            var plan = document.getElementById('lead-plan').value;

            // Validate
            var valid = true;

            if (!validateName(name)) {
                showError('name', 'Informe seu nome completo.');
                valid = false;
            }

            if (!validateEmail(email)) {
                showError('email', 'Informe um e-mail válido.');
                valid = false;
            }

            if (!validateWhatsApp(whatsapp)) {
                showError('whatsapp', 'Informe um WhatsApp válido com DDD.');
                valid = false;
            }

            if (!valid) return;

            // Build payload
            var utmData = getUTMData();
            var payload = {
                name: name.trim(),
                email: email.trim(),
                phone: whatsapp.replace(/\D/g, ''),
                plan: plan || 'nenhum',
                source: utmData.utm_source || 'organic',
                medium: utmData.utm_medium || '',
                campaign: utmData.utm_campaign || '',
                page: window.location.pathname
            };

            // Disable button
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';

            // Send to webhook
            if (WEBHOOK_URL) {
                fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
                    .then(function (response) {
                        if (!response.ok) throw new Error('HTTP ' + response.status);
                        onSuccess();
                    })
                    .catch(function () {
                        onError();
                    });
            } else {
                // No webhook configured — show success anyway (dev mode)
                setTimeout(onSuccess, 500);
            }

            function onSuccess() {
                form.reset();
                successMsg.style.display = 'block';
                errorMsg.style.display = 'none';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Quero uma demonstração gratuita';

                // Track conversion
                if (typeof window.zentTrackEvent === 'function') {
                    window.zentTrackEvent('lead_form_submit', {
                        plan: payload.plan,
                        source: payload.source
                    });
                }

                // Meta Pixel Lead event
                if (typeof window.fbq === 'function') {
                    window.fbq('track', 'Lead', {
                        content_name: payload.plan,
                        content_category: 'form_submission'
                    });
                }

                // Dispara evento para payment.js exibir botão de pagamento Asaas
                if (payload.plan && payload.plan !== 'nenhum') {
                    var event = new CustomEvent('zent:lead:success', {
                        detail: { plan: payload.plan, name: payload.name }
                    });
                    document.dispatchEvent(event);
                }

                // Esconde mensagem de sucesso após 8s (mais tempo para o usuário clicar no pagamento)
                setTimeout(function () {
                    successMsg.style.display = 'none';
                    var paymentBtn = document.getElementById('asaas-payment-btn');
                    if (paymentBtn) paymentBtn.remove();
                }, 8000);
            }

            function onError() {
                errorMsg.style.display = 'block';
                successMsg.style.display = 'none';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Quero uma demonstração';

                setTimeout(function () {
                    errorMsg.style.display = 'none';
                }, 5000);
            }
        });
    });
})();
