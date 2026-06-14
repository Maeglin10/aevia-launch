"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { C, MaskedTitle, Reveal } from "./shared";

export default function MaskUnitHome() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

  const heroScale = useTransform(heroScroll, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          height: "calc(100vh - 60px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "3rem",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Massive background text */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            scale: heroScale,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(8rem, 22vw, 20rem)",
            fontWeight: 700,
            color: "#0A0A0A",
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
            textAlign: "center",
          }}>
            MASK<br />UNIT
          </div>
        </motion.div>

        {/* Top left counter */}
        <div style={{ position: "absolute", top: "2rem", left: "3rem" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: C.textDim, letterSpacing: "0.2em" }}>
            CREATIVE STUDIO
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: C.textDim, marginTop: "0.25rem" }}>
            EST. 2012 · PARIS
          </div>
        </div>

        {/* Top right */}
        <div style={{ position: "absolute", top: "2rem", right: "3rem", textAlign: "right" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: C.textDim }}>
            AWWWARDS SOTD ×38
          </div>
        </div>

        {/* Bottom content */}
        <motion.div
          style={{ position: "relative", zIndex: 1, opacity: heroOpacity }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "flex-end" }} className="grid grid-cols-1 md:grid-cols-2">
            <div>
              <h1
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(2rem, 4.5vw, 4rem)",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  letterSpacing: "-0.03em",
                  color: C.text,
                  marginBottom: "1.5rem",
                }}
              >
                <MaskedTitle text="We Build" delay={0.3} />
                <MaskedTitle text="Brands That" delay={0.4} />
                <span style={{ color: C.accent }}>
                  <MaskedTitle text="Break Rules." delay={0.5} />
                </span>
              </h1>
              <p
                style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.85rem", color: C.textMuted, lineHeight: 1.8, maxWidth: "45ch" }}
              >
                Studio créatif spécialisé dans les identités de marque disruptives, le motion design et les expériences digitales immersives.
              </p>
            </div>
            <div style={{ textAlign: "right" }} className="text-left md:text-right">
              <div
                style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-end" }}
                className="items-start md:items-end"
              >
                <Link
                  href="/templates/impact-57/work"
                  style={{
                    background: C.accent,
                    color: C.bg,
                    border: "none",
                    padding: "1rem 2.5rem",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "none",
                    transition: "background 0.3s",
                    display: "inline-block"
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = C.accentAlt}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = C.accent}
                >
                  SEE OUR WORK →
                </Link>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: C.textDim }}>
                  Available for Q3 2025
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
