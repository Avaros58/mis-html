/* Funciona desde file:// y GitHub Pages, sin peticiones ni librerías externas. */
(() => {
 'use strict';
 const doc=document, root=doc.documentElement;
 const read=(k,f)=>{try{return localStorage.getItem(k)||f;}catch{return f;}};
 const save=(k,v)=>{try{localStorage.setItem(k,v);}catch{}};
 const scale=doc.querySelector('#tamano');
 if(scale){let initial=read('atas-compendio-tamano','100');if(!['100','125','150','175','200'].includes(initial))initial='100';scale.value=initial;
 const setSize=value=>{scale.value=String(value);root.style.setProperty('--escala',Number(value)/100);save('atas-compendio-tamano',String(value));};
 setSize(initial);scale.addEventListener('change',()=>setSize(scale.value));
 doc.querySelector('#menos')?.addEventListener('click',()=>setSize(Math.max(100,Number(scale.value)-25)));
 doc.querySelector('#mas')?.addEventListener('click',()=>setSize(Math.min(200,Number(scale.value)+25)));}
 const tabs=[...doc.querySelectorAll('[role=tab]')], panels=[...doc.querySelectorAll('.panel')];let keyboardTab=false;
 function activateHash(focus=false){const id=decodeURIComponent(location.hash.slice(1))||'inicio';const target=doc.getElementById(id);const panel=target?.closest('.panel')||panels.find(p=>p.id==='inicio');if(!panel)return;
 panels.forEach(p=>{p.hidden=p!==panel;});tabs.forEach(t=>{const active=t.getAttribute('aria-controls')===panel.id;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;});
 if(focus){const dest=target||panel;dest.scrollIntoView({block:'start',behavior:'instant'});if(target===panel){panel.querySelector('h1')?.focus({preventScroll:true});}else{target?.setAttribute('tabindex','-1');target?.focus({preventScroll:true});}}}
 if(tabs.length){root.classList.add('js');activateHash();tabs.forEach((t,i)=>{t.addEventListener('click',()=>{const id=t.getAttribute('aria-controls');if(location.hash==='#'+id){activateHash(true);}else location.hash=id;});
 t.addEventListener('keydown',e=>{let j;if(e.key==='ArrowRight')j=(i+1)%tabs.length;if(e.key==='ArrowLeft')j=(i-1+tabs.length)%tabs.length;if(e.key==='Home')j=0;if(e.key==='End')j=tabs.length-1;if(j!==undefined){e.preventDefault();tabs[j].focus();const hash='#'+tabs[j].getAttribute('aria-controls');history.pushState(null,'',hash);activateHash(false);tabs[j].focus();}});});
 addEventListener('hashchange',()=>{activateHash(!keyboardTab);keyboardTab=false;});doc.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(a&&a.hash===location.hash){activateHash(true);}});}
 const fmt=x=>new Intl.NumberFormat('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2}).format(x);
 function calcEM(){const ids=['em-precio','em-iv','em-tiempo','em-base'];const els=ids.map(id=>doc.getElementById(id));if(!els[0])return;const output=doc.getElementById('em-resultado');if(!els.every(el=>el.checkValidity())){output.textContent='Introduce valores positivos dentro de los límites indicados.';return;}const [s,iv,t,b]=els.map(e=>Number(e.value));const em=s*(iv/100)*Math.sqrt(t/b);output.innerHTML=`<div class="resultado-numeros"><span>Inferior<b>${fmt(s-em)}</b></span><span>Centro<b>${fmt(s)}</b></span><span>Superior<b>${fmt(s+em)}</b></span></div><p>Semiamplitud ±${fmt(em)} · anchura ${fmt(em*2)} · horizonte ${fmt(t)} ${b===252?'jornadas':'días de calendario'}. Sin probabilidad de operación asignada.</p>`;}
 doc.querySelector('#em-form')?.addEventListener('input',calcEM);doc.querySelector('#em-form')?.addEventListener('change',calcEM);doc.querySelector('#em-form')?.addEventListener('submit',e=>e.preventDefault());calcEM();
 function gamma(){const p=doc.querySelector('#gamma-precio'),s=doc.querySelector('#gamma-lado');if(!p)return;const price=Number(p.value),side=Number(s.value),delta=.5+.04*(price-100),book=side*10*100*delta,hedge=-book,initial=-side*500,change=hedge-initial;doc.querySelector('#gamma-precio-label').textContent=fmt(price);doc.querySelector('#gamma-resultado').innerHTML=`<p>Delta estimada ${fmt(delta)} · libro ${fmt(book)} acciones equivalentes.<br>Cobertura necesaria ${fmt(hedge)}; ajuste desde 100: <strong>${Math.abs(change)<.00001?'sin cambio':(change>0?'comprar ':'vender ')+fmt(Math.abs(change))+' acciones'}</strong>.</p>`;}
 doc.querySelector('#gamma-precio')?.addEventListener('input',gamma);doc.querySelector('#gamma-lado')?.addEventListener('change',gamma);gamma();
 const cases={favorable:'<strong>Se ejecuta y alcanza objetivo.</strong> El fill de venta modelizado 99,25 fija d=1,75 y objetivo 95,75. Tras negociación un tick más allá se admite el límite. Neto ficticio +15,00 USD.',perdida:'<strong>Se ejecuta y pierde conforme a las reglas.</strong> Salida modelizada 101,25, con un tick adverso de stop. Neto ficticio −12,50 USD. Un regreso posterior al interior no cambia el resultado.',ausencia:'<strong>Recupera el interior antes de confirmar.</strong> El cierre 100,25 cancela el candidato. No existe posición ni resultado de trading que calcular. La caída posterior no crea una ejecución retroactiva.'};
 doc.querySelectorAll('[data-caso]').forEach(b=>b.addEventListener('click',()=>{doc.querySelectorAll('[data-caso]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));doc.querySelector('#caso-resumen').innerHTML=cases[b.dataset.caso];}));if(doc.querySelector('#caso-resumen'))doc.querySelector('#caso-resumen').innerHTML=cases.favorable;
 const dialog=doc.querySelector('#visor'),img=doc.querySelector('#visor-img');let returnFocus;
 doc.querySelectorAll('[data-zoom]').forEach(a=>a.addEventListener('click',e=>{if(!dialog?.showModal)return;e.preventDefault();returnFocus=a;img.src=a.getAttribute('href');img.alt=a.querySelector('img').alt;dialog.showModal();}));doc.querySelector('#cerrar-visor')?.addEventListener('click',()=>dialog.close());dialog?.addEventListener('close',()=>returnFocus?.focus());dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
 let states=[];function beforePrint(){states=[...doc.querySelectorAll('details')].map(d=>[d,d.open]);states.forEach(([d])=>d.open=true);}function afterPrint(){states.forEach(([d,v])=>d.open=v);states=[];}
 addEventListener('beforeprint',beforePrint);addEventListener('afterprint',afterPrint);doc.querySelector('#imprimir')?.addEventListener('click',()=>window.print());
})();

document.querySelector('#ver-capitulos')?.addEventListener('click',()=>{window.scrollTo({top:0,behavior:'instant'});document.querySelector('[role=tab][aria-selected=true]')?.focus({preventScroll:true});});
