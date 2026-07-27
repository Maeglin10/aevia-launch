// Per-theme showcase stats for the gallery cards.
//
// Values are derived from the theme id with a stable hash rather than
// Math.random(): the cards render on the server and hydrate on the client, and
// a fresh random on each render would both mismatch during hydration and make
// a theme's numbers jump every reload.

const RATING_MIN = 4.2;
const RATING_MAX = 5.0;
const ACTIVE_MIN = 7;
const ACTIVE_MAX = 523;

// Real installs, added on top of the baseline. Bump a theme by 1 here each
// time a client goes live on it.
export const THEME_INSTALLS: Record<string, number> = {};

function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

export function themeRating(id: string): string {
  const r = RATING_MIN + hash(id + ':rating') * (RATING_MAX - RATING_MIN);
  return r.toFixed(1);
}

export function themeActive(id: string): number {
  const base = ACTIVE_MIN + Math.floor(hash(id + ':active') * (ACTIVE_MAX - ACTIVE_MIN + 1));
  return base + (THEME_INSTALLS[id] ?? 0);
}
