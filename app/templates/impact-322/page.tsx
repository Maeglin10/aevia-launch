"use client";
// @ts-nocheck

/*
 * ══════════════════════════════════════════════════════════════════════
 * impact-322 — Agence Prestige · agence événementielle haut de gamme
 * Réécriture famille I → squelette premium (plan REPRISE_316_383, lot B).
 * Geste signature : PortalZoom (≠) — une arche découpée dans la photo
 * laisse voir la scène suivante au travers ; à la transition, on
 * traverse le seuil.
 * Archétype H3 : plein cadre, titre bas, fond de repli C.bgDark.
 * Fontes P3 : Cormorant Garamond (serif) + system-ui.
 * Palette sombre #14100c / or champagne #c5a880 (pilotée par --brand).
 * Signature visuelle : portail en arche, section-respiration serif,
 * galerie mosaïque.
 * ══════════════════════════════════════════════════════════════════════
 */

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight, Check, Mail, MapPin, Menu, Phone, Quote, Star, X } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, useSlides, SlideIndex, HairlineArrows } from "@/lib/templates/hero-kit-2";
import { PortalZoom } from "@/lib/templates/hero-kit-3";
import {
  clientAddress,
  clientCertifications,
  clientCity,
  clientEmail,
  clientEyebrow,
  clientHeroLine,
  clientHeroSubtitle,
  clientList,
  clientName,
  clientPhone,
  clientPhotos,
  clientReviews,
  clientServices,
  clientStats,
  clientTagline,
  clientText,
  clientTrade,
} from "@/lib/templates/clientContent";

/* Variables de module lues par les sections et sous-composants :
   même portée que dans le patron impact-351. */
let fd: any = null;
let c: any = null;
let bp: any = null;
let sessionData: any = null;

/* ── Tokens ──────────────────────────────────────────────────────────── */
const C = {
  bg: "#14100c",
  bgAlt: "#191410",
  bgDark: "#0d0a07",
  bgDarkAlt: "#171108",
  bgCard: "#1e1812",
  accent: "var(--brand,#c5a880)",
  accentDark: "var(--brand-light,#dcc49e)",
  accentLight: "rgba(197,168,128,0.13)",
  ink: "#f3ede2",
  textMuted: "#a2937d",
  textFaint: "#6b5f4e",
  border: "rgba(197,168,128,0.16)",
  white: "#ffffff",
  glow: "rgba(197,168,128,0.11)",
};

const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS = "system-ui, -apple-system, 'Segoe UI', sans-serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
/* Le seuil : une arche — la forme signature du thème. */
const ARCHE = "inset(20% 36% 0% 36% round 48% 48% 0 0 / 36% 36% 0 0)";

/* ── Photos : URLs existantes du thème, jamais de nouvelle URL ───────── */
const PHOTO_FALLBACKS = [
  "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=2070", // 0 hero — salle d'apparat
  "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=2070", // 1 l'agence
  "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&q=80&w=2065", // 2 gala
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2070", // 3 conférence
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=2098", // 4 dîner d'exception
  "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&q=80&w=2070", // 5 galerie
  "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&q=80&w=2070", // 6 galerie
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2070", // 7 galerie
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=2070", // 8 galerie
  "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=2070", // 9 galerie
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=2069", // 10 galerie
];

function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ── Données de démonstration (contenu rédactionnel conservé) ────────── */

const SERVICES_SOURCE = [
  {
    n: "01",
    title: "Galas & Réceptions",
    description:
      "Organisation sur mesure d'événements prestigieux. Du choix du lieu d'exception à la scénographie, nous créons des soirées inoubliables pour vos invités de marque.",
  },
  {
    n: "02",
    title: "Lancements de Produits",
    description:
      "Des mises en scène spectaculaires pour révéler vos nouveautés. Nous concevons des expériences immersives qui marquent les esprits et subliment votre marque.",
  },
  {
    n: "03",
    title: "Séminaires Haut de Gamme",
    description:
      "Des retraites professionnelles alliant travail et raffinement. Retrouvez cohésion et inspiration dans des cadres exclusifs et confidentiels.",
  },
];

const TEMOIGNAGES_SOURCE = [
  {
    name: "Jean-Pierre Laurent",
    role: "Directeur Général, Maison L.",
    content: "Une exécution parfaite pour notre gala annuel. L'attention aux détails et le raffinement de l'organisation ont ébloui nos partenaires internationaux.",
  },
  {
    name: "Claire Dubois",
    role: "VP Marketing, TechLuxe",
    content: "Le lancement de notre nouvelle collection a été un succès retentissant. Leur équipe a su capturer l'essence de notre marque avec une élégance rare.",
  },
  {
    name: "Marc Antoine",
    role: "CEO, Horizon Groupe",
    content: "Le séminaire de direction organisé à Courchevel restera dans les annales. Un service discret, réactif et d'un professionnalisme absolu.",
  },
];

const STATS_SOURCE = [
  { value: "150+", label: "Événements Prestigieux" },
  { value: "10", label: "Années d'Excellence" },
];

const ENGAGEMENTS_SOURCE = [
  { t: "Réseau Exclusif", d: "Accès privilégié aux lieux les plus convoités et aux prestataires haut de gamme." },
  { t: "Design Sur Mesure", d: "Scénographie et direction artistique pensées spécifiquement pour votre marque." },
  { t: "Discrétion Absolue", d: "Confidentialité totale pour vos événements VIP et comités de direction." },
];

