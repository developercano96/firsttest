type MenuItemProps = {
  name: string;
  description: string;
  priceP: string;
  priceG?: string;
};

export default function MenuItem({ name, description, priceP, priceG }: MenuItemProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #ccc" }}>
      <div>
        <p>{name}</p>
        <p style={{color: "grey"}}>{description}</p>
      </div>
      <span>
        {priceP && priceG
          ? `${priceP} / ${priceG}`
          : priceP || priceG}
      </span>
    </div>
  );
}