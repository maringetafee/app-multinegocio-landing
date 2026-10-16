(()=>{
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const WA='https://wa.me/34689872320?text='+encodeURIComponent('Hola, quiero probar App Multinegocio 14 días.');
$$('[data-wa]').forEach(a=>a.href=WA);
const toastEl=$('#toast');let tt;
const toast=m=>{toastEl.textContent=m;toastEl.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>toastEl.classList.remove('show'),2800)};
const CHECK='<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7"/></svg>';
const countTo=(el,to,ms=900)=>{
  if(RM){el.textContent=to.toLocaleString('es-ES');return}
  const t0=performance.now();const from=+el.dataset.v||0;
  const f=t=>{const k=Math.min(1,(t-t0)/ms),e=1-Math.pow(1-k,3);el.textContent=Math.round(from+(to-from)*e).toLocaleString('es-ES');if(k<1)requestAnimationFrame(f);else el.dataset.v=to};
  requestAnimationFrame(f);
};

/* ---- titulares: palabras que suben ---- */
$$('[data-split]').forEach(el=>{
  let i=0;
  const walk=n=>{
    [...n.childNodes].forEach(c=>{
      if(c.nodeType===3){
        const frag=document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(p=>{
          if(!p)return;
          if(/^\s+$/.test(p)){frag.append(' ');return}
          const s=document.createElement('span');s.className='w';s.style.setProperty('--i',i++);s.textContent=p;frag.append(s);
        });
        c.replaceWith(frag);
      }else if(c.nodeType===1)walk(c);
    });
  };
  walk(el);
});

/* ---- día: lista ---- */
const DAY=[
 ['08:40','Hoy','Abres la app y lo ves todo: quién entra, quién libra y cuánta gente se espera.','f'],
 ['09:02','Fichar','Lucía mete su PIN. Si llega tarde, queda anotado, sin discusiones.','f'],
 ['11:30','Mensajes','Avisas de que hoy cambia la carta. Y ves quién lo ha leído, cosa que en el grupo de WhatsApp no pasa.','f'],
 ['13:10','Cambio de turno','Iván y Sara se cambian el sábado. Tú lo apruebas desde el móvil, de un toque.','p'],
 ['16:00','Ausencias','Andrés pide el 24 y el 25. Ves cuántos días le quedan antes de decir que sí.','f'],
 ['18:45','Reservas','Alguien reserva mesa para 6 desde tu web. Tú sigues atendiendo; el aviso llega a tu móvil.','p'],
 ['23:40','Costes','Cierras sabiendo lo que ha costado hoy el equipo, no un mes después con la nómina.','p'],
 ['Dom 20:00','IA','El resumen de la semana y el borrador del cuadrante del lunes, en un minuto.','p'],
];
$('#dayL').innerHTML=DAY.map(d=>`<li><time>${d[0]}</time><div><h3>${d[1]}</h3><p>${d[2]}</p></div><span class="prem ${d[3]==='f'?'prem--free':''}">${d[3]==='f'?'Gratis':'Premium'}</span></li>`).join('');

/* ---- IA: ocho cosas ---- */
const IA8=[
 ['Cuadrante en un minuto','Dile «el sábado hay evento, refuerza la sala» y tienes el borrador.'],
 ['Me falta alguien','Alguien se pone malo a las 9: te dice quién puede cubrirle y cuánto cuesta.'],
 ['El cuadrante más barato','Misma cobertura, menos gasto. Y te enseña cuánto ahorras.'],
 ['Personal según tus reservas','Mira las reservas de la semana y te avisa: el sábado te faltan dos en sala.'],
 ['Pregúntale lo que quieras','¿Quién ha hecho más horas este mes? ¿Cuánto me costó agosto?'],
 ['Tu resumen del lunes','Horas, retrasos, olvidos de fichar y costes, en una sola pantalla.'],
 ['Fichajes sin líos','Detecta olvidos y horas raras, y propone cómo corregirlos. Decides tú.'],
 ['Escribe por ti','Redacta los avisos al equipo con el tono que prefieras.'],
];
$('#ia8').innerHTML=IA8.map(x=>`<li><b>${x[0]}</b><span>${x[1]}</span></li>`).join('');

/* ---- hero: tarjeta de fichar ---- */
const PD=[['Lun','08:58','17:04','8,1'],['Mar','09:01','17:00','8,0'],['Mié','08:55','17:10','8,2'],['Jue','09:03','16:58','7,9']];
let ps=0,inT='',outT='',outH='',newCell='';
const hhmm=()=>{const d=new Date();return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};
const addMin=(t,m)=>{const [h,mm]=t.split(':').map(Number);const x=(h*60+mm+m)%1440;return String(Math.floor(x/60)).padStart(2,'0')+':'+String(x%60).padStart(2,'0')};
function drawP(){
  let h='<div class="th">Día</div><div class="th">Entrada</div><div class="th">Salida</div><div class="th">Horas</div>';
  PD.forEach(r=>{h+=`<div class="d">${r[0]}</div><div class="t">${r[1]}</div><div class="t">${r[2]}</div><div class="t">${r[3]}</div>`});
  h+=`<div class="d today">Vie</div><div class="today ${inT?'e st':'t'}">${inT||'··:··'}</div><div class="today ${outT?'e st':'t'}">${outT||'··:··'}</div><div class="today ${outH?'e st':'t'}">${outH||'—'}</div>`;
  h+='<div class="d">Sáb</div><div class="free">libra</div><div class="d">Dom</div><div class="free">libra</div>';
  $('#ptab').innerHTML=h;
  $('#ptot').textContent=outH?'40,3 h':'32,2 h';
  const b=$('#stampBtn');b.textContent=ps===0?'Fichar entrada':ps===1?'Fichar salida':'Otra vez';
}
$('#stampBtn').addEventListener('click',()=>{
  if(ps===0){inT=hhmm();ps=1;$('#pmsg').textContent=`Entrada anotada a las ${inT}. En la app es el móvil, sin cartón y sin reloj de pared.`}
  else if(ps===1){outT=addMin(inT,484);outH='8,1';ps=2;$('#pmsg').textContent=`Salida a las ${outT}. Hoy: 8,1 h. La semana suma 40,3 h de 40 de contrato.`}
  else{ps=0;inT=outT=outH='';$('#pmsg').textContent='Pruébalo: toca el botón y estampa la entrada de hoy.'}
  drawP();
});
drawP();

/* ---- IntersectionObserver ---- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15,rootMargin:'0px 0px -6% 0px'});
$$('[data-split],.rv,#oldT').forEach(el=>io.observe(el));
setTimeout(()=>$$('[data-split],.rv,#oldT').forEach(el=>el.classList.add('in')),4000);
new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('hero--off',!e.isIntersecting))).observe($('.hero'));

/* ============ 01 FICHAJE ============ */
const staff=[
  {n:'Lucía',r:'Sala',pin:'1234',h:'09:00',c:'#FAC675',in:false,t:''},
  {n:'Andrés',r:'Cocina',pin:'2580',h:'09:30',c:'#F28DB8',in:false,t:''},
  {n:'Iván',r:'Barra',pin:'4321',h:'10:00',c:'#C79BE0',in:false,t:''},
];
let pin='';
const dots=$$('#pinDots i'),msg=$('#pinMsg');
const KEYS=['1','2','3','4','5','6','7','8','9','C','0','⌫'];
$('#keys').innerHTML=KEYS.map(k=>`<button type="button" data-k="${k}" class="${k==='C'||k==='⌫'?'k-s':''}" aria-label="${k==='⌫'?'Borrar':k==='C'?'Limpiar':k}">${k}</button>`).join('');
function drawBoard(flashIdx=-1){
  $('#board').innerHTML=staff.map((s,i)=>`<div class="emp ${s.in?'in':''} ${i===flashIdx?'flash':''}"><span class="av" style="background:${s.c}">${s.n[0]}</span><span class="emp__n">${s.n}<small>${s.r} · ${s.h}</small></span><span class="emp__s">${s.in?'Dentro<br>desde '+s.t:s.t==='fuera'?'Turno<br>cerrado':'Por llegar'}</span></div>`).join('');
  $('#inCount').textContent=`${staff.filter(s=>s.in).length} de 3 dentro`;
}
function drawPin(){dots.forEach((d,i)=>d.classList.toggle('on',i<pin.length))}
function say(t,c=''){msg.className='pin-msg '+c;msg.innerHTML=t}
function submit(){
  const i=staff.findIndex(s=>s.pin===pin);
  if(i<0){
    const w=$('#pinDots');w.classList.remove('shake');void w.offsetWidth;w.classList.add('shake');
    say('PIN incorrecto. Prueba con 1234, 2580 o 4321.','bad');
    setTimeout(()=>{pin='';drawPin()},450);return;
  }
  const s=staff[i];
  if(!s.in){s.in=true;s.t=hhmm();say(`Hola, ${s.n}. Entrada registrada a las ${s.t}`,'ok')}
  else{s.in=false;s.t='fuera';say(`Hasta mañana, ${s.n}. Turno cerrado.`,'ok')}
  drawBoard(i);
  setTimeout(()=>{pin='';drawPin();say('Esperando PIN…')},1900);
}
async function press(k){
  if(pin.length>=4&&k!=='C'&&k!=='⌫')return;
  if(k==='C')pin='';else if(k==='⌫')pin=pin.slice(0,-1);else pin+=k;
  drawPin();
  if(pin.length===4){say('Comprobando…');await wait(280);submit()}
}
$('#keys').addEventListener('click',e=>{const b=e.target.closest('button');if(b)press(b.dataset.k)});
addEventListener('keydown',e=>{
  const demo=$('#d1').matches(':hover')||$('#d1').contains(document.activeElement);
  if(!demo)return;
  if(/^[0-9]$/.test(e.key))press(e.key);else if(e.key==='Backspace')press('⌫');
});
$('#quick').innerHTML=staff.map(s=>`<button class="chip" type="button" data-p="${s.pin}">Fichar como ${s.n}</button>`).join('');
let typing=false;
$('#quick').addEventListener('click',async e=>{
  const b=e.target.closest('button');if(!b||typing)return;typing=true;
  pin='';drawPin();
  for(const d of b.dataset.p){await wait(RM?0:170);await press(d)}
  await wait(RM?0:2300);typing=false;
});
drawBoard();

/* ============ 02 CUADRANTE IA ============ */
const DAYS=['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
const TEAM=[
  {n:'Lucía',c:'#FAC675',w:['M','M','-','M','M','T','-']},
  {n:'Andrés',c:'#F28DB8',w:['T','T','T','-','T','T','-']},
  {n:'Iván',c:'#C79BE0',w:['-','T','M','M','-','T','T']},
  {n:'Sara',c:'#C79BE0',w:['M','-','T','T','M','-','M']},
];
const TXT={M:'09–17',T:'16–00'};
const NOTES=[{k:'evento',t:'El sábado hay evento'},{k:'vac',t:'Andrés está de vacaciones'},{k:'tranq',t:'Semana tranquila'}];
const sel=new Set();
$('#notes').innerHTML=NOTES.map(n=>`<button class="chip" type="button" data-k="${n.k}" aria-pressed="false">${n.t}</button>`).join('');
$('#notes').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b||busy)return;
  const k=b.dataset.k;
  if(k==='tranq')sel.delete('evento');
  if(k==='evento')sel.delete('tranq');
  sel.has(k)?sel.delete(k):sel.add(k);
  $$('#notes .chip').forEach(c=>{const on=sel.has(c.dataset.k);c.classList.toggle('on',on);c.setAttribute('aria-pressed',on)});
  resetGrid();
});
let busy=false,state='idle';
function plan(){
  const g=TEAM.map(p=>p.w.map(x=>({s:x,flag:''})));
  if(sel.has('tranq'))[[0,3],[1,1],[2,3],[3,4]].forEach(([r,d])=>{g[r][d]={s:'-',flag:''}});
  if(sel.has('vac')){
    g[1].forEach((x,d)=>{
      if(x.s!=='-'){
        const cov=[2,3].find(r=>g[r][d].s==='-');
        if(cov!==undefined)g[cov][d]={s:x.s,flag:'cubre'};
      }
      g[1][d]={s:'V',flag:''};
    });
  }
  if(sel.has('evento')){
    [0,2,3].forEach(r=>{if(g[r][5].s==='-')g[r][5]={s:'T',flag:'ref'}});
    if(g[1][5].s==='-')g[1][5]={s:'T',flag:'ref'};
  }
  return g;
}
function drawGrid(g,mode){
  let h='<div class="dh"></div>'+DAYS.map((d,i)=>`<div class="dh ${i===5&&sel.has('evento')?'ev':''}">${d.toUpperCase()}${i===5&&sel.has('evento')?' ★':''}</div>`).join('');
  let k=0;
  g.forEach((row,r)=>{
    h+=`<div class="nm"><span class="av" style="background:${TEAM[r].c}">${TEAM[r].n[0]}</span>${TEAM[r].n}</div>`;
    row.forEach((x,d)=>{
      if(mode==='empty'||x.s==='-'){h+='<div class="c">'+(mode==='empty'?'·':'libre')+'</div>';return}
      if(x.s==='V'){h+='<div class="c vac f" style="--cc:#777;animation-delay:'+(k++*.04)+'s">Vacac.</div>';return}
      const lab=(x.flag==='ref'?'★ ':x.flag==='cubre'?'↺ ':'')+TXT[x.s];
      h+=`<div class="c f ${mode}" style="--cc:${TEAM[r].c};--dl:${(d*.06+r*.05).toFixed(2)}s">${lab}</div>`;
    });
  });
  $('#sg').innerHTML=h;
}
function count(g){let t=0,hrs=0;g.forEach(r=>r.forEach(x=>{if(x.s==='M'||x.s==='T'){t++;hrs+=8}}));return{t,hrs}}
function resetGrid(){
  state='idle';$('#aiGo').hidden=false;$('#aiGo').disabled=false;$('#aiGo').textContent='✦ Preparar el cuadrante';$('#aiReset').hidden=true;
  $('#aiMsg').innerHTML='Dime cómo viene la semana (opcional) y pulsa el botón.';
  drawGrid(plan(),'empty');
}
$('#aiGo').addEventListener('click',async()=>{
  if(busy)return;
  if(state==='idle'){
    busy=true;$('#aiGo').disabled=true;
    for(const s of ['Mirando vacaciones y ausencias…','Comprobando disponibilidad…','Repartiendo por puestos y horas de contrato…']){$('#aiMsg').innerHTML=`<span class="spin"></span>${s}`;await wait(RM?0:650)}
    const g=plan(),c=count(g);
    drawGrid(g,'draft');
    const extra=[sel.has('evento')?'Refuerzo el sábado ★':'',sel.has('vac')?'Andrés cubierto ↺':''].filter(Boolean).join(' · ');
    $('#aiMsg').innerHTML=`<b>Borrador listo: ${c.t} turnos · ${c.hrs} h</b><small>${extra||'Todo cubierto'} · Tú decides: nada se publica solo.</small>`;
    state='draft';busy=false;$('#aiGo').disabled=false;$('#aiGo').textContent='Aprobar y publicar';
    $('#aiReset').hidden=false;
  }else if(state==='draft'){
    drawGrid(plan(),'pub');
    $('#aiMsg').innerHTML='<b>✓ Cuadrante publicado</b><small>4 empleados avisados en su móvil.</small>';
    state='pub';$('#aiGo').hidden=true;toast('Cuadrante publicado · 4 empleados avisados');
  }
});
$('#aiReset').addEventListener('click',resetGrid);
resetGrid();

