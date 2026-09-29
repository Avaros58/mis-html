# Ceuta, Marruecos y la política española

Edición HTML del informe facilitado. Conserva el contenido de sus trece secciones, reorganizado en nueve pestañas. Incluye diez tarjetas de vídeo, diez hitos cronológicos desplegables y tres diagramas del razonamiento del entrevistado.

## Abrir en el ordenador

Descomprime el ZIP y abre `index.html` con el navegador. Mantén la carpeta `assets` junto al HTML. No necesitas instalar nada ni iniciar un servidor. Toda la lectura, las pestañas, los diagramas y la cronología funcionan sin conexión; YouTube necesita Internet. Sin JavaScript, los nueve bloques se muestran seguidos y los desplegables siguen funcionando.

## Publicar en GitHub Pages

1. Sube el contenido de esta carpeta (incluidos `index.html`, `.nojekyll` y `assets`) a la carpeta que utilices para GitHub Pages. No subas únicamente el ZIP.
2. Activa GitHub Pages en la configuración del repositorio, usando la rama y carpeta donde hayas subido los archivos.
3. Abre la dirección publicada y comprueba las descargas y los enlaces al vídeo.

Las rutas son relativas y funcionan también bajo una subcarpeta del repositorio. No hay fuentes remotas, bibliotecas, reproductores incrustados, analítica, cookies ni peticiones de red al cargar la página.

## Imagen al compartir en redes

La imagen original se conserva, sin modificación, en `assets/imagen-social.png`. Se utiliza en la portada, en la tarjeta del vídeo y en los metadatos sociales. La tarjeta del vídeo usa esta imagen temática, no una miniatura oficial de YouTube.

Para que las plataformas sociales encuentren la imagen de manera fiable, cuando conozcas la URL pública final edita en `index.html` los dos metadatos `og:image` y `twitter:image`: sustituye `assets/imagen-social.png` por su URL absoluta. Por ejemplo, si la página vive en `https://usuario.github.io/repositorio/`, utiliza `https://usuario.github.io/repositorio/assets/imagen-social.png`. Añade también dentro de `<head>`:

```html
<meta property="og:url" content="https://usuario.github.io/repositorio/">
<link rel="canonical" href="https://usuario.github.io/repositorio/">
```

Usa tu dirección real en lugar del ejemplo. La vista previa social depende de los rastreadores de cada plataforma y solo puede comprobarse tras publicar. La web funciona sin este ajuste.

## Contenido y atribución

Fuente textual: `Informe_Analitico_Ceuta_Fernando_Paz.docx`, fechado el 29-09-2026. Se conserva el PDF original adjunto. La transcripción íntegra no se facilitó por separado para esta edición; se utilizan el análisis y los tiempos que recoge el informe. No se ha contrastado el audio segundo a segundo.

Las trece secciones se distribuyen así:

- Claves de lectura: §§ 1, 2 y 3.
- Marco histórico: § 4.
- Ceuta y Gobierno: §§ 5 y 6.
- Pegasus y Sáhara: § 7.
- Intereses económicos: § 8.
- Marruecos y sucesión: § 9.
- Escenarios y conclusiones: §§ 10 y 12.
- Cronología: § 11.
- Fuentes y documentos: § 13.

Las introducciones y los diagramas son apoyos de navegación derivados del informe. Se mantienen las atribuciones, las reservas sobre las acusaciones y la condición de pronóstico. Las referencias citadas por el entrevistado no se presentan como fuentes verificadas de esta edición. La datación de 2026 reproduce el documento de partida.

La sección original de fuentes menciona una anotación en Glasp sin aportar su destino. Se conserva ese texto, sin inventar un enlace. Las tarjetas y todas las marcas temporales del cuerpo llevan a YouTube con el parámetro de inicio `t`, calculado a partir del informe; no detienen el vídeo al final del intervalo indicado.

## Navegación accesible

Puedes usar Tab para recorrer los controles y las flechas, Inicio o Fin para cambiar de pestaña. Enter activa enlaces y desplegables. El botón «Desplegar bloque» permite abrir todos los apartados de la pestaña. «Imprimir todo» prepara los nueve bloques con el contenido desplegado y después restaura la vista anterior. Las direcciones con fragmento, como `index.html#pegasus`, abren directamente un bloque.

## Archivos

- `index.html`: contenido completo.
- `assets/styles.css` y `assets/app.js`: diseño e interacción locales.
- `assets/favicon.svg`: icono del sitio.
- `assets/imagen-social.png`: imagen original.
- `assets/informe-completo.pdf` y `assets/informe-completo.docx`: documentos originales.

No se ha publicado la página ni modificado ningún archivo de origen.
