"use client";

import React from "react";
import {
  C,
  SERIF,
  SectionReveal,
  PageHeader,
} from "../shared";

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
            fontFamily: SERIF,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: C.gold,
            marginBottom: 10,
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontSize: 15,
            color: C.text,
            lineHeight: 1.8,
            fontWeight: 300,
            margin: 0,
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
    <section style={{ padding: "140px 5% 100px", background: C.bg, minHeight: "100vh" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <PageHeader
          kicker="Informations Légales"
          title="Mentions légales & Confidentialité"
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          <div>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 22,
                fontWeight: 700,
                color: C.burgundy,
                marginBottom: 24,
                borderBottom: `2px solid ${C.gold}`,
                paddingBottom: 8,
              }}
            >
              Mentions Légales
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <LegalBlock title="Éditeur">
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
              <LegalBlock title="TVA">
                TVA non applicable, art. 293 B du CGI
              </LegalBlock>
              <LegalBlock title="Hébergeur">
                Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA
              </LegalBlock>
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 22,
                fontWeight: 700,
                color: C.burgundy,
                marginBottom: 24,
                borderBottom: `2px solid ${C.gold}`,
                paddingBottom: 8,
              }}
            >
              Politique de Confidentialité
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <LegalBlock title="Responsable du traitement">
                Aevia WS, représentée par Valentin Milliand, est responsable du
                traitement des données collectées sur ce site. Contact :
                contact@aevia.io.
              </LegalBlock>
              <LegalBlock title="Données collectées">
                Les informations transmises via les formulaires de réservation et de
                contact (nom, téléphone, email, message) sont utilisées uniquement
                pour traiter votre demande et ne sont jamais cédées à des tiers à des
                fins commerciales.
              </LegalBlock>
              <LegalBlock title="Conservation">
                Vos données sont conservées le temps nécessaire au traitement de
                votre demande, puis archivées ou supprimées conformément aux durées
                légales en vigueur.
              </LegalBlock>
              <LegalBlock title="Vos droits">
                Conformément au RGPD, vous disposez d'un droit d'accès, de
                rectification, d'effacement et d'opposition sur vos données. Pour
                l'exercer, écrivez à contact@aevia.io.
              </LegalBlock>
              <LegalBlock title="Cookies">
                Ce site n'utilise que des cookies strictement nécessaires à son
                fonctionnement. Aucun traceur publicitaire n'est déposé sans votre
                consentement.
              </LegalBlock>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
