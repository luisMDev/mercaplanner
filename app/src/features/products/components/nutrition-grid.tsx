import { fmtDec } from "@/lib/format";
import { cn } from "@/lib/utils";
import { per100 } from "../model/format";
import type { Producto } from "../model/types";

function NutriCell({
  label,
  value,
  unit = "",
  digits,
  sub,
  subLabel,
}: {
  label: string;
  value?: number;
  unit?: string;
  digits?: number;
  sub?: number;
  subLabel?: string;
}) {
  return (
    <div className="flex min-w-0 flex-col rounded-lg bg-muted px-2 py-1.5">
      <span className="text-[0.62rem] font-bold tracking-[0.06em] text-faint uppercase">{label}</span>
      <span className={cn("text-[0.92rem] font-bold tabular-nums", value == null && "text-faint")}>
        {value == null ? "—" : fmtDec(value, digits) + unit}
      </span>
      {sub != null && (
        <span className="text-[0.7rem] text-muted-foreground tabular-nums">
          {subLabel} {fmtDec(sub)} g
        </span>
      )}
    </div>
  );
}

// Nutrition per 100 g/ml: six cells, three per row on a phone
export function NutritionGrid({ p }: { p: Producto }) {
  return (
    <div className="grid grid-cols-3 gap-1.5 min-[561px]:grid-cols-6" aria-label={"Valores por " + per100(p)}>
      <NutriCell label="kcal" value={p.kcal_100} digits={0} />
      <NutriCell label="Proteínas" value={p.proteinas_100} unit=" g" />
      <NutriCell label="Hidratos" value={p.carbohidratos_100} unit=" g" sub={p.azucares_100} subLabel="azúcares" />
      <NutriCell label="Grasas" value={p.grasas_100} unit=" g" sub={p.grasas_saturadas_100} subLabel="saturadas" />
      <NutriCell label="Fibra" value={p.fibra_100} unit=" g" />
      <NutriCell label="Sal" value={p.sal_100} unit=" g" digits={2} />
    </div>
  );
}
