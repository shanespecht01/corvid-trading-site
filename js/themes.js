// ================================================================
// THEME EXPLORATIONS — lets Amanda preview alternate looks for the
// site and pick one, without anything being committed yet.
//
//   ?themes=1          show the picker (then browse the site normally)
//   ?theme=<slug>      jump straight into one theme
//
// A picked theme is remembered in localStorage — on THIS device only.
// Nothing here changes what anyone else sees; making a theme the real
// default is a code change (see README "Theme explorations").
//
// Safe to delete: this file, css/themes.css, and their two tags in
// index.html + boards/*.html. Nothing else references them.
// ================================================================
(function () {
  var STORE_KEY = 'corvid-theme';

  // Fonts are loaded ONLY when a theme that needs them is active, so
  // normal visitors never pay for fonts they don't see.
  var THEMES = [
    {
      slug: '', name: 'Original', blurb: 'What the site looks like today',
      swatch: 'linear-gradient(115deg,#3b5bd9,#6a5cd6 45%,#b48ce6)', fonts: null
    },
    {
      slug: 'sea-glass', name: 'Sea Glass', blurb: 'Light, tumbled glass, warm sand',
      swatch: 'linear-gradient(115deg,#2f7d6e,#5aa88d 45%,#d79a54)',
      fonts: 'family=Karla:wght@400;500;600;700'
    },
    {
      slug: 'nest-kraft', name: 'Nest & Kraft', blurb: 'Paper, twig, rust, brass',
      swatch: 'linear-gradient(115deg,#5a6b3f,#a8482a 55%,#b8862f)',
      fonts: 'family=Bitter:wght@400;500;600&family=Space+Mono:wght@400;700&family=Work+Sans:wght@400;500;600'
    },
    {
      slug: 'studio-daylight', name: 'Studio Daylight', blurb: 'Bright editorial lookbook',
      swatch: 'linear-gradient(115deg,#5b3fd6,#7c4fe0 50%,#b48ce6)',
      fonts: 'family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700'
    },
    {
      slug: 'oil-slick', name: 'Oil Slick', blurb: 'Dark plum, glassy pebbles',
      swatch: 'linear-gradient(115deg,#3fb0c9,#7b3fd4 40%,#d95f9a 74%,#f0c36a)', fonts: null
    },
    {
      slug: 'ink-brass', name: 'Ink & Brass', blurb: 'Letterpress, warm black, brass',
      swatch: 'linear-gradient(115deg,#a8532a,#c08a34 45%,#e0bb6a)',
      fonts: 'family=Zilla+Slab:wght@400;500;600&family=Space+Mono:wght@400;700&family=Karla:wght@400;500;600'
    },
    {
      slug: 'night-market', name: 'Night Market', blurb: 'Charcoal green, candlelit gold',
      swatch: 'linear-gradient(115deg,#3f8f6a,#d2803c 55%,#edc57a)',
      fonts: 'family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600'
    }
  ];

  var params = new URLSearchParams(window.location.search);

  function read() {
    try { return localStorage.getItem(STORE_KEY) || ''; } catch (e) { return ''; }
  }
  function write(slug) {
    try { slug ? localStorage.setItem(STORE_KEY, slug) : localStorage.removeItem(STORE_KEY); } catch (e) {}
  }
  function find(slug) {
    for (var i = 0; i < THEMES.length; i++) if (THEMES[i].slug === slug) return THEMES[i];
    return null;
  }

  function loadFonts(theme) {
    if (!theme || !theme.fonts) return;
    var id = 'theme-fonts-' + theme.slug;
    if (document.getElementById(id)) return;
    var link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?' + theme.fonts + '&display=swap';
    document.head.appendChild(link);
  }

  function apply(slug) {
    var theme = find(slug);
    if (!theme) { slug = ''; theme = THEMES[0]; }
    loadFonts(theme);
    if (slug) document.documentElement.setAttribute('data-theme', slug);
    else document.documentElement.removeAttribute('data-theme');
    return slug;
  }

  // Apply as early as possible — this script is NOT deferred so the
  // theme is set before first paint and the page doesn't flash.
  var active = apply(params.get('theme') !== null ? params.get('theme') : read());
  if (params.get('theme') !== null) write(active);

  if (params.get('themes') === null) return;

  // ---- picker UI (only with ?themes=1) ----
  function mountPicker() {
    var box = document.createElement('div');
    box.className = 'theme-picker';
    box.innerHTML =
      '<button type="button" class="tp-close" aria-label="Collapse theme picker">✕</button>' +
      '<button type="button" class="tp-reopen">Themes</button>' +
      '<h4>Try a look</h4>' +
      '<p class="tp-note">Previewing on this device only — nothing changes for anyone else. ' +
      'Tell Shane which one you like and he’ll make it real.</p>' +
      '<ul>' + THEMES.map(function (t) {
        return '<li><button type="button" class="tp-opt" data-slug="' + t.slug + '"' +
          (t.slug === active ? ' aria-current="true"' : '') + '>' +
          '<span class="tp-sw" style="background:' + t.swatch + '"></span>' +
          '<span class="tp-name"><b>' + t.name + '</b><span>' + t.blurb + '</span></span>' +
          '</button></li>';
      }).join('') + '</ul>';
    // on a phone the open panel covers most of the page — start it out of
    // the way, one tap from opening
    if (window.innerWidth < 640) box.classList.add('tp-collapsed');
    document.body.appendChild(box);

    box.addEventListener('click', function (e) {
      var close = e.target.closest('.tp-close');
      if (close) { box.classList.add('tp-collapsed'); return; }
      if (e.target.closest('.tp-reopen')) { box.classList.remove('tp-collapsed'); return; }
      var opt = e.target.closest('.tp-opt');
      if (!opt) return;
      active = apply(opt.getAttribute('data-slug'));
      write(active);
      box.querySelectorAll('.tp-opt').forEach(function (b) {
        if (b.getAttribute('data-slug') === active) b.setAttribute('aria-current', 'true');
        else b.removeAttribute('aria-current');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountPicker);
  } else {
    mountPicker();
  }
})();
