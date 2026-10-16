---
type: sandbox
status: active
created: 2026-10-16
tech: react, html, json
goal: Visor del plan de dieta semanal con las recetas cargadas desde un JSON
tags: [sandbox/active, health]
---

# Plan de dieta (React)

## Goal

Pagina en React de un solo archivo, con la misma interfaz que [[peru-trip-itinerary/README|el itinerario de Peru]], para seguir un plan de dieta: que toca comer hoy, todas las recetas y el plan de la semana (desayuno, media mañana, comida, merienda y cena). Las recetas y el plan salen de `recetas.json`.

## Setup

Sin build ni dependencias. `index.html` lleva React 18.3.1 y las fuentes (Newsreader y Figtree) dentro, copiados del itinerario de Peru entre los marcadores `@offline-react` y `@offline-fonts`, asi que funciona sin conexion.

El JSON se lee con `fetch`, y el navegador no deja hacerlo con la pagina abierta como fichero (`file://`). Para verlo con los datos:

```
python3 -m http.server
```

desde esta carpeta y abrir `http://localhost:8000`. Si se abre como fichero, la pagina lo dice y ofrece elegir `recetas.json` a mano. Cada JSON que carga (por `fetch` o a mano) se guarda en `localStorage` (`dieta-recetas`), y si la proxima vez no puede leer el fichero usa esa copia y lo indica en el pie. El boton "Cargar JSON" del pie sirve tambien para probar otro plan sin tocar el fichero.

## Formato de `recetas.json`

- `comidas`: los huecos del dia en orden, `{id, label, hora}`. Los `id` `desayuno`, `media-manana`, `comida`, `merienda` y `cena` tienen color propio en el timeline (clases `tl-<id>` del CSS); uno nuevo sale en gris hasta que se le añada.
- `recetas`: `{id, nombre, tipos, descripcion, minutos, raciones, kcal, macros: {proteinas, carbohidratos, grasas}, ingredientes, pasos, notas}`. Solo `id` y `nombre` son obligatorios. `tipos` son ids de `comidas`; el primero decide en que grupo sale en la pestaña Recetas.
- `semana`: `{lunes, martes, miercoles, jueves, viernes, sabado, domingo}` (sin tildes), cada uno `{<id de comida>: <id de receta>}`. Un dia puede dejar fuera un hueco. Si un id de receta no existe, el plan lo marca como "Receta no encontrada".

El `recetas.json` actual es de ejemplo: 13 recetas y una semana inventadas para probar la interfaz.

## Resultados

- Pestaña "Hoy": la ficha del dia de la semana de hoy (fecha del dispositivo) con el total de kcal y macros en la cabecera y cada comida en el timeline con sus ingredientes y preparacion. Las comidas que pasaron hace mas de una hora salen con el circulo relleno.
- Pestaña "Recetas": todas las recetas agrupadas por tipo, con kcal, tiempo, raciones, macros, en que dias del plan aparecen y un desplegable con ingredientes y preparacion. Arriba, un buscador por nombre o ingrediente (sin distinguir tildes ni mayusculas).
- Pestaña "Semana": una tarjeta por dia con sus comidas y el total de kcal; el dia de hoy va marcado.
- Tocar el nombre de una receta en Hoy o Semana abre su ficha en Recetas.
- Selector de tema (automatico, claro, oscuro) en el pie, como en el itinerario. La pestaña abierta y el tema se recuerdan en `localStorage`.
- Probado el 16 oct 2026 en Chromium a 375 px, servido por HTTP y como fichero (eligiendo el JSON a mano), en claro y oscuro: sin errores ni scroll lateral.

## Next steps

- Sustituir `recetas.json` por las recetas y el plan reales.
- Si hace falta: lista de la compra de la semana a partir de los ingredientes, o marcar comidas hechas.
