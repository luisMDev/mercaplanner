import { TomatoLogo } from "@/components/cozy/tomato-logo";
import { nextMeal } from "@/features/plan/model/meals";
import type { Plan } from "@/features/plan/model/types";
import { navigate } from "@/features/shell/use-route";
import { useNow } from "@/hooks/use-now";

// Paper clip holding the note
function Clip() {
  return (
    <svg viewBox="0 0 16 40" aria-hidden="true" className="absolute -top-5 left-1/3 h-10 w-4 text-faint">
      <path
        d="M5 30V8a3.5 3.5 0 0 1 7 0v24a5.5 5.5 0 0 1-11 0V12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Note pinned under the menu: the next meal and what it is
export function NextMealNote({ plan }: { plan: Plan }) {
  const next = nextMeal(plan, useNow());
  const r = next?.meal.receta;
  return (
    <div className="relative mt-4 -rotate-1 rounded-2xl glass p-2 shadow-card">
      <Clip />
      <TomatoLogo className="absolute -bottom-3 -left-5 size-24 -rotate-12 drop-shadow-sm" />
      <div className="flex min-h-28 flex-col justify-center gap-1 rounded-xl border border-dashed border-primary/40 py-4 pr-4 pl-24">
        {next ? (
          <>
            <p className="caps text-[0.62rem] font-semibold text-primary">
              {next.tomorrow ? "Mañana" : "Lo siguiente"} · {next.meal.comida.label}
              {next.meal.comida.hora && " · " + next.meal.comida.hora}
            </p>
            {r ? (
              <button
                type="button"
                onClick={() => navigate({ section: "recetas", id: r.id })}
                className="cursor-pointer text-left font-serif text-[1.1rem] leading-snug hover:text-primary"
              >
                {r.nombre}
              </button>
            ) : (
              <p className="font-serif text-warning italic">Receta no encontrada</p>
            )}
          </>
        ) : (
          <p className="font-serif text-[1.15rem] leading-snug">
            Pequeños platos,
            <br />
            días más ricos
          </p>
        )}
      </div>
    </div>
  );
}
