"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Clock, Factory, Mail, MapPin, Phone } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, ExpandFrame, HairlineArrows, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
import { ActionMobile } from "@/lib/templates/ActionMobile";
import {
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
   HALLE 1897 — halle de réception en usine textile · Roubaix

   Archétype H8 (bento, tuiles inégales) · paire P9 (Syne + Work Sans) ·
   palette sombre #14130f / laiton #c9a35e · signature « poutrelles » : des
   filets dégradés d'un pixel, des rivets en radial-gradient et des chiffres
   fantômes de charpente. Geste unique : ExpandFrame — le cadre qui s'ouvre,
   du plan de masse à la halle entière.

   Les URLs de photographies sont celles du thème : on ne les remplace pas et
   on n'en invente pas.
   ════════════════════════════════════════════════════════════════════════════ */

let C: Record<string, string> = {
  bg: "#14130f",
  bgAlt: "#1b1a15",
  bgDark: "#0c0b08",
  bgDarkAlt: "#080706",
  bgCard: "#1f1d17",
  accent: "var(--brand,#c9a35e)",
  accentDark: "var(--brand-light,#e2c28c)",
  accentLight: "#241f16",
  ink: "#f5f1e6",
  textMuted: "#a9a191",
  textFaint: "#726c5f",
  border: "rgba(201,163,94,0.20)",
  white: "#f5f1e6",
  /* Clé métier : la teinte des poutrelles rivetées de 1897. */
  poutrelle: "rgba(201,163,94,0.09)",
};

const DISPLAY = "'Syne', 'Trebuchet MS', system-ui, sans-serif";
const BODY = "'Work Sans', system-ui, -apple-system, 'Segoe UI', sans-serif";
/* Une seule courbe pour toute la page, répétée littéralement en CSS. */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_CSS = "cubic-bezier(.16,1,.3,1)";

const NAV = [
  { l: "La halle", h: "#services" },
  { l: "Votre événement", h: "#methode" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* ── Données de démonstration ───────────────────────────────────────────────
   Rien n'est inventé ici : ce sont les textes du thème, réorganisés pour les
   nouvelles sections. Chaque bloc a sa fonction _LIVE(), ré-appelée dans
   Page() après affectation de sessionData — une constante de module serait
   évaluée à l'import, donc avant toute session.                              */

function HERO_SOURCE_LIVE() {
  return [
    {
      k: "La nef",
      sub: "600 m² sous verrière, 12 m sous ferme métallique.",
      img:
        clientPhotos(sessionData)[1] ||
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80",
      alt: "La nef dressée pour un dîner de gala",
      chiffre: "600 m²",
    },
    {
      k: "Le studio",
      sub: "200 m² attenants : cocktails, backstage ou plateau photo.",
      img:
        clientPhotos(sessionData)[2] ||
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=80",
      alt: "Le studio attenant aménagé",
      chiffre: "200 m²",
    },
    {
      k: "La cour",
      sub: "La brique, la nuit, les guirlandes : le spot photo de Roubaix.",
      img:
        clientPhotos(sessionData)[3] ||
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920&q=80",
      alt: "La cour intérieure éclairée",
      chiffre: "1897",
    },
  ];
}
let HERO_SOURCE = HERO_SOURCE_LIVE();
let HERO = HERO_SOURCE;

const SERVICES_SOURCE = [
  {
    titre: "La nef sous verrière",
    desc: "600 m² modulables, sol béton lissé, murs de brique : le décor est déjà là. Gradins, scène et mobilier disponibles sur place.",
    tag: "Nef",
    n: "01",
  },
  {
    titre: "Technique intégrée",
    desc: "Son 20 kW calibré, lumières scéniques, vidéoprojection 10 000 lumens, régisseur de la maison inclus dès 100 personnes.",
    tag: "Technique",
    n: "02",
  },
  {
    titre: "Le studio & la cour",
    desc: "200 m² attenants pour cocktail ou backstage, cour de brique pour les pauses et les photos de nuit.",
    tag: "Annexes",
    n: "03",
  },
  {
    titre: "Mariages urbains",
    desc: "Cérémonie sous la verrière, dîner dans la nef, DJ jusqu'à 4 h : l'insonorisation d'une ancienne usine a du bon.",
    tag: "Mariage",
    n: "04",
  },
  {
    titre: "Entreprises & lancements",
    desc: "Keynotes, salons internes, soirées annuelles : accès camions, wifi fibre, loges — et Lille à 15 minutes.",
    tag: "Corporate",
    n: "05",
  },
  {
    titre: "Tournages & shootings",
    desc: "La brique 1897 à la journée : plateaux, clips, mode. Fiche technique complète envoyée sur demande.",
    tag: "Image",
    n: "06",
  },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE = [
  {
    n: "01",
    t: "Visite technique",
    d: "Avec notre régisseur : implantation, flux, accès camions, puissance — les vraies questions dès le premier jour.",
  },
  {
    n: "02",
    t: "Devis modulaire",
    d: "La halle, la technique, le personnel : trois blocs chiffrés séparément. Vous ne payez pas ce que vous n'utilisez pas.",
  },
  {
    n: "03",
    t: "Fiche technique validée",
    d: "Plan d'implantation signé, prestataires briefés par nos soins, run de la journée écrit heure par heure.",
  },
  {
    n: "04",
    t: "Régie le jour J",
    d: "Notre régisseur reste : le son, la lumière et les imprévus sont son problème, pas le vôtre.",
  },
];

const ENGAGEMENT_DEMO = [
  "ERP type L contrôlé : commission de sécurité, capacités affichées et respectées",
  "Insonorisation d'usine : fêtes jusqu'à 4 h sans conflit de voisinage",
  "Accessibilité PMR complète, parkings à 200 m, métro à 6 minutes",
  "Régisseur de la maison obligatoire dès 100 personnes — c'est lui qui connaît la machine",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

const TARIFS_DEMO = [
  { a: "La nef — soirée (18h-4h)", p: "3 400 €", n: "600 m², son et lumières de base, régisseur inclus." },
  { a: "Nef + studio + cour — week-end", p: "5 900 €", n: "Du samedi 9 h au dimanche 15 h, mariages et galas." },
  { a: "Journée corporate (8h-20h)", p: "2 600 €", n: "Plénière jusqu'à 250 assis, vidéoprojection, wifi fibre, loges." },
  { a: "Journée tournage", p: "1 500 €", n: "Plateau nu, accès camion, électricité 63 A, fiche technique fournie." },
];
let TARIFS = TARIFS_DEMO;

const AVIS_SOURCE = [
  {
    texte:
      "Mariage de 180 personnes sous la verrière : la cérémonie à la lumière du soir, le dîner dans la nef, le DJ jusqu'à 4 h. Le régisseur a géré une panne de traiteur sans que personne ne s'en aperçoive.",
    auteur: "Lisa & Karim",
    detail: "Mariage urbain",
  },
  {
    texte:
      "Lancement produit devant 300 invités : accès camions impeccable, son calibré, keynote au cordeau. Le lieu a fait le buzz autant que le produit.",
    auteur: "Dir. marketing, marque lilloise",
    detail: "Lancement produit",
  },
  {
    texte:
      "Trois jours de tournage : électricité stable, régisseur qui connaît chaque recoin, brique magnifique à l'image. On revient au printemps.",
    auteur: "Prod. audiovisuelle parisienne",
    detail: "Tournage",
  },
];
let AVIS_DEMO = AVIS_SOURCE;

const STATS_DEMO = [
  { value: "600 m²", label: "Sous la verrière" },
  { value: "400", label: "Debout · 250 assis" },
  { value: "1897", label: "La halle, textile d'origine" },
  { value: "20 kW", label: "De son installé, calibré" },
];
let STATS = STATS_DEMO;

/* ── Primitives ────────────────────────────────────────────────────────────── */

/** Sur-titre 11px filé d'un trait de 40×1px — la règle du chantier. */
function Kicker({ children, color = C.accent, align = "left" }: any) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        justifyContent: align === "center" ? "center" : "flex-start",
      }}
    >
      <span style={{ width: 40, height: 1, background: color, opacity: 0.8, flexShrink: 0 }} />
      <span
        style={{
          fontFamily: BODY,
          fontSize: 11,
          letterSpacing: "0.36em",
          textTransform: "uppercase",
          color,
          fontWeight: 600,
        }}
      >
        {children}
      </span>
    </div>
  );
}

function Reveal({ children, delay = 0, y = 28, style }: any) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -8% 0px" });
  return (
    <motion.div
      ref={ref}
      style={style}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Poutrelle : un filet dégradé d'un pixel, ponctué de deux rivets. */
function Poutrelle({ vertical = false, opacity = 1 }: any) {
  const line = vertical
    ? {
        width: 1,
        height: "100%",
        background: `linear-gradient(to bottom, transparent, ${C.accent}, transparent)`,
      }
    : {
        height: 1,
        width: "100%",
        background: `linear-gradient(to right, transparent, ${C.accent}, transparent)`,
      };
  return <div aria-hidden style={{ ...line, opacity: 0.35 * opacity, pointerEvents: "none" }} />;
}

/** Chiffre fantôme de charpente, posé en fond de section. */
function ChiffreFantome({ children, top, right, size = "clamp(9rem,22vw,22rem)" }: any) {
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        top,
        right,
        fontFamily: DISPLAY,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 0.8,
        color: C.accent,
        opacity: 0.07,
        pointerEvents: "none",
        userSelect: "none",
        letterSpacing: "-0.04em",
      }}
    >
      {children}
    </span>
  );
}

