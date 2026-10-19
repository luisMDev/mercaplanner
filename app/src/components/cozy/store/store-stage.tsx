"use client";

import tienda from "@/assets/tienda.webp";
import { createContext, use, useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { StoreIllustration } from "./store-illustration";

// Where a page wants the store: an empty box in its layout, and how to show it
type Slot = {
  el: HTMLElement;
  // "estás aquí" with an arrow
  here: boolean;
};

const StageContext = createContext<(slot: Slot | null, el?: HTMLElement) => void>(() => {});

/* One store for the whole app, never unmounted, so its 3D scene loads once.
   Pages leave a StoreSlot where it goes; the store is pinned over that box
   (fixed, following it while scrolling, sticky included). On a page change
   the view transition moves this same element to its new place */
export function StoreStage({ children }: { children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const slotRef = useRef<Slot | null>(null);
  const [look, setLook] = useState<Omit<Slot, "el">>({ here: false });

  // Copies the slot's place and width onto the store; hidden when the page
  // has no slot or hides it (the aside on a phone)
  const place = useCallback(() => {
    const b = box.current;
    if (!b) return;
    const r = slotRef.current?.el.getBoundingClientRect();
    if (!r || !r.width) {
      b.style.visibility = "hidden";
      return;
    }
    b.style.visibility = "";
    b.style.width = r.width + "px";
    b.style.transform = `translate(${r.left}px, ${r.top}px)`;
  }, []);

  // Called from the slots' layout effects, so inside a view transition the
  // store is already in its new place when the browser takes the snapshot
  const register = useCallback(
    (slot: Slot | null, el?: HTMLElement) => {
      if (slot) {
        slotRef.current = slot;
        setLook({ here: slot.here });
      } else if (slotRef.current?.el === el) {
        slotRef.current = null;
      }
      place();
    },
    [place],
  );

  useEffect(() => {
    let frame = requestAnimationFrame(function follow() {
      place();
      frame = requestAnimationFrame(follow);
    });
    return () => cancelAnimationFrame(frame);
  }, [place]);

  return (
    <StageContext value={register}>
      {children}
      {/* Above the page, below the header (z-30) and the panels and titles (z-10) */}
      <div ref={box} className="pointer-events-none fixed top-0 left-0 z-[5]" style={{ visibility: "hidden" }}>
        <StoreIllustration preload here={look.here} className="w-full" />
      </div>
    </StageContext>
  );
}

// The place a page keeps for the store: an empty box of the store's
// proportions, sized with className like the store used to be
export function StoreSlot({ here = false, className }: { here?: boolean; className?: string }) {
  const el = useRef<HTMLDivElement>(null);
  const register = use(StageContext);

  useLayoutEffect(() => {
    const node = el.current;
    if (!node) return;
    register({ el: node, here });
    return () => register(null, node);
  }, [register, here]);

  return (
    <div ref={el} aria-hidden="true" className={className} style={{ aspectRatio: tienda.width / tienda.height }} />
  );
}
