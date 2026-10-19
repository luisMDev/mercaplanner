import { useState } from "react";
import { parseProducts } from "./model/parse";
import type { Producto } from "./model/types";

// Products from a JSON picked by hand when productos.json cannot be fetched
export function usePickedProducts() {
  const [products, setProducts] = useState<Producto[] | null>(null);
  const [pickError, setPickError] = useState<string | null>(null);

  function pick(text: string) {
    try {
      setProducts(parseProducts(text));
      setPickError(null);
    } catch (err) {
      setPickError("No se pudo cargar el JSON: " + (err instanceof Error ? err.message : String(err)));
    }
  }

  return { products, pickError, pick };
}
