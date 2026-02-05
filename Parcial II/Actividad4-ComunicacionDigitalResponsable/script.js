// Estado global de la aplicación
const AppState = {
  studentData: {
    fullName: "",
    career: "",
    group: "",
  },
  activityData: {
    sentences: {
      always: "",
      usually: "",
      sometimes: "",
      never: "",
    },
    orderingSentence: "",
    orderingCorrect: false,
    spanishPractice: "",
    englishPractice: "",
    translationValid: false,
    recommendations: [],
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
  showElement("grammarSection");
  initializeGrammarSection();
}

// Sistema de Present Simple
function initializeGrammarSection() {
  const saveBtn = document.getElementById("saveWork");
  const banks = document.querySelectorAll(".word-bank");
  const chips = document.querySelectorAll(".word-chip");
  const checkButtons = document.querySelectorAll(".check-sentence");
  const clearButtons = document.querySelectorAll(".clear-sentence");
  const backButtons = document.querySelectorAll(".back-sentence");
  const orderClearButtons = document.querySelectorAll(".order-clear");
  const orderBackButtons = document.querySelectorAll(".order-back");
  const orderCheckButtons = document.querySelectorAll(".order-check");
  const translatePracticeBtn = document.getElementById("translatePracticeBtn");
  const evaluatePracticeBtn = document.getElementById("evaluatePracticeBtn");

  banks.forEach((bank) => shuffleWordBank(bank));

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const bank = chip.closest(".word-bank");
      if (!bank) return;
      const targetId = bank.dataset.target;
      const target = document.getElementById(targetId);
      if (!target) return;
      if (!chip.dataset.insert) return;
      appendToken(target, chip.dataset.insert, bank);
      chip.disabled = true;
    });
  });

  checkButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const adverb = btn.dataset.adverb;
      const feedbackId = btn.dataset.feedback;
      checkSentence(targetId, adverb, feedbackId);
    });
  });

  clearButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const feedbackId = btn.dataset.feedback;
      clearOutput(targetId);
      setSentenceFeedback(feedbackId, "Listo, vuelve a intentarlo.", "info");
    });
  });

  backButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      removeLastToken(targetId);
    });
  });

  orderClearButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      clearOutput(targetId);
      setSentenceFeedback("orderingFeedback", "Listo, vuelve a intentarlo.", "info");
    });
  });

  orderBackButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      removeLastToken(targetId);
    });
  });

  orderCheckButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const answer = btn.dataset.answer;
      const feedbackId = btn.dataset.feedback;
      checkOrdering(targetId, answer, feedbackId);
    });
  });

  if (translatePracticeBtn) {
    translatePracticeBtn.addEventListener("click", handlePracticeTranslation);
  }

  if (evaluatePracticeBtn) {
    evaluatePracticeBtn.addEventListener("click", evaluatePractice);
  }

  if (saveBtn) saveBtn.addEventListener("click", saveGrammarWork);
}

function insertWord(input, word) {
  const current = input.value.trim();
  const text = current ? `${current} ${word}` : word;
  input.value = text;
  input.focus();
}

function appendToken(outputEl, word, bank) {
  if (!outputEl) return;
  const token = document.createElement("span");
  token.className = "sentence-token";
  token.textContent = word;
  token.dataset.word = word;
  token.addEventListener("click", () => {
    token.remove();
    enableChip(bank, word);
    updateOutputValue(outputEl);
  });
  outputEl.appendChild(token);
  updateOutputValue(outputEl);
}

function updateOutputValue(outputEl) {
  const words = Array.from(outputEl.querySelectorAll(".sentence-token")).map(
    (token) => token.dataset.word
  );
  outputEl.dataset.value = words.join(" ");
  if (words.length) {
    outputEl.classList.add("has-content");
  } else {
    outputEl.classList.remove("has-content");
  }
}

function enableChip(bank, word) {
  if (!bank) return;
  const chip = bank.querySelector(`.word-chip[data-insert="${word}"]`);
  if (chip) chip.disabled = false;
}

