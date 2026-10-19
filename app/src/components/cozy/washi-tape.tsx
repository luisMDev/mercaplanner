import { cn } from "@/lib/utils";

// Strip of decorative tape holding a card to the page
export function WashiTape({ tone = "pink", className }: { tone?: "pink" | "mint"; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-10 h-7 w-28 opacity-85 shadow-sm",
        tone === "pink" &&
          "bg-[repeating-linear-gradient(90deg,#f5b5ad_0_10px,#f9cbc4_10px_20px)] dark:bg-[repeating-linear-gradient(90deg,#8e4b43_0_10px,#a5574e_10px_20px)]",
        tone === "mint" &&
          "bg-[#a9d8cf] bg-[radial-gradient(circle,#ffffffaa_1.6px,transparent_1.8px)] bg-size-[9px_9px] dark:bg-[#3f7069]",
        className,
      )}
    />
  );
}
