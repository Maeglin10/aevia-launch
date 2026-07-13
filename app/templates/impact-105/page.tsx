"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react'
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Phone, Mail, MapPin, Clock, Star, CheckCircle, ArrowRight, Leaf } from "lucide-react"

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
  bg: "#fdf9f5",
  bgSection: "#f5ede3",
  text: "#1e1209",
  textMuted: "#6b5245",
  accent: "#2d4a22",
  accentLight: "#e8f0e0",
  peach: "#c8855a",
  peachLight: "#f5e0d0",
  white: "#ffffff",
  border: "#e5d5c5",
  shadow: "0 2px 14px rgba(30,18,9,0.07)",
  shadowLg: "0 16px 48px rgba(30,18,9,0.13)",
};
const FONT = "'Mulish', system-ui, sans-serif"
const FONT_SERIF = "'Playfair Display', Georgia, serif"

const STATS = [
  { value: "12 ans", label: "De passion florale" },
  { value: "800+", label: "Mariages fleuris" },
  { value: "4.9★", label: "Avis Google" },
  { value: "48h", label: "Délai bouquets sur mesure" },
]

const CREATIONS = [
  { titre: "Bouquets & compositions", desc: "Bouquets de fleurs fraîches de saison, compositions table, centres de table et décorations personnalisées pour toutes occasions.", tag: "Frais" },
  { titre: "Mariage & cérémonie", desc: "Bouquet de mariée, boutonnières, décoration de salle et de cérémonie. Consultation offerte pour chaque projet mariage.", tag: "Mariage" },
  { titre: "Deuil & funérailles", desc: "Couronnes, gerbes et compositions florales sobres et élégantes. Livraison directe en chambre funéraire sur Strasbourg.", tag: "Recueillement" },
  { titre: "Abonnements entreprises", desc: "Décoration florale hebdomadaire ou bimensuelle pour accueil, salles de réunion et espaces de travail. Entretien inclus.", tag: "Entreprises" },
  { titre: "Fleurs séchées & éternelles", desc: "Compositions en fleurs séchées, pampassi, eucalyptus et gypsophile — déco longue durée au style bohème ou minimaliste.", tag: "Séchées" },
  { titre: "Livraison & abonnements", desc: "Livraison à domicile sur Strasbourg et alentours. Surprise florale mensuelle avec sélection de saison pour les amoureux des fleurs.", tag: "Livraison" },
]

const ATOUTS = [
  "Fleurs sourcées auprès de producteurs locaux et certifiés",
  "Création sur mesure selon vos couleurs et votre budget",
  "Livraison le jour même sur Strasbourg (commande avant 11h)",
  "Conseil personnalisé par nos fleuristes passionnées",
]