/** Bouton laiton : élévation + deux ombres + accent, en 0,5 s. */
function BoutonLaiton({ href, children, plein = true, large = false }: any) {
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
        padding: large ? "17px 34px" : "14px 28px",
        fontFamily: BODY,
        fontSize: large ? 15 : 14,
        fontWeight: 600,
        letterSpacing: "0.06em",
        textDecoration: "none",
        borderRadius: 2,
        border: `1px solid ${plein ? (h ? C.accentDark : C.accent) : h ? C.accent : C.border}`,
        background: plein ? (h ? C.accentDark : C.accent) : h ? C.accentLight : "transparent",
        color: plein ? C.bgDark : h ? C.accentDark : C.ink,
        transform: h ? "translateY(-3px)" : "none",
        boxShadow: h
          ? `0 18px 40px -18px rgba(201,163,94,0.55), 0 3px 12px -6px rgba(0,0,0,0.55)`
          : "0 0 0 0 rgba(0,0,0,0)",
        transition: `all .5s ${EASE_CSS}`,
        minHeight: 44,
      }}
    >
      {children}
      <ArrowRight
        size={15}
        style={{ transform: h ? "translateX(5px)" : "none", transition: `transform .5s ${EASE_CSS}` }}
      />
    </a>
  );
}

function NavLien({ l, h }: any) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={h}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        fontFamily: BODY,
        fontSize: 13.5,
        fontWeight: 500,
        letterSpacing: "0.04em",
        color: hov ? C.ink : C.textMuted,
        textDecoration: "none",
        padding: "12px 2px",
        transition: `color .45s ${EASE_CSS}`,
      }}
    >
      {l}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          bottom: 6,
          height: 1,
          width: hov ? "100%" : "0%",
          background: C.accent,
          transition: `width .5s ${EASE_CSS}`,
        }}
      />
    </a>
  );
}

