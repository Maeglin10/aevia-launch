// @ts-nocheck
"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { C, TextReveal, MagneticButton, Marquee } from "./shared";

export default function StackUnitHome() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroGlow = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const TICKER_ITEMS = [
    "MAISON DE PRODUCTION", "CANNES 2024", "SUNDANCE 2024", "VENISE 2023",
    "IDFA 2024", "BERLIN 2023", "23 ANS D'EXCELLENCE", "STACK UNIT FILMS",
  ];

  return (
    <div ref={containerRef} style={{ background: C.bg, color: C.text, minHeight: "100vh" }}>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section style={{ minHeight: "calc(100vh - 60px)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "3rem", position: "relative", overflow: "hidden" }}>
        {/* Glow effect */}
        <motion.div
          style={{
            position: "absolute",
            top: "20%",
            left: "30%",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(202,138,4,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
            opacity: heroGlow,
          }}
        />

        {/* Film grain texture */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.02, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "1300px", margin: "0 auto", width: "100%" }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.4em", color: C.textDim, marginBottom: "2rem" }}
          >
            MAISON DE PRODUCTION INDÉPENDANTE · PARIS · EST. 2001
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(3.5rem, 9vw, 8rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.04em", color: C.text, paddingBottom: "0.15em" }}>
                <TextReveal delay={0.3} style={{ paddingBottom: "0.15em" }}>L'ART</TextReveal>
                <TextReveal delay={0.45} style={{ color: C.amber, paddingBottom: "0.15em" }}>DU FILM</TextReveal>
                <TextReveal delay={0.6} style={{ fontStyle: "italic", fontWeight: 300, paddingBottom: "0.15em" }}>EXIGEANT</TextReveal>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1 }}
                style={{ fontSize: "0.95rem", color: C.textMuted, lineHeight: 1.8, maxWidth: "45ch", marginTop: "2.5rem", marginBottom: "2.5rem" }}
              >
                Stack Unit produit des films qui résistent au temps. Long-métrages, documentaires, courts et films publicitaires — toujours avec la même exigence artistique absolue.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                style={{ display: "flex", gap: "1rem" }}
              >
                <MagneticButton
                  onClick={() => router.push("/templates/impact-72/films")}
                  style={{
                    background: C.amber,
                    color: C.bg,
                    border: "none",
                    padding: "0.9rem 2rem",
                    fontFamily: "'Archivo', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                  }}
                >
                  VOIR LA FILMOGRAPHIE →
                </MagneticButton>
                <MagneticButton
                  onClick={() => router.push("/templates/impact-72/contact")}
                  style={{
                    background: "transparent",
                    color: C.textMuted,
                    border: `1px solid ${C.border}`,
                    padding: "0.9rem 2rem",
                    fontFamily: "'Archivo', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                  }}
                >
                  SOUMETTRE UN PROJET
                </MagneticButton>
              </motion.div>
            </div>

            {/* Stats panel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: C.border }}>
                {[
                  { n: "62", label: "films produits" },
                  { n: "23", label: "ans d'existence" },
                  { n: "140+", label: "distinctions" },
                  { n: "18", label: "pays distribués" },
                ].map((stat, i) => (
                  <div key={stat.label} style={{ background: C.bgCard, padding: "2rem" }}>
                    <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "2.5rem", fontWeight: 900, color: i % 2 === 0 ? C.amber : C.text, letterSpacing: "-0.03em" }}>
                      {stat.n}
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.15em", color: C.textDim, marginTop: "0.25rem" }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Ticker ─────────────────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "0.75rem 0", background: C.bgCard }}>
        <Marquee items={TICKER_ITEMS} speed={25} />
      </div>

      {/* ── Additional Home Section (Ethos / Quick navigation) ────────── */}
      <section style={{ padding: "8rem 3rem", background: C.bg }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: C.amber, marginBottom: "1.5rem" }}>
            NOTRE MISSION
          </div>
          <h2 style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "-0.03em", color: C.text, marginBottom: "2rem", lineHeight: 1.15, paddingBottom: "0.15em" }}>
            Une écriture cinématographique sans concession.
          </h2>
          <p style={{ fontSize: "1.05rem", color: C.textMuted, lineHeight: 1.8, maxWidth: "60ch", margin: "0 auto 3rem" }}>
            Depuis plus de deux décennies, nous accompagnons des réalisateurs audacieux et des récits porteurs de sens. De la recherche de financement à la diffusion internationale, nous défendons une vision indépendante et passionnée du septième art.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
            <Link href="/templates/impact-72/films" style={{ textDecoration: "none" }}>
              <span style={{ color: C.amber, fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.05em" }}>VOIR NOS FILMS →</span>
            </Link>
            <Link href="/templates/impact-72/studio" style={{ textDecoration: "none" }}>
              <span style={{ color: C.text, fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.05em" }}>DÉCOUVRIR LE STUDIO →</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
