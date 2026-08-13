import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BRAND } from "../lib/brand";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Las plataformas que generan la vista previa al compartir no aceptan rutas
// relativas, así que opengraph-image/twitter-image necesitan una URL absoluta.
//
// El despliegue es siempre en Vercel, que rellena VERCEL_PROJECT_PRODUCTION_URL
// con el dominio de producción incluso en los deploys de preview: así el
// preview de WhatsApp apunta a producción y no a una URL efímera que caduca.
// Requisito: tener marcada "Enable access to System Environment Variables" en
// los ajustes del proyecto, o la variable no llega al build.
//
// NEXT_PUBLIC_SITE_URL solo hace falta como override si el proyecto tiene
// varios dominios y Vercel no elige el que toca (se queda con el más corto).
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${BRAND.name} | Carta digital`,
  description: BRAND.description,
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: BRAND.name,
    title: `${BRAND.name} | Carta digital`,
    description: BRAND.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} | Carta digital`,
    description: BRAND.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
