import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// False while prerendering and hydrating, true once in the browser. Gates
// whatever depends on the device: today's date, localStorage, the theme
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
