// KrazyDev — moteur de fond premium : nébuleuse + constellation + météores.
// Monochrome (blanc/argent), sans lib. Parallaxe souris, pause onglet caché,
// mouvement réduit respecté, densité adaptative mobile.
(function () {
  var c = document.getElementById('particles');
  if (!c) return;
  var ctx = c.getContext('2d');
  var W = 0, H = 0, DPR = 1;
  var reduced = false;
  try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    W = window.innerWidth; H = window.innerHeight;
    c.width = Math.floor(W * DPR); c.height = Math.floor(H * DPR);
    c.style.width = W + 'px'; c.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  var small = W < 700;
  var N_STAR = small ? 60 : 130;
  var N_NODE = small ? 22 : 44;
  var N_ORB = small ? 7 : 13;

  function rnd(a, b) { return a + Math.random() * (b - a); }

  // Sprite radial pré-rendu (perf : drawImage au lieu de gradients live).
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

  var stars = [], nodes = [], orbs = [], meteors = [];
  var i;
  for (i = 0; i < N_STAR; i++) {
    stars.push({ x: Math.random() * W, y: Math.random() * H,
      r: rnd(0.5, 1.9), ph: Math.random() * 6.28, sp: rnd(0.008, 0.03),
      dx: rnd(-0.06, 0.06), dy: rnd(-0.04, 0.02) });
  }
  for (i = 0; i < N_NODE; i++) {
    nodes.push({ x: Math.random() * W, y: Math.random() * H,
      vx: rnd(-0.28, 0.28), vy: rnd(-0.28, 0.28), r: rnd(1, 2.2) });
  }
  var ORB_TINTS = [[255, 255, 255], [203, 213, 225], [148, 163, 184]];
  for (i = 0; i < N_ORB; i++) {
    orbs.push({ x: Math.random() * W, y: Math.random() * H,
      r: rnd(90, 260), vx: rnd(-0.12, 0.12), vy: rnd(-0.09, 0.09),
      a: rnd(0.05, 0.11), ph: Math.random() * 6.28,
      sp: rnd(0.004, 0.012), tint: ORB_TINTS[i % ORB_TINTS.length] });
  }

  var mouse = { x: -9999, y: -9999, px: 0, py: 0 };
  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX; mouse.y = e.clientY;
    mouse.px = (e.clientX / W - 0.5);
    mouse.py = (e.clientY / H - 0.5);
  });
  document.addEventListener('mouseleave', function () { mouse.x = -9999; mouse.y = -9999; });

  var nextMeteor = 0, t = 0;
  function spawnMeteor(now) {
    var fromLeft = Math.random() < 0.5;
    var sp = rnd(7, 12);
    meteors.push({
      x: fromLeft ? rnd(-100, W * 0.4) : rnd(W * 0.6, W + 100),
      y: rnd(-60, H * 0.35),
      vx: (fromLeft ? 1 : -1) * sp, vy: sp * rnd(0.32, 0.45),
      life: 1
    });
    nextMeteor = now + rnd(3500, 9000);
  }

  function frame(now) {
    t += 0.016;
    ctx.clearRect(0, 0, W, H);

    // Parallaxe : chaque couche suit la souris avec un facteur différent.
    var px = mouse.px * 14, py = mouse.py * 14;

    // 1) Orbes nébuleuse (derrière tout).
    ctx.globalCompositeOperation = 'lighter';
    for (var k = 0; k < orbs.length; k++) {
      var o = orbs[k];
      o.x += o.vx; o.y += o.vy;
      if (o.x < -o.r) o.x = W + o.r; if (o.x > W + o.r) o.x = -o.r;
      if (o.y < -o.r) o.y = H + o.r; if (o.y > H + o.r) o.y = -o.r;
      var breathe = 1 + Math.sin(t * o.sp * 60 + o.ph) * 0.12;
      var R = o.r * breathe;
      ctx.globalAlpha = o.a;
      ctx.drawImage(sprite, o.x - R + px * 0.4, o.y - R + py * 0.4, R * 2, R * 2);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    // 2) Étoiles scintillantes.
    for (var s = 0; s < stars.length; s++) {
      var st = stars[s];
      st.x += st.dx; st.y += st.dy;
      if (st.x < 0) st.x = W; if (st.x > W) st.x = 0;
      if (st.y < 0) st.y = H; if (st.y > H) st.y = 0;
      var tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * st.sp * 60 + st.ph));
      ctx.globalAlpha = tw * 0.8;
      var sr = st.r * 4;
      ctx.drawImage(sprite, st.x - sr + px * 0.7, st.y - sr + py * 0.7, sr * 2, sr * 2);
    }
    ctx.globalAlpha = 1;

    // 3) Constellation + interaction souris.
    var i2, j, dx, dy, d;
    for (i2 = 0; i2 < nodes.length; i2++) {
      var p = nodes[i2];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }
    ctx.lineWidth = 1;
    for (i2 = 0; i2 < nodes.length; i2++) {
      for (j = i2 + 1; j < nodes.length; j++) {
        var a = nodes[i2], b = nodes[j];
        dx = a.x - b.x; dy = a.y - b.y; d = Math.sqrt(dx * dx + dy * dy);
        if (d < 150) {
          ctx.strokeStyle = 'rgba(255,255,255,' + ((1 - d / 150) * 0.22).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(a.x + px, a.y + py);
          ctx.lineTo(b.x + px, b.y + py); ctx.stroke();
        }
      }
      // Lien vers la souris : la constellation réagit au visiteur.
      dx = nodes[i2].x - mouse.x; dy = nodes[i2].y - mouse.y;
      d = Math.sqrt(dx * dx + dy * dy);
      if (d < 170) {
        ctx.strokeStyle = 'rgba(255,255,255,' + ((1 - d / 170) * 0.5).toFixed(3) + ')';
        ctx.beginPath(); ctx.moveTo(nodes[i2].x + px, nodes[i2].y + py);
        ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    for (i2 = 0; i2 < nodes.length; i2++) {
      var q = nodes[i2];
      dx = q.x - mouse.x; dy = q.y - mouse.y;
      var near = (dx * dx + dy * dy) < 28900;
      var qr = (near ? q.r * 2.2 : q.r * 2.6);
      ctx.globalAlpha = near ? 1 : 0.75;
      ctx.drawImage(sprite, q.x - qr + px, q.y - qr + py, qr * 2, qr * 2);
    }
    ctx.globalAlpha = 1;

    // 4) Météores.
    if (!small && now > nextMeteor) spawnMeteor(now);
    for (var mI = meteors.length - 1; mI >= 0; mI--) {
      var mt = meteors[mI];
      mt.x += mt.vx; mt.y += mt.vy; mt.life -= 0.012;
      if (mt.life <= 0 || mt.x < -200 || mt.x > W + 200 || mt.y > H + 200) {
        meteors.splice(mI, 1); continue;
      }
      var tx = mt.x - mt.vx * 9, ty = mt.y - mt.vy * 9;
      var grad = ctx.createLinearGradient(mt.x, mt.y, tx, ty);
      grad.addColorStop(0, 'rgba(255,255,255,' + (0.9 * mt.life).toFixed(3) + ')');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(mt.x, mt.y); ctx.lineTo(tx, ty); ctx.stroke();
      ctx.globalAlpha = mt.life;
      ctx.drawImage(sprite, mt.x - 9, mt.y - 9, 18, 18);
      ctx.globalAlpha = 1;
    }

    if (!reduced) requestAnimationFrame(function (n) { frame(n || 0); });
  }

  if (reduced) { frame(performance.now()); }
  else requestAnimationFrame(function (n) { frame(n || 0); });
})();
