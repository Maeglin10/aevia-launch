"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react'
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Zap, Phone, Mail, MapPin, Clock, CheckCircle, Star, ArrowRight, Shield, Wrench, Lightbulb } from "lucide-react"

const C = {
  bg: "#f7f8fa",
  bgSection: "#eef1f5",
  text: "#0f1c2e",
  textMuted: "#5a6a7e",
  accent: "#f59e0b",
  accentDark: "#d97706",
  accentLight: "#fef3c7",
  dark: "#1a2744",
  white: "#ffffff",
  border: "#e2e8f0",
  shadow: "0 2px 12px rgba(15,28,46,0.07)",
  shadowLg: "0 16px 48px rgba(15,28,46,0.13)",
}
const FONT = "'Outfit', system-ui, sans-serif"

const STATS = [
  { value: "18 ans", label: "D'expérience" },
  { value: "2 400+", label: "Chantiers réalisés" },
  { value: "4.9★", label: "Note clients" },
  { value: "24h", label: "Intervention d'urgence" },
]

const SERVICES = [
  { titre: "Installation électrique neuve", desc: "Tableau électrique, câblage, prises et éclairages pour constructions neuves et rénovations complètes. Mise aux normes NF C 15-100.", tag: "Installation" },
  { titre: "Mise aux normes & diagnostic", desc: "Diagnostic électrique obligatoire, mise en conformité du tableau et des circuits. Rapport CONSUEL inclus pour toute installation neuve.", tag: "Normes" },
  { titre: "Domotique & alarme", desc: "Installation de systèmes de domotique (Legrand, Somfy), alarmes intrusion et détection incendie pour maison connectée.", tag: "Domotique" },
  { titre: "Rénovation & dépannage", desc: "Court-circuit, disjoncteur qui saute, prises défectueuses — intervention rapide H/H et weekend sur Toulouse et agglomération.", tag: "Dépannage" },
  { titre: "Bornes de recharge VE", desc: "Installation de bornes IRVE (IZIVIA, Schneider, Hager) pour véhicules électriques en maison individuelle et collectif.", tag: "Électromobilité" },
  { titre: "Éclairage extérieur & piscine", desc: "Éclairage de façade, jardin, terrasse et piscine. Installations basse tension sécurisées, commandes automatiques et LED.", tag: "Extérieur" },
]

const ATOUTS = [
  "Artisan certifié QUALIFELEC et RGE",
  "Garantie décennale et assurance RC Pro",
  "Devis gratuit sous 24h",
  "Intervention d'urgence 7j/7 en moins de 2h",
]

