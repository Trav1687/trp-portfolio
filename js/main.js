/*
  Site interactions: render data-driven sections, mobile nav toggle,
  active-section nav state, and a small scroll-reveal helper.
  Everything here respects prefers-reduced-motion.
*/

document.addEventListener("DOMContentLoaded", () => {
  // Each init runs independently: if one throws (bad data, a missing
  // container, etc.) it's logged to the console but does not stop the
  // others from running: a single failure should never blank the page.
  safeRun(renderProjects);
  safeRun(renderCapabilities);
  safeRun(renderProcessSteps);
  safeRun(renderSkillGroups);
  safeRun(renderSkillsLegend);
  // Must run after both of the above (wires the elements they create).
  safeRun(setupSkillsCrossHighlight);
  safeRun(setupMobileNav);
  safeRun(setupActiveSectionNav);
  safeRun(setupScrollReveal);
  safeRun(setupHeroRouteDraw);
  safeRun(setupWaypointRings);
  safeRun(setupNavProgress);
  // Must run after renderCapabilities (needs the panels it creates to
  // already be in the DOM to measure them).
  safeRun(setupCapabilityMountains);
  // Must run after renderProjects (measures the cards it creates).
  safeRun(setupProjectScrollFocus);
  safeRun(setupContactForm);
  safeRun(setupFooterYear);
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
  const firstSlot = document.querySelector("[data-first-project]");
  const list = document.querySelector("[data-projects-list]");
  if (!list) return;

  // The first project (currently Mountainside Millwork, featured: true)
  // renders into its own slot inside .peaks__intro-group now, not into
  // .peaks__track with the rest, grouped with the "Selected Peaks"
  // header so the two can share one scroll-snap stop (see the comment
  // on this section in index.html). Everything from index 1 onward
  // still renders as a plain stack into .peaks__track.
  //
  // isAlt is passed by each project's ABSOLUTE position in the full
  // projects array, not by DOM sibling order, with the first project
  // now living in a separate container from the rest, nth-child-based
  // alternating (the old approach) would've silently recounted "1st,
  // 2nd, 3rd..." from whichever project happens to be first inside
  // .peaks__track, flipping the intended color/image-side pattern for
  // every project after it. Baking isAlt into the markup itself (see
  // .project-card--alt in css/components.css) keeps the pattern tied to
  // each project's real position in the data, immune to which
  // container it's actually rendered into.
  if (firstSlot && projects.length) {
    firstSlot.innerHTML = renderProjectCard(projects[0], 0);
  }
  list.innerHTML = projects
    .slice(1)
    .map((project, i) => renderProjectCard(project, i + 1))
    .join("");
}

/*
  One project can be marked `featured: true` in js/data.js (currently
  Mountainside Millwork, the one real client project) to get the full-width
  "strongest proof piece" treatment, see .project-card--featured in
  css/components.css. Everything else about the markup is identical between
  featured and standard cards; the only differences are the modifier class,
  a badge sourced from the project's own first tag (no invented copy), and
  larger image dimensions as a more accurate layout hint for the bigger
  featured media area.
*/
function renderProjectCard(project, index) {
  const isFeatured = project.featured === true;
  const isAlt = index % 2 === 1;
  // .reveal restored: cards went through a phase where they lived
  // inside a pinned/horizontal-scroll track (removed, see the comment
  // on this section in index.html) whose own scroll-scrub replaced this
  // as each card's motion. Back in normal vertical flow, the same
  // generic reveal-on-scroll every other section uses (setupScrollReveal()
  // in this file) is what fades/settles each card in: no separate
  // image-specific motion on top of that anymore (there used to be a
  // slow zoom-on-reveal here; removed per direct feedback, see
  // css/components.css).
  const cardClass = [
    "project-card",
    isFeatured && "project-card--featured",
    isAlt && "project-card--alt",
    "reveal",
  ]
    .filter(Boolean)
    .join(" ");
  // Real per-project dimensions from js/data.js (checked directly
  // against each file, not guessed): these five screenshots range
  // from nearly-square to 1.64:1 wide, so a single shared width/height
  // guess doesn't describe any of them accurately. Matching the actual
  // file matters here specifically because .project-card__media img
  // (components.css) relies on the browser's own image sizing rather
  // than a CSS-forced crop, and mismatched width/height attributes are
  // what can make an image look subtly stretched or compressed before
  // it's finished loading.
  const imageWidth = project.imageWidth;
  const imageHeight = project.imageHeight;
  // Featured card used to get an extra badge overlaid on its image
  // (sourced from the project's own first tag) and every card had a
  // "Project notes in progress" status line, both dropped per direct
  // feedback (circled in a screenshot as things to remove). The badge
  // markup and the .project-card__status/.project-card__status-dot
  // CSS in css/components.css are gone along with these.

  return `
      <article class="${cardClass}">
        <div class="project-card__media">
          <img
            src="${project.image}"
            alt="${project.imageAlt}"
            loading="lazy"
            width="${imageWidth}"
            height="${imageHeight}"
            style="aspect-ratio: ${imageWidth} / ${imageHeight};"
          />
        </div>
        <div class="project-card__body">
          <h3>${project.title}</h3>
          <p class="project-card__meta">${project.tags.join(" · ")}</p>
          <p>${project.description}</p>
          <ul class="project-card__proof-chips">
            ${project.proofPoints
              .map((point) => `<li>${point}</li>`)
              .join("")}
          </ul>
          ${renderProjectCta(project)}
        </div>
      </article>`;
}

/*
  A project's CTA, in one of two states depending on whether there is
  somewhere real to send people.

  With a `liveUrl` (js/data.js) it's a genuine external link. Without one
  it stays the disabled-button placeholder every card used to carry: the
  case-study/project-notes pages don't exist yet (see TODO.md), and a
  disabled control is the honest way to say so: the same pattern as the
  About section's Resume button. A dead href="#" would look identical to a
  working link right up until someone clicks it.

  Both branches use the same .btn__wrap markup and the same
  hero/nav waypoint button classes at the smaller card size (see
  .project-card__cta.btn--waypoint.btn--primary in css/components.css).
  setupWaypointRings() queries every .btn__wrap generically, so either
  branch gets the same real-pixel-measured ring for free.

  rel="noopener" is what actually matters with target="_blank", without
  it the opened page gets a window.opener handle back to this one.
  "noreferrer" is included alongside it as the conventional pairing.
  (Modern browsers imply noopener for target="_blank", but stating it
  costs nothing and doesn't depend on which browser is reading it.)

  The "(opens in a new tab)" note is visually hidden rather than dropped:
  a sighted user finds out when the tab appears, which is not a cue a
  screen-reader user gets. It sits inside the <a> so it's read as part of
  the link's own accessible name.
*/
function renderProjectCta(project) {
  const inner = project.liveUrl
    ? `<a
              href="${project.liveUrl}"
              class="btn btn--primary btn--waypoint project-card__cta"
              target="_blank"
              rel="noopener noreferrer"
            >
              ${project.ctaLabel}<span class="visually-hidden"> (opens in a new tab)</span>
            </a>`
    : `<button
              type="button"
              class="btn btn--primary btn--waypoint btn--disabled project-card__cta"
              disabled
              title="Project notes page coming soon"
            >
              ${project.ctaLabel}
            </button>`;

  return `<span class="btn__wrap btn__wrap--primary project-card__cta-wrap">
            ${inner}
            <svg class="btn__ring" aria-hidden="true" focusable="false" preserveAspectRatio="none"><path></path></svg>
          </span>`;
}

/* ---- Selected Peaks: scroll-focus the card nearest the viewport centre ----- */

/*
  Dims every project card and lifts whichever one is closest to the middle
  of the screen, so scrolling the section reads like hovering each card in
  turn (see .peaks.is-scroll-focus in css/components.css for the styling
  and why it uses `scale`/`filter` rather than `transform`/`opacity`).

  Adapted from a reference snippet that measured an inner scroll container
  (its own scrollTop/clientHeight, with card offsetTop). These cards sit in
  normal page flow instead, so the maths is rebuilt on
  getBoundingClientRect() against the viewport. offsetTop would have been
  wrong here regardless of the scroll source: it's measured from the
  nearest positioned ancestor, and these five cards live in TWO different
  containers (the featured one in .peaks__intro-group, the rest in
  .peaks__track), so their offsetTop values aren't on a common origin.
  Viewport rects are.

  The reference also activated any card within a fixed 150px of centre.
  That threshold was tuned to its own 520px demo box; against a real
  viewport with cards this tall it would leave dead stretches where
  nothing is active, and could light two at once. This picks the single
  nearest card instead, then applies a proximity limit, so there is
  always at most one active card, and it stays active until another one
  is genuinely closer.
*/
function setupProjectScrollFocus() {
  const section = document.querySelector(".peaks");
  if (!section) return;

  const cards = Array.from(section.querySelectorAll(".project-card"));
  if (!cards.length) return;

  // Scroll-linked motion nobody asked for. Bailing out before adding the
  // class leaves every card at full presence permanently, which is the
  // correct reduced-motion result: not a dimmed section that never
  // resolves.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Enables the dimmed resting state. Added here rather than sitting in
  // the markup so the effect can never strand the cards dim if this
  // script fails to load or throws before reaching this line.
  section.classList.add("is-scroll-focus");

  // How far from the viewport centre a card may sit and still count as
  // focused, as a fraction of viewport height. Generous enough that one
  // card is essentially always active while scrolling through the
  // section, but not so wide that a card stays lit well after it has
  // left the screen.
  const FOCUS_RANGE_FRACTION = 0.4;

  let ticking = false;

  function apply() {
    ticking = false;

    const viewportCentre = window.innerHeight / 2;
    const focusRange = window.innerHeight * FOCUS_RANGE_FRACTION;

    let nearestCard = null;
    let nearestDistance = Infinity;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCentre = rect.top + rect.height / 2;
      const distance = Math.abs(viewportCentre - cardCentre);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestCard = card;
      }
    });

    const focused = nearestDistance <= focusRange ? nearestCard : null;
    cards.forEach((card) => card.classList.toggle("is-focused", card === focused));
  }

  function onScroll() {
    // Coalesces scroll bursts into one update per frame: scroll fires
    // far more often than the screen repaints, so doing this per event
    // would be layout reads the browser only ever paints once.
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(apply);
  }

  apply();
  // passive: this handler never calls preventDefault, and declaring that
  // lets the browser scroll without waiting to find out.
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
}