/* ============ 03 RESERVAS ============ */
let rDay='Hoy',rTime='21:00',rParty=2;
const DAYSR=['Hoy','Mañana','Sáb'],TIMES=['20:00','20:30','21:00','21:30','22:00'],FULL=['21:30'];
function drawR(){
  $('#rDays').innerHTML=DAYSR.map(d=>`<button class="opt ${d===rDay?'on':''}" type="button" data-d="${d}">${d}</button>`).join('');
  $('#rTimes').innerHTML=TIMES.map(t=>`<button class="opt ${t===rTime?'on':''}" type="button" data-t="${t}" ${FULL.includes(t)&&rDay==='Hoy'?'disabled title="Completo"':''}>${t}</button>`).join('');
  $('#pNum').textContent=rParty;
}
const sheet=$('#sheet'),sheetHTML=sheet.innerHTML;
sheet.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.d){rDay=b.dataset.d;if(FULL.includes(rTime)&&rDay==='Hoy')rTime='21:00';drawR()}
  else if(b.dataset.t){rTime=b.dataset.t;drawR()}
  else if(b.id==='pMinus'){rParty=Math.max(1,rParty-1);drawR()}
  else if(b.id==='pPlus'){rParty=Math.min(10,rParty+1);drawR()}
  else if(b.id==='rGo')reservar();
  else if(b.id==='rAgain'){sheet.innerHTML=sheetHTML;drawR()}
});
const RS=[{n:'Pedro',p:2,t:'20:30',d:'Hoy',ok:true},{n:'Familia Ruiz',p:6,t:'21:00',d:'Hoy',ok:true}];
function drawList(newI=-1){
  $('#rList').innerHTML=RS.map((r,i)=>`<div class="rsv ${i===newI?'new':''}"><time>${r.t}</time><span>${r.n}<small>${r.p} pers. · ${r.d}</small></span>${r.ok?'<span style="margin-left:auto;color:#3DDC9A">✓</span>':`<button class="mini-btn" data-i="${i}" type="button">Confirmar</button>`}</div>`).join('');
  countTo($('#rCount'),RS.length,500);
}
$('#rList').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;RS[+b.dataset.i].ok=true;drawList();toast('Reserva confirmada · email enviado al cliente')});
async function reservar(){
  const n=($('#rName').value.trim()||'Cliente');
  RS.push({n,p:rParty,t:rTime,d:rDay,ok:false});RS.sort((a,b)=>a.d===b.d?a.t.localeCompare(b.t):(a.d==='Hoy'?-1:1));
  const idx=RS.findIndex(r=>r.n===n&&r.t===rTime);
  sheet.innerHTML=`<div class="okcard"><i>${CHECK}</i><h5>¡Reserva enviada!</h5><p style="font-size:14px;color:var(--mut)">${n} · ${rParty} pers. · ${rDay} ${rTime}<br>Te llegará la confirmación por email.</p><button class="btn btn--block" id="rAgain" type="button" style="margin-top:14px">Hacer otra</button></div>`;
  await wait(RM?0:500);
  $('#pushT').textContent=`${n} · ${rParty} pers. · ${rDay} ${rTime}`;
  $('#push').classList.add('show');
  drawList(idx);
  setTimeout(()=>$('#push').classList.remove('show'),3200);
}
drawR();drawList();

