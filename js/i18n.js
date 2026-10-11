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
      { sel: 'footer', en: 'Made with ♥ by <b style="color:var(--red)">KrazyMan_off</b> aka Sasha — KrazyDev • 2023-2026 • <a href="index.html">Home</a> • <a href="projets.html">Projects</a> • <a href="skills.html">Stack</a> • <a href="contact.html">Contact</a> • <a href="servers.html">Servers</a>' }
    ],
    home: [
      { sel: '.hero > div:nth-of-type(1) .kicker', en: '● Available • Portfolio v2 • 2023 — 2026 • Prod ready' },
      { sel: '.hero > div:nth-of-type(1) p.subtitle', en: 'I build <b>infrastructure that holds up in production</b>: a Discord bot that handles thousands of members without breaking a sweat, and a suite of Paper plugins that keeps Minecraft servers lag-free. No fluff, just code that ships.' },
      { sel: '.hero-cta a:nth-of-type(1)', en: 'View projects ↓' },
      { sel: '.hero-cta a:nth-of-type(2)', en: 'My stack' },
      { sel: '.hero > div:nth-of-type(1) > p:nth-of-type(1)', en: 'aka SASHA — CYBERSECURITY & DEV' },
      { sel: '.stats .stat:nth-of-type(1) span', en: 'Ecosystems' },
      { sel: '.stats .stat:nth-of-type(2) span', en: 'KM Plugins' },
      { sel: '.stats .stat:nth-of-type(3) span', en: 'Years maintained' },
      { sel: '.stats .stat:nth-of-type(4) span', en: 'Files' },
      { sel: '.terminal .term-body > div:nth-of-type(5)', en: 'drwxr <b>Krazy-Studio-Bot</b> <span style="color:#f5c34e">confidential</span> — 12 cogs • WAL' },
      { sel: '.terminal .term-body > div:nth-of-type(10)', en: '<span style="color:#a855f7">● 3 years of continuous maintenance</span>' },
      { sel: '.wrap > .section:nth-of-type(1) h2', en: 'About — Who is KrazyMan_off?' },
      { sel: '.wrap > .section:nth-of-type(1) p.lead', en: 'Behind KrazyDev there is Sasha — passionate, stubborn, and obsessed with the detail that keeps a project alive in production.' },
      { sel: '.two-col > .card:first-child > p:nth-of-type(1)', en: 'My name is <b>Sasha</b>, aka <b>KrazyMan_off</b> (KrazyDev). I have been coding since 2023 with one obsession: <b>building things that do not break when they scale</b>.' },
      { sel: '.two-col > .card:first-child > p:nth-of-type(2)', en: 'I started with a Discord bot for my community, then a Minecraft plugin for my server. 3 years later it became 2 complete ecosystems: maintained, documented, used in production. Not abandoned POCs after two weeks.' },
      { sel: '.two-col > .card:first-child > p:nth-of-type(3)', en: 'My credo: <b>anti-abuse from day one</b>, clean permissions, usable logs, forensics, and performance. I would rather spend 2 hours securing a feature than 10 hours putting out a raid at 3 a.m.' },
      { sel: '.two-col > .card:first-child > div', en: '<span class="tag">Rigorous</span><span class="tag">Prod-first</span><span class="tag">Self-taught</span><span class="tag">Maintainer</span><span class="tag">Community-driven</span>' },
      { sel: '.stack-side .skill:nth-of-type(1) h4', en: '▸ What I don\u2019t do' },
      { sel: '.stack-side .skill:nth-of-type(1) p', en: 'No copy-pasting tutorials. No "it works on my machine". Every plugin is built, tested, versioned. Every cog is logged.' },
      { sel: '.stack-side .skill:nth-of-type(2) h4', en: '▸ Values' },
      { sel: '.stack-side .skill:nth-of-type(2) ul', en: '<li>Readable code &gt; clever code</li><li>Security by default</li><li>Docs &amp; support</li><li>Long term</li>' },
      { sel: '.stack-side .skill:nth-of-type(3) h4', en: '▸ In numbers' },
      { sel: '.stack-side .skill:nth-of-type(3) p', en: '2023 → 2026 : 3 years<br>15+ plugins • 12 cogs<br>60k+ cumulative files<br>Discord : discord.gg/45Dc3UZ726' },
      { sel: '.wrap > .section:nth-of-type(1) .nav-arrows a', en: 'View my projects →' },
      { sel: '.wrap > .section:nth-of-type(2) h2', en: 'Explore' },
      { sel: '.wrap > .section:nth-of-type(2) p.lead', en: 'Four dedicated pages.' },
      { sel: '.page-grid .page-card:nth-of-type(1) h3', en: 'Projects' },
      { sel: '.page-grid .page-card:nth-of-type(1) p', en: 'Krazy Studio Bot & KM-Plugins in detail: architecture, features, plugins, stacks.' },
      { sel: '.page-grid .page-card:nth-of-type(1) .pc-go', en: 'Open →' },
      { sel: '.page-grid .page-card:nth-of-type(2) h3', en: 'Stack' },
      { sel: '.page-grid .page-card:nth-of-type(2) p', en: 'Languages, cybersecurity, infra, services — what I master and what I can do for you.' },
      { sel: '.page-grid .page-card:nth-of-type(2) .pc-go', en: 'Open →' },
      { sel: '.page-grid .page-card:nth-of-type(3) h3', en: 'Contact' },
      { sel: '.page-grid .page-card:nth-of-type(3) p', en: 'Discord, email, quotes. Shall we work together?' },
      { sel: '.page-grid .page-card:nth-of-type(3) .pc-go', en: 'Open →' },
      { sel: '.page-grid .page-card:nth-of-type(4) h3', en: 'Servers' },
      { sel: '.page-grid .page-card:nth-of-type(4) p', en: 'Krazy MC (Minecraft Java 1.21.10, beta) & Roblox soon. Pick your playground.' },
      { sel: '.page-grid .page-card:nth-of-type(4) .pc-go', en: 'Open →' },
      { sel: '.wrap > .section:nth-of-type(3) h2', en: 'In brief' },
      { sel: '.projects .card:nth-of-type(1) h3', en: 'Krazy Studio Bot' },
      { sel: '.projects .card:nth-of-type(1) .links-a', en: 'Details →' },
      { sel: '.projects .card:nth-of-type(1) p', en: 'Python 3.13 • discord.py 2.7 • SQLite WAL • Tickets V2, Anti-Raid, TempVoc, 20-option Polls, Automod, Logs, Levels, Economy, Forensics.' },
      { sel: '.projects .card:nth-of-type(2) h3', en: 'KM-Plugins' },
      { sel: '.projects .card:nth-of-type(2) .links-a', en: 'Details →' },
      { sel: '.projects .card:nth-of-type(2) p', en: 'Java 17 • Paper/Spigot • Maven — 15 plugins: KM-AC (8,608 files), KM-Login, KM-Perms, KM-AntiBots, KM-Moderations…' },
      { sel: '.wrap > .section:nth-of-type(4) .cta h3', en: 'Let\u2019s work together?' },
      { sel: '.wrap > .section:nth-of-type(4) .cta p', en: 'Simplest: Discord. Fast reply, no ghost form.' },
      { sel: '.wrap > .section:nth-of-type(4) .cta .btn-ghost', en: 'Contact page' },
      { sel: '.motor-teaser .mt-txt', en: '<b>KM-MOTOR GAMES is coming</b> — 100% Rust Minecraft proxy + engine. <a href="projets.html#game-filter">See the teaser →</a>' }
    ],
    proj: [
      { sel: '.wrap > div:nth-of-type(1) .kicker', en: '/projects — 02' },
      { sel: '.wrap > div:nth-of-type(1) h1', en: 'The <em>projects</em>' },
      { sel: '.wrap > div:nth-of-type(1) .subtitle', en: '1 confidential flagship + 12 free plugins. Updates tracked in <b style="color:var(--red)">updates.yml</b>.' },
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
      { sel: '#family-filter .filter-label', en: 'Project:' },
      { sel: '#family-filter [data-family-filter="all"]', en: 'All' },
      { sel: '#game-filter .filter-label', en: 'Game:' },
      { sel: '#game-filter [data-game-filter="all"]', en: 'All' },
      { sel: '#motor-teaser h3', en: 'KM-MOTOR GAMES — soon' },
      { sel: '#motor-teaser p', en: 'Ultra-fast Minecraft proxy + custom game engine, 100% Rust. Family: KM-Motor Games · Game: Minecraft.' },
      { sel: '#motor-teaser a', en: 'Notify me →' },
      { sel: '#game-teaser h3', en: '🔒 NOT HERE YET' },
      { sel: '#game-teaser p', en: 'The next game isn\'t here yet. Come back soon.' },
      { sel: '#game-teaser a', en: 'Notify me →' },
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
      { sel: '#cf-nom', attr: 'placeholder', en: 'Your name' },
      { sel: '#cf-email', attr: 'placeholder', en: 'you@email.com' },
      { sel: '#cf-sujet', attr: 'placeholder', en: 'Ex: Discord bot quote, KM-Plugins, audit…' },
      { sel: '#cf-msg', attr: 'placeholder', en: 'Describe your project: what you want, deadlines, budget…' },
      { sel: 'label[for="cf-nom"]', en: 'Name' },
      { sel: 'label[for="cf-email"]', en: 'Email (reply)' },
      { sel: 'label[for="cf-sujet"]', en: 'Subject' },
      { sel: 'label[for="cf-msg"]', en: 'Message' },
      { sel: '.form-actions .btn-primary', en: 'Send message ↦' },
      { sel: '.form-note', en: '🔒 Protected by anti-spam honeypot — your data goes straight to my inbox.' },
      { sel: '.wrap > .section:nth-of-type(4) h2', en: 'Why contact me?' },
      { sel: '.why-grid .mini:nth-of-type(1)', en: '<b>🤖 You want a Discord bot that holds up</b><p style="opacity:.6;margin-top:4px">Tickets, anti-raid, tempvoc, economy — custom or based on Krazy Studio Bot.</p>' },
      { sel: '.why-grid .mini:nth-of-type(2)', en: '<b>⛏️ You are building a bot-proof Minecraft server</b><p style="opacity:.6;margin-top:4px">KM-Plugins or a hardened custom Paper setup.</p>' },
      { sel: '.why-grid .mini:nth-of-type(3)', en: '<b>🛡️ You want a security audit</b><p style="opacity:.6;margin-top:4px">I comb through your server/bot and bring back a report + patches.</p>' },
      { sel: '.why-grid .mini:nth-of-type(4)', en: '<b>📈 You want a Rust portfolio</b><p style="opacity:.6;margin-top:4px">Axum server, rate-limit, security headers, multi-page static — like this page.</p>' },
      { sel: '.wrap > .section:nth-of-type(4) .nav-arrows .btn-primary', en: 'Back to home →' }
    ],
    'servers.html': [
      { sel: '#srv-kicker', en: '/servers — 05' },
      { sel: '#srv-title', en: 'Our <em>servers</em>' },
      { sel: '#srv-sub', en: 'Minecraft & Roblox — pick your playground.' },
      { sel: '#srv-rb-badge', en: 'SOON' },
      { sel: '#srv-filter-label', en: 'Game' },
      { sel: '#srv-mc-badges', en: '<span class="badge badge-dev">BETA</span><span class="badge badge-public">JAVA 1.21.10</span><span class="badge badge-maintenu">BEDROCK SOON</span>' },
      { sel: '#srv-mc-status', en: 'IN BETA — SERVER OPEN' },
      { sel: '#srv-mc-tag', en: 'Your adventure, your rules, your legend.' },
      { sel: '#srv-mc-intro', en: 'Welcome to <b>Krazy MC</b>, an ever-evolving Minecraft Java server where every player can find their own playground. Whether you are into building, competitive play, or just looking for a community to have fun with, Krazy MC opens its doors to you.' },
      { sel: '#srv-fact-v', en: 'Current version' },
      { sel: '#srv-fact-m', en: 'Open modes' },
      { sel: '#srv-fact-a', en: 'Stress-tested' },
      { sel: '#srv-ip-label', en: 'SERVER IP' },
      { sel: '#srv-copy-btn', en: 'Copy IP' },
      { sel: '#srv-mc-cta-discord', en: 'Join on Discord ↗' },
      { sel: '#srv-mc-cta-contact', en: 'Ask a question →' },
      { sel: '#srv-modes-title', en: 'Game modes for everyone' },
      { sel: '#srv-mode-smp', en: '<span class="m-ico">🌍</span><h3>SMP</h3><p>Build your own story, take on ambitious projects and grow your adventure. With clans and custom features, your experience evolves as you progress.</p>' },
      { sel: '#srv-mode-mini', en: '<span class="m-ico">🎮</span><h3>Mini-games</h3><p>Take on challenges, face other players and discover modes like BedWars, currently in development.</p>' },
      { sel: '#srv-mode-pvp', en: '<span class="m-ico">⚔️</span><h3>Ranked PvP <span class="badge badge-maintenu" id="srv-pvp-badge" style="font-size:.62rem;vertical-align:middle">SOON</span></h3><p>Get ready to climb the ranks, face opponents and prove your skills in a competitive system.</p>' },
      { sel: '#srv-evol', en: '<h3 style="font-size:1.05rem">⚙️ A server that evolves with you</h3><p style="opacity:.7;font-size:.9rem;margin-top:8px;line-height:1.7">Krazy MC runs plugins personally developed by its creator, including in <b>Rust</b>, for original mechanics. In SMP, systems like heat and cold management add depth without turning every session into a chore. Ranks, clans and much more complete the experience.</p>' },
      { sel: '#srv-commu', en: '<h3 style="font-size:1.05rem">🤝 Built for the community</h3><p style="opacity:.7;font-size:.9rem;margin-top:8px;line-height:1.7">Builders, fighters or chill players: everyone finds their place and plays at their own pace. Zone protections preserve the most ambitious SMP builds. Special events, temporary bonuses and earnable ranks will come with the community.</p>' },
      { sel: '#srv-saisons', en: '<h3 style="font-size:1.05rem">🎃 A world that follows the seasons</h3><p style="opacity:.7;font-size:.9rem;margin-top:8px;line-height:1.7">Lobbies and some mini-game maps change with seasons and events. Halloween is coming: a themed map is in the works. More seasonal atmospheres will follow.</p>' },
      { sel: '#srv-anticheat', en: '<h3 style="font-size:1.05rem">🛡️ Monitored, crafted gameplay</h3><p style="opacity:.7;font-size:.9rem;margin-top:8px;line-height:1.7">A home-grown anti-cheat, developed and stress-tested to catch suspicious behavior while limiting false positives. Goal: a playing field as fair as possible.</p>' },
      { sel: '#srv-java', en: '<h3 style="font-size:1.05rem">💻 Java today, Bedrock next</h3><p style="opacity:.7;font-size:.9rem;margin-top:8px;line-height:1.7">Playable on <b>Minecraft Java Edition 1.21.10</b>. Bedrock support is planned, with careful mini-game balancing to narrow the gap between platforms — plus tweaks to help controller beginners enjoy combat without any edge over veterans.</p>' },
      { sel: '#srv-beta-title', en: 'Krazy MC is in beta' },
      { sel: '#srv-beta-txt', en: 'The server is continuously developed, tested and improved. Bugs may remain, features land gradually. Join the adventure and help grow the community.' },
      { sel: '#srv-beta-cta', en: 'Join the adventure ↗' },
      { sel: '#srv-rb-soon', en: 'COMING SOON' },
      { sel: '#srv-rb-title', en: 'Roblox is coming' },
      { sel: '#srv-rb-txt', en: 'Something is brewing on the Roblox side. The project is in the works — stay tuned on Discord to be first in line when it opens.' },
      { sel: '#srv-rb-cta', en: 'Keep me posted ↗' },
      { sel: '#srv-join-title', en: 'How to join?' },
      { sel: '#srv-join-1', en: '<span class="srv-step-num">STEP 01</span><b>💻 Get your game ready</b><p style="opacity:.65;margin-top:6px">Minecraft Java Edition, version <b>1.21.10</b>.</p>' },
      { sel: '#srv-join-2', en: '<span class="srv-step-num">STEP 02</span><b>💬 Hop on Discord</b><p style="opacity:.65;margin-top:6px">Copy the IP above or grab it on Discord, along with all access info.</p>' },
      { sel: '#srv-join-3', en: '<span class="srv-step-num">STEP 03</span><b>⛏️ Join the adventure</b><p style="opacity:.65;margin-top:6px">Connect and pick your mode: SMP, mini-games, and soon ranked PvP.</p>' },
      { sel: '#srv-halloween', en: '<div class="gt-lock">🎃</div><div><h3>Halloween is coming</h3><p>A themed map is in the works to bring a fresh vibe to the server. Stay tuned — more seasonal changes will follow.</p></div>' },
      { sel: '#srv-faq-title', en: 'Frequently asked questions' },
      { sel: '#srv-faq-1', en: '<summary>Which version do I need to play?</summary><p class="faq-a">Minecraft Java Edition, version 1.21.10. Bedrock support is planned for later.</p>' },
      { sel: '#srv-faq-2', en: '<summary>How do I get the server IP?</summary><p class="faq-a">The IP is shown at the top of this page ("Copy IP" button) — it is also shared on Discord.</p>' },
      { sel: '#srv-faq-3', en: '<summary>Is the server finished?</summary><p class="faq-a">No — Krazy MC is in beta. Bugs may remain and new features land gradually.</p>' },
      { sel: '#srv-faq-4', en: '<summary>How do I protect my build?</summary><p class="faq-a">Zone protections can be set up to preserve ambitious SMP projects. Just ask on Discord.</p>' },
      { sel: '#srv-faq-5', en: '<summary>Will there be events?</summary><p class="faq-a">Yes: special events, temporary bonuses, earnable ranks and seasonal maps (Halloween in the works) will come with the community.</p>' },
      { sel: '#srv-faq-6', en: '<summary>Are cracked versions accepted?</summary><p class="faq-a">Yes, but with protections: premium usernames and skins are shielded from stealing, double accounts get banned and VPNs are detected.</p>' },
      { sel: '#srv-secu-title', en: 'Security & anti-DDoS' },
      { sel: '#srv-secu-sub', en: 'Why exposing the IP does not take the server down.' },
      { sel: '#srv-secu-1', en: '<h3 style="font-size:1.05rem">🦀 100% isolated Rust proxy</h3><p style="opacity:.7;font-size:.9rem;margin-top:8px;line-height:1.7">Every request goes through a Rust-coded proxy, 100% isolated from the backend servers. The real infrastructure is never directly exposed to players.</p>' },
      { sel: '#srv-secu-2', en: '<h3 style="font-size:1.05rem">🧪 Tested to the extreme</h3><p style="opacity:.7;font-size:.9rem;margin-top:8px;line-height:1.7">Anti-DDoS proven under extreme conditions, including scenarios that will never happen. Home-made plugins compiled as Rust .exe, built to take hits.</p>' },
      { sel: '#srv-secu-3', en: '<h3 style="font-size:1.05rem">📝 Monitored connections</h3><p style="opacity:.7;font-size:.9rem;margin-top:8px;line-height:1.7">Connections temporarily logged to spot suspicious behavior and react fast, without impacting legitimate players.</p>' },
      { sel: '#srv-secu-4', en: '<h3 style="font-size:1.05rem">🎭 Anti-impersonation</h3><p style="opacity:.7;font-size:.9rem;margin-top:8px;line-height:1.7">Premium usernames and skins shielded from stealing, double accounts banned from proxy and mini-games, VPNs detected by KM-Login.</p>' },
      { sel: '#srv-rules-title', en: 'Server rules' },
      { sel: '#srv-rules-list', en: '<div class="srv-rule"><span class="srv-rule-n">01</span><div><h4>No cheating</h4><p>Mods, hacks and exploits of any kind: the home-made anti-cheat watches and punishes.</p></div></div><div class="srv-rule"><span class="srv-rule-n">02</span><div><h4>No impersonation</h4><p>Premium account usernames and skins are protected, even on cracked versions.</p></div></div><div class="srv-rule"><span class="srv-rule-n">03</span><div><h4>One account</h4><p>Double accounts are detected and banned from the proxy and mini-games.</p></div></div><div class="srv-rule"><span class="srv-rule-n">04</span><div><h4>No VPNs</h4><p>Automatically detected by KM-Login. Play on your real connection.</p></div></div><div class="srv-rule"><span class="srv-rule-n">05</span><div><h4>Respect builds</h4><p>Griefing and stealing are forbidden; protected zones are untouchable.</p></div></div><div class="srv-rule"><span class="srv-rule-n">06</span><div><h4>Respect players</h4><p>Harassment, insults and toxic behavior get punished.</p></div></div>' },
      { sel: '#srv-rules-note', en: 'Full rules available on Discord.' },
      { sel: '#srv-road-title', en: 'Roadmap' },
      { sel: '#srv-step-1', en: '<div class="srv-dot">🧪</div><div><h4>In the works</h4><p>Concepts and prototypes cooking in the KrazyDev labs.</p></div>' },
      { sel: '#srv-step-2', en: '<div class="srv-dot">📣</div><div><h4>Announcement</h4><p>Project reveal on Discord — be the first to know.</p></div>' },
      { sel: '#srv-step-3', en: '<div class="srv-dot">🧑‍🤝‍🧑</div><div><h4>Closed beta</h4><p>Testing with the community before opening to the public.</p></div>' },
      { sel: '#srv-step-4', en: '<div class="srv-dot">🚀</div><div><h4>Launch</h4><p>Public opening of the Roblox server.</p></div>' }
    ]
  };

  // ---------- Remplacements de petits labels ----------
  var BADGES = {
    '● MAINTENU — 2023-2026': '● MAINTAINED — 2023-2026',
    'CONFIDENTIEL — Repo privé': 'CONFIDENTIAL — Private repo',
    'CONFIDENTIEL': 'CONFIDENTIAL',
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
  var NAV = { 'index.html': 'Home', 'projets.html': 'Projects', 'skills.html': 'Stack', 'contact.html': 'Contact', 'servers.html': 'Servers' };

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
    var key = { 'index.html': 'home', 'projets.html': 'proj', 'skills.html': 'skill', 'contact.html': 'cont' }[p] || p;
    var en = lang === 'en';
    var list = [];
    (EN.global || []).forEach(function (e) { list.push(e); });
    (EN[key] || []).forEach(function (e) { list.push(e); });

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
        if (el.closest && el.closest('#subgrid')) return;
        var k = el.textContent.trim();
        if (BADGES[k] !== undefined) {
          saveOrig(el, 'text', el.textContent);
          el.textContent = BADGES[k];
        }
      });

      q('.st-chip').forEach(function (el) {
        if (el.closest && el.closest('#subgrid')) return;
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
        if (el.closest && el.closest('#subgrid')) return;
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
          'contact.html': 'Contact — KrazyDev | KrazyMan_off aka Sasha',
          'servers.html': 'Servers — KrazyDev | Krazy MC & Roblox'
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
    document.dispatchEvent(new CustomEvent('krazydev:lang', { detail: { lang: lang } }));
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