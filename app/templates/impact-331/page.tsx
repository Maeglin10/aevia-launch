"use client";
// @ts-nocheck

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Check, Glasses, Mail, MapPin, Phone } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { ScrollSpin } from "@/lib/templates/hero-kit-3";
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
} from "@/lib/templates/clientContent";

/* ════════════════════════════════════════════════════════════════════════════
   {clientName(sessionData) ?? "Regard Nord"} — Opticiens · Lille centre

   Archétype H4 : éditorial décalé. Le titre XXL déborde sur un panneau clair
   posé plus bas à droite ; la monture pivote au creux de ce recouvrement.

   Geste signature : ScrollSpin (hero-kit-3). La monture dessinée en SVG tourne
   à mesure qu'on descend — ce n'est pas une boucle, c'est le défilement qui
   l'entraîne. Il remplace l'ArcSwap de la version précédente : le balancier
   racontait un présentoir, la rotation raconte l'objet qu'on tourne entre ses
   doigts avant de l'essayer.

   Fontes P2 — Playfair Display (titres, italiques) contre Space Grotesk
   (libellés, corps). Deux rôles opposés : la lettre gravée de l'optique
   ancienne, la grotesque technique de l'atelier.
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
const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');`;

const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif";
const SANS = "'Space Grotesk', system-ui, -apple-system, 'Segoe UI', sans-serif";

/* ── Easing unique, répété littéralement en CSS ──────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Palette ─────────────────────────────────────────────────────────────── */
let C: Record<string, string> = { bg: "#f5f8f9", bgAlt: "#e6eff1", bgDark: "#07262e", bgDarkAlt: "#04191f", bgCard: "#ffffff", accent: "var(--brand, #0e7490)", accentDark: "var(--brand-light, #0b5a6e)", accentLight: "#d5e9ee", ink: "#0a1f25", textMuted: "#496670", textFaint: "#8aa3ab", border: "#d2e2e6", white: "#ffffff", /* clé métier : le verre, ce bleu-vert très pâle des traitements anti-reflets */ verre: "#a9d6dc", };

/* ════════════════════════════════════════════════════════════════════════════
   Données — SOURCE figée, LIVE ré-appelée dans le rendu
   ════════════════════════════════════════════════════════════════════════════ */

const NAV = [ { l: "Services", h: "#services" }, { l: "La boutique", h: "#boutique" }, { l: "La méthode", h: "#methode" }, { l: "Tarifs", h: "#tarifs" }, { l: "Contact", h: "#contact" }, ];

/* Les trois spécialités qui portaient le carrousel : elles tiennent désormais
   le sommaire du héros, sans second geste d'animation. */
const FOCALES_SOURCE = [
  {
    k: "Lunettes de vue",
    line: "La monture essayée, ajustée, assumée.",
    sub: "300 modèles, créateurs indépendants inclus.",
    alt: "Conseil monture à la boutique",
    img: "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=800&q=80",
  },
  {
    k: "Examen de vue",
    line: "Votre correction vérifiée sur place.",
    sub: "Renouvellement d'ordonnance dans le cadre légal.",
    alt: "Salle d'examen de vue",
    img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80",
  },
  {
    k: "Solaires",
    line: "Protéger, sans renoncer au style.",
    sub: "Verres polarisants, UV 400 certifié.",
    alt: "Présentoir de montures solaires",
    img: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80",
  },
];
function FOCALES_LIVE() {
  return FOCALES_SOURCE.map((f, i) => ({ ...f, img: clientPhotos(sessionData)[i] || f.img }));
}
let FOCALES = FOCALES_SOURCE;

const SERVICES_SOURCE = [ { titre: "Lunettes de vue", desc: "Montures acétate, métal, titane. Créateurs français et indépendants, du classique au plus affirmé — jamais deux fois la même vitrine.", tag: "Vue", }, { titre: "Examen de vue", desc: "Réfraction complète en salle dédiée. Depuis 2016, l'opticien peut adapter votre correction jusqu'à 5 ans après l'ordonnance.", tag: "Examen", }, { titre: "Verres & montage atelier", desc: "Verres français amincis, anti-reflets, lumière bleue. Montage et ajustage dans notre atelier, retouches gratuites à vie.", tag: "Atelier", }, { titre: "Lentilles de contact", desc: "Adaptation par opticien diplômé, essai encadré, suivi à un mois. Journalières, mensuelles, toriques et multifocales.", tag: "Lentilles", }, { titre: "Basse vision", desc: "Aides visuelles pour DMLA et malvoyance : loupes électroniques, éclairages, filtres. Essais à domicile possibles.", tag: "Basse vision", }, { titre: "Enfants", desc: "Montures indestructibles garanties, verres adaptés au traitement de l'amblyopie, contrôles de croissance tous les six mois.", tag: "Enfants", }, ];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE_SOURCE = [ { n: "01", t: "On écoute d'abord", d: "Votre usage, vos écrans, votre conduite de nuit. La monture vient après le mode de vie, pas l'inverse.", }, { n: "02", t: "Examen ou ordonnance", d: "Examen de vue sur place si votre ordonnance date, dans le cadre légal du renouvellement.", }, { n: "03", t: "Essais francs", d: "On vous dit quand une monture ne vous va pas. Photos d'essayage envoyées pour décider à tête reposée.", }, { n: "04", t: "Montage & suivi", d: "Montage atelier, ajustage au visage, retouches gratuites à vie. Tiers payant mutuelle directement appliqué.", }, ];

const ENGAGEMENT_SOURCE = [ "Opticiens diplômés d'État (BTS Opticien-Lunetier) présents à chaque ouverture", "Offre 100 % Santé : un vrai choix de montures sans reste à charge, pas un fond de tiroir", "Devis normalisé remis avant toute commande — panier moyen affiché en vitrine", "Tiers payant Sécurité sociale et mutuelles : vous n'avancez pas les frais", ];
let ENGAGEMENT = ENGAGEMENT_SOURCE;

