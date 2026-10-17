# Informe de revisión

**Proyecto:** Jeffrey Sachs: ¿Europa como frente en un mundo multipolar?
**Edición:** 17 de octubre de 2026 · Sistema editorial «Informe Analítico» v1.2
**Modalidad:** A · Informe de estudio (`data-modo="estudio"`, `data-tamano="100"`, `data-plantilla="no"`)

---

## 1. Relación de archivos

| Archivo | Bytes | Función |
|---|---:|---|
| `index.html` | 95.216 | Informe completo |
| `assets/css/informe.css` | 43.205 | Identidad y componentes (copia literal de la plantilla) |
| `assets/css/ampliaciones.css` | 4.630 | Reproductor, sellos, cuadro de alcance, impresión |
| `assets/js/informe.js` | 18.091 | Navegación, buscador, progreso, tamaño de lectura (copia literal) |
| `assets/js/ampliaciones.js` | 2.202 | Carga del reproductor bajo demanda y salida para `file://` |
| `assets/img/portada-multipolar.svg` | 2.811 | Ilustración de portada |
| `assets/img/poster-video.svg` | 2.514 | Cartel del reproductor, 1280 × 720 |
| `assets/img/social-sachs.jpg` | 59.098 | Imagen de difusión, 1200 × 630 |
| `assets/img/favicon.svg` | 381 | Icono |
| `assets/data/transcripcion.md` | 28.022 | Transcripción original, sin editar |
| `README.md` | 6.606 | Uso, publicación y dependencias |
| `fuentes.md` | 5.099 | Registro de fuentes y criterios de atribución |
| `_verificacion/BLOQUEO-NAVEGADOR.md` | 2.277 | Registro del bloqueo de Chrome en este entorno |
| `_verificacion/comprobar-contenido.py` | 3.583 | Comprobación de extensión, marcas y cifras |
| `_verificacion/probar-reproductor.mjs` | 7.058 | Prueba de las dos ramas del reproductor |
| `_verificacion/probe.mjs` | 14.583 | Arnés de navegador previsto (no ejecutable aquí) |
| `_verificacion/validacion.txt` | 1.975 | Salida literal de las tres comprobaciones |
| `_verificacion/generar-social.py` | 4.796 | Generación de la imagen social con Pillow |
| `_verificacion/social-600.png` | 77.506 | Reducción a 600 px para comprobar legibilidad |

**Extensión del informe:** 7.656 palabras de contenido; 4.559 en los doce capítulos (300–500 por
capítulo). 58 identificadores, 50 anclas internas, 70 marcas temporales.

## 2. Arquitectura editorial

- **Portada** con título, subtítulo, autoría, naturaleza, fecha del material (16 de octubre de 2026,
  con sello «según la entrevista»), duración aproximada y fecha de edición.
- **Síntesis ejecutiva** en cinco párrafos, con tesis destacada, tres tarjetas y nota de alcance.
- **Módulo «Fuente audiovisual»**: ficha verificada, cartel local, carga bajo demanda, enlace directo
  siempre visible, tabla de doce capítulos con marcas.
- **Doce capítulos** en el orden y con las marcas fijadas por el encargo. Cada uno tiene cuatro o
  cinco párrafos desarrollados, entradilla y entre dos y cuatro marcas temporales.
- **Cierre**: conclusiones (ocho posiciones atribuidas), cronología de siete entradas, glosario de
  doce términos, fuentes y ficha editorial.
- **Recursos**: un diagrama SVG conceptual de los tres vectores y una tabla de cifras con su estatuto
  (dato referido o proyección).

## 3. Comprobaciones realizadas

### 3.1. Validación estructural (realizada)

```text
python herramientas/validar-informe.py informes/jeffrey-sachs-europa-multipolar/index.html
  Identificadores únicos: 58
  Anclas internas correctas: 50
  Recursos locales comprobados: 7
  Resultado: sin errores, 0 aviso(s)
```

Cubre: identificadores duplicados, anclas internas sin destino, `aria-controls` / `aria-labelledby`
inexistentes, recursos locales ausentes, imágenes sin `alt`, `iframe` sin `title`, botones sin nombre
accesible, jerarquía de encabezados y restos de plantilla.

### 3.2. Contenido (realizada)

`_verificacion/comprobar-contenido.py`:

- cada capítulo, entre 300 y 500 palabras (mínimo 328 en el capítulo 2; máximo 452 en el 8);
- cada capítulo, entre 2 y 4 marcas temporales (70 en total, 43 distintas);
- **todas** las marcas del informe existen en la transcripción: 0 discrepancias;
- las 14 cifras exigidas por el encargo aparecen en contexto.

### 3.3. Lógica del reproductor (realizada)

`_verificacion/probar-reproductor.mjs` ejecuta `ampliaciones.js` contra un DOM mínimo:

```text
file:// → enlace directo: OK
https:// → iframe con origin: OK
Sin errores en la lógica del reproductor.
```

Se comprueba que en `file://` el botón se sustituye por un enlace a YouTube y que en `https://` el
iframe resultante lleva exactamente:

- `src=https://www.youtube.com/embed/hFqWqG2e6Q8?autoplay=1&playsinline=1&origin=https://example.org`
- `referrerpolicy="strict-origin-when-cross-origin"`
- `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"`
- `allowfullscreen` y `title`.

