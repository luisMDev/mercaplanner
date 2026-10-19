import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Big rounded call to action: "VER LA SEMANA →", "AÑADIR A LA CESTA"
export function CtaButton({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: "primary" | "outline" }) {
  return (
    <button
      type="button"
      className={cn(
        "caps inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-full px-6 text-[0.78rem] font-semibold transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
        variant === "primary" &&
          "bg-primary text-primary-foreground shadow-[0_8px_18px_-8px_var(--primary)] hover:bg-primary-strong",
        variant === "outline" && "border border-primary/40 bg-card text-primary hover:bg-primary-soft",
        className,
      )}
      {...props}
    />
  );
}
