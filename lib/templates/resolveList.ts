// Single contract every template uses to read business data instead of
// mutating hardcoded const arrays by index. Returns the real array when the
// client provided one (non-empty), otherwise the template's own demo data —
// so untouched templates keep rendering exactly as before.
export function resolveList<T>(real: T[] | undefined, demo: T[]): T[] {
  return real && real.length > 0 ? real : demo;
}
