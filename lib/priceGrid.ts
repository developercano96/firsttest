const DUAL_COLS = "grid-cols-[1fr_60px_60px]";
const SINGLE_COLS = "grid-cols-[1fr_80px]";

export function priceGridCols(isDual: boolean): string {
  return isDual ? DUAL_COLS : SINGLE_COLS;
}
