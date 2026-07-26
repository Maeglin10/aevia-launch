// Pixabay stock media — free commercial-use images + videos, Content License.
// IMPORTANT: Pixabay's ToS forbids PERMANENT hotlinking of pixabay.com/cdn.pixabay.com
// URLs in an app. Images must be downloaded once and re-served from our own
// storage (Vercel Blob) — unlike Unsplash, which we DO hotlink directly.
// Videos may technically be embedded directly, but Pixabay recommends storing
// them too, so we apply the same cache-through-Blob path to both.
import { put, head } from "@vercel/blob";

const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
const IMAGE_SEARCH_URL = "https://pixabay.com/api/";
const VIDEO_SEARCH_URL = "https://pixabay.com/api/videos/";

export interface PixabayImageResult {
  id: number;
  tags: string;
  pageURL: string;
  webformatURL: string; // 640px, source URL — valid 24h, must be cached before serving
  largeImageURL: string; // up to 1280px
  imageWidth: number;
  imageHeight: number;
}

export interface PixabayVideoResult {
  id: number;
  tags: string;
  pageURL: string;
  duration: number;
  videoUrl: string; // "medium" rendition (1920x1080 or 1280x720)
  width: number;
  height: number;
  thumbnail: string;
}

function assertConfigured(): void {
  if (!PIXABAY_API_KEY) {
    throw new Error("PIXABAY_API_KEY is not set — add it to .env.local");
  }
}

/**
 * Search Pixabay images. `query` should describe the subject in plain
 * English (Pixabay's search is English-first regardless of the `lang` param).
 */
export async function searchPixabayImages(
  query: string,
  opts: { orientation?: "all" | "horizontal" | "vertical"; perPage?: number; category?: string } = {},
): Promise<PixabayImageResult[]> {
  assertConfigured();
  const params = new URLSearchParams({
    key: PIXABAY_API_KEY!,
    q: query,
    image_type: "photo",
    orientation: opts.orientation ?? "horizontal",
    safesearch: "true",
    order: "popular",
    per_page: String(opts.perPage ?? 12),
  });
  if (opts.category) params.set("category", opts.category);

  const res = await fetch(`${IMAGE_SEARCH_URL}?${params}`);
  if (!res.ok) throw new Error(`Pixabay image search failed: ${res.status}`);
  const data = (await res.json()) as { hits: PixabayImageResult[] };
  return data.hits;
}

/** Search Pixabay videos (nature/city/business b-roll etc.) for hero backgrounds. */
export async function searchPixabayVideos(
  query: string,
  opts: { perPage?: number; category?: string } = {},
): Promise<PixabayVideoResult[]> {
  assertConfigured();
  const params = new URLSearchParams({
    key: PIXABAY_API_KEY!,
    q: query,
    safesearch: "true",
    order: "popular",
    per_page: String(opts.perPage ?? 12),
  });
  if (opts.category) params.set("category", opts.category);

  const res = await fetch(`${VIDEO_SEARCH_URL}?${params}`);
  if (!res.ok) throw new Error(`Pixabay video search failed: ${res.status}`);
  const data = (await res.json()) as {
    hits: {
      id: number;
      tags: string;
      pageURL: string;
      duration: number;
      videos: { medium: { url: string; width: number; height: number; thumbnail: string } };
    }[];
  };
  return data.hits.map((h) => ({
    id: h.id,
    tags: h.tags,
    pageURL: h.pageURL,
    duration: h.duration,
    videoUrl: h.videos.medium.url,
    width: h.videos.medium.width,
    height: h.videos.medium.height,
    thumbnail: h.videos.medium.thumbnail,
  }));
}

/**
 * Downloads a Pixabay asset once and re-serves it from Vercel Blob under a
 * stable, deterministic path keyed by Pixabay's own id — satisfies the
 * no-permanent-hotlink requirement AND Pixabay's "cache for 24h+" request in
 * one step, since re-calling this with the same id/kind is a cheap Blob
 * existence check (`head`) instead of a re-download.
 */
export async function cachePixabayAsset(
  sourceUrl: string,
  id: number,
  kind: "image" | "video",
): Promise<string> {
  const ext = kind === "video" ? "mp4" : (sourceUrl.match(/\.(\w+)(?:\?|$)/)?.[1] ?? "jpg");
  const path = `stock/pixabay/${kind}-${id}.${ext}`;

  try {
    const existing = await head(path);
    return existing.url;
  } catch {
    // Not cached yet — fall through to download + upload.
  }

  const res = await fetch(sourceUrl);
  if (!res.ok) throw new Error(`Failed to download Pixabay ${kind} ${id}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());

  const blob = await put(path, buffer, {
    access: "public",
    contentType: kind === "video" ? "video/mp4" : `image/${ext === "jpg" ? "jpeg" : ext}`,
  });
  return blob.url;
}
