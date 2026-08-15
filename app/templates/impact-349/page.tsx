"use client";
// @ts-nocheck

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Gauge, Mail, MapPin, Phone } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, GhostSolid, HairlineArrows, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
import { FixedRail } from "@/lib/templates/hero-kit-3";
import {
  clientAccrocheRestante,
  clientAddress,
  clientCertifications,
  clientCity,
  clientCodePostalVille,
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

/* ════════════════════════════════════════════════════════════════════════════
   {clientName(sessionData) ?? "Contrôle Rhodanien"} — Centre de contrôle technique agréé · Valence

   Contrôle technique, 1re variante (la 2e est impact-350, claire et familiale).
   Celle-ci vend l'atelier : le banc, la ligne, l'instrument. Ton d'atelier,
   fond sombre, chiffres en évidence.

   Archétype H5 : rail latéral fixe + titre monumental. Le rail porte le
   compteur des postes de contrôle et ne bouge jamais ; tout le mouvement se
   passe à sa droite. La colonne de droite du héros porte les chiffres — ils
   sont dans le héros, pas dans une bande de plus.

   Geste signature : GhostSolid (hero-kit-2), appliqué autrement qu'en
   impact-332 (serrurier), qui en fait un lockup fixe à deux lignes. Ici le
   contour/plein devient un **compteur** : les postes de contrôle sont écrits
   au trait tant qu'ils n'ont pas été passés, pleins dans l'accent une fois
   validés, et un seul index — celui de `useSlides` — pilote le rail, le
   compteur et la légende. Le titre reste posé, en lockup contour/plein, parce
   que c'est la promesse : le véhicule tel qu'il arrive, le véhicule validé.

   Fontes P6 — Archivo (voix d'impact, chiffres tabulaires, capitales larges)
   contre Inter (corps, tableaux de tarifs, mentions réglementaires). Les rôles
   sont franchement opposés : Archivo ne sert jamais un paragraphe, Inter ne
   sert jamais un titre.
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

/* ── Fontes ──────────────────────────────────────────────────────────────── */
const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,500;0,600;0,700;0,800;0,900;1,500;1,700&family=Inter:wght@300;400;500;600;700&display=swap');`;

const DISPLAY = "'Archivo', 'Arial Narrow', system-ui, sans-serif";
const SANS = "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";

/* ── Easing unique, répété littéralement en CSS ──────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Palette ─────────────────────────────────────────────────────────────── */
let C: Record<string, string> = {
  bg: "#0f1114",
  bgAlt: "#14171c",
  bgDark: "#0a0c0f",
  bgDarkAlt: "#07080a",
  bgCard: "#171b21",
  accent: "var(--brand, #f5a524)",
  accentDark: "var(--brand-light, #ffc766)",
  accentLight: "#1d1710",
  ink: "#f3f1ec",
  textMuted: "#9aa0aa",
  textFaint: "#6a717c",
  border: "rgba(255,255,255,0.09)",
  white: "#ffffff",
  /* clé métier : l'acier du banc de freinage, pour les dessins au trait */
  banc: "#c9ced6",
};

/* ════════════════════════════════════════════════════════════════════════════
   Données — SOURCE figée, réhydratée dans le rendu par resolveList
   ════════════════════════════════════════════════════════════════════════════ */

const NAV = [
  { l: "Contrôles", h: "#services" },
  { l: "Le déroulé", h: "#methode" },
  { l: "Engagements", h: "#engagements" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/*
  Les cinq postes du compteur. Ils ne sont pas inventés : ce sont les familles
  citées mot pour mot par la première prestation du thème — « freinage,
  direction, liaisons au sol, pollution, éclairage ».
*/
const POSTES = [
  { l: "Freinage", n: "01" },
  { l: "Direction", n: "02" },
  { l: "Liaisons au sol", n: "03" },
  { l: "Pollution", n: "04" },
  { l: "Éclairage", n: "05" },
];

const SERVICES_SOURCE = [
  { titre: "Contrôle technique périodique", desc: "Les 133 points réglementaires : freinage, direction, liaisons au sol, pollution, éclairage. Rapport remis et expliqué ligne à ligne.", tag: "VL" },
  { titre: "Contre-visite", desc: "Incluse pendant deux mois : revenez quand c'est réparé, on ne re-contrôle que les points défaillants. Sans rendez-vous le samedi matin.", tag: "Incluse" },
  { titre: "Véhicules électriques & hybrides", desc: "Contrôleurs habilités haute tension, points spécifiques VE vérifiés selon la réglementation en vigueur.", tag: "Électrique" },
  { titre: "Utilitaires & camping-cars", desc: "Jusqu'à 3,5 t, ligne adaptée aux gabarits hauts. Contrôle pollution renforcé des utilitaires diesel.", tag: "Utilitaire" },
  { titre: "Contrôle volontaire", desc: "Avant un achat d'occasion ou un long trajet : le même banc, sans enregistrement officiel. Savoir avant d'acheter.", tag: "Volontaire" },
  { titre: "Deux-roues motorisés", desc: "Le contrôle des motos et scooters, désormais obligatoire, réalisé sur ligne dédiée par contrôleur formé.", tag: "Moto" },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE_SOURCE = [
  { n: "01", t: "RDV en ligne ou par téléphone", d: "Créneaux du lundi au samedi midi, rappel SMS la veille, dépôt des clés possible dès 7 h 45." },
  { n: "02", t: "Le contrôle, visible", d: "La baie vitrée donne sur les lignes : regardez votre véhicule passer les bancs, un café à la main." },
  { n: "03", t: "Le rapport, expliqué", d: "Chaque défaillance montrée sur le véhicule quand c'est possible, mineure/majeure/critique clairement distinguées." },
  { n: "04", t: "La suite, sans pression", d: "Nous ne vendons aucune réparation. Vous réparez où vous voulez, la contre-visite est incluse deux mois." },
];

const ENGAGEMENT_SOURCE = [
  "Centre agréé par la préfecture de la Drôme (S 026 X 042), contrôleurs agréés individuellement",
  "Indépendance totale : la loi nous interdit la réparation, nous ne recommandons aucun garage",
  "Prix affichés en salle d'attente et en ligne — le même pour tout le monde",
  "Équipements calibrés et vérifiés selon le référentiel OTC en vigueur",
];
let ENGAGEMENT = ENGAGEMENT_SOURCE;

const TARIFS_SOURCE = [
  { a: "Contrôle technique VL essence/diesel", p: "79 €", n: "133 points, rapport expliqué, contre-visite incluse 2 mois." },
  { a: "Véhicule électrique ou hybride", p: "85 €", n: "Points haute tension inclus, contrôleur habilité." },
  { a: "Deux-roues motorisé", p: "60 €", n: "Ligne dédiée, contrôle réglementaire complet." },
  { a: "Contrôle volontaire avant achat", p: "59 €", n: "Même banc, rapport détaillé, sans enregistrement officiel." },
];
let TARIFS = TARIFS_SOURCE;

const AVIS_SOURCE = [
  { texte: "Défaillance majeure sur le freinage : le contrôleur m'a montré la pièce sous le pont, expliqué le risque, et ne m'a orienté vers personne. Réparé chez mon garagiste, contre-visite en dix minutes.", auteur: "Marielle P.", detail: "Contrôle + contre-visite" },
  { texte: "Contrôle volontaire avant d'acheter une occasion : 340 € de frais cachés détectés, prix renégocié d'autant. Les 59 € les plus rentables de l'année.", auteur: "Hugo D.", detail: "Contrôle avant achat" },
  { texte: "Camping-car passé sans stress, ligne adaptée, contrôleur qui connaît les porteurs. RDV pris en ligne la veille pour le samedi matin.", auteur: "Jean-Luc et Françoise", detail: "Camping-car" },
];
let AVIS_DEMO = AVIS_SOURCE;

const STATS_SOURCE = [
  { value: "45 min", label: "Contrôle complet, montre en main" },
  { value: "133", label: "Points de contrôle réglementaires" },
  { value: "0", label: "Réparation vendue — jamais" },
  { value: "2 mois", label: "Pour la contre-visite incluse" },
];
let STATS = STATS_SOURCE;

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

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
    <motion.div ref={ref} style={style} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.9, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}

/** Sur-titre : filet de 40 px puis capitales filées. */
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
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: align === "center" ? "center" : "flex-start" }}>
      <span style={{ width: 40, height: 1, background: color, opacity: 0.85, flexShrink: 0 }} />
      <span style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.36em", textTransform: "uppercase", fontWeight: 600, color }}>
        {children}
      </span>
      {align === "center" && <span style={{ width: 40, height: 1, background: color, opacity: 0.85, flexShrink: 0 }} />}
    </div>
  );
}

