import { useState } from "react";
import { BackLink } from "@/components/cozy/back-link";
import { Panel, PanelHeader } from "@/components/cozy/panel";
import { EmptyText } from "@/components/shared/muted-text";
import { DishArt } from "@/features/plan/components/dish-art";
import { DATA_FILE } from "@/features/plan/model/plan-file";
import type { Plan, Receta } from "@/features/plan/model/types";
import { IngredientList } from "./ingredient-list";
import { RecipeStrip } from "./recipe-strip";
import { RecipeSummary } from "./recipe-summary";
import { StepsList } from "./steps-list";

type DetailProps = {
  plan: Plan;
  onBack: () => void;
  onOpen: (id: string) => void;
  onOpenProduct: (id: string) => void;
};

function RecipePanel({ plan, receta: r, onBack, onOpen, onOpenProduct }: DetailProps & { receta: Receta }) {
  const [servings, setServings] = useState(r.raciones ?? 1);
  const factor = servings / (r.raciones ?? 1);
  return (
    <Panel className="animate-panel bg-linear-to-br from-card via-card to-primary-soft/40 p-5 sm:p-8">
      <BackLink onClick={onBack} className="mb-2 @3xl:hidden">
        Todas las recetas
      </BackLink>
      <div className="grid gap-4 @3xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] @3xl:items-center @3xl:gap-10">
        <div className="flex flex-col items-center gap-2">
          <DishArt receta={r} sides className="max-w-[260px] animate-float drop-shadow-md @3xl:max-w-[440px]" />
          <p className="font-script text-2xl text-muted-foreground @max-3xl:hidden">hecho en casa, con cariño</p>
        </div>
        <RecipeSummary plan={plan} receta={r} servings={servings} onServingsChange={setServings} onBack={onBack} />
      </div>
      <div className="mt-8 grid gap-8 border-t border-dashed pt-6 @3xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        {r.ingredientes.length > 0 && (
          <section>
            <PanelHeader title={`Ingredientes · ${servings} ${servings === 1 ? "ración" : "raciones"}`} />
            <IngredientList ingredientes={r.ingredientes} factor={factor} onOpenProduct={onOpenProduct} />
          </section>
        )}
        <section className="flex flex-col gap-6">
          {r.pasos.length > 0 && (
            <div>
              <PanelHeader title="Preparación" />
              <StepsList pasos={r.pasos} />
            </div>
          )}
          {r.notas && (
            <aside className="-rotate-[0.6deg] rounded-2xl bg-gold-soft px-5 py-4 shadow-card">
              <p className="caps mb-1 font-semibold text-warning">Notas</p>
              <p className="font-serif text-[1rem] leading-relaxed">{r.notas}</p>
            </aside>
          )}
        </section>
      </div>
      {plan.recetas.length > 1 && (
        <div className="mt-8 flex flex-col gap-3 border-t border-dashed pt-5">
          <p className="text-center font-script text-xl text-muted-foreground">‹ otras recetas del recetario ›</p>
          <RecipeStrip recetas={plan.recetas} activeId={r.id} onOpen={onOpen} />
        </div>
      )}
    </Panel>
  );
}

// Recipe opened from a card, a meal or the calendar
export function RecipeDetail({ id, ...props }: DetailProps & { id: string }) {
  const r = props.plan.byId[id];
  if (!r) {
    return (
      <Panel className="animate-panel flex flex-col items-start gap-3">
        <BackLink onClick={props.onBack}>Todas las recetas</BackLink>
        <EmptyText>
          No hay ninguna receta «{id}» en {DATA_FILE}.
        </EmptyText>
      </Panel>
    );
  }
  // key: a new recipe starts with its own servings
  return <RecipePanel key={r.id} receta={r} {...props} />;
}
