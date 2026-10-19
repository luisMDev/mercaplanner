import { BasketView } from "@/features/basket/basket-view";
import { HomeView } from "@/features/home/home-view";
import type { Plan } from "@/features/plan/model/types";
import { ProductsView } from "@/features/products/products-view";
import { RecipesView } from "@/features/recipes/recipes-view";
import { TodayView } from "@/features/today/today-view";
import { WeekView } from "@/features/week/week-view";
import type { Route } from "./model/routes";

// The open section, with the recipe or product its panel shows
export function SectionView({ route, plan, pending }: { route: Route; plan: Plan; pending: number }) {
  switch (route.section) {
    case "hoy":
      return <TodayView plan={plan} />;
    case "recetas":
      return <RecipesView plan={plan} openId={route.id} />;
    case "productos":
      return <ProductsView plan={plan} openId={route.id} />;
    case "semana":
      return <WeekView plan={plan} />;
    case "cesta":
      return <BasketView plan={plan} />;
    default:
      return <HomeView plan={plan} pending={pending} />;
  }
}
