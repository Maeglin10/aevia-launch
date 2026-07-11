"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react'
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Code2, Phone, Mail, MapPin, Star, CheckCircle, ArrowRight, Layers, Sparkles, Globe } from "lucide-react"

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
  bg: "#f8fafc",
  bgDark: "#0f172a",
  bgSection: "#f1f5f9",
  text: "#0f172a",
  textMuted: "#64748b",
  accent: "#6366f1",
  accentDark: "#4f46e5",
  accentLight: "#e0e7ff",
  violet2: "#8b5cf6",
  white: "#ffffff",
  border: "#e2e8f0",
  shadow: "0 2px 12px rgba(15,23,42,0.07)",
  shadowLg: "0 16px 48px rgba(99,102,241,0.18)",
};const FONT = "'Space Grotesk', system-ui, sans-serif"
const FONT_BODY = "'Inter', system-ui, sans-serif"

const STATS = [
  { value: "8 ans", label: "D'expertise digitale" },
  { value: "140+", label: "Projets livrés" },
  { value: "4.9★", label: "Note clients" },
  { value: "30j", label: "Délai MVP moyen" },
]

const SERVICES = [
  { titre: "Sites web & landing pages", desc: "Conception et développement de sites vitrines, e-commerce et landing pages haute conversion. Next.js, Webflow ou sur mesure selon vos besoins.", tag: "Web" },
  { titre: "Identité visuelle & branding", desc: "Logo, charte graphique, guide de marque. Nous créons une identité cohérente qui parle à vos cibles et vous distingue de vos concurrents.", tag: "Brand" },
  { titre: "Applications web & SaaS", desc: "Développement d'applications métier, dashboards, outils internes et produits SaaS. Full-stack React/Node, architecture évolutive.", tag: "App" },
  { titre: "SEO & acquisition digitale", desc: "Audit technique, stratégie de contenu, optimisation on-page. Nous vous positionnons sur les requêtes qui génèrent du business.", tag: "SEO" },
  { titre: "Campagnes Meta & Google Ads", desc: "Création et pilotage de campagnes publicitaires payantes. Ciblage précis, A/B testing créatifs, reporting transparent chaque semaine.", tag: "Ads" },
  { titre: "Maintenance & évolution", desc: "Support réactif, mises à jour de sécurité, évolutions fonctionnelles. Contrats mensuels à partir de 290€/mois pour sécuriser votre actif digital.", tag: "Support" },
]