/** Chiffre fantôme : la texture qui ne charge rien. */
function Ghost({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span aria-hidden style={{ position: "absolute", fontFamily: DISPLAY, fontWeight: 900, lineHeight: 0.74, color: C.white, opacity: 0.055, pointerEvents: "none", userSelect: "none", fontVariantNumeric: "tabular-nums", ...style, }}>
      {children}
    </span>
  );
}

/**
 * Le cadran d'un banc de mesure, dessiné au trait : arc gradué, aiguille,
 * repère de tolérance. C'est la seule illustration du thème et elle ne charge
 * rien — la page se tient photos bloquées.
 */
function CadranSVG({
  size = 300,
  stroke = C.accent,
  opacity = 1,
  ratio = 0.62,
}: {
  size?: number;
  stroke?: string;
  opacity?: number;
  ratio?: number;
}) {
  return (
    <svg width={size} height={size * ratio} viewBox="0 0 300 186" fill="none" aria-hidden style={{ display: "block", opacity, overflow: "visible" }}>
      {/* arc du cadran */}
      <path d="M28 158 A 122 122 0 0 1 272 158" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <path d="M56 158 A 94 94 0 0 1 244 158" stroke={stroke} strokeWidth="1" opacity="0.35" />
      {/* graduations — treize traits, le dernier plus long */}
      {Array.from({ length: 13 }).map((_, n) => {
        const a = Math.PI - (n / 12) * Math.PI;
        const r1 = 122;
        const r2 = n % 3 === 0 ? 100 : 110;
        return (
          <line key={n} x1={150 + Math.cos(a) * r1} y1={158 - Math.sin(a) * r1} x2={150 + Math.cos(a) * r2} y2={158 - Math.sin(a) * r2} stroke={stroke} strokeWidth={n % 3 === 0 ? 2 : 1} opacity={n % 3 === 0 ? 0.9 : 0.45} strokeLinecap="round"/>
        );
      })}
      {/* zone de tolérance */}
      <path d="M196 62 A 122 122 0 0 1 272 158" stroke={stroke} strokeWidth="5" opacity="0.22" strokeLinecap="round" />
      {/* aiguille */}
      <path d="M150 158 L 96 82" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="150" cy="158" r="8" stroke={stroke} strokeWidth="2" fill="none" />
      <circle cx="150" cy="158" r="2.6" fill={stroke} />
      {/* socle du banc */}
      <path d="M18 176 H 282" stroke={stroke} strokeWidth="1" strokeDasharray="5 8" opacity="0.5" />
    </svg>
  );
}

/** Lien de navigation : soulignement en largeur qui pousse. */
function NavLink({ label, href }: { label: string; href: string }) {
  const [h, setH] = useState(false);
  return (
    <a href={href} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ position: "relative", fontFamily: SANS, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, color: h ? C.ink : C.textMuted, textDecoration: "none", padding: "13px 2px", transition: "color .5s cubic-bezier(0.16, 1, 0.3, 1)", }}>
      {label}
      <span style={{ position: "absolute", left: 0, bottom: 8, height: 1, width: h ? "100%" : "0%", background: C.accent, transition: "width .5s cubic-bezier(0.16, 1, 0.3, 1)", }}/>
    </a>
  );
}

/**
 * Rangée éditoriale de prestation : numéro fantôme, étiquette, titre, texte.
 * Le survol tient en quatre propriétés — fond, filet d'accent, décalage,
 * deux ombres — sur 0,5 s.
 */
