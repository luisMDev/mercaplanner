import type { Plan, Receta } from "./types";

// Checks the shape the views rely on and indexes recipes by id. Throws a
// message in Spanish, shown as is, when something required is missing
export function parsePlan(raw: unknown): Plan {
  const d = (typeof raw === "string" ? JSON.parse(raw) : raw) as Partial<Plan> | null;
  if (!d || !Array.isArray(d.comidas) || !Array.isArray(d.recetas) || typeof d.semana !== "object" || !d.semana) {
    throw new Error('El JSON necesita "comidas", "recetas" y "semana".');
  }
  const byId: Record<string, Receta> = {};
  d.recetas.forEach((r) => {
    if (!r.id || !r.nombre) throw new Error('Cada receta necesita "id" y "nombre".');
    byId[r.id] = { ...r, tipos: r.tipos ?? [], ingredientes: r.ingredientes ?? [], pasos: r.pasos ?? [] };
  });
  return { comidas: d.comidas, recetas: d.recetas.map((r) => byId[r.id]), byId, semana: d.semana };
}
