"use client";

import React from "react";
import Link from "next/link";
import { C, FONT, FONT_BODY } from "../shared";

export default function LegalPage() {
  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT_BODY, minHeight: "100dvh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      {/* Header */}
      <div style={{ background: C.bgDark, padding: "60px 80px 50px" }}>
        <Link
          href="/templates/impact-87"
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 32,
          }}
        >
          ← Retour
        </Link>
        <h1
          style={{
            fontFamily: FONT,
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 900,
            textTransform: "uppercase",
            color: "#ffffff",
            letterSpacing: 3,
            lineHeight: 1,
          }}
        >
          Mentions Légales & Confidentialité
        </h1>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "80px 40px", display: "flex", flexDirection: "column", gap: 48 }}>
        <div>
          <h2 style={{ fontFamily: FONT, fontSize: 24, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, color: C.text, marginBottom: 20 }}>1. Édition du site</h2>
          <p style={{ lineHeight: 1.8, color: C.textMuted, fontSize: 15 }}>
            Ce site est un modèle de démonstration créé pour le projet Skylaunch. Toutes les informations présentées sont fictives et fournies à des fins d'illustration uniquement.
          </p>
        </div>
        <div>
          <h2 style={{ fontFamily: FONT, fontSize: 24, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, color: C.text, marginBottom: 20 }}>2. Propriété intellectuelle</h2>
          <p style={{ lineHeight: 1.8, color: C.textMuted, fontSize: 15 }}>
            Tous les contenus présents sur ce site (images, textes, logos) sont la propriété de leurs auteurs respectifs.
          </p>
        </div>
        <div>
          <h2 style={{ fontFamily: FONT, fontSize: 24, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, color: C.text, marginBottom: 20 }}>3. Protection des données</h2>
          <p style={{ lineHeight: 1.8, color: C.textMuted, fontSize: 15 }}>
            Aucune donnée personnelle n'est collectée sur ce site à des fins commerciales. Les informations saisies dans les formulaires de contact sont purement simulées.
          </p>
        </div>
      </div>
    </div>
  );
}
