"use client";

import { createContext, useContext } from "react";
import type { MenuItemData } from "../lib/menuData";

export const DishModalContext = createContext<((item: MenuItemData) => void) | null>(null);

export function useOpenDishModal() {
  const openDish = useContext(DishModalContext);
  if (!openDish) {
    throw new Error("useOpenDishModal debe usarse dentro de <DishModalProvider>");
  }
  return openDish;
}
