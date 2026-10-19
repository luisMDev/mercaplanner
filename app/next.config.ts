import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // With export names mangled, import.meta.glob(..., { import: "default" })
    // reads the old name and the recipe images (plan/model/recipe-images.ts)
    // come back undefined in production builds
    turbopackMangleExportNames: false,
  },
  turbopack: {
    // recetas.json and productos.json live in the repository root, next to
    // scripts/, so Turbopack has to resolve files from there
    root: path.join(__dirname, ".."),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
