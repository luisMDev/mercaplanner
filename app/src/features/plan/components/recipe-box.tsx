import type { ReactNode } from "react";
import type { Ingredient, Receta } from "../model/types";
import { RecipeLink } from "./recipe-link";

// One ingredient line; a linked product opens its card in Productos
function IngredientItem({ ing, onOpenProduct }: { ing: Ingredient; onOpenProduct: (id: string) => void }) {
  if (typeof ing === "string") return <li>– {ing}</li>;
  const producto = ing.producto;
  return (
    <li>
      – {ing.texto}
      {producto ? (
        <div className="mb-1 ml-3 text-[0.8rem]">
          <RecipeLink
            className="font-medium text-primary decoration-current hover:text-primary-strong"
            onClick={() => onOpenProduct(producto)}
          >
            {ing.producto_nombre || "Ver producto"}
          </RecipeLink>
        </div>
      ) : ing.sin_producto ? (
        <div className="mb-1 ml-3 text-[0.8rem] text-faint italic">No está en Mercadona</div>
      ) : null}
    </li>
  );
}

function BoxLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mt-1 text-[0.66rem] font-bold tracking-[0.08em] text-faint uppercase first:mt-0">{children}</div>
  );
}

// Ingredients, steps and notes in the grey box under a recipe
export function RecipeBox({ receta: r, onOpenProduct }: { receta: Receta; onOpenProduct: (id: string) => void }) {
  return (
    <div className="mt-2 flex flex-col gap-0.5 rounded-lg bg-muted px-3 py-2 text-[0.84rem] text-muted-foreground">
      {r.ingredientes.length > 0 && (
        <>
          <BoxLabel>Ingredientes</BoxLabel>
          <ul>
            {r.ingredientes.map((ing, i) => (
              <IngredientItem key={i} ing={ing} onOpenProduct={onOpenProduct} />
            ))}
          </ul>
        </>
      )}
      {r.pasos.length > 0 && (
        <>
          <BoxLabel>Preparación</BoxLabel>
          <ol className="flex list-decimal flex-col gap-0.5 pl-[18px]">
            {r.pasos.map((paso, i) => (
              <li key={i}>{paso}</li>
            ))}
          </ol>
        </>
      )}
      {r.notas && (
        <>
          <BoxLabel>Notas</BoxLabel>
          <p>{r.notas}</p>
        </>
      )}
    </div>
  );
}
