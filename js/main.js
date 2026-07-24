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
  safeRun(setupNavProgress);
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
  // .peaks__track with the rest — grouped with the "Selected Peaks"
  // header so the two can share one scroll-snap stop (see the comment
  // on this section in index.html). Everything from index 1 onward
  // still renders as a plain stack into .peaks__track.
  //
  // isAlt is passed by each project's ABSOLUTE position in the full
  // projects array, not by DOM sibling order — with the first project
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
  "strongest proof piece" treatment — see .project-card--featured in
  css/components.css. Everything else about the markup is identical between
  featured and standard cards; the only differences are the modifier class,
  a badge sourced from the project's own first tag (no invented copy), and
  larger image dimensions as a more accurate layout hint for the bigger
  featured media area.
*/
function renderProjectCard(project, index) {
  const isFeatured = project.featured === true;
  const isAlt = index % 2 === 1;
  // .reveal restored — cards went through a phase where they lived
  // inside a pinned/horizontal-scroll track (removed, see the comment
  // on this section in index.html) whose own scroll-scrub replaced this
  // as each card's motion. Back in normal vertical flow, the same
  // generic reveal-on-scroll every other section uses (setupScrollReveal()
  // in this file) is what fades/settles each card in — no separate
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
  // against each file, not guessed) — these five screenshots range
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
  // "Project notes in progress" status line — both dropped per direct
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
            ${project.proofPoints.map((point) => `<li>${point}</li>`).join("")}
          </ul>
          <!-- Real case study/project-notes pages don't exist yet (see
               TODO.md) — this is a genuine placeholder, disabled rather
               than a dead link to "#", matching the same honest pattern
               already used for the About section's Resume button.
               Reuses the hero/nav's primary waypoint button exactly
               (same classes, same ring mechanism) at a smaller size —
               see .project-card__cta.btn--waypoint.btn--primary in
               css/components.css — rather than the plain text link this
               used a moment ago, per direct request. setupWaypointRings()
               in this file already queries every .btn__wrap generically,
               so this gets the same real-pixel-measured ring as the
               hero/nav buttons for free. -->
          <span class="btn__wrap btn__wrap--primary project-card__cta-wrap">
            <button
              type="button"
              class="btn btn--primary btn--waypoint btn--disabled project-card__cta"
              disabled
              title="Project notes page coming soon"
            >
              ${project.ctaLabel}
            </button>
            <svg class="btn__ring" aria-hidden="true" focusable="false" preserveAspectRatio="none"><path></path></svg>
          </span>
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

  // Only the plain section links (Work, What I Do, Process, Skills,
  // About) count as steps along the nav-progress route (see
  // setupNavProgress() and .nav-progress in css/layout.css) — Contact
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
            // fifths — an equal 1/5, 2/5, ... split ignores that the
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
          } else {
            // The intersecting section isn't one of the 5 tracked
            // stops — the hero (id="top") is also inside <main
            // section[id]> and gets observed, but no nav link points
            // to #top, so this branch previously just never ran and
            // the fill was left showing whatever it was at last (Work,
            // stuck lit even back at the very top of the page —
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
  of "About", in real pixels measured at runtime — the nav's gap is a
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
  const lastLink = document.querySelector('.main-nav__link[href="#about"]');
  if (!nav || !track || !firstLink || !lastLink) return;

  function position() {
    const navRect = nav.getBoundingClientRect();
    const firstRect = firstLink.getBoundingClientRect();
    const lastRect = lastLink.getBoundingClientRect();
    if (!firstRect.width || !lastRect.width) return;

    track.style.left = `${firstRect.left - navRect.left}px`;
    track.style.width = `${lastRect.right - firstRect.left}px`;
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
  const heroSection = document.querySelector(".hero");
  if (!scene) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DURATION_MS = 8000;
  // Was widened (90 → 140 → 175) across two "make it more noticeable"
  // rounds, which also controlled the mask's own visual fade width at
  // the time. Both have since been undone: the mask fade is a small
  // fixed 10px now instead of reading this at all (a wide soft fade
  // turned out to make the leading edge HARDER to catch, not easier —
  // see .hero__scene::after in css/layout.css), and this value itself
  // was reverted back to its original 90, explicitly requested ("I
  // wanna go back to the way it was before we made those changes").
  // BAND_PX now only sets how far past the peak's position the sweep
  // has to travel before the peak marker counts as "reached" (see
  // peakFullyLitAt below) — that timing logic was never part of what
  // the user was unhappy with, so it's unaffected by this revert.
  const BAND_PX = 90;
  let revealComplete = false;
  let isAnimating = false;

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

  function easeOut(t) {
    return 1 - (1 - t) * (1 - t);
  }

  // A more emphatic "arrival" version of this (a few bigger pulses via a
  // temporary is-peak-arriving class before settling into the loop
  // .is-peak-lit alone runs) was tried and reverted — it read as too
  // abrupt. Back to just adding is-peak-lit, same as before.
  function markPeakLit() {
    scene.classList.add("is-peak-lit");
  }

  // Runs the full reveal from scratch — re-measures feet/peak every
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
    // the band width — so the peak marker is completely lit once the
    // radius reaches this far past it. Triggering the pulse off this
    // measured value, rather than off a fixed delay guessed to line up
    // with a fixed 8s duration, is what keeps it in sync: targetRadius
    // (and so how much of the 8s is "real" travel vs. margin past the
    // peak) depends on the feet-to-peak distance, which is different at
    // every viewport — a fixed delay could only ever be correct for one
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
  // page load is easy to miss entirely — a first-time visitor's eyes are
  // very likely on the headline text (left side, normal reading
  // position) during that initial ~8s window, not the mountain scene on
  // the right (confirmed informally: "she didn't really notice the
  // path"). Scrolling down and back up to the top is common enough,
  // first visit or return, that this gives most visitors another chance
  // to actually see it. hasLeftView guards against the observer's very
  // first callback (which fires immediately with whatever the current
  // state already is — true, since the hero is normally in view on
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
