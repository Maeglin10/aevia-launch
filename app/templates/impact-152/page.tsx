"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react'
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import Link from "next/link"
import { ArrowRight, MapPin, Mail, Phone, Clock, Star, ChevronDown } from "lucide-react"

// Hoisted above the design tokens: several templates read `brand` in a
// module-level const — declaring it lower caused a TDZ ReferenceError (500).
let brand: any = null;

// ─── Design tokens ────────────────────────────────────────────────────────────
// Lightens (positive percent) or darkens (negative) a #rrggbb hex color —
// used to derive companion shades from the client's brand color.
function shadeColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) return hex;
  const amt = Math.round(2.55 * percent);
  const r = Math.max(0, Math.min(255, (num >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

let C: Record<string, string> = {
  bg: "#f7f3ef",
  bgSection: "#f0ebe4",
  text: "#2c2420",
  textMuted: "#7a6e68",
  accent: '#c4a882',
  accentDark: "#a88c68",
  accentLight: "#f0e8dc",
  white: "#ffffff",
  border: "#e5ddd5",
  shadow: "0 2px 12px rgba(44,36,32,0.08)",
  shadowLg: "0 12px 40px rgba(44,36,32,0.14)",
};
const FONT = "'Cormorant Garamond', Georgia, serif"
const FONT_SANS = "'DM Sans', system-ui, sans-serif"

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "130+", label: "Projets livrés" },
  { value: "12 ans", label: "D'expérience" },
  { value: "4.9★", label: "Note clients" },
  { value: "8", label: "Prix de design" },
]

const PROJETS = [
  { titre: "Villa contemporaine", lieu: "Lyon 5e", surface: "220 m²", style: "Minimaliste", tag: "Résidentiel", img: "https://images.unsplash.com/photo-1600210491892-03d54f9a12b1?w=800&q=80" },
  { titre: "Penthouse panoramique", lieu: "Lyon 2e", surface: "160 m²", style: "Art Déco moderne", tag: "Prestige", img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80" },
  { titre: "Maison de maître", lieu: "Villeurbanne", surface: "310 m²", style: "Classique revisité", tag: "Rénovation", img: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80" },
  { titre: "Loft industriel", lieu: "Lyon 7e", surface: "140 m²", style: "Industriel chic", tag: "Loft", img: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&q=80" },
  { titre: "Appartement haussmannien", lieu: "Lyon 1er", surface: "180 m²", style: "Parisien épuré", tag: "Résidentiel", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80" },
  { titre: "Boutique concept store", lieu: "Part-Dieu", surface: "95 m²", style: "Retail design", tag: "Commercial", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80" },
]

const SERVICES = [
  { titre: "Conseil & Conception", desc: "De l'esquisse au dossier complet : plan, élévations, matériaux, mobilier. Chaque détail est pensé avant la première vis.", emoji: "✏️" },
  { titre: "Suivi de chantier", desc: "Coordination des artisans, contrôle qualité à chaque étape, livraison clé en main sans surprise de budget.", emoji: "🏗️" },
  { titre: "Décoration complète", desc: "Sélection de mobilier, luminaires, textiles et œuvres d'art. Une cohérence visuelle de la première pièce à la dernière.", emoji: "🪑" },
]

const TEMOIGNAGES = [
  { texte: "Clémence a transformé notre appartement en un espace où il fait vraiment bon vivre. Son sens du détail et sa rigueur sont bluffants — et le budget a été parfaitement respecté.", auteur: "Marie & Thomas L.", projet: "Appartement 160 m², Lyon 2e" },
  { texte: "Nous avions peur de perdre le caractère de notre maison ancienne. Le Studio Noma a su magnifier les volumes tout en apportant la modernité qu'on cherchait. Résultat magistral.", auteur: "Édouard V.", projet: "Maison de maître, Villeurbanne" },
  { texte: "Un accompagnement de A à Z, professionnel et chaleureux. Notre boutique est maintenant l'une des plus belles de la galerie. Les ventes ont bondi de 40% depuis l'ouverture.", auteur: "Sophie K.", projet: "Concept store, Part-Dieu" },
]

// ─── Components ───────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
export default function StudioNomaPage() {
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
  if (brand) {
    C = { ...C, accent: brand, accentLight: shadeColor(brand, 25), accentDark: shadeColor(brand, -20) };
  }

  const heroRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 180])
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, -70])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  React.useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", h)
    
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
return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div style={{ background: C.bg, fontFamily: FONT_SANS, overflowX: "hidden" }}>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>

      {/* Navbar */}
      <motion.nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(20px, 5vw, 64px)",
        background: scrolled ? "rgba(247,243,239,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        transition: "all 0.4s ease",
      }}>
        {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <><span style={{ fontFamily: FONT, fontSize: 22, fontWeight: 600, color: scrolled ? C.text : "#fff", letterSpacing: 1 }}>Studio <em>Noma</em></span></>
          )}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="hidden md:flex">
          {["Projets", "Services", "Atelier", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.75)", fontSize: 14, fontWeight: 500, textDecoration: "none", transition: "color 0.2s", fontFamily: FONT_SANS }}>{l}</a>
          ))}
          <motion.a href="#contact" style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "9px 22px", fontSize: 14, fontWeight: 600, textDecoration: "none", fontFamily: FONT_SANS }} whileHover={{ background: C.accentDark }}>
            Consultation gratuite
          </motion.a>
        </div>
        
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </motion.nav>
      
      {mobileOpen && (
        <div style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 99, background: "rgba(255,255,255,0.97)", borderBottom: "1px solid #e5e5e5", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20, backdropFilter: "blur(12px)" }}>
          {["Projets", "Services", "Atelier", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.75)", fontSize: 14, fontWeight: 500, textDecoration: "none", transition: "color 0.2s", fontFamily: FONT_SANS }}>{l}</a>
          ))}
          <motion.a href="#contact" style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "9px 22px", fontSize: 14, fontWeight: 600, textDecoration: "none", fontFamily: FONT_SANS }} whileHover={{ background: C.accentDark }}>
            Consultation gratuite
          </motion.a>
        </div>
      )}

      {/* Hero */}
      <section id="hero" ref={heroRef} style={{ height: "115vh", minHeight: "900px", position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=80" alt="Intérieur Studio Noma" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(20,12,8,0.90) 0%, rgba(20,12,8,0.42) 45%, rgba(20,12,8,0.08) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.accent}18 0%, transparent 55%)` }} />

        <motion.div style={{ position: "relative", zIndex: 1, padding: "0 clamp(24px, 6vw, 80px) 90px", maxWidth: 820, y: heroTextY, opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ color: C.accent, fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", fontFamily: FONT_SANS }}>Architecture d'intérieur · Lyon</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }}
            style={{ fontFamily: FONT, fontSize: "clamp(52px, 7vw, 96px)", fontWeight: 300, color: "#fff", lineHeight: 1.0, letterSpacing: -1, marginBottom: 24 }}>{c?.heroHeadline ?? <>
            L'espace comme<br /><em style={{ color: C.accent }}>œuvre d'art.</em>
          </>}</motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
            style={{ fontSize: 17, color: "rgba(255,255,255,0.72)", lineHeight: 1.75, marginBottom: 40, maxWidth: 520, fontFamily: FONT_SANS }}>{c?.heroSubline ?? fd?.tagline ?? <>
            Studio Noma conçoit des intérieurs qui racontent une histoire. Chaque projet naît d'une écoute profonde et d'une maîtrise artisanale des matières, des volumes et de la lumière.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <motion.a href="#projets" style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "15px 32px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, fontFamily: FONT_SANS }} whileHover={{ background: C.accentDark, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              Voir nos réalisations <ArrowRight size={16} />
            </motion.a>
            <motion.a href="#contact" style={{ background: "rgba(255,255,255,0.10)", color: "#fff", border: "1px solid rgba(255,255,255,0.28)", borderRadius: 6, padding: "13px 28px", fontWeight: 500, fontSize: 15, textDecoration: "none", backdropFilter: "blur(8px)", fontFamily: FONT_SANS }} whileHover={{ background: "rgba(255,255,255,0.18)" }}>
              Consultation gratuite
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
          <div style={{ width: 24, height: 36, border: "2px solid rgba(255,255,255,0.35)", borderRadius: 12, display: "flex", justifyContent: "center", paddingTop: 6 }}>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section id="realisations" style={{ background: C.text, padding: "0 80px", fontFamily: FONT_SANS }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", maxWidth: 1100, margin: "0 auto" }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div style={{ padding: "36px 0", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 42, fontWeight: 300, color: C.accent, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 6, letterSpacing: 0.5 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Projets */}
      <section id="projets" style={{ padding: "110px 80px", background: C.bg }}>
        <Reveal>
          <div style={{ marginBottom: 64 }}>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: C.accent, fontFamily: FONT_SANS }}>Nos réalisations</span>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(36px, 4vw, 60px)", fontWeight: 300, color: C.text, marginTop: 12, lineHeight: 1.1 }}>
              Chaque projet, une <em>signature</em>.
            </h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, maxWidth: 1200, margin: "0 auto" }}>
          {PROJETS.map((p, i) => (
            <Reveal key={p.titre} delay={i * 0.07}>
              <motion.div whileHover={{ y: -6 }} style={{ borderRadius: 12, overflow: "hidden", background: C.white, boxShadow: C.shadow, cursor: "pointer" }}>
                <div style={{ height: 220, overflow: "hidden", position: "relative" }}>
                  <img src={p.img} alt={p.titre} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }} />
                  <div style={{ position: "absolute", top: 16, right: 16, background: C.accent, color: C.white, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, fontFamily: FONT_SANS }}>{p.tag}</div>
                </div>
                <div style={{ padding: "20px 24px 24px" }}>
                  <h3 style={{ fontFamily: FONT, fontSize: 22, fontWeight: 600, color: C.text, marginBottom: 6 }}>{p.titre}</h3>
                  <div style={{ display: "flex", gap: 16, color: C.textMuted, fontSize: 13, fontFamily: FONT_SANS }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} />{p.lieu}</span>
                    <span>{p.surface}</span>
                    <span style={{ color: C.accent, fontStyle: "italic", fontFamily: FONT }}>{p.style}</span>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" style={{ padding: "100px 80px", background: C.bgSection }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: C.accent, fontFamily: FONT_SANS }}>Notre offre</span>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(32px, 3.5vw, 52px)", fontWeight: 300, color: C.text, marginTop: 12 }}>Un accompagnement <em>sur-mesure</em>.</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28, maxWidth: 1000, margin: "0 auto" }}>
          {SERVICES.map((s, i) => (
            <Reveal key={s.titre} delay={i * 0.1}>
              <div style={{ background: C.white, borderRadius: 16, padding: "40px 36px", boxShadow: C.shadow, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 36, marginBottom: 20 }}>{s.emoji}</div>
                <h3 style={{ fontFamily: FONT, fontSize: 24, fontWeight: 600, color: C.text, marginBottom: 12 }}>{s.titre}</h3>
                <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.7, fontFamily: FONT_SANS }}>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Témoignages */}
      <section style={{ padding: "100px 80px", background: C.text }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: C.accent, fontFamily: FONT_SANS }}>Ce qu'ils disent</span>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(32px, 3.5vw, 52px)", fontWeight: 300, color: "#fff", marginTop: 12 }}>La confiance de nos <em style={{ color: C.accent }}>clients</em>.</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
          {TEMOIGNAGES.map((t, i) => (
            <Reveal key={t.auteur} delay={i * 0.1}>
              <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 16, padding: "32px 28px" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>{[...Array(5)].map((_, j) => <Star key={j} size={14} fill="#c4a882" color="#c4a882" />)}</div>
                <p style={{ fontFamily: FONT, fontSize: 17, fontStyle: "italic", color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: 20 }}>"{t.texte}"</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.10)", paddingTop: 16 }}>
                  <div style={{ fontWeight: 600, color: "#fff", fontSize: 14, fontFamily: FONT_SANS }}>{t.auteur}</div>
                  <div style={{ color: C.accent, fontSize: 12, marginTop: 4, fontFamily: FONT_SANS }}>{t.projet}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="contact" style={{ padding: "110px 80px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark, fontFamily: FONT_SANS }}>Démarrons ensemble</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(36px, 4vw, 64px)", fontWeight: 300, color: C.text, margin: "16px 0 20px" }}>{c?.aboutTitle ?? fd?.businessName ?? <>Votre projet mérite un <em>regard neuf</em>.</>}</h2>
          <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 520, margin: "0 auto 44px", lineHeight: 1.7, fontFamily: FONT_SANS }}>{c?.aboutText ?? <>
            Une consultation de 45 minutes offerte pour présenter votre projet et explorer les possibilités ensemble.
          </>}</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href={`mailto:${fd?.email ?? "contact@studionoma.fr"}`} style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "16px 36px", fontWeight: 600, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, fontFamily: FONT_SANS }} whileHover={{ background: C.accentDark, scale: 1.03 }}>
              <Mail size={18} /> Prendre rendez-vous
            </motion.a>
            <motion.a href={`tel:${fd?.phone ?? "+33478000000"}`} style={{ background: "transparent", color: C.text, border: `2px solid ${C.accent}`, borderRadius: 6, padding: "14px 32px", fontWeight: 600, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, fontFamily: FONT_SANS }} whileHover={{ background: C.accent, color: C.white }}>
              <Phone size={18} /> 04 78 00 00 00
            </motion.a>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer style={{ background: C.text, padding: "56px 80px 28px", fontFamily: FONT_SANS }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 400, color: "#fff", marginBottom: 12 }}>Studio <em style={{ color: C.accent }}>Noma</em></div>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.6, maxWidth: 260 }}>Architecture d'intérieur & décoration à Lyon depuis 2012.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[{ icon: <MapPin size={14} />, t: "Lyon, Rhône-Alpes" }, { icon: <Mail size={14} />, t: "contact@studionoma.fr" }, { icon: <Clock size={14} />, t: "Lun–Ven 9h–18h" }].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.55)", fontSize: 14 }}>
                <span style={{ color: C.accent }}>{item.icon}</span>{item.t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ color: "rgba(255,255,255,0.28)", fontSize: 13 }}>© 2026 Studio Noma — Site réalisé par Aevia WS</span>
          <a href="#contact" style={{ color: "rgba(255,255,255,0.28)", fontSize: 13, textDecoration: "none" }}>{c?.ctaText ?? <>Mentions légales</>}</a>
        </div>
      </footer>
    </div>
  )
}
