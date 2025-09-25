async function loadCourses() {
  try {
    const response = await fetch("guides.json");
    const data = await response.json();

    const container = document.getElementById("course-list");

    function renderCourses(filter = "todas") {
      container.innerHTML = ""; // limpia antes de pintar

      data.courses.forEach(course => {
        if (filter !== "todas" && course.estado !== filter && course.tipo !== filter) {
          return; // salta si no cumple el filtro
        }

        const card = document.createElement("div");
        card.className = "course-card";

        let estadoLabel = course.estado === "pendiente" 
          ? `<span class="estado pendiente">Pendiente ⏳</span>` 
          : `<span class="estado expirada">Expirada ❌</span>`;

        let tipoLabel = course.tipo === "obligatoria"
          ? `<span class="tipo obligatoria">Obligatoria 📌</span>`
          : `<span class="tipo participativa">Participativa ✨</span>`;

        card.innerHTML = `
          <h2>${course.name}</h2>
          <p>${course.instructions}</p>
          <p class="deadline">📅 Entrega: ${course.deadline}</p>
          ${estadoLabel} ${tipoLabel}
          <h4>Forma de evaluación:</h4>
          <ul>
            ${course.formaEvaluacion.map(f => `<li>${f}</li>`).join("")}
          </ul>
          <div class="files">
            ${course.files.map(file =>
              `<a href="${file.url}" target="_blank">${file.title}</a>`
            ).join("")}
          </div>
        `;

        container.appendChild(card);
      });
    }

    // render inicial
    renderCourses();

    // activar filtro
    document.getElementById("filter").addEventListener("change", e => {
      renderCourses(e.target.value);
    });

  } catch (error) {
    console.error("Error cargando guías:", error);
  }
}

loadCourses();
