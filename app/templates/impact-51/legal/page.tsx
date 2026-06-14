"use client";

import React from "react";
import { T, Reveal } from "../shared";

export default function LegalPage() {
  return (
    <main style={{ background: "#ffffff", paddingTop: 140, paddingBottom: 100 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 40px" }}>
        <Reveal>
          <div style={{ marginBottom: 60 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: T.accent,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontFamily: T.bodyFont,
                marginBottom: 12,
                display: "block",
              }}
            >
              Legal
            </span>
            <h1
              style={{
                fontSize: "clamp(32px, 4.5vw, 52px)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: T.text,
                fontFamily: T.headingFont,
                lineHeight: 1.25,
                paddingBottom: "8px",
                marginBottom: 12,
              }}
            >
              Mentions Légales
            </h1>
            <p
              style={{
                fontSize: 15,
                color: T.muted,
                fontFamily: T.bodyFont,
                lineHeight: 1.5,
              }}
            >
              Informations obligatoires conformément à l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN).
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 60 }}>
          <Reveal>
            <div
              style={{
                background: "#fafafa",
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                padding: 32,
                height: "100%",
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: T.headingFont, marginBottom: 16 }}>
                Éditeur du Site
              </h3>
              <div style={{ fontSize: 13, color: T.muted, fontFamily: T.bodyFont, lineHeight: 1.6 }}>
                <p style={{ marginBottom: 8 }}>Le site <strong>Nexus</strong> est édité par :</p>
                <p style={{ fontWeight: 600, color: T.accent, marginBottom: 8 }}>Valentin Milliand, micro-entrepreneur</p>
                <p><strong>SIREN :</strong> 852 546 225</p>
                <p><strong>RCS :</strong> Bourg-en-Bresse</p>
                <p><strong>Siège social :</strong> Bourg-en-Bresse, France</p>
                <p><strong>Contact :</strong> hello@nexus.io</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div
              style={{
                background: "#fafafa",
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                padding: 32,
                height: "100%",
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: T.headingFont, marginBottom: 16 }}>
                Hébergement
              </h3>
              <div style={{ fontSize: 13, color: T.muted, fontFamily: T.bodyFont, lineHeight: 1.6 }}>
                <p style={{ marginBottom: 8 }}><strong>Hébergeur :</strong></p>
                <p style={{ fontWeight: 600, color: T.accent, marginBottom: 8 }}>Aevia Web Solutions</p>
                <p><strong>Siège :</strong> Bourg-en-Bresse, France</p>
                <p><strong>Directeur de la publication :</strong> Valentin Milliand</p>
                <p style={{ marginTop: 12 }}>
                  Toutes les marques et images présentées sont la propriété exclusive de leurs auteurs respectifs.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
