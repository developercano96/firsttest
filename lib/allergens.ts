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
};

// Los 14 alérgenos de declaración obligatoria en la UE (Reglamento 1169/2011).
export const ALLERGENS: Record<AllergenCode, AllergenInfo> = {
  gluten: { label: "Gluten", Icon: GiWheat },
  crustaceans: { label: "Crustáceos", Icon: GiShrimp },
  eggs: { label: "Huevos", Icon: GiFriedEggs },
  fish: { label: "Pescado", Icon: GiFishCooked },
  peanuts: { label: "Cacahuetes", Icon: GiPeanut },
  soy: { label: "Soja", Icon: GiSprout },
  milk: { label: "Lácteos", Icon: GiMilkCarton },
  nuts: { label: "Frutos de cáscara", Icon: GiAlmond },
  celery: { label: "Apio", Icon: GiHerbsBundle },
  mustard: { label: "Mostaza", Icon: GiSeedling },
  sesame: { label: "Sésamo", Icon: GiSesame },
  sulphites: { label: "Sulfitos", Icon: GiWineBottle },
  lupin: { label: "Altramuces", Icon: GiFlowerPot },
  molluscs: { label: "Moluscos", Icon: GiMussel },
};
