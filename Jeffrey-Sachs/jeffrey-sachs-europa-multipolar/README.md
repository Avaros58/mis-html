# Jeffrey Sachs: ¿Europa como frente en un mundo multipolar?

Informe analítico de la entrevista de **Glenn Diesen** a **Jeffrey Sachs**, publicada en el canal
*Glenn Diesen Español*.

Edición del **17 de octubre de 2026**. Paquete estático, preparado para consulta local y para
publicación en GitHub Pages.

---

## Qué es

Una reconstrucción editorial de la entrevista, organizada en doce capítulos temáticos, con síntesis
ejecutiva, módulo audiovisual, conclusiones, cronología, glosario y registro de fuentes. Respeta el
argumento del entrevistado: no introduce opiniones ajenas, no refuta sus tesis y marca como
proyección lo que él presenta como proyección.

- **Fuente:** entrevista en vídeo, «Jeffrey Sachs: ¿Europa como frente en un mundo multipolar?»,
  canal *Glenn Diesen Español* (`youtube.com/@GDiesenES`), identificador `hFqWqG2e6Q8`.
- **Fecha del material:** 16 de octubre de 2026, según la propia grabación.
- **Duración:** ≈ 29 minutos, según la última marca de la transcripción. La duración exacta no se ha
  podido verificar.
- **Base textual:** transcripción automática al español, conservada sin editar en `assets/data/`.
- **Imágenes:** portada, cartel del reproductor e imagen de difusión, todas de elaboración propia.

## Estructura del proyecto

```text
jeffrey-sachs-europa-multipolar/
├── index.html                     Informe completo
├── assets/
│   ├── css/
│   │   ├── informe.css            Identidad «Informe Analítico» (copia de la plantilla, sin editar)
│   │   └── ampliaciones.css       Añadidos de este informe (reproductor, sellos, impresión)
│   ├── js/
│   │   ├── informe.js             Navegación, buscador, progreso, tamaño de lectura, impresión
│   │   └── ampliaciones.js        Carga del reproductor bajo demanda y salida para file://
│   ├── img/
│   │   ├── portada-multipolar.svg Ilustración de portada (abstracta)
│   │   ├── poster-video.svg       Cartel local del reproductor, 1280 × 720
│   │   ├── social-sachs.jpg       Imagen de difusión, 1200 × 630
│   │   └── favicon.svg            Icono del sitio
│   └── data/transcripcion.md      Transcripción original, sin editar
├── README.md
├── fuentes.md                     Registro de fuentes y método
├── INFORME-DE-REVISION.md         Comprobaciones, correcciones y límites
└── _verificacion/                 Capturas previstas, pruebas y scripts de comprobación
```

## Cómo abrirlo

- **En local:** doble clic en `index.html`. No hace falta servidor ni conexión.
- **Desde `file://`:** el navegador no puede validar el origen de una incrustación de YouTube. En ese
  caso, `ampliaciones.js` sustituye el botón del reproductor por un enlace directo «Ver el vídeo en
  YouTube». El enlace directo está siempre visible, también cuando el reproductor sí funciona.
- **Con servidor local o en la web:** al pulsar el cartel se inserta el iframe de YouTube con
  `origin`, `referrerpolicy` y `allow` declarados.

## Navegación y lectura

| Función | Dónde | Nota |
|---|---|---|
| Índice lateral | Columna izquierda | Fijo en escritorio; panel desplegable en móvil |
| Progreso de lectura | Borde superior | Barra terracota |
| Buscador interno | Barra superior | Resalta coincidencias y permite recorrerlas |
| Tamaño de lectura | Selector `Aa` | Cinco pasos: 100 %, 125 %, 150 %, 175 % y 200 %; se recuerda si el navegador lo permite |
| Marcas temporales | 70 enlaces | Abren el vídeo en el instante correspondiente |
| Reproductor | Módulo audiovisual | Carga bajo demanda; cartel local mientras no se solicita |
| Imprimir o PDF | Botón | Fuerza el 100 % de lectura y muestra las marcas en papel |

Las marcas proceden de la transcripción automática: son fiables al minuto, no al segundo.

## Imagen de difusión

`assets/img/social-sachs.jpg` se genera con Pillow a partir de
`_verificacion/generar-social.py` (1200 × 630, JPEG, 57,7 KB). Es una **ilustración abstracta**, no
una fotografía: no hay retratos ni material de terceros. Solo lleva el rótulo «Informe Analítico».

> **Al publicar:** en `index.html`, `og:image` y `twitter:image` usan la ruta **relativa**
> `assets/img/social-sachs.jpg`. Debe sustituirse por la **URL absoluta real** del archivo publicado
> (`https://usuario.github.io/repositorio/assets/img/social-sachs.jpg`). Con una ruta relativa, las
> redes sociales no encuentran la imagen y la tarjeta se queda sin vista previa.

## Dependencias externas

- **Ninguna** para leer el informe: CSS, JavaScript e imágenes son locales.
- **YouTube**, solo si se pulsa el cartel del reproductor o un enlace con marca temporal. La página no
  contacta con YouTube al abrirse.
- **Tipografías:** Montserrat y Aptos se declaran sin descargarse. Si no están instaladas, el sistema
  usa Segoe UI o su sans-serif por defecto.

## Publicación en GitHub Pages

1. Sube el contenido de esta carpeta a un repositorio.
2. Si el informe está en la raíz, `index.html` funciona directamente. Si está en una subcarpeta,
   selecciónala como origen en *Settings → Pages*.
3. Los enlaces son relativos: el paquete funciona en local, en Pages o en cualquier servidor estático.
4. Actualiza las URL absolutas de `og:image` y `twitter:image` (ver arriba).
5. `_verificacion/` no forma parte del sitio y puede excluirse.

## Comprobaciones

- **Estructurales:** `python herramientas/validar-informe.py index.html` → sin errores y sin avisos:
  58 identificadores únicos, 50 anclas internas correctas, 7 recursos locales existentes.
- **De contenido:** `_verificacion/comprobar-contenido.py` → cada capítulo entre 300 y 500 palabras y
  entre 2 y 4 marcas temporales; 70 marcas, todas presentes en la transcripción; las 14 cifras
  exigidas aparecen en contexto.
- **De lógica del reproductor:** `_verificacion/probar-reproductor.mjs` → las dos ramas (`file://` y
  `https://`) producen el resultado esperado.
- **En navegador:** **no realizada**. El entorno de producción bloquea los canales internos de Chrome
  y el navegador no llega a arrancar. El detalle está en `INFORME-DE-REVISION.md` y en
  `_verificacion/BLOQUEO-NAVEGADOR.md`.

## Licencia y alcance

Informe editorial independiente. Jeffrey Sachs y Glenn Diesen son los autores del contenido analizado;
esta es una edición del mismo. No se afirma afiliación ni respaldo de los participantes, del canal o
de las instituciones mencionadas. Las marcas citadas pertenecen a sus titulares.
