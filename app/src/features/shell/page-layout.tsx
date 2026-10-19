import type { ReactNode } from "react";
import { BackLink } from "@/components/cozy/back-link";
import { ScriptHeading, Squiggle } from "@/components/cozy/script-heading";
import { StoreIllustration } from "@/components/cozy/store-illustration";
import { cn } from "@/lib/utils";
import { navigate } from "./use-route";

// Layout of every section but Inicio: on the left the handwritten title and
// the little store ("estás aquí"), on the right the section's panel. Stacked
// on a phone, without the store; and without the title when a panel is open
// (detail), which brings its own way back
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
      <aside className={cn("flex flex-col items-start gap-3 lg:sticky lg:top-28 lg:self-start", detail && "max-lg:hidden")}>
        <BackLink onClick={() => navigate({ section: "inicio" })}>Volver a la tienda</BackLink>
        <ScriptHeading className="mt-1 text-[clamp(3.2rem,2.6rem+2.4vw,4.6rem)]">{title}</ScriptHeading>
        <Squiggle className="max-lg:hidden" />
        <StoreIllustration here className="mt-16 hidden w-full max-w-[300px] lg:block" />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
