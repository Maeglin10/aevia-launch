"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  Phone,
  Scale,
  Server,
  Shield,
  Star,
  Truck,
  Users,
} from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { BentoCascade, DWELL, HairlineArrows, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
import {
  clientAddress,
  clientAreas,
  clientCertifications,
  clientCity,
  clientCodePostalVille,
  clientEmail,
  clientEyebrow,
  clientHeroLine,
  clientHeroPrestations,
  clientList,
  clientMethode,
  clientName,
  clientPhone,
  clientPhotos,
  clientReviews,
  clientServices,
  clientStats,
  clientTagline,
  clientText,
  clientTrade,
  fusionnerEtapes,
} from "@/lib/templates/clientContent";

/* ════════════════════════════════════════════════════════════════════════════
   {clientName(sessionData) ?? "Boréal Courtage"} — Courtage de risques d'entreprise & flottes · Lyon
   Geste signature : BentoCascade (hero-kit-2). Les tuiles inégales du héros se
   vident en cascade verticale puis se remplissent dans le même ordre : à
   mi-transition la grille est presque nue, et le programme d'assurance se
   remonte tuile par tuile. Les chiffres de flotte sont DANS la grille — ils
   ne sont pas relégués à un bandeau.
   Archétype H8 : bento, tuiles de tailles inégales, aucune photographie
   au-dessus de la ligne de flottaison.
   Paire de fontes P2 : Playfair Display (serif de titre) × Space Grotesk.
   ════════════════════════════════════════════════════════════════════════════ */

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
let fd: any = null;
let c: any = null;
let bp: any = null;
// La session complète, pour lib/templates/clientContent : même portée
// que fd/c/bp, pour les sous-composants qui n'ont pas de props.
let sessionData: any = null;
let brand: any = null;

/* ── Fontes ──────────────────────────────────────────────────────────────── */
const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');`;
const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif";
const SANS = "'Space Grotesk', system-ui, -apple-system, 'Segoe UI', sans-serif";
// Les sous-pages du thème lisent encore FONT/FONT_BODY : on garde les deux noms.
const FONT = SERIF;
const FONT_BODY = SANS;

/* ── Courbe d'accélération unique du thème ───────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_CSS = "cubic-bezier(.16,1,.3,1)";

/* ── Jetons ──────────────────────────────────────────────────────────────── */
let C: Record<string, string> = {
  bg: "#0b1220",
  bgAlt: "#111a2c",
  bgDark: "#070c16",
  bgDarkAlt: "#050912",
  bgCard: "#141e33",
  accent: "var(--brand, #5b7fd4)",
  accentDark: "var(--brand-light, #8ea8e8)",
  accentLight: "#16203a",
  ink: "#eef1f8",
  textMuted: "#98a3ba",
  textFaint: "#6b7793",
  border: "rgba(255,255,255,0.09)",
  white: "#ffffff",
  // Clé métier : la teinte des tuiles de risque, entre l'acier et la nuit.
  acier: "#1b2740",
};

const NAV = [
  { l: "Programmes", h: "#services" },
  { l: "La méthode", h: "#methode" },
  { l: "Honoraires", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* ════════════════════════════════════════════════════════════════════════════
   Données de démonstration.

   Sources figées d'un côté (champs de présentation : icône, ton, étiquette),
   listes vivantes de l'autre — recalculées dans le corps du rendu, une fois la
   session affectée. Une constante évaluée à l'import ne verrait jamais le
   client.
   ════════════════════════════════════════════════════════════════════════════ */

const HERO_SOURCE = [
  {
    k: "Dommages",
    sub: "Les murs, les machines, l'exploitation.",
    tiles: [
      { icon: Building2, t: "Multirisque industrielle", d: "Bâtiments et contenus à la valeur de reconstruction réelle.", ton: "accent" },
      { icon: Server, t: "Bris de machine", d: "Lignes de production et équipements critiques, arrêts chiffrés.", ton: "sombre" },
      { icon: Shield, t: "Perte d'exploitation", d: "La marge brute couverte le temps de redémarrer.", ton: "acier" },
    ],
  },
  {
    k: "Responsabilités",
    sub: "Ce que l'entreprise doit aux autres.",
    tiles: [
      { icon: Scale, t: "RC exploitation & produits", d: "Adaptée à vos contrats, vos exports, vos volumes.", ton: "sombre" },
      { icon: Users, t: "RC des dirigeants", d: "Le patrimoine personnel des mandataires protégé.", ton: "accent" },
      { icon: Server, t: "Cyber-risques", d: "Rançongiciel, interruption, notification RGPD : couverts et assistés.", ton: "acier" },
    ],
  },
  {
    k: "Hommes & flottes",
    sub: "Ceux qui font l'entreprise, et ce qui roule.",
    tiles: [
      { icon: Truck, t: "Flottes automobiles", d: "De 5 à 500 véhicules, sinistralité pilotée trimestre par trimestre.", ton: "acier" },
      { icon: Users, t: "Santé & prévoyance collectives", d: "Conformité conventionnelle, comptes de résultats suivis.", ton: "accent" },
      { icon: Shield, t: "Hommes clés", d: "La perte d'un dirigeant ou d'un expert, financièrement absorbée.", ton: "sombre" },
    ],
  },
];

const SERVICES_SOURCE = [
  { titre: "Cartographie des risques", desc: "Visite de sites, lecture des contrats commerciaux, chiffrage des valeurs : la base écrite de tout le programme d'assurance.", tag: "Audit", icon: Scale },
  { titre: "Multirisque & PE", desc: "Dommages aux biens et perte d'exploitation alignées sur vos marges réelles — le point qui fait survivre une PME sinistrée.", tag: "Dommages", icon: Building2 },
  { titre: "Flottes & mobilité", desc: "Flottes auto, engins, marchandises transportées. Reporting de sinistralité trimestriel et plan de prévention conducteurs.", tag: "Flottes", icon: Truck },
  { titre: "Cyber & fraude", desc: "Couverture rançongiciel, fraude au président, interruption d'activité numérique — avec assistance 24h/24 incluse.", tag: "Cyber", icon: Server },
  { titre: "Collectives", desc: "Santé, prévoyance, retraite : conformité aux conventions collectives et pilotage des comptes année après année.", tag: "Social", icon: Users },
  { titre: "Sinistres majeurs", desc: "Cellule dédiée : expertise, contre-expertise, avances sur indemnités négociées pour maintenir la trésorerie.", tag: "Sinistres", icon: Shield },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE_SOURCE = [
  { n: "01", t: "Cartographie écrite", d: "Sites visités, risques hiérarchisés, valeurs validées avec votre expert-comptable." },
  { n: "02", t: "Appel au marché", d: "Consultation de quinze assureurs entreprise, mise en concurrence réelle, clauses négociées ligne à ligne." },
  { n: "03", t: "Programme unifié", d: "Un seul échéancier, des franchises cohérentes, zéro trou entre les contrats." },
  { n: "04", t: "Pilotage annuel", d: "Revue de sinistralité, ajustement des capitaux, renégociation à chaque échéance triennale." },
];
let METHODE = METHODE_SOURCE;

const ENGAGEMENT_SOURCE = [
  "ORIAS n° 26 007 833, sous le contrôle de l'ACPR, RC professionnelle de courtage",
  "Lettre de mission écrite : périmètre, rémunération et livrables annoncés",
  "Transparence totale des commissions et honoraires, compte par compte",
  "Aucun lien capitalistique avec un assureur : l'arbitre, c'est votre risque",
];
let ENGAGEMENT = ENGAGEMENT_SOURCE;

const TARIFS_SOURCE = [
  { a: "Cartographie des risques", p: "dès 1 200 €", n: "Rapport écrit et hiérarchisé, déduit si le programme nous est confié." },
  { a: "Programme PME (< 50 salariés)", p: "commissions affichées", n: "Rémunération de place, détaillée contrat par contrat dans la lettre de mission." },
  { a: "Programme ETI / multi-sites", p: "honoraires au forfait", n: "Facturation au temps ou au forfait annuel, commissions rétrocédées." },
  { a: "Gestion de sinistre majeur", p: "incluse", n: "Cellule dédiée, expertise et avances négociées — sans facturation additionnelle." },
];
let TARIFS = TARIFS_SOURCE;

const AVIS_SOURCE = [
  { texte: "Incendie d'un atelier en 2025 : avance de 300 k€ obtenue en trois semaines, perte d'exploitation réglée au réel. L'entreprise n'a pas licencié.", auteur: "DG, agroalimentaire (56 sal.)", detail: "Sinistre majeur" },
  { texte: "La cartographie a révélé que nos stocks déportés n'étaient couverts nulle part. Corrigé avant l'hiver, prime globale en baisse de 11 %.", auteur: "DAF, distribution", detail: "Cartographie + programme" },
  { texte: "Flotte de 120 véhicules : sinistralité en baisse d'un tiers en deux ans grâce au reporting et au plan conducteurs. Prime renégociée à la baisse.", auteur: "Resp. flotte, BTP", detail: "Flotte automobile" },
];
let AVIS_DEMO = AVIS_SOURCE;

const STATS_SOURCE = [
  { value: "240", label: "Entreprises clientes" },
  { value: "15", label: "Assureurs en place de marché" },
  { value: "72 h", label: "Ouverture d'un sinistre majeur" },
  { value: "1", label: "Interlocuteur dédié par compte" },
];
let STATS = STATS_SOURCE;

/* ── Photos ──────────────────────────────────────────────────────────────── */
/**
 * L'image téléversée à cet emplacement, sinon celle du thème.
 *
 * `||` et non `??` : une chaîne vide est un emplacement non pourvu. Les
 * emplacements sans URL de thème rendent une trame CSS sur fond sombre — la
 * page reste tenue images bloquées.
 */
function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 26, style }: { children: React.ReactNode; delay?: number; y?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} style={style} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.75, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

/** Sur-titre : filet de 40 px puis capitales très espacées. */
function Kicker({ children, color = C.accentDark, align = "left" }: { children: React.ReactNode; color?: string; align?: "left" | "center" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: align === "center" ? "center" : "flex-start" }}>
      <span style={{ width: 40, height: 1, background: color, opacity: 0.7, flexShrink: 0 }} />
      <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 500, letterSpacing: "0.34em", textTransform: "uppercase", color }}>{children}</span>
      {align === "center" && <span style={{ width: 40, height: 1, background: color, opacity: 0.7, flexShrink: 0 }} />}
    </div>
  );
}

