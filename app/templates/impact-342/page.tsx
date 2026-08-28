"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Car, Check, Clock, Mail, MapPin, Phone, Zap } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, useSlides } from "@/lib/templates/hero-kit-2";
import { CrossPush } from "@/lib/templates/hero-kit-3";
import { ActionMobile } from "@/lib/templates/ActionMobile";
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
  clientTagline,
  clientText,
  clientTrade,
} from "@/lib/templates/clientContent";

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
let fd: any = null;
let c: any = null;
let bp: any = null;
// La session complète, pour lib/templates/clientContent : même portée
// que fd/c/bp, pour les sous-composants qui n'ont pas de props.
let sessionData: any = null;
let brand: any = null;

/* ════════════════════════════════════════════════════════════════════════════
   PERMIS CAP SUD — auto-école urbaine · Montpellier

   Archétype héros H3 : plein cadre, titre en bas. Paire de fontes P6 (Archivo
   / Inter — la voix impact, sans serif, deux graisses et deux rôles opposés :
   Archivo en capitales serrées pour les titres, Inter en corps de texte).
   Palette nuit #101216, accent brique #e35b3f.

   Geste signature : CrossPush (hero-kit-3), qui REMPLACE le HardCutRebuild de
   la version précédente — deux plans qui se croisent, la sortante glisse à
   gauche pendant que l'entrante arrive par la droite. C'est la circulation
   elle-même : deux voies qui se croisent en ville, de nuit.

   Fond de repli obligatoire : la section plein cadre est peinte sur `C.bgDark`
   avec une texture de circulation nocturne en CSS (traînées lumineuses en
   dégradés, marquage au sol). Images bloquées, le héros tient tout seul.
   ════════════════════════════════════════════════════════════════════════════ */

const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,600;0,800;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap');`;

const DISPLAY = "'Archivo', system-ui, 'Segoe UI', sans-serif";
const SANS = "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";

/* Un seul easing pour tout le thème, répété littéralement en CSS plus bas. */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

let C: Record<string, string> = {
  bg: "#101216",
  bgAlt: "#171a20",
  bgCard: "#191d24",
  bgDark: "#0a0c0f",
  bgDarkAlt: "#06080a",
  accent: "var(--brand,#e35b3f)",
  accentDark: "var(--brand-light,#f08163)",
  accentLight: "#2a1a16",
  ink: "#f4f2ef",
  textMuted: "#9aa1ad",
  textFaint: "#6b7280",
  border: "rgba(255,255,255,0.10)",
  white: "#ffffff",
  /* clé métier : le bleu des phares croisés, pour la texture de nuit. */
  nuit: "#2b3a4d",
};

