/**
 * main.js
 * Punto de entrada - Inicializa todos los módulos
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todos los módulos
    Navigation.init();
    MenuCircle.init();
    AboutModal.init();
    Footer.init();
    Translations.init();  // ← NUEVO
    
    // Restaurar tema guardado
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // Precargar imágenes críticas
    const criticalImages = [
        'assets/images/logo.png',
        'assets/images/profile.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    console.log('🎯 Portafolio de Juan Carlos inicializado correctamente');
});