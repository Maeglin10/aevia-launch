"use client";

import React from "react";
import { C } from "../shared";

export default function LegalPage() {
  return (
    <section style={{ padding: "6rem 3rem", minHeight: "calc(100vh - 120px)" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "0.75rem" }}>
          / LEGAL
        </div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 800, color: C.text, letterSpacing: "-0.02em", lineHeight: "1.15", paddingBottom: "0.5rem", marginBottom: "3rem" }}>
          Mentions Légales
        </h2>

        <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: "0.8rem", color: C.textMuted, lineHeight: 1.8, display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          <div>
            <h3 style={{ color: C.text, fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}># 1. ÉDITEUR DU SITE</h3>
            <p style={{ paddingLeft: "1.5rem" }}>
              Le site vitrine SKEW STUDIO est édité par Valentin Milliand, micro-entrepreneur.<br />
              SIREN : 852 546 225<br />
              RCS : Bourg-en-Bresse<br />
              Adresse : Valentin Milliand, SIREN 852 546 225, RCS Bourg-en-Bresse (adresse physique communiquée sur simple demande à contact@aevia.io).
            </p>
          </div>

          <div>
            <h3 style={{ color: C.text, fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}># 2. HÉBERGEMENT</h3>
            <p style={{ paddingLeft: "1.5rem" }}>
              Le site est hébergé par Vercel Inc., 650 2nd St, San Francisco, CA 94107, États-Unis.
            </p>
          </div>

          <div>
            <h3 style={{ color: C.text, fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}># 3. PROPRIÉTÉ INTELLECTUELLE</h3>
            <p style={{ paddingLeft: "1.5rem" }}>
              Tous les designs, codes et textes sur ce site sont la propriété intellectuelle exclusive de Valentin Milliand.
            </p>
          </div>

          <div>
            <h3 style={{ color: C.text, fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}># 4. CONTACT</h3>
            <p style={{ paddingLeft: "1.5rem" }}>
              Pour toute question d&apos;ordre réglementaire, contactez-nous à contact@aevia.io.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
