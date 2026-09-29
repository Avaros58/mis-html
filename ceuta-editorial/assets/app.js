(() => {
  'use strict';
  const tabs = [...document.querySelectorAll('.tab')];
  const panels = [...document.querySelectorAll('.panel')];
  const tablist = document.querySelector('.tab-list');
  const expand = document.querySelector('#expand-all');
  const printButton = document.querySelector('#print');
  const status = document.querySelector('#reading-status');
  let active = 'lectura';
  tablist.setAttribute('role','tablist');
  tablist.setAttribute('aria-label','Bloques del informe');
  tabs.forEach(t => {t.setAttribute('role','tab');t.setAttribute('aria-controls',t.hash.slice(1));});
  panels.forEach(p => {p.setAttribute('role','tabpanel');p.setAttribute('aria-labelledby','tab-'+p.id);p.tabIndex=0;});
  function updateExpand() {
    const details=[...document.getElementById(active).querySelectorAll('details')];
    expand.textContent=details.every(d=>d.open)?'Plegar bloque':'Desplegar bloque';
  }
  function select(id,scroll=false) {
    if(!panels.some(p=>p.id===id))id='lectura';
    active=id;
    panels.forEach(p=>p.hidden=p.id!==id);
    tabs.forEach(t=>{const selected=t.hash==='#'+id;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;});
    const tab=tabs.find(t=>t.hash==='#'+id);
    status.textContent='BLOQUE '+tab.querySelector('span').textContent+' / 09';
    updateExpand();
    if(scroll)document.getElementById('contenido').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  }
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href^="#"]');
    if(!a||!panels.some(p=>'#'+p.id===a.getAttribute('href')))return;
    e.preventDefault();
    const id=a.getAttribute('href').slice(1);
    if(location.hash!=='#'+id)history.pushState(null,'','#'+id);
    select(id,true);
    tabs.find(t=>t.hash==='#'+id).focus({preventScroll:true});
  });
  tablist.addEventListener('keydown',e=>{
    const index=tabs.indexOf(document.activeElement);if(index<0)return;
    let next;
    if(['ArrowRight','ArrowDown'].includes(e.key))next=(index+1)%tabs.length;
    else if(['ArrowLeft','ArrowUp'].includes(e.key))next=(index-1+tabs.length)%tabs.length;
    else if(e.key==='Home')next=0;
    else if(e.key==='End')next=tabs.length-1;
    else return;
    e.preventDefault();tabs[next].click();
  });
  window.addEventListener('hashchange',()=>select(location.hash.slice(1),true));
  window.addEventListener('popstate',()=>select(location.hash.slice(1),true));
  expand.hidden=false;printButton.hidden=false;
  expand.addEventListener('click',()=>{
    const ds=[...document.getElementById(active).querySelectorAll('details')];
    const open=!ds.every(d=>d.open);ds.forEach(d=>d.open=open);updateExpand();
  });
  document.querySelectorAll('details').forEach(d=>d.addEventListener('toggle',updateExpand));
  let printState=null;
  window.addEventListener('beforeprint',()=>{if(printState)return;printState=[...document.querySelectorAll('details')].map(d=>[d,d.open]);printState.forEach(([d])=>d.open=true);});
  window.addEventListener('afterprint',()=>{if(printState)printState.forEach(([d,open])=>d.open=open);printState=null;updateExpand();});
  printButton.addEventListener('click',()=>window.print());
  select(location.hash.slice(1));
})();
