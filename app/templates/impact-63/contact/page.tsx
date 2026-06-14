"use client";

import React from "react";
import { C, SectionLabel, PageWrapper } from "../shared";

export default function ContactPage() {
  const boutiques = [
    { city: "Paris", address: "Rue du Faubourg Saint-Honoré, 75008", note: "Sur rendez-vous uniquement" },
    { city: "Genève", address: "Rue du Rhône, 1204 Genève", note: "Sur rendez-vous uniquement" },
    { city: "Tokyo", address: "Ginza, Chuo-ku, 104-0061", note: "Sur rendez-vous uniquement" },
  ];

  return (
    <PageWrapper>
      <div style={{ padding: "7rem clamp(2rem, 6vw, 6rem) 4rem", background: C.bgSection, borderBottom: `1px solid ${C.border}` }}>
        <SectionLabel>Nous Contacter</SectionLabel>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 300, color: C.text, lineHeight: 1.15, paddingBottom: "0.1em", marginBottom: "1.5rem" }}>
          La Maison<br /><em style={{ color: C.gold }}>Vous Reçoit</em>
        </h1>
        <p style={{ fontSize: "1.05rem", color: C.textMuted, maxWidth: "50ch", lineHeight: 1.75 }}>
          Notre maison reçoit sur rendez-vous uniquement. Chaque visiteur bénéficie d'un accueil personnalisé par un conseiller expert.
        </p>
      </div>

      <div style={{ padding: "5rem clamp(2rem, 6vw, 6rem)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "start" }}>
            {/* Contact details */}
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "2rem" }}>COORDONNÉES</div>

              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                <div style={{ padding: "1.75rem", background: C.bgCard, border: `1px solid ${C.border}` }}>
                  <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.5rem" }}>ADRESSE</div>
                  <div style={{ fontSize: "1rem", color: C.textMuted, lineHeight: 1.65 }}>Adresse communiquée sur demande à<br /><span style={{ color: C.gold }}>contact@aevia.io</span></div>
                </div>

                <div style={{ padding: "1.75rem", background: C.bgCard, border: `1px solid ${C.border}` }}>
                  <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.5rem" }}>EMAIL</div>
                  <a href="mailto:contact@aevia.io" style={{ fontSize: "1rem", color: C.gold, textDecoration: "none" }}>contact@aevia.io</a>
                </div>

                <div style={{ padding: "1.75rem", background: C.bgCard, border: `1px solid ${C.border}` }}>
                  <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.5rem" }}>TÉLÉPHONE</div>
                  <a href="tel:+41220000000" style={{ fontSize: "1rem", color: C.textMuted, textDecoration: "none" }}>+41 22 000 00 00</a>
                  <div style={{ fontSize: "0.8rem", color: C.textDim, marginTop: "0.25rem" }}>Lundi – Samedi, 9h – 18h (CET)</div>
                </div>

                <div style={{ padding: "1.75rem", background: C.bgCard, border: `1px solid ${C.border}` }}>
                  <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim, marginBottom: "0.5rem" }}>RENDEZ-VOUS</div>
                  <div style={{ fontSize: "0.92rem", color: C.textMuted, lineHeight: 1.65 }}>Entretiens sur rendez-vous uniquement. Durée minimale : 60 minutes. Champagne servi.</div>
                </div>
              </div>
            </div>

            {/* Boutiques */}
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.25em", color: C.textDim, marginBottom: "2rem" }}>NOS BOUTIQUES</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {boutiques.map((b, i) => (
                  <div
                    key={b.city}
                    style={{
                      padding: "2rem",
                      borderBottom: i < boutiques.length - 1 ? `1px solid ${C.border}` : "none",
                      borderLeft: `2px solid ${C.goldDim}`,
                      paddingLeft: "1.5rem",
                      marginLeft: "0.5rem",
                    }}
                  >
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 500, color: C.text, marginBottom: "0.35rem" }}>{b.city}</div>
                    <div style={{ fontSize: "0.9rem", color: C.textMuted, marginBottom: "0.4rem" }}>{b.address}</div>
                    <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.18em", color: C.goldDim }}>{b.note.toUpperCase()}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "3rem", padding: "2rem", background: C.bgCard, border: `1px solid ${C.borderGold}` }}>
                <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.goldDim, marginBottom: "0.75rem" }}>NOTE</div>
                <p style={{ fontSize: "0.9rem", color: C.textMuted, lineHeight: 1.7, fontStyle: "italic" }}>
                  La Maison Drouet ne dispose pas de boutique en ligne. Toute acquisition passe par un entretien personnel avec l'un de nos conseillers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service & révision */}
      <div style={{ padding: "5rem clamp(2rem, 6vw, 6rem)", background: C.bgSection, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "left" }}>
          <div style={{ marginBottom: "3rem" }}>
            <SectionLabel>Entretien & Révision</SectionLabel>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 300, color: C.text }}>
              Service<br /><em style={{ color: C.gold }}>Après-Vente</em>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: C.border }}>
            {[
              { service: "Révision complète", price: "CHF 1,200", detail: "Démontage total, nettoyage ultrasonique, remplacement des joints, réglage COSC. Recommandé tous les 5 ans." },
              { service: "Polissage & remontage", price: "CHF 480", detail: "Remise à neuf du boîtier et du bracelet. Polissage miroir ou satiné selon la finition d'origine." },
              { service: "Remplacement verre saphir", price: "CHF 320", detail: "Verre saphir anti-reflets traité deux faces. Délai 5 jours ouvrables." },
              { service: "Authentification & certification", price: "CHF 150", detail: "Vérification de l'authenticité, délivrance d'un nouveau certificat numéroté." },
            ].map((s) => (
              <div key={s.service} style={{ background: C.bg, padding: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", color: C.text }}>{s.service}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: C.gold, whiteSpace: "nowrap", marginLeft: "1rem" }}>{s.price}</div>
                </div>
                <p style={{ fontSize: "0.85rem", color: C.textMuted, lineHeight: 1.65 }}>{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
