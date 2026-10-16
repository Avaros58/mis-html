# Compendio del maratón de opciones ATAS

Edición 16/10/2026. Paquete estático preparado para GitHub Pages. **No publicado.**

Abre `index.html` para consultar diez pestañas con ocho etapas de aprendizaje, diagramas ampliables, exploradores de movimiento esperado y cobertura, ejercicios, casos y fuentes. Todo el contenido esencial funciona sin conexión. Los vídeos y las fuentes externas requieren conexión. No se descargan medios de YouTube ni se incrustan reproductores externos.

## Qué incluye

- `index.html`: compendio editorial y propuesta de investigación versión 0.1, En prueba.
- `assets/`: CSS y JavaScript locales, ocho esquemas SVG propios, portada PNG 1200×630 y plantilla CSV de registro con separador punto y coma.
- `lecturas/`: texto editorial completo de los siete maestros vigentes en HTML. Los recursos externos no redistribuibles y las rutas internas se sustituyen por referencias públicas, conservando sus explicaciones y atribuciones. No son réplicas de la maquetación DOCX/PDF.
- `PROCEDENCIA.json`: identificación de las fuentes, huellas de los maestros y procedencia de las figuras.
- `.nojekyll`: permite servir el paquete como archivos estáticos.
- `configurar_publicacion.py`: helper opcional para completar metadatos con la URL definitiva. No publica ni utiliza la red.

Los DOCX y PDF aprobados permanecen íntegros en la biblioteca del proyecto. No se empaquetan sus capturas ATAS/MarketLab porque no consta autorización de redistribución pública. Se incluyen siete lecturas completas del texto propio y enlaces al material original. No se afirma afiliación, respaldo oficial ni licencia de las marcas.

## Publicación cuando se autorice

1. Decide el repositorio y la carpeta de destino. Mantén juntos `index.html`, `assets`, `lecturas` y los demás archivos; conserva mayúsculas y minúsculas de nombres y enlaces. No subas la carpeta interna de revisión.
2. Determina la URL HTTPS definitiva del directorio. Hasta conocerla, `og:image` y `twitter:image` son relativos y no se incluyen `canonical` ni `og:url`: algunas redes necesitan URLs absolutas para la vista previa.
3. Ejecuta con Python `python configurar_publicacion.py --url URL_HTTPS_DEFINITIVA_TERMINADA_EN_BARRA`. Sustituye el argumento por la URL real; no lo copies literalmente. El helper configura los ocho HTML sin subirlos. Si no utilizas Python, cambia manualmente `og:image`, `twitter:image`, `canonical` y `og:url` en cada HTML.
4. Vuelve a comprimir el contenido tras esos cambios. Colócalo en la rama y carpeta que sirva GitHub Pages. En la configuración del repositorio, revisa el origen de Pages según su montaje existente; no cambies a ciegas una configuración que ya publique otros trabajos.
5. Tras el despliegue autorizado, comprueba la URL, las siete lecturas, los recursos y la portada. Compartir una captura o escribir solo el título no crea un enlace: incluye la URL completa del HTML en el post. Una caché de X u otra red puede tardar en actualizar la tarjeta.

Este paquete no crea repositorios, hace commits, sube archivos ni cambia ninguna configuración de GitHub.

## Lectura e impresión

El selector admite 100, 125, 150, 175 y 200 %. Guarda la preferencia en el navegador cuando el almacenamiento está disponible. A− y A+ cambian un paso. Pestañas por teclado: flechas, Inicio y Fin. Escape cierra una figura ampliada y devuelve el foco. Los enlaces profundos abren el capítulo correspondiente, también los del glosario.

Imprimir muestra todos los capítulos y las soluciones, no solo la pestaña seleccionada. Las lecturas completas se imprimen por separado desde sus páginas. La impresión del navegador puede variar con sus opciones de márgenes, encabezados y escala.

## Alcance de la estrategia

La versión 0.1 propone un núcleo de ruptura bajista y retesteo para investigación con MES. Parámetros, costes y deslizamiento son hipótesis propias declaradas. No se ejecutó backtest ni se aportan tasas de acierto. La escala 100–104 de los ejemplos es ficticia: no son precios MES históricos. Los resultados de +15 y −12,50 son aritmética condicionada a fills supuestos, no una expectativa estimada.

No se atribuyen los umbrales editoriales a los instructores. Las variantes de EM, OI, perfiles y osciladores requieren comparación separada. El estado En prueba no autoriza operaciones reales ni convierte la propuesta en protocolo aprobado.

El Volumen 0 se reelaboró desde los PDF disponibles, sin localizar la transcripción alemana. Su minutaje es referencia secundaria; en los otros volúmenes se usan localizadores de transcripciones. El cotejo audiovisual íntegro y el instante exacto de las capturas no se afirman verificados.

## Comprobaciones realizadas

Revisión en Edge mediante Playwright: diez pestañas en 1440 y 390 px, letra al 200 %, persistencia, navegación por teclado, visor, enlaces profundos, exploradores, ejercicios y tres casos. Apertura `file://` sin red, recursos locales y lectura sin JavaScript. Impresión con todos los capítulos y soluciones. Verificación estática de enlaces, IDs, referencias temporales y cálculos; revisión visual de la composición.

La evidencia y las capturas de control permanecen en el proyecto, fuera del paquete público. GitHub Pages y las tarjetas sociales solo podrán comprobarse en producción tras conocer la URL y autorizar la publicación.

Documentación oficial de referencia: [configurar el origen de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), consultada el 16/10/2026.
