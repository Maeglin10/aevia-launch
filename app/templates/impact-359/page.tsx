"use client";
// @ts-nocheck

/* ════════════════════════════════════════════════════════════════════════════
   {clientName(sessionData) ?? "Locamat"} — Location de matériel BTP & espaces verts · Nancy
   ─────────────────────────────────────────────────────────────────────────────
   Location de matériel, 1re variante du catalogue (la 2e est impact-360, orientée
   réception). Celle-ci est le dépôt de chantier : acier, gasoil, VGP à jour.

   Geste signature : BentoCascade — les tuiles se vident et se remplissent en
   cascade verticale, 55 ms d'écart. C'est le parc qui se recompose quand on
   change de famille de matériel : terrassement, jardin, bâtiment.

   Archétype héros : H5 — RAIL LATÉRAL FIXE (bande de chantier à rayures, avec
   le compteur et les flèches) + titre monumental. Le rail ne bouge jamais ; la
   grille, elle, se recharge.

   Fontes : P6 — Archivo (titres, grasse d'affichage) × Inter (texte). Deux sans
   aux rôles opposés : la voix d'impact d'un côté, la lecture de l'autre.

   Signature visuelle : le parc en tuiles inégales, les rayures de chantier
   dessinées en CSS (jamais une image), les chiffres monumentaux en bande.
   ════════════════════════════════════════════════════════════════════════════ */

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, Clock, HardHat, Mail, MapPin, Phone, TreePine, Truck, Wrench, Zap } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { BentoCascade, DWELL, HairlineArrows, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
import { FixedRail } from "@/lib/templates/hero-kit-3";
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
  bg: "#0e1013",
  bgAlt: "#14181e",
  bgDark: "#090b0e",
  bgDarkAlt: "#050608",
  bgCard: "#171c23",
  accent: "var(--brand, #e08a1e)",
  accentDark: "var(--brand-light, #f2ac52)",
  accentLight: "#1f1810",
  ink: "#f2f1ed",
  textMuted: "#99a0ab",
  textFaint: "#6b727e",
  border: "rgba(255,255,255,0.09)",
  white: "#ffffff",
  /* clé métier : l'acier du parc, le seul gris qui n'est pas du texte */
  acier: "#7f8a97",
};

const DISPLAY = "'Archivo', Impact, system-ui, sans-serif";
const SANS = "'Inter', system-ui, -apple-system, sans-serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_CSS = "cubic-bezier(.16,1,.3,1)";

const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,600;0,800;0,900;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap');`;

