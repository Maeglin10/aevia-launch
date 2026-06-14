"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import {
  C,
  F,
  STATS,
  Reveal,
  NeonDivider,
  SectionLabel,
  GlitchHeadline,
} from "./shared";

export default function Impact52Page() {
  const [tick, setTick] = useState(0);

  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 700], [0, 100]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 80);
    return () => clearInterval(id);
  }, []);

  const glitchChars = "!@#$%^&*<>?/|\\[]{}";
  const heroWord = "PARTICLE";
  const glitchedWord =
    tick % 40 < 3
      ? heroWord
          .split("")
          .map((c) =>
            Math.random() > 0.7
              ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
              : c
          )
          .join("")
      : heroWord;

  return (
    <div className="text-white">
      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: C.BG,
          overflow: "hidden",
          padding: "0 1.5rem",
        }}
      >
        {/* Animated grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(${C.CYAN}10 1px, transparent 1px), linear-gradient(90deg, ${C.CYAN}10 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            pointerEvents: "none",
            animation: "hero-grid-pulse 4s ease-in-out infinite",
          }}
        />

        {/* Deep radial glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "900px",
            height: "900px",
            background: `radial-gradient(ellipse, ${C.PINK}1a 0%, ${C.PURPLE}0d 40%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        {/* Corner brackets */}
        {(["topLeft", "topRight", "bottomLeft", "bottomRight"] as const).map(
          (corner) => {
            const pos = {
              top: corner.startsWith("top") ? "2rem" : undefined,
              bottom: corner.startsWith("bottom") ? "2rem" : undefined,
              left: corner.endsWith("Left") ? "2rem" : undefined,
              right: corner.endsWith("Right") ? "2rem" : undefined,
            };
            const borders = {
              borderTop: corner.startsWith("top") ? `2px solid ${C.CYAN}` : undefined,
              borderBottom: corner.startsWith("bottom")
                ? `2px solid ${C.CYAN}`
                : undefined,
              borderLeft: corner.endsWith("Left") ? `2px solid ${C.CYAN}` : undefined,
              borderRight: corner.endsWith("Right")
                ? `2px solid ${C.CYAN}`
                : undefined,
            };
            return (
              <motion.div
                key={corner}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                style={{
                  position: "absolute",
                  ...pos,
                  width: "44px",
                  height: "44px",
                  ...borders,
                  boxShadow: `0 0 10px ${C.CYAN}66`,
                }}
              />
            );
          }
        )}

        {/* Status bar top */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            position: "absolute",
            top: "6rem",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "0.55rem",
            fontFamily: F.mono,
            color: `${C.CYAN}77`,
            letterSpacing: "0.35em",
            whiteSpace: "nowrap",
          }}
        >
          [SYS:ONLINE] &nbsp;|&nbsp; NODE_ID: PF_BERLIN_01 &nbsp;|&nbsp;
          UPTIME: 99.97%
        </motion.div>

        <motion.div
          style={{ y: parallaxY, opacity, textAlign: "center", zIndex: 10 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontSize: "0.58rem",
              fontFamily: F.mono,
              fontWeight: 700,
              letterSpacing: "0.4em",
              color: `${C.CYAN}88`,
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.8rem",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: C.CYAN,
                boxShadow: `0 0 8px ${C.CYAN}`,
              }}
            />
            CYBERPUNK_CREATIVE_STUDIO &nbsp;//&nbsp; EST. 2019
            <span
              style={{
                display: "inline-block",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: C.PINK,
                boxShadow: `0 0 8px ${C.PINK}`,
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <div
              style={{
                fontSize: "clamp(4.5rem, 15vw, 13rem)",
                fontFamily: F.mono,
                fontWeight: 900,
                lineHeight: 0.82,
                color: C.PINK,
                textShadow: `0 0 30px ${C.PINK}, 0 0 80px ${C.PINK}55`,
                letterSpacing: "-0.03em",
              }}
            >
              {glitchedWord}
            </div>
            <div
              style={{
                fontSize: "clamp(4.5rem, 15vw, 13rem)",
                fontFamily: F.mono,
                fontWeight: 900,
                lineHeight: 0.82,
                color: "transparent",
                WebkitTextStroke: `2px ${C.CYAN}`,
                textShadow: `0 0 30px ${C.CYAN}44`,
                letterSpacing: "-0.03em",
                marginBottom: "1.5rem",
              }}
            >
              FIELD
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            style={{
              fontSize: "0.72rem",
              fontFamily: F.mono,
              letterSpacing: "0.18em",
              color: `${C.PINK}bb`,
              maxWidth: "500px",
              margin: "0 auto 3.5rem",
              lineHeight: 2,
              textShadow: `0 0 12px ${C.PINK}33`,
            }}
          >
            WE_BUILD_DIGITAL_FUTURES.EXE // NEON-GRADE DESIGN SYSTEMS,
            BYTE-PERFECT ARCHITECTURE, SIGNAL-DARK ENGINEERING.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1.2rem",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/templates/impact-52/services"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "1rem 2.2rem",
                background: C.PINK,
                color: C.BG,
                fontFamily: F.mono,
                fontWeight: 900,
                fontSize: "0.68rem",
                letterSpacing: "0.22em",
                textDecoration: "none",
                boxShadow: `0 0 24px ${C.PINK}, 0 0 50px ${C.PINK}44`,
              }}
            >
              ENTER THE GRID <ArrowRight size={14} />
            </Link>
            <Link
              href="/templates/impact-52/portfolio"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "1rem 2.2rem",
                background: "transparent",
                color: C.CYAN,
                fontFamily: F.mono,
                fontWeight: 700,
                fontSize: "0.68rem",
                letterSpacing: "0.22em",
                textDecoration: "none",
                border: `1px solid ${C.CYAN}66`,
                boxShadow: `0 0 14px ${C.CYAN}33`,
              }}
            >
              VIEW WORKS
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATISTICS / HUD ──────────────────────────────────────────────── */}
      <section
        style={{
          background: C.BG,
          padding: "6rem 2rem",
          borderTop: `1px solid ${C.CYAN}15`,
        }}
      >
        <NeonDivider color={C.CYAN} />
        <div style={{ maxWidth: "1280px", margin: "0 auto", paddingTop: "6rem" }}>
          <Reveal>
            <div style={{ marginBottom: "4rem" }}>
              <SectionLabel code="[MODULE: METRICS.LOG]" color={C.CYAN} />
              <GlitchHeadline text="THE MATRIX" outlineText="STATS" outlineColor={C.PINK} />
            </div>
          </Reveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2rem",
            }}
          >
            {STATS.map((stat, idx) => (
              <Reveal key={idx} delay={idx * 0.08}>
                <div
                  style={{
                    background: C.CARD_BG,
                    border: `1px solid ${stat.color}22`,
                    borderRadius: "1rem",
                    padding: "3rem 2rem",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      bottom: 0,
                      width: "3px",
                      background: stat.color,
                      boxShadow: `0 0 10px ${stat.color}`,
                    }}
                  />
                  <div
                    style={{
                      fontSize: "3.5rem",
                      fontWeight: 900,
                      color: stat.color,
                      fontFamily: F.mono,
                      lineHeight: 1,
                      marginBottom: "0.5rem",
                      textShadow: `0 0 14px ${stat.color}55`,
                    }}
                  >
                    {stat.value}
                    <span style={{ fontSize: "1.5rem" }}>{stat.unit}</span>
                  </div>
                  <div
                    style={{
                      fontSize: "0.65rem",
                      fontFamily: F.mono,
                      color: "#6666aa",
                      letterSpacing: "0.25em",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
