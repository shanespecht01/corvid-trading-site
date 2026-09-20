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

### Opening a board

Just open the file, e.g.
`https://red-cliff-0f6d37810.3.azurestaticapps.net/boards/rojo.html` — or
click the "See your idea board →" button on that client's welcome banner
(`?welcome=rojo`).

### Unlocking editing

Add `?key=AMANDA123` to the URL of either the board page or the main site
(for the welcome banner), or click the small dashed **Edit** button at the
bottom of a board / top-right of the welcome banner and enter the key when
prompted. **This key is a convenience, not a password** — it's public,
right here in this README and in the code. Don't put anything sensitive
behind it.

Once unlocked, on a board you can edit:
- each product's "corvid's-eye" note
- its **Item #** and **Your price** fields (these two are actually always
  typable, key or not — the key is what makes the change *stick*)

On the welcome banner you can edit the headline, the blurb, and the idea
board / PromoHunt links.

### Saving your changes

A bar appears at the bottom while editing:
- **Save** — writes your edits to *this browser, this device only*
  (`localStorage`). Reopen the same board on the same computer later and
  your edits are still there. Opening it on a different computer, or after
  clearing browser data, won't show them.
- **Export JSON** — downloads a JSON file with everything as it currently
  stands (including your edits). Send that file to Shane so it can be
  committed into the real data file (`boards/rojo.data.js` for a board,
  `js/welcome-clients.json` for the banner) and show up for everyone.
- **Done** — locks the page back up.

There's a documented (not yet built) plan for a real shared save — see
`api/board/README.md` — for whenever this is worth the extra setup.

### Setting a client's PromoHunt link

Open `js/welcome-clients.json`, find that client's entry, and fill in
`promoHuntUrl` with the link to their PromoHunt presentation. Same file
handles `boardPath` if/when they get an idea board.

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
