"use client";
// @ts-nocheck

import React, {useRef, useState, useEffect, useCallback} from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { Scissors, Phone, Mail, MapPin, Clock, Star, CheckCircle, ArrowRight, Calendar, X } from "lucide-react"
import { resolveList } from "@/lib/templates/resolveList"
import {
  clientCity,
  clientHeroLine,
  clientHeroSubtitle,
  clientName,
  clientPhotos,
  clientReviews,
  clientServices,
  clientStats,
  clientTeam,
  clientText,
  clientTrade,
} from "@/lib/templates/clientContent";

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let bp: any = null;
// La session complète, pour lib/templates/clientContent : même portée
// que fd/c/bp, pour les sous-composants qui n'ont pas de props.
let sessionData: any = null;
let brand: any = null;


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
};
const FONT = "'Playfair Display', Georgia, serif"
const FONT_BODY = "'Raleway', system-ui, sans-serif"

const STATS_DEMO = [
  { value: "11 ans", label: "D'expertise" },
  { value: "6", label: "Barbiers certifiés" },
  { value: "4.9★", label: "Avis Google" },
  { value: "45 min", label: "Prestation signature" },
]
let STATS = STATS_DEMO;


const NAV = [
  { l: "Prestations", h: "#prestations" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "L'équipe", h: "#equipe" },
  { l: "Contact", h: "#contact" },
];
const TARIFS_DEMO = [
  { a: "Coupe classique", p: "26 €", n: "Tondeuse et ciseaux, shampoing et coiffage compris. 30 minutes." },
  { a: "Coupe + barbe", p: "38 €", n: "Le rendez-vous le plus demandé. Serviette chaude, huile, baume. 45 minutes." },
  { a: "Rasage à l'ancienne", p: "30 €", n: "Coupe-chou, deux passages, serviette chaude avant et après. 35 minutes." },
  { a: "Taille de barbe", p: "20 €", n: "Contours au rasoir, longueur travaillée aux ciseaux. 25 minutes." },
  { a: "Coupe enfant (- 12 ans)", p: "18 €", n: "Rehausseur sur le fauteuil, et le droit de bouger un peu." },
  { a: "Forfait père & fils", p: "40 €", n: "Deux coupes à la suite, sur le même créneau." },
];
let TARIFS = TARIFS_DEMO;

const EQUIPE_DEMO = [
  { n: "Vincent Cazals", r: "Fondateur · Barbier", d: "Formé chez un maître barbier de Barcelone. Vingt ans de coupe-chou, et il aiguise encore ses lames lui-même." },
  { n: "Rachid Berrada", r: "Barbier · Dégradés", d: "Le fade, la transition invisible, les contours au rasoir. C'est lui qu'on demande pour les coupes courtes." },
  { n: "Louis Tessier", r: "Coiffeur · Cheveux longs", d: "Coupes aux ciseaux, boucles, entretien des cheveux mi-longs. Vient du milieu de la coiffure femme." },
  { n: "Enzo Marchisio", r: "Barbier junior", d: "En troisième année d'apprentissage. Tarif réduit de 5 € sur ses créneaux, annoncé à la réservation." },
];
let EQUIPE = EQUIPE_DEMO;

const PRESTATIONS_SOURCE = [
  { titre: "Coupe homme classique", desc: "Ciseaux ou tondeuse, dégradé américain ou anglais, finition rasoir. Shampooing + coupe + styling — 35€.", tag: "Coupe" },
  { titre: "Rasage traditionnel", desc: "Rasage lame droite avec préparation serviettes chaudes, huile, mousse artisanale. Soin de peau inclus. Un rituel d'exception — 45€.", tag: "Rasage" },
  { titre: "Barbe taillée & modelée", desc: "Définition du contour, dégradé de longueurs, finition à la cire. Du bouc au beard full — 25€.", tag: "Barbe" },
  { titre: "Coupe + barbe", desc: "Forfait complet : coupe homme + taille de barbe + rasage des contours. Le combo incontournable — 55€.", tag: "Combo" },
  { titre: "Soin cuir chevelu", desc: "Traitement anti-chute, hydratation profonde ou purifiant selon type de cuir chevelu. En complément ou seul — 30€.", tag: "Soin" },
  { titre: "Colorimétrie & grisonnants", desc: "Couvrage des blancs, reflets, balayage discret pour hommes. Naturel ou audacieux selon votre style — sur devis.", tag: "Couleur" },
]
let PRESTATIONS_DEMO = PRESTATIONS_SOURCE;

