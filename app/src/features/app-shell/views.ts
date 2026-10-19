import { Calendar1Icon, CalendarDaysIcon, ShoppingBasketIcon, UtensilsIcon, type LucideIcon } from "lucide-react";
import { readStorage, writeStorage } from "@/lib/storage";

export type View = "hoy" | "recetas" | "semana" | "productos";

export const VIEWS: { id: View; label: string; icon: LucideIcon }[] = [
  { id: "hoy", label: "Hoy", icon: Calendar1Icon },
  { id: "recetas", label: "Recetas", icon: UtensilsIcon },
  { id: "semana", label: "Semana", icon: CalendarDaysIcon },
  { id: "productos", label: "Productos", icon: ShoppingBasketIcon },
];

// The open tab is remembered between visits
const VIEW_KEY = "dieta-view";

export function loadView(): View {
  const view = readStorage(VIEW_KEY);
  return VIEWS.some((v) => v.id === view) ? (view as View) : "hoy";
}

export function saveView(view: View) {
  writeStorage(VIEW_KEY, view);
}
