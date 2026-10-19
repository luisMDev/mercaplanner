import { readStorage, writeStorage } from "@/lib/storage";

export type Theme = "auto" | "light" | "dark";

export const THEMES: Record<Theme, string> = {
  auto: "Automático",
  light: "Claro",
  dark: "Oscuro",
};

const THEME_KEY = "dieta-theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

// Runs in <head> before the first paint so a saved dark theme does not flash
// the light one while React loads. Same rule as applyTheme and loadTheme:
// light unless "dark", or "auto" on a dark system
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_KEY)});var d=t==="dark"||(t==="auto"&&matchMedia(${JSON.stringify(DARK_QUERY)}).matches);document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;

// Light by default; "auto" (follow the system) and dark only when picked
export function loadTheme(): Theme {
  const theme = readStorage(THEME_KEY);
  return theme === "auto" || theme === "dark" ? theme : "light";
}

export function saveTheme(theme: Theme) {
  writeStorage(THEME_KEY, theme);
}

export function systemDarkQuery() {
  return window.matchMedia(DARK_QUERY);
}

// shadcn's dark variant hangs off the "dark" class on <html>
export function applyTheme(theme: Theme) {
  const dark = theme === "dark" || (theme === "auto" && systemDarkQuery().matches);
  document.documentElement.classList.toggle("dark", dark);
}
