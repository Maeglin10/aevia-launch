"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react'
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Flame, Phone, Mail, MapPin, Clock, Star, CheckCircle, AlertTriangle } from "lucide-react"

const C = {
  bg: "#f6f4f1", bgSection: "#ede9e2", bgDark: "#1a1208",
  text: "#1a1208", textMuted: "#6b5e4a",
  accent: "#e06c00", accentDark: "#b85800", accentLight: "#fdebd3",
  slate: "#2d3748",
  white: "#ffffff", border: "#ddd0be",
  shadow: "0 2px 12px rgba(26,18,8,0.08)", shadowLg: "0 16px 48px rgba(224,108,0,0.18)",
}
const FONT = "'Bebas Neue', system-ui, sans-serif"
const FONT_BODY = "'Work Sans', system-ui, sans-serif"

const STATS = [{ value: "16 ans", label: "D'expérience" }, { value: "5 000+", label: "Interventions" }, { value: "1h", label: "Délai urgence" }, { value: "24h/7j", label: "Disponibilité" }]

const SERVICES = [
  { titre: "Plomberie générale", desc: "Fuite, canalisation bouchée, remplacement de chauffe-eau, robinetterie, WC. Devis gratuit et transparence sur les tarifs avant intervention.", tag: "Plomberie" },
  { titre: "Installation chauffage", desc: "Chaudière gaz, pompe à chaleur, plancher chauffant, radiateurs. Marques Bosch, Viessmann, Atlantic — SAV assuré.", tag: "Chauffage" },
  { titre: "Dépannage urgence", desc: "Fuite d'eau active, chauffe-eau en panne, chauffage hors service en hiver. Intervention en moins d'1h sur Lille et métropole.", tag: "Urgence" },
  { titre: "Pompe à chaleur & clim", desc: "Installation et entretien de PAC air/air et air/eau. Bilan thermique offert, éligibilité MaPrimeRénov vérifiée.", tag: "PAC & Clim" },
  { titre: "Entretien chaudière", desc: "Contrat annuel ou intervention ponctuelle. Nettoyage, réglage, vérification de sécurité et attestation d'entretien réglementaire.", tag: "Entretien" },
  { titre: "Isolation & rénovation", desc: "Remplacement de tuyauteries vétustes, isolation des conduites, mise aux normes gaz. Accompagnement pour les aides à la rénovation.", tag: "Rénovation" },
]

const GARANTIES = [
  "Artisan RGE (Reconnu Garant de l'Environnement) — éligibilité aides MaPrimeRénov",
  "Garantie pièces et main d'œuvre 2 ans",
  "Devis détaillé avant chaque intervention, aucun surplus",
  "Certification Qualigaz pour les installations gaz",
]

