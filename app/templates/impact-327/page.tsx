"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Star, CheckCircle, ArrowRight, Ruler } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, useSlides, SlideIndex, HairlineArrows, ExpandFrame } from "@/lib/templates/hero-kit-2";
import {
  clientAddress,
  clientCertifications,
  clientCity,
  clientCodePostalVille,
  clientEmail,
  clientEyebrow,
  clientHeroLine,
  clientHeroSubtitle,
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
   LIGNES & BOIS — cuisiniste / agencement sur mesure. Donneur : impact-230.
   Élévation famille II.0 : le geste (ExpandFrame), la palette terracotta/chêne
   et l'ordre des sections sont conservés — on élève le dessin.

   Signature : ExpandFrame. Le cadre qui s'ouvre du plan à la pièce : chaque
   projet entre par un clip-path resserré qui se déploie plein cadre — c'est
   le plan 3D qui devient la cuisine. Aucun autre geste en signature.

   Signature visuelle : fond de repli C.bgDark veiné (la page reste belle
   photos bloquées), séquence d'atelier à trois couches façon CraftSequence
   d'impact-245, règle millimétrée en filet — le métier se mesure.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Fontes — P8 : Newsreader (voix du dessin) + Manrope (voix de l'atelier) ── */
const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=Manrope:wght@300;400;500;600;700&display=swap');`;
const SERIF = "'Newsreader', Georgia, serif";
const SANS = "'Manrope', system-ui, -apple-system, sans-serif";

/* ── Easing unique, répété littéralement dans le CSS ───────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_CSS = "cubic-bezier(.16,1,.3,1)";

/* ── Tokens ────────────────────────────────────────────────────────────────── */
let C: Record<string, string> = {
  bg: "#faf8f4",
  bgAlt: "#f1ebe2",
  bgDark: "#191410",
  bgDarkAlt: "#120e0a",
  bgCard: "#ffffff",
  accent: "var(--brand,#a4552e)",
  accentDark: "var(--brand-light,#7e3f20)",
  accentLight: "#f6e5da",
  ink: "#1e1812",
  textMuted: "#6f6355",
  textFaint: "#a3907b",
  border: "#e3d9ca",
  white: "#ffffff",
  /* clés métier : le chêne clair des façades */
  oak: "#c99f6a",
  oakLight: "#fdf4e6",
};

/* Le veinage : un fond de repli qui reste un décor de bois, sans image.
   Posé derrière chaque surface plein cadre — la page tient photos bloquées. */
const VEINAGE = `linear-gradient(rgba(25,20,16,0.88), rgba(25,20,16,0.88)), repeating-linear-gradient(93deg, #221a13 0px, #2a2016 3px, #221a13 7px, #2d2318 12px, #241b14 16px)`;

const STATS_DEMO = [
  { value: "240+", label: "Cuisines posées" },
  { value: "10 ans", label: "Garantie caissons" },
  { value: "2-3 j", label: "De pose chez vous" },
  { value: "0 €", label: "L'étude 3D, déduite" },
];
let STATS = STATS_DEMO;

