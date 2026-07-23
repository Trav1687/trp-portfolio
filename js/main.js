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
  safeRun(setupHeroRouteDraw);
  safeRun(setupWaypointRings);
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

  list.innerHTML = projects.map((project) => renderProjectCard(project)).join("");
}

/*
  One project can be marked `featured: true` in js/data.js (currently
  Mountainside Millwork, the one real client project) to get the full-width
  "strongest proof piece" treatment — see .project-card--featured in
  css/components.css. Everything else about the markup is identical between
  featured and standard cards; the only differences are the modifier class,
  a badge sourced from the project's own first tag (no invented copy), and
  larger image dimensions as a more accurate layout hint for the bigger
  featured media area.
*/
function renderProjectCard(project) {
  const isFeatured = project.featured === true;
  const cardClass = isFeatured ? "project-card project-card--featured reveal" : "project-card reveal";
  const imageWidth = isFeatured ? 1280 : 640;
  const imageHeight = isFeatured ? 720 : 420;
  const badge = isFeatured
    ? `<span class="project-card__badge">${project.tags[0]}</span>`
    : "";

  return `
      <article class="${cardClass}">
        <div class="project-card__media">
          ${badge}
          <img
            src="${project.image}"
            alt="${project.imageAlt}"
            loading="lazy"
            width="${imageWidth}"
            height="${imageHeight}"
          />
        </div>
        <div class="project-card__body">
          <span class="project-card__number">${project.number}</span>
          <h3>${project.title}</h3>
          <div class="project-card__tags">
            ${project.tags.map((tag) => `<span class="project-card__tag">${tag}</span>`).join("")}
          </div>
          <p>${project.description}</p>
          <ul class="project-card__proof-chips">
            ${project.proofPoints.map((point) => `<li>${point}</li>`).join("")}
          </ul>
          <!--
            No live case study pages yet (see js/data.js). A quiet status
            line rather than a disabled button/placeholder-note pair, so
            five identical greyed-out buttons in a row don't make the
            section read as unfinished.
          -->
          <div class="project-card__status">
            <span class="project-card__status-dot" aria-hidden="true"></span>
            Project notes in progress
          </div>
        </div>
      </article>`;
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

/* ---- Hero route glow ------------------------------------------------------------------ */

/*
  Drives .hero__scene::after (route reveal) and ::before (peak pulse) —
  see css/layout.css.

  Both are positioned by mapping fixed PIXEL COORDINATES from the actual
  source image (trp-hero-scene-wide.webp / trp-hero-route-mask.png, both
  1672x941 — see HERO_IMAGE_SIZE) onto wherever that image currently lands
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
  mirror of the media queries on .hero__scene in css/layout.css — if
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
// sits lower and further left — an earlier version of this constant
// measured the halo by mistake, which is why the CSS pulse used to drift
// toward the rock face instead of sitting on the marker).
const HERO_FEET_PX = { x: 848, y: 864 };
const HERO_PEAK_PX = { x: 1364, y: 57 };

/*
  Mirrors the .hero__scene background-size/background-position rules in
  css/layout.css, keyed off the same viewport-width breakpoints those
  media queries use (639px / 1600px / 1900px). Kept as an explicit mirror
  rather than reading getComputedStyle().backgroundSize/backgroundPosition
  back out of the browser — those can come back in different forms
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
    return { size: "cover", posX: 1, posY: 1 }; // right bottom
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
    // background-size: auto 100% — height fills the box, width scales
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
    boxW,
    boxH,
  };
}

function setupHeroRouteDraw() {
  const scene = document.querySelector(".hero__scene");
  if (!scene) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DURATION_MS = 8000;
  const BAND_PX = 90; // softness of the growing edge
  let revealComplete = false;

  // Re-pins the peak-glow dot (always) and, once the initial reveal has
  // finished, keeps the sweep's circle comfortably covering the whole
  // box too — so a resize or zoom after load can't leave either one
  // drifted or clipped.
  function repositionForCurrentLayout() {
    const peak = mapImagePointToBox(scene, HERO_PEAK_PX.x, HERO_PEAK_PX.y);
    if (peak) {
      scene.style.setProperty("--peak-x", `${peak.x}px`);
      scene.style.setProperty("--peak-y", `${peak.y}px`);
    }
    if (revealComplete && peak) {
      scene.style.setProperty("--sweep-r", `${Math.hypot(peak.boxW, peak.boxH)}px`);
    }
  }

  repositionForCurrentLayout();
  scene.style.setProperty("--sweep-band", `${BAND_PX}px`);

  // ResizeObserver rather than a debounced window "resize" listener: a
  // debounce (even a short one) meant the peak dot sat at its pre-zoom
  // position for a beat while the browser was already smoothly rescaling
  // the background underneath it, which is exactly the "still moving"
  // gap between the image visibly changing and the dot catching up.
  // ResizeObserver fires as .hero__scene's own box actually changes size
  // (browsers coalesce it to roughly once per frame on their own), so it
  // tracks a zoom step tightly enough that there's no gap left for a
  // transition to paper over — see the CSS comment on .hero__scene::before
  // for why the left/top transition was removed once this was in place.
  if ("ResizeObserver" in window) {
    new ResizeObserver(repositionForCurrentLayout).observe(scene);
  } else {
    window.addEventListener("resize", repositionForCurrentLayout);
  }

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

  function easeOut(t) {
    return 1 - (1 - t) * (1 - t);
  }

  // The circle is fully solid (no longer fading) out to sweep-r minus the
  // band width — so the peak marker is completely lit once the radius
  // reaches this far past it. Triggering the pulse off this measured
  // value, rather than off a fixed delay guessed to line up with a fixed
  // 8s duration, is what keeps it in sync: targetRadius (and so how much
  // of the 8s is "real" travel vs. margin past the peak) depends on the
  // feet-to-peak distance, which is different at every viewport — a
  // fixed delay could only ever be correct for one specific distance.
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
      scene.classList.add("is-peak-lit");
    }
    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      revealComplete = true;
      if (!peakLit) {
        // Guards against a target so tight the radius never quite
        // reaches peakFullyLitAt within the animation's duration.
        scene.classList.add("is-peak-lit");
      }
    }
  }

  requestAnimationFrame(() => {
    scene.classList.add("is-glowing");
    requestAnimationFrame(frame);
  });
}

/* ---- Waypoint button ring (outline CTAs) --------------------------------- */

/*
  The hollow "outline" waypoint buttons (.btn--secondary / .btn--on-dark)
  draw their ring with an inline <svg><path> stroke instead of a CSS
  clip-path. Three rounds of hand-computed clip-path polygons (an
  evenodd hole on the text-bearing element, then a two-element inset
  version, then a self-contained evenodd ::after) each fixed one problem
  and introduced or left another — most persistently, a visible break at
  the chamfered top-left corner. A native SVG stroke doesn't have that
  failure mode at all: the browser's own line-join logic (miter by
  default) handles the corner correctly, so there's no inset math to get
  slightly wrong.

  The <svg> is a SIBLING of the button (both inside a plain .btn__wrap),
  not a child of it — a first version nested it inside the button and
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
      // guarantees a 1:1 pixel mapping regardless — measuring btn
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
