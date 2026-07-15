/*
  Source data for Selected Peaks projects and Tools & Skills groups.
  Keeping this separate from the render/interaction logic in main.js
  makes it easy to update project copy and links without touching markup.

  TODO (before production): the `image` paths below still point at the raw
  PNG screenshots from the handoff package. Compress/convert these to WebP
  (see TODO.md at the project root) once final case study pages exist.
*/

const projects = [
  {
    number: "01",
    title: "Mountainside Millwork",
    tags: ["Client Website", "Angular", "Responsive Design", "Business Presence"],
    description:
      "A real client website for a custom millwork business, built to create a clear online presence, explain services, and make contact simple.",
    proofPoints: [
      "Real client project",
      "Clear service and contact flow",
      "Responsive design",
      "Business-focused structure",
      "Launch and SEO considerations"
    ],
    image: "assets/images/mountainside-millwork/mountainside-millwork-main-card.png",
    imageAlt: "Mountainside Millwork website homepage shown on desktop",
    ctaLabel: "View Project Notes",
  },
  {
    number: "02",
    title: "Arcane Vault",
    tags: ["Web App", "Angular + API", "Admin System", "Database-Driven"],
    description:
      "A web app project focused on app structure, admin workflow, data handling, and practical front-end development.",
    proofPoints: [
      "Front-end app structure",
      "API/database thinking",
      "Admin workflow",
      "Debugging and production thinking",
      "Interface organization"
    ],
    image: "assets/images/arcane-vault/arcane-vault-main-card.png",
    imageAlt: "Arcane Vault web app dashboard interface",
    ctaLabel: "View Project Notes",
  },
  {
    number: "03",
    title: "ValorBot",
    tags: ["Python Automation", "Data Logging", "Testing Workflow", "Risk Controls"],
    description:
      "A technical automation project focused on structured configuration, logging, testing, and risk-aware system planning.",
    proofPoints: [
      "Python automation",
      "Logs and validation",
      "Config-driven system",
      "Testing workflow",
      "Risk-aware technical planning"
    ],
    image: "assets/images/valorbot/valorbot-main-card.png",
    imageAlt: "ValorBot system architecture and logging dashboard",
    ctaLabel: "View Project Notes",
  },
  {
    number: "04",
    title: "Table Tracker",
    tags: ["Product Design", "UX Planning", "MVP Strategy", "Community App"],
    description:
      "A product-focused app concept built around a real group problem: helping players track game nights, attendance, results, and group activity.",
    proofPoints: [
      "Real group problem",
      "MVP scope",
      "User flows",
      "Feature planning",
      "UX/product thinking"
    ],
    image: "assets/images/table-tracker/table-tracker-main-card.png",
    imageAlt: "Table Tracker mobile dashboard and standings screens",
    ctaLabel: "View Project Notes",
  },
  {
    number: "05",
    title: "Ancient Sleep Lore",
    tags: ["Brand Identity", "Content Strategy", "YouTube SEO", "Visual Design"],
    description:
      "A creative digital brand project combining visual identity, content strategy, storytelling, thumbnails, SEO, and repeatable production workflow.",
    proofPoints: [
      "Audience-focused brand",
      "Thumbnail and visual system",
      "SEO/content planning",
      "Consistent production workflow",
      "AI-assisted creative process"
    ],
    image: "assets/images/ancient-sleep-lore/ancient-sleep-lore-main-card.png",
    imageAlt: "Ancient Sleep Lore brand and channel visual system",
    ctaLabel: "View Project Notes",
  }
];

const skillGroups = [
  {
    title: "Design",
    items: ["Figma", "FigJam", "Wireframes", "UI Design", "Responsive Layouts", "Design Systems", "Prototyping"]
  },
  {
    title: "Front-End",
    items: ["HTML", "CSS", "JavaScript", "Angular", "Responsive Development", "Components", "Accessibility Basics"]
  },
  {
    title: "Back-End / Data",
    items: ["APIs", "SQLite", "Data Structure", "Admin Workflows", "Database-Driven Thinking"]
  },
  {
    title: "Workflow",
    items: ["Git", "GitHub", "VS Code", "Project Planning", "Testing", "Debugging", "Documentation"]
  },
  {
    title: "Content / Marketing",
    items: ["SEO Basics", "Content Planning", "Brand Systems", "YouTube SEO", "Thumbnail Strategy", "AI-Assisted Workflows"]
  }
];

const processSteps = [
  {
    step: "01",
    title: "Understand",
    description: "Clarify the problem, audience, goals, constraints, and what success should look like."
  },
  {
    step: "02",
    title: "Plan",
    description: "Organize the work into a clear structure, user flow, content plan, or MVP scope."
  },
  {
    step: "03",
    title: "Design",
    description: "Create wireframes, interface direction, visual systems, and layouts that make the experience easier to use."
  },
  {
    step: "04",
    title: "Build",
    description: "Turn the plan into responsive front-end code, components, pages, and working interactions."
  },
  {
    step: "05",
    title: "Launch",
    description: "Prepare the project for real use with testing, SEO basics, forms, links, performance checks, and final polish."
  },
  {
    step: "06",
    title: "Watch & Improve",
    description: "Review what works, what needs adjusting, and what can be improved after launch."
  }
];

const capabilities = [
  {
    title: "Plan the Path",
    description: "Turn rough ideas, goals, and constraints into a clear direction before building."
  },
  {
    title: "Design the Experience",
    description: "Create layouts, flows, and interfaces that make the next step easier to understand."
  },
  {
    title: "Build the System",
    description: "Develop responsive websites and app interfaces with practical front-end structure."
  },
  {
    title: "Improve the Digital Presence",
    description: "Support the launch, polish, SEO, content structure, and ongoing improvement of digital work."
  }
];
