async function loadCourses() {
  try {
    const response = await fetch("guides.json");
    const data = await response.json();
    const container = document.getElementById("course-list");
    const gradeSelect = document.getElementById("gradeFilter");

    // Generar lista única de grados
    const gradosUnicos = [...new Set(data.courses.map(c => c.grade))].sort();
    gradosUnicos.forEach(grado => {
      const opt = document.createElement("option");
      opt.value = grado;
      opt.textContent = `${grado}°`;
      gradeSelect.appendChild(opt);
    });

    function renderCourses(filter = "todas", gradeFilter = "todos") {
      container.innerHTML = "";
      const now = new Date();

      data.courses.forEach(course => {
        // Filtros de estado/tipo
        if (filter !== "todas" && course.estado !== filter && course.tipo !== filter) {
          return;
        }
        // Filtro de grado
        if (gradeFilter !== "todos" && course.grade !== gradeFilter) {
          return;
        }

        const card = document.createElement("div");
        card.className = "course-card";

        let estadoLabel = course.estado === "pendiente"
          ? `<span class="estado pendiente">Pendiente ⏳</span>`
          : `<span class="estado expirada">Expirada ❌</span>`;

        let tipoLabel = course.tipo === "obligatoria"
          ? `<span class="tipo obligatoria">Obligatoria 📌</span>`
          : `<span class="tipo participativa">Participativa ✨</span>`;

        // Manejo de fechas de visibilidad
        const desde = new Date(course.verLinkDesde);
        const hasta = new Date(course.verLinkHasta);
        let filesHTML = "";

        if (course.estado === "pendiente" && now >= desde && now <= hasta) {
          // Mostrar links
          filesHTML = course.files.map(file =>
            `<a href="${file.url}" target="_blank" class="btn-link">${file.title}</a>`
          ).join("");
        } else if (now < desde) {
          filesHTML = `<p class="msg-info">⏳ Disponible a partir de: ${desde.toLocaleString()}</p>`;
        } else {
          filesHTML = `<p class="msg-expired">❌ Links no disponibles</p>`;
        }

        card.innerHTML = `
          <h2>${course.name} <small>(Grado ${course.grade}°)</small></h2>
          <p>${course.instructions}</p>
          <p class="deadline">📅 Vigencia: ${desde.toLocaleDateString()} - ${hasta.toLocaleDateString()}</p>
          ${estadoLabel} ${tipoLabel}
          <h4>Forma de evaluación:</h4>
          <ul>
            ${course.formaEvaluacion.map(f => `<li>${f}</li>`).join("")}
          </ul>
          <div class="files">${filesHTML}</div>
        `;

        container.appendChild(card);
      });
    }

    // Render inicial
    renderCourses();

    // Eventos de filtros
    const filterSelect = document.getElementById("filter");
    filterSelect.addEventListener("change", () => {
      renderCourses(filterSelect.value, gradeSelect.value);
    });

    gradeSelect.addEventListener("change", () => {
      renderCourses(filterSelect.value, gradeSelect.value);
    });

  } catch (error) {
    console.error("Error cargando guías:", error);
  }
}

loadCourses();
