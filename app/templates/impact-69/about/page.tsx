"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, TextReveal, MagneticButton } from "../shared";

export default function AboutPage() {
  const handleEmailClick = () => {
    window.location.href = "mailto:contact@aevia.io";
  };

  return (
    <div style={{ background: C.bg, minHeight: "85vh" }}>
      {/* ── Philosophy ── */}
      <section style={{ padding: "80px 0", maxWidth: 1200, margin: "0 auto", paddingInline: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="grid-hero-68">
          {/* Large photo mock */}
          <div style={{ position: "relative" }}>
            <div style={{ aspectRatio: "3/4", background: "linear-gradient(160deg, #111C08 0%, #1E2E10 50%, #2A3D18 100%)", borderRadius: 4, overflow: "hidden", border: `1px solid ${C.border}` }}>
              <svg width="100%" height="100%" viewBox="0 0 400 533">
                <defs>
                  <radialGradient id="photoGlow" cx="50%" cy="30%" r="60%">
                    <stop offset="0%" stopColor={C.amber} stopOpacity="0.08" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>
                <rect width="400" height="533" fill="url(#photoGlow)" />
                {/* Stylized tree */}
                <line x1="200" y1="533" x2="200" y2="160" stroke={C.bgCard} strokeWidth="12" />
                {[
                  [200, 280, 120], [200, 240, 100], [200, 320, 140],
                  [200, 200, 80], [200, 360, 120], [200, 160, 60],
                ].map(([cx, cy, spread], i) => (
                  <line key={i} x1={200 - spread} y1={cy + 40} x2={200 + spread} y2={cy + 40}
                    stroke={C.green} strokeWidth={2} opacity={0.3 + i * 0.05}
                  />
                ))}
                <text x="200" y="490" textAnchor="middle" fill={C.muted} fontSize="11" fontFamily="Space Grotesk" letterSpacing="0.2em">BOREAL SILENCE, 2024</text>
              </svg>
            </div>
            {/* Floating label */}
            <motion.div
              style={{ position: "absolute", bottom: -20, right: -20, background: C.bgMid, border: `1px solid ${C.border}`, borderRadius: 4, padding: "16px 20px" }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: C.moss, letterSpacing: "0.2em", marginBottom: 4 }}>SHOT WITH</p>
              <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: 14, color: C.cream, fontWeight: 600 }}>Hasselblad X2D 100C</p>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.muted }}>100MP · XCD 65mm f/2.8</p>
            </motion.div>
          </div>

          <div style={{ textAlign: "left" }}>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.35em", color: C.moss, textTransform: "uppercase", marginBottom: 20 }}>Philosophy</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 32, color: C.cream }}>
              <TextReveal text="The wilderness" />
              <TextReveal text="doesn't perform." delay={0.15} />
              <TextReveal text="You wait." delay={0.3} style={{ color: C.amber }} />
            </h2>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.8, fontWeight: 300, marginBottom: 24 }}>
              I spend weeks in each location before making an image. The mountains don't care about my schedule. The fog rolls in when it wants. All I do is be present — technically prepared, emotionally open, and patient enough to let the moment arrive.
            </p>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.8, fontWeight: 300, marginBottom: 40 }}>
              Each print is made in partnership with Atelier Gaspard in Lyon, using archival pigment inks on 300gsm cotton rag paper. Every edition is limited to preserve collector value and my own artistic integrity.
            </p>
            <div style={{ display: "flex", gap: 40 }}>
              {[{ val: "300gsm", label: "Cotton rag paper" }, { val: "50yr", label: "Archive guarantee" }, { val: "≤20", label: "Prints per series" }].map(item => (
                <div key={item.label}>
                  <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: 22, fontWeight: 700, color: C.cream }}>{item.val}</p>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.muted, marginTop: 4 }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section style={{ padding: "80px 0", maxWidth: 1200, margin: "0 auto", paddingInline: 32, textAlign: "center" }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.35em", color: C.moss, textTransform: "uppercase", marginBottom: 24 }}>Let's Talk</p>
        <h2 style={{ fontSize: "clamp(36px, 6vw, 80px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 0.95, marginBottom: 40 }}>
          <TextReveal text="Commission." style={{ display: "block", color: C.cream }} />
          <TextReveal text="License." delay={0.15} style={{ display: "block", color: C.moss }} />
          <TextReveal text="Collect." delay={0.3} style={{ display: "block", color: C.amber }} />
        </h2>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.75, maxWidth: 500, margin: "0 auto 48px", fontWeight: 300 }}>
          For editorial licensing, commercial usage, or private commissions, get in touch directly. For print enquiries, visit the shop.
        </p>
        <MagneticButton onClick={handleEmailClick} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: C.bg, background: C.cream, padding: "18px 48px", borderRadius: 2, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>
          contact@aevia.io
        </MagneticButton>
      </section>
    </div>
  );
}
