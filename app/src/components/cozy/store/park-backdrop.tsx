"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import fondo from "@/assets/fondo.webp";
import { usePointerX } from "./use-pointer-x";

// How far the park slides at the window's edges, in px, the other way from
// the store's turn (so it reads as further back)
const SHIFT = 28;

// The park as the backdrop of the whole page, behind the menu and the panels
// (Inicio). With a mouse it drifts against the store, like a far layer
export function ParkBackdrop() {
  const layer = useRef<HTMLDivElement>(null);
  const pointerX = usePointerX();

  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let x = 0;
    let frame = requestAnimationFrame(function step() {
      x += (pointerX.current - x) * 0.06;
      if (layer.current) layer.current.style.transform = `translateX(${(-x * SHIFT).toFixed(2)}px)`;
      frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  }, [pointerX]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div ref={layer} className="absolute inset-0 scale-[1.06] opacity-90 dark:opacity-40">
        <Image src={fondo} alt="" fill preload sizes="100vw" className="object-cover object-[50%_70%] select-none" />
      </div>
    </div>
  );
}
