# TODO — firsttest (carta digital)

Lista de mejoras identificadas en revisión de código (2026-08-12/13). Se van marcando como `[x]` al ejecutar o anotando "descartado" con el motivo. Numeración fija para referenciar cada tarea (no reordenar ni renumerar al tachar).

## Arquitectura

- [x] **1. Menú como JSON estático compilado** — **descartado como problema**: es el modelo de negocio pretendido (SaaS donde el cambio de carta es un servicio de pago que gestionamos nosotros, no autogestión del restaurante). Pendiente sí queda pensar el flujo *interno* para generar el JSON de cada cliente nuevo a partir de su carta física, y la arquitectura multi-tenant para servir un JSON distinto por restaurante.
> **Nota sobre las tareas 2 y 20.** No son trabajo pendiente en este repo: no se pueden cerrar aquí porque "Taste & Flavor" es un restaurante inventado y no hay nadie con quien confirmar los datos. Son **puertas del proceso de alta de cada cliente real**, y quedan abiertas a propósito como recordatorio. Revisado el 2026-08-13: se decide no construir nada alrededor todavía (ni bandera de datos verificados, ni checklist de alta) hasta que haya un cliente de verdad.

- [ ] **2. Alérgenos inferidos a mano** (acordado como MVP) — antes de producción real, esos datos deberían venir confirmados por el restaurante, no adivinados por contexto. Es la más seria de las dos: la información de alérgenos en hostelería está regulada (Reglamento UE 1169/2011 y, en España, RD 126/2015 para producto no envasado) y la responsabilidad recae en el establecimiento. No admite "ya lo corregiremos". Único cortafuegos hoy: la frase de la leyenda de alérgenos.
- [ ] **20. Descripciones de plato inventadas** — las 52 `description` de `data/menu.json` son texto de relleno escrito para la demo, no información real de ningún restaurante. Menos grave que la 2 (una promesa que el bar no ha hecho, no un riesgo para el comensal), pero para un cliente real tienen que venir de él. Sirven perfectamente para vender la app; no para servirlas a un comensal.
- [ ] **3. Todo en un único árbol de Server Components sin code-splitting por categoría** — **diferido**: no es problema con 52 items; revisitar solo si algún cliente del SaaS tiene una carta mucho más grande (p. ej. 300+ referencias) donde el streaming/code-splitting por categoría empiece a aportar valor.

## Funcionalidad

- [ ] **4. Sin buscador ni filtro** — con el trabajo de alérgenos ya hecho, un filtro tipo "sin gluten" / "sin lácteos" sería una mejora natural y de alto valor. — **fuera del MVP**, revisitar en una fase posterior.
- [ ] **5. Sin toggle manual de tema oscuro** — hoy solo sigue el `prefers-color-scheme` del sistema; ya están las variables listas para un switch manual. — **fuera del MVP**, revisitar en una fase posterior.
- [ ] **6. Sin marcado de "agotado"** — típico en cartas de restaurante para platos del día no disponibles. — **fuera del MVP**, revisitar en una fase posterior.
- [x] **7. Sin manifest.json (PWA)** — **descartado**: no tiene sentido para esta app (uso puntual vía QR en mesa, no un caso de uso de "añadir a pantalla de inicio").
- [x] **8. Sin multi-idioma** — **descartado**: al ser una web, la traducción nativa del navegador (Chrome/Safari) cubre el caso del cliente extranjero sin coste de desarrollo ni de mantenimiento por cliente. Requisito ya cumplido: `<html lang="es">` está correctamente declarado en `app/layout.tsx`, que es lo que dispara la propuesta de traducción del navegador.

## Interfaz / UX

- [x] **9. Iconos de alérgeno dependen del `title` (tooltip)** — **hecho**: `AllergenIcons` acepta `withLabels` y muestra el nombre escrito junto al icono; el modal de plato lo usa, y se añade una sección de leyenda al final de la carta (`AllergenLegend`, ancla `#alergenos`) con atajo desde el nav. La leyenda lista solo los alérgenos presentes en la carta (`collectAllergens`), no los 14 del reglamento.
- [x] **10. Sin estado de foco visible** en los pills del nav / enlaces para navegación por teclado. — **descartado**: el uso real es 100% móvil (escaneo de QR en mesa), no hay navegación por teclado en ese contexto.
- [x] **11. Columnas "P" / "G" sin explicar** — **hecho**: confirmado con el usuario que son Pequeña/Grande. Cabeceras pasan a "Peq." / "Gde." y se añade una nota al inicio de la carta ("Peq. = ración pequeña · Gde. = ración grande"), solo si alguna categoría usa precio dual.
- [x] **12. Contraste de colores de alérgeno** — **hecho**. Al medirlo, los que fallaban WCAG AA (3:1 para elementos gráficos) en modo claro no eran mostaza/apio sino **huevos (2.05), gluten (2.69), sésamo (2.74) y crustáceos (2.96)**; mostaza (3.01) y apio (3.11) pasaban por poco. Reajustados los 14 tonos para dar ≥3.5:1 contra su propia píldora (tinte 18% sobre tarjeta) en claro y oscuro.

