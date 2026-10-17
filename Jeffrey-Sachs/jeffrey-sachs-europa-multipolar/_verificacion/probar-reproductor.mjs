/**
 * Prueba de lógica de assets/js/ampliaciones.js sin navegador.
 *
 * El entorno de producción no permite lanzar Chrome (el sandbox bloquea los
 * canales internos del proceso), así que esta prueba no mide pintado: ejecuta el
 * script contra un DOM mínimo y comprueba las dos ramas exigidas por el encargo.
 *
 *   1. file://  → el botón desaparece y lo sustituye un enlace a YouTube.
 *   2. https:// → al pulsar se inserta un iframe con origin, allow,
 *                 referrerpolicy y allowfullscreen.
 *
 * Uso: node probar-reproductor.mjs
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const RAIZ = path.resolve(import.meta.dirname, "..");
const CODIGO = await readFile(path.join(RAIZ, "assets", "js", "ampliaciones.js"), "utf8");

const ID = "hFqWqG2e6Q8";
const TITULO = "Jeffrey Sachs: ¿Europa como frente en un mundo multipolar?";

class ElementoFalso {
  constructor(etiqueta) {
    this.tagName = etiqueta.toUpperCase();
    this.atributos = {};
    this.hijos = [];
    this.oyentes = {};
    this.clase = "";
    this.textContent = "";
    this.padre = null;
    // En un DOM real, asignar .href refleja el atributo. El script usa la propiedad.
    Object.defineProperty(this, "href", {
      set(valor) { this.atributos.href = String(valor); },
      get() { return this.atributos.href; },
    });
    for (const reflejo of ["target", "rel"]) {
      Object.defineProperty(this, reflejo, {
        set(valor) { this.atributos[reflejo] = String(valor); },
        get() { return this.atributos[reflejo]; },
      });
    }
  }
  set className(valor) { this.clase = valor; }
  get className() { return this.clase; }
  setAttribute(nombre, valor) { this.atributos[nombre] = String(valor); }
  getAttribute(nombre) { return nombre in this.atributos ? this.atributos[nombre] : null; }
  hasAttribute(nombre) { return nombre in this.atributos; }
  addEventListener(tipo, manejador) { (this.oyentes[tipo] ||= []).push(manejador); }
  disparar(tipo) { (this.oyentes[tipo] || []).forEach((f) => f({})); }
  replaceWith(nuevo) {
    if (!this.padre) return;
    const indice = this.padre.hijos.indexOf(this);
    nuevo.padre = this.padre;
    this.padre.hijos.splice(indice, 1, nuevo);
  }
  replaceChildren(...nuevos) {
    this.hijos = nuevos;
    nuevos.forEach((n) => { n.padre = this; });
  }
  focus() { this.enfocado = true; }
  querySelector(selector) {
    const clase = selector.replace(/^\./, "");
    for (const hijo of this.hijos) {
      if (hijo.clase.split(/\s+/).includes(clase)) return hijo;
      const nieto = hijo.querySelector(selector);
      if (nieto) return nieto;
    }
    return null;
  }
}

function crearDocumento(protocolo, origen) {
  const poster = new ElementoFalso("img");
  poster.setAttribute("src", "assets/img/poster-video.svg");
  poster.setAttribute("alt", "Cartel del vídeo");

  const boton = new ElementoFalso("button");
  boton.className = "reproductor__cargar";
  boton.hijos = [poster];

  const contenedor = new ElementoFalso("div");
  contenedor.setAttribute("data-reproductor", ID);
  contenedor.setAttribute("data-titulo", TITULO);
  contenedor.hijos = [boton];
  boton.padre = contenedor;

  const documento = {
    querySelectorAll(selector) {
      return selector === "[data-reproductor]" ? [contenedor] : [];
    },
    querySelector(selector) {
      return selector === ".reproductor__cargar" ? boton : null;
    },
    createElement(etiqueta) {
      const nuevo = new ElementoFalso(etiqueta);
      if (etiqueta === "iframe") {
        // Propiedades DOM que el script asigna directamente
        Object.defineProperty(nuevo, "src", { set(v) { this.atributos.src = v; }, get() { return this.atributos.src; } });
        Object.defineProperty(nuevo, "title", { set(v) { this.atributos.title = v; }, get() { return this.atributos.title; } });
        Object.defineProperty(nuevo, "allow", { set(v) { this.atributos.allow = v; }, get() { return this.atributos.allow; } });
        Object.defineProperty(nuevo, "referrerPolicy", { set(v) { this.atributos.referrerpolicy = v; }, get() { return this.atributos.referrerpolicy; } });
        Object.defineProperty(nuevo, "allowFullscreen", { set(v) { this.atributos.allowfullscreen = v ? "" : null; }, get() { return this.atributos.allowfullscreen !== null; } });
      }
      return nuevo;
    },
  };

  const ventana = { location: { protocol: protocolo, origin: origen } };
  return { documento, ventana, contenedor, boton };
}

function ejecutar(documento, ventana) {
  vm.runInNewContext(CODIGO, { document: documento, window: ventana });
}

const errores = [];

/* ---------------- 1. file:// ---------------- */
{
  const { documento, ventana, contenedor, boton } = crearDocumento("file:", "");
  ejecutar(documento, ventana);
  const hijos = contenedor.hijos;
  const enlace = hijos[0];
  const ok = hijos.length === 1 && enlace && enlace.tagName === "A"
    && enlace.getAttribute("href") === "https://www.youtube.com/watch?v=" + ID
    && enlace.textContent === "Ver el vídeo en YouTube"
    && enlace.getAttribute("target") === "_blank"
    && contenedor.hijos.indexOf(boton) === -1;
  console.log(`file:// → enlace directo: ${ok ? "OK" : "FALLO"}`);
  if (!ok) {
    console.log("  hijos:", hijos.map((h) => h.tagName + "[" + (h.clase || "") + "]").join(", "));
    console.log("  enlace:", enlace && {
      tag: enlace.tagName,
      clase: enlace.clase,
      href: enlace.getAttribute("href"),
      texto: enlace.textContent,
      target: enlace.getAttribute("target"),
    });
    console.log("  boton sigue dentro:", contenedor.hijos.indexOf(boton));
    errores.push("La rama file:// no sustituyó el botón por el enlace esperado");
  }
}

/* ---------------- 2. https:// ---------------- */
{
  const { documento, ventana, contenedor } = crearDocumento("https:", "https://example.org");
  ejecutar(documento, ventana);
  const boton = contenedor.hijos[0];
  const iframeAntes = contenedor.hijos.some((h) => h.tagName === "IFRAME");
  boton.disparar("click");
  const iframe = contenedor.hijos[0];
  const src = iframe && iframe.getAttribute("src");
  const esperado = "https://www.youtube.com/embed/" + ID +
    "?autoplay=1&playsinline=1&origin=https://example.org";
  const ok = iframe && iframe.tagName === "IFRAME" && !iframeAntes
    && src === esperado
    && iframe.getAttribute("title") === TITULO
    && iframe.getAttribute("referrerpolicy") === "strict-origin-when-cross-origin"
    && iframe.getAttribute("allow") ===
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    && iframe.hasAttribute("allowfullscreen");
  console.log(`https:// → iframe con origin: ${ok ? "OK" : "FALLO"}`);
  if (!ok) {
    errores.push("El iframe no se insertó con los atributos exigidos");
    console.log("  src obtenido:", src);
  }
}

if (errores.length) {
  errores.forEach((e) => console.log("  ✗ " + e));
  process.exit(1);
}
console.log("Sin errores en la lógica del reproductor.");