function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || fallback;
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════════════ */
export default function Halle1897Page() {
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

  /* Les blocs vivants sont recalculés ici, session en main. */
  HERO_SOURCE = HERO_SOURCE_LIVE();
  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...SERVICES_SOURCE[i % SERVICES_SOURCE.length],
      titre: s.title,
    })),
    SERVICES_SOURCE,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      ...AVIS_SOURCE[i % AVIS_SOURCE.length],
      auteur: r.author,
      texte: r.text,
    })),
    AVIS_SOURCE,
  );
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...TARIFS_DEMO[i % TARIFS_DEMO.length],
      a: s.title,
      p: s.price ?? TARIFS_DEMO[i % TARIFS_DEMO.length].p,
      n: s.desc || TARIFS_DEMO[i % TARIFS_DEMO.length].n,
    })),
    TARIFS_DEMO,
  );
  STATS = resolveList(clientStats(sessionData), STATS_DEMO);
  ENGAGEMENT = resolveList(
    clientList(sessionData, "engagements.liste") ?? clientCertifications(sessionData),
    ENGAGEMENT_DEMO,
  );
  /* La photo de chaque tuile suit celle du client quand il en a déposé une. */
  HERO = HERO_SOURCE.map((row: any, i: number) => ({
    ...row,
    img: clientPhotos(sessionData)[i] || row.img,
  }));
  brand = fd?.brandColor ?? null;
  if (brand) {
    C = { ...C, accent: brand };
  }

  const SERVICES = resolveList(
    clientServices(sessionData)?.map((s: any, n: number) => ({
      titre: s.title ?? SERVICES_DEMO[n % SERVICES_DEMO.length].titre,
      desc: s.description ?? s.desc ?? SERVICES_DEMO[n % SERVICES_DEMO.length].desc,
      tag: SERVICES_DEMO[n % SERVICES_DEMO.length].tag,
      n: SERVICES_DEMO[n % SERVICES_DEMO.length].n,
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
  /* Un seul index pilote tout le héros : la tuile média, la légende, la
     fraction, le chiffre fantôme de la tuile de gauche. */
  const { i, go } = useSlides(HERO.length, DWELL.normal);
  const S = HERO[i];
  /* Avis en projecteur : deuxième index, hors héros, à cadence lente. */
  const avis = useSlides(AVIS.length, DWELL.slow);
  const A = AVIS[avis.i];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = clientPhone(sessionData) ?? clientEmail(sessionData) ?? fd?.email ?? "03 20 00 00 01";
  const telHref = `tel:${(clientPhone(sessionData) ?? clientEmail(sessionData) ?? fd?.email ?? "+33320000001").replace(/\s+/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "booking@halle1897.fr";
  const nom = fd?.businessName ?? clientName(sessionData) ?? "Halle 1897";
  const ville = clientCity(sessionData) ?? "Roubaix";
  const metier = clientTrade(sessionData) ?? "Halle événementielle";

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: BODY, overflowX: "clip" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Work+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

        .i370-navlink-row { display: flex; gap: clamp(16px,2vw,30px); align-items: center; }

        /* Bento du héros : six pistes, des tuiles inégales. Les valeurs de
           span vivent ici plutôt qu'en style inline pour que le repli mobile
           n'ait qu'un seul endroit à annuler. */
        .i370-bento { display: grid; grid-template-columns: repeat(6, minmax(0,1fr)); gap: 14px; }
        .i370-t-titre  { grid-column: span 3; }
        .i370-t-media  { grid-column: span 3; grid-row: span 2; min-height: clamp(340px, 44vw, 560px); }
        .i370-t-texte  { grid-column: span 3; }
        .i370-t-stats  { grid-column: span 6; }

        /* Bento des prestations : la première tuile tient deux pistes. */
        .i370-bentoserv { display: grid; grid-template-columns: repeat(6, minmax(0,1fr)); gap: 14px; }
        .i370-s-large { grid-column: span 4; }
        .i370-s-petit { grid-column: span 2; }

        .i370-split { display: grid; grid-template-columns: minmax(0,1.05fr) minmax(0,0.95fr); gap: clamp(32px,5vw,72px); align-items: center; }
        .i370-methode { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 0; }
        .i370-methcell { border-left: 1px solid ${C.border}; padding: 0 clamp(16px,2vw,28px); }
        .i370-statrow { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); }

        @media (max-width: 1000px) {
          .i370-methode { grid-template-columns: repeat(2, minmax(0,1fr)); row-gap: 34px; }
          .i370-s-large, .i370-s-petit { grid-column: span 3; }
        }
        @media (max-width: 900px) {
          #i370-nav { display: none !important; }
          .i370-burger { display: flex !important; }
          .aevia-action-mobile { display: inline-flex !important; }
          .i370-bento { grid-template-columns: 1fr; }
          .i370-t-titre, .i370-t-media, .i370-t-texte, .i370-t-stats { grid-column: span 1 !important; grid-row: auto !important; }
          .i370-t-media { min-height: 300px; }
          .i370-bentoserv { grid-template-columns: 1fr; }
          .i370-s-large, .i370-s-petit { grid-column: span 1 !important; }
          .i370-split { grid-template-columns: 1fr !important; }
          .i370-sticky { position: static !important; }
        }
        @media (max-width: 860px) {
          .i370-statrow { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .i370-methode { grid-template-columns: 1fr; }
          .i370-methcell { border-left: none; border-top: 1px solid ${C.border}; padding: 22px 0 0; }
          .i370-tarifrow { flex-direction: column; align-items: flex-start !important; }
        }
        .i370-card { transition: transform .5s ${EASE_CSS}, border-color .5s ${EASE_CSS}, box-shadow .5s ${EASE_CSS}; }
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
          padding: scrolled ? "12px clamp(20px,5vw,56px)" : "22px clamp(20px,5vw,56px)",
          background: scrolled ? "rgba(12,11,8,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          transition: `padding .55s ${EASE_CSS}, background .55s ${EASE_CSS}, border-color .55s ${EASE_CSS}, backdrop-filter .55s ${EASE_CSS}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={nom}
              style={{ height: 30, maxWidth: 168, objectFit: "contain", display: "block" }}
            />
          ) : (
            <>
              <Factory size={17} color={C.accent} style={{ flexShrink: 0 }} />
              <span
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  fontSize: 18,
                  letterSpacing: "-0.01em",
                  color: C.ink,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {nom}
              </span>
            </>
          )}
        </div>
        <div id="i370-nav" className="i370-navlink-row">
          {NAV.map((n) => (
            <NavLien key={n.l} l={n.l} h={n.h} />
          ))}
          <BoutonLaiton href={telHref}>Visiter la halle</BoutonLaiton>
        </div>
        {/* L'appel à l'action sous le pouce : la barre est fixe, mais son
            bouton vit dans le menu déroulant, en display:none sous le point
            de rupture. Celui-ci paraît exactement avec le bouton de menu. */}
        <ActionMobile href={telHref} fond={C.accent} encre={C.bgDark}>
          Appeler
        </ActionMobile>
        <button
          className="i370-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
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
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: `transform .35s ${EASE_CSS}`, transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "opacity .3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: `transform .35s ${EASE_CSS}`, transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: 62,
            left: 0,
            right: 0,
            zIndex: 99,
            background: C.bgDark,
            borderBottom: `1px solid ${C.border}`,
            padding: "18px clamp(20px,6vw,28px) 24px",
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
              style={{ color: C.ink, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "12px 0" }}
            >
              {l}
            </a>
          ))}
          <a
            href={telHref}
            style={{
              background: C.accent,
              color: C.bgDark,
              borderRadius: 2,
              padding: "14px 22px",
              fontSize: 15,
              fontWeight: 700,
              textDecoration: "none",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            Visiter la halle
          </a>
        </div>
      )}

      {/* ── HÉROS — H8 bento, tuiles inégales ───────────────────────────── */}
      <section
        id="hero"
        style={{
          position: "relative",
          background: C.bgDark,
          padding: "clamp(110px,13vw,168px) clamp(18px,4vw,56px) clamp(40px,6vw,72px)",
          overflow: "hidden",
        }}
      >
        {/* Texture sans image : trame de poutrelles et halo de verrière. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: `linear-gradient(${C.poutrelle} 1px, transparent 1px), linear-gradient(90deg, ${C.poutrelle} 1px, transparent 1px)`,
            backgroundSize: "120px 120px",
            maskImage: "radial-gradient(ellipse at 30% 0%, #000 0%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(ellipse at 30% 0%, #000 0%, transparent 72%)",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "-14%",
            left: "18%",
            width: "58vw",
            height: "58vw",
            maxWidth: 900,
            maxHeight: 900,
            background: `radial-gradient(circle, ${C.accent} 0%, transparent 62%)`,
            opacity: 0.11,
            pointerEvents: "none",
          }}
        />

        <div className="i370-bento" style={{ position: "relative", maxWidth: 1320, margin: "0 auto" }}>
          {/* Tuile 1 — l'identité et le titre */}
          <motion.div
            className="i370-t-titre"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            style={{
              position: "relative",
              background: C.bgCard,
              border: `1px solid ${C.border}`,
              borderRadius: 2,
              padding: "clamp(26px,3.4vw,44px)",
              overflow: "hidden",
            }}
          >
            <ChiffreFantome top="-3%" right="-4%" size="clamp(7rem,14vw,15rem)">
              {S.chiffre}
            </ChiffreFantome>
            <Kicker>{clientEyebrow(sessionData) ?? `${metier} · ${ville}`}</Kicker>
            <h1
              style={{
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: "clamp(2rem,4.1vw,3.5rem)",
                lineHeight: 0.98,
                letterSpacing: "-0.028em",
                color: C.ink,
                margin: "22px 0 0",
                position: "relative",
              }}
            >
              {/*
                Titre d'un seul tenant, d'une seule couleur : la seconde ligne
                en italique d'un autre ton était la signature de gabarit de la
                série. Le bento à poutrelles, lui, n'appartient qu'à ce thème.
              */}
              {/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ??
                c?.heroHeadline ??
                clientHeroLine(sessionData, 0, 1, 44) ??
                "Une usine textile, devenue machine à fêtes."}
            </h1>
          </motion.div>

          {/* Tuile 2 — la halle, cadre qui s'ouvre (geste ExpandFrame) */}
          <motion.div
            className="i370-t-media"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.055, ease: EASE }}
            style={{
              position: "relative",
              border: `1px solid ${C.border}`,
              borderRadius: 2,
              overflow: "hidden",
              background: C.bgDarkAlt,
            }}
          >
            <ExpandFrame src={S.img} alt={S.alt} index={i} className="w-full h-full" radius={0} />
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(8,7,6,0.90) 0%, rgba(8,7,6,0.34) 44%, rgba(8,7,6,0.06) 78%, rgba(8,7,6,0.22) 100%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                padding: "clamp(18px,2.4vw,28px)",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: DISPLAY,
                    fontWeight: 700,
                    fontSize: 17,
                    color: C.white,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {S.k}
                </div>
                <div style={{ fontSize: 13.5, color: "rgba(245,241,230,0.72)", lineHeight: 1.6, marginTop: 4, maxWidth: 360 }}>
                  {S.sub}
                </div>
              </div>
              {/* La fraction ne disait pas ce qu'on regardait ; ces traits
                  mènent directement à chaque espace de la halle. */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {HERO.map((h: any, n: number) => (
                  <button
                    key={h.k ?? n}
                    type="button"
                    onClick={() => go(n)}
                    aria-label={h.k ?? `Espace ${n + 1}`}
                    aria-current={n === i}
                    style={{ width: 32, height: 3, padding: 0, border: "none", cursor: "pointer", background: n === i ? C.accent : "rgba(245,241,230,0.32)", transition: "background .3s" }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Tuile 3 — la promesse et les deux appels */}
          <motion.div
            className="i370-t-texte"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.11, ease: EASE }}
            style={{
              background: C.bgAlt,
              border: `1px solid ${C.border}`,
              borderRadius: 2,
              padding: "clamp(26px,3.4vw,44px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 26,
            }}
          >
            <p
              style={{
                fontSize: "clamp(15px,1.15vw,16.5px)",
                color: C.textMuted,
                lineHeight: 1.78,
                maxWidth: 500,
                margin: 0,
              }}
            >
              {clientHeroPrestations(sessionData) ??
                c?.heroSubline ??
                "Briques rouges, verrière de 1897, 600 m² modulables : la Halle accueille mariages urbains, lancements de produit, dîners de gala et tournages — avec la technique intégrée et une équipe qui connaît sa machine."}
            </p>
            <div style={{ display: "flex", gap: "clamp(16px,2vw,26px)", flexWrap: "wrap", alignItems: "center" }}>
              <BoutonLaiton href={telHref} large>
                Bloquer une date
              </BoutonLaiton>
              <a href="#services" style={{ fontSize: 13, color: C.ink, textDecoration: "none", borderBottom: `1px solid ${C.accent}`, paddingBottom: 3 }}>
                La halle
              </a>
            </div>
          </motion.div>

          {/* Tuile 4 — les chiffres, rangée pleine largeur à poutrelles */}
          <motion.div
            className="i370-t-stats"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.165, ease: EASE }}
            style={{
              background: C.bgCard,
              border: `1px solid ${C.border}`,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div className="i370-statrow">
              {STATS.map((s: any, idx: number) => (
                <div
                  key={s.label ?? idx}
                  style={{
                    padding: "clamp(20px,2.4vw,30px) clamp(14px,1.8vw,24px)",
                    borderLeft: idx === 0 ? "none" : `1px solid ${C.border}`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: DISPLAY,
                      fontWeight: 700,
                      fontSize: "clamp(22px,2.4vw,32px)",
                      color: C.accent,
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {s.value}
                  </div>
                  <div style={{ fontSize: 12.5, color: C.textFaint, marginTop: 8, letterSpacing: "0.04em", lineHeight: 1.5 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── RESPIRATION ─────────────────────────────────────────────────── */}
      <section
        style={{
          background: C.bg,
          padding: "clamp(72px,10vw,132px) clamp(24px,8vw,140px)",
          textAlign: "center",
          position: "relative",
        }}
      >
        <Reveal>
          <p
            style={{
              fontFamily: DISPLAY,
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: "clamp(1.35rem,3vw,2.6rem)",
              lineHeight: 1.32,
              letterSpacing: "-0.02em",
              color: C.ink,
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (
              <>
                Le décor est <span style={{ color: C.accent }}>déjà là</span>. Il ne reste
                qu'à y faire entrer vos invités.
              </>
            )}
          </p>
        </Reveal>
        <Reveal delay={0.14}>
          <div style={{ width: 1, height: 72, background: `linear-gradient(${C.accent}, transparent)`, margin: "44px auto 0" }} />
        </Reveal>
      </section>

      {/* ── PRESTATIONS — bento de tuiles inégales ──────────────────────── */}
      <section
        id="services"
        style={{
          background: C.bgAlt,
          padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <ChiffreFantome top="4%" right="-2%">
          01
        </ChiffreFantome>
        <div style={{ maxWidth: 1320, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <Kicker>La halle</Kicker>
            <h2
              style={{
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: "clamp(1.9rem,4.2vw,3.4rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.03em",
                color: C.ink,
                margin: "22px 0 clamp(34px,4vw,54px)",
                maxWidth: 780,
              }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                <>
                  Un plateau brut,
                  <br />
                  <em style={{ fontStyle: "italic", color: C.accent }}>une technique affûtée.</em>
                </>
              )}
            </h2>
          </Reveal>

          <div className="i370-bentoserv">
            {/* Tuiles inégales : la première de chaque rangée tient quatre
                pistes, les deux suivantes deux chacune. La classe de span vit
                sur l'enfant direct de la grille — la poser sur la carte, à
                l'intérieur du wrapper de révélation, ne serait jamais lue. */}
            {SERVICES.map((s: any, idx: number) => (
              <div key={s.titre ?? idx} className={idx % 3 === 0 ? "i370-s-large" : "i370-s-petit"}>
                <Reveal delay={(idx % 3) * 0.055} style={{ height: "100%" }}>
                  <CarteBento s={s} large={idx % 3 === 0} />
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VOTRE ÉVÉNEMENT — colonnes filetées ─────────────────────────── */}
      <section
        id="methode"
        style={{
          background: C.bg,
          padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Reveal>
            <Kicker>Votre événement</Kicker>
            <h2
              style={{
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: "clamp(1.9rem,4.2vw,3.2rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.03em",
                color: C.ink,
                margin: "22px 0 clamp(34px,4vw,56px)",
                maxWidth: 760,
              }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                <>
                  Un lieu brut
                  <br />
                  <em style={{ fontStyle: "italic", color: C.accent }}>ne veut pas dire brouillon.</em>
                </>
              )}
            </h2>
          </Reveal>
          <Poutrelle />
          <div className="i370-methode" style={{ marginTop: 40 }}>
            {METHODE.map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.055}>
                <div className="i370-methcell">
                  <div
                    style={{
                      fontFamily: DISPLAY,
                      fontWeight: 800,
                      fontSize: "clamp(2.4rem,4vw,3.4rem)",
                      color: C.accent,
                      opacity: 0.32,
                      lineHeight: 0.9,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {m.n}
                  </div>
                  <h3
                    style={{
                      fontFamily: DISPLAY,
                      fontWeight: 700,
                      fontSize: 17,
                      color: C.ink,
                      margin: "18px 0 10px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {m.t}
                  </h3>
                  <p style={{ fontSize: 14.5, color: C.textMuted, lineHeight: 1.72, margin: 0, maxWidth: 300 }}>
                    {m.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TARIFS — table fine, avant les engagements ──────────────────── */}
      <section
        id="tarifs"
        style={{
          background: C.bgDark,
          padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <ChiffreFantome top="6%" right="2%" size="clamp(6rem,12vw,13rem)">
          €
        </ChiffreFantome>
        <div style={{ maxWidth: 1060, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <Kicker>Tarifs</Kicker>
            <h2
              style={{
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: "clamp(1.9rem,4vw,3.1rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.03em",
                color: C.ink,
                margin: "22px 0 14px",
              }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                <>
                  Modulaires, <em style={{ fontStyle: "italic", color: C.accent }}>publiés.</em>
                </>
              )}
            </h2>
            <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 620, lineHeight: 1.75, margin: 0 }}>
              La halle se loue par blocs : espace + technique + personnel. Associations et
              acteurs culturels roubaisiens : -20 % en semaine.
            </p>
          </Reveal>

          <div style={{ marginTop: "clamp(30px,4vw,52px)" }}>
            <Poutrelle />
            {TARIFS.map((t: any, idx: number) => (
              <Reveal key={t.a ?? idx} delay={idx * 0.05}>
                <LigneTarif t={t} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENTS — split média + liste ───────────────────────────── */}
      <section
        id="engagements"
        style={{
          background: C.bgAlt,
          padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)",
        }}
      >
        <div className="i370-split" style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div
              style={{
                position: "relative",
                border: `1px solid ${C.border}`,
                borderRadius: 2,
                overflow: "hidden",
                background: `linear-gradient(140deg, ${C.accentLight} 0%, ${C.bgDarkAlt} 100%)`,
                aspectRatio: "4/3",
              }}
            >
              <img
                /* Quatrième emplacement : les trois premiers alimentent les
                   tuiles du héros. L'URL de repli est celle du thème. */
                src={photo(3, "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80")}
                alt="Le studio attenant de la halle"
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              {/* Cartouche de charpente : le détail gratuit. */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  background: "rgba(12,11,8,0.86)",
                  borderTop: `1px solid ${C.border}`,
                  borderRight: `1px solid ${C.border}`,
                  padding: "10px 18px",
                  fontSize: 10.5,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: C.accent,
                }}
              >
                ERP type L
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              <Kicker>La maison</Kicker>
              <h2
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 800,
                  fontSize: "clamp(1.7rem,3.2vw,2.7rem)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.03em",
                  color: C.ink,
                  margin: "20px 0 28px",
                }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>
                    Une halle classée,
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accent }}>aux normes d'aujourd'hui.</em>
                  </>
                )}
              </h2>
              {ENGAGEMENT.map((e: any, idx: number) => (
                <div key={idx} style={{ display: "flex", gap: 14, marginBottom: 16, alignItems: "flex-start" }}>
                  <span
                    aria-hidden
                    style={{
                      flexShrink: 0,
                      marginTop: 9,
                      width: 22,
                      height: 1,
                      background: C.accent,
                      opacity: 0.8,
                    }}
                  />
                  <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.7 }}>{e}</span>
                </div>
              ))}
              <div style={{ marginTop: 30 }}>
                <BoutonLaiton href={telHref}>Nous appeler</BoutonLaiton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── AVIS — projecteur rotatif ───────────────────────────────────── */}
      <section
        style={{
          background: C.bgDarkAlt,
          padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "70vw",
            height: "70vw",
            maxWidth: 1000,
            maxHeight: 1000,
            background: `radial-gradient(circle, ${C.accent} 0%, transparent 62%)`,
            opacity: 0.09,
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", textAlign: "center" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Kicker align="center">Ils y sont passés</Kicker>
            </div>
            <h2
              style={{
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: "clamp(1.8rem,3.6vw,2.9rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.03em",
                color: C.ink,
                margin: "22px 0 clamp(34px,4vw,50px)",
              }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                <>
                  La halle <em style={{ fontStyle: "italic", color: C.accent }}>a encore tourné</em>.
                </>
              )}
            </h2>
          </Reveal>

          <motion.blockquote
            key={avis.i}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: EASE }}
            style={{ margin: 0 }}
          >
            <p
              style={{
                fontFamily: DISPLAY,
                fontStyle: "italic",
                fontWeight: 600,
                fontSize: "clamp(1.05rem,2vw,1.6rem)",
                lineHeight: 1.55,
                color: C.ink,
                margin: "0 auto",
                maxWidth: 780,
                letterSpacing: "-0.01em",
              }}
            >
              «&nbsp;{A?.texte}&nbsp;»
            </p>
            <footer style={{ marginTop: 28 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.white, letterSpacing: "0.04em" }}>
                {A?.auteur}
              </div>
              <div style={{ fontSize: 11.5, color: C.accent, marginTop: 6, letterSpacing: "0.28em", textTransform: "uppercase" }}>
                {A?.detail}
              </div>
            </footer>
          </motion.blockquote>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginTop: 34 }}>
            <SlideIndex i={avis.i} total={AVIS.length} variant="flat" color={C.textFaint} className="" />
            <HairlineArrows onPrev={avis.prev} onNext={avis.next} color={C.textMuted} className="" />
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section
        id="contact"
        style={{
          background: C.accentLight,
          padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: `radial-gradient(${C.accent} 1px, transparent 1px)`,
            backgroundSize: "44px 44px",
            opacity: 0.06,
          }}
        />
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Kicker align="center">Booking</Kicker>
            </div>
            <h2
              style={{
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: "clamp(1.9rem,4.2vw,3.2rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.03em",
                color: C.ink,
                margin: "22px 0 18px",
              }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                <>
                  La halle est libre
                  <br />
                  <em style={{ fontStyle: "italic", color: C.accent }}>moins souvent qu'on ne croit.</em>
                </>
              )}
            </h2>
            <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 480, margin: "0 auto 38px", lineHeight: 1.75 }}>
              Visites du mardi au samedi sur rendez-vous. Fiche technique et calendrier des
              disponibilités envoyés sous 24 h.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <BoutonLaiton href={telHref} large>
                <Phone size={16} style={{ marginRight: 2 }} /> {phone}
              </BoutonLaiton>
              <BoutonLaiton href={`mailto:${mail}`} plein={false} large>
                <Mail size={16} style={{ marginRight: 2 }} /> Nous écrire
              </BoutonLaiton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PIED DE PAGE ────────────────────────────────────────────────── */}
      <footer style={{ background: C.bgDark, padding: "clamp(44px,6vw,68px) clamp(20px,5vw,64px) 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 34, marginBottom: 36 }}>
            <div style={{ minWidth: 240 }}>
              <div
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  fontSize: 19,
                  color: C.accent,
                  marginBottom: 10,
                  letterSpacing: "-0.01em",
                }}
              >
                {nom}
              </div>
              <p style={{ color: C.textFaint, fontSize: 13, lineHeight: 1.75, margin: 0, maxWidth: 340 }}>
                {metier} · {ville}
                <br />
                ERP type L — 400 debout, 250 assis, licence d'exploitation
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <MapPin size={13} />, t: clientAddress(sessionData) ?? `${ville}, Nord` },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Mail size={13} />, t: mail },
                { icon: <Clock size={13} />, t: "Visites Mar–Sam sur rendez-vous" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 11, color: C.textFaint, fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.accent }}>{item.icon}</span>
                  {item.t}
                </div>
              ))}
            </div>
          </div>
          <Poutrelle />
          <div
            style={{
              paddingTop: 18,
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <span style={{ color: C.textFaint, fontSize: 12, opacity: 0.8 }}>
              © 2026 {nom} — Site réalisé par Aevia WS · SIREN{" "}
              <LegalIdentity fallback="852 546 225" kind="siren" />
              {/* VILLE_PIED */}
              {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ color: C.textFaint, fontSize: 12, opacity: 0.8 }}>
              Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Sous-composants à état local ───────────────────────────────────────────
   Déclarés hors de Page() : leur état de survol ne doit pas re-rendre la page
   entière, et leurs hooks ne dépendent d'aucune vue conditionnelle.          */

function CarteBento({ s, large }: any) {
  const [h, setH] = useState(false);
  return (
    <article
      className="i370-card"
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        position: "relative",
        height: "100%",
        background: C.bgCard,
        border: `1px solid ${h ? C.accent : C.border}`,
        borderRadius: 2,
        padding: large ? "clamp(28px,3vw,40px)" : "clamp(24px,2.6vw,32px)",
        transform: h ? "translateY(-6px)" : "none",
        boxShadow: h
          ? "0 26px 54px -26px rgba(0,0,0,0.75), 0 4px 14px -8px rgba(201,163,94,0.4)"
          : "0 0 0 0 rgba(0,0,0,0)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 10,
          right: 16,
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: large ? "clamp(4rem,7vw,6.6rem)" : "clamp(3rem,5vw,4.6rem)",
          lineHeight: 0.8,
          color: C.accent,
          opacity: h ? 0.16 : 0.08,
          transition: `opacity .5s ${EASE_CSS}`,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {s.n}
      </span>
      <span
        style={{
          alignSelf: "flex-start",
          border: `1px solid ${C.border}`,
          color: C.accent,
          borderRadius: 999,
          padding: "4px 13px",
          fontSize: 10.5,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.22em",
        }}
      >
        {s.tag}
      </span>
      <h3
        style={{
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: large ? "clamp(19px,1.9vw,25px)" : "clamp(17px,1.5vw,20px)",
          color: C.ink,
          margin: "6px 0 0",
          lineHeight: 1.16,
          letterSpacing: "-0.018em",
          position: "relative",
        }}
      >
        {s.titre}
      </h3>
      <p
        style={{
          fontSize: 14.5,
          color: C.textMuted,
          lineHeight: 1.74,
          margin: 0,
          maxWidth: large ? 520 : 380,
          position: "relative",
        }}
      >
        {s.desc}
      </p>
    </article>
  );
}

function LigneTarif({ t }: any) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className="i370-tarifrow"
      style={{
        display: "flex",
        gap: 18,
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "clamp(20px,2.4vw,28px) clamp(8px,1.4vw,18px)",
        borderBottom: `1px solid ${C.border}`,
        background: h ? C.bgCard : "transparent",
        transform: h ? "translateX(6px)" : "none",
        boxShadow: h ? "inset 2px 0 0 0 " + C.accent + ", 0 12px 30px -22px rgba(0,0,0,0.8)" : "none",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      <div style={{ minWidth: 0, flex: "1 1 320px" }}>
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: "clamp(16px,1.5vw,19px)",
            color: C.ink,
            letterSpacing: "-0.015em",
          }}
        >
          {t.a}
        </div>
        <div style={{ fontSize: 13.5, color: C.textMuted, marginTop: 7, lineHeight: 1.65, maxWidth: 540 }}>{t.n}</div>
      </div>
      <div
        style={{
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: "clamp(17px,1.7vw,22px)",
          color: h ? C.accentDark : C.accent,
          whiteSpace: "nowrap",
          transition: `color .5s ${EASE_CSS}`,
        }}
      >
        {t.p}
      </div>
    </div>
  );
}
