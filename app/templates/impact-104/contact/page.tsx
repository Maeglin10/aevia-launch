"use client";

import React, { useState } from "react";
import Link from "next/link";
import { C, FONT, FONT_BODY , CSS_VARIABLES } from "../shared";

export default function LumiereDoreeContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
      
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT_BODY, minHeight: "100dvh" }}>
      <style>{CSS_VARIABLES}</style>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <div style={{ background: C.bgDark, padding: "60px 80px 56px" }}>
        <Link
          href="/templates/impact-104"
          style={{
            fontFamily: FONT_BODY,
            fontWeight: 400,
            fontSize: 13,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
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
            fontFamily: FONT_BODY,
            fontSize: 12,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: C.accent,
            marginBottom: 16,
          }}
        >
          Prise de contact
        </div>
        <h1
          style={{
            fontFamily: FONT,
            fontSize: "clamp(38px, 6vw, 72px)",
            fontWeight: 300,
            fontStyle: "italic",
            color: C.white,
            letterSpacing: 0.5,
            lineHeight: 1.1,
          }}
        >
          Parlons de votre projet
        </h1>
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
              fontWeight: 400,
              fontStyle: "italic",
              color: C.text,
              marginBottom: 32,
            }}
          >
            Demande de devis
          </h2>
          {sent ? (
            <div
              style={{
                background: C.accentLight,
                border: `1px solid ${C.border}`,
                borderRadius: 4,
                padding: "40px 32px",
                textAlign: "center",
              }}
            >
              <div style={{ fontFamily: FONT, fontStyle: "italic", fontSize: 42, color: C.accent, marginBottom: 16 }}>✨</div>
              <h3 style={{ fontFamily: FONT, fontStyle: "italic", fontSize: 26, fontWeight: 300, color: C.text, marginBottom: 10 }}>
                Message reçu !
              </h3>
              <p style={{ fontFamily: FONT_BODY, fontWeight: 300, fontSize: 15, color: C.textMuted, lineHeight: 1.7 }}>
                Je vous recontacte sous 48h pour discuter de votre projet et vérifier la disponibilité de votre date.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ fontFamily: FONT_BODY, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: C.textMuted, display: "block", marginBottom: 8, fontWeight: 400 }}>
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Sophie"
                    style={{
                      width: "100%",
                      padding: "13px 16px",
                      border: `1px solid ${C.border}`,
                      borderRadius: 3,
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
                  <label style={{ fontFamily: FONT_BODY, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: C.textMuted, display: "block", marginBottom: 8, fontWeight: 400 }}>
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Martin"
                    style={{
                      width: "100%",
                      padding: "13px 16px",
                      border: `1px solid ${C.border}`,
                      borderRadius: 3,
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
                <label style={{ fontFamily: FONT_BODY, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: C.textMuted, display: "block", marginBottom: 8, fontWeight: 400 }}>
                  Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="sophie@exemple.fr"
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    border: `1px solid ${C.border}`,
                    borderRadius: 3,
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
                <label style={{ fontFamily: FONT_BODY, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: C.textMuted, display: "block", marginBottom: 8, fontWeight: 400 }}>
                  Date du mariage
                </label>
                <input
                  type="date"
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    border: `1px solid ${C.border}`,
                    borderRadius: 3,
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
                <label style={{ fontFamily: FONT_BODY, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: C.textMuted, display: "block", marginBottom: 8, fontWeight: 400 }}>
                  Lieu / Ville
                </label>
                <input
                  type="text"
                  placeholder="Paris, Versailles, Bordeaux..."
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    border: `1px solid ${C.border}`,
                    borderRadius: 3,
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
                <label style={{ fontFamily: FONT_BODY, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: C.textMuted, display: "block", marginBottom: 8, fontWeight: 400 }}>
                  Votre message *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Parlez-moi de votre mariage, vos envies, le style de photos que vous aimez..."
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    border: `1px solid ${C.border}`,
                    borderRadius: 3,
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
                  fontFamily: FONT_BODY,
                  fontWeight: 500,
                  fontSize: 13,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  background: C.accent,
                  color: C.bgDark,
                  padding: "16px 36px",
                  border: "none",
                  cursor: "pointer",
                  alignSelf: "flex-start",
                }}
              >
                Envoyer ma demande →
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
                fontSize: 20,
                fontWeight: 400,
                fontStyle: "italic",
                color: C.text,
                marginBottom: 16,
              }}
            >
              Informations pratiques
            </h3>
            <p style={{ fontFamily: FONT_BODY, fontWeight: 300, fontSize: 14, color: C.textMuted, lineHeight: 1.8 }}>
              Paris 11e (Bastille)<br />
              <a href="tel:+33612345678" style={{ color: C.accent, textDecoration: "none" }}>06 12 XX XX XX</a><br />
              <a href="mailto:contact@lumieredoree.fr" style={{ color: C.accent, textDecoration: "none" }}>contact@lumieredoree.fr</a>
            </p>
          </div>
          <div>
            <h3
              style={{
                fontFamily: FONT,
                fontSize: 20,
                fontWeight: 400,
                fontStyle: "italic",
                color: C.text,
                marginBottom: 16,
              }}
            >
              Disponibilités
            </h3>
            <p style={{ fontFamily: FONT_BODY, fontWeight: 300, fontSize: 14, color: C.textMuted, lineHeight: 1.8 }}>
              Lun – Ven : 9h – 19h<br />
              Réponse sous 48h garantie
            </p>
          </div>
          <div
            style={{
              background: C.accentLight,
              borderRadius: 4,
              padding: "24px 22px",
              borderLeft: `3px solid ${C.accent}`,
            }}
          >
            <h4
              style={{
                fontFamily: FONT,
                fontStyle: "italic",
                fontSize: 18,
                fontWeight: 400,
                color: C.accentDark,
                marginBottom: 10,
              }}
            >
              Note importante
            </h4>
            <p style={{ fontFamily: FONT_BODY, fontWeight: 300, fontSize: 14, color: C.textMuted, lineHeight: 1.65 }}>
              Les dates de mariage se réservent 12 à 18 mois à l&apos;avance. Pour les mariages 2025, il reste peu de disponibilités.
            </p>
          </div>
          <div
            style={{
              background: C.white,
              borderRadius: 4,
              padding: "24px 22px",
              border: `1px solid ${C.border}`,
            }}
          >
            <h4 style={{ fontFamily: FONT, fontSize: 18, fontWeight: 400, fontStyle: "italic", color: C.text, marginBottom: 12 }}>
              Zone de déplacement
            </h4>
            <p style={{ fontFamily: FONT_BODY, fontWeight: 300, fontSize: 14, color: C.textMuted, lineHeight: 1.65 }}>
              Basée à Paris, je me déplace sur toute la France métropolitaine et à l&apos;international sur demande.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
