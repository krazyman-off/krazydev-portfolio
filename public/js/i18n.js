// KrazyDev — i18n léger : détection auto de la langue + popup custom FR/EN.
// Traduction pilotée par sélecteurs (structure figée) + globaux (nav, footer, badges, chips).
(function () {
  'use strict';

  var LS = 'krazydev_lang';
  var saved = new WeakMap();

  function page() {
    var n = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    return n;
  }

  function detect() {
    try {
      var ls = localStorage.getItem(LS);
      if (ls === 'en' || ls === 'fr') return ls;
    } catch (e) {}
    var langs = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || 'fr'];
    for (var i = 0; i < langs.length; i++) {
      if (/^en(-|_|$)/i.test(langs[i])) return 'en';
    }
    return 'fr';
  }

  var CUR = detect();

  function q(s) { return document.querySelectorAll(s); }

  // ---------- Dictionnaire EN (le FR vit dans le HTML) ----------
  var EN = {
    global: [
      { sel: '#loader p', en: 'Secure loading...' },
      { sel: 'footer', en: 'Made with ♥ by <b style="color:var(--red)">KrazyMan_off</b> aka Sasha — KrazyDev • 2023-2026 • <a href="index.html">Home</a> • <a href="projets.html">Projects</a> • <a href="skills.html">Stack</a> • <a href="contact.html">Contact</a>' }
    ],
    home: [
      { sel: '.hero > div:nth-of-type(1) .kicker', en: '● Available • Portfolio v2 • 2023 — 2026 • Prod ready' },
      { sel: '.hero > div:nth-of-type(1) p.subtitle', en: 'I build <b>infrastructure that holds up in production</b>: a Discord bot that handles thousands of members without breaking a sweat, and a suite of Paper plugins that keeps Minecraft servers lag-free. No fluff, just code that ships.' },
      { sel: '.hero-cta a:nth-of-type(1)', en: 'View projects ↓' },
      { sel: '.hero-cta a:nth-of-type(2)', en: 'My stack' },
      { sel: '.terminal .term-body > div:nth-of-type(5)', en: 'drwxr <b>Krazy-Studio-Bot</b> <span style="color:#ffb84d">confidential</span> — 12 cogs • WAL' },
      { sel: '.terminal .term-body > div:nth-of-type(9)', en: '<span style="color:#ff2449">● 3 years of continuous maintenance</span>' },
      { sel: '.wrap > .section:nth-of-type(1) h2', en: 'About — Who is KrazyMan_off?' },
      { sel: '.wrap > .section:nth-of-type(1) p.lead', en: 'Behind KrazyDev there is Sasha — passionate, stubborn, and obsessed with the detail that keeps a project alive in production.' },
      { sel: '.two-col > .card:first-child > p:nth-of-type(1)', en: 'My name is <b>Sasha</b>, aka <b>KrazyMan_off</b> (KrazyDev). I have been coding since 2023 with one obsession: <b>building things that do not break when they scale</b>.' },
      { sel: '.two-col > .card:first-child > p:nth-of-type(2)', en: 'I started with a Discord bot for my community, then a Minecraft plugin for my server. 3 years later it became 2 complete ecosystems: maintained, documented, used in production. Not abandoned POCs after two weeks.' },
      { sel: '.two-col > .card:first-child > p:nth-of-type(3)', en: 'My credo: <b>anti-abuse from day one</b>, clean permissions, usable logs, forensics, and performance. I would rather spend 2 hours securing a feature than 10 hours putting out a raid at 3 a.m.' },
      { sel: '.two-col > .card:first-child .tags', en: '<span class="tag">Rigorous</span><span class="tag">Prod-first</span><span class="tag">Self-taught</span><span class="tag">Maintainer</span><span class="tag">Community-driven</span>' },
      { sel: '.stack-side .skill:nth-of-type(1) h4', en: '▸ What I don\u2019t do' },
      { sel: '.stack-side .skill:nth-of-type(1) p', en: 'No copy-pasting tutorials. No "it works on my machine". Every plugin is built, tested, versioned. Every cog is logged.' },
      { sel: '.stack-side .skill:nth-of-type(2) h4', en: '▸ Values' },
      { sel: '.stack-side .skill:nth-of-type(2) ul', en: '<li>Readable code &gt; clever code</li><li>Security by default</li><li>Docs &amp; support</li><li>Long term</li>' },
      { sel: '.stack-side .skill:nth-of-type(3) h4', en: '▸ In numbers' },
      { sel: '.stack-side .skill:nth-of-type(3) p', en: '2023 → 2026 : 3 years<br>15+ plugins • 12 cogs<br>60k+ cumulative files<br>Discord : discord.gg/45Dc3UZ726' },
      { sel: '.wrap > .section:nth-of-type(1) .nav-arrows a', en: 'View my projects →' },
      { sel: '.wrap > .section:nth-of-type(2) h2', en: 'Explore' },
      { sel: '.wrap > .section:nth-of-type(2) p.lead', en: 'Three dedicated pages.' },
      { sel: '.page-grid .page-card:nth-of-type(1) h3', en: 'Projects' },
      { sel: '.page-grid .page-card:nth-of-type(1) p', en: 'Krazy Studio Bot & KM-Plugins in detail: architecture, features, plugins, stacks.' },
      { sel: '.page-grid .page-card:nth-of-type(1) .pc-go', en: 'Open →' },
      { sel: '.page-grid .page-card:nth-of-type(2) h3', en: 'Stack' },
      { sel: '.page-grid .page-card:nth-of-type(2) p', en: 'Languages, cybersecurity, infra, services — what I master and what I can do for you.' },
      { sel: '.page-grid .page-card:nth-of-type(2) .pc-go', en: 'Open →' },
      { sel: '.page-grid .page-card:nth-of-type(3) h3', en: 'Contact' },
      { sel: '.page-grid .page-card:nth-of-type(3) p', en: 'Discord, email, quotes. Shall we work together?' },
      { sel: '.page-grid .page-card:nth-of-type(3) .pc-go', en: 'Open →' },
      { sel: '.wrap > .section:nth-of-type(3) h2', en: 'In brief' },
      { sel: '.projects .card:nth-of-type(1) h3', en: 'Krazy Studio Bot' },
      { sel: '.projects .card:nth-of-type(1) .links-a', en: 'Details →' },
      { sel: '.projects .card:nth-of-type(1) p', en: 'Python 3.13 • discord.py 2.7 • SQLite WAL • Tickets V2, Anti-Raid, TempVoc, 20-option Polls, Automod, Logs, Levels, Economy, Forensics.' },
      { sel: '.projects .card:nth-of-type(2) h3', en: 'KM-Plugins' },
      { sel: '.projects .card:nth-of-type(2) .links-a', en: 'Details →' },
      { sel: '.projects .card:nth-of-type(2) p', en: 'Java 17 • Paper/Spigot • Maven — 15 plugins: KM-AC (8,608 files), KM-Login, KM-Perms, KM-AntiBots, KM-Moderations…' },
      { sel: '.wrap > .section:nth-of-type(4) .cta h3', en: 'Let\u2019s work together?' },
      { sel: '.wrap > .section:nth-of-type(4) .cta p', en: 'Simplest: Discord. Fast reply, no ghost form.' },
      { sel: '.wrap > .section:nth-of-type(4) .cta .btn-ghost', en: 'Contact page' }
    ],
    proj: [
      { sel: '.wrap > div:nth-of-type(1) .kicker', en: '/projects — 02' },
      { sel: '.wrap > div:nth-of-type(1) h1', en: 'The <em>projects</em>' },
      { sel: '.wrap > div:nth-of-type(1) .subtitle', en: '1 confidential flagship + 11 free plugins. Updates tracked in <b style="color:var(--red)">updates.yml</b>.' },
      { sel: '.wrap > div:nth-of-type(2) .card-head h3', en: 'Krazy Studio Bot — Multi-feature Discord bot' },
      { sel: '.wrap > div:nth-of-type(2) .card-head .meta', en: 'Python 3.13 • discord.py 2.7 • The biggest project • 60k+ lines' },
      { sel: '.wrap > div:nth-of-type(2) .card-head div[style*="text-align:right"] > div:nth-of-type(1)', en: '12 cogs • 2 DB' },
      { sel: '.wrap > div:nth-of-type(2) .card-head div[style*="text-align:right"] > div:nth-of-type(2)', en: 'PROD READY' },
      { sel: '.wrap > div:nth-of-type(2) .card-body > p', en: '<b>Pitch:</b> One bot that replaces 6 badly wired bots. Built for big communities that get raided at 4 a.m.' },
      { sel: '.wrap > div:nth-of-type(2) .feat-grid .mini:nth-of-type(1)', en: '<b>🎫 Tickets V2</b><p>Panels, threads, HTML transcripts, claim/close, logs</p>' },
      { sel: '.wrap > div:nth-of-type(2) .feat-grid .mini:nth-of-type(2)', en: '<b>🛡️ Anti-Raid</b><p>Join flood, mass-ban, auto-lock, forensics snapshots</p>' },
      { sel: '.wrap > div:nth-of-type(2) .feat-grid .mini:nth-of-type(3)', en: '<b>🔊 TempVoc</b><p>Temporary voice channels, limits, perms, cleanup</p>' },
      { sel: '.wrap > div:nth-of-type(2) .feat-grid .mini:nth-of-type(4)', en: '<b>📊 20-option polls</b><p>Embeds, buttons, Matplotlib results</p>' },
      { sel: '.wrap > div:nth-of-type(2) .feat-grid .mini:nth-of-type(5)', en: '<b>🤖 Automod + Logs</b><p>Filters, warn/mute, full per-channel logs</p>' },
      { sel: '.wrap > div:nth-of-type(2) .feat-grid .mini:nth-of-type(6)', en: '<b>📈 Levels & Economy</b><p>XP, leaderboard, shop, daily</p>' },
      { sel: '.wrap > div:nth-of-type(2) .card-body > div[style*="border:1px dashed"]', en: '<b style="font-family:\'JetBrains Mono\',monospace;font-size:.82rem;color:var(--red)">Architecture</b><p style="font-family:\'JetBrains Mono\',monospace;font-size:.78rem;opacity:.65;margin-top:6px;line-height:1.6">cogs/ (12) • core/ • utils/ • web/ • forensics_snapshots/<br>globality.db (WAL) • temp.db (WAL) • Matplotlib charts<br>Double DB so production never locks</p>' },
      { sel: '.wrap > div:nth-of-type(2) .links > span', en: 'Repo: confidential — private access on request' },
      { sel: '.wrap > div:nth-of-type(2) .links > a', en: 'Try on Discord ↗' },
      { sel: '.wrap > div:nth-of-type(3) > .card > .card-head h3', en: 'KM-Plugins — Premium Paper/Spigot suite' },
      { sel: '.wrap > div:nth-of-type(3) > .card > .card-head .meta', en: 'Java 17 • Paper/Spigot/Velocity/Bungee • Maven & Gradle' },
      { sel: '.wrap > div:nth-of-type(3) > .card > .card-head div[style*="text-align:right"] > div:nth-of-type(1)', en: '11 plugins • 100% free' },
      { sel: '.wrap > div:nth-of-type(3) > .card > .card-head div[style*="text-align:right"] > div:nth-of-type(2)', en: 'FREE & AVAILABLE' },
      { sel: '.wrap > div:nth-of-type(3) > .card .card-body > p', en: '<b>Pitch:</b> A coherent suite covering auth, perms, anti-bot, anti-cheat, moderation, survival and perf — without stacking 20 incompatible plugins. Every module talks to the others: KM-Perms ranks show up in KM-TAB, KM-Moderations sanctions reach the whole network, KM-AntiBots blocks before the backend even sees the player. All free, links sent by DM on Discord.' },
      { sel: '.wrap > div:nth-of-type(3) > div:nth-of-type(3)', en: '<img src="emojis/km-shop.png" alt="shop" class="plg-ico" style="width:28px;height:28px"><span><b>All plugins are 100% free.</b> Get them via Discord — links sent by DM. KM-Login is live as Velocity DEV 1.1.0, KM-RiotOps is now DEV 2.0.0 (Paper 1.20.4) + Velocity probe 0.1.0, the rest is available right now.</span>' },
      { sel: '.wrap > div:nth-of-type(3) > div:nth-of-type(4) > a', en: 'Get KM-Plugins ↗' },
      { sel: '.wrap > div:nth-of-type(3) > div:nth-of-type(4) > span', en: 'Bundle:<br><b>KM-AC · KM-RiotOps · KM-AntiBots · KM-Login · KM-Maintenance · KM-Moderations · KM-Perms · KM-Survival · KM-TAB · KrazyMan Perf · KM-MOTD</b>' },
      { sel: '.nav-arrows .btn-primary', en: 'Next: Stack →' },
      { sel: '.subgrid > .card:nth-child(1) > .card-head .meta', en: 'Network anti-cheat — 138 checks' },
      { sel: '.subgrid > .card:nth-child(1) > p', en: 'The shield that makes cheating exhausting. Detects and isolates impossible behaviour without breaking the experience of legit players.' },
      { sel: '.subgrid > .card:nth-child(1) > div:nth-of-type(2)', en: '<span>▸ 138 checks: movement, combat, impossible</span><span>▸ Proxy-first: reads BEFORE the backend</span><span>▸ Paper/Folia adapter, shared core</span>' },
      { sel: '.subgrid > .card:nth-child(1) .bench-grid', en: '<div class="bench"><b>138</b><span>active checks</span></div><div class="bench"><b>&lt;0,05ms</b><span>added latency</span></div><div class="bench"><b>99,9%</b><span>legits intact</span></div>' },
      { sel: '.subgrid > .card:nth-child(1) .dl-wrap > span', en: 'UPD 2026-09-11' },
      { sel: '.subgrid > .card:nth-child(2) > .card-head .meta', en: 'Minecraft Security & Resilience Engine' },
      { sel: '.subgrid > .card:nth-child(2) .badge', en: 'NEW — DEV 2.0.0' },
      { sel: '.subgrid > .card:nth-child(2) > p', en: 'An offensive <b style="color:#ffb84d">security &amp; resilience</b> engine built into the server: it finds weaknesses BEFORE an attacker does. It tests your server against itself, walking through a risk graph, specialised agents and impact-chain correlation.' },
      { sel: '.subgrid > .card:nth-child(2) > div:nth-of-type(2)', en: '<span>▸ Full pipeline: discovery → baseline → agents → correlation → report</span><span>▸ Parallel agents: command, permission, plugin, config, protocol, resource</span><span>▸ Stress-test, controlled fuzzing, vulnerability-chain analysis</span><span>▸ Safety Controller: CPU/RAM budgets, emergency stop, zero external network scan</span><span>▸ Console / JSON / HTML reports + doctor command</span><span>▸ Builds: Paper 1.20.4 (2.0.0-DEV) + Velocity probe (0.1.0-DEV)</span>' },
      { sel: '.subgrid > .card:nth-child(2) .bench-grid', en: '<div class="bench"><b>Graph</b><span>chained risk</span></div><div class="bench"><b>32</b><span>max agents</span></div><div class="bench"><b>0</b><span>external scan</span></div>' },
      { sel: '.subgrid > .card:nth-child(2) .dl-wrap > span', en: 'NEW — UPD 2026-09-15' },
      { sel: '.subgrid > .card:nth-child(3) > .card-head .meta', en: 'Anti-bot / anti-raid — the edge that replaces Cloudflare' },
      { sel: '.subgrid > .card:nth-child(3) > p', en: 'Cloudflare needs a domain and cannot see Minecraft. KM-AntiBots inspects the native protocol (handshake, ping→join) and protects your raw IP, no DNS needed.' },
      { sel: '.subgrid > .card:nth-child(3) > div:nth-of-type(2)', en: '<span>▸ HandshakeValidator native Minecraft protocol</span><span>▸ BotScorer: human→bot score (VPN/hosting)</span><span>▸ 5s challenge + 30min pass, anti false-positive</span><span>▸ Persistent whitelist/blacklist, Bukkit bridge</span>' },
      { sel: '.subgrid > .card:nth-child(3) .bench-grid', en: '<div class="bench"><b>99</b><span>max bot score</span></div><div class="bench"><b>&lt;1ms</b><span>handshake overhead</span></div><div class="bench"><b>0</b><span>false positive</span></div>' },
      { sel: '.subgrid > .card:nth-child(3) .dl-wrap > span', en: 'UPD 2026-09-11' },
      { sel: '.subgrid > .card:nth-child(4) > .card-head .meta', en: 'Premium auth — brute-force resistance' },
      { sel: '.subgrid > .card:nth-child(4) > p', en: 'The login that verifies premium accounts through the Mojang session and makes brute-force pointless. The Velocity DEV build is live — Bukkit/Bungee coming next.' },
      { sel: '.subgrid > .card:nth-child(4) > div:nth-of-type(2)', en: '<span>▸ Premium + offline auth, persistent sessions</span><span>▸ Mojang premium account retrieval</span><span>▸ Modular architecture (separate loader)</span><span>▸ Bungee / Spigot / Velocity</span><span>▸ Velocity 1.1.0-DEV build available for download</span>' },
      { sel: '.subgrid > .card:nth-child(4) .bench-grid', en: '<div class="bench"><b>Premium</b><span>Mojang auth</span></div><div class="bench"><b>3 bases</b><span>Bungee/Spigot/Velocity</span></div><div class="bench"><b>0 brute</b><span>force possible</span></div>' },
      { sel: '.subgrid > .card:nth-child(4) .dl-wrap > span', en: 'DEV 1.1.0 — UPD 2026-09-15' },
      { sel: '.subgrid > .card:nth-child(5) > .card-head .meta', en: 'Smart multi-server maintenance mode' },
      { sel: '.subgrid > .card:nth-child(5) > p', en: 'Cleanly shuts your server down during an update or reset, with a smart whitelist and a screen visible in the server menu.' },
      { sel: '.subgrid > .card:nth-child(5) > div:nth-of-type(2)', en: '<span>▸ Clean shutdown + maintenance MOTD screen</span><span>▸ Whitelist by group/permission, ping cache</span><span>▸ Synced proxy ↔ bukkit bridge</span>' },
      { sel: '.subgrid > .card:nth-child(5) .bench-grid', en: '<div class="bench"><b>~0ms</b><span>clean cutover</span></div><div class="bench"><b>Multi</b><span>server sync</span></div><div class="bench"><b>Cache</b><span>ping restored</span></div>' },
      { sel: '.subgrid > .card:nth-child(5) .dl-wrap > span', en: 'UPD 2026-07-01' },
      { sel: '.subgrid > .card:nth-child(6) > .card-head .meta', en: 'Proxy-first moderation, network-wide sanctions' },
      { sel: '.subgrid > .card:nth-child(6) > p', en: 'Sanction any player on your network straight from the proxy: ban, ipban, kick, mute — global effect, beautiful screens.' },
      { sel: '.subgrid > .card:nth-child(6) > div:nth-of-type(2)', en: '<span>▸ Centralised ban / tempban / ipban / kick / mute</span><span>▸ MiniMessage gradient screens + global announcements</span><span>▸ Vanish, staff-chat, spy, gnick, freeze, fly, find</span><span>▸ Persistent sanctions (IP ban + native storage)</span>' },
      { sel: '.subgrid > .card:nth-child(6) .bench-grid', en: '<div class="bench"><b>Network</b><span>global sanction</span></div><div class="bench"><b>8+</b><span>staff tools</span></div><div class="bench"><b>100%</b><span>persistent storage</span></div>' },
      { sel: '.subgrid > .card:nth-child(6) .dl-wrap > span', en: 'UPD 2026-07-06' },
      { sel: '.subgrid > .card:nth-child(7) > .card-head .meta', en: 'Advanced permissions — hardened LuckPerms fork' },
      { sel: '.subgrid > .card:nth-child(7) > p', en: 'The LuckPerms 5.5.17 base, hardened and wired into the KM ecosystem: groups, weights, inheritances — and your ranks show up everywhere.' },
      { sel: '.subgrid > .card:nth-child(7) > div:nth-of-type(2)', en: '<span>▸ Groups, prefixes/suffixes, weights, inheritances</span><span>▸ Common + Proxy + Server modules</span><span>▸ Wired to KM-TAB, KM-Moderations, KM-Survival</span>' },
      { sel: '.subgrid > .card:nth-child(7) .bench-grid', en: '<div class="bench"><b>5.5.17</b><span>LuckPerms base</span></div><div class="bench"><b>∞</b><span>groups/inheritances</span></div><div class="bench"><b>3+</b><span>KM wired</span></div>' },
      { sel: '.subgrid > .card:nth-child(7) .dl-wrap > span', en: 'UPD 2026-07-06' },
      { sel: '.subgrid > .card:nth-child(8) > .card-head .meta', en: 'Realistic survival — temperature, hydration, seasons' },
      { sel: '.subgrid > .card:nth-child(8) > p', en: 'Survival you actually feel: manage your body temperature, hydration, wounds — and the seasons really weigh on the gameplay.' },
      { sel: '.subgrid > .card:nth-child(8) > div:nth-of-type(2)', en: '<span>▸ Connected temperature + hydration + hunger</span><span>▸ Wounds, mental health, somatic effects</span><span>▸ Seasons (summer/winter) with real impacts</span><span>▸ Real-time action-bar HUD, sleep manager</span>' },
      { sel: '.subgrid > .card:nth-child(8) .bench-grid', en: '<div class="bench"><b>4</b><span>linked needs</span></div><div class="bench"><b>2</b><span>real seasons</span></div><div class="bench"><b>Real</b><span>live HUD</span></div>' },
      { sel: '.subgrid > .card:nth-child(8) .dl-wrap > span', en: 'UPD 2026-07-15' },
      { sel: '.subgrid > .card:nth-child(9) > .card-head .meta', en: 'Tablist + global chat, with ranks' },
      { sel: '.subgrid > .card:nth-child(9) > p', en: 'Custom header/footer, ping, TPS, players online — and a clean global chat where KM-Perms ranks appear automatically.' },
      { sel: '.subgrid > .card:nth-child(9) > div:nth-of-type(2)', en: '<span>▸ Custom header/footer: ping, TPS, online</span><span>▸ Global chat formatted with KM-Perms ranks</span><span>▸ Customisable join/leave messages</span><span>▸ Spigot/PufferFish + multi-server companion</span>' },
      { sel: '.subgrid > .card:nth-child(9) .bench-grid', en: '<div class="bench"><b>Live</b><span>ping+TPS+online</span></div><div class="bench"><b>Ranks</b><span>auto KM-Perms</span></div><div class="bench"><b>Global</b><span>network chat</span></div>' },
      { sel: '.subgrid > .card:nth-child(9) .dl-wrap > span', en: 'UPD 2026-07-06' },
      { sel: '.subgrid > .card:nth-child(10) > .card-head .meta', en: 'Lag optimisation & isolation' },
      { sel: '.subgrid > .card:nth-child(10) > p', en: 'Isolates what makes your machine lag before it is you lagging: redstone clocks, hoppers, AI, chunks — with watchdog and metrics. <b style="color:#5cf09a">Tested in real conditions.</b>' },
      { sel: '.subgrid > .card:nth-child(10) > div:nth-of-type(2)', en: '<span>▸ Lag isolation: chunks, redstone, AI, hoppers</span><span>▸ Cold watchdog + redstone clock detector</span><span>▸ Entity-AI optimisation + chunk pregen</span><span>▸ Prometheus exporter + server health dashboard</span>' },
      { sel: '.subgrid > .card:nth-child(10) .bench-grid', en: '<div class="bench"><b>-X ms</b><span>MSPT after fix</span></div><div class="bench"><b>Watchdog</b><span>lag detected</span></div><div class="bench"><b>Prom</b><span>live metrics</span></div>' },
      { sel: '.subgrid > .card:nth-child(10) .dl-wrap > span', en: 'UPD 2026-09-11' },
      { sel: '.subgrid > .card:nth-child(11) > .card-head .meta', en: 'Animated MOTD + favicons + live placeholders' },
      { sel: '.subgrid > .card:nth-child(11) > p', en: 'A server menu that showcases: animated frames, per-frame favicons, fake players, version spoof — full MiniMessage for Velocity.' },
      { sel: '.subgrid > .card:nth-child(11) > div:nth-of-type(2)', en: '<span>▸ Frame animation: sequential / random / shuffle</span><span>▸ Live placeholders: {online} {max} {time} {host}</span><span>▸ Per-frame favicons + custom hover</span><span>▸ Simulated player count (real / fake / fixed)</span><span>▸ Built-in maintenance mode, dedicated frame</span>' },
      { sel: '.subgrid > .card:nth-child(11) .bench-grid', en: '<div class="bench"><b>∞</b><span>animated frames</span></div><div class="bench"><b>Live</b><span>ping placeholders</span></div><div class="bench"><b>Favicon</b><span>per frame</span></div>' },
      { sel: '.subgrid > .card:nth-child(11) .dl-wrap > span', en: 'V1.0.0 — UPD 2026-09-12' }
    ],
    skill: [
      { sel: '.wrap > div:nth-of-type(1) .kicker', en: '/stack — 03' },
      { sel: '.wrap > div:nth-of-type(1) h1', en: 'The <em>stack</em>' },
      { sel: '.wrap > div:nth-of-type(1) .subtitle', en: 'No buzzwords, only what actually runs in production.' },
      { sel: '.skills .skill:nth-of-type(1) h4', en: '▸ Languages' },
      { sel: '.skills .skill:nth-of-type(1) ul', en: '<li>Python 3.13 ★★★★☆</li><li>Java 17 ★★★★☆</li><li>Rust ★★★★★</li><li>SQL/SQLite ★★★★☆</li><li>JS ★★★☆☆</li><li>YAML/Maven ★★★★☆</li>' },
      { sel: '.skills .skill:nth-of-type(1) p', en: 'I write clean, typed, documented code.' },
      { sel: '.skills .skill:nth-of-type(2) h4', en: '▸ Cybersecurity & Infra' },
      { sel: '.skills .skill:nth-of-type(2) ul', en: '<li>Anti-Raid / Anti-Bot</li><li>Auth & Permissions</li><li>WAL SQLite & Forensics</li><li>Paper Hardening</li><li>Rate-limit & Logs</li><li>Threat → Fast patch</li>' },
      { sel: '.skills .skill:nth-of-type(3) h4', en: '▸ Server & DevOps' },
      { sel: '.skills .skill:nth-of-type(3) ul', en: '<li>Rust Axum + Tokio</li><li>Tower / Governor</li><li>Gzip / CORS / Trace</li><li>Cloudflare (prod)</li><li>Git • Maven • Docker</li>' },
      { sel: '.wrap > .section:nth-of-type(2) .tags', en: '<span class="tag">Rust ★★★★★ — Serde, Axum, tokio, tower-http, tower_governor, tracing</span><span class="tag">Java 17 — Paper API, Spigot, Maven</span><span class="tag">Python — discord.py, aiohttp, sqlite3, matplotlib</span><span class="tag">JS — vanilla HTML/CSS, canvas</span>' },
      { sel: '.mini-grid .mini:nth-of-type(1)', en: '<b>🛠️ Tooling</b><p>Burp, Nmap, Wireshark (basics), Git, Matplotlib, Paper API, discord.py</p>' },
      { sel: '.mini-grid .mini:nth-of-type(2)', en: '<b>📦 Method</b><p>Versioning, changelog, controlled prod tests, fast rollback</p>' },
      { sel: '.mini-grid .mini:nth-of-type(3)', en: '<b>🤝 Support</b><p>Active Discord, docs, continuous updates since 2023</p>' },
      { sel: '.wrap > .section:nth-of-type(3) h2', en: 'Services — What I can do for you' },
      { sel: '.svc-grid .card:nth-of-type(1) h3', en: '🤖 Custom Discord bot' },
      { sel: '.svc-grid .card:nth-of-type(1) p:nth-of-type(1)', en: 'Tickets V2, anti-raid, tempvoc, automod — delivered, hosted, maintained. Not a bot that dies at the first raid.' },
      { sel: '.svc-grid .card:nth-of-type(1) p:nth-of-type(2)', en: '→ Quote on Discord' },
      { sel: '.svc-grid .card:nth-of-type(2) h3', en: '⛏️ Production Paper plugins' },
      { sel: '.svc-grid .card:nth-of-type(2) p:nth-of-type(1)', en: 'KM-Plugins or a custom plugin: perms, auth, perf. Clean Java 17 code, Maven build.' },
      { sel: '.svc-grid .card:nth-of-type(3) h3', en: '🛡️ Anti-abuse audit' },
      { sel: '.svc-grid .card:nth-of-type(3) p:nth-of-type(1)', en: 'I check your server/bot, find the holes, patch them. 3 years of real attack experience.' },
      { sel: '.svc-grid .card:nth-of-type(3) p:nth-of-type(2)', en: '→ On request' },
      { sel: '.nav-arrows .btn-primary', en: 'Next: Contact →' }
    ],
    cont: [
      { sel: '.wrap > div:nth-of-type(1) .kicker', en: '/contact — 04' },
      { sel: '.wrap > div:nth-of-type(1) h1', en: 'Let\u2019s work <em>together</em>?' },
      { sel: '.wrap > div:nth-of-type(1) .subtitle', en: 'Simplest: Discord. Fast reply, no ghost form.' },
      { sel: '.wrap > .section:nth-of-type(2) .cta h3', en: 'Discord — the fastest' },
      { sel: '.wrap > .section:nth-of-type(2) .cta p', en: 'Active server, fast reply, direct quote.' },
      { sel: '.cta-grid .card:nth-of-type(1) h3', en: '📧 Business email' },
      { sel: '.cta-grid .card:nth-of-type(1) p', en: 'krazyman.off@gmail.com' },
      { sel: '.cta-grid .card:nth-of-type(1) a', en: 'Write →' },
      { sel: '.cta-grid .card:nth-of-type(2) h3', en: '🔒 Bot' },
      { sel: '.cta-grid .card:nth-of-type(2) p', en: 'Krazy Studio Bot — confidential — private access on request via Discord.' },
      { sel: '.cta-grid .card:nth-of-type(3) h3', en: '⛏️ KM-Plugins' },
      { sel: '.cta-grid .card:nth-of-type(3) p', en: 'Public suite — availability and license via Discord.' },
      { sel: '.wrap > .section:nth-of-type(3) h2', en: 'Send a message' },
      { sel: '.wrap > .section:nth-of-type(3) > p.lead', en: 'Replied by email at <b style="color:var(--red)">krazyman.off@gmail.com</b> — usually within 24h.' },
      { sel: '.form-field:nth-of-type(1) label', en: 'Name' },
      { sel: '.form-field:nth-of-type(2) label', en: 'Email (reply)' },
      { sel: '.form-field:nth-of-type(3) label', en: 'Subject' },
      { sel: '.form-field:nth-of-type(4) label', en: 'Message' },
      { sel: '.form-field:nth-of-type(1) input', attr: 'placeholder', en: 'Your name' },
      { sel: '.form-field:nth-of-type(2) input', attr: 'placeholder', en: 'you@email.com' },
      { sel: '.form-field:nth-of-type(3) input', attr: 'placeholder', en: 'Ex: Discord bot quote, KM-Plugins, audit…' },
      { sel: '.form-field:nth-of-type(4) textarea', attr: 'placeholder', en: 'Describe your project: what you want, deadlines, budget…' },
      { sel: '.form-actions .btn-primary', en: 'Send message ↦' },
      { sel: '.form-note', en: '🔒 Protected by anti-spam honeypot — your data goes straight to my inbox.' },
      { sel: '.wrap > .section:nth-of-type(4) h2', en: 'Why contact me?' },
      { sel: '.why-grid .mini:nth-of-type(1)', en: '<b>🤖 You want a Discord bot that holds up</b><p style="opacity:.6;margin-top:4px">Tickets, anti-raid, tempvoc, economy — custom or based on Krazy Studio Bot.</p>' },
      { sel: '.why-grid .mini:nth-of-type(2)', en: '<b>⛏️ You are building a bot-proof Minecraft server</b><p style="opacity:.6;margin-top:4px">KM-Plugins or a hardened custom Paper setup.</p>' },
      { sel: '.why-grid .mini:nth-of-type(3)', en: '<b>🛡️ You want a security audit</b><p style="opacity:.6;margin-top:4px">I comb through your server/bot and bring back a report + patches.</p>' },
      { sel: '.why-grid .mini:nth-of-type(4)', en: '<b>📈 You want a Rust portfolio</b><p style="opacity:.6;margin-top:4px">Axum server, rate-limit, security headers, multi-page static — like this page.</p>' },
      { sel: '.wrap > .section:nth-of-type(4) .nav-arrows .btn-primary', en: 'Back to home →' }
    ]
  };

  // ---------- Remplacements de petits labels ----------
  var BADGES = {
    '● MAINTENU — 2023-2026': '● MAINTAINED — 2023-2026',
    'CONFIDENTIEL — Repo privé': 'CONFIDENTIAL — Private repo',
    'GRATUITS': 'FREE',
    'LIBRES & DISPO': 'FREE & AVAILABLE',
    'NOUVEAU — DEV 2.0.0': 'NEW — DEV 2.0.0',
    'EN DÉVELOPPEMENT': 'IN DEVELOPMENT',
    'FLAGSHIP': 'FLAGSHIP',
    'STRESS-TEST ✓': 'STRESS-TEST ✓',
    'STABLE 1.0.0': 'STABLE 1.0.0',
    'STABLE V1.0.0': 'STABLE V1.0.0',
    'VERSION DEV': 'DEV VERSION',
    'DEV 1.0.0': 'DEV 1.0.0',
    'DEV — VELOCITY 1.1.0': 'DEV — VELOCITY 1.1.0',
    '● MAINTENU — 2023-2026': '● MAINTAINED — 2023-2026'
  };
  var CHIPS = { 'Java': 'Java', 'Rust': 'Rust', 'Maintenu': 'Maintained' };
  var NAV = { 'index.html': 'Home', 'projets.html': 'Projects', 'skills.html': 'Stack', 'contact.html': 'Contact' };

  // ---------- Helpers d'origine ----------
  function saveOrig(el, key, val) {
    var o = saved.get(el) || {};
    if (o[key] === undefined) o[key] = val;
    saved.set(el, o);
  }
  function restoreEl(el) {
    var o = saved.get(el);
    if (!o) return;
    if (o.html !== undefined) el.innerHTML = o.html;
    if (o.text !== undefined) el.textContent = o.text;
    if (o.attr !== undefined) { for (var k in o.attr) el.setAttribute(k, o.attr[k]); }
    saved.delete(el);
  }

  // ---------- Application ----------
  function apply(lang) {
    var p = page();
    var en = lang === 'en';
    var list = [];
    (EN.global || []).forEach(function (e) { list.push(e); });
    (EN[p] || []).forEach(function (e) { list.push(e); });

    if (en) {
      list.forEach(function (e) {
        if (!e.sel || !e.en) return;
        q(e.sel).forEach(function (el) {
          if (e.attr) {
            var obj = {};
            obj[e.attr] = el.getAttribute(e.attr);
            saveOrig(el, 'attr', obj);
            el.setAttribute(e.attr, e.en);
          } else {
            saveOrig(el, 'html', el.innerHTML);
            el.innerHTML = e.en;
          }
        });
      });

      q('footer').forEach(function (el) {
        saveOrig(el, 'html', el.innerHTML);
        var f = null;
        (EN.global || []).forEach(function (e) { if (e.sel === 'footer') f = e.en; });
        if (f) el.innerHTML = f;
      });

      q('.badge').forEach(function (el) {
        var k = el.textContent.trim();
        if (BADGES[k] !== undefined) {
          saveOrig(el, 'text', el.textContent);
          el.textContent = BADGES[k];
        }
      });

      q('.st-chip').forEach(function (el) {
        var img = el.querySelector('img');
        var label = el.lastChild && el.lastChild.nodeType === 3 ? el.lastChild.nodeValue : el.textContent;
        var k = label.trim();
        if (CHIPS[k] !== undefined) {
          saveOrig(el, 'html', el.innerHTML);
          el.innerHTML = '';
          if (img) el.appendChild(img);
          el.appendChild(document.createTextNode(CHIPS[k]));
        }
      });

      q('.dl-btn').forEach(function (el) {
        saveOrig(el, 'attr', { title: el.getAttribute('title') });
        el.setAttribute('title', 'Choose platform & version');
      });

      q('.nav-links a').forEach(function (a) {
        var href = a.getAttribute('href') || '';
        if (NAV[href] !== undefined) {
          saveOrig(a, 'text', a.textContent);
          a.textContent = NAV[href];
        }
      });

      var hp = document.getElementById('lang-toggle');
      if (hp) hp.querySelector('span').textContent = 'EN';

      if (document.documentElement) document.documentElement.lang = 'en';
      var t = document.querySelector('title');
      if (t) {
        saveOrig(t, 'text', t.textContent);
        var T = {
          'index.html': 'KrazyDev — KrazyMan_off (Sasha) | Home',
          'projets.html': 'Projects — KrazyDev | Krazy Studio Bot & KM-Plugins',
          'skills.html': 'Stack & Services — KrazyDev | Languages, Security, Infra',
          'contact.html': 'Contact — KrazyDev | KrazyMan_off aka Sasha'
        };
        if (T[p]) t.textContent = T[p];
      }
    } else {
      // restauration FR = contenu d'origine
      list.forEach(function (e) {
        if (!e.sel) return;
        q(e.sel).forEach(restoreEl);
      });
      q('footer').forEach(restoreEl);
      q('.badge').forEach(restoreEl);
      q('.st-chip').forEach(restoreEl);
      q('.dl-btn').forEach(restoreEl);
      q('.nav-links a').forEach(restoreEl);

      var hp2 = document.getElementById('lang-toggle');
      if (hp2) hp2.querySelector('span').textContent = 'FR';
      if (document.documentElement) document.documentElement.lang = 'fr';
      var t2 = document.querySelector('title');
      if (t2) {
        var o = saved.get(t2);
        if (o && o.text !== undefined) t2.textContent = o.text;
      }
    }
  }

  // ---------- Popup + bouton ----------
  function ensureLangUI() {
    var nav = document.querySelector('.nav-links');
    if (nav && !document.getElementById('lang-toggle')) {
      var b = document.createElement('button');
      b.id = 'lang-toggle';
      b.type = 'button';
      b.title = 'Language / Langue';
      b.innerHTML = '🌐 <span>' + (CUR === 'en' ? 'EN' : 'FR') + '</span>';
      b.addEventListener('click', openPicker);
      nav.appendChild(b);
    }
    if (!document.getElementById('lang-picker')) {
      var p = document.createElement('div');
      p.id = 'lang-picker';
      p.innerHTML =
        '<div class="lang-box">' +
        '<h3>🌐 Language / Langue</h3>' +
        '<p>Choose your language &middot; Choisissez votre langue</p>' +
        '<div class="lang-choices">' +
        '<button type="button" class="lang-btn" data-lang="fr"><span class="f">🇫🇷</span><span>Français<small>French &middot; default</small></span></button>' +
        '<button type="button" class="lang-btn" data-lang="en"><span class="f">🇬🇧</span><span>English<small>English</small></span></button>' +
        '</div>' +
        '<button type="button" class="lang-skip" id="lang-skip">Skip &middot; Passer</button>' +
        '</div>';
      document.body.appendChild(p);
      p.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var l = btn.getAttribute('data-lang');
          try { localStorage.setItem(LS, l); } catch (e) {}
          CUR = l;
          apply(l);
          closePicker();
          var tg = document.getElementById('lang-toggle');
          if (tg) tg.querySelector('span').textContent = l === 'en' ? 'EN' : 'FR';
        });
      });
      var skip = document.getElementById('lang-skip');
      if (skip) skip.addEventListener('click', function () {
        try { sessionStorage.setItem('krazydev_lang_session', CUR); } catch (e) {}
        closePicker();
      });
      var sugg = CUR;
      p.querySelector('.lang-btn[data-lang="' + sugg + '"]').classList.add('suggested');
    }
  }
  function openPicker() {
    var p = document.getElementById('lang-picker');
    if (p) p.classList.add('open');
  }
  function closePicker() {
    var p = document.getElementById('lang-picker');
    if (p) p.classList.remove('open');
  }

  // ---------- Boot ----------
  function boot() {
    ensureLangUI();
    apply(CUR);
    var shown = false;
    try { shown = !!localStorage.getItem(LS) || !!sessionStorage.getItem('krazydev_lang_session'); } catch (e) {}
    if (!shown) openPicker();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();