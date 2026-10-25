import { ChefHatIcon } from "lucide-react";
import { DateStub } from "@/components/cozy/date-stub";
import { DishThumb } from "@/features/plan/components/dish-thumb";
import { FreeDayCard } from "@/features/plan/components/free-day-card";
import { isLibre, todayDia } from "@/features/plan/model/days";
import { dayTotals, mealColor } from "@/features/plan/model/meals";
import type { Meal, Plan } from "@/features/plan/model/types";
import { navigate } from "@/features/shell/use-route";
import { fmtNum, plural } from "@/lib/format";
import { cn } from "@/lib/utils";
import { dateMeals } from "../model/calendar";

// One meal of the day: its dish, time and recipe. The whole line opens the
// recipe
function MealLine({ meal: m }: { meal: Meal }) {
  const body = (
    <>
      <DishThumb receta={m.receta} />
      <span className="flex min-w-0 flex-col">
        <span className="caps text-[0.58rem] font-semibold" style={{ color: mealColor(m.comida.id) }}>
          {m.comida.hora} · {m.comida.label}
        </span>
        {m.receta ? (
          <span className="font-serif text-[1rem] leading-snug transition-colors group-hover:text-primary">
            {m.receta.nombre}
          </span>
        ) : (
          <span className="font-serif text-warning italic">Receta no encontrada</span>
        )}
      </span>
    </>
  );
  const line = "-mx-2 flex w-[calc(100%+1rem)] items-center gap-3 rounded-2xl px-2 py-1 text-left";
  if (!m.receta) return <div className={line}>{body}</div>;
  const id = m.receta.id;
  return (
    <button
      type="button"
      onClick={() => navigate({ section: "recetas", id })}
      className={cn(line, "group cursor-pointer transition-colors hover:bg-primary-soft/50")}
    >
      {body}
    </button>
  );
}

// "EL DÍA": the day picked in the calendar as a ticket, with its meals and
// their dishes (a
// day off, as its cozy card)
export function DayTicket({ plan, date, isToday }: { plan: Plan; date: Date; isToday: boolean }) {
  const meals = dateMeals(plan, date);
  const libre = isLibre(plan, todayDia(date).id);
  return (
    <section className="flex flex-col gap-3 [.vt_&]:[view-transition-name:panel-side]">
      <p className="caps flex items-center gap-2 font-semibold">
        {isToday ? "Hoy" : "El día"}
      </p>
      {libre ? (
        <FreeDayCard key={date.toDateString()} date={date} isToday={isToday} className="animate-panel" />
      ) : (
        <div key={date.toDateString()} className="animate-panel flex rounded-3xl border border-white/70 glass p-3 shadow-lift dark:border-white/5">
          <DateStub date={date} />
          <div className="flex min-w-0 flex-1 flex-col gap-3 py-2 pr-2 pl-4">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-display text-[1.9rem] leading-none font-semibold text-primary italic">{todayDia(date).label}</h2>
              <ChefHatIcon className="size-7 shrink-0 text-gold" strokeWidth={1.5} />
            </div>
            <p className="caps text-[0.64rem] text-muted-foreground">
              {meals.length
                ? `${plural(meals.length, "comida", "comidas")} · ${fmtNum(dayTotals(meals).kcal)} kcal`
                : "Sin comidas en el plan"}
            </p>
            {meals.length > 0 && (
              <ul className="flex flex-col">
                {meals.map((m) => (
                  <li key={m.comida.id} className="border-b border-dashed py-1 last:border-b-0">
                    <MealLine meal={m} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