const NAV = [
  { l: "Le parc", h: "#parc" },
  { l: "Comment louer", h: "#methode" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Le dépôt", h: "#contact" },
];

/* ── Données de démonstration ────────────────────────────────────────────── */

/*
  Les trois familles du dépôt, avec leurs neuf machines, telles que le thème les
  écrivait. Le titre monumental reprend la légende de chaque famille : rien
  d'inventé, la phrase change seulement d'échelle.
*/
const HERO_SOURCE = [
  {
    k: "Terrassement",
    sub: "Ce qui creuse, nivelle et compacte.",
    l1: "Le bon outil,",
    l2: "juste le temps qu'il faut.",
    rail: "#1f1810",
    tiles: [
      { icon: HardHat, t: "Mini-pelles 1 à 5 t", d: "Livrées sur remorque ou porte-engin, godets au choix." },
      { icon: Wrench, t: "Plaques & pilonneuses", d: "Compactage tranchées et allées, EPI fournis." },
      { icon: Truck, t: "Dumpers & brouettes motorisées", d: "Évacuer sans se casser le dos, même en pente." },
    ],
  },
  {
    k: "Jardin",
    sub: "Ce qui taille, broie et tond — en grand.",
    l1: "Ce qui taille,",
    l2: "broie et tond — en grand.",
    rail: "#131c14",
    tiles: [
      { icon: TreePine, t: "Broyeurs de branches", d: "Jusqu'à 12 cm de diamètre, le tas d'automne en une matinée." },
      { icon: Wrench, t: "Motoculteurs & tondeuses pro", d: "Autoportées et débroussailleuses pour les grands terrains." },
      { icon: TreePine, t: "Carottes & tarières", d: "Clôtures et plantations : le trou parfait sans pioche." },
    ],
  },
  {
    k: "Bâtiment",
    sub: "Ce qui monte, perce et alimente.",
    l1: "Ce qui monte,",
    l2: "perce et alimente.",
    rail: "#141821",
    tiles: [
      { icon: HardHat, t: "Échafaudages roulants", d: "Alu certifiés, notice de montage et garde-corps complets." },
      { icon: Zap, t: "Groupes électrogènes", d: "2 à 40 kVA, silencieux disponibles pour l'événementiel." },
      { icon: Wrench, t: "Perfos, carotteuses, rainureuses", d: "Le gros électroportatif qui ne s'achète pas pour un week-end." },
    ],
  },
];
let HERO = HERO_SOURCE;

/*
  Le parc en tuiles inégales : les six familles du catalogue, dessinées à des
  tailles différentes pour que la grille ressemble à un dépôt et non à un
  tableau. Les `span` sont repris en classe au point de rupture.
*/
function SERVICES_SOURCE_LIVE() {
  return [
    { titre: "Terrassement & compactage", desc: "Mini-pelles, dumpers, plaques : révision entre chaque location, carnet de maintenance consultable, prise en main faite au dépôt.", tag: "TP", icon: HardHat, span: 2 },
    { titre: "Espaces verts", desc: "Broyeurs, tarières, débroussailleuses professionnelles : affûtés, réglés, avec les EPI qui vont avec (fournis).", tag: "Jardin", icon: TreePine, span: 1 },
    { titre: "Élévation", desc: "Échafaudages roulants alu, échelles pro : conformes, complets, avec notice — et le rappel des règles avant le départ.", tag: "Hauteur", icon: Wrench, span: 1 },
    { titre: "Énergie & pompage", desc: "Groupes électrogènes, pompes vide-cave, chauffages de chantier : la panne et la montée d'eau n'attendent pas.", tag: "Énergie", icon: Zap, span: 1 },
    { titre: "Livraison chantier", desc: "Camion-grue et porte-engin : la machine posée où vous travaillez, reprise à la fin. Sur " + (clientCity(sessionData) ?? "Nancy") + " et 40 km.", tag: "Livraison", icon: Truck, span: 1 },
    { titre: "Conseil d'usage", desc: "Le bon calibre pour votre chantier — pas le plus gros. On préfère relouer la bonne machine que reprendre la mauvaise cassée.", tag: "Conseil", icon: Wrench, span: 2 },
  ];
}
let SERVICES_SOURCE = SERVICES_SOURCE_LIVE();
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE = [
  { n: "01", t: "Réserver au téléphone", d: "On vérifie le calibre avec vous, la machine est bloquée à votre nom, caution annoncée d'avance." },
  { n: "02", t: "Prise en main au dépôt", d: "Démarrage, sécurités, gestes de base : dix minutes qui évitent la panne du samedi midi." },
  { n: "03", t: "Le chantier chez vous", d: "Carburant fourni au départ (plein/plein), assistance téléphonique aux heures d'ouverture." },
  { n: "04", t: "Retour vérifié ensemble", d: "État contradictoire au retour, caution levée immédiatement — pas de retenue surprise à J+15." },
];

const ENGAGEMENT_DEMO = [
  "Vérifications générales périodiques (VGP) à jour, registres consultables au comptoir",
  "Révision et nettoyage entre chaque location — une machine sale ne repart pas",
  "EPI de base fournis avec chaque machine à risque (casque, lunettes, gants)",
  "Caution transparente : montant affiché, levée au retour après état contradictoire",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

const TARIFS_DEMO = [
  { a: "Mini-pelle 1,8 t", p: "180 €/jour", n: "Godets 30/60 cm inclus, remorque +30 €/jour, permis BE requis." },
  { a: "Broyeur de branches (8 cm)", p: "95 €/jour", n: "EPI fournis, sacs de collecte disponibles." },
  { a: "Échafaudage roulant 8 m", p: "65 €/jour", n: "Complet avec garde-corps et stabilisateurs, montage expliqué." },
  { a: "Plaque vibrante 90 kg", p: "45 €/jour", n: "Dégressif : 3 jours = 2,5 ; semaine = 4 jours." },
];
let TARIFS = TARIFS_DEMO;

const AVIS_SOURCE = [
  { texte: "Mini-pelle réservée le jeudi, livrée le samedi 7h30 posée dans le jardin, reprise le lundi. La piscine est creusée, le dos est intact, la caution levée au retour du camion.", auteur: "Fabrice N.", detail: "Particulier — terrassement" },
  { texte: "Artisan, je loue chez eux ce que je n'amortis pas : carotteuse, groupe, échafaudage. Les machines démarrent, les VGP sont à jour, la facture mensuelle est propre.", auteur: "SARL Maçonnerie Grandidier", detail: "Compte pro" },
  { texte: "On m'a déconseillé la grosse tarière « qui fait peur » pour un modèle une personne, moitié prix. Vingt trous de clôture plus tard : ils avaient raison.", auteur: "Sylvain P.", detail: "Conseil de calibre" },
];
let AVIS_DEMO = AVIS_SOURCE;

const STATS_DEMO = [
  { value: "400+", label: "Références au parc" },
  { value: "VGP", label: "Contrôles réglementaires à jour" },
  { value: "7h", label: "Retrait dès l'ouverture" },
  { value: "J+1", label: "Livraison sur chantier" },
];
let STATS = STATS_DEMO;

function ZONES_SOURCE_LIVE() {
  return [clientCity(sessionData) ?? "Nancy", "Meurthe-et-Moselle", "40 km autour du dépôt"];
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
      transition={{ duration: 0.82, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Le kicker du thème : filet 40×1 px, puis les capitales filées à 0.38em. */
function Kicker({ children, color = C.accent, align = "left" }: { children: React.ReactNode; color?: string; align?: "left" | "center" }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 14, justifyContent: align === "center" ? "center" : "flex-start" }}>
      <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${color})`, flexShrink: 0 }} />
      <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.38em", textTransform: "uppercase", color }}>{children}</span>
      {align === "center" && <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${color}, transparent)`, flexShrink: 0 }} />}
    </span>
  );
}

