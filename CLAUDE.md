# Plan de dieta

App personal de dieta de Luis (LuismDev): un solo `index.html` en React que lee `recetas.json` (recetas y plan semanal) y `productos.json` (alimentos de Mercadona). Detalle de formatos y pestañas en `README.md`.

## Idioma

- Habla con Luis en español. Textos de la app, recetas, mensajes de commit y README, en español.
- Codigo, comentarios del codigo y nombres de variables siguen como estan (comentarios en ingles).

## Reglas

- **Nunca subas nada sin confirmacion explicita de Luis**: ni `git push`, ni abrir PRs, ni republicar el artifact. Haz el commit en local, enseña el resumen y pregunta "¿Lo subo?". Solo con un si claro, sube.
- "Subir" significa las dos cosas: `git push` a `main` y volver a publicar el artifact (abajo).
- No inventes productos: todo ingrediente enlazado lleva el `id` real de `productos.json`, buscado con `scripts/receta.py buscar`. Si Mercadona no lo vende, `{texto, sin_producto: true}`.
- Las kcal y los macros nunca se escriben a mano: `python3 scripts/receta.py calcular <id>`.
- Antes de cada commit que toque `recetas.json`: `python3 scripts/receta.py validar` tiene que dar OK.
- No toques `productos.json` a mano; se regenera con `scripts/build-productos.py`, y las fotos de `imagenes/productos/` se bajan y se enlazan con `scripts/build-imagenes.py`.
- `index.html` lleva React y las fuentes en base64 dentro; no los cambies por CDN ni los borres (la app tiene que funcionar sin conexion).

## Añadir una receta

Usa la skill `/receta` (`.claude/skills/receta/SKILL.md`). Resume el flujo: entender la receta, buscar cada ingrediente en Mercadona, escribirla en `recetas.json`, calcular, validar, probar, commit en local y pedir confirmacion para subir.

## Probar cambios

```
python3 -m http.server 8765
```

y abrir `http://localhost:8765` a 375 px de ancho: comprobar que la pestaña afectada se ve bien, sin errores en la consola ni scroll lateral. Si hay Playwright, una captura de la receta en la pestaña Recetas basta.

## Publicar el artifact

Artifact privado: https://claude.ai/artifact/DL15iPmJeDDpadwV4TQK1U. Para actualizarlo, publicar `index.html` en ese `url` con `files` `{"recetas.json": "recetas.json"}` (y `productos.json` solo si ha cambiado). Las fotos de `imagenes/` no van en el artifact (son casi 6.000 ficheros, mas de los que admite); alli la app no las enseña. Si la sesion no tiene la herramienta de Artifacts, dilo y deja solo el push.

## Commits

Mensajes en español, describiendo el cambio: `Receta: hamburguesa de cordero al romero con batata`, `App: ...`, `Productos: ...`.
