/* Core Home: demo logic. Animate transform and opacity only. Springs bounce .15 (milestone badge .3, once). */
(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const root=document.documentElement, phone=$('#phone'), P=new URLSearchParams(location.search);
const wait=ms=>new Promise(r=>setTimeout(r,ms));
let subOpen=false,subName='',outOpen=false,authOpen=false;
const S={ck:'both',canceled:[],credits:8,v:'c',brand:'xgt',longName:false,now:'next',joined:false,tab:'home',cls:'book',visits:2,goal:3};
let rm=false;

/* ---------- color math (lift dark brand colors on the dark base) ---------- */
const hex2rgb=h=>{h=h.replace('#','');if(h.length===3)h=[...h].map(c=>c+c).join('');const n=parseInt(h,16);return[n>>16&255,n>>8&255,n&255]};
const rgb2hex=c=>'#'+c.map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
const lin=c=>{c/=255;return c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4)};
const lum=c=>.2126*lin(c[0])+.7152*lin(c[1])+.0722*lin(c[2]);
const cr=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
function rgb2hsl([r,g,b]){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let h=0,s=0;const l=(mx+mn)/2;if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h/=6}return[h,s,l]}
function hsl2rgb([h,s,l]){const f=(p,q,t)=>{if(t<0)t+=1;if(t>1)t-=1;return t<1/6?p+(q-p)*6*t:t<.5?q:t<2/3?p+(q-p)*(2/3-t)*6:p};if(s===0){const v=l*255;return[v,v,v]}const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q;return[f(p,q,h+1/3)*255,f(p,q,h)*255,f(p,q,h-1/3)*255]}
const BASE=[6,16,36];
function lift(hex){const rgb=hex2rgb(hex);if(cr(rgb,BASE)>=3)return hex;let[h,s,l]=rgb2hsl(rgb);while(l<1){l+=.01;const c=hsl2rgb([h,s,l]);if(cr(c,BASE)>=4.5)return rgb2hex(c)}return '#ffffff'}
const onColor=hex=>{const c=hex2rgb(hex);return cr(c,[5,8,15])>=cr(c,[255,255,255])?'#05080F':'#FFFFFF'};

/* ---------- springs (CSS linear()) ---------- */
function spring(bounce,n=44){const z=1-bounce,w=2*Math.PI,pts=[];for(let i=0;i<=n;i++){const t=i/n;let x;if(z>=.999)x=1-Math.exp(-w*t)*(1+w*t);else{const wd=w*Math.sqrt(1-z*z);x=1-Math.exp(-z*w*t)*(Math.cos(wd*t)+(z*w/wd)*Math.sin(wd*t))}pts.push(+x.toFixed(4))}pts[n]=1;return 'linear('+pts.join(',')+')'}
(()=>{const ok=CSS.supports('transition-timing-function','linear(0,1)');if(!ok)return;const a=spring(.15);root.style.setProperty('--sp-tap',a);root.style.setProperty('--sp-sheet',a);root.style.setProperty('--sp-screen',a);root.style.setProperty('--sp-land',spring(.3))})();

/* ---------- content ---------- */
const PH={bands:'assets/photos/bands.jpg',cycle:'assets/photos/cycle.jpg',stretch:'assets/photos/stretch.jpg',run:'assets/photos/run.jpg',coach:'assets/photos/coach.jpg'};
const NOW_PH={next:'cycle',spot:'bands',first:'cycle',recap:'cycle',monthly:'stretch',usual:'cycle'};
const PROMOS=[
 {id:'challenge',photo:'bands',title:'The October Challenge starts now',line:"16 classes. 31 days. One finisher's wall.",meta:['Ends Oct 31','All members'],cta:'Join',kind:'challenge'},
 {id:'run',photo:'run',icon:'route',title:'Saturday Community Run',line:'Free community 5K. Every pace welcome.',meta:['Sat · 8:00 AM','Friends welcome'],cta:'Got it',kind:'info'},
 {id:'coach',photo:'coach',icon:'user',title:'Coach spotlight: Taylor Bailey',line:'The voice that gets you through the last thirty seconds.',meta:['Early classes','All members'],cta:'Got it',kind:'info'},
 {id:'hours',photo:null,icon:'clock',title:'Thanksgiving week hours',line:'Shorter days midweek. Closed Thursday.',meta:['Nov 23 to 27','All members'],rows:[['Mon Nov 23','5 AM – 9 PM'],['Tue Nov 24','5 AM – 9 PM'],['Wed Nov 25','6 AM – 6 PM'],['Thu Nov 26','Closed'],['Fri Nov 27','8 AM – 2 PM']],cta:'Got it',kind:'info'}
];
const ic=(n,c='')=>`<svg class="i ${c}"><use href="#i-${n}"/></svg>`;

/* ---------- brand ---------- */
function applyBrand(id){
  const b=BRANDS[id];S.brand=id;
  const nudgeOn=hex=>{const on=hex2rgb(onColor(hex)),dk=on[0]<128;let c=hex2rgb(hex),i=0;while(cr(c,on)<5&&i<24){c=c.map(v=>dk?v+(255-v)*.04:v*.96);i++}return rgb2hex(c)};
  const capG=hex=>{let c=hex2rgb(hex),i=0;const L=x=>cr(x,[0,0,0])*.05-.05;while(L(c)>.16&&i<30){c=c.map(v=>v*.92);i++}return rgb2hex(c)};
  const c1x=nudgeOn(lift(b.c1)),c2x=lift(b.c2);root.style.setProperty('--c1g',capG(c1x));root.style.setProperty('--c2g',capG(c2x));
  root.style.setProperty('--c1',b.c1);root.style.setProperty('--c2',b.c2);
  root.style.setProperty('--c1x',c1x);root.style.setProperty('--c2x',c2x);root.style.setProperty('--on1',onColor(c1x));
  {const base=hex2rgb(c1x),dk=onColor(c1x)==='#05080F',on=hex2rgb(onColor(c1x)),mx=(a,b,t)=>a.map((v,i)=>v*(1-t)+b[i]*t);
   let hi=dk?.24:.06,lo=dk?.14:.22;
   if(dk){while(lo>0&&cr(mx(base,[0,0,0],lo),on)<4.5)lo-=.01}else{while(hi>0&&cr(mx(base,[255,255,255],hi),on)<4.5)hi-=.01}
   root.style.setProperty('--btn-hi',(Math.max(0,hi)*100).toFixed(0)+'%');root.style.setProperty('--btn-lo',(Math.max(0,lo)*100).toFixed(0)+'%')}
  const hasLogo=!!b.hdr&&!S.longName;const showLoc=hasLogo&&b.loc,cname=hasLogo?(b.loc||''):(S.longName?LONG_NAME:b.name);$$('.club').forEach(c=>{c.classList.toggle('nologo',!hasLogo);c.classList.toggle('noloc',hasLogo&&!b.loc)});$$('.cn').forEach(e=>e.textContent=cname);
  $$('#bBrand [data-b]').forEach(x=>x.classList.toggle('on',x.dataset.b===id));
  $$('#bBrand [data-name]').forEach(x=>x.classList.toggle('on',S.longName));
  renderMarks();renderShare();measureLogo(b);
}
function fitMark(logo,o){const r=logo.w/logo.h;let h=Math.sqrt(o.area/r),w=h*r;if(h>o.maxH){h=o.maxH;w=h*r}if(o.minH&&h<o.minH){h=o.minH;w=h*r}if(w>o.maxW){w=o.maxW;h=w/r}return{w,h}}
function markCfg(slot){
  const k=slot.dataset.mk,W=slot.offsetWidth,H=slot.offsetHeight;
  if(k==='ring'){const D=Math.min(W,H);return{tiny:D<48,area:.26*D*D,maxW:.66*D,maxH:.4*D,font:Math.max(9,D*.17)}}
  if(k==='now')return{area:2600,maxW:W,maxH:H,font:11};
  if(k==='hdr')return{area:3000,maxW:140,maxH:42,minH:28,font:13,hdr:1};
  if(k==='sheet')return{area:7800,maxW:W,maxH:H,font:20};
  return{area:26000,maxW:W,maxH:H,font:34};
}
/* logoMode: plain | glow | tab. Share of logo pixels under 3:1 against the base: >90% light tab, >30% glow, else plain.
   Precomputed in brands.js; re-measured here when the canvas is readable (not on file://). ?logoMode= forces one. */
const LM={};
function logoMode(b){const f=P.get('logoMode');if(['plain','glow','tab'].includes(f))return f;return LM[b.id]||(b.hdr&&b.hdr.mode)||'glow'}
function measureLogo(b){
  if(!b.hdr||LM[b.id]==='x')return;const im=new Image();
  im.onload=()=>{try{const W=96,H=Math.max(1,Math.round(W*im.naturalHeight/im.naturalWidth)),c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');x.drawImage(im,0,0,W,H);const d=x.getImageData(0,0,W,H).data;let o=0,k=0;
    for(let i=0;i<d.length;i+=4){if(d[i+3]<128)continue;o++;if(cr([d[i],d[i+1],d[i+2]],[14,17,24])<3)k++}
    if(o){const fr=k/o;LM[b.id]=fr>.9?'tab':fr>.3?'glow':'plain';if(S.brand===b.id)$$('.hmark').forEach(sl=>sl.dataset.lm=logoMode(b))}}catch(e){LM[b.id]=b.hdr.mode}};
  im.src=b.hdr.src;
}
function renderMarks(root){
  const b=BRANDS[S.brand];
  $$('.mk-slot[data-mk],.ring .mk-slot',root||document).forEach(slot=>{
    if(!slot.dataset.mk)slot.dataset.mk='ring';
    const cfg=markCfg(slot);
    const el=document.createElement('div');el.className='mk';
    if(cfg.tiny){slot.innerHTML='';return}
    const lg=cfg.hdr?b.hdr:b.logo;
    if(cfg.hdr&&!lg){}
    else if(lg){const f=fitMark(lg,cfg);el.style.width=f.w+'px';el.style.height=f.h+'px';if(cfg.hdr){slot.style.width=f.w+'px';slot.style.height=f.h+'px';slot.dataset.lm=logoMode(b)}el.innerHTML=`<img src="${lg.src}" alt="${b.name} logo" draggable="false">`}
    else{el.classList.add('nm');el.style.fontSize=cfg.font+'px';el.innerHTML=b.mark.join('<br>');if(cfg.tiny)el.style.display='none'}
    $$('.mk',slot).forEach(o=>{o.classList.remove('on');setTimeout(()=>o.remove(),520)});
    slot.appendChild(el);requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add('on')));
  });
}

/* ---------- rings: two rotating halves, driven by transform ---------- */
/* Reactor dial (rings with data-dial): ticks, c2->c1 arc, white-hot tip with bloom, core glow that follows the fill.
   Still at rest. Only an event (check-in Discharge, fill-in) moves it. Geometry from Studio V3 (rc.js): ticks on a bezel, major every third. */
/* ticks = visits. One mark per visit of the goal; it lights when that visit is done. Rings with no goal get none. */
function dialTicks(goal){
  const g=Math.max(0,Math.min(7,goal|0));let h='';
  for(let i=0;i<g;i++){const f=(i+1)/g,a=f*Math.PI*2-Math.PI/2,r0=43.6,r1=49.4,c=Math.cos(a),n=Math.sin(a);
    h+=`<line class="m" style="--k:${f.toFixed(3)}" x1="${(c*r0).toFixed(2)}" y1="${(n*r0).toFixed(2)}" x2="${(c*r1).toFixed(2)}" y2="${(n*r1).toFixed(2)}"/>`}
  return `<svg class="dtk" viewBox="-50 -50 100 100" aria-hidden="true">${h}</svg>`;
}
function buildDial(el){
  const rs=+el.dataset.rs||96;el.style.setProperty('--rs',rs+'px');if(el.dataset.rw)el.style.setProperty('--rw',el.dataset.rw+'px');
  const c=el.dataset.core,core=c==='0'?'':(c==='cnt'?'<div class="rcore"><div class="cnt"></div></div>':'<div class="rcore"><div class="mk-slot" data-mk="ring"></div><div class="cnt"></div></div>');
  if(c==='cnt')el.classList.add('showcnt');
  el.classList.add('dial');
  el.innerHTML=dialTicks(+el.dataset.goal||0)+'<i class="dtr"></i>'+(c==='0'?'':'<i class="dcd"></i><i class="dcg"></i>')+'<div class="dgl"><i></i></div><div class="dgw"><i class="dar"></i><i class="dhl"></i><i class="dpl"></i></div><i class="dfl"></i><i class="dst"></i><i class="dtp"><b></b></i>'+core;
  ringRefs(el);ringSet(el,0);
}
function buildRing(el){
  if(el.dataset.dial)return buildDial(el);
  const rs=+el.dataset.rs||96;el.style.setProperty('--rs',rs+'px');if(el.dataset.rw)el.style.setProperty('--rw',el.dataset.rw+'px');
  const core=el.dataset.core==='0'?'':(el.dataset.core==='cnt'?'<div class="rcore"><div class="cnt"></div></div>':'<div class="rcore"><div class="mk-slot" data-mk="ring"></div><div class="cnt"></div></div>');
  if(el.dataset.core==='cnt')el.classList.add('showcnt');
  el.innerHTML='<i class="rt"></i><div class="rglow"><div class="rh r"><i class="rf"></i></div><div class="rh l"><i class="rf"></i></div></div><i class="rhd"></i>'+core;
  ringRefs(el);ringSet(el,0);
}
function ringRefs(el){
  if(el.classList.contains('dial')){el._d={ar:$('.dar',el),tp:$('.dtp',el),pl:$('.dpl',el),st:$('.dst',el),cg:$('.dcg',el),tk:$$('.dtk line',el),n:-1};return}
  el._r=$('.rh.r .rf',el);el._l=$('.rh.l .rf',el);el._h=$('.rhd',el)}
function dialSet(el,p){
  const d=el._d,deg=p*360,g=d.tk.length,n=g?Math.floor(p*g+1e-6):0;
  el.style.setProperty('--pa',deg.toFixed(2)+'deg');
  d.tp.style.transform=d.pl.style.transform=`rotate(${deg.toFixed(2)}deg)`;
  d.tp.style.visibility=d.st.style.visibility=p>0?'visible':'hidden';
  if(d.cg)d.cg.style.opacity=(.16+.84*p).toFixed(3);
  if(n!==d.n){d.tk.forEach((t,i)=>t.classList.toggle('on',i<n));d.n=n}
  el.style.setProperty('--pp',Math.max(p,.02).toFixed(3));el._p=p;el.dataset.p=p;
}
function ringSet(el,p){
  p=Math.max(0,Math.min(1,p));if(el._d)return dialSet(el,p);const a=Math.min(p,.5)*360,b=Math.max(p-.5,0)*360;
  el._r.style.transform=`rotate(${a}deg)`;el._l.style.transform=`rotate(${b}deg)`;
  el._r.parentNode.style.visibility=a>0?'visible':'hidden';el._l.parentNode.style.visibility=b>0?'visible':'hidden';
  el._h.style.transform=`rotate(${p*360}deg)`;el._h.style.visibility=(p>0&&p<1)?'visible':'hidden';el._p=p;el.dataset.p=p;
}
function ringAnim(el,to,ms=700){
  cancelAnimationFrame(el._raf);const from=el._p||0;
  if(rm||ms<=0){ringSet(el,to);return Promise.resolve()}
  const t0=performance.now();
  return new Promise(res=>{const f=t=>{const k=Math.min(1,(t-t0)/ms),e=1-Math.pow(1-k,3);ringSet(el,from+(to-from)*e);if(k<1)el._raf=requestAnimationFrame(f);else res()};el._raf=requestAnimationFrame(f)});
}

