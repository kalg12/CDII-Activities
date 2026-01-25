document.addEventListener('DOMContentLoaded', () => {
    // --- Estado de la aplicación ---
    let studentData = {
        name: '',
        career: '',
        group: '',
        date: new Date().toLocaleDateString(),
        score: 0,
        total: 9
    };

    const sections = {
        registration: document.getElementById('registration'),
        instructions: document.getElementById('instructionsSection'),
        game: document.getElementById('gameSection'),
        result: document.getElementById('resultSection'),
        evidence: document.getElementById('finalEvidence')
    };

    // --- Navegación ---
    function showSection(sectionId) {
        Object.values(sections).forEach(s => s.classList.add('hidden'));
        if(sections[sectionId]) sections[sectionId].classList.remove('hidden');
        window.scrollTo(0, 0);
    }

    // --- Registro ---
    const studentForm = document.getElementById('studentForm');
    studentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        studentData.name = document.getElementById('fullName').value;
        studentData.career = document.getElementById('career').value;
        studentData.group = document.getElementById('group').value;
        showSection('instructions');
    });

    const startGameBtn = document.getElementById('startGameBtn');
    if(startGameBtn) {
        startGameBtn.addEventListener('click', () => {
            showSection('game');
        });
    }

    // --- Lógica de Arrastrar y Soltar ---
    const cards = document.querySelectorAll('.card-item');
    const zones = document.querySelectorAll('.zone');
    const pool = document.getElementById('cardsContainer');
    let draggedItem = null;

    cards.forEach(card => {
        card.addEventListener('dragstart', function(e) {
            draggedItem = this;
            this.classList.add('dragging');
            // Resetear visual al volver a arrastrar
            this.classList.remove('correct', 'error');
            this.style.borderColor = '';
        });

        card.addEventListener('dragend', function(e) {
            this.classList.remove('dragging');
            draggedItem = null;
        });
    });

    // Permitir drop en el pool también (para regresar items)
    if(pool) {
        pool.addEventListener('dragover', function(e) { e.preventDefault(); });
        pool.addEventListener('drop', function(e) {
            e.preventDefault();
            if (draggedItem) {
                this.appendChild(draggedItem);
                draggedItem.classList.remove('correct', 'error');
                draggedItem.style.borderColor = '';
            }
        });
    }

    zones.forEach(zone => {
        zone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('hover');
        });

        zone.addEventListener('dragleave', function() {
            this.classList.remove('hover');
        });

        zone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('hover');
            if (draggedItem) {
                // Zona de contenido dentro de la tarjeta de descripción
                const content = this.querySelector('.zone-content');
                
                // Si ya hay un item, regresarlo al pool o intercambiar (simple: regresar al pool)
                if (content.children.length > 0) {
                   const existingItem = content.firstElementChild;
                   pool.appendChild(existingItem);
                }

                content.appendChild(draggedItem);
                // Resetear visual al soltar
                draggedItem.classList.remove('correct', 'error');
                draggedItem.style.borderColor = '';
            }
        });
    });

    // --- Verificación ---
    const verifyBtn = document.getElementById('verifyBtn');
    const feedback = document.getElementById('gameFeedback');

    verifyBtn.addEventListener('click', () => {
        let correct = 0;
        let placed = 0;
        const totalItems = 9;

        document.querySelectorAll('.zone').forEach(zone => {
            const requiredType = zone.dataset.accept;
            // Buscar item dentro de .zone-content
            const content = zone.querySelector('.zone-content');
            const item = content.querySelector('.card-item');

            if (item) {
                placed++;
                // Limpiar estados anteriores
                item.classList.remove('correct', 'error');
                
                if (item.dataset.type === requiredType) {
                    correct++;
                    item.classList.add('correct');
                    // Opcional: Bloquear items correctos
                    // item.draggable = false;
                } else {
                    item.classList.add('error');
                }
            }
        });

        if (placed < totalItems) {
            feedback.textContent = `⚠️ Por favor, relaciona todas las herramientas (${placed}/${totalItems})`;
            feedback.className = 'feedback error';
            feedback.classList.remove('hidden');
            return;
        }

        if (correct < totalItems) {
            feedback.textContent = `❌ Tienes ${totalItems - correct} errores. ¡Revisa las funciones!`;
            feedback.className = 'feedback error';
            feedback.classList.remove('hidden');
            return;
        }

        studentData.score = correct;
        
        feedback.textContent = `🎯 ¡Excelente! Has relacionado correctamente todas las herramientas.`;
        feedback.className = 'feedback success';
        feedback.classList.remove('hidden');

        // Mostrar botón para continuar después de una breve pausa
        setTimeout(() => {
            document.getElementById('resName').textContent = studentData.name;
            document.getElementById('resCareer').textContent = studentData.career;
            document.getElementById('resGroup').textContent = studentData.group;
            document.getElementById('resScore').textContent = `${correct} / ${studentData.total}`;
            showSection('result');
        }, 2000);
    });

    // --- Reflexión ---
    const toolChoice = document.getElementById('toolChoice');
    const bestOption = document.getElementById('bestOption');
    const advantage = document.getElementById('advantage');
    // const charCounter = document.getElementById('charCounter'); // Si se quiere implementar contador

    // --- Finalización y Evidencia ---
    const finishBtn = document.getElementById('finishBtn');
    finishBtn.addEventListener('click', () => {
        // Validar que haya texto
        if (!toolChoice.value.trim() || !bestOption.value.trim() || !advantage.value.trim()) {
            alert('Por favor, responde todas las preguntas de reflexión.');
            return;
        }

        generateEvidence();
        showSection('evidence');
    });

    function generateEvidence() {
        const code = `ACT3-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        document.getElementById('finalCode').textContent = code;

        const forumContent = `
ACTIVIDAD 3: CryptPad - Herramientas de Colaboración
ESTUDIANTE: ${studentData.name}
CARRERA: ${studentData.career}
GRUPO: ${studentData.group}
ID DE ACTIVIDAD: ${code}
FECHA: ${studentData.date}
RESULTADO: ${studentData.score}/${studentData.total} aciertos

REFLEXIÓN:
1. Herramienta elegida:
   ${toolChoice.value}

2. Por qué es la mejor opción:
   ${bestOption.value}

3. Ventaja de ser libre y colaborativa:
   ${advantage.value}
        `.trim();

        document.getElementById('forumText').textContent = forumContent;
    }

    // --- Copiar al portapapeles ---
    const copyBtn = document.getElementById('copyForumBtn');
    if(copyBtn) {
        copyBtn.addEventListener('click', () => {
            const text = document.getElementById('forumText').textContent;
            navigator.clipboard.writeText(text).then(() => {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '✅ ¡Copiado!';
                setTimeout(() => { copyBtn.innerHTML = originalText; }, 2000);
            });
        });
    }

    // Año actual
    const yearSpan = document.getElementById('currentYear');
    if(yearSpan) yearSpan.textContent = new Date().getFullYear();
});
