# BLOQUEO DE LA VERIFICACIÓN EN NAVEGADOR

**Fecha:** 17 de octubre de 2026 · **Entorno:** sesión de producción con sandbox de archivos.

## Qué se intentó

Se intentó lanzar Chrome en modo headless para ejecutar `probe.mjs` y
`herramientas/capturar-informe.mjs`: capturas de escritorio y móvil, las cinco escalas de lectura a
1440, 390 y 320 px, medición del marco 16:9 del reproductor, prueba del iframe sobre `http://`, e
impresión a PDF.

## Qué ocurrió

Chrome no llega a arrancar. El proceso falla al crear sus canales internos (mojo) y el servicio de
fallos:

```text
crashpad_client_win.cc:430  OpenProcess: Acceso denegado. (0x5)
crashpad_client_win.cc:144  crash server failed to launch, self-terminating
platform_channel.cc:112     Check failed: . : Acceso denegado. (0x5)
```

Se probaron también `--no-sandbox`, `--disable-breakpad`, `--disable-crash-reporter`,
`--single-process` y `--no-zygote`, con un perfil dentro del espacio de trabajo. El resultado fue el
mismo: el sandbox impide los canales con nombre que Chrome necesita, incluso sin capturar su salida.

## Consecuencia

No se han podido producir capturas ni PDF, y no se han podido medir en un motor real:

- el desbordamiento horizontal a 390 y 320 px con las cinco escalas;
- la proporción 16:9 de la caja del reproductor en esas escalas;
- el comportamiento del índice, el buscador y las pestañas en navegador;
- la maquetación de impresión y el número de páginas del PDF.

Estas comprobaciones quedan **pendientes** y así se declaran en `INFORME-DE-REVISION.md`. No se
afirma que se hayan superado.

## Qué sí se comprobó sin navegador

- Validación estructural con `herramientas/validar-informe.py`: sin errores ni avisos.
- Comprobación de contenido con `comprobar-contenido.py`: extensión de capítulos, número de marcas y
  correspondencia de cada marca con la transcripción.
- Prueba de la lógica del reproductor con `probar-reproductor.mjs`: sustitución por enlace en
  `file://` e inserción del iframe con `origin`, `allow`, `referrerpolicy` y `allowfullscreen` en
  `https://`.
- Inspección estática de la hoja de estilo: `.reproductor` declara `aspect-ratio: 16 / 9` y sus
  hijos son absolutos, de modo que el control de lectura no altera la geometría.
