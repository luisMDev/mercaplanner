import { useMemo, useState } from "react";
import { CountText, EmptyText } from "@/components/shared/muted-text";
import { SearchField } from "@/components/shared/search-field";
import { Button } from "@/components/ui/button";
import { fmtNum, plural } from "@/lib/format";
import { DEFAULT_FILTERS, PRODUCTS_PAGE, categories, filterProducts, type ProductFilters } from "../model/filter";
import type { Producto } from "../model/types";
import { ProductCard } from "./product-card";
import { ProductFilterSelects } from "./product-filters";

// Search, category filter, sort order and the matching products, a page at a time
export function ProductsList({ products }: { products: Producto[] }) {
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [limit, setLimit] = useState(PRODUCTS_PAGE);

  const cats = useMemo(() => categories(products), [products]);
  const list = useMemo(() => filterProducts(products, filters), [products, filters]);

  // Back to the first page whenever the filters change
  function changeFilters(change: Partial<ProductFilters>) {
    setFilters((f) => ({ ...f, ...change }));
    setLimit(PRODUCTS_PAGE);
  }

  return (
    <div className="flex flex-col gap-3">
      <SearchField
        value={filters.query}
        onChange={(query) => changeFilters({ query })}
        placeholder="Buscar producto, marca o sección"
      />
      <ProductFilterSelects categories={cats} filters={filters} onChange={changeFilters} />
      <CountText>{plural(list.length, "producto", "productos")} · valores por 100 g o 100 ml</CountText>
      {list.length ? (
        list.slice(0, limit).map((p) => <ProductCard key={p.id} p={p} />)
      ) : (
        <EmptyText>Ningún producto coincide con la búsqueda.</EmptyText>
      )}
      {list.length > limit && (
        <Button variant="outline" className="self-center rounded-full" onClick={() => setLimit((l) => l + PRODUCTS_PAGE * 2)}>
          Ver más ({fmtNum(list.length - limit)} restantes)
        </Button>
      )}
    </div>
  );
}
