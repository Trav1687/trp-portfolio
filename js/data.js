/*
  Source data for Selected Peaks projects and Tools & Skills groups.
  Keeping this separate from the render/interaction logic in main.js
  makes it easy to update project copy and links without touching markup.

  TODO (before production): the `image` paths below still point at the raw
  PNG screenshots from the handoff package. Compress/convert these to WebP
  (see TODO.md at the project root) once final case study pages exist.
*/

/*
  Copy pass (same treatment already applied to `capabilities` below, per
  direct request to bring this section up to match):

  - Descriptions lead with what the project IS and what it accomplished,
    rather than opening with the category ("A web app project focused
    on..."), and each names the concrete technologies/disciplines a
    person would actually search — Angular, API integration, Python
    automation, MVP scope, YouTube SEO — so the section earns its
    keywords through real sentences rather than a stuffed tag list.
  - Proof points are now consistently phrased noun phrases and made more
    specific, instead of mixing formats ("Responsive design" alongside
    "API/database thinking" alongside "Real group problem").
  - Lengths deliberately held within a narrow band across all five, so
    the stacked cards don't read as ragged.
  - Nothing invented: no metrics, results, testimonials, or claims that
    aren't already true of these projects (a standing project rule).
    Table Tracker in particular is still described as a concept, because
    that's what it is.
*/
const projects = [
  {
    number: "01",
    title: "Mountainside Millwork",
    featured: true,
    tags: ["Client Website", "Angular", "Responsive Design", "Local Business"],
    description:
      "A real client website for a custom millwork business, built in Angular to give the company a clear online presence and make requesting a quote simple.",
    proofPoints: [
      "Real client project",
      "Angular build",
      "Responsive across devices",
      "Clear path to contact",
      "Launch and SEO setup"
    ],
    image: "assets/images/mountainside-millwork/mountainside-millwork-main-card.webp",
    imageAlt: "Mountainside Millwork website homepage shown on desktop",
    // Real file dimensions (checked directly, not guessed) — used as
    // the <img> width/height attributes in main.js so the browser's
    // built-in layout-reservation sizing matches the actual screenshot
    // instead of a placeholder ratio that doesn't match any of these
    // five images (they range from nearly-square to 1.64:1 wide).
    // Replaced 2026-07-24 with a fresh, wider hero-section capture,
    // resized proportionally (no crop/stretch) to 1400px wide and
    // converted to WebP.
    imageWidth: 1400,
    imageHeight: 837,
    ctaLabel: "View Project Notes",
  },
  {
    number: "02",
    title: "Arcane Vault",
    tags: ["Web App", "Angular + API", "Admin System", "Database-Driven"],
    description:
      "A database-driven web app covering real application structure: API integration, admin workflows, and an interface that stays organized as it grows.",
    proofPoints: [
      "Front-end app architecture",
      "API and database integration",
      "Admin workflow design",
      "Debugging and production fixes",
      "Organized interface structure"
    ],
    image: "assets/images/arcane-vault/arcane-vault-main-card.png",
    imageAlt: "Arcane Vault web app dashboard interface",
    imageWidth: 916,
    imageHeight: 893,
    ctaLabel: "View Project Notes",
  },
  {
    number: "03",
    title: "ValorBot",
    tags: ["Python Automation", "Data Logging", "Testing Workflow", "Risk Controls"],
    description:
      "A Python automation project built around structured configuration, detailed logging, repeatable testing, and careful risk planning before anything runs.",
    proofPoints: [
      "Python automation",
      "Structured logging and validation",
      "Config-driven design",
      "Repeatable testing workflow",
      "Risk-aware planning"
    ],
    image: "assets/images/valorbot/valorbot-main-card.png",
    imageAlt: "ValorBot system architecture and logging dashboard",
    imageWidth: 1608,
    imageHeight: 978,
    ctaLabel: "View Project Notes",
  },
  {
    number: "04",
    title: "Table Tracker",
    tags: ["Product Design", "UX Planning", "MVP Strategy", "Community App"],
    description:
      "A product concept tackling a real group problem: tracking game nights, attendance, and results, scoped from user flows down to a focused MVP.",
    proofPoints: [
      "Real problem, real users",
      "Defined MVP scope",
      "Mapped user flows",
      "Prioritized feature set",
      "UX and product thinking"
    ],
    image: "assets/images/table-tracker/table-tracker-main-card.png",
    imageAlt: "Table Tracker mobile dashboard and standings screens",
    // 398x359 is the CURRENT file's real size — quite low-res for a
    // full-width card image, and due for a higher-resolution
    // replacement (Travis is getting a new screenshot). Update these
    // two numbers to match whenever that file is swapped in.
    imageWidth: 398,
    imageHeight: 359,
    ctaLabel: "View Project Notes",
  },
  {
    number: "05",
    title: "Ancient Sleep Lore",
    tags: ["Brand Identity", "Content Strategy", "YouTube SEO", "Visual Design"],
    description:
      "A digital brand built end to end: visual identity, thumbnails, content strategy, and YouTube SEO, run on a repeatable production workflow.",
    proofPoints: [
      "Audience-first brand system",
      "Thumbnail and visual identity",
      "SEO and content planning",
      "Repeatable production workflow",
      "AI-assisted creative process"
    ],
    image: "assets/images/ancient-sleep-lore/ancient-sleep-lore-main-card.png",
    imageAlt: "Ancient Sleep Lore brand and channel visual system",
    imageWidth: 1515,
    imageHeight: 989,
    ctaLabel: "View Project Notes",
  }
];

