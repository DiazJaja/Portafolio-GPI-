// ==================== CONFIGURACIÓN ====================
const VISIBLE_TAGS = 3;

// ==================== CARRUSEL DE PROYECTOS ====================
let currentSlide = 0;
let slides = [];
let indicators = [];
let totalSlides = 0;

function initProjectsCarousel() {
    slides = document.querySelectorAll('.project-card');
    indicators = document.querySelectorAll('#carouselIndicators .indicator');
    totalSlides = slides.length;
    
    if (totalSlides === 0) return;
    
    updateCarousel();
    initTechStacks();
}

function updateCarousel() {
    const track = document.getElementById('carouselTrack');
    if (!track) return;
    
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

function moveCarousel(direction) {
    if (totalSlides === 0) return;
    
    currentSlide += direction;
    
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    else if (currentSlide >= totalSlides) currentSlide = 0;
    
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

// ==================== TECH STACK EXPANDIBLE ====================

const techStackData = {
    0: { expanded: false, totalTags: 6 },
    1: { expanded: false, totalTags: 7 },
    2: { expanded: false, totalTags: 6 }
};

function initTechStacks() {
    document.querySelectorAll('.tech-stack-compact').forEach(wrapper => {
        const projectIndex = parseInt(wrapper.dataset.project);
        
        if (!techStackData[projectIndex]) return;
        
        const totalTags = techStackData[projectIndex].totalTags;
        const expandBtn = wrapper.querySelector('.tech-expand-btn');
        
        if (expandBtn) {
            if (totalTags <= VISIBLE_TAGS) {
                expandBtn.classList.add('hidden');
            } else {
                expandBtn.classList.remove('hidden');
            }
        }
    });
}

// ==================== CONTROL DEL BOTÓN DEL FOOTER ====================

function updateFooterExpandButton() {
    // Verificar si AL MENOS UN proyecto está expandido
    const anyExpanded = Object.values(techStackData).some(data => data.expanded);
    
    // Buscar el botón flotante del footer (solo en la pantalla activa)
    const activeScreen = document.querySelector('.screen--active');
    const footerBtn = activeScreen ? activeScreen.querySelector('.footer-float-btn') : document.querySelector('.footer-float-btn');
    
    if (!footerBtn) {
        console.warn('No se encontró el botón .footer-float-btn');
        return;
    }
    
    if (anyExpanded) {
        // OCULTAR: Usar la clase CSS que ya existe
        footerBtn.classList.add('footer-float-btn--hidden');
    } else {
        // MOSTRAR
        footerBtn.classList.remove('footer-float-btn--hidden');
    }
}

function toggleTechExpand(projectIndex) {
    const compact = document.getElementById(`techCompact-${projectIndex}`);
    const expanded = document.getElementById(`techExpanded-${projectIndex}`);
    
    if (!compact || !expanded) {
        console.error(`No se encontraron elementos para el proyecto ${projectIndex}`);
        return;
    }
    
    const isExpanded = techStackData[projectIndex].expanded;
    techStackData[projectIndex].expanded = !isExpanded;
    
    // Actualizar visibilidad del botón del footer
    updateFooterExpandButton();
    
    if (!isExpanded) {
        // EXPANDIR
        compact.style.opacity = '0';
        compact.style.transition = 'opacity 0.2s ease';
        
        setTimeout(() => {
            compact.style.display = 'none';
            expanded.style.display = 'block';
            
            requestAnimationFrame(() => {
                expanded.classList.add('show');
            });
        }, 200);
        
    } else {
        // CONTRAER
        expanded.classList.remove('show');
        
        setTimeout(() => {
            expanded.style.display = 'none';
            compact.style.display = 'flex';
            compact.style.opacity = '0';
            
            requestAnimationFrame(() => {
                compact.style.transition = 'opacity 0.25s ease';
                compact.style.opacity = '1';
            });
        }, 350);
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initProjectsCarousel();
        updateFooterExpandButton(); // Estado inicial
    });
} else {
    initProjectsCarousel();
    updateFooterExpandButton(); // Estado inicial
}

// Exportar funciones globales
window.moveCarousel = moveCarousel;
window.goToSlide = goToSlide;
window.toggleTechExpand = toggleTechExpand;