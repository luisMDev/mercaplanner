import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Recipe or product name that opens it in its tab
export function RecipeLink({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "cursor-pointer text-left font-semibold text-foreground underline decoration-border underline-offset-[3px] hover:text-primary hover:decoration-current",
        className,
      )}
      {...props}
    />
  );
}
