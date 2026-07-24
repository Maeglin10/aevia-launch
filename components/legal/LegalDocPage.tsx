"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type DocKey = "mentionsLegales" | "cgv" | "confidentialite" | "cgu";

const TITLES: Record<DocKey, string> = {
  mentionsLegales: "Mentions légales",
  cgv: "Conditions Générales de Vente",
  confidentialite: "Politique de Confidentialité",
  cgu: "Conditions Générales d'Utilisation",
};

const NAV: { key: DocKey; slug: string; label: string }[] = [
  { key: "mentionsLegales", slug: "mentions-legales", label: "Mentions légales" },
  { key: "cgv", slug: "cgv", label: "CGV" },
  { key: "confidentialite", slug: "confidentialite", label: "Confidentialité" },
  { key: "cgu", slug: "cgu", label: "CGU" },
];

// Shared renderer for a generated site's 4 legal documents. One instance per
// template (app/templates/impact-N/legal/[page]/page.tsx), parameterized by
// `doc` and `basePath` — keeps the fetch/render logic in one place instead
// of duplicating it across every pilot template.
export function LegalDocPage({ doc, basePath }: { doc: DocKey; basePath: string }) {
  const [html, setHtml] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  // Read once on mount (not during render) — reading window.location.search
  // directly in the render body differs between SSR (no window) and the
  // client, which is a hydration mismatch.
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch(window.location.search);
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) {
      setLoaded(true);
      return;
    }
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then((session) => setHtml(session?.legalPages?.[doc] ?? null))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [doc]);

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#e5e5e5", fontFamily: "system-ui, sans-serif" }}>
      <nav style={{ borderBottom: "1px solid #262626", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#0a0a0a", zIndex: 10 }}>
        <Link href={basePath} style={{ color: "#e5e5e5", textDecoration: "none", fontSize: 15 }}>← Retour au site</Link>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {NAV.map((n) => (
            <Link
              key={n.slug}
              href={`${basePath}/legal/${n.slug}${search}`}
              style={{ fontSize: 12, textDecoration: "none", color: n.key === doc ? "#f87171" : "#a3a3a3", letterSpacing: "0.03em" }}
            >
              {n.label}
            </Link>
          ))}
        </div>
      </nav>

      <main style={{ maxWidth: 820, margin: "0 auto", padding: "64px 24px" }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 600, marginBottom: 40 }}>{TITLES[doc]}</h1>

        {!loaded && <p style={{ color: "#737373" }}>Chargement…</p>}

        {loaded && !html && (
          <p style={{ color: "#737373" }}>
            Ce document n&apos;a pas encore été généré pour ce site.
          </p>
        )}

        {html && (
          <div
            style={{ fontSize: 15, lineHeight: 1.8, color: "#d4d4d4" }}
            // Content is our own generated HTML (lib/legal/generateLegalPages.ts),
            // not user-submitted — safe to render directly.
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </main>

      <style>{`main h2 { font-size: 22px; font-weight: 600; margin: 32px 0 12px; color: #f5f5f5; } main p { margin: 0 0 12px; } main a { color: #f87171; } main ul { padding-left: 20px; }`}</style>
    </div>
  );
}
