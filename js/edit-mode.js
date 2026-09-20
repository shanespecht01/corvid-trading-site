// ================================================================
// EXPERIMENTAL: shared edit-mode unlock for Amanda.
//
// Used by welcome.js (banner copy) and boards/board.js (idea boards).
// Unlock with ?key=AMANDA123 in the URL, or the on-page "Edit" button
// (which prompts for the key). This is a CONVENIENCE toggle so Amanda
// doesn't need a coding tool to tweak copy/prices — it is NOT security.
// The key is public (it's in this file, in the repo). Never gate
// anything sensitive behind it.
//
// Safe to delete: only welcome.js and boards/board.js import it.
// ================================================================
(function (global) {
  var KEY = 'AMANDA123';
  var FLAG = 'corvid_edit_unlocked';

  function isUnlocked() {
    try {
      var params = new URLSearchParams(window.location.search);
      if (params.get('key') === KEY) {
        sessionStorage.setItem(FLAG, '1');
        return true;
      }
      return sessionStorage.getItem(FLAG) === '1';
    } catch (e) {
      return false;
    }
  }

  function promptUnlock() {
    var entered = window.prompt('Edit key (ask Shane if you lost it):');
    if (entered === KEY) {
      try { sessionStorage.setItem(FLAG, '1'); } catch (e) {}
      return true;
    }
    if (entered !== null) window.alert("That key didn't match — no changes unlocked.");
    return false;
  }

  function lock() {
    try { sessionStorage.removeItem(FLAG); } catch (e) {}
  }

  function readStore(storeKey) {
    try {
      var raw = localStorage.getItem(storeKey);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function writeStore(storeKey, data) {
    try {
      localStorage.setItem(storeKey, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  // Small fixed bottom bar shown while a page is in edit mode.
  // opts: { label, onSave, onExport }
  function mountSaveBar(opts) {
    var bar = document.createElement('div');
    bar.className = 'edit-savebar';
    bar.innerHTML =
      '<span class="edit-savebar-label">' + (opts.label || 'Editing') +
      ' — saved on this device only</span>' +
      '<span class="edit-savebar-actions">' +
      '<button type="button" class="btn btn-ghost" data-act="export">Export JSON</button>' +
      '<button type="button" class="btn btn-primary" data-act="save">Save</button>' +
      '<button type="button" class="btn btn-ghost" data-act="lock">Done</button>' +
      '</span>';
    document.body.appendChild(bar);
    bar.addEventListener('click', function (e) {
      var act = e.target && e.target.getAttribute('data-act');
      if (!act) return;
      if (act === 'save' && opts.onSave) { opts.onSave(); flash(bar, 'Saved.'); }
      if (act === 'export' && opts.onExport) opts.onExport();
      if (act === 'lock') { lock(); location.reload(); }
    });
    return bar;
  }

  function flash(bar, msg) {
    var label = bar.querySelector('.edit-savebar-label');
    var prev = label.textContent;
    label.textContent = msg;
    setTimeout(function () { label.textContent = prev; }, 1400);
  }

  function downloadJson(filename, obj) {
    var blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  global.CorvidEdit = {
    isUnlocked: isUnlocked,
    promptUnlock: promptUnlock,
    lock: lock,
    readStore: readStore,
    writeStore: writeStore,
    mountSaveBar: mountSaveBar,
    downloadJson: downloadJson
  };
})(window);
