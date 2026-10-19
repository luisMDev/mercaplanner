import { useEffect, useRef, useState, type ReactNode } from "react";

// Pinned to the top while scrolling; once pinned it fades into the page below
export function StickyBar({ children }: { children: ReactNode }) {
  const sentinel = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setStuck(!entry.isIntersecting && entry.boundingClientRect.top < 0),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinel} aria-hidden="true" className="h-px" />
      <div
        data-stuck={stuck || undefined}
        className="sticky top-[env(safe-area-inset-top,0px)] z-20 mt-3 flex justify-center bg-background py-4 after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-8 after:bg-linear-to-b after:from-background after:to-transparent after:opacity-0 after:transition-opacity data-stuck:after:opacity-100"
      >
        {children}
      </div>
    </>
  );
}
