"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import tienda from "@/assets/tienda.webp";
import { cn } from "@/lib/utils";
import { STORE_BOTTOM, STORE_SCALE } from "./layout";
import { ParkLayer } from "./park-layer";

// Fades the park's straight edges into the paper, when it stays in the frame
const PARK_EDGES =
  "[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent),linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)] [mask-composite:intersect]";

// three.js only downloads where the 3D store is shown
const StoreScene = dynamic(() => import("./store-scene"), { ssr: false });

// 3D only with a mouse (it follows the pointer), with WebGL and without
// "reduce motion"; elsewhere the flat drawing stays
function canShow3d() {
  if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

// Curved arrow under "estás aquí"
function HereArrow() {
  return (
    <svg viewBox="0 0 40 46" aria-hidden="true" className="ml-8 h-10 w-9 text-primary">
      <path d="M6 3c14 4 24 16 22 36" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M21 33l7 8 5-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

// The Mercadona corner store, drawn in the same style as the rest of the page.
// The flat drawing shows first; the 3D one (store-scene.tsx) takes its place
// once loaded
export function StoreIllustration({
  here = false,
  park = "frame",
  preload = false,
  className,
}: {
  // "estás aquí" with an arrow, when the store is small next to a panel
  here?: boolean;
  // The park behind the store: clipped to the frame, or as a backdrop that
  // overflows it behind the page's panels (Inicio)
  park?: "frame" | "backdrop";
  preload?: boolean;
  className?: string;
}) {
  const [show3d, setShow3d] = useState(false);
  const [ready, setReady] = useState(false);
  // Mounted after the page change, so building the WebGL scene does not slow
  // the view transition down (it lasts 0.5 s, globals.css)
  useEffect(() => {
    if (!canShow3d()) return;
    const id = setTimeout(() => setShow3d(true), 550);
    return () => clearTimeout(id);
  }, []);
  const onReady = useCallback(() => setReady(true), []);
  return (
    // One name on every page: view transitions move it from page to page
    <figure className={cn("relative [view-transition-name:tienda]", className)}>
      {here && (
        <figcaption className="pointer-events-none absolute -top-12 right-2 flex -rotate-6 flex-col items-start">
          <span className="font-script text-2xl text-primary">estás aquí</span>
          <HereArrow />
        </figcaption>
      )}
      {PETALS.map((p) => (
        <span key={p} aria-hidden="true" className={cn("absolute rounded-[60%_10%] animate-float", p)} />
      ))}
      <div
        className={cn("relative dark:brightness-[.82] dark:saturate-[.9]", park === "frame" && PARK_EDGES)}
        style={{ aspectRatio: tienda.width / tienda.height }}
      >
        {/* Flat park until the 3D scene, which draws it with relief, is ready */}
        <ParkLayer className={cn("transition-opacity duration-500", ready && "opacity-0")} />
        <Image
          src={tienda}
          alt="Ilustración de una tienda de Mercadona en una esquina, con toldos verdes, plantas y fruta en la puerta"
          preload={preload}
          loading="eager"
          sizes="(min-width: 1024px) 40vw, 90vw"
          className={cn("absolute h-auto select-none transition-opacity duration-500", ready && "opacity-0")}
          style={{
            width: STORE_SCALE * 100 + "%",
            left: ((1 - STORE_SCALE) / 2) * 100 + "%",
            bottom: STORE_BOTTOM * 100 + "%",
          }}
          draggable={false}
        />
        {show3d && (
          // 4% over each side (OVERFLOW in store-scene.tsx); as a backdrop it
          // widens to hold the whole park, behind the page's panels
          <div
            className={cn(
              "pointer-events-none absolute -inset-y-[4%] opacity-0 transition-opacity duration-500",
              park === "frame" ? "-inset-x-[4%]" : "-inset-x-[40%]",
              ready && "opacity-100",
            )}
          >
            <StoreScene onReady={onReady} />
          </div>
        )}
      </div>
    </figure>
  );
}
