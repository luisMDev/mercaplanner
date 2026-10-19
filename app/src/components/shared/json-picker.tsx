"use client";

import { UploadIcon } from "lucide-react";
import { useRef, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";

// Pick a JSON by hand: to try another plan without touching recetas.json, or
// to load productos.json when the page cannot fetch it
export function JsonPicker({ onText, label = "Cargar JSON" }: { onText: (text: string) => void; label?: string }) {
  const input = useRef<HTMLInputElement>(null);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) file.text().then(onText);
  }

  return (
    <>
      <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => input.current?.click()}>
        <UploadIcon data-icon="inline-start" />
        {label}
      </Button>
      <input
        ref={input}
        type="file"
        accept=".json,application/json"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={onChange}
      />
    </>
  );
}
