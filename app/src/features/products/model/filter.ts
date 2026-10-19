import { normalize } from "@/lib/format";
import type { Producto } from "./types";

export const PRODUCTS_PAGE = 40;

// Sort orders; products without the value go last
export const PRODUCT_SORTS = {
  nombre: { label: "Nombre", key: (p: Producto) => p.nombre.toLowerCase(), dir: 1 },
  proteinas: { label: "Más proteína", key: (p: Producto) => p.proteinas_100, dir: -1 },
  kcal: { label: "Menos calorías", key: (p: Producto) => p.kcal_100, dir: 1 },
  precio: { label: "Más barato (€/kg o €/l)", key: (p: Producto) => p.precio_referencia_eur, dir: 1 },
} as const;

export type ProductSort = keyof typeof PRODUCT_SORTS;

export type ProductFilters = { query: string; categoria: string | null; sort: ProductSort };

export const DEFAULT_FILTERS: ProductFilters = { query: "", categoria: null, sort: "nombre" };

export function categories(products: Producto[]) {
  return [...new Set(products.map((p) => p.categoria))].sort((a, b) => a.localeCompare(b, "es"));
}

// Every word of the query has to appear in the name, brand or sections
export function filterProducts(products: Producto[], { query, categoria, sort }: ProductFilters) {
  const words = normalize(query.trim()).split(/\s+/).filter(Boolean);
  const s = PRODUCT_SORTS[sort];
  return products
    .filter((p) => (!categoria || p.categoria === categoria) && words.every((w) => p._text.includes(w)))
    .sort((a, b) => {
      const x = s.key(a);
      const y = s.key(b);
      if (x == null || y == null) return x == null ? (y == null ? 0 : 1) : -1;
      return (x < y ? -1 : x > y ? 1 : 0) * s.dir;
    });
}
