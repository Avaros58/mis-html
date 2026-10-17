/* =========================================================================
   INFORME ANALÍTICO · comportamiento — v1.1
   Sin dependencias externas. Cada módulo comprueba que su elemento existe,
   de modo que se puede retirar un componente del HTML sin romper el resto.
   ========================================================================= */
(function () {
  "use strict";

  var html = document.documentElement;
  var almacen = {
    leer: function (clave) {
      try { return window.localStorage.getItem(clave); } catch (e) { return null; }
    },
    escribir: function (clave, valor) {
      try { window.localStorage.setItem(clave, valor); } catch (e) { /* modo privado: se ignora */ }
    }
  };

  /* ----------------------------------------------------------------------
     1. PROGRESO DE LECTURA
     ---------------------------------------------------------------------- */
  (function progreso() {
    var barra = document.getElementById("progreso");
    if (!barra) return;

    var pendiente = false;
    function actualizar() {
      pendiente = false;
      var alto = document.documentElement.scrollHeight - window.innerHeight;
      var porcentaje = alto > 0 ? (window.scrollY / alto) * 100 : 0;
      barra.style.width = Math.min(100, Math.max(0, porcentaje)) + "%";
    }
    function alDesplazar() {
      if (pendiente) return;
      pendiente = true;
      window.requestAnimationFrame(actualizar);
    }
    window.addEventListener("scroll", alDesplazar, { passive: true });
    window.addEventListener("resize", alDesplazar);
    actualizar();
  })();

  /* ----------------------------------------------------------------------
     2. BOTÓN VOLVER ARRIBA
     ---------------------------------------------------------------------- */
  (function volverArriba() {
    var boton = document.getElementById("volver-arriba");
    if (!boton) return;

    var pendiente = false;
    function actualizar() {
      pendiente = false;
      boton.classList.toggle("visible", window.scrollY > 600);
    }
    window.addEventListener("scroll", function () {
      if (pendiente) return;
      pendiente = true;
      window.requestAnimationFrame(actualizar);
    }, { passive: true });

    boton.addEventListener("click", function () {
      var reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reducido ? "auto" : "smooth" });
      var primero = document.querySelector(".barra-superior__titulo");
      if (primero) { primero.setAttribute("tabindex", "-1"); primero.focus({ preventScroll: true }); }
    });
    actualizar();
  })();

  /* ----------------------------------------------------------------------
     3. ÍNDICE: PANEL DESLIZANTE Y SECCIÓN ACTIVA
     ---------------------------------------------------------------------- */
  (function indice() {
    var panel = document.getElementById("indice");
    var abrir = document.getElementById("btn-indice");
    var cerrar = document.getElementById("btn-cerrar-indice");
    var velo = document.getElementById("velo");
    if (!panel) return;

    var focoPrevio = null;

    function estaAbierto() { return panel.classList.contains("abierto"); }

    function abrirPanel() {
      if (estaAbierto()) return;
      focoPrevio = document.activeElement;
      panel.classList.add("abierto");
      document.body.classList.add("sin-desplazamiento");
      if (velo) velo.hidden = false;
      if (abrir) abrir.setAttribute("aria-expanded", "true");
      var primerEnlace = panel.querySelector(".indice__enlace");
      if (primerEnlace) primerEnlace.focus({ preventScroll: true });
    }

    function cerrarPanel() {
      if (!estaAbierto()) return;
      panel.classList.remove("abierto");
      document.body.classList.remove("sin-desplazamiento");
      if (velo) velo.hidden = true;
      if (abrir) abrir.setAttribute("aria-expanded", "false");
      if (focoPrevio && typeof focoPrevio.focus === "function") focoPrevio.focus({ preventScroll: true });
    }

    if (abrir) abrir.addEventListener("click", function () { estaAbierto() ? cerrarPanel() : abrirPanel(); });
    if (cerrar) cerrar.addEventListener("click", cerrarPanel);
    if (velo) velo.addEventListener("click", cerrarPanel);

    panel.addEventListener("click", function (evento) {
      if (evento.target.closest("a")) cerrarPanel();
    });

    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape" && estaAbierto()) cerrarPanel();
    });

    /* Sección activa: la última cuyo inicio ha pasado el borde superior */
    var enlaces = Array.prototype.slice.call(panel.querySelectorAll(".indice__enlace"));
    var secciones = enlaces
      .map(function (enlace) {
        var id = enlace.getAttribute("href");
        return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
      })
      .filter(Boolean);

    if (secciones.length) {
      var pendiente = false;
      function marcarActiva() {
        pendiente = false;
        var limite = (document.querySelector(".barra-superior") || {}).offsetHeight || 0;
        limite += 80;
        var activa = secciones[0];
        for (var i = 0; i < secciones.length; i += 1) {
          if (secciones[i].getBoundingClientRect().top <= limite) activa = secciones[i];
        }
        /* Al final del documento, la última sección queda marcada */
        var alFinal = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
        if (alFinal) activa = secciones[secciones.length - 1];

        enlaces.forEach(function (enlace) {
          var esActiva = enlace.getAttribute("href") === "#" + activa.id;
          if (esActiva) enlace.setAttribute("aria-current", "true");
          else enlace.removeAttribute("aria-current");
        });
      }
      window.addEventListener("scroll", function () {
        if (pendiente) return;
        pendiente = true;
        window.requestAnimationFrame(marcarActiva);
      }, { passive: true });
      window.addEventListener("resize", marcarActiva);
      marcarActiva();
    }

    /* Al cambiar de modalidad o de ancho, el panel no debe quedar a medias */
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1100 && html.getAttribute("data-modo") === "estudio") cerrarPanel();
    });
  })();

  /* ----------------------------------------------------------------------
     4. PESTAÑAS ACCESIBLES (teclado: flechas, Inicio, Fin)
     ---------------------------------------------------------------------- */
  (function pestanas() {
    var grupos = document.querySelectorAll("[data-pestanas]");

    Array.prototype.forEach.call(grupos, function (grupo) {
      var lista = grupo.querySelector('[role="tablist"]');
      var tabs = Array.prototype.slice.call(grupo.querySelectorAll('[role="tab"]'));
      if (!lista || tabs.length === 0) return;

      function seleccionar(tab, darFoco) {
        tabs.forEach(function (otro) {
          var activo = otro === tab;
          otro.setAttribute("aria-selected", activo ? "true" : "false");
          otro.tabIndex = activo ? 0 : -1;
          var panel = document.getElementById(otro.getAttribute("aria-controls"));
          if (panel) panel.hidden = !activo;
        });
        if (darFoco) tab.focus();
      }

      tabs.forEach(function (tab) {
        tab.addEventListener("click", function () { seleccionar(tab, false); });
        tab.addEventListener("keydown", function (evento) {
          var posicion = tabs.indexOf(tab);
          var destino = null;
          if (evento.key === "ArrowRight") destino = tabs[(posicion + 1) % tabs.length];
          else if (evento.key === "ArrowLeft") destino = tabs[(posicion - 1 + tabs.length) % tabs.length];
          else if (evento.key === "Home") destino = tabs[0];
          else if (evento.key === "End") destino = tabs[tabs.length - 1];
          if (destino) {
            evento.preventDefault();
            seleccionar(destino, true);
          }
        });
      });

      /* Si el enlace entrante apunta a un panel oculto, se abre su pestaña */
      if (window.location.hash) {
        var objetivo = document.querySelector(window.location.hash);
        if (objetivo && objetivo.getAttribute("role") === "tabpanel" && objetivo.hidden) {
          var tab = tabs.filter(function (t) { return t.getAttribute("aria-controls") === objetivo.id; })[0];
          if (tab) seleccionar(tab, false);
        }
      }
    });
  })();

  /* ----------------------------------------------------------------------
     5. BUSCADOR INTERNO
     ---------------------------------------------------------------------- */
  (function buscador() {
    var panel = document.getElementById("panel-buscar");
    var abrir = document.getElementById("btn-buscar");
    var cerrar = document.getElementById("btn-cerrar-buscar");
    var formulario = document.getElementById("form-buscar");
    var entrada = document.getElementById("entrada-busqueda");
    var estado = document.getElementById("estado-busqueda");
    var anterior = document.getElementById("btn-anterior");
    var siguiente = document.getElementById("btn-siguiente");
    var contenido = document.getElementById("contenido");
    if (!panel || !entrada || !contenido) return;

    var coincidencias = [];
    var actual = -1;

    function limpiar() {
      var marcas = contenido.querySelectorAll("mark.resaltado");
      Array.prototype.forEach.call(marcas, function (marca) {
        var padre = marca.parentNode;
        if (!padre) return;
        padre.replaceChild(document.createTextNode(marca.textContent), marca);
        padre.normalize();
      });
      coincidencias = [];
      actual = -1;
    }

    function informar(texto) {
      if (estado) estado.textContent = texto;
    }

    function resaltar(cadena) {
      limpiar();
      var buscado = cadena.trim();
      if (buscado.length < 2) { informar("Escribe al menos dos caracteres"); return; }

      var paseo = document.createTreeWalker(contenido, NodeFilter.SHOW_TEXT, {
        acceptNode: function (nodo) {
          var padre = nodo.parentNode;
          if (!padre) return NodeFilter.FILTER_REJECT;
          var etiqueta = padre.nodeName.toLowerCase();
          if (etiqueta === "script" || etiqueta === "style" || etiqueta === "svg") return NodeFilter.FILTER_REJECT;
          if (padre.closest(".no-buscar, .barra-superior, .volver-arriba")) return NodeFilter.FILTER_REJECT;
          if (!nodo.nodeValue || !nodo.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });

      var nodos = [];
      while (paseo.nextNode()) nodos.push(paseo.currentNode);

      var comparacion = buscado.toLocaleLowerCase("es");
      var tope = 400;

      nodos.forEach(function (nodo) {
        if (coincidencias.length >= tope) return;
        var texto = nodo.nodeValue;
        var indice = texto.toLocaleLowerCase("es").indexOf(comparacion);
        if (indice === -1) return;

        var fragmento = document.createDocumentFragment();
        var resto = texto;
        var posicion = indice;

        while (posicion !== -1 && coincidencias.length < tope) {
          fragmento.appendChild(document.createTextNode(resto.slice(0, posicion)));
          var marca = document.createElement("mark");
          marca.className = "resaltado";
          marca.textContent = resto.slice(posicion, posicion + buscado.length);
          fragmento.appendChild(marca);
          coincidencias.push(marca);
          resto = resto.slice(posicion + buscado.length);
          posicion = resto.toLocaleLowerCase("es").indexOf(comparacion);
        }
        fragmento.appendChild(document.createTextNode(resto));
        nodo.parentNode.replaceChild(fragmento, nodo);
      });

      if (coincidencias.length === 0) {
        informar("Sin coincidencias");
        return;
      }
      actual = 0;
      enfocarActual();
    }

    function enfocarActual() {
      if (actual < 0 || !coincidencias.length) return;
      coincidencias.forEach(function (marca) { marca.classList.remove("resaltado--actual"); });
      var marca = coincidencias[actual];
      marca.classList.add("resaltado--actual");
      marca.scrollIntoView({ block: "center", behavior: "smooth" });
      informar((actual + 1) + " de " + coincidencias.length);
    }

    function mover(paso) {
      if (!coincidencias.length) return;
      actual = (actual + paso + coincidencias.length) % coincidencias.length;
      enfocarActual();
    }

    function abrirPanel() {
      panel.hidden = false;
      if (abrir) abrir.setAttribute("aria-expanded", "true");
      entrada.focus({ preventScroll: true });
      entrada.select();
    }

    function cerrarPanel() {
      panel.hidden = true;
      if (abrir) abrir.setAttribute("aria-expanded", "false");
      limpiar();
      informar("");
      if (abrir) abrir.focus({ preventScroll: true });
    }

    if (abrir) abrir.addEventListener("click", function () { panel.hidden ? abrirPanel() : cerrarPanel(); });
    if (cerrar) cerrar.addEventListener("click", cerrarPanel);
    if (formulario) formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();
      resaltar(entrada.value);
    });
    if (entrada) {
      entrada.addEventListener("input", function () {
        if (entrada.value.trim().length >= 2) resaltar(entrada.value);
        else { limpiar(); informar(""); }
      });
      entrada.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape") { evento.stopPropagation(); cerrarPanel(); }
        if (evento.key === "Enter") {
          evento.preventDefault();
          resaltar(entrada.value);
          mover(1);
        }
      });
    }
    if (anterior) anterior.addEventListener("click", function () { mover(-1); });
    if (siguiente) siguiente.addEventListener("click", function () { mover(1); });
  })();

  /* ----------------------------------------------------------------------
     6. TAMAÑO DE LECTURA
     Selector nativo de cinco pasos (100–200 %). Solo escala el texto del
     informe: la barra, el índice y los controles conservan su tamaño.
     ---------------------------------------------------------------------- */
  (function tamanoLectura() {
    var selector = document.getElementById("tamano-lectura");
    if (!selector) return;

    var pasos = ["100", "125", "150", "175", "200"];

    function aplicar(valor) {
      html.setAttribute("data-tamano", valor);
      selector.value = valor;
      window.dispatchEvent(new Event("resize"));
    }

    var guardado = almacen.leer("ia-lectura");
    if (pasos.indexOf(guardado) === -1) {
      // Migración de la preferencia anterior (cuatro niveles).
      var antiguo = almacen.leer("ia-tamano");
      guardado = (antiguo === "grande" || antiguo === "muy-grande") ? "125" : "100";
    }
    aplicar(guardado);
    selector.disabled = false;

    selector.addEventListener("change", function () {
      if (pasos.indexOf(selector.value) === -1) return;
      aplicar(selector.value);
      almacen.escribir("ia-lectura", selector.value);
    });
  })();

  /* ----------------------------------------------------------------------
     7. CONMUTADOR DE MODALIDAD (solo revisión de plantilla)
     ---------------------------------------------------------------------- */
  (function modalidad() {
    var boton = document.getElementById("btn-modo");
    var texto = document.getElementById("btn-modo-texto");
    if (!boton) return;

    function pintar(modo) {
      if (texto) texto.textContent = modo === "interactiva" ? "Modalidad B" : "Modalidad A";
      boton.setAttribute("aria-pressed", modo === "interactiva" ? "true" : "false");
      boton.title = modo === "interactiva"
        ? "Modalidad B · publicación interactiva. Pulsa para pasar a la modalidad A."
        : "Modalidad A · informe de estudio. Pulsa para pasar a la modalidad B.";
    }

    var guardado = almacen.leer("ia-modo");
    if (guardado === "estudio" || guardado === "interactiva") html.setAttribute("data-modo", guardado);
    pintar(html.getAttribute("data-modo") || "estudio");

    boton.addEventListener("click", function () {
      var nuevo = html.getAttribute("data-modo") === "interactiva" ? "estudio" : "interactiva";
      html.setAttribute("data-modo", nuevo);
      almacen.escribir("ia-modo", nuevo);
      pintar(nuevo);
    });
  })();

  /* ----------------------------------------------------------------------
     8. IMPRESIÓN: NADA DE CONTENIDO OCULTO EN PAPEL
     ---------------------------------------------------------------------- */
  (function impresion() {
    var abiertos = [];

    function expandir() {
      abiertos = [];
      Array.prototype.forEach.call(document.querySelectorAll("details:not([open])"), function (detalle) {
        abiertos.push(detalle);
        detalle.open = true;
      });
    }
    function restaurar() {
      abiertos.forEach(function (detalle) { detalle.open = false; });
      abiertos = [];
    }

    window.addEventListener("beforeprint", expandir);
    window.addEventListener("afterprint", restaurar);

    var boton = document.getElementById("btn-imprimir");
    if (boton) boton.addEventListener("click", function () {
      expandir();
      window.print();
    });
  })();

  /* ----------------------------------------------------------------------
     9. MARCA DE PREPARACIÓN (permite estilos que dependen del JS activo)
     ---------------------------------------------------------------------- */
  html.classList.add("js-activo");
})();
