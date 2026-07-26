"use client";

import { useEffect } from "react";

// Client-photo injection for EVERY template. ~20% of templates (64/315) never
// read the client's uploaded photos and kept their demo stock images. Rather
// than wire each one by hand, this layout component swaps the demo stock images
// for the client's photos across the whole page — and only touches images from
// the known demo stock hosts, so real content images and textures are left
// alone. Templates that already wire photoUrls set a non-stock src, so they are
// skipped here (no double-swap).
//
// Covers <img src>, and inline background-image on any element. Retries a few
// times to catch images that mount after hydration.
const STOCK_HOST = /(images\.unsplash\.com|images\.pexels\.com|[a-z]*\.?picsum\.photos|source\.unsplash\.com)/i;

function swapAll(photos: string[]): number {
  if (!photos.length) return 0;
  let i = 0;
  const next = () => photos[i++ % photos.length];

  // 1. <img> tags pointing at a stock host
  document.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
    const src = img.currentSrc || img.src || "";
    if (STOCK_HOST.test(src) && !img.dataset.aeviaSwapped) {
      img.dataset.aeviaSwapped = "1";
      img.removeAttribute("srcset");
      img.src = next();
    }
  });

  // 2. inline background-image: url(stock)
  document.querySelectorAll<HTMLElement>('[style*="url("]').forEach((el) => {
    const bg = el.style.backgroundImage || "";
    if (STOCK_HOST.test(bg) && !el.dataset.aeviaSwapped) {
      el.dataset.aeviaSwapped = "1";
      el.style.backgroundImage = `url("${next()}")`;
    }
  });
  return i;
}

export function SiteImages() {
  useEffect(() => {
    const sid = new URLSearchParams(window.location.search).get("session");
    if (!sid) return;
    fetch(`/api/sessions?id=${sid}`)
      .then((r) => r.json())
      .then((s) => {
        const fd = s?.formData ?? {};
        const photos: string[] = [
          ...(fd.heroImageUrl ? [fd.heroImageUrl] : []),
          ...(Array.isArray(fd.photoUrls) ? fd.photoUrls : []),
        ].filter((u: unknown): u is string => typeof u === "string" && /^https?:\/\//.test(u));
        if (!photos.length) return;
        // Initial pass + a few retries for late-mounting images.
        swapAll(photos);
        const timers = [400, 1200, 2500].map((ms) =>
          setTimeout(() => swapAll(photos), ms),
        );
        return () => timers.forEach(clearTimeout);
      })
      .catch(() => {});
  }, []);
  return null;
}