const NAV = [
  { l: "Prestations", h: "#prestations" },
  { l: "L'atelier", h: "#atelier" },
  { l: "La méthode", h: "#methode" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* Trois projets pour le hero. Photos : URLs déjà présentes dans le repo
   (atelier bois du donneur, intérieur design) — sujets à contrôler en prod. */
function HERO_PROJETS_DEMO_LIVE() {
  return [
    {
      k: "Cuisine chêne & laque",
      sub: "Îlot central, façades sans poignée, plan de travail céramique.",
      img: (clientPhotos(sessionData)[1] || "https://images.pexels.com/photos/6920452/pexels-photo-6920452.jpeg?auto=compress&cs=tinysrgb&w=1600"),
      alt: "Plan de travail et façades bois d'une cuisine sur mesure",
    },
    {
      k: "De l'atelier à la pièce",
      sub: "Caissons et façades fabriqués en France, ajustés au millimètre.",
      img: (clientPhotos(sessionData)[2] || "https://images.pexels.com/photos/7546654/pexels-photo-7546654.jpeg?auto=compress&cs=tinysrgb&w=1600"),
      alt: "Atelier de fabrication des caissons et façades",
    },
    {
      k: "Agencement séjour",
      sub: "Bibliothèque toute hauteur et meuble TV, mêmes essences que la cuisine.",
      img: (clientPhotos(sessionData)[3] || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=80"),
      alt: "Intérieur aménagé avec rangements sur mesure",
    },
  ];
}
let HERO_PROJETS_DEMO = HERO_PROJETS_DEMO_LIVE();
let HERO_PROJETS = HERO_PROJETS_DEMO;

const PRESTATIONS_SOURCE = [
  { titre: "Cuisine sur mesure", desc: "Conception, fabrication et pose. Caissons 19 mm, façades bois, laque ou stratifié, quincaillerie Blum garantie à vie. Électroménager intégré au projet.", tag: "Cuisine" },
  { titre: "Dressing & placards", desc: "Sous pente, toute hauteur, portes coulissantes ou battantes. Chaque centimètre exploité, éclairage LED intégré sur demande.", tag: "Rangement" },
  { titre: "Bibliothèques & meubles TV", desc: "Agencement du séjour dans les mêmes essences que votre cuisine, pour une maison qui parle d'une seule voix.", tag: "Séjour" },
  { titre: "Salle de bain", desc: "Meubles vasque suspendus, colonnes, plans en céramique ou bois traité. Résistance à l'humidité garantie.", tag: "Bain" },
  { titre: "Conception 3D", desc: "Relevé au laser chez vous, plans 3D photoréalistes, trois allers-retours de modification inclus. L'étude est déduite à la commande.", tag: "Étude" },
  { titre: "Pose par nos menuisiers", desc: "Pose par nos menuisiers salariés — jamais sous-traitée. Chantier protégé, gravats évacués, cuisine opérationnelle sous trois jours.", tag: "Pose" },
];
let PRESTATIONS_DEMO = PRESTATIONS_SOURCE;

/* La séquence d'atelier — trois couches tenues par un seul index, façon
   CraftSequence d'impact-245. Textes repris de la méthode, images du thème. */
function ATELIER_PHASES_LIVE() {
  return [
    {
      index: "I",
      title: "LE RELEVÉ",
      body: "Chez vous, au laser. On parle habitudes de cuisine, rangements, circulation — avant de parler meubles.",
      img: (clientPhotos(sessionData)[5] || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=80"),
      alt: "Relevé de la pièce avant conception",
    },
    {
      index: "II",
      title: "LA FABRICATION",
      body: "Caissons et façades fabriqués en France, quincaillerie allemande. Six semaines en moyenne entre commande et pose.",
      img: (clientPhotos(sessionData)[6] || "https://images.pexels.com/photos/7546654/pexels-photo-7546654.jpeg?auto=compress&cs=tinysrgb&w=1600"),
      alt: "Menuisier ajustant une façade à l'atelier",
    },
    {
      index: "III",
      title: "LA POSE",
      body: "Nos menuisiers salariés posent, raccordent et ajustent. Vous cuisinez le soir du dernier jour.",
      img: (clientPhotos(sessionData)[7] || "https://images.pexels.com/photos/6920452/pexels-photo-6920452.jpeg?auto=compress&cs=tinysrgb&w=1600"),
      alt: "Cuisine posée, plan de travail ajusté",
    },
  ];
}
let ATELIER_PHASES = ATELIER_PHASES_LIVE();

const METHODE = [
  { n: "01", t: "Relevé & écoute", d: "Chez vous, au laser. On parle habitudes de cuisine, rangements, circulation — avant de parler meubles." },
  { n: "02", t: "Plan 3D & devis fermé", d: "Un projet photoréaliste et un devis ferme, poste par poste. Pas de « à partir de » : le prix signé est le prix payé." },
  { n: "03", t: "Fabrication française", d: "Caissons et façades fabriqués en France, quincaillerie allemande. Six semaines en moyenne entre commande et pose." },
  { n: "04", t: "Pose en 2-3 jours", d: "Nos menuisiers salariés posent, raccordent et ajustent. Vous cuisinez le soir du dernier jour." },
];

const ENGAGEMENT_DEMO = [
  "Devis ferme et définitif — aucun supplément découvert en cours de chantier",
  "Garantie 10 ans sur les caissons, quincaillerie garantie à vie",
  "RC professionnelle et garantie décennale sur la pose",
  "Showroom sur rendez-vous : touchez les façades avant de choisir",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

const TARIFS_DEMO = [
  { a: "Cuisine complète posée", p: "dès 8 900 €", n: "Caissons, façades, plan de travail, pose et raccordements. Électroménager en sus selon votre sélection." },
  { a: "Dressing sur mesure", p: "dès 2 400 €", n: "Toute hauteur, aménagements intérieurs et pose comprise." },
  { a: "Bibliothèque / meuble TV", p: "dès 1 900 €", n: "Sur mesure au millimètre, dans l'essence de votre choix." },
  { a: "Étude & plans 3D", p: "offerte", n: "Déduite intégralement à la commande. Facturée 290 € si le projet ne se fait pas — remboursée si vous commandez." },
];
let TARIFS = TARIFS_DEMO;

function AVIS_SOURCE_LIVE() {
  return [
    { texte: "Le devis ferme change tout : pas une ligne n'a bougé entre la signature et la facture. La cuisine a été posée en deux jours et demi, plan céramique ajusté au millimètre autour d'un mur qui n'était pas droit.", auteur: "Camille & Hugo T.", detail: "Cuisine îlot, " + (clientCity(sessionData) ?? "Lyon") },
    { texte: "Troisième cuisiniste consulté, le seul qui a parlé de notre façon de cuisiner avant de parler catalogue. Le dressing assorti posé six mois plus tard est parfait.", auteur: "Nathalie B.", detail: "Cuisine + dressing" },
    { texte: "Un caisson est arrivé rayé — remplacé sous huit jours sans discussion, le poseur est revenu un samedi. C'est là qu'on juge une maison sérieuse.", auteur: "Famille Roussel", detail: "Agencement complet" },
  ];
}
let AVIS_SOURCE = AVIS_SOURCE_LIVE();
let AVIS_DEMO = AVIS_SOURCE;

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 28 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

/** Kicker filé : 40×1 px dégradé, capitales Manrope, interlettrage 0.34em. */
function Kicker({ children, color = C.accent, align = "left" }: { children: React.ReactNode; color?: string; align?: "left" | "center" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: align === "center" ? "center" : "flex-start" }}>
      <span aria-hidden style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${color})`, display: "inline-block", opacity: 0.8 }} />
      <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, letterSpacing: "0.34em", textTransform: "uppercase", color }}>{children}</span>
      {align === "center" && (
        <span aria-hidden style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${color}, transparent)`, display: "inline-block", opacity: 0.8 }} />
      )}
    </div>
  );
}

