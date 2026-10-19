import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Section } from "../model/routes";
import { SECTIONS } from "../sections";
import { navigate } from "../use-route";

// Big buttons down the left of Inicio, one per section, the open one in red
export function SideMenu({ active, pending }: { active: Section; pending: number }) {
  return (
    <nav aria-label="Menú" className="flex flex-col gap-3">
      {SECTIONS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => navigate({ section: id })}
          aria-current={id === active ? "page" : undefined}
          className={cn(
            "group flex h-14 cursor-pointer items-center gap-4 rounded-2xl border border-white/70 glass px-5 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift dark:border-white/5",
            id === active && "border-transparent bg-primary text-primary-foreground shadow-[0_12px_24px_-12px_var(--primary)]",
          )}
        >
          <Icon className={cn("size-5 shrink-0", id !== active && "text-foreground/80")} strokeWidth={1.7} />
          <span className="caps flex-1 text-[0.8rem] font-semibold">{label}</span>
          {id === "cesta" && pending > 0 && (
            <span
              className={cn(
                "rounded-full bg-primary-soft px-2 py-0.5 text-[0.72rem] font-semibold text-primary tabular-nums",
                id === active && "bg-white/25 text-primary-foreground",
              )}
            >
              {pending}
            </span>
          )}
          <ChevronRightIcon className="size-4 shrink-0 opacity-50 transition-transform group-hover:translate-x-0.5" />
        </button>
      ))}
    </nav>
  );
}
