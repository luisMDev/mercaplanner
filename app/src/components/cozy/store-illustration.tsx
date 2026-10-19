import Image from "next/image";
import tienda from "@/assets/tienda.webp";
import { cn } from "@/lib/utils";

// Fades the straight edges of the picture (trees and pavement) into the paper
const EDGE_MASK =
  "[mask-image:linear-gradient(to_right,transparent,black_9%,black_91%,transparent),linear-gradient(to_bottom,black_86%,transparent)] [mask-composite:intersect]";

// Curved arrow under "estás aquí"
function HereArrow() {
  return (
    <svg viewBox="0 0 40 46" aria-hidden="true" className="ml-8 h-10 w-9 text-primary">
      <path d="M6 3c14 4 24 16 22 36" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M21 33l7 8 5-9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Petals drifting around the store, like the reference's
const PETALS = [
  "top-[8%] left-[6%] size-2 rotate-12 bg-primary/50",
  "top-[18%] right-[4%] size-1.5 -rotate-12 bg-green/50",
  "top-[44%] left-[1%] size-1.5 rotate-45 bg-gold/60",
  "top-[3%] right-[30%] size-1.5 rotate-45 bg-primary/40",
  "bottom-[30%] right-[1%] size-2 -rotate-6 bg-primary/40",
];

// The Mercadona corner store, drawn in the same style as the rest of the page
export function StoreIllustration({
  here = false,
  preload = false,
  className,
}: {
  // "estás aquí" with an arrow, when the store is small next to a panel
  here?: boolean;
  preload?: boolean;
  className?: string;
}) {
  return (
    <figure className={cn("relative", className)}>
      {here && (
        <figcaption className="pointer-events-none absolute -top-12 right-2 flex -rotate-6 flex-col items-start">
          <span className="font-script text-2xl text-primary">estás aquí</span>
          <HereArrow />
        </figcaption>
      )}
      {PETALS.map((p) => (
        <span key={p} aria-hidden="true" className={cn("absolute rounded-[60%_10%] animate-float", p)} />
      ))}
      <Image
        src={tienda}
        alt="Ilustración de una tienda de Mercadona en una esquina, con toldos verdes, plantas y fruta en la puerta"
        preload={preload}
        loading="eager"
        sizes="(min-width: 1024px) 40vw, 90vw"
        className={cn("h-auto w-full select-none dark:brightness-[.82] dark:saturate-[.9]", EDGE_MASK)}
        draggable={false}
      />
    </figure>
  );
}
