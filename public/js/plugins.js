// KrazyDev — plugins.js : rend les cartes plugins depuis plugins.yml.
// L'ordre vient du champ "order" (1 = haut gauche, 2 = haut droite...).
// Markdown autorisé dans desc/meta/features : **gras** et *italique*.
// S'adapte à la langue courante (localStorage 'krazydev_lang' ou détection)
// et écoute l'événement 'krazydev:lang' déclenché par i18n.js.
(function () {
  'use strict';

  var YAML = (typeof window !== 'undefined' && window.YAMLlite)
    ? window.YAMLlite
    : { parse: function () { return {}; } };

  var TONE_CLASS = {
    dev: 'badge-dev',
    stable: 'badge-public',
    public: 'badge-public',
    maintenu: 'badge-maintenu',
    stress: 'badge-stress'
  };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function md(s) {
    s = esc(s);
    s = s.replace(/\*\*([\s\S]+?)\*\*/g, function (m, t) { return '<b>' + t + '</b>'; });
    s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, function (m, p, t) { return p + '<i>' + t + '</i>'; });
    return s;
  }

  function getLang() {
    var h = document.documentElement && document.documentElement.lang;
    if (h === 'en') return 'en';
    if (h === 'fr') return 'fr';
    try {
      var l = localStorage.getItem('krazydev_lang');
      if (l === 'en' || l === 'fr') return l;
    } catch (e) {}
    var langs = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || 'fr'];
    for (var i = 0; i < langs.length; i++) {
      if (/^en(-|_|$)/i.test(langs[i])) return 'en';
    }
    return 'fr';
  }

  var state = { lang: getLang(), cfg: null, list: [] };

  function L(o, lang) {
    if (o == null) return '';
    if (typeof o === 'string') return o;
    if (Array.isArray(o)) return o;
    if (o[lang] !== undefined) return o[lang];
    if (o.fr !== undefined) return o.fr;
    return '';
  }

  function badgeHTML(b, lang) {
    var cls = 'badge';
    if (b.tone && TONE_CLASS[b.tone]) cls += ' ' + TONE_CLASS[b.tone];
    var st = b.style ? ' style="' + esc(b.style) + '"' : '';
    return '<span class="' + cls + '"' + st + '>' + esc(L(b.text, lang)) + '</span>';
  }

  function cardHTML(p, lang) {
    var badges = (p.badges && p.badges.length)
      ? p.badges.map(function (b) { return badgeHTML(b, lang); }).join('')
      : '';
    var badgeCol = p.badges && p.badges.length
      ? '<div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">' + badges + '</div>'
      : '<div></div>';

    var features = L(p.features, lang);
    var featHtml = (features || []).map(function (f) {
      return '<span>' + md(f) + '</span>';
    }).join('');

    var stats = (p.stats || []).map(function (st) {
      return '<div class="bench"><b>' + esc(st.value) + '</b><span>' + esc(L(st.label, lang)) + '</span></div>';
    }).join('');

    var chips = (p.chips || []).map(function (c) {
      var mark = c.ok ? '✓' : '✗';
      return '<span class="st-chip ' + (c.ok ? 'st-chip-ok' : 'st-chip-no') + '" title="' +
        esc(L(c.title, lang)) + '"><img src="' + esc(c.icon) + '" alt="' + mark + '"> ' +
        esc(L(c.label, lang)) + '</span>';
    }).join('');

    var dlT = p.dl_title || { fr: 'Choisir plateforme & version', en: 'Choose platform & version' };
    var dlBtn = p.dl === false
      ? '<a class="dl-btn disabled" title="' + esc((p.dl_title_disabled || { fr: 'Bientôt disponible', en: 'Coming soon' })[lang]) + '">⬇ Download</a>'
      : '<a class="dl-btn" title="' + esc(L(dlT, lang)) + '">⬇ Download</a>';

    var cardStyle = 'padding:20px' + (p.card_style ? ';' + p.card_style : '');

    return '<div class="card" style="' + esc(cardStyle) + '">' +
      '<div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start">' +
        '<div>' +
          '<h3 style="font-size:1.05rem;display:flex;align-items:center;gap:10px"><img src="' + esc(p.icon) + '" alt="' + esc(p.name) + '" class="plg-ico">' + esc(p.name) + '</h3>' +
          '<div class="meta" style="font-size:.78rem;margin-top:4px">' + md(L(p.meta, lang)) + '</div>' +
        '</div>' +
        badgeCol +
      '</div>' +
      '<p style="opacity:.72;font-size:.88rem;margin-top:10px;line-height:1.55">' + md(L(p.desc, lang)) + '</p>' +
      (featHtml ? '<div style="margin-top:12px;display:flex;flex-direction:column;gap:6px;font-size:.82rem;opacity:.85">' + featHtml + '</div>' : '') +
      (stats ? '<div class="bench-grid">' + stats + '</div>' : '') +
      (chips ? '<div class="st-chips">' + chips + '</div>' : '') +
      '<div class="dl-wrap">' + dlBtn +
        '<span style="font-family:\'JetBrains Mono\',monospace;font-size:.72rem;opacity:.5">' + esc(L(p.update, lang)) + '</span>' +
      '</div>' +
    '</div>';
  }

  function render() {
    var grid = document.getElementById('subgrid');
    if (!grid) return;
    var cols = (state.cfg && state.cfg.grid && state.cfg.grid.columns) || 2;
    grid.style.gridTemplateColumns = 'repeat(' + cols + ',1fr)';
    if (!state.list.length) {
      grid.innerHTML = '<div style="grid-column:1/-1;opacity:.5;font-size:.85rem">Aucun plugin configuré dans plugins.yml.</div>';
      return;
    }
    grid.innerHTML = state.list.map(function (p) { return cardHTML(p, state.lang); }).join('');
  }

  function load() {
    var grid = document.getElementById('subgrid');
    if (!grid) return;
    grid.innerHTML = '<div style="grid-column:1/-1;opacity:.6;font-size:.85rem">Chargement des plugins…</div>';
    fetch('plugins.yml', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
      .then(function (txt) {
        var cfg = YAML.parse(txt);
        state.cfg = cfg;
        state.list = (cfg.plugins || []).slice().sort(function (a, b) {
          var oa = a.order == null ? 1e9 : Number(a.order);
          var ob = b.order == null ? 1e9 : Number(b.order);
          return oa - ob;
        });
        render();
      })
      .catch(function () {
        grid.innerHTML = '<div style="grid-column:1/-1;opacity:.5;font-size:.85rem">plugins.yml introuvable — ajoute le fichier à côté de projets.html.</div>';
      });
  }

  document.addEventListener('krazydev:lang', function (e) {
    if (e.detail && e.detail.lang) state.lang = e.detail.lang;
    render();
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load);
  else load();
})();