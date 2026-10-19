import { cn } from "@/lib/utils";

const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

// Red ticket stub with the date: "SÁB / 10 / OCT", with a perforated edge
export function DateStub({ date, className }: { date: Date; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl bg-primary px-3 py-5 text-primary-foreground shadow-[0_10px_24px_-12px_var(--primary)]",
        // Perforations along the right edge
        "after:absolute after:inset-y-3 after:-right-px after:w-1 after:bg-[radial-gradient(circle,var(--card)_1.5px,transparent_1.6px)] after:bg-size-[4px_9px]",
        className,
      )}
    >
      <span className="caps text-[0.7rem] font-semibold opacity-90">{WEEKDAYS[date.getDay()]}</span>
      <span className="font-display text-5xl leading-none font-semibold italic tabular-nums">{date.getDate()}</span>
      <span className="caps text-[0.7rem] font-semibold opacity-90">{MONTHS[date.getMonth()]}</span>
    </div>
  );
}
