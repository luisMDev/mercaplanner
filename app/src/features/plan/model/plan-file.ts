import recetasJson from "../../../../../recetas.json";
import { parsePlan } from "./parse";

export const DATA_FILE = "recetas.json";

// recetas.json from the repository root, bundled at build time (and hot
// reloaded by `npm run dev` when it changes)
export const FILE_PLAN = parsePlan(recetasJson);
