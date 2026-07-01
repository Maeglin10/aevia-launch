// @ts-nocheck
"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { C, FONT, FONT_BODY, STATS, PRESTATIONS, TEMOIGNAGES, GALERIE, Reveal, CSS_VARIABLES } from "./shared";


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function LumiereDoreePage() {
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

  const heroRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 170]);
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, -65]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    
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
return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const BASE = "/templates/impact-104";
  const navLinks = [
    { label: "Galerie", href: `${BASE}#galerie` },
    { label: "Mariages", href: `${BASE}#prestations` },
    { label: "Portraits", href: `${BASE}#prestations` },
    { label: "Contact", href: `${BASE}/contact` },
  ];

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT_BODY, minHeight: "100vh" }}>
      <style>{`
        ${CSS_VARIABLES}
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 52px",
          background: scrolled ? "rgba(250,248,245,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "none",
          transition: "background 0.4s, border-color 0.4s",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: 22,
            letterSpacing: 1,
            color: scrolled ? C.text : C.white,
          }}
        >
          Studio Lumière Dorée
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 36 }} className="nav-links-desktop">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontFamily: FONT_BODY,
                fontWeight: 400,
                fontSize: 14,
                letterSpacing: 0.5,
                color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href={`${BASE}/contact`}
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 500,
              fontSize: 13,
              letterSpacing: 1,
              textTransform: "uppercase",
              border: `1px solid ${scrolled ? C.accent : "rgba(255,255,255,0.6)"}`,
              color: scrolled ? C.accent : C.white,
              padding: "9px 22px",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            Demander un devis
          </a>
        </div>
        <button
          onClick={() => setMenuOpen(true)}
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: scrolled ? C.text : C.white, padding: 8 }}
          className="nav-menu-btn"
          aria-label="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: C.bgDark,
              display: "flex",
              flexDirection: "column",
              padding: "24px 36px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
              <span style={{ fontFamily: FONT, fontStyle: "italic", fontSize: 20, color: C.white }}>Studio Lumière Dorée</span>
              <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.white }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    fontFamily: FONT,
                    fontSize: 42,
                    fontWeight: 300,
                    color: C.white,
                    textDecoration: "none",
                    fontStyle: "italic",
                  }}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href={`${BASE}/contact`}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.32 }}
                style={{
                  fontFamily: FONT,
                  fontSize: 42,
                  fontWeight: 300,
                  color: C.accent,
                  textDecoration: "none",
                  fontStyle: "italic",
                }}
              >
                Devis
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section
        ref={heroRef}
        style={{
          height: "115vh",
          minHeight: 900,
          position: "relative",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
        }}
      >
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80"
            alt="Cérémonie de mariage"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </motion.div>
        {/* gradient sombre bas → haut */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(26,15,8,0.88) 0%, rgba(26,15,8,0.4) 50%, transparent 100%)",
          }}
        />
        {/* gradient accent gauche */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(201,168,124,0.12) 0%, transparent 60%)",
          }}
        />
        <motion.div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "0 80px 90px",
            maxWidth: 760,
            y: heroTextY,
            opacity: heroOpacity,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              border: `1px solid rgba(201,168,124,0.6)`,
              color: C.accent,
              fontFamily: FONT_BODY,
              fontWeight: 400,
              fontSize: 13,
              letterSpacing: 2,
              textTransform: "uppercase",
              padding: "7px 18px",
              marginBottom: 28,
            }}
          >
            Photographe mariage · Paris &amp; région
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            style={{
              fontFamily: FONT,
              fontSize: "clamp(44px, 7vw, 86px)",
              fontWeight: 300,
              lineHeight: 1.1,
              color: C.white,
              letterSpacing: 1,
              marginBottom: 24,
              fontStyle: "italic",
            }}
          >{c?.heroHeadline ?? <>
            Chaque amour mérite<br />
            <span style={{ color: C.accent, fontStyle: "italic" }}>d&apos;être raconté</span>
          </>}</motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7 }}
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 300,
              fontSize: 17,
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.7,
              marginBottom: 40,
              maxWidth: 500,
            }}
          >{c?.heroSubline ?? fd?.tagline ?? <>
            Photographe de mariage basée à Paris, je capture vos émotions avec discrétion et sensibilité pour des souvenirs qui durent toute une vie.
          </>}</motion.p>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.7 }}
            style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
          >
            <a
              href={`${BASE}/contact`}
              style={{
                fontFamily: FONT_BODY,
                fontWeight: 500,
                fontSize: 14,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                background: C.accent,
                color: C.bgDark,
                padding: "16px 36px",
                textDecoration: "none",
                display: "inline-block",
              }}
            >{c?.ctaText ?? <>
              Demander un devis
            </>}</a>
            <a
              href={`${BASE}#galerie`}
              style={{
                fontFamily: FONT_BODY,
                fontWeight: 400,
                fontSize: 14,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                background: "transparent",
                color: C.white,
                padding: "16px 36px",
                textDecoration: "none",
                border: `1px solid rgba(255,255,255,0.4)`,
                display: "inline-block",
              }}
            >
              Voir la galerie
            </a>
          </motion.div>
        </motion.div>
        {/* scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            color: "rgba(255,255,255,0.4)",
          }}
        >
          <span style={{ fontFamily: FONT_BODY, fontSize: 11, letterSpacing: 3, textTransform: "uppercase" }}>Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            style={{ width: 1, height: 40, background: "rgba(201,168,124,0.4)" }}
          />
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: C.bgDark, padding: "72px 80px" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 40,
          }}
        >
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: 48,
                    fontWeight: 300,
                    fontStyle: "italic",
                    color: C.accent,
                    lineHeight: 1,
                    marginBottom: 10,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 13,
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.45)",
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PRESTATIONS */}
      <section id="prestations" style={{ padding: "100px 80px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 64, textAlign: "center" }}>
              <div
                style={{
                  fontFamily: FONT_BODY,
                  fontWeight: 400,
                  fontSize: 12,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: C.accent,
                  marginBottom: 16,
                }}
              >
                Mes services
              </div>
              <h2
                style={{
                  fontFamily: FONT,
                  fontSize: "clamp(36px, 5vw, 58px)",
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: C.text,
                  letterSpacing: 0.5,
                }}
              >
                Prestations photographiques
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {PRESTATIONS.map((prest, i) => (
              <Reveal key={prest.titre} delay={i * 0.08}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 4,
                    padding: "36px 28px",
                    boxShadow: C.shadow,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 18 }}>{prest.icon}</div>
                  <h3
                    style={{
                      fontFamily: FONT,
                      fontSize: 22,
                      fontWeight: 600,
                      color: C.text,
                      marginBottom: 12,
                      lineHeight: 1.25,
                    }}
                  >
                    {prest.titre}
                  </h3>
                  <p
                    style={{
                      fontFamily: FONT_BODY,
                      fontWeight: 300,
                      fontSize: 14,
                      color: C.textMuted,
                      lineHeight: 1.7,
                    }}
                  >
                    {prest.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GALERIE */}
      <section id="galerie" style={{ padding: "0 0 100px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 80px" }}>
          <Reveal>
            <div style={{ marginBottom: 48, textAlign: "center" }}>
              <div
                style={{
                  fontFamily: FONT_BODY,
                  fontWeight: 400,
                  fontSize: 12,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: C.accent,
                  marginBottom: 16,
                }}
              >
                Portfolio
              </div>
              <h2
                style={{
                  fontFamily: FONT,
                  fontSize: "clamp(32px, 4vw, 52px)",
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: C.text,
                }}
              >
                Quelques instants
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 16, alignItems: "stretch" }}>
            {GALERIE.map((src, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <div
                  style={{
                    overflow: "hidden",
                    borderRadius: 4,
                    height: i === 0 ? 520 : 250,
                    position: "relative",
                  }}
                >
                  <img
                    src={src}
                    alt={`Photo mariage ${i + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.6s ease",
                    }}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section style={{ padding: "100px 80px", background: C.accentLight }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <div
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 12,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: C.accentDark,
                  marginBottom: 16,
                }}
              >
                Ils me font confiance
              </div>
              <h2
                style={{
                  fontFamily: FONT,
                  fontSize: "clamp(32px, 4vw, 52px)",
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: C.text,
                }}
              >
                Ce qu&apos;ils disent
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
            {TEMOIGNAGES.map((temo, i) => (
              <Reveal key={temo.couple} delay={i * 0.12}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 4,
                    padding: "36px 28px",
                    boxShadow: C.shadow,
                  }}
                >
                  <div style={{ display: "flex", marginBottom: 16, gap: 3 }}>
                    {Array.from({ length: temo.note }).map((_, j) => (
                      <span key={j} style={{ color: C.accent, fontSize: 16 }}>★</span>
                    ))}
                  </div>
                  <p
                    style={{
                      fontFamily: FONT,
                      fontSize: 17,
                      fontWeight: 300,
                      fontStyle: "italic",
                      color: C.text,
                      lineHeight: 1.7,
                      marginBottom: 24,
                    }}
                  >
                    &ldquo;{temo.texte}&rdquo;
                  </p>
                  <div>
                    <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 15, color: C.text }}>{temo.couple}</div>
                    <div style={{ fontFamily: FONT_BODY, fontWeight: 300, fontSize: 13, color: C.textMuted, marginTop: 3 }}>{temo.mariage}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          background: C.bgDark,
          padding: "100px 40px",
          textAlign: "center",
        }}
      >
        <Reveal>
          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: 12,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: C.accent,
              marginBottom: 24,
            }}
          >
            Réservations 2025 — 2026
          </div>
          <h2
            style={{
              fontFamily: FONT,
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 300,
              fontStyle: "italic",
              color: C.white,
              letterSpacing: 0.5,
              marginBottom: 20,
            }}
          >{c?.aboutTitle ?? fd?.businessName ?? <>
            Votre date est disponible ?
          </>}</h2>
          <p
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 300,
              fontSize: 17,
              color: "rgba(255,255,255,0.6)",
              marginBottom: 44,
              maxWidth: 480,
              margin: "0 auto 44px",
            }}
          >{c?.aboutText ?? <>
            Les dates se réservent souvent 12 à 18 mois à l&apos;avance. Contactez-moi pour vérifier la disponibilité de votre jour J.
          </>}</p>
          <a
            href={`${BASE}/contact`}
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 500,
              fontSize: 14,
              letterSpacing: 2,
              textTransform: "uppercase",
              background: C.accent,
              color: C.bgDark,
              padding: "18px 48px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Vérifier ma disponibilité →
          </a>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.warm, padding: "60px 80px 36px", color: "rgba(255,255,255,0.5)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ fontFamily: FONT, fontStyle: "italic", fontWeight: 300, fontSize: 22, color: C.white, marginBottom: 16 }}>
                Studio Lumière Dorée
              </div>
              <p style={{ fontFamily: FONT_BODY, fontWeight: 300, fontSize: 14, lineHeight: 1.8 }}>
                Photographe mariage &amp; portraits.<br />
                Paris &amp; déplacements France entière.
              </p>
            </div>
            <div>
              <p style={{ fontFamily: FONT_BODY, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 18 }}>
                Contact
              </p>
              <p style={{ fontFamily: FONT_BODY, fontWeight: 300, fontSize: 14, lineHeight: 2 }}>
                Paris 11e<br />
                <a href={`tel:${fd?.phone ?? "+33612345678"}`} style={{ color: C.accent, textDecoration: "none" }}>06 12 XX XX XX</a><br />
                <a href={`mailto:${fd?.email ?? "contact@lumieredoree.fr"}`} style={{ color: C.accent, textDecoration: "none" }}>{fd?.email ?? "contact@lumieredoree.fr"}</a>
              </p>
            </div>
            <div>
              <p style={{ fontFamily: FONT_BODY, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 18 }}>
                Navigation
              </p>
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} style={{ display: "block", fontFamily: FONT_BODY, fontWeight: 300, fontSize: 14, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 10 }}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div
            style={{
              borderTop: `1px solid rgba(255,255,255,0.08)`,
              paddingTop: 24,
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              fontSize: 12,
              fontFamily: FONT_BODY,
              fontWeight: 300,
            }}
          >
            <span>© 2025 Studio Lumière Dorée — Tous droits réservés</span>
            <div style={{ display: "flex", gap: 24 }}>
              <a href="/templates/impact-104/legal" style={{ color: "inherit", textDecoration: "none" }}>Mentions légales</a>
              <a href="/templates/impact-104/legal" style={{ color: "inherit", textDecoration: "none" }}>Confidentialité</a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 900px) {
          .nav-links-desktop { display: none !important; }
          .nav-menu-btn { display: block !important; }
        }
      `}</style>
    </div>
  );
}
