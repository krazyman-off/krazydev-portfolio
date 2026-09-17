// KrazyDev — Easter Egg System
// Tohka Yatogami — sigil de la Princesse des Étoiles (Sandalphon)
(function(){
  if(location.pathname.includes('secret.html')) return;

  // — SVG cristal : facettes d'une Spirit Crystal (violet/gold) —
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
      '<path d="M32 2 L47 18 L60 32 L47 46 L32 62 L17 46 L4 32 L17 18 Z" '+
        'fill="url(#egCrystal)" stroke="rgba(245,195,78,.85)" stroke-width="1.1" stroke-linejoin="round"/>'+
      '<polygon points="32,2 17,18 32,20" fill="rgba(255,255,255,.16)"/>'+
      '<polygon points="32,2 47,18 32,20" fill="rgba(255,255,255,.32)"/>'+
      '<polygon points="17,18 4,32 32,20" fill="rgba(255,255,255,.10)"/>'+
      '<polygon points="47,18 60,32 32,20" fill="rgba(255,255,255,.22)"/>'+
      '<polygon points="32,62 17,46 32,42" fill="rgba(8,3,26,.26)"/>'+
      '<polygon points="32,62 47,46 32,42" fill="rgba(8,3,26,.44)"/>'+
      '<polygon points="17,46 4,32 32,42" fill="rgba(8,3,26,.32)"/>'+
      '<polygon points="47,46 60,32 32,42" fill="rgba(8,3,26,.54)"/>'+
      '<path d="M32 2 L32 62 M32 20 L17 18 M32 20 L47 18 M32 20 L4 32 M32 20 L60 32 M32 42 L17 46 M32 42 L47 46 M32 42 L4 32 M32 42 L60 32" '+
        'stroke="rgba(255,255,255,.22)" stroke-width=".5" fill="none"/>'+
      '<ellipse cx="32" cy="33" rx="9" ry="15" fill="url(#egCore)" opacity=".75"/>'+
      '<polygon points="32,2 40,15 32,17" fill="rgba(255,255,255,.28)"/>'+
      '<g stroke="rgba(255,255,255,.95)" stroke-width="1" stroke-linecap="round">'+
        '<path d="M46 10 L50 10 M48 8 L48 12"/>'+
        '<path d="M54 20 L57 20 M55.5 18.5 L55.5 21.5" stroke="rgba(245,195,78,.8)"/>'+
        '<path d="M12 44 L15 44 M13.5 42.5 L13.5 45.5"/>'+
      '</g>'+
    '</svg>';

  const crystal=document.createElement('div');
  crystal.className='spirit-crystal';
  crystal.title='???';
  crystal.innerHTML='<span class="sigil">'+CRYSTAL_SVG+'</span>';
  crystal.addEventListener('click',function(){
    if(this.dataset.eg==='1') return;
    this.dataset.eg='1';
    trigger(this);
  });
  document.body.appendChild(crystal);

  // — Animation d'éclatement (~5s) ———
  function trigger(el){
    const size=36;
    const r=el.getBoundingClientRect();
    const startX=r.left, startY=r.top;

    // verrouillé en position absolue mesurée
    el.style.bottom='auto'; el.style.right='auto';
    el.style.left=startX+'px'; el.style.top=startY+'px';
    void el.offsetWidth; // reflow

    // 1. charge (0–0.7s)
    el.classList.add('charge');

    // 2. migration au centre + agrandissement (0.7–1.7s)
    setTimeout(()=>{
      el.style.transition='left .9s cubic-bezier(.2,.9,.25,1), top .9s cubic-bezier(.2,.9,.25,1), transform .9s cubic-bezier(.2,.9,.25,1)';
      el.style.left=(innerWidth/2-size/2)+'px';
      el.style.top=(innerHeight/2-size/2)+'px';
      el.style.transform='scale(9)';
    },700);

    // 3. fissures (1.5s)
    setTimeout(()=>{
      const cracks=document.createElement('div');
      cracks.className='crystal-cracks';
      cracks.innerHTML=crackSVG();
      el.appendChild(cracks);
      requestAnimationFrame(()=>cracks.classList.add('on'));
    },1500);

    // 4. tremblement violent + lueur (1.7–3s)
    setTimeout(()=>el.classList.add('shake'),1700);

    // 5. flash + dissipation (3–5s)
    setTimeout(()=>{
      const flash=document.createElement('div');
      flash.id='eg-flash';
      document.body.appendChild(flash);
      requestAnimationFrame(()=>flash.classList.add('on'));
      setTimeout(()=>flash.classList.add('off'),250);
    },3000);

    setTimeout(()=>{
      el.style.transition='transform .5s ease, opacity .5s ease';
      el.classList.add('gone');
    },3700);

    // 6. redirection (~5s)
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
      if(icon){ trigger(icon); icon.dataset.eg='1'; }
    }
  });
})();