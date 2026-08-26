"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Clock, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, HairlineArrows, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
import { PortalZoom } from "@/lib/templates/hero-kit-3";
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
} from "@/lib/templates/clientContent";
import { TitreDeLaPage } from "@/lib/templates/TitreDeLaPage";

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
   DOMAINE DES CHARMILLES — domaine de mariage · Val de Loire

   Archétype H3 (plein cadre, titre en bas, fond de repli C.bgDark
   OBLIGATOIRE) · paire P3 (Cormorant Garamond + system-ui) · palette pierre
   #fbf9f5 / vieil or #9a7b4f · signature : le portail est une FENÊTRE DE
   CHÂTEAU — croisée haute à linteau légèrement cintré, décollée du sol.

   Le geste PortalZoom est partagé avec deux autres thèmes : sur 322 le seuil
   est une arche qui touche le sol, sur 381 une voûte de cave écrasée. Ici la
   découpe est une fenêtre à meneaux : haute, étroite, cintrée en tête,
   suspendue au-dessus du sol — et un filet dessine la croisée au repos, pour
   que la figure se lise avant même la première transition.

   Les trois photographies du thème sont conservées telles quelles ; aucune
   URL n'est inventée, et toute section plein cadre tient sans image.
   ════════════════════════════════════════════════════════════════════════════ */

let C: Record<string, string> = {
  bg: "#fbf9f5",
  bgAlt: "#f3eee3",
  bgDark: "#171310",
  bgDarkAlt: "#100d0a",
  bgCard: "#ffffff",
  accent: "var(--brand,#9a7b4f)",
  accentDark: "var(--brand-light,#7c6039)",
  accentLight: "#efe6d4",
  ink: "#211c15",
  textMuted: "#6b6152",
  textFaint: "#9c917e",
  border: "#e4dcc9",
  white: "#ffffff",
  /* Clé métier : l'or des lustres allumés vus depuis le parc, la nuit. */
  lueur: "rgba(207,179,122,0.55)",
  hi: "#cfb37a",
};

/*
  La paire du plan (P3) : « Cormorant Garamond » porte la voix — c'est la
  serif des cartons d'invitation — et system-ui porte la lecture. Aucune
  seconde fonte Google : la sobriété du système EST le second rôle.
*/
const SERIF = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
const BODY = "system-ui, -apple-system, 'Segoe UI', sans-serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_CSS = "cubic-bezier(.16,1,.3,1)";

/*
  Le seuil du geste : une fenêtre de château. Haute et étroite (39 % de marge
  de chaque côté), linteau cintré discret (l'arc d'une croisée, pas d'un
  portail roman), et surtout un appui : la découpe s'arrête à 12 % du bas —
  une fenêtre ne touche jamais le sol, c'est ce qui la distingue de l'arche
  de 322 et de la voûte de 381.
*/
const FENETRE = "inset(14% 39% 12% 39% round 34% 34% 2% 2% / 15% 15% 1% 1%)";

