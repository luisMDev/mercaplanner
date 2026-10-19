import { normalize } from "@/lib/format";
import { ingText } from "./recipes";
import type { Receta } from "./types";

// Food colours for the drawing of a recipe's plate, picked from the words of
// its ingredients: a causa is yellow, pink and green, a burger brown and orange
const FOOD_COLORS: [RegExp, string][] = [
  [/patata|pure|huevo|maiz|platano|pina|mango|limon|curry/, "#f3cf6b"],
  [/tomate|fresa|frambuesa|pimiento rojo|sandia|cereza/, "#e1574a"],
  [/aguacate|lima|espinaca|lechuga|brocoli|calabacin|guisante|pepino|kiwi|rucula|judia/, "#8fbf5c"],
  [/atun|salmon|gamba|langostino/, "#ee9f86"],
  [/cordero|ternera|hamburguesa|carne|cerdo|lomo|chorizo|jamon/, "#a5623f"],
  [/pollo|pavo|garbanzo|lenteja|avena|pan|tostada|pasta|quinoa/, "#e2bf8a"],
  [/batata|zanahoria|calabaza|naranja|melocoton/, "#f0904a"],
  [/queso|yogur|leche|nata|arroz|coliflor|cebolla|kefir/, "#fbf4e4"],
  [/arandano|berenjena|lombarda|uva|remolacha|ciruela/, "#8a5aa0"],
  [/chocolate|cacao|cafe|nuez|almendra|setas|champinon/, "#7b4f35"],
];

const FALLBACK = ["#e2bf8a", "#8fbf5c", "#e1574a", "#f3cf6b"];

// Up to four colours, in the order the ingredients come
export function dishColors(r: Receta) {
  const colors: string[] = [];
  r.ingredientes.forEach((ing) => {
    const text = normalize(ingText(ing) + " " + (typeof ing === "string" ? "" : (ing.producto_nombre ?? "")));
    FOOD_COLORS.forEach(([re, color]) => {
      if (re.test(text) && !colors.includes(color)) colors.push(color);
    });
  });
  return (colors.length >= 2 ? colors : colors.concat(FALLBACK)).slice(0, 4);
}

// Bowls for the light meals of the day, plates for the rest
export function dishVessel(r: Receta) {
  return ["desayuno", "media-manana", "merienda"].includes(r.tipos[0]) ? "bowl" : "plate";
}
