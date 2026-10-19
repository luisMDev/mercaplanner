"use client";

import { BasketProvider, useBasket } from "@/features/basket/basket-context";
import { pendingCount } from "@/features/basket/model/basket";
import { usePlan } from "@/features/plan/use-plan";
import { CatalogProvider } from "@/features/products/catalog-context";
import { useMounted } from "@/hooks/use-mounted";
import { AppSkeleton } from "./app-skeleton";
import { AppHeader } from "./header/app-header";
import { BottomNav } from "./nav/bottom-nav";
import { FooterBar } from "./nav/footer-bar";
import { SectionView } from "./section-view";
import { useRoute } from "./use-route";

function DietAppClient() {
  const route = useRoute();
  const { plan, source, pickError, pick } = usePlan();
  const pending = pendingCount(plan, useBasket().state);

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader active={route.section} pending={pending} file={{ plan, source, pickError, onPick: pick }} />
      <main className="mx-auto w-full max-w-[1480px] flex-1 px-4 pb-32 sm:px-6 lg:px-10 lg:pb-0">
        <SectionView route={route} plan={plan} pending={pending} />
      </main>
      <FooterBar active={route.section} recipes={plan.recetas.length} />
      <BottomNav active={route.section} pending={pending} />
    </div>
  );
}

// Everything depends on the device (today's date, the URL hash, the basket and
// theme in localStorage), so it renders once in the browser; the prerendered
// page shows a skeleton in its place
export function DietApp() {
  if (!useMounted()) return <AppSkeleton />;
  return (
    <CatalogProvider>
      <BasketProvider>
        <DietAppClient />
      </BasketProvider>
    </CatalogProvider>
  );
}
