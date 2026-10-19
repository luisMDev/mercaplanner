import { DIAS } from "@/features/plan/model/days";
import { ingText } from "@/features/plan/model/recipes";
import type { Plan, Receta } from "@/features/plan/model/types";
import type { Catalog } from "@/features/products/model/catalog";
import type { Producto } from "@/features/products/model/types";
import { normalize } from "@/lib/format";

/* The shopping list: what the week's plan needs, plus recipes and products
   added by hand. Saved in localStorage as BasketState */

export type BasketState = {
  // Recipes added from Recetas, with their servings
  recipes: Record<string, number>;
  // Products added from Productos, with their packs
  products: Record<string, number>;
  // Lines ticked off while shopping: product ids, or "txt:<text>" for the
  // ingredients Mercadona does not sell
  checked: string[];
};

export const EMPTY_BASKET: BasketState = { recipes: {}, products: {}, checked: [] };

type Needs = {
  // Grams per product id and the recipes that ask for it
  grams: Map<string, { grams: number; recipes: Set<string> }>;
  // Ingredients with no product: "Sal y pimienta", the ají paste…
  loose: Map<string, { text: string; recipes: Set<string> }>;
};

// Adds what `servings` servings of a recipe need. The grams of a recipe are
// for all of its servings ("raciones")
function addRecipe(needs: Needs, r: Receta, servings: number) {
  const factor = servings / (r.raciones ?? 1);
  r.ingredientes.forEach((ing) => {
    if (typeof ing !== "string" && ing.producto) {
      const need = needs.grams.get(ing.producto) ?? { grams: 0, recipes: new Set() };
      need.grams += (ing.gramos ?? 0) * factor;
      need.recipes.add(r.nombre);
      needs.grams.set(ing.producto, need);
      return;
    }
    const text = ingText(ing);
    const key = "txt:" + normalize(text);
    const loose = needs.loose.get(key) ?? { text, recipes: new Set() };
    loose.recipes.add(r.nombre);
    needs.loose.set(key, loose);
  });
}

// Every slot of the week is one serving of its recipe
function basketNeeds(plan: Plan, state: BasketState): Needs {
  const needs: Needs = { grams: new Map(), loose: new Map() };
  DIAS.forEach((dia) => {
    Object.values(plan.semana[dia.id] ?? {}).forEach((id) => {
      const r = plan.byId[id];
      if (r) addRecipe(needs, r, 1);
    });
  });
  Object.entries(state.recipes).forEach(([id, servings]) => {
    const r = plan.byId[id];
    if (r) addRecipe(needs, r, servings);
  });
  return needs;
}

// Packs to buy for some grams: by net weight when the product has one in g or
// ml (a millilitre counted as a gram), one pack otherwise
export function packsFor(p: Producto | undefined, grams: number) {
  if (!p?.cantidad_neta || (p.unidad !== "g" && p.unidad !== "ml")) return 1;
  return Math.max(1, Math.ceil(grams / p.cantidad_neta - 0.05));
}

export type BasketLine = {
  id: string;
  producto: Producto | undefined;
  grams: number;
  packs: number;
  recipes: string[];
  cost: number | null;
};

export type LooseLine = { key: string; text: string; recipes: string[] };

// Lines of the list, grouped later by category: one per product
export function basketLines(plan: Plan, state: BasketState, catalog: Catalog) {
  const needs = basketNeeds(plan, state);
  const ids = new Set([...needs.grams.keys(), ...Object.keys(state.products)]);
  const lines: BasketLine[] = [...ids].map((id) => {
    const p = catalog.byId.get(id);
    const need = needs.grams.get(id);
    const packs = (need ? packsFor(p, need.grams) : 0) + (state.products[id] ?? 0);
    return {
      id,
      producto: p,
      grams: need?.grams ?? 0,
      packs,
      recipes: need ? [...need.recipes] : [],
      cost: p ? packs * p.precio_eur : null,
    };
  });
  const loose: LooseLine[] = [...needs.loose.entries()].map(([key, l]) => ({ key, text: l.text, recipes: [...l.recipes] }));
  return { lines, loose };
}

// Products still to buy, for the counter in the header (no catalog needed)
export function pendingCount(plan: Plan, state: BasketState) {
  const needs = basketNeeds(plan, state);
  const ids = new Set([...needs.grams.keys(), ...Object.keys(state.products)]);
  return [...ids].filter((id) => !state.checked.includes(id)).length;
}
