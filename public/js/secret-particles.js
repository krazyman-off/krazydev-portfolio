// KrazyDev — particules de la page secret.html (ex-script inline, sorti pour la CSP).
(function(){
  var canvas=document.createElement('canvas');
  canvas.id='secret-particles';
  document.body.appendChild(canvas);
  var ctx=canvas.getContext('2d');
  var W,H;
  var particles=[];
  function resize(){W=canvas.width=innerWidth;H=canvas.height=innerHeight;}
  resize(); addEventListener('resize',resize);

  function P(){
    this.reset();
  }
  P.prototype.reset=function(){
    this.x=Math.random()*W;this.y=H+Math.random()*60;
    this.r=Math.random()*2.5+.5;
    this.speed=Math.random()*.6+.15;
    this.opacity=Math.random()*.5+.1;
    this.hue=270+Math.random()*40-20;
    this.wobble=Math.random()*Math.PI*2;this.wobbleS=Math.random()*.02+.005;
  };
  P.prototype.update=function(){
    this.y-=this.speed;this.wobble+=this.wobbleS;
    this.x+=Math.sin(this.wobble)*.4;
    if(this.y<-10)this.reset();
  };
  P.prototype.draw=function(){
    ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
    ctx.fillStyle='hsla('+this.hue+',70%,70%,'+this.opacity+')';ctx.fill();
  };
  for(var i=0;i<80;i++)particles.push(new P);
  (function loop(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(function(p){p.update();p.draw();});
    requestAnimationFrame(loop);
  })();
})();
