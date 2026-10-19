#!/usr/bin/env python3
"""Download the Mercadona photos of the products in productos.json and link
them in it.

Two photos per product, from the shop API (tienda.mercadona.es/api/products/<id>/):
- the front: the first photo (the one the shop shows), 400x400 WebP
  -> imagenes/productos/<id>.webp
- the back label with the nutrition facts: the next photo with perspective 9
  (the back), white margins trimmed so the table stays legible, at most
  900 px, WebP -> imagenes/productos/<id>-etiqueta.webp
The resizing, trimming and WebP conversion are done by Mercadona's image CDN
(imgix), from the original photos (4000-6000 px).

Files already on disk are skipped, so re-running it only fetches what is
missing (new products); --todas downloads every photo again and deletes
the ones the shop no longer has. Then every
product of productos.json gets "imagen" and "imagen_etiqueta" with the paths
of the files that exist (build-productos.py adds them the same way).

Usage: python3 scripts/build-imagenes.py [--todas] [id ...]
"""
import json
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PRODUCTOS = ROOT / 'productos.json'
IMAGES = ROOT / 'imagenes' / 'productos'
API = 'https://tienda.mercadona.es/api/products/{}/?lang=es'
WAREHOUSE = '&wh=mad1'
BACK = 9  # photo perspective of the back of the pack
FRONT_PARAMS = 'fit=crop&w=400&h=400&fm=webp&q=70'
LABEL_PARAMS = 'trim=color&trim-color=FFFFFF&trim-tol=30&fit=max&w=900&h=900&fm=webp&q=45'
WORKERS = 4


def get(url, tries=4):
    for i in range(tries):
        try:
            with urllib.request.urlopen(url, timeout=30) as r:
                return r.read(), r.headers.get('Content-Type', '')
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None, ''
            if i == tries - 1 or e.code not in (429, 500, 502, 503, 504):
                raise
        except (urllib.error.URLError, TimeoutError):
            if i == tries - 1:
                raise
        time.sleep(2 ** (i + 1))


def save(url, path):
    body, ctype = get(url)
    if not body or not ctype.startswith('image/'):
        raise ValueError(f'{url}: {ctype or "404"}')
    tmp = path.with_suffix('.tmp')
    tmp.write_bytes(body)
    tmp.replace(path)


def download(pid, again):
    """Fetch both photos of one product. Returns (front, label, error)."""
    front, label = IMAGES / f'{pid}.webp', IMAGES / f'{pid}-etiqueta.webp'
    if not again and front.exists() and label.exists():
        return 'ya', 'ya', None
    try:
        body, _ = get(API.format(pid) + WAREHOUSE)
        if body is None:
            # Not sold in the Madrid warehouse, but maybe in others
            body, _ = get(API.format(pid))
        if body is None:
            return None, None, 'no está en la tienda'
        # Image URLs without the size params, which go after
        photos = [(p['zoom'].split('?')[0], p.get('perspective')) for p in json.loads(body).get('photos') or []]
        # The first photo is the front even when it is tagged as the back too,
        # as in some packs with the label on the front
        front_src = photos[0][0] if photos else None
        label_src = next((src for src, persp in photos[1:] if persp == BACK), None)
        got = []
        for src, path, params in ((front_src, front, FRONT_PARAMS), (label_src, label, LABEL_PARAMS)):
            if src and (again or not path.exists()):
                save(f'{src}?{params}', path)
            elif not src and again:
                path.unlink(missing_ok=True)
            got.append('ok' if path.exists() else None)
        return got[0], got[1], None
    except Exception as e:  # one product failing must not stop the rest
        return None, None, str(e)


def link_images(p):
    """Set "imagen" and "imagen_etiqueta" to the photos on disk (same as build-productos.py).
    Re-added in this order at the end, so the JSON is the same build-productos.py writes."""
    for key, name in (('imagen', f"{p['id']}.webp"), ('imagen_etiqueta', f"{p['id']}-etiqueta.webp")):
        p.pop(key, None)
        if (IMAGES / name).exists():
            p[key] = f'imagenes/productos/{name}'
    return p


def main(args):
    again = '--todas' in args
    ids = [a for a in args if a != '--todas']
    data = json.loads(PRODUCTOS.read_text(encoding='utf-8'))
    todo = [p['id'] for p in data['productos'] if not ids or p['id'] in ids]
    IMAGES.mkdir(parents=True, exist_ok=True)

    errors, no_label, done = [], [], 0
    with ThreadPoolExecutor(WORKERS) as pool:
        for pid, (front, label, err) in zip(todo, pool.map(lambda i: download(i, again), todo)):
            done += 1
            if err:
                errors.append((pid, err))
            elif not label:
                no_label.append(pid)
            if done % 100 == 0 or done == len(todo):
                print(f'{done}/{len(todo)} productos', flush=True)

    for p in data['productos']:
        link_images(p)
    PRODUCTOS.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')

    fronts = sum('imagen' in p for p in data['productos'])
    labels = sum('imagen_etiqueta' in p for p in data['productos'])
    size = sum(f.stat().st_size for f in IMAGES.glob('*.webp')) / 1024 / 1024
    print(f"{fronts} fotos y {labels} etiquetas de {len(data['productos'])} productos en {IMAGES.relative_to(ROOT)} ({size:.0f} MB)")
    if no_label:
        print(f"Sin foto de la etiqueta: {len(no_label)} ({', '.join(no_label[:20])}{' ...' if len(no_label) > 20 else ''})")
    for pid, err in errors:
        print(f'Error {pid}: {err}')


if __name__ == '__main__':
    main(sys.argv[1:])