/* ---- Render: What I Do capability timeline --------------------------------- */

function renderCapabilities() {
  const grid = document.querySelector("[data-capabilities-grid]");
  if (!grid) return;

  // Design trial #2: bento-style hover-expand panels: four equal-width
  // panels in one row at desktop; hovering (or focusing, for keyboard
  // users) one grows it via flex-grow while the description underneath
  // fades/expands into view, the others staying visible but narrower.
  // Collapsed by default so the row reads clean at a glance, per the
  // researched pattern of "stays uncluttered at rest, rewards actually
  // engaging with it." tabindex="0" is what lets :focus-within trigger
  // the same reveal for keyboard users, not just mouse hover: global
  // focus-visible styling (global.css) already covers plain [tabindex]
  // elements, so no extra focus-ring CSS is needed here.
  //
  // Trial #1 (.capability-timeline/.capability-step, components.css +
  // layout.css) and the original .capability-card/.capability-grid are
  // both left in place, unused, reverting to either is just swapping
  // the classes here and in index.html back, not rebuilding styles.
  grid.innerHTML = capabilities
    .map(
      (capability, index) => `
      <div class="capability-panel" tabindex="0">
        <div class="capability-panel__body">
          <h3>${capability.title}</h3>
          <p>${capability.description}</p>
        </div>
      </div>`
    )
    .join("");
}

