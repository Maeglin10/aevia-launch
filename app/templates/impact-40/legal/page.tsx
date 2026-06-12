"use client";

import React from "react";
import { C, SectionReveal, GoldDivider } from "../shared";

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
            fontFamily: C.headingFont,
            fontSize: "1.05rem",
            fontWeight: 700,
            color: C.accentDark,
            marginBottom: 10,
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontFamily: C.bodyFont,
            fontSize: "0.92rem",
            color: C.textLight,
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
        <SectionReveal>
          <h1 style={{ fontFamily: C.headingFont, fontSize: "2.5rem", fontWeight: 700, color: C.text, marginBottom: "0.75rem" }}>
            Mentions Légales & Confidentialité
          </h1>
          <GoldDivider />
        </SectionReveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 48, marginTop: 40 }}>
          <div>
            <h2
              style={{
                fontFamily: C.headingFont,
                fontSize: "1.5rem",
                fontWeight: 700,
                color: C.text,
                marginBottom: 24,
                borderBottom: `2px solid ${C.accent}`,
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
              <LegalBlock title="Hébergement">
                Vercel Inc. — 340 Pine Street, Suite 701, San Francisco, CA 94104, USA.
              </LegalBlock>
              <LegalBlock title="Propriété intellectuelle">
                L'ensemble du contenu de ce site (textes, images, visuels, logos) est la propriété exclusive d'Aevia WS, sauf mentions contraires. Toute reproduction, même partielle, est interdite sans autorisation préalable écrite.
              </LegalBlock>
              <LegalBlock title="Responsabilité">
                Aevia WS s'efforce d'assurer l'exactitude des informations diffusées sur ce site. Toutefois, elle ne peut garantir l'exhaustivité ou l'absence d'erreur. Les informations tarifaires et les disponibilités sont susceptibles d'évoluer sans préavis.
              </LegalBlock>
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <h2
              style={{
                fontFamily: C.headingFont,
                fontSize: "1.5rem",
                fontWeight: 700,
                color: C.text,
                marginBottom: 24,
                borderBottom: `2px solid ${C.accent}`,
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
                Dans le cadre de la prise de réservation en ligne, nous collectons les données suivantes : nom et prénom, adresse email, numéro de téléphone, date et heure souhaitées, nombre de convives, informations relatives à l'occasion et aux régimes alimentaires.
              </LegalBlock>
              <LegalBlock title="Finalité du traitement">
                Ces données sont utilisées exclusivement pour la gestion et la confirmation de votre réservation, et pour vous contacter en cas de nécessité. Elles ne sont ni revendues ni transmises à des tiers.
              </LegalBlock>
              <LegalBlock title="Conservation & droits">
                Les données sont conservées pour une durée maximale de 3 ans à compter de votre dernière interaction. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données. Pour exercer ces droits, écrivez à contact@aevia.io.
              </LegalBlock>
              <LegalBlock title="Cookies">
                Ce site n'utilise pas de cookies tiers à des fins publicitaires ou de suivi. Des cookies techniques essentiels peuvent être utilisés pour assurer le bon fonctionnement du site.
              </LegalBlock>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
