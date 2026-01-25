// Configuración de carreras técnicas
const CAREERS = [
  "TÉCNICO EN ACUACULTURA",
  "TÉCNICO EN MECÁNICA NAVAL",
  "TÉCNICO EN PREPARACIÓN DE ALIMENTOS Y BEBIDAS",
  "TÉCNICO EN RECREACIONES ACUÁTICAS",
  "TÉCNICO EN REFRIGERACIÓN Y CLIMATIZACIÓN",
  "TÉCNICO LABORATORISTA AMBIENTAL",
];

// Estado global de la aplicación
const AppState = {
  studentData: {
    fullName: "",
    career: "",
    group: "",
  },
  tableData: [],
  charts: {
    bar: null,
    pie: null,
  },
  interpretation: "",
  completionCode: "",
};

// Carga perezosa de Chart.js para evitar fallas si el CDN no responde
let chartReadyPromise = null;

function loadChartJs() {
  if (typeof Chart !== "undefined") {
    return Promise.resolve();
  }

  if (chartReadyPromise) {
    return chartReadyPromise;
  }

  const cdnUrls = [
    "https://cdn.jsdelivr.net/npm/chart.js@4.4.5/dist/chart.umd.min.js",
    "https://unpkg.com/chart.js@4.4.5/dist/chart.umd.min.js",
  ];

  chartReadyPromise = new Promise((resolve, reject) => {
    const tryLoad = (index) => {
      if (index >= cdnUrls.length) {
        reject(
          new Error("No se pudo cargar Chart.js desde los CDNs configurados"),
        );
        return;
      }

      const url = cdnUrls[index];
      console.log(`Intentando cargar Chart.js desde: ${url}`);
      const script = document.createElement("script");
      script.src = url;
      script.async = true;

      script.onload = () => {
        if (typeof Chart !== "undefined") {
          console.log(`Chart.js cargado correctamente desde: ${url}`);
          resolve();
        } else {
          console.warn(`Chart global no disponible tras la carga desde ${url}`);
          tryLoad(index + 1);
        }
      };

      script.onerror = () => {
        console.warn(`Fallo al cargar Chart.js desde ${url}`);
        tryLoad(index + 1);
      };

      document.head.appendChild(script);
    };

    tryLoad(0);
  });

  return chartReadyPromise;
}

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

// Registro del estudiante
function initializeRegistration() {
  const careerSelect = document.getElementById("career");
  const studentForm = document.getElementById("studentForm");

  console.log("Inicializando registro...");

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
    console.log("Evento submit agregado al formulario");
  }
}

function handleRegistrationSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  AppState.studentData = {
    fullName: safeTrim(formData.get("fullName")),
    career: formData.get("career"),
    group: formData.get("group"),
  };

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

  // Transición a captura de datos
  hideElement("registration");
  showElement("dataCapture");
  initializeTable();
}

// Sistema de tabla dinámica
function initializeTable() {
  const addBtn = document.getElementById("addRowBtn");
  const clearBtn = document.getElementById("clearTableBtn");
  const conceptInput = document.getElementById("conceptInput");
  const valueInput = document.getElementById("valueInput");

  if (addBtn) {
    addBtn.addEventListener("click", addTableRow);
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", clearTable);
  }

  // Validar inputs
  if (valueInput) {
    valueInput.addEventListener("input", validateValueInput);
  }

  updateRowCount();
}

function addTableRow() {
  console.log("Agregando nueva fila a la tabla...");

  const conceptInput = document.getElementById("conceptInput");
  const valueInput = document.getElementById("valueInput");

  const concept = safeTrim(conceptInput.value);
  const value = parseFloat(valueInput.value);

  console.log("Datos a agregar:", { concept, value });

  // Validaciones
  if (!concept) {
    console.log("Error: Concepto vacío");
    showFeedback("Por favor, ingresa un concepto", "error");
    conceptInput.focus();
    return;
  }

  if (isNaN(value) || value < 0) {
    console.log("Error: Valor inválido o negativo");
    showFeedback("Por favor, ingresa un valor válido (no negativo)", "error");
    valueInput.focus();
    return;
  }

  // Agregar a la tabla
  const tableBody = document.querySelector("#dataTable tbody");
  console.log("Tabla body encontrada:", tableBody);

  if (!tableBody) {
    console.error("Tabla body no encontrada");
    return;
  }

  const row = document.createElement("tr");
  row.innerHTML = `
        <td>${concept}</td>
        <td>${value}</td>
        <td>
            <button class="delete-btn" onclick="deleteRow(this)">🗑️ Eliminar</button>
        </td>
    `;

  tableBody.appendChild(row);
  console.log("Fila agregada al DOM");

  // Agregar a datos del estado
  AppState.tableData.push({ concept, value });
  console.log("Datos actualizados:", AppState.tableData);

  // Limpiar inputs
  conceptInput.value = "";
  valueInput.value = "";

  // Actualizar contador y botones
  updateRowCount();

  showFeedback("Fila agregada correctamente", "success");
}