function clearOutput(targetId) {
  const output = document.getElementById(targetId);
  if (!output) return;
  const bank = document.querySelector(`.word-bank[data-target="${targetId}"]`);
  output.innerHTML = "";
  updateOutputValue(output);
  if (bank) {
    bank.querySelectorAll(".word-chip").forEach((chip) => (chip.disabled = false));
  }
}

function removeLastToken(targetId) {
  const output = document.getElementById(targetId);
  if (!output) return;
  const tokens = output.querySelectorAll(".sentence-token");
  const last = tokens[tokens.length - 1];
  if (!last) return;
  const bank = document.querySelector(`.word-bank[data-target="${targetId}"]`);
  last.remove();
  enableChip(bank, last.dataset.word);
  updateOutputValue(output);
}

function checkSentence(targetId, adverb, feedbackId) {
  const output = document.getElementById(targetId);
  const value = output ? safeTrim(output.dataset.value) : "";
  const answer = output ? output.dataset.answer : "";

  if (!value) {
    setSentenceFeedback(feedbackId, "Escribe una oración primero.", "error");
    return;
  }

  const lower = value.toLowerCase();
  if (!lower.includes(adverb)) {
    setSentenceFeedback(feedbackId, `Te falta el adverbio "${adverb}".`, "error");
    return;
  }

  if (answer && normalizeSentence(value) !== normalizeSentence(answer)) {
    setSentenceFeedback(feedbackId, "El orden no es correcto.", "error");
    return;
  }

  setSentenceFeedback(feedbackId, "¡Correcto! La oración está bien ordenada.", "success");
}

function setSentenceFeedback(feedbackId, message, type) {
  const feedback = document.getElementById(feedbackId);
  if (!feedback) return;
  feedback.textContent = message;
  feedback.className = `sentence-feedback ${type}`;
}

function shuffleWordBank(bank) {
  const chips = Array.from(bank.querySelectorAll(".word-chip"));
  for (let i = chips.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [chips[i], chips[j]] = [chips[j], chips[i]];
  }
  chips.forEach((chip) => bank.appendChild(chip));
}

function normalizeSentence(text) {
  return safeTrim(text)
    .toLowerCase()
    .replace(/[.!?]/g, "");
}

function checkOrdering(targetId, answer, feedbackId) {
  const output = document.getElementById(targetId);
  const value = output ? safeTrim(output.dataset.value) : "";

  if (!value) {
    setSentenceFeedback(feedbackId, "Arma la frase primero.", "error");
    AppState.activityData.orderingCorrect = false;
    return;
  }

  const isCorrect = normalizeSentence(value) === normalizeSentence(answer);
  AppState.activityData.orderingCorrect = isCorrect;
  AppState.activityData.orderingSentence = value;

  if (isCorrect) {
    setSentenceFeedback(feedbackId, "¡Correcto!", "success");
  } else {
    setSentenceFeedback(feedbackId, "Revisa el orden.", "error");
  }
}

