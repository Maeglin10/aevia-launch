"use client";
// @ts-nocheck

/* ════════════════════════════════════════════════════════════════════════════
   {clientName(sessionData) ?? "Studio Culina"} — Cuisiniste de montagne · Annecy
   ─────────────────────────────────────────────────────────────────────────────
   Cuisiniste, 2e variante du catalogue (la 1re est impact-327, ExpandFrame).
   Celle-ci est un studio-showroom de montagne.

   Geste signature : PanelDrop — le panneau descend comme une façade qu'on pose
   sur un caisson. Verticale, jamais horizontale : c'est le geste de l'atelier.

   Archétype héros : H2 — média À GAUCHE, texte à droite. Le seul du lot à
   ouvrir par la matière plutôt que par la parole.

   Fontes : P8 — Newsreader (titres, serif de presse) × Manrope (texte, sans).

   Signature visuelle : le NUANCIER. Les matières citées au devis — chêne
   brossé, bois de bout, céramique, granit, quartz, stratifié — dessinées en
   CSS, sans une seule image. Prestations en rangées éditoriales numérotées,
   tarifs en table fine à conducteur pointillé, avis en spotlight rotatif.
   ════════════════════════════════════════════════════════════════════════════ */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone, Ruler } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, useSlides } from "@/lib/templates/hero-kit-2";
import { PanelDrop } from "@/lib/templates/hero-kit-3";
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
  bg: "#f8f5ef",
  bgAlt: "#efe7d9",
  bgDark: "#1f1a13",
  bgDarkAlt: "#15110b",
  bgCard: "#ffffff",
  accent: "var(--brand, #7d5a3c)",
  accentDark: "var(--brand-light, #5c412a)",
  accentLight: "#efe1cd",
  ink: "#211b12",
  textMuted: "#6b6152",
  textFaint: "#9b9184",
  border: "#e3d9c6",
  white: "#ffffff",
  /* clé métier : la veine, le seul ton chaud qui n'est pas la marque */
  veine: "#b98d55",
};

const SERIF = "'Newsreader', Georgia, serif";
const SANS = "'Manrope', system-ui, -apple-system, sans-serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_CSS = "cubic-bezier(.16,1,.3,1)";

const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400&family=Manrope:wght@300;400;500;600;700&display=swap');`;

