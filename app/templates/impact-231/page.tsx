"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect} from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"
import { Phone, Mail, MapPin, Clock, Star, CheckCircle, ArrowRight, Leaf } from "lucide-react"
import { resolveList } from "@/lib/templates/resolveList"
import {
  clientTagline,
  clientCity,
  clientEmail,
  clientHeroLine,
  clientHeroSubtitle,
  clientMethode,
  clientName,
  clientPhone,
  clientPhotos,
  clientReviews,
  clientServices,
  clientStats,
  clientText,
  fusionnerEtapes,
} from "@/lib/templates/clientContent";

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
let bp: any = null;
// La session complète, pour lib/templates/clientContent : même portée
// que fd/c/bp, pour les sous-composants qui n'ont pas de props.
let sessionData: any = null;

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
  bg: "#f7fbf4", bgSection: "#edf5e6", bgDark: "#0f1f09",
  text: "#0f1f09", textMuted: "var(--brand,#5a7245)",
  accent: "var(--brand-light,#3a7d20)", accentDark: "#2c5f17", accentLight: "#d8eece",
  sand: "#7ec850", sandLight: "#f0fae8",
  white: "#ffffff", border: "#c6ddb8",
  shadow: "0 2px 14px rgba(15,31,9,0.07)", shadowLg: "0 16px 48px rgba(58,125,32,0.15)",
};const FONT = "'DM Serif Display', Georgia, serif"
const FONT_BODY = "'DM Sans', system-ui, sans-serif"

const STATS_DEMO = [{ value: "8 ans", label: "D'expérience" }, { value: "1 200+", label: "Patients suivis" }, { value: "92%", label: "Objectifs atteints" }, { value: "RDV 48h", label: "Délai moyen" }]
let STATS = STATS_DEMO;

const ACCOMPAGNEMENTS_DEMO = [
  { titre: "Perte de poids durable", desc: "Pas de régime restrictif — un rééquilibrage alimentaire adapté à votre mode de vie. Méthode progressive, sans frustration, avec un suivi régulier.", tag: "Poids" },
  { titre: "Troubles digestifs", desc: "Côlon irritable, SIBO, reflux, ballonnements. Protocoles d'éviction ciblés (FODMAP, gluten, histamine) avec réintroduction progressive.", tag: "Digestif" },
  { titre: "Nutrition sportive", desc: "Performances, récupération, composition corporelle. Plans nutritionnels synchronisés avec votre charge d'entraînement, quel que soit le sport.", tag: "Sport" },
  { titre: "Diabète & métabolisme", desc: "Suivi du diabète de type 2, insulinorésistance, syndrome métabolique. Travail pluridisciplinaire avec votre médecin et endocrinologue.", tag: "Métabolisme" },
  { titre: "Nutrition pédiatrique", desc: "Enfants difficiles, carences, croissance, obésité infantile. Approche ludique et bienveillante pour toute la famille.", tag: "Enfants" },
  { titre: "Femmes & hormones", desc: "Grossesse, post-partum, ménopause, SOPK. Accompagnement adapté aux cycles hormonaux et aux besoins spécifiques des femmes.", tag: "Femmes" },
]

let METHODE = [
  "Bilan alimentaire complet lors de la 1ère consultation (1h)",
  "Plan personnalisé : pas de modèle standard, tout est fait pour vous",
  "Suivi mensuel avec ajustements selon vos retours et résultats",
  "Disponibilité entre séances par messagerie pour vos questions",
]

const AVIS_SOURCE = [
  { texte: "6 mois de suivi pour perdre 14 kg. C'est la première fois que je tiens dans le temps — aucune frustration, aucun yo-yo. La méthode est vraiment différente de tout ce que j'avais essayé.", auteur: "Marie L.", detail: "Perte de poids · 6 mois de suivi" },
  { texte: "Suivi pour SIBO et côlon irritable après 3 ans de galère. En 4 mois, mes symptômes ont diminué de 80%. Enfin quelqu'un qui a compris ce que j'avais.", auteur: "Antoine D.", detail: "Troubles digestifs · SIBO" },
  { texte: "Préparation marathon avec plan nutritionnel sur mesure. J'ai battu mon record de 8 minutes. Le travail sur la récupération et les glucides était exceptionnel.", auteur: "Sarah K.", detail: "Nutrition sportive · Marathon" },
]
let AVIS_DEMO = AVIS_SOURCE;

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>
}

