"use client";

import { useEffect, useState } from "react";

// Shared, dynamic legal page for delivered client sites. Renders the four
// documents generated per client + sector (session.legalPages: mentions
// légales, CGV [sector-aware], confidentialité, CGU), so the page shows the
// CLIENT's identity and their sector's terms — not a hardcoded one.
//
// Replaces the per-template static legal pages, 68 of which wrongly printed
// Aevia's own SIREN as the site editor and never showed the sector CGV. Neutral,
// readable styling (works on any theme); the legal text itself is what matters.

type LegalPages = {
  mentionsLegales?: string;
  cgv?: string;
  confidentialite?: string;
  cgu?: string;
};

const DOCS: { key: keyof LegalPages; title: string }[] = [
  { key: "mentionsLegales", title: "Mentions légales" },
  { key: "cgv", title: "Conditions Générales de Vente" },
  { key: "confidentialite", title: "Politique de confidentialité" },
  { key: "cgu", title: "Conditions Générales d’Utilisation" },
];

/* `only` renders a single document. Footers across the catalogue link to
   /legal/cgu, /legal/confidentialite and /legal/mentions-legales as separate
   routes; those routes re-export this component with `only` set rather than
   duplicating the legal copy three more times per template. */
export default function TemplateLegal({ only }: { only?: keyof LegalPages } = {}) {
  const [legal, setLegal] = useState<LegalPages | null>(null);
  const [name, setName] = useState<string>("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) {
      setLoaded(true);
      return;
    }
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then((s) => {
        setLegal(s?.legalPages ?? null);
        setName(s?.formData?.businessName ?? "");
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const docs = only ? DOCS.filter((d) => d.key === only) : DOCS;
  const has = legal && docs.some((d) => legal[d.key]);
  const heading = only ? (DOCS.find((d) => d.key === only)?.title ?? "Informations légales") : "Informations légales";

  return (
    <main
      style={{
        background: "#ffffff",
        color: "#1f2937",
        minHeight: "100vh",
        padding: "64px 20px 96px",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        lineHeight: 1.75,
      }}
    >
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <a href="./" style={{ color: "#6b7280", fontSize: 14, textDecoration: "none" }}>
          ← Retour au site
        </a>
        <h1 style={{ fontSize: 34, fontWeight: 800, margin: "16px 0 8px", letterSpacing: -0.5 }}>
          {heading}{name ? ` — ${name}` : ""}
        </h1>
        <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 40 }}>
          {only
            ? "Document contractuel de l’établissement."
            : "Mentions légales, conditions de vente et d’utilisation, politique de confidentialité."}
        </p>

        {!loaded && <p style={{ color: "#9ca3af" }}>Chargement…</p>}

        {loaded && has &&
          docs.filter((d) => legal?.[d.key]).map((d) => (
            <section key={d.key} style={{ marginBottom: 48 }}>
              {!only && (
                <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 16px", borderBottom: "1px solid #e5e7eb", paddingBottom: 8 }}>
                  {d.title}
                </h2>
              )}
              <div
                style={{ fontSize: 15.5 }}
                dangerouslySetInnerHTML={{ __html: legal![d.key] as string }}
              />
            </section>
          ))}

        {loaded && !has && (
          <p style={{ color: "#6b7280" }}>
            Les informations légales complètes de cet établissement sont disponibles sur demande
            et lors de toute commande ou prise de rendez-vous.
          </p>
        )}
      </div>
    </main>
  );
}
