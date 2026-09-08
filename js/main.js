// mobile nav
  var t = document.getElementById('navToggle'), nl = document.getElementById('navlinks');
  if(t){ t.addEventListener('click', function(){
    var open = nl.classList.toggle('open');
    t.setAttribute('aria-expanded', open ? 'true':'false');
  });
  nl.addEventListener('click', function(e){ if(e.target.tagName==='A'){ nl.classList.remove('open'); t.setAttribute('aria-expanded','false'); }});
  }

  // scroll reveal
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }});
  }, {threshold:.12, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  // reduced-motion flag (used by the form + honored by the CSS twinkle)
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // quote form  (paste your endpoint into FORM_ENDPOINT to go live — see launch checklist)
  var FORM_ENDPOINT = "";
  var form = document.getElementById('quoteForm'), ok = document.getElementById('formSuccess');
  function setMsg(t){ ok.textContent = t; ok.classList.add('show'); ok.scrollIntoView({behavior: reduce ? 'auto':'smooth', block:'center'}); }
  if(form){ form.addEventListener('submit', function(e){
    e.preventDefault();
    var hp = form.querySelector('.hp');
    if(hp && hp.value){ return; } // spam trap
    if(!form.name.value.trim() || !form.email.value.trim()){ setMsg('Please add your name and email so we can reach you.'); return; }
    var first = (form.name.value.trim().split(' ')[0]) || 'there';
    if(!FORM_ENDPOINT){
      setMsg('Thanks, ' + first + " \u2014 your request looks good. (Preview mode: connect a form endpoint to start receiving these. See the launch checklist.)");
      form.reset(); return;
    }
    var btn = form.querySelector('button[type=submit]'), label = btn.textContent;
    btn.textContent = 'Sending\u2026'; btn.disabled = true;
    fetch(FORM_ENDPOINT, {method:'POST', headers:{'Accept':'application/json'}, body:new FormData(form)})
      .then(function(r){
        if(r.ok){ setMsg('Thanks, ' + first + " \u2014 your request is in. We'll get back to you within a business day."); form.reset(); }
        else { setMsg("Something went wrong sending that \u2014 email us at hello@corvidtrading.co and we'll jump on it."); }
      })
      .catch(function(){ setMsg("Something went wrong sending that \u2014 email us at hello@corvidtrading.co and we'll jump on it."); })
      .finally(function(){ btn.textContent = label; btn.disabled = false; });
  }); }
