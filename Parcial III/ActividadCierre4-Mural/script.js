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
            showEvidence(author, idea);
            
            // Clear form
            document.getElementById("postForm").reset();
            
            // Scroll to top of mural
            document.querySelector(".mural-section").scrollIntoView({behavior: "smooth"});
        }
    };

    document.getElementById("copyBtn").onclick = () => {
        const text = document.getElementById("evidenceText").innerText;
        navigator.clipboard.writeText(text).then(() => alert("Código copiado"));
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

function showEvidence(author, idea) {
    const card = document.getElementById("evidenceCard");
    card.classList.remove("hidden");
    
    const dateCode = Date.now().toString().slice(-6);
    const text = `=== MURAL DIGITAL: APORTACIÓN ===\nAlumno: ${author}\nIdea Clave: "${idea}"\nCódigo de Participación: MURAL-${dateCode}\nEstado: PUBLICADO`;
    
    document.getElementById("evidenceText").innerText = text;
}
