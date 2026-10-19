import Image from "next/image";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ProductPhotoProps = {
  // Path in productos.json, "imagenes/productos/..."
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  // Link to the photo full size, in a new tab
  zoom?: boolean;
  // Shown in its place if it cannot load
  fallback?: ReactNode;
};

// Photo of imagenes/productos/ (repository root, served through the
// public/imagenes symlink). build-imagenes.py already resized it and made it
// WebP, so it is served as is. The photos come on white, so they keep it in
// the dark theme too
export function ProductPhoto({ src, alt, className, zoom, fallback = null, ...props }: ProductPhotoProps) {
  const [failed, setFailed] = useState(false);
  if (failed) return fallback;
  const img = (
    <Image
      src={"/" + src}
      alt={alt}
      unoptimized
      className={cn("rounded-lg bg-white ring-1 ring-border", className)}
      onError={() => setFailed(true)}
      {...props}
    />
  );
  return zoom ? (
    <a href={"/" + src} target="_blank" rel="noopener">
      {img}
    </a>
  ) : (
    img
  );
}
