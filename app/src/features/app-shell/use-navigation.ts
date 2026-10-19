import { useState } from "react";
import type { RecipeTarget } from "@/features/recipes/recipes-view";
import { loadView, saveView, type View } from "./views";

// Open tab, plus what a link from another tab points at: the recipe of a meal
// (Recetas scrolls to it) or the product of an ingredient (Productos shows it)
export function useNavigation() {
  const [view, setView] = useState<View>(loadView);
  const [recipeTarget, setRecipeTarget] = useState<RecipeTarget | null>(null);
  const [productTarget, setProductTarget] = useState<string | null>(null);

  function go(v: View) {
    setView(v);
    saveView(v);
  }

  function selectView(v: View) {
    if (v !== "recetas") setRecipeTarget(null);
    setProductTarget(null);
    go(v);
  }

  function openRecipe(id: string) {
    setRecipeTarget({ id });
    go("recetas");
  }

  function openProduct(id: string) {
    setProductTarget(id);
    go("productos");
    window.scrollTo({ top: 0 });
  }

  return {
    view,
    recipeTarget,
    productTarget,
    selectView,
    openRecipe,
    openProduct,
    clearProductTarget: () => setProductTarget(null),
  };
}