const MARQUES_SOURCE = ["Chanel", "LVMH", "Cartier", "Dior", "Rolex"];

const GALERIE_LEGENDES = [
  { cat: "Soirée de Gala", t: "Lancement Collection Hiver" },
  { cat: "Soirée de Gala", t: "Lancement Collection Hiver" },
  { cat: "Soirée de Gala", t: "Lancement Collection Hiver" },
  { cat: "Soirée de Gala", t: "Lancement Collection Hiver" },
  { cat: "Soirée de Gala", t: "Lancement Collection Hiver" },
  { cat: "Soirée de Gala", t: "Lancement Collection Hiver" },
];

/* ── Fonctions LIVE : ré-appelées dans Page() après sessionData ──────── */

function SERVICES_LIVE() {
  return resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...SERVICES_SOURCE[i % SERVICES_SOURCE.length],
      n: String(i + 1).padStart(2, "0"),
      title: s.title ?? SERVICES_SOURCE[i % SERVICES_SOURCE.length].title,
      description: s.description ?? s.desc ?? SERVICES_SOURCE[i % SERVICES_SOURCE.length].description,
      price: s.price,
    })),
    SERVICES_SOURCE,
  );
}

function TEMOIGNAGES_LIVE() {
  return resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      ...TEMOIGNAGES_SOURCE[i % TEMOIGNAGES_SOURCE.length],
      name: r.name ?? r.author ?? TEMOIGNAGES_SOURCE[i % TEMOIGNAGES_SOURCE.length].name,
      role: r.location ?? r.role ?? TEMOIGNAGES_SOURCE[i % TEMOIGNAGES_SOURCE.length].role,
      content: r.text ?? r.quote ?? TEMOIGNAGES_SOURCE[i % TEMOIGNAGES_SOURCE.length].content,
    })),
    TEMOIGNAGES_SOURCE,
  );
}

function STATS_LIVE() {
  return resolveList(
    clientStats(sessionData)?.map((s: any, i: number) => ({
      ...STATS_SOURCE[i % STATS_SOURCE.length],
      value: s.value,
      label: s.label,
    })),
    STATS_SOURCE,
  );
}

function ENGAGEMENTS_LIVE() {
  return resolveList(
    clientCertifications(sessionData)?.map((e: string, i: number) => ({
      ...ENGAGEMENTS_SOURCE[i % ENGAGEMENTS_SOURCE.length],
      t: e,
      d: "",
    })),
    ENGAGEMENTS_SOURCE,
  );
}

/* ── Petits composants ───────────────────────────────────────────────── */

function Reveal({ children, delay = 0, y = 28 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.85, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

function Kicker({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "clamp(14px, 2vw, 22px)", justifyContent: center ? "center" : "flex-start" }}>
      <span aria-hidden style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${C.accent})`, display: "block" }} />
      <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.38em", textTransform: "uppercase", color: C.accentDark }}>
        {children}
      </span>
      {center && <span aria-hidden style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${C.accent}, transparent)`, display: "block" }} />}
    </div>
  );
}