function deleteRow(button) {
  const row = button.closest("tr");
  const index = row.rowIndex - 1;

  // Eliminar de datos
  AppState.tableData.splice(index, 1);

  // Eliminar de tabla
  row.remove();

  // Actualizar contador
  updateRowCount();

  showFeedback("Fila eliminada", "success");
}

function clearTable() {
  if (!confirm("¿Estás seguro de que quieres limpiar toda la tabla?")) {
    return;
  }

  const tableBody = document.querySelector("#dataTable tbody");
  tableBody.innerHTML = "";

  AppState.tableData = [];

  // Ocultar gráficas
  document.getElementById("barChartContainer").classList.add("hidden");
  document.getElementById("pieChartContainer").classList.add("hidden");

  // Destruir gráficas existentes
  if (AppState.charts.bar) {
    AppState.charts.bar.destroy();
    AppState.charts.bar = null;
  }

  if (AppState.charts.pie) {
    AppState.charts.pie.destroy();
    AppState.charts.pie = null;
  }

  updateRowCount();
  showFeedback("Tabla limpiada", "success");
}

function validateValueInput() {
  const valueInput = document.getElementById("valueInput");
  const value = parseFloat(valueInput.value);

  if (!isNaN(value) && value < 0) {
    valueInput.value = Math.abs(value);
  }
}

function updateRowCount() {
  const rowCount = document.getElementById("rowCount");
  const rows = document.querySelectorAll("#dataTable tbody tr");
  rowCount.textContent = rows.length;

  // Mantener botones activos; la validación mínima se hace dentro de generateBarChart/generatePieChart
  const barBtn = document.getElementById("generateBarBtn");
  const pieBtn = document.getElementById("generatePieBtn");
  if (barBtn) barBtn.disabled = false;
  if (pieBtn) pieBtn.disabled = false;
}

// Sistema de gráficas con Chart.js
function initializeCharts() {
  console.log("Inicializando sistema de gráficas...");

  // Verificar que Chart.js esté disponible
  if (typeof Chart === "undefined") {
    console.error("Chart.js no está disponible");
    showFeedback(
      "Error: Chart.js no se pudo cargar. Recarga la página.",
      "error",
    );
    return;
  }

  console.log("Chart.js disponible:", typeof Chart);

  const barBtn = document.getElementById("generateBarBtn");
  const pieBtn = document.getElementById("generatePieBtn");
  const updateBtn = document.getElementById("updateChartsBtn");

  console.log("Botones de gráficas encontrados:", {
    barBtn,
    pieBtn,
    updateBtn,
  });

  if (barBtn) {
    barBtn.addEventListener("click", () => {
      console.log("Click en generar gráfica de barras");
      generateBarChart();
    });
  } else {
    console.error("Botón de barras no encontrado");
  }

  if (pieBtn) {
    pieBtn.addEventListener("click", () => {
      console.log("Click en generar gráfica de pastel");
      generatePieChart();
    });
  } else {
    console.error("Botón de pastel no encontrado");
  }

  if (updateBtn) {
    updateBtn.addEventListener("click", () => {
      console.log("Click en actualizar gráficas");
      updateCharts();
    });
  } else {
    console.error("Botón de actualizar no encontrado");
  }

  console.log("Eventos de gráficas configurados");
}

