// ================================================================
// Client idea board — shared render engine for every boards/<slug>.html.
// Reads window.BOARD_DATA (set by boards/<slug>.data.js), renders the
// page, overlays any saved localStorage edits, and — when unlocked via
// js/edit-mode.js — lets Amanda edit notes/item#s/prices in place.
//
// To add a new client's board: copy boards/rojo.html, point its
// <script src> at a new boards/<slug>.data.js with the same shape,
// done. See README.md "Client idea boards" for the full walkthrough.
// ================================================================
(function () {
  var DATA = window.BOARD_DATA;
  if (!DATA) return;

  var ICONS = {
    apparel: '<path d="M8 3l4 3 4-3 4 3-2 4-2-1v11H8V9L6 10 4 6z"/>',
    headwear: '<path d="M4 15a8 8 0 0116 0z"/><path d="M12 7a8 8 0 018 8M12 7V4"/>',
    drinkware: '<path d="M8 3h8l-1 17a1 1 0 01-1 1h-4a1 1 0 01-1-1z"/><path d="M8 8h8"/>',
    bags: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 016 0v2"/>',
    tech: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M12 8l-2 4h4l-2 4"/>',
    outerwear: '<path d="M8 3l4 3 4-3 3 3-2 3v11h-4V12h-2v8H8V9L6 6z"/>',
    event: '<path d="M6 21V3M6 4h11l-2 3 2 3H6"/>',
    gifts: '<path d="M4 9h16v11H4z"/><path d="M4 9l2-4h12l2 4M12 5v15"/>',
    accessory: '<rect x="4" y="9" width="16" height="6" rx="3"/><path d="M9 9v6M15 9v6"/>'
  };

  var STORE_KEY = 'corvid-board-edit:' + DATA.slug;
  var overlay = (window.CorvidEdit ? window.CorvidEdit.readStore(STORE_KEY) : {}); // { [productId]: {itemNumber, yourPrice, note} }

  document.title = DATA.client.name + ' — Idea Board — Corvid Trading Co.';

  var root = document.getElementById('board-root');
  root.innerHTML = buildShell(DATA);

  // fill in per-product note/item#/price from data + overlay (kept out of
  // the innerHTML template so pasted/edited text never becomes markup)
  DATA.sections.forEach(function (section) {
    section.products.forEach(function (p) {
      var ov = overlay[p.id] || {};
      var noteEl = root.querySelector('[data-note="' + p.id + '"]');
      noteEl.textContent = ov.note != null ? ov.note : p.note;
      var itemEl = root.querySelector('[data-item="' + p.id + '"]');
      itemEl.value = ov.itemNumber != null ? ov.itemNumber : (p.itemNumber || '');
      var priceEl = root.querySelector('[data-price="' + p.id + '"]');
      priceEl.value = ov.yourPrice != null ? ov.yourPrice : (p.yourPrice || '');
    });
  });

  wireCalculator();
  wireEditMode();

  // ---- builders -------------------------------------------------

  function buildShell(data) {
    return (
      '<nav class="board-nav"><div class="wrap">' +
        '<a class="back" href="../index.html"><img class="mark" src="../assets/feather-mark.svg" alt="" aria-hidden="true">Corvid Trading Co.</a>' +
        '<span class="tag">Idea board · not a quote</span>' +
      '</div></nav>' +
      '<header class="board-cover wrap">' +
        '<div class="mini-feather"><img src="../assets/feather-mark.svg" alt="" class="mark"></div>' +
        '<span class="eyebrow">Prepared for</span>' +
        '<h1>' + esc(data.client.name) + '</h1>' +
        '<p class="focus">' + esc(data.client.focus) + '</p>' +
        '<p class="prepared">Prepared by Corvid Trading Co. — ' + esc(data.client.preparedDate) + '</p>' +
      '</header>' +
      data.sections.map(buildSection).join('') +
      buildCalculator(data) +
      buildSteps() +
      buildDisclaimer()
    );
  }

  function buildSection(section) {
    return (
      '<section class="board-section wrap" id="' + esc(section.id) + '">' +
        '<div class="sec-head reveal-none">' +
          '<span class="eyebrow">' + esc(section.title) + '</span>' +
          '<h2>' + esc(section.title) + '</h2>' +
          '<p>' + esc(section.blurb) + '</p>' +
        '</div>' +
        '<div class="board-grid">' + section.products.map(buildCard).join('') + '</div>' +
      '</section>'
    );
  }

  function buildCard(p) {
    var icon = ICONS[p.family] || ICONS.gifts;
    var colorNames = p.colors || [];
    var swatches = colorNames.map(function (name) {
      var hex = colorHex(name);
      return '<span class="pc-swatch" style="background:' + hex + '" title="' + esc(name) + '"></span>';
    }).join('');
    var chips = (p.uses || []).map(function (u) { return '<span class="chip">' + esc(u) + '</span>'; }).join('');
    return (
      '<article class="card pcard">' +
        '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">' + icon + '</svg>' +
        '<h3>' + esc(p.name) + '</h3>' +
        '<p class="pc-note" data-note="' + esc(p.id) + '"></p>' +
        '<div class="pc-meta"><span class="deco">' + esc(p.decoration) + '</span><span class="pc-swatches">' + swatches + '</span></div>' +
        '<div class="pc-uses">' + chips + '</div>' +
        '<div class="spec-ticket">' +
          '<div class="row"><span class="lbl">Est. cost</span><span class="val">' + money(p.estCost) + '</span></div>' +
          '<div class="row"><span class="lbl">Est. retail</span><span class="val">' + money(p.estRetail) + '</span></div>' +
          '<div class="row"><span class="lbl">Item #</span><input type="text" placeholder="from PromoHunt" data-item="' + esc(p.id) + '"></div>' +
          '<div class="row"><span class="lbl">Your price</span><input type="text" placeholder="$" data-price="' + esc(p.id) + '"></div>' +
          '<span class="estimate-note">Estimate only — not a quote</span>' +
          '<div class="search-hint">Search PromoHunt: <b>“' + esc(p.searchTerm) + '”</b></div>' +
        '</div>' +
      '</article>'
    );
  }

  function buildCalculator(data) {
    var d = data.calculatorDefaults || { cost: 0, sell: 0, qty: 0 };
    return (
      '<section class="board-calc"><div class="wrap">' +
        '<div class="sec-head"><span class="eyebrow">Fundraiser math</span><h2>What a run of these nets you.</h2>' +
          '<p>Plug in real numbers once PromoHunt confirms pricing — these start with the can cooler estimate above.</p></div>' +
        '<div class="calc-box">' +
          '<div class="calc-field"><label>Your cost ($)</label><input type="number" step="0.01" id="calcCost" value="' + d.cost + '"></div>' +
          '<div class="calc-field"><label>Sell price ($)</label><input type="number" step="0.01" id="calcSell" value="' + d.sell + '"></div>' +
          '<div class="calc-field"><label>Quantity</label><input type="number" step="1" id="calcQty" value="' + d.qty + '"></div>' +
          '<div class="calc-result"><div class="cr-margin" id="calcMargin">0%</div><div class="cr-total" id="calcTotal">$0 total margin</div></div>' +
        '</div>' +
      '</div></section>'
    );
  }

  function buildSteps() {
    var steps = [
      ['Pick your favorites', 'Star or note whichever items on this board fit — no commitment yet.'],
      ['Amanda pulls real pricing', 'She confirms cost, minimums, and lead time in PromoHunt for the exact items and quantities.'],
      ['We proof it', 'Logo placement, colors, and imprint method get approved before anything is produced.'],
      ['You approve & we order', 'Once it looks right, we place the order and keep you posted on turnaround.']
    ];
    return (
      '<section class="board-steps"><div class="wrap">' +
        '<div class="sec-head"><span class="eyebrow">How this becomes a real quote</span><h2>Four steps, no surprises.</h2></div>' +
        '<div class="steps">' + steps.map(function (s, i) {
          return '<div class="step"><div class="n">0' + (i + 1) + '</div><h3>' + esc(s[0]) + '</h3><p>' + esc(s[1]) + '</p></div>';
        }).join('') + '</div>' +
      '</div></section>'
    );
  }

  function buildDisclaimer() {
    return (
      '<section class="board-disclaimer"><div class="wrap">' +
        '<p><strong>This board is a planning tool, not a quote.</strong> Every cost and retail figure above is an estimate ' +
        'for budgeting purposes only. Final pricing, minimums, decoration cost, and availability are confirmed by Amanda ' +
        'in PromoHunt before anything is produced or ordered.</p>' +
        '<div class="board-edit-row"><button type="button" class="edit-toggle" id="boardEditToggle">Edit this board</button></div>' +
      '</div></section>'
    );
  }

  // ---- calculator -------------------------------------------------

  function wireCalculator() {
    var cost = document.getElementById('calcCost');
    var sell = document.getElementById('calcSell');
    var qty = document.getElementById('calcQty');
    var marginEl = document.getElementById('calcMargin');
    var totalEl = document.getElementById('calcTotal');
    function update() {
      var c = parseFloat(cost.value) || 0;
      var s = parseFloat(sell.value) || 0;
      var q = parseFloat(qty.value) || 0;
      var margin = s > 0 ? ((s - c) / s) * 100 : 0;
      var total = (s - c) * q;
      marginEl.textContent = Math.round(margin) + '%';
      totalEl.textContent = money(total) + ' total margin on ' + q + ' units';
    }
    [cost, sell, qty].forEach(function (el) { el.addEventListener('input', update); });
    update();
  }

  // ---- edit mode -------------------------------------------------

  function wireEditMode() {
    if (!window.CorvidEdit) return;
    var toggle = document.getElementById('boardEditToggle');

    function collectOverlay() {
      var next = {};
      DATA.sections.forEach(function (section) {
        section.products.forEach(function (p) {
          var noteEl = root.querySelector('[data-note="' + p.id + '"]');
          var itemEl = root.querySelector('[data-item="' + p.id + '"]');
          var priceEl = root.querySelector('[data-price="' + p.id + '"]');
          next[p.id] = {
            note: noteEl.textContent.trim(),
            itemNumber: itemEl.value.trim(),
            yourPrice: priceEl.value.trim()
          };
        });
      });
      return next;
    }

    function enterEditMode() {
      toggle.hidden = true;
      root.querySelectorAll('.pc-note').forEach(function (el) {
        el.contentEditable = 'true';
        el.setAttribute('data-editable', 'true');
      });
      root.querySelectorAll('.spec-ticket input').forEach(function (el) {
        el.setAttribute('data-editable', 'true');
      });

      window.CorvidEdit.mountSaveBar({
        label: 'Editing ' + DATA.client.name + '’s board',
        onSave: function () {
          window.CorvidEdit.writeStore(STORE_KEY, collectOverlay());
        },
        onExport: function () {
          var exportData = JSON.parse(JSON.stringify(DATA));
          var edits = collectOverlay();
          exportData.sections.forEach(function (section) {
            section.products.forEach(function (p) {
              var e = edits[p.id];
              if (!e) return;
              p.note = e.note;
              p.itemNumber = e.itemNumber;
              p.yourPrice = e.yourPrice;
            });
          });
          window.CorvidEdit.downloadJson(DATA.slug + '-board.json', exportData);
        }
      });
    }

    if (window.CorvidEdit.isUnlocked()) {
      enterEditMode();
    } else {
      toggle.addEventListener('click', function () {
        if (window.CorvidEdit.promptUnlock()) enterEditMode();
      });
    }
  }

  // ---- helpers -------------------------------------------------

  function money(n) {
    n = Number(n) || 0;
    return '$' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function colorHex(name) {
    var match = (DATA.client.brandColors || []).find(function (c) { return c.name === name; });
    return match ? match.hex : '#8ea2e6';
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
})();
