"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, Mail, MapPin, Phone, Sprout, Star } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, HeldSwap, useSlides } from "@/lib/templates/hero-kit-2";
import { ActionMobile } from "@/lib/templates/ActionMobile";
import {
  clientAddress,
  clientCertifications,
  clientCity,
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
   FERME DES QUATRE VENTS — Producteur fermier en vente directe · Cahors
   Réécriture premium (reprise 316–383, famille II).

   Geste signature : HeldSwap (hero-kit-2) — LE PANIER EN MÉDAILLON. La récolte
   de la semaine est posée dans un médaillon rond, comme une assiette sur la
   table : elle sort en basculant à peine (tilt 8°), la table reste vide une
   demi-seconde — le temps tenu de la mécanique — puis la suivante se pose.
   Un seul index pilote tout le héros : le médaillon, la chronique qui
   l'accompagne, le compteur.

   Archétype H7 : magazine — méta-rangée filetée en tête, titre serif géant,
   bandeau média posé au bas du héros. Le thème se lit comme la une d'une
   gazette de saison, pas comme une page de vente.

   Paire P4 : Fraunces (serif à axe optique, voix du thème) × Inter (labeur).
   Palette #fbfaf4 / #5f7a2e — papier crème, vert de rang.

   Dessin des sections, volontairement écarté du squelette commun :
   les repères (chiffres) font une rangée filetée de sommaire, pas une bande
   sombre ; les produits composent une « une » de magazine (article de tête +
   brèves filetées) ; la méthode est un bandeau de quatre temps à chiffres
   fantômes ; les prix sont une mercuriale à points de conduite ; les avis
   sont trois colonnes décalées sur le seul fond sombre de la page.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Fontes : deux rôles opposés, importées une fois ──────────────────────── */
const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Inter:wght@300;400;500;600&display=swap');`;
const SERIF = "'Fraunces', Georgia, 'Times New Roman', serif";
const SANS = "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";
// Les passes globales et les sous-pages lisent encore FONT / FONT_BODY.
const FONT = SERIF;
const FONT_BODY = SANS;

/* ── Courbe d'accélération unique du thème ───────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_CSS = "cubic-bezier(.16,1,.3,1)";

/* ── Jetons ──────────────────────────────────────────────────────────────── */
let C: Record<string, string> = {
  bg: "#fbfaf4",
  bgAlt: "#f1efe1",
  bgDark: "#242a19",
  bgDarkAlt: "#1b2013",
  bgCard: "#ffffff",
  accent: "var(--brand, #5f7a2e)",
  accentDark: "var(--brand-light, #47601f)",
  accentLight: "#e7ecd3",
  ink: "#242a19",
  textMuted: "#5c6350",
  textFaint: "#94997f",
  border: "#e2e0cb",
  white: "#ffffff",
  // Clé métier : le vert tendre des jeunes pousses — les hautes lumières des
  // fonds sombres, les étoiles des avis, les filets du pied de page.
  pousse: "#c4d494",
};

const NAV = [
  { l: "Nos produits", h: "#services" },
  { l: "La ferme", h: "#methode" },
  { l: "Paniers & prix", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* ════════════════════════════════════════════════════════════════════════════
   Données de démonstration — contenu rédactionnel du thème, conservé.

   Les champs de présentation vivent dans des constantes SOURCE (jamais un
   appel au contrat au niveau module : une constante évaluée à l'import ne
   verrait jamais le client) ; ce qui lit la session passe par des fonctions
   LIVE() ré-appelées dans le corps du rendu.
   ════════════════════════════════════════════════════════════════════════════ */

function HERO_LIVE() {
  return [
    {
      k: "Le panier de la semaine",
      line: "Composé mardi, cueilli jeudi, retiré vendredi.",
      sub: "Légumes du moment, jamais les mêmes deux semaines de suite.",
      img: fd?.photoUrls?.[0] || clientPhotos(sessionData)[0] || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
      alt: "Légumes du jardin en permaculture",
    },
    {
      k: "Le jardin",
      line: "Deux hectares menés en bio, sans raccourci.",
      sub: "Certification AB, sol vivant, rotations longues.",
      img: fd?.photoUrls?.[1] || clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80",
      alt: "Travail au jardin de la ferme",
    },
    {
      k: "Les saisons",
      line: "En juin les fraises, en janvier les poireaux.",
      sub: "On ne force rien — c'est le principe.",
      img: fd?.photoUrls?.[2] || clientPhotos(sessionData)[2] || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
      alt: "Rangs de culture à la belle saison",
    },
  ];
}
let HERO = HERO_LIVE();

const SERVICES_SOURCE = [
  { titre: "Légumes de saison", desc: "Quarante variétés sur l'année, cueillies la veille ou le matin de la vente. La tomate d'août et le panais de janvier — jamais l'inverse.", tag: "Maraîchage" },
  { titre: "Œufs de plein air", desc: "250 poules sur parcours herbeux, nourries au grain local complété par ce que la ferme produit. Ramassés chaque matin.", tag: "Œufs" },
  { titre: "Volailles fermières", desc: "Poulets élevés 110 jours minimum, en plein air, abattus en abattoir de proximité. Sur commande, retrait le vendredi.", tag: "Volaille" },
  { titre: "Paniers hebdomadaires", desc: "Petit (2 pers.) ou grand (4-5 pers.) : la récolte de la semaine, une recette pour le légume oublié, sans engagement.", tag: "Paniers" },
  { titre: "Conserves de la ferme", desc: "Coulis, ratatouille, soupes d'hiver : l'été mis en bocaux dans notre atelier agréé, pour les mois sans.", tag: "Bocaux" },
  { titre: "Visites & œufs de vacances", desc: "La ferme se visite le premier samedi du mois. Les enfants ramassent les œufs, les parents comprennent les prix.", tag: "Visites" },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE_SOURCE = [
  { n: "01", t: "Un sol vivant", d: "Rotations longues, engrais verts, compost de la ferme : le sol est notre premier outil de travail." },
  { n: "02", t: "Cueilli à maturité", d: "La récolte se fait pour le lendemain, pas pour tenir une semaine de camion. Ça change le goût, vraiment." },
  { n: "03", t: "Vendu en direct", d: "Boutique à la ferme, marché de Cahors le samedi, paniers réservés : aucun intermédiaire, prix décidés ici." },
  { n: "04", t: "Contrôlé chaque année", d: "Certification AB par organisme agréé, contrôles annuels — le logo se mérite, il ne se déclare pas." },
];
const METHODE = METHODE_SOURCE;

const ENGAGEMENT_SOURCE = [
  "Certification Agriculture Biologique (AB), contrôles annuels d'organisme agréé",
  "Vente directe uniquement : ce qui est sur l'étal a poussé ici, point",
  "Prix affichés à l'année, décidés par la ferme — pas par un cours mondial",
  "La ferme se visite : premier samedi du mois, et sur demande pour les écoles",
];
let ENGAGEMENT = ENGAGEMENT_SOURCE;

const TARIFS_SOURCE = [
  { a: "Panier petit (2 pers.)", p: "14 €", n: "5-6 légumes de la semaine + la recette du légume oublié." },
  { a: "Panier grand (4-5 pers.)", p: "24 €", n: "8-10 légumes, de quoi tenir la semaine sans supermarché." },
  { a: "Œufs plein air (×6)", p: "2,80 €", n: "Ramassés du matin, boîtes consignées reprises." },
  { a: "Poulet fermier (~1,8 kg)", p: "12,90 €/kg", n: "Sur commande avant mercredi, retrait vendredi." },
];
let TARIFS = TARIFS_SOURCE;

const AVIS_SOURCE = [
  { texte: "Deux ans de panier hebdomadaire : on a réappris à cuisiner avec les saisons, les enfants reconnaissent les légumes, et le goût des tomates d'août ne se compare à rien.", auteur: "Famille Delmas", detail: "Panier grand" },
  { texte: "La visite du premier samedi vaut tous les discours : on voit les poules, le compost, les rangs. Depuis, le prix des œufs me paraît même trop bas.", auteur: "Nathalie C.", detail: "Visite + cliente marché" },
  { texte: "Poulet de 110 jours commandé pour un dimanche de famille : mes parents ont retrouvé « le goût du poulet d'avant ». Tout est dit.", auteur: "Julien F.", detail: "Volaille fermière" },
];
let AVIS_DEMO = AVIS_SOURCE;

const STATS_SOURCE = [
  { value: "AB", label: "Certifiée agriculture biologique" },
  { value: "2 ha", label: "De maraîchage diversifié" },
  { value: "250", label: "Poules de plein air" },
  { value: "0 km", label: "Entre le champ et la boutique" },
];
let STATS = STATS_SOURCE;

/* ── Photos ──────────────────────────────────────────────────────────────── */
/**
 * L'image téléversée à cet emplacement, sinon celle du thème.
 * `||` et non `??` : une chaîne vide est un emplacement non pourvu.
 */
function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 24, style }: { children: React.ReactNode; delay?: number; y?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} style={style} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.8, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

/** Sur-titre : un filet de 40 px, puis des capitales très espacées. */
function Kicker({ children, color = C.accentDark, align = "left" }: { children: React.ReactNode; color?: string; align?: "left" | "center" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: align === "center" ? "center" : "flex-start" }}>
      <span style={{ width: 40, height: 1, background: color, opacity: 0.7, flexShrink: 0 }} />
      <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.34em", textTransform: "uppercase", color }}>{children}</span>
      {align === "center" && <span style={{ width: 40, height: 1, background: color, opacity: 0.7, flexShrink: 0 }} />}
    </div>
  );
}

/** Un filet dégradé d'un pixel — la séparation du thème. */
function Filet({ color, width = "100%", style }: { color: string; width?: string | number; style?: React.CSSProperties }) {
  return <span aria-hidden style={{ display: "block", width, height: 1, background: `linear-gradient(90deg, transparent, ${color}, transparent)`, ...style }} />;
}

/**
 * La rose des vents, dessinée — quatre pointes, un cercle.
 * C'est le détail gratuit du thème : elle tourne très lentement (90 s le
 * tour, on ne la voit pas tourner, on sent que le vent change) et elle
 * signe le nom de la ferme sans jamais l'illustrer lourdement.
 */
function RoseDesVents({ size = 64, color, opacity = 0.5, className = "", style }: { size?: number; color: string; opacity?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" width={size} height={size} className={className} style={{ display: "block", opacity, pointerEvents: "none", ...style }}>
      <circle cx="50" cy="50" r="30" fill="none" stroke={color} strokeWidth="1" />
      <path d="M50 4 L56 44 L50 50 L44 44 Z" fill={color} opacity="0.9" />
      <path d="M50 96 L56 56 L50 50 L44 56 Z" fill="none" stroke={color} strokeWidth="1" />
      <path d="M4 50 L44 44 L50 50 L44 56 Z" fill="none" stroke={color} strokeWidth="1" />
      <path d="M96 50 L56 44 L50 50 L56 56 Z" fill="none" stroke={color} strokeWidth="1" />
      <circle cx="50" cy="50" r="2.4" fill={color} />
    </svg>
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
        fontWeight: 500,
        color: h ? C.ink : C.textMuted,
        textDecoration: "none",
        padding: "12px 2px",
        transition: `color .48s ${EASE_CSS}`,
      }}
    >
      {label}
      {/* le soulignement pousse en largeur, il n'apparaît pas */}
      <span style={{ position: "absolute", left: 0, bottom: 6, height: 1, width: h ? "100%" : "0%", background: C.accent, transition: `width .5s ${EASE_CSS}` }} />
    </a>
  );
}

