import { ClockIcon, HeartIcon, ShoppingBagIcon, UsersIcon } from "lucide-react";
import { BackLink } from "@/components/cozy/back-link";
import { CtaButton } from "@/components/cozy/cta-button";
import { Stepper } from "@/components/cozy/stepper";
import { Tag } from "@/components/cozy/tag";
import { useBasket } from "@/features/basket/basket-context";
import { MacroBars } from "@/features/plan/components/macro-bars";
import { comidaLabel } from "@/features/plan/model/recipes";
import { recipeCount } from "@/features/plan/model/week";
import type { Plan, Receta } from "@/features/plan/model/types";
import { navigate } from "@/features/shell/use-route";
import { fmtNum, plural } from "@/lib/format";

// Right side of an open recipe: name, kcal, description, tags, macros and
// the servings to add to the basket
export function RecipeSummary({
  plan,
  receta: r,
  servings,
  onServingsChange,
  onBack,
}: {
  plan: Plan;
  receta: Receta;
  servings: number;
  onServingsChange: (servings: number) => void;
  onBack: () => void;
}) {
  const basket = useBasket();
  const inPlan = recipeCount(plan, r.id);
  const inBasket = basket.state.recipes[r.id] ?? 0;
  return (
    <div className="flex min-w-0 flex-col items-start gap-4">
      <BackLink onClick={onBack} className="@max-3xl:hidden">
        Todas las recetas
      </BackLink>
      <p className="caps font-semibold">{r.tipos.map((t) => comidaLabel(plan, t)).join(" · ")}</p>
      <h2 className="font-display text-[clamp(2rem,1.4rem+1.8vw,3rem)] leading-[1.04] font-semibold text-primary italic">
        {r.nombre}
      </h2>
      {r.kcal != null && (
        <p className="flex items-baseline gap-2 tabular-nums">
          <span className="text-2xl font-medium">{fmtNum(r.kcal)} kcal</span>
          <span className="text-muted-foreground">por ración</span>
        </p>
      )}
      {r.descripcion && <p className="font-serif text-[1.1rem] leading-relaxed">{r.descripcion}</p>}
      <div className="flex flex-wrap gap-2">
        {r.minutos != null && (
          <Tag>
            <ClockIcon /> {r.minutos} min
          </Tag>
        )}
        {r.raciones != null && (
          <Tag>
            <UsersIcon /> {plural(r.raciones, "ración", "raciones")}
          </Tag>
        )}
        <Tag className={inPlan ? "" : "border-border text-muted-foreground"}>
          <HeartIcon className={inPlan ? "fill-current" : ""} />
          {inPlan ? (inPlan === 1 ? "Una vez en el plan" : inPlan + " veces en el plan") : "Fuera del plan"}
        </Tag>
      </div>
      <MacroBars macros={r.macros} />
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <Stepper value={servings} onChange={onServingsChange} label="Raciones" />
          <CtaButton onClick={() => basket.addRecipe(r.id, servings)}>
            Añadir a la cesta <ShoppingBagIcon />
          </CtaButton>
        </div>
        <p className="text-[0.85rem] text-muted-foreground">
          {inBasket > 0 ? (
            <>
              Llevas {plural(inBasket, "ración", "raciones")} en la cesta, además del plan ·{" "}
              <button
                type="button"
                className="cursor-pointer font-semibold text-primary hover:underline"
                onClick={() => navigate({ section: "cesta" })}
              >
                Ver la cesta
              </button>
            </>
          ) : (
            "Raciones para la cesta; los ingredientes se ajustan a ellas"
          )}
        </p>
      </div>
    </div>
  );
}
