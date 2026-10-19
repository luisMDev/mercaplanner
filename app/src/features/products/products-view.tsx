"use client";

import { Panel } from "@/components/cozy/panel";
import type { Plan } from "@/features/plan/model/types";
import { navigate } from "@/features/shell/use-route";
import { PageLayout } from "@/features/shell/page-layout";
import { WithCatalog } from "./catalog-context";
import { ProductCatalog } from "./components/product-catalog";
import { ProductDetail } from "./components/product-detail";
import { ProductsSkeleton } from "./components/products-states";
import { useProductFilters } from "./use-product-filters";

/* Productos: the food of the Mercadona catalog, and the panel of the open one.
   productos.json is fetched the first time a view needs it */
export function ProductsView({ plan, openId }: { plan: Plan; openId?: string }) {
  const filters = useProductFilters();
  const open = (id: string) => navigate({ section: "productos", id });
  return (
    <PageLayout title="La despensa" tagline="Lo que hay en Mercadona · Por 100 g" detail={!!openId}>
      <WithCatalog
        fallback={
          <Panel>
            <ProductsSkeleton />
          </Panel>
        }
      >
        {(catalog) =>
          openId ? (
            <ProductDetail
              plan={plan}
              catalog={catalog}
              id={openId}
              onBack={() => navigate({ section: "productos" })}
              onOpenProduct={open}
              onOpenRecipe={(id) => navigate({ section: "recetas", id })}
              onOpenBasket={() => navigate({ section: "cesta" })}
            />
          ) : (
            <ProductCatalog catalog={catalog} state={filters} onOpen={open} />
          )
        }
      </WithCatalog>
    </PageLayout>
  );
}
