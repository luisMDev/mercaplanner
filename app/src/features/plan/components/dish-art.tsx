import Image from "next/image";
import { cn } from "@/lib/utils";
import { dishColors, dishVessel } from "../model/dish-colors";
import { mealColor } from "../model/meals";
import { recipeImage } from "../model/recipe-images";
import type { Receta } from "../model/types";

// Pieces of food piled on the dish: [x, y, radius], back to front
const PLATE_FOOD: [number, number, number][] = [
  [100, 70, 13],
  [102, 82, 21],
  [70, 90, 19],
  [130, 90, 18],
  [86, 96, 16],
  [116, 98, 16],
];
const BOWL_FOOD: [number, number, number][] = [
  [100, 72, 15],
  [76, 80, 15],
  [124, 80, 14],
  [90, 86, 13],
  [112, 86, 13],
];

const INK = "var(--ink)";

function Food({ pieces, colors }: { pieces: [number, number, number][]; colors: string[] }) {
  return pieces.map(([x, y, r], i) => (
    <g key={i}>
      <ellipse cx={x} cy={y} rx={r} ry={r * 0.74} fill={colors[i % colors.length]} stroke={INK} strokeWidth="2" />
      <ellipse cx={x - r * 0.35} cy={y - r * 0.3} rx={r * 0.32} ry={r * 0.15} fill="#fff" opacity=".5" />
    </g>
  ));
}

function Garnish({ y }: { y: number }) {
  return (
    <g fill="var(--green)" stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
      <path d={`M98 ${y}c-10-2-16-8-17-15 8 0 15 5 17 15Z`} />
      <path d={`M101 ${y}c3-9 10-14 18-14-1 8-8 13-18 14Z`} />
    </g>
  );
}

function Plate({ colors }: { colors: string[] }) {
  return (
    <>
      <ellipse cx="100" cy="106" rx="86" ry="32" fill="#fffdf7" stroke={INK} strokeWidth="2.5" />
      <ellipse cx="100" cy="102" rx="62" ry="21" fill="#f3eadb" stroke={INK} strokeOpacity=".3" strokeWidth="1.2" />
      <Food pieces={PLATE_FOOD} colors={colors} />
      <Garnish y={64} />
    </>
  );
}

function Bowl({ colors, band }: { colors: string[]; band: string }) {
  return (
    <>
      <ellipse cx="100" cy="84" rx="64" ry="16" fill="#e9dcc6" stroke={INK} strokeWidth="2.2" />
      <Food pieces={BOWL_FOOD} colors={colors} />
      <Garnish y={66} />
      <path
        d="M36 84C36 105 164 105 164 84 162 126 132 136 100 136S38 126 36 84Z"
        fill="#fffdf7"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M46 112c26 13 82 13 108 0" fill="none" stroke={band} strokeWidth="4" strokeLinecap="round" />
    </>
  );
}

// Little tomato and lime slice next to the dish, for the big drawings
function Sides() {
  return (
    <g stroke={INK} strokeWidth="2">
      <circle cx="26" cy="118" r="15" fill="var(--tomato)" />
      <path d="M20 106l6 3 6-3-3 5 5 2-6 1-2 4-2-4-6-1 5-2Z" fill="var(--green)" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="176" cy="120" r="13" fill="#d7ec9c" />
      <circle cx="176" cy="120" r="9" fill="#b9dc6a" strokeWidth="1" />
      <path d="M176 111v18M167 120h18M170 114l12 12M182 114l-12 12" stroke="#f4fbe0" strokeWidth="1.2" />
    </g>
  );
}

// Drawing of a recipe: its watercolour from imagenes/ when it has one; if not,
// a plate (or a bowl for breakfast and snacks) piled with the colours of its
// ingredients. Both fill the same 4:3 box
export function DishArt({
  receta,
  sides = false,
  className,
}: {
  receta: Receta;
  sides?: boolean;
  className?: string;
}) {
  const image = recipeImage(receta);
  if (image) {
    return (
      <Image
        src={image}
        alt=""
        sizes="(min-width: 768px) 440px, 260px"
        className={cn("aspect-[4/3] h-auto w-full object-contain", className)}
      />
    );
  }
  const colors = dishColors(receta);
  return (
    <svg viewBox="0 0 200 150" aria-hidden="true" className={cn("h-auto w-full", className)}>
      <ellipse cx="100" cy="132" rx="80" ry="10" fill={INK} opacity=".1" />
      {dishVessel(receta) === "bowl" ? (
        <Bowl colors={colors} band={mealColor(receta.tipos[0])} />
      ) : (
        <Plate colors={colors} />
      )}
      {sides && <Sides />}
    </svg>
  );
}
