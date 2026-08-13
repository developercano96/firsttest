import Image from "next/image";
import MenuCategory from "../components/MenuCategory";
import CategoryNav from "../components/CategoryNav";
import DishModalProvider from "../components/DishModalProvider";
import AllergenLegend from "../components/AllergenLegend";
import rawMenuData from "../data/menu.json";
import { collectAllergens, parseMenuData } from "../lib/menuData";
import { BRAND } from "../lib/brand";

const menuData = parseMenuData(rawMenuData);
const usedAllergens = collectAllergens(menuData);
const hasDualPrice = menuData.some((category) => category.dualPrice);

export default function Home() {
  return (
    <div className="min-h-screen">
      <header
        id="site-header"
        className="sticky top-0 z-20 bg-[var(--primary)] text-[var(--accent)] shadow-sm"
      >
        <div className="relative max-w-2xl mx-auto px-4 py-3">
          {/* Posicionado en absoluto para que el título quede centrado
              respecto a la cabecera entera y no respecto al hueco sobrante. */}
          <Image
            src={BRAND.logoUrl}
            alt=""
            width={96}
            height={96}
            priority
            // El logo es negro sobre transparente y --primary es oscuro en
            // claro y en oscuro, así que se invierte siempre. Si un cliente
            // configura una cabecera clara, hay que quitar este `invert`.
            className="invert absolute top-1/2 left-4 h-12 w-12 -translate-y-1/2"
          />

          {/* El padding lateral reserva el ancho del logo a ambos lados: con un
              nombre largo el título parte línea en vez de meterse debajo. */}
          <div className="px-14 text-center">
            <h1 className="text-3xl font-bold leading-tight">{BRAND.name}</h1>
            <p className="text-base opacity-80">{BRAND.tagline}</p>
          </div>
        </div>

        <CategoryNav
          categories={menuData.map((category) => category.category)}
          showAllergenLink={usedAllergens.length > 0}
        />
      </header>

      <DishModalProvider>
        <main className="max-w-2xl mx-auto flex flex-col gap-6 px-4 py-6">
          {hasDualPrice && (
            <p className="text-sm text-[var(--muted)] text-center leading-snug">
              Peq. = ración pequeña · Gde. = ración grande
            </p>
          )}

          {menuData.map((category) => (
            <MenuCategory
              key={category.category}
              category={category.category}
              dualPrice={category.dualPrice}
              items={category.items}
            />
          ))}

          <AllergenLegend allergens={usedAllergens} />
        </main>
      </DishModalProvider>
    </div>
  );
}
