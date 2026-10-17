/**
 * Verificación funcional y visual del informe de Sachs.
 *
 * Comprueba, en Chrome real y por CDP:
 *   · errores de JavaScript y de consola;
 *   · las cinco escalas de lectura a 1440, 390 y 320 px sin desbordamiento;
 *   · el marco 16:9 del reproductor en las cinco escalas;
 *   · el cartel local y la sustitución del botón por un enlace en file://;
 *   · la inserción del iframe sobre http:// con origin, allow y referrerpolicy;
 *   · buscador, índice activo e impresión (PDF y captura).
 *
 * Uso: node probe.mjs
 * Salida: _verificacion/verificacion.json y capturas PNG/PDF en la misma carpeta.
 */

import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { mkdir, writeFile, readFile, rm, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";

const RAIZ = path.resolve(import.meta.dirname, "..");
const SALIDA = path.join(RAIZ, "_verificacion");
const INFORME = path.join(RAIZ, "index.html");
const PUERTO_HTTP = 8791;

const CANDIDATOS = [
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
];
const navegador = CANDIDATOS.find((ruta) => existsSync(ruta));
if (!navegador) {
  console.error("No se ha encontrado Chrome.");
  process.exit(2);
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".md": "text/markdown; charset=utf-8",
};

const servidor = createServer(async (peticion, respuesta) => {
  try {
    const relativa = decodeURIComponent(peticion.url.split("?")[0]).replace(/^\/+/, "") || "index.html";
    const archivo = path.join(RAIZ, relativa);
    if (!archivo.startsWith(RAIZ)) { respuesta.writeHead(403).end(); return; }
    const datos = await readFile(archivo);
    respuesta.writeHead(200, { "Content-Type": MIME[path.extname(archivo)] || "application/octet-stream" });
    respuesta.end(datos);
  } catch {
    respuesta.writeHead(404).end("no encontrado");
  }
});
await new Promise((r) => servidor.listen(PUERTO_HTTP, "127.0.0.1", r));

await mkdir(SALIDA, { recursive: true });

const puerto = 9333;
const perfil = path.join(process.env.TEMP || ".", "dsh-sachs-perfil-" + Date.now());
const procesos = spawn(navegador, [
  "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
  "--allow-file-access-from-files", "--hide-scrollbars",
  "--disable-search-engine-choice-screen", "--mute-audio",
  `--remote-debugging-port=${puerto}`, `--user-data-dir=${perfil}`, "about:blank",
], { stdio: "ignore" });

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function depurar() {
  for (let i = 0; i < 80; i += 1) {
    try {
      const respuesta = await fetch(`http://127.0.0.1:${puerto}/json/list`);
      const lista = await respuesta.json();
      const pagina = lista.find((t) => t.type === "page");
      if (pagina) return pagina.webSocketDebuggerUrl;
    } catch { /* el puerto aún no escucha */ }
    await esperar(250);
  }
  throw new Error("No se ha podido conectar con Chrome");
}

const ws = new WebSocket(await depurar());
await new Promise((resolver, rechazar) => {
  ws.addEventListener("open", resolver, { once: true });
  ws.addEventListener("error", () => rechazar(new Error("WebSocket no disponible")), { once: true });
});

let siguienteId = 0;
const pendientes = new Map();
const problemas = [];

ws.addEventListener("message", (mensaje) => {
  const datos = JSON.parse(mensaje.data);
  if (datos.id && pendientes.has(datos.id)) {
    const { resolver, rechazar } = pendientes.get(datos.id);
    pendientes.delete(datos.id);
    if (datos.error) rechazar(new Error(JSON.stringify(datos.error)));
    else resolver(datos.result);
    return;
  }
  if (datos.method === "Runtime.exceptionThrown") {
    problemas.push("Excepción JS: " + (datos.params?.exceptionDetails?.text || "?"));
  }
  if (datos.method === "Log.entryAdded") {
    const e = datos.params?.entry;
    if (e && e.level === "error" && !/youtube|ytimg|doubleclick|google/.test(e.url || "")) {
      problemas.push("Error de consola: " + e.text + " " + (e.url || ""));
    }
  }
  if (datos.method === "Runtime.consoleAPICalled" && datos.params?.type === "error") {
    const texto = datos.params.args.map((a) => a.value ?? a.description).join(" ");
    if (!/youtube|ytimg/.test(texto)) problemas.push("console.error: " + texto);
  }
});

function enviar(metodo, params = {}) {
  const id = (siguienteId += 1);
  return new Promise((resolver, rechazar) => {
    pendientes.set(id, { resolver, rechazar });
    ws.send(JSON.stringify({ id, method: metodo, params }));
  });
}

await enviar("Page.enable");
await enviar("Runtime.enable");
await enviar("Log.enable");

async function evaluar(expresion) {
  const { result } = await enviar("Runtime.evaluate", {
    expression: expresion, returnByValue: true, awaitPromise: true,
  });
  if (result.subtype === "error") throw new Error(result.description);
  return result.value;
}

async function navegar(url, ancho, alto, movil = false) {
  await enviar("Emulation.setDeviceMetricsOverride", {
    width: ancho, height: alto, deviceScaleFactor: 1, mobile: movil,
  });
  await enviar("Emulation.setEmulatedMedia", { media: "screen" });
  await enviar("Page.navigate", { url });
  await esperar(1100);
}

async function capturaCompleta(nombre) {
  const metricas = await enviar("Page.getLayoutMetrics");
  const tamano = metricas.cssContentSize || metricas.contentSize;
  const { data } = await enviar("Page.captureScreenshot", {
    format: "png", captureBeyondViewport: true,
    clip: { x: 0, y: 0, width: Math.ceil(tamano.width), height: Math.ceil(tamano.height), scale: 1 },
  });
  const ruta = path.join(SALIDA, nombre + ".png");
  await writeFile(ruta, Buffer.from(data, "base64"));
  return { archivo: path.basename(ruta), ancho: Math.ceil(tamano.width), alto: Math.ceil(tamano.height) };
}

async function capturaElemento(selector, nombre) {
  const caja = await evaluar(`(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return null;
    el.scrollIntoView({ block: 'center' });
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  })()`);
  if (!caja) return null;
  await esperar(300);
  const { data } = await enviar("Page.captureScreenshot", {
    format: "png",
    clip: { x: caja.x, y: caja.y, width: caja.width, height: caja.height, scale: 1 },
  });
  await writeFile(path.join(SALIDA, nombre + ".png"), Buffer.from(data, "base64"));
  return { archivo: nombre + ".png", ancho: Math.round(caja.width), alto: Math.round(caja.height) };
}

const informe = {
  url: pathToFileURL(INFORME).href,
  navegador: path.basename(navegador),
  capturas: [],
  pruebas: {},
  problemas,
};

/* ---------- 1. file:// · escritorio ---------- */
await navegar(informe.url, 1440, 900);
informe.capturas.push(await capturaCompleta("escritorio"));

informe.pruebas.escritorio = await evaluar(`(() => {
  const html = document.documentElement;
  const parrafo = document.querySelector('#sintesis p');
  const reproductor = document.querySelector('.reproductor');
  const r = reproductor.getBoundingClientRect();
  return {
    modo: html.dataset.modo,
    tamano: html.dataset.tamano,
    plantilla: html.dataset.plantilla,
    opcionesLectura: document.querySelectorAll('#tamano-lectura option').length,
    lecturaHabilitada: !document.getElementById('tamano-lectura').disabled,
    fuenteCuerpo: getComputedStyle(document.body).fontSize,
    fuenteParrafo: getComputedStyle(parrafo).fontSize,
    indiceFijo: getComputedStyle(document.getElementById('indice')).position,
    reproductorCaja: { ancho: Math.round(r.width), alto: Math.round(r.height), ratio: +(r.width / r.height).toFixed(3) },
    botonCargar: !!document.querySelector('.reproductor__cargar'),
    enlaceSustituto: (() => {
      const a = document.querySelector('.reproductor a');
      return a ? { texto: a.textContent.trim(), href: a.getAttribute('href') } : null;
    })(),
    enlacesYouTubeVisibles: [...document.querySelectorAll('a')].filter(a => /youtube\\.com\\/watch/.test(a.href || '') && a.offsetParent !== null).length,
    anchoDocumento: document.documentElement.scrollWidth,
    ventana: window.innerWidth
  };
})()`);

/* ---------- 2. Cinco escalas · tres anchos ---------- */
informe.pruebas.escalas = [];
for (const ancho of [1440, 390, 320]) {
  await navegar(informe.url, ancho, 900, ancho < 800);
  for (const valor of ["100", "125", "150", "175", "200"]) {
    const datos = await evaluar(`(async () => {
      const html = document.documentElement;
      html.setAttribute('data-tamano', '${valor}');
      await new Promise(r => setTimeout(r, 120));
      const reproductor = document.querySelector('.reproductor');
      const caja = reproductor.getBoundingClientRect();
      return {
        desbordamiento: Math.max(0, html.scrollWidth - window.innerWidth),
        ratioReproductor: +(caja.width / caja.height).toFixed(3),
        altoReproductor: Math.round(caja.height),
        fuenteParrafo: getComputedStyle(document.querySelector('#cap-1 p')).fontSize
      };
    })()`);
    informe.pruebas.escalas.push({ ancho, valor, ...datos });
  }
}

/* ---------- 3. Móvil: índice desplegable y buscador ---------- */
await navegar(informe.url, 390, 844, true);
informe.capturas.push(await capturaCompleta("movil"));

informe.pruebas.movil = await evaluar(`(async () => {
  const boton = document.getElementById('btn-indice');
  const panel = document.getElementById('indice');
  const velo = document.getElementById('velo');
  const visible = getComputedStyle(boton).display !== 'none';
  boton.click();
  await new Promise(r => setTimeout(r, 350));
  const abierto = panel.classList.contains('abierto') && !velo.hidden;
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await new Promise(r => setTimeout(r, 350));
  return {
    botonVisible: visible,
    abierto,
    cerradoConEscape: !panel.classList.contains('abierto'),
    enlaceActivoTexto: (document.querySelector('.indice__enlace[aria-current="true"]') || {}).textContent?.replace(/\\s+/g, ' ').trim(),
    tablasDesplazables: [...document.querySelectorAll('.tabla-envoltura')].map(t => ({
      desplaza: t.scrollWidth > t.clientWidth, enfocable: t.tabIndex === 0
    }))
  };
})()`);

informe.pruebas.buscador = await evaluar(`(async () => {
  document.getElementById('btn-buscar').click();
  const panel = document.getElementById('panel-buscar');
  const entrada = document.getElementById('entrada-busqueda');
  const abierto = !panel.hidden;
  entrada.value = 'Sachs';
  entrada.dispatchEvent(new Event('input', { bubbles: true }));
  await new Promise(r => setTimeout(r, 250));
  const marcas = document.querySelectorAll('mark.resaltado').length;
  const estado = document.getElementById('estado-busqueda').textContent;
  document.getElementById('btn-cerrar-buscar').click();
  return { abierto, marcas, estado, marcasTrasCerrar: document.querySelectorAll('mark.resaltado').length };
})()`);

/* ---------- 4. http:// · reproductor bajo demanda ---------- */
await navegar(`http://127.0.0.1:${PUERTO_HTTP}/index.html`, 1440, 900);
informe.pruebas.reproductorHttp = await evaluar(`(async () => {
  const contenedor = document.querySelector('[data-reproductor]');
  const boton = contenedor.querySelector('.reproductor__cargar');
  const antes = {
    poster: !!contenedor.querySelector('img'),
    iframes: contenedor.querySelectorAll('iframe').length,
    boton: !!boton
  };
  boton.click();
  await new Promise(r => setTimeout(r, 600));
  const iframe = contenedor.querySelector('iframe');
  return {
    antes,
    despues: iframe ? {
      src: iframe.getAttribute('src'),
      title: iframe.getAttribute('title'),
      allow: iframe.getAttribute('allow'),
      referrerpolicy: iframe.getAttribute('referrerpolicy'),
      allowfullscreen: iframe.hasAttribute('allowfullscreen'),
      origenEsperado: 'https://www.youtube.com/embed/hFqWqG2e6Q8?autoplay=1&playsinline=1&origin=' + location.origin
    } : null
  };
})()`);

await evaluar(`document.querySelector('.fuente-audiovisual').scrollIntoView({block:'center'})`);
await esperar(500);
informe.capturas.push({
  archivo: "modulo-video.png",
  ...(await (async () => {
    const { data } = await enviar("Page.captureScreenshot", { format: "png" });
    await writeFile(path.join(SALIDA, "modulo-video.png"), Buffer.from(data, "base64"));
    return { ancho: 1440, alto: 900 };
  })()),
});

/* ---------- 5. Impresión ---------- */
await navegar(informe.url, 1440, 900);
await enviar("Emulation.setEmulatedMedia", { media: "print" });
await esperar(400);
informe.pruebas.impresion = await evaluar(`(() => {
  const visible = (sel) => {
    const el = document.querySelector(sel);
    return el ? getComputedStyle(el).display !== 'none' : null;
  };
  const capitulo = document.querySelector('.capitulo');
  return {
    barraOculta: !visible('.barra-superior'),
    indiceOculto: !visible('.indice'),
    reproductorOculto: !visible('.reproductor'),
    salidaOculta: !visible('.fuente-audiovisual__salida'),
    fuenteCuerpo: getComputedStyle(document.body).fontSize,
    anchoCapitulo: Math.round(capitulo.getBoundingClientRect().width),
    anchoDocumento: Math.round(document.documentElement.clientWidth),
    marcaTiempoEnPapel: getComputedStyle(document.querySelector('.marca-tiempo')).color
  };
})()`);

const pdf = await enviar("Page.printToPDF", {
  printBackground: true, preferCSSPageSize: true, marginTop: 0, marginBottom: 0,
});
await writeFile(path.join(SALIDA, "impresion.pdf"), Buffer.from(pdf.data, "base64"));
const infoPdf = await stat(path.join(SALIDA, "impresion.pdf"));

const { data: capturaPrint } = await enviar("Page.captureScreenshot", { format: "png" });
await writeFile(path.join(SALIDA, "impresion-primera-pagina.png"), Buffer.from(capturaPrint, "base64"));

/* ---------- 6. Cierre ---------- */
ws.close();
procesos.kill();
servidor.close();
await esperar(300);
try { await rm(perfil, { recursive: true, force: true }); } catch { /* el perfil puede quedar bloqueado */ }

informe.problemas = [...new Set(problemas)];
informe.pdf = { archivo: "impresion.pdf", bytes: infoPdf.size };
console.log(JSON.stringify(informe, null, 2));
process.exit(informe.problemas.length ? 1 : 0);
