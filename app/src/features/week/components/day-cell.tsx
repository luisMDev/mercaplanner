import { CozyMug } from "@/components/cozy/cozy-mug";
import { isLibre, todayDia } from "@/features/plan/model/days";
import { mealColor } from "@/features/plan/model/meals";
import type { Plan } from "@/features/plan/model/types";
import { cn } from "@/lib/utils";
import { dateMeals, mainMeal } from "../model/calendar";
import { DishCluster } from "./dish-cluster";

// One day of the month: its number, the plates of all its meals and the name
// of the main one (dots per meal on a phone, where names do not fit). Days off
// get a warm gold tint, the steaming mug and "Día libre" handwritten (just
// the mug on a phone)
export function DayCell({
  plan,
  date,
  outside,
  today,
  selected,
  onSelect,
}: {
  plan: Plan;
  date: Date;
  // Belongs to the previous or next month
  outside: boolean;
  today: boolean;
  selected: boolean;
  onSelect: (date: Date) => void;
}) {
  const meals = dateMeals(plan, date);
  const main = mainMeal(meals);
  const weekend = date.getDay() === 0 || date.getDay() === 6;
  const libre = isLibre(plan, todayDia(date).id);
  return (
    <button
      type="button"
      onClick={() => onSelect(date)}
      aria-pressed={selected}
      aria-label={date.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
      className={cn(
        "relative flex min-h-16 min-w-0 cursor-pointer flex-col items-center gap-1 border-t border-r border-dashed p-1 text-center transition-colors hover:bg-primary-soft/40 sm:min-h-28 sm:items-start sm:p-2 sm:text-left [&:nth-child(7n)]:border-r-0",
        libre && "bg-linear-to-b from-gold-soft/70 to-gold-soft/20 hover:from-gold-soft hover:to-gold-soft/40",
        selected && "bg-primary-soft/60 from-primary-soft/60 to-primary-soft/60 hover:bg-primary-soft/60",
        outside && "opacity-40",
      )}
    >
      <span
        className={cn(
          "grid size-7 place-items-center rounded-full font-serif text-[1.05rem] tabular-nums sm:size-8 sm:text-[1.15rem]",
          weekend && "text-primary",
          libre && "text-gold",
          today && "ring-2 ring-primary",
        )}
      >
        {date.getDate()}
      </span>
      {libre && (
        <span className="-mt-1 flex w-full flex-col items-center sm:-mt-2 sm:gap-2">
          <CozyMug className="w-5 -rotate-6 sm:w-9" />
          <span className="sr-only sm:not-sr-only sm:font-script sm:text-[1.2rem] sm:leading-none sm:text-gold">
            Día libre
          </span>
        </span>
      )}
      {main?.receta && (
        <span className="hidden w-full flex-col items-center gap-0.5 sm:flex">
          <DishCluster meals={meals} />
          <span
            className={cn(
              "w-full text-center font-serif text-[0.74rem] leading-tight text-muted-foreground",
              meals.length > 1 ? "line-clamp-1" : "line-clamp-2",
            )}
          >
            {main.receta.nombre}
          </span>
        </span>
      )}
      {meals.length > 0 && (
        <span className="flex gap-0.5 sm:hidden" aria-hidden="true">
          {meals.map((m) => (
            <span key={m.comida.id} className="size-1.5 rounded-full" style={{ background: mealColor(m.comida.id) }} />
          ))}
        </span>
      )}
    </button>
  );
}
