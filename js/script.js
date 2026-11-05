/*
  SHIVA SAI KOMPALLE — PORTFOLIO INTERACTIONS

  This file contains the JavaScript interactions used by the page.
  Each section is kept in its own self-invoking function so variables
  do not leak into the global scope.
*/

/* 1. Pointer spotlight, animated statement, scroll progress and reveal effects */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $=function(s){return document.querySelector(s)};

  /* spotlight follows pointer */
  var spot=$('#spot');
  addEventListener('pointermove',function(e){spot.style.setProperty('--x',e.clientX+'px');spot.style.setProperty('--y',e.clientY+'px')},{passive:true});

  /* split statement into words */
  var st=$('#stmt'),txt=st.textContent.trim().split(' ');
  var hl={'spend':1,'intent':1,'testing.':1};
  st.innerHTML=txt.map(function(w){return '<span class="w'+(hl[w.replace(/[,]/g,'')]?' hl':'')+'">'+w+'</span>'}).join(' ');
  var words=[].slice.call(st.querySelectorAll('.w'));

  /* count up */
  var counted=false;
  function count(){
    if(counted)return;counted=true;var el=$('#num');
    if(reduce){el.textContent=20;return}
    var t0=performance.now();
    (function f(t){var p=Math.min((t-t0)/1800,1);el.textContent=Math.round(20*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(t0);
  }

  /* reveal on scroll */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return;
    e.target.classList.add('in');
    if(e.target.id==='proofgrid')count();
    io.unobserve(e.target);
  })},{threshold:.25});
  [].slice.call(document.querySelectorAll('.rv,#funnel,#proofgrid,#craftgrid')).forEach(function(n){io.observe(n)});
  var jobs=[].slice.call(document.querySelectorAll('.job'));
  var jo=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)e.target.classList.add('on')})},{rootMargin:'0px 0px -40% 0px'});
  jobs.forEach(function(j){jo.observe(j)});

  /* scroll-linked: progress bar, word scrub, timeline line */
  var bar=$('#bar'),sec=$('#statement'),tl=$('#tl'),draw=$('#draw'),tick=false;
  function update(){
    tick=false;var h=document.documentElement.scrollHeight-innerHeight;
    bar.style.transform='scaleX('+(h>0?scrollY/h:0)+')';
    var r=sec.getBoundingClientRect(),p=Math.min(Math.max(-r.top/(r.height-innerHeight),0),1);
    var n=Math.ceil(p*1.15*words.length);
    words.forEach(function(w,i){w.classList.toggle('on',i<n)});
    var t=tl.getBoundingClientRect(),q=Math.min(Math.max((innerHeight*.6-t.top)/t.height,0),1);
    draw.style.height=(q*100)+'%';
  }
  addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(update)}},{passive:true});
  addEventListener('resize',update);update();
})();

/* 2. Interactive portfolio sections and scroll-based navigation states */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $$=function(s){return [].slice.call(document.querySelectorAll(s))};
  /* tile tilt + glow */
  $$('.tile').forEach(function(t){var i=t.querySelector('.tin');
    t.addEventListener('pointermove',function(e){var r=t.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
      t.style.setProperty('--mx',x*100+'%');t.style.setProperty('--my',y*100+'%');
      if(!reduce)i.style.transform='perspective(900px) rotateX('+((.5-y)*5)+'deg) rotateY('+((x-.5)*7)+'deg)'});
    t.addEventListener('pointerleave',function(){i.style.transform=''})});
  if(!reduce){
    /* magnetic buttons */
    $$('.cta').forEach(function(b){
      b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.25)+'px,'+((e.clientY-r.top-r.height/2)*.35)+'px)'});
      b.addEventListener('pointerleave',function(){b.style.transform=''});b.style.transition='transform .25s,background .3s,color .3s'});
    /* hero parallax */
    var hv=document.querySelector('.hv'),hero=document.getElementById('hero');
    addEventListener('pointermove',function(e){if(!hv)return;hv.style.setProperty('--px',((e.clientX/innerWidth-.5)*-26)+'px');hv.style.setProperty('--py',((e.clientY/innerHeight-.5)*-20)+'px')},{passive:true});
    addEventListener('scroll',function(){hero.style.setProperty('--sy',Math.min(scrollY,900)*.3+'px')},{passive:true});
  }
  /* chat sequence */
  var chatDone=false;
  function chat(){if(chatDone)return;chatDone=true;$$('.m').forEach(function(m,i){setTimeout(function(){m.classList.add('show')},reduce?0:800+i*1200)})}
  /* counters */
  function counters(){$$('#strip i').forEach(function(el){var n=+el.dataset.n,t0=performance.now();
    if(reduce){el.textContent=n;return}
    (function f(t){var p=Math.min((t-t0)/1600,1);el.textContent=Math.round(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(t0)})}
  /* loop */
  var steps=$$('.step'),nodes=$$('.nd'),cur=0,timer;
  function setStep(i){cur=i;steps.forEach(function(s,k){s.classList.toggle('on',k===i)});nodes.forEach(function(n,k){n.classList.toggle('on',k===i)})}
  function run(){clearInterval(timer);if(!reduce)timer=setInterval(function(){setStep((cur+1)%4)},2600)}
  steps.forEach(function(s,i){s.addEventListener('click',function(){setStep(i);run()})});
  setStep(0);
  var io2=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return;
    if(e.target.classList.contains('t-wa'))chat();
    if(e.target.id==='strip')counters();
    if(e.target.id==='loopgrid')run();
    if(e.target.classList.contains('t-wa')||e.target.id==='strip')io2.unobserve(e.target);
  })},{threshold:.3});
  [].forEach.call(document.querySelectorAll('.t-wa,#strip,#loopgrid'),function(n){io2.observe(n)});
})();

