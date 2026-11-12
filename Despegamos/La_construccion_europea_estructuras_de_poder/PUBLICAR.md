# Publicación en GitHub Pages

El paquete contiene el informe HTML, el PDF y la imagen para redes.

1. Subir `index.html`, `informe.pdf`, `imagen-redes.png` y `.nojekyll` al directorio que se vaya a publicar.
2. En Settings → Pages, seleccionar la rama y carpeta de publicación, o el flujo de Pages que ya utilice el repositorio.
3. Cuando se conozca la URL final, sustituir en `index.html` los valores relativos de `og:image` y `twitter:image` por la URL HTTPS absoluta de `imagen-redes.png`. Añadir `og:url` y la URL canónica de la página con esa dirección final.
4. Comprobar la vista previa de la página en la red social elegida después del despliegue.

El HTML incluye la ilustración de portada embebida y funciona sin conexión. Las referencias al vídeo necesitan conexión. El enlace de descarga del PDF necesita que `informe.pdf` esté junto al HTML. El selector conserva el tamaño de letra cuando el navegador permite almacenamiento local. La versión PDF contiene todo el desarrollo y los recursos de consulta.

La publicación queda pendiente de que se indique el repositorio de destino.

## Imagen de redes

Generada mediante la herramienta integrada image_gen. Prompt utilizado:

Use case: stylized-concept. Asset type: striking editorial cover and social sharing image for a Spanish report about Lorenzo Ramírez's interpretation of European integration. Wide landscape composition approximately 1.91:1. A monumental dark blue European institutional facade with a circle of twelve golden stars reflected on glass; behind its translucent architecture, abstract financial network lines and an enormous shadow of a chess king, evoking finance, sovereignty and geopolitical power. Sophisticated photomontage illustration, cinematic lighting, deep petroleum blue and antique gold, restrained, powerful, premium historical journal aesthetic. No people, no flags other than the abstract star circle, no currency banknotes, no text, no letters, no watermark. Keep the left upper quadrant dark with negative space for later editorial titling. Symbolic conceptual illustration, not a depiction of a real event.
