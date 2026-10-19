# Plan de dieta

App en Next.js (carpeta `app/`) para seguir un plan de dieta: que toca comer hoy, todas las recetas, el plan de la semana (desayuno, media mañana, comida, merienda y cena), la cesta de la compra y los productos de alimentacion de Mercadona con sus datos nutricionales. Las recetas y el plan salen de `recetas.json`; los productos, de `productos.json`.

Nacio en el vault `luisMDev/jarvis` (`brain/04-sandbox/diet-app/`) y se movio aqui el 19 oct 2026 con su historial.

## Ficheros

| Fichero | Que es |
| --- | --- |
| `app/` | La app en Next.js con shadcn/ui y estilo cozy, con calendario y cesta de la compra (ver abajo) |
| `recetas.json` | Recetas y plan de la semana (formato abajo) |
| `productos.json` | 2.966 alimentos de Mercadona, generado por `scripts/build-productos.py` |
| `scripts/receta.py` | Buscar productos, calcular kcal y macros de una receta y validar `recetas.json` |
| `scripts/imagen.py` | Ilustracion en acuarela de una receta (a partir de una foto del plato, o de la propia receta) con fondo transparente, con Nano Banana 2.1 o GPT Image 2 |
| `imagenes/` | `estilo-referencia.webp` (el estilo que copian las ilustraciones) y una `<id>.png` por receta con imagen |
| `imagenes/productos/` | Las fotos de cada producto: el frente y la etiqueta de detras con la tabla nutricional (ver abajo) |
| `.env.example` | Plantilla de `.env` (no se sube a git) con las claves `GEMINI_API_KEY` / `OPENAI_API_KEY` |
| `scripts/build-productos.py` | Regenera `productos.json` desde el catalogo completo de Mercadona |
| `scripts/build-imagenes.py` | Descarga las fotos de los productos de la tienda de Mercadona y las enlaza en `productos.json` |
| `.claude/skills/receta/` | Skill `/receta` de Claude Code para añadir recetas |

## La app (`app/`)

Hecha con Next.js 16, Tailwind CSS 4 y componentes de shadcn/ui, organizada por funcionalidades y con un estilo cozy: menu a la izquierda, una ilustracion de una tienda de Mercadona en el centro y paneles a la derecha que se abren al elegir una receta o un producto. Tiene Hoy, Recetas, Productos, Semana (calendario del mes) y Cesta (la compra de la semana). Lee `recetas.json` y `productos.json` de la raiz, sin copiarlos:

```
cd app
npm install
npm run dev
```

y abrir `http://localhost:3000`. Secciones, estructura y detalles en `app/README.md`.

## Formato de `recetas.json`

- `comidas`: los huecos del dia en orden, `{id, label, hora}`. Los `id` `desayuno`, `media-manana`, `comida`, `merienda` y `cena` tienen color propio (en `app/src/features/plan/model/meals.ts`); uno nuevo sale en gris hasta que se le añada.
- `recetas`: `{id, nombre, tipos, descripcion, minutos, raciones, kcal, macros: {proteinas, carbohidratos, grasas}, ingredientes, pasos, notas, imagen}`. `imagen` es la ruta de su PNG en `imagenes/` (la escribe `scripts/imagen.py`; la app la enseña en lugar del plato dibujado). Solo `id` y `nombre` son obligatorios. `tipos` son ids de `comidas`; sirven para filtrar por comida en Recetas.
- Cada ingrediente es un texto o un objeto `{texto, producto, producto_nombre, gramos}` que lo enlaza con un producto de `productos.json` por su `id`; si Mercadona no lo vende, `{texto, sin_producto: true}`. En el panel de la receta, el ingrediente enlaza con la ficha del producto. `kcal` y `macros` son por racion y se calculan con `python3 scripts/receta.py calcular <id>` a partir de los `gramos`; la app no los recalcula.
- `semana`: `{lunes, martes, miercoles, jueves, viernes, sabado, domingo}` (sin tildes), cada uno `{<id de comida>: <id de receta>}`. Un dia puede dejar fuera un hueco. Si un id de receta no existe, el plan lo marca como "Receta no encontrada".

## `productos.json`

`scripts/build-productos.py` parte del catalogo de Mercadona (por defecto `/mnt/project-files/mercadona/productos.json` del proyecto Jarvis) y se queda con los productos con `es_alimento` (2.966 de 4.279), solo con los campos que enseña la app y sin valores vacios (los ceros se mantienen):

```
python3 scripts/build-productos.py [ruta/a/productos.json]
```

Pesa ~1,9 MB, asi que la app no lo descarga hasta que una vista lo necesita. Los productos con `fuente_nutricion: generico_estimado` (970) llevan la etiqueta "Estimado": sus valores son genericos, no los de la etiqueta; el resto vienen de Open Food Facts.

## Fotos de los productos

`scripts/build-imagenes.py` descarga de la tienda de Mercadona (`tienda.mercadona.es/api/products/<id>/`) dos fotos de cada producto de `productos.json` y las guarda en `imagenes/productos/`:

- `<id>.webp`: el frente del producto (la primera foto de la tienda), 400 × 400 px.
- `<id>-etiqueta.webp`: la parte de detras, con la tabla nutricional y los ingredientes (en la API, la siguiente foto con `perspective` 9), recortada al contenido y de hasta 900 px para que la tabla se lea. En la fruta, la verdura y la carne frescas suele ser la etiqueta de la bandeja, sin tabla.

El CDN de imagenes de Mercadona (imgix) las recorta, las reduce y las pasa a WebP a partir de los originales, de 4.000 a 6.000 px. Se enlazan en `productos.json` con `imagen` e `imagen_etiqueta` (rutas desde la raiz del repositorio), y `build-productos.py` los vuelve a poner al regenerarlo si estan las fotos. La app enseña el frente en las tarjetas y en la ficha del producto (en lugar del dibujo de su categoria), y en la ficha, con "Ver etiqueta", la etiqueta, que al tocarla se abre a tamaño completo para leer la tabla.

```
python3 scripts/build-imagenes.py [--todas] [id ...]
```

Sin argumentos baja solo las que faltan, asi que sirve para los productos nuevos despues de regenerar `productos.json`; `--todas` las vuelve a bajar todas (y borra las que la tienda ya no tenga), y con ids solo las de esos productos. Todas juntas tardan una media hora y ocupan ~290 MB: 2.958 fotos del frente y 2.814 etiquetas. A 8 productos les faltan las dos porque la tienda ya no los tiene, y a 144 la etiqueta (sobre todo pan, fruta, verdura y charcuteria al corte).

## Imagenes de las recetas

`scripts/imagen.py` convierte la foto de un plato en una ilustracion de acuarela con el estilo de `imagenes/estilo-referencia.webp`: manda la foto, la referencia y un prompt a Nano Banana 2.1 (`GEMINI_API_KEY`, ~0,034 $ por imagen) o a GPT Image 2 en calidad baja (`OPENAI_API_KEY`, ~0,006 $), segun la clave que haya en `.env` o en el entorno. Ninguno de los dos devuelve fondo transparente, asi que se pide fondo blanco y el script lo quita (canal alfa, bordes suaves sin halo) y recorta:

```
cp .env.example .env    # y rellenar una clave
python3 scripts/imagen.py <id-receta> --foto foto.jpg
python3 scripts/imagen.py <id-receta> --prompt        # solo ver el prompt y el proveedor
```
