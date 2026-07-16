/*
  Site interactions: render data-driven sections, mobile nav toggle,
  active-section nav state, and a small scroll-reveal helper.
  Everything here respects prefers-reduced-motion.
*/

document.addEventListener("DOMContentLoaded", () => {
  // Each init runs independently: if one throws (bad data, a missing
  // container, etc.) it's logged to the console but does not stop the
  // others from running — a single failure should never blank the page.
  safeRun(renderProjects);
  safeRun(renderCapabilities);
  safeRun(renderProcessSteps);
  safeRun(renderSkillGroups);
  safeRun(setupMobileNav);
  safeRun(setupActiveSectionNav);
  safeRun(setupScrollReveal);
});

function safeRun(fn) {
  try {
    fn();
  } catch (err) {
    console.error(`TRP site: "${fn.name}" failed to run.`, err);
  }
}

/* ---- Render: Selected Peaks project cards -------------------------------- */

function renderProjects() {
  const list = document.querySelector("[data-projects-list]");
  if (!list) return;

  list.innerHTML = projects
    .map(
      (project) => `
      <article class="project-card reveal">
        <div class="project-card__media">
          <img
            src="${project.image}"
            alt="${project.imageAlt}"
            loading="lazy"
            width="640"
            height="420"
          />
        </div>
        <div class="project-card__body">
          <span class="project-card__number">${project.number}</span>
          <h3>${project.title}</h3>
          <div class="project-card__tags">
            ${project.tags.map((tag) => `<span class="project-card__tag">${tag}</span>`).join("")}
          </div>
          <p>${project.description}</p>
          <ul class="project-card__proof-list">
            ${project.proofPoints.map((point) => `<li>${point}</li>`).join("")}
          </ul>
          <div class="project-card__cta">
            <!--
              No live case study pages yet (see js/data.js). Render this as a
              disabled button rather than a link so it never sends someone to
              a fake or dead URL.
            -->
            <button type="button" class="btn btn--secondary btn--disabled" disabled>
              ${project.ctaLabel}
            </button>
            <span class="placeholder-note">Project notes coming soon.</span>
          </div>
        </div>
      </article>`
    )
    .join("");
}

/* ---- Render: What I Do capability cards ------------------------------------ */

function renderCapabilities() {
  const grid = document.querySelector("[data-capabilities-grid]");
  if (!grid) return;

  grid.innerHTML = capabilities
    .map(
      (capability, index) => `
      <div class="capability-card reveal">
        <span class="capability-card__index">0${index + 1}</span>
        <h3>${capability.title}</h3>
        <p>${capability.description}</p>
      </div>`
    )
    .join("");
}

/* ---- Render: Process timeline ------------------------------------------------ */

function renderProcessSteps() {
  const timeline = document.querySelector("[data-process-timeline]");
  if (!timeline) return;

  timeline.innerHTML = processSteps
    .map(
      (item) => `
      <div class="process-step reveal">
        <span class="route-marker" aria-hidden="true">${item.step}</span>
        <div class="process-step__content">
          <h3 class="process-step__title">${item.title}</h3>
          <p>${item.description}</p>
        </div>
      </div>`
    )
    .join("");
}

/* ---- Render: Tools & Skills groups -------------------------------------------- */

function renderSkillGroups() {
  const grid = document.querySelector("[data-skills-grid]");
  if (!grid) return;

  grid.innerHTML = skillGroups
    .map(
      (group) => `
      <div class="skill-group reveal">
        <h3 class="skill-group__title">${group.title}</h3>
        <ul class="skill-group__list">
          ${group.items.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>`
    )
    .join("");
}

/* ---- Mobile nav toggle ------------------------------------------------------------ */

function setupMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  if (!toggle || !mobileNav) return;

  toggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the mobile menu after a link is chosen.
  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---- Active section state in the desktop nav --------------------------------------- */

function setupActiveSectionNav() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".main-nav__link");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---- Scroll reveal ------------------------------------------------------------------- */

/*
  Content is visible by default (see .reveal in css/global.css). This
  function only ever ADDS the "reveal--pending" class that opts an element
  into the hide-then-fade-in animation — it never removes visibility. If
  this function never runs at all (script error earlier, JS disabled), every
  section is still fully visible because nothing hid it in the first place.
*/
function setupScrollReveal() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window) || !revealItems.length) {
    return;
  }

  revealItems.forEach((item) => item.classList.add("reveal--pending"));

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
}
