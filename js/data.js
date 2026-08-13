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
    person would actually search (Angular, API integration, Python automation, MVP scope, YouTube SEO) so the section earns its
    keywords through real sentences rather than a stuffed tag list.
  - Proof points are now consistently phrased and made more specific,
    instead of mixing formats ("Responsive design" alongside "API/database
    thinking" alongside "Real group problem").

  - Cut from five points to three, and rewritten to stop restating `tags`.
    The two lists render about ten pixels apart, `tags` as the meta line
    under the title, `proofPoints` as the chips below the description, so
    any fact appearing in both is simply printed twice. Mountainside was
    the clearest case (tags: Client Website / Angular / Responsive Design,
    chips: "Real client project" / "Angular build" / "Responsive across
    devices"), but ValorBot was worse: four of its five chips echoed a tag
    outright. Chips now carry only what a tag can't: a decision made or a
    thing actually done. `tags` name the category and carry the searchable
    keywords; `proofPoints` say what the work involved. Anything expressible
    as a tag belongs in tags.

    Still nothing invented (standing project rule): every remaining chip
    restates something the project's own `description` or prior chip set
    already asserted, just phrased as the action rather than the label.
  - Lengths deliberately held within a narrow band across all five, so
    the stacked cards don't read as ragged.
  - Nothing invented: no metrics, results, testimonials, or claims that
    aren't already true of these projects (a standing project rule).

  - Table Tracker was rewritten on 2026-08-12 and the correction is worth
    recording, because it ran the opposite way to the usual portfolio
    failure. This card called it "a product concept... scoped from user
    flows down to a focused MVP" and its CTA was a disabled placeholder.
    Reading the actual repository showed a React 18 + Ionic + TypeScript
    app on a Supabase/Postgres backend, 162 commits, ten sequential
    migrations, Playwright end-to-end tests, row-level security, and a
    live deployment auto-published from `main`. Its own README described
    it as "Phase 5, live real-user beta", and Travis confirmed it has been
    in real use for over a month.

    So the honest-by-default instinct that keeps the rest of this file
    conservative had, in this one case, produced a claim that was false in
    the direction of underselling. Worth remembering that the no-invention
    rule cuts both ways: a description has to keep up with the work.
*/
const projects = [
  {
    number: "01",
    title: "Mountainside Millwork",
    featured: true,
    tags: ["Client Website", "Angular", "Responsive Design", "Local Business"],
    description:
      "Logo and website for a custom millwork business, built in Angular to give the company a clear online presence and make requesting a quote simple.",
    proofPoints: [
      "Shipped for a real client",
      "Quote request flow",
      "SEO setup at launch"
    ],
    image: "assets/images/mountainside-millwork/mountainside-millwork-main-card.webp",
    imageAlt: "Mountainside Millwork website homepage shown on desktop",
    // Real file dimensions (checked directly, not guessed), used as
    // the <img> width/height attributes in main.js so the browser's
    // built-in layout-reservation sizing matches the actual screenshot
    // instead of a placeholder ratio that doesn't match any of these
    // five images (they range from nearly-square to 1.64:1 wide).
    // Replaced 2026-07-24 with a fresh, wider hero-section capture,
    // resized proportionally (no crop/stretch) to 1400px wide and
    // converted to WebP.
    imageWidth: 1400,
    imageHeight: 840,
    // The one project with somewhere real to send people. Verified live
    // 2026-08-11, and the site's own footer carries a "Site by TRP Studio"
    // credit, so the attribution is public rather than a claim made only
    // here. Any project with a `liveUrl` renders its CTA as a real
    // external <a>; the rest keep the disabled-button placeholder (see
    // renderProjectCard in js/main.js).
    liveUrl: "https://mountainsidemillwork.ca",
    ctaLabel: "Visit the Live Site",
  },
  {
    number: "02",
    title: "Arcane Vault",
    tags: ["E-Commerce", "Angular", "Node + Express", "MySQL"],
    description:
      "A full-stack e-commerce portal for collectibles and pop-culture products: a storefront with filtering and sorting, and an admin dashboard for managing the catalogue.",
    proofPoints: [
      "Storefront and admin, front to back",
      "Full product CRUD with live/offline toggle",
      "REST API over a MySQL database"
    ],
    image: "assets/images/arcane-vault/arcane-vault-main-card.webp",
    imageAlt:
      "Arcane Vault storefront: navigation, a featured product hero, and a Today's Deals row of four products with prices",
    // Replaced 2026-08-12. The alt text used to say "dashboard interface",
    // which was simply wrong: this is and always was the storefront. Alt
    // text is what a screen reader announces and what search engines index,
    // so a wrong one is worse than a terse one.
    //
    // Reframed rather than cropped. The source capture is 916x893, nearly
    // square, and cropping it to 5:3 would have meant discarding 343px of
    // height and then upscaling the remainder 1.5x, which is exactly the
    // softness that made the old Table Tracker image look broken. Scaling
    // to fill the height instead is a DOWNSCALE (893 -> 772), so it stays
    // sharp, and the screenshot sits on a dark field taking about 57% of
    // the card width.
    //
    // Sharp with margins beats soft and full-bleed. If the app is ever
    // running again, a capture at ~1600px wide would fill the frame
    // properly and this can be redone.
    imageWidth: 1400,
    imageHeight: 840,
    // Fourth real destination. A repository rather than a running site:
    // this one needs a MySQL database and a local Express server, so
    // there is nothing to deploy to a URL a visitor could just click.
    //
    // Scanned before publishing (2026-08-12): no .env in any of the 42
    // commits, no hardcoded credentials, .gitignore correct from the
    // start. The demo admin login in its README is deliberately public
    // and documented there as class-project auth, not production.
    liveUrl: "https://github.com/travispeakman/Arcane_Vault_App",
    ctaLabel: "View the Code",
  },
  {
    number: "03",
    title: "ValorBot",
    tags: ["Python Automation", "Data Logging", "Testing Workflow", "Risk Controls"],
    description:
      "A Python automation project built around structured configuration, detailed logging, repeatable testing, and careful risk planning before anything runs.",
    proofPoints: [
      "400 tests across 26 modules",
      "Failure injected, not just happy paths",
      "Config-driven, nothing hardcoded"
    ],
    image: "assets/images/valorbot/valorbot-main-card.webp",
    imageAlt:
      "Terminal output from ValorBot's validation suite: 320 tests passing, then 80 interruption and recovery tests passing, then fee resolver checks",
    // Replaced 2026-08-12. The old file was a 1,475 KB PNG, the heaviest
    // asset on the site by a factor of twenty.
    //
    // This is the real output of `.\scripts\validate.ps1`, the same script
    // CI runs, typeset rather than screenshotted. Every line is verbatim:
    // the run counts, the timings, the injected OSError, the Win32 handle
    // test's own docstring. Nothing was written for the image.
    //
    // Typeset rather than captured for legibility. A real terminal window
    // at a readable font size does not fit 400 tests worth of output into
    // 5:3, and shrinking a capture until it does makes it unreadable at
    // card size. The two emoji the logger prints were dropped because the
    // mono font has no glyphs for them; colour carries the same signal.
    //
    // An AI-generated "terminal" was considered and rejected: it claimed
    // Binance Futures (the config says Kraken), a version string that does
    // not exist, a config path that does not exist, and a session dated
    // three weeks before the repo's first commit. The card links to the
    // repo, so anyone checking would have found all four.
    imageWidth: 1400,
    imageHeight: 840,
    // Third real destination. This one is a repository rather than a
    // running site, which is the right proof for this project: ValorBot
    // has no user interface to show, and for a development role the code
    // and its test suite are stronger evidence than a screenshot of
    // terminal output would be. `liveUrl` just means "somewhere real to
    // send people"; renderProjectCta (js/main.js) doesn't care whether
    // that's an app or a repo.
    //
    // Published 2026-08-12, after purging a committed .env from all 186
    // commits of history and adding a README.
    liveUrl: "https://github.com/travispeakman/ValorBot",
    ctaLabel: "View the Code",
  },
  {
    number: "04",
    title: "Table Tracker",
    tags: ["Web App", "React + Ionic", "TypeScript", "Supabase / Postgres"],
    description:
      "A live mobile-first app for tracking a Magic: The Gathering playgroup's game nights, decks and standings, on a Supabase Postgres backend with no accounts to sign up for.",
    proofPoints: [
      "Deployed and in real-user beta",
      "Join-code access, no login required",
      "Row-level security on every table"
    ],
    image: "assets/images/table-tracker/table-tracker-main-card.webp",
    imageAlt:
      "Table Tracker on three phone screens: the playgroup overview, the standings leaderboard, and the log-a-game form",
    // Replaced 2026-08-12. The old file was a 398x359 PNG, smaller than
    // the ~508px the card actually renders it at, so it was being
    // upscaled and looked soft.
    //
    // Composited from three real captures of the live app rather than one,
    // because a mobile-first app and a 5:3 card fight each other: a single
    // phone screen is roughly 0.45:1 and either pillarboxes or crops away
    // the content that makes it worth showing. Three side by side fill the
    // frame, read unmistakably as a mobile app, and show more of it.
    //
    // The playgroup's join code is blurred. With no accounts and no login,
    // that code IS the access control, so publishing it would have handed
    // anyone reading the portfolio write access to a real playgroup's data.
    // Blurred rather than replaced with a fake code: the "JOIN CODE" label
    // and Copy button stay visible, so it reads as deliberate redaction
    // instead of an invented value.
    imageWidth: 1400,
    imageHeight: 840,
    // Second live link on the site, after Mountainside Millwork. Verified
    // reachable 2026-08-12; the repo auto-deploys to this URL from `main`.
    liveUrl: "https://tabletrack-alpha.vercel.app",
    ctaLabel: "Try the App",
  },
  {
    number: "05",
    title: "Ancient Sleep Lore",
    tags: ["Brand Identity", "Content Strategy", "YouTube SEO", "Visual Design"],
    description:
      "A sleep-storytelling channel retelling ancient history and mythology, built end to end: identity, thumbnails, content strategy and YouTube SEO on a repeatable workflow.",
    proofPoints: [
      "Built end to end",
      "Repeatable production workflow",
      "AI-assisted creative process"
    ],
    image: "assets/images/ancient-sleep-lore/ancient-sleep-lore-main-card.webp",
    imageAlt:
      "Three Ancient Sleep Lore video thumbnails showing one visual system: gold and white serif titles, laurel ornaments, and moonlit Roman ruins",
    // Replaced 2026-08-12 with the channel's three real thumbnails, laid
    // out two over one. The thumbnails ARE the design work this card
    // describes, so they are the evidence, not a stand-in for it. Seen
    // together the system is obvious: same type lockup, same ornament,
    // same palette, same subtitle position.
    //
    // Titles and view counts were cropped away. The card claims a brand
    // and content system, not an audience, and its three proof points are
    // all about how the channel was built and run rather than how many
    // people watch. Including view counts would invite a judgement on a
    // claim the card never makes.
    //
    // Duration badges were kept: 36 to 50 minutes tells a viewer this is
    // long-form sleep content, which supports the description. YouTube's
    // red watched-progress bars were trimmed off the bottom of two
    // thumbnails, with the sides trimmed to match so the 16:9 ratio held
    // rather than stretching what was left.
    imageWidth: 1400,
    imageHeight: 840,
    // Fifth and final destination. The channel IS the artifact here:
    // thumbnails, titles and visual identity are the design work this
    // card describes, and a grid of them is more convincing than any
    // written case study of the same work would be.
    //
    // Deliberately linked despite a small subscriber count. Nothing in
    // this card's copy claims an audience: the three proof points are
    // about how it was built and run, and all three are true regardless
    // of how many people are watching. Hiding the only public artifact
    // would cost more than the number does.
    liveUrl: "https://www.youtube.com/@ancientsleeplore",
    ctaLabel: "View the Channel",
  }
];

/*
  Each skill now names the projects that actually used it, rather than
  being a bare string in a list. Two reasons:

  1. A standalone list of skills is an unverifiable claim: a visitor has
     no way to judge it. Tied to specific projects, each entry carries its
     own evidence, and the section stops being a list and starts being
     proof. This is what drives the project-filter interaction in
     setupSkillsCrossHighlight() (js/main.js) and the per-skill counts.
  2. It keeps the section honest by construction: a skill with no
     projects behind it is visibly a skill with nothing behind it.

  `projects` values must match a project `title` in the array above
  EXACTLY: that string is the join key the filter matches on. A typo
  doesn't throw, it just silently stops matching, so renderSkillGroups()
  validates these against the real project list at render time and warns
  in the console rather than failing quietly.

  >> TRAVIS: this first-pass mapping was derived only from what each
  >> project already states in its own tags, description, and proof
  >> points above, nothing was assumed beyond that, and anything
  >> uncertain was left off rather than guessed at. You know what each
  >> project actually involved; please review and correct. Adding or
  >> removing a name here is all that's needed, nothing else to update.

  Cut from 32 entries to 29. What went, and why: the test for keeping an
  entry is whether a stranger could ask you a real question about it:

    "VS Code"                  A text editor, not a skill. Every developer
                               uses one, so it carries no information, and
                               naming your editor is a well-known signal of
                               a list padded to reach a number.
    "GitHub" (merged into
     "Git / GitHub")           Was a separate entry from "Git" with an
                               IDENTICAL project list, one skill counted
                               twice, sitting immediately beside itself.
    "Database-Driven Thinking" Thinking isn't a skill. It sat next to
                               "SQLite" and "APIs", which are checkable.

  Two renames, for the opposite reason, both were underselling work the
  rest of the page already claims:

    "SEO Basics"           -> "SEO Setup"       Mountainside Millwork is a
                                                live client site whose SEO
                                                setup is listed as one of
                                                its proof points.
    "Accessibility Basics" -> "Accessibility"   The capabilities copy
                                                claims accessible front-end
                                                code outright.

  Neither rename inflates anything; "basic" was a hedge nobody but Travis
  was applying.

  Not cut, but worth a look: "Responsive Layouts" (Design) and "Responsive
  Development" (Front-End) have identical project lists and near-identical
  names. The design/implementation split is real, but they read as one
  skill counted twice. Left in pending Travis's call.
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
      { name: "React", projects: ["Table Tracker"] },
      { name: "TypeScript", projects: ["Table Tracker"] },
      { name: "Responsive Development", projects: ["Mountainside Millwork", "Arcane Vault"] },
      { name: "Components", projects: ["Mountainside Millwork", "Arcane Vault"] },
      { name: "Accessibility", projects: ["Mountainside Millwork"] }
    ]
  },
  {
    title: "Back-End / Data",
    items: [
      { name: "APIs", projects: ["Arcane Vault"] },
      { name: "Node + Express", projects: ["Arcane Vault"] },
      { name: "MySQL", projects: ["Arcane Vault"] },
      { name: "Supabase / Postgres", projects: ["Table Tracker"] },
      { name: "Database Security (RLS)", projects: ["Table Tracker"] },
      { name: "Data Structures", projects: ["Arcane Vault", "ValorBot"] },
      { name: "Admin Workflows", projects: ["Arcane Vault"] }
    ]
  },
  {
    title: "Workflow",
    items: [
      { name: "Git / GitHub", projects: ["Mountainside Millwork", "Arcane Vault", "ValorBot"] },
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
      { name: "Testing", projects: ["Mountainside Millwork", "ValorBot", "Table Tracker"] },
      { name: "Debugging", projects: ["Arcane Vault", "ValorBot"] },
      { name: "Documentation", projects: ["Arcane Vault", "ValorBot"] }
    ]
  },
  {
    title: "Content / Marketing",
    items: [
      { name: "SEO Setup", projects: ["Mountainside Millwork", "Ancient Sleep Lore"] },
      { name: "Content Planning", projects: ["Ancient Sleep Lore"] },
      { name: "Brand Systems", projects: ["Mountainside Millwork", "Ancient Sleep Lore"] },
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
  - Steps 02, 04 and 05 were rewritten again later, because reviewing this
    section directly after "What I Bring to a Project" showed the two were
    largely restating each other. Diffing them turned up near-verbatim
    reuse: "and responsive layouts" shared between Design/Design, and
    "clean, accessible front-end code" shared between Build/Build. Four of
    these six steps mapped almost one-to-one onto the four capability
    panels, so a visitor read the deliverables list, scrolled once, and
    read it again in a different box.

    The two sections now have different jobs, and edits should keep them
    apart:

      capabilities  -> WHAT you get. Services and deliverables.
      processSteps  -> HOW it runs. Sequence, when decisions happen,
                       what the client actually experiences.

    Steps 01, 03 and 06 were already doing that and are untouched, 03's
    "agreed up front while changes still take minutes rather than days"
    is the model: it explains why the ORDER matters rather than naming an
    artifact. 02, 04 and 05 had been deliverable lists that belonged one
    section up, and now cover scope agreement, working in reviewable
    pieces, and handover instead.

    Consequence worth knowing: the searchable deliverable terms
    (wireframes, responsive layouts, accessible front-end code, SEO) now
    live in `capabilities` and the project `tags`/`description`s rather
    than being repeated here. That's deliberate, repeating a keyword in
    two adjacent sections doesn't rank better, it just reads as padding.

  - Step 03 still hands off to the next one ("The approved design..." was
    dropped with the 04 rewrite, but 02 -> 03 -> 04 still run in sequence),
    so the six read as one continuous process rather than six unrelated
    bullet points.

  - These three are the only place on the site that addresses the reader
    as "you". That's deliberate rather than an inconsistency: this is the
    one section describing what happens TO the client, so second person
    is the natural voice for it. Everywhere else stays first person.
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
    description: "Settle scope, timeline, and what's in or out before anything starts, so there's one agreed plan and no moving targets."
  },
  {
    step: "03",
    title: "Design",
    description: "Agree the look and structure up front, while a change still takes minutes rather than the days it costs after build."
  },
  {
    step: "04",
    title: "Build",
    description: "Build in reviewable pieces, so you see real screens working early instead of waiting for one big reveal at the end."
  },
  {
    step: "05",
    title: "Launch",
    description: "Nothing goes live untested, and nothing gets handed over unexplained. You'll know how the site works before I step back."
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
  js/main.js's renderCapabilities(): plain geometric line icons (compass,
  layered stack, code brackets, trending line), not a copied icon-library
  asset, so there's no external font/sprite file to load. currentColor is
  used for the stroke so .capability-panel__icon's own CSS color (Trail
  Orange) is what actually colors each one, not a hardcoded value here.
*/
/*
  Copy pass (per direct request: stronger copy, cohesive across the
  section, SEO-aware, positive/on-brand):

  - Titles keep their three-word, verb-first parallel structure, which
    ties this section to the hero's own climb/route metaphor.

    Two of them were later renamed, because above 1080px the titles are
    the ONLY thing on screen at rest: the descriptions are collapsed
    until a panel is hovered or focused (see the min-width: 1080px block
    in css/components.css). That makes a title the whole message on the
    widest screens, so it has to be legible on its own, and two weren't:

      "Build the System"     -> "Build the Site"
      "Improve the Presence" -> "Improve What's Live"

    Both old titles were the wayfinding metaphor bending to fit the
    three-word pattern rather than describing the work. Nobody builds a
    "system" here (it's websites and apps) and "the Presence" is not
    something anyone says; it'd be "your presence", or no article at all.
    "Plan the Path" and "Design the Experience" are left alone: they're
    the two that manage to be clear AND on-metaphor at the same time.
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
    description: "Goals, audience, and scope settled up front, so the build starts with clear direction instead of guesswork.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><polygon points="15.5 8.5 13.2 13.2 8.5 15.5 10.8 10.8 15.5 8.5"></polygon></svg>'
  },
  {
    title: "Design the Experience",
    description: "Wireframes, UI design, and responsive layouts that make a site clear to navigate and easy to trust.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2.5 2.5 7.5 12 12.5 21.5 7.5 12 2.5"></polygon><polyline points="2.5 16.5 12 21.5 21.5 16.5"></polyline><polyline points="2.5 12 12 17 21.5 12"></polyline></svg>'
  },
  {
    title: "Build the Site",
    description: "Responsive websites and web apps built in clean, accessible front-end code that stays easy to maintain.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="16.5 7 22 12 16.5 17"></polyline><polyline points="7.5 7 2 12 7.5 17"></polyline><line x1="13.5" y1="4" x2="10.5" y2="20"></line></svg>'
  },
  {
    title: "Improve What's Live",
    description: "Launch support, SEO fundamentals, and steady improvements that keep a site earning its keep over time.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="22.5 6.5 13.5 15.5 8.5 10.5 1.5 17.5"></polyline><polyline points="16 6.5 22.5 6.5 22.5 13"></polyline></svg>'
  }
];