function generateBarChart() {
  console.log("Iniciando generación de gráfica de barras...");
  console.log("Datos de la tabla:", AppState.tableData);

  if (typeof Chart === "undefined") {
    showFeedback(
      "Chart.js no está disponible. Verifica tu conexión y recarga.",
      "error",
    );
    return;
  }

  if (AppState.tableData.length < 4) {
    console.log("Error: Menos de 4 filas");
    showFeedback("Necesitas al menos 4 filas para generar gráficas", "error");
    return;
  }

  const barCanvas = document.getElementById("barChart");
  console.log("Canvas encontrado:", barCanvas);

  if (!barCanvas) {
    console.error("Canvas de barras no encontrado");
    showFeedback("Error: No se encontró el canvas de barras", "error");
    return;
  }

  const ctx = barCanvas.getContext("2d");
  console.log("Contexto 2D obtenido:", ctx);

  // Destruir gráfica existente
  if (AppState.charts.bar) {
    console.log("Destruyendo gráfica de barras existente");
    AppState.charts.bar.destroy();
  }

  // Preparar datos
  const chartData = {
    labels: AppState.tableData.map((item) => item.concept),
    values: AppState.tableData.map((item) => item.value),
  };

  console.log("Datos preparados para gráfica:", chartData);

  try {
    AppState.charts.bar = new Chart(ctx, {
      type: "bar",
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: "Minutos por semana",
            data: chartData.values,
            backgroundColor: [
              "rgba(166, 127, 93, 0.8)",
              "rgba(201, 169, 118, 0.8)",
              "rgba(139, 58, 58, 0.8)",
              "rgba(90, 122, 79, 0.8)",
              "rgba(125, 47, 66, 0.8)",
              "rgba(77, 30, 43, 0.8)",
            ],
            borderColor: [
              "rgba(166, 127, 93, 1)",
              "rgba(201, 169, 118, 1)",
              "rgba(139, 58, 58, 1)",
              "rgba(90, 122, 79, 1)",
              "rgba(125, 47, 66, 1)",
              "rgba(77, 30, 43, 1)",
            ],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Tiempo de uso de herramientas digitales",
            font: {
              size: 16,
              weight: "bold",
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Minutos por semana",
            },
          },
          x: {
            title: {
              display: true,
              text: "Herramientas",
            },
          },
        },
      },
    });

    console.log("Gráfica de barras creada exitosamente");

    // Mostrar contenedor
    const container = document.getElementById("barChartContainer");
    if (container) {
      container.classList.remove("hidden");
      console.log("Contenedor de barras mostrado");
    }

    showFeedback("Gráfica de barras generada", "success");
  } catch (error) {
    console.error("Error al crear gráfica de barras:", error);
    showFeedback("Error al generar la gráfica de barras", "error");
  }
}