const NAV = [
  { l: "Les espaces", h: "#services" },
  { l: "Votre événement", h: "#methode" },
  { l: "Formules", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* ── Données de démonstration — textes du thème, conservés ────────────────── */

function HERO_SOURCE_LIVE() {
  return [
    {
      k: "La grande salle",
      sub: "220 convives assis, pierre apparente et poutres de chêne.",
      img: clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80",
      alt: "La grande salle dressée pour un dîner",
    },
    {
      k: "La cérémonie au parc",
      sub: "L'allée de charmes, l'arche, et quatre hectares pour les photos.",
      img: clientPhotos(sessionData)[2] || "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80",
      alt: "Cérémonie dressée dans le parc",
    },
    {
      k: "Les lendemains",
      sub: "12 chambres sur place — le brunch se fait en peignoir.",
      img: clientPhotos(sessionData)[3] || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
      alt: "Le parc au matin",
    },
  ];
}
let HERO_DEMO = HERO_SOURCE_LIVE();
let HERO = HERO_DEMO;

const SERVICES_SOURCE = [
  {
    titre: "La grande salle",
    desc: "320 m² de tuffeau et de chêne, 220 couverts, office traiteur professionnel attenant, sono et lumières installées.",
    tag: "Salle",
    n: "I",
  },
  {
    titre: "Le parc & la cérémonie",
    desc: "Cérémonie laïque sous l'allée de charmes, cocktail sur la terrasse ouest au couchant, plan B pluie prévu et beau.",
    tag: "Parc",
    n: "II",
  },
  {
    titre: "L'hébergement",
    desc: "12 chambres (26 couchages) dans la longère et les dépendances : les proches restent, le brunch du lendemain a lieu ici.",
    tag: "Nuits",
    n: "III",
  },
  {
    titre: "Séminaires & journées d'équipe",
    desc: "En semaine : salle plénière lumineuse, sous-commissions dans les dépendances, parc pour les formats qui respirent.",
    tag: "Entreprise",
    n: "IV",
  },
  {
    titre: "Traiteurs : libres ou conseillés",
    desc: "Cuisine professionnelle aux normes pour le traiteur de votre choix — ou notre liste de cinq maisons éprouvées.",
    tag: "Traiteur",
    n: "V",
  },
  {
    titre: "Coordination du jour J",
    desc: "Notre intendante orchestre prestataires et timing le jour même : vous êtes invités chez vous.",
    tag: "Jour J",
    n: "VI",
  },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE = [
  {
    n: "01",
    t: "La visite",
    d: "Une heure trente, aux heures où VOTRE événement vivra : la lumière du parc à 18 h ne se raconte pas.",
  },
  {
    n: "02",
    t: "L'option posée",
    d: "Date bloquée gratuitement 15 jours, devis détaillé espace par espace — pas de forfait opaque.",
  },
  {
    n: "03",
    t: "La préparation cadrée",
    d: "Deux rendez-vous techniques, plan d'implantation, fiche prestataires : tout est écrit avant le jour J.",
  },
  {
    n: "04",
    t: "Le jour, orchestré",
    d: "L'intendante gère les arrivées, le timing, les imprévus. Le domaine est à vous jusqu'au lendemain 15 h.",
  },
];

const ENGAGEMENT_DEMO = [
  "ERP de 5e catégorie contrôlé : commission de sécurité, accessibilité PMR",
  "Un seul événement à la fois — jamais deux mariages qui s'entendent chanter",
  "Sonorisation extérieure limitée à 22 h, salle insonorisée jusqu'à l'aube : les voisins et la fête coexistent",
  "Assurance RC organisateur exigée et vérifiée — protection de tous",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

const TARIFS_DEMO = [
  {
    a: "Mariage — samedi haute saison",
    p: "6 900 €",
    n: "Du vendredi 14 h au dimanche 15 h : salle, parc, chambres, intendante.",
  },
  {
    a: "Mariage — vendredi ou hors saison",
    p: "4 900 €",
    n: "Mêmes prestations, dates d'octobre à avril ou vendredis d'été.",
  },
  {
    a: "Séminaire journée (< 80 pers.)",
    p: "1 900 €",
    n: "Salle plénière, 2 salles annexes, parc, café d'accueil compris.",
  },
  {
    a: "Grande tablée familiale (< 60)",
    p: "2 400 €",
    n: "Anniversaires, noces d'or : la salle des dépendances et la terrasse.",
  },
];
let TARIFS = TARIFS_DEMO;

const AVIS_SOURCE = [
  {
    texte:
      "Le domaine entier à nous du vendredi au dimanche : la cérémonie sous les charmes, la fête jusqu'à 4 h sans un voisin fâché, le brunch en peignoir. Exactement le mariage qu'on voulait.",
    auteur: "Camille & Antoine",
    detail: "Mariage — juin 2026",
  },
  {
    texte:
      "L'intendante du jour J vaut de l'or : un prestataire en retard, une averse surprise — nous n'avons rien su de tout ça avant le lendemain.",
    auteur: "Les mariés de septembre",
    detail: "Coordination jour J",
  },
  {
    texte:
      "Séminaire stratégique de deux jours : équipes logées sur place, sessions dans les dépendances, soirée au parc. Le cadre a fait la moitié du travail de cohésion.",
    auteur: "DG, scale-up tourangelle",
    detail: "Séminaire résidentiel",
  },
];
let AVIS_DEMO = AVIS_SOURCE;

const STATS_DEMO = [
  { value: "220", label: "Convives assis en salle" },
  { value: "4 ha", label: "De parc clos" },
  { value: "12", label: "Chambres sur place" },
  { value: "1", label: "Seul événement à la fois" },
];
let STATS = STATS_DEMO;

/* ── Primitives ───────────────────────────────────────────────────────────── */

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
          fontSize: 10.5,
          letterSpacing: "0.36em",
          textTransform: "uppercase",
          color,
          fontWeight: 600,
        }}
      >
        {children}
      </span>
      {align === "center" && (
        <span style={{ width: 40, height: 1, background: color, opacity: 0.8, flexShrink: 0 }} />
      )}
    </div>
  );
}

function Reveal({ children, delay = 0, y = 26, style }: any) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -8% 0px" });
  return (
    <motion.div
      ref={ref}
      style={style}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Filet dégradé d'un pixel — la dorure discrète du thème. */
function Filet({ vertical = false, opacity = 1 }: any) {
  return (
    <div
      aria-hidden
      style={
        vertical
          ? {
              width: 1,
              height: "100%",
              background: `linear-gradient(to bottom, transparent, ${C.accent}, transparent)`,
              opacity: 0.4 * opacity,
              pointerEvents: "none",
            }
          : {
              height: 1,
              width: "100%",
              background: `linear-gradient(to right, transparent, ${C.accent}, transparent)`,
              opacity: 0.38 * opacity,
              pointerEvents: "none",
            }
      }
    />
  );
}

/** Chiffre romain fantôme — la pierre gravée, à peine. */
function RomainFantome({ children, top, right, left, size = "clamp(9rem,22vw,22rem)", dark = false }: any) {
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        top,
        right,
        left,
        fontFamily: SERIF,
        fontStyle: "italic",
        fontWeight: 500,
        fontSize: size,
        lineHeight: 0.8,
        color: dark ? C.hi : C.accent,
        opacity: dark ? 0.07 : 0.07,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {children}
    </span>
  );
}

