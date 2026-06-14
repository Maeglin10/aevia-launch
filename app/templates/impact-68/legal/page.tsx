"use client";

import React from "react";
import { motion } from "framer-motion";
import { C } from "../shared";

export default function LegalPage() {
  return (
    <section style={{ padding: "80px 40px", background: C.bg, minHeight: "80vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            borderBottom: `1px solid ${C.border}`,
            paddingBottom: "40px",
            marginBottom: "64px",
            textAlign: "left",
          }}
        >
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              color: C.accent,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              marginBottom: "20px",
              display: "block",
            }}
          >
            Regulatory Info
          </span>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: C.text,
              lineHeight: 1.05,
            }}
          >
            Mentions Légales
          </h2>
        </motion.div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "40px",
            textAlign: "left",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "14px",
            lineHeight: 1.8,
            color: C.textMuted,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "40px", borderBottom: `1px solid ${C.border}`, paddingBottom: "24px" }} className="grid-hero-68">
            <div style={{ fontWeight: 700, color: C.accent, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>01 // ÉDITEUR</div>
            <div>
              <p style={{ fontWeight: 700, color: C.text, marginBottom: "8px" }}>VALENTIN MILLIAND</p>
              <p>Propriétaire et éditeur de la plateforme Aevia WS.</p>
              <p style={{ marginTop: "8px", fontStyle: "italic", fontSize: "12px" }}>L'adresse physique du propriétaire est communiquée sur simple demande à contact@aevia.io.</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "40px", borderBottom: `1px solid ${C.border}`, paddingBottom: "24px" }} className="grid-hero-68">
            <div style={{ fontWeight: 700, color: C.accent, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>02 // ENREGISTREMENT</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <p><span style={{ color: C.text, fontWeight: 700 }}>SIREN :</span> 852 546 225</p>
              <p><span style={{ color: C.text, fontWeight: 700 }}>RCS :</span> Bourg-en-Bresse</p>
              <p><span style={{ color: C.text, fontWeight: 700 }}>Régime :</span> Micro-entrepreneur (TVA non applicable, art. 293 B du CGI).</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "40px", borderBottom: `1px solid ${C.border}`, paddingBottom: "24px" }} className="grid-hero-68">
            <div style={{ fontWeight: 700, color: C.accent, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>03 // HÉBERGEMENT</div>
            <div>
              <p style={{ fontWeight: 700, color: C.text, marginBottom: "8px" }}>Google Firebase App Hosting</p>
              <p>Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA.</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "40px" }} className="grid-hero-68">
            <div style={{ fontWeight: 700, color: C.accent, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>04 // CONTACT</div>
            <div>
              <p style={{ marginBottom: "8px" }}>Pour toute communication administrative ou légale :</p>
              <p style={{ fontWeight: 700, color: C.text }}>contact@aevia.io</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
