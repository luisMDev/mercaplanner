import { Skeleton } from "@/components/ui/skeleton";
import { Brand } from "./header/brand";

// Stand-in for the header and the three columns of Inicio while the page hydrates
export function AppSkeleton() {
  return (
    <div aria-busy="true" aria-label="Cargando" className="mx-auto flex w-full max-w-[1480px] flex-col gap-8 px-4 pt-4 sm:px-6 lg:px-10 lg:pt-6">
      <Brand />
      <div className="grid gap-8 lg:grid-cols-[minmax(230px,280px)_minmax(0,1fr)_minmax(340px,440px)]">
        <Skeleton className="h-72 rounded-3xl bg-card max-lg:hidden" />
        <Skeleton className="aspect-[4/5] max-h-[70vh] rounded-3xl bg-card/60" />
        <Skeleton className="h-96 rounded-3xl bg-card" />
      </div>
    </div>
  );
}
