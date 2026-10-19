import { useEffect, useState } from "react";

// Current time, refreshed every minute so past meals fill in and the day
// changes at midnight without reloading. Only for components that render after
// useMounted, never while prerendering
export function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
