"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { C, STATS, OrbitCenter, AnimatedCounter } from "./shared";

import "../premium.css";

export default function OrbitHomePage() {
  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "80vh" }}>
      {/* ─── HERO ────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: "85vh",
          display: "flex",
          alignItems: "center",
          padding: "120px 40px 80px",
          overflow: "hidden",
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(${C.border} 1px, transparent 1px),
              linear-gradient(90deg, ${C.border} 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            opacity: 0.3,
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "1300px", margin: "0 auto", width: "100%" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "80px",
              alignItems: "center",
              width: "100%",
            }}
            className="grid-hero-68"
          >
            {/* Left — headline */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  color: C.accent,
                  textTransform: "uppercase",
                  marginBottom: "28px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "32px",
                    height: "1px",
                    background: C.accent,
                  }}
                />
                Branding Studio · Paris
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(52px, 7vw, 96px)",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.15,
                  color: C.text,
                  marginBottom: "32px",
                  paddingBottom: "0.15em",
                }}
              >
                Brands that
                <br />
                <span style={{ color: C.accent }}>shift</span>
                <br />
                perception.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(15px, 1.4vw, 18px)",
                  lineHeight: 1.7,
                  color: C.textMuted,
                  maxWidth: "480px",
                  marginBottom: "48px",
                }}
              >
                We build identity systems for ambitious companies — from seed-stage startups to century-old maisons. Strategy, visual identity, and art direction that makes the right people stop scrolling.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}
              >
                <Link
                  href="/templates/impact-68/work"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    color: C.white,
                    background: C.accent,
                    padding: "16px 32px",
                    textDecoration: "none",
                    borderRadius: "2px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "transform 0.15s, background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "scale(0.97)";
                    (e.currentTarget as HTMLElement).style.background = C.accentDark;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                    (e.currentTarget as HTMLElement).style.background = C.accent;
                  }}
                >
                  View Our Work
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/templates/impact-68/contact"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                    color: C.textMuted,
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = C.text)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = C.textMuted)}
                >
                  Get in touch
                  <ArrowRight size={14} />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.8 }}
                style={{
                  marginTop: "64px",
                  paddingTop: "32px",
                  borderTop: `1px solid ${C.border}`,
                  display: "flex",
                  gap: "40px",
                }}
              >
                {["94 projects", "12 countries", "Est. 2015"].map((tag) => (
                  <div
                    key={tag}
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: C.textMuted,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {tag}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — Orbit signature element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.25, 0, 0, 1] }}
            >
              <OrbitCenter />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={20} style={{ color: C.textMuted }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ background: C.bgAlt, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "80px 40px",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0",
          }}
          className="grid-stats-68"
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding: "24px",
                borderRight: i < 3 ? `1px solid ${C.border}` : "none",
                textAlign: "left",
              }}
              className="border-right-none-68"
            >
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(32px, 4vw, 48px)",
                  fontWeight: 700,
                  color: C.accent,
                  letterSpacing: "-0.02em",
                  marginBottom: "8px",
                }}
              >
                {stat.prefix}
                <AnimatedCounter value={stat.value} />
                {stat.suffix}
              </div>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: C.text,
                  letterSpacing: "0.05em",
                  marginBottom: "4px",
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "12px",
                  color: C.textMuted,
                }}
              >
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
