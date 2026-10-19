#!/usr/bin/env python3
"""Build productos.json for the Productos tab from the Mercadona catalog.

Keeps only the food products (es_alimento) and the fields the tab shows,
drops empty values and writes compact JSON in the repo root.

Usage: python3 scripts/build-productos.py [ruta/a/productos.json]
(default: /mnt/project-files/mercadona/productos.json)
"""
import json
import sys
from pathlib import Path

SRC = Path(sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/mercadona/productos.json')
OUT = Path(__file__).resolve().parent.parent / 'productos.json'
FIELDS = [
    'id', 'nombre', 'marca', 'categoria', 'subcategoria', 'seccion', 'envase',
    'cantidad_neta', 'unidad', 'unidades_pack', 'peso_aproximado',
    'precio_eur', 'precio_referencia_eur', 'formato_referencia',
    'kcal_100', 'proteinas_100', 'carbohidratos_100', 'azucares_100',
    'grasas_100', 'grasas_saturadas_100', 'fibra_100', 'sal_100',
    'fuente_nutricion', 'url',
]

items = json.loads(SRC.read_text(encoding='utf-8'))
foods = [
    # `is` checks: 0 must stay (0 g of fat is data), only null, '' and false go
    {k: p[k] for k in FIELDS if p.get(k) is not None and p.get(k) != '' and p.get(k) is not False}
    for p in items
    if p.get('es_alimento')
]
foods.sort(key=lambda p: (p.get('categoria', ''), p['nombre'].lower()))
OUT.write_text(json.dumps({'fuente': 'Mercadona (tienda.mercadona.es) y Open Food Facts', 'productos': foods},
                          ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print(f'{len(foods)} alimentos de {len(items)} productos -> {OUT} ({OUT.stat().st_size // 1024} KB)')
