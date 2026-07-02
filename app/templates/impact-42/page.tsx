"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react';
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ArrowRight,
  Star,
  Clock,
  Check,
  Calendar,
} from "lucide-react";
import {
  C,
  EQBars,
  ArtistMarquee,
  SectionReveal,
  FAQItem,
  marqueeArtists,
  homeStudios,
  gear,
  testimonials,
  packages,
  faqs,
} from "./shared";


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function EchoChamberPage() {
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

  const [activeStudio, setActiveStudio] = useState(0);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  
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
    <div style={{ fontFamily: C.bodyFont, backgroundColor: C.bg, color: C.text, overflowX: "clip" }}>
      {/* HERO */}
      <section
        ref={heroRef}
        style={{ minHeight: "100vh", backgroundColor: C.bg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", paddingTop: "5rem" }}
      >
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)", pointerEvents: "none", zIndex: 1 }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 700, height: 700, borderRadius: "50%", backgroundColor: C.accent, filter: "blur(180px)", opacity: 0.06, pointerEvents: "none" }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity, textAlign: "center", maxWidth: 960, padding: "2rem 1.5rem", position: "relative", zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ display: "flex", justifyContent: "center", marginBottom: "2.5rem" }}>
            <EQBars />
          </motion.div>

          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ display: "inline-block", backgroundColor: `${C.accent}18`, border: `1px solid ${C.accent}44`, color: C.accent, padding: "0.3rem 1rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.5rem", fontFamily: C.bodyFont }}
          >
            Studio d'enregistrement professionnel — Paris
          </motion.span>

          <motion.h1 initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.2 }}
            style={{ fontFamily: C.headingFont, fontSize: "clamp(4rem, 10vw, 9rem)", fontWeight: 400, color: C.white, lineHeight: 0.95, marginBottom: "1.5rem", letterSpacing: "0.04em" }}
          >{c?.heroHeadline ?? <>
            ECHO<br />
            <span style={{ color: C.accent }}>CHAMBER</span>
          </>}</motion.h1>

          <motion.p initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.34 }}
            style={{ fontFamily: C.bodyFont, fontSize: "1.05rem", color: C.textLight, maxWidth: 540, margin: "0 auto 3rem", lineHeight: 1.75, letterSpacing: "0.01em" }}
          >{c?.heroSubline ?? fd?.tagline ?? <>
            Trois studios indépendants. SSL, Neve, Pro Tools HDX. 200+ artistes enregistrés. Votre son mérite ce qu'il y a de mieux.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.48 }}
            style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link href="/templates/impact-42/booking" style={{ textDecoration: "none" }}>
              <button
                type="button"
                style={{ backgroundColor: C.accent, color: C.white, padding: "1rem 2.6rem", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: C.bodyFont, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: `0 8px 30px ${C.accentGlow}`, letterSpacing: "0.03em" }}
              >
                Réserver une session <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/templates/impact-42/studios" style={{ textDecoration: "none" }}>
              <button
                type="button"
                style={{ border: `1px solid ${C.border}`, color: C.text, padding: "1rem 2.6rem", borderRadius: "6px", background: "none", cursor: "pointer", fontWeight: 600, fontFamily: C.bodyFont, fontSize: "0.95rem" }}
              >
                Visiter les studios
              </button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.62 }}
            style={{ display: "flex", gap: "3.5rem", justifyContent: "center", marginTop: "4.5rem", flexWrap: "wrap" }}
          >
            {[
              { val: "3", label: "studios indépendants" },
              { val: "200+", label: "artistes enregistrés" },
              { val: "12 ans", label: "d'expérience" },
              { val: "Lun–Dim", label: "10h – 23h" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: C.headingFont, fontSize: "2rem", letterSpacing: "0.06em", color: C.accent }}>{s.val}</div>
                <div style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", color: C.textMuted, marginTop: "0.25rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 9, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          style={{ position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", zIndex: 3 }}
        >
          <ChevronDown color={C.accent} size={28} opacity={0.6} />
        </motion.div>
      </section>

      {/* ── STUDIOS SHOWCASE ── */}
      <section style={{ padding: "7rem 2rem", backgroundColor: C.bgAlt }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ marginBottom: "3.5rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Nos espaces</span>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: C.white, margin: "0.4rem 0 0", letterSpacing: "0.04em" }}>TROIS STUDIOS, UNE VISION</h2>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2.5rem", borderBottom: `1px solid ${C.border}`, paddingBottom: "1px" }}>
              {homeStudios.map((s, i) => (
                <button key={s.name} type="button" onClick={() => setActiveStudio(i)}
                  style={{ padding: "0.75rem 1.75rem", background: "none", border: "none", cursor: "pointer", fontFamily: C.headingFont, fontSize: "1.1rem", letterSpacing: "0.08em", color: activeStudio === i ? s.color : C.textMuted, borderBottom: activeStudio === i ? `2px solid ${s.color}` : "2px solid transparent", transition: "all 0.2s", marginBottom: "-1px" }}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </SectionReveal>

          <AnimatePresence mode="wait">
            <motion.div key={activeStudio} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem", alignItems: "start" }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "1rem" }}>
                  <span style={{ fontFamily: C.headingFont, fontSize: "3rem", color: homeStudios[activeStudio].color, letterSpacing: "0.04em" }}>{homeStudios[activeStudio].name}</span>
                  <span style={{ fontFamily: C.bodyFont, fontSize: "0.8rem", color: homeStudios[activeStudio].color, border: `1px solid ${homeStudios[activeStudio].color}55`, padding: "0.2rem 0.6rem", borderRadius: "4px", fontWeight: 700 }}>{homeStudios[activeStudio].size}</span>
                </div>
                <p style={{ fontFamily: C.bodyFont, fontSize: "0.95rem", color: C.textLight, lineHeight: 1.8, marginBottom: "2rem" }}>{homeStudios[activeStudio].desc}</p>
                <Link href="/templates/impact-42/booking" style={{ textDecoration: "none" }}>
                  <button type="button"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: homeStudios[activeStudio].color, color: C.white, padding: "0.8rem 1.8rem", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: C.bodyFont, fontSize: "0.88rem", boxShadow: `0 4px 20px ${homeStudios[activeStudio].color}33` }}
                  >
                    <Calendar size={15} /> Réserver {homeStudios[activeStudio].name}
                  </button>
                </Link>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {homeStudios[activeStudio].features.map((feat) => (
                  <div key={feat} style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "0.8rem 1rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: homeStudios[activeStudio].color, flexShrink: 0 }} />
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.83rem", color: C.text }}>{feat}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── ARTISTS MARQUEE ── */}
      <section style={{ padding: "5rem 0", backgroundColor: C.bg, overflow: "hidden" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto 3rem", padding: "0 2rem" }}>
          <SectionReveal>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Ils ont enregistré ici</span>
              <div style={{ flex: 1, height: "1px", backgroundColor: C.border }} />
            </div>
            <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: C.white, letterSpacing: "0.04em", margin: "0 0 2.5rem" }}>200+ ARTISTES ET PRODUCTEURS</h2>
          </SectionReveal>
        </div>
        <ArtistMarquee artists={marqueeArtists} />
      </section>

      {/* ── GEAR ── */}
      <section style={{ padding: "7rem 2rem", backgroundColor: C.bgAlt }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ marginBottom: "3.5rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Matériel</span>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.5rem, 6vw, 4rem)", color: C.white, margin: "0.4rem 0 0", letterSpacing: "0.04em" }}>NOTRE ARSENAL</h2>
            </div>
          </SectionReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {gear.map((g, i) => (
              <SectionReveal key={g.category} delay={i * 0.07}>
                <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "1.75rem" }}>
                  <h3 style={{ fontFamily: C.headingFont, fontSize: "1.2rem", color: C.accent, letterSpacing: "0.06em", marginBottom: "1.25rem" }}>{g.category}</h3>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {g.items.map((item) => (
                      <li key={item} style={{ fontFamily: C.bodyFont, fontSize: "0.87rem", color: C.textLight, padding: "0.4rem 0", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: C.accent, flexShrink: 0 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "7rem 2rem", backgroundColor: C.bg }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ marginBottom: "3.5rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Avis clients</span>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.5rem, 6vw, 4rem)", color: C.white, margin: "0.4rem 0 0", letterSpacing: "0.04em" }}>ILS EN PARLENT</h2>
            </div>
          </SectionReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.75rem" }}>
            {testimonials.map((t, i) => (
              <SectionReveal key={t.name} delay={i * 0.1}>
                <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "2.25rem", height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", gap: "0.3rem", marginBottom: "1.25rem" }}>
                    {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={14} color={C.accent} fill={C.accent} />)}
                  </div>
                  <p style={{ fontFamily: C.bodyFont, fontSize: "0.92rem", color: C.textLight, lineHeight: 1.8, flex: 1, fontStyle: "italic" }}>"{t.text}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", marginTop: "1.75rem" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "8px", backgroundColor: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: C.headingFont, fontSize: "1rem", color: C.white, letterSpacing: "0.04em", flexShrink: 0 }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div style={{ fontFamily: C.bodyFont, fontWeight: 700, fontSize: "0.9rem", color: C.white }}>{t.name}</div>
                      <div style={{ fontFamily: C.bodyFont, fontSize: "0.78rem", color: C.textMuted, marginTop: "0.1rem" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PACKAGES ── */}
      <section style={{ padding: "7rem 2rem", backgroundColor: C.bgAlt }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ marginBottom: "3.5rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>Tarifs</span>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.5rem, 6vw, 4rem)", color: C.white, margin: "0.4rem 0 0", letterSpacing: "0.04em" }}>CHOISISSEZ VOTRE SESSION</h2>
            </div>
          </SectionReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", alignItems: "start" }}>
            {packages.map((pkg, i) => (
              <SectionReveal key={pkg.name} delay={i * 0.1}>
                <div style={{ backgroundColor: pkg.popular ? C.accent : pkg.color, border: `1px solid ${pkg.border}`, borderRadius: "12px", padding: "2.25rem", position: "relative", display: "flex", flexDirection: "column" }}>
                  {pkg.popular && (
                    <div style={{ position: "absolute", top: "-13px", right: "1.5rem", backgroundColor: C.white, color: C.accent, padding: "0.25rem 0.85rem", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 800, fontFamily: C.bodyFont, letterSpacing: "0.08em" }}>
                      LE PLUS DEMANDÉ
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                    <Clock size={14} color={pkg.popular ? C.white : C.accent} opacity={0.7} />
                    <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, color: pkg.popular ? C.white : C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>{pkg.duration}</span>
                  </div>
                  <h3 style={{ fontFamily: C.headingFont, fontSize: "1.6rem", color: pkg.popular ? C.white : pkg.accentColor, letterSpacing: "0.06em", marginBottom: "0.35rem" }}>{pkg.name}</h3>
                  <div style={{ fontFamily: C.bodyFont, fontSize: "0.82rem", color: pkg.popular ? "rgba(255,255,255,0.7)" : C.textMuted, marginBottom: "1.25rem" }}>{pkg.studio}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem", marginBottom: "0.5rem" }}>
                    <span style={{ fontFamily: C.headingFont, fontSize: "3rem", color: pkg.popular ? C.white : pkg.accentColor, letterSpacing: "0.02em" }}>{pkg.price}€</span>
                  </div>
                  <p style={{ fontFamily: C.bodyFont, fontSize: "0.85rem", color: pkg.popular ? "rgba(255,255,255,0.72)" : C.textMuted, marginBottom: "2rem", lineHeight: 1.6 }}>{pkg.desc}</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2.25rem", flex: 1 }}>
                    {pkg.items.map((item) => (
                      <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", marginBottom: "0.7rem" }}>
                        <Check size={14} color={pkg.popular ? C.white : C.accent} style={{ flexShrink: 0, marginTop: "0.18rem" }} />
                        <span style={{ fontFamily: C.bodyFont, fontSize: "0.85rem", color: pkg.popular ? "rgba(255,255,255,0.85)" : C.textLight }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/templates/impact-42/booking" style={{ textDecoration: "none" }}>
                    <button
                      type="button"
                      style={{ display: "block", width: "100%", textAlign: "center", backgroundColor: pkg.popular ? C.white : C.accent, color: pkg.popular ? C.accent : C.white, padding: "0.9rem", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: C.bodyFont, fontSize: "0.9rem", letterSpacing: "0.03em" }}
                    >
                      Réserver cette session
                    </button>
                  </Link>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "7rem 2rem", backgroundColor: C.bg }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ marginBottom: "3.5rem" }}>
              <span style={{ fontFamily: C.bodyFont, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent }}>FAQ</span>
              <h2 style={{ fontFamily: C.headingFont, fontSize: "clamp(2.5rem, 6vw, 4rem)", color: C.white, margin: "0.4rem 0 0", letterSpacing: "0.04em" }}>VOS QUESTIONS</h2>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            {faqs.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
