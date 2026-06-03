/**
 * modal.js
 * Controla el modal rojo de "Sobre Mí"
 * Toggle al hacer click en la tarjeta de perfil
 */

const AboutModal = {
    trigger: null,
    modal: null,
    info: null,
    wrapper: null,
    isOpen: false,

    init() {
        this.trigger = document.getElementById('profile-trigger');
        this.modal = document.getElementById('about-modal');
        this.info = document.querySelector('.about__info');
        this.wrapper = document.querySelector('.about__wrapper');

        if (!this.trigger || !this.modal) {
            console.warn('Modal elements not found');
            return;
        }

        this.bindEvents();
    },

    bindEvents() {
        // Click en la tarjeta completa -> toggle modal
        this.trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        // Click dentro del modal -> no cerrar (propagación)
        this.modal.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    },

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    },

    open() {
        this.isOpen = true;

        // Mostrar el contenedor info primero
        this.info.classList.add('about__info--visible');
        this.wrapper.classList.add('about__wrapper--with-modal');

        // Luego animar el modal
        requestAnimationFrame(() => {
            this.modal.classList.add('about-modal--open');
            this.modal.setAttribute('aria-hidden', 'false');
        });
    },

    close() {
        this.isOpen = false;

        // Primero quitar la clase del modal
        this.modal.classList.remove('about-modal--open');
        this.modal.setAttribute('aria-hidden', 'true');

        // Esperar la transición y luego ocultar el contenedor
        setTimeout(() => {
            this.info.classList.remove('about__info--visible');
            this.wrapper.classList.remove('about__wrapper--with-modal');
        }, 400);
    }
};

document.addEventListener('DOMContentLoaded', () => AboutModal.init());