/*
  Each skill now names the projects that actually used it, rather than
  being a bare string in a list. Two reasons:

  1. A standalone list of skills is an unverifiable claim — a visitor has
     no way to judge it. Tied to specific projects, each entry carries its
     own evidence, and the section stops being a list and starts being
     proof. This is what drives the project-filter interaction in
     setupSkillsCrossHighlight() (js/main.js) and the per-skill counts.
  2. It keeps the section honest by construction: a skill with no
     projects behind it is visibly a skill with nothing behind it.

  `projects` values must match a project `title` in the array above
  EXACTLY — that string is the join key the filter matches on. A typo
  doesn't throw, it just silently stops matching, so renderSkillGroups()
  validates these against the real project list at render time and warns
  in the console rather than failing quietly.

  >> TRAVIS: this first-pass mapping was derived only from what each
  >> project already states in its own tags, description, and proof
  >> points above — nothing was assumed beyond that, and anything
  >> uncertain was left off rather than guessed at. You know what each
  >> project actually involved; please review and correct. Adding or
  >> removing a name here is all that's needed, nothing else to update.
*/
const skillGroups = [
  {
    title: "Design",
    items: [
      { name: "Figma", projects: ["Table Tracker", "Ancient Sleep Lore"] },
      { name: "FigJam", projects: ["Table Tracker"] },
      { name: "Wireframes", projects: ["Mountainside Millwork", "Table Tracker"] },
      { name: "UI Design", projects: ["Mountainside Millwork", "Arcane Vault", "Table Tracker"] },
      { name: "Responsive Layouts", projects: ["Mountainside Millwork", "Arcane Vault"] },
      { name: "Design Systems", projects: ["Ancient Sleep Lore"] },
      { name: "Prototyping", projects: ["Table Tracker"] }
    ]
  },
  {
    title: "Front-End",
    items: [
      { name: "HTML", projects: ["Mountainside Millwork", "Arcane Vault"] },
      { name: "CSS", projects: ["Mountainside Millwork", "Arcane Vault"] },
      { name: "JavaScript", projects: ["Mountainside Millwork", "Arcane Vault"] },
      { name: "Angular", projects: ["Mountainside Millwork", "Arcane Vault"] },
      { name: "Responsive Development", projects: ["Mountainside Millwork", "Arcane Vault"] },
      { name: "Components", projects: ["Mountainside Millwork", "Arcane Vault"] },
      { name: "Accessibility Basics", projects: ["Mountainside Millwork"] }
    ]
  },
  {
    title: "Back-End / Data",
    items: [
      { name: "APIs", projects: ["Arcane Vault"] },
      { name: "SQLite", projects: ["Arcane Vault"] },
      { name: "Data Structure", projects: ["Arcane Vault", "ValorBot"] },
      { name: "Admin Workflows", projects: ["Arcane Vault"] },
      { name: "Database-Driven Thinking", projects: ["Arcane Vault"] }
    ]
  },
  {
    title: "Workflow",
    items: [
      { name: "Git", projects: ["Mountainside Millwork", "Arcane Vault", "ValorBot"] },
      { name: "GitHub", projects: ["Mountainside Millwork", "Arcane Vault", "ValorBot"] },
      { name: "VS Code", projects: ["Mountainside Millwork", "Arcane Vault", "ValorBot"] },
      {
        name: "Project Planning",
        projects: [
          "Mountainside Millwork",
          "Arcane Vault",
          "ValorBot",
          "Table Tracker",
          "Ancient Sleep Lore"
        ]
      },
      { name: "Testing", projects: ["Mountainside Millwork", "ValorBot"] },
      { name: "Debugging", projects: ["Arcane Vault", "ValorBot"] },
      { name: "Documentation", projects: ["Arcane Vault", "ValorBot"] }
    ]
  },
  {
    title: "Content / Marketing",
    items: [
      { name: "SEO Basics", projects: ["Mountainside Millwork", "Ancient Sleep Lore"] },
      { name: "Content Planning", projects: ["Ancient Sleep Lore"] },
      { name: "Brand Systems", projects: ["Ancient Sleep Lore"] },
      { name: "YouTube SEO", projects: ["Ancient Sleep Lore"] },
      { name: "Thumbnail Strategy", projects: ["Ancient Sleep Lore"] },
      { name: "AI-Assisted Workflows", projects: ["Ancient Sleep Lore"] }
    ]
  }
];