function ServiceRow({ s, n }: { s: { titre: string; desc: string; tag: string }; n: number }) {
  const [h, setH] = useState(false);
  return (
    <article
      className="i349-srow"
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ position: "relative", overflow: "hidden", borderTop: `1px solid ${C.border}`, borderLeft: `2px solid ${h ? C.accent : "transparent"}`, background: h ? C.bgCard : "transparent", transform: h ? "translateX(6px)" : "translateX(0)", boxShadow: h ? "0 26px 50px -32px rgba(0,0,0,0.9), inset 0 1px 0 0 rgba(255,255,255,0.06)" : "none", transition: "all .5s cubic-bezier(0.16, 1, 0.3, 1)", }}
    >
      <Ghost style={{ right: 10, bottom: -18, fontSize: "clamp(72px, 8vw, 122px)" }}>{String(n + 1).padStart(2, "0")}</Ghost>
      <div style={{ position: "relative", fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(15px, 1.5vw, 19px)", letterSpacing: "0.02em", color: C.accent, fontVariantNumeric: "tabular-nums" }}>
        {String(n + 1).padStart(2, "0")}
      </div>
      <div style={{ position: "relative", minWidth: 0 }}>
        <span style={{ display: "inline-block", fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.26em", textTransform: "uppercase", fontWeight: 600, color: h ? C.accentDark : C.textFaint, border: `1px solid ${C.border}`, padding: "5px 11px", marginBottom: 14, transition: "color .5s cubic-bezier(0.16, 1, 0.3, 1)", }}>
          {s.tag}
        </span>
        <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(20px, 2.3vw, 29px)", lineHeight: 1.06, letterSpacing: "-0.022em", color: C.ink, margin: 0, }}>
          {s.titre}
        </h3>
      </div>
      <div style={{ position: "relative", minWidth: 0 }}>
        <p style={{ fontFamily: SANS, fontSize: 14.5, fontWeight: 300, lineHeight: 1.8, color: C.textMuted, margin: 0, maxWidth: 520 }}>
          {s.desc}
        </p>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 14, fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: C.accent, opacity: h ? 1 : 0, transform: h ? "translateX(0)" : "translateX(-8px)", transition: "all .5s cubic-bezier(0.16, 1, 0.3, 1)", }}>
          Prendre rendez-vous
          <ArrowRight size={13} style={{ transform: h ? "translateX(4px)" : "translateX(0)", transition: "transform .5s cubic-bezier(0.16, 1, 0.3, 1)" }} />
        </span>
      </div>
    </article>
  );
}

/** Ligne de tarif : table fine à conduite pointillée, prix en display. */
function TarifLigne({ t, n }: { t: { a: string; p: string; n: string }; n: number }) {
  const [h, setH] = useState(false);
  return (
    <div className="i349-tligne" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ borderBottom: `1px solid ${C.border}`, background: h ? "rgba(255,255,255,0.028)" : "transparent", transition: "background .5s cubic-bezier(0.16, 1, 0.3, 1)", }}>
      <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.24em", color: C.textFaint, fontVariantNumeric: "tabular-nums", paddingTop: 6 }}>
        {String(n + 1).padStart(2, "0")}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "nowrap", }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(16px, 1.7vw, 21px)", letterSpacing: "-0.012em", color: h ? C.accentDark : C.ink, transition: "color .5s cubic-bezier(0.16, 1, 0.3, 1)", whiteSpace: "normal", }}>
            {t.a}
          </span>
          {/* la conduite : le pointillé d'une table de tarifs imprimée */}
          <span aria-hidden style={{ flex: 1, minWidth: 18, height: 1, alignSelf: "flex-end", marginBottom: 5, backgroundImage: `linear-gradient(to right, ${C.border} 0 2px, transparent 2px 7px)`, backgroundSize: "7px 1px", backgroundRepeat: "repeat-x", }}/>
        </div>
        <p style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 300, lineHeight: 1.75, color: C.textMuted, margin: "8px 0 0", maxWidth: 520 }}>
          {t.n}
        </p>
      </div>
      <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(20px, 2.2vw, 30px)", letterSpacing: "-0.028em", color: C.accent, whiteSpace: "nowrap", textAlign: "right", fontVariantNumeric: "tabular-nums", }}>
        {t.p}
      </div>
    </div>
  );
}

/* ── Repli photo : le client d'abord, le thème ensuite ───────────────────── */
function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/**
 * Cadre à repli dessiné : sans image, il reste un aplat d'atelier, la trame
 * du sol et le cadran au trait. La section est belle photos bloquées.
 */
function Plaque({
  src,
  alt,
  legende,
  ratio = "4 / 3",
}: {
  src: string;
  alt: string;
  legende: string;
  ratio?: string;
}) {
  const [h, setH] = useState(false);
  return (
    <figure onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ margin: 0, border: `1px solid ${h ? C.accent : C.border}`, background: C.bgDark, transform: h ? "translateY(-4px)" : "none", boxShadow: h ? "0 30px 56px -34px rgba(0,0,0,0.92), inset 0 1px 0 0 rgba(255,255,255,0.06)" : "none", transition: "all .5s cubic-bezier(0.16, 1, 0.3, 1)", }}>
      <div style={{ position: "relative", aspectRatio: ratio, overflow: "hidden", background: `linear-gradient(158deg, ${C.bgCard} 0%, ${C.bgDark} 58%, ${C.bgDarkAlt} 100%)`, }}>
        <div aria-hidden className="i349-trame" style={{ position: "absolute", inset: 0, opacity: 0.55 }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <CadranSVG size={220} stroke={C.banc} opacity={0.26} />
        </div>
        {src ? (
          <img src={src} alt={alt} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", transform: h ? "scale(1.04)" : "scale(1)", transition: "transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)", }}/>
        ) : null}
      </div>
      <figcaption style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: C.textMuted, background: C.bgAlt, padding: "13px 16px", borderTop: `1px solid ${C.border}`, }}>
        {legende}
      </figcaption>
    </figure>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════════════════ */