function NavLink({ label, href }: { label: string; href: string }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        position: "relative",
        fontFamily: SANS,
        fontSize: 13.5,
        fontWeight: 400,
        letterSpacing: "0.02em",
        color: h ? C.ink : C.textMuted,
        textDecoration: "none",
        padding: "12px 2px",
        transition: `color .45s ${EASE_CSS}`,
      }}
    >
      {label}
      <span style={{ position: "absolute", left: 0, bottom: 6, height: 1, width: h ? "100%" : "0%", background: C.accent, transition: `width .5s ${EASE_CSS}` }} />
    </a>
  );
}

function CTA({ href, children, filled = false, big = false }: { href: string; children: React.ReactNode; filled?: boolean; big?: boolean }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        fontFamily: SANS,
        fontSize: big ? 15 : 14,
        fontWeight: 600,
        letterSpacing: "0.01em",
        padding: big ? "16px 32px" : "13px 24px",
        borderRadius: 3,
        textDecoration: "none",
        border: `1px solid ${filled ? "transparent" : C.border}`,
        background: filled ? (h ? C.accentDark : C.accent) : h ? C.bgCard : "transparent",
        color: filled ? C.bgDarkAlt : C.ink,
        transform: h ? "translateY(-2px)" : "none",
        boxShadow: h
          ? `0 18px 38px -20px rgba(0,0,0,0.9), 0 2px 0 0 ${filled ? "rgba(255,255,255,0.22)" : C.accent}`
          : "0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0)",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      {children}
      <ArrowRight size={15} style={{ transform: h ? "translateX(5px)" : "none", transition: `transform .5s ${EASE_CSS}` }} />
    </a>
  );
}

