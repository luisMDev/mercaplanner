import { ArrowRightIcon, ShoppingBasketIcon } from "lucide-react";
import { Panel, PanelAction, PanelHeader } from "@/components/cozy/panel";
import { weekProductIds } from "@/features/plan/model/week";
import type { Plan } from "@/features/plan/model/types";
import { WithCatalog } from "@/features/products/catalog-context";
import { ProductTile } from "@/features/products/components/product-tile";
import { ProductsSkeleton } from "@/features/products/components/products-states";
import { navigate } from "@/features/shell/use-route";

// "PARA TU PLAN": the products the week's recipes use most, small, three a row
export function ProductsPanel({ plan }: { plan: Plan }) {
  const ids = weekProductIds(plan).slice(0, 6);
  const open = (id: string) => navigate({ section: "productos", id });
  return (
    <Panel className="p-4 sm:p-5">
      <PanelHeader
        icon={<ShoppingBasketIcon className="size-4 text-primary" />}
        title="Para tu plan"
        action={
          <PanelAction onClick={() => navigate({ section: "productos" })}>
            Despensa <ArrowRightIcon />
          </PanelAction>
        }
      />
      <WithCatalog fallback={<ProductsSkeleton tiles={6} className="grid-cols-3 gap-1 @lg:grid-cols-3" />}>
        {(catalog) => (
          <div className="grid grid-cols-3 gap-1">
            {ids.map((id) => {
              const p = catalog.byId.get(id);
              return p && <ProductTile key={id} p={p} compact onOpen={open} />;
            })}
          </div>
        )}
      </WithCatalog>
    </Panel>
  );
}
