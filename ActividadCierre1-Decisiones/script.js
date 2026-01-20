const AppState = {
    student: { name: "", career: "", group: "" },
    step: 0,
    health: 50, // Starts at 50%
    decisions: []
};

const CAREERS = [
  "TÉCNICO EN ACUACULTURA", "TÉCNICO EN MECÁNICA NAVAL", 
  "TÉCNICO EN PREPARACIÓN DE ALIMENTOS Y BEBIDAS", "TÉCNICO EN RECREACIONES ACUÁTICAS",
  "TÉCNICO EN REFRIGERACIÓN Y CLIMATIZACIÓN", "TÉCNICO LABORATORISTA AMBIENTAL"
];

const SCENARIOS = [
    {
        id: 1,
        icon: "📰",
        title: "Uso de Información Digital",
        desc: "Encuentras una noticia impactante en redes sociales pero no tiene autor ni fecha.",
        optionA: { text: "Compartirla inmediatamente para avisar a todos", score: 0, type: "Impulsivo" },
        optionB: { text: "Verificar la fuente antes de compartir", score: 20, type: "Responsable" }
    },
    {
        id: 2,
        icon: "📂",
        title: "Organización de Datos",
        desc: "Tu escritorio está lleno de archivos 'tarea1.doc', 'final.jpg', 'asd.txt'.",
        optionA: { text: "Dejarlos así, ya los encontraré luego", score: 0, type: "Desordenado" },
        optionB: { text: "Crear carpetas y renombrar con fecha y materia", score: 20, type: "Organizado" }
    },
    {
        id: 3,
        icon: "📱",
        title: "Consumo Tecnológico",
        desc: "Salió el nuevo teléfono modelo X. Tu teléfono actual todavía funciona bien.",
        optionA: { text: "Comprar el nuevo a crédito y tirar el viejo", score: 0, type: "Consumista" },
        optionB: { text: "Seguir usando el actual hasta que falle", score: 20, type: "Consciente" }
    },
    {
        id: 4,
        icon: "♻️",
        title: "Impacto Ambiental",
        desc: "Tienes cables y baterías viejas que ya no sirven.",
        optionA: { text: "Tirarlos a la basura normal", score: 0, type: "Contaminante" },
        optionB: { text: "Llevarlos a un centro de acopio electrónico", score: 20, type: "Sostenible" }
    },
    {
        id: 5,
        icon: "💬",
        title: "Uso Ético",
        desc: "Ves que en el grupo de chat están burlándose de un compañero con memes.",
        optionA: { text: "Ignorar o reírse para encajar", score: 0, type: "Cómplice" },
        optionB: { text: "No participar y reportar si es grave", score: 20, type: "Ético" }
    },
    // New Scenarios
    {
        id: 6,
        icon: "🔐",
        title: "Seguridad de Contraseñas",
        desc: "Creas una cuenta importante. ¿Qué contraseña eliges?",
        optionA: { text: "123456 o mi nombre (Fácil de recordar)", score: 0, type: "Vulnerable" },
        optionB: { text: "Combinación compleja única", score: 20, type: "Seguro" }
    },
    {
        id: 7,
        icon: "🎣",
        title: "Correo Sospechoso (Phishing)",
        desc: "Te llega un correo diciendo 'Ganaste un iPhone', pide hacer clic en un link urgente.",
        optionA: { text: "Entrar al link por curiosidad", score: 0, type: "Ingenuo" },
        optionB: { text: "Marcar como spam y borrarlo", score: 20, type: "Alerta" }
    },
    {
        id: 8,
        icon: "💾",
        title: "Software Pirata",
        desc: "Necesitas un programa de edición costoso para una tarea escolar.",
        optionA: { text: "Descargar crack ilegal con posible virus", score: 0, type: "Ilegal/Riesgoso" },
        optionB: { text: "Buscar alternativa Open Source gratuita", score: 20, type: "Legal" }
    },
    {
        id: 9,
        icon: "👁️",
        title: "Privacidad en Redes",
        desc: "Subes fotos de tus vacaciones familiares mientras estás fuera.",
        optionA: { text: "Perfil público con ubicación en tiempo real", score: 0, type: "Expuesto" },
        optionB: { text: "Perfil privado y publicar al regresar", score: 20, type: "Prudente" }
    },
    {
        id: 10,
        icon: "🧠",
        title: "Bienestar Digital",
        desc: "Estás haciendo tarea pero las notificaciones no paran de sonar.",
        optionA: { text: "Contestar cada mensaje inmediatamente", score: 0, type: "Distraído" },
        optionB: { text: "Poner modo 'No Molestar' un rato", score: 20, type: "Enfocado" }
    }
];

