import { fmtDec, fmtEur } from "@/lib/format";
import { cn } from "@/lib/utils";
import { per100 } from "../model/format";
import type { Producto } from "../model/types";
import { ProductPhoto } from "./product-photo";

// Product in a grid: photo (or category drawing), name, price and its kcal and protein
export function ProductTile({
  p,
  compact = false,
  morph = true,
  onOpen,
}: {
  p: Producto;
  // Name and price only: the panel of Inicio and the strip of a product
  compact?: boolean;
  // Grows into the product's panel when opened (off inside a panel, which
  // makes that move itself)
  morph?: boolean;
  onOpen: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(p.id)}
      data-morph={morph || undefined}
      className="group flex w-full min-w-0 cursor-pointer flex-col gap-2 rounded-2xl p-2 text-left transition-all hover:-translate-y-0.5 hover:bg-secondary/70"
    >
      <ProductPhoto
        p={p}
        className={cn("w-full transition-transform group-hover:scale-[1.02]", !compact && "aspect-[4/3] [&_svg]:size-[34%]")}
      />
      <span className={cn("line-clamp-2 font-serif leading-snug", compact ? "text-[0.88rem]" : "text-[0.98rem]")}>
        {p.nombre}
      </span>
      <span className="mt-auto flex flex-wrap items-baseline gap-x-2 text-[0.82rem] text-muted-foreground tabular-nums">
        <span className="font-semibold text-foreground">{fmtEur(p.precio_eur)}</span>
        {!compact && p.kcal_100 != null && (
          <span>
            {fmtDec(p.kcal_100, 0)} kcal · {fmtDec(p.proteinas_100 ?? 0)} g prot. / {per100(p)}
          </span>
        )}
      </span>
    </button>
  );
}
