"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect, useCallback} from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { Phone, Mail, MapPin, Clock, Star, CheckCircle, ArrowRight, Camera, X } from "lucide-react"
import { resolveList } from "@/lib/templates/resolveList"
import {
  clientCity,
  clientName,
  clientReviews,
  clientServices,
  clientStats,
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
  bg: "#0d0d0d",
  bgSection: "#131313",
  text: "#f5f0e8",
  textMuted: "#8a8070",
  accent: "var(--brand,#e8c97a)",
  accentDark: "var(--brand-light,#c4a44e)",
  accentLight: "#2a2518",
  red: "#c0392b",
  white: "#ffffff",
  border: "rgba(232,201,122,0.15)",
  shadow: "0 2px 14px rgba(0,0,0,0.40)",
  shadowLg: "0 16px 48px rgba(232,201,122,0.15)",
};const FONT = "'DM Serif Display', Georgia, serif"
const FONT_BODY = "'DM Sans', system-ui, sans-serif"

const STATS_DEMO = [
  { value: "9 ans", label: "De pratique" },
  { value: "4 200+", label: "Tatouages réalisés" },
  { value: "4.9★", label: "Google" },
  { value: "3 artistes", label: "Styles variés" },
]
let STATS = STATS_DEMO;


const NAV = [
  { l: "Styles", h: "#styles" },
  { l: "Galerie", h: "#galerie" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];
const GALERIE = [
  { t: "Dos complet réalisme", s: "Noir & gris", d: "Neuf séances de quatre heures, étalées sur onze mois. Cicatrisation contrôlée entre chaque passage." },
  { t: "Avant-bras japonais", s: "Irezumi", d: "Vague, carpe et pivoine, en une pièce continue du coude au poignet. Tracé validé au calque avant la première aiguille." },
  { t: "Fine line florale", s: "Fine line", d: "Aiguille 3RL, encre noire diluée. Le style le plus demandé, et le plus difficile à faire vieillir correctement." },
  { t: "Couverture de cicatrice", s: "Camouflage", d: "Travail sur tissu cicatriciel : moins d'encre, plus de séances, et un test sur 2 cm² six semaines avant." },
  { t: "Lettrage colonne vertébrale", s: "Lettering", d: "Typographie dessinée à la main, jamais une police d'ordinateur. Placement ajusté debout, pas assis." },
  { t: "Reprise de vieux tatouage", s: "Cover-up", d: "Ce qui est possible et ce qui ne l'est pas, dit franchement au premier rendez-vous. Parfois la réponse est un détatouage d'abord." },
];

const TARIFS_DEMO = [
  { a: "Minimum boutique", p: "80 €", n: "En dessous, le temps de préparation et de stérilisation coûte plus que la pièce." },
  { a: "Petite pièce (moins de 8 cm)", p: "80 — 150 €", n: "Une séance, dessin compris. Devis ferme donné au rendez-vous." },
  { a: "Demi-journée (3 h)", p: "330 €", n: "Le format le plus économique pour une pièce moyenne." },
  { a: "Journée (6 h)", p: "600 €", n: "Deux pauses incluses. Prévoyez de manger avant, pas pendant." },
  { a: "Acompte de réservation", p: "60 €", n: "Déduit du total. Non remboursable en cas d'annulation à moins de 48 h." },
  { a: "Retouche à 3 mois", p: "offerte", n: "Une fois, sur la même pièce, si la cicatrisation a été suivie." },
];
let TARIFS = TARIFS_DEMO;

const STYLES_DEMO = [
  { titre: "Blackwork & fine line", desc: "Traits fins, géométrie, mandala, ornements. Technique maîtrisée pour des tracés chirurgicaux durables sur toutes carnations.", tag: "Blackwork" },
  { titre: "Réalisme noir & gris", desc: "Portraits, animaux, nature. Travail d'ombres et de lumières pour un rendu photographique sur peau. Spécialité de l'atelier.", tag: "Réalisme" },
  { titre: "Japonais traditionnel", desc: "Koi, dragon, cerisier, lotus — iconographie japonaise classique avec remplissages couleurs denses et contours puissants.", tag: "Japonais" },
  { titre: "Aquarelle & coloré", desc: "Palettes vibrantes, effets d'éclaboussures, rendu artistique unique. Pour ceux qui veulent un tatouage qui ressemble à une peinture.", tag: "Color" },
  { titre: "Lettering & typographie", desc: "Scripts, capitales, calligraphie manuscrite. Chaque police est dessinée à la main pour un résultat exclusif et personnel.", tag: "Lettering" },
  { titre: "Cover-up & retouches", desc: "Recouvrement de tatouages anciens ou ratés. Consultation obligatoire avant devis. Expertise reconnue en transformation de pièces complexes.", tag: "Cover-up" },
]

const PROCESS = [
  "Consultation gratuite et dessin sur mesure pour chaque client",
  "Matériel à usage unique, stérilisation autoclave certifiée",
  "Suivi post-tatouage avec kit de soin offert",
  "Retouche gratuite incluse dans les 3 mois",
]

const AVIS_SOURCE = [
  { texte: "Je cherchais depuis des mois un artiste capable de faire un réalisme de portrait de mon chien. Le résultat dépasse tout ce que j'imaginais. Une fidélité de dingue. Je reviendrai.", auteur: "Lucie V.", detail: "Réalisme portrait, cuisse" },
  { texte: "Cover-up d'un vieux tatouage raté que je cachais depuis 10 ans. Ils ont transformé ça en quelque chose de magnifique. Merci ! Je ne pouvais plus rêver d'un meilleur résultat.", auteur: "Kevin M.", detail: "Cover-up japonais, bras" },
  { texte: "Fine line fleuri sur la clavicule. Propre, précis, soigné. L'accueil est top, le studio est beau, et on est bien guidé sur les soins après. Je recommande à 100%.", auteur: "Chloé B.", detail: "Fine line floral, clavicule" },
]
let AVIS_DEMO = AVIS_SOURCE;

function ConsultationModal({
  open,
  onClose,
  styles,
  initialStyle,
}: {
  open: boolean
  onClose: () => void
  styles: { titre?: string; name?: string }[]
  initialStyle: string | null
}) {
  const [style, setStyle] = useState("")
  const [date, setDate] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (open) {
      setStyle(initialStyle ?? "")
      setDate(""); setName(""); setEmail(""); setPhone(""); setMessage("")
      setLoading(false); setSent(false)
    }
  }, [open, initialStyle])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!style || !name || !email || !phone) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 1400)
  }

  const inputCls: React.CSSProperties = {
    width: "100%", padding: "13px 16px", background: "rgba(255,255,255,0.04)",
    border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, fontFamily: FONT_BODY,
    fontSize: 14, outline: "none", boxSizing: "border-box",
  }
  const labelCls: React.CSSProperties = {
    display: "block", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase",
    color: C.textMuted, marginBottom: 6,
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.75)" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", width: "100%", maxWidth: 460, background: C.bgSection, border: `1px solid ${C.border}`, borderRadius: 8, maxHeight: "90vh", overflowY: "auto" }}
          >
            <button
              onClick={onClose}
              aria-label="Fermer"
              style={{ position: "absolute", top: 14, right: 14, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", color: C.textMuted, cursor: "pointer" }}
            >
              <X size={20} />
            </button>

            <div style={{ padding: "44px 36px 36px" }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", border: `1px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px", fontSize: 20, color: C.accent }}>✓</div>
                  <h3 style={{ fontFamily: FONT, fontSize: 24, color: C.text, marginBottom: 12 }}>Demande envoyée</h3>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.75 }}>
                    Merci {name}. Votre demande de consultation pour « {style} »{date ? ` le ${date}` : ""} a bien été reçue. Nous vous répondons sous 48h à {email}.
                  </p>
                </div>
              ) : (
                <>
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Consultation gratuite</span>
                  <h3 style={{ fontFamily: FONT, fontSize: 26, color: C.text, margin: "10px 0 24px" }}>Décrivez votre projet</h3>

                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label htmlFor="tat-style" style={labelCls}>Style souhaité *</label>
                      <select id="tat-style" required value={style} onChange={(e) => setStyle(e.target.value)} style={{ ...inputCls, cursor: "pointer" }}>
                        <option value="">Choisir un style</option>
                        {styles.map((s, i) => (
                          <option key={i} value={s.titre ?? s.name}>{s.titre ?? s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="tat-date" style={labelCls}>Date souhaitée (indicative)</label>
                      <input id="tat-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="tat-name" style={labelCls}>Nom complet *</label>
                      <input id="tat-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Lucie Vasseur" style={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="tat-email" style={labelCls}>Email *</label>
                      <input id="tat-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="lucie@email.fr" style={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="tat-phone" style={labelCls}>Téléphone *</label>
                      <input id="tat-phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="06 XX XX XX XX" style={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="tat-message" style={labelCls}>Votre projet (facultatif)</label>
                      <textarea id="tat-message" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Emplacement, taille, inspiration..." style={{ ...inputCls, resize: "none" }} />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        marginTop: 6, minHeight: 46, background: C.accent, color: "#0d0d0d", border: "none",
                        borderRadius: 4, fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                      }}
                    >
                      {loading ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                            style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(13,13,13,0.3)", borderTopColor: "#0d0d0d", display: "inline-block" }}
                          />
                          Envoi en cours…
                        </>
                      ) : "Envoyer ma demande"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function EncreNoirePage() {
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
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  c = session?.generatedContent;
  bp = session?.businessProfile;
  sessionData = session;
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({ ...AVIS_SOURCE[i % AVIS_SOURCE.length], auteur: r.author, texte: r.text })),
    AVIS_SOURCE,
  );
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s, i) => ({ ...TARIFS_DEMO[i % TARIFS_DEMO.length], a: s.title, p: s.price ?? TARIFS_DEMO[i % TARIFS_DEMO.length].p, n: s.desc || TARIFS_DEMO[i % TARIFS_DEMO.length].n })),
    TARIFS_DEMO,
  );
  STATS = resolveList(clientStats(sessionData), STATS_DEMO);
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

  const STYLES = resolveList<any>(clientServices(sessionData)?.map((r: any) => ({ titre: r.title, desc: r.desc })), STYLES_DEMO);
  const [consultOpen, setConsultOpen] = useState(false);
  const [consultStyle, setConsultStyle] = useState<string | null>(null);
  const openConsult = useCallback((style: string | null) => {
    setConsultStyle(style);
    setConsultOpen(true);
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

      <motion.nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px",
        background: scrolled ? "rgba(13,13,13,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        transition: "all 0.4s ease",
      }}>
        <div style={{ fontFamily: FONT, fontSize: 22, color: C.accent }}>
          {fd?.logoBase64 ? (
            // Client logo (uploaded in the brief) replaces the placeholder mark —
            // essential for the client to recognise their brand in the render.
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 30, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <>{/* NOM_LOGO */ clientName(sessionData) ?? "Encre"} <span style={{ fontStyle: "italic" }}>Noire</span></>
          )}
        </div>
        <div id="mb226-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>      {NAV.map(({ l, h }) => (
            <a key={l} href={h} style={{ color: C.textMuted, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.button onClick={() => openConsult(null)} style={{ background: C.accent, color: "#0d0d0d", border: "none", borderRadius: 4, padding: "9px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer", minHeight: 44 }} whileHover={{ background: C.accentDark }}>
            Réserver
          </motion.button>
      </div>
        <button
          className="mb226-burger"
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
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} style={{ color: C.textMuted, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.button onClick={() => openConsult(null)} style={{ background: C.accent, color: "#0d0d0d", border: "none", borderRadius: 4, padding: "9px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer", minHeight: 44 }} whileHover={{ background: C.accentDark }}>
            Réserver
          </motion.button>
        </div>
      )}
      <style>{`
        @media (max-width: 900px) { #mb226-nav { display: none !important; } .mb226-burger { display: flex !important; } }
        /* Fixed 900px min-height + 80px side padding forced a huge content
           stack that pushed the CTA far below the fold on mobile. */
        @media (max-width: 640px) {
          #hero { height: 100dvh !important; min-height: 100dvh !important; }
          .mb226-hero-text { padding: 0 24px 40px !important; }
        }
      `}</style>

      <section id="hero" ref={heroRef} style={{ height: "100dvh", minHeight: "640px", position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <img src={photo(0, "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=1920&q=80")} alt="Studio tatouage Encre Noire Paris" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.52) 45%, rgba(0,0,0,0.12) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.accent}10 0%, transparent 55%)` }} />

        <motion.div className="mb226-hero-text" style={{ position: "relative", zIndex: 1, padding: "0 80px 90px", maxWidth: 780, y: heroTextY, opacity: heroOpacity }}>
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
            style={{ fontFamily: FONT, fontSize: "clamp(42px, 5.5vw, 74px)", fontWeight: 400, color: C.text, lineHeight: 1.05, marginBottom: 24 }}>{c?.heroHeadline ?? <>
            L'art sur peau,<br /><em style={{ color: C.accent }}>pour toujours.</em>
          </>}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
            style={{ fontSize: 17, color: "rgba(245,240,232,0.65)", lineHeight: 1.75, marginBottom: 40, maxWidth: 520 }}>{c?.heroSubline ?? fd?.tagline ?? <>
            Studio Encre Noire réunit 3 artistes tatoueurs spécialisés — blackwork, réalisme, japonais, aquarelle. Chaque pièce est unique, dessinée sur mesure, réalisée avec obsession du détail.
          </>}</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <motion.button onClick={() => openConsult(null)} style={{ background: C.accent, color: "#0d0d0d", border: "none", borderRadius: 4, padding: "15px 32px", fontWeight: 700, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 8px 32px ${C.accent}30`, minHeight: 44 }} whileHover={{ scale: 1.03 }}>
              Prendre RDV <ArrowRight size={16} />
            </motion.button>
            <motion.a href="#styles" style={{ background: "rgba(255,255,255,0.06)", color: C.text, border: `1px solid ${C.border}`, borderRadius: 4, padding: "13px 28px", fontWeight: 500, fontSize: 15, textDecoration: "none" }} whileHover={{ background: "rgba(255,255,255,0.10)" }}>
              Nos styles
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
          <div style={{ width: 24, height: 36, border: `2px solid ${C.border}`, borderRadius: 12, display: "flex", justifyContent: "center", paddingTop: 6 }}>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />
          </div>
        </motion.div>
      </section>

      <section style={{ background: C.accentLight, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "0 80px" }}>
        <div className="imx-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", maxWidth: 1100, margin: "0 auto" }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div style={{ padding: "28px 0", textAlign: "center", borderRight: i < 3 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ fontFamily: FONT, fontSize: 36, color: C.accent, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: C.textMuted, marginTop: 6 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="styles" style={{ padding: "110px 80px", background: C.bg }}>
        <Reveal>
          <div style={{ marginBottom: 60 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Styles & spécialités</span>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(30px, 4vw, 52px)", color: C.text, marginTop: 10, lineHeight: 1.1 }}>Chaque style,<br /><em>une signature propre.</em></h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 18, maxWidth: 1200, margin: "0 auto" }}>
          {STYLES.map((s: any, i: number) => (
            <Reveal key={s.titre ?? s.name ?? i} delay={i * 0.07}>
              <motion.div
                role="button"
                tabIndex={0}
                onClick={() => openConsult(s.titre ?? s.name)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openConsult(s.titre ?? s.name) } }}
                whileHover={{ y: -4, borderColor: C.accent }}
                style={{ background: C.bgSection, borderRadius: 8, padding: "26px 24px", border: `1px solid ${C.border}`, cursor: "pointer" }}
              >
                {(s.tag || s.price) && <span style={{ background: "rgba(232,201,122,0.12)", color: C.accent, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{s.tag ?? s.price}</span>}
                <h3 style={{ fontFamily: FONT, fontSize: 18, color: C.text, margin: "14px 0 10px" }}>{s.titre ?? s.name}</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{s.desc ?? s.description}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      <section style={{ padding: "100px 80px", background: C.bgSection }}>
        <div className="imx-mobstack" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <Reveal>
            <img src={photo(1, "https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=800&q=80")} alt="Artiste tatoueur au travail" style={{ width: "100%", borderRadius: 8, aspectRatio: "4/3", objectFit: "cover" }} />
          </Reveal>
          <Reveal delay={0.15}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Notre hygiène</span>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3vw, 44px)", color: C.text, margin: "12px 0 28px", lineHeight: 1.2 }}>Sécurité <em>absolue</em>,<br />zéro compromis.</h2>
            {PROCESS.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                <CheckCircle size={17} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.65 }}>{p}</span>
              </div>
            ))}
            <motion.button onClick={() => openConsult(null)} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 28, background: C.accent, color: "#0d0d0d", border: "none", borderRadius: 4, padding: "13px 28px", fontWeight: 700, fontSize: 15, cursor: "pointer", minHeight: 44 }} whileHover={{ background: C.accentDark, scale: 1.02 }}>
              Consultation gratuite <ArrowRight size={16} />
            </motion.button>
          </Reveal>
        </div>
      </section>

      <section style={{ padding: "100px 80px", background: "#090909" }}>
        <Reveal><div style={{ textAlign: "center", marginBottom: 52 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Avis clients</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.5vw, 48px)", color: C.text, marginTop: 10 }}>Ils portent <em style={{ color: C.accent }}>nos œuvres.</em></h2>
        </div></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 18, maxWidth: 1100, margin: "0 auto" }}>
          {resolveList<any>(clientReviews(sessionData), AVIS_DEMO).map((a: any, i: number) => (
            <Reveal key={a.auteur ?? a.author ?? i} delay={i * 0.1}>
              <div style={{ background: C.bgSection, border: `1px solid ${C.border}`, borderRadius: 8, padding: "28px 24px" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>{[...Array(a.rating ?? 5)].map((_, j) => <Star key={j} size={13} fill={C.accent} color={C.accent} />)}</div>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, marginBottom: 18 }}>"{a.texte ?? a.text}"</p>
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                  <div style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{a.auteur ?? a.author}</div>
                  {(a.detail ?? a.source) && <div style={{ color: C.accent, fontSize: 12, marginTop: 4 }}>{a.detail ?? a.source}</div>}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="galerie" style={{ padding: "100px 80px", background: C.bg }}>
        <Reveal><div style={{ marginBottom: 56 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Galerie</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(30px, 4vw, 52px)", color: C.text, marginTop: 10, lineHeight: 1.15 }}>Des pièces<br /><em>portées tous les jours.</em></h2>
        </div></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 18, maxWidth: 1200, margin: "0 auto" }}>
          {GALERIE.map((g, i) => (
            <Reveal key={g.t} delay={i * 0.06}>
              <motion.div whileHover={{ y: -5, boxShadow: C.shadowLg }} style={{ background: C.bgSection, borderRadius: 10, padding: "26px 24px", border: `1px solid ${C.border}`, boxShadow: C.shadow, height: "100%" }}>
                <span style={{ background: C.accentLight, color: C.accent, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{g.s}</span>
                <h3 style={{ fontFamily: FONT, fontSize: 18, color: C.text, margin: "14px 0 10px" }}>{g.t}</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{g.d}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="tarifs" style={{ padding: "100px 80px", background: C.bgSection }}>
        <Reveal><div style={{ marginBottom: 56 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Tarifs</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(30px, 4vw, 52px)", color: C.text, marginTop: 10, lineHeight: 1.15 }}>Le prix se dit<br /><em>avant, pas après.</em></h2>
        </div></Reveal>
        <div style={{ maxWidth: 900, margin: "0 auto", background: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, boxShadow: C.shadow, overflow: "hidden" }}>
          {TARIFS.map((t, i) => (
            <Reveal key={t.a} delay={i * 0.05}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: 12, padding: "20px 28px", borderTop: i ? `1px solid ${C.border}` : "none" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{t.a}</div>
                  <div style={{ fontSize: 13, color: C.textMuted, marginTop: 3 }}>{t.n}</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.accent, flexShrink: 0 }}>{t.p}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="contact" style={{ padding: "100px 80px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Prise de RDV</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 4vw, 52px)", color: C.text, margin: "14px 0 16px" }}>{c?.aboutTitle ?? fd?.businessName ?? <>Votre projet<br /><em style={{ color: C.accent }}>commence ici.</em></>}</h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 440, margin: "0 auto 36px", lineHeight: 1.7 }}>{c?.aboutText ?? <>
            Consultation gratuite obligatoire avant chaque tatouage. Remplissez le formulaire, ou contactez-nous par email ou Instagram — réponse sous 48h.
          </>}</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.button onClick={() => openConsult(null)} style={{ background: C.accent, color: "#0d0d0d", border: "none", borderRadius: 4, padding: "15px 36px", fontWeight: 700, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, minHeight: 44 }} whileHover={{ scale: 1.03 }}>
              Demander une consultation <ArrowRight size={18} />
            </motion.button>
            <motion.a href={`mailto:${fd?.email ?? "contact@encrenoire-paris.fr"}`} style={{ background: "transparent", color: C.text, border: `2px solid ${C.border}`, borderRadius: 4, padding: "13px 32px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, minHeight: 44 }} whileHover={{ borderColor: C.accent, color: C.accent }}>
              <Mail size={17} />{fd?.email ?? "contact@encrenoire-paris.fr"}</motion.a>
            <motion.a href={`https://instagram.com/${fd?.instagram ?? "encrenoire.paris"}`} style={{ background: "transparent", color: C.text, border: `2px solid ${C.border}`, borderRadius: 4, padding: "13px 32px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, minHeight: 44 }} whileHover={{ borderColor: C.accent, color: C.accent }}>
              <Camera size={17} /> @encrenoire.paris
            </motion.a>
          </div>
        </Reveal>
      </section>

      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} styles={STYLES} initialStyle={consultStyle} />

      <footer style={{ background: "#050505", borderTop: `1px solid ${C.border}`, padding: "48px 80px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 36 }}>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 20, color: C.accent, marginBottom: 8 }}>Encre <em>Noire</em></div>
            <p style={{ color: "rgba(245,240,232,0.30)", fontSize: 13, lineHeight: 1.6 }}>Studio de tatouage · {clientCity(sessionData) ?? "Paris"}<br />Mar–Sam 10h–19h</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {[{ icon: <MapPin size={13} />, t: (clientCity(sessionData) ?? "Paris") + ", Île-de-France" }, { icon: <Mail size={13} />, t: (fd?.email ?? "contact@encrenoire-paris.fr") }, { icon: <Clock size={13} />, t: "Mar–Sam 10h–19h" }].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(245,240,232,0.35)", fontSize: 13 }}>
                <span style={{ color: C.accent }}>{item.icon}</span>{item.t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ color: "rgba(245,240,232,0.18)", fontSize: 12 }}>© 2026 Encre Noire Studio — Site par Aevia WS{/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}</span>
          <a href="#contact" style={{ color: "rgba(245,240,232,0.18)", fontSize: 12, textDecoration: "none" }}>{c?.ctaText ?? <>Mentions légales</>}</a>
        </div>
      </footer>
    </div>
  )
}
