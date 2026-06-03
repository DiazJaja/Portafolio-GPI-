let isListening = false;
let recognition = null;
let isAiraOpen = false;
let synth = window.speechSynthesis;
let selectedVoiceEs = null;
let selectedVoiceEn = null;

// ============================================
// CARGA DE VOCES FEMENINAS - Forzado
// ============================================

function loadVoices() {
    const voices = synth.getVoices();
    
    // Nombres femeninos conocidos por idioma (prioridad)
    const femaleNamesEs = [
        'monica', 'paulina', 'sabina', 'helena', 'carmen', 'isabela', 
        'soledad', 'teresa', 'victoria', 'laura', 'ines', 'alba',
        'google español', 'microsoft sabina', 'microsoft helena'
    ];
    
    const femaleNamesEn = [
        'samantha', 'karen', 'tessa', 'moira', 'fiona', 'victoria', 
        'zira', 'hazel', 'susan', 'catherine', 'jenny', 'ava',
        'microsoft zira', 'microsoft hazel', 'google us english',
        'google uk english female', 'english united states'
    ];
    
    // Buscar voz femenina en español
    selectedVoiceEs = voices.find(v => {
        const name = v.name.toLowerCase();
        return femaleNamesEs.some(f => name.includes(f)) && (v.lang.startsWith('es') || v.lang.startsWith('es-'));
    });
    
    // Si no hay femenina, buscar cualquiera en español
    if (!selectedVoiceEs) {
        selectedVoiceEs = voices.find(v => v.lang.startsWith('es') || v.lang.startsWith('es-'));
    }
    
    // Buscar voz femenina en inglés
    selectedVoiceEn = voices.find(v => {
        const name = v.name.toLowerCase();
        return femaleNamesEn.some(f => name.includes(f)) && (v.lang.startsWith('en') || v.lang.startsWith('en-'));
    });
    
    // Si no hay femenina, buscar cualquiera en inglés
    if (!selectedVoiceEn) {
        selectedVoiceEn = voices.find(v => v.lang.startsWith('en') || v.lang.startsWith('en-'));
    }
    
    console.log('🎙️ Voz ES:', selectedVoiceEs?.name || 'NO ENCONTRADA');
    console.log('🎙️ Voz EN:', selectedVoiceEn?.name || 'NO ENCONTRADA');
    
    // Log de todas las voces disponibles para debug
    console.log('📋 Todas las voces:');
    voices.forEach(v => console.log(`  - ${v.name} (${v.lang})`));
}

if (synth) {
    loadVoices();
    synth.onvoiceschanged = loadVoices;
}

// ============================================
// VOZ - Solo femenina
// ============================================

function speak(text) {
    if (!synth) return;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const lang = getCurrentLang();
    
    utterance.lang = lang === 'es' ? 'es-SV' : 'en-US';
    utterance.rate = lang === 'es' ? 1.0 : 0.95;
    utterance.pitch = 1.15; // Un poco más agudo para sonar más femenino
    utterance.volume = 1.0;
    
    // Forzar voz seleccionada
    const voice = lang === 'es' ? selectedVoiceEs : selectedVoiceEn;
    if (voice) {
        utterance.voice = voice;
        console.log('🗣️ Hablando con:', voice.name);
    } else {
        console.warn('⚠️ No hay voz femenina disponible para', lang);
    }

    synth.speak(utterance);
}

// ============================================
// TRADUCCIONES
// ============================================

function getCurrentLang() {
    if (typeof currentLang !== 'undefined') return currentLang;
    if (window.currentLang) return window.currentLang;
    return document.documentElement.lang || 'es';
}

