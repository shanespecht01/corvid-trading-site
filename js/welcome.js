// ================================================================
// EXPERIMENTAL: personalized client welcome banner.
//
// Visiting the site with ?welcome=<slug> in the URL (e.g.
// corvidtrading.co/?welcome=hank) looks that slug up in
// welcome-clients.json and, if found, reveals the #welcomeBanner
// section with that client's name and a link to their order options.
// Every other visitor sees nothing — the section stays hidden.
//
// Safe to delete this whole file. See the comment block above
// #welcomeBanner in index.html for the full removal steps.
// ================================================================
(function () {
  var params = new URLSearchParams(window.location.search);
  var slug = params.get('welcome');
  if (!slug) return;

  fetch('js/welcome-clients.json')
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(function (clients) {
      var client = (clients || []).find(function (c) { return c.slug === slug; });
      if (!client) return;

      var section = document.getElementById('welcomeBanner');
      if (!section) return;

      document.getElementById('welcomeName').textContent = client.name;
      if (client.message) document.getElementById('welcomeMessage').textContent = client.message;

      var cta = document.getElementById('welcomeCta');
      cta.href = client.presentationUrl;
      if (client.ctaLabel) cta.textContent = client.ctaLabel;

      section.hidden = false;
    })
    .catch(function () { /* fail silently — banner just stays hidden */ });
})();
