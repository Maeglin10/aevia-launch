"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  ChefHat,
  Clock,
  Compass,
  Hammer,
  Laptop,
  Mail,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { BentoCascade, DWELL, HairlineArrows, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
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
  clientMethode,
  clientName,
  clientPhone,
  clientPhotos,
  clientReviews,
  clientServices,
  clientStats,
  clientText,
  clientTrade,
  fusionnerEtapes,
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
   ALMA COMPÉTENCES — Reconversions professionnelles · Bordeaux.
   Réécriture premium (reprise 316–383, famille II).

   Geste signature : BentoCascade — chaque tuile se dévoile par le haut
   (clip-path) avec 55 ms d'écart, puis s'efface par le bas : la cascade EST la
   métaphore du parcours, une marche après l'autre. Transition 0,62 s,
   DWELL.normal (4,2 s) ≈ 7× la transition.

   Héros H8 (bento) monté en ESCALIER : la tuile de marche à gauche, la grande
   à droite, la suivante décalée d'une colonne, la base pleine largeur — le
   dessin descend en diagonale, là où le bento du 346 dessine un plateau.
   Fontes P12 : Bricolage Grotesque (display) + Figtree. La figure de titre
   n'est pas un serif italique mais un mot en italique de Figtree posé dans le
   grotesque — l'inverse du 346, volontairement.
   Palette claire #fbf7f1 / accent #d97706.

   Écarts assumés au squelette standard :
   - le cursus (méthode) passe AVANT le catalogue : on vend le parcours, pas
     le catalogue ;
   - les parcours sont des cartes à barre de progression, largeur croissante ;
   - les chiffres forment une bande en escalier, pas une rangée plate ;
   - les financements sont des bandes pleine largeur, pas un tableau ;
   - les avis défilent en marquee, arrêté au survol et sous reduced-motion.
   ════════════════════════════════════════════════════════════════════════════ */

let C: Record<string, string> = {
  bg: "#fbf7f1",
  bgAlt: "#f3e9da",
  bgDark: "#1c1509",
  bgDarkAlt: "#120d05",
  bgCard: "#ffffff",
  accent: "var(--brand,#d97706)",
  accentDark: "var(--brand-light,#95500a)",
  accentLight: "#fbe7cd",
  ink: "#1f1810",
  textMuted: "#6d6153",
  textFaint: "#9b8e7c",
  border: "#e8dcc8",
  borderSoft: "#f2e9da",
  white: "#ffffff",
  marche: "#e2a94f",
};

const DISPLAY = "'Bricolage Grotesque', 'Figtree', system-ui, sans-serif";
const BODY = "'Figtree', system-ui, -apple-system, sans-serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const NAV = [
  { l: "Le cursus", h: "#methode" },
  { l: "Parcours", h: "#services" },
  { l: "Financements", h: "#tarifs" },
  { l: "Garanties", h: "#engagements" },
  { l: "Contact", h: "#contact" },
];

/* ── Données de démonstration (contenu du thème, conservé mot pour mot) ───── */

const HERO_SOURCE = [
  {
    k: "Métiers de bouche",
    sub: "Le geste appris en cuisine réelle, pas en amphi.",
    tiles: [
      { icon: ChefHat, t: "CAP Cuisine en 8 mois", d: "Cuisine pédagogique pro, 12 par promotion, 8 semaines de stage.", ton: "clair" },
      { icon: Compass, t: "Titre Pro Boulanger", d: "Fournil sur place, four à sole, épreuves en conditions réelles.", ton: "sombre" },
      { icon: ChefHat, t: "HACCP inclus", d: "La formation hygiène obligatoire, comprise dans chaque parcours.", ton: "accent" },
    ],
  },
  {
    k: "Métiers du bois",
    sub: "L'atelier de 400 m², cœur de l'école.",
    tiles: [
      { icon: Hammer, t: "Titre Pro Menuisier", d: "Machines pro, projets réels livrés à des clients solidaires.", ton: "sombre" },
      { icon: Compass, t: "Ébénisterie d'art", d: "Module de perfectionnement : placage, marqueterie, finitions.", ton: "accent" },
      { icon: Hammer, t: "Sécurité machines", d: "Habilitations passées à l'atelier, sur les vraies machines.", ton: "clair" },
    ],
  },
  {
    k: "Numérique",
    sub: "Le code, appris en construisant.",
    tiles: [
      { icon: Laptop, t: "Développeur web (RNCP 5)", d: "9 mois, projets réels, jury de professionnels en poste.", ton: "accent" },
      { icon: Compass, t: "Alternance possible", d: "Rythme 1 semaine école / 3 semaines entreprise dès le 3e mois.", ton: "clair" },
      { icon: Laptop, t: "Matériel prêté", d: "Un portable confié à chaque stagiaire pour toute la durée.", ton: "sombre" },
    ],
  },
];
let HERO = HERO_SOURCE;

/* Les marches du bento annoncent les parcours du client dès qu'il en a saisi :
   la cascade reste celle du thème, les métiers nommés deviennent les siens. */
function HERO_LIVE() {
  const presta = clientServices(sessionData);
  if (!presta || presta.length === 0) return HERO_SOURCE;
  return HERO_SOURCE.map((s, i) => ({
    ...s,
    k: presta[i % presta.length]?.title || s.k,
    tiles: s.tiles.map((t, n) => {
      const p = presta[(i * s.tiles.length + n) % presta.length];
      return { ...t, t: p?.title || t.t, d: p?.description || p?.desc || t.d };
    }),
  }));
}