/** La règle millimétrée : un filet gradué, le motif CSS du métier. */
function Regle({ vertical = false }: { vertical?: boolean }) {
  return (
    <span
      aria-hidden
      style={
        vertical
          ? { display: "block", width: 7, alignSelf: "stretch", backgroundImage: `repeating-linear-gradient(to bottom, ${C.oak} 0 1px, transparent 1px 8px), repeating-linear-gradient(to bottom, ${C.oak} 0 1px, transparent 1px 40px)`, backgroundSize: "4px 100%, 7px 100%", backgroundRepeat: "repeat-y, repeat-y", opacity: 0.55 }
          : { display: "block", height: 7, backgroundImage: `repeating-linear-gradient(to right, ${C.oak} 0 1px, transparent 1px 8px), repeating-linear-gradient(to right, ${C.oak} 0 1px, transparent 1px 40px)`, backgroundSize: "100% 4px, 100% 7px", backgroundRepeat: "repeat-x, repeat-x", backgroundPosition: "bottom, bottom", opacity: 0.55 }
      }
    />
  );
}

function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || fallback;
}

/* ── Lien de nav : soulignement en largeur qui pousse ──────────────────────── */
function NavLink({ l, h, dark }: { l: string; h: string; dark: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={h}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        color: dark ? (hov ? C.ink : C.textMuted) : hov ? "#fff" : "rgba(255,255,255,0.82)",
        fontFamily: SANS,
        fontSize: 12.5,
        fontWeight: 600,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        textDecoration: "none",
        padding: "12px 4px",
        transition: `color .45s ${EASE_CSS}`,
      }}
    >
      {l}
      <span aria-hidden style={{ position: "absolute", left: 4, bottom: 8, height: 1, width: hov ? "calc(100% - 8px)" : "0%", background: C.oak, transition: `width .5s ${EASE_CSS}` }} />
    </a>
  );
}

/* ── Bouton : élévation + double ombre + flèche qui avance ────────────────── */
function CtaButton({ href, children, ghost = false, onDark = false }: { href: string; children: React.ReactNode; ghost?: boolean; onDark?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        background: ghost
          ? onDark
            ? hov ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.09)"
            : hov ? C.bgCard : "transparent"
          : C.accent,
        color: ghost ? (onDark ? "#fff" : C.ink) : C.white,
        border: ghost ? `1px solid ${onDark ? "rgba(255,255,255,0.28)" : hov ? C.accent : C.border}` : `1px solid transparent`,
        borderRadius: 6,
        padding: ghost ? "13px 26px" : "15px 30px",
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 14,
        letterSpacing: "0.05em",
        textDecoration: "none",
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: ghost
          ? "none"
          : hov
            ? "0 4px 12px rgba(164,85,46,0.28), 0 22px 52px -16px rgba(164,85,46,0.55)"
            : "0 2px 6px rgba(164,85,46,0.18), 0 10px 30px -14px rgba(164,85,46,0.45)",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      {children}
      <ArrowRight size={15} style={{ transform: hov ? "translateX(4px)" : "none", transition: `transform .5s ${EASE_CSS}` }} />
    </a>
  );
}

/* ── Rangée éditoriale numérotée d'une prestation ──────────────────────────── */
function PrestationRangee({ p, idx }: { p: any; idx: number }) {
  const [hov, setHov] = useState(false);
  return (
    <Reveal delay={Math.min(idx * 0.05, 0.2)} y={20}>
      <article
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        className="i327-prestarow"
        style={{
          display: "grid",
          gridTemplateColumns: "clamp(48px, 6vw, 84px) minmax(0,0.9fr) minmax(0,1.4fr)",
          gap: "10px clamp(16px, 3vw, 40px)",
          alignItems: "baseline",
          padding: "clamp(20px, 2.8vw, 32px) clamp(8px, 1.4vw, 16px)",
          paddingLeft: hov ? "clamp(16px, 2.2vw, 28px)" : "clamp(8px, 1.4vw, 16px)",
          background: hov ? C.bgCard : "transparent",
          borderTop: `1px solid ${C.border}`,
          boxShadow: hov ? "0 2px 8px rgba(30,24,18,0.05), 0 22px 48px -26px rgba(164,85,46,0.35)" : "none",
          transition: `all .55s ${EASE_CSS}`,
          position: "relative",
        }}
      >
        <span aria-hidden style={{ position: "absolute", top: -1, left: 0, height: 1, width: hov ? "100%" : "0%", background: `linear-gradient(90deg, ${C.accent}, transparent)`, transition: `width .6s ${EASE_CSS}` }} />
        <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(24px, 2.6vw, 34px)", color: hov ? C.accent : C.oak, lineHeight: 1, transition: `color .45s ${EASE_CSS}` }}>{String(idx + 1).padStart(2, "0")}</span>
        <div>
          <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: hov ? C.accentDark : C.textFaint, transition: `color .45s ${EASE_CSS}` }}>{p.tag}</span>
          <h3 style={{ fontFamily: SERIF, fontSize: "clamp(20px, 2.2vw, 27px)", fontWeight: 500, color: C.ink, lineHeight: 1.15, margin: "8px 0 0", letterSpacing: "-0.005em" }}>{p.titre}</h3>
        </div>
        <p style={{ fontFamily: SANS, fontWeight: 400, fontSize: 14.5, color: C.textMuted, lineHeight: 1.72, margin: 0 }}>{p.desc}</p>
      </article>
    </Reveal>
  );
}

