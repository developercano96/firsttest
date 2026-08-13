# Qué es este proyecto

Esto empezó como una prueba (`firsttest`) y hoy es el **MVP** de un producto: una carta digital que se abre escaneando un QR en la mesa.

La instancia actual es una **demo de venta**. El restaurante "Taste & Flavor" no existe: el logo es de prueba, la carta viene de un bar real pero los alérgenos los dedujo un modelo y las descripciones están inventadas. Sirve para enseñar el producto a un cliente potencial, **no para servirla a un comensal** (ver tareas 2 y 20 de `TODO.md`).

## Hacia dónde va

El plan es extraer este código a un repositorio semilla, **`carta-seed`**, y construir un **agente** que, dados los datos de un restaurante concreto (logo, carta física, nombre, colores), genere una instancia nueva a partir de la semilla y la despliegue en Vercel.

Cada restaurante = un repositorio + un despliegue + un store de Blob propios.

## Modelo de negocio (condiciona la arquitectura)

**El restaurante no edita su carta.** No hay panel de administración ni CMS, y no es una carencia: cambiar la carta es un **servicio de pago** que gestionamos nosotros. Por eso el menú vive en un JSON compilado en el repo y no en una base de datos con backoffice.

Cualquier propuesta que dé autogestión al cliente contradice el modelo. Antes de plantearla, confirmar que la decisión ha cambiado.

## La superficie de personalización

Esto es lo que el agente generador tiene que rellenar por cliente. Todo lo demás del código es común y no se toca.

| Qué | Dónde | Notas |
|---|---|---|
| Nombre, tagline, descripción, URL del logo | `lib/brand.ts` | Único fichero de identidad textual |
| Categorías, platos, precios, alérgenos | `data/menu.json` | Validado por `lib/menuData.ts`, que falla el build con un error localizado |
| Color de marca | `app/globals.css` | **Solo `--primary` y `--accent`**, en claro y en oscuro. El resto son neutros de soporte |
| Favicon e icono de Apple | `app/icon.png`, `app/apple-icon.png` | Se generan del logo con `sharp`, sobre placa clara: un logo transparente desaparece en pestañas oscuras |
| Logo para la imagen de compartir | `public/logo.png` | Copia local; la tarjeta OG se genera en build y no puede depender de red |
| Fotos de plato y logo | Vercel Blob | El host ya está permitido en `next.config.ts` con comodín |
| IP de desarrollo | `next.config.ts` → `allowedDevOrigins` | Solo afecta a `next dev`, no a producción |

### Reglas que hay que respetar al personalizar

- **Contraste.** La paleta no es decorativa: `--accent` va escrito sobre `--primary` y al revés. Los pares que la interfaz superpone están documentados en `app/globals.css` y todos deben quedar en ≥4.5:1, en claro **y** en oscuro. La cabecera puede ser clara u oscura indistintamente, porque los pills del nav se definen contra `--primary`/`--accent` y no contra la tarjeta.
- **El logo sobre la cabecera.** Hoy se aplica `invert` en `app/page.tsx` porque el logo es negro y `--primary` es oscuro en ambos modos. Con un logo o una paleta distintos hay que revisarlo.
- **Alérgenos.** Los 14 del Reglamento UE 1169/2011 están en `lib/allergens.ts` con icono y color ya validados en contraste. El JSON solo referencia códigos; **no** inventar alérgenos nuevos.
- **Los datos de alérgenos los confirma el restaurante.** No se deducen del nombre del plato. Es información regulada y la responsabilidad es del establecimiento.

## Arquitectura, en una línea cada cosa

- **Next.js App Router**, todo prerenderizado estático. No hay base de datos ni API.
- **`data/menu.json`** se parsea en build con `lib/menuData.ts`, que valida tipos y da errores con la ruta del fallo, porque cada carta se escribe a mano.
- **Componentes cliente solo donde hace falta**: el modal de plato y el nav con scrollspy. La carta en sí es server-rendered.
- **`--anchor-offset`** lo mide `CategoryNav` en tiempo de ejecución (la cabecera cambia de alto según el logo del cliente) y lo usan tanto el `scroll-margin-top` de las secciones como la línea del scrollspy. Un único valor para las dos cosas.
- **Despliegue en Vercel siempre.** `metadataBase` se resuelve con `VERCEL_PROJECT_PRODUCTION_URL`, que Vercel rellena sola y apunta a producción incluso en previews. Requiere tener activada la casilla *Enable access to System Environment Variables* en el proyecto.

## Estado de la infraestructura (2026-08-13)

- Las **herramientas MCP de Vercel no están disponibles en Claude Code**, aunque la cuenta esté conectada en claude.ai: son entornos distintos. Para operar Vercel desde el terminal hay que conectar el MCP aquí, o usar la CLI de Vercel autenticada.
- **`gh` CLI no está instalado.** El push a repos ya existentes funciona con las credenciales cacheadas; crear repos nuevos requiere instalarlo o hacerlo desde la web.
