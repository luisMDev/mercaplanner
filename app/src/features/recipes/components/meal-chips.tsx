import { mealColor } from "@/features/plan/model/meals";
import type { Plan } from "@/features/plan/model/types";
import { cn } from "@/lib/utils";

// "Todas · Desayuno · Comida · Cena…": filter the recipes by meal type. Only
// the types some recipe has
export function MealChips({
  plan,
  value,
  onChange,
}: {
  plan: Plan;
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  const types = plan.comidas.filter((c) => plan.recetas.some((r) => r.tipos.includes(c.id)));
  const chip = (id: string | null, label: string) => (
    <button
      key={id ?? "todas"}
      type="button"
      aria-pressed={value === id}
      onClick={() => onChange(id)}
      className={cn(
        "inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full border bg-background/60 px-4 text-[0.85rem] font-medium transition-colors hover:border-primary/40",
        value === id && "border-primary bg-primary text-primary-foreground hover:border-primary",
      )}
    >
      {id && <span className="size-2 rounded-full" style={{ background: value === id ? "currentColor" : mealColor(id) }} />}
      {label}
    </button>
  );
  return (
    <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
      {chip(null, "Todas")}
      {types.map((c) => chip(c.id, c.label))}
    </div>
  );
}
