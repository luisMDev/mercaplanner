// Preparation steps, each with its number in a red circle
export function StepsList({ pasos }: { pasos: string[] }) {
  return (
    <ol className="flex flex-col gap-4">
      {pasos.map((paso, i) => (
        <li key={i} className="flex gap-3.5">
          <span
            aria-hidden="true"
            className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-soft text-[0.95rem] font-semibold text-primary tabular-nums"
          >
            {i + 1}
          </span>
          <p className="pt-0.5 font-serif text-[1.02rem] leading-relaxed">{paso}</p>
        </li>
      ))}
    </ol>
  );
}
