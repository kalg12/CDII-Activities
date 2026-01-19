// Estado global de la aplicación
const AppState = {
  studentData: {
    fullName: "",
    career: "",
    group: "",
  },
  activityData: {
    matchedPairs: [],
    spanishOpinion: "",
    englishOpinion: "",
  },
  currentSelection: {
    scenario: null,
    consequence: null,
  },
  completionCode: "",
};

// Configuración de carreras técnicas (Igual que Actividad 2)
const CAREERS = [
  "TÉCNICO EN ACUACULTURA",
  "TÉCNICO EN MECÁNICA NAVAL",
  "TÉCNICO EN PREPARACIÓN DE ALIMENTOS Y BEBIDAS",
  "TÉCNICO EN RECREACIONES ACUÁTICAS",
  "TÉCNICO EN REFRIGERACIÓN Y CLIMATIZACIÓN",
  "TÉCNICO LABORATORISTA AMBIENTAL",
];

// Pares correctos para la actividad de relación
const CORRECT_PAIRS = {
  "excessive-phone": "health-issues",
  "social-media": "academic-impact",
  "fake-news": "misinformation",
  "digital-wellness": "wellness-benefits",
  "ai-homework": "ai-dependency", // Nuevo par agregado
};

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
  console.log("DOM cargado, inicializando Actividad 4...");
  const footerYear = document.getElementById("footerYear");
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  initializeRegistration();
});

// Sistema de registro (Copiado de Actividad 2)
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
  showElement("interactiveActivity");
  initializeInteractiveActivity();
}

// Lógica del Juego de Relación
function initializeInteractiveActivity() {
  const scenarios = document.querySelectorAll(".scenario-card");
  const consequences = document.querySelectorAll(".consequence-card");
  const finishBtn = document.getElementById("finishMatchingBtn");

  scenarios.forEach(card => {
    card.addEventListener("click", () => handleCardClick(card, 'scenario'));
  });

  consequences.forEach(card => {
    card.addEventListener("click", () => handleCardClick(card, 'consequence'));
  });

  if (finishBtn) {
    finishBtn.addEventListener("click", finishMatching);
  }
}

function handleCardClick(card, type) {
  if (card.classList.contains("matched")) return;

  // Manejo de selección
  if (type === 'scenario') {
    // Si ya hay uno seleccionado, deseleccionarlo
    if (AppState.currentSelection.scenario) {
      AppState.currentSelection.scenario.classList.remove("selected");
    }
    // Si cliquea el mismo, solo deseleccionar
    if (AppState.currentSelection.scenario === card) {
      AppState.currentSelection.scenario = null;
      return;
    }
    card.classList.add("selected");
    AppState.currentSelection.scenario = card;
  } else {
    if (AppState.currentSelection.consequence) {
      AppState.currentSelection.consequence.classList.remove("selected");
    }
    if (AppState.currentSelection.consequence === card) {
      AppState.currentSelection.consequence = null;
      return;
    }
    card.classList.add("selected");
    AppState.currentSelection.consequence = card;
  }

  // Verificar si hay ambos seleccionados
  if (AppState.currentSelection.scenario && AppState.currentSelection.consequence) {
    checkMatch();
  }
}

function checkMatch() {
  const scenarioCard = AppState.currentSelection.scenario;
  const consequenceCard = AppState.currentSelection.consequence;
  const messageEl = document.getElementById("gameMessage");

  const scenarioId = scenarioCard.dataset.id;
  const consequenceTarget = consequenceCard.dataset.target;

  // Lógica de validación
  if (CORRECT_PAIRS[scenarioId] === consequenceTarget) {
    // Correcto
    scenarioCard.classList.remove("selected");
    consequenceCard.classList.remove("selected");
    scenarioCard.classList.add("matched");
    consequenceCard.classList.add("matched");

    AppState.activityData.matchedPairs.push({
      scenario: scenarioCard.querySelector("h4").textContent,
      consequence: consequenceCard.querySelector("h4").textContent
    });

    AppState.currentSelection = { scenario: null, consequence: null };

    // Mensaje
    messageEl.textContent = "¡Correcto!";
    messageEl.className = "game-message success";

    updateGameStatus();
  } else {
    // Incorrecto
    messageEl.textContent = "Incorrecto, intenta de nuevo.";
    messageEl.className = "game-message error";

    scenarioCard.classList.add("error-shake");
    consequenceCard.classList.add("error-shake");

    setTimeout(() => {
      scenarioCard.classList.remove("error-shake", "selected");
      consequenceCard.classList.remove("error-shake", "selected");
      AppState.currentSelection = { scenario: null, consequence: null };
      messageEl.textContent = "";
    }, 500);
  }
}

function updateGameStatus() {
  const count = AppState.activityData.matchedPairs.length;
  document.getElementById("matchCount").textContent = count;

  // Ahora esperamos 5 pares
  if (count === 5) {
    document.getElementById("gameMessage").textContent = "¡Excelente! Has completado el juego.";
    document.getElementById("finishMatchingBtn").disabled = false;
  }
}

function finishMatching() {
  hideElement("interactiveActivity");
  showElement("opinionSection");
  initializeOpinionSection();

  AppState.activityData.generatedPhrase = "Technological decisions shape our daily life and future.";
}

