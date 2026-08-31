"use client";
// @ts-nocheck

/*
 * ══════════════════════════════════════════════════════════════════════
 * impact-321 — {clientName(sessionData) ?? "AI Horizons '26"} · sommet conférences & salons, Station F
 * Réécriture famille I → squelette premium (plan REPRISE_316_383, lot B).
 * Geste signature : LineScroll (≠) — les lignes du titre monumental
 * roulent sous masque, entrent par la droite, sortent par la gauche.
 * Archétype H5 : rail latéral fixe + titre monumental.
 * Fontes P9 : Syne (display) + Work Sans (texte).
 * Palette sombre #0a0a12 / accent #8b5cf6 (pilotée par --brand).
 * Signature visuelle : rail fixe, agenda en StickyProgress,
 * intervenants en grille.
 * ══════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Mail,
  MapPin,
  Menu,
  Mic,
  Phone,
  X,
} from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, useSlides, SlideIndex, HairlineArrows } from "@/lib/templates/hero-kit-2";
import { LineScroll, FixedRail, StickyProgress } from "@/lib/templates/hero-kit-3";
import {
  clientAddress,
  clientCity,
  clientEmail,
  clientEyebrow,
  clientFaq,
  clientHeroLine,
  clientHeroSubtitle,
  clientList,
  clientName,
  clientPhone,
  clientPhotos,
  clientServices,
  clientStats,
  clientTagline,
  clientTeam,
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
  bg: "#0a0a12",
  bgAlt: "#0e0e1a",
  bgDark: "#060609",
  bgDarkAlt: "#101020",
  bgCard: "#12121f",
  accent: "var(--brand,#8b5cf6)",
  accentDark: "var(--brand-light,#a78bfa)",
  accentLight: "rgba(139,92,246,0.14)",
  ink: "#f4f3fa",
  textMuted: "#9d9bb3",
  textFaint: "#5c5a72",
  border: "rgba(255,255,255,0.08)",
  white: "#ffffff",
  glow: "rgba(139,92,246,0.11)",
};

const DISPLAY = "'Syne', 'Work Sans', sans-serif";
const SANS = "'Work Sans', system-ui, sans-serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const RAIL_W = "clamp(44px, 4vw, 64px)";

/* ── Photos : URLs existantes du thème, jamais de nouvelle URL ───────── */
const PHOTO_FALLBACKS = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop", // 0 hero
  "https://images.unsplash.com/photo-1591115765373-5207764f72e7?q=80&w=2070&auto=format&fit=crop", // 1 à propos
  "https://images.pexels.com/photos/35531247/pexels-photo-35531247.jpeg?auto=compress&cs=tinysrgb&w=1600", // 2 intervenant
  "https://images.pexels.com/photos/8761641/pexels-photo-8761641.jpeg?auto=compress&cs=tinysrgb&w=1600", // 3 intervenant
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop", // 4 intervenante
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop", // 5 intervenant
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop", // 6 intervenante
  "https://images.pexels.com/photos/30561676/pexels-photo-30561676.jpeg?auto=compress&cs=tinysrgb&w=1600", // 7 intervenant
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop", // 8 ambiance
  "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=2070", // 9 ambiance
  "https://images.unsplash.com/photo-1558008258-3256797b43f3?q=80&w=2069&auto=format&fit=crop", // 10 ambiance
  "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop", // 11 ambiance
];

function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ── Données de démonstration (contenu rédactionnel conservé) ────────── */

const HERO_SOURCE = [
  {
    k: "Keynotes & panels",
    l1: "LE SOMMET",
    l2: "DES INTELLIGENCES",
    sub: "Explorez les frontières de l'IA. 3 jours de conférences, d'ateliers techniques et de networking exclusif avec les pionniers du domaine.",
  },
  {
    k: "Ateliers pratiques",
    l1: "FAÇONNER LE FUTUR",
    l2: "DE L'IA",
    sub: "Codez et déployez des modèles avec les experts. Des keynotes inspirantes sur les tendances à 5-10 ans.",
  },
  {
    k: "Networking exclusif",
    l1: "3 JOURS",
    l2: "D'IMMERSION",
    sub: "Rejoignez des milliers de professionnels à l'événement tech de l'année.",
  },
];

const STATS_SOURCE = [
  { value: "50+", label: "Conférenciers Experts" },
  { value: "3000+", label: "Participants" },
  { value: "3", label: "Jours d'Immersion" },
  { value: "100+", label: "Startups & Exposants" },
];

const SPEAKERS_SOURCE = [
  { name: "Elena Rostova", role: "Directrice de Recherche IA, TechGiant", idx: 2 },
  { name: "Marc Delattre", role: "Fondateur, NeuralNetworks Inc.", idx: 3 },
  { name: "Dr. Sarah Chen", role: "Professeure en Éthique de l'IA", idx: 4 },
  { name: "James Holden", role: "CTO, FutureRobotics", idx: 5 },
  { name: "Camille Laurent", role: "Lead Data Scientist, DataCorp", idx: 6 },
  { name: "Alexandre Dubois", role: "Investisseur, AI Ventures", idx: 7 },
];

const AGENDA_SOURCE = [
  {
    n: "01",
    date: "Jour 1 · 15 Nov",
    title: "Fondations & Futur",
    sessions: [
      { time: "09:00 – 10:30", title: "Keynote d'Ouverture : L'état de l'IA en 2026", speaker: "Elena Rostova", type: "Keynote" },
      { time: "11:00 – 12:30", title: "Réseaux Neuronaux Avancés : Nouvelles Architectures", speaker: "Marc Delattre", type: "Masterclass" },
      { time: "14:00 – 15:30", title: "L'IA Générative dans le Design Industriel", speaker: "Camille Laurent", type: "Workshop" },
      { time: "16:00 – 17:30", title: "Panel : Régulation et Éthique de l'IA", speaker: "Dr. Sarah Chen & Invités", type: "Panel" },
    ],
  },
  {
    n: "02",
    date: "Jour 2 · 16 Nov",
    title: "Applications & Industrie",
    sessions: [
      { time: "09:30 – 11:00", title: "Robotics and AI Integration", speaker: "James Holden", type: "Keynote" },
      { time: "11:30 – 13:00", title: "IA en Santé : Du diagnostic aux traitements", speaker: "Dr. Clara Martin", type: "Masterclass" },
      { time: "14:30 – 16:00", title: "Financer sa startup IA en 2026", speaker: "Alexandre Dubois", type: "Workshop" },
    ],
  },
  {
    n: "03",
    date: "Jour 3 · 17 Nov",
    title: "Networking & Hackathon",
    sessions: [
      { time: "09:00 – 18:00", title: "Hackathon IA Horizons : Résoudre les défis climatiques", speaker: "Mentors divers", type: "Compétition" },
      { time: "19:00 – 23:00", title: "Gala de Clôture & Remise des Prix", speaker: "Toute l'équipe", type: "Networking" },
    ],
  },
];