/* ============ 04 MI WEB ============ */
const SITES={
  bar:{lab:'Bar',nombre:'Café Central',h:'Desayunos de verdad.',p:'Tostadas, café de especialidad y tarta casera, en pleno Getafe.',cta:'Reservar mesa',l:'Carta',it:[['Tostada con tomate','3,50 €'],['Café con leche','1,80 €'],['Tarta de la casa','4,20 €']],hor:'Lun–Sáb · 8:00–23:00',url:'cafe-central'},
  pelu:{lab:'Peluquería',nombre:'Peluquería Nube',h:'Tu pelo, a tu aire.',p:'Corte, color y peinado con cita previa, sin esperas.',cta:'Pedir cita',l:'Servicios',it:[['Corte y secado','18 €'],['Color completo','45 €'],['Peinado de fiesta','25 €']],hor:'Mar–Sáb · 10:00–20:00',url:'peluqueria-nube'},
  clinica:{lab:'Clínica',nombre:'Clínica Sol',h:'Te atendemos sin prisas.',p:'Consultas con cita online y recordatorio por email.',cta:'Pedir cita',l:'Servicios',it:[['Primera consulta','40 €'],['Revisión anual','55 €'],['Limpieza','60 €']],hor:'Lun–Vie · 9:00–19:00',url:'clinica-sol'},
  tienda:{lab:'Tienda',nombre:'Tienda Brisa',h:'Lo que buscas, a mano.',p:'Producto local y de temporada. Pásate o pregúntanos.',cta:'Ver horario',l:'Destacados',it:[['Cesta de temporada','24 €'],['Aceite de la sierra','9,50 €'],['Pan de leña','2,20 €']],hor:'Lun–Sáb · 9:30–14:00 y 17:00–20:30',url:'tienda-brisa'},
};
let wk='bar',pub=false;
$('#wChips').innerHTML=Object.entries(SITES).map(([k,s])=>`<button class="wchip" type="button" data-k="${k}" aria-pressed="${k===wk}">${s.lab}</button>`).join('');
function qrSvg(seed){
  let s=0;for(const c of seed)s=(s*31+c.charCodeAt(0))>>>0;
  const r=()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296};
  const N=15;let p='';
  const finder=(x,y)=>`<path d="M${x} ${y}h7v7h-7z" fill="#240B2E"/><path d="M${x+1} ${y+1}h5v5h-5z" fill="#fff"/><path d="M${x+2} ${y+2}h3v3h-3z" fill="#240B2E"/>`;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){
    if((x<8&&y<8)||(x>N-9&&y<8)||(x<8&&y>N-9))continue;
    if(r()>.5)p+=`M${x} ${y}h1v1h-1z`;
  }
  return `<svg viewBox="0 0 ${N} ${N}" shape-rendering="crispEdges" aria-hidden="true"><path d="${p}" fill="#240B2E"/>${finder(0,0)}${finder(N-7,0)}${finder(0,N-7)}</svg>`;
}
function drawSite(){
  const s=SITES[wk];
  const el=$('#site');el.dataset.s=wk;
  el.innerHTML=`<div class="site__nav"><b>${s.nombre}</b><span><i style="font-style:normal">${s.l}</i><i style="font-style:normal">Horario</i><i style="font-style:normal">Contacto</i></span></div>
  <div class="site__hero"><h6>${s.h}</h6><p>${s.p}</p><span class="site__cta">${s.cta}</span></div>
  <div class="site__list">${s.it.map(i=>`<div><b>${i[0]}</b><span>${i[1]}</span></div>`).join('')}</div>
  <div class="site__foot"><div><b>Horario</b><br>${s.hor}</div><div class="site__map" aria-hidden="true"></div></div>`;
  $$('#wChips .wchip').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===wk));
  if(pub)showPub();
}
function showPub(){
  const s=SITES[wk];
  $('#wdUrl').textContent='tu-enlace/'+s.url;$('#wdState').textContent='En internet ✓';$('#wdState').classList.add('on');
  $('#qr').innerHTML=qrSvg(s.url)+'<span>Enlace y QR listos<br>para repartir</span>';$('#qr').classList.add('on');
}
$('#wChips').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;wk=b.dataset.k;drawSite()});
$('#wdPub').addEventListener('click',async()=>{
  const b=$('#wdPub');
  if(pub){pub=false;$('#wdUrl').textContent='vista previa · solo la ves tú';$('#wdState').textContent='Borrador';$('#wdState').classList.remove('on');$('#qr').classList.remove('on');b.textContent='Publicar mi web · Premium';return}
  b.disabled=true;b.textContent='Publicando…';await wait(RM?0:900);
  pub=true;showPub();b.disabled=false;b.textContent='Despublicar (probar otra vez)';
  toast('Tu web ya está en internet · con tus reservas dentro');
});
drawSite();