// Sistema de Opinión con Traducción
function initializeOpinionSection() {
  const saveBtn = document.getElementById("saveOpinion");
  const translateBtn = document.getElementById("translateBtn");
  const spanishOpinion = document.getElementById("spanishOpinion");

  if (spanishOpinion) {
    spanishOpinion.addEventListener("input", () => updateWordCount("spanish"));
  }

  if (saveBtn) saveBtn.addEventListener("click", saveOpinions);
  if (translateBtn) translateBtn.addEventListener("click", handleTranslation);
}

function updateWordCount(lang) {
  const id = "spanishOpinion";
  const countId = "spanishWordCount";

  if (lang === "english") {
    // Logic for English count if needed, or skip
    return;
  }

  const val = document.getElementById(id).value.trim();
  // Contar palabras
  const wordCount = val ? val.split(/\s+/).length : 0;

  const countEl = document.getElementById(countId);
  const limit = 25;

  if (countEl) {
    countEl.textContent = wordCount;
    if (wordCount > limit) {
      countEl.className = "character-count warning";
      countEl.parentElement.querySelector(".limit-instruction").style.color = "var(--danger)";
    } else {
      countEl.className = "character-count success";
      countEl.parentElement.querySelector(".limit-instruction").style.color = "initial";
    }
  }
}

async function handleTranslation() {
  const spanishText = document.getElementById("spanishOpinion").value.trim();
  if (!spanishText) {
    showFeedback("Escribe algo para traducir", "error");
    return;
  }

  const translateBtn = document.getElementById("translateBtn");
  const englishArea = document.getElementById("englishOpinion");

  translateBtn.disabled = true;
  translateBtn.textContent = "Traduciendo...";
  englishArea.placeholder = "Translating...";

  try {
    // Usar MyMemory API (Free for limited use)
    // URL encode the text
    const encodedText = encodeURIComponent(spanishText);
    const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=es|en`;

    const response = await fetch(url);
    const data = await response.json();

    if (data && data.responseData && data.responseData.translatedText) {
      englishArea.value = data.responseData.translatedText;
      showFeedback("Traducción completada", "success");
      // Update word count for English?
      document.getElementById("englishWordCount").textContent = englishArea.value.split(/\s+/).length;
    } else {
      throw new Error("No translation returned");
    }

  } catch (error) {
    console.error("Translation error:", error);
    showFeedback("Error al traducir. Intenta de nuevo o escribe manualmente.", "error");
    englishArea.readOnly = false; // Permitir edición manual si falla
    englishArea.value = "[Error de conexión. Por favor escribe tu opinión en inglés aquí]";
  } finally {
    translateBtn.disabled = false;
    translateBtn.textContent = "🔄 Traducir a Inglés (Auto-Translate)";
  }
}

function saveOpinions() {
  const spanish = document.getElementById("spanishOpinion").value.trim();
  const english = document.getElementById("englishOpinion").value.trim();
  const wordCount = spanish ? spanish.split(/\s+/).length : 0;

  if (wordCount > 25) {
    showFeedback(`Tu opinión excede el límite de 25 palabras (tienes ${wordCount})`, "error");
    return;
  }

  if (spanish.length < 10) { // Check minimal content
    showFeedback("Escribe una opinión válida", "error");
    return;
  }

  if (!english) {
    showFeedback("Falta la traducción al inglés", "error");
    return;
  }

  AppState.activityData.spanishOpinion = spanish;
  AppState.activityData.englishOpinion = english;

  showFinalResult();
}
function showFinalResult() {
  hideElement("opinionSection");
  showElement("finalResult");

  // Actualizar datos de estudiante
  updateText("resultName", AppState.studentData.fullName);
  updateText("resultCareer", AppState.studentData.career);
  updateText("resultGroup", AppState.studentData.group);
  updateText("resultDate", new Date().toLocaleString());

  // Actualizar resumen de actividad
  // Como cambiamos la dinámica, mostraremos "Completado" en lugar de un solo escenario
  updateText("resultScenario", "Actividad de Relación (4 pares)");
  updateText("resultConsequence", "Todas las conexiones correctas");
  updateText("resultPhrase", AppState.activityData.generatedPhrase);

  updateText("resultSpanish", AppState.activityData.spanishOpinion);
  updateText("resultEnglish", AppState.activityData.englishOpinion);

  // Código
  const code = generateCompletionCode();
  AppState.completionCode = code;

  // Foro
  generateForumText();

  // Listeners finales
  const copyBtn = document.getElementById("copyForumBtn");
  if (copyBtn) {
    // Remover listeners anteriores para evitar duplicados si se reinicia (aunque aquí no hay reinicio fácil)
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
  return `CD4-${hash}-${random}`;
}

function generateForumText() {
  const s = AppState.studentData;
  const a = AppState.activityData;

  let text = `=== ACTIVIDAD 4: COMUNICACIÓN DIGITAL RESPONSABLE ===\n`;
  text += `Nombre: ${s.fullName}\nCarrera: ${s.career}\nGrupo: ${s.group}\n\n`;
  text += `ACTIVIDAD REALIZADA:\nSe han identificado correctamente las consecuencias del uso de la tecnología.\n\n`;
  text += `OPINIÓN PERSONAL:\n🇪🇸 ${a.spanishOpinion}\n\n🇬🇧 ${a.englishOpinion}\n\n`;
  text += `Código: ${AppState.completionCode}`;

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

