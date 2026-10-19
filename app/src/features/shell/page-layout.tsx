import type { ReactNode } from "react";
import { ScriptHeading, Squiggle } from "@/components/cozy/script-heading";
import { StoreSlot } from "@/components/cozy/store/store-stage";
import { cn } from "@/lib/utils";

// Layout of every section but Inicio: on the left the handwritten title and,
// down at the bottom of the screen, the little store ("estás aquí"); on the
// right the section's panel. Stacked on a phone, without the store; and
// without the title when a panel is open (detail), which brings its own way
// back
export function PageLayout({
  title,
  detail = false,
  children,
}: {
  title: string;
  detail?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-6 pt-2 lg:grid-cols-[minmax(240px,300px)_minmax(0,1fr)] lg:gap-10 lg:pt-8">
      <aside
        className={cn(
          "relative z-10 flex flex-col items-start gap-3 lg:sticky lg:top-28 lg:h-[calc(100dvh-8.5rem)] lg:self-start",
          detail && "max-lg:hidden",
        )}
      >
        <ScriptHeading className="mt-1 text-[clamp(3.2rem,2.6rem+2.4vw,4.6rem)]">{title}</ScriptHeading>
        <Squiggle className="max-lg:hidden" />
        <StoreSlot here className="mt-auto hidden w-full max-w-[300px] lg:block" />
      </aside>
      {/* Over the store and its park (z-10), also in view transitions (globals.css) */}
      <div className="relative z-10 min-w-0 [.vt_&]:[view-transition-name:panel]">{children}</div>
    </div>
  );
}
