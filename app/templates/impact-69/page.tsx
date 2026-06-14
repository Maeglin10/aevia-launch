"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { C, TextReveal, MagneticButton, MarqueeStrip, DepthLayers, CountUp, PRESS } from "./shared";

export default function LeaHomePage() {
  const [activePress, setActivePress] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.7], [1, 0]);

  return (
    <div style={{ background: C.bg, color: C.cream, minHeight: "80vh" }}>
      {/* ── Hero ── */}
      <section ref={heroRef} style={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {/* Parallax bg */}
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(74,103,65,0.12) 0%, transparent 70%)" }} />
          {/* Floating particles */}
          {[...Array(18)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                left: `${8 + (i * 53) % 85}%`,
                top: `${10 + (i * 37) % 75}%`,
                width: i % 3 === 0 ? 2 : 1,
                height: i % 3 === 0 ? 2 : 1,
                borderRadius: "50%",
                background: i % 4 === 0 ? C.amber : C.moss,
                opacity: 0.25 + (i % 4) * 0.1,
              }}
              animate={{ y: [-8, 8, -8], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            />
          ))}
        </motion.div>

        <motion.div style={{ opacity: heroOpacity, position: "relative", zIndex: 1, textAlign: "center", maxWidth: 900, padding: "0 24px" }}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.4em", color: C.moss, textTransform: "uppercase", marginBottom: 32 }}
          >
            Nature Photography · Fine Art Prints
          </motion.p>

          <h1 style={{ fontSize: "clamp(52px, 9vw, 120px)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: 40, color: C.cream, paddingBottom: "0.15em" }}>
            <TextReveal text="Finding" delay={0.3} style={{ display: "block" }} />
            <TextReveal text="depth" delay={0.5} style={{ display: "block", color: C.amber }} />
            <TextReveal text="in stillness." delay={0.7} style={{ display: "block", color: C.moss }} />
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, color: C.muted, lineHeight: 1.7, maxWidth: 540, margin: "0 auto 48px", fontWeight: 300 }}
          >
            Documentary and fine art landscapes from the world's most remote wilderness areas. Limited edition prints, each signed and numbered.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center" }}
          >
            <Link href="/templates/impact-69/work" style={{ textDecoration: "none" }}>
              <MagneticButton style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.bg, background: C.cream, padding: "14px 32px", borderRadius: 2, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
                View Series
              </MagneticButton>
            </Link>
            <Link href="/templates/impact-69/prints" style={{ textDecoration: "none" }}>
              <MagneticButton style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.cream, background: "transparent", padding: "14px 32px", borderRadius: 2, letterSpacing: "0.1em", textTransform: "uppercase", border: `1px solid ${C.border}`, fontWeight: 400 }}>
                Shop Prints
              </MagneticButton>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)" }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </section>

      {/* ── Marquee ── */}
      <MarqueeStrip />

      {/* ── Depth Layers — Signature Element ── */}
      <section style={{ padding: "80px 0", maxWidth: 1200, margin: "0 auto", paddingInline: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", marginBottom: 64 }} className="grid-hero-68">
          <div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.35em", color: C.moss, textTransform: "uppercase", marginBottom: 20 }}>Depth Perception</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24, color: C.cream }}>
              <TextReveal text="Three planes," />
              <TextReveal text="one frame." delay={0.15} />
            </h2>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.75, fontWeight: 300, maxWidth: 380 }}>
              Every composition is built in layers — the intimate foreground, the story-telling midground, and the expansive background. Move your cursor across the scene to experience how depth creates presence.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { label: "Years active", val: 12, suffix: "" },
              { label: "Countries", val: 34, suffix: "+" },
              { label: "Limited prints", val: 280, suffix: "" },
              { label: "Exhibitions", val: 24, suffix: "" },
            ].map(stat => (
              <div key={stat.label} style={{ padding: "24px", background: C.bgCard, borderRadius: 4, border: `1px solid ${C.border}`, textAlign: "left" }}>
                <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: 36, fontWeight: 900, color: C.amber, letterSpacing: "-0.03em", lineHeight: 1 }}>
                  <CountUp target={stat.val} suffix={stat.suffix} />
                </p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.muted, marginTop: 8, letterSpacing: "0.05em" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <DepthLayers />
      </section>

      {/* ── Press ── */}
      <section style={{ padding: "80px 0", maxWidth: 900, margin: "0 auto", paddingInline: 32 }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.35em", color: C.moss, textTransform: "uppercase", marginBottom: 48, textAlign: "center" }}>Press</p>

        <div style={{ position: "relative", minHeight: 200 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activePress}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              style={{ textAlign: "center" }}
            >
              <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(18px, 3vw, 28px)", fontWeight: 300, lineHeight: 1.5, color: C.cream, marginBottom: 32, fontStyle: "italic" }}>
                "{PRESS[activePress].quote}"
              </p>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.amber, letterSpacing: "0.05em" }}>{PRESS[activePress].author}</p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.muted }}>{PRESS[activePress].source}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot nav */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 40 }}>
          {PRESS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActivePress(i)}
              style={{ width: i === activePress ? 24 : 8, height: 8, borderRadius: 4, background: i === activePress ? C.moss : C.bgMid, border: `1px solid ${i === activePress ? C.moss : C.border}`, cursor: "pointer", transition: "all 0.3s ease", padding: 0 }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