const REALISATIONS = [
  { client: "MaisonDéco Paris", sector: "E-commerce", desc: "Refonte UX + boutique Shopify. +68% de taux de conversion en 3 mois.", img: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=600&q=80" },
  { client: "Cabinet Forêt & Associés", sector: "Juridique", desc: "Site vitrine + SEO local. Page 1 sur 8 requêtes cibles en 4 mois.", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80" },
  { client: "Startup Finly", sector: "FinTech", desc: "MVP SaaS de 0 à prod en 6 semaines. Levée de fonds facilités par la démo.", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80" },
]

const ATOUTS = [
  "Interlocuteur unique de la stratégie à la livraison",
  "Délais tenus : 97% de nos projets livrés à date",
  "Code source livré et hébergement autonome",
  "Reporting mensuel chiffré et actionnable",
]

const AVIS = [
  { texte: "Pixel Republic a transformé notre site en véritable machine à leads. En 6 mois, nos demandes de devis ont doublé. L'équipe est réactive, créative et vraiment à l'écoute.", auteur: "Sébastien K.", detail: "Directeur, SolarPlus" },
  { texte: "Nous avions un budget serré et un délai court pour notre MVP. Résultat livré en 28 jours, zéro bug en prod, et nos utilisateurs adorent l'interface. Bluffant.", auteur: "Léa M.", detail: "CEO, Trackly" },
  { texte: "Refonte complète en 3 mois — branding, site, SEO. Premier retour sur investissement en moins de 6 mois. On ne change pas d'agence.", auteur: "Famille Dupont", detail: "Propriétaire, L'Atelier Dupont" },
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
export default function PixelRepublicPage() {
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
    <div style={{ background: C.bg, fontFamily: FONT_BODY, overflowX: "hidden" }}>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');`}</style>

      {/* Navbar */}
      <motion.nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px",
        background: scrolled ? "rgba(248,250,252,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        transition: "all 0.4s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: FONT }}>
          {fd?.logoBase64 ? (
            // Client logo (uploaded in the brief) replaces the placeholder mark —
            // essential for the client to recognise their brand in the render.
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: "contain", display: "block" }}
            />
          ) : (
            <>
              <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${C.accent}, ${C.violet2})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Code2 size={16} color="#fff" />
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, color: scrolled ? C.text : "#fff" }}>Pixel<span style={{ color: C.accent }}>Republic</span></span>
            </>
          )}
        </div>
        <div id="mb25-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>      {["Services", "Réalisations", "Tarifs", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href="#contact" style={{ background: C.accent, color: C.white, borderRadius: 8, padding: "9px 22px", fontSize: 14, fontWeight: 600, textDecoration: "none", fontFamily: FONT }} whileHover={{ background: C.accentDark }}>
            Démarrer un projet
          </motion.a>
      </div>
        <button
          className="mb25-burger"
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
          {["Services", "Réalisations", "Tarifs", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href="#contact" style={{ background: C.accent, color: C.white, borderRadius: 8, padding: "9px 22px", fontSize: 14, fontWeight: 600, textDecoration: "none", fontFamily: FONT }} whileHover={{ background: C.accentDark }}>
            Démarrer un projet
          </motion.a>
        </div>
      )}
      <style>{`@media (max-width: 900px) { #mb25-nav { display: none !important; } .mb25-burger { display: flex !important; } }`}</style>

      {/* Hero */}
      <section ref={heroRef} style={{ height: "115vh", minHeight: "900px", position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80" alt="Agence web Pixel Republic Paris" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,5,20,0.93) 0%, rgba(5,5,20,0.48) 45%, rgba(5,5,20,0.10) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.accent}20 0%, transparent 55%)` }} />

        <motion.div style={{ position: "relative", zIndex: 1, padding: "0 80px 90px", maxWidth: 780, y: heroTextY, opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.35)", borderRadius: 20, padding: "7px 18px" }}>
            <Sparkles size={12} color={C.accent} />
            <span style={{ color: C.accent, fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", fontFamily: FONT }}>Agence digitale · Paris</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
            style={{ fontFamily: FONT, fontSize: "clamp(40px, 5.5vw, 72px)", fontWeight: 700, color: "#fff", lineHeight: 1.05, marginBottom: 24 }}>{c?.heroHeadline ?? <>
            Votre présence digitale,<br /><span style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.violet2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>enfin à votre niveau.</span>
          </>}</motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
            style={{ fontSize: 17, color: "rgba(255,255,255,0.72)", lineHeight: 1.75, marginBottom: 40, maxWidth: 530 }}>{c?.heroSubline ?? fd?.tagline ?? <>
            Pixel Republic crée des sites web, applications et identités visuelles qui convertissent. Stratégie, design, développement — une seule équipe, de A à Z.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <motion.a href="#contact" style={{ background: C.accent, color: C.white, borderRadius: 8, padding: "15px 32px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 8px 32px ${C.accent}44`, fontFamily: FONT }} whileHover={{ background: C.accentDark, scale: 1.03 }}>
              Démarrer un projet <ArrowRight size={16} />
            </motion.a>
            <motion.a href="#réalisations" style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.20)", borderRadius: 8, padding: "13px 28px", fontWeight: 500, fontSize: 15, textDecoration: "none", backdropFilter: "blur(8px)" }} whileHover={{ background: "rgba(255,255,255,0.14)" }}>
              Voir nos réalisations
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
          <div style={{ width: 24, height: 36, border: "2px solid rgba(255,255,255,0.30)", borderRadius: 12, display: "flex", justifyContent: "center", paddingTop: 6 }}>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section style={{ background: C.bgDark, padding: "0 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", maxWidth: 1100, margin: "0 auto" }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div style={{ padding: "30px 0", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 36, fontWeight: 700, color: C.accent, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 6 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" style={{ padding: "110px 80px", background: C.bg }}>
        <Reveal>
          <div style={{ marginBottom: 60 }}>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: C.accent, fontFamily: FONT }}>Nos services</span>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 700, color: C.text, marginTop: 10, lineHeight: 1.1 }}>
              Tout ce dont votre business<br />a besoin en ligne.
            </h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, maxWidth: 1200, margin: "0 auto" }}>
          {SERVICES.map((s, i) => (
            <Reveal key={s.titre} delay={i * 0.07}>
              <motion.div whileHover={{ y: -5, boxShadow: C.shadowLg }} style={{ background: C.white, borderRadius: 14, padding: "26px 24px", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                <span style={{ background: C.accentLight, color: C.accentDark, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, fontFamily: FONT }}>{s.tag}</span>
                <h3 style={{ fontFamily: FONT, fontSize: 17, fontWeight: 600, color: C.text, margin: "14px 0 10px" }}>{s.titre}</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{s.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Réalisations */}
      <section id="réalisations" style={{ padding: "100px 80px", background: C.bgSection }}>
        <Reveal>
          <div style={{ marginBottom: 52 }}>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: C.accent, fontFamily: FONT }}>Réalisations</span>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 700, color: C.text, marginTop: 10 }}>Projets récents.</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 22, maxWidth: 1200, margin: "0 auto" }}>
          {REALISATIONS.map((r, i) => (
            <Reveal key={r.client} delay={i * 0.1}>
              <motion.div whileHover={{ y: -6 }} style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                <img src={r.img} alt={r.client} style={{ width: "100%", height: 200, objectFit: "cover" }} />
                <div style={{ padding: "20px 22px", background: C.white }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontFamily: FONT, fontWeight: 700, color: C.text, fontSize: 16 }}>{r.client}</span>
                    <span style={{ background: C.accentLight, color: C.accentDark, borderRadius: 12, padding: "2px 10px", fontSize: 11, fontWeight: 700, fontFamily: FONT }}>{r.sector}</span>
                  </div>
                  <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>{r.desc}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pourquoi */}
      <section style={{ padding: "100px 80px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <Reveal delay={0.1}>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: C.accent, fontFamily: FONT }}>Notre différence</span>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3vw, 44px)", fontWeight: 700, color: C.text, margin: "12px 0 28px", lineHeight: 1.15 }}>
              Une agence qui mesure<br />ses résultats.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {ATOUTS.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <CheckCircle size={18} color={C.accent} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.65 }}>{a}</span>
                </div>
              ))}
            </div>
            <motion.a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 32, background: C.accent, color: C.white, borderRadius: 8, padding: "13px 28px", fontWeight: 600, fontSize: 15, textDecoration: "none", fontFamily: FONT }} whileHover={{ background: C.accentDark, scale: 1.02 }}>
              Parler de votre projet <ArrowRight size={16} />
            </motion.a>
          </Reveal>
          <Reveal>
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" alt="Equipe Pixel Republic" style={{ width: "100%", borderRadius: 16, aspectRatio: "4/3", objectFit: "cover" }} />
          </Reveal>
        </div>
      </section>

      {/* Avis */}
      <section style={{ padding: "100px 80px", background: C.bgDark }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: C.accent, fontFamily: FONT }}>Témoignages</span>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 700, color: "#fff", marginTop: 10 }}>Ce que disent <span style={{ color: C.accent }}>nos clients</span>.</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
          {AVIS.map((a, i) => (
            <Reveal key={a.auteur} delay={i * 0.1}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "28px 24px" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>{[...Array(5)].map((_, j) => <Star key={j} size={13} fill={C.accent} color={C.accent} />)}</div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 18 }}>"{a.texte}"</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 14 }}>
                  <div style={{ fontFamily: FONT, fontWeight: 600, color: "#fff", fontSize: 14 }}>{a.auteur}</div>
                  <div style={{ color: C.accent, fontSize: 12, marginTop: 4 }}>{a.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="contact" style={{ padding: "100px 80px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20, background: "rgba(99,102,241,0.10)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 20, padding: "6px 16px" }}>
            <Globe size={14} color={C.accentDark} />
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: C.accentDark, fontFamily: FONT }}>Audit digital offert</span>
          </div>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 700, color: C.text, marginBottom: 16 }}>{c?.aboutTitle ?? fd?.businessName ?? <>Prêt à accélérer ?</>}</h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.7 }}>{c?.aboutText ?? <>
            Un premier échange de 30 minutes pour comprendre vos enjeux et vous proposer une stratégie sur mesure. Sans engagement.
          </>}</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href={`mailto:${fd?.email ?? "hello@pixelrepublic.fr"}`} style={{ background: C.accent, color: C.white, borderRadius: 8, padding: "15px 36px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, fontFamily: FONT }} whileHover={{ background: C.accentDark, scale: 1.03 }}>
              <Mail size={18} />{fd?.email ?? "hello@pixelrepublic.fr"}</motion.a>
            <motion.a href={`tel:${fd?.phone ?? "+33144000000"}`} style={{ background: "transparent", color: C.text, border: `2px solid ${C.accent}`, borderRadius: 8, padding: "13px 32px", fontWeight: 600, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, fontFamily: FONT }} whileHover={{ background: C.accent, color: C.white }}>
              <Phone size={18} /> 01 44 00 00 00
            </motion.a>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer style={{ background: C.bgDark, padding: "48px 80px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 36 }}>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: C.accent, marginBottom: 8 }}>PixelRepublic</div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, lineHeight: 1.6 }}>Agence digitale · Paris<br />Lun–Ven 9h–18h30</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {[{ icon: <MapPin size={13} />, t: "Paris, Île-de-France" }, { icon: <Phone size={13} />, t: "01 44 00 00 00" }, { icon: <Mail size={13} />, t: "hello@pixelrepublic.fr" }].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.40)", fontSize: 13 }}>
                <span style={{ color: C.accent }}>{item.icon}</span>{item.t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ color: "rgba(255,255,255,0.20)", fontSize: 12 }}>© 2026 Pixel Republic — Site par Aevia WS</span>
          <a href="/templates/impact-25/legal" style={{ color: "rgba(255,255,255,0.20)", fontSize: 12, textDecoration: "none" }}>{c?.ctaText ?? <>Mentions légales</>}</a>
        </div>
      </footer>
    </div>
  )
}
