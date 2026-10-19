"use client";

import { useEffect, useState } from "react";
import { Dot } from "@/components/shared/meta-list";
import { CountText, EmptyText } from "@/components/shared/muted-text";
import { SearchField } from "@/components/shared/search-field";
import { Timeline } from "@/components/shared/timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { groupRecipes, searchRecipes } from "@/features/plan/model/recipes";
import type { Plan } from "@/features/plan/model/types";
import { plural } from "@/lib/format";
import { RecipeItem, recipeAnchor } from "./recipe-item";

// Recipe opened from a meal in Hoy or Semana: a new object on every click, so
// opening the same one again scrolls to it again
export type RecipeTarget = { id: string };

/* Recetas: every recipe, grouped by its first meal type, with a search */
export function RecipesView({
  plan,
  target,
  onOpenProduct,
}: {
  plan: Plan;
  target: RecipeTarget | null;
  onOpenProduct: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const searching = query.trim() !== "";
  const list = searchRecipes(plan, query);
  const groups = groupRecipes(plan, list);

  // Opened from a meal: scroll its card into view once it is rendered
  useEffect(() => {
    if (!target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document
      .getElementById(recipeAnchor(target.id))
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [target]);

  return (
    <div className="flex flex-col gap-3">
      <SearchField value={query} onChange={setQuery} placeholder="Buscar receta o ingrediente" />
      {searching && <CountText>{plural(list.length, "receta", "recetas")}</CountText>}
      {groups.length ? (
        groups.map((g) => (
          // overflow-clip, not the card's overflow-hidden: a hidden overflow is
          // a scroll container, and scrollIntoView would scroll the card itself
          <Card key={g.id} className="gap-3 overflow-clip shadow-card">
            <CardHeader className="flex flex-wrap items-baseline gap-1.5">
              <CardTitle className="font-semibold">{g.label}</CardTitle>
              <Dot />
              <span className="text-[0.82rem] text-muted-foreground">{plural(g.recetas.length, "receta", "recetas")}</span>
            </CardHeader>
            <CardContent>
              <Timeline>
                {g.recetas.map((r) => (
                  <RecipeItem
                    key={r.id}
                    plan={plan}
                    receta={r}
                    isTarget={target?.id === r.id}
                    expanded={searching}
                    onOpenProduct={onOpenProduct}
                  />
                ))}
              </Timeline>
            </CardContent>
          </Card>
        ))
      ) : (
        <EmptyText>Ninguna receta coincide con la búsqueda.</EmptyText>
      )}
    </div>
  );
}
