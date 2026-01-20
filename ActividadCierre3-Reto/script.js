const AppState = { 
    name: "", 
    group: "", 
    career: "",
    score: 0,
    currentStage: 1,
    maxScore: 300 // 100 per stage roughly
};

const CAREERS = [
  "TÉCNICO EN ACUACULTURA", "TÉCNICO EN MECÁNICA NAVAL", 
  "TÉCNICO EN PREPARACIÓN DE ALIMENTOS Y BEBIDAS", "TÉCNICO EN RECREACIONES ACUÁTICAS",
  "TÉCNICO EN REFRIGERACIÓN Y CLIMATIZACIÓN", "TÉCNICO LABORATORISTA AMBIENTAL"
];

// --- STAGE 1 DATA (Classification) ---
const CLASSIFICATION_ITEMS = [
    { id: 'p1', text: "Contraseña '12345'", type: 'bad' },
    { id: 'p2', text: "Verificación de dos pasos", type: 'good' },
    { id: 'p3', text: "Descargar software pirata", type: 'bad' },
    { id: 'p4', text: "Citar fuentes de información", type: 'good' },
    { id: 'p5', text: "Compartir ubicación real", type: 'bad' },
    { id: 'p6', text: "Actualizar antivirus", type: 'good' }
];

// --- STAGE 2 DATA (Connection) ---
const SCENARIOS = [
    {
        data: "Tu navegador consume mucha memoria y batería.",
        options: [
            { text: "Comprar una RAM nueva.", score: 0 },
            { text: "Cerrar pestañas inactivas y extensiones innecesarias.", score: 100 },
            { text: "Ignorarlo, no importa.", score: 0 }
        ]
    },
    {
        data: "Recibes un correo diciendo que ganaste un premio.",
        options: [
            { text: "Dar clic para reclamarlo rápido.", score: 0 },
            { text: "Verificar el remitente y no dar datos.", score: 100 },
            { text: "Reenviarlo a tus amigos.", score: 0 }
        ]
    }
];
let currentScenarioIndex = 0;

// --- STAGE 3 DATA (Impact) ---
const IMPACT_ITEMS = [
    { text: "Reciclaje de basura electrónica (e-waste)", impact: 'positive' },
    { text: "Obsolescencia programada", impact: 'negative' },
    { text: "Uso de la nube para reducir papel", impact: 'positive' },
    { text: "Minería de criptomonedas masiva", impact: 'negative' }
];
let currentImpactIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
    // Populate Careers
    const sel = document.getElementById("career");
    if(sel) {
        CAREERS.forEach(c => {
            let opt = document.createElement("option");
            opt.value = c; opt.textContent = c;
            sel.appendChild(opt);
        });
    }

    // Handle Form
    document.getElementById("studentForm").onsubmit = (e) => {
        e.preventDefault();
        const n = document.getElementById("fullName").value.trim();
        const g = document.getElementById("group").value;
        const c = document.getElementById("career").value;
        if(n && g && c) {
            AppState.name = n; AppState.group = g; AppState.career = c;
            document.getElementById("registration").classList.add("hidden");
            document.getElementById("gameSection").classList.remove("hidden");
            initStage1();
        } else {
            alert("Completa todos los datos");
        }
    };

    document.getElementById("copyBtn").onclick = () => {
        navigator.clipboard.writeText(document.getElementById("forumText").textContent)
        .then(() => alert("Copiado!"));
    };
});

// === STAGE 1: DRAG & DROP ===
let stage1ItemsPlaced = 0;

function initStage1() {
    updateProgress(10);
    const container = document.getElementById("sourceZone");
    // Shuffle items
    const items = [...CLASSIFICATION_ITEMS].sort(() => Math.random() - 0.5);
    
    items.forEach(item => {
        const el = document.createElement("div");
        el.className = "draggable-item";
        el.draggable = true;
        el.textContent = item.text;
        el.dataset.type = item.type;
        el.id = item.id;
        
        el.ondragstart = (e) => {
            e.dataTransfer.setData("text/plain", item.id);
            el.classList.add("dragging");
        };
        el.ondragend = () => el.classList.remove("dragging");
        
        container.appendChild(el);
    });

    // Setup Zones
    document.querySelectorAll(".drop-zone").forEach(zone => {
        zone.ondragover = (e) => {
            e.preventDefault();
            zone.classList.add("hovered");
        };
        zone.ondragleave = () => zone.classList.remove("hovered");
        zone.ondrop = (e) => {
            e.preventDefault();
            zone.classList.remove("hovered");
            const id = e.dataTransfer.getData("text/plain");
            const draggedEl = document.getElementById(id);
            
            if(draggedEl && !zone.contains(draggedEl)) {
                // Check if correct
                const itemType = draggedEl.dataset.type;
                const zoneType = zone.dataset.type;
                
                if(itemType === zoneType) {
                    zone.querySelector(".zone-content").appendChild(draggedEl);
                    draggedEl.draggable = false;
                    draggedEl.style.cursor = "default";
                    draggedEl.style.border = "2px solid var(--success)";
                    AppState.score += 20; // 6 items * ~16pts = 100 roughly. Let's say 20 * 6 = 120 max stage 1
                    stage1ItemsPlaced++;
                    if(stage1ItemsPlaced === CLASSIFICATION_ITEMS.length) {
                        document.getElementById("stage1Next").classList.remove("hidden");
                    }
                } else {
                    // Feedback for wrong drop
                    alert("¡Ups! Esa no parece ser la categoría correcta. Intenta de nuevo.");
                }
            }
        };
    });
    
    document.getElementById("stage1Next").onclick = goToStage2;
}


