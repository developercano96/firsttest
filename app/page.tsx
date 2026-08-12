import MenuCategory from "../components/MenuCategory";
import CategoryNav from "../components/CategoryNav";
import DishModalProvider from "../components/DishModalProvider";
import rawMenuData from "../data/menu.json";
import { parseMenuData } from "../lib/menuData";

const menuData = parseMenuData(rawMenuData);

const RESTAURANT_NAME = "Carta Digital";
const RESTAURANT_TAGLINE = "Nuestra selección del día";

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 bg-[var(--primary)] text-[var(--accent)] shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 text-center">
          <h1 className="text-3xl font-bold">{RESTAURANT_NAME}</h1>
          <p className="text-base opacity-80">{RESTAURANT_TAGLINE}</p>
        </div>

        <CategoryNav categories={menuData.map((category) => category.category)} />
      </header>

      <DishModalProvider>
        <main className="max-w-2xl mx-auto flex flex-col gap-6 px-4 py-6">
          {menuData.map((category) => (
            <MenuCategory
              key={category.category}
              category={category.category}
              dualPrice={category.dualPrice}
              items={category.items}
            />
          ))}
        </main>
      </DishModalProvider>
    </div>
  );
}
