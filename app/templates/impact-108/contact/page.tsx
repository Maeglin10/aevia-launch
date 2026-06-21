"use client";

import React, { useState } from "react";
import Link from "next/link";
import { C, FONT, FONT_BODY } from "../shared";

export default function LedgerContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT_BODY, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <div style={{ background: C.accent, padding: "60px 80px 56px" }}>
        <Link
          href="/templates/impact-108"
          style={{
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: 1,
            color: "rgba(255,255,255,0.5)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 36,
          }}
        >
          ← Retour
        </Link>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#93c5fd",
            marginBottom: 16,
          }}
        >
          Prise de contact
        </div>
        <h1
          style={{
            fontFamily: FONT,
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 800,
            color: C.white,
            letterSpacing: -0.5,
            lineHeight: 1.1,
          }}
        >
          Nous contacter
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontWeight: 300, fontSize: 18, color: "rgba(255,255,255,0.65)", marginTop: 14 }}>
          Premier rendez-vous offert et sans engagement.
        </p>
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "80px 80px",
          display: "grid",
          gridTemplateColumns: "1.3fr 1fr",
          gap: 72,
          alignItems: "start",
        }}
      >
        {/* Formulaire */}
        <div>
          <h2
            style={{
              fontFamily: FONT,
              fontSize: 26,
              fontWeight: 700,
              color: C.text,
              letterSpacing: -0.3,
              marginBottom: 32,
            }}
          >
            Envoyer un message
          </h2>
          {sent ? (
            <div
              style={{
                background: C.greenLight,
                border: `1.5px solid ${C.green}`,
                borderRadius: 10,
                padding: "36px 28px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <h3 style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.green, marginBottom: 8 }}>
                Message envoyé !
              </h3>
              <p style={{ fontFamily: FONT_BODY, fontWeight: 300, fontSize: 15, color: C.text, lineHeight: 1.65 }}>
                Nous vous recontactons sous 24h pour organiser votre rendez-vous de découverte gratuit.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ fontFamily: FONT, fontWeight: 600, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: C.textMuted, display: "block", marginBottom: 8 }}>
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Pierre"
                    style={{
                      width: "100%",
                      padding: "13px 16px",
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 6,
                      fontFamily: FONT_BODY,
                      fontWeight: 300,
                      fontSize: 15,
                      color: C.text,
                      background: C.white,
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: FONT, fontWeight: 600, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: C.textMuted, display: "block", marginBottom: 8 }}>
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Moreau"
                    style={{
                      width: "100%",
                      padding: "13px 16px",
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 6,
                      fontFamily: FONT_BODY,
                      fontWeight: 300,
                      fontSize: 15,
                      color: C.text,
                      background: C.white,
                      outline: "none",
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontFamily: FONT, fontWeight: 600, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: C.textMuted, display: "block", marginBottom: 8 }}>
                  Email professionnel *
                </label>
                <input
                  type="email"
                  required
                  placeholder="p.moreau@entreprise.fr"
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 6,
                    fontFamily: FONT_BODY,
                    fontWeight: 300,
                    fontSize: 15,
                    color: C.text,
                    background: C.white,
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label style={{ fontFamily: FONT, fontWeight: 600, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: C.textMuted, display: "block", marginBottom: 8 }}>
                  Téléphone
                </label>
                <input
                  type="tel"
                  placeholder="06 XX XX XX XX"
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 6,
                    fontFamily: FONT_BODY,
                    fontWeight: 300,
                    fontSize: 15,
                    color: C.text,
                    background: C.white,
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label style={{ fontFamily: FONT, fontWeight: 600, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: C.textMuted, display: "block", marginBottom: 8 }}>
                  Type d&apos;entreprise
                </label>
                <select
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 6,
                    fontFamily: FONT_BODY,
                    fontWeight: 300,
                    fontSize: 15,
                    color: C.text,
                    background: C.white,
                    outline: "none",
                  }}
                >
                  <option value="">Sélectionnez...</option>
                  <option>TPE (1–9 salariés)</option>
                  <option>PME (10–249 salariés)</option>
                  <option>Auto-entrepreneur</option>
                  <option>Création d&apos;entreprise</option>
                  <option>Association</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label style={{ fontFamily: FONT, fontWeight: 600, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: C.textMuted, display: "block", marginBottom: 8 }}>
                  Votre besoin *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Décrivez votre situation et vos besoins comptables ou fiscaux..."
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 6,
                    fontFamily: FONT_BODY,
                    fontWeight: 300,
                    fontSize: 15,
                    color: C.text,
                    background: C.white,
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 14,
                  background: C.green,
                  color: C.white,
                  padding: "15px 36px",
                  borderRadius: 7,
                  border: "none",
                  cursor: "pointer",
                  alignSelf: "flex-start",
                  letterSpacing: 0.3,
                }}
              >
                Envoyer →
              </button>
            </form>
          )}
        </div>

        {/* Infos */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div>
            <h3
              style={{
                fontFamily: FONT,
                fontSize: 18,
                fontWeight: 700,
                color: C.text,
                letterSpacing: -0.2,
                marginBottom: 16,
              }}
            >
              Nos coordonnées
            </h3>
            <p style={{ fontFamily: FONT_BODY, fontWeight: 300, fontSize: 14, color: C.textMuted, lineHeight: 2 }}>
              14 allée de Tourny<br />
              33000 Bordeaux<br />
              <a href="tel:+33556000000" style={{ color: C.accent, textDecoration: "none", fontWeight: 700 }}>05 56 XX XX XX</a><br />
              <a href="mailto:contact@ledger-associes.fr" style={{ color: C.accent, textDecoration: "none", fontWeight: 700 }}>contact@ledger-associes.fr</a>
            </p>
          </div>
          <div>
            <h3
              style={{
                fontFamily: FONT,
                fontSize: 18,
                fontWeight: 700,
                color: C.text,
                letterSpacing: -0.2,
                marginBottom: 16,
              }}
            >
              Horaires d&apos;accueil
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                ["Lundi – Vendredi", "8h30 – 18h30"],
                ["Samedi", "Sur rendez-vous"],
                ["Dimanche", "Fermé"],
              ].map(([jour, heure]) => (
                <div
                  key={jour}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <span style={{ fontFamily: FONT_BODY, fontWeight: 400, fontSize: 14, color: C.text }}>{jour}</span>
                  <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: C.accent }}>{heure}</span>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              background: C.greenLight,
              borderRadius: 8,
              padding: "24px 20px",
              borderLeft: `4px solid ${C.green}`,
            }}
          >
            <h4 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: C.green, marginBottom: 8 }}>
              Premier RDV offert
            </h4>
            <p style={{ fontFamily: FONT_BODY, fontWeight: 300, fontSize: 14, color: C.text, lineHeight: 1.65 }}>
              Le premier rendez-vous (1h) est gratuit et sans engagement. Nous analysons ensemble votre situation et vous proposons les solutions les plus adaptées.
            </p>
          </div>
          <div
            style={{
              background: C.accentLight,
              borderRadius: 8,
              padding: "20px",
              border: `1px solid ${C.border}`,
            }}
          >
            <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13, color: C.accent, marginBottom: 6 }}>
              Membre de l&apos;OEC Aquitaine
            </p>
            <p style={{ fontFamily: FONT_BODY, fontWeight: 300, fontSize: 13, color: C.textMuted }}>
              Cabinet inscrit à l&apos;Ordre des Experts-Comptables de la région Nouvelle-Aquitaine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
