"use client";
// @ts-nocheck

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { C, FONT, FONT_BODY, STATS, MISSIONS, TEMOIGNAGES, Reveal } from "./shared";


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function LedgerPage() {
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

  const BASE = "/templates/impact-108";
  const navLinks = [
    { label: "Services", href: `${BASE}#services` },
    { label: "Expertise", href: `${BASE}#approche` },
    { label: "L'équipe", href: `${BASE}#equipe` },
    { label: "Contact", href: `${BASE}/contact` },
  ];

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT_BODY, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
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
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 52px",
          background: scrolled ? "rgba(248,250,251,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "none",
          transition: "background 0.3s, border-color 0.3s",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: -0.3,
            color: scrolled ? C.accent : C.white,
          }}
        >
          Ledger <span style={{ fontWeight: 400, opacity: 0.7 }}>&amp; Associés</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="nav-links-desktop">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontFamily: FONT,
                fontWeight: 500,
                fontSize: 14,
                color: scrolled ? C.textMuted : "rgba(255,255,255,0.82)",
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
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: 0.3,
              background: C.green,
              color: C.white,
              padding: "10px 22px",
              borderRadius: 6,
              textDecoration: "none",
              transition: "background 0.2s",
            }}
          >
            Premier RDV gratuit
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
              background: C.accent,
              display: "flex",
              flexDirection: "column",
              padding: "24px 36px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
              <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.white }}>Ledger &amp; Associés</span>
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
                    fontSize: 36,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.9)",
                    textDecoration: "none",
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
                  fontSize: 36,
                  fontWeight: 700,
                  color: "#4ade80",
                  textDecoration: "none",
                }}
              >
                RDV Gratuit
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
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=80"
            alt="Cabinet Ledger & Associés Bordeaux"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </motion.div>
        {/* gradient sombre */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(13,33,55,0.94) 0%, rgba(13,33,55,0.55) 45%, rgba(13,33,55,0.2) 100%)",
          }}
        />
        {/* gradient accent gauche */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(30,58,95,0.3) 0%, transparent 60%)",
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
              background: "rgba(26,158,111,0.2)",
              border: "1px solid rgba(26,158,111,0.5)",
              color: "#4ade80",
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
              padding: "7px 16px",
              borderRadius: 4,
              marginBottom: 24,
            }}
          >
            Expert-comptable · Bordeaux
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            style={{
              fontFamily: FONT,
              fontSize: "clamp(40px, 6vw, 78px)",
              fontWeight: 800,
              lineHeight: 1.05,
              color: C.white,
              letterSpacing: -0.5,
              marginBottom: 24,
            }}
          >{c?.heroHeadline ?? <>
            La comptabilité,<br />
            <span style={{color: brand ?? '#93c5fd' }}>un outil de croissance</span>
          </>}</motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7 }}
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 300,
              fontSize: 18,
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.65,
              marginBottom: 40,
              maxWidth: 520,
            }}
          >{c?.heroSubline ?? fd?.tagline ?? <>
            Cabinet d&apos;expertise comptable à Bordeaux depuis 25 ans. Nous transformons vos obligations comptables en leviers de décision pour votre entreprise.
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
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: 0.5,
                background: C.green,
                color: C.white,
                padding: "16px 36px",
                borderRadius: 6,
                textDecoration: "none",
                display: "inline-block",
              }}
            >{c?.ctaText ?? <>
              Premier RDV gratuit →
            </>}</a>
            <a
              href={`${BASE}#services`}
              style={{
                fontFamily: FONT,
                fontWeight: 600,
                fontSize: 14,
                background: "transparent",
                color: C.white,
                padding: "16px 36px",
                borderRadius: 6,
                textDecoration: "none",
                border: `1.5px solid rgba(255,255,255,0.4)`,
                display: "inline-block",
              }}
            >
              Nos missions
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
            color: "rgba(255,255,255,0.35)",
          }}
        >
          <span style={{ fontFamily: FONT, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 600 }}>Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 1, height: 40, background: "rgba(147,197,253,0.4)" }}
          />
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: C.accent, padding: "72px 80px" }}>
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
                  style={{fontFamily: FONT,
                    fontSize: 52,
                    fontWeight: 800,
                    color: brand ?? '#93c5fd',
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 13,
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.5)",
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

      {/* MISSIONS */}
      <section id="services" style={{ padding: "100px 80px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 60 }}>
              <div
                style={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: C.green,
                  marginBottom: 12,
                }}
              >
                Nos missions
              </div>
              <h2
                style={{
                  fontFamily: FONT,
                  fontSize: "clamp(32px, 4.5vw, 52px)",
                  fontWeight: 800,
                  color: C.text,
                  letterSpacing: -0.5,
                  lineHeight: 1.1,
                }}
              >
                Une expertise complète<br />
                <span style={{ color: C.accent }}>pour votre entreprise</span>
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {MISSIONS.map((mission, i) => (
              <Reveal key={mission.titre} delay={i * 0.08}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 10,
                    padding: "32px 28px",
                    boxShadow: C.shadow,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 16 }}>{mission.icon}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <h3
                      style={{
                        fontFamily: FONT,
                        fontSize: 18,
                        fontWeight: 700,
                        color: C.text,
                        lineHeight: 1.25,
                      }}
                    >
                      {mission.titre}
                    </h3>
                    <span
                      style={{
                        fontFamily: FONT,
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        background: C.accentLight,
                        color: C.accent,
                        padding: "3px 10px",
                        borderRadius: 3,
                        whiteSpace: "nowrap",
                        marginLeft: 12,
                      }}
                    >
                      {mission.tag}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: FONT_BODY,
                      fontWeight: 300,
                      fontSize: 14,
                      color: C.textMuted,
                      lineHeight: 1.65,
                    }}
                  >
                    {mission.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* APPROCHE — split */}
      <section
        id="approche"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: 580,
          background: C.bgSection,
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <img
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80"
            alt="Expert-comptable Bordeaux"
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
                fontSize: 12,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: C.green,
                marginBottom: 16,
              }}
            >
              Notre approche
            </div>
            <h2
              style={{
                fontFamily: FONT,
                fontSize: "clamp(28px, 3.5vw, 44px)",
                fontWeight: 800,
                color: C.text,
                letterSpacing: -0.3,
                marginBottom: 32,
                lineHeight: 1.15,
              }}
            >
              Votre comptable devient<br />
              <span style={{ color: C.accent }}>votre allié stratégique</span>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                "Un interlocuteur unique dédié à votre dossier, disponible et réactif",
                "Des reporting mensuels clairs pour piloter votre trésorerie en temps réel",
                "Veille fiscale et sociale permanente pour anticiper les changements",
                "Conseils proactifs : nous vous contactons avant que les problèmes surgissent",
              ].map((point, i) => (
                <Reveal key={i} delay={0.1 + i * 0.1}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        background: C.green,
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
                    <p style={{ fontFamily: FONT_BODY, fontWeight: 400, fontSize: 15, color: C.text, lineHeight: 1.6 }}>
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
                  fontSize: 12,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: C.green,
                  marginBottom: 12,
                }}
              >
                Ils nous font confiance
              </div>
              <h2
                style={{
                  fontFamily: FONT,
                  fontSize: "clamp(28px, 4vw, 46px)",
                  fontWeight: 800,
                  color: C.text,
                  letterSpacing: -0.3,
                }}
              >
                Ce que disent nos clients
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
            {TEMOIGNAGES.map((temo, i) => (
              <Reveal key={temo.nom} delay={i * 0.12}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 10,
                    padding: "36px 28px",
                    boxShadow: C.shadow,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div style={{ display: "flex", marginBottom: 16, gap: 3 }}>
                    {Array.from({ length: temo.note }).map((_, j) => (
                      <span key={j} style={{ color: C.green, fontSize: 16 }}>★</span>
                    ))}
                  </div>
                  <p
                    style={{
                      fontFamily: FONT_BODY,
                      fontWeight: 300,
                      fontSize: 15,
                      color: C.text,
                      lineHeight: 1.65,
                      marginBottom: 24,
                      fontStyle: "italic",
                    }}
                  >
                    &ldquo;{temo.texte}&rdquo;
                  </p>
                  <div>
                    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: C.text }}>{temo.nom}</div>
                    <div style={{ fontFamily: FONT_BODY, fontWeight: 300, fontSize: 13, color: C.textMuted, marginTop: 2 }}>{temo.poste}</div>
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
          padding: "88px 40px",
          textAlign: "center",
        }}
      >
        <Reveal>
          <div
            style={{fontFamily: FONT,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: brand ?? '#93c5fd',
              marginBottom: 20,
            }}
          >
            Sans engagement
          </div>
          <h2
            style={{
              fontFamily: FONT,
              fontSize: "clamp(32px, 4.5vw, 58px)",
              fontWeight: 800,
              color: C.white,
              letterSpacing: -0.5,
              marginBottom: 16,
            }}
          >{c?.aboutTitle ?? fd?.businessName ?? <>
            Premier rendez-vous offert
          </>}</h2>
          <p
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 300,
              fontSize: 18,
              color: "rgba(255,255,255,0.65)",
              marginBottom: 44,
              maxWidth: 480,
              margin: "0 auto 44px",
            }}
          >{c?.aboutText ?? <>
            Rencontrons-nous pour analyser votre situation et définir ensemble vos axes d&apos;optimisation.
          </>}</p>
          <a
            href={`${BASE}/contact`}
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: 0.5,
              background: C.green,
              color: C.white,
              padding: "18px 48px",
              borderRadius: 8,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Prendre rendez-vous →
          </a>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.accentDark, padding: "60px 80px 40px", color: "rgba(255,255,255,0.5)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.white, marginBottom: 16 }}>
                Ledger &amp; Associés
              </div>
              <p style={{ fontFamily: FONT_BODY, fontWeight: 300, fontSize: 14, lineHeight: 1.8 }}>
                Cabinet d&apos;expertise comptable<br />
                Bordeaux · Depuis 1999
              </p>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(26,158,111,0.15)",
                  border: "1px solid rgba(26,158,111,0.4)",
                  color: "#4ade80",
                  fontFamily: FONT,
                  fontWeight: 600,
                  fontSize: 11,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  padding: "5px 12px",
                  borderRadius: 4,
                  marginTop: 16,
                }}
              >
                Membre de l&apos;OEC Aquitaine
              </div>
            </div>
            <div>
              <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 20 }}>
                Adresse
              </p>
              <p style={{ fontFamily: FONT_BODY, fontWeight: 300, fontSize: 14, lineHeight: 2 }}>
                14 allée de Tourny<br />
                33000 Bordeaux<br />
                <a href={`tel:${fd?.phone ?? "+33556000000"}`} style={{color: brand ?? '#93c5fd', textDecoration: "none" }}>05 56 XX XX XX</a><br />
                <a href={`mailto:${fd?.email ?? "contact@ledger-associes.fr"}`} style={{color: brand ?? '#93c5fd', textDecoration: "none" }}>{fd?.email ?? "contact@ledger-associes.fr"}</a>
              </p>
            </div>
            <div>
              <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 20 }}>
                Horaires
              </p>
              <p style={{ fontFamily: FONT_BODY, fontWeight: 300, fontSize: 14, lineHeight: 2 }}>
                Lun – Ven : 8h30 – 18h30<br />
                Accueil sur rendez-vous
              </p>
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
            <span>© 2025 Ledger &amp; Associés — Tous droits réservés</span>
            <div style={{ display: "flex", gap: 24 }}>
              <a href="/templates/impact-108/legal" style={{ color: "inherit", textDecoration: "none" }}>Mentions légales</a>
              <a href="/templates/impact-108/legal" style={{ color: "inherit", textDecoration: "none" }}>Confidentialité</a>
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
