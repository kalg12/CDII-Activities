const DEMO_POSTS = [
    {
        author: "Carlos M.",
        idea: "La huella digital es permanente.",
        action: "Configuraré la privacidad de mis redes sociales.",
        reflection: "No me daba cuenta de cuánto compartía sin pensar.",
        color: "note-yellow",
        rot: "-2deg"
    },
    {
        author: "María L.",
        idea: "El impacto ambiental de los datos.",
        action: "Borraré correos antiguos para ahorrar energía.",
        reflection: "La nube también contamina, es algo que ignoraba.",
        color: "note-green",
        rot: "1deg"
    },
    {
        author: "Juan P.",
        idea: "Veracidad de la información.",
        action: "Verificaré noticias antes de compartir.",
        reflection: "Las fake news afectan nuestra democracia.",
        color: "note-blue",
        rot: "3deg"
    },
    {
        author: "Sofía R.",
        idea: "Seguridad en contraseñas.",
        action: "Usaré un gestor de contraseñas.",
        reflection: "Usaba la misma clave para todo, muy peligroso.",
        color: "note-pink",
        rot: "-1deg"
    },
    {
        author: "Diego Torres",
        idea: "Salud digital y desconexión.",
        action: "Dejaré el celular una hora antes de dormir.",
        reflection: "La tecnología debe servirnos, no controlarnos.",
        color: "note-yellow",
        rot: "2deg"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    renderMural();

    document.getElementById("postForm").onsubmit = (e) => {
        e.preventDefault();
        
        // Get values
        const author = document.getElementById("fullName").value.trim();
        const idea = document.getElementById("idea").value.trim();
        const action = document.getElementById("action").value.trim();
        const reflection = document.getElementById("reflection").value.trim();

        if(author && idea && action && reflection) {
            // Create user post object
            const userPost = {
                author: author,
                idea: idea,
                action: action,
                reflection: reflection,
                color: "note-user", // Special class
                rot: "0deg",
                isUser: true
            };

            // Add to mural
            addPostToMural(userPost, true);

            // Show Evidence
            showEvidence(author);
            
            // Clear form
            document.getElementById("postForm").reset();
            
            // Scroll to top of mural
            // document.querySelector(".mural-section").scrollIntoView({behavior: "smooth"}); 
            // Better to scroll to evidence card so they see the download button
            document.getElementById("evidenceCard").scrollIntoView({behavior: "smooth"});
        }
    };

    document.getElementById("downloadBtn").onclick = () => {
        generatePDF();
    };
});

function renderMural() {
    const grid = document.getElementById("muralGrid");
    // Clear initial
    // grid.innerHTML = ""; 
    // We append user post to top, so let's render standard ones
    // Actually simpler to just render all demo posts
    DEMO_POSTS.forEach(post => addPostToMural(post));
}

function addPostToMural(post, prepend = false) {
    const grid = document.getElementById("muralGrid");
    
    const note = document.createElement("div");
    note.className = `sticky-note ${post.color}`;
    if(!post.isUser) {
        // Randomize rotation slightly for demo posts if not set
        const rot = post.rot || (Math.random() * 6 - 3) + "deg";
        note.style.transform = `rotate(${rot})`;
    } else {
        // User post pops out
        note.style.border = "2px solid #7c3aed";
    }

    const html = `
        <div class="note-header">
            <span class="note-author">${post.author}</span>
            <span class="note-time">${post.isUser ? "Ahora" : "Hace un momento"}</span>
        </div>
        <div class="note-section">
            <span class="note-label">💡 Aprendizaje</span>
            <p class="note-text">${post.idea}</p>
        </div>
        <div class="note-section">
            <span class="note-label">⚡ Acción</span>
            <p class="note-text">${post.action}</p>
        </div>
        <div class="note-section">
            <span class="note-label">💭 Reflexión</span>
            <p class="note-text">${post.reflection}</p>
        </div>
    `;
    
    note.innerHTML = html;

    if(prepend) {
        grid.prepend(note);
    } else {
        grid.appendChild(note);
    }
}

function showEvidence(author) {
    const card = document.getElementById("evidenceCard");
    card.classList.remove("hidden");
    // Store author name for filename if needed, or just use generic
    window.lastAuthor = author || "Estudiante";
}

async function generatePDF() {
    const downloadBtn = document.getElementById("downloadBtn");
    const originalText = downloadBtn.innerText;
    downloadBtn.innerText = "⏳ Generando PDF...";
    downloadBtn.disabled = true;

    try {
        const { jsPDF } = window.jspdf;
        const target = document.getElementById("captureTarget"); // The mural section

        // Use html2canvas to capture the element
        const canvas = await html2canvas(target, {
            scale: 2, // Higher resolution
            useCORS: true,
            logging: false
        });

        const imgData = canvas.toDataURL('image/png');
        
        // A4 size: 210mm x 297mm
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // Calculate image dimensions to fit page width
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        // Add header text
        pdf.setFontSize(16);
        pdf.text("Evidencia: Mural Digital Colaborativo", 10, 10);
        pdf.setFontSize(12);
        pdf.text(`Fecha: ${new Date().toLocaleDateString()} - Alumno: ${window.lastAuthor}`, 10, 18);

        // Add image
        // If image is taller than page, might need multipage logic, but for now we scale to fit width
        // and let it flow. If it's too long, we might need to handle it, but sticky notes are usually compact.
        // Let's cap height to page margin if preserving aspect ratio is weird, 
        // but generally scaling to width is the standard approach.
        
        let yPos = 25;
        if (imgHeight > (pdfHeight - 30)) {
             // If too tall, just scale to fit height? Or just let it be. 
             // Simplest: just add it, users can scroll PDF.
             // Actually, if it's longer than page, jsPDF cuts it off.
             // For this activity, the mural shouldn't be effectively infinite.
             // We'll proceed with fitting to width.
        }

        pdf.addImage(imgData, 'PNG', 0, yPos, pdfWidth, imgHeight);
        
        pdf.save(`Evidencia_Mural_${window.lastAuthor.replace(/\s+/g, '_')}.pdf`);

    } catch (error) {
        console.error("PDF Error:", error);
        alert("Hubo un error al generar el PDF. Por favor intenta de nuevo.");
    } finally {
        downloadBtn.innerText = originalText;
        downloadBtn.disabled = false;
    }
}
