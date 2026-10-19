import { todayDia } from "@/features/plan/model/days";
import { dayMeals } from "@/features/plan/model/meals";
import type { Meal, Plan } from "@/features/plan/model/types";

export const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const WEEKDAYS_SHORT = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export type Month = { year: number; month: number };

export function monthOf(date: Date): Month {
  return { year: date.getFullYear(), month: date.getMonth() };
}

export function addMonths({ year, month }: Month, n: number): Month {
  const d = new Date(year, month + n, 1);
  return monthOf(d);
}

// Whole weeks, Monday first, from the one with the 1st to the one with the
// last day: 4 to 6 rows of 7 dates
export function monthWeeks({ year, month }: Month): Date[][] {
  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - ((first.getDay() + 6) % 7));
  const last = new Date(year, month + 1, 0);
  const weeks: Date[][] = [];
  for (let d = start; d <= last || weeks.length === 0; ) {
    const week = Array.from({ length: 7 }, (_, i) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + i));
    weeks.push(week);
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7);
  }
  return weeks;
}

export function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// The plan repeats every week: a date gets the meals of its weekday
export function dateMeals(plan: Plan, date: Date): Meal[] {
  return dayMeals(plan, todayDia(date).id);
}

// The meal a calendar cell shows: lunch if there is one, else the first
export function mainMeal(meals: Meal[]) {
  return meals.find((m) => m.comida.id === "comida") ?? meals[0] ?? null;
}
