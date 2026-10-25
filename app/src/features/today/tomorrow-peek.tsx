import { ArrowRightIcon, SunriseIcon } from "lucide-react";
import { Panel, PanelAction, PanelHeader } from "@/components/cozy/panel";
import { FreeDayTag } from "@/features/plan/components/free-day-tag";
import { isLibre, todayDia } from "@/features/plan/model/days";
import { dayMeals, mealColor } from "@/features/plan/model/meals";
import type { Plan } from "@/features/plan/model/types";
import { navigate } from "@/features/shell/use-route";

// "MAÑANA · LUNES": tomorrow's meals in one line each, to plan ahead
export function TomorrowPeek({ plan, now }: { plan: Plan; now: Date }) {
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const dia = todayDia(tomorrow);
  const meals = dayMeals(plan, dia.id);
  return (
    <Panel className="p-5">
      <PanelHeader
        icon={<SunriseIcon className="size-4 text-gold" />}
        title={"Mañana · " + dia.label}
        action={
          <PanelAction onClick={() => navigate({ section: "semana" })}>
            Semana <ArrowRightIcon />
          </PanelAction>
        }
        className="mb-2"
      />
      {meals.length ? (
        <ul className="flex flex-col">
          {meals.map((m) => (
            <li key={m.comida.id} className="flex items-baseline gap-3 border-b border-dashed py-2 last:border-b-0">
              <span className="w-12 shrink-0 text-[0.85rem] font-semibold tabular-nums">{m.comida.hora}</span>
              <span className="caps w-24 shrink-0 text-[0.6rem] font-semibold" style={{ color: mealColor(m.comida.id) }}>
                {m.comida.label}
              </span>
              {m.receta ? (
                <button
                  type="button"
                  onClick={() => navigate({ section: "recetas", id: m.receta!.id })}
                  className="min-w-0 cursor-pointer truncate text-left font-serif hover:text-primary"
                >
                  {m.receta.nombre}
                </button>
              ) : (
                <span className="font-serif text-warning italic">Receta no encontrada</span>
              )}
            </li>
          ))}
        </ul>
      ) : isLibre(plan, dia.id) ? (
        <p className="flex flex-wrap items-center gap-3 font-serif text-muted-foreground italic">
          <FreeDayTag /> Mañana no hay plan.
        </p>
      ) : (
        <p className="font-serif text-muted-foreground italic">Mañana no hay comidas en el plan.</p>
      )}
    </Panel>
  );
}
