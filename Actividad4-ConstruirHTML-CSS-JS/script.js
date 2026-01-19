// Estado global de la aplicación
const AppState = {
    studentData: {
        fullName: '',
        career: '',
        group: ''
    },
    activityData: {
        selectedScenario: null,
        selectedConsequence: null,
        generatedPhrase: '',
        spanishOpinion: '',
        englishOpinion: ''
    },
    completionCode: ''
};

// Configuración de carreras técnicas
const CAREERS = [
    "TÉCNICO EN ACUACULTURA",
    "TÉCNICO EN MECÁNICA NAVAL",
    "TÉCNICO EN PREPARACIÓN DE ALIMENTOS Y BEBIDAS",
    "TÉCNICO EN RECREACIONES ACUÁTICAS",
    "TÉCNICO EN REFRIGERACIÓN Y CLIMATIZACIÓN",
    "TÉCNICO LABORATORISTA AMBIENTAL"
];

// Utilidades
function safeTrim(str) {
    return (str || '').trim().replace(/\s+/g, ' ');
}

function showElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('hidden');
        element.classList.add('show', 'fade-in');
    }
}

function hideElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('fade-out');
        setTimeout(() => {
            element.classList.add('hidden');
            element.classList.remove('show', 'fade-out');
        }, 300);
    }
}

