import { useSyncExternalStore } from "react";
import { parseHash, routeHash, type Route } from "./model/routes";

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

const getHash = () => window.location.hash;

// The open section and panel, read from the URL hash
export function useRoute(): Route {
  return parseHash(useSyncExternalStore(subscribe, getHash, () => ""));
}

// Every change is a new history entry, so back closes the panel. The page
// starts at the top, as a new page would
export function navigate(route: Route) {
  const hash = routeHash(route);
  if (hash !== window.location.hash) window.location.hash = hash;
  window.scrollTo({ top: 0, behavior: "instant" });
}
