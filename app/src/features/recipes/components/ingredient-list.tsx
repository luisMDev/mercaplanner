import { StoreIcon } from "lucide-react";
import { fmtNum } from "@/lib/format";
import type { Ingredient } from "@/features/plan/model/types";

// One ingredient: its text, the Mercadona product it links to (opens it) and
// the grams for the servings chosen
function IngredientItem({
  ing,
  factor,
  onOpenProduct,
}: {
  ing: Ingredient;
  factor: number;
  onOpenProduct: (id: string) => void;
}) {
  const text = typeof ing === "string" ? ing : ing.texto;
  const linked = typeof ing === "string" ? null : ing;
  return (
    <li className="flex gap-3 border-b border-dashed py-2.5 last:border-b-0">
      <span aria-hidden="true" className="mt-2 size-2 shrink-0 rotate-45 rounded-[2px] bg-green/70" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-serif text-[1.02rem] leading-snug">{text}</span>
        {linked?.producto ? (
          <button
            type="button"
            onClick={() => onOpenProduct(linked.producto!)}
            className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-left text-[0.8rem] font-medium text-primary hover:underline"
          >
            <StoreIcon className="size-3.5 shrink-0" />
            {linked.producto_nombre || "Ver producto"}
          </button>
        ) : linked?.sin_producto ? (
          <span className="text-[0.8rem] text-faint italic">No está en Mercadona</span>
        ) : null}
      </div>
      {linked?.gramos != null && (
        <span className="h-fit shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-[0.8rem] font-medium tabular-nums">
          {fmtNum(linked.gramos * factor)} g
        </span>
      )}
    </li>
  );
}

// Ingredients, with the grams scaled to the servings picked (factor)
export function IngredientList({
  ingredientes,
  factor,
  onOpenProduct,
}: {
  ingredientes: Ingredient[];
  factor: number;
  onOpenProduct: (id: string) => void;
}) {
  return (
    <ul>
      {ingredientes.map((ing, i) => (
        <IngredientItem key={i} ing={ing} factor={factor} onOpenProduct={onOpenProduct} />
      ))}
    </ul>
  );
}
