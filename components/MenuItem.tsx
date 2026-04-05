type Props = {
  name: string;
  description: string;
  priceP: string;
  priceG?: string;
  dualPrice: boolean;
  isLast?: boolean;
};

export default function MenuItem({
  name,
  description,
  priceP,
  priceG,
  dualPrice,
  isLast
}: Props) {
  const isDual = dualPrice === true;

  return (
    <div
      className={`grid ${
        isDual ? "grid-cols-[1fr_60px_60px]" : "grid-cols-[1fr_80px]"
      } px-4 py-3 items-center ${
        !isLast ? "border-b border-[var(--border)]" : ""
      }`}
    >
      {/* Nombre + descripción */}
      <div className="pr-2">
        <div className="font-medium text-sm leading-snug">
          {name}
        </div>

        {description && (
          <div className="text-xs text-[var(--muted)] mt-1 leading-snug">
            {description}
          </div>
        )}
      </div>

      {/* Precios */}
      {isDual ? (
        <>
          <div className="text-center text-sm font-medium">
            {priceP || ""}
          </div>
          <div className="text-center text-sm font-medium">
            {priceG || ""}
          </div>
        </>
      ) : (
        <div className="text-center text-sm font-medium">
          {priceP || priceG || ""}
        </div>
      )}
    </div>
  );
}