### 3.4. Imágenes (realizada)

- `social-sachs.jpg`: 1200 × 630, JPEG progresivo, 57,7 KB (< 300 KB). Inspeccionada a tamaño real y
  reducida a 600 px (`social-600.png`): el rótulo sigue legible.
- `poster-video.svg`: 1280 × 720, texto legible; el tercio inferior queda libre para el botón.
- Metadatos sociales presentes en el documento: `og:image`, `og:image:width`,
  `og:image:height`, `og:image:alt`, `twitter:card`, `twitter:image`, con ruta relativa.

### 3.5. Metadatos de la fuente (realizada)

Consulta al servicio oEmbed de YouTube el 17 de octubre de 2026: confirma título y canal. No confirma
fecha de publicación ni duración, que quedan declaradas como no verificadas.

## 4. Comprobaciones NO realizadas

**No se ha abierto el informe en un navegador.** Chrome no arranca en este entorno: el sandbox
bloquea sus canales internos (`platform_channel.cc: Acceso denegado`; fallo de crashpad). Se probaron
`--no-sandbox`, `--disable-breakpad`, `--disable-crash-reporter`, `--single-process` y `--no-zygote`.
El detalle está en `_verificacion/BLOQUEO-NAVEGADOR.md`.

Por tanto quedan **pendientes de verificación real**:

1. Ausencia de desbordamiento horizontal a 390 y 320 px con las cinco escalas de lectura.
2. Proporción 16:9 de la caja del reproductor en esas cinco escalas.
3. Funcionamiento en navegador del índice, la sección activa, el buscador, el selector de tamaño y el
   botón de imprimir.
4. Maquetación de impresión y número de páginas del PDF (no se ha generado PDF).
5. Capturas de escritorio y móvil (no hay ninguna en `_verificacion/`).
6. Comprobación de la tarjeta social en los depuradores de las plataformas: depende de la URL
   definitiva de publicación, que aún no existe.
7. Reproducción efectiva del vídeo en YouTube y sincronía exacta al segundo de las marcas.

La geometría 16:9 sí está garantizada por la hoja de estilo (`.reproductor { aspect-ratio: 16 / 9 }`
con hijos en posición absoluta), pero **no se ha medido en un motor de render**.

## 5. Correcciones aplicadas durante la revisión

| Hallazgo | Corrección |
|---|---|
| Capítulos con 5 y 6 marcas temporales (el máximo es 4) | Se retiraron las marcas duplicadas de la cabecera y las menos representativas; quedan 2–4 por capítulo |
| Capítulo 2 con 276 palabras (mínimo 300) | Se añadió un párrafo de cierre sobre la premisa de Diesen; queda en 328 |
| Capítulo 9 con seis párrafos de cuerpo | Se fusionaron los dos párrafos sobre la energía y la ambición verde; quedan cinco |
| `<time>` sin `datetime` válido en la cronología («Sin fecha», «2010-2015») | Se sustituyeron por `<span class="cronologia__fecha">` |
| En `noscript` quedaba una caja negra 16:9 vacía | Se oculta `.reproductor` completo; el enlace a YouTube sigue visible |
| Imagen social con el acento de «ANALÍTICO» corrupto por una edición intermedia | Se regeneró desde el script con el carácter correcto y se comprobó a 600 px |

## 6. Decisiones editoriales y límites conocidos

1. **Fidelidad.** El informe expone lo que dicen Sachs y Diesen; no refuta, no avala y no incorpora
   datos externos. Las atribuciones son explícitas («Sachs sostiene», «según Diesen»).
2. **Cifras.** Se reproduce el valor tal como se enuncia. La tabla del capítulo 7 distingue «dato
   referido» de «proyección»; el texto advierte en cada caso. Ninguna cifra se ha contrastado con
   otras fuentes.
3. **Duración.** «≈ 29 minutos» se deduce de la última marca (28:46). No es la duración exacta del
   vídeo y así se declara.
4. **Fecha del material.** 16 de octubre de 2026 es la que se dice en la entrevista; la fecha de
   publicación en YouTube no se ha podido verificar y consta como tal.
5. **Marcas temporales.** Proceden de la transcripción automática: fiables al minuto, no al segundo.
   No se han inventado tiempos.
6. **Nombre del gasoducto.** La transcripción escribe «North Stream»; el informe usa «Nord Stream» y
   lo advierte en el glosario.
7. **Imagen social.** Es una ilustración abstracta, no una fotografía ni un fotograma. No usa
   material del canal.
8. **Ruta de `og:image`.** Relativa, como pedía el encargo. Debe sustituirse por la absoluta al
   publicar; está anotado en el README.
9. **Sin versión autónoma.** No se ha generado `informe-autonomo.html`: el encargo no lo pedía y la
   herramienta `herramientas/html-autonomo.py` no se ha ejecutado.

## 7. Estado del control de calidad

| Bloque | Estado |
|---|---|
| Editorial (fuente, tesis, atribución, coherencia, cifras, marcas) | Comprobado por script y revisión de texto |
| Visual (identidad, tipografía, solapamientos, proporciones) | **No comprobado en navegador**; solo inspección de la hoja de estilo |
| Funcional (enlaces internos, teclado, responsive, impresión) | Enlaces y anclas comprobados por script; el resto, **pendiente** |
| Publicación (index, recursos, dependencias, README) | Comprobado |
