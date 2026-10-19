import { ArrowRightIcon, ChefHatIcon } from "lucide-react";
import { Panel, PanelAction, PanelHeader } from "@/components/cozy/panel";
import type { Plan } from "@/features/plan/model/types";
import { RecipeCard } from "@/features/recipes/components/recipe-card";
import { navigate } from "@/features/shell/use-route";
import { cn } from "@/lib/utils";

// "LAS RECETAS": up to four recipes; one opens its panel in Recetas
export function RecipesPanel({ plan }: { plan: Plan }) {
  const shown = plan.recetas.slice(0, 4);
  return (
    <Panel className="p-4 sm:p-5">
      <PanelHeader
        icon={<ChefHatIcon className="size-4 text-green" />}
        title="Las recetas"
        action={
          <PanelAction onClick={() => navigate({ section: "recetas" })}>
            Ver todas <ArrowRightIcon />
          </PanelAction>
        }
      />
      <div className={cn("grid grid-cols-2 gap-1", shown.length > 2 && "@md:grid-cols-4")}>
        {shown.map((r) => (
          <RecipeCard key={r.id} plan={plan} receta={r} compact onOpen={(id) => navigate({ section: "recetas", id })} />
        ))}
      </div>
    </Panel>
  );
}
