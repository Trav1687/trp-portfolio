# Launch checklist

Work top to bottom. The order matters: several steps depend on a decision
made in an earlier one, and doing them out of sequence means redoing work.

Tick things off as you go. Anything marked **decide** needs an answer from
you before the steps under it make sense.

---

## Phase 1: Buy the domain

### 1.1 Check availability

Search for both, at any registrar's lookup or at a neutral checker:

- `travispeakman.ca`
- `travispeakman.com`

If `.ca` is taken but `.com` is free, the plan flips: `.com` becomes the
live site. Everything downstream still works, just swap which is which.

### 1.2 Confirm you can register `.ca`

`.ca` is administered by CIRA and requires meeting Canadian Presence
Requirements. As a Canadian resident you qualify under the individual
category. You will be asked to confirm this at checkout. Nothing to
prepare, but it is why `.ca` is less crowded than `.com`.

`.ca` must be bought through a CIRA-certified registrar. Most large
registrars are; the registrar's own site will say.

### 1.3 **Decide**: registrar

Do not overthink this, but do check four things before paying:

- **Renewal price, not the first-year price.** First years are loss leaders.
  The renewal is what you actually pay every year after.
- **Free WHOIS privacy.** Without it your name, address, phone and email
  are published in a public database that spammers scrape. Some registrars
  charge for this; the good ones include it. (For `.ca`, CIRA already
  withholds individual registrants' details by default.)
- **DNS management included**, so you can point the domain at a host.
- **No forced bundles.** You do not need their hosting, their email, their
  site builder, or their SEO package. Decline all of it.

### 1.4 Register both

Buy `.ca` and `.com`. Roughly $30 to $40 a year for the pair. The second
one is not for using; it stops someone else holding your name and catches
people who type `.com` out of habit.

Register for **at least two years** if the price is the same per year.
Domain age is a small trust signal and it removes a renewal you could
forget.

### 1.5 Immediately after purchase

- [ ] Turn **auto-renew ON**. A lapsed domain can be bought by anyone,
      and recovering it is expensive or impossible.
- [ ] Turn **registrar lock ON** (sometimes "transfer lock"). Prevents
      unauthorised transfers away from your account.
- [ ] Confirm **WHOIS privacy** is active.
- [ ] Put the renewal date in your calendar anyway. Auto-renew fails when
      a card expires.

---

## Phase 2: Get the site deployable

Do this before touching DNS. It is much easier to fix a broken build on a
temporary URL than on your live domain.

### 2.1 Merge to `main`

Right now everything lives on `feature/selected-peaks-layout-v2`, and
`main` is weeks behind. Hosts deploy `main` by default, so it has to
become the truth first.

```powershell
cd C:\Users\Travi\Projects\trp-portfolio
git checkout main
git merge feature/selected-peaks-layout-v2
git push origin main
```

If it reports conflicts, stop and get help rather than resolving them
under pressure. `main` descends from an older point, so conflicts are
possible.

Afterwards, delete the stale branches: `develop`,
`feature/dark-hero-refine`, and `feature/selected-peaks-layout` (the v1).

### 2.2 **Decide**: host

The site is fully static (HTML, CSS, two JS files, images). Everything
below has a free tier that covers this comfortably, deploys straight from
GitHub, and issues HTTPS certificates automatically:

- **Netlify** — simplest custom-domain setup of the three.
- **Vercel** — already in your stack, since Table Tracker deploys there.
- **Cloudflare Pages** — fastest, slightly more configuration.

Any is fine. Pick one and stop comparing.

Avoid GitHub Pages here for one specific reason: apex-domain HTTPS on it
is fiddlier than on the other three, and you are using an apex domain.

### 2.3 Connect the repo and deploy

1. Sign in to the host with GitHub.
2. Import `travispeakman/trp-portfolio`.
3. Build settings: **no build command**, publish directory **`/`**
   (root). This is a static site with no build step. If the host insists
   on a framework preset, choose "Other" or "No framework".
4. Deploy.

You will get a temporary URL like `something.netlify.app`.

### 2.4 Verify on the temporary URL

Before going near DNS, confirm on that URL:

- [ ] Page loads, all five project cards render
- [ ] All five project CTAs open the right destination
- [ ] Résumé button opens the PDF
- [ ] Contact form submits and the email arrives
- [ ] Mobile layout correct (open it on your actual phone, not just
      DevTools)
- [ ] No console errors

Fix anything broken here, not later.

---

## Phase 3: Connect the domain

### 3.1 **Decide**: `www` or no `www`

You must pick one as canonical and redirect the other. Both work; being
inconsistent is what causes problems, because search engines treat
`example.ca` and `www.example.ca` as different sites.

Recommended: **no `www`** (`travispeakman.ca`). Shorter, and it matches
how the site's own metadata is already written.

Whatever you choose has to match the URLs you write in Phase 4 exactly.

### 3.2 Point DNS at the host

In the host's dashboard: add your custom domain. It will show you the DNS
records it needs. Then, at your **registrar**, add those records.

Two ways, depending on what the host tells you:

- **Nameserver change** (host manages DNS): replace the registrar's
  nameservers with the host's. Simplest, fewest moving parts.
- **A / CNAME records** (registrar keeps DNS): add the exact records the
  host specifies. Usually an `A` record for the apex and a `CNAME` for
  `www`.

Use whichever the host recommends. Do not mix both.

### 3.3 Wait

DNS propagation is usually minutes, occasionally up to 48 hours. Do not
change things repeatedly while waiting, that makes it slower and harder to
diagnose. Check with `nslookup travispeakman.ca` or an online DNS checker.

### 3.4 Verify HTTPS

- [ ] `https://travispeakman.ca` loads with a padlock
- [ ] `http://` version redirects to `https://`
- [ ] `www.` version redirects to the canonical one (or vice versa)
- [ ] Certificate is valid, not a warning page

All three hosts issue Let's Encrypt certificates automatically once DNS
resolves. If it does not appear within an hour of DNS resolving, the host
has a "renew certificate" button.

### 3.5 Redirect the `.com`

At the registrar for `travispeakman.com`, set up domain forwarding to
`https://travispeakman.ca`. Most registrars have this built in and free.
Choose **301 / permanent**, not 302, so search engines pass the signal
through rather than treating it as temporary.

---

## Phase 4: Update the site's own URLs

Only now, once you know the real domain and whether it has `www`.

There are **19 `PLACEHOLDER-DOMAIN.com` references across four files**:

| File | Count | What they are |
|---|---|---|
| `index.html` | 13 | canonical, Open Graph, Twitter, 3x JSON-LD |
| `privacy.html` | 2 | canonical, TODO comment |
| `sitemap.xml` | 2 | `<loc>`, TODO comment |
| `robots.txt` | 2 | `Sitemap:`, TODO comment |

Tell Claude the final domain and it does all of them in one pass, then
you commit and push. The host redeploys automatically.

Also update while you are there:

- [ ] Contact email, if you set up an address on the new domain
      (`travis@travispeakman.ca` rather than the outlook address). Appears
      in `index.html`, `privacy.html`, and both JSON-LD blocks.

---

## Phase 5: After launch

### 5.1 Tell Google it exists

1. Go to Google Search Console, add a property for the domain.
2. Verify ownership (DNS TXT record is the most reliable method).
3. Submit `https://travispeakman.ca/sitemap.xml`.
4. Use "Request indexing" on the homepage to skip the queue.

Without this, expect to wait weeks to be indexed. With it, days.

### 5.2 Check how the link looks when shared

Paste the URL into each of these and confirm the OG image and text render:

- LinkedIn Post Inspector (this one matters most for a job search)
- Facebook Sharing Debugger
- X Card Validator

If a preview looks wrong after a fix, these tools have a "scrape again"
button. Social platforms cache aggressively.

### 5.3 Set up email on the domain

Optional but recommended. `travis@travispeakman.ca` reads considerably
better than an `outlook.com` address on a portfolio selling web work,
and your own client's site uses a domain address.

Cheapest route is email forwarding, which most registrars include free:
mail to `travis@travispeakman.ca` lands in your existing inbox. Sending
*from* that address needs a real mailbox (Google Workspace, Fastmail,
Zoho) at a monthly cost.

### 5.4 Update everything that points at you

- [ ] GitHub profile → Website field
- [ ] LinkedIn → Contact info → Website
- [ ] Both résumé PDFs → replace any old URL, add the new one
- [ ] Email signature

### 5.5 Run the checks again, on the real domain

- [ ] PageSpeed Insights (both mobile and desktop tabs)
- [ ] Google Rich Results Test, to confirm the three JSON-LD blocks parse
      on the live URL
- [ ] Open it on a real iPhone and a real Android if you can borrow one

---

## Things that are easy to get wrong

**Buying hosting from the registrar.** You do not need it. Registrar and
host are separate jobs and the free static hosts are better at hosting
than a registrar's bundled offering.

**Letting WHOIS privacy lapse.** Your home address becomes public.

**Mixing `www` and non-`www`.** Pick one, redirect the other, and make
every URL you write match the one you picked.

**Launching on `http`.** Every host here does HTTPS free and automatically.
There is no reason to be on `http` for a minute.

**Submitting the sitemap before the domain resolves.** Search Console
will fail the fetch and you will have to resubmit.

**Forgetting the `.com` redirect.** People will type it. If it goes
nowhere, they assume you do not exist.
