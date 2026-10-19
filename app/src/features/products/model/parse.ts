import { normalize } from "@/lib/format";
import type { Producto } from "./types";

export const PRODUCTS_FILE = "productos.json";

export function parseProducts(raw: unknown): Producto[] {
  const d = (typeof raw === "string" ? JSON.parse(raw) : raw) as { productos?: Omit<Producto, "_text">[] } | null;
  if (!d || !Array.isArray(d.productos)) throw new Error('El JSON necesita "productos".');
  return d.productos.map((p) => ({
    ...p,
    _text: normalize([p.nombre, p.marca, p.categoria, p.subcategoria, p.seccion].join(" ")),
  }));
}
