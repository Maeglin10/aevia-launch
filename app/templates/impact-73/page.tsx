// @ts-nocheck
"use client"

import React, {useRef, useState, useEffect} from 'react'
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Music, Phone, Mail, MapPin, Clock, Star, CheckCircle, ArrowRight, Guitar } from "lucide-react"

const C = {
  bg: "#fdf8f0",
  bgSection: "#f5eddc",
  text: "#1a0a3d",
  textMuted: "#6b5e80",
  accent: "#1a0a3d",
  purple: "#5e35b1",
  purpleLight: "#ede7f6",
  amber: "#e67c3b",
  amberLight: "#fdefd3",
  white: "#ffffff",
  border: "#e0d5c0",
  shadow: "0 2px 14px rgba(26,10,61,0.08)",
  shadowLg: "0 16px 48px rgba(230,124,59,0.18)",
}
const FONT = "'Spectral', Georgia, serif"
const FONT_BODY = "'Poppins', system-ui, sans-serif"

const STATS = [
  { value: "18 ans", label: "D'enseignement" },
  { value: "320+", label: "Élèves formés" },
  { value: "8", label: "Professeurs certifiés" },
  { value: "4 ans", label: "Âge minimum" },
]

const COURS = [
  { titre: "Piano classique & contemporain", desc: "Initiation à la maîtrise, de 4 ans à l'adulte. Préparation aux concours et examens du conservatoire. Méthode Suzuki disponible pour les plus jeunes.", tag: "Piano" },
  { titre: "Guitare acoustique & électrique", desc: "Classique, folk, rock, jazz — nous adaptons l'enseignement à votre univers musical. Cours individuels et en petits groupes à partir de 6 ans.", tag: "Guitare" },
  { titre: "Chant & technique vocale", desc: "Travail de la voix, placement, respiration, répertoire. Chant lyrique, pop, musical. Préparation aux auditions et concours.", tag: "Chant" },
  { titre: "Batterie & percussions", desc: "Des bases du rythme aux techniques avancées. Cours adulte le soir, enfant en journée. Kits électroniques disponibles pour les cours silencieux.", tag: "Batterie" },
  { titre: "Formation musicale (solfège)", desc: "Lecture, écriture, oreille musicale. Cours en groupe pour les enfants (5–12 ans) et individuels pour les adultes. Prépare à tous les instruments.", tag: "Solfège" },
  { titre: "Cours en ligne & stages", desc: "Cours en visioconférence disponibles pour tous les instruments. Stages intensifs vacances scolaires : 2 jours pour progresser comme en 3 mois.", tag: "En ligne" },
]

const POINTS_FORTS = [
  "Professeurs diplômés d'État ou du Conservatoire National",
  "Cours individuels et collectifs adaptés à chaque âge",
  "Audition des élèves organisée 2 fois par an",
  "Prêt de partitions et accès aux salles de répétition",
]

