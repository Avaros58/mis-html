# Informe de revisión

**Proyecto:** El imperio que no murió · informe sobre la entrevista a Alex Krainer
**Norma aplicada:** «Informe Analítico HTML» v1.1, modalidad A (informe de estudio)
**Fecha de edición:** 17 de octubre de 2026

---

## 1. Qué se entrega

Un informe completo en HTML que reconstruye la entrevista de *Neutrality Studies* a Alex Krainer,
organizado en trece capítulos temáticos, con navegación interactiva, marcas temporales verificadas
contra la transcripción, tres esquemas explicativos, cronología y glosario.

| Archivo | Función | Tamaño |
|---|---|---|
| `index.html` | Informe principal | 123 KB · 2.060 líneas |
| `informe-autonomo.html` | Edición de un solo archivo | 294 KB |
| `assets/css/informe.css` | Identidad editorial (base) | 37 KB |
| `assets/css/ampliaciones.css` | Añadidos de este informe | 4 KB |
| `assets/js/informe.js` | Navegación, buscador, pestañas, impresión | 17 KB |
| `assets/js/ampliaciones.js` | Reproductor bajo demanda | 2 KB |
| `assets/img/*.svg` | Portada, cartel y tres esquemas propios | 12 KB |
| `assets/data/transcripcion.md` | Transcripción original sin editar | 68 KB |
| `README.md`, `fuentes.md` | Uso y registro de fuentes | — |
| `_verificacion/` | Capturas y PDF de la revisión | 1,5 MB |

---

## 2. Cómo se ha construido

1. **Lectura íntegra de la transcripción** (70.030 caracteres, 126 marcas temporales) y verificación de
   los metadatos del vídeo con el servicio público oEmbed de YouTube: título y canal confirmados
   (*Neutrality Studies Español*). La duración (1 h 12 min 24 s) se deduce de la última marca.
2. **Arquitectura editorial** por asuntos, no por orden de aparición: el orden de la conversación se
   mantiene, pero cada capítulo agrupa lo que trata un mismo tema y remite al instante en que empieza.
3. **Redacción** de 13 capítulos, síntesis ejecutiva, conclusiones, cronología, glosario y fuentes.
4. **Recursos visuales**: portada, cartel del reproductor y tres esquemas dibujados para este informe
   (escalada, arco de crisis y cinta transportadora). No se ha usado material de terceros.
5. **Verificación** estática, dinámica, de impresión y visual (apartado 4).

---

## 3. Decisiones de fidelidad

- **Atribución sistemática.** Las tesis del entrevistado se presentan como suyas («sostiene», «según su
  lectura», «afirma»). El informe no las refuta ni las avala.
- **Nota de alcance** en la síntesis ejecutiva, que explica el criterio al lector.
- **Cifras sin referencia** (encuestas, McKinsey, precios del petróleo, porcentajes) se reproducen como
  afirmaciones suyas y se marcan con el sello «No verificado» cuando se usan como dato.
- **Nombres propios** normalizados cuando la forma era inequívoca (Milošević, Mackinder, Mattei,
  Carrington, Hurd, Sakwa, Desai, Harari, Merz). Las formas dudosas se documentan: hermanos Stanić
  («Stanolic»), almirante croata («Domaset»), usuario de X («@nakedhegy»).
- **Citas literales** respecto de la transcripción automática, no del audio en inglés; así se advierte en
  el módulo audiovisual.
- **Sin opiniones ajenas**: no se han añadido fuentes externas, refutaciones ni valoraciones del editor.
  Las notas editoriales se limitan a explicar el estado de un dato o la forma de un nombre.

---

## 4. Comprobaciones realizadas

### 4.1. Estáticas (`herramientas/validar-informe.py`)

| Comprobación | Resultado |
|---|---|
| Identificadores únicos | 60, ninguno duplicado |
| Anclas internas con destino | 53 de 53 |
| Recursos locales existentes | 10 de 10 |
| Imágenes con texto alternativo | 5 de 5 |
| Nombres accesibles en botones | Todos |
| `lang`, `<title>`, un solo `h1`, jerarquía de encabezados | Correctos |
| Versión autónoma | Misma validación, 0 errores, 0 recursos externos |

### 4.2. Dinámicas (Chrome 141 headless)

