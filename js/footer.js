/**
 * footer.js
 * Controla el footer desplegable
 */

const Footer = {
    activeFooter: null,
    activeBtn: null,

    init() {
        this.bindEvents();
    },

    bindEvents() {
        document.addEventListener('click', (e) => {
            const floatBtn = e.target.closest('.footer-float-btn');
            const footer = e.target.closest('.main-footer');

            // Click en botón flotante -> toggle footer
            if (floatBtn) {
                e.stopPropagation();
                this.toggle(floatBtn);
                return;
            }

            // Click fuera del footer -> cerrar
            if (!footer && this.activeFooter) {
                this.closeAll();
            }
        });
    },

    toggle(floatBtn) {
        // Encontrar el footer hermano (mismo padre .screen)
        const screen = floatBtn.closest('.screen');
        if (!screen) return;

        const footer = screen.querySelector('.main-footer');
        if (!footer) return;

        const isOpen = footer.classList.contains('main-footer--open');

        // Si ya está abierto, cerrarlo
        if (isOpen) {
            this.close(footer, floatBtn);
            return;
        }

        // Cerrar cualquier otro footer abierto
        this.closeAll();

        // Abrir este footer
        footer.classList.add('main-footer--open');
        floatBtn.classList.add('footer-float-btn--hidden');

        this.activeFooter = footer;
        this.activeBtn = floatBtn;
    },

    close(footer, floatBtn) {
        footer.classList.remove('main-footer--open');
        if (floatBtn) floatBtn.classList.remove('footer-float-btn--hidden');

        if (this.activeFooter === footer) {
            this.activeFooter = null;
            this.activeBtn = null;
        }
    },

    closeAll() {
        document.querySelectorAll('.main-footer--open').forEach(footer => {
            footer.classList.remove('main-footer--open');
        });
        document.querySelectorAll('.footer-float-btn').forEach(btn => {
            btn.classList.remove('footer-float-btn--hidden');
        });
        this.activeFooter = null;
        this.activeBtn = null;
    }
};

document.addEventListener('DOMContentLoaded', () => Footer.init());