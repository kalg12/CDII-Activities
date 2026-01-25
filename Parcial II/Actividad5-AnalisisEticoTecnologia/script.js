// Estado global de la aplicación
const AppState = {
  studentData: {
    fullName: "",
    career: "",
    group: "",
  },
  analysisData: {
    postura: "",
    argumento: "",
    beneficiosRiesgos: ""
  },
  completionCode: "",
};

// Configuración de carreras técnicas
const CAREERS = [
  "TÉCNICO EN ACUACULTURA",
  "TÉCNICO EN MECÁNICA NAVAL",
  "TÉCNICO EN PREPARACIÓN DE ALIMENTOS Y BEBIDAS",
  "TÉCNICO EN RECREACIONES ACUÁTICAS",
  "TÉCNICO EN REFRIGERACIÓN Y CLIMATIZACIÓN",
  "TÉCNICO LABORATORISTA AMBIENTAL",
];

// Utilidades
function safeTrim(str) {
  return (str || "").trim().replace(/\s+/g, " ");
}

function showElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.remove("hidden");
    element.classList.add("show", "fade-in");
  }
}

function hideElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.add("fade-out");
    setTimeout(() => {
      element.classList.add("hidden");
      element.classList.remove("show", "fade-out");
    }, 300);
  }
}

function showFeedback(message, type = "info") {
  let feedbackElement = document.getElementById("feedbackMessage");
  if (!feedbackElement) {
    feedbackElement = document.createElement("div");
    feedbackElement.id = "feedbackMessage";
    feedbackElement.className = "feedback-message";
    document.body.appendChild(feedbackElement);
  }
  feedbackElement.textContent = message;
  feedbackElement.className = `feedback-message ${type} show`;
  setTimeout(() => {
    feedbackElement.classList.remove("show");
  }, 3000);
}

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM cargado, inicializando Actividad 5...");
  const footerYear = document.getElementById("footerYear");
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  initializeRegistration();
});

// Sistema de registro
function initializeRegistration() {
  const careerSelect = document.getElementById("career");
  const studentForm = document.getElementById("studentForm");

  if (careerSelect) {
    careerSelect.innerHTML = '<option value="">Selecciona tu carrera</option>';
    CAREERS.forEach((career) => {
      const option = document.createElement("option");
      option.value = career;
      option.textContent = career;
      careerSelect.appendChild(option);
    });
  }

  if (studentForm) {
    studentForm.addEventListener("submit", handleRegistrationSubmit);
  }
}

function handleRegistrationSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);

  const fullName = safeTrim(formData.get("fullName"));
  const career = formData.get("career");
  const group = formData.get("group");

  if (!fullName || fullName.length < 6) {
    showFeedback("Ingresa tu nombre completo (mínimo 6 caracteres)", "error");
    return;
  }
  if (!career) {
    showFeedback("Selecciona tu carrera", "error");
    return;
  }
  if (!group) {
    showFeedback("Selecciona tu grupo", "error");
    return;
  }

  AppState.studentData = { fullName, career, group };

  hideElement("registration");
  showElement("analysisSection");
  initializeAnalysisSection();
}

// Lógica de la Sección de Análisis
function initializeAnalysisSection() {
    const saveBtn = document.getElementById("saveAnalysisBtn");
    
    // Inputs para contar caracteres
    const inputs = ['postura', 'argumento', 'beneficiosRiesgos'];
    const countIds = ['posturaCount', 'argumentoCount', 'brCount'];
    
    inputs.forEach((id, index) => {
        const el = document.getElementById(id);
        if(el) {
            el.addEventListener('input', () => {
                const len = el.value.length;
                const countEl = document.getElementById(countIds[index]);
                if(countEl) {
                    countEl.textContent = len;
                    if(len < 50) {
                        countEl.parentElement.style.color = "var(--danger)";
                        countEl.className = "warning";
                    } else {
                        countEl.parentElement.style.color = "var(--ok)";
                        countEl.className = "success";
                    }
                }
            });
        }
    });

    if (saveBtn) {
        saveBtn.addEventListener("click", handleAnalysisSubmit);
    }
}

function handleAnalysisSubmit() {
    const postura = document.getElementById("postura").value.trim();
    const argumento = document.getElementById("argumento").value.trim();
    const br = document.getElementById("beneficiosRiesgos").value.trim();
    
    // Validación simple
    if(postura.length < 50 || argumento.length < 50 || br.length < 50) {
        showFeedback("Por favor completa todos los campos con al menos 50 caracteres para una buena reflexión.", "error");
        return;
    }

    AppState.analysisData = {
        postura: postura,
        argumento: argumento,
        beneficiosRiesgos: br
    };

    showFinalResult();
}

function showFinalResult() {
  hideElement("analysisSection");
  showElement("finalResult");

  // Actualizar datos de estudiante
  updateText("resultName", AppState.studentData.fullName);
  updateText("resultCareer", AppState.studentData.career);
  updateText("resultGroup", AppState.studentData.group);
  updateText("resultDate", new Date().toLocaleString());

  // Mostrar Reflexión
  updateText("displayPostura", AppState.analysisData.postura);
  updateText("displayArgumento", AppState.analysisData.argumento);
  updateText("displayBR", AppState.analysisData.beneficiosRiesgos);

  // Código
  const code = generateCompletionCode();
  AppState.completionCode = code;

  // Foro
  generateForumText();

  // Listeners finales
  const copyBtn = document.getElementById("copyForumBtn");
  if (copyBtn) {
    const newBtn = copyBtn.cloneNode(true);
    copyBtn.parentNode.replaceChild(newBtn, copyBtn);
    newBtn.addEventListener("click", copyToClipboard);
  }

  const newActivityBtn = document.getElementById("newActivity");
  if (newActivityBtn) {
    newActivityBtn.addEventListener("click", () => location.reload());
  }
}

function updateText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function generateCompletionCode() {
  const hash = btoa(AppState.studentData.fullName).slice(0, 6).toUpperCase();
  const random = Math.floor(Math.random() * 10000);
  return `ACT5-${hash}-${random}`;
}

function generateForumText() {
  const s = AppState.studentData;
  const a = AppState.analysisData;

  let text = `=== ACTIVIDAD 5: ANÁLISIS ÉTICO DEL USO DE LA TECNOLOGÍA ===\n`;
  text += `Nombre: ${s.fullName}\nCarrera: ${s.career}\nGrupo: ${s.group}\n\n`;
  
  text += `PREGUNTA: ¿El avance tecnológico siempre mejora la vida de las personas?\n\n`;
  
  text += `POSTURA PERSONAL:\n${a.postura}\n\n`;
  text += `ARGUMENTO/JUSTIFICACIÓN:\n${a.argumento}\n\n`;
  text += `BENEFICIOS Y RIESGOS:\n${a.beneficiosRiesgos}\n\n`;
  
  text += `Código de Verificación: ${AppState.completionCode}`;

  const forumEl = document.getElementById("forumText");
  if (forumEl) forumEl.textContent = text;

  return text;
}

function copyToClipboard() {
  const text = document.getElementById("forumText").textContent;
  navigator.clipboard.writeText(text).then(() => {
    showFeedback("Copiado al portapapeles", "success");
  }).catch(() => {
    showFeedback("Error al copiar", "error");
  });
}
