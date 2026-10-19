import { indexProducts, type Catalog } from "./catalog";
import { parseProducts } from "./parse";

export type CatalogResult = { ok: true; catalog: Catalog } | { ok: false; error: string };

let request: Promise<CatalogResult> | null = null;

// productos.json weighs ~1.6 MB, so the build emits it as a static asset (with
// a content hash in its name) and the page fetches it the first time a view
// needs it. One request per page load, shared by every view
export function fetchProducts() {
  request ??= fetch(new URL("../../../../../productos.json", import.meta.url))
    .then((r) => {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.text();
    })
    .then((text): CatalogResult => ({ ok: true, catalog: indexProducts(parseProducts(text)) }))
    .catch((err: Error): CatalogResult => ({ ok: false, error: err.message }));
  return request;
}