// Loading
function showLoading(message = 'Procesando...') {
    const overlay = document.getElementById('loadingOverlay');
    const messageElement = overlay?.querySelector('.loading-message');
    
    if (overlay) {
        overlay.classList.remove('hidden');
        if (messageElement) {
            messageElement.textContent = message;
        }
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

function setButtonLoading(buttonId, loading = true) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    
    if (loading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// Sistema de registro del estudiante
function initializeRegistration() {
    const careerSelect = document.getElementById('career');
    const studentForm = document.getElementById('studentForm');
    
    console.log('Inicializando registro...');
    
    if (careerSelect) {
        careerSelect.innerHTML = '<option value="">Selecciona tu carrera</option>';
        CAREERS.forEach(career => {
            const option = document.createElement('option');
            option.value = career;
            option.textContent = career;
            careerSelect.appendChild(option);
        });
    }
    
    if (studentForm) {
        studentForm.addEventListener('submit', handleRegistrationSubmit);
    }
}

function handleRegistrationSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    AppState.studentData = {
        fullName: safeTrim(formData.get('fullName')),
        career: formData.get('career'),
        group: formData.get('group')
    };
    
    // Validar datos
    if (!AppState.studentData.fullName || AppState.studentData.fullName.length < 6) {
        showFeedback('Por favor, ingresa tu nombre completo (mínimo 6 caracteres)', 'error');
        return;
    }
    
    if (!AppState.studentData.career) {
        showFeedback('Por favor, selecciona tu carrera técnica', 'error');
        return;
    }
    
    if (!AppState.studentData.group) {
        showFeedback('Por favor, selecciona tu grupo', 'error');
        return;
    }
    
    // Transición a la actividad interactiva
    hideElement('registration');
    showElement('interactiveActivity');
    initializeInteractiveActivity();
    
    console.log('Datos del estudiante registrados:', AppState.studentData);
}

// Sistema de actividad interactiva
function initializeInteractiveActivity() {
    console.log('Inicializando actividad interactiva...');
    
    // Configurar tarjetas de escenario
    const scenarioCards = document.querySelectorAll('.scenario-card');
    const sequenceCards = document.querySelectorAll('.sequence-card');
    
    scenarioCards.forEach(card => {
        card.addEventListener('click', () => selectScenario(card));
    });
    
    sequenceCards.forEach(card => {
        card.addEventListener('click', () => selectConsequence(card));
    });
    
    // Configurar botón de conexión
    const buildBtn = document.getElementById('buildConnection');
    if (buildBtn) {
        buildBtn.addEventListener('click', buildConnection);
    }
    
    console.log('Actividad interactiva inicializada');
}

function selectScenario(card) {
    // Remover selección previa
    document.querySelectorAll('.scenario-card.selected').forEach(c => {
        c.classList.remove('selected');
    });
    
    // Agregar selección actual
    card.classList.add('selected');
    
    // Actualizar estado
    AppState.activityData.selectedScenario = {
        element: card,
        text: card.querySelector('h4').textContent,
        description: card.querySelector('p').textContent
    };
    
    // Actualizar display
    document.getElementById('selectedScenario').textContent = AppState.activityData.selectedScenario.text;
    
    console.log('Escenario seleccionado:', AppState.activityData.selectedScenario);
}

function selectConsequence(card) {
    // Remover selección previa
    document.querySelectorAll('.sequence-card.selected').forEach(c => {
        c.classList.remove('selected');
    });
    
    // Agregar selección actual
    card.classList.add('selected');
    
    // Actualizar estado
    AppState.activityData.selectedConsequence = {
        element: card,
        text: card.querySelector('h4').textContent,
        description: card.querySelector('p').textContent
    };
    
    // Actualizar display
    document.getElementById('selectedConsequence').textContent = AppState.activityData.selectedConsequence.text;
    
    console.log('Consecuencia seleccionada:', AppState.activityData.selectedConsequence);
}

function buildConnection() {
    console.log('Construyendo conexión...');
    
    // Validar que ambos elementos estén seleccionados
    if (!AppState.activityData.selectedScenario || !AppState.activityData.selectedConsequence) {
        showFeedback('Por favor, selecciona una situación y una consecuencia', 'error');
        return;
    }
    
    // Mostrar loading
    showLoading('Generando conexión...');
    setButtonLoading('buildConnection', true);
    
    // Generar frase en inglés
    setTimeout(() => {
        const phrase = generateConnectionPhrase();
        AppState.activityData.generatedPhrase = phrase;
        
        // Mostrar resultado
        showConnectionResult(phrase);
        
        hideLoading();
        setButtonLoading('buildConnection', false);
        
        // Mostrar sección de opinión
        setTimeout(() => {
            showElement('opinionSection');
        }, 1000);
        
    }, 1500);
}

function generateConnectionPhrase() {
    const scenario = AppState.activityData.selectedScenario;
    const consequence = AppState.activityData.selectedConsequence;
    
    // Estructuras de frase
    const connectionTemplates = [
        `${scenario.description} ${consequence.description.toLowerCase()} because it affects our ${getImpactWord(consequence.description)}.`,
        `I believe that ${scenario.description.toLowerCase()} ${consequence.description.toLowerCase()} because it impacts our ${getImpactWord(consequence.description)}.`,
        `When we ${scenario.description.toLowerCase()}, it often leads to ${consequence.description.toLowerCase()} which ${getConsequenceEffect(consequence.description)}.`,
        `The connection between ${scenario.description.toLowerCase()} and ${consequence.description.toLowerCase()} is clear: it ${getConsequenceEffect(consequence.description)}.`
    ];
    
    // Seleccionar una frase aleatoria
    const randomIndex = Math.floor(Math.random() * connectionTemplates.length);
    return connectionTemplates[randomIndex];
}

function getImpactWord(consequence) {
    const impacts = {
        'Bajo rendimiento escolar y problemas de concentración': 'academic performance',
        'Problemas de salud': 'health',
        'Difusión de noticias falsas': 'information accuracy',
        'Mejor salud mental y más tiempo para actividades reales': 'personal wellbeing'
    };
    
    return impacts[sequence] || 'personal growth';
}

function getConsequenceEffect(consequence) {
    const effects = {
        'Bajo rendimiento escolar y problemas de concentración': 'reduces our learning ability',
        'Problemas de salud': 'harms our physical wellbeing',
        'Difusión de noticias falsas': 'spreads misinformation',
        'Mejor salud mental y más tiempo para actividades reales': 'improves our quality of life'
    };
    
    return effects[sequence] || 'shapes our decisions';
}

function showConnectionResult(phrase) {
    const resultDiv = document.getElementById('connectionResult');
    const phraseDiv = document.getElementById('connectionPhrase');
    const meaningDiv = document.getElementById('phraseMeaning');
    
    // Mostrar frase generada
    phraseDiv.textContent = phrase;
    
    // Generar significado
    const meaning = `Esta frase conecta tu elección sobre el uso de tecnología con sus consecuencias, mostrando cómo tus decisiones tecnológicas impactan diferentes aspectos de tu vida.`;
    meaningDiv.textContent = meaning;
    
    // Mostrar sección
    resultDiv.classList.remove('hidden');
    
    console.log('Frase generada:', phrase);
    console.log('Significado:', meaning);
}

// Sistema de opinión
function initializeOpinionSection() {
    const spanishOpinion = document.getElementById('spanishOpinion');
    const englishOpinion = document.getElementById('englishOpinion');
    const spanishCount = document.getElementById('spanishCharCount');
    const englishCount = document.getElementById('englishCharCount');
    const saveBtn = document.getElementById('saveOpinion');
    const reportBtn = document.getElementById('generateReport');
    const shareBtn = document.getElementById('shareResult');
    const newActivityBtn = document.getElementById('newActivity');
    
    // Eventos de conteo de caracteres
    if (spanishOpinion) {
        spanishOpinion.addEventListener('input', () => updateCharCount('spanish'));
    }
    
    if (englishOpinion) {
        englishOpinion.addEventListener('input', () => updateCharCount('english'));
    }
    
    // Eventos de botones
    if (saveBtn) {
        saveBtn.addEventListener('click', saveOpinions);
    }
    
    if (reportBtn) {
        reportBtn.addEventListener('click', generateReport);
    }
    
    if (shareBtn) {
        shareBtn.addEventListener('click', shareResult);
    }
    
    if (newActivityBtn) {
        newActivityBtn.addEventListener('click', resetActivity);
    }
}

function updateCharCount(language) {
    const countElement = language === 'spanish' ? 'spanishCharCount' : 'englishCharCount';
    const textarea = language === 'spanish' ? 'spanishOpinion' : 'englishOpinion';
    const countElement = document.getElementById(countElement);
    
    if (!textarea || !countElement) return;
    
    const text = textarea.value.trim();
    const count = text.length;
    const minChars = language === 'spanish' ? 100 : 120;
    
    countElement.textContent = count;
    
    // Actualizar estilos
    if (count < minChars) {
        countElement.classList.add('warning');
        countElement.classList.remove('success');
    } else {
        countElement.classList.add('success');
        countElement.classList.remove('warning');
    }
}

function saveOpinions() {
    const spanishText = document.getElementById('spanishOpinion').value.trim();
    const englishText = document.getElementById('englishOpinion').value.trim();
    
    // Validaciones
    if (spanishText.length < 100) {
        showFeedback('Tu opinión en español debe tener al menos 100 caracteres', 'error');
        document.getElementById('spanishOpinion').focus();
        return;
    }
    
    if (englishText.length < 120) {
        showFeedback('Your opinion in English must have at least 120 characters', 'error');
        document.getElementById('englishOpinion').focus();
        return;
    }
    
    // Guardar en estado
    AppState.activityData.spanishOpinion = spanishText;
    AppState.activityData.englishOpinion = englishText;
    
    showFeedback('¡Opiniones guardadas exitosamente!', 'success');
    
    console.log('Opiniones guardadas:', {
        spanish: spanishText,
        english: englishText
    });
}

function generateReport() {
    showFeedback('Generando reporte...', 'info');
    
    // Simulación de generación de reporte
    setTimeout(() => {
        showFeedback('Reporte generado exitosamente', 'success');
    }, 1000);
}

function shareResult() {
    generateForumText();
    copyToClipboard();
}

function resetActivity() {
    if (!confirm('¿Estás seguro de que quieres iniciar una nueva actividad? Se perderá tu progreso actual.')) {
        return;
    }
    
    // Limpiar estado
    AppState.activityData = {
        selectedScenario: null,
        selectedConsequence: null,
        generatedPhrase: '',
        spanishOpinion: '',
        englishOpinion: ''
    };
    
    // Limpiar selecciones visuales
    document.querySelectorAll('.selected').forEach(element => {
        element.classList.remove('selected');
    });
    
    // Limpiar displays
    document.getElementById('selectedScenario').textContent = 'No seleccionado';
    ocultarElement('opinionSection');
    ocultarElement('finalResult');
    mostrarElement('interactiveActivity');
    
    // Limpiar formularios
    document.getElementById('spanishOpinion').value = '';
    document.getElementById('englishOpinion').value = '';
    
    // Actualizar contadores
    updateCharCount('spanish');
    updateCharCount('english');
    
    showFeedback('Actividad reiniciada', 'info');
}

function generateForumText() {
    const student = AppState.studentData;
    const activity = AppState.activityData;
    const completionCode = generateCompletionCode();
    
    const lines = [];
    lines.push('=== ACTIVIDAD CULTURA DIGITAL II ===');
    lines.push('');
    lines.push('Actividad 4: Comunicación digital responsable');
    lines.push(`Nombre: ${student.fullName}`);
    lines.push(`Carrera: ${student.career}`);
    lines.push(`Grupo: ${student.group}`);
    lines.push(`Fecha y hora: ${new Date().toLocaleString('es-MX')}`);
    lines.push(`Código: ${completionCode}`);
    lines.push('');
    lines.push('RESUMEN DE LA ACTIVIDAD:');
    lines.push(`Situación elegida: ${activity.selectedScenario ? activity.selectedScenario.text : 'No especificado'}`);
    lines.push(`Consecuencia: ${activity.selectedConsequence ? activity.selectedConsequence.text : 'No especificada'}`);
    lines.push(`Frase generada: ${activity.generatedPhrase}`);
    lines.push('');
    lines.push('OPINIÓN DEL ESTUDIANTE:');
    lines.push(`🇪🇸 En español:`);
    lines.push(activity.spanishOpinion || 'No especificado');
    lines.push('');
    lines.push(`🇬🇧 In English:`);
    lines.push(activity.englishOpinion || 'No especificado');
    lines.push('');
    lines.push('=== FIN DE ACTIVIDAD ===');
    
    const forumText = lines.join('\n');
    
    // Actualizar el texto en la interfaz
    document.getElementById('forumText').textContent = forumText;
    
    return forumText;
}

// Código único de terminación
function generateCompletionCode() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    const studentHash = btoa(AppState.studentData.fullName + AppState.studentData.career + AppState.studentData.group)
        .replace(/[^a-zA-Z0-9]/g, '')
        .substring(0, 8)
        .toUpperCase();
    
    return `CD4-CDR-${studentHash}-${timestamp}-${random}`;
}

// Copiar al portapapeles
function copyToClipboard() {
    const forumText = generateForumText();
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(forumText)
            .then(() => {
                showFeedback('Texto copiado. Pégalo en el foro: "Digital responsibility opinion"', 'success');
            })
            .catch(err => {
                console.error('Error al copiar:', err);
                fallbackCopy(forumText);
            });
    } else {
        fallbackCopy(forumText);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showFeedback('Texto copiado. Pégalo en el foro: "Digital responsibility opinion"', 'success');
    } catch (err) {
        showFeedback('No se pudo copiar. Selecciona y copia manualmente.', 'error');
    }
    
    document.body.removeChild(textarea);
}

