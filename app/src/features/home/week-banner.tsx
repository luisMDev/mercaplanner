import { ArrowRightIcon, HeartIcon } from "lucide-react";
import { CtaButton } from "@/components/cozy/cta-button";
import { Sprig } from "@/components/cozy/sprig";
import { DishArt } from "@/features/plan/components/dish-art";
import { weekSummary } from "@/features/plan/model/week";
import type { Plan } from "@/features/plan/model/types";
import { navigate } from "@/features/shell/use-route";
import { fmtNum, plural } from "@/lib/format";

// "La dieta de la semana": the banner on top of Inicio, with the week's
// numbers and the plate of the recipe it repeats most
export function WeekBanner({ plan }: { plan: Plan }) {
  const { days, meals, avgKcal, star } = weekSummary(plan);
  return (
    <section className="@container relative min-h-64 overflow-hidden rounded-3xl border border-white/70 bg-linear-to-br from-primary-soft via-[color-mix(in_oklab,var(--primary-soft)_45%,var(--card))] to-card p-6 shadow-card dark:border-white/5">
      <p className="pointer-events-none absolute top-5 right-6 hidden rotate-[-8deg] text-right font-script @sm:block text-[1.6rem] leading-[0.9] text-primary/70">
        Días ricos
        <br />
        por delante
        <HeartIcon aria-hidden="true" className="ml-1 inline size-3 fill-current" />
      </p>
      <div className="relative z-10 flex max-w-[64%] flex-col items-start gap-3">
        <p className="caps flex items-center gap-2 font-semibold">
          <Sprig /> Esta semana
        </p>
        <h2 className="font-display text-[clamp(2rem,1.6rem+1.4vw,2.6rem)] leading-[1.02] font-semibold text-primary italic">
          La dieta de la semana
          <HeartIcon aria-hidden="true" className="ml-1.5 inline size-4 fill-current" />
        </h2>
        <p className="caps text-[0.66rem] leading-relaxed text-muted-foreground">
          {days ? (
            <>
              {plural(days, "día", "días")} · {plural(meals, "comida", "comidas")}
              <br />
              {fmtNum(avgKcal)} kcal de media al día
            </>
          ) : (
            "Aún no hay comidas en el plan"
          )}
        </p>
        <CtaButton className="mt-1 whitespace-nowrap" onClick={() => navigate({ section: "semana" })}>
          Ver la semana <ArrowRightIcon />
        </CtaButton>
      </div>
      {star && (
        <button
          type="button"
          onClick={() => navigate({ section: "recetas", id: star.id })}
          aria-label={"Receta estrella: " + star.nombre}
          className="absolute top-14 right-[-8%] w-[46%] cursor-pointer @sm:top-auto @sm:right-[-6%] @sm:bottom-0 @sm:w-[52%]"
        >
          <DishArt receta={star} sides className="animate-float -rotate-3 drop-shadow-md" />
        </button>
      )}
    </section>
  );
}
