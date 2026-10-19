import { FlameIcon, ShoppingBagIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { todayDia } from "@/features/plan/model/days";
import { dayMeals, dayTotals } from "@/features/plan/model/meals";
import type { Plan } from "@/features/plan/model/types";
import { useNow } from "@/hooks/use-now";
import { fmtNum } from "@/lib/format";
import { cn } from "@/lib/utils";
import { navigate } from "../use-route";

function Pill({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "relative inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-white/70 bg-card/85 px-4 shadow-card transition-all hover:-translate-y-px hover:shadow-lift dark:border-white/5 [&_svg]:size-[18px]",
        className,
      )}
      {...props}
    />
  );
}

// "🔥 388 kcal hoy": today's total, opens Hoy
export function KcalPill({ plan, className }: { plan: Plan; className?: string }) {
  const kcal = dayTotals(dayMeals(plan, todayDia(useNow()).id)).kcal;
  return (
    <Pill className={className} onClick={() => navigate({ section: "hoy" })} aria-label={`Hoy: ${fmtNum(kcal)} kcal`}>
      <FlameIcon className="fill-primary/20 text-primary" />
      <span className="font-semibold tabular-nums">{fmtNum(kcal)}</span>
      <span className="text-[0.8rem] text-muted-foreground">kcal hoy</span>
    </Pill>
  );
}

// "👜 5": products still to buy, opens the basket
export function BasketPill({ pending }: { pending: number }) {
  return (
    <Pill onClick={() => navigate({ section: "cesta" })} aria-label={`Cesta: ${pending} por comprar`}>
      <ShoppingBagIcon className="text-primary" />
      <span className="font-semibold tabular-nums">{pending}</span>
      <span className="text-[0.8rem] text-muted-foreground max-xl:hidden">por comprar</span>
    </Pill>
  );
}