export default function ControleRhodanienPage() {
  const [session, setSession] = useState<any>(null);
  const reduce = useReducedMotion();

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

  /* Affectations AVANT tout appel de helper : fd/c/bp/sessionData d'abord. */
  fd = session?.formData;
  c = session?.generatedContent;
  bp = session?.businessProfile;
  sessionData = session;
  brand = fd?.brandColor ?? null;

  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...SERVICES_SOURCE[i % SERVICES_SOURCE.length],
      titre: s.title ?? SERVICES_SOURCE[i % SERVICES_SOURCE.length].titre,
      desc: s.description ?? s.desc ?? SERVICES_SOURCE[i % SERVICES_SOURCE.length].desc,
    })),
    SERVICES_SOURCE,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      ...AVIS_SOURCE[i % AVIS_SOURCE.length],
      auteur: r.name ?? r.author ?? AVIS_SOURCE[i % AVIS_SOURCE.length].auteur,
      texte: r.text ?? AVIS_SOURCE[i % AVIS_SOURCE.length].texte,
      detail: r.location ?? r.role ?? AVIS_SOURCE[i % AVIS_SOURCE.length].detail,
    })),
    AVIS_SOURCE,
  );
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
  ENGAGEMENT = resolveList(
    clientList(sessionData, "engagements.liste") ?? clientCertifications(sessionData),
    ENGAGEMENT_SOURCE,
  );
  const SERVICES = SERVICES_DEMO;
  const AVIS = AVIS_DEMO;
  const METHODE = METHODE_SOURCE;

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /*
    L'index unique du héros. Il pilote trois choses et rien d'autre : le
    compteur du rail, quels postes sont passés au plein, et la légende sous le
    compteur. DWELL.brisk = 3 s pour une transition de 0,7 s — la règle du
    catalogue veut 3 à 6 fois la transition.
  */
  const { i, next, prev } = useSlides(POSTES.length, DWELL.brisk);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const marque = fd?.businessName ?? clientName(sessionData) ?? "Contrôle Rhodanien";
  const ville = clientCity(sessionData) ?? "Valence";
  const metier = clientTrade(sessionData) ?? "Contrôle technique";
  const tel = clientPhone(sessionData) ?? "04 75 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? "+33475000000").replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? "rdv@controle-rhodanien.fr";
  const adresse = clientAddress(sessionData);

  /* Le lockup contour/plein du titre monumental, câblé au contrat. */
  const lockGhost = (clientHeroLine(sessionData, 0, 2, 15) ?? "VOTRE VÉHICULE").toUpperCase();
  const lockSolid = (clientHeroLine(sessionData, 1, 2, 15) ?? "VALIDÉ.").toUpperCase();

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip" }}>
      <style>{`${FONTS_CSS}

        /* ── texture métier : la trame du sol d'atelier + le zébré d'allée ── */
        .i349-trame {
          background-image:
            repeating-linear-gradient(0deg, rgba(255,255,255,0.045) 0 1px, rgba(255,255,255,0) 1px 30px),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.028) 0 1px, rgba(255,255,255,0) 1px 30px);
          pointer-events: none;
        }
        .i349-zebre {
          background-image: repeating-linear-gradient(
            -45deg,
            rgba(245,165,36,0.16) 0 10px,
            rgba(245,165,36,0) 10px 22px
          );
          pointer-events: none;
        }

        /* ── grilles pilotées ici, jamais en style inline ────────────────── */
        .i349-hero {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.42fr) minmax(0, 0.58fr);
          gap: clamp(30px, 4.4vw, 66px);
          align-items: center;
          min-height: 100dvh;
          max-width: 1300px;
          margin: 0 auto;
          padding: clamp(126px, 15vh, 176px) clamp(22px, 5vw, 60px) clamp(54px, 7vw, 96px) clamp(86px, 9vw, 148px);
        }

        .i349-compteur {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(150px, 100%), 1fr));
          gap: clamp(10px, 1.4vw, 18px);
          border-top: 1px solid rgba(255,255,255,0.09);
          padding-top: clamp(18px, 2.2vw, 26px);
        }

        .i349-chiffres {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 0;
        }

        .i349-srow {
          display: grid;
          grid-template-columns: minmax(0, 58px) minmax(0, 1fr) minmax(0, 1.25fr);
          gap: clamp(14px, 2.4vw, 40px);
          align-items: start;
          padding: clamp(24px, 3vw, 40px) clamp(14px, 1.8vw, 24px);
        }

        .i349-etapes {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr));
          gap: clamp(16px, 2vw, 26px);
        }

        .i349-split {
          display: grid;
          grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
          gap: clamp(30px, 5vw, 78px);
          align-items: center;
          max-width: 1160px;
          margin: 0 auto;
        }

        .i349-tligne {
          display: grid;
          grid-template-columns: minmax(0, 44px) minmax(0, 1fr) minmax(0, 170px);
          gap: clamp(12px, 2vw, 26px);
          align-items: start;
          padding: clamp(20px, 2.4vw, 30px) clamp(10px, 1.6vw, 20px);
        }

        .i349-avis {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
          gap: clamp(16px, 2.2vw, 26px);
          align-items: start;
        }
        /* colonnes décalées : la deuxième descend, la troisième un peu moins */
        .i349-avis > :nth-child(2) { margin-top: clamp(0px, 3.4vw, 46px); }
        .i349-avis > :nth-child(3) { margin-top: clamp(0px, 1.7vw, 23px); }

        .i349-plaques {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
          gap: clamp(16px, 2vw, 24px);
        }

        .i349-pied {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr);
          gap: clamp(24px, 4vw, 56px);
        }

        /* ── points de rupture ───────────────────────────────────────────── */
        @media (max-width: 1040px) {
          #i349-nav { display: none !important; }
          .i349-burger { display: flex !important; }
          .i349-hero {
            grid-template-columns: 1fr;
            padding-left: clamp(22px, 5vw, 60px);
          }
          /* le rail est un dispositif de grand écran : sous 1040 px il
             occuperait la moitié de la largeur utile pour un compteur. */
          .i349-rail { display: none !important; }
          .i349-split { grid-template-columns: 1fr; }
          .i349-pied { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 860px) {
          .i349-srow {
            grid-template-columns: minmax(0, 44px) minmax(0, 1fr);
            row-gap: 14px;
          }
          .i349-srow > :last-child { grid-column: 2 / -1; }
          .i349-tligne {
            grid-template-columns: minmax(0, 36px) minmax(0, 1fr);
            row-gap: 10px;
          }
          .i349-tligne > :last-child { grid-column: 2 / -1; text-align: left; }
          .i349-avis > :nth-child(2),
          .i349-avis > :nth-child(3) { margin-top: 0; }
          .i349-pied { grid-template-columns: 1fr; }
        }

        @media (prefers-reduced-motion: reduce) {
          .i349-srow, .i349-tligne { transition: none !important; }
        }
      `}</style>

      {/* ══ NAV ══════════════════════════════════════════════════════════ */}
      <nav
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: scrolled ? "10px clamp(18px, 5vw, 56px)" : "22px clamp(18px, 5vw, 56px)", background: scrolled ? "rgba(15,17,20,0.93)" : "transparent", backdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none", WebkitBackdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "padding .55s cubic-bezier(0.16, 1, 0.3, 1), background .55s cubic-bezier(0.16, 1, 0.3, 1), border-color .55s cubic-bezier(0.16, 1, 0.3, 1), backdrop-filter .55s cubic-bezier(0.16, 1, 0.3, 1)", }}
      >
        <a href="#haut" style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0, textDecoration: "none" }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={marque} style={{ height: 32, maxWidth: 168, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Gauge size={19} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 18, letterSpacing: "-0.008em", color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", }}>
                {marque}
              </span>
              <span style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.3em", textTransform: "uppercase", color: C.textFaint, marginLeft: 4, whiteSpace: "nowrap", }}>
                {metier}
              </span>
            </>
          )}
        </a>

        <div id="i349-nav" style={{ display: "flex", gap: "clamp(14px, 1.8vw, 28px)", alignItems: "center" }}>
          {NAV.map((n) => (
            <NavLink key={n.l} label={n.l} href={n.h} />
          ))}
          <motion.a href={telHref} whileHover={{ y: -2 }} transition={{ duration: 0.45, ease: EASE }} style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, background: C.accent, color: "#15100a", padding: "13px 24px", textDecoration: "none", whiteSpace: "nowrap", }}>
            RDV en 2 min
          </motion.a>
        </div>

        <button className="i349-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44, }}>
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "transform .35s cubic-bezier(0.16, 1, 0.3, 1)", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "opacity .3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "transform .35s cubic-bezier(0.16, 1, 0.3, 1)", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>

      {mobileOpen && (
        <div style={{ position: "fixed", top: 60, left: 0, right: 0, zIndex: 99, background: C.bgAlt, borderBottom: `1px solid ${C.border}`, padding: "18px clamp(20px, 6vw, 32px) 26px", display: "flex", flexDirection: "column", gap: 2, }}>
          {NAV.map((n) => (
            <a key={n.l} href={n.h} onClick={() => setMobileOpen(false)} style={{ fontFamily: SANS, fontSize: 15, letterSpacing: "0.04em", color: C.ink, textDecoration: "none", padding: "13px 0", borderBottom: `1px solid ${C.border}`, }}>
              {n.l}
            </a>
          ))}
          <a href={telHref} style={{ marginTop: 14, background: C.accent, color: "#15100a", textAlign: "center", padding: "15px 22px", fontFamily: SANS, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, textDecoration: "none", }}>
            RDV en 2 min
          </a>
        </div>
      )}

      {/* ══ HERO — H5 : rail latéral fixe + titre monumental ═════════════ */}
      <section id="haut" className="i349-hero">
        <div aria-hidden className="i349-trame" style={{ position: "absolute", inset: 0, opacity: 0.62 }} />
        <div aria-hidden style={{ position: "absolute", top: "-6%", right: "-10%", width: "min(880px, 96vw)", height: "min(880px, 96vw)", background: "radial-gradient(circle, rgba(245,165,36,0.11) 0%, rgba(245,165,36,0) 62%)", pointerEvents: "none", }}/>
        <Ghost style={{ bottom: "3%", right: "1%", fontSize: "clamp(120px, 19vw, 300px)", opacity: 0.045 }}>133</Ghost>

        {/* Le rail : il ne bouge jamais, il compte. */}
        <FixedRail color={C.bgDark} side="left" width="clamp(64px, 6vw, 104px)" className="i349-rail">
          <div style={{ display: "grid", placeItems: "center", gap: 20, padding: "104px 0 40px" }}>
            <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontFamily: SANS, fontSize: 10, letterSpacing: "0.36em", textTransform: "uppercase", color: C.textFaint, whiteSpace: "nowrap", }}>
              133 points de contrôle
            </span>
            <span aria-hidden style={{ width: 1, height: "clamp(60px, 12vh, 130px)", background: `linear-gradient(to bottom, ${C.accent}, rgba(245,165,36,0))` }} />
            <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 15, color: C.accentDark }}>
              <SlideIndex i={i} total={POSTES.length} variant="fraction" color={C.accentDark} className="" />
            </div>
            <HairlineArrows onPrev={prev} onNext={next} color={C.textMuted} vertical className="" />
          </div>
        </FixedRail>

        {/* Colonne du titre */}
        <div style={{ position: "relative", zIndex: 2, minWidth: 0 }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}>
            <Kicker>{clientEyebrow(sessionData) ?? `Contrôle technique · ${ville}`}</Kicker>
          </motion.div>

          {/* ── GESTE SIGNATURE, 1er emploi : le lockup contour / plein ─── */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.95, ease: EASE, delay: 0.16 }} style={{ margin: "clamp(20px, 2.6vw, 34px) 0 0" }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(42px, 8.2vw, 116px)", lineHeight: 0.93, letterSpacing: "-0.038em", margin: 0, overflowWrap: "break-word", }}>
              <GhostSolid ghost={lockGhost} solid={lockSolid} accent={C.accent} strokeWidth={1.5} className="" />
            </h1>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease: EASE, delay: 0.3 }} style={{ fontFamily: SANS, fontSize: "clamp(15px, 1.25vw, 17px)", fontWeight: 300, lineHeight: 1.8, color: C.textMuted, maxWidth: 520, margin: "clamp(22px, 2.6vw, 32px) 0 clamp(26px, 3vw, 34px)", }}>
            {clientAccrocheRestante(sessionData, 2, 15) ??
              clientHeroPrestations(sessionData) ??
              c?.heroSubline ??
              "Un contrôle honnête, expliqué point par point, sans vente forcée : nous ne réparons pas, nous contrôlons — c'est la garantie de notre indépendance. Rendez-vous en ligne, résultat en 45 minutes."}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.42 }} style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: "clamp(30px, 3.6vw, 48px)" }}>
            <motion.a href={telHref} whileHover={{ y: -3 }} transition={{ duration: 0.45, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.accent, color: "#15100a", fontFamily: SANS, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, padding: "17px 32px", textDecoration: "none", boxShadow: "0 18px 38px -22px rgba(245,165,36,0.95)", }}>
              Prendre rendez-vous <ArrowRight size={15} />
            </motion.a>
            <motion.a href="#services" whileHover={{ y: -3 }} transition={{ duration: 0.45, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "transparent", color: C.ink, border: `1px solid ${C.border}`, fontFamily: SANS, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500, padding: "16px 28px", textDecoration: "none", }}>
              Les contrôles
            </motion.a>
          </motion.div>

          {/* ── GESTE SIGNATURE, 2e emploi : le compteur des postes ─────── */}
          {/*
            Le contour devient plein au fur et à mesure : un poste écrit au
            trait n'est pas encore passé, un poste plein l'est. Le même index
            que le rail, aucun autre état. Stagger 55 ms entre les postes.
          */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.54 }} className="i349-compteur">
            {POSTES.map((p, n) => {
              const passe = n <= i;
              return (
                <div key={p.n} style={{ minWidth: 0 }}>
                  <div style={{ height: 2, background: passe ? C.accent : "rgba(255,255,255,0.10)", transform: passe || reduce ? "scaleX(1)" : "scaleX(0.32)", transformOrigin: "left center", transition: `background .7s cubic-bezier(0.16, 1, 0.3, 1) ${n * 0.055}s, transform .7s cubic-bezier(0.16, 1, 0.3, 1) ${n * 0.055}s`, marginBottom: 12, }}/>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(14px, 1.5vw, 18px)", letterSpacing: "0.02em", lineHeight: 1.18, color: passe ? C.accent : "transparent", WebkitTextStroke: passe ? "0px transparent" : `1px rgba(255,255,255,0.42)`, transition: `color .7s cubic-bezier(0.16, 1, 0.3, 1) ${n * 0.055}s, -webkit-text-stroke-color .7s cubic-bezier(0.16, 1, 0.3, 1)`, }}>
                    {p.l}
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textFaint, marginTop: 7, fontVariantNumeric: "tabular-nums", }}>
                    Poste {p.n}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Colonne des chiffres : ils vivent dans le héros, pas dans une bande. */}
        <motion.div initial={{ opacity: 0, x: reduce ? 0 : 26 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.05, ease: EASE, delay: 0.28 }} style={{ position: "relative", zIndex: 2, minWidth: 0 }}>
          <div className="i349-chiffres" style={{ border: `1px solid ${C.border}`, background: `linear-gradient(162deg, ${C.bgAlt} 0%, ${C.bgDark} 100%)`, }}>
            <div style={{ position: "relative", padding: "clamp(20px, 2.4vw, 28px) clamp(18px, 2vw, 26px) clamp(8px, 1vw, 12px)" }}>
              <CadranSVG size={210} stroke={C.accentDark} opacity={0.85} ratio={0.58} />
            </div>
            {STATS.map((s: any, idx: number) => (
              <div key={`${s.label}-${idx}`} style={{ position: "relative", overflow: "hidden", borderTop: `1px solid ${C.border}`, padding: "clamp(16px, 2vw, 22px) clamp(18px, 2vw, 26px)", }}>
                <Ghost style={{ top: -6, right: 10, fontSize: "clamp(46px, 5vw, 70px)" }}>{String(idx + 1).padStart(2, "0")}</Ghost>
                <div style={{ position: "relative", fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(24px, 2.6vw, 34px)", lineHeight: 1, letterSpacing: "-0.03em", color: C.accentDark, fontVariantNumeric: "tabular-nums", }}>
                  {s.value}
                </div>
                <div style={{ position: "relative", fontFamily: SANS, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.textFaint, marginTop: 9, lineHeight: 1.6, }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══ RESPIRATION ══════════════════════════════════════════════════ */}
      <section style={{ position: "relative", overflow: "hidden", padding: "clamp(58px, 9vw, 118px) clamp(22px, 6vw, 68px)", background: C.bgAlt, borderTop: `1px solid ${C.border}`, textAlign: "center", }}>
        <div aria-hidden className="i349-zebre" style={{ position: "absolute", left: 0, right: 0, top: 0, height: 5, opacity: 0.9 }} />
        <Reveal>
          <p style={{ fontFamily: DISPLAY, fontWeight: 500, fontStyle: "italic", fontSize: "clamp(21px, 2.9vw, 37px)", lineHeight: 1.38, letterSpacing: "-0.018em", color: C.ink, maxWidth: 800, margin: "0 auto", }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (
              <>
                Nous ne réparons pas, <span style={{ color: C.accent }}>nous contrôlons.</span>
              </>
            )}
          </p>
        </Reveal>
      </section>

      {/* ══ CONTRÔLES — rangées éditoriales numérotées ═══════════════════ */}
      <section id="services" style={{ padding: "clamp(64px, 10vw, 132px) clamp(22px, 6vw, 68px)", background: C.bg, position: "relative", overflow: "hidden" }}>
        <Ghost style={{ top: "1%", left: "-2%", fontSize: "clamp(110px, 17vw, 250px)", opacity: 0.035 }}>OTC</Ghost>
        <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(26px, 3.4vw, 46px)", maxWidth: 760 }}>
              <Kicker>Contrôles</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(30px, 4.6vw, 62px)", lineHeight: 1.03, letterSpacing: "-0.034em", color: C.ink, margin: "clamp(16px, 2vw, 24px) 0 0", }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                  <>
                    Tout ce qui roule
                    <br />
                    <em style={{ fontStyle: "italic", fontWeight: 500, color: C.accent }}>passe au banc.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 14.5, fontWeight: 300, lineHeight: 1.8, color: C.textMuted, maxWidth: 560, margin: "18px 0 0" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "services.texte") ??
                  "Une ligne, un contrôleur agréé, un rapport. Ce que nous faisons est encadré par la réglementation ; ce que nous ne faisons pas l'est tout autant."}
              </p>
            </div>
          </Reveal>

          <div style={{ borderBottom: `1px solid ${C.border}` }}>
            {SERVICES.map((s: any, idx: number) => (
              <Reveal key={`${s.titre}-${idx}`} delay={Math.min(idx, 5) * 0.055} y={22}>
                <ServiceRow s={s} n={idx} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ LE DÉROULÉ — quatre étapes sur un rail de progression ═══════ */}
      <section id="methode" style={{ padding: "clamp(64px, 10vw, 130px) clamp(22px, 6vw, 68px)", background: C.bgAlt, borderTop: `1px solid ${C.border}`, position: "relative", overflow: "hidden" }}>
        <div aria-hidden className="i349-trame" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
        <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(26px, 3.4vw, 44px)", maxWidth: 720 }}>
              <Kicker>Le déroulé</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(29px, 4.2vw, 56px)", lineHeight: 1.03, letterSpacing: "-0.034em", color: C.ink, margin: "clamp(16px, 2vw, 24px) 0 0", }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                  <>
                    45 minutes,
                    <br />
                    <em style={{ fontStyle: "italic", fontWeight: 500, color: C.accent }}>rien de caché.</em>
                  </>
                )}
              </h2>
            </div>
          </Reveal>

          {/* le filet dégradé qui relie les quatre étapes */}
          <div aria-hidden style={{ height: 1, background: `linear-gradient(to right, rgba(245,165,36,0), ${C.accent} 12%, ${C.accent} 88%, rgba(245,165,36,0))`, marginBottom: "clamp(20px, 2.4vw, 30px)" }} />

          <div className="i349-etapes">
            {METHODE.map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.055} y={22}>
                <div style={{ position: "relative", height: "100%", paddingRight: 8 }}>
                  <span aria-hidden style={{ display: "block", width: 9, height: 9, borderRadius: 9, border: `2px solid ${C.accent}`, background: C.bgAlt, marginTop: -25, marginBottom: 22, }}/>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(26px, 3vw, 40px)", lineHeight: 1, letterSpacing: "-0.032em", color: C.accent, fontVariantNumeric: "tabular-nums" }}>
                    {m.n}
                  </div>
                  <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(17px, 1.8vw, 22px)", lineHeight: 1.16, letterSpacing: "-0.016em", color: C.ink, margin: "14px 0 10px", }}>
                    {m.t}
                  </h3>
                  <p style={{ fontFamily: SANS, fontSize: 14, fontWeight: 300, lineHeight: 1.8, color: C.textMuted, margin: 0, maxWidth: 460 }}>
                    {m.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="i349-plaques" style={{ marginTop: "clamp(34px, 4.4vw, 60px)" }}>
            <Reveal delay={0.05}>
              <Plaque src={photo(1, "")} alt="Ligne de contrôle vue depuis la baie vitrée" legende="La ligne, vue depuis la baie vitrée" ratio="16 / 10"/>
            </Reveal>
            <Reveal delay={0.12}>
              <div style={{ border: `1px solid ${C.border}`, background: C.bgCard, padding: "clamp(24px, 3vw, 36px)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 18, }}>
                <Gauge size={26} color={C.accent} strokeWidth={1.4} />
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(19px, 2vw, 26px)", lineHeight: 1.1, letterSpacing: "-0.022em", color: C.ink }}>
                  La contre-visite est incluse
                </div>
                <p style={{ fontFamily: SANS, fontSize: 13.8, fontWeight: 300, lineHeight: 1.8, color: C.textMuted, margin: 0 }}>
                  {/* TEXTE_SECTION */ clientText(sessionData, "methode.texte") ??
                    "Incluse pendant deux mois : revenez quand c'est réparé, on ne re-contrôle que les points défaillants. Sans rendez-vous le samedi matin."}
                </p>
                <a href={telHref} style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: SANS, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, color: C.accent, textDecoration: "none", }}>
                  Nous appeler <ArrowRight size={14} />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ ENGAGEMENTS ══════════════════════════════════════════════════ */}
      <section id="engagements" style={{ padding: "clamp(64px, 10vw, 130px) clamp(22px, 6vw, 68px)", background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <div className="i349-split">
          <Reveal>
            <Plaque src={photo(0, (clientPhotos(sessionData)[0] || "https://images.pexels.com/photos/8985518/pexels-photo-8985518.jpeg?auto=compress&cs=tinysrgb&w=1400"))} alt="Véhicule sur le pont de contrôle" legende="Véhicule sur le pont de contrôle"/>
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              <Kicker>Nos engagements</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(27px, 3.7vw, 48px)", lineHeight: 1.04, letterSpacing: "-0.032em", color: C.ink, margin: "clamp(14px, 1.8vw, 22px) 0 clamp(22px, 2.6vw, 32px)", }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>
                    Indépendants
                    <br />
                    <em style={{ fontStyle: "italic", fontWeight: 500, color: C.accent }}>par la loi, et par conviction.</em>
                  </>
                )}
              </h2>
              <div>
                {ENGAGEMENT.map((e: string, idx: number) => (
                  <div key={idx} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "15px 0", borderTop: idx === 0 ? `1px solid ${C.border}` : "none", borderBottom: `1px solid ${C.border}`, }}>
                    <Check size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 4 }} />
                    <span style={{ fontFamily: SANS, fontSize: 14.5, fontWeight: 300, lineHeight: 1.74, color: C.textMuted }}>{e}</span>
                  </div>
                ))}
              </div>
              <motion.a href={telHref} whileHover={{ y: -3 }} transition={{ duration: 0.45, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: "clamp(22px, 2.6vw, 32px)", background: C.accent, color: "#15100a", fontFamily: SANS, fontSize: 11.5, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, padding: "16px 30px", textDecoration: "none", }}>
                Nous appeler <ArrowRight size={15} />
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ TARIFS — table fine à conduite pointillée ════════════════════ */}
      <section id="tarifs" style={{ padding: "clamp(64px, 10vw, 130px) clamp(22px, 6vw, 68px)", background: C.bgAlt, borderTop: `1px solid ${C.border}`, position: "relative", overflow: "hidden" }}>
        <Ghost style={{ bottom: "-6%", right: "2%", fontSize: "clamp(120px, 18vw, 260px)", opacity: 0.04 }}>€</Ghost>
        <div style={{ maxWidth: 1040, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(24px, 3.2vw, 40px)" }}>
              <Kicker>Tarifs</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(29px, 4.2vw, 56px)", lineHeight: 1.03, letterSpacing: "-0.034em", color: C.ink, margin: "clamp(14px, 1.8vw, 22px) 0 0", }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                  <>
                    Affichés, <em style={{ fontStyle: "italic", fontWeight: 500, color: C.accent }}>identiques pour tous.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 14.5, fontWeight: 300, lineHeight: 1.8, color: C.textMuted, maxWidth: 560, margin: "16px 0 0" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.texte") ??
                  "La contre-visite est incluse pendant deux mois pour tout contrôle réalisé au centre."}
              </p>
            </div>
          </Reveal>

          <div style={{ borderTop: `1px solid ${C.border}` }}>
            {TARIFS.map((t: any, idx: number) => (
              <Reveal key={`${t.a}-${idx}`} delay={Math.min(idx, 4) * 0.055} y={18}>
                <TarifLigne t={t} n={idx} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ AVIS — colonnes décalées ═════════════════════════════════════ */}
      <section style={{ padding: "clamp(64px, 10vw, 132px) clamp(22px, 6vw, 68px)", background: C.bgDark, position: "relative", overflow: "hidden", borderTop: `1px solid ${C.border}` }}>
        <div aria-hidden className="i349-trame" style={{ position: "absolute", inset: 0, opacity: 0.32 }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(30px, 3.8vw, 52px)", maxWidth: 700 }}>
              <Kicker>Ce qu'ils en disent</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(28px, 3.9vw, 50px)", lineHeight: 1.04, letterSpacing: "-0.032em", color: C.white, margin: "clamp(14px, 1.8vw, 22px) 0 0", }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                  <>
                    Contrôlés, <em style={{ fontStyle: "italic", fontWeight: 500, color: C.accent }}>pas arnaqués</em>.
                  </>
                )}
              </h2>
            </div>
          </Reveal>

          <div className="i349-avis">
            {AVIS.map((a: any, idx: number) => (
              <Reveal key={`${a.auteur}-${idx}`} delay={idx * 0.08} y={26}>
                <div style={{ position: "relative", height: "100%", borderTop: `2px solid ${C.accent}`, background: "rgba(255,255,255,0.035)", padding: "clamp(26px, 3vw, 36px) clamp(20px, 2.4vw, 30px)", overflow: "hidden", }}>
                  <Ghost style={{ top: -14, right: 8, fontSize: "clamp(74px, 8vw, 112px)" }}>{String(idx + 1).padStart(2, "0")}</Ghost>
                  <p style={{ position: "relative", fontFamily: SANS, fontSize: "clamp(14.5px, 1.3vw, 16px)", fontWeight: 300, lineHeight: 1.82, color: "rgba(255,255,255,0.85)", margin: "0 0 22px", }}>
                    {a.texte}
                  </p>
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 15 }}>
                    <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14.5, letterSpacing: "0.01em", color: C.white }}>{a.auteur}</div>
                    <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent, marginTop: 6 }}>
                      {a.detail}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTACT ══════════════════════════════════════════════════════ */}
      <section id="contact" style={{ padding: "clamp(66px, 10vw, 134px) clamp(22px, 6vw, 68px)", background: C.accentLight, position: "relative", overflow: "hidden", borderTop: `1px solid ${C.border}` }}>
        <div aria-hidden className="i349-zebre" style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 5, opacity: 0.9 }} />
        <Ghost style={{ top: "-10%", left: "50%", transform: "translateX(-50%)", fontSize: "clamp(130px, 20vw, 300px)", opacity: 0.05 }}>45</Ghost>
        <div style={{ position: "relative", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <Kicker align="center">On vous attend</Kicker>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(30px, 4.6vw, 58px)", lineHeight: 1.03, letterSpacing: "-0.036em", color: C.ink, margin: "clamp(16px, 2vw, 24px) 0 clamp(14px, 1.8vw, 20px)", }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                <>
                  45 minutes,
                  <br />
                  <em style={{ fontStyle: "italic", fontWeight: 500, color: C.accent }}>et vous êtes fixé.</em>
                </>
              )}
            </h2>
            <p style={{ fontFamily: SANS, fontSize: "clamp(14.5px, 1.2vw, 16px)", fontWeight: 300, lineHeight: 1.8, color: C.textMuted, maxWidth: 500, margin: "0 auto clamp(28px, 3.4vw, 40px)", }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ??
                "Rendez-vous par téléphone ou en ligne, dépôt des clés possible. Salle d'attente avec café et wifi — ou regardez le contrôle derrière la baie."}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <motion.a href={telHref} whileHover={{ y: -3 }} transition={{ duration: 0.45, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.accent, color: "#15100a", fontFamily: SANS, fontSize: 13, letterSpacing: "0.07em", fontWeight: 700, padding: "18px 34px", textDecoration: "none", boxShadow: "0 20px 40px -24px rgba(245,165,36,0.95)", }}>
                <Phone size={17} /> {tel}
              </motion.a>
              <motion.a href={`mailto:${mail}`} whileHover={{ y: -3 }} transition={{ duration: 0.45, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "transparent", color: C.ink, border: `1px solid ${C.accent}`, fontFamily: SANS, fontSize: 13, letterSpacing: "0.07em", fontWeight: 700, padding: "17px 30px", textDecoration: "none", }}>
                <Mail size={17} /> Nous écrire
              </motion.a>
            </div>
          </Reveal>

          <Reveal delay={0.12} style={{ marginTop: "clamp(32px, 4vw, 52px)" }}>
            <Plaque src={photo(2, "")} alt="Salle d'attente du centre" legende="La salle d'attente, derrière la baie" ratio="21 / 9" />
          </Reveal>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════════════ */}
      <footer style={{ background: C.bgDarkAlt, padding: "clamp(44px, 6vw, 72px) clamp(22px, 6vw, 68px) clamp(22px, 3vw, 30px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="i349-pied" style={{ marginBottom: "clamp(28px, 4vw, 46px)" }}>
            <div>
              <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 20, letterSpacing: "-0.01em", color: C.accentDark, marginBottom: 12 }}>
                {marque}
              </div>
              <p style={{ fontFamily: SANS, fontSize: 13, fontWeight: 300, lineHeight: 1.8, color: C.textFaint, maxWidth: 340, margin: 0 }}>
                Centre de contrôle technique agréé · {ville}
                <br />
                Agrément préfectoral S 026 X 042 — contrôleurs agréés
              </p>
            </div>

            <div>
              <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>
                Nous joindre
              </div>
              {[
                { icon: <MapPin size={13} />, t: adresse ?? clientCodePostalVille(sessionData, "26000", "Valence") },
                { icon: <Phone size={13} />, t: tel },
                { icon: <Mail size={13} />, t: mail },
              ].map((it, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, alignItems: "center", fontFamily: SANS, fontSize: 13, fontWeight: 300, color: C.textFaint, marginBottom: 9 }}>
                  <span style={{ color: C.accent, display: "flex" }}>{it.icon}</span>
                  {it.t}
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>
                Sections
              </div>
              {NAV.map((n) => (
                <a key={n.l} href={n.h} style={{ display: "block", fontFamily: SANS, fontSize: 13, fontWeight: 300, color: C.textFaint, textDecoration: "none", marginBottom: 9 }}>
                  {n.l}
                </a>
              ))}
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 300, color: "rgba(255,255,255,0.28)" }}>
              © 2026 {marque} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
              {/* VILLE_PIED */}
              {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 300, color: "rgba(255,255,255,0.28)" }}>
              Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
