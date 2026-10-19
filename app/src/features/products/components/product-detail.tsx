import { CountText, EmptyText } from "@/components/shared/muted-text";
import { Button } from "@/components/ui/button";
import { PRODUCTS_FILE } from "../model/parse";
import type { Producto } from "../model/types";
import { ProductCard } from "./product-card";

// Product opened from a recipe ingredient: only that one, and a way back to all
export function ProductDetail({ product, onBack }: { product: Producto | undefined; onBack: () => void }) {
  return (
    <div className="flex flex-col gap-3">
      <CountText>Producto de la receta</CountText>
      {product ? <ProductCard p={product} /> : <EmptyText>Este producto ya no está en {PRODUCTS_FILE}.</EmptyText>}
      <Button variant="outline" className="self-center rounded-full" onClick={onBack}>
        Ver todos los productos
      </Button>
    </div>
  );
}
