"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react'
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Scissors, Phone, Mail, MapPin, Clock, Star, CheckCircle, ArrowRight, Calendar } from "lucide-react"

const C = {
  bg: "#f9f7f4",
  bgSection: "#f0ece5",
  bgDark: "#1c1410",
  text: "#1c1410",
  textMuted: "#6b5c4c",
  accent: "#8b6914",
  accentLight: "#f5e8c8",
  copper: "#b5651d",
  slate: "#2c3e50",
  white: "#ffffff",
  border: "#e0d5c5",
  shadow: "0 2px 12px rgba(28,20,16,0.08)",
  shadowLg: "0 16px 48px rgba(139,105,20,0.18)",
}
const FONT = "'Playfair Display', Georgia, serif"
const FONT_BODY = "'Raleway', system-ui, sans-serif"

const STATS = [
  { value: "11 ans", label: "D'expertise" },
  { value: "6", label: "Barbiers certifiés" },
  { value: "4.9★", label: "Avis Google" },
  { value: "45 min", label: "Prestation signature" },
]

const PRESTATIONS = [
  { titre: "Coupe homme classique", desc: "Ciseaux ou tondeuse, dégradé américain ou anglais, finition rasoir. Shampooing + coupe + styling — 35€.", tag: "Coupe" },
  { titre: "Rasage traditionnel", desc: "Rasage lame droite avec préparation serviettes chaudes, huile, mousse artisanale. Soin de peau inclus. Un rituel d'exception — 45€.", tag: "Rasage" },
  { titre: "Barbe taillée & modelée", desc: "Définition du contour, dégradé de longueurs, finition à la cire. Du bouc au beard full — 25€.", tag: "Barbe" },
  { titre: "Coupe + barbe", desc: "Forfait complet : coupe homme + taille de barbe + rasage des contours. Le combo incontournable — 55€.", tag: "Combo" },
  { titre: "Soin cuir chevelu", desc: "Traitement anti-chute, hydratation profonde ou purifiant selon type de cuir chevelu. En complément ou seul — 30€.", tag: "Soin" },
  { titre: "Colorimétrie & grisonnants", desc: "Couvrage des blancs, reflets, balayage discret pour hommes. Naturel ou audacieux selon votre style — sur devis.", tag: "Couleur" },
]

const VALEURS = [
  "Produits 100% naturels : Kevin Murphy, Baxter of California",
  "Ambiance feutrée, whisky offert pour les rasages",
  "Réservation en ligne ou sans rendez-vous les mardis",
  "Carte fidélité : 10e coupe offerte",
]

