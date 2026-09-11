// KrazyDev — animations pack XXL
// décor fin injecté (évite de dupliquer dans chaque page)
(function(){
  const vignette=document.createElement('div'); vignette.className='vignette'; document.body.appendChild(vignette);
})();

// loader
addEventListener('load',()=> setTimeout(()=> document.getElementById('loader')?.classList.add('hide'), 900));

// progress bar
addEventListener('scroll',()=>{
  const h=document.documentElement;
  const p=(h.scrollTop/(h.scrollHeight-h.clientHeight))*100;
  const bar=document.getElementById('progress');
  if(bar) bar.style.width=p+'%';
});

// reveal on scroll (staggered)
const reveals=document.querySelectorAll('.reveal');
const io=new IntersectionObserver((entries)=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      e.target.style.transitionDelay=(i%3)*0.08+'s';
      e.target.classList.add('visible');
    }
  });
},{threshold:.12});
reveals.forEach(el=>io.observe(el));

// typewriter
const tw=document.getElementById('typewriter');
if(tw){
  const phrases=["Cybersécurité • Bot Discord • Infra Minecraft","Rust/Axum • Python 3.13 • Java 17","Anti-Raid • Anti-Bot • Perf • Forensics"];
  let pi=0, ci=0, del=false;
  (function loop(){
    const cur=phrases[pi];
    if(!del){ tw.textContent=cur.slice(0,ci++); if(ci>cur.length){del=true; setTimeout(loop,1200); return;} }
    else { tw.textContent=cur.slice(0,ci--); if(ci<0){del=false; pi=(pi+1)%phrases.length; ci=0; } }
    setTimeout(loop, del?28:42);
  })();
}

// stats counter (trigger when visible)
const counters=document.querySelectorAll('[data-count]');
const co2=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting && !e.target.dataset.done){
      e.target.dataset.done=1;
      const target=parseInt(e.target.dataset.count);
      let cur=0; const step=Math.max(1,Math.floor(target/50));
      const id=setInterval(()=>{
        cur+=step; if(cur>=target){cur=target; clearInterval(id);}
        e.target.textContent=cur+(e.target.dataset.suffix||"");
      },18);
    }
  });
},{threshold:.6});
counters.forEach(el=>co2.observe(el));

// tilt 3D on cards
document.querySelectorAll('.card, .stat, .skill, .mini').forEach(card=>{
  card.classList.add('tilt');
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width -0.5;
    const y=(e.clientY-r.top)/r.height -0.5;
    card.style.transform=`perspective(800px) rotateX(${ -y*6}deg) rotateY(${x*8}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave',()=> card.style.transform='');
});

// custom cursor dot
const dot=document.createElement('div'); dot.className='cursor-dot'; document.body.appendChild(dot);
addEventListener('mousemove',e=>{ dot.style.left=e.clientX-4+'px'; dot.style.top=e.clientY-4+'px'; });
document.querySelectorAll('a, button, .card').forEach(el=>{
  el.addEventListener('mouseenter',()=> dot.style.transform='scale(2.2)');
  el.addEventListener('mouseleave',()=> dot.style.transform='scale(1)');
});

// parallax grid
let gy=0;
addEventListener('scroll',()=>{
  gy=scrollY*0.08;
  const g=document.querySelector('.grid-bg');
  if(g) g.style.transform=`translateY(${gy}px)`;
});

// multi-page: boutons "Précédent" — reviennent à la page d'avant (historique)
function goPrev(){
  const fallback = document.body.dataset.home === "skills" ? "index.html" : "index.html";
  if (history.length > 1) history.back();
  else location.href = fallback;
}
// Konami
let seq=[]; const konami=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
addEventListener('keydown',e=>{
  seq.push(e.key); seq=seq.slice(-10);
  if(seq.join(',')===konami.join(',')){
    document.body.style.filter="hue-rotate(90deg)";
    setTimeout(()=>document.body.style.filter="",2000);
    alert("KrazyDev mode activé 😎 — Sasha");
  }
});
