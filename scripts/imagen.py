#!/usr/bin/env python3
"""Watercolor image of a recipe, in the style of imagenes/estilo-referencia.webp
(used by the /receta skill).

  python3 scripts/imagen.py <id-receta> [--foto ruta] [--proveedor gemini|openai] [--prompt] [--sin-guardar]
      Sends the style reference (and the photo of the dish, if given) plus a
      prompt to Nano Banana 2.1 (GEMINI_API_KEY) or GPT Image 2 at low quality
      (OPENAI_API_KEY), removes the white background, saves
      imagenes/<id>.png (RGBA, transparent background) and writes
      "imagen": "imagenes/<id>.png" into the recipe.
      Keys are read from the environment or from .env at the repo root.
      With both keys, Gemini unless --proveedor or IMAGEN_PROVEEDOR say otherwise.
      --prompt only prints the prompt and the chosen provider, without calling any API.

  python3 scripts/imagen.py recortar <entrada> <salida.png>
      Only the background removal, on an image that already exists.
"""
import base64
import io
import json
import os
import sys
from pathlib import Path

import numpy as np
import requests
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
RECETAS = ROOT / 'recetas.json'
IMAGENES = ROOT / 'imagenes'
REFERENCIA = IMAGENES / 'estilo-referencia.webp'

GEMINI_MODEL = 'gemini-nano-banana-2.1'
GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/interactions'
OPENAI_MODEL = 'gpt-image-2'
OPENAI_URL = 'https://api.openai.com/v1/images/edits'
COSTE = {'gemini': '~0,034 $ (1K)', 'openai': '~0,006 $ + entrada (calidad baja)'}

# Style of the reference image, spelled out so the model does not have to guess it.
ESTILO = """Cozy hand-painted watercolor food illustration, exactly in the style of the style reference image:
- soft, warm, slightly desaturated palette; gentle watercolor washes with visible paper grain and pigment granulation;
- thin, delicate sepia-brown ink outlines around every shape, slightly loose and hand-drawn;
- soft light from the upper left, subtle shading inside the shapes, small white highlights on glossy parts;
- the food sits on a round cream-colored ceramic plate with a turquoise band on the rim, seen from a 3/4 elevated angle (about 30 degrees), plate centered and fully visible with some empty margin around it;
- a few small crumbs or garnish bits scattered on the plate, appetizing and homemade, one serving.
Isolated on a flat, pure white (#FFFFFF) background: no table, no tablecloth, no cutlery, no drop shadow on the background, no frame, no text, no watermark."""


def leer():
    return json.loads(RECETAS.read_text(encoding='utf-8'))


def receta(rid):
    for r in leer()['recetas']:
        if r['id'] == rid:
            return r
    sys.exit(f"No hay ninguna receta con id '{rid}' en recetas.json")


def prompt(r, con_foto):
    if con_foto:
        return (f"{ESTILO}\n\nImage 1 is a photo of the dish \"{r['nombre']}\". Repaint exactly that dish "
                "(same foods, amounts, arrangement and colors) as this watercolor illustration. "
                "Image 2 is only the style reference: copy its painting style and plate, never its food.")
    ings = [i['texto'] if isinstance(i, dict) else i for i in r.get('ingredientes', [])]
    return (f"{ESTILO}\n\nPaint one serving of \"{r['nombre']}\": {r.get('descripcion', '')}\n"
            f"Recipe ingredients (show only what is actually on the plate, no packaging, oil or seasoning jars): "
            f"{'; '.join(ings)}.\n"
            "The attached image is only the style reference: copy its painting style and plate, never its food.")


def env():
    vals = {}
    f = ROOT / '.env'
    if f.exists():
        for line in f.read_text(encoding='utf-8').splitlines():
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                vals[k.strip().removeprefix('export ').strip()] = v.strip().strip('"\'')
    vals.update({k: v for k, v in os.environ.items() if v})
    return vals


def proveedor(vals, forzado):
    claves = {'gemini': vals.get('GEMINI_API_KEY') or vals.get('GOOGLE_API_KEY'), 'openai': vals.get('OPENAI_API_KEY')}
    elegido = forzado or vals.get('IMAGEN_PROVEEDOR') or ('openai' if claves['openai'] and not claves['gemini'] else 'gemini')
    if elegido not in claves:
        sys.exit(f"Proveedor '{elegido}' no valido: gemini u openai")
    return elegido, claves[elegido]


def png_blanco(path):
    # The reference has a transparent background; flatten it on white, which is what we ask for back.
    im = Image.open(path).convert('RGBA')
    fondo = Image.new('RGBA', im.size, (255, 255, 255, 255))
    buf = io.BytesIO()
    Image.alpha_composite(fondo, im).convert('RGB').save(buf, 'PNG')
    return buf.getvalue()


def foto_png(path):
    im = Image.open(path)
    im.thumbnail((1536, 1536))
    buf = io.BytesIO()
    im.convert('RGB').save(buf, 'PNG')
    return buf.getvalue()


def find_image(node):
    # Interactions responses carry {"type": "image", "data": ...}; generateContent ones inlineData.
    if isinstance(node, dict):
        for k in ('inlineData', 'inline_data'):
            if isinstance(node.get(k), dict) and node[k].get('data'):
                return node[k]['data']
        if node.get('type') == 'image' and isinstance(node.get('data'), str):
            return node['data']
        node = list(node.values())
    if isinstance(node, list):
        for v in node:
            found = find_image(v)
            if found:
                return found
    return None


