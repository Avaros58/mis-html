
const viewer = document.getElementById('viewer');
const stage = document.getElementById('stage');
const labelsEl = document.getElementById('labels');
const panel = document.getElementById('infoPanel');
const search = document.getElementById('searchInput');
const results = document.getElementById('searchResults');
const dimLayer = document.getElementById('dimLayer');

let places = [], scale = 1, x = 0, y = 0;
let dragging = false, startX = 0, startY = 0;
const minScale = .45, maxScale = 5;

function applyTransform(){ stage.style.transform = `translate(${x}px,${y}px) scale(${scale})`; }
function fit(){
  const w = viewer.clientWidth, h = viewer.clientHeight;
  scale = Math.max(w/2172, h/724);
  scale = Math.max(minScale, Math.min(scale, 1.2));
  x = (w - 2172*scale)/2;
  y = (h - 724*scale)/2;
  applyTransform();
}
function zoomAt(factor, cx=viewer.clientWidth/2, cy=viewer.clientHeight/2){
  const newScale = Math.max(minScale, Math.min(maxScale, scale*factor));
  const worldX = (cx-x)/scale, worldY=(cy-y)/scale;
  x = cx-worldX*newScale; y=cy-worldY*newScale; scale=newScale; applyTransform();
}
function makeLabel(p){
  const b=document.createElement('button');
  b.className=`label ${p.type}`; b.dataset.id=p.id; b.dataset.type=p.type;
  b.style.left=`${p.x}%`; b.style.top=`${p.y}%`;
  b.innerHTML=`<span class="name">${p.name}</span><span class="pin"></span>`;
  b.addEventListener('click',()=>selectPlace(p,true));
  labelsEl.appendChild(b);
}
function selectPlace(p, center=false){
  document.querySelectorAll('.label').forEach(el=>el.classList.toggle('active',el.dataset.id===p.id));
  panel.innerHTML=`<span class="badge">${p.type.toUpperCase()} · ${p.massif}</span>
    <h2>${p.name}</h2>
    <div class="meta"><div><small>Altitud</small><strong>${p.altitude}</strong></div><div><small>Macizo</small><strong>${p.massif}</strong></div></div>
    <p>${p.description}</p>
    <p><small>Esta ficha está preparada para incorporar coordenadas, rutas, imágenes, fuentes y enlaces cartográficos.</small></p>`;
  if(center){
    const targetScale=Math.max(scale,2.1);
    const px=2172*p.x/100, py=724*p.y/100;
    scale=Math.min(maxScale,targetScale);
    x=viewer.clientWidth/2-px*scale;
    y=viewer.clientHeight/2-py*scale;
    applyTransform();
  }
}
function updateSearch(q){
  q=q.trim().toLowerCase();
  if(!q){results.hidden=true;results.innerHTML='';return;}
  const found=places.filter(p=>p.name.toLowerCase().includes(q)).slice(0,8);
  results.innerHTML=found.map(p=>`<button data-id="${p.id}"><strong>${p.name}</strong><br><small>${p.type} · ${p.massif}</small></button>`).join('');
  results.hidden=!found.length;
  results.querySelectorAll('button').forEach(btn=>btn.onclick=()=>{const p=places.find(p=>p.id===btn.dataset.id);selectPlace(p,true);search.value=p.name;results.hidden=true;});
}
fetch('data/places.json').then(r=>r.json()).then(data=>{places=data;places.forEach(makeLabel);fit();});

viewer.addEventListener('pointerdown',e=>{dragging=true;viewer.classList.add('dragging');viewer.setPointerCapture(e.pointerId);startX=e.clientX-x;startY=e.clientY-y;});
viewer.addEventListener('pointermove',e=>{if(!dragging)return;x=e.clientX-startX;y=e.clientY-startY;applyTransform();});
viewer.addEventListener('pointerup',()=>{dragging=false;viewer.classList.remove('dragging');});
viewer.addEventListener('pointercancel',()=>{dragging=false;viewer.classList.remove('dragging');});
viewer.addEventListener('wheel',e=>{e.preventDefault();const r=viewer.getBoundingClientRect();zoomAt(e.deltaY<0?1.15:.87,e.clientX-r.left,e.clientY-r.top);},{passive:false});
document.getElementById('zoomIn').onclick=()=>zoomAt(1.25);
document.getElementById('zoomOut').onclick=()=>zoomAt(.8);
document.getElementById('resetView').onclick=fit;
document.getElementById('dimToggle').onchange=e=>dimLayer.classList.toggle('off',!e.target.checked);
document.querySelectorAll('[data-type]').forEach(cb=>cb.addEventListener('change',()=>{
  const active=new Set([...document.querySelectorAll('[data-type]:checked')].map(x=>x.dataset.type));
  document.querySelectorAll('.label').forEach(el=>el.classList.toggle('hidden',!active.has(el.dataset.type)));
}));
search.addEventListener('input',e=>updateSearch(e.target.value));
document.addEventListener('click',e=>{if(!e.target.closest('.search'))results.hidden=true;});
document.getElementById('fullscreenBtn').onclick=()=>{if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.();};
window.addEventListener('resize',fit);
