import MenuItem from "./MenuItem";

type Item = {
  name: string;
  description: string;
  priceP: string;
  priceG?: string;
};

type Props = {
  category: string;
  items: Item[];
  dualPrice: boolean;
};

export default function MenuCategory({ category, items, dualPrice }: Props) {
  const isDual = dualPrice === true;

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden">
      
      {/* Header */}
      <div
        className={`grid ${
          isDual ? "grid-cols-[1fr_60px_60px]" : "grid-cols-[1fr_80px]"
        } px-4 py-3 bg-[var(--primary)] text-[var(--accent)] text-sm font-semibold`}
      > 
        <h2 className="text-base">{category}</h2>

        {isDual ? (
          <>
            <span className="text-center">P</span>
            <span className="text-center">G</span>
          </>
        ) : (
          <span className="text-center">€</span>
        )}
      </div>

      {/* Items */}
      <div>
        {items.map((item, index) => (
          <MenuItem
            key={item.name}
            {...item}
            dualPrice={dualPrice}
            isLast={index === items.length - 1}
          />
        ))}
      </div>
    </div>
  );
}