const TICKETS_SOURCE = [
  {
    name: "Early Bird",
    price: "299€",
    desc: "Accès limité aux 500 premiers inscrits.",
    features: ["Accès aux 3 jours", "Conférences principales", "Application de networking", "Café & Déjeuners"],
    primary: false,
  },
  {
    name: "Pass Standard",
    price: "499€",
    desc: "L'expérience complète AI Horizons.",
    features: ["Accès aux 3 jours", "Toutes les conférences & panels", "Application de networking", "Café, Déjeuners & Cocktails", "Vidéos en replay"],
    primary: true,
  },
  {
    name: "Pass VIP",
    price: "999€",
    desc: "Pour les cadres et investisseurs.",
    features: ["Accès prioritaire", "Toutes les conférences & panels", "Lounge VIP exclusif", "Dîner privé avec les speakers", "Accès illimité aux replays"],
    primary: false,
  },
];

const FAQ_SOURCE = [
  { q: "L'événement sera-t-il retransmis en ligne ?", a: "Oui, un pass virtuel est disponible pour suivre les conférences principales en direct." },
  { q: "Puis-je changer le nom sur mon billet ?", a: "Oui, vous pouvez transférer votre billet jusqu'à 7 jours avant l'événement via notre plateforme." },
  { q: "Y a-t-il des tarifs de groupe ?", a: "Nous offrons 15% de réduction pour les groupes de 5 personnes ou plus. Contactez-nous directement." },
  { q: "Le lieu est-il accessible aux PMR ?", a: "Absolument, Station F est entièrement accessible. N'hésitez pas à nous prévenir pour des besoins spécifiques." },
];

/* Partenaires fictifs : des marques réelles ne peuvent pas parrainer une démo. */
const SPONSORS_SOURCE = ["Northbeam", "Kaleido Cloud", "Vantix", "Orbital Systems"];

/* ── Fonctions LIVE : ré-appelées dans Page() après sessionData ──────── */

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

function SPEAKERS_LIVE() {
  return resolveList(
    clientTeam(sessionData)?.map((m: any, i: number) => ({
      ...SPEAKERS_SOURCE[i % SPEAKERS_SOURCE.length],
      name: m.name,
      role: m.role ?? SPEAKERS_SOURCE[i % SPEAKERS_SOURCE.length].role,
    })),
    SPEAKERS_SOURCE,
  );
}

function TICKETS_LIVE() {
  return resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...TICKETS_SOURCE[i % TICKETS_SOURCE.length],
      name: s.title ?? TICKETS_SOURCE[i % TICKETS_SOURCE.length].name,
      price: s.price ?? TICKETS_SOURCE[i % TICKETS_SOURCE.length].price,
      desc: s.description ?? s.desc ?? TICKETS_SOURCE[i % TICKETS_SOURCE.length].desc,
    })),
    TICKETS_SOURCE,
  );
}

function FAQ_LIVE() {
  return resolveList(
    clientFaq(sessionData)?.map((f: any, i: number) => ({
      ...FAQ_SOURCE[i % FAQ_SOURCE.length],
      q: f.q,
      a: f.a,
    })),
    FAQ_SOURCE,
  );
}

/* Coupe une phrase en deux lignes au mot le plus proche du milieu :
   présentation seulement, aucun mot inventé. */
function deuxLignes(phrase: string): [string, string] {
  const mots = phrase.trim().split(/\s+/);
  if (mots.length < 2) return [phrase, ""];
  let best = 1;
  let bestDelta = Infinity;
  for (let k = 1; k < mots.length; k++) {
    const a = mots.slice(0, k).join(" ").length;
    const b = mots.slice(k).join(" ").length;
    const delta = Math.abs(a - b);
    if (delta < bestDelta) {
      bestDelta = delta;
      best = k;
    }
  }
  return [mots.slice(0, best).join(" "), mots.slice(best).join(" ")];
}

/* ── Petits composants ───────────────────────────────────────────────── */

