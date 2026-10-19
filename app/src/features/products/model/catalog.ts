import type { Producto } from "./types";

// The products with an index by id: recipes and the basket link them by id
export type Catalog = { products: Producto[]; byId: Map<string, Producto> };

export function indexProducts(products: Producto[]): Catalog {
  return { products, byId: new Map(products.map((p) => [p.id, p])) };
}