/** Les rayures de chantier : la seule texture du thème, et elle est en CSS. */
function Rayures({ opacity = 0.14, taille = 16, teinte = "rgba(224,138,30,0.9)" }: { opacity?: number; taille?: number; teinte?: string }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity,
        backgroundImage: `repeating-linear-gradient(45deg, ${teinte} 0px, ${teinte} ${taille / 2}px, transparent ${taille / 2}px, transparent ${taille}px)`,
      }}
    />
  );
}

/** Le chiffre fantôme du thème : gras d'affichage, opacité 0.06. */
function GhostNum({ children, size = "clamp(96px,13vw,196px)", right = false, color = "rgba(255,255,255,0.045)" }: { children: React.ReactNode; size?: string; right?: boolean; color?: string }) {
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        top: "-0.22em",
        left: right ? "auto" : "-0.02em",
        right: right ? "-0.02em" : "auto",
        fontFamily: DISPLAY,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: "-0.05em",
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
        letterSpacing: "0.13em",
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
          height: 2,
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
        borderRadius: 2,
        textDecoration: "none",
        border: `1px solid ${filled ? "transparent" : h ? C.accent : C.border}`,
        background: filled ? (h ? C.accentDark : C.accent) : h ? "rgba(255,255,255,0.05)" : "transparent",
        color: filled ? "#141110" : C.ink,
        boxShadow: h && filled ? "0 18px 38px -20px rgba(224,138,30,0.55), 0 3px 12px -7px rgba(0,0,0,0.7)" : "0 0 0 rgba(0,0,0,0)",
        transform: h ? "translateY(-2px)" : "none",
        transition: `background .5s ${EASE_CSS}, box-shadow .5s ${EASE_CSS}, transform .5s ${EASE_CSS}, border-color .5s ${EASE_CSS}`,
      }}
    >
      {children}
      <ArrowRight size={14} style={{ transform: h ? "translateX(4px)" : "none", transition: `transform .5s ${EASE_CSS}` }} />
    </a>
  );
}

/** Une tuile du parc : taille inégale, coin coupé, filet d'accent au survol. */
function ParcTuile({ item, i }: { item: any; i: number }) {
  const [h, setH] = useState(false);
  const Icon = item.icon ?? Wrench;
  return (
    <Reveal delay={(i % 3) * 0.055} style={{ gridColumn: `span ${item.span ?? 1}` }}>
      <article
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          position: "relative",
          height: "100%",
          overflow: "hidden",
          background: h ? C.bgCard : C.bgAlt,
          border: `1px solid ${h ? C.accent : C.border}`,
          padding: "clamp(24px,3vw,38px) clamp(20px,2.4vw,32px)",
          clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)",
          transform: h ? "translateY(-6px)" : "none",
          boxShadow: h
            ? "0 34px 62px -40px rgba(0,0,0,0.9), 0 6px 18px -12px rgba(224,138,30,0.35)"
            : "0 0 0 rgba(0,0,0,0)",
          transition: `background .5s ${EASE_CSS}, transform .5s ${EASE_CSS}, box-shadow .5s ${EASE_CSS}, border-color .5s ${EASE_CSS}`,
        }}
      >
        <div aria-hidden style={{ position: "absolute", inset: 0, opacity: h ? 1 : 0, background: "radial-gradient(70% 90% at 12% 6%, rgba(224,138,30,0.10), transparent 62%)", transition: `opacity .5s ${EASE_CSS}` }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, marginBottom: "clamp(18px,2.2vw,26px)" }}>
          <Icon size={22} color={h ? C.accent : C.acier} strokeWidth={1.4} aria-hidden style={{ transition: `color .5s ${EASE_CSS}` }} />
          <span
            style={{
              fontFamily: SANS,
              fontSize: 9.5,
              fontWeight: 600,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: C.accent,
              background: C.accentLight,
              border: `1px solid ${h ? C.accent : "transparent"}`,
              padding: "5px 11px",
              transition: `border-color .5s ${EASE_CSS}`,
            }}
          >
            {item.tag}
          </span>
        </div>
        <h3 style={{ position: "relative", fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(19px,2vw,27px)", color: C.ink, margin: "0 0 12px", lineHeight: 1.06, letterSpacing: "-0.018em", textTransform: "uppercase" }}>{item.titre}</h3>
        <p style={{ position: "relative", fontFamily: SANS, fontSize: "clamp(13.5px,1.1vw,15px)", fontWeight: 300, color: C.textMuted, lineHeight: 1.76, margin: 0, maxWidth: 520 }}>{item.desc}</p>
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            height: 2,
            width: h ? "100%" : "0%",
            background: `linear-gradient(90deg, ${C.accent}, transparent)`,
            transition: `width .55s ${EASE_CSS}`,
          }}
        />
      </article>
    </Reveal>
  );
}

