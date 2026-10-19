import { cn } from "@/lib/utils";
import type { Section } from "../model/routes";
import { SECTIONS } from "../sections";
import { navigate } from "../use-route";

// Tab bar pinned to the bottom of a phone or tablet, within thumb's reach
export function BottomNav({ active, pending }: { active: Section; pending: number }) {
  return (
    <nav
      aria-label="Secciones"
      className="fixed inset-x-0 bottom-0 z-40 rounded-t-3xl border-t border-white/70 bg-card/95 px-[max(8px,env(safe-area-inset-left))] pt-1.5 pb-[max(8px,env(safe-area-inset-bottom))] shadow-[0_-12px_30px_-18px_rgb(110_75_40/0.45)] backdrop-blur-md lg:hidden dark:border-white/5"
    >
      <ul className="mx-auto grid max-w-xl grid-cols-6">
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => navigate({ section: id })}
              aria-current={id === active ? "page" : undefined}
              className={cn(
                "relative flex w-full cursor-pointer flex-col items-center gap-0.5 py-1 text-[0.68rem] font-medium text-muted-foreground",
                id === active && "text-primary",
              )}
            >
              <span
                className={cn(
                  "grid h-8 w-12 place-items-center rounded-full transition-colors",
                  id === active && "bg-primary-soft",
                )}
              >
                <Icon className="size-5" strokeWidth={id === active ? 2 : 1.7} />
              </span>
              {label}
              {id === "cesta" && pending > 0 && (
                <span className="absolute top-0 right-[calc(50%-1.4rem)] grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[0.62rem] font-semibold text-primary-foreground tabular-nums">
                  {pending}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
