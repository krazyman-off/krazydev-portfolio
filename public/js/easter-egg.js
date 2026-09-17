// KrazyDev — Easter Egg System
// Tohka Yatogami — Spirit Crystal (fragment)
// Séquence cinématique progressive (~6s) : éveil → ascension → fissures → éclatement → voile
(function(){
  if(location.pathname.includes('secret.html')) return;

  // — SVG cristal fragmenté : arêtes cassées, facettes, fissure dorée, cœur lumineux
  const CRYSTAL_SVG =
    '<svg viewBox="0 0 64 64">'+
      '<defs>'+
        '<linearGradient id="egCrystal" x1="0" y1="0" x2="1" y2="1">'+
          '<stop offset="0" stop-color="#d946ef"/>'+
          '<stop offset=".45" stop-color="#a855f7"/>'+
          '<stop offset="1" stop-color="#7c3aed"/>'+
        '</linearGradient>'+
        '<radialGradient id="egCore" cx=".5" cy=".5" r=".5">'+
          '<stop offset="0" stop-color="#fff"/>'+
          '<stop offset=".35" stop-color="rgba(217,70,239,.9)"/>'+
          '<stop offset="1" stop-color="rgba(168,85,247,0)"/>'+
        '</radialGradient>'+
      '</defs>'+
      '<path d="M32 3 L45 13 L54 26 L49 40 L58 49 L40 60 L32 54 L24 62 L15 50 L21 38 L9 30 L18 17 Z" '+
        'fill="url(#egCrystal)" stroke="rgba(245,195,78,.8)" stroke-width="1" stroke-linejoin="round"/>'+
      '<polygon points="32,3 45,13 32,22" fill="rgba(255,255,255,.30)"/>'+
      '<polygon points="32,3 18,17 32,22" fill="rgba(255,255,255,.14)"/>'+
      '<polygon points="45,13 54,26 36,30" fill="rgba(255,255,255,.18)"/>'+
      '<polygon points="18,17 9,30 28,32" fill="rgba(255,255,255,.08)"/>'+
      '<polygon points="54,26 49,40 36,38" fill="rgba(8,3,26,.16)"/>'+
      '<polygon points="49,40 58,49 40,52 36,44" fill="rgba(8,3,26,.30)"/>'+
      '<polygon points="40,60 32,54 32,44 40,52" fill="rgba(8,3,26,.38)"/>'+
      '<polygon points="15,50 21,38 28,40 24,52" fill="rgba(8,3,26,.24)"/>'+
      '<polygon points="24,62 32,54 32,44" fill="rgba(8,3,26,.46)"/>'+
      '<path d="M32 3 L32 54 M32 22 L45 13 M32 22 L18 17 M32 30 L49 40 M32 30 L21 38 M32 44 L49 40 M32 44 L21 38 M36 38 L54 26 M28 32 L9 30" '+
        'stroke="rgba(255,255,255,.20)" stroke-width=".5" fill="none"/>'+
      '<path d="M34 10 L29 26 L38 40 L33 52" stroke="rgba(245,195,78,.55)" stroke-width="1" fill="none" stroke-linejoin="round"/>'+
      '<ellipse cx="32" cy="34" rx="8" ry="13" fill="url(#egCore)" opacity=".8"/>'+
      '<polygon points="32,3 40,14 32,17" fill="rgba(255,255,255,.30)"/>'+
      '<g stroke="rgba(255,255,255,.95)" stroke-width="1" stroke-linecap="round">'+
        '<path d="M46 8 L50 8 M48 6 L48 10"/>'+
        '<path d="M55 20 L58 20 M56.5 18.5 L56.5 21.5" stroke="rgba(245,195,78,.85)"/>'+
        '<path d="M10 44 L13 44 M11.5 42.5 L11.5 45.5"/>'+
      '</g>'+
    '</svg>';

  const crystal=document.createElement('div');
  crystal.className='spirit-crystal';
  crystal.title='???';
  crystal.innerHTML='<span class="sigil">'+CRYSTAL_SVG+'</span>';
  crystal.addEventListener('click',()=>{
    if(crystal.dataset.eg) return;
    crystal.dataset.eg='1';
    trigger(crystal);
  });
  document.body.appendChild(crystal);

  // ===== helpers aléatoires =====
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const rand=(mi,ma)=>mi+Math.random()*(ma-mi);

  // — anneau d'énergie (dans le body, indépendant de l'échelle du cristal) —
  function ring(x,y,opts){
    opts=opts||{};
    const d=document.createElement('div');
    d.className='sigil-ring'+(opts.gold?' gold':'');
    d.style.setProperty('--s1',opts.size||'160px');
    d.style.setProperty('--dur',(opts.dur||.7)+'s');
    d.style.left=x+'px'; d.style.top=y+'px';
    document.body.appendChild(d);
    requestAnimationFrame(()=>d.classList.add('ring'));
    setTimeout(()=>d.remove(),(opts.dur||.7)*1000+250);
  }

  // — pluie d'étincelles —
  function sparks(x,y,n,power){
    const cols=['#f5c34e','#a855f7','#d946ef','#ffffff','#e9d5ff'];
    for(let i=0;i<n;i++){
      const s=document.createElement('div');
      s.className='eg-spark';
      const a=Math.random()*Math.PI*2;
      const dist=(Math.random()*.7+.3)*power;
      const size=rand(2,5);
      s.style.setProperty('--dx',Math.cos(a)*dist+'px');
      s.style.setProperty('--dy',Math.sin(a)*dist+'px');
      s.style.setProperty('--s',size+'px');
      s.style.setProperty('--dur',rand(.4,.9)+'s');
      s.style.setProperty('--clr',pick(cols));
      s.style.left=x+'px'; s.style.top=y+'px';
      document.body.appendChild(s);
      requestAnimationFrame(()=>s.classList.add('anim'));
      setTimeout(()=>s.remove(),1200);
    }
  }

  // — éclatement en fragments (vague de n morceaux) —
  function shatter(x,y,n){
    const bx=['linear-gradient(135deg,#d946ef,#a855f7)','linear-gradient(135deg,#a855f7,#7c3aed)','linear-gradient(135deg,#f5c34e,#d946ef)'];
    for(let i=0;i<n;i++){
      const f=document.createElement('div');
      f.className='eg-shard';
      const a=Math.random()*Math.PI*2;
      const dist=rand(90,280);
      const rot=rand(160,540)*(pick([-1,1]));
      f.style.setProperty('--dx',Math.cos(a)*dist+'px');
      f.style.setProperty('--dy',Math.sin(a)*dist-rand(20,80)+'px');
      f.style.setProperty('--rot',rot+'deg');
      f.style.setProperty('--sc',rand(.3,1.1)+'');
      f.style.setProperty('--w',rand(10,20)+'px');
      f.style.setProperty('--h',rand(16,30)+'px');
      f.style.setProperty('--dur',rand(1.1,1.6)+'s');
      f.style.setProperty('--bg',pick(bx));
      f.style.left=x+'px'; f.style.top=y+'px';
      document.body.appendChild(f);
      requestAnimationFrame(()=>f.classList.add('anim'));
      setTimeout(()=>f.remove(),1900);
    }
  }

  // — léger voile d'ambiance qui s'épaissit pendant la séquence —
  function dimTo(el,v){ el.style.opacity=v; }

  // ===== séquence principale (~6s, tout est progressif) =====
  function trigger(el){
    const size=36;
    const r=el.getBoundingClientRect();
    const sx=r.left, sy=r.top;
    const cx=innerWidth/2, cy=innerHeight/2;

    el.style.bottom='auto'; el.style.right='auto';
    el.style.left=sx+'px'; el.style.top=sy+'px';
    void el.offsetWidth;

    // voile d'ambiance
    const dim=document.createElement('div');
    dim.id='eg-dim';
    document.body.appendChild(dim);

    // halo d'énergie derrière le cristal
    const halo=document.createElement('div');
    halo.className='eg-halo';
    halo.style.left=cx+'px'; halo.style.top=cy+'px';
    document.body.appendChild(halo);

    // — 1. ÉVEIL (0–1.2s) : le cristal s'illumine doucement, anneaux dorés —
    dimTo(dim,.22);
    el.classList.add('charge','wake');
    ring(sx+size/2,sy+size/2,{size:'150px',dur:.8,gold:true});
    setTimeout(()=>ring(sx+size/2,sy+size/2,{size:'110px',dur:.7,gold:true}),420);

    // — 2. ASCENSION (1.2–2.8s) : déplacement + agrandissement CONTINUS et synchrones —
    setTimeout(()=>{
      el.classList.add('flying');
      el.style.transition='left 1.6s cubic-bezier(.45,0,.15,1), top 1.6s cubic-bezier(.45,0,.15,1), transform 1.6s cubic-bezier(.45,0,.15,1), opacity .5s ease, filter .8s ease';
      el.style.left=(cx-size/2)+'px';
      el.style.top=(cy-size/2)+'px';
      el.style.transform='scale(9)';
      dimTo(dim,.5);
      halo.style.opacity='.9';
      halo.style.transform='translate(-50%,-50%) scale(1)';
      ring(sx+size/2,sy+size/2,{size:'170px',dur:.9});
      sparks(sx+size/2,sy+size/2,8,70);
    },1200);

    // — 3. ARRIVÉE (2.8s) : suspension douce, pas de rebond brutal —
    setTimeout(()=>{
      ring(cx,cy,{size:'330px',dur:.95});
      ring(cx,cy,{size:'190px',dur:.8,gold:true});
      sparks(cx,cy,10,130);
      halo.style.transition='transform .9s ease, opacity .9s ease';
      halo.style.transform='translate(-50%,-50%) scale(1.35)';
      halo.style.opacity='1';
    },2800);

    // — 4. FISSURES PROGRESSIVES (3.0s) : le cristal se fend morceau par morceau —
    setTimeout(()=>{
      buildSplit(el,cx,cy);
      el.classList.add('tremble-light','strained');
      dimTo(dim,.6);
    },3000);

    // — 4b. TENSION (3.9s) : tremblement plus fort, la lumière s'intensifie —
    setTimeout(()=>{
      el.classList.remove('tremble-light');
      el.classList.add('tremble-heavy');
      sparks(cx,cy,8,130);
    },3900);

    // — 5. ÉCLATEMENT EN VAGUES (4.3s puis 4.6s) : morceaux, pas tout d'un coup —
    setTimeout(()=>{
      shatter(cx,cy,5);
      sparks(cx,cy,12,160);
      ring(cx,cy,{size:'280px',dur:.9});
    },4300);
    setTimeout(()=>{
      el.classList.remove('tremble-heavy');
      el.classList.add('dissolve');
      shatter(cx,cy,6);
      sparks(cx,cy,20,220);
      ring(cx,cy,{size:'520px',dur:1,gold:true});
      halo.style.transition='transform .9s ease, opacity .9s ease';
      halo.style.transform='translate(-50%,-50%) scale(.2)';
      halo.style.opacity='0';
      const bloom=document.createElement('div');
      bloom.id='eg-bloom';
      document.body.appendChild(bloom);
      requestAnimationFrame(()=>requestAnimationFrame(()=>bloom.classList.add('on')));
      dimTo(dim,.85);
    },4600);

    // — 6. VOILE DE TRANSITION (5.1–6.0s) : masque le changement de page —
    setTimeout(()=>{
      const veil=document.createElement('div');
      veil.id='eg-veil';
      document.body.appendChild(veil);
      requestAnimationFrame(()=>requestAnimationFrame(()=>veil.classList.add('on')));
    },5100);

    // — 7. REDIRECTION (6.0s) : sous le voile, invisible —
    setTimeout(()=>{ window.location.href='secret.html'; },6000);
  }

  // — Fissures réalistes : le cristal se fend en 4 morceaux qui s'écartent
  // progressivement, la lumière intérieure jaillit par les failles —
  function buildSplit(el,cx,cy){
    const orig=el.querySelector('.sigil');
    const svgHTML=orig.innerHTML;
    const glow=document.createElement('div');
    glow.className='split-glow';
    el.appendChild(glow);
    const pieces=[
      {cls:'sp-top', t:100},
      {cls:'sp-right', t:350},
      {cls:'sp-bottom', t:600},
      {cls:'sp-left', t:850}
    ];
    pieces.forEach(p=>{
      const d=document.createElement('div');
      d.className='sp-piece '+p.cls;
      d.innerHTML=svgHTML;
      const s=d.querySelector('svg');
      if(s) s.style.transform='rotate(540deg)';
      el.appendChild(d);
    });
    orig.style.animation='none';
    orig.style.opacity='0';
    requestAnimationFrame(()=>glow.classList.add('on'));
    pieces.forEach(p=>{
      setTimeout(()=>{
        const d=el.querySelector('.'+p.cls);
        if(d) d.classList.add('go');
        sparks(cx,cy,3,70);
      },p.t);
    });
  }

  // — Konami Code → secret page —
  const konami=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let seq=[];
  addEventListener('keydown',function(e){
    seq.push(e.key); seq=seq.slice(-10);
    if(seq.join(',')===konami.join(',')){
      const icon=document.querySelector('.spirit-crystal');
      if(icon){ icon.dataset.eg='1'; trigger(icon); }
    }
  });
})();