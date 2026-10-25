#!/usr/bin/env python3
"""Helpers for adding recipes to recetas.json (used by the /receta skill).

  python3 scripts/receta.py buscar <palabras...> [--n 10]
      Products of productos.json whose name, brand or section contain every
      word (accents and case ignored), with size, price and nutrition per 100 g.

  python3 scripts/receta.py calcular <id-receta | --todas>
      Recomputes kcal and macros per serving from the ingredients that have
      "producto" and "gramos", fills "producto_nombre" from productos.json and
      writes recetas.json back.

  python3 scripts/receta.py validar
      Checks recetas.json: required keys, unique ids, meal types and plan
      entries that exist, product ids that exist in productos.json, image
      files that exist, free days ("dias_libres") that are days of the week.
      Exit code 1 if anything is wrong.
"""
import json
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RECETAS = ROOT / 'recetas.json'
PRODUCTOS = ROOT / 'productos.json'
DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
MACROS = {'kcal_100': 'kcal', 'proteinas_100': 'proteinas', 'carbohidratos_100': 'carbohidratos', 'grasas_100': 'grasas'}


def norm(s):
    return unicodedata.normalize('NFD', str(s or '').lower()).encode('ascii', 'ignore').decode()


def productos():
    return {p['id']: p for p in json.loads(PRODUCTOS.read_text(encoding='utf-8'))['productos']}


def leer():
    return json.loads(RECETAS.read_text(encoding='utf-8'))


def escribir(data):
    RECETAS.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def buscar(args):
    n = 10
    if '--n' in args:
        i = args.index('--n')
        n = int(args[i + 1])
        args = args[:i] + args[i + 2:]
    words = [norm(w) for w in args]
    hits = [p for p in productos().values()
            if all(w in norm(' '.join([p['nombre'], p.get('marca', ''), p.get('seccion', '')])) for w in words)]
    print(f'{len(hits)} productos')
    for p in hits[:n]:
        size = f"{p.get('cantidad_neta', '?'):g} {p['unidad']}" if p.get('cantidad_neta') else '?'
        est = ' (estimado)' if p['fuente_nutricion'] == 'generico_estimado' else ''
        print(f"{p['id']:>6}  {p['nombre']} | {p.get('envase', '-')} {size} | {p['precio_eur']:.2f} EUR | "
              f"100 g: {p.get('kcal_100', '?')} kcal, P {p.get('proteinas_100', '?')}, "
              f"HC {p.get('carbohidratos_100', '?')}, G {p.get('grasas_100', '?')}{est}")


def calcular_receta(r, prods):
    tot = {k: 0.0 for k in MACROS}
    sin_dato = []
    for ing in r.get('ingredientes', []):
        if not isinstance(ing, dict) or not ing.get('producto'):
            continue
        p = prods.get(ing['producto'])
        if not p:
            raise SystemExit(f"{r['id']}: el producto {ing['producto']} no existe en productos.json")
        ing['producto_nombre'] = p['nombre']
        if ing.get('gramos') is None:
            sin_dato.append(ing['texto'])
            continue
        for k in tot:
            tot[k] += (p.get(k) or 0) * ing['gramos'] / 100
    rac = r.get('raciones') or 1
    r['kcal'] = round(tot['kcal_100'] / rac)
    r['macros'] = {MACROS[k]: round(tot[k] / rac) for k in MACROS if k != 'kcal_100'}
    print(f"{r['id']}: {r['kcal']} kcal por racion, P {r['macros']['proteinas']} g, "
          f"HC {r['macros']['carbohidratos']} g, G {r['macros']['grasas']} g ({rac} raciones)")
    if sin_dato:
        print('  sin "gramos" (no cuentan):', '; '.join(sin_dato))


def calcular(args):
    if not args:
        raise SystemExit('Uso: calcular <id-receta | --todas>')
    data, prods = leer(), productos()
    objetivo = [r for r in data['recetas'] if args[0] == '--todas' or r['id'] == args[0]]
    if not objetivo:
        raise SystemExit(f'No hay ninguna receta con id {args[0]}')
    for r in objetivo:
        calcular_receta(r, prods)
    escribir(data)


def validar(_args):
    data, prods = leer(), productos()
    errores = []
    comidas = [c.get('id') for c in data.get('comidas', [])]
    ids = [r.get('id') for r in data.get('recetas', [])]
    for r in data.get('recetas', []):
        if not r.get('id') or not r.get('nombre'):
            errores.append(f'receta sin id o nombre: {r}')
            continue
        for t in r.get('tipos', []):
            if t not in comidas:
                errores.append(f"{r['id']}: tipo '{t}' no esta en comidas")
        if r.get('imagen') and not (ROOT / r['imagen']).is_file():
            errores.append(f"{r['id']}: imagen {r['imagen']} no existe")
        for ing in r.get('ingredientes', []):
            if isinstance(ing, dict) and ing.get('producto') and ing['producto'] not in prods:
                errores.append(f"{r['id']}: producto {ing['producto']} no existe en productos.json")
    for dup in {i for i in ids if ids.count(i) > 1}:
        errores.append(f'id de receta repetido: {dup}')
    for dia, plan in data.get('semana', {}).items():
        if dia not in DIAS:
            errores.append(f"semana: dia '{dia}' no valido (sin tildes: {', '.join(DIAS)})")
        for comida, rid in plan.items():
            if comida not in comidas:
                errores.append(f"semana.{dia}: comida '{comida}' no esta en comidas")
            if rid not in ids:
                errores.append(f"semana.{dia}.{comida}: receta '{rid}' no existe")
    libres = data.get('dias_libres', [])
    if not isinstance(libres, list):
        errores.append('dias_libres: tiene que ser una lista de dias')
        libres = []
    for dia in libres:
        if dia not in DIAS:
            errores.append(f"dias_libres: dia '{dia}' no valido (sin tildes: {', '.join(DIAS)})")
    if errores:
        print('\n'.join(errores))
        sys.exit(1)
    texto_libres = f", dias libres: {', '.join(libres)}" if libres else ''
    print(f'OK: {len(ids)} recetas, {len(data.get("semana", {}))} dias en el plan{texto_libres}')


if __name__ == '__main__':
    cmds = {'buscar': buscar, 'calcular': calcular, 'validar': validar}
    if len(sys.argv) < 2 or sys.argv[1] not in cmds:
        print(__doc__)
        sys.exit(2)
    cmds[sys.argv[1]](sys.argv[2:])
