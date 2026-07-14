"use client";
// @ts-nocheck

import React, { useState } from "react";
import { motion } from "framer-motion";
import { C, TextReveal, MagneticButton } from "../shared";

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100dvh", padding: "7rem 3rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "6rem", alignItems: "start" }}>
        {/* Info Col */}
        <div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: C.amber, marginBottom: "1.5rem" }}>
            SOUMETTRE UN PROJET
          </div>
          <TextReveal style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2.5rem, 4vw, 4.5rem)", fontWeight: 900, color: C.text, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: "2rem", paddingBottom: "0.15em" }}>
            Votre histoire<br />mérite un film.
          </TextReveal>
          <p style={{ fontSize: "1rem", color: C.textMuted, lineHeight: 1.75, marginBottom: "3rem" }}>
            Stack Unit accepte 6 nouveaux projets par an. Nous lisons chaque dossier, répondons à tous. Si votre projet nous touche, tout devient possible.
          </p>

          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "2rem" }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", color: C.amber, marginBottom: "1rem" }}>
              COORDONNÉES
            </div>
            <p style={{ fontSize: "0.85rem", color: C.textMuted, lineHeight: 1.6 }}>
              Email : <a href="mailto:valentinmilliand@aevia.services" style={{ color: C.text, textDecoration: "none" }}>valentinmilliand@aevia.services</a><br />
              HQ : Bourg-en-Bresse, France<br />
              SPI N° 852 546 225
            </p>
          </div>
        </div>

        {/* Form Col */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "3rem", borderRadius: "8px" }}>
          {!formSubmitted ? (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.1em", color: C.textMuted }}>NOM COMPLET</label>
                <input
                  type="text"
                  required
                  style={{ background: C.bg, border: `1px solid ${C.border}`, padding: "1rem", color: C.text, fontFamily: "inherit", outline: "none", borderRadius: "4px" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.1em", color: C.textMuted }}>ADRESSE MAIL</label>
                <input
                  type="email"
                  required
                  style={{ background: C.bg, border: `1px solid ${C.border}`, padding: "1rem", color: C.text, fontFamily: "inherit", outline: "none", borderRadius: "4px" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.1em", color: C.textMuted }}>TITRE DU PROJET & SYNOPSIS COURT</label>
                <textarea
                  required
                  rows={6}
                  style={{ background: C.bg, border: `1px solid ${C.border}`, padding: "1rem", color: C.text, fontFamily: "inherit", outline: "none", resize: "none", borderRadius: "4px" }}
                />
              </div>

              <MagneticButton
                style={{
                  background: C.amber,
                  color: C.bg,
                  border: "none",
                  padding: "1rem 2rem",
                  fontFamily: "'Archivo', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  marginTop: "1rem"
                }}
              >
                ENVOYER LE DOSSIER →
              </MagneticButton>
            </form>
          ) : (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
              <div style={{ fontSize: "2rem", color: C.amber, marginBottom: "1.5rem" }}>✓</div>
              <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: "1.5rem", fontWeight: 700, color: C.text, marginBottom: "1rem" }}>Dossier Reçu</h3>
              <p style={{ fontSize: "0.85rem", color: C.textMuted, lineHeight: 1.6, maxWidth: "35ch", margin: "0 auto" }}>
                Merci pour votre soumission. Notre comité de lecture étudie chaque dossier avec la plus grande attention sous 15 jours.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
