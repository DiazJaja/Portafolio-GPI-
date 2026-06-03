/**
 * navigation.js
 * Controla la navegación entre pantallas
 */

const Navigation = {
    screens: {},
    currentScreen: 'home',

    init() {
        this.screens = {
            home: document.getElementById('screen-home'),
            transition: document.getElementById('screen-transition'),
            about: document.getElementById('screen-about'),
            projects: document.getElementById('screen-projects'),
            nexo: document.getElementById('screen-nexo')
        };

        this.bindEvents();
    },

    bindEvents() {
        // Click en pantalla de inicio
        const homeContent = this.screens.home?.querySelector('.home__content');
        if (homeContent) {
            homeContent.addEventListener('click', () => this.goToTransition());
            homeContent.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.goToTransition();
                }
            });
        }

        // Navegación
        document.body.addEventListener('click', (e) => {
            const link = e.target.closest('.nav__link');
            if (!link) return;

            e.preventDefault();
            const href = link.getAttribute('href');
            if (!href) return;

            const target = href.replace('#', '');

            switch(target) {
                case 'screen-home':
                    this.goToHome();
                    break;
                case 'screen-about':
                    this.goToAbout();
                    break;
                case 'screen-projects':
                    this.goToProjects();
                    break;
                case 'screen-nexo':
                    this.goToNexo();
                    break;
            }
        });
    },

    goToTransition() {
        this.switchScreen('home', 'transition');
        setTimeout(() => {
            if (this.currentScreen === 'transition') {
                this.goToAbout();
            }
        }, 3500);
    },

    goToAbout() {
        this.switchScreen(this.currentScreen, 'about');
    },

    goToProjects() {
        this.switchScreen(this.currentScreen, 'projects');
    },

    goToNexo() {
        this.switchScreen(this.currentScreen, 'nexo');
    },

    goToHome() {
        this.switchScreen(this.currentScreen, 'home');
    },

    switchScreen(fromName, toName) {
        const from = this.screens[fromName];
        const to = this.screens[toName];

        if (!from || !to || from === to) return;

        // Cerrar menús y footers antes de cambiar
        if (typeof Menu !== 'undefined' && Menu.closeAll) Menu.closeAll();
        if (typeof Footer !== 'undefined' && Footer.closeAll) Footer.closeAll();

        // Ocultar origen
        from.classList.remove('screen--active');
        from.classList.add('screen--hidden');
        from.setAttribute('aria-hidden', 'true');

        // Mostrar destino
        to.classList.remove('screen--hidden');
        to.classList.add('screen--active');
        to.setAttribute('aria-hidden', 'false');

        this.currentScreen = toName;

        // Actualizar nav activa
        this.updateActiveNav(toName);

        // Animaciones
        if (toName === 'about') {
            this.animateAboutEntrance();
        } else if (toName === 'projects') {
            this.animateProjectsEntrance();
        } else if (toName === 'nexo') {
            this.animateNexoEntrance();
        }
    },

    updateActiveNav(screenId) {
        document.querySelectorAll('.nav__link').forEach(link => {
            link.classList.remove('nav__link--active');
        });

        const targetHref = `#screen-${screenId}`;
        document.querySelectorAll(`.nav__link[href="${targetHref}"]`).forEach(link => {
            link.classList.add('nav__link--active');
        });
    },

    animateAboutEntrance() {
        const profile = document.querySelector('.screen--active .profile-card');
        const nav = document.querySelector('.screen--active .main-nav');

        if (profile) {
            profile.classList.remove('animate-fadeInUp');
            void profile.offsetWidth;
            profile.classList.add('animate-fadeInUp');
        }
        if (nav) {
            nav.classList.remove('animate-slideInRight');
            void nav.offsetWidth;
            nav.classList.add('animate-slideInRight');
        }
    },

    animateProjectsEntrance() {
        const header = document.querySelector('.screen--active .projects__header');
        const carousel = document.querySelector('.screen--active .projects__carousel');
        const indicators = document.querySelector('.screen--active .carousel__indicators');

        [header, carousel, indicators].forEach(el => {
            if (el) {
                el.style.animation = 'none';
                void el.offsetWidth;
                el.style.animation = '';
            }
        });
    },

    animateNexoEntrance() {
        const hero = document.querySelector('.screen--active .nexo__hero');
        const cards = document.querySelectorAll('.screen--active .nexo__card');
        const social = document.querySelector('.screen--active .nexo__social-section');

        if (hero) {
            hero.classList.remove('animate-fadeInUp');
            void hero.offsetWidth;
            hero.classList.add('animate-fadeInUp');
        }

        cards.forEach((card, index) => {
            card.style.animation = 'none';
            void card.offsetWidth;
            card.style.animation = `animate-fadeInUp 0.5s ease ${index * 0.15}s both`;
        });

        if (social) {
            social.style.animation = 'none';
            void social.offsetWidth;
            social.style.animation = 'animate-fadeInUp 0.6s ease 0.4s both';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => Navigation.init());