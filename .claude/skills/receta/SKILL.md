---
name: receta
description: Añadir una receta nueva a la app de dieta (recetas.json) con sus ingredientes enlazados a productos de Mercadona, kcal y macros calculados, imagen en acuarela (de la foto que mande Luis, o de la receta si lo pide al empezar), y preguntar con AskUserQuestion si modificarla o enviarla (push a main). Usar con /receta o cuando Luis diga "añade una receta", "nueva receta" o describa un plato para la app.
---

# /receta

Añade una receta a `recetas.json` siguiendo las reglas de `CLAUDE.md`. El argumento es la receta tal como la cuenta Luis (nombre, ingredientes, a veces cantidades o pasos).

## 0. Preguntar por la imagen (solo si Luis no manda foto)

Si el mensaje no trae foto del plato, lo primero, antes de buscar nada, es preguntar con `AskUserQuestion`:

- Pregunta "¿Genero una imagen de la receta a partir de sus ingredientes?", cabecera `Imagen`, con dos opciones:
  - `No`: "Receta sin imagen (se puede añadir luego)".
  - `Si`: "Ilustracion en acuarela pintada a partir de la receta y sus ingredientes".
- Con `Si`, haz el paso 5b sin foto; con `No`, sáltalo. Si manda foto, no preguntes: la imagen se hace de la foto.
- Si la sesion no tiene `AskUserQuestion`, pregúntalo en texto y espera la respuesta.

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

No la metas en `semana` salvo que Luis lo pida; si no lo dice, preguntalo en el paso 6.

## 4. Calcular y validar

```
python3 scripts/receta.py calcular <id>
python3 scripts/receta.py validar
```

`validar` tiene que dar OK. Si un ingrediente sin `gramos` sale avisado, decide si le pones gramos o lo dejas fuera de las kcal (y dilo).

## 5. Probar

Sirve la carpeta (`python3 -m http.server 8765`) y abre la pestaña Recetas a 375 px: la receta sale en su grupo, el desplegable enseña ingredientes con sus productos y no hay errores en la consola. Para el servidor al acabar.

## 5b. Imagen (si Luis manda foto, o si dijo `Si` en el paso 0)

Pinta una ilustracion de acuarela con el estilo de `imagenes/estilo-referencia.webp` y fondo transparente:

```
python3 scripts/imagen.py <id> --foto <ruta-de-la-foto>   # con foto
python3 scripts/imagen.py <id>                            # sin foto: a partir de la receta y sus ingredientes
```

- La foto adjunta esta en disco (en la sesion en la nube, en la carpeta `images/` de la sesion, junto al scratchpad); busca la ruta si no la tienes.
- El script elige el servicio segun la clave que haya en `.env` o en el entorno: `GEMINI_API_KEY` → Nano Banana 2.1 (~0,034 $), `OPENAI_API_KEY` → GPT Image 2 en calidad baja (~0,006 $). Con las dos usa Gemini salvo `IMAGEN_PROVEEDOR=openai` o `--proveedor openai`. Plantilla en `.env.example`; `.env` no se sube a git.
- Si no hay ninguna clave, no inventes la imagen: dile a Luis que añada una (en la nube, como secreto del entorno) y sigue sin imagen.
- Guarda `imagenes/<id>.png` (RGBA, fondo quitado y recortado) y escribe `"imagen": "imagenes/<id>.png"` en la receta; `validar` comprueba que el fichero existe.
- Abre el PNG y miralo antes de seguir: que sea el plato (el de la foto, o uno que encaje con los ingredientes), con el estilo de la referencia y sin restos de fondo. Si sale mal, repite una vez (o con el otro proveedor) y si sigue mal, dilo en el resumen.

## 6. Commit en local y preguntar con AskUserQuestion

```
git add recetas.json imagenes/<id>.png   # la imagen solo si la hay
git commit -m "Receta: <nombre>"
```

Enseña a Luis un resumen corto:

- Nombre, raciones, minutos y kcal por racion con proteinas, hidratos y grasas.
- Ingredientes con el producto de Mercadona elegido (y los que no estan en Mercadona).
- Lo que hayas supuesto tu (cantidades, raciones, pasos).
- Si hay imagen, enseñala (`SendUserFile` con `imagenes/<id>.png`, o dile la ruta) y con que servicio se hizo.

Despues pregunta con la herramienta `AskUserQuestion` (no con texto suelto):

- Pregunta "¿Quieres modificar la receta o enviarla?", cabecera `Receta`, con dos opciones:
  - `Enviarla`: "Push a main con la receta y republicar el artifact".
  - `Modificarla`: "Dime que cambiar antes de subirla (receta o imagen)".
- Si no esta en `semana` y Luis no dijo nada del plan, añade en la misma llamada una segunda pregunta: "¿La meto en el plan de la semana?", cabecera `Semana`, opciones `No` y `Si` (los dias los dice en "Other" o en la respuesta siguiente).

Espera la respuesta. No hagas `git push` ni republiques el artifact antes.

- `Modificarla`, o un texto propio con cambios: aplicalos, repite 4 y 5 (y 5b si cambia la imagen), haz `git commit --amend` y vuelve a preguntar con `AskUserQuestion`.
- `Enviarla`: esa es la confirmacion explicita que pide `CLAUDE.md`; sigue con el paso 7 sin volver a preguntar.
- Si la sesion no tiene `AskUserQuestion`, pregunta en texto "¿La modifico o la envio?" y para ahi.

## 7. Enviar (solo si Luis elige `Enviarla`)

1. Integrar la receta en `main` y hacer push, tanto si estas en `main` como en una rama de sesion (`claude/...`):

   ```
   git fetch origin main
   git rebase origin/main
   python3 scripts/receta.py validar
   git push origin HEAD:main
   ```

   Si el rebase choca en `recetas.json`, quedate con las recetas de los dos lados, vuelve a pasar `validar` y sigue. Si el push falla por red, reintenta hasta 4 veces esperando 2, 4, 8 y 16 s; si falla por otra cosa (permisos, rama protegida), para y dile a Luis el error.
2. Republicar el artifact https://claude.ai/artifact/DL15iPmJeDDpadwV4TQK1U con `index.html` y `files` `{"recetas.json": "recetas.json"}` (y `"imagenes/<id>.png": "imagenes/<id>.png"` si la receta tiene imagen).
3. Responder con una linea: subida a `main`, con el enlace al artifact.
