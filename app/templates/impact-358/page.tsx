"use client";
// @ts-nocheck

/* ════════════════════════════════════════════════════════════════════════════
   BIOVALLÉE ANALYSES — Laboratoire de biologie médicale rural · Avignon
   ─────────────────────────────────────────────────────────────────────────────
   Laboratoire, 2e variante du catalogue (la 1re est impact-357, TrackingCollapse
   et rail de chiffres, ton urbain). Celle-ci est la biologie de la vallée :
   trois sites, une navette, des tournées dans les villages.

   Geste signature : LineMask — chaque ligne du titre sort horizontalement sous
   son propre masque. Il REMPLACE le MosaicPush de la version précédente : la
   mosaïque disait « des tuiles qui arrivent », la ligne masquée dit « le tube
   qui avance sur la paillasse ». C'est le geste du convoyeur, pas du damier.

   Archétype héros : H2 — média À GAUCHE (le panneau du circuit), parole à
   droite. Le laboratoire montre sa chaîne avant de la raconter.

   Fontes : P4 — Fraunces (titres, serif à optique variable) × Inter (texte).

   Signature visuelle : les SITES EN CARTE-LISTE — une rangée par lieu, avec sa
   fonction, ses horaires et son mot. Et la microplaque : 96 puits dessinés en
   CSS, jamais photographiés, comme texture de fond des sections claires.
   ════════════════════════════════════════════════════════════════════════════ */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, Clock, FlaskConical, Mail, MapPin, Microscope, Phone, Truck } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, LineMask, useSlides } from "@/lib/templates/hero-kit-2";
import { ActionMobile } from "@/lib/templates/ActionMobile";
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

/* ── Jetons ──────────────────────────────────────────────────────────────── */
let C: Record<string, string> = {
  bg: "#f6f9f3",
  bgAlt: "#e9f1e3",
  bgDark: "#12291d",
  bgDarkAlt: "#0c1e14",
  bgCard: "#ffffff",
  accent: "var(--brand, #458a43)",
  accentDark: "var(--brand-light, #2f6631)",
  accentLight: "#dcecd6",
  ink: "#15241a",
  textMuted: "#53644e",
  textFaint: "#8a9a85",
  border: "#d7e3d1",
  white: "#ffffff",
  /* clé métier : le réactif, le seul vert qui ne soit pas la marque */
  reactif: "#7fb26a",
};

const SERIF = "'Fraunces', Georgia, serif";
const SANS = "'Inter', system-ui, -apple-system, sans-serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_CSS = "cubic-bezier(.16,1,.3,1)";

const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=Inter:wght@300;400;500;600;700&display=swap');`;

