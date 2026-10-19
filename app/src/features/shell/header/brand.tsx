import { HeartIcon } from "lucide-react";
import { TomatoLogo } from "@/components/cozy/tomato-logo";

// Logo and name: "Mercaplanner ♥"
export function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Mercaplanner, ir al inicio"
      className="flex shrink-0 cursor-pointer items-center gap-2.5 text-left"
    >
      <TomatoLogo className="size-10 shrink-0 -rotate-6 sm:size-11" />
      <span className="font-script text-[1.75rem] leading-none text-foreground sm:text-[2.2rem]">
        Mercaplanner
        <HeartIcon aria-hidden="true" className="ml-0.5 inline size-3 -translate-y-3 fill-primary text-primary" />
      </span>
    </button>
  );
}