/* ---- What I Do: shared mountain-range background across the row ----------- */

/*
  The four .capability-panel elements each show a background-image of the
  same file (assets/patterns/capability-mountains.svg, set in components.css
  on .capability-panel::after), but sized and positioned so together they
  read as ONE continuous mountain range spanning the whole row, not four
  separate repeating crops: per direct request, referencing the hero
  scene's own mountain illustration style.

  The trick: size the image (via --mtn-size) to the FULL ROW's width, not
  each panel's own width, then shift it left (via --mtn-pos, a negative
  offset) by exactly how far that panel sits from the row's left edge.
  Every panel is looking through its own window at a different slice of
  the one same oversized image, so the slices tile back together correctly
  regardless of how wide each individual panel currently is.

  This has to be recomputed continuously, not just once on page load: the
  bento hover-expand effect (components.css) changes each panel's actual
  rendered width via a flex-grow transition, which means every panel's
  offset-from-the-left shifts too, for the whole ~450ms of that animation,
  not just at the very start and end. ResizeObserver is what makes the
  slices visibly pan/shift DURING the hover transition (matching what was
  asked for) instead of just jumping between two static positions: it
  fires on every layout-affecting resize of an observed element, which a
  flex-grow transition produces continuously, frame by frame, as it runs.
*/
function setupCapabilityMountains() {
  const bento = document.querySelector(".capability-bento");
  if (!bento) return;

  const panels = Array.from(bento.querySelectorAll(".capability-panel"));
  if (!panels.length) return;

  function update() {
    const containerRect = bento.getBoundingClientRect();
    panels.forEach((panel) => {
      const panelRect = panel.getBoundingClientRect();
      const offsetX = panelRect.left - containerRect.left;
      // "auto" height, not "100%": the artwork is a real raster
      // illustration with a fixed 4:3 aspect ratio (it replaced a
      // generated SVG that carried preserveAspectRatio="none" and was
      // built to be stretched to any shape). Forcing 100% height would
      // squash it into the row's much wider letterbox. auto keeps the
      // true ratio, letting the image run taller than the panel, and
      // the vertical percentage below picks which band of it shows.
      //
      // 15%, down from 30%: a smaller percentage slides the image DOWN
      // within each panel (it shows a band nearer the image's own top).
      // At 30% the summit was landing just above the visible band and
      // getting clipped; 15% brings the peak fully into frame with a
      // little sky above it, per direct request.
      panel.style.setProperty("--mtn-size", `${containerRect.width}px auto`);
      panel.style.setProperty("--mtn-pos", `-${offsetX}px 15%`);
    });
  }

  update();
  window.addEventListener("resize", update);

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(update);
    panels.forEach((panel) => observer.observe(panel));
  } else {
    // Fallback for browsers without ResizeObserver: at least the resting
    // and fully-expanded states line up correctly, even without the
    // continuous mid-transition pan the observer gives for free.
    panels.forEach((panel) => {
      panel.addEventListener("mouseenter", update);
      panel.addEventListener("mouseleave", update);
      panel.addEventListener("focus", update);
      panel.addEventListener("blur", update);
    });
  }
}

/* ---- Render: Process timeline ------------------------------------------------ */

function renderProcessSteps() {
  const timeline = document.querySelector("[data-process-timeline]");
  if (!timeline) return;

  // Editorial ruled-list layout: each step is one full-width row, number
  // quiet on the left, title and description given real room across the
  // rest. Replaced a six-column timeline whose narrow columns squeezed
  // every description into a cramped block, and whose connecting route
  // line was dropped per direct request. The circular .route-marker
  // badge went with it: a number set as plain type suits an editorial
  // list, where a filled badge would read as a leftover UI chip.
  timeline.innerHTML = processSteps
    .map(
      (item) => `
      <div class="process-step reveal reveal--repeat">
        <span class="process-step__number" aria-hidden="true">${item.step}</span>
        <h3 class="process-step__title">${item.title}</h3>
        <p class="process-step__desc">${item.description}</p>
      </div>`
    )
    .join("");
}

/* ---- Render: Tools & Skills groups -------------------------------------------- */

function renderSkillGroups() {
  const grid = document.querySelector("[data-skills-grid]");
  if (!grid) return;

  // Each skill's `projects` entries are matched against real project
  // titles by string. A typo wouldn't throw: the skill would just
  // silently never match any filter, which is exactly the kind of bug
  // that survives for months. Surfacing it in the console keeps the
  // failure loud without breaking the render.
  const knownTitles = new Set(projects.map((project) => project.title));
  skillGroups.forEach((group) => {
    group.items.forEach((item) => {
      item.projects
        .filter((title) => !knownTitles.has(title))
        .forEach((title) =>
          console.warn(
            `TRP site: skill "${item.name}" lists project "${title}", which doesn't match any project title in js/data.js.`
          )
        );
    });
  });

  grid.innerHTML = skillGroups
    .map(
      (group) => `
      <div class="skill-group reveal">
        <h3 class="skill-group__title">${group.title}</h3>
        <ul class="skill-group__list">
          ${group.items.map(renderSkillChip).join("")}
        </ul>
      </div>`
    )
    .join("");
}

