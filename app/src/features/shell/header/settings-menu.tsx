import { SettingsIcon } from "lucide-react";
import { JsonPicker } from "@/components/shared/json-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Plan } from "@/features/plan/model/types";
import { sourceText, type PlanSource } from "@/features/plan/use-plan";
import { ThemePicker } from "@/features/theme/theme-picker";
import { useTheme } from "@/features/theme/use-theme";
import { plural } from "@/lib/format";

export type PlanFile = {
  plan: Plan;
  source: PlanSource;
  pickError: string | null;
  onPick: (text: string) => void;
};

// Gear in the header: theme, where the recipes come from and another JSON to try
export function SettingsMenu({ plan, source, pickError, onPick }: PlanFile) {
  const [theme, setTheme] = useTheme();
  return (
    <Popover>
      <PopoverTrigger
        aria-label="Ajustes"
        className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-foreground transition-colors hover:bg-card aria-expanded:bg-card [&_svg]:size-[22px]"
      >
        <SettingsIcon strokeWidth={1.6} />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 gap-4 rounded-3xl border bg-card p-5 shadow-lift">
        <div className="flex flex-col gap-2">
          <p className="caps font-semibold">Tema</p>
          <ThemePicker theme={theme} onChange={setTheme} />
        </div>
        <div className="flex flex-col items-start gap-2 border-t border-dashed pt-4">
          <p className="caps font-semibold">Datos</p>
          <p className="font-serif text-[0.92rem] text-muted-foreground">
            {sourceText(source)} · {plural(plan.recetas.length, "receta", "recetas")}
          </p>
          <JsonPicker onText={onPick} label="Probar otro recetas.json" />
          {pickError && <p className="text-[0.8rem] text-destructive">{pickError}</p>}
        </div>
      </PopoverContent>
    </Popover>
  );
}
