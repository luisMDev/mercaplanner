import type { ReactNode } from "react";

// "Sin comidas planificadas.", "Ninguna receta coincide con la búsqueda."
export function EmptyText({ children }: { children: ReactNode }) {
  return <p className="px-1 py-6 text-center text-muted-foreground italic">{children}</p>;
}

// "3 recetas", "2.966 productos · valores por 100 g o 100 ml"
export function CountText({ children }: { children: ReactNode }) {
  return <p className="px-1 text-[0.85rem] text-muted-foreground tabular-nums">{children}</p>;
}
