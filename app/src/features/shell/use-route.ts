import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { parseHash, routeHash, type Route } from "./model/routes";

// Components reading the route, told when it changes
const listeners = new Set<() => void>();

// Swaps the page inside a view transition where the browser has them: the
// store glides from the middle of Inicio to the left of a section, the rest
// cross-fades and the panels slide in (see globals.css)
function withTransition(update: () => void) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduce) {
    update();
    return;
  }
  document.startViewTransition(() => flushSync(update));
}

function notify() {
  listeners.forEach((l) => l());
}

// Back and forward change the hash on their own: animate those too
function onHashChange() {
  withTransition(notify);
}

function subscribe(onChange: () => void) {
  if (!listeners.size) window.addEventListener("hashchange", onHashChange);
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
    if (!listeners.size) window.removeEventListener("hashchange", onHashChange);
  };
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
  if (hash === window.location.hash) return;
  withTransition(() => {
    // pushState does not fire hashchange, so the page is told here, inside
    // the transition
    window.history.pushState(window.history.state, "", hash);
    notify();
    window.scrollTo({ top: 0, behavior: "instant" });
  });
}