const AVIS = [
  { texte: "Fuite d'eau sous évier un dimanche matin. Appelé à 9h, technicien là à 10h15. Réparation nickel, tarif week-end clairement annoncé à l'avance. Vraiment professionnel.", auteur: "Martine D.", detail: "Urgence plomberie" },
  { texte: "Installation d'une pompe à chaleur complète. Bilan thermique offert, dossier MaPrimeRénov géré par eux, travaux propres en 2 jours. Économies sur facture immédiates.", auteur: "Famille Leclercq", detail: "PAC air/eau" },
  { texte: "Contrat d'entretien chaudière depuis 3 ans. Ponctuel, sérieux, ils signalent les pièces à prévoir avant la panne. C'est exactement ce qu'on attend d'un professionnel.", auteur: "Pierre M.", detail: "Contrat entretien" },
]

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>
}


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function AquaThermPage() {
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
  React.useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); 
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
return () => window.removeEventListener("scroll", h) }, [])

  return (
    <div style={{ background: C.bg, fontFamily: FONT_BODY, overflowX: "hidden" }}>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Work+Sans:wght@300;400;500;600;700&display=swap');`}</style>

      <motion.nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px", background: scrolled ? "rgba(246,244,241,0.97)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? `1px solid ${C.border}` : "none", transition: "all 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: C.accent, borderRadius: 6, padding: "6px 8px" }}><Flame size={18} color="#fff" /></div>
          <span style={{ fontFamily: FONT, fontSize: 24, letterSpacing: 1, color: scrolled ? C.text : "#fff" }}>Aqua<span style={{ color: C.accent }}>Therm</span></span>
        </div>
        <div id="mb228-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>      {["Services", "Urgence", "Entretien", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href={`tel:${fd?.phone ?? "+33320000000"}`} style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "9px 22px", fontSize: 14, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }} whileHover={{ background: C.accentDark }}>
            <Phone size={14} /> Urgence 24h/24
          </motion.a>
      </div>
        <button
          className="mb228-burger"
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
          {["Services", "Urgence", "Entretien", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href={`tel:${fd?.phone ?? "+33320000000"}`} style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "9px 22px", fontSize: 14, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }} whileHover={{ background: C.accentDark }}>
            <Phone size={14} /> Urgence 24h/24
          </motion.a>
        </div>
      )}
      <style>{`@media (max-width: 900px) { #mb228-nav { display: none !important; } .mb228-burger { display: flex !important; } }`}</style>

      <section id="hero" ref={heroRef} style={{ height: "115vh", minHeight: "900px", position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <img src="https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1920&q=80" alt="Plombier chauffagiste AquaTherm Lille" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,6,0,0.93) 0%, rgba(10,6,0,0.42) 45%, rgba(10,6,0,0.08) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.accent}18 0%, transparent 55%)` }} />
        <motion.div style={{ position: "relative", zIndex: 1, padding: "0 80px 90px", maxWidth: 760, y: heroTextY, opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, background: "rgba(224,108,0,0.15)", border: "1px solid rgba(224,108,0,0.30)", borderRadius: 20, padding: "7px 18px" }}>
            <AlertTriangle size={12} color={C.accent} />
            <span style={{ color: C.accent, fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Plombier chauffagiste RGE · Lille</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
            style={{ fontFamily: FONT, fontSize: "clamp(48px, 6vw, 82px)", letterSpacing: 1, color: "#fff", lineHeight: 0.95, marginBottom: 24 }}>{c?.heroHeadline ?? <>
            PANNE ?<br /><span style={{ color: C.accent }}>ON ARRIVE.</span>
          </>}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
            style={{ fontSize: 17, color: "rgba(255,255,255,0.72)", lineHeight: 1.75, marginBottom: 40, maxWidth: 510 }}>{c?.heroSubline ?? fd?.tagline ?? <>
            AquaTherm, plombier chauffagiste à Lille. Urgences en moins d'une heure, devis gratuit, certifié RGE et Qualigaz. Plomberie, chauffage, PAC, climatisation.
          </>}</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <motion.a href={`tel:${fd?.phone ?? "+33320000000"}`} style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "15px 32px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 8px 32px ${C.accent}44` }} whileHover={{ scale: 1.03 }}>
              <Phone size={18} /> 03 20 00 00 00
            </motion.a>
            <motion.a href="#services" style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 6, padding: "13px 28px", fontWeight: 500, fontSize: 15, textDecoration: "none" }} whileHover={{ background: "rgba(255,255,255,0.14)" }}>
              Nos services
            </motion.a>
          </motion.div>
        </motion.div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
          <div style={{ width: 24, height: 36, border: "2px solid rgba(255,255,255,0.30)", borderRadius: 12, display: "flex", justifyContent: "center", paddingTop: 6 }}>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />
          </div>
        </motion.div>
      </section>

      <section style={{ background: C.bgDark, padding: "0 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", maxWidth: 1100, margin: "0 auto" }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div style={{ padding: "28px 0", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 40, letterSpacing: 1, color: C.accent, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", marginTop: 6 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="services" style={{ padding: "100px 80px", background: C.bg }}>
        <Reveal><div style={{ marginBottom: 56 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Nos interventions</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(36px, 4vw, 56px)", letterSpacing: 1, color: C.text, marginTop: 8 }}>TOUT CE QUI COULE,<br />CHAUFFE OU FUIT.</h2>
        </div></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18, maxWidth: 1200, margin: "0 auto" }}>
          {SERVICES.map((s, i) => (
            <Reveal key={s.titre} delay={i * 0.07}>
              <motion.div whileHover={{ y: -5, boxShadow: C.shadowLg }} style={{ background: C.white, borderRadius: 8, padding: "24px 22px", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                <span style={{ background: C.accentLight, color: C.accentDark, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{s.tag}</span>
                <h3 style={{ fontFamily: FONT, fontSize: 20, letterSpacing: 0.5, color: C.text, margin: "12px 0 8px" }}>{s.titre}</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{s.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      <section style={{ padding: "100px 80px", background: C.bgSection }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <Reveal><img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" alt="Artisan plombier certifié" style={{ width: "100%", borderRadius: 8, aspectRatio: "4/3", objectFit: "cover" }} /></Reveal>
          <Reveal delay={0.15}><div>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Garanties</span>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(30px, 3vw, 48px)", letterSpacing: 0.5, color: C.text, margin: "10px 0 26px", lineHeight: 1.1 }}>RGE, QUALIGAZ,<br />ASSURÉS.</h2>
            {GARANTIES.map((g, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                <CheckCircle size={17} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.65 }}>{g}</span>
              </div>
            ))}
            <motion.a href={`tel:${fd?.phone ?? "+33320000000"}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 28, background: C.accent, color: C.white, borderRadius: 6, padding: "13px 28px", fontWeight: 600, fontSize: 15, textDecoration: "none" }} whileHover={{ background: C.accentDark, scale: 1.02 }}>
              <Phone size={16} /> Devis gratuit
            </motion.a>
          </div></Reveal>
        </div>
      </section>

      <section style={{ padding: "100px 80px", background: C.bgDark }}>
        <Reveal><div style={{ textAlign: "center", marginBottom: 52 }}>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(32px, 4vw, 52px)", letterSpacing: 1, color: "#fff" }}>ILS NOUS FONT <span style={{ color: C.accent }}>CONFIANCE.</span></h2>
        </div></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18, maxWidth: 1100, margin: "0 auto" }}>
          {AVIS.map((a, i) => (
            <Reveal key={a.auteur} delay={i * 0.1}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "26px 24px" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>{[...Array(5)].map((_, j) => <Star key={j} size={13} fill={C.accent} color={C.accent} />)}</div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 18 }}>"{a.texte}"</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 14 }}>
                  <div style={{ fontWeight: 600, color: "#fff", fontSize: 14 }}>{a.auteur}</div>
                  <div style={{ color: C.accent, fontSize: 12, marginTop: 4 }}>{a.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="contact" style={{ padding: "100px 80px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(32px, 4.5vw, 60px)", letterSpacing: 1, color: C.text, marginBottom: 16 }}>PANNE OU PROJET ?<br /><span style={{ color: C.accent }}>APPELEZ.</span></h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 420, margin: "0 auto 36px", lineHeight: 1.7 }}>Urgences 24h/24 ou devis pour travaux — réponse garantie en moins de 2h en semaine.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href={`tel:${fd?.phone ?? "+33320000000"}`} style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "15px 36px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ scale: 1.03 }}>
              <Phone size={18} /> 03 20 00 00 00
            </motion.a>
            <motion.a href={`mailto:${fd?.email ?? "contact@aquatherm-lille.fr"}`} style={{ background: "transparent", color: C.text, border: `2px solid ${C.accent}`, borderRadius: 6, padding: "13px 32px", fontWeight: 600, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ background: C.accent, color: C.white }}>
              <Mail size={18} /> Écrire
            </motion.a>
          </div>
        </Reveal>
      </section>

      <footer style={{ background: C.bgDark, padding: "44px 80px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 22, letterSpacing: 1, color: C.accent, marginBottom: 8 }}>AquaTherm</div>
            <p style={{ color: "rgba(255,255,255,0.30)", fontSize: 13, lineHeight: 1.6 }}>Plombier chauffagiste RGE · Lille<br />Urgences 24h/24 · 7j/7</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[{ icon: <MapPin size={13} />, t: "Lille, Nord" }, { icon: <Phone size={13} />, t: "03 20 00 00 00" }, { icon: <Clock size={13} />, t: "Urgences 24h/24" }].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.38)", fontSize: 13 }}>
                <span style={{ color: C.accent }}>{item.icon}</span>{item.t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ color: "rgba(255,255,255,0.18)", fontSize: 12 }}>© 2026 AquaTherm — Site par Aevia WS</span>
          <a href="#contact" style={{ color: "rgba(255,255,255,0.18)", fontSize: 12, textDecoration: "none" }}>{c?.ctaText ?? <>Mentions légales</>}</a>
        </div>
      </footer>
    </div>
  )
}