const NAV = [
  { l: "Nos sites", h: "#sites" },
  { l: "Analyses", h: "#services" },
  { l: "Le circuit", h: "#methode" },
  { l: "Prise en charge", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* ── Données de démonstration ────────────────────────────────────────────── */

/*
  Le héros garde les trois temps du circuit écrits par le thème — comptoir,
  plateau, domicile — et leurs neuf tuiles. Le geste a changé, pas le récit.
  Les deux lignes de titre reprennent mot pour mot la légende de chaque temps :
  rien n'est inventé, la phrase change seulement de taille.
*/
function HERO_SOURCE_LIVE() {
  return [
    {
      k: "Au comptoir",
      sub: "Le prélèvement, sans rendez-vous, près de chez vous.",
      l1: "Trois sites, une navette,",
      l2: "zéro analyse qui attend.",
      tiles: [
        { icon: MapPin, t: "3 sites de la vallée", d: (clientCity(sessionData) ?? "Avignon") + ", Carpentras, Cavaillon — dès 7 h en semaine." },
        { icon: FlaskConical, t: "À jeun servi d'abord", d: "File dédiée le matin, moins d'un quart d'heure d'attente." },
        { icon: Truck, t: "Domicile en tournée", d: "Préleveurs du labo chaque matin dans les villages." },
      ],
    },
    {
      k: "Au plateau",
      sub: "La navette réfrigérée nourrit les automates toutes les 2 h.",
      l1: "La navette réfrigérée",
      l2: "nourrit les automates.",
      tiles: [
        { icon: Truck, t: "Navette 2 h", d: "Tubes tracés, température enregistrée de bout en bout." },
        { icon: Microscope, t: "Plateau technique central", d: "Automates dernière génération, contrôles quotidiens COFRAC." },
        { icon: FlaskConical, t: "Urgences priorisées", d: "CRP, troponine, INR urgents rendus dans l'heure au médecin." },
      ],
    },
    {
      k: "Chez vous",
      sub: "Le résultat, et quelqu'un pour le lire.",
      l1: "Le résultat, et quelqu'un",
      l2: "pour le lire avec vous.",
      tiles: [
        { icon: FlaskConical, t: "Serveur sécurisé", d: "Résultats du jour en ligne avant 17 h 30, envoi au médecin." },
        { icon: Microscope, t: "Un biologiste rappelle", d: "Valeur inhabituelle : on vous appelle, on explique." },
        { icon: MapPin, t: "Historique conservé", d: "Vos courbes sur cinq ans, utiles à chaque nouveau bilan." },
      ],
    },
  ];
}
let HERO_SOURCE = HERO_SOURCE_LIVE();
let HERO = HERO_SOURCE;

/*
  La signature du thème : les lieux en carte-liste. Chaque rangée ne dit que ce
  que le thème disait déjà ailleurs — les trois villes, les horaires du pied de
  page, les villages de la tournée, la navette. Aucun site nouveau.
*/
function SITES_SOURCE_LIVE() {
  return [
    {
      ville: clientCity(sessionData) ?? "Avignon",
      role: "Site principal & plateau technique",
      note: "Automates dernière génération, contrôles COFRAC quotidiens, biologistes présents physiquement.",
      h: "Lun–Ven 7h–18h · Sam 7h30–12h",
      tag: "Plateau",
    },
    {
      ville: "Carpentras",
      role: "Site de prélèvement",
      note: "File dédiée aux patients à jeun le matin : moins d'un quart d'heure d'attente, sans rendez-vous dès 7 h.",
      h: "Lun–Ven 7h–18h · Sam 7h30–12h",
      tag: "Prélèvement",
    },
    {
      ville: "Cavaillon",
      role: "Site de prélèvement",
      note: "Navette réfrigérée toutes les deux heures vers le plateau : les tubes ne dorment jamais sur une paillasse.",
      h: "Lun–Ven 7h–18h · Sam 7h30–12h",
      tag: "Prélèvement",
    },
    {
      ville: "Tournées des villages",
      role: "À domicile, sur prescription",
      note: "Pernes, L'Isle-sur-la-Sorgue, Monteux : nos préleveurs sillonnent la vallée chaque matin.",
      h: "Chaque matin en semaine",
      tag: "Domicile",
    },
  ];
}
let SITES_SOURCE = SITES_SOURCE_LIVE();
let SITES = SITES_SOURCE;

function SERVICES_SOURCE_LIVE() {
  return [
    { titre: "Bilans de routine", desc: "NFS, iono, lipides, hépatique : la biologie du quotidien, validée par un biologiste et en ligne le jour même.", tag: "Routine" },
    { titre: "Tournées des villages", desc: "Nos préleveurs sillonnent la vallée chaque matin : Pernes, L'Isle-sur-la-Sorgue, Monteux — à domicile sur prescription.", tag: "Rural" },
    { titre: "Suivi des chroniques", desc: "INR, diabète, thyroïde : rappels de prélèvement programmés, courbes historiques transmises au médecin traitant.", tag: "Chronique" },
    { titre: "Pédiatrie douce", desc: "Préleveuses formées aux enfants, crème anesthésiante conseillée en amont, diplôme du courage à la sortie — vraiment.", tag: "Enfants" },
    { titre: "Microbiologie & allergies", desc: "Cultures, antibiogrammes, panels d'allergènes : le plateau technique traite sur place, sans sous-traitance lointaine.", tag: "Spécialisé" },
    { titre: "Conventions locales", desc: "EHPAD, maisons de santé, infirmiers libéraux : circuits dédiés, coursiers et résultats intégrés à vos logiciels.", tag: "Partenaires" },
  ];
}
let SERVICES_SOURCE = SERVICES_SOURCE_LIVE();
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE = [
  { n: "01", t: "Prélever près de chez vous", d: "Trois sites et des tournées : personne ne fait 40 minutes de route pour une prise de sang." },
  { n: "02", t: "Transporter sous contrôle", d: "Navette réfrigérée toutes les deux heures, température loggée — la qualité commence dans le coffre." },
  { n: "03", t: "Analyser au plateau", d: "Automates mutualisés, contrôles COFRAC quotidiens, biologistes présents physiquement." },
  { n: "04", t: "Rendre, et expliquer", d: "En ligne avant 17 h 30, urgences téléphonées, rappel du biologiste quand il le faut." },
];

const ENGAGEMENT_DEMO = [
  "Accréditation COFRAC ISO 15189 — la même exigence que les grands centres urbains",
  "Cinq biologistes médicaux, présents sur les sites, joignables par les prescripteurs",
  "Chaîne du froid tracée du prélèvement à l'automate, enregistrements conservés",
  "Urgences biologiques téléphonées au médecin dans l'heure, 6j/7",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

const TARIFS_DEMO = [
  { a: "Bilan prescrit", p: "tiers payant", n: "Carte Vitale + mutuelle, zéro avance sur les trois sites." },
  { a: "Prélèvement à domicile", p: "pris en charge", n: "Sur prescription, dans les communes des tournées affichées." },
  { a: "Panel allergènes (prescrit)", p: "tiers payant", n: "Résultats commentés, transmis à l'allergologue." },
  { a: "Bilan sportif sans ordonnance", p: "dès 32 €", n: "Tarif nomenclature affiché au guichet et en ligne." },
];
let TARIFS = TARIFS_DEMO;

const AVIS_SOURCE = [
  { texte: "INR toutes les trois semaines depuis des années : la préleveuse de la tournée connaît mes veines et mon café. Le résultat est chez le médecin avant midi.", auteur: "Marcel D., Pernes", detail: "Tournée des villages" },
  { texte: "Ma fille de 4 ans est ressortie avec son diplôme du courage et sans larmes. La crème conseillée la veille au téléphone a tout changé.", auteur: "Maman de Lila", detail: "Prélèvement pédiatrique" },
  { texte: "Notre EHPAD travaille avec BioVallée : circuits fiables, urgences vraiment téléphonées, biologiste joignable. Un partenaire, pas un prestataire.", auteur: "Médecin coordonnateur", detail: "Convention EHPAD" },
];
let AVIS_DEMO = AVIS_SOURCE;

const STATS_DEMO = [
  { value: "3", label: "Sites + tournées à domicile" },
  { value: "2 h", label: "Entre chaque navette réfrigérée" },
  { value: "17h30", label: "Résultats du jour en ligne" },
  { value: "5", label: "Biologistes médicaux" },
];
let STATS = STATS_DEMO;

function ZONES_SOURCE_LIVE() {
  return [clientCity(sessionData) ?? "Avignon", "Carpentras", "Cavaillon", "Pernes", "L'Isle-sur-la-Sorgue", "Monteux"];
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
      transition={{ duration: 0.84, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Le kicker du thème : filet 40×1 px puis les capitales filées à 0.34em. */
function Kicker({ children, color = C.accentDark, align = "left" }: { children: React.ReactNode; color?: string; align?: "left" | "center" }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 14, justifyContent: align === "center" ? "center" : "flex-start" }}>
      <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${color})`, flexShrink: 0 }} />
      <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.34em", textTransform: "uppercase", color }}>{children}</span>
      {align === "center" && <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${color}, transparent)`, flexShrink: 0 }} />}
    </span>
  );
}

