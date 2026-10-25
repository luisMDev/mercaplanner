import { DishArt } from "@/features/plan/components/dish-art";
import type { Meal } from "@/features/plan/model/types";
import { cn } from "@/lib/utils";
import { dishRows, isMainMeal } from "../model/calendar";

// The plates of a day in a calendar cell, all of them: one big when it is the
// only meal; with more, lunch and dinner a bit bigger than breakfast and
// snacks, side by side, as a pyramid or as a square (dishRows)
export function DishCluster({ meals }: { meals: Meal[] }) {
  const alone = meals.length === 1;
  return (
    <span className="flex w-full flex-col items-center -space-y-1.5">
      {dishRows(meals).map((row) => (
        <span key={row.map((m) => m.comida.id).join()} className="flex items-end justify-center">
          {row.map((m) =>
            m.receta ? (
              <DishArt
                key={m.comida.id}
                receta={m.receta}
                className={cn("shrink-0", alone ? "w-14" : isMainMeal(m) ? "w-11" : "w-8")}
              />
            ) : null,
          )}
        </span>
      ))}
    </span>
  );
}
