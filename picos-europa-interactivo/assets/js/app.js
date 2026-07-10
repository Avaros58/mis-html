const POIS = [
  {name:'Torre de la Palanca', type:'Cumbre', alt:'2614 m', macizo:'Occidental', x:5.5, y:34},
  {name:'Peña Santa', type:'Cumbre', alt:'2596 m', macizo:'Occidental', x:13, y:37},
  {name:'Torre Cerredo', type:'Cumbre', alt:'2650 m', macizo:'Central', x:42, y:33},
  {name:'Naranjo de Bulnes / Picu Urriellu', type:'Cumbre', alt:'2519 m', macizo:'Central', x:50, y:38},
  {name:'Bulnes', type:'Pueblo', alt:'659 m', macizo:'Central', x:46, y:66},
  {name:'Sotres', type:'Pueblo', alt:'880 m', macizo:'Central', x:52, y:74},
  {name:'Refugio de Cabaña Verónica', type:'Refugio', alt:'1630 m', macizo:'Central', x:55, y:66},
  {name:'Refugio Jou de los Cabrones', type:'Refugio', alt:'2085 m', macizo:'Central', x:61, y:62},
  {name:'Torre de Salinas', type:'Cumbre', alt:'2450 m', macizo:'Central', x:60, y:35},
  {name:'Peña Vieja', type:'Cumbre', alt:'2613 m', macizo:'Central', x:38, y:34},
  {name:'Pico Tesorero', type:'Cumbre', alt:'2570 m', macizo:'Central', x:70, y:38},
  {name:'Pico Jano', type:'Cumbre', alt:'1991 m', macizo:'Oriental', x:95, y:43},
  {name:'Puerto de Panderruedas', type:'Puerto', alt:'1566 m', macizo:'Occidental', x:14, y:61},
  {name:'Puerto del Pontón', type:'Puerto', alt:'1280 m', macizo:'Oriental', x:88, y:67},
  {name:'Caín', type:'Pueblo', alt:'460 m', macizo:'Central', x:80, y:73},
  {name:'Río Cares', type:'Río', alt:'', macizo:'Central', x:43, y:69},
  {name:'Río Deva', type:'Río', alt:'', macizo:'Oriental', x:90, y:71}
];
const stage = document.getElementById('stage');
const img = document.getElementById('mapImage');
const viewer = document.getElementById('viewer');
const hotspotsLayer = document.getElementById('hotspots');
const tooltip = document.getElementById('tooltip');
let scale = 0.75, tx = 0, ty = 0, dragging = false, sx = 0, sy = 0, stx = 0, sty = 0;
function apply(){ stage.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`; }
function fit(){ const vw=viewer.clientWidth, vh=viewer.clientHeight, iw=img.naturalWidth || 2172, ih=img.naturalHeight || 724; scale=Math.min(vw/iw, vh/ih)*0.98; tx=(vw-iw*scale)/2; ty=(vh-ih*scale)/2; apply(); }
function zoomAt(factor, cx=viewer.clientWidth/2, cy=viewer.clientHeight/2){ const beforeX=(cx-tx)/scale, beforeY=(cy-ty)/scale; scale=Math.max(0.25,Math.min(8,scale*factor)); tx=cx-beforeX*scale; ty=cy-beforeY*scale; apply(); }
img.addEventListener('load',()=>{ renderHotspots(); fit(); renderResults(POIS); });
window.addEventListener('resize', fit);
viewer.addEventListener('pointerdown',e=>{dragging=true; viewer.setPointerCapture(e.pointerId); sx=e.clientX; sy=e.clientY; stx=tx; sty=ty;});
viewer.addEventListener('pointermove',e=>{ if(!dragging)return; tx=stx+e.clientX-sx; ty=sty+e.clientY-sy; apply(); });
viewer.addEventListener('pointerup',()=>dragging=false);
viewer.addEventListener('wheel',e=>{ e.preventDefault(); zoomAt(e.deltaY<0?1.16:0.86,e.offsetX,e.offsetY); },{passive:false});
document.getElementById('zoomIn').onclick=()=>zoomAt(1.25);
document.getElementById('zoomOut').onclick=()=>zoomAt(0.8);
document.getElementById('resetView').onclick=fit;
document.getElementById('toggleLabels').onclick=()=>viewer.classList.toggle('labels-on');
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{document.querySelectorAll('nav button,.panel').forEach(x=>x.classList.remove('active')); b.classList.add('active'); document.getElementById(b.dataset.tab).classList.add('active');});
function renderHotspots(){ hotspotsLayer.innerHTML=''; POIS.forEach((p,i)=>{ const d=document.createElement('button'); d.className='hotspot'; d.style.left=p.x+'%'; d.style.top=p.y+'%'; d.dataset.name=p.name; d.title=p.name; d.onclick=(e)=>{e.stopPropagation(); showTip(p,e.clientX,e.clientY);}; hotspotsLayer.appendChild(d); }); }
function showTip(p,x,y){ tooltip.hidden=false; tooltip.style.left=Math.min(x+12,window.innerWidth-320)+'px'; tooltip.style.top=Math.min(y+12,window.innerHeight-160)+'px'; tooltip.innerHTML=`<h3>${p.name}</h3><p><b>${p.type}</b>${p.alt?` · ${p.alt}`:''}</p><p>${p.macizo}</p>`; }
viewer.addEventListener('click',()=>tooltip.hidden=true);
const results = document.getElementById('results');
function renderResults(items){ results.innerHTML=items.map((p,i)=>`<article class="card"><h3>${p.name}</h3><p>${p.type}${p.alt?` · ${p.alt}`:''}</p><p>${p.macizo}</p><button data-go="${POIS.indexOf(p)}">Ver en el panorama</button></article>`).join('') || '<p>No hay resultados.</p>'; document.querySelectorAll('[data-go]').forEach(btn=>btn.onclick=()=>focusPOI(POIS[+btn.dataset.go])); }
function focusPOI(p){ document.querySelector('[data-tab="panorama"]').click(); const iw=img.naturalWidth, ih=img.naturalHeight; scale=Math.max(scale,2.4); tx=viewer.clientWidth/2-(iw*p.x/100)*scale; ty=viewer.clientHeight/2-(ih*p.y/100)*scale; viewer.classList.add('labels-on'); apply(); }
document.getElementById('searchInput').addEventListener('input',e=>{ const q=e.target.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); renderResults(POIS.filter(p => `${p.name} ${p.type} ${p.macizo}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(q))); });
document.getElementById('clearSearch').onclick=()=>{document.getElementById('searchInput').value=''; renderResults(POIS);};
