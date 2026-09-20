# `/api/board` — v2 persistence (not built yet)

This folder is a **design note only** — there is no Azure Function here, and
nothing in `staticwebapp.config.json` points at it. Adding it later means
real Azure resources (managed Functions run on the SWA Free SKU at no extra
cost, but confirm that's still true before building — see the cost-discipline
note in the `corvid-trading` skill's `hosting-and-forms.md`). **Don't build
this until asked.**

## Why it would exist

v1 of the client idea boards (see `boards/board.js`) saves edits to
`localStorage` — per device, per browser, never synced. That's fine for one
person (Amanda) tweaking on one laptop, but breaks the moment two people need
to see the same saved state, or she switches devices.

## Shape, if built

Follows the same pattern as the quote form's `/api/quote` (see
`hosting-and-forms.md`): a managed Azure Function, `app_location: /`,
`api_location: /api`.

```
POST /api/board/:slug     save an idea-board's edited overlay (notes, item
                            numbers, your-price fields) — same shape
                            boards/board.js already exports via "Export JSON"
GET  /api/board/:slug     read the current saved overlay for that board
```

- **Storage:** Azure Table Storage (one row per client slug) or Blob Storage
  (one JSON blob per slug) — either is effectively free at this scale.
- **Auth:** the `?key=AMANDA123` convenience key is NOT sufficient for a
  real write endpoint — it's client-side and public. A real save endpoint
  needs its own secret, stored as an SWA application setting (never in the
  repo), checked server-side before accepting a write.
- **Client change:** `boards/board.js`'s save/export functions would call
  `fetch('/api/board/' + slug, {...})` instead of (or in addition to)
  `localStorage`, using the same overlay JSON shape already in place —
  minimal rewrite since the data shape doesn't change, only where it's read
  from and written to.
- Same idea applies to the welcome-banner edits in `js/welcome.js` if that
  ever needs multi-device sync too (`/api/welcome/:slug`).
