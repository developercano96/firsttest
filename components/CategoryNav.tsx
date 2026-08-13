"use client";

import { useEffect, useRef, useState } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { slugify } from "../lib/slugify";
import { ALLERGEN_LEGEND_ID } from "../lib/allergens";

type Props = {
  categories: string[];
  showAllergenLink?: boolean;
};

// Margen extra al llevar el pill activo a la vista, para que se asome el
// siguiente/anterior y quede claro que hay más categorías en esa dirección.
const SCROLL_PADDING = 64;
// Aire entre la cabecera sticky y la sección a la que se salta, para que la
// tarjeta no quede pegada al header.
const ANCHOR_GAP = 16;
// Epsilon sobre el punto de aterrizaje: sin él, una sección que cae justo en
// la línea puede quedar dentro o fuera según el redondeo subpíxel.
const TRIGGER_EPSILON = 2;
// Tras pulsar un ancla, cuánto esperar sin eventos de scroll para considerar
// que el scroll animado ha terminado y recalcular la categoría activa.
const CLICK_SETTLE_DELAY = 150;
// Red de seguridad por si el clic no produce ningún scroll (p. ej. ya estaba
// a la vista), para no dejar el listener bloqueado indefinidamente.
const CLICK_FALLBACK_DELAY = 600;

export default function CategoryNav({ categories, showAllergenLink }: Props) {
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [active, setActive] = useState(() => slugify(categories[0] ?? ""));
  // Dónde aterriza una sección al saltar a su ancla: alto real de la cabecera
  // (se mide, porque depende del logo de cada cliente) más el aire. Un único
  // valor alimenta el scroll-margin-top de las secciones (--anchor-offset) y
  // la línea de disparo del scrollspy, para que la categoría que se marca
  // activa sea exactamente la que queda bajo la cabecera.
  const anchorOffsetRef = useRef(0);

  // Mientras el scroll lo provoca un clic en el nav, se ignoran las
  // categorías intermedias por las que se pasa de camino al destino.
  const suppressRef = useRef(false);
  const settleTimerRef = useRef<number | undefined>(undefined);
  const updateRef = useRef<() => void>(() => {});

  // Al soltar la supresión no se recalcula: el destino del clic ya quedó
  // activo, y recalcular aquí es lo que permitía que el atajo de "final de
  // página" pisara la categoría recién pulsada. El siguiente scroll manual
  // vuelve a mandar.
  function scheduleRelease(delay: number) {
    if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current);
    settleTimerRef.current = window.setTimeout(() => {
      suppressRef.current = false;
    }, delay);
  }

  // El logo de la cabecera se carga de forma asíncrona, así que además de
  // medir al montar hay que volver a medir cuando termine de cargar y cuando
  // cambie el tamaño de la ventana.
  useEffect(() => {
    const header = document.getElementById("site-header");
    if (!header) return;

    function measure() {
      const offset = header!.offsetHeight + ANCHOR_GAP;
      if (offset === anchorOffsetRef.current) return;
      anchorOffsetRef.current = offset;
      document.documentElement.style.setProperty("--anchor-offset", `${offset}px`);
      updateRef.current();
    }

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

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

      const trigger = anchorOffsetRef.current + TRIGGER_EPSILON;
      let currentId = sections[0].id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= trigger) {
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

  // Cualquier ancla del nav tiene que silenciar el scrollspy mientras dura el
  // scroll animado, aunque no sea una categoría: si no, el spy va activando
  // todas las que atraviesa y el nav se sacude en horizontal por el camino.
  function suppressSpyDuringScroll() {
    suppressRef.current = true;
    scheduleRelease(CLICK_FALLBACK_DELAY);
  }

  function handleClick(slug: string) {
    setActive(slug);
    suppressSpyDuringScroll();
  }

  return (
    <nav
      ref={navRef}
      className="max-w-2xl mx-auto flex gap-2 overflow-x-auto px-4 pb-3 text-base"
    >
      {categories.map((category) => {
        const slug = slugify(category);
        const isActive = active === slug;

        // Los pills se definen contra --primary (el fondo de la cabecera) y no
        // contra la tarjeta, para que la paleta pueda llevar cabecera clara u
        // oscura sin retocar estas clases.
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
                ? "bg-[var(--accent)] text-[var(--primary)]"
                : "bg-[var(--accent)]/12 hover:bg-[var(--accent)]/20"
            }`}
          >
            {category}
          </a>
        );
      })}

      {/* Atajo a la leyenda. No es una categoría, así que queda fuera del
          scrollspy y se distingue con borde en vez de relleno. */}
      {showAllergenLink && (
        <a
          href={`#${ALLERGEN_LEGEND_ID}`}
          onClick={suppressSpyDuringScroll}
          className="shrink-0 inline-flex items-center gap-1 rounded-full border border-[var(--accent)]/40 px-3 py-1 font-medium whitespace-nowrap"
        >
          <IoInformationCircleOutline size={18} />
          Alérgenos
        </a>
      )}
    </nav>
  );
}
