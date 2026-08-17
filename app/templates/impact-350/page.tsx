"use client";
// @ts-nocheck

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarCheck, Check, Mail, MapPin, Phone } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, HairlineArrows, LineMask, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
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

/* ════════════════════════════════════════════════════════════════════════════
   {clientName(sessionData) ?? "CT de la Lumière"} — Centre de contrôle technique agréé · Lyon

   Contrôle technique, 2e variante (la 1re est impact-349, atelier sombre).
   Celle-ci s'adresse aux familles : créneaux du soir, coin enfants, rapport
   traduit du jargon. Le ton est clair, la page respire, rien ne claque.

   Archétype H1 : split, média à droite. La colonne de gauche porte le titre
   et le compteur de diapositives, celle de droite le média — avec, posée à
   cheval sur son angle, la fiche de rendez-vous. C'est le détail gratuit du
   thème : il ne sert à rien, il rassure.

   Geste signature : LineMask (hero-kit-2). Chaque ligne du titre glisse dans
   son propre masque, la sortante reste lisible une fraction de seconde — le
   contraire d'un fondu. Appliqué ici en douceur : deux lignes seulement,
   transition 0,72 s, DWELL.slow (5,6 s) soit près de huit fois la transition.
   Un seul index pilote le titre, la légende, le compteur et les flèches.

   Fontes P8 — Newsreader (serif de lecture, italique pour les respirations)
   contre Manrope (sans humaniste, corps et étiquettes). Rôles opposés : le
   serif ne descend jamais dans un tableau, le sans ne monte jamais en titre.
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
const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,300;1,6..72,400&family=Manrope:wght@300;400;500;600;700;800&display=swap');`;

const SERIF = "'Newsreader', Georgia, 'Times New Roman', serif";
const SANS = "'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif";

/* ── Easing unique, répété littéralement en CSS ──────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Palette ─────────────────────────────────────────────────────────────── */
let C: Record<string, string> = {
  bg: "#f7f8f6",
  bgAlt: "#eef1ea",
  bgDark: "#1e2b19",
  bgDarkAlt: "#16210f",
  bgCard: "#ffffff",
  accent: "var(--brand, #4f772d)",
  accentDark: "var(--brand-light, #7fa957)",
  accentLight: "#e6eddc",
  ink: "#1b2418",
  textMuted: "#4e5a49",
  textFaint: "#818d7c",
  border: "#dde3d5",
  white: "#ffffff",
  /* clé métier : la lumière du nom, pour les glows et les accents chauds */
  lumiere: "#e3bd6a",
};

/* ════════════════════════════════════════════════════════════════════════════
   Données — SOURCE figée, réhydratée dans le rendu par resolveList
   ════════════════════════════════════════════════════════════════════════════ */

