# Corvid Trading Co. — Website

Promotional products & custom goods, Fargo–Moorhead. Static site hosted on
**Azure Static Web Apps** (free tier), deployed automatically from this repo on
every push to `main`.

## Structure (buildless — no build step)

    index.html                 page structure (hero feather inlined for the twinkle)
    css/styles.css             all styles
    js/main.js                 nav, scroll-reveal, reduced-motion, quote form
    assets/feather-mark.svg    the feather, referenced by the 3 static marks + favicon
    favicon.svg
    staticwebapp.config.json   Azure SWA routing, headers, caching

## Local preview

Just open `index.html` in a browser. (Google Fonts need internet; everything
else is local.) For a closer-to-production preview with clean routing:

    npx @azure/static-web-apps-cli start .

## Deploy

One-time setup in **SETUP.md**. After that, `git push` to `main` auto-deploys.

## The quote form

`js/main.js` has a `FORM_ENDPOINT` constant. Empty = preview mode (no send). Set
it to a form service URL, or to `/api/quote` once the Azure Function is added, to
receive real leads. Keep any keys server-side — never in this repo.

## Personalized welcome banners (experimental)

Adding `?welcome=<slug>` to the site URL (e.g.
`https://red-cliff-0f6d37810.3.azurestaticapps.net/?welcome=hank`) shows a
personalized "Welcome, [Name]" banner at the top of the page with a button
linking out to that client's order options (a PromoHunt presentation, a quote
PDF, whatever's relevant). Anyone visiting the normal URL never sees it.

**To add a new one — no coding needed:** open `js/welcome-clients.json` in any
text editor (including GitHub's web editor) and add an entry:

    {
      "slug": "shortname",
      "name": "Display Name",
      "message": "Whatever context line fits.",
      "presentationUrl": "https://the-link-they-should-click.example.com",
      "ctaLabel": "View your order options"
    }

Keep the commas between entries. Save, commit, and push (or use GitHub's
"Commit changes" button) — it auto-deploys like everything else. Then share
`https://red-cliff-0f6d37810.3.azurestaticapps.net/?welcome=shortname` with
that client.

**To remove the whole feature:** delete `css/welcome.css`, `js/welcome.js`,
`js/welcome-clients.json`, `assets/feather-welcome.svg`, the `#welcomeBanner`
section in `index.html`, and the two `<link>`/`<script>` tags pointing at
`welcome.css` / `welcome.js`. Full step-by-step is in the comment block above
`#welcomeBanner` in `index.html`.
