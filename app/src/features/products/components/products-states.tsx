import { PackageXIcon } from "lucide-react";
import { JsonPicker } from "@/components/shared/json-picker";
import { Notice } from "@/components/shared/notice";
import { Skeleton } from "@/components/ui/skeleton";
import { PRODUCTS_FILE } from "../model/parse";

export function ProductsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Cargando productos" className="flex flex-col gap-3">
      <Skeleton className="h-11 rounded-full bg-card" />
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-44 rounded-xl bg-card" />
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
