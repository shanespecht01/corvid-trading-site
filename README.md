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
    boards/                    client idea boards — see "Client idea boards" below
    api/board/README.md        v2 shared-save design note — not built, nothing live

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
`https://red-cliff-0f6d37810.3.azurestaticapps.net/?welcome=rojo`) shows a
personalized welcome banner at the top of the page, with up to two buttons —
a link to that client's own **idea board** and/or a link to their **PromoHunt**
presentation. Anyone visiting the normal URL never sees it. Each button only
shows up when its field is filled in; leave one blank to show just the other.

**To add a new client — no coding needed:** open `js/welcome-clients.json` in
any text editor (including GitHub's web editor) and add an entry:

    {
      "slug": "shortname",
      "name": "Display Name",
      "welcomeHeadline": "Welcome, Display Name.",
      "welcomeBlurb": "Whatever context line fits.",
      "boardPath": "boards/shortname.html",
      "promoHuntUrl": "https://promohunt.com/presentations/..."
    }

Leave `boardPath` or `promoHuntUrl` as `""` if that client doesn't have one.
Keep the commas between entries. Save, commit, and push (or use GitHub's
"Commit changes" button) — it auto-deploys like everything else. Then share
`https://red-cliff-0f6d37810.3.azurestaticapps.net/?welcome=shortname` with
that client.

**To remove the whole feature:** delete `css/welcome.css`, `js/welcome.js`,
`js/welcome-clients.json`, `assets/feather-welcome.svg`, the `#welcomeBanner`
section in `index.html`, and the `<link>`/`<script>` tags pointing at
`welcome.css` / `welcome.js` (leave `edit-mode.css`/`edit-mode.js` alone if
`boards/` is staying). Full step-by-step is in the comment block above
`#welcomeBanner` in `index.html`.

## Client idea boards

A per-client "idea board" is a small branded page — like a mini pitch deck —
showing a handful of margin-smart product picks tailored to that client, with
planning-estimate pricing they (or Amanda) can react to before anything gets
a real PromoHunt quote. The first one is `boards/rojo.html` (RoJo Legacy).

**For day-to-day use — opening a board, unlocking editing, what's editable
and what isn't, and setting a client's PromoHunt link — see [AMANDA.md](AMANDA.md).**
That's the non-technical guide. Below is the technical side: the edit-mode
mechanism and how to wire up a new client's board in the code.

Editing (`?key=AMANDA123`, see `js/edit-mode.js`) is a convenience toggle,
not security, and saves to `localStorage` per-device only, with an Export
JSON button to hand edits back for a real commit. There's a documented (not
yet built) plan for a real shared save — see `api/board/README.md`.

### Adding the next client's board

1. Copy `boards/rojo.html` to `boards/<slug>.html` — it's a template, you're
   only changing one line.
2. Copy `boards/rojo.data.js` to `boards/<slug>.data.js` and edit the
   `client`, `sections`, and `products` — see the comments at the top of
   that file for the field shapes.
3. In your new `boards/<slug>.html`, change `<script src="rojo.data.js">` to
   `<script src="<slug>.data.js">`.
4. In `js/welcome-clients.json`, add or update that client's entry with
   `"boardPath": "boards/<slug>.html"`.
