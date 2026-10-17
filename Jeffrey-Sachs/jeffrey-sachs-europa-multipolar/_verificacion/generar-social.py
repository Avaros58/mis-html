#!/usr/bin/env python3
"""Genera la imagen de difusión social del informe (1200 x 630, JPEG).

Composición alegórica abstracta en la paleta del sistema editorial: un bloque
pequeño y denso a la izquierda (Europa) del que parten tres trazos hacia el
este y el sur, sobre meridianos tenues y un arco terracota.

Uso:  python generar-social.py <ruta-de-salida.jpg>
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ANCHO, ALTO = 1200, 630

PETROLEO = (20, 43, 58)
TERRACOTA = (163, 72, 63)
OCRE = (196, 154, 82)
GRIS_AZULADO = (233, 239, 242)
BLANCO_ROTO = (250, 250, 247)


def fuente(tamano: int, negrita: bool = True) -> ImageFont.FreeTypeFont:
    """Busca una tipografía local concreta; si no existe, usa la de Pillow."""
    candidatos = [
        r"C:\Windows\Fonts\segoeuib.ttf" if negrita else r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arialbd.ttf" if negrita else r"C:\Windows\Fonts\arial.ttf",
    ]
    for ruta in candidatos:
        if Path(ruta).exists():
            return ImageFont.truetype(ruta, tamano)
    return ImageFont.load_default(size=tamano)


def bezier(p0, p1, p2, pasos: int = 120):
    """Puntos de una curva cuadrática."""
    puntos = []
    for i in range(pasos + 1):
        t = i / pasos
        x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t ** 2 * p2[0]
        y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t ** 2 * p2[1]
        puntos.append((x, y))
    return puntos


def trazo(dibujo, puntos, color, grosor=3):
    dibujo.line(puntos, fill=color, width=grosor, joint="curve")


def texto_con_espaciado(dibujo, xy, texto, font, color, espaciado=6):
    x, y = xy
    for caracter in texto:
        dibujo.text((x, y), caracter, font=font, fill=color)
        ancho = dibujo.textlength(caracter, font=font)
        x += ancho + espaciado
    return x


def main(destino: Path) -> None:
    base = Image.new("RGB", (ANCHO, ALTO), PETROLEO)
    dibujo = ImageDraw.Draw(base, "RGBA")

    # Retícula de puntos, muy tenue
    for x in range(0, ANCHO, 26):
        for y in range(0, ALTO, 26):
            dibujo.ellipse((x, y, x + 2, y + 2), fill=GRIS_AZULADO + (26,))

    # Retícula de líneas: da profundidad sin gradientes
    for x in range(0, ANCHO, 80):
        dibujo.line([(x, 0), (x, ALTO)], fill=GRIS_AZULADO + (12,), width=1)

    # Meridianos tenues: el mundo que se ordena lejos del Atlántico
    for desplazamiento, opacidad in ((0, 55), (110, 44), (220, 34), (330, 26)):
        puntos = bezier((640 + desplazamiento, -40),
                        (860 + desplazamiento, 250),
                        (900 + desplazamiento, 680))
        trazo(dibujo, puntos, OCRE + (opacidad,), 2)

    # Masa terracota en el ángulo inferior derecho, insinuada como creciente
    dibujo.arc((620, 300, 1300, 980), start=200, end=340, fill=TERRACOTA + (130,), width=3)
    dibujo.arc((720, 400, 1200, 880), start=200, end=340, fill=TERRACOTA + (70,), width=2)

    # Bloque «Europa»: pequeño, denso, a la izquierda
    bloque = (150, 232, 150 + 74, 232 + 132)
    dibujo.rounded_rectangle(bloque, radius=6, fill=GRIS_AZULADO + (238,))
    cuadros = [(168, 250), (196, 250), (168, 278), (196, 278), (168, 306), (196, 306), (196, 334)]
    for cx, cy in cuadros:
        dibujo.rectangle((cx, cy, cx + 20, cy + 20), fill=PETROLEO + (255,))

    # Tres trayectos: Eurasia (ocre), África (terracota), Atlántico abandonado (punteado)
    trazo(dibujo, bezier((224, 262), (520, 176), (1120, 206)), OCRE + (235,), 4)
    trazo(dibujo, bezier((224, 330), (560, 370), (980, 610)), TERRACOTA + (225,), 4)

    atlantico = bezier((224, 348), (170, 400), (140, 470))
    for indice in range(0, len(atlantico) - 2, 3):
        a, b = atlantico[indice], atlantico[indice + 1]
        dibujo.line([a, b], fill=GRIS_AZULADO + (90,), width=2)

    # Nodos de destino
    dibujo.ellipse((1120 - 7, 206 - 7, 1120 + 7, 206 + 7), fill=OCRE + (255,))
    dibujo.ellipse((980 - 7, 610 - 7, 980 + 7, 610 + 7), fill=TERRACOTA + (255,))

    # Rótulo discreto de la casa editorial
    fuente_etiqueta = fuente(30, negrita=True)
    texto_con_espaciado(dibujo, (150, 520), "INFORME ANAL\u00cdTICO", fuente_etiqueta,
                        OCRE + (245,), espaciado=3)
    dibujo.line([(150, 486), (330, 486)], fill=GRIS_AZULADO + (70,), width=1)

    # Un punto de tensión: el centro que ya no organiza el mapa
    dibujo.ellipse((1076, 468, 1084, 476), fill=BLANCO_ROTO + (150,))

    base.save(destino, "JPEG", quality=88, optimize=True, progressive=True)
    print(f"Escrito: {destino} ({destino.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    salida = Path(sys.argv[1] if len(sys.argv) > 1 else "social-sachs.jpg").resolve()
    main(salida)
