// ================================================================
// THREE FINAL DRAFTS — the last preview slider.
//
//   ?themes=1        show the picker, then browse the site normally
//   ?theme=<slug>    jump straight into one draft
//
// A pick is remembered in localStorage — on THIS device only. Nothing
// here changes what anyone else sees; with no draft selected the site
// renders exactly as it does live today.
//
// Each draft bakes in the choices already made (kraft type, uniform
// layout, pronounced hand details) — see css/themes.css. Promoting a
// draft to the real design and deleting this machinery is written up
// in README.md and in the corvid-trading skill's design-system.md.
//
// Safe to delete: this file, css/themes.css, and their two tags in
// index.html + boards/rojo.html. Nothing else references them.
// ================================================================
(function () {
  var STORE_KEY = 'corvid-theme';

  // All three drafts share one font set, loaded only when a draft is
  // active so normal visitors never pay for fonts they don't see.
  var FONTS = 'family=Bitter:wght@400;500;600&family=Space+Mono:wght@400;700' +
    '&family=Work+Sans:wght@400;500;600';

  var DRAFTS = [
    {
      slug: '', name: 'Live site', blurb: 'What the site looks like today',
      swatch: 'linear-gradient(135deg,#0a0c12 50%,#6a5cd6 50%)'
    },
    {
      slug: 'kraft-cobalt', name: 'Kraft & Cobalt',
      blurb: 'Paper wins — kraft background, original blue/violet as the ink',
      swatch: 'linear-gradient(135deg,#e8dfd0 50%,#2f4ac2 50%)'
    },
    {
      slug: 'ink-grain', name: 'Ink & Grain',
      blurb: 'Dark wins — original colours exactly, kraft type + grain over them',
      swatch: 'linear-gradient(135deg,#0a0c12 50%,#b48ce6 50%)'
    },
    {
      slug: 'two-tone', name: 'Two-Tone Press',
      blurb: 'Both — kraft body with deep-ink feature sections',
      swatch: 'linear-gradient(135deg,#e8dfd0 50%,#0f1220 50%)'
    }
  ];

  var params = new URLSearchParams(window.location.search);

  function read() {
    try { return localStorage.getItem(STORE_KEY) || ''; } catch (e) { return ''; }
  }
  function write(slug) {
    try { slug ? localStorage.setItem(STORE_KEY, slug) : localStorage.removeItem(STORE_KEY); } catch (e) {}
  }
  function valid(slug) {
    for (var i = 0; i < DRAFTS.length; i++) if (DRAFTS[i].slug === slug) return slug;
    return '';
  }

  function loadFonts() {
    if (document.getElementById('draft-fonts')) return;
    var link = document.createElement('link');
    link.id = 'draft-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?' + FONTS + '&display=swap';
    document.head.appendChild(link);
  }

  function apply(slug) {
    slug = valid(slug);
    if (slug) {
      loadFonts();
      document.documentElement.setAttribute('data-theme', slug);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    return slug;
  }

  // Runs in <head>, NOT deferred, so the draft is set before first paint
  // and the page doesn't flash the live design first.
  var active = apply(params.get('theme') !== null ? params.get('theme') : read());
  if (params.get('theme') !== null) write(active);

  if (params.get('themes') === null) return;

  function mountPicker() {
    var box = document.createElement('div');
    box.className = 'theme-picker';
    box.innerHTML =
      '<button type="button" class="tp-close" aria-label="Collapse the draft picker">✕</button>' +
      '<button type="button" class="tp-reopen">Drafts</button>' +
      '<h4>Three final drafts</h4>' +
      '<p class="tp-note">Previewing on this device only — nothing changes for anyone else. ' +
      'Same fonts, layout and hand-made details in all three; they differ in how ' +
      'the paper and the ink go together.</p>' +
      '<ul>' + DRAFTS.map(function (d) {
        return '<li><button type="button" class="tp-opt" data-slug="' + d.slug + '"' +
          (d.slug === active ? ' aria-current="true"' : '') + '>' +
          '<span class="tp-sw" style="background:' + d.swatch + '"></span>' +
          '<span class="tp-name"><b>' + d.name + '</b><span>' + d.blurb + '</span></span>' +
          '</button></li>';
      }).join('') + '</ul>';
    // on a phone the open panel covers most of the page — start it out of
    // the way, one tap from opening
    if (window.innerWidth < 640) box.classList.add('tp-collapsed');
    document.body.appendChild(box);

    box.addEventListener('click', function (e) {
      if (e.target.closest('.tp-close')) { box.classList.add('tp-collapsed'); return; }
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
