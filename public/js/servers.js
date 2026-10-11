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
      });
    });
    addEventListener('hashchange', function () {
      var h = currentFromHash();
      if (h) show(h, false);
    });
    // priorité : hash > dernier onglet mémorisé > minecraft
    show(currentFromHash() || stored() || 'minecraft', false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