/* ---------- Now card ---------- */
let phIdx=0;
let spotT=0,spotEnd=0;
function spotTick(){const t=Math.max(0,Math.round((spotEnd-Date.now())/1000)),e=$('#spotCd');if(e)e.textContent=`${Math.floor(t/60)}:${String(t%60).padStart(2,'0')}`}
function setNow(s,instant){
  S.now=s;{const p=window.__p60;if(p){if(s==='next')p.state='booked';else if((s==='usual'||s==='first')&&p.state==='booked')p.state='book'}}
  clearInterval(spotT);if(s==='spot'){const c=CL('sat-st');c.state='book';c.spots=1;spotEnd=Date.now()+600000;spotT=setInterval(spotTick,1000);spotTick()}
  $$('.ns').forEach(e=>{e.classList.toggle('on',e.dataset.s===s);e.inert=e.dataset.s!==s});
  const a=$('#nph'+(phIdx^1)),b=$('#nph'+phIdx);phIdx^=1;
  a.style.backgroundImage=`url(${PH[NOW_PH[s]]})`;a.classList.add('on');b.classList.remove('on');
  $$('#bNow [data-now]').forEach(x=>x.classList.toggle('on',x.dataset.now===s));
  renderFeed();
}
function renderFeed(){
  const list=PROMOS;
  const f=list[0],rest=list.slice(1,4);
  const ph=p=>p.photo?`background-image:url(${PH[p.photo]})`:'';
  const feat=$('#feat'),row=$('#row');
  const html=`<i class="fp" style="${f.photo?ph(f):'background:linear-gradient(135deg,color-mix(in srgb,var(--c1x) 55%,#0a1020),color-mix(in srgb,var(--c2x) 55%,#0a1020))'}"></i>
   <div class="fg"><div class="ft">${f.title}</div>
   <div class="ff"><span class="fm">${f.meta[0]}</span><button class="btn p" data-pid="${f.id}">${f.id==='challenge'&&S.joined?'Joined':f.cta}</button></div></div>`;
  const rows=rest.map(p=>`<article class="rc" role="button" tabindex="0" data-pid="${p.id}"><div class="rp${p.photo?'':' fb'}" style="${p.photo?ph(p):''}">${p.photo?'':ic(p.icon)}</div><div class="rb"><div class="rt2">${p.title}</div><div class="rm2">${p.meta[0]}</div></div></article>`).join('');
  if(feat.dataset.id!==f.id||!feat.innerHTML){
    feat.dataset.id=f.id;feat.dataset.pid=f.id;feat.innerHTML=html;row.innerHTML=rows;
    [feat,row].forEach(e=>{e.style.animation='none';void e.offsetWidth;e.style.animation='lif .35s var(--ease) both'});
  }
}

/* Now card body tap: next class -> class sheet (Cancel lives there) */
document.getElementById('now').addEventListener('click',e=>{if(e.target.closest('button'))return;if(S.now==='next')openClass('booked',$('#now'));else if(S.now==='usual')openClass('book',$('#now'))});

/* ---------- motion helpers (transform + opacity only) ---------- */
const EASE='cubic-bezier(.2,0,0,1)';
function numSwap(el,v){
  if(!el)return;const t=String(v);if(el.textContent===t)return;
  if(rm||!el.animate){el.textContent=t;return}
  const up=(+t)>(+el.textContent);
  el.animate([{opacity:1,transform:'none'},{opacity:0,transform:`translateY(${up?-40:40}%)`}],{duration:110,easing:EASE,fill:'forwards'}).finished.then(()=>{
    el.textContent=t;
    el.animate([{opacity:0,transform:`translateY(${up?40:-40}%)`},{opacity:1,transform:'none'}],{duration:200,easing:EASE}).finished.then(()=>{el.getAnimations().forEach(a=>a.cancel())}).catch(()=>{});
  }).catch(()=>{el.textContent=t});
}
function fadeText(el,t){
  if(!el||el.textContent===t)return;el.textContent=t;
  if(!rm&&el.animate)el.animate([{opacity:.2,transform:'translateY(4px)'},{opacity:1,transform:'none'}],{duration:260,easing:EASE});
}
function segSync(el){if(!el)return;el.style.setProperty('--i',Math.max(0,$$('button',el).findIndex(b=>b.classList.contains('on'))))}
function segInit(el){if(!el||el.querySelector('.sgi'))return;el.style.setProperty('--n',$$('button',el).length);segSync(el);el.insertAdjacentHTML('afterbegin','<i class="sgi" aria-hidden="true"></i>')}

/* ---------- sheets ---------- */
const layer=$('#layer'),scrim=$('#scrim');
let curSheet=null,curFrom=null;
let progOpen=false,fly=null,progSrc=null;
const PANELS={home:'#scroll',schedule:'#scr-sch',shop:'#scr-shop',me:'#scr-me'};
function syncInert(lock){const pl=lock||progOpen||subOpen||outOpen||authOpen;$('#sub').inert=!subOpen||!!lock;$('#out').inert=!outOpen||!!lock;$('#auth').inert=!authOpen||!!lock;Object.entries(PANELS).forEach(([k,sel])=>{$(sel).inert=pl||k!==S.tab});$('#keyBtn').inert=pl||S.tab!=='home'||todayIn;$('#tabs').inert=lock}
const hooks={open:{},close:{}};
function rectIn(el){const pr=phone.getBoundingClientRect(),r=el.getBoundingClientRect(),s=pr.width/390;return{x:(r.left-pr.left)/s,y:(r.top-pr.top)/s,w:r.width/s,h:r.height/s}}
let sheetTok=0,lastFocus=null;
async function openSheet(id,from){
  if(curSheet===id)return;
  const tok=++sheetTok;
  if(curSheet)await closeSheet(true);
  if(tok!==sheetTok)return;
  const s=$('#sh-'+id);curSheet=id;curFrom=from||null;layer.classList.add('on');syncInert(true);$('#orb').inert=id!=='orb';
  lastFocus=document.activeElement;setTimeout(()=>{const f=$('[data-close]',s);f&&f.focus({preventScroll:true})},60);
  hooks.open[id]&&hooks.open[id]();
  if(from&&!rm){
    const fr=rectIn(from),top=844-s.offsetHeight,k=fr.w/390;
    s.classList.add('flip');s.style.transition='none';s.style.transform=`translate(${fr.x}px,${fr.y-top}px) scale(${k})`;s.style.opacity='0';
    s.classList.add('open');void s.offsetWidth;s.style.transition='';s.style.transform='';s.style.opacity='';from.classList.add('lift');
  }else{void s.offsetWidth;s.classList.add('open')}
}
async function closeSheet(fast){
  if(!curSheet)return;
  const id=curSheet,s=$('#sh-'+id),from=curFrom;curSheet=null;curFrom=null;
  hooks.close[id]&&hooks.close[id]();
  if(from&&!rm&&!fast){
    const fr=rectIn(from),top=844-s.offsetHeight;
    s.style.transform=`translate(${fr.x}px,${fr.y-top}px) scale(${fr.w/390})`;s.style.opacity='0';s.classList.remove('open');
  }else s.classList.remove('open');
  if(from)from.classList.remove('lift');
  layer.classList.remove('on');syncInert(false);$('#orb').inert=false;
  if(!fast&&lastFocus&&lastFocus.focus&&document.contains(lastFocus))lastFocus.focus({preventScroll:true});
  await wait(rm?260:(fast?40:360));
  if(curSheet!==id){s.style.transform='';s.style.opacity='';s.classList.remove('flip')}
}
scrim.addEventListener('click',()=>{abortMile();closeSheet()});
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>closeSheet()));

/* toast */
let toastT;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),1900)}

const buzz=()=>{try{if(navigator.vibrate&&(!navigator.userActivation||navigator.userActivation.hasBeenActive))navigator.vibrate(12)}catch(e){}};
/* ---------- check-in key ---------- */
/* Method per club: qr, tap, or both. The sheet, the Home button and the key icon follow it. */
const CKH={both:540,qr:568,tap:480},CKSUB={both:'Scan or tap at the door',qr:'Scan at the door',tap:'Tap at the door'},CKSIM={both:'Simulate scan or tap',qr:'Simulate scan',tap:'Simulate tap'};
function setCk(m){
  if(!CKH[m])m='both';S.ck=m;$('#ckQr').dataset.ck=m;$('#ckSub').textContent=CKSUB[m];$('#simScan').textContent=CKSIM[m];
  const ic=m==='tap'?'#i-tap':'#i-qr';$('#keyBtn use').setAttribute('href',ic);
  $$('#bCk [data-ck]').forEach(x=>x.classList.toggle('on',x.dataset.ck===m));
}
$$('#bCk [data-ck]').forEach(b=>b.addEventListener('click',()=>setCk(b.dataset.ck)));
/* Arrival: near the club and not checked in yet -> the check-in sheet comes up by itself. No extra card, no extra button.
   Already checked in -> nothing opens; the Now card shows the check mark. */
/* where you are: far = drive time, soon = leave now, near = check in */
S.dist='far';
const DIST={far:['i-nav','12 min away','Directions to Katy, 12 minutes'],soon:['i-nav','Leave now','Leave now, 12 minute drive to Katy'],near:['i-key','Check in','Check in']};
function distSet(m){S.dist=m;const b=$('#dirBtn'),d=DIST[m];if(!b)return;b.querySelector('use').setAttribute('href','#'+d[0]);b.querySelector('span').textContent=d[1];b.setAttribute('aria-label',d[2]);b.classList.toggle('soon',m==='soon');$$('#bDist [data-d]').forEach(x=>x.classList.toggle('on',x.dataset.d===m))}
$('#bDist').addEventListener('click',e=>{const x=e.target.closest('[data-d]');if(x)distSet(x.dataset.d)});
distSet('far');
async function arrival(){
  distSet('near');
  if(curSheet)await closeSheet(true);if(progOpen)await closeProgress();if(subOpen)await closeSub();if(S.tab!=='home')setTab('home');
  if(todayIn)return;
  await wait(rm?300:700);
  if(!curSheet&&!progOpen&&!subOpen&&S.tab==='home'&&!todayIn)openSheet('checkin');
}
let ckBumped=false;

/* ---------- Outside the app: Wallet pass, lock-screen countdown, home-screen widget. Proposal frames, not member screens. ---------- */
let walletOn=false,outView='wallet',lkSt='up',lkTimer=0,lkEnd=0;
const fmtCd=t=>t>=3600?`${Math.floor(t/3600)}:${String(Math.floor(t%3600/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`:`${Math.floor(t/60)}:${String(t%60).padStart(2,'0')}`;
function walletSync(){
  $('#wlAdd').hidden=walletOn;$('#wlDone').hidden=!walletOn;
  $('#ckWallet').hidden=walletOn;
  $('#passCode').dataset.ck=S.ck;
}
function passSweep(){const s=$('.pass-sw');if(rm||!s.animate)return;s.animate([{transform:'translateX(-130%) skewX(-18deg)',opacity:0},{opacity:1,offset:.25},{transform:'translateX(260%) skewX(-18deg)',opacity:0}],{duration:1100,easing:EASE})}
function lockRender(){
  const st=lkSt,card=$('#lkCard');card.dataset.st=st;
  const mk=`<div class="lk-top"><span class="lk-lg"><span class="mk-slot" data-mk="sheet" style="--mw:72px;--mh:22px"></span></span><span class="lk-wh">${$('#clubName').textContent||''}</span></div>`;
  if(st==='here')card.innerHTML=mk+`<div class="lk-go"><svg class="i"><use href="#${S.ck==='tap'?'i-tap':'i-qr'}"/></svg><div><b class="lk-t">Check in</b><span class="lk-s">Power 60 · 9:00 AM</span></div></div>`;
  else card.innerHTML=mk+`<div class="lk-row"><div><b class="lk-t">${st==='near'?'Time to head over':'Power 60'}</b><span class="lk-s">${st==='near'?'Power 60 · 9:00 AM':'9:00 AM'}</span></div><b class="lk-cd" id="lkCd"></b></div><div class="lk-bar"><i id="lkBar"></i></div>${st==='near'?`<span class="lk-pill"><svg class="i s"><use href="#i-nav"/></svg>Directions</span>`:''}`;
  renderMarks($('#lkCard'));lkTick();
}
function lkTick(){
  const cd=$('#lkCd');if(!cd)return;const t=Math.max(0,Math.round((lkEnd-Date.now())/1000));
  cd.textContent=fmtCd(t);$('#lkBar').style.transform=`scaleX(${Math.min(1,Math.max(0,1-t/7200)).toFixed(3)})`;
}
function lkSet(s){
  lkSt=s;$$('#lkSt button').forEach(b=>{const on=b.dataset.s===s;b.classList.toggle('on',on)});
  lkEnd=Date.now()+(s==='up'?4320:900)*1000;lockRender();
  if(!rm){const c=$('#lkCard');c.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:260,easing:EASE})}
}
function wgSync(){
  const r=$('#wgRing');if(r){const g=S.goal,v=Math.min(S.visits,g);if(r.dataset.goal!=g){r.dataset.goal=g;buildDial(r)}r.querySelector('.cnt').textContent=`${v}/${g}`;ringSet(r,v/g)}
}
function outShow(v,first){
  outView=v;$$('#outSeg button').forEach(b=>{const on=b.dataset.v===v;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});segSync($('#outSeg'));
  $$('#out .ov').forEach(o=>{const on=o.dataset.v===v;if(on===!o.hidden)return;o.hidden=!on;if(on&&!rm&&!first)o.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:240,easing:EASE})});
  clearInterval(lkTimer);
  if(v==='wallet'){walletSync();drawQrOn($('#passQr'),7);if(!first)passSweep()}
  if(v==='lock'){lkSet(lkSt);lkTimer=setInterval(lkTick,1000)}
  if(v==='widget'){wgSync()}
  const cur=$(`#out .ov[data-v="${v}"]`);if(v!=='lock')renderMarks(cur);
}
async function openOut(v){
  if(curSheet)await closeSheet(true);if(progOpen)await closeProgress();if(subOpen)await closeSub();
  if(S.tab!=='home')setTab('home');
  outOpen=true;syncInert(false);syncKey();const o=$('#out');o.classList.add('on');o.setAttribute('aria-hidden','false');
  outShow(v||outView,true);if(v==='wallet'||!v)setTimeout(passSweep,rm?0:320);
  setTimeout(()=>$('#outBack').focus({preventScroll:true}),80);
}
function closeOut(){
  if(!outOpen)return;outOpen=false;clearInterval(lkTimer);const o=$('#out');o.classList.remove('on');o.setAttribute('aria-hidden','true');syncInert(false);syncKey();
}
function leaveOut(){closeOut();if(lkSt==='here'&&outView==='lock'&&!todayIn)setTimeout(()=>openSheet('checkin'),rm?60:380)}
$('#outBack').addEventListener('click',closeOut);
$('#outSeg').addEventListener('click',e=>{const b=e.target.closest('button');if(b&&b.dataset.v!==outView)outShow(b.dataset.v)});
$('#lkSt').addEventListener('click',e=>{const b=e.target.closest('button');if(b)lkSet(b.dataset.s)});
$('#lkCard').addEventListener('click',leaveOut);$('#lkCard').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();leaveOut()}});
$$('#wgM,#wgS').forEach(w=>{w.addEventListener('click',closeOut);w.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();closeOut()}})});
$('#wlAdd').addEventListener('click',()=>{walletOn=true;walletSync();const p=$('#pass');if(!rm&&p.animate)p.animate([{transform:'scale(1)'},{transform:'scale(.96)',offset:.35},{transform:'scale(1)'}],{duration:420,easing:EASE});passSweep()});
$('#ckWallet').addEventListener('click',()=>openOut('wallet'));
$$('#bOut [data-out]').forEach(b=>b.addEventListener('click',()=>openOut(b.dataset.out)));
$('#bWlReset').addEventListener('click',()=>{walletOn=false;walletSync();toast('Not in Wallet')});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&outOpen)closeOut()});

