"use client";
// @ts-nocheck

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { C, FONT, FONT_BODY, STATS, COURS, AVIS, Reveal } from "./shared";


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function IronClubPage() {
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
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const BASE = "/templates/impact-87";
  const navLinks = [
    { label: "Cours", href: `${BASE}#cours` },
    { label: "Tarifs", href: `${BASE}#tarifs` },
    { label: "Équipe", href: `${BASE}#equipe` },
    { label: "Contact", href: `${BASE}/contact` },
  ];

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT_BODY, minHeight: "100dvh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
      
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: scrolled ? "0 40px" : "0 40px",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(255,255,255,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "none",
          transition: "background 0.3s, border-color 0.3s",
        }}
      >
        {fd?.logoBase64 ? (
          <img
            src={fd.logoBase64}
            alt={fd?.businessName ?? 'logo'}
            style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
          />
        ) : (
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 24, letterSpacing: 1, color: scrolled ? C.text : C.white }}>
            IRON <span style={{ color: C.accent }}>CLUB</span>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="nav-links-desktop">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontFamily: FONT,
                fontWeight: 600,
                fontSize: 15,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: scrolled ? C.text : "rgba(255,255,255,0.88)",
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
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: 1,
              textTransform: "uppercase",
              background: C.accent,
              color: C.white,
              padding: "10px 22px",
              borderRadius: 4,
              textDecoration: "none",
              transition: "background 0.2s",
            }}
          >
            Essai gratuit
          </a>
        </div>
        <button
          onClick={() => setMenuOpen(true)}
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: scrolled ? C.text : C.white, padding: 8 }}
          className="nav-menu-btn"
          aria-label="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              padding: "24px 32px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 22, color: C.white }}>
                IRON <span style={{ color: C.accent }}>CLUB</span>
              </span>
              <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.white }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  style={{
                    fontFamily: FONT,
                    fontSize: 40,
                    fontWeight: 800,
                    color: C.white,
                    textDecoration: "none",
                    textTransform: "uppercase",
                    letterSpacing: 2,
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
                transition={{ delay: 0.28 }}
                style={{
                  fontFamily: FONT,
                  fontSize: 40,
                  fontWeight: 800,
                  color: C.accent,
                  textDecoration: "none",
                  textTransform: "uppercase",
                  letterSpacing: 2,
                }}
              >
                Essai gratuit
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
            src={photo(0, "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80")}
            alt="Salle CrossFit Iron Club Lyon"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </motion.div>
        {/* gradient sombre bas → haut */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(17,24,39,0.92) 0%, rgba(17,24,39,0.55) 45%, transparent 100%)",
          }}
        />
        {/* gradient accent gauche → transparent */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(239,68,68,0.18) 0%, transparent 60%)",
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
              gap: 8,
              background: C.accent,
              color: C.white,
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: 2,
              textTransform: "uppercase",
              padding: "6px 16px",
              borderRadius: 3,
              marginBottom: 24,
            }}
          >
            <span>●</span> Lyon 7e · CrossFit certifié
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            style={{
              fontFamily: FONT,
              fontSize: "clamp(52px, 8vw, 96px)",
              fontWeight: 900,
              lineHeight: 0.95,
              color: C.white,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 24,
            }}
          >{c?.heroHeadline ?? <>
            Plus fort.<br />
            <span style={{ color: C.accent }}>Chaque jour.</span>
          </>}</motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7 }}
            style={{
              fontFamily: FONT_BODY,
              fontSize: 18,
              color: "rgba(255,255,255,0.78)",
              lineHeight: 1.6,
              marginBottom: 36,
              maxWidth: 520,
            }}
          >{c?.heroSubline ?? fd?.tagline ?? <>
            La salle de sport et CrossFit de référence à Lyon. Une communauté soudée, des coachs certifiés, des résultats qui parlent d&apos;eux-mêmes.
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
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 16,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                background: C.accent,
                color: C.white,
                padding: "16px 36px",
                borderRadius: 4,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Séance d&apos;essai gratuite
            </a>
            <a
              href={`${BASE}#cours`}
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                background: "transparent",
                color: C.white,
                padding: "16px 36px",
                borderRadius: 4,
                textDecoration: "none",
                border: `2px solid rgba(255,255,255,0.5)`,
                display: "inline-block",
              }}
            >
              Nos cours
            </a>
          </motion.div>
        </motion.div>
        {/* Scroll indicator */}
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
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <span style={{ fontFamily: FONT, fontSize: 11, letterSpacing: 3, textTransform: "uppercase" }}>Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 1, height: 40, background: "rgba(255,255,255,0.3)" }}
          />
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: C.bgDark, padding: "80px 80px" }}>
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
                    fontSize: 56,
                    fontWeight: 900,
                    color: C.accent,
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 14,
                    color: "rgba(255,255,255,0.55)",
                    letterSpacing: 1,
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

      {/* COURS */}
      <section id="cours" style={{ padding: "100px 80px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 60, textAlign: "center" }}>
              <div
                style={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: C.accent,
                  marginBottom: 12,
                }}
              >
                Nos programmes
              </div>
              <h2
                style={{
                  fontFamily: FONT,
                  fontSize: "clamp(36px, 5vw, 56px)",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  color: C.text,
                  letterSpacing: 2,
                }}
              >
                40 cours par semaine
              </h2>
            </div>
          </Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}
          >
            {COURS.map((cours, i) => (
              <Reveal key={cours.nom} delay={i * 0.08}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 8,
                    padding: "32px 28px",
                    boxShadow: C.shadow,
                    border: `1px solid ${C.border}`,
                    transition: "box-shadow 0.2s, transform 0.2s",
                  }}
                >
                  <div style={{ fontSize: 36, marginBottom: 16 }}>{cours.icon}</div>
                  <h3
                    style={{
                      fontFamily: FONT,
                      fontSize: 22,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      color: C.text,
                      letterSpacing: 1,
                      marginBottom: 10,
                    }}
                  >
                    {cours.nom}
                  </h3>
                  <p
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: 14,
                      color: C.textMuted,
                      lineHeight: 1.65,
                      marginBottom: 16,
                    }}
                  >
                    {cours.description}
                  </p>
                  <span
                    style={{
                      fontFamily: FONT,
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                      background: C.accentLight,
                      color: C.accent,
                      padding: "4px 12px",
                      borderRadius: 3,
                    }}
                  >
                    {cours.niveau}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PHILOSOPHIE — split photo + texte */}
      <section className="imx-mobstack"
        style={{
          background: C.bgDark,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: 580,
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <img
            src={photo(1, "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80")}
            alt="Entraînement CrossFit"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px 72px",
          }}
        >
          <Reveal>
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: C.accent,
                marginBottom: 16,
              }}
            >
              Notre philosophie
            </div>
            <h2
              style={{
                fontFamily: FONT,
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 900,
                textTransform: "uppercase",
                color: C.white,
                letterSpacing: 2,
                marginBottom: 32,
                lineHeight: 1.05,
              }}
            >
              Le sport comme<br />
              <span style={{ color: C.accent }}>mode de vie</span>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                "Des entraînements variés qui ne laissent jamais place à la routine",
                "Un coaching individualisé adapté à votre niveau et vos objectifs",
                "Une communauté bienveillante qui pousse chacun à se surpasser",
                "Des équipements professionnels renouvelés chaque année",
              ].map((point, i) => (
                <Reveal key={i} delay={0.1 + i * 0.1}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        background: C.accent,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: "rgba(255,255,255,0.78)", lineHeight: 1.55 }}>
                      {point}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section style={{ padding: "100px 80px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <div
                style={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: C.accent,
                  marginBottom: 12,
                }}
              >
                Ils nous font confiance
              </div>
              <h2
                style={{
                  fontFamily: FONT,
                  fontSize: "clamp(32px, 5vw, 48px)",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  color: C.text,
                  letterSpacing: 2,
                }}
              >
                Témoignages
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
            {AVIS.map((avis, i) => (
              <Reveal key={avis.nom} delay={i * 0.12}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 8,
                    padding: "36px 28px",
                    boxShadow: C.shadow,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div style={{ display: "flex", marginBottom: 16, gap: 3 }}>
                    {Array.from({ length: avis.note }).map((_, j) => (
                      <span key={j} style={{ color: C.accent, fontSize: 18 }}>★</span>
                    ))}
                  </div>
                  <p
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: 15,
                      color: C.text,
                      lineHeight: 1.65,
                      marginBottom: 20,
                      fontStyle: "italic",
                    }}
                  >
                    &ldquo;{avis.texte}&rdquo;
                  </p>
                  <div>
                    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: C.text }}>{avis.nom}</div>
                    <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.textMuted, marginTop: 2 }}>{avis.depuis}</div>
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
          background: C.accent,
          padding: "80px 40px",
          textAlign: "center",
        }}
      >
        <Reveal>
          <h2
            style={{
              fontFamily: FONT,
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 900,
              textTransform: "uppercase",
              color: C.white,
              letterSpacing: 3,
              marginBottom: 16,
            }}
          >
            Prêt à changer de vie ?
          </h2>
          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: 18,
              color: "rgba(255,255,255,0.88)",
              marginBottom: 36,
            }}
          >
            Votre première séance est offerte. Aucun engagement.
          </p>
          <a
            href={`${BASE}/contact`}
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 16,
              letterSpacing: 2,
              textTransform: "uppercase",
              background: C.white,
              color: C.accent,
              padding: "18px 48px",
              borderRadius: 4,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Séance d&apos;essai gratuite →
          </a>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.bgDark, padding: "60px 80px 40px", color: "rgba(255,255,255,0.6)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 22, color: C.white, marginBottom: 16 }}>
                IRON <span style={{ color: C.accent }}>CLUB</span>
              </div>
              <p style={{ fontFamily: FONT_BODY, fontSize: 14, lineHeight: 1.65 }}>
                Salle de sport & CrossFit certifiée.<br />
                Lyon 7e · Depuis 2019.
              </p>
            </div>
            <div>
              <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>
                Contact
              </p>
              <p style={{ fontFamily: FONT_BODY, fontSize: 14, lineHeight: 2 }}>{c?.aboutText ?? <>
                12 rue de la Guillotière<br />
                69007 Lyon<br />
                04 78 XX XX XX<br />{fd?.email ?? "contact@ironclub-lyon.fr"}</>}</p>
            </div>
            <div>
              <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>
                Horaires
              </p>
              <p style={{ fontFamily: FONT_BODY, fontSize: 14, lineHeight: 2 }}>
                Lun – Ven : 6h – 22h<br />
                Samedi : 8h – 18h<br />
                Dimanche : 9h – 13h
              </p>
            </div>
          </div>
          <div
            style={{
              borderTop: `1px solid rgba(255,255,255,0.1)`,
              paddingTop: 24,
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              fontSize: 12,
              fontFamily: FONT_BODY,
            }}
          >
            <span>© 2025 Iron Club — Tous droits réservés</span>
            <div style={{ display: "flex", gap: 24 }}>
              <a href="/templates/impact-87/legal" style={{ color: "inherit", textDecoration: "none" }}>Mentions légales</a>
              <a href="/templates/impact-87/legal" style={{ color: "inherit", textDecoration: "none" }}>Politique de confidentialité</a>
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
