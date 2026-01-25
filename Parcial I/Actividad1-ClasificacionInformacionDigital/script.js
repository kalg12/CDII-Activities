document.addEventListener('DOMContentLoaded', () => {
    // --- Estado de la aplicación ---
    let studentData = {
        name: '',
        career: '',
        group: '',
        date: new Date().toLocaleDateString(),
        score: 0,
        total: 12
    };

    const sections = {
        registration: document.getElementById('registration'),
        problem: document.getElementById('problemSituation'),
        game: document.getElementById('gameSection'),
        result: document.getElementById('resultSection'),
        evidence: document.getElementById('finalEvidence')
    };

    // --- Navegación ---
    function showSection(sectionId) {
        Object.values(sections).forEach(s => s.classList.add('hidden'));
        sections[sectionId].classList.remove('hidden');
        window.scrollTo(0, 0);
    }

    // --- Registro ---
    const studentForm = document.getElementById('studentForm');
    studentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        studentData.name = document.getElementById('fullName').value;
        studentData.career = document.getElementById('career').value;
        studentData.group = document.getElementById('group').value;
        showSection('problem');
    });

    const startActivityBtn = document.getElementById('startActivityBtn');
    startActivityBtn.addEventListener('click', () => {
        showSection('game');
    });

    // --- Lógica de Arrastrar y Soltar ---
    const cards = document.querySelectorAll('.card-item');
    const zones = document.querySelectorAll('.zone, #cardsContainer');
    let draggedItem = null;

    cards.forEach(card => {
        card.addEventListener('dragstart', function(e) {
            draggedItem = this;
            this.classList.add('dragging');
            // Resetear borde al volver a arrastrar
            this.style.borderColor = 'var(--border)';
        });

        card.addEventListener('dragend', function(e) {
            this.classList.remove('dragging');
            draggedItem = null;
        });
    });

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
                // Si es el pool, agregarlo directamente, si no, buscar zone-content
                const target = this.id === 'cardsContainer' ? this : this.querySelector('.zone-content');
                if (target) {
                    target.appendChild(draggedItem);
                    draggedItem.style.borderColor = 'var(--border)'; // Limpiar feedback anterior
                }
            }
        });
    });

    // --- Verificación ---
    const verifyBtn = document.getElementById('verifyBtn');
    const feedback = document.getElementById('gameFeedback');

    verifyBtn.addEventListener('click', () => {
        let correct = 0;
        let placed = 0;
        const totalItems = 12;

        document.querySelectorAll('.zone').forEach(zone => {
            const category = zone.dataset.zone;
            const assignedCards = zone.querySelectorAll('.card-item');
            placed += assignedCards.length;

            assignedCards.forEach(card => {
                if (card.dataset.category === category) {
                    correct++;
                    card.style.borderColor = 'var(--ok)';
                } else {
                    card.style.borderColor = 'var(--danger)';
                }
            });
        });

        if (placed < totalItems) {
            feedback.textContent = `⚠️ Por favor, clasifica todos los elementos (${placed}/${totalItems})`;
            feedback.className = 'feedback error';
            feedback.classList.remove('hidden');
            return;
        }

        if (correct < totalItems) {
            feedback.textContent = `❌ Tienes ${totalItems - correct} errores. ¡Revísalos y corrígelos!`;
            feedback.className = 'feedback error';
            feedback.classList.remove('hidden');
            return;
        }

        studentData.score = correct;
        
        feedback.textContent = `🎯 ¡Perfecto! Has clasificado todo correctamente.`;
        feedback.className = 'feedback success';
        feedback.classList.remove('hidden');

        // Mostrar botón para continuar después de una breve pausa
        setTimeout(() => {
            document.getElementById('resName').textContent = studentData.name;
            document.getElementById('resCareer').textContent = studentData.career;
            document.getElementById('resGroup').textContent = studentData.group;
            document.getElementById('resScore').textContent = `${correct} / ${studentData.total}`;
            showSection('result');
        }, 1500);
    });

    // --- Reflexión ---
    const importanceReason = document.getElementById('importanceReason');
    const wordCounter = document.getElementById('wordCounter');

    importanceReason.addEventListener('input', () => {
        const words = importanceReason.value.trim().split(/\s+/).filter(w => w.length > 0);
        wordCounter.textContent = `${words.length} / 20 palabras mínimas`;
        
        if (words.length >= 20) {
            wordCounter.classList.add('valid');
        } else {
            wordCounter.classList.remove('valid');
        }
    });

    // --- Finalización y Evidencia ---
    const finishBtn = document.getElementById('finishBtn');
    finishBtn.addEventListener('click', () => {
        const words = importanceReason.value.trim().split(/\s+/).filter(w => w.length > 0);
        if (words.length < 20) {
            alert('Por favor, completa tu reflexión con al menos 20 palabras.');
            return;
        }

        generateEvidence();
        showSection('evidence');
    });

    function generateEvidence() {
        const code = `ACT1-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        document.getElementById('finalCode').textContent = code;

        const easy = document.getElementById('easyInfo').value;
        const difficult = document.getElementById('difficultInfo').value;
        const importance = importanceReason.value;

        const forumContent = `
ACTVIDAD: Clasificación de información y representación algebraica
ESTUDIANTE: ${studentData.name}
CARRERA: ${studentData.career}
GRUPO: ${studentData.group}
ID DE ACTIVIDAD: ${code}
FECHA: ${studentData.date}
RESULTADO: ${studentData.score}/${studentData.total} aciertos

REFLEXIÓN:
1. Información fácil de representar:
   ${easy}

2. Información difícil de representar:
   ${difficult}

3. Importancia de la organización y representación:
   ${importance}
        `.trim();

        document.getElementById('forumText').textContent = forumContent;
    }

    // --- Copiar al portapapeles ---
    const copyBtn = document.getElementById('copyForumBtn');
    copyBtn.addEventListener('click', () => {
        const text = document.getElementById('forumText').textContent;
        navigator.clipboard.writeText(text).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '✅ ¡Copiado!';
            setTimeout(() => { copyBtn.innerHTML = originalText; }, 2000);
        });
    });

    // Año actual
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});
