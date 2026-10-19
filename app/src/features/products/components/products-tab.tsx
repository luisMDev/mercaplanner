"use client";

import { Suspense, use } from "react";
import { fetchProducts } from "../model/fetch-products";
import type { Producto } from "../model/types";
import { ProductDetail } from "./product-detail";
import { ProductsList } from "./products-list";
import { ProductsError, ProductsSkeleton } from "./products-states";

type ProductsTabProps = {
  // Products from a JSON picked by hand, in place of productos.json
  picked: Producto[] | null;
  pickError: string | null;
  onPick: (text: string) => void;
  // Product opened from a recipe ingredient
  target: string | null;
  onClearTarget: () => void;
};

function ProductsContent({ products, target, onClearTarget }: { products: Producto[] } & Pick<ProductsTabProps, "target" | "onClearTarget">) {
  if (target) return <ProductDetail product={products.find((p) => p.id === target)} onBack={onClearTarget} />;
  return <ProductsList products={products} />;
}

function FetchedProducts({ pickError, onPick, ...props }: Omit<ProductsTabProps, "picked">) {
  const result = use(fetchProducts());
  if (!result.ok) return <ProductsError error={result.error} pickError={pickError} onPick={onPick} />;
  return <ProductsContent products={result.products} {...props} />;
}

/* Productos: food products from the Mercadona catalog, with search, category
   filter and sorting. productos.json is fetched the first time the tab opens */
export function ProductsTab({ picked, ...props }: ProductsTabProps) {
  if (picked) return <ProductsContent products={picked} target={props.target} onClearTarget={props.onClearTarget} />;
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <FetchedProducts {...props} />
    </Suspense>
  );
}
