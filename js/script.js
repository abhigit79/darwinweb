const state = {
  activeDomain: portfolioData.domains[0].id,
  activeProject: null
};

const heroSections = document.querySelector("#heroSections");
const projectCarousel = document.querySelector("#projectCarousel");
const projectCount = document.querySelector("#projectCount");
const modalBackdrop = document.querySelector("#modalBackdrop");
const modalContent = document.querySelector("#modalContent");
const modalClose = document.querySelector("#modalClose");

function visibleProjects() {
  return portfolioData.projects.filter((project) => project.domain === state.activeDomain);
}

function setActiveDomain(id) {
  state.activeDomain = id;
  render();
}

function renderHeroSections() {
  heroSections.innerHTML = portfolioData.domains.map((domain) => `
    <button class="hero-section ${domain.id === state.activeDomain ? "active" : ""}" type="button" data-domain="${domain.id}" aria-pressed="${domain.id === state.activeDomain}">
      <span>${domain.heroTitle}</span>
      <small>${domain.heroLine}</small>
    </button>
  `).join("");

  heroSections.querySelectorAll(".hero-section").forEach((button) => {
    button.addEventListener("click", () => setActiveDomain(button.dataset.domain));
  });
}

function renderProjects() {
  const projects = visibleProjects();
  projectCount.textContent = `${projects.length} linked projects`;
  projectCarousel.innerHTML = projects.map((project) => `
    <button class="project-card" type="button" data-project="${project.id}" aria-label="Open ${project.name}">
      <span class="project-icon">${project.icon}</span>
      <span class="project-category">${project.category}</span>
      <strong>${project.name}</strong>
      <small>${project.line}</small>
      <span class="tag-row">${project.tags.map((tag) => `<em>${tag}</em>`).join("")}</span>
    </button>
  `).join("");

  projectCarousel.querySelectorAll(".project-card").forEach((button) => {
    button.addEventListener("click", () => openProject(button.dataset.project));
  });
}

function diagram(project) {
  return `<div class="diagram-line" aria-label="Project architecture">${project.architecture.map((step) => `<span>${step}</span>`).join("<b></b>")}</div>`;
}

function techList(items) {
  return `<ul class="tech-list-modal">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function openProject(id) {
  const project = portfolioData.projects.find((item) => item.id === id);
  if (!project) return;
  state.activeProject = project.id;
  modalContent.innerHTML = `
    <div class="modal-header">
      <span class="project-category">${project.category}</span>
      <h2 id="modalTitle">${project.name}</h2>
      <p>${project.line}</p>
      <div class="tag-row">${project.tags.map((tag) => `<em>${tag}</em>`).join("")}</div>
    </div>
    <div class="detail-grid">
      <section><h3>Problem / Objective</h3><p>${project.objective}</p></section>
      <section class="architecture-section"><h3>Architecture</h3>${diagram(project)}</section>
      <section><h3>Technical Implementation</h3><p>${project.implementation}</p></section>
      <section><h3>Technologies / Components</h3>${techList(project.technologies)}</section>
      <section><h3>Key Technical Challenge</h3><p>${project.challenge}</p></section>
      <section><h3>What I explored / learned</h3><p>${project.learned}</p></section>
      <section><h3>Potential next step</h3><p>${project.future}</p></section>
    </div>
  `;
  modalBackdrop.hidden = false;
  modalClose.focus();
}

function closeProject() {
  modalBackdrop.hidden = true;
  state.activeProject = null;
}

function render() {
  renderHeroSections();
  renderProjects();
}

modalClose.addEventListener("click", closeProject);
modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) closeProject();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modalBackdrop.hidden) closeProject();
});

render();
