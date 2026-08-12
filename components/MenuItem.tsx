"use client";

import AllergenIcons from "./AllergenIcons";
import { formatPrice } from "../lib/format";
import { priceGridCols } from "../lib/priceGrid";
import { useOpenDishModal } from "./DishModalContext";
import type { MenuItemData } from "../lib/menuData";

type Props = MenuItemData & {
  dualPrice: boolean;
  isLast?: boolean;
};

export default function MenuItem({
  name,
  description,
  priceP,
  priceG,
  dualPrice,
  isLast,
  allergens,
  image,
}: Props) {
  const openDish = useOpenDishModal();

  return (
    <button
      type="button"
      onClick={() => openDish({ name, description, priceP, priceG, allergens, image })}
      className={`grid ${priceGridCols(dualPrice)} w-full px-4 py-3 items-center text-left hover:bg-[var(--primary)]/10 ${
        !isLast ? "border-b border-[var(--border)]" : ""
      }`}
    >
      {/* Nombre + descripción */}
      <div className="pr-2">
        <div className="font-medium text-base leading-snug">
          {name}
        </div>

        {description && (
          <div className="text-sm text-[var(--muted)] mt-1 leading-snug">
            {description}
          </div>
        )}

        <AllergenIcons allergens={allergens} />
      </div>

      {/* Precios */}
      {dualPrice ? (
        <>
          <div className="text-center text-base font-medium">
            {formatPrice(priceP)}
          </div>
          <div className="text-center text-base font-medium">
            {formatPrice(priceG)}
          </div>
        </>
      ) : (
        <div className="text-center text-base font-medium">
          {formatPrice(priceP ?? priceG)}
        </div>
      )}
    </button>
  );
}
