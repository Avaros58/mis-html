/* =========================================================================
   AMPLIACIONES DE COMPORTAMIENTO
   Un único añadido sobre informe.js: el reproductor de YouTube se carga solo
   cuando la persona lo pide. Así la página no contacta con YouTube al abrirse
   y el módulo audiovisual muestra un cartel propio cuando no hay conexión.
   ========================================================================= */
(() => {
  'use strict';

  const URL_VIDEO = 'https://www.youtube.com/watch?v=';

  const reproductores = document.querySelectorAll('[data-reproductor]');

  reproductores.forEach((contenedor) => {
    const boton = contenedor.querySelector('.reproductor__cargar');
    if (!boton) return;

    const id = contenedor.getAttribute('data-reproductor');
    const titulo = contenedor.getAttribute('data-titulo') || 'Reproductor del vídeo';

    // Desde file:// no hay origen que YouTube pueda validar y la incrustación
    // suele devolver un error de configuración. Se sustituye el botón por un
    // enlace directo, que siempre funciona.
    if (window.location.protocol === 'file:') {
      const enlace = document.createElement('a');
      enlace.className = 'boton boton--contorno';
      enlace.href = id ? URL_VIDEO + encodeURIComponent(id) : URL_VIDEO;
      enlace.target = '_blank';
      enlace.rel = 'noopener';
      enlace.textContent = 'Ver el vídeo en YouTube';
      boton.replaceWith(enlace);
      return;
    }

    boton.addEventListener('click', () => {
      if (!id) return;

      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/' + encodeURIComponent(id) +
        '?autoplay=1&playsinline=1&origin=' + window.location.origin;
      iframe.title = titulo;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; ' +
        'gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('loading', 'lazy');

      contenedor.replaceChildren(iframe);
      iframe.focus();
    }, { once: true });
  });
})();