/* ---------- Edge states: sign-in, new member, loading, offline, error, closed day, spot opened, late fee, no credits, frozen/expired, failed check-in, permission asks. Proposal. ---------- */
const ED={newm:false,off:false,err:false,acct:null,late:false,closed:false},SV={};
function loadingSet(on,ms){clearTimeout(SV.ld);phone.toggleAttribute('data-ld',on);if(on)SV.ld=setTimeout(()=>loadingSet(false),ms||3500)}
function offlineSet(on){ED.off=on;phone.toggleAttribute('data-off',on);$('#offBar').hidden=!on;if(curSheet==='class')setBook(S.cls)}
function errorSet(on){ED.err=on;phone.toggleAttribute('data-err',on);$('#errCard').hidden=!on;if(on&&!rm){const e=$('#errCard');e.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:260,easing:EASE});$('.errI',e).animate([{transform:'translateX(0)'},{transform:'translateX(-4px)'},{transform:'translateX(4px)'},{transform:'translateX(-3px)'},{transform:'translateX(0)'}],{duration:320,delay:200,easing:'ease-out'})}}
$('#errRetry').addEventListener('click',()=>{errorSet(false);loadingSet(true,1000)});
function acctSync(){
  const a=ED.acct;['#acctH','#acctM'].forEach(s=>{const e=$(s);e.hidden=!a;if(a)e.innerHTML=`<span class="ai">${ic(a==='frozen'?'pause':'clock')}</span><b>${a==='frozen'?'Membership frozen':'Membership expired'}</b><button class="btn p" data-act="acct">${a==='frozen'?'Unfreeze':'Renew'}</button>`});
  if(curSheet==='class')setBook(S.cls);
}
function newMemberSet(on){
  if(on===ED.newm)return;ED.newm=on;phone.toggleAttribute('data-newm',on);
  if(on){SV.v=S.visits;SV.att=[...ATT];SV.cr=S.credits;SV.td=todayIn;SV.bk=CLA.filter(c=>c.state==='booked'||c.state==='waitlist').map(c=>[c,c.state]);
    S.visits=0;ATT.length=0;todayIn=false;$('#now').classList.remove('in');syncKey();SV.bk.forEach(([c])=>{c.state=c.spots===0?'full':'book'});creditsSet(12);$('#meClub').textContent='Joined today';
    syncWeek(true);setNow('first');renderSchedule();updBkn()}
  else{S.visits=SV.v;ATT.length=0;ATT.push(...SV.att);todayIn=SV.td;SV.bk.forEach(([c,s])=>{c.state=s});creditsSet(SV.cr);$('#meClub').textContent='Member since March 2025';
    if(todayIn)$('#now').classList.add('in');syncKey();syncWeek(true);setNow('next');renderSchedule();updBkn()}
}
function edgeReset(){
  loadingSet(false);offlineSet(false);errorSet(false);ED.late=false;ED.closed=false;ED.acct=null;acctSync();
  if(ED.newm)newMemberSet(false);
  creditsSet(8);const st=CL('sat-st');st.state='full';st.spots=0;if(S.now==='spot'||S.now==='first')setNow('next');
  if(selDay==='sun'){selDay='sat'}renderSchedule();closeAuth(true);
}
async function edgeClear(){if(curSheet)await closeSheet(true);if(progOpen)await closeProgress();if(subOpen)await closeSub();if(outOpen)closeOut();if(authOpen)closeAuth(true);if(moOpen)closeMonth(true)}
/* sign-in */
async function openAuth(){
  await edgeClear();authOpen=true;syncInert(false);syncKey();const o=$('#auth');o.classList.add('on');o.setAttribute('aria-hidden','false');renderMarks(o);
  setTimeout(()=>$('#authEm').focus({preventScroll:true}),320);
}
function closeAuth(fast){if(!authOpen)return;authOpen=false;const o=$('#auth');o.classList.remove('on');o.setAttribute('aria-hidden','true');syncInert(false);syncKey()}
$('#authGo').addEventListener('click',()=>closeAuth());
$$('#auth [data-auth]').forEach(b=>b.addEventListener('click',()=>closeAuth()));
$('#authEm').addEventListener('keydown',e=>{if(e.key==='Enter')closeAuth()});
/* failed check-in */
async function scanFail(){
  const sh=$('#sh-checkin');if(sh.classList.contains('ok')||sh.classList.contains('fail'))return;
  clearInterval(qrTimer);scanTok++;$('#ckFail').inert=false;$('#ckQr').inert=true;sh.classList.add('fail');buzz();
  if(!rm){const i=$('.fail-ic');i.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(-4px)'},{transform:'translateX(0)'}],{duration:360,delay:160,easing:'ease-out'})}
}
$('#ckRetry').addEventListener('click',()=>{$('#ckQr').inert=false;hooks.open.checkin()});
$('#ckDesk').addEventListener('click',async()=>{await closeSheet();orbState('staff')});
/* permission asks */
const PERM={loc:['nav','Know when you arrive','Your check-in opens at the door.','Allow',null],not:['bell','Class reminders','A heads-up before class, and when a spot opens.','Allow',null],wal:['wallet','Add your pass','Check in from your lock screen.','Add to Wallet','wallet']};
let permK='loc';
async function permAsk(k){
  await edgeClear();if(S.tab!=='home')setTab('home');permK=k;const p=PERM[k];
  $('#pmpIc use').setAttribute('href','#i-'+p[0]);$('#pmpT').textContent=p[1];$('#pmpS').textContent=p[2];$('#pmpYes').textContent=p[3];
  openSheet('perm');
}
$('#pmpYes').addEventListener('click',async()=>{const w=PERM[permK][4];await closeSheet();if(w==='wallet')openOut('wallet')});
$('#pmpNo').addEventListener('click',()=>closeSheet());
/* panel */
$$('#bEdge [data-e]').forEach(b=>b.addEventListener('click',async()=>{
  const e=b.dataset.e,on=b.classList.contains('on');
  const tog=(f)=>{b.classList.toggle('on',!on);f(!on)};
  if(e==='auth')return openAuth();
  if(e==='newm'){await edgeClear();if(S.tab!=='home')setTab('home');return tog(newMemberSet)}
  if(e==='load'){await edgeClear();return loadingSet(true)}
  if(e==='off')return tog(offlineSet);
  if(e==='err'){await edgeClear();return tog(errorSet)}
  if(e==='closed'){await edgeClear();ED.closed=true;setTab('schedule');selDay='sun';if(schMode!=='cls')setMode('cls');return renderSchedule()}
  if(e==='spot'){await edgeClear();if(S.tab!=='home')setTab('home');return setNow('spot')}
  if(e==='late'){await edgeClear();if(S.tab!=='home')setTab('home');ED.late=true;setNow('next');await wait(rm?60:420);return openClass('booked',$('#now'))}
  if(e==='nocr')return tog(v=>{creditsSet(v?0:8);if(curSheet==='class')setBook(S.cls)});
  if(e==='frozen'||e==='expired'){$$('#bEdge [data-e=frozen],#bEdge [data-e=expired]').forEach(x=>x.classList.remove('on'));ED.acct=on?null:e;if(!on)b.classList.add('on');return acctSync()}
  if(e==='ckfail'){await edgeClear();if(S.tab!=='home')setTab('home');await openSheet('checkin');await wait(rm?100:600);return scanFail()}
  if(e==='p-loc')return permAsk('loc');if(e==='p-not')return permAsk('not');if(e==='p-wal')return permAsk('wal');
  if(e==='reset'){$$('#bEdge .on').forEach(x=>x.classList.remove('on'));edgeReset()}
}));
/* ===== SHOP (club-enabled; off by default) ===== */
const SHOP={on:false,pay:'reserve',cat:'All',orders:[],cur:null,qty:1,view:'item',from:null,fly:false};
const PROD=[
 {id:'p10',cat:'Packs',n:'10-class pack',d:'Use anytime in 6 months',p:110,ic:'ticket',cr:10},
 {id:'p5',cat:'Packs',n:'5-class pack',d:'Use anytime in 3 months',p:60,ic:'ticket',cr:5},
 {id:'dp',cat:'Packs',n:'Day pass',d:'One visit, any class',p:20,ic:'ticket',cr:1},
 {id:'gp',cat:'Packs',n:'Guest pass',d:'One visit for a friend',p:15,ic:'userplus',dig:1},
 {id:'sh',cat:'Drinks',n:'Protein shake',d:'24 g protein · choc or vanilla',p:6,ic:'cup'},
 {id:'cb',cat:'Drinks',n:'Cold brew',d:'Black, 12 oz',p:4,ic:'cup'},
 {id:'ew',cat:'Drinks',n:'Electrolyte water',d:'Cold, 20 oz',p:3,ic:'bottle'},
 {id:'bt',cat:'Gear',n:'Club bottle',d:'Steel, 32 oz',p:24,ic:'bottle'},
 {id:'tw',cat:'Gear',n:'Gym towel',d:'Quick-dry',p:12,ic:'towel'},
 {id:'ls',cat:'Gear',n:'Lifting straps',d:'One pair',p:18,ic:'dumb'},
 {id:'rb',cat:'Gear',n:'Resistance band',d:'Medium',p:14,ic:'dumb'}];
const PCAT=['All','Packs','Drinks','Gear'];
const CODES=['K7 42','M3 18','R9 05','T2 61'];
const PID=id=>PROD.find(p=>p.id===id);
const svgI=(n,c)=>`<svg class="i${c?' '+c:''}"><use href="#i-${n}"/></svg>`;
function shopRender(){
  const f=SHOP.cat==='All';$('#shFeat').hidden=!f;
  $('#shChips').innerHTML=PCAT.map(c=>`<button class="fc2${c===SHOP.cat?' on':''}" data-c="${c}" aria-pressed="${c===SHOP.cat}">${c}</button>`).join('');
  const L=PROD.filter(p=>f?p.id!=='p10':p.cat===SHOP.cat);
  $('#shGrid').innerHTML=L.map(p=>`<button class="pt" data-p="${p.id}" data-c="${p.cat}"><span class="pt-art">${svgI(p.ic)}</span><b>${p.n}</b><em>$${p.p}</em></button>`).join('');
}
function shopSet(on){
  SHOP.on=on;$('#tabShop').hidden=!on;$('#tabs').classList.toggle('four',on);
  $$('#bShop [data-sh="on"],#bShop [data-sh="off"]').forEach(b=>b.classList.toggle('on',(b.dataset.sh==='on')===on));
  if(!on&&S.tab==='shop')setTab('home');else setTab(S.tab);
}
function shopPay(m){SHOP.pay=m;$$('#bShop [data-sh]').forEach(b=>{if(['none','reserve','app'].includes(b.dataset.sh))b.classList.toggle('on',b.dataset.sh===m)});if(curSheet==='shopitem'&&SHOP.view==='item')shopItemPaint()}
function shopBagSync(){const n=SHOP.orders.length,b=$('#shBag');$('#shCnt').textContent=n;if(n&&b.hidden){b.hidden=false}else if(!n)b.hidden=true;b.setAttribute('aria-label',`Your orders, ${n}`)}
function shopItemPaint(){
  const p=SHOP.cur,q=SHOP.qty,tot=p.p*q;
  $('#siArt').dataset.c=p.cat;$('#siArt').innerHTML=svgI(p.ic);
  $('#siCat').textContent=p.cat;$('#siT').textContent=p.n;$('#siD').textContent=p.d;
  $('#siP').textContent='$'+tot;$('#qN').textContent=q;$('#qMin').disabled=q<=1;$('#qPlus').disabled=q>=9;
  const b=$('#siBtn'),bl=$('#siBl'),note=$('#siNote'),off=ED.off;
  b.classList.remove('done','busy');b.disabled=false;
  const mode=off?'off':SHOP.pay;
  b.classList.toggle('p',mode==='reserve'||mode==='app');b.classList.toggle('s',mode==='none'||mode==='off');
  if(mode==='off'){b.disabled=true;bl.innerHTML=svgI('offline','s')+'Offline';note.textContent='Connect to order'}
  else if(mode==='none'){bl.textContent='Ask at desk';note.textContent=''}
  else if(mode==='reserve'){bl.textContent='Reserve · $'+tot;note.textContent='Pay at the front desk'}
  else{bl.textContent='Pay · $'+tot;note.textContent='Card on file'}
}
function shopDonePaint(o){
  const p=PID(o.id),dig=o.pay==='app'&&(p.cr||p.dig);
  $('#sdT').textContent=o.pay==='app'?'Paid':'Reserved';
  $('#sdS').textContent=o.pay==='app'?(p.cr?`${p.cr*o.qty} ${p.cr*o.qty===1?'class':'classes'} added`:dig?'Added to your account':'Show this code at the front desk'):'Show this code · pay at the front desk';
  $('#sdCode').hidden=!!dig;$('#sdCode').textContent=o.code;
  $('#sdIt').textContent=`${o.qty>1?o.qty+' × ':''}${p.n} · $${o.total}`;
}
function shopView(v){SHOP.view=v;const s=$('#sh-shopitem');s.classList.toggle('done',v==='done');$('#siDone').inert=v!=='done';$('#siBody').inert=v==='done'}
function shopOpen(id,from){
  const p=PID(id);if(!p)return;SHOP.cur=p;SHOP.qty=1;SHOP.from=from||null;SHOP.fly=false;shopView('item');shopItemPaint();openSheet('shopitem',from);
}
function shopOrders(){
  const o=SHOP.orders[SHOP.orders.length-1];if(!o)return toast('No orders yet');
  SHOP.cur=PID(o.id);SHOP.from=null;SHOP.fly=false;shopDonePaint(o);shopView('done');openSheet('shopitem');
}
async function shopBuy(){
  if(ED.off)return;const p=SHOP.cur,m=SHOP.pay,b=$('#siBtn');
  if(m==='none'){await closeSheet();toast('Ask at the front desk');return}
  const total=p.p*SHOP.qty;
  b.classList.add('busy');b.disabled=true;
  if(m==='app'){$('#siBl').innerHTML='<i class="spin"></i>';await wait(rm?200:900)}else await wait(rm?100:450);
  b.classList.remove('busy');b.classList.add('done');$('#siBl').innerHTML=svgI('check','s')+(m==='app'?'Paid':'Reserved');
  await wait(rm?150:520);
  const o={id:p.id,qty:SHOP.qty,total,pay:m,code:CODES[SHOP.orders.length%CODES.length]};
  SHOP.orders.push(o);
  if(m==='app'&&p.cr)creditsSet(S.credits+p.cr*SHOP.qty);
  shopDonePaint(o);shopView('done');SHOP.fly=!!SHOP.from;
  const bag=$('#shBag');if(bag.hidden){bag.hidden=false;bag.classList.add('wait')}
  $('#shCnt').textContent=SHOP.orders.length;
}
hooks.open.shopitem=()=>{};
hooks.close.shopitem=()=>{
  const fly=SHOP.fly,from=SHOP.from,bag=$('#shBag');SHOP.fly=false;
  const land=()=>{bag.classList.remove('wait');bag.classList.remove('pop');void bag.offsetWidth;if(!rm)bag.classList.add('pop')};
  if(!SHOP.orders.length){shopBagSync();return}
  if(!fly||rm||!from||!document.body.contains(from)){shopBagSync();land();return}
  setTimeout(()=>{
    const a=rectIn(from),t=rectIn(bag),d=document.createElement('i');d.className='shfly';d.dataset.c=SHOP.cur.cat;d.innerHTML=svgI(SHOP.cur.ic);
    d.style.cssText=`left:${a.x+a.w/2-16}px;top:${a.y+a.h/3-16}px`;phone.appendChild(d);
    const dx=t.x+t.w/2-(a.x+a.w/2),dy=t.y+t.h/2-(a.y+a.h/3);
    const an=d.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${dx*.5}px,${dy*.5-46}px) scale(.9)`,opacity:1,offset:.5},{transform:`translate(${dx}px,${dy}px) scale(.4)`,opacity:.9}],{duration:620,easing:'cubic-bezier(.3,.1,.2,1)'});
    an.onfinish=()=>{d.remove();land()};
  },120);
};
$('#shChips').addEventListener('click',e=>{const b=e.target.closest('[data-c]');if(!b)return;SHOP.cat=b.dataset.c;shopRender()});
$('#shGrid').addEventListener('click',e=>{const t=e.target.closest('.pt');if(t)shopOpen(t.dataset.p,t)});
$('#shFeat').addEventListener('click',e=>shopOpen(e.currentTarget.dataset.p,e.currentTarget));
$('#shBag').addEventListener('click',shopOrders);
$('#qMin').addEventListener('click',()=>{if(SHOP.qty>1){SHOP.qty--;shopItemPaint()}});
$('#qPlus').addEventListener('click',()=>{if(SHOP.qty<9){SHOP.qty++;shopItemPaint()}});
$('#siBtn').addEventListener('click',shopBuy);
$('#bShop').addEventListener('click',async e=>{
  const b=e.target.closest('[data-sh]');if(!b)return;const k=b.dataset.sh;
  if(k==='on')shopSet(true);else if(k==='off'){if(curSheet==='shopitem')await closeSheet(true);shopSet(false)}
  else if(['none','reserve','app'].includes(k))shopPay(k);
  else if(k==='item'){if(!SHOP.on)shopSet(true);if(curSheet)await closeSheet(true);if(S.tab!=='shop')setTab('shop');await wait(rm?100:450);const t=$('#shGrid .pt');shopOpen(t.dataset.p,t)}
  else if(k==='orders'){if(!SHOP.on)shopSet(true);if(curSheet)await closeSheet(true);shopOrders()}
  else if(k==='reset'){if(curSheet==='shopitem')await closeSheet(true);SHOP.orders.length=0;shopBagSync();toast('Orders cleared')}
});
shopRender();shopPay(SHOP.pay);
setTimeout(()=>{const q=P.get('shop');if(q==='1'||q==='on')shopSet(true);else shopSet(false);const py=P.get('pay');if(['none','reserve','app'].includes(py))shopPay(py)},0);
const EDGE_STATE={'edge-auth':()=>openAuth(),'edge-newm':()=>newMemberSet(true),'edge-load':()=>loadingSet(true,6000),'edge-off':()=>offlineSet(true),'edge-err':()=>errorSet(true),'edge-spot':()=>setNow('spot'),'edge-frozen':()=>{ED.acct='frozen';acctSync()},'edge-expired':()=>{ED.acct='expired';acctSync()},'edge-closed':()=>{ED.closed=true;setTab('schedule');selDay='sun';renderSchedule()},'edge-nocr':()=>creditsSet(0),'edge-ckfail':async()=>{await openSheet('checkin');await wait(600);scanFail()},'edge-late':async()=>{ED.late=true;setNow('next');await wait(300);openClass('booked',$('#now'))},'edge-ploc':()=>permAsk('loc'),'edge-pnot':()=>permAsk('not'),'edge-pwal':()=>permAsk('wal')};

function syncKey(){const k=$('#keyBtn');k.classList.toggle('gone',S.tab!=='home'||todayIn);k.inert=S.tab!=='home'||todayIn||progOpen||subOpen||outOpen||authOpen||!!curSheet}
$('#bArrive').addEventListener('click',arrival);
$('#bCkReset').addEventListener('click',()=>{distSet('far');if(todayIn){todayIn=false;ATT.pop();$('#now').classList.remove('in');syncKey();if(ckBumped){S.visits=Math.max(0,S.visits-1);ckBumped=false;syncWeek(true)}}toast('Not checked in today')});
const qrCv=$('#qr');let qrSeed=7,qrTimer=null,qrStart=0;
function drawQrOn(cv,seed){
  const c=cv.getContext('2d'),N=29,m=8;c.fillStyle='#fff';c.fillRect(0,0,232,232);c.fillStyle='#0A0F1C';
  let x=seed*9301+49297;const rnd=()=>{x=(x*9301+49297)%233280;return x/233280};
  const fin=(ox,oy)=>{c.fillRect(ox*m,oy*m,7*m,7*m);c.fillStyle='#fff';c.fillRect((ox+1)*m,(oy+1)*m,5*m,5*m);c.fillStyle='#0A0F1C';c.fillRect((ox+2)*m,(oy+2)*m,3*m,3*m)};
  for(let i=0;i<N;i++)for(let j=0;j<N;j++){const inF=(i<8&&j<8)||(i>N-9&&j<8)||(i<8&&j>N-9);if(!inF&&rnd()>.52)c.fillRect(i*m,j*m,m,m)}
  fin(0,0);fin(N-7,0);fin(0,N-7);
}
function drawQr(){drawQrOn(qrCv,qrSeed)}
function qrTick(){
  const el=(performance.now()-qrStart)/1000,left=Math.max(0,30-el);
  $('#qrTxt').textContent=`Refreshes in ${Math.ceil(left)}s`;ringSet($('#qrRing'),left/30);
  if(left<=0){qrSeed++;drawQr();qrStart=performance.now()}
}
let scanTok=0,scanT1=0,scanT2=0;
function scanStop(){scanTok++;clearTimeout(scanT1);clearTimeout(scanT2);const r=$('#okR');cancelAnimationFrame(r._raf)}
hooks.open.checkin=()=>{scanStop();$('#sh-checkin').style.height=CKH[S.ck]+'px';{const t=$('.ck-tapbig');t.classList.remove('go');void t.offsetWidth;t.classList.add('go')}$('#ckOk').inert=true;$('#ckQr').inert=false;
  const sh=$('#sh-checkin');sh.classList.remove('ok','ok2','fail');$('#ckFail').inert=true;$('#okRing').classList.remove('glow','wave');$('#okR').classList.remove('dis','boom');ringSet($('#okR'),0);
  drawQr();qrStart=performance.now();qrTick();clearInterval(qrTimer);qrTimer=setInterval(qrTick,250);
};
hooks.close.checkin=()=>{scanStop();clearInterval(qrTimer);const ok=$('#sh-checkin').classList.contains('ok');if(ok){if(!todayIn){todayIn=true;ATT.push(10)}$('#now').classList.add('in');syncKey();if(S.visits<S.goal){S.visits++;ckBumped=true;setTimeout(()=>syncWeek(true),rm?0:420)}}};
async function scan(){
  const sh=$('#sh-checkin');if(sh.classList.contains('ok'))return;clearInterval(qrTimer);
  const tok=++scanTok;$('#ckOk').inert=false;$('#ckQr').inert=true;
  const nv=Math.min(S.visits+(todayIn?0:1),S.goal),tier=todayIn?'':(nv===S.goal?'goal':(nv===1?'first':''));
  sh.classList.add('ok');buzz();$('#ckCnt').textContent=`${nv} of ${S.goal} this week`;
  /* Beats (audit): first visit of the week = bigger, goal-hitting visit = biggest. One mark each: the ring. */
  $('#ckOk .sh-t').textContent=tier==='goal'?'Weekly goal hit':(tier==='first'?'First visit this week':'Checked in');
  $('#okRing').dataset.tier=tier;
  /* Studio "Discharge", about 1s, event only: a light pulse runs the arc (it rides the tip), the core blooms,
     the ring flashes once, then the title and streak arrive. Reduce Motion: the ring just fades to full. */
  const r=$('#okR'),orr=$('#okRing');r.classList.remove('dis','boom');ringSet(r,0);
  if(rm){ringSet(r,1);orr.classList.add('glow');sh.classList.add('ok2');return}
  r.classList.add('dis');scanT1=setTimeout(()=>sh.classList.add('ok2'),560);
  await ringAnim(r,1,460);if(tok!==scanTok)return;
  r.classList.remove('dis');void r.offsetWidth;r.classList.add('boom');orr.classList.add('glow');
  if(tier){orr.classList.remove('wave');void orr.offsetWidth;orr.classList.add('wave');try{if(tier==='goal'&&navigator.vibrate&&navigator.userActivation&&navigator.userActivation.hasBeenActive)navigator.vibrate([14,60,22])}catch(e){}}
  scanT2=setTimeout(()=>r.classList.remove('boom'),640);
}
$('#simScan').addEventListener('click',scan);

/* ---------- milestone -> share ---------- */
let mileTok=0;
function abortMile(){mileTok++;const m=$('#miles');m.classList.remove('on','show');$('#badge').classList.remove('land')}
async function milestone(){
  if(curSheet)await closeSheet(true);
  const tok=++mileTok,m=$('#miles'),bd=$('#badge'),br=$('#bgRing');
  ringSet(br,0);bd.classList.remove('land');m.classList.remove('show');layer.classList.add('on');m.classList.add('on');void bd.offsetWidth;
  bd.classList.add('land');ringAnim(br,1,900);buzz();
  await wait(rm?300:760);if(tok!==mileTok)return;m.classList.add('show');
  await wait(rm?900:1300);if(tok!==mileTok)return;
  m.classList.remove('on','show');bd.classList.remove('land');
  await openSheet('share');
}
function renderShare(){
  const b=BRANDS[S.brand];
  $('#sc').innerHTML=`<div class="s-top"><span>Milestone</span><span>Oct 10</span></div>
   <div class="s-ring"></div><div class="s-in"><b>25</b><span>WORKOUTS</span></div>
   <div class="s-logo"><div class="mk-slot" data-mk="share" style="--mw:260px;--mh:100px"></div></div>
   <div class="s-cls">Power 60</div>
   <div class="s-st"><div><b>6</b><span>WEEK STREAK</span></div><div><b>3</b><span>THIS WEEK</span></div><div><b>52</b><span>MINUTES</span></div></div>
   <div class="s-nm">Alex</div>`;
  const slot=$('#sc .mk-slot'),cfg=markCfg(slot),el=document.createElement('div');el.className='mk on';
  if(b.logo){const f=fitMark(b.logo,{area:14000,maxW:260,maxH:92});el.style.width=f.w+'px';el.style.height=f.h+'px';el.innerHTML=`<img src="${b.logo.src}" alt="">`}
  else{el.classList.add('nm');el.style.fontSize='30px';el.innerHTML=b.mark.join(' ')}
  slot.appendChild(el);
}

/* share looks: card | clear sticker | photo under the stats */
const LOOKTIP={card:'Caption copied. Paste it and add location.',sticker:'Clear background. Layer it on your own photo.',photo:'Keep others out of frame.'};
function setLook(l){
  $$('#shLook button').forEach(b=>{const on=b.dataset.look===l;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});segSync($('#shLook'));
  $('#scWrap').dataset.look=l;fadeText($('#shTip'),LOOKTIP[l]);
}
$('#shLook').addEventListener('click',e=>{const b=e.target.closest('button');if(b&&!b.classList.contains('on'))setLook(b.dataset.look)});
hooks.open.share=()=>{$('#scWrap').dataset.look='card';$$('#shLook button').forEach(b=>{const on=b.dataset.look==='card';b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});segSync($('#shLook'));$('#shTip').textContent=LOOKTIP.card};
/* ---------- class + promo ---------- */
let curCls=null,bkChanged=false;
function setBook(state,morph){
  S.cls=state;if(curCls)curCls.state=state;const b=$('#bookBtn'),n=$('#bookNote');b.classList.remove('done','p','s');
  const note=t=>morph?fadeText(n,t):(n.textContent=t);
  const lab=(t,i)=>`<span class="bl${morph?' sw':''}">${i?ic(i):''}${t}</span><i class="burst"></i>`;
  const c=curCls||{},wlN=(c.wl||0)+1;
  if(state==='book'){b.classList.add('p');b.innerHTML=lab('Book');note(c.one?'Included with your membership':S.credits<=2?`${S.credits} class${S.credits>1?'es':''} left in your plan`:'')}
  if(state==='full'){b.classList.add('p');b.innerHTML=lab('Join waitlist');note(`Class is full · ${c.wl||0} on the waitlist`)}
  if(state==='booked'){b.classList.add('s');b.innerHTML=lab('Cancel booking');note(`You're in for ${dayName(c)} ${c.t} · free to cancel until ${cutoff(c)}`)}
  if(state==='waitlist'){b.classList.add('s');b.innerHTML=lab(`Waitlist #${wlN}`,'check');note("We'll tell you the moment a spot opens")}
  if(state==='booked'&&ED.late&&!c.one){b.classList.remove('p');b.classList.add('s');b.innerHTML=lab('Cancel anyway');note('Past the free window · $10 fee')}
  if((state==='book'||state==='full')&&!c.one){
    if(ED.acct){b.classList.remove('s');b.classList.add('p');b.innerHTML=lab(ED.acct==='frozen'?'Unfreeze':'Renew');note(ED.acct==='frozen'?'Your membership is frozen':'Your membership expired')}
    else if(state==='book'&&S.credits<=0){b.classList.remove('s');b.classList.add('p');b.innerHTML=lab('Get more classes');note('0 classes left')}
  }
  b.disabled=false;
  if(ED.off){b.disabled=true;b.classList.remove('p');b.classList.add('s');b.innerHTML=lab('Offline','offline');note('Connect to book or cancel')}
  $('#bfBtn').hidden=state==='full'||state==='waitlist'||ED.off;
  updBkn();
}
const cutoff=c=>{let m=mins(c.t)-60,h=Math.floor(m/60),mi=m%60,ap=h>=12?'PM':'AM';h=h%12||12;return `${h}:${String(mi).padStart(2,'0')} ${ap}`};
let crShown=null;
function crPaint(anim){
  const a=$('#meCr'),b=$('#meBar');if(!a)return;if(crShown===null)crShown=+a.textContent;
  if(crShown===S.credits||!anim)return;
  numSwap(a,S.credits);
  crShown=S.credits;if(b)b.style.transform=`scaleX(${(12-S.credits)/12})`;
}
const creditsSet=n=>{S.credits=Math.max(0,Math.min(12,n));crPaint(S.tab==='me');topupSync()};
/* Top-up (audit): at 2 classes or fewer, one card offers the club's pack. Shop does not need to be on. */
function topupSync(){const t=$('#topup');if(!t)return;const low=S.credits<=2&&!ED.off;t.hidden=!low;$('#tuN').textContent=S.credits;$$('#bElev [data-cr]').forEach(b=>b.classList.toggle('on',(+b.dataset.cr<=2)===low))}

function bpop(b){if(rm||!b.animate)return;b.animate([{transform:'scale(.96)'},{transform:'scale(1.035)',offset:.55},{transform:'none'}],{duration:350,easing:EASE})}
async function bookTap(){
  const b=$('#bookBtn');
  if((S.cls==='book'||S.cls==='full')&&!curCls.one&&(ED.acct||(S.cls==='book'&&S.credits<=0))){openSub('Membership');return}
  if(S.cls==='book'){b.classList.remove('p');b.classList.add('done');b.innerHTML=`<span class="bl sw">${ic('check')}Booked</span><i class="burst"></i>`;$('.burst',b).classList.add('go');bpop(b);buzz();fadeText($('#bookNote'),'Added to your week');S.booked=curCls.id==='sat-p60'?true:S.booked;curCls.state='booked';bkChanged=true;if(!curCls.one)creditsSet(S.credits-1);await wait(rm?500:1100);if(curSheet==='class')setBook('booked',true)}
  else if(S.cls==='full'){b.classList.remove('p');b.classList.add('done');b.innerHTML=`<span class="bl sw">${ic('check')}On the list</span><i class="burst"></i>`;$('.burst',b).classList.add('go');bpop(b);curCls.state='waitlist';bkChanged=true;await wait(rm?500:1000);if(curSheet==='class')setBook('waitlist',true)}
  else if(S.cls==='booked'){const late=ED.late&&!curCls.one;if(curCls.id==='sat-p60')S.booked=false;S.canceled.unshift([curCls.name,`${dayName(curCls)} ${curCls.t} · ${late?'Late cancel · $10 fee':'Canceled in time · No fee'}`]);if(late)ED.late=false;bkChanged=true;if(!curCls.one)creditsSet(S.credits+1);setBook('book',true);toast(late?'Canceled · $10 fee':'Booking canceled')}
  else if(S.cls==='waitlist'){setBook('full',true);toast('Left the waitlist')}
}
$('#bookBtn').addEventListener('click',bookTap);
hooks.open.class=()=>{$('#sh-class .cl-img').style.backgroundImage=`url(${PH[(curCls&&curCls.photo)||'cycle']})`};
hooks.close.class=()=>{const cid=curCls&&curCls.id,chg=bkChanged;if(bkChanged){bkChanged=false;setTimeout(syncNext,250)}setTimeout(()=>{if(curSheet==='class')return;const id=document.activeElement&&document.activeElement.dataset&&document.activeElement.dataset.id;renderSchedule(chg?'pop':'',cid);if(id&&!curSheet){const el=$(`.crow[data-id="${id}"],.uc[data-id="${id}"]`);el&&el.focus({preventScroll:true})}},rm?300:480)};
function openClass(state,from,cls){curCls=cls||CL('sat-p60');fillClass(curCls);setBook(state);if(curCls.id==='sat-p60')S.booked=state==='booked';return openSheet('class',from)}

let promo=null;
function openPromo(id,from){
  promo=PROMOS.find(p=>p.id===id);const p=promo;
  const img=$('#pmImg');img.style.background='';
  if(p.photo)img.style.backgroundImage=`url(${PH[p.photo]})`;
  else img.style.background='linear-gradient(135deg,color-mix(in srgb,var(--c1x) 55%,#0a1020),color-mix(in srgb,var(--c2x) 55%,#0a1020))';
  img.innerHTML=p.photo?'':ic(p.icon,'pmi');
  $('#pmT').textContent=p.title;$('#pmL').textContent=p.line;
  $('#pmR').innerHTML=(p.rows||[]).map(r=>`<div><span>${r[0]}</span><b>${r[1]}</b></div>`).join('');$('#pmR').hidden=!p.rows;
  $('#pmM').innerHTML=p.meta.map(m=>`<span class="chip">${m}</span>`).join('');
  const b=$('#pmBtn');b.classList.remove('done');
  b.innerHTML=`<span class="bl">${p.id==='challenge'&&S.joined?ic('check')+'Joined':(p.id==='challenge'?'Join challenge':(p.kind==='class'?'Book Power 60':p.cta))}</span><i class="burst"></i>`;
  return openSheet('promo',from);
}
async function pmTap(){
  const p=promo,b=$('#pmBtn');
  if(p.kind==='challenge'&&!S.joined){b.classList.add('done');b.innerHTML=`<span class="bl">${ic('check')}Joined</span><i class="burst"></i>`;$('.burst',b).classList.add('go');buzz();await wait(rm?400:900);join();closeSheet()}
  else if(p.kind==='class'){closeSheet().then(()=>openClass('book'))}
  else closeSheet();
}
$('#pmBtn').addEventListener('click',pmTap);
function join(){
  S.joined=true;const c=$('#cbar');c.classList.add('on');$('#week').classList.add('joined');
  const bar=$('.t i',c);bar.style.transition='none';bar.style.transform='scaleX(0)';void bar.offsetWidth;bar.style.transition='transform .6s var(--ease)';bar.style.transform='scaleX(.25)';
  renderFeed();
  const f=$('#feat .ff .btn');if(f&&$('#feat').dataset.id==='challenge')f.textContent='Joined';
}

/* ---------- crowd ---------- */
(()=>{const v=[.25,.5,.38,.55,.62,.5,.4,.45,.22,.2,.24,.5,.9,1,.8,.5,.25];
  $('#crChart').innerHTML=v.map((x,i)=>`<i class="${i===2?'now':(i>=8&&i<=10?'low':'')}" style="--hh:${Math.max(.08,x)};--k:${i}" title="${i+5}:00"></i>`).join('')})();
$('#crowd').addEventListener('click',()=>openSheet('crowd'));

/* ---------- class summary: minutes per zone. Shape + number + minutes, never color alone ---------- */
const ZMIN=[2,7,15,22,6],ZSH=['c1','c2','tri','sq','dia'];
hooks.open.summary=()=>{
  const z=$('#smZ'),mx=Math.max(...ZMIN);
  z.innerHTML=ZMIN.map((m,i)=>`<div class="smr${i===3?' top':''}" role="listitem" aria-label="Zone ${i+1}, ${m} minutes"><span class="zl"><i class="zs ${ZSH[i]}" style="--zc:var(--z${i+1})"></i>Z${i+1}</span><span class="zb"><i style="--w:${(m/mx).toFixed(3)};--k:${i};--zc:var(--z${i+1})"></i></span><span class="zm">${m}<em>m</em></span></div>`).join('');
  z.classList.remove('go');void z.offsetWidth;z.classList.add('go');
};
/* bring a friend (Proposal): guest pass for the open class */
hooks.open.friend=()=>{const c=curCls||CL('sat-p60'),b=BRANDS[S.brand];const d=`${dayName(c)} ${c.t}`;
  $('#bfSub').textContent=`Free guest pass · ${c.name} · ${d}`;
  $('#bfMsg').textContent=`Come to ${c.name} with me, ${d}, at ${b.name}. Your first class is on me.`};
/* ---------- monthly story ---------- */
let stIdx=0;
function showSlide(i){
  stIdx=Math.max(0,Math.min(3,i));
  $$('#stSlides .st-s').forEach((s,k)=>{s.classList.toggle('on',k===stIdx);s.classList.toggle('past',k<stIdx)});
  $$('#stBars i').forEach((b,k)=>b.classList.toggle('done',k<=stIdx));
  $('#stTip').style.visibility=stIdx===3?'hidden':'visible';
}
hooks.open.story=()=>showSlide(0);
$('#sh-story').addEventListener('click',e=>{if(e.target.closest('button'))return;if(e.target.closest('#stSlides')||e.target.closest('#stTip'))showSlide(stIdx+1)});

/* ---------- orb + assistant ---------- */
const orb=$('#orb');let orbTok=0,breathT=null;
const ORB_STATES=['listening','thinking','speaking'];
function orbMode(m){ORB_STATES.forEach(c=>orb.classList.toggle(c,c===m))}
function breathe(){orb.classList.add('breathe');clearTimeout(breathT);breathT=setTimeout(()=>orb.classList.remove('breathe'),rm?0:10000)}
hooks.open.orb=()=>{orb.classList.remove('mini');orb.style.zIndex=60;orb.style.setProperty('--oy',((844-$('#sh-orb').offsetHeight+35)-(orb.offsetTop+orb.offsetHeight/2))+'px');orb.classList.remove('breathe')};
hooks.close.orb=()=>{orbTok++;orbReset();orbMode(null);orb.style.setProperty('--oy','0px');setTimeout(()=>{if(curSheet!=='orb')orb.style.zIndex=''},400);$('#orbState').textContent='Tap to talk'};
function thread(t){$$('#orbSeg button').forEach(b=>b.classList.toggle('on',b.dataset.th===t));$('#thAssistant').hidden=t!=='assistant';$('#thStaff').hidden=t!=='staff';if(t==='staff'){orb.classList.remove('unread');$('#orbSeg').classList.remove('unread')}}
$$('#orbSeg button').forEach(b=>b.addEventListener('click',()=>thread(b.dataset.th)));
function orbReset(){$('#aiLine').classList.remove('on');$('#ans').classList.remove('on');$('#listenBox').classList.remove('on')}
async function orbOpen(){if(curSheet!=='orb'){thread('assistant');orbReset();await openSheet('orb')}}
async function orbState(m){
  const tok=++orbTok;
  if(m==='idle'){if(curSheet==='orb')await closeSheet();breathe();return}
  if(m==='staff'){if(curSheet)await closeSheet(true);orb.classList.add('unread');$('#orbSeg').classList.add('unread');toast('Maya replied · Message staff');return}
  await orbOpen();if(tok!==orbTok)return;
  const lab=$('#orbState');thread('assistant');
  if(m==='listening'){orbReset();orbMode('listening');lab.textContent='Listening…';$('#listenBox').classList.add('on')}
  if(m==='thinking'){orbReset();orbMode('thinking');lab.textContent='Checking the schedule…'}
  if(m==='speaking'){orbReset();$('#aiLine').classList.add('on');orbMode('speaking');lab.textContent='Speaking…'}
  if(m==='answer'){orbMode(null);$('#listenBox').classList.remove('on');$('#aiLine').classList.add('on');$('#ans').classList.add('on');lab.textContent='Tap to talk'}
}
async function orbTalk(){
  if(curSheet==='orb'){return}
  await orbState('listening');const tok=orbTok;
  await wait(rm?600:1600);if(tok!==orbTok)return;await orbState('thinking');
  await wait(rm?600:1200);if(tok!==orbTok)return;await orbState('speaking');
  await wait(rm?600:1700);if(tok!==orbTok)return;await orbState('answer');
}
/* orb: small pill while scrolling, full size again when you stop (transform only) */
let orbMiniT=0;
$$('.scroll,.prog-body').forEach(sc=>sc.addEventListener('scroll',()=>{if(curSheet==='orb')return;orb.classList.add('mini');clearTimeout(orbMiniT);orbMiniT=setTimeout(()=>orb.classList.remove('mini'),650)},{passive:true}));
orb.addEventListener('click',()=>{if(curSheet==='orb'){closeSheet()}else orbTalk()});

/* ---------- tabs ---------- */
const TORD={home:0,schedule:1,shop:2,me:3};
function setTab(t){
  const prev=S.tab;S.tab=t;
  if(subOpen)closeSub();
  $$('.tab').forEach(b=>{b.classList.toggle('on',b.dataset.tab===t);b.dataset.tab===t?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current')});
  const te=$(`.tab[data-tab="${t}"]`),ind=$('#tabInd');ind.classList.toggle('off',!te);
  if(te)ind.style.transform=`translateX(${te.offsetLeft+(te.offsetWidth-ind.offsetWidth)/2-4}px)`;
  $$('#bTab [data-t]').forEach(x=>x.classList.toggle('on',x.dataset.t===t));
  const dir=prev===t?0:Math.sign(TORD[t]-TORD[prev]);
  Object.entries(PANELS).forEach(([k,sel])=>{const el=$(sel),away=k!==t,was=el.classList.contains('away');
    if(!rm&&dir){
      if(!away&&was){el.style.transition='none';el.style.setProperty('--ax',dir*24+'px');void el.offsetWidth;el.style.transition=''}
      else if(away&&!was)el.style.setProperty('--ax',-dir*24+'px');
    }
    el.classList.toggle('away',away);el.setAttribute('aria-hidden',away)});
  syncKey();
  updBkn();
  syncInert(!!curSheet);
  if(prev!==t&&t==='me')setTimeout(()=>crPaint(true),rm?0:380);
  if(prev!==t&&t==='home'&&nowDirty)setTimeout(nowFlash,rm?0:360);
  if(prev!==t&&t!=='home'){const el=$(PANELS[t]);el.scrollTop=0;$$('.li',el).forEach(e=>{e.style.animation='none';void e.offsetWidth;e.style.animation=''})}
}
$$('.tab').forEach(b=>b.addEventListener('click',async()=>{if(curSheet)await closeSheet(true);if(progOpen)await closeProgress();setTab(b.dataset.tab)}));

/* ---------- Progress stub (ring flies up) ---------- */

let progClosing=null,fillT=0;
async function openProgress(srcEl){
  if(progClosing)await progClosing;
  if(progOpen)return;if(curSheet)await closeSheet(true);
  const src=(srcEl&&srcEl.classList&&srcEl.classList.contains('ring'))?srcEl:$('#wkRing');
  if(S.tab==='home'){$('#scroll').scrollTop=0;await wait(30)}
  progOpen=true;progSrc=src;const r=rectIn(src),size=+src.dataset.rs||96;
  buildProgress();$('#progBody').scrollTop=0;
  fly=src.cloneNode(true);fly.removeAttribute('id');fly.classList.add('fly');ringRefs(fly);ringSet(fly,+src.dataset.p||0);
  $('.cnt',fly).textContent=`${Math.min(S.visits,S.goal)}/${S.goal}`;
  fly.style.transition='none';fly.style.transform=`translate(${r.x}px,${r.y}px) scale(1)`;phone.appendChild(fly);
  let dim=$('#progDim');if(!dim){dim=document.createElement('div');dim.id='progDim';dim.className='prog-dim';phone.insertBefore(dim,$('#prog'))}
  src.style.visibility='hidden';void fly.offsetWidth;
  fly.style.transition='';const k=132/size;fly.style.transform=`translate(129px,104px) scale(${k})`;syncInert(false);setTimeout(()=>{const bb=$('#progBack');bb&&bb.focus({preventScroll:true})},80);
  dim.classList.add('on');$('#prog').inert=false;$('#prog').setAttribute('aria-hidden','false');$('#prog').classList.add('on','fill');
  clearTimeout(fillT);fillT=setTimeout(()=>$('#prog').classList.remove('fill'),1700);
  setTimeout(()=>fly&&fly.classList.add('showcnt'),rm?0:300);
  if(!rm)setTimeout(()=>{if(fly&&progOpen){fly.classList.add('boom');setTimeout(()=>fly&&fly.classList.remove('boom'),700)}},480);
}
function closeProgress(){
  if(!progOpen)return progClosing;
  progClosing=_closeProgress().finally(()=>{progClosing=null});return progClosing;
}
async function _closeProgress(){
  progOpen=false;syncInert(false);const src=progSrc||$('#wkRing'),r=rectIn(src);setTimeout(()=>{const o=$('#week');o&&o.focus&&o.focus({preventScroll:true})},rm?260:480);
  fly.classList.remove('showcnt');fly.style.transform=`translate(${r.x}px,${r.y}px) scale(1)`;
  clearTimeout(fillT);$('#prog').classList.remove('on','fill');$('#prog').inert=true;$('#prog').setAttribute('aria-hidden','true');$('#progDim').classList.remove('on');
  await wait(rm?260:470);src.style.visibility='';if(fly){fly.remove();fly=null}
}
$('#progBack').addEventListener('click',closeProgress);

/* Home Now card follows today's earliest booking */
let nowDirty=false,nowSig='';
const nowSigOf=()=>{const b=Object.values(SCH.sat).filter(c=>c.state==='booked'&&c.o>468).sort((a,b)=>a.o-b.o)[0];return (b?b.id:'-')};
function nowFlash(){
  nowDirty=false;const e=$('.ns.on');if(!e||!e.animate)return;
  e.animate(rm?[{opacity:0},{opacity:1}]:[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{duration:rm?200:380,easing:EASE});
}
function syncNext(){
  const sg=nowSigOf();if(sg!==nowSig){nowSig=sg;nowDirty=true}
  const NOWM=7*60+48,b=Object.values(SCH.sat).filter(c=>c.state==='booked'&&c.o>NOWM).sort((a,b)=>a.o-b.o)[0];
  const fin=()=>{if(nowDirty&&S.tab==='home'&&!curSheet&&!progOpen)nowFlash()};
  if(!b){if(S.now==='next')setNow('usual');fin();return}
  const m=b.o-NOWM,h=Math.floor(m/60),mm=m%60;
  const ns=$('.ns[data-s=next]');$('.ttl',ns).textContent=b.name;$('.cd b',ns).textContent=h?`${h}h ${mm}m`:`${mm}m`;$('.sub',ns).textContent=`${b.t} · ${b.coach}`;
  if(['usual','recap','monthly','next','spot','first'].includes(S.now))setNow('next');
  fin();
}
/* ---------- Schedule ---------- */
const DAYS=[{k:'sat',d:'Sat',n:10,full:'Saturday'},{k:'sun',d:'Sun',n:11,full:'Sunday'},{k:'mon',d:'Mon',n:12,full:'Monday'},{k:'tue',d:'Tue',n:13,full:'Tuesday'},{k:'wed',d:'Wed',n:14,full:'Wednesday'},{k:'thu',d:'Thu',n:15,full:'Thursday'},{k:'fri',d:'Fri',n:16,full:'Friday'}];
const mins=t=>{const[m,ap]=t.split(' ');let[h,mi]=m.split(':').map(Number);if(ap==='PM'&&h<12)h+=12;if(ap==='AM'&&h===12)h=0;return h*60+mi};
const mkc=(id,t,name,coach,len,spots,o={})=>({id,t,name,coach,len,spots,state:spots===0?'full':'book',photo:name==='Strength Lab'?'bands':(name==='Mobility'?'stretch':'cycle'),bring:name==='Cycle'?'Cycling shoes optional':(name==='Mobility'?'Bring a mat':'Bring water and a towel'),counts:name!=='Mobility',...o});
const SCH={
  sat:[mkc('sat-p60','9:00 AM','Power 60','Taylor Bailey',60,6,{usual:1,state:'booked',friends:['MJ','KD'],crowd:'Quiet at 9:00'}),
       mkc('sat-cy','10:15 AM','Cycle','Jordan Reyes',45,3,{friends:['MJ'],crowd:'Busy at 10:15'}),
       mkc('sat-st','12:00 PM','Strength Lab','Sam Ortiz',50,0,{crowd:'Quiet at 12:00',wl:12}),
       mkc('sat-mo','4:30 PM','Mobility','Taylor Bailey',40,11,{crowd:'Quiet at 4:30'}),
       mkc('sat-p2','6:00 PM','Power 60','Casey Lin',60,9,{usual:1,crowd:'Busy at 6:00'})],
  sun:[],
  mon:[mkc('mon-p60','6:00 AM','Power 60','Taylor Bailey',60,8,{usual:1,crowd:'Quiet at 6:00'}),mkc('mon-cy','12:15 PM','Cycle','Jordan Reyes',45,10,{crowd:'Quiet at 12:15'}),mkc('mon-st','5:30 PM','Strength Lab','Sam Ortiz',50,5,{crowd:'Busy at 5:30'})],
  tue:[mkc('tue-cy','6:00 AM','Cycle','Jordan Reyes',45,9,{crowd:'Quiet at 6:00'}),mkc('tue-p60','5:30 PM','Power 60','Casey Lin',60,2,{usual:1,crowd:'Busy at 5:30'}),mkc('tue-mo','7:00 PM','Mobility','Taylor Bailey',40,12,{crowd:'Quiet at 7:00'})],
  wed:[mkc('wed-p60','6:00 AM','Power 60','Taylor Bailey',60,7,{usual:1,crowd:'Quiet at 6:00'}),mkc('wed-cy','6:00 PM','Cycle','Jordan Reyes',45,6,{state:'booked',crowd:'Busy at 6:00'})],
  thu:[mkc('thu-st','6:00 AM','Strength Lab','Sam Ortiz',50,7,{crowd:'Quiet at 6:00'}),mkc('thu-p60','12:00 PM','Power 60','Casey Lin',60,9,{usual:1,crowd:'Quiet at 12:00'}),mkc('thu-mo','6:30 PM','Mobility','Taylor Bailey',40,10,{crowd:'Quiet at 6:30'})],
  fri:[mkc('fri-p60','6:00 AM','Power 60','Taylor Bailey',60,6,{usual:1,crowd:'Quiet at 6:00'}),mkc('fri-cy','5:00 PM','Cycle','Jordan Reyes',45,4,{crowd:'Busy at 5:00'})]
};
const ONE=[{id:'o-bc',name:'Body Comp Scan',len:20,coach:'Maya Lopez',role:'Front desk',next:'Tue 12:30 PM',day:'Tue',t:'12:30 PM',photo:'stretch',bring:'Wear light clothing',crowd:'Quiet at 12:30'},
 {id:'o-gr',name:'Coach Goal Review',len:30,coach:'Taylor Bailey',role:'Coach',next:'Mon 5:00 PM',day:'Mon',t:'5:00 PM',photo:'cycle',bring:'Bring your goals',crowd:'Quiet at 5:00'},
 {id:'o-co',name:'Consultation',len:30,coach:'Maya Lopez',role:'Front desk',next:'today 2:00 PM',day:'Sat',t:'2:00 PM',photo:'bands',bring:'Nothing to bring',crowd:'Quiet at 2:00'}].map(o=>({...o,state:'book',one:1,spots:1}));
Object.entries(SCH).forEach(([k,l])=>l.forEach(c=>{c.day=k;c.o=mins(c.t)}));
const CLA=[...Object.values(SCH).flat(),...ONE];const CL=id=>CLA.find(c=>c.id===id);window.__p60=CL('sat-p60');
const DN=Object.fromEntries(DAYS.map(d=>[d.k,d.d]));DN.Tue='Tue';DN.Mon='Mon';DN.Sat='Sat';
const dayName=c=>DN[c.day]||c.day;
let selDay='sat',filt='All',schMode='cls';
function fillClass(c){
  $('#clLab').textContent=`${dayName(c)} · ${c.t} · ${c.len} min`;$('#clT').textContent=c.name;
  $('#clAv').textContent=c.coach.split(' ').map(w=>w[0]).join('');$('#clCoach').textContent=c.coach;$('#clRole').textContent=c.role||'Coach';
  $('#clChips').innerHTML=`<span class="chip">${ic('bag','s')}${c.bring}</span>${/^Busy/.test(c.crowd||'')?`<span class="chip">${ic('bars','s')}${c.crowd}</span>`:''}${c.friends?`<span class="chip">${ic('users','s')}${c.friends.length} friend${c.friends.length>1?'s':''} going</span>`:''}`;
  $('#clPromo').style.display=c.counts&&!c.one?'':'none';
}
const stHTML=c=>{
  if(c.state==='booked')return `<span class="cs bk">${ic('check','s')}Booked</span>`;
  if(c.state==='waitlist')return `<span class="cs wl">Waitlist #3</span>`;
  if(c.state==='full')return `<span class="cs fl act">Full · join list</span>`;
  return c.spots<=3?`<span class="cs lo">${c.spots} left</span>`:`<span class="cs">${c.spots} spots</span>`;
};
const avs=f=>f&&f.length?`<span class="avs">${f.map(x=>`<i>${x}</i>`).join('')}</span>`:'';
function rowHTML(c){
  const [tm,ap]=c.t.split(' ');
  return `<button class="crow" data-id="${c.id}" aria-label="${c.name}, ${dayName(c)} ${c.t}, ${c.coach}, ${c.state==='booked'?'booked':c.state==='full'?'full':c.spots+' spots left'}"><span class="ct"><b>${tm}</b><i>${ap}</i></span><span class="cm"><b>${c.name}${c.usual?'<i class="us">Usual</i>':''}</b><span>${c.coach} · ${c.len} min</span>${c.friends?`<span class="cf">${avs(c.friends)}${c.friends.length} friend${c.friends.length>1?'s':''} going</span>`:''}</span>${stHTML(c)}</button>`;
}
function ghostList(dir){
  const cl=$('#clist'),host=$('#schCls');if(rm||!cl||!cl.firstChild||host.hidden)return;
  const g=cl.cloneNode(true);g.removeAttribute('id');g.classList.remove('li');g.classList.add('ghost');g.setAttribute('aria-hidden','true');g.inert=true;
  $$('.sw',g).forEach(e=>e.classList.remove('sw'));
  g.style.cssText=`position:absolute;margin:0;left:${cl.offsetLeft}px;top:${cl.offsetTop}px;width:${cl.offsetWidth}px;--sx:${-dir*16}px`;
  host.appendChild(g);setTimeout(()=>g.remove(),260);
}
function renderSchedule(how,arg){
  if(!$('#days'))return;
  const fa=document.activeElement,refocus=fa&&fa.closest&&fa.closest('#days,#fchips')?(fa.dataset.d?`.dy[data-d="${fa.dataset.d}"]`:`.fc2[data-f="${fa.dataset.f}"]`):null;
  if(how==='day')ghostList(arg);
  const dEl=$('#days');let di=$('#dind'),fresh=false;
  if(!di){dEl.innerHTML='<i class="dind" id="dind" aria-hidden="true"></i>';di=$('#dind');di.style.transition='none';fresh=true}
  $$('.dy',dEl).forEach(e=>e.remove());
  dEl.insertAdjacentHTML('beforeend',DAYS.map(d=>{const l=SCH[d.k],bk=l.some(c=>c.state==='booked');return `<button class="dy${d.k===selDay?' on':''}" data-d="${d.k}" aria-pressed="${d.k===selDay}" aria-label="${d.full} ${d.n}${l.length?'':', no classes'}"><span>${d.d}</span><b>${d.n}</b><i class="${bk?'bk':(l.length?'has':'')}"></i></button>`}).join(''));
  di.style.setProperty('--i',DAYS.findIndex(d=>d.k===selDay));
  if(fresh){void di.offsetWidth;di.style.transition=''}
  const fch=$('#fchips');
  if(!fch.children.length){const types=['All',...new Set(Object.values(SCH).flat().map(c=>c.name))];fch.innerHTML=types.map(t=>`<button class="fc2" data-f="${t}">${t}</button>`).join('')}
  $$('.fc2',fch).forEach(b=>{const on=b.dataset.f===filt;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);if(on&&how==='filter'){fch.scrollTo({left:b.offsetLeft-(fch.clientWidth-b.offsetWidth)/2,behavior:rm?'auto':'smooth'})}});
  const day=SCH[selDay],list=day.filter(c=>filt==='All'||c.name===filt).sort((a,b)=>a.o-b.o);
  let h='';
  if(ED.closed&&selDay==='sun'){const nx=DAYS.find(d=>d.k==='mon');h=`<div class="empty"><i class="eic">${ic('lock')}</i><b>Closed Sunday</b><span>Back Monday at ${SCH.mon[0].t}</span><button class="btn s" data-d="mon">See Monday</button></div>`}
  else if(!day.length){const nx=DAYS.find(d=>SCH[d.k].length&&DAYS.indexOf(d)>DAYS.findIndex(x=>x.k===selDay));h=`<div class="empty"><i class="eic">${ic('cal')}</i><b>No classes on ${DAYS.find(d=>d.k===selDay).full}</b><span>${nx?`Next up: ${nx.full} at ${SCH[nx.k][0].t}`:'Check back soon'}</span>${nx?`<button class="btn s" data-d="${nx.k}">See ${nx.full}</button>`:''}</div>`}
  else if(!list.length){h=`<div class="empty"><i class="eic">${ic('cal')}</i><b>No ${filt} classes this day</b><button class="btn s" data-f="All">Show all classes</button></div>`}
  else{
    h=list.map(rowHTML).join('');
  }
  const cl=$('#clist');cl.innerHTML=h;
  if((how==='day'||how==='filter')&&!rm){
    cl.style.setProperty('--sx',how==='day'?arg*16+'px':'0px');cl.style.setProperty('--sy',how==='day'?'0px':'8px');
    $$('.crow,.empty',cl).forEach((r,k)=>{r.style.setProperty('--k',Math.min(k,4));r.classList.add('sw')});
  }else if(how==='pop'&&arg){const r=$(`.crow[data-id="${arg}"] .cs`,cl);if(r&&!rm)r.classList.add('chg')}
  if(refocus){const el=$(refocus);el&&el.focus({preventScroll:true})}
  const b=CLA.filter(c=>(c.state==='booked'||c.state==='waitlist')&&!(c.day===selDay&&schMode==='cls'&&!c.one)).sort((a,b)=>DAYS.findIndex(d=>d.k===a.day)-DAYS.findIndex(d=>d.k===b.day)||a.o-b.o);
  $('#olist').innerHTML=ONE.map(c=>`<button class="crow one" data-id="${c.id}" aria-label="${c.name}, ${c.len} minutes, next ${c.next}"><span class="ct"><b>${c.len}</b><i>MIN</i></span><span class="cm"><b>${c.name}</b><span>${c.coach}</span><span class="nx">Next ${c.next}</span></span>${c.state==='booked'?`<span class="cs bk">${ic('check','s')}Booked</span>`:'<span class="cs go">Book</span>'}</button>`).join('');
}
function setMode(m){
  if(m===schMode&&arguments[1]!=='force')return;
  schMode=m;$$('#schSeg button').forEach(b=>{const on=b.dataset.m===m;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});segSync($('#schSeg'));
  $('#schCls').hidden=m!=='cls';$('#schOne').hidden=m!=='one';$('#moBtn').style.visibility=m==='cls'?'visible':'hidden';if(m!=='cls')closeMonth(true);renderSchedule();
  [$('#schCls'),$('#schOne')].forEach(e=>{if(!e.hidden){e.style.setProperty('--sx',(m==='one'?16:-16)+'px');e.style.animation='none';void e.offsetWidth;e.style.animation=rm?'lif .3s var(--ease) both':'swc 280ms var(--ease) backwards'}});
}
$('#schSeg').addEventListener('click',e=>{const b=e.target.closest('button');if(b)setMode(b.dataset.m)});
$('#scr-sch').addEventListener('click',e=>{
  const d=e.target.closest('[data-d]');if(d){const o=DAYS.findIndex(x=>x.k===selDay),n=DAYS.findIndex(x=>x.k===d.dataset.d);if(o===n)return;selDay=d.dataset.d;renderSchedule('day',Math.sign(n-o));return}
  const f=e.target.closest('[data-f]');if(f&&f.closest('#fchips,#clist')){if(filt===f.dataset.f)return;filt=f.dataset.f;renderSchedule('filter');return}
  const r=e.target.closest('.crow,.uc');if(r){const c=CL(r.dataset.id);openClass(c.state,r,c)}
});

/* ---------- Month view: dots = classes, brand dot = booked, check = visited. Only the loaded week is tappable. ---------- */
const MO=[{n:'September',s:2,l:30,att:[1,3,4,8,10,11,15,17,18,22,24,29]},{n:'October',s:4,l:31},{n:'November',s:0,l:30}];
let moM=1,moOpen=false;
function moRender(dir){
  const m=MO[moM];$('#moTitle').textContent=`${m.n} 2026`;$('#moLab').textContent=m.n;
  $('#moPrev').disabled=moM===0;$('#moNext').disabled=moM===2;$('#moToday').hidden=moM===1;
  let h='';for(let i=0;i<m.s;i++)h+='<i class="mc blank"></i>';
  for(let d=1;d<=m.l;d++){
    const nm=`${m.n} ${d}`,k=d-1;
    if(moM===0||(moM===1&&d<10)){const a=moM===0?m.att.includes(d):ATT.includes(d);h+=`<span class="mc past${a?' a':''}" style="--k:${k}" aria-label="${nm}${a?', visited':''}">${a?ic('check'):d}</span>`}
    else if(moM===1&&d<=16){
      const dk=DAYS[d-10],l=SCH[dk.k],bk=l.some(x=>x.state==='booked'),t=d===10,sel=dk.k===selDay;
      const dots=(bk?'<i class="bk"></i>':'')+l.filter(x=>!(bk&&x.state==='booked')).slice(0,bk?2:3).map(x=>`<i class="${x.usual?'u':''}"></i>`).join('');
      h+=`<button class="mc win${t?' t':''}${sel?' on':''}" style="--k:${k}" data-md="${d}" aria-pressed="${sel}" aria-label="${dk.full} ${nm}${l.length?`, ${l.length} class${l.length>1?'es':''}`:', no classes'}${bk?', booked':''}${t?', today':''}"><b>${d}</b><span class="mdt">${dots}</span></button>`}
    else h+=`<button class="mc later" style="--k:${k}" data-later aria-label="${nm}, not on the schedule yet">${d}</button>`;
  }
  const g=$('#moGrid');g.innerHTML=h;
  if(dir&&!rm)g.animate([{opacity:0,transform:`translateX(${dir*18}px)`},{opacity:1,transform:'none'}],{duration:240,easing:EASE});
}
function flipBelow(fn){
  const els=[$('#fchips'),$('#clist')],t0=els.map(e=>e.getBoundingClientRect().top);fn();
  if(rm)return;els.forEach((e,i)=>{const dy=t0[i]-e.getBoundingClientRect().top;if(Math.abs(dy)>1)e.animate([{transform:`translateY(${dy}px)`},{transform:'none'}],{duration:280,easing:EASE})});
}
function openMonth(){
  if(moOpen||schMode!=='cls')return;moOpen=true;moM=1;moRender();
  const b=$('#moBtn');b.classList.add('open');b.setAttribute('aria-expanded','true');
  const g=$('#moGrid');g.classList.remove('in');
  flipBelow(()=>{$('.wkS').hidden=true;$('#moCard').hidden=false});
  void g.offsetWidth;g.classList.add('in');
  if(!rm)$('#moCard').animate([{opacity:0,transform:'translateY(-10px) scale(.985)'},{opacity:1,transform:'none'}],{duration:260,easing:EASE});
}
function closeMonth(fast){
  if(!moOpen)return;moOpen=false;
  const b=$('#moBtn');b.classList.remove('open');b.setAttribute('aria-expanded','false');
  const sw=()=>{$('#moCard').hidden=true;$('.wkS').hidden=false};
  if(fast)sw();else{flipBelow(sw);if(!rm)$('.wkS').animate([{opacity:0,transform:'translateY(-6px)'},{opacity:1,transform:'none'}],{duration:240,easing:EASE})}
}
function moGo(d){const n=moM+d;if(n<0||n>2)return;moM=n;moRender(d)}
$('#moBtn').addEventListener('click',()=>moOpen?closeMonth():openMonth());
$('#moPrev').addEventListener('click',()=>moGo(-1));$('#moNext').addEventListener('click',()=>moGo(1));
$('#moToday').addEventListener('click',()=>{const d=moM<1?1:-1;moM=1;moRender(d)});
$('#moGrid').addEventListener('click',e=>{
  const c=e.target.closest('.mc');if(!c)return;
  if(c.dataset.md){
    const k=+c.dataset.md-10,o=DAYS.findIndex(x=>x.k===selDay);
    $$('#moGrid .mc.on').forEach(x=>x.classList.remove('on'));c.classList.add('on','pop');
    selDay=DAYS[k].k;renderSchedule('day',Math.sign(k-o));
    setTimeout(closeMonth,rm?0:170);
  }else if(c.dataset.later!==undefined)toast('Not on the schedule yet');
});
{let sx=null;const g=$('#moGrid');g.addEventListener('pointerdown',e=>{sx=e.clientX});g.addEventListener('pointerup',e=>{if(sx==null)return;const dx=e.clientX-sx;sx=null;if(Math.abs(dx)>50)moGo(dx<0?1:-1)});g.addEventListener('pointercancel',()=>{sx=null})}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&moOpen&&!curSheet)closeMonth()});
$('#allBk').addEventListener('click',()=>openSheet('bookings'));
function updBkn(){if(typeof moOpen!=='undefined'&&moOpen)moRender();const n=CLA.filter(c=>c.state==='booked').length,e=$('#bkn');e.textContent=n;e.hidden=!n;$('#allBk').setAttribute('aria-label',n?`All bookings, ${n} upcoming`:'All bookings')}
const BK={
  past:[['Power 60','Thu, Oct 8 · 52 min · Taylor Bailey'],['Cycle','Tue, Oct 6 · 45 min · Jordan Reyes'],['Power 60','Sat, Oct 3 · 52 min · Taylor Bailey'],['Strength Lab','Thu, Oct 1 · 50 min · Sam Ortiz']],
  cx:[['Cycle','Fri, Oct 2 · Canceled in time · No fee']]
};
const BKO=['up','past','wl','cx'];let bkIdx=0;
function renderBk(t,anim){
  const ni=BKO.indexOf(t),bdir=Math.sign(ni-bkIdx)||1;bkIdx=ni;
  $$('#bkSeg button').forEach(b=>{b.classList.toggle('on',b.dataset.bk===t);b.setAttribute('aria-pressed',b.dataset.bk===t)});segSync($('#bkSeg'));
  let rows;
  if(t==='up')rows=CLA.filter(c=>c.state==='booked').map(c=>[c.name,`${dayName(c)} ${c.t} · ${c.len} min · ${c.coach}`,'Booked']);
  else if(t==='wl')rows=CLA.filter(c=>c.state==='waitlist').map(c=>[c.name,`${dayName(c)} ${c.t} · ${c.coach}`,'#'+((c.wl||0)+1)]);
  else if(t==='cx')rows=[...S.canceled,...BK.cx].map(r=>[r[0],r[1],'']);
  else rows=BK[t].map(r=>[r[0],r[1],'']);
  const bl=$('#bkList');bl.innerHTML=rows.length?rows.map(r=>`<div class="brow"><div><b>${r[0]}</b><span>${r[1]}</span></div>${r[2]?`<em>${r[2]}</em>`:''}</div>`).join(''):`<div class="empty"><b>Nothing here</b><span>${t==='wl'?'Full classes you join the waitlist for show up here.':'Your bookings show up here.'}</span></div>`;
  if(anim&&!rm){bl.style.setProperty('--sx',bdir*16+'px');bl.style.setProperty('--sy','0px');$$('.brow,.empty',bl).forEach((r,k)=>{r.style.setProperty('--k',Math.min(k,4));r.classList.add('sw')})}
}
$('#bkSeg').addEventListener('click',e=>{const b=e.target.closest('button');if(b&&!b.classList.contains('on'))renderBk(b.dataset.bk,true)});
hooks.open.bookings=()=>{bkIdx=0;renderBk('up')};

/* ---------- Me ---------- */
const MROWS=[
 [['id','Membership','Monthly · $129'],['card','Payments','Card on file'],['user','Profile details','']],
 [['doc','Documents','Waiver signed'],['gift','Refer friends','']],
 [['gear','Settings',''],['out','Log out','']]
];
function renderMe(){
  $('#mlist').innerHTML=MROWS.map(g=>`<div class="mg">${g.map(r=>`<button class="mr" data-l="${r[1]}"><span class="mi">${ic(r[0])}</span><b>${r[1]}</b>${r[2]?`<span class="md">${r[2]}</span>`:''}${r[1]==='Log out'?'':ic('chev-r','mc')}</button>`).join('')}</div>`).join('');
  $('#meClub').textContent='Member since March 2025';
}
/* ---------- Me sub-screens: new look, same fields. Every value here is a demo placeholder. ---------- */
const mrow=(i,t,d,cls='')=>`<button class="mr${cls}" data-go="${t}"><span class="mi">${ic(i)}</span><b>${t}</b>${d?`<span class="md">${d}</span>`:''}${ic('chev-r','mc')}</button>`;
const fld=(l,v)=>`<button class="mr fld" data-go="${l}"><div><span>${l}</span><b>${v}</b></div>${ic('chev-r','mc')}</button>`;
const swr=(k,t,d,on)=>`<button class="mr sw-row" role="switch" aria-checked="${on}" data-sw="${k}"><div><b>${t}</b><span>${d}</span></div><i class="tgl" aria-hidden="true"></i></button>`;
const drow=(t,d,ok=true)=>`<button class="mr" data-go="${t}"><span class="mi">${ic('doc')}</span><b>${t}</b><span class="md${ok?' okc':''}">${ok?ic('check','s'):''}${d}</span>${ic('chev-r','mc')}</button>`;
const SUB={
  'Membership':()=>`<div class="card"><div class="lab">Your plan</div><div class="big">Monthly 12</div><div class="sm">12 classes a month · Renews Nov 1</div>
     <div class="me-c" style="margin-top:14px"><b>8</b> of 12 classes left</div><div class="me-bar" role="img" aria-label="Classes used this month"><i style="transform:scaleX(.333)"></i></div></div>
   <div class="mg">${mrow('id','Change plan','')}${mrow('pause','Pause or cancel','')}</div>
   <div class="lab pl">Invoices</div>
   <div class="mg">${['Oct 1','Sep 1','Aug 1'].map(d=>`<button class="mr" data-go="Invoice"><span class="mi">${ic('doc')}</span><b>${d}</b><span class="md okc">${ic('check','s')}Paid · $129</span>${ic('chev-r','mc')}</button>`).join('')}</div>`,
  'Payments':()=>`<div class="card"><div class="lab">Payment method</div><div class="pm"><span class="mi">${ic('card')}</span><div><b>Visa ·· 4242</b><span>Expires 08/28</span></div></div><button class="btn s wide" data-go="Update card">Update card</button></div>
   <div class="lab pl">History</div>
   <div class="mg">${['Oct 1','Sep 1','Aug 1','Jul 1'].map(d=>`<div class="mr static"><b>${d}</b><span class="md">Monthly 12 · $129</span></div>`).join('')}</div>`,
  'Profile details':()=>`<div class="mg">${fld('Name','Alex Brooks')}${fld('Phone','(555) 010-0142')}${fld('Email','alex@example.com')}${fld('Birthday','Mar 14')}</div>
   <div class="mg">${fld('Address','123 Main St, Katy TX')}${fld('Emergency contact','Sam Brooks · (555) 010-0177')}${mrow('users','Household','Add family','')}</div>`,
  'Documents':()=>`<div class="mg">${drow('Liability waiver','Signed')}${drow('Photo release','Signed')}${drow('Membership agreement','Signed')}</div>`,
  'Refer friends':()=>`<div class="card ref"><span class="mi lg">${ic('gift')}</span><div class="big">Give a friend a free class</div><div class="sm">You get one too when they join.</div>
     <div class="lk"><span>club.link/alex-b</span><button class="btn s" data-act="toast" data-msg="Link copied">Copy</button></div>
     <div class="sh-btns"><button class="btn p" data-act="toast" data-msg="Demo: opens Messages">Messages</button><button class="btn s" data-act="toast" data-msg="Demo: phone share sheet">More</button></div></div>
   <div class="mg"><div class="mr static"><span class="mi">${ic('users')}</span><b>Friends joined</b><span class="md">2</span></div></div>`,
  'Settings':()=>`<div class="lab pl">Notifications</div><div class="mg">${swr('rem','Class reminders','1 hour before',true)}${swr('promo','Promos','Offers and news from your club',true)}</div>
   <div class="lab pl">Privacy</div><div class="mg">${swr('seen','Friends see my classes','Only people you accept',true)}${swr('cards','Share cards','Milestones and summaries',true)}</div>
   <div class="lab pl">Account</div><div class="mg">${mrow('lock','Change password','')}${mrow('out','Log out all devices','')}<button class="mr danger" data-go="Delete account"><b>Delete account</b></button></div>`
};
async function openSub(name){
  if(!SUB[name]||(subOpen&&subName===name))return;
  if(subOpen)await closeSub();if(curSheet)await closeSheet(true);if(progOpen)await closeProgress();
  subName=name;$('#subT').textContent=name;$('#sub').setAttribute('aria-label',name);
  const b=$('#subBody');b.innerHTML=SUB[name]();b.scrollTop=0;[...b.children].forEach((c,i)=>c.style.setProperty('--k',i));
  subOpen=true;syncInert(false);const s=$('#sub');s.classList.add('on','fill');s.setAttribute('aria-hidden','false');
  setTimeout(()=>s.classList.remove('fill'),1200);setTimeout(()=>$('#subBack').focus({preventScroll:true}),80);
}
async function closeSub(){
  if(!subOpen)return;subOpen=false;const s=$('#sub');s.classList.remove('on','fill');s.setAttribute('aria-hidden','true');syncInert(false);
  setTimeout(()=>{const r=$(`#mlist [data-l="${subName}"]`);r&&r.focus&&r.focus({preventScroll:true})},rm?260:380);
  await wait(rm?260:360);
}
$('#subBack').addEventListener('click',()=>closeSub());
$('#subBody').addEventListener('click',async e=>{
  const sw=e.target.closest('.sw-row');if(sw){sw.setAttribute('aria-checked',sw.getAttribute('aria-checked')!=='true');return}
  const g=e.target.closest('[data-go]');if(!g)return;
  const k=g.dataset.go;
  if(k==='Change plan'||k==='Pause or cancel'){await closeSub();await orbOpen();thread('staff');return}
  if(k==='Delete account'){toast('Demo: asks you to confirm first');return}
  toast(`Demo: ${k}`);
});
$('#mlist').addEventListener('click',e=>{const r=e.target.closest('.mr');if(!r)return;const l=r.dataset.l;if(l==='Log out')openAuth();else openSub(l)});
$$('#bSub [data-sub]').forEach(b=>b.addEventListener('click',async()=>{if(curSheet)await closeSheet(true);if(progOpen)await closeProgress();if(S.tab!=='me'){setTab('me');await wait(rm?60:480)}openSub(b.dataset.sub)}));
const INBOX=[['Maya · front desk','Hi Alex! Yes, first visit is free. We saved them a spot.','7:41 AM',1,'staff'],['Power 60 starts at 9:00','Doors open 8:45. See you there.','7:30 AM',0],['October Challenge','4 of 16 done. Keep going.','Yesterday',0],['6-week streak','Your longest yet.','Mon',0]];
function renderInbox(){$('#inboxList').innerHTML=INBOX.map((n,i)=>`<button class="nrow${n[3]?' un':''}" data-i="${i}"><i class="nd" aria-hidden="true"></i><div><b>${n[0]}</b><span>${n[1]}</span></div><em>${n[2]}</em></button>`).join('')}
hooks.open.inbox=renderInbox;
$('#inboxList').addEventListener('click',async e=>{const r=e.target.closest('.nrow');if(!r)return;const n=INBOX[+r.dataset.i];if(n[4]==='staff'){await closeSheet();await orbOpen();thread('staff')}else toast(n[0])});
$('#bell').addEventListener('click',()=>{openSheet('inbox');$('#bell').classList.add('read');$('#bell').setAttribute('aria-label','Notifications')});

/* ---------- week sync + Progress ---------- */
/* Streak (audit): 1 freeze a month covers a missed week; after a lapse, 3 visits in 10 days wins it back. Demo states only. */
S.streak='safe';
function streakSet(m){
  const prev=S.streak;S.streak=m;const w=$('#week');w.dataset.st=m;
  const st=$('#wkSt'),fz=$('#frz');
  if(m==='comeback'){st.innerHTML='<b>Streak paused</b>';fz.hidden=true}
  else{st.innerHTML='<b>6-week</b> streak';fz.hidden=false;fz.classList.toggle('used',m==='frozen');fz.querySelector('b').textContent=m==='frozen'?'0':'1';fz.setAttribute('aria-label',m==='frozen'?'Freeze used last week':'1 streak freeze left')}
  if(prev!==m&&!rm&&fz.animate&&!fz.hidden){const n=fz.querySelector('b');n.animate([{transform:'translateY(40%)',opacity:0},{transform:'none',opacity:1}],{duration:260,easing:'cubic-bezier(.05,.7,.1,1)'});fz.animate([{transform:'scale(.9)'},{transform:'scale(1.08)',offset:.55},{transform:'none'}],{duration:350,easing:'cubic-bezier(.2,0,0,1)'})}
  $('#skN').textContent=m==='comeback'?'1/3':'6';
  $('#skT').textContent=m==='comeback'?'Win back your 6 weeks':'6-week streak';
  $('#skS').textContent=m==='comeback'?'3 visits by Oct 20 restores it. 1 done.':(m==='frozen'?'Your freeze saved last week. A new one arrives Nov 1.':'1 freeze left. It covers a missed week on its own.');
  $('#strk').dataset.st=m;
  $$('#bElev [data-st]').forEach(b=>b.classList.toggle('on',b.dataset.st===m));
  syncWeek(false);
}
$('#bElev').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.st)streakSet(b.dataset.st);if(b.dataset.cr)creditsSet(+b.dataset.cr)});
$('#tuBtn').addEventListener('click',e=>shopOpen('p10',e.currentTarget));
function syncWeek(anim){
  const v=S.visits,g=S.goal,left=g-v,p=Math.min(1,v/g);
  [$('#wkRing')].forEach(r=>{if(r.dataset.goal!=g){r.dataset.goal=g;const o=r._p||0;buildDial(r);ringSet(r,o)}});
  $$('#wkRing .cnt').forEach(c=>c.textContent=`${Math.min(v,g)}/${g}`);
  $('#wkGoal').textContent=S.streak==='comeback'?'2 more visits by Oct 20 to win it back':(left>0?`${left} more visit${left>1?'s':''} to hit your goal`:'Goal reached');
  const lab=`Your week: ${v} of ${g} visits. Open progress`;$('#week').setAttribute('aria-label',lab);
  [$('#wkRing')].forEach(r=>{if(r._d||r._r)anim?ringAnim(r,p,900):ringSet(r,p)});
  if(fly){if(fly.dataset.goal!=g){fly.dataset.goal=g;const o=fly._p||0;buildDial(fly);ringSet(fly,o)}$('.cnt',fly).textContent=`${Math.min(v,g)}/${g}`;ringAnim(fly,p,500)}
  const gv=$('#gVal');if(gv)numSwap(gv,g);
}
const PR={week:[['2','visits'],['97','minutes'],['4','best week']],month:[['4','visits'],['199','minutes'],['2','best week']],all:[['24','workouts'],['1,248','minutes'],['6','best streak']]};
const ATT=[1,3,6,8];let todayIn=false;
let progSegI=0;const PSEG=['week','month','all'];
function buildProgress(seg,anim){
  seg=seg||'week';const pi=PSEG.indexOf(seg),pdir=Math.sign(pi-progSegI)||1;progSegI=pi;$$('#progSeg button').forEach(b=>{b.classList.toggle('on',b.dataset.pr===seg);b.setAttribute('aria-pressed',b.dataset.pr===seg)});segSync($('#progSeg'));PR.week[0][0]=String(S.visits);PR.month[0][0]=String(ATT.length);
  const pst=$('#pstats');pst.innerHTML=PR[seg].map((x,k)=>`<div class="ps${anim&&!rm?' sw':''}" style="--k:${k}"><b>${x[0]}</b><span>${x[1]}</span></div>`).join('');
  if(anim&&!rm){pst.style.setProperty('--sx',pdir*16+'px');pst.style.setProperty('--sy','0px')}
  let c='';['S','M','T','W','T','F','S'].forEach(d=>c+=`<span class="cd2">${d}</span>`);
  for(let i=0;i<4;i++)c+='<span></span>';
  for(let d=1;d<=31;d++){const a=ATT.includes(d),t=d===10,f=d>10;c+=`<span class="cl${a?' a':''}${t?' t':''}${f?' f':''}" style="--k:${ATT.indexOf(d)}" aria-label="October ${d}${a?', visited':''}${t?', today':''}">${a?ic('check'):d}</span>`}
  $('#cal').innerHTML=c;
  $('#mrow').innerHTML=[[1,1],[10,1],[25,0],[50,0],[100,0]].map((m,k)=>`<div class="mb${m[1]?' got':''}" style="--k:${k}"><b>${m[0]}</b><span>${m[1]?'Earned':(m[0]===25?'1 to go':'Locked')}</span></div>`).join('');
  $('#recent').innerHTML=[['Power 60','Thu, Oct 8 · 52 min'],['Cycle','Tue, Oct 6 · 45 min'],['Power 60','Sat, Oct 3 · 52 min']].map(r=>`<div class="brow"><div><b>${r[0]}</b><span>${r[1]}</span></div><button class="btn s ico" data-act="share-from-progress" aria-label="Share ${r[0]}">${ic('share')}</button></div>`).join('');
}
$('#progSeg').addEventListener('click',e=>{const b=e.target.closest('button');if(b&&!b.classList.contains('on'))buildProgress(b.dataset.pr,true)});
$('#gMinus').addEventListener('click',()=>{if(S.goal>1){S.goal--;syncWeek(true)}});
$('#gPlus').addEventListener('click',()=>{if(S.goal<7){S.goal++;syncWeek(true)}});

