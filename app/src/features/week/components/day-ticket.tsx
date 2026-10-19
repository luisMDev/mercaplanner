import { ArrowRightIcon, ChefHatIcon } from "lucide-react";
import { CtaButton } from "@/components/cozy/cta-button";
import { DateStub } from "@/components/cozy/date-stub";
import { todayDia } from "@/features/plan/model/days";
import { dayTotals, mealColor } from "@/features/plan/model/meals";
import type { Plan } from "@/features/plan/model/types";
import { navigate } from "@/features/shell/use-route";
import { fmtNum, plural } from "@/lib/format";
import { dateMeals, mainMeal } from "../model/calendar";

// "EL DÍA": the day picked in the calendar as a ticket, with its meals
export function DayTicket({ plan, date, isToday }: { plan: Plan; date: Date; isToday: boolean }) {
  const meals = dateMeals(plan, date);
  const main = mainMeal(meals);
  return (
    <section className="flex flex-col gap-3">
      <p className="caps flex items-center gap-2 font-semibold">
        {isToday ? "Hoy" : "El día"}
      </p>
      <div key={date.toDateString()} className="animate-panel flex rounded-3xl border border-white/70 bg-card p-3 shadow-lift dark:border-white/5">
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
                <li key={m.comida.id} className="flex flex-col border-b border-dashed py-1.5 last:border-b-0">
                  <span className="caps text-[0.58rem] font-semibold" style={{ color: mealColor(m.comida.id) }}>
                    {m.comida.hora} · {m.comida.label}
                  </span>
                  {m.receta ? (
                    <button
                      type="button"
                      onClick={() => navigate({ section: "recetas", id: m.receta!.id })}
                      className="cursor-pointer text-left font-serif text-[1rem] leading-snug hover:text-primary"
                    >
                      {m.receta.nombre}
                    </button>
                  ) : (
                    <span className="font-serif text-warning italic">Receta no encontrada</span>
                  )}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-auto flex flex-wrap items-center gap-3 pt-1">
            {main?.receta && (
              <CtaButton className="h-10 px-5" onClick={() => navigate({ section: "recetas", id: main.receta!.id })}>
                Ver receta <ArrowRightIcon />
              </CtaButton>
            )}
            {isToday && (
              <button
                type="button"
                onClick={() => navigate({ section: "hoy" })}
                className="caps cursor-pointer font-semibold text-primary hover:underline"
              >
                Ir a hoy
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