/** Le chiffre fantôme, en chiffres romains : la texture sans image du thème. */
function GhostNum({ children, size = "clamp(92px,12.5vw,182px)", right = false, color = "rgba(69,138,67,0.075)" }: { children: React.ReactNode; size?: string; right?: boolean; color?: string }) {
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        top: "-0.24em",
        left: right ? "auto" : "-0.02em",
        right: right ? "-0.02em" : "auto",
        fontFamily: SERIF,
        fontStyle: "italic",
        fontWeight: 300,
        fontSize: size,
        lineHeight: 1,
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

/**
 * La microplaque : 96 puits dessinés au dégradé radial. La seule texture de
 * fond du thème, et elle ne coûte pas une requête réseau.
 */
function Microplaque({ opacity = 0.5, teinte = "rgba(69,138,67,0.10)" }: { opacity?: number; teinte?: string }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity,
        backgroundImage: `radial-gradient(circle at center, ${teinte} 0 2.4px, transparent 2.6px)`,
        backgroundSize: "26px 26px",
        maskImage: "linear-gradient(to bottom, transparent, black 22%, black 74%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 22%, black 74%, transparent)",
      }}
    />
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
        letterSpacing: "0.11em",
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

function Btn({ children, href, filled = false, dark = false }: { children: React.ReactNode; href: string; filled?: boolean; dark?: boolean }) {
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
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        borderRadius: 3,
        textDecoration: "none",
        border: `1px solid ${filled ? "transparent" : dark ? "rgba(255,255,255,0.3)" : C.border}`,
        background: filled ? (h ? C.accentDark : C.accent) : h ? (dark ? "rgba(255,255,255,0.08)" : C.bgAlt) : dark ? "transparent" : C.white,
        color: filled ? C.white : dark ? "rgba(255,255,255,0.9)" : C.ink,
        boxShadow: h && filled ? "0 18px 36px -20px rgba(18,41,29,0.6), 0 3px 10px -6px rgba(18,41,29,0.4)" : "0 0 0 rgba(0,0,0,0)",
        transform: h ? "translateY(-2px)" : "none",
        transition: `background .5s ${EASE_CSS}, box-shadow .5s ${EASE_CSS}, transform .5s ${EASE_CSS}, border-color .5s ${EASE_CSS}`,
      }}
    >
      {children}
      <ArrowRight size={14} style={{ transform: h ? "translateX(4px)" : "none", transition: `transform .5s ${EASE_CSS}` }} />
    </a>
  );
}

/** Une rangée de la carte-liste des sites : la signature visuelle du thème. */
function SiteRow({ item, i }: { item: any; i: number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={i * 0.055}>
      <article
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        className="i358-siterow"
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "clamp(44px,5vw,66px) minmax(0,0.9fr) minmax(0,1.35fr) auto",
          gap: "clamp(14px,2.4vw,34px)",
          alignItems: "center",
          padding: "clamp(22px,2.8vw,34px) clamp(12px,1.8vw,24px)",
          borderTop: `1px solid ${C.border}`,
          background: h ? C.bgCard : "transparent",
          transform: h ? "translateX(6px)" : "none",
          boxShadow: h
            ? "0 26px 50px -36px rgba(18,41,29,0.42), 0 4px 14px -10px rgba(18,41,29,0.20)"
            : "0 0 0 rgba(0,0,0,0)",
          transition: `background .5s ${EASE_CSS}, transform .5s ${EASE_CSS}, box-shadow .5s ${EASE_CSS}`,
        }}
      >
        <span
          aria-hidden
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(22px,2.4vw,32px)",
            color: h ? C.accent : C.textFaint,
            lineHeight: 1,
            transition: `color .5s ${EASE_CSS}`,
          }}
        >
          {String(i + 1).padStart(2, "0")}
        </span>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(19px,2vw,26px)", color: C.ink, margin: 0, lineHeight: 1.16, letterSpacing: "-0.012em" }}>{item.ville}</h3>
          <div style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accentDark, marginTop: 9 }}>{item.role}</div>
        </div>
        <p style={{ fontFamily: SANS, fontSize: "clamp(13.5px,1.1vw,15px)", fontWeight: 300, color: C.textMuted, lineHeight: 1.76, margin: 0, maxWidth: 460 }}>{item.note}</p>
        <div style={{ textAlign: "right", minWidth: 0 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontFamily: SANS,
              fontSize: 12,
              color: h ? C.ink : C.textFaint,
              whiteSpace: "nowrap",
              transition: `color .5s ${EASE_CSS}`,
            }}
          >
            <Clock size={13} color={C.accent} aria-hidden />
            {item.h}
          </span>
          <div style={{ marginTop: 8 }}>
            <span
              style={{
                display: "inline-block",
                fontFamily: SANS,
                fontSize: 9.5,
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: C.accentDark,
                background: C.accentLight,
                borderRadius: 99,
                padding: "5px 11px",
              }}
            >
              {item.tag}
            </span>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/** Une analyse : colonne filetée numérotée, jamais une carte à ombre. */
