"use client";

import React from "react";
import { C, SectionLabel, PageWrapper } from "../shared";

export default function LegalPage() {
  return (
    <PageWrapper>
      <div style={{ padding: "7rem clamp(2rem, 6vw, 6rem) 5rem", maxWidth: "800px", textAlign: "left" }}>
        <SectionLabel>Informations Légales</SectionLabel>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: C.text, marginBottom: "3rem" }}>
          Mentions Légales
        </h1>

        {[
          {
            title: "1. Éditeur du site",
            content: "Le site vitrine MAISON DROUET est édité par Valentin Milliand, micro-entrepreneur.\nSIREN : 852 546 225\nRCS : Bourg-en-Bresse\nAdresse : Valentin Milliand, SIREN 852 546 225, RCS Bourg-en-Bresse (adresse physique communiquée sur simple demande à contact@aevia.io).",
          },
          {
            title: "2. Hébergement",
            content: "Le site est hébergé par Vercel Inc., 650 2nd St, San Francisco, CA 94107, États-Unis.\nhttps://vercel.com",
          },
          {
            title: "3. Propriété intellectuelle",
            content: "L'ensemble du contenu de ce site (textes, images, éléments graphiques, logotypes) est protégé par le droit de la propriété intellectuelle et appartient à Valentin Milliand. Toute reproduction sans autorisation écrite préalable est interdite.",
          },
          {
            title: "4. Contact",
            content: "Pour toute question ou demande de renseignements complémentaires, vous pouvez nous contacter par courrier électronique à l'adresse suivante : contact@aevia.io.",
          },
        ].map((section) => (
          <div key={section.title} style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 500, color: C.gold, marginBottom: "0.75rem" }}>{section.title}</h2>
            <p style={{ fontSize: "0.95rem", color: C.textMuted, lineHeight: 1.75, whiteSpace: "pre-line" }}>{section.content}</p>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
