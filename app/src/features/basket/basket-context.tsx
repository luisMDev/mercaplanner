"use client";

import { createContext, use, useEffect, useState, type ReactNode } from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import { EMPTY_BASKET, type BasketState } from "./model/basket";

const BASKET_KEY = "dieta-cesta";

function loadBasket(): BasketState {
  try {
    const saved = JSON.parse(readStorage(BASKET_KEY) ?? "null") as Partial<BasketState> | null;
    return { ...EMPTY_BASKET, ...saved };
  } catch {
    return EMPTY_BASKET;
  }
}

function useBasketState() {
  const [state, setState] = useState<BasketState>(loadBasket);

  useEffect(() => writeStorage(BASKET_KEY, JSON.stringify(state)), [state]);

  return {
    state,
    addRecipe: (id: string, servings: number) =>
      setState((s) => ({ ...s, recipes: { ...s.recipes, [id]: (s.recipes[id] ?? 0) + servings } })),
    removeRecipe: (id: string) =>
      setState((s) => ({ ...s, recipes: Object.fromEntries(Object.entries(s.recipes).filter(([k]) => k !== id)) })),
    addProduct: (id: string, packs: number) =>
      setState((s) => ({
        ...s,
        products: { ...s.products, [id]: (s.products[id] ?? 0) + packs },
        checked: s.checked.filter((k) => k !== id),
      })),
    removeProduct: (id: string) =>
      setState((s) => ({ ...s, products: Object.fromEntries(Object.entries(s.products).filter(([k]) => k !== id)) })),
    toggle: (key: string) =>
      setState((s) => ({
        ...s,
        checked: s.checked.includes(key) ? s.checked.filter((k) => k !== key) : [...s.checked, key],
      })),
    // A new week: nothing ticked and nothing added by hand
    reset: () => setState(EMPTY_BASKET),
  };
}

type Basket = ReturnType<typeof useBasketState>;

const BasketContext = createContext<Basket | null>(null);

export function BasketProvider({ children }: { children: ReactNode }) {
  return <BasketContext value={useBasketState()}>{children}</BasketContext>;
}

export function useBasket() {
  const basket = use(BasketContext);
  if (!basket) throw new Error("useBasket needs a <BasketProvider>");
  return basket;
}
