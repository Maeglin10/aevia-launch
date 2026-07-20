"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react'
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import Link from "next/link"
import { ArrowRight, MapPin, Mail, Phone, Clock, Star, Heart, Sun, Moon } from "lucide-react"

// ─── Design tokens ────────────────────────────────────────────────────────────
// Lightens (positive percent) or darkens (negative) a #rrggbb hex color —
// used to derive light/dark shades from the client's brand color.
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
  bg: "#f4f1eb",
  bgSection: "#eae5db",
  bgDark: "#2a3426",
  text: "#2a3426",
  textMuted: "#7a7e6e",
  accent: "#6b8f71",
  accentDark: "#4e6b53",
  accentLight: "#deeadf",
  warm: "#d4965a",
  white: "#ffffff",
  border: "#ddd7cc",
  shadow: "0 2px 14px rgba(42,52,38,0.08)",
  shadowLg: "0 16px 48px rgba(42,52,38,0.14)",
};const FONT = "'Josefin Sans', system-ui, sans-serif"
const FONT_SERIF = "'Lora', Georgia, serif"

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "8 ans", label: "D'enseignement" },
  { value: "420+", label: "Élèves formés" },
  { value: "4.9★", label: "Avis Google" },
  { value: "15+", label: "Cours par semaine" },
]

const COURS = [
  { nom: "Vinyasa Flow", niveau: "Tous niveaux", duree: "60 min", horaire: "Lun · Mar · Jeu 7h30", desc: "Enchaînement fluide de postures synchronisées avec la respiration. Renforce et libère.", icon: <Sun size={20} color={C.accent} /> },
  { nom: "Yin Yoga", niveau: "Tous niveaux", duree: "75 min", horaire: "Mer · Ven 18h30", desc: "Postures tenues en profondeur pour relâcher les fascias et cultiver l'introspection.", icon: <Moon size={20} color={C.accent} /> },
  { nom: "Yoga Prénatal", niveau: "Gestantes", duree: "60 min", horaire: "Mar · Jeu 10h00", desc: "Pratique douce et sécurisée pour accompagner chaque étape de la grossesse avec sérénité.", icon: <Heart size={20} color={C.warm} /> },
  { nom: "Ashtanga", niveau: "Intermédiaire", duree: "90 min", horaire: "Lun · Mer 6h30", desc: "Série codifiée de postures pratiquée dans un ordre précis. Discipline, force et endurance.", icon: <Sun size={20} color={C.warm} /> },
  { nom: "Méditation guidée", niveau: "Tous niveaux", duree: "45 min", horaire: "Mar · Jeu · Sam 12h30", desc: "Techniques de pleine conscience, respiration pranayama et relaxation profonde Yoga Nidra.", icon: <Moon size={20} color={C.accent} /> },
  { nom: "Yoga Restauratif", niveau: "Débutant / Récup", duree: "60 min", horaire: "Sam 11h00 · Dim 10h00", desc: "Postures soutenues par des accessoires pour une récupération active et un système nerveux apaisé.", icon: <Heart size={20} color={C.accent} /> },
]

const APPROCHE = [
  { titre: "Pratique authentique", desc: "Transmis dans la lignée de l'Ashtanga traditionnel, chaque cours s'adapte pourtant au corps et au rythme de chacun." },
  { titre: "Lieu apaisant", desc: "Un studio en bois et pierre naturelle, baigné de lumière, conçu pour favoriser la présence et le lâcher-prise." },
  { titre: "Petits groupes", desc: "Maximum 12 élèves par cours pour un suivi individualisé et des ajustements personnalisés à chaque pratique." },
]

