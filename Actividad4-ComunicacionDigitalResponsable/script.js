// Estado global de la aplicación
const AppState = {
  studentData: {
    fullName: "",
    career: "",
    group: "",
  },
  activityData: {
    selectedScenario: null,
    selectedConsequence: null,
    generatedPhrase: "",
    spanishOpinion: "",
    englishOpinion: "",
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

// Sistema de retroalimentación
function showFeedback(message, type = "info") {
  // Crear elemento de retroalimentación si no existe
  let feedbackElement = document.getElementById("feedbackMessage");

  if (!feedbackElement) {
    feedbackElement = document.createElement("div");
    feedbackElement.id = "feedbackMessage";
    feedbackElement.className = "feedback-message";
    document.body.appendChild(feedbackElement);
  }

  // Configurar mensaje
  feedbackElement.textContent = message;
  feedbackElement.className = `feedback-message ${type}`;

  // Mostrar mensaje
  feedbackElement.classList.add("show");

  // Ocultar automáticamente después de 3 segundos
  setTimeout(() => {
    feedbackElement.classList.remove("show");
  }, 3000);

  console.log(`Feedback (${type}): ${message}`);
}

// Loading
function showLoading(message = "Procesando...") {
  const overlay = document.getElementById("loadingOverlay");
  const messageElement = overlay?.querySelector(".loading-message");

  if (overlay) {
    overlay.classList.remove("hidden");
    if (messageElement) {
      messageElement.textContent = message;
    }
  }
}

function hideLoading() {
  const overlay = document.getElementById("loadingOverlay");
  if (overlay) {
    overlay.classList.add("hidden");
  }
}

function setButtonLoading(buttonId, loading = true) {
  const button = document.getElementById(buttonId);
  if (!button) return;

  if (loading) {
    button.classList.add("loading");
    button.disabled = true;
  } else {
    button.classList.remove("loading");
    button.disabled = false;
  }
}

// Sistema de registro del estudiante
function initializeRegistration() {
  console.log("Inicializando botón de inicio...");

  const startBtn = document.getElementById("startActivity");

  console.log("Botón encontrado:", startBtn);

  if (!startBtn) {
    console.error("Error: No se encontró el botón de comenzar");
    showFeedback("Error: No se encontró el botón de comenzar", "error");
    return;
  }

  // Agregar evento al botón de comenzar
  startBtn.addEventListener("click", handleStartActivity);

  console.log("Botón de inicio configurado exitosamente");
}

function handleRegistrationSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  AppState.studentData = {
    fullName: safeTrim(formData.get("fullName")),
    career: formData.get("career"),
    group: formData.get("group"),
  };

  console.log("Formulario enviado con datos:", AppState.studentData);

  // Validar datos
  if (
    !AppState.studentData.fullName ||
    AppState.studentData.fullName.length < 6
  ) {
    showFeedback(
      "Por favor, ingresa tu nombre completo (mínimo 6 caracteres)",
      "error",
    );
    return;
  }

  if (!AppState.studentData.career) {
    showFeedback("Por favor, selecciona tu carrera técnica", "error");
    return;
  }

  if (!AppState.studentData.group) {
    showFeedback("Por favor, selecciona tu grupo", "error");
    return;
  }

  console.log("Validación exitosa, transicionando a actividad...");

  // Transición a la actividad interactiva
  hideElement("introduction");
  showElement("interactiveActivity");
  initializeInteractiveActivity();

  console.log("Datos del estudiante registrados:", AppState.studentData);
}

function handleStartActivity() {
  console.log("Iniciando actividad interactiva...");

  showLoading("Iniciando actividad...");
  setButtonLoading("startActivity", true);

  // Simular carga
  setTimeout(() => {
    hideLoading();
    hideElement("introduction");
    showElement("interactiveActivity");
    initializeInteractiveActivity();
    setButtonLoading("startActivity", false);
    console.log("Actividad interactiva iniciada exitosamente");
  }, 1000);
}

// Sistema de actividad interactiva
function initializeInteractiveActivity() {
  console.log("Inicializando actividad interactiva...");

  // Configurar tarjetas de escenario
  const scenarioCards = document.querySelectorAll(".scenario-card");
  const consequenceCards = document.querySelectorAll(".consequence-card");

  console.log("Tarjetas de escenario:", scenarioCards.length);
  console.log("Tarjetas de consecuencia:", consequenceCards.length);

  scenarioCards.forEach((card) => {
    card.addEventListener("click", () => selectScenario(card));
  });

  consequenceCards.forEach((card) => {
    card.addEventListener("click", () => selectConsequence(card));
  });

  // Configurar botón de conexión
  const buildBtn = document.getElementById("buildConnection");
  if (buildBtn) {
    buildBtn.addEventListener("click", buildConnection);
  }

  console.log("Actividad interactiva inicializada");
}

function selectScenario(card) {
  console.log("selectScenario llamado con:", card);
  
  // Remover selección previa
  document.querySelectorAll(".scenario-card.selected").forEach((c) => {
    c.classList.remove("selected");
  });

  // Agregar selección actual
  card.classList.add("selected");

  // Actualizar estado
  AppState.activityData.selectedScenario = {
    element: card,
    text: card.querySelector("h4").textContent,
    description: card.querySelector("p").textContent,
  };

  // Actualizar display
  const displayElement = document.getElementById("selectedScenario");
  if (displayElement) {
    displayElement.textContent = AppState.activityData.selectedScenario.text;
  }

  console.log("Escenario seleccionado:", AppState.activityData.selectedScenario);
}

function selectConsequence(card) {
  console.log("selectConsequence llamado con:", card);
  
  // Remover selección previa
  document.querySelectorAll(".consequence-card.selected").forEach((c) => {
    c.classList.remove("selected");
  });

  // Agregar selección actual
  card.classList.add("selected");

  // Actualizar estado
  AppState.activityData.selectedConsequence = {
    element: card,
    text: card.querySelector("h4").textContent,
    description: card.querySelector("p").textContent,
  };

  // Actualizar display
  const displayElement = document.getElementById("selectedConsequence");
  if (displayElement) {
    displayElement.textContent = AppState.activityData.selectedConsequence.text;
  }

  console.log("Consecuencia seleccionada:", AppState.activityData.selectedConsequence);
}

function buildConnection() {
  console.log("Construyendo conexión...");

  // Validar que ambos elementos estén seleccionados
  if (
    !AppState.activityData.selectedScenario ||
    !AppState.activityData.selectedConsequence
  ) {
    showFeedback(
      "Por favor, selecciona una situación y una consecuencia",
      "error",
    );
    return;
  }

  // Mostrar loading
  showLoading("Generando conexión...");
  setButtonLoading("buildConnection", true);

  // Generar frase en inglés
  setTimeout(() => {
    const phrase = generateConnectionPhrase();
    AppState.activityData.generatedPhrase = phrase;

    // Mostrar resultado
    showConnectionResult(phrase);

    hideLoading();
    setButtonLoading("buildConnection", false);

    // Inicializar sección de opinión y mostrarla
    setTimeout(() => {
      initializeOpinionSection();
      showElement("opinionSection");
    }, 1000);
  }, 1500);
}

function generateConnectionPhrase() {
  const scenario = AppState.activityData.selectedScenario;
  const consequence = AppState.activityData.selectedConsequence;

  // Estructuras de frase
  const connectionTemplates = [
    `${scenario.description} ${consequence.description.toLowerCase()} because it affects our ${getImpactWord(consequence.description)}.`,
    `I believe that ${scenario.description.toLowerCase()} ${consequence.description.toLowerCase()} because it impacts our ${getImpactWord(consequence)}.`,
    `When we ${scenario.description.toLowerCase()}, it often leads to ${consequence.description.toLowerCase()} which ${getConsequenceEffect(consequence)}.`,
    `The connection between ${scenario.description.toLowerCase()} and ${consequence.description.toLowerCase()} is clear: it ${getConsequenceEffect(consequence)}.`,
  ];

  // Seleccionar una frase aleatoria
  const randomIndex = Math.floor(Math.random() * connectionTemplates.length);
  return connectionTemplates[randomIndex];
}

function getImpactWord(consequence) {
  const impacts = {
    "Bajo rendimiento escolar y problemas de concentración":
      "academic performance",
    "Problemas de salud": "health",
    "Difusión de noticias falsas": "information accuracy",
    "Mejor salud mental y más tiempo para actividades reales":
      "personal wellbeing",
  };

  return impacts[consequence.description] || "personal growth";
}

function getConsequenceEffect(consequence) {
  const effects = {
    "Bajo rendimiento escolar y problemas de concentración":
      "reduces our learning ability",
    "Problemas de salud": "harms our physical wellbeing",
    "Difusión de noticias falsas": "spreads misinformation",
    "Mejor salud mental y más tiempo para actividades reales":
      "improves our quality of life",
  };

  return effects[consequence.description] || "shapes our decisions";
}

function showConnectionResult(phrase) {
  const resultDiv = document.getElementById("connectionResult");
  const phraseDiv = document.getElementById("connectionPhrase");
  const meaningDiv = document.getElementById("phraseMeaning");

  // Mostrar frase generada
  phraseDiv.textContent = phrase;

  // Generar significado
  const meaning = `Esta frase conecta tu elección sobre el uso de tecnología con sus consecuencias, mostrando cómo tus decisiones tecnológicas impactan diferentes aspectos de tu vida.`;
  meaningDiv.textContent = meaning;

  // Mostrar sección
  resultDiv.classList.remove("hidden");

  console.log("Frase generada:", phrase);
  console.log("Significado:", meaning);
}

// Sistema de opinión
function initializeOpinionSection() {
  const spanishOpinion = document.getElementById("spanishOpinion");
  const englishOpinion = document.getElementById("englishOpinion");
  const spanishCount = document.getElementById("spanishCharCount");
  const englishCount = document.getElementById("englishCharCount");
  const saveBtn = document.getElementById("saveOpinion");
  const reportBtn = document.getElementById("generateReport");
  const shareBtn = document.getElementById("shareResult");
  const newActivityBtn = document.getElementById("newActivity");

  // Eventos de conteo de caracteres
  if (spanishOpinion) {
    spanishOpinion.addEventListener("input", () => updateCharCount("spanish"));
  }

  if (englishOpinion) {
    englishOpinion.addEventListener("input", () => updateCharCount("english"));
  }

  // Eventos de botones
  if (saveBtn) {
    saveBtn.addEventListener("click", saveOpinions);
  }

  if (reportBtn) {
    reportBtn.addEventListener("click", generateReport);
  }

  if (shareBtn) {
    shareBtn.addEventListener("click", shareResult);
  }

  if (newActivityBtn) {
    newActivityBtn.addEventListener("click", resetActivity);
  }
}

function updateCharCount(language) {
  const countElementId =
    language === "spanish" ? "spanishCharCount" : "englishCharCount";
  const textareaId =
    language === "spanish" ? "spanishOpinion" : "englishOpinion";
  const textarea = document.getElementById(textareaId);
  const countElement = document.getElementById(countElementId);

  if (!textarea || !countElement) return;

  const text = textarea.value.trim();
  const count = text.length;
  const minChars = language === "spanish" ? 100 : 120;

  countElement.textContent = count;

  // Actualizar estilos
  if (count < minChars) {
    countElement.classList.add("warning");
    countElement.classList.remove("success");
  } else {
    countElement.classList.add("success");
    countElement.classList.remove("warning");
  }
}

function saveOpinions() {
  const spanishText = document.getElementById("spanishOpinion").value.trim();
  const englishText = document.getElementById("englishOpinion").value.trim();

  // Validaciones
  if (spanishText.length < 100) {
    showFeedback(
      "Tu opinión en español debe tener al menos 100 caracteres",
      "error",
    );
    document.getElementById("spanishOpinion").focus();
    return;
  }

  if (englishText.length < 120) {
    showFeedback(
      "Your opinion in English must have at least 120 characters",
      "error",
    );
    document.getElementById("englishOpinion").focus();
    return;
  }

  // Guardar en estado
  AppState.activityData.spanishOpinion = spanishText;
  AppState.activityData.englishOpinion = englishText;

  showFeedback("¡Opiniones guardadas exitosamente!", "success");

  console.log("Opiniones guardadas:", {
    spanish: spanishText,
    english: englishText,
  });
}

function generateReport() {
  showFeedback("Generando reporte...", "info");

  // Simulación de generación de reporte
  setTimeout(() => {
    showFeedback("Reporte generado exitosamente", "success");
  }, 1000);
}

function shareResult() {
  generateForumText();
  copyToClipboard();
}

function resetActivity() {
  if (
    !confirm(
      "¿Estás seguro de que quieres iniciar una nueva actividad? Se perderá tu progreso actual.",
    )
  ) {
    return;
  }

  // Limpiar estado
  AppState.activityData = {
    selectedScenario: null,
    selectedConsequence: null,
    generatedPhrase: "",
    spanishOpinion: "",
    englishOpinion: "",
  };

  // Limpiar selecciones visuales
  document.querySelectorAll(".selected").forEach((element) => {
    element.classList.remove("selected");
  });

  // Limpiar displays
  document.getElementById("selectedScenario").textContent = "No seleccionado";
  document.getElementById("selectedConsequence").textContent =
    "No seleccionado";

  // Ocultar secciones avanzadas
  hideElement("opinionSection");
  hideElement("finalResult");
  showElement("interactiveActivity");

  // Limpiar formularios
  document.getElementById("spanishOpinion").value = "";
  document.getElementById("englishOpinion").value = "";

  // Actualizar contadores
  updateCharCount("spanish");
  updateCharCount("english");

  showFeedback("Actividad reiniciada", "info");
}

function generateForumText() {
  const student = AppState.studentData;
  const activity = AppState.activityData;
  const completionCode = generateCompletionCode();

  const lines = [];
  lines.push("=== ACTIVIDAD CULTURA DIGITAL II ===");
  lines.push("");
  lines.push("Actividad 4: Comunicación digital responsable");
  lines.push(`Nombre: ${student.fullName}`);
  lines.push(`Carrera: ${student.career}`);
  lines.push(`Grupo: ${student.group}`);
  lines.push(`Fecha y hora: ${new Date().toLocaleString("es-MX")}`);
  lines.push(`Código: ${completionCode}`);
  lines.push("");
  lines.push("RESUMEN DE LA ACTIVIDAD:");
  lines.push(
    `Situación elegida: ${activity.selectedScenario ? activity.selectedScenario.text : "No especificado"}`,
  );
  lines.push(
    `Consecuencia: ${activity.selectedConsequence ? activity.selectedConsequence.text : "No especificado"}`,
  );
  lines.push(`Frase generada: ${activity.generatedPhrase}`);
  lines.push("");
  lines.push("OPINIÓN DEL ESTUDIANTE:");
  lines.push(`🇪🇸 En español:`);
  lines.push(activity.spanishOpinion || "No especificado");
  lines.push("");
  lines.push(`🇬🇧 In English:`);
  lines.push(activity.englishOpinion || "No especificado");
  lines.push("");
  lines.push("=== FIN DE ACTIVIDAD ===");

  const forumText = lines.join("\n");

  // Actualizar el texto en la interfaz
  document.getElementById("forumText").textContent = forumText;

  return forumText;
}

// Código único de terminación
function generateCompletionCode() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  const studentHash = btoa(
    AppState.studentData.fullName +
      AppState.studentData.career +
      AppState.studentData.group,
  )
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 8)
    .toUpperCase();

  return `CD4-CDR-${studentHash}-${timestamp}-${random}`;
}

