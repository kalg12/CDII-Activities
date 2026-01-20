const AppState = {
    student: { name: "", career: "", group: "" },
    step: 0,
    scores: { eco: 0, ethics: 0 },
    decisions: [],
    finalData: { es: "", en: "", arg: "" }
};

const CAREERS = [
  "TÉCNICO EN ACUACULTURA", "TÉCNICO EN MECÁNICA NAVAL", 
  "TÉCNICO EN PREPARACIÓN DE ALIMENTOS Y BEBIDAS", "TÉCNICO EN RECREACIONES ACUÁTICAS",
  "TÉCNICO EN REFRIGERACIÓN Y CLIMATIZACIÓN", "TÉCNICO LABORATORISTA AMBIENTAL"
];

const SCENARIOS = [
    {
        id: 1,
        icon: "📱",
        title: "Basura Electrónica (E-Waste)",
        desc: "Tu empresa tiene 500 computadoras viejas. Renovar equipos es necesario, pero costoso. ¿Qué haces con los viejos?",
        optionA: { text: "Vender a reciclador certificado (Costo alto)", eco: 20, ethics: 10, summary: "Reciclaje Certificado" },
        optionB: { text: "Donar a vertedero informal (Gratis)", eco: -20, ethics: -10, summary: "Vertedero Informal" }
    },
    {
        id: 2,
        icon: "⚡",
        title: "Energía para Data Center",
        desc: "El nuevo centro de datos consume mucha energía. Debes elegir la fuente de alimentación.",
        optionA: { text: "Energía Solar (Inversión alta, retorno lento)", eco: 20, ethics: 10, summary: "Energía Renovable" },
        optionB: { text: "Red convencional carbón (Barato, inmediato)", eco: -20, ethics: 0, summary: "Energía Fósil" }
    },
    {
        id: 3,
        icon: "⚖️",
        title: "Sesgo en Algoritmo de IA",
        desc: "Tu IA de contratación muestra sesgos contra ciertos grupos. Corregirlo retrasará el lanzamiento 2 meses.",
        optionA: { text: "Retrasar y corregir el sesgo", eco: 0, ethics: 20, summary: "Corrección Ética" },
        optionB: { text: "Lanzar con advertencias (Cumplir fecha)", eco: 0, ethics: -20, summary: "Lanzamiento Sesgado" }
    },
    {
        id: 4,
        icon: "⏳",
        title: "Diseño de Producto",
        desc: "Ingeniería propone hacer el nuevo dispositivo difícil de reparar para forzar la compra del nuevo modelo en 2 años.",
        optionA: { text: "Rechazar: Hacerlo modular y reparable", eco: 20, ethics: 15, summary: "Diseño Durable" },
        optionB: { text: "Aprobar: Obsolescencia programada", eco: -20, ethics: -10, summary: "Obsolescencia Programada" }
    },
    {
        id: 5,
        icon: "🔒",
        title: "Privacidad de Usuario",
        desc: "Una empresa externa ofrece millones por los datos de navegación de tus usuarios para publicidad.",
        optionA: { text: "Rechazar oferta: Proteger privacidad", eco: 0, ethics: 20, summary: "Protección de Datos" },
        optionB: { text: "Vender datos anonimizados parcialmente", eco: 0, ethics: -15, summary: "Venta de Datos" }
    }
];

document.addEventListener("DOMContentLoaded", () => {
    initRegistration();
    document.getElementById("footerYear").textContent = new Date().getFullYear();
    
    // Bind buttons
    document.getElementById("choiceA").onclick = () => makeDecision('A');
    document.getElementById("choiceB").onclick = () => makeDecision('B');
    document.getElementById("finishBtn").onclick = submitReflection;
    document.getElementById("copyForumBtn").onclick = copyToClipboard;
});

function initRegistration() {
    const sel = document.getElementById("career");
    CAREERS.forEach(c => {
        let opt = document.createElement("option");
        opt.value = c; opt.textContent = c;
        sel.appendChild(opt);
    });

    document.getElementById("studentForm").onsubmit = (e) => {
        e.preventDefault();
        const f = new FormData(e.target);
        if(!f.get("fullName") || !f.get("career") || !f.get("group")) return alert("Completa todos los datos");
        
        AppState.student = { name: f.get("fullName"), career: f.get("career"), group: f.get("group") };
        
        switchSection("registration", "simulationSection");
        loadScenario(0);
    };
}

function loadScenario(index) {
    if(index >= SCENARIOS.length) {
        completeSimulation();
        return;
    }
    
    const s = SCENARIOS[index];
    document.getElementById("scenarioIcon").textContent = s.icon;
    document.getElementById("scenarioTitle").textContent = `${index + 1}. ${s.title}`;
    document.getElementById("scenarioDesc").textContent = s.desc;
    document.getElementById("choiceA").textContent = s.optionA.text;
    document.getElementById("choiceB").textContent = s.optionB.text;
    
    // Progress
    const pct = ((index) / SCENARIOS.length) * 100;
    document.getElementById("progressBar").style.width = `${pct}%`;
}

function makeDecision(choice) {
    const s = SCENARIOS[AppState.step];
    const opt = choice === 'A' ? s.optionA : s.optionB;
    
    AppState.scores.eco += opt.eco;
    AppState.scores.ethics += opt.ethics;
    AppState.decisions.push({ title: s.title, choice: opt.summary, type: choice });
    
    AppState.step++;
    loadScenario(AppState.step);
}

