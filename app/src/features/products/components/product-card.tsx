import { MetaList } from "@/components/shared/meta-list";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { fmtEur } from "@/lib/format";
import { fmtPack, fmtQty, fmtReferencePrice, isEstimated, per100 } from "../model/format";
import type { Producto } from "../model/types";
import { NutritionGrid } from "./nutrition-grid";

export function ProductCard({ p }: { p: Producto }) {
  const estimated = isEstimated(p);
  const price = (
    <>
      <span className="font-semibold text-foreground">{fmtEur(p.precio_eur)}</span> {fmtReferencePrice(p)}
    </>
  );
  return (
    <Card className="gap-3 pb-0 shadow-card">
      <CardHeader>
        <CardTitle className="font-sans text-[0.95rem] leading-snug font-semibold">{p.nombre}</CardTitle>
        {estimated && (
          <CardAction>
            <Badge className="bg-gold-soft font-bold text-warning">Estimado</Badge>
          </CardAction>
        )}
        <CardDescription className="text-[0.82rem] tabular-nums">
          <MetaList items={[p.marca, p.envase, fmtQty(p), fmtPack(p), price]} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NutritionGrid p={p} />
      </CardContent>
      <CardFooter className="flex-wrap items-baseline gap-x-1.5 gap-y-0.5 py-2.5 text-[0.74rem] text-faint">
        <span className="basis-full">
          Por {per100(p)} · {estimated ? "valores genéricos estimados, no los de la etiqueta" : "Open Food Facts"}
        </span>
        <span>
          {p.categoria} › {p.subcategoria}
        </span>
        {p.url && (
          <a
            href={p.url}
            target="_blank"
            rel="noopener"
            className="ml-auto text-[0.8rem] font-semibold text-primary underline underline-offset-2 hover:text-primary-strong"
          >
            Ver en Mercadona
          </a>
        )}
      </CardFooter>
    </Card>
  );
}
