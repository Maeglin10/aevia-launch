"use client";

import React from "react";
import { C } from "../shared";

export default function LegalPage() {
  return (
    <div style={{ background: C.bg, color: C.white, minHeight: "100dvh", padding: "80px 24px 120px", fontFamily: "'Barlow', system-ui" }}>
      <div style={{ maxWidth: 800, margin: '0 auto', lineHeight: 1.8 }}>
        <div style={{ marginBottom: 60, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: C.textDim, letterSpacing: '0.2em', textTransform: "uppercase", marginBottom: 20 }}>
            Informations Légales
          </div>
          <h1
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(28px, 5vw, 56px)',
              fontWeight: 900,
              color: C.white,
              margin: 0,
            }}
          >
            Mentions Légales & CGU
          </h1>
        </div>

        <div style={{ fontSize: 14, color: C.textMuted, border: `1px solid ${C.border}`, background: C.bgCard, padding: 40 }}>
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontFamily: "'Cinzel', serif", color: C.white, marginBottom: 12 }}>ÉDITEUR</h2>
            <p style={{ margin: 0 }}>Ce site web est édité par : <strong>Valentin Milliand</strong>, propriétaire d'Aevia WS.</p>
            <p style={{ margin: "8px 0 0 0" }}>Immatriculation : <strong>SIREN 852 546 225</strong>, enregistré au Registre du Commerce et des Sociétés (RCS) de Bourg-en-Bresse.</p>
            <p style={{ margin: "8px 0 0 0" }}>Siège Social : Adresse physique non communiquée pour des raisons de confidentialité (adresse communiquée sur demande à valentinmilliand@aevia.services).</p>
            <p style={{ margin: "8px 0 0 0" }}>Contact : <strong>valentinmilliand@aevia.services</strong></p>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontFamily: "'Cinzel', serif", color: C.white, marginBottom: 12 }}>HÉBERGEMENT</h2>
            <p style={{ margin: 0 }}>Ce site est hébergé par : Google Firebase App Hosting (Google Cloud LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA).</p>
          </section>

          <section>
            <h2 style={{ fontSize: 18, fontFamily: "'Cinzel', serif", color: C.white, marginBottom: 12 }}>CONFIDENTIALITÉ & DONNÉES</h2>
            <p style={{ margin: 0 }}>Toutes les données recueillies via le formulaire de contact (nom, e-mail, artiste sélectionné et description du projet) sont utilisées exclusivement pour traiter votre demande de consultation. Elles ne sont jamais partagées ou revendues. Conformément aux lois en vigueur, vous disposez d'un droit d'accès et de suppression de vos données sur simple demande par e-mail à valentinmilliand@aevia.services.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
