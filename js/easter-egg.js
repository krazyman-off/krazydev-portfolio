// KrazyDev — Easter Egg System
// Tohka Yatogami Spirit Crystal
(function(){
  // Inject the spirit crystal icon on all pages (except secret.html)
  if(location.pathname.includes('secret.html')) return;

  const crystal=document.createElement('div');
  crystal.className='spirit-crystal';
  crystal.title='???';
  crystal.setAttribute('role','button');
  crystal.setAttribute('tabindex','-1');
  crystal.addEventListener('click',()=>{
    window.location.href='secret.html';
  });
  document.body.appendChild(crystal);

  // Konami Code → secret page
  const konami=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let seq=[];
  addEventListener('keydown',e=>{
    seq.push(e.key); seq=seq.slice(-10);
    if(seq.join(',')===konami.join(',')){
      // Spirit burst animation before redirect
      document.body.style.transition='filter .4s';
      document.body.style.filter='brightness(1.4) saturate(1.6)';
      setTimeout(()=>{
        document.body.style.filter='brightness(1.8) saturate(2)';
        setTimeout(()=> window.location.href='secret.html', 300);
      },200);
    }
  });
})();