const NAV = [
  { l: "Formations", h: "#services" },
  { l: "Comment ça marche", h: "#methode" },
  { l: "Formules", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

const HERO_SOURCE = [
  {
    k: "Permis B",
    line: "TU CALES ? ON REPART.",
    sub: "La boîte manuelle apprise sans drame, en créneaux qui collent à tes cours ou ton taf.",
  },
  {
    k: "Code intensif",
    line: "LE CODE EN 3 SEMAINES.",
    sub: "Stage accéléré encadré par un moniteur, examen dans la foulée dans un centre partenaire.",
  },
  {
    k: "Permis boost",
    line: "18 H CHRONO, PRÊT.",
    sub: "Évaluation, plan d'heures serré, examens blancs filmés et débriefés.",
  },
];
let HERO = HERO_SOURCE;

/* La ville du client apparaît dans le stage « dernière ligne droite » : la
   fonction est rappelée dans le corps du rendu, jamais évaluée à l'import. */
function SERVICES_SOURCE_LIVE() {
  return [
    {
      titre: "Code accéléré",
      desc: "Stage de 3 jours + accès illimité à l'application. Séances de correction en direct avec moniteur, pas un écran qui débite.",
      tag: "Code",
    },
    {
      titre: "Permis B",
      desc: "Créneaux 7h-21h et le samedi. Moniteur référent, livret numérique, points bloquants traités au simulateur avant la voiture.",
      tag: "Conduite",
    },
    {
      titre: "Simulateur nouvelle génération",
      desc: "Premières heures et situations à risque (pluie, nuit, autoroute) travaillées au simulateur — comptabilisées dans le forfait, deux fois moins chères.",
      tag: "Simu",
    },
    {
      titre: "Conduite supervisée",
      desc: "Après 18 ans : réduis le coût entre deux présentations en conduisant avec un proche, cadré par nous.",
      tag: "Supervisée",
    },
    {
      titre: "Stage dernière ligne droite",
      desc: "6 h sur les parcours d'examen de " + (clientCity(sessionData) ?? "Montpellier") + " la semaine du passage, examen blanc filmé et débriefé.",
      tag: "Examen",
    },
    {
      titre: "CPF & financements",
      desc: "Permis B éligible CPF, permis à 1 €/jour pour les 15-25 ans, mission locale acceptée. On monte le dossier avec toi.",
      tag: "Financement",
    },
  ];
}
let SERVICES_SOURCE = SERVICES_SOURCE_LIVE();
let SERVICES_DEMO = SERVICES_SOURCE;

/* Le bento : la première tuile occupe deux colonnes et deux rangs, les autres
   se rangent autour. Les tailles inégales sont la signature de la section. */
const BENTO = [
  { col: "span 2", row: "span 2" },
  { col: "span 1", row: "span 1" },
  { col: "span 1", row: "span 1" },
  { col: "span 1", row: "span 1" },
  { col: "span 1", row: "span 1" },
  { col: "span 2", row: "span 1" },
];

const METHODE = [
  { n: "01", t: "Éval de départ offerte", d: "45 min en voiture. Ton volume d'heures estimé est écrit au contrat — et on s'y tient." },
  { n: "02", t: "Résa en ligne 24h/24", d: "Tes créneaux depuis ton téléphone, annulation gratuite 48 h avant, liste d'attente automatique." },
  { n: "03", t: "Simulateur + voiture", d: "Le simulateur déblaye les bases et les situations à risque ; la voiture sert à progresser, pas à répéter." },
  { n: "04", t: "Examens blancs filmés", d: "Deux passages blancs filmés et débriefés image par image. Le jour J, tu l'as déjà vécu." },
];

const ENGAGEMENT_DEMO = [
  "Agrément préfectoral E 26 034 0118 0, moniteurs diplômés Titre Pro ECSR",
  "Taux de réussite affichés en vitrine et en ligne, mis à jour chaque trimestre",
  "Heure supplémentaire au prix du forfait, écrit au contrat",
  "Frais de transfert de dossier : 0 € — tu restes parce que ça marche, pas parce que c'est cher de partir",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

const TARIFS_DEMO = [
  {
    a: "Code intensif (3 jours + appli)",
    p: "330 €",
    n: "Jusqu'à réussite, examen en centre partenaire à 30 € en sus (tarif d'État).",
  },
  {
    a: "Forfait 20 h mixte simu/voiture",
    p: "1 290 €",
    n: "6 h simulateur + 14 h voiture, examens blancs filmés inclus.",
  },
  {
    a: "Forfait 20 h tout voiture",
    p: "1 450 €",
    n: "Créneaux soir et samedi sans supplément.",
  },
  {
    a: "Heure supplémentaire",
    p: "45 €",
    n: "Identique au tarif forfait, réservable à l'unité en ligne.",
  },
];
let TARIFS = TARIFS_DEMO;

const AVIS_SOURCE = [
  {
    texte:
      "Le simulateur m'a évité de griller 6 heures de voiture à apprendre l'embrayage. Permis en 4 mois en bossant à côté, créneaux du samedi nickel.",
    auteur: "Inès B., 22 ans",
    detail: "Forfait mixte",
  },
  {
    texte: "L'examen blanc filmé, ça pique — mais le jour J j'avais déjà corrigé mes deux défauts. Reçue, 29/31.",
    auteur: "Manon F., 19 ans",
    detail: "Stage dernière ligne droite",
  },
  {
    texte:
      "Code en 3 semaines en sortant du lycée, permis avant la fac. Résa en ligne à minuit depuis mon lit : c'est comme ça que ça devrait marcher partout.",
    auteur: "Adam R., 18 ans",
    detail: "Code intensif + B",
  },
];
let AVIS_DEMO = AVIS_SOURCE;

const STATS_DEMO = [
  { value: "75 %", label: "Réussite 1er passage" },
  { value: "7 j/7", label: "Réservation en ligne 24h/24" },
  { value: "3 sem.", label: "Pour le code en intensif" },
  { value: "4×", label: "Paiement sans frais" },
];
let STATS = STATS_DEMO;

/* Les mots de la bande filante viennent des tags des formations : rien
   d'inventé, le vocabulaire du thème remis en circulation. */
const VOIES_DEMO = SERVICES_SOURCE.map((s) => s.tag);
let VOIES = VOIES_DEMO;

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 28, style }: { children: React.ReactNode; delay?: number; y?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -8% 0px" });
  return (
    <motion.div ref={ref} style={style} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.95, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

/** Kicker : filet de 40 × 1 px puis capitales très espacées. */
function Kicker({ children, color = C.accent, align = "left" }: { children: React.ReactNode; color?: string; align?: "left" | "center" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: align === "center" ? "center" : "flex-start" }}>
      <span style={{ width: 40, height: 1, background: color, opacity: 0.8, flexShrink: 0 }} />
      <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, letterSpacing: "0.34em", textTransform: "uppercase", color }}>{children}</span>
      {align === "center" && <span style={{ width: 40, height: 1, background: color, opacity: 0.8, flexShrink: 0 }} />}
    </div>
  );
}

/** Chiffre fantôme : texture sans image, jamais cliquable. */
function Ghost({ children, right = false, top = -20, size = "clamp(130px, 24vw, 300px)", color = "rgba(255,255,255,0.045)" }: { children: React.ReactNode; right?: boolean; top?: number; size?: string; color?: string }) {
  return (
    <span aria-hidden style={{ position: "absolute", top, [right ? "right" : "left"]: -10, fontFamily: DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 0.8, color, pointerEvents: "none", userSelect: "none", zIndex: 0 }}>
      {children}
    </span>
  );
}

/**
 * Le fond de repli du plein cadre : une nuit de ville en CSS pur.
 *
 * Deux nappes de traînées lumineuses inclinées en sens contraire — c'est le
 * croisement, dessiné — posées sur `C.bgDark`, plus un marquage au sol en bas.
 * La section reste juste, et belle, images bloquées.
 */
function NuitDeVille() {
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, background: C.bgDark, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: "-20% -10%", transform: "rotate(-14deg)", backgroundImage: `repeating-linear-gradient(to bottom, rgba(227,91,63,0.16) 0 2px, transparent 2px 9px, rgba(227,91,63,0.06) 9px 10px, transparent 10px 64px)`, opacity: 0.75 }} />
      <div style={{ position: "absolute", inset: "-20% -10%", transform: "rotate(11deg)", backgroundImage: `repeating-linear-gradient(to bottom, rgba(43,58,77,0.55) 0 3px, transparent 3px 12px, rgba(43,58,77,0.25) 12px 13px, transparent 13px 78px)`, opacity: 0.8 }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(48% 40% at 72% 26%, rgba(227,91,63,0.12), transparent 70%), radial-gradient(46% 44% at 18% 68%, rgba(43,58,77,0.45), transparent 72%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 90, backgroundImage: "repeating-linear-gradient(to right, rgba(255,255,255,0.16) 0 46px, transparent 46px 96px)", backgroundSize: "100% 2px", backgroundPosition: "0 44px", backgroundRepeat: "no-repeat" }} />
    </div>
  );
}