const TARIFS_SOURCE = [ { a: "Équipement 100 % Santé", p: "0 € de reste à charge", n: "Monture classe A + verres classe A, garantis deux ans. Un vrai choix de 35 modèles.", }, { a: "Monture + verres unifocaux", p: "dès 149 €", n: "Verres français durcis anti-reflets inclus. Amincissement selon correction.", }, { a: "Monture + verres progressifs", p: "dès 349 €", n: "Adaptation garantie : verres refaits sans frais si la vision de près ne convient pas.", }, { a: "Lentilles d'essai", p: "offertes", n: "Première adaptation et rendez-vous de contrôle à un mois inclus.", }, ];
let TARIFS = TARIFS_SOURCE;

const AVIS_SOURCE = [ { texte: "Premier opticien qui m'a déconseillé une monture plus chère parce qu'elle n'allait pas à mon visage. Les progressifs réglés en un seul essai.", auteur: "Martine L.", detail: "Verres progressifs", }, { texte: "Examen de vue sérieux, renouvellement fait sur place sans repasser par l'ophtalmo — six mois d'attente économisés. Lunettes prêtes en une heure.", auteur: "Karim B.", detail: "Renouvellement + montage express", }, { texte: "Ma fille a cassé ses lunettes deux fois cette année. Remplacées deux fois sous garantie, sans discussion, ajustées en cinq minutes.", auteur: "Aurélie D.", detail: "Équipement enfant", }, ];
let AVIS_DEMO = AVIS_SOURCE;

const STATS_SOURCE = [ { value: "300+", label: "Montures en boutique" }, { value: "0 €", label: "Reste à charge 100 % Santé" }, { value: "1 h", label: "Montage express sur stock" }, { value: "2 ans", label: "Garantie casse monture" }, ];
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
    <motion.div
      ref={ref} style={style} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.95, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Kicker : filet 40×1 px puis capitales très espacées. */
function Kicker({
  children,
  color = C.accentDark,
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
        style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.36em", textTransform: "uppercase", fontWeight: 600, color, }}
      >
        {children}
      </span>
      {align === "center" && (
        <span style={{ width: 40, height: 1, background: color, opacity: 0.75, flexShrink: 0 }} />
      )}
    </div>
  );
}

/** Chiffre fantôme : texture sans image, jamais cliquable. */
function Ghost({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden style={{ position: "absolute", fontFamily: SERIF, fontWeight: 700, lineHeight: 0.78, color: C.ink, opacity: 0.06, pointerEvents: "none", userSelect: "none", ...style, }}
    >
      {children}
    </span>
  );
}

/**
 * La monture, dessinée au trait. C'est l'objet que ScrollSpin fait tourner.
 * Aucun fichier, aucune requête : deux ovales, un pont, deux branches.
 */
function MontureSVG({ size = 300, stroke = C.accent, opacity = 1 }: { size?: number; stroke?: string; opacity?: number }) {
  return (
    <svg
      width={size} height={size * 0.42} viewBox="0 0 300 126" fill="none" aria-hidden style={{ display: "block", opacity, overflow: "visible" }}
    >
      {/* verres */}
      <rect x="42" y="34" width="84" height="58" rx="26" stroke={stroke} strokeWidth="2.2" />
      <rect x="174" y="34" width="84" height="58" rx="26" stroke={stroke} strokeWidth="2.2" />
      {/* pont */}
      <path d="M126 55 C 138 44, 162 44, 174 55" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
      {/* branches */}
      <path d="M42 52 L 10 42" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M258 52 L 290 42" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
      {/* reflets de verre, très faibles */}
      <path d="M58 74 L 88 44" stroke={stroke} strokeWidth="1" opacity="0.4" strokeLinecap="round" />
      <path d="M190 74 L 220 44" stroke={stroke} strokeWidth="1" opacity="0.4" strokeLinecap="round" />
      {/* vis de charnière — le détail gratuit */}
      <circle cx="46" cy="47" r="2.4" fill={stroke} opacity="0.55" />
      <circle cx="254" cy="47" r="2.4" fill={stroke} opacity="0.55" />
    </svg>
  );
}

/** Lien de navigation : soulignement en largeur qui pousse. */
function NavLink({ label, href }: { label: string; href: string }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ position: "relative", fontFamily: SANS, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, color: h ? C.ink : C.textMuted, textDecoration: "none", padding: "13px 2px", transition: "color .45s cubic-bezier(0.16, 1, 0.3, 1)", }}
    >
      {label}
      <span
        style={{ position: "absolute", left: 0, bottom: 8, height: 1, width: h ? "100%" : "0%", background: C.accent, transition: "width .5s cubic-bezier(0.16, 1, 0.3, 1)", }}
      />
    </a>
  );
}

/** Rangée éditoriale de prestation : élévation + deux ombres + accent. */
function ServiceRow({
  s,
  n,
  decale,
}: {
  s: { titre: string; desc: string; tag: string };
  n: number;
  decale: boolean;
}) {
  const [h, setH] = useState(false);
  return (
    <div
      className={`i331-srow ${decale ? "i331-srow-decale" : ""}`} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ position: "relative", borderTop: `1px solid ${h ? C.accent : C.border}`, background: h ? C.white : "transparent", transform: h ? "translateY(-3px)" : "translateY(0)", boxShadow: h ? `0 22px 44px -28px rgba(10,31,37,0.42), 0 2px 0 0 ${C.accent}` : "0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0)", transition: "all .5s cubic-bezier(0.16, 1, 0.3, 1)", }}
    >
      <div>
        <span
          style={{ fontFamily: SERIF, fontSize: "clamp(30px, 3.4vw, 44px)", lineHeight: 1, color: h ? C.accent : C.textFaint, transition: "color .5s cubic-bezier(0.16, 1, 0.3, 1)", }}
        >
          {String(n + 1).padStart(2, "0")}
        </span>
      </div>
      <div style={{ minWidth: 0 }}>
        <span
          style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: C.accentDark, display: "block", marginBottom: 9, }}
        >
          {s.tag}
        </span>
        <h3
          style={{ fontFamily: SERIF, fontSize: "clamp(21px, 2.3vw, 29px)", fontWeight: 500, lineHeight: 1.12, letterSpacing: "-0.012em", color: C.ink, margin: 0, }}
        >
          {s.titre}
        </h3>
      </div>
      <div className="i331-srow-desc">
        <p
          style={{ fontFamily: SANS, fontSize: 14.5, lineHeight: 1.78, color: C.textMuted, maxWidth: 500, margin: 0, fontWeight: 300, }}
        >
          {s.desc}
        </p>
        <span
          style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 14, fontFamily: SANS, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent, opacity: h ? 1 : 0, transform: h ? "translateX(0)" : "translateX(-8px)", transition: "all .5s cubic-bezier(0.16, 1, 0.3, 1)", }}
        >
          En boutique
          <ArrowRight size={13} style={{ transform: h ? "translateX(4px)" : "translateX(0)", transition: "transform .5s cubic-bezier(0.16, 1, 0.3, 1)" }} />
        </span>
      </div>
    </div>
  );
}

