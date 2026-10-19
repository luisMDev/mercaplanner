# Plan de dieta

App en React de un solo archivo para seguir un plan de dieta: que toca comer hoy, todas las recetas, el plan de la semana (desayuno, media mañana, comida, merienda y cena) y los productos de alimentacion de Mercadona con sus datos nutricionales. Las recetas y el plan salen de `recetas.json`; los productos, de `productos.json`.

Nacio en el vault `luisMDev/jarvis` (`brain/04-sandbox/diet-app/`) y se movio aqui el 19 oct 2026 con su historial.

## Ficheros

| Fichero | Que es |
| --- | --- |
| `app/` | La app rehecha en Next.js con shadcn/ui (ver abajo) |
| `index.html` | La app entera: React 18.3.1 y las fuentes (Newsreader y Figtree) van dentro, entre los marcadores `@offline-react` y `@offline-fonts`, asi que funciona sin conexion |
| `recetas.json` | Recetas y plan de la semana (formato abajo) |
| `productos.json` | 2.966 alimentos de Mercadona, generado por `scripts/build-productos.py` |
| `imagenes/productos/` | Las fotos de cada producto: el frente y la etiqueta de detras con la tabla nutricional (ver abajo) |
| `scripts/receta.py` | Buscar productos, calcular kcal y macros de una receta y validar `recetas.json` |
| `scripts/build-productos.py` | Regenera `productos.json` desde el catalogo completo de Mercadona |
| `scripts/build-imagenes.py` | Descarga las fotos de los productos de la tienda de Mercadona y las enlaza en `productos.json` |
| `.claude/skills/receta/` | Skill `/receta` de Claude Code para añadir recetas |

## Verla en local

El JSON se lee con `fetch`, y el navegador no deja hacerlo con la pagina abierta como fichero (`file://`):

```
python3 -m http.server
```

y abrir `http://localhost:8000`. Abierta como fichero, la pagina ofrece elegir `recetas.json` a mano. Cada JSON que carga se guarda en `localStorage` (`dieta-recetas`, `dieta-productos`) y, si la proxima vez no puede leer el fichero, usa esa copia y lo indica en el pie. El boton "Cargar JSON" del pie sirve tambien para probar otro plan sin tocar el fichero.

## Version en Next.js (`app/`)

La misma app rehecha con Next.js 16, Tailwind CSS 4 y componentes de shadcn/ui, organizada por funcionalidades. Lee `recetas.json` y `productos.json` de la raiz, sin copiarlos:

```
cd app
npm install
npm run dev
```

y abrir `http://localhost:3000`. Estructura y detalles en `app/README.md`.

## Formato de `recetas.json`

- `comidas`: los huecos del dia en orden, `{id, label, hora}`. Los `id` `desayuno`, `media-manana`, `comida`, `merienda` y `cena` tienen color propio en el timeline (clases `tl-<id>` del CSS); uno nuevo sale en gris hasta que se le añada.
- `recetas`: `{id, nombre, tipos, descripcion, minutos, raciones, kcal, macros: {proteinas, carbohidratos, grasas}, ingredientes, pasos, notas}`. Solo `id` y `nombre` son obligatorios. `tipos` son ids de `comidas`; el primero decide en que grupo sale en la pestaña Recetas.
- Cada ingrediente es un texto o un objeto `{texto, producto, producto_nombre, gramos}` que lo enlaza con un producto de `productos.json` por su `id`; si Mercadona no lo vende, `{texto, sin_producto: true}`. Bajo el ingrediente sale el nombre del producto y al tocarlo se abre su ficha en Productos. `kcal` y `macros` son por racion y se calculan con `python3 scripts/receta.py calcular <id>` a partir de los `gramos`; la app no los recalcula.
- `semana`: `{lunes, martes, miercoles, jueves, viernes, sabado, domingo}` (sin tildes), cada uno `{<id de comida>: <id de receta>}`. Un dia puede dejar fuera un hueco. Si un id de receta no existe, el plan lo marca como "Receta no encontrada".

## `productos.json`

`scripts/build-productos.py` parte del catalogo de Mercadona (por defecto `/mnt/project-files/mercadona/productos.json` del proyecto Jarvis) y se queda con los productos con `es_alimento` (2.966 de 4.279), solo con los campos que enseña la app y sin valores vacios (los ceros se mantienen):

```
python3 scripts/build-productos.py [ruta/a/productos.json]
```

Pesa ~1,9 MB, asi que la app no lo pide hasta que se abre la pestaña Productos. Los productos con `fuente_nutricion: generico_estimado` (970) llevan la etiqueta "Estimado": sus valores son genericos, no los de la etiqueta; el resto vienen de Open Food Facts.

## Fotos de los productos

`scripts/build-imagenes.py` descarga de la tienda de Mercadona (`tienda.mercadona.es/api/products/<id>/`) dos fotos de cada producto de `productos.json` y las guarda en `imagenes/productos/`:

- `<id>.webp`: el frente del producto (la primera foto de la tienda), 400 × 400 px.
- `<id>-etiqueta.webp`: la parte de detras, con la tabla nutricional y los ingredientes (en la API, la siguiente foto con `perspective` 9), recortada al contenido y de hasta 900 px para que la tabla se lea. En la fruta, la verdura y la carne frescas suele ser la etiqueta de la bandeja, sin tabla.

El CDN de imagenes de Mercadona (imgix) las recorta, las reduce y las pasa a WebP a partir de los originales, de 4.000 a 6.000 px. Se enlazan en `productos.json` con `imagen` e `imagen_etiqueta` (rutas desde la raiz del repositorio), y `build-productos.py` los vuelve a poner al regenerarlo si estan las fotos.

```
python3 scripts/build-imagenes.py [--todas] [id ...]
```

Sin argumentos baja solo las que faltan, asi que sirve para los productos nuevos despues de regenerar `productos.json`; `--todas` las vuelve a bajar todas (y borra las que la tienda ya no tenga), y con ids solo las de esos productos. Todas juntas tardan una media hora y ocupan ~290 MB: 2.958 fotos del frente y 2.814 etiquetas. A 8 productos les faltan las dos porque la tienda ya no los tiene, y a 144 la etiqueta (sobre todo pan, fruta, verdura y charcuteria al corte).

## Pestañas

- **Hoy**: el dia de la semana de hoy con el total de kcal y macros y cada comida con ingredientes y preparacion. Las comidas que pasaron hace mas de una hora salen con el circulo relleno.
- **Recetas**: todas las recetas agrupadas por tipo, con un buscador por nombre o ingrediente y en que dias del plan aparece cada una.
- **Semana**: una tarjeta por dia con sus comidas y el total de kcal; hoy va marcado.
- **Productos**: los alimentos de Mercadona con su foto, precio, precio por kg o litro y kcal, proteinas, hidratos, grasas, fibra y sal por 100 g o 100 ml. "Ver etiqueta" enseña la foto de la etiqueta de detras, y al tocarla se abre a tamaño completo para leer la tabla. Buscador, filtro por categoria y orden por nombre, proteina, calorias o precio.

En el movil (hasta 440 px) las pestañas que no estan abiertas solo enseñan el icono. Selector de tema (automatico, claro, oscuro) en el pie.