const SERVICES_SOURCE = [
  { titre: "CAP Cuisine (8 mois)", desc: "En cuisine pédagogique professionnelle, avec 8 semaines de stage en restaurant. Le CAP en candidat libre, préparé sérieusement.", tag: "Cuisine", n: "01", icon: ChefHat },
  { titre: "Titre Pro Menuisier fabricant", desc: "Niveau 3 RNCP, dans un atelier de 400 m². Les projets des stagiaires équipent des associations locales — du réel, jusqu'au client.", tag: "Bois", n: "02", icon: Hammer },
  { titre: "Développeur web et web mobile", desc: "Titre RNCP niveau 5 en 9 mois. Front, back, bases de données, projet final soutenu devant un jury de développeurs en poste.", tag: "Code", n: "03", icon: Laptop },
  { titre: "Boulanger (Titre Pro)", desc: "Fournil sur place, levains menés chaque nuit de formation, épreuves blanches en conditions d'examen réelles.", tag: "Fournil", n: "04", icon: ChefHat },
  { titre: "Bilan de compétences", desc: "24 h sur 8 semaines pour choisir la reconversion — avant d'y engager un an de votre vie. Éligible CPF.", tag: "Bilan", n: "05", icon: Compass },
  { titre: "Accompagnement emploi", desc: "CV métier, réseau d'entreprises partenaires, préparation aux entretiens : le titre est un moyen, l'emploi est le but.", tag: "Emploi", n: "06", icon: Compass },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE_SOURCE = [
  { n: "01", t: "Réunion d'info & entretien", d: "Chaque mois. On parle métier réel, salaires réels, difficultés réelles — pas de brochure enchantée." },
  { n: "02", t: "Financement bouclé avant", d: "CPF, Transitions Pro, France Travail, Région : le dossier est monté et accepté avant le premier jour." },
  { n: "03", t: "Atelier + stage", d: "Les gestes en atelier dès la première semaine, 6 à 8 semaines de stage placées par l'école." },
  { n: "04", t: "Titre + placement", d: "Épreuves RNCP, puis six mois de suivi emploi. Nos taux d'insertion sont publiés parcours par parcours." },
];
let METHODE = METHODE_SOURCE;

/* La réunion d'information a lieu quelque part : la ville du client la rend
   vraie chez lui, sans rien inventer d'autre. */
function METHODE_LIVE() {
  const ville = clientCity(sessionData);
  if (!ville) return METHODE_SOURCE;
  return METHODE_SOURCE.map((m, i) => (i === 0 ? { ...m, d: `${m.d} Dans nos locaux de ${ville}.` } : m));
}

const ENGAGEMENT_SOURCE = [
  "Certification Qualiopi, NDA 75 33 12987 33 — audits publiés",
  "Titres professionnels RNCP reconnus par l'État (niveaux 3 à 5)",
  "Taux d'insertion à 6 mois publiés par parcours, réunions d'info mensuelles",
  "Promotion limitée à 12 : un formateur voit réellement chaque geste",
];
let ENGAGEMENT = ENGAGEMENT_SOURCE;

const TARIFS_SOURCE = [
  { a: "CAP Cuisine — 8 mois", p: "7 900 €", n: "Finançable Transitions Pro / CPF / France Travail. Tenues et couteaux fournis." },
  { a: "Titre Pro Menuisier — 7 mois", p: "8 400 €", n: "EPI et consommables inclus, projets réels clients." },
  { a: "Développeur web — 9 mois", p: "8 900 €", n: "Portable prêté, alternance possible dès le 3e mois." },
  { a: "Bilan de compétences — 24 h", p: "1 800 €", n: "Éligible CPF, en présentiel ou visio, restitution écrite." },
];
let TARIFS = TARIFS_SOURCE;

const AVIS_SOURCE = [
  { texte: "Contrôleur de gestion pendant douze ans, menuisier depuis dix-huit mois. L'atelier réel fait toute la différence : au premier jour en entreprise, je savais tenir mon poste.", auteur: "Damien F., 41 ans", detail: "Titre Pro Menuisier" },
  { texte: "Le CAP Cuisine en promotion de 12, c'est un vrai restaurant d'application, pas une salle de classe. Embauchée par mon maître de stage avant même l'examen.", auteur: "Nora B., 33 ans", detail: "CAP Cuisine" },
  { texte: "Transitions Pro a financé la totalité, salaire maintenu. Le dossier faisait peur, l'école l'a monté avec moi en trois rendez-vous.", auteur: "Sébastien L., 38 ans", detail: "Développeur web" },
];
let AVIS = AVIS_SOURCE;

const STATS_SOURCE = [
  { value: "82 %", label: "En emploi 6 mois après le titre" },
  { value: "12", label: "Stagiaires max par promotion" },
  { value: "400 m²", label: "D'ateliers réels" },
  { value: "RNCP", label: "Titres reconnus par l'État" },
];
let STATS = STATS_SOURCE;

const REPERES_SOURCE = [
  "Réunion d'information le premier jeudi du mois, à 18 h",
  "Entretien individuel de projet, sans engagement",
  "Portes des ateliers ouvertes le jour de la réunion",
];
let REPERES = REPERES_SOURCE;

/* URL photo du thème — conservée telle quelle. Les autres emplacements
   attendent celles du client : sans image, le repli dessiné tient la page. */
const PHOTO_FALLBACK = [
  "https://images.pexels.com/photos/34007246/pexels-photo-34007246.jpeg?auto=compress&cs=tinysrgb&w=1400",
  "",
  "",
];

// Photo du client à cet emplacement, repli sur celle du thème quand il y en a.
function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ── Primitives ───────────────────────────────────────────────────────────── */

function Reveal({ children, delay = 0, y = 26 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Kicker maison : filet 40×1 px, capitales très filées. */
function Kicker({ children, tone = "faint", center = false }: { children: React.ReactNode; tone?: "faint" | "accent" | "clair"; center?: boolean }) {
  const col = tone === "accent" ? C.accentDark : tone === "clair" ? C.marche : C.textFaint;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: center ? "center" : "flex-start", color: col }}>
      <span aria-hidden style={{ width: 40, height: 1, background: "currentColor", opacity: 0.8, flexShrink: 0 }} />
      <span style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.34em", textTransform: "uppercase", color: "currentColor" }}>
        {children}
      </span>
      {center && <span aria-hidden style={{ width: 40, height: 1, background: "currentColor", opacity: 0.8, flexShrink: 0 }} />}
    </div>
  );
}

/** La figure de titre du thème : un mot en italique de Figtree dans le grotesque. */
function Mot({ children }: { children: React.ReactNode }) {
  return (
    <em style={{ fontFamily: BODY, fontStyle: "italic", fontWeight: 600, color: C.accentDark }}>{children}</em>
  );
}

/**
 * Surface photographique avec repli dessiné.
 *
 * Sans image — proxy bloqué ou client qui n'en fournit pas — la boîte tient
 * seule : aplat chaud, hachures d'établi en CSS, glow d'accent, et le tracé au
 * trait d'un escalier de marches.
 */