def generar_gemini(key, texto, imagenes):
    entrada = [{'type': 'text', 'text': texto}]
    entrada += [{'type': 'image', 'mime_type': 'image/png', 'data': base64.b64encode(b).decode()} for b in imagenes]
    body = {'model': GEMINI_MODEL, 'input': entrada, 'store': False,
            'response_format': {'type': 'image', 'aspect_ratio': '1:1', 'image_size': '1K', 'mime_type': 'image/png'}}
    res = requests.post(GEMINI_URL, json=body, headers={'x-goog-api-key': key}, timeout=300)
    if not res.ok:
        sys.exit(f'Gemini respondio {res.status_code}: {res.text[:800]}')
    data = find_image(res.json())
    if not data:
        sys.exit(f'Gemini no devolvio ninguna imagen: {res.text[:800]}')
    return base64.b64decode(data)


def generar_openai(key, texto, imagenes):
    files = [('image[]', (f'imagen{i + 1}.png', b, 'image/png')) for i, b in enumerate(imagenes)]
    form = {'model': OPENAI_MODEL, 'prompt': texto, 'quality': 'low', 'size': '1024x1024', 'output_format': 'png'}
    res = requests.post(OPENAI_URL, data=form, files=files, headers={'Authorization': f'Bearer {key}'}, timeout=300)
    if not res.ok:
        sys.exit(f'OpenAI respondio {res.status_code}: {res.text[:800]}')
    return base64.b64decode(res.json()['data'][0]['b64_json'])


def recortar(im, umbral=232, margen=24):
    """White background -> alpha: flood fill the near-white pixels connected to
    the border (white inside the drawing is kept), soften the edge and remove
    the white halo, then crop to the drawing plus a margin."""
    rgb = np.asarray(im.convert('RGB')).astype(np.float32)
    h, w, _ = rgb.shape
    minimo, maximo = rgb.min(axis=2), rgb.max(axis=2)
    candidato = (minimo >= umbral) & (maximo - minimo <= 24)
    # Pad with a candidate border so a single fill from the corner reaches every edge.
    mask = Image.new('L', (w + 2, h + 2), 255)
    mask.paste(Image.fromarray((candidato * 255).astype(np.uint8)), (1, 1))
    ImageDraw.floodfill(mask, (0, 0), 128)
    fondo = np.asarray(mask)[1:-1, 1:-1] == 128
    # Soft edge: in a thin band around the background, alpha follows the distance to white.
    banda = np.asarray(Image.fromarray((fondo * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5))) > 0
    alpha = np.where(fondo, 0.0, 1.0)
    borde = banda & ~fondo
    alpha[borde] = np.clip((255 - minimo[borde]) / (255 - umbral), 0, 1)
    # Undo the white blend on semi-transparent pixels so no halo shows on dark themes.
    a = alpha[..., None]
    color = np.where(a > 0, (rgb - 255 * (1 - a)) / np.maximum(a, 1e-3), 0)
    out = np.dstack([np.clip(color, 0, 255), alpha * 255]).round().astype(np.uint8)
    ys, xs = np.nonzero(alpha)
    if not len(xs):
        sys.exit('La imagen se ha quedado vacia al quitar el fondo')
    caja = (max(0, xs.min() - margen), max(0, ys.min() - margen), min(w, xs.max() + 1 + margen), min(h, ys.max() + 1 + margen))
    return Image.fromarray(out, 'RGBA').crop(caja)


def guardar_en_receta(rid, ruta):
    data = leer()
    for r in data['recetas']:
        if r['id'] == rid:
            r['imagen'] = ruta
    RECETAS.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def main(args):
    if args[:1] == ['recortar'] and len(args) == 3:
        recortar(Image.open(args[1])).save(args[2])
        print(f'Guardada {args[2]}')
        return
    opts = {}
    for flag in ('--foto', '--proveedor'):
        if flag in args:
            i = args.index(flag)
            opts[flag] = args[i + 1]
            args = args[:i] + args[i + 2:]
    solo_prompt = '--prompt' in args
    sin_guardar = '--sin-guardar' in args
    args = [a for a in args if a not in ('--prompt', '--sin-guardar')]
    if len(args) != 1:
        print(__doc__)
        sys.exit(2)
    r = receta(args[0])
    foto = opts.get('--foto')
    texto = prompt(r, bool(foto))
    nombre, key = proveedor(env(), opts.get('--proveedor'))
    modelo = GEMINI_MODEL if nombre == 'gemini' else OPENAI_MODEL
    print(f'Proveedor: {nombre} ({modelo}), coste {COSTE[nombre]}')
    if solo_prompt:
        print(texto)
        return
    if not key:
        sys.exit('No hay clave: pon GEMINI_API_KEY u OPENAI_API_KEY en .env (o en el entorno)')
    imagenes = ([foto_png(foto)] if foto else []) + [png_blanco(REFERENCIA)]
    generar = generar_gemini if nombre == 'gemini' else generar_openai
    bruto = Image.open(io.BytesIO(generar(key, texto, imagenes)))
    IMAGENES.mkdir(exist_ok=True)
    salida = IMAGENES / f"{r['id']}.png"
    recortar(bruto).save(salida, optimize=True)
    ruta = salida.relative_to(ROOT).as_posix()
    if not sin_guardar:
        guardar_en_receta(r['id'], ruta)
    print(f'Guardada {ruta}' + ('' if sin_guardar else ' y enlazada en recetas.json'))


if __name__ == '__main__':
    main(sys.argv[1:])
