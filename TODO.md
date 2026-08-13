# TRP Portfolio: Launch TODO

Version 1 is built and functional. These items are intentionally left as
placeholders and should be resolved before the site goes live.

## Domain

- [ ] Replace `PLACEHOLDER-DOMAIN.com` with the final domain everywhere it
      appears:
  - `index.html` (canonical link, Open Graph tags, Twitter tags, both JSON-LD blocks)
  - `privacy.html` (canonical link)
  - `robots.txt` (Sitemap line)
  - `sitemap.xml` (all `<loc>` entries)

## Resume

- [ ] Upload the Front-End Developer resume PDF and link it from the
      "View Resume" button in the About section (`index.html`). Remove the
      `disabled` attribute and the placeholder note once it's live.
- [ ] Do not link the Designer resume alongside it for V1: only one resume
      link in the main contact/about area, per the approved decision.

## Selected Peaks project links

- [ ] Once case study pages exist, replace the disabled "View Project Notes"
      buttons in `js/main.js` / `js/data.js` with real links.
- [ ] Add live URLs and repo links in `js/data.js` only when they're
      confirmed: do not invent placeholder URLs.

## Open Graph image

- [ ] `assets/images/trp-og-image.png` is a placeholder graphic (1200x630).
      Replace with a final, designed social preview image before launch.

## Image optimization

- [ ] Compress/convert the project screenshots under `assets/images/` from
      PNG to WebP (or AVIF) before production. Files are currently
      unoptimized originals from the handoff package.

## Privacy / sitemap

- [ ] `privacy.html` is intentionally `noindex` and left out of
      `sitemap.xml`. If that changes, update both files together.

## Later features (per launch decisions: do not add yet)

- [ ] Contact form (currently email link only)
- [ ] Analytics
- [ ] Chatbot