const AVIS = [
  { texte: "Le bouquet de mariée était exactement dans mes rêves. L'équipe a su capturer ce que je voulais dès le premier rendez-vous. Des fleurs magnifiques et un service hors pair.", auteur: "Juliette B.", detail: "Mariage, juin 2025" },
  { texte: "Abonnement floral mensuel pour notre cabinet dentaire depuis 1 an. Toujours ponctuels, créatifs et avec des compositions qui durent. Nos patients adorent.", auteur: "Cabinet Dr. Engel", detail: "Abonnement entreprise" },
  { texte: "Je commande régulièrement pour offrir. Chaque bouquet est soigné, bien emballé et les fleurs tiennent au moins 10 jours. Une vraie adresse de qualité à Strasbourg.", auteur: "Sophie K.", detail: "Cliente régulière" },
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
export default function AtelierBloomPage() {
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
    C = { ...C, peach: brand, peachLight: shadeColor(brand, 25) };
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
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Mulish:wght@300;400;600;700;800&display=swap');`}</style>

      {/* Navbar */}
      <motion.nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px",
        background: scrolled ? "rgba(253,249,245,0.97)" : "transparent",
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
          <div>
            <span style={{ fontFamily: FONT_SERIF, fontSize: 22, fontStyle: "italic", color: scrolled ? C.accent : "#fff" }}>Atelier</span>
            <span style={{ fontFamily: FONT_SERIF, fontSize: 22, color: scrolled ? C.peach : "rgba(255,255,255,0.85)" }}> Bloom</span>
          </div>
        )}
        <div id="mb105-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>      {["Créations", "Mariage", "Entreprises", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href={`tel:${fd?.phone ?? "+33388000000"}`} style={{ background: C.accent, color: C.white, borderRadius: 8, padding: "9px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none" }} whileHover={{ background: "#1e3318" }}>
            Commander
          </motion.a>
      </div>
        <button
          className="mb105-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 4 }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: "#fff", transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "#fff", transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "#fff", transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </motion.nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 99, background: "rgba(255,255,255,0.98)", borderBottom: "1px solid #e5e5e5", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20, backdropFilter: "blur(12px)" }}>
          {["Créations", "Mariage", "Entreprises", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href={`tel:${fd?.phone ?? "+33388000000"}`} style={{ background: C.accent, color: C.white, borderRadius: 8, padding: "9px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none" }} whileHover={{ background: "#1e3318" }}>
            Commander
          </motion.a>
        </div>
      )}
      <style>{`@media (max-width: 900px) { #mb105-nav { display: none !important; } .mb105-burger { display: flex !important; } }`}</style>

      {/* Hero */}
      <section id="hero" ref={heroRef} style={{ height: "115vh", minHeight: "900px", position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <img src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1920&q=80" alt="Atelier Bloom fleuriste Strasbourg" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,20,5,0.90) 0%, rgba(10,20,5,0.35) 45%, rgba(10,20,5,0.05) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.accent}22 0%, transparent 60%)` }} />

        <motion.div style={{ position: "relative", zIndex: 1, padding: "0 80px 90px", maxWidth: 780, y: heroTextY, opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, background: "rgba(45,74,34,0.20)", border: "1px solid rgba(45,74,34,0.40)", borderRadius: 20, padding: "7px 18px" }}>
            <Leaf size={12} color="#a8d498" />
            <span style={{color: brand ?? '#a8d498', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Fleuriste artisanale · Strasbourg</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
            style={{ fontFamily: FONT_SERIF, fontSize: "clamp(42px, 5.5vw, 72px)", fontWeight: 400, color: "#fff", lineHeight: 1.1, marginBottom: 24 }}>{c?.heroHeadline ?? <>
            La beauté du vivant,<br /><em>dans chaque bouquet.</em>
          </>}</motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
            style={{ fontSize: 17, color: "rgba(255,255,255,0.75)", lineHeight: 1.75, marginBottom: 40, maxWidth: 520 }}>{c?.heroSubline ?? fd?.tagline ?? <>
            Créations florales sur mesure pour vos moments de vie — mariages, anniversaires, deuils et décoration. Fleurs fraîches de saison, sourçage local, passion artisanale.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <motion.a href="#créations" style={{ background: C.accent, color: C.white, borderRadius: 8, padding: "15px 32px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 8px 32px ${C.accent}55` }} whileHover={{ scale: 1.03 }}>
              Voir les créations <ArrowRight size={16} />
            </motion.a>
            <motion.a href={`tel:${fd?.phone ?? "+33388000000"}`} style={{ background: "rgba(255,255,255,0.10)", color: "#fff", border: "1px solid rgba(255,255,255,0.28)", borderRadius: 8, padding: "13px 28px", fontWeight: 600, fontSize: 15, textDecoration: "none", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ background: "rgba(255,255,255,0.18)" }}>
              <Phone size={16} /> Commander
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
          <div style={{ width: 24, height: 36, border: "2px solid rgba(255,255,255,0.35)", borderRadius: 12, display: "flex", justifyContent: "center", paddingTop: 6 }}>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{width: 6, height: 6, borderRadius: "50%", background: brand ?? '#a8d498' }} />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section style={{ background: C.accent, padding: "0 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", maxWidth: 1100, margin: "0 auto" }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div style={{ padding: "30px 0", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.15)" : "none" }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Créations */}
      <section id="créations" style={{ padding: "110px 80px", background: C.bg }}>
        <Reveal>
          <div style={{ marginBottom: 60 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.peach }}>Nos créations</span>
            <h2 style={{ fontFamily: FONT_SERIF, fontSize: "clamp(30px, 4vw, 52px)", color: C.text, marginTop: 10, lineHeight: 1.15 }}>
              Un art floral <em>pour chaque occasion</em>.
            </h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, maxWidth: 1200, margin: "0 auto" }}>
          {CREATIONS.map((c, i) => (
            <Reveal key={c.titre} delay={i * 0.07}>
              <motion.div whileHover={{ y: -5, boxShadow: C.shadowLg }} style={{ background: C.white, borderRadius: 14, padding: "26px 24px", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                <span style={{ background: C.accentLight, color: C.accent, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{c.tag}</span>
                <h3 style={{ fontFamily: FONT_SERIF, fontSize: 18, color: C.text, margin: "14px 0 10px" }}>{c.titre}</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{c.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Savoir-faire */}
      <section style={{ padding: "100px 80px", background: C.bgSection }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <Reveal delay={0.1}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.peach }}>Notre engagement</span>
            <h2 style={{ fontFamily: FONT_SERIF, fontSize: "clamp(26px, 3vw, 44px)", color: C.text, margin: "12px 0 28px", lineHeight: 1.2 }}>
              Des fleurs <em>qui racontent</em><br />une histoire.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {ATOUTS.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <CheckCircle size={18} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.65 }}>{a}</span>
                </div>
              ))}
            </div>
            <motion.a href={`tel:${fd?.phone ?? "+33388000000"}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 32, background: C.peach, color: C.white, borderRadius: 8, padding: "13px 28px", fontWeight: 700, fontSize: 15, textDecoration: "none" }} whileHover={{ scale: 1.03 }}>
              Passer commande <ArrowRight size={16} />
            </motion.a>
          </Reveal>
          <Reveal>
            <img src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80" alt="Fleurs saisonnières artisanales" style={{ width: "100%", borderRadius: 16, aspectRatio: "4/3", objectFit: "cover" }} />
          </Reveal>
        </div>
      </section>

      {/* Avis */}
      <section style={{ padding: "100px 80px", background: C.text }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.peach }}>Témoignages</span>
            <h2 style={{ fontFamily: FONT_SERIF, fontSize: "clamp(28px, 3.5vw, 48px)", color: "#fff", marginTop: 10 }}>Ils ont <em style={{color: brand ?? '#a8d498' }}>adoré</em>.</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
          {AVIS.map((a, i) => (
            <Reveal key={a.auteur} delay={i * 0.1}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "28px 24px" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>{[...Array(5)].map((_, j) => <Star key={j} size={13} fill={C.peach} color={C.peach} />)}</div>
                <p style={{ fontFamily: FONT_SERIF, fontSize: 15, fontStyle: "italic", color: "rgba(255,255,255,0.8)", lineHeight: 1.72, marginBottom: 18 }}>"{a.texte}"</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14 }}>
                  <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{a.auteur}</div>
                  <div style={{ color: C.peach, fontSize: 12, marginTop: 4 }}>{a.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="contact" style={{ padding: "100px 80px", background: C.peachLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.peach }}>Commander</span>
          <h2 style={{ fontFamily: FONT_SERIF, fontSize: "clamp(28px, 4vw, 52px)", color: C.text, margin: "14px 0 16px" }}>{c?.aboutTitle ?? fd?.businessName ?? <>Offrez quelque chose <em>de vivant</em>.</>}</h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.7 }}>{c?.aboutText ?? <>
            Livraison le jour même à Strasbourg pour toute commande passée avant 11h. Bouquets à partir de 35€.
          </>}</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href={`tel:${fd?.phone ?? "+33388000000"}`} style={{ background: C.accent, color: C.white, borderRadius: 8, padding: "15px 36px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ scale: 1.03 }}>
              <Phone size={18} /> 03 88 00 00 00
            </motion.a>
            <motion.a href={`mailto:${fd?.email ?? "hello@atelierbloom.fr"}`} style={{ background: "transparent", color: C.text, border: `2px solid ${C.peach}`, borderRadius: 8, padding: "13px 32px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ background: C.peach, color: C.white, borderColor: C.peach }}>
              <Mail size={18} />{fd?.email ?? "hello@atelierbloom.fr"}</motion.a>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer style={{ background: C.text, padding: "48px 80px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 36 }}>
          <div>
            <div style={{fontFamily: FONT_SERIF, fontSize: 20, fontStyle: "italic", color: brand ?? '#a8d498', marginBottom: 8 }}>Atelier Bloom</div>
            <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, lineHeight: 1.6 }}>Fleuriste artisanale · Strasbourg<br />Lun–Sam 9h–19h</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {[{ icon: <MapPin size={13} />, t: "Strasbourg, Bas-Rhin" }, { icon: <Phone size={13} />, t: "03 88 00 00 00" }, { icon: <Clock size={13} />, t: "Lun–Sam 9h–19h" }].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.42)", fontSize: 13 }}>
                <span style={{ color: C.peach }}>{item.icon}</span>{item.t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ color: "rgba(255,255,255,0.22)", fontSize: 12 }}>© 2026 Atelier Bloom — Site par Aevia WS</span>
          <a href="#contact" style={{ color: "rgba(255,255,255,0.22)", fontSize: 12, textDecoration: "none" }}>{c?.ctaText ?? <>Mentions légales</>}</a>
        </div>
      </footer>
    </div>
  )
}