/* ---------- delegated clicks ---------- */
const ACT={
  directions:()=>{if(S.dist==='near')openSheet('checkin');else toast('Opens Maps · Katy')},
  cancel:()=>openClass('booked',$('#now')),
  key:()=>openSheet('checkin'),
  story:()=>openSheet('story'),
  join:()=>openPromo('challenge',$('#now')),
  'promo-challenge':()=>openPromo('challenge',$('#now')),
  'class-book':()=>openClass('book',$('#now')),
  'spot-book':()=>openClass('book',$('#now'),CL('sat-st')),
  acct:()=>openSub('Membership'),
  'tab-schedule':()=>setTab('schedule'),
  toast:b=>toast(b.dataset.msg),
  'class-book-orb':async()=>{await closeSheet();setNow('next');toast('Booked · Power 60 · Sat 9:00 AM')},
  'share-from-story':async()=>{await closeSheet();openSheet('share')},
  'share-from-progress':()=>openSheet('share'),
  summary:()=>openSheet('summary',$('#now')),
  friend:()=>openSheet('friend'),
  'book-next':async()=>{const c=CL('mon-p60');if(c.state!=='booked'){c.state='booked';updBkn()}await closeSheet();renderSchedule();toast('Booked · Power 60 · Mon 6:00 AM')}
};
phone.addEventListener('click',e=>{
  const a=e.target.closest('[data-act]');
  if(a&&ACT[a.dataset.act]){e.stopPropagation();ACT[a.dataset.act](a);return}
});
$('#now').addEventListener('click',e=>{if(e.target.closest('button'))return;if(S.now==='next')openClass('booked',$('#now'));else if(S.now==='usual'||S.now==='first')openClass('book',$('#now'));else if(S.now==='spot')openClass('book',$('#now'),CL('sat-st'));else if(S.now==='monthly')openSheet('story');else if(S.now==='recap')openSheet('summary',$('#now'))});
$('#week').addEventListener('click',()=>openProgress($('#wkRing')));
$('#week').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openProgress($('#wkRing'))}});
$('#keyBtn').addEventListener('click',()=>openSheet('checkin'));
$$('.club').forEach(c=>c.addEventListener('click',()=>toast('One location in this demo')));
$('#feat').addEventListener('click',e=>{const el=$('#feat');openPromo(el.dataset.pid,el)});
$('#row').addEventListener('click',e=>{const c=e.target.closest('.rc');if(c)openPromo(c.dataset.pid,c)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){abortMile();if(curSheet)closeSheet();else if(subOpen)closeSub();else if(progOpen)closeProgress()}});

