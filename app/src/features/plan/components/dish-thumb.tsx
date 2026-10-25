import { UtensilsCrossedIcon } from "lucide-react";
import Image from "next/image";
import { recipeImage } from "@/features/plan/model/recipe-images";
import type { Receta } from "@/features/plan/model/types";
import { cn } from "@/lib/utils";

// Small square with a recipe's watercolour, or an empty dashed square with a
// fork and knife when it has none (or the recipe is missing)
export function DishThumb({ receta, className }: { receta: Receta | null; className?: string }) {
  const image = receta && recipeImage(receta);
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl",
        image ? "bg-card/70 shadow-card" : "border border-dashed border-faint/60 bg-muted/50 text-faint",
        className,
      )}
    >
      {image ? (
        <Image src={image} alt="" sizes="56px" className="size-full object-contain p-0.5" />
      ) : (
        <UtensilsCrossedIcon className="size-5" strokeWidth={1.5} />
      )}
    </span>
  );
}