const VALEURS = [
  "Produits 100% naturels : Kevin Murphy, Baxter of California",
  "Ambiance feutrée, whisky offert pour les rasages",
  "Réservation en ligne ou sans rendez-vous les mardis",
  "Carte fidélité : 10e coupe offerte",
]

const AVIS_SOURCE = [
  { texte: "Le meilleur rasage de ma vie. Serviettes chaudes, mousse artisanale, lame droite, soin après. J'y vais chaque mois et je ressors à chaque fois comme une star. Un endroit à part.", auteur: "Antoine R.", detail: "Rasage traditionnel" },
  { texte: "Cherchais un barbier qui maîtrise le dégradé peau sans faire de bourrelets. Premier essai et c'est exactement ce que je voulais. Prix honnête, ambiance cool. Mon nouveau QG.", auteur: "Kévin L.", detail: "Coupe dégradé" },
  { texte: "Mon fils de 8 ans avait peur du coiffeur. Ici, ils ont été patients, fun, et il est reparti en disant 'trop bien'. C'est devenu un moment père-fils qu'il attend avec impatience.", auteur: "Famille Morel", detail: "Coupe enfant" },
]
let AVIS_DEMO = AVIS_SOURCE;

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

const BARBER_TIME_SLOTS = ["9h00", "10h00", "11h00", "13h00", "14h00", "15h00", "16h00", "17h00", "18h00"]

function BarberBookingModal({
  open,
  onClose,
  prestations,
  initialPrestation,
}: {
  open: boolean
  onClose: () => void
  prestations: { titre?: string }[]
  initialPrestation: string | null
}) {
  const [service, setService] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (open) {
      setService(initialPrestation ?? "")
      setDate(""); setTime(""); setName(""); setEmail(""); setPhone("")
      setLoading(false); setSent(false)
    }
  }, [open, initialPrestation])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!service || !date || !time || !name || !phone) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 1400)
  }

  const inputCls: React.CSSProperties = {
    width: "100%", padding: "13px 16px", background: C.bg,
    border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontFamily: FONT_BODY,
    fontSize: 14, outline: "none", boxSizing: "border-box",
  }
  const labelCls: React.CSSProperties = {
    display: "block", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
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
          style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(28,20,16,0.65)" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", width: "100%", maxWidth: 460, background: C.white, borderRadius: 12, maxHeight: "90vh", overflowY: "auto" }}
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
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px", fontSize: 20, color: C.accent }}>✓</div>
                  <h3 style={{ fontFamily: FONT, fontSize: 24, color: C.text, marginBottom: 12 }}>Rendez-vous demandé</h3>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.75 }}>
                    Merci {name}. « {service} » réservé le {date} à {time}. Nous vous confirmons par SMS ou email à {email || "votre contact"}.
                  </p>
                </div>
              ) : (
                <>
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Réservation</span>
                  <h3 style={{ fontFamily: FONT, fontSize: 26, color: C.text, margin: "10px 0 24px" }}>Prendre rendez-vous</h3>

                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label htmlFor="brb-service" style={labelCls}>Prestation *</label>
                      <select id="brb-service" required value={service} onChange={(e) => setService(e.target.value)} style={{ ...inputCls, cursor: "pointer" }}>
                        <option value="">Choisir une prestation</option>
                        {prestations.map((p, i) => (
                          <option key={i} value={p.titre}>{p.titre}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      <div>
                        <label htmlFor="brb-date" style={labelCls}>Date *</label>
                        <input id="brb-date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} style={inputCls} />
                      </div>
                      <div>
                        <label htmlFor="brb-time" style={labelCls}>Heure *</label>
                        <select id="brb-time" required value={time} onChange={(e) => setTime(e.target.value)} style={{ ...inputCls, cursor: "pointer" }}>
                          <option value="">—</option>
                          {BARBER_TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="brb-name" style={labelCls}>Nom complet *</label>
                      <input id="brb-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Antoine Rousseau" style={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="brb-phone" style={labelCls}>Téléphone *</label>
                      <input id="brb-phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="06 78 37 37 37" style={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="brb-email" style={labelCls}>Email</label>
                      <input id="brb-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="antoine@email.fr" style={inputCls} />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        marginTop: 6, minHeight: 46, background: C.accent, color: C.white, border: "none",
                        borderRadius: 6, fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                      }}
                    >
                      {loading ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                            style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", display: "inline-block" }}
                          />
                          Envoi en cours…
                        </>
                      ) : "Confirmer le rendez-vous"}
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


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
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
  PRESTATIONS_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({ ...PRESTATIONS_SOURCE[i % PRESTATIONS_SOURCE.length], titre: s.title })),
    PRESTATIONS_SOURCE,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({ ...AVIS_SOURCE[i % AVIS_SOURCE.length], auteur: r.author, texte: r.text })),
    AVIS_SOURCE,
  );
  EQUIPE = resolveList(
    clientTeam(sessionData)?.map((m, i) => ({ ...EQUIPE_DEMO[i % EQUIPE_DEMO.length], n: m.name, r: m.role })),
    EQUIPE_DEMO,
  );
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s, i) => ({ ...TARIFS_DEMO[i % TARIFS_DEMO.length], a: s.title, p: s.price ?? TARIFS_DEMO[i % TARIFS_DEMO.length].p, n: s.desc || TARIFS_DEMO[i % TARIFS_DEMO.length].n })),
    TARIFS_DEMO,
  );
  STATS = resolveList(clientStats(sessionData), STATS_DEMO);
  brand = fd?.brandColor ?? null; // null = keep template's original color

  if (brand) {
    C = {
      ...C,
      accent: brand,
    };
  }

  const PRESTATIONS = resolveList(clientServices(sessionData)?.map((sv: any, i: number) => ({ titre: sv.title ?? sv.name, desc: sv.description ?? sv.desc, tag: sv.price ?? PRESTATIONS_DEMO[i % PRESTATIONS_DEMO.length].tag })), PRESTATIONS_DEMO);
  const AVIS = resolveList(clientReviews(sessionData)?.map((r: any) => ({ texte: r.text ?? r.quote, auteur: r.name ?? r.author, detail: r.detail ?? r.context ?? "" })), AVIS_DEMO);

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

  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingPrestation, setBookingPrestation] = useState<string | null>(null)
  const openBooking = useCallback((prestation: string | null) => {
    setBookingPrestation(prestation)
    setBookingOpen(true)
  }, [])

