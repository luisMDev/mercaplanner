# Plan de dieta

App en React de un solo archivo para seguir un plan de dieta: que toca comer hoy, todas las recetas, el plan de la semana (desayuno, media mañana, comida, merienda y cena) y los productos de alimentacion de Mercadona con sus datos nutricionales. Las recetas y el plan salen de `recetas.json`; los productos, de `productos.json`.

Nacio en el vault `luisMDev/jarvis` (`brain/04-sandbox/diet-app/`) y se movio aqui el 19 oct 2026 con su historial.

## Ficheros

| Fichero | Que es |
| --- | --- |
| `app/` | La app rehecha en Next.js con shadcn/ui y estilo cozy, con calendario y cesta de la compra (ver abajo) |
| `index.html` | La app entera: React 18.3.1 y las fuentes (Newsreader y Figtree) van dentro, entre los marcadores `@offline-react` y `@offline-fonts`, asi que funciona sin conexion |
| `recetas.json` | Recetas y plan de la semana (formato abajo) |
| `productos.json` | 2.966 alimentos de Mercadona, generado por `scripts/build-productos.py` |
| `scripts/receta.py` | Buscar productos, calcular kcal y macros de una receta y validar `recetas.json` |
| `scripts/imagen.py` | Ilustracion en acuarela de una receta (a partir de una foto del plato, o de la propia receta) con fondo transparente, con Nano Banana 2.1 o GPT Image 2 |
| `imagenes/` | `estilo-referencia.webp` (el estilo que copian las ilustraciones) y una `<id>.png` por receta con imagen |
| `.env.example` | Plantilla de `.env` (no se sube a git) con las claves `GEMINI_API_KEY` / `OPENAI_API_KEY` |
| `scripts/build-productos.py` | Regenera `productos.json` desde el catalogo completo de Mercadona |
| `.claude/skills/receta/` | Skill `/receta` de Claude Code para añadir recetas |

## Verla en local

El JSON se lee con `fetch`, y el navegador no deja hacerlo con la pagina abierta como fichero (`file://`):

```
python3 -m http.server
```

y abrir `http://localhost:8000`. Abierta como fichero, la pagina ofrece elegir `recetas.json` a mano. Cada JSON que carga se guarda en `localStorage` (`dieta-recetas`, `dieta-productos`) y, si la proxima vez no puede leer el fichero, usa esa copia y lo indica en el pie. El boton "Cargar JSON" del pie sirve tambien para probar otro plan sin tocar el fichero.

## Version en Next.js (`app/`)

La app rehecha con Next.js 16, Tailwind CSS 4 y componentes de shadcn/ui, organizada por funcionalidades y con un estilo cozy: menu a la izquierda, una ilustracion de una tienda de Mercadona en el centro y paneles a la derecha que se abren al elegir una receta o un producto. Ademas de Hoy, Recetas, Semana y Productos trae un calendario del mes y una cesta con la compra de la semana. Lee `recetas.json` y `productos.json` de la raiz, sin copiarlos:

```
cd app
npm install
npm run dev
```

y abrir `http://localhost:3000`. Estructura y detalles en `app/README.md`.

## Formato de `recetas.json`

- `comidas`: los huecos del dia en orden, `{id, label, hora}`. Los `id` `desayuno`, `media-manana`, `comida`, `merienda` y `cena` tienen color propio en el timeline (clases `tl-<id>` del CSS); uno nuevo sale en gris hasta que se le añada.
- `recetas`: `{id, nombre, tipos, descripcion, minutos, raciones, kcal, macros: {proteinas, carbohidratos, grasas}, ingredientes, pasos, notas, imagen}`. `imagen` es la ruta de su PNG en `imagenes/` (la escribe `scripts/imagen.py`; la app aun no la enseña). Solo `id` y `nombre` son obligatorios. `tipos` son ids de `comidas`; el primero decide en que grupo sale en la pestaña Recetas.
- Cada ingrediente es un texto o un objeto `{texto, producto, producto_nombre, gramos}` que lo enlaza con un producto de `productos.json` por su `id`; si Mercadona no lo vende, `{texto, sin_producto: true}`. Bajo el ingrediente sale el nombre del producto y al tocarlo se abre su ficha en Productos. `kcal` y `macros` son por racion y se calculan con `python3 scripts/receta.py calcular <id>` a partir de los `gramos`; la app no los recalcula.
- `semana`: `{lunes, martes, miercoles, jueves, viernes, sabado, domingo}` (sin tildes), cada uno `{<id de comida>: <id de receta>}`. Un dia puede dejar fuera un hueco. Si un id de receta no existe, el plan lo marca como "Receta no encontrada".

## `productos.json`

`scripts/build-productos.py` parte del catalogo de Mercadona (por defecto `/mnt/project-files/mercadona/productos.json` del proyecto Jarvis) y se queda con los productos con `es_alimento` (2.966 de 4.279), solo con los campos que enseña la app y sin valores vacios (los ceros se mantienen):

```
python3 scripts/build-productos.py [ruta/a/productos.json]
```

Pesa ~1,6 MB, asi que la app no lo pide hasta que se abre la pestaña Productos. Los productos con `fuente_nutricion: generico_estimado` (970) llevan la etiqueta "Estimado": sus valores son genericos, no los de la etiqueta; el resto vienen de Open Food Facts.

## Pestañas

- **Hoy**: el dia de la semana de hoy con el total de kcal y macros y cada comida con ingredientes y preparacion. Las comidas que pasaron hace mas de una hora salen con el circulo relleno.
- **Recetas**: todas las recetas agrupadas por tipo, con un buscador por nombre o ingrediente y en que dias del plan aparece cada una.
- **Semana**: una tarjeta por dia con sus comidas y el total de kcal; hoy va marcado.
- **Productos**: los alimentos de Mercadona con precio, precio por kg o litro y kcal, proteinas, hidratos, grasas, fibra y sal por 100 g o 100 ml. Buscador, filtro por categoria y orden por nombre, proteina, calorias o precio.

En el movil (hasta 440 px) las pestañas que no estan abiertas solo enseñan el icono. Selector de tema (automatico, claro, oscuro) en el pie.

## Imagenes de las recetas

`scripts/imagen.py` convierte la foto de un plato en una ilustracion de acuarela con el estilo de `imagenes/estilo-referencia.webp`: manda la foto, la referencia y un prompt a Nano Banana 2.1 (`GEMINI_API_KEY`, ~0,034 $ por imagen) o a GPT Image 2 en calidad baja (`OPENAI_API_KEY`, ~0,006 $), segun la clave que haya en `.env` o en el entorno. Ninguno de los dos devuelve fondo transparente, asi que se pide fondo blanco y el script lo quita (canal alfa, bordes suaves sin halo) y recorta:

```
cp .env.example .env    # y rellenar una clave
python3 scripts/imagen.py <id-receta> --foto foto.jpg
python3 scripts/imagen.py <id-receta> --prompt        # solo ver el prompt y el proveedor
```