/* ============ 05 REGISTRO ============ */
const RG=[
  {n:'Lucía',e:'09:02',s:'17:05',h:'8,0',st:'ok'},
  {n:'Andrés',e:'09:11',s:'',h:'—',st:'open'},
  {n:'Iván',e:'10:00',s:'18:00',h:'8,0',st:'ok'},
];
function drawRG(){
  $('#rBody').innerHTML=RG.map((r,i)=>{
    const why=r.why?`<span class="why">${r.why}</span>`:'';
    const btn=r.st==='open'?`<button class="rbtn" data-i="${i}" data-a="fix" type="button">Corregir</button>`:r.st==='void'||r.st==='fixed'?'<button class="rbtn" disabled type="button">Guardado</button>':`<button class="rbtn" data-i="${i}" data-a="void" type="button">Anular</button>`;
    return `<tr class="${r.st==='void'?'void':''}"><td>${r.n}${why}</td><td class="m">${r.e}</td><td class="m">${r.s||'<span style="color:var(--tomato)">sin cerrar</span>'}</td><td class="m">${r.h}</td><td class="act">${btn}</td></tr>`;
  }).join('');
}
$('#rBody').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b||b.disabled)return;
  const r=RG[+b.dataset.i];
  if(b.dataset.a==='fix'){r.s='17:30';r.h='8,3';r.st='fixed';r.why='Corregido por Marta (jefe): se olvidó de fichar la salida. Antes: sin salida · Después: 17:30';toast('Corregido y anotado con quién y por qué')}
  else{r.st='void';r.why='Anulado por Marta (jefe): fichó dos veces por error';toast('Anulado, pero el fichaje se conserva en el registro')}
  drawRG();
});
$$('[data-dl]').forEach(b=>b.addEventListener('click',()=>toast(`${b.dataset.dl}: con los fichajes anulados y las correcciones, con autor y motivo`)));
$('#gestGo').addEventListener('click',()=>{
  const p=String(Math.floor(100000+Math.random()*900000));
  $('#gest').innerHTML=`<span>PIN de tu gestoría</span><b>${p.slice(0,3)} ${p.slice(3)}</b><small>Por seguridad solo se muestra ahora. Solo ve el registro de los locales que elijas; no ve sueldos ni mensajes.</small>`;
});
drawRG();

