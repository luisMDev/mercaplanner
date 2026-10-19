import { HeartIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Handwritten title with a little red heart: "El recetario ♥"
export function ScriptHeading({
  children,
  as: Tag = "h1",
  className,
}: {
  children: ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    // leading goes after className: a text size there would drop it in cn()
    <Tag className={cn("font-script font-normal text-foreground", className, "leading-[0.95]")}>
      {children}
      <HeartIcon aria-hidden="true" className="ml-1 inline size-[0.28em] -translate-y-[0.4em] fill-primary text-primary" />
    </Tag>
  );
}

// Hand-drawn stroke under a title
export function Squiggle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 10" aria-hidden="true" className={cn("h-2.5 w-20 text-ink/70 dark:text-foreground/50", className)}>
      <path
        d="M2 6c10-3 18 2 28-1s16-3 24 0 14 1 24-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
