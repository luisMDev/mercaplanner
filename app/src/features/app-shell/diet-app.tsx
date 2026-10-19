"use client";

import { TabsContent, Tabs } from "@/components/ui/tabs";
import { usePlan } from "@/features/plan/use-plan";
import { ProductsTab } from "@/features/products/components/products-tab";
import { usePickedProducts } from "@/features/products/use-picked-products";
import { RecipesView } from "@/features/recipes/recipes-view";
import { TodayView } from "@/features/today/today-view";
import { WeekView } from "@/features/week/week-view";
import { useMounted } from "@/hooks/use-mounted";
import { AppFooter } from "./app-footer";
import { AppSkeleton } from "./app-skeleton";
import { AppTabs } from "./app-tabs";
import { useNavigation } from "./use-navigation";
import type { View } from "./views";

function DietAppClient() {
  const nav = useNavigation();
  const { plan, source, pickError, pick } = usePlan();
  const pickedProducts = usePickedProducts();

  return (
    // The footer stays inside Tabs so the pinned tabs last to the end of the page
    <Tabs value={nav.view} onValueChange={(v) => nav.selectView(v as View)} className="gap-0">
      <AppTabs />
      <TabsContent value="hoy" className="text-[15px]">
        <TodayView plan={plan} onOpenRecipe={nav.openRecipe} onOpenProduct={nav.openProduct} />
      </TabsContent>
      <TabsContent value="recetas" className="text-[15px]">
        <RecipesView plan={plan} target={nav.recipeTarget} onOpenProduct={nav.openProduct} />
      </TabsContent>
      <TabsContent value="semana" className="text-[15px]">
        <WeekView plan={plan} onOpenRecipe={nav.openRecipe} />
      </TabsContent>
      <TabsContent value="productos" className="text-[15px]">
        <ProductsTab
          picked={pickedProducts.products}
          pickError={pickedProducts.pickError}
          onPick={pickedProducts.pick}
          target={nav.productTarget}
          onClearTarget={nav.clearProductTarget}
        />
      </TabsContent>
      <AppFooter plan={plan} source={source} pickError={pickError} onPick={pick} />
    </Tabs>
  );
}

// Everything below the title depends on the device (today's date, the saved
// tab and theme), so it renders once in the browser; the prerendered page shows
// a skeleton in its place
export function DietApp() {
  return useMounted() ? <DietAppClient /> : <AppSkeleton />;
}