/** Ligne de tarif : table fine, pas de carte. */
function PriceRow({ t, n }: { t: { a: string; p: string; n: string }; n: number }) {
  const [h, setH] = useState(false);
  return (
    <div
      className="i331-prow" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ borderTop: `1px solid ${C.border}`, borderLeft: `2px solid ${h ? C.accent : "transparent"}`, background: h ? C.white : "transparent", transform: h ? "translateY(-2px)" : "none", boxShadow: h ? "0 18px 38px -26px rgba(10,31,37,0.4), inset 0 0 0 1px rgba(14,116,144,0.08)" : "none", transition: "all .48s cubic-bezier(0.16, 1, 0.3, 1)", }}
    >
      <span
        style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.24em", color: C.textFaint, fontVariantNumeric: "tabular-nums", }}
      >
        {String(n + 1).padStart(2, "0")}
      </span>
      <div style={{ minWidth: 0 }}>
        <div
          style={{ fontFamily: SERIF, fontSize: "clamp(17px, 1.7vw, 21px)", color: C.ink, lineHeight: 1.25, }}
        >
          {t.a}
        </div>
        <div
          style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 300, color: C.textMuted, lineHeight: 1.7, marginTop: 6, maxWidth: 480, }}
        >
          {t.n}
        </div>
      </div>
      <div
        style={{ fontFamily: SERIF, fontSize: "clamp(18px, 1.9vw, 24px)", fontStyle: "italic", color: C.accentDark, whiteSpace: "nowrap", textAlign: "right", }}
      >
        {t.p}
      </div>
    </div>
  );
}

/** Photo à repli : sans image le cadre reste dessiné, jamais vide. */
function Cadre({
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
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ margin: 0, border: `1px solid ${h ? C.accent : C.border}`, background: C.bgDark, transform: h ? "translateY(-4px)" : "none", boxShadow: h ? "0 26px 50px -30px rgba(7,38,46,0.6), 0 1px 0 0 rgba(255,255,255,0.5)" : "none", transition: "all .5s cubic-bezier(0.16, 1, 0.3, 1)", }}
    >
      <div
        style={{ aspectRatio: ratio, position: "relative", overflow: "hidden", background: `radial-gradient(120% 90% at 30% 20%, ${C.accentDark} 0%, ${C.bgDark} 62%, ${C.bgDarkAlt} 100%)`, }}
      >
        {/* repli dessiné : la monture au trait sur l'aplat sombre */}
        <div
          style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", pointerEvents: "none", }}
        >
          <MontureSVG size={190} stroke={C.verre} opacity={0.35} />
        </div>
        {src ? (
          <img
            src={src} alt={alt} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", transform: h ? "scale(1.04)" : "scale(1)", transition: "transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)", }}
          />
        ) : null}
      </div>
      <figcaption
        style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.textMuted, background: C.white, padding: "13px 16px", borderTop: `1px solid ${C.border}`, }}
      >
        {legende}
      </figcaption>
    </figure>
  );
}

