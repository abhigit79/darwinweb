const state = { path: [], selectedProject: null };
    const stage = document.querySelector("#stage");
    const breadcrumb = document.querySelector("#breadcrumb");
    const backButton = document.querySelector("#backButton");

    function setPath(path, push = true) {
      state.path = path;
      state.selectedProject = null;
      if (push) history.pushState({ path }, "", path.length ? "#" + path.join("/") : "#explore");
      render();
    }

    function currentId() { return state.path[state.path.length - 1]; }
    function childNode(id) { return navTree[id]; }
    function projectsFor(id) { return projects.filter(p => p.cat === id); }
    function isProjectCategory(id) { return projectsFor(id).length > 0; }

    function render() {
      const id = currentId();
      backButton.hidden = state.path.length === 0;
      breadcrumb.textContent = state.path.length ? state.path.map(x => (navTree[x]?.label || labelForProjectCat(x))).join(" / ") : "Choose a direction";
      if (!id) return renderRoot();
      if (childNode(id)) return renderChildren(id);
      if (isProjectCategory(id)) return renderProjects(id);
    }

    function labelForProjectCat(id) {
      const labels = {"customer-analytics":"Customer Analytics","risk-analytics":"Risk Analytics","model-evaluation":"Model Evaluation","agentic-ai":"Agentic AI","other-ai-ml":"Other AI/ML","others":"Others","systems":"Systems","physical-ai":"Physical AI"};
      return labels[id] || id;
    }

    function renderRoot() {
      stage.className = "split-stage";
      stage.innerHTML = `
        <article class="panel"><button class="panel-btn" type="button" data-domain="data"><h2>Data Science</h2><p>Finance, analytics, model evaluation, AI software systems, forecasting, and customer intelligence.</p></button></article>
        <article class="panel"><button class="panel-btn" type="button" data-domain="engineering"><h2>Engineering</h2><p>Systems architecture, runtime design, multimodal pipelines, data platforms, and physical AI.</p></button></article>`;
      stage.querySelectorAll("[data-domain]").forEach(btn => btn.addEventListener("click", () => {
        stage.classList.add(btn.dataset.domain === "data" ? "selected-left" : "selected-right");
        setTimeout(() => setPath([btn.dataset.domain]), 420);
      }));
    }

    function renderChildren(id) {
      const node = childNode(id);
      stage.className = "split-stage selected-left";
      const gridClass = node.children.length === 3 ? "tile-grid three" : "tile-grid";
      stage.innerHTML = `<section class="subnav active" style="grid-column:1/-1"><div class="subnav-head"><h2>${node.label}</h2><p>${node.summary}</p></div><div class="${gridClass}">${node.children.map(child => `<button class="tile" type="button" data-child="${child.id}"><strong>${child.label}</strong><span>${child.summary}</span></button>`).join("")}</div></section>`;
      stage.querySelectorAll("[data-child]").forEach(btn => btn.addEventListener("click", () => setPath([...state.path, btn.dataset.child])));
    }

    function renderProjects(id) {
      const list = projectsFor(id);
      const selected = list.find(p => p.title === state.selectedProject) || list[0];
      state.selectedProject = selected?.title || null;
      stage.className = "split-stage selected-left";
      stage.innerHTML = `<section class="project-view active" style="grid-column:1/-1"><div class="project-head"><div><h2>${labelForProjectCat(id)}</h2><p>${projectIntro(id)}</p></div></div><div class="project-ribbon">${list.map(p => `<button class="project-card ${p.title === selected.title ? "active" : ""}" type="button" data-project="${escapeAttr(p.title)}"><small>${p.kind}</small><strong>${p.title}</strong><span>${p.summary}</span></button>`).join("")}</div><article class="project-detail" id="projectDetail"></article></section>`;
      stage.querySelectorAll("[data-project]").forEach(btn => btn.addEventListener("click", () => { state.selectedProject = btn.dataset.project; renderProjects(id); }));
      renderDetail(selected, id);
    }
    function projectIntro(id) {
      const copy = {
        "customer-analytics":"Professional analytics projects focused on customer, portfolio, marketing, and business planning work.",
        "risk-analytics":"Risk analytics work presented without employer names, fabricated metrics, or claims of sole ownership.",
        "model-evaluation":"Exactly three model-evaluation projects: credit risk PD, marketing propensity, and time-series design.",
        "agentic-ai":"Exactly two agentic-AI projects focused on guardrails, context management, architecture, and validation.",
        "other-ai-ml":"AI/ML work consolidated without exposing hardware engineering details in the Data Science branch.",
        "others":"Non-finance analytics, modelling, NLP, recommendation, computer vision, audio AI, and ML experiments.",
        "systems":"Systems architecture without hardware details: runtime, multimodal software, RAG, APIs, orchestration, and data platforms.",
        "physical-ai":"The hardware-aware branch: physical computing, edge audio, embedded control, RF, vision, sensing, and automotive electronics."
      };
      return copy[id] || "Project details.";
    }

    function renderDetail(project, id) {
      const detail = document.querySelector("#projectDetail");
      const research = ["finance-ai","other-ai-ml","systems","physical-ai"].includes(id) ? `<div class="research-strip"><strong>Research interests:</strong> ${researchInterests.join("; ")}. These are interests and experiments, not fabricated publications.</div>` : "";
      detail.innerHTML = `
        <div class="detail-title"><div><h3>${project.title}</h3><p>${project.summary}</p><div class="tag-row">${project.methods.map(m => `<em>${m}</em>`).join("")}</div></div></div>
        <div class="diagram">${project.workflow.map(step => `<span>${step}</span>`).join("<b></b>")}</div>
        <div class="detail-grid">
          <section><h4>Problem / Objective</h4><p>${project.objective}</p></section>
          <section><h4>Technical Implementation</h4><p>${project.implementation}</p></section>
          <section><h4>Technologies / Methods</h4><ul>${project.methods.map(m => `<li>${m}</li>`).join("")}</ul></section>
          <section><h4>Technical Challenge</h4><p>${project.challenge}</p></section>
          <section><h4>Evaluation / Results</h4><p>${project.evaluation}</p></section>
          <section><h4>Status and Next Step</h4><p><strong>${project.status}</strong> ${project.next}</p></section>
        </div>${research}`;
    }

    function escapeAttr(value) { return value.replace(/"/g, "&quot;"); }

    backButton.addEventListener("click", () => {
      if (!state.path.length) return;
      setPath(state.path.slice(0, -1));
    });

    window.addEventListener("popstate", event => {
      state.path = event.state?.path || parseHash();
      state.selectedProject = null;
      render();
    });

    function parseHash() {
      const raw = location.hash.replace(/^#/, "");
      if (!raw || raw === "explore") return [];
      return raw.split("/").filter(Boolean);
    }

    function setupContact() {
      const backdrop = document.querySelector("#contactBackdrop");
      const button = document.querySelector("#contactButton");
      const close = document.querySelector("#closeContact");
      document.querySelector("#contactPhone").textContent = contactConfig.phoneDisplay;
      document.querySelector("#contactPhone").href = contactConfig.phoneHref;
      setEmail("#emailOne", contactConfig.email1);
      setEmail("#emailTwo", contactConfig.email2);
      function open(){backdrop.classList.add("open");close.focus();}
      function shut(){backdrop.classList.remove("open");button.focus();}
      button.addEventListener("click", open);
      close.addEventListener("click", shut);
      backdrop.addEventListener("click", event => { if (event.target === backdrop) shut(); });
      document.addEventListener("keydown", event => { if (event.key === "Escape" && backdrop.classList.contains("open")) shut(); });
    }

    function setEmail(selector, value) {
      const node = document.querySelector(selector);
      if (!value) { node.textContent = "Empty placeholder"; node.classList.add("empty"); return; }
      node.innerHTML = `<a href="mailto:${value}">${value}</a>`;
      node.classList.remove("empty");
    }

    setupContact();
    history.replaceState({ path: parseHash() }, "", location.hash || "#explore");
    state.path = parseHash();
    render();
