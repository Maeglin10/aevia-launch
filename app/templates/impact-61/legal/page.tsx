"use client";

import React from "react";
import { C, TextReveal } from "../shared";

export default function LegalPage() {
  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "80vh", padding: "6rem 3rem" }}>
      <section style={{ maxWidth: "800px", margin: "0 auto" }}>
        <TextReveal style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "-0.03em", color: C.text, marginBottom: "4rem" }}>
          Mentions Légales
        </TextReveal>

        <div style={{ display: "flex", flexDirection: "column", gap: "3rem", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.95rem", color: C.textMuted, lineHeight: 1.8 }}>
          <div>
            <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: C.text, marginBottom: "1rem" }}>
              1. ÉDITEUR DU SITE
            </h3>
            <p style={{ paddingLeft: "1.5rem", borderLeft: `1px solid ${C.gold}` }}>
              Le site vitrine SEGMENT ARCHITECTES est édité par Valentin Milliand, micro-entrepreneur.<br />
              SIREN : 852 546 225<br />
              RCS : Bourg-en-Bresse<br />
              Adresse : Valentin Milliand, SIREN 852 546 225, RCS Bourg-en-Bresse (adresse physique communiquée sur simple demande à valentinmilliand@aevia.services).
            </p>
          </div>

          <div>
            <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: C.text, marginBottom: "1rem" }}>
              2. HÉBERGEMENT
            </h3>
            <p style={{ paddingLeft: "1.5rem", borderLeft: `1px solid ${C.gold}` }}>
              Le site est hébergé par Vercel Inc., 650 2nd St, San Francisco, CA 94107, États-Unis.
            </p>
          </div>

          <div>
            <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: C.text, marginBottom: "1rem" }}>
              3. PROPRIÉTÉ INTELLECTUELLE
            </h3>
            <p style={{ paddingLeft: "1.5rem", borderLeft: `1px solid ${C.gold}` }}>
              Tous les designs de marque, typographies, designs de page, codes et textes sur ce site sont la propriété intellectuelle exclusive de Valentin Milliand.
            </p>
          </div>

          <div>
            <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: C.text, marginBottom: "1rem" }}>
              4. CONTACT
            </h3>
            <p style={{ paddingLeft: "1.5rem", borderLeft: `1px solid ${C.gold}` }}>
              Pour toute question ou demande de renseignements complémentaires, vous pouvez nous contacter par courrier électronique à l'adresse suivante : valentinmilliand@aevia.services.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