/** Bouton : rectangulaire, à peine adouci — un thème de ferme, pas de spa. */
function CTA({ href, children, filled = false, big = false, sombre = false }: { href: string; children: React.ReactNode; filled?: boolean; big?: boolean; sombre?: boolean }) {
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
        padding: big ? "16px 30px" : "13px 24px",
        borderRadius: 4,
        textDecoration: "none",
        whiteSpace: "nowrap",
        border: `1px solid ${filled ? "transparent" : sombre ? "rgba(255,255,255,0.28)" : C.border}`,
        background: filled ? (h ? C.accentDark : C.accent) : h ? (sombre ? "rgba(255,255,255,0.10)" : C.white) : "transparent",
        color: filled ? C.white : sombre ? C.white : C.ink,
        transform: h ? "translateY(-2px)" : "none",
        boxShadow: h
          ? `0 18px 36px -22px rgba(36,42,25,0.6), 0 2px 0 0 ${filled ? "rgba(255,255,255,0.2)" : sombre ? "rgba(255,255,255,0.12)" : C.accentLight}`
          : "0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0)",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      {children}
      <ArrowRight size={15} style={{ transform: h ? "translateX(5px)" : "none", transition: `transform .5s ${EASE_CSS}` }} />
    </a>
  );
}

/** Une brève du sommaire des produits : filet, tag, titre, texte. */
function BreveProduit({ s, idx, dernier }: { s: any; idx: number; dernier: boolean }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={Math.min(idx, 5) * 0.055} y={16}>
      <article
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          padding: "clamp(18px,2vw,26px) clamp(12px,1.4vw,18px)",
          borderBottom: dernier ? "1px solid transparent" : `1px solid ${h ? "transparent" : C.border}`,
          background: h ? C.bgCard : "transparent",
          borderRadius: 8,
          transform: h ? "translateX(6px)" : "none",
          boxShadow: h ? `0 24px 48px -40px rgba(36,42,25,0.55), 0 2px 0 0 ${C.accentLight}` : "0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0)",
          transition: `all .5s ${EASE_CSS}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontFamily: SANS, fontSize: 9.5, fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: h ? C.accent : C.textFaint, transition: `color .45s ${EASE_CSS}` }}>{s.tag}</span>
          <h3 style={{ fontFamily: SERIF, fontSize: "clamp(20px,2vw,26px)", fontWeight: 500, color: C.ink, lineHeight: 1.12, margin: 0, letterSpacing: "-0.006em" }}>{s.titre}</h3>
        </div>
        <p style={{ fontFamily: SANS, fontSize: 14, color: C.textMuted, lineHeight: 1.72, margin: "9px 0 0", maxWidth: 520 }}>{s.desc}</p>
      </article>
    </Reveal>
  );
}

/** Un temps de la méthode : colonne au chiffre fantôme, sur le bandeau. */
function TempsFerme({ m, idx }: { m: any; idx: number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={idx * 0.08} y={20}>
      <div
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          position: "relative",
          height: "100%",
          padding: "clamp(30px,3vw,42px) clamp(16px,1.8vw,24px) clamp(22px,2.2vw,30px)",
          borderTop: `1px solid ${C.border}`,
          background: h ? C.bgCard : "transparent",
          borderRadius: "0 0 10px 10px",
          transform: h ? "translateY(-5px)" : "none",
          boxShadow: h ? `0 28px 52px -44px rgba(36,42,25,0.6), 0 2px 0 0 ${C.accentLight}` : "0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0)",
          transition: `all .5s ${EASE_CSS}`,
        }}
      >
        {/* le chiffre fantôme : la texture sans image du bandeau */}
        <span aria-hidden style={{ position: "absolute", top: 4, right: 8, fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(64px,6vw,92px)", lineHeight: 1, color: C.accent, opacity: h ? 0.14 : 0.07, pointerEvents: "none", userSelect: "none", transition: `opacity .5s ${EASE_CSS}` }}>
          {m.n}
        </span>
        <h3 style={{ fontFamily: SERIF, fontSize: "clamp(21px,2.1vw,26px)", fontWeight: 500, color: C.ink, lineHeight: 1.14, margin: "0 0 10px", letterSpacing: "-0.006em" }}>{m.t}</h3>
        <p style={{ fontFamily: SANS, fontSize: 14, color: C.textMuted, lineHeight: 1.74, margin: 0 }}>{m.d}</p>
      </div>
    </Reveal>
  );
}

/** Une ligne de la mercuriale : produit, points de conduite, prix. */
function MercurialeLigne({ t, idx }: { t: any; idx: number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={idx * 0.05} y={14}>
      <div
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          padding: "clamp(18px,2vw,26px) clamp(8px,1.2vw,16px)",
          background: h ? C.bgCard : "transparent",
          borderRadius: 8,
          transform: h ? "translateX(5px)" : "none",
          boxShadow: h ? `0 22px 44px -40px rgba(36,42,25,0.55), 0 2px 0 0 ${C.accentLight}` : "0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0)",
          transition: `all .5s ${EASE_CSS}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontFamily: SERIF, fontSize: "clamp(19px,1.9vw,24px)", fontWeight: 500, color: C.ink, letterSpacing: "-0.006em", flexShrink: 0 }}>{t.a}</span>
          {/* les points de conduite d'une mercuriale de marché */}
          <span aria-hidden style={{ flex: 1, borderBottom: `1px dotted ${h ? C.accent : C.textFaint}`, transform: "translateY(-4px)", opacity: 0.7, transition: `border-color .45s ${EASE_CSS}` }} />
          <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(19px,1.9vw,24px)", color: C.accentDark, whiteSpace: "nowrap", flexShrink: 0 }}>{t.p}</span>
        </div>
        <p style={{ fontFamily: SANS, fontSize: 13.5, color: C.textMuted, lineHeight: 1.68, margin: "7px 0 0", maxWidth: 560 }}>{t.n}</p>
      </div>
    </Reveal>
  );
}

