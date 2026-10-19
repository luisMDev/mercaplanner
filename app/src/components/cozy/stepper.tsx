import { MinusIcon, PlusIcon } from "lucide-react";

// "– 2 +": servings of a recipe, packs of a product
export function Stepper({
  value,
  onChange,
  min = 1,
  max = 20,
  label,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
}) {
  const button =
    "grid size-9 cursor-pointer place-items-center rounded-full text-foreground transition-colors hover:bg-primary-soft hover:text-primary disabled:pointer-events-none disabled:opacity-35 [&_svg]:size-4";
  return (
    <div role="group" aria-label={label} className="inline-flex h-11 items-center gap-1 rounded-full border bg-card px-1">
      <button type="button" className={button} aria-label="Menos" disabled={value <= min} onClick={() => onChange(value - 1)}>
        <MinusIcon />
      </button>
      <output aria-live="polite" className="min-w-6 text-center font-semibold tabular-nums">
        {value}
      </output>
      <button type="button" className={button} aria-label="Más" disabled={value >= max} onClick={() => onChange(value + 1)}>
        <PlusIcon />
      </button>
    </div>
  );
}
