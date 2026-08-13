import { ALLERGENS, type AllergenCode } from "../lib/allergens";

type Props = {
  allergens?: AllergenCode[];
  // En la fila de la carta no hay sitio para el nombre, pero donde sí lo hay
  // (modal, leyenda) se muestra escrito: en móvil no existe hover, así que el
  // tooltip del icono por sí solo no comunica nada.
  withLabels?: boolean;
};

export default function AllergenIcons({ allergens, withLabels }: Props) {
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
            className={`inline-flex items-center justify-center rounded-full p-1 ${
              withLabels ? "gap-1.5 pr-2.5 text-sm font-medium" : ""
            }`}
            style={{
              color,
              backgroundColor: `color-mix(in oklab, ${color} 18%, transparent)`,
            }}
          >
            <Icon size={20} />
            {withLabels && <span>{label}</span>}
          </span>
        );
      })}
    </div>
  );
}
