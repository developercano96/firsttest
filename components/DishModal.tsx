"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { GiKnifeFork } from "react-icons/gi";
import AllergenIcons from "./AllergenIcons";
import type { MenuItemData } from "../lib/menuData";

type Props = {
  item: MenuItemData | null;
  onRequestClose: () => void;
};

export default function DishModal({ item, onRequestClose }: Props) {
  const isOpen = item !== null;
  const [imageLoaded, setImageLoaded] = useState(false);

  // Cada plato arranca con su propia imagen por cargar, para que el spinner
  // vuelva a aparecer al abrir otro y no herede el estado del anterior.
  useEffect(() => {
    setImageLoaded(false);
  }, [item?.image]);

  // Deja una entrada de historial al abrir, para que el botón/gesto "atrás"
  // de Android cierre el modal en vez de salir de la página. Cualquier vía
  // de cierre (X, fondo, Escape) pasa siempre por history.back(): así solo
  // popstate limpia el estado, y nunca queda una entrada de historial suelta.
  useEffect(() => {
    if (!isOpen) return;

    window.history.pushState({ dishModal: true }, "");
    document.body.style.overflow = "hidden";

    function onPopState() {
      onRequestClose();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") window.history.back();
    }

    window.addEventListener("popstate", onPopState);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!item) return null;

  function handleClose() {
    window.history.back();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
        className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-[var(--card)] text-[var(--text)] sm:max-w-md sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-4/3 bg-[var(--primary)]/20">
          {item.image ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    role="status"
                    aria-label="Cargando imagen"
                    className="h-8 w-8 animate-spin rounded-full border-3 border-[var(--muted)]/30 border-t-[var(--muted)]"
                  />
                </div>
              )}

              <Image
                src={item.image}
                alt={item.name}
                fill
                className={`object-cover transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                sizes="(max-width: 640px) 100vw, 480px"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-[var(--muted)]">
              <GiKnifeFork size={40} />
              <span className="text-sm">Foto no disponible</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar"
            className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white"
          >
            <IoClose size={22} />
          </button>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold">{item.name}</h3>

          {item.description && (
            <p className="mt-1 text-sm leading-snug text-[var(--muted)]">{item.description}</p>
          )}

          <AllergenIcons allergens={item.allergens} />
        </div>
      </div>
    </div>
  );
}
