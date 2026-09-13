(function () {
  'use strict';

  var CONFIG = {
    'KM-AC': {
      ico: 'emojis/km-ac.png',
      builds: {
        velocity: { file: 'KMAC-Velocity-1.0.0-DEV.jar', bytes: 5353019, channel: 'DEV' },
        bukkit: { file: 'KMAC-Bukkit-1.0.0-DEV.jar', bytes: 12483649, channel: 'DEV' }
      }
    },
    'KM-RiotOps': {
      ico: 'emojis/km-riotops.png',
      builds: {
        velocity: { file: 'KM-RiotOps-Velocity-1.0.0-DEV.jar', bytes: 356698, channel: 'DEV' },
        bukkit: { file: 'KM-RiotOps-Bukkit-1.0.0-DEV.jar', bytes: 167254, channel: 'DEV' }
      }
    },
    'KM-AntiBots': {
      ico: 'emojis/km-antibots.png',
      builds: {
        velocity: { file: 'KM-AntiBots-Velocity-1.0.0-DEV.jar', bytes: 873822, channel: 'DEV' },
        bukkit: { file: 'KM-AntiBots-Bukkit-1.0.0-DEV.jar', bytes: 6942, channel: 'DEV' }
      }
    },
    'KM-Maintenance': {
      ico: 'emojis/km-maintenance.png',
      builds: {
        velocity: { file: 'KM-Maintenance-Velocity-1.0.0-STABLE.jar', bytes: 20472, channel: 'STABLE' },
        bukkit: { file: 'KM-Maintenance-Bukkit-1.0.0-STABLE.jar', bytes: 7687, channel: 'STABLE' }
      }
    },
    'KM-Moderations': {
      ico: 'emojis/km-moderations.png',
      builds: {
        velocity: { file: 'KM-Moderations-Velocity-1.0.0-STABLE.jar', bytes: 4253301, channel: 'STABLE' },
        bukkit: { file: 'KM-Moderations-Bukkit-1.0.0-STABLE.jar', bytes: 29217, channel: 'STABLE' }
      }
    },
    'KM-Perms': {
      ico: 'emojis/km-perms.png',
      builds: {
        velocity: { file: 'KM-Perms-Velocity-1.0.0-STABLE.jar', bytes: 15993686, channel: 'STABLE' },
        bukkit: { file: 'KM-Perms-Bukkit-1.0.0-STABLE.jar', bytes: 13923997, channel: 'STABLE' }
      }
    },
    'KM-Survival': {
      ico: 'emojis/km-survival.png',
      builds: {
        bukkit: { file: 'KM-Survival-Bukkit-1.0.0-STABLE.jar', bytes: 54018, channel: 'STABLE' }
      }
    },
    'KM-TAB': {
      ico: 'emojis/km-tab.png',
      builds: {
        velocity: { file: 'km-tab-Velocity-1.0.0-STABLE.jar', bytes: 3864580, channel: 'STABLE' },
        bukkit: { file: 'km-tab-Bukkit-1.0.0-STABLE.jar', bytes: 6386117, channel: 'STABLE' }
      }
    },
    'KM-Login': { ico: 'emojis/km-login.png', builds: {} },
    'KrazyMan Performance': {
      ico: 'emojis/krazy-perf.png',
      builds: {
        bukkit: { file: 'KM-Performance-Bukkit-1.0.0-DEV.jar', bytes: 29781, channel: 'DEV' }
      }
    },
    'KM-MOTD': {
      ico: 'emojis/km-motd.png',
      builds: {
        velocity: { file: 'KM-MOTD-Velocity-2.0.0-STABLE.jar', bytes: 42460, channel: 'STABLE' },
        bukkit: { file: 'KM-MOTD-Bukkit-1.0.0-STABLE.jar', bytes: 9178, channel: 'STABLE' }
      }
    }
  };

  var MC_VERSIONS = ['1.21.10', '1.21.11'];
  var PROXY_VERSIONS = ['3.4.0-SNAPSHOT (latest)', '3.4.0', '3.3.0-SNAPSHOT', '3.3.0'];

  var PLATFORMS = [
    { id: 'velocity', label: 'Velocity', sub: 'proxy 3.4.0-SNAPSHOT' },
    { id: 'bukkit', label: 'Bukkit · Paper · Spigot · Pufferfish', sub: 'Minecraft 1.21.10 / 1.21.11' }
  ];

  var state = null;
  var root = null;

  function fmt(b) {
    if (b >= 1048576) return (b / 1048576).toFixed(2).replace('.', ',') + ' Mo';
    if (b >= 1024) return (b / 1024).toFixed(1).replace('.', ',') + ' Ko';
    return b + ' o';
  }

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }

  function buildModal(name) {
    var plugin = CONFIG[name];
    var platList = PLATFORMS.filter(function (p) { return plugin.builds[p.id]; });

    state = { plugin: name, plat: platList[0].id, mc: '1.21.11', proxy: '3.4.0-SNAPSHOT (latest)' };

    root = el('div', 'dl-backdrop');
    var pop = el('div', 'dl-pop');

    var head = el('div', 'dl-pop-head');
    var img = el('img');
    img.src = plugin.ico;
    img.alt = name;
    head.appendChild(img);
    var t = el('div');
    t.appendChild(el('h3', null, name));
    var sub = el('div', 'meta');
    sub.textContent = platList.length
      ? 'Choisis la brique de ton réseau, on te file le bon .jar.'
      : 'En cours de préparation.';
    t.appendChild(sub);
    head.appendChild(t);
    var x = el('button', 'dl-x', '✕');
    x.addEventListener('click', close);
    head.appendChild(x);
    pop.appendChild(head);

    var body = el('div', 'dl-pop-body');

    if (!platList.length) {
      body.appendChild(el('div', 'dl-coming', '⚠ Ce plugin n’est pas encore disponible au téléchargement. Lié par DM sur Discord dès qu’il est prêt.'));
    } else {
      body.appendChild(el('div', 'dl-lbl', 'Plateforme'));
      var plats = el('div', 'dl-plats');
      platList.forEach(function (p) {
        var card = el('div', 'dl-plat' + (p.id === state.plat ? ' active' : ''));
        card.innerHTML = '<b>' + p.label + '</b><small>' + p.sub + '</small>';
        card.addEventListener('click', function () {
          state.plat = p.id;
          plats.querySelectorAll('.dl-plat').forEach(function (c) { c.classList.remove('active'); });
          card.classList.add('active');
          refresh(body);
        });
        plats.appendChild(card);
      });
      body.appendChild(plats);
      refresh(body);
    }

    pop.appendChild(body);

    var foot = el('div', 'dl-pop-foot');
    if (platList.length) {
      var go = el('button', 'dl-big', '⬇ Télécharger .jar');
      go.addEventListener('click', function () {
        var b = CONFIG[state.plugin].builds[state.plat];
        if (!b) return;
        var a = document.createElement('a');
        a.href = 'dl/' + b.file;
        a.download = b.file;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
      foot.appendChild(go);
    }
    pop.appendChild(foot);

    root.appendChild(pop);
    root.addEventListener('click', function (e) { if (e.target === root) close(); });
    document.body.appendChild(root);
    requestAnimationFrame(function () { root.classList.add('open'); });
  }

  function refresh(body) {
    body.querySelectorAll('.dl-vers, .dl-proxy, .dl-sum').forEach(function (o) { o.remove(); });
    if (state.plat === 'bukkit') body.appendChild(gameVersions());
    else body.appendChild(proxySelect());
    body.appendChild(summary());
  }

  function label(text) {
    var l = el('div', 'dl-lbl', text);
    return l;
  }

  function gameVersions() {
    var wrap = el('div', 'dl-vers');
    wrap.appendChild(label('Version de jeu'));
    var gv = el('div', 'dl-gv');
    MC_VERSIONS.forEach(function (v) {
      var b = el('button', 'dl-ver' + (v === state.mc ? ' active' : ''), v);
      b.addEventListener('click', function () {
        state.mc = v;
        gv.querySelectorAll('.dl-ver').forEach(function (c) { c.classList.remove('active'); });
        b.classList.add('active');
        summaryUpdate(wrap);
      });
      gv.appendChild(b);
    });
    wrap.appendChild(gv);
    return wrap;
  }

  function proxySelect() {
    var wrap = el('div', 'dl-proxy');
    wrap.appendChild(label('Version du proxy'));
    var sel = document.createElement('select');
    PROXY_VERSIONS.forEach(function (v) {
      var o = document.createElement('option');
      o.value = v;
      o.textContent = v;
      if (v === state.proxy) o.selected = true;
      sel.appendChild(o);
    });
    sel.addEventListener('change', function () {
      state.proxy = sel.value;
      summaryUpdate(wrap);
    });
    wrap.appendChild(sel);
    return wrap;
  }

  function summary() {
    var b = CONFIG[state.plugin].builds[state.plat];
    var sum = el('div', 'dl-sum');
    sum.appendChild(el('span', 'f', b ? b.file : '—'));
    var m = el('span', 'm');
    if (b) {
      var parts = [];
      parts.push(state.plat === 'bukkit' ? 'MC ' + state.mc : state.proxy.replace(' (latest)', ''));
      parts.push(b.channel);
      parts.push(fmt(b.bytes));
      m.textContent = parts.join(' · ');
    }
    sum.appendChild(m);
    return sum;
  }

  function summaryUpdate(container) {
    var old = container.parentNode.querySelectorAll('.dl-sum');
    old.forEach(function (o) { o.remove(); });
    container.parentNode.appendChild(summary());
  }

  function openFor(name) {
    if (root) { root.remove(); root = null; }
    buildModal(name);
  }

  function close() {
    if (!root) return;
    root.classList.remove('open');
    setTimeout(function () { root.remove(); root = null; }, 200);
  }

  function guessFromCard(card) {
    var img = card.querySelector('.plg-ico');
    if (img) {
      var alt = (img.getAttribute('alt') || '').trim();
      if (CONFIG[alt]) return alt;
    }
    var h3 = card.querySelector('h3');
    if (h3) {
      for (var k in CONFIG) {
        if (h3.textContent.indexOf(k) !== -1) return k;
      }
    }
    return null;
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.dl-btn') : null;
    if (!btn) return;
    if (btn.classList.contains('disabled')) return;
    e.preventDefault();
    var card = btn.closest('.card');
    if (!card) return;
    var key = guessFromCard(card);
    if (!key) return;
    openFor(key);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();