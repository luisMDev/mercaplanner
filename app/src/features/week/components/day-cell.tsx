import { DishArt } from "@/features/plan/components/dish-art";
import { mealColor } from "@/features/plan/model/meals";
import type { Plan } from "@/features/plan/model/types";
import { cn } from "@/lib/utils";
import { dateMeals, mainMeal } from "../model/calendar";

// One day of the month: its number, the plate of its main meal and the
// recipe's name (dots per meal on a phone, where names do not fit)
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
  return (
    <button
      type="button"
      onClick={() => onSelect(date)}
      aria-pressed={selected}
      aria-label={date.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
      className={cn(
        "relative flex min-h-16 min-w-0 cursor-pointer flex-col items-center gap-1 border-t border-r border-dashed p-1 text-center transition-colors hover:bg-primary-soft/40 sm:min-h-28 sm:items-start sm:p-2 sm:text-left [&:nth-child(7n)]:border-r-0",
        selected && "bg-primary-soft/60 hover:bg-primary-soft/60",
        outside && "opacity-40",
      )}
    >
      <span
        className={cn(
          "grid size-7 place-items-center rounded-full font-serif text-[1.05rem] tabular-nums sm:size-8 sm:text-[1.15rem]",
          weekend && "text-primary",
          today && "ring-2 ring-primary",
        )}
      >
        {date.getDate()}
      </span>
      {main?.receta && (
        <span className="hidden w-full flex-col items-center gap-0.5 sm:flex">
          <DishArt receta={main.receta} className="w-14" />
          <span className="line-clamp-2 w-full text-center font-serif text-[0.74rem] leading-tight text-muted-foreground">
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