/** Photo du client à cet emplacement, sinon le repli du thème. */
function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ════════════════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════════════════ */

export default function PermisCapSudPage() {
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
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  c = session?.generatedContent;
  bp = session?.businessProfile;
  sessionData = session;
  brand = fd?.brandColor ?? null;
  if (brand) {
    C = { ...C, accent: brand };
  }

  SERVICES_SOURCE = SERVICES_SOURCE_LIVE();

  /*
    Le titre du plein cadre est en capitales serrées : il ne tient qu'une
    trentaine de caractères par ligne, sur deux lignes. La première facette
    porte donc l'accroche du client, les deux autres restent des spécialités
    du métier.
  */
  const L1 = clientHeroLine(sessionData, 0, 2, 26);
  const L2 = clientHeroLine(sessionData, 1, 2, 26);
  const ACCROCHE = L1 ? [L1, L2].filter(Boolean).join(" ") : clientTagline(sessionData);
  HERO = ACCROCHE
    ? HERO_SOURCE.map((h, n) => (n === 0 ? { ...h, line: ACCROCHE.toUpperCase() } : h))
    : HERO_SOURCE;

  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, n: number) => ({ ...SERVICES_SOURCE[n % SERVICES_SOURCE.length], titre: s.title })),
    SERVICES_SOURCE,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, n: number) => ({ ...AVIS_SOURCE[n % AVIS_SOURCE.length], auteur: r.author, texte: r.text })),
    AVIS_SOURCE,
  );
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s: any, n: number) => ({ ...TARIFS_DEMO[n % TARIFS_DEMO.length], a: s.title, p: s.price ?? TARIFS_DEMO[n % TARIFS_DEMO.length].p, n: s.desc || s.description || TARIFS_DEMO[n % TARIFS_DEMO.length].n })),
    TARIFS_DEMO,
  );
  STATS = resolveList(clientStats(sessionData), STATS_DEMO);
  ENGAGEMENT = resolveList(clientCertifications(sessionData), ENGAGEMENT_DEMO);
  VOIES = clientList(sessionData, "voies.liste") ?? SERVICES_SOURCE.map((s) => s.tag);

  const SERVICES = resolveList(
    clientServices(sessionData)?.map((s: any, n: number) => ({
      titre: s.title ?? SERVICES_DEMO[n % SERVICES_DEMO.length].titre,
      desc: s.description ?? s.desc ?? SERVICES_DEMO[n % SERVICES_DEMO.length].desc,
      tag: SERVICES_DEMO[n % SERVICES_DEMO.length].tag,
    })),
    SERVICES_DEMO,
  );
  const AVIS = resolveList(
    clientReviews(sessionData)?.map((r: any, n: number) => ({
      texte: r.text ?? AVIS_DEMO[n % AVIS_DEMO.length].texte,
      auteur: r.name ?? r.author ?? AVIS_DEMO[n % AVIS_DEMO.length].auteur,
      detail: r.location ?? r.role ?? AVIS_DEMO[n % AVIS_DEMO.length].detail,
    })),
    AVIS_DEMO,
  );

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoverTuile, setHoverTuile] = useState<number | null>(null);
  const [hoverEtape, setHoverEtape] = useState<number | null>(null);
  const [hoverTarif, setHoverTarif] = useState<number | null>(null);
  const [avisIdx, setAvisIdx] = useState(0);

  /* Un seul index pilote tout le héros : les plans qui se croisent, le titre,
     le sur-titre et la légende. */
  const { i, go } = useSlides(HERO.length, DWELL.normal);
  const S = HERO[i];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = clientPhone(sessionData) ?? clientEmail(sessionData) ?? fd?.email ?? "04 67 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? clientEmail(sessionData) ?? fd?.email ?? "+33467000000").replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "go@permis-cap-sud.fr";
  const ville = clientCity(sessionData) ?? "Montpellier";
  const maison = fd?.businessName ?? clientName(sessionData) ?? "Permis Cap Sud";
  const metier = clientTrade(sessionData) ?? "Auto-école";
  const adresse = clientAddress(sessionData);

  /*
    Les plans du héros. L'emplacement 0 garde l'image du thème ; les suivants
    n'ont pas de repli — s'ils sont vides, le croisement se joue sur un seul
    plan et la nuit de ville CSS reste visible dessous.
  */
  const HERO_IMAGES = [
    photo(0, "https://images.pexels.com/photos/9518030/pexels-photo-9518030.jpeg?auto=compress&cs=tinysrgb&w=1400"),
    photo(1, ""),
    photo(2, ""),
  ].filter(Boolean);
  const AGENCE = photo(3, "");
  const avis = AVIS[avisIdx % AVIS.length];

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip" }}>
      <style>{`
        ${FONTS_CSS}
        .i342-link { position: relative; }
        .i342-link::after { content: ""; position: absolute; left: 0; bottom: 6px; height: 1px; width: 0; background: ${C.accent}; transition: width .5s cubic-bezier(0.16,1,0.3,1); }
        .i342-link:hover::after { width: 100%; }
        .i342-arrow { transition: transform .5s cubic-bezier(0.16,1,0.3,1); }
        .i342-cta:hover .i342-arrow { transform: translateX(6px); }

        .i342-bento { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: clamp(12px, 1.6vw, 18px); }
        .i342-split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(28px, 5vw, 64px); align-items: center; }
        .i342-etape { display: grid; grid-template-columns: 74px minmax(0,1fr) minmax(0,1.15fr); gap: clamp(14px, 2.2vw, 30px); align-items: start; }
        .i342-tarif { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: clamp(14px, 2vw, 30px); align-items: baseline; }
        .i342-contact { display: grid; grid-template-columns: minmax(0,1.1fr) minmax(0,0.9fr); gap: clamp(28px, 5vw, 70px); align-items: start; }

        .i342-marquee-wrap { overflow: hidden; }
        .i342-marquee { display: inline-flex; white-space: nowrap; animation: i342glide 38s linear infinite; }
        @keyframes i342glide { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .i342-marquee { animation: none !important; } }

        /*
          ── Héros « carte flottante » ──────────────────────────────────────
          Le titre était posé à plat sur toute la largeur de l'image, en bas :
          exactement impact-328 et impact-340. Ici il vit dans une carte qui
          chevauche le bord bas-droit du croisement d'images — le débord EST
          l'archétype, sans lui la carte redeviendrait un encart.
        */
        /* Le cadre photographique s'arrête avant le bas de l'écran : c'est
           ce bord-là que la carte franchit. Sur un plein écran sans marge,
           rien ne peut déborder de rien. */
        .i342-cadre { position: absolute; top: 0; left: 0; right: 0; bottom: clamp(64px, 11vh, 132px); overflow: hidden; }
        .i342-carte {
          position: relative;
          z-index: 2;
          width: min(560px, 100%);
          margin: 0 0 clamp(14px, 2.4vh, 30px) 0;
          background: rgba(6,8,10,0.86);
          backdrop-filter: blur(10px) saturate(120%);
          -webkit-backdrop-filter: blur(10px) saturate(120%);
          border: 1px solid ${C.border};
          border-right: 3px solid ${C.accent};
          box-shadow: 0 60px 120px -60px rgba(0,0,0,0.95);
          padding: clamp(24px, 3vw, 40px);
          margin-right: clamp(22px, 5vw, 68px);
        }

        @media (max-width: 900px) { #i342-nav { display: none !important; } .i342-burger { display: flex !important; } }
          .aevia-action-mobile { display: inline-flex !important; }
        @media (max-width: 780px) {
          /* Sur un téléphone la carte prend toute la largeur et se pose au
             bas de l'écran : le débord latéral n'a plus de place. */
          .i342-hero { justify-content: stretch; }
          .i342-cadre { bottom: clamp(120px, 26vh, 240px); }
          .i342-carte { width: auto; margin: 0 14px 18px; }
        }
        @media (max-width: 1040px) {
          .i342-contact { grid-template-columns: 1fr !important; }
          .i342-bento { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
          .i342-bento > * { grid-column: auto !important; grid-row: auto !important; }
        }
        @media (max-width: 860px) {
          .i342-split { grid-template-columns: 1fr !important; }
          .i342-bento { grid-template-columns: 1fr !important; }
          .i342-etape { grid-template-columns: 1fr !important; gap: 10px !important; }
          .i342-stats { grid-template-columns: 1fr 1fr !important; }
          .i342-pad { padding-left: 22px !important; padding-right: 22px !important; }
          .i342-sticky { position: static !important; }
        }
        @media (max-width: 560px) {
          .i342-stats { grid-template-columns: 1fr !important; }
          .i342-tarif { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: scrolled ? "12px clamp(20px,4vw,52px)" : "22px clamp(20px,4vw,52px)", background: scrolled ? "rgba(16,18,22,0.9)" : "transparent", backdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none", WebkitBackdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "padding .55s cubic-bezier(0.16,1,0.3,1), background .55s cubic-bezier(0.16,1,0.3,1), border-color .55s cubic-bezier(0.16,1,0.3,1), backdrop-filter .55s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={maison} style={{ height: 32, maxWidth: 170, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Car size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(15px, 1.8vw, 18px)", letterSpacing: "0.02em", textTransform: "uppercase", color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{maison}</span>
            </>
          )}
        </div>
        <div id="i342-nav" style={{ display: "flex", gap: 26, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} className="i342-link" style={{ color: C.textMuted, fontSize: 13.5, fontWeight: 500, textDecoration: "none", padding: "12px 2px" }}>{l}</a>
          ))}
          <motion.a href={telHref} className="i342-cta" style={{ background: C.accent, color: "#0e0e0e", borderRadius: 2, padding: "13px 24px", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", whiteSpace: "nowrap" }} whileHover={{ y: -2, boxShadow: "0 10px 24px rgba(227,91,63,0.32), 0 2px 6px rgba(0,0,0,0.4)" }} transition={{ duration: 0.5, ease: EASE }}>
            Inscription
          </motion.a>
        </div>
        {/* L'appel à l'action sous le pouce : la barre est fixe, mais son
            bouton vit dans le menu déroulant, en display:none sous le point
            de rupture. Celui-ci paraît exactement avec le bouton de menu. */}
        <ActionMobile href={telHref} fond={C.accent} encre={"#0e0e0e"}>
          Appeler
        </ActionMobile>
        <button className="i342-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all .3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all .3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all .3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 62, left: 0, right: 0, zIndex: 99, background: C.bgAlt, borderBottom: `1px solid ${C.border}`, padding: "18px 26px 22px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ color: C.ink, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "13px 0" }}>{l}</a>
          ))}
          <a href={telHref} style={{ background: C.accent, color: "#0e0e0e", borderRadius: 2, padding: "14px 22px", fontSize: 15, fontWeight: 700, textTransform: "uppercase", textDecoration: "none", textAlign: "center", marginTop: 8 }}>Inscription</a>
        </div>
      )}

      {/* ── HÉROS — H3 plein cadre, titre en bas ────────────────────────── */}
      {/* ── HERO — carte flottante en débord ──────────────────────────────
             Le croisement d'images tient le cadre ; la carte d'inscription se
             pose dessus et déborde de son bord bas-droit. La version
             précédente posait le titre à plat sur toute la largeur de
             l'image, comme impact-328 et impact-340 : le plein cadre est déjà
             pris deux fois dans la série. */}
      <section className="i342-hero" style={{ position: "relative", minHeight: "100dvh", display: "flex", alignItems: "flex-end", justifyContent: "flex-end", background: C.bgDark, overflow: "hidden" }}>
        {/* Le cadre : il s'arrête avant le bas de l'écran, et c'est son bord
            que la carte franchit. */}
        <div className="i342-cadre">
          {/* fond de repli obligatoire : la nuit de ville, en CSS, sous tout */}
          <NuitDeVille />

          {/* le geste : deux plans qui se croisent, piloté par le même index */}
          {/* Voile de 0,45 seulement : images bloquées, la nuit de ville doit
              rester lisible sous le croisement, sans que le titre y perde. */}
          {HERO_IMAGES.length > 0 && <CrossPush images={HERO_IMAGES} index={i} overlay={0.45} className="" />}

          {/* Le voile ne couvre plus toute la largeur : il se concentre sur le
              coin où la carte se pose, pour que l'image reste image ailleurs. */}
          <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 90% at 78% 88%, rgba(6,8,10,0.9) 12%, rgba(6,8,10,0.30) 56%, transparent 80%)", pointerEvents: "none" }} />
        </div>

        <motion.div
          className="i342-carte"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.12 }}
        >
          <Kicker>{clientEyebrow(sessionData) ?? `${metier} · ${ville}`}</Kicker>

          <motion.div key={`k-${i}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.055 }} style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: C.accentDark, margin: "clamp(16px, 2.2vw, 24px) 0 10px" }}>
            {S.k}
          </motion.div>

          <motion.h1 key={`h-${i}`} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.78, ease: EASE, delay: 0.11 }} style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(30px, 3.8vw, 54px)", lineHeight: 0.98, letterSpacing: "-0.028em", textTransform: "uppercase", color: C.white, margin: 0, overflowWrap: "break-word" }}>
            {S.line}
          </motion.h1>

          <motion.p key={`s-${i}`} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.78, ease: EASE, delay: 0.165 }} style={{ fontFamily: SANS, fontSize: "clamp(14.5px, 1.3vw, 16.5px)", lineHeight: 1.75, color: "rgba(255,255,255,0.74)", margin: "clamp(14px, 1.8vw, 20px) 0 clamp(22px, 2.8vw, 30px)" }}>
            {clientHeroSubtitle(sessionData) ?? S.sub}
          </motion.p>

          {/* Une seule action pleine ; les formules restent un lien. */}
          <div style={{ display: "flex", gap: "clamp(16px, 2vw, 26px)", flexWrap: "wrap", alignItems: "center" }}>
            <motion.a href={telHref} className="i342-cta" style={{ background: C.accent, color: "#0e0e0e", borderRadius: 2, padding: "16px 32px", fontWeight: 700, fontSize: 14.5, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }} whileHover={{ y: -2, boxShadow: "0 14px 32px rgba(227,91,63,0.36), 0 3px 8px rgba(0,0,0,0.45)" }} transition={{ duration: 0.5, ease: EASE }}>
              Je m'inscris <ArrowRight size={16} className="i342-arrow" />
            </motion.a>
            <a href="#tarifs" style={{ fontFamily: SANS, fontSize: 13, color: C.white, textDecoration: "none", borderBottom: `1px solid ${C.accent}`, paddingBottom: 3 }}>
              Les formules
            </a>
          </div>

          {/*
            De quoi passer d'une formation à l'autre. La fraction « 01 / 03 »
            ne disait pas ce qu'on regardait ; ces traits nomment les vues et
            y mènent directement.
          */}
          <div style={{ display: "flex", gap: 10, marginTop: "clamp(24px, 3vw, 32px)", paddingTop: 18, borderTop: `1px solid ${C.border}` }}>
            {HERO.map((h: any, n: number) => (
              <button
                key={h.k ?? n}
                type="button"
                onClick={() => go(n)}
                aria-label={h.k ?? `Vue ${n + 1}`}
                aria-current={n === i}
                style={{ width: 40, height: 3, padding: 0, border: "none", cursor: "pointer", background: n === i ? C.accent : "rgba(255,255,255,0.26)", transition: "background .3s" }}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── RESPIRATION ─────────────────────────────────────────────────── */}
      <section className="i342-pad" style={{ background: C.bgAlt, padding: "clamp(58px, 9vw, 104px) clamp(22px, 5vw, 68px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(to right, transparent, ${C.accent}, transparent)`, opacity: 0.45 }} />
        <p style={{ fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(20px, 3vw, 34px)", lineHeight: 1.45, letterSpacing: "-0.012em", color: C.ink, maxWidth: 780, margin: "0 auto" }}>
          {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (
            <>Un plan d'heures écrit, un prix qui ne bouge pas, <em style={{ color: C.accent, fontStyle: "normal" }}>ton permis</em>.</>
          )}
        </p>
      </section>

      {/* ── BANDE FILANTE — les voies ───────────────────────────────────── */}
      <section style={{ background: C.bg, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "clamp(18px, 2.6vw, 26px) 0" }}>
        <div className="i342-marquee-wrap">
          <div className="i342-marquee">
            {[0, 1].map((copie) => (
              <span key={copie} style={{ display: "inline-flex", alignItems: "center" }}>
                {VOIES.map((v, n) => (
                  <span key={`${copie}-${n}`} style={{ display: "inline-flex", alignItems: "center" }}>
                    <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(18px, 2.6vw, 30px)", letterSpacing: "-0.02em", textTransform: "uppercase", color: n % 2 === 1 ? C.accent : "rgba(255,255,255,0.16)", padding: "0 clamp(14px, 2.2vw, 26px)", whiteSpace: "nowrap" }}>{v}</span>
                    <span aria-hidden style={{ width: 5, height: 5, background: C.accent, opacity: 0.5, flexShrink: 0 }} />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMATIONS — bento de tuiles inégales ───────────────────────── */}
      <section id="services" className="i342-pad" style={{ background: C.bg, padding: "clamp(74px, 10vw, 126px) clamp(22px, 5vw, 68px)", position: "relative", overflow: "hidden" }}>
        <Ghost right top={36} size="clamp(170px, 30vw, 360px)">{"B"}</Ghost>
        <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal>
            <Kicker>Formations</Kicker>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(28px, 4.4vw, 54px)", lineHeight: 1.02, letterSpacing: "-0.028em", textTransform: "uppercase", color: C.ink, margin: "18px 0 clamp(32px, 4.6vw, 52px)", maxWidth: 760 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                <>Le permis,<br /><em style={{ color: C.accent, fontStyle: "italic", fontWeight: 600 }}>version efficace.</em></>
              )}
            </h2>
          </Reveal>

          <div className="i342-bento">
            {SERVICES.map((s, n) => {
              const boite = BENTO[n % BENTO.length];
              const large = boite.col === "span 2";
              return (
                <Reveal key={`${s.titre}-${n}`} delay={(n % 3) * 0.06} style={{ gridColumn: boite.col, gridRow: boite.row }}>
                  <div onMouseEnter={() => setHoverTuile(n)} onMouseLeave={() => setHoverTuile(null)} style={{ height: "100%", background: hoverTuile === n ? C.bgAlt : C.bgCard, border: `1px solid ${hoverTuile === n ? "rgba(227,91,63,0.4)" : C.border}`, borderRadius: 3, padding: large ? "clamp(26px, 3.4vw, 40px)" : "clamp(20px, 2.6vw, 28px)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 18, transform: hoverTuile === n ? "translateY(-4px)" : "none", boxShadow: hoverTuile === n ? "0 22px 44px rgba(0,0,0,0.45), 0 3px 8px rgba(0,0,0,0.35)" : "none", transition: "background .5s cubic-bezier(0.16,1,0.3,1), transform .5s cubic-bezier(0.16,1,0.3,1), box-shadow .5s cubic-bezier(0.16,1,0.3,1), border-color .5s cubic-bezier(0.16,1,0.3,1)" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                        <span aria-hidden style={{ width: hoverTuile === n ? 26 : 14, height: 1, background: C.accent, transition: "width .5s cubic-bezier(0.16,1,0.3,1)" }} />
                        <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: C.accent }}>{s.tag}</span>
                      </div>
                      <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: large ? "clamp(22px, 2.8vw, 32px)" : "clamp(17px, 1.9vw, 21px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: C.ink, margin: "0 0 12px" }}>{s.titre}</h3>
                      <p style={{ fontSize: large ? 15 : 14, lineHeight: 1.72, color: C.textMuted, margin: 0 }}>{s.desc}</p>
                    </div>
                    <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: large ? 44 : 28, lineHeight: 1, color: hoverTuile === n ? "rgba(227,91,63,0.35)" : "rgba(255,255,255,0.07)", transition: "color .5s cubic-bezier(0.16,1,0.3,1)" }}>{String(n + 1).padStart(2, "0")}</span>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CHIFFRES ────────────────────────────────────────────────────── */}
      <section className="i342-pad" style={{ background: C.bgDarkAlt, padding: "clamp(56px, 8vw, 90px) clamp(22px, 5vw, 68px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(46% 60% at 82% 30%, rgba(227,91,63,0.11), transparent 70%)", pointerEvents: "none" }} />
        <div className="i342-stats" style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", position: "relative", zIndex: 1 }}>
          {STATS.map((s, n) => (
            <Reveal key={`${s.label}-${n}`} delay={n * 0.055}>
              <div style={{ padding: "clamp(14px, 2vw, 26px) clamp(12px, 2vw, 24px)", borderLeft: `1px solid ${C.border}`, height: "100%" }}>
                <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(30px, 4.6vw, 54px)", lineHeight: 1, letterSpacing: "-0.03em", color: C.accent }}>{s.value}</div>
                <div style={{ fontSize: 12.5, lineHeight: 1.6, color: C.textMuted, marginTop: 12, maxWidth: 210 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE — rangées numérotées ──────────────────────── */}
      <section id="methode" className="i342-pad" style={{ background: C.bg, padding: "clamp(74px, 10vw, 126px) clamp(22px, 5vw, 68px)", position: "relative", overflow: "hidden" }}>
        <Ghost top={40} size="clamp(160px, 28vw, 330px)">{"04"}</Ghost>
        <div style={{ maxWidth: 1140, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal>
            <Kicker>Comment ça marche</Kicker>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(28px, 4.4vw, 54px)", lineHeight: 1.02, letterSpacing: "-0.028em", textTransform: "uppercase", color: C.ink, margin: "18px 0 clamp(32px, 4.6vw, 52px)", maxWidth: 800 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                <>Un plan d'heures,<br /><em style={{ color: C.accent, fontStyle: "italic", fontWeight: 600 }}>pas un compteur qui tourne.</em></>
              )}
            </h2>
          </Reveal>

          {METHODE.map((m, n) => (
            <Reveal key={m.n} delay={n * 0.055}>
              <div className="i342-etape" onMouseEnter={() => setHoverEtape(n)} onMouseLeave={() => setHoverEtape(null)} style={{ padding: "clamp(22px, 3vw, 34px) clamp(10px, 1.8vw, 20px)", borderTop: `1px solid ${C.border}`, borderBottom: n === METHODE.length - 1 ? `1px solid ${C.border}` : "none", background: hoverEtape === n ? C.bgAlt : "transparent", transform: hoverEtape === n ? "translateY(-3px)" : "none", boxShadow: hoverEtape === n ? "0 20px 40px rgba(0,0,0,0.42), 0 2px 6px rgba(0,0,0,0.32)" : "none", transition: "background .5s cubic-bezier(0.16,1,0.3,1), transform .5s cubic-bezier(0.16,1,0.3,1), box-shadow .5s cubic-bezier(0.16,1,0.3,1)" }}>
                <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(28px, 3.4vw, 40px)", lineHeight: 1, letterSpacing: "-0.03em", color: hoverEtape === n ? C.accent : "rgba(255,255,255,0.14)", transition: "color .5s cubic-bezier(0.16,1,0.3,1)" }}>{m.n}</div>
                <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(17px, 1.9vw, 21px)", lineHeight: 1.18, letterSpacing: "-0.015em", color: C.ink, margin: 0 }}>{m.t}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.75, color: C.textMuted, margin: 0, maxWidth: 540 }}>{m.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FORMULES — bandes tarifaires ────────────────────────────────── */}
      <section id="tarifs" className="i342-pad" style={{ background: C.bgAlt, padding: "clamp(74px, 10vw, 126px) clamp(22px, 5vw, 68px)", position: "relative", overflow: "hidden" }}>
        <Ghost right top={30} size="clamp(150px, 26vw, 300px)">{"€"}</Ghost>
        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <Kicker align="center">Formules</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(28px, 4.2vw, 50px)", lineHeight: 1.02, letterSpacing: "-0.028em", textTransform: "uppercase", color: C.ink, margin: "18px 0 14px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                  <>Des prix nets, <em style={{ color: C.accent, fontStyle: "italic", fontWeight: 600 }}>paiement en 4×.</em></>
                )}
              </h2>
              <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 540, margin: "0 auto", lineHeight: 1.75 }}>
                Tous les forfaits incluent les frais de dossier et une présentation à l'examen. Paiement en 4 fois sans frais, CPF accepté.
              </p>
            </div>
          </Reveal>

          <div style={{ marginTop: "clamp(34px, 5vw, 54px)" }}>
            {TARIFS.map((tt, n) => (
              <Reveal key={`${tt.a}-${n}`} delay={n * 0.05}>
                <div className="i342-tarif" onMouseEnter={() => setHoverTarif(n)} onMouseLeave={() => setHoverTarif(null)} style={{ padding: "clamp(20px, 2.6vw, 30px) clamp(14px, 2vw, 24px)", borderTop: `1px solid ${C.border}`, borderBottom: n === TARIFS.length - 1 ? `1px solid ${C.border}` : "none", borderLeft: `2px solid ${hoverTarif === n ? C.accent : "transparent"}`, background: hoverTarif === n ? C.bgCard : "transparent", transform: hoverTarif === n ? "translateY(-2px)" : "none", boxShadow: hoverTarif === n ? "0 18px 36px rgba(0,0,0,0.42), 0 2px 6px rgba(0,0,0,0.3)" : "none", transition: "background .5s cubic-bezier(0.16,1,0.3,1), transform .5s cubic-bezier(0.16,1,0.3,1), box-shadow .5s cubic-bezier(0.16,1,0.3,1), border-color .5s cubic-bezier(0.16,1,0.3,1)" }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(17px, 1.9vw, 21px)", letterSpacing: "-0.015em", color: C.ink }}>{tt.a}</div>
                    <div style={{ fontSize: 13.5, color: C.textMuted, marginTop: 7, lineHeight: 1.7, maxWidth: 620 }}>{tt.n}</div>
                  </div>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(20px, 2.4vw, 28px)", letterSpacing: "-0.03em", color: hoverTarif === n ? C.accentDark : C.accent, whiteSpace: "nowrap", transition: "color .5s cubic-bezier(0.16,1,0.3,1)" }}>{tt.p}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENTS ─────────────────────────────────────────────────── */}
      <section id="engagements" className="i342-pad" style={{ background: C.bg, padding: "clamp(74px, 10vw, 126px) clamp(22px, 5vw, 68px)" }}>
        <div className="i342-split" style={{ maxWidth: 1140, margin: "0 auto" }}>
          <Reveal>
            <div style={{ position: "relative", border: `1px solid ${C.border}`, borderRadius: 3, overflow: "hidden", background: C.bgDark, aspectRatio: "4/3" }}>
              {AGENCE ? (
                <img src={AGENCE} alt={`${maison} — l'agence`} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              ) : (
                <>
                  <NuitDeVille />
                  <span style={{ position: "absolute", left: 22, top: 20, fontFamily: SANS, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: C.accentDark }}>Parcours d'examen · {ville}</span>
                  <Zap size={22} color={C.accent} style={{ position: "absolute", right: 22, bottom: 22 }} />
                </>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              <Kicker>Nos engagements</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(26px, 3.8vw, 46px)", lineHeight: 1.04, letterSpacing: "-0.028em", textTransform: "uppercase", color: C.ink, margin: "18px 0 clamp(22px, 3vw, 32px)" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>Tout est affiché,<br /><em style={{ color: C.accent, fontStyle: "italic", fontWeight: 600 }}>même ce qui fâche.</em></>
                )}
              </h2>
              {ENGAGEMENT.map((e, n) => (
                <div key={n} style={{ display: "flex", gap: 14, padding: "14px 0", borderTop: n === 0 ? `1px solid ${C.border}` : "none", borderBottom: `1px solid ${C.border}` }}>
                  <Check size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 4 }} />
                  <span style={{ fontSize: 14.5, color: C.textMuted, lineHeight: 1.7 }}>{e}</span>
                </div>
              ))}
              <motion.a href={telHref} className="i342-cta" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 28, background: C.accent, color: "#0e0e0e", borderRadius: 2, padding: "15px 30px", fontWeight: 700, fontSize: 14.5, letterSpacing: "0.05em", textTransform: "uppercase", textDecoration: "none" }} whileHover={{ y: -2, boxShadow: "0 14px 32px rgba(227,91,63,0.36), 0 3px 8px rgba(0,0,0,0.45)" }} transition={{ duration: 0.5, ease: EASE }}>
                Nous appeler <ArrowRight size={16} className="i342-arrow" />
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── AVIS — spotlight ────────────────────────────────────────────── */}
      <section className="i342-pad" style={{ background: C.bgDarkAlt, padding: "clamp(74px, 10vw, 126px) clamp(22px, 5vw, 68px)", position: "relative", overflow: "hidden" }}>
        <Ghost top={16} size="clamp(190px, 32vw, 400px)" color="rgba(227,91,63,0.08)">{"“"}</Ghost>
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          <Reveal>
            <Kicker align="center">Ils l'ont eu</Kicker>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(26px, 3.8vw, 46px)", lineHeight: 1.04, letterSpacing: "-0.028em", textTransform: "uppercase", color: C.ink, margin: "18px 0 clamp(30px, 4.4vw, 48px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                <>Ils l'ont eu <em style={{ color: C.accent, fontStyle: "italic", fontWeight: 600 }}>du premier coup</em>.</>
              )}
            </h2>
          </Reveal>

          <motion.blockquote key={avisIdx} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }} style={{ fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(19px, 2.6vw, 30px)", lineHeight: 1.5, letterSpacing: "-0.012em", color: "rgba(255,255,255,0.92)", margin: "0 auto", maxWidth: 780 }}>
            « {avis.texte} »
          </motion.blockquote>

          <div style={{ marginTop: 28 }}>
            <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, color: C.white }}>{avis.auteur}</div>
            <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: C.accent, marginTop: 7 }}>{avis.detail}</div>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
            {AVIS.map((a, n) => (
              <button key={`${a.auteur}-${n}`} onClick={() => setAvisIdx(n)} aria-label={`Avis ${n + 1}`} style={{ minWidth: 44, minHeight: 44, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                <span style={{ display: "block", width: n === avisIdx % AVIS.length ? 34 : 14, height: 2, background: n === avisIdx % AVIS.length ? C.accent : "rgba(255,255,255,0.2)", transition: "width .5s cubic-bezier(0.16,1,0.3,1), background .5s cubic-bezier(0.16,1,0.3,1)" }} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section id="contact" className="i342-pad" style={{ background: C.accentLight, padding: "clamp(74px, 10vw, 126px) clamp(22px, 5vw, 68px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(50% 50% at 24% 30%, rgba(227,91,63,0.16), transparent 72%)", pointerEvents: "none" }} />
        <div className="i342-contact" style={{ maxWidth: 1080, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal>
            <div>
              <Kicker>On t'attend</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(28px, 4.2vw, 52px)", lineHeight: 1.02, letterSpacing: "-0.03em", textTransform: "uppercase", color: C.ink, margin: "18px 0 18px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                  <>Passe à l'agence,<br /><em style={{ color: C.accent, fontStyle: "italic", fontWeight: 600 }}>repars avec un plan.</em></>
                )}
              </h2>
              <p style={{ fontSize: 15.5, color: C.textMuted, maxWidth: 470, lineHeight: 1.78, margin: 0 }}>
                Évaluation offerte, plan d'heures écrit, dossier CPF monté sur place. L'agence est ouverte non-stop, même entre midi et deux.
              </p>
              <div style={{ display: "flex", gap: 13, flexWrap: "wrap", marginTop: 32 }}>
                <motion.a href={telHref} className="i342-cta" style={{ background: C.accent, color: "#0e0e0e", borderRadius: 2, padding: "16px 34px", fontWeight: 700, fontSize: 15.5, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }} whileHover={{ y: -2, boxShadow: "0 14px 32px rgba(227,91,63,0.36), 0 3px 8px rgba(0,0,0,0.45)" }} transition={{ duration: 0.5, ease: EASE }}>
                  <Phone size={17} /> {phone}
                </motion.a>
                <motion.a href={`mailto:${mail}`} style={{ background: "transparent", color: C.ink, border: `1px solid ${C.accent}`, borderRadius: 2, padding: "15px 30px", fontWeight: 700, fontSize: 15.5, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }} whileHover={{ backgroundColor: C.accent, color: "#0e0e0e" }} transition={{ duration: 0.5, ease: EASE }}>
                  <Mail size={17} /> Nous écrire
                </motion.a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 3, padding: "clamp(24px, 3.4vw, 38px)" }}>
              <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: C.accent }}>L'agence</span>
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <MapPin size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontSize: 14.5, color: C.textMuted, lineHeight: 1.7 }}>{clientCodePostalVille(sessionData, "34000", "Montpellier")}</span>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Phone size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <a href={telHref} style={{ fontSize: 14.5, color: C.textMuted, textDecoration: "none", lineHeight: 1.7 }}>{phone}</a>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Mail size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <a href={`mailto:${mail}`} style={{ fontSize: 14.5, color: C.textMuted, textDecoration: "none", lineHeight: 1.7, overflowWrap: "anywhere" }}>{mail}</a>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Clock size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontSize: 14.5, color: C.textMuted, lineHeight: 1.7 }}>
                    {/* TEXTE_SECTION */ clientText(sessionData, "contact.acces") ?? "Réservation des créneaux en ligne 24h/24, annulation gratuite jusqu'à 48 h avant."}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="i342-pad" style={{ background: C.bgDark, padding: "clamp(46px, 6vw, 66px) clamp(22px, 5vw, 68px) 26px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 30, marginBottom: 34 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(18px, 2.2vw, 24px)", letterSpacing: "-0.01em", textTransform: "uppercase", color: C.accent, marginBottom: 12 }}>{maison}</div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.75, maxWidth: 420 }}>
                {metier} agréée · {ville}
                <br />
                Agrément préfectoral E 26 034 0118 0
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <MapPin size={13} />, t: adresse ?? `${ville}, Hérault` },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Clock size={13} />, t: "Lun–Sam 9h–19h non-stop" },
              ].map((item, n) => (
                <div key={n} style={{ display: "flex", gap: 11, color: "rgba(255,255,255,0.44)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.accent }}>{item.icon}</span>
                  <span style={{ overflowWrap: "anywhere" }}>{item.t}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ color: "rgba(255,255,255,0.28)", fontSize: 12 }}>
              © 2026 {maison} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
              {/* VILLE_PIED */}
              {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ color: "rgba(255,255,255,0.28)", fontSize: 12 }}>
              Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
