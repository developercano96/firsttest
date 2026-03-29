export default function MenuItem({ name, price }: { name: string; price: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #ccc" }}>
      <span>{name}</span>
      <span>{price}</span>
    </div>
  );
}