function t(key) {
    const lang = getCurrentLang();
    
    if (typeof translations !== 'undefined' && translations[lang]?.[key]) {
        return translations[lang][key];
    }
    if (window.translations?.[lang]?.[key]) {
        return window.translations[lang][key];
    }
    
    const fallbacks = {
        es: {
            'aira.welcome': '¡Hola! Soy Aira. ¿Te ayudo con algo? Puedo mostrarte el CV, contactos, habilidades o cambiar el idioma.',
            'aira.listening': 'Te escucho...',
            'aira.online': 'En línea',
            'aira.typing': 'Un momento...',
            'aira.noVoice': 'Tu navegador no permite micrófono.',
            'aira.repeat': '¿Podrías repetirlo? No te escuché bien.',
            'aira.cvOpen': 'Abriendo tu CV...',
            'aira.langEs': 'Listo, español activado 🇸🇻',
            'aira.langEn': 'Done, English enabled 🇺🇸',
            'aira.goodbye': '¡Nos vemos! 👋',
            'aira.default': 'Mmm, no entendí bien. Prueba con: CV, contactos, habilidades o cambiar idioma.',
            'aira.about': 'Juan Carlos es desarrollador front-end de El Salvador. Trabaja con React, Vue, HTML, CSS y JavaScript. ¡Y yo soy su asistente Aira!',
            'aira.skills': 'Juan Carlos domina: HTML5, CSS3, JavaScript (ES6+), React.js, Vue.js, Bootstrap, Tailwind, Git, GitHub, Laravel, PHP, Node.js, Express, MongoDB y MySQL.',
            'aira.contact': '📧 MachiNoNezumi2026@gmail.com<br>💼 linkedin.com/in/juan-carlos-díaz-quintanilla-5609b73a9/<br>🐙 github.com/DiazJaja<br>📱 +503 7513 6613',
            'aira.navContact': 'Aquí tienes los contactos 📇',
            'aira.navSkills': 'Estas son sus habilidades 💻',
            'aira.thanks': '¡De nada! 😊',
            'aira.hello': '¡Hola! ¿En qué te ayudo?'
        },
        en: {
            'aira.welcome': "Hi! I'm Aira. Need help? I can show you the CV, contacts, skills, or change language.",
            'aira.listening': "I'm listening...",
            'aira.online': 'Online',
            'aira.typing': 'One moment...',
            'aira.noVoice': "Your browser doesn't support microphone.",
            'aira.repeat': "Could you repeat that? I didn't catch it.",
            'aira.cvOpen': 'Opening your resume...',
            'aira.langEs': 'Listo, español activado 🇸🇻',
            'aira.langEn': 'Done, English enabled 🇺🇸',
            'aira.goodbye': 'See you! 👋',
            'aira.default': "Hmm, I didn't get that. Try: CV, contacts, skills, or change language.",
            'aira.about': "Juan Carlos is a front-end developer from El Salvador. He works with React, Vue, HTML, CSS and JavaScript. And I'm his assistant Aira!",
            'aira.skills': "Juan Carlos masters: HTML5, CSS3, JavaScript (ES6+), React.js, Vue.js, Bootstrap, Tailwind, Git, GitHub, Laravel, PHP, Node.js, Express, MongoDB and MySQL.",
            'aira.contact': '📧 MachiNoNezumi2026@gmail.com<br>💼 linkedin.com/in/juan-carlos-díaz-quintanilla-5609b73a9/<br>🐙 github.com/DiazJaja<br>📱 +503 7513 6613',
            'aira.navContact': "Here's the contact info 📇",
            'aira.navSkills': 'Here are his skills 💻',
            'aira.thanks': "You're welcome! 😊",
            'aira.hello': 'Hi there! How can I help?'
        }
    };
    
    return fallbacks[lang]?.[key] || key;
}

// ============================================
// INTENCIONES
// ============================================

function detectIntent(text) {
    const t = text.toLowerCase().trim();
    const lang = getCurrentLang();
    
    if (lang === 'es') {
        if (/cv|currículum|curriculum|resume|hoja de vida|portafolio|portfolio|experiencia laboral|trabajos|proyectos/.test(t)) return 'cv';
        if (/idioma|lenguaje|traducir|translate|cambiar idioma|change language|español|inglés|english|spanish/.test(t)) return 'language';
        if (/contacto|contact|email|correo|whatsapp|teléfono|llamar|escribir|redes|linkedin|github|mensaje|escríbele|comunicar/.test(t)) return 'contact';
        if (/habilidad|skill|tecnología|technology|stack|qué sabes|experiencia|conocimientos|tech|tecnologías|herramientas|lenguajes|frameworks|qué usa|domina|maneja|programa/.test(t)) return 'skills';
        if (/sobre|about|quién eres|quién es|presentate|presentación|cuéntame|biografía|perfil|qué hace|a qué se dedica|desarrollador/.test(t)) return 'about';
        if (/cerrar|close|adiós|bye|hasta luego|chao|goodbye|nos vemos|salir|irme|me voy|terminar|gracias|eso es todo|nada más/.test(t)) return 'close';
        if (/hola|buenos|buenas|hey|qué tal|saludos/.test(t)) return 'hello';
        if (/gracias|thank|thanks/.test(t)) return 'thanks';
    } else {
        if (/cv|resume|curriculum|portfolio|work history|job experience|professional|show cv|my cv|open cv|view cv/.test(t)) return 'cv';
        if (/language|translate|change language|switch language|spanish|english|español|inglés|speak|talk/.test(t)) return 'language';
        if (/contact|email|write|call|phone|whatsapp|reach|touch|linkedin|github|message|send|social/.test(t)) return 'contact';
        if (/skills|technologies|tech|stack|what.*know|experience|knowledge|tools|languages|frameworks|what.*uses|specialties|programming|developer/.test(t)) return 'skills';
        if (/about|who is|who are you|introduce|tell me|biography|profile|what.*do|background|developer/.test(t)) return 'about';
        if (/close|bye|goodbye|see you|exit|leave|finish|end|turn off|shut down|that.*all|i.*done/.test(t)) return 'close';
        if (/hi|hello|hey|good morning|good afternoon|what.*up/.test(t)) return 'hello';
        if (/thank|thanks/.test(t)) return 'thanks';
    }
    
    return null;
}

