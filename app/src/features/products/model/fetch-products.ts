import { parseProducts } from "./parse";
import type { Producto } from "./types";

export type ProductsResult = { ok: true; products: Producto[] } | { ok: false; error: string };

let request: Promise<ProductsResult> | null = null;

// productos.json weighs ~1.6 MB, so the build emits it as a static asset (with
// a content hash in its name) and the page fetches it the first time the
// Productos tab opens. One request per page load, shared by every mount
export function fetchProducts() {
  request ??= fetch(new URL("../../../../../productos.json", import.meta.url))
    .then((r) => {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.text();
    })
    .then((text): ProductsResult => ({ ok: true, products: parseProducts(text) }))
    .catch((err: Error): ProductsResult => ({ ok: false, error: err.message }));
  return request;
}
