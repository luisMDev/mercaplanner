import { PackageXIcon } from "lucide-react";
import { JsonPicker } from "@/components/shared/json-picker";
import { Notice } from "@/components/shared/notice";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PRODUCTS_FILE } from "../model/parse";

// Grey tiles in place of the products while productos.json downloads
export function ProductsSkeleton({ tiles = 8, className }: { tiles?: number; className?: string }) {
  return (
    <div aria-busy="true" aria-label="Cargando productos" className={cn("grid grid-cols-2 gap-3 @lg:grid-cols-4", className)}>
      {Array.from({ length: tiles }, (_, i) => (
        <Skeleton key={i} className="aspect-[3/4] rounded-2xl bg-secondary" />
      ))}
    </div>
  );
}

// productos.json could not be fetched: pick it by hand
export function ProductsError({
  error,
  pickError,
  onPick,
}: {
  error: string;
  pickError: string | null;
  onPick: (text: string) => void;
}) {
  return (
    <Notice
      icon={<PackageXIcon />}
      title="No se han podido cargar los productos"
      description={`No se pudo leer ${PRODUCTS_FILE} (${error}). Elígelo a mano para verlos.`}
    >
      <JsonPicker onText={onPick} label={"Elegir " + PRODUCTS_FILE} />
      {pickError && <p className="text-[0.76rem] text-destructive">{pickError}</p>}
    </Notice>
  );
}
