"use client";
// @ts-nocheck

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, Footprints, Mail, MapPin, Phone } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, LineMask, useSlides } from "@/lib/templates/hero-kit-2";
import {
  clientAccrocheRestante,
  clientAddress,
  clientCertifications,
  clientCity,
  clientEmail,
  clientEyebrow,
  clientHeroLine,
  clientHeroPrestations,
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
import { TitreDeLaPage } from "@/lib/templates/TitreDeLaPage";
import { ActionMobile } from "@/lib/templates/ActionMobile";

/* ════════════════════════════════════════════════════════════════════════════
   ALLURE & APPUI — Pédicure-podologue, cabinet bien-être · Pau

   Archétype héros H4 — éditorial décalé : le titre XXL déborde sur un panneau
   posé à droite, qui porte le rail de chiffres. Serif dominant (Cormorant
   Garamond), sans-serif système en second rôle : les rôles sont opposés, pas
   assortis.

   Geste signature : LineMask (hero-kit-2) — chaque ligne du titre est masquée
   par sa propre boîte et se glisse dessous, ligne après ligne. La foulée
   décrite ligne à ligne : c'est le seul geste de la page, et un unique index
   (celui de useSlides) pilote titre, sur-titre, légende et rail.

   Aucun contenu rédactionnel n'a été inventé : prestations, tarifs, avis,
   mentions d'Ordre et textes de démonstration viennent du thème d'origine. La
   phrase de respiration est la queue de l'ancien paragraphe de héros, déplacée.
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

/* ── Jetons ──────────────────────────────────────────────────────────────── */
let C: Record<string, string> = {
  bg: "#fbf8f8",
  bgAlt: "#f4ecec",
  bgDark: "#2b1d21",
  bgDarkAlt: "#211519",
  bgCard: "#ffffff",
  accent: "var(--brand, #a2504f)",
  accentDark: "var(--brand-light, #7d3b3a)",
  accentLight: "#f4e0e0",
  ink: "#271d1f",
  textMuted: "#6d5e61",
  textFaint: "#9c8a8c",
  border: "#e8dada",
  white: "#ffffff",
  /* Clé métier : le rosé pâle des tissus, employé sur fond sombre. */
  blush: "#dba8a0",
};

const SERIF = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
const SANS = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

/** L'unique courbe de la page. Répétée littéralement en CSS plus bas. */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Contenu de démonstration (conservé mot pour mot) ────────────────────── */
const NAV = [
  { l: "Soins", h: "#services" },
  { l: "Le déroulé", h: "#methode" },
  { l: "Le cabinet", h: "#engagements" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

const HERO_SOURCE = [
  {
    k: "Pédicurie douce",
    lines: ["Des pieds soignés,", "sans serrer les dents."],
    sub: "Instruments fins, gestes lents, résultat net.",
  },
  {
    k: "Semelles discrètes",
    lines: ["Corriger l'appui,", "oublier la semelle."],
    sub: "Fines, gainées cuir, invisibles en escarpin.",
  },
  {
    k: "Pieds âgés",
    lines: ["Marcher longtemps,", "c'est vieillir debout."],
    sub: "Soins réguliers, domicile possible.",
  },
];
let HERO = HERO_SOURCE;

const SERVICES_SOURCE = [
  {
    titre: "Soin de pédicurie complet",
    desc: "Bain tiède, cors et callosités traités, ongles coupés et fraisés, crème massée : 45 minutes qui changent la démarche.",
    tag: "Soin",
  },
  {
    titre: "Ongles difficiles",
    desc: "Incarnés, épaissis, mycosiques : traités sans douleur, orthonyxie si besoin, conseils francs sur ce qui repoussera — et ce qui ne repoussera pas.",
    tag: "Ongles",
  },
  {
    titre: "Semelles fines",
    desc: "Correction efficace dans des semelles discrètes, gainées cuir, pensées pour VOS chaussures — y compris celles qu'on aime trop.",
    tag: "Semelles",
  },
  {
    titre: "Pieds âgés & domicile",
    desc: "Tournée du jeudi pour les patients qui ne se déplacent plus : le soin complet, à la maison, en lien avec l'infirmière.",
    tag: "Domicile",
  },
  {
    titre: "Pied diabétique",
    desc: "Gradation, soins pris en charge selon le grade, vigilance plaies : la prévention qui évite les catastrophes.",
    tag: "Diabète",
  },
  {
    titre: "Réflexologie plantaire",
    desc: "En fin de soin ou en séance dédiée : 30 minutes de détente réelle — le bien-être fait aussi partie du soin.",
    tag: "Bien-être",
  },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE_SOURCE = [
  {
    n: "01",
    t: "On écoute d'abord",
    d: "Vos douleurs, vos chaussures, votre quotidien. Le pied raconte une vie — on la prend en compte.",
  },
  {
    n: "02",
    t: "Le soin, en douceur",
    d: "Instruments stériles, gestes expliqués, jamais de douleur infligée « pour bien faire ».",
  },
  {
    n: "03",
    t: "Les conseils utiles",
    d: "Chaussage, crème, auto-surveillance : trois conseils réalistes valent mieux que dix idéaux.",
  },
  {
    n: "04",
    t: "Le bon rythme de suivi",
    d: "Toutes les 6 à 10 semaines selon les pieds — rappel proposé, jamais imposé.",
  },
];
let METHODE = METHODE_SOURCE;

const ENGAGEMENT_DEMO = [
  "Diplômée d'État, inscrite à l'Ordre des pédicures-podologues",
  "Stérilisation autoclave contrôlée, instruments tracés par patient",
  "Tarifs affichés en salle d'attente, devis avant tout appareillage",
  "Visites à domicile le jeudi, en coordination avec infirmiers et familles",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

function TARIFS_SOURCE_LIVE() {
  return [
    { a: "Soin de pédicurie (45 min)", p: "38 €", n: "Complet, crème et conseils compris." },
    {
      a: "Soin à domicile (jeudi)",
      p: "48 €",
      n: (clientCity(sessionData) ?? "Pau") + " et première couronne, matériel stérile transporté.",
    },
    { a: "Bilan + semelles fines", p: "150 €", n: "Fabrication 8 jours, ajustement à un mois inclus." },
    { a: "Réflexologie plantaire (30 min)", p: "35 €", n: "En complément d'un soin ou en séance seule." },
  ];
}
let TARIFS_SOURCE = TARIFS_SOURCE_LIVE();
let TARIFS = TARIFS_SOURCE;

const AVIS_SOURCE = [
  {
    texte:
      "J'avais honte de mes pieds au point de repousser le rendez-vous deux ans. Accueil sans jugement, soin sans douleur, résultat spectaculaire. J'aurais dû venir bien avant.",
    auteur: "Monique A., 67 ans",
    detail: "Premier soin",
  },
  {
    texte:
      "Les semelles fines tiennent vraiment dans mes escarpins de travail. La douleur à l'avant-pied a disparu en trois semaines.",
    auteur: "Sandrine V.",
    detail: "Semelles discrètes",
  },
  {
    texte:
      "Elle vient chaque jeudi chez ma mère de 91 ans, coordonnée avec l'infirmière. Maman remarche dans le jardin — c'est tout ce qui compte.",
    auteur: "Fils de Mme E.",
    detail: "Soins à domicile",
  },
];
let AVIS_DEMO = AVIS_SOURCE;

const STATS_DEMO = [
  { value: "45 min", label: "Par soin — jamais à la chaîne" },
  { value: "8 j", label: "Pour vos semelles" },
  { value: "D.E.", label: "Diplômée d'État, inscrite à l'Ordre" },
  { value: "Dom.", label: "Visites à domicile le jeudi" },
];
let STATS = STATS_DEMO;

/* Repli d'image : l'URL déjà présente dans le thème, jamais une nouvelle. */
const PHOTO_SOIN_DEMO =
  "https://images.pexels.com/photos/9146381/pexels-photo-9146381.jpeg?auto=compress&cs=tinysrgb&w=1400";

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

/** Révélation au défilement — une seule fois, jamais rejouée. */
function Reveal({
  children,
  delay = 0,
  y = 24,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -8% 0px" });
  return (
    <motion.div
      ref={ref}
      style={style}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.78, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Le kicker du thème : filet de 40 px, puis capitales très espacées. */
function Kicker({
  children,
  color = C.accentDark,
  align = "left",
}: {
  children: React.ReactNode;
  color?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        justifyContent: align === "center" ? "center" : "flex-start",
      }}
    >
      <span aria-hidden style={{ width: 40, height: 1, background: color, opacity: 0.65, flexShrink: 0 }} />
      <span
        style={{
          fontFamily: SANS,
          fontSize: 10.5,
          fontWeight: 600,
          letterSpacing: "0.36em",
          textTransform: "uppercase",
          color,
        }}
      >
        {children}
      </span>
      {align === "center" && (
        <span aria-hidden style={{ width: 40, height: 1, background: color, opacity: 0.65, flexShrink: 0 }} />
      )}
    </div>
  );
}

/** Un filet dégradé de 1 px — la seule règle horizontale de la page. */
function Hairline({ opacity = 1, color = C.border }: { opacity?: number; color?: string }) {
  return (
    <div
      aria-hidden
      style={{
        height: 1,
        width: "100%",
        opacity,
        background: `linear-gradient(to right, transparent 0%, ${color} 18%, ${color} 82%, transparent 100%)`,
      }}
    />
  );
}

/**
 * L'emplacement photo, beau même sans photo.
 *
 * Le proxy du conteneur bloque les banques d'images : une section qui compte
 * sur son fichier JPEG pour exister est une section vide. Le repli est donc un
 * aplat travaillé — dégradé rosé, filets, chiffre fantôme — et non un cadre gris.
 */
function PhotoBox({
  src,
  alt,
  ratio = "4/3",
  ghost,
  radius = 4,
}: {
  src: string;
  alt: string;
  ratio?: string;
  ghost?: string;
  radius?: number;
}) {
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: ratio,
        overflow: "hidden",
        borderRadius: radius,
        border: `1px solid ${C.border}`,
        background: `linear-gradient(148deg, ${C.accentLight} 0%, ${C.bgAlt} 52%, ${C.bg} 100%)`,
      }}
    >
      {!src && (
        <>
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `repeating-linear-gradient(122deg, rgba(162,80,79,0.055) 0 1px, transparent 1px 16px)`,
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              right: "-4%",
              bottom: "-22%",
              fontFamily: SERIF,
              fontSize: "clamp(120px, 22vw, 240px)",
              lineHeight: 0.8,
              color: C.accentDark,
              opacity: 0.08,
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            {ghost ?? "45"}
          </div>
        </>
      )}
      {src && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      )}
    </div>
  );
}

/**
 * La photo demandée au client à cet emplacement.
 *
 * `||` et non `??` : une chaîne vide dans `photoUrls` doit céder la place au
 * repli, ce que `??` ne fait pas.
 */
function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ════════════════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════════════════ */
export default function AllureAppuiPage() {
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

  /* ── Affectations : avant tout appel de helper ────────────────────────── */
  fd = session?.formData;
  c = session?.generatedContent;
  bp = session?.businessProfile;
  sessionData = session;
  brand = fd?.brandColor ?? null;
  if (brand) {
    C = { ...C, accent: brand };
  }

  /* ── Blocs de données rejoués à chaque rendu ──────────────────────────── */
  TARIFS_SOURCE = TARIFS_SOURCE_LIVE();

  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...SERVICES_SOURCE[i % SERVICES_SOURCE.length],
      titre: s.title ?? SERVICES_SOURCE[i % SERVICES_SOURCE.length].titre,
    })),
    SERVICES_SOURCE,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      ...AVIS_SOURCE[i % AVIS_SOURCE.length],
      auteur: r.author ?? AVIS_SOURCE[i % AVIS_SOURCE.length].auteur,
      texte: r.text ?? AVIS_SOURCE[i % AVIS_SOURCE.length].texte,
    })),
    AVIS_SOURCE,
  );
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...TARIFS_SOURCE[i % TARIFS_SOURCE.length],
      a: s.title ?? TARIFS_SOURCE[i % TARIFS_SOURCE.length].a,
      p: s.price ?? TARIFS_SOURCE[i % TARIFS_SOURCE.length].p,
      n: s.desc || TARIFS_SOURCE[i % TARIFS_SOURCE.length].n,
    })),
    TARIFS_SOURCE,
  );
  STATS = resolveList(clientStats(sessionData), STATS_DEMO);
  ENGAGEMENT = resolveList(
    clientList(sessionData, "engagements.liste") ?? clientCertifications(sessionData),
    ENGAGEMENT_DEMO,
  );
  METHODE = resolveList(
    clientList(sessionData, "methode.etapes")?.map((t: string, n: number) => ({
      ...METHODE_SOURCE[n % METHODE_SOURCE.length],
      n: String(n + 1).padStart(2, "0"),
      t,
    })),
    METHODE_SOURCE,
  );

  const SERVICES = resolveList(
    clientServices(sessionData)?.map((s: any, n: number) => ({
      titre: s.title ?? SERVICES_DEMO[n % SERVICES_DEMO.length].titre,
      desc: s.description ?? s.desc ?? SERVICES_DEMO[n % SERVICES_DEMO.length].desc,
      tag: SERVICES_DEMO[n % SERVICES_DEMO.length].tag,
      prix: s.price ?? "",
    })),
    SERVICES_DEMO.map((s) => ({ ...s, prix: "" })),
  );
  const AVIS = resolveList(
    clientReviews(sessionData)?.map((r: any, n: number) => ({
      texte: r.text ?? AVIS_DEMO[n % AVIS_DEMO.length].texte,
      auteur: r.name ?? r.author ?? AVIS_DEMO[n % AVIS_DEMO.length].auteur,
      detail: r.location ?? r.role ?? AVIS_DEMO[n % AVIS_DEMO.length].detail,
    })),
    AVIS_DEMO,
  );

  /*
    Le titre du héros. La première diapositive porte l'accroche du client,
    coupée sur deux lignes de 20 signes — le gabarit de ce gabarit-ci, pas
    celui d'un autre thème. Les suivantes gardent les lignes du thème, qui
    montrent d'autres facettes du métier ; leur sur-titre prend le nom des
    prestations du client quand il en a saisi.
  */
  const ligne0 = clientHeroLine(sessionData, 0, 2, 20);
  const ligne1 = clientHeroLine(sessionData, 1, 2, 20);
  HERO = resolveList(
    clientServices(sessionData)
      ?.slice(0, HERO_SOURCE.length)
      .map((s: any, n: number) => ({
        ...HERO_SOURCE[n % HERO_SOURCE.length],
        k: s.title ?? HERO_SOURCE[n % HERO_SOURCE.length].k,
      })),
    HERO_SOURCE,
  ).map((row: any, n: number) =>
    n === 0 && ligne0 ? { ...row, lines: [ligne0, ligne1].filter(Boolean) } : row,
  );

  /* ── État local ───────────────────────────────────────────────────────── */
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navHover, setNavHover] = useState<string | null>(null);
  const [ligneSurvol, setLigneSurvol] = useState<number | null>(null);
  const [tarifSurvol, setTarifSurvol] = useState<number | null>(null);
  const [avisActif, setAvisActif] = useState(0);
  const reduce = useReducedMotion();

  /* Un seul index pilote le héros : titre, sur-titre, légende, rail. */
  const { i, go } = useSlides(HERO.length, DWELL.normal);
  const S = HERO[i];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    if (avisActif > AVIS.length - 1) setAvisActif(0);
  }, [AVIS.length, avisActif]);

  /* ── Contact ──────────────────────────────────────────────────────────── */
  const phone = clientPhone(sessionData) ?? clientEmail(sessionData) ?? fd?.email ?? "05 59 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? clientEmail(sessionData) ?? fd?.email ?? "+33559000000").replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "cabinet@allure-appui.fr";
  const marque = fd?.businessName ?? clientName(sessionData) ?? "Allure & Appui";
  const ville = clientCity(sessionData) ?? "Pau";
  const metier = clientTrade(sessionData) ?? "Podologue";
  const lieu = clientAddress(sessionData) ?? `${ville}, Pyrénées-Atlantiques`;

  const avis = AVIS[Math.min(avisActif, AVIS.length - 1)] ?? AVIS[0];

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&display=swap');

        .i364-navlink { position: relative; }
        .i364-navlink::after {
          content: ""; position: absolute; left: 0; bottom: 6px; height: 1px;
          width: 0; background: currentColor;
          transition: width .5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .i364-navlink:hover::after { width: 100%; }

        .i364-row { transition: background .5s cubic-bezier(0.16, 1, 0.3, 1), transform .5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow .5s cubic-bezier(0.16, 1, 0.3, 1); }
        .i364-arc { animation: i364-breathe 7.5s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
        @keyframes i364-breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: .5; }
          50% { transform: translate(-50%, -50%) scale(1.055); opacity: .82; }
        }
        @media (prefers-reduced-motion: reduce) {
          .i364-arc { animation: none !important; }
        }

        /* Nav : repli sous 940px. */
        @media (max-width: 940px) {
          .i364-navlinks { display: none !important; }
          .i364-burger { display: flex !important; }
          .aevia-action-mobile { display: inline-flex !important; }
        }

        /*
          ── Héros « diagonale asymétrique » ────────────────────────────────
          La masse teintée est taillée en biais sur le bord droit ; la parole
          vit dans le grand pan qu'elle laisse. La coupe penche dans l'autre
          sens que celles d'impact-334 (masse droite, coupe /) et
          d'impact-354 (masse gauche) : trois diagonales, trois dessins.
        */
        .i364-masse {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 44%;
          clip-path: polygon(38% 0, 100% 0, 100% 100%, 12% 100%);
          background: linear-gradient(200deg, ${C.bgAlt} 0%, ${C.accentLight} 120%);
          border-left: none;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .i364-masse-int {
          width: min(320px, 68%);
          margin-right: clamp(20px, 4vw, 64px);
        }
        .i364-lead {
          position: relative;
          z-index: 2;
          width: min(680px, 52%);
          margin-left: clamp(24px, 6vw, 96px);
          padding: clamp(118px, 14vh, 160px) 0 clamp(48px, 6vh, 80px);
        }

        @media (max-width: 1024px) {
          /* Sous 1024 il n'y a plus de « à côté » : la masse passe sous la
             parole, coupée en biais sur son bord haut. */
          .i364-hero { display: block !important; }
          .i364-masse {
            position: static;
            width: auto;
            clip-path: polygon(0 0, 100% clamp(18px, 4vw, 36px), 100% 100%, 0 100%);
            display: block;
            padding: clamp(40px, 8vw, 64px) 24px clamp(32px, 6vw, 48px);
          }
          .i364-masse-int { width: auto; margin: 0; }
          .i364-lead { width: auto; margin: 0; padding: 118px 24px 40px; }
          .i364-title { width: 100% !important; }
          .i364-statrail { display: grid !important; grid-template-columns: minmax(0,1fr) minmax(0,1fr) !important; column-gap: 24px; }
        }

        /* Grilles à deux colonnes : media query locale, jamais layout.tsx. */
        @media (max-width: 900px) {
          .i364-split { grid-template-columns: minmax(0,1fr) !important; gap: 36px !important; }
          .i364-splitrev > :first-child { order: 2; }
          .i364-splitrev > :last-child { order: 1; }
          .i364-metagrid { grid-template-columns: minmax(0,1fr) !important; }
        }
        @media (max-width: 860px) {
          .i364-servrow { grid-template-columns: minmax(0,1fr) !important; row-gap: 10px !important; }
          .i364-servrow { padding-left: 0 !important; }
          .i364-splitrev > :first-child,
          .i364-splitrev > :last-child { order: initial; }
          .i364-tarifrow { grid-template-columns: minmax(0,1fr) !important; row-gap: 6px !important; }
          .i364-tarifprice { text-align: left !important; }
          .i364-statrail { grid-template-columns: minmax(0,1fr) !important; }
        }
      `}</style>

      {/* ══ NAV ════════════════════════════════════════════════════════════ */}
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
          gap: 18,
          /* Quatre propriétés qui bougent : fond, flou, filet, hauteur. */
          padding: scrolled ? "12px clamp(20px, 5vw, 64px)" : "22px clamp(20px, 5vw, 64px)",
          background: scrolled ? "rgba(251,248,248,0.94)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(126%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(126%)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          transition: "all .55s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <a
          href="#top"
          style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, textDecoration: "none" }}
        >
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={marque}
              style={{ height: 32, maxWidth: 168, objectFit: "contain", display: "block" }}
            />
          ) : (
            <>
              <Footprints size={17} color={C.accent} style={{ flexShrink: 0 }} />
              <span
                style={{
                  fontFamily: SERIF,
                  fontSize: 21,
                  fontWeight: 500,
                  letterSpacing: "0.012em",
                  color: C.ink,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {marque}
              </span>
            </>
          )}
        </a>

        <div className="i364-navlinks" style={{ display: "flex", gap: "clamp(14px, 2vw, 30px)", alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a
              key={l}
              href={h}
              className="i364-navlink"
              onMouseEnter={() => setNavHover(l)}
              onMouseLeave={() => setNavHover(null)}
              style={{
                color: navHover === l ? C.ink : C.textMuted,
                fontSize: 13.5,
                fontWeight: 500,
                letterSpacing: "0.015em",
                textDecoration: "none",
                padding: "12px 2px",
                transition: "color .45s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {l}
            </a>
          ))}
          <a
            href={telHref}
            style={{
              background: C.accentDark,
              color: C.white,
              borderRadius: 2,
              padding: "12px 24px",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "background .45s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            Prendre RDV
          </a>
        </div>

        {/* L'appel à l'action sous le pouce : la barre est fixe, mais son
            bouton vit dans le menu déroulant, en display:none sous le point
            de rupture. Celui-ci paraît exactement avec le bouton de menu. */}
        <ActionMobile href={telHref} fond={C.accent} encre={C.white}>
          Appeler
        </ActionMobile>
        <button
          className="i364-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          aria-expanded={mobileOpen}
          style={{
            display: "none",
            flexDirection: "column",
            justifyContent: "center",
            gap: 5,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 10,
            minWidth: 44,
            minHeight: 44,
          }}
        >
          <span
            style={{
              display: "block",
              width: 24,
              height: 1.5,
              background: C.ink,
              transition: "transform .4s cubic-bezier(0.16, 1, 0.3, 1)",
              transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none",
            }}
          />
          <span
            style={{
              display: "block",
              width: 24,
              height: 1.5,
              background: C.ink,
              transition: "opacity .3s",
              opacity: mobileOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              display: "block",
              width: 24,
              height: 1.5,
              background: C.ink,
              transition: "transform .4s cubic-bezier(0.16, 1, 0.3, 1)",
              transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none",
            }}
          />
        </button>
      </nav>

      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: 64,
            left: 0,
            right: 0,
            zIndex: 99,
            background: C.bg,
            borderBottom: `1px solid ${C.border}`,
            padding: "18px clamp(20px, 5vw, 40px) 26px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {NAV.map(({ l, h }) => (
            <a
              key={l}
              href={h}
              onClick={() => setMobileOpen(false)}
              style={{
                color: C.ink,
                fontFamily: SERIF,
                fontSize: 20,
                textDecoration: "none",
                padding: "12px 0",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              {l}
            </a>
          ))}
          <a
            href={telHref}
            style={{
              background: C.accentDark,
              color: C.white,
              borderRadius: 2,
              padding: "14px 22px",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
              textAlign: "center",
              marginTop: 14,
            }}
          >
            Prendre RDV
          </a>
        </div>
      )}

      {/* ══ HÉROS — H4 éditorial décalé ════════════════════════════════════ */}
      <section
        id="top"
        className="i364-hero"
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          background: C.bg,
          overflow: "hidden",
        }}
      >
        {/* ── HERO — diagonale asymétrique ────────────────────────────────
               Le panneau de chiffres n'est plus une carte posée à droite du
               titre : c'est une masse teintée, taillée en biais sur le bord
               droit, et la parole vit dans le grand pan qu'elle laisse. La
               coupe penche comme une voûte plantaire — et dans l'autre sens
               que les diagonales d'impact-334 et d'impact-354. */}
        <TitreDeLaPage session={sessionData} />

        {/* Chiffre fantôme : le nombre de minutes du soin. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "-3vw",
            bottom: "-7vh",
            fontFamily: SERIF,
            fontSize: "clamp(220px, 34vw, 520px)",
            lineHeight: 0.72,
            color: C.accentDark,
            opacity: 0.06,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          45
        </div>

        {/* ── La masse teintée, en biais sur le bord droit ───────────────── */}
        <aside className="i364-masse" aria-label="Le cabinet en bref">
          <div className="i364-masse-int">
            <Kicker color={C.accentDark}>Le cabinet en bref</Kicker>
            <div className="i364-statrail" style={{ marginTop: 18 }}>
              {STATS.map((s: any, n: number) => (
                <Reveal key={(s.label ?? "") + n} delay={n * 0.055}>
                  <div style={{ padding: "13px 0", borderTop: n === 0 ? "none" : `1px solid ${C.border}` }}>
                    <div style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(24px, 2.4vw, 32px)", lineHeight: 1, color: C.accentDark }}>{s.value}</div>
                    <div style={{ fontFamily: SANS, fontSize: 12, lineHeight: 1.55, color: C.textMuted, marginTop: 6 }}>{s.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Le pan de parole ───────────────────────────────────────────── */}
        <div className="i364-lead">
          <Kicker>
            {clientEyebrow(sessionData) ?? `${metier} · ${ville}`}
          </Kicker>

          <div
            className="i364-title"
            style={{
              fontFamily: SERIF,
              fontWeight: 300,
              fontSize: "clamp(36px, 5.8vw, 80px)",
              lineHeight: 0.99,
              letterSpacing: "-0.018em",
              color: C.ink,
              margin: "clamp(18px, 2.4vw, 30px) 0 0",
            }}
          >
            <LineMask lines={S.lines} index={i} />
          </div>

          <p
            style={{
              fontFamily: SANS,
              fontSize: "clamp(14.5px, 1.15vw, 16.5px)",
              color: C.textMuted,
              lineHeight: 1.78,
              maxWidth: 500,
              margin: "clamp(18px, 2.4vw, 28px) 0 clamp(24px, 2.8vw, 32px)",
            }}
          >
            {clientAccrocheRestante(sessionData, 2, 20) ??
              c?.heroSubline ??
              "Un cabinet qui prend le temps : soins de pédicurie sans douleur, semelles discrètes, attention particulière aux pieds âgés et aux pieds abîmés par la vie."}
          </p>

          {/* Une seule action pleine ; les soins restent un lien. */}
          <div style={{ display: "flex", gap: "clamp(16px, 2vw, 26px)", flexWrap: "wrap", alignItems: "center" }}>
            <motion.a
              href={telHref}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.45, ease: EASE }}
              style={{
                background: C.accentDark,
                color: C.white,
                borderRadius: 2,
                padding: "16px 32px",
                fontWeight: 600,
                fontSize: 12.5,
                letterSpacing: "0.13em",
                textTransform: "uppercase",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 10px 26px rgba(125,59,58,0.16), 0 2px 6px rgba(125,59,58,0.10)",
              }}
            >
              Prendre rendez-vous <ArrowRight size={15} />
            </motion.a>
            <a
              href="#services"
              style={{ color: C.ink, borderBottom: `1px solid ${C.accent}`, padding: "6px 2px", fontFamily: SERIF, fontSize: 18, textDecoration: "none" }}
            >
              Voir les soins
            </a>
          </div>

          {clientHeroPrestations(sessionData) && (
            <p style={{ fontSize: 12.5, color: C.textFaint, letterSpacing: "0.06em", marginTop: 20 }}>
              {clientHeroPrestations(sessionData)}
            </p>
          )}

          {/*
            Le soin montré, et de quoi passer aux autres. La fraction
            « 01 / 03 » ne disait pas ce qu'on regardait.
          */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 18, marginTop: "clamp(26px, 4vh, 44px)", paddingTop: 18, borderTop: `1px solid ${C.border}`, flexWrap: "wrap", maxWidth: 560 }}
          >
            <span style={{ fontSize: 13, color: C.textMuted, minWidth: 0, lineHeight: 1.6 }}>
              <strong style={{ color: C.ink, fontWeight: 600 }}>{S.k}</strong> — {S.sub}
            </span>
            <div style={{ display: "flex", gap: 8, flexShrink: 0, marginLeft: "auto" }}>
              {HERO.map((h: any, n: number) => (
                <button
                  key={h.k ?? n}
                  type="button"
                  onClick={() => go(n)}
                  aria-label={h.k ?? `Soin ${n + 1}`}
                  aria-current={n === i}
                  style={{ width: 34, height: 3, padding: 0, border: "none", borderRadius: 2, cursor: "pointer", background: n === i ? C.accentDark : C.border, transition: "background .3s" }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ RESPIRATION ════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          background: C.bg,
          padding: "clamp(56px, 9vw, 108px) clamp(20px, 5vw, 64px)",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Le détail gratuit : une arche de 1 px qui respire, très lentement. */}
        <div
          aria-hidden
          className="i364-arc"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(460px, 68vw)",
            height: "min(460px, 68vw)",
            borderRadius: "50%",
            border: `1px solid ${C.accent}`,
            opacity: 0.5,
            pointerEvents: "none",
          }}
        />
        <Reveal>
          <p
            style={{
              position: "relative",
              fontFamily: SERIF,
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(24px, 3.4vw, 42px)",
              lineHeight: 1.32,
              letterSpacing: "-0.008em",
              color: C.ink,
              maxWidth: 700,
              margin: "0 auto",
            }}
          >
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (
              <>
                On repart plus léger, <span style={{ color: C.accent }}>littéralement.</span>
              </>
            )}
          </p>
        </Reveal>
      </section>

      {/* ══ SOINS — rangées éditoriales numérotées ═════════════════════════ */}
      <section
        id="services"
        style={{
          background: C.bgAlt,
          padding: "clamp(64px, 9vw, 128px) clamp(20px, 5vw, 64px)",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <Reveal>
            <div className="i364-metagrid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,0.85fr)", gap: "clamp(24px, 4vw, 64px)", alignItems: "end", marginBottom: "clamp(36px, 5vw, 62px)" }}>
              <div>
                <Kicker>Les soins</Kicker>
                <h2
                  style={{
                    fontFamily: SERIF,
                    fontWeight: 300,
                    fontSize: "clamp(30px, 4.4vw, 56px)",
                    lineHeight: 1.06,
                    letterSpacing: "-0.016em",
                    color: C.ink,
                    marginTop: 18,
                  }}
                >
                  {/* TEXTE_SECTION */ clientText(sessionData, "soins.titre") ?? (
                    <>
                      Le pied a le droit
                      <br />
                      <em style={{ color: C.accent }}>d'être bien traité.</em>
                    </>
                  )}
                </h2>
              </div>
              <p style={{ fontSize: 14.5, color: C.textMuted, lineHeight: 1.75, maxWidth: 460 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "soins.intro") ??
                  "Chaque prestation dure ce qu'elle doit durer. Rien n'est enchaîné, rien n'est vendu en plus de ce qui soulage."}
              </p>
            </div>
          </Reveal>

          <Hairline />

          <div>
            {SERVICES.map((s: any, n: number) => (
              <Reveal key={(s.titre ?? "") + n} delay={Math.min(n, 5) * 0.055}>
                <div
                  className="i364-servrow i364-row"
                  onMouseEnter={() => setLigneSurvol(n)}
                  onMouseLeave={() => setLigneSurvol(null)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0,88px) minmax(0,1fr) minmax(0,1.25fr)",
                    gap: "clamp(14px, 2.4vw, 40px)",
                    alignItems: "start",
                    padding: "clamp(22px, 2.6vw, 34px) clamp(10px, 1.4vw, 22px)",
                    /* L'alternance éditoriale : une rangée sur deux rentre. */
                    paddingLeft: n % 2 === 1 ? "clamp(10px, 4.5vw, 76px)" : "clamp(10px, 1.4vw, 22px)",
                    borderBottom: `1px solid ${C.border}`,
                    background: ligneSurvol === n ? C.bgCard : "transparent",
                    transform: ligneSurvol === n ? "translateY(-2px)" : "none",
                    boxShadow:
                      ligneSurvol === n
                        ? "0 16px 38px rgba(39,29,31,0.07), 0 2px 8px rgba(39,29,31,0.05)"
                        : "0 0 0 rgba(0,0,0,0)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: SERIF,
                      fontSize: "clamp(30px, 3.4vw, 46px)",
                      lineHeight: 0.9,
                      color: C.accent,
                      opacity: ligneSurvol === n ? 0.9 : 0.32,
                      transition: "opacity .5s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    {String(n + 1).padStart(2, "0")}
                  </div>

                  <div>
                    <h3
                      style={{
                        fontFamily: SERIF,
                        fontWeight: 400,
                        fontSize: "clamp(20px, 1.9vw, 26px)",
                        lineHeight: 1.18,
                        color: C.ink,
                        margin: 0,
                        transform: ligneSurvol === n ? "translateX(4px)" : "none",
                        transition: "transform .5s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      {s.titre}
                    </h3>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10, flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: C.accentDark,
                        }}
                      >
                        {s.tag}
                      </span>
                      {s.prix ? (
                        <span style={{ fontFamily: SERIF, fontSize: 17, color: C.textMuted }}>{s.prix}</span>
                      ) : null}
                    </div>
                  </div>

                  <p style={{ fontSize: 14.5, color: C.textMuted, lineHeight: 1.72, margin: 0, maxWidth: 520 }}>
                    {s.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ LE DÉROULÉ — timeline filetée ══════════════════════════════════ */}
      <section
        id="methode"
        style={{
          position: "relative",
          background: C.bg,
          padding: "clamp(64px, 9vw, 128px) clamp(20px, 5vw, 64px)",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: "-6vw",
            top: "8%",
            fontFamily: SERIF,
            fontSize: "clamp(180px, 26vw, 400px)",
            lineHeight: 0.7,
            color: C.accent,
            opacity: 0.055,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          IV
        </div>

        <div style={{ position: "relative", maxWidth: 980, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(34px, 5vw, 58px)" }}>
              <Kicker>Le déroulé</Kicker>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontWeight: 300,
                  fontSize: "clamp(30px, 4.4vw, 56px)",
                  lineHeight: 1.06,
                  letterSpacing: "-0.016em",
                  color: C.ink,
                  marginTop: 18,
                }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                  <>
                    Un soin,
                    <br />
                    <em style={{ color: C.accent }}>pas un passage à l'usine.</em>
                  </>
                )}
              </h2>
            </div>
          </Reveal>

          <div style={{ position: "relative", paddingLeft: "clamp(28px, 4vw, 56px)" }}>
            {/* Le filet vertical de la timeline. */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: "clamp(6px, 1.2vw, 14px)",
                top: 8,
                bottom: 8,
                width: 1,
                background: `linear-gradient(to bottom, transparent 0%, ${C.accent} 12%, ${C.accent} 84%, transparent 100%)`,
                opacity: 0.4,
              }}
            />
            {METHODE.map((m: any, n: number) => (
              <Reveal key={(m.n ?? "") + n} delay={n * 0.055}>
                <div style={{ position: "relative", paddingBottom: n === METHODE.length - 1 ? 0 : "clamp(28px, 3.6vw, 46px)" }}>
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: "calc(-1 * clamp(28px, 4vw, 56px) + clamp(1px, 0.5vw, 9px))",
                      top: 10,
                      width: 11,
                      height: 11,
                      borderRadius: "50%",
                      background: C.bg,
                      border: `1px solid ${C.accent}`,
                    }}
                  />
                  <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: SERIF, fontSize: 26, color: C.accent, opacity: 0.55 }}>{m.n}</span>
                    <h3
                      style={{
                        fontFamily: SERIF,
                        fontWeight: 400,
                        fontSize: "clamp(20px, 2vw, 27px)",
                        color: C.ink,
                        margin: 0,
                      }}
                    >
                      {m.t}
                    </h3>
                  </div>
                  <p
                    style={{
                      fontSize: 14.5,
                      color: C.textMuted,
                      lineHeight: 1.75,
                      maxWidth: 560,
                      margin: "10px 0 0",
                    }}
                  >
                    {m.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ LE CABINET — engagements en split ══════════════════════════════ */}
      <section
        id="engagements"
        style={{ background: C.bgAlt, padding: "clamp(64px, 9vw, 128px) clamp(20px, 5vw, 64px)" }}
      >
        <div
          className="i364-split"
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(0,0.92fr) minmax(0,1.08fr)",
            gap: "clamp(30px, 5vw, 74px)",
            alignItems: "center",
          }}
        >
          <Reveal>
            <PhotoBox
              src={photo(0, PHOTO_SOIN_DEMO)}
              alt="Séance de soin du pied"
              ratio="4/5"
              ghost="45"
            />
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              <Kicker>Le cabinet</Kicker>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontWeight: 300,
                  fontSize: "clamp(28px, 3.6vw, 46px)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.014em",
                  color: C.ink,
                  margin: "18px 0 26px",
                }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>
                    Sérieuse sur l'hygiène,
                    <br />
                    <em style={{ color: C.accent }}>douce sur le reste.</em>
                  </>
                )}
              </h2>
              <div>
                {ENGAGEMENT.map((e: string, n: number) => (
                  <div
                    key={n}
                    style={{
                      display: "flex",
                      gap: 13,
                      alignItems: "flex-start",
                      padding: "13px 0",
                      borderTop: n === 0 ? "none" : `1px solid ${C.border}`,
                    }}
                  >
                    <CheckCircle size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                    <span style={{ fontSize: 14.5, color: C.textMuted, lineHeight: 1.68 }}>{e}</span>
                  </div>
                ))}
              </div>
              <motion.a
                href={telHref}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.45, ease: EASE }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 9,
                  marginTop: 28,
                  background: C.accentDark,
                  color: C.white,
                  borderRadius: 2,
                  padding: "14px 28px",
                  fontWeight: 600,
                  fontSize: 12.5,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  boxShadow: "0 10px 26px rgba(125,59,58,0.14), 0 2px 6px rgba(125,59,58,0.10)",
                }}
              >
                Nous appeler <ArrowRight size={15} />
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ TARIFS — table fine ════════════════════════════════════════════ */}
      <section id="tarifs" style={{ background: C.bg, padding: "clamp(64px, 9vw, 128px) clamp(20px, 5vw, 64px)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "clamp(28px, 4vw, 46px)" }}>
              <Kicker align="center">Tarifs</Kicker>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontWeight: 300,
                  fontSize: "clamp(30px, 4.2vw, 52px)",
                  lineHeight: 1.06,
                  letterSpacing: "-0.016em",
                  color: C.ink,
                  margin: "18px 0 0",
                }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                  <>
                    Doux aussi <em style={{ color: C.accent }}>pour le budget.</em>
                  </>
                )}
              </h2>
              <p
                style={{
                  fontSize: 14.5,
                  color: C.textMuted,
                  maxWidth: 540,
                  margin: "16px auto 0",
                  lineHeight: 1.72,
                }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.mention") ??
                  "Pédicurie non remboursée sauf pied diabétique gradé ; semelles partiellement prises en charge sur prescription. Tout est annoncé avant."}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div style={{ borderTop: `1px solid ${C.ink}` }}>
              <div
                className="i364-tarifrow"
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0,1fr) minmax(0,160px)",
                  gap: 18,
                  padding: "12px 6px",
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: C.textFaint,
                  }}
                >
                  Prestation
                </span>
                <span
                  className="i364-tarifprice"
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: C.textFaint,
                    textAlign: "right",
                  }}
                >
                  Tarif
                </span>
              </div>

              {TARIFS.map((t: any, n: number) => (
                <div
                  key={(t.a ?? "") + n}
                  className="i364-tarifrow i364-row"
                  onMouseEnter={() => setTarifSurvol(n)}
                  onMouseLeave={() => setTarifSurvol(null)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0,1fr) minmax(0,160px)",
                    gap: 18,
                    alignItems: "baseline",
                    padding: "clamp(18px, 2vw, 26px) clamp(6px, 1.2vw, 16px)",
                    borderBottom: `1px solid ${C.border}`,
                    background: tarifSurvol === n ? C.accentLight : "transparent",
                    transform: tarifSurvol === n ? "translateY(-1px)" : "none",
                    boxShadow:
                      tarifSurvol === n
                        ? "0 12px 30px rgba(39,29,31,0.06), 0 2px 6px rgba(39,29,31,0.05)"
                        : "0 0 0 rgba(0,0,0,0)",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: SERIF, fontSize: "clamp(19px, 1.8vw, 24px)", color: C.ink }}>
                      {t.a}
                    </div>
                    <div style={{ fontSize: 13, color: C.textFaint, marginTop: 7, lineHeight: 1.62 }}>{t.n}</div>
                  </div>
                  <div
                    className="i364-tarifprice"
                    style={{
                      fontFamily: SERIF,
                      fontSize: "clamp(20px, 2vw, 26px)",
                      color: C.accentDark,
                      textAlign: "right",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.p}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ AVIS — spotlight rotatif ═══════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          background: C.bgDark,
          padding: "clamp(66px, 10vw, 136px) clamp(20px, 5vw, 64px)",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            top: "-30%",
            transform: "translateX(-50%)",
            width: "min(90vw, 900px)",
            height: "min(90vw, 900px)",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C.blush} 0%, rgba(43,29,33,0) 66%)`,
            opacity: 0.1,
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <Kicker color={C.blush} align="center">
              Ce qu'elles en disent
            </Kicker>
            <h2
              style={{
                fontFamily: SERIF,
                fontWeight: 300,
                fontSize: "clamp(28px, 4vw, 50px)",
                lineHeight: 1.06,
                letterSpacing: "-0.016em",
                color: C.white,
                margin: "18px 0 clamp(30px, 4.4vw, 52px)",
              }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                <>
                  Des pieds <em style={{ color: C.blush }}>réconciliés</em>.
                </>
              )}
            </h2>
          </Reveal>

          <div style={{ minHeight: "clamp(210px, 26vw, 250px)", display: "grid", alignContent: "center" }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.blockquote
                key={avisActif}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
                transition={{ duration: reduce ? 0.2 : 0.55, ease: EASE }}
                style={{ margin: 0 }}
              >
                <p
                  style={{
                    fontFamily: SERIF,
                    fontStyle: "italic",
                    fontWeight: 300,
                    fontSize: "clamp(20px, 2.6vw, 31px)",
                    lineHeight: 1.5,
                    color: "rgba(255,255,255,0.90)",
                    margin: "0 auto",
                    maxWidth: 720,
                  }}
                >
                  « {avis?.texte} »
                </p>
                <footer style={{ marginTop: 26 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: C.white, letterSpacing: "0.04em" }}>
                    {avis?.auteur}
                  </div>
                  <div style={{ fontSize: 12, color: C.blush, marginTop: 6, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    {avis?.detail}
                  </div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: "clamp(24px, 3.4vw, 40px)" }}>
            {AVIS.map((a: any, n: number) => (
              <button
                key={(a.auteur ?? "") + n}
                type="button"
                onClick={() => setAvisActif(n)}
                aria-label={`Témoignage ${n + 1}`}
                style={{
                  minWidth: 44,
                  minHeight: 44,
                  display: "grid",
                  placeItems: "center",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <span
                  style={{
                    display: "block",
                    width: avisActif === n ? 34 : 16,
                    height: 1,
                    background: avisActif === n ? C.blush : "rgba(255,255,255,0.30)",
                    transition: "width .5s cubic-bezier(0.16, 1, 0.3, 1), background .5s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTACT ════════════════════════════════════════════════════════ */}
      <section
        id="contact"
        style={{
          background: C.accentLight,
          padding: "clamp(64px, 9vw, 128px) clamp(20px, 5vw, 64px)",
          textAlign: "center",
        }}
      >
        <Reveal>
          <Kicker align="center">Prenez soin de vous</Kicker>
          <h2
            style={{
              fontFamily: SERIF,
              fontWeight: 300,
              fontSize: "clamp(30px, 4.6vw, 58px)",
              lineHeight: 1.04,
              letterSpacing: "-0.018em",
              color: C.ink,
              margin: "20px 0 18px",
            }}
          >
            {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
              <>
                45 minutes pour vos pieds,
                <br />
                <em style={{ color: C.accent }}>des semaines de confort.</em>
              </>
            )}
          </h2>
          <p style={{ fontSize: 15.5, color: C.textMuted, maxWidth: 470, margin: "0 auto clamp(28px, 4vw, 40px)", lineHeight: 1.72 }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ??
              "Rendez-vous en ligne ou par téléphone. Le jeudi est réservé aux visites à domicile."}
          </p>
          <div style={{ display: "flex", gap: 13, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a
              href={telHref}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.45, ease: EASE }}
              style={{
                background: C.accentDark,
                color: C.white,
                borderRadius: 2,
                padding: "17px 34px",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 12px 30px rgba(125,59,58,0.18), 0 2px 6px rgba(125,59,58,0.12)",
              }}
            >
              <Phone size={17} /> {phone}
            </motion.a>
            <motion.a
              href={`mailto:${mail}`}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.45, ease: EASE }}
              style={{
                background: "transparent",
                color: C.ink,
                border: `1px solid ${C.accent}`,
                borderRadius: 2,
                padding: "16px 32px",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Mail size={17} /> Nous écrire
            </motion.a>
          </div>
          <p style={{ fontSize: 13, color: C.textFaint, marginTop: 26, letterSpacing: "0.03em" }}>
            <MapPin size={13} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />
            {lieu}
          </p>
        </Reveal>
      </section>

      {/* ══ PIED DE PAGE ═══════════════════════════════════════════════════ */}
      <footer style={{ background: C.bgDarkAlt, padding: "clamp(44px, 6vw, 68px) clamp(20px, 5vw, 64px) 24px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 30,
              marginBottom: 32,
            }}
          >
            <div style={{ maxWidth: 380 }}>
              <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 400, color: C.blush, marginBottom: 12 }}>
                {marque}
              </div>
              <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 13, lineHeight: 1.75 }}>
                Pédicure-podologue D.E. · {ville}
                <br />
                Ordre national des pédicures-podologues
              </p>
              {clientTagline(sessionData) ? (
                <p style={{ color: "rgba(255,255,255,0.30)", fontSize: 12.5, lineHeight: 1.7, marginTop: 12, fontStyle: "italic", fontFamily: SERIF }}>
                  {clientTagline(sessionData)}
                </p>
              ) : null}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <MapPin size={13} />, t: lieu },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Mail size={13} />, t: mail },
                { icon: <Clock size={13} />, t: "Lun–Ven 9h–19h" },
              ].map((item, n) => (
                <div
                  key={n}
                  style={{
                    display: "flex",
                    gap: 10,
                    color: "rgba(255,255,255,0.46)",
                    fontSize: 13,
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: C.blush, display: "inline-flex" }}>{item.icon}</span>
                  {item.t}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.09)",
              paddingTop: 16,
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.28)", fontSize: 12 }}>
              © 2026 {marque} — Site réalisé par Aevia WS · SIREN{" "}
              <LegalIdentity fallback="852 546 225" kind="siren" />
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
