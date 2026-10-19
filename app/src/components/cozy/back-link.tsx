import { ArrowLeftIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// "← VOLVER A LA TIENDA", "← TODAS LAS RECETAS"
export function BackLink({ className, children, ...props }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "caps inline-flex cursor-pointer items-center gap-2 font-semibold text-muted-foreground transition-colors hover:text-primary [&_svg]:size-4",
        className,
      )}
      {...props}
    >
      <ArrowLeftIcon />
      {children}
    </button>
  );
}
