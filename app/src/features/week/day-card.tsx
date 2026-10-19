import { Dot } from "@/components/shared/meta-list";
import { EmptyText } from "@/components/shared/muted-text";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DayTimeline } from "@/features/plan/components/day-timeline";
import type { Dia } from "@/features/plan/model/days";
import { dayMeals, dayTotals } from "@/features/plan/model/meals";
import type { Plan } from "@/features/plan/model/types";
import { fmtNum } from "@/lib/format";
import { cn } from "@/lib/utils";

export function DayCard({
  plan,
  dia,
  isToday,
  onOpenRecipe,
}: {
  plan: Plan;
  dia: Dia;
  isToday: boolean;
  onOpenRecipe: (id: string) => void;
}) {
  const meals = dayMeals(plan, dia.id);
  return (
    <Card className={cn("gap-3 shadow-card", isToday && "ring-2 ring-primary")}>
      <CardHeader className="flex flex-wrap items-baseline gap-1.5">
        <CardTitle className="font-semibold">{dia.label}</CardTitle>
        {isToday && <Badge className="bg-gold-soft font-bold text-warning">Hoy</Badge>}
        {meals.length > 0 && (
          <>
            <Dot />
            <span className="text-[0.82rem] text-muted-foreground tabular-nums">{fmtNum(dayTotals(meals).kcal)} kcal</span>
          </>
        )}
      </CardHeader>
      <CardContent>
        {meals.length ? (
          <DayTimeline meals={meals} onOpenRecipe={onOpenRecipe} />
        ) : (
          <EmptyText>Sin comidas planificadas.</EmptyText>
        )}
      </CardContent>
    </Card>
  );
}
