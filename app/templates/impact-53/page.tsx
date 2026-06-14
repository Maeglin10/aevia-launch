"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  C,
  FONT_SYNE,
  FONT_MONO,
  PROJECTS,
  STATS,
  HeroWordReveal,
  MarqueeBelt,
  MagneticCTA,
  ProjectAccordion,
  StatCounter,
  SectionLabel,
  SectionHeading,
} from "./shared";

export default function Impact53Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div
      ref={containerRef}
      style={{
        background: C.black,
        color: C.white,
        fontFamily: FONT_SYNE,
      }}
    >
      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: C.black,
          overflow: "hidden",
          padding: "0 2.5rem",
        }}
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity, textAlign: "left", zIndex: 10, width: "100%", maxWidth: "1280px" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontSize: "0.58rem",
              fontFamily: FONT_MONO,
              fontWeight: 700,
              letterSpacing: "0.4em",
              color: C.red,
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
            }}
          >
            CREATIVE ARCHITECTURE STUDIO &nbsp;//&nbsp; EST. 2019
          </motion.div>

          <div style={{ marginBottom: "2rem" }}>
            <HeroWordReveal />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            style={{
              fontSize: "0.85rem",
              fontFamily: FONT_MONO,
              letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.45)",
              maxWidth: "500px",
              margin: "0 0 3.5rem",
              lineHeight: 1.8,
            }}
          >
            WE ARE A HIGH-CONTRAST CREATIVE STUDIO. WE ARCHITECT DIGITAL SYSTEMS,
            BRAND IDENTITIES, AND EXPERIMENTAL FRONT-END BELTS.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <MagneticCTA />
          </motion.div>
        </motion.div>
      </section>

      {/* ── ROTATING MARQUEE BELT ────────────────────────────────────────── */}
      <MarqueeBelt />

      {/* ── SELECTED WORKS (ACCORDION) ────────────────────────────────────── */}
      <section
        id="work"
        style={{
          background: C.black,
          padding: "8rem 0",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2.5rem" }}>
          <div style={{ marginBottom: "5rem" }}>
            <SectionLabel>SELECTED PORTFOLIO</SectionLabel>
            <SectionHeading>PROJECTS</SectionHeading>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${C.dim}` }}>
          {PROJECTS.map((project) => (
            <ProjectAccordion key={project.num} project={project} />
          ))}
        </div>
      </section>

      {/* ── STATISTICS / NUMBERS ─────────────────────────────────────────── */}
      <section
        style={{
          background: C.black,
          borderTop: `1px solid ${C.dim}`,
          borderBottom: `1px solid ${C.dim}`,
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
          className="grid grid-cols-1 md:grid-cols-4"
        >
          {STATS.map((stat, idx) => (
            <StatCounter key={stat.label} stat={stat} index={idx} />
          ))}
        </div>
      </section>
    </div>
  );
}