// Copiar al portapapeles
function copyToClipboard() {
  const forumText = generateForumText();

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(forumText)
      .then(() => {
        showFeedback(
          'Texto copiado. Pégalo en el foro: "Digital responsibility opinion"',
          "success",
        );
      })
      .catch((err) => {
        console.error("Error al copiar:", err);
        fallbackCopy(forumText);
      });
  } else {
    fallbackCopy(forumText);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand("copy");
    showFeedback(
      'Texto copiado. Pégalo en el foro: "Digital responsibility opinion"',
      "success",
    );
  } catch (err) {
    showFeedback("No se pudo copiar. Selecciona y copia manualmente.", "error");
  }

  document.body.removeChild(textarea);
}

// Sistema de resultado final
function showFinalResult() {
  console.log("Mostrando resultado final...");

  showLoading("Generando resultado final...");

  setTimeout(() => {
    // Actualizar resumen
    updateFinalResult();

    hideLoading();

    // Mostrar sección final
    hideElement("opinionSection");
    showElement("finalResult");

    console.log("Resultado final mostrado");
  }, 1500);
}

function updateFinalResult() {
  const student = AppState.studentData;
  const activity = AppState.activityData;

  // Actualizar resumen del estudiante
  document.getElementById("resultName").textContent = student.fullName;
  document.getElementById("resultCareer").textContent = student.career;
  document.getElementById("resultGroup").textContent = student.group;
  document.getElementById("resultDate").textContent = new Date().toLocaleString(
    "es-MX",
  );

  // Actualizar resumen de la actividad
  document.getElementById("resultScenario").textContent =
    activity.selectedScenario
      ? activity.selectedScenario.text
      : "No especificado";
  document.getElementById("resultConsequence").textContent =
    activity.selectedConsequence
      ? activity.selectedConsequence.text
      : "No especificado";
  document.getElementById("resultPhrase").textContent =
    activity.generatedPhrase;

  // Actualizar opiniones
  document.getElementById("resultSpanish").textContent =
    activity.spanishOpinion || "No especificado";
  document.getElementById("resultEnglish").textContent =
    activity.englishOpinion || "No especificado";

  // Generar código único
  AppState.completionCode = generateCompletionCode();

  // Actualizar texto para el foro
  generateForumText();

  console.log("Resultado final actualizado");
}

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM cargado, inicializando Actividad 4...");

  // Establecer año dinámico en footer
  const footerYear = document.getElementById("footerYear");
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  // Inicializar componentes
  initializeRegistration();

  // Mostrar sección de introducción por defecto
  showElement("introduction");

  console.log("Actividad 4 inicializada completamente");
});
