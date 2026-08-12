"use client";

import { useEffect, useRef, useState } from "react";
import { slugify } from "../lib/slugify";

type Props = {
  categories: string[];
};

// Margen extra al llevar el pill activo a la vista, para que se asome el
// siguiente/anterior y quede claro que hay más categorías en esa dirección.
const SCROLL_PADDING = 64;
// Debe quedar por debajo de la altura real del header sticky (scroll-mt-36 = 144px).
const TRIGGER_OFFSET = 150;
// Tras pulsar un ancla, cuánto esperar sin eventos de scroll para considerar
// que el scroll animado ha terminado y recalcular la categoría activa.
const CLICK_SETTLE_DELAY = 150;
// Red de seguridad por si el clic no produce ningún scroll (p. ej. ya estaba
// a la vista), para no dejar el listener bloqueado indefinidamente.
const CLICK_FALLBACK_DELAY = 600;

export default function CategoryNav({ categories }: Props) {
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [active, setActive] = useState(() => slugify(categories[0] ?? ""));

  // Mientras el scroll lo provoca un clic en el nav, se ignoran las
  // categorías intermedias por las que se pasa de camino al destino.
  const suppressRef = useRef(false);
  const settleTimerRef = useRef<number | undefined>(undefined);
  const updateRef = useRef<() => void>(() => {});

  function scheduleRelease(delay: number) {
    if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current);
    settleTimerRef.current = window.setTimeout(() => {
      suppressRef.current = false;
      updateRef.current();
    }, delay);
  }

  useEffect(() => {
    const sections = categories
      .map((category) => document.getElementById(slugify(category)))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    // Recalcula desde cero en cada scroll: la activa es la última sección cuyo
    // borde superior ya cruzó la línea bajo el header. Al no depender del
    // estado anterior, sube y baja se resuelven igual sin quedar "pegado".
    function update() {
      const atBottom =
        window.innerHeight + Math.ceil(window.scrollY) >=
        document.documentElement.scrollHeight - 1;

      if (atBottom) {
        setActive(sections[sections.length - 1].id);
        return;
      }

      let currentId = sections[0].id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= TRIGGER_OFFSET) {
          currentId = section.id;
        } else {
          break;
        }
      }
      setActive(currentId);
    }
    updateRef.current = update;

    let ticking = false;
    function onScroll() {
      if (suppressRef.current) {
        scheduleRelease(CLICK_SETTLE_DELAY);
        return;
      }
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current);
    };
  }, [categories]);

  // Se dispara tanto al pulsar un ancla como cuando el scrollspy cambia la
  // categoría activa por scroll manual, así el pill correspondiente siempre
  // queda visible en el nav aunque esté fuera de su recorrido horizontal.
  useEffect(() => {
    const container = navRef.current;
    const link = linkRefs.current[active];
    if (!container || !link) return;

    const linkLeft = link.offsetLeft;
    const linkRight = linkLeft + link.offsetWidth;
    const viewLeft = container.scrollLeft;
    const viewRight = viewLeft + container.clientWidth;

    if (linkLeft < viewLeft) {
      container.scrollTo({ left: Math.max(linkLeft - SCROLL_PADDING, 0), behavior: "smooth" });
    } else if (linkRight > viewRight) {
      container.scrollTo({ left: linkRight - container.clientWidth + SCROLL_PADDING, behavior: "smooth" });
    }
  }, [active]);

  function handleClick(slug: string) {
    setActive(slug);
    suppressRef.current = true;
    scheduleRelease(CLICK_FALLBACK_DELAY);
  }

  return (
    <nav
      ref={navRef}
      className="max-w-2xl mx-auto flex gap-2 overflow-x-auto px-4 pb-3 text-sm"
    >
      {categories.map((category) => {
        const slug = slugify(category);
        const isActive = active === slug;

        return (
          <a
            key={slug}
            ref={(el) => {
              linkRefs.current[slug] = el;
            }}
            href={`#${slug}`}
            onClick={() => handleClick(slug)}
            className={`shrink-0 rounded-full px-3 py-1 font-medium whitespace-nowrap transition-colors ${
              isActive
                ? "bg-[var(--accent)] text-[var(--card)]"
                : "bg-[var(--card)]/80 hover:bg-[var(--card)]"
            }`}
          >
            {category}
          </a>
        );
      })}
    </nav>
  );
}
