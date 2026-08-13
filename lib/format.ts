// Convención española: coma decimal y espacio antes del símbolo (19,50 €).
// Intl lo resuelve solo y evita hardcodear el separador, que con toFixed
// salía en formato inglés (19.50€) dentro de una carta en <html lang="es">.
// Se crea una vez: instanciar NumberFormat por llamada es caro y aquí se
// invoca dos veces por plato.
const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

export function formatPrice(value: number | null | undefined): string {
  if (value == null) return "";
  return priceFormatter.format(value);
}
