"use client";

import { CalendarX2Icon, TreePalmIcon } from "lucide-react";
import { DateStub } from "@/components/cozy/date-stub";
import { Panel, PanelHeader } from "@/components/cozy/panel";
import { Notice } from "@/components/shared/notice";
import { MacroBars } from "@/features/plan/components/macro-bars";
import { isLibre, todayDia } from "@/features/plan/model/days";
import { dayMeals, dayTotals, pastCount } from "@/features/plan/model/meals";
import { DATA_FILE } from "@/features/plan/model/plan-file";
import type { Plan } from "@/features/plan/model/types";
import { PageLayout } from "@/features/shell/page-layout";
import { navigate } from "@/features/shell/use-route";
import { useNow } from "@/hooks/use-now";
import { fmtNum, plural } from "@/lib/format";
import { MealRow } from "./meal-row";
import { TomorrowPeek } from "./tomorrow-peek";

/* Hoy: today's meals in order, with the day's kcal and macros. A meal opens
   its recipe; the ones past are ticked */
export function TodayView({ plan }: { plan: Plan }) {
  const now = useNow();
  const dia = todayDia(now);
  const meals = dayMeals(plan, dia.id);
  const done = pastCount(meals, now);
  const totals = dayTotals(meals);

  return (
    <PageLayout title="Hoy">
      <div className="flex flex-col gap-5">
        {meals.length ? (
          <Panel className="p-5 sm:p-8">
            <div className="flex items-stretch gap-5">
              <DateStub date={now} />
              <div className="flex min-w-0 flex-col justify-center gap-1.5">
                <p className="caps flex items-center gap-2 font-semibold">
                  El plan de hoy
                </p>
                <h2 className="font-display text-[clamp(2rem,1.6rem+1.4vw,2.8rem)] leading-none font-semibold text-primary italic">
                  {dia.label}
                </h2>
                <p className="text-[0.92rem] text-muted-foreground tabular-nums">
                  {fmtNum(totals.kcal)} kcal · {plural(meals.length, "comida", "comidas")} ·{" "}
                  {done === meals.length ? "todo hecho" : `${done} de ${meals.length} hechas`}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <MacroBars macros={totals} />
            </div>
            <div className="mt-7">
              <PanelHeader title="Comidas del día" />
              <ol>
                {meals.map((m, i) => (
                  <MealRow
                    key={m.comida.id}
                    meal={m}
                    past={i < done}
                    next={i === done}
                    onOpen={(id) => navigate({ section: "recetas", id })}
                  />
                ))}
              </ol>
            </div>
          </Panel>
        ) : isLibre(plan, dia.id) ? (
          <Notice
            icon={<TreePalmIcon />}
            title={`Hoy, ${dia.label.toLowerCase()}, es día libre`}
            description="Sin plan: come lo que te apetezca."
          />
        ) : (
          <Notice
            icon={<CalendarX2Icon />}
            title="Hoy no hay comidas en el plan"
            description={`Añade el ${dia.label.toLowerCase()} a "semana" en ${DATA_FILE}.`}
          />
        )}
        <TomorrowPeek plan={plan} now={now} />
      </div>
    </PageLayout>
  );
}