/* ── Bande de tarif, règle millimétrée au bord ─────────────────────────────── */
function TarifBande({ t, idx }: { t: any; idx: number }) {
  const [hov, setHov] = useState(false);
  return (
    <Reveal delay={idx * 0.06} y={16}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: "flex",
          alignItems: "stretch",
          background: C.bgCard,
          border: `1px solid ${hov ? "rgba(164,85,46,0.40)" : C.border}`,
          borderRadius: 8,
          overflow: "hidden",
          marginBottom: 12,
          transform: hov ? "translateY(-3px)" : "none",
          boxShadow: hov
            ? "0 3px 10px rgba(30,24,18,0.07), 0 24px 54px -24px rgba(164,85,46,0.38)"
            : "0 1px 4px rgba(30,24,18,0.04)",
          transition: `all .5s ${EASE_CSS}`,
        }}
      >
        <Regle vertical />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "space-between", alignItems: "baseline", padding: "clamp(18px, 2.2vw, 24px) clamp(18px, 2.4vw, 26px)", flex: 1, minWidth: 0 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: SERIF, fontSize: "clamp(17px, 1.8vw, 20px)", fontWeight: 500, color: hov ? C.accentDark : C.ink, transition: `color .45s ${EASE_CSS}` }}>{t.a}</div>
            <div style={{ fontFamily: SANS, fontWeight: 400, fontSize: 13.5, color: C.textMuted, marginTop: 5, lineHeight: 1.62, maxWidth: 560 }}>{t.n}</div>
          </div>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(18px, 2vw, 22px)", color: C.accentDark, whiteSpace: "nowrap" }}>{t.p}</div>
        </div>
      </div>
    </Reveal>
  );
}

