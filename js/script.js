const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const careerFilters = document.querySelectorAll(".career-filter");
const careerCards = document.querySelectorAll(".career-card, .job-row");

careerFilters.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    careerFilters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    careerCards.forEach((card) => {
      const matches = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !matches);
    });
  });
});
