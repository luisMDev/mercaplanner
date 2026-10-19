import { XIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { fmtDec, fmtEur } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Producto } from "@/features/products/model/types";
import type { BasketLine } from "../model/basket";

// "1,4 kg", "210 g"
function fmtGrams(g: number) {
  return g >= 1000 ? fmtDec(g / 1000, 1) + " kg" : fmtDec(g, 0) + " g";
}

// "tarro", "pack de 6"
function packName(p: Producto | undefined) {
  return p?.envase?.toLowerCase() ?? (p?.unidades_pack ? "pack de " + p.unidades_pack : "envase");
}

const CHECK_CLASS = "size-6 rounded-full border-2 border-input data-checked:border-green data-checked:bg-green";

// A product to buy: tick it, open it, or drop it if it was added by hand
export function BasketRow({
  line,
  checked,
  manual,
  onToggle,
  onOpen,
  onRemove,
}: {
  line: BasketLine;
  checked: boolean;
  // Packs added by hand from Productos
  manual: number;
  onToggle: () => void;
  onOpen: () => void;
  onRemove: () => void;
}) {
  const p = line.producto;
  const why = [
    line.grams > 0 && "Necesitas " + fmtGrams(line.grams) + " · " + line.recipes.join(", "),
    manual > 0 && "Añadido por ti",
  ].filter(Boolean);
  return (
    <li className="flex items-center gap-3 border-b border-dashed py-3 last:border-b-0">
      <Checkbox checked={checked} onCheckedChange={onToggle} aria-label={"Comprado: " + (p?.nombre ?? line.id)} className={CHECK_CLASS} />
      <button
        type="button"
        onClick={onOpen}
        data-morph
        className="flex min-w-0 flex-1 cursor-pointer flex-col text-left"
      >
        <span className={cn("font-serif text-[1.05rem] leading-snug hover:text-primary", checked && "text-muted-foreground line-through")}>
          {p?.nombre ?? "Producto " + line.id + " (ya no está en productos.json)"}
        </span>
        <span className="text-[0.8rem] text-muted-foreground">{why.join(" · ")}</span>
      </button>
      <span className={cn("flex shrink-0 flex-col items-end tabular-nums", checked && "opacity-50")}>
        <span className="text-[0.82rem] text-muted-foreground">
          {line.packs} × {packName(p)}
        </span>
        <span className="font-semibold">{line.cost != null ? fmtEur(line.cost) : "—"}</span>
      </span>
      {manual > 0 && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Quitar lo añadido a mano"
          className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-full text-faint hover:bg-secondary hover:text-foreground"
        >
          <XIcon className="size-4" />
        </button>
      )}
    </li>
  );
}

// An ingredient Mercadona does not sell: only a tick
export function LooseRow({
  text,
  recipes,
  checked,
  onToggle,
}: {
  text: string;
  recipes: string[];
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="flex items-center gap-3 border-b border-dashed py-3 last:border-b-0">
      <Checkbox checked={checked} onCheckedChange={onToggle} aria-label={"Comprado: " + text} className={CHECK_CLASS} />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={cn("font-serif text-[1.02rem] leading-snug", checked && "text-muted-foreground line-through")}>{text}</span>
        <span className="text-[0.8rem] text-muted-foreground">{recipes.join(", ")}</span>
      </span>
    </li>
  );
}
