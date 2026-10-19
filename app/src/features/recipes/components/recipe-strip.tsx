import { DishArt } from "@/features/plan/components/dish-art";
import type { Receta } from "@/features/plan/model/types";
import { cn } from "@/lib/utils";

// Row of little plates at the bottom of a recipe, to jump to another one
export function RecipeStrip({
  recetas,
  activeId,
  onOpen,
}: {
  recetas: Receta[];
  activeId: string;
  onOpen: (id: string) => void;
}) {
  return (
    <div className="no-scrollbar -mx-1 flex snap-x gap-3 overflow-x-auto px-1 py-1 @3xl:justify-center">
      {recetas.map((r) => (
        <button
          key={r.id}
          type="button"
          title={r.nombre}
          aria-label={r.nombre}
          aria-current={r.id === activeId || undefined}
          onClick={() => onOpen(r.id)}
          className={cn(
            "grid h-20 w-24 shrink-0 cursor-pointer snap-start place-items-center rounded-2xl border-2 border-transparent bg-secondary px-2 transition-all hover:-translate-y-0.5 hover:bg-primary-soft/70",
            r.id === activeId && "border-primary bg-primary-soft/60",
          )}
        >
          <DishArt receta={r} />
        </button>
      ))}
    </div>
  );
}
