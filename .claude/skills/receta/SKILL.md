---
name: receta
description: Añadir una receta nueva a la app de dieta (recetas.json) con sus ingredientes enlazados a productos de Mercadona, kcal y macros calculados, y pedir confirmacion antes de subirla. Usar con /receta o cuando Luis diga "añade una receta", "nueva receta" o describa un plato para la app.
---

# /receta

Añade una receta a `recetas.json` siguiendo las reglas de `CLAUDE.md`. El argumento es la receta tal como la cuenta Luis (nombre, ingredientes, a veces cantidades o pasos).

## 1. Entender la receta

- Saca nombre, ingredientes, cantidades, raciones y pasos del mensaje.
- Lo que falte, ponlo tu con un valor razonable y dilo en el resumen: 2 raciones por defecto, cantidades habituales para ese plato, pasos cortos y concretos, `minutos` realistas.
- Respeta los ingredientes que nombra Luis: no quites ninguno ni añadas otros principales sin decirlo. Sal, pimienta o especias se pueden añadir como texto sin producto.
- `tipos`: `comida` y/o `cena` para platos principales, `desayuno`, `media-manana` o `merienda` para lo demas.
- `id`: kebab-case sin tildes, unico (`hamburguesa-cordero-batata`).

## 2. Buscar cada ingrediente en Mercadona

```
python3 scripts/receta.py buscar <palabras>
```

- Prueba sinonimos si no sale nada (boniato/batata, hierba buena/hierbabuena) y quita palabras si salen 0.
- Elige el producto que mejor encaja con lo que dijo Luis (si dice "en bote", "congelado" o "para microondas", ese formato). Entre iguales, Hacendado y el envase mas comun.
- Si no hay producto, el ingrediente va como `{"texto": ..., "sin_producto": true}` y en el resumen dices que Mercadona no lo vende.

## 3. Escribir la receta

Añade el objeto al final de `recetas` en `recetas.json`, con `ingredientes` asi:

```json
{ "texto": "1 lata de atún al natural, escurrida (unos 60 g)", "producto": "18018", "gramos": 60 }
```

`gramos` es lo que se come de ese producto en toda la receta (escurrido si aplica). No escribas `producto_nombre`, `kcal` ni `macros`: los rellena el paso 4. Añade `notas` si hay algo util (sustituciones, conservacion, que algo no cuenta en las kcal).

No la metas en `semana` salvo que Luis lo pida; si no lo dice, pregunta en el resumen si la quiere en algun dia.

## 4. Calcular y validar

```
python3 scripts/receta.py calcular <id>
python3 scripts/receta.py validar
```

`validar` tiene que dar OK. Si un ingrediente sin `gramos` sale avisado, decide si le pones gramos o lo dejas fuera de las kcal (y dilo).

## 5. Probar

Sirve la carpeta (`python3 -m http.server 8765`) y abre la pestaña Recetas a 375 px: la receta sale en su grupo, el desplegable enseña ingredientes con sus productos y no hay errores en la consola. Para el servidor al acabar.

## 6. Commit en local y pedir confirmacion

```
git add recetas.json
git commit -m "Receta: <nombre>"
```

Enseña a Luis un resumen corto y **para ahi**:

- Nombre, raciones, minutos y kcal por racion con proteinas, hidratos y grasas.
- Ingredientes con el producto de Mercadona elegido (y los que no estan en Mercadona).
- Lo que hayas supuesto tu (cantidades, raciones, pasos).
- La pregunta: "¿La subo?" (y, si aplica, si la quiere en el plan de la semana).

No hagas `git push` ni republiques el artifact hasta que Luis diga que si. Si pide cambios, aplicalos, repite 4 y 5, haz `git commit --amend` y vuelve a preguntar.

## 7. Subir (solo tras el si)

1. `git push origin main`.
2. Republicar el artifact https://claude.ai/artifact/DL15iPmJeDDpadwV4TQK1U con `index.html` y `files` `{"recetas.json": "recetas.json"}`.
3. Responder con una linea: subida, con el enlace al artifact.