/*
  Copy pass (same treatment already applied to `projects` above and
  `capabilities` below, per direct request):

  - Each step now says what actually HAPPENS and what the client gets out
    of it, rather than listing deliverables ("Create wireframes,
    interface direction, visual systems..."). This section's real job is
    answering "what is working with him like?", so the reassurance is the
    point: decisions get made before they're expensive, nothing goes live
    untested, launch isn't the end.
  - Several steps now explicitly hand off to the next one ("Turn that
    into...", "The approved design becomes..."), so the six read as one
    continuous process rather than six unrelated bullet points.
  - Keeps the searchable terms in natural sentences: user flows, site
    structure, wireframes, responsive layouts, accessible front-end code,
    SEO basics, performance.
  - Lengths held in a narrow band. These now render as full-width rows in
    an editorial ruled list (see .process-step in components.css), which
    affords more room than the old cramped six-column timeline did, so
    they run a little longer than they used to.
*/
const processSteps = [
  {
    step: "01",
    title: "Understand",
    description: "Get clear on the real problem, who it's for, and what success actually looks like, before any design or code starts."
  },
  {
    step: "02",
    title: "Plan",
    description: "Turn that into a working plan: site structure, user flows, content needs, and a scope that's realistic to build."
  },
  {
    step: "03",
    title: "Design",
    description: "Wireframes, visual direction, and responsive layouts, settled before any code is written, while changes are still easy."
  },
  {
    step: "04",
    title: "Build",
    description: "The approved design becomes clean, accessible front-end code: reusable components, real pages, and interactions that work."
  },
  {
    step: "05",
    title: "Launch",
    description: "Cross-device testing, SEO basics, forms and links checked, performance tuned, then the site goes live properly."
  },
  {
    step: "06",
    title: "Watch & Improve",
    description: "Launch isn't the finish line. Review what's working, fix what isn't, and keep improving as real people use it."
  }
];

/*
  Each capability's `icon` is a small inline SVG string (viewBox 0 0 24 24,
  stroke-based, no fill) rendered directly into the bento panel markup in
  js/main.js's renderCapabilities() — plain geometric line icons (compass,
  layered stack, code brackets, trending line), not a copied icon-library
  asset, so there's no external font/sprite file to load. currentColor is
  used for the stroke so .capability-panel__icon's own CSS color (Trail
  Orange) is what actually colors each one, not a hardcoded value here.
*/
/*
  Copy pass (per direct request: stronger copy, cohesive across the
  section, SEO-aware, positive/on-brand):

  - Titles keep their existing three-word, verb-first parallel structure
    and the site's route/wayfinding language (path, build, presence) —
    that pattern was already working and ties this section to the hero's
    own climb/route metaphor.
  - Descriptions now lead with what the client GETS rather than a list
    of tasks performed, and each one carries the plain service terms a
    person would actually search (scope and planning; wireframes, UI
    design, responsive layouts; responsive websites, web apps,
    accessible front-end code; SEO, content structure) so the section
    earns its keywords through real sentences instead of a stuffed list.
  - Lengths deliberately kept within a narrow band of each other: these
    render as four side-by-side panels, so wildly uneven copy lengths
    would show up as ragged, uneven-looking cards.
*/
const capabilities = [
  {
    title: "Plan the Path",
    description: "Goals, audience, and scope get settled first, so the build starts with a clear direction instead of guesswork.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><polygon points="15.5 8.5 13.2 13.2 8.5 15.5 10.8 10.8 15.5 8.5"></polygon></svg>'
  },
  {
    title: "Design the Experience",
    description: "Wireframes, UI design, and responsive layouts that make a site clear to navigate and easy to trust.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2.5 2.5 7.5 12 12.5 21.5 7.5 12 2.5"></polygon><polyline points="2.5 16.5 12 21.5 21.5 16.5"></polyline><polyline points="2.5 12 12 17 21.5 12"></polyline></svg>'
  },
  {
    title: "Build the System",
    description: "Responsive websites and web apps built in clean, accessible front-end code that stays easy to maintain.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="16.5 7 22 12 16.5 17"></polyline><polyline points="7.5 7 2 12 7.5 17"></polyline><line x1="13.5" y1="4" x2="10.5" y2="20"></line></svg>'
  },
  {
    title: "Improve the Presence",
    description: "Launch support, SEO fundamentals, and steady improvements that keep a site earning its keep over time.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="22.5 6.5 13.5 15.5 8.5 10.5 1.5 17.5"></polyline><polyline points="16 6.5 22.5 6.5 22.5 13"></polyline></svg>'
  }
];
