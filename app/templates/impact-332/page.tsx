"use client";
// @ts-nocheck

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Lock, Mail, MapPin, Phone, Shield } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { GhostSolid } from "@/lib/templates/hero-kit-2";
import { ActionMobile } from "@/lib/templates/ActionMobile";
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
   {clientName(sessionData) ?? "Faubourg Serrures"} — Serrurerie de sécurité · Marseille

   Serrurier, 2e variante (la 1re est impact-192, urgence). Celle-ci vend la
   serrurerie posée à froid : blindage, A2P, coffres.

   Archétype H6 : typographique, sans photographie au héros. La texture est
   entièrement CSS/SVG — une trame de goupilles de cylindre, un filet dégradé,
   un glow radial faible. Rien à charger, rien à bloquer.

   Geste signature : GhostSolid (hero-kit-2). Le lockup contour/plein : la
   première ligne au trait — la porte telle qu'elle est —, la seconde pleine
   dans l'accent — la porte une fois blindée. Un seul objet typographique
   raconte l'avant et l'après.

   Fontes P6 — Archivo (voix d'impact, sans serif large et lourde) contre Inter
   (corps, tableaux, mentions). Deux sans aux rôles franchement opposés.
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
const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');`;

const DISPLAY = "'Archivo', 'Arial Narrow', system-ui, sans-serif";
const SANS = "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";

/* ── Easing unique, répété littéralement en CSS ──────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Palette ─────────────────────────────────────────────────────────────── */
let C: Record<string, string> = { bg: "#0d1013", bgAlt: "#12161b", bgDark: "#080a0d", bgDarkAlt: "#05070a", bgCard: "#151a21", accent: "var(--brand, #4e9fd4)", accentDark: "var(--brand-light, #8cc3e8)", accentLight: "#101a23", ink: "#eef1f4", textMuted: "#98a3af", textFaint: "#5f6b78", border: "rgba(255,255,255,0.09)", white: "#ffffff", /* le texte posé SUR l'accent : jamais du blanc, il n'y passerait pas */ onAccent: "#08131c", /* clé métier : l'acier brossé du blindage */
  acier: "#c3ccd6",
};

/* ════════════════════════════════════════════════════════════════════════════
   Données — SOURCE figée, LIVE ré-appelée dans le rendu
   ════════════════════════════════════════════════════════════════════════════ */

const NAV = [ { l: "Installations", h: "#services" }, { l: "Après effraction", h: "#urgence" }, { l: "La méthode", h: "#methode" }, { l: "Tarifs", h: "#tarifs" }, { l: "Contact", h: "#contact" }, ];

const SERVICES_SOURCE = [ { titre: "Porte blindée certifiée", desc: "Blocs-portes certifiés BP1 à BP3, posés sans casser votre encadrement. Isolation phonique et thermique comprises dans le bloc.", tag: "Blindage", }, { titre: "Serrure A2P 1 à 3 étoiles", desc: "Multipoints certifiées A2P — le référentiel que votre assureur reconnaît. Pose en remplacement sans abîmer la porte.", tag: "A2P", }, { titre: "Blindage de porte existante", desc: "Votre porte conservée, habillée d'acier et équipée d'une multipoints. L'alternative économique au bloc-porte complet.", tag: "Blindage", }, { titre: "Coffres-forts", desc: "Coffres à emmurer ou à poser, certifiés EN 1143-1. Conseil sur la classe selon la valeur à protéger, pose discrète.", tag: "Coffres", }, { titre: "Contrôle d'accès", desc: "Cylindres sur organigramme, clés protégées à carte de propriété, béquilles à code pour locaux professionnels.", tag: "Accès", }, { titre: "Après effraction", desc: "Remise en sécurité propre après un cambriolage : constat photo pour l'assurance, remplacement à niveau certifié, pas de bricolage.", tag: "Assurance", }, ];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE_SOURCE = [ { n: "01", t: "Étude sur place gratuite", d: "État de la porte, de l'encadrement, des accès secondaires. On chiffre ce qui est utile, pas ce qui se vend.", }, { n: "02", t: "Devis ferme sous 48 h", d: "Matériel certifié détaillé référence par référence. Le devis signé est le prix payé, déplacement compris.", }, { n: "03", t: "Pose par serruriers salariés", d: "Jamais sous-traitée. Une porte blindée se pose en une demi-journée, chantier propre, gravats évacués.", }, { n: "04", t: "Certificats remis", d: "Certificats A2P et factures conformes pour votre assureur — ils conditionnent souvent votre indemnisation.", }, ];

const ENGAGEMENT_SOURCE = [ "Installateurs agréés A2P — matériel certifié CNPP uniquement", "Devis écrit et gratuit avant toute intervention, conformément à l'arrêté du 24 janvier 2017", "Assurance décennale sur les poses, RC professionnelle à jour", "Aucun démarchage, aucune urgence inventée : nos prix ne doublent pas la nuit", ];
let ENGAGEMENT = ENGAGEMENT_SOURCE;

const TARIFS_SOURCE = [ { a: "Serrure multipoints A2P*", p: "dès 690 € posée", n: "Trois points certifiés, cylindre débrayable, clés protégées.", }, { a: "Blindage de porte existante", p: "dès 1 490 €", n: "Tôle acier, cornières anti-pinces, multipoints A2P incluse.", }, { a: "Bloc-porte blindé BP1", p: "dès 2 900 €", n: "Porte, huisserie et serrure certifiées ensemble — ce que demandent les assurances.", }, { a: "Coffre-fort posé", p: "sur devis", n: "Selon classe EN 1143-1 et support. Conseil discret, à l'étude ou chez vous.", }, ];
let TARIFS = TARIFS_SOURCE;

const AVIS_SOURCE = [ { texte: "Après un cambriolage, ils ont remis la porte en sécurité proprement et fourni tous les certificats pour l'assurance. Remboursement sans discussion grâce au dossier.", auteur: "Nadia R.", detail: "Remise en sécurité + A2P**", }, { texte: "Étude honnête : on venait pour une porte blindée, ils nous ont montré qu'un blindage de l'existante suffisait. 1 400 € d'économisés.", auteur: "Thomas V.", detail: "Blindage de porte", }, { texte: "Cylindres sur organigramme pour nos trois commerces. Une seule clé pour moi, des accès limités pour les équipes. Posé un dimanche pour ne pas fermer.", auteur: "SARL Le Comptoir", detail: "Organigramme pro", }, ];
let AVIS_DEMO = AVIS_SOURCE;

const STATS_SOURCE = [ { value: "A2P", label: "Serrures certifiées posées" }, { value: "1 400+", label: "Portes sécurisées" }, { value: "10 ans", label: "Garantie décennale pose" }, { value: "48 h", label: "Étude puis devis ferme" }, ];
let STATS = STATS_SOURCE;

/* La bande défilante : ce que le thème dit de l'urgence, mot pour mot. */
const BANDE = [ "Après effraction", "Remise en sécurité certifiée", "Constat photo pour l'assurance", "Devis ferme sous 48 h", "Nos prix ne doublent pas la nuit", ];

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
    <motion.div
      ref={ref} style={style} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/*
  Sur-titre encadré : le libellé tenu dans un filet rectangulaire, à plat.
  Ni trait de fuite ni dégradé — la boîte se distingue au premier coup d'œil
  des sur-titres filés des thèmes voisins.
*/
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
    <div style={{ display: "flex", justifyContent: align === "center" ? "center" : "flex-start" }}>
      <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.26em", textTransform: "uppercase", fontWeight: 700, color, border: `1px solid ${color}55`, padding: "6px 12px", display: "inline-block", lineHeight: 1.1 }}>
        {children}
      </span>
    </div>
  );
}