function Reveal({ children, delay = 0, y = 26 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: "clamp(14px, 2vw, 22px)" }}>
      <span aria-hidden style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${C.accent})`, display: "block" }} />
      <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, letterSpacing: "0.36em", textTransform: "uppercase", color: C.accentDark }}>
        {children}
      </span>
    </div>
  );
}

/*
  Un panneau par question, dans son propre composant.
  Le useState vivait dans le corps du `.map` : son nombre suivrait la longueur
  de la liste, qui change dès que les questions du client arrivent, et React
  lèverait l'erreur #300 en emportant la page.
*/
function FaqPanel321({ faq }: { faq: any }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: C.bgCard, border: `1px solid ${open ? "rgba(139,92,246,0.35)" : C.border}`, borderRadius: 10, overflow: "hidden", transition: "border-color 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          minHeight: 44,
          padding: "clamp(16px, 2.4vw, 24px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          background: "none",
          border: "none",
          color: C.ink,
          cursor: "pointer",
          textAlign: "left",
          fontFamily: SANS,
          fontSize: "clamp(15px, 1.6vw, 16.5px)",
          fontWeight: 500,
        }}
      >
        {faq.q}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.45, ease: EASE }} style={{ display: "flex", flexShrink: 0 }}>
          <ChevronDown size={18} color={C.accentDark} />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: EASE }} style={{ overflow: "hidden" }}>
            <p style={{ padding: "0 clamp(16px, 2.4vw, 24px) clamp(16px, 2.4vw, 24px)", margin: 0, color: C.textMuted, lineHeight: 1.75, fontSize: 15 }}>{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SpeakerCard321({ sp, src }: { sp: any; src: string }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: C.bgCard,
        border: `1px solid ${hover ? "rgba(139,92,246,0.45)" : C.border}`,
        borderRadius: 12,
        overflow: "hidden",
        transform: hover ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hover ? "0 24px 48px rgba(0,0,0,0.5), 0 6px 16px rgba(139,92,246,0.18)" : "0 2px 8px rgba(0,0,0,0.25)",
        transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.5s cubic-bezier(0.16,1,0.3,1)",
        height: "100%",
      }}
    >
      <div style={{ aspectRatio: "4/4.4", overflow: "hidden", background: `linear-gradient(160deg, ${C.bgDarkAlt}, ${C.bgDark})` }}>
        {src ? (
          <img
            src={src}
            alt={sp.name}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: hover ? "grayscale(0%) saturate(1)" : "grayscale(45%) saturate(0.85)",
              transform: hover ? "scale(1.045)" : "scale(1)",
              transition: "transform 0.55s cubic-bezier(0.16,1,0.3,1), filter 0.55s cubic-bezier(0.16,1,0.3,1)",
              display: "block",
            }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: `radial-gradient(circle at 50% 30%, ${C.glow}, transparent 70%), ${C.bgDarkAlt}` }}>
            <span style={{ fontFamily: DISPLAY, fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 800, color: C.accentDark, opacity: 0.55 }}>
              {String(sp.name || "?").split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
            </span>
          </div>
        )}
      </div>
      <div style={{ padding: "clamp(16px, 2vw, 22px)" }}>
        <h3 style={{ margin: "0 0 5px", fontFamily: DISPLAY, fontWeight: 700, fontSize: 18, letterSpacing: "0.01em", color: C.ink }}>{sp.name}</h3>
        <p style={{ margin: 0, color: C.accentDark, fontSize: 13.5, fontWeight: 500, lineHeight: 1.5 }}>{sp.role}</p>
      </div>
    </div>
  );
}

function TicketCard321({ ticket, onOpen }: { ticket: any; onOpen: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: ticket.primary ? `linear-gradient(170deg, ${C.accentLight}, rgba(139,92,246,0.03)), ${C.bgCard}` : C.bgCard,
        border: ticket.primary ? `1.5px solid ${C.accent}` : `1px solid ${hover ? "rgba(139,92,246,0.4)" : C.border}`,
        borderRadius: 14,
        padding: "clamp(26px, 3.4vw, 40px)",
        position: "relative",
        transform: hover ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hover
          ? "0 26px 52px rgba(0,0,0,0.55), 0 8px 18px rgba(139,92,246,0.2)"
          : ticket.primary
            ? "0 16px 40px rgba(0,0,0,0.4)"
            : "0 2px 8px rgba(0,0,0,0.25)",
        transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.5s cubic-bezier(0.16,1,0.3,1)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {ticket.primary && (
        <span style={{ position: "absolute", top: 0, left: "50%", transform: "translate(-50%, -50%)", background: C.accent, color: C.bgDark, padding: "7px 20px", borderRadius: 30, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", whiteSpace: "nowrap" }}>
          Plus populaire
        </span>
      )}
      <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(18px, 2vw, 22px)", margin: "0 0 12px", color: C.ink }}>{ticket.name}</h3>
      {/*
        L'emplacement est dessiné pour un montant court — « 890 € ». Le client
        écrit rarement cela : « à partir de 9 400 € » remplissait trois lignes
        et écrasait le nom de la prestation, « 180 € le déplacement » se
        coupait en plein milieu du mot. La taille suit donc la longueur, sans
        changer le dessin quand le montant est court.
      */}
      <div style={{ fontFamily: DISPLAY, fontSize: String(ticket.price ?? "").length > 9 ? "clamp(22px, 2.2vw, 28px)" : "clamp(36px, 4vw, 50px)", fontWeight: 800, lineHeight: 1.08, color: ticket.primary ? C.accentDark : C.ink, marginBottom: 14 }}>{ticket.price}</div>
      <p style={{ color: C.textMuted, fontSize: 14.5, lineHeight: 1.65, margin: "0 0 26px" }}>{ticket.desc}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 30, flexGrow: 1 }}>
        {(ticket.features ?? []).map((feat: string, j: number) => (
          <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
            <CheckCircle2 size={17} color={ticket.primary ? C.accentDark : C.textFaint} style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.5 }}>{feat}</span>
          </div>
        ))}
      </div>
      <button
        onClick={onOpen}
        style={{
          width: "100%",
          minHeight: 48,
          background: ticket.primary ? C.accent : "transparent",
          color: ticket.primary ? C.bgDark : C.ink,
          border: ticket.primary ? "none" : `1px solid ${C.border}`,
          borderRadius: 9,
          fontFamily: SANS,
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: "0.02em",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 9,
          transition: "background 0.45s cubic-bezier(0.16,1,0.3,1), color 0.45s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        Réserver maintenant
        <motion.span animate={{ x: hover ? 4 : 0 }} transition={{ duration: 0.45, ease: EASE }} style={{ display: "flex" }}>
          <ArrowRight size={16} />
        </motion.span>
      </button>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────── */

export default function Impact321Page() {
  const [session, setSession] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Inscription billetterie (modale) */
  const [registrationTier, setRegistrationTier] = useState<string | null>(null);
  const [regForm, setRegForm] = useState({ name: "", email: "", company: "" });
  const [regLoading, setRegLoading] = useState(false);
  const [regSent, setRegSent] = useState(false);

  /* Compte à rebours */
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const targetDate = new Date("2026-11-15T09:00:00").getTime();
    const interval = setInterval(() => {
      const distance = targetDate - Date.now();
      if (distance < 0) {
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(distance / 86400000),
          hours: Math.floor((distance % 86400000) / 3600000),
          minutes: Math.floor((distance % 3600000) / 60000),
          seconds: Math.floor((distance % 60000) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  /* Affectations AVANT tout appel de helper. */
  fd = session?.formData;
  c = session?.generatedContent;
  bp = session?.businessProfile;
  sessionData = session;

  const STATS = STATS_LIVE();
  const SPEAKERS = SPEAKERS_LIVE();
  const TICKETS = TICKETS_LIVE();
  const FAQS = FAQ_LIVE();

  const businessName = clientName(sessionData) ?? "AI Horizons '26";
  const eventDate = fd?.eventDate ?? "15 – 17 Novembre 2026";
  /*
    L'adresse saisie par le client prime sur le lieu de la démonstration : un
    organisateur qui a renseigné son siège ne doit pas voir « Station F ».
  */
  const eventLocation = fd?.eventLocation ?? clientAddress(sessionData) ?? `Station F, ${clientCity(sessionData) ?? "Paris"}`;
  const tel = clientPhone(sessionData) ?? fd?.phone ?? null;
  const mail = clientEmail(sessionData) ?? "contact@aihorizons.com";

  /*
    Le titre monumental roule ligne par ligne (LineScroll). La première
    diapositive porte l'accroche du client ; les suivantes viennent de ses
    prestations. Sans session : les trois accroches du thème.
  */
  const L1 = clientHeroLine(sessionData, 0, 2, 16);
  const L2 = clientHeroLine(sessionData, 1, 2, 16);
  const CLIENT_SERVICES = clientServices(sessionData);
  const HERO_SLIDES = L1
    ? [
        {
          k: clientEyebrow(sessionData) ?? clientTrade(sessionData) ?? HERO_SOURCE[0].k,
          l1: L1.toUpperCase(),
          l2: (L2 ?? "").toUpperCase(),
          sub: clientHeroSubtitle(sessionData) ?? clientTagline(sessionData) ?? HERO_SOURCE[0].sub,
        },
        ...(CLIENT_SERVICES ?? []).slice(0, 2).map((sv: any, n: number) => {
          const [a, b] = deuxLignes(String(sv.title ?? ""));
          return {
            k: HERO_SOURCE[(n + 1) % HERO_SOURCE.length].k,
            l1: a.toUpperCase(),
            l2: b.toUpperCase(),
            sub: sv.description ?? sv.desc ?? HERO_SOURCE[(n + 1) % HERO_SOURCE.length].sub,
          };
        }),
      ]
    : HERO_SOURCE;

  /* Un seul index pilote tout le héros : titre, kicker, sous-titre, rail. */
  const { i, next, prev } = useSlides(HERO_SLIDES.length, DWELL.slow);
  const S = HERO_SLIDES[i % HERO_SLIDES.length];

  const openRegistration = (tierName: string) => {
    setRegistrationTier(tierName);
    setRegSent(false);
    setRegForm({ name: "", email: "", company: "" });
  };
  const closeRegistration = () => setRegistrationTier(null);
  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name || !regForm.email) return;
    setRegLoading(true);
    setTimeout(() => {
      setRegLoading(false);
      setRegSent(true);
    }, 1800);
  };

  const NAV = [
    { l: "À propos", h: "#about" },
    { l: "Intervenants", h: "#speakers" },
    { l: "Agenda", h: "#agenda" },
    { l: "Partenaires", h: "#sponsors" },
    { l: "Billetterie", h: "#tickets" },
  ];

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, minHeight: "100vh", overflowX: "clip" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Work+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

        html { scroll-behavior: smooth; }

        .i321-navlink {
          position: relative;
          color: ${C.textMuted};
          text-decoration: none;
          font-family: ${SANS};
          font-size: 13.5px;
          font-weight: 500;
          letter-spacing: 0.06em;
          padding: 12px 2px;
          transition: color 0.45s cubic-bezier(0.16,1,0.3,1);
        }
        .i321-navlink::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 6px;
          height: 1.5px;
          width: 0%;
          background: ${C.accent};
          transition: width 0.45s cubic-bezier(0.16,1,0.3,1);
        }
        .i321-navlink:hover { color: ${C.ink}; }
        .i321-navlink:hover::after { width: 100%; }

        /* Rail latéral : immobile pour toute la page (H5). */
        .i321-rail { position: fixed !important; }
        .i321-offset { padding-left: ${RAIL_W}; }

        /* Le point qui bat sur le rail — le détail gratuit. */
        @keyframes i321pulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.7); opacity: 0.35; }
        }
        .i321-pulse { animation: i321pulse 2.6s cubic-bezier(0.16,1,0.3,1) infinite; }

        .i321-grid-texture {
          background-image:
            linear-gradient(to right, rgba(255,255,255,0.028) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.028) 1px, transparent 1px);
          background-size: 4rem 4rem;
        }

        .i321-agenda { display: grid; grid-template-columns: minmax(0,0.85fr) minmax(0,1.15fr); gap: clamp(28px, 5vw, 80px); }
        .i321-agenda h3 { font-family: ${DISPLAY}; font-weight: 700; font-size: clamp(19px, 2.2vw, 25px); color: ${C.ink}; margin: 0; line-height: 1.2; }
        .i321-agenda p { color: ${C.textMuted}; font-size: 15px; margin: 6px 0 0; }

        .i321-mosaic {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          grid-auto-rows: clamp(110px, 16vw, 220px);
          gap: clamp(8px, 1.2vw, 14px);
        }
        .i321-mosaic > :nth-child(1) { grid-column: span 2; grid-row: span 2; }
        .i321-mosaic > :nth-child(4) { grid-column: span 2; }

        .i321-about { display: grid; grid-template-columns: minmax(0,1.1fr) minmax(0,0.9fr); gap: clamp(32px, 5vw, 72px); align-items: center; }

        @media (max-width: 900px) {
          .i321-rail { display: none !important; }
          .i321-offset { padding-left: 0; }
          #i321-nav { display: none !important; }
          .i321-burger { display: flex !important; }
          .i321-agenda { grid-template-columns: 1fr; }
          .i321-agenda > div:first-child { position: static !important; }
        }
        @media (max-width: 860px) {
          .i321-about { grid-template-columns: 1fr; }
          .i321-about > * { order: initial; }
          .i321-mosaic { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .i321-mosaic > :nth-child(1) { grid-column: span 2; grid-row: span 1; }
          .i321-mosaic > :nth-child(4) { grid-column: span 2; }
        }
        @media (prefers-reduced-motion: reduce) {
          .i321-pulse { animation: none; }
          html { scroll-behavior: auto; }
        }
      `}</style>

      {/* ── RAIL LATÉRAL FIXE (H5) ─────────────────────────────────────── */}
      <FixedRail color={C.bgDarkAlt} side="left" width={RAIL_W} className="i321-rail">
        <div style={{ position: "absolute", inset: 0, borderRight: `1px solid ${C.border}`, pointerEvents: "none" }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", height: "100%", padding: "88px 0 26px" }}>
          <span className="i321-pulse" aria-hidden style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent, display: "block" }} />
          <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontFamily: DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: "0.34em", textTransform: "uppercase", color: C.textFaint, whiteSpace: "nowrap" }}>
            {businessName} — {eventDate}
          </span>
          <div style={{ transform: "rotate(90deg)" }}>
            <SlideIndex i={i} total={HERO_SLIDES.length} variant="fraction" color={C.textMuted} className="" />
          </div>
        </div>
      </FixedRail>

      <div className="i321-offset">
        {/* ── NAV ──────────────────────────────────────────────────────── */}
        <header
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            height: 76,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `0 clamp(20px, 4vw, 48px) 0 calc(${RAIL_W} + clamp(20px, 3vw, 40px))`,
            background: scrolled ? "rgba(6,6,9,0.82)" : "transparent",
            backdropFilter: scrolled ? "blur(14px)" : "none",
            borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
            transition: "background 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.5s cubic-bezier(0.16,1,0.3,1)",
          }}
          className="i321-header"
        >
          <style>{`@media (max-width: 900px){ .i321-header { padding-left: 20px !important; } }`}</style>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={businessName} style={{ height: 32, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <span style={{ fontFamily: DISPLAY, fontSize: 19, fontWeight: 800, letterSpacing: "0.03em", color: C.ink, whiteSpace: "nowrap" }}>
              {businessName.split(" ")[0]}
              <span style={{ color: C.accentDark }}>{businessName.includes(" ") ? " " + businessName.substring(businessName.indexOf(" ") + 1) : ""}</span>
            </span>
          )}
          <nav id="i321-nav" style={{ display: "flex", gap: "clamp(16px, 2.4vw, 34px)", alignItems: "center" }}>
            {NAV.map(({ l, h }) => (
              <a key={l} href={h} className="i321-navlink">{l}</a>
            ))}
            <a
              href="#tickets"
              style={{ background: C.accent, color: C.bgDark, borderRadius: 8, padding: "12px 22px", fontSize: 14, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}
            >
              Réserver un pass
            </a>
          </nav>
          <button
            className="i321-burger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
            style={{ display: "none", background: "none", border: "none", color: C.ink, cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" }}
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </header>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: EASE }}
              style={{ position: "fixed", top: 76, left: 0, right: 0, zIndex: 99, background: "rgba(6,6,9,0.97)", backdropFilter: "blur(18px)", borderBottom: `1px solid ${C.border}`, padding: "28px 24px 32px", display: "flex", flexDirection: "column", gap: 4 }}
            >
              {NAV.map(({ l, h }) => (
                <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ color: C.ink, fontFamily: DISPLAY, fontSize: 21, fontWeight: 600, textDecoration: "none", padding: "13px 0", borderBottom: `1px solid ${C.border}` }}>
                  {l}
                </a>
              ))}
              <a href="#tickets" onClick={() => setMobileOpen(false)} style={{ marginTop: 18, background: C.accent, color: C.bgDark, borderRadius: 8, padding: "15px 22px", fontSize: 15, fontWeight: 600, textDecoration: "none", textAlign: "center" }}>
                Réserver un pass
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── HÉROS — titre monumental en LineScroll ───────────────────── */}
        <section style={{ position: "relative", minHeight: "100dvh", display: "flex", alignItems: "center", background: C.bgDark, overflow: "hidden", padding: "clamp(110px, 14vh, 150px) 0 clamp(40px, 6vh, 70px)" }}>
          {/* Photo en fond, très éteinte : la page reste belle sans elle. */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url('${photo(0, PHOTO_FALLBACKS[0])}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.2,
            }}
          />
          <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(6,6,9,0.55) 0%, rgba(6,6,9,0.25) 42%, ${C.bgDark} 96%)` }} />
          <div aria-hidden className="i321-grid-texture" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
          <div aria-hidden style={{ position: "absolute", top: "-10%", right: "-6%", width: "46vw", height: "46vw", borderRadius: "50%", background: `radial-gradient(circle, ${C.glow} 0%, transparent 70%)`, filter: "blur(50px)", pointerEvents: "none" }} />
          {/* Chiffre fantôme — le millésime. */}
          <span aria-hidden style={{ position: "absolute", right: "clamp(8px, 4vw, 60px)", bottom: "-4%", fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(180px, 30vw, 460px)", lineHeight: 1, color: C.ink, opacity: 0.045, pointerEvents: "none", userSelect: "none" }}>
            26
          </span>

          <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1180, margin: "0 auto", padding: "0 clamp(20px, 4vw, 48px)" }}>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: "clamp(16px, 2.4vh, 26px)" }}>
                <span aria-hidden style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${C.accent})`, display: "block" }} />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={`k-${i}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, letterSpacing: "0.38em", textTransform: "uppercase", color: C.accentDark, display: "block" }}
                  >
                    {S.k}
                  </motion.span>
                </AnimatePresence>
              </div>

              <h1 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(30px, 7.4vw, 94px)", lineHeight: 0.98, letterSpacing: "-0.015em", textTransform: "uppercase", margin: "0 0 clamp(18px, 3vh, 30px)", color: C.ink }}>
                <LineScroll lines={[S.l1]} index={i} />
                <span style={{ color: C.accentDark, fontStyle: "italic", display: "block" }}>
                  <LineScroll lines={[S.l2 || " "]} index={i} />
                </span>
              </h1>

              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={`sub-${i}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.65, ease: EASE }}
                  style={{ fontSize: "clamp(15px, 1.8vw, 18px)", lineHeight: 1.72, color: C.textMuted, maxWidth: 520, margin: "0 0 clamp(22px, 3.4vh, 36px)", fontWeight: 300 }}
                >
                  {S.sub}
                </motion.p>
              </AnimatePresence>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(14px, 2vw, 26px)", alignItems: "center", marginBottom: "clamp(22px, 3.4vh, 38px)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Calendar size={17} color={C.accentDark} />
                  <span style={{ fontSize: 14.5, fontWeight: 500 }}>{eventDate}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <MapPin size={17} color={C.accentDark} />
                  <span style={{ fontSize: 14.5, fontWeight: 500 }}>{eventLocation}</span>
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", marginBottom: "clamp(28px, 4.6vh, 52px)" }}>
                <motion.a
                  href="#tickets"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  style={{ background: C.accent, color: C.bgDark, borderRadius: 9, padding: "16px 32px", fontWeight: 600, fontSize: 15.5, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}
                >
                  Réserver ma place <ArrowRight size={17} />
                </motion.a>
                <motion.a
                  href="#agenda"
                  whileHover={{ borderColor: C.accent }}
                  transition={{ duration: 0.45, ease: EASE }}
                  style={{ background: "transparent", color: C.ink, border: `1px solid ${C.border}`, borderRadius: 9, padding: "15px 28px", fontWeight: 500, fontSize: 15.5, textDecoration: "none" }}
                >
                  Voir le programme
                </motion.a>
                <HairlineArrows onPrev={prev} onNext={next} color={C.textMuted} className="" labels={{ prev: "Accroche précédente", next: "Accroche suivante" }} />
              </div>

              {/* Compte à rebours en ligne fine */}
              <div style={{ display: "inline-flex", flexWrap: "wrap", gap: "clamp(14px, 2.4vw, 34px)", alignItems: "baseline", borderTop: `1px solid ${C.border}`, paddingTop: "clamp(16px, 2.4vh, 24px)" }}>
                {[
                  { v: timeLeft.days, l: "jours" },
                  { v: timeLeft.hours, l: "heures" },
                  { v: timeLeft.minutes, l: "min" },
                  { v: timeLeft.seconds, l: "sec" },
                ].map((t, n) => (
                  <div key={n} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(22px, 3vw, 34px)", color: n === 0 ? C.accentDark : C.ink, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                      {String(t.v).padStart(2, "0")}
                    </span>
                    <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: C.textFaint }}>{t.l}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── RESPIRATION ──────────────────────────────────────────────── */}
        <section style={{ background: C.bg, padding: "clamp(56px, 9vw, 110px) clamp(20px, 4vw, 48px)" }}>
          <Reveal>
            <p style={{ fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 500, fontSize: "clamp(19px, 2.6vw, 28px)", lineHeight: 1.5, color: C.textMuted, textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "respiration.texte") ?? (
                <>« Apprenez directement de ceux qui construisent l'IA d'aujourd'hui <span style={{ color: C.accentDark }}>et imaginent celle de demain</span>. »</>
              )}
            </p>
          </Reveal>
        </section>

        {/* ── STATS — bande sombre à filets ────────────────────────────── */}
        <section style={{ background: C.bgDark, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, position: "relative", overflow: "hidden" }}>
          <span aria-hidden style={{ position: "absolute", left: "clamp(8px, 2vw, 30px)", top: "50%", transform: "translateY(-50%)", fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(90px, 14vw, 200px)", color: C.ink, opacity: 0.04, pointerEvents: "none", userSelect: "none", lineHeight: 1 }}>
            IA
          </span>
          <div style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(36px, 5vw, 60px) clamp(20px, 4vw, 48px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: "clamp(20px, 3vw, 40px)" }}>
            {STATS.map((stat: any, n: number) => (
              <Reveal key={n} delay={n * 0.08}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: DISPLAY, fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 800, color: C.ink, lineHeight: 1, marginBottom: 9 }}>{stat.value}</div>
                  <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.18em", color: C.accentDark, fontWeight: 500 }}>{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── À PROPOS ─────────────────────────────────────────────────── */}
        <section id="about" style={{ background: C.bg, padding: "clamp(70px, 10vw, 130px) clamp(20px, 4vw, 48px)", position: "relative", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", top: "30%", left: "-12%", width: "38vw", height: "38vw", borderRadius: "50%", background: `radial-gradient(circle, ${C.glow} 0%, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none" }} />
          <div className="i321-about" style={{ maxWidth: 1180, margin: "0 auto", position: "relative", zIndex: 2 }}>
            <div>
              <Reveal>
                <Kicker>À propos de l'événement</Kicker>
                <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(27px, 3.6vw, 46px)", lineHeight: 1.06, letterSpacing: "-0.01em", margin: "0 0 clamp(18px, 2.6vw, 28px)", color: C.ink }}>
                  {/* TEXTE_SECTION */ clientText(sessionData, "about.titre") ?? (
                    <>Façonner le futur de <em style={{ color: C.accentDark, fontStyle: "italic" }}>l'Intelligence Artificielle</em></>
                  )}
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <p style={{ fontSize: "clamp(15px, 1.7vw, 17px)", color: C.textMuted, lineHeight: 1.78, maxWidth: 510, margin: "0 0 18px", fontWeight: 300 }}>
                  {/* TEXTE_SECTION */ clientText(sessionData, "about.texte") ?? (
                    <>AI Horizons rassemble les esprits les plus brillants de l'industrie technologique pour explorer, débattre et construire l'avenir de l'IA. Pendant trois jours intenses, plongez au cœur des innovations qui redéfinissent notre monde.</>
                  )}
                </p>
                <p style={{ fontSize: "clamp(15px, 1.7vw, 17px)", color: C.textMuted, lineHeight: 1.78, maxWidth: 510, margin: "0 0 clamp(24px, 3vw, 36px)", fontWeight: 300 }}>
                  Que vous soyez chercheur, développeur, ou dirigeant d'entreprise, cet événement est votre passerelle vers les technologies de demain.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", gap: "clamp(16px, 2.4vw, 28px)" }}>
                  {[
                    { t: "Visions Stratégiques", d: "Des keynotes inspirantes sur les tendances à 5-10 ans." },
                    { t: "Ateliers Pratiques", d: "Codez et déployez des modèles avec les experts." },
                  ].map((item, n) => (
                    <div key={n} style={{ borderLeft: `2px solid ${C.accent}`, paddingLeft: 16 }}>
                      <h4 style={{ margin: "0 0 7px", fontFamily: DISPLAY, fontWeight: 600, fontSize: 15.5, color: C.ink }}>{item.t}</h4>
                      <p style={{ margin: 0, fontSize: 13.5, color: C.textMuted, lineHeight: 1.6 }}>{item.d}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.15}>
              <div style={{ position: "relative" }}>
                <div aria-hidden style={{ position: "absolute", inset: -18, background: `linear-gradient(45deg, ${C.accentLight}, transparent 70%)`, filter: "blur(28px)", borderRadius: 22 }} />
                <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", border: `1px solid ${C.border}`, background: C.bgDarkAlt, aspectRatio: "4/3" }}>
                  <img src={photo(1, PHOTO_FALLBACKS[1])} alt="Le sommet en salle plénière" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ position: "absolute", bottom: -18, left: -14, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: "clamp(14px, 2vw, 22px) clamp(18px, 2.4vw, 26px)", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", gap: 14 }}>
                  <span aria-hidden style={{ width: 42, height: 42, borderRadius: "50%", background: C.accentLight, display: "grid", placeItems: "center", color: C.accentDark }}>
                    <Mic size={20} />
                  </span>
                  <div>
                    <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 20, color: C.ink, lineHeight: 1 }}>100%</div>
                    <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.16em", marginTop: 4 }}>Innovation IA</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── INTERVENANTS — grille ────────────────────────────────────── */}
        <section id="speakers" style={{ background: C.bgDarkAlt, padding: "clamp(70px, 10vw, 130px) clamp(20px, 4vw, 48px)", position: "relative", overflow: "hidden" }}>
          <div aria-hidden className="i321-grid-texture" style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.7 }} />
          <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative", zIndex: 2 }}>
            <Reveal>
              <div style={{ maxWidth: 640, marginBottom: "clamp(36px, 5vw, 64px)" }}>
                <Kicker>Line-up 2026</Kicker>
                <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(27px, 3.6vw, 46px)", lineHeight: 1.06, letterSpacing: "-0.01em", margin: "0 0 14px", color: C.ink }}>
                  {/* TEXTE_SECTION */ clientText(sessionData, "speakers.titre") ?? (
                    <>Les <em style={{ color: C.accentDark, fontStyle: "italic" }}>Visionnaires</em></>
                  )}
                </h2>
                <p style={{ color: C.textMuted, fontSize: 15.5, lineHeight: 1.7, maxWidth: 480, margin: 0, fontWeight: 300 }}>
                  Apprenez directement de ceux qui construisent l'IA d'aujourd'hui et imaginent celle de demain.
                </p>
              </div>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "clamp(16px, 2.2vw, 28px)" }}>
              {SPEAKERS.map((sp: any, n: number) => (
                <Reveal key={n} delay={n * 0.07}>
                  <SpeakerCard321 sp={sp} src={photo(sp.idx ?? 2 + n, PHOTO_FALLBACKS[sp.idx ?? 2])} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── AGENDA — StickyProgress ──────────────────────────────────── */}
        <section id="agenda" style={{ background: C.bg, padding: "clamp(70px, 10vw, 130px) clamp(20px, 4vw, 48px)", position: "relative", overflow: "hidden" }}>
          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <StickyProgress
              className="i321-agenda"
              steps={AGENDA_SOURCE.map((d) => ({ n: d.n, title: `${d.date} — ${d.title}`, body: "" }))}
              renderTitle={(active: number) => (
                <div>
                  <Kicker>Programme officiel</Kicker>
                  <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(27px, 3.6vw, 46px)", lineHeight: 1.06, letterSpacing: "-0.01em", margin: "0 0 clamp(16px, 2.4vw, 26px)", color: C.ink }}>
                    {/* TEXTE_SECTION */ clientText(sessionData, "agenda.titre") ?? (
                      <>Agenda <em style={{ color: C.accentDark, fontStyle: "italic" }}>du Sommet</em></>
                    )}
                  </h2>
                  <div style={{ position: "relative", height: "clamp(70px, 9vw, 130px)", marginBottom: 14 }}>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={active}
                        aria-hidden
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 0.08, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6, ease: EASE }}
                        style={{ position: "absolute", left: 0, top: 0, fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(80px, 11vw, 150px)", lineHeight: 1, color: C.ink, pointerEvents: "none", userSelect: "none" }}
                      >
                        {AGENDA_SOURCE[active]?.n ?? "01"}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {AGENDA_SOURCE.map((d, n) => (
                      <div key={d.n} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span aria-hidden style={{ width: n === active ? 34 : 16, height: 1.5, background: n === active ? C.accent : C.border, display: "block", transition: "width 0.5s cubic-bezier(0.16,1,0.3,1), background 0.5s cubic-bezier(0.16,1,0.3,1)" }} />
                        <span style={{ fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: n === active ? C.ink : C.textFaint, fontWeight: n === active ? 600 : 400, transition: "color 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
                          {d.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              renderMedia={(n: number) => (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {AGENDA_SOURCE[n].sessions.map((s, k) => (
                    <div key={k} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.accent}`, borderRadius: 10, padding: "clamp(16px, 2.2vw, 24px)" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, color: C.accentDark, fontVariantNumeric: "tabular-nums" }}>{s.time}</span>
                        <span style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.16em", color: C.textMuted, background: "rgba(255,255,255,0.06)", borderRadius: 4, padding: "4px 10px" }}>{s.type}</span>
                      </div>
                      <h4 style={{ margin: "0 0 8px", fontFamily: SANS, fontWeight: 600, fontSize: "clamp(15.5px, 1.8vw, 17.5px)", color: C.ink, lineHeight: 1.4 }}>{s.title}</h4>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.textMuted, fontSize: 13.5 }}>
                        <Mic size={14} color={C.textFaint} />
                        {s.speaker}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            />
          </div>
        </section>

        {/* ── PARTENAIRES ──────────────────────────────────────────────── */}
        <section id="sponsors" style={{ background: C.bgDark, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "clamp(56px, 8vw, 100px) clamp(20px, 4vw, 48px)" }}>
          <div style={{ maxWidth: 1180, margin: "0 auto", textAlign: "center" }}>
            <Reveal>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Kicker>Partenaires</Kicker>
              </div>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(24px, 3.2vw, 40px)", lineHeight: 1.08, margin: "0 0 clamp(30px, 4.4vw, 52px)", color: C.ink }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "sponsors.titre") ?? (
                  <>Ils rendent cela <em style={{ color: C.accentDark, fontStyle: "italic" }}>possible</em></>
                )}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "clamp(24px, 4.6vw, 64px)", opacity: 0.65 }}>
                {/* LISTE_LIBELLES */ (clientList(sessionData, "partenaires.liste") ?? SPONSORS_SOURCE).map((name: string, n: number) => (
                  <span key={n} style={{ fontFamily: DISPLAY, fontSize: "clamp(17px, 2vw, 22px)", fontWeight: 700, letterSpacing: "0.05em", color: C.ink, whiteSpace: "nowrap" }}>
                    {name}
                  </span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              <div style={{ marginTop: "clamp(30px, 4.4vw, 52px)" }}>
                <p style={{ color: C.textMuted, fontSize: 15, marginBottom: 18, fontWeight: 300 }}>Vous souhaitez devenir partenaire ?</p>
                <a href={`mailto:${mail}`} style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "transparent", color: C.ink, border: `1px solid ${C.border}`, borderRadius: 9, padding: "14px 28px", fontWeight: 500, fontSize: 15, textDecoration: "none" }}>
                  Devenir sponsor <ArrowRight size={16} />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── AMBIANCE — mosaïque des éditions ─────────────────────────── */}
        <section style={{ background: C.bg, padding: "clamp(60px, 8.4vw, 110px) clamp(20px, 4vw, 48px)" }}>
          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <Reveal>
              <div style={{ marginBottom: "clamp(26px, 3.6vw, 44px)" }}>
                <Kicker>Le lieu, l'expérience</Kicker>
                <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(24px, 3.2vw, 40px)", lineHeight: 1.08, margin: 0, color: C.ink }}>
                  {/* TEXTE_SECTION */ clientText(sessionData, "ambiance.titre") ?? (
                    <>Trois jours <em style={{ color: C.accentDark, fontStyle: "italic" }}>d'immersion</em></>
                  )}
                </h2>
              </div>
            </Reveal>
            <div className="i321-mosaic">
              {[8, 9, 10, 11].map((idx, n) => (
                <Reveal key={idx} delay={n * 0.07}>
                  <div style={{ width: "100%", height: "100%", borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}`, background: `radial-gradient(circle at 40% 30%, ${C.glow}, transparent 70%), ${C.bgDarkAlt}`, minHeight: "100%" }}>
                    <img src={photo(idx, PHOTO_FALLBACKS[idx])} alt="Ambiance du sommet" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── BILLETTERIE ──────────────────────────────────────────────── */}
        <section id="tickets" style={{ background: C.bgAlt, padding: "clamp(70px, 10vw, 130px) clamp(20px, 4vw, 48px)", position: "relative", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", bottom: "-14%", left: "12%", width: "40vw", height: "40vw", borderRadius: "50%", background: `radial-gradient(circle, ${C.glow} 0%, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative", zIndex: 2 }}>
            <Reveal>
              <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto clamp(40px, 5.6vw, 72px)" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Kicker>Billetterie</Kicker>
                </div>
                <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(27px, 3.6vw, 46px)", lineHeight: 1.06, margin: "0 0 14px", color: C.ink }}>
                  {/* TEXTE_SECTION */ clientText(sessionData, "tickets.titre") ?? (
                    <>Sécurisez votre <em style={{ color: C.accentDark, fontStyle: "italic" }}>Accès</em></>
                  )}
                </h2>
                <p style={{ color: C.textMuted, fontSize: 15.5, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
                  Les places sont limitées pour garantir une expérience de networking optimale.
                </p>
              </div>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "clamp(18px, 2.4vw, 30px)", alignItems: "stretch" }}>
              {TICKETS.map((ticket: any, n: number) => (
                <Reveal key={n} delay={n * 0.09} y={34}>
                  <TicketCard321 ticket={ticket} onOpen={() => openRegistration(ticket.name)} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section style={{ background: C.bgDark, padding: "clamp(70px, 10vw, 130px) clamp(20px, 4vw, 48px)" }}>
          <div style={{ maxWidth: 780, margin: "0 auto" }}>
            <Reveal>
              <div style={{ textAlign: "center", marginBottom: "clamp(30px, 4.4vw, 52px)" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Kicker>FAQ</Kicker>
                </div>
                <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(25px, 3.4vw, 42px)", lineHeight: 1.08, margin: 0, color: C.ink }}>
                  {/* TEXTE_SECTION */ clientText(sessionData, "section-8.titre") ?? (
                    <>Questions <em style={{ color: C.accentDark, fontStyle: "italic" }}>Fréquentes</em></>
                  )}
                </h2>
              </div>
            </Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {FAQS.map((faq: any, n: number) => (
                <Reveal key={n} delay={n * 0.06}>
                  <FaqPanel321 faq={faq} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ────────────────────────────────────────────────── */}
        <section style={{ position: "relative", overflow: "hidden", background: `linear-gradient(140deg, ${C.accent}, ${C.accentDark})`, padding: "clamp(64px, 9vw, 110px) clamp(20px, 4vw, 48px)" }}>
          <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18) 0%, transparent 60%)" }} />
          <span aria-hidden style={{ position: "absolute", right: "-2%", bottom: "-18%", fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(140px, 22vw, 320px)", lineHeight: 1, color: "#000", opacity: 0.08, pointerEvents: "none", userSelect: "none" }}>
            26
          </span>
          <div style={{ position: "relative", zIndex: 2, maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <Reveal>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(28px, 4.4vw, 52px)", lineHeight: 1.02, color: C.bgDark, margin: "0 0 18px", letterSpacing: "-0.01em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "section-9.titre") ?? <>Prêt à façonner l'avenir ?</>}
              </h2>
              <p style={{ fontSize: "clamp(15.5px, 1.9vw, 18px)", color: "rgba(6,6,9,0.75)", margin: "0 0 clamp(26px, 3.6vw, 40px)", lineHeight: 1.65 }}>
                Rejoignez des milliers de professionnels à l'événement tech de l'année.
              </p>
              <a href="#tickets" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.bgDark, color: C.white, borderRadius: 9, padding: "18px 40px", fontWeight: 600, fontSize: 16, textDecoration: "none" }}>
                Obtenir mon Pass 2026 <ArrowRight size={17} />
              </a>
            </Reveal>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────────── */}
        <footer style={{ background: C.bgDark, borderTop: `1px solid ${C.border}`, padding: "clamp(50px, 7vw, 84px) clamp(20px, 4vw, 48px) clamp(24px, 3vw, 40px)" }}>
          <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(230px, 100%), 1fr))", gap: "clamp(30px, 4.4vw, 56px)", marginBottom: "clamp(36px, 5vw, 64px)" }}>
            <div>
              {fd?.logoBase64 ? (
                <img src={fd.logoBase64} alt={businessName} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block", marginBottom: 18 }} />
              ) : (
                <div style={{ fontFamily: DISPLAY, fontSize: 19, fontWeight: 800, marginBottom: 16, color: C.ink }}>
                  {businessName.split(" ")[0]}
                  <span style={{ color: C.accentDark }}>{businessName.includes(" ") ? " " + businessName.substring(businessName.indexOf(" ") + 1) : ""}</span>
                </div>
              )}
              <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.7, margin: 0, maxWidth: 300, fontWeight: 300 }}>
                {clientTagline(sessionData) ?? "L'événement européen de référence pour les professionnels de l'Intelligence Artificielle."}
              </p>
            </div>
            <div>
              <h4 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20, color: C.ink }}>Liens rapides</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 11 }}>
                {NAV.map(({ l, h }) => (
                  <li key={l}>
                    <a href={h} style={{ color: C.textMuted, textDecoration: "none", fontSize: 14, padding: "4px 0", display: "inline-block" }}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20, color: C.ink }}>Légal</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 11 }}>
                <li><a href="#" style={{ color: C.textMuted, textDecoration: "none", fontSize: 14, padding: "4px 0", display: "inline-block" }}>Mentions Légales</a></li>
                <li><a href="#" style={{ color: C.textMuted, textDecoration: "none", fontSize: 14, padding: "4px 0", display: "inline-block" }}>Politique de Confidentialité</a></li>
                <li><a href="#" style={{ color: C.textMuted, textDecoration: "none", fontSize: 14, padding: "4px 0", display: "inline-block" }}>CGV Billetterie</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20, color: C.ink }}>Contact</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, color: C.textMuted, fontSize: 14 }}>
                <a href={`mailto:${mail}`} style={{ display: "flex", alignItems: "center", gap: 9, color: C.textMuted, textDecoration: "none", padding: "4px 0" }}>
                  <Mail size={15} color={C.accentDark} /> {mail}
                </a>
                {tel && (
                  <a href={`tel:${tel.replace(/\s/g, "")}`} style={{ display: "flex", alignItems: "center", gap: 9, color: C.textMuted, textDecoration: "none", padding: "4px 0" }}>
                    <Phone size={15} color={C.accentDark} /> {tel}
                  </a>
                )}
                <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <MapPin size={15} color={C.accentDark} /> {eventLocation}
                </span>
              </div>
            </div>
          </div>
          <div style={{ maxWidth: 1180, margin: "0 auto", borderTop: `1px solid ${C.border}`, paddingTop: "clamp(18px, 2.4vw, 28px)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ color: C.textFaint, fontSize: 12.5 }}>
              © {new Date().getFullYear()} {businessName}
              {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
            </span>
            <span style={{ color: C.textFaint, fontSize: 12.5 }}>Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
          </div>
        </footer>
      </div>

      {/* ── MODALE D'INSCRIPTION ───────────────────────────────────────── */}
      <AnimatePresence>
        {registrationTier && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeRegistration}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(6,6,9,0.82)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: "100%", maxWidth: 460, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: "clamp(26px, 4vw, 40px)", position: "relative", maxHeight: "90vh", overflowY: "auto" }}
            >
              <button
                onClick={closeRegistration}
                aria-label="Fermer"
                style={{ position: "absolute", top: 12, right: 12, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", borderRadius: 8 }}
              >
                <X size={20} />
              </button>

              {regSent ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <CheckCircle2 size={48} color={C.accentDark} style={{ margin: "0 auto 16px" }} />
                  <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, color: C.ink, marginBottom: 12 }}>Inscription confirmée !</h3>
                  <p style={{ color: C.textMuted, fontSize: 15, lineHeight: 1.65 }}>
                    Merci {regForm.name}, votre inscription au tarif <strong style={{ color: C.ink }}>{registrationTier}</strong> est enregistrée. Un email de confirmation arrive à {regForm.email}.
                  </p>
                  <button onClick={closeRegistration} style={{ marginTop: 28, width: "100%", minHeight: 48, background: C.accent, color: C.bgDark, border: "none", borderRadius: 9, fontFamily: SANS, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                    Fermer
                  </button>
                </div>
              ) : (
                <>
                  <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, color: C.ink, marginBottom: 8 }}>Réserver votre pass</h3>
                  <p style={{ color: C.accentDark, fontSize: 13.5, fontWeight: 600, marginBottom: 26, letterSpacing: "0.04em" }}>Tarif sélectionné : {registrationTier}</p>
                  <form onSubmit={handleRegistrationSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <div>
                      <label htmlFor="reg-name" style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>Nom complet</label>
                      <input
                        id="reg-name"
                        type="text"
                        required
                        value={regForm.name}
                        onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                        style={{ width: "100%", minHeight: 44, boxSizing: "border-box", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`, borderRadius: 8, color: C.ink, fontFamily: SANS, fontSize: 15, outline: "none" }}
                      />
                    </div>
                    <div>
                      <label htmlFor="reg-email" style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>Email professionnel</label>
                      <input
                        id="reg-email"
                        type="email"
                        required
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        style={{ width: "100%", minHeight: 44, boxSizing: "border-box", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`, borderRadius: 8, color: C.ink, fontFamily: SANS, fontSize: 15, outline: "none" }}
                      />
                    </div>
                    <div>
                      <label htmlFor="reg-company" style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>Entreprise (facultatif)</label>
                      <input
                        id="reg-company"
                        type="text"
                        value={regForm.company}
                        onChange={(e) => setRegForm({ ...regForm, company: e.target.value })}
                        style={{ width: "100%", minHeight: 44, boxSizing: "border-box", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`, borderRadius: 8, color: C.ink, fontFamily: SANS, fontSize: 15, outline: "none" }}
                      />
                    </div>
                    <div>
                      <label htmlFor="reg-tier" style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>Tarif</label>
                      <select
                        id="reg-tier"
                        value={registrationTier}
                        onChange={(e) => setRegistrationTier(e.target.value)}
                        style={{ width: "100%", minHeight: 44, boxSizing: "border-box", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`, borderRadius: 8, color: C.ink, fontFamily: SANS, fontSize: 15, outline: "none", cursor: "pointer" }}
                      >
                        {TICKETS.map((t: any) => (
                          <option key={t.name} value={t.name} style={{ color: "#000" }}>
                            {t.name} — {t.price}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" disabled={regLoading} style={{ width: "100%", minHeight: 48, marginTop: 6, background: C.accent, color: C.bgDark, border: "none", borderRadius: 9, fontFamily: SANS, fontSize: 15, fontWeight: 600, cursor: regLoading ? "wait" : "pointer", opacity: regLoading ? 0.7 : 1 }}>
                      {regLoading ? "Envoi en cours…" : "Confirmer mon inscription"}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
