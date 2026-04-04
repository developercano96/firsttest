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
};

export default function MenuCategory({ category, items }: Props) {
  return (
    <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px" }}>
  
      {/* Cabecera precios */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontWeight: "bold", borderBottom: "1px solid #ccc" }}>
        <span>{category}</span>
        <span>P / G</span>
      </div>

      {items.map((item) => (
        <MenuItem
          key={item.name}
          name={item.name}
          description={item.description}
          priceP={item.priceP}
          priceG={item.priceG}
        />
      ))}
    </div>
  );
}