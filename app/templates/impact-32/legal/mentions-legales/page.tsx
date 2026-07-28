"use client";

// Footer links across this template point at /legal/mentions-legales as its own route.
// It renders the shared, client-aware legal component filtered to this one
// document, so the page shows the CLIENT's generated text rather than a
// hardcoded copy.
import TemplateLegal from "@/app/templates/_shared/TemplateLegal";

export default function Page() {
  return <TemplateLegal only="mentionsLegales" />;
}
