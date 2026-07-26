"use client";

import { useEffect } from "react";
import { buildLocalBusinessSchema, buildFaqSchemaForSession } from "@/lib/seo";
import type { SessionData } from "@/lib/sessions";

// Injects the client site's structured data (LocalBusiness + FAQPage JSON-LD)
// for impact-* templates. These render as standalone client pages and the
// /site and /preview server routes redirect straight to them, so their
// server-side JSON-LD never reaches the impact templates — this component is
// the one place that gives every template rich GEO structured data.
//
// Google renders JS and reads dynamically inserted JSON-LD. The schema is
// pre-loaded per sector (lib/geo/sectorGeo) so it is answer-rich the moment a
// niche is chosen, then topped up with the client's real data. Rendered once in
// the /templates layout — covers all templates, incl. the preview iframe.
function inject(id: string, json: string) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = json;
}

export function SiteSchema() {
  useEffect(() => {
    const sid = new URLSearchParams(window.location.search).get("session");
    if (!sid) return;
    fetch(`/api/sessions?id=${sid}`)
      .then((r) => r.json())
      .then((session: SessionData | null) => {
        if (!session?.generatedContent) return;
        try {
          inject(
            "ld-localbusiness",
            JSON.stringify(buildLocalBusinessSchema(session)),
          );
          const faq = buildFaqSchemaForSession(session);
          if (faq) inject("ld-faqpage", JSON.stringify(faq));
        } catch {
          /* schema is best-effort — never break the page */
        }
      })
      .catch(() => {});
  }, []);
  return null;
}
