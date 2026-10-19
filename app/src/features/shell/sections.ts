import {
  CalendarDaysIcon,
  ChefHatIcon,
  HouseIcon,
  ShoppingBagIcon,
  StoreIcon,
  SunIcon,
  type LucideIcon,
} from "lucide-react";
import type { Section } from "./model/routes";

// Menu entries, in order: the side menu of Inicio, the top bar and the bottom
// bar on a phone
export const SECTIONS: { id: Section; label: string; icon: LucideIcon }[] = [
  { id: "inicio", label: "Inicio", icon: HouseIcon },
  { id: "hoy", label: "Hoy", icon: SunIcon },
  { id: "recetas", label: "Recetas", icon: ChefHatIcon },
  { id: "productos", label: "Productos", icon: StoreIcon },
  { id: "semana", label: "Semana", icon: CalendarDaysIcon },
  { id: "cesta", label: "Cesta", icon: ShoppingBagIcon },
];
