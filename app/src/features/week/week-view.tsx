"use client";

import { useRef, useState } from "react";
import { StoreIllustration } from "@/components/cozy/store/store-illustration";
import type { Plan } from "@/features/plan/model/types";
import { useNow } from "@/hooks/use-now";
import { DayTicket } from "./components/day-ticket";
import { MonthCalendar } from "./components/month-calendar";
import { monthOf, sameDay } from "./model/calendar";

/* Semana: the plan on a month calendar (it repeats every week) and, next to
   it, the day picked: today at first */
export function WeekView({ plan }: { plan: Plan }) {
  const today = useNow();
  const [selected, setSelected] = useState(today);
  const [month, setMonth] = useState(() => monthOf(today));
  const ticket = useRef<HTMLDivElement>(null);

  function select(date: Date) {
    setSelected(date);
    if (date.getMonth() !== month.month) setMonth(monthOf(date));
    // On a phone the ticket is under the calendar: bring it into view
    if (window.matchMedia("(max-width: 1023px)").matches) {
      ticket.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  return (
    <div className="grid gap-8 pt-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] lg:pt-8">
      <div className="min-w-0 [view-transition-name:panel]">
        <MonthCalendar
          plan={plan}
          month={month}
          onMonthChange={setMonth}
          today={today}
          selected={selected}
          onSelect={select}
        />
      </div>
      <div ref={ticket} className="flex scroll-mb-28 flex-col gap-6">
        <DayTicket plan={plan} date={selected} isToday={sameDay(selected, today)} />
        <StoreIllustration className="mx-auto mt-6 hidden w-full max-w-[360px] lg:block" />
      </div>
    </div>
  );
}
