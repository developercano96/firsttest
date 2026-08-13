import AllergenIcons from "./AllergenIcons";
import { ALLERGEN_LEGEND_ID, type AllergenCode } from "../lib/allergens";

type Props = {
  allergens: AllergenCode[];
};

export default function AllergenLegend({ allergens }: Props) {
  if (allergens.length === 0) return null;

  return (
    <section
      id={ALLERGEN_LEGEND_ID}
      className="scroll-mt-[var(--header-h)] bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden"
    >
      <div className="px-4 py-3 bg-[var(--primary)] text-[var(--accent)]">
        <h2 className="text-lg font-semibold">Alérgenos</h2>
      </div>

      <div className="p-4">
        <p className="text-sm text-[var(--muted)] leading-snug">
          Estos son los iconos que verás junto a cada plato. Consúltanos ante cualquier duda
          o intolerancia.
        </p>

        <AllergenIcons allergens={allergens} withLabels />
      </div>
    </section>
  );
}