// ============================================
// EJECUTAR COMANDOS
// ============================================

function processCommand(text) {
    showTyping();
    
    setTimeout(() => {
        hideTyping();
        
        const intent = detectIntent(text);
        
        switch (intent) {
            case 'cv':
                addMessage(t('aira.cvOpen'), 'aira', 'friendly');
                speak(t('aira.cvOpen'));
                setTimeout(openCV, 800);
                break;
                
            case 'language':
                toggleLanguage();
                break;
                
            case 'contact':
                addMessage(t('aira.navContact'), 'aira', 'friendly');
                speak(t('aira.navContact'));
                setTimeout(() => addMessage(t('aira.contact'), 'aira', 'helpful'), 500);
                break;
                
            case 'skills':
                addMessage(t('aira.navSkills'), 'aira', 'friendly');
                speak(t('aira.navSkills'));
                setTimeout(() => addMessage(t('aira.skills'), 'aira', 'professional'), 500);
                break;
                
            case 'about':
                addMessage(t('aira.about'), 'aira', 'friendly');
                speak(t('aira.about'));
                break;
                
            case 'close':
                addMessage(t('aira.goodbye'), 'aira', 'warm');
                speak(t('aira.goodbye'));
                setTimeout(closeAira, 1500);
                break;
                
            case 'hello':
                addMessage(t('aira.hello'), 'aira', 'friendly');
                speak(t('aira.hello'));
                break;
                
            case 'thanks':
                addMessage(t('aira.thanks'), 'aira', 'happy');
                speak(t('aira.thanks'));
                break;
                
            default:
                addMessage(t('aira.default'), 'aira', 'thoughtful');
                speak(t('aira.default'));
        }
    }, 400 + Math.random() * 200);
}

// ============================================
// RECONOCIMIENTO DE VOZ
// ============================================

function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.warn('Speech recognition not supported');
        return null;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 3;
    
    const lang = getCurrentLang();
    rec.lang = lang === 'es' ? 'es-SV' : 'en-US';

    rec.onstart = () => {
        isListening = true;
        updateVoiceUI(true);
        setStatus('listening', t('aira.listening'));
        console.log('🎤 Escuchando...');
    };

    rec.onend = () => {
        isListening = false;
        updateVoiceUI(false);
        setStatus('online', t('aira.online'));
        console.log('🎤 Escucha terminada');
    };

    rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('📝 Escuchado:', transcript);
        
        addMessage(transcript, 'user');
        processCommand(transcript.toLowerCase());
    };

    rec.onerror = (event) => {
        console.error('❌ Error:', event.error);
        
        if (event.error === 'no-speech') return;
        if (event.error === 'aborted') return;
        if (event.error === 'audio-capture') {
            addMessage('Micrófono no detectado.', 'aira', 'helpful');
            return;
        }
        if (event.error === 'not-allowed') {
            addMessage('Permiso de micrófono denegado.', 'aira', 'helpful');
            return;
        }
        if (event.error === 'network') {
            addMessage('Problema de conexión. Intenta de nuevo.', 'aira', 'friendly');
            return;
        }
        
        isListening = false;
        updateVoiceUI(false);
        setStatus('online', t('aira.online'));
    };

    return rec;
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function openCV() {
    const currentLang = getCurrentLang();
    const cvFile = currentLang === 'en' ? 'assets/cv/EN.pdf' : 'assets/cv/ES.pdf';
    window.open(cvFile, '_blank');
}

