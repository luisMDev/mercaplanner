import {
  AppleIcon,
  BabyIcon,
  BeefIcon,
  CakeSliceIcon,
  CandyIcon,
  CitrusIcon,
  CoffeeIcon,
  CookieIcon,
  CroissantIcon,
  DropletsIcon,
  EggIcon,
  FishIcon,
  GlassWaterIcon,
  HamIcon,
  PizzaIcon,
  PopcornIcon,
  ShoppingBasketIcon,
  SnowflakeIcon,
  SoupIcon,
  WheatIcon,
  WineIcon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "red" | "green" | "gold" | "teal" | "plum";

// Icon and colour of each Mercadona category; a new one gets a basket
const CATEGORY_ART: Record<string, [LucideIcon, Tone]> = {
  "Aceite, especias y salsas": [DropletsIcon, "gold"],
  "Agua y refrescos": [GlassWaterIcon, "teal"],
  Aperitivos: [PopcornIcon, "gold"],
  "Arroz, legumbres y pasta": [WheatIcon, "gold"],
  "Azúcar, caramelos y chocolate": [CandyIcon, "plum"],
  Bebé: [BabyIcon, "teal"],
  Bodega: [WineIcon, "plum"],
  "Cacao, café e infusiones": [CoffeeIcon, "red"],
  Carne: [BeefIcon, "red"],
  "Cereales y galletas": [CookieIcon, "gold"],
  "Charcutería y quesos": [HamIcon, "red"],
  Congelados: [SnowflakeIcon, "teal"],
  "Conservas, caldos y cremas": [SoupIcon, "red"],
  "Fruta y verdura": [AppleIcon, "green"],
  "Huevos, leche y mantequilla": [EggIcon, "gold"],
  "Marisco y pescado": [FishIcon, "teal"],
  "Panadería y pastelería": [CroissantIcon, "gold"],
  "Pizzas y platos preparados": [PizzaIcon, "red"],
  "Postres y yogures": [CakeSliceIcon, "plum"],
  Zumos: [CitrusIcon, "green"],
};

const TONES: Record<Tone, string> = {
  red: "bg-primary-soft text-primary",
  green: "bg-green-soft text-green",
  gold: "bg-gold-soft text-gold",
  teal: "bg-teal-soft text-teal",
  plum: "bg-plum-soft text-plum",
};

// Rounded tile with the category's icon, in place of a product photo
export function CategoryArt({ categoria, className }: { categoria: string; className?: string }) {
  const [Icon, tone] = CATEGORY_ART[categoria] ?? [ShoppingBasketIcon, "green"];
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative grid aspect-square place-items-center overflow-hidden rounded-2xl [&_svg]:size-[42%] [&_svg]:stroke-[1.5]",
        TONES[tone],
        // A soft highlight in one corner, like light on paper
        "before:absolute before:-top-1/4 before:-left-1/4 before:size-3/4 before:rounded-full before:bg-white/40 dark:before:bg-white/5",
        className,
      )}
    >
      <Icon className="relative" />
    </div>
  );
}