const NAV = [
  { l: "Le nuancier", h: "#nuancier" },
  { l: "Prestations", h: "#services" },
  { l: "La méthode", h: "#methode" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* ── Données de démonstration ────────────────────────────────────────────── */

function HERO_SOURCE_LIVE() {
  return [
    {
      k: "Façades chêne brossé",
      line: "Le bois qui se patine avec la maison.",
      sub: "Massif ou plaqué, huilé à cœur.",
      img: "https://images.pexels.com/photos/7546654/pexels-photo-7546654.jpeg?auto=compress&cs=tinysrgb&w=1600",
      alt: "Façades bois et plan de travail",
    },
    {
      k: "Îlot central",
      line: "Le point de gravité de la maison.",
      sub: "Plans céramique, granit ou bois de bout.",
      img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      alt: "Pièce à vivre avec agencement sur mesure",
    },
    {
      k: "De l'atelier au mur",
      line: "Chaque caisson ajusté avant de partir.",
      sub: "Contrôle qualité en atelier, pose en 2 jours.",
      img: "https://images.pexels.com/photos/6969818/pexels-photo-6969818.jpeg?auto=compress&cs=tinysrgb&w=1600",
      alt: "Atelier de fabrication des caissons",
    },
  ];
}
let HERO_SOURCE = HERO_SOURCE_LIVE();
let HERO = HERO_SOURCE;

/* Le nuancier ne nomme que des matières déjà écrites au devis du thème :
   rien n'est inventé, tout est redessiné en CSS. */
const NUANCIER_SOURCE = [
  { nom: "Chêne brossé", note: "Façades massif ou plaqué, huilées à cœur", fond: "linear-gradient(118deg,#dcbe90 0%,#c39c66 46%,#a97f4b 100%)", veine: "rgba(88,58,24,0.16)", clair: false },
  { nom: "Bois de bout", note: "Plan de travail, veine debout", fond: "linear-gradient(118deg,#c99a63 0%,#a9754a 52%,#875733 100%)", veine: "rgba(56,32,10,0.22)", clair: false },
  { nom: "Céramique", note: "Grand format, plan sans joint", fond: "linear-gradient(118deg,#eeece6 0%,#d3cec4 55%,#b7b1a6 100%)", veine: "rgba(40,38,34,0.10)", clair: true },
  { nom: "Granit", note: "Plan massif, chants adoucis", fond: "linear-gradient(118deg,#5e5b56 0%,#403d39 55%,#2b2926 100%)", veine: "rgba(255,255,255,0.13)", clair: false },
  { nom: "Quartz", note: "Reconstitué, teintes unies", fond: "linear-gradient(118deg,#f3f0ea 0%,#e0dad0 55%,#c8c2b6 100%)", veine: "rgba(60,58,54,0.09)", clair: true },
  { nom: "Stratifié", note: "La ligne linéaire, plan compact", fond: "linear-gradient(118deg,#cdb99e 0%,#b39e82 55%,#96805f 100%)", veine: "rgba(70,48,20,0.14)", clair: false },
];
let NUANCIER = NUANCIER_SOURCE;

const SERVICES_SOURCE = [
  { titre: "Cuisine complète", desc: "Conception, fabrication européenne, pose par nos équipes. Charnières et coulisses garanties à vie, façades au choix du studio.", tag: "Cuisine" },
  { titre: "Îlots & plans", desc: "Céramique, granit, quartz, bois massif. Découpes ajustées sur place au gabarit — même sur murs qui ne sont pas droits.", tag: "Plans" },
  { titre: "Électroménager intégré", desc: "Sélection multi-marques au prix du web, intégrée au projet et livrée-posée avec la cuisine. SAV assuré par le studio.", tag: "Équipement" },
  { titre: "Dressing & rangements", desc: "Chambres, entrées, sous-pentes : les mêmes façades et finitions que votre cuisine, pour une maison cohérente.", tag: "Rangement" },
  { titre: "Buanderie & arrière-cuisine", desc: "La pièce qui rend la cuisine belle : tout ce qui déborde trouve sa place, plomberie et électricité coordonnées.", tag: "Annexe" },
  { titre: "Rénovation coordonnée", desc: "Sols, crédences, éclairage, peinture : nos artisans partenaires interviennent dans le même calendrier, sous notre coordination.", tag: "Travaux" },
];
let SERVICES_DEMO = SERVICES_SOURCE;

let METHODE = [
  { n: "01", t: "Atelier conception — 2 h", d: "Au studio, autour des cuisines témoins. Vos habitudes, vos appareils, votre budget réel — avant tout dessin." },
  { n: "02", t: "Relevé laser & plans", d: "Relevé millimétré chez vous, plans techniques et perspectives réalistes. Trois révisions incluses." },
  { n: "03", t: "Devis ferme signé", d: "Poste par poste, électroménager compris. Aucun avenant surprise : l'imprévu est à notre charge." },
  { n: "04", t: "Pose et réception", d: "Deux jours de pose en moyenne, protection des sols, réception signée pièce par pièce avec liste de réserves à zéro." },
];

const ENGAGEMENT_DEMO = [
  "Devis ferme et définitif — l'imprévu de chantier est à notre charge",
  "Garantie décennale sur la pose, 10 ans sur les caissons, quincaillerie à vie",
  "Un seul interlocuteur du premier rendez-vous à la levée des réserves",
  "Showroom sur rendez-vous : deux heures pour vous, jamais de vente debout",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

const TARIFS_DEMO = [
  { a: "Cuisine linéaire posée", p: "dès 7 900 €", n: "Façades stratifiées, plan compact, électroménager en sus selon sélection." },
  { a: "Cuisine avec îlot", p: "dès 12 900 €", n: "Plan céramique, éclairage sous meubles, prises affleurantes incluses." },
  { a: "Dressing assorti", p: "dès 2 900 €", n: "Toute hauteur, intérieurs modulables, portes assorties aux façades cuisine." },
  { a: "Atelier conception 2 h", p: "offert", n: "Déduit à la commande. Plans remis même si le projet ne se fait pas chez nous." },
];
let TARIFS = TARIFS_DEMO;

function AVIS_SOURCE_LIVE() {
  return [
    {
      texte: "L'atelier de deux heures au studio vaut tous les rendez-vous de cuisinistes classiques. On a parlé petits-déjeuners avant de parler façades. Le résultat est exactement notre maison.",
      auteur: "Claire & Julien V.",
      detail: "Cuisine îlot, " + (clientCity(sessionData) ?? "Annecy") + "-le-Vieux",
    },
    {
      texte: "Mur de 1927 pas droit du tout : le plan céramique a été gabarié sur place, l'ajustement est invisible. Deux jours de pose, zéro réserve à la réception.",
      auteur: "Hélène B.",
      detail: "Rénovation complète",
    },
    {
      texte: "Le devis ferme n'a pas bougé alors qu'un caisson a dû être refabriqué. Studio sérieux, poseurs soigneux, SAV réactif sur un charnière un an après.",
      auteur: "Famille Roche",
      detail: "Cuisine + buanderie",
    },
  ];
}
let AVIS_SOURCE = AVIS_SOURCE_LIVE();
let AVIS_DEMO = AVIS_SOURCE;

const STATS_DEMO = [
  { value: "180+", label: "Cuisines livrées" },
  { value: "3", label: "Cuisines témoins au studio" },
  { value: "2 j", label: "De pose en moyenne" },
  { value: "10 ans", label: "Garantie caissons & pose" },
];
let STATS = STATS_DEMO;

function ZONES_SOURCE_LIVE() {
  const zones = clientAreas(sessionData);
  if (zones?.length) return zones;
  if (clientCity(sessionData)) return [clientCity(sessionData)!, "et alentours"];
  return ["Annecy", "Annecy-le-Vieux", "Haute-Savoie"];
}
let ZONES_SOURCE = ZONES_SOURCE_LIVE();
let ZONES = ZONES_SOURCE;

/* ── Primitives ──────────────────────────────────────────────────────────── */

function Reveal({ children, delay = 0, y = 28, style }: { children: React.ReactNode; delay?: number; y?: number; style?: React.CSSProperties }) {
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

/** Le kicker du thème : filet 40×1 px, puis les capitales filées. */
function Kicker({ children, color = C.accentDark, align = "left" }: { children: React.ReactNode; color?: string; align?: "left" | "center" }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 14, justifyContent: align === "center" ? "center" : "flex-start" }}>
      <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${color})`, flexShrink: 0 }} />
      <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.36em", textTransform: "uppercase", color }}>{children}</span>
      {align === "center" && <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${color}, transparent)`, flexShrink: 0 }} />}
    </span>
  );
}

