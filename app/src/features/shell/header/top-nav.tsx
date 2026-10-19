import { cn } from "@/lib/utils";
import type { Section } from "../model/routes";
import { SECTIONS } from "../sections";
import { navigate } from "../use-route";

// "INICIO  HOY  RECETAS …" across the top on a wide screen, the open one underlined
export function TopNav({ active, className }: { active: Section; className?: string }) {
  return (
    <nav aria-label="Secciones" className={cn("items-center gap-1 xl:gap-3", className)}>
      {SECTIONS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => navigate({ section: id })}
          aria-current={id === active ? "page" : undefined}
          className={cn(
            "caps relative cursor-pointer px-2 py-3 text-[0.74rem] font-medium tracking-[0.16em] xl:px-3 xl:tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground",
            "after:absolute after:inset-x-0 after:bottom-1 after:mx-auto after:h-0.5 after:w-0 after:rounded-full after:bg-primary after:transition-all",
            id === active && "font-semibold text-foreground after:w-8",
          )}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
