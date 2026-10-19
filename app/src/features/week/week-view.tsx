"use client";

import { DIAS, todayDia } from "@/features/plan/model/days";
import type { Plan } from "@/features/plan/model/types";
import { useNow } from "@/hooks/use-now";
import { DayCard } from "./day-card";

/* Semana: every day of the plan, one card each, today marked */
export function WeekView({ plan, onOpenRecipe }: { plan: Plan; onOpenRecipe: (id: string) => void }) {
  const today = todayDia(useNow()).id;
  return (
    <div className="flex flex-col gap-3">
      {DIAS.map((dia) => (
        <DayCard key={dia.id} plan={plan} dia={dia} isToday={dia.id === today} onOpenRecipe={onOpenRecipe} />
      ))}
    </div>
  );
}
