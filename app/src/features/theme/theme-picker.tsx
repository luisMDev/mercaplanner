"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { THEMES, type Theme } from "@/features/theme/theme";

const ICONS = { auto: MonitorIcon, light: SunIcon, dark: MoonIcon };

export function ThemePicker({ theme, onChange }: { theme: Theme; onChange: (theme: Theme) => void }) {
  return (
    <ToggleGroup
      type="single"
      value={theme}
      // Radix lets a single group clear its value; the theme always has one
      onValueChange={(value) => value && onChange(value as Theme)}
      variant="outline"
      size="sm"
      spacing={0}
      aria-label="Tema"
      className="bg-card"
    >
      {(Object.keys(THEMES) as Theme[]).map((t) => {
        const Icon = ICONS[t];
        return (
          <ToggleGroupItem
            key={t}
            value={t}
            className="px-3 data-[state=on]:bg-primary-soft data-[state=on]:text-primary-strong"
          >
            <Icon data-icon="inline-start" />
            {THEMES[t]}
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
}
