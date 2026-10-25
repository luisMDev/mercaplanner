import { DIAS } from "./days";
import type { Plan, Receta } from "./types";

type RawPlan = Omit<Partial<Plan>, "libres"> & { dias_libres?: unknown };

// Checks the shape the views rely on and indexes recipes by id. Throws a
// message in Spanish, shown as is, when something required is missing
export function parsePlan(raw: unknown): Plan {
  const d = (typeof raw === "string" ? JSON.parse(raw) : raw) as RawPlan | null;
  if (!d || !Array.isArray(d.comidas) || !Array.isArray(d.recetas) || typeof d.semana !== "object" || !d.semana) {
    throw new Error('El JSON necesita "comidas", "recetas" y "semana".');
  }
  const byId: Record<string, Receta> = {};
  d.recetas.forEach((r) => {
    if (!r.id || !r.nombre) throw new Error('Cada receta necesita "id" y "nombre".');
    byId[r.id] = { ...r, tipos: r.tipos ?? [], ingredientes: r.ingredientes ?? [], pasos: r.pasos ?? [] };
  });
  const libres = parseLibres(d.dias_libres);
  const semana = Object.fromEntries(Object.entries(d.semana).filter(([dia]) => !libres.includes(dia)));
  return { comidas: d.comidas, recetas: d.recetas.map((r) => byId[r.id]), byId, semana, libres };
}

// "dias_libres": ids of DIAS, in any order
function parseLibres(raw: unknown): string[] {
  if (raw == null) return [];
  const ids: string[] = DIAS.map((dia) => dia.id);
  if (!Array.isArray(raw) || raw.some((dia) => !ids.includes(dia))) {
    throw new Error(`"dias_libres" tiene que ser una lista de días: ${ids.join(", ")}.`);
  }
  return raw;
}