function generatePieChart() {
  console.log("Iniciando generación de gráfica de pastel...");
  console.log("Datos de la tabla:", AppState.tableData);

  if (typeof Chart === "undefined") {
    showFeedback(
      "Chart.js no está disponible. Verifica tu conexión y recarga.",
      "error",
    );
    return;
  }

  if (AppState.tableData.length < 4) {
    console.log("Error: Menos de 4 filas");
    showFeedback("Necesitas al menos 4 filas para generar gráficas", "error");
    return;
  }

  const pieCanvas = document.getElementById("pieChart");
  console.log("Canvas encontrado:", pieCanvas);

  if (!pieCanvas) {
    console.error("Canvas de pastel no encontrado");
    showFeedback("Error: No se encontró el canvas de pastel", "error");
    return;
  }

  const ctx = pieCanvas.getContext("2d");
  console.log("Contexto 2D obtenido:", ctx);

  // Destruir gráfica existente
  if (AppState.charts.pie) {
    console.log("Destruyendo gráfica de pastel existente");
    AppState.charts.pie.destroy();
  }

  // Preparar datos
  const chartData = {
    labels: AppState.tableData.map((item) => item.concept),
    values: AppState.tableData.map((item) => item.value),
  };

  console.log("Datos preparados para gráfica:", chartData);

  try {
    AppState.charts.pie = new Chart(ctx, {
      type: "pie",
      data: {
        labels: chartData.labels,
        datasets: [
          {
            data: chartData.values,
            backgroundColor: [
              "rgba(166, 127, 93, 0.8)",
              "rgba(201, 169, 118, 0.8)",
              "rgba(139, 58, 58, 0.8)",
              "rgba(90, 122, 79, 0.8)",
              "rgba(125, 47, 66, 0.8)",
              "rgba(77, 30, 43, 0.8)",
            ],
            borderColor: [
              "rgba(166, 127, 93, 1)",
              "rgba(201, 169, 118, 1)",
              "rgba(139, 58, 58, 1)",
              "rgba(90, 122, 79, 1)",
              "rgba(125, 47, 66, 1)",
              "rgba(77, 30, 43, 1)",
            ],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
          title: {
            display: true,
            text: "Distribución del tiempo de uso",
            font: {
              size: 16,
              weight: "bold",
            },
          },
        },
      },
    });

    console.log("Gráfica de pastel creada exitosamente");

    // Mostrar contenedor
    const container = document.getElementById("pieChartContainer");
    if (container) {
      container.classList.remove("hidden");
      console.log("Contenedor de pastel mostrado");
    }

    showFeedback("Gráfica de pastel generada", "success");
  } catch (error) {
    console.error("Error al crear gráfica de pastel:", error);
    showFeedback("Error al generar la gráfica de pastel", "error");
  }
}

function updateCharts() {
  if (AppState.charts.bar) {
    generateBarChart();
  }

  if (AppState.charts.pie) {
    generatePieChart();
  }

  if (!AppState.charts.bar && !AppState.charts.pie) {
    showFeedback(
      "No hay gráficas para actualizar. Genera una primero.",
      "error",
    );
  }
}

// Sistema de interpretación
function initializeInterpretation() {
  const interpretation = document.getElementById("interpretation");
  const wordCount = document.getElementById("interpretationWordCount");

  if (interpretation) {
    interpretation.addEventListener("input", updateWordCount);
  }
}

function updateWordCount() {
  const interpretation = document.getElementById("interpretation");
  const wordCount = document.getElementById("interpretationWordCount");

  if (!interpretation || !wordCount) return;

  const text = interpretation.value.trim();
  const wordCountNum = text
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  wordCount.textContent = wordCountNum;

  // Actualizar estilos
  const wordCounter = wordCount.parentElement;
  if (wordCountNum < 20 || wordCountNum > 80) {
    wordCounter.classList.add("warning");
    wordCounter.classList.remove("success");
  } else {
    wordCounter.classList.add("success");
    wordCounter.classList.remove("warning");
  }
}

// Sistema de finalización
function initializeCompletion() {
  const completeBtn = document.getElementById("completeBtn");
  const copyBtn = document.getElementById("copyForumBtn");
  const exportBtn = document.getElementById("exportPdfBtn");

  if (completeBtn) {
    completeBtn.addEventListener("click", handleCompletion);
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", copyToForum);
  }

  if (exportBtn) {
    exportBtn.addEventListener("click", exportToPDF);
  }
}

function handleCompletion() {
  const interpretation = document.getElementById("interpretation").value.trim();
  const wordCount = interpretation
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  // Validaciones
  if (AppState.tableData.length < 4) {
    showFeedback(
      "Necesitas al menos 4 filas para completar la actividad",
      "error",
    );
    return;
  }

  if (!interpretation) {
    showFeedback("Debes escribir una interpretación", "error");
    document.getElementById("interpretation").focus();
    return;
  }

  if (wordCount < 20 || wordCount > 80) {
    showFeedback(
      "Tu interpretación debe tener entre 20 y 80 palabras",
      "error",
    );
    document.getElementById("interpretation").focus();
    return;
  }

  AppState.interpretation = interpretation;

  // Generar código único
  AppState.completionCode = generateCompletionCode();

  // Mostrar resultado final
  showFinalResult();
}

function generateCompletionCode() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  const dateStr = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, "");

  const hash = btoa(
    AppState.studentData.fullName +
      AppState.studentData.career +
      AppState.studentData.group,
  )
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 8)
    .toUpperCase();

  return `CD2-ACT2-${hash}-${dateStr}-${random}`;
}

