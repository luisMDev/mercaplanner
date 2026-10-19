import { Skeleton } from "@/components/ui/skeleton";

// Stand-in for the tabs and the first card while the page hydrates
export function AppSkeleton() {
  return (
    <div aria-busy="true" aria-label="Cargando" className="flex flex-col">
      <div className="mt-3 flex justify-center py-4">
        <Skeleton className="h-[42px] w-[352px] max-w-full rounded-full bg-card" />
      </div>
      <Skeleton className="h-72 rounded-xl bg-card" />
    </div>
  );
}
