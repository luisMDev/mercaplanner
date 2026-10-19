import type { StaticImageData } from "next/image";
import type { Receta } from "./types";

// Watercolour drawings in imagenes/ (repository root), bundled at build time.
// Keys are relative to this file: "../../../../../imagenes/<id>.png"
const images = import.meta.glob<StaticImageData>("../../../../../imagenes/*.png", {
  eager: true,
  import: "default",
});

const PREFIX = "../../../../../";

// The drawing of a recipe, or null when it has none (or its file is missing)
export function recipeImage(receta: Receta): StaticImageData | null {
  return receta.imagen ? (images[PREFIX + receta.imagen] ?? null) : null;
}
