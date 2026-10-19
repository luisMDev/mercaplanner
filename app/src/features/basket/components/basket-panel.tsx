import { XIcon } from "lucide-react";
import { Panel, PanelHeader } from "@/components/cozy/panel";
import type { Plan } from "@/features/plan/model/types";
import type { Catalog } from "@/features/products/model/catalog";
import { CategoryArt } from "@/features/products/components/category-art";
import { navigate } from "@/features/shell/use-route";
import { plural } from "@/lib/format";
import { useBasket } from "../basket-context";
import { basketLines, type BasketLine } from "../model/basket";
import { BasketRow, LooseRow } from "./basket-row";
import { BasketSummary } from "./basket-summary";

// Lines grouped by Mercadona category, like walking the aisles
function byCategory(lines: BasketLine[]) {
  const groups = new Map<string, BasketLine[]>();
  lines.forEach((l) => {
    const cat = l.producto?.categoria ?? "Otros";
    groups.set(cat, [...(groups.get(cat) ?? []), l]);
  });
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b, "es"));
}

// The shopping list: summary, recipes added by hand, products by aisle and the
// ingredients with no product
export function BasketPanel({ plan, catalog }: { plan: Plan; catalog: Catalog }) {
  const basket = useBasket();
  const { state } = basket;
  const { lines, loose } = basketLines(plan, state, catalog);
  const isChecked = (key: string) => state.checked.includes(key);
  const total = lines.reduce((t, l) => t + (l.cost ?? 0), 0);
  const left = lines.reduce((t, l) => t + (isChecked(l.id) ? 0 : (l.cost ?? 0)), 0);
  const added = Object.entries(state.recipes).filter(([id]) => plan.byId[id]);

  return (
    <Panel className="animate-panel flex flex-col gap-7 p-5 sm:p-8">
      <BasketSummary
        total={total}
        left={left}
        done={lines.filter((l) => isChecked(l.id)).length}
        count={lines.length}
        onReset={basket.reset}
      />
      {added.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="caps text-[0.62rem] text-muted-foreground">Además del plan:</span>
          {added.map(([id, servings]) => (
            <span key={id} className="inline-flex items-center gap-1 rounded-full bg-primary-soft py-1 pr-1 pl-3 text-[0.85rem]">
              {plan.byId[id].nombre} · {plural(servings, "ración", "raciones")}
              <button
                type="button"
                aria-label={"Quitar " + plan.byId[id].nombre}
                onClick={() => basket.removeRecipe(id)}
                className="grid size-6 cursor-pointer place-items-center rounded-full hover:bg-card"
              >
                <XIcon className="size-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
      {byCategory(lines).map(([cat, group]) => (
        <section key={cat}>
          <PanelHeader icon={<CategoryArt categoria={cat} className="size-8 rounded-xl" />} title={cat} className="mb-1" />
          <ul>
            {group.map((l) => (
              <BasketRow
                key={l.id}
                line={l}
                checked={isChecked(l.id)}
                manual={state.products[l.id] ?? 0}
                onToggle={() => basket.toggle(l.id)}
                onOpen={() => navigate({ section: "productos", id: l.id })}
                onRemove={() => basket.removeProduct(l.id)}
              />
            ))}
          </ul>
        </section>
      ))}
      {loose.length > 0 && (
        <section>
          <PanelHeader title="Sin producto en Mercadona" className="mb-1" />
          <ul>
            {loose.map((l) => (
              <LooseRow key={l.key} text={l.text} recipes={l.recipes} checked={isChecked(l.key)} onToggle={() => basket.toggle(l.key)} />
            ))}
          </ul>
        </section>
      )}
      <p className="font-serif text-[0.85rem] text-muted-foreground italic">
        Precios de Mercadona por envase; las cantidades salen de los gramos de cada receta y una ración por comida del plan.
      </p>
    </Panel>
  );
}