/* 3. Header navigation and mobile menu behavior */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hd=document.querySelector('header'),bg=document.querySelector('.burger');
  function sc(){hd.classList.toggle('sc',scrollY>30)}
  addEventListener('scroll',sc,{passive:true});sc();
  function close(){hd.classList.remove('open');bg.setAttribute('aria-expanded','false');document.body.style.overflow=''}
  bg.addEventListener('click',function(){var o=hd.classList.toggle('open');bg.setAttribute('aria-expanded',o?'true':'false');document.body.style.overflow=o?'hidden':''});
  [].forEach.call(document.querySelectorAll('header nav a,.logo'),function(a){a.addEventListener('click',close)});
  addEventListener('keydown',function(e){if(e.key==='Escape')close()});
  addEventListener('resize',function(){if(innerWidth>820)close()});
  var links=[].slice.call(document.querySelectorAll('header nav a[href^="#"]')),secs=links.map(function(a){return document.querySelector(a.getAttribute('href'))});
  function act(){var y=innerHeight*.35,cur=-1;secs.forEach(function(s,i){if(s&&s.getBoundingClientRect().top<=y)cur=i});links.forEach(function(a,i){a.classList.toggle('on',i===cur)})}
  addEventListener('scroll',act,{passive:true});act();
  var pic=document.getElementById('pic');
  if(pic&&!reduce){
    pic.addEventListener('pointermove',function(e){var r=pic.getBoundingClientRect();pic.style.setProperty('--tx',((e.clientX-r.left)/r.width-.5).toFixed(3));pic.style.setProperty('--ty',((e.clientY-r.top)/r.height-.5).toFixed(3))});
    pic.addEventListener('pointerleave',function(){pic.style.setProperty('--tx',0);pic.style.setProperty('--ty',0)});
    addEventListener('scroll',function(){var r=pic.getBoundingClientRect(),v=(r.top+r.height/2-innerHeight/2)*-.05;pic.style.setProperty('--ps',Math.max(-18,Math.min(18,v)).toFixed(1)+'px')},{passive:true});
  }
})();