/** Un avis, dans les colonnes décalées du fond sombre. */
function AvisCarte({ a, idx }: { a: any; idx: number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={idx * 0.1} y={26} style={{ height: "100%" }}>
      <figure
        className={idx % 2 === 1 ? "i365-avis-decale" : ""}
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          margin: 0,
          height: "100%",
          boxSizing: "border-box",
          background: h ? "rgba(255,255,255,0.085)" : "rgba(255,255,255,0.045)",
          border: `1px solid ${h ? "rgba(196,212,148,0.4)" : "rgba(255,255,255,0.10)"}`,
          borderRadius: 12,
          padding: "clamp(24px,2.5vw,32px)",
          display: "flex",
          flexDirection: "column",
          transform: h ? "translateY(-5px)" : "none",
          boxShadow: h ? "0 32px 58px -44px rgba(0,0,0,0.9), 0 2px 0 0 rgba(196,212,148,0.28)" : "0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0)",
          transition: `all .5s ${EASE_CSS}`,
        }}
      >
        <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
          {[...Array(5)].map((_, j) => (
            <Star key={j} size={12} fill={C.pousse} color={C.pousse} />
          ))}
        </div>
        <blockquote style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(16.5px,1.6vw,19px)", color: "rgba(255,255,255,0.86)", lineHeight: 1.6, margin: "0 0 20px", flex: 1 }}>
          « {a.texte} »
        </blockquote>
        <figcaption style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 14 }}>
          <div style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 600, color: C.white }}>{a.auteur}</div>
          <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.pousse, marginTop: 6 }}>{a.detail}</div>
        </figcaption>
      </figure>
    </Reveal>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════════════════ */
