"use client";

import { useCallback, useState, type ReactNode } from "react";
import { DishModalContext } from "./DishModalContext";
import DishModal from "./DishModal";
import type { MenuItemData } from "../lib/menuData";

type Props = {
  children: ReactNode;
};

export default function DishModalProvider({ children }: Props) {
  const [selected, setSelected] = useState<MenuItemData | null>(null);

  const openDish = useCallback((item: MenuItemData) => {
    setSelected(item);
  }, []);

  const closeDish = useCallback(() => {
    setSelected(null);
  }, []);

  return (
    <DishModalContext.Provider value={openDish}>
      {children}
      <DishModal item={selected} onRequestClose={closeDish} />
    </DishModalContext.Provider>
  );
}