document.addEventListener("DOMContentLoaded", () => {
    initRegistration();
    
    document.getElementById("choiceA").onclick = () => makeDecision('A');
    document.getElementById("choiceB").onclick = () => makeDecision('B');
    document.getElementById("copyBtn").onclick = copyToClipboard;
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
        
        document.getElementById("registration").classList.add("hidden");
        document.getElementById("gameSection").classList.remove("hidden");
        document.getElementById("gameSection").classList.add("show");
        updateBattery();
        loadScenario(0);
    };
}

function loadScenario(index) {
    if(index >= SCENARIOS.length) {
        finishGame();
        return;
    }
    const s = SCENARIOS[index];
    // Add simple animation for card transition
    const card = document.getElementById("scenarioCard");
    card.style.opacity = 0;
    setTimeout(() => {
        document.getElementById("scenarioIcon").textContent = s.icon;
        document.getElementById("scenarioTitle").textContent = `${index + 1}. ${s.title}`;
        document.getElementById("scenarioDesc").textContent = s.desc;
        document.getElementById("choiceA").textContent = s.optionA.text;
        document.getElementById("choiceB").textContent = s.optionB.text;
        card.style.opacity = 1;
    }, 200);
}

function updateBattery() {
    const fill = document.getElementById("batteryFill");
    const txt = document.getElementById("batteryText");
    
    // Clamp between 0 and 100
    if(AppState.health > 100) AppState.health = 100;
    if(AppState.health < 0) AppState.health = 0;
    
    fill.style.width = `${AppState.health}%`;
    txt.textContent = `Energía Digital: ${AppState.health}%`;
    
    // Color change based on health
    if(AppState.health > 60) fill.style.background = "#5a7a4f"; // Green
    else if(AppState.health > 30) fill.style.background = "#ffcc00"; // Yellow
    else fill.style.background = "#8b3a3a"; // Red
}

function makeDecision(choice) {
    const s = SCENARIOS[AppState.step];
    const opt = choice === 'A' ? s.optionA : s.optionB;
    const overlay = document.getElementById("feedbackOverlay");
    
    // Visual Feedback
    if(opt.score > 0) {
        AppState.health += 15; // Bonus for good choice
        overlay.textContent = "👍 +Energía";
        overlay.className = "feedback-overlay show-correct";
    } else {
        AppState.health -= 15; // Penalty
        overlay.textContent = "👎 -Energía";
        overlay.className = "feedback-overlay show-wrong";
    }
    
    // Reset overlay animation class
    setTimeout(() => {
        overlay.className = "feedback-overlay";
    }, 1000);

    AppState.decisions.push(opt.type);
    updateBattery();
    
    AppState.step++;
    setTimeout(() => loadScenario(AppState.step), 1000); // Delay for animation
}

function finishGame() {
    document.getElementById("gameSection").classList.add("hidden");
    document.getElementById("resultSection").classList.remove("hidden");
    document.getElementById("resultSection").classList.add("show");
    
    const score = AppState.health;
    let badge = { icon: "😐", title: "Ciudadano Digital en Proceso", desc: "Aún puedes mejorar tus decisiones." };
    
    if (score >= 80) badge = { icon: "🌟", title: "Ciudadano Digital Ejemplar", desc: "¡Energía al máximo! Eres un ejemplo a seguir." };
    else if (score >= 40) badge = { icon: "✅", title: "Ciudadano Consciente", desc: "Bien hecho, mantienes un buen equilibrio." };
    else badge = { icon: "🪫", title: "Necesitas Recarga", desc: "Tus decisiones agotaron tu reputación digital. ¡Cuidado!" };
    
    document.getElementById("resultIcon").textContent = badge.icon;
    document.getElementById("resultTitle").textContent = badge.title;
    document.getElementById("resultDesc").textContent = badge.desc;
    document.getElementById("scoreText").textContent = `Energía Final: ${score}%`;
    
    generateForumText(badge);
}

function generateForumText(badge) {
    const s = AppState.student;
    let t = `=== ACTIVIDAD DE CIERRE 1: TOMA DE DECISIONES ===\n`;
    t += `Alumno: ${s.name}\nGrupo: ${s.group}\n`;
    t += `Nivel: ${badge.title} (Energía: ${AppState.health}%)\n\n`;
    t += `PERFIL DE JUEGO:\n${AppState.decisions.join(" - ")}\n\n`;
    t += `Código: GAMER-${Date.now().toString().slice(-4)}`;
    
    document.getElementById("forumText").textContent = t;
}

function copyToClipboard() {
    const t = document.getElementById("forumText").textContent;
    navigator.clipboard.writeText(t).then(() => alert("Texto copiado al portapapeles"));
}
