#!/usr/bin/env python3
"""Comprobaciones de contenido del informe de Sachs.

No sustituye al validador estructural (herramientas/validar-informe.py): comprueba
lo que es específico de este encargo.

  · marcas temporales: que todas existan en la transcripción y que cada capítulo
    tenga entre 2 y 4;
  · extensión de cada capítulo (300–500 palabras);
  · presencia de las cifras exigidas por el encargo;
  · recuento total de palabras.

Uso:  python comprobar-contenido.py
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

from lxml import html as lh

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

RAIZ = Path(__file__).resolve().parent.parent
INFORME = RAIZ / "index.html"
TRANSCRIPCION = RAIZ / "assets" / "data" / "transcripcion.md"

CIFRAS = [
    "1.500 millones", "2.500 millones", "3.500 millones",
    "9 %", "18 %", "25 %", "un tercio",
    "450 millones", "5 %", "menos del 4 %",
    "50 %", "15 %", "veinte puntos porcentuales",
    "27 países",
]


def palabras(texto: str) -> int:
    return len(re.findall(r"[\wÁÉÍÓÚÜÑáéíóúüñ%]+(?:[-'][\wÁÉÍÓÚÜÑáéíóúüñ]+)*", texto))


def main() -> int:
    doc = lh.parse(str(INFORME)).getroot()
    crudo = INFORME.read_text(encoding="utf-8")
    transcripcion = TRANSCRIPCION.read_text(encoding="utf-8")

    tiempos_transcripcion = {int(t) for t in re.findall(r"&t=(\d+)s", transcripcion)}
    tiempos_informe = [int(t) for t in re.findall(r"&amp;t=(\d+)s", crudo)]

    errores: list[str] = []
    fuera = sorted({t for t in tiempos_informe if t not in tiempos_transcripcion})
    if fuera:
        errores.append(f"Marcas temporales que no están en la transcripción: {fuera}")

    print(f"Marcas temporales en el informe: {len(tiempos_informe)}")
    print(f"Marcas distintas: {len(set(tiempos_informe))}")
    print(f"Tiempos de la transcripción: {len(tiempos_transcripcion)}")

    print("\nCapítulo                                   marcas  palabras")
    print("-" * 66)
    total_caps = 0
    for numero in range(1, 13):
        seccion = doc.get_element_by_id(f"cap-{numero}")
        parrafos = seccion.xpath(".//p[not(ancestor::figure) and not(ancestor::div[@class='tabla-envoltura'])]")
        texto = " ".join(p.text_content() for p in parrafos)
        cuenta = palabras(texto)
        marcas = len(seccion.xpath(".//a[contains(@class,'marca-tiempo')]"))
        total_caps += cuenta
        titulo = seccion.xpath(".//h2")[0].text_content().strip().split("\n")[0][:38]
        print(f"{numero:>2}. {titulo:<40} {marcas:>4}  {cuenta:>6}")
        if not 2 <= marcas <= 4:
            errores.append(f"Capítulo {numero}: {marcas} marcas temporales (deben ser 2–4)")
        if not 300 <= cuenta <= 500:
            errores.append(f"Capítulo {numero}: {cuenta} palabras (deben ser 300–500)")

    cuerpo = doc.get_element_by_id("contenido")
    total = palabras(cuerpo.text_content())
    print("-" * 66)
    print(f"Palabras de los 12 capítulos: {total_caps}")
    print(f"Palabras de todo el contenido: {total}")

    print("\nCifras exigidas por el encargo:")
    for cifra in CIFRAS:
        presente = cifra in cuerpo.text_content()
        print(f"  {'OK ' if presente else 'FALTA'}  {cifra}")
        if not presente:
            errores.append(f"Falta la cifra: {cifra}")

    if errores:
        print("\nERRORES:")
        for e in errores:
            print(f"  ✗ {e}")
        return 1
    print("\nSin errores de contenido.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
