"use client";

import React from "react";
import { C, F, PageHero } from "../shared";

export default function Privacy() {
  const sectionTitle: React.CSSProperties = {
    fontFamily: F.sans,
    fontSize: 20,
    fontWeight: 700,
    color: C.text,
    letterSpacing: '-0.01em',
    margin: '40px 0 14px',
  };
  const para: React.CSSProperties = {
    fontFamily: F.sans,
    fontSize: 15,
    color: C.textMuted,
    lineHeight: 1.85,
    marginBottom: 14,
    letterSpacing: '0.01em',
  };
  const strong: React.CSSProperties = { color: C.text, fontWeight: 700 };

  return (
    <div>
      <PageHero eyebrow="Protection des données" title="Confidentialité" />
      <section style={{ background: C.bg, padding: '90px 40px 120px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{ ...para, fontStyle: 'italic', color: C.textDim }}>
            Dernière mise à jour : juin 2026.
          </p>

          <h2 style={{ ...sectionTitle, marginTop: 24 }}>Responsable du traitement</h2>
          <p style={para}>
            Le responsable du traitement des données personnelles est <span style={strong}>Valentin Milliand</span>. Pour toute question, écrivez à <span style={strong}>valentinmilliand@aevia.services</span>.
          </p>

          <h2 style={sectionTitle}>Données collectées</h2>
          <p style={para}>
            Nous collectons uniquement les données que vous nous transmettez volontairement via le formulaire de contact
            (nom, email, type de projet et message), aux seules fins de répondre à votre demande.
          </p>

          <h2 style={sectionTitle}>Finalité et base légale</h2>
          <p style={para}>
            Vos données sont traitées sur la base de votre consentement et de l'intérêt légitime de l'atelier à répondre
            aux sollicitations. Elles ne font l'objet d'aucune cession à des tiers à des fins commerciales.
          </p>

          <h2 style={sectionTitle}>Durée de conservation</h2>
          <p style={para}>
            Les données issues du formulaire de contact sont conservées le temps nécessaire au traitement de votre
            demande, puis archivées ou supprimées conformément aux obligations légales applicables.
          </p>

          <h2 style={sectionTitle}>Vos droits</h2>
          <p style={para}>
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité et
            d'opposition au traitement de vos données. Pour exercer ces droits, écrivez à valentinmilliand@aevia.services.
          </p>

          <h2 style={sectionTitle}>Cookies</h2>
          <p style={para}>
            Ce site ne dépose pas de cookies de suivi publicitaire. Seuls des cookies techniques strictement nécessaires
            au fonctionnement du site peuvent être utilisés.
          </p>
        </div>
      </section>
    </div>
  );
}
