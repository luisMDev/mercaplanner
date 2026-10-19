import { fmtDec, fmtEur } from "@/lib/format";
import type { Producto } from "./types";

// 1000 g -> 1 kg, 330 ml -> 330 ml
export function fmtQty(p: Producto) {
  if (p.cantidad_neta == null) return null;
  let n = p.cantidad_neta;
  let u = p.unidad;
  if ((u === "g" || u === "ml") && n >= 1000) {
    n = n / 1000;
    u = u === "g" ? "kg" : "l";
  }
  return (p.peso_aproximado ? "~" : "") + fmtDec(n, 2) + " " + u;
}

export function fmtPack(p: Producto) {
  return Number.isInteger(p.unidades_pack) && p.unidades_pack! > 1 ? p.unidades_pack + " uds." : null;
}

// "(1,85 €/L)"
export function fmtReferencePrice(p: Producto) {
  return p.precio_referencia_eur != null ? `(${fmtEur(p.precio_referencia_eur)}/${p.formato_referencia ?? ""})` : null;
}

// Nutrition values are per 100 ml for liquids, per 100 g for the rest
export function per100(p: Producto) {
  return p.unidad === "ml" ? "100 ml" : "100 g";
}

export function isEstimated(p: Producto) {
  return p.fuente_nutricion === "generico_estimado";
}
