import { TreePalmIcon } from "lucide-react";
import { Tag } from "@/components/cozy/tag";
import { cn } from "@/lib/utils";

// "DÍA LIBRE": a day of "dias_libres", with no plan
export function FreeDayTag({ className }: { className?: string }) {
  return (
    <Tag className={cn("border-gold/50 bg-gold-soft text-gold", className)}>
      <TreePalmIcon aria-hidden="true" />
      Día libre
    </Tag>
  );
}
