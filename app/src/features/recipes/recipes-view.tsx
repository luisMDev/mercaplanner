"use client";

import { useState } from "react";
import type { Plan } from "@/features/plan/model/types";
import { PageLayout } from "@/features/shell/page-layout";
import { navigate } from "@/features/shell/use-route";
import { RecipeCatalog, type RecipeFilters } from "./components/recipe-catalog";
import { RecipeDetail } from "./components/recipe-detail";

/* Recetas: every recipe, and the panel of the open one */
export function RecipesView({ plan, openId }: { plan: Plan; openId?: string }) {
  // Kept here so the search is still there when coming back from a recipe
  const [filters, setFilters] = useState<RecipeFilters>({ query: "", type: null });
  const open = (id: string) => navigate({ section: "recetas", id });
  return (
    <PageLayout title="El recetario" detail={!!openId}>
      {openId ? (
        <RecipeDetail
          plan={plan}
          id={openId}
          onBack={() => navigate({ section: "recetas" })}
          onOpen={open}
          onOpenProduct={(id) => navigate({ section: "productos", id })}
        />
      ) : (
        <RecipeCatalog plan={plan} filters={filters} onFiltersChange={setFilters} onOpen={open} />
      )}
    </PageLayout>
  );
}
