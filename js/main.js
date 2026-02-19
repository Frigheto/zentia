document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-active');
            });
        });
    }

    // Header scroll effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    // Features Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const featurePanels = document.querySelectorAll('.feature-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            featurePanels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');

            const targetId = btn.getAttribute('data-target');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Horizontal Sliding Carousel with Auto-Play
    const cardsTrack = document.querySelector('.cards-track');
    const cardsStack = document.querySelector('.cards-stack');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    if (cardsTrack && prevBtn && nextBtn && cardsStack) {
        const cards = Array.from(cardsTrack.querySelectorAll('.photo-card'));
        const totalCards = cards.length;
        let currentIndex = 0;
        const GAP = 16;

        function getCardWidth() {
            return cards[0] ? cards[0].offsetWidth : 200;
        }

        function getVisibleCount() {
            const trackWidth = cardsStack.clientWidth - 128;
            return Math.max(1, Math.floor(trackWidth / (getCardWidth() + GAP)));
        }

        function updateCarousel() {
            const cardW = getCardWidth();
            const maxIndex = Math.max(0, totalCards - getVisibleCount());
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            const offset = currentIndex * (cardW + GAP);
            cardsTrack.style.transform = 'translateX(-' + offset + 'px)';

            prevBtn.style.opacity = currentIndex === 0 ? '0.4' : '1';
            nextBtn.style.opacity = currentIndex >= maxIndex ? '0.4' : '1';
        }

        // Auto-play lento — avança 1 card a cada 3s, com loop infinito
        let autoTimer = null;

        function startAutoPlay() {
            stopAutoPlay();
            autoTimer = setInterval(() => {
                const maxIndex = Math.max(0, totalCards - getVisibleCount());
                currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
                updateCarousel();
            }, 3000);
        }

        function stopAutoPlay() {
            if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
        }

        function pauseThenResume() {
            stopAutoPlay();
            setTimeout(startAutoPlay, 5000);
        }

        nextBtn.addEventListener('click', () => {
            const maxIndex = Math.max(0, totalCards - getVisibleCount());
            currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
            updateCarousel();
            pauseThenResume();
        });

        prevBtn.addEventListener('click', () => {
            const maxIndex = Math.max(0, totalCards - getVisibleCount());
            currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
            updateCarousel();
            pauseThenResume();
        });

        // Touch/swipe support
        let touchStartX = 0;
        cardsStack.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        cardsStack.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) {
                const maxIndex = Math.max(0, totalCards - getVisibleCount());
                if (diff > 0) { currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1; }
                else { currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1; }
                updateCarousel();
                pauseThenResume();
            }
        }, { passive: true });

        // Pausa ao passar o mouse sobre o carrossel
        cardsStack.addEventListener('mouseenter', stopAutoPlay);
        cardsStack.addEventListener('mouseleave', startAutoPlay);

        window.addEventListener('resize', updateCarousel, { passive: true });
        updateCarousel();
        startAutoPlay();
    }

    // Button Ripple Effect
    document.querySelectorAll('.btn, .plan-cta').forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            setTimeout(() => ripple.remove(), 600);
        });
    });
});