/* ============ 06 COSTES ============ */
const fmt=n=>Math.round(n).toLocaleString('es-ES');
const S={emp:$('#sEmp'),hrs:$('#sHrs'),price:$('#sPrice'),real:$('#sReal')};
function calc(){
  const e=+S.emp.value,h=+S.hrs.value,p=+S.price.value,r=+S.real.value/100;
  $('#oEmp').textContent=e;$('#oHrs').textContent=h+' h';$('#oPrice').textContent=p.toFixed(1).replace('.',',')+' €';$('#oReal').textContent=Math.round(r*100)+' %';
  Object.values(S).forEach(i=>i.style.setProperty('--p',((i.value-i.min)/(i.max-i.min)*100)+'%'));
  const prev=e*h*p*1.32*4.33,real=prev*r,diff=real-prev;
  const max=prev*1.4;
  $('#bPrev').style.setProperty('--w',(prev/max*100)+'%');
  $('#bReal').style.setProperty('--w',Math.min(100,real/max*100)+'%');
  $('#vPrev').textContent=fmt(prev)+' €';$('#vReal').textContent=fmt(real)+' €';
  $('#rowReal').classList.toggle('over',diff>0.5);
  countTo($('#cTotal'),Math.round(real),400);
  const v=$('#verdict');v.classList.toggle('over',diff>0.5);
  v.innerHTML=diff>0.5?`<b>Te pasas ${fmt(diff)} € este mes.</b> Lo ves a mitad de mes, no cuando llega la nómina.`:diff<-0.5?`<b>Ahorras ${fmt(-diff)} € frente a lo previsto.</b> Buen mes.`:'<b>Justo lo previsto.</b>';
}
Object.values(S).forEach(i=>i.addEventListener('input',calc));calc();

