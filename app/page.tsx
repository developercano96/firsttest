import MenuCategory from "../components/MenuCategory";
import menuData from "../data/menu.json";

export default function Home() {
  return (
    <div className="min-h-screen px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Carta del Restaurante
      </h1>

      <div className="flex flex-col gap-6">
        {menuData.map((category) => (
          <MenuCategory
            key={category.category}
            category={category.category}
            dualPrice={category.dualPrice}
            items={category.items}
          />
        ))}
      </div>
    </div>
  );
}