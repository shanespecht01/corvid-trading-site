// ================================================================
// EXPERIMENTAL: personalized client welcome banner.
//
// Visiting the site with ?welcome=<slug> in the URL (e.g.
// corvidtrading.co/?welcome=rojo) looks that slug up in
// welcome-clients.json and, if found, reveals the #welcomeBanner
// section with that client's headline, blurb, and up to two link
// buttons (an internal idea board, an external PromoHunt link) — each
// shown only when its field is set. Every other visitor sees nothing.
//
// Add ?key=AMANDA123 (see js/edit-mode.js) to edit this banner's copy
// and links in place. Edits save to this browser only (localStorage)
// with an Export button to hand the JSON back for a real commit.
//
// Safe to delete this whole file. See the comment block above
// #welcomeBanner in index.html for the full removal steps.
// ================================================================
(function () {
  var params = new URLSearchParams(window.location.search);
  var slug = params.get('welcome');
  if (!slug) return;

  var STORE_KEY = 'corvid-welcome-edit:' + slug;

  fetch('js/welcome-clients.json')
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(function (clients) {
      var client = (clients || []).find(function (c) { return c.slug === slug; });
      if (!client) return;

      var section = document.getElementById('welcomeBanner');
      if (!section) return;

      var overlay = (window.CorvidEdit ? window.CorvidEdit.readStore(STORE_KEY) : {});
      var data = Object.assign({
        welcomeHeadline: 'Welcome, ' + client.name + '.',
        welcomeBlurb: "We've updated a few things just for you.",
        boardPath: '',
        promoHuntUrl: ''
      }, client, overlay);

      var headlineEl = document.getElementById('welcomeHeadline');
      var messageEl = document.getElementById('welcomeMessage');
      var boardLink = document.getElementById('welcomeBoardLink');
      var promoLink = document.getElementById('welcomePromoLink');

      function render(d) {
        headlineEl.textContent = d.welcomeHeadline;
        messageEl.textContent = d.welcomeBlurb;
        if (d.boardPath) { boardLink.href = d.boardPath; boardLink.hidden = false; }
        else { boardLink.hidden = true; boardLink.removeAttribute('href'); }
        if (d.promoHuntUrl) { promoLink.href = d.promoHuntUrl; promoLink.hidden = false; }
        else { promoLink.hidden = true; promoLink.removeAttribute('href'); }
      }
      render(data);
      section.hidden = false;

      if (!window.CorvidEdit) return;

      var editToggle = document.createElement('button');
      editToggle.type = 'button';
      editToggle.className = 'edit-toggle welcome-edit-toggle';
      editToggle.textContent = 'Edit';
      section.querySelector('.welcome-in').appendChild(editToggle);

      function enterEditMode() {
        editToggle.hidden = true;
        headlineEl.contentEditable = 'true';
        messageEl.contentEditable = 'true';
        headlineEl.setAttribute('data-editable', 'true');
        messageEl.setAttribute('data-editable', 'true');

        var fields = document.createElement('div');
        fields.className = 'welcome-edit-fields';
        fields.innerHTML =
          '<label>Idea board path<input type="text" data-editable="true" data-field="boardPath" placeholder="boards/slug.html" value="' +
          escapeAttr(data.boardPath) + '"></label>' +
          '<label>PromoHunt URL<input type="text" data-editable="true" data-field="promoHuntUrl" placeholder="https://promohunt.com/..." value="' +
          escapeAttr(data.promoHuntUrl) + '"></label>';
        section.querySelector('.welcome-copy').appendChild(fields);

        var boardInput = fields.querySelector('[data-field="boardPath"]');
        var promoInput = fields.querySelector('[data-field="promoHuntUrl"]');
        function live() {
          render({
            welcomeHeadline: headlineEl.textContent,
            welcomeBlurb: messageEl.textContent,
            boardPath: boardInput.value.trim(),
            promoHuntUrl: promoInput.value.trim()
          });
        }
        [headlineEl, messageEl, boardInput, promoInput].forEach(function (el) {
          el.addEventListener('input', live);
        });

        window.CorvidEdit.mountSaveBar({
          label: 'Editing welcome banner for ' + client.name,
          onSave: function () {
            var next = {
              welcomeHeadline: headlineEl.textContent.trim(),
              welcomeBlurb: messageEl.textContent.trim(),
              boardPath: boardInput.value.trim(),
              promoHuntUrl: promoInput.value.trim()
            };
            window.CorvidEdit.writeStore(STORE_KEY, next);
          },
          onExport: function () {
            var merged = Object.assign({}, client, {
              welcomeHeadline: headlineEl.textContent.trim(),
              welcomeBlurb: messageEl.textContent.trim(),
              boardPath: boardInput.value.trim(),
              promoHuntUrl: promoInput.value.trim()
            });
            window.CorvidEdit.downloadJson('welcome-' + slug + '.json', merged);
          }
        });
      }

      if (window.CorvidEdit.isUnlocked()) {
        enterEditMode();
      } else {
        editToggle.addEventListener('click', function () {
          if (window.CorvidEdit.promptUnlock()) enterEditMode();
        });
      }
    })
    .catch(function () { /* fail silently — banner just stays hidden */ });

  function escapeAttr(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }
})();
