"use client";
// @ts-nocheck

/* ════════════════════════════════════════════════════════════════════════════
   {clientName(sessionData) ?? "Atlantique Matériels"} — Location de matériel de réception · La Rochelle
   ─────────────────────────────────────────────────────────────────────────────
   Location de matériel, 2e variante du catalogue (la 1re est impact-359, dépôt
   BTP, rail de chantier). Celle-ci est la réception : tentes, nappage, verrerie.

   Geste signature : PushBlur — toute la composition part sur le côté, photo et
   titre ensemble, avec un flou directionnel pendant le déplacement. Ici la
   poussée dit exactement le métier : LA SCÈNE QUI S'INSTALLE. Une salle vide se
   remplit d'un coup, floue, puis nette — comme le mercredi soir sous la tente.

   Archétype héros : H3 — plein cadre, titre en bas. Fond de repli `C.bgDark`
   obligatoire : sans photographie, le cadre reste une nuit d'été, pas un trou.

   Fontes : P9 — Syne (titres, grotesque à large chasse) × Work Sans (texte).

   Signature visuelle : le flou repris partout — cartes d'avis en verre dépoli,
   halos radiaux, filets qui se dissolvent. Et la guirlande : une rangée de
   points lumineux dessinée en CSS, jamais photographiée.
   ════════════════════════════════════════════════════════════════════════════ */

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, Clock, Mail, MapPin, PartyPopper, Phone, Tent, UtensilsCrossed } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, HairlineArrows, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
import { PushBlur } from "@/lib/templates/hero-kit-3";
import {
  clientAddress,
  clientAreas,
  clientCertifications,
  clientCity,
  clientCodePostalVille,
  clientEmail,
  clientEyebrow,
  clientHeroLine,
  clientHeroSubtitle,
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

/* ── Jetons ──────────────────────────────────────────────────────────────── */
let C: Record<string, string> = {
  bg: "#0f1216",
  bgAlt: "#161b21",
  bgDark: "#0a0d10",
  bgDarkAlt: "#06080a",
  bgCard: "#181e25",
  accent: "var(--brand, #3fa8c9)",
  accentDark: "var(--brand-light, #82cde5)",
  accentLight: "#0e1c22",
  ink: "#eef2f5",
  textMuted: "#98a3ae",
  textFaint: "#69737e",
  border: "rgba(255,255,255,0.09)",
  white: "#ffffff",
  /* clé métier : le lin des nappes, la seule couleur chaude du thème */
  lin: "#d9c8a9",
};

const DISPLAY = "'Syne', system-ui, sans-serif";
const SANS = "'Work Sans', system-ui, -apple-system, sans-serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_CSS = "cubic-bezier(.16,1,.3,1)";

const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Work+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');`;

const NAV = [
  { l: "Catalogue", h: "#services" },
  { l: "Le déroulé", h: "#methode" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* ── Données de démonstration ────────────────────────────────────────────── */

/*
  Les trois scènes du thème — mariage, table, entreprise — avec leurs légendes
  d'origine. Le titre de chaque scène reprend la phrase que le thème écrivait
  déjà : rien de nouveau, seulement une autre échelle.
*/
const HERO_SOURCE = [
  {
    k: "Mariages",
    l1: "Tout pour recevoir,",
    l2: "rien à stocker ensuite.",
    line: "La tente montée mercredi, l'esprit libre samedi.",
    sub: "Tentes de réception 50 à 300 personnes.",
    alt: "Chapiteau dressé pour une réception",
    /* le repli sans image : une nuit d'été sous la tente, en dégradés */
    repli: "linear-gradient(158deg, #0a0d10 0%, #12222a 46%, #0a0d10 100%)",
    halo: "radial-gradient(58% 52% at 26% 24%, rgba(63,168,201,0.20), transparent 66%)",
  },
  {
    k: "Vaisselle & arts de la table",
    l1: "Rendue sale,",
    l2: "relavée par nos machines.",
    line: "Rendue sale, relavée par nos machines.",
    sub: "Assiettes, verrerie, nappage — au carton près.",
    alt: "Tables dressées avant une réception",
    repli: "linear-gradient(158deg, #0a0d10 0%, #1b1c18 48%, #0a0d10 100%)",
    halo: "radial-gradient(56% 50% at 70% 30%, rgba(217,200,169,0.18), transparent 64%)",
  },
  {
    k: "Entreprises",
    l1: "Séminaires, inaugurations,",
    l2: "clé en main.",
    line: "Séminaires et inaugurations clé en main.",
    sub: "Scène, sono, mobilier, montage compris.",
    alt: "Salle de séminaire équipée",
    repli: "linear-gradient(158deg, #0a0d10 0%, #131a24 50%, #0a0d10 100%)",
    halo: "radial-gradient(60% 52% at 48% 22%, rgba(63,168,201,0.16), transparent 68%)",
  },
];
let HERO = HERO_SOURCE;

const SERVICES_SOURCE = [
  { titre: "Tentes & barnums", desc: "Tentes de réception 20 à 300 m², planchers, éclairages guirlande : montées par nos équipes, ancrées selon les règles, démontées après.", tag: "Tentes" },
  { titre: "Mobilier", desc: "Tables rondes et rectangulaires, chaises Napoléon ou pliantes, mange-debout, salons lounge : livrés propres, housses comprises.", tag: "Mobilier" },
  { titre: "Vaisselle & verrerie", desc: "Assiettes, couverts, verres au modèle, nappage tissu : comptés au départ, rendus sales, relavés chez nous. Casse facturée au juste prix affiché.", tag: "Table" },
  { titre: "Sono & lumière", desc: "Enceintes, micros HF, pistes de danse, éclairages d'ambiance : réglés à la livraison, notice simple, hotline le soir J.", tag: "Technique" },
  { titre: "Cuisine traiteur", desc: "Étuves, frigos-remorques, plans de travail : l'arrière-cuisine du traiteur, posée derrière la tente.", tag: "Traiteur" },
  { titre: "Formules clé en main", desc: "Mariage 100 personnes, séminaire 50, anniversaire 30 : des packs éprouvés, ajustables, chiffrés en une fois.", tag: "Packs" },
];
let SERVICES_DEMO = SERVICES_SOURCE;

let METHODE = [
  { n: "01", t: "Devis sur plan", d: "Envoyez le lieu, la date, le nombre d'invités : devis détaillé sous 48 h, repérage sur place pour les tentes." },
  { n: "02", t: "Livraison à J-2", d: "Tout arrive le mercredi ou jeudi : le temps de dresser sans courir, tentes montées par nos équipes." },
  { n: "03", t: "Le jour J, une hotline", d: "Un numéro qui répond le soir de l'événement — pour le fusible de la sono ou la rallonge manquante." },
  { n: "04", t: "Reprise le lundi", d: "Vaisselle sale dans les cartons, nappes en vrac dans les sacs : on reprend tout, on lave tout." },
];

const ENGAGEMENT_DEMO = [
  "Matériel de réception contrôlé et compté à chaque rotation, tentes certifiées et ancrées selon les normes",
  "Livraison à J-2 garantie par contrat — pas la veille au soir",
  "Hotline le soir de l'événement, réponse humaine jusqu'à minuit",
  "Casse au tarif affiché d'avance, caution levée après comptage contradictoire",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

const TARIFS_DEMO = [
  { a: "Pack mariage 100 pers.", p: "dès 1 890 €", n: "Tente 150 m² montée, tables, chaises, vaisselle complète, guirlandes." },
  { a: "Vaisselle complète (par pers.)", p: "3,90 €", n: "Assiettes ×3, couverts, verres ×3, rendus sales." },
  { a: "Tente 50 m² montée", p: "490 €", n: "Week-end complet, plancher en option, ancrage compris." },
  { a: "Sono cérémonie + soirée", p: "290 €", n: "Enceintes, micro HF, piste de danse en option, réglée sur place." },
];
let TARIFS = TARIFS_DEMO;

const AVIS_SOURCE = [
  { texte: "Mariage de 140 personnes dans le jardin familial : tente montée le mercredi, plan B pluie anticipé, hotline appelée à 22h pour un fusible — réglé en dix minutes. Parfait de bout en bout.", auteur: "Claire & Bastien", detail: "Pack mariage" },
  { texte: "Rendre la vaisselle sale ! Celui qui a inventé ça mérite une médaille. Le lundi matin, tout était repris, le jardin était rendu aux enfants.", auteur: "Famille Rousseau", detail: "Anniversaire 60 pers." },
  { texte: "Séminaire de 80 collaborateurs sous tente en bord de mer : montage impeccable malgré le vent, scène et sono calées à l'heure. Re-réservé pour l'an prochain avant de partir.", auteur: "Office manager, biotech", detail: "Événement entreprise" },
];
let AVIS_DEMO = AVIS_SOURCE;

const STATS_DEMO = [
  { value: "300", label: "Personnes sous notre plus grande tente" },
  { value: "0", label: "Vaisselle à relaver chez vous" },
  { value: "J-2", label: "Livraison avant l'événement" },
  { value: "15 ans", label: "De mariages sans pluie dedans" },
];
let STATS = STATS_DEMO;

function ZONES_SOURCE_LIVE() {
  return [clientCity(sessionData) ?? "La Rochelle", "Charente-Maritime", "30 km sans frais de livraison"];
}
let ZONES_SOURCE = ZONES_SOURCE_LIVE();
let ZONES = ZONES_SOURCE;

/* ── Primitives ──────────────────────────────────────────────────────────── */

function Reveal({ children, delay = 0, y = 26, style }: { children: React.ReactNode; delay?: number; y?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -10% 0px" });
  return (
    <motion.div
      ref={ref}
      style={style}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.86, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Le kicker du thème : filet 40×1 px, capitales filées à 0.36em. */
function Kicker({ children, color = C.accent, align = "left" }: { children: React.ReactNode; color?: string; align?: "left" | "center" }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 14, justifyContent: align === "center" ? "center" : "flex-start" }}>
      <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${color})`, flexShrink: 0 }} />
      <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.36em", textTransform: "uppercase", color }}>{children}</span>
      {align === "center" && <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${color}, transparent)`, flexShrink: 0 }} />}
    </span>
  );
}

