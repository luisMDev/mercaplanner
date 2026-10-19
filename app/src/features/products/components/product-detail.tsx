import { ExternalLinkIcon, ShoppingBagIcon } from "lucide-react";
import { useState } from "react";
import { BackLink } from "@/components/cozy/back-link";
import { CtaButton } from "@/components/cozy/cta-button";
import { Panel } from "@/components/cozy/panel";
import { Stepper } from "@/components/cozy/stepper";
import { Tag } from "@/components/cozy/tag";
import { EmptyText } from "@/components/shared/muted-text";
import { useBasket } from "@/features/basket/basket-context";
import { recipesWithProduct } from "@/features/plan/model/recipes";
import type { Plan } from "@/features/plan/model/types";
import { fmtEur } from "@/lib/format";
import type { Catalog } from "../model/catalog";
import { fmtPack, fmtQty, fmtReferencePrice, isEstimated, per100 } from "../model/format";
import { PRODUCTS_FILE } from "../model/parse";
import type { Producto } from "../model/types";
import { CategoryArt } from "./category-art";
import { NutritionGrid } from "./nutrition-grid";
import { ProductTile } from "./product-tile";

type DetailProps = {
  plan: Plan;
  catalog: Catalog;
  id: string;
  onBack: () => void;
  onOpenProduct: (id: string) => void;
  onOpenRecipe: (id: string) => void;
  onOpenBasket: () => void;
};

// Packs stepper and "AÑADIR A LA CESTA", with what is already in it
function AddToBasket({ p, onOpenBasket }: { p: Producto; onOpenBasket: () => void }) {
  const basket = useBasket();
  const [packs, setPacks] = useState(1);
  const inBasket = basket.state.products[p.id] ?? 0;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <Stepper value={packs} onChange={setPacks} label="Unidades" />
        <CtaButton onClick={() => basket.addProduct(p.id, packs)}>
          Añadir a la cesta <ShoppingBagIcon />
        </CtaButton>
      </div>
      {inBasket > 0 && (
        <p className="text-[0.85rem] text-muted-foreground">
          Llevas {inBasket} en la cesta ·{" "}
          <button type="button" className="cursor-pointer font-semibold text-primary hover:underline" onClick={onOpenBasket}>
            Ver la cesta
          </button>
        </p>
      )}
    </div>
  );
}

// Same subsection, for the strip at the bottom
function related(catalog: Catalog, p: Producto) {
  return catalog.products.filter((o) => o.seccion === p.seccion && o.id !== p.id).slice(0, 8);
}

// Product opened from the grid, a recipe or the basket: everything about it
export function ProductDetail({ plan, catalog, id, onBack, onOpenProduct, onOpenRecipe, onOpenBasket }: DetailProps) {
  const p = catalog.byId.get(id);
  if (!p) {
    return (
      <Panel className="flex flex-col items-start gap-3">
        <BackLink onClick={onBack}>Todos los productos</BackLink>
        <EmptyText>Este producto ya no está en {PRODUCTS_FILE}.</EmptyText>
      </Panel>
    );
  }
  const usedIn = recipesWithProduct(plan, p.id);
  const strip = related(catalog, p);
  return (
    <Panel key={p.id} className="bg-linear-to-br from-card/60 via-card/50 to-primary-soft/40 p-5 sm:p-8">
      <BackLink onClick={onBack} className="mb-4 @3xl:hidden">
        Todos los productos
      </BackLink>
      <div className="grid gap-6 @3xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] @3xl:items-center @3xl:gap-8">
        <div className="flex flex-col items-center gap-3">
          <CategoryArt
            categoria={p.categoria}
            className="w-full max-w-40 rounded-[2rem] shadow-lift animate-float @3xl:max-w-72 @3xl:rounded-[2.5rem]"
          />
          <p className="font-script text-2xl text-muted-foreground @max-3xl:hidden">valores por {per100(p)}</p>
        </div>
        <div className="flex min-w-0 flex-col items-start gap-4">
          <BackLink onClick={onBack} className="@max-3xl:hidden">
            Todos los productos
          </BackLink>
          <p className="caps font-semibold text-foreground">
            {p.categoria} · {p.subcategoria}
          </p>
          <h2 className="font-display text-[clamp(1.9rem,1.4rem+1.6vw,2.8rem)] leading-[1.05] font-semibold text-primary italic">
            {p.nombre}
          </h2>
          <p className="flex flex-wrap items-baseline gap-x-2.5 tabular-nums">
            <span className="text-2xl font-medium">{fmtEur(p.precio_eur)}</span>
            <span className="text-muted-foreground">{fmtReferencePrice(p)}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {[p.marca, p.envase, fmtQty(p), fmtPack(p)].filter(Boolean).map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
            {isEstimated(p) && <Tag className="border-gold/50 bg-gold-soft text-warning">Valores estimados</Tag>}
          </div>
          <div className="@container w-full">
            <NutritionGrid p={p} />
          </div>
          <AddToBasket key={p.id} p={p} onOpenBasket={onOpenBasket} />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.9rem]">
            {p.url && (
              <a
                href={p.url}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
              >
                Ver en Mercadona <ExternalLinkIcon className="size-3.5" />
              </a>
            )}
            {usedIn.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onOpenRecipe(r.id)}
                className="cursor-pointer font-serif text-muted-foreground italic underline decoration-border underline-offset-4 hover:text-primary"
              >
                Lo usa: {r.nombre}
              </button>
            ))}
          </div>
        </div>
      </div>
      {strip.length > 0 && (
        <div className="mt-8 border-t border-dashed pt-5">
          <p className="caps mb-3 text-muted-foreground">Más de {p.seccion}</p>
          <div className="no-scrollbar -mx-2 flex snap-x gap-1 overflow-x-auto">
            {strip.map((o) => (
              <div key={o.id} className="w-32 shrink-0 snap-start">
                <ProductTile p={o} compact onOpen={onOpenProduct} />
              </div>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}
