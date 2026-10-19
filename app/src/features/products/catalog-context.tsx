"use client";

import { createContext, Suspense, use, useState, type ReactNode } from "react";
import { indexProducts, type Catalog } from "./model/catalog";
import { fetchProducts, type CatalogResult } from "./model/fetch-products";
import { parseProducts } from "./model/parse";
import { ProductsError } from "./components/products-states";

type PickedCatalog = {
  // Products from a JSON picked by hand when productos.json cannot be fetched
  picked: Catalog | null;
  pickError: string | null;
  pick: (text: string) => void;
};

const PickedContext = createContext<PickedCatalog>({ picked: null, pickError: null, pick: () => {} });

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [picked, setPicked] = useState<Catalog | null>(null);
  const [pickError, setPickError] = useState<string | null>(null);

  function pick(text: string) {
    try {
      setPicked(indexProducts(parseProducts(text)));
      setPickError(null);
    } catch (err) {
      setPickError("No se pudo cargar el JSON: " + (err instanceof Error ? err.message : String(err)));
    }
  }

  return <PickedContext value={{ picked, pickError, pick }}>{children}</PickedContext>;
}

// Suspends until productos.json is fetched; must render inside <Suspense>
function useCatalogResult(): CatalogResult {
  const { picked } = use(PickedContext);
  return picked ? { ok: true, catalog: picked } : use(fetchProducts());
}

function CatalogGate({ children }: { children: (catalog: Catalog) => ReactNode }) {
  const result = useCatalogResult();
  const { pickError, pick } = use(PickedContext);
  if (!result.ok) return <ProductsError error={result.error} pickError={pickError} onPick={pick} />;
  return children(result.catalog);
}

// Renders its children with the products once they are loaded, the fallback
// meanwhile, and a way to pick productos.json by hand if it fails
export function WithCatalog({ fallback, children }: { fallback: ReactNode; children: (catalog: Catalog) => ReactNode }) {
  return (
    <Suspense fallback={fallback}>
      <CatalogGate>{children}</CatalogGate>
    </Suspense>
  );
}
