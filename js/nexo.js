/**
 * nexo.js
 * Funcionalidades de la pantalla Nexo
 */

const Nexo = {
    init() {
        this.bindArticleCards();
        this.bindFormSubmit();
    },

    bindArticleCards() {
        const cards = document.querySelectorAll('.nexo__article-card');
        const countLabel = document.querySelector('.nexo__articles-count');

        cards.forEach(card => {
            card.addEventListener('click', () => {
                const isExpanded = card.classList.contains('nexo__article-card--expanded');

                if (isExpanded) {
                    this.collapseAll(cards, countLabel);
                } else {
                    cards.forEach(c => {
                        if (c === card) {
                            c.classList.remove('nexo__article-card--hidden');
                            c.classList.add('nexo__article-card--expanded');
                        } else {
                            c.classList.add('nexo__article-card--hidden');
                            c.classList.remove('nexo__article-card--expanded');
                        }
                    });

                    if (countLabel) {
                        countLabel.classList.add('nexo__articles-count--hidden');
                    }
                }
            });
        });
    },

    collapseAll(cards, countLabel) {
        cards.forEach(c => {
            c.classList.remove('nexo__article-card--expanded');
            c.classList.remove('nexo__article-card--hidden');
        });

        if (countLabel) {
            countLabel.classList.remove('nexo__articles-count--hidden');
        }
    },

    bindFormSubmit() {
        const form = document.querySelector('#screen-nexo form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            const btn = form.querySelector('.nexo__btn-submit');
            const lang = Translations.currentLang;
            const t = Translations[lang];
            const originalText = btn.innerHTML;

            // Estado de envío traducido
            btn.innerHTML = `<i class="bi bi-hourglass-split"></i> ${t['nexo.form.enviando']}`;
            btn.disabled = true;

            setTimeout(() => {
                form.reset();

                // Éxito traducido
                btn.innerHTML = `<i class="bi bi-check-circle"></i> ${t['nexo.form.exito']}`;
                btn.style.background = '#10b981';

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    },

    showNotification(title, message, type = 'info') {
        const existing = document.querySelector('.nexo__notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `nexo__notification nexo__notification--${type}`;
        notification.innerHTML = `
            <div class="nexo__notification-content">
                <strong>${title}</strong>
                <p>${message}</p>
            </div>
            <button class="nexo__notification-close" onclick="this.parentElement.remove()">
                <i class="bi bi-x-lg"></i>
            </button>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
};

document.addEventListener('DOMContentLoaded', () => Nexo.init());