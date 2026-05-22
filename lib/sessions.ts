import { put, list } from "@vercel/blob";

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
}

export interface SessionData {
  id: string;
  formData: FormData;
  generatedContent?: GeneratedContent;
  createdAt: Date;
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
export async function saveSessionToBlob(id: string, data: SessionData): Promise<void> {
  try {
    await put(`sessions/${id}.json`, JSON.stringify(data), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    });
    sessions.set(id, data); // warm the in-memory cache
  } catch (err) {
    console.error("[sessions] Blob save failed:", err);
  }
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
