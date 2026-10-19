import { DishArt } from "@/features/plan/components/dish-art";
import { mealColor } from "@/features/plan/model/meals";
import { comidaLabel } from "@/features/plan/model/recipes";
import type { Plan, Receta } from "@/features/plan/model/types";
import { fmtNum } from "@/lib/format";
import { cn } from "@/lib/utils";

// Recipe in a grid: its plate on a beige tile, name and kcal. The full card
// adds its meal type and time
export function RecipeCard({
  plan,
  receta: r,
  compact = false,
  onOpen,
}: {
  plan: Plan;
  receta: Receta;
  compact?: boolean;
  onOpen: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(r.id)}
      // Grows into the recipe's panel when opened
      data-morph
      className="group flex min-w-0 cursor-pointer flex-col gap-2 rounded-2xl p-2 text-left transition-all hover:-translate-y-0.5 hover:bg-secondary/60"
    >
      <span className="grid aspect-[4/3] place-items-center rounded-2xl bg-secondary px-3 transition-colors group-hover:bg-primary-soft/70">
        <DishArt receta={r} className="transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-2" />
      </span>
      {!compact && r.tipos[0] && (
        <span className="caps text-[0.62rem] font-semibold" style={{ color: mealColor(r.tipos[0]) }}>
          {r.tipos.map((t) => comidaLabel(plan, t)).join(" · ")}
        </span>
      )}
      <span className={cn("line-clamp-2 font-serif leading-snug", compact ? "text-center text-[0.95rem]" : "text-[1.08rem]")}>
        {r.nombre}
      </span>
      <span
        className={cn(
          "mt-auto text-[0.84rem] tracking-[0.06em] text-muted-foreground tabular-nums",
          compact && "text-center",
        )}
      >
        {r.kcal != null && <span className="font-semibold text-foreground">{fmtNum(r.kcal)} kcal</span>}
        {!compact && r.minutos != null && <> · {r.minutos} min</>}
      </span>
    </button>
  );
}
