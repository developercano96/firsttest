import MenuCategory from "../components/MenuCategory";
import menuData from "../data/menu.json";

export default function Home() {
  return (
    <div style={{ backgroundColor: "white", color: "black", minHeight: "100vh", padding: "16px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
        Carta del Restaurante
      </h1>
      <div>
        {menuData.map((category) => (
          <MenuCategory
            key={category.category}
            category={category.category} 
            dualPrice={category.dualPrice}
            items={category.items} />
        ))}
      </div>
    </div>
  );
}