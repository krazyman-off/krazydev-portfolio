// KrazyDev — Easter Egg System
// Tohka Yatogami — Spirit Crystal (fragment)
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

  // — anneau d'énergie (dans le body, indépendant de l'échelle) —
  function ring(x,y,opts){
    opts=opts||{};
    const d=document.createElement('div');
    d.className='sigil-ring'+(opts.gold?' gold':'');
    d.style.setProperty('--s1',opts.size||'160px');
    d.style.setProperty('--dur',(opts.dur||.7)+'s');
    d.style.left=x+'px'; d.style.top=y+'px';
    document.body.appendChild(d);
    requestAnimationFrame(()=>d.classList.add('ring'));
    setTimeout(()=>d.remove(),(opts.dur||.7)*1000+200);
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
      setTimeout(()=>s.remove(),1100);
    }
  }

  // — éclatement en fragments —
  function shatter(x,y){
    const bx=['linear-gradient(135deg,#d946ef,#a855f7)','linear-gradient(135deg,#a855f7,#7c3aed)','linear-gradient(135deg,#f5c34e,#d946ef)'];
    for(let i=0;i<11;i++){
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

  // — flash plein écran —
  function flash(){
    const f=document.createElement('div');
    f.id='eg-flash';
    document.body.appendChild(f);
    requestAnimationFrame(()=>requestAnimationFrame(()=>f.classList.add('on')));
    setTimeout(()=>f.classList.add('off'),260);
    setTimeout(()=>f.remove(),1600);
  }

  // ===== séquence principale (~5s) =====
  function trigger(el){
    const size=36;
    const r=el.getBoundingClientRect();
    const sx=r.left, sy=r.top;
    const cx=innerWidth/2, cy=innerHeight/2;

    el.style.bottom='auto'; el.style.right='auto';
    el.style.left=sx+'px'; el.style.top=sy+'px';
    void el.offsetWidth;

    // — 1. CHARGE (0–0.8s) : il tourne, vibre, émet des anneaux —
    el.classList.add('charge');
    const chargeTimer=setInterval(()=>ring(sx+size/2,sy+size/2,{size:'120px',dur:rand(.45,.65),gold:true}),230);
    setTimeout(()=>{ clearInterval(chargeTimer); sparks(cx,cy,8,90); },820);

    // — 2. VOL vers le centre (0.82–1.85s) : glisse + grossit + tourne —
    setTimeout(()=>{
      el.classList.add('flying');
      el.style.transition='left .95s cubic-bezier(.22,1,.36,1), top .95s cubic-bezier(.22,1,.36,1), transform .95s cubic-bezier(.34,1.56,.64,1)';
      el.style.left=(cx-size/2)+'px';
      el.style.top=(cy-size/2)+'px';
      el.style.transform='scale(9)';
      setTimeout(()=>ring(cx,cy,{size:'280px',dur:1.1,gold:true}),900);
    },820);

    // — 3. IMPACT / micro-rebond (1.95s) : le cristal "tombe" —
    setTimeout(()=>{
      el.style.transition='transform .16s cubic-bezier(.34,1.56,.64,1)';
      el.style.transform='scale(9.4)';
    },1950);
    setTimeout(()=>{
      el.style.transform='scale(9)';
      ring(cx,cy,{size:'400px',dur:1});
      ring(cx,cy,{size:'220px',dur:.8,gold:true});
      sparks(cx,cy,16,150);
    },2120);

    // — 4. FISSURES + tremblement (2.5s) —
    setTimeout(()=>{
      const cracks=document.createElement('div');
      cracks.className='crystal-cracks';
      cracks.innerHTML=crackSVG();
      el.appendChild(cracks);
      requestAnimationFrame(()=>cracks.classList.add('on'));
      el.classList.add('shake');
      sparks(cx,cy,8,120);
    },2450);

    // — 5. ÉCLATEMENT (3.35s) : les fragments volent —
    setTimeout(()=>{
      el.classList.remove('shake');
      el.classList.add('sharded');
      shatter(cx,cy);
      ring(cx,cy,{size:'520px',dur:1,gold:true});
      ring(cx,cy,{size:'300px',dur:.8});
      sparks(cx,cy,26,260);
    },3350);
    setTimeout(()=>flash(),3500);
    setTimeout(()=>sparks(cx,cy,20,200),3900);
    setTimeout(()=>sparks(cx,cy,14,260),4300);

    // — 6. REDIRECTION (~5s) —
    setTimeout(()=>{ window.location.href='secret.html'; },5000);
  }

  // — SVG de fissures : lignes brisées éclatant depuis le centre —
  function crackSVG(){
    const spokes=[
      '12,12 34,34 48,26 60,34',
      '52,12 36,32 46,46 58,52',
      '12,52 32,36 28,48 22,58',
      '52,52 34,34 40,24 54,18',
      '32,4 33,20 36,28',
      '32,60 31,44 28,36',
      '4,32 20,33 28,36',
      '60,32 44,31 36,28'
    ];
    let polylines='';
    spokes.forEach((pts,i)=>{
      const bright=i<4 ? 'rgba(255,255,255,.85)' : 'rgba(245,195,78,.55)';
      const glow=i<4 ? 'rgba(168,85,247,.4)' : 'rgba(217,70,239,.3)';
      polylines+=
        '<polyline points="'+pts+'" fill="none" stroke="'+glow+'" stroke-width="2.5"/>'+
        '<polyline points="'+pts+'" fill="none" stroke="'+bright+'" stroke-width=".9"/>';
    });
    return '<svg viewBox="0 0 64 64">'+polylines+'</svg>';
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