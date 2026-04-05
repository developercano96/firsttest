type Props = {
  name: string;
  description: string;
  priceP: string;
  priceG?: string;
  dualPrice: boolean;
};

export default function MenuItem({
  name,
  description,
  priceP,
  priceG,
  dualPrice
}: Props) {
  const isDual = dualPrice === true;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isDual ? "1fr 60px 60px" : "1fr 80px",
        padding: "8px",
        borderBottom: "1px solid #eee",
        alignItems: "center"
      }}
    >
      {/* Nombre + descripción */}
      <div>
        <div style={{ fontWeight: "500" }}>{name}</div>
        {description && (
          <div style={{ fontSize: "12px", color: "#666" }}>
            {description}
          </div>
        )}
      </div>

      {/* Precios */}
      {isDual ? (
        <>
          <div style={{ textAlign: "center" }}>{priceP || ""}</div>
          <div style={{ textAlign: "center" }}>{priceG || ""}</div>
        </>
      ) : (
        <div style={{ textAlign: "center" }}>
          {priceP || priceG || ""}
        </div>
      )}
    </div>
  );
}