function Ghost({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span
      aria-hidden style={{ position: "absolute", fontFamily: DISPLAY, fontWeight: 900, lineHeight: 0.76, color: C.white, opacity: 0.05, pointerEvents: "none", userSelect: "none", ...style, }}
    >
      {children}
    </span>
  );
}

/**
 * Le cylindre en coupe, dessiné au trait. Cinq goupilles, une came.
 * C'est la seule illustration du héros : elle ne charge rien.
 */
function CylindreSVG({ size = 320, stroke = C.accent, opacity = 1 }: { size?: number; stroke?: string; opacity?: number }) {
  return (
    <svg width={size} height={size * 0.62} viewBox="0 0 320 198" fill="none" aria-hidden style={{ display: "block", opacity, overflow: "visible" }}>
      {/* corps du cylindre */}
      <circle cx="94" cy="112" r="56" stroke={stroke} strokeWidth="2" />
      <circle cx="94" cy="112" r="32" stroke={stroke} strokeWidth="1.4" opacity="0.6" />
      <path d="M94 144 L 74 190 L 114 190 Z" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      {/* corps long */}
      <path d="M150 84 H 300 V 140 H 150" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      <path d="M150 84 A 56 56 0 0 0 150 140" stroke={stroke} strokeWidth="2" opacity="0.35" />
      {/* goupilles */}
      {[178, 204, 230, 256, 282].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 84 V ${52 + i * 5}`} stroke={stroke} strokeWidth="1.4" opacity="0.55" strokeLinecap="round" />
          <circle cx={x} cy={98 + (i % 2) * 6} r="4.2" fill={stroke} opacity="0.5" />
        </g>
      ))}
      {/* ligne de césure — là où la clé aligne les goupilles */}
      <path d="M150 112 H 300" stroke={stroke} strokeWidth="1" strokeDasharray="6 7" opacity="0.55" />
      {/* came */}
      <path d="M94 112 L 138 112" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Lien de navigation : soulignement en largeur qui pousse. */
function NavLink({ label, href }: { label: string; href: string }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ position: "relative", fontFamily: SANS, fontSize: 12, letterSpacing: "0.13em", textTransform: "uppercase", fontWeight: 500, color: h ? C.ink : C.textMuted, textDecoration: "none", padding: "13px 2px", transition: "color .45s cubic-bezier(0.16, 1, 0.3, 1)", }}
    >
      {label}
      <span
        style={{ position: "absolute", left: 0, bottom: 8, height: 1, width: h ? "100%" : "0%", background: C.accent, transition: "width .5s cubic-bezier(0.16, 1, 0.3, 1)", }}
      />
    </a>
  );
}

/** Tuile de bento : la première est large, les autres non. */
function BentoTile({
  s,
  n,
  large,
}: {
  s: { titre: string; desc: string; tag: string };
  n: number;
  large: boolean;
}) {
  const [h, setH] = useState(false);
  return (
    <article
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ position: "relative", overflow: "hidden", background: h ? C.bgCard : C.bgAlt, border: `1px solid ${h ? C.accent : C.border}`, padding: large ? "clamp(28px, 3.6vw, 46px)" : "clamp(22px, 2.6vw, 32px)", transform: h ? "translateY(-4px)" : "translateY(0)", boxShadow: h ? "0 26px 52px -30px rgba(0,0,0,0.85), inset 0 1px 0 0 rgba(255,255,255,0.07)" : "0 0 0 0 rgba(0,0,0,0), inset 0 0 0 0 rgba(255,255,255,0)", transition: "all .5s cubic-bezier(0.16, 1, 0.3, 1)", height: "100%", }}
    >
      <Ghost style={{ bottom: -14, right: 8, fontSize: large ? "clamp(96px, 12vw, 168px)" : "clamp(64px, 7vw, 104px)" }}>
        {String(n + 1).padStart(2, "0")}
      </Ghost>
      <span
        style={{ display: "inline-block", fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.26em", textTransform: "uppercase", fontWeight: 600, color: C.accent, border: `1px solid ${C.border}`, padding: "5px 11px", marginBottom: large ? 22 : 16, }}
      >
        {s.tag}
      </span>
      <h3
        style={{ position: "relative", fontFamily: DISPLAY, fontWeight: 700, fontSize: large ? "clamp(24px, 2.9vw, 38px)" : "clamp(18px, 1.8vw, 23px)", lineHeight: 1.06, letterSpacing: "-0.02em", textTransform: "uppercase", color: C.ink, margin: "0 0 12px", }}
      >
        {s.titre}
      </h3>
      <p
        style={{ position: "relative", fontFamily: SANS, fontSize: large ? 15 : 13.8, fontWeight: 300, lineHeight: 1.78, color: C.textMuted, margin: 0, maxWidth: large ? 520 : 460, }}
      >
        {s.desc}
      </p>
      <span
        style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 16, fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent, opacity: h ? 1 : 0, transform: h ? "translateX(0)" : "translateX(-8px)", transition: "all .5s cubic-bezier(0.16, 1, 0.3, 1)", }}
      >
        Étude gratuite
        <ArrowRight size={13} style={{ transform: h ? "translateX(4px)" : "translateX(0)", transition: "transform .5s cubic-bezier(0.16, 1, 0.3, 1)" }} />
      </span>
    </article>
  );
}

/** Bande de tarif : bord accent à gauche, prix en display. */
function PriceBand({ t, n }: { t: { a: string; p: string; n: string }; n: number }) {
  const [h, setH] = useState(false);
  return (
    <div
      className="i332-pband" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ position: "relative", borderLeft: `3px solid ${h ? C.accent : C.border}`, borderBottom: `1px solid ${C.border}`, background: h ? C.bgCard : "transparent", transform: h ? "translateX(6px)" : "translateX(0)", boxShadow: h ? "0 20px 40px -28px rgba(0,0,0,0.9), inset 0 1px 0 0 rgba(255,255,255,0.06)" : "none", transition: "all .5s cubic-bezier(0.16, 1, 0.3, 1)", }}
    >
      <span
        style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.24em", color: C.textFaint, fontVariantNumeric: "tabular-nums", }}
      >
        {String(n + 1).padStart(2, "0")}
      </span>
      <div style={{ minWidth: 0 }}>
        <div
          style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(17px, 1.8vw, 23px)", letterSpacing: "-0.015em", textTransform: "uppercase", color: C.ink, lineHeight: 1.14, }}
        >
          {t.a}
        </div>
        <div
          style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 300, lineHeight: 1.72, color: C.textMuted, marginTop: 7, maxWidth: 500, }}
        >
          {t.n}
        </div>
      </div>
      <div
        style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(18px, 2vw, 26px)", letterSpacing: "-0.02em", color: C.accentDark, whiteSpace: "nowrap", textAlign: "right", }}
      >
        {t.p}
      </div>
    </div>
  );
}

/* ── Repli photo : le client d'abord, le thème ensuite ───────────────────── */
function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/** Cadre à repli dessiné : sans image, la plaque d'acier reste belle. */
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
    <figure
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ margin: 0, border: `1px solid ${h ? C.accent : C.border}`, background: C.bgDark, transform: h ? "translateY(-4px)" : "none", boxShadow: h ? "0 28px 54px -32px rgba(0,0,0,0.9), inset 0 1px 0 0 rgba(255,255,255,0.06)" : "none", transition: "all .5s cubic-bezier(0.16, 1, 0.3, 1)", }}
    >
      <div
        style={{ position: "relative", aspectRatio: ratio, overflow: "hidden", background: `linear-gradient(155deg, ${C.bgCard} 0%, ${C.bgDark} 55%, ${C.bgDarkAlt} 100%)`, }}
      >
        <div aria-hidden className="i332-trame" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <CylindreSVG size={230} stroke={C.acier} opacity={0.3} />
        </div>
        {src ? (
          <img
            src={src} alt={alt} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", transform: h ? "scale(1.04)" : "scale(1)", transition: "transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)", }}
          />
        ) : null}
      </div>
      <figcaption
        style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color: C.textMuted, background: C.bgAlt, padding: "13px 16px", borderTop: `1px solid ${C.border}`, }}
      >
        {legende}
      </figcaption>
    </figure>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════════════════ */
export default function FaubourgSerruresPage() {
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

  /* Affectations AVANT tout appel de helper. */
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
  const METHODE = resolveList(fusionnerEtapes(METHODE_SOURCE, clientMethode(sessionData)), METHODE_SOURCE);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const marque = fd?.businessName ?? clientName(sessionData) ?? "Faubourg Serrures";
  const ville = clientCity(sessionData) ?? "Marseille";
  const metier = clientTrade(sessionData) ?? "Sécurité";
  const tel = clientPhone(sessionData) ?? "04 91 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? "+33491000000").replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? "etude@faubourg-serrures.fr";
  const adresse = clientAddress(sessionData);

  /* Le lockup contour/plein : deux lignes courtes, câblées au contrat. */
  const lockGhost = (clientHeroLine(sessionData, 0, 2, 13) ?? "VOTRE PORTE").toUpperCase();
  const lockSolid = (clientHeroLine(sessionData, 1, 2, 13) ?? "BLINDÉE.").toUpperCase();

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip" }}>
      <style>{`${FONTS_CSS}

        /* ── texture métier : la trame des goupilles ─────────────────────── */
        .i332-trame {
          background-image:
            repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, rgba(255,255,255,0) 1px 26px),
            repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, rgba(255,255,255,0) 1px 26px);
          pointer-events: none;
        }

        /* ── grilles pilotées ici, jamais en style inline ────────────────── */
        /*
          Le héros ne se partage plus en colonne texte / colonne image : le
          texte tient le haut, la planche technique court d'un bord à l'autre
          en pied d'écran.
        */
        .i332-hero {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: clamp(28px, 4.5vh, 56px);
          max-width: 1220px;
          margin: 0 auto;
          padding: clamp(130px, 16vh, 180px) clamp(22px, 6vw, 68px) 0;
          position: relative;
          min-height: 100dvh;
        }
        .i332-haut { max-width: 900px; }

        /* Le bandeau sort de la largeur du contenu ET du rembourrage : le
           parent porte overflow-x: clip, donc 100vw ne crée pas de barre. */
        .i332-bandeau {
          position: relative;
          z-index: 2;
          width: 100vw;
          margin-left: calc(50% - 50vw);
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 2.1fr);
          align-items: center;
          gap: clamp(18px, 3vw, 48px);
          padding: clamp(16px, 2vw, 26px) clamp(22px, 6vw, 68px);
          border-top: 1px solid ${C.accent};
          background: linear-gradient(180deg, ${C.bgAlt} 0%, ${C.bgDark} 100%);
          overflow: hidden;
        }
        .i332-bandeau-legende { min-width: 0; }
        .i332-planche {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          align-items: center;
          justify-items: center;
          gap: clamp(12px, 2vw, 32px);
        }

        .i332-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          max-width: 1180px;
          margin: 0 auto;
        }

        .i332-bento {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: clamp(12px, 1.6vw, 20px);
        }
        .i332-tile { grid-column: span 2; }
        .i332-tile-large { grid-column: span 4; }

        .i332-methode {
          display: grid;
          grid-template-columns: minmax(0, 62px) minmax(0, 1fr) minmax(0, 1.5fr);
          gap: clamp(14px, 2.4vw, 38px);
          align-items: start;
          padding: clamp(24px, 3vw, 38px) 0;
          border-top: 1px solid rgba(255,255,255,0.09);
        }

        .i332-split {
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
          gap: clamp(30px, 5vw, 76px);
          align-items: center;
          max-width: 1140px;
          margin: 0 auto;
        }

        .i332-pband {
          display: grid;
          grid-template-columns: minmax(0, 44px) minmax(0, 1fr) minmax(0, 210px);
          gap: clamp(12px, 2vw, 26px);
          align-items: baseline;
          padding: clamp(20px, 2.4vw, 30px) clamp(14px, 2vw, 26px);
        }

        .i332-avis {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(290px, 100%), 1fr));
          gap: clamp(14px, 2vw, 22px);
        }

        .i332-urgence {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
          gap: clamp(16px, 2vw, 26px);
        }

        .i332-pied {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr);
          gap: clamp(24px, 4vw, 56px);
        }

        /* ── la bande : marquee, arrêtée si le visiteur le demande ───────── */
        .i332-marquee { display: flex; width: max-content; animation: i332-defile 34s linear infinite; }
        @keyframes i332-defile { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        /* ── points de rupture ───────────────────────────────────────────── */
        @media (max-width: 1000px) {
          #i332-nav { display: none !important; }
          .i332-burger { display: flex !important; }
          .aevia-action-mobile { display: inline-flex !important; }
          /* Trois cylindres côte à côte deviennent trois traits illisibles :
             sous 1000 px la planche n'en garde qu'un, et la légende passe
             au-dessus. */
          .i332-bandeau { grid-template-columns: 1fr; row-gap: 18px; }
          .i332-planche { grid-template-columns: 1fr; }
          .i332-planche > *:not(:first-child) { display: none; }
          .i332-tile, .i332-tile-large { grid-column: span 3; }
          .i332-split { grid-template-columns: 1fr; }
          .i332-pied { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 860px) {
          .i332-bento { grid-template-columns: 1fr; }
          .i332-tile, .i332-tile-large { grid-column: span 1; }
          .i332-stats { grid-template-columns: 1fr 1fr; }
          .i332-methode { grid-template-columns: minmax(0, 52px) minmax(0, 1fr); row-gap: 12px; }
          .i332-methode > :last-child { grid-column: 1 / -1; }
          .i332-pband { grid-template-columns: minmax(0, 36px) minmax(0, 1fr); row-gap: 10px; }
          .i332-pband > :last-child { grid-column: 2 / -1; text-align: left; }
          .i332-pied { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .i332-marquee { animation: none; }
          .i332-tile, .i332-pband { transition: none !important; }
        }
      `}</style>

      {/* ══ NAV ══════════════════════════════════════════════════════════ */}
      <nav
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: scrolled ? "10px clamp(18px, 5vw, 56px)" : "22px clamp(18px, 5vw, 56px)", background: scrolled ? "rgba(13,16,19,0.92)" : "transparent", backdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none", WebkitBackdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "padding .55s cubic-bezier(0.16, 1, 0.3, 1), background .55s cubic-bezier(0.16, 1, 0.3, 1), border-color .55s cubic-bezier(0.16, 1, 0.3, 1), backdrop-filter .55s cubic-bezier(0.16, 1, 0.3, 1)", }}
      >
        <a href="#haut" style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0, textDecoration: "none" }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={marque} style={{ height: 32, maxWidth: 168, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Lock size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span
                style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 18, letterSpacing: "-0.01em", textTransform: "uppercase", color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", }}
              >
                {marque}
              </span>
              <span
                style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.3em", textTransform: "uppercase", color: C.textFaint, marginLeft: 4, whiteSpace: "nowrap", }}
              >
                {metier}
              </span>
            </>
          )}
        </a>

        <div id="i332-nav" style={{ display: "flex", gap: "clamp(14px, 1.8vw, 28px)", alignItems: "center" }}>
          {NAV.map((n) => (
            <NavLink key={n.l} label={n.l} href={n.h} />
          ))}
          <motion.a
            href={telHref} whileHover={{ y: -2 }} transition={{ duration: 0.45, ease: EASE }} style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, background: C.accent, color: C.onAccent, padding: "13px 24px", textDecoration: "none", whiteSpace: "nowrap", }}
          >
            Étude gratuite
          </motion.a>
        </div>

        {/* L'appel à l'action sous le pouce : la barre est fixe, mais son
            bouton vit dans le menu déroulant, en display:none sous le point
            de rupture. Celui-ci paraît exactement avec le bouton de menu. */}
        <ActionMobile href={telHref} fond={C.accent} encre={C.onAccent}>
          Appeler
        </ActionMobile>
        <button
          className="i332-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44, }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "transform .35s cubic-bezier(0.16, 1, 0.3, 1)", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "opacity .3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "transform .35s cubic-bezier(0.16, 1, 0.3, 1)", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>

      {mobileOpen && (
        <div
          style={{ position: "fixed", top: 60, left: 0, right: 0, zIndex: 99, background: C.bgAlt, borderBottom: `1px solid ${C.border}`, padding: "18px clamp(20px, 6vw, 32px) 26px", display: "flex", flexDirection: "column", gap: 2, }}
        >
          {NAV.map((n) => (
            <a
              key={n.l} href={n.h} onClick={() => setMobileOpen(false)} style={{ fontFamily: SANS, fontSize: 15, letterSpacing: "0.05em", color: C.ink, textDecoration: "none", padding: "13px 0", borderBottom: `1px solid ${C.border}`, }}
            >
              {n.l}
            </a>
          ))}
          <a
            href={telHref} style={{ marginTop: 14, background: C.accent, color: C.onAccent, textAlign: "center", padding: "15px 22px", fontFamily: SANS, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, textDecoration: "none", }}
          >
            Étude gratuite
          </a>
        </div>
      )}

      {/* ══ HERO — bandeau bas : le texte tient le haut, la coupe technique
             court d'un bord à l'autre en pied d'écran. Ni colonne texte ni
             colonne image : c'est ce partage-là qui rendait la série
             interchangeable. ══════════════════════════════════════════════ */}
      <section id="haut" className="i332-hero">
        <div aria-hidden className="i332-trame" style={{ position: "absolute", inset: 0, opacity: 0.6 }} />
        <div
          aria-hidden style={{ position: "absolute", top: "6%", right: "-8%", width: "min(820px, 92vw)", height: "min(820px, 92vw)", background: "radial-gradient(circle, rgba(78,159,212,0.12) 0%, rgba(78,159,212,0) 62%)", pointerEvents: "none", }}
        />
        <Ghost style={{ top: "18%", left: "clamp(-12px, -1vw, 0px)", fontSize: "clamp(120px, 20vw, 280px)", opacity: 0.045 }}>A2P</Ghost>

        <div className="i332-haut" style={{ position: "relative", zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}>
            <Kicker>{clientEyebrow(sessionData) ?? `Serrurerie de sécurité · ${ville}`}</Kicker>
          </motion.div>

          {/* ── GESTE SIGNATURE : le lockup contour / plein ─────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.95, ease: EASE, delay: 0.18 }} style={{ margin: "clamp(20px, 2.6vw, 32px) 0 0" }}
          >
            <h1
              style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(42px, 8.4vw, 108px)", lineHeight: 0.94, letterSpacing: "-0.035em", margin: 0, overflowWrap: "break-word", }}
            >
              <GhostSolid ghost={lockGhost} solid={lockSolid} accent={C.accent} strokeWidth={1.4} className="" />
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease: EASE, delay: 0.32 }} style={{ fontFamily: SANS, fontSize: "clamp(15px, 1.25vw, 17px)", fontWeight: 300, lineHeight: 1.8, color: C.textMuted, maxWidth: 600, margin: "clamp(22px, 2.6vw, 32px) 0 clamp(24px, 2.8vw, 34px)", }}
          >
            {clientAccrocheRestante(sessionData, 2, 13) ??
              clientHeroPrestations(sessionData) ??
              c?.heroSubline ??
              "Pas de dépannage à 3 h du matin ici : du blindage pensé à froid. Portes blindées, serrures A2P, coffres — étudiés, posés, garantis par des serruriers salariés."}
          </motion.p>

          {/*
            Une seule action pleine, et la seconde piste en lien souligné : le
            duo plein + contour était le tic de la série.
          */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.44 }} style={{ display: "flex", gap: "clamp(16px, 2vw, 28px)", flexWrap: "wrap", alignItems: "center" }}
          >
            <motion.a
              href={telHref} whileHover={{ y: -3 }} transition={{ duration: 0.45, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.accent, color: C.onAccent, fontFamily: SANS, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, padding: "17px 32px", textDecoration: "none", boxShadow: "0 18px 38px -22px rgba(78,159,212,0.9)", }}
            >
              Demander une étude <ArrowRight size={15} />
            </motion.a>
            <a
              href="#services" style={{ fontFamily: SANS, fontSize: 13, color: C.ink, textDecoration: "none", borderBottom: `1px solid ${C.accent}`, paddingBottom: 3 }}
            >
              Nos installations
            </a>
          </motion.div>
        </div>

        {/* ── LE BANDEAU — d'un bord à l'autre, en pied d'écran ──────────── */}
        {/*
          Le cylindre en coupe était enfermé dans un panneau à droite du texte :
          c'était la deuxième colonne. Ici il court sur toute la largeur, trois
          fois, comme une planche technique — et la légende reste lisible parce
          qu'elle a le bord gauche du bandeau pour elle seule.
        */}
        <motion.div
          className="i332-bandeau" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.05, ease: EASE, delay: 0.3 }}
        >
          <div className="i332-bandeau-legende">
            <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(26px, 3.4vw, 44px)", lineHeight: 1, letterSpacing: "-0.03em", color: C.ink }}>
              A2P
            </div>
            <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: C.textFaint, lineHeight: 1.8, marginTop: 10 }}>
              Cylindre en coupe · goupilles alignées sur la ligne de césure
            </div>
          </div>

          <div aria-hidden className="i332-planche">
            {[0.9, 0.5, 0.26].map((o, n) => (
              <div key={n} style={{ display: "grid", placeItems: "center", opacity: o }}>
                <CylindreSVG size={148} stroke={n === 0 ? C.accentDark : C.acier} />
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══ BANDE — après effraction, en défilé ══════════════════════════ */}
      <div
        style={{ background: C.accent, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, overflow: "hidden", padding: "13px 0", }}
      >
        <div className="i332-marquee" aria-hidden>
          {[0, 1].map((rep) => (
            <div key={rep} style={{ display: "flex", alignItems: "center", gap: 0, flexShrink: 0 }}>
              {BANDE.map((b) => (
                <span
                  key={`${rep}-${b}`} style={{ display: "inline-flex", alignItems: "center", gap: 18, fontFamily: DISPLAY, fontWeight: 700, fontSize: 13, letterSpacing: "0.22em", textTransform: "uppercase", color: C.onAccent, padding: "0 26px", whiteSpace: "nowrap", }}
                >
                  {b}
                  <span style={{ width: 5, height: 5, background: C.onAccent, opacity: 0.55, display: "inline-block" }} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ══ RESPIRATION ══════════════════════════════════════════════════ */}
      <section
        style={{ padding: "clamp(56px, 9vw, 116px) clamp(22px, 6vw, 68px)", background: C.bg, textAlign: "center", }}
      >
        <Reveal>
          <p
            style={{ fontFamily: DISPLAY, fontWeight: 500, fontStyle: "italic", fontSize: "clamp(21px, 2.9vw, 36px)", lineHeight: 1.4, letterSpacing: "-0.018em", color: C.ink, maxWidth: 780, margin: "0 auto", }}
          >
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (
              <>
                On chiffre ce qui est utile, <span style={{ color: C.accent }}>pas ce qui se vend.</span>
              </>
            )}
          </p>
        </Reveal>
      </section>

      {/* ══ CHIFFRES ═════════════════════════════════════════════════════ */}
      <section style={{ background: C.bgDark, position: "relative", overflow: "hidden", borderTop: `1px solid ${C.border}` }}>
        <div aria-hidden className="i332-trame" style={{ position: "absolute", inset: 0, opacity: 0.45 }} />
        <div className="i332-stats" style={{ position: "relative", padding: "0 clamp(16px, 4vw, 40px)" }}>
          {STATS.map((s: any, idx: number) => (
            <Reveal key={`${s.label}-${idx}`} delay={idx * 0.06} y={18}>
              <div
                style={{ position: "relative", padding: "clamp(30px, 4vw, 48px) clamp(10px, 1.6vw, 20px)", borderRight: idx < STATS.length - 1 ? `1px solid ${C.border}` : "none", overflow: "hidden", textAlign: "center", }}
              >
                <Ghost style={{ top: "8%", left: "50%", transform: "translateX(-50%)", fontSize: "clamp(64px, 8vw, 108px)" }}>
                  {String(idx + 1).padStart(2, "0")}
                </Ghost>
                <div
                  style={{ position: "relative", fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(30px, 3.6vw, 46px)", lineHeight: 1, letterSpacing: "-0.03em", color: C.accentDark, }}
                >
                  {s.value}
                </div>
                <div
                  style={{ position: "relative", fontFamily: SANS, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.textFaint, marginTop: 11, lineHeight: 1.6, }}
                >
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ INSTALLATIONS — bento inégal ════════════════════════════════ */}
      <section
        id="services" style={{ padding: "clamp(64px, 10vw, 132px) clamp(22px, 6vw, 68px)", background: C.bg, position: "relative", }}
      >
        <div style={{ maxWidth: 1220, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(28px, 3.6vw, 50px)", maxWidth: 720 }}>
              <Kicker>Installations</Kicker>
              <h2
                style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(30px, 4.6vw, 60px)", lineHeight: 1.02, letterSpacing: "-0.032em", textTransform: "uppercase", color: C.ink, margin: "clamp(16px, 2vw, 24px) 0 0", }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                  <>
                    Ce qui tient
                    <br />
                    <em style={{ fontStyle: "italic", fontWeight: 500, color: C.accent }}>quand on force.</em>
                  </>
                )}
              </h2>
            </div>
          </Reveal>

          <div className="i332-bento">
            {/*
              L'enfant de la grille est ce div-ci, pas la tuile : c'est lui qui
              doit porter la classe d'empan. Le motif 4-2 / 2-4 se répète tous
              les quatre éléments, donc la rangée reste pleine quel que soit le
              nombre de prestations saisies par le client.
            */}
            {SERVICES.map((s: any, idx: number) => {
              const large = idx % 4 === 0 || idx % 4 === 3;
              return (
                <div key={`${s.titre}-${idx}`} className={large ? "i332-tile i332-tile-large" : "i332-tile"}>
                  <Reveal delay={Math.min(idx, 5) * 0.055} y={24} style={{ height: "100%" }}>
                    <BentoTile s={s} n={idx} large={large} />
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ APRÈS EFFRACTION — la seule urgence que l'on prend ══════════ */}
      <section
        id="urgence" style={{ padding: "clamp(60px, 9vw, 120px) clamp(22px, 6vw, 68px)", background: C.bgAlt, borderTop: `1px solid ${C.border}`, position: "relative", overflow: "hidden", }}
      >
        <Ghost style={{ top: "-4%", right: "2%", fontSize: "clamp(110px, 16vw, 240px)", opacity: 0.04 }}>48 H</Ghost>
        <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 22, alignItems: "flex-end", justifyContent: "space-between", marginBottom: "clamp(26px, 3.4vw, 44px)" }}>
              <div style={{ maxWidth: 620 }}>
                <Kicker>Après effraction</Kicker>
                <h2
                  style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(27px, 3.8vw, 48px)", lineHeight: 1.04, letterSpacing: "-0.03em", textTransform: "uppercase", color: C.ink, margin: "clamp(14px, 1.8vw, 22px) 0 0", }}
                >
                  {/* TEXTE_SECTION */ clientText(sessionData, "urgence.titre") ?? (
                    <>
                      Remise en sécurité,
                      <br />
                      <em style={{ fontStyle: "italic", fontWeight: 500, color: C.accent }}>dossier compris.</em>
                    </>
                  )}
                </h2>
              </div>
              <p
                style={{ fontFamily: SANS, fontSize: 14.5, fontWeight: 300, lineHeight: 1.8, color: C.textMuted, maxWidth: 440, margin: 0, }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "urgence.texte") ??
                  "Constat photo pour l'assurance, remplacement à niveau certifié, pas de bricolage — et un prix qui ne double pas parce qu'il est tard."}
              </p>
            </div>
          </Reveal>

          <div className="i332-urgence">
            <Reveal delay={0.05}>
              <Plaque
                src={photo(0, "https://images.pexels.com/photos/792034/pexels-photo-792034.jpeg?auto=compress&cs=tinysrgb&w=1400")}
                alt="Serrure de porte en gros plan"
                legende="Serrure de porte, gros plan"
              />
            </Reveal>
            <Reveal delay={0.12}>
              <Plaque src={photo(1, "")} alt="Pose d'un bloc-porte blindé" legende="Pose d'un bloc-porte blindé" />
            </Reveal>
            <Reveal delay={0.19}>
              <div
                style={{ border: `1px solid ${C.border}`, background: C.bgCard, padding: "clamp(24px, 3vw, 34px)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 18, }}
              >
                <Shield size={26} color={C.accent} strokeWidth={1.4} />
                <div
                  style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(19px, 2vw, 26px)", lineHeight: 1.1, letterSpacing: "-0.02em", textTransform: "uppercase", color: C.ink, }}
                >
                  Certificats A2P remis
                </div>
                <p style={{ fontFamily: SANS, fontSize: 13.8, fontWeight: 300, lineHeight: 1.78, color: C.textMuted, margin: 0 }}>
                  Certificats A2P et factures conformes pour votre assureur — ils conditionnent souvent votre indemnisation.
                </p>
                <a
                  href={telHref} style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: SANS, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, color: C.accent, textDecoration: "none", }}
                >
                  Nous appeler <ArrowRight size={14} />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ MÉTHODE — quatre bandes horizontales ════════════════════════ */}
      <section id="methode" style={{ padding: "clamp(64px, 10vw, 130px) clamp(22px, 6vw, 68px)", background: C.bg }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(24px, 3vw, 40px)", maxWidth: 700 }}>
              <Kicker>La méthode</Kicker>
              <h2
                style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(29px, 4.2vw, 54px)", lineHeight: 1.02, letterSpacing: "-0.032em", textTransform: "uppercase", color: C.ink, margin: "clamp(16px, 2vw, 24px) 0 0", }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                  <>
                    On étudie,
                    <br />
                    <em style={{ fontStyle: "italic", fontWeight: 500, color: C.accent }}>puis on pose.</em>
                  </>
                )}
              </h2>
            </div>
          </Reveal>

          <div style={{ borderBottom: `1px solid ${C.border}` }}>
            {METHODE.map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.06} y={20}>
                <div className="i332-methode">
                  <div
                    style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(26px, 3vw, 40px)", lineHeight: 1, letterSpacing: "-0.03em", color: C.accent, }}
                  >
                    {m.n}
                  </div>
                  <h3
                    style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(17px, 1.8vw, 22px)", lineHeight: 1.16, letterSpacing: "-0.015em", textTransform: "uppercase", color: C.ink, margin: 0, }}
                  >
                    {m.t}
                  </h3>
                  <p style={{ fontFamily: SANS, fontSize: 14, fontWeight: 300, lineHeight: 1.8, color: C.textMuted, margin: 0, maxWidth: 560 }}>
                    {m.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ENGAGEMENTS ══════════════════════════════════════════════════ */}
      <section
        id="engagements" style={{ padding: "clamp(64px, 10vw, 130px) clamp(22px, 6vw, 68px)", background: C.bgAlt, borderTop: `1px solid ${C.border}` }}
      >
        <div className="i332-split">
          <Reveal>
            <div
              style={{ position: "relative", border: `1px solid ${C.border}`, background: `linear-gradient(150deg, ${C.bgCard} 0%, ${C.bgDark} 100%)`, aspectRatio: "4 / 3", display: "grid", placeItems: "center", overflow: "hidden", }}
            >
              <div aria-hidden className="i332-trame" style={{ position: "absolute", inset: 0, opacity: 0.7 }} />
              <Ghost style={{ top: "6%", left: "6%", fontSize: "clamp(80px, 11vw, 160px)", opacity: 0.06 }}>CNPP</Ghost>
              <CylindreSVG size={280} stroke={C.acier} opacity={0.85} />
              <div
                style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "15px 20px", borderTop: `1px solid ${C.border}`, background: "rgba(8,10,13,0.82)", fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: C.accent, }}
              >
                Matériel certifié CNPP uniquement
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div>
              <Kicker>Nos engagements</Kicker>
              <h2
                style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(27px, 3.7vw, 46px)", lineHeight: 1.04, letterSpacing: "-0.03em", textTransform: "uppercase", color: C.ink, margin: "clamp(14px, 1.8vw, 22px) 0 clamp(22px, 2.6vw, 32px)", }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>
                    La sécurité,
                    <br />
                    <em style={{ fontStyle: "italic", fontWeight: 500, color: C.accent }}>sans le théâtre.</em>
                  </>
                )}
              </h2>
              <div>
                {ENGAGEMENT.map((e: string, idx: number) => (
                  <div
                    key={idx} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "15px 0", borderTop: idx === 0 ? `1px solid ${C.border}` : "none", borderBottom: `1px solid ${C.border}`, }}
                  >
                    <Check size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 4 }} />
                    <span style={{ fontFamily: SANS, fontSize: 14.5, fontWeight: 300, lineHeight: 1.74, color: C.textMuted }}>{e}</span>
                  </div>
                ))}
              </div>
              <motion.a
                href={telHref} whileHover={{ y: -3 }} transition={{ duration: 0.45, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: "clamp(22px, 2.6vw, 32px)", background: C.accent, color: C.onAccent, fontFamily: SANS, fontSize: 11.5, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, padding: "16px 30px", textDecoration: "none", }}
              >
                Nous appeler <ArrowRight size={15} />
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ TARIFS — bandes ══════════════════════════════════════════════ */}
      <section id="tarifs" style={{ padding: "clamp(64px, 10vw, 130px) clamp(22px, 6vw, 68px)", background: C.bg }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(26px, 3.4vw, 44px)" }}>
              <Kicker>Tarifs</Kicker>
              <h2
                style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(29px, 4.2vw, 54px)", lineHeight: 1.02, letterSpacing: "-0.032em", textTransform: "uppercase", color: C.ink, margin: "clamp(14px, 1.8vw, 22px) 0 0", }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                  <>
                    Des prix <em style={{ fontStyle: "italic", fontWeight: 500, color: C.accent }}>posés.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 14.5, fontWeight: 300, lineHeight: 1.78, color: C.textMuted, maxWidth: 560, margin: "16px 0 0" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.texte") ??
                  "Pose, déplacement et réglages compris. Les certificats pour votre assureur sont remis avec la facture."}
              </p>
            </div>
          </Reveal>

          <div style={{ borderTop: `1px solid ${C.border}` }}>
            {TARIFS.map((t: any, idx: number) => (
              <Reveal key={`${t.a}-${idx}`} delay={Math.min(idx, 4) * 0.055} y={18}>
                <PriceBand t={t} n={idx} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ AVIS — bandes numérotées ═════════════════════════════════════ */}
      <section
        style={{ padding: "clamp(64px, 10vw, 132px) clamp(22px, 6vw, 68px)", background: C.bgDark, position: "relative", overflow: "hidden", borderTop: `1px solid ${C.border}`, }}
      >
        <div aria-hidden className="i332-trame" style={{ position: "absolute", inset: 0, opacity: 0.35 }} />
        <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(30px, 3.8vw, 52px)" }}>
              <Kicker>Ils dorment tranquilles</Kicker>
              <h2
                style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(28px, 3.9vw, 48px)", lineHeight: 1.04, letterSpacing: "-0.03em", textTransform: "uppercase", color: C.white, margin: "clamp(14px, 1.8vw, 22px) 0 0", }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                  <>
                    Ils dorment <em style={{ fontStyle: "italic", fontWeight: 500, color: C.accent }}>tranquilles</em>.
                  </>
                )}
              </h2>
            </div>
          </Reveal>

          <div className="i332-avis">
            {AVIS.map((a: any, idx: number) => (
              <Reveal key={`${a.auteur}-${idx}`} delay={idx * 0.08} y={24}>
                <div
                  style={{ position: "relative", height: "100%", borderLeft: `3px solid ${C.accent}`, background: "rgba(255,255,255,0.035)", padding: "clamp(24px, 3vw, 34px) clamp(20px, 2.4vw, 30px)", overflow: "hidden", }}
                >
                  <Ghost style={{ top: -10, right: 10, fontSize: "clamp(70px, 8vw, 108px)" }}>{String(idx + 1).padStart(2, "0")}</Ghost>
                  <p
                    style={{ position: "relative", fontFamily: SANS, fontSize: "clamp(14.5px, 1.3vw, 16px)", fontWeight: 300, lineHeight: 1.82, color: "rgba(255,255,255,0.84)", margin: "0 0 22px", }}
                  >
                    {a.texte}
                  </p>
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 15 }}>
                    <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: "0.02em", textTransform: "uppercase", color: C.white }}>
                      {a.auteur}
                    </div>
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
      <section
        id="contact" style={{ padding: "clamp(66px, 10vw, 134px) clamp(22px, 6vw, 68px)", background: C.accentLight, textAlign: "center", position: "relative", overflow: "hidden", borderTop: `1px solid ${C.border}`, }}
      >
        <Ghost style={{ top: "-8%", left: "50%", transform: "translateX(-50%)", fontSize: "clamp(130px, 19vw, 290px)", opacity: 0.05 }}>A2P</Ghost>
        <div style={{ position: "relative", maxWidth: 780, margin: "0 auto" }}>
          <Reveal>
            <Kicker align="center">Étude gratuite</Kicker>
            <h2
              style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(30px, 4.6vw, 58px)", lineHeight: 1.02, letterSpacing: "-0.034em", textTransform: "uppercase", color: C.ink, margin: "clamp(16px, 2vw, 24px) 0 clamp(14px, 1.8vw, 20px)", }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                <>
                  Votre porte mérite
                  <br />
                  <em style={{ fontStyle: "italic", fontWeight: 500, color: C.accent }}>un avis d'expert.</em>
                </>
              )}
            </h2>
            <p
              style={{ fontFamily: SANS, fontSize: "clamp(14.5px, 1.2vw, 16px)", fontWeight: 300, lineHeight: 1.8, color: C.textMuted, maxWidth: 480, margin: "0 auto clamp(28px, 3.4vw, 40px)", }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ??
                "Étude de sécurité gratuite à domicile, devis ferme sous 48 h. Sans engagement, sans relance."}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <motion.a
                href={telHref} whileHover={{ y: -3 }} transition={{ duration: 0.45, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.accent, color: C.onAccent, fontFamily: SANS, fontSize: 13, letterSpacing: "0.08em", fontWeight: 700, padding: "18px 34px", textDecoration: "none", boxShadow: "0 20px 40px -24px rgba(78,159,212,0.95)", }}
              >
                <Phone size={17} /> {tel}
              </motion.a>
              <motion.a
                href={`mailto:${mail}`} whileHover={{ y: -3 }} transition={{ duration: 0.45, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "transparent", color: C.ink, border: `1px solid ${C.accent}`, fontFamily: SANS, fontSize: 13, letterSpacing: "0.08em", fontWeight: 700, padding: "17px 30px", textDecoration: "none", }}
              >
                <Mail size={17} /> Nous écrire
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════════════ */}
      <footer style={{ background: C.bgDarkAlt, padding: "clamp(44px, 6vw, 72px) clamp(22px, 6vw, 68px) clamp(22px, 3vw, 30px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div className="i332-pied" style={{ marginBottom: "clamp(28px, 4vw, 46px)" }}>
            <div>
              <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 20, letterSpacing: "-0.01em", textTransform: "uppercase", color: C.accentDark, marginBottom: 12 }}>
                {marque}
              </div>
              <p style={{ fontFamily: SANS, fontSize: 13, fontWeight: 300, lineHeight: 1.8, color: C.textFaint, maxWidth: 340, margin: 0 }}>
                Serrurerie de sécurité · {ville}
                <br />
                Installateur agréé A2P, assurance décennale
              </p>
            </div>

            <div>
              <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>
                Nous joindre
              </div>
              {[
                { icon: <MapPin size={13} />, t: adresse ?? clientCodePostalVille(sessionData, "13001", "Marseille") },
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
