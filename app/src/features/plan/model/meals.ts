import type { Meal, Plan } from "./types";

// Slots a day fills, in the order of "comidas", with their recipe
export function dayMeals(plan: Plan, diaId: string): Meal[] {
  const day = plan.semana[diaId] ?? {};
  return plan.comidas
    .filter((c) => day[c.id])
    .map((c) => ({ comida: c, recetaId: day[c.id], receta: plan.byId[day[c.id]] ?? null }));
}

export function dayTotals(meals: Meal[]) {
  const t = { kcal: 0, proteinas: 0, carbohidratos: 0, grasas: 0 };
  meals.forEach(({ receta: r }) => {
    if (!r) return;
    t.kcal += r.kcal ?? 0;
    t.proteinas += r.macros?.proteinas ?? 0;
    t.carbohidratos += r.macros?.carbohidratos ?? 0;
    t.grasas += r.macros?.grasas ?? 0;
  });
  return t;
}

// Meals that ended more than an hour ago (dot filled in the timeline)
export function pastCount(meals: Meal[], now: Date) {
  const mins = now.getHours() * 60 + now.getMinutes();
  return meals.filter((m) => {
    const p = /^(\d{1,2}):(\d{2})$/.exec(m.comida.hora ?? "");
    return p && Number(p[1]) * 60 + Number(p[2]) + 60 <= mins;
  }).length;
}

// Timeline colour per meal slot (ids of "comidas"). A new id shows in grey
// until it is added here
const MEAL_COLORS: Record<string, string> = {
  desayuno: "var(--gold)",
  "media-manana": "var(--teal)",
  comida: "var(--primary)",
  merienda: "var(--teal)",
  cena: "var(--plum)",
};

export function mealColor(id: string | undefined) {
  return (id && MEAL_COLORS[id]) || "var(--faint)";
}
