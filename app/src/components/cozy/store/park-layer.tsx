"use client";

import Image from "next/image";
import fondo from "@/assets/fondo.webp";
import { cn } from "@/lib/utils";
import { PARK_CENTER, PARK_HEIGHT } from "./layout";

// The flat park behind the store, in the frame of store-illustration.tsx: as
// tall as the store and a bit more, a little above it, whole and as wide as it
// comes (it may overflow the frame sideways). The 3D scene takes its place
export function ParkLayer({ className }: { className?: string }) {
  return (
    // Centring in a flex row lets a wider park overflow both sides equally
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-x-0 flex justify-center", className)}
      style={{ height: PARK_HEIGHT * 100 + "%", bottom: (PARK_CENTER - PARK_HEIGHT / 2) * 100 + "%" }}
    >
      <div className="h-full shrink-0">
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
