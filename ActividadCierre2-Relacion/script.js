const AppState = { name: "", group: "", career: "" };

const CAREERS = [
  "TÉCNICO EN ACUACULTURA", "TÉCNICO EN MECÁNICA NAVAL", 
  "TÉCNICO EN PREPARACIÓN DE ALIMENTOS Y BEBIDAS", "TÉCNICO EN RECREACIONES ACUÁTICAS",
  "TÉCNICO EN REFRIGERACIÓN Y CLIMATIZACIÓN", "TÉCNICO LABORATORISTA AMBIENTAL"
];

const DATA = [
    { id: 1, concept: "ENERGÍA", def: "Recurso vital que impulsa la tecnología y los centros de datos." },
    { id: 2, concept: "ÉTICA DIGITAL", def: "Disciplina que distingue el buen uso del mal uso en la red." },
    { id: 3, concept: "RESPONSABILIDAD", def: "Cualidad de usar la tecnología asumiendo las consecuencias." },
    { id: 4, concept: "GRÁFICOS", def: "Representaciones visuales para facilitar la comprensión de datos." },
    { id: 5, concept: "DATOS", def: "Materia prima de la información digital (hechos, cifras)." }
];

let selectedConcept = null;
let selectedDef = null;
let matchesFound = 0;

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
    
    document.getElementById("studentForm").onsubmit = (e) => {
        e.preventDefault();
        const n = document.getElementById("fullName").value.trim();
        const g = document.getElementById("group").value;
        const c = document.getElementById("career").value;
        
        if(n && g && c) {
            AppState.name = n;
            AppState.group = g;
            AppState.career = c;
            document.querySelector("#registration").classList.add("hidden");
            document.querySelector("#gameSection").classList.remove("hidden");
            document.querySelector("#gameSection").classList.add("show");
            initGame();
        } else {
            alert("Completa todos los datos");
        }
    };
    
    document.getElementById("copyBtn").onclick = () => {
        navigator.clipboard.writeText(document.getElementById("forumText").textContent)
        .then(() => alert("Texto copiado al portapapeles"));
    };
});

function initGame() {
    const conceptsList = document.getElementById("conceptsList");
    const definitionsList = document.getElementById("definitionsList");
    
    // Convert to array and shuffle definitions
    let concepts = [...DATA];
    let definitions = [...DATA].sort(() => Math.random() - 0.5);
    
    concepts.forEach(item => {
        const card = createCard(item.concept, item.id, 'concept');
        conceptsList.appendChild(card);
    });
    
    definitions.forEach(item => {
        const card = createCard(item.def, item.id, 'def');
        definitionsList.appendChild(card);
    });
}

function createCard(text, id, type) {
    const div = document.createElement("div");
    div.className = "card";
    div.textContent = text;
    div.dataset.id = id;
    div.dataset.type = type;
    div.onclick = () => handleCardClick(div);
    return div;
}

function handleCardClick(card) {
    if(card.classList.contains("matched")) return;
    
    const type = card.dataset.type;
    
    // Select logic
    if(type === 'concept') {
        if(selectedConcept) selectedConcept.classList.remove("selected");
        selectedConcept = card;
        card.classList.add("selected");
    } else {
        if(selectedDef) selectedDef.classList.remove("selected");
        selectedDef = card;
        card.classList.add("selected");
    }
    
    // Check match
    if(selectedConcept && selectedDef) {
        checkMatch();
    }
}

function checkMatch() {
    const id1 = selectedConcept.dataset.id;
    const id2 = selectedDef.dataset.id;
    
    if(id1 === id2) {
        // Match!
        selectedConcept.classList.add("matched");
        selectedDef.classList.add("matched");
        selectedConcept.classList.remove("selected");
        selectedDef.classList.remove("selected");
        
        selectedConcept = null;
        selectedDef = null;
        matchesFound++;
        document.getElementById("matchCount").textContent = matchesFound;
        
        if(matchesFound === DATA.length) {
            setTimeout(showResult, 1000);
        }
    } else {
        // No match
        selectedConcept.classList.add("shake");
        selectedDef.classList.add("shake");
        
        setTimeout(() => {
            selectedConcept.classList.remove("shake", "selected");
            selectedDef.classList.remove("shake", "selected");
            selectedConcept = null;
            selectedDef = null;
        }, 500);
    }
}

function showResult() {
    document.getElementById("gameSection").classList.add("hidden");
    document.getElementById("resultSection").classList.remove("hidden");
    document.getElementById("resultSection").classList.add("show");
    
    let t = `=== ACTIVIDAD DE CIERRE 2: CONEXIÓN DE SABERES ===\n`;
    t += `Alumno: ${AppState.name}\nCarrera: ${AppState.career} | Grupo: ${AppState.group}\n`;
    t += `Resultado: Conceptos Conectados (100%)\n`;
    t += `Código: KNOWLEDGE-${Date.now().toString().slice(-4)}`;
    
    document.getElementById("forumText").textContent = t;
}
