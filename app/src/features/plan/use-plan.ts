import { useState } from "react";
import { parsePlan } from "./model/parse";
import { DATA_FILE, FILE_PLAN } from "./model/plan-file";
import type { Plan } from "./model/types";

// Where the recipes come from: recetas.json (bundled at build time) or a JSON
// picked by hand in the footer, which lasts until the page reloads
export type PlanSource = { kind: "file" } | { kind: "picked"; loadedAt: Date };

export function sourceText(source: PlanSource) {
  if (source.kind === "file") return "Recetas de " + DATA_FILE;
  const when = source.loadedAt.toLocaleString("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  return "Recetas del JSON cargado a mano (" + when + ")";
}

export function usePlan() {
  const [data, setData] = useState<{ plan: Plan; source: PlanSource }>({ plan: FILE_PLAN, source: { kind: "file" } });
  const [pickError, setPickError] = useState<string | null>(null);

  function pick(text: string) {
    try {
      const plan = parsePlan(text);
      setPickError(null);
      setData({ plan, source: { kind: "picked", loadedAt: new Date() } });
    } catch (err) {
      setPickError("No se pudo cargar el JSON: " + (err instanceof Error ? err.message : String(err)));
    }
  }

  return { ...data, pickError, pick };
}
