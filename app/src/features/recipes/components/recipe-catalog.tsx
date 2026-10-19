import { Panel, PanelHeader } from "@/components/cozy/panel";
import { CountText, EmptyText } from "@/components/shared/muted-text";
import { SearchField } from "@/components/shared/search-field";
import { searchRecipes } from "@/features/plan/model/recipes";
import type { Plan } from "@/features/plan/model/types";
import { plural } from "@/lib/format";
import { MealChips } from "./meal-chips";
import { RecipeCard } from "./recipe-card";

export type RecipeFilters = { query: string; type: string | null };

// Every recipe, with a search by name or ingredient and the meal type chips
export function RecipeCatalog({
  plan,
  filters,
  onFiltersChange,
  onOpen,
}: {
  plan: Plan;
  filters: RecipeFilters;
  onFiltersChange: (filters: RecipeFilters) => void;
  onOpen: (id: string) => void;
}) {
  const list = searchRecipes(plan, filters.query).filter((r) => !filters.type || r.tipos.includes(filters.type));
  return (
    <Panel className="animate-panel flex flex-col gap-4">
      <PanelHeader title="Todas las recetas" className="mb-0" />
      <SearchField
        value={filters.query}
        onChange={(query) => onFiltersChange({ ...filters, query })}
        placeholder="Buscar receta o ingrediente"
      />
      <MealChips plan={plan} value={filters.type} onChange={(type) => onFiltersChange({ ...filters, type })} />
      <CountText>{plural(list.length, "receta", "recetas")}</CountText>
      {list.length ? (
        <div className="grid grid-cols-2 gap-x-2 gap-y-4 @2xl:grid-cols-3 @5xl:grid-cols-4">
          {list.map((r) => (
            <RecipeCard key={r.id} plan={plan} receta={r} onOpen={onOpen} />
          ))}
        </div>
      ) : (
        <EmptyText>Ninguna receta coincide con la búsqueda.</EmptyText>
      )}
    </Panel>
  );
}
