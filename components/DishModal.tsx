"use client";

import { useEffect, useRef, useState } from "react";
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
  const imageSrc = item?.image ?? null;

  // Se guarda QUÉ imagen cargó, no un booleano que haya que resetear por
  // efecto: next/image dispara onLoad desde un efecto de layout cuando la
  // imagen ya está en caché, así que un reset en un efecto pasivo podía
  // llegar después y dejar el spinner girando para siempre. Comparando el
  // src no hay orden que valga: si coincide, esa imagen está lista.
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const imageLoaded = imageSrc !== null && loadedSrc === imageSrc;

  const dialogRef = useRef<HTMLDivElement>(null);
  // Evita que dos cierres seguidos (Escape mantenido, doble toque en el fondo)
  // consuman dos entradas de historial y saquen al usuario de la carta: el
  // listener no se retira hasta que popstate provoca el re-render.
  const closingRef = useRef(false);

  // Deja una entrada de historial al abrir, para que el botón/gesto "atrás"
  // de Android cierre el modal en vez de salir de la página. Cualquier vía
  // de cierre (X, fondo, Escape) pasa siempre por history.back(): así solo
  // popstate limpia el estado, y nunca queda una entrada de historial suelta.
  useEffect(() => {
    if (!isOpen) return;

    closingRef.current = false;

    // Conserva el estado que hubiera (Next marca sus entradas con __NA). Tras
    // navegar a un ancla del nav el estado es null, y sin propagarlo el
    // "adelante" del navegador acababa recargando la página entera.
    window.history.pushState({ ...window.history.state, dishModal: true }, "");
    document.body.style.overflow = "hidden";

    // El foco vive fuera del diálogo (en la fila del plato que lo abrió), y
    // aria-modal="true" le dice al lector de pantalla que ignore todo lo de
    // fuera: sin moverlo, no habría forma de alcanzar ni el botón de cerrar.
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    function onPopState() {
      onRequestClose();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") requestClose();
    }

    window.addEventListener("popstate", onPopState);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function requestClose() {
    if (closingRef.current) return;
    closingRef.current = true;
    window.history.back();
  }

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onClick={requestClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
        tabIndex={-1}
        className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-[var(--card)] text-[var(--text)] outline-none sm:max-w-md sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* El tinte se queda en 10%: con una cabecera oscura, al 20% el fondo
            bajaba de 4.5:1 contra el texto "Foto no disponible". */}
        <div className="relative aspect-4/3 bg-[var(--primary)]/10">
          {imageSrc ? (
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
                src={imageSrc}
                alt={item.name}
                fill
                className={`object-cover transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                sizes="(max-width: 640px) 100vw, 480px"
                onLoad={() => setLoadedSrc(imageSrc)}
                onError={() => setLoadedSrc(imageSrc)}
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
            onClick={requestClose}
            aria-label="Cerrar"
            className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white"
          >
            <IoClose size={22} />
          </button>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold">{item.name}</h3>

          {item.ingredients && (
            <p className="mt-1 text-sm leading-snug text-[var(--muted)]">{item.ingredients}</p>
          )}

          {/* Terciario respecto al nombre y a los ingredientes. La jerarquía se
              marca con cursiva y con el recuadro hundido, no bajando la
              opacidad: por debajo del 90% este gris cae de 4.5:1 en claro.
              El fondo es --bg (la superficie hundida de la paleta) en vez de
              un tinte de --primary, que en modo oscuro apenas se distinguiría
              de la tarjeta; el borde es lo que le da definición al recuadro. */}
          {item.description && (
            <p className="mt-3 mb-4 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 text-sm italic leading-snug text-[var(--muted)]">
              {item.description}
            </p>
          )}

          <AllergenIcons allergens={item.allergens} withLabels />
        </div>
      </div>
    </div>
  );
}
