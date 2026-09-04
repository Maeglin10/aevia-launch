"use client";
// @ts-nocheck

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Mail, Phone, Star, Check } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "../LegalIdentity";
import { DWELL, HairlineArrows, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
import { CrossPush } from "@/lib/templates/hero-kit-3";
import {
  clientAddress,
  clientCertifications,
  clientCity,
  clientCodePostalVille,
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
  clientText,
  clientTrade,
  clientWorks,
} from "@/lib/templates/clientContent";

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
let fd: any = null;
let c: any = null;
let bp: any = null;
let sessionData: any = null;

/* ════════════════════════════════════════════════════════════════════════════
   IMPACT-324 · {clientName(sessionData) ?? "LiveTicket"} — billetterie live (concerts, salles en propre)
   Réécriture premium — geste signature : CrossPush (les affiches se croisent).
   Héros H3 plein cadre, titre en bas, fond de repli C.bgDark.
   Fontes P12 : Bricolage Grotesque (voix display) + Figtree (corps).
   Signature : affiches qui se croisent · tarifs en billets perforés CSS ·
   marquee de dates. Palette sombre #0b0f1a / #ec4899.
   ════════════════════════════════════════════════════════════════════════════ */

const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,600;12..96,800&family=Figtree:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');`;

let C: Record<string, string> = {
  bg: "#0b0f1a",
  bgAlt: "#0e1424",
  bgDark: "#060a14",
  bgDarkAlt: "#03060d",
  bgCard: "#121a2e",
  accent: "var(--brand,#ec4899)",
  accentDark: "var(--brand-light,#f9a8d4)",
  accentLight: "rgba(236,72,153,0.13)",
  ink: "#f5f6fb",
  textMuted: "#9aa3ba",
  textFaint: "#5d6579",
  border: "rgba(255,255,255,0.09)",
  white: "#ffffff",
  neon: "#38bdf8", // clé métier : lumière de scène
};

const DISPLAY = "'Bricolage Grotesque', system-ui, sans-serif";
const SANS = "'Figtree', system-ui, sans-serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Photos — URLs existantes du thème, jamais d'URL inventée ────────────── */
const FALLBACK_PHOTOS = [
  "https://images.pexels.com/photos/17527817/pexels-photo-17527817.jpeg?auto=compress&cs=tinysrgb&w=2000", // 0 affiche hero A
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", // 1 coulisses VIP
  "https://images.pexels.com/photos/27151463/pexels-photo-27151463.jpeg?auto=compress&cs=tinysrgb&w=800", // 2 affiche hero B
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // 3 affiche hero C
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // 4 vignette date 1
  "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // 5 vignette date 2
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // 6 vignette date 3
  "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // 7 vignette date 4
];

function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ── Données de démonstration (contenu rédactionnel conservé) ────────────── */

const EVENTS_SOURCE = [
  { id: "e1", title: "Tournée Néon de minuit", artist: "Syntax Error", d: "15", m: "août", time: "21:00", venue: "Grande Halle, Paris", price: "45 €", category: "Électro", pi: 4 },
  { id: "e2", title: "Acoustic Sessions", artist: "Elena Rossi", d: "20", m: "août", time: "19:30", venue: "Intimate Hall, Lyon", price: "35 €", category: "Acoustic", pi: 5 },
  { id: "e3", title: "Summer Vibes Festival", artist: "Various Artists", d: "05", m: "sept.", time: "14:00", venue: "Open Air Park, Marseille", price: "89 €", category: "Festival", pi: 6 },
  { id: "e4", title: "Symphonie de la nuit", artist: "Orchestre de Paris", d: "12", m: "sept.", time: "20:00", venue: "Philharmonie, Paris", price: "60 €", category: "Classique", pi: 7 },
  { id: "e5", title: "Nuit rock", artist: "Les Foudres", d: "25", m: "sept.", time: "20:30", venue: "Zénith, Lille", price: "50 €", category: "Rock", pi: 4 },
  { id: "e6", title: "Jazz & Wine Night", artist: "Blue Note Quartet", d: "02", m: "oct.", time: "20:00", venue: "Jazz Club, Bordeaux", price: "40 €", category: "Jazz", pi: 5 },
];

function EVENTS_LIVE() {
  const ville = clientCity(sessionData);
  const base = EVENTS_SOURCE.map((e) => ({
    ...e,
    venue: ville ? e.venue.replace(/Paris|Lille/, ville) : e.venue,
    artist: ville ? e.artist.replace(/Paris|Lille/, ville) : e.artist,
  }));
  return /* RÉALISATIONS */ resolveList(
    clientWorks(sessionData)?.map((o: any, i: number) => ({
      ...base[i % base.length],
      title: o.title ?? base[i % base.length].title,
      artist: o.detail || base[i % base.length].artist,
      ...(o.imageUrl ? { img: o.imageUrl } : {}),
    })),
    base,
  );
}
let EVENTS = EVENTS_LIVE();

const TICKETS_SOURCE = [
  {
    k: "Standard",
    p: "35 – 89 €",
    n: "Le prix imprimé sur l'annonce est celui payé au guichet, le soir même, pour la dernière place comme pour la première.",
    perks: ["Toutes les soirées du calendrier", "Espèces et carte, sans frais de réservation au guichet", "Place accompagnant offerte — accès de plain-pied à tous les niveaux"],
    featured: false,
  },
  {
    k: "VIP",
    p: "× 2",
    n: "Le concert autrement : placement privilégié, coulisses, boisson et rencontre avec les artistes.",
    perks: ["Entrée anticipée et accès VIP réservé", "Premier rang ou balcon", "Coffret collector", "Salon VIP et bar privé"],
    featured: true,
  },
  {
    k: "Group 10+",
    p: "Sur devis",
    n: "Devis écrit sous un jour ouvré, places tenues sept jours.",
    perks: ["Places tenues sept jours", "Une seule adresse, lue par quelqu'un", "Devis sous un jour ouvré"],
    featured: false,
  },
];

function TICKETS_LIVE() {
  return resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...TICKETS_SOURCE[i % TICKETS_SOURCE.length],
      k: s.title ?? TICKETS_SOURCE[i % TICKETS_SOURCE.length].k,
      p: s.price ?? TICKETS_SOURCE[i % TICKETS_SOURCE.length].p,
      n: s.description ?? s.desc ?? TICKETS_SOURCE[i % TICKETS_SOURCE.length].n,
    })),
    TICKETS_SOURCE,
  );
}
let TICKETS = TICKETS_LIVE();