/* ============ 07 VARIOS NEGOCIOS ============ */
const BZ=[
  {k:'Café Central',sub:'Cafetería · Getafe',c:'#A04CC4',st:[['3','en turno ahora'],['12','reservas hoy']],l:[['Lucía · Sala','09:02'],['Andrés · Cocina','09:11'],['Iván · Barra','10:00']],w:['turno','reserva','cliente']},
  {k:'Peluquería Nube',sub:'Peluquería · Madrid',c:'#FAC675',st:[['2','en turno ahora'],['9','citas hoy']],l:[['Carmen · Corte y color','10:00'],['Álex · Barbería','10:30'],['Mar · Peinados','12:00']],w:['jornada','cita','clienta']},
  {k:'Clínica Sol',sub:'Clínica · Leganés',c:'#F06CA6',st:[['4','en turno ahora'],['17','citas hoy']],l:[['Dra. Pérez · Consulta 1','09:00'],['Dr. Ramos · Consulta 2','09:30'],['Julia · Recepción','08:45']],w:['guardia','cita','paciente']},
];
$('#bizTabs').innerHTML=BZ.map((b,i)=>`<button class="tab" role="tab" aria-selected="${i===0}" data-i="${i}" style="--bc:${b.c}"><i></i>${b.k}</button>`).join('');
$('#types').innerHTML=['Bar, restaurante o cafetería','Peluquería, estética o belleza','Clínica o salud','Tienda o comercio','Gimnasio','Academia','Taller','Oficina','Hotel','Veterinaria','Limpieza o servicios a domicilio'].map(t=>`<li>${t}</li>`).join('');
function drawBz(i){
  const b=BZ[i];
  $('#bz').style.setProperty('--bc',b.c);
  $('#bzName').textContent=b.k;$('#bzSub').textContent=b.sub;
  $('#bzStat').innerHTML=b.st.map(s=>`<div><b>${s[0]}</b><span>${s[1]}</span></div>`.replace('en turno ahora',s[1])).join('');
  $('#bzList').innerHTML=b.l.map((r,k)=>`<div style="animation-delay:${k*.07}s"><i></i>${r[0]}<span>${r[1]}</span></div>`).join('');
  $('#bzWords').innerHTML=`En esta app: turno → <b>${b.w[0]}</b> · reserva → <b>${b.w[1]}</b> · cliente → <b>${b.w[2]}</b>`;
  $$('#bizTabs .tab').forEach((t,k)=>t.setAttribute('aria-selected',k===i));
}
$('#bizTabs').addEventListener('click',e=>{const b=e.target.closest('.tab');if(b)drawBz(+b.dataset.i)});
drawBz(0);
let bi=0,bAuto=setInterval(()=>{if(!document.hidden&&!RM&&!$('#bz').matches(':hover'))drawBz(bi=(bi+1)%3)},4200);
$('#bizTabs').addEventListener('click',()=>clearInterval(bAuto));