/* ── Carte d'avis, fond sombre veiné ───────────────────────────────────────── */
function AvisCarte({ a, idx }: { a: any; idx: number }) {
  const [hov, setHov] = useState(false);
  return (
    <Reveal delay={idx * 0.1}>
      <figure
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          position: "relative",
          background: hov ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${hov ? "rgba(201,159,106,0.35)" : "rgba(255,255,255,0.08)"}`,
          borderRadius: 10,
          padding: "clamp(24px, 3vw, 32px) clamp(22px, 2.6vw, 28px)",
          height: "100%",
          margin: 0,
          boxSizing: "border-box",
          transform: hov ? "translateY(-5px)" : "none",
          boxShadow: hov ? "0 4px 14px rgba(0,0,0,0.28), 0 28px 60px -26px rgba(0,0,0,0.55)" : "none",
          transition: `all .55s ${EASE_CSS}`,
          overflow: "hidden",
        }}
      >
        <span aria-hidden style={{ position: "absolute", top: -16, right: 8, fontFamily: SERIF, fontStyle: "italic", fontSize: 110, lineHeight: 1, color: "rgba(201,159,106,0.09)", pointerEvents: "none", userSelect: "none" }}>”</span>
        <div style={{ display: "flex", gap: 3, marginBottom: 13 }} aria-label="5 étoiles">
          {[...Array(5)].map((_, j) => <Star key={j} size={13} fill={C.oak} color={C.oak} strokeWidth={0} />)}
        </div>
        <blockquote style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(15px, 1.5vw, 17px)", color: "rgba(255,255,255,0.80)", lineHeight: 1.72, margin: "0 0 20px" }}>
          "{a.texte}"
        </blockquote>
        <figcaption style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14 }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, color: "#fff", fontSize: 14 }}>{a.auteur}</div>
          <div style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: C.oak, marginTop: 5 }}>{a.detail}</div>
        </figcaption>
      </figure>
    </Reveal>
  );
}

/* ── La séquence d'atelier — trois couches, un seul index ──────────────────── */
function AtelierSequence() {
  const { i, go, next, prev } = useSlides(ATELIER_PHASES.length, DWELL.slow);
  const phase = ATELIER_PHASES[i];
  return (
    <section id="atelier" style={{ height: "100dvh", minHeight: 620, position: "relative", overflow: "hidden", background: C.bgDark }}>
      {/* Repli veiné : la scène reste un décor de bois si les photos sont bloquées */}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: VEINAGE }} />
      {/* Couche 1 — la photo, en fondu long */}
      {ATELIER_PHASES.map((p, n) => (
        <motion.div
          key={p.index}
          aria-hidden={n !== i}
          initial={false}
          animate={{ opacity: n === i ? 1 : 0, scale: n === i ? 1 : 1.06 }}
          transition={{ duration: 1.2, ease: EASE }}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <img src={photo(5 + n, p.img)} alt={p.alt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </motion.div>
      ))}
      {/* Couche 2 — le voile, à trois arrêts */}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(25,20,16,0.40) 0%, rgba(25,20,16,0.12) 38%, rgba(25,20,16,0.72) 100%)" }} />
      {/* Couche 3 — la légende, chiffre romain fantôme au-dessus */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24, transition: { duration: 0.4, ease: EASE } }}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 clamp(24px, 6vw, 80px)" }}
        >
          <span aria-hidden style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(40px, 8vw, 110px)", color: "rgba(201,159,106,0.32)", lineHeight: 1, marginBottom: 6, display: "block", userSelect: "none" }}>{phase.index}</span>
          <h3 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 5vw, 68px)", fontWeight: 600, letterSpacing: "0.18em", color: C.bg, lineHeight: 1, margin: "0 0 20px", textTransform: "uppercase", textShadow: "0 8px 40px rgba(0,0,0,0.6)" }}>{phase.title}</h3>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(15px, 1.7vw, 20px)", color: "rgba(250,248,244,0.85)", maxWidth: 460, lineHeight: 1.68, margin: 0 }}>{phase.body}</p>
        </motion.div>
      </AnimatePresence>
      {/* Étiquette de section */}
      <div style={{ position: "absolute", top: "clamp(24px, 4vw, 48px)", left: "clamp(24px, 5vw, 64px)", zIndex: 4 }}>
        <Kicker color="rgba(250,248,244,0.6)">{/* TEXTE_SECTION */ clientText(sessionData, "atelier.titre") ?? "L'atelier, en trois temps"}</Kicker>
      </div>
      {/* Pilotage : index + flèches fines, un seul index pour les trois couches */}
      <div style={{ position: "absolute", bottom: "clamp(28px, 5vh, 48px)", left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 22, zIndex: 4 }}>
        <SlideIndex i={i} total={ATELIER_PHASES.length} variant="fraction" color="rgba(250,248,244,0.85)" className="" />
        <div style={{ display: "flex", gap: 10 }}>
          {ATELIER_PHASES.map((p, n) => (
            <button key={p.index} onClick={() => go(n)} aria-label={`Temps ${p.index}`} style={{ width: n === i ? 34 : 12, height: 2, background: n === i ? C.oak : "rgba(250,248,244,0.35)", border: "none", cursor: "pointer", padding: 0, transition: `all .6s ${EASE_CSS}` }} />
          ))}
        </div>
        <HairlineArrows onPrev={prev} onNext={next} color="#fff" className="" />
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════════════════ */
export default function LignesEtBoisPage() {
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
  HERO_PROJETS_DEMO = HERO_PROJETS_DEMO_LIVE();
  ATELIER_PHASES = ATELIER_PHASES_LIVE();
  AVIS_SOURCE = AVIS_SOURCE_LIVE();

  PRESTATIONS_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({ ...PRESTATIONS_SOURCE[i % PRESTATIONS_SOURCE.length], titre: s.title })),
    PRESTATIONS_SOURCE,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({ ...AVIS_SOURCE[i % AVIS_SOURCE.length], auteur: r.author, texte: r.text })),
    AVIS_SOURCE,
  );
  HERO_PROJETS = HERO_PROJETS_DEMO.map((row, i) => ({
    ...row,
    img: clientPhotos(sessionData)[0 + i] || row.img,
  }));
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s, i) => ({ ...TARIFS_DEMO[i % TARIFS_DEMO.length], a: s.title, p: s.price ?? TARIFS_DEMO[i % TARIFS_DEMO.length].p, n: s.desc || TARIFS_DEMO[i % TARIFS_DEMO.length].n })),
    TARIFS_DEMO,
  );
  STATS = resolveList(clientStats(sessionData), STATS_DEMO);
  ENGAGEMENT = resolveList(clientCertifications(sessionData), ENGAGEMENT_DEMO);
  brand = fd?.brandColor ?? null;
  if (brand) {
    C = { ...C, accent: brand };
  }

  const PRESTATIONS = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      titre: s.title ?? PRESTATIONS_DEMO[i % PRESTATIONS_DEMO.length].titre,
      desc: s.description ?? PRESTATIONS_DEMO[i % PRESTATIONS_DEMO.length].desc,
      tag: PRESTATIONS_DEMO[i % PRESTATIONS_DEMO.length].tag,
    })),
    PRESTATIONS_DEMO
  );
  const AVIS = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      texte: r.text ?? AVIS_DEMO[i % AVIS_DEMO.length].texte,
      auteur: r.name ?? AVIS_DEMO[i % AVIS_DEMO.length].auteur,
      detail: r.location ?? AVIS_DEMO[i % AVIS_DEMO.length].detail,
    })),
    AVIS_DEMO
  );

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { i, next, prev } = useSlides(HERO_PROJETS.length, DWELL.normal);
  const projet = HERO_PROJETS[i];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = clientPhone(sessionData) ?? "04 72 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? "+33472000000").replace(/[^+\d]/g, "")}`;
  const mail = clientEmail(sessionData) ?? "contact@lignes-et-bois.fr";

  return (
    <div style={{ background: C.bg, fontFamily: SANS, overflowX: "clip" }}>
      <style>{FONTS_CSS}</style>
      <style>{`
        @media (max-width: 900px) { #i327-nav { display: none !important; } .i327-burger { display: flex !important; } }
        @media (max-width: 860px) {
          .i327-split { grid-template-columns: 1fr !important; }
          .i327-split > * { order: initial !important; }
          .i327-stats { grid-template-columns: 1fr 1fr !important; row-gap: 8px; }
          .i327-stats .i327-statcell { border-right: none !important; }
          .i327-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i327-herotext { padding: 0 24px 44px !important; }
          .i327-prestarow { grid-template-columns: clamp(40px, 10vw, 56px) 1fr !important; }
          .i327-prestarow > p { grid-column: 2; }
        }
        @media (prefers-reduced-motion: reduce) {
          .i327-root * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
        }
      `}</style>

      {/* ── NAV — collante à 4 propriétés : fond, hauteur, filet, ombre ──── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: scrolled ? 64 : 76,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(24px, 4vw, 48px)",
          background: scrolled ? "rgba(250,248,244,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          boxShadow: scrolled ? "0 10px 34px -22px rgba(30,24,18,0.35)" : "none",
          transition: `all .55s ${EASE_CSS}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Ruler size={18} color={scrolled ? C.accent : C.oak} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 500, color: scrolled ? C.ink : "#fff", letterSpacing: "0.01em", transition: `color .45s ${EASE_CSS}`, whiteSpace: "nowrap" }}>{fd?.businessName ?? (<>Lignes <em>& Bois</em></>)}</span>
              <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: scrolled ? C.textMuted : "rgba(255,255,255,0.6)", marginLeft: 6, transition: `color .45s ${EASE_CSS}` }}>{clientTrade(sessionData) ?? "Cuisiniste"}</span>
            </>
          )}
        </div>
        <div id="i327-nav" style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <NavLink key={l} l={l} h={h} dark={scrolled} />
          ))}
          <CtaButton href={telHref}>Étude 3D offerte</CtaButton>
        </div>
        <button className="i327-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
          <span style={{ display: "block", width: 24, height: 1.5, background: scrolled ? C.ink : "#fff", transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: scrolled ? C.ink : "#fff", transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: scrolled ? C.ink : "#fff", transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 99, background: "rgba(255,255,255,0.98)", borderBottom: `1px solid ${C.border}`, padding: "20px 28px", display: "flex", flexDirection: "column", gap: 4, backdropFilter: "blur(12px)" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ color: C.ink, fontFamily: SANS, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "12px 0" }}>{l}</a>
          ))}
          <a href={telHref} style={{ background: C.accent, color: C.white, borderRadius: 6, padding: "13px 24px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 8 }}>Étude 3D offerte</a>
        </div>
      )}

      {/* ── HERO — ExpandFrame plein cadre, repli veiné bgDark ──────────── */}
      <section id="hero" className="i327-root" style={{ height: "100dvh", minHeight: 640, position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden", background: C.bgDark }}>
        {/* Le repli : un veinage CSS sous le geste — la scène reste un décor
            de bois si les photos ne chargent pas. background C.bgDark garanti. */}
        <div aria-hidden style={{ position: "absolute", inset: 0, background: VEINAGE }} />
        {/* Le plan qui devient la pièce : le projet courant se déploie depuis
            un cadre resserré jusqu'au plein écran. ExpandFrame code sa position
            en inline (relative) : on l'étire via un wrapper absolu, jamais en
            lui passant absolute inset-0 (boîte de hauteur nulle sinon). */}
        <div style={{ position: "absolute", inset: 0 }}>
          <ExpandFrame src={photo(i, projet.img)} alt={projet.alt} index={i} className="w-full h-full" radius={0} />
        </div>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(18,14,10,0.94) 0%, rgba(18,14,10,0.42) 44%, rgba(18,14,10,0.10) 78%, rgba(18,14,10,0.22) 100%)", pointerEvents: "none" }} />
        <div className="i327-herotext" style={{ position: "relative", zIndex: 1, padding: "0 clamp(24px, 5vw, 72px) clamp(48px, 8vh, 80px)", maxWidth: 880 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>
            <Kicker color={C.oak}>{clientEyebrow(sessionData) ?? <>Cuisines & agencement sur mesure · {clientCity(sessionData) ?? "Lyon"}</>}</Kicker>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 44 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.95, ease: EASE }}
            style={{ fontFamily: SERIF, fontSize: "clamp(38px, 5.4vw, 72px)", fontWeight: 500, color: "#fff", lineHeight: 1.0, letterSpacing: "-0.015em", margin: "clamp(14px, 2vw, 20px) 0 clamp(16px, 2.2vw, 22px)", textShadow: "0 10px 44px rgba(0,0,0,0.5)" }}
          >{/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ?? (<>
            {c?.heroHeadline ?? (<>{clientHeroLine(sessionData, 0, 2, 19) ?? "Du plan 3D"}<br /><em style={{ color: C.oak, fontWeight: 400 }}>{clientHeroLine(sessionData, 1, 2, 19) ?? "à la pièce à vivre."}</em></>)}
          </>)}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.85, ease: EASE }} style={{ fontFamily: SANS, fontWeight: 400, fontSize: "clamp(15.5px, 1.6vw, 17.5px)", color: "rgba(255,255,255,0.78)", lineHeight: 1.75, marginBottom: "clamp(24px, 3.6vw, 36px)", maxWidth: 520 }}>
            {clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? "Cuisines, dressings et agencements dessinés au millimètre, fabriqués en France, posés par nos menuisiers salariés. Devis ferme, garantie 10 ans."}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.85, ease: EASE }} style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <CtaButton href={telHref}>Réserver mon étude 3D</CtaButton>
            <CtaButton href="#prestations" ghost onDark>Nos prestations</CtaButton>
          </motion.div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: "clamp(28px, 5vh, 44px)", flexWrap: "wrap" }}>
            <SlideIndex i={i} total={HERO_PROJETS.length} variant="fraction" color="rgba(255,255,255,0.85)" className="" />
            <span style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 400, color: "rgba(255,255,255,0.75)" }}>
              <strong style={{ color: "#fff", fontWeight: 700 }}>{projet.k}</strong> — {projet.sub}
            </span>
            <HairlineArrows onPrev={prev} onNext={next} color="#fff" className="" />
          </div>
        </div>
      </section>

      {/* ── RESPIRATION — une phrase, une règle millimétrée ─────────────── */}
      <section className="i327-pad" style={{ background: C.bgAlt, padding: "clamp(72px, 10vw, 136px) clamp(24px, 8vw, 120px)", textAlign: "center" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
            <Kicker align="center" color={C.textMuted}>La maison</Kicker>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(22px, 3vw, 40px)", fontWeight: 400, lineHeight: 1.38, letterSpacing: "-0.005em", maxWidth: 840, margin: "0 auto", color: C.ink }}>{/* TEXTE_SECTION */ clientText(sessionData, "respiration.texte") ?? (<>
            Le sur-mesure commence là où le catalogue s'arrête : au millimètre près.
          </>)}</p>
        </Reveal>
        <Reveal delay={0.2}>
          <div style={{ maxWidth: 220, margin: "clamp(34px, 5vw, 52px) auto 0" }}>
            <Regle />
          </div>
        </Reveal>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ background: C.bgDark, position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(70% 130% at 50% 0%, rgba(201,159,106,0.09), transparent 60%)", pointerEvents: "none" }} />
        <div className="i327-stats i327-pad" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1100, margin: "0 auto", padding: "0 32px", position: "relative" }}>
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 0.08}>
              <div className="i327-statcell" style={{ padding: "clamp(24px, 3.2vw, 38px) 8px", textAlign: "center", borderRight: idx < 3 ? "1px solid rgba(201,159,106,0.16)" : "none" }}>
                <div style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3vw, 38px)", fontWeight: 500, color: C.oak, lineHeight: 1, letterSpacing: "-0.01em" }}>{s.value}</div>
                <div style={{ fontFamily: SANS, fontSize: 12, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.42)", marginTop: 8 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PRESTATIONS — rangées éditoriales numérotées ────────────────── */}
      <section id="prestations" className="i327-pad" style={{ padding: "clamp(80px, 10vw, 130px) clamp(24px, 5vw, 64px)", background: C.bg, position: "relative", overflow: "hidden" }}>
        {/* Cote fantôme : la mesure du métier en filigrane */}
        <span aria-hidden style={{ position: "absolute", top: "-0.06em", right: "2%", fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(120px, 16vw, 240px)", lineHeight: 1, color: "rgba(164,85,46,0.05)", pointerEvents: "none", userSelect: "none" }}>19mm</span>
        <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(34px, 5vw, 56px)" }}>
              <Kicker>Prestations</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4vw, 54px)", fontWeight: 500, color: C.ink, marginTop: 16, lineHeight: 1.06, letterSpacing: "-0.01em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "prestations.titre") ?? (<>
                Toute la maison,<br /><em style={{ color: C.accent, fontWeight: 400 }}>au millimètre.</em>
              </>)}</h2>
            </div>
          </Reveal>
          <div>
            {PRESTATIONS.map((p, idx) => (
              <PrestationRangee key={p.titre} p={p} idx={idx} />
            ))}
            <div aria-hidden style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.border} 12%, ${C.border} 88%, transparent)` }} />
          </div>
        </div>
      </section>

      {/* ── L'ATELIER — séquence à trois couches ────────────────────────── */}
      <AtelierSequence />

      {/* ── MÉTHODE ─────────────────────────────────────────────────────── */}
      <section id="methode" className="i327-pad" style={{ padding: "clamp(80px, 10vw, 130px) clamp(24px, 5vw, 64px)", background: C.bgAlt }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(34px, 5vw, 56px)" }}>
              <Kicker>La méthode</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 500, color: C.ink, marginTop: 16, lineHeight: 1.06, letterSpacing: "-0.01em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (<>
                Quatre étapes,<br /><em style={{ color: C.accent, fontWeight: 400 }}>un devis qui ne bouge pas.</em>
              </>)}</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: "clamp(14px, 2vw, 20px)" }}>
            {METHODE.map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.08}>
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: "clamp(22px, 2.8vw, 30px) clamp(20px, 2.6vw, 26px)", height: "100%", boxSizing: "border-box", position: "relative", overflow: "hidden" }}>
                  <span aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.accent}, transparent ${30 + idx * 20}%)`, opacity: 0.7 }} />
                  <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(26px, 2.8vw, 34px)", color: C.oak, marginBottom: 12, lineHeight: 1 }}>{m.n}</div>
                  <h3 style={{ fontFamily: SANS, fontSize: 16.5, fontWeight: 700, color: C.ink, marginBottom: 9, letterSpacing: "0.01em" }}>{m.t}</h3>
                  <p style={{ fontFamily: SANS, fontWeight: 400, fontSize: 14, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>{m.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENTS + photo ─────────────────────────────────────────── */}
      <section className="i327-pad" style={{ padding: "clamp(80px, 10vw, 130px) clamp(24px, 5vw, 64px)", background: C.bg }}>
        <div className="i327-split" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(36px, 6vw, 72px)", alignItems: "center" }}>
          <Reveal>
            <div style={{ position: "relative", padding: "0 14px 14px 0" }}>
              <span aria-hidden style={{ position: "absolute", top: 14, left: 14, right: 0, bottom: 0, border: `1px solid ${C.oak}`, borderRadius: 10, opacity: 0.55, pointerEvents: "none" }} />
              <img src={photo(4, "https://images.pexels.com/photos/7546654/pexels-photo-7546654.jpeg?auto=compress&cs=tinysrgb&w=1600")} alt="Menuisier ajustant une façade à l'atelier" loading="lazy" style={{ width: "100%", borderRadius: 10, aspectRatio: "4/3", objectFit: "cover", display: "block", position: "relative", boxShadow: "0 22px 56px -26px rgba(30,24,18,0.4)" }} />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <Kicker>Nos engagements</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3.2vw, 46px)", fontWeight: 500, color: C.ink, margin: "16px 0 18px", lineHeight: 1.06, letterSpacing: "-0.01em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-5.titre") ?? (<>
                Le sur-mesure,<br /><em style={{ color: C.accent, fontWeight: 400 }}>sans les surprises.</em>
              </>)}</h2>
              {ENGAGEMENT.map((e, idx) => (
                <div key={idx} style={{ display: "flex", gap: 12, padding: "12px 0", borderTop: idx === 0 ? "none" : `1px solid ${C.border}` }}>
                  <CheckCircle size={17} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontFamily: SANS, fontWeight: 400, fontSize: 15, color: C.textMuted, lineHeight: 1.65 }}>{e}</span>
                </div>
              ))}
              <div style={{ marginTop: 24 }}>
                <CtaButton href={telHref}>Parler de votre projet</CtaButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TARIFS — bandes à la règle millimétrée ──────────────────────── */}
      <section id="tarifs" className="i327-pad" style={{ padding: "clamp(80px, 10vw, 130px) clamp(24px, 5vw, 64px)", background: C.bgAlt }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "clamp(28px, 4vw, 44px)" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Kicker align="center">Tarifs</Kicker>
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 3.8vw, 50px)", fontWeight: 500, color: C.ink, marginTop: 14, lineHeight: 1.06, letterSpacing: "-0.01em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Des prix <em style={{ color: C.accent, fontWeight: 400 }}>fermes.</em></>)}</h2>
              <p style={{ fontFamily: SANS, fontWeight: 400, fontSize: 15, color: C.textMuted, maxWidth: 540, margin: "16px auto 0", lineHeight: 1.72 }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.intro") ?? (<>
                Le prix signé est le prix payé : le devis est ferme, poste par poste, jamais « à partir de ».
              </>)}</p>
            </div>
          </Reveal>
          {TARIFS.map((t, idx) => (
            <TarifBande key={t.a} t={t} idx={idx} />
          ))}
        </div>
      </section>

      {/* ── AVIS ────────────────────────────────────────────────────────── */}
      <section className="i327-pad" style={{ padding: "clamp(80px, 10vw, 130px) clamp(24px, 5vw, 64px)", background: C.bgDark, position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: VEINAGE, opacity: 0.5 }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 90% at 50% 100%, rgba(201,159,106,0.08), transparent 60%)", pointerEvents: "none" }} />
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "clamp(34px, 5vw, 54px)", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <Kicker align="center" color={C.oak}>Ils témoignent</Kicker>
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3.6vw, 48px)", fontWeight: 500, color: "#fff", lineHeight: 1.06, letterSpacing: "-0.01em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-7.titre") ?? (<>
              Ils cuisinent <em style={{ color: C.oak, fontWeight: 400 }}>dans nos réalisations</em>.
            </>)}</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: "clamp(14px, 2vw, 22px)", maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          {AVIS.map((a, idx) => (
            <AvisCarte key={a.auteur} a={a} idx={idx} />
          ))}
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section id="contact" className="i327-pad" style={{ padding: "clamp(88px, 11vw, 140px) clamp(24px, 5vw, 64px)", background: C.oakLight, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <span aria-hidden style={{ position: "absolute", bottom: "-0.1em", left: "2%", fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(130px, 18vw, 250px)", lineHeight: 1, color: "rgba(164,85,46,0.06)", pointerEvents: "none", userSelect: "none" }}>3D</span>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Kicker align="center">Étude offerte</Kicker>
          </div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4.2vw, 54px)", fontWeight: 500, color: C.ink, margin: "18px 0 16px", lineHeight: 1.06, letterSpacing: "-0.01em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
            Et si on dessinait<br /><em style={{ color: C.accent, fontWeight: 400 }}>votre cuisine ?</em>
          </>)}</h2>
          <p style={{ fontFamily: SANS, fontWeight: 400, fontSize: 16, color: C.textMuted, maxWidth: 440, margin: "0 auto clamp(28px, 4vw, 40px)", lineHeight: 1.72 }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ?? (<>
            Relevé à domicile et plans 3D offerts, déduits à la commande. Showroom sur rendez-vous.
          </>)}</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <CtaButton href={telHref}><Phone size={17} /> {phone}</CtaButton>
            <CtaButton href={`mailto:${mail}`} ghost><Mail size={17} /> Écrire</CtaButton>
          </div>
          {clientAddress(sessionData) && (
            <p style={{ fontFamily: SANS, fontWeight: 400, fontSize: 14, color: C.textMuted, marginTop: 26, display: "inline-flex", alignItems: "center", gap: 8 }}>
              <MapPin size={14} color={C.accentDark} /> {clientAddress(sessionData)}
            </p>
          )}
        </Reveal>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="i327-pad" style={{ background: C.bgDarkAlt, padding: "clamp(44px, 6vw, 64px) clamp(24px, 5vw, 64px) 22px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 30 }}>
            <div>
              <div style={{ fontFamily: SERIF, fontSize: 19, fontStyle: "italic", fontWeight: 500, color: C.oak, marginBottom: 8 }}>{fd?.businessName ?? "Lignes & Bois"}</div>
              <p style={{ fontFamily: SANS, fontWeight: 300, color: "rgba(255,255,255,0.32)", fontSize: 13, lineHeight: 1.7 }}>
                {clientTrade(sessionData) ?? "Cuisiniste"} · Agencement sur mesure · {clientCity(sessionData) ?? "Lyon"}<br />Fabrication française, pose par menuisiers salariés
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { icon: <MapPin size={13} />, t: clientCodePostalVille(sessionData, "69000", "Lyon") },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Mail size={13} />, t: mail },
                { icon: <Clock size={13} />, t: "Showroom sur RDV — Mar–Sam 9h–19h" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.38)", fontFamily: SANS, fontWeight: 300, fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.oak }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
          <div aria-hidden style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(201,159,106,0.28), transparent)" }} />
          <div style={{ paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontFamily: SANS, fontWeight: 300, color: "rgba(255,255,255,0.22)", fontSize: 12, letterSpacing: "0.04em" }}>
              © 2026 {fd?.businessName ?? "Lignes & Bois"} — Site réalisé par {clientName(sessionData) ?? "Aevia WS"} · SIREN {/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}<LegalIdentity fallback="852 546 225" kind="siren" />
            </span>
            <span style={{ fontFamily: SANS, fontWeight: 300, color: "rgba(255,255,255,0.22)", fontSize: 12, letterSpacing: "0.04em" }}>Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