/* 4. SVG icons, system visualization and demo interactions */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var IC={target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4"/>',
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>',
    infinity:'<path d="M6.5 8c-3 0-4.5 2-4.5 4s1.5 4 4.5 4c4 0 7-8 11-8 3 0 4.5 2 4.5 4s-1.5 4-4.5 4c-4 0-7-8-11-8z"/>',
    chat:'<path d="M4 5h16v11H9l-5 4z"/>',
    chart:'<path d="M3 21h18"/><path d="M5 17l5-5 4 4 6-8"/><path d="M15 8h5v5"/>',
    sliders:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
    users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-4 3-6 6.5-6s6.5 2 6.5 6"/><circle cx="17.5" cy="9" r="2.5"/>',
    coin:'<circle cx="12" cy="12" r="9"/><path d="M8.5 8h7M8.5 11.5h7M9 8c4 0 5 3.5 0 4l5 5"/>',
    pie:'<circle cx="12" cy="12" r="9"/><path d="M12 3v9h9"/>'};
  function svg(k){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+IC[k]+'</svg>'}
  [].forEach.call(document.querySelectorAll('[data-i]'),function(e){e.innerHTML=svg(e.dataset.i)});

  var vis={os:false,dm:false};
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting&&e.target.classList.contains('once'))e.target.classList.add('in');
    if(e.target.id==='osc')vis.os=e.isIntersecting;
    if(e.target.id==='dpanel')vis.dm=e.isIntersecting;
  })},{threshold:.2});
  [].forEach.call(document.querySelectorAll('.once,#osc,#dpanel'),function(n){io.observe(n)});

  /* ORBIT STAGE */
  var N=[{k:'target',n:'Audience targeting',s:'Right people',d:'Audience research and targeting that put ads in front of the patients most likely to need the service.'},
    {k:'search',n:'Google Ads',s:'Search, Display, Video',d:'Keyword strategy, search term reviews and negative keywords keep spend on relevant traffic.'},
    {k:'infinity',n:'Meta Ads',s:'Facebook and Instagram',d:'Creative, copy and audience tests across Facebook and Instagram to find what earns the click.'},
    {k:'chat',n:'WhatsApp API',s:'Broadcasts',d:'Business API broadcasts for service awareness, engagement and appointment messages.'},
    {k:'chart',n:'Analytics',s:'Clear reporting',d:'Dashboards and Google Analytics turned into specific next steps.'},
    {k:'sliders',n:'Optimization',s:'Bids and budgets',d:'Bidding, budgets and A/B tests adjusted to lower CPC and CPL without losing conversions.'}];
  var st=document.getElementById('osc'),cap=document.getElementById('ocap'),h='',pk='',b=[],ln=[],pks=[];
  var D0='Hover or tap a node to see how it fits into the system.';
  N.forEach(function(){h+='<line class="ln2" x1="50" y1="50" x2="50" y2="50"/>';pk+='<circle class="pk" r=".9" cx="50" cy="50"/>'});
  st.innerHTML='<svg class="rings" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="rgx" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7b6cff"/><stop offset="1" stop-color="#ffb347"/></linearGradient></defs><circle class="rg1" cx="50" cy="50" r="46" fill="none" stroke="#2a3150" stroke-width=".25" stroke-dasharray=".6 1.6"/><circle class="rg2" cx="50" cy="50" r="24.5" fill="none" stroke="#7b6cff" stroke-opacity=".6" stroke-width=".35" stroke-dasharray="5 2"/><circle class="rg3" cx="50" cy="50" r="21" fill="none" stroke="url(#rgx)" stroke-width=".9" stroke-linecap="round" stroke-dasharray="14 118"/><circle cx="50" cy="50" r="19" fill="none" stroke="#7b6cff" stroke-opacity=".5" stroke-width=".4"/>'+h+pk+'</svg><div class="core"><div id="ct"></div></div>'
    +N.map(function(n){return '<button class="nd2"><span class="ni">'+svg(n.k)+'</span><span class="nl">'+n.n+'</span></button>'}).join('');
  b=[].slice.call(st.querySelectorAll('.nd2'));ln=[].slice.call(st.querySelectorAll('.ln2'));pks=[].slice.call(st.querySelectorAll('.pk'));
  var ct=document.getElementById('ct');
  function show(i){
    ct.style.opacity=0;
    setTimeout(function(){
      ct.innerHTML=i<0?'<div class="ci">'+svg('chart')+'</div><h3>Growth</h3><p>is a strategy, not luck.</p>':'<div class="ci">'+svg(N[i].k)+'</div><h3>'+N[i].n+'</h3><p>'+N[i].s+'</p>';
      cap.textContent=i<0?D0:N[i].d;ct.style.opacity=1;
    },reduce?0:180);
    b.forEach(function(el,k){el.classList.toggle('on',k===i)});
  }
  var R=35,tt=0,prev=0,cur=-1,hold=false,sw=0;
  function place(){N.forEach(function(n,i){
    var a=i*Math.PI*2/N.length-Math.PI/2+tt*.00006,x=50+R*Math.cos(a),y=50+R*Math.sin(a),p=(tt*.0004+i*.17)%1;
    b[i].style.left=x+'%';b[i].style.top=y+'%';
    ln[i].setAttribute('x2',x);ln[i].setAttribute('y2',y);
    pks[i].setAttribute('cx',50+(x-50)*p);pks[i].setAttribute('cy',50+(y-50)*p);
  })}
  function loop(t){
    requestAnimationFrame(loop);
    var dt=t-prev;prev=t;if(!vis.os||dt>200)return;
    if(!hold){tt+=dt;if(t-sw>3200){sw=t;cur=(cur+1)%N.length;show(cur)}}
    place();
  }
  b.forEach(function(el,i){
    function on(){hold=true;cur=i;show(i)}
    function off(){hold=false;sw=performance.now()}
    el.addEventListener('pointerenter',on);el.addEventListener('pointerleave',off);el.addEventListener('focus',on);el.addEventListener('blur',off);
  });
  show(-1);place();
  if(!reduce)requestAnimationFrame(loop);

  /* DEMO CAMPAIGNS */
  var PU='M0 14C40 20 70 34 110 40S190 56 230 62S280 66 300 68',PD='M0 66C40 60 70 52 110 44S190 28 230 20S280 14 300 10';
  var PV={
    s:'<div class="pvs"><div class="q">&#128269; heart specialist near me</div><small>Ad &middot; yourhospital.com</small><h4>Heart Specialist in Hyderabad</h4><p>Consult experienced cardiologists. Book online today.</p><div class="ext"><span>Call</span><span>Book</span><span>Directions</span></div></div>',
    m:'<div class="pvm"><div class="cr"><b>Full body checkup</b><span>Know your health in one visit</span></div><div class="b2"><span>Sponsored &middot; Facebook and Instagram</span><span class="bt">Book now</span></div></div>',
    w:'<div class="pvw"><div class="wb bot" style="--i:0">Hi! Your health checkup is tomorrow at 10:00.</div><div class="wq"><span>Confirm</span><span>Reschedule</span></div><div class="wb me" style="--i:1">Confirm</div><div class="wb bot" style="--i:2">Thank you. See you tomorrow.</div></div>',
    v:'<div class="pvv"><div class="thumb"><div class="play"></div><span class="skip">Skip ad</span></div><div class="vbar"><i></i></div></div>'};
  var C=[
   {t:'Google Search',n:'Cardiology consultation drive',g:'Appointment enquiries',a:'Adults 35+ within 15 km of the hospital',
    tc:['Intent keywords such as cardiologist near me','Weekly search term review and negative keywords','Call and booking extensions','Bid adjustments by location and time of day'],
    sp:[['Service keywords',60,'#7b6cff'],['Brand terms',20,'#ffb347'],['Remarketing',20,'#4a5280']],
    k:[['CTR',6.4,1,'','%','+1.8 pts'],['CPC',18,0,'\u20b9','','-20%'],['Conv. rate',8.2,1,'','%','steady']],cap:'Demo trend: cost per click over 8 weeks',pa:PU,pv:'s'},
   {t:'Meta Lead Ads',n:'Health checkup month',g:'Booked checkups',a:'Families and working professionals, 28 to 55, in Hyderabad',
    tc:['Instant lead forms with short questions','Three creative variants in an A/B test','Lookalike audience from past enquiries','Frequency caps to avoid ad fatigue'],
    sp:[['Prospecting',55,'#7b6cff'],['Lookalike',25,'#ffb347'],['Retargeting',20,'#4a5280']],
    k:[['CTR',2.9,1,'','%','+0.7 pts'],['CPL',165,0,'\u20b9','','-18%'],['Leads',340,0,'','','per month']],cap:'Demo trend: cost per lead over 8 weeks',pa:PU,pv:'m'},
   {t:'WhatsApp',n:'Appointment reminder series',g:'Fewer missed visits, more repeat bookings',a:'Existing patients who opted in',
    tc:['Opt-in broadcast with a clear service message','Reminder 24 hours before the appointment','Quick-reply buttons to confirm or reschedule','Template tests on timing and wording'],
    sp:[['Reminders',50,'#7b6cff'],['Service awareness',30,'#ffb347'],['Follow-ups',20,'#4a5280']],
    k:[['Delivered',97,0,'','%','of sends'],['Read rate',81,0,'','%','+6 pts'],['Replies',24,0,'','%','+4 pts']],cap:'Demo trend: read rate over 8 weeks',pa:PD,pv:'w'},
   {t:'Video and Display',n:'Maternity care awareness',g:'Awareness that turns into enquiries',a:'Expecting parents and past site visitors',
    tc:['30 second story video on YouTube','Display remarketing to site visitors','Placement exclusions to protect brand safety','View-through and enquiry tracking'],
    sp:[['Video',45,'#7b6cff'],['Display',30,'#ffb347'],['Remarketing',25,'#4a5280']],
    k:[['View rate',34,0,'','%','+5 pts'],['CPV',0.9,1,'\u20b9','','-15%'],['Remkt. CPL',190,0,'\u20b9','','-25%']],cap:'Demo trend: view rate over 8 weeks',pa:PD,pv:'v'}];
  var dp=document.getElementById('dpanel'),tabs=[].slice.call(document.querySelectorAll('.dt')),tb=document.getElementById('dtabs'),ci=0,auto=true,tm;
  function render(i){
    ci=i;tabs.forEach(function(x,k){x.classList.toggle('on',k===i)});var d=C[i];
    dp.innerHTML='<div class="dc"><span class="demo">Demo campaign &middot; sample figures</span><h3>'+d.n+'</h3><div class="meta2"><div><span>Channel</span><b>'+d.t+'</b></div><div><span>Goal</span><b>'+d.g+'</b></div><div style="grid-column:1/-1"><span>Audience</span><b>'+d.a+'</b></div></div><ul class="tact">'
      +d.tc.map(function(x,k){return '<li style="animation-delay:'+(.2+k*.12)+'s">'+x+'</li>'}).join('')+'</ul><div class="split">'
      +d.sp.map(function(x,k){return '<i style="width:'+x[1]+'%;background:'+x[2]+';animation-delay:'+(k*.15)+'s"></i>'}).join('')+'</div><div class="splitl">'
      +d.sp.map(function(x){return '<span><i style="background:'+x[2]+'"></i>'+x[0]+' '+x[1]+'%</span>'}).join('')+'</div></div>'
      +'<div class="dc dr">'+PV[d.pv]+'<div class="kpis">'
      +d.k.map(function(x){return '<div class="kpi"><span>'+x[0]+'</span><b data-v="'+x[1]+'" data-d="'+x[2]+'" data-p="'+x[3]+'" data-s="'+x[4]+'">0</b><em>'+x[5]+'</em></div>'}).join('')
      +'</div><svg viewBox="0 0 300 80" width="100%" aria-hidden="true"><path d="M0 79H300" stroke="#1d2230"/><path class="dl" d="'+d.pa+'"/></svg><p class="dcap">'+d.cap+'</p></div>';
    [].forEach.call(dp.querySelectorAll('[data-v]'),function(el){
      var v=+el.dataset.v,dc=+el.dataset.d,p=el.dataset.p||'',s=el.dataset.s||'';
      if(reduce){el.textContent=p+v.toFixed(dc)+s;return}
      var t0=performance.now();
      (function f(t){var q=Math.min((t-t0)/1300,1);el.textContent=p+(v*(1-Math.pow(1-q,3))).toFixed(dc)+s;if(q<1)requestAnimationFrame(f)})(t0);
    });
    clearTimeout(tm);
    if(auto&&!reduce)tm=setTimeout(function(){render(vis.dm?(ci+1)%C.length:ci)},7000);
  }
  tabs.forEach(function(x,k){x.addEventListener('click',function(){auto=false;tb.classList.add('stop');clearTimeout(tm);render(k)})});
  render(0);
})();

/* 5. Social links and remaining interface interactions */
(function(){
  var I={mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    wa:'<path d="M3 21l1.6-4.8A8.5 8.5 0 1 1 8 19.5z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z"/>',
    phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'};
  var S=[{n:'Email',h:'mailto:yashodarshivasai1997dm@gmail.com',i:'mail'},{n:'WhatsApp',h:'https://wa.me/919347433002',i:'wa',x:1},{n:'Call',h:'tel:+919347433002',i:'phone'}];
  var html=S.map(function(o,k){return '<a href="'+o.h+'" aria-label="'+o.n+'" title="'+o.n+'" style="--i:'+k+'"'+(o.x?' target="_blank" rel="noopener"':'')+'><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+I[o.i]+'</svg></a>'}).join('');
  [].forEach.call(document.querySelectorAll('[data-soc]'),function(e){e.innerHTML=html});
  var rail=document.getElementById('rail'),ct=document.getElementById('contact');
  function rl(){rail.classList.toggle('show',scrollY>500&&ct.getBoundingClientRect().top>innerHeight*.7)}
  addEventListener('scroll',rl,{passive:true});rl();
})();