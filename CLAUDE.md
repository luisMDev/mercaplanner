# Plan de dieta

App personal de dieta de Luis (LuismDev) hecha en Next.js, en la carpeta `app/`. Lee `recetas.json` (recetas y plan semanal) y `productos.json` (alimentos de Mercadona) de la raiz del repositorio. Formato de los datos en `README.md`; estructura de la app en `app/README.md`.

## Idioma

- Habla con Luis en español. Textos de la app, recetas, mensajes de commit y README, en español.
- Codigo, comentarios del codigo y nombres de variables siguen como estan (comentarios en ingles).

## Reglas

- **Nunca subas nada sin confirmacion explicita de Luis**: ni `git push` ni abrir PRs. Haz el commit en local, enseña el resumen y pregunta "¿Lo subo?". Solo con un si claro, sube.
- "Subir" significa hacer `git push` a `main`.
- No inventes productos: todo ingrediente enlazado lleva el `id` real de `productos.json`, buscado con `scripts/receta.py buscar`. Si Mercadona no lo vende, `{texto, sin_producto: true}`.
- Las kcal y los macros nunca se escriben a mano: `python3 scripts/receta.py calcular <id>`.
- Antes de cada commit que toque `recetas.json`: `python3 scripts/receta.py validar` tiene que dar OK.
- No toques `productos.json` a mano; se regenera con `scripts/build-productos.py`, y las fotos de `imagenes/productos/` se bajan y se enlazan con `scripts/build-imagenes.py`.

## Añadir una receta

Usa la skill `/receta` (`.claude/skills/receta/SKILL.md`). Resume el flujo: entender la receta, buscar cada ingrediente en Mercadona, escribirla en `recetas.json`, calcular, validar, probar, commit en local y pedir confirmacion para subir.

## Probar cambios

```
cd app
npm install
npm run dev
```

y abrir `http://localhost:3000` a 375 px de ancho: comprobar que la seccion afectada se ve bien, sin errores en la consola ni scroll lateral. Si hay Playwright, una captura de la receta en la seccion Recetas basta. Si tocas codigo de `app/`, pasa tambien `npm run lint` y `npm run build`.

## Commits

Mensajes en español, describiendo el cambio: `Receta: hamburguesa de cordero al romero con batata`, `App: ...`, `Productos: ...`.
