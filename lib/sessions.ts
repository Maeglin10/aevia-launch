import { put, list } from "@vercel/blob";
import type { LegalPages } from "@/lib/legal/generateLegalPages";

export interface FormData {
  // Step 1
  businessName: string;
  businessType: string;
  tagline: string;
  city: string;
  // Step 2
  mainService: string;
  benefits: [string, string, string];
  priceRange: string;
  targetAudience: string;
  // Step 3
  brandColor: string;
  tone: string;
  template: string;
  // Step 4
  logoBase64?: string;
  heroImageBase64?: string;
  heroImageUrl?: string;
  logoUrl?: string;
  photoUrls?: string[];
  // Step 5
  email: string;
  phone?: string;
  instagram?: string;
  linkedin?: string;
  // Analytics & SEO verification (optional)
  ga4Id?: string;
  gscVerification?: string;
}

// ─── Business Profile — real, structured client data (not AI-invented) ─────
// Filled progressively by the niche-aware wizard steps (Phase 1-2). Optional
// on the type because legacy sessions and non-pilot niches won't have it —
// every consumer must fall back to demo/generic content when a field is
// absent (see lib/templates/resolveList.ts).
export interface BusinessCore {
  niche?: string;                    // sectors.ts niche id, drives archetype
  foundedYear?: number;
  contacts?: {
    general?: { email?: string; phone?: string };
    booking?: { email?: string; phone?: string };
  };
  openingHours?: { day: string; open?: string; close?: string; closed?: boolean }[];
  paymentMethods?: string[];
  bookingSystem?: { provider?: string; url?: string };
  emergency?: { enabled: boolean; phone?: string; note?: string };
  geo?: {
    address?: string;
    primaryCity?: string;
    serviceAreas?: string[];
    radiusKm?: number;
  };
  reputation?: {
    sources?: { platform: string; url: string; rating?: number; reviewCount?: number }[];
    featuredReviews?: { author: string; text: string; rating: number; source?: string }[];
  };
  keyStats?: { value: string; label: string }[];
  certifications?: string[];
  faq?: { q: string; a: string }[];
  hasQuoteRequest?: boolean;
  chatWidget?: { interested: boolean };
}

export interface Catalogues {
  services?: { name: string; price?: string; duration?: string; description?: string }[];
  products?: { name: string; price?: string; description?: string; photoUrl?: string }[];
  menu?: { category: string; name: string; price?: string; description?: string }[];
  listings?: { title: string; price?: string; surface?: string; rooms?: string; status?: string; photoUrl?: string; city?: string }[];
  team?: { name: string; role: string; photoUrl?: string; bio?: string; specialty?: string; credentials?: string }[];
  beforeAfter?: { beforeUrl: string; afterUrl: string; caption?: string }[];
  commerce?: { mode: "showcase" | "external" | "stripe"; storeUrl?: string };
}

export interface LegalProfile {
  legalForm?: string;
  siret?: string;
  companyAddress?: string;
  capitalSocial?: string;
}

export interface BusinessProfile extends BusinessCore, Catalogues {
  legal?: LegalProfile;
}

export interface GeneratedContent {
  heroHeadline: string;
  heroSubline: string;
  aboutTitle: string;
  aboutText: string;
  services: { title: string; description: string }[];
  testimonials: { name: string; role: string; text: string; rating: number }[];
  ctaText: string;
  metaTitle: string;
  metaDescription: string;
  // Only present for restaurant/fast-food sectors when the client pasted a
  // real menu (sectorData.menuItems) — extracted verbatim, never invented.
  menuItems?: { name: string; price: string; description?: string; category?: string }[];
}

export interface SessionData {
  id: string;
  formData: FormData;
  businessProfile?: BusinessProfile;   // ← new
  generatedContent?: GeneratedContent;
  legalPages?: LegalPages;
  createdAt: Date;
  // Aevia account this site belongs to, once linked (see app/api/webhook —
  // set from the Stripe checkout email at purchase time). Lets the site
  // itself look up whether its owner already has an active Inbox webchat
  // widget and auto-embed it, no manual snippet copy-paste needed.
  accountId?: string;
}

// In-memory cache (warm path)
const sessions = new Map<string, SessionData>();

export function saveSession(id: string, data: SessionData) {
  sessions.set(id, data);
}

export function getSession(id: string): SessionData | undefined {
  return sessions.get(id);
}

export function updateSession(id: string, updates: Partial<SessionData>) {
  const existing = sessions.get(id);
  if (existing) {
    sessions.set(id, { ...existing, ...updates });
  }
}

// Blob persistence (survives restarts)
// Throws on failure — callers MUST handle the error and avoid sending the
// client a preview link that points to a missing session.
export async function saveSessionToBlob(id: string, data: SessionData): Promise<void> {
  await put(`sessions/${id}.json`, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
    // /api/generate writes to the same session blob created by /api/sessions
    // earlier in the wizard, so we must allow overwriting that fixed path.
    allowOverwrite: true,
  });
  sessions.set(id, data); // warm the in-memory cache
}

export async function getSessionFromBlob(id: string): Promise<SessionData | null> {
  const cached = sessions.get(id);
  if (cached) return cached;

  try {
    const { blobs } = await list({ prefix: `sessions/${id}.json` });
    if (blobs.length === 0) return null;
    const res = await fetch(blobs[0].url);
    if (!res.ok) return null;
    const data = await res.json() as SessionData;
    sessions.set(id, data); // populate cache
    return data;
  } catch {
    return null;
  }
}