/** Une étiquette de parc : le tarif comme sur l'étiquette accrochée à l'engin. */
function EtiquetteTarif({ item, i }: { item: any; i: number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={i * 0.055}>
      <div
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          position: "relative",
          height: "100%",
          background: h ? C.bgCard : C.bgAlt,
          border: `1px solid ${h ? C.accent : C.border}`,
          borderLeft: `3px solid ${h ? C.accent : C.acier}`,
          padding: "clamp(24px,2.8vw,34px) clamp(22px,2.4vw,30px) clamp(24px,2.8vw,34px) clamp(34px,3.4vw,44px)",
          transform: h ? "translateY(-5px)" : "none",
          boxShadow: h ? "0 30px 58px -40px rgba(0,0,0,0.9), 0 5px 16px -11px rgba(224,138,30,0.3)" : "0 0 0 rgba(0,0,0,0)",
          transition: `background .5s ${EASE_CSS}, transform .5s ${EASE_CSS}, box-shadow .5s ${EASE_CSS}, border-color .5s ${EASE_CSS}`,
        }}
      >
        {/* l'œillet de l'étiquette : le détail gratuit du thème */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: "clamp(12px,1.4vw,18px)",
            top: "clamp(26px,3vw,36px)",
            width: 9,
            height: 9,
            borderRadius: 99,
            border: `1px solid ${h ? C.accent : C.acier}`,
            transition: `border-color .5s ${EASE_CSS}`,
          }}
        />
        <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(26px,3vw,38px)", color: h ? C.accent : C.ink, lineHeight: 1, letterSpacing: "-0.03em", transition: `color .5s ${EASE_CSS}` }}>{item.p}</div>
        <div style={{ fontFamily: SANS, fontSize: "clamp(14.5px,1.2vw,16.5px)", fontWeight: 600, color: C.ink, marginTop: 14 }}>{item.a}</div>
        <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 300, color: C.textFaint, marginTop: 9, lineHeight: 1.72 }}>{item.n}</div>
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
export default function LocamatPage() {
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

  SERVICES_SOURCE = SERVICES_SOURCE_LIVE();
  ZONES_SOURCE = ZONES_SOURCE_LIVE();
  HERO = HERO_SOURCE;

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

  brand = fd?.brandColor ?? null;
  if (brand) C = { ...C, accent: brand };

  const SERVICES = resolveList(
    CLIENT_SERVICES?.map((s: any, n: number) => ({
      ...SERVICES_DEMO[n % SERVICES_DEMO.length],
      titre: s.title ?? SERVICES_DEMO[n % SERVICES_DEMO.length].titre,
      desc: s.description ?? s.desc ?? SERVICES_DEMO[n % SERVICES_DEMO.length].desc,
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

  /* Un seul index pilote tout le héros : rail, titre, tuiles, compteur. */
  const { i, next, prev } = useSlides(HERO.length, DWELL.normal);
  const S = HERO[i];

  /*
    Le titre monumental. La première famille porte celui du client quand la
    génération en a produit un ; les suivantes montrent les autres rayons du
    dépôt. Archivo 900 en capitales tient 15 signes par ligne au plus grand
    palier : c'est le maxLigne passé au contrat.
  */
  /*
    Les couvertures d'après gardaient la phrase du thème : le visiteur voyait le
    métier d'une autre entreprise en grand titre, quelques secondes après celui
    du client. Elles portent maintenant ses prestations.
  */
  const presta = clientServices(sessionData)?.[i]?.title as string | undefined;
  const l1 = i === 0 ? clientHeroLine(sessionData, 0, 2, 15) ?? S.l1 : presta ?? S.l1;
  const l2 = i === 0 ? clientHeroLine(sessionData, 1, 2, 15) ?? S.l2 : presta ? "" : S.l2;

  /* Les tuiles du geste : trois tailles inégales, la première à cheval. */
  const tiles = S.tiles.map(({ icon: Icon, t, d }: any, n: number) => ({
    area:
      n === 0
        ? { gridColumn: "1 / span 2", gridRow: "1" }
        : n === 1
          ? { gridColumn: "1", gridRow: "2 / span 2" }
          : { gridColumn: "2", gridRow: "2 / span 2" },
    node: (
      <div
        style={{
          height: "100%",
          background: n === 0 ? C.accentLight : C.bgCard,
          border: `1px solid ${n === 0 ? "rgba(224,138,30,0.28)" : C.border}`,
          padding: "clamp(16px,1.9vw,22px) clamp(16px,1.9vw,22px)",
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
          clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",
        }}
      >
        <Icon size={19} color={C.accent} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 600, color: C.ink, marginBottom: 5 }}>{t}</div>
          <div style={{ fontFamily: SANS, fontSize: 12.5, fontWeight: 300, color: C.textMuted, lineHeight: 1.64 }}>{d}</div>
        </div>
      </div>
    ),
  }));

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const marque = fd?.businessName ?? clientName(sessionData) ?? "Locamat";
  const ville = clientCity(sessionData) ?? "Nancy";
  const phone = clientPhone(sessionData) ?? fd?.phone ?? "03 83 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33383000000").replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "resa@locamat-nancy.fr";
  const adresse = clientAddress(sessionData);
  const lieu = clientCodePostalVille(sessionData, "", ville).trim();

  /* Le bandeau du parc : la photo du client s'il en a fourni une, sinon un
     aplat d'acier rayé — le dépôt se tient très bien sans image. */
  const bandeau = photo(1, "");

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip", WebkitFontSmoothing: "antialiased" }}>
      <style>{FONTS_CSS}</style>
      <style>{`
        @media (max-width: 1000px) { #i359-nav { display: none !important; } .i359-burger { display: flex !important; } }
        @media (max-width: 900px) {
          .i359-hero { grid-template-columns: minmax(0,1fr) !important; padding: 112px 22px 56px 60px !important; gap: 32px !important; }
          .i359-hero > * { order: initial !important; }
          .i359-bento { grid-template-columns: minmax(0,1fr) !important; grid-template-rows: auto !important; }
          .i359-bento > div { grid-column: 1 / -1 !important; grid-row: auto !important; }
          .i359-parc { grid-template-columns: minmax(0,1fr) !important; }
          .i359-parc > * { grid-column: auto !important; }
          .i359-split { grid-template-columns: minmax(0,1fr) !important; gap: 32px !important; }
          .i359-split > * { order: initial !important; }
          .i359-statband { grid-template-columns: repeat(auto-fit, minmax(min(150px,100%),1fr)) !important; }
          .i359-statcell { border-right: none !important; border-top: 1px solid rgba(255,255,255,0.08) !important; }
          .i359-methode { grid-template-columns: minmax(0,1fr) !important; }
          .i359-sticky { position: static !important; }
          .i359-avisrow { grid-template-columns: minmax(0,1fr) !important; gap: 14px !important; }
          .i359-pad { padding-left: 22px !important; padding-right: 22px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .i359-anim { transition: none !important; animation: none !important; }
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
          background: scrolled ? "rgba(14,16,19,0.92)" : "transparent",
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
              <Wrench size={17} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 19, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", letterSpacing: "-0.02em", textTransform: "uppercase" }}>{marque}</span>
              <span style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.28em", textTransform: "uppercase", color: C.textFaint, marginLeft: 6 }}>{clientTrade(sessionData) ?? "Location matériel"}</span>
            </>
          )}
        </a>
        <div id="i359-nav" style={{ display: "flex", gap: "clamp(12px,1.6vw,26px)", alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <NavLink key={l} label={l} href={h} />
          ))}
          <Btn href={telHref} filled>
            Réserver
          </Btn>
        </div>
        <button
          className="i359-burger"
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
          <a href={telHref} style={{ background: C.accent, color: "#141110", borderRadius: 2, padding: "14px 22px", fontFamily: SANS, fontSize: 12, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", textDecoration: "none", textAlign: "center", marginTop: 12 }}>
            Réserver
          </a>
        </div>
      )}

      {/* ── HERO — H5 : rail latéral fixe + titre monumental ─────────────── */}
      <section
        id="top"
        className="i359-hero"
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "grid",
          gridTemplateColumns: "minmax(0,1.12fr) minmax(0,0.88fr)",
          gap: "clamp(30px,4.5vw,64px)",
          alignItems: "center",
          padding: "clamp(126px,14vw,164px) clamp(22px,5vw,64px) clamp(58px,7vw,84px) clamp(74px,8vw,132px)",
          maxWidth: 1340,
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        {/* le rail de chantier : immobile, il ne change que de teinte */}
        <FixedRail color={S.rail} side="left" width="clamp(38px,3.6vw,60px)">
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }} aria-hidden>
            <Rayures opacity={0.16} taille={18} />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, ${C.bg} 0%, transparent 16%, transparent 84%, ${C.bg} 100%)` }} />
          </div>
          <div style={{ position: "relative", display: "grid", placeItems: "center", gap: 18 }}>
            <SlideIndex i={i} total={HERO.length} variant="flat" color={C.accent} className="" />
            <span
              style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                fontFamily: SANS,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.34em",
                textTransform: "uppercase",
                color: C.textFaint,
                whiteSpace: "nowrap",
              }}
            >
              {S.k}
            </span>
            <HairlineArrows onPrev={prev} onNext={next} color={C.acier} vertical className="" />
          </div>
        </FixedRail>

        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(52% 44% at 26% 26%, rgba(224,138,30,0.11), transparent 68%)" }} />

        {/* Colonne parole — le titre monumental */}
        <div style={{ order: 1, position: "relative", zIndex: 1 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.14, ease: EASE }}>
            <Kicker>{clientEyebrow(sessionData) ?? <>Location de matériel · {ville}</>}</Kicker>
          </motion.div>

          <motion.h1
            key={`h-${i}`}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0.2 : 0.9, delay: 0.1, ease: EASE }}
            style={{
              fontFamily: DISPLAY,
              fontWeight: 900,
              fontSize: "clamp(40px,7.4vw,108px)",
              color: C.ink,
              lineHeight: 0.9,
              letterSpacing: "-0.035em",
              textTransform: "uppercase",
              margin: "clamp(18px,2vw,28px) 0 clamp(16px,1.8vw,24px)",
            }}
          >
            {l1}
            <br />
            <em style={{ fontStyle: "italic", fontWeight: 400, color: C.accent }}>{l2}</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.4, ease: EASE }}
            style={{ fontFamily: SANS, fontSize: "clamp(15.5px,1.25vw,17px)", fontWeight: 300, color: C.textMuted, lineHeight: 1.78, maxWidth: 500, marginBottom: "clamp(24px,3vw,34px)" }}
          >
            {clientHeroSubtitle(sessionData) ??
              clientTagline(sessionData) ??
              "Mini-pelles, plaques vibrantes, broyeurs, échafaudages : 400 références entretenues et contrôlées, à l'heure, à la journée ou au mois. Pros et particuliers, remorque comprise si besoin."}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.54, ease: EASE }} style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <Btn href={telHref} filled>
              Réserver une machine
            </Btn>
            <Btn href="#parc">Voir le parc</Btn>
          </motion.div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: "clamp(28px,3.6vw,44px)", paddingTop: 20, borderTop: `1px solid ${C.border}`, flexWrap: "wrap" }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", color: C.accent }}>{S.k}</span>
            <span aria-hidden style={{ width: 26, height: 1, background: C.border }} />
            <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 300, color: C.textMuted }}>{S.sub}</span>
          </div>
        </div>

        {/* Colonne tuiles — le geste, en cascade verticale */}
        <div style={{ order: 2, position: "relative", zIndex: 1 }}>
          <BentoCascade
            index={i}
            tiles={tiles}
            className="i359-bento"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0,1fr))",
              gridTemplateRows: "minmax(96px,auto) minmax(58px,auto) minmax(58px,auto)",
              gap: 12,
            }}
          />
        </div>
      </section>

      {/* ── RESPIRATION ─────────────────────────────────────────────────── */}
      <section className="i359-pad" style={{ background: C.bgAlt, padding: "clamp(72px,10vw,134px) clamp(22px,8vw,150px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <Rayures opacity={0.04} taille={26} teinte="rgba(127,138,151,0.9)" />
        <div style={{ position: "relative" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
              <Kicker color={C.textFaint} align="center">Le dépôt</Kicker>
            </div>
          </Reveal>
          <Reveal delay={0.09}>
            <p style={{ fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(22px,3.1vw,42px)", lineHeight: 1.34, color: C.ink, maxWidth: 940, margin: "0 auto", letterSpacing: "-0.012em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "respiration.texte") ?? (<>
              Une machine qu'on utilise trois jours par an n'a pas à dormir onze mois dans un garage : elle a un dépôt, et il est à quinze minutes.
            </>)}</p>
          </Reveal>
          <Reveal delay={0.18}>
            <div style={{ width: 1, height: 78, background: `linear-gradient(${C.accent}, transparent)`, margin: "clamp(34px,4vw,52px) auto 0" }} />
          </Reveal>
        </div>
      </section>

      {/* ── LE PARC — tuiles inégales, signature du thème ────────────────── */}
      <section id="parc" className="i359-pad" style={{ background: C.bg, padding: "clamp(80px,11vw,150px) clamp(22px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
          <GhostNum right>{String(SERVICES.length).padStart(2, "0")}</GhostNum>
          <Reveal>
            <div style={{ marginBottom: "clamp(30px,3.6vw,48px)", position: "relative" }}>
              <Kicker>Le parc</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(31px,5vw,64px)", color: C.ink, margin: "18px 0 0", lineHeight: 1.0, letterSpacing: "-0.032em", textTransform: "uppercase" }}>{/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>
                Entretenu, contrôlé,<br /><em style={{ fontStyle: "italic", fontWeight: 400, color: C.accent }}>prêt à démarrer.</em>
              </>)}</h2>
              <p style={{ fontFamily: SANS, fontSize: "clamp(14.5px,1.15vw,16px)", fontWeight: 300, color: C.textMuted, lineHeight: 1.78, maxWidth: 540, marginTop: 20 }}>
                Quatre cents références rangées par usage, pas par marque. On vous donne le calibre qui fait le travail — et le carnet de maintenance avec.
              </p>
            </div>
          </Reveal>
          <div className="i359-parc" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "clamp(12px,1.6vw,20px)", alignItems: "stretch" }}>
            {SERVICES.map((s: any, idx: number) => (
              <ParcTuile key={s.titre + String(idx)} item={s} i={idx} />
            ))}
          </div>

          {/* le bandeau du dépôt : photo du client, ou acier rayé dessiné */}
          <Reveal delay={0.12}>
            <div style={{ marginTop: "clamp(24px,3vw,40px)", position: "relative", overflow: "hidden", border: `1px solid ${C.border}`, background: C.bgDark, minHeight: "clamp(140px,18vw,240px)" }}>
              {bandeau ? (
                <img src={bandeau} alt={`Parc matériel — ${marque}`} loading="lazy" style={{ width: "100%", height: "clamp(140px,18vw,240px)", objectFit: "cover", display: "block" }} />
              ) : (
                <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(114deg, ${C.bgDark} 0%, #1b2028 48%, ${C.bgDarkAlt} 100%)` }}>
                  <Rayures opacity={0.1} taille={22} />
                  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 100% at 20% 0%, rgba(224,138,30,0.12), transparent 66%)" }} />
                </div>
              )}
              <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,6,8,0.72) 0%, rgba(5,6,8,0.16) 46%, rgba(5,6,8,0) 78%, rgba(5,6,8,0.24) 100%)" }} />
              <div style={{ position: "absolute", left: "clamp(18px,2.4vw,32px)", bottom: "clamp(16px,2vw,26px)", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <span aria-hidden style={{ width: 30, height: 2, background: C.accent }} />
                <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.86)" }}>
                  Retrait au dépôt dès 7 h · livraison chantier J+1
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CHIFFRES — bande monumentale ─────────────────────────────────── */}
      <section style={{ background: C.bgDark, position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(70% 100% at 50% 0%, rgba(224,138,30,0.11), transparent 70%)" }} />
        <div
          className="i359-statband i359-pad"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1180, margin: "0 auto", padding: "0 clamp(22px,4vw,44px)", position: "relative" }}
        >
          {STATS.map((s: any, idx: number) => (
            <Reveal key={s.label} delay={idx * 0.07}>
              <div className="i359-statcell" style={{ position: "relative", padding: "clamp(36px,4.4vw,58px) 10px", textAlign: "center", borderRight: idx < STATS.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none", overflow: "hidden" }}>
                <span aria-hidden style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(76px,9vw,132px)", color: "rgba(255,255,255,0.04)", lineHeight: 1, letterSpacing: "-0.05em", pointerEvents: "none", userSelect: "none" }}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div style={{ position: "relative", fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(30px,3.6vw,46px)", color: C.accent, lineHeight: 1, letterSpacing: "-0.035em" }}>{s.value}</div>
                <div style={{ position: "relative", fontFamily: SANS, fontSize: 11.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.44)", marginTop: 13, lineHeight: 1.5 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── COMMENT LOUER — titre collant, étapes filetées ───────────────── */}
      <section id="methode" className="i359-pad" style={{ background: C.bgAlt, padding: "clamp(80px,11vw,152px) clamp(22px,5vw,64px)" }}>
        <div
          className="i359-methode"
          style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,0.84fr) minmax(0,1.16fr)", gap: "clamp(32px,5vw,84px)", alignItems: "start" }}
        >
          <div className="i359-sticky" style={{ position: "sticky", top: 116, alignSelf: "start" }}>
            <Reveal>
              <Kicker>Comment louer</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(29px,4.4vw,56px)", color: C.ink, margin: "18px 0 20px", lineHeight: 1.0, letterSpacing: "-0.032em", textTransform: "uppercase" }}>{/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (<>
                Simple comme<br /><em style={{ fontStyle: "italic", fontWeight: 400, color: C.accent }}>réserver, charger, rendre.</em>
              </>)}</h2>
              <p style={{ fontFamily: SANS, fontSize: "clamp(14.5px,1.15vw,16px)", fontWeight: 300, color: C.textMuted, lineHeight: 1.8, maxWidth: 420 }}>
                Quatre temps, et la caution annoncée dès le premier. Le week-end compte pour un jour et demi : retrait samedi 7h30, retour lundi 9 h.
              </p>
              <div style={{ width: 60, height: 2, background: `linear-gradient(90deg, ${C.accent}, transparent)`, marginTop: 26 }} />
            </Reveal>
          </div>
          <div>
            {METHODE.map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.06}>
                <div style={{ position: "relative", display: "flex", gap: "clamp(18px,2.6vw,36px)", alignItems: "flex-start", padding: "clamp(24px,3.2vw,40px) 0", borderTop: `1px solid ${C.border}` }}>
                  <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(28px,3.4vw,44px)", color: C.acier, lineHeight: 1, minWidth: 62, flexShrink: 0, letterSpacing: "-0.04em" }}>{m.n}</span>
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

      {/* ── ENGAGEMENTS — split, photo à GAUCHE ──────────────────────────── */}
      <section id="engagements" className="i359-pad" style={{ background: C.bg, padding: "clamp(80px,11vw,150px) clamp(22px,5vw,64px)" }}>
        <div className="i359-split" style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(34px,5vw,76px)", alignItems: "center" }}>
          <Reveal style={{ order: 1 }}>
            <div style={{ position: "relative", overflow: "hidden", background: C.bgDark, border: `1px solid ${C.border}` }}>
              <img
                src={photo(0, "https://images.pexels.com/photos/29502220/pexels-photo-29502220.jpeg?auto=compress&cs=tinysrgb&w=1400")}
                alt="Grue mobile disponible à la location"
                loading="lazy"
                style={{ width: "100%", aspectRatio: "4/3.4", objectFit: "cover", display: "block" }}
              />
              <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,6,8,0.5) 0%, rgba(5,6,8,0.06) 44%, transparent 100%)" }} />
              <div style={{ position: "absolute", left: 20, bottom: 18, fontFamily: SANS, fontSize: 10, fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.88)" }}>
                VGP à jour
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12} style={{ order: 2 }}>
            <div>
              <Kicker>Nos engagements</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(28px,4.2vw,52px)", color: C.ink, margin: "18px 0 26px", lineHeight: 1.02, letterSpacing: "-0.032em", textTransform: "uppercase" }}>{/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (<>
                Des machines<br /><em style={{ fontStyle: "italic", fontWeight: 400, color: C.accent }}>qui démarrent.</em>
              </>)}</h2>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {ENGAGEMENT.map((e: string, idx: number) => (
                  <li key={idx} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "15px 0", borderTop: idx === 0 ? "none" : `1px solid ${C.border}` }}>
                    <span aria-hidden style={{ marginTop: 10, width: 18, height: 2, background: C.accent, flexShrink: 0 }} />
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

      {/* ── TARIFS — étiquettes de parc ──────────────────────────────────── */}
      <section id="tarifs" className="i359-pad" style={{ background: C.bgAlt, padding: "clamp(80px,11vw,150px) clamp(22px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Kicker align="center">Tarifs</Kicker>
              </div>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(30px,4.6vw,58px)", color: C.ink, margin: "18px 0 0", lineHeight: 1.0, letterSpacing: "-0.032em", textTransform: "uppercase" }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>À la journée, <em style={{ fontStyle: "italic", fontWeight: 400, color: C.accent }}>dégressifs, affichés.</em></>)}</h2>
              <p style={{ fontFamily: SANS, fontSize: "clamp(14.5px,1.15vw,16px)", fontWeight: 300, color: C.textMuted, maxWidth: 580, margin: "18px auto 0", lineHeight: 1.78 }}>
                Week-end = tarif 1,5 jour (retrait samedi 7h30, retour lundi 9h). Assurance casse optionnelle 10 % du tarif. Pros : compte et facturation mensuelle.
              </p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "clamp(12px,1.6vw,20px)", marginTop: "clamp(34px,4.5vw,54px)" }}>
            {TARIFS.map((t: any, idx: number) => (
              <EtiquetteTarif key={t.a + String(idx)} item={t} i={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── AVIS — bandes larges numérotées ──────────────────────────────── */}
      <section className="i359-pad" style={{ background: C.bgDark, padding: "clamp(80px,11vw,150px) clamp(22px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <Rayures opacity={0.035} taille={30} teinte="rgba(127,138,151,0.9)" />
        <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(30px,4vw,50px)" }}>
              <Kicker color="rgba(255,255,255,0.4)">Sur les chantiers</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(28px,4.4vw,54px)", color: C.ink, margin: "18px 0 0", lineHeight: 1.0, letterSpacing: "-0.032em", textTransform: "uppercase" }}>{/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>Des chantiers <em style={{ fontStyle: "italic", fontWeight: 400, color: C.accent }}>finis à l'heure</em>.</>)}</h2>
            </div>
          </Reveal>
          <div>
            {AVIS.map((a: any, idx: number) => (
              <Reveal key={a.auteur + String(idx)} delay={idx * 0.07}>
                <figure
                  className="i359-avisrow"
                  style={{
                    margin: 0,
                    display: "grid",
                    gridTemplateColumns: "clamp(58px,7vw,110px) minmax(0,1fr) minmax(0,0.42fr)",
                    gap: "clamp(16px,2.6vw,40px)",
                    alignItems: "center",
                    padding: "clamp(26px,3.4vw,44px) 0",
                    borderTop: `1px solid ${C.border}`,
                  }}
                >
                  <span aria-hidden style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(34px,5vw,74px)", color: "rgba(255,255,255,0.07)", lineHeight: 1, letterSpacing: "-0.05em" }}>
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <blockquote style={{ margin: 0, fontFamily: SANS, fontSize: "clamp(15px,1.35vw,18.5px)", fontWeight: 300, color: "rgba(242,241,237,0.88)", lineHeight: 1.68 }}>
                    « {a.texte} »
                  </blockquote>
                  <figcaption>
                    <div style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 600, color: C.ink }}>{a.auteur}</div>
                    <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: C.accent, marginTop: 8 }}>{a.detail}</div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
            <div style={{ borderTop: `1px solid ${C.border}` }} />
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section id="contact" className="i359-pad" style={{ background: C.accentLight, padding: "clamp(80px,11vw,150px) clamp(22px,5vw,64px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <Rayures opacity={0.07} taille={24} />
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Kicker align="center">Le dépôt</Kicker>
            </div>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(31px,5vw,62px)", color: C.ink, margin: "18px 0 18px", lineHeight: 1.0, letterSpacing: "-0.034em", textTransform: "uppercase" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
              Réservez aujourd'hui,<br /><em style={{ fontStyle: "italic", fontWeight: 400, color: C.accent }}>creusez samedi.</em>
            </>)}</h2>
            <p style={{ fontFamily: SANS, fontSize: "clamp(15px,1.2vw,16.5px)", fontWeight: 300, color: C.textMuted, maxWidth: 480, margin: "0 auto clamp(28px,3.6vw,40px)", lineHeight: 1.78 }}>
              Réservation par téléphone, retrait dès 7 h. Livraison sur chantier à J+1 dans un rayon de 40 km.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href={telHref}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.accent, color: "#141110", borderRadius: 2, padding: "16px 32px", fontFamily: SANS, fontSize: 15, fontWeight: 600, textDecoration: "none" }}
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
                <MapPin size={13} color={C.accent} />
                {adresse ?? lieu} · Livraison : {ZONES.join(", ")}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="i359-pad" style={{ background: C.bgDarkAlt, padding: "clamp(52px,7vw,84px) clamp(22px,5vw,64px) 26px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 38 }}>
            <div style={{ maxWidth: 360 }}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(20px,2.2vw,28px)", color: C.accent, marginBottom: 12, letterSpacing: "-0.03em", textTransform: "uppercase" }}>{marque}</div>
              <p style={{ fontFamily: SANS, fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, margin: 0 }}>
                Location de matériel BTP & jardin · {ville}
                <br />
                Matériel contrôlé (VGP à jour), pros et particuliers
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <MapPin size={13} />, t: adresse ?? `${lieu}, Meurthe-et-Moselle` },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Mail size={13} />, t: mail },
                { icon: <Clock size={13} />, t: "Lun–Ven 7h–18h30 · Sam 7h30–17h" },
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
