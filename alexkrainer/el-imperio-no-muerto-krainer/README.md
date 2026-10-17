# El imperio que no murió

Informe analítico sobre la entrevista de *Neutrality Studies* a **Alex Krainer**:
«El imperio no muerto contraataca: cómo Reino Unido aún gobierna el mundo».

Edición del **17 de octubre de 2026**. Paquete estático, preparado para consulta local y para
publicación en GitHub Pages.

---

## Qué es

Una reconstrucción editorial de la entrevista, organizada en trece capítulos temáticos, con síntesis
ejecutiva, cronología, glosario y registro de fuentes. Respeta el argumento del entrevistado: no
introduce opiniones ajenas, no refuta sus tesis y señala expresamente cuándo una afirmación es suya y
no un hecho verificado.

- **Fuente:** entrevista en vídeo de 1 h 12 min 24 s, canal *Neutrality Studies Español*.
- **Base textual:** transcripción automática al español, conservada sin editar en `assets/data/`.
- **Imágenes:** portada, cartel del vídeo y tres esquemas, todos de elaboración propia.

## Estructura del proyecto

```text
el-imperio-no-muerto-krainer/
├── index.html                  Informe completo (versión principal)
├── informe-autonomo.html       Edición de un solo archivo, con CSS, JS e imágenes embebidos
├── assets/
│   ├── css/
│   │   ├── informe.css         Identidad «Informe Analítico» (plantilla)
│   │   └── ampliaciones.css    Añadidos de este informe (sellos, diagramas, reproductor)
│   ├── js/
│   │   ├── informe.js          Navegación, buscador, pestañas, progreso, impresión
│   │   └── ampliaciones.js     Carga del reproductor de YouTube bajo demanda
│   ├── img/                    Portada, cartel del vídeo, tres esquemas y favicon (SVG)
│   └── data/transcripcion.md   Transcripción original, sin editar
├── README.md
├── fuentes.md                  Registro de fuentes y método
├── INFORME-DE-REVISION.md      Comprobaciones, defectos corregidos y límites
└── _verificacion/              Capturas y PDF de la revisión
```

## Cómo abrirlo

- **En local:** doble clic en `index.html`. No hace falta servidor ni conexión.
- **Versión de un archivo:** `informe-autonomo.html`. Útil para enviar o archivar; conserva todas las
  funciones salvo el enlace de descarga de la transcripción, que apunta al archivo de `assets/data/`.

## Navegación y lectura

| Función | Dónde | Nota |
|---|---|---|
| Índice lateral | Columna izquierda | Fijo en escritorio; panel desplegable en móvil |
| Progreso de lectura | Borde superior | Barra terracota |
| Buscador interno | Barra superior | 47 coincidencias para «Krainer» en la versión actual |
| Tamaño de letra | Botón `Aa` | Tres pasos; se recuerda si el navegador lo permite |
| Pestañas | Capítulo 8 | Comparan la objeción sistémica y la respuesta del entrevistado |
| Desplegables | Tres | Transcripción, nombres dudosos e inventario distópico |
| Marcas temporales | 94 enlaces | Abren el vídeo en el instante correspondiente |
| Esquemas | Tres figuras | Cada una puede abrirse a tamaño completo |
| Reproductor | Módulo audiovisual | Se carga solo al pulsarlo; sin conexión muestra un cartel local |
| Imprimir o PDF | Botón | Genera 40 páginas con todos los capítulos y respuestas abiertas |

## Dependencias externas

- **Ninguna** para leer el informe: CSS, JavaScript e imágenes son locales.
- **YouTube**, solo si se pulsa el reproductor o un enlace con marca temporal. La página no contacta
  con YouTube al abrirse: el reproductor se carga bajo demanda.
- **Tipografías:** Montserrat y Aptos se declaran sin descargarse. Si no están instaladas, el sistema
  usa Segoe UI o su sans-serif por defecto.

## Publicación en GitHub Pages

1. Sube el contenido de esta carpeta a un repositorio.
2. Si el informe está en la raíz, `index.html` funciona directamente. Si está en una subcarpeta,
   selecciónala como origen en *Settings → Pages*.
3. Los enlaces son relativos: el paquete funciona en local, en Pages o en cualquier servidor estático.
4. `_verificacion/` no forma parte del sitio y puede excluirse.

## Comprobaciones

Las casillas del control de calidad de la norma se han verificado así:

- **Estáticas:** 60 identificadores únicos, 53 anclas internas correctas, 10 recursos locales
  existentes, todas las imágenes con texto alternativo. Cero errores.
- **Dinámicas:** pestañas, buscador, índice, tamaño de letra, impresión y reproductor probados en
  Chrome 141; cero errores de JavaScript.
- **Impresión:** PDF de 40 páginas, con desplegables abiertos y enlaces de fuente visibles.
- **Visual:** revisión a 1440 px, 390 px y ancho de caja A4.

El detalle está en `INFORME-DE-REVISION.md`.

## Licencia y alcance

Informe editorial independiente. Alex Krainer es el autor del contenido analizado; esta es una edición
del mismo. No se afirma afiliación ni respaldo del entrevistado, del canal o de las instituciones
mencionadas. Las marcas citadas pertenecen a sus titulares.