/* Une rangée éditoriale numérotée par expertise — survol en state local. */
function ServiceRow322({ sv }: { sv: any }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="i322-servicerow"
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "clamp(52px, 7vw, 110px) minmax(0, 1fr) auto",
        gap: "clamp(14px, 2.6vw, 40px)",
        alignItems: "baseline",
        padding: "clamp(24px, 3.4vw, 44px) clamp(10px, 1.6vw, 22px)",
        borderTop: `1px solid ${C.border}`,
        background: hover ? "rgba(197,168,128,0.045)" : "transparent",
        transform: hover ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hover ? "0 22px 44px rgba(0,0,0,0.45), 0 4px 14px rgba(197,168,128,0.1)" : "none",
        transition: "background 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <span aria-hidden style={{ position: "absolute", left: 0, bottom: -1, height: 1, width: hover ? "100%" : "0%", background: `linear-gradient(90deg, ${C.accent}, transparent)`, transition: "width 0.55s cubic-bezier(0.16,1,0.3,1)" }} />
      <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(22px, 3vw, 36px)", color: hover ? C.accentDark : C.textFaint, transition: "color 0.5s cubic-bezier(0.16,1,0.3,1)", lineHeight: 1 }}>
        {sv.n}
      </span>
      <div style={{ minWidth: 0 }}>
        <h3 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "clamp(22px, 2.8vw, 32px)", lineHeight: 1.12, color: C.ink, margin: "0 0 10px" }}>{sv.title}</h3>
        <p style={{ fontFamily: SANS, fontSize: "clamp(14px, 1.6vw, 15.5px)", fontWeight: 300, color: C.textMuted, lineHeight: 1.75, maxWidth: 520, margin: 0 }}>{sv.description}</p>
        {sv.price ? (
          <span style={{ display: "inline-block", marginTop: 12, fontFamily: SANS, fontSize: 12.5, letterSpacing: "0.08em", color: C.accentDark, border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 14px" }}>
            {sv.price}
          </span>
        ) : null}
      </div>
      <motion.span animate={{ x: hover ? 6 : 0, opacity: hover ? 1 : 0.45 }} transition={{ duration: 0.5, ease: EASE }} style={{ color: C.accentDark, display: "flex" }}>
        <ArrowRight size={20} />
      </motion.span>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────── */

export default function Impact322Page() {
  const [session, setSession] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let id = new URLSearchParams(window.location.search).get("session");
    /* La navigation interne perd le paramètre : on retient la session par thème. */
    try {
      const cleSession = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cleSession, id);
      else id = sessionStorage.getItem(cleSession);
    } catch {}
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  /* Affectations AVANT tout appel de helper. */
  fd = session?.formData;
  c = session?.generatedContent;
  bp = session?.businessProfile;
  sessionData = session;

  const SERVICES = SERVICES_LIVE();
  const TEMOIGNAGES = TEMOIGNAGES_LIVE();
  const STATS = STATS_LIVE();
  const ENGAGEMENTS = ENGAGEMENTS_LIVE();

  const businessName = clientName(sessionData) ?? "Agence Prestige";
  const phone = clientPhone(sessionData) ?? fd?.contactPhone ?? "+33 1 74 89 65 41";
  const mail = clientEmail(sessionData) ?? fd?.contactEmail ?? "contact@agence-prestige.com";
  const adresse = clientAddress(sessionData) ?? fd?.location ?? "8 Avenue Montaigne, 75008 Paris";

  /* Le portail tourne sur trois scènes ; les légendes viennent des
     expertises (celles du client quand il y en a). Un seul index pilote
     tout le héros : images, légende, compteur. */
  const HERO_IMAGES = [photo(0, PHOTO_FALLBACKS[0]), photo(3, PHOTO_FALLBACKS[3]), photo(4, PHOTO_FALLBACKS[4])];
  const HERO_LABELS = [0, 1, 2].map((n) => SERVICES[n % SERVICES.length]?.title ?? SERVICES_SOURCE[n].title);
  const { i, next, prev } = useSlides(HERO_IMAGES.length, DWELL.slow);

  /* Avis en pleine lumière, un à la fois. */
  const { i: ti, next: tNext, prev: tPrev } = useSlides(TEMOIGNAGES.length, DWELL.slow);
  const T = TEMOIGNAGES[ti % TEMOIGNAGES.length];

  const L1 = clientHeroLine(sessionData, 0, 2, 22);
  const L2 = clientHeroLine(sessionData, 1, 2, 22);

  const NAV = [
    { l: "Accueil", h: "#hero" },
    { l: "L'Agence", h: "#about" },
    { l: "Expertises", h: "#services" },
    { l: "Réalisations", h: "#portfolio" },
    { l: "Contact", h: "#contact" },
  ];

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, minHeight: "100vh", overflowX: "clip" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap');

        html { scroll-behavior: smooth; }

        .i322-navlink {
          position: relative;
          color: ${C.textMuted};
          text-decoration: none;
          font-family: ${SANS};
          font-size: 12.5px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 12px 2px;
          transition: color 0.45s cubic-bezier(0.16,1,0.3,1);
        }
        .i322-navlink::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 6px;
          height: 1px;
          width: 0%;
          background: ${C.accent};
          transition: width 0.45s cubic-bezier(0.16,1,0.3,1);
        }
        .i322-navlink:hover { color: ${C.ink}; }
        .i322-navlink:hover::after { width: 100%; }

        /* Marquee des références — s'arrête si le visiteur préfère l'immobile. */
        .i322-marquee { overflow: hidden; position: relative; }
        .i322-marquee-track {
          display: flex;
          width: max-content;
          animation: i322scroll 30s linear infinite;
        }
        .i322-marquee-track > span { margin-right: clamp(44px, 7vw, 110px); }
        @keyframes i322scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .i322-marquee:hover .i322-marquee-track { animation-play-state: paused; }

        .i322-about { display: grid; grid-template-columns: minmax(0,0.9fr) minmax(0,1.1fr); gap: clamp(34px, 5.6vw, 88px); align-items: center; }
        .i322-why { display: grid; grid-template-columns: minmax(0,1.1fr) minmax(0,0.9fr); gap: clamp(34px, 5.6vw, 88px); align-items: center; }
        .i322-contact { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(34px, 5.6vw, 80px); }

        .i322-mosaic {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          grid-auto-rows: clamp(120px, 15vw, 215px);
          gap: clamp(8px, 1.1vw, 12px);
        }
        .i322-mosaic > :nth-child(1) { grid-column: span 2; grid-row: span 2; }
        .i322-mosaic > :nth-child(6) { grid-column: 1 / -1; }

        @media (max-width: 900px) {
          #i322-nav { display: none !important; }
          .i322-burger { display: flex !important; }
        }
        @media (max-width: 860px) {
          .i322-about, .i322-why, .i322-contact { grid-template-columns: 1fr; }
          .i322-about > *, .i322-why > * { order: initial; }
          .i322-mosaic { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .i322-mosaic > :nth-child(1) { grid-column: span 2; grid-row: span 1; }
          .i322-mosaic > :nth-child(6) { grid-column: span 2; }
          .i322-servicerow { grid-template-columns: clamp(40px, 10vw, 60px) minmax(0,1fr) !important; }
          .i322-servicerow > :last-child { display: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .i322-marquee-track { animation: none; width: auto; flex-wrap: wrap; justify-content: center; row-gap: 18px; }
          html { scroll-behavior: auto; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: scrolled ? "14px clamp(20px, 4.4vw, 56px)" : "24px clamp(20px, 4.4vw, 56px)",
          background: scrolled ? "rgba(13,10,7,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          transition: "padding 0.5s cubic-bezier(0.16,1,0.3,1), background 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {fd?.logoBase64 ? (
          <img src={fd.logoBase64} alt={businessName} style={{ height: 32, maxWidth: 160, objectFit: "contain", display: "block" }} />
        ) : (
          <span style={{ fontFamily: SERIF, fontSize: "clamp(20px, 2.2vw, 25px)", fontWeight: 600, letterSpacing: "0.02em", color: C.ink, whiteSpace: "nowrap" }}>
            {businessName}
          </span>
        )}
        <nav id="i322-nav" style={{ display: "flex", gap: "clamp(16px, 2.6vw, 36px)", alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} className="i322-navlink">{l}</a>
          ))}
          <a
            href="#contact"
            style={{ border: `1px solid ${C.accent}`, color: C.accentDark, borderRadius: 0, padding: "13px 24px", fontSize: 12, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", textDecoration: "none", whiteSpace: "nowrap" }}
          >
            Consultation privée
          </a>
        </nav>
        <button
          className="i322-burger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          style={{ display: "none", background: "none", border: "none", color: C.ink, cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" }}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ position: "fixed", inset: 0, zIndex: 99, background: "rgba(13,10,7,0.97)", backdropFilter: "blur(16px)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 26 }}
          >
            {NAV.map(({ l, h }) => (
              <a key={l} href={h} onClick={() => setMenuOpen(false)} style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 500, color: C.ink, textDecoration: "none", letterSpacing: "0.06em" }}>
                {l}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HÉROS — plein cadre, portail en arche, titre bas ────────────── */}
      <section id="hero" style={{ position: "relative", minHeight: "100dvh", display: "flex", alignItems: "flex-end", background: C.bgDark, overflow: "hidden" }}>
        {/* Fond de repli soigné : arche filaire + lueur, la page tient sans photo. */}
        <div aria-hidden style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 20%, ${C.glow} 0%, transparent 60%), ${C.bgDark}` }} />
        <div aria-hidden style={{ position: "absolute", left: "50%", bottom: "-6%", transform: "translateX(-50%)", width: "min(46vw, 420px)", height: "min(64vh, 560px)", border: `1px solid ${C.border}`, borderBottom: "none", borderRadius: "50% 50% 0 0 / 36% 36% 0 0", pointerEvents: "none" }} />

        <PortalZoom images={HERO_IMAGES} index={i} portal={ARCHE} overlay={0.38} className="">
          {/* Scrim à trois arrêts pour asseoir le titre en bas du cadre. */}
          <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(13,10,7,0.55) 0%, rgba(13,10,7,0.12) 40%, rgba(13,10,7,0.62) 74%, rgba(13,10,7,0.96) 100%)" }} />
        </PortalZoom>

        <div style={{ position: "relative", zIndex: 3, width: "100%", maxWidth: 1240, margin: "0 auto", padding: "clamp(130px, 18vh, 190px) clamp(20px, 4.4vw, 56px) clamp(36px, 6.5vh, 66px)" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: EASE }}>
            <Kicker>{clientEyebrow(sessionData) ?? clientTrade(sessionData) ?? "Agence Événementielle Premium"}</Kicker>
            <h1 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "clamp(34px, 6.8vw, 92px)", lineHeight: 0.98, letterSpacing: "-0.012em", margin: "0 0 clamp(16px, 2.6vh, 26px)", color: C.ink, maxWidth: 900 }}>
              {L1 ? (
                <>
                  {L1}
                  {L2 ? (
                    <>
                      <br />
                      <em style={{ fontStyle: "italic", color: C.accentDark }}>{L2}</em>
                    </>
                  ) : null}
                </>
              ) : (
                <>
                  Créateurs d'Événements
                  <br />
                  <em style={{ fontStyle: "italic", color: C.accentDark }}>d'Exception</em>
                </>
              )}
            </h1>
            <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: "clamp(15px, 1.8vw, 17.5px)", lineHeight: 1.78, color: C.textMuted, maxWidth: 500, margin: "0 0 clamp(22px, 3.6vh, 38px)" }}>
              {clientHeroSubtitle(sessionData) ?? fd?.description ?? "Nous concevons et orchestrons des moments rares pour les entreprises les plus exigeantes. L'excellence dans chaque détail."}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", marginBottom: "clamp(26px, 4.2vh, 46px)" }}>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.45, ease: EASE }}
                style={{ background: C.accent, color: C.bgDark, padding: "16px 34px", fontWeight: 600, fontSize: 12.5, letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}
              >
                Nous contacter <ArrowRight size={15} />
              </motion.a>
              <motion.a
                href="#portfolio"
                whileHover={{ borderColor: C.accent, color: C.ink }}
                transition={{ duration: 0.45, ease: EASE }}
                style={{ background: "transparent", color: C.textMuted, border: `1px solid ${C.border}`, padding: "15px 30px", fontWeight: 500, fontSize: 12.5, letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none" }}
              >
                Nos réalisations
              </motion.a>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "clamp(14px, 2.4vw, 26px)", borderTop: `1px solid ${C.border}`, paddingTop: "clamp(14px, 2.2vh, 22px)" }}>
              <SlideIndex i={i} total={HERO_IMAGES.length} variant="fraction" color={C.textMuted} className="" />
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={`cap-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(16px, 1.9vw, 19px)", color: C.ink, display: "block" }}
                >
                  {HERO_LABELS[i % HERO_LABELS.length]}
                </motion.span>
              </AnimatePresence>
              <HairlineArrows onPrev={prev} onNext={next} color={C.textMuted} className="" labels={{ prev: "Scène précédente", next: "Scène suivante" }} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── RESPIRATION ─────────────────────────────────────────────────── */}
      <section style={{ background: C.bg, padding: "clamp(60px, 9.5vw, 120px) clamp(20px, 4.4vw, 56px)", position: "relative", overflow: "hidden" }}>
        <span aria-hidden style={{ position: "absolute", left: "clamp(4px, 3vw, 48px)", top: "-12%", fontFamily: SERIF, fontSize: "clamp(160px, 26vw, 360px)", lineHeight: 1, color: C.ink, opacity: 0.04, pointerEvents: "none", userSelect: "none" }}>
          «
        </span>
        <Reveal>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: "clamp(22px, 3.2vw, 34px)", lineHeight: 1.48, color: C.textMuted, textAlign: "center", maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 2 }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.texte") ?? (
              <>Nous ne faisons pas qu'organiser un événement, nous créons <span style={{ color: C.accentDark }}>un moment suspendu dans le temps</span>.</>
            )}
          </p>
        </Reveal>
      </section>

      {/* ── RÉFÉRENCES — marquee ────────────────────────────────────────── */}
      <section style={{ background: C.bgDark, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "clamp(34px, 5vw, 54px) 0" }}>
        <p style={{ textAlign: "center", textTransform: "uppercase", fontSize: 10, letterSpacing: "0.34em", color: C.textFaint, margin: "0 0 clamp(22px, 3.2vw, 34px)" }}>
          Ils nous font confiance
        </p>
        <div className="i322-marquee">
          <div className="i322-marquee-track" style={{ opacity: 0.5 }}>
            {/* LISTE_LIBELLES */ [...(clientList(sessionData, "bloc.liste1") ?? MARQUES_SOURCE), ...(clientList(sessionData, "bloc.liste1") ?? MARQUES_SOURCE)].map((brand: string, n: number) => (
              <span key={n} style={{ fontFamily: SERIF, fontSize: "clamp(20px, 2.6vw, 28px)", fontWeight: 600, letterSpacing: "0.08em", color: C.ink, whiteSpace: "nowrap" }}>
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── L'AGENCE ────────────────────────────────────────────────────── */}
      <section id="about" style={{ background: C.bg, padding: "clamp(72px, 10.5vw, 140px) clamp(20px, 4.4vw, 56px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: "24%", right: "-14%", width: "42vw", height: "42vw", borderRadius: "50%", background: `radial-gradient(circle, ${C.glow} 0%, transparent 68%)`, filter: "blur(58px)", pointerEvents: "none" }} />
        <div className="i322-about" style={{ maxWidth: 1240, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <div style={{ position: "relative", paddingBottom: "clamp(46px, 7vw, 84px)", paddingRight: "clamp(24px, 4vw, 60px)" }}>
              {/* La photo principale sous une arche — l'écho du portail. */}
              <div style={{ overflow: "hidden", borderRadius: "50% 50% 0 0 / 22% 22% 0 0", border: `1px solid ${C.border}`, background: C.bgDarkAlt, aspectRatio: "4/5" }}>
                <img src={photo(1, PHOTO_FALLBACKS[1])} alt="L'agence à l'œuvre" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ position: "absolute", right: 0, bottom: 0, width: "56%", aspectRatio: "1", border: `1px solid ${C.border}`, background: C.bg, padding: "clamp(6px, 1vw, 10px)", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
                <img src={photo(6, PHOTO_FALLBACKS[6])} alt="Détail de scénographie" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            </div>
          </Reveal>
          <div>
            <Reveal>
              <Kicker>Notre Signature</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "clamp(30px, 4.2vw, 54px)", lineHeight: 1.05, letterSpacing: "-0.01em", margin: "0 0 clamp(18px, 2.8vw, 30px)", color: C.ink }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "about.titre") ?? (
                  <>
                    L'Exigence au service
                    <br />
                    de l'<em style={{ fontStyle: "italic", color: C.accentDark }}>Émotion</em>.
                  </>
                )}
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p style={{ fontSize: "clamp(15px, 1.7vw, 17px)", fontWeight: 300, color: C.textMuted, lineHeight: 1.8, maxWidth: 500, margin: "0 0 18px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "about.texte") ?? (
                  <>Depuis plus de 10 ans, notre agence conçoit des événements exclusifs pour les marques prestigieuses et les entreprises ambitieuses. Nous ne faisons pas qu'organiser un événement, nous créons un moment suspendu dans le temps.</>
                )}
              </p>
              <p style={{ fontSize: "clamp(15px, 1.7vw, 17px)", fontWeight: 300, color: C.textMuted, lineHeight: 1.8, maxWidth: 500, margin: "0 0 clamp(26px, 3.8vw, 42px)" }}>
                Notre approche sur mesure garantit une exécution sans faille, où la créativité rencontre la rigueur. Chaque détail est pensé, chaque instant est chorégraphié.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(28px, 4.4vw, 60px)", borderTop: `1px solid ${C.border}`, paddingTop: "clamp(20px, 3vw, 32px)" }}>
                {STATS.slice(0, 2).map((s: any, n: number) => (
                  <div key={n}>
                    <div style={{ fontFamily: SERIF, fontSize: "clamp(34px, 4.4vw, 54px)", fontWeight: 600, color: C.accentDark, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: C.textFaint, marginTop: 9 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── EXPERTISES — rangées éditoriales numérotées ─────────────────── */}
      <section id="services" style={{ background: C.bgAlt, padding: "clamp(72px, 10.5vw, 140px) clamp(20px, 4.4vw, 56px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 20, marginBottom: "clamp(34px, 5vw, 60px)" }}>
              <div>
                <Kicker>Nos Expertises</Kicker>
                <h2 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "clamp(30px, 4.2vw, 54px)", lineHeight: 1.05, margin: 0, color: C.ink }}>
                  {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                    <>Savoir-Faire <em style={{ fontStyle: "italic", color: C.accentDark }}>Événementiel</em></>
                  )}
                </h2>
              </div>
              <p style={{ maxWidth: 380, fontWeight: 300, fontSize: 15, color: C.textMuted, lineHeight: 1.75, margin: 0 }}>
                Des solutions complètes pour répondre aux plus hautes exigences de nos clients corporatifs.
              </p>
            </div>
          </Reveal>
          <div style={{ borderBottom: `1px solid ${C.border}` }}>
            {SERVICES.map((sv: any, n: number) => (
              <Reveal key={n} delay={n * 0.07}>
                <ServiceRow322 sv={sv} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── RÉALISATIONS — galerie mosaïque ─────────────────────────────── */}
      <section id="portfolio" style={{ background: C.bg, padding: "clamp(72px, 10.5vw, 140px) clamp(20px, 4.4vw, 56px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "clamp(34px, 5vw, 60px)" }}>
              <Kicker center>Portfolio</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "clamp(30px, 4.2vw, 54px)", lineHeight: 1.05, margin: 0, color: C.ink }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "portfolio.titre") ?? (
                  <>Nos Dernières <em style={{ fontStyle: "italic", color: C.accentDark }}>Réalisations</em></>
                )}
              </h2>
            </div>
          </Reveal>
          <div className="i322-mosaic">
            {[5, 6, 7, 8, 9, 10].map((idx, n) => (
              <Reveal key={idx} delay={n * 0.06}>
                <div className="i322-tile" style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: `radial-gradient(circle at 45% 30%, ${C.glow}, transparent 70%), ${C.bgDarkAlt}`, border: `1px solid ${C.border}`, minHeight: "100%" }}>
                  <img
                    src={photo(idx, PHOTO_FALLBACKS[idx])}
                    alt={GALERIE_LEGENDES[n].t}
                    loading="lazy"
                    className="i322-tileimg"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)" }}
                  />
                  <div className="i322-tilecap" style={{ position: "absolute", inset: 0, background: "rgba(13,10,7,0.68)", opacity: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: 18, transition: "opacity 0.55s cubic-bezier(0.16,1,0.3,1)" }}>
                    <span style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.26em", color: C.accentDark, marginBottom: 8 }}>{GALERIE_LEGENDES[n].cat}</span>
                    <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(17px, 2vw, 22px)", color: C.ink }}>{GALERIE_LEGENDES[n].t}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <style>{`
            .i322-tile:hover .i322-tileimg { transform: scale(1.06); }
            .i322-tile:hover .i322-tilecap { opacity: 1; }
          `}</style>
        </div>
      </section>

      {/* ── L'ART DE L'EXCELLENCE ───────────────────────────────────────── */}
      <section style={{ background: C.bgDarkAlt, padding: "clamp(72px, 10.5vw, 140px) clamp(20px, 4.4vw, 56px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: "-16%", right: "-8%", width: "44vw", height: "44vw", borderRadius: "50%", background: `radial-gradient(circle, ${C.glow} 0%, transparent 66%)`, filter: "blur(70px)", pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", bottom: "-20%", left: "-10%", width: "40vw", height: "40vw", borderRadius: "50%", background: `radial-gradient(circle, rgba(197,168,128,0.07) 0%, transparent 66%)`, filter: "blur(70px)", pointerEvents: "none" }} />
        <div className="i322-why" style={{ maxWidth: 1240, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div>
            <Reveal>
              <Kicker>Pourquoi Nous</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "clamp(30px, 4.2vw, 54px)", lineHeight: 1.05, margin: "0 0 clamp(16px, 2.4vw, 24px)", color: C.ink }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "section-6.titre") ?? (
                  <>L'Art de <em style={{ fontStyle: "italic", color: C.accentDark }}>l'Excellence</em></>
                )}
              </h2>
              <p style={{ fontSize: "clamp(15px, 1.7vw, 17px)", fontWeight: 300, color: C.textMuted, lineHeight: 1.8, maxWidth: 480, margin: "0 0 clamp(28px, 4vw, 48px)" }}>
                Nous ne laissons rien au hasard. Chaque étape de la conception à la réalisation est gérée avec une précision chirurgicale et une vision esthétique sans compromis.
              </p>
            </Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(20px, 3vw, 32px)" }}>
              {ENGAGEMENTS.map((item: any, n: number) => (
                <Reveal key={n} delay={n * 0.09}>
                  <div style={{ display: "flex", gap: 18 }}>
                    <span aria-hidden style={{ flexShrink: 0, width: 34, height: 34, borderRadius: "50%", border: `1px solid ${C.accent}`, color: C.accentDark, display: "grid", placeItems: "center", marginTop: 2 }}>
                      <Check size={14} />
                    </span>
                    <div>
                      <h4 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "clamp(18px, 2.1vw, 22px)", color: C.ink, margin: "0 0 6px" }}>{item.t}</h4>
                      {item.d ? <p style={{ fontWeight: 300, fontSize: 14.5, color: C.textMuted, lineHeight: 1.7, margin: 0, maxWidth: 440 }}>{item.d}</p> : null}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={0.15}>
            <div style={{ position: "relative", padding: "clamp(14px, 2vw, 24px)" }}>
              <div aria-hidden style={{ position: "absolute", inset: 0, border: `1px solid ${C.border}`, borderRadius: "50% 50% 0 0 / 18% 18% 0 0", pointerEvents: "none" }} />
              <div style={{ overflow: "hidden", borderRadius: "50% 50% 0 0 / 20% 20% 0 0", aspectRatio: "4/5", background: C.bgDark }}>
                <img src={photo(2, PHOTO_FALLBACKS[2])} alt="Soirée de gala orchestrée par l'agence" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TÉMOIGNAGES — pleine lumière, un à la fois ──────────────────── */}
      <section style={{ background: C.bg, padding: "clamp(72px, 10.5vw, 140px) clamp(20px, 4.4vw, 56px)", position: "relative", overflow: "hidden" }}>
        <span aria-hidden style={{ position: "absolute", right: "clamp(4px, 3vw, 48px)", bottom: "-16%", fontFamily: SERIF, fontSize: "clamp(180px, 28vw, 400px)", lineHeight: 1, color: C.ink, opacity: 0.035, pointerEvents: "none", userSelect: "none" }}>
          »
        </span>
        <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <Reveal>
            <Kicker center>Témoignages</Kicker>
            <h2 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "clamp(28px, 3.8vw, 48px)", lineHeight: 1.06, margin: "0 0 clamp(30px, 4.4vw, 54px)", color: C.ink }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "section-7.titre") ?? (
                <>Mots de nos <em style={{ fontStyle: "italic", color: C.accentDark }}>Clients</em></>
              )}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ minHeight: "clamp(210px, 26vw, 260px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.figure
                  key={ti}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  style={{ margin: 0 }}
                >
                  <div style={{ display: "flex", justifyContent: "center", gap: 5, marginBottom: "clamp(16px, 2.4vw, 24px)" }}>
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={14} fill="currentColor" color={C.accentDark} style={{ color: C.accentDark }} />
                    ))}
                  </div>
                  <blockquote style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: "clamp(20px, 2.8vw, 30px)", lineHeight: 1.5, color: C.ink, margin: "0 0 clamp(20px, 3vw, 30px)" }}>
                    « {T?.content} »
                  </blockquote>
                  <figcaption>
                    <div style={{ fontFamily: SERIF, fontSize: "clamp(17px, 2vw, 21px)", fontWeight: 600, color: C.ink }}>{T?.name}</div>
                    <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.22em", color: C.accentDark, marginTop: 7 }}>{T?.role}</div>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 22, marginTop: "clamp(18px, 2.6vw, 28px)" }}>
              <SlideIndex i={ti} total={TEMOIGNAGES.length} variant="fraction" color={C.textFaint} className="" />
              <HairlineArrows onPrev={tPrev} onNext={tNext} color={C.textMuted} className="" labels={{ prev: "Témoignage précédent", next: "Témoignage suivant" }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section id="contact" style={{ background: C.bgDark, borderTop: `1px solid ${C.border}`, padding: "clamp(72px, 10.5vw, 140px) clamp(20px, 4.4vw, 56px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 82% 10%, ${C.glow} 0%, transparent 55%)`, pointerEvents: "none" }} />
        <div className="i322-contact" style={{ maxWidth: 1140, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div>
            <Reveal>
              <Kicker>Contact</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "clamp(30px, 4.2vw, 54px)", lineHeight: 1.05, margin: "0 0 clamp(16px, 2.4vw, 26px)", color: C.ink }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                  <>
                    Planifions votre
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accentDark }}>Événement</em>
                  </>
                )}
              </h2>
              <p style={{ fontWeight: 300, fontSize: "clamp(15px, 1.7vw, 16.5px)", color: C.textMuted, lineHeight: 1.8, maxWidth: 460, margin: "0 0 clamp(28px, 4vw, 46px)" }}>
                Confiez-nous vos envies, nous en ferons une réalité. Notre équipe est à votre disposition pour une première consultation confidentielle.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <a href={`tel:${phone.replace(/\s/g, "")}`} style={{ display: "flex", alignItems: "center", gap: 14, color: C.ink, textDecoration: "none", fontWeight: 300, fontSize: 16, padding: "4px 0" }}>
                  <Phone size={18} color={C.accentDark} /> {phone}
                </a>
                <a href={`mailto:${mail}`} style={{ display: "flex", alignItems: "center", gap: 14, color: C.ink, textDecoration: "none", fontWeight: 300, fontSize: 16, padding: "4px 0" }}>
                  <Mail size={18} color={C.accentDark} /> {mail}
                </a>
                <span style={{ display: "flex", alignItems: "center", gap: 14, color: C.ink, fontWeight: 300, fontSize: 16 }}>
                  <MapPin size={18} color={C.accentDark} /> {adresse}
                </span>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <form onSubmit={(e) => e.preventDefault()} style={{ border: `1px solid ${C.border}`, background: "rgba(20,16,12,0.7)", backdropFilter: "blur(6px)", padding: "clamp(24px, 3.6vw, 46px)", display: "flex", flexDirection: "column", gap: 22 }}>
              <div>
                <label style={{ display: "block", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.26em", color: C.textFaint, marginBottom: 9 }}>Nom complet</label>
                <input
                  type="text"
                  placeholder="Jean Dupont"
                  style={{ width: "100%", minHeight: 44, boxSizing: "border-box", background: "transparent", border: "none", borderBottom: `1px solid ${C.border}`, padding: "10px 0", color: C.ink, fontFamily: SANS, fontSize: 15, outline: "none", borderRadius: 0 }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.26em", color: C.textFaint, marginBottom: 9 }}>Entreprise</label>
                <input
                  type="text"
                  placeholder="Votre Société"
                  style={{ width: "100%", minHeight: 44, boxSizing: "border-box", background: "transparent", border: "none", borderBottom: `1px solid ${C.border}`, padding: "10px 0", color: C.ink, fontFamily: SANS, fontSize: 15, outline: "none", borderRadius: 0 }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.26em", color: C.textFaint, marginBottom: 9 }}>Email professionnel</label>
                <input
                  type="email"
                  placeholder="jean@societe.com"
                  style={{ width: "100%", minHeight: 44, boxSizing: "border-box", background: "transparent", border: "none", borderBottom: `1px solid ${C.border}`, padding: "10px 0", color: C.ink, fontFamily: SANS, fontSize: 15, outline: "none", borderRadius: 0 }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.26em", color: C.textFaint, marginBottom: 9 }}>Type d'événement</label>
                <select style={{ width: "100%", minHeight: 44, boxSizing: "border-box", background: "transparent", border: "none", borderBottom: `1px solid ${C.border}`, padding: "10px 0", color: C.textMuted, fontFamily: SANS, fontSize: 15, outline: "none", appearance: "none", borderRadius: 0, cursor: "pointer" }}>
                  <option style={{ background: C.bg, color: C.ink }}>Gala / Soirée</option>
                  <option style={{ background: C.bg, color: C.ink }}>Lancement de produit</option>
                  <option style={{ background: C.bg, color: C.ink }}>Séminaire / Congrès</option>
                  <option style={{ background: C.bg, color: C.ink }}>Autre</option>
                </select>
              </div>
              <button
                type="submit"
                style={{ marginTop: 8, minHeight: 50, background: C.accent, color: C.bgDark, border: "none", fontFamily: SANS, fontSize: 12.5, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10 }}
              >
                Envoyer la demande <ArrowRight size={15} />
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer style={{ background: C.bgDark, borderTop: `1px solid ${C.border}`, padding: "clamp(48px, 7vw, 84px) clamp(20px, 4.4vw, 56px) clamp(22px, 3vw, 38px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(230px, 100%), 1fr))", gap: "clamp(30px, 4.4vw, 56px)", marginBottom: "clamp(34px, 4.8vw, 60px)" }}>
          <div>
            {fd?.logoBase64 ? (
              <img src={fd.logoBase64} alt={businessName} style={{ height: 32, maxWidth: 160, objectFit: "contain", display: "block", marginBottom: 18 }} />
            ) : (
              <span style={{ fontFamily: SERIF, fontSize: "clamp(22px, 2.6vw, 28px)", fontWeight: 600, color: C.ink, display: "block", marginBottom: 16 }}>
                {businessName}
              </span>
            )}
            <p style={{ maxWidth: 320, fontWeight: 300, fontSize: 14, color: C.textMuted, lineHeight: 1.75, margin: 0 }}>
              {clientTagline(sessionData) ?? "Créateurs d'événements d'exception pour entreprises prestigieuses. L'art de recevoir à la française."}
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.26em", color: C.accentDark, margin: "0 0 20px" }}>Navigation</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {NAV.map(({ l, h }) => (
                <li key={l}>
                  <a href={h} style={{ color: C.textMuted, textDecoration: "none", fontWeight: 300, fontSize: 14.5, padding: "4px 0", display: "inline-block" }}>{l}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.26em", color: C.accentDark, margin: "0 0 20px" }}>Légal</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              <li><a href="#" style={{ color: C.textMuted, textDecoration: "none", fontWeight: 300, fontSize: 14.5, padding: "4px 0", display: "inline-block" }}>Mentions Légales</a></li>
              <li><a href="#" style={{ color: C.textMuted, textDecoration: "none", fontWeight: 300, fontSize: 14.5, padding: "4px 0", display: "inline-block" }}>Politique de confidentialité</a></li>
              <li><a href="#" style={{ color: C.textMuted, textDecoration: "none", fontWeight: 300, fontSize: 14.5, padding: "4px 0", display: "inline-block" }}>CGV</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.26em", color: C.accentDark, margin: "0 0 20px" }}>Contact</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, color: C.textMuted, fontWeight: 300, fontSize: 14.5 }}>
              <a href={`tel:${phone.replace(/\s/g, "")}`} style={{ display: "flex", alignItems: "center", gap: 10, color: C.textMuted, textDecoration: "none", padding: "4px 0" }}>
                <Phone size={14} color={C.accentDark} /> {phone}
              </a>
              <a href={`mailto:${mail}`} style={{ display: "flex", alignItems: "center", gap: 10, color: C.textMuted, textDecoration: "none", padding: "4px 0" }}>
                <Mail size={14} color={C.accentDark} /> {mail}
              </a>
              <span style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <MapPin size={14} color={C.accentDark} style={{ marginTop: 3, flexShrink: 0 }} /> {adresse}
              </span>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1240, margin: "0 auto", borderTop: `1px solid ${C.border}`, paddingTop: "clamp(16px, 2.2vw, 26px)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ color: C.textFaint, fontSize: 12.5, fontWeight: 300 }}>
            © {new Date().getFullYear()} {businessName}
            {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
          </span>
          <span style={{ color: C.textFaint, fontSize: 12.5, fontWeight: 300 }}>Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
        </div>
      </footer>
    </div>
  );
}
