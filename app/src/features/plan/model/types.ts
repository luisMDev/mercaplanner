/* Shape of recetas.json (repository root):
   {
     comidas: [{id, label, hora}]          meal slots of the day, in order
     recetas: [{id, nombre, tipos, descripcion, minutos, raciones, kcal,
                macros: {proteinas, carbohidratos, grasas}, ingredientes,
                pasos, notas, imagen}]
     semana:  {lunes: {<comida id>: <receta id>}, martes: {...}, ...}
   }
   A day may leave a slot out (no merienda on Saturday, say) */

export type Comida = { id: string; label: string; hora?: string };

export type Macros = { proteinas?: number; carbohidratos?: number; grasas?: number };

// Links an ingredient to a product of productos.json by id
// ({texto, sin_producto: true} when Mercadona does not sell it)
export type LinkedIngredient = {
  texto: string;
  producto?: string;
  producto_nombre?: string;
  gramos?: number;
  sin_producto?: boolean;
};

export type Ingredient = string | LinkedIngredient;

export type Receta = {
  id: string;
  nombre: string;
  tipos: string[];
  descripcion?: string;
  minutos?: number;
  raciones?: number;
  kcal?: number;
  macros?: Macros;
  ingredientes: Ingredient[];
  pasos: string[];
  notas?: string;
  // Path of its watercolour drawing, "imagenes/<id>.png" (scripts/imagen.py)
  imagen?: string;
};

export type Plan = {
  comidas: Comida[];
  recetas: Receta[];
  byId: Record<string, Receta>;
  semana: Record<string, Record<string, string>>;
};

// One filled slot of a day, with its recipe (null when the id does not match any)
export type Meal = { comida: Comida; recetaId: string; receta: Receta | null };
