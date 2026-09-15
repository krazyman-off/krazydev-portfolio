// KrazyDev — plugins.js : rend les cartes plugins depuis 4 fichiers YAML
// reliés par l'"id" :
//   organization.yml -> position (order) + colonnes de la grille
//   content.yml      -> tous les textes (FR/EN) + registre des chips
//   attribut.yml     -> conditions : dl / java / rust / maintenu (true/false)
//   color.yml        -> couleurs : card_style, tone + style des badges
// Markdown autorisé dans meta/desc/features : **gras** et *italique*.
// S'adapte à la langue courante et écoute 'krazydev:lang' (i18n.js).
(function () {
  'use strict';

  var YAML = (typeof window !== 'undefined' && window.YAMLlite)
    ? window.YAMLlite
    : { parse: function () { return {}; } };

  var FILES = ['organization.yml', 'content.yml', 'attribut.yml', 'color.yml'];

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

  var state = {
    lang: getLang(),
    data: { organization: {}, content: {}, attribut: {}, color: {} },
    list: []
  };

  function L(o, lang) {
    if (o == null) return '';
    if (typeof o === 'string') return o;
    if (Array.isArray(o)) return o;
    if (o[lang] !== undefined) return o[lang];
    if (o.fr !== undefined) return o.fr;
    return '';
  }

  function buildList() {
    var org = state.data.organization || {};
    var content = state.data.content || {};
    var attrs = state.data.attribut || {};
    var colors = state.data.color || {};
    var chipDefs = content.chips || {};
    var orderMap = org.order || {};

    var list = [];
    Object.keys(content).forEach(function (id) {
      if (id === 'chips') return;
      var item = content[id];
      if (!item || typeof item !== 'object') return;

      item.id = id;
      item.order = (orderMap[id] == null) ? 1e9 : Number(orderMap[id]);

      var att = attrs[id] || {};
      item.dl = att.dl !== false;

      item.chips = [];
      Object.keys(chipDefs).forEach(function (key) {
        var def = chipDefs[key];
        if (!def || typeof def !== 'object') return;
        var ok = att[key] === true;
        item.chips.push({
          icon: ok ? (def.icon_ok || def.icon) : (def.icon_no || def.icon || ''),
          ok: ok,
          label: def.label,
          title: def.title
        });
      });

      var colr = colors[id] || {};
      item.card_style = colr.card_style || '';
      var badgeColors = Array.isArray(colr.badges) ? colr.badges : [];
      item.badges = (Array.isArray(item.badges) ? item.badges : []).map(function (b, idx) {
        var bc = badgeColors[idx] || {};
        return {
          text: b.text,
          tone: bc.tone,
          style: bc.style || ''
        };
      });

      list.push(item);
    });

    list.sort(function (a, b) {
      if (a.order !== b.order) return a.order - b.order;
      return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    });
    return list;
  }

  function chipHTML(c, lang) {
    var mark = c.ok ? '✓' : '✗';
    return '<span class="st-chip ' + (c.ok ? 'st-chip-ok' : 'st-chip-no') + '" title="' +
      esc(L(c.title, lang)) + '"><img src="' + esc(c.icon) + '" alt="' + mark + '"> ' +
      esc(L(c.label, lang)) + '</span>';
  }

  function cardHTML(p, lang) {
    var badges = p.badges.map(function (b) {
      var cls = 'badge';
      if (b.tone && TONE_CLASS[b.tone]) cls += ' ' + TONE_CLASS[b.tone];
      var st = b.style ? ' style="' + esc(b.style) + '"' : '';
      return '<span class="' + cls + '"' + st + '>' + esc(L(b.text, lang)) + '</span>';
    }).join('');
    var badgeCol = badges
      ? '<div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">' + badges + '</div>'
      : '<div></div>';

    var featHtml = L(p.features, lang).map(function (f) {
      return '<span>' + md(f) + '</span>';
    }).join('');

    var stats = (p.stats || []).map(function (st) {
      return '<div class="bench"><b>' + esc(st.value) + '</b><span>' + esc(L(st.label, lang)) + '</span></div>';
    }).join('');

    var chips = p.chips.map(function (c) { return chipHTML(c, lang); }).join('');

    var dlT = p.dl_title || { fr: 'Choisir plateforme & version', en: 'Choose platform & version' };
    var dlBtn = p.dl === false
      ? '<a class="dl-btn disabled" title="' + esc(L({ fr: 'Bientôt disponible', en: 'Coming soon' }, lang)) + '">⬇ Download</a>'
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
    var cols = (state.data.organization && state.data.organization.grid && state.data.organization.grid.columns) || 2;
    grid.style.gridTemplateColumns = 'repeat(' + cols + ',1fr)';
    if (!state.list.length) {
      grid.innerHTML = '<div style="grid-column:1/-1;opacity:.5;font-size:.85rem">Aucun plugin configuré dans content.yml.</div>';
      return;
    }
    grid.innerHTML = state.list.map(function (p) { return cardHTML(p, state.lang); }).join('');
  }

  function load() {
    var grid = document.getElementById('subgrid');
    if (!grid) return;
    grid.innerHTML = '<div style="grid-column:1/-1;opacity:.6;font-size:.85rem">Chargement des plugins…</div>';
    Promise.all(FILES.map(function (f) {
      return fetch(f, { cache: 'no-cache' })
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + f); return r.text(); })
        .then(function (txt) { return YAML.parse(txt); });
    })).then(function (arr) {
      state.data = {
        organization: arr[0] || {},
        content: arr[1] || {},
        attribut: arr[2] || {},
        color: arr[3] || {}
      };
      state.list = buildList();
      render();
    }).catch(function (err) {
      var msg = (err && err.message) || '';
      grid.innerHTML = '<div style="grid-column:1/-1;opacity:.5;font-size:.85rem">Fichier YAML introuvable (' +
        esc(msg) + ') — vérifie ' + FILES.map(esc).join(', ') + ' dans public/.</div>';
    });
  }

  document.addEventListener('krazydev:lang', function (e) {
    if (e.detail && e.detail.lang) state.lang = e.detail.lang;
    render();
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load);
  else load();
})();