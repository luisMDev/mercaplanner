// One food product of productos.json (repository root), as written by
// scripts/build-productos.py: empty values are left out, zeros are kept
export type Producto = {
  id: string;
  nombre: string;
  marca?: string;
  categoria: string;
  subcategoria: string;
  seccion: string;
  envase?: string;
  cantidad_neta?: number;
  unidad: string;
  peso_aproximado?: boolean;
  unidades_pack?: number;
  precio_eur: number;
  precio_referencia_eur?: number;
  formato_referencia?: string;
  kcal_100?: number;
  proteinas_100?: number;
  carbohidratos_100?: number;
  azucares_100?: number;
  grasas_100?: number;
  grasas_saturadas_100?: number;
  fibra_100?: number;
  sal_100?: number;
  // "openfoodfacts", or "generico_estimado" for generic values, not the label's
  fuente_nutricion: string;
  url?: string;
  // Photos of the front and of the back label, "imagenes/productos/<id>.webp"
  // and "...-etiqueta.webp", from scripts/build-imagenes.py
  imagen?: string;
  imagen_etiqueta?: string;
  // Normalized name, brand and sections, for the search
  _text: string;
};
