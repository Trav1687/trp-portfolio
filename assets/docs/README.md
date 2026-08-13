# assets/docs

PDFs linked from the site. Drop résumé files here.

## Expected filenames

| File | Used by |
|---|---|
| `travis-peakman-front-end-developer-resume.pdf` | About section "View Resume" button (primary) |
| `travis-peakman-digital-designer-resume.pdf` | Not linked in V1: kept here for sending directly |

## Why these names

The filename is public. It appears in the URL, and it becomes the
filename on the visitor's machine when they save it. A file called
`resume-final-v3.pdf` sitting in someone's Downloads folder is not
findable a week later; a file with your name and the role in it is.

Lowercase and hyphenated to match the rest of `assets/`: no spaces,
which would be percent-encoded into `%20` in the URL.

## V1 links one résumé only

The About section shows a single button pointing at the front-end
developer PDF. That's deliberate: the section's own copy claims Travis
works across the whole span of a project rather than one slice of it,
and offering a visitor a choice between a "dev" and a "design" résumé
contradicts that claim a few inches below where it's made.

The design version lives here so it's versioned alongside the other, and
so it's ready to send directly when a design role comes up.

## Before adding a file

- Export as PDF, not `.docx`: a Word file downloads instead of opening
  in the browser, and renders differently on every machine.
- Check the PDF's internal document title (File → Properties in most
  editors). Browsers show it in the tab, and exporters often leave it as
  something like "Document1" or the template's name.
- Keep it under about 1 MB. Résumés are text; anything much larger
  usually means an uncompressed image was embedded.
