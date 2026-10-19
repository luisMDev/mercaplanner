import { cn } from "@/lib/utils";

// Strip of decorative tape holding a card to the page
export function WashiTape({ tone = "sage", className }: { tone?: "sage" | "mint"; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-10 h-7 w-28 opacity-85 shadow-sm",
        tone === "sage" &&
          "bg-[repeating-linear-gradient(90deg,#a9c996_0_10px,#c7dcb8_10px_20px)] dark:bg-[repeating-linear-gradient(90deg,#3f5a33_0_10px,#4d6b3f_10px_20px)]",
        tone === "mint" &&
          "bg-[#a9d8cf] bg-[radial-gradient(circle,#ffffffaa_1.6px,transparent_1.8px)] bg-size-[9px_9px] dark:bg-[#3f7069]",
        className,
      )}
    />
  );
}
