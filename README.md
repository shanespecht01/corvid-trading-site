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

## Three final drafts (experimental)

The last preview slider. Add `?themes=1` to any URL for the picker, or
`?theme=<slug>` to jump straight into one. A pick is remembered in
`localStorage` — **per device**, changing nothing for anyone else. With no
draft selected the site renders exactly as it does live.

These came out of Amanda's review of the earlier explorations: she picked the
**original colour scheme**, Nest & Kraft's **type and background**, the
**uniform layout**, and the **pronounced** hand details. Those picks contain
one real conflict — the original palette is a near-black jewel tone, and
Nest & Kraft's background is light kraft paper, so they can't both be the
background. Each draft resolves it differently, and that is the decision
still to be made:

| Draft | `?theme=` | Resolves the conflict by |
|---|---|---|
| Kraft & Cobalt | `kraft-cobalt` | Paper wins — kraft background, original blue/violet as the ink |
| Ink & Grain | `ink-grain` | Dark wins — original colours exactly, kraft type + grain over them |
| Two-Tone Press | `two-tone` | Both — kraft body with deep-ink feature sections |

Everything else is shared and no longer optional: Bitter / Space Mono /
Work Sans, squared corners, paper grain, and the pronounced hand details
(tape, stitching, deckled tiles, maker's stamp). The uniform grid is the
site's own layout, so there's nothing to override for it. All three keep the
original feather, since the original colour scheme was the pick.

How it works: `css/styles.css` `:root` holds tokens for colour, surface,
radius, border, texture and type. `css/themes.css` overrides only those
tokens per draft — no layout forks, no duplicated CSS — and `js/themes.js`
sets `data-theme` on `<html>` before first paint, loading the drafts' fonts
only when a draft is actually active so normal visitors pay nothing.

**Adding a token:** if something needs a value that's still hardcoded, add
the token to `:root` in `styles.css` (default = today's look) and reference
it — don't put raw colours or radii in the rules.

**Promoting the winner and deleting the rest:**
1. Copy the winning `html[data-theme="…"]` block's declarations over the
   matching ones in `:root` in `css/styles.css`, plus the shared
   `html[data-theme]` block (fonts, radii, texture, nav sizing).
2. Move the fonts from `FONTS` in `js/themes.js` into the Google Fonts
   `<link>` in **both** `index.html` and `boards/rojo.html`.
3. Move the pronounced-hand rules into `styles.css`, dropping the
   `html[data-theme]` prefix. Move the maker's stamp out of the
   `::after { content: … }` and into real markup in `#story`.
4. For `two-tone`, keep its per-section token block — that's the whole idea.
5. Delete `css/themes.css`, `js/themes.js`, and their tags in `index.html`
   and `boards/rojo.html`. Nothing else references them.
6. Update the `corvid-trading` skill's `design-system.md` to the chosen
   values — **including the "dark, restrained, jewel-toned" rule if a
   paper-backed draft wins** — or the docs and the site will disagree.

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
