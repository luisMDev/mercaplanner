"use client";

import { StoreSlot } from "@/components/cozy/store/store-stage";
import type { Plan } from "@/features/plan/model/types";
import { SideMenu } from "@/features/shell/nav/side-menu";
import { NextMealNote } from "./next-meal-note";
import { ProductsPanel } from "./products-panel";
import { RecipesPanel } from "./recipes-panel";
import { WeekBanner } from "./week-banner";

/* Inicio: the next meal and the menu on the left, aligned with the foot of
   the store in the middle, and on the right the panels that open the rest: the week, the
   recipes and the products. On a small laptop the panels go under the store;
   on a phone: store, next meal and panels, one under the other. The park
   behind the store spreads under the menu and the panels, which stay on top
   (z-10) */
export function HomeView({ plan, pending }: { plan: Plan; pending: number }) {
  return (
    <div className="flex flex-col gap-6 pt-2 lg:grid lg:gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(340px,440px)]">
      {/* Menu and store side by side, as tall as the screen under the header,
          both down at its bottom. z-10 on the whole block: sticky makes it its
          own stacking context, so the menu inside is only over the store
          (fixed, z-5, store-stage.tsx) if the block is */}
      <div className="relative z-10 flex flex-col gap-6 lg:grid lg:min-h-[calc(100dvh-7.5rem)] lg:grid-cols-[minmax(230px,260px)_minmax(0,1fr)] lg:items-end lg:gap-8 xl:sticky xl:top-24 xl:grid-cols-[minmax(230px,280px)_minmax(0,1fr)] xl:self-start">
        {/* Own layers in view transitions, over the store (globals.css) */}
        <div className="relative z-10 order-2 flex flex-col gap-8 [.vt_&]:[view-transition-name:home-menu] lg:order-none">
          <div className="max-lg:mx-auto max-lg:w-full max-lg:max-w-md">
            <NextMealNote plan={plan} />
          </div>
          <div className="max-lg:hidden">
            <SideMenu active="inicio" pending={pending} />
          </div>
        </div>
        <div className="order-1 lg:order-none lg:pt-4">
          {/* Raised a tenth of its height over the bottom line of the menu */}
          <StoreSlot className="mx-auto w-full max-w-[360px] sm:max-w-[420px] lg:-translate-y-[10%] xl:max-w-[600px]" />
        </div>
      </div>
      <div className="relative z-10 flex flex-col gap-5 [.vt_&]:[view-transition-name:home-panels] xl:pt-4">
        <WeekBanner plan={plan} />
        <RecipesPanel plan={plan} />
        <ProductsPanel plan={plan} />
      </div>
    </div>
  );
}
