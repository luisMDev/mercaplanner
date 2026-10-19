import { HeartIcon } from "lucide-react";
import { TomatoLogo } from "@/components/cozy/tomato-logo";
import { cn } from "@/lib/utils";

// Logo and name: "Mercaplanner ♥ / PLAN DE DIETA · MERCADONA"
export function Brand({ onClick, small = false }: { onClick?: () => void; small?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Mercaplanner, ir al inicio"
      className="flex shrink-0 cursor-pointer items-center gap-2.5 text-left"
    >
      <TomatoLogo className={cn("shrink-0 -rotate-6", small ? "size-9" : "size-10 sm:size-12")} />
      <span className="flex flex-col">
        <span className={cn("font-script leading-none text-foreground", small ? "text-[1.6rem]" : "text-[1.75rem] sm:text-[2.2rem]")}>
          Mercaplanner
          <HeartIcon aria-hidden="true" className="ml-0.5 inline size-3 -translate-y-3 fill-primary text-primary" />
        </span>
        <span className={cn("caps text-[0.56rem] tracking-[0.32em] text-muted-foreground", small ? "mt-0.5" : "mt-1 max-[380px]:hidden")}>
          Plan de dieta · Mercadona
        </span>
      </span>
    </button>
  );
}
