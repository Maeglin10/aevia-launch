"use client";

import React from "react";
import Link from "next/link";
import { C, FONT, FONT_BODY } from "../shared";

export default function LegalPage() {
  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT_BODY, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: C.bgDark, padding: "60px 80px 56px" }}>
        <Link
          href="/templates/impact-104"
          style={{
            fontFamily: FONT_BODY,
            fontWeight: 400,
            fontSize: 13,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 36,
          }}
        >
          ← Retour
        </Link>
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: 12,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: C.accent,
            marginBottom: 16,
          }}
        >
          Mentions Légales
        </div>
        <h1
          style={{
            fontFamily: FONT,
            fontSize: "clamp(38px, 6vw, 72px)",
            fontWeight: 300,
            fontStyle: "italic",
            color: C.white,
            letterSpacing: 0.5,
            lineHeight: 1.1,
          }}
        >
          Politique de Confidentialité
        </h1>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "80px 40px", display: "flex", flexDirection: "column", gap: 48 }}>
        <div>
          <h2 style={{ fontFamily: FONT, fontSize: 24, fontStyle: "italic", color: C.text, marginBottom: 20 }}>1. Édition du site</h2>
          <p style={{ lineHeight: 1.8, color: C.textMuted, fontSize: 15 }}>
            Ce site est un modèle de démonstration créé pour le projet Skylaunch. Toutes les informations présentées sont fictives et fournies à des fins d'illustration uniquement.
          </p>
        </div>
        <div>
          <h2 style={{ fontFamily: FONT, fontSize: 24, fontStyle: "italic", color: C.text, marginBottom: 20 }}>2. Propriété intellectuelle</h2>
          <p style={{ lineHeight: 1.8, color: C.textMuted, fontSize: 15 }}>
            Tous les contenus présents sur ce site (images, textes, logos) sont la propriété de leurs auteurs respectifs.
          </p>
        </div>
        <div>
          <h2 style={{ fontFamily: FONT, fontSize: 24, fontStyle: "italic", color: C.text, marginBottom: 20 }}>3. Protection des données</h2>
          <p style={{ lineHeight: 1.8, color: C.textMuted, fontSize: 15 }}>
            Aucune donnée personnelle n'est collectée sur ce site à des fins commerciales. Les informations saisies dans les formulaires de contact sont purement simulées.
          </p>
        </div>
      </div>
    </div>
  );
}
