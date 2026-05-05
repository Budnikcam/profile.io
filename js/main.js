/**
 * Резюме Екатерины Степенок — основной скрипт
 */
(function () {
    'use strict';

    // ==================== БУРГЕР-МЕНЮ ====================
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');

    if (burger && nav) {
        burger.addEventListener('click', function () {
            nav.classList.toggle('open');
            const spans = burger.querySelectorAll('span');
            if (nav.classList.contains('open')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });

        // Закрыть меню по клику вне его
        document.addEventListener('click', function (e) {
            if (!burger.contains(e.target) && !nav.contains(e.target)) {
                nav.classList.remove('open');
                const spans = burger.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });
    }

    // ==================== ПЛАВНЫЙ СКРОЛЛ ДЛЯ ЯКОРЕЙ ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Закрыть мобильное меню после клика
                if (nav) nav.classList.remove('open');
            }
        });
    });

    // ==================== АНИМАЦИЯ ЦИФР В БЛОКЕ БЫСТРЫХ ФАКТОВ ====================
    const factNums = document.querySelectorAll('.quick-fact__num');
    if (factNums.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumber(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });

        factNums.forEach(num => observer.observe(num));
    } else {
        // Фолбэк — просто показываем цифры
        factNums.forEach(num => {
            const final = parseInt(num.textContent) || 0;
            num.textContent = final + '+';
        });
    }

    function animateNumber(el) {
        const text = el.textContent.replace(/\+/g, '');
        const final = parseInt(text) || 0;
        const duration = 1200;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutQuad
            const eased = 1 - (1 - progress) * (1 - progress);
            el.textContent = Math.floor(eased * final) + '+';
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    // ==================== ПОДСВЕТКА АКТИВНОЙ СТРАНИЦЫ В МЕНЮ ====================
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // ==================== ЛЁГКИЙ ПАРАЛАКС ДЛЯ ФОТО (только на десктопе) ====================
    if (window.innerWidth > 768) {
        const heroPhoto = document.querySelector('.hero__photo');
        if (heroPhoto) {
            window.addEventListener('scroll', function () {
                const scrollY = window.scrollY;
                const limit = 300;
                if (scrollY <= limit) {
                    heroPhoto.style.transform = `translateY(${scrollY * 0.03}px)`;
                }
            }, { passive: true });
        }
    }

    // ==================== ОБРАБОТКА ОШИБОК ЗАГРУЗКИ ИЗОБРАЖЕНИЙ ====================
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function () {
            this.style.background = '#e8ecf0';
            this.style.minHeight = '150px';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.alt = this.alt || 'Изображение';
        });
    });

})();