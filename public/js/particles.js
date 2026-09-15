// elegant particle network — no lib needed
const c=document.getElementById('particles');
if(c){
  const ctx=c.getContext('2d');
  let W,H, pts=[];
  function resize(){ W=c.width=innerWidth; H=c.height=innerHeight; }
  addEventListener('resize',resize); resize();
  const N=Math.min(70, Math.floor(innerWidth/18));
  for(let i=0;i<N;i++) pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.45,vy:(Math.random()-.5)*.45,r:Math.random()*1.6+0.6});
  (function loop(){
    ctx.clearRect(0,0,W,H);
    pts.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>W) p.vx*=-1;
      if(p.y<0||p.y>H) p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle="rgba(255,65,95,.55)"; ctx.fill();
    });
    for(let i=0;i<N;i++) for(let j=i+1;j<N;j++){
      const a=pts[i], b=pts[j], d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<150){ ctx.strokeStyle=`rgba(255,40,80,${(1-d/150)*.16})`; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); }
    }
    requestAnimationFrame(loop);
  })();
}