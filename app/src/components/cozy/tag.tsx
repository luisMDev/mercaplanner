import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Outlined pill: "25 MIN", "2 RACIONES", "HACENDADO"
export function Tag({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "caps inline-flex h-7 items-center gap-1.5 rounded-full border border-primary/30 px-3 text-[0.66rem] font-semibold text-primary [&_svg]:size-3.5",
        className,
      )}
      {...props}
    />
  );
}
