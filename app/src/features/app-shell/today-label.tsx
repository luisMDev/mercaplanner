"use client";

import { useMounted } from "@/hooks/use-mounted";
import { useNow } from "@/hooks/use-now";

function TodayDate() {
  const now = useNow();
  return (
    <strong className="font-semibold text-foreground">
      {now.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
    </strong>
  );
}

// "Hoy es domingo, 19 de octubre", in the device's date (unknown while prerendering)
export function TodayLabel() {
  const mounted = useMounted();
  return (
    <p className="mt-1 text-[0.85rem] text-muted-foreground tabular-nums">
      Hoy es{" "}
      {mounted ? (
        <TodayDate />
      ) : (
        <span className="inline-block h-[1em] w-40 animate-pulse rounded-md bg-muted align-[-0.15em]" />
      )}
    </p>
  );
}