export default function QuatreVentsPage() {
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

  /* ── Listes : le client écrase, le thème complète ───────────────────────── */
  HERO = HERO_LIVE();
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

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Un seul index pilote tout le héros : le médaillon, la chronique, le compteur. */
  const { i, go } = useSlides(HERO.length, DWELL.normal);
  const S = HERO[i];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  /* ── Contact ───────────────────────────────────────────────────────────── */
  const phone = clientPhone(sessionData) ?? clientEmail(sessionData) ?? fd?.email ?? "05 65 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? clientEmail(sessionData) ?? fd?.email ?? "+33565000000").replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "panier@ferme-quatre-vents.fr";
  const ferme = fd?.businessName ?? clientName(sessionData) ?? "Ferme des Quatre Vents";
  const ville = clientCity(sessionData) ?? "Cahors";

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip" }}>
      <style>{`
        ${FONTS_CSS}

        /*
          ── Héros « chiffre en avant » ─────────────────────────────────────
          « 0 km » tient la place du titre ; le médaillon l'accompagne sans
          lui faire face.
        */
        .i365-chiffre {
          display: grid;
          grid-template-columns: minmax(0, 1fr) clamp(150px, 17vw, 216px);
          gap: clamp(24px, 4vw, 64px);
          align-items: center;
        }
        .i365-medaillon { position: relative; width: 100%; }
        .i365-dire {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.6fr);
          gap: clamp(22px, 3.4vw, 52px);
          align-items: start;
        }
        .i365-chronique { border-left: 1px solid ${C.border}; padding-left: clamp(16px, 2vw, 28px); min-width: 0; }

        @media (max-width: 960px) { #i365-nav { display: none !important; } .i365-burger { display: flex !important; } }
          .aevia-action-mobile { display: inline-flex !important; }

        /* Le bandeau média du héros : médaillon + chronique côte à côte, puis
           empilés — le médaillon garde sa taille, la chronique passe dessous. */
        @media (max-width: 860px) {
          .i365-chiffre { grid-template-columns: minmax(0,1fr) !important; row-gap: 24px; }
          .i365-medaillon { max-width: 200px; }
          .i365-nombre { font-size: clamp(64px, 22vw, 110px) !important; }
          .i365-dire { grid-template-columns: minmax(0,1fr) !important; row-gap: 24px; }
          .i365-chronique { border-left: none !important; padding-left: 0 !important; border-top: 1px solid ${C.border}; padding-top: 20px; }
          .i365-une { grid-template-columns: minmax(0,1fr) !important; gap: 34px !important; }
          .i365-split { grid-template-columns: minmax(0,1fr) !important; gap: 34px !important; }
          .i365-contact { grid-template-columns: minmax(0,1fr) !important; gap: 34px !important; }
          .i365-avis-decale { transform: none !important; }
        }
        @media (max-width: 700px) {
          .i365-reperes { grid-template-columns: repeat(auto-fit, minmax(min(150px,100%),1fr)) !important; }
          .i365-reperes .i365-repcell { border-left: none !important; }
        }

        /* Les colonnes décalées des avis : le décalage n'existe qu'au large. */
        @media (min-width: 861px) {
          .i365-avis-decale { transform: translateY(26px); }
        }

        /* La rose des vents tourne en 90 s : on ne la voit pas tourner,
           on sent que le vent change. */
        @keyframes i365-vent { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .i365-rose { animation: i365-vent 90s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .i365-rose { animation: none !important; }
        }
      `}</style>

      {/* ── NAV — collante à quatre propriétés : hauteur, fond, flou, filet ─ */}
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
          background: scrolled ? "rgba(251,250,244,0.93)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          transition: `all .55s ${EASE_CSS}`,
        }}
      >
        <a href="#hero" style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, textDecoration: "none" }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={ferme} style={{ height: 30, maxWidth: 170, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Sprout size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 500, color: C.ink, letterSpacing: "0.004em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ferme}</span>
            </>
          )}
        </a>
        <div id="i365-nav" style={{ display: "flex", gap: "clamp(16px,2vw,28px)", alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <NavLink key={l} label={l} href={h} />
          ))}
          <CTA href={telHref} filled>
            Panier de la semaine
          </CTA>
        </div>
        {/* L'appel à l'action sous le pouce : la barre est fixe, mais son
            bouton vit dans le menu déroulant, en display:none sous le point
            de rupture. Celui-ci paraît exactement avec le bouton de menu. */}
        <ActionMobile href={telHref} fond={C.accent} encre={C.white}>
          Appeler
        </ActionMobile>
        <button
          className="i365-burger"
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
        <div style={{ position: "fixed", top: 68, left: 0, right: 0, zIndex: 99, background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "18px clamp(20px,5vw,32px) 26px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ fontFamily: SANS, color: C.ink, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "12px 0" }}>
              {l}
            </a>
          ))}
          <a href={telHref} style={{ fontFamily: SANS, background: C.accent, color: C.white, borderRadius: 4, padding: "14px 22px", fontSize: 15, fontWeight: 600, textDecoration: "none", textAlign: "center", marginTop: 10 }}>
            Panier de la semaine
          </a>
        </div>
      )}

      {/* ══ HÉROS H7 — la une du magazine de saison ════════════════════════
          Méta-rangée filetée, titre serif géant, bandeau média posé en bas :
          le médaillon du panier (HeldSwap) y tourne avec sa chronique. */}
      <section
        id="hero"
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "clamp(22px,3vh,38px)",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(104px,11vw,140px) clamp(20px,4.5vw,56px) clamp(36px,4vw,56px)",
          overflow: "hidden",
        }}
      >
        {/* ── HERO — le chiffre en avant : « 0 km » ─────────────────────────
               La distance entre le champ et la boutique est l'argument entier
               d'une ferme en vente directe : elle prend la place du titre. La
               une de gazette — méta-rangée, titre géant, bandeau — était la
               composition d'impact-331 et d'impact-350. Le médaillon
               HeldSwap reste, en regard du chiffre. */}

        {/* La rose des vents, en marge — le détail gratuit. */}
        <div aria-hidden className="i365-rose" style={{ position: "absolute", top: "clamp(96px,10vw,130px)", right: "clamp(22px,4vw,58px)" }}>
          <RoseDesVents size={54} color={C.accent} opacity={0.4} />
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}>
          <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: C.accentDark }}>
            {clientEyebrow(sessionData) ?? "Ferme bio · Vallée du Lot"}
          </span>
        </motion.div>

        {/* ── LE CHIFFRE, et le médaillon en regard ──────────────────────── */}
        <div className="i365-chiffre">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 1, ease: EASE }}
            style={{ minWidth: 0 }}
          >
            <div className="i365-nombre" style={{ fontFamily: SERIF, fontSize: "clamp(88px,15vw,224px)", fontWeight: 400, lineHeight: 0.82, letterSpacing: "-0.04em", color: C.ink, marginLeft: "-0.04em" }}>
              {STATS[3]?.value ?? "0 km"}
            </div>
            <div style={{ fontFamily: SANS, fontSize: "clamp(12px,1.15vw,14px)", letterSpacing: "0.22em", textTransform: "uppercase", color: C.textMuted, marginTop: "clamp(14px,1.8vw,22px)", lineHeight: 1.7, maxWidth: 340 }}>
              {STATS[3]?.label ?? "Entre le champ et la boutique"}
            </div>
          </motion.div>

          {/* LE MÉDAILLON — le geste. La récolte sort en basculant, la table
              reste vide un demi-temps, la suivante se pose. */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34, duration: 0.95, ease: EASE }} className="i365-medaillon">
            <span aria-hidden style={{ position: "absolute", inset: -12, borderRadius: "50%", border: `1px solid ${C.border}` }} />
            <span aria-hidden style={{ position: "absolute", inset: -12, borderRadius: "50%", border: `1px dashed ${C.accent}`, opacity: 0.35, transform: "scale(1.09)" }} />
            <HeldSwap index={i} tilt={8}>
              <div
                style={{
                  borderRadius: "50%",
                  overflow: "hidden",
                  aspectRatio: "1",
                  border: `4px solid ${C.white}`,
                  boxShadow: "0 22px 48px -20px rgba(36,42,25,0.45), 0 2px 0 0 rgba(255,255,255,0.6)",
                  background: `radial-gradient(circle at 40% 32%, ${C.accentLight} 0%, ${C.bgAlt} 78%)`,
                }}
              >
                {S.img ? (
                  <img src={S.img} alt={S.alt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
                    <RoseDesVents size={64} color={C.accent} opacity={0.45} />
                  </div>
                )}
              </div>
            </HeldSwap>
          </motion.div>
        </div>

        {/* la règle qui sépare le chiffre de ce qu'il garantit */}
        <span aria-hidden style={{ height: 1, background: `linear-gradient(90deg, ${C.accent}, ${C.border} 42%, transparent)` }} />

        {/* ── Ce que le chiffre veut dire ────────────────────────────────── */}
        <div className="i365-dire">
          <div style={{ minWidth: 0 }}>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.9, ease: EASE }}
              style={{ fontFamily: SERIF, fontSize: "clamp(26px,3.4vw,44px)", fontWeight: 400, color: C.ink, lineHeight: 1.05, letterSpacing: "-0.015em", margin: 0, overflowWrap: "break-word" }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ??
                c?.heroHeadline ??
                clientHeroLine(sessionData, 0, 1, 40) ??
                "Ce que la terre donne, la semaine où elle le donne."}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52, duration: 0.9, ease: EASE }}
              style={{ fontFamily: SANS, fontSize: "clamp(14.5px,1.3vw,16.5px)", color: C.textMuted, lineHeight: 1.78, maxWidth: 500, margin: "clamp(14px,1.8vw,20px) 0 clamp(20px,2.6vw,28px)" }}
            >
              {clientHeroSubtitle(sessionData) ??
                c?.heroSubline ??
                "Maraîchage bio, œufs de plein air, poulets fermiers : la ferme vend en direct ce qu'elle produit, au rythme des saisons. Paniers de la semaine, boutique à la ferme et marché de Cahors."}
            </motion.p>
            {/* Une seule action pleine ; la production reste un lien. */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62, duration: 0.85, ease: EASE }} style={{ display: "flex", gap: "clamp(16px,2vw,26px)", flexWrap: "wrap", alignItems: "center" }}>
              <CTA href={telHref} filled big>
                Réserver mon panier
              </CTA>
              <a href="#services" style={{ fontFamily: SANS, fontSize: 13, color: C.ink, textDecoration: "none", borderBottom: `1px solid ${C.accent}`, paddingBottom: 3 }}>
                Ce qu'on produit
              </a>
            </motion.div>
          </div>

          {/* La chronique de la récolte montrée, et de quoi passer aux autres. */}
          <div className="i365-chronique">
            <HeldSwap index={`t-${i}`} tilt={0}>
              <div>
                <div style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: C.accentDark, marginBottom: 8 }}>{S.k}</div>
                <div style={{ fontFamily: SERIF, fontSize: "clamp(17px,1.8vw,23px)", fontWeight: 500, color: C.ink, lineHeight: 1.22, letterSpacing: "-0.008em" }}>{S.line}</div>
                <div style={{ fontFamily: SANS, fontSize: 13, color: C.textMuted, lineHeight: 1.65, marginTop: 8 }}>{S.sub}</div>
              </div>
            </HeldSwap>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              {HERO.map((h: any, n: number) => (
                <button
                  key={h.k ?? n}
                  type="button"
                  onClick={() => go(n)}
                  aria-label={h.k ?? `Récolte ${n + 1}`}
                  aria-current={n === i}
                  style={{ width: 34, height: 3, padding: 0, border: "none", borderRadius: 2, cursor: "pointer", background: n === i ? C.accentDark : C.border, transition: "background .3s" }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ RESPIRATION — une phrase, rien d'autre ════════════════════════ */}
      <section style={{ background: C.bgAlt, padding: "clamp(72px,10vw,144px) clamp(24px,8vw,140px)", textAlign: "center" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
            <Kicker color={C.textMuted} align="center">
              La règle de la maison
            </Kicker>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(24px,3.5vw,48px)", lineHeight: 1.32, fontWeight: 400, maxWidth: 920, margin: "0 auto", color: C.ink, letterSpacing: "-0.008em" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (
              <>En juin les fraises, en janvier les poireaux. On ne force rien — c'est le principe.</>
            )}
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <span aria-hidden style={{ display: "block", width: 1, height: 72, background: `linear-gradient(${C.accent}, transparent)`, margin: "clamp(34px,4vw,52px) auto 0" }} />
        </Reveal>
      </section>

      {/* ══ REPÈRES — le sommaire chiffré, en rangée filetée ══════════════
          Pas de bande sombre : les chiffres tiennent sur le papier, séparés
          par des filets verticaux, comme les repères d'un ours de magazine. */}
      <section style={{ background: C.bg, padding: "clamp(48px,6vw,84px) clamp(20px,4.5vw,56px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div
            className="i365-reperes"
            style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 0, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}
          >
            {STATS.map((s: any, idx: number) => (
              <Reveal key={s.label ?? idx} delay={idx * 0.07}>
                <div className="i365-repcell" style={{ padding: "clamp(22px,2.6vw,34px) clamp(14px,1.8vw,26px)", borderLeft: idx > 0 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ fontFamily: SERIF, fontSize: "clamp(30px,3.4vw,46px)", fontWeight: 500, color: C.accentDark, lineHeight: 1, letterSpacing: "-0.01em" }}>{s.value}</div>
                  <div style={{ fontFamily: SANS, fontSize: 12, color: C.textFaint, lineHeight: 1.55, marginTop: 10 }}>{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ NOS PRODUITS — la « une » du marché : article de tête + brèves ═ */}
      <section id="services" style={{ position: "relative", background: C.bg, padding: "clamp(56px,7vw,108px) clamp(20px,4.5vw,56px) clamp(72px,9vw,132px)", overflow: "hidden" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(34px,4vw,54px)", maxWidth: 760 }}>
              <Kicker>Nos produits</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4.6vw,60px)", fontWeight: 400, color: C.ink, marginTop: 18, lineHeight: 1.05, letterSpacing: "-0.016em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                  <>
                    Peu de choses,
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accentDark }}>mais les nôtres.</em>
                  </>
                )}
              </h2>
            </div>
          </Reveal>
          <div
            className="i365-une"
            style={{ display: "grid", gridTemplateColumns: "minmax(0,0.94fr) minmax(0,1.06fr)", gap: "clamp(28px,4.5vw,72px)", alignItems: "start" }}
          >
            {/* L'article de tête : la première prestation, traitée en grand. */}
            <Reveal y={30}>
              <article
                style={{
                  position: "relative",
                  background: C.bgDark,
                  borderRadius: 14,
                  padding: "clamp(30px,3.4vw,48px)",
                  color: C.white,
                  overflow: "hidden",
                  minHeight: "clamp(300px,32vw,420px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                {/* glow végétal : le fond sombre ne doit pas être un trou */}
                <span aria-hidden style={{ position: "absolute", top: "-38%", right: "-24%", width: "80%", aspectRatio: "1", borderRadius: "50%", background: `radial-gradient(circle at 50% 50%, ${C.pousse} 0%, transparent 64%)`, opacity: 0.12, pointerEvents: "none" }} />
                <span aria-hidden style={{ position: "absolute", top: 18, left: 24, fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(90px,10vw,150px)", lineHeight: 1, color: C.pousse, opacity: 0.09, pointerEvents: "none", userSelect: "none" }}>
                  01
                </span>
                <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: C.pousse, marginBottom: 14 }}>{SERVICES[0]?.tag}</span>
                <h3 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.2vw,44px)", fontWeight: 500, lineHeight: 1.06, margin: "0 0 14px", letterSpacing: "-0.012em" }}>{SERVICES[0]?.titre}</h3>
                <p style={{ fontFamily: SANS, fontSize: 15, color: "rgba(255,255,255,0.78)", lineHeight: 1.75, margin: 0, maxWidth: 460 }}>{SERVICES[0]?.desc}</p>
              </article>
            </Reveal>

            {/* Les brèves : le reste de l'étal, en sommaire fileté. */}
            <div>
              {SERVICES.slice(1).map((s: any, idx: number) => (
                <BreveProduit key={`${s.titre}-${idx}`} s={s} idx={idx} dernier={idx === SERVICES.length - 2} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ LA FERME — quatre temps sur un bandeau fileté ═════════════════ */}
      <section id="methode" style={{ position: "relative", background: C.bgAlt, padding: "clamp(72px,9vw,132px) clamp(20px,4.5vw,56px)", overflow: "hidden" }}>
        {/* la rose, en filigrane du bandeau */}
        <div aria-hidden className="i365-rose" style={{ position: "absolute", bottom: "clamp(-60px,-4vw,-30px)", left: "clamp(-40px,-3vw,-20px)" }}>
          <RoseDesVents size={220} color={C.accent} opacity={0.06} />
        </div>
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(34px,4vw,54px)", maxWidth: 740 }}>
              <Kicker>La ferme</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4.6vw,58px)", fontWeight: 400, color: C.ink, marginTop: 18, lineHeight: 1.05, letterSpacing: "-0.016em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                  <>
                    Bio, locale,
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accentDark }}>et ça se vérifie.</em>
                  </>
                )}
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px,100%), 1fr))", gap: "clamp(10px,1.6vw,20px)" }}>
            {METHODE.map((m, idx) => (
              <TempsFerme key={m.n} m={m} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ ENGAGEMENTS — la photographie du jardin, et la liste tenue ═════ */}
      <section id="engagements" style={{ background: C.bg, padding: "clamp(72px,9vw,132px) clamp(20px,4.5vw,56px)" }}>
        <div
          className="i365-split"
          style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,0.94fr) minmax(0,1.06fr)", gap: "clamp(28px,5vw,72px)", alignItems: "center" }}
        >
          <Reveal>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  borderRadius: 14,
                  border: `1px solid ${C.border}`,
                  background: `radial-gradient(circle at 40% 30%, ${C.accentLight} 0%, ${C.bgAlt} 76%)`,
                  aspectRatio: "4/3",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {photo(3, "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80") ? (
                  <img
                    src={photo(3, "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80")}
                    alt="Le jardin de la ferme en pleine saison"
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <RoseDesVents size={110} color={C.accent} opacity={0.4} />
                )}
              </div>
              {/* le cadre décalé : un filet posé en débord, comme une photo
                  épinglée de travers dans la gazette */}
              <span aria-hidden style={{ position: "absolute", inset: 0, borderRadius: 14, border: `1px solid ${C.accent}`, opacity: 0.35, transform: "translate(12px, 12px)", pointerEvents: "none", zIndex: -1 }} />
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              <Kicker>Nos engagements</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,4vw,50px)", fontWeight: 400, color: C.ink, margin: "18px 0 26px", lineHeight: 1.07, letterSpacing: "-0.014em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>
                    La transparence
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accentDark }}>jusqu'au bout du rang.</em>
                  </>
                )}
              </h2>
              {ENGAGEMENT.map((e: string, idx: number) => (
                <div key={idx} style={{ display: "flex", gap: 13, marginBottom: 15, paddingBottom: 15, borderBottom: idx < ENGAGEMENT.length - 1 ? `1px solid ${C.border}` : "none" }}>
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
        </div>
      </section>

      {/* ══ PANIERS & PRIX — la mercuriale à points de conduite ═══════════ */}
      <section id="tarifs" style={{ background: C.bgAlt, padding: "clamp(72px,9vw,132px) clamp(20px,4.5vw,56px)" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "clamp(30px,3.4vw,46px)" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Kicker align="center">Paniers & prix</Kicker>
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4.4vw,56px)", fontWeight: 400, color: C.ink, margin: "18px 0 0", lineHeight: 1.06, letterSpacing: "-0.014em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                  <>
                    Le juste prix, <em style={{ fontStyle: "italic", color: C.accentDark }}>des deux côtés.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 15, color: C.textMuted, maxWidth: 560, margin: "16px auto 0", lineHeight: 1.76 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.texte") ?? (
                  <>Sans engagement : on réserve son panier avant mardi soir, on le retire vendredi à la ferme ou samedi au marché.</>
                )}
              </p>
            </div>
          </Reveal>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
            {TARIFS.map((t: any, idx: number) => (
              <MercurialeLigne key={`${t.a}-${idx}`} t={t} idx={idx} />
            ))}
            <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 10 }} />
          </div>
        </div>
      </section>

      {/* ══ AVIS — colonnes décalées, le seul fond sombre de la page ═══════ */}
      <section style={{ position: "relative", background: C.bgDark, padding: "clamp(76px,9vw,134px) clamp(20px,4.5vw,56px)", overflow: "hidden" }}>
        {/* glow végétal, très faible */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: "-32%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(120vw, 1100px)",
            aspectRatio: "1",
            borderRadius: "50%",
            background: `radial-gradient(circle at 50% 50%, ${C.pousse} 0%, transparent 62%)`,
            opacity: 0.1,
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", maxWidth: 1140, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
              <Kicker color={C.pousse} align="center">
                Ils en parlent
              </Kicker>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,4vw,52px)", fontWeight: 400, color: C.white, textAlign: "center", lineHeight: 1.08, letterSpacing: "-0.014em", margin: "0 0 clamp(38px,4.5vw,60px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                <>
                  Ils mangent <em style={{ fontStyle: "italic", color: C.pousse }}>la semaine de la ferme</em>.
                </>
              )}
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px,100%), 1fr))", gap: "clamp(16px,2vw,26px)", alignItems: "start" }}>
            {AVIS.map((a: any, idx: number) => (
              <AvisCarte key={`${a.auteur}-${idx}`} a={a} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTACT — la boutique ═════════════════════════════════════════ */}
      <section id="contact" style={{ background: C.bg, padding: "clamp(72px,9vw,132px) clamp(20px,4.5vw,56px)" }}>
        <div className="i365-contact" style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1.06fr) minmax(0,0.94fr)", gap: "clamp(28px,5vw,72px)", alignItems: "center" }}>
          <Reveal>
            <div>
              <Kicker>La boutique</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4.6vw,58px)", fontWeight: 400, color: C.ink, margin: "18px 0 18px", lineHeight: 1.05, letterSpacing: "-0.016em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                  <>
                    Passez à la ferme,
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accentDark }}>repartez avec la semaine.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 16, color: C.textMuted, maxWidth: 480, lineHeight: 1.78, marginBottom: 30 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ?? (
                  <>Boutique mercredi et vendredi soir, samedi matin. Paniers réservés par téléphone ou SMS avant mardi soir.</>
                )}
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
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: "clamp(24px,2.6vw,34px)", boxShadow: "0 40px 76px -64px rgba(36,42,25,0.7)" }}>
              <Kicker color={C.textFaint}>La ferme</Kicker>
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <MapPin size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontFamily: SANS, fontSize: 14.5, color: C.textMuted, lineHeight: 1.66 }}>{clientAddress(sessionData) ?? clientCity(sessionData) ?? "Cahors, Lot"}</span>
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
                  <span style={{ fontFamily: SANS, fontSize: 14.5, color: C.textMuted, lineHeight: 1.66 }}>Boutique ferme : Mer & Ven 16h–19h · Sam 9h–13h</span>
                </div>
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 22, paddingTop: 18 }}>
                <p style={{ fontFamily: SANS, fontSize: 13.5, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>
                  {clientTagline(sessionData) ?? "La ferme se visite le premier samedi du mois — et sur demande pour les écoles."}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ PIED ══════════════════════════════════════════════════════════ */}
      <footer style={{ background: C.bgDarkAlt, padding: "clamp(44px,5vw,64px) clamp(20px,4.5vw,56px) 26px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 34 }}>
            <div style={{ maxWidth: 380 }}>
              <div style={{ fontFamily: SERIF, fontSize: 25, fontWeight: 500, color: C.pousse, marginBottom: 10 }}>{ferme}</div>
              <p style={{ fontFamily: SANS, color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.75, margin: 0 }}>
                {clientTrade(sessionData) ?? "Ferme en agriculture biologique"} · {ville}
                <br />
                Certifiée AB — vente directe et marchés
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <MapPin size={13} />, t: clientAddress(sessionData) ?? clientCity(sessionData) ?? "Cahors, Lot" },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Mail size={13} />, t: mail },
                { icon: <Clock size={13} />, t: "Boutique ferme : Mer & Ven 16h–19h · Sam 9h–13h" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.44)", fontFamily: SANS, fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.pousse, display: "flex" }}>{item.icon}</span>
                  {item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontFamily: SANS, color: "rgba(255,255,255,0.28)", fontSize: 12 }}>
              © 2026 {ferme} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
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
