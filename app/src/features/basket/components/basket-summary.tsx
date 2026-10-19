import { RotateCcwIcon } from "lucide-react";
import { Sprig } from "@/components/cozy/sprig";
import { fmtEur } from "@/lib/format";

// Top of the basket: the estimated total, how much is left and a fresh start
export function BasketSummary({
  total,
  left,
  done,
  count,
  onReset,
}: {
  total: number;
  left: number;
  done: number;
  count: number;
  onReset: () => void;
}) {
  const pct = count ? Math.round((done / count) * 100) : 0;
  return (
    <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
      <div className="flex min-w-60 flex-1 flex-col gap-1.5">
        <p className="caps flex items-center gap-2 font-semibold">
          <Sprig /> La compra de la semana
        </p>
        <p className="font-display text-[clamp(2.2rem,1.8rem+1.6vw,3rem)] leading-none font-semibold text-primary italic tabular-nums">
          ≈ {fmtEur(total)}
        </p>
        <p className="text-[0.88rem] text-muted-foreground tabular-nums">
          {done} de {count} en el carro · quedan ≈ {fmtEur(left)}
        </p>
        <span className="mt-1 h-2 w-full max-w-sm overflow-hidden rounded-full bg-secondary" aria-hidden="true">
          <span className="block h-full rounded-full bg-green transition-all" style={{ width: pct + "%" }} />
        </span>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="caps inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-[0.66rem] font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
      >
        <RotateCcwIcon className="size-3.5" /> Empezar de nuevo
      </button>
    </div>
  );
}
