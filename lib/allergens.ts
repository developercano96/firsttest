import type { IconType } from "react-icons";
import {
  GiWheat,
  GiShrimp,
  GiFriedEggs,
  GiFishCooked,
  GiPeanut,
  GiSprout,
  GiMilkCarton,
  GiAlmond,
  GiHerbsBundle,
  GiSeedling,
  GiSesame,
  GiWineBottle,
  GiFlowerPot,
  GiMussel,
} from "react-icons/gi";

export type AllergenCode =
  | "gluten"
  | "crustaceans"
  | "eggs"
  | "fish"
  | "peanuts"
  | "soy"
  | "milk"
  | "nuts"
  | "celery"
  | "mustard"
  | "sesame"
  | "sulphites"
  | "lupin"
  | "molluscs";

type AllergenInfo = {
  label: string;
  Icon: IconType;
  // Un tono para modo claro y otro para oscuro (se combinan con la función
  // CSS light-dark() en el punto de uso — ver AllergenIcons).
  color: { light: string; dark: string };
};

// Los 14 alérgenos de declaración obligatoria en la UE (Reglamento 1169/2011).
// Colores por asociación con el ingrediente (convención habitual del sector:
// trigo=dorado, leche=azul, marisco=naranja, vino/sulfitos=morado...). El
// icono ya distingue cada alérgeno por forma; el color es un refuerzo visual.
export const ALLERGENS: Record<AllergenCode, AllergenInfo> = {
  gluten: { label: "Gluten", Icon: GiWheat, color: { light: "#b8860b", dark: "#e0af3d" } },
  crustaceans: { label: "Crustáceos", Icon: GiShrimp, color: { light: "#d9622b", dark: "#f0854f" } },
  eggs: { label: "Huevos", Icon: GiFriedEggs, color: { light: "#d4a017", dark: "#f2c94c" } },
  fish: { label: "Pescado", Icon: GiFishCooked, color: { light: "#1f7a8c", dark: "#4fb3c9" } },
  peanuts: { label: "Cacahuetes", Icon: GiPeanut, color: { light: "#8a5a2b", dark: "#c48a4f" } },
  soy: { label: "Soja", Icon: GiSprout, color: { light: "#3f8f4f", dark: "#6cbf7a" } },
  milk: { label: "Lácteos", Icon: GiMilkCarton, color: { light: "#5b7fc4", dark: "#93aef0" } },
  nuts: { label: "Frutos de cáscara", Icon: GiAlmond, color: { light: "#6b4226", dark: "#a9754a" } },
  celery: { label: "Apio", Icon: GiHerbsBundle, color: { light: "#6b8e23", dark: "#9dbf4b" } },
  mustard: { label: "Mostaza", Icon: GiSeedling, color: { light: "#8a8a1f", dark: "#bcbf4f" } },
  sesame: { label: "Sésamo", Icon: GiSesame, color: { light: "#a9895a", dark: "#d4b483" } },
  sulphites: { label: "Sulfitos", Icon: GiWineBottle, color: { light: "#7b4b94", dark: "#b085c9" } },
  lupin: { label: "Altramuces", Icon: GiFlowerPot, color: { light: "#9256b0", dark: "#c88ce0" } },
  molluscs: { label: "Moluscos", Icon: GiMussel, color: { light: "#2e8b7a", dark: "#55c2ab" } },
};
