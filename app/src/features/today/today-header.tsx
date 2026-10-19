import { MetaList } from "@/components/shared/meta-list";
import { Badge } from "@/components/ui/badge";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MONTHS_SHORT, type Dia } from "@/features/plan/model/days";
import type { dayTotals } from "@/features/plan/model/meals";
import { fmtNum, plural } from "@/lib/format";

// Date, day name and the day's totals: kcal, number of meals and macros
export function TodayHeader({
  now,
  dia,
  mealCount,
  totals: t,
}: {
  now: Date;
  dia: Dia;
  mealCount: number;
  totals: ReturnType<typeof dayTotals>;
}) {
  const macros = [
    t.proteinas ? "Proteínas " + fmtNum(t.proteinas) + " g" : null,
    t.carbohidratos ? "Hidratos " + fmtNum(t.carbohidratos) + " g" : null,
    t.grasas ? "Grasas " + fmtNum(t.grasas) + " g" : null,
  ].filter((m) => m !== null);

  return (
    <CardHeader className="flex items-center gap-3.5 p-4 max-[480px]:gap-2.5 max-[480px]:p-3">
      <div aria-hidden="true" className="flex w-[38px] shrink-0 flex-col items-center leading-none text-primary tabular-nums">
        <span className="text-[1.4rem] font-semibold">{now.getDate()}</span>
        <span className="mt-[3px] text-[0.62rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
          {MONTHS_SHORT[now.getMonth()]}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <CardTitle className="text-[1.03rem] font-semibold">{dia.label}</CardTitle>
        <CardDescription className="mt-0.5 text-[0.79rem] tabular-nums">
          <MetaList items={[fmtNum(t.kcal) + " kcal", plural(mealCount, "comida", "comidas")]} />
        </CardDescription>
        {macros.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {macros.map((m) => (
              <Badge key={m} variant="secondary" className="tabular-nums">
                {m}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </CardHeader>
  );
}
