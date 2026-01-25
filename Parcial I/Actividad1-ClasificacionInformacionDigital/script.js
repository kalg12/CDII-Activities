// ========================================
// Actividad 1: Organización Simbólica DnD
// CETMAR No. 18 - Cultura Digital II
// ========================================

// Mapeo correcto: clave -> etiqueta
const MAPPING = {
  horas: "H",
  entregados: "E",
  pendientes: "P",
  tiempo: "T",
  "suma-horas": "H+H",
  "tiempo-menos-pend": "T-P",
};

// Estado global
let state = {};
let draggedCard = null;

// Descripciones legibles
function getPrettyName(key) {
  const names = {
    horas: "Horas dedicadas a tareas digitales",
    entregados: "Cantidad de trabajos entregados",
    pendientes: "Trabajos pendientes",
    tiempo: "Tiempo de uso de plataformas digitales",
    "suma-horas": "Suma de horas dedicadas (p. ej., dos sesiones)",
    "tiempo-menos-pend": "Tiempo disponible tras atender pendientes",
  };
  return names[key] || key;
}

// Generar mensaje de reporte
function getReportMessage(key, label, isCorrect) {
  if (isCorrect) {
    return "La etiqueta representa correctamente el concepto. El reporte es consistente.";
  }
  const labelNames = {
    H: "Horas",
    E: "Entregados",
    P: "Pendientes",
    T: "Tiempo",
    "H+H": "Suma de tiempos",
    "T-P": "Diferencia tiempo-pendientes",
  };
  const labelName = labelNames[label] || label;
  return `Usar "${labelName}" para "${getPrettyName(key)}" genera reportes ambiguos y puede inducir decisiones equivocadas.`;
}

// Actualizar reporte
function updateReport() {
  const reportList = document.getElementById("reportList");
  if (!reportList) return;

  reportList.innerHTML = "";

  Object.entries(state).forEach(([label, key]) => {
    if (!key) return;

    const isCorrect = MAPPING[key] === label;
    const item = document.createElement("div");
    item.className = `report-item ${isCorrect ? "clear" : "confused"}`;

    const statusIcon = isCorrect ? "✓" : "✗";
    const statusText = isCorrect ? "Claro" : "Confuso";

    item.innerHTML = `
      <div style="display: flex; align-items: start; gap: 0.5rem;">
        <span class="status-icon">${statusIcon}</span>
        <div>
          <div class="status">${statusText}</div>
          <div style="font-size: 0.9rem; margin-top: 0.25rem;">"${getPrettyName(key)}" → ${label}</div>
          <small style="display: block; margin-top: 0.25rem; opacity: 0.85;">${getReportMessage(key, label, isCorrect)}</small>
        </div>
      </div>
    `;

    reportList.appendChild(item);
  });
}

// Actualizar visual de zona de drop
function updateDropzoneVisual(dropzone, key) {
  // Limpiar estado anterior
  dropzone.classList.remove("correct", "wrong", "has-card");
  const oldCard = dropzone.querySelector(".assigned");
  if (oldCard) oldCard.remove();

  if (!key) return;

  const isCorrect = MAPPING[key] === dropzone.dataset.label;
  dropzone.classList.add(isCorrect ? "correct" : "wrong", "has-card");

  // Crear tarjeta asignada
  const assignedCard = document.createElement("div");
  assignedCard.className = `assigned ${isCorrect ? "correct" : "wrong"}`;
  assignedCard.innerHTML = `
    <div style="font-size: 0.9rem; font-weight: 500;">${getPrettyName(key)}</div>
    <button class="remove-btn" onclick="removeAssignment('${dropzone.dataset.label}')" title="Quitar">×</button>
  `;

  dropzone.appendChild(assignedCard);
}

// Quitar asignación
function removeAssignment(label) {
  delete state[label];
  const dropzone = document.querySelector(`[data-label="${label}"]`);
  if (dropzone) {
    updateDropzoneVisual(dropzone, null);
  }
  updateReport();
  checkCompletion();
}