/** Une tuile du bento : le fond dépend du ton, jamais d'un hex écrit sur place. */
function tuileFond(ton: string) {
  if (ton === "accent") return { background: C.accentLight, color: C.ink, border: `1px solid ${C.border}` };
  if (ton === "acier") return { background: C.acier, color: C.ink, border: `1px solid ${C.border}` };
  return { background: C.bgCard, color: C.ink, border: `1px solid ${C.border}` };
}

/** Une colonne filetée du catalogue de programmes. */
function ProgrammeCol({ s, idx }: { s: any; idx: number }) {
  const [h, setH] = useState(false);
  const Icon = s.icon ?? Shield;
  return (
    <Reveal delay={Math.min(idx, 5) * 0.055}>
      <article
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          position: "relative",
          height: "100%",
          padding: "clamp(24px,2.6vw,34px) clamp(18px,2vw,26px)",
          borderTop: `1px solid ${h ? C.accent : C.border}`,
          background: h ? C.bgCard : "transparent",
          transform: h ? "translateY(-4px)" : "none",
          boxShadow: h ? "0 30px 60px -44px rgba(0,0,0,0.95), 0 1px 0 0 rgba(91,127,212,0.35)" : "0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0)",
          transition: `all .5s ${EASE_CSS}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20 }}>
          <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 500, letterSpacing: "0.24em", color: h ? C.accent : C.textFaint, transition: `color .5s ${EASE_CSS}` }}>
            {String(idx + 1).padStart(2, "0")}
          </span>
          <Icon size={18} color={h ? C.accent : C.textFaint} style={{ transition: `color .5s ${EASE_CSS}` }} />
        </div>
        <div style={{ fontFamily: SANS, fontSize: 10, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: C.accentDark, marginBottom: 10 }}>{s.tag}</div>
        <h3 style={{ fontFamily: SERIF, fontSize: "clamp(20px,2.1vw,26px)", fontWeight: 400, color: C.ink, lineHeight: 1.14, letterSpacing: "-0.012em", margin: "0 0 12px" }}>{s.titre}</h3>
        <p style={{ fontFamily: SANS, fontSize: 14.5, color: C.textMuted, lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
      </article>
    </Reveal>
  );
}

/** Une bande d'honoraires : le prix tient la droite, la bande s'éclaire. */
function TarifBande({ t, idx }: { t: any; idx: number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={idx * 0.05}>
      <div
        className="i338-bande"
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) auto",
          gap: "clamp(14px,3vw,44px)",
          alignItems: "center",
          padding: "clamp(22px,2.4vw,32px) clamp(16px,2.4vw,30px)",
          background: h ? C.bgCard : idx % 2 === 0 ? C.bgAlt : "transparent",
          borderLeft: `2px solid ${h ? C.accent : "transparent"}`,
          borderBottom: `1px solid ${C.border}`,
          transform: h ? "translateX(4px)" : "none",
          boxShadow: h ? "0 26px 50px -42px rgba(0,0,0,0.95), 0 1px 0 0 rgba(91,127,212,0.3)" : "0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0)",
          transition: `all .5s ${EASE_CSS}`,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: SERIF, fontSize: "clamp(19px,2vw,24px)", fontWeight: 400, color: C.ink, letterSpacing: "-0.012em" }}>{t.a}</div>
          <div style={{ fontFamily: SANS, fontSize: 13.5, color: C.textMuted, lineHeight: 1.7, marginTop: 8, maxWidth: 560 }}>{t.n}</div>
        </div>
        <div style={{ fontFamily: SANS, fontSize: "clamp(14px,1.5vw,16px)", fontWeight: 600, letterSpacing: "0.02em", color: C.accentDark, whiteSpace: "nowrap", textAlign: "right" }}>{t.p}</div>
      </div>
    </Reveal>
  );
}

/** Un avis, en colonne filetée : pas de carte, un filet vertical et du vide. */
function AvisCol({ a, idx, total }: { a: any; idx: number; total: number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={idx * 0.09}>
      <article
        className="i338-avis"
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          height: "100%",
          padding: "clamp(6px,1vw,10px) clamp(18px,2.4vw,32px)",
          borderLeft: `1px solid ${h ? C.accent : C.border}`,
          transform: h ? "translateY(-4px)" : "none",
          transition: `all .5s ${EASE_CSS}`,
          opacity: h ? 1 : 0.94,
        }}
      >
        <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
          {[...Array(5)].map((_, j) => (
            <Star key={j} size={12} fill={C.accentDark} color={C.accentDark} />
          ))}
        </div>
        <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(16px,1.7vw,19px)", color: C.ink, lineHeight: 1.62, margin: "0 0 24px", opacity: 0.9 }}>« {a.texte} »</p>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 13.5, color: C.ink }}>{a.auteur}</div>
        <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: C.accentDark, marginTop: 7 }}>{a.detail}</div>
        <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.18em", color: C.textFaint, marginTop: 18 }}>
          {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
      </article>
    </Reveal>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════════════════ */
export default function BorealCourtagePage() {
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
  /* La méthode du client remplace les étapes de la démonstration. */
  METHODE = resolveList(
    fusionnerEtapes(METHODE_SOURCE, clientMethode(sessionData)),
    METHODE_SOURCE,
  );
  brand = fd?.brandColor ?? null;
  if (brand) {
    C = { ...C, accent: brand };
  }

  /* ── Listes ────────────────────────────────────────────────────────────── */
  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...SERVICES_SOURCE[i % SERVICES_SOURCE.length],
      titre: s.title ?? SERVICES_SOURCE[i % SERVICES_SOURCE.length].titre,
      desc: s.description ?? s.desc ?? SERVICES_SOURCE[i % SERVICES_SOURCE.length].desc,
    })),
    SERVICES_SOURCE,
  );
  const SERVICES = SERVICES_DEMO;

  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      ...AVIS_SOURCE[i % AVIS_SOURCE.length],
      texte: r.text ?? AVIS_SOURCE[i % AVIS_SOURCE.length].texte,
      auteur: r.author ?? r.name ?? AVIS_SOURCE[i % AVIS_SOURCE.length].auteur,
      detail: r.source ?? r.location ?? r.role ?? AVIS_SOURCE[i % AVIS_SOURCE.length].detail,
    })),
    AVIS_SOURCE,
  );
  const AVIS = AVIS_DEMO;

  TARIFS = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...TARIFS_SOURCE[i % TARIFS_SOURCE.length],
      a: s.title ?? TARIFS_SOURCE[i % TARIFS_SOURCE.length].a,
      p: s.price ?? TARIFS_SOURCE[i % TARIFS_SOURCE.length].p,
      n: s.description ?? s.desc ?? TARIFS_SOURCE[i % TARIFS_SOURCE.length].n,
    })),
    TARIFS_SOURCE,
  );
  STATS = resolveList(clientStats(sessionData), STATS_SOURCE);
  ENGAGEMENT = resolveList(clientList(sessionData, "engagements.liste") ?? clientCertifications(sessionData), ENGAGEMENT_SOURCE);

  const HERO = HERO_SOURCE;
  const ZONES = clientAreas(sessionData) ?? [];

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Un seul index pilote toute la grille : tuiles de risque, chiffres, scène.
  const { i, next, prev } = useSlides(HERO.length, DWELL.slow);
  const S = HERO[i];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  /* ── Contact ───────────────────────────────────────────────────────────── */
  const phone = clientPhone(sessionData) ?? fd?.phone ?? "04 78 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33478000000").replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "risques@boreal-courtage.fr";
  const maison = fd?.businessName ?? clientName(sessionData) ?? "Boréal Courtage";
  const ville = clientCity(sessionData) ?? "Lyon";
  const metier = clientTrade(sessionData) ?? "Risques d'entreprise";

  /* ── La grille du héros ────────────────────────────────────────────────── */
  /*
    Dix tuiles inégales, chacune portant son placement : l'élément animé DOIT
    être l'élément de grille, sinon la mise en page retombe en flux auto et le
    bento s'effondre. L'ordre du tableau est l'ordre de la cascade.
  */
  const titreHero = (
    <>
      {/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ?? (
        <>
          {c?.heroHeadline ?? (
            <>
              {clientHeroLine(sessionData, 0, 2, 20) ?? "Votre activité continue,"}
              <br />
              <em style={{ fontStyle: "italic", color: C.accentDark }}>{clientHeroLine(sessionData, 1, 2, 20) ?? "quoi qu'il arrive."}</em>
            </>
          )}
        </>
      )}
    </>
  );

  const photoFlotte = photo(1, "");

  /*
    Le bento réserve quatre emplacements aux chiffres. Un client qui n'en a
    saisi qu'un laissait trois cases vides au milieu de la grille : on complète
    avec ceux du thème plutôt que de trouer la composition — la règle du
    catalogue, on garde la section et on la rappelle au client.
  */
  const STATS_BENTO = STATS.length >= 4 ? STATS : [...STATS, ...STATS_SOURCE].slice(0, 4);

  /*
    La tuile de titre ne cascade PAS : elle est posée dans la grille, hors du
    geste. Deux raisons, l'une de lecture, l'autre d'usage — le titre qui se
    redessine toutes les 5,6 s se lit comme un rechargement, et un bouton
    d'appel démonté une seconde sur six perd le clic qu'on lui destinait. Le
    reste de la grille se vide et se remplit : c'est là que le geste vit.
  */
  const tiles = [
    {
      area: { gridColumn: "4 / span 1", gridRow: "1 / span 1" },
      node: (
        <div style={{ ...tuileFond("accent"), borderRadius: 3, padding: "clamp(18px,2vw,24px)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 14 }}>
          <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.26em", textTransform: "uppercase", color: C.accentDark }}>Famille de risques</div>
          <div>
            <div style={{ fontFamily: SERIF, fontSize: "clamp(22px,2.3vw,29px)", color: C.ink, lineHeight: 1.06, letterSpacing: "-0.015em" }}>{S.k}</div>
            <div style={{ fontFamily: SANS, fontSize: 13, color: C.textMuted, lineHeight: 1.6, marginTop: 8 }}>{S.sub}</div>
          </div>
        </div>
      ),
    },
    {
      area: { gridColumn: "4 / span 1", gridRow: "2 / span 1" },
      node: (
        <div style={{ ...tuileFond("acier"), borderRadius: 3, padding: "clamp(18px,2vw,24px)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
          <div style={{ fontFamily: SERIF, fontSize: "clamp(34px,3.6vw,48px)", color: C.accentDark, lineHeight: 0.95, letterSpacing: "-0.03em" }}>{STATS_BENTO[0]?.value}</div>
          <div style={{ fontFamily: SANS, fontSize: 12, color: C.textMuted, lineHeight: 1.5, letterSpacing: "0.03em" }}>{STATS_BENTO[0]?.label}</div>
        </div>
      ),
    },
    ...S.tiles.map(({ icon: Icon, t: titre, d, ton }, n: number) => ({
      area: n === 0 ? { gridColumn: "1 / span 2", gridRow: "3 / span 1" } : { gridColumn: `${n + 2} / span 1`, gridRow: "3 / span 1" },
      node: (
        <div style={{ ...tuileFond(ton), borderRadius: 3, padding: "clamp(18px,2vw,24px)", height: "100%", display: "flex", gap: 14, alignItems: "flex-start" }}>
          <Icon size={20} color={C.accentDark} style={{ flexShrink: 0, marginTop: 3 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 15, marginBottom: 6, color: C.ink }}>{titre}</div>
            <div style={{ fontFamily: SANS, fontSize: 13.5, lineHeight: 1.62, color: C.textMuted }}>{d}</div>
          </div>
        </div>
      ),
    })),
    ...STATS_BENTO.slice(1, 4).map((s: any, n: number) => ({
      area: { gridColumn: `${n + 1} / span 1`, gridRow: "4 / span 1" },
      node: (
        <div style={{ ...tuileFond(n === 1 ? "accent" : "sombre"), borderRadius: 3, padding: "clamp(16px,1.8vw,22px)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 6 }}>
          <div style={{ fontFamily: SERIF, fontSize: "clamp(24px,2.6vw,34px)", color: C.ink, lineHeight: 1, letterSpacing: "-0.025em" }}>{s.value}</div>
          <div style={{ fontFamily: SANS, fontSize: 11.5, color: C.textFaint, lineHeight: 1.5 }}>{s.label}</div>
        </div>
      ),
    })),
    {
      area: { gridColumn: "4 / span 1", gridRow: "4 / span 1" },
      node: (
        <div
          style={{
            ...tuileFond("acier"),
            borderRadius: 3,
            height: "100%",
            minHeight: 96,
            overflow: "hidden",
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          {photoFlotte ? (
            <img src={photoFlotte} alt="Flotte de véhicules d'entreprise" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: 0.85 }} />
          ) : (
            /* Repli sans image : la trame d'un marquage au sol, en CSS. */
            <span
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `repeating-linear-gradient(90deg, ${C.border} 0px, ${C.border} 2px, transparent 2px, transparent 22px)`,
                opacity: 0.9,
              }}
            />
          )}
          <span
            style={{
              position: "relative",
              zIndex: 1,
              fontFamily: SANS,
              fontSize: 10,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: C.ink,
              padding: "12px 14px",
              background: "linear-gradient(0deg, rgba(5,9,18,0.9) 0%, rgba(5,9,18,0.0) 100%)",
              width: "100%",
            }}
          >
            Flottes suivies
          </span>
        </div>
      ),
    },
  ];

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip" }}>
      <style>{`
        ${FONTS_CSS}

        @media (max-width: 980px) { #i338-nav { display: none !important; } .i338-burger { display: flex !important; } }

        /* Bento : sous 900px, les placements inline de chaque tuile doivent
           céder. Les tuiles animées ne sont pas des enfants directs de la
           grille — leur conteneur est en display:contents — d'où les deux
           sélecteurs : on les remet toutes en flux plutôt que d'éditer dix
           placements un par un. */
        @media (max-width: 900px) {
          .i338-bento { grid-template-columns: minmax(0,1fr) !important; grid-auto-rows: auto !important; }
          .i338-bento > div,
          .i338-cascade > div { grid-column: auto !important; grid-row: auto !important; min-height: 104px; }
        }
        @media (max-width: 860px) {
          .i338-split { grid-template-columns: minmax(0,1fr) !important; gap: 34px !important; }
          .i338-methode { grid-template-columns: repeat(auto-fit, minmax(min(220px,100%),1fr)) !important; }
          .i338-avisgrid { grid-template-columns: minmax(0,1fr) !important; }
          .i338-avis { border-left: none !important; border-top: 1px solid ${C.border} !important; padding-top: 26px !important; padding-left: 0 !important; }
          .i338-contact { grid-template-columns: minmax(0,1fr) !important; }
          /* Le rail collant redevient statique au point de rupture. */
          .i338-sticky { position: static !important; }
        }
        @media (max-width: 640px) {
          .i338-bande { grid-template-columns: minmax(0,1fr) !important; }
          .i338-bande > div:last-child { text-align: left !important; }
        }

        /* La dérive lente du halo : le vide de mi-cascade doit respirer, pas
           ressembler à une page qui n'a pas fini de charger. */
        @keyframes i338-derive {
          0%   { transform: translate3d(0, 0, 0) scale(1); }
          50%  { transform: translate3d(3%, 3%, 0) scale(1.08); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }
        .i338-derive { animation: i338-derive 30s ${EASE_CSS} infinite; }

        @media (prefers-reduced-motion: reduce) {
          .i338-derive { animation: none !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
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
          gap: 16,
          padding: scrolled ? "12px clamp(20px,4vw,56px)" : "22px clamp(20px,4vw,56px)",
          background: scrolled ? "rgba(11,18,32,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          transition: `all .55s ${EASE_CSS}`,
        }}
      >
        <a href="#hero" style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, textDecoration: "none" }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={maison} style={{ height: 30, maxWidth: 170, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Shield size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: SERIF, fontSize: 19, color: C.ink, letterSpacing: "-0.015em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{maison}</span>
              <span style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textFaint, marginLeft: 8 }} className="i338-tag">
                Risques d'entreprise
              </span>
            </>
          )}
        </a>
        <div id="i338-nav" style={{ display: "flex", gap: "clamp(18px,2.2vw,30px)", alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <NavLink key={l} label={l} href={h} />
          ))}
          <CTA href={telHref} filled>
            Prendre rendez-vous
          </CTA>
        </div>
        <button
          className="i338-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: `transform .35s ${EASE_CSS}`, transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "opacity .3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: `transform .35s ${EASE_CSS}`, transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 99, background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "18px clamp(20px,5vw,32px) 26px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ fontFamily: SANS, color: C.ink, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "12px 0" }}>
              {l}
            </a>
          ))}
          <a href={telHref} style={{ fontFamily: SANS, background: C.accent, color: C.bgDarkAlt, borderRadius: 3, padding: "14px 22px", fontSize: 15, fontWeight: 600, textDecoration: "none", textAlign: "center", marginTop: 10 }}>
            Prendre rendez-vous
          </a>
        </div>
      )}

      {/* ══ HERO — H8 bento : dix tuiles inégales, une seule cascade ══════ */}
      <section
        id="hero"
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(112px,12vw,150px) clamp(16px,4vw,56px) clamp(48px,6vw,80px)",
          background: C.bgDark,
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          className="i338-derive"
          style={{
            position: "absolute",
            top: "-14%",
            left: "12%",
            width: "min(84vw, 900px)",
            height: "min(84vw, 900px)",
            background: "radial-gradient(circle at 50% 50%, rgba(91,127,212,0.12) 0%, rgba(91,127,212,0.04) 40%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        {/* Chiffre fantôme : le nombre d'assureurs consultés, en fond. */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            right: "clamp(-24px,-1vw,0px)",
            bottom: "2%",
            fontFamily: SERIF,
            fontSize: "clamp(140px,22vw,320px)",
            lineHeight: 0.78,
            color: C.accent,
            opacity: 0.06,
            pointerEvents: "none",
            userSelect: "none",
            letterSpacing: "-0.05em",
          }}
        >
          15
        </span>

        <div style={{ position: "relative", width: "100%", maxWidth: 1320, margin: "0 auto" }}>
          {/*
            La grille appartient à la page, pas au geste : le conteneur du
            BentoCascade est en `display: contents`, si bien que ses tuiles
            animées deviennent des éléments de CETTE grille. C'est la seule
            façon d'avoir une tuile fixe (le titre) et neuf tuiles qui
            cascadent dans une seule et même grille — un placement porté par
            un wrapper non placé renvoie tout le bento en flux automatique.
          */}
          <div
            className="i338-bento"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0,1fr))",
              gridAutoRows: "minmax(104px, auto)",
              gap: "clamp(8px,1vw,14px)",
            }}
          >
            <div
              style={{
                ...tuileFond("sombre"),
                gridColumn: "1 / span 3",
                gridRow: "1 / span 2",
                borderRadius: 3,
                padding: "clamp(24px,3vw,40px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 18,
              }}
            >
              <Kicker>{clientEyebrow(sessionData) ?? `${metier} · ${ville}`}</Kicker>
              <h1 style={{ fontFamily: SERIF, fontSize: "clamp(34px,5vw,68px)", fontWeight: 400, color: C.ink, lineHeight: 0.99, letterSpacing: "-0.026em", margin: 0 }}>{titreHero}</h1>
              <p style={{ fontFamily: SANS, fontSize: "clamp(14.5px,1.4vw,16.5px)", color: C.textMuted, lineHeight: 1.74, maxWidth: 480, margin: 0 }}>
                {clientHeroPrestations(sessionData) ??
                  c?.heroSubline ??
                  "Courtage spécialisé PME et ETI : multirisque, flottes, cyber, RC dirigeants. Nous cartographions vos risques, négocions en place de marché et gérons vos sinistres."}
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
                <CTA href={telHref} filled>
                  Cartographier nos risques
                </CTA>
                <CTA href="#services">Nos programmes</CTA>
              </div>
            </div>
            <BentoCascade index={i} tiles={tiles} className="i338-cascade" style={{ display: "contents" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: "clamp(20px,2.4vw,32px)", flexWrap: "wrap" }}>
            <SlideIndex i={i} total={HERO.length} variant="fraction" color={C.textFaint} className="" />
            <span style={{ fontFamily: SANS, fontSize: 13, color: C.textMuted }}>
              <strong style={{ color: C.ink, fontWeight: 600 }}>{S.k}</strong> — {S.sub}
            </span>
            <HairlineArrows onPrev={prev} onNext={next} color={C.ink} className="" />
          </div>
        </div>
      </section>

      {/* ══ RESPIRATION ═══════════════════════════════════════════════════ */}
      <section style={{ background: C.bg, padding: "clamp(76px,10vw,142px) clamp(24px,8vw,140px)", textAlign: "center" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
            <Kicker color={C.textFaint} align="center">
              Le métier
            </Kicker>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(22px,3.2vw,44px)", lineHeight: 1.34, fontWeight: 400, maxWidth: 960, margin: "0 auto", color: C.ink, letterSpacing: "-0.012em" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (
              <>Une entreprise ne meurt pas du sinistre : elle meurt du trou qu'on n'avait pas vu dans le programme.</>
            )}
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div style={{ width: 1, height: 86, background: `linear-gradient(${C.accent}, transparent)`, margin: "clamp(34px,4vw,54px) auto 0" }} />
        </Reveal>
      </section>

      {/* ══ PROGRAMMES — colonnes filetées ═══════════════════════════════ */}
      <section id="services" style={{ background: C.bgAlt, padding: "clamp(72px,9vw,126px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(30px,3.6vw,48px)", maxWidth: 760 }}>
              <Kicker>Programmes</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,4.2vw,54px)", fontWeight: 400, color: C.ink, marginTop: 18, lineHeight: 1.06, letterSpacing: "-0.026em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                  <>
                    Assurer l'entreprise
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accentDark }}>comme un programme, pas en pièces.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 15.5, color: C.textMuted, lineHeight: 1.76, maxWidth: 540, marginTop: 18 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "services.texte") ?? (
                  <>Six chantiers, un seul échéancier. Chaque colonne est un poste du programme — et chacune se négocie séparément en place de marché.</>
                )}
              </p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px,100%), 1fr))", gap: "clamp(4px,0.8vw,10px)" }}>
            {SERVICES.map((s: any, idx: number) => (
              <ProgrammeCol key={`${s.titre}-${idx}`} s={s} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ MÉTHODE — quatre tuiles reliées par un filet ══════════════════ */}
      <section id="methode" style={{ background: C.bg, padding: "clamp(72px,9vw,126px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(30px,3.6vw,48px)", maxWidth: 700 }}>
              <Kicker>La méthode</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,4.2vw,54px)", fontWeight: 400, color: C.ink, marginTop: 18, lineHeight: 1.06, letterSpacing: "-0.026em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                  <>
                    Place de marché,
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accentDark }}>pas catalogue maison.</em>
                  </>
                )}
              </h2>
            </div>
          </Reveal>
          <div style={{ position: "relative" }}>
            {/* Le filet qui relie les quatre temps : dégradé 1 px, pas une barre. */}
            <div aria-hidden style={{ position: "absolute", left: 0, right: 0, top: 26, height: 1, background: `linear-gradient(90deg, ${C.accent}, rgba(91,127,212,0.12) 70%, transparent)`, pointerEvents: "none" }} />
            <div className="i338-methode" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px,100%), 1fr))", gap: "clamp(12px,1.6vw,20px)" }}>
              {METHODE.map((m, idx) => (
                <Reveal key={m.n} delay={idx * 0.07}>
                  <div style={{ position: "relative", height: "100%", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 3, padding: "clamp(22px,2.4vw,30px)" }}>
                    <span aria-hidden style={{ position: "absolute", top: -5, left: "clamp(22px,2.4vw,30px)", width: 9, height: 9, borderRadius: "50%", background: C.accent, boxShadow: `0 0 0 4px ${C.bg}` }} />
                    <div style={{ fontFamily: SERIF, fontSize: "clamp(30px,3vw,40px)", color: C.accentDark, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 16, marginTop: 6 }}>{m.n}</div>
                    <h3 style={{ fontFamily: SANS, fontSize: 16, fontWeight: 600, color: C.ink, marginBottom: 10, letterSpacing: "0.005em" }}>{m.t}</h3>
                    <p style={{ fontFamily: SANS, fontSize: 14, color: C.textMuted, lineHeight: 1.72, margin: 0 }}>{m.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ ENGAGEMENTS — split réglementaire ════════════════════════════ */}
      <section id="engagements" style={{ background: C.bgAlt, padding: "clamp(72px,9vw,126px) clamp(20px,5vw,64px)" }}>
        <div
          className="i338-split"
          style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1.02fr) minmax(0,0.98fr)", gap: "clamp(28px,5vw,72px)", alignItems: "center" }}
        >
          <Reveal delay={0.1}>
            <div>
              <Kicker>Nos engagements</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px,3.6vw,46px)", fontWeight: 400, color: C.ink, margin: "18px 0 26px", lineHeight: 1.08, letterSpacing: "-0.024em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>
                    Réglementés,
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accentDark }}>et redevables.</em>
                  </>
                )}
              </h2>
              {ENGAGEMENT.map((e: string, idx: number) => (
                <div key={idx} style={{ display: "flex", gap: 13, marginBottom: 16, paddingBottom: 16, borderBottom: idx < ENGAGEMENT.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <CheckCircle size={17} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontFamily: SANS, fontSize: 15, color: C.textMuted, lineHeight: 1.7 }}>{e}</span>
                </div>
              ))}
              <div style={{ marginTop: 26 }}>
                <CTA href={telHref} filled>
                  Nous appeler
                </CTA>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div style={{ position: "relative" }}>
              <div style={{ borderRadius: 3, border: `1px solid ${C.border}`, background: C.bgCard, aspectRatio: "4/3", overflow: "hidden" }}>
                <img
                  src={photo(0, "https://images.pexels.com/photos/8439695/pexels-photo-8439695.jpeg?auto=compress&cs=tinysrgb&w=1400")}
                  alt="Poignée de main en fin de rendez-vous"
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: "clamp(-14px,-1vw,0px)",
                  bottom: "clamp(-18px,-1.4vw,0px)",
                  background: C.bgDarkAlt,
                  border: `1px solid ${C.border}`,
                  borderRadius: 3,
                  padding: "16px 20px",
                  maxWidth: 250,
                  boxShadow: "0 34px 60px -44px rgba(0,0,0,0.95)",
                }}
              >
                <div style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.26em", textTransform: "uppercase", color: C.accentDark }}>Immatriculation</div>
                <div style={{ fontFamily: SERIF, fontSize: 19, color: C.ink, marginTop: 6, letterSpacing: "-0.012em" }}>ORIAS n° 26 007 833</div>
                <div style={{ fontFamily: SANS, fontSize: 12, color: C.textFaint, marginTop: 6, lineHeight: 1.5 }}>ACPR · RC professionnelle courtage</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ HONORAIRES — bandes ══════════════════════════════════════════ */}
      <section id="tarifs" style={{ background: C.bg, padding: "clamp(72px,9vw,126px) clamp(20px,5vw,64px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(26px,3vw,42px)", maxWidth: 640 }}>
              <Kicker>Honoraires</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,4vw,50px)", fontWeight: 400, color: C.ink, marginTop: 18, lineHeight: 1.06, letterSpacing: "-0.026em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                  <>
                    Une rémunération <em style={{ fontStyle: "italic", color: C.accentDark }}>écrite d'avance.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 15, color: C.textMuted, maxWidth: 560, marginTop: 16, lineHeight: 1.74 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.texte") ?? (
                  <>Selon les comptes : commissions de place affichées, ou honoraires de conseil au forfait — jamais les deux sans le dire.</>
                )}
              </p>
            </div>
          </Reveal>
          <div style={{ borderTop: `1px solid ${C.border}` }}>
            {TARIFS.map((t: any, idx: number) => (
              <TarifBande key={`${t.a}-${idx}`} t={t} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ AVIS — colonnes filetées ═════════════════════════════════════ */}
      <section style={{ position: "relative", background: C.bgDark, padding: "clamp(76px,9vw,130px) clamp(20px,5vw,64px)", overflow: "hidden" }}>
        <div
          aria-hidden
          className="i338-derive"
          style={{
            position: "absolute",
            right: "-12%",
            top: "-18%",
            width: "min(80vw, 780px)",
            height: "min(80vw, 780px)",
            background: "radial-gradient(circle at 50% 50%, rgba(91,127,212,0.10) 0%, transparent 68%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(32px,3.6vw,52px)", maxWidth: 700 }}>
              <Kicker color={C.accentDark}>Comptes suivis</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px,3.8vw,48px)", fontWeight: 400, color: C.ink, marginTop: 18, lineHeight: 1.06, letterSpacing: "-0.024em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                  <>
                    Des risques <em style={{ fontStyle: "italic", color: C.accentDark }}>pilotés</em>.
                  </>
                )}
              </h2>
            </div>
          </Reveal>
          <div className="i338-avisgrid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px,100%), 1fr))", gap: "clamp(14px,2vw,10px)", alignItems: "stretch" }}>
            {AVIS.map((a: any, idx: number) => (
              <AvisCol key={`${a.auteur}-${idx}`} a={a} idx={idx} total={AVIS.length} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTACT ═══════════════════════════════════════════════════════ */}
      <section id="contact" style={{ background: C.bgAlt, padding: "clamp(72px,9vw,130px) clamp(20px,5vw,64px)" }}>
        <div className="i338-contact" style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1.04fr) minmax(0,0.96fr)", gap: "clamp(28px,5vw,72px)", alignItems: "center" }}>
          <Reveal>
            <div>
              <Kicker>Premier échange</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,4.2vw,54px)", fontWeight: 400, color: C.ink, margin: "18px 0 18px", lineHeight: 1.06, letterSpacing: "-0.026em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                  <>
                    Une heure pour cartographier
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accentDark }}>ce qui menace vraiment.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 16, color: C.textMuted, maxWidth: 480, lineHeight: 1.76, marginBottom: 30 }}>
                {clientTagline(sessionData) ?? "Rendez-vous sur site ou en visio. Lettre de mission écrite avant toute chose."}
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <CTA href={telHref} filled big>
                  <Phone size={17} /> {phone}
                </CTA>
                <CTA href={`mailto:${mail}`} big>
                  <Mail size={17} /> Nous écrire
                </CTA>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div
              className="i338-sticky"
              style={{ position: "sticky", top: 110, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 3, padding: "clamp(24px,2.6vw,34px)", boxShadow: "0 44px 80px -66px rgba(0,0,0,0.95)" }}
            >
              <Kicker color={C.textFaint}>Le cabinet</Kicker>
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <MapPin size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontFamily: SANS, fontSize: 14.5, color: C.textMuted, lineHeight: 1.65 }}>{clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "69003", "Lyon")}</span>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Phone size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <a href={telHref} style={{ fontFamily: SANS, fontSize: 14.5, color: C.ink, textDecoration: "none" }}>
                    {phone}
                  </a>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Mail size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <a href={`mailto:${mail}`} style={{ fontFamily: SANS, fontSize: 14.5, color: C.ink, textDecoration: "none", wordBreak: "break-word" }}>
                    {mail}
                  </a>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Clock size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontFamily: SANS, fontSize: 14.5, color: C.textMuted, lineHeight: 1.65 }}>Lun–Ven 8h30–19h</span>
                </div>
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 22, paddingTop: 18 }}>
                <p style={{ fontFamily: SANS, fontSize: 13.5, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>
                  {ZONES.length >= 2 ? `Comptes suivis à ${ZONES.slice(0, 6).join(", ")}.` : `Comptes suivis depuis ${ville}, sur l'ensemble des sites de l'entreprise.`}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ PIED ══════════════════════════════════════════════════════════ */}
      <footer style={{ background: C.bgDarkAlt, padding: "clamp(44px,5vw,64px) clamp(20px,5vw,64px) 26px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 34 }}>
            <div style={{ maxWidth: 380 }}>
              <div style={{ fontFamily: SERIF, fontSize: 22, color: C.accentDark, marginBottom: 10, letterSpacing: "-0.015em" }}>{maison}</div>
              <p style={{ fontFamily: SANS, color: C.textFaint, fontSize: 13, lineHeight: 1.75, margin: 0 }}>
                Courtage d'assurances pour l'entreprise · {ville}
                <br />
                ORIAS n° 26 007 833 — ACPR · RC professionnelle courtage
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <MapPin size={13} />, t: clientAddress(sessionData) ?? `${ville}, Rhône` },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Mail size={13} />, t: mail },
                { icon: <Clock size={13} />, t: "Lun–Ven 8h30–19h" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: C.textFaint, fontFamily: SANS, fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.accentDark, display: "flex" }}>{item.icon}</span>
                  {item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontFamily: SANS, color: "rgba(255,255,255,0.28)", fontSize: 12 }}>
              © 2026 {maison} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
              {/* VILLE_PIED */}
              {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ fontFamily: SANS, color: "rgba(255,255,255,0.28)", fontSize: 12 }}>
              Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
