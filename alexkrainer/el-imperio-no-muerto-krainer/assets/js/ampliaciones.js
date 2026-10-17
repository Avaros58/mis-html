/* =========================================================================
   AMPLIACIONES DE COMPORTAMIENTO
   Un único añadido sobre informe.js: el reproductor de YouTube se carga solo
   cuando la persona lo pide. Así la página no contacta con YouTube al abrirse
   y el módulo audiovisual muestra un cartel propio cuando no hay conexión.
   ========================================================================= */
(() => {
  'use strict';

  const reproductores = document.querySelectorAll('[data-reproductor]');

  reproductores.forEach((contenedor) => {
    const boton = contenedor.querySelector('.reproductor__cargar');
    if (!boton) return;

    boton.addEventListener('click', () => {
      const id = contenedor.getAttribute('data-reproductor');
      if (!id) return;

      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1';
      iframe.title = contenedor.getAttribute('data-titulo') || 'Reproductor del vídeo';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allowFullscreen = true;
      iframe.setAttribute('frameborder', '0');

      contenedor.replaceChildren(iframe);
      iframe.focus();
    }, { once: true });
  });
})();