return (
    <div style={{ background: C.bg, fontFamily: FONT_BODY, overflowX: "hidden" }}>
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Raleway:wght@300;400;500;600;700&display=swap');
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
              <span style={{ fontFamily: FONT, fontSize: 20, color: scrolled ? C.text : "#fff" }}>{(clientName(sessionData) ?? "Le Barber Club").split(" ").slice(0, 2).join(" ")} <em>{(clientName(sessionData) ?? "Le Barber Club").split(" ").slice(2).join(" ")}</em></span>
            </>
          )}
        </div>
        <div id="mb227-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>      {NAV.map(({ l, h }) => (
            <a key={l} href={h} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.button onClick={() => openBooking(null)} style={{ background: C.accent, color: C.white, border: "none", borderRadius: 6, padding: "9px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, minHeight: 44 }} whileHover={{ background: "var(--brand,#704f0a)" }}>
            <Calendar size={14} /> Réserver
          </motion.button>
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
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} style={{ color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{l}</a>
          ))}
          <motion.button onClick={() => openBooking(null)} style={{ background: C.accent, color: C.white, border: "none", borderRadius: 6, padding: "9px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, minHeight: 44 }} whileHover={{ background: "var(--brand,#704f0a)" }}>
            <Calendar size={14} /> Réserver
          </motion.button>
        </div>
      )}
      <style>{`
        @media (max-width: 900px) { #mb227-nav { display: none !important; } .mb227-burger { display: flex !important; } }
        @media (max-width: 640px) {
          #hero { height: 100dvh !important; min-height: 100dvh !important; }
          .mb227-hero-text { padding: 0 24px 40px !important; }
        }
      `}</style>

      <section id="hero" ref={heroRef} style={{ height: "100dvh", minHeight: "640px", position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <img src={photo(0, (clientPhotos(sessionData)[0] || "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1920&q=80"))} alt={`${clientName(sessionData) ?? "Le Barber Club"} Lyon`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,6,3,0.93) 0%, rgba(10,6,3,0.42) 45%, rgba(10,6,3,0.08) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.accent}18 0%, transparent 55%)` }} />
        <motion.div className="mb227-hero-text" style={{ position: "relative", zIndex: 1, padding: "0 80px 90px", maxWidth: 760, y: heroTextY, opacity: heroOpacity }}>
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
            style={{ fontFamily: FONT, fontSize: "clamp(40px, 5.2vw, 70px)", fontWeight: 400, color: "#fff", lineHeight: 1.1, marginBottom: 24 }}>{/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ?? (<>{<>{clientHeroLine(sessionData, 0, 2, 23) ?? "L'art du soin masculin,"}<br /><em style={{ color: C.accentLight }}>{clientHeroLine(sessionData, 1, 2, 23) ?? "à l'ancienne."}</em>
          </>}</>)}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
            style={{ fontSize: 17, color: "rgba(255,255,255,0.70)", lineHeight: 1.75, marginBottom: 40, maxWidth: 510 }}>{c?.heroSubline ?? clientHeroSubtitle(sessionData) ?? <>
            Coupes, rasages au blaireau, soins barbe et cuir chevelu — {clientName(sessionData) ?? "Le Barber Club"} est l'adresse des hommes qui ne veulent pas choisir entre style et tradition.
          </>}</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <motion.button onClick={() => openBooking(null)} style={{ background: C.accent, color: C.white, border: "none", borderRadius: 6, padding: "15px 32px", fontWeight: 600, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 8px 32px ${C.accent}44`, minHeight: 44 }} whileHover={{ scale: 1.03 }}>
              <Calendar size={18} /> Réserver en ligne
            </motion.button>
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
        <div className="imx-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", maxWidth: 1100, margin: "0 auto" }}>
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
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(30px, 4vw, 50px)", color: C.text, marginTop: 10, lineHeight: 1.15 }}>{/* TEXTE_SECTION */ clientText(sessionData, "prestations.titre") ?? (<>Chaque prestation,<br /><em>un soin complet.</em></>)}</h2>
        </div></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 18, maxWidth: 1200, margin: "0 auto" }}>
          {PRESTATIONS.map((p: any, i: number) => (
            <Reveal key={p.titre} delay={i * 0.07}>
              <motion.div
                role="button"
                tabIndex={0}
                onClick={() => openBooking(p.titre)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openBooking(p.titre) } }}
                whileHover={{ y: -5, boxShadow: C.shadowLg }}
                style={{ background: C.white, borderRadius: 10, padding: "26px 24px", border: `1px solid ${C.border}`, boxShadow: C.shadow, cursor: "pointer" }}
              >
                <span style={{ background: C.accentLight, color: C.accent, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{p.tag}</span>
                <h3 style={{ fontFamily: FONT, fontSize: 18, color: C.text, margin: "14px 0 10px" }}>{p.titre}</h3>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{p.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      <section style={{ padding: "100px 80px", background: C.bgSection }}>
        <div className="imx-mobstack" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <Reveal delay={0.1}><div>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Notre engagement</span>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3vw, 44px)", color: C.text, margin: "12px 0 28px", lineHeight: 1.2 }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-4.titre") ?? (<>L'expérience compte<br /><em>autant que la coupe.</em></>)}</h2>
            {VALEURS.map((v, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                <CheckCircle size={17} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.65 }}>{v}</span>
              </div>
            ))}
            <motion.button onClick={() => openBooking(null)} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 28, background: C.accent, color: C.white, border: "none", borderRadius: 6, padding: "13px 28px", fontWeight: 600, fontSize: 15, cursor: "pointer", minHeight: 44 }} whileHover={{ background: "var(--brand,#704f0a)", scale: 1.02 }}>
              Réserver <ArrowRight size={16} />
            </motion.button>
          </div></Reveal>
          <Reveal><img src={photo(1, (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80"))} alt="Barbier rasage traditionnel" style={{ width: "100%", borderRadius: 12, aspectRatio: "4/3", objectFit: "cover" }} /></Reveal>
        </div>
      </section>

      <section style={{ padding: "100px 80px", background: C.bgDark }}>
        <Reveal><div style={{ textAlign: "center", marginBottom: 52 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accentLight }}>Avis</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 3.5vw, 48px)", color: "#fff", marginTop: 10 }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-5.titre") ?? (<>Les clients <em style={{ color: C.accentLight }}>parlent.</em></>)}</h2>
        </div></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 18, maxWidth: 1100, margin: "0 auto" }}>
          {AVIS.map((a: any, i: number) => (
            <Reveal key={a.auteur ?? i} delay={i * 0.1}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "26px 24px" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>{[...Array(5)].map((_, j) => <Star key={j} size={13} fill={C.accentLight} color={C.accentLight} />)}</div>
                <p style={{ fontFamily: FONT, fontSize: 15, fontStyle: "italic", color: "rgba(255,255,255,0.78)", lineHeight: 1.7, marginBottom: 18 }}>"{a.texte}"</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 14 }}>
                  <div style={{ fontWeight: 600, color: "#fff", fontSize: 14 }}>{a.auteur}</div>
                  {a.detail && <div style={{ color: C.accentLight, fontSize: 12, marginTop: 4 }}>{a.detail}</div>}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="tarifs" style={{ padding: "100px 80px", background: C.white }}>
        <Reveal><div style={{ marginBottom: 56 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Tarifs</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(30px, 4vw, 52px)", color: C.text, marginTop: 10, lineHeight: 1.15 }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Un prix par prestation,<br /><em>et rien au-dessus.</em></>)}</h2>
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

      <section id="equipe" style={{ padding: "100px 80px", background: C.bgSection }}>
        <Reveal><div style={{ marginBottom: 56 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>L&apos;équipe</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(30px, 4vw, 52px)", color: C.text, marginTop: 10, lineHeight: 1.15 }}>{/* TEXTE_SECTION */ clientText(sessionData, "equipe.titre") ?? (<>Quatre fauteuils,<br /><em>quatre mains différentes.</em></>)}</h2>
        </div></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 18, maxWidth: 1200, margin: "0 auto" }}>
          {EQUIPE.map((m, i) => (
            <Reveal key={m.n} delay={i * 0.06}>
              <motion.div whileHover={{ y: -5, boxShadow: C.shadowLg }} style={{ background: C.white, borderRadius: 10, padding: "26px 24px", border: `1px solid ${C.border}`, boxShadow: C.shadow, height: "100%" }}>
                <h3 style={{ fontFamily: FONT, fontSize: 18, color: C.text }}>{m.n}</h3>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: C.accent, margin: "8px 0 14px" }}>{m.r}</div>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{m.d}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="contact" style={{ padding: "100px 80px", background: C.accentLight, textAlign: "center" }}>
        <Reveal>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.accent }}>Réservation</span>
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(28px, 4vw, 50px)", color: C.text, margin: "14px 0 16px" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>Prenez <em>soin de vous</em>.</>)}</h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 420, margin: "0 auto 36px", lineHeight: 1.7 }}>Réservation en ligne ou par téléphone. Walk-in bienvenu les mardis après 14h.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.button onClick={() => openBooking(null)} style={{ background: C.bgDark, color: C.white, border: "none", borderRadius: 6, padding: "15px 36px", fontWeight: 600, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, minHeight: 44 }} whileHover={{ scale: 1.03 }}>
              <Calendar size={18} /> Réserver en ligne
            </motion.button>
            <motion.a href={`tel:${fd?.phone ?? "+33478000001"}`} style={{ background: "transparent", color: C.text, border: `2px solid ${C.accent}`, borderRadius: 6, padding: "13px 32px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, minHeight: 44 }} whileHover={{ background: C.accent, color: C.white }}>
              <Phone size={17} /> {fd?.phone ?? "04 78 00 00 01"}
            </motion.a>
            <motion.a href={`mailto:${fd?.email ?? "hello@lebarberclub.fr"}`} style={{ background: "transparent", color: C.text, border: `2px solid ${C.accent}`, borderRadius: 6, padding: "13px 32px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, minHeight: 44 }} whileHover={{ background: C.accent, color: C.white }}>
              <Mail size={17} /> Écrire
            </motion.a>
          </div>
        </Reveal>
      </section>

      <BarberBookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} prestations={PRESTATIONS} initialPrestation={bookingPrestation} />

      <footer style={{ background: C.bgDark, padding: "44px 80px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 18, color: C.accentLight, marginBottom: 8 }}>{clientName(sessionData) ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Le Barber Club"))}</div>
            <p style={{ color: "rgba(255,255,255,0.30)", fontSize: 13, lineHeight: 1.6 }}>{clientTrade(sessionData) ?? "Barbier"} · {clientCity(sessionData) ?? "Lyon"}<br />Lun–Sam 9h–19h</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[{ icon: <MapPin size={13} />, t: (clientCity(sessionData) ?? "Lyon") + ", Rhône" }, { icon: <Phone size={13} />, t: (fd?.phone ?? "04 78 00 00 01") }, { icon: <Clock size={13} />, t: "Lun–Sam 9h–19h" }].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.38)", fontSize: 13 }}>
                <span style={{ color: C.accentLight }}>{item.icon}</span>{item.t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ color: "rgba(255,255,255,0.18)", fontSize: 12 }}>© 2026 {clientName(sessionData) ?? "Le Barber Club"} — Site par Aevia WS{/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}</span>
          <a href="#contact" style={{ color: "rgba(255,255,255,0.18)", fontSize: 12, textDecoration: "none" }}>{c?.ctaText ?? <>Mentions légales</>}</a>
        </div>
      </footer>
    </div>
  )
}