function showFinalResult() {
  hideElement("dataCapture");
  showElement("finalResult");

  // Actualizar resumen del estudiante
  document.getElementById("summaryName").textContent =
    AppState.studentData.fullName;
  document.getElementById("summaryCareer").textContent =
    AppState.studentData.career;
  document.getElementById("summaryGroup").textContent =
    AppState.studentData.group;
  document.getElementById("summaryDate").textContent =
    new Date().toLocaleString("es-MX");

  // Actualizar tabla final
  const finalTableContent = document.getElementById("finalTableContent");
  const tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Concepto</th>
                    <th>Minutos/semana</th>
                </tr>
            </thead>
            <tbody>
                ${AppState.tableData
                  .map(
                    (item) => `
                    <tr>
                        <td>${item.concept}</td>
                        <td>${item.value}</td>
                    </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>
    `;
  finalTableContent.innerHTML = tableHTML;

  // Actualizar tipo de gráfica
  const chartTypes = [];
  if (AppState.charts.bar) chartTypes.push("Barras");
  if (AppState.charts.pie) chartTypes.push("Pastel");
  document.getElementById("chartTypeGenerated").textContent =
    chartTypes.join(" y ") || "Ninguna";

  // Actualizar interpretación
  document.getElementById("finalInterpretation").textContent =
    AppState.interpretation;

  // Actualizar código
  document.getElementById("completionCode").textContent =
    AppState.completionCode;

  // Generar texto para el foro
  generateForumText();

  showFeedback("¡Actividad completada exitosamente!", "success");
}

function generateForumText() {
  const lines = [];
  lines.push("=== ACTIVIDAD CULTURA DIGITAL II ===");
  lines.push("");
  lines.push("Actividad 2: Modelación de datos y toma de decisiones");
  lines.push(`Nombre: ${AppState.studentData.fullName}`);
  lines.push(`Carrera: ${AppState.studentData.career}`);
  lines.push(`Grupo: ${AppState.studentData.group}`);
  lines.push(`Fecha y hora: ${new Date().toLocaleString("es-MX")}`);
  lines.push(`Código: ${AppState.completionCode}`);
  lines.push("");
  lines.push("DATOS REGISTRADOS:");
  AppState.tableData.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.concept}: ${item.value} min/semana`);
  });
  lines.push("");
  lines.push("GRÁFICAS GENERADAS:");
  const chartTypes = [];
  if (AppState.charts.bar) chartTypes.push("Gráfica de barras");
  if (AppState.charts.pie) chartTypes.push("Gráfica de pastel");
  lines.push(chartTypes.join(" y "));
  lines.push("");
  lines.push("INTERPRETACIÓN:");
  lines.push(AppState.interpretation);
  lines.push("");
  lines.push("=== FIN DE ACTIVIDAD ===");

  document.getElementById("forumText").textContent = lines.join("\n");
}

function copyToForum() {
  const forumText = document.getElementById("forumText").textContent;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(forumText)
      .then(() => {
        showFeedback(
          'Texto copiado. Pégalo en el foro: "Modelación de datos"',
          "success",
        );
      })
      .catch((err) => {
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
      'Texto copiado. Pégalo en el foro: "Modelación de datos"',
      "success",
    );
  } catch (err) {
    showFeedback("No se pudo copiar. Selecciona y copia manualmente.", "error");
  }

  document.body.removeChild(textarea);
}

function exportToPDF() {
  showFeedback(
    "Usa Ctrl+P o Imprimir → Guardar como PDF para exportar",
    "info",
  );
  window.print();
}

// Feedback
function showFeedback(message, type = "success") {
  // Crear elemento de feedback
  const feedback = document.createElement("div");
  feedback.className = `feedback ${type}`;
  feedback.textContent = message;
  feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "linear-gradient(135deg, #5a7a4f, #4a5f3f)" : "linear-gradient(135deg, #8b3a3a, #6b2f2f)"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 600;
        max-width: 300px;
    `;

  document.body.appendChild(feedback);

  // Auto-remover
  setTimeout(() => {
    feedback.style.opacity = "0";
    setTimeout(() => {
      if (feedback.parentNode) {
        feedback.parentNode.removeChild(feedback);
      }
    }, 300);
  }, 3000);
}

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM cargado, inicializando Actividad 2...");
  console.log("Chart.js disponible inicialmente:", typeof Chart);

  // Establecer año dinámico
  const footerYear = document.getElementById("footerYear");
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  loadChartJs()
    .then(() => {
      console.log("Chart.js listo para usarse");
      initializeRegistration();
      initializeCharts();
      initializeInterpretation();
      initializeCompletion();
      showElement("registration");
      console.log("Actividad 2 inicializada completamente");
    })
    .catch((error) => {
      console.error("No se pudo cargar Chart.js:", error);
      showFeedback(
        "Error: Chart.js no se pudo cargar. Verifica tu conexión y recarga.",
        "error",
      );
      // Deshabilitar botones de gráficas para evitar errores
      const barBtn = document.getElementById("generateBarBtn");
      const pieBtn = document.getElementById("generatePieBtn");
      const updateBtn = document.getElementById("updateChartsBtn");
      [barBtn, pieBtn, updateBtn].forEach((btn) => {
        if (btn) {
          btn.disabled = true;
        }
      });
    });
});
