import { JsonPicker } from "@/components/shared/json-picker";
import type { Plan } from "@/features/plan/model/types";
import { sourceText, type PlanSource } from "@/features/plan/use-plan";
import { ThemePicker } from "@/features/theme/theme-picker";
import { useTheme } from "@/features/theme/use-theme";
import { plural } from "@/lib/format";

// Where the recipes come from, a picker to try another JSON and the theme
export function AppFooter({
  plan,
  source,
  pickError,
  onPick,
}: {
  plan: Plan;
  source: PlanSource;
  pickError: string | null;
  onPick: (text: string) => void;
}) {
  const [theme, setTheme] = useTheme();
  return (
    <footer className="mt-2.5 flex flex-col items-center gap-3.5 pt-5">
      <p className="text-center text-[0.76rem] text-faint">
        {sourceText(source)} · {plural(plan.recetas.length, "receta", "recetas")}
      </p>
      {pickError && <p className="text-center text-[0.76rem] text-destructive">{pickError}</p>}
      <JsonPicker onText={onPick} />
      <ThemePicker theme={theme} onChange={setTheme} />
    </footer>
  );
}
