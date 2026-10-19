# Mercaplanner · app en Next.js

La app de dieta con estilo *cozy*: papel crema, títulos manuscritos, rojo tomate y verde Mercadona, y en el centro una ilustración de una tienda de Mercadona. Hecha con Next.js 16 (App Router), React 19, Tailwind CSS 4 y componentes de [shadcn/ui](https://ui.shadcn.com) (Radix, iconos Lucide).

Lee los mismos datos que `../index.html`, sin copiarlos: `../recetas.json` se importa en el build y `../productos.json` sale como fichero estático (con hash en el nombre) que se descarga la primera vez que una vista lo necesita. Se siguen editando con `scripts/receta.py` y `scripts/build-productos.py`.

## Comandos

Desde esta carpeta:

```
npm install
npm run dev      # http://localhost:3000, recarga al cambiar el código o recetas.json
npm run build    # build de producción (página estática)
npm start        # sirve el build en http://localhost:3000
npm run lint
```

## Secciones

La sección abierta va en el hash de la URL (`#/recetas/causa-limena`), así que el botón atrás del navegador cierra el panel abierto.

- **Inicio** (`#/`): menú a la izquierda con la próxima comida en una nota, la tienda en el centro y a la derecha el banner «La dieta de la semana», el panel de recetas y el de productos del plan.
- **Hoy**: las comidas de hoy en orden, con kcal y macros del día; las pasadas salen marcadas y la siguiente, destacada. Debajo, lo de mañana.
- **Recetas**: buscador, filtro por comida y tarjetas con un plato dibujado (los colores salen de los ingredientes). El panel de una receta trae kcal, macros, raciones (los gramos se ajustan), «Añadir a la cesta», ingredientes enlazados a Mercadona, pasos, notas y una tira con las demás.
- **Productos**: los 2.966 alimentos de Mercadona con buscador, categoría y orden. El panel de un producto trae precio, valores por 100 g, «Añadir a la cesta», las recetas que lo usan y más de su sección.
- **Semana**: calendario del mes (el plan se repite cada semana) y, al lado, el día elegido como una entrada con sus comidas.
- **Cesta**: la compra de la semana. Suma lo que piden las comidas del plan (una ración por comida) más lo añadido a mano, en envases de Mercadona y agrupado por pasillo, con el total estimado. Se marca al comprar.

En el móvil las secciones van en una barra fija abajo; en pantallas anchas, arriba. Los ajustes (tema automático, claro u oscuro y «Probar otro recetas.json») están en el engranaje de la cabecera.

## Estructura

Organizada por funcionalidad: cada carpeta de `features/` tiene su vista, sus componentes y, en `model/`, la lógica pura (sin React).

```
src/
├── app/                      Rutas de Next.js: layout (fuentes, tema), página y estilos globales
│   ├── fonts/                Jost, Newsreader, Playfair Display (cursiva) y Great Vibes en woff2
│   └── globals.css           Tokens de shadcn con la paleta cozy (claro y noche) y utilidades
├── assets/tienda.webp        La tienda de Mercadona, sin el cielo para fundirse con el papel
├── components/
│   ├── ui/                   Componentes de shadcn/ui, generados con la CLI
│   ├── cozy/                 Piezas del estilo: panel, botón grande, etiqueta, contador, entrada con
│   │                         fecha, cinta adhesiva, ramita, logo del tomate, título manuscrito y la tienda
│   └── shared/               Buscador, aviso, selector de JSON, textos de recuento y vacío
├── features/
│   ├── shell/                Armazón: rutas por hash, cabecera, menús (lateral, superior, inferior),
│   │                         pie y la maqueta de las secciones (título a la izquierda, panel a la derecha)
│   ├── home/                 Inicio: título, nota de la próxima comida, banner y paneles
│   ├── plan/                 recetas.json: tipos, parseo y cálculos (model/), dibujo del plato y macros
│   ├── today/                Hoy
│   ├── recipes/              Recetas: catálogo y panel de una receta
│   ├── products/             Productos: catálogo compartido (contexto), modelo y componentes
│   ├── week/                 Semana: calendario del mes y el día elegido
│   ├── basket/               Cesta: modelo de la compra y estado guardado en el dispositivo
│   └── theme/                Tema automático, claro u oscuro
├── hooks/                    useMounted (solo en el navegador) y useNow (hora actual, cada minuto)
└── lib/                      Utilidades: formato de números, localStorage y cn()
```

Reglas que sigue el código:

- `model/` no importa React: funciones puras sobre los datos (`dayMeals`, `basketLines`, `monthWeeks`…).
- Una feature puede usar `plan/`, `products/`, `components/` y `lib/`; solo `shell/` junta las secciones.
- Ficheros cortos, un componente principal por fichero.
- Los componentes de `components/ui/` no se editan a mano: se personalizan con `className` donde se usan. Para añadir otro: `npx shadcn@latest add <componente>`.

## Detalles

- **Fecha y localStorage**: lo que depende del dispositivo (el día de hoy, la sección abierta, la cesta, el tema) se pinta en el navegador; la página prerenderizada enseña un esqueleto mientras tanto. El tema se aplica con un script en `<head>` antes del primer pintado, sin parpadeo.
- **Colores por comida**: cada `id` de `comidas` tiene su color en `features/plan/model/meals.ts`; uno nuevo sale en gris hasta que se añada ahí.
- **Platos dibujados**: no hay fotos de las recetas; `features/plan/model/dish-colors.ts` elige los colores del plato por palabras de los ingredientes (patata, atún, aguacate…), y los desayunos y meriendas salen en bol.
- **Cesta**: los gramos de una receta son para todas sus raciones; cada comida del plan cuenta como una ración. Los envases se calculan con la cantidad neta del producto (un ml cuenta como un gramo) y, si no la tiene, uno. Se guarda en `localStorage` (`dieta-cesta`).
- **Cargar JSON**: «Probar otro recetas.json» en los ajustes carga otro plan para probarlo; dura hasta recargar la página. Si `productos.json` no se puede descargar, las vistas que lo usan permiten elegirlo a mano.
- Se guarda en `localStorage` el tema (`dieta-theme`), con la misma clave que `index.html`.
