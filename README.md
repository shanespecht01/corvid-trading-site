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