/** Le chiffre fantôme : la texture sans image du thème. */
function GhostNum({ children, size = "clamp(96px,13vw,190px)", right = false, color = "rgba(125,90,60,0.075)" }: { children: React.ReactNode; size?: string; right?: boolean; color?: string }) {
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        top: "-0.22em",
        left: right ? "auto" : "-0.03em",
        right: right ? "-0.03em" : "auto",
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
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        borderRadius: 2,
        textDecoration: "none",
        border: `1px solid ${filled ? "transparent" : dark ? "rgba(255,255,255,0.32)" : C.border}`,
        background: filled ? (h ? C.accentDark : C.accent) : h ? (dark ? "rgba(255,255,255,0.08)" : C.bgAlt) : dark ? "transparent" : C.white,
        color: filled ? C.white : dark ? "rgba(255,255,255,0.9)" : C.ink,
        boxShadow: h && filled ? "0 16px 34px -18px rgba(31,26,19,0.55), 0 3px 10px -6px rgba(31,26,19,0.4)" : "0 0 0 rgba(0,0,0,0)",
        transform: h ? "translateY(-2px)" : "none",
        transition: `background .5s ${EASE_CSS}, box-shadow .5s ${EASE_CSS}, transform .5s ${EASE_CSS}, border-color .5s ${EASE_CSS}`,
      }}
    >
      {children}
      <ArrowRight size={14} style={{ transform: h ? "translateX(4px)" : "none", transition: `transform .5s ${EASE_CSS}` }} />
    </a>
  );
}

/** Un carreau du nuancier : la matière dessinée, jamais photographiée. */
function Swatch({ item, i }: { item: any; i: number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={i * 0.055}>
      <div
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          position: "relative",
          borderRadius: 3,
          overflow: "hidden",
          border: `1px solid ${h ? C.accent : C.border}`,
          background: C.bgCard,
          transform: h ? "translateY(-6px)" : "none",
          boxShadow: h
            ? "0 30px 56px -34px rgba(31,26,19,0.45), 0 6px 16px -10px rgba(31,26,19,0.28)"
            : "0 10px 26px -22px rgba(31,26,19,0.30)",
          transition: `transform .5s ${EASE_CSS}, box-shadow .5s ${EASE_CSS}, border-color .5s ${EASE_CSS}`,
        }}
      >
        <div
          style={{
            height: "clamp(96px,11vw,138px)",
            background: item.fond,
            position: "relative",
          }}
        >
          {/* la veine : un motif CSS, pas une texture importée */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `repeating-linear-gradient(96deg, ${item.veine} 0px, ${item.veine} 1px, transparent 1px, transparent ${6 + (i % 3) * 3}px)`,
              opacity: h ? 0.95 : 0.7,
              transition: `opacity .5s ${EASE_CSS}`,
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(120% 80% at 22% 12%, rgba(255,255,255,0.22), transparent 60%)",
            }}
          />
        </div>
        <div style={{ padding: "16px 18px 18px" }}>
          <div style={{ fontFamily: SERIF, fontSize: 18, color: C.ink, lineHeight: 1.2 }}>{item.nom}</div>
          <div style={{ fontFamily: SANS, fontSize: 12.5, color: C.textFaint, marginTop: 6, lineHeight: 1.6 }}>{item.note}</div>
        </div>
      </div>
    </Reveal>
  );
}

/** Une prestation : rangée éditoriale numérotée, pas une carte. */
function ServiceRow({ item, i }: { item: any; i: number }) {
  const [h, setH] = useState(false);
  const num = String(i + 1).padStart(2, "0");
  return (
    <Reveal delay={(i % 3) * 0.05}>
      <article
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        className="i334-srow"
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "72px minmax(0,1fr) minmax(0,1.25fr)",
          gap: "clamp(18px,3vw,44px)",
          alignItems: "start",
          padding: "clamp(26px,3.4vw,44px) clamp(10px,1.6vw,22px)",
          borderTop: `1px solid ${C.border}`,
          background: h ? C.bgCard : "transparent",
          transform: h ? "translateX(6px)" : "none",
          boxShadow: h
            ? "0 26px 52px -36px rgba(31,26,19,0.42), 0 4px 14px -10px rgba(31,26,19,0.22)"
            : "0 0 0 rgba(0,0,0,0)",
          transition: `background .5s ${EASE_CSS}, transform .5s ${EASE_CSS}, box-shadow .5s ${EASE_CSS}`,
        }}
      >
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(24px,2.6vw,34px)", color: h ? C.accent : C.textFaint, lineHeight: 1, transition: `color .5s ${EASE_CSS}` }}>{num}</div>
        <div>
          <h3 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(21px,2.3vw,30px)", color: C.ink, margin: 0, lineHeight: 1.14, letterSpacing: "-0.01em" }}>{item.titre}</h3>
          <span
            style={{
              display: "inline-block",
              marginTop: 14,
              fontFamily: SANS,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: C.accentDark,
              borderBottom: `1px solid ${h ? C.accent : C.border}`,
              paddingBottom: 4,
              transition: `border-color .5s ${EASE_CSS}`,
            }}
          >
            {item.tag}
          </span>
        </div>
        <p style={{ fontFamily: SANS, fontSize: "clamp(14px,1.15vw,15.5px)", color: C.textMuted, lineHeight: 1.78, margin: 0, maxWidth: 500 }}>{item.desc}</p>
        <ArrowUpRight
          size={18}
          color={C.accent}
          aria-hidden
          style={{
            position: "absolute",
            top: "clamp(26px,3.4vw,44px)",
            right: 6,
            opacity: h ? 1 : 0,
            transform: h ? "translate(0,0)" : "translate(-6px,6px)",
            transition: `opacity .5s ${EASE_CSS}, transform .5s ${EASE_CSS}`,
          }}
        />
      </article>
    </Reveal>
  );
}

