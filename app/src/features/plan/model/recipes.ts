import { fmtNum, normalize } from "@/lib/format";
import type { Ingredient, Plan, Receta } from "./types";

export function ingText(i: Ingredient) {
  return typeof i === "string" ? i : i.texto || "";
}

// "388 kcal · 25 min · 2 raciones"
export function recipeFacts(r: Receta) {
  const out: string[] = [];
  if (r.kcal != null) out.push(fmtNum(r.kcal) + " kcal");
  if (r.minutos != null) out.push(r.minutos + " min");
  if (r.raciones != null) out.push(r.raciones + (r.raciones === 1 ? " ración" : " raciones"));
  return out.join(" · ");
}

export function comidaLabel(plan: Plan, id: string) {
  return plan.comidas.find((c) => c.id === id)?.label ?? id;
}

// Everything the Recetas search looks into, normalized
function recipeText(r: Receta) {
  return normalize(
    [r.nombre, r.descripcion, r.notas]
      .concat(
        r.ingredientes.map((i) => ingText(i) + " " + (typeof i === "string" ? "" : (i.producto_nombre ?? ""))),
        r.tipos,
      )
      .join(" "),
  );
}

export function searchRecipes(plan: Plan, query: string) {
  const q = normalize(query.trim());
  return q ? plan.recetas.filter((r) => recipeText(r).includes(q)) : plan.recetas;
}

// Recipes with an ingredient linked to a product, for "Lo usan" in Productos
export function recipesWithProduct(plan: Plan, productId: string) {
  return plan.recetas.filter((r) => r.ingredientes.some((i) => typeof i !== "string" && i.producto === productId));
}
