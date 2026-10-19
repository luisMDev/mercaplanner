"use client";

import { StoreIllustration } from "@/components/cozy/store/store-illustration";
import type { Plan } from "@/features/plan/model/types";
import { SideMenu } from "@/features/shell/nav/side-menu";
import { HomeIntro } from "./home-intro";
import { NextMealNote } from "./next-meal-note";
import { ProductsPanel } from "./products-panel";
import { RecipesPanel } from "./recipes-panel";
import { WeekBanner } from "./week-banner";

/* Inicio: the menu on the left, the store in the middle and, on the right, the
   panels that open the rest: the week, the recipes and the products. On a
   small laptop the panels go under the store; on a phone: title, store, next
   meal and panels, one under the other. The park behind the store spreads
   under the menu and the panels, which stay on top (z-10) */
export function HomeView({ plan, pending }: { plan: Plan; pending: number }) {
  return (
    <div className="grid gap-6 overflow-x-clip lg:grid-cols-[minmax(230px,260px)_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[minmax(230px,280px)_minmax(0,1fr)_minmax(340px,440px)]">
      <div className="contents lg:relative lg:z-10 lg:row-span-2 lg:flex lg:flex-col lg:gap-8 xl:row-span-1">
        <HomeIntro />
        <div className="max-lg:hidden">
          <SideMenu active="inicio" pending={pending} />
        </div>
        <div className="relative z-10 order-3 max-lg:mx-auto max-lg:w-full max-lg:max-w-md lg:order-none">
          <NextMealNote plan={plan} />
        </div>
      </div>
      <div className="order-2 lg:order-none lg:pt-4 xl:sticky xl:top-24 xl:self-start">
        <StoreIllustration
          preload
          park="backdrop"
          className="mx-auto w-full max-w-[360px] sm:max-w-[420px] xl:max-w-[600px]"
        />
      </div>
      <div className="relative z-10 order-4 flex flex-col gap-5 lg:order-none lg:col-start-2 xl:col-start-auto xl:pt-4">
        <WeekBanner plan={plan} />
        <RecipesPanel plan={plan} />
        <ProductsPanel plan={plan} />
      </div>
    </div>
  );
}
