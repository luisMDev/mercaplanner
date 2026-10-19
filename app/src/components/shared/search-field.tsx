"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";

export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <InputGroup className="h-11 rounded-full border-border bg-background/70 dark:bg-background/40">
      <InputGroupAddon className="pl-4">
        <SearchIcon className="text-faint" />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="font-serif text-[1rem] placeholder:text-faint [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <InputGroupAddon align="inline-end" className="pr-3">
          <InputGroupButton
            size="icon-xs"
            variant="secondary"
            className="rounded-full"
            aria-label="Borrar"
            onClick={() => onChange("")}
          >
            <XIcon />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
