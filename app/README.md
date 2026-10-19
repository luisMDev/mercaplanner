# Plan de dieta · app en Next.js

La misma app que `../index.html` (pestañas Hoy, Recetas, Semana y Productos), rehecha con Next.js 16 (App Router), React 19, Tailwind CSS 4 y componentes de [shadcn/ui](https://ui.shadcn.com) (estilo Nova sobre Radix, iconos Lucide).

Lee los mismos datos que la app original, sin copiarlos: `../recetas.json` se importa en el build y `../productos.json` sale como fichero estático (con hash en el nombre) que se descarga la primera vez que se abre Productos. Se siguen editando con `scripts/receta.py` y `scripts/build-productos.py`.

## Comandos

Desde esta carpeta:

```
npm install
npm run dev      # http://localhost:3000, recarga al cambiar el código o recetas.json
npm run build    # build de producción (página estática)
npm start        # sirve el build en http://localhost:3000
npm run lint
```

## Estructura

Organizada por funcionalidad: cada carpeta de `features/` tiene su lógica y sus componentes, y la lógica pura (sin React) va en `model/` para poder probarla y reutilizarla sin la interfaz.

```
src/
├── app/                      Rutas de Next.js: layout (fuentes, tema), página y estilos globales
│   ├── fonts/                Newsreader y Figtree en woff2 (las mismas que llevaba index.html)
│   ├── globals.css           Tokens de shadcn con la paleta de la app (claro y oscuro)
│   ├── layout.tsx
│   └── page.tsx              Título y <DietApp />
├── components/
│   ├── ui/                   Componentes de shadcn/ui, generados con la CLI
│   └── shared/               Piezas propias reutilizables: timeline, buscador, aviso, selector de JSON…
├── features/
│   ├── app-shell/            Armazón: pestañas fijas, navegación entre pestañas, pie y esqueleto de carga
│   ├── plan/                 recetas.json: tipos, parseo y cálculos (model/), timeline del día y caja de receta
│   ├── today/                Pestaña Hoy
│   ├── recipes/              Pestaña Recetas
│   ├── week/                 Pestaña Semana
│   ├── products/             Pestaña Productos: modelo (carga, filtros, formato) y componentes
│   └── theme/                Tema automático, claro u oscuro
├── hooks/                    useMounted (solo en el navegador) y useNow (hora actual, cada minuto)
└── lib/                      Utilidades: formato de números, localStorage y cn()
```

Reglas que sigue el código:

- `model/` no importa React: funciones puras sobre los datos (`dayMeals`, `filterProducts`…).
- Una feature puede usar `plan/`, `components/` y `lib/`; solo `app-shell/` junta las pestañas.
- Ficheros cortos, un componente principal por fichero.
- Los componentes de `components/ui/` no se editan a mano: se personalizan con `className` donde se usan. Para añadir otro: `npx shadcn@latest add <componente>`.

## Detalles

- **Fecha y localStorage**: lo que depende del dispositivo (el día de hoy, la pestaña abierta, el tema) se pinta en el navegador; la página prerenderizada enseña un esqueleto mientras tanto. El tema se aplica con un script en `<head>` antes del primer pintado, sin parpadeo.
- **Colores por comida**: cada `id` de `comidas` tiene su color en `features/plan/model/meals.ts`; uno nuevo sale en gris hasta que se añada ahí.
- **Cargar JSON**: el botón del pie carga otro `recetas.json` para probarlo; dura hasta recargar la página. Si `productos.json` no se puede descargar, la pestaña Productos permite elegirlo a mano.
- Se guarda en `localStorage` la pestaña abierta (`dieta-view`) y el tema (`dieta-theme`), con las mismas claves que `index.html`.
