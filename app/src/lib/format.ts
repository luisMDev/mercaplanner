export function fmtNum(n: number) {
  return Math.round(n).toLocaleString("es-ES");
}

export function fmtDec(n: number, digits = 1) {
  return n.toLocaleString("es-ES", { maximumFractionDigits: digits });
}

export function fmtEur(n: number) {
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}

// "1 receta", "3 recetas"
export function plural(n: number, one: string, many: string) {
  return fmtNum(n) + " " + (n === 1 ? one : many);
}

// Lowercase without accents, for searching
export function normalize(s: unknown) {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}