| Prueba | Resultado |
|---|---|
| Errores de JavaScript o consola | Ninguno |
| Pestañas del capítulo 8 | Cambian selección y panel; teclado operativo |
| Buscador «Krainer» | 47 coincidencias, «1 de 47»; limpieza correcta al cerrar |
| Impresión | `beforeprint` abre los 3 desplegables |
| Reproductor | No carga al abrir; al pulsar inserta el iframe de `youtube-nocookie` con `autoplay` |
| Índice y progreso | Enlace activo y barra de avance operativos |

### 4.3. Impresión y visual

- **PDF:** 42 páginas, 748 KB. Capítulos en página nueva, tablas con cabecera repetida, respuestas
  abiertas y URLs de las fuentes visibles.
- **Revisión visual:** 1440 px, 390 px y emulación de impresión a ancho A4 (674 px).
- **Comprobaciones de legibilidad:** cuerpo de 18 px, interlineado 1,65, columna de 704 px (≈ 78
  caracteres), sin desbordamiento horizontal en 390 px.

---

## 5. Defectos encontrados y corregidos durante la verificación

1. **Los diagramas se recortaban.** Eran `<svg><image>` anidados sin regla de tamaño: se mostraban a
   920 px dentro de una columna de 704 px y se cortaba la última etapa. Se sustituyeron por `<img>` con
   dimensiones declaradas y regla `width: 100%`.
2. **El esquema del arco de crisis era ilegible.** Las cajas se solapaban con la etiqueta y las flechas
   cruzaban el texto. Se rediseñó en tres bandas: potencias marítimas → focos de crisis → presión sobre
   Rusia.
3. **Reproductor en negro sin conexión.** El iframe de YouTube ocupa el espacio y no muestra nada si no
   hay red. Se cambió a carga bajo demanda con cartel local: la página no contacta con YouTube hasta que
   se pulsa.
4. **Notas duplicadas dentro de los SVG.** Tres esquemas repetían en su interior la advertencia que ya
   figura en el pie de figura. Se eliminaron y se trasladó el matiz al `figcaption`.
5. **Entradilla sin aire.** El margen inferior del párrafo de entrada lo anulaba `p:last-child`. Se
   elevó la especificidad.
6. **Líneas de impresión demasiado largas** (≈ 95 caracteres). Se limitó el texto a 158 mm en papel.
7. **Atribución imprecisa del origen.** «Nacido en la antigua Yugoslavia» se sustituyó por «croata de
   origen», que es lo que el entrevistado afirma.

---

## 6. Limitaciones

- **Fecha de publicación del vídeo:** no se ha podido verificar; figura como tal en la portada y en el
  pie. El informe solo usa fechas que aparecen en la conversación.
- **Citas:** son literales respecto de la transcripción automática, no del audio original en inglés.
  Las marcas temporales son fiables al minuto, no al segundo.
- **Afirmaciones no contrastadas:** el informe no verifica las tesis del entrevistado ni las referencias
  que menciona (RUSI, McKinsey, encuestas, acuerdo Reino Unido–Sarajevo). Se declaran como no
  verificadas; contrastarlas exigiría un trabajo documental distinto.
- **Navegadores:** solo se ha probado en Chromium. No se ha probado en Firefox, Safari ni con lector de
  pantalla real.
- **PDF:** se ha comprobado el recuento de páginas y la maqueta mediante emulación a ancho A4; no se han
  revisado las 42 páginas una a una.
- **Imágenes:** no se ha podido descargar la miniatura de YouTube (sin salida HTTPS en el entorno de
  producción). Se ha resuelto con cartel propio, lo que además evita una dependencia remota.

---

## 7. Dependencias externas

- Ninguna para leer el informe: CSS, JavaScript, imágenes y transcripción son locales.
- YouTube solo si se pulsa el reproductor o un enlace con marca temporal.
- Tipografías declaradas sin descarga; alternativa del sistema si no están instaladas.

---

## 8. Pendiente

- [ ] Verificar la fecha de publicación del vídeo y añadirla a la portada.
- [ ] Contrastar con fuentes primarias las referencias que el entrevistado menciona, si el encargo lo
      requiere.
- [ ] Probar en Firefox y Safari.
- [ ] Revisar con lector de pantalla real.