const NAV = [
  { l: "Le déroulé", h: "#methode" },
  { l: "Contrôles", h: "#services" },
  { l: "Engagements", h: "#engagements" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

const HERO = [
  { k: "Périodique", lines: ["Le contrôle expliqué", "avec des mots simples."], sub: "133 points, un rapport traduit du jargon." },
  { k: "Sans stress", lines: ["Créneaux du soir,", "espace enfants, vrai café."], sub: "Jusqu'à 19 h, samedi compris." },
  { k: "Contre-visite", lines: ["Revenez réparé,", "repartez validé."], sub: "Incluse 2 mois, dix minutes chrono." },
];

const SERVICES_SOURCE = [
  { titre: "Contrôle périodique VL", desc: "Les 133 points réglementaires au banc, rapport remis avec un lexique en français courant — « jeu dans la biellette » enfin traduit.", tag: "Voiture" },
  { titre: "Contre-visite en 10 min", desc: "Incluse deux mois. Passage prioritaire sans rendez-vous en semaine avant 10 h.", tag: "Incluse" },
  { titre: "Électriques & hybrides", desc: "Contrôleurs habilités, points haute tension au référentiel. Les Zoé, Model 3 et Kona passent ici tous les jours.", tag: "VE" },
  { titre: "Utilitaires ≤ 3,5 t", desc: "Artisans : déposez à 8 h, récupérez à 9 h, repartez travailler. Facture pro immédiate.", tag: "Pro" },
  { titre: "Motos & scooters", desc: "Ligne deux-roues dédiée, contrôleur motard — qui sait ce qu'est une transmission par cardan.", tag: "Moto" },
  { titre: "Véhicules de collection", desc: "Créneau calme du samedi matin, manipulation aux gants, passage tous les 5 ans pour les cartes grises collection.", tag: "Collection" },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE_SOURCE = [
  { n: "01", t: "Réservation en 2 minutes", d: "En ligne ou par téléphone. Rappel SMS la veille avec les documents à apporter — carte grise, c'est tout." },
  { n: "02", t: "45 minutes, en direct", d: "Suivez le contrôle depuis la baie vitrée ou l'appli : chaque étape cochée en temps réel." },
  { n: "03", t: "Le débrief traduit", d: "Le contrôleur vous montre, explique la gravité réelle, et remet le lexique. Pas de jargon, pas de terreur." },
  { n: "04", t: "Rappel avant échéance", d: "SMS deux mois avant votre prochain contrôle. Une chose de moins à retenir pendant deux ans." },
];

const ENGAGEMENT_SOURCE = [
  "Agrément préfectoral S 069 X 118, contrôleurs agréés en formation continue",
  "Indépendance légale : aucune réparation vendue, aucun garage recommandé",
  "Prix affichés, identiques pour tous, week-end sans majoration",
  "Espace enfants, café offert, wifi — parce que 45 minutes, c'est long à 4 ans",
];
let ENGAGEMENT = ENGAGEMENT_SOURCE;

const TARIFS_SOURCE = [
  { a: "Contrôle périodique VL", p: "82 €", n: "Essence, diesel, GPL — rapport avec lexique traduit." },
  { a: "Électrique / hybride", p: "86 €", n: "Points haute tension, contrôleur habilité." },
  { a: "Deux-roues", p: "62 €", n: "Ligne dédiée, contrôleur motard." },
  { a: "Collection (tous les 5 ans)", p: "95 €", n: "Créneau calme du samedi matin, manipulation soignée." },
];
let TARIFS = TARIFS_SOURCE;

const AVIS_SOURCE = [
  { texte: "Créneau à 18h30 après le travail, contrôle suivi sur l'appli, débrief clair : ma « défaillance mineure » n'était pas la fin du monde, juste une ampoule. Merci pour la pédagogie.", auteur: "Amélie R.", detail: "Contrôle du soir" },
  { texte: "Avec deux enfants en bas âge, l'espace jeux change tout. 45 minutes passées sans cris, contrôle nickel, rappel SMS reçu pour dans deux ans.", auteur: "Thomas B.", detail: "Famille, samedi matin" },
  { texte: "Ma 4L de collection contrôlée aux gants, par un contrôleur qui a pris le temps. On sent le respect de la mécanique ancienne.", auteur: "Gérard L.", detail: "Véhicule de collection" },
];
let AVIS_DEMO = AVIS_SOURCE;

const STATS_SOURCE = [
  { value: "19 h", label: "Dernier créneau du soir" },
  { value: "45 min", label: "Contrôle complet" },
  { value: "4,9/5", label: "Sur 1 200 avis vérifiés" },
  { value: "10 min", label: "La contre-visite" },
];
let STATS = STATS_SOURCE;

/**
 * Coupe un titre en deux lignes à peu près égales, pour LineMask.
 * Fonction pure, sans appel au contrat : elle peut vivre au niveau module.
 */
function enDeuxLignes(txt: string): string[] {
  const mots = String(txt ?? "").trim().split(/\s+/).filter(Boolean);
  if (mots.length < 2) return [mots.join(" ")];
  const cible = Math.ceil(txt.length / 2);
  let n = 0;
  let long = 0;
  for (let k = 0; k < mots.length - 1; k++) {
    long += mots[k].length + 1;
    n = k + 1;
    if (long >= cible) break;
  }
  return [mots.slice(0, n).join(" "), mots.slice(n).join(" ")];
}

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

function Reveal({
  children,
  delay = 0,
  y = 28,
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
    <motion.div ref={ref} style={style} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.95, ease: EASE, delay }}>
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
      <span style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.34em", textTransform: "uppercase", fontWeight: 700, color }}>
        {children}
      </span>
      {align === "center" && <span style={{ width: 40, height: 1, background: color, opacity: 0.85, flexShrink: 0 }} />}
    </div>
  );
}

/** Chiffre fantôme : la seule texture de la page, et elle ne charge rien. */
function Ghost({ children, style, sombre = false }: { children: React.ReactNode; style?: React.CSSProperties; sombre?: boolean }) {
  return (
    <span aria-hidden style={{ position: "absolute", fontFamily: SERIF, fontWeight: 600, lineHeight: 0.76, color: sombre ? C.white : C.ink, opacity: sombre ? 0.07 : 0.055, pointerEvents: "none", userSelect: "none", fontVariantNumeric: "tabular-nums", ...style, }}>
      {children}
    </span>
  );
}

/**
 * Le carnet de contrôle, dessiné au trait : quatre lignes cochées, un tampon.
 * C'est l'illustration du thème — la page se tient photos bloquées.
 */
function CarnetSVG({ size = 300, stroke = C.accent, opacity = 1 }: { size?: number; stroke?: string; opacity?: number }) {
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 300 234" fill="none" aria-hidden style={{ display: "block", opacity, overflow: "visible" }}>
      {/* le carnet */}
      <rect x="34" y="20" width="204" height="196" rx="14" stroke={stroke} strokeWidth="2" />
      <path d="M34 62 H 238" stroke={stroke} strokeWidth="1.4" opacity="0.55" />
      {/* les quatre lignes cochées */}
      {[92, 124, 156, 188].map((y, n) => (
        <g key={y} opacity={n === 3 ? 0.45 : 1}>
          <circle cx="66" cy={y} r="9" stroke={stroke} strokeWidth="1.6" />
          <path d={`M61.5 ${y} l3.4 3.6 l6.1 -7`} stroke={stroke} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d={`M90 ${y} H ${n % 2 === 0 ? 214 : 186}`} stroke={stroke} strokeWidth="1.4" opacity="0.5" strokeLinecap="round" />
        </g>
      ))}
      {/* l'onglet du haut */}
      <path d="M56 20 V 8 H 96 V 20" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" opacity="0.7" />
      {/* le tampon */}
      <circle cx="244" cy="182" r="34" stroke={stroke} strokeWidth="2" opacity="0.75" />
      <circle cx="244" cy="182" r="26" stroke={stroke} strokeWidth="1" opacity="0.4" strokeDasharray="4 5" />
      <path d="M233 182 l7 7.5 l13 -15" stroke={stroke} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Lien de navigation : soulignement en largeur qui pousse. */
function NavLink({ label, href }: { label: string; href: string }) {
  const [h, setH] = useState(false);
  return (
    <a href={href} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ position: "relative", fontFamily: SANS, fontSize: 13, letterSpacing: "0.02em", fontWeight: 600, color: h ? C.ink : C.textMuted, textDecoration: "none", padding: "13px 2px", transition: "color .5s cubic-bezier(0.16, 1, 0.3, 1)", }}>
      {label}
      <span style={{ position: "absolute", left: 0, bottom: 8, height: 2, borderRadius: 2, width: h ? "100%" : "0%", background: C.accent, transition: "width .5s cubic-bezier(0.16, 1, 0.3, 1)", }}/>
    </a>
  );
}