// === STAGE 2: CONNECTIONS ===
function goToStage2() {
    document.getElementById("stage1").classList.add("hidden");
    document.getElementById("stage2").classList.remove("hidden");
    document.getElementById("currentStageNum").textContent = "2";
    updateProgress(40);
    loadScenario();
}

function loadScenario() {
    if(currentScenarioIndex >= SCENARIOS.length) {
        goToStage3();
        return;
    }
    
    const scenario = SCENARIOS[currentScenarioIndex];
    document.getElementById("scenarioData").textContent = scenario.data;
    const container = document.getElementById("scenarioOptions");
    container.innerHTML = "";
    document.getElementById("stage2Feedback").className = "feedback-msg";
    
    scenario.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.textContent = opt.text;
        btn.onclick = () => checkScenarioAnswer(opt.score, btn);
        container.appendChild(btn);
    });
}

function checkScenarioAnswer(points, btn) {
    const feedback = document.getElementById("stage2Feedback");
    if(points > 0) {
        btn.style.background = "#dcfce7";
        btn.style.borderColor = "#166534";
        feedback.textContent = "¡Excelente decisión!";
        feedback.className = "feedback-msg visible correct";
        AppState.score += 50; // 2 scenarios * 50 = 100
        setTimeout(() => {
            currentScenarioIndex++;
            loadScenario();
        }, 1500);
    } else {
        btn.style.background = "#fee2e2";
        btn.style.borderColor = "#991b1b";
        feedback.textContent = "Mmm... esa no es la mejor opción. Intenta otra.";
        feedback.className = "feedback-msg visible incorrect";
    }
}

// === STAGE 3: IMPACT ===
function goToStage3() {
    document.getElementById("stage2").classList.add("hidden");
    document.getElementById("stage3").classList.remove("hidden");
    document.getElementById("currentStageNum").textContent = "3";
    updateProgress(70);
    loadImpactItem();
}

function loadImpactItem() {
    if(currentImpactIndex >= IMPACT_ITEMS.length) {
        finishGame();
        return;
    }
    const item = IMPACT_ITEMS[currentImpactIndex];
    document.getElementById("impactAction").textContent = item.text;
    document.getElementById("stage3Feedback").className = "feedback-msg";
}

function checkImpact(choice) {
    const item = IMPACT_ITEMS[currentImpactIndex];
    const feedback = document.getElementById("stage3Feedback");
    
    if(choice === item.impact) {
        feedback.textContent = "¡Correcto!";
        feedback.className = "feedback-msg visible correct";
        AppState.score += 25; // 4 items * 25 = 100
        setTimeout(() => {
            currentImpactIndex++;
            loadImpactItem();
        }, 1000);
    } else {
        feedback.textContent = "Incorrecto. Piénsalo bien.";
        feedback.className = "feedback-msg visible incorrect";
    }
}

// === RESULTS ===
function finishGame() {
    updateProgress(100);
    document.getElementById("gameSection").classList.add("hidden");
    document.getElementById("resultSection").classList.remove("hidden");
    
    // Calculate Score % (Max approx 320)
    // Stage 1: 120, Stage 2: 100, Stage 3: 100 = 320
    const maxPoss = 320;
    const finalPct = Math.min(100, Math.round((AppState.score / maxPoss) * 100));
    
    document.getElementById("finalScore").textContent = finalPct;
    
    let level = "Aprendiz Digital";
    if(finalPct > 90) level = "Maestro Digital";
    else if(finalPct > 70) level = "Ciudadano Responsable";
    
    document.getElementById("finalLevel").textContent = level;
    document.getElementById("finalFeedback").textContent = 
        finalPct === 100 ? "¡Impresionante! Tienes un dominio total." : "¡Buen trabajo! Sigue practicando.";

    let t = `=== ACTIVIDAD DE CIERRE 3: RETO INTERACTIVO ===\n`;
    t += `Alumno: ${AppState.name}\nCarrera: ${AppState.career} | Grupo: ${AppState.group}\n`;
    t += `Puntaje Final: ${finalPct}% | Nivel: ${level}\n`;
    t += `Código: CHALLENGE-${Date.now().toString().slice(-4)}`;
    
    document.getElementById("forumText").textContent = t;
}

function updateProgress(pct) {
    document.getElementById("progressBar").style.width = pct + "%";
}
