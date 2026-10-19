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
  accent,
}: {
  label: string;
  value?: number;
  unit?: string;
  digits?: number;
  sub?: number;
  subLabel?: string;
  accent?: boolean;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col rounded-2xl bg-secondary/80 px-3 py-2", accent && "bg-primary-soft")}>
      <span className="caps text-[0.6rem] text-muted-foreground">{label}</span>
      <span className={cn("text-[1.05rem] font-semibold tabular-nums", value == null && "text-faint", accent && "text-primary")}>
        {value == null ? "—" : fmtDec(value, digits) + unit}
      </span>
      {sub != null && (
        <span className="text-[0.72rem] text-muted-foreground tabular-nums">
          {subLabel} {fmtDec(sub)} g
        </span>
      )}
    </div>
  );
}

// Nutrition per 100 g/ml: six cells, three per row in a narrow panel
export function NutritionGrid({ p }: { p: Producto }) {
  return (
    <div className="grid grid-cols-3 gap-2 @3xl:grid-cols-6" aria-label={"Valores por " + per100(p)}>
      <NutriCell label="kcal" value={p.kcal_100} digits={0} accent />
      <NutriCell label="Proteínas" value={p.proteinas_100} unit=" g" />
      <NutriCell label="Hidratos" value={p.carbohidratos_100} unit=" g" sub={p.azucares_100} subLabel="azúcares" />
      <NutriCell label="Grasas" value={p.grasas_100} unit=" g" sub={p.grasas_saturadas_100} subLabel="saturadas" />
      <NutriCell label="Fibra" value={p.fibra_100} unit=" g" />
      <NutriCell label="Sal" value={p.sal_100} unit=" g" digits={2} />
    </div>
  );
}