/*
  A skill chip carries the projects behind it in a data attribute, so the
  filter in setupSkillsCrossHighlight() can match without re-reading
  js/data.js. Pipe-separated rather than JSON: project titles contain
  spaces but no pipes, and this avoids escaping quotes inside an HTML
  attribute.

  The visible project count was removed per direct request: the chips
  read cleaner without it, and selecting a project in the legend already
  shows which skills it involved, which is the same evidence shown a
  clearer way. The count survives in the aria-label, since a screen
  reader user can't see the highlight the legend produces and would
  otherwise lose that information entirely.
*/
function renderSkillChip(item) {
  const count = item.projects.length;
  const label =
    count === 0
      ? item.name
      : `${item.name}, used on ${count} ${count === 1 ? "project" : "projects"}`;

  return `<li class="skill-chip" data-skill-projects="${item.projects.join("|")}" aria-label="${label}">${item.name}</li>`;
}

/* ---- Tools & Skills: filter skills by project ------------------------------- */

/*
  Renders the project legend that sits above the skill groups. Selecting a
  project dims every skill that project didn't use, so the section can be
  read as "here's what actually went into this piece of work" rather than
  as an unverifiable list of everything I've touched.

  Real <button>s, not styled divs: these are interactive controls, so they
  need keyboard focus, Enter/Space activation, and a pressed state for
  free rather than reimplemented. aria-pressed is what communicates the
  toggle state to assistive tech.
*/
function renderSkillsLegend() {
  const legend = document.querySelector("[data-skills-legend]");
  if (!legend) return;

  legend.innerHTML = projects
    .map(
      (project) => `
      <button type="button" class="skills-legend__item" data-project="${project.title}" aria-pressed="false">
        <span class="skills-legend__num" aria-hidden="true">${project.number}</span>
        ${project.title}
      </button>`
    )
    .join("");
}

/*
  Wires the legend to the skill chips.

  Click to pin, hover to preview. The hover preview is the nicer
  interaction, but it's mouse-only: click/tap is what makes this work on
  touch, where hover doesn't meaningfully exist, and via keyboard. A
  pinned selection survives the pointer leaving; an un-pinned hover
  reverts on mouseleave.

  Filtering is a class toggle on the container plus one on each matching
  chip, so all the actual visual work stays in CSS (components.css) and
  this only decides what matches.
*/
function setupSkillsCrossHighlight() {
  const section = document.querySelector("#tools-and-skills");
  if (!section) return;

  const legend = section.querySelector("[data-skills-legend]");
  const grid = section.querySelector("[data-skills-grid]");
  if (!legend || !grid) return;

  const buttons = Array.from(legend.querySelectorAll(".skills-legend__item"));
  const chips = Array.from(grid.querySelectorAll(".skill-chip"));
  if (!buttons.length || !chips.length) return;

  // The pinned (clicked) project, or null for none. Hovering shows a
  // different project temporarily without disturbing this.
  let pinned = null;

  function paint(activeTitle) {
    // No active project means no filtering at all, every chip back to
    // full strength, rather than everything dimmed equally.
    grid.classList.toggle("is-filtering", Boolean(activeTitle));

    chips.forEach((chip) => {
      const list = (chip.dataset.skillProjects || "").split("|").filter(Boolean);
      chip.classList.toggle("is-match", Boolean(activeTitle) && list.includes(activeTitle));
    });

    buttons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.project === activeTitle);
      // Reflects the PINNED state only, not the transient hover preview,
      // aria-pressed describes what's actually selected, and flipping it
      // on hover would announce selections that were never made.
      button.setAttribute("aria-pressed", String(button.dataset.project === pinned));
    });
  }

  buttons.forEach((button) => {
    const title = button.dataset.project;

    button.addEventListener("click", () => {
      // Clicking the pinned project again clears it, without this the
      // filter would be a one-way trip with no way back to the full list.
      pinned = pinned === title ? null : title;
      paint(pinned);
    });

    button.addEventListener("mouseenter", () => paint(title));
    button.addEventListener("focus", () => paint(title));
    button.addEventListener("mouseleave", () => paint(pinned));
    button.addEventListener("blur", () => paint(pinned));
  });

  paint(null);
}

/* ---- Contact form ----------------------------------------------------------------- */

