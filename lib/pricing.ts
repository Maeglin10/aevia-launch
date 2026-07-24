// Single source of truth for Aevia Launch pricing.
//
// Mirrors the Aevia DB (scripts/aevia-db/seed.sql) so the site, the n8n agents,
// and the backend all quote the same numbers. When you change a price, change
// it here AND in the DB seed.
//
// Model: the client picks a template (site type) built on one of our themes →
// delivered in 2h. Optional add-ons (branding, maintenance). Multi-currency
// with pretty per-market prices (not raw FX).

export type Currency = "EUR" | "CHF" | "USD" | "GBP";

export const CURRENCIES: Record<Currency, { symbol: string; label: string }> = {
  EUR: { symbol: "€", label: "EUR" },
  CHF: { symbol: "CHF", label: "CHF" },
  USD: { symbol: "$", label: "USD" },
  GBP: { symbol: "£", label: "GBP" },
};

export const DEFAULT_CURRENCY: Currency = "EUR";

// Pretty per-currency price table, keyed by the canonical EUR amount.
// Matches products.prices in the Aevia DB exactly.
const PRICE_TABLE: Record<number, Record<Currency, number>> = {
  0:    { EUR: 0,    CHF: 0,    USD: 0,    GBP: 0 },
  20:   { EUR: 20,   CHF: 20,   USD: 22,   GBP: 17 },   // maintenance / mo
  149:  { EUR: 149,  CHF: 149,  USD: 169,  GBP: 129 },  // branding add-on
  399:  { EUR: 399,  CHF: 395,  USD: 439,  GBP: 349 },  // Landing tier
  599:  { EUR: 599,  CHF: 590,  USD: 659,  GBP: 519 },  // Essentiel tier
  899:  { EUR: 899,  CHF: 890,  USD: 989,  GBP: 779 },  // Pro tier
  1499: { EUR: 1499, CHF: 1490, USD: 1649, GBP: 1299 }, // Premium tier
};

/** Resolve a canonical EUR amount to the given currency (pretty price). */
export function priceIn(eurAmount: number, currency: Currency): number {
  const row = PRICE_TABLE[eurAmount];
  if (row) return row[currency];
  // Fallback for amounts not in the table: approximate FX + round to 10.
  const rate: Record<Currency, number> = { EUR: 1, CHF: 0.99, USD: 1.1, GBP: 0.87 };
  return Math.round((eurAmount * rate[currency]) / 10) * 10;
}

export function formatPrice(eurAmount: number, currency: Currency): string {
  const v = priceIn(eurAmount, currency);
  const { symbol } = CURRENCIES[currency];
  const num = v.toLocaleString(currency === "USD" || currency === "GBP" ? "en-US" : "fr-FR");
  // € and CHF go after; $ and £ go before.
  return currency === "USD" || currency === "GBP" ? `${symbol}${num}` : `${num}${symbol === "CHF" ? " CHF" : symbol}`;
}

export function isCurrency(v: string | undefined | null): v is Currency {
  return v === "EUR" || v === "CHF" || v === "USD" || v === "GBP";
}

// ─── Site types (templates) → base EUR price ────────────────────────────────
// Each template maps to a tier-equivalent EUR amount. "landing" = single
// conversion page = Landing tier (399). Full one-page = Essentiel (599).
// Multi-section = Pro (899). Complex (e-commerce, luxury, 3D) = Premium (1499).
export const SITE_PRICES: Record<string, { label: string; price: number }> = {
  landing:       { label: "Landing Page",          price: 399  },
  consultant:    { label: "Consultant / Coach",    price: 599  },
  portfolio:     { label: "Portfolio",             price: 599  },
  event:         { label: "Événement",             price: 599  },
  nonprofit:     { label: "Non-profit / ONG",      price: 599  },
  startup:       { label: "Startup Launch",        price: 599  },
  saas:          { label: "SaaS Product",          price: 899  },
  agency:        { label: "Creative Agency",       price: 899  },
  vitrine:       { label: "Site Vitrine",          price: 899  },
  restaurant:    { label: "Restaurant / Food",     price: 899  },
  hotel:         { label: "Hôtel / B&B",           price: 899  },
  healthcare:    { label: "Santé / Clinique",      price: 899  },
  realestate:    { label: "Immobilier",            price: 899  },
  fitness:       { label: "Fitness / Wellness",    price: 899  },
  brutalist:     { label: "Brutalist Editorial",   price: 899  },
  magazine:      { label: "Magazine / Éditorial",  price: 899  },
  aurora:        { label: "Aurora / Wellness",     price: 899  },
  ecommerce:     { label: "E-Commerce",            price: 1499 },
  luxury:        { label: "Luxury / Couture",      price: 1499 },
  "3d-tech":     { label: "3D Tech / Web3",        price: 1499 },
  "minimal-pro": { label: "Minimal Pro",           price: 899  },
};

// ─── Add-ons ────────────────────────────────────────────────────────────────
export const ADDONS = {
  // Logo + colour charter + photo retouch — turns a generic theme into a real
  // identity without going full custom (Premium).
  branding:    { id: "branding",    label: "Service Branding",      sublabel: "Logo + charte couleurs + retouche photos", price: 149, recurring: false },
  // Updates, hosting & priority support, billed monthly after delivery.
  maintenance: { id: "maintenance", label: "Maintenance mensuelle", sublabel: "Mises à jour, hébergement & support",      price: 20,  recurring: true  },
} as const;

// ─── Pricing tiers (for a /pricing or homepage section) ─────────────────────
export const LAUNCH_TIERS = [
  { tier: "landing",   name: "Landing",   price: 399,  delivery: "2 h",     blurb: "1 page de conversion sur thème" },
  { tier: "essentiel", name: "Essentiel", price: 599,  delivery: "2 h",     blurb: "Site one-page complet sur thème" },
  { tier: "pro",       name: "Pro",       price: 899,  delivery: "24-48 h", blurb: "3-5 pages semi-custom sur thème" },
  { tier: "premium",   name: "Premium",   price: 1499, delivery: "5-7 j",   blurb: "100% sur-mesure, hors thème" },
] as const;
