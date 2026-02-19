/**
 * LGPD Consent Banner
 * Manages cookie consent for analytics (GA4, Meta Pixel).
 * Analytics scripts only fire after user accepts.
 */
(function () {
    'use strict';

    const CONSENT_KEY = 'zent_cookie_consent';

    function getConsent() {
        try {
            return localStorage.getItem(CONSENT_KEY);
        } catch {
            return null;
        }
    }

    function setConsent(value) {
        try {
            localStorage.setItem(CONSENT_KEY, value);
        } catch {
            // localStorage not available
        }
    }

    function showBanner() {
        const banner = document.createElement('div');
        banner.id = 'consent-banner';
        banner.className = 'consent-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Consentimento de cookies');
        banner.innerHTML = `
            <div class="consent-content">
                <p>Utilizamos cookies para melhorar sua experiência e analisar o tráfego do site.
                   Ao aceitar, você concorda com nossa <a href="/privacidade.html">Política de Privacidade</a>.</p>
                <div class="consent-actions">
                    <button id="consent-accept" class="btn btn-primary consent-btn">Aceitar</button>
                    <button id="consent-reject" class="btn btn-outline consent-btn">Recusar</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);

        document.getElementById('consent-accept').addEventListener('click', function () {
            setConsent('accepted');
            banner.remove();
            window.dispatchEvent(new CustomEvent('consentGranted'));
        });

        document.getElementById('consent-reject').addEventListener('click', function () {
            setConsent('rejected');
            banner.remove();
        });
    }

    // On load: check consent state
    document.addEventListener('DOMContentLoaded', function () {
        var consent = getConsent();
        if (consent === 'accepted') {
            window.dispatchEvent(new CustomEvent('consentGranted'));
        } else if (!consent) {
            showBanner();
        }
        // If 'rejected', do nothing (no banner, no analytics)
    });
})();
