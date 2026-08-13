import { ALLERGENS, ALLERGEN_ORDER, type AllergenCode } from "./allergens";

export type MenuItemData = {
  name: string;
  // Qué lleva el plato. Se muestra en la fila de la carta y en el modal.
  ingredients: string;
  // Cómo es el plato: textura, punto, cómo se sirve. Solo en el modal, para
  // no alargar la fila. Puede ir vacía si no aporta nada.
  description: string;
  priceP: number | null;
  priceG?: number | null;
  allergens?: AllergenCode[];
  // URL pública de Vercel Blob, o null mientras no haya foto del plato.
  image?: string | null;
};

export type MenuCategoryData = {
  category: string;
  dualPrice: boolean;
  items: MenuItemData[];
};

const VALID_ALLERGEN_CODES = new Set(Object.keys(ALLERGENS));

function isNullableNumber(value: unknown): value is number | null {
  return value === null || typeof value === "number";
}

// Para que el mensaje de error diga qué llegó, no solo qué se esperaba.
function describe(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "un array";
  return typeof value;
}

// Un null o un string sueltos en el JSON reventarían al leer propiedades, con
// un TypeError que no dice dónde está el problema. Como cada carta se escribe
// a mano por cliente, el error tiene que localizar la entrada.
function isPlainObject(raw: unknown): raw is Record<string, unknown> {
  return typeof raw === "object" && raw !== null && !Array.isArray(raw);
}

function parseItem(raw: unknown, path: string): MenuItemData {
  if (!isPlainObject(raw)) {
    throw new Error(`${path}: cada plato debe ser un objeto, recibido ${describe(raw)}`);
  }
  const item = raw;

  if (typeof item.name !== "string" || !item.name) {
    throw new Error(`${path}: falta "name"`);
  }
  if (typeof item.ingredients !== "string") {
    throw new Error(`${path}["${item.name}"]: "ingredients" debe ser string`);
  }
  if (typeof item.description !== "string") {
    throw new Error(`${path}["${item.name}"]: "description" debe ser string`);
  }
  if (!isNullableNumber(item.priceP)) {
    throw new Error(`${path}["${item.name}"]: "priceP" debe ser number o null`);
  }
  if (item.priceG !== undefined && !isNullableNumber(item.priceG)) {
    throw new Error(`${path}["${item.name}"]: "priceG" debe ser number o null`);
  }
  if (item.image !== undefined && item.image !== null && typeof item.image !== "string") {
    throw new Error(`${path}["${item.name}"]: "image" debe ser string o null`);
  }

  const allergens = (item.allergens as unknown[] | undefined) ?? [];
  if (!Array.isArray(allergens)) {
    throw new Error(`${path}["${item.name}"]: "allergens" debe ser un array`);
  }
  allergens.forEach((code) => {
    if (typeof code !== "string" || !VALID_ALLERGEN_CODES.has(code)) {
      throw new Error(`${path}["${item.name}"]: código de alérgeno desconocido "${String(code)}"`);
    }
  });

  return item as unknown as MenuItemData;
}

// Alérgenos que aparecen realmente en esta carta, para que la leyenda liste
// solo lo que el cliente puede encontrarse y no los 14 del reglamento.
export function collectAllergens(menu: MenuCategoryData[]): AllergenCode[] {
  const used = new Set(
    menu.flatMap((category) => category.items).flatMap((item) => item.allergens ?? []),
  );

  return ALLERGEN_ORDER.filter((code) => used.has(code));
}

export function parseMenuData(raw: unknown): MenuCategoryData[] {
  if (!Array.isArray(raw)) {
    throw new Error("menu.json debe ser un array de categorías");
  }

  return raw.map((rawCategory, index) => {
    const path = `menu.json[${index}]`;

    if (!isPlainObject(rawCategory)) {
      throw new Error(`${path}: cada categoría debe ser un objeto, recibido ${describe(rawCategory)}`);
    }
    const category = rawCategory;

    if (typeof category.category !== "string" || !category.category) {
      throw new Error(`${path}: falta "category"`);
    }
    if (typeof category.dualPrice !== "boolean") {
      throw new Error(`menu.json["${category.category}"]: "dualPrice" debe ser boolean`);
    }
    if (!Array.isArray(category.items)) {
      throw new Error(`menu.json["${category.category}"]: "items" debe ser un array`);
    }

    return {
      category: category.category,
      dualPrice: category.dualPrice,
      items: category.items.map((item) => parseItem(item, `menu.json["${category.category}"]`)),
    };
  });
}