const AVIS = [
  { texte: "Intervention rapide après une coupure de courant totale un vendredi soir. En 1h30 tout était réglé. Sérieux, propre et prix correct. Je recommande sans hésiter.", auteur: "Marc D.", detail: "Dépannage urgent, Toulouse" },
  { texte: "Rénovation complète du tableau électrique d'une maison des années 70. Travail impeccable, explications claires et passage CONSUEL sans problème. Bravo !", auteur: "Christine M.", detail: "Mise aux normes, Colomiers" },
  { texte: "Installation de 2 bornes de recharge pour nos deux voitures électriques. Conseils pertinents sur les puissances, finitions parfaites. Délai tenu à la journée près.", auteur: "Famille Aubert", detail: "Borne IRVE, Blagnac" },
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
export default function VoltExpertPage() {
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
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');`}</style>

      {/* Navbar */}
      <motion.nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px",
        background: scrolled ? "rgba(247,248,250,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        transition: "all 0.4s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: C.accent, borderRadius: 8, padding: 8, display: "flex" }}>
            <Zap size={18} color="#fff" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: scrolled ? C.dark : "#fff" }}>Volt<span style={{ color: C.accent }}>Expert</span></span>
        </div>
        <div id="mb15-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>      {["Services", "Réalisations", "Tarifs", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href={`tel:${fd?.phone ?? "+33561000000"}`} style={{ background: C.accent, color: C.dark, borderRadius: 8, padding: "9px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }} whileHover={{ background: C.accentDark }}>
            <Phone size={14} /> Urgence 24h/24
          </motion.a>
      </div>
        <button
          className="mb15-burger"
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
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href={`tel:${fd?.phone ?? "+33561000000"}`} style={{ background: C.accent, color: C.dark, borderRadius: 8, padding: "9px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }} whileHover={{ background: C.accentDark }}>
            <Phone size={14} /> Urgence 24h/24
          </motion.a>
        </div>
      )}
      <style>{`@media (max-width: 900px) { #mb15-nav { display: none !important; } .mb15-burger { display: flex !important; } }`}</style>

      {/* Hero */}
      <section id="hero" ref={heroRef} style={{ height: "115vh", minHeight: "900px", position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1920&q=80" alt="Électricien professionnel Toulouse" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,20,40,0.92) 0%, rgba(10,20,40,0.45) 45%, rgba(10,20,40,0.08) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.accent}20 0%, transparent 55%)` }} />

        <motion.div style={{ position: "relative", zIndex: 1, padding: "0 80px 90px", maxWidth: 760, y: heroTextY, opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: 20, padding: "7px 18px" }}>
            <Shield size={12} color={C.accent} />
            <span style={{ color: C.accent, fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Électricien QUALIFELEC — Toulouse</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
            style={{ fontSize: "clamp(40px, 5.5vw, 72px)", fontWeight: 800, color: "#fff", lineHeight: 1.05, marginBottom: 24 }}>{c?.heroHeadline ?? <>
            L'électricité,<br /><span style={{ color: C.accent }}>sans mauvaise surprise.</span>
          </>}</motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
            style={{ fontSize: 17, color: "rgba(255,255,255,0.75)", lineHeight: 1.75, marginBottom: 40, maxWidth: 520 }}>{c?.heroSubline ?? fd?.tagline ?? <>
            VoltExpert intervient sur tous vos travaux électriques à Toulouse et agglomération. Installation, mise aux normes, domotique, bornes VE — devis gratuit sous 24h.
          </>}</motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <motion.a href={`tel:${fd?.phone ?? "+33561000000"}`} style={{ background: C.accent, color: C.dark, borderRadius: 8, padding: "15px 32px", fontWeight: 800, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 8px 32px ${C.accent}55` }} whileHover={{ scale: 1.03 }}>
              <Phone size={18} /> Appeler maintenant
            </motion.a>
            <motion.a href="#services" style={{ background: "rgba(255,255,255,0.10)", color: "#fff", border: "1px solid rgba(255,255,255,0.28)", borderRadius: 8, padding: "13px 28px", fontWeight: 600, fontSize: 15, textDecoration: "none", backdropFilter: "blur(8px)" }} whileHover={{ background: "rgba(255,255,255,0.18)" }}>
              Nos services
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
      <section style={{ background: C.dark, padding: "0 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", maxWidth: 1100, margin: "0 auto" }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div style={{ padding: "30px 0", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontSize: 38, fontWeight: 800, color: C.accent, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" style={{ padding: "110px 80px", background: C.bg }}>
        <Reveal>
          <div style={{ marginBottom: 60 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Nos prestations</span>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 800, color: C.text, marginTop: 10, lineHeight: 1.1 }}>
              Tous vos travaux électriques,<br />un seul interlocuteur.
            </h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, maxWidth: 1200, margin: "0 auto" }}>
          {SERVICES.map((s, i) => (
            <Reveal key={s.titre} delay={i * 0.07}>
              <motion.div whileHover={{ y: -5, boxShadow: C.shadowLg }} style={{ background: C.white, borderRadius: 14, padding: "26px 24px", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                <span style={{ background: C.accentLight, color: C.accentDark, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{s.tag}</span>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, margin: "14px 0 10px" }}>{s.titre}</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{s.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Atouts */}
      <section style={{ padding: "100px 80px", background: C.bgSection }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <Reveal>
            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" alt="Electricien certifie Toulouse" style={{ width: "100%", borderRadius: 16, aspectRatio: "4/3", objectFit: "cover" }} />
          </Reveal>
          <Reveal delay={0.15}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Pourquoi nous choisir</span>
            <h2 style={{ fontSize: "clamp(26px, 3vw, 42px)", fontWeight: 800, color: C.text, margin: "12px 0 28px", lineHeight: 1.15 }}>
              Certifié, assuré,<br />disponible 7j/7.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {ATOUTS.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <CheckCircle size={18} color={C.accent} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.6 }}>{a}</span>
                </div>
              ))}
            </div>
            <motion.a href={`tel:${fd?.phone ?? "+33561000000"}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 32, background: C.accent, color: C.dark, borderRadius: 8, padding: "13px 28px", fontWeight: 700, fontSize: 15, textDecoration: "none" }} whileHover={{ background: C.accentDark, scale: 1.02 }}>
              <Phone size={16} /> Devis gratuit
            </motion.a>
          </Reveal>
        </div>
      </section>

      {/* Avis */}
      <section style={{ padding: "100px 80px", background: C.dark }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Avis clients</span>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, color: "#fff", marginTop: 10 }}>Ils nous font <span style={{ color: C.accent }}>confiance</span>.</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
          {AVIS.map((a, i) => (
            <Reveal key={a.auteur} delay={i * 0.1}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "28px 24px" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>{[...Array(5)].map((_, j) => <Star key={j} size={13} fill={C.accent} color={C.accent} />)}</div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.78)", lineHeight: 1.7, marginBottom: 18 }}>"{a.texte}"</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 14 }}>
                  <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{a.auteur}</div>
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
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20, background: C.accentDark + "18", border: `1px solid ${C.accentDark}30`, borderRadius: 20, padding: "6px 16px" }}>
            <Lightbulb size={14} color={C.accentDark} />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: C.accentDark }}>Devis gratuit · Réponse sous 24h</span>
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 800, color: C.text, marginBottom: 16 }}>{c?.aboutTitle ?? fd?.businessName ?? <>Un projet ? Une panne ?<br />Appelez-nous.</>}</h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.7 }}>{c?.aboutText ?? <>
            Intervention d'urgence 24h/24 ou devis pour vos travaux — réponse garantie sous 2 heures en semaine.
          </>}</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href={`tel:${fd?.phone ?? "+33561000000"}`} style={{ background: C.dark, color: C.white, borderRadius: 8, padding: "15px 36px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ scale: 1.03 }}>
              <Phone size={18} /> 05 61 00 00 00
            </motion.a>
            <motion.a href={`mailto:${fd?.email ?? "contact@voltexpert.fr"}`} style={{ background: "transparent", color: C.text, border: `2px solid ${C.dark}`, borderRadius: 8, padding: "13px 32px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ background: C.dark, color: C.white }}>
              <Mail size={18} /> Nous écrire
            </motion.a>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer style={{ background: C.text, padding: "48px 80px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 36 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.accent, marginBottom: 8 }}>VoltExpert</div>
            <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, lineHeight: 1.6, maxWidth: 220 }}>Électricien certifié QUALIFELEC<br />Toulouse & agglomération</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {[{ icon: <MapPin size={13} />, t: "Toulouse, Haute-Garonne" }, { icon: <Phone size={13} />, t: "05 61 00 00 00" }, { icon: <Clock size={13} />, t: "Urgences 7j/7 · 24h/24" }].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.42)", fontSize: 13 }}>
                <span style={{ color: C.accent }}>{item.icon}</span>{item.t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ color: "rgba(255,255,255,0.22)", fontSize: 12 }}>© 2026 VoltExpert — Site réalisé par Aevia WS</span>
          <a href="/templates/impact-15/mentions-legales" style={{ color: "rgba(255,255,255,0.22)", fontSize: 12, textDecoration: "none" }}>{c?.ctaText ?? <>Mentions légales</>}</a>
        </div>
      </footer>
    </div>
  )
}