/* ---------- demo bar ---------- */
function setVariant(v){
  v='c';S.v=v;root.dataset.v=v;$('#vtag').innerHTML=`<b>B+C</b>Round 2`;
  $$('#bVar [data-v]').forEach(x=>x.classList.toggle('on',x.dataset.v===v));
    requestAnimationFrame(()=>renderMarks());
}
$$('#bVar [data-v]').forEach(b=>b.addEventListener('click',()=>setVariant(b.dataset.v)));
$$('#bNow [data-now]').forEach(b=>b.addEventListener('click',async()=>{if(curSheet)await closeSheet(true);if(progOpen)await closeProgress();if(S.tab!=='home')setTab('home');setNow(b.dataset.now)}));
$$('#bBrand [data-b]').forEach(b=>b.addEventListener('click',()=>applyBrand(b.dataset.b)));
$$('#bBrand [data-name]').forEach(b=>b.addEventListener('click',()=>{S.longName=!S.longName;applyBrand(S.brand)}));
$$('#bOrb [data-o]').forEach(b=>b.addEventListener('click',()=>orbState(b.dataset.o)));
$$('#bTab [data-t]').forEach(b=>b.addEventListener('click',async()=>{if(b.dataset.t==='shop'&&!SHOP.on)shopSet(true);if(curSheet)await closeSheet(true);if(progOpen)await closeProgress();setTab(b.dataset.t)}));
async function flow(f){
  if(progOpen)await closeProgress();if(S.tab!=='home'){setTab('home');await wait(200)}
  if(f==='checkin')return openSheet('checkin');
  if(f==='scan'){await openSheet('checkin');await wait(rm?100:500);return scan()}
  if(f==='milestone')return milestone();
  if(f==='class'){if(curSheet)await closeSheet(true);setNow('usual');await wait(rm?50:480);return openClass('book',$('#now'))}
  if(f==='class-full'){if(curSheet)await closeSheet(true);setNow('usual');await wait(rm?50:480);return openClass('full',$('#now'))}
  if(f==='ring')return openProgress($('#wkRing'));
  if(f==='promo'){if(curSheet)await closeSheet(true);setNow('next');return openPromo('challenge',$('#feat'))}
  if(f==='crowd')return openSheet('crowd');
  if(f==='story')return openSheet('story');
  if(f==='month'){setTab('schedule');if(schMode!=='cls')setMode('cls');await wait(rm?50:420);return moOpen?closeMonth():openMonth()}
  if(f==='summary'){if(curSheet)await closeSheet(true);setNow('recap');await wait(rm?50:480);return openSheet('summary',$('#now'))}
}
$$('#bFlow [data-f]').forEach(b=>b.addEventListener('click',()=>flow(b.dataset.f)));
function setRm(on){rm=on;phone.classList.toggle('rm',on);const b=$('#bRm');b.setAttribute('aria-pressed',on);b.textContent='Reduce Motion: '+(on?'on':'off')}
$('#bRm').addEventListener('click',()=>setRm(!rm));
function replay(){$$('.li',$(PANELS.home)).forEach(e=>{e.style.animation='none';void e.offsetWidth;e.style.animation=''});ringSet($('#wkRing'),0);setTimeout(()=>ringAnim($('#wkRing'),S.visits/S.goal,900),rm?0:300)}
$('#bReplay').addEventListener('click',async()=>{if(curSheet)await closeSheet(true);if(progOpen)await closeProgress();if(S.tab!=='home')setTab('home');replay()});

