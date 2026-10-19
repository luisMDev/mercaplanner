import { useEffect, useState } from "react";
import { applyTheme, loadTheme, saveTheme, systemDarkQuery, type Theme } from "@/features/theme/theme";

// Theme picked in the footer, saved in localStorage. "auto" follows the system
// setting, also when it changes with the page open
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(loadTheme);

  useEffect(() => {
    saveTheme(theme);
    applyTheme(theme);
    if (theme !== "auto") return;
    const query = systemDarkQuery();
    const onChange = () => applyTheme("auto");
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [theme]);

  return [theme, setTheme] as const;
}
