import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { parseHash, routeHash, type Route } from "./model/routes";

// Components reading the route, told when it changes
const listeners = new Set<() => void>();

// The card just clicked to open a recipe or product (data-morph): in the
// transition it grows into the panel that opens, named open-card on both sides
let clicked: { el: HTMLElement; at: number } | null = null;
if (typeof document !== "undefined") {
  document.addEventListener(
    "click",
    (e) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-morph]");
      if (el) clicked = { el, at: e.timeStamp };
    },
    true,
  );
}

// The card clicked a moment ago, if it is still on the page
function morphSource() {
  const source = clicked;
  clicked = null;
  return source && source.el.isConnected && performance.now() - source.at < 1000 ? source.el : null;
}

// Swaps the page inside a view transition where the browser has them: the
// store glides from the middle of Inicio to the left of a section, the rest
// cross-fades and the panels slide in (see globals.css)
function withTransition(update: () => void, source: HTMLElement | null = null) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduce) {
    update();
    return;
  }
  if (source) source.style.viewTransitionName = "open-card";
  // The view-transition-name of the store, the header and the panels only
  // apply under html.vt, while a transition runs: an element with a name
  // stops the frosted cards inside it from blurring what is behind it
  const root = document.documentElement;
  root.classList.add("vt");
  const transition = document.startViewTransition(() => flushSync(update));
  transition.finished.finally(() => {
    root.classList.remove("vt");
    if (source) source.style.viewTransitionName = "";
  });
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
  }, morphSource());
}
