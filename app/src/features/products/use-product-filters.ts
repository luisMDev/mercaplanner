import { useState } from "react";
import { DEFAULT_FILTERS, PRODUCTS_PAGE, type ProductFilters } from "./model/filter";

// Search, filters and page of the product grid. Kept by the view, so they are
// still there when coming back from a product
export function useProductFilters() {
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [limit, setLimit] = useState(PRODUCTS_PAGE);
  return {
    filters,
    limit,
    // Back to the first page whenever the filters change
    change(change: Partial<ProductFilters>) {
      setFilters((f) => ({ ...f, ...change }));
      setLimit(PRODUCTS_PAGE);
    },
    more: () => setLimit((l) => l + PRODUCTS_PAGE * 2),
  };
}

export type ProductFiltersState = ReturnType<typeof useProductFilters>;
