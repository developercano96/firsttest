import MenuItem from "./MenuItem";
import { slugify } from "../lib/slugify";
import { priceGridCols } from "../lib/priceGrid";
import type { MenuItemData } from "../lib/menuData";

type Props = {
  category: string;
  items: MenuItemData[];
  dualPrice: boolean;
};

export default function MenuCategory({ category, items, dualPrice }: Props) {
  return (
    <div
      id={slugify(category)}
      className="scroll-mt-[var(--anchor-offset)] bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden"
    >

      {/* Header */}
      <div
        className={`grid ${priceGridCols(dualPrice)} px-4 py-3 bg-[var(--primary)] text-[var(--accent)] text-base font-semibold`}
      >
        <h2 className="text-lg">{category}</h2>

        {dualPrice ? (
          <>
            <span className="text-center text-sm">Peq.</span>
            <span className="text-center text-sm">Gde.</span>
          </>
        ) : (
          <span className="text-center">€</span>
        )}
      </div>

      {/* Items */}
      <div>
        {items.map((item, index) => (
          <MenuItem
            key={`${slugify(item.name)}-${index}`}
            {...item}
            dualPrice={dualPrice}
            isLast={index === items.length - 1}
          />
        ))}
      </div>
    </div>
  );
}