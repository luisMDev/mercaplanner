"use client";

import { ShoppingBagIcon } from "lucide-react";
import { Panel } from "@/components/cozy/panel";
import { Notice } from "@/components/shared/notice";
import type { Plan } from "@/features/plan/model/types";
import { WithCatalog } from "@/features/products/catalog-context";
import { ProductsSkeleton } from "@/features/products/components/products-states";
import { PageLayout } from "@/features/shell/page-layout";
import { useBasket } from "./basket-context";
import { pendingCount } from "./model/basket";
import { BasketPanel } from "./components/basket-panel";

/* Cesta: the shopping list for the week's plan, plus what was added by hand
   from a recipe or a product. Ticks are saved on the device */
export function BasketView({ plan }: { plan: Plan }) {
  const { state } = useBasket();
  const empty =
    pendingCount(plan, state) === 0 && state.checked.length === 0 && !Object.keys(state.recipes).length;
  return (
    <PageLayout title="La cesta" tagline="La compra de la semana · Mercadona">
      {empty ? (
        <Notice
          icon={<ShoppingBagIcon />}
          title="La cesta está vacía"
          description="Llena el plan de la semana o añade recetas y productos desde sus paneles."
        />
      ) : (
        <WithCatalog
          fallback={
            <Panel>
              <ProductsSkeleton tiles={4} />
            </Panel>
          }
        >
          {(catalog) => <BasketPanel plan={plan} catalog={catalog} />}
        </WithCatalog>
      )}
    </PageLayout>
  );
}
