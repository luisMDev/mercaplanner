import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Sprig } from "@/components/cozy/sprig";
import { WashiTape } from "@/components/cozy/washi-tape";
import type { Plan } from "@/features/plan/model/types";
import { cn } from "@/lib/utils";
import { MONTHS, WEEKDAYS_SHORT, addMonths, monthWeeks, sameDay, type Month } from "../model/calendar";
import { DayCell } from "./day-cell";

function MonthButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-secondary text-foreground shadow-card transition-colors hover:bg-primary-soft hover:text-primary [&_svg]:size-4"
    >
      {children}
    </button>
  );
}

// The month as a paper calendar held with tape: each day with what the plan
// puts on it. Arrows move between months
export function MonthCalendar({
  plan,
  month,
  onMonthChange,
  today,
  selected,
  onSelect,
}: {
  plan: Plan;
  month: Month;
  onMonthChange: (month: Month) => void;
  today: Date;
  selected: Date;
  onSelect: (date: Date) => void;
}) {
  return (
    <section className="relative rounded-3xl border border-white/70 bg-card bg-linear-to-br from-card from-50% to-primary-soft/40 px-3 pt-6 pb-4 shadow-lift sm:px-7 sm:pt-8 dark:border-white/5">
      <WashiTape tone="sage" className="-top-3 left-10 -rotate-3" />
      <WashiTape tone="mint" className="-top-3 right-16 rotate-2 max-sm:hidden" />
      <header className="flex flex-wrap items-center gap-3 px-1 pb-4 sm:gap-5">
        <MonthButton label="Mes anterior" onClick={() => onMonthChange(addMonths(month, -1))}>
          <ChevronLeftIcon />
        </MonthButton>
        <h1 className="flex items-baseline gap-2">
          <span className="font-script text-[clamp(2.8rem,2.2rem+2.4vw,4.4rem)] leading-none">{MONTHS[month.month]}</span>
          <span className="caps text-[0.8rem] font-semibold text-muted-foreground">{month.year}</span>
        </h1>
        <MonthButton label="Mes siguiente" onClick={() => onMonthChange(addMonths(month, 1))}>
          <ChevronRightIcon />
        </MonthButton>
        <p className="caps ml-auto hidden items-center gap-2 text-muted-foreground xl:flex">
          La dieta de cada día <Sprig />
        </p>
      </header>
      <div className="grid grid-cols-7 border-b">
        {WEEKDAYS_SHORT.map((d, i) => (
          <span key={d} className={cn("caps py-2 text-center text-[0.66rem] font-semibold sm:text-left sm:pl-2", i >= 5 && "text-primary")}>
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {monthWeeks(month)
          .flat()
          .map((date) => (
            <DayCell
              key={date.toISOString()}
              plan={plan}
              date={date}
              outside={date.getMonth() !== month.month}
              today={sameDay(date, today)}
              selected={sameDay(date, selected)}
              onSelect={onSelect}
            />
          ))}
      </div>
      <p className="mt-4 flex items-center gap-2 px-1 font-script text-[1.35rem] text-muted-foreground">
        <span className="size-2 rounded-full bg-primary" />
        El plan se repite cada semana, de lunes a domingo
      </p>
    </section>
  );
}
