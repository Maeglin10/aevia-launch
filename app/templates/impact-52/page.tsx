"use client";
// @ts-nocheck

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


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Impact52Page() {
  const [session, setSession] = useState<{
    formData?: {
      businessName?: string; businessType?: string; tagline?: string;
      city?: string; mainService?: string; benefits?: string[];
      priceRange?: string; targetAudience?: string; brandColor?: string;
      email?: string; phone?: string; instagram?: string; linkedin?: string;
    };
    generatedContent?: {
      heroHeadline?: string; heroSubline?: string; aboutTitle?: string;
      aboutText?: string; ctaText?: string; metaTitle?: string;
      metaDescription?: string;
      services?: { title?: string; description?: string }[];
      testimonials?: { name?: string; role?: string; text?: string; rating?: number }[];
    };
  } | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  c = session?.generatedContent;
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const [tick, setTick] = useState(0);

  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 700], [0, 100]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 80);
    
  // Dynamic Services & Testimonials Mutation for Session Data
  useEffect(() => {
    if (c?.services) {
      const services_arrays = [
        typeof SERVICES !== 'undefined' ? SERVICES : null,
        typeof features !== 'undefined' ? features : null,
        typeof services !== 'undefined' ? services : null,
        typeof FEATURES !== 'undefined' ? FEATURES : null,
      ];
      services_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((s, idx) => {
            if (idx < 3 && c.services[idx]) {
              if (s && typeof s === 'object') {
                s.title = c.services[idx].title ?? s.title;
                if ('desc' in s) s.desc = c.services[idx].description ?? s.desc;
                if ('description' in s) s.description = c.services[idx].description ?? s.description;
              }
            }
          });
        }
      });
    }
    if (c?.testimonials) {
      const testimonials_arrays = [
        typeof TESTIMONIALS !== 'undefined' ? TESTIMONIALS : null,
        typeof testimonials !== 'undefined' ? testimonials : null,
        typeof REVIEWS !== 'undefined' ? REVIEWS : null,
        typeof reviews !== 'undefined' ? reviews : null,
      ];
      testimonials_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((t, idx) => {
            if (idx < 3 && c.testimonials[idx]) {
              if (t && typeof t === 'object') {
                t.name = c.testimonials[idx].name ?? t.name;
                if ('role' in t) t.role = c.testimonials[idx].role ?? t.role;
                if ('text' in t) t.text = c.testimonials[idx].text ?? t.text;
                if ('quote' in t) t.quote = c.testimonials[idx].text ?? t.quote;
                if ('desc' in t) t.desc = c.testimonials[idx].text ?? t.desc;
              }
            }
          });
        }
      });
    }
  }, [c]);
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
          >{c?.aboutText ?? <>
            WE_BUILD_DIGITAL_FUTURES.EXE // NEON-GRADE DESIGN SYSTEMS,
            BYTE-PERFECT ARCHITECTURE, SIGNAL-DARK ENGINEERING.
          </>}</motion.p>

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
                    style={{fontSize: "0.65rem",
                      fontFamily: F.mono,
                      color: brand ?? '#6666aa',
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
      {/* ── SERVICES ──────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "#03030d",
          padding: "8rem 2rem",
          borderTop: `1px solid ${C.CYAN}15`,
        }}
      >
        <NeonDivider color={C.PINK} />
        <div style={{ maxWidth: "1280px", margin: "0 auto", paddingTop: "6rem" }}>
          <Reveal>
            <div style={{ marginBottom: "4rem" }}>
              <SectionLabel code="[MODULE: SERVICES.EXE]" color={C.PINK} />
              <GlitchHeadline text="THE" outlineText="STACK" outlineColor={C.CYAN} />
            </div>
          </Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2px",
              background: `${C.CYAN}12`,
            }}
          >
            {[
              { code: "01", title: "Design Systems", color: C.CYAN, desc: "Token-based, component-first systems engineered to scale across 100+ screens without losing coherence. Zero-drift guarantees." },
              { code: "02", title: "Creative Direction", color: C.PINK, desc: "Brand DNA distilled into visual language. We set the aesthetic laws so your teams never have to guess what 'on-brand' means." },
              { code: "03", title: "Motion & Film", color: C.PURPLE, desc: "Identity animation, brand films, scroll-driven experiences. We direct, produce, and deliver in WebGL, Lottie, or Cinema 4D." },
              { code: "04", title: "WebGL Environments", color: C.CYAN, desc: "Three.js and WebGL scenes that turn product pages into immersive brand moments. 60fps on any device, any browser." },
              { code: "05", title: "Brand Architecture", color: C.PINK, desc: "Multi-brand hierarchies, naming systems, and sub-brand structures built for scale without cannibalization." },
              { code: "06", title: "AI Creative", color: C.PURPLE, desc: "LoRA fine-tuning, diffusion pipelines, and AI-assisted workflows integrated into your production stack." },
            ].map((s) => (
              <Reveal key={s.code}>
                <div
                  style={{
                    background: C.BG,
                    padding: "3.5rem 2.5rem",
                    position: "relative",
                    borderBottom: `1px solid ${s.color}18`,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = C.CARD_BG)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = C.BG)}
                >
                  <div style={{ position: "absolute", top: 0, left: 0, width: "3px", height: "100%", background: s.color, boxShadow: `0 0 12px ${s.color}` }} />
                  <div style={{ fontFamily: F.mono, fontSize: "0.6rem", color: `${s.color}66`, letterSpacing: "0.35em", marginBottom: "1.25rem" }}>{s.code} //</div>
                  <h3 style={{ fontFamily: F.mono, fontWeight: 900, fontSize: "1rem", color: "white", letterSpacing: "0.04em", marginBottom: "0.75rem", textTransform: "uppercase" }}>{s.title}</h3>
                  <p style={{fontFamily: F.mono, fontSize: "0.72rem", color: brand ?? '#6666aa', lineHeight: 1.85, letterSpacing: "0.03em" }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ─────────────────────────────────────────────────────── */}
      <section
        style={{
          background: C.BG,
          padding: "8rem 2rem",
          borderTop: `1px solid ${C.PINK}15`,
        }}
      >
        <NeonDivider color={C.PURPLE} />
        <div style={{ maxWidth: "1280px", margin: "0 auto", paddingTop: "6rem" }}>
          <Reveal>
            <div style={{ marginBottom: "4rem" }}>
              <SectionLabel code="[MODULE: PORTFOLIO.LOG]" color={C.PURPLE} />
              <GlitchHeadline text="SELECTED" outlineText="WORKS" outlineColor={C.PINK} />
            </div>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: `${C.PURPLE}18` }}>
            {[
              { id: "PF::0049", title: "SYNTH_PROTOCOL", cat: "WebGL · Brand System", client: "[REDACTED_EU]", year: "2025" },
              { id: "PF::0041", title: "NEON_CATHEDRAL", cat: "Creative Direction · Film", client: "AXIOM_RECORDS", year: "2025" },
              { id: "PF::0033", title: "GHOST_UI", cat: "Design System · Motion", client: "[STEALTH_MODE]", year: "2024" },
              { id: "PF::0027", title: "CIVIC_VIRUS", cat: "AI Creative · Campaign", client: "BUREAU_K", year: "2024" },
            ].map((w, i) => (
              <Reveal key={w.id} delay={i * 0.06}>
                <div
                  style={{
                    background: C.CARD_BG,
                    padding: "2rem 2.5rem",
                    display: "grid",
                    gridTemplateColumns: "140px 1fr 200px 80px",
                    gap: "2rem",
                    alignItems: "center",
                    borderBottom: `1px solid ${C.CYAN}10`,
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = `${C.PINK}08`)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = C.CARD_BG)}
                >
                  <span style={{ fontFamily: F.mono, fontSize: "0.6rem", color: `${C.CYAN}55`, letterSpacing: "0.1em" }}>{w.id}</span>
                  <h3 style={{ fontFamily: F.mono, fontWeight: 900, fontSize: "1.1rem", color: C.PINK, textShadow: `0 0 12px ${C.PINK}44`, letterSpacing: "0.04em" }}>{w.title}</h3>
                  <span style={{fontFamily: F.mono, fontSize: "0.65rem", color: brand ?? '#6666aa', letterSpacing: "0.08em" }}>{w.cat}</span>
                  <span style={{ fontFamily: F.mono, fontSize: "0.65rem", color: "#333366" }}>{w.year}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "#03030d",
          padding: "10rem 2rem",
          borderTop: `1px solid ${C.PINK}20`,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "800px",
            height: "500px",
            background: `radial-gradient(ellipse, ${C.PURPLE}0d 0%, ${C.PINK}06 40%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", maxWidth: "700px", margin: "0 auto" }}>
          <Reveal>
            <SectionLabel code="[MODULE: CONTACT.INIT]" color={C.CYAN} />
            <GlitchHeadline text="START THE" outlineText="PROTOCOL" outlineColor={C.PINK} />
            <p
              style={{
                fontFamily: F.mono,
                fontSize: "0.72rem",
                color: `${C.CYAN}55`,
                lineHeight: 2,
                letterSpacing: "0.18em",
                maxWidth: "480px",
                margin: "0 auto 3.5rem",
                marginTop: "2rem",
              }}
            >
              WE_TAKE_4_CLIENTS_PER_QUARTER. IF_YOUR_BRIEF_HAS_VOLTAGE, SEND_TRANSMISSION.
            </p>
            <Link
              href="/templates/impact-52/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "1.1rem 2.8rem",
                background: C.PINK,
                color: C.BG,
                fontFamily: F.mono,
                fontWeight: 900,
                fontSize: "0.72rem",
                letterSpacing: "0.25em",
                textDecoration: "none",
                boxShadow: `0 0 28px ${C.PINK}, 0 0 60px ${C.PINK}44`,
                textTransform: "uppercase" as const,
              }}
            >
              ENTER_CONTACT.EXE <Zap size={14} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
