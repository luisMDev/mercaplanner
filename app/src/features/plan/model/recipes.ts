import { fmtNum, normalize } from "@/lib/format";
import { DIAS } from "./days";
import type { Ingredient, Macros, Plan, Receta } from "./types";

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

// "Proteínas 22 g · Hidratos 36 g · Grasas 15 g"
export function macrosText(m: Macros | undefined) {
  if (!m) return null;
  const parts: string[] = [];
  if (m.proteinas != null) parts.push("Proteínas " + fmtNum(m.proteinas) + " g");
  if (m.carbohidratos != null) parts.push("Hidratos " + fmtNum(m.carbohidratos) + " g");
  if (m.grasas != null) parts.push("Grasas " + fmtNum(m.grasas) + " g");
  return parts.length ? parts.join(" · ") : null;
}

// Where the plan uses a recipe: "Lunes (comida)", …
export function recipeUses(plan: Plan, id: string) {
  const out: string[] = [];
  DIAS.forEach((dia) => {
    const day = plan.semana[dia.id] ?? {};
    plan.comidas.forEach((c) => {
      if (day[c.id] === id) out.push(dia.label + " (" + c.label.toLowerCase() + ")");
    });
  });
  return out;
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

// Recipes grouped by their first meal type, in the order of "comidas"; the
// ones whose type is not a slot go last, under "Otras"
export function groupRecipes(plan: Plan, recetas: Receta[]) {
  return plan.comidas
    .map((c) => ({ id: c.id, label: c.label, recetas: recetas.filter((r) => r.tipos[0] === c.id) }))
    .concat({
      id: "otro",
      label: "Otras",
      recetas: recetas.filter((r) => !plan.comidas.some((c) => c.id === r.tipos[0])),
    })
    .filter((g) => g.recetas.length);
}
