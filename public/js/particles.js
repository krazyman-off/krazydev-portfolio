/* =====================================================================
 * KRAZY Engine v2 — fond animé premium (monochrome, sans dépendance)
 * ---------------------------------------------------------------------
 * Couches : 0 nébuleuse (orbes) · 1 étoiles · 2 constellation + souris ·
 * 3 météores (pool) · 4 ondes de choc (pool).
 * Perf : sprites pré-rendus, delta-time, DPR plafonné, densité mobile,
 * pause onglet caché, prefers-reduced-motion → 1 frame figée.
 * ===================================================================== */
(function () {
  'use strict';

  /* ---- 0. Config ------------------------------------------------------ */
  var CFG = {
    dprMax: 1.5,
    linkDist: 150,
    mouseDist: 170,
    meteorsEvery: [2500, 6000],
    wavesEvery: [6000, 11000],
    mobile: window.innerWidth < 700
  };
  var N_STAR = CFG.mobile ? 60 : 130;
  var N_NODE = CFG.mobile ? 22 : 44;
  var N_ORB = CFG.mobile ? 7 : 13;
  var POOL_METEOR = 3;
  var POOL_WAVE = 2;

  /* ---- 1. Utils -------------------------------------------------------- */
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

  /* ---- 2. Canvas -------------------------------------------------------- */
  var c = document.getElementById('particles');
  if (!c) return;
  var ctx = c.getContext('2d');
  var W = 0, H = 0;
  var reduced = false;
  try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, CFG.dprMax);
    W = window.innerWidth; H = window.innerHeight;
    c.width = Math.floor(W * dpr); c.height = Math.floor(H * dpr);
    c.style.width = W + 'px'; c.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  /* ---- 3. Sprite radial pré-rendu --------------------------------------- */
  var sprite = document.createElement('canvas');
  sprite.width = sprite.height = 128;
  (function () {
    var g = sprite.getContext('2d');
    var gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(0.25, 'rgba(255,255,255,.55)');
    gr.addColorStop(0.6, 'rgba(255,255,255,.12)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
  })();
  function blit(x, y, r, alpha) {
    ctx.globalAlpha = alpha;
    ctx.drawImage(sprite, x - r, y - r, r * 2, r * 2);
    ctx.globalAlpha = 1;
  }

  /* ---- 4. Entités -------------------------------------------------------- */
  var stars = [], nodes = [], orbs = [], i;
  for (i = 0; i < N_STAR; i++) {
    stars.push({ x: Math.random() * W, y: Math.random() * H,
      r: rnd(0.5, 1.9), ph: Math.random() * 6.28, sp: rnd(0.5, 1.8),
      dx: rnd(-3.6, 3.6), dy: rnd(-2.4, 1.2) });
  }
  for (i = 0; i < N_NODE; i++) {
    nodes.push({ x: Math.random() * W, y: Math.random() * H,
      vx: rnd(-17, 17), vy: rnd(-17, 17), r: rnd(1, 2.2) });
  }
  for (i = 0; i < N_ORB; i++) {
    orbs.push({ x: Math.random() * W, y: Math.random() * H,
      r: rnd(90, 260), vx: rnd(-7, 7), vy: rnd(-5, 5),
      a: rnd(0.06, 0.13), ph: Math.random() * 6.28, sp: rnd(0.25, 0.7) });
  }
  // Pools réutilisés (zéro allocation pendant l'animation).
  var meteors = [], waves = [];
  for (i = 0; i < POOL_METEOR; i++) meteors.push({ on: false });
  for (i = 0; i < POOL_WAVE; i++) waves.push({ on: false });

  function fireMeteor() {
    for (var k = 0; k < meteors.length; k++) {
      if (!meteors[k].on) {
        var m = meteors[k];
        var fromLeft = Math.random() < 0.5;
        var sp = rnd(420, 720);
        m.on = true; m.life = 1;
        m.x = fromLeft ? rnd(-100, W * 0.4) : rnd(W * 0.6, W + 100);
        m.y = rnd(-60, H * 0.35);
        m.vx = (fromLeft ? 1 : -1) * sp;
        m.vy = sp * rnd(0.32, 0.45);
        return;
      }
    }
  }
  function fireWave() {
    for (var k = 0; k < waves.length; k++) {
      if (!waves[k].on) {
        var wv = waves[k];
        wv.on = true; wv.r = 10; wv.a = 0.28;
        wv.x = rnd(W * 0.2, W * 0.8); wv.y = rnd(H * 0.2, H * 0.8);
        return;
      }
    }
  }

  /* ---- 5. Souris + parallaxe --------------------------------------------- */
  var mouse = { x: -9999, y: -9999, px: 0, py: 0 };
  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX; mouse.y = e.clientY;
    mouse.px = e.clientX / W - 0.5; mouse.py = e.clientY / H - 0.5;
  });
  document.addEventListener('mouseleave', function () { mouse.x = -9999; mouse.y = -9999; });

  /* ---- 6. Rendu par couche ------------------------------------------------- */
  function drawOrbs(dt, px, py, time) {
    var k, o, R;
    ctx.globalCompositeOperation = 'lighter';
    for (k = 0; k < orbs.length; k++) {
      o = orbs[k];
      o.x += o.vx * dt; o.y += o.vy * dt;
      if (o.x < -o.r) o.x = W + o.r; else if (o.x > W + o.r) o.x = -o.r;
      if (o.y < -o.r) o.y = H + o.r; else if (o.y > H + o.r) o.y = -o.r;
      R = o.r * (1 + Math.sin(time * o.sp + o.ph) * 0.12);
      blit(o.x + px * 0.4, o.y + py * 0.4, R, o.a);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawStars(dt, px, py, time) {
    for (var s = 0; s < stars.length; s++) {
      var st = stars[s];
      st.x += st.dx * dt; st.y += st.dy * dt;
      if (st.x < 0) st.x = W; else if (st.x > W) st.x = 0;
      if (st.y < 0) st.y = H; else if (st.y > H) st.y = 0;
      var tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * st.sp + st.ph));
      blit(st.x + px * 0.7, st.y + py * 0.7, st.r * 4, tw * 0.85);
    }
  }

  function drawNet(dt, px, py) {
    var i2, j, dx, dy, d;
    for (i2 = 0; i2 < nodes.length; i2++) {
      var p = nodes[i2];
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }
    ctx.lineWidth = 1;
    for (i2 = 0; i2 < nodes.length; i2++) {
      for (j = i2 + 1; j < nodes.length; j++) {
        var a = nodes[i2], b = nodes[j];
        dx = a.x - b.x; dy = a.y - b.y; d = Math.sqrt(dx * dx + dy * dy);
        if (d < CFG.linkDist) {
          ctx.strokeStyle = 'rgba(255,255,255,' + ((1 - d / CFG.linkDist) * 0.24).toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(a.x + px, a.y + py); ctx.lineTo(b.x + px, b.y + py);
          ctx.stroke();
        }
      }
      var q = nodes[i2];
      dx = q.x - mouse.x; dy = q.y - mouse.y;
      d = Math.sqrt(dx * dx + dy * dy);
      if (d < CFG.mouseDist) {
        ctx.strokeStyle = 'rgba(255,255,255,' + ((1 - d / CFG.mouseDist) * 0.55).toFixed(3) + ')';
        ctx.beginPath(); ctx.moveTo(q.x + px, q.y + py); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    for (i2 = 0; i2 < nodes.length; i2++) {
      var n = nodes[i2];
      dx = n.x - mouse.x; dy = n.y - mouse.y;
      var near = (dx * dx + dy * dy) < 28900;
      var r = near ? n.r * 3.2 : n.r * 2.6;
      blit(n.x + px, n.y + py, r, near ? 1 : 0.75);
    }
  }

  function drawMeteors(dt) {
    for (var k = 0; k < meteors.length; k++) {
      var m = meteors[k];
      if (!m.on) continue;
      m.x += m.vx * dt; m.y += m.vy * dt; m.life -= dt * 0.75;
      if (m.life <= 0 || m.x < -200 || m.x > W + 200 || m.y > H + 200) { m.on = false; continue; }
      var tx = m.x - m.vx * 0.15, ty = m.y - m.vy * 0.15;
      var grad = ctx.createLinearGradient(m.x, m.y, tx, ty);
      grad.addColorStop(0, 'rgba(255,255,255,' + (0.9 * m.life).toFixed(3) + ')');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(tx, ty); ctx.stroke();
      blit(m.x, m.y, 9, m.life);
    }
  }

  function drawWaves(dt) {
    for (var k = 0; k < waves.length; k++) {
      var wv = waves[k];
      if (!wv.on) continue;
      wv.r += dt * 260; wv.a -= dt * 0.09;
      if (wv.a <= 0) { wv.on = false; continue; }
      ctx.strokeStyle = 'rgba(255,255,255,' + wv.a.toFixed(3) + ')';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(wv.x, wv.y, wv.r, 0, 6.2832); ctx.stroke();
    }
  }

  /* ---- 7. Boucle (delta-time, pause, 1 frame si réduit) -------------------- */
  var last = 0, nextMeteor = 0, nextWave = 0, time = 0;
  function frame(now) {
    var dt = Math.min((now - last) / 1000 || 0.016, 0.05);
    last = now; time += dt;
    ctx.clearRect(0, 0, W, H);
    var px = mouse.px * 14, py = mouse.py * 14;
    drawOrbs(dt, px, py, time);
    drawStars(dt, px, py, time);
    drawNet(dt, px, py);
    if (!CFG.mobile) {
      if (now > nextMeteor) { fireMeteor(); nextMeteor = now + rnd(CFG.meteorsEvery[0], CFG.meteorsEvery[1]); }
      if (now > nextWave) { fireWave(); nextWave = now + rnd(CFG.wavesEvery[0], CFG.wavesEvery[1]); }
      drawMeteors(dt);
      drawWaves(dt);
    }
    if (!reduced) requestAnimationFrame(frame);
  }

  if (reduced) { frame(16); }
  else requestAnimationFrame(frame);
})();
