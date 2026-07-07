"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react'
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import Link from "next/link"
import { ArrowRight, MapPin, Mail, Phone, BedDouble, Bath, Maximize, Star, TrendingUp } from "lucide-react"

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#f8f7f4",
  bgSection: "#f0ede7",
  text: "#1e2b3c",
  textMuted: "#6b7a8d",
  accent: "#d4a853",
  accentDark: "#b8903e",
  accentLight: "#fdf5e6",
  white: "#ffffff",
  border: "#e2ddd5",
  navy: "#1e3a5f",
  shadow: "0 2px 14px rgba(30,43,60,0.08)",
  shadowLg: "0 16px 48px rgba(30,43,60,0.14)",
}
const FONT = "'Raleway', system-ui, sans-serif"
const FONT_SERIF = "'Playfair Display', Georgia, serif"

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "850+", label: "Biens vendus" },
  { value: "98%", label: "Satisfaction clients" },
  { value: "42j", label: "Délai moyen de vente" },
  { value: "20 ans", label: "D'expertise" },
]

const BIENS = [
  { titre: "Appartement de standing", lieu: "Paris 16e", prix: "1 480 000 €", surface: "145 m²", pieces: 5, bains: 2, tag: "Exclusivité", img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80" },
  { titre: "Maison familiale", lieu: "Neuilly-sur-Seine", prix: "2 250 000 €", surface: "280 m²", pieces: 7, bains: 3, tag: "Coup de cœur", img: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80" },
  { titre: "Penthouse vue Eiffel", lieu: "Paris 7e", prix: "3 900 000 €", surface: "210 m²", pieces: 5, bains: 3, tag: "Prestige", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80" },
  { titre: "Villa contemporaine", lieu: "Saint-Cloud", prix: "1 850 000 €", surface: "320 m²", pieces: 8, bains: 4, tag: "Jardin", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80" },
  { titre: "Loft design", lieu: "Paris 11e", prix: "890 000 €", surface: "120 m²", pieces: 3, bains: 2, tag: "Atypique", img: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80" },
  { titre: "Résidence Belle Époque", lieu: "Paris 8e", prix: "2 650 000 €", surface: "195 m²", pieces: 6, bains: 3, tag: "Haussmannien", img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80" },
]

const SERVICES = [
  { titre: "Estimation gratuite", desc: "Évaluation précise de votre bien en 48h, basée sur notre analyse du marché local et notre expertise de 20 ans.", icon: <TrendingUp size={22} color={C.accent} /> },
  { titre: "Mise en valeur", desc: "Home staging, photos professionnelles, visites virtuelles 3D. Votre bien présenté sous son meilleur jour dès le premier regard.", icon: <Maximize size={22} color={C.accent} /> },
  { titre: "Accompagnement complet", desc: "De la première visite jusqu'à la signature chez le notaire, notre équipe gère chaque étape pour une transaction sereine.", icon: <Star size={22} color={C.accent} /> },
]

const TEMOIGNAGES = [
  { texte: "Notre appartement parisien a été vendu en 18 jours au prix demandé. L'équipe Pierre & Co a géré tout le processus avec un professionnalisme remarquable. Je recommande sans hésiter.", auteur: "Catherine B.", detail: "Vente appartement 145 m², Paris 16e" },
  { texte: "Recherche longue et minutieuse, mais l'équipe ne s'est jamais découragée. Ils ont finalement trouvé notre maison de rêve à Neuilly — exactement ce que nous cherchions et dans notre budget.", auteur: "Famille Morin", detail: "Achat maison 280 m², Neuilly-sur-Seine" },
  { texte: "Honnêteté et transparence du début à la fin. Pas de surprises, pas de pression. Pierre & Co m'a conseillé au mieux de mes intérêts et pas des leurs. C'est rare dans ce métier.", auteur: "Jean-François A.", detail: "Achat + revente simultanés, Paris 7e" },
]

// ─── Components ───────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function PierreCoPage() {
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

  const heroRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 170])
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, -65])
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
    <div style={{ background: C.bg, fontFamily: FONT, overflowX: "hidden" }}>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');`}</style>

      {/* Navbar */}
      <motion.nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(20px, 5vw, 64px)",
        background: scrolled ? "rgba(248,247,244,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        transition: "all 0.4s ease",
      }}>
        <div>
          <span style={{ fontFamily: FONT_SERIF, fontSize: 20, color: scrolled ? C.text : "#fff" }}>Pierre</span>
          <span style={{ fontSize: 12, color: C.accent, fontWeight: 700, letterSpacing: 2, marginLeft: 6 }}>&amp; CO</span>
        </div>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="hidden md:flex">
          {["Biens", "Services", "Estimation", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.75)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href="#estimation" style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "9px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none" }} whileHover={{ background: C.accentDark }}>
            Estimer mon bien
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
          {["Biens", "Services", "Estimation", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.75)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href="#estimation" style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "9px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none" }} whileHover={{ background: C.accentDark }}>
            Estimer mon bien
          </motion.a>
        </div>
      )}

      {/* Hero */}
      <section id="hero" ref={heroRef} style={{ height: "115vh", minHeight: "900px", position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80" alt="Immobilier de prestige Pierre & Co" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,25,45,0.93) 0%, rgba(15,25,45,0.45) 45%, rgba(15,25,45,0.08) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.accent}15 0%, transparent 55%)` }} />

        <motion.div style={{ position: "relative", zIndex: 1, padding: "0 clamp(24px, 6vw, 80px) 90px", maxWidth: 820, y: heroTextY, opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 28, background: "rgba(212,168,83,0.15)", border: "1px solid rgba(212,168,83,0.35)", borderRadius: 20, padding: "7px 18px" }}>
            <span style={{ color: C.accent, fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Immobilier de prestige · Paris & IDF</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
            style={{ fontFamily: FONT_SERIF, fontSize: "clamp(46px, 6vw, 84px)", fontWeight: 400, color: "#fff", lineHeight: 1.05, letterSpacing: -0.5, marginBottom: 24 }}>{c?.heroHeadline ?? <>
            Votre bien,<br /><em style={{ color: C.accent }}>sa vraie valeur.</em>
          </>}</motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
            style={{ fontSize: 17, color: "rgba(255,255,255,0.72)", lineHeight: 1.75, marginBottom: 40, maxWidth: 520 }}>{c?.heroSubline ?? fd?.tagline ?? <>
            Pierre & Co accompagne acheteurs et vendeurs exigeants depuis 2004. Transparence totale, évaluation précise, réseau sélect : votre transaction en mains expertes.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <motion.a href="#biens" style={{ background: C.accent, color: C.text, borderRadius: 6, padding: "15px 32px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ background: C.accentDark, color: C.white, scale: 1.03 }}>
              Voir les biens <ArrowRight size={16} />
            </motion.a>
            <motion.a href="#estimation" style={{ background: "rgba(255,255,255,0.10)", color: "#fff", border: "1px solid rgba(255,255,255,0.28)", borderRadius: 6, padding: "13px 28px", fontWeight: 500, fontSize: 15, textDecoration: "none", backdropFilter: "blur(8px)" }} whileHover={{ background: "rgba(255,255,255,0.18)" }}>
              Estimation gratuite
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
      <section style={{ background: C.navy, padding: "0 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", maxWidth: 1100, margin: "0 auto" }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div style={{ padding: "36px 0", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 42, fontWeight: 400, color: C.accent, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 6 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Biens */}
      <section id="biens" style={{ padding: "110px 80px", background: C.bg }}>
        <Reveal>
          <div style={{ marginBottom: 60 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Nos exclusivités</span>
            <h2 style={{ fontFamily: FONT_SERIF, fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 400, color: C.text, marginTop: 12, lineHeight: 1.1 }}>
              Biens d'exception, <em>sélection rigoureuse</em>.
            </h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: 24, maxWidth: 1200, margin: "0 auto" }}>
          {BIENS.map((b, i) => (
            <Reveal key={b.titre} delay={i * 0.07}>
              <motion.div whileHover={{ y: -6 }} style={{ borderRadius: 12, overflow: "hidden", background: C.white, boxShadow: C.shadow, cursor: "pointer" }}>
                <div style={{ height: 220, overflow: "hidden", position: "relative" }}>
                  <img src={b.img} alt={b.titre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", top: 16, left: 16, background: C.accent, color: C.text, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700 }}>{b.tag}</div>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px", background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}>
                    <div style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>{b.prix}</div>
                  </div>
                </div>
                <div style={{ padding: "18px 22px 22px" }}>
                  <h3 style={{ fontFamily: FONT_SERIF, fontSize: 20, color: C.text, marginBottom: 8 }}>{b.titre}</h3>
                  <div style={{ display: "flex", gap: 14, color: C.textMuted, fontSize: 13 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} />{b.lieu}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Maximize size={12} />{b.surface}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><BedDouble size={12} />{b.pieces}p</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Bath size={12} />{b.bains}</span>
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
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Notre expertise</span>
            <h2 style={{ fontFamily: FONT_SERIF, fontSize: "clamp(30px, 3.5vw, 50px)", fontWeight: 400, color: C.text, marginTop: 12 }}>Un accompagnement <em>sans faille</em>.</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28, maxWidth: 1000, margin: "0 auto" }}>
          {SERVICES.map((s, i) => (
            <Reveal key={s.titre} delay={i * 0.1}>
              <div style={{ background: C.white, borderRadius: 14, padding: "36px 32px", boxShadow: C.shadow, border: `1px solid ${C.border}` }}>
                <div style={{ marginBottom: 18 }}>{s.icon}</div>
                <h3 style={{ fontFamily: FONT_SERIF, fontSize: 22, color: C.text, marginBottom: 10 }}>{s.titre}</h3>
                <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Témoignages */}
      <section id="contact" style={{ padding: "100px 80px", background: C.navy }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Témoignages</span>
            <h2 style={{ fontFamily: FONT_SERIF, fontSize: "clamp(30px, 3.5vw, 50px)", fontWeight: 400, color: "#fff", marginTop: 12 }}>La confiance, notre <em style={{ color: C.accent }}>meilleure référence</em>.</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
          {TEMOIGNAGES.map((t, i) => (
            <Reveal key={t.auteur} delay={i * 0.1}>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 14, padding: "32px 28px" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>{[...Array(5)].map((_, j) => <Star key={j} size={14} fill={C.accent} color={C.accent} />)}</div>
                <p style={{ fontFamily: FONT_SERIF, fontSize: 16, fontStyle: "italic", color: "rgba(255,255,255,0.82)", lineHeight: 1.72, marginBottom: 20 }}>"{t.texte}"</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16 }}>
                  <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{t.auteur}</div>
                  <div style={{ color: C.accent, fontSize: 12, marginTop: 4 }}>{t.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="estimation" style={{ padding: "110px 80px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Estimation gratuite</span>
          <h2 style={{ fontFamily: FONT_SERIF, fontSize: "clamp(34px, 4vw, 58px)", fontWeight: 400, color: C.text, margin: "16px 0 18px" }}>Découvrez la vraie valeur <em>de votre bien</em>.</h2>
          <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.7 }}>Évaluation offerte en 48h. Aucun engagement, aucune pression — juste une expertise honnête.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href={`tel:${fd?.phone ?? "+33140000000"}`} style={{ background: C.accent, color: C.text, borderRadius: 6, padding: "16px 36px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ background: C.accentDark, color: C.white, scale: 1.03 }}>
              <Phone size={18} /> 01 40 00 00 00
            </motion.a>
            <motion.a href={`mailto:${fd?.email ?? "contact@pierreandco.fr"}`} style={{ background: "transparent", color: C.text, border: `2px solid ${C.accentDark}`, borderRadius: 6, padding: "14px 32px", fontWeight: 600, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ background: C.accent, borderColor: C.accent }}>
              <Mail size={18} /> Nous écrire
            </motion.a>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer style={{ background: C.navy, padding: "56px 80px 28px", fontFamily: FONT }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 22, color: "#fff", marginBottom: 12 }}>Pierre <span style={{ color: C.accent }}>&amp; Co</span></div>
            <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 14, lineHeight: 1.6, maxWidth: 260 }}>Immobilier de prestige à Paris et Île-de-France depuis 2004.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[{ icon: <MapPin size={14} />, t: "Paris 8e & agences IDF" }, { icon: <Phone size={14} />, t: "01 40 00 00 00" }, { icon: <Mail size={14} />, t: "contact@pierreandco.fr" }].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
                <span style={{ color: C.accent }}>{item.icon}</span>{item.t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>© 2026 Pierre & Co Immobilier — Site réalisé par Aevia WS</span>
          <a href="#contact" style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, textDecoration: "none" }}>{c?.ctaText ?? <>Mentions légales</>}</a>
        </div>
      </footer>
    </div>
  )
}
