import { useState } from "react";
import { MetaList } from "@/components/shared/meta-list";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { fmtEur } from "@/lib/format";
import { cn } from "@/lib/utils";
import { fmtPack, fmtQty, fmtReferencePrice, isEstimated, per100 } from "../model/format";
import type { Producto } from "../model/types";
import { NutritionGrid } from "./nutrition-grid";
import { ProductPhoto } from "./product-photo";

const linkClass = "text-[0.8rem] font-semibold text-primary underline underline-offset-2 hover:text-primary-strong";

export function ProductCard({ p }: { p: Producto }) {
  const [labelOpen, setLabelOpen] = useState(false);
  const estimated = isEstimated(p);
  const price = (
    <>
      <span className="font-semibold text-foreground">{fmtEur(p.precio_eur)}</span> {fmtReferencePrice(p)}
    </>
  );
  return (
    <Card className="gap-3 pb-0 shadow-card">
      {/* Front photo next to the name, price and size */}
      <div className="flex items-start gap-3 px-(--card-spacing)">
        {p.imagen && <ProductPhoto src={p.imagen} alt="" width={64} height={64} className="size-16 shrink-0 object-contain" />}
        <CardHeader className="flex-1 px-0">
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
      </div>
      <CardContent className="flex flex-col gap-3">
        <NutritionGrid p={p} />
        {/* Back of the pack, full size in a new tab to zoom in on the table */}
        {labelOpen && p.imagen_etiqueta && (
          <ProductPhoto
            src={p.imagen_etiqueta}
            alt={"Etiqueta de " + p.nombre}
            width={900}
            height={900}
            className="h-auto w-full"
            zoom
            fallback={<p className="text-[0.8rem] text-faint">No se ha podido cargar la foto de la etiqueta.</p>}
          />
        )}
      </CardContent>
      <CardFooter className="flex-wrap items-baseline gap-x-1.5 gap-y-0.5 py-2.5 text-[0.74rem] text-faint">
        <span className="basis-full">
          Por {per100(p)} · {estimated ? "valores genéricos estimados, no los de la etiqueta" : "Open Food Facts"}
        </span>
        <span>
          {p.categoria} › {p.subcategoria}
        </span>
        <span className="ml-auto flex gap-3.5">
          {p.imagen_etiqueta && (
            <button type="button" aria-expanded={labelOpen} onClick={() => setLabelOpen((o) => !o)} className={cn("cursor-pointer", linkClass)}>
              {labelOpen ? "Ocultar etiqueta" : "Ver etiqueta"}
            </button>
          )}
          {p.url && (
            <a href={p.url} target="_blank" rel="noopener" className={linkClass}>
              Ver en Mercadona
            </a>
          )}
        </span>
      </CardFooter>
    </Card>
  );
}
