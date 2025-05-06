// scripts.js — Основні скрипти для сайту Кіберзнайко
// ---
// Структура:
// 1. Мобільне меню: відкриття/закриття, aria-атрибути, блокування скролу
// 2. Плавний скролл до якоря з урахуванням фіксованого хедера
// 3. Анімації появи карток (IntersectionObserver)
// 4. Доступність кнопок (role, tabindex)
// 5. Перемикання темної/світлої теми (media query)
// 6. Додавання класу .scrolled до хедера при прокрутці
// ---
// Кожен блок нижче має детальний коментар.

document.addEventListener('DOMContentLoaded', function() {
    // Мобільне меню
    // Відкриття/закриття мобільного меню, встановлення aria-атрибутів та блокування скролу
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const primaryMenu = document.querySelector('.primary-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !expanded);
            
            // Плавна анімація появи меню
            if (!expanded) {
                document.body.style.overflow = 'hidden'; // Заборона прокрутки
            } else {
                document.body.style.overflow = ''; // Відновлення прокрутки
            }
        });
        
        // Закриття меню при кліку поза ним
        document.addEventListener('click', function(event) {
            if (primaryMenu && mobileMenuToggle.getAttribute('aria-expanded') === 'true') {
                if (!primaryMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                    mobileMenuToggle.setAttribute('aria-expanded', false);
                    document.body.style.overflow = '';
                }
            }
        });
    }

    // Плавний скрол до якоря
    // Реалізація плавного скролу до якоря з урахуванням фіксованого хедера
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Якщо мобільне меню відкрито, закриємо його
                if (mobileMenuToggle && mobileMenuToggle.getAttribute('aria-expanded') === 'true') {
                    mobileMenuToggle.setAttribute('aria-expanded', false);
                    document.body.style.overflow = '';
                }
            }
        });
    });

    // Анімації появи карток
    // Реалізація анімацій появи карток за допомогою IntersectionObserver
    const animateElements = document.querySelectorAll('.age-category-card, .activity-card, .resource-card, .modern-card');
    
    if (animateElements.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animateElements.forEach(element => {
            element.classList.add('fade-in');
            observer.observe(element);
        });
    }

    // Доступність кнопок
    // Додавання атрибутів доступності до інтерактивних елементів
    document.querySelectorAll('.btn').forEach(btn => {
        if (!btn.getAttribute('role')) {
            btn.setAttribute('role', 'button');
        }
        if (!btn.getAttribute('tabindex') && btn.tagName !== 'BUTTON' && btn.tagName !== 'A') {
            btn.setAttribute('tabindex', '0');
        }
    });

    // Перемикання темної/світлої теми
    // Перевірка режиму (світлий/темний) та встановлення атрибуту для CSS
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDarkMode ? 'dark' : 'light');
    
    // Слухач зміни режиму
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    });

    // Додавання перевірки на вподобання щодо зменшеного руху
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.setAttribute('data-reduced-motion', prefersReducedMotion);
});

// Додавання класу під час прокрутки для зміни вигляду шапки
// Реалізація додавання класу .scrolled до хедера при прокрутці
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});