// Copies the product photos of imagenes/productos/ (repository root, from
// scripts/build-imagenes.py) to public/imagenes/productos/, where Next serves
// them. Runs before `next dev` and `next build` (predev and prebuild); the
// copy is not committed. Not a symlink: Vercel copies public/ to its output
// as is, and a link out of app/ breaks the deployment there
import { cpSync, rmSync } from "node:fs";

const from = new URL("../../imagenes/productos/", import.meta.url);
const to = new URL("../public/imagenes/productos/", import.meta.url);

// From scratch, so photos removed from the repository go too
rmSync(to, { recursive: true, force: true });
cpSync(from, to, { recursive: true });