/* ===== PLAY THE DAY (60s auto-run through the real app) ===== */
const DAY={run:false,paused:false,tok:0,skip:false,done:0,total:60000};
const dayAbort={};
const dayT=()=>rm?.5:1;
async function sl(ms){
  const tok=DAY.tok;ms*=dayT();let t=0;
  while(t<ms){
    if(tok!==DAY.tok)throw dayAbort;
    if(DAY.skip)return;
    await new Promise(r=>setTimeout(r,50));
    if(DAY.paused){while(DAY.paused&&tok===DAY.tok&&!DAY.skip)await new Promise(r=>setTimeout(r,80));continue}
    t+=50;DAY.done+=50;dayBar();
  }
}
function dayBar(){$('#dayBar').style.transform=`scaleX(${Math.min(1,DAY.done/(DAY.total*dayT())).toFixed(3)})`}
const dayBeat=t=>{$('#dayBeat').textContent=t};
const dayClock=t=>{$$('.tm').forEach(e=>e.textContent=t);const l=$('.lk-time');if(l)l.textContent=t};
const dayCd=t=>{const b=$('.ns[data-s=next] .cd b');if(b)b.textContent=t};
async function dayClean(tab){
  await edgeClear();if(curSheet)await closeSheet(true);if(outOpen)closeOut();
  if(tab&&S.tab!==tab){setTab(tab);await wait(rm?60:420)}
}
async function dayReset(){
  DAY.skip=false;scanStop();await dayClean();
  if(todayIn){todayIn=false;ATT.pop();$('#now').classList.remove('in')}
  ckBumped=false;S.visits=2;edgeReset();
  const m=CL('mon-p60');m.state='book';m.spots=8;
  distSet('far');lkSt='up';
  SHOP.orders.length=0;shopBagSync();SHOP.cat='All';shopRender();shopPay('reserve');shopSet(true);
  S.tab!=='home'&&setTab('home');setNow('next');syncNext();syncWeek(false);updBkn();selDay='sat';renderSchedule();
  dayClock('7:48');dayCd('1h 12m');
  const bg=$('#shBag');bg.classList.remove('wait','pop');
}
const DAYBEATS=[
 ['7:48 · Home',async()=>{await dayClean('home');dayClock('7:48');dayCd('1h 12m');distSet('far');await sl(6000)}],
 ['8:35 · Leave now',async()=>{dayClock('8:35');dayCd('25m');distSet('soon');await sl(5000)}],
 ['8:48 · At the club',async()=>{dayClock('8:48');dayCd('12m');await openOut('lock');lkSet('near');lkEnd=Date.now()+720000;lkTick();await sl(2800);lkSet('here');await sl(2400)}],
 ['Check in',async()=>{distSet('near');$('#lkCard').click();await sl(1500);if(curSheet!=='checkin')await openSheet('checkin');await sl(300);await scan();await sl(3600);await closeSheet();await sl(1500)}],
 ['Week goal',async()=>{await milestone();await sl(800)}],
 ['10:10 · After class',async()=>{dayClock('10:10');await dayClean('home');setNow('recap');await sl(6500)}],
 ['Book next class',async()=>{dayClock('10:14');await dayClean('schedule');const d=$('.dy[data-d="mon"]');d&&d.click();await sl(900);const r=$('.crow[data-id="mon-p60"]');r&&r.click();await sl(1500);$('#bookBtn').click();await sl(1800);await closeSheet();await sl(1500)}],
 ['Grab a shake',async()=>{dayClock('10:22');await dayClean('shop');await sl(800);const t=$('#shGrid .pt[data-p="sh"]');t&&t.click();await sl(1300);$('#siBtn').click();await sl(2800);await closeSheet();await sl(3200)}],
 ['Credits',async()=>{dayClock('10:30');await dayClean('me');await sl(4800)}],
 ['End',async()=>{await dayClean('home');setNow('recap');dayClock('12:00');await sl(2600)}]
];
async function dayPlay(){
  if(DAY.run){DAY.paused?dayResume():dayPause();return}
  const tok=++DAY.tok;DAY.run=true;DAY.paused=false;DAY.done=0;dayBar();
  $('#dayNext').disabled=false;$('#dayAgain').disabled=false;dayUi();
  try{
    await dayReset();
    for(let i=0;i<DAYBEATS.length;i++){
      if(tok!==DAY.tok)throw dayAbort;
      dayBeat(`${i+1}/${DAYBEATS.length} · ${DAYBEATS[i][0]}`);
      DAY.skip=false;
      await DAYBEATS[i][1]();
      DAY.skip=false;
    }
    dayBeat('Done · Replay');DAY.done=DAY.total*dayT();dayBar();
  }catch(e){if(e!==dayAbort)throw e;return}
  DAY.run=false;DAY.paused=false;dayUi();
}
function dayPause(){if(!DAY.run||DAY.paused)return;DAY.paused=true;dayUi()}
function dayResume(){DAY.paused=false;dayUi()}
function dayUi(){const b=$('#dayPlay');b.textContent=!DAY.run?'Play the day':DAY.paused?'Resume':'Pause';b.classList.toggle('on',DAY.run&&!DAY.paused)}
async function dayAgain(){DAY.tok++;DAY.run=false;DAY.paused=false;DAY.skip=false;await wait(120);dayPlay()}
$('#dayPlay').addEventListener('click',dayPlay);
$('#dayNext').addEventListener('click',()=>{if(DAY.run){DAY.paused=false;DAY.skip=true;dayUi()}});
$('#dayAgain').addEventListener('click',dayAgain);
phone.addEventListener('pointerdown',()=>{if(DAY.run&&!DAY.paused&&!DAY.skip)dayPause()},true);