async function handlePracticeTranslation() {
  const spanishText = safeTrim(document.getElementById("spanishPractice").value);
  const translateBtn = document.getElementById("translatePracticeBtn");
  const englishArea = document.getElementById("englishPractice");

  if (!spanishText) {
    setSentenceFeedback("translationFeedback", "Escribe una frase en español.", "error");
    return;
  }

  translateBtn.disabled = true;
  translateBtn.textContent = "Traduciendo...";
  englishArea.placeholder = "Translating...";

  try {
    const encodedText = encodeURIComponent(spanishText);
    const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=es|en`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.responseData && data.responseData.translatedText) {
      englishArea.value = data.responseData.translatedText;
      englishArea.readOnly = false;
      setSentenceFeedback("translationFeedback", "Traducción lista. Ahora evalúa.", "success");
    } else {
      throw new Error("No translation returned");
    }
  } catch (error) {
    console.error("Translation error:", error);
    englishArea.readOnly = false;
    englishArea.value = "";
    setSentenceFeedback(
      "translationFeedback",
      "Error al traducir. Escribe la versión en inglés y evalúa.",
      "error"
    );
  } finally {
    translateBtn.disabled = false;
    translateBtn.textContent = "🔄 Traducir a Inglés";
  }
}

function evaluatePractice() {
  const spanishText = safeTrim(document.getElementById("spanishPractice").value);
  const englishText = safeTrim(document.getElementById("englishPractice").value);

  if (!spanishText) {
    setSentenceFeedback("translationFeedback", "Falta la frase en español.", "error");
    return;
  }

  if (!englishText) {
    setSentenceFeedback("translationFeedback", "Falta la traducción en inglés.", "error");
    return;
  }

  const evaluation = evaluateEnglishText(englishText);
  if (!evaluation.ok) {
    setSentenceFeedback("translationFeedback", evaluation.message, "error");
    AppState.activityData.translationValid = false;
    return;
  }

  AppState.activityData.spanishPractice = spanishText;
  AppState.activityData.englishPractice = englishText;
  AppState.activityData.translationValid = true;
  setSentenceFeedback("translationFeedback", "¡Cumple con lo solicitado!", "success");
}

function evaluateEnglishText(text) {
  const lower = text.toLowerCase();
  const adverbs = ["always", "usually", "sometimes", "never"];
  const techWords = [
    "phone",
    "cellphone",
    "laptop",
    "computer",
    "tablet",
    "internet",
    "online",
    "email",
    "app",
    "ai",
    "video",
    "videos",
    "screen",
  ];
  const verbs = [
    "use",
    "uses",
    "check",
    "checks",
    "study",
    "studies",
    "learn",
    "learns",
    "read",
    "reads",
    "watch",
    "watches",
    "do",
    "does",
    "play",
    "plays",
    "write",
    "writes",
    "take",
    "takes",
  ];

  const hasAdverb = adverbs.some((adv) => lower.includes(adv));
  const hasTechWord = techWords.some((word) => lower.includes(word));
  const hasVerb = verbs.some((verb) => lower.includes(` ${verb}`));

  if (!hasAdverb) {
    return { ok: false, message: "Incluye un adverbio: always/usually/sometimes/never." };
  }
  if (!hasTechWord) {
    return { ok: false, message: "Incluye una palabra de tecnología (phone, laptop, online...)."};
  }
  if (!hasVerb) {
    return { ok: false, message: "Incluye un verbo en present simple (use, check, study...)."};
  }

  return { ok: true, message: "OK" };
}

function saveGrammarWork() {
  const sentences = {
    always: safeTrim(document.getElementById("sentenceAlways").dataset.value),
    usually: safeTrim(document.getElementById("sentenceUsually").dataset.value),
    sometimes: safeTrim(document.getElementById("sentenceSometimes").dataset.value),
    never: safeTrim(document.getElementById("sentenceNever").dataset.value),
  };

  const orderingOutput = safeTrim(
    document.getElementById("orderingOutput").dataset.value
  );
  const orderingAnswer = "They usually do homework online.";

  const recommendations = [
    safeTrim(document.getElementById("recommendationOne").value),
    safeTrim(document.getElementById("recommendationTwo").value),
    safeTrim(document.getElementById("recommendationThree").value),
  ];

  const missingSentences = Object.entries(sentences)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingSentences.length) {
    showFeedback(`Faltan oraciones para: ${missingSentences.join(", ")}`, "error");
    return;
  }

  const missingAdverb = Object.entries(sentences)
    .filter(([key, value]) => !value.toLowerCase().includes(key))
    .map(([key]) => key);

  if (missingAdverb.length) {
    showFeedback(`Incluye el adverbio en: ${missingAdverb.join(", ")}`, "error");
    return;
  }

  if (!orderingOutput) {
    showFeedback("Completa el ejercicio de ordenar la frase.", "error");
    return;
  }

  if (!AppState.activityData.orderingCorrect) {
    const orderingOk = normalizeSentence(orderingOutput) === normalizeSentence(orderingAnswer);
    if (!orderingOk) {
      showFeedback("La frase ordenada no es correcta. Revisa el orden.", "error");
      return;
    }
    AppState.activityData.orderingCorrect = true;
    AppState.activityData.orderingSentence = orderingOutput;
  }

  if (!AppState.activityData.translationValid) {
    showFeedback("Traduce y evalúa tu frase en español.", "error");
    return;
  }

  if (recommendations.some((rec) => !rec)) {
    showFeedback("Completa las 3 recomendaciones en inglés.", "error");
    return;
  }

  const normalizedRecs = recommendations.map((rec) =>
    normalizeSentence(rec).replace(/\s+/g, " ")
  );
  const uniqueRecs = new Set(normalizedRecs);
  if (uniqueRecs.size !== recommendations.length) {
    showFeedback("Las 3 recomendaciones deben ser diferentes.", "error");
    return;
  }

  const shortRec = recommendations.find((rec) => rec.split(/\s+/).length < 4);
  if (shortRec) {
    showFeedback("Cada recomendación debe tener al menos 4 palabras.", "error");
    return;
  }

  AppState.activityData.sentences = sentences;
  AppState.activityData.recommendations = recommendations;
  AppState.activityData.generatedPhrase =
    "Present Simple + Adverbs of Frequency practice completed.";

  showFinalResult();
}
function showFinalResult() {
  hideElement("grammarSection");
  showElement("finalResult");

  // Actualizar datos de estudiante
  updateText("resultName", AppState.studentData.fullName);
  updateText("resultCareer", AppState.studentData.career);
  updateText("resultGroup", AppState.studentData.group);
  updateText("resultDate", new Date().toLocaleString());

  // Actualizar resumen de actividad
  // Como cambiamos la dinámica, mostraremos "Completado" en lugar de un solo escenario
  updateText("resultScenario", "Práctica de Present Simple");
  updateText("resultConsequence", "Oraciones con adverbios completadas");
  updateText("resultPhrase", AppState.activityData.generatedPhrase);

  updateList("resultSentences", [
    `Always: ${AppState.activityData.sentences.always}`,
    `Usually: ${AppState.activityData.sentences.usually}`,
    `Sometimes: ${AppState.activityData.sentences.sometimes}`,
    `Never: ${AppState.activityData.sentences.never}`,
  ]);
  updateList("resultRecommendations", AppState.activityData.recommendations);
  updateList("resultExtraPractice", [
    `Orden: ${AppState.activityData.orderingSentence}`,
    `ES: ${AppState.activityData.spanishPractice}`,
    `EN: ${AppState.activityData.englishPractice}`,
  ]);

  // Código
  const code = generateCompletionCode();
  AppState.completionCode = code;

  generateForumText();

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

function updateList(id, items) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

function generateCompletionCode() {
  const hash = btoa(AppState.studentData.fullName).slice(0, 6).toUpperCase();
  const random = Math.floor(Math.random() * 10000);
  return `CD4-${hash}-${random}`;
}

function generateForumText() {
  const s = AppState.studentData;
  const a = AppState.activityData;

  let text = `=== ACTIVIDAD 4: PRESENT SIMPLE ===\n`;
  text += `Nombre: ${s.fullName}\nCarrera: ${s.career}\nGrupo: ${s.group}\nFecha: ${new Date().toLocaleString()}\n\n`;
  text += `PRESENTATION LINK:\n(PEGAR AQUI EL ENLACE DE CRYPTPAD)\n\n`;
  text += `RECOMMENDATIONS (3):\n- ${a.recommendations.join("\n- ")}\n\n`;
  text += `Código: ${AppState.completionCode}`;

  const forumEl = document.getElementById("forumText");
  if (forumEl) forumEl.textContent = text;
}

function copyToClipboard() {
  const text = document.getElementById("forumText").textContent;
  navigator.clipboard.writeText(text).then(() => {
    showFeedback("Copiado al portapapeles", "success");
  }).catch(() => {
    showFeedback("Error al copiar", "error");
  });
}

// Sin texto para foro en esta actividad