/** Colonne filetée de prestation : pas de carte, un filet et de l'air. */
function ServiceColonne({ s, n }: { s: { titre: string; desc: string; tag: string }; n: number }) {
  const [h, setH] = useState(false);
  return (
    <article
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ position: "relative", height: "100%", borderTop: `2px solid ${h ? C.accent : C.border}`, background: h ? C.bgCard : "transparent", borderRadius: h ? 16 : 0, padding: "clamp(22px, 2.6vw, 32px) clamp(16px, 1.8vw, 24px) clamp(24px, 2.8vw, 34px)", transform: h ? "translateY(-5px)" : "translateY(0)", boxShadow: h ? "0 24px 44px -30px rgba(27,36,24,0.42), 0 2px 6px -3px rgba(27,36,24,0.10)" : "none", transition: "all .5s cubic-bezier(0.16, 1, 0.3, 1)", overflow: "hidden", }}
    >
      <Ghost style={{ top: 6, right: 14, fontSize: "clamp(54px, 6vw, 84px)" }}>{String(n + 1).padStart(2, "0")}</Ghost>
      <span style={{ position: "relative", display: "inline-block", fontFamily: SANS, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700, color: C.accent, background: C.accentLight, borderRadius: 999, padding: "6px 13px", marginBottom: 16, }}>
        {s.tag}
      </span>
      <h3 style={{ position: "relative", fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(20px, 2.1vw, 27px)", lineHeight: 1.14, letterSpacing: "-0.012em", color: C.ink, margin: "0 0 12px", }}>
        {s.titre}
      </h3>
      <p style={{ position: "relative", fontFamily: SANS, fontSize: 14.5, fontWeight: 400, lineHeight: 1.78, color: C.textMuted, margin: 0, maxWidth: 460 }}>
        {s.desc}
      </p>
    </article>
  );
}

/** Bande de tarif : arrondie, douce, un point d'accent à gauche. */
function TarifBande({ t, n }: { t: { a: string; p: string; n: string }; n: number }) {
  const [h, setH] = useState(false);
  return (
    <div className="i350-tband" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ background: h ? C.bgCard : "transparent", border: `1px solid ${h ? C.accent : C.border}`, borderRadius: 18, marginBottom: 12, transform: h ? "translateY(-3px)" : "translateY(0)", boxShadow: h ? "0 22px 42px -28px rgba(27,36,24,0.40), 0 2px 6px -3px rgba(27,36,24,0.10)" : "none", transition: "all .5s cubic-bezier(0.16, 1, 0.3, 1)", }}>
      <span aria-hidden style={{ width: 10, height: 10, borderRadius: 10, background: h ? C.accent : C.border, marginTop: 9, transition: "background .5s cubic-bezier(0.16, 1, 0.3, 1)", }}/>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(18px, 1.9vw, 24px)", lineHeight: 1.2, letterSpacing: "-0.01em", color: C.ink }}>
          {t.a}
        </div>
        <p style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 400, lineHeight: 1.75, color: C.textMuted, margin: "7px 0 0", maxWidth: 520 }}>{t.n}</p>
      </div>
      <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "clamp(21px, 2.3vw, 30px)", letterSpacing: "-0.02em", color: C.accent, whiteSpace: "nowrap", textAlign: "right", fontVariantNumeric: "tabular-nums", }}>
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
 * Cadre à repli dessiné : sans image, il reste un aplat clair, une trame de
 * points et le carnet au trait. La section est belle photos bloquées.
 */
function Vignette({
  src,
  alt,
  legende,
  ratio = "4 / 3",
  arrondi = 22,
}: {
  src: string;
  alt: string;
  legende?: string;
  ratio?: string;
  arrondi?: number;
}) {
  const [h, setH] = useState(false);
  return (
    <figure onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ margin: 0, borderRadius: arrondi, overflow: "hidden", border: `1px solid ${h ? C.accent : C.border}`, background: C.bgCard, transform: h ? "translateY(-4px)" : "none", boxShadow: h ? "0 30px 56px -34px rgba(27,36,24,0.45), 0 3px 8px -4px rgba(27,36,24,0.12)" : "0 2px 6px -4px rgba(27,36,24,0.14)", transition: "all .5s cubic-bezier(0.16, 1, 0.3, 1)", }}>
      <div style={{ position: "relative", aspectRatio: ratio, overflow: "hidden", background: `linear-gradient(158deg, ${C.accentLight} 0%, ${C.bgAlt} 60%, ${C.bg} 100%)`, }}>
        <div aria-hidden className="i350-pois" style={{ position: "absolute", inset: 0, opacity: 0.7 }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <CarnetSVG size={210} stroke={C.accent} opacity={0.22} />
        </div>
        {src ? (
          <img src={src} alt={alt} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", transform: h ? "scale(1.04)" : "scale(1)", transition: "transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)", }}/>
        ) : null}
      </div>
      {legende ? (
        <figcaption style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600, color: C.textFaint, background: C.bgCard, padding: "14px 18px", borderTop: `1px solid ${C.border}`, }}>
          {legende}
        </figcaption>
      ) : null}
    </figure>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════════════════ */