const ENGAGE_SOURCE = [
  "Aucun prix qui varie — le prix annoncé est le prix payé",
  "Artistes payés le soir même, en loge, premières parties comprises",
  "Quatre salles que nous exploitons — en propre ou en bail long, jamais sous-traitées",
  "Démos bienvenues : nous répondons à toutes, tôt ou tard",
];

function ENGAGE_LIVE() {
  return resolveList(clientCertifications(sessionData), ENGAGE_SOURCE);
}
let ENGAGE = ENGAGE_LIVE();

const STATS_SOURCE = [
  { v: "500K+", l: "Billets vendus" },
  { v: "4.9/5", l: "Note des spectateurs" },
  { v: "120+", l: "Soirées par an" },
  { v: "100%", l: "Réservation sécurisée" },
];

function STATS_LIVE() {
  return resolveList(
    clientStats(sessionData)?.map((s: any) => ({ v: s.value, l: s.label })),
    STATS_SOURCE,
  );
}
let STATS = STATS_LIVE();

const AVIS_SOURCE = [
  { name: "Sophie Martin", role: "Habituée des festivals", text: "La billetterie la plus simple que j'aie connue. Rapide, sûre, et mon pass VIP sans la moindre difficulté." },
  { name: "Lucas Dubois", role: "Mélomane", text: "Le choix des places est d'une fluidité rare, et l'accueil au téléphone à la hauteur." },
  { name: "Emma Leroy", role: "Abonnée", text: "Je vais à plus de vingt concerts par an, et c'est de loin la billetterie que je préfère. Je n'ai jamais raté une mise en vente depuis." },
];

function AVIS_LIVE() {
  return resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      ...AVIS_SOURCE[i % AVIS_SOURCE.length],
      name: r.author ?? r.name ?? AVIS_SOURCE[i % AVIS_SOURCE.length].name,
      role: r.location ?? r.role ?? AVIS_SOURCE[i % AVIS_SOURCE.length].role,
      text: r.text ?? AVIS_SOURCE[i % AVIS_SOURCE.length].text,
    })),
    AVIS_SOURCE,
  );
}
let AVIS = AVIS_LIVE();

const ABOUT_SOURCE = [
  { t: "Depuis 2011", d: "Une salle de deux cents places au-dessus d'un bar, à Lille. Les mêmes trois personnes programment encore chaque soirée." },
  { t: "Aucun prix qui varie", d: "Le prix imprimé sur l'annonce est celui payé au guichet, le soir même, pour la dernière place comme pour la première." },
  { t: "Artistes payés le soir même", d: "Règlement en loge, avant le démontage. Premières parties comprises, sans délai de trente jours." },
  { t: "Des salles que nous exploitons", d: "Quatre lieux, en propre ou en bail long. Rien n'est confié à un producteur que nous ne connaissons pas de longue date." },
];

function ABOUT_LIVE() {
  const ville = clientCity(sessionData);
  return ABOUT_SOURCE.map((a) => ({ ...a, d: ville ? a.d.replace("Lille", ville) : a.d }));
}
let ABOUT = ABOUT_LIVE();

const CONTACT_SOURCE = [
  { t: "Guichet", d: "Du mercredi au samedi, 14 h — 19 h, sur place. Espèces et carte, sans frais de réservation." },
  { t: "Groupes de dix et plus", d: "Devis écrit sous un jour ouvré, places tenues sept jours." },
  { t: "Accessibilité", d: "Accès de plain-pied à tous les niveaux, place accompagnant offerte. Dites-le à la réservation : nous confirmons les détails propres à la salle." },
  { t: "Presse et artistes", d: "Une seule adresse, lue par quelqu'un. Démos bienvenues : nous répondons à toutes, tôt ou tard." },
];

const NAV = [
  { l: "Dates", h: "#dates" },
  { l: "Billetterie", h: "#tickets" },
  { l: "VIP", h: "#vip" },
  { l: "La maison", h: "#about" },
  { l: "Contact", h: "#contact" },
];

/* ── Primitives ──────────────────────────────────────────────────────────── */

function Reveal({ children, delay = 0, y = 28 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.85, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

function Kicker({ children, color = C.accent }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
      <span aria-hidden style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.36em", textTransform: "uppercase", color, fontWeight: 600 }}>{children}</span>
    </div>
  );
}

function NavLink({ l, h }: { l: string; h: string }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={h}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ position: "relative", color: hov ? C.ink : C.textMuted, fontFamily: SANS, fontSize: 13.5, fontWeight: 500, letterSpacing: "0.05em", textDecoration: "none", padding: "12px 2px", transition: "color 0.45s cubic-bezier(.16,1,.3,1)" }}
    >
      {l}
      <span aria-hidden style={{ position: "absolute", left: 0, bottom: 6, height: 1.5, width: hov ? "100%" : "0%", background: C.accent, transition: "width 0.5s cubic-bezier(.16,1,.3,1)" }} />
    </a>
  );
}

