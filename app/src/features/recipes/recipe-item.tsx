import { ChevronDownIcon } from "lucide-react";
import { Fragment } from "react";
import { Dot } from "@/components/shared/meta-list";
import {
  TimelineInfo,
  TimelineItem,
  TimelineKind,
  TimelineTitle,
  TimelineWhen,
} from "@/components/shared/timeline";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { RecipeBox } from "@/features/plan/components/recipe-box";
import { mealColor } from "@/features/plan/model/meals";
import { comidaLabel, macrosText, recipeFacts, recipeUses } from "@/features/plan/model/recipes";
import type { Plan, Receta } from "@/features/plan/model/types";
import { cn } from "@/lib/utils";

export function recipeAnchor(id: string) {
  return "receta-" + id;
}

export function RecipeItem({
  plan,
  receta: r,
  isTarget,
  expanded,
  onOpenProduct,
}: {
  plan: Plan;
  receta: Receta;
  // Opened from a meal in Hoy or Semana: flashes once and opens its details
  isTarget: boolean;
  // A search is on: details open so the matching ingredient shows
  expanded: boolean;
  onOpenProduct: (id: string) => void;
}) {
  const uses = recipeUses(plan, r.id);
  const macros = macrosText(r.macros);
  return (
    <TimelineItem
      id={recipeAnchor(r.id)}
      color={mealColor(r.tipos[0])}
      className={cn("scroll-mt-30", isTarget && "animate-target rounded-lg")}
    >
      <TimelineWhen>
        {r.tipos.map((t, i) => (
          <Fragment key={t}>
            {i > 0 && <Dot />}
            <TimelineKind>{comidaLabel(plan, t)}</TimelineKind>
          </Fragment>
        ))}
      </TimelineWhen>
      <TimelineTitle>{r.nombre}</TimelineTitle>
      <TimelineInfo>
        {r.descripcion && <li>{r.descripcion}</li>}
        <li className="tabular-nums">{recipeFacts(r)}</li>
        {macros && <li className="tabular-nums">{macros}</li>}
        <li>{uses.length ? "En el plan: " + uses.join(", ") : "No está en el plan de la semana"}</li>
      </TimelineInfo>
      {/* key: re-mount when it becomes the target or a search starts, so it
          opens even if it was closed by hand */}
      <Collapsible
        key={isTarget ? "target" : expanded ? "search" : "idle"}
        defaultOpen={isTarget || expanded}
        className="mt-1.5"
      >
        <CollapsibleTrigger className="group/details inline-flex cursor-pointer items-center gap-1 text-[0.8rem] font-semibold text-primary hover:text-primary-strong">
          Ingredientes y preparación
          <ChevronDownIcon className="size-3.5 transition-transform group-data-[state=open]/details:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <RecipeBox receta={r} onOpenProduct={onOpenProduct} />
        </CollapsibleContent>
      </Collapsible>
    </TimelineItem>
  );
}
