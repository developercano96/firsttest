import { ALLERGENS, type AllergenCode } from "./allergens";

export type MenuItemData = {
  name: string;
  description: string;
  priceP: number | null;
  priceG?: number | null;
  allergens?: AllergenCode[];
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

function parseItem(raw: unknown, path: string): MenuItemData {
  const item = raw as Record<string, unknown>;

  if (typeof item.name !== "string" || !item.name) {
    throw new Error(`${path}: falta "name"`);
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

export function parseMenuData(raw: unknown): MenuCategoryData[] {
  if (!Array.isArray(raw)) {
    throw new Error("menu.json debe ser un array de categorías");
  }

  return raw.map((rawCategory, index) => {
    const category = rawCategory as Record<string, unknown>;
    const path = `menu.json[${index}]`;

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
