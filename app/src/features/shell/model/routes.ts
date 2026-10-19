// Sections of the app and what is open in them, kept in the URL hash
// ("#/recetas/causa-limena") so the browser's back button closes a panel

export type Section = "inicio" | "hoy" | "recetas" | "productos" | "semana" | "cesta";

// id: the recipe or product open in its section
export type Route = { section: Section; id?: string };

export const SECTION_IDS: Section[] = ["inicio", "hoy", "recetas", "productos", "semana", "cesta"];

export function parseHash(hash: string): Route {
  const [section, id] = hash.replace(/^#\/?/, "").split("/").map(decodeURIComponent);
  if (!SECTION_IDS.includes(section as Section)) return { section: "inicio" };
  return id ? { section: section as Section, id } : { section: section as Section };
}

export function routeHash({ section, id }: Route) {
  if (section === "inicio") return "#/";
  return "#/" + section + (id ? "/" + encodeURIComponent(id) : "");
}
