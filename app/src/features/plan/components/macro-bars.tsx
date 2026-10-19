import { fmtNum } from "@/lib/format";
import type { Macros } from "../model/types";

// kcal per gram of each macro, to split the energy between them
const MACROS = [
  { key: "proteinas", label: "Proteínas", kcal: 4, color: "var(--primary)" },
  { key: "carbohidratos", label: "Hidratos", kcal: 4, color: "var(--gold)" },
  { key: "grasas", label: "Grasas", kcal: 9, color: "var(--green)" },
] as const;

// Grams of protein, carbs and fat, each with a bar of its share of the kcal
export function MacroBars({ macros }: { macros: Macros | undefined }) {
  if (!macros) return null;
  const total = MACROS.reduce((t, m) => t + (macros[m.key] ?? 0) * m.kcal, 0);
  return (
    <div className="grid w-full grid-cols-3 gap-2">
      {MACROS.map((m) => {
        const grams = macros[m.key] ?? 0;
        const pct = total ? Math.round(((grams * m.kcal) / total) * 100) : 0;
        return (
          <div key={m.key} className="flex flex-col gap-1.5 rounded-2xl bg-secondary/80 px-3 py-2.5">
            <span className="caps text-[0.58rem] text-muted-foreground">{m.label}</span>
            <span className="flex items-baseline justify-between gap-1 tabular-nums">
              <span className="text-[1.05rem] font-semibold">{fmtNum(grams)} g</span>
              <span className="text-[0.72rem] text-muted-foreground">{pct} %</span>
            </span>
            <span className="h-1.5 overflow-hidden rounded-full bg-background" aria-hidden="true">
              <span className="block h-full rounded-full" style={{ width: pct + "%", background: m.color }} />
            </span>
          </div>
        );
      })}
    </div>
  );
}
