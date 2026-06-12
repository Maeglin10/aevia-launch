"use client";

import React from "react";
import { C, SectionReveal } from "../shared";

function LegalBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <SectionReveal>
      <div style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 24 }}>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: C.orange,
            marginBottom: 10,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontSize: 15,
            color: C.textMuted,
            lineHeight: 1.8,
            fontWeight: 300,
            margin: 0,
            whiteSpace: "pre-line",
          }}
        >
          {children}
        </p>
      </div>
    </SectionReveal>
  );
}

export default function LegalPage() {
  return (
    <section style={{ padding: "120px 5% 100px", background: C.bg, minHeight: "100vh" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, color: C.navy, marginBottom: 40 }}>
          Mentions Légales & Confidentialité
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          <div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: C.navy,
                marginBottom: 24,
                borderBottom: `2px solid ${C.orange}`,
                paddingBottom: 8,
              }}
            >
              Mentions Légales
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <LegalBlock title="Éditeur du site">
                Aevia WS — Valentin Milliand, entrepreneur individuel.
              </LegalBlock>
              <LegalBlock title="Directeur de la publication">
                Valentin Milliand
              </LegalBlock>
              <LegalBlock title="Immatriculation">
                SIREN 852 546 225 — RCS Bourg-en-Bresse
              </LegalBlock>
              <LegalBlock title="Contact">
                contact@aevia.io (adresse du siège social communiquée sur demande)
              </LegalBlock>
              <LegalBlock title="Hébergeur">
                Vercel Inc. — 340 Pine Street, Suite 701, San Francisco, CA 94104, USA.
              </LegalBlock>
              <LegalBlock title="Propriété intellectuelle">
                L'ensemble du contenu de ce site (textes, images, graphismes, logo) est la propriété exclusive d'Aevia WS. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.
              </LegalBlock>
              <LegalBlock title="Responsabilité">
                Aevia WS s'efforce d'assurer l'exactitude des informations diffusées sur ce site, mais ne saurait être tenu responsable des erreurs ou omissions, ni des dommages résultant de leur utilisation.
              </LegalBlock>
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: C.navy,
                marginBottom: 24,
                borderBottom: `2px solid ${C.orange}`,
                paddingBottom: 8,
              }}
            >
              Politique de Confidentialité
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <LegalBlock title="Responsable du traitement">
                Aevia WS, représentée par Valentin Milliand, est responsable du traitement des données collectées sur ce site. Contact : contact@aevia.io.
              </LegalBlock>
              <LegalBlock title="Données collectées">
                Nous collectons uniquement les données nécessaires à l'établissement d'un devis et à la prestation de services de déménagement : nom, email, téléphone, adresses de départ et d'arrivée.
              </LegalBlock>
              <LegalBlock title="Conservation">
                Vos données sont conservées pendant 3 ans à compter du dernier contact, puis supprimées.
              </LegalBlock>
              <LegalBlock title="Vos droits">
                Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité. Pour exercer ces droits, écrivez à contact@aevia.io.
              </LegalBlock>
              <LegalBlock title="Cookies">
                Ce site n'utilise que des cookies strictement nécessaires à son fonctionnement. Aucun traceur publicitaire n'est déposé sans votre consentement.
              </LegalBlock>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
