"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { C, StatNumber, SectionLabel, OrbitalComplication, HERITAGE, PRESS, AWARDS } from "./shared";

export default function MaisonDrouetHome() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  return (
    <div
      ref={containerRef}
      style={{
        background: C.bg,
        color: C.text,
        minHeight: "100vh",
      }}
    >
      {/* Hero */}
      <section
        ref={heroRef}
        style={{
          minHeight: "90vh",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <motion.div style={{ y: heroY, opacity: heroOpacity, padding: "4rem 3rem 4rem clamp(2rem, 6vw, 6rem)" }}>
          <SectionLabel>Horlogerie Genevoise</SectionLabel>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(3rem, 7vw, 6.5rem)",
              fontWeight: 300,
              lineHeight: 1.15,
              paddingBottom: "0.15em",
              color: C.text,
              margin: "1.5rem 0",
              letterSpacing: "-0.02em",
            }}
          >
            Le Temps<br />
            <em style={{ color: C.gold, fontStyle: "italic" }}>Comme</em><br />
            Philosophie
          </h1>
          <p
            style={{
              fontSize: "1.15rem",
              color: C.textMuted,
              lineHeight: 1.75,
              maxWidth: "42ch",
              marginBottom: "2.5rem",
            }}
          >
            Depuis 1891, la Maison Drouet perpétue à Genève l'art de la Haute Horlogerie.
            Chaque montre est une déclaration — contre la hâte, pour la permanence.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/templates/impact-63/collections" style={{ textDecoration: "none" }}>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02, backgroundColor: C.goldLight }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: C.gold,
                  color: C.bg,
                  border: "none",
                  padding: "0.85rem 2rem",
                  fontFamily: "'Cormorant SC', serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.2em",
                  cursor: "pointer",
                  transition: "background 0.3s",
                }}
              >
                DÉCOUVRIR LES COLLECTIONS
              </motion.button>
            </Link>
            <Link href="/templates/impact-63/atelier" style={{ textDecoration: "none" }}>
              <motion.button
                type="button"
                whileHover={{ borderColor: C.gold, color: C.gold }}
                style={{
                  background: "transparent",
                  color: C.textMuted,
                  border: `1px solid ${C.border}`,
                  padding: "0.85rem 2rem",
                  fontFamily: "'Cormorant SC', serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.2em",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              >
                BESPOKE
              </motion.button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ padding: "4rem 4rem 4rem 2rem", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div style={{ width: "min(420px, 90%)", aspectRatio: "1" }}>
            <OrbitalComplication scrollYProgress={scrollYProgress} />
          </div>
        </motion.div>

        <div style={{ position: "absolute", top: "5rem", left: "3rem", fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textDim }}>
          GENÈVE · SUISSE
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "5rem clamp(2rem, 6vw, 6rem)", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.bgSection }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
          <StatNumber value="133" label="Années d'histoire" />
          <StatNumber value="23" label="Maîtres-horlogers" />
          <StatNumber value="4,200" label="Pièces par an" />
          <StatNumber value="47" label="Distinctions" />
        </div>
      </section>

      {/* Heritage timeline */}
      <section style={{ padding: "8rem clamp(2rem, 6vw, 6rem)", background: C.bgSection, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "5rem" }}>
            <SectionLabel>Notre Patrimoine</SectionLabel>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: C.text, lineHeight: 1.15, paddingBottom: "0.15em" }}>
              133 Ans<br /><em style={{ color: C.gold }}>de Continuité</em>
            </h2>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: "6rem", top: 0, bottom: 0, width: "1px", background: `linear-gradient(180deg, transparent, ${C.border} 10%, ${C.border} 90%, transparent)` }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {HERITAGE.map((event, i) => {
                const ref = useRef<HTMLDivElement>(null);
                const inView = useInView(ref, { once: true, margin: "-100px" });
                return (
                  <motion.div
                    key={event.year}
                    ref={ref}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: "grid", gridTemplateColumns: "6rem 1fr", gap: "3rem", paddingBottom: "3.5rem", paddingTop: "0.5rem", position: "relative" }}
                  >
                    <div style={{ textAlign: "right", paddingRight: "1.5rem" }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 500, color: C.gold }}>{event.year}</div>
                      <div style={{ position: "absolute", left: "calc(6rem - 3px)", top: "0.4rem", width: "7px", height: "7px", borderRadius: "50%", background: C.gold, border: `2px solid ${C.bgSection}` }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 500, color: C.text, marginBottom: "0.5rem" }}>{event.title}</div>
                      <p style={{ fontSize: "1rem", color: C.textMuted, lineHeight: 1.75, maxWidth: "60ch" }}>{event.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Press */}
      <section style={{ padding: "8rem clamp(2rem, 6vw, 6rem)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <SectionLabel>Presse & Distinctions</SectionLabel>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: C.text, lineHeight: 1.15, paddingBottom: "0.15em" }}>
              Ce Que l'On Dit<br /><em style={{ color: C.gold }}>de Drouet</em>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", background: C.border, marginBottom: "4rem" }}>
            {PRESS.map((item, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true });
              return (
                <motion.div
                  key={i}
                  ref={ref}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  style={{ background: C.bg, padding: "2.5rem" }}
                >
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: C.goldDim, lineHeight: 1, marginBottom: "1rem" }}>&quot;</div>
                  <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1rem", fontStyle: "italic", color: C.text, lineHeight: 1.75, marginBottom: "1.5rem" }}>{item.quote}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "1.5rem", height: "1px", background: C.goldDim }} />
                    <div>
                      <div style={{ fontSize: "0.8rem", color: C.text }}>{item.author}</div>
                      <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: C.textMuted }}>{item.outlet} · {item.year}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap", paddingTop: "3rem", borderTop: `1px solid ${C.border}` }}>
            {AWARDS.map((award) => (
              <div key={award} style={{ textAlign: "center" }}>
                <div style={{ width: "2px", height: "1.5rem", background: C.goldDim, margin: "0 auto 0.75rem" }} />
                <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: C.textMuted }}>{award}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
