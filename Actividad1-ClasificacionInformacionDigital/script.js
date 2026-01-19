// Configuración de carreras técnicas
const CAREERS = [
    "TÉCNICO EN ACUACULTURA",
    "TÉCNICO EN MECÁNICA NAVAL",
    "TÉCNICO EN PREPARACIÓN DE ALIMENTOS Y BEBIDAS",
    "TÉCNICO EN RECREACIONES ACUÁTICAS",
    "TÉCNICO EN REFRIGERACIÓN Y CLIMATIZACIÓN",
    "TÉCNICO LABORATORISTA AMBIENTAL"
];

// Datos de ejemplo para la tabla
const SAMPLE_DATA = {
    nombre: "Juan Pérez López",
    carrera: "TÉCNICO EN MECÁNICA NAVAL",
    fecha: "15/01/2026",
    comentario: "Participación activa y trabajos entregados puntualmente"
};

// Estado global de la aplicación
const AppState = {
    studentData: {
        fullName: '',
        career: '',
        group: ''
    },
    classification: {
        texto: [],
        numero: [],
        fecha: [],
        categoria: []
    },
    isClassificationComplete: false
};

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

// Funciones de loading
function showLoading(message = 'Cargando...') {
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

// Función para manejar estados de carga en botones
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

// Transición con loading entre secciones
async function transitionWithLoading(fromSectionId, toSectionId, message = 'Procesando...') {
    showLoading(message);
    
    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 800));
    
    hideElement(fromSectionId);
    showElement(toSectionId);
    
    hideLoading();
}

function showFeedback(message, type = 'success') {
    const feedback = document.getElementById('feedback');
    if (feedback) {
        feedback.textContent = message;
        feedback.className = `feedback ${type} show`;
        
        // Auto-ocultar después de 3 segundos
        setTimeout(() => {
            feedback.classList.add('hidden');
            feedback.classList.remove('show');
        }, 3000);
    }
}

// Inicialización del formulario de registro
function initializeRegistration() {
    console.log('=== INICIANDO REGISTRO ===');
    
    const careerSelect = document.getElementById('career');
    const studentForm = document.getElementById('studentForm');
    
    console.log('Career select encontrado:', careerSelect);
    console.log('Carreras disponibles:', CAREERS);
    
    // Llenar opciones de carreras
    if (careerSelect) {
        console.log('Limpiando select y agregando opciones...');
        
        // Limpiar opciones existentes
        careerSelect.innerHTML = '';
        
        // Agregar opción por defecto
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Selecciona tu carrera';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        careerSelect.appendChild(defaultOption);
        
        // Agregar cada carrera
        CAREERS.forEach((career, index) => {
            const option = document.createElement('option');
            option.value = career;
            option.textContent = career;
            careerSelect.appendChild(option);
            console.log(`${index + 1}. Agregada: ${career}`);
        });
        
        console.log(`✓ Total opciones en select: ${careerSelect.options.length}`);
        
        // Verificar que las opciones están en el DOM
        setTimeout(() => {
            console.log('Verificación tardía - opciones:', careerSelect.options.length);
            for (let i = 0; i < careerSelect.options.length; i++) {
                console.log(`  Opción ${i}: ${careerSelect.options[i].textContent}`);
            }
        }, 100);
    } else {
        console.error('❌ No se encontró el elemento career');
        return;
    }
    
    // Manejar envío del formulario
    if (studentForm) {
        studentForm.addEventListener('submit', handleRegistrationSubmit);
        console.log('✓ Evento submit agregado');
    } else {
        console.error('❌ No se encontró el formulario');
    }
    
    // Agregar eventos de depuración
    if (careerSelect) {
        careerSelect.addEventListener('change', function() {
            console.log('✓ Carrera seleccionada:', this.value);
        });
        
        careerSelect.addEventListener('focus', function() {
            console.log('✓ Select enfocado');
        });
        
        careerSelect.addEventListener('click', function() {
            console.log('✓ Select clickeado. Opciones disponibles:', this.options.length);
        });
    }
    
    console.log('=== REGISTRO INICIALIZADO ===');
}

