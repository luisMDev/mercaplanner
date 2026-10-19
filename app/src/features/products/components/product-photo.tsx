import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Producto } from "../model/types";
import { CategoryArt } from "./category-art";

// The photos of imagenes/productos/ (repository root) are copied to
// public/imagenes/productos/ before dev and build (scripts/copy-product-photos.mjs).
// build-imagenes.py already resized them and made them WebP, so they are
// served as is

// Front photo of the product, on white as they come; its category drawing if
// it has none or it cannot load. Takes the classes of a CategoryArt
export function ProductPhoto({ p, className }: { p: Producto; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!p.imagen || failed) return <CategoryArt categoria={p.categoria} className={className} />;
  return (
    <div className={cn("relative aspect-square overflow-hidden rounded-2xl bg-white", className)}>
      <Image src={"/" + p.imagen} alt="" fill unoptimized className="object-contain p-[6%]" onError={() => setFailed(true)} />
    </div>
  );
}

// Back of the pack with the nutrition facts, a link to it full size to zoom
// in on the table
export function ProductLabel({ p }: { p: Producto }) {
  const [failed, setFailed] = useState(false);
  if (!p.imagen_etiqueta || failed) {
    return <p className="text-[0.9rem] text-muted-foreground">No se ha podido cargar la foto de la etiqueta.</p>;
  }
  return (
    <a href={"/" + p.imagen_etiqueta} target="_blank" rel="noopener" className="block">
      <Image
        src={"/" + p.imagen_etiqueta}
        alt={"Etiqueta de " + p.nombre}
        width={900}
        height={900}
        unoptimized
        className="h-auto w-full rounded-2xl bg-white ring-1 ring-border"
        onError={() => setFailed(true)}
      />
    </a>
  );
}
