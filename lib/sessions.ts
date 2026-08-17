import { put, list } from "@vercel/blob";
import type { LegalPages } from "@/lib/legal/generateLegalPages";

export interface FormData {
  /*
    La langue dans laquelle le client a rempli le wizard.
    Sans elle, un thème dont la démonstration est en anglais — 73 sur 373 — reste
    en anglais sur le site d'une entreprise française, y compris pour les
    libellés de navigation que le client ne peut pas modifier lui-même.
  */
  locale?: string;
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
  /*
    Les étapes de la méthode : « comment ça se passe », de la prise de contact à
    la fin du chantier. Cent quarante-neuf thèmes affichent cette section et
    aucun ne pouvait la remplir — le formulaire ne la demandait pas, et rien ne
    la lisait.
  */
  methode?: { name: string; desc?: string }[];
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
  // Number of times /api/generate has run for this session. Distributed
  // rate-limit backstop for the LLM path: the in-memory IP limiter is
  // per-serverless-instance (useless across Vercel's fleet), but this counter
  // rides on the shared Blob session store, so it holds everywhere.
  genCount?: number;
  // Aevia account this site belongs to, once linked (see app/api/webhook —
  // set from the Stripe checkout email at purchase time). Lets the site
  // itself look up whether its owner already has an active Inbox webchat
  // widget and auto-embed it, no manual snippet copy-paste needed.
  accountId?: string;
  /*
    Les retouches du client, section par section.

    La clé est stable et lisible : « contact.titre », « methode.sous-titre ». Le
    thème lit `clientText(session, "contact.titre") ?? "…"` — sans retouche, il
    affiche son propre texte, exactement comme avant.

    C'est le seul mécanisme qui rend éditable chaque section des 373 thèmes sans
    poser vingt questions de plus dans le wizard : le wizard recueille la donnée
    structurée — prestations, tarifs, horaires — et ceci couvre la prose.
  */
  sectionOverrides?: Record<string, string>;
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

/*
  L'adresse publique du dépôt, déduite du jeton.

  Le jeton s'écrit `vercel_blob_rw_<dépôt>_<secret>` et le dépôt donne l'hôte
  public. On n'en lit que la partie publique ; le secret ne sort jamais d'ici.
*/
function hoteDuDepot(): string | null {
  const jeton = process.env.BLOB_READ_WRITE_TOKEN ?? "";
  const depot = jeton.split("_")[3];
  return depot ? `https://${depot}.public.blob.vercel-storage.com` : null;
}

/*
  Lire une session écrite à l'instant.

  `list()` est cohérent à terme : entre l'écriture d'une session et son
  apparition dans l'index, il s'écoule parfois quelques secondes. Le client
  reçoit son lien d'aperçu par courriel dans la seconde qui suit la commande —
  il ouvrait donc, une fois sur plusieurs, une page qui répondait « session
  introuvable » alors que la session existait.

  Trois chemins, du plus sûr au moins sûr :

    1. le cache mémoire, valable dans cette instance seulement ;
    2. l'adresse déterministe — `addRandomSuffix: false` la rend prévisible,
       et un objet est lisible dès son écriture, avant d'être indexé ;
    3. l'index, pour les sessions écrites avant que le nom soit fixé.

  Deux nouvelles tentatives espacées couvrent le cas où l'écriture elle-même
  n'est pas encore terminée côté dépôt.
*/
export async function getSessionFromBlob(id: string): Promise<SessionData | null> {
  const cached = sessions.get(id);
  if (cached) return cached;

  const hote = hoteDuDepot();
  for (const attente of [0, 400, 1200]) {
    if (attente) await new Promise((r) => setTimeout(r, attente));

    if (hote) {
      try {
        /* Sans `no-store`, le CDN peut resservir un 404 mis en cache. */
        const res = await fetch(`${hote}/sessions/${id}.json`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json() as SessionData;
          sessions.set(id, data);
          return data;
        }
      } catch {
        /* On tente l'index. */
      }
    }

    try {
      const { blobs } = await list({ prefix: `sessions/${id}.json` });
      if (blobs.length > 0) {
        const res = await fetch(blobs[0].url, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json() as SessionData;
          sessions.set(id, data);
          return data;
        }
      }
    } catch {
      /* On réessaie. */
    }
  }
  return null;
}
