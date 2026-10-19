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

export const MONTHS_SHORT = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

// Monday-first index into DIAS of the device's local date
export function todayDia(now: Date): Dia {
  return DIAS[(now.getDay() + 6) % 7];
}
