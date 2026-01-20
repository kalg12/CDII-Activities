const AppState = { name: "", group: "" };

const LAYOUT = [
    { word: "ENERGIA", r: 1, c: 1, d: 'h' },
    { word: "GRAFICOS", r: 0, c: 4, d: 'v' }, // Intersects ENERGIA at G(1,4)
    { word: "ETICA", r: 3, c: 6, d: 'h' }, 
    { word: "DATOS", r: 5, c: 5, d: 'h' },
    { word: "RESPONSABLE", r: 0, c: 8, d: 'v' }
];

const gridCells = {};

LAYOUT.forEach(item => {
    for(let i=0; i<item.word.length; i++) {
        let r = item.r + (item.d==='v'?i:0);
        let c = item.c + (item.d==='h'?i:0);
        const key = `${r},${c}`;
        if(!gridCells[key]) gridCells[key] = { answer: item.word[i], ids: [] };
    }
});

document.addEventListener("DOMContentLoaded", () => {
    renderGrid();
    
    document.getElementById("studentForm").onsubmit = (e) => {
        e.preventDefault();
        const n = document.getElementById("fullName").value.trim();
        const g = document.getElementById("group").value;
        if(n && g) {
            AppState.name = n;
            AppState.group = g;
            document.querySelector("#registration").classList.add("hidden");
            document.querySelector("#gameSection").classList.remove("hidden");
            document.querySelector("#gameSection").classList.add("show");
        } else {
            alert("Completa los datos");
        }
    };
    
    document.getElementById("checkBtn").onclick = checkAnswers;
    document.getElementById("copyBtn").onclick = () => {
        navigator.clipboard.writeText(document.getElementById("forumText").textContent)
        .then(() => alert("Texto copiado al portapapeles"));
    };
});

function renderGrid() {
    const gridEl = document.getElementById("grid");
    gridEl.innerHTML = "";
    
    for(let r=0; r<12; r++) {
        for(let c=0; c<12; c++) {
            const key = `${r},${c}`;
            const cellDiv = document.createElement("div");
            cellDiv.className = "cell";
            
            if(gridCells[key]) {
                const inp = document.createElement("input");
                inp.maxLength = 1;
                inp.dataset.row = r;
                inp.dataset.col = c;
                inp.dataset.answer = gridCells[key].answer;
                inp.oninput = (e) => {
                    e.target.value = e.target.value.toUpperCase();
                    if(e.target.value) focusNext(r, c);
                };
                cellDiv.appendChild(inp);
            } else {
                cellDiv.classList.add("empty");
            }
            gridEl.appendChild(cellDiv);
        }
    }
}

function focusNext(r, c) {
    // Simple logic to try finding the next input in row or col
    // This is a basic enhancement
}

function checkAnswers() {
    const inputs = document.querySelectorAll(".cell input");
    let correct = 0;
    let total = 0;
    
    inputs.forEach(inp => {
        total++;
        if(inp.value.toUpperCase() === inp.dataset.answer) {
            correct++;
            inp.classList.add("correct");
            inp.classList.remove("incorrect");
        } else {
            inp.classList.add("incorrect");
            inp.classList.remove("correct");
        }
    });
    
    const pct = Math.round((correct / total) * 100);
    
    if(pct === 100) {
        showResult(pct);
    } else {
        alert(`Tienes un ${pct}% de aciertos. Revisa las casillas rojas.`);
    }
}

function showResult(pct) {
    document.getElementById("gameSection").classList.add("hidden");
    document.getElementById("resultSection").classList.remove("hidden");
    document.getElementById("resultSection").classList.add("show");
    
    document.getElementById("scoreDisplay").textContent = `${pct}%`;
    
    let t = `=== ACTIVIDAD DE CIERRE 2: CRUCIGRAMA ===\n`;
    t += `Alumno: ${AppState.name} | Grupo: ${AppState.group}\n`;
    t += `Resultado: ${pct}% Aciertos\n`;
    t += `Conceptos: Dominados ✅\n`;
    t += `Código: CRUCI-${Date.now().toString().slice(-4)}`;
    
    document.getElementById("forumText").textContent = t;
}