function handleRegistrationSubmit(event) {
    event.preventDefault();
    
    console.log('Formulario de registro enviado');
    
    const formData = new FormData(event.target);
    AppState.studentData = {
        fullName: safeTrim(formData.get('fullName')),
        career: formData.get('career'),
        group: formData.get('group')
    };
    
    console.log('Datos del estudiante:', AppState.studentData);
    
    // Validar datos
    if (!AppState.studentData.fullName || AppState.studentData.fullName.length < 6) {
        console.log('Error: nombre inválido');
        showFeedback('Por favor, ingresa tu nombre completo (mínimo 6 caracteres)', 'error');
        return;
    }
    
    if (!AppState.studentData.career) {
        console.log('Error: carrera no seleccionada');
        showFeedback('Por favor, selecciona tu carrera técnica', 'error');
        return;
    }
    
    if (!AppState.studentData.group) {
        console.log('Error: grupo no seleccionado');
        showFeedback('Por favor, selecciona tu grupo', 'error');
        return;
    }
    
    console.log('Validación exitosa, transicionando a clasificación...');
    
    // Transición a la actividad de clasificación
    hideElement('registration');
    showElement('classification');
    initializeDragAndDrop();
}

// Sistema de Drag and Drop
function initializeDragAndDrop() {
    const cards = document.querySelectorAll('.card-item');
    const zones = document.querySelectorAll('.zone');
    
    // Configurar tarjetas arrastrables
    cards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
    });
    
    // Configurar zonas de destino
    zones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('dragleave', handleDragLeave);
    });
    
    // Configurar botón de verificación
    const verifyBtn = document.getElementById('verifyBtn');
    if (verifyBtn) {
        verifyBtn.addEventListener('click', verifyClassification);
    }
}

let draggedElement = null;

function handleDragStart(event) {
    draggedElement = event.target;
    event.target.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', event.target.innerHTML);
}

function handleDragEnd(event) {
    event.target.classList.remove('dragging');
    
    // Limpiar todas las zonas
    const zones = document.querySelectorAll('.zone');
    zones.forEach(zone => {
        zone.classList.remove('drag-over');
    });
}

function handleDragOver(event) {
    if (event.preventDefault) {
        event.preventDefault();
    }
    
    event.dataTransfer.dropEffect = 'move';
    event.currentTarget.classList.add('drag-over');
    
    return false;
}

function handleDragLeave(event) {
    event.currentTarget.classList.remove('drag-over');
}

function handleDrop(event) {
    if (event.stopPropagation) {
        event.stopPropagation();
    }
    
    event.preventDefault();
    
    const zone = event.currentTarget;
    const zoneType = zone.dataset.zone;
    const zoneContent = zone.querySelector('.zone-content');
    
    if (draggedElement && zoneContent) {
        // Clonar el elemento y agregarlo a la zona
        const clonedCard = draggedElement.cloneNode(true);
        clonedCard.classList.remove('dragging');
        clonedCard.draggable = false; // Deshabilitar arrastre en la zona
        
        // Agregar botón de remover
        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '❌';
        removeBtn.className = 'remove-btn';
        removeBtn.style.cssText = `
            background: none;
            border: none;
            cursor: pointer;
            margin-left: 0.5rem;
            font-size: 0.8rem;
        `;
        removeBtn.addEventListener('click', () => {
            returnElementToOriginal(draggedElement, clonedCard);
        });
        
        clonedCard.appendChild(removeBtn);
        zoneContent.appendChild(clonedCard);
        
        // Ocultar el original del contenedor principal (no eliminarlo)
        draggedElement.style.display = 'none';
        draggedElement.classList.add('in-zone');
        
        // Actualizar estado
        updateClassificationState();
        
        showFeedback(`Elemento clasificado como: ${zoneType}`, 'success');
    }
    
    zone.classList.remove('drag-over');
    return false;
}

