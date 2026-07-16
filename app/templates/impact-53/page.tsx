"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react';
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


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Impact53Page() {
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

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  
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
          minHeight: "100dvh",
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
          >{c?.aboutText ?? <>
            WE ARE A HIGH-CONTRAST CREATIVE STUDIO. WE ARCHITECT DIGITAL SYSTEMS,
            BRAND IDENTITIES, AND EXPERIMENTAL FRONT-END BELTS.
          </>}</motion.p>

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
            gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
          }}
          className="grid grid-cols-1 md:grid-cols-4"
        >
          {STATS.map((stat, idx) => (
            <StatCounter key={stat.label} stat={stat} index={idx} />
          ))}
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section style={{ background: C.black, padding: "8rem 2.5rem", borderTop: `1px solid ${C.dim}` }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ marginBottom: "5rem" }}>
            <SectionLabel>WHAT WE DO</SectionLabel>
            <SectionHeading>SERVICES</SectionHeading>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "2px", background: C.dim }}>
            {[
              { code: "01", title: "Brand Identity Systems", desc: "We architect brands as living systems — visual languages that scale from a favicon to a billboard without losing their DNA. Logo, typography, motion language, editorial system." },
              { code: "02", title: "Digital Experience Design", desc: "High-contrast, high-performance web experiences. Micro-interactions, scroll-driven animations, WebGL environments — designed to arrest attention and convert intent." },
              { code: "03", title: "Creative Direction", desc: "For studios, labels, and founders who need vision without compromise. We embed in your team as a fractional creative director — strategy, art direction, production oversight." },
              { code: "04", title: "Front-End Engineering", desc: "We build what we design. React, Next.js, Three.js, GSAP — production-ready implementations with CI/CD, performance budgets, and accessibility baked in." },
              { code: "05", title: "Campaign Architecture", desc: "Multi-touchpoint campaign systems for product launches and cultural moments. We design the logic before the aesthetics: message architecture, channel mapping, content systems." },
              { code: "06", title: "Motion & Film", desc: "From identity animations to short-form films. We direct and produce motion content from concept to delivery — titles, brand films, social content series." },
            ].map((s, i) => (
              <div key={s.code} style={{ background: C.black, padding: "3rem 2.5rem", borderBottom: `1px solid ${C.dim}` }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: "0.6rem", color: C.red, letterSpacing: "0.3em", marginBottom: "1.5rem" }}>{s.code} //</div>
                <h3 style={{ fontFamily: FONT_SYNE, fontWeight: 800, fontSize: "1.1rem", color: "rgba(255,255,255,0.9)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>{s.title}</h3>
                <p style={{ fontFamily: FONT_MONO, fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.9, letterSpacing: "0.03em" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section style={{ background: C.black, padding: "8rem 2.5rem", borderTop: `1px solid ${C.dim}` }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ marginBottom: "5rem" }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: "0.6rem", color: C.red, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1rem" }}>CLIENT WORDS //</div>
            <h2 style={{ fontFamily: FONT_SYNE, fontWeight: 900, fontSize: "clamp(2.5rem,6vw,5rem)", color: C.white, textTransform: "uppercase", lineHeight: 0.95, letterSpacing: "-0.03em" }}>WHAT THEY<br />SAY.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "2px", background: C.dim }}>
            {[
              { quote: "They told us the concept was impossible. Void delivered it in 6 weeks. The brand now leads every category benchmark we track.", client: "CEO · Phantom Records", mark: "01" },
              { quote: "We briefed three agencies. Void came back with something that scared us a little — and then it became our most successful campaign to date.", client: "CMO · Atlas Ventures", mark: "02" },
              { quote: "The code they wrote is the first thing our engineers didn't immediately want to rewrite. That's the highest compliment in our stack.", client: "CTO · Nova Systems", mark: "03" },
            ].map((t) => (
              <div key={t.mark} style={{ background: C.black, padding: "3.5rem 2.5rem", borderBottom: `1px solid ${C.dim}` }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: "0.6rem", color: C.red, letterSpacing: "0.3em", marginBottom: "2rem" }}>{t.mark} //</div>
                <p style={{ fontFamily: FONT_MONO, fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.9, letterSpacing: "0.03em", marginBottom: "2rem", fontStyle: "italic" }}>&ldquo;{t.quote}&rdquo;</p>
                <div style={{ fontFamily: FONT_SYNE, fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{t.client}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENTS ──────────────────────────────────────────────────────── */}
      <section style={{ background: C.black, padding: "6rem 2.5rem", borderTop: `1px solid ${C.dim}`, borderBottom: `1px solid ${C.dim}` }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: "0.6rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: "4rem" }}>SELECT CLIENTS //</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(160px, 100%), 1fr))", gap: "2px", background: C.dim }}>
            {["PHANTOM", "ATLAS CO.", "NOVA SYS", "MERIDIAN", "CIPHER", "HELIX"].map((name) => (
              <div key={name} style={{ background: C.black, padding: "2.5rem 2rem", textAlign: "center" }}>
                <div style={{ fontFamily: FONT_SYNE, fontSize: "0.75rem", fontWeight: 900, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.15em" }}>{name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{ background: C.red, padding: "10rem 2.5rem", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: "0.6rem", color: "rgba(0,0,0,0.5)", letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: "2rem" }}>NEW BRIEF</div>
          <h2 style={{ fontFamily: FONT_SYNE, fontWeight: 900, fontSize: "clamp(3rem,8vw,7rem)", color: C.black, textTransform: "uppercase", lineHeight: 0.95, marginBottom: "3rem", letterSpacing: "-0.02em" }}>LET'S BUILD<br />SOMETHING<br />WRONG.</h2>
          <p style={{ fontFamily: FONT_MONO, fontSize: "0.8rem", color: "rgba(0,0,0,0.5)", lineHeight: 1.9, marginBottom: "3.5rem", letterSpacing: "0.05em" }}>
            We work with a limited number of clients per quarter.<br />
            If you have a brief that scares you a little, we want to hear it.
          </p>
          <a href="/templates/impact-53/contact" style={{ display: "inline-block", background: C.black, color: C.red, padding: "1.2rem 3.5rem", fontFamily: FONT_SYNE, fontWeight: 900, fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", textDecoration: "none" }}>START A PROJECT →</a>
        </div>
      </section>
    </div>
  );
}
