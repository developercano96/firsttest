import MenuItem from "./MenuItem";

export default function MenuCategory({ category, items }: { category: string; items: { name: string; price: string }[] }) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>{category}</h2>
      <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "8px" }}>
        {items.map((item) => (
          <MenuItem key={item.name} name={item.name} price={item.price} />
        ))}
      </div>
    </div>
  );
}