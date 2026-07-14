"use client";

import React, { useState } from "react";
import Link from "next/link";
import { C, FONT, FONT_BODY } from "../shared";

export default function IronClubContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT_BODY, minHeight: "100dvh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <div style={{ background: C.bgDark, padding: "60px 80px 50px" }}>
        <Link
          href="/templates/impact-87"
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 32,
          }}
        >
          ← Retour
        </Link>
        <h1
          style={{
            fontFamily: FONT,
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 900,
            textTransform: "uppercase",
            color: "#ffffff",
            letterSpacing: 3,
            lineHeight: 1,
          }}
        >
          Nous contacter
        </h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 18, color: "rgba(255,255,255,0.65)", marginTop: 16 }}>
          Réservez votre séance d&apos;essai ou posez-nous vos questions.
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
              fontSize: 28,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 2,
              color: C.text,
              marginBottom: 32,
            }}
          >
            Envoyer un message
          </h2>
          {sent ? (
            <div
              style={{
                background: C.accentLight,
                border: `2px solid ${C.accent}`,
                borderRadius: 8,
                padding: "32px 28px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <h3 style={{ fontFamily: FONT, fontSize: 22, fontWeight: 800, color: C.accent, marginBottom: 8 }}>
                Message envoyé !
              </h3>
              <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.text }}>
                Nous vous recontacterons dans les 24h pour organiser votre séance d&apos;essai.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", color: C.textMuted, display: "block", marginBottom: 8 }}>
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jean"
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 6,
                      fontFamily: FONT_BODY,
                      fontSize: 15,
                      color: C.text,
                      background: "#ffffff",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", color: C.textMuted, display: "block", marginBottom: 8 }}>
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Dupont"
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 6,
                      fontFamily: FONT_BODY,
                      fontSize: 15,
                      color: C.text,
                      background: "#ffffff",
                      outline: "none",
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", color: C.textMuted, display: "block", marginBottom: 8 }}>
                  Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="jean@exemple.fr"
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 6,
                    fontFamily: FONT_BODY,
                    fontSize: 15,
                    color: C.text,
                    background: "#ffffff",
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", color: C.textMuted, display: "block", marginBottom: 8 }}>
                  Téléphone
                </label>
                <input
                  type="tel"
                  placeholder="06 XX XX XX XX"
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 6,
                    fontFamily: FONT_BODY,
                    fontSize: 15,
                    color: C.text,
                    background: "#ffffff",
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", color: C.textMuted, display: "block", marginBottom: 8 }}>
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Je souhaite réserver une séance d'essai, je suis disponible..."
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 6,
                    fontFamily: FONT_BODY,
                    fontSize: 15,
                    color: C.text,
                    background: "#ffffff",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: 16,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  background: C.accent,
                  color: C.white,
                  padding: "16px 36px",
                  borderRadius: 4,
                  border: "none",
                  cursor: "pointer",
                  alignSelf: "flex-start",
                }}
              >
                Envoyer →
              </button>
            </form>
          )}
        </div>

        {/* Infos */}
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          <div>
            <h3
              style={{
                fontFamily: FONT,
                fontSize: 18,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 2,
                color: C.text,
                marginBottom: 16,
              }}
            >
              Adresse
            </h3>
            <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.textMuted, lineHeight: 1.8 }}>
              12 rue de la Guillotière<br />
              69007 Lyon 7e<br />
              <a href="tel:+33478000000" style={{ color: C.accent, textDecoration: "none", fontWeight: 600 }}>
                04 78 XX XX XX
              </a><br />
              <a href="mailto:contact@ironclub-lyon.fr" style={{ color: C.accent, textDecoration: "none", fontWeight: 600 }}>
                contact@ironclub-lyon.fr
              </a>
            </p>
          </div>
          <div>
            <h3
              style={{
                fontFamily: FONT,
                fontSize: 18,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 2,
                color: C.text,
                marginBottom: 16,
              }}
            >
              Horaires
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                ["Lundi – Vendredi", "6h00 – 22h00"],
                ["Samedi", "8h00 – 18h00"],
                ["Dimanche", "9h00 – 13h00"],
              ].map(([jour, heure]) => (
                <div
                  key={jour}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <span style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.text }}>{jour}</span>
                  <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: C.accent }}>{heure}</span>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              background: C.accentLight,
              borderRadius: 8,
              padding: "24px 20px",
              borderLeft: `4px solid ${C.accent}`,
            }}
          >
            <h4 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 16, color: C.accent, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
              🎯 Séance d&apos;essai offerte
            </h4>
            <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: C.text, lineHeight: 1.6 }}>
              Votre première séance CrossFit WOD est totalement gratuite. Venez découvrir nos installations et rencontrer l&apos;équipe sans engagement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
