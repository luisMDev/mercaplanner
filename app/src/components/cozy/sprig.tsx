import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Little branch with leaves that goes before a section label
export function Sprig({ className, ...props }: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 28 16" aria-hidden="true" className={cn("h-3.5 w-6 shrink-0 text-green", className)} {...props}>
      <path d="M2 14C9 11 17 7 26 2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M8 11.6c-.4-2.6.6-4.6 2.8-5.6.4 2.4-.6 4.4-2.8 5.6Z" fill="currentColor" />
      <path d="M8.4 11.4c2.4.6 4.4 0 5.6-2-2.4-.8-4.4-.2-5.6 2Z" fill="currentColor" />
      <path d="M15 7.8c-.2-2.6 1-4.4 3.2-5.2.2 2.4-1 4.2-3.2 5.2Z" fill="currentColor" />
      <path d="M15.4 7.6c2.4.8 4.4.2 5.8-1.6-2.4-1-4.4-.4-5.8 1.6Z" fill="currentColor" />
      <path d="M21.6 4.2c.4-2 1.8-3.2 3.8-3.4-.2 2-1.6 3.2-3.8 3.4Z" fill="currentColor" />
    </svg>
  );
}
