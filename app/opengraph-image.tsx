import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { BRAND } from "../lib/brand";

export const alt = `Carta digital de ${BRAND.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// El logo es negro sobre transparente, así que la tarjeta va sobre hueso y no
// sobre pizarra: satori no soporta `filter`, de modo que aquí no se puede
// invertir el logo como sí se hace en la cabecera.
export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public", "logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f4f2",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="" width={420} height={420} />

        <div
          style={{
            display: "flex",
            marginTop: 8,
            padding: "14px 40px",
            borderRadius: 999,
            background: "#2f3331",
            color: "#f4f3ee",
            fontSize: 34,
          }}
        >
          {BRAND.tagline}
        </div>
      </div>
    ),
    size,
  );
}
