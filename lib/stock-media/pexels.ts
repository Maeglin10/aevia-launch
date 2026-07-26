// Pexels stock media — free commercial-use images + videos, unrestricted
// redistribution inside sold products (verified 2026-07-25). Unlike Pixabay,
// Pexels' CDN URLs (images.pexels.com / videos.pexels.com) may be hotlinked
// directly — same pattern as our existing Unsplash usage, no download/
// re-host step needed. Their API guidelines do ask for a visible "powered by
// Pexels" link somewhere on the site when using the API (site-wide, not
// per-photo) — see TODO in the footer component.
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const IMAGE_SEARCH_URL = "https://api.pexels.com/v1/search";
const VIDEO_SEARCH_URL = "https://api.pexels.com/videos/search";

export interface PexelsImageResult {
  id: number;
  alt: string;
  photographer: string;
  url: string; // Pexels page URL (for optional credit link)
  src: {
    large: string; // ~940px wide, good for hero backgrounds
    large2x: string; // ~1880px wide, retina
    medium: string;
    original: string;
  };
  width: number;
  height: number;
}

export interface PexelsVideoResult {
  id: number;
  url: string;
  duration: number;
  width: number;
  height: number;
  videoUrl: string; // best HD file under ~1920px
  thumbnail: string;
}

function assertConfigured(): void {
  if (!PEXELS_API_KEY) {
    throw new Error("PEXELS_API_KEY is not set — add it to .env.local");
  }
}

export async function searchPexelsImages(
  query: string,
  opts: { orientation?: "landscape" | "portrait" | "square"; perPage?: number } = {},
): Promise<PexelsImageResult[]> {
  assertConfigured();
  const params = new URLSearchParams({
    query,
    orientation: opts.orientation ?? "landscape",
    per_page: String(opts.perPage ?? 12),
  });
  const res = await fetch(`${IMAGE_SEARCH_URL}?${params}`, {
    headers: { Authorization: PEXELS_API_KEY! },
  });
  if (!res.ok) throw new Error(`Pexels image search failed: ${res.status}`);
  const data = (await res.json()) as { photos: PexelsImageResult[] };
  return data.photos;
}

/** Search Pexels videos — the main new capability Unsplash never had (hero video backgrounds). */
export async function searchPexelsVideos(
  query: string,
  opts: { orientation?: "landscape" | "portrait" | "square"; perPage?: number } = {},
): Promise<PexelsVideoResult[]> {
  assertConfigured();
  const params = new URLSearchParams({
    query,
    orientation: opts.orientation ?? "landscape",
    per_page: String(opts.perPage ?? 12),
  });
  const res = await fetch(`${VIDEO_SEARCH_URL}?${params}`, {
    headers: { Authorization: PEXELS_API_KEY! },
  });
  if (!res.ok) throw new Error(`Pexels video search failed: ${res.status}`);
  const data = (await res.json()) as {
    videos: {
      id: number;
      url: string;
      duration: number;
      width: number;
      height: number;
      image: string;
      video_files: { link: string; width: number; height: number; quality: string }[];
    }[];
  };
  return data.videos.map((v) => {
    // Prefer an HD file close to 1920px wide; fall back to the largest available.
    const files = [...v.video_files].sort((a, b) => b.width - a.width);
    const hd = files.find((f) => f.width <= 1920) ?? files[files.length - 1];
    return {
      id: v.id,
      url: v.url,
      duration: v.duration,
      width: v.width,
      height: v.height,
      videoUrl: hd.link,
      thumbnail: v.image,
    };
  });
}
