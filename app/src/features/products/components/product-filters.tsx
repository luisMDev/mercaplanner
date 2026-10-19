import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PRODUCT_SORTS, type ProductFilters, type ProductSort } from "../model/filter";

const ALL_CATEGORIES = "todas";

// Long values ("Todas las categorías") end in an ellipsis on a phone
const TRIGGER_CLASS =
  "min-w-0 flex-[1_1_160px] rounded-full bg-card pl-3.5 font-semibold data-[size=default]:h-9 dark:bg-card *:data-[slot=select-value]:block *:data-[slot=select-value]:truncate";

// Category filter and sort order, side by side (stacked on a narrow phone)
export function ProductFilterSelects({
  categories,
  filters,
  onChange,
}: {
  categories: string[];
  filters: ProductFilters;
  onChange: (change: Partial<ProductFilters>) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Select
        value={filters.categoria ?? ALL_CATEGORIES}
        onValueChange={(v) => onChange({ categoria: v === ALL_CATEGORIES ? null : v })}
      >
        <SelectTrigger aria-label="Categoría" className={TRIGGER_CLASS}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value={ALL_CATEGORIES}>Todas las categorías</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filters.sort} onValueChange={(v) => onChange({ sort: v as ProductSort })}>
        <SelectTrigger aria-label="Ordenar" className={TRIGGER_CLASS}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper">
          {(Object.keys(PRODUCT_SORTS) as ProductSort[]).map((k) => (
            <SelectItem key={k} value={k}>
              Orden: {PRODUCT_SORTS[k].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
