import { useEffect, useRef } from "react";

// Horizontal mouse position across the whole window, from -1 to 1, in a ref
// (read every frame, without re-rendering)
export function usePointerX() {
  const pointer = useRef(0);
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current = (e.clientX / window.innerWidth) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return pointer;
}
