import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

// Rounded frosted card that holds a section: "Las recetas", the open recipe…
export function Panel({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "@container rounded-3xl border border-white/70 glass p-5 shadow-card sm:p-6 dark:border-white/5",
        className,
      )}
      {...props}
    />
  );
}

// "LAS RECETAS ········ VER TODAS →", with an optional icon first
export function PanelHeader({
  title,
  icon,
  action,
  className,
}: {
  title: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-4 flex items-center gap-2.5", className)}>
      {icon}
      <h2 className="caps min-w-0 flex-1 truncate font-semibold text-foreground">{title}</h2>
      {action}
    </header>
  );
}

// "VER TODAS →" at the end of a panel header
export function PanelAction({ className, children, ...props }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "caps inline-flex shrink-0 cursor-pointer items-center gap-1.5 font-semibold text-muted-foreground transition-colors hover:text-primary [&_svg]:size-3.5",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