const AVIS = [
  { texte: "Le meilleur rasage de ma vie. Serviettes chaudes, mousse artisanale, lame droite, soin après. J'y vais chaque mois et je ressors à chaque fois comme une star. Un endroit à part.", auteur: "Antoine R.", detail: "Rasage traditionnel" },
  { texte: "Cherchais un barbier qui maîtrise le dégradé peau sans faire de bourrelets. Premier essai et c'est exactement ce que je voulais. Prix honnête, ambiance cool. Mon nouveau QG.", auteur: "Kévin L.", detail: "Coupe dégradé" },
  { texte: "Mon fils de 8 ans avait peur du coiffeur. Ici, ils ont été patients, fun, et il est reparti en disant 'trop bien'. C'est devenu un moment père-fils qu'il attend avec impatience.", auteur: "Famille Morel", detail: "Coupe enfant" },
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
export default function LeBarberClubPage() {
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
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Raleway:wght@300;400;500;600;700&display=swap');`}</style>

      <motion.nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px",
        background: scrolled ? "rgba(249,247,244,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        transition: "all 0.4s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {fd?.logoBase64 ? (
            // Client logo (uploaded in the brief) replaces the placeholder mark —
            // essential for the client to recognise their brand in the render.
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 30, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <>
              <Scissors size={18} color={scrolled ? C.accent : "#fff"} />
              <span style={{ fontFamily: FONT, fontSize: 20, color: scrolled ? C.text : "#fff" }}>Le Barber <em>Club</em></span>
            </>
          )}
        </div>
        <div id="mb227-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>      {["Prestations", "Tarifs", "L'équipe", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href={`tel:${fd?.phone ?? "+33478000001"}`} style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "9px 22px", fontSize: 14, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }} whileHover={{ background: "#704f0a" }}>
            <Calendar size={14} /> Réserver
          </motion.a>
      </div>
        <button
          className="mb227-burger"
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
          {["Prestations", "Tarifs", "L'équipe", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href={`tel:${fd?.phone ?? "+33478000001"}`} style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "9px 22px", fontSize: 14, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }} whileHover={{ background: "#704f0a" }}>
            <Calendar size={14} /> Réserver
          </motion.a>
        </div>
      )}
      <style>{`@media (max-width: 900px) { #mb227-nav { display: none !important; } .mb227-burger { display: flex !important; } }`}</style>

      <section id="hero" ref={heroRef} style={{ height: "115vh", minHeight: "900px", position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1920&q=80" alt="Le Barber Club Lyon" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,6,3,0.93) 0%, rgba(10,6,3,0.42) 45%, rgba(10,6,3,0.08) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.accent}18 0%, transparent 55%)` }} />
        <motion.div style={{ position: "relative", zIndex: 1, padding: "0 80px 90px", maxWidth: 760, y: heroTextY, opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, background: "rgba(139,105,20,0.15)", border: "1px solid rgba(139,105,20,0.30)", borderRadius: 20, padding: "7px 18px" }}>
            <Scissors size={12} color={C.accentLight} />
            <span style={{ color: C.accentLight, fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Barbier & Coiffeur · Lyon 2e</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
            style={{ fontFamily: FONT, fontSize: "clamp(40px, 5.2vw, 70px)", fontWeight: 400, color: "#fff", lineHeight: 1.1, marginBottom: 24 }}>{c?.heroHeadline ?? <>
            L'art du soin masculin,<br /><em style={{ color: C.accentLight }}>à l'ancienne.</em>
          </>}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
            style={{ fontSize: 17, color: "rgba(255,255,255,0.70)", lineHeight: 1.75, marginBottom: 40, maxWidth: 510 }}>{c?.heroSubline ?? fd?.tagline ?? <>
            Coupes, rasages au blaireau, soins barbe et cuir chevelu — Le Barber Club est l'adresse des hommes qui ne veulent pas choisir entre style et tradition.
          </>}</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <motion.a href={`tel:${fd?.phone ?? "+33478000001"}`} style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "15px 32px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 8px 32px ${C.accent}44` }} whileHover={{ scale: 1.03 }}>
              <Calendar size={18} /> Réserver en ligne
            </motion.a>
            <motion.a href="#prestations" style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 6, padding: "13px 28px", fontWeight: 500, fontSize: 15, textDecoration: "none" }} whileHover={{ background: "rgba(255,255,255,0.14)" }}>
              Nos prestations
            </motion.a>
          </motion.div>
        </motion.div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
          <div style={{ width: 24, height: 36, border: "2px solid rgba(255,255,255,0.30)", borderRadius: 12, display: "flex", justifyContent: "center", paddingTop: 6 }}>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: C.accentLight }} />
          </div>
        </motion.div>
      </section>

      <section style={{ background: C.bgDark, padding: "0 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", maxWidth: 1100, margin: "0 auto" }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div style={{ padding: "28px 0", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 36, color: C.accentLight, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", marginTop: 6 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="prestations" style={{ padding: "100px 80px", background: C.bg }}>
        <Reveal><div style={{ marginBottom: 56 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Le menu</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(30px, 4vw, 50px)", color: C.text, marginTop: 10, lineHeight: 1.15 }}>Chaque prestation,<br /><em>un soin complet.</em></h2>
        </div></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18, maxWidth: 1200, margin: "0 auto" }}>
          {PRESTATIONS.map((p, i) => (
            <Reveal key={p.titre} delay={i * 0.07}>
              <motion.div whileHover={{ y: -5, boxShadow: C.shadowLg }} style={{ background: C.white, borderRadius: 10, padding: "26px 24px", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                <span style={{ background: C.accentLight, color: C.accent, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{p.tag}</span>
                <h3 style={{ fontFamily: FONT, fontSize: 18, color: C.text, margin: "14px 0 10px" }}>{p.titre}</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{p.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      <section style={{ padding: "100px 80px", background: C.bgSection }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <Reveal delay={0.1}><div>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Notre engagement</span>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3vw, 44px)", color: C.text, margin: "12px 0 28px", lineHeight: 1.2 }}>L'expérience compte<br /><em>autant que la coupe.</em></h2>
            {VALEURS.map((v, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                <CheckCircle size={17} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.65 }}>{v}</span>
              </div>
            ))}
            <motion.a href={`tel:${fd?.phone ?? "+33478000001"}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 28, background: C.accent, color: C.white, borderRadius: 6, padding: "13px 28px", fontWeight: 600, fontSize: 15, textDecoration: "none" }} whileHover={{ background: "#704f0a", scale: 1.02 }}>
              Réserver <ArrowRight size={16} />
            </motion.a>
          </div></Reveal>
          <Reveal><img src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80" alt="Barbier rasage traditionnel" style={{ width: "100%", borderRadius: 12, aspectRatio: "4/3", objectFit: "cover" }} /></Reveal>
        </div>
      </section>

      <section style={{ padding: "100px 80px", background: C.bgDark }}>
        <Reveal><div style={{ textAlign: "center", marginBottom: 52 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentLight }}>Avis</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.5vw, 48px)", color: "#fff", marginTop: 10 }}>Les clients <em style={{ color: C.accentLight }}>parlent.</em></h2>
        </div></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18, maxWidth: 1100, margin: "0 auto" }}>
          {AVIS.map((a, i) => (
            <Reveal key={a.auteur} delay={i * 0.1}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "26px 24px" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>{[...Array(5)].map((_, j) => <Star key={j} size={13} fill={C.accentLight} color={C.accentLight} />)}</div>
                <p style={{ fontFamily: FONT, fontSize: 15, fontStyle: "italic", color: "rgba(255,255,255,0.78)", lineHeight: 1.7, marginBottom: 18 }}>"{a.texte}"</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 14 }}>
                  <div style={{ fontWeight: 600, color: "#fff", fontSize: 14 }}>{a.auteur}</div>
                  <div style={{ color: C.accentLight, fontSize: 12, marginTop: 4 }}>{a.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="contact" style={{ padding: "100px 80px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Réservation</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 4vw, 50px)", color: C.text, margin: "14px 0 16px" }}>Prenez <em>soin de vous</em>.</h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 420, margin: "0 auto 36px", lineHeight: 1.7 }}>Réservation en ligne ou par téléphone. Walk-in bienvenu les mardis après 14h.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a href={`tel:${fd?.phone ?? "+33478000001"}`} style={{ background: C.bgDark, color: C.white, borderRadius: 6, padding: "15px 36px", fontWeight: 600, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ scale: 1.03 }}>
              <Phone size={18} /> 04 78 00 00 01
            </motion.a>
            <motion.a href={`mailto:${fd?.email ?? "hello@lebarberclub.fr"}`} style={{ background: "transparent", color: C.text, border: `2px solid ${C.accent}`, borderRadius: 6, padding: "13px 32px", fontWeight: 600, fontSize: 16, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }} whileHover={{ background: C.accent, color: C.white }}>
              <Mail size={18} /> Écrire
            </motion.a>
          </div>
        </Reveal>
      </section>

      <footer style={{ background: C.bgDark, padding: "44px 80px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 18, color: C.accentLight, marginBottom: 8 }}>Le Barber Club</div>
            <p style={{ color: "rgba(255,255,255,0.30)", fontSize: 13, lineHeight: 1.6 }}>Barbier · Lyon 2e<br />Lun–Sam 9h–19h</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[{ icon: <MapPin size={13} />, t: "Lyon 2e, Rhône" }, { icon: <Phone size={13} />, t: "04 78 00 00 01" }, { icon: <Clock size={13} />, t: "Lun–Sam 9h–19h" }].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.38)", fontSize: 13 }}>
                <span style={{ color: C.accentLight }}>{item.icon}</span>{item.t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ color: "rgba(255,255,255,0.18)", fontSize: 12 }}>© 2026 Le Barber Club — Site par Aevia WS</span>
          <a href="#contact" style={{ color: "rgba(255,255,255,0.18)", fontSize: 12, textDecoration: "none" }}>{c?.ctaText ?? <>Mentions légales</>}</a>
        </div>
      </footer>
    </div>
  )
}