## SEO / metadata

- [x] **13. Sin Open Graph / Twitter card** — **hecho**: `app/opengraph-image.tsx` genera con `ImageResponse` una tarjeta 1200×630 (logo + tagline sobre fondo hueso), y `app/twitter-image.tsx` la reutiliza. Metadatos `openGraph` y `twitter` (`summary_large_image`) en `layout.tsx`, con `metadataBase` resuelto por entorno. La tarjeta va sobre hueso y no sobre pizarra porque satori no soporta `filter` y el logo es negro sobre transparente.
  - **Resuelto**: el despliegue es siempre en Vercel, que rellena `VERCEL_PROJECT_PRODUCTION_URL` sola. No hay que configurar nada; solo comprobar una vez que está marcada **"Enable access to System Environment Variables"** en Settings → Environment Variables del proyecto. En local `og:image` seguirá apuntando a `localhost`, lo cual es irrelevante porque ahí nadie lo scrapea.
- [x] **14. Favicon y SVGs por defecto de `create-next-app`** — **hecho**: eliminados `app/favicon.ico` y los 5 SVG de `public/` (ninguno estaba referenciado; venían del commit inicial y son recuperables desde git). Añadidos `app/icon.png` (512×512) y `app/apple-icon.png` (180×180), generados con `sharp` desde el logo del blob y compuestos sobre placa hueso — el logo es negro sobre transparente y desaparecería en barras de pestañas oscuras.

## Seguridad / dependencias

- [x] **15. Next.js 16.2.0 con avisos de seguridad** — **hecho**: subido a 16.3.0 (con `eslint-config-next` a juego, ambos pineados exactos). Arrastra `sharp` 0.34.5 → 0.35.3 (CVE de libvips) y `postcss` → 8.5.23 (XSS y path traversal). Las 4 vulnerabilidades restantes eran transitivas solo de desarrollo (babel, brace-expansion, js-yaml, picomatch) y se cerraron con `npm audit fix` sin `--force`. **`npm audit`: 0 vulnerabilidades.**
  - Verificado tras el salto: typecheck, lint y build limpios, y 16 comprobaciones de humo sobre la app en marcha (logo, cabeceras de precio, leyenda de alérgenos, descripciones, imagen OG, favicons). Sin cambios de código necesarios.

## Branding de prueba (soporte para tarea 13 y 14)

- [x] **16. Generar una imagen de logo del restaurante a modo de prueba** — **hecho por el usuario** (PNG de prueba).
- [x] **17. Subir el logo de prueba a Vercel Blob** — **hecho por el usuario**. Falta que nos pase la URL pública: el proyecto no tiene `@vercel/blob` ni token en `.env`, así que no se puede listar el store desde el código.
- [x] **18. Implementar el logo en la interfaz** — **hecho**. El logo (`logo-test.png`, 1024×1024 RGBA, negro sobre transparente) se consume desde el blob en la cabecera vía `next/image`, y se sustituyó el `<h1>` por él (el `<h1>` queda `sr-only` para lectores de pantalla y buscadores). Como el logo dice "TASTE & FLAVOR", se cambió el nombre de la app a ese, centralizado en `lib/brand.ts`. Se invierte con `invert` porque `--primary` es oscuro en ambos modos.
  - Efecto lateral resuelto: al crecer la cabecera se rompía la calibración del scrollspy (`scroll-mt-36` y `TRIGGER_OFFSET = 150`, números fijos). En vez de recalcularlos a mano, `CategoryNav` mide ahora la cabecera con un `ResizeObserver` y publica `--header-h`, que usan las secciones como `scroll-margin-top`. Queda válido para cualquier logo de cualquier cliente.

## Diseño

- [x] **19. Paleta de colores genérica para la app de muestra** — **hecho**. Se descartó la base marrón/arena inicial y se aplicó **"pizarra y hueso"** (monocromo, sin identidad de cocina concreta, para que sirva de demo ante cualquier cliente). Incluyó un cambio estructural: los pills de `CategoryNav` estaban definidos contra `--card`, lo que ataba la cabecera a ser clara; ahora se definen contra `--primary`/`--accent`, así que la plantilla admite cabecera clara u oscura sin tocar clases. Verificados por cálculo los 8 pares que la interfaz superpone (todos ≥4.5:1 en claro y oscuro) y revalidados los 14 colores de alérgeno contra la nueva tarjeta. Documentado en `globals.css` que solo `--primary` y `--accent` llevan carga de marca, para personalizar por cliente.