/** Booking form field — matches the page's card/input language (white surface, sage border, DM Sans). */
function NJField({
  label,
  type = "text",
  required = true,
  children,
}: {
  label: string
  type?: string
  required?: boolean
  children?: React.ReactNode
}) {
  const [focused, setFocused] = useState(false)
  const isSelect = type === "select"
  const fieldStyle: React.CSSProperties = {
    width: "100%",
    background: C.white,
    border: `1.5px solid ${focused ? C.accent : C.border}`,
    borderRadius: 8,
    color: C.text,
    fontFamily: FONT_BODY,
    fontSize: 14.5,
    padding: "13px 14px",
    outline: "none",
    boxShadow: focused ? `0 0 0 3px ${C.accent}22` : "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    cursor: isSelect ? "pointer" : "text",
    appearance: isSelect ? ("none" as const) : undefined,
  }
  return (
    <label style={{ display: "block", marginBottom: 18, textAlign: "left" }}>
      <span style={{ display: "block", fontSize: 11.5, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: C.textMuted, marginBottom: 7 }}>
        {label}{required && <span style={{ color: C.accent }}> *</span>}
      </span>
      {isSelect ? (
        <select required={required} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={fieldStyle}>
          {children}
        </select>
      ) : (
        <input type={type} required={required} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={fieldStyle} />
      )}
    </label>
  )
}


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function NutritherapiePage() {
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
    businessProfile?: any;
  } | null>(null);

  useEffect(() => {
    let id = new URLSearchParams(window.location.search).get("session");
    /* La navigation interne perd le paramètre : on retient la session par thème. */
    try {
      const cleSession = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cleSession, id);
      else id = sessionStorage.getItem(cleSession);
    } catch {}
    if (!id) return;
    (async () => {
      /* La session vient d'un stockage distant : chargée dans la foulée de sa
         création, elle peut n'être pas encore lisible. Cinq tentatives, jusqu'à
         onze secondes : trois ne suffisaient pas, et une page qui rate la
         dernière garde le repli de la démonstration pour toujours. */
      for (const attente of [0, 500, 1500, 3000, 6000]) {
        if (attente) await new Promise((r) => setTimeout(r, attente));
        try {
          const reponse = await fetch(`/api/sessions?id=${id}`);
          if (!reponse.ok) continue;
          const donnees = await reponse.json();
          if (donnees) { setSession(donnees); return; }
        } catch {}
      }
    })();
  }, []);

  fd = session?.formData;
  c = session?.generatedContent;
  bp = session?.businessProfile;
  sessionData = session;
  /* La méthode du client remplace les étapes de la démonstration. */
  METHODE = resolveList(
    fusionnerEtapes(METHODE, clientMethode(sessionData)),
    METHODE,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({ ...AVIS_SOURCE[i % AVIS_SOURCE.length], auteur: r.author, texte: r.text, detail: "", })),
    AVIS_SOURCE,
  );
  STATS = resolveList(clientStats(sessionData), STATS_DEMO);
  brand = fd?.brandColor ?? null; // null = keep template's original color
  if (brand) {
    C = { ...C, accent: brand };
  }

  const heroRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingSent, setBookingSent] = useState(false)
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setBookingLoading(true)
    setTimeout(() => {
      setBookingLoading(false)
      setBookingSent(true)
    }, 1900)
  }
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 170])
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, -65])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  React.useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h)
  }, []);