/* ============ PLANES: la lista entera ============ */
// true = incluido, false = no, texto = detalle. [nombre, gratis, premium, detalle]
const T=true,F=false;
const GRUPOS=[
 ['Equipo y fichajes',[
  ['Fichar con PIN y ver el día en directo en Hoy',T,T],
  ['Registro de jornada en Excel y PDF, con acceso para tu gestoría',T,T,'Correcciones y anulaciones quedan guardadas'],
  ['Horas por persona, estadísticas de cumplimiento y plantilla',T,T],
 ]],
 ['Cuadrante y ausencias',[
  ['Cuadrante, horarios fijos, cobertura, festivos y disponibilidad',T,T],
  ['Vacaciones, bajas, refuerzos y mensajes al equipo',T,T],
  ['Cambios de turno entre compañeros',F,T,'Mismo puesto y respetando el descanso'],
 ]],
 ['Tu negocio',[
  ['Locales','Hasta 3','Sin límite'],
  ['Plantillas por tipo de negocio, tus palabras, tu logo y módulos a la carta',T,T],
 ]],
 ['Mi web',[
  ['Crear tu web y verla en móvil y ordenador',T,T],
  ['Publicarla con enlace y QR, reservas dentro y visible en Google',F,T],
  ['Dominio propio',F,'Extra de pago'],
 ]],
 ['Reservas',[
  ['Reservas online de tus clientes, con agenda y avisos por email',F,'1.000 al mes'],
 ]],
 ['IA y costes',[
  ['Cuadrante en un minuto y «me falta alguien»',F,'50 usos al mes'],
  ['Preguntas, resumen del lunes, fichajes sin líos y escribir por ti',F,T],
  ['Coste de personal previsto y real, por persona y por local',F,T],
 ]],
 ['Redes sociales',[
  ['Publicar en Facebook e Instagram desde la app, con textos de la IA',F,'Extra de pago'],
 ]],
];
const cell=v=>v===T?`<span class="yes">${CHECK}</span>`:v===F?'<span class="no">—</span>':(/^Extra/.test(v)?`<span class="x1">${v}</span>`:v);
function drawCmp(){
  const only=$('#onlyDiff').checked;let n=0,tot=0,html='';
  GRUPOS.forEach(([g,rows])=>{
    const rs=rows.filter(r=>{tot++;return !only||r[1]!==r[2]});
    if(!rs.length)return;
    n+=rs.length;
    html+=`<div class="cmp__g"><span>${g}</span><b>${rs.length} ${rs.length===1?'función':'funciones'}</b></div>`;
    html+=rs.map(r=>`<div class="cmp__r ${r[1]===r[2]?'same':''}"><div><span>${r[0]}${r[3]?`<small>${r[3]}</small>`:''}</span></div><div>${cell(r[1])}</div><div>${cell(r[2])}</div></div>`).join('');
  });
  $('#cmp').innerHTML=html;
  $('#cmpCnt').textContent=only?`${n} de ${tot} funciones cambian con Premium`:`${tot} funciones en total`;
}
$('#onlyDiff').addEventListener('change',drawCmp);
drawCmp();

