import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { DishArt } from "@/features/plan/components/dish-art";
import { mealColor } from "@/features/plan/model/meals";
import { recipeFacts } from "@/features/plan/model/recipes";
import type { Meal } from "@/features/plan/model/types";
import { cn } from "@/lib/utils";

// One meal of the day in the timeline: hour and dot on the left (in the card
// on a phone), a card with its plate and recipe on the right. Past meals are ticked, the next one says so
export function MealRow({
  meal: m,
  past,
  next,
  onOpen,
}: {
  meal: Meal;
  past: boolean;
  next: boolean;
  onOpen: (id: string) => void;
}) {
  const r = m.receta;
  const color = mealColor(m.comida.id);
  return (
    <li className="group/meal relative grid gap-3 sm:grid-cols-[4rem_minmax(0,1fr)]">
      <div className="relative hidden flex-col items-center pt-4 sm:flex">
        <span className="text-[0.95rem] font-semibold tabular-nums">{m.comida.hora ?? ""}</span>
        <span
          aria-hidden="true"
          className={cn("mt-2 size-3.5 rounded-full border-2 bg-card", past && "bg-current")}
          style={{ color, borderColor: color }}
        />
        <span aria-hidden="true" className="w-0.5 flex-1 bg-border group-last/meal:hidden" />
      </div>
      <button
        data-morph
        type="button"
        disabled={!r}
        onClick={() => r && onOpen(r.id)}
        className={cn(
          "mb-3 flex min-w-0 cursor-pointer items-center gap-3 rounded-2xl border border-transparent bg-secondary/60 p-2.5 pr-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary-soft/40 disabled:cursor-default",
          next && "border-primary/30 bg-primary-soft/50",
          past && "opacity-70",
        )}
      >
        <span className="grid h-14 w-16 shrink-0 place-items-center rounded-xl bg-card px-1 sm:h-20 sm:w-24 sm:px-1.5">
          {r && <DishArt receta={r} />}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="caps flex flex-wrap items-center gap-x-2 text-[0.62rem] font-semibold" style={{ color }}>
            <span className="text-foreground sm:hidden">{m.comida.hora}</span>
            {m.comida.label}
            {next && <span className="rounded-full bg-primary px-2 py-px text-[0.56rem] text-primary-foreground">Lo siguiente</span>}
          </span>
          {r ? (
            <>
              <span className="font-serif text-[1.08rem] leading-snug">{r.nombre}</span>
              <span className="text-[0.82rem] text-muted-foreground tabular-nums">{recipeFacts(r)}</span>
            </>
          ) : (
            <span className="font-serif text-warning italic">Receta no encontrada: {m.recetaId}</span>
          )}
        </span>
        {past ? (
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-green text-white">
            <CheckIcon className="size-4" />
          </span>
        ) : (
          <ChevronRightIcon className="size-5 shrink-0 text-faint" />
        )}
      </button>
    </li>
  );
}
