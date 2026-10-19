import { Dot } from "@/components/shared/meta-list";
import {
  Timeline,
  TimelineInfo,
  TimelineItem,
  TimelineKind,
  TimelineTitle,
  TimelineWhen,
} from "@/components/shared/timeline";
import { mealColor } from "../model/meals";
import { macrosText, recipeFacts } from "../model/recipes";
import type { Meal } from "../model/types";
import { RecipeBox } from "./recipe-box";
import { RecipeLink } from "./recipe-link";

type MealProps = {
  onOpenRecipe: (id: string) => void;
  // Given in Hoy: adds macros, ingredients and steps. The Semana cards keep the
  // name and the facts line
  onOpenProduct?: (id: string) => void;
};

function MealItem({ meal: m, past, onOpenRecipe, onOpenProduct }: MealProps & { meal: Meal; past: boolean }) {
  const r = m.receta;
  const macros = r && onOpenProduct ? macrosText(r.macros) : null;
  return (
    <TimelineItem color={mealColor(m.comida.id)} done={past}>
      <TimelineWhen>
        {m.comida.hora && (
          <>
            <span className="text-[0.8rem] font-bold text-foreground tabular-nums">{m.comida.hora}</span>
            <Dot />
          </>
        )}
        <TimelineKind>{m.comida.label}</TimelineKind>
      </TimelineWhen>
      <TimelineTitle>
        {r ? (
          <RecipeLink onClick={() => onOpenRecipe(r.id)}>{r.nombre}</RecipeLink>
        ) : (
          <span className="font-medium text-warning italic">Receta no encontrada: {m.recetaId}</span>
        )}
      </TimelineTitle>
      {r && (
        <TimelineInfo className="tabular-nums">
          <li>{recipeFacts(r)}</li>
          {macros && <li>{macros}</li>}
        </TimelineInfo>
      )}
      {r && onOpenProduct && <RecipeBox receta={r} onOpenProduct={onOpenProduct} />}
    </TimelineItem>
  );
}

// The meals of one day of "semana"; the first pastUntil get the dot filled
export function DayTimeline({ meals, pastUntil = 0, ...props }: MealProps & { meals: Meal[]; pastUntil?: number }) {
  return (
    <Timeline>
      {meals.map((m, i) => (
        <MealItem key={m.comida.id} meal={m} past={i < pastUntil} {...props} />
      ))}
    </Timeline>
  );
}
