// Plan days in order, keyed like "semana" (no accents in the keys)
export const DIAS = [
  { id: "lunes", label: "Lunes" },
  { id: "martes", label: "Martes" },
  { id: "miercoles", label: "Miércoles" },
  { id: "jueves", label: "Jueves" },
  { id: "viernes", label: "Viernes" },
  { id: "sabado", label: "Sábado" },
  { id: "domingo", label: "Domingo" },
] as const;

export type Dia = (typeof DIAS)[number];

// Days off ("dias_libres") have no plan and show as "Día libre"
export function isLibre(plan: { libres: string[] }, diaId: string) {
  return plan.libres.includes(diaId);
}

// Monday-first index into DIAS of the device's local date
export function todayDia(now: Date): Dia {
  return DIAS[(now.getDay() + 6) % 7];
}
