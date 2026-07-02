"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react'
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { Building2, Zap, ArrowRight, Star, Check, Layers } from "lucide-react"
import {
  C,
  SPACE_TYPES,
  AMENITIES,
  TESTIMONIALS,
  STATS,
  SectionReveal,
  FloorPlan,
} from "./shared"


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Home() {
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

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  
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
    <div>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "85vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          background: C.slate,
          paddingTop: 40,
          paddingBottom: 60,
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            y: heroY,
            backgroundImage: `radial-gradient(${C.accent}18 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "5%",
            right: "0%",
            width: 600,
            height: 600,
            background: `radial-gradient(circle, ${C.accent}28 0%, transparent 70%)`,
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <motion.div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "40px 5%",
            width: "100%",
            opacity: heroOpacity,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 80,
              alignItems: "center",
            }}
          >
            {/* Left Column: Text & CTAs */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: `${C.accent}22`,
                  border: `1px solid ${C.accent}44`,
                  borderRadius: 30,
                  padding: "6px 16px",
                  marginBottom: 28,
                }}
              >
                <Zap size={14} color={C.accent} />
                <span style={{ color: C.accent, fontSize: 13, fontWeight: 600 }}>
                  Ouvert — expansion niveau 3 terminée
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                style={{
                  fontSize: "clamp(40px, 4.5vw, 64px)",
                  fontWeight: 800,
                  color: C.white,
                  lineHeight: 1.1,
                  marginBottom: 24,
                }}
              >{c?.heroHeadline ?? <>
                Travaillez là où <span style={{ color: C.accent }}>l'ambition</span> prend vie
              </>}</motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                style={{fontSize: 18,
                  color: brand ?? '#94a3b8',
                  lineHeight: 1.75,
                  marginBottom: 40,
                  maxWidth: 480,
                }}
              >{c?.heroSubline ?? fd?.tagline ?? <>
                Un espace de coworking premium à Paris. Hot desks, bureaux dédiés, salles de réunion, studio podcast — et une communauté pensée pour grandir.
              </>}</motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
              >
                <Link href="/templates/impact-35/pricing" style={{ textDecoration: "none" }}>
                  <button
                    type="button"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: C.accent,
                      color: C.white,
                      padding: "16px 32px",
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: 16,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Day Pass — 25€ <ArrowRight size={18} />
                  </button>
                </Link>
                <Link href="/templates/impact-35/spaces" style={{ textDecoration: "none" }}>
                  <button
                    type="button"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: "transparent",
                      color: C.white,
                      padding: "16px 32px",
                      borderRadius: 10,
                      fontWeight: 600,
                      fontSize: 16,
                      border: "1.5px solid rgba(255,255,255,0.25)",
                      cursor: "pointer",
                    }}
                  >
                    Nos espaces
                  </button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ display: "flex", gap: 40, marginTop: 52 }}
              >
                {STATS.slice(0, 3).map((s) => (
                  <div key={s.label}>
                    <div style={{ fontSize: 26, fontWeight: 800, color: C.accent }}>{s.value}</div>
                    <div style={{fontSize: 13, color: brand ?? '#94a3b8', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Column: Floor plan */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 20,
                  padding: 24,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <Layers size={16} color={C.accent} />
                  <span style={{ color: C.accent, fontSize: 13, fontWeight: 600 }}>
                    Plan interactif — Niveau 2
                  </span>
                </div>
                <FloorPlan />
                <p style={{ marginTop: 12, fontSize: 12, color: "#475569", textAlign: "center" }}>
                  Survolez les zones pour explorer les espaces
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── SPACE TYPES ───────────────────────────────────────────────── */}
      <section style={{ padding: "100px 5%", background: C.bg }} id="spaces">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: C.accentLight,
                  borderRadius: 30,
                  padding: "6px 16px",
                  marginBottom: 16,
                }}
              >
                <Building2 size={14} color={C.accentDark} />
                <span style={{ color: C.accentDark, fontSize: 13, fontWeight: 600 }}>Nos Espaces</span>
              </div>
              <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 800, color: C.slate, marginBottom: 16 }}>
                Un espace pour chaque façon de travailler
              </h2>
              <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
                Du Day Pass spontané au bureau privatif permanent — Nexus Hub s'adapte à votre rythme.
              </p>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
            {SPACE_TYPES.map((space, i) => (
              <SectionReveal key={space.name} delay={i * 0.12}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 20,
                    padding: 36,
                    border: `1px solid ${C.border}`,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "box-shadow 0.2s, transform 0.2s",
                  }}
                  className="group hover:-translate-y-1 hover:shadow-xl transition-all"
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      background: C.accentLight,
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                      fontSize: 16,
                      fontWeight: 800,
                      color: C.accentDark,
                    }}
                  >
                    {space.icon}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: C.accent,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: 8,
                    }}
                  >
                    {space.tagline}
                  </div>
                  <h3 style={{ fontSize: 24, fontWeight: 800, color: C.slate, marginBottom: 14 }}>{space.name}</h3>
                  <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.7, flex: 1 }}>{space.desc}</p>
                  <div
                    style={{
                      marginTop: 28,
                      paddingTop: 24,
                      borderTop: `1px solid ${C.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: 13, color: C.textMuted }}>À partir de </span>
                      <span style={{ fontSize: 28, fontWeight: 800, color: C.slate }}>{space.from}€</span>
                      <span style={{ fontSize: 13, color: C.textMuted }}>/{space.perDay ? "jour" : "mois"}</span>
                    </div>
                    <Link href="/templates/impact-35/pricing" style={{ textDecoration: "none" }}>
                      <button
                        type="button"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          background: C.accentLight,
                          color: C.accentDark,
                          padding: "10px 18px",
                          borderRadius: 8,
                          fontWeight: 600,
                          fontSize: 14,
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Voir les formules <ArrowRight size={14} />
                      </button>
                    </Link>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AMENITIES ─────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 5%", background: C.slate }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 800, color: C.white, marginBottom: 16 }}>
                Tout est inclus, dès le premier jour
              </h2>
              <p style={{fontSize: 17, color: brand ?? '#94a3b8', maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
                Pas de frais cachés. Chaque équipement fait partie de votre abonnement.
              </p>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {AMENITIES.map((a, i) => (
              <SectionReveal key={a.label} delay={i * 0.08}>
                <div
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    borderRadius: 16,
                    padding: 28,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    transition: "all 0.2s",
                    cursor: "default",
                  }}
                  className="hover:bg-lime-500/10 hover:border-lime-500/40"
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      background: `${C.accent}20`,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <a.icon size={22} color={C.accent} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.white }}>{a.label}</div>
                  <div style={{fontSize: 13, color: brand ?? '#94a3b8', lineHeight: 1.6 }}>{a.desc}</div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAND ────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 5%", background: C.accent }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 40,
          }}
        >
          {STATS.map((s, i) => (
            <SectionReveal key={s.label} delay={i * 0.1}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 900, color: C.white }}>{s.value}</div>
                <div style={{ fontSize: 15, color: "#dcfce7", marginTop: 6, fontWeight: 500 }}>{s.label}</div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
      <section style={{ padding: "100px 5%", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: C.accentLight,
                  borderRadius: 30,
                  padding: "6px 16px",
                  marginBottom: 16,
                }}
              >
                <Building2 size={14} color={C.accentDark} />
                <span style={{ color: C.accentDark, fontSize: 13, fontWeight: 600 }}>Témoignages membres</span>
              </div>
              <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 800, color: C.slate, marginBottom: 16 }}>
                Rejoignez 250+ membres satisfaits
              </h2>
            </div>
          </SectionReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28 }}>
            {TESTIMONIALS.map((t, i) => (
              <SectionReveal key={t.name} delay={i * 0.1}>
                <div
                  style={{
                    background: C.white,
                    borderRadius: 20,
                    padding: 32,
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    height: "100%",
                  }}
                >
                  <div style={{ display: "flex", gap: 4 }}>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={16} fill={C.accent} color={C.accent} />
                    ))}
                  </div>
                  <p style={{ fontSize: 15, color: C.text, lineHeight: 1.75, flex: 1 }}>"{t.text}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: C.accentLight,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 14,
                        color: C.accentDark,
                        flexShrink: 0,
                      }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: C.slate }}>{t.name}</div>
                      <div style={{ fontSize: 13, color: C.textMuted }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 5%", background: C.bgAlt }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <SectionReveal>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 50px)", fontWeight: 800, color: C.slate, marginBottom: 20 }}>{c?.aboutTitle ?? fd?.businessName ?? <>
              Prêt à rejoindre la communauté ?
            </>}</h2>
            <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.7 }}>{c?.aboutText ?? <>
              Trouvez l'environnement de travail idéal pour booster vos performances et votre créativité. Visitez-nous dès aujourd'hui.
            </>}</p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/templates/impact-35/pricing" style={{ textDecoration: "none" }}>
                <button
                  type="button"
                  style={{
                    background: C.slate,
                    color: C.white,
                    padding: "16px 36px",
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 16,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Découvrir les Tarifs
                </button>
              </Link>
              <Link href="/templates/impact-35/pricing#visite" style={{ textDecoration: "none" }}>
                <button
                  type="button"
                  style={{
                    background: C.accent,
                    color: C.white,
                    padding: "16px 36px",
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 16,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Planifier une visite
                </button>
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  )
}
