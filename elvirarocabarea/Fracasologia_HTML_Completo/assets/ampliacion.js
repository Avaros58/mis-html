
(() => {
  if (!('HTMLDialogElement' in window)) return;
  const dialog=document.createElement('dialog');dialog.className='image-dialog';dialog.setAttribute('aria-label','Ampliación de la lámina');
  dialog.innerHTML='<div class="image-dialog-bar"><button type="button" data-zoom>Ver a tamaño completo</button><a data-original target="_blank" rel="noopener">Abrir imagen</a><button type="button" data-close aria-label="Cerrar ampliación">Cerrar ×</button></div><div class="image-dialog-body"><img alt=""></div>';
  document.body.append(dialog);const img=dialog.querySelector('img'), body=dialog.querySelector('.image-dialog-body'), zoom=dialog.querySelector('[data-zoom]');let opener;
  dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
  zoom.addEventListener('click',()=>{const big=body.classList.toggle('zoomed');zoom.textContent=big?'Ajustar a la ventana':'Ver a tamaño completo';});
  dialog.addEventListener('close',()=>{if(opener)opener.focus();});
  document.querySelectorAll('[data-enlarge]').forEach(a=>a.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();opener=a;img.src=a.href;img.alt=a.querySelector('img').alt;dialog.querySelector('[data-original]').href=a.href;body.classList.remove('zoomed');zoom.textContent='Ver a tamaño completo';dialog.showModal();}));
})();
