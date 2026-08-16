"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Compass, Landmark, Mail, MapPin, Phone, Quote, Ruler } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { ScrollGrow } from "@/lib/templates/hero-kit-3";
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
  clientText,
  clientTrade,
} from "@/lib/templates/clientContent";

/* ════════════════════════════════════════════════════════════════════════════
   {clientName(sessionData) ?? "Zinc & Ardoise"} — Couverture patrimoniale · Rouen

   Archétype H7 « magazine » : méta-rangée en tête, titre serif géant, bandeau
   média en bas de cadre. Geste de signature UNIQUE : ScrollGrow — le titre
   grandit au défilement, la page avance vers le monument au lieu de le quitter.

   Le voisin immédiat du catalogue (impact-354) partage ce geste : il s'en
   sépare par l'archétype (H4 éditorial décalé contre H7 magazine), la paire de
   fontes (Newsreader/Manrope contre EB Garamond/Outfit), la palette (peau/rosé
   contre ardoise) et l'amplitude du geste (1 → 1.42 contre 1 → 1.26).

   Le proxy bloque Unsplash et Pexels : la seule adresse d'image du thème est
   conservée telle quelle, les autres emplacements sont peints en CSS et
   tiennent debout sans photographie.
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

/* ── Fontes — rôles opposés : garamond de labeur / grotesque géométrique ──── */
const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Outfit:wght@300;400;500;600;700&display=swap');`;

const SERIF = "'EB Garamond', Georgia, 'Times New Roman', serif";
const SANS = "'Outfit', system-ui, -apple-system, sans-serif";

/* ── Easing unique du thème, répété littéralement en CSS ──────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

/* ── Palette ardoise ─────────────────────────────────────────────────────── */
let C: Record<string, string> = {
  bg: "#f4f6f8",
  bgAlt: "#e6edf2",
  bgDark: "#101b23",
  bgDarkAlt: "#0a131a",
  bgCard: "#ffffff",
  accent: "var(--brand, #31587a)",
  accentDark: "var(--brand-light, #21405c)",
  accentLight: "#dbe6ef",
  ink: "#101b23",
  textMuted: "#4c606e",
  textFaint: "#8698a5",
  border: "#d4dfe7",
  white: "#ffffff",
  /* Clé métier : le gris bleuté de l'ardoise d'Angers, pour les textures. */
  slate: "#647a89",
};

/* ── Photos : l'adresse du client d'abord, celle du thème ensuite ─────────── */
function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* La seule photographie du thème, conservée telle quelle. */
const PHOTO_FLECHE =
  "https://images.pexels.com/photos/15979049/pexels-photo-15979049.jpeg?auto=compress&cs=tinysrgb&w=1400";

