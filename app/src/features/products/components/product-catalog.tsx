import { useMemo } from "react";
import { PanelHeader, Panel } from "@/components/cozy/panel";
import { CountText, EmptyText } from "@/components/shared/muted-text";
import { SearchField } from "@/components/shared/search-field";
import { CtaButton } from "@/components/cozy/cta-button";
import { fmtNum, plural } from "@/lib/format";
import type { Catalog } from "../model/catalog";
import { categories, filterProducts } from "../model/filter";
import type { ProductFiltersState } from "../use-product-filters";
import { ProductFilterSelects } from "./product-filters";
import { ProductTile } from "./product-tile";

// Search, category filter, sort order and the matching products, a page at a time
export function ProductCatalog({
  catalog,
  state: { filters, limit, change: changeFilters, more },
  onOpen,
}: {
  catalog: Catalog;
  state: ProductFiltersState;
  onOpen: (id: string) => void;
}) {
  const { products } = catalog;
  const cats = useMemo(() => categories(products), [products]);
  const list = useMemo(() => filterProducts(products, filters), [products, filters]);

  return (
    <Panel className="animate-panel flex flex-col gap-4">
      <PanelHeader title="Todos los productos" className="mb-0" />
      <SearchField
        value={filters.query}
        onChange={(query) => changeFilters({ query })}
        placeholder="Buscar producto, marca o sección"
      />
      <ProductFilterSelects categories={cats} filters={filters} onChange={changeFilters} />
      <CountText>{plural(list.length, "producto", "productos")} · valores por 100 g o 100 ml</CountText>
      {list.length ? (
        <div className="grid grid-cols-2 gap-x-2 gap-y-3 @lg:grid-cols-3 @3xl:grid-cols-4 @4xl:grid-cols-5">
          {list.slice(0, limit).map((p) => (
            <ProductTile key={p.id} p={p} onOpen={onOpen} />
          ))}
        </div>
      ) : (
        <EmptyText>Ningún producto coincide con la búsqueda.</EmptyText>
      )}
      {list.length > limit && (
        <CtaButton variant="outline" className="self-center" onClick={more}>
          Ver más ({fmtNum(list.length - limit)} restantes)
        </CtaButton>
      )}
    </Panel>
  );
}