/**
 * La guirlande : douze points lumineux suspendus à un filet, dessinés en CSS.
 * C'est le détail gratuit du thème — celui que personne ne demande et que tout
 * le monde reconnaît sous une tente.
 */
function Guirlande({ points = 12, couleur = C.lin }: { points?: number; couleur?: string }) {
  return (
    <div aria-hidden style={{ position: "relative", height: 26, width: "100%", pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 5, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${C.border} 12%, ${C.border} 88%, transparent)` }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "space-around", alignItems: "flex-start" }}>
        {Array.from({ length: points }).map((_, n) => (
          <span key={n} style={{ display: "block", width: 1, height: 9, background: C.border, position: "relative" }}>
            <span
              className="i360-anim"
              style={{
                position: "absolute",
                left: -3,
                bottom: -7,
                width: 7,
                height: 7,
                borderRadius: 99,
                background: couleur,
                opacity: 0.24 + ((n * 7) % 5) * 0.12,
                boxShadow: `0 0 10px 1px ${couleur}44`,
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

/** La trame de nappe : la texture de fond du thème, sans une seule image. */
function Nappe({ opacity = 0.05, teinte = "rgba(217,200,169,0.9)" }: { opacity?: number; teinte?: string }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity,
        backgroundImage: `repeating-linear-gradient(0deg, ${teinte} 0px, ${teinte} 1px, transparent 1px, transparent 9px), repeating-linear-gradient(90deg, ${teinte} 0px, ${teinte} 1px, transparent 1px, transparent 9px)`,
      }}
    />
  );
}

/** Le chiffre fantôme du thème : Syne, très large chasse, opacité 0.05. */
function GhostNum({ children, size = "clamp(96px,13vw,196px)", right = false, color = "rgba(255,255,255,0.05)" }: { children: React.ReactNode; size?: string; right?: boolean; color?: string }) {
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        top: "-0.2em",
        left: right ? "auto" : "-0.02em",
        right: right ? "-0.02em" : "auto",
        fontFamily: DISPLAY,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: "-0.03em",
        color,
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 0,
      }}
    >
      {children}
    </span>
  );
}

function NavLink({ label, href, onClick }: { label: string; href: string; onClick?: () => void }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        position: "relative",
        fontFamily: SANS,
        fontSize: 12.5,
        fontWeight: 500,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: h ? C.ink : C.textMuted,
        textDecoration: "none",
        padding: "12px 2px",
        transition: `color .45s ${EASE_CSS}`,
      }}
    >
      {label}
      <span
        style={{
          position: "absolute",
          left: 0,
          bottom: 6,
          height: 1,
          width: h ? "100%" : "0%",
          background: C.accent,
          transition: `width .5s ${EASE_CSS}`,
        }}
      />
    </a>
  );
}

function Btn({ children, href, filled = false }: { children: React.ReactNode; href: string; filled?: boolean }) {
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
        padding: filled ? "15px 30px" : "14px 26px",
        fontFamily: SANS,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        borderRadius: 99,
        textDecoration: "none",
        border: `1px solid ${filled ? "transparent" : h ? C.accent : "rgba(255,255,255,0.26)"}`,
        background: filled ? (h ? C.accentDark : C.accent) : h ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        color: filled ? "#08161c" : C.ink,
        boxShadow: h && filled ? "0 18px 40px -20px rgba(63,168,201,0.6), 0 3px 12px -7px rgba(0,0,0,0.7)" : "0 0 0 rgba(0,0,0,0)",
        transform: h ? "translateY(-2px)" : "none",
        transition: `background .5s ${EASE_CSS}, box-shadow .5s ${EASE_CSS}, transform .5s ${EASE_CSS}, border-color .5s ${EASE_CSS}`,
      }}
    >
      {children}
      <ArrowRight size={14} style={{ transform: h ? "translateX(4px)" : "none", transition: `transform .5s ${EASE_CSS}` }} />
    </a>
  );
}

/** Un poste du catalogue : rangée éditoriale pleine largeur, numérotée. */
function CatalogueRow({ item, i }: { item: any; i: number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={(i % 3) * 0.05}>
      <article
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        className="i360-crow"
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "clamp(58px,6vw,92px) minmax(0,0.95fr) minmax(0,1.3fr)",
          gap: "clamp(16px,3vw,44px)",
          alignItems: "start",
          padding: "clamp(26px,3.4vw,46px) clamp(10px,1.6vw,22px)",
          borderTop: `1px solid ${C.border}`,
          background: h ? C.bgCard : "transparent",
          transform: h ? "translateX(6px)" : "none",
          boxShadow: h
            ? "0 30px 58px -40px rgba(0,0,0,0.9), 0 5px 16px -11px rgba(63,168,201,0.28)"
            : "0 0 0 rgba(0,0,0,0)",
          transition: `background .5s ${EASE_CSS}, transform .5s ${EASE_CSS}, box-shadow .5s ${EASE_CSS}`,
        }}
      >
        <span
          aria-hidden
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: "clamp(26px,3vw,42px)",
            color: h ? C.accent : "rgba(255,255,255,0.14)",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            transition: `color .5s ${EASE_CSS}`,
          }}
        >
          {String(i + 1).padStart(2, "0")}
        </span>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(20px,2.3vw,30px)", color: C.ink, margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" }}>{item.titre}</h3>
          <span
            style={{
              display: "inline-block",
              marginTop: 14,
              fontFamily: SANS,
              fontSize: 9.5,
              fontWeight: 600,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: C.accent,
              borderBottom: `1px solid ${h ? C.accent : C.border}`,
              paddingBottom: 4,
              transition: `border-color .5s ${EASE_CSS}`,
            }}
          >
            {item.tag}
          </span>
        </div>
        <p style={{ fontFamily: SANS, fontSize: "clamp(14px,1.15vw,15.5px)", fontWeight: 300, color: C.textMuted, lineHeight: 1.8, margin: 0, maxWidth: 520 }}>{item.desc}</p>
      </article>
    </Reveal>
  );
}

/** Une ligne de tarif : table fine, conducteur pointillé, prix en Syne. */
function TarifRow({ item, i }: { item: any; i: number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={i * 0.05}>
      <div
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px clamp(14px,2vw,28px)",
          alignItems: "baseline",
          padding: "clamp(20px,2.5vw,32px) clamp(6px,1.4vw,18px)",
          borderTop: `1px solid ${C.border}`,
          background: h ? "rgba(255,255,255,0.035)" : "transparent",
          transform: h ? "translateY(-2px)" : "none",
          boxShadow: h ? "0 22px 44px -36px rgba(0,0,0,0.9), 0 2px 10px -7px rgba(63,168,201,0.3)" : "0 0 0 rgba(0,0,0,0)",
          transition: `background .5s ${EASE_CSS}, transform .5s ${EASE_CSS}, box-shadow .5s ${EASE_CSS}`,
        }}
      >
        <div style={{ minWidth: 0, flex: "1 1 260px" }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "clamp(17px,1.7vw,22px)", color: C.ink, lineHeight: 1.24, letterSpacing: "-0.015em" }}>{item.a}</div>
          <div style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 300, color: C.textFaint, marginTop: 7, lineHeight: 1.7, maxWidth: 520 }}>{item.n}</div>
        </div>
        <span
          aria-hidden
          style={{
            flex: "1 1 40px",
            height: 1,
            alignSelf: "center",
            minWidth: 24,
            backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.18) 50%, transparent 50%)`,
            backgroundSize: "6px 1px",
            opacity: h ? 1 : 0.5,
            transition: `opacity .5s ${EASE_CSS}`,
          }}
        />
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(19px,2vw,26px)", color: h ? C.accentDark : C.accent, whiteSpace: "nowrap", letterSpacing: "-0.02em", transition: `color .5s ${EASE_CSS}` }}>{item.p}</div>
      </div>
    </Reveal>
  );
}

