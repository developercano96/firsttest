import MenuCategory from "../components/MenuCategory";
import rawMenuData from "../data/menu.json";
import { slugify } from "../lib/slugify";
import type { AllergenCode } from "../lib/allergens";

type MenuItemData = {
  name: string;
  description: string;
  priceP: string;
  priceG?: string;
  allergens?: AllergenCode[];
};

type MenuCategoryData = {
  category: string;
  dualPrice: boolean;
  items: MenuItemData[];
};

const menuData = rawMenuData as MenuCategoryData[];

const RESTAURANT_NAME = "Carta Digital";
const RESTAURANT_TAGLINE = "Nuestra selección del día";

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 bg-[var(--primary)] text-[var(--accent)] shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 text-center">
          <h1 className="text-2xl font-bold">{RESTAURANT_NAME}</h1>
          <p className="text-sm opacity-80">{RESTAURANT_TAGLINE}</p>
        </div>

        <nav className="max-w-2xl mx-auto flex gap-2 overflow-x-auto px-4 pb-3 text-sm">
          {menuData.map((category) => (
            <a
              key={category.category}
              href={`#${slugify(category.category)}`}
              className="shrink-0 rounded-full bg-[var(--card)]/80 px-3 py-1 font-medium whitespace-nowrap hover:bg-[var(--card)]"
            >
              {category.category}
            </a>
          ))}
        </nav>
      </header>

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
    </div>
  );
}
