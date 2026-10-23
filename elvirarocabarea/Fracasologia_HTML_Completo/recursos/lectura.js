/* Lectura local: preferencias y búsqueda sin servicios externos. */
document.documentElement.classList.add('js');
(() => {
  const read=key=>{try{return JSON.parse(localStorage.getItem(key));}catch{return null;}};
  const save=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{}};
  const namespace='fracasologia.completa.';
  const resume=document.querySelector('[data-resume]'),last=read(namespace+'lectura');
  if(resume && last && /^(?:[0-4]\d|5[0-6])$/.test(last.number)){
    const a=document.createElement('a');
    a.href='entrega-'+last.number+'.html'+(/^p\d+$/.test(last.paragraph)?'#'+last.paragraph:'');
    a.textContent='Retomar la entrega '+last.number+' · '+last.title;
    resume.append(a);
  }
  const body=document.querySelector('.reading-body');
  if(body){
    let stored=read(namespace+'tamano');
    let size=Number.isFinite(stored)?Math.min(1.5,Math.max(1.06,stored)):1.18;
    const setSize=()=>{
      document.documentElement.style.setProperty('--reading-size',size+'rem');
      document.querySelector('[data-size="minus"]').disabled=size<=1.06;
      document.querySelector('[data-size="plus"]').disabled=size>=1.5;
    };
    setSize();
    document.querySelectorAll('[data-size]').forEach(button=>button.addEventListener('click',()=>{
      size=button.dataset.size==='reset'?1.18:Math.round((size+(button.dataset.size==='plus'?0.08:-0.08))*100)/100;
      size=Math.min(1.5,Math.max(1.06,size));setSize();save(namespace+'tamano',size);
      document.querySelector('[data-size-status]').textContent='Tamaño de lectura '+Math.round(size/1.18*100)+' por ciento';
    }));
    document.querySelector('[data-print]').addEventListener('click',()=>window.print());
    const menu=document.querySelector('.reader-menu details');
    const compact=matchMedia('(max-width:1000px)');
    if(menu){if(compact.matches)menu.open=false;compact.addEventListener('change',event=>{menu.open=!event.matches;});}
    let scheduled=false;
    const remember=()=>{
      scheduled=false;
      if(body.dataset.number){
        const paragraphs=[...body.querySelectorAll('p[id]')];
        const nearest=paragraphs.find(p=>p.getBoundingClientRect().bottom>120)||paragraphs.at(-1);
        save(namespace+'lectura',{number:body.dataset.number,title:body.dataset.title,paragraph:nearest?.id||'p1'});
      }
      const full=body.offsetHeight-innerHeight;
      const progress=full>0?Math.max(0,Math.min(1,-body.getBoundingClientRect().top/full)):0;
      document.querySelector('.progress').style.width=(progress*100)+'%';
    };
    addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(remember);}},{passive:true});
    addEventListener('pagehide',remember);remember();
  }
  const form=document.querySelector('[data-search]');
  if(form){
    const input=form.querySelector('[type=search]'),volume=form.querySelector('[name=volumen]'),kind=form.querySelector('[name=tipo]');
    const results=document.querySelector('[data-results]'),status=document.querySelector('[data-search-status]');
    const fold=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es');
    const data=window.FRACASOLOGIA_INDEX||[];
    const search=()=>{
      const q=input.value.trim(),needle=fold(q);results.replaceChildren();
      if(q.length<2){status.textContent='Escribe al menos dos caracteres. La búsqueda no distingue tildes ni mayúsculas y encuentra palabras o frases exactas.';return;}
      const matches=data.filter(e=>(!volume.value||String(e.volume)===volume.value)&&(!kind.value||e.kind===kind.value)&&(fold(e.title).includes(needle)||fold(e.text).includes(needle)));
      status.textContent=matches.length?matches.length+' resultado'+(matches.length===1?'':'s')+' en el estudio completo.':'No se han encontrado coincidencias con estos filtros.';
      matches.forEach(e=>{
        const found=e.paragraphs.find(p=>fold(p.text).includes(needle));
        const article=document.createElement('article');article.className='result';
        const label=document.createElement('span');label.className='badge';label.textContent=e.kind==='entrega'?'Entrega '+e.number:'Síntesis y fuentes';
        const h=document.createElement('h2'),a=document.createElement('a');
        a.href=e.url+(found?'#'+found.id:'');a.textContent=(e.kind==='entrega'?e.number+' · ':'')+e.title;h.append(a);
        const meta=document.createElement('p');meta.className='quiet';meta.textContent='Volumen '+e.volume+' · '+e.chapter;
        const p=document.createElement('p');
        if(found){
          const text=found.text,index=fold(text).indexOf(needle),start=Math.max(0,index-85),end=Math.min(text.length,index+needle.length+140);
          if(start)p.append('…');p.append(text.slice(start,index));
          const mark=document.createElement('mark');mark.textContent=text.slice(index,index+needle.length);p.append(mark,text.slice(index+needle.length,end));if(end<text.length)p.append('…');
        }else p.textContent=e.text.slice(0,210)+'…';
        article.append(label,h,meta,p);results.append(article);
      });
    };
    form.addEventListener('submit',event=>{event.preventDefault();search();});
    input.addEventListener('input',search);volume.addEventListener('change',search);kind.addEventListener('change',search);
    form.querySelector('[data-clear]').addEventListener('click',()=>{input.value='';volume.value='';kind.value='';search();input.focus();});
    search();
  }
})();