function updateClassificationState() {
    // Reiniciar estado
    AppState.classification = {
        texto: [],
        numero: [],
        fecha: [],
        categoria: []
    };
    
    // Recopilar elementos clasificados
    const zones = document.querySelectorAll('.zone');
    zones.forEach(zone => {
        const zoneType = zone.dataset.zone;
        const zoneContent = zone.querySelector('.zone-content');
        const cards = zoneContent.querySelectorAll('.card-item');
        
        cards.forEach(card => {
            const cardType = card.dataset.type;
            AppState.classification[zoneType].push({
                element: card.textContent.replace('❌', '').trim(),
                type: cardType
            });
        });
    });
    
    // Verificar si todos los elementos están clasificados
    const totalClassified = Object.values(AppState.classification)
        .reduce((total, zone) => total + zone.length, 0);
    
    AppState.isClassificationComplete = totalClassified === 10;
}

function verifyClassification() {
    try {
        // Bloquear botón inmediatamente
        const verifyBtn = document.getElementById('verifyBtn');
        if (!verifyBtn) return;
        
        // Si ya está en proceso, ignorar click
        if (verifyBtn.disabled || verifyBtn.classList.contains('loading')) {
            return;
        }
        
        // Mostrar loading y bloquear
        setButtonLoading('verifyBtn', true);
        showLoading('Verificando clasificación...');
        
        // Pequeña espera para mostrar loading
        setTimeout(() => {
            try {
                updateClassificationState();
                
                if (!AppState.isClassificationComplete) {
                    showFeedback('Por favor, clasifica todos los elementos antes de verificar', 'error');
                    setButtonLoading('verifyBtn', false);
                    hideLoading();
                    return;
                }
                
                // Limpiar errores previos
                clearIncorrectHighlights();
                
                let correctCount = 0;
                let errors = [];
                const incorrectElements = [];
                
                // Verificar cada zona
                Object.keys(AppState.classification).forEach(zoneType => {
                    AppState.classification[zoneType].forEach(item => {
                        if (item.type === zoneType) {
                            correctCount++;
                        } else {
                            errors.push(`"${item.element}" debería estar en ${item.type}, no en ${zoneType}`);
                            incorrectElements.push({
                                element: item.element,
                                currentZone: zoneType,
                                correctZone: item.type,
                                domElement: findElementInZone(item.element, zoneType)
                            });
                        }
                    });
                });
                
                // Calcular total real de elementos clasificados
                const totalClassified = Object.values(AppState.classification)
                    .reduce((total, zone) => total + zone.length, 0);
                
                // Guardar resultados en el estado
                AppState.classificationResults = {
                    correctCount,
                    totalCount: totalClassified,
                    percentage: totalClassified > 0 ? Math.round((correctCount / totalClassified) * 100) : 0,
                    errors,
                    incorrectElements
                };
                
                if (correctCount === totalClassified && totalClassified > 0) {
                    showFeedback('¡Perfecto! Todos los elementos están clasificados correctamente', 'success');
                    // Limpiar loading antes de transicionar
                    setButtonLoading('verifyBtn', false);
                    hideLoading();
                    
                    setTimeout(() => {
                        transitionToOrganization();
                    }, 1500);
                } else {
                    showFeedback(`Tienes ${totalClassified - correctCount} errores en la clasificación. Los elementos incorrectos están marcados en rojo.`, 'error');
                    highlightIncorrectElements(incorrectElements);
                    console.log('Errores:', errors);
                    setButtonLoading('verifyBtn', false);
                    hideLoading();
                }
                
            } catch (error) {
                console.error('Error durante verificación:', error);
                showFeedback('❌ Error al verificar clasificación', 'error');
                setButtonLoading('verifyBtn', false);
                hideLoading();
            }
        }, 800);
        
    } catch (error) {
        console.error('Error en verifyClassification:', error);
        setButtonLoading('verifyBtn', false);
        hideLoading();
    }
}

// Transición a la tabla de organización
function transitionToOrganization() {
    hideElement('classification');
    showElement('organization');
    populateDataTable();
    generateAnalysis();
    generateFinalResult();
    updateStudentSummary();
}

