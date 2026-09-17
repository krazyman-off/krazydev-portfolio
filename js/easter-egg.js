// KrazyDev — Easter Egg System
// Tohka Yatogami — sigil de la Princesse des Étoiles (Sandalphon)
(function(){
  if(location.pathname.includes('secret.html')) return;

  // — Sigil SVG : étoile centrale (Tohka) + lame Sandalphon + cercle runique
  const CRYSTAL_SVG =
    '<svg viewBox="0 0 64 64">'+
      '<defs>'+
        '<linearGradient id="egStar" x1="0" y1="0" x2="1" y2="1">'+
          '<stop offset="0" stop-color="#f5c34e"/>'+
          '<stop offset=".5" stop-color="#a855f7"/>'+
          '<stop offset="1" stop-color="#d946ef"/>'+
        '</linearGradient>'+
        '<linearGradient id="egBlade" x1="0" y1="0" x2="0" y2="1">'+
          '<stop offset="0" stop-color="rgba(245,195,78,.5)"/>'+
          '<stop offset="1" stop-color="rgba(245,195,78,.15)"/>'+
        '</linearGradient>'+
      '</defs>'+
      '<circle cx="32" cy="32" r="29" fill="none" stroke="rgba(168,85,247,.75)" stroke-width="1.4" stroke-dasharray="9 6 4 6"/>'+
      '<circle cx="32" cy="32" r="23" fill="none" stroke="rgba(217,70,239,.4)" stroke-width="1"/>'+
      '<path d="M32 4 L33.6 18 L30.4 18 Z" fill="url(#egBlade)" stroke="rgba(245,195,78,.55)" stroke-width="1"/>'+
      '<path d="M32 46 L33.6 60 L30.4 60 Z" fill="url(#egBlade)" stroke="rgba(245,195,78,.55)" stroke-width="1"/>'+
      '<path d="M32 13 L36.6 26 L50 28.3 L40 37.7 L42.8 51 L32 43.8 L21.2 51 L24 37.7 L14 28.3 L27.4 26 Z" '+
        'fill="url(#egStar)" stroke="rgba(245,195,78,.85)" stroke-width="1"/>'+
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
    const size=30;
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