/* ── Repli photo : le client d'abord, le thème ensuite ───────────────────── */
function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ════════════════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════════════════ */
export default function RegardNordPage() {
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

  /* Affectations AVANT tout appel de helper. */
  fd = session?.formData;
  c = session?.generatedContent;
  bp = session?.businessProfile;
  sessionData = session;
  FOCALES = FOCALES_LIVE();
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
  const METHODE = resolveList(clientMethode(sessionData)?.map((e: any, i: number) => ({ ...METHODE_SOURCE[i % METHODE_SOURCE.length], ...e })), METHODE_SOURCE);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const marque = fd?.businessName ?? clientName(sessionData) ?? "Regard Nord";
  const ville = clientCity(sessionData) ?? "Lille";
  const metier = clientTrade(sessionData) ?? "Opticiens";
  const tel = clientPhone(sessionData) ?? "03 20 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? "+33320000000").replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? "bonjour@regard-nord.fr";
  const adresse = clientAddress(sessionData);

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip" }}>
      <style>{`${FONTS_CSS}

        /* ── grilles pilotées ici, jamais en style inline ──────────────── */
        .i331-hero {
          display: grid;
          grid-template-columns: minmax(0, 1.02fr) minmax(0, 0.98fr);
          gap: clamp(28px, 4vw, 64px);
          align-items: start;
          max-width: 1280px;
          margin: 0 auto;
          padding: clamp(126px, 15vh, 168px) clamp(22px, 5vw, 68px) clamp(56px, 8vw, 96px);
          position: relative;
        }
        .i331-h1 { position: relative; z-index: 4; margin-right: -22%; }
        .i331-panel { position: relative; margin-top: clamp(40px, 7vw, 96px); }

        .i331-focales {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(14px, 2vw, 28px);
          margin-top: clamp(34px, 4.5vw, 52px);
        }

        .i331-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          max-width: 1180px;
          margin: 0 auto;
        }

        .i331-srow {
          display: grid;
          grid-template-columns: minmax(0, 92px) minmax(0, 1fr) minmax(0, 1.35fr);
          gap: clamp(14px, 2.4vw, 40px);
          padding: clamp(26px, 3.2vw, 42px) clamp(12px, 1.6vw, 24px);
          align-items: start;
        }
        .i331-srow-decale { padding-left: clamp(12px, 5vw, 86px); }

        .i331-vitrine {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
          gap: clamp(16px, 2vw, 26px);
        }

        .i331-methode {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr));
          gap: 0;
        }

        .i331-split {
          display: grid;
          grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
          gap: clamp(30px, 5vw, 78px);
          align-items: center;
          max-width: 1120px;
          margin: 0 auto;
        }

        .i331-prow {
          display: grid;
          grid-template-columns: minmax(0, 44px) minmax(0, 1fr) minmax(0, 190px);
          gap: clamp(12px, 2vw, 28px);
          align-items: baseline;
          padding: clamp(20px, 2.4vw, 30px) clamp(10px, 1.6vw, 22px);
        }

        .i331-avis {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(290px, 100%), 1fr));
          gap: clamp(16px, 2.2vw, 28px);
          align-items: start;
        }

        .i331-pied {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr);
          gap: clamp(24px, 4vw, 56px);
        }

        /* ── points de rupture ─────────────────────────────────────────── */
        @media (max-width: 980px) {
          #i331-nav { display: none !important; }
          .i331-burger { display: flex !important; }
          .i331-hero { grid-template-columns: 1fr; }
          .i331-h1 { margin-right: 0; }
          .i331-panel { margin-top: 8px; }
          .i331-split { grid-template-columns: 1fr; }
          .i331-pied { grid-template-columns: 1fr 1fr; }
          .i331-avis-decale { transform: none !important; }
        }
        @media (max-width: 860px) {
          .i331-srow {
            grid-template-columns: minmax(0, 62px) minmax(0, 1fr);
            row-gap: 12px;
          }
          .i331-srow-desc { grid-column: 1 / -1; }
          .i331-srow-decale { padding-left: clamp(12px, 1.6vw, 24px); order: initial; }
          .i331-focales { grid-template-columns: 1fr; }
          .i331-stats { grid-template-columns: 1fr 1fr; }
          .i331-prow {
            grid-template-columns: minmax(0, 36px) minmax(0, 1fr);
            row-gap: 10px;
          }
          .i331-prow > :last-child { grid-column: 2 / -1; text-align: left; }
          .i331-pied { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .i331-srow, .i331-prow { transition: none !important; }
        }
      `}</style>

      {/* ══ NAV ══════════════════════════════════════════════════════════ */}
      <nav
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: scrolled ? "10px clamp(18px, 5vw, 56px)" : "22px clamp(18px, 5vw, 56px)", background: scrolled ? "rgba(245,248,249,0.92)" : "transparent", backdropFilter: scrolled ? "blur(14px) saturate(135%)" : "none", WebkitBackdropFilter: scrolled ? "blur(14px) saturate(135%)" : "none", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "padding .55s cubic-bezier(0.16, 1, 0.3, 1), background .55s cubic-bezier(0.16, 1, 0.3, 1), border-color .55s cubic-bezier(0.16, 1, 0.3, 1), backdrop-filter .55s cubic-bezier(0.16, 1, 0.3, 1)", }}
      >
        <a href="#haut" style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0, textDecoration: "none" }}>
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64} alt={marque} style={{ height: 32, maxWidth: 168, objectFit: "contain", display: "block" }}
            />
          ) : (
            <>
              <Glasses size={19} color={C.accent} style={{ flexShrink: 0 }} />
              <span
                style={{ fontFamily: SERIF, fontSize: 20, letterSpacing: "-0.01em", color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", }}
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

        <div id="i331-nav" style={{ display: "flex", gap: "clamp(16px, 2vw, 30px)", alignItems: "center" }}>
          {NAV.map((n) => (
            <NavLink key={n.l} label={n.l} href={n.h} />
          ))}
          <motion.a
            href={telHref} whileHover={{ y: -2 }} transition={{ duration: 0.45, ease: EASE }} style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, background: C.accent, color: C.white, padding: "13px 24px", textDecoration: "none", whiteSpace: "nowrap", }}
          >
            Prendre rendez-vous
          </motion.a>
        </div>

        <button
          className="i331-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44, }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "transform .35s cubic-bezier(0.16, 1, 0.3, 1)", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "opacity .3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "transform .35s cubic-bezier(0.16, 1, 0.3, 1)", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>

      {mobileOpen && (
        <div
          style={{ position: "fixed", top: 60, left: 0, right: 0, zIndex: 99, background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "18px clamp(20px, 6vw, 32px) 26px", display: "flex", flexDirection: "column", gap: 2, }}
        >
          {NAV.map((n) => (
            <a
              key={n.l} href={n.h} onClick={() => setMobileOpen(false)} style={{ fontFamily: SANS, fontSize: 15, letterSpacing: "0.06em", color: C.ink, textDecoration: "none", padding: "13px 0", borderBottom: `1px solid ${C.border}`, }}
            >
              {n.l}
            </a>
          ))}
          <a
            href={telHref} style={{ marginTop: 14, background: C.accent, color: C.white, textAlign: "center", padding: "15px 22px", fontFamily: SANS, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, textDecoration: "none", }}
          >
            Prendre rendez-vous
          </a>
        </div>
      )}

      {/* ══ HERO — H4 éditorial décalé ═══════════════════════════════════ */}
      <section id="haut" className="i331-hero">
        {/* glow radial très faible, seule texture du fond */}
        <div
          aria-hidden style={{ position: "absolute", top: "-10%", right: "-6%", width: "min(760px, 82vw)", height: "min(760px, 82vw)", background: `radial-gradient(circle, ${C.accentLight} 0%, rgba(213,233,238,0) 66%)`, opacity: 0.85, pointerEvents: "none", }}
        />
        <Ghost style={{ top: "clamp(80px, 12vh, 150px)", left: "clamp(-14px, -1vw, 0px)", fontSize: "clamp(150px, 24vw, 320px)", opacity: 0.045 }}>
          01
        </Ghost>

        <div style={{ position: "relative", zIndex: 3 }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}
          >
            <Kicker>{clientEyebrow(sessionData) ?? `${metier} · ${ville} centre`}</Kicker>
          </motion.div>

          <motion.h1
            className="i331-h1" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.95, ease: EASE, delay: 0.16 }} style={{ fontFamily: SERIF, fontSize: "clamp(40px, 6.6vw, 84px)", fontWeight: 500, lineHeight: 0.98, letterSpacing: "-0.028em", color: C.ink, margin: "clamp(20px, 2.6vw, 32px) 0 0", overflowWrap: "break-word", }}
          >
            {/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ?? (
              <>
                {clientHeroLine(sessionData, 0, 2, 15) ?? "Une monture qui vous va,"}
                <br />
                <em style={{ fontStyle: "italic", fontWeight: 400, color: C.accentDark }}>
                  {clientHeroLine(sessionData, 1, 2, 15) ?? "pas une monture qui se vend."}
                </em>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease: EASE, delay: 0.3 }} style={{ fontFamily: SANS, fontSize: "clamp(15px, 1.25vw, 17px)", fontWeight: 300, lineHeight: 1.78, color: C.textMuted, maxWidth: 490, margin: "clamp(22px, 2.6vw, 32px) 0 clamp(26px, 3vw, 36px)", }}
          >
            {clientHeroSubtitle(sessionData) ??
              c?.heroSubline ??
              "Examen de vue sur place, 300 montures choisies une à une, verres français montés à l'atelier. Le 100 % Santé sans reste à charge, et le conseil en plus."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.42 }} style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}
          >
            <motion.a
              href={telHref} whileHover={{ y: -3 }} transition={{ duration: 0.45, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.accent, color: C.white, fontFamily: SANS, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, padding: "17px 32px", textDecoration: "none", boxShadow: "0 18px 36px -22px rgba(14,116,144,0.85)", }}
            >
              Prendre rendez-vous <ArrowRight size={15} />
            </motion.a>
            <motion.a
              href="#services" whileHover={{ y: -3 }} transition={{ duration: 0.45, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "transparent", color: C.ink, border: `1px solid ${C.border}`, fontFamily: SANS, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500, padding: "16px 28px", textDecoration: "none", }}
            >
              Nos services
            </motion.a>
          </motion.div>

          {/* Le sommaire des trois spécialités : ce que portait le carrousel. */}
          <div className="i331-focales">
            {FOCALES.map((f, idx) => (
              <Reveal key={f.k} delay={0.5 + idx * 0.055} y={18}>
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                  <div
                    style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.26em", textTransform: "uppercase", color: C.accentDark, marginBottom: 8, }}
                  >
                    {String(idx + 1).padStart(2, "0")} · {f.k}
                  </div>
                  <div
                    style={{ fontFamily: SERIF, fontSize: "clamp(15px, 1.35vw, 18px)", lineHeight: 1.34, color: C.ink, marginBottom: 7, }}
                  >
                    {f.line}
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: 12.5, fontWeight: 300, color: C.textMuted, lineHeight: 1.65 }}>
                    {f.sub}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Le panneau que le titre chevauche. */}
        <div className="i331-panel">
          <motion.div
            initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.05, ease: EASE, delay: 0.24 }} style={{ position: "relative", background: C.white, border: `1px solid ${C.border}`, boxShadow: "0 40px 80px -50px rgba(10,31,37,0.5)", }}
          >
            {/* zone de chevauchement : le titre y atterrit, rien d'autre */}
            <div
              style={{ height: "clamp(64px, 9vw, 126px)", background: C.bgAlt, borderBottom: `1px solid ${C.border}`, }}
            />

            {/* ── GESTE SIGNATURE : la monture pivote au défilement ───────── */}
            {/*
              La boîte est plus haute que la monture, et la monture y est
              centrée : ScrollSpin mesure sa propre hauteur pour établir la
              course du défilement. Une boîte à la taille du dessin aurait fait
              tourner la monture en une centaine de pixels — le geste aurait été
              vrai mais invisible. transformOrigin reste au centre, donc la
              monture pivote sur elle-même et non en orbite.
            */}
            <ScrollSpin
              degrees={38} style={{ position: "absolute", top: "clamp(-70px, -6vw, -30px)", right: "clamp(-18px, -1.4vw, 0px)", width: 250, height: 320, display: "grid", placeItems: "center", zIndex: 5, pointerEvents: "none", }}
            >
              <MontureSVG size={230} stroke={C.accent} />
            </ScrollSpin>

            <div style={{ position: "relative", aspectRatio: "4 / 3", overflow: "hidden", background: `linear-gradient(155deg, ${C.bgDark} 0%, ${C.bgDarkAlt} 100%)` }}>
              <div aria-hidden style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                <MontureSVG size={230} stroke={C.verre} opacity={0.32} />
              </div>
              <img
                src={photo(0, FOCALES_SOURCE[0].img)} alt={FOCALES[0]?.alt ?? "Conseil monture à la boutique"} loading="eager" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", }}
              />
              {/* scrim à trois arrêts : le bas du cadre porte la légende */}
              <div
                aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(7,38,46,0.06) 0%, rgba(7,38,46,0.02) 46%, rgba(7,38,46,0.55) 100%)", }}
              />
            </div>

            <div style={{ padding: "clamp(18px, 2.2vw, 26px)", borderTop: `2px solid ${C.accent}` }}>
              <div
                style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.accentDark, marginBottom: 9, }}
              >
                En vitrine cette semaine
              </div>
              <div style={{ fontFamily: SERIF, fontSize: "clamp(17px, 1.6vw, 21px)", lineHeight: 1.32, color: C.ink }}>
                {FOCALES[0]?.line ?? FOCALES_SOURCE[0].line}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ RESPIRATION ══════════════════════════════════════════════════ */}
      <section
        style={{ padding: "clamp(56px, 9vw, 116px) clamp(22px, 6vw, 68px)", background: C.bg, borderTop: `1px solid ${C.border}`, textAlign: "center", }}
      >
        <Reveal>
          <p
            style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(21px, 2.9vw, 36px)", lineHeight: 1.42, letterSpacing: "-0.012em", color: C.ink, maxWidth: 760, margin: "0 auto", }}
          >
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (
              <>
                La monture vient après le mode de vie,{" "}
                <span style={{ color: C.accentDark }}>pas l'inverse.</span>
              </>
            )}
          </p>
        </Reveal>
      </section>

      {/* ══ CHIFFRES ═════════════════════════════════════════════════════ */}
      <section style={{ background: C.bgDark, position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden style={{ position: "absolute", inset: 0, background: `radial-gradient(90% 140% at 18% 0%, rgba(169,214,220,0.11) 0%, rgba(169,214,220,0) 62%)`, pointerEvents: "none", }}
        />
        <div className="i331-stats" style={{ position: "relative", padding: "0 clamp(16px, 4vw, 40px)" }}>
          {STATS.map((s, idx) => (
            <Reveal key={`${s.label}-${idx}`} delay={idx * 0.06} y={18}>
              <div
                style={{ position: "relative", padding: "clamp(30px, 4vw, 46px) clamp(10px, 1.6vw, 20px)", borderRight: idx < STATS.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none", overflow: "hidden", }}
              >
                <Ghost style={{ top: "6%", left: "4%", fontSize: "clamp(60px, 8vw, 104px)", color: C.white, opacity: 0.05 }}>
                  {String(idx + 1).padStart(2, "0")}
                </Ghost>
                <div
                  style={{ position: "relative", fontFamily: SERIF, fontSize: "clamp(30px, 3.6vw, 46px)", lineHeight: 1, letterSpacing: "-0.02em", color: C.verre, }}
                >
                  {s.value}
                </div>
                <div
                  style={{ position: "relative", fontFamily: SANS, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginTop: 11, lineHeight: 1.6, }}
                >
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ SERVICES — rangées éditoriales numérotées ════════════════════ */}
      <section
        id="services" style={{ padding: "clamp(64px, 10vw, 130px) clamp(22px, 6vw, 68px)", background: C.bg, position: "relative", }}
      >
        <div style={{ maxWidth: 1220, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(30px, 4vw, 54px)", maxWidth: 720 }}>
              <Kicker>Nos services</Kicker>
              <h2
                style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4.4vw, 56px)", fontWeight: 500, lineHeight: 1.06, letterSpacing: "-0.022em", color: C.ink, margin: "clamp(16px, 2vw, 24px) 0 0", }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                  <>
                    Tout ce qu'un opticien
                    <br />
                    <em style={{ fontStyle: "italic", fontWeight: 400, color: C.accentDark }}>doit savoir faire.</em>
                  </>
                )}
              </h2>
            </div>
          </Reveal>

          <div style={{ borderBottom: `1px solid ${C.border}` }}>
            {SERVICES.map((s, idx) => (
              <Reveal key={`${s.titre}-${idx}`} delay={Math.min(idx, 4) * 0.055} y={22}>
                <ServiceRow s={s} n={idx} decale={idx % 2 === 1} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ LA BOUTIQUE — vitrine photographique ═════════════════════════ */}
      <section
        id="boutique" style={{ padding: "clamp(62px, 9vw, 118px) clamp(22px, 6vw, 68px)", background: C.bgAlt, borderTop: `1px solid ${C.border}`, }}
      >
        <div style={{ maxWidth: 1220, margin: "0 auto" }}>
          <Reveal>
            <div
              style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-end", justifyContent: "space-between", marginBottom: "clamp(26px, 3.4vw, 44px)", }}
            >
              <div style={{ maxWidth: 640 }}>
                <Kicker>La boutique</Kicker>
                <h2
                  style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3.9vw, 48px)", fontWeight: 500, lineHeight: 1.06, letterSpacing: "-0.02em", color: C.ink, margin: "clamp(14px, 1.8vw, 22px) 0 0", }}
                >
                  {/* TEXTE_SECTION */ clientText(sessionData, "boutique.titre") ?? (
                    <>
                      Trois cents montures,
                      <br />
                      <em style={{ fontStyle: "italic", fontWeight: 400, color: C.accentDark }}>une seule à votre visage.</em>
                    </>
                  )}
                </h2>
              </div>
              <p
                style={{ fontFamily: SANS, fontSize: 14.5, fontWeight: 300, lineHeight: 1.78, color: C.textMuted, maxWidth: 430, margin: 0, }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "boutique.texte") ??
                  "Salle d'examen, atelier de montage et présentoirs sont dans la même pièce : ce que l'on vous conseille, on le monte nous-mêmes."}
              </p>
            </div>
          </Reveal>

          <div className="i331-vitrine">
            {[
              { i: 1, alt: FOCALES_SOURCE[1].alt, repli: FOCALES_SOURCE[1].img, legende: "Salle d'examen de vue" },
              { i: 2, alt: FOCALES_SOURCE[2].alt, repli: FOCALES_SOURCE[2].img, legende: "Présentoir de montures solaires" },
              { i: 3, alt: "Atelier de montage des verres", repli: "", legende: "Atelier de montage" },
            ].map((v, idx) => (
              <Reveal key={v.legende} delay={idx * 0.075} y={26}>
                <Cadre src={photo(v.i, v.repli)} alt={v.alt} legende={v.legende} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MÉTHODE — quatre temps filetés ═══════════════════════════════ */}
      <section
        id="methode" style={{ padding: "clamp(64px, 10vw, 128px) clamp(22px, 6vw, 68px)", background: C.bg, position: "relative", }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(28px, 3.6vw, 50px)", maxWidth: 680 }}>
              <Kicker>La méthode</Kicker>
              <h2
                style={{ fontFamily: SERIF, fontSize: "clamp(28px, 4.1vw, 50px)", fontWeight: 500, lineHeight: 1.06, letterSpacing: "-0.022em", color: C.ink, margin: "clamp(14px, 1.8vw, 22px) 0 0", }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                  <>
                    Quatre étapes,
                    <br />
                    <em style={{ fontStyle: "italic", fontWeight: 400, color: C.accentDark }}>zéro pression.</em>
                  </>
                )}
              </h2>
            </div>
          </Reveal>

          {/* filet dégradé 1 px : la ligne du parcours */}
          <div
            aria-hidden style={{ height: 1, background: `linear-gradient(to right, ${C.accent} 0%, ${C.border} 55%, rgba(210,226,230,0) 100%)`, marginBottom: 0, }}
          />
          <div className="i331-methode">
            {METHODE.map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.07} y={22}>
                <div
                  style={{ position: "relative", padding: "clamp(26px, 3vw, 38px) clamp(16px, 2vw, 28px) clamp(28px, 3.4vw, 42px)", borderRight: `1px solid ${C.border}`, height: "100%", overflow: "hidden", }}
                >
                  <Ghost style={{ bottom: "-10px", right: "6px", fontSize: "clamp(72px, 8vw, 118px)" }}>{m.n}</Ghost>
                  <div
                    style={{ width: 9, height: 9, borderRadius: "50%", background: C.accent, marginTop: -4, marginBottom: 20, boxShadow: `0 0 0 5px ${C.bg}`, }}
                  />
                  <div
                    style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.accentDark, marginBottom: 12, }}
                  >
                    Étape {m.n}
                  </div>
                  <h3
                    style={{ position: "relative", fontFamily: SERIF, fontSize: "clamp(19px, 1.9vw, 24px)", fontWeight: 500, lineHeight: 1.18, color: C.ink, margin: "0 0 11px", }}
                  >
                    {m.t}
                  </h3>
                  <p
                    style={{ position: "relative", fontFamily: SANS, fontSize: 13.8, fontWeight: 300, lineHeight: 1.76, color: C.textMuted, margin: 0, }}
                  >
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
        id="engagements" style={{ padding: "clamp(64px, 10vw, 130px) clamp(22px, 6vw, 68px)", background: C.bgAlt, borderTop: `1px solid ${C.border}`, }}
      >
        <div className="i331-split">
          <Reveal>
            <div
              style={{ position: "relative", border: `1px solid ${C.border}`, background: `linear-gradient(160deg, ${C.white} 0%, ${C.accentLight} 100%)`, aspectRatio: "4 / 3", display: "grid", placeItems: "center", overflow: "hidden", }}
            >
              <Ghost style={{ top: "8%", left: "6%", fontSize: "clamp(96px, 13vw, 190px)", opacity: 0.07 }}>0 €</Ghost>
              <MontureSVG size={250} stroke={C.accentDark} opacity={0.9} />
              <div
                style={{ position: "absolute", left: 0, bottom: 0, right: 0, padding: "16px 20px", borderTop: `1px solid ${C.border}`, background: "rgba(255,255,255,0.86)", fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: C.accentDark, }}
              >
                Panier moyen affiché en vitrine
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div>
              <Kicker>Nos engagements</Kicker>
              <h2
                style={{ fontFamily: SERIF, fontSize: "clamp(27px, 3.6vw, 44px)", fontWeight: 500, lineHeight: 1.08, letterSpacing: "-0.02em", color: C.ink, margin: "clamp(14px, 1.8vw, 22px) 0 clamp(22px, 2.6vw, 32px)", }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>
                    Le prix juste,
                    <br />
                    <em style={{ fontStyle: "italic", fontWeight: 400, color: C.accentDark }}>écrit avant l'essayage.</em>
                  </>
                )}
              </h2>
              <div>
                {ENGAGEMENT.map((e: string, idx: number) => (
                  <div
                    key={idx} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "15px 0", borderTop: idx === 0 ? `1px solid ${C.border}` : "none", borderBottom: `1px solid ${C.border}`, }}
                  >
                    <Check size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 4 }} />
                    <span
                      style={{ fontFamily: SANS, fontSize: 14.5, fontWeight: 300, lineHeight: 1.72, color: C.textMuted, }}
                    >
                      {e}
                    </span>
                  </div>
                ))}
              </div>
              <motion.a
                href={telHref} whileHover={{ y: -3 }} transition={{ duration: 0.45, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: "clamp(22px, 2.6vw, 32px)", background: C.accent, color: C.white, fontFamily: SANS, fontSize: 11.5, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, padding: "16px 30px", textDecoration: "none", }}
              >
                Nous appeler <ArrowRight size={15} />
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ TARIFS — table fine ══════════════════════════════════════════ */}
      <section
        id="tarifs" style={{ padding: "clamp(64px, 10vw, 130px) clamp(22px, 6vw, 68px)", background: C.bg, position: "relative", }}
      >
        <div style={{ maxWidth: 1020, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "clamp(28px, 3.6vw, 48px)" }}>
              <Kicker align="center">Tarifs</Kicker>
              <h2
                style={{ fontFamily: SERIF, fontSize: "clamp(29px, 4vw, 50px)", fontWeight: 500, lineHeight: 1.06, letterSpacing: "-0.022em", color: C.ink, margin: "clamp(14px, 1.8vw, 22px) 0 0", }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                  <>
                    Des prix <em style={{ fontStyle: "italic", fontWeight: 400, color: C.accentDark }}>annoncés.</em>
                  </>
                )}
              </h2>
              <p
                style={{ fontFamily: SANS, fontSize: 14.5, fontWeight: 300, lineHeight: 1.76, color: C.textMuted, maxWidth: 560, margin: "16px auto 0", }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.texte") ??
                  "Le devis normalisé distingue toujours l'offre 100 % Santé (classe A, sans reste à charge) et l'offre libre (classe B)."}
              </p>
            </div>
          </Reveal>

          <div style={{ borderBottom: `1px solid ${C.border}` }}>
            {TARIFS.map((t: any, idx: number) => (
              <Reveal key={`${t.a}-${idx}`} delay={Math.min(idx, 4) * 0.055} y={18}>
                <PriceRow t={t} n={idx} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <p
              style={{ fontFamily: SANS, fontSize: 12, fontWeight: 300, letterSpacing: "0.02em", color: C.textFaint, textAlign: "center", marginTop: 22, lineHeight: 1.7, }}
            >
              Tiers payant Sécurité sociale et mutuelles appliqué directement en caisse.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══ AVIS — colonnes décalées ═════════════════════════════════════ */}
      <section
        style={{ padding: "clamp(64px, 10vw, 132px) clamp(22px, 6vw, 68px)", background: C.bgDark, position: "relative", overflow: "hidden", }}
      >
        <div
          aria-hidden style={{ position: "absolute", inset: 0, background: `radial-gradient(80% 100% at 76% 8%, rgba(169,214,220,0.12) 0%, rgba(169,214,220,0) 60%)`, pointerEvents: "none", }}
        />
        <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "clamp(32px, 4vw, 56px)" }}>
              <Kicker align="center" color={C.verre}>
                Ils reviennent
              </Kicker>
              <h2
                style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3.8vw, 46px)", fontWeight: 500, lineHeight: 1.08, letterSpacing: "-0.02em", color: C.white, margin: "clamp(14px, 1.8vw, 22px) 0 0", }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                  <>
                    Ils voient <em style={{ fontStyle: "italic", fontWeight: 400, color: C.verre }}>la différence</em>.
                  </>
                )}
              </h2>
            </div>
          </Reveal>

          <div className="i331-avis">
            {AVIS.map((a: any, idx: number) => (
              <Reveal key={`${a.auteur}-${idx}`} delay={idx * 0.09} y={26}>
                <div
                  className="i331-avis-decale" style={{ position: "relative", padding: "clamp(24px, 3vw, 34px) clamp(20px, 2.4vw, 30px)", border: "1px solid rgba(255,255,255,0.10)", borderTop: `2px solid ${C.verre}`, background: "rgba(255,255,255,0.035)", transform: `translateY(${idx % 3 === 1 ? 34 : idx % 3 === 2 ? 17 : 0}px)`, height: "100%", overflow: "hidden", }}
                >
                  <span
                    aria-hidden style={{ position: "absolute", top: -18, right: 12, fontFamily: SERIF, fontSize: 120, lineHeight: 1, color: C.white, opacity: 0.06, pointerEvents: "none", }}
                  >
                    &rdquo;
                  </span>
                  <p
                    style={{ position: "relative", fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(15.5px, 1.4vw, 18px)", lineHeight: 1.68, color: "rgba(255,255,255,0.86)", margin: "0 0 22px", }}
                  >
                    {a.texte}
                  </p>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.10)", paddingTop: 15 }}>
                    <div
                      style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, letterSpacing: "0.04em", color: C.white, }}
                    >
                      {a.auteur}
                    </div>
                    <div
                      style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: C.verre, marginTop: 6, }}
                    >
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
        id="contact" style={{ padding: "clamp(66px, 10vw, 134px) clamp(22px, 6vw, 68px)", background: C.accentLight, textAlign: "center", position: "relative", overflow: "hidden", }}
      >
        <Ghost style={{ top: "-6%", left: "50%", transform: "translateX(-50%)", fontSize: "clamp(140px, 20vw, 300px)", opacity: 0.06 }}>
          VUE
        </Ghost>
        <div style={{ position: "relative", maxWidth: 760, margin: "0 auto" }}>
          <Reveal>
            <Kicker align="center">À votre vue</Kicker>
            <h2
              style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4.4vw, 54px)", fontWeight: 500, lineHeight: 1.05, letterSpacing: "-0.024em", color: C.ink, margin: "clamp(16px, 2vw, 24px) 0 clamp(14px, 1.8vw, 20px)", }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                <>
                  Passez la porte,
                  <br />
                  <em style={{ fontStyle: "italic", fontWeight: 400, color: C.accentDark }}>repartez avec un avis franc.</em>
                </>
              )}
            </h2>
            <p
              style={{ fontFamily: SANS, fontSize: "clamp(14.5px, 1.2vw, 16px)", fontWeight: 300, lineHeight: 1.78, color: C.textMuted, maxWidth: 470, margin: "0 auto clamp(28px, 3.4vw, 40px)", }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ??
                "Avec ou sans ordonnance, avec ou sans rendez-vous. L'examen de vue se réserve, l'essayage jamais."}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <motion.a
                href={telHref} whileHover={{ y: -3 }} transition={{ duration: 0.45, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.accent, color: C.white, fontFamily: SANS, fontSize: 13, letterSpacing: "0.1em", fontWeight: 600, padding: "18px 34px", textDecoration: "none", boxShadow: "0 20px 40px -24px rgba(14,116,144,0.9)", }}
              >
                <Phone size={17} /> {tel}
              </motion.a>
              <motion.a
                href={`mailto:${mail}`} whileHover={{ y: -3 }} transition={{ duration: 0.45, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "transparent", color: C.ink, border: `1px solid ${C.accentDark}`, fontFamily: SANS, fontSize: 13, letterSpacing: "0.1em", fontWeight: 600, padding: "17px 30px", textDecoration: "none", }}
              >
                <Mail size={17} /> Nous écrire
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════════════ */}
      <footer
        style={{ background: C.bgDarkAlt, padding: "clamp(44px, 6vw, 72px) clamp(22px, 6vw, 68px) clamp(22px, 3vw, 30px)", }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div className="i331-pied" style={{ marginBottom: "clamp(28px, 4vw, 46px)" }}>
            <div>
              <div style={{ fontFamily: SERIF, fontSize: 22, color: C.verre, marginBottom: 12 }}>{marque}</div>
              <p
                style={{ fontFamily: SANS, fontSize: 13, fontWeight: 300, lineHeight: 1.8, color: "rgba(255,255,255,0.42)", maxWidth: 340, margin: 0, }}
              >
                Opticiens diplômés BTS OL · {ville} centre
                <br />
                Agréés toutes mutuelles, tiers payant
              </p>
            </div>

            <div>
              <div
                style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.32)", marginBottom: 14, }}
              >
                Nous trouver
              </div>
              {[
                { icon: <MapPin size={13} />, t: adresse ?? clientCodePostalVille(sessionData, "59000", "Lille") },
                { icon: <Phone size={13} />, t: tel },
                { icon: <Mail size={13} />, t: mail },
              ].map((it, idx) => (
                <div
                  key={idx} style={{ display: "flex", gap: 10, alignItems: "center", fontFamily: SANS, fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.5)", marginBottom: 9, }}
                >
                  <span style={{ color: C.verre, display: "flex" }}>{it.icon}</span>
                  {it.t}
                </div>
              ))}
            </div>

            <div>
              <div
                style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.32)", marginBottom: 14, }}
              >
                Sections
              </div>
              {NAV.map((n) => (
                <a
                  key={n.l} href={n.h} style={{ display: "block", fontFamily: SANS, fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 9, }}
                >
                  {n.l}
                </a>
              ))}
            </div>
          </div>

          <div
            style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, }}
          >
            <span style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 300, color: "rgba(255,255,255,0.28)" }}>
              © 2026 {marque} — Site réalisé par Aevia WS · SIREN{" "}
              <LegalIdentity fallback="852 546 225" kind="siren" />
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
