import { ALLERGENS, type AllergenCode } from "../lib/allergens";

type Props = {
  allergens?: AllergenCode[];
};

export default function AllergenIcons({ allergens }: Props) {
  if (!allergens || allergens.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-1.5">
      {allergens.map((code) => {
        const info = ALLERGENS[code];
        if (!info) return null;
        const { label, Icon } = info;
        const color = `light-dark(${info.color.light}, ${info.color.dark})`;

        return (
          <span
            key={code}
            title={label}
            aria-label={label}
            className="inline-flex items-center justify-center rounded-full p-1"
            style={{
              color,
              backgroundColor: `color-mix(in oklab, ${color} 18%, transparent)`,
            }}
          >
            <Icon size={20} />
          </span>
        );
      })}
    </div>
  );
}
