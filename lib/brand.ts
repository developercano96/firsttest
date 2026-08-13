// Identidad del cliente. Al dar de alta un restaurante nuevo en el SaaS este
// es el único fichero de marca que hay que tocar, junto con --primary/--accent
// en globals.css y su data/menu.json.
export const BRAND = {
  name: "Taste & Flavor",
  tagline: "Nuestra selección del día",
  description:
    "Consulta la carta de Taste & Flavor desde tu móvil: platos, precios y alérgenos.",
  // Logo en Vercel Blob (la copia local de public/logo.png se usa solo para
  // componer la imagen de compartir, que se genera en build sin red).
  logoUrl: "https://3dkcwgh1f6van6kw.public.blob.vercel-storage.com/logo-test.png",
} as const;
