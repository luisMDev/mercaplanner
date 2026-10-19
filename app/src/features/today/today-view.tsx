"use client";

import { CalendarX2Icon } from "lucide-react";
import { Notice } from "@/components/shared/notice";
import { Card, CardContent } from "@/components/ui/card";
import { DayTimeline } from "@/features/plan/components/day-timeline";
import { todayDia } from "@/features/plan/model/days";
import { dayMeals, dayTotals, pastCount } from "@/features/plan/model/meals";
import { DATA_FILE } from "@/features/plan/model/plan-file";
import type { Plan } from "@/features/plan/model/types";
import { useNow } from "@/hooks/use-now";
import { TodayHeader } from "./today-header";

/* Hoy: today's day of the week, with every recipe in full */
export function TodayView({
  plan,
  onOpenRecipe,
  onOpenProduct,
}: {
  plan: Plan;
  onOpenRecipe: (id: string) => void;
  onOpenProduct: (id: string) => void;
}) {
  const now = useNow();
  const dia = todayDia(now);
  const meals = dayMeals(plan, dia.id);

  if (!meals.length) {
    return (
      <Notice
        icon={<CalendarX2Icon />}
        title="Hoy no hay comidas en el plan"
        description={`Añade el ${dia.label.toLowerCase()} a "semana" en ${DATA_FILE}.`}
      />
    );
  }

  return (
    <Card className="gap-0 py-0 shadow-card">
      <TodayHeader now={now} dia={dia} mealCount={meals.length} totals={dayTotals(meals)} />
      <CardContent className="flex flex-col gap-2 border-t px-4 pt-4 pb-[18px]">
        <div className="text-[0.7rem] font-bold tracking-[0.08em] text-gold uppercase">Plan del día</div>
        <DayTimeline
          meals={meals}
          pastUntil={pastCount(meals, now)}
          onOpenRecipe={onOpenRecipe}
          onOpenProduct={onOpenProduct}
        />
      </CardContent>
    </Card>
  );
}
