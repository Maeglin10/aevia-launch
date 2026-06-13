"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown, Star } from "lucide-react";
import { C, stats, testimonials, NeedleAnimation } from "./shared";

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} id="hero" style={{ position: "relative", minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", overflow: "hidden" }}>
      <NeedleAnimation />

      <div style={{ position: "absolute", left: 0, top: 0, width: 3, height: "100%", background: `linear-gradient(to bottom, transparent, ${C.accent}, transparent)` }} />

      <motion.div style={{ y, opacity, position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "120px 24px 80px", width: "100%" }}>
        <div style={{ maxWidth: 720 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}
          >
            <div style={{ width: 40, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent, fontWeight: 600 }}>Paris — Studio de Tatouage Premium</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(52px, 8vw, 100px)", fontWeight: 700, color: C.white, lineHeight: 0.95, margin: "0 0 32px", letterSpacing: "-0.02em" }}
          >
            INK<br />
            <span style={{ color: C.accent }}>WORTH</span><br />
            WEARING
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{ fontFamily: "'Barlow', system-ui", fontSize: 18, color: C.textMuted, lineHeight: 1.7, maxWidth: 520, marginBottom: 48 }}
          >
            Noir Ink is Paris's premier fine line and blackwork studio. Two artists. Twelve years. Thousands of pieces built to outlast a lifetime.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
          >
            <Link href="/templates/impact-45/booking" style={{ textDecoration: "none" }}>
              <button
                style={{
                  background: C.accent,
                  color: C.white,
                  padding: "16px 36px",
                  fontSize: 13,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontFamily: "'Barlow', system-ui",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  border: "none",
                  cursor: "pointer"
                }}
                onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
                onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
              >
                Book Consultation <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/templates/impact-45/portfolio" style={{ textDecoration: "none" }}>
              <button
                style={{
                  border: `1px solid ${C.border}`,
                  color: C.textMuted,
                  background: "transparent",
                  padding: "16px 36px",
                  fontSize: 13,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontFamily: "'Barlow', system-ui",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.white; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}
              >
                View Portfolio
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            style={{ display: "flex", gap: 40, marginTop: 72, paddingTop: 40, borderTop: `1px solid ${C.border}`, flexWrap: "wrap" }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 28, fontWeight: 700, color: C.white }}>{s.value}</div>
                <div style={{ fontFamily: "'Barlow', system-ui", fontSize: 12, color: C.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
      >
        <div style={{ width: 1, height: 60, background: `linear-gradient(to bottom, ${C.accent}, transparent)` }} />
        <ChevronDown size={14} color={C.accent} />
      </motion.div>
    </section>
  );
}

export default function TattooStudioHome() {
  return (
    <main style={{ background: C.bg, minHeight: "100vh" }}>
      <HeroSection />

      {/* Artists overview Section */}
      <section style={{ background: C.bgAlt, padding: "120px 24px", borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent }}>The Artists</span>
            <div style={{ width: 32, height: 1, background: C.accent }} />
          </div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(36px, 5vw, 60px)", color: C.white, margin: "0 0 24px", fontWeight: 700 }}>Two Masters. One Studio.</h2>
          <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 16, color: C.textMuted, lineHeight: 1.7, marginBottom: 40, maxWidth: 540, margin: "0 auto 40px" }}>
            Mara Voss (Fine Line & Botanicals) and Théo Marchais (Blackwork & Dark Art) bring absolute dedication and elite craftsmanship to Paris.
          </p>
          <Link href="/templates/impact-45/artists" style={{ textDecoration: "none" }}>
            <button style={{ border: `1px solid ${C.accent}`, background: "transparent", color: C.white, padding: "14px 32px", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Barlow', system-ui", fontWeight: 700, cursor: "pointer" }}>
              Meet The Artists →
            </button>
          </Link>
        </div>
      </section>

      {/* Portfolio overview Section */}
      <section style={{ background: C.bg, padding: "120px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent }}>Portfolio Gallery</span>
            <div style={{ width: 32, height: 1, background: C.accent }} />
          </div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(36px, 5vw, 60px)", color: C.white, margin: "0 0 24px", fontWeight: 700 }}>Selected Works</h2>
          <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 16, color: C.textMuted, lineHeight: 1.7, marginBottom: 40, maxWidth: 540, margin: "0 auto 40px" }}>
            View our selected portfolio pieces across various tattoo formats, sizes, and orientations.
          </p>
          <Link href="/templates/impact-45/portfolio" style={{ textDecoration: "none" }}>
            <button style={{ border: `1px solid ${C.accent}`, background: "transparent", color: C.white, padding: "14px 32px", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Barlow', system-ui", fontWeight: 700, cursor: "pointer" }}>
              Explore Gallery →
            </button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ background: C.bgAlt, padding: "120px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 64, textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(32px, 4vw, 52px)", color: C.white, margin: 0, fontWeight: 700 }}>Client Testimonials</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="two-col">
            {testimonials.slice(0, 2).map((t) => (
              <div key={t.name} style={{ background: C.bgCard, padding: 40, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 20 }}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} fill={C.accent} color={C.accent} />
                  ))}
                </div>
                <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 16, color: C.text, lineHeight: 1.7, marginBottom: 24, fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: C.white, fontWeight: 600 }}>{t.name}</span>
                  <span style={{ fontFamily: "'Barlow', system-ui", fontSize: 11, color: C.accent, letterSpacing: "0.08em", textTransform: "uppercase", border: `1px solid ${C.borderAccent}`, padding: "3px 8px" }}>{t.style}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section style={{ background: C.bg, padding: "120px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(36px, 5vw, 60px)", color: C.white, margin: "0 0 24px", fontWeight: 700 }}>Start Your Project</h2>
          <p style={{ fontFamily: "'Barlow', system-ui", fontSize: 17, color: C.textMuted, lineHeight: 1.75, marginBottom: 40 }}>
            Ready to secure your spot with Mara or Théo? Request your consultation session today.
          </p>
          <Link href="/templates/impact-45/booking" style={{ textDecoration: "none" }}>
            <button style={{ background: C.accent, color: C.white, border: "none", padding: "18px 48px", fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Barlow', system-ui", fontWeight: 700, cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
              onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
            >
              Request Appointment
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