function ServiceCol({ item, i }: { item: any; i: number }) {
  const [h, setH] = useState(false);
  const romains = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  return (
    <Reveal delay={(i % 3) * 0.06}>
      <div
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          position: "relative",
          height: "100%",
          padding: "clamp(26px,3vw,38px) clamp(18px,2vw,28px)",
          background: h ? C.bgCard : "transparent",
          borderLeft: `1px solid ${h ? C.accent : C.border}`,
          transform: h ? "translateY(-5px)" : "none",
          boxShadow: h
            ? "0 30px 56px -38px rgba(18,41,29,0.42), 0 5px 15px -10px rgba(18,41,29,0.2)"
            : "0 0 0 rgba(0,0,0,0)",
          transition: `background .5s ${EASE_CSS}, transform .5s ${EASE_CSS}, box-shadow .5s ${EASE_CSS}, border-color .5s ${EASE_CSS}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
          <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(24px,2.6vw,34px)", color: h ? C.accent : C.reactif, lineHeight: 1, transition: `color .5s ${EASE_CSS}` }}>
            {romains[i % romains.length]}
          </span>
          <span
            style={{
              fontFamily: SANS,
              fontSize: 9.5,
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: C.accentDark,
              borderBottom: `1px solid ${h ? C.accent : C.border}`,
              paddingBottom: 3,
              transition: `border-color .5s ${EASE_CSS}`,
            }}
          >
            {item.tag}
          </span>
        </div>
        <h3 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(19px,1.9vw,24px)", color: C.ink, margin: "clamp(16px,2vw,22px) 0 12px", lineHeight: 1.18, letterSpacing: "-0.012em" }}>{item.titre}</h3>
        <p style={{ fontFamily: SANS, fontSize: "clamp(13.5px,1.1vw,15px)", fontWeight: 300, color: C.textMuted, lineHeight: 1.78, margin: 0, maxWidth: 460 }}>{item.desc}</p>
      </div>
    </Reveal>
  );
}

/** Une ligne de prise en charge : bande pleine, prix en serif à droite. */
function TarifBande({ item, i }: { item: any; i: number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={i * 0.055}>
      <div
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px clamp(16px,2.4vw,32px)",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "clamp(20px,2.5vw,30px) clamp(18px,2.6vw,34px)",
          marginBottom: 10,
          borderRadius: 4,
          background: h ? C.white : i % 2 === 0 ? C.bgAlt : "rgba(255,255,255,0.55)",
          borderLeft: `3px solid ${h ? C.accent : "transparent"}`,
          transform: h ? "translateX(5px)" : "none",
          boxShadow: h ? "0 22px 44px -34px rgba(18,41,29,0.5), 0 3px 10px -7px rgba(18,41,29,0.22)" : "0 0 0 rgba(0,0,0,0)",
          transition: `background .5s ${EASE_CSS}, transform .5s ${EASE_CSS}, box-shadow .5s ${EASE_CSS}, border-color .5s ${EASE_CSS}`,
        }}
      >
        <div style={{ minWidth: 0, flex: "1 1 280px" }}>
          <div style={{ fontFamily: SERIF, fontSize: "clamp(17px,1.7vw,22px)", color: C.ink, lineHeight: 1.24 }}>{item.a}</div>
          <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 300, color: C.textFaint, marginTop: 7, lineHeight: 1.7, maxWidth: 520 }}>{item.n}</div>
        </div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(18px,1.9vw,24px)", color: h ? C.accent : C.accentDark, whiteSpace: "nowrap", transition: `color .5s ${EASE_CSS}` }}>{item.p}</div>
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
export default function BioValleePage() {
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

  HERO_SOURCE = HERO_SOURCE_LIVE();
  SITES_SOURCE = SITES_SOURCE_LIVE();
  SERVICES_SOURCE = SERVICES_SOURCE_LIVE();
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
    La carte-liste suit les zones du client quand il en a saisi : une commune
    par rangée, avec la fonction et les horaires du thème en présentation.
    Sinon, on garde les lieux du thème mot pour mot.
  */
  SITES = resolveList(
    (clientList(sessionData, "sites.liste") ?? clientAreas(sessionData))?.map((z: string, i: number) => ({
      ...SITES_SOURCE[i % SITES_SOURCE.length],
      ville: z,
    })),
    SITES_SOURCE,
  );
  HERO = HERO_SOURCE;

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

  /* Un seul index pilote tout le héros : lignes masquées, panneau, compteur. */
  const { i, go } = useSlides(HERO.length, DWELL.normal);
  const S = HERO[i];

  /*
    Les deux lignes du titre. La première diapositive porte celui du client
    quand la génération en a produit un ; les suivantes montrent les autres
    temps du circuit, écrits par le thème. Le gabarit tient 18 signes par ligne
    en Fraunces à clamp(38px,5.2vw,68px) : c'est le maxLigne passé au contrat.
  */
  const heroLignes: string[] =
    i === 0
      ? [clientHeroLine(sessionData, 0, 2, 18) ?? S.l1, clientHeroLine(sessionData, 1, 2, 18) ?? S.l2]
      : [S.l1, S.l2];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const marque = fd?.businessName ?? clientName(sessionData) ?? "BioVallée Analyses";
  const ville = clientCity(sessionData) ?? "Avignon";
  const phone = clientPhone(sessionData) ?? fd?.phone ?? "04 90 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33490000000").replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "contact@biovallee-analyses.fr";
  const adresse = clientAddress(sessionData);
  const lieu = clientCodePostalVille(sessionData, "", ville).trim();

  /*
    Le panneau du héros porte une photo quand le client en a fourni une, et
    seulement alors : à défaut il reste un aplat de paillasse dessiné en CSS,
    plus honnête qu'une image de banque d'images.
  */
  const heroImg = photo(0, "");

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip", WebkitFontSmoothing: "antialiased" }}>
      <style>{FONTS_CSS}</style>
      <style>{`
        @media (max-width: 1000px) { #i358-nav { display: none !important; } .i358-burger { display: flex !important; } }
          .aevia-action-mobile { display: inline-flex !important; }
        @media (max-width: 900px) {
          .i358-hero { padding: 116px 22px 56px !important; gap: 26px !important; }
          .i358-points { grid-template-columns: minmax(0,1fr) !important; }
          .i358-points > li + li { border-left: none !important; border-top: 1px solid ${C.border}; }
          .i358-hero > * { order: initial !important; }
          .i358-heromedia { max-width: 480px; margin: 0 auto; width: 100%; }
          .i358-split { grid-template-columns: minmax(0,1fr) !important; gap: 34px !important; }
          .i358-split > * { order: initial !important; }
          .i358-siterow { grid-template-columns: minmax(0,1fr) !important; gap: 12px !important; }
          .i358-siterow > *:last-child { text-align: left !important; }
          .i358-statband { grid-template-columns: repeat(auto-fit, minmax(min(150px,100%),1fr)) !important; }
          .i358-statcell { border-right: none !important; border-top: 1px solid ${C.border} !important; }
          .i358-methode { grid-template-columns: minmax(0,1fr) !important; }
          .i358-sticky { position: static !important; }
          .i358-avis { grid-template-columns: minmax(0,1fr) !important; }
          .i358-avis > * { margin-top: 0 !important; }
          .i358-pad { padding-left: 22px !important; padding-right: 22px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .i358-anim { transition: none !important; animation: none !important; }
        }
        /* Le geste : la 2e ligne du titre prend l'accent et l'italique. */
        /*
          Le masque de ligne reste ; l'italique de seconde ligne part — la
          signature de gabarit de toute la série, cinquante pour cent des
          thèmes récents la portaient.
        */
        .i358-hl > span:nth-child(2) > span { color: ${C.accent}; }

        /*
          ── Héros « devanture centrée » ────────────────────────────────────
          La vitrine : la façade photographique en bandeau, puis les trois
          points du temps courant, côte à côte comme trois étagères.
        */
        .i358-vitrine {
          position: relative;
          z-index: 1;
          width: 100%;
          background: ${C.bgCard};
          border: 1px solid ${C.border};
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 40px 78px -52px rgba(18,41,29,0.55), 0 8px 22px -16px rgba(18,41,29,0.28);
        }
        .i358-vitrine > div:first-child { height: clamp(120px, 17vh, 190px); }
        .i358-points {
          display: grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
        }
        .i358-points > li + li { border-left: 1px solid ${C.border}; }
        @media (max-width: 860px) {
          .i358-points { grid-template-columns: minmax(0,1fr); }
          .i358-points > li + li { border-left: none; border-top: 1px solid ${C.border}; }
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
          background: scrolled ? "rgba(246,249,243,0.93)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          transition: `padding .55s ${EASE_CSS}, background .55s ${EASE_CSS}, backdrop-filter .55s ${EASE_CSS}, border-color .55s ${EASE_CSS}`,
        }}
      >
        <a href="#top" style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, textDecoration: "none" }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={marque} style={{ height: 30, maxWidth: 170, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Microscope size={17} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: SERIF, fontSize: 19, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", letterSpacing: "-0.012em" }}>{marque}</span>
              <span style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.26em", textTransform: "uppercase", color: C.textFaint, marginLeft: 6 }}>{clientTrade(sessionData) ?? "Biologie médicale"}</span>
            </>
          )}
        </a>
        <div id="i358-nav" style={{ display: "flex", gap: "clamp(12px,1.6vw,26px)", alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <NavLink key={l} label={l} href={h} />
          ))}
          <Btn href="#contact" filled>
            Mes résultats
          </Btn>
        </div>
        {/* L'appel à l'action sous le pouce : la barre est fixe, mais son
            bouton vit dans le menu déroulant, en display:none sous le point
            de rupture. Celui-ci paraît exactement avec le bouton de menu. */}
        <ActionMobile href={telHref} fond={C.accent} encre={"#101010"}>
          Appeler
        </ActionMobile>
        <button
          className="i358-burger"
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
        <div style={{ position: "fixed", top: 62, left: 0, right: 0, zIndex: 99, background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "18px 26px 24px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map(({ l, h }) => (
            <NavLink key={l} label={l} href={h} onClick={() => setMobileOpen(false)} />
          ))}
          <a href="#contact" onClick={() => setMobileOpen(false)} style={{ background: C.accent, color: C.white, borderRadius: 3, padding: "14px 22px", fontFamily: SANS, fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none", textAlign: "center", marginTop: 12 }}>
            Mes résultats
          </a>
        </div>
      )}

      {/* ── HERO — devanture centrée ──────────────────────────────────────
             Une colonne unique au milieu, et le circuit du prélèvement posé
             dessous en vitrine : les trois points du temps courant, alignés.
             Le panneau tenait une colonne à gauche de la parole — la
             charpente de la série — et impact-357, son voisin de métier,
             vient de passer à la liste : ici c'est la façade du laboratoire
             qui accueille. */}
      <section
        id="top"
        className="i358-hero i358-pad"
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          gap: "clamp(24px,3.2vh,42px)",
          padding: "clamp(120px,13vw,158px) clamp(22px,5vw,64px) clamp(48px,6vh,76px)",
          maxWidth: 1280,
          margin: "0 auto",
          position: "relative",
        }}
      >
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(56% 44% at 50% 18%, rgba(127,178,106,0.12), transparent 68%)" }} />

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.14, ease: EASE }}>
            <Kicker align="center">{clientEyebrow(sessionData) ?? <>Biologie médicale · {ville}</>}</Kicker>
          </motion.div>

          {/* Le geste : chaque ligne sort sous son masque, une seule fois par index */}
          <h1
            style={{
              fontFamily: SERIF,
              fontWeight: 300,
              fontSize: "clamp(36px,5.6vw,76px)",
              color: C.ink,
              lineHeight: 0.99,
              letterSpacing: "-0.024em",
              margin: "clamp(18px,2.2vw,28px) 0 0",
              maxWidth: 920,
            }}
          >
            <LineMask lines={heroLignes} index={i} className="i358-hl" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.4, ease: EASE }}
            style={{ fontFamily: SANS, fontSize: "clamp(14.5px,1.3vw,16.5px)", fontWeight: 300, color: C.textMuted, lineHeight: 1.78, maxWidth: 620, margin: "clamp(16px,2vw,24px) auto clamp(22px,2.6vw,30px)" }}
          >
            {clientHeroSubtitle(sessionData) ??
              clientTagline(sessionData) ??
              "Le laboratoire de la vallée : trois sites de prélèvement, une navette réfrigérée toutes les deux heures vers le plateau technique, et des biologistes qui rappellent quand un résultat mérite un mot."}
          </motion.p>

          {/* Une seule action pleine ; les analyses restent un lien. */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.54, ease: EASE }} style={{ display: "flex", gap: "clamp(16px,2vw,26px)", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
            <Btn href="#sites" filled>
              Trouver mon site
            </Btn>
            <a href="#services" style={{ fontFamily: SANS, fontSize: 13, color: C.ink, textDecoration: "none", borderBottom: `1px solid ${C.accent}`, paddingBottom: 3 }}>
              Nos analyses
            </a>
          </motion.div>
        </div>

        {/* ── LA VITRINE — le circuit du temps courant, d'un bord à l'autre ── */}
        <div className="i358-vitrine">
          {/* la façade : la photo du client, ou la paillasse dessinée */}
          <div style={{ position: "relative", background: C.bgDark, overflow: "hidden" }}>
            {heroImg ? (
              <img src={heroImg} alt={`${marque} — ${S.k}`} loading="eager" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(148deg, ${C.bgDark} 0%, #1a3b28 52%, ${C.bgDarkAlt} 100%)` }}>
                <Microplaque opacity={0.9} teinte="rgba(127,178,106,0.22)" />
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(70% 90% at 24% 18%, rgba(127,178,106,0.16), transparent 66%)" }} />
              </div>
            )}
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,30,20,0.62) 0%, rgba(12,30,20,0.12) 42%, rgba(12,30,20,0) 72%, rgba(12,30,20,0.18) 100%)" }} />
            <div style={{ position: "absolute", left: "clamp(16px,2vw,22px)", bottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
              <span aria-hidden style={{ width: 26, height: 1, background: C.reactif }} />
              <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.88)" }}>{S.k}</span>
            </div>
            {/*
              La fraction « 01 / 03 » ne disait pas ce qu'on regardait ; ces
              traits nomment les temps du circuit et y mènent directement.
            */}
            <div style={{ position: "absolute", right: "clamp(16px,2vw,22px)", bottom: 18, display: "flex", gap: 8 }}>
              {HERO.map((h: any, n: number) => (
                <button
                  key={h.k ?? n}
                  type="button"
                  onClick={() => go(n)}
                  aria-label={h.k ?? `Temps ${n + 1}`}
                  aria-current={n === i}
                  style={{ width: 32, height: 3, padding: 0, border: "none", cursor: "pointer", background: n === i ? C.reactif : "rgba(255,255,255,0.32)", transition: "background .3s" }}
                />
              ))}
            </div>
          </div>

          {/* les trois points du temps courant, côte à côte */}
          <ul className="i358-points" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {S.tiles.map(({ icon: Icon, t, d }: any, n: number) => (
              <motion.li
                key={`${i}-${n}`}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0.2 : 0.62, ease: EASE, delay: reduce ? 0 : n * 0.055 }}
                style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "clamp(15px,1.8vw,20px) clamp(16px,2vw,22px)", textAlign: "left" }}
              >
                <Icon size={17} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} aria-hidden />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 600, color: C.ink, marginBottom: 5 }}>{t}</div>
                  <div style={{ fontFamily: SANS, fontSize: 12.5, fontWeight: 300, color: C.textMuted, lineHeight: 1.66 }}>{d}</div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── RESPIRATION ─────────────────────────────────────────────────── */}
      <section className="i358-pad" style={{ background: C.bgAlt, padding: "clamp(72px,10vw,136px) clamp(22px,8vw,150px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <Microplaque opacity={0.32} />
        <div style={{ position: "relative" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
              <Kicker color={C.textMuted} align="center">La vallée</Kicker>
            </div>
          </Reveal>
          <Reveal delay={0.09}>
            <p style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(23px,3.2vw,43px)", lineHeight: 1.36, color: C.ink, maxWidth: 930, margin: "0 auto", letterSpacing: "-0.008em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "respiration.texte") ?? (<>
              Habiter à quarante minutes d'une ville ne devrait jamais vouloir dire attendre quarante minutes de plus son résultat.
            </>)}</p>
          </Reveal>
          <Reveal delay={0.18}>
            <div style={{ width: 1, height: 80, background: `linear-gradient(${C.accent}, transparent)`, margin: "clamp(34px,4vw,52px) auto 0" }} />
          </Reveal>
        </div>
      </section>

      {/* ── SITES — la carte-liste, signature du thème ───────────────────── */}
      <section id="sites" className="i358-pad" style={{ background: C.bg, padding: "clamp(78px,10vw,142px) clamp(22px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1220, margin: "0 auto", position: "relative" }}>
          <GhostNum right>{String(SITES.length).padStart(2, "0")}</GhostNum>
          <Reveal>
            <div style={{ marginBottom: "clamp(26px,3.4vw,44px)", position: "relative" }}>
              <Kicker>Où se faire prélever</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(30px,4.2vw,54px)", color: C.ink, margin: "18px 0 0", lineHeight: 1.06, letterSpacing: "-0.02em", maxWidth: 840 }}>{/* TEXTE_SECTION */ clientText(sessionData, "sites.titre") ?? (<>
                Le laboratoire n'est pas un lieu :<br /><em style={{ fontStyle: "italic", color: C.accent }}>c'est un circuit.</em>
              </>)}</h2>
              <p style={{ fontFamily: SANS, fontSize: "clamp(14.5px,1.15vw,16px)", fontWeight: 300, color: C.textMuted, lineHeight: 1.78, maxWidth: 520, marginTop: 20 }}>
                Trois adresses ouvertes dès 7 h, et des préleveurs qui montent dans les villages chaque matin. Le plateau technique, lui, ne bouge pas — c'est la navette qui vient à lui.
              </p>
            </div>
          </Reveal>
          <div style={{ borderBottom: `1px solid ${C.border}` }}>
            {SITES.map((s: any, idx: number) => (
              <SiteRow key={s.ville + String(idx)} item={s} i={idx} />
            ))}
          </div>
          <Reveal delay={0.1}>
            <div style={{ marginTop: "clamp(26px,3vw,38px)", display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", fontFamily: SANS, fontSize: 13, color: C.textFaint }}>
              <MapPin size={14} color={C.accentDark} aria-hidden />
              <span>Tournées et prélèvements à domicile : {ZONES.join(" · ")}</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CHIFFRES — bande claire filetée, chiffres fantômes derrière ──── */}
      <section style={{ background: C.bgAlt, position: "relative", overflow: "hidden", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(66% 100% at 50% 0%, rgba(127,178,106,0.12), transparent 70%)" }} />
        <div
          className="i358-statband i358-pad"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1160, margin: "0 auto", padding: "0 clamp(22px,4vw,44px)", position: "relative" }}
        >
          {STATS.map((s: any, idx: number) => (
            <Reveal key={s.label} delay={idx * 0.07}>
              <div className="i358-statcell" style={{ position: "relative", padding: "clamp(34px,4vw,52px) 10px", textAlign: "center", borderRight: idx < STATS.length - 1 ? `1px solid ${C.border}` : "none", overflow: "hidden" }}>
                <span aria-hidden style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(70px,8vw,118px)", color: "rgba(69,138,67,0.07)", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div style={{ position: "relative", fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(28px,3.2vw,40px)", color: C.accentDark, lineHeight: 1, letterSpacing: "-0.02em" }}>{s.value}</div>
                <div style={{ position: "relative", fontFamily: SANS, fontSize: 11.5, letterSpacing: "0.11em", textTransform: "uppercase", color: C.textFaint, marginTop: 12, lineHeight: 1.5 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── ANALYSES — colonnes filetées, numérotées en chiffres romains ─── */}
      <section id="services" className="i358-pad" style={{ background: C.bg, padding: "clamp(80px,11vw,150px) clamp(22px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <Microplaque opacity={0.28} />
        <div style={{ maxWidth: 1220, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(30px,3.6vw,48px)" }}>
              <Kicker>Analyses</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(30px,4.3vw,56px)", color: C.ink, margin: "18px 0 0", lineHeight: 1.06, letterSpacing: "-0.02em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>
                La biologie de tout le monde,<br /><em style={{ fontStyle: "italic", color: C.accent }}>et celle des cas particuliers.</em>
              </>)}</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 0, borderRight: `1px solid ${C.border}` }}>
            {SERVICES.map((s: any, idx: number) => (
              <ServiceCol key={s.titre + String(idx)} item={s} i={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── LE CIRCUIT — titre collant, étapes filetées ──────────────────── */}
      <section id="methode" className="i358-pad" style={{ background: C.bgAlt, padding: "clamp(80px,11vw,152px) clamp(22px,5vw,64px)" }}>
        <div
          className="i358-methode"
          style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,0.86fr) minmax(0,1.14fr)", gap: "clamp(32px,5vw,84px)", alignItems: "start" }}
        >
          <div className="i358-sticky" style={{ position: "sticky", top: 116, alignSelf: "start" }}>
            <Reveal>
              <Kicker>Le circuit</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(29px,3.9vw,50px)", color: C.ink, margin: "18px 0 20px", lineHeight: 1.06, letterSpacing: "-0.02em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (<>
                Du bras au résultat,<br /><em style={{ fontStyle: "italic", color: C.accent }}>la chaîne est tracée.</em>
              </>)}</h2>
              <p style={{ fontFamily: SANS, fontSize: "clamp(14.5px,1.15vw,16px)", fontWeight: 300, color: C.textMuted, lineHeight: 1.8, maxWidth: 420 }}>
                Quatre temps, dans cet ordre, et jamais un tube qui attend entre deux. La traçabilité n'est pas un tampon : c'est un enregistrement, du coffre réfrigéré à l'automate.
              </p>
              <div style={{ width: 60, height: 1, background: `linear-gradient(90deg, ${C.accent}, transparent)`, marginTop: 26 }} />
            </Reveal>
          </div>
          <div>
            {METHODE.map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.06}>
                <div style={{ position: "relative", display: "flex", gap: "clamp(18px,2.6vw,36px)", alignItems: "flex-start", padding: "clamp(24px,3.2vw,40px) 0", borderTop: `1px solid ${C.border}` }}>
                  <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(26px,3vw,38px)", color: C.reactif, lineHeight: 1, minWidth: 54, flexShrink: 0 }}>{m.n}</span>
                  <div>
                    <h3 style={{ fontFamily: SANS, fontSize: "clamp(15.5px,1.3vw,17.5px)", fontWeight: 600, letterSpacing: "0.01em", color: C.ink, margin: "0 0 10px" }}>{m.t}</h3>
                    <p style={{ fontFamily: SANS, fontSize: "clamp(14px,1.1vw,15.5px)", fontWeight: 300, color: C.textMuted, lineHeight: 1.8, margin: 0, maxWidth: 480 }}>{m.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            <div style={{ borderTop: `1px solid ${C.border}` }} />
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENTS — split, photo à DROITE (le miroir du héros) ─────── */}
      <section id="engagements" className="i358-pad" style={{ background: C.bg, padding: "clamp(80px,11vw,150px) clamp(22px,5vw,64px)" }}>
        <div className="i358-split" style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(34px,5vw,76px)", alignItems: "center" }}>
          <Reveal style={{ order: 2 }}>
            <div style={{ position: "relative", borderRadius: 4, overflow: "hidden", background: C.bgDark, border: `1px solid ${C.border}` }}>
              <img
                src={photo(1, "https://images.pexels.com/photos/37548861/pexels-photo-37548861.jpeg?auto=compress&cs=tinysrgb&w=1400")}
                alt="Tubes de prélèvement au laboratoire"
                loading="lazy"
                style={{ width: "100%", aspectRatio: "4/3.3", objectFit: "cover", display: "block" }}
              />
              <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,30,20,0.42) 0%, rgba(12,30,20,0.05) 44%, transparent 100%)" }} />
              <div style={{ position: "absolute", left: 20, bottom: 18, fontFamily: SANS, fontSize: 10, fontWeight: 600, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(255,255,255,0.88)" }}>
                Plateau technique
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12} style={{ order: 1 }}>
            <div>
              <Kicker>Nos garanties</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(28px,3.7vw,46px)", color: C.ink, margin: "18px 0 26px", lineHeight: 1.08, letterSpacing: "-0.02em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (<>
                Rural<br /><em style={{ fontStyle: "italic", color: C.accent }}>ne veut pas dire moins bien.</em>
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

      {/* ── PRISE EN CHARGE — bandes, pas de tableau ─────────────────────── */}
      <section id="tarifs" className="i358-pad" style={{ background: C.bgAlt, padding: "clamp(80px,11vw,150px) clamp(22px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Kicker align="center">Prise en charge</Kicker>
              </div>
              <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(30px,4vw,52px)", color: C.ink, margin: "18px 0 0", lineHeight: 1.06, letterSpacing: "-0.02em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Tiers payant <em style={{ fontStyle: "italic", color: C.accent }}>partout, pour tous.</em></>)}</h2>
              <p style={{ fontFamily: SANS, fontSize: "clamp(14.5px,1.15vw,16px)", fontWeight: 300, color: C.textMuted, maxWidth: 560, margin: "18px auto 0", lineHeight: 1.78 }}>
                Analyses prescrites : tiers payant Sécurité sociale + mutuelle sur les trois sites et à domicile. Hors nomenclature : tarif affiché avant.
              </p>
            </div>
          </Reveal>
          <div style={{ marginTop: "clamp(34px,4.5vw,54px)" }}>
            {TARIFS.map((t: any, idx: number) => (
              <TarifBande key={t.a + String(idx)} item={t} i={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── AVIS — colonnes décalées sur fond sombre ─────────────────────── */}
      <section className="i358-pad" style={{ background: C.bgDark, padding: "clamp(80px,11vw,150px) clamp(22px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(58% 58% at 50% 12%, rgba(127,178,106,0.12), transparent 70%)" }} />
        <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "clamp(34px,4.4vw,56px)" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                <Kicker color="rgba(255,255,255,0.45)" align="center">Patients & prescripteurs</Kicker>
              </div>
              <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(27px,3.5vw,44px)", color: C.bg, lineHeight: 1.08, letterSpacing: "-0.02em", margin: 0 }}>{/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>La vallée <em style={{ fontStyle: "italic", color: C.reactif }}>se fait prélever ici</em>.</>)}</h2>
            </div>
          </Reveal>
          <div className="i358-avis" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "clamp(16px,2vw,26px)", alignItems: "start" }}>
            {AVIS.map((a: any, idx: number) => (
              <Reveal key={a.auteur + String(idx)} delay={idx * 0.08} style={{ marginTop: idx % 3 === 1 ? "clamp(0px,3.4vw,46px)" : idx % 3 === 2 ? "clamp(0px,6.8vw,92px)" : 0 }}>
                <figure
                  style={{
                    margin: 0,
                    position: "relative",
                    background: "rgba(255,255,255,0.045)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 4,
                    padding: "clamp(26px,3vw,36px) clamp(22px,2.6vw,30px)",
                    overflow: "hidden",
                  }}
                >
                  <span aria-hidden style={{ position: "absolute", top: -18, right: 12, fontFamily: SERIF, fontStyle: "italic", fontSize: 120, lineHeight: 1, color: "rgba(255,255,255,0.05)", pointerEvents: "none", userSelect: "none" }}>
                    »
                  </span>
                  <blockquote style={{ margin: 0, fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(16px,1.4vw,19px)", color: "rgba(246,249,243,0.9)", lineHeight: 1.6 }}>
                    « {a.texte} »
                  </blockquote>
                  <figcaption style={{ marginTop: 22, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.09)" }}>
                    <div style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 600, color: C.bg }}>{a.auteur}</div>
                    <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: C.reactif, marginTop: 7 }}>{a.detail}</div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section id="contact" className="i358-pad" style={{ background: C.accentLight, padding: "clamp(80px,11vw,150px) clamp(22px,5vw,64px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <Microplaque opacity={0.4} teinte="rgba(47,102,49,0.12)" />
        <div style={{ maxWidth: 780, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Kicker align="center">Trois sites</Kicker>
            </div>
            <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(30px,4.3vw,56px)", color: C.ink, margin: "18px 0 18px", lineHeight: 1.06, letterSpacing: "-0.02em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
              Le laboratoire est<br /><em style={{ fontStyle: "italic", color: C.accent }}>déjà près de chez vous.</em>
            </>)}</h2>
            <p style={{ fontFamily: SANS, fontSize: "clamp(15px,1.2vw,16.5px)", fontWeight: 300, color: C.textMuted, maxWidth: 480, margin: "0 auto clamp(28px,3.6vw,40px)", lineHeight: 1.78 }}>
              Sans rendez-vous dès 7 h. Résultats sur le serveur sécurisé, identifiants remis au guichet. Tournées à domicile sur prescription.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href={telHref}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.accent, color: C.white, borderRadius: 3, padding: "16px 32px", fontFamily: SANS, fontSize: 15, fontWeight: 600, textDecoration: "none" }}
              >
                <Phone size={17} /> {phone}
              </a>
              <a
                href={`mailto:${mail}`}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "transparent", color: C.ink, border: `1px solid ${C.accent}`, borderRadius: 3, padding: "16px 30px", fontFamily: SANS, fontSize: 15, fontWeight: 600, textDecoration: "none" }}
              >
                <Mail size={17} /> Nous écrire
              </a>
            </div>
            <div style={{ marginTop: 30, fontFamily: SANS, fontSize: 12.5, color: C.textFaint, lineHeight: 1.8 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                <MapPin size={13} color={C.accentDark} />
                {adresse ?? lieu} · Prélèvements à {ZONES.join(", ")}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="i358-pad" style={{ background: C.bgDarkAlt, padding: "clamp(52px,7vw,84px) clamp(22px,5vw,64px) 26px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 38 }}>
            <div style={{ maxWidth: 360 }}>
              <div style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(20px,2vw,26px)", color: C.reactif, marginBottom: 12, letterSpacing: "-0.012em" }}>{marque}</div>
              <p style={{ fontFamily: SANS, fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, margin: 0 }}>
                Laboratoire de biologie médicale · {ville}, Carpentras, Cavaillon
                <br />
                Accréditation COFRAC ISO 15189
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <MapPin size={13} />, t: adresse ?? `${lieu}, Vaucluse` },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Mail size={13} />, t: mail },
                { icon: <Clock size={13} />, t: "Lun–Ven 7h–18h · Sam 7h30–12h" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.44)", fontFamily: SANS, fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.reactif, display: "flex" }}>{item.icon}</span>
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
