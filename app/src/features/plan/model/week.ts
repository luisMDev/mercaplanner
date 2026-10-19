import { DIAS } from "./days";
import { dayMeals, dayTotals } from "./meals";
import type { Plan, Receta } from "./types";

// The week at a glance, for the banner of Inicio: how many days and meals the
// plan fills, the average kcal of a planned day and the recipe it repeats most
export function weekSummary(plan: Plan) {
  const counts = new Map<string, number>();
  let days = 0;
  let meals = 0;
  let kcal = 0;
  DIAS.forEach((dia) => {
    const list = dayMeals(plan, dia.id);
    if (!list.length) return;
    days += 1;
    meals += list.length;
    kcal += dayTotals(list).kcal;
    list.forEach((m) => m.receta && counts.set(m.receta.id, (counts.get(m.receta.id) ?? 0) + 1));
  });
  const [starId] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0] ?? [];
  const star: Receta | null = starId ? plan.byId[starId] : null;
  return { days, meals, avgKcal: days ? kcal / days : 0, star };
}

// How many times the week uses a recipe
export function recipeCount(plan: Plan, id: string) {
  return DIAS.reduce((n, dia) => n + Object.values(plan.semana[dia.id] ?? {}).filter((r) => r === id).length, 0);
}

// Products the week's recipes link to, the most used first (all the recipes'
// products when the week is empty)
export function weekProductIds(plan: Plan) {
  const uses = new Map<string, number>();
  const ids = DIAS.flatMap((dia) => Object.values(plan.semana[dia.id] ?? {}));
  (ids.length ? ids : plan.recetas.map((r) => r.id)).forEach((id) => {
    plan.byId[id]?.ingredientes.forEach((i) => {
      if (typeof i !== "string" && i.producto) uses.set(i.producto, (uses.get(i.producto) ?? 0) + 1);
    });
  });
  return [...uses.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id);
}