return (
    <div style={{ background: C.bg, fontFamily: FONT_BODY, overflowX: "hidden" }}>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
          /* stats: 4 colonnes trop serrées/tronquées sur mobile -> 2x2 */
          .imx-stats { grid-template-columns: 1fr 1fr !important; row-gap: 8px; }
          .imx-stats > * > div { border-right: none !important; }
        }
      `}</style>

      <motion.nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px", background: scrolled ? "rgba(247,251,244,0.97)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? `1px solid ${C.border}` : "none", transition: "all 0.4s ease" }}>
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
              <Leaf size={18} color={scrolled ? C.accent : "#fff"} />
              <span style={{ textShadow: "0 0 2px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,0.8)",  fontFamily: FONT, fontSize: 19, color: scrolled ? C.text : "#fff" }}>{/* NOM_LOGO */ clientName(sessionData) ?? (<>Nourrir <em>Juste</em></>)}</span>
            </>
          )}
        </div>
        <div id="mb231-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>      {["Accompagnements", "Méthode", "Témoignages", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href="#contact" style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "9px 22px", fontSize: 14, fontWeight: 600, textDecoration: "none", cursor: "pointer" }} whileHover={{ background: C.accentDark }}>Prendre RDV</motion.a>
      </div>
        <button
          className="mb231-burger"
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
          {["Accompagnements", "Méthode", "Témoignages", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.a href="#contact" onClick={() => setMobileOpen(false)} style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "9px 22px", fontSize: 14, fontWeight: 600, textDecoration: "none", cursor: "pointer" }} whileHover={{ background: C.accentDark }}>Prendre RDV</motion.a>
        </div>
      )}
      <style>{`
        @media (max-width: 900px) { #mb231-nav { display: none !important; } .mb231-burger { display: flex !important; } }
        @media (max-width: 640px) {
          #hero { height: 100dvh !important; min-height: 100dvh !important; }
          .mb231-hero-text { padding: 0 24px 40px !important; }
        }
      `}</style>

      <section id="hero" ref={heroRef} style={{ height: "100dvh", minHeight: "640px", position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <img src={photo(0, (clientPhotos(sessionData)[0] || "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1920&q=80"))} alt="Diététicienne nutritionniste Lyon" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,22,5,0.92) 0%, rgba(8,22,5,0.38) 45%, rgba(8,22,5,0.06) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.accent}18 0%, transparent 55%)` }} />
        <motion.div className="mb231-hero-text" style={{ position: "relative", zIndex: 1, padding: "0 80px 90px", maxWidth: 760, y: heroTextY, opacity: heroOpacity }}>
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
            style={{ fontFamily: FONT, fontSize: "clamp(40px, 5vw, 68px)", color: "#fff", lineHeight: 1.1, marginBottom: 24 }}>{/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ?? (<>{<>{clientHeroLine(sessionData, 0, 2, 17) ?? "Manger juste"}<br /><em style={{ color: C.sand }}>{clientHeroLine(sessionData, 1, 2, 17) ?? "pour vivre mieux."}</em>
          </>}</>)}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
            style={{ fontSize: 17, color: "rgba(255,255,255,0.70)", lineHeight: 1.75, marginBottom: 40, maxWidth: 510 }}>{c?.heroSubline ?? clientHeroSubtitle(sessionData) ?? <>
            {clientName(sessionData) ? <>Un accompagnement individualisé{clientCity(sessionData) ? <> à {clientCity(sessionData)}</> : null} pour votre poids, vos troubles digestifs, vos performances ou votre santé hormonale.</> : <>Camille Renard, diététicienne-nutritionniste à Lyon. Un accompagnement individualisé pour votre poids, vos troubles digestifs, vos performances ou votre santé hormonale.</>}
          </>}</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <motion.a href="#contact" style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "15px 32px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 8px 32px ${C.accent}44`, cursor: "pointer" }} whileHover={{ scale: 1.03 }}>
              Prendre RDV <ArrowRight size={16} />
            </motion.a>
            <motion.a href="#accompagnements" style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 6, padding: "13px 28px", fontWeight: 500, fontSize: 15, textDecoration: "none" }} whileHover={{ background: "rgba(255,255,255,0.14)" }}>
              Mes accompagnements
            </motion.a>
          </motion.div>
        </motion.div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
          <div style={{ width: 24, height: 36, border: "2px solid rgba(255,255,255,0.30)", borderRadius: 12, display: "flex", justifyContent: "center", paddingTop: 6 }}>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: C.sand }} />
          </div>
        </motion.div>
      </section>

      <section style={{ background: C.bgDark, padding: "0 80px" }}>
        <div className="imx-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", maxWidth: 1100, margin: "0 auto" }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div style={{ padding: "28px 0", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 36, color: C.sand, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", marginTop: 6 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="accompagnements" style={{ padding: "100px 80px", background: C.bg }}>
        <Reveal><div style={{ marginBottom: 56 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Accompagnements</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(30px, 4vw, 52px)", color: C.text, marginTop: 10, lineHeight: 1.15 }}>{/* TEXTE_SECTION */ clientText(sessionData, "accompagnements.titre") ?? (<>Des réponses concrètes<br /><em>à chaque situation.</em></>)}</h2>
        </div></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 18, maxWidth: 1200, margin: "0 auto" }}>
          {resolveList<any>(clientServices(sessionData)?.map((r: any) => ({ titre: r.title, desc: r.desc })), ACCOMPAGNEMENTS_DEMO).map((s: any, i: number) => (
            <Reveal key={s.titre ?? s.name ?? i} delay={i * 0.07}>
              <motion.div whileHover={{ y: -5, boxShadow: C.shadowLg }} style={{ background: C.white, borderRadius: 10, padding: "26px 24px", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                {(s.tag || s.price) && <span style={{ background: C.accentLight, color: C.accent, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{s.tag ?? s.price}</span>}
                <h3 style={{ fontFamily: FONT, fontSize: 18, color: C.text, margin: "14px 0 10px" }}>{s.titre ?? s.name}</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{s.desc ?? s.description}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="méthode" style={{ padding: "100px 80px", background: C.bgSection }}>
        <div className="imx-mobstack" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <Reveal><img src={photo(1, (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80"))} alt="Consultation diététique personnalisée" style={{ width: "100%", borderRadius: 10, aspectRatio: "4/3", objectFit: "cover" }} /></Reveal>
          <Reveal delay={0.15}><div>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Ma méthode</span>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3vw, 44px)", color: C.text, margin: "12px 0 28px", lineHeight: 1.2 }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-4.titre") ?? (<>Pas de régime.<br /><em>Une vraie transformation.</em></>)}</h2>
            {METHODE.map((e, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                <CheckCircle size={17} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.65 }}>{e}</span>
              </div>
            ))}
            <motion.a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 28, background: C.accent, color: C.white, borderRadius: 6, padding: "13px 28px", fontWeight: 600, fontSize: 15, textDecoration: "none", cursor: "pointer" }} whileHover={{ background: C.accentDark, scale: 1.02 }}>
              Réserver ma 1ère consultation <ArrowRight size={16} />
            </motion.a>
          </div></Reveal>
        </div>
      </section>

      <section id="témoignages" style={{ padding: "100px 80px", background: C.bgDark }}>
        <Reveal><div style={{ textAlign: "center", marginBottom: 52 }}>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.5vw, 48px)", color: "#fff" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-5.titre") ?? (<>Ce qu'ils ont <em style={{ color: C.sand }}>retrouvé</em>.</>)}</h2>
        </div></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 18, maxWidth: 1100, margin: "0 auto" }}>
          {resolveList<any>(clientReviews(sessionData), AVIS_DEMO).map((a: any, i: number) => (
            <Reveal key={a.auteur ?? a.author ?? i} delay={i * 0.1}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "26px 24px" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>{[...Array(a.rating ?? 5)].map((_, j) => <Star key={j} size={13} fill={C.sand} color={C.sand} />)}</div>
                <p style={{ fontFamily: FONT, fontSize: 15, fontStyle: "italic", color: "rgba(255,255,255,0.78)", lineHeight: 1.7, marginBottom: 18 }}>"{a.texte ?? a.text}"</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 14 }}>
                  <div style={{ fontWeight: 600, color: "#fff", fontSize: 14 }}>{a.auteur ?? a.author}</div>
                  {(a.detail ?? a.source) && <div style={{ color: C.sand, fontSize: 12, marginTop: 4 }}>{a.detail ?? a.source}</div>}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="contact" style={{ padding: "100px 80px", background: C.sandLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Première consultation</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 4vw, 52px)", color: C.text, margin: "14px 0 16px" }}>{c?.aboutTitle ?? fd?.businessName ?? <>Prêt·e à<br /><em>changer votre rapport à l'alimentation ?</em></>}</h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto 44px", lineHeight: 1.7 }}>{c?.aboutText ?? <>Consultation de 1h (présentiel à {clientCity(sessionData) ?? "Lyon"} ou téléconsultation). Prise en charge partielle par complémentaire santé possible.</>}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div style={{ maxWidth: 560, margin: "0 auto", background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: C.shadowLg, padding: "40px 36px", textAlign: "left" }}>
            <AnimatePresence mode="wait">
              {bookingSent ? (
                <motion.div key="success" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", padding: "24px 8px" }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220, delay: 0.15 }}
                    style={{ width: 60, height: 60, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px" }}>
                    <CheckCircle size={30} color={C.white} />
                  </motion.div>
                  <h3 style={{ fontFamily: FONT, fontSize: 24, color: C.text, marginBottom: 12 }}>Demande envoyée</h3>
                  <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.7 }}>
                    Merci ! Nous confirmons votre créneau par email ou téléphone sous 24h ouvrées. À très vite pour votre première consultation.
                  </p>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleBookingSubmit}>
                  <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                    <NJField label="Nom complet" />
                    <NJField label="Téléphone" type="tel" />
                  </div>
                  <NJField label="Adresse e-mail" type="email" />
                  <NJField label="Type de consultation" type="select">
                    <option value="">Choisir un accompagnement</option>
                    {resolveList<any>(clientServices(sessionData)?.map((r: any) => ({ titre: r.title, desc: r.desc })), ACCOMPAGNEMENTS_DEMO).map((s: any, i: number) => (
                      <option key={s.titre ?? s.name ?? i} value={s.titre ?? s.name}>{s.titre ?? s.name}</option>
                    ))}
                  </NJField>
                  <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                    <NJField label="Date souhaitée" type="date" />
                    <NJField label="Heure" type="select">
                      <option value="">—</option>
                      {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </NJField>
                  </div>
                  <motion.button
                    type="submit"
                    disabled={bookingLoading}
                    whileHover={bookingLoading ? {} : { scale: 1.02 }}
                    whileTap={bookingLoading ? {} : { scale: 0.98 }}
                    style={{
                      width: "100%", minHeight: 50, marginTop: 8, background: bookingLoading ? C.accentDark : C.accent, color: C.white, border: "none", borderRadius: 8,
                      fontFamily: FONT_BODY, fontWeight: 600, fontSize: 15, cursor: bookingLoading ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    }}
                  >
                    {bookingLoading ? (
                      <>
                        <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                          style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${C.white}`, borderTopColor: "transparent", display: "inline-block" }} />
                        Envoi en cours…
                      </>
                    ) : (
                      <>Confirmer ma demande de RDV <ArrowRight size={16} /></>
                    )}
                  </motion.button>
                  <p style={{ fontSize: 12, color: C.textMuted, textAlign: "center", marginTop: 14 }}>
                    Les champs marqués * sont obligatoires. Aucune donnée bancaire n'est demandée à cette étape.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", alignItems: "center", marginTop: 36 }}>
            <span style={{ fontSize: 13, color: C.textMuted }}>Vous préférez nous joindre directement ?</span>
            <motion.a href={`tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33456000000").replace(/[^+0-9]/g, "")}`} style={{ background: "transparent", color: C.text, border: `1.5px solid ${C.border}`, borderRadius: 6, padding: "13px 20px", fontWeight: 600, fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} whileHover={{ borderColor: C.accent, color: C.accent }}>
              <Phone size={15} /> {clientPhone(sessionData) ?? fd?.phone ?? "04 56 00 00 00"}
            </motion.a>
            <motion.a href={`mailto:${clientEmail(sessionData) ?? fd?.email ?? "contact@nourrir-juste.fr"}`} style={{ background: "transparent", color: C.text, border: `1.5px solid ${C.border}`, borderRadius: 6, padding: "13px 20px", fontWeight: 600, fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} whileHover={{ borderColor: C.accent, color: C.accent }}>
              <Mail size={15} /> Écrire
            </motion.a>
          </div>
        </Reveal>
      </section>

      <footer style={{ background: C.bgDark, padding: "44px 80px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 18, fontStyle: "italic", color: C.sand, marginBottom: 8 }}>{clientName(sessionData) ?? "Nourrir Juste"}</div>
            <p style={{ color: "rgba(255,255,255,0.30)", fontSize: 13, lineHeight: 1.6 }}>{clientName(sessionData) ? (clientTagline(sessionData) ?? "Accompagnement nutritionnel personnalisé") : <>Camille Renard · Diététicienne-Nutritionniste<br />Inscrite à l'UPDLF · N°ADELI</>}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[{ icon: <MapPin size={13} />, t: (clientCity(sessionData) ?? "Lyon") + " — Téléconsultation possible" }, { icon: <Phone size={13} />, t: (clientPhone(sessionData) ?? fd?.phone ?? "04 56 00 00 00") }, { icon: <Clock size={13} />, t: "Lun–Sam sur RDV" }].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.38)", fontSize: 13 }}>
                <span style={{ color: C.sand }}>{item.icon}</span>{item.t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ color: "rgba(255,255,255,0.18)", fontSize: 12 }}>© 2026 {clientName(sessionData) ?? "Nourrir Juste · Camille Renard"} — Site par Aevia WS{/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}</span>
          <a href="#contact" style={{ color: "rgba(255,255,255,0.18)", fontSize: 12, textDecoration: "none" }}>{c?.ctaText ?? <>Mentions légales</>}</a>
        </div>
      </footer>
    </div>
  )
}
