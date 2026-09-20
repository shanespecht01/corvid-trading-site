# For Amanda — Client Welcome Pages & Idea Boards

A quick guide to the parts of the site you can update yourself. No coding,
no GitHub account needed.

## The two links you send a client

Every client gets their own welcome link:

    https://red-cliff-0f6d37810.3.azurestaticapps.net/?welcome=<their-slug>

Example: `.../?welcome=rojo`

That page can show up to two buttons — only the ones that are filled in show up:

- **See your idea board →** — a curated, Corvid-branded picks page for them to browse
- **Open your PromoHunt →** — your real PromoHunt presentation for them

## Turning on editing — heads up, this part is a preview

Before you try it: what's below is a **working demo**, not the finished
version. It's real — the editing genuinely works, nothing is faked — but
think of it as a taste of what full self-service editing *could* be like,
built quickly to see if it's worth having at all. If you try it and want
this to be a real, permanent part of how you work, tell Shane and he'll
build out the finished version (a proper shared save, described below).
That's normal — it's cheaper to build a rough version first and see if it's
actually useful before investing in the real thing.

Add `&key=AMANDA123` to the end of a welcome link (or `?key=AMANDA123` if it's
the only thing after the `?`), or click the small dashed **Edit** button on
the page and type the key when asked.

**This key is a convenience, not a real password.** It's sitting right here
in plain text, and anyone with a link could type it in. Nothing sensitive
lives behind it — don't put anything there that would matter if a stranger
saw it.

## What you CAN change

On a welcome page, once unlocked:
- The headline and welcome message
- The idea board link and the PromoHunt link

On an idea board, once unlocked:
- Each product's little "why this fits them" note
- **Item #** (fill in once you've found it in PromoHunt)
- **Your price** (what you're quoting them)

The Item # and Your price boxes are actually always typable, key or not —
the key is what makes your changes *stick* after you leave the page.

## What you CAN'T change (yet)

- Adding a **brand-new client** — that first step still needs a quick ask to
  Shane (see below).
- Adding, removing, or reordering products on a board, or changing the
  estimated cost/retail numbers, section titles, or colors — those come from
  the data file Shane sets up.
- Anything on the main site (homepage, FAQ, etc.) — this system only touches
  welcome pages and idea boards.

## Saving your changes — how the preview handles this

A real, finished version of this would save your edits straight to the
website itself, instantly, for everyone. Building that (a proper server +
database) is real work, so it wasn't built for this first pass — instead,
the demo uses a lightweight stand-in so you can still try the whole
workflow end to end:

- **Save** keeps your edits on *the computer/browser you're using right
  now* — like a draft that only exists on that one device. Come back on the
  same computer later and they're still there. Open the same page on your
  phone, or a different computer, and they won't be — that's the trade-off
  of the quick version, not a bug.
- **Export JSON** downloads a file with everything exactly as it stands.
  **Send that file to Shane** and he'll commit it so your changes show up
  for everyone, everywhere, for good — this is how a draft becomes real
  right now, until/unless the full version gets built.

So the flow is: edit → **Save** (so it sticks on your machine while you keep
working) → **Export JSON** → send Shane the file once you're happy with it.
If this whole loop feels like something you'd want to do often, that's the
signal to ask Shane to build the real version — no more Export/send-the-file
step, just instant and shared.

## Setting a client's PromoHunt link

1. Open their page with editing on:
   `.../?welcome=<slug>&key=AMANDA123`
2. Click into the **PromoHunt URL** box and paste their presentation link.
3. Click **Save**, then **Export JSON**, and send that file to Shane so it
   goes live for everyone.

## Starting a new client from scratch

Creating a client's first `?welcome=<slug>` link (and their idea board, if
they're getting one) still needs Shane to set up the underlying file — that
part isn't self-serve yet. Just send him:

- Client's name
- A short slug for their link (e.g. `rojo`, `hank`)
- Their PromoHunt link, if you already have it
- Whether they should get an idea board, and roughly what to focus it on

He can turn it around quickly.

---

## For Shane — quick prompt to spin up a new client

Paste something like this into Claude Code in the `corvid-trading-site` repo:

> Add a new client to the welcome-banner system: name "**Client Name**",
> slug "**slug**", PromoHunt link "**url or blank**". *(If they're getting a
> board:)* Also build them an idea board like `boards/rojo.html`, focused on
> **their goals/verticals**, grounded in **any real details, colors, or
> context you have on them**. Commit and open a PR like last time.
