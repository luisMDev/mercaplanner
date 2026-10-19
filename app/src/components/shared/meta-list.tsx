import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Dot() {
  return (
    <span aria-hidden="true" className="text-faint">
      ·
    </span>
  );
}

// Items joined by middle dots: "388 kcal · 25 min · 2 raciones"
export function MetaList({ items, className }: { items: ReactNode[]; className?: string }) {
  const shown = items.filter((item) => item != null && item !== false && item !== "");
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-1.5", className)}>
      {shown.map((item, i) => (
        <Fragment key={i}>
          {i > 0 && <Dot />}
          <span>{item}</span>
        </Fragment>
      ))}
    </div>
  );
}