function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════════════ */
export default function AtlantiqueMaterielsPage() {
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
    clientMethode(sessionData)?.map((e: any, i: number) => ({ ...METHODE[i % METHODE.length], ...e })),
    METHODE,
  );
  ZONES_SOURCE = ZONES_SOURCE_LIVE();


  const CLIENT_SERVICES = clientServices(sessionData);

  SERVICES_DEMO = resolveList(
    CLIENT_SERVICES?.map((s: any, i: number) => ({ ...SERVICES_SOURCE[i % SERVICES_SOURCE.length], titre: s.title })),
    SERVICES_SOURCE,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({ ...AVIS_SOURCE[i % AVIS_SOURCE.length], auteur: r.author, texte: r.text })),
    AVIS_SOURCE,
  );
  TARIFS = resolveList(
    CLIENT_SERVICES?.map((s: any, i: number) => ({
      ...TARIFS_DEMO[i % TARIFS_DEMO.length],
      a: s.title,
      p: s.price ?? TARIFS_DEMO[i % TARIFS_DEMO.length].p,
      n: s.description || s.desc || TARIFS_DEMO[i % TARIFS_DEMO.length].n,
    })),
    TARIFS_DEMO,
  );
  STATS = resolveList(clientStats(sessionData), STATS_DEMO);
  ENGAGEMENT = resolveList(clientCertifications(sessionData), ENGAGEMENT_DEMO);
  ZONES = resolveList(clientAreas(sessionData), ZONES_SOURCE);

  /*
    Les scènes du héros portent la photo du client quand il en a fourni une, à
    son rang ; sinon la photographie du thème pour la première, et le repli
    dessiné pour les suivantes — jamais une URL inventée.
  */
  HERO = HERO_SOURCE.map((row: any, n: number) => ({
    ...row,
    img: photo(n, n === 0 ? "https://images.pexels.com/photos/37958130/pexels-photo-37958130.jpeg?auto=compress&cs=tinysrgb&w=1400" : ""),
  }));

  brand = fd?.brandColor ?? null;
  if (brand) C = { ...C, accent: brand };

  const SERVICES = resolveList(
    CLIENT_SERVICES?.map((s: any, n: number) => ({
      titre: s.title ?? SERVICES_DEMO[n % SERVICES_DEMO.length].titre,
      desc: s.description ?? s.desc ?? SERVICES_DEMO[n % SERVICES_DEMO.length].desc,
      tag: SERVICES_DEMO[n % SERVICES_DEMO.length].tag,
    })),
    SERVICES_DEMO,
  );
  const AVIS = resolveList(
    clientReviews(sessionData)?.map((r: any, n: number) => ({
      texte: r.text ?? AVIS_DEMO[n % AVIS_DEMO.length].texte,
      auteur: r.name ?? AVIS_DEMO[n % AVIS_DEMO.length].auteur,
      detail: r.location ?? r.role ?? AVIS_DEMO[n % AVIS_DEMO.length].detail,
    })),
    AVIS_DEMO,
  );

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduce = useReducedMotion();

  /* Un seul index pilote tout le héros : la poussée, le titre, le compteur. */
  const { i, next, prev } = useSlides(HERO.length, DWELL.normal);
  const S = HERO[i];

  /*
    Le titre plein cadre. La première scène porte celui du client quand la
    génération en a produit un ; les suivantes gardent les phrases du thème.
    Syne 700 en plein cadre tient 24 signes par ligne : c'est le maxLigne.
  */
  /*
    Les couvertures suivantes portaient encore la phrase du thème : « Séminaires,
    inaugurations, clé en main. » s'affichait en grand chez un couvreur, quelques
    secondes après son propre titre. Elles prennent donc ses prestations, et le
    thème ne reprend la main que si le client n'en a déclaré aucune.
  */
  const presta = clientServices(sessionData)?.[i]?.title as string | undefined;
  const l1 = i === 0 ? clientHeroLine(sessionData, 0, 2, 24) ?? S.l1 : presta ?? S.l1;
  const l2 = i === 0 ? clientHeroLine(sessionData, 1, 2, 24) ?? S.l2 : presta ? "" : S.l2;

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const marque = fd?.businessName ?? clientName(sessionData) ?? "Atlantique Matériels";
  const ville = clientCity(sessionData) ?? "La Rochelle";
  const phone = clientPhone(sessionData) ?? fd?.phone ?? "05 46 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33546000000").replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "devis@atlantique-materiels.fr";
  const adresse = clientAddress(sessionData);
  const lieu = clientCodePostalVille(sessionData, "", ville).trim();

  /* Le panneau des engagements : photo du client, ou tente dessinée. */
  const imgEngagement = photo(3, "");

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip", WebkitFontSmoothing: "antialiased" }}>
      <style>{FONTS_CSS}</style>
      <style>{`
        @media (max-width: 1000px) { #i360-nav { display: none !important; } .i360-burger { display: flex !important; } }
        @media (max-width: 900px) {
          .i360-herotext { padding: 0 22px 44px !important; max-width: none !important; }
          .i360-herometa { gap: 12px !important; }
          .i360-crow { grid-template-columns: minmax(0,1fr) !important; gap: 12px !important; }
          .i360-split { grid-template-columns: minmax(0,1fr) !important; gap: 32px !important; }
          .i360-split > * { order: initial !important; }
          .i360-statband { grid-template-columns: repeat(auto-fit, minmax(min(150px,100%),1fr)) !important; }
          .i360-statcell { border-right: none !important; border-top: 1px solid rgba(255,255,255,0.08) !important; }
          .i360-methode { grid-template-columns: minmax(0,1fr) !important; }
          .i360-sticky { position: static !important; }
          .i360-avis { grid-template-columns: minmax(0,1fr) !important; }
          .i360-avis > * { margin-top: 0 !important; }
          .i360-pad { padding-left: 22px !important; padding-right: 22px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .i360-anim { transition: none !important; animation: none !important; }
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
          padding: scrolled ? "10px clamp(20px,4vw,52px)" : "20px clamp(20px,4vw,52px)",
          background: scrolled ? "rgba(15,18,22,0.9)" : "transparent",
          backdropFilter: scrolled ? "blur(16px) saturate(130%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px) saturate(130%)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          transition: `padding .55s ${EASE_CSS}, background .55s ${EASE_CSS}, backdrop-filter .55s ${EASE_CSS}, border-color .55s ${EASE_CSS}`,
        }}
      >
        <a href="#top" style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, textDecoration: "none" }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={marque} style={{ height: 30, maxWidth: 170, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <PartyPopper size={17} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 19, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", letterSpacing: "-0.02em" }}>{marque}</span>
              <span style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.28em", textTransform: "uppercase", color: C.textFaint, marginLeft: 6 }}>{clientTrade(sessionData) ?? "Réception & événement"}</span>
            </>
          )}
        </a>
        <div id="i360-nav" style={{ display: "flex", gap: "clamp(12px,1.6vw,26px)", alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <NavLink key={l} label={l} href={h} />
          ))}
          <Btn href={telHref} filled>
            Devis événement
          </Btn>
        </div>
        <button
          className="i360-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 62, left: 0, right: 0, zIndex: 99, background: C.bgAlt, borderBottom: `1px solid ${C.border}`, padding: "18px 26px 24px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map(({ l, h }) => (
            <NavLink key={l} label={l} href={h} onClick={() => setMobileOpen(false)} />
          ))}
          <a href={telHref} style={{ background: C.accent, color: "#08161c", borderRadius: 99, padding: "14px 22px", fontFamily: SANS, fontSize: 12, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", textDecoration: "none", textAlign: "center", marginTop: 12 }}>
            Devis événement
          </a>
        </div>
      )}

      {/* ── HERO — H3 : plein cadre, titre en bas, la scène poussée ──────── */}
      <section
        id="top"
        style={{
          position: "relative",
          minHeight: "100dvh",
          /* fond de repli obligatoire sous toute section plein cadre */
          background: C.bgDark,
          overflow: "hidden",
          display: "flex",
        }}
      >
        {/*
          Le geste : la composition entière — photographie ET titre — sort par la
          droite avec un flou directionnel pendant que la suivante entre par la
          gauche. C'est la scène qu'on démonte et qu'on remonte, à l'échelle 1.
        */}
        <PushBlur index={i} amount={18} style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", inset: 0 }}>
            {S.img ? (
              <img src={S.img} alt={`${marque} — ${S.alt}`} loading="eager" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <div aria-hidden style={{ position: "absolute", inset: 0, background: S.repli }}>
                <Nappe opacity={0.06} />
                <div style={{ position: "absolute", inset: 0, background: S.halo }} />
              </div>
            )}
            {/* scrim à quatre arrêts : le titre se lit sur n'importe quelle photo */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(6,8,10,0.94) 0%, rgba(6,8,10,0.74) 24%, rgba(6,8,10,0.28) 52%, rgba(6,8,10,0.06) 74%, rgba(6,8,10,0.42) 100%)",
              }}
            />

            {/* le titre, en bas du cadre */}
            <div
              className="i360-herotext i360-pad"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                padding: "0 clamp(22px,5vw,72px) clamp(96px,11vw,132px)",
                maxWidth: 1340,
                margin: "0 auto",
              }}
            >
              <Kicker>{clientEyebrow(sessionData) ?? <>Matériel de réception · {ville}</>}</Kicker>
              <h1
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  fontSize: "clamp(36px,6.2vw,88px)",
                  color: C.ink,
                  lineHeight: 0.98,
                  letterSpacing: "-0.032em",
                  margin: "clamp(16px,2vw,26px) 0 clamp(14px,1.6vw,22px)",
                  maxWidth: 1080,
                  textShadow: "0 2px 30px rgba(0,0,0,0.4)",
                }}
              >
                {l1}
                <br />
                <em style={{ fontStyle: "italic", fontWeight: 500, color: C.accentDark }}>{l2}</em>
              </h1>
              <p style={{ fontFamily: SANS, fontSize: "clamp(15.5px,1.25vw,17.5px)", fontWeight: 300, color: "rgba(238,242,245,0.82)", lineHeight: 1.76, maxWidth: 560, margin: 0 }}>
                {clientHeroSubtitle(sessionData) ??
                  clientTagline(sessionData) ??
                  "Tentes, tables, vaisselle, sono : le matériel de vos mariages, réceptions et séminaires, livré propre, monté à l'heure, repris sale — c'est notre métier de le laver."}
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginTop: "clamp(22px,2.8vw,34px)" }}>
                <Btn href={telHref} filled>
                  Chiffrer mon événement
                </Btn>
                <Btn href="#services">Le catalogue</Btn>
              </div>
            </div>
          </div>
        </PushBlur>

        {/* La barre de scène : compteur, légende et flèches — hors de la poussée,
            parce qu'un pilote qui part avec le décor n'est plus un pilote. */}
        <div
          className="i360-pad"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 3,
            padding: "0 clamp(22px,5vw,72px) clamp(22px,2.6vw,34px)",
            maxWidth: 1340,
            margin: "0 auto",
          }}
        >
          <Guirlande points={14} />
          <div className="i360-herometa" style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
            <SlideIndex i={i} total={HERO.length} variant="fraction" color={C.textMuted} className="" />
            <motion.span
              key={`meta-${i}`}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0.2 : 0.55, ease: EASE }}
              style={{ fontFamily: SANS, fontSize: 13, fontWeight: 300, color: C.textMuted, lineHeight: 1.6 }}
            >
              <strong style={{ color: C.ink, fontWeight: 600 }}>{S.k}</strong> — {S.sub}
            </motion.span>
            <HairlineArrows onPrev={prev} onNext={next} color={C.ink} className="" />
          </div>
        </div>
      </section>

      {/* ── RESPIRATION ─────────────────────────────────────────────────── */}
      <section className="i360-pad" style={{ background: C.bgAlt, padding: "clamp(72px,10vw,136px) clamp(22px,8vw,150px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <Nappe opacity={0.035} />
        <div style={{ position: "relative" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
              <Kicker color={C.lin} align="center">La veille au soir</Kicker>
            </div>
          </Reveal>
          <Reveal delay={0.09}>
            <p style={{ fontFamily: SANS, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(22px,3.1vw,42px)", lineHeight: 1.38, color: C.ink, maxWidth: 940, margin: "0 auto", letterSpacing: "-0.008em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "respiration.texte") ?? (<>
              Une réception réussie, c'est un décor qui était déjà là mercredi — et que personne n'a vu arriver.
            </>)}</p>
          </Reveal>
          <Reveal delay={0.18}>
            <div style={{ width: 1, height: 78, background: `linear-gradient(${C.accent}, transparent)`, margin: "clamp(34px,4vw,52px) auto 0" }} />
          </Reveal>
        </div>
      </section>

      {/* ── CATALOGUE — rangées éditoriales pleine largeur ───────────────── */}
      <section id="services" className="i360-pad" style={{ background: C.bg, padding: "clamp(80px,11vw,150px) clamp(22px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
          <GhostNum right>{String(SERVICES.length).padStart(2, "0")}</GhostNum>
          <Reveal>
            <div style={{ marginBottom: "clamp(28px,3.5vw,46px)", position: "relative" }}>
              <Kicker>Catalogue</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(31px,4.6vw,60px)", color: C.ink, margin: "18px 0 0", lineHeight: 1.02, letterSpacing: "-0.03em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>
                Du barnum<br /><em style={{ fontStyle: "italic", fontWeight: 500, color: C.accent }}>à la coupe à champagne.</em>
              </>)}</h2>
              <p style={{ fontFamily: SANS, fontSize: "clamp(14.5px,1.15vw,16px)", fontWeight: 300, color: C.textMuted, lineHeight: 1.8, maxWidth: 540, marginTop: 20 }}>
                Six postes, un seul devis, une seule livraison. Ce qui arrive le mercredi repart le lundi — sale, et ce n'est pas votre problème.
              </p>
            </div>
          </Reveal>
          <div style={{ borderBottom: `1px solid ${C.border}` }}>
            {SERVICES.map((s: any, idx: number) => (
              <CatalogueRow key={s.titre + String(idx)} item={s} i={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CHIFFRES — bande sombre, chiffres fantômes derrière ──────────── */}
      <section style={{ background: C.bgDark, position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(68% 100% at 50% 0%, rgba(63,168,201,0.12), transparent 70%)" }} />
        <div
          className="i360-statband i360-pad"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1180, margin: "0 auto", padding: "0 clamp(22px,4vw,44px)", position: "relative" }}
        >
          {STATS.map((s: any, idx: number) => (
            <Reveal key={s.label} delay={idx * 0.07}>
              <div className="i360-statcell" style={{ position: "relative", padding: "clamp(36px,4.4vw,58px) 10px", textAlign: "center", borderRight: idx < STATS.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none", overflow: "hidden" }}>
                <span aria-hidden style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(74px,8.6vw,128px)", color: "rgba(255,255,255,0.045)", lineHeight: 1, letterSpacing: "-0.04em", pointerEvents: "none", userSelect: "none" }}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div style={{ position: "relative", fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(30px,3.5vw,45px)", color: C.accent, lineHeight: 1, letterSpacing: "-0.03em" }}>{s.value}</div>
                <div style={{ position: "relative", fontFamily: SANS, fontSize: 11.5, letterSpacing: "0.11em", textTransform: "uppercase", color: "rgba(255,255,255,0.44)", marginTop: 13, lineHeight: 1.5 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── LE DÉROULÉ — titre collant, étapes filetées ──────────────────── */}
      <section id="methode" className="i360-pad" style={{ background: C.bgAlt, padding: "clamp(80px,11vw,152px) clamp(22px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <Nappe opacity={0.03} />
        <div
          className="i360-methode"
          style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,0.86fr) minmax(0,1.14fr)", gap: "clamp(32px,5vw,84px)", alignItems: "start", position: "relative" }}
        >
          <div className="i360-sticky" style={{ position: "sticky", top: 116, alignSelf: "start" }}>
            <Reveal>
              <Kicker>Le déroulé</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(29px,4.2vw,54px)", color: C.ink, margin: "18px 0 20px", lineHeight: 1.02, letterSpacing: "-0.03em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (<>
                Vous recevez,<br /><em style={{ fontStyle: "italic", fontWeight: 500, color: C.accent }}>on porte le reste.</em>
              </>)}</h2>
              <p style={{ fontFamily: SANS, fontSize: "clamp(14.5px,1.15vw,16px)", fontWeight: 300, color: C.textMuted, lineHeight: 1.8, maxWidth: 420 }}>
                Quatre temps, du devis à la reprise. Le seul que vous vivrez vraiment, c'est le troisième — et il y a un numéro qui répond.
              </p>
              <div style={{ width: 60, height: 1, background: `linear-gradient(90deg, ${C.accent}, transparent)`, marginTop: 26 }} />
            </Reveal>
          </div>
          <div>
            {METHODE.map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.06}>
                <div style={{ position: "relative", display: "flex", gap: "clamp(18px,2.6vw,36px)", alignItems: "flex-start", padding: "clamp(24px,3.2vw,40px) 0", borderTop: `1px solid ${C.border}` }}>
                  <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(26px,3.2vw,42px)", color: C.lin, lineHeight: 1, minWidth: 60, flexShrink: 0, letterSpacing: "-0.03em" }}>{m.n}</span>
                  <div>
                    <h3 style={{ fontFamily: SANS, fontSize: "clamp(15.5px,1.3vw,17.5px)", fontWeight: 600, letterSpacing: "0.01em", color: C.ink, margin: "0 0 10px" }}>{m.t}</h3>
                    <p style={{ fontFamily: SANS, fontSize: "clamp(14px,1.1vw,15.5px)", fontWeight: 300, color: C.textMuted, lineHeight: 1.8, margin: 0, maxWidth: 500 }}>{m.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            <div style={{ borderTop: `1px solid ${C.border}` }} />
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENTS — split, panneau à DROITE ────────────────────────── */}
      <section id="engagements" className="i360-pad" style={{ background: C.bg, padding: "clamp(80px,11vw,150px) clamp(22px,5vw,64px)" }}>
        <div className="i360-split" style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(34px,5vw,76px)", alignItems: "center" }}>
          <Reveal style={{ order: 2 }}>
            <div style={{ position: "relative", overflow: "hidden", background: C.bgDark, border: `1px solid ${C.border}`, aspectRatio: "4/3.3" }}>
              {imgEngagement ? (
                <img src={imgEngagement} alt="Montage d'une tente de réception" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              ) : (
                <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(152deg, #0a0d10 0%, #13202a 50%, #06080a 100%)", display: "grid", placeItems: "center" }}>
                  <Nappe opacity={0.06} />
                  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(58% 54% at 50% 34%, rgba(63,168,201,0.16), transparent 66%)" }} />
                  <Tent size={92} color={C.accent} strokeWidth={1} style={{ position: "relative", opacity: 0.85 }} aria-hidden />
                </div>
              )}
              <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,8,10,0.5) 0%, rgba(6,8,10,0.05) 46%, transparent 100%)" }} />
              <div style={{ position: "absolute", left: 20, bottom: 18, fontFamily: SANS, fontSize: 10, fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.86)" }}>
                Montage à J-2
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12} style={{ order: 1 }}>
            <div>
              <Kicker>Nos engagements</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(28px,4vw,50px)", color: C.ink, margin: "18px 0 26px", lineHeight: 1.04, letterSpacing: "-0.03em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (<>
                Le grand jour<br /><em style={{ fontStyle: "italic", fontWeight: 500, color: C.accent }}>n'a pas de plan B.</em>
              </>)}</h2>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {ENGAGEMENT.map((e: string, idx: number) => (
                  <li key={idx} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "15px 0", borderTop: idx === 0 ? "none" : `1px solid ${C.border}` }}>
                    <span aria-hidden style={{ marginTop: 10, width: 18, height: 1, background: C.accent, flexShrink: 0 }} />
                    <span style={{ fontFamily: SANS, fontSize: "clamp(14px,1.12vw,15.5px)", fontWeight: 300, color: C.textMuted, lineHeight: 1.72 }}>{e}</span>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 30 }}>
                <Btn href={telHref} filled>
                  Nous appeler
                </Btn>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TARIFS — table fine à conducteur pointillé ───────────────────── */}
      <section id="tarifs" className="i360-pad" style={{ background: C.bgAlt, padding: "clamp(80px,11vw,150px) clamp(22px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1020, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Kicker align="center">Tarifs</Kicker>
              </div>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(30px,4.4vw,56px)", color: C.ink, margin: "18px 0 0", lineHeight: 1.02, letterSpacing: "-0.03em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Au carton près, <em style={{ fontStyle: "italic", fontWeight: 500, color: C.accent }}>livraison comprise*.</em></>)}</h2>
              <p style={{ fontFamily: SANS, fontSize: "clamp(14.5px,1.15vw,16px)", fontWeight: 300, color: C.textMuted, maxWidth: 580, margin: "18px auto 0", lineHeight: 1.8 }}>
                *Livraison-reprise incluse dès 400 € de location dans un rayon de 30 km. Packs dégressifs au-delà de 100 invités.
              </p>
            </div>
          </Reveal>
          <div style={{ marginTop: "clamp(34px,4.5vw,54px)", borderBottom: `1px solid ${C.border}` }}>
            {TARIFS.map((t: any, idx: number) => (
              <TarifRow key={t.a + String(idx)} item={t} i={idx} />
            ))}
          </div>
          <Reveal delay={0.1}>
            <div style={{ marginTop: "clamp(24px,3vw,36px)" }}>
              <Guirlande points={18} couleur={C.accent} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── AVIS — verre dépoli, colonnes décalées (l'écho du flou) ──────── */}
      <section className="i360-pad" style={{ background: C.bgDark, padding: "clamp(80px,11vw,150px) clamp(22px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(56% 56% at 50% 14%, rgba(63,168,201,0.12), transparent 70%)" }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(40% 40% at 84% 78%, rgba(217,200,169,0.08), transparent 70%)" }} />
        <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "clamp(34px,4.4vw,56px)" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                <Kicker color="rgba(255,255,255,0.44)" align="center">Après la fête</Kicker>
              </div>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(28px,3.8vw,48px)", color: C.ink, lineHeight: 1.04, letterSpacing: "-0.03em", margin: 0 }}>{/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>Des fêtes <em style={{ fontStyle: "italic", fontWeight: 500, color: C.lin }}>dont on se souvient</em>.</>)}</h2>
            </div>
          </Reveal>
          <div className="i360-avis" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "clamp(16px,2vw,26px)", alignItems: "start" }}>
            {AVIS.map((a: any, idx: number) => (
              <Reveal key={a.auteur + String(idx)} delay={idx * 0.08} style={{ marginTop: idx % 3 === 1 ? "clamp(0px,3.6vw,48px)" : idx % 3 === 2 ? "clamp(0px,7.2vw,96px)" : 0 }}>
                <figure
                  style={{
                    margin: 0,
                    position: "relative",
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(14px) saturate(120%)",
                    WebkitBackdropFilter: "blur(14px) saturate(120%)",
                    border: "1px solid rgba(255,255,255,0.11)",
                    borderRadius: 6,
                    padding: "clamp(26px,3vw,36px) clamp(22px,2.6vw,30px)",
                    overflow: "hidden",
                    boxShadow: "0 30px 60px -44px rgba(0,0,0,0.9)",
                  }}
                >
                  <span aria-hidden style={{ position: "absolute", top: -22, right: 14, fontFamily: DISPLAY, fontWeight: 800, fontSize: 128, lineHeight: 1, color: "rgba(255,255,255,0.045)", pointerEvents: "none", userSelect: "none" }}>
                    »
                  </span>
                  <blockquote style={{ margin: 0, fontFamily: SANS, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(15.5px,1.35vw,18px)", color: "rgba(238,242,245,0.9)", lineHeight: 1.68 }}>
                    « {a.texte} »
                  </blockquote>
                  <figcaption style={{ marginTop: 22, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                    <div style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 600, color: C.ink }}>{a.auteur}</div>
                    <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: C.lin, marginTop: 7 }}>{a.detail}</div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section id="contact" className="i360-pad" style={{ background: C.accentLight, padding: "clamp(80px,11vw,150px) clamp(22px,5vw,64px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <Nappe opacity={0.05} teinte="rgba(63,168,201,0.9)" />
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 60% at 50% 0%, rgba(63,168,201,0.14), transparent 70%)" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Kicker align="center">Parlons date</Kicker>
            </div>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(30px,4.6vw,58px)", color: C.ink, margin: "18px 0 18px", lineHeight: 1.02, letterSpacing: "-0.03em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
              Votre événement a une date ?<br /><em style={{ fontStyle: "italic", fontWeight: 500, color: C.accent }}>Bloquons le matériel.</em>
            </>)}</h2>
            <p style={{ fontFamily: SANS, fontSize: "clamp(15px,1.2vw,16.5px)", fontWeight: 300, color: C.textMuted, maxWidth: 480, margin: "0 auto clamp(28px,3.6vw,40px)", lineHeight: 1.8 }}>
              Les week-ends de juin partent en janvier : devis sous 48 h, option gratuite posée 15 jours.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href={telHref}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.accent, color: "#08161c", borderRadius: 99, padding: "16px 32px", fontFamily: SANS, fontSize: 15, fontWeight: 600, textDecoration: "none" }}
              >
                <Phone size={17} /> {phone}
              </a>
              <a
                href={`mailto:${mail}`}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "transparent", color: C.ink, border: `1px solid ${C.accent}`, borderRadius: 99, padding: "16px 30px", fontFamily: SANS, fontSize: 15, fontWeight: 600, textDecoration: "none" }}
              >
                <Mail size={17} /> Nous écrire
              </a>
            </div>
            <div style={{ marginTop: 30, fontFamily: SANS, fontSize: 12.5, color: C.textFaint, lineHeight: 1.8 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                <MapPin size={13} color={C.accent} />
                {adresse ?? lieu} · Nous livrons : {ZONES.join(", ")}
              </span>
            </div>
            <div style={{ marginTop: 26, display: "flex", justifyContent: "center", alignItems: "center", gap: 10, fontFamily: SANS, fontSize: 12, color: C.textFaint }}>
              <UtensilsCrossed size={13} color={C.lin} aria-hidden />
              <span>Vaisselle rendue sale : le lavage est compris, toujours.</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="i360-pad" style={{ background: C.bgDarkAlt, padding: "clamp(52px,7vw,84px) clamp(22px,5vw,64px) 26px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 38 }}>
            <div style={{ maxWidth: 370 }}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(20px,2.1vw,27px)", color: C.accent, marginBottom: 12, letterSpacing: "-0.025em" }}>{marque}</div>
              <p style={{ fontFamily: SANS, fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, margin: 0 }}>
                Location de matériel de réception · {ville}
                <br />
                Livraison, montage et reprise sur toute la Charente-Maritime
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <MapPin size={13} />, t: adresse ?? `${lieu}, Charente-Maritime` },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Mail size={13} />, t: mail },
                { icon: <Clock size={13} />, t: "Lun–Ven 8h30–18h · Sam 9h–12h (retraits)" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.44)", fontFamily: SANS, fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.accent, display: "flex" }}>{item.icon}</span>
                  {item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 18, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ color: "rgba(255,255,255,0.26)", fontFamily: SANS, fontSize: 11.5, letterSpacing: "0.04em" }}>
              © 2026 {marque} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
              {/* VILLE_PIED */}
              {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ color: "rgba(255,255,255,0.26)", fontFamily: SANS, fontSize: 11.5, letterSpacing: "0.04em" }}>
              Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