/* ---------- fit to window ---------- */
function fit(){
  if(P.get('fit')==='0'){root.style.setProperty('--s',1);return}
  const bar=P.get('bar')!=='0';
  const s=Math.min(1,(innerHeight-(bar?72:24))/844,(innerWidth-(bar?352:24))/390);
  root.style.setProperty('--s',Math.max(.3,s).toFixed(4));
}
addEventListener('resize',fit);

/* ---------- init ---------- */
(async function init(){
  if(P.get('bar')==='0')document.body.classList.add('nobar');
  $$('.ring').forEach(buildRing);$('#prog').inert=true;$('#ckOk').inert=true;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||P.get('rm')==='1')setRm(true);
  const v=(P.get('v')||'c').toLowerCase();setVariant(['a','b','c'].includes(v)?v:'c');
  S.longName=P.get('name')==='long';
  setNow(['next','recap','monthly','usual','spot','first'].includes(P.get('state'))?P.get('state'):'next');
  setCk(P.get('ck')||'both');
  applyBrand(BRANDS[P.get('brand')]?P.get('brand'):'xgt');
  setTab('home');fit();
  if(document.fonts&&document.fonts.ready)await document.fonts.ready;
  renderMarks();
  syncWeek(false);setTab(S.tab);
  setTimeout(()=>ringAnim($('#wkRing'),S.visits/S.goal,900),rm?0:350);
  if(!rm)breathe();
  renderSchedule();renderMe();syncInert(false);nowSig=nowSigOf();$$('#schSeg,#progSeg,#bkSeg,#shLook,#outSeg').forEach(segInit);
  const st=P.get('state');
  const MAP={checkin:()=>flow('checkin'),scan:()=>flow('scan'),milestone:()=>flow('milestone'),class:()=>flow('class'),'class-full':()=>flow('class-full'),ring:()=>flow('ring'),promo:()=>flow('promo'),crowd:()=>flow('crowd'),story:()=>flow('story'),
    'orb-idle':()=>orbState('idle'),'orb-listening':()=>orbState('listening'),'orb-thinking':()=>orbState('thinking'),'orb-speaking':()=>orbState('speaking'),'orb-answer':()=>orbState('answer'),'orb-staff':()=>orbState('staff'),
    'tab-schedule':()=>setTab('schedule'),'tab-me':()=>setTab('me'),'joined':()=>join(),
    'sch-class':()=>{setTab('schedule');setTimeout(()=>openClass(CL('sat-cy').state,$('.crow[data-id="sat-cy"]'),CL('sat-cy')),500)},'sch-full':()=>{setTab('schedule');setTimeout(()=>openClass(CL('sat-st').state,$('.crow[data-id="sat-st"]'),CL('sat-st')),500)},'sch-empty':()=>{setTab('schedule');selDay='sun';renderSchedule()},'out-wallet':()=>openOut('wallet'),'out-lock':()=>openOut('lock'),'out-widget':()=>openOut('widget'),'sch-month':()=>{setTab('schedule');setTimeout(openMonth,500)},'sch-one':()=>{setTab('schedule');setMode('one')},'sch-bookings':()=>{setTab('schedule');openSheet('bookings')},'me-inbox':()=>{setTab('me');openSheet('inbox')},'me-progress':()=>{setTab('home');openProgress($('#wkRing'))}};
  if(MAP[st]){await wait(1300);MAP[st]()}else if(EDGE_STATE[st]){await wait(1300);EDGE_STATE[st]()}
  window.__core={S,CL,renderSchedule,syncWeek,openSheet,closeSheet,setNow,applyBrand,setVariant,flow,orbState,setTab,setRm,openProgress,closeProgress,get cur(){return curSheet}};
})();
})();