/** Une ligne de tarif : table fine, conducteur pointillé, pas de carte. */
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
          padding: "clamp(20px,2.4vw,30px) clamp(6px,1.4vw,18px)",
          borderTop: `1px solid ${C.border}`,
          background: h ? "rgba(255,255,255,0.7)" : "transparent",
          transform: h ? "translateY(-2px)" : "none",
          boxShadow: h ? "0 20px 40px -34px rgba(31,26,19,0.5), 0 2px 8px -6px rgba(31,26,19,0.2)" : "0 0 0 rgba(0,0,0,0)",
          transition: `background .5s ${EASE_CSS}, transform .5s ${EASE_CSS}, box-shadow .5s ${EASE_CSS}`,
        }}
      >
        <div style={{ minWidth: 0, flex: "1 1 260px" }}>
          <div style={{ fontFamily: SERIF, fontSize: "clamp(18px,1.8vw,23px)", color: C.ink, lineHeight: 1.24 }}>{item.a}</div>
          <div style={{ fontFamily: SANS, fontSize: 13.5, color: C.textFaint, marginTop: 7, lineHeight: 1.7, maxWidth: 520 }}>{item.n}</div>
        </div>
        <span aria-hidden style={{ flex: "1 1 40px", height: 1, alignSelf: "center", minWidth: 24, backgroundImage: `linear-gradient(90deg, ${C.border} 50%, transparent 50%)`, backgroundSize: "6px 1px", opacity: h ? 1 : 0.55, transition: `opacity .5s ${EASE_CSS}` }} />
        <div style={{ fontFamily: SERIF, fontSize: "clamp(19px,1.9vw,24px)", color: h ? C.accent : C.accentDark, whiteSpace: "nowrap", transition: `color .5s ${EASE_CSS}` }}>{item.p}</div>
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
export default function StudioCulinaPage() {
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
    fusionnerEtapes(METHODE, clientMethode(sessionData)),
    METHODE,
  );
  HERO_SOURCE = HERO_SOURCE_LIVE();
  AVIS_SOURCE = AVIS_SOURCE_LIVE();
  ZONES_SOURCE = ZONES_SOURCE_LIVE();


  const CLIENT_SERVICES = clientServices(sessionData);

  SERVICES_DEMO = resolveList(
    CLIENT_SERVICES?.map((s: any, i: number) => ({ ...SERVICES_SOURCE[i % SERVICES_SOURCE.length], titre: s.title })),
    SERVICES_SOURCE,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({ ...AVIS_SOURCE[i % AVIS_SOURCE.length], auteur: r.author, texte: r.text, detail: "", })),
    AVIS_SOURCE,
  );
  TARIFS = resolveList(
    CLIENT_SERVICES?.map((s: any, i: number) => ({
      ...TARIFS_DEMO[i % TARIFS_DEMO.length],
      a: s.title,
      p: s.price ?? "Sur devis",
      n: s.description || s.desc || TARIFS_DEMO[i % TARIFS_DEMO.length].n,
    })),
    TARIFS_DEMO,
  );
  STATS = resolveList(clientStats(sessionData), STATS_DEMO);
  ENGAGEMENT = resolveList(clientCertifications(sessionData), ENGAGEMENT_DEMO);
  ZONES = resolveList(clientAreas(sessionData), ZONES_SOURCE);
  NUANCIER = resolveList(
    clientList(sessionData, "nuancier.matieres")?.map((m: string, i: number) => ({ ...NUANCIER_SOURCE[i % NUANCIER_SOURCE.length], nom: m })),
    NUANCIER_SOURCE,
  );

  /* Les photos du hero suivent la diapositive : celle du client d'abord,
     celle du thème ensuite — jamais d'URL inventée. */
  HERO = HERO_SOURCE.map((row: any, i: number) => ({ ...row, img: photo(i, row.img) }));

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

  /* Un seul index pilote tout le héros : panneau, légende, compteur, flèches. */
  const { i, go } = useSlides(HERO.length, DWELL.normal);
  const S = HERO[i];

  /* Le spotlight des avis : sa propre horloge, plus lente que le héros. */
  const [avisI, setAvisI] = useState(0);
  useEffect(() => {
    if (AVIS.length < 2) return;
    const t = setInterval(() => setAvisI((n) => (n + 1) % AVIS.length), 7000);
    return () => clearInterval(t);
  }, [AVIS.length]);
  const A = AVIS[avisI % AVIS.length];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const marque = fd?.businessName ?? clientName(sessionData) ?? "Studio Culina";
  const ville = clientCity(sessionData) ?? "Annecy";
  const phone = clientPhone(sessionData) ?? fd?.phone ?? "04 50 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33450000000").replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "studio@culina-annecy.fr";
  const adresse = clientAddress(sessionData);
  const lieu = clientCodePostalVille(sessionData, "", ville).trim();

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip", WebkitFontSmoothing: "antialiased" }}>
      <style>{FONTS_CSS}</style>
      <style>{`
        /*
          ── Le héros : deux masses séparées par une oblique ────────────────
          La photographie occupait une colonne et le texte l'autre : c'est ce
          partage-là que toute la série portait. Ici elle est taillée en biais,
          comme le chant d'un plan de travail, et le texte occupe le coin
          qu'elle laisse. Le coin est plus étroit que la masse : l'asymétrie
          est le sujet, une oblique au milieu ne serait qu'une colonne penchée.
        */
        .i334-oblique {
          position: absolute;
          inset: 0 0 0 auto;
          width: 62%;
          clip-path: polygon(26% 0, 100% 0, 100% 100%, 0 100%);
          overflow: hidden;
        }
        .i334-oblique > *, .i334-oblique > * > * { height: 100%; }
        .i334-coin {
          position: relative;
          z-index: 3;
          width: min(560px, 46%);
          margin-left: clamp(22px, 5vw, 88px);
          padding: clamp(130px,14vw,168px) 0 clamp(60px,7vw,86px);
        }

        @media (max-width: 980px) { #i334-nav { display: none !important; } .i334-burger { display: flex !important; } }
          .aevia-action-mobile { display: inline-flex !important; }
        @media (max-width: 900px) {
          /* Sous 900 il n'y a plus de « à côté » : la masse photographique
             prend le haut de l'écran, l'oblique passe sur son bord bas, et le
             texte se pose dessous. */
          .i334-hero { display: block !important; }
          .i334-oblique { inset: 0 0 auto 0; width: 100%; height: 44dvh; clip-path: polygon(0 0, 100% 0, 100% 78%, 0 100%); }
          .i334-coin { width: auto; margin: 0; padding: calc(44dvh + 14px) 22px 56px; }
          .i334-heromedia { max-width: 480px; margin: 0 auto; width: 100%; }
          .i334-split { grid-template-columns: minmax(0,1fr) !important; gap: 34px !important; }
          .i334-split > * { order: initial !important; }
          .i334-srow { grid-template-columns: minmax(0,1fr) !important; gap: 12px !important; }
          .i334-statband { grid-template-columns: repeat(auto-fit, minmax(min(150px,100%),1fr)) !important; }
          .i334-statcell { border-right: none !important; border-top: 1px solid rgba(255,255,255,0.08) !important; }
          .i334-methode { grid-template-columns: minmax(0,1fr) !important; }
          .i334-sticky { position: static !important; }
          .i334-pad { padding-left: 22px !important; padding-right: 22px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .i334-anim { transition: none !important; animation: none !important; }
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
          background: scrolled ? "rgba(248,245,239,0.92)" : "transparent",
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
              <Ruler size={17} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: SERIF, fontSize: 19, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", letterSpacing: "-0.01em" }}>{marque}</span>
              <span style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.28em", textTransform: "uppercase", color: C.textFaint, marginLeft: 6 }}>{clientTrade(sessionData) ?? "Cuisines"}</span>
            </>
          )}
        </a>
        <div id="i334-nav" style={{ display: "flex", gap: "clamp(14px,1.8vw,28px)", alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <NavLink key={l} label={l} href={h} />
          ))}
          <Btn href={telHref} filled>
            Atelier conception
          </Btn>
        </div>
        {/* L'appel à l'action sous le pouce : la barre est fixe, mais son
            bouton vit dans le menu déroulant, en display:none sous le point
            de rupture. Celui-ci paraît exactement avec le bouton de menu. */}
        <ActionMobile href={telHref} fond={C.accent} encre={C.white}>
          Appeler
        </ActionMobile>
        <button
          className="i334-burger"
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
          <a href={telHref} style={{ background: C.accent, color: C.white, borderRadius: 2, padding: "14px 22px", fontFamily: SANS, fontSize: 12, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", textDecoration: "none", textAlign: "center", marginTop: 12 }}>
            Atelier conception
          </a>
        </div>
      )}

      {/* ── HERO — diagonale asymétrique ──────────────────────────────────
             La photographie n'occupe plus une colonne mais une masse coupée
             en biais, comme un chant de plan de travail. Le texte vit dans le
             coin qu'elle laisse. Aucune grille : deux masses de tailles
             différentes, séparées par une oblique. */}
      <section
        id="top"
        className="i334-hero"
        style={{ position: "relative", minHeight: "100dvh", display: "flex", alignItems: "center", overflow: "hidden", background: C.bg }}
      >
        {/* La masse photographique, taillée en oblique sur son bord gauche. */}
        <div className="i334-oblique" aria-hidden={false}>
          <PanelDrop index={i}>
            <div style={{ position: "relative", width: "100%", height: "100%", background: C.bgDark }}>
              <img src={S.img} alt={S.alt} loading="eager" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(255deg, rgba(31,26,19,0) 34%, rgba(31,26,19,0.42) 100%)" }} />
            </div>
          </PanelDrop>
        </div>

        {/* Le coin de parole. */}
        <div className="i334-coin">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.15, ease: EASE }}>
            <Kicker>{clientEyebrow(sessionData) ?? <>Cuisines sur mesure · {ville}</>}</Kicker>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.28, ease: EASE }}
            style={{
              fontFamily: SERIF,
              fontWeight: 300,
              fontSize: "clamp(34px,4.6vw,62px)",
              color: C.ink,
              lineHeight: 1.02,
              letterSpacing: "-0.022em",
              margin: "clamp(18px,2vw,26px) 0 clamp(16px,1.8vw,24px)",
              overflowWrap: "break-word",
            }}
          >
            {/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ??
              clientHeroLine(sessionData, 0, 1, 40) ??
              "La cuisine dessinée autour de vos matins."}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.44, ease: EASE }}
            style={{ fontFamily: SANS, fontSize: "clamp(15px,1.2vw,16.5px)", fontWeight: 300, color: C.textMuted, lineHeight: 1.78, maxWidth: 460, marginBottom: "clamp(24px,3vw,34px)" }}
          >
            {clientHeroSubtitle(sessionData) ??
              clientTagline(sessionData) ??
              "Un studio de conception, pas un couloir d'expo : trois cuisines témoins, un architecte d'intérieur, et des façades qui se posent au millimètre. Devis ferme, pose décennale."}
          </motion.p>

          {/* Une seule action pleine ; le nuancier en lien souligné. */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.58, ease: EASE }} style={{ display: "flex", gap: "clamp(16px,2vw,26px)", flexWrap: "wrap", alignItems: "center" }}>
            <Btn href={telHref} filled>
              Réserver l'atelier
            </Btn>
            <a href="#nuancier" style={{ fontFamily: SANS, fontSize: 13, color: C.ink, textDecoration: "none", borderBottom: `1px solid ${C.accent}`, paddingBottom: 3 }}>
              Voir le nuancier
            </a>
          </motion.div>

          {/*
            Le nom de la cuisine montrée, et de quoi passer aux autres. La
            fraction « 01 / 03 » ne disait pas ce qu'on regardait ; ces trois
            traits nomment les trois pièces et y mènent directement.
          */}
          <div style={{ marginTop: "clamp(26px,3.4vw,42px)", paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: SANS, fontSize: 13, color: C.textMuted, lineHeight: 1.6, marginBottom: 14 }}>
              <strong style={{ color: C.ink, fontWeight: 600 }}>{S.k}</strong> — {S.sub}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {HERO.map((h: any, n: number) => (
                <button
                  key={h.k ?? n}
                  type="button"
                  onClick={() => go(n)}
                  aria-label={h.k ?? `Cuisine ${n + 1}`}
                  aria-current={n === i}
                  style={{ width: 44, height: 3, padding: 0, border: "none", cursor: "pointer", background: n === i ? C.accent : C.border, transition: "background .3s" }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RESPIRATION ─────────────────────────────────────────────────── */}
      <section className="i334-pad" style={{ background: C.bgAlt, padding: "clamp(74px,10vw,140px) clamp(22px,8vw,150px)", textAlign: "center" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
            <Kicker color={C.textMuted} align="center">Le studio</Kicker>
          </div>
        </Reveal>
        <Reveal delay={0.09}>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(23px,3.2vw,44px)", lineHeight: 1.36, color: C.ink, maxWidth: 940, margin: "0 auto", letterSpacing: "-0.008em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "respiration.texte") ?? (<>
            Une cuisine ne se choisit pas sur catalogue : elle se dessine autour d'une maison, d'un mur qui n'est pas droit et de deux heures de conversation.
          </>)}</p>
        </Reveal>
        <Reveal delay={0.18}>
          <div style={{ width: 1, height: 82, background: `linear-gradient(${C.accent}, transparent)`, margin: "clamp(34px,4vw,52px) auto 0" }} />
        </Reveal>
      </section>

      {/* ── NUANCIER — la signature visuelle, dessinée sans photo ────────── */}
      <section id="nuancier" className="i334-pad" style={{ background: C.bg, padding: "clamp(76px,10vw,140px) clamp(22px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `repeating-linear-gradient(90deg, ${C.border} 0px, ${C.border} 1px, transparent 1px, transparent 104px)`, opacity: 0.35 }} />
        <div style={{ maxWidth: 1220, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <Kicker>Le nuancier de l'atelier</Kicker>
            <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(30px,4.2vw,54px)", color: C.ink, margin: "18px 0 0", lineHeight: 1.06, letterSpacing: "-0.018em", maxWidth: 820 }}>{/* TEXTE_SECTION */ clientText(sessionData, "nuancier.titre") ?? (<>
              Les matières écrites au devis,<br /><em style={{ fontStyle: "italic", color: C.accent }}>et rien d'autre.</em>
            </>)}</h2>
            <p style={{ fontFamily: SANS, fontSize: "clamp(14.5px,1.15vw,16px)", color: C.textMuted, lineHeight: 1.78, maxWidth: 500, marginTop: 20 }}>
              Chaque essence et chaque plan de travail cités dans nos formules se regarde ici, à plat. Le studio les tient en main : deux heures suffisent à trancher.
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "clamp(14px,1.8vw,24px)", marginTop: "clamp(36px,4.5vw,58px)" }}>
            {NUANCIER.map((n: any, idx: number) => (
              <Swatch key={n.nom} item={n} i={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PRESTATIONS — rangées éditoriales numérotées ─────────────────── */}
      <section id="services" className="i334-pad" style={{ background: C.bgAlt, padding: "clamp(80px,11vw,150px) clamp(22px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1220, margin: "0 auto", position: "relative" }}>
          <GhostNum right>{String(SERVICES.length).padStart(2, "0")}</GhostNum>
          <Reveal>
            <div style={{ marginBottom: "clamp(28px,3.5vw,46px)", position: "relative" }}>
              <Kicker>Prestations</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(30px,4.3vw,56px)", color: C.ink, margin: "18px 0 0", lineHeight: 1.06, letterSpacing: "-0.018em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>
                Du plan de travail<br /><em style={{ fontStyle: "italic", color: C.accent }}>au dernier tiroir.</em>
              </>)}</h2>
            </div>
          </Reveal>
          <div style={{ borderBottom: `1px solid ${C.border}` }}>
            {SERVICES.map((s: any, idx: number) => (
              <ServiceRow key={s.titre} item={s} i={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CHIFFRES — bande sombre, chiffres fantômes derrière ──────────── */}
      <section style={{ background: C.bgDark, position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(70% 100% at 50% 0%, rgba(185,141,85,0.11), transparent 70%)" }} />
        <div
          className="i334-statband i334-pad"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1160, margin: "0 auto", padding: "0 clamp(22px,4vw,44px)", position: "relative" }}
        >
          {STATS.map((s: any, idx: number) => (
            <Reveal key={s.label} delay={idx * 0.07}>
              <div className="i334-statcell" style={{ position: "relative", padding: "clamp(34px,4vw,52px) 10px", textAlign: "center", borderRight: idx < STATS.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none", overflow: "hidden" }}>
                <span aria-hidden style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(70px,8vw,120px)", color: "rgba(255,255,255,0.045)", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div style={{ position: "relative", fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(28px,3.2vw,40px)", color: C.veine, lineHeight: 1, letterSpacing: "-0.02em" }}>{s.value}</div>
                <div style={{ position: "relative", fontFamily: SANS, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.46)", marginTop: 12, lineHeight: 1.5 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── MÉTHODE — colonne collante + étapes filetées ─────────────────── */}
      <section id="methode" className="i334-pad" style={{ background: C.bg, padding: "clamp(80px,11vw,152px) clamp(22px,5vw,64px)" }}>
        <div
          className="i334-methode"
          style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,0.86fr) minmax(0,1.14fr)", gap: "clamp(32px,5vw,84px)", alignItems: "start" }}
        >
          <div className="i334-sticky" style={{ position: "sticky", top: 118, alignSelf: "start" }}>
            <Reveal>
              <Kicker>La méthode</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(29px,3.9vw,50px)", color: C.ink, margin: "18px 0 20px", lineHeight: 1.06, letterSpacing: "-0.018em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (<>
                Un projet mené<br /><em style={{ fontStyle: "italic", color: C.accent }}>comme un chantier d'architecte.</em>
              </>)}</h2>
              <p style={{ fontFamily: SANS, fontSize: "clamp(14.5px,1.15vw,16px)", color: C.textMuted, lineHeight: 1.8, maxWidth: 420 }}>
                Quatre temps, dans cet ordre. Le premier est offert, le troisième est ferme, le quatrième se signe pièce par pièce.
              </p>
              <div style={{ width: 60, height: 1, background: `linear-gradient(90deg, ${C.accent}, transparent)`, marginTop: 26 }} />
            </Reveal>
          </div>
          <div>
            {METHODE.map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.06}>
                <div style={{ position: "relative", display: "flex", gap: "clamp(18px,2.6vw,36px)", alignItems: "flex-start", padding: "clamp(24px,3.2vw,40px) 0", borderTop: `1px solid ${C.border}` }}>
                  <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(26px,3vw,38px)", color: C.veine, lineHeight: 1, minWidth: 54, flexShrink: 0 }}>{m.n}</span>
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

      {/* ── ENGAGEMENTS — split, photo à droite (le miroir du héros) ─────── */}
      <section id="engagements" className="i334-pad" style={{ background: C.bgAlt, padding: "clamp(80px,11vw,150px) clamp(22px,5vw,64px)" }}>
        <div className="i334-split" style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(34px,5vw,76px)", alignItems: "center" }}>
          <Reveal style={{ order: 2 }}>
            <div style={{ position: "relative", borderRadius: 3, overflow: "hidden", background: C.bgDark, border: `1px solid ${C.border}` }}>
              <img
                src={photo(3, "https://images.pexels.com/photos/6969818/pexels-photo-6969818.jpeg?auto=compress&cs=tinysrgb&w=1600")}
                alt="Contrôle d'un caisson à l'atelier"
                loading="lazy"
                style={{ width: "100%", aspectRatio: "4/3.4", objectFit: "cover", display: "block" }}
              />
              <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(31,26,19,0.38) 0%, rgba(31,26,19,0.04) 42%, transparent 100%)" }} />
              <div style={{ position: "absolute", left: 20, bottom: 18, fontFamily: SANS, fontSize: 10, fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.86)" }}>
                Contrôle atelier
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12} style={{ order: 1 }}>
            <div>
              <Kicker>Nos engagements</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(28px,3.7vw,46px)", color: C.ink, margin: "18px 0 26px", lineHeight: 1.08, letterSpacing: "-0.018em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (<>
                Le sur-mesure,<br /><em style={{ fontStyle: "italic", color: C.accent }}>sans l'à-peu-près.</em>
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
      <section id="tarifs" className="i334-pad" style={{ background: C.bg, padding: "clamp(80px,11vw,150px) clamp(22px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Kicker align="center">Tarifs</Kicker>
              </div>
              <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(30px,4vw,52px)", color: C.ink, margin: "18px 0 0", lineHeight: 1.06, letterSpacing: "-0.018em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Des budgets <em style={{ fontStyle: "italic", color: C.accent }}>tenus.</em></>)}</h2>
              <p style={{ fontFamily: SANS, fontSize: "clamp(14.5px,1.15vw,16px)", fontWeight: 300, color: C.textMuted, maxWidth: 540, margin: "18px auto 0", lineHeight: 1.78 }}>
                Prix pose et raccordements compris. L'atelier conception est offert et déduit à la commande.
              </p>
            </div>
          </Reveal>
          <div style={{ marginTop: "clamp(34px,4.5vw,54px)", borderBottom: `1px solid ${C.border}` }}>
            {TARIFS.map((t: any, idx: number) => (
              <TarifRow key={t.a} item={t} i={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── AVIS — spotlight rotatif, un seul à la fois ──────────────────── */}
      <section className="i334-pad" style={{ background: C.bgDark, padding: "clamp(80px,11vw,150px) clamp(22px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 60% at 50% 18%, rgba(185,141,85,0.12), transparent 70%)" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", textAlign: "center" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 26 }}>
              <Kicker color="rgba(255,255,255,0.45)" align="center">Ils cuisinent dedans</Kicker>
            </div>
            <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(27px,3.5vw,44px)", color: C.bg, lineHeight: 1.08, letterSpacing: "-0.018em", marginBottom: "clamp(34px,4.4vw,54px)" }}>{/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>Ce que la maison <em style={{ fontStyle: "italic", color: C.veine }}>en dit</em>.</>)}</h2>
          </Reveal>

          <div style={{ minHeight: 240, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={A.auteur + String(avisI)}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
                transition={{ duration: reduce ? 0.2 : 0.62, ease: EASE }}
                style={{ margin: 0 }}
              >
                <blockquote style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(19px,2.3vw,29px)", color: "rgba(248,245,239,0.9)", lineHeight: 1.56, margin: "0 auto 30px", maxWidth: 760 }}>
                  « {A.texte} »
                </blockquote>
                <figcaption>
                  <div style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 600, letterSpacing: "0.06em", color: C.bg }}>{A.auteur}</div>
                  <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: C.veine, marginTop: 8 }}>{A.detail}</div>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 32 }}>
            {AVIS.map((a: any, n: number) => (
              <button
                key={a.auteur + String(n)}
                onClick={() => setAvisI(n)}
                aria-label={`Avis ${n + 1}`}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "16px 6px", minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <span
                  className="i334-anim"
                  style={{
                    display: "block",
                    height: 2,
                    width: n === avisI % AVIS.length ? 40 : 16,
                    borderRadius: 99,
                    background: n === avisI % AVIS.length ? C.veine : "rgba(255,255,255,0.24)",
                    transition: `width .55s ${EASE_CSS}, background .55s ${EASE_CSS}`,
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section id="contact" className="i334-pad" style={{ background: C.accentLight, padding: "clamp(80px,11vw,150px) clamp(22px,5vw,64px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `repeating-linear-gradient(0deg, rgba(125,90,60,0.06) 0px, rgba(125,90,60,0.06) 1px, transparent 1px, transparent 84px)` }} />
        <div style={{ maxWidth: 780, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Kicker align="center">Atelier offert</Kicker>
            </div>
            <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(30px,4.3vw,56px)", color: C.ink, margin: "18px 0 18px", lineHeight: 1.06, letterSpacing: "-0.018em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
              Deux heures pour dessiner<br /><em style={{ fontStyle: "italic", color: C.accent }}>la cuisine de votre maison.</em>
            </>)}</h2>
            <p style={{ fontFamily: SANS, fontSize: "clamp(15px,1.2vw,16.5px)", fontWeight: 300, color: C.textMuted, maxWidth: 470, margin: "0 auto clamp(28px,3.6vw,40px)", lineHeight: 1.78 }}>
              Atelier conception au studio, plans remis dans tous les cas. Réservation par téléphone.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href={telHref}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.accent, color: C.white, borderRadius: 2, padding: "16px 32px", fontFamily: SANS, fontSize: 15, fontWeight: 600, textDecoration: "none" }}
              >
                <Phone size={17} /> {phone}
              </a>
              <a
                href={`mailto:${mail}`}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "transparent", color: C.ink, border: `1px solid ${C.accent}`, borderRadius: 2, padding: "16px 30px", fontFamily: SANS, fontSize: 15, fontWeight: 600, textDecoration: "none" }}
              >
                <Mail size={17} /> Nous écrire
              </a>
            </div>
            <div style={{ marginTop: 30, fontFamily: SANS, fontSize: 12.5, color: C.textFaint, lineHeight: 1.8 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                <MapPin size={13} color={C.accentDark} />
                {adresse ?? lieu} · Nous dessinons pour {ZONES.join(", ")}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="i334-pad" style={{ background: C.bgDarkAlt, padding: "clamp(52px,7vw,84px) clamp(22px,5vw,64px) 26px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 38 }}>
            <div style={{ maxWidth: 340 }}>
              <div style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(20px,2vw,26px)", color: C.veine, marginBottom: 12, letterSpacing: "-0.01em" }}>{marque}</div>
              <p style={{ fontFamily: SANS, fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, margin: 0 }}>
                Cuisines & agencement sur mesure · {ville}
                <br />
                Fabrication européenne, pose garantie décennale
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <MapPin size={13} />, t: adresse ?? (clientCity(sessionData) ? lieu : `${lieu}, Haute-Savoie`) },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Mail size={13} />, t: mail },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.44)", fontFamily: SANS, fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.veine, display: "flex" }}>{item.icon}</span>
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