/*
  Upgrades the contact form to submit in the background, so a person who
  fills it in stays on the page instead of being handed off to Formspree's
  own confirmation screen.

  Strictly an enhancement. The form in index.html has a real action and
  method, so with JavaScript off or broken it still posts normally and
  Formspree handles it: this only intercepts once it's confirmed it can
  do the job properly.
*/
function setupContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const status = form.querySelector("[data-form-status]");
  const submitButton = form.querySelector('button[type="submit"]');
  if (!status || !submitButton) return;

  // fetch and FormData are what this relies on. Anything without them
  // gets the native form post, which works fine: better that than
  // intercepting the submit and then failing to send it.
  if (!("fetch" in window) || !("FormData" in window)) return;

  // The endpoint is wired up (Formspree form xlgqkeyo), so this guard
  // shouldn't fire. Kept as a safety net: if the action is ever reset to
  // a placeholder (copying this file as a starting point for another // site is the likely way) the form says so instead of posting to a
  // dead URL and reporting a generic failure that looks like a bug.
  const PLACEHOLDER = "YOUR_FORM_ID";
  const originalLabel = submitButton.textContent;

  function setStatus(message, state) {
    status.textContent = message;
    status.classList.toggle("is-error", state === "error");
    status.classList.toggle("is-success", state === "success");
  }

  form.addEventListener("submit", (event) => {
    // Let the browser run its own validation first. If it fails, do
    // nothing: the native messages are already accessible and
    // localised, and duplicating them here would just be noise.
    if (!form.checkValidity()) return;

    event.preventDefault();

    // Guard against the endpoint never having been filled in. Without
    // this the form would post to a dead URL and report a generic
    // failure, which looks like a bug rather than an unfinished setup.
    if (form.action.includes(PLACEHOLDER)) {
      setStatus(
        "This form isn't connected yet. Please use the email address below in the meantime.",
        "error"
      );
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending…";
    setStatus("", null);

    fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      // Formspree returns JSON only when asked; without this it replies
      // with a redirect to its own HTML page.
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Form endpoint returned ${response.status}`);
        form.reset();
        setStatus("Thanks, message sent. I'll get back to you within a day.", "success");
      })
      .catch((error) => {
        console.error("TRP site: contact form submission failed.", error);
        // Names the fallback rather than just reporting failure: a dead
        // end here costs a real enquiry.
        setStatus(
          "Something went wrong sending that. Please email TravisPeakman@outlook.com instead.",
          "error"
        );
      })
      .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = originalLabel;
      });
  });
}

/* ---- Footer year ------------------------------------------------------------------- */

/*
  Keeps the footer copyright year current.

  The markup ships with the correct year already written in, so this only
  ever overwrites it with the same value until January rolls over, with
  JavaScript off the footer is still correct, it just stops updating. A
  hard-coded year on a site nobody edits for a year is the kind of thing
  that quietly dates a portfolio.
*/
function setupFooterYear() {
  const target = document.querySelector("[data-current-year]");
  if (!target) return;
  target.textContent = String(new Date().getFullYear());
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

  // Only the plain section links (Work, What I Do, Process, Skills,
  // About) count as steps along the nav-progress route (see
  // setupNavProgress() and .nav-progress in css/layout.css): Contact
  // is a CTA button, not a stop along the route, even though it's also
  // a .main-nav__link with a matching #contact section. .btn is what
  // distinguishes it from the plain links.
  const routeLinks = Array.from(navLinks).filter((link) => !link.classList.contains("btn"));
  const progressTrack = document.querySelector(".nav-progress");
  const progressFill = progressTrack && progressTrack.querySelector(".nav-progress__fill");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });

        if (progressFill && progressTrack) {
          const activeRouteLink = routeLinks.find((link) => link.getAttribute("href") === `#${id}`);
          if (activeRouteLink) {
            // Measures the active link's real right edge against the
            // track's real width, rather than dividing evenly into
            // fifths: an equal 1/5, 2/5, ... split ignores that the
            // links are all different widths (gap is a responsive
            // clamp() too), so it overshot past shorter words like
            // "Work" into the gap toward the next link (confirmed in
            // testing). This way the fill always stops exactly at the
            // right edge of whichever link is actually active.
            const trackRect = progressTrack.getBoundingClientRect();
            const linkRect = activeRouteLink.getBoundingClientRect();
            if (trackRect.width) {
              const fraction = (linkRect.right - trackRect.left) / trackRect.width;
              progressFill.style.width = `${Math.max(0, Math.min(1, fraction)) * 100}%`;
            }
          } else if (id === "contact") {
            // Contact is the end of the route, not a stop along it, so
            // it isn't in routeLinks, but the line should still travel
            // the whole way to it. The track now ends at the Contact
            // button's left edge (setupNavProgress), so a full fill
            // arrives exactly at the button.
            //
            // Previously this fell through to the reset below and the
            // line vanished the instant you reached the last section,
            // which read as the route failing rather than completing.
            progressFill.style.width = "100%";
          } else {
            // The intersecting section isn't one of the 5 tracked
            // stops: the hero (id="top") is also inside <main
            // section[id]> and gets observed, but no nav link points
            // to #top, so this branch previously just never ran and
            // the fill was left showing whatever it was at last (Work,
            // stuck lit even back at the very top of the page,
            // confirmed in testing). Reset it explicitly instead of
            // leaving it stale.
            progressFill.style.width = "0%";
          }
        }
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---- Nav route-progress line ---------------------------------------------- */

/*
  Positions/sizes .nav-progress (the dashed track under the plain nav
  links) to span exactly from the left edge of "Work" to the right edge
  of "About", in real pixels measured at runtime: the nav's gap is a
  responsive clamp(), so a fixed CSS width or percentage would drift
  out of sync with the actual link positions across breakpoints/resize,
  the same reason the hero glow and waypoint button rings are measured
  this way rather than assumed. Only handles position/size; the fill's
  WIDTH (how far "along the route" the highlighted section is) is
  driven separately by setupActiveSectionNav() above, since that's
  already where the current section is determined.
*/
function setupNavProgress() {
  const nav = document.querySelector(".main-nav");
  const track = document.querySelector(".nav-progress");
  const firstLink = document.querySelector('.main-nav__link[href="#work"]');
  // The track now runs to the CONTACT button rather than stopping at
  // About. Contact is the end of the route, so the line should be able to
  // reach it: previously the fill had nowhere left to go once you passed
  // About, and reset to nothing at the very moment the journey finished.
  //
  // Measured to the button's LEFT edge, so a full fill arrives at the
  // button and stops, rather than running underneath it.
  const endLink = document.querySelector('.main-nav__link[href="#contact"]');
  if (!nav || !track || !firstLink || !endLink) return;

  function position() {
    const navRect = nav.getBoundingClientRect();
    const firstRect = firstLink.getBoundingClientRect();
    const endRect = endLink.getBoundingClientRect();
    if (!firstRect.width || !endRect.width) return;

    track.style.left = `${firstRect.left - navRect.left}px`;
    track.style.width = `${endRect.left - firstRect.left}px`;
    track.style.top = `${firstRect.bottom - navRect.top}px`;
  }

  position();
  if ("ResizeObserver" in window) {
    new ResizeObserver(position).observe(nav);
  } else {
    window.addEventListener("resize", position);
  }
}

/* ---- Scroll reveal ------------------------------------------------------------------- */

/*
  Content is visible by default (see .reveal in css/global.css). This
  function only ever ADDS the "reveal--pending" class that opts an element
  into the hide-then-fade-in animation: it never removes visibility. If
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

  // Two behaviours from one observer.
  //
  // Default: reveal once, then stop watching. Most of the page should
  // settle and stay settled, re-animating an About paragraph every time
  // it scrolls past would be noise, not polish.
  //
  // Opt-in via .reveal--repeat: re-arm on the way out so the element
  // animates again next time it enters. Used by the Process cards, whose
  // zipper is the point of that section and reads as broken if it only
  // ever plays once. Opt-in rather than global precisely because it's the
  // exception.
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        const repeats = entry.target.classList.contains("reveal--repeat");

        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          if (!repeats) obs.unobserve(entry.target);
          return;
        }

        // Only repeating elements get reset. Without this guard a
        // non-repeating element would still be observed on the first
        // pass and could be un-revealed before it ever settled.
        if (repeats) entry.target.classList.remove("is-visible");
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

/* ---- Hero route glow ------------------------------------------------------------------ */

/*
  Drives .hero__scene::after (route reveal) and ::before (peak pulse),
  see css/layout.css.

  Both are positioned by mapping fixed PIXEL COORDINATES from the actual
  source image (trp-hero-scene-wide.webp / trp-hero-route-mask.png, both
  1672x941, see HERO_IMAGE_SIZE) onto wherever that image currently lands
  on screen, via mapImagePointToBox() below. getHeroBackgroundConfig()
  mirrors the exact background-size/background-position breakpoints
  already defined on .hero__scene in css/layout.css (639px / 1600px /
  1900px), so the mapping stays correct at every breakpoint and after a
  resize or browser-zoom change, without guessing the crop offline.

  This replaced two earlier approaches that both broke under zoom/resize:
  a diagonal sweep positioned via mask-position percentages worked out
  offline in Python (assumed one fixed viewport aspect ratio), and a peak
  marker positioned via plain CSS left/top percentages of the box itself
  (stayed put relative to the BOX even when the image's crop shifted
  underneath it at a breakpoint, so it drifted off the actual marker).

  NOTE: getHeroBackgroundConfig()'s breakpoint values are a hand-kept
  mirror of the media queries on .hero__scene in css/layout.css: if
  those breakpoints or values change, update both places.
*/

// Natural pixel size of trp-hero-scene-wide.webp / trp-hero-route-mask.png
// (both derived from the same original asset, same dimensions).
const HERO_IMAGE_SIZE = { width: 1672, height: 941 };
// Pixel coordinates within that image: the route's bottom-most point
// (near the person's feet), found by isolating the route's non-transparent
// pixels in trp-hero-route-mask.png; and the peak marker's bullseye
// center, found directly in trp-hero-scene-wide.png/webp by isolating the
// small solid dot at its center (not the soft glow halo around it, which
// sits lower and further left: an earlier version of this constant
// measured the halo by mistake, which is why the CSS pulse used to drift
// toward the rock face instead of sitting on the marker).
const HERO_FEET_PX = { x: 848, y: 864 };
const HERO_PEAK_PX = { x: 1364, y: 57 };
// Diameter of the peak-marker pulse, expressed in source-image pixels so
// it scales with the background crop instead of with the box. 70 matches
// what the old `width: 4.2%` produced at desktop width, which is the size
// the effect was originally tuned at.
const PEAK_HALO_IMAGE_PX = 70;

/*
  Mirrors the .hero__scene background-size/background-position rules in
  css/layout.css, keyed off the same viewport-width breakpoints those
  media queries use (639px / 1600px / 1900px). Kept as an explicit mirror
  rather than reading getComputedStyle().backgroundSize/backgroundPosition
  back out of the browser: those can come back in different forms
  depending on the browser (resolved to px vs. left as percentages,
  possibly other formats for edge/corner keywords), which isn't something
  that could be verified without a real browser to test against. Matching
  the same width checks the CSS itself uses removes that guesswork
  entirely, at the cost of needing to keep this in sync with
  css/layout.css by hand if those breakpoints ever change.
*/
function getHeroBackgroundConfig() {
  const vw = window.innerWidth;
  if (vw <= 639) {
    // 0.82, mirroring `background-position: 82% bottom` on .hero__scene in
    // css/layout.css. Was 1 (right) until the mobile crop was shifted to
    // bring the standing figure into frame; leaving this at 1 would have
    // put the peak-marker pulse ~74px right of where the summit actually
    // renders on a 390px viewport.
    return { size: "cover", posX: 0.82, posY: 1 }; // 82% bottom
  }
  if (vw >= 1600) {
    return { size: "auto-height", posX: 1, posY: 0.5 }; // auto 100%, right center
  }
  return { size: "cover", posX: 1, posY: 0.5 }; // cover, right center
}

/*
  Maps a pixel coordinate in the hero's source image to a pixel position
  within el's own rendered box, using getHeroBackgroundConfig() above
  rather than introspecting computed styles. Returns null if el isn't
  laid out yet (zero-size box).
*/
function mapImagePointToBox(el, imgX, imgY) {
  const rect = el.getBoundingClientRect();
  const boxW = rect.width;
  const boxH = rect.height;
  if (!boxW || !boxH) return null;

  const naturalW = HERO_IMAGE_SIZE.width;
  const naturalH = HERO_IMAGE_SIZE.height;
  const config = getHeroBackgroundConfig();

  let dispW;
  let dispH;
  if (config.size === "auto-height") {
    // background-size: auto 100%: height fills the box, width scales
    // proportionally and is left to overflow/crop.
    dispH = boxH;
    dispW = boxH * (naturalW / naturalH);
  } else {
    // cover
    const scale = Math.max(boxW / naturalW, boxH / naturalH);
    dispW = naturalW * scale;
    dispH = naturalH * scale;
  }

  const offsetX = (boxW - dispW) * config.posX;
  const offsetY = (boxH - dispH) * config.posY;

  const scaleX = dispW / naturalW;
  const scaleY = dispH / naturalH;

  return {
    x: offsetX + imgX * scaleX,
    y: offsetY + imgY * scaleY,
    scale: scaleX,
    boxW,
    boxH,
  };
}

function setupHeroRouteDraw() {
  const scene = document.querySelector(".hero__scene");
  const heroSection = document.querySelector(".hero");
  if (!scene) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DURATION_MS = 8000;
  // Was widened (90 → 140 → 175) across two "make it more noticeable"
  // rounds, which also controlled the mask's own visual fade width at
  // the time. Both have since been undone: the mask fade is a small
  // fixed 10px now instead of reading this at all (a wide soft fade
  // turned out to make the leading edge HARDER to catch, not easier,
  // see .hero__scene::after in css/layout.css), and this value itself
  // was reverted back to its original 90, explicitly requested ("I
  // wanna go back to the way it was before we made those changes").
  // BAND_PX now only sets how far past the peak's position the sweep
  // has to travel before the peak marker counts as "reached" (see
  // peakFullyLitAt below): that timing logic was never part of what
  // the user was unhappy with, so it's unaffected by this revert.
  const BAND_PX = 90;
  let revealComplete = false;
  let isAnimating = false;

  // Re-pins the peak-glow dot (always) and, once the initial reveal has
  // finished, keeps the sweep's circle comfortably covering the whole
  // box too, so a resize or zoom after load can't leave either one
  // drifted or clipped.
  function repositionForCurrentLayout() {
    const peak = mapImagePointToBox(scene, HERO_PEAK_PX.x, HERO_PEAK_PX.y);
    if (peak) {
      scene.style.setProperty("--peak-x", `${peak.x}px`);
      scene.style.setProperty("--peak-y", `${peak.y}px`);
      // Size the halo in IMAGE pixels, not as a percentage of the box.
      //
      // The CSS fallback is width: 4.2% of .hero__scene, which is only
      // correct at one viewport width. The marker underneath is a fixed
      // size in the source image and scales with the background, so a
      // box-relative halo drifts out of proportion as the crop scale
      // changes: measured at 70 image-px across on a 1400px desktop but
      // only 35 on a 390px phone, i.e. half the relative size, which is
      // why the mobile pulse read as a different element rather than the
      // same one.
      //
      // PEAK_HALO_IMAGE_PX is that desktop value, so every breakpoint now
      // renders the halo at the same size relative to the marker it sits on.
      scene.style.setProperty("--peak-size", `${PEAK_HALO_IMAGE_PX * peak.scale}px`);
    }
    if (revealComplete && peak) {
      scene.style.setProperty("--sweep-r", `${Math.hypot(peak.boxW, peak.boxH)}px`);
    }
  }

  repositionForCurrentLayout();

  // ResizeObserver rather than a debounced window "resize" listener: a
  // debounce (even a short one) meant the peak dot sat at its pre-zoom
  // position for a beat while the browser was already smoothly rescaling
  // the background underneath it, which is exactly the "still moving"
  // gap between the image visibly changing and the dot catching up.
  // ResizeObserver fires as .hero__scene's own box actually changes size
  // (browsers coalesce it to roughly once per frame on their own), so it
  // tracks a zoom step tightly enough that there's no gap left for a
  // transition to paper over, see the CSS comment on .hero__scene::before
  // for why the left/top transition was removed once this was in place.
  if ("ResizeObserver" in window) {
    new ResizeObserver(repositionForCurrentLayout).observe(scene);
  } else {
    window.addEventListener("resize", repositionForCurrentLayout);
  }

  function easeOut(t) {
    return 1 - (1 - t) * (1 - t);
  }

  // A more emphatic "arrival" version of this (a few bigger pulses via a
  // temporary is-peak-arriving class before settling into the loop
  // .is-peak-lit alone runs) was tried and reverted: it read as too
  // abrupt. Back to just adding is-peak-lit, same as before.
  function markPeakLit() {
    scene.classList.add("is-peak-lit");
  }

  // Runs the full reveal from scratch: re-measures feet/peak every
  // time rather than once at setup, since this can now run again after
  // a resize that happened while the hero was scrolled out of view (see
  // the IntersectionObserver below).
  function playReveal() {
    const feet = mapImagePointToBox(scene, HERO_FEET_PX.x, HERO_FEET_PX.y);
    const peak = mapImagePointToBox(scene, HERO_PEAK_PX.x, HERO_PEAK_PX.y);
    if (!feet || !peak) {
      // Box wasn't laid out yet (shouldn't happen after DOMContentLoaded,
      // but fail open rather than leave the glow permanently hidden).
      scene.classList.add("is-glowing");
      revealComplete = true;
      return;
    }

    scene.style.setProperty("--sweep-origin-x", `${feet.x}px`);
    scene.style.setProperty("--sweep-origin-y", `${feet.y}px`);
    const distance = Math.hypot(peak.x - feet.x, peak.y - feet.y);
    // 20% margin past the peak so it's comfortably inside the fully-lit
    // zone when the sweep finishes, not sitting right at the fading edge.
    const targetRadius = distance * 1.2;

    if (prefersReducedMotion) {
      scene.style.setProperty("--sweep-r", `${targetRadius}px`);
      scene.classList.add("is-glowing", "is-peak-lit");
      revealComplete = true;
      return;
    }

    scene.classList.remove("is-peak-lit");
    scene.style.setProperty("--sweep-r", "0px");
    revealComplete = false;
    isAnimating = true;

    // The circle is fully solid (no longer fading) out to sweep-r minus
    // the band width, so the peak marker is completely lit once the
    // radius reaches this far past it. Triggering the pulse off this
    // measured value, rather than off a fixed delay guessed to line up
    // with a fixed 8s duration, is what keeps it in sync: targetRadius
    // (and so how much of the 8s is "real" travel vs. margin past the
    // peak) depends on the feet-to-peak distance, which is different at
    // every viewport: a fixed delay could only ever be correct for one
    // specific distance.
    const peakFullyLitAt = distance + BAND_PX;
    let peakLit = false;

    let start = null;
    function frame(timestamp) {
      if (start === null) start = timestamp;
      const t = Math.min((timestamp - start) / DURATION_MS, 1);
      const r = easeOut(t) * targetRadius;
      scene.style.setProperty("--sweep-r", `${r}px`);
      if (!peakLit && r >= peakFullyLitAt) {
        peakLit = true;
        markPeakLit();
      }
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        revealComplete = true;
        isAnimating = false;
        if (!peakLit) {
          // Guards against a target so tight the radius never quite
          // reaches peakFullyLitAt within the animation's duration.
          markPeakLit();
        }
      }
    }

    requestAnimationFrame(() => {
      scene.classList.add("is-glowing");
      requestAnimationFrame(frame);
    });
  }

  playReveal();

  // Replays the whole reveal whenever the hero scrolls back into view
  // after having left it at least once. The one-and-only playback on
  // page load is easy to miss entirely: a first-time visitor's eyes are
  // very likely on the headline text (left side, normal reading
  // position) during that initial ~8s window, not the mountain scene on
  // the right (confirmed informally: "she didn't really notice the
  // path"). Scrolling down and back up to the top is common enough,
  // first visit or return, that this gives most visitors another chance
  // to actually see it. hasLeftView guards against the observer's very
  // first callback (which fires immediately with whatever the current
  // state already is: true, since the hero is normally in view on
  // load) replaying it a second time right away.
  if (heroSection && "IntersectionObserver" in window && !prefersReducedMotion) {
    let hasLeftView = false;
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            hasLeftView = true;
            return;
          }
          if (hasLeftView && !isAnimating) {
            playReveal();
          }
        });
      },
      { threshold: 0.6 }
    );
    heroObserver.observe(heroSection);
  }
}

