/**
 * Analytics Module — GA4 + Meta Pixel
 * Only initializes after consent is granted (LGPD compliance).
 * Tracks: page views, CTA clicks, scroll depth, form conversions.
 */
(function () {
    'use strict';

    // --- Configuration ---
    // Replace with actual IDs before going live
    var GA4_ID = 'G-XXXXXXXXXX';
    var META_PIXEL_ID = 'XXXXXXXXXXXXXXXXX';

    var analyticsLoaded = false;

    // --- UTM Capture ---
    function captureUTM() {
        var params = new URLSearchParams(window.location.search);
        var utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
        var utmData = {};

        utmKeys.forEach(function (key) {
            var value = params.get(key);
            if (value) {
                utmData[key] = value;
            }
        });

        if (Object.keys(utmData).length > 0) {
            try {
                sessionStorage.setItem('zent_utm', JSON.stringify(utmData));
            } catch (e) {
                // sessionStorage not available
            }
        }

        return utmData;
    }

    function getStoredUTM() {
        try {
            var data = sessionStorage.getItem('zent_utm');
            return data ? JSON.parse(data) : {};
        } catch {
            return {};
        }
    }

    // --- GA4 Setup ---
    function loadGA4() {
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        window.gtag = gtag;

        gtag('js', new Date());
        gtag('config', GA4_ID, {
            send_page_view: true,
            cookie_flags: 'SameSite=None;Secure'
        });
    }

    // --- Meta Pixel Setup ---
    function loadMetaPixel() {
        !function (f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
            if (!f._fbq) f._fbq = n;
            n.push = n; n.loaded = !0; n.version = '2.0';
            n.queue = [];
            t = b.createElement(e); t.async = !0; t.src = v;
            s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
        }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

        window.fbq('init', META_PIXEL_ID);
        window.fbq('track', 'PageView');
    }

    // --- Event Tracking ---
    function trackEvent(eventName, params) {
        if (!analyticsLoaded) return;

        // GA4
        if (typeof window.gtag === 'function') {
            window.gtag('event', eventName, params || {});
        }

        // Meta Pixel
        if (typeof window.fbq === 'function') {
            window.fbq('trackCustom', eventName, params || {});
        }
    }

    // Expose globally for form.js to use
    window.zentTrackEvent = trackEvent;

    function setupEventTracking() {
        // Track CTA clicks
        document.querySelectorAll('.btn-primary, .btn-white, .btn-outline').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var label = this.textContent.trim();
                var section = this.closest('section');
                var sectionId = section ? (section.id || section.className.split(' ')[0]) : 'unknown';
                trackEvent('cta_click', { button_text: label, section: sectionId });
            });
        });

        // Track pricing plan clicks
        document.querySelectorAll('.pricing-card .btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var card = this.closest('.pricing-card');
                var planName = card ? card.querySelector('h3').textContent.trim() : 'unknown';
                trackEvent('plan_selected', { plan: planName });

                // Meta Pixel Lead event
                if (typeof window.fbq === 'function') {
                    window.fbq('track', 'Lead', { content_name: planName });
                }
            });
        });

        // Track scroll depth
        var scrollThresholds = [25, 50, 75, 100];
        var triggeredThresholds = {};

        window.addEventListener('scroll', function () {
            var scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );

            scrollThresholds.forEach(function (threshold) {
                if (scrollPercent >= threshold && !triggeredThresholds[threshold]) {
                    triggeredThresholds[threshold] = true;
                    trackEvent('scroll_depth', { percent: threshold });
                }
            });
        }, { passive: true });

        // Track tab changes
        document.querySelectorAll('.tab-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var tabName = this.textContent.trim();
                trackEvent('feature_tab_click', { tab: tabName });
            });
        });
    }

    // --- Initialize on consent ---
    function initAnalytics() {
        if (analyticsLoaded) return;
        analyticsLoaded = true;

        captureUTM();
        loadGA4();
        loadMetaPixel();

        // Wait for scripts to load, then set up tracking
        setTimeout(setupEventTracking, 500);
    }

    // Listen for consent
    window.addEventListener('consentGranted', initAnalytics);

    // Always capture UTM (no PII)
    document.addEventListener('DOMContentLoaded', captureUTM);
})();