/* ── Contenus de démonstration ───────────────────────────────────────────── */
const NAV = [
  { l: "Restaurations", h: "#services" },
  { l: "La démarche", h: "#methode" },
  { l: "Repères de prix", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

const HERO_DEMO = {
  k: "Patrimoine couvert",
  l1: "Les toits anciens méritent",
  l2: "des mains qui savent.",
  cartouche: "Chaque toit ancien a son dessin — on le respecte.",
  sub: "Maisons à pans de bois, hôtels particuliers, longères : nous couvrons le bâti ancien normand dans ses matériaux d'origine — ardoise clouée, zinc façonné, épis restaurés.",
};

function SERVICES_SOURCE_LIVE() {
  return [
    { num: "I", tag: "Patrimoine", titre: "Toitures de bâti ancien", desc: "Ardoise clouée sur volige, tuile plate de pays, essente de châtaignier : le matériau et la pose d'origine, documentés avant travaux." },
    { num: "II", tag: "ABF", titre: "Monuments & ABF", desc: "Chantiers en secteur protégé : dossiers Architectes des Bâtiments de France préparés par nos soins, prescriptions respectées à la lettre." },
    { num: "III", tag: "Ornement", titre: "Zinguerie d'ornement", desc: "Épis de faîtage, membrons, lucarnes à croupe : façonnés à l'atelier de " + (clientCity(sessionData) ?? "Rouen") + ", au modèle de l'existant." },
    { num: "IV", tag: "Charpente", titre: "Charpente ancienne", desc: "Reprises d'about, greffes de bois anciens, traitement : notre charpentier travaille au rythme du bâti, pas du planning." },
    { num: "V", tag: "Lucarnes", titre: "Lucarnes & ouvertures", desc: "Restauration de lucarnes normandes, création dans le style : jacobine, capucine, œil-de-bœuf." },
    { num: "VI", tag: "Diagnostic", titre: "Diagnostic patrimonial", desc: "État sanitaire complet de la couverture et de la charpente, rapport photo, priorités chiffrées sur dix ans." },
  ];
}
let SERVICES_SOURCE = SERVICES_SOURCE_LIVE();
let SERVICES_DEMO = SERVICES_SOURCE;
let SERVICES = SERVICES_SOURCE;

const METHODE_DEMO = [
  { n: "01", t: "Relevé de l'existant", d: "Photos, calepinage, sondages : le toit est documenté avant qu'une seule ardoise ne bouge." },
  { n: "02", t: "Dossier et autorisations", d: "Déclaration préalable, dossier ABF si secteur protégé : nous préparons, vous signez." },
  { n: "03", t: "Chantier à l'ancienne", d: "Matériaux sourcés (ardoise d'Angers, zinc naturel), gestes traditionnels, compagnons formés au bâti ancien." },
  { n: "04", t: "Carnet de toiture remis", d: "Photos avant/pendant/après, matériaux utilisés, conseils d'entretien : le carnet suit la maison." },
];
let METHODE = METHODE_DEMO;

const ENGAGEMENT_DEMO = [
  "Qualibat 3231 « patrimoine bâti » — au-delà de la couverture courante",
  "Garantie décennale, assurance spécifique monuments et bâtiments classés",
  "Matériaux d'origine française sourcés et documentés sur facture",
  "Un compagnon référent par chantier, joignable directement",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

const TARIFS_DEMO = [
  { a: "Restauration ardoise clouée", p: "180–260 €/m²", n: "Dépose soignée, tri des ardoises réutilisables, pose au clou cuivre." },
  { a: "Épi de faîtage restauré", p: "dès 480 €", n: "Repose comprise ; création au modèle sur devis." },
  { a: "Lucarne normande restaurée", p: "dès 3 200 €", n: "Couverture, joues et membrons, fenêtre en option." },
  { a: "Diagnostic patrimonial complet", p: "390 €", n: "Rapport photo et plan d'entretien sur 10 ans, déduit si chantier." },
];
let TARIFS = TARIFS_DEMO;

const AVIS_SOURCE = [
  { texte: "Notre maison à pans de bois du XVIIe attendait des mains comme celles-ci : l'ABF a validé le dossier sans réserve, le toit est magnifique et juste.", auteur: "M. et Mme d'Argentré", detail: "Restauration complète — secteur sauvegardé" },
  { texte: "L'épi de faîtage de la longère refait au modèle exact de l'ancien, photos à l'appui. Le carnet de toiture remis en fin de chantier est une idée précieuse.", auteur: "Isabelle V.", detail: "Zinguerie d'ornement" },
  { texte: "Diagnostic honnête : rien d'urgent, un plan d'entretien sur dix ans, et 390 € au lieu du chantier à 60 000 qu'un autre voulait nous vendre.", auteur: "Antoine R.", detail: "Diagnostic patrimonial" },
];
let AVIS_DEMO = AVIS_SOURCE;
let AVIS = AVIS_SOURCE;

const STATS_DEMO = [
  { value: "XVIIe", label: "Le plus ancien toit restauré" },
  { value: "3231", label: "Qualibat patrimoine bâti" },
  { value: "60+", label: "Bâtiments classés ou inscrits couverts" },
  { value: "10 ans", label: "Décennale sur chaque chantier" },
];
let STATS = STATS_DEMO;

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

/** Révélation au défilement, une seule fois. */
function Reveal({
  children,
  delay = 0,
  y = 30,
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
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Kicker : filet 40 × 1 px puis capitales à interlettrage large. */
function Kicker({
  children,
  color = C.accent,
  align = "left",
}: {
  children: React.ReactNode;
  color?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: align === "center" ? "center" : "flex-start", }}
    >
      <span style={{ width: 40, height: 1, background: color, opacity: 0.75, flexShrink: 0 }} />
      <span
        style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.36em", textTransform: "uppercase", color, fontWeight: 600, }}
      >
        {children}
      </span>
      {align === "center" && (
        <span style={{ width: 40, height: 1, background: color, opacity: 0.75, flexShrink: 0 }} />
      )}
    </div>
  );
}

/** Texture d'écailles d'ardoise, sans image. */
function slateTexture(opacity = 0.1) {
  return {
    backgroundImage: `radial-gradient(circle at 50% 100%, rgba(100,122,137,${opacity}) 0 12px, transparent 13px), radial-gradient(circle at 0% 100%, rgba(100,122,137,${opacity *
      0.7}) 0 12px, transparent 13px), radial-gradient(circle at 100% 100%, rgba(100,122,137,${opacity *
      0.7}) 0 12px, transparent 13px)`,
    backgroundSize: "26px 17px",
  } as React.CSSProperties;
}

/** Chiffre fantôme posé en marge. */
function Ghost({
  children,
  right = false,
  size = "clamp(120px, 20vw, 300px)",
}: {
  children: React.ReactNode;
  right?: boolean;
  size?: string;
}) {
  return (
    <span
      aria-hidden
      style={{ position: "absolute", top: "-0.16em", [right ? "right" : "left"]: "-0.06em", fontFamily: SERIF, fontStyle: "italic", fontSize: size, lineHeight: 0.8, color: C.slate, opacity: 0.08, pointerEvents: "none", userSelect: "none", }}
    >
      {children}
    </span>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   1 · NAV — collante à cinq propriétés
   ════════════════════════════════════════════════════════════════════════════ */
function NavLink({ label, href, onClick }: { label: string; href: string; onClick?: () => void }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ position: "relative", fontFamily: SANS, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 500, color: h ? C.accent : C.textMuted, textDecoration: "none", padding: "13px 2px", transition: `color .45s ${EASE_CSS}`, display: "inline-block", minHeight: 44, }}
    >
      {label}
      <span
        style={{ position: "absolute", left: 0, bottom: 8, height: 1, width: h ? "100%" : "0%", background: C.accent, transition: `width .5s ${EASE_CSS}`, }}
      />
    </a>
  );
}

function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [hCta, setHCta] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tel = `tel:${clientPhone(sessionData) ?? fd?.phone ?? "+33235000000"}`;

  return (
    <>
      <nav
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: solid ? "10px clamp(20px,5vw,60px)" : "22px clamp(20px,5vw,60px)", background: solid ? "rgba(244,246,248,0.94)" : "transparent", backdropFilter: solid ? "blur(14px) saturate(140%)" : "none", WebkitBackdropFilter: solid ? "blur(14px) saturate(140%)" : "none", borderBottom: `1px solid ${solid ? C.border : "transparent"}`, boxShadow: solid ? "0 12px 34px -28px rgba(16,27,35,0.55)" : "none", transition: `all .55s ${EASE_CSS}`, }}
      >
        <a
          href="#top"
          style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0, textDecoration: "none" }}
        >
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? "logo"}
              style={{ height: 32, maxWidth: 168, objectFit: "contain", display: "block" }}
            />
          ) : (
            <>
              <Landmark size={19} color={C.accent} strokeWidth={1.4} style={{ flexShrink: 0 }} />
              <span
                style={{ fontFamily: SERIF, fontSize: 21, letterSpacing: "0.01em", color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", }}
              >
                {fd?.businessName ?? clientName(sessionData) ?? "Zinc & Ardoise"}
              </span>
              <span
                className="i352-navtrade"
                style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.26em", textTransform: "uppercase", color: C.textFaint, marginLeft: 4, whiteSpace: "nowrap", }}
              >
                {clientTrade(sessionData) ?? "Couverture patrimoniale"}
              </span>
            </>
          )}
        </a>

        <div id="i352-nav" style={{ display: "flex", gap: "clamp(16px,2.2vw,30px)", alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <NavLink key={l} label={l} href={h} />
          ))}
          <a
            href={tel}
            onMouseEnter={() => setHCta(true)}
            onMouseLeave={() => setHCta(false)}
            style={{ fontFamily: SANS, fontSize: 11.5, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, padding: "13px 22px", minHeight: 44, display: "inline-flex", alignItems: "center", background: hCta ? C.accentDark : C.accent, color: C.white, textDecoration: "none", whiteSpace: "nowrap", boxShadow: hCta ? "0 16px 30px -18px rgba(33,64,92,0.75)" : "0 6px 16px -14px rgba(33,64,92,0.6)", transform: hCta ? "translateY(-2px)" : "none", transition: `all .5s ${EASE_CSS}`, }}
          >
            Diagnostic patrimoine
          </a>
        </div>

        <button
          className="i352-burger"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44, }}
        >
          <span
            style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: `transform .35s ${EASE_CSS}`, transform: open ? "rotate(45deg) translate(4.5px, 4.5px)" : "none", }}
          />
          <span
            style={{ display: "block", width: 24, height: 1.5, background: C.ink, opacity: open ? 0 : 1, transition: "opacity .3s" }}
          />
          <span
            style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: `transform .35s ${EASE_CSS}`, transform: open ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none", }}
          />
        </button>
      </nav>

      {open && (
        <div
          style={{ position: "fixed", top: 66, left: 0, right: 0, zIndex: 99, background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "16px clamp(20px,5vw,60px) 24px", display: "flex", flexDirection: "column", gap: 2, }}
        >
          {NAV.map(({ l, h }) => (
            <NavLink key={l} label={l} href={h} onClick={() => setOpen(false)} />
          ))}
          <a
            href={tel}
            style={{ marginTop: 12, background: C.accent, color: C.white, padding: "15px 22px", minHeight: 44, fontFamily: SANS, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, textAlign: "center", textDecoration: "none", }}
          >
            Diagnostic patrimoine
          </a>
        </div>
      )}
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · HÉROS — H7 magazine : méta-rangée, titre serif géant (ScrollGrow),
       bandeau média en bas de cadre.
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const [hTitle, setHTitle] = useState(false);
  const img = photo(0, PHOTO_FLECHE);

  const l1 = clientHeroLine(sessionData, 0, 2, 22) ?? HERO_DEMO.l1;
  const l2 = clientHeroLine(sessionData, 1, 2, 22) ?? HERO_DEMO.l2;
  const sub = clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? HERO_DEMO.sub;

  return (
    <section
      id="top"
      style={{ position: "relative", background: C.bg, padding: "clamp(112px,13vw,164px) clamp(20px,5vw,64px) 0", overflow: "hidden", }}
    >
      {/* Glow radial, texture sans image */}
      <div
        aria-hidden
        style={{ position: "absolute", inset: "-20% -10% auto -10%", height: "70%", background: "radial-gradient(60% 70% at 22% 20%, rgba(49,88,122,0.12), transparent 70%)", pointerEvents: "none", }}
      />

      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto" }}>
        {/* ── Méta-rangée du magazine ──────────────────────────────────── */}
        <motion.div
          className="i352-meta"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: EASE, delay: 0.1 }}
          style={{ display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center", gap: "clamp(14px,3vw,40px)", paddingBottom: 16, borderBottom: `1px solid ${C.border}`, }}
        >
          <Kicker>{clientEyebrow(sessionData) ?? `Couverture patrimoniale · ${clientCity(sessionData) ?? "Rouen"}`}</Kicker>
          <span
            className="i352-metahide"
            style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.28em", textTransform: "uppercase", color: C.textFaint, }}
          >
            {STATS[1]?.value ?? "3231"} — {STATS[1]?.label ?? "Qualibat patrimoine bâti"}
          </span>
          <span
            style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 15, color: C.accent, whiteSpace: "nowrap", }}
          >
            N° {STATS[3]?.value ?? "10 ans"}
          </span>
        </motion.div>

        {/* ── Titre monumental : le geste de signature ──────────────────── */}
        <ScrollGrow from={1} to={1.26} fade>
          <motion.h1
            onMouseEnter={() => setHTitle(true)}
            onMouseLeave={() => setHTitle(false)}
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.05, ease: EASE, delay: 0.2 }}
            style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(2.6rem, 7.6vw, 7.4rem)", lineHeight: 0.98, letterSpacing: "-0.018em", color: C.ink, margin: "clamp(26px,4vw,54px) 0 clamp(20px,2.6vw,34px)", maxWidth: "15ch", cursor: "default", }}
          >
            {l1}
            <br />
            <em
              style={{ fontStyle: "italic", color: hTitle ? C.accentDark : C.accent, transition: `color .5s ${EASE_CSS}`, }}
            >
              {l2}
            </em>
          </motion.h1>
        </ScrollGrow>

        {/* ── Chapô + appels à l'action ────────────────────────────────── */}
        <div
          className="i352-chapo"
          style={{ display: "grid", gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)", gap: "clamp(24px,4vw,64px)", alignItems: "end", paddingBottom: "clamp(30px,4vw,52px)", }}
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.36 }}
            style={{ fontFamily: SANS, fontWeight: 300, fontSize: "clamp(15.5px,1.5vw,18.5px)", lineHeight: 1.78, color: C.textMuted, maxWidth: 520, margin: 0, }}
          >
            {sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.48 }}
            style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
          >
            <LineButton href={`tel:${clientPhone(sessionData) ?? fd?.phone ?? "+33235000000"}`} filled>
              Parler de votre toiture
            </LineButton>
            <LineButton href="#services">Nos restaurations</LineButton>
          </motion.div>
        </div>
      </div>

      {/* ── Bandeau média bas de cadre ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.05, ease: EASE, delay: 0.56 }}
        style={{ position: "relative", maxWidth: 1280, margin: "0 auto" }}
      >
        <div
          className="i352-band"
          style={{ position: "relative", height: "clamp(220px,34vw,420px)", overflow: "hidden", background: C.bgDark, ...slateTexture(0.22), }}
        >
          {img ? (
            <img
              src={img}
              alt={`${fd?.businessName ?? clientName(sessionData) ?? "Zinc & Ardoise"} — flèche en ardoise restaurée`}
              loading="eager"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : null}
          <div
            aria-hidden
            style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(16,27,35,0.30) 0%, rgba(16,27,35,0.05) 42%, rgba(16,27,35,0.72) 100%)", }}
          />
          {/* Cartouche — le détail gratuit : la légende de magazine */}
          <div
            style={{ position: "absolute", left: "clamp(16px,3vw,38px)", bottom: "clamp(16px,3vw,34px)", right: "clamp(16px,3vw,38px)", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap", }}
          >
            <div style={{ maxWidth: 560 }}>
              <div
                style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.34em", textTransform: "uppercase", color: "rgba(244,246,248,0.66)", marginBottom: 8, }}
              >
                {HERO_DEMO.k}
              </div>
              <p
                style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(17px,2.2vw,27px)", lineHeight: 1.34, color: "rgba(244,246,248,0.95)", margin: 0, textShadow: "0 8px 34px rgba(0,0,0,0.55)", }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "heros.cartouche") ?? (
                  <>Chaque toit ancien a son dessin — on le respecte.</>
                )}
              </p>
            </div>
            <span
              style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(244,246,248,0.55)", whiteSpace: "nowrap", }}
            >
              {clientCity(sessionData) ?? "Rouen"}
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function LineButton({
  children,
  href,
  filled = false,
}: {
  children: React.ReactNode;
  href: string;
  filled?: boolean;
}) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 26px", minHeight: 44, fontFamily: SANS, fontSize: 11.5, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, border: `1px solid ${filled ? "transparent" : C.border}`, background: filled ? (h ? C.accentDark : C.accent) : h ? C.bgAlt : "transparent", color: filled ? C.white : C.ink, textDecoration: "none", transform: h ? "translateY(-2px)" : "none", boxShadow: h ? "0 20px 38px -24px rgba(16,27,35,0.55), 0 3px 10px -6px rgba(16,27,35,0.28)" : "0 0 0 rgba(0,0,0,0)", transition: `all .5s ${EASE_CSS}`, }}
    >
      {children}
      <ArrowRight
        size={14}
        style={{ transform: h ? "translateX(5px)" : "none", transition: `transform .5s ${EASE_CSS}` }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · RESPIRATION — une phrase serif italique, rien d'autre
   ════════════════════════════════════════════════════════════════════════════ */
function Respiration() {
  return (
    <section
      style={{ background: C.bg, padding: "clamp(84px,12vw,168px) clamp(24px,8vw,180px)", textAlign: "center", }}
    >
      <Reveal>
        <p
          style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(22px,3.2vw,44px)", lineHeight: 1.34, letterSpacing: "-0.008em", color: C.ink, maxWidth: 900, margin: "0 auto", }}
        >
          {/* TEXTE_SECTION */ clientText(sessionData, "respiration.texte") ?? (
            <>Chaque toit ancien a son dessin — on le respecte.</>
          )}
        </p>
      </Reveal>
      <Reveal delay={0.12}>
        <div
          style={{ width: 1, height: 84, background: `linear-gradient(${C.accent}, transparent)`, margin: "clamp(34px,5vw,60px) auto 0", }}
        />
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · MANIFESTE + CHIFFRES — le rail de stats posé en marge du texte
   ════════════════════════════════════════════════════════════════════════════ */
function Manifeste() {
  return (
    <section
      className="i352-pad"
      style={{ position: "relative", background: C.bgDark, color: C.white, padding: "clamp(72px,9vw,124px) clamp(24px,6vw,72px)", overflow: "hidden", }}
    >
      <div aria-hidden style={{ position: "absolute", inset: 0, ...slateTexture(0.16), pointerEvents: "none" }} />
      <div
        aria-hidden
        style={{ position: "absolute", inset: "auto -10% -30% 40%", height: "80%", background: "radial-gradient(50% 60% at 50% 50%, rgba(49,88,122,0.12), transparent 70%)", pointerEvents: "none", }}
      />
      <div
        className="i352-manifeste"
        style={{ position: "relative", maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1.15fr) minmax(0,0.85fr)", gap: "clamp(36px,6vw,84px)", alignItems: "start", }}
      >
        <Reveal>
          <div style={{ position: "relative" }}>
            <Ghost>N°</Ghost>
            <div style={{ position: "relative" }}>
              <Kicker color={C.accentLight}>La maison</Kicker>
              <p
                style={{ fontFamily: SERIF, fontSize: "clamp(20px,2.5vw,31px)", lineHeight: 1.5, color: "rgba(244,246,248,0.92)", maxWidth: 520, margin: "26px 0 0", }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "manifeste.texte") ?? (
                  <>
                    Maisons à pans de bois, hôtels particuliers, longères : nous couvrons le bâti ancien
                    dans ses matériaux d'origine — <em style={{ color: C.accentLight }}>ardoise clouée,
                    zinc façonné, épis restaurés.</em>
                  </>
                )}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Rail de chiffres, filets dégradés entre les lignes */}
        <div>
          {STATS.map((s, i) => (
            <Reveal key={`${s.label}-${i}`} delay={i * 0.07}>
              <div
                style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 18, padding: "18px 0", /* Filet dégradé 1 px, pas une bordure pleine. */ backgroundImage: i === 0 ? "none" : "linear-gradient(90deg, rgba(219,230,239,0.36), rgba(219,230,239,0.02))", backgroundSize: "100% 1px", backgroundRepeat: "no-repeat", backgroundPosition: "top left", }}
              >
                <span
                  style={{ fontFamily: SERIF, fontSize: "clamp(26px,3.4vw,42px)", lineHeight: 1, color: C.accentLight, }}
                >
                  {s.value}
                </span>
                <span
                  style={{ fontFamily: SANS, fontSize: 12.5, lineHeight: 1.5, color: "rgba(244,246,248,0.52)", textAlign: "right", maxWidth: 220, }}
                >
                  {s.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · RESTAURATIONS — rangées éditoriales numérotées, pas de cartes
   ════════════════════════════════════════════════════════════════════════════ */
function ServiceRow({ s, i }: { s: any; i: number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={Math.min(i, 4) * 0.055}>
      <article
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        className="i352-row"
        style={{ display: "grid", gridTemplateColumns: "96px minmax(0,1fr) minmax(0,1.35fr)", gap: "clamp(16px,3vw,44px)", alignItems: "start", padding: "clamp(24px,3vw,38px) clamp(10px,1.6vw,24px)", borderTop: `1px solid ${C.border}`, background: h ? C.bgCard : "transparent", transform: h ? "translateY(-3px)" : "none", boxShadow: h ? "0 30px 60px -40px rgba(16,27,35,0.42), 0 4px 14px -10px rgba(16,27,35,0.2)" : "0 0 0 rgba(0,0,0,0)", transition: `all .5s ${EASE_CSS}`, cursor: "default", }}
      >
        <div
          style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(26px,3vw,40px)", lineHeight: 1, color: h ? C.accent : C.textFaint, transition: `color .5s ${EASE_CSS}`, }}
        >
          {s.num}
        </div>
        <div>
          <div
            style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: h ? C.accent : C.textFaint, marginBottom: 10, fontWeight: 600, transition: `color .5s ${EASE_CSS}`, }}
          >
            {s.tag}
          </div>
          <h3
            style={{ fontFamily: SERIF, fontSize: "clamp(21px,2.3vw,30px)", fontWeight: 400, lineHeight: 1.18, color: C.ink, margin: 0, }}
          >
            {s.titre}
          </h3>
        </div>
        <p
          style={{ fontFamily: SANS, fontWeight: 300, fontSize: 15, lineHeight: 1.76, color: C.textMuted, maxWidth: 500, margin: 0, }}
        >
          {s.desc}
        </p>
      </article>
    </Reveal>
  );
}

function Services() {
  return (
    <section
      id="services"
      className="i352-pad"
      style={{ background: C.bg, padding: "clamp(80px,10vw,140px) clamp(20px,5vw,64px)" }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: "clamp(34px,5vw,62px)", maxWidth: 720 }}>
            <Kicker>Restaurations</Kicker>
            <h2
              style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(30px,4.4vw,58px)", lineHeight: 1.06, letterSpacing: "-0.014em", color: C.ink, margin: "22px 0 0", }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "restaurations.titre") ?? (
                <>
                  Couvrir comme
                  <br />
                  <em style={{ color: C.accent }}>à l'origine.</em>
                </>
              )}
            </h2>
          </div>
        </Reveal>

        <div>
          {SERVICES.map((s, i) => (
            <ServiceRow key={`${s.titre}-${i}`} s={s} i={i} />
          ))}
          <div style={{ borderTop: `1px solid ${C.border}` }} />
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · LA DÉMARCHE — chronologie verticale à filet
   ════════════════════════════════════════════════════════════════════════════ */
function Methode() {
  const imgChantier = photo(2, "");
  return (
    <section
      id="methode"
      className="i352-pad"
      style={{ position: "relative", background: C.bgAlt, padding: "clamp(80px,10vw,144px) clamp(20px,5vw,64px)", overflow: "hidden", }}
    >
      <div
        className="i352-methode"
        style={{ position: "relative", maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1.55fr) minmax(0,0.95fr)", gap: "clamp(30px,5vw,72px)", alignItems: "start", }}
      >
      <div style={{ position: "relative", maxWidth: 1060 }}>
        <Reveal>
          <div style={{ marginBottom: "clamp(34px,5vw,58px)", maxWidth: 680 }}>
            <Kicker>La démarche</Kicker>
            <h2
              style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(29px,4.2vw,54px)", lineHeight: 1.06, letterSpacing: "-0.014em", color: C.ink, margin: "22px 0 0", }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "demarche.titre") ?? (
                <>
                  Documenter,
                  <br />
                  <em style={{ color: C.accent }}>puis seulement toucher.</em>
                </>
              )}
            </h2>
          </div>
        </Reveal>

        <div style={{ position: "relative", paddingLeft: "clamp(0px,2vw,10px)" }}>
          {METHODE.map((m, i) => (
            <Reveal key={`${m.n}-${i}`} delay={i * 0.08}>
              <div
                className="i352-step"
                style={{ display: "grid", gridTemplateColumns: "minmax(0,0.9fr) minmax(0,1.6fr)", gap: "clamp(16px,3vw,48px)", alignItems: "start", padding: "clamp(22px,2.6vw,34px) 0", borderTop: `1px solid ${C.border}`, }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                  <span
                    style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.28em", color: C.accent, fontWeight: 600, }}
                  >
                    {m.n}
                  </span>
                  <h3
                    style={{ fontFamily: SERIF, fontSize: "clamp(19px,2.1vw,27px)", fontWeight: 400, lineHeight: 1.2, color: C.ink, margin: 0, }}
                  >
                    {m.t}
                  </h3>
                </div>
                <p
                  style={{ fontFamily: SANS, fontWeight: 300, fontSize: 15, lineHeight: 1.76, color: C.textMuted, maxWidth: 520, margin: 0, }}
                >
                  {m.d}
                </p>
              </div>
            </Reveal>
          ))}
          <div style={{ borderTop: `1px solid ${C.border}` }} />
        </div>
      </div>

      {/* Panneau de chantier collant — devient statique au point de rupture. */}
      <Reveal delay={0.14}>
        <figure className="i352-panneau" style={{ position: "sticky", top: 108, margin: 0 }}>
          <div
            style={{ position: "relative", aspectRatio: "3/4", background: C.bgDark, overflow: "hidden", ...slateTexture(0.28), }}
          >
            {imgChantier ? (
              <img
                src={imgChantier}
                alt="Chantier de couverture sur bâti ancien"
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <div
                style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, background: "linear-gradient(200deg, rgba(49,88,122,0.30), rgba(10,19,26,0.78))", }}
              >
                <Compass size={46} color={C.accentLight} strokeWidth={0.9} />
                <span
                  style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.34em", textTransform: "uppercase", color: "rgba(244,246,248,0.58)", textAlign: "center", padding: "0 18px", }}
                >
                  Relevé avant dépose
                </span>
              </div>
            )}
          </div>
          <figcaption
            style={{ fontFamily: SANS, fontWeight: 300, fontSize: 13, lineHeight: 1.7, color: C.textMuted, marginTop: 14, }}
          >
            {/* TEXTE_SECTION */ clientText(sessionData, "demarche.legende") ?? (
              <>Le carnet de toiture suit la maison : photos avant, pendant, après, et le plan d'entretien.</>
            )}
          </figcaption>
        </figure>
      </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · ENGAGEMENTS — colonnes filetées + panneau d'ardoise CSS
   ════════════════════════════════════════════════════════════════════════════ */
function Engagements() {
  const img = photo(1, "");
  return (
    <section
      id="engagements"
      className="i352-pad"
      style={{ background: C.bg, padding: "clamp(80px,10vw,140px) clamp(20px,5vw,64px)" }}
    >
      <div
        className="i352-split"
        style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,0.9fr) minmax(0,1.1fr)", gap: "clamp(32px,5vw,76px)", alignItems: "center", }}
      >
        <Reveal>
          <div
            style={{ position: "relative", aspectRatio: "4/5", background: C.bgDark, overflow: "hidden", ...slateTexture(0.3), }}
          >
            {img ? (
              <img
                src={img}
                alt="Compagnon couvreur au travail sur un toit ancien"
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <div
                style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, background: "linear-gradient(160deg, rgba(49,88,122,0.28), rgba(10,19,26,0.72))", }}
              >
                <Ruler size={54} color={C.accentLight} strokeWidth={0.9} />
                <span
                  style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.34em", textTransform: "uppercase", color: "rgba(244,246,248,0.6)", }}
                >
                  Atelier · {clientCity(sessionData) ?? "Rouen"}
                </span>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div>
            <Kicker>Nos engagements</Kicker>
            <h2
              style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(27px,3.6vw,46px)", lineHeight: 1.08, letterSpacing: "-0.012em", color: C.ink, margin: "22px 0 clamp(22px,3vw,34px)", }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                <>
                  Le patrimoine,
                  <br />
                  <em style={{ color: C.accent }}>c'est un métier.</em>
                </>
              )}
            </h2>
            <div>
              {ENGAGEMENT.map((e, i) => (
                <div
                  key={i}
                  style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: 16, alignItems: "start", padding: "16px 0", borderTop: i === 0 ? `1px solid ${C.border}` : `1px solid ${C.border}`, }}
                >
                  <span
                    style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.22em", color: C.accent, fontWeight: 600, paddingTop: 4, }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    style={{ fontFamily: SANS, fontWeight: 300, fontSize: 15, lineHeight: 1.7, color: C.textMuted, }}
                  >
                    {e}
                  </span>
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${C.border}`, marginBottom: 28 }} />
            </div>
            <LineButton href={`tel:${clientPhone(sessionData) ?? fd?.phone ?? "+33235000000"}`} filled>
              Nous appeler
            </LineButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · REPÈRES DE PRIX — table fine à conduites de points
   ════════════════════════════════════════════════════════════════════════════ */
function TarifRow({ t, i }: { t: any; i: number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={Math.min(i, 4) * 0.06}>
      <div
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        className="i352-tarif"
        style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: "clamp(14px,3vw,36px)", alignItems: "baseline", padding: "clamp(20px,2.4vw,30px) clamp(6px,1.4vw,18px)", borderTop: `1px solid ${C.border}`, background: h ? C.bgCard : "transparent", transform: h ? "translateY(-2px)" : "none", boxShadow: h ? "0 26px 52px -40px rgba(16,27,35,0.4), 0 3px 12px -9px rgba(16,27,35,0.2)" : "0 0 0 rgba(0,0,0,0)", transition: `all .5s ${EASE_CSS}`, }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{ fontFamily: SERIF, fontSize: "clamp(19px,2vw,25px)", color: C.ink, lineHeight: 1.24, }}
          >
            {t.a}
          </div>
          <div
            style={{ fontFamily: SANS, fontWeight: 300, fontSize: 13.5, lineHeight: 1.68, color: C.textFaint, marginTop: 7, maxWidth: 560, }}
          >
            {t.n}
          </div>
        </div>
        <div
          style={{ fontFamily: SERIF, fontSize: "clamp(19px,2.2vw,26px)", color: h ? C.accentDark : C.accent, whiteSpace: "nowrap", transition: `color .5s ${EASE_CSS}`, }}
        >
          {t.p}
        </div>
      </div>
    </Reveal>
  );
}

function Tarifs() {
  return (
    <section
      id="tarifs"
      className="i352-pad"
      style={{ position: "relative", background: C.bgAlt, padding: "clamp(80px,10vw,144px) clamp(20px,5vw,64px)", overflow: "hidden", }}
    >
      <div style={{ position: "relative", maxWidth: 980, margin: "0 auto" }}>
        <Reveal>
          <div style={{ position: "relative", marginBottom: "clamp(30px,4vw,52px)" }}>
            <Ghost right>€</Ghost>
            <div style={{ position: "relative" }}>
              <Kicker>Repères de prix</Kicker>
              <h2
                style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(29px,4vw,52px)", lineHeight: 1.06, letterSpacing: "-0.014em", color: C.ink, margin: "22px 0 16px", maxWidth: 640, }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                  <>
                    Le juste prix <em style={{ color: C.accent }}>du temps bien employé.</em>
                  </>
                )}
              </h2>
              <p
                style={{ fontFamily: SANS, fontWeight: 300, fontSize: 15, lineHeight: 1.76, color: C.textMuted, maxWidth: 520, margin: 0, }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.intro") ?? (
                  <>
                    Le bâti ancien ne se chiffre qu'après relevé. Ces repères situent l'ordre de grandeur,
                    subventions patrimoine non déduites.
                  </>
                )}
              </p>
            </div>
          </div>
        </Reveal>

        <div>
          {TARIFS.map((t, i) => (
            <TarifRow key={`${t.a}-${i}`} t={t} i={i} />
          ))}
          <div style={{ borderTop: `1px solid ${C.border}` }} />
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · AVIS — spotlight rotatif, un seul témoignage à la fois
   ════════════════════════════════════════════════════════════════════════════ */
function Avis() {
  const [i, setI] = useState(0);
  const total = AVIS.length;
  const a = AVIS[i % total];

  return (
    <section
      className="i352-pad"
      style={{ position: "relative", background: C.bgDarkAlt, color: C.white, padding: "clamp(80px,11vw,152px) clamp(20px,5vw,64px)", overflow: "hidden", }}
    >
      <div aria-hidden style={{ position: "absolute", inset: 0, ...slateTexture(0.14), pointerEvents: "none" }} />
      <div
        aria-hidden
        style={{ position: "absolute", inset: "-30% 30% auto -10%", height: "90%", background: "radial-gradient(50% 60% at 40% 50%, rgba(49,88,122,0.11), transparent 70%)", pointerEvents: "none", }}
      />

      <div style={{ position: "relative", maxWidth: 940, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "clamp(26px,4vw,44px)" }}>
            <Kicker color="rgba(219,230,239,0.72)" align="center">
              {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? "Des maisons qui traversent"}
            </Kicker>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <Quote size={34} color={C.accentLight} strokeWidth={1} style={{ opacity: 0.6, marginBottom: 22 }} />
        </Reveal>

        <motion.blockquote
          key={i}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: EASE }}
          style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(20px,2.9vw,38px)", lineHeight: 1.4, color: "rgba(244,246,248,0.94)", margin: "0 auto", maxWidth: 820, }}
        >
          « {a.texte} »
        </motion.blockquote>

        <motion.div
          key={`m-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.75, ease: EASE, delay: 0.1 }}
          style={{ marginTop: "clamp(24px,3vw,38px)" }}
        >
          <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: C.white }}>{a.auteur}</div>
          <div
            style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: C.accentLight, marginTop: 8, }}
          >
            {a.detail}
          </div>
        </motion.div>

        {/* Conduite de sélection : filets qui s'allongent */}
        <div
          style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: "clamp(30px,4vw,50px)", flexWrap: "wrap", }}
        >
          {AVIS.map((_, n) => (
            <button
              key={n}
              onClick={() => setI(n)}
              aria-label={`Témoignage ${n + 1}`}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "18px 4px", minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", }}
            >
              <span
                style={{ display: "block", height: 1.5, width: n === i % total ? 46 : 20, background: n === i % total ? C.accentLight : "rgba(244,246,248,0.28)", transition: `all .55s ${EASE_CSS}`, }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · CONTACT — zones desservies, téléphone, courriel, adresse
   ════════════════════════════════════════════════════════════════════════════ */
function Contact() {
  const tel = clientPhone(sessionData) ?? fd?.phone ?? "02 35 00 00 00";
  const telHref = `tel:${clientPhone(sessionData) ?? fd?.phone ?? "+33235000000"}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "atelier@zinc-et-ardoise.fr";
  const zones = clientAreas(sessionData);

  return (
    <section
      id="contact"
      className="i352-pad"
      style={{ position: "relative", background: C.bg, padding: "clamp(80px,11vw,150px) clamp(20px,5vw,64px)", overflow: "hidden", }}
    >
      <div
        aria-hidden
        style={{ position: "absolute", inset: "auto -10% -40% -10%", height: "70%", background: "radial-gradient(50% 60% at 50% 60%, rgba(49,88,122,0.10), transparent 70%)", pointerEvents: "none", }}
      />
      <div
        className="i352-contact"
        style={{ position: "relative", maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,0.9fr)", gap: "clamp(32px,5vw,80px)", alignItems: "start", }}
      >
        <Reveal>
          <div>
            <Kicker>Premier regard</Kicker>
            <h2
              style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(30px,4.4vw,58px)", lineHeight: 1.05, letterSpacing: "-0.016em", color: C.ink, margin: "22px 0 20px", }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                <>
                  Votre toit a une histoire,
                  <br />
                  <em style={{ color: C.accent }}>racontez-la nous.</em>
                </>
              )}
            </h2>
            <p
              style={{ fontFamily: SANS, fontWeight: 300, fontSize: 16, lineHeight: 1.78, color: C.textMuted, maxWidth: 500, margin: "0 0 clamp(24px,3vw,36px)", }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ?? (
                <>
                  Diagnostic patrimonial dans toute la Seine-Maritime. Nous intervenons aussi en conseil
                  avant achat d'une maison ancienne.
                </>
              )}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <LineButton href={telHref} filled>
                {tel}
              </LineButton>
              <LineButton href={`mailto:${mail}`}>Nous écrire</LineButton>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div
            style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "clamp(26px,3vw,38px)", }}
          >
            {[
              { icon: <Phone size={15} strokeWidth={1.5} />, l: "Téléphone", v: tel },
              { icon: <Mail size={15} strokeWidth={1.5} />, l: "Courriel", v: mail },
              {
                icon: <MapPin size={15} strokeWidth={1.5} />,
                l: "Atelier",
                v:
                  clientAddress(sessionData) ??
                  clientCodePostalVille(sessionData, "76000", "Rouen") + ", Seine-Maritime",
              },
            ].map((row, n) => (
              <div
                key={row.l}
                style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: 14, alignItems: "start", padding: "16px 0", borderTop: n === 0 ? "none" : `1px solid ${C.border}`, }}
              >
                <span style={{ color: C.accent, paddingTop: 3 }}>{row.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.3em", textTransform: "uppercase", color: C.textFaint, marginBottom: 6, }}
                  >
                    {row.l}
                  </div>
                  <div style={{ fontFamily: SERIF, fontSize: 18, color: C.ink, wordBreak: "break-word" }}>
                    {row.v}
                  </div>
                </div>
              </div>
            ))}

            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18, marginTop: 4 }}>
              <div
                style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.3em", textTransform: "uppercase", color: C.textFaint, marginBottom: 12, }}
              >
                Secteurs d'intervention
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(zones ?? ["Seine-Maritime", clientCity(sessionData) ?? "Rouen", "Bâti ancien & secteur sauvegardé"]).map(
                  (z, n) => (
                    <span
                      key={`${z}-${n}`}
                      style={{ fontFamily: SANS, fontSize: 12, color: C.textMuted, border: `1px solid ${C.border}`, padding: "7px 13px", background: C.bg, }}
                    >
                      {z}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   11 · PIED DE PAGE
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const nom = fd?.businessName ?? clientName(sessionData) ?? "Zinc & Ardoise";
  const tel = clientPhone(sessionData) ?? fd?.phone ?? "02 35 00 00 00";
  return (
    <footer
      className="i352-pad"
      style={{ position: "relative", background: C.bgDark, color: "rgba(244,246,248,0.55)", padding: "clamp(52px,7vw,84px) clamp(20px,5vw,64px) 26px", overflow: "hidden", }}
    >
      <div aria-hidden style={{ position: "absolute", inset: 0, ...slateTexture(0.12), pointerEvents: "none" }} />
      <div style={{ position: "relative", maxWidth: 1160, margin: "0 auto" }}>
        <div
          className="i352-footgrid"
          style={{ display: "grid", gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)", gap: "clamp(28px,4vw,64px)", paddingBottom: "clamp(28px,4vw,44px)", }}
        >
          <div>
            <div style={{ fontFamily: SERIF, fontSize: 25, color: C.accentLight, marginBottom: 12 }}>{nom}</div>
            <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 13.5, lineHeight: 1.8, margin: 0, maxWidth: 380 }}>
              {clientTrade(sessionData) ?? "Couverture patrimoniale"} · {clientCity(sessionData) ?? "Rouen"}
              <br />
              Décennale, Qualibat patrimoine bâti 3231
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {[
              { icon: <MapPin size={13} strokeWidth={1.5} />, t: clientCodePostalVille(sessionData, "76000", "Rouen") + ", Seine-Maritime" },
              { icon: <Phone size={13} strokeWidth={1.5} />, t: tel },
              { icon: <Compass size={13} strokeWidth={1.5} />, t: "Lun–Ven 8h–18h" },
            ].map((row, n) => (
              <div key={n} style={{ display: "flex", gap: 11, alignItems: "center", fontFamily: SANS, fontSize: 13 }}>
                <span style={{ color: C.accentLight, display: "flex" }}>{row.icon}</span>
                {row.t}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{ borderTop: "1px solid rgba(244,246,248,0.1)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, fontFamily: SANS, fontSize: 11.5, color: "rgba(244,246,248,0.3)", }}
        >
          <span>
            © 2026 {nom} — Site réalisé par Aevia WS · SIREN{" "}
            <LegalIdentity fallback="852 546 225" kind="siren" />
            {/* VILLE_PIED */}
            {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
          </span>
          <span>
            Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════════════ */
export default function ZincEtArdoisePage() {
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
         création, elle peut n'être pas encore lisible. Trois tentatives. */
      for (const attente of [0, 600, 2000]) {
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

  /* Les variables de module d'abord : tout helper appelé plus bas les lit. */
  fd = session?.formData;
  c = session?.generatedContent;
  bp = session?.businessProfile;
  sessionData = session;
  SERVICES_SOURCE = SERVICES_SOURCE_LIVE();
  brand = fd?.brandColor ?? null;
  if (brand) C = { ...C, accent: brand };

  /* Les blocs vivants, ré-évalués à chaque rendu. */
  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...SERVICES_SOURCE[i % SERVICES_SOURCE.length],
      titre: s.title,
    })),
    SERVICES_SOURCE,
  );
  SERVICES = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...SERVICES_SOURCE[i % SERVICES_SOURCE.length],
      num: SERVICES_SOURCE[i % SERVICES_SOURCE.length].num,
      tag: SERVICES_SOURCE[i % SERVICES_SOURCE.length].tag,
      titre: s.title ?? SERVICES_SOURCE[i % SERVICES_SOURCE.length].titre,
      desc: s.description ?? s.desc ?? SERVICES_SOURCE[i % SERVICES_SOURCE.length].desc,
    })),
    SERVICES_DEMO,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      ...AVIS_SOURCE[i % AVIS_SOURCE.length],
      auteur: r.author,
      texte: r.text,
    })),
    AVIS_SOURCE,
  );
  AVIS = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      ...AVIS_DEMO[i % AVIS_DEMO.length],
      texte: r.text ?? AVIS_DEMO[i % AVIS_DEMO.length].texte,
      auteur: r.name ?? r.author ?? AVIS_DEMO[i % AVIS_DEMO.length].auteur,
      detail: r.location ?? r.role ?? AVIS_DEMO[i % AVIS_DEMO.length].detail,
    })),
    AVIS_DEMO,
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
  METHODE = resolveList(
    clientList(sessionData, "demarche.etapes")?.map((l: string, i: number) => ({
      ...METHODE_DEMO[i % METHODE_DEMO.length],
      t: l,
    })),
    METHODE_DEMO,
  );
  STATS = resolveList(clientStats(sessionData), STATS_DEMO);
  ENGAGEMENT = resolveList(
    clientList(sessionData, "engagements.liste") ?? clientCertifications(sessionData),
    ENGAGEMENT_DEMO,
  );

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip" }}>
      <style>{`
        ${FONTS_CSS}

        /* Nav : le bloc de liens disparaît au profit du menu au pouce. */
        @media (max-width: 980px) {
          #i352-nav { display: none !important; }
          .i352-burger { display: flex !important; }
        }
        @media (max-width: 560px) { .i352-navtrade { display: none !important; } }

        /* Grilles à deux (ou trois) colonnes : media queries locales du thème,
           on ne compte pas sur app/templates/layout.tsx. */
        @media (max-width: 900px) {
          .i352-meta { grid-template-columns: minmax(0,1fr) !important; row-gap: 12px; }
          .i352-metahide { display: none !important; }
          .i352-chapo { grid-template-columns: minmax(0,1fr) !important; }
          .i352-manifeste { grid-template-columns: minmax(0,1fr) !important; }
          .i352-split { grid-template-columns: minmax(0,1fr) !important; }
          .i352-contact { grid-template-columns: minmax(0,1fr) !important; }
          .i352-footgrid { grid-template-columns: minmax(0,1fr) !important; }
          .i352-step { grid-template-columns: minmax(0,1fr) !important; row-gap: 10px; }
          .i352-methode { grid-template-columns: minmax(0,1fr) !important; }
          /* Collant → statique au point de rupture, sinon le panneau saute. */
          .i352-panneau { position: static !important; max-width: 420px; }
        }
        @media (max-width: 760px) {
          .i352-row { grid-template-columns: 54px minmax(0,1fr) !important; row-gap: 12px; }
          .i352-row > p { grid-column: 2 / -1; }
          .i352-tarif { grid-template-columns: minmax(0,1fr) !important; row-gap: 8px; }
        }
        @media (max-width: 480px) {
          .i352-pad { padding-left: 20px !important; padding-right: 20px !important; }
        }

        /* Le geste et les révélations honorent la préférence système. */
        @media (prefers-reduced-motion: reduce) {
          .i352-band img { transform: none !important; }
        }

        #i352-nav a, .i352-burger { transition: all .5s ${EASE_CSS}; }
      `}</style>

      <Nav />
      <Hero />
      <Respiration />
      <Manifeste />
      <Services />
      <Methode />
      <Engagements />
      <Tarifs />
      <Avis />
      <Contact />
      <Footer />
    </div>
  );
}