const TEMOIGNAGES = [
  { texte: "Ma fille de 7 ans fait du piano depuis 2 ans. La progression est spectaculaire et surtout elle ADORE aller en cours — ce qui dit tout de la qualité des professeurs. Merci à l'équipe.", auteur: "Nathalie B.", detail: "Piano enfant, 7 ans" },
  { texte: "J'ai repris la guitare à 45 ans après 20 ans d'arrêt. Cours parfaitement adapté à mon niveau et à mes disponibilités. Je rejoue enfin des morceaux que je croyais perdus.", auteur: "Luc D.", detail: "Guitare adulte" },
  { texte: "Mon fils prépare son entrée au conservatoire. Les profs connaissent parfaitement les attentes des jurys — il a été admis du premier coup. Merci infiniment.", auteur: "Famille Girard", detail: "Préparation conservatoire" },
]

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function ConservatoireAccordPage() {
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
    <div style={{ background: C.bg, fontFamily: FONT_BODY, overflowX: "hidden" }}>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Poppins:wght@300;400;500;600;700&display=swap');`}</style>

      {/* Navbar */}
      <motion.nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px",
        background: scrolled ? "rgba(253,248,240,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        transition: "all 0.4s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Music size={20} color={scrolled ? C.amber : "#fff"} />
          <span style={{ fontFamily: FONT, fontSize: 18, fontStyle: "italic", color: scrolled ? C.text : "#fff" }}>Conservatoire<span style={{ color: C.amber }}> Accord</span></span>
        </div>
        <div id="mb73-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>      {["Cours", "Professeurs", "Tarifs", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href="#contact" style={{ background: C.amber, color: C.white, borderRadius: 8, padding: "9px 22px", fontSize: 14, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }} whileHover={{ background: "#d06a2e" }}>
            <Guitar size={14} /> S'inscrire
          </motion.a>
      </div>
        <button
          className="mb73-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 4 }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </motion.nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 99, background: "rgba(255,255,255,0.98)", borderBottom: "1px solid #e5e5e5", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20, backdropFilter: "blur(12px)" }}>
          {["Cours", "Professeurs", "Tarifs", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href="#contact" style={{ background: C.amber, color: C.white, borderRadius: 8, padding: "9px 22px", fontSize: 14, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }} whileHover={{ background: "#d06a2e" }}>
            <Guitar size={14} /> S'inscrire
          </motion.a>
        </div>
      )}
      <style>{`@media (max-width: 900px) { #mb73-nav { display: none !important; } .mb73-burger { display: flex !important; } }`}</style>

      {/* Hero */}
      <section ref={heroRef} style={{ height: "115vh", minHeight: "900px", position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <img src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=1920&q=80" alt="Conservatoire Accord école de musique Lyon" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,3,22,0.93) 0%, rgba(8,3,22,0.42) 45%, rgba(8,3,22,0.08) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.purple}18 0%, transparent 55%)` }} />

        <motion.div style={{ position: "relative", zIndex: 1, padding: "0 80px 90px", maxWidth: 760, y: heroTextY, opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, background: "rgba(230,124,59,0.15)", border: "1px solid rgba(230,124,59,0.35)", borderRadius: 20, padding: "7px 18px" }}>
            <Music size={12} color={C.amber} />
            <span style={{ color: C.amber, fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>École de musique · Lyon 6e</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
            style={{ fontFamily: FONT, fontSize: "clamp(40px, 5.2vw, 68px)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: 24 }}>{c?.heroHeadline ?? <>
            La musique s'apprend<br /><em style={{ color: C.amber }}>avec passion et méthode.</em>
          </>}</motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
            style={{ fontSize: 17, color: "rgba(255,255,255,0.72)", lineHeight: 1.75, marginBottom: 40, maxWidth: 520 }}>{c?.heroSubline ?? fd?.tagline ?? <>
            Conservatoire Accord forme les musiciens de 4 à 99 ans à Lyon depuis 18 ans. Piano, guitare, chant, batterie, solfège — cours individuels ou en groupe, enfants et adultes.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <motion.a href="#contact" style={{ background: C.amber, color: C.white, borderRadius: 8, padding: "15px 32px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 8px 32px ${C.amber}44` }} whileHover={{ background: "#d06a2e", scale: 1.03 }}>
              S'inscrire <ArrowRight size={16} />
            </motion.a>
            <motion.a href="#cours" style={{ background: "rgba(255,255,255,0.10)", color: "#fff", border: "1px solid rgba(255,255,255,0.28)", borderRadius: 8, padding: "13px 28px", fontWeight: 500, fontSize: 15, textDecoration: "none", backdropFilter: "blur(8px)" }} whileHover={{ background: "rgba(255,255,255,0.18)" }}>
              Nos cours
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
          <div style={{ width: 24, height: 36, border: "2px solid rgba(255,255,255,0.35)", borderRadius: 12, display: "flex", justifyContent: "center", paddingTop: 6 }}>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: C.amber }} />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section style={{ background: C.accent, padding: "0 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", maxWidth: 1100, margin: "0 auto" }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div style={{ padding: "30px 0", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.10)" : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 36, fontWeight: 300, color: C.amber, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.48)", marginTop: 6 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Cours */}
      <section id="cours" style={{ padding: "110px 80px", background: C.bg }}>
        <Reveal>
          <div style={{ marginBottom: 60 }}>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: C.amber }}>Nos cours</span>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 300, color: C.text, marginTop: 10, lineHeight: 1.15 }}>
              Un instrument pour<br /><em>chaque vocation.</em>
            </h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, maxWidth: 1200, margin: "0 auto" }}>
          {COURS.map((c, i) => (
            <Reveal key={c.titre} delay={i * 0.07}>
              <motion.div whileHover={{ y: -5, boxShadow: C.shadowLg }} style={{ background: C.white, borderRadius: 14, padding: "26px 24px", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                <span style={{ background: C.amberLight, color: "#b5561a", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{c.tag}</span>
                <h3 style={{ fontFamily: FONT, fontSize: 18, fontWeight: 400, color: C.text, margin: "14px 0 10px" }}>{c.titre}</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{c.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Points forts */}
      <section style={{ padding: "100px 80px", background: C.bgSection }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <Reveal delay={0.1}>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: C.amber }}>Notre pédagogie</span>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3vw, 44px)", fontWeight: 300, color: C.text, margin: "12px 0 28px", lineHeight: 1.2 }}>
              L'excellence musicale,<br /><em>accessible à tous.</em>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {POINTS_FORTS.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <CheckCircle size={18} color={C.amber} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.65 }}>{p}</span>
                </div>
              ))}
            </div>
            <motion.a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 32, background: C.amber, color: C.white, borderRadius: 8, padding: "13px 28px", fontWeight: 600, fontSize: 15, textDecoration: "none" }} whileHover={{ background: "#d06a2e", scale: 1.02 }}>
              S'inscrire <ArrowRight size={16} />
            </motion.a>
          </Reveal>
          <Reveal>
            <img src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80" alt="Cours de musique enfant Lyon" style={{ width: "100%", borderRadius: 16, aspectRatio: "4/3", objectFit: "cover" }} />
          </Reveal>
        </div>
      </section>

      {/* Témoignages */}
      <section style={{ padding: "100px 80px", background: C.accent }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: C.amber }}>Témoignages</span>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 300, color: "#fff", marginTop: 10 }}>Des élèves <em style={{ color: C.amber }}>qui progressent.</em></h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
          {TEMOIGNAGES.map((t, i) => (
            <Reveal key={t.auteur} delay={i * 0.1}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.amber}20`, borderRadius: 14, padding: "28px 24px" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>{[...Array(5)].map((_, j) => <Star key={j} size={13} fill={C.amber} color={C.amber} />)}</div>
                <p style={{ fontFamily: FONT, fontSize: 15, fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.80)", lineHeight: 1.72, marginBottom: 18 }}>"{t.texte}"</p>
                <div style={{ borderTop: `1px solid ${C.amber}18`, paddingTop: 14 }}>
                  <div style={{ fontWeight: 600, color: "#fff", fontSize: 14 }}>{t.auteur}</div>
                  <div style={{ color: C.amber, fontSize: 12, marginTop: 4 }}>{t.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="contact" style={{ padding: "100px 80px", background: C.amberLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: "#b5561a" }}>Inscriptions ouvertes</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 300, color: C.text, margin: "14px 0 16px" }}>{c?.aboutTitle ?? fd?.businessName ?? <>Commencez<br /><em>votre aventure musicale.</em></>}</h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.7 }}>{c?.aboutText ?? <>
            Cours d'essai gratuit pour tout nouvel élève. Inscriptions possibles en cours d'année sous réserve de disponibilités.
          </>}</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href={`tel:${fd?.phone ?? "+33478000000"}`} style={{ background: C.accent, color: C.white, borderRadius: 8, padding: "15px 36px", fontWeight: 600, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ scale: 1.03 }}>
              <Phone size={18} /> 04 78 00 00 00
            </motion.a>
            <motion.a href={`mailto:${fd?.email ?? "contact@conservatoire-accord.fr"}`} style={{ background: "transparent", color: C.text, border: `2px solid ${C.accent}`, borderRadius: 8, padding: "13px 32px", fontWeight: 600, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ background: C.accent, color: C.white }}>
              <Mail size={18} /> Nous écrire
            </motion.a>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer style={{ background: C.accent, padding: "48px 80px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 36 }}>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 18, fontStyle: "italic", fontWeight: 300, color: C.amber, marginBottom: 8 }}>Conservatoire Accord</div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, lineHeight: 1.6 }}>École de musique · Lyon 6e<br />Lun–Sam 10h–20h</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {[{ icon: <MapPin size={13} />, t: "Lyon 6e, Rhône" }, { icon: <Phone size={13} />, t: "04 78 00 00 00" }, { icon: <Clock size={13} />, t: "Lun–Sam 10h–20h" }].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.40)", fontSize: 13 }}>
                <span style={{ color: C.amber }}>{item.icon}</span>{item.t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${C.amber}20`, paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ color: "rgba(255,255,255,0.20)", fontSize: 12 }}>© 2026 Conservatoire Accord — Site par Aevia WS</span>
          <a href="/templates/impact-73/legal" style={{ color: "rgba(255,255,255,0.20)", fontSize: 12, textDecoration: "none" }}>{c?.ctaText ?? <>Mentions légales</>}</a>
        </div>
      </footer>
    </div>
  )
}
