"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { C, TextReveal, MagneticButton, CountUp } from "./shared";

export default function SegmentOS() {
  const quoteRef = useRef<HTMLDivElement>(null);
  const quoteInView = useInView(quoteRef, { once: true, margin: "-60px" });

  return (
    <div style={{ background: C.bg, color: C.text }}>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section style={{ minHeight: "90vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "3rem", paddingTop: "7rem", position: "relative" }}>
        {/* Giant number background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            position: "absolute",
            top: "3rem",
            right: "2rem",
            fontFamily: "'Archivo', sans-serif",
            fontSize: "clamp(8rem, 25vw, 22rem)",
            fontWeight: 900,
            color: C.border,
            lineHeight: 0.85,
            userSelect: "none",
            letterSpacing: "-0.06em",
          }}
        >
          23
        </motion.div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: "900px" }}>
          <div style={{ overflow: "hidden", marginBottom: "2rem" }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.7rem", letterSpacing: "0.35em", color: C.textDim, marginBottom: "1.5rem" }}
            >
              ARCHITECTES · PARIS · DEPUIS 2001
            </motion.div>
          </div>

          <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(3.5rem, 10vw, 10rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.04em", color: C.text }}>
            <TextReveal delay={0.3}>FORMES</TextReveal>
            <TextReveal delay={0.4} style={{ color: C.gold }}>ET</TextReveal>
            <TextReveal delay={0.5}>VIDES</TextReveal>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", marginTop: "4rem", paddingTop: "3rem", borderTop: `1px solid ${C.border}` }}>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              style={{ fontSize: "1.05rem", color: C.textMuted, lineHeight: 1.8, maxWidth: "42ch" }}
            >
              Segment est un studio d'architecture fondé sur une conviction : la qualité d'un espace se mesure à ses silences autant qu'à sa matière. Vingt ans de pratique, vingt ans de cette même question.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
            >
              <Link href="/templates/impact-61/projets" style={{ textDecoration: "none" }}>
                <MagneticButton
                  style={{
                    background: C.bgDark,
                    color: C.textLight,
                    border: "none",
                    padding: "1rem 2rem",
                    fontFamily: "'Archivo', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  VOIR LES PROJETS
                  <span style={{ fontSize: "1.2rem", fontWeight: 300 }}>→</span>
                </MagneticButton>
              </Link>
              <Link href="/templates/impact-61/contact" style={{ textDecoration: "none" }}>
                <MagneticButton
                  style={{
                    background: "transparent",
                    color: C.text,
                    border: `1px solid ${C.border}`,
                    padding: "1rem 2rem",
                    fontFamily: "'Archivo', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  TÉLÉCHARGER LE DOSSIER
                  <span style={{ fontSize: "1.2rem", fontWeight: 300 }}>↓</span>
                </MagneticButton>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ─────────────────────────────────────────────────── */}
      <section style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {[
            { n: 23, suffix: "", label: "années d'exercice" },
            { n: 85, suffix: "+", label: "projets réalisés" },
            { n: 42, suffix: "", label: "distinctions" },
            { n: 7, suffix: "", label: "pays d'intervention" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding: "3rem 2rem",
                borderRight: i < 3 ? `1px solid ${C.border}` : "none",
                textAlign: "center",
              }}
            >
              <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "3.5rem", fontWeight: 900, color: C.text, letterSpacing: "-0.04em", lineHeight: 1 }}>
                <CountUp target={stat.n} suffix={stat.suffix} />
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", color: C.textDim, marginTop: "0.5rem" }}>
                {stat.label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Philosophy ──────────────────────────────────────────────────── */}
      <section ref={quoteRef} style={{ padding: "8rem 3rem", background: C.bgDark, overflow: "hidden", position: "relative" }}>
        {/* Decorative line */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "1px", background: C.gold, opacity: 0.3 }} />

        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: C.gold, marginBottom: "3rem" }}>
            PHILOSOPHIE
          </div>

          {[
            { quote: "L'architecture n'est pas l'art de construire des murs. C'est l'art de choisir où ne pas en mettre.", weight: 900 },
            { quote: "Un bâtiment réussi est celui dont les habitants finissent par oublier qu'il a été conçu.", weight: 300 },
            { quote: "La lumière n'est pas un détail. Elle est le matériau principal de tout espace habitable.", weight: 500 },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              animate={quoteInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Archivo', sans-serif",
                fontSize: "clamp(1.2rem, 2.5vw, 2.2rem)",
                fontWeight: item.weight,
                color: i === 0 ? C.textLight : i === 2 ? C.gold : "#666",
                lineHeight: 1.35,
                paddingBottom: "2rem",
                marginBottom: "2rem",
                borderBottom: i < 2 ? `1px solid #222` : "none",
                letterSpacing: "-0.01em",
              }}
            >
              &quot;{item.quote}&quot;
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={quoteInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#444", marginTop: "1rem" }}
          >
            — Laurent Segré, Fondateur
          </motion.div>
        </div>
      </section>

      {/* ── Contact CTA ─────────────────────────────────────────────────── */}
      <section style={{ padding: "8rem 3rem", background: C.bgDark, textAlign: "center", position: "relative", overflow: "hidden", borderTop: "1px solid #222" }}>
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
          pointerEvents: "none",
        }}>
          <div style={{
            fontFamily: "'Archivo', sans-serif",
            fontSize: "clamp(6rem, 22vw, 20rem)",
            fontWeight: 900,
            color: "#111",
            letterSpacing: "-0.06em",
          }}>
            /S/
          </div>
        </div>
        <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto" }}>
          <TextReveal style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 900, color: C.textLight, letterSpacing: "-0.03em", lineHeight: 0.95, marginBottom: "2rem" }}>
            Votre projet<br />mérite mieux.
          </TextReveal>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ fontSize: "1.05rem", color: "#666", lineHeight: 1.75, marginBottom: "3rem" }}
          >
            On accepte 4 nouveaux projets par an. Si le vôtre est l'un d'eux, écrivons-nous.
          </motion.p>
          <Link href="/templates/impact-61/contact" style={{ textDecoration: "none" }}>
            <MagneticButton
              style={{
                background: C.gold,
                color: C.bgDark,
                border: "none",
                padding: "1.1rem 3rem",
                fontFamily: "'Archivo', sans-serif",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                cursor: "pointer",
              }}
            >
              DÉMARRER UN PROJET →
            </MagneticButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
