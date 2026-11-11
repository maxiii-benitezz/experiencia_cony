#!/usr/bin/env python3
"""
DESCARGAR_EMOJIS.PY
Busca los emojis que aparecen en index.html, css/ y js/ y descarga la imagen PNG de cada
uno que todavía no esté en img/emoji/ (set Noto Color Emoji de Google, licencia Apache 2.0,
tomado del paquete npm "emoji-datasource-google" a través de jsDelivr).

Cuándo usarlo: cuando agregues un emoji NUEVO en algún texto. Si no tiene su imagen,
la página muestra el emoji "común" del celular (que cambia según el dispositivo).

Cómo usarlo (desde la carpeta de la invitación, con internet):
    python3 herramientas/descargar_emojis.py

Necesita Python 3 y Pillow (pip install pillow).
"""
import os, re, glob, io, urllib.request
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DESTINO = os.path.join(RAIZ, "img", "emoji")
URL = "https://cdn.jsdelivr.net/npm/emoji-datasource-google@16.0.0/img/google/64/%s.png"

# Estos símbolos NO se descargan: se dibujan con SVG en js/utilidades.js (▶ ⏸ ✔)
IGNORAR = {"25b6", "23f8", "2714"}

# Qué es un emoji: un pictograma (con FE0F, tonos de piel y uniones ZWJ) o una bandera
PICTO = ("[\u203c\u2049\u2122\u2139\u2194-\u21aa\u231a-\u23ff\u24c2\u25aa-\u25fe\u2600-\u27bf"
         "\u2934\u2935\u2b05-\u2b55\u3030\u303d\u3297\u3299\U0001F000-\U0001FAFF]")
MOD = "[\uFE0F\U0001F3FB-\U0001F3FF]?"
EMOJI = re.compile("(?:[\U0001F1E6-\U0001F1FF]{2})|(?:%s%s(?:\u200D%s%s)*)" % (PICTO, MOD, PICTO, MOD))

def nombre(seq):
    """Nombre de archivo: códigos en hexadecimal unidos con guiones, sin FE0F (ej: 2764-200d-1fa79)"""
    return "-".join("%x" % ord(c) for c in seq if ord(c) != 0xFE0F)

def candidatos(seq):
    """Nombres posibles en el servidor (con o sin FE0F)"""
    con = "-".join("%x" % ord(c) for c in seq)
    return [con, nombre(seq)]

def encontrar():
    vistos = {}
    archivos = [os.path.join(RAIZ, "index.html")] + glob.glob(os.path.join(RAIZ, "css", "*.css")) + glob.glob(os.path.join(RAIZ, "js", "*.js"))
    for a in archivos:
        for m in EMOJI.findall(open(a, encoding="utf-8").read()):
            vistos[nombre(m)] = m
    return vistos

def bajar(seq):
    for c in candidatos(seq):
        try:
            datos = urllib.request.urlopen(URL % c, timeout=30).read()
            return Image.open(io.BytesIO(datos)).convert("RGBA")
        except Exception:
            continue
    return None

if __name__ == "__main__":
    os.makedirs(DESTINO, exist_ok=True)
    for n, seq in sorted(encontrar().items()):
        ruta = os.path.join(DESTINO, n + ".png")
        if n in IGNORAR or os.path.exists(ruta):
            continue
        img = bajar(seq)
        if img is None:
            print("✗ No encontré la imagen de", seq, n)
            continue
        # 256 colores conservando la transparencia: pesa muy poco
        img.quantize(256, method=Image.FASTOCTREE, dither=Image.NONE).save(ruta, optimize=True)
        print("✓", n, seq)
    print("Listo.")
