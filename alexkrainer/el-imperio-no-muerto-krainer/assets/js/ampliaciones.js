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

    const id = contenedor.getAttribute('data-reproductor');
    if (!id) return;
    const esWeb = /^https?:$/.test(window.location.protocol);
    if (!esWeb) {
      const enlace = document.createElement('a');
      enlace.className = boton.className;
      enlace.href = 'https://www.youtube.com/watch?v=' + encodeURIComponent(id);
      enlace.target = '_blank';
      enlace.rel = 'noopener';
      enlace.setAttribute('aria-label', 'Ver el vídeo en YouTube (se abre en otra pestaña)');
      enlace.append(...boton.childNodes);
      enlace.querySelector('span').textContent = 'Ver vídeo en YouTube';
      boton.replaceWith(enlace);
      return;
    }

    let intentos = 0;
    function cargar() {
      // Dominio estándar primero; alternativa de privacidad en el reintento.
      const dominio = intentos++ % 2 === 0 ? 'www.youtube.com' : 'www.youtube-nocookie.com';
      const destino = new URL('https://' + dominio + '/embed/' + encodeURIComponent(id));
      destino.searchParams.set('autoplay', '1');
      destino.searchParams.set('playsinline', '1');
      destino.searchParams.set('origin', window.location.origin);

      const iframe = document.createElement('iframe');
      // Configurar la política ANTES de asignar la URL y adjuntar el iframe.
      // origin identifica el origen real; no sustituye la cabecera Referer.
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.title = contenedor.getAttribute('data-titulo') || 'Reproductor del vídeo';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.setAttribute('frameborder', '0');
      iframe.src = destino.href;

      contenedor.replaceChildren(iframe);
      iframe.focus();
    }
    const reintentar = document.createElement('button');
    reintentar.type = 'button';
    reintentar.className = 'boton boton--contorno';
    reintentar.textContent = 'Reintentar reproductor';
    reintentar.hidden = true;
    reintentar.style.display = 'none';
    reintentar.style.marginTop = '.75rem';
    const columna = document.createElement('div');
    columna.style.minWidth = '0';
    contenedor.before(columna);
    columna.append(contenedor, reintentar);
    reintentar.addEventListener('click', cargar);
    boton.addEventListener('click', () => {
      cargar();
      reintentar.hidden = false;
      reintentar.style.removeProperty('display');
    }, { once: true });
  });
})();
