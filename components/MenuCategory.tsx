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
    <div style={{ marginBottom: "24px" }}>
      <div style={{ border: "1px solid #ccc", borderRadius: "8px" }}>
        
        {/* Cabecera */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isDual ? "1fr 60px 60px" : "1fr 80px",
            padding: "8px",
            fontWeight: "bold",
            borderBottom: "1px solid #ccc"
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
            {category}
          </h2>
          {isDual ? (
            <>
              <span style={{ textAlign: "center" }}>P</span>
              <span style={{ textAlign: "center" }}>G</span>
            </>
          ) : (
            <span style={{ textAlign: "center" }}>€</span>
          )}
        </div>

        {/* Items */}
        {items.map((item) => (
          <MenuItem key={item.name} {...item} dualPrice={dualPrice} />
        ))}
      </div>
    </div>
  );
}