/* ---- Waypoint button ring (outline CTAs) --------------------------------- */

/*
  The hollow "outline" waypoint buttons (.btn--secondary / .btn--on-dark)
  draw their ring with an inline <svg><path> stroke instead of a CSS
  clip-path. Three rounds of hand-computed clip-path polygons (an
  evenodd hole on the text-bearing element, then a two-element inset
  version, then a self-contained evenodd ::after) each fixed one problem
  and introduced or left another: most persistently, a visible break at
  the chamfered top-left corner. A native SVG stroke doesn't have that
  failure mode at all: the browser's own line-join logic (miter by
  default) handles the corner correctly, so there's no inset math to get
  slightly wrong.

  The <svg> is a SIBLING of the button (both inside a plain .btn__wrap),
  not a child of it: a first version nested it inside the button and
  the button's own clip-path clipped the ring right along with
  everything else it's an ancestor of, against a boundary that didn't
  quite match the ring's own stroke, reintroducing a corner mismatch by
  a different route. As a sibling, nothing with a clip-path is ever an
  ancestor of the ring, so it can't be clipped by anything.

  This measures the button's actual rendered box (matching the
  ResizeObserver-driven approach already used for the hero glow, for the
  same reason: a fixed viewBox would drift out of sync with the real box
  on resize/zoom) and draws the path's coordinates directly in real
  pixels, inset by half the stroke width so the 2px line renders fully
  inside the SVG's own bounds instead of getting cropped at the edge.
*/
function setupWaypointRings() {
  const wraps = document.querySelectorAll(".btn__wrap");
  if (!wraps.length) return;

  const CHAMFER = 8; // matches --wp-chamfer in css/components.css
  const POINT = 16; // matches --wp-point in css/components.css
  const STROKE = 3; // matches stroke-width in .btn__ring path (css/components.css)
  const INSET = STROKE / 2;

  wraps.forEach((wrap) => {
    const btn = wrap.querySelector(".btn--waypoint");
    const svg = wrap.querySelector(".btn__ring");
    const path = svg && svg.querySelector("path");
    if (!btn || !svg || !path) return;

    function draw() {
      // Measuring wrap, not btn: the svg is sized (width/height: 100%)
      // to wrap's box, since that's its positioned ancestor. wrap and
      // btn are expected to be the same size (wrap is an inline-flex
      // with btn as its only in-flow child), but drawing the viewBox
      // and path against whichever box the svg is actually rendered at
      // guarantees a 1:1 pixel mapping regardless, measuring btn
      // instead left the ring visibly larger than the button whenever
      // the two boxes weren't pixel-identical (confirmed in testing).
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;

      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      path.setAttribute(
        "d",
        [
          `M ${CHAMFER + INSET} ${INSET}`,
          `L ${w - POINT - INSET} ${INSET}`,
          `L ${w - INSET} ${h / 2}`,
          `L ${w - POINT - INSET} ${h - INSET}`,
          `L ${CHAMFER + INSET} ${h - INSET}`,
          `L ${INSET} ${h - CHAMFER - INSET}`,
          `L ${INSET} ${CHAMFER + INSET}`,
          "Z",
        ].join(" ")
      );
    }

    draw();
    if ("ResizeObserver" in window) {
      new ResizeObserver(draw).observe(wrap);
    } else {
      window.addEventListener("resize", draw);
    }
  });
}