export default function CTLumierePage() {
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

  /* Affectations AVANT tout appel de helper : fd/c/bp/sessionData d'abord. */
  fd = session?.formData;
  c = session?.generatedContent;
  bp = session?.businessProfile;
  sessionData = session;
  brand = fd?.brandColor ?? null;

  const CLIENT_SERVICES = clientServices(sessionData);

  SERVICES_DEMO = resolveList(
    CLIENT_SERVICES?.map((s: any, i: number) => ({
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
    CLIENT_SERVICES?.map((s: any, i: number) => ({
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
  const METHODE = resolveList(fusionnerEtapes(METHODE_SOURCE, clientMethode(sessionData)), METHODE_SOURCE);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /*
    Le titre du client prend la première diapositive ; les suivantes viennent
    de SES prestations, pas du thème — laisser « Créneaux du soir, espace
    enfants » sur le site d'un centre qui ferme à 18 h, c'est laisser la
    démonstration parler à sa place. Sans rien de généré, on retombe sur les
    trois diapositives du thème, mot pour mot.
  */
  const l0 = clientHeroLine(sessionData, 0, 2, 22);
  const l1 = clientHeroLine(sessionData, 1, 2, 22);
  const HERO_SLIDES = l0
    ? [
        {
          k: (CLIENT_SERVICES?.[0]?.title as string) ?? HERO[0].k,
          lines: [l0, l1].filter(Boolean),
          sub: clientHeroPrestations(sessionData) ?? HERO[0].sub,
        },
        ...(CLIENT_SERVICES ?? []).slice(1, 3).map((sv: any) => ({
          k: HERO[0].k,
          lines: enDeuxLignes((sv.title as string) ?? ""),
          sub: ((sv.description as string) ?? (sv.desc as string) ?? "").slice(0, 90),
        })),
      ]
    : HERO;

  /*
    L'index unique du héros. DWELL.slow (5,6 s) pour une transition de 0,72 s :
    le ton famille demande qu'on ait le temps de lire avant que ça bouge.
  */
  const { i, next, prev } = useSlides(HERO_SLIDES.length, DWELL.slow);
  const S = HERO_SLIDES[i] ?? HERO_SLIDES[0];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const marque = fd?.businessName ?? clientName(sessionData) ?? "CT de la Lumière";
  const ville = clientCity(sessionData) ?? "Lyon";
  const metier = clientTrade(sessionData) ?? "Contrôle technique";
  const tel = clientPhone(sessionData) ?? "04 72 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? "+33472000000").replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? "bonjour@ct-lumiere.fr";
  const adresse = clientAddress(sessionData);

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip" }}>
      <style>{`${FONTS_CSS}

        /* ── texture douce : une trame de points, jamais une image ───────── */
        .i350-pois {
          background-image: radial-gradient(circle at 1px 1px, rgba(27,36,24,0.10) 1px, rgba(27,36,24,0) 1.6px);
          background-size: 17px 17px;
          pointer-events: none;
        }
        .i350-pois-clair {
          background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.10) 1px, rgba(255,255,255,0) 1.6px);
          background-size: 17px 17px;
          pointer-events: none;
        }

        /* ── grilles pilotées ici, jamais en style inline ────────────────── */
        .i350-hero {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.04fr) minmax(0, 0.96fr);
          gap: clamp(30px, 4.6vw, 68px);
          align-items: center;
          min-height: 100dvh;
          max-width: 1240px;
          margin: 0 auto;
          padding: clamp(124px, 15vh, 172px) clamp(22px, 5.5vw, 64px) clamp(56px, 7vw, 96px);
        }

        .i350-etape {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: clamp(20px, 3.4vw, 58px);
          align-items: center;
          padding: clamp(24px, 3vw, 40px) 0;
        }
        .i350-etape-inv > :first-child { order: 2; }
        .i350-etape-inv > :last-child { order: 1; }

        .i350-services {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
          gap: clamp(14px, 2vw, 26px);
        }

        .i350-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          max-width: 1180px;
          margin: 0 auto;
        }

        .i350-split {
          display: grid;
          grid-template-columns: minmax(0, 1.02fr) minmax(0, 0.98fr);
          gap: clamp(30px, 5vw, 76px);
          align-items: center;
          max-width: 1160px;
          margin: 0 auto;
        }

        .i350-tband {
          display: grid;
          grid-template-columns: minmax(0, 22px) minmax(0, 1fr) minmax(0, 160px);
          gap: clamp(12px, 2vw, 24px);
          align-items: start;
          padding: clamp(20px, 2.4vw, 28px) clamp(18px, 2.2vw, 28px);
        }

        .i350-contact {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
          gap: clamp(28px, 4.6vw, 64px);
          align-items: center;
          max-width: 1140px;
          margin: 0 auto;
        }

        .i350-pied {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr);
          gap: clamp(24px, 4vw, 56px);
        }

        /* ── points de rupture ───────────────────────────────────────────── */
        @media (max-width: 1000px) {
          #i350-nav { display: none !important; }
          .i350-burger { display: flex !important; }
          .i350-hero { grid-template-columns: 1fr; }
          .i350-split { grid-template-columns: 1fr; }
          .i350-contact { grid-template-columns: 1fr; }
          .i350-pied { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 860px) {
          .i350-etape { grid-template-columns: 1fr; }
          /* les rangées alternées reprennent l'ordre du document */
          .i350-etape-inv > :first-child,
          .i350-etape-inv > :last-child { order: initial; }
          .i350-stats { grid-template-columns: 1fr 1fr; }
          .i350-tband {
            grid-template-columns: minmax(0, 18px) minmax(0, 1fr);
            row-gap: 10px;
          }
          .i350-tband > :last-child { grid-column: 2 / -1; text-align: left; }
          .i350-fiche { position: static !important; margin-top: 14px; }
          .i350-pied { grid-template-columns: 1fr; }
        }

        @media (prefers-reduced-motion: reduce) {
          .i350-tband { transition: none !important; }
        }
      `}</style>

      {/* ══ NAV ══════════════════════════════════════════════════════════ */}
      <nav
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: scrolled ? "10px clamp(18px, 5vw, 56px)" : "22px clamp(18px, 5vw, 56px)", background: scrolled ? "rgba(247,248,246,0.94)" : "transparent", backdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none", WebkitBackdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "padding .55s cubic-bezier(0.16, 1, 0.3, 1), background .55s cubic-bezier(0.16, 1, 0.3, 1), border-color .55s cubic-bezier(0.16, 1, 0.3, 1), backdrop-filter .55s cubic-bezier(0.16, 1, 0.3, 1)", }}
      >
        <a href="#haut" style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0, textDecoration: "none" }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={marque} style={{ height: 32, maxWidth: 168, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <CalendarCheck size={19} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 21, letterSpacing: "-0.012em", color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", }}>
                {marque}
              </span>
              <span style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.26em", textTransform: "uppercase", fontWeight: 700, color: C.textFaint, marginLeft: 4, whiteSpace: "nowrap", }}>
                {metier}
              </span>
            </>
          )}
        </a>

        <div id="i350-nav" style={{ display: "flex", gap: "clamp(14px, 1.8vw, 28px)", alignItems: "center" }}>
          {NAV.map((n) => (
            <NavLink key={n.l} label={n.l} href={n.h} />
          ))}
          <motion.a href={telHref} whileHover={{ y: -2 }} transition={{ duration: 0.45, ease: EASE }} style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, background: C.accent, color: C.white, borderRadius: 999, padding: "13px 26px", textDecoration: "none", whiteSpace: "nowrap", boxShadow: "0 14px 30px -18px rgba(79,119,45,0.9)", }}>
            Réserver
          </motion.a>
        </div>

        <button className="i350-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44, }}>
          <span style={{ display: "block", width: 24, height: 1.6, borderRadius: 2, background: C.ink, transition: "transform .35s cubic-bezier(0.16, 1, 0.3, 1)", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.6, borderRadius: 2, background: C.ink, transition: "opacity .3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.6, borderRadius: 2, background: C.ink, transition: "transform .35s cubic-bezier(0.16, 1, 0.3, 1)", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>

      {mobileOpen && (
        <div style={{ position: "fixed", top: 60, left: 0, right: 0, zIndex: 99, background: C.bgCard, borderBottom: `1px solid ${C.border}`, padding: "18px clamp(20px, 6vw, 32px) 26px", display: "flex", flexDirection: "column", gap: 2, }}>
          {NAV.map((n) => (
            <a key={n.l} href={n.h} onClick={() => setMobileOpen(false)} style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600, color: C.ink, textDecoration: "none", padding: "13px 0", borderBottom: `1px solid ${C.border}`, }}>
              {n.l}
            </a>
          ))}
          <a href={telHref} style={{ marginTop: 14, background: C.accent, color: C.white, textAlign: "center", padding: "15px 22px", borderRadius: 999, fontFamily: SANS, fontSize: 14, fontWeight: 700, textDecoration: "none", }}>
            Réserver
          </a>
        </div>
      )}

      {/* ══ HERO — H1 : split, média à droite ═══════════════════════════ */}
      <section id="haut" className="i350-hero">
        <div aria-hidden className="i350-pois" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />
        <div aria-hidden style={{ position: "absolute", top: "-10%", left: "-12%", width: "min(760px, 92vw)", height: "min(760px, 92vw)", background: "radial-gradient(circle, rgba(227,189,106,0.12) 0%, rgba(227,189,106,0) 64%)", pointerEvents: "none", }}/>
        <Ghost style={{ bottom: "4%", left: "-1%", fontSize: "clamp(110px, 17vw, 250px)", opacity: 0.05 }}>133</Ghost>

        {/* Colonne du titre */}
        <div style={{ position: "relative", zIndex: 2, minWidth: 0 }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}>
            <Kicker>{clientEyebrow(sessionData) ?? `Contrôle technique · ${ville}`}</Kicker>
          </motion.div>

          {/* ── GESTE SIGNATURE : LineMask, deux lignes en douceur ─────── */}
          <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.95, ease: EASE, delay: 0.16 }} style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(34px, 5.4vw, 72px)", lineHeight: 1.04, letterSpacing: "-0.024em", color: C.ink, margin: "clamp(20px, 2.6vw, 32px) 0 0", }}>
            <LineMask lines={S.lines} index={i} className="" lineClassName="" />
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease: EASE, delay: 0.3 }} style={{ fontFamily: SANS, fontSize: "clamp(15px, 1.25vw, 17px)", fontWeight: 400, lineHeight: 1.82, color: C.textMuted, maxWidth: 500, margin: "clamp(20px, 2.4vw, 28px) 0 clamp(26px, 3vw, 34px)", }}>
            {clientAccrocheRestante(sessionData, 2, 22) ??
              c?.heroSubline ??
              "Le contrôle technique sans la boule au ventre : créneaux du soir, résultat expliqué avec des mots simples, espace enfants, café correct. Et un rapport qu'on comprend enfin."}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.42 }} style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <motion.a href={telHref} whileHover={{ y: -3 }} transition={{ duration: 0.45, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.accent, color: C.white, borderRadius: 999, fontFamily: SANS, fontSize: 14, fontWeight: 700, padding: "17px 32px", textDecoration: "none", boxShadow: "0 20px 40px -22px rgba(79,119,45,0.95)", }}>
              Réserver mon créneau <ArrowRight size={16} />
            </motion.a>
            <motion.a href="#methode" whileHover={{ y: -3 }} transition={{ duration: 0.45, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "transparent", color: C.ink, border: `1px solid ${C.border}`, borderRadius: 999, fontFamily: SANS, fontSize: 14, fontWeight: 600, padding: "16px 28px", textDecoration: "none", }}>
              Comment ça se passe
            </motion.a>
          </motion.div>

          {/* Le compteur : même index que le titre, jamais un second état. */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.54 }} style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", marginTop: "clamp(30px, 3.6vw, 46px)", paddingTop: "clamp(18px, 2.2vw, 26px)", borderTop: `1px solid ${C.border}`, }}>
            <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, letterSpacing: "0.06em" }}>
              <SlideIndex i={i} total={HERO_SLIDES.length} variant="fraction" color={C.accent} className="" />
            </span>
            <span style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 400, color: C.textMuted, minWidth: 0 }}>
              <strong style={{ fontWeight: 700, color: C.ink }}>{S.k}</strong> — {S.sub}
            </span>
            <HairlineArrows onPrev={prev} onNext={next} color={C.ink} className="" />
          </motion.div>
        </div>

        {/* Colonne média — et la fiche de rendez-vous à cheval sur son angle. */}
        <motion.div initial={{ opacity: 0, x: reduce ? 0 : 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.05, ease: EASE, delay: 0.26 }} style={{ position: "relative", zIndex: 2, minWidth: 0 }}>
          <Vignette src={photo(0, (clientPhotos(sessionData)[0] || "https://images.pexels.com/photos/8985613/pexels-photo-8985613.jpeg?auto=compress&cs=tinysrgb&w=1400"))} alt="Inspection sous le véhicule" ratio="4 / 5" arrondi={26}/>
          {/* Le détail gratuit : une fiche qui ne clique pas, et qui rassure. */}
          <div className="i350-fiche" style={{ position: "absolute", left: "clamp(-26px, -2vw, -8px)", bottom: "clamp(18px, 3vw, 40px)", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 18, padding: "16px 20px", boxShadow: "0 26px 48px -30px rgba(27,36,24,0.42), 0 3px 8px -4px rgba(27,36,24,0.12)", maxWidth: 250, }}>
            <div style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.24em", textTransform: "uppercase", fontWeight: 700, color: C.accent, marginBottom: 8 }}>
              Prochain créneau
            </div>
            <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 21, lineHeight: 1.2, color: C.ink }}>Samedi, 9 h 30</div>
            <div style={{ fontFamily: SANS, fontSize: 12.5, fontWeight: 400, color: C.textMuted, marginTop: 6, lineHeight: 1.6 }}>
              Carte grise, et c'est tout.
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══ RESPIRATION ══════════════════════════════════════════════════ */}
      <section style={{ padding: "clamp(58px, 9vw, 116px) clamp(22px, 6vw, 68px)", background: C.bgAlt, borderTop: `1px solid ${C.border}`, textAlign: "center", }}>
        <Reveal>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(22px, 3vw, 38px)", lineHeight: 1.42, letterSpacing: "-0.014em", color: C.ink, maxWidth: 820, margin: "0 auto", }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (
              <>
                Quarante-cinq minutes, <span style={{ color: C.accent }}>et deux ans de tranquillité.</span>
              </>
            )}
          </p>
        </Reveal>
      </section>

      {/* ══ LE DÉROULÉ — quatre étapes, rangées alternées ═══════════════ */}
      <section id="methode" style={{ padding: "clamp(60px, 9vw, 124px) clamp(22px, 6vw, 68px)", background: C.bg }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(24px, 3vw, 40px)", maxWidth: 680 }}>
              <Kicker>Le déroulé</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(30px, 4.2vw, 56px)", lineHeight: 1.06, letterSpacing: "-0.024em", color: C.ink, margin: "clamp(16px, 2vw, 24px) 0 0", }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                  <>
                    Venez à l'heure,
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accent }}>repartez informé.</em>
                  </>
                )}
              </h2>
            </div>
          </Reveal>

          <div>
            {METHODE.map((m, idx) => (
              <Reveal key={m.n} delay={Math.min(idx, 4) * 0.055} y={22}>
                <div className={idx % 2 === 1 ? "i350-etape i350-etape-inv" : "i350-etape"} style={{ borderTop: `1px solid ${C.border}` }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                      <span aria-hidden style={{ display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: 44, background: C.accentLight, color: C.accent, fontFamily: SANS, fontSize: 14, fontWeight: 800, flexShrink: 0, fontVariantNumeric: "tabular-nums", }}>
                        {m.n}
                      </span>
                      <span aria-hidden style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${C.accent}, rgba(79,119,45,0))` }} />
                    </div>
                    <h3 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(21px, 2.3vw, 30px)", lineHeight: 1.14, letterSpacing: "-0.014em", color: C.ink, margin: 0, }}>
                      {m.t}
                    </h3>
                  </div>
                  <p style={{ fontFamily: SANS, fontSize: 15, fontWeight: 400, lineHeight: 1.82, color: C.textMuted, margin: 0, maxWidth: 520 }}>
                    {m.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTRÔLES — colonnes filetées ═══════════════════════════════ */}
      <section id="services" style={{ padding: "clamp(62px, 9.5vw, 128px) clamp(22px, 6vw, 68px)", background: C.bgAlt, borderTop: `1px solid ${C.border}`, position: "relative", overflow: "hidden" }}>
        <Ghost style={{ top: "2%", right: "1%", fontSize: "clamp(100px, 15vw, 220px)", opacity: 0.045 }}>S 069</Ghost>
        <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(26px, 3.4vw, 46px)", maxWidth: 740 }}>
              <Kicker>Contrôles</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(30px, 4.4vw, 58px)", lineHeight: 1.06, letterSpacing: "-0.024em", color: C.ink, margin: "clamp(16px, 2vw, 24px) 0 0", }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                  <>
                    Tous les véhicules,
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accent }}>tous les cas de la vie.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 15, fontWeight: 400, lineHeight: 1.82, color: C.textMuted, maxWidth: 560, margin: "18px 0 0" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "services.texte") ??
                  "Une ligne adaptée, un contrôleur qui prend le temps d'expliquer, et un rapport que l'on peut relire à la maison sans dictionnaire."}
              </p>
            </div>
          </Reveal>

          <div className="i350-services">
            {SERVICES.map((s: any, idx: number) => (
              <Reveal key={`${s.titre}-${idx}`} delay={Math.min(idx, 5) * 0.055} y={22} style={{ height: "100%" }}>
                <ServiceColonne s={s} n={idx} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CHIFFRES ═════════════════════════════════════════════════════ */}
      <section style={{ background: C.bgDark, position: "relative", overflow: "hidden" }}>
        <div aria-hidden className="i350-pois-clair" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />
        <div className="i350-stats" style={{ position: "relative", padding: "0 clamp(16px, 4vw, 40px)" }}>
          {STATS.map((s: any, idx: number) => (
            <Reveal key={`${s.label}-${idx}`} delay={idx * 0.055} y={18}>
              <div style={{ position: "relative", overflow: "hidden", padding: "clamp(30px, 4vw, 50px) clamp(10px, 1.6vw, 20px)", borderRight: idx < STATS.length - 1 ? "1px solid rgba(255,255,255,0.10)" : "none", textAlign: "center", }}>
                <Ghost sombre style={{ top: "10%", left: "50%", transform: "translateX(-50%)", fontSize: "clamp(60px, 8vw, 104px)" }}>
                  {String(idx + 1).padStart(2, "0")}
                </Ghost>
                <div style={{ position: "relative", fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(28px, 3.4vw, 44px)", lineHeight: 1, letterSpacing: "-0.024em", color: C.accentDark, fontVariantNumeric: "tabular-nums", }}>
                  {s.value}
                </div>
                <div style={{ position: "relative", fontFamily: SANS, fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, color: "rgba(255,255,255,0.55)", marginTop: 11, lineHeight: 1.6, }}>
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ ENGAGEMENTS ══════════════════════════════════════════════════ */}
      <section id="engagements" style={{ padding: "clamp(62px, 9.5vw, 128px) clamp(22px, 6vw, 68px)", background: C.bg }}>
        <div className="i350-split">
          <Reveal delay={0.08}>
            <div>
              <Kicker>Nos engagements</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(28px, 3.8vw, 50px)", lineHeight: 1.06, letterSpacing: "-0.024em", color: C.ink, margin: "clamp(14px, 1.8vw, 22px) 0 clamp(22px, 2.6vw, 32px)", }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>
                    Un centre agréé,
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accent }}>et accueillant.</em>
                  </>
                )}
              </h2>
              <div>
                {ENGAGEMENT.map((e: string, idx: number) => (
                  <div key={idx} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "15px 0", borderBottom: `1px solid ${C.border}` }}>
                    <span aria-hidden style={{ display: "grid", placeItems: "center", width: 24, height: 24, borderRadius: 24, background: C.accentLight, flexShrink: 0, marginTop: 2, }}>
                      <Check size={13} color={C.accent} strokeWidth={2.6} />
                    </span>
                    <span style={{ fontFamily: SANS, fontSize: 15, fontWeight: 400, lineHeight: 1.78, color: C.textMuted }}>{e}</span>
                  </div>
                ))}
              </div>
              <motion.a href={telHref} whileHover={{ y: -3 }} transition={{ duration: 0.45, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: "clamp(22px, 2.6vw, 32px)", background: C.accent, color: C.white, borderRadius: 999, fontFamily: SANS, fontSize: 14, fontWeight: 700, padding: "16px 30px", textDecoration: "none", }}>
                Nous appeler <ArrowRight size={16} />
              </motion.a>
            </div>
          </Reveal>
          <Reveal>
            <Vignette src={photo(1, "")} alt="Espace d'attente et coin enfants" legende="L'espace d'attente et le coin enfants" ratio="4 / 3" />
          </Reveal>
        </div>
      </section>

      {/* ══ TARIFS — bandes douces ═══════════════════════════════════════ */}
      <section id="tarifs" style={{ padding: "clamp(62px, 9.5vw, 128px) clamp(22px, 6vw, 68px)", background: C.bgAlt, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1020, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(24px, 3.2vw, 40px)", textAlign: "center" }}>
              <Kicker align="center">Tarifs</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(30px, 4.2vw, 54px)", lineHeight: 1.06, letterSpacing: "-0.024em", color: C.ink, margin: "clamp(14px, 1.8vw, 22px) 0 0", }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                  <>
                    Clairs, <em style={{ fontStyle: "italic", color: C.accent }}>week-end compris.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 15, fontWeight: 400, lineHeight: 1.82, color: C.textMuted, maxWidth: 560, margin: "16px auto 0" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.texte") ??
                  "Pas de majoration le samedi. Contre-visite incluse deux mois, passage prioritaire avant 10 h en semaine."}
              </p>
            </div>
          </Reveal>

          <div>
            {TARIFS.map((t: any, idx: number) => (
              <Reveal key={`${t.a}-${idx}`} delay={Math.min(idx, 4) * 0.055} y={18}>
                <TarifBande t={t} n={idx} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ AVIS — colonnes en escalier, guillemet serif ═════════════════ */}
      <section style={{ padding: "clamp(62px, 9.5vw, 128px) clamp(22px, 6vw, 68px)", background: C.bg, position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(28px, 3.6vw, 50px)", maxWidth: 700 }}>
              <Kicker>Ce qu'ils en disent</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(28px, 3.9vw, 50px)", lineHeight: 1.06, letterSpacing: "-0.024em", color: C.ink, margin: "clamp(14px, 1.8vw, 22px) 0 0", }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                  <>
                    Le contrôle <em style={{ fontStyle: "italic", color: C.accent }}>sans l'angoisse</em>.
                  </>
                )}
              </h2>
            </div>
          </Reveal>

          <div className="i350-services">
            {AVIS.map((a: any, idx: number) => (
              <Reveal key={`${a.auteur}-${idx}`} delay={idx * 0.08} y={26} style={{ height: "100%" }}>
                <div style={{ position: "relative", height: "100%", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 22, padding: "clamp(26px, 3vw, 36px) clamp(22px, 2.6vw, 32px)", overflow: "hidden", boxShadow: "0 2px 6px -4px rgba(27,36,24,0.14)", }}>
                  <span aria-hidden style={{ position: "absolute", top: -18, right: 14, fontFamily: SERIF, fontSize: 120, lineHeight: 1, color: C.accent, opacity: 0.09, pointerEvents: "none", }}>
                    “
                  </span>
                  <p style={{ position: "relative", fontFamily: SANS, fontSize: "clamp(14.5px, 1.3vw, 16px)", fontWeight: 400, lineHeight: 1.85, color: C.textMuted, margin: "0 0 22px", }}>
                    {a.texte}
                  </p>
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 15 }}>
                    <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 16, color: C.ink }}>{a.auteur}</div>
                    <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, color: C.accent, marginTop: 6 }}>
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
      <section id="contact" style={{ padding: "clamp(64px, 10vw, 132px) clamp(22px, 6vw, 68px)", background: C.accentLight, position: "relative", overflow: "hidden" }}>
        <div aria-hidden className="i350-pois" style={{ position: "absolute", inset: 0, opacity: 0.45 }} />
        <div className="i350-contact" style={{ position: "relative" }}>
          <Reveal>
            <div>
              <Kicker>À bientôt</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(30px, 4.4vw, 56px)", lineHeight: 1.06, letterSpacing: "-0.026em", color: C.ink, margin: "clamp(16px, 2vw, 24px) 0 clamp(14px, 1.8vw, 20px)", }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                  <>
                    Deux ans de tranquillité
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accent }}>commencent ici.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: "clamp(15px, 1.2vw, 16.5px)", fontWeight: 400, lineHeight: 1.82, color: C.textMuted, maxWidth: 480, margin: "0 0 clamp(26px, 3.2vw, 36px)" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ??
                  "Réservation en ligne ou par téléphone, créneaux jusqu'à 19 h et le samedi. Carte grise, et c'est tout."}
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <motion.a href={telHref} whileHover={{ y: -3 }} transition={{ duration: 0.45, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.accent, color: C.white, borderRadius: 999, fontFamily: SANS, fontSize: 15, fontWeight: 700, padding: "18px 34px", textDecoration: "none", boxShadow: "0 22px 42px -24px rgba(79,119,45,0.95)", }}>
                  <Phone size={17} /> {tel}
                </motion.a>
                <motion.a href={`mailto:${mail}`} whileHover={{ y: -3 }} transition={{ duration: 0.45, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "transparent", color: C.ink, border: `1px solid ${C.accent}`, borderRadius: 999, fontFamily: SANS, fontSize: 15, fontWeight: 700, padding: "17px 30px", textDecoration: "none", }}>
                  <Mail size={17} /> Nous écrire
                </motion.a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <Vignette src={photo(2, "")} alt="Façade et accueil du centre" legende="L'accueil, derrière la baie" ratio="5 / 4" />
          </Reveal>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════════════ */}
      <footer style={{ background: C.bgDarkAlt, padding: "clamp(44px, 6vw, 72px) clamp(22px, 6vw, 68px) clamp(22px, 3vw, 30px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="i350-pied" style={{ marginBottom: "clamp(28px, 4vw, 46px)" }}>
            <div>
              <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 22, letterSpacing: "-0.012em", color: C.accentDark, marginBottom: 12 }}>
                {marque}
              </div>
              <p style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 400, lineHeight: 1.8, color: "rgba(255,255,255,0.45)", maxWidth: 340, margin: 0 }}>
                Centre de contrôle technique agréé · {ville}
                <br />
                Agrément préfectoral S 069 X 118
              </p>
            </div>

            <div>
              <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.26em", textTransform: "uppercase", fontWeight: 700, color: "rgba(255,255,255,0.32)", marginBottom: 14 }}>
                Nous joindre
              </div>
              {[
                { icon: <MapPin size={13} />, t: adresse ?? clientCodePostalVille(sessionData, "69003", "Lyon") },
                { icon: <Phone size={13} />, t: tel },
                { icon: <Mail size={13} />, t: mail },
              ].map((it, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, alignItems: "center", fontFamily: SANS, fontSize: 13.5, fontWeight: 400, color: "rgba(255,255,255,0.45)", marginBottom: 9 }}>
                  <span style={{ color: C.accentDark, display: "flex" }}>{it.icon}</span>
                  {it.t}
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.26em", textTransform: "uppercase", fontWeight: 700, color: "rgba(255,255,255,0.32)", marginBottom: 14 }}>
                Sections
              </div>
              {NAV.map((n) => (
                <a key={n.l} href={n.h} style={{ display: "block", fontFamily: SANS, fontSize: 13.5, fontWeight: 400, color: "rgba(255,255,255,0.45)", textDecoration: "none", marginBottom: 9 }}>
                  {n.l}
                </a>
              ))}
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 400, color: "rgba(255,255,255,0.3)" }}>
              © 2026 {marque} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
              {/* VILLE_PIED */}
              {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 400, color: "rgba(255,255,255,0.3)" }}>
              Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