/* Billet perforé : encoches rondes + ligne pointillée devant le talon. */
function TicketCard({ t, i }: { t: any; i: number }) {
  const [hov, setHov] = useState(false);
  return (
    <Reveal delay={i * 0.09}>
      <article
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        className="i324-ticket"
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) 118px",
          background: t.featured ? `linear-gradient(150deg, ${C.bgCard}, rgba(236,72,153,0.10))` : C.bgCard,
          border: `1px solid ${hov ? C.accent : t.featured ? "rgba(236,72,153,0.35)" : C.border}`,
          borderRadius: 16,
          transform: hov ? "translateY(-7px)" : "none",
          boxShadow: hov
            ? `0 30px 60px -28px rgba(0,0,0,0.85), 0 8px 24px -12px ${"rgba(236,72,153,0.35)"}`
            : "0 14px 34px -24px rgba(0,0,0,0.7)",
          transition: "all 0.5s cubic-bezier(.16,1,.3,1)",
          height: "100%",
          minHeight: 300,
        }}
      >
        {/* Encoches de perforation */}
        <span aria-hidden style={{ position: "absolute", top: -10, right: 108, width: 20, height: 20, borderRadius: "50%", background: C.bg, border: `1px solid ${hov ? C.accent : C.border}`, borderTopColor: "transparent", transition: "border-color 0.5s cubic-bezier(.16,1,.3,1)" }} />
        <span aria-hidden style={{ position: "absolute", bottom: -10, right: 108, width: 20, height: 20, borderRadius: "50%", background: C.bg, border: `1px solid ${hov ? C.accent : C.border}`, borderBottomColor: "transparent", transition: "border-color 0.5s cubic-bezier(.16,1,.3,1)" }} />

        <div style={{ padding: "clamp(24px,3vw,34px) clamp(20px,2.6vw,30px)", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
            <h3 style={{ fontFamily: DISPLAY, fontSize: "clamp(21px,2.2vw,27px)", fontWeight: 800, color: C.ink, margin: 0, letterSpacing: "-0.01em", lineHeight: 1.05 }}>{t.k}</h3>
            {t.featured && (
              <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.accent, fontWeight: 600, whiteSpace: "nowrap" }}>Most wanted</span>
            )}
          </div>
          <p style={{ fontFamily: SANS, fontSize: 14, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>{t.n}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: "auto" }}>
            {(t.perks ?? []).map((p: string, j: number) => (
              <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <Check size={14} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                <span style={{ fontFamily: SANS, fontSize: 13, color: C.textMuted, lineHeight: 1.55 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Talon du billet */}
        <div style={{ borderLeft: `1.5px dashed rgba(255,255,255,0.22)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: "18px 8px" }}>
          <span aria-hidden style={{ fontFamily: SANS, fontSize: 9, letterSpacing: "0.34em", textTransform: "uppercase", color: C.textFaint, writingMode: "vertical-rl" }}>Admit one</span>
          <div style={{ fontFamily: DISPLAY, fontSize: "clamp(19px,1.8vw,23px)", fontWeight: 800, color: hov ? C.accent : C.ink, transition: "color 0.45s cubic-bezier(.16,1,.3,1)", textAlign: "center", lineHeight: 1.1 }}>{t.p}</div>
          {/* code-barres CSS — le détail gratuit */}
          <div aria-hidden style={{ width: 44, height: 26, background: `repeating-linear-gradient(90deg, ${C.textFaint} 0 2px, transparent 2px 4px, ${C.textFaint} 4px 5px, transparent 5px 8px)`, opacity: 0.55 }} />
        </div>
      </article>
    </Reveal>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function Impact324LiveTicket() {
  const [session, setSession] = useState<any>(null);

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
  EVENTS = EVENTS_LIVE();
  TICKETS = TICKETS_LIVE();
  ENGAGE = ENGAGE_LIVE();
  STATS = STATS_LIVE();
  AVIS = AVIS_LIVE();
  ABOUT = ABOUT_LIVE();

  const businessName = fd?.businessName ?? (clientName(sessionData) ?? "LiveTicket");
  const ville = clientCity(sessionData) ?? "Paris";
  const mail = clientEmail(sessionData) || "hello@liveticket.example";
  const phone = clientPhone(sessionData);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avisIdx, setAvisIdx] = useState(0);
  const [ctaHov, setCtaHov] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  /* Un seul index pilote tout le héros : affiches ET légende de scène. */
  const POSTERS = [photo(0, FALLBACK_PHOTOS[0]), photo(2, FALLBACK_PHOTOS[2]), photo(3, FALLBACK_PHOTOS[3])];
  const { i: heroIdx, next, prev } = useSlides(POSTERS.length, DWELL.normal);
  const heroEvent = EVENTS[heroIdx % EVENTS.length];

  const avis = AVIS[((avisIdx % AVIS.length) + AVIS.length) % AVIS.length];

  const heroLigne1 = clientHeroLine(sessionData, 0, 2, 16);
  const heroLigne2 = clientHeroLine(sessionData, 1, 2, 16);

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip" }}>
      <style>{`
        ${FONTS_CSS}
        @keyframes i324-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .i324-marquee-track { animation: i324-marquee 38s linear infinite; }
        .i324-marquee:hover .i324-marquee-track { animation-play-state: paused; }
        @keyframes i324-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
        .i324-livedot { animation: i324-pulse 1.6s cubic-bezier(.16,1,.3,1) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .i324-marquee-track { animation: none; }
          .i324-livedot { animation: none; }
        }
        @media (max-width: 900px) {
          .i324-navlinks { display: none !important; }
          .i324-burger { display: flex !important; }
        }
        @media (max-width: 860px) {
          .i324-split { grid-template-columns: 1fr !important; }
          .i324-split > * { order: initial !important; }
          .i324-eventrow { grid-template-columns: 64px minmax(0,1fr) !important; row-gap: 10px; }
          .i324-eventrow .i324-eventthumb { display: none !important; }
          .i324-eventrow .i324-eventcta { grid-column: 2; justify-self: start; }
          .i324-heropad { padding-left: 24px !important; padding-right: 24px !important; }
          .i324-contactgrid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .i324-ticket { grid-template-columns: minmax(0,1fr) 92px !important; }
          .i324-ticket > span[aria-hidden] { right: 82px !important; }
        }
      `}</style>

      {/* ── NAV — collante, 4 propriétés en transition ──────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: scrolled ? "10px clamp(20px,4.5vw,56px)" : "20px clamp(20px,4.5vw,56px)",
          background: scrolled ? "rgba(6,10,20,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          transition: "padding 0.55s cubic-bezier(.16,1,.3,1), background 0.55s cubic-bezier(.16,1,.3,1), border-color 0.55s cubic-bezier(.16,1,.3,1), backdrop-filter 0.55s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={businessName} style={{ height: 32, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <span className="i324-livedot" aria-hidden style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent, boxShadow: `0 0 12px ${"rgba(236,72,153,0.8)"}`, flexShrink: 0 }} />
              <span style={{ fontFamily: DISPLAY, fontSize: 19, fontWeight: 800, letterSpacing: "0.02em", color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{businessName}</span>
              <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: C.textFaint, marginLeft: 4, whiteSpace: "nowrap" }}>{clientTrade(sessionData) ?? "Live tickets"}</span>
            </>
          )}
        </a>
        <div className="i324-navlinks" style={{ display: "flex", alignItems: "center", gap: "clamp(16px,2.2vw,30px)" }}>
          {NAV.map((n) => (
            <NavLink key={n.l} {...n} />
          ))}
          <a
            href="#tickets"
            onMouseEnter={() => setCtaHov(true)}
            onMouseLeave={() => setCtaHov(false)}
            style={{
              fontFamily: SANS,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: ctaHov ? C.bgDark : C.ink,
              background: ctaHov ? C.accentDark : C.accent,
              padding: "12px 22px",
              borderRadius: 999,
              textDecoration: "none",
              transform: ctaHov ? "translateY(-2px)" : "none",
              boxShadow: ctaHov ? "0 12px 30px -10px rgba(236,72,153,0.6)" : "0 6px 18px -10px rgba(236,72,153,0.45)",
              transition: "all 0.5s cubic-bezier(.16,1,.3,1)",
            }}
          >
            Réserver
          </a>
        </div>
        <button
          className="i324-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "transform 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "opacity 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "transform 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 99, background: C.bgDark, borderBottom: `1px solid ${C.border}`, padding: "18px 26px 26px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map((n) => (
            <a key={n.l} href={n.h} onClick={() => setMobileOpen(false)} style={{ color: C.ink, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "13px 0" }}>
              {n.l}
            </a>
          ))}
          <a href="#tickets" onClick={() => setMobileOpen(false)} style={{ background: C.accent, color: C.bgDark, borderRadius: 999, padding: "14px 24px", fontSize: 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", textAlign: "center", marginTop: 12 }}>
            Réserver
          </a>
        </div>
      )}

      {/* ── HÉROS H3 plein cadre — les affiches se croisent (CrossPush) ──── */}
      <header style={{ position: "relative", minHeight: "100dvh", display: "flex", flexDirection: "column", justifyContent: "flex-end", background: C.bgDark, overflow: "hidden" }}>
        <CrossPush images={POSTERS} index={heroIdx} overlay={0.48} />
        {/* Scrim bas à 3 arrêts + glow scène */}
        <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, rgba(6,10,20,0.55) 0%, rgba(6,10,20,0.08) 38%, rgba(6,10,20,0.55) 70%, rgba(6,10,20,0.96) 100%)`, zIndex: 1 }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(90% 60% at 78% 22%, rgba(236,72,153,0.12), transparent 60%)", zIndex: 1 }} />
        {/* Chiffre fantôme : l'année de fondation de la maison */}
        <div aria-hidden style={{ position: "absolute", top: "8%", right: "-1%", fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(120px,22vw,320px)", lineHeight: 1, color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.09)", zIndex: 1, pointerEvents: "none", userSelect: "none" }}>
          2011
        </div>

        <div className="i324-heropad" style={{ position: "relative", zIndex: 2, padding: "0 clamp(24px,6vw,88px) clamp(40px,6vw,78px)", maxWidth: 1440, width: "100%", margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: "clamp(14px,2vw,22px)" }}>
              <span className="i324-livedot" aria-hidden style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent, boxShadow: "0 0 10px rgba(236,72,153,0.9)" }} />
              <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.38em", textTransform: "uppercase", color: C.accentDark, fontWeight: 600 }}>
                {clientEyebrow(sessionData) ?? <>Billetterie live · {ville} — Lille</>}
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 42 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.15, ease: EASE, delay: 0.28 }}
            style={{ fontFamily: DISPLAY, fontSize: "clamp(3rem,8.4vw,8.2rem)", fontWeight: 800, lineHeight: 0.94, letterSpacing: "-0.025em", textTransform: "uppercase", color: C.ink, margin: "0 0 clamp(16px,2.2vw,26px)", textShadow: "0 14px 60px rgba(0,0,0,0.6)" }}
          >
            {heroLigne1 ?? (
              <>
                Vivez le <em style={{ fontStyle: "italic", color: C.accent }}>frisson.</em>
              </>
            )}
            <span style={{ display: "block" }}>
              {heroLigne2 ?? (
                <>
                  Live the <span style={{ color: "transparent", WebkitTextStroke: `2px ${C.ink}` }}>moment.</span>
                </>
              )}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.48 }}
            style={{ fontFamily: SANS, fontWeight: 300, fontSize: "clamp(15.5px,1.6vw,19px)", color: "rgba(245,246,251,0.82)", maxWidth: 500, lineHeight: 1.72, margin: "0 0 clamp(26px,3.4vw,44px)" }}
          >
            {clientHeroSubtitle(sessionData) ?? c?.heroText ?? "Concerts, festivals et soirées rares : réservez votre place et gardez-en le souvenir longtemps."}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.62 }} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "clamp(16px,2.6vw,34px)" }}>
            <a
              href="#dates"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.accent, color: C.bgDark, borderRadius: 999, padding: "16px 32px", fontFamily: SANS, fontSize: 13, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", textDecoration: "none", boxShadow: "0 14px 40px -14px rgba(236,72,153,0.65)" }}
            >
              Voir les dates <ArrowRight size={15} />
            </a>
            {/* Légende de scène — pilotée par le même index que les affiches */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <SlideIndex i={heroIdx} total={POSTERS.length} variant="fraction" color={C.textMuted} className="" />
              <span style={{ fontFamily: SANS, fontSize: 13.5, color: C.textMuted }}>
                <strong style={{ color: C.ink, fontWeight: 600 }}>{heroEvent?.title}</strong>
                {" — "}
                {heroEvent?.d} {heroEvent?.m} · {heroEvent?.venue}
              </span>
              <HairlineArrows onPrev={prev} onNext={next} color={C.ink} className="" labels={{ prev: "Affiche précédente", next: "Affiche suivante" }} />
            </div>
          </motion.div>
        </div>
      </header>

      {/* ── MARQUEE DE DATES ─────────────────────────────────────────────── */}
      <section aria-label="Upcoming dates" className="i324-marquee" style={{ background: C.bgDarkAlt, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, overflow: "hidden", padding: "clamp(14px,1.6vw,20px) 0" }}>
        <div className="i324-marquee-track" style={{ display: "flex", whiteSpace: "nowrap", width: "max-content" }}>
          {[0, 1].map((dup) => (
            <div key={dup} aria-hidden={dup === 1} style={{ display: "flex" }}>
              {EVENTS.map((e, j) => (
                <span key={`${dup}-${e.id}-${j}`} style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "0 clamp(18px,2.4vw,34px)", fontFamily: DISPLAY, fontSize: "clamp(13px,1.3vw,16px)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  <span style={{ color: C.accent }}>{e.d} {e.m}</span>
                  <span style={{ color: C.ink }}>{e.title}</span>
                  <span style={{ color: C.textFaint, fontFamily: SANS, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>{e.venue}</span>
                  <span aria-hidden style={{ width: 5, height: 5, borderRadius: "50%", background: C.accentLight, border: `1px solid ${C.accent}` }} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── RESPIRATION ──────────────────────────────────────────────────── */}
      <section style={{ background: C.bg, padding: "clamp(80px,11vw,150px) clamp(24px,7vw,120px)", textAlign: "center", position: "relative" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 50% at 50% 45%, rgba(236,72,153,0.07), transparent 70%)", pointerEvents: "none" }} />
        <Reveal>
          <p style={{ fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(22px,3vw,40px)", lineHeight: 1.4, letterSpacing: "-0.005em", color: C.ink, maxWidth: 860, margin: "0 auto", position: "relative" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.texte") ?? (<>Les mêmes trois personnes programment chaque soirée depuis le début — et le prix affiché est le prix à l'entrée.</>)}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div aria-hidden style={{ width: 1, height: "clamp(52px,6vw,84px)", background: `linear-gradient(${C.accent}, transparent)`, margin: "clamp(30px,4vw,50px) auto 0" }} />
        </Reveal>
      </section>

      {/* ── PROGRAMME — rangées éditoriales numérotées ───────────────────── */}
      <section id="dates" style={{ background: C.bgAlt, padding: "clamp(80px,10vw,140px) clamp(24px,6vw,88px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: "-4%", left: "-2%", fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(140px,24vw,360px)", lineHeight: 1, color: "rgba(255,255,255,0.03)", pointerEvents: "none", userSelect: "none", textTransform: "uppercase" }}>
          Live
        </div>
        <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <Kicker>À l'affiche</Kicker>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(30px,4.6vw,58px)", fontWeight: 800, lineHeight: 1.06, letterSpacing: "-0.02em", color: C.ink, margin: "clamp(14px,2vw,22px) 0 clamp(34px,4.5vw,58px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "events.titre") ?? (<>Réservez votre <em style={{ fontStyle: "italic", color: C.accent }}>place.</em></>)}
            </h2>
          </Reveal>

          <div>
            {EVENTS.map((e, idx) => (
              <EventRow key={`${e.id}-${idx}`} e={e} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TARIFS — billets perforés ────────────────────────────────────── */}
      <section id="tickets" style={{ background: C.bg, padding: "clamp(80px,10vw,140px) clamp(24px,6vw,88px)", position: "relative" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <Kicker>Billetterie</Kicker>
          </Reveal>
          <div className="i324-split" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.25fr) minmax(0,0.75fr)", gap: "clamp(20px,3vw,44px)", alignItems: "end", margin: "clamp(14px,2vw,22px) 0 clamp(34px,4.5vw,56px)" }}>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(30px,4.6vw,58px)", fontWeight: 800, lineHeight: 1.06, letterSpacing: "-0.02em", color: C.ink, margin: 0 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Le prix sur l'affiche<br /><em style={{ fontStyle: "italic", color: C.accent }}>est le prix payé.</em></>)}
            </h2>
            <p style={{ fontFamily: SANS, fontSize: 14.5, color: C.textMuted, lineHeight: 1.75, margin: 0, maxWidth: 460 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.texte") ?? (<>Aucun prix qui varie, aucun frais de réservation au guichet. Standard, VIP ou devis de groupe : l'annonce fait foi.</>)}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px,100%),1fr))", gap: "clamp(18px,2.4vw,28px)" }}>
            {TICKETS.map((t, idx) => (
              <TicketCard key={`${t.k}-${idx}`} t={t} i={idx} />
            ))}
          </div>

          {/* Engagements — filet fin sous les billets */}
          <div style={{ marginTop: "clamp(36px,5vw,62px)", borderTop: `1px solid ${C.border}`, paddingTop: "clamp(24px,3.2vw,38px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px,100%),1fr))", gap: "clamp(16px,2.4vw,30px)" }}>
            {ENGAGE.map((e, idx) => (
              <Reveal key={idx} delay={idx * 0.07}>
                <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                  <span aria-hidden style={{ fontFamily: DISPLAY, fontSize: 13, fontWeight: 800, color: C.accent, marginTop: 2 }}>{String(idx + 1).padStart(2, "0")}</span>
                  <span style={{ fontFamily: SANS, fontSize: 13.5, color: C.textMuted, lineHeight: 1.65 }}>{e}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIP — split coulisses ────────────────────────────────────────── */}
      <section id="vip" style={{ background: C.bgDark, padding: "clamp(80px,10vw,140px) clamp(24px,6vw,88px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(70% 70% at 12% 90%, rgba(56,189,248,0.06), transparent 60%)", pointerEvents: "none" }} />
        <div className="i324-split" style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1.02fr) minmax(0,0.98fr)", gap: "clamp(36px,5vw,72px)", alignItems: "center", position: "relative" }}>
          <Reveal>
            <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", border: `1px solid ${C.border}`, background: C.bgDarkAlt, boxShadow: "0 40px 80px -40px rgba(0,0,0,0.9)" }}>
              {photo(1, FALLBACK_PHOTOS[1]) ? (
                <img src={photo(1, FALLBACK_PHOTOS[1])} alt={`Backstage — ${businessName}`} loading="lazy" style={{ width: "100%", height: "auto", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
              ) : (
                <div aria-hidden style={{ aspectRatio: "4/3", background: `linear-gradient(160deg, ${C.bgCard}, ${C.bgDarkAlt})` }} />
              )}
              <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,10,20,0.55), transparent 55%)" }} />
              <div style={{ position: "absolute", left: 20, bottom: 18, fontFamily: SANS, fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: C.accentDark, fontWeight: 600 }}>Backstage · limited availability</div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              <Kicker color={C.accentDark}>Accès privilégié</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(28px,3.8vw,50px)", fontWeight: 800, lineHeight: 1.06, letterSpacing: "-0.02em", color: C.ink, margin: "clamp(14px,2vw,20px) 0 clamp(16px,2vw,24px)" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "section-3.titre") ?? (<>Passez à l'expérience <em style={{ fontStyle: "italic", color: C.accent }}>VIP</em> experience.</>)}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 15, color: C.textMuted, lineHeight: 1.78, maxWidth: 500, margin: "0 0 clamp(24px,3vw,34px)" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "vip.texte") ?? (<>Le concert vu d'un autre endroit : placement privilégié, accès aux coulisses, boisson offerte et rencontre avec les artistes.</>)}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: "clamp(26px,3.4vw,40px)" }}>
                {/* LISTE_LIBELLES */ (clientList(sessionData, "bloc.liste1") ?? [
                  "Early Entry & Dedicated VIP Entrance",
                  "Premium Front Row or Balcony Seating",
                  "Exclusive Merchandise Package",
                  "Salon VIP et bar privé",
                ]).map((perk, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ width: 22, height: 22, borderRadius: "50%", background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Check size={12} color={C.accent} />
                    </span>
                    <span style={{ fontFamily: SANS, fontSize: 14.5, color: C.ink, lineHeight: 1.6 }}>{perk}</span>
                  </div>
                ))}
              </div>
              <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 10, border: `1px solid ${C.accent}`, color: C.accentDark, borderRadius: 999, padding: "14px 28px", fontFamily: SANS, fontSize: 12.5, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none" }}>
                Écrire au guichet <ArrowRight size={14} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CHIFFRES — bande à filets, chiffres fantômes ─────────────────── */}
      <section style={{ background: C.bgDarkAlt, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px,100%),1fr))", padding: "0 clamp(20px,4vw,48px)" }}>
          {STATS.map((s, idx) => (
            <Reveal key={`${s.l}-${idx}`} delay={idx * 0.08}>
              <div style={{ position: "relative", padding: "clamp(30px,4vw,52px) clamp(10px,1.4vw,20px)", textAlign: "center", overflow: "hidden" }}>
                <span aria-hidden style={{ position: "absolute", top: "-12%", left: "50%", transform: "translateX(-50%)", fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(64px,9vw,120px)", color: "rgba(255,255,255,0.04)", pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap" }}>{s.v}</span>
                <div style={{ position: "relative", fontFamily: DISPLAY, fontSize: "clamp(28px,3.4vw,44px)", fontWeight: 800, letterSpacing: "-0.02em", color: C.ink, lineHeight: 1 }}>{s.v}</div>
                <div style={{ position: "relative", fontFamily: SANS, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: C.textFaint, marginTop: 10 }}>{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── LA MAISON — colonnes filetées ────────────────────────────────── */}
      <section id="about" style={{ background: C.bg, padding: "clamp(80px,10vw,140px) clamp(24px,6vw,88px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <Kicker>La maison</Kicker>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(30px,4.4vw,54px)", fontWeight: 800, lineHeight: 1.06, letterSpacing: "-0.02em", color: C.ink, margin: "clamp(14px,2vw,22px) 0 clamp(30px,4vw,54px)", maxWidth: 700 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "about.titre") ?? (<>Qui fait les <em style={{ fontStyle: "italic", color: C.accent }}>soirées</em> on.</>)}
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px,100%),1fr))", gap: "clamp(22px,3vw,40px)" }}>
            {ABOUT.map((a, idx) => (
              <Reveal key={a.t} delay={idx * 0.08}>
                <div style={{ borderLeft: `1px solid ${C.border}`, paddingLeft: "clamp(16px,1.8vw,24px)", height: "100%", position: "relative" }}>
                  <span aria-hidden style={{ position: "absolute", left: -1, top: 0, width: 1, height: 44, background: `linear-gradient(${C.accent}, transparent)` }} />
                  <h3 style={{ fontFamily: DISPLAY, fontSize: "clamp(16.5px,1.6vw,19px)", fontWeight: 600, color: C.ink, margin: "0 0 10px", lineHeight: 1.3 }}>{a.t}</h3>
                  <p style={{ fontFamily: SANS, fontSize: 14, color: C.textMuted, lineHeight: 1.78, margin: 0 }}>{a.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVIS — spotlight rotatif ─────────────────────────────────────── */}
      <section style={{ background: C.bgAlt, padding: "clamp(80px,10vw,140px) clamp(24px,6vw,88px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: "10%", right: "-3%", fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(120px,20vw,280px)", lineHeight: 1, color: "rgba(255,255,255,0.03)", pointerEvents: "none", userSelect: "none" }}>
          &ldquo;
        </div>
        <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <Reveal>
            <Kicker>Ils y étaient</Kicker>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(28px,4vw,50px)", fontWeight: 800, lineHeight: 1.06, letterSpacing: "-0.02em", color: C.ink, margin: "clamp(14px,2vw,22px) 0 clamp(30px,4vw,50px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "section-5.titre") ?? (<>Écoutez la <em style={{ fontStyle: "italic", color: C.accent }}>salle.</em></>)}
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 22 }}>
              {[...Array(5)].map((_, j) => (
                <Star key={j} size={15} fill={C.accent} color={C.accent} />
              ))}
            </div>
            <motion.blockquote
              key={avisIdx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE }}
              style={{ fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(19px,2.5vw,30px)", lineHeight: 1.5, color: C.ink, margin: "0 0 26px" }}
            >
              &ldquo;{avis?.text}&rdquo;
            </motion.blockquote>
            <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: C.ink }}>{avis?.name}</div>
            <div style={{ fontFamily: SANS, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: C.textFaint, marginTop: 5 }}>{avis?.role}</div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 18, marginTop: 28 }}>
              <HairlineArrows onPrev={() => setAvisIdx(avisIdx - 1)} onNext={() => setAvisIdx(avisIdx + 1)} color={C.ink} className="" labels={{ prev: "Avis précédent", next: "Avis suivant" }} />
              <SlideIndex i={((avisIdx % AVIS.length) + AVIS.length) % AVIS.length} total={AVIS.length} variant="flat" color={C.textFaint} className="" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <section id="contact" style={{ background: C.bg, padding: "clamp(80px,10vw,140px) clamp(24px,6vw,88px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <Kicker>Contact</Kicker>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(30px,4.4vw,54px)", fontWeight: 800, lineHeight: 1.06, letterSpacing: "-0.02em", color: C.ink, margin: "clamp(14px,2vw,22px) 0 clamp(30px,4vw,50px)", maxWidth: 680 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>Parler à quelqu'un de <em style={{ fontStyle: "italic", color: C.accent }}>vivant.</em></>)}
            </h2>
          </Reveal>
          <div className="i324-contactgrid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "clamp(16px,2.2vw,26px)", marginBottom: "clamp(30px,4vw,48px)" }}>
            {CONTACT_SOURCE.map((l, idx) => (
              <Reveal key={l.t} delay={idx * 0.07}>
                <ContactCard l={l} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
              <a href={`mailto:${mail}`} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.accent, color: C.bgDark, borderRadius: 999, padding: "16px 32px", fontFamily: SANS, fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none" }}>
                <Mail size={16} /> Écrire au guichet
              </a>
              {phone && (
                <a href={`tel:${phone}`} style={{ display: "inline-flex", alignItems: "center", gap: 10, border: `1px solid ${C.border}`, color: C.ink, borderRadius: 999, padding: "15px 30px", fontFamily: SANS, fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textDecoration: "none" }}>
                  <Phone size={16} /> {phone}
                </a>
              )}
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: SANS, fontSize: 13.5, color: C.textMuted }}>
                <MapPin size={15} color={C.accent} /> {clientAddress(sessionData) ?? ville}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────────────────── */}
      <section style={{ background: `linear-gradient(140deg, ${C.bgDark}, ${C.bgDarkAlt})`, borderTop: `1px solid ${C.border}`, padding: "clamp(64px,8vw,110px) clamp(24px,6vw,88px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(65% 80% at 50% 0%, rgba(236,72,153,0.1), transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <Reveal>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(26px,3.6vw,44px)", fontWeight: 800, letterSpacing: "-0.02em", color: C.ink, margin: "0 0 14px", lineHeight: 1.08 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "section-8.titre") ?? (<>Ne manquez plus une <em style={{ fontStyle: "italic", color: C.accent }}>soirée.</em></>)}
            </h2>
            <p style={{ fontFamily: SANS, fontSize: 15, color: C.textMuted, lineHeight: 1.7, margin: "0 0 30px" }}>
              Recevez les préventes, les mises en vente et les offres VIP avant tout le monde.
            </p>
            <form onSubmit={(ev) => ev.preventDefault()} style={{ display: "flex", gap: 10, maxWidth: 480, margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
              <input
                type="email"
                placeholder="Votre adresse e-mail"
                aria-label="Adresse e-mail"
                style={{ flex: "1 1 220px", padding: "15px 20px", borderRadius: 999, border: `1px solid ${C.border}`, outline: "none", background: C.bgCard, color: C.ink, fontFamily: SANS, fontSize: 14 }}
              />
              <button type="submit" style={{ background: C.accent, color: C.bgDark, borderRadius: 999, border: "none", padding: "15px 30px", fontFamily: SANS, fontSize: 12.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer" }}>
                Subscribe
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{ background: C.bgDarkAlt, borderTop: `1px solid ${C.border}`, padding: "clamp(48px,6vw,80px) clamp(24px,6vw,88px) 26px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(230px,100%),1fr))", gap: "clamp(26px,3.5vw,48px)", marginBottom: "clamp(30px,4vw,52px)" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
                <span className="i324-livedot" aria-hidden style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent }} />
                <span style={{ fontFamily: DISPLAY, fontSize: 18, fontWeight: 800, color: C.ink }}>{businessName}</span>
              </div>
              <p style={{ fontFamily: SANS, fontSize: 13.5, color: C.textMuted, lineHeight: 1.75, maxWidth: 320, margin: 0 }}>
                La billetterie des concerts, des festivals et des soirées qu'on n'oublie pas.
              </p>
            </div>
            <div>
              <h4 style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: C.textFaint, margin: "0 0 18px" }}>Quick links</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 11 }}>
                {NAV.map((n) => (
                  <li key={n.l}>
                    <a href={n.h} style={{ color: C.textMuted, textDecoration: "none", fontFamily: SANS, fontSize: 13.5 }}>{n.l}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: C.textFaint, margin: "0 0 18px" }}>Box office</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 11 }}>
                <li style={{ display: "flex", alignItems: "center", gap: 9, color: C.textMuted, fontFamily: SANS, fontSize: 13.5 }}>
                  <Mail size={14} color={C.accent} /> {mail}
                </li>
                {phone && (
                  <li style={{ display: "flex", alignItems: "center", gap: 9, color: C.textMuted, fontFamily: SANS, fontSize: 13.5 }}>
                    <Phone size={14} color={C.accent} /> {phone}
                  </li>
                )}
                <li style={{ display: "flex", alignItems: "center", gap: 9, color: C.textMuted, fontFamily: SANS, fontSize: 13.5 }}>
                  <MapPin size={14} color={C.accent} /> {clientCodePostalVille(sessionData, "75000", "Paris")}
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: 9, color: C.textMuted, fontFamily: SANS, fontSize: 13.5 }}>
                  <Calendar size={14} color={C.accent} /> Wed – Sat · 14:00 — 19:00
                </li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10 }}>
            <span style={{ fontFamily: SANS, fontSize: 12, color: C.textFaint }}>
              © 2026 {businessName}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""} — all rights reserved.
            </span>
            <span style={{ fontFamily: SANS, fontSize: 12, color: C.textFaint }}>
              Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" /> · hébergement Vercel Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* Rangée d'événement — micro-interaction 3+ propriétés, flèche qui avance. */
function EventRow({ e, idx }: { e: any; idx: number }) {
  const [hov, setHov] = useState(false);
  return (
    <Reveal delay={Math.min(idx * 0.06, 0.3)}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        className="i324-eventrow"
        style={{
          display: "grid",
          gridTemplateColumns: "84px 96px minmax(0,1fr) auto",
          gap: "clamp(14px,2vw,26px)",
          alignItems: "center",
          padding: "clamp(16px,2vw,24px) clamp(12px,1.6vw,22px)",
          borderBottom: `1px solid ${C.border}`,
          borderLeft: `2px solid ${hov ? C.accent : "transparent"}`,
          background: hov ? "rgba(236,72,153,0.05)" : "transparent",
          transform: hov ? "translateX(8px)" : "none",
          transition: "all 0.5s cubic-bezier(.16,1,.3,1)",
          position: "relative",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: DISPLAY, fontSize: "clamp(26px,2.8vw,36px)", fontWeight: 800, lineHeight: 1, color: hov ? C.accent : C.ink, transition: "color 0.45s cubic-bezier(.16,1,.3,1)" }}>{e.d}</div>
          <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: C.textFaint, marginTop: 4 }}>{e.m}</div>
        </div>
        <div className="i324-eventthumb" style={{ width: 96, height: 64, borderRadius: 10, overflow: "hidden", border: `1px solid ${C.border}`, background: C.bgCard, flexShrink: 0 }}>
          {(e.img || photo(e.pi, FALLBACK_PHOTOS[e.pi])) ? (
            <img
              src={e.img || photo(e.pi, FALLBACK_PHOTOS[e.pi])}
              alt={e.title}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: hov ? "scale(1.07)" : "scale(1)", transition: "transform 0.6s cubic-bezier(.16,1,.3,1)" }}
            />
          ) : (
            <div aria-hidden style={{ width: "100%", height: "100%", background: `linear-gradient(140deg, ${C.bgCard}, rgba(236,72,153,0.15))` }} />
          )}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
            <h3 style={{ fontFamily: DISPLAY, fontSize: "clamp(17px,1.9vw,23px)", fontWeight: 600, color: C.ink, margin: 0, lineHeight: 1.2 }}>{e.title}</h3>
            <span style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.24em", textTransform: "uppercase", color: C.accentDark, fontWeight: 600 }}>{e.category}</span>
          </div>
          <div style={{ fontFamily: SANS, fontSize: 13.5, color: C.textMuted, marginTop: 6, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ color: C.ink, fontWeight: 500 }}>{e.artist}</span>
            <span aria-hidden style={{ width: 3, height: 3, borderRadius: "50%", background: C.textFaint }} />
            <span>{e.venue}</span>
            <span aria-hidden style={{ width: 3, height: 3, borderRadius: "50%", background: C.textFaint }} />
            <span>{e.time}</span>
          </div>
        </div>
        <div className="i324-eventcta" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: DISPLAY, fontSize: "clamp(16px,1.7vw,21px)", fontWeight: 800, color: hov ? C.accent : C.ink, whiteSpace: "nowrap", transition: "color 0.45s cubic-bezier(.16,1,.3,1)" }}>{e.price}</span>
          <a
            href="#tickets"
            aria-label={`Tickets — ${e.title}`}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: SANS, fontSize: 11.5, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: hov ? C.accentDark : C.textMuted, textDecoration: "none", padding: "12px 4px", transition: "color 0.45s cubic-bezier(.16,1,.3,1)" }}
          >
            Réserver
            <ArrowRight size={14} style={{ transform: hov ? "translateX(5px)" : "none", transition: "transform 0.5s cubic-bezier(.16,1,.3,1)" }} />
          </a>
        </div>
      </div>
    </Reveal>
  );
}

function ContactCard({ l }: { l: any }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.bgCard : C.bgAlt,
        border: `1px solid ${hov ? "rgba(236,72,153,0.35)" : C.border}`,
        borderRadius: 14,
        padding: "clamp(20px,2.6vw,30px) clamp(18px,2.2vw,26px)",
        height: "100%",
        transform: hov ? "translateY(-5px)" : "none",
        boxShadow: hov ? "0 26px 50px -30px rgba(0,0,0,0.85), 0 6px 20px -12px rgba(236,72,153,0.3)" : "none",
        transition: "all 0.5s cubic-bezier(.16,1,.3,1)",
      }}
    >
      <h3 style={{ fontFamily: DISPLAY, fontSize: 16.5, fontWeight: 600, color: hov ? C.accentDark : C.ink, margin: "0 0 10px", transition: "color 0.45s cubic-bezier(.16,1,.3,1)" }}>{l.t}</h3>
      <p style={{ fontFamily: SANS, fontSize: 13.5, color: C.textMuted, lineHeight: 1.75, margin: 0 }}>{l.d}</p>
    </div>
  );
}
