"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import fondo from "@/assets/fondo.webp";
import { cn } from "@/lib/utils";
import { PARK_HEIGHT, STORE_CENTER } from "./layout";
import { usePointerX } from "./use-pointer-x";

// How far the park slides at the window's edges, in px, the other way from
// the store's turn (so it reads as further back)
const SHIFT = 28;

// The park behind the store, in the frame of store-illustration.tsx: as tall
// as the store and a bit more, centred on it, whole and as wide as it comes
// (it may overflow the frame sideways). With drift, it slides against the
// mouse like a far layer
export function ParkLayer({ drift = false, className }: { drift?: boolean; className?: string }) {
  const layer = useRef<HTMLDivElement>(null);
  const pointerX = usePointerX();

  useEffect(() => {
    if (!drift || !matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    let x = 0;
    let frame = requestAnimationFrame(function step() {
      x += (pointerX.current - x) * 0.06;
      if (layer.current) layer.current.style.transform = `translateX(${(-x * SHIFT).toFixed(2)}px)`;
      frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  }, [drift, pointerX]);

  return (
    // Centring in a flex row lets a wider park overflow both sides equally
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-x-0 flex justify-center", className)}
      style={{ height: PARK_HEIGHT * 100 + "%", bottom: (STORE_CENTER - PARK_HEIGHT / 2) * 100 + "%" }}
    >
      <div ref={layer} className="h-full shrink-0">
        <Image
          src={fondo}
          alt=""
          loading="eager"
          sizes="(min-width: 1024px) 60vw, 120vw"
          className="h-full w-auto max-w-none select-none"
          draggable={false}
        />
      </div>
    </div>
  );
}