// Verificar si está completo
function checkCompletion() {
  const total = Object.keys(MAPPING).length;
  const assigned = Object.keys(state).filter((k) => state[k]).length;
  const correct = Object.entries(state).filter(
    ([label, key]) => key && MAPPING[key] === label,
  ).length;

  const completion = document.getElementById("completion");
  if (!completion) return;

  if (assigned === total && correct === total) {
    completion.hidden = false;
    const closeBtn = document.getElementById("closeCompletion");
    if (closeBtn) setTimeout(() => closeBtn.focus(), 100);
  } else {
    completion.hidden = true;
  }
}

// Reiniciar actividad
function resetActivity() {
  state = {};

  // Limpiar todas las zonas
  document.querySelectorAll(".dropzone").forEach((dz) => {
    dz.classList.remove("correct", "wrong", "hover", "has-card");
    const assigned = dz.querySelector(".assigned");
    if (assigned) assigned.remove();
  });

  // Limpiar reporte
  const reportList = document.getElementById("reportList");
  if (reportList) reportList.innerHTML = "";

  // Ocultar modal
  const completion = document.getElementById("completion");
  if (completion) completion.hidden = true;

  console.log("✓ Actividad reiniciada");
}

// Manejadores de drag and drop
function handleDragStart(e) {
  draggedCard = e.target;
  e.target.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", e.target.dataset.key);
  console.log("Arrastrando:", e.target.dataset.key);
}

function handleDragEnd(e) {
  e.target.classList.remove("dragging");
  draggedCard = null;
  // Limpiar estados hover de todas las zonas
  document
    .querySelectorAll(".dropzone")
    .forEach((dz) => dz.classList.remove("hover"));
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  e.currentTarget.classList.add("hover");
}

function handleDragLeave(e) {
  e.currentTarget.classList.remove("hover");
}

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();

  const dropzone = e.currentTarget;
  dropzone.classList.remove("hover");

  const key = e.dataTransfer.getData("text/plain");
  if (!key) return;

  console.log(`Soltado: ${key} en zona ${dropzone.dataset.label}`);

  // Asignar al estado
  state[dropzone.dataset.label] = key;

  // Actualizar visual
  updateDropzoneVisual(dropzone, key);
  updateReport();
  checkCompletion();
}

// Inicializar actividad
function initActivity() {
  console.log("🎯 Inicializando Actividad 1: Organización Simbólica");

  // Estado inicial limpio
  state = {};

  // Configurar tarjetas arrastrables
  const cards = document.querySelectorAll('.card[draggable="true"]');
  console.log(`✓ Encontradas ${cards.length} tarjetas`);

  cards.forEach((card) => {
    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("dragend", handleDragEnd);
  });

  // Configurar zonas de drop
  const dropzones = document.querySelectorAll(".dropzone");
  console.log(`✓ Encontradas ${dropzones.length} zonas de drop`);

  dropzones.forEach((dz) => {
    dz.addEventListener("dragover", handleDragOver);
    dz.addEventListener("dragleave", handleDragLeave);
    dz.addEventListener("drop", handleDrop);
  });

  // Botón reiniciar
  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetActivity);
    console.log("✓ Botón reiniciar configurado");
  }

  // Cerrar modal
  const closeBtn = document.getElementById("closeCompletion");
  const completion = document.getElementById("completion");

  if (closeBtn && completion) {
    closeBtn.addEventListener("click", () => (completion.hidden = true));

    // Cerrar con Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !completion.hidden) {
        completion.hidden = true;
      }
    });

    // Cerrar al hacer clic fuera
    completion.addEventListener("click", (e) => {
      if (e.target === completion) {
        completion.hidden = true;
      }
    });

    console.log("✓ Modal de completado configurado");
  }

  // Asegurar que el modal está oculto al inicio
  if (completion) completion.hidden = true;

  console.log("✅ Actividad lista para usar");
}

// Iniciar cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initActivity);
} else {
  initActivity();
}