const TEMOIGNAGES = [
  { texte: "Depuis que j'ai rejoint Lumière Yoga, ma relation avec mon corps a complètement changé. Les cours de Sophie sont à la fois exigeants et bienveillants. Un équilibre rare.", auteur: "Camille R.", detail: "Pratiquante depuis 2 ans, Vinyasa & Yin" },
  { texte: "Le yoga prénatal m'a accompagnée tout au long de ma grossesse. Sophie connaît parfaitement les besoins des futures mamans. Je me sentais entre de bonnes mains à chaque séance.", auteur: "Julie M.", detail: "Yoga prénatal, grossesse 2024" },
  { texte: "J'ai commencé sans aucune expérience. En 6 mois, je touche le sol avec les mains, mon dos ne me fait plus souffrir et je dors enfin bien. Le studio est un vrai sanctuaire.", auteur: "Marc P.", detail: "Pratiquant débutant, Yoga Restauratif" },
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
let brand: any = null;
// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function LumiereYogaPage() {
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
    C = { ...C, accent: brand };
  }

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
    return () => window.removeEventListener("scroll", h)
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
  }, [c]);return (
    <div style={{ background: C.bg, fontFamily: FONT, overflowX: "hidden" }}>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Navbar */}
      <motion.nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(20px, 5vw, 64px)",
        background: scrolled ? "rgba(244,241,235,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        transition: "all 0.4s ease",
      }}>
        <div>
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <>
              <span style={{ fontFamily: FONT_SERIF, fontSize: 18, fontStyle: "italic", color: scrolled ? C.accent : "#fff" }}>Lumière</span>
              <span style={{ fontSize: 13, letterSpacing: 4, fontWeight: 600, color: scrolled ? C.text : "rgba(255,255,255,0.8)", marginLeft: 8, textTransform: "uppercase" }}>Yoga Studio</span>
            </>
          )}
        </div>
        <div style={{ gap: 32, alignItems: "center" }} className="hidden md:flex">
          {["Cours", "Planning", "Tarifs", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.72)", fontSize: 13, fontWeight: 500, textDecoration: "none", letterSpacing: 1, textTransform: "uppercase" }}>{l}</a>
          ))}
          <motion.a href="#tarifs" style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "9px 22px", fontSize: 13, fontWeight: 600, textDecoration: "none", letterSpacing: 0.5, textTransform: "uppercase" }} whileHover={{ background: C.accentDark }}>
            Essai gratuit
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
          {["Cours", "Planning", "Tarifs", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.72)", fontSize: 13, fontWeight: 500, textDecoration: "none", letterSpacing: 1, textTransform: "uppercase" }}>{l}</a>
          ))}
          <motion.a href="#tarifs" style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "9px 22px", fontSize: 13, fontWeight: 600, textDecoration: "none", letterSpacing: 0.5, textTransform: "uppercase" }} whileHover={{ background: C.accentDark }}>
            Essai gratuit
          </motion.a>
        </div>
      )}

      {/* Hero */}
      <section id="hero" ref={heroRef} style={{ height: "115vh", minHeight: "900px", position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <img src={photo(0, "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=1920&q=80")} alt="Lumière Yoga Studio Bordeaux" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(20,28,18,0.92) 0%, rgba(20,28,18,0.40) 45%, rgba(20,28,18,0.06) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.accent}18 0%, transparent 55%)` }} />

        <motion.div style={{ position: "relative", zIndex: 1, padding: "0 clamp(24px, 6vw, 80px) 90px", maxWidth: 760, y: heroTextY, opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 28, background: "rgba(107,143,113,0.18)", border: "1px solid rgba(107,143,113,0.4)", borderRadius: 20, padding: "7px 18px" }}>
            <span style={{ color: C.accentLight, fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase" }}>Studio de yoga & méditation · Bordeaux</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
            style={{ fontFamily: FONT_SERIF, fontSize: "clamp(46px, 6vw, 82px)", fontWeight: 400, color: "#fff", lineHeight: 1.08, marginBottom: 24 }}>{c?.heroHeadline ?? <>
            Trouver l'équilibre,<br /><em style={{ color: C.accentLight }}>en soi et dans le monde.</em>
          </>}</motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
            style={{ fontSize: 17, color: "rgba(255,255,255,0.72)", lineHeight: 1.75, marginBottom: 40, maxWidth: 510 }}>{c?.heroSubline ?? fd?.tagline ?? <>
            Lumière Yoga accueille tous les niveaux dans un espace chaleureux et bienveillant à Bordeaux. Vinyasa, Yin, méditation — une pratique complète pour le corps et l'esprit.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <motion.a href="#cours" style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "15px 32px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, letterSpacing: 0.5 }} whileHover={{ background: C.accentDark, scale: 1.03 }}>
              Découvrir les cours <ArrowRight size={16} />
            </motion.a>
            <motion.a href="#contact" style={{ background: "rgba(255,255,255,0.10)", color: "#fff", border: "1px solid rgba(255,255,255,0.28)", borderRadius: 6, padding: "13px 28px", fontWeight: 500, fontSize: 15, textDecoration: "none", backdropFilter: "blur(8px)" }} whileHover={{ background: "rgba(255,255,255,0.18)" }}>
              Cours d'essai gratuit
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
          <div style={{ width: 24, height: 36, border: "2px solid rgba(255,255,255,0.35)", borderRadius: 12, display: "flex", justifyContent: "center", paddingTop: 6 }}>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: C.accentLight }} />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section style={{ background: C.bgDark, padding: "0 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(150px, 100%), 1fr))", maxWidth: 1100, margin: "0 auto" }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div style={{ padding: "36px 0", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 40, fontWeight: 400, color: C.accentLight, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.42)", marginTop: 6, letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Cours */}
      <section id="cours" style={{ padding: "110px 80px", background: C.bg }}>
        <Reveal>
          <div style={{ marginBottom: 64 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Programme</span>
            <h2 style={{ fontFamily: FONT_SERIF, fontSize: "clamp(32px, 4vw, 54px)", fontWeight: 400, color: C.text, marginTop: 12, lineHeight: 1.1 }}>
              Des cours pour <em>chaque besoin</em>.
            </h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 20, maxWidth: 1200, margin: "0 auto" }}>
          {COURS.map((c, i) => (
            <Reveal key={c.nom} delay={i * 0.07}>
              <motion.div whileHover={{ y: -5, boxShadow: C.shadowLg }} style={{ background: C.white, borderRadius: 14, padding: "28px 26px", border: `1px solid ${C.border}`, boxShadow: C.shadow, transition: "box-shadow 0.3s" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ padding: "10px", background: C.accentLight, borderRadius: 12 }}>{c.icon}</div>
                  <span style={{ fontSize: 11, color: C.accent, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", background: C.accentLight, borderRadius: 20, padding: "4px 12px" }}>{c.niveau}</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: C.text, marginBottom: 6, letterSpacing: 0.5 }}>{c.nom}</h3>
                <div style={{ display: "flex", gap: 12, color: C.textMuted, fontSize: 12, marginBottom: 12 }}>
                  <span><Clock size={11} style={{ display: "inline", marginRight: 4 }} />{c.duree}</span>
                  <span>{c.horaire}</span>
                </div>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.65 }}>{c.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Approche */}
      <section style={{ padding: "100px 80px", background: C.bgSection }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="grid-cols-1 md:grid-cols-2 imx-mobstack">
          <Reveal>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Notre philosophie</span>
            <h2 style={{ fontFamily: FONT_SERIF, fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 400, color: C.text, margin: "12px 0 32px", lineHeight: 1.15 }}>
              Le yoga comme <em>pratique de vie</em>, pas comme performance.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {APPROCHE.map((a) => (
                <div key={a.titre} style={{ borderLeft: `3px solid ${C.accent}`, paddingLeft: 20 }}>
                  <div style={{ fontWeight: 600, color: C.text, fontSize: 15, marginBottom: 6, letterSpacing: 0.5 }}>{a.titre}</div>
                  <div style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.65 }}>{a.desc}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "4/5" }}>
              <img src={photo(1, "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80")} alt="Pratique yoga Lumière Studio" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Témoignages */}
      <section id="contact" style={{ padding: "100px 80px", background: C.bgDark }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Ce qu'ils vivent</span>
            <h2 style={{ fontFamily: FONT_SERIF, fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 400, color: "#fff", marginTop: 12 }}>Des transformations <em style={{ color: C.accentLight }}>réelles</em>.</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 22, maxWidth: 1100, margin: "0 auto" }}>
          {TEMOIGNAGES.map((t, i) => (
            <Reveal key={t.auteur} delay={i * 0.1}>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "30px 26px" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>{[...Array(5)].map((_, j) => <Star key={j} size={13} fill={C.accent} color={C.accent} />)}</div>
                <p style={{ fontFamily: FONT_SERIF, fontSize: 15, fontStyle: "italic", color: "rgba(255,255,255,0.82)", lineHeight: 1.72, marginBottom: 20 }}>"{t.texte}"</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14 }}>
                  <div style={{ fontWeight: 600, color: "#fff", fontSize: 14 }}>{t.auteur}</div>
                  <div style={{ color: C.accent, fontSize: 12, marginTop: 4 }}>{t.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="tarifs" style={{ padding: "110px 80px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentDark }}>Rejoignez le studio</span>
          <h2 style={{ fontFamily: FONT_SERIF, fontSize: "clamp(32px, 4vw, 58px)", fontWeight: 400, color: C.text, margin: "16px 0 18px" }}>{c?.aboutTitle ?? fd?.businessName ?? <>Votre premier cours est <em>offert</em>.</>}</h2>
          <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.7 }}>{c?.aboutText ?? <>
            Essayez n'importe quel cours sans engagement. Vous avez 30 jours pour vous décider après votre première séance.
          </>}</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href={`mailto:${fd?.email ?? "contact@lumiereyoga.fr"}`} style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "16px 36px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, letterSpacing: 0.5 }} whileHover={{ background: C.accentDark, scale: 1.03 }}>
              <Mail size={18} /> Réserver mon cours d'essai
            </motion.a>
            <motion.a href={`tel:${fd?.phone ?? "+33556000000"}`} style={{ background: "transparent", color: C.text, border: `2px solid ${C.accentDark}`, borderRadius: 6, padding: "14px 30px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ background: C.accent, color: C.white, borderColor: C.accent }}>
              <Phone size={18} /> 05 56 00 00 00
            </motion.a>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer style={{ background: C.bgDark, padding: "52px 80px 26px", fontFamily: FONT }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 20, fontStyle: "italic", color: C.accentLight, marginBottom: 8 }}>Lumière Yoga</div>
            <p style={{ color: "rgba(255,255,255,0.40)", fontSize: 13, lineHeight: 1.6, maxWidth: 240 }}>Studio de yoga & méditation à Bordeaux. Ouvert 7j/7.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[{ icon: <MapPin size={13} />, t: "Bordeaux, Gironde" }, { icon: <Mail size={13} />, t: "contact@lumiereyoga.fr" }, { icon: <Clock size={13} />, t: "Lun–Dim 6h30–21h00" }].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.48)", fontSize: 13 }}>
                <span style={{ color: C.accent }}>{item.icon}</span>{item.t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 18, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ color: "rgba(255,255,255,0.24)", fontSize: 12 }}>© 2026 Lumière Yoga Studio — Site réalisé par Aevia WS</span>
          <a href="#contact" style={{ color: "rgba(255,255,255,0.24)", fontSize: 12, textDecoration: "none" }}>{c?.ctaText ?? <>Mentions légales</>}</a>
        </div>
      </footer>
    </div>
  )
}
