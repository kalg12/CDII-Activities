document.addEventListener('DOMContentLoaded', () => {
    // --- Estado de la aplicación ---
    let studentData = {
        name: '',
        career: '',
        group: '',
        date: new Date().toLocaleDateString(),
        score: 0,
        total: 6
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
        if (sections[sectionId]) sections[sectionId].classList.remove('hidden');
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
    if (startGameBtn) {
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
        card.addEventListener('dragstart', function (e) {
            draggedItem = this;
            this.classList.add('dragging');
            this.classList.remove('correct', 'error');
            this.style.borderColor = '';
        });

        card.addEventListener('dragend', function (e) {
            this.classList.remove('dragging');
            draggedItem = null;
        });
    });

    // Permitir drop en el pool
    if (pool) {
        pool.addEventListener('dragover', function (e) { e.preventDefault(); });
        pool.addEventListener('drop', function (e) {
            e.preventDefault();
            if (draggedItem) {
                this.appendChild(draggedItem);
                draggedItem.classList.remove('correct', 'error');
                draggedItem.style.borderColor = '';
            }
        });
    }

    zones.forEach(zone => {
        zone.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.classList.add('hover');
        });

        zone.addEventListener('dragleave', function () {
            this.classList.remove('hover');
        });

        zone.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('hover');
            if (draggedItem) {
                const content = this.querySelector('.zone-content');
                if (content.children.length > 0) {
                    const existingItem = content.firstElementChild;
                    pool.appendChild(existingItem);
                }
                content.appendChild(draggedItem);
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
        const totalItems = 6;

        document.querySelectorAll('.zone').forEach(zone => {
            const requiredType = zone.dataset.accept;
            const content = zone.querySelector('.zone-content');
            const item = content.querySelector('.card-item');

            if (item) {
                placed++;
                item.classList.remove('correct', 'error');

                if (item.dataset.type === requiredType) {
                    correct++;
                    item.classList.add('correct');
                } else {
                    item.classList.add('error');
                }
            }
        });

        if (placed < totalItems) {
            feedback.textContent = `⚠️ Faltan respuestas (${placed}/${totalItems})`;
            feedback.className = 'feedback error';
            feedback.classList.remove('hidden');
            return;
        }

        if (correct < totalItems) {
            feedback.textContent = `❌ Tienes ${totalItems - correct} errores.`;
            feedback.className = 'feedback error';
            feedback.classList.remove('hidden');
            return;
        }

        studentData.score = correct;

        feedback.textContent = `🎯 ¡Correcto! Has relacionado todas las expresiones.`;
        feedback.className = 'feedback success';
        feedback.classList.remove('hidden');

        setTimeout(() => {
            document.getElementById('resName').textContent = studentData.name;
            document.getElementById('resCareer').textContent = studentData.career;
            document.getElementById('resGroup').textContent = studentData.group;
            document.getElementById('resScore').textContent = `${correct} / ${studentData.total}`;
            showSection('result');
        }, 1500);
    });

    // --- Reflexión ---
    const diffExp = document.getElementById('diffExp');
    const learning = document.getElementById('learning');

    // --- Finalización y Evidencia ---
    const finishBtn = document.getElementById('finishBtn');
    finishBtn.addEventListener('click', () => {
        if (!diffExp.value.trim() || !learning.value.trim()) {
            alert('Por favor, responde todas las preguntas de reflexión.');
            return;
        }
        generateEvidence();
        showSection('evidence');
    });

    function generateEvidence() {
        const code = `ALG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        document.getElementById('finalCode').textContent = code;

        const forumContent = `
ACTIVIDAD 1: Expresiones Algebraicas Colaborativas
ESTUDIANTE: ${studentData.name}
CARRERA: ${studentData.career}
GRUPO: ${studentData.group}
FECHA: ${studentData.date}
RESULTADO: ${studentData.score}/${studentData.total}

REFLEXIÓN:
1. Expresión más difícil:
   ${diffExp.value}

2. Aprendizaje sobre lenguaje algebraico:
   ${learning.value}
        `.trim();

        document.getElementById('forumText').textContent = forumContent;
    }

    // --- Copiar al portapapeles ---
    const copyBtn = document.getElementById('copyForumBtn');
    if (copyBtn) {
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
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});