function toggleLanguage() {
    const current = getCurrentLang();
    const next = current === 'es' ? 'en' : 'es';

    document.documentElement.setAttribute('lang', next);
    localStorage.setItem('lang', next);

    if (typeof currentLang !== 'undefined') currentLang = next;
    if (window.currentLang) window.currentLang = next;

    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: next } }));

    const msg = next === 'es' ? t('aira.langEs') : t('aira.langEn');
    addMessage(msg, 'aira', 'happy');
    speak(msg);

    if (recognition) {
        recognition.lang = next === 'es' ? 'es-SV' : 'en-US';
    }

    const input = document.getElementById('aira-chat-input');
    if (input) {
        input.placeholder = next === 'es' ? 'Escribe tu mensaje...' : 'Type your message...';
    }
}

function openAira() {
    const overlay = document.getElementById('airaOverlay');
    if (!overlay) return;
    overlay.classList.add('active');
    isAiraOpen = true;

    const messagesContainer = document.getElementById('aira-chat-messages');
    if (messagesContainer && messagesContainer.children.length === 0) {
        setTimeout(() => {
            const welcomeMsg = t('aira.welcome');
            addMessage(welcomeMsg, 'aira', 'friendly');
            speak(welcomeMsg);
        }, 300);
    }

    const input = document.getElementById('aira-chat-input');
    if (input) input.focus();
}

function closeAira(event) {
    if (event && event.target && event.target.id === 'airaOverlay') {
        document.getElementById('airaOverlay').classList.remove('active');
        isAiraOpen = false;
        if (isListening && recognition) {
            try { recognition.stop(); } catch (e) {}
        }
        return;
    }

    const overlay = document.getElementById('airaOverlay');
    if (overlay) overlay.classList.remove('active');
    isAiraOpen = false;
    if (isListening && recognition) {
        try { recognition.stop(); } catch (e) {}
    }
}

function toggleVoice() {
    if (!recognition) {
        recognition = initSpeechRecognition();
    }

    if (!recognition) {
        addMessage(t('aira.noVoice'), 'aira', 'helpful');
        speak(t('aira.noVoice'));
        return;
    }

    if (isListening) {
        try { recognition.stop(); } catch (e) {}
    } else {
        recognition.lang = getCurrentLang() === 'es' ? 'es-SV' : 'en-US';
        try {
            recognition.start();
        } catch (e) {
            console.error('Error al iniciar:', e);
            recognition = initSpeechRecognition();
            if (recognition) {
                setTimeout(() => {
                    try { recognition.start(); } catch (e2) {}
                }, 300);
            }
        }
    }
}

function updateVoiceUI(listening) {
    const micBtn = document.getElementById('aira-mic-btn');
    const voiceIndicator = document.getElementById('aira-voice-indicator');
    const textWrapper = document.getElementById('aira-text-wrapper');

    if (!micBtn || !voiceIndicator || !textWrapper) return;

    if (listening) {
        micBtn.classList.add('listening');
        voiceIndicator.classList.add('active');
        textWrapper.style.display = 'none';
    } else {
        micBtn.classList.remove('listening');
        voiceIndicator.classList.remove('active');
        textWrapper.style.display = 'flex';
    }
}

function setStatus(type, text) {
    const statusText = document.getElementById('aira-status-text');
    if (statusText) statusText.textContent = text;
}

function addMessage(text, sender, emotion = '') {
    const container = document.getElementById('aira-chat-messages');
    if (!container) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `aira-message ${sender} ${emotion}`;

    const bubble = document.createElement('div');
    bubble.className = 'aira-bubble';
    bubble.innerHTML = text.replace(/\n/g, '<br>');

    const time = document.createElement('span');
    time.className = 'message-time';
    time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageDiv.appendChild(bubble);
    messageDiv.appendChild(time);
    container.appendChild(messageDiv);

    container.scrollTop = container.scrollHeight;
}

function showTyping() {
    const typing = document.getElementById('aira-typing');
    if (typing) typing.style.display = 'flex';
    setStatus('typing', t('aira.typing'));
}

function hideTyping() {
    const typing = document.getElementById('aira-typing');
    if (typing) typing.style.display = 'none';
    setStatus('online', t('aira.online'));
}

function sendChatMessage() {
    const input = document.getElementById('aira-chat-input');
    if (!input) return;
    const text = input.value.trim();

    if (!text) return;

    addMessage(text, 'user');
    input.value = '';
    input.placeholder = getCurrentLang() === 'es' ? 'Escribe tu mensaje...' : 'Type your message...';
    processCommand(text.toLowerCase());
}

function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
        document.documentElement.setAttribute('lang', savedLang);
        if (typeof currentLang !== 'undefined') currentLang = savedLang;
        if (window.currentLang) window.currentLang = savedLang;
    }
    
    if (synth) {
        setTimeout(loadVoices, 300);
    }
});