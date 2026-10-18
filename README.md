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

Pagina en React de un solo archivo, con la misma interfaz que [[peru-trip-itinerary/README|el itinerario de Peru]], para seguir un plan de dieta: que toca comer hoy, todas las recetas, el plan de la semana (desayuno, media mañana, comida, merienda y cena) y los productos de alimentacion de Mercadona con sus datos nutricionales. Las recetas y el plan salen de `recetas.json`; los productos, de `productos.json`.

## Setup

Sin build ni dependencias. `index.html` lleva React 18.3.1 y las fuentes (Newsreader y Figtree) dentro, copiados del itinerario de Peru entre los marcadores `@offline-react` y `@offline-fonts`, asi que funciona sin conexion.

El JSON se lee con `fetch`, y el navegador no deja hacerlo con la pagina abierta como fichero (`file://`). Para verlo con los datos:

```
python3 -m http.server
```

desde esta carpeta y abrir `http://localhost:8000`. Si se abre como fichero, la pagina lo dice y ofrece elegir `recetas.json` a mano. Cada JSON que carga (por `fetch` o a mano) se guarda en `localStorage` (`dieta-recetas`), y si la proxima vez no puede leer el fichero usa esa copia y lo indica en el pie. El boton "Cargar JSON" del pie sirve tambien para probar otro plan sin tocar el fichero.

## `productos.json`

Lo genera `build-productos.py` a partir del catalogo de Mercadona del proyecto (`/mnt/project-files/mercadona/productos.json`, hilo "Catalogo Mercadona"): se queda con los productos con `es_alimento` (2.966 de 4.279), solo con los campos que enseña la pestaña y sin los valores vacios (los ceros se mantienen). Para actualizarlo cuando cambie el catalogo:

```
python3 build-productos.py [ruta/a/productos.json]
```

Pesa ~1,6 MB, asi que la app no lo pide hasta que se abre la pestaña Productos. Tiene los mismos respaldos que `recetas.json`: copia en `localStorage` (`dieta-productos`) y, si no hay ninguna, elegir el fichero a mano.

## Formato de `recetas.json`

- `comidas`: los huecos del dia en orden, `{id, label, hora}`. Los `id` `desayuno`, `media-manana`, `comida`, `merienda` y `cena` tienen color propio en el timeline (clases `tl-<id>` del CSS); uno nuevo sale en gris hasta que se le añada.
- `recetas`: `{id, nombre, tipos, descripcion, minutos, raciones, kcal, macros: {proteinas, carbohidratos, grasas}, ingredientes, pasos, notas}`. Solo `id` y `nombre` son obligatorios. `tipos` son ids de `comidas`; el primero decide en que grupo sale en la pestaña Recetas.
- Cada ingrediente es un texto o un objeto `{texto, producto, producto_nombre, gramos}` que lo enlaza con un producto de `productos.json` por su `id`; si Mercadona no lo vende, `{texto, sin_producto: true}`. En la receta, bajo el ingrediente sale el nombre del producto, y al tocarlo se abre su ficha en la pestaña Productos (con "Ver todos los productos" para volver al listado). `gramos` es la cantidad con la que se han calculado las kcal y los macros por racion; la app no los recalcula, se escriben en la receta.
- `semana`: `{lunes, martes, miercoles, jueves, viernes, sabado, domingo}` (sin tildes), cada uno `{<id de comida>: <id de receta>}`. Un dia puede dejar fuera un hueco. Si un id de receta no existe, el plan lo marca como "Receta no encontrada".

El `recetas.json` actual es de ejemplo (18 oct 2026): una sola receta, causa limeña de atun y aguacate (2 raciones, con patatas cocidas de bote en lugar de papa amarilla), con todos sus ingredientes enlazados a productos de Mercadona salvo la pasta de aji amarillo, que no venden. Sus kcal y macros por racion (447 kcal, 35 g de proteinas, 36 g de hidratos, 16 g de grasas) salen de los valores por 100 g de esos productos y de los gramos de cada ingrediente; 4 de ellos (lima, tomate, cilantro, hierbabuena) tienen valores genericos estimados. La semana la pone en la comida de todos los dias.

## Resultados

- Pestaña "Hoy": la ficha del dia de la semana de hoy (fecha del dispositivo) con el total de kcal y macros en la cabecera y cada comida en el timeline con sus ingredientes y preparacion. Las comidas que pasaron hace mas de una hora salen con el circulo relleno.
- Pestaña "Recetas": todas las recetas agrupadas por tipo, con kcal, tiempo, raciones, macros, en que dias del plan aparecen y un desplegable con ingredientes y preparacion. Arriba, un buscador por nombre o ingrediente (sin distinguir tildes ni mayusculas).
- Pestaña "Semana": una tarjeta por dia con sus comidas y el total de kcal; el dia de hoy va marcado.
- Pestaña "Productos": los alimentos de Mercadona, cada uno con marca, envase, cantidad, precio y precio por kg o litro, y una rejilla con kcal, proteinas, hidratos (y azucares), grasas (y saturadas), fibra y sal por 100 g o 100 ml ("—" si no hay dato), mas el enlace a la tienda. Buscador por nombre, marca, categoria o seccion (todas las palabras, sin distinguir tildes ni mayusculas), filtro por categoria y orden por nombre, mas proteina, menos calorias o precio por kg/l. Los productos con `fuente_nutricion: generico_estimado` (970) llevan la etiqueta "Estimado", porque sus valores son genericos y no los de la etiqueta; el resto vienen de Open Food Facts. Enseña 40 y "Ver más" carga 80 mas.
- En el movil (hasta 440 px) las pestañas que no estan abiertas solo enseñan el icono, porque las cuatro con nombre no caben.
- Tocar el nombre de una receta en Hoy o Semana abre su ficha en Recetas.
- Selector de tema (automatico, claro, oscuro) en el pie, como en el itinerario. La pestaña abierta y el tema se recuerdan en `localStorage`.
- Pestaña Productos probada el 18 oct 2026 en Chromium a 360, 375 y 768 px, en claro y oscuro (busqueda, filtro, orden y "Ver más"), sin errores ni scroll lateral.
- Probado el 16 oct 2026 en Chromium a 375 px, servido por HTTP y como fichero (eligiendo el JSON a mano), en claro y oscuro: sin errores ni scroll lateral.

## Next steps

- Sustituir `recetas.json` por las recetas y el plan reales.
- Si hace falta: lista de la compra de la semana a partir de los ingredientes, o marcar comidas hechas.