/* ============ FAQ ============ */
const FAQ=[
['¿Qué tiene que hacer mi equipo?','Es una app móvil: solo necesitan su PIN para fichar y consultar sus turnos. También pueden fichar desde una tablet en el local.'],
['¿Qué incluye el plan Gratis?','Casi todo lo del día a día: fichajes, registro de jornada, cuadrante, ausencias, vacaciones, mensajes, hasta 3 locales y la creación de tu web. Premium añade la IA, las reservas de clientes, los costes de personal, los cambios de turno, locales sin límite y publicar tu web.'],
['¿Cuánto cuesta Premium?','Puedes probarlo 14 días sin tarjeta. Escríbenos por WhatsApp y te pasamos el plan y el precio según tu negocio.'],
['¿Puedo tener mi propia página web?','Sí. Creas tu web gratis, con 8 estilos, tu carta o servicios, fotos, horario y mapa, y la ves en vista previa. Publicarla con tu enlace y tu QR, con reservas dentro y visible en Google, es de Premium. El dominio propio es un extra de pago.'],
['¿La IA publica el cuadrante sola?','No. La IA propone y tú decides: los turnos quedan como borrador, marcados como de la IA, hasta que los revisas y publicas. Nunca cambia nada por su cuenta.'],
['¿Sirve para mi tipo de negocio?','Sí: hay plantillas para bares y restaurantes, peluquerías, clínicas, veterinarias, gimnasios, academias, talleres, hoteles, tiendas, oficinas y limpieza. Y la app usa las palabras de tu negocio.'],
['¿Y si viene una inspección?','Llevar el registro de jornada es obligatorio desde 2019, y aquí lo tienes hecho: cada fichaje con sus correcciones, quién las hizo y por qué. Puedes bajarlo en Excel o PDF y dar a tu gestoría un acceso de solo lectura.'],
['¿Las redes sociales están incluidas?','No: es un extra que se contrata aparte y se suma al Premium. Publicas en Facebook e Instagram desde la app, con textos escritos por la IA, programación y modo automático.'],
];
$('#faqL').innerHTML=FAQ.map(f=>`<details class="rv"><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join('');
$$('#faqL details').forEach(el=>io.observe(el));
$$('#faqL details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)$$('#faqL details').forEach(o=>{if(o!==d)o.open=false})}));
})();