function populateDataTable() {
    const tableBody = document.querySelector('#dataTable tbody');
    if (!tableBody) return;
    
    // Crear fila con datos de ejemplo
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${AppState.studentData.fullName || SAMPLE_DATA.nombre}</td>
        <td>${AppState.studentData.career || SAMPLE_DATA.carrera}</td>
        <td>${SAMPLE_DATA.fecha}</td>
        <td>${SAMPLE_DATA.comentario}</td>
    `;
    
    tableBody.appendChild(row);
}

function generateAnalysis() {
    const analysisContent = document.getElementById('analysisContent');
    if (!analysisContent) return;
    
    const analysisHTML = `
        <div class="analysis-item">
            <h4>📊 Análisis de Datos Organizados</h4>
            <p>Cuando los datos están correctamente estructurados, podemos:</p>
            <ul>
                <li>Identificar rápidamente información relevante</li>
                <li>Realizar cálculos y comparaciones</li>
                <li>Generar reportes claros y precisos</li>
                <li>Tomar decisiones basadas en evidencia</li>
            </ul>
        </div>
        <div class="analysis-item">
            <h4>⚠️ Consecuencias de la Desorganización</h4>
            <p>Si los datos estuvieran mal organizados:</p>
            <ul>
                <li>Confusión en la interpretación</li>
                <li>Dificultad para encontrar información</li>
                <li>Riesgo de tomar decisiones incorrectas</li>
                <li>Pérdida de tiempo en correcciones</li>
            </ul>
        </div>
        <div class="analysis-item">
            <h4>✅ Beneficios de la Organización Adecuada</h4>
            <p>La clasificación correcta de tipos de datos permite:</p>
            <ul>
                <li>Procesamiento automático eficiente</li>
                <li>Validación de datos consistente</li>
                <li>Integración con sistemas digitales</li>
                <li>Mejor experiencia de usuario</li>
            </ul>
        </div>
    `;
    
    analysisContent.innerHTML = analysisHTML;
}

function generateFinalResult() {
    const resultMessage = document.getElementById('resultMessage');
    if (!resultMessage) return;
    
    const results = AppState.classificationResults || { correctCount: 0, totalCount: 12, percentage: 0 };
    const successRate = results.percentage;
    
    let message = '';
    let messageClass = '';
    
    if (successRate === 100) {
        message = '🎉 ¡Información organizada correctamente: decisiones claras!';
        messageClass = 'success';
    } else if (successRate >= 80) {
        message = '✅ Buena organización de datos: decisiones mayormente claras';
        messageClass = 'success';
    } else if (successRate >= 60) {
        message = '⚠️ Organización parcial: riesgo de algunos errores';
        messageClass = 'error';
    } else {
        message = '❌ Información desorganizada: alto riesgo de errores';
        messageClass = 'error';
    }
    
    resultMessage.innerHTML = message;
    resultMessage.className = `result-message ${messageClass}`;
    
    // Actualizar estadísticas
    updateStatistics(results);
}

function updateStatistics(results) {
    const correctCount = document.getElementById('correctCount');
    const totalCount = document.getElementById('totalCount');
    const percentage = document.getElementById('percentage');
    
    if (correctCount) correctCount.textContent = results.correctCount;
    if (totalCount) totalCount.textContent = results.totalCount;
    if (percentage) percentage.textContent = `${results.percentage}%`;
    
    console.log('Estadísticas actualizadas:', results); // Debug para verificar conteo
    
    // Actualizar vistas previas dinámicas
    updateDynamicPreviews();
}

function updateStudentSummary() {
    const summaryName = document.getElementById('summaryName');
    const summaryCareer = document.getElementById('summaryCareer');
    const summaryGroup = document.getElementById('summaryGroup');
    const summaryDate = document.getElementById('summaryDate');
    
    if (summaryName) summaryName.textContent = AppState.studentData.fullName || '-';
    if (summaryCareer) summaryCareer.textContent = AppState.studentData.career || '-';
    if (summaryGroup) summaryGroup.textContent = AppState.studentData.group || '-';
    if (summaryDate) summaryDate.textContent = new Date().toLocaleDateString('es-MX');
    
    // Actualizar también las vistas previas dinámicas
    updateDynamicPreviews();
}

// Función de compartir resultado dinámico
function initializeShare() {
    const shareBtn = document.getElementById('shareBtn');
    
    if (shareBtn) {
        shareBtn.addEventListener('click', handleShare);
    }
    
    // Configurar eventos de actualización dinámica
    setupDynamicUpdates();
}

function setupDynamicUpdates() {
    const easyType = document.getElementById('easyType');
    const difficultType = document.getElementById('difficultType');
    const importanceReason = document.getElementById('importanceReason');
    
    if (easyType) {
        easyType.addEventListener('change', updateDynamicPreviews);
    }
    if (difficultType) {
        difficultType.addEventListener('change', updateDynamicPreviews);
    }
    if (importanceReason) {
        importanceReason.addEventListener('input', () => {
            updateDynamicPreviews();
            updateWordCounter();
        });
    }
    
    // Inicializar contador
    updateWordCounter();
}

function updateWordCounter() {
    const importanceReason = document.getElementById('importanceReason');
    const wordCountElement = document.getElementById('wordCount');
    
    if (!importanceReason || !wordCountElement) return;
    
    const text = importanceReason.value.trim();
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    
    wordCountElement.textContent = wordCount;
    
    // Actualizar estilos del contador
    const wordCounter = wordCountElement.parentElement;
    if (wordCount < 20) {
        wordCounter.classList.add('warning');
        wordCounter.classList.remove('success');
    } else {
        wordCounter.classList.add('success');
        wordCounter.classList.remove('warning');
    }
}

function updateDynamicPreviews() {
    try {
        // Actualizar datos del estudiante en vista previa
        const previewName = document.getElementById('previewName');
        const previewCareer = document.getElementById('previewCareer');
        const previewGroup = document.getElementById('previewGroup');
        const previewDate = document.getElementById('previewDate');
        const previewID = document.getElementById('previewID');
        
        if (previewName) previewName.textContent = AppState.studentData.fullName || 'No especificado';
        if (previewCareer) previewCareer.textContent = AppState.studentData.career || 'No especificado';
        if (previewGroup) previewGroup.textContent = AppState.studentData.group || 'No especificado';
        if (previewDate) previewDate.textContent = new Date().toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        if (previewID) previewID.textContent = generateCompletionId();
        
        // Actualizar porcentaje de aciertos
        const previewResult = document.getElementById('previewResult');
        if (previewResult && AppState.classificationResults) {
            previewResult.textContent = AppState.classificationResults.percentage || '0';
        } else if (previewResult) {
            previewResult.textContent = '0';
        }
        
        // Actualizar vistas previas de reflexión
        const easyType = document.getElementById('easyType');
        const difficultType = document.getElementById('difficultType');
        const importanceReason = document.getElementById('importanceReason');
        
        const previewEasy = document.getElementById('previewEasy');
        const previewDifficult = document.getElementById('previewDifficult');
        const previewImportance = document.getElementById('previewImportance');
        
        if (previewEasy && easyType) {
            previewEasy.textContent = easyType.value || 'No seleccionado';
        }
        
        if (previewDifficult && difficultType) {
            previewDifficult.textContent = difficultType.value || 'No seleccionado';
        }
        
        if (previewImportance && importanceReason) {
            previewImportance.textContent = importanceReason.value || 'No especificado';
        }
    } catch (error) {
        console.error('Error en updateDynamicPreviews:', error);
    }
}

function handleCopy() {
    try {
        const content = generateDynamicContent();
        
        // Usar API de portapapeles
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(content)
                .then(() => {
                    showFeedback('✅ Texto copiado. Pégalo directamente en el foro.', 'success');
                })
                .catch(err => {
                    console.error('Error al copiar:', err);
                    fallbackCopy(content);
                });
        } else {
            fallbackCopy(content);
        }
    } catch (error) {
        console.error('Error en handleCopy:', error);
        showFeedback('❌ Error al generar contenido para copiar.', 'error');
    }
}

function fallbackCopy(content) {
    const textarea = document.createElement('textarea');
    textarea.value = content;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showFeedback('✅ Texto copiado. Pégalo directamente en el foro.', 'success');
    } catch (err) {
        showFeedback('❌ No se pudo copiar. Selecciona y copia manualmente.', 'error');
    }
    
    document.body.removeChild(textarea);
}

function generateDynamicContent() {
    const results = AppState.classificationResults || { percentage: 0 };
    const studentData = AppState.studentData;
    const easyType = document.getElementById('easyType');
    const difficultType = document.getElementById('difficultType');
    const importanceReason = document.getElementById('importanceReason');
    
    const completionId = generateCompletionId();
    const currentDate = new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const lines = [];
    lines.push('=== ACTIVIDAD CULTURA DIGITAL II ===');
    lines.push('');
    lines.push('Actividad: Clasificación interactiva de información digital y toma de decisiones');
    lines.push(`Nombre: ${studentData.fullName || 'No especificado'}`);
    lines.push(`Carrera: ${studentData.career || 'No especificado'}`);
    lines.push(`Grupo: ${studentData.group || 'No especificado'}`);
    lines.push(`Resultado: ${results.percentage}% de aciertos`);
    lines.push(`Fecha y hora: ${currentDate}`);
    lines.push(`ID de actividad: ${completionId}`);
    lines.push('');
    lines.push('REFLEXIÓN:');
    lines.push(`• Información más fácil de organizar: ${easyType ? easyType.value : 'No seleccionado'}`);
    lines.push(`• Información más difícil de organizar: ${difficultType ? difficultType.value : 'No seleccionado'}`);
    lines.push(`• ¿Por qué es importante organizar datos?: ${importanceReason ? importanceReason.value : 'No especificado'}`);
    lines.push('');
    lines.push('=== FIN DE ACTIVIDAD ===');
    
    return lines.join('\n');
}

function generateCompletionId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    const studentHash = btoa(AppState.studentData.fullName || '').substr(0, 3).toUpperCase();
    return `CD2-${studentHash}-${timestamp}-${random}`;
}

function handleShare() {
    try {
        // Validar que la clasificación esté completa
        if (!AppState.isClassificationComplete) {
            showFeedback('⚠️ Debes completar la clasificación primero antes de continuar.', 'error');
            return;
        }
        
        // Validar que se completen todos los campos de reflexión
        const easyType = document.getElementById('easyType');
        const difficultType = document.getElementById('difficultType');
        const importanceReason = document.getElementById('importanceReason');
        
        if (!easyType || !easyType.value) {
            showFeedback('⚠️ Selecciona qué tipo de información fue más fácil de organizar.', 'error');
            easyType?.focus();
            return;
        }
        
        if (!difficultType || !difficultType.value) {
            showFeedback('⚠️ Selecciona qué tipo de información fue más difícil de organizar.', 'error');
            difficultType?.focus();
            return;
        }
        
        // Validar mínimo 20 palabras en la reflexión
        const reflectionText = importanceReason ? importanceReason.value.trim() : '';
        const wordCount = reflectionText.split(/\s+/).filter(word => word.length > 0).length;
        
        if (wordCount < 20) {
            showFeedback(`⚠️ Tu reflexión debe tener mínimo 20 palabras. Llevas ${wordCount} palabras.`, 'error');
            importanceReason?.focus();
            return;
        }
        
        // Mostrar loading y navegar a página final
        setButtonLoading('shareBtn', true);
        showLoading('Finalizando tu actividad...');
        
        setTimeout(() => {
            navigateToThankYouPage();
            setButtonLoading('shareBtn', false);
        }, 1500);
        
    } catch (error) {
        console.error('Error en handleShare:', error);
        showFeedback('❌ Error al completar la actividad.', 'error');
        setButtonLoading('shareBtn', false);
    }
}

function navigateToThankYouPage() {
    try {
        // Ocultar sección actual
        hideElement('organization');
        
        // Mostrar página de agradecimiento
        showElement('thankYou');
        
        // Actualizar datos en página de agradecimiento
        updateThankYouPage();
        
        // Inicializar botones de página final
        initializeThankYouButtons();
        
        // Scroll al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        hideLoading();
        
    } catch (error) {
        console.error('Error en navigateToThankYouPage:', error);
        hideLoading();
    }
}

function updateThankYouPage() {
    const percentage = AppState.classificationResults ? AppState.classificationResults.percentage : 0;
    const completionId = generateCompletionId();
    
    // Actualizar elementos de la página final
    const thankYouName = document.getElementById('thankYouName');
    const thankYouCareer = document.getElementById('thankYouCareer');
    const thankYouResult = document.getElementById('thankYouResult');
    const thankYouID = document.getElementById('thankYouID');
    
    if (thankYouName) thankYouName.textContent = AppState.studentData.fullName || 'No especificado';
    if (thankYouCareer) thankYouCareer.textContent = AppState.studentData.career || 'No especificado';
    if (thankYouResult) thankYouResult.textContent = `${percentage}% de aciertos`;
    if (thankYouID) thankYouID.textContent = completionId;
    
    // Actualizar vista previa del foro
    updateForumPreview();
    
    // Guardar ID para referencia futura
    AppState.completionId = completionId;
}

function updateForumPreview() {
    const forumContent = document.getElementById('forumContent');
    if (!forumContent) return;
    
    // Generar el contenido dinámicamente
    const content = generateDynamicContent();
    forumContent.textContent = content;
}

function initializeThankYouButtons() {
    const copyFinalBtn = document.getElementById('copyFinalBtn');
    const startNewBtn = document.getElementById('startNewBtn');
    
    if (copyFinalBtn) {
        copyFinalBtn.addEventListener('click', () => {
            handleCopyWithAnimation();
        });
    }
    
    if (startNewBtn) {
        startNewBtn.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres iniciar una nueva actividad? Perderás el progreso actual.')) {
                resetActivity();
            }
        });
    }
}

function handleCopyWithAnimation() {
    try {
        const content = generateDynamicContent();
        
        // Animar botón de copiar
        const copyBtn = document.getElementById('copyFinalBtn');
        if (copyBtn) {
            copyBtn.classList.add('copy-success');
            copyBtn.disabled = true;
        }
        
        // Animar vista previa
        const previewBox = document.querySelector('.preview-box');
        if (previewBox) {
            previewBox.classList.add('copying');
        }
        
        // Copiar al portapapeles
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(content)
                .then(() => {
                    showCopySuccess();
                })
                .catch(err => {
                    console.error('Error al copiar:', err);
                    fallbackCopy(content);
                });
        } else {
            fallbackCopy(content);
        }
        
        // Remover animaciones después de 2 segundos
        setTimeout(() => {
            if (copyBtn) {
                copyBtn.classList.remove('copy-success');
                copyBtn.disabled = false;
            }
            if (previewBox) {
                previewBox.classList.remove('copying');
            }
        }, 2000);
        
    } catch (error) {
        console.error('Error en handleCopyWithAnimation:', error);
        showToast('❌ Error al copiar el texto', 'error');
    }
}

function showCopySuccess() {
    // Mostrar checkmark flotante
    const copyBtn = document.getElementById('copyFinalBtn');
    if (copyBtn) {
        const checkmark = document.createElement('div');
        checkmark.className = 'copy-checkmark';
        copyBtn.style.position = 'relative';
        copyBtn.appendChild(checkmark);
        
        // Remover checkmark después de 2 segundos
        setTimeout(() => {
            if (checkmark.parentNode) {
                checkmark.parentNode.removeChild(checkmark);
            }
        }, 2000);
    }
    
    // Mostrar toast de éxito
    showToast('✅ ¡Texto copiado con éxito! Pégalo en el foro', 'success');
}

function showToast(message, type = 'success') {
    // Remover toast existente si hay
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Crear nuevo toast
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Auto remover después de 3 segundos
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 500);
    }, 3000);
}

function resetActivity() {
    // Limpiar estado
    AppState.studentData = {
        fullName: '',
        career: '',
        group: ''
    };
    AppState.classification = {
        texto: [],
        numero: [],
        fecha: [],
        categoria: []
    };
    AppState.classificationResults = null;
    AppState.isClassificationComplete = false;
    
    // Resetear formulario
    const studentForm = document.getElementById('studentForm');
    if (studentForm) {
        studentForm.reset();
    }
    
    // Limpiar zonas de clasificación
    document.querySelectorAll('.zone-content').forEach(zone => {
        zone.innerHTML = '';
    });
    
    // Mostrar tarjetas originales
    document.querySelectorAll('.card-item').forEach(card => {
        card.style.display = '';
        card.classList.remove('in-zone', 'returning');
    });
    
    // Ocultar todas las secciones excepto registro
    hideElement('thankYou');
    hideElement('organization');
    hideElement('classification');
    showElement('registration');
    
    // Resetear botones
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.textContent = '📤 Completar Actividad';
        shareBtn.disabled = false;
        shareBtn.style.opacity = '1';
        shareBtn.style.cursor = 'pointer';
        shareBtn.classList.remove('loading');
    }
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando aplicación...');
    
    // Establecer año dinámico en footer
    const footerYear = document.getElementById('footerYear');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }
    
    // Inicializar registro
    initializeRegistration();
    
    // Inicializar funciones de compartir
    initializeShare();
    
    // Mostrar sección de registro por defecto
    showElement('registration');
    
    console.log('Aplicación inicializada completamente');
});

// Manejo de errores globales
window.addEventListener('error', function(event) {
    console.error('Error en la aplicación:', event.error);
    // No mostrar feedback de error para no interrumpir la experiencia
    // Solo log en consola para debugging
});

// Manejo de promesas rechazadas
window.addEventListener('unhandledrejection', function(event) {
    console.error('Promesa rechazada no manejada:', event.reason);
    event.preventDefault(); // Prevenir que el error se muestre en la UI
});

// Funciones auxiliares para manejo de elementos
function findElementInZone(elementText, zoneType) {
    const zone = document.querySelector(`[data-zone="${zoneType}"]`);
    if (!zone) return null;
    
    const zoneContent = zone.querySelector('.zone-content');
    const elements = zoneContent.querySelectorAll('.card-item');
    
    for (let element of elements) {
        if (element.textContent.includes(elementText)) {
            return element;
        }
    }
    return null;
}

function highlightIncorrectElements(incorrectElements) {
    incorrectElements.forEach(item => {
        if (item.domElement) {
            item.domElement.classList.add('incorrect');
        }
    });
}

function clearIncorrectHighlights() {
    const incorrectElements = document.querySelectorAll('.incorrect');
    incorrectElements.forEach(element => {
        element.classList.remove('incorrect');
    });
}

function returnElementToOriginal(originalElement, clonedCard) {
    try {
        if (originalElement) {
            // Mostrar el elemento original
            originalElement.style.display = '';
            originalElement.classList.remove('in-zone');
            originalElement.classList.add('returning');
            
            // Remover animación después de completar
            setTimeout(() => {
                try {
                    originalElement.classList.remove('returning');
                } catch (e) {
                    console.warn('Error al remover animación:', e);
                }
            }, 500);
        }
        
        // Eliminar el clon de la zona
        if (clonedCard && clonedCard.parentNode) {
            clonedCard.parentNode.removeChild(clonedCard);
        }
        
        // Actualizar estado
        updateClassificationState();
        
        // Limpiar errores si los hay
        clearIncorrectHighlights();
    } catch (error) {
        console.error('Error en returnElementToOriginal:', error);
    }
}

// Prevenir recarga accidental si hay progreso
window.addEventListener('beforeunload', function(event) {
    try {
        // Solo prevenir si hay actividad en progreso
        if (AppState.isClassificationComplete || !AppState.studentData.fullName) {
            return;
        }
        
        const message = 'Tienes progreso sin guardar. ¿Estás seguro de que quieres salir?';
        event.returnValue = message;
        return message;
    } catch (error) {
        console.error('Error en beforeunload:', error);
    }
});