function Plate({ src, alt, ratio = "4/3", label, sombre = false }: { src: string; alt: string; ratio?: string; label?: string; sombre?: boolean }) {
  const fond = sombre ? C.bgDarkAlt : C.accentLight;
  const trait = sombre ? C.marche : C.accentDark;
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: ratio,
        background: fond,
        overflow: "hidden",
        borderRadius: 6,
        boxShadow: `inset 0 0 0 1px ${sombre ? "rgba(255,255,255,0.09)" : C.border}`,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: sombre ? 0.4 : 0.55,
          backgroundImage: `repeating-linear-gradient(45deg, ${sombre ? "rgba(255,255,255,0.05)" : "rgba(31,24,16,0.05)"} 0 1px, transparent 1px 11px)`,
        }}
      />
      <div
        aria-hidden
        style={{ position: "absolute", inset: 0, background: `radial-gradient(88% 70% at 24% 18%, ${C.accent} 0%, transparent 72%)`, opacity: sombre ? 0.2 : 0.12 }}
      />
      {!src && (
        <svg aria-hidden viewBox="0 0 120 100" style={{ position: "absolute", left: "50%", top: "50%", width: "42%", transform: "translate(-50%,-50%)", opacity: 0.55 }}>
          <path d="M8 88 H36 V66 H64 V44 H92 V22 H116" fill="none" stroke={trait} strokeWidth="1.5" />
          <path d="M36 88 V66 M64 66 V44 M92 44 V22" stroke={trait} strokeWidth="1.1" />
        </svg>
      )}
      {src && <img src={src} alt={alt} loading="lazy" style={{ position: "relative", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
      <span aria-hidden style={{ position: "absolute", left: 0, bottom: 0, width: "34%", height: 3, background: C.accent }} />
      {label && (
        <span
          style={{
            position: "absolute",
            left: 14,
            bottom: 14,
            fontFamily: BODY,
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: sombre ? C.white : C.ink,
            background: sombre ? "rgba(18,13,5,0.82)" : "rgba(251,247,241,0.9)",
            border: `1px solid ${sombre ? "rgba(255,255,255,0.14)" : C.border}`,
            padding: "6px 11px",
            borderRadius: 3,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

/** Tuile du héros : trois tons pour que la cascade ne soit pas monotone. */
function HeroTuile({ icon: Icon, t, d, ton, grande }: any) {
  const fond = ton === "sombre" ? C.bgDark : ton === "accent" ? C.accentLight : C.bgCard;
  const encre = ton === "sombre" ? C.bgAlt : C.ink;
  const doux = ton === "sombre" ? "rgba(243,233,218,0.68)" : C.textMuted;
  return (
    <div
      style={{
        background: fond,
        color: encre,
        border: `1px solid ${ton === "sombre" ? "rgba(255,255,255,0.1)" : C.border}`,
        borderRadius: 8,
        padding: grande ? "clamp(20px, 2.4vw, 30px)" : "clamp(15px, 1.8vw, 21px)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 12,
        boxShadow: ton === "sombre" ? "0 22px 46px rgba(28,21,9,0.26)" : "0 12px 30px rgba(28,21,9,0.07)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: ton === "sombre" ? 0.18 : 0.3,
          pointerEvents: "none",
          backgroundImage: `repeating-linear-gradient(45deg, ${ton === "sombre" ? "rgba(255,255,255,0.045)" : "rgba(31,24,16,0.045)"} 0 1px, transparent 1px 12px)`,
        }}
      />
      <Icon size={grande ? 24 : 18} color={ton === "sombre" ? C.marche : C.accentDark} aria-hidden style={{ flexShrink: 0, position: "relative" }} />
      <div style={{ position: "relative", minWidth: 0 }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 600, letterSpacing: "-0.012em", fontSize: grande ? "clamp(18px, 2vw, 24px)" : "clamp(14.5px, 1.5vw, 16.5px)", lineHeight: 1.2, marginBottom: 7 }}>
          {t}
        </div>
        <div style={{ fontFamily: BODY, fontWeight: 400, fontSize: grande ? 13.8 : 12.6, lineHeight: 1.66, color: doux }}>{d}</div>
      </div>
    </div>
  );
}

/** Marche du cursus : le bloc décalé, sa barre, son numéro évidé. */
function Marche({ m, idx, total }: { m: any; idx: number; total: number }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className="i348-marche"
      style={{
        marginLeft: `calc(${idx} * clamp(0px, 3.4vw, 62px))`,
        marginRight: `calc(${total - 1 - idx} * clamp(0px, 1.4vw, 24px))`,
      }}
    >
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          position: "relative",
          background: hov ? C.white : C.bgCard,
          border: `1px solid ${hov ? C.accent : C.border}`,
          borderRadius: 10,
          padding: "clamp(24px, 3vw, 36px) clamp(20px, 2.6vw, 34px)",
          transform: hov ? "translateY(-5px)" : "none",
          boxShadow: hov
            ? "0 28px 56px rgba(28,21,9,0.14), 0 5px 14px rgba(28,21,9,0.08)"
            : "0 10px 26px rgba(28,21,9,0.05)",
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          overflow: "hidden",
        }}
      >
        {/* La barre de progression : une marche de plus à chaque étape. */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: 4,
            width: `${((idx + 1) / total) * 100}%`,
            background: `linear-gradient(90deg, ${C.accent} 0%, ${C.marche} 100%)`,
          }}
        />
        <span
          aria-hidden
          style={{
            position: "absolute",
            right: 14,
            bottom: -24,
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 128,
            lineHeight: 0.78,
            color: "transparent",
            WebkitTextStroke: `1px ${C.ink}`,
            opacity: 0.09,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {m.n}
        </span>
        <div style={{ position: "relative" }}>
          <div style={{ fontFamily: BODY, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: C.accentDark, marginBottom: 12 }}>
            Marche {m.n}
          </div>
          <h3 style={{ fontFamily: DISPLAY, fontWeight: 600, letterSpacing: "-0.014em", fontSize: "clamp(20px, 2.4vw, 27px)", lineHeight: 1.18, color: C.ink, margin: "0 0 11px" }}>{m.t}</h3>
          <p style={{ fontFamily: BODY, fontSize: 14.5, lineHeight: 1.78, color: C.textMuted, margin: 0, maxWidth: 620 }}>{m.d}</p>
        </div>
      </div>
    </div>
  );
}

/** Carte de parcours : barre de tête croissante, chiffre évidé, flèche. */
function ParcoursCard({ s, idx, total }: { s: any; idx: number; total: number }) {
  const [hov, setHov] = useState(false);
  const Icon = s.icon ?? Compass;
  return (
    <article
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: hov ? C.white : C.bgCard,
        border: `1px solid ${hov ? C.accent : C.border}`,
        borderRadius: 10,
        padding: "clamp(24px, 2.8vw, 34px)",
        transform: hov ? "translateY(-6px)" : "none",
        boxShadow: hov
          ? "0 28px 54px rgba(28,21,9,0.14), 0 5px 13px rgba(28,21,9,0.08)"
          : "0 10px 26px rgba(28,21,9,0.05)",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        overflow: "hidden",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: 4,
          width: hov ? "100%" : `${(((idx % total) + 1) / total) * 100}%`,
          background: `linear-gradient(90deg, ${C.accent} 0%, ${C.marche} 100%)`,
          transition: "width 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <Icon size={17} color={hov ? C.accent : C.textFaint} aria-hidden style={{ transition: "color 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }} />
          <span style={{ fontFamily: BODY, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: C.textFaint }}>{s.tag}</span>
        </span>
        <span
          aria-hidden
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 30,
            lineHeight: 0.9,
            color: "transparent",
            WebkitTextStroke: `1px ${hov ? C.accent : C.border}`,
            transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {s.n}
        </span>
      </div>
      <h3 style={{ fontFamily: DISPLAY, fontWeight: 600, letterSpacing: "-0.014em", fontSize: "clamp(18px, 2vw, 22px)", lineHeight: 1.2, color: C.ink, margin: "0 0 12px" }}>{s.titre}</h3>
      <p style={{ fontFamily: BODY, fontSize: 14, lineHeight: 1.75, color: C.textMuted, margin: 0 }}>{s.desc}</p>
      <div
        style={{
          marginTop: "auto",
          paddingTop: 22,
          display: "flex",
          alignItems: "center",
          gap: 9,
          fontFamily: BODY,
          fontSize: 12.5,
          fontWeight: 700,
          color: hov ? C.accentDark : C.textFaint,
          transition: "color 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        En parler en réunion d'info
        <ArrowRight size={14} aria-hidden style={{ transform: hov ? "translateX(7px)" : "none", transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }} />
      </div>
    </article>
  );
}

/** Bande de financement : intitulé à gauche, prix monumental à droite. */
function BandeTarif({ t, idx }: { t: any; idx: number }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="i348-bande"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0,1fr) auto",
        gap: "clamp(16px, 3vw, 40px)",
        alignItems: "center",
        padding: "clamp(22px, 3vw, 34px) clamp(18px, 2.6vw, 34px)",
        background: hov ? C.white : idx % 2 === 0 ? C.bgCard : "transparent",
        borderTop: `1px solid ${C.border}`,
        boxShadow: hov ? `inset 4px 0 0 0 ${C.accent}, 0 20px 44px rgba(28,21,9,0.09)` : "inset 0 0 0 0 transparent",
        transform: hov ? "translateX(6px)" : "none",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 600, letterSpacing: "-0.012em", fontSize: "clamp(18px, 2.1vw, 24px)", lineHeight: 1.22, color: C.ink }}>{t.a}</div>
        <p style={{ fontFamily: BODY, fontSize: 13.5, lineHeight: 1.7, color: C.textMuted, margin: "8px 0 0", maxWidth: 620 }}>{t.n}</p>
      </div>
      <div
        style={{
          fontFamily: DISPLAY,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          fontSize: "clamp(22px, 3vw, 34px)",
          lineHeight: 1,
          color: hov ? C.accentDark : C.accent,
          whiteSpace: "nowrap",
          transition: "color 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {t.p}
      </div>
    </div>
  );
}

/** Carte d'avis du marquee. */
function AvisCard({ a }: { a: any }) {
  return (
    <figure
      style={{
        margin: 0,
        flex: "0 0 auto",
        width: "clamp(268px, 30vw, 380px)",
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "clamp(24px, 2.8vw, 32px)",
        boxShadow: "0 14px 34px rgba(28,21,9,0.06)",
        whiteSpace: "normal",
      }}
    >
      <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
        {[...Array(5)].map((_, j) => (
          <Star key={j} size={12} fill={C.accent} color={C.accent} aria-hidden />
        ))}
      </div>
      <blockquote style={{ fontFamily: BODY, fontStyle: "italic", fontSize: 14.5, lineHeight: 1.78, color: C.ink, margin: "0 0 18px" }}>
        «&nbsp;{a.texte}&nbsp;»
      </blockquote>
      <figcaption style={{ borderTop: `1px solid ${C.borderSoft}`, paddingTop: 13 }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 14.5, color: C.ink }}>{a.auteur}</div>
        <div style={{ fontFamily: BODY, fontSize: 11.5, letterSpacing: "0.08em", color: C.textFaint, marginTop: 5 }}>{a.detail}</div>
      </figcaption>
    </figure>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function AlmaCompetencesPage() {
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
  HERO = HERO_LIVE();
  METHODE = METHODE_LIVE();
  /* La méthode du client remplace les étapes de la démonstration. */
  METHODE = resolveList(
    fusionnerEtapes(METHODE_SOURCE, clientMethode(sessionData)),
    METHODE_SOURCE,
  );

  /* Blocs vivants : recalculés à chaque rendu, une fois la session affectée. */
  STATS = resolveList(clientStats(sessionData), STATS_SOURCE);
  ENGAGEMENT = resolveList(clientCertifications(sessionData), ENGAGEMENT_SOURCE);
  REPERES = resolveList(clientList(sessionData, "contact.reperes"), REPERES_SOURCE);
  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({ ...SERVICES_SOURCE[i % SERVICES_SOURCE.length], titre: s.title })),
    SERVICES_SOURCE,
  );
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...TARIFS_SOURCE[i % TARIFS_SOURCE.length],
      a: s.title,
      p: s.price || TARIFS_SOURCE[i % TARIFS_SOURCE.length].p,
      n: s.description || s.desc || TARIFS_SOURCE[i % TARIFS_SOURCE.length].n,
    })),
    TARIFS_SOURCE,
  );
  AVIS = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      ...AVIS_SOURCE[i % AVIS_SOURCE.length],
      texte: r.text || AVIS_SOURCE[i % AVIS_SOURCE.length].texte,
      auteur: r.name || r.author || AVIS_SOURCE[i % AVIS_SOURCE.length].auteur,
      detail: r.location || r.role || AVIS_SOURCE[i % AVIS_SOURCE.length].detail,
    })),
    AVIS_SOURCE,
  );
  brand = fd?.brandColor ?? null;
  if (brand) {
    C = { ...C, accent: brand };
  }

  const SERVICES = resolveList(
    clientServices(sessionData)?.map((s: any, n: number) => ({
      titre: s.title || SERVICES_DEMO[n % SERVICES_DEMO.length].titre,
      desc: s.description || s.desc || SERVICES_DEMO[n % SERVICES_DEMO.length].desc,
      tag: SERVICES_DEMO[n % SERVICES_DEMO.length].tag,
      n: SERVICES_DEMO[n % SERVICES_DEMO.length].n,
      icon: SERVICES_DEMO[n % SERVICES_DEMO.length].icon,
    })),
    SERVICES_DEMO,
  );

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Un seul index pilote tout le héros : bento, marche, légende, compteur. */
  const { i, next, prev } = useSlides(HERO.length, DWELL.normal);
  const S = HERO[i];

  /* Le bento en escalier : la marche à gauche, la grande tuile à droite, la
     suivante décalée d'une colonne, la base à droite — la diagonale descend. */
  const tiles = [
    {
      area: { gridColumn: "1", gridRow: "1" },
      node: (
        <div
          style={{
            background: C.accent,
            color: C.white,
            borderRadius: 8,
            padding: "clamp(14px, 1.8vw, 20px)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 8,
            boxShadow: "0 20px 40px rgba(28,21,9,0.2)",
          }}
        >
          <span style={{ fontFamily: BODY, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", opacity: 0.85 }}>Filière</span>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(28px, 3.4vw, 44px)", lineHeight: 0.9, letterSpacing: "-0.03em" }}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span style={{ fontFamily: BODY, fontSize: 12.5, fontWeight: 600, lineHeight: 1.35 }}>{S.k}</span>
        </div>
      ),
    },
    { area: { gridColumn: "2 / span 2", gridRow: "1" }, node: <HeroTuile {...S.tiles[0]} grande /> },
    { area: { gridColumn: "1 / span 2", gridRow: "2" }, node: <HeroTuile {...S.tiles[1]} /> },
    { area: { gridColumn: "2 / span 2", gridRow: "3" }, node: <HeroTuile {...S.tiles[2]} /> },
  ];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const nom = clientName(sessionData) ?? fd?.businessName ?? "Alma Compétences";
  const ville = clientCity(sessionData) ?? "Bordeaux";
  const metier = clientTrade(sessionData) ?? "Reconversions professionnelles";
  const phone = clientPhone(sessionData) ?? fd?.phone ?? "05 56 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33556000000").replace(/[^+\d]/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "projet@alma-competences.fr";
  const adresse = clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "33000", "Bordeaux");
  const horaires = "Lun–Ven 8h30–18h30";

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: BODY, overflowX: "clip" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Figtree:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&display=swap');

        @media (max-width: 980px) { #i348-nav { display: none !important; } .i348-burger { display: flex !important; } }
        @media (max-width: 900px) {
          .i348-hero { grid-template-columns: minmax(0,1fr) !important; gap: 34px !important; }
          .i348-bentohero { grid-template-columns: minmax(0,1fr) !important; grid-template-rows: none !important; }
          .i348-bentohero > * { grid-column: 1 !important; grid-row: auto !important; }
          .i348-escalier > * { margin-left: 0 !important; margin-right: 0 !important; }
        }
        @media (max-width: 860px) {
          .i348-split { grid-template-columns: minmax(0,1fr) !important; }
          .i348-split > * { order: initial !important; }
          .i348-bande { grid-template-columns: minmax(0,1fr) !important; gap: 12px !important; }
          .i348-stats { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
          .i348-stats > * { margin-top: 0 !important; border-left: none !important; }
          .i348-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i348-sticky { position: static !important; }
        }

        .i348-navlink { position: relative; }
        .i348-navlink::after {
          content: ""; position: absolute; left: 8px; bottom: 8px; height: 1.5px; width: 0;
          background: ${C.accent}; transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .i348-navlink:hover::after { width: calc(100% - 16px); }

        /* Le marquee des avis : arrêté au survol, supprimé sous reduced-motion. */
        @keyframes i348-defile { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .i348-track { display: flex; gap: clamp(16px, 2vw, 24px); width: max-content; animation: i348-defile 52s linear infinite; }
        .i348-track:hover { animation-play-state: paused; }

        /* Détail gratuit : la marche qui monte sous le titre du cursus. */
        @keyframes i348-monte {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .i348-pas { animation: i348-monte 5.2s cubic-bezier(0.16, 1, 0.3, 1) infinite; }

        @media (prefers-reduced-motion: reduce) {
          .i348-navlink::after { transition: none; }
          .i348-track { animation: none; flex-wrap: wrap; width: 100%; justify-content: center; }
          .i348-pas { animation: none; }
        }
      `}</style>

      {/* ── NAV — collante à quatre propriétés : hauteur, fond, flou, filet ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: scrolled ? 62 : 78,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(20px, 4vw, 52px)",
          background: scrolled ? "rgba(251,247,241,0.93)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={nom} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Compass size={17} color={C.accent} aria-hidden style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, letterSpacing: "-0.02em", fontSize: 19, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nom}</span>
              <span style={{ fontFamily: BODY, fontSize: 9.5, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textFaint, marginLeft: 8 }}>Reconversions</span>
            </>
          )}
        </div>
        <div id="i348-nav" style={{ display: "flex", gap: 2, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} className="i348-navlink" style={{ fontFamily: BODY, color: C.textMuted, fontSize: 13.5, fontWeight: 600, textDecoration: "none", padding: "12px 8px" }}>
              {l}
            </a>
          ))}
          <motion.a
            href={telHref}
            style={{ background: C.accentDark, color: C.white, padding: "12px 22px", fontFamily: BODY, fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", marginLeft: 14, borderRadius: 6 }}
            whileHover={{ scale: 1.03, y: -1 }}
          >
            Réunion d'info
          </motion.a>
        </div>
        <button
          className="i348-burger"
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
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ fontFamily: BODY, color: C.ink, fontSize: 16, fontWeight: 600, textDecoration: "none", padding: "12px 0" }}>
              {l}
            </a>
          ))}
          <a href={telHref} style={{ background: C.accentDark, color: C.white, padding: "14px 22px", fontFamily: BODY, fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 10, borderRadius: 6 }}>
            Réunion d'info
          </a>
        </div>
      )}

      {/* ── HÉROS H8 — bento en escalier, dévoilé marche par marche ───────── */}
      <section
        className="i348-hero i348-pad"
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "grid",
          gridTemplateColumns: "minmax(0,0.96fr) minmax(0,1.04fr)",
          gap: "clamp(28px, 4vw, 58px)",
          alignItems: "center",
          padding: "clamp(128px, 15vh, 172px) clamp(24px, 5vw, 64px) clamp(56px, 8vh, 92px)",
          maxWidth: 1300,
          margin: "0 auto",
        }}
      >
        {/* Textures sans image : hachures d'établi, glow, chiffre fantôme. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.5,
            backgroundImage: "repeating-linear-gradient(45deg, rgba(31,24,16,0.028) 0 1px, transparent 1px 13px)",
          }}
        />
        <div
          aria-hidden
          style={{ position: "absolute", top: "2%", right: "-8%", width: 560, height: 560, borderRadius: "50%", background: `radial-gradient(circle, ${C.accent} 0%, transparent 68%)`, opacity: 0.11, pointerEvents: "none" }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "-2vw",
            bottom: "2vh",
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: "clamp(120px, 21vw, 290px)",
            lineHeight: 0.76,
            letterSpacing: "-0.04em",
            color: C.ink,
            opacity: 0.04,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {STATS[0]?.value ?? "82 %"}
        </div>

        {/* Colonne éditoriale */}
        <div style={{ position: "relative", zIndex: 2, minWidth: 0 }}>
          <Kicker tone="accent">{clientEyebrow(sessionData) ?? `${metier} · ${ville}`}</Kicker>

          <h1
            style={{
              fontFamily: DISPLAY,
              fontWeight: 700,
              fontSize: "clamp(35px, 5.4vw, 72px)",
              lineHeight: 0.97,
              letterSpacing: "-0.035em",
              color: C.ink,
              margin: "24px 0 22px",
            }}
          >
            {/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ?? (
              <>
                {clientHeroLine(sessionData, 0, 2, 16) ?? "Changer de métier,"}
                <br />
                <Mot>{clientHeroLine(sessionData, 1, 2, 16) ?? "avec un titre qui le prouve."}</Mot>
              </>
            )}
          </h1>

          <p style={{ fontFamily: BODY, fontSize: "clamp(15px, 1.6vw, 17.5px)", lineHeight: 1.78, color: C.textMuted, maxWidth: 480, margin: "0 0 32px" }}>
            {c?.heroSubline ?? clientHeroSubtitle(sessionData) ?? "Cuisine, menuiserie, développement web : des reconversions en 4 à 9 mois vers des titres professionnels RNCP, en atelier réel, avec stage et accompagnement à l'emploi."}
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <motion.a
              href={telHref}
              style={{ background: C.accentDark, color: C.white, padding: "16px 30px", fontFamily: BODY, fontSize: 14.5, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, borderRadius: 6 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              Parler de mon projet <ArrowRight size={16} aria-hidden />
            </motion.a>
            <a
              href="#methode"
              style={{ border: `1px solid ${C.border}`, background: C.white, color: C.ink, padding: "15px 26px", fontFamily: BODY, fontSize: 14.5, fontWeight: 600, textDecoration: "none", borderRadius: 6 }}
            >
              Le cursus, marche par marche
            </a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: "clamp(26px, 4vh, 44px)", flexWrap: "wrap" }}>
            <SlideIndex i={i} total={HERO.length} variant="fraction" color={C.textFaint} className="" />
            <span style={{ fontFamily: BODY, fontSize: 13, color: C.textMuted, maxWidth: 330 }}>
              <strong style={{ color: C.ink, fontWeight: 700 }}>{S.k}</strong> — {S.sub}
            </span>
            <HairlineArrows onPrev={prev} onNext={next} color={C.ink} className="" labels={{ prev: "Filière précédente", next: "Filière suivante" }} />
          </div>
        </div>

        {/* L'escalier : quatre tuiles inégales dévoilées de haut en bas. */}
        <div style={{ position: "relative", zIndex: 2, minWidth: 0 }}>
          <BentoCascade
            index={i}
            tiles={tiles}
            className="i348-bentohero"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,0.62fr) minmax(0,0.62fr) minmax(0,0.76fr)",
              gridTemplateRows: "minmax(150px, auto) minmax(112px, auto) minmax(112px, auto)",
              gap: 12,
            }}
          />
        </div>
      </section>

      {/* ── RESPIRATION ──────────────────────────────────────────────────── */}
      <section className="i348-pad" style={{ background: C.bg, padding: "clamp(58px, 8vw, 104px) 64px clamp(30px, 4vw, 50px)", textAlign: "center" }}>
        <Reveal>
          <p style={{ fontFamily: BODY, fontStyle: "italic", fontSize: "clamp(20px, 2.6vw, 31px)", lineHeight: 1.55, color: C.textMuted, maxWidth: 720, margin: "0 auto" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (
              <>
                Une reconversion n'est pas un saut. <span style={{ color: C.ink, fontStyle: "normal", fontFamily: DISPLAY, fontWeight: 600 }}>C'est un escalier, et on en monte les marches une par une.</span>
              </>
            )}
          </p>
        </Reveal>
      </section>

      {/* ── LE CURSUS — l'escalier des quatre marches ─────────────────────── */}
      <section id="methode" className="i348-pad" style={{ background: C.bgAlt, padding: "clamp(76px, 9vw, 126px) 64px", position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden
          style={{ position: "absolute", inset: 0, opacity: 0.5, pointerEvents: "none", backgroundImage: "repeating-linear-gradient(45deg, rgba(31,24,16,0.026) 0 1px, transparent 1px 14px)" }}
        />
        <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <Kicker>Le cursus</Kicker>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(28px, 4.2vw, 54px)", lineHeight: 1.02, letterSpacing: "-0.032em", color: C.ink, margin: "16px 0 14px", maxWidth: 760 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                <>
                  Neuf mois <Mot>qui changent une vie active.</Mot>
                </>
              )}
            </h2>
            <p style={{ fontFamily: BODY, fontSize: 15, lineHeight: 1.78, color: C.textMuted, maxWidth: 560, margin: "0 0 clamp(30px, 4vw, 50px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "methode.chapeau") ?? (
                <>Quatre marches, dans cet ordre. Aucune ne se saute — surtout pas la deuxième, celle du financement bouclé avant le premier jour.</>
              )}
            </p>
          </Reveal>
          <div className="i348-escalier" style={{ display: "flex", flexDirection: "column", gap: "clamp(14px, 2vw, 22px)" }}>
            {METHODE.map((m: any, idx: number) => (
              <Reveal key={m.n} delay={idx * 0.055} y={22}>
                <Marche m={m} idx={idx} total={METHODE.length} />
              </Reveal>
            ))}
          </div>
          <div style={{ marginTop: "clamp(34px, 5vw, 56px)", maxWidth: 660, marginLeft: "auto" }}>
            <Reveal delay={0.1}>
              <Plate src={photo(1, PHOTO_FALLBACK[1])} alt="Atelier de l'école pendant une session" ratio="16/9" label="L'atelier, dès la 1re semaine" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CHIFFRES — bande en escalier, fond sombre ─────────────────────── */}
      <section className="i348-pad" style={{ background: C.bgDark, padding: "clamp(52px, 7vw, 86px) 64px", position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden
          style={{ position: "absolute", right: "-4%", top: "-30%", width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, ${C.accent} 0%, transparent 68%)`, opacity: 0.12, pointerEvents: "none" }}
        />
        <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <Kicker tone="clair">Ce qu'on publie</Kicker>
          </Reveal>
          <div
            className="i348-stats"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(STATS.length, 4)}, minmax(0,1fr))`,
              gap: 0,
              marginTop: 26,
              alignItems: "start",
            }}
          >
            {STATS.map((s: any, idx: number) => (
              <Reveal key={s.label} delay={idx * 0.055} y={18}>
                <div
                  style={{
                    padding: "clamp(10px, 1.4vw, 18px) clamp(12px, 1.6vw, 24px)",
                    borderLeft: idx === 0 ? "none" : "1px solid rgba(255,255,255,0.1)",
                    marginTop: `calc(${idx} * clamp(0px, 1.4vw, 22px))`,
                  }}
                >
                  <div style={{ fontFamily: DISPLAY, fontWeight: 700, letterSpacing: "-0.03em", fontSize: "clamp(26px, 3.4vw, 42px)", lineHeight: 0.96, color: C.marche }}>{s.value}</div>
                  <div style={{ fontFamily: BODY, fontSize: 12.5, lineHeight: 1.5, color: "rgba(243,233,218,0.55)", marginTop: 10 }}>{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARCOURS — cartes à barre de progression croissante ───────────── */}
      <section id="services" className="i348-pad" style={{ background: C.bg, padding: "clamp(76px, 9vw, 126px) 64px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <Kicker>Parcours</Kicker>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(28px, 4.2vw, 54px)", lineHeight: 1.02, letterSpacing: "-0.032em", color: C.ink, margin: "16px 0 14px", maxWidth: 780 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                <>
                  Des métiers qui recrutent, <Mot>des titres qui comptent.</Mot>
                </>
              )}
            </h2>
            <p style={{ fontFamily: BODY, fontSize: 15, lineHeight: 1.78, color: C.textMuted, maxWidth: 560, margin: "0 0 clamp(28px, 4vw, 46px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "services.chapeau") ?? (
                <>Six parcours, tous adossés à un titre reconnu par l'État ou à une étape qui y mène. Le bilan de compétences en fait partie : parfois, la bonne décision est de ne pas s'inscrire.</>
              )}
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: 18 }}>
            {SERVICES.map((s: any, idx: number) => (
              <Reveal key={s.titre} delay={(idx % 3) * 0.055} y={20}>
                <ParcoursCard s={s} idx={idx} total={Math.max(SERVICES.length, 1)} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINANCEMENTS — bandes pleine largeur ──────────────────────────── */}
      <section id="tarifs" className="i348-pad" style={{ background: C.bgAlt, padding: "clamp(76px, 9vw, 126px) 64px" }}>
        <div className="i348-split" style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,0.74fr) minmax(0,1.26fr)", gap: "clamp(30px, 5vw, 64px)", alignItems: "start" }}>
          <div className="i348-sticky" style={{ position: "sticky", top: 110 }}>
            <Reveal>
              <Kicker>Financements</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(26px, 3.8vw, 48px)", lineHeight: 1.02, letterSpacing: "-0.032em", color: C.ink, margin: "16px 0 16px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                  <>
                    Rarement <Mot>de votre poche.</Mot>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: BODY, fontSize: 14.5, lineHeight: 1.78, color: C.textMuted, maxWidth: 400, margin: 0 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.note") ?? (
                  <>Transitions Pro (salariés en reconversion), CPF, France Travail, Région Nouvelle-Aquitaine : 9 stagiaires sur 10 ont un financement total. On monte le dossier ensemble.</>
                )}
              </p>
              <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 10, fontFamily: BODY, fontSize: 12.5, color: C.textFaint }}>
                <Clock size={14} color={C.accent} aria-hidden className="i348-pas" />
                Dossier monté avant le premier jour
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.08}>
            <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", boxShadow: "0 22px 52px rgba(28,21,9,0.07)" }}>
              {TARIFS.map((t: any, idx: number) => (
                <BandeTarif key={t.a} t={t} idx={idx} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── GARANTIES — panneau photo + engagements ───────────────────────── */}
      <section id="engagements" className="i348-pad" style={{ background: C.bg, padding: "clamp(76px, 9.5vw, 126px) 64px" }}>
        <div className="i348-split" style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(34px, 5vw, 74px)", alignItems: "center" }}>
          <Reveal delay={0.12}>
            <div>
              <Kicker>Nos garanties</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(26px, 3.8vw, 48px)", lineHeight: 1.02, letterSpacing: "-0.032em", color: C.ink, margin: "16px 0 20px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>
                    La reconversion, <Mot>sans saut dans le vide.</Mot>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: BODY, fontSize: 15, lineHeight: 1.78, color: C.textMuted, margin: "0 0 26px", maxWidth: 480 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.texte") ?? c?.aboutText ?? (
                  <>Une école de reconversion se juge à ce qu'elle accepte de publier : le taux d'insertion, la taille des promotions, et ce qu'on vous dit avant de vous inscrire.</>
                )}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 30 }}>
                {ENGAGEMENT.map((e: any, idx: number) => (
                  <div key={idx} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <CheckCircle size={16} color={C.accent} aria-hidden style={{ flexShrink: 0, marginTop: 3 }} />
                    <span style={{ fontFamily: BODY, fontSize: 14.5, color: C.textMuted, lineHeight: 1.7 }}>{e}</span>
                  </div>
                ))}
              </div>
              <motion.a
                href={telHref}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.accentDark, color: C.white, padding: "15px 28px", fontFamily: BODY, fontSize: 14, fontWeight: 700, textDecoration: "none", borderRadius: 6 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                Nous appeler <ArrowRight size={15} aria-hidden />
              </motion.a>
            </div>
          </Reveal>
          <Reveal>
            <Plate src={photo(0, PHOTO_FALLBACK[0])} alt="Travaux pratiques en atelier" ratio="4/5" label="Travaux pratiques" />
          </Reveal>
        </div>
      </section>

      {/* ── AVIS — marquee, arrêté au survol ──────────────────────────────── */}
      <section className="i348-pad" style={{ background: C.bgAlt, padding: "clamp(76px, 9vw, 126px) 0", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 clamp(24px, 5vw, 64px)" }}>
          <Reveal>
            <Kicker>Ils l'ont fait</Kicker>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(26px, 3.8vw, 48px)", lineHeight: 1.02, letterSpacing: "-0.032em", color: C.ink, margin: "16px 0 clamp(30px, 5vw, 50px)", maxWidth: 620 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                <>
                  Ils ont <Mot>changé de métier.</Mot>
                </>
              )}
            </h2>
          </Reveal>
        </div>
        <div style={{ position: "relative", overflow: "hidden", maskImage: "linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%)", WebkitMaskImage: "linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%)" }}>
          <div className="i348-track">
            {AVIS.map((a: any, idx: number) => (
              <AvisCard key={`a-${idx}`} a={a} />
            ))}
            {AVIS.map((a: any, idx: number) => (
              <div key={`b-${idx}`} aria-hidden style={{ display: "flex" }}>
                <AvisCard a={a} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT — la réunion d'information ────────────────────────────── */}
      <section id="contact" className="i348-pad" style={{ background: C.bgDark, color: C.white, padding: "clamp(76px, 9.5vw, 126px) 64px", position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: "-3%",
            bottom: "-18%",
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: "clamp(110px, 19vw, 270px)",
            lineHeight: 0.8,
            letterSpacing: "-0.04em",
            color: C.white,
            opacity: 0.035,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          18 h
        </div>
        <div
          aria-hidden
          style={{ position: "absolute", left: "-6%", top: "-14%", width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, ${C.accent} 0%, transparent 68%)`, opacity: 0.13, pointerEvents: "none" }}
        />
        <div className="i348-split" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1.06fr) minmax(0,0.94fr)", gap: "clamp(34px, 5vw, 70px)", alignItems: "center", position: "relative" }}>
          <Reveal>
            <div>
              <Kicker tone="clair">Réunion d'info</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(28px, 4.2vw, 52px)", lineHeight: 1.02, letterSpacing: "-0.032em", color: C.white, margin: "16px 0 18px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                  <>
                    Venez voir les ateliers, <em style={{ fontFamily: BODY, fontStyle: "italic", fontWeight: 600, color: C.marche }}>parlez aux stagiaires.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: BODY, fontSize: 15.5, lineHeight: 1.78, color: "rgba(243,233,218,0.66)", maxWidth: 460, margin: "0 0 26px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ?? (
                  <>Réunion d'information chaque premier jeudi du mois, à 18 h. Inscription par téléphone — et les portes des ateliers sont ouvertes.</>
                )}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 10 }}>
                {REPERES.map((r: any, idx: number) => (
                  <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontFamily: BODY, fontSize: 14, color: "rgba(243,233,218,0.6)", lineHeight: 1.6 }}>
                    <span aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", background: C.marche, marginTop: 8, flexShrink: 0 }} />
                    {r}
                  </li>
                ))}
              </ul>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <motion.a
                  href={telHref}
                  style={{ background: C.accent, color: C.bgDarkAlt, padding: "16px 32px", fontFamily: BODY, fontSize: 15.5, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, borderRadius: 6 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <Phone size={17} aria-hidden /> {phone}
                </motion.a>
                <motion.a
                  href={`mailto:${mail}`}
                  style={{ background: "transparent", color: C.white, border: `1.5px solid ${C.marche}`, padding: "15px 28px", fontFamily: BODY, fontSize: 15.5, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, borderRadius: 6 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <Mail size={17} aria-hidden /> Nous écrire
                </motion.a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div style={{ background: C.bgDarkAlt, border: "1px solid rgba(255,255,255,0.1)", padding: "clamp(24px, 3vw, 36px)", boxShadow: "0 26px 60px rgba(0,0,0,0.4)", borderRadius: 10 }}>
              <div style={{ marginBottom: 20 }}>
                <Plate src={photo(2, PHOTO_FALLBACK[2])} alt="Réunion d'information mensuelle" ratio="16/9" label="Chaque 1er jeudi" sombre />
              </div>
              {[
                { icon: MapPin, label: "L'école & les ateliers", value: adresse },
                { icon: Phone, label: "Téléphone", value: phone, href: telHref },
                { icon: Mail, label: "E-mail", value: mail, href: `mailto:${mail}` },
                { icon: Clock, label: "Horaires", value: horaires },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} style={{ display: "flex", gap: 15, alignItems: "flex-start", padding: "14px 0", borderTop: idx > 0 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                    <div style={{ width: 38, height: 38, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: C.marche, flexShrink: 0, borderRadius: 6 }}>
                      <Icon size={16} aria-hidden />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: BODY, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(243,233,218,0.45)" }}>{item.label}</div>
                      {item.href ? (
                        <a href={item.href} style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 15.5, color: C.white, textDecoration: "none" }}>{item.value}</a>
                      ) : (
                        <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 15.5, color: C.white, lineHeight: 1.45 }}>{item.value}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="i348-pad" style={{ background: C.bgDarkAlt, color: "rgba(243,233,218,0.5)", padding: "clamp(46px, 6vw, 70px) 64px 24px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 34 }}>
            <div style={{ maxWidth: 340 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
                <Compass size={16} color={C.marche} aria-hidden />
                <span style={{ fontFamily: DISPLAY, fontWeight: 700, letterSpacing: "-0.02em", fontSize: 19, color: C.white }}>{nom}</span>
              </div>
              <p style={{ fontFamily: BODY, fontSize: 13, lineHeight: 1.75, color: "rgba(243,233,218,0.42)", margin: 0 }}>
                Organisme de formation certifié Qualiopi · {clientCodePostalVille(sessionData, "33000", "Bordeaux")}
                <br />
                NDA 75 33 12987 33 — titres professionnels RNCP
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <span style={{ fontFamily: BODY, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(243,233,218,0.6)", fontWeight: 700 }}>Navigation</span>
              {NAV.map(({ l, h }) => (
                <a key={l} href={h} style={{ fontFamily: BODY, fontSize: 13, color: "rgba(243,233,218,0.42)", textDecoration: "none", padding: "2px 0" }}>
                  {l}
                </a>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <span style={{ fontFamily: BODY, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(243,233,218,0.6)", fontWeight: 700 }}>Nous joindre</span>
              <span style={{ fontFamily: BODY, fontSize: 13, color: "rgba(243,233,218,0.42)", display: "flex", gap: 9, alignItems: "center" }}>
                <MapPin size={13} aria-hidden /> {adresse}
              </span>
              <a href={telHref} style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 16, color: C.marche, textDecoration: "none" }}>{phone}</a>
              <span style={{ fontFamily: BODY, fontSize: 13, color: "rgba(243,233,218,0.42)", display: "flex", gap: 9, alignItems: "center", lineHeight: 1.5 }}>
                <Clock size={13} aria-hidden /> {horaires}
              </span>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontFamily: BODY, fontSize: 12, color: "rgba(243,233,218,0.38)" }}>
              © {new Date().getFullYear()} {nom} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
              {/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ fontFamily: BODY, fontSize: 12, color: "rgba(243,233,218,0.38)" }}>
              Mentions légales : éditeur {nom} · hébergement Vercel Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
