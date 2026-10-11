// KrazyDev — Servers : sélecteur Minecraft / Roblox
// CSP-safe (aucun handler inline) + deep-link via #minecraft / #roblox
(function () {
  'use strict';

  var VALID = { minecraft: 'minecraft', roblox: 'roblox' };

  function tabs() {
    return Array.prototype.slice.call(document.querySelectorAll('[data-srv-tab]'));
  }
  function panels() {
    return Array.prototype.slice.call(document.querySelectorAll('[data-srv-panel]'));
  }

  var LS = 'krazydev_srv';

  function stored() {
    try {
      var v = localStorage.getItem(LS);
      return VALID[v] ? v : null;
    } catch (e) { return null; }
  }

  function currentFromHash() {
    var h = (location.hash || '').replace('#', '').toLowerCase();
    return VALID[h] ? h : null;
  }

  function show(name, syncHash) {
    if (!VALID[name]) name = 'minecraft';
    tabs().forEach(function (t) {
      var active = t.getAttribute('data-srv-tab') === name;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    panels().forEach(function (p) {
      p.hidden = p.getAttribute('data-srv-panel') !== name;
    });
    if (syncHash !== false) {
      try {
        history.replaceState(null, '', 'servers.html#' + name);
      } catch (e) {}
      try { localStorage.setItem(LS, name); } catch (e) {}
    }
  }

  function init() {
    var list = tabs();
    if (!list.length) return;
    list.forEach(function (t) {
      t.addEventListener('click', function () {
        show(t.getAttribute('data-srv-tab'));
        // remet l'onglet visible si l'utilisateur avait scrollé plus bas
        var gf = document.querySelector('.game-filter');
        if (gf) {
          var r = gf.getBoundingClientRect();
          if (r.top < 0 || r.bottom > innerHeight) {
            try { gf.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) {}
          }
        }
      });
    });
    // clavier : pattern ARIA tabs (flèches + Home/End)
    var bar = document.querySelector('.game-filter');
    if (bar) {
      bar.addEventListener('keydown', function (e) {
        var cur = list.indexOf(document.activeElement);
        if (cur === -1) return;
        var next = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (cur + 1) % list.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (cur - 1 + list.length) % list.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = list.length - 1;
        if (next !== null) {
          e.preventDefault();
          list[next].focus();
          show(list[next].getAttribute('data-srv-tab'));
        }
      });
    }
    addEventListener('hashchange', function () {
      var h = currentFromHash();
      if (h) show(h, false);
    });
    // priorité : hash > dernier onglet mémorisé > minecraft
    show(currentFromHash() || stored() || 'minecraft', false);

    // FAQ : accordéon exclusif (une seule réponse ouverte)
    Array.prototype.forEach.call(document.querySelectorAll('.srv-faq'), function (d) {
      d.addEventListener('toggle', function () {
        if (d.open) {
          Array.prototype.forEach.call(document.querySelectorAll('.srv-faq'), function (o) {
            if (o !== d && o.open) o.removeAttribute('open');
          });
        }
      });
    });

    // bouton copier l'IP (feedback localisé, restauration auto)
    Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'), function (btn) {
      btn.addEventListener('click', function () {
        var val = btn.getAttribute('data-copy') || '';
        var okLabel = document.documentElement.lang === 'en' ? 'Copied ✓' : 'Copié ✓';
        var done = function () {
          btn.innerHTML = okLabel;
          // sélectionne aussi le texte de l'IP (CTRL+C manuel possible)
          try {
            var code = document.getElementById('srv-ip-addr');
            if (code) {
              var range = document.createRange();
              range.selectNodeContents(code);
              var sel = window.getSelection();
              if (sel) { sel.removeAllRanges(); sel.addRange(range); }
            }
          } catch (e) {}
          setTimeout(function () {
            btn.innerHTML = document.documentElement.lang === 'en' ? 'Copy IP' : "Copier l'IP";
          }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(val).then(done, function () { fallbackCopy(val, done); });
        } else {
          fallbackCopy(val, done);
        }
      });
    });
  }

  function fallbackCopy(val, done) {
    try {
      var ta = document.createElement('textarea');
      ta.value = val;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    } catch (e) {}
    done();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
