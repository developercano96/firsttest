import AllergenIcons from "./AllergenIcons";
import { formatPrice } from "../lib/format";
import { priceGridCols } from "../lib/priceGrid";
import type { AllergenCode } from "../lib/allergens";

type Props = {
  name: string;
  description: string;
  priceP: number | null;
  priceG?: number | null;
  dualPrice: boolean;
  isLast?: boolean;
  allergens?: AllergenCode[];
};

export default function MenuItem({
  name,
  description,
  priceP,
  priceG,
  dualPrice,
  isLast,
  allergens,
}: Props) {
  return (
    <div
      className={`grid ${priceGridCols(dualPrice)} px-4 py-3 items-center ${
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
    </div>
  );
}