function completeSimulation() {
    document.getElementById("progressBar").style.width = "100%";
    setTimeout(() => {
        switchSection("simulationSection", "reflectionSection");
    }, 500);
}

function submitReflection() {
    const es = document.getElementById("opinionSpanish").value.trim();
    const en = document.getElementById("opinionEnglish").value.trim();
    const arg = document.getElementById("ethicalArgument").value.trim();
    
    if(es.split(" ").length < 10) return alert("Tu opinión en español es muy breve (mín. 10 palabras).");
    if(en.length < 10) return alert("Please provide your opinion in English.");
    if(arg.length < 20) return alert("Por favor completa el argumento ético.");
    
    AppState.finalData = { es, en, arg };
    showFinalResult();
}

function showFinalResult() {
    switchSection("reflectionSection", "finalResult");
    
    const feedback = analyzePerformance();
    
    document.getElementById("badgeIcon").textContent = feedback.badge.icon;
    document.getElementById("badgeTitle").textContent = feedback.badge.title;
    document.getElementById("badgeDesc").textContent = feedback.badge.desc;
    
    // Populate Report Card
    const reportHTML = `
        <div class="feedback-item">
            <strong>📊 Análisis de Impacto:</strong>
            <p>${feedback.analysis}</p>
        </div>
        <div class="feedback-item">
            <strong>💡 Recomendación Personalizada:</strong>
            <p>${feedback.recommendation}</p>
        </div>
    `;
    const reportEl = document.getElementById("feedbackReport");
    if(reportEl) reportEl.innerHTML = reportHTML;
    
    generateForumText(feedback);
}

function analyzePerformance() {
    const eco = AppState.scores.eco;
    const ethics = AppState.scores.ethics;
    
    let badge = { icon: "😐", title: "Consultor Neutro", desc: "Tus decisiones no mostraron una tendencia clara." };
    let analysis = "";
    let recommendation = "";
    
    // Logic for Badges & Analysis
    if (eco >= 40 && ethics >= 40) {
        badge = { icon: "🌟", title: "Líder Visionario Sostenible", desc: "Excelencia en equilibrio ético y ambiental." };
        analysis = "Has demostrado que es posible innovar sin sacrificar el planeta ni los valores humanos. Tus elecciones en energía y privacidad fueron ejemplares.";
        recommendation = "Continúa promoviendo la 'Tecnología para el Bien' (Tech4Good). Podrías liderar proyectos de transformación digital responsable.";
    } else if (eco >= 40) {
        badge = { icon: "🌿", title: "Defensor del Planeta", desc: "Fuerte compromiso ambiental." };
        analysis = "Tu prioridad es claramente la sostenibilidad ecológica. Sin embargo, asegúrate de no descuidar los aspectos éticos sociales como la privacidad.";
        recommendation = "Busca integrar más la ciberética en tus propuestas verdes.";
    } else if (ethics >= 40) {
        badge = { icon: "⚖️", title: "Guardián de la Ética", desc: "Alta integridad moral." };
        analysis = "Proteges a las personas y sus derechos por encima de todo. Es una cualidad vital en la era de la IA.";
        recommendation = "Intenta buscar soluciones que también regeneren el medio ambiente.";
    } else if (eco < 0 || ethics < 0) {
        badge = { icon: "⚠️", title: "Enfoque de Alto Riesgo", desc: "Decisiones centradas en ganancia inmediata." };
        analysis = "Tus decisiones favorecieron el corto plazo o la conveniencia, poniendo en riesgo el entorno o la confianza de los usuarios.";
        recommendation = "Reflexiona: ¿Vale la pena la ganancia rápida si daña el futuro? Revisa los conceptos de Responsabilidad Social Corporativa.";
    } else {
        analysis = "Tus decisiones fueron equilibradas pero conservadoras.";
        recommendation = "Toma posturas más firmes en situaciones críticas.";
    }
    
    return { badge, analysis, recommendation };
}

function generateForumText(feedback) {
    const s = AppState.student;
    const d = AppState.finalData;
    
    let t = `=== PROYECTO INTEGRADOR: CULTURA DIGITAL II ===\n`;
    t += `👨‍💻 Consultor: ${s.name}\n🏁 Perfil: ${feedback.badge.title}\n`;
    t += `📊 Balance: Eco ${AppState.scores.eco} pts | Ética ${AppState.scores.ethics} pts\n\n`;
    
    t += `ANÁLISIS DE IA:\n"${feedback.analysis}"\n\n`;
    
    t += `REFLEXIÓN BILINGÜE:\n🇪🇸 ${d.es}\n🇬🇧 ${d.en}\n\n`;
    t += `ARGUMENTO ÉTICO:\n${d.arg}\n\n`;
    t += `Código: PROY-${Date.now().toString().slice(-4)}`;
    
    document.getElementById("forumText").textContent = t;
}

function switchSection(hide, show) {
    document.getElementById(hide).classList.add("hidden");
    document.getElementById(hide).classList.remove("show");
    
    const el = document.getElementById(show);
    el.classList.remove("hidden");
    el.classList.add("show");
}

function copyToClipboard() {
    const t = document.getElementById("forumText").textContent;
    navigator.clipboard.writeText(t).then(() => alert("Texto copiado al portapapeles"));
}