/**
 * La croisée dessinée en CSS : meneau vertical, traverse horizontale, linteau
 * cintré. C'est le repli des sections qui attendent une photographie — et le
 * motif du thème quand tout va bien.
 */
function CroiseeCSS({ tint = C.accent, opacity = 0.5 }: any) {
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity }}>
      <div
        style={{
          position: "absolute",
          inset: "12% 30% 10% 30%",
          border: `1px solid ${tint}`,
          borderRadius: "42% 42% 2% 2% / 18% 18% 1% 1%",
        }}
      />
      {/* meneau */}
      <div style={{ position: "absolute", top: "12%", bottom: "10%", left: "50%", width: 1, background: tint }} />
      {/* traverse */}
      <div style={{ position: "absolute", left: "30%", right: "30%", top: "44%", height: 1, background: tint }} />
      {/* appui */}
      <div style={{ position: "absolute", left: "26%", right: "26%", bottom: "8%", height: 1, background: tint }} />
    </div>
  );
}

function BoutonDomaine({ href, children, plein = true, large = false, clair = false }: any) {
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
        fontSize: large ? 14.5 : 13.5,
        fontWeight: 600,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        textDecoration: "none",
        borderRadius: 2,
        border: `1px solid ${
          plein ? (h ? C.accentDark : C.accent) : clair ? "rgba(255,255,255,0.45)" : C.accent
        }`,
        background: plein
          ? h
            ? C.accentDark
            : C.accent
          : h
            ? clair
              ? "rgba(255,255,255,0.14)"
              : "rgba(154,123,79,0.10)"
            : "transparent",
        color: plein ? "#fff" : clair ? "#fff" : C.accentDark,
        transform: h ? "translateY(-3px)" : "none",
        boxShadow: h
          ? "0 20px 44px -20px rgba(122,95,56,0.55), 0 3px 10px -6px rgba(23,19,16,0.35)"
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

function NavLien({ l, h, sombre }: any) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={h}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        fontFamily: BODY,
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: "0.10em",
        textTransform: "uppercase",
        color: sombre ? (hov ? C.ink : C.textMuted) : hov ? "#fff" : "rgba(255,255,255,0.82)",
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
          bottom: 7,
          height: 1,
          width: hov ? "100%" : "0%",
          background: C.hi,
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
export default function DomaineCharmillesPage() {
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

  HERO_DEMO = HERO_SOURCE_LIVE();
  HERO = HERO_DEMO.map((row: any, i: number) => ({
    ...row,
    img: fd?.photoUrls?.[i] || clientPhotos(sessionData)[i + 1] || row.img,
  }));
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

  /*
    Un seul index pilote tout le héros : l'image que traverse le portail, le
    sur-titre de l'espace montré, la légende, la fraction. DWELL.slow — un
    domaine se visite au pas, pas au trot.
  */
  const { i, go, next, prev } = useSlides(HERO.length, DWELL.slow);
  const S = HERO[i];
  /* Deuxième index, hors héros : les avis en projecteur. */
  const avis = useSlides(AVIS.length, DWELL.slow);
  const A = AVIS[avis.i];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = clientPhone(sessionData) ?? fd?.phone ?? "02 47 00 00 01";
  const telHref = `tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33247000001").replace(/\s+/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "evenements@domaine-charmilles.fr";
  const nom = fd?.businessName ?? clientName(sessionData) ?? "Domaine des Charmilles";
  const ville = clientCity(sessionData) ?? "Amboise";
  const metier = clientTrade(sessionData) ?? "Domaine de réception";

  /*
    Le titre du héros : deux lignes de Cormorant plein cadre. Calibré à 22
    caractères par ligne — au-delà, la serif italique déborde à 390 px.
  */
  const ligne1 = clientHeroLine(sessionData, 0, 2, 22);
  const ligne2 = clientHeroLine(sessionData, 1, 2, 22);

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: BODY, overflowX: "clip" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap');

        .i369-navrow { display: flex; gap: clamp(14px,2vw,28px); align-items: center; }
        .i369-espace { display: grid; grid-template-columns: minmax(0,0.9fr) minmax(0,1.1fr); gap: clamp(28px,5vw,72px); align-items: center; }
        .i369-split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(32px,5vw,72px); align-items: center; }
        .i369-stats { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); }
        .i369-methode { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(280px,100%),1fr)); gap: clamp(18px,2.4vw,30px); }

        /* La lueur des fenêtres du hero : seule boucle du thème, coupée
           pour qui demande moins de mouvement. */
        @keyframes i369-lueur { 0%,100% { opacity: .22; } 50% { opacity: .5; } }
        .i369-lueur { animation: i369-lueur 7s ${EASE_CSS} infinite; }
        @media (prefers-reduced-motion: reduce) { .i369-lueur { animation: none; opacity: .3; } }

        @media (max-width: 900px) {
          #i369-nav { display: none !important; }
          .i369-burger { display: flex !important; }
          .i369-split { grid-template-columns: 1fr !important; }
          .i369-espace { grid-template-columns: 1fr !important; }
          .i369-espace > * { order: initial !important; }
        }
        @media (max-width: 860px) {
          .i369-stats { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .i369-statcell { border-left: none !important; }
          .i369-tarifrow { flex-direction: column; align-items: flex-start !important; }
          .i369-herobas { padding-left: 24px !important; padding-right: 24px !important; }
          .i369-fenetrehero { display: none !important; }
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
          padding: scrolled ? "12px clamp(20px,5vw,56px)" : "22px clamp(20px,5vw,56px)",
          background: scrolled ? "rgba(251,249,245,0.93)" : "transparent",
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
              <Sparkles size={16} color={scrolled ? C.accent : C.hi} style={{ flexShrink: 0 }} />
              <span
                style={{
                  fontFamily: SERIF,
                  fontWeight: 600,
                  fontSize: 21,
                  letterSpacing: "0.02em",
                  color: scrolled ? C.ink : "#fff",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  transition: `color .45s ${EASE_CSS}`,
                }}
              >
                {nom}
              </span>
              <span
                style={{
                  fontSize: 9,
                  letterSpacing: "0.30em",
                  textTransform: "uppercase",
                  color: scrolled ? C.textFaint : "rgba(255,255,255,0.7)",
                  marginLeft: 8,
                  whiteSpace: "nowrap",
                  transition: `color .45s ${EASE_CSS}`,
                }}
              >
                {metier}
              </span>
            </>
          )}
        </div>
        <div id="i369-nav" className="i369-navrow">
          {NAV.map((n) => (
            <NavLien key={n.l} l={n.l} h={n.h} sombre={scrolled} />
          ))}
          <BoutonDomaine href={telHref}>Réserver une visite</BoutonDomaine>
        </div>
        <button
          className="i369-burger"
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
          <span style={{ display: "block", width: 24, height: 1.5, background: scrolled || mobileOpen ? C.ink : "#fff", transition: `transform .35s ${EASE_CSS}`, transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: scrolled || mobileOpen ? C.ink : "#fff", transition: "opacity .3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: scrolled || mobileOpen ? C.ink : "#fff", transition: `transform .35s ${EASE_CSS}`, transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: 60,
            left: 0,
            right: 0,
            zIndex: 99,
            background: C.bg,
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
              color: "#fff",
              borderRadius: 2,
              padding: "14px 22px",
              fontSize: 15,
              fontWeight: 700,
              textDecoration: "none",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            Réserver une visite
          </a>
        </div>
      )}

      {/* ── HÉROS — H3 plein cadre, titre en bas, PortalZoom fenêtre ─────── */}
      <section
        id="hero"
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          overflow: "hidden",
          /* Fond de repli OBLIGATOIRE : photos bloquées, la nuit du parc tient. */
          background: C.bgDark,
        }}
      >
        <TitreDeLaPage session={sessionData} />

        {/* ── GESTE : PortalZoom, le seuil est une fenêtre de château ─────
            À chaque transition, la croisée s'ouvre en grand et la caméra
            traverse vers l'espace suivant. Décollée du sol et cintrée en
            tête : rien à voir avec l'arche de 322 ni la voûte de 381. */}
        <PortalZoom images={HERO.map((s: any) => s.img)} index={i} portal={FENETRE} overlay={0.42} />

        {/* La croisée au repos : un filet dessine la fenêtre là où le
            portail s'ouvrira — le détail gratuit du thème. */}
        <div
          aria-hidden
          className="i369-fenetrehero"
          style={{
            position: "absolute",
            top: "14%",
            bottom: "12%",
            left: "39%",
            right: "39%",
            border: "1px solid rgba(207,179,122,0.34)",
            borderRadius: "34% 34% 2% 2% / 15% 15% 1% 1%",
            pointerEvents: "none",
          }}
        >
          <div className="i369-lueur" style={{ position: "absolute", inset: 0, borderRadius: "inherit", boxShadow: `inset 0 0 60px 0 ${C.lueur}` }} />
          <div style={{ position: "absolute", top: "18%", bottom: 0, left: "50%", width: 1, background: "rgba(207,179,122,0.26)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: "46%", height: 1, background: "rgba(207,179,122,0.26)" }} />
        </div>

        {/* Scrim à trois arrêts : le titre reste lisible sur toute image. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(16,13,10,0.94) 0%, rgba(16,13,10,0.55) 30%, rgba(16,13,10,0.10) 62%, rgba(16,13,10,0.42) 100%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="i369-herobas"
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: 1280,
            margin: "0 auto",
            padding: "clamp(120px,14vw,180px) clamp(20px,5vw,64px) clamp(44px,6vw,72px)",
          }}
        >
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
            <Kicker color={C.hi}>{clientEyebrow(sessionData) ?? `${metier} · Val de Loire`}</Kicker>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.055, ease: EASE }}
            style={{
              fontFamily: SERIF,
              fontWeight: 500,
              fontSize: "clamp(2.7rem,7vw,5.8rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.015em",
              color: "#fff",
              margin: "clamp(18px,2.4vw,28px) 0 0",
              maxWidth: 900,
            }}
          >
            {/*
              Titre d'un seul tenant, d'une seule couleur : la seconde ligne
              en italique dorée était la signature de gabarit de la série.
              La composition PortalZoom — la fenêtre de château qui s'ouvre —
              reste, elle n'appartient qu'à ce thème.
            */}
            {c?.heroHeadline && !ligne1
              ? c.heroHeadline
              : `${ligne1 ?? "Le lieu fait"} ${ligne2 ?? "la moitié du souvenir."}`}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.11, ease: EASE }}
            style={{
              fontSize: "clamp(15px,1.25vw,17px)",
              color: "rgba(255,255,255,0.82)",
              lineHeight: 1.75,
              maxWidth: 510,
              margin: "clamp(20px,2.4vw,30px) 0 clamp(26px,3vw,36px)",
            }}
          >
            {clientHeroSubtitle(sessionData) ??
              c?.heroSubline ??
              "Une longère de tuffeau, un parc de quatre hectares, une salle de 220 couverts et des chambres pour les lève-tard : le Domaine des Charmilles reçoit mariages, séminaires et grandes tablées familiales."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.165, ease: EASE }}
            style={{ display: "flex", gap: 13, flexWrap: "wrap" }}
          >
            <BoutonDomaine href={telHref} large>
              Visiter le domaine
            </BoutonDomaine>
            <a href="#services" style={{ fontSize: 13, color: "#fff", textDecoration: "none", borderBottom: `1px solid ${C.hi}`, paddingBottom: 3, alignSelf: "center" }}>
              Les espaces
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.85, delay: 0.22, ease: EASE }}
            style={{ marginTop: "clamp(28px,3.6vw,44px)" }}
          >
            <Filet />
            <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", paddingTop: 16 }}>
              {/* La fraction « 01 / 03 » ne disait pas ce qu'on regardait ;
                  ces traits mènent directement à chaque espace. */}
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                {HERO.map((h: any, n: number) => (
                  <button
                    key={h.k ?? n}
                    type="button"
                    onClick={() => go(n)}
                    aria-label={h.k ?? `Espace ${n + 1}`}
                    aria-current={n === i}
                    style={{ width: 32, height: 3, padding: 0, border: "none", cursor: "pointer", background: n === i ? C.hi : "rgba(255,255,255,0.32)", transition: "background .3s" }}
                  />
                ))}
              </div>
              <div style={{ minWidth: 0, flex: "1 1 240px" }}>
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
                  <span
                    style={{
                      fontSize: 10.5,
                      letterSpacing: "0.30em",
                      textTransform: "uppercase",
                      color: C.hi,
                      display: "block",
                      marginBottom: 5,
                    }}
                  >
                    {S?.k}
                  </span>
                  <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.84)" }}>{S?.sub}</span>
                </motion.div>
              </div>
              <HairlineArrows onPrev={prev} onNext={next} color="#fff" className="" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── RESPIRATION ─────────────────────────────────────────────────── */}
      <section
        style={{
          background: C.bg,
          padding: "clamp(76px,11vw,140px) clamp(24px,8vw,140px)",
          textAlign: "center",
        }}
      >
        <Reveal>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: "clamp(1.5rem,3.2vw,2.8rem)",
              lineHeight: 1.32,
              letterSpacing: "-0.01em",
              color: C.ink,
              maxWidth: 880,
              margin: "0 auto",
            }}
          >
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (
              <>
                Un seul événement à la fois — le domaine entier{" "}
                <span style={{ color: C.accentDark }}>vous appartient</span>.
              </>
            )}
          </p>
        </Reveal>
        <Reveal delay={0.14}>
          <div style={{ width: 1, height: 72, background: `linear-gradient(${C.accent}, transparent)`, margin: "42px auto 0" }} />
        </Reveal>
      </section>

      {/* ── LES ESPACES — rangées éditoriales à numéraux romains ─────────── */}
      <section
        id="services"
        style={{
          background: C.bgAlt,
          padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <RomainFantome top="2%" right="-1%">
          IV
        </RomainFantome>
        <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <Kicker>Les espaces</Kicker>
            <h2
              style={{
                fontFamily: SERIF,
                fontWeight: 600,
                fontSize: "clamp(2rem,4.2vw,3.5rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.012em",
                color: C.ink,
                margin: "22px 0 clamp(34px,4.4vw,58px)",
                maxWidth: 700,
              }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                <>
                  Un domaine entier,
                  <br />
                  <em style={{ fontStyle: "italic", color: C.accentDark }}>rien que pour vous.</em>
                </>
              )}
            </h2>
          </Reveal>

          <Filet />
          {SERVICES.map((s: any, idx: number) => (
            <Reveal key={s.titre ?? idx} delay={(idx % 3) * 0.055}>
              <RangeeEspace s={s} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CHIFFRES — bande gravée ─────────────────────────────────────── */}
      <section style={{ background: C.bgDark, position: "relative", overflow: "hidden" }}>
        <RomainFantome top="-10%" left="2%" size="clamp(8rem,16vw,15rem)" dark>
          220
        </RomainFantome>
        <div className="i369-stats" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(20px,5vw,56px)", position: "relative" }}>
          {STATS.map((s: any, idx: number) => (
            <Reveal key={s.label ?? idx} delay={idx * 0.055}>
              <div
                className="i369-statcell"
                style={{
                  padding: "clamp(28px,3.4vw,46px) clamp(12px,1.6vw,24px)",
                  borderLeft: idx === 0 ? "none" : "1px solid rgba(207,179,122,0.18)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: SERIF,
                    fontWeight: 600,
                    fontSize: "clamp(26px,3vw,40px)",
                    color: C.hi,
                    lineHeight: 1,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.52)", marginTop: 9, lineHeight: 1.55, letterSpacing: "0.03em" }}>
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── VOTRE ÉVÉNEMENT — quatre temps sur un filet ─────────────────── */}
      <section
        id="methode"
        style={{
          background: C.bg,
          padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Kicker align="center">Votre événement</Kicker>
              </div>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontWeight: 600,
                  fontSize: "clamp(2rem,4.2vw,3.4rem)",
                  lineHeight: 1.06,
                  letterSpacing: "-0.012em",
                  color: C.ink,
                  margin: "22px auto clamp(38px,5vw,64px)",
                  maxWidth: 720,
                }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                  <>
                    Du premier regard
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accentDark }}>au dernier feu du parc.</em>
                  </>
                )}
              </h2>
            </div>
          </Reveal>

          <div className="i369-methode">
            {METHODE.map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.055}>
                <TempsMethode m={m} dernier={idx === METHODE.length - 1} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMULES — table fine, aux dates vraies ─────────────────────── */}
      <section
        id="tarifs"
        style={{
          background: C.bgAlt,
          padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <RomainFantome top="6%" right="0%" size="clamp(7rem,14vw,14rem)">
          №
        </RomainFantome>
        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <Kicker>Formules</Kicker>
            <h2
              style={{
                fontFamily: SERIF,
                fontWeight: 600,
                fontSize: "clamp(2rem,4vw,3.2rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.012em",
                color: C.ink,
                margin: "22px 0 14px",
              }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                <>
                  Le domaine, <em style={{ fontStyle: "italic", color: C.accentDark }}>aux dates vraies.</em>
                </>
              )}
            </h2>
            <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 600, lineHeight: 1.75, margin: 0 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.texte") ??
                "Le tarif dépend de la saison et du jour — il est publié, pas négocié à la tête du client. Acompte 30 %, solde à J-30."}
            </p>
          </Reveal>

          <div style={{ marginTop: "clamp(30px,4vw,52px)" }}>
            <Filet />
            {TARIFS.map((t: any, idx: number) => (
              <Reveal key={t.a ?? idx} delay={idx * 0.05}>
                <LigneFormule t={t} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── LE DOMAINE — panneau croisée + engagements ──────────────────── */}
      <section
        id="engagements"
        style={{
          background: C.bg,
          padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)",
        }}
      >
        <div className="i369-split" style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            {/* Emplacement photographié : la cérémonie au parc. Sans image,
                la croisée dessinée et la lueur tiennent le panneau. */}
            <PanneauCroisee
              src={photo(3, "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80")}
              alt="Cérémonie dans le parc du domaine"
              legende="L'allée de charmes"
              sous={ville + " · Val de Loire"}
            />
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              <Kicker>Le domaine</Kicker>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontWeight: 600,
                  fontSize: "clamp(1.9rem,3.6vw,3rem)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.012em",
                  color: C.ink,
                  margin: "20px 0 28px",
                }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>
                    Beau,
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accentDark }}>et en règle.</em>
                  </>
                )}
              </h2>
              {ENGAGEMENT.map((e: any, idx: number) => (
                <div key={idx} style={{ display: "flex", gap: 14, marginBottom: 16, alignItems: "flex-start" }}>
                  <span
                    aria-hidden
                    style={{ flexShrink: 0, marginTop: 9, width: 22, height: 1, background: C.accent, opacity: 0.85 }}
                  />
                  <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.7 }}>{e}</span>
                </div>
              ))}
              <div style={{ marginTop: 30 }}>
                <BoutonDomaine href={telHref}>Nous appeler</BoutonDomaine>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── AVIS — projecteur rotatif sous les lustres ──────────────────── */}
      <section
        style={{
          background: C.bgDark,
          padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "-30%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "70vw",
            height: "70vw",
            maxWidth: 900,
            maxHeight: 900,
            background: `radial-gradient(circle, ${C.hi} 0%, transparent 60%)`,
            opacity: 0.1,
            pointerEvents: "none",
          }}
        />
        <RomainFantome top="8%" left="-1%" size="clamp(8rem,18vw,17rem)" dark>
          «
        </RomainFantome>
        <div style={{ maxWidth: 880, margin: "0 auto", position: "relative", textAlign: "center" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Kicker color={C.hi} align="center">
                Livre d'or
              </Kicker>
            </div>
            <h2
              style={{
                fontFamily: SERIF,
                fontWeight: 600,
                fontSize: "clamp(1.9rem,3.8vw,3rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.012em",
                color: "#fff",
                margin: "22px 0 clamp(32px,4vw,48px)",
              }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                <>
                  Des jours <em style={{ fontStyle: "italic", color: C.hi }}>qui comptent</em>.
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
                fontFamily: SERIF,
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: "clamp(1.15rem,2.2vw,1.7rem)",
                lineHeight: 1.52,
                color: "rgba(255,255,255,0.92)",
                margin: "0 auto",
                maxWidth: 760,
                letterSpacing: "-0.005em",
              }}
            >
              «&nbsp;{A?.texte}&nbsp;»
            </p>
            <footer style={{ marginTop: 26 }}>
              <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 600, color: C.hi }}>{A?.auteur}</div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.55)",
                  marginTop: 6,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                }}
              >
                {A?.detail}
              </div>
            </footer>
          </motion.blockquote>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginTop: 32 }}>
            <SlideIndex i={avis.i} total={AVIS.length} variant="flat" color="rgba(255,255,255,0.5)" className="" />
            <HairlineArrows onPrev={avis.prev} onNext={avis.next} color="rgba(255,255,255,0.75)" className="" />
          </div>
        </div>
      </section>

      {/* ── CONTACT — venez à l'heure où le parc s'allume ───────────────── */}
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
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.35 }}>
          <CroiseeCSS tint={C.accent} opacity={0.35} />
        </div>
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Kicker align="center">Visites</Kicker>
            </div>
            <h2
              style={{
                fontFamily: SERIF,
                fontWeight: 600,
                fontSize: "clamp(2.1rem,4.4vw,3.6rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.012em",
                color: C.ink,
                margin: "22px 0 18px",
              }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                <>
                  Venez à 18 h,
                  <br />
                  <em style={{ fontStyle: "italic", color: C.accentDark }}>quand le parc s'allume.</em>
                </>
              )}
            </h2>
            <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 480, margin: "0 auto 38px", lineHeight: 1.75 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ??
                "Visites sur rendez-vous, 7j/7 en saison. Les samedis de mai à septembre 2027 partent vite — l'option de 15 jours est gratuite."}
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <BoutonDomaine href={telHref} large>
                <Phone size={16} style={{ marginRight: 2 }} /> {phone}
              </BoutonDomaine>
              <BoutonDomaine href={`mailto:${mail}`} plein={false} large>
                <Mail size={16} style={{ marginRight: 2 }} /> Nous écrire
              </BoutonDomaine>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PIED DE PAGE ────────────────────────────────────────────────── */}
      <footer style={{ background: C.bgDarkAlt, padding: "clamp(44px,6vw,68px) clamp(20px,5vw,64px) 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 34, marginBottom: 36 }}>
            <div style={{ minWidth: 240 }}>
              <div
                style={{
                  fontFamily: SERIF,
                  fontWeight: 600,
                  fontSize: 22,
                  color: C.hi,
                  marginBottom: 10,
                  letterSpacing: "0.01em",
                }}
              >
                {nom}
              </div>
              <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 13, lineHeight: 1.75, margin: 0, maxWidth: 360 }}>
                {metier} · {clientCodePostalVille(sessionData) ?? `${ville}, Val de Loire`}
                <br />
                ERP contrôlé — capacité 220 convives assis
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <MapPin size={13} />, t: clientAddress(sessionData) ?? `${ville}, Indre-et-Loire` },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Mail size={13} />, t: mail },
                { icon: <Clock size={13} />, t: "Visites sur rendez-vous, 7j/7 en saison" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 11, color: "rgba(255,255,255,0.42)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.hi }}>{item.icon}</span>
                  {item.t}
                </div>
              ))}
            </div>
          </div>
          <Filet />
          <div style={{ paddingTop: 18, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ color: "rgba(255,255,255,0.30)", fontSize: 12 }}>
              © 2026 {nom} — Site réalisé par Aevia WS · SIREN{" "}
              <LegalIdentity fallback="852 546 225" kind="siren" />
              {/* VILLE_PIED */}
              {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ color: "rgba(255,255,255,0.30)", fontSize: 12 }}>
              Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Sous-composants à état local ─────────────────────────────────────────── */

/** Une rangée d'espace : numéral romain, titre serif, survol qui dore. */
function RangeeEspace({ s }: any) {
  const [h, setH] = useState(false);
  return (
    <article
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        position: "relative",
        display: "flex",
        gap: "clamp(16px,2.6vw,36px)",
        alignItems: "flex-start",
        padding: "clamp(24px,3vw,36px) clamp(10px,1.8vw,24px)",
        borderBottom: `1px solid ${C.border}`,
        background: h ? C.bgCard : "transparent",
        transform: h ? "translateX(8px)" : "none",
        boxShadow: h
          ? `inset 2px 0 0 0 ${C.accent}, 0 22px 48px -32px rgba(33,28,21,0.35)`
          : "none",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      <span
        aria-hidden
        style={{
          flexShrink: 0,
          fontFamily: SERIF,
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: "clamp(24px,2.6vw,34px)",
          color: C.accent,
          opacity: h ? 0.9 : 0.4,
          lineHeight: 1.05,
          minWidth: 52,
          transition: `opacity .5s ${EASE_CSS}`,
        }}
      >
        {s.n}
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 9 }}>
          <h3
            style={{
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: "clamp(19px,2vw,25px)",
              color: C.ink,
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            {s.titre}
          </h3>
          <span
            style={{
              border: `1px solid ${C.border}`,
              color: C.accentDark,
              borderRadius: 999,
              padding: "3px 11px",
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              whiteSpace: "nowrap",
              background: h ? C.accentLight : "transparent",
              transition: `background .5s ${EASE_CSS}`,
            }}
          >
            {s.tag}
          </span>
        </div>
        <p style={{ fontSize: 14.5, color: C.textMuted, lineHeight: 1.78, margin: 0, maxWidth: 620 }}>{s.desc}</p>
      </div>
    </article>
  );
}

/** Un temps de la méthode : carte fine, filet qui pousse au survol. */
function TempsMethode({ m, dernier }: any) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: h ? C.bgCard : "transparent",
        border: `1px solid ${h ? C.accentLight : C.border}`,
        borderRadius: 2,
        padding: "clamp(24px,3vw,34px) clamp(20px,2.4vw,30px)",
        height: "100%",
        transform: h ? "translateY(-6px)" : "none",
        boxShadow: h
          ? "0 26px 54px -34px rgba(33,28,21,0.35), 0 4px 14px -10px rgba(33,28,21,0.22)"
          : "none",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      <div
        style={{
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: "clamp(24px,2.4vw,32px)",
          color: C.accent,
          opacity: h ? 1 : 0.55,
          lineHeight: 1,
          marginBottom: 14,
          transition: `opacity .5s ${EASE_CSS}`,
        }}
      >
        {m.n}
      </div>
      <div
        aria-hidden
        style={{
          height: 1,
          width: h ? 56 : 28,
          background: C.accent,
          opacity: 0.7,
          marginBottom: 14,
          transition: `width .5s ${EASE_CSS}`,
        }}
      />
      <h3 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "clamp(17px,1.8vw,21px)", color: C.ink, margin: "0 0 9px" }}>
        {m.t}
      </h3>
      <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.75, margin: 0 }}>{m.d}</p>
    </div>
  );
}

/** Une ligne de la table des formules. */
function LigneFormule({ t }: any) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className="i369-tarifrow"
      style={{
        display: "flex",
        gap: 18,
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "clamp(20px,2.4vw,30px) clamp(8px,1.4vw,18px)",
        borderBottom: `1px solid ${C.border}`,
        background: h ? C.bgCard : "transparent",
        transform: h ? "translateX(6px)" : "none",
        boxShadow: h ? `inset 2px 0 0 0 ${C.accent}, 0 16px 36px -28px rgba(33,28,21,0.35)` : "none",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      <div style={{ minWidth: 0, flex: "1 1 320px" }}>
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "clamp(17px,1.7vw,21px)", color: C.ink, letterSpacing: "-0.01em" }}>
          {t.a}
        </div>
        <div style={{ fontSize: 13.5, color: C.textMuted, marginTop: 7, lineHeight: 1.65, maxWidth: 540 }}>{t.n}</div>
      </div>
      <div
        style={{
          fontFamily: SERIF,
          fontWeight: 600,
          fontSize: "clamp(19px,2vw,25px)",
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

/** Le panneau photographié, avec la croisée dessinée en repli. */
function PanneauCroisee({ src, alt, legende, sous }: any) {
  return (
    <div
      style={{
        position: "relative",
        border: `1px solid ${C.border}`,
        borderRadius: 2,
        overflow: "hidden",
        aspectRatio: "4/3",
        background: `linear-gradient(160deg, ${C.bgDark} 0%, ${C.bgDarkAlt} 100%)`,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <>
          <CroiseeCSS tint={C.hi} opacity={0.4} />
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: "12% 30% 10% 30%",
              borderRadius: "42% 42% 2% 2% / 18% 18% 1% 1%",
              boxShadow: `inset 0 0 70px 0 ${C.lueur}`,
              opacity: 0.5,
            }}
          />
        </>
      )}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          background: "rgba(16,13,10,0.86)",
          borderTop: "1px solid rgba(207,179,122,0.28)",
          borderRight: "1px solid rgba(207,179,122,0.28)",
          padding: "10px 18px",
        }}
      >
        <span style={{ display: "block", fontSize: 10.5, letterSpacing: "0.30em", textTransform: "uppercase", color: C.hi }}>
          {legende}
        </span>
        <span style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 4, letterSpacing: "0.10em" }}>
          {sous}
        </span>
      </div>
    </div>
  );
}