// Sistema de feedback
function showFeedback(message, type = 'info') {
    // Eliminar feedback existente
    const existingFeedback = document.querySelector('.feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // Crear nuevo elemento de feedback
    const feedback = document.createElement('div');
    feedback.className = `feedback ${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #5a7a4f, #4a5f3f)' : 'linear-gradient(135deg, #8b3a3a, #6b2f2f)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 600;
        max-width: 300px;
        animation: slideInRight 0.5s ease-out;
    `;
    
    document.body.appendChild(feedback);
    
    // Auto-remover
    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 500);
    }, 3000);
}

// Sistema de resultado final
function showFinalResult() {
    console.log('Mostrando resultado final...');
    
    showLoading('Generando resultado final...');
    
    setTimeout(() => {
        // Actualizar resumen
        updateFinalResult();
        
        hideLoading();
        
        // Mostrar sección final
        ocultarElement('opinionSection');
        mostrarElement('finalResult');
        
        console.log('Resultado final mostrado');
    }, 1500);
}

function updateFinalResult() {
    const student = AppState.studentData;
    const activity = AppState.activityData;
    
    // Actualizar resumen del estudiante
    document.getElementById('resultName').textContent = student.fullName;
    document.getElementById('resultCareer').textContent = student.career;
    document.getElementById('resultGroup').textContent = student.group;
    document.getElementById('resultDate').textContent = new Date().toLocaleString('es-MX');
    
    // Actualizar resumen de la actividad
    document.getElementById('resultScenario').textContent = activity.selectedScenario ? activity.selectedScenario.text : 'No especificado';
    document.getElementById('resultConsequence').textContent = activity.selectedConsequence ? activity.selectedConsequence.text : 'No especificado';
    document.getElementById('resultPhrase').textContent = activity.generatedPhrase;
    
    // Actualizar opiniones
    document.getElementById('resultSpanish').textContent = activity.spanishOpinion || 'No especificado';
    document.getElementById('resultEnglish').textContent = activity.activityData.englishOpinion || 'No especificado';
    
    // Generar código único
    AppState.completionCode = generateCompletionCode();
    
    // Actualizar texto para el foro
    generateForumText();
    
    console.log('Resultado final actualizado');
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando Actividad 4...');
    
    // Establecer año dinámico en footer
    const footerYear = document.getElementById('footerYear');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }
    
    // Inicializar componentes
    initializeRegistration();
    
    // Mostrar sección de introducción por defecto
    mostrarElement('introduction');
    
    console.log('Actividad 4 inicializada completamente');
});