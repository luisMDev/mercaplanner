import type { ComponentProps, CSSProperties } from "react";
import { cn } from "@/lib/utils";

/* Vertical timeline: one dot per item, joined by a line. Each item takes the
   colour of its dot and kind label (lib/meals.ts) as the --dot variable */
export function Timeline({ className, ...props }: ComponentProps<"ol">) {
  return <ol className={cn("mt-1 flex flex-col", className)} {...props} />;
}

export function TimelineItem({
  color,
  done,
  className,
  style,
  children,
  ...props
}: ComponentProps<"li"> & { color: string; done?: boolean }) {
  return (
    <li
      style={{ "--dot": color, ...style } as CSSProperties}
      className={cn(
        "relative pb-5 pl-[30px] last:pb-0 before:absolute before:top-2.5 before:-bottom-2.5 before:left-1.5 before:w-0.5 before:bg-border last:before:hidden",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-[3px] left-0 z-10 size-3.5 rounded-full border-2 border-(--dot) bg-card",
          done && "bg-(--dot)",
        )}
      />
      {children}
    </li>
  );
}

export function TimelineWhen({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-wrap items-baseline gap-x-1.5 text-[0.72rem] leading-5 text-muted-foreground", className)}
      {...props}
    />
  );
}

export function TimelineKind({ className, ...props }: ComponentProps<"span">) {
  return <span className={cn("font-bold tracking-[0.08em] text-(--dot) uppercase", className)} {...props} />;
}

export function TimelineTitle({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mt-px flex flex-wrap items-baseline gap-x-2 gap-y-0.5 font-semibold", className)} {...props} />;
}

export function TimelineInfo({ className, ...props }: ComponentProps<"ul">) {
  return <ul className={cn("mt-1 flex flex-col gap-0.5 text-[0.87rem] text-muted-foreground", className)} {...props} />;
}
