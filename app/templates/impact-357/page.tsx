"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Clock, FlaskConical, Mail, MapPin, Phone } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, HairlineArrows, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
import { TrackingCollapse } from "@/lib/templates/hero-kit-3";
import {
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

/* ════════════════════════════════════════════════════════════════════════════
   {clientName(sessionData) ?? "Axis Bio"} — Laboratoire de biologie médicale · Metz

   Geste signature : TrackingCollapse. Le dernier mot du titre arrive très
   espacé puis se resserre — un résultat qui se précise sous les yeux. Un seul
   index pilote le mot, la fraction, la ligne d'appui et le chiffre allumé du
   rail : rien d'autre ne bouge tout seul.

   Archétype H9 (double colonne + rail de chiffres vertical) · fontes P2
   (Playfair Display + Space Grotesk) · palette #f5f7fb / #4646b8.

   Dessin qui s'écarte du squelette : analyses en COLONNES FILETÉES, parcours
   en fiche à titre collant, tarifs en TABLE à en-tête, avis en COLONNES
   DÉCALÉES. Chiffres en tabular-nums partout — c'est un laboratoire.
   ════════════════════════════════════════════════════════════════════════════ */

const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');`;

const SERIF = "'Playfair Display', Georgia, serif";
const SANS = "'Space Grotesk', system-ui, -apple-system, 'Segoe UI', sans-serif";

/* Une seule courbe pour toute la page — reprise à l'identique en CSS. */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_CSS = "cubic-bezier(.16,1,.3,1)";

let C: Record<string, string> = {
  bg: "#f5f7fb",
  bgAlt: "#e9edf7",
  bgCard: "#ffffff",
  bgDark: "#141935",
  bgDarkAlt: "#0e1229",
  accent: "var(--brand, #4646b8)",
  accentDark: "var(--brand-light, #35358f)",
  accentLight: "#dfe2f7",
  ink: "#14172b",
  textMuted: "#565d78",
  textFaint: "#8d94ad",
  border: "#dadeec",
  white: "#ffffff",
  /* Clé métier : le violet clair du réactif, lisible sur les fonds sombres. */
  reactif: "#a9aef0",
};

const NAV = [
  { l: "Analyses", h: "#services" },
  { l: "Votre parcours", h: "#methode" },
  { l: "Prise en charge", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* ── Contenu rédactionnel du thème (conservé mot pour mot) ───────────────── */

const HERO_SOURCE = [
  { k: "Résultats du jour", word: "précis.", sub: "Bilan sanguin prélevé le matin, rendu avant 17 h." },
  { k: "Sans rendez-vous", word: "rapide.", sub: "Dès 7 h, à jeun servi d'abord — moins de 15 min d'attente en moyenne." },
  { k: "Accrédité COFRAC", word: "fiable.", sub: "ISO 15189 : chaque mesure tracée, chaque automate contrôlé." },
];
let HERO = HERO_SOURCE;

const SERVICES_SOURCE = [
  { titre: "Biologie de routine", desc: "NFS, glycémie, cholestérol, bilan hépatique et rénal : prélevés le matin, validés par un biologiste, en ligne le jour même.", tag: "Routine" },
  { titre: "Prélèvements à domicile", desc: "Infirmiers préleveurs du laboratoire en tournée chaque matin : mêmes tubes, même traçabilité, pour les patients qui ne se déplacent pas.", tag: "Domicile" },
  { titre: "Suivi de grossesse", desc: "Toxoplasmose, HT21, glycosurie : le calendrier complet suivi site par site, résultats transmis à votre sage-femme ou gynécologue.", tag: "Maternité" },
  { titre: "Microbiologie", desc: "ECBU, coprocultures, prélèvements de gorge : cultures et antibiogrammes rendus avec commentaires du biologiste.", tag: "Microbio" },
  { titre: "Dépistage IST", desc: "Sans ordonnance pour le VIH (et sur ordonnance pour le reste), en toute confidentialité. Résultats sécurisés, biologiste disponible.", tag: "Dépistage" },
  { titre: "Bilans entreprise & sport", desc: "Médecine du travail, licences sportives, check-up : conventions entreprises et créneaux dédiés du samedi.", tag: "Prévention" },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE_SOURCE = [
  { n: "01", t: "Venir, sans rendez-vous", d: "Dès 7 h en semaine. Patients à jeun servis en premier — le café d'après est mérité." },
  { n: "02", t: "Être prélevé par un pro", d: "Préleveurs diplômés, identitovigilance systématique : deux identifiants vérifiés, tubes étiquetés devant vous." },
  { n: "03", t: "Résultats sécurisés", d: "Serveur en ligne le jour même, envoi automatique à votre médecin. Rien ne part par mail simple." },
  { n: "04", t: "Un biologiste répond", d: "Résultat inhabituel ? Un biologiste médical vous rappelle et explique — c'est son métier, pas une option." },
];

const ENGAGEMENT_DEMO = [
  "Accréditation COFRAC ISO 15189 sur la totalité de l'activité — vérifiable en ligne",
  "Biologistes médicaux (pharmaciens et médecins) présents sur chaque site",
  "Identitovigilance systématique et traçabilité complète de chaque tube",
  "Urgences biologiques téléphonées au prescripteur dans l'heure, 6j/7",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

const TARIFS_SOURCE = [
  { a: "Bilan prescrit", p: "tiers payant", n: "Carte Vitale + mutuelle : vous ne payez rien au guichet." },
  { a: "Prélèvement à domicile", p: "pris en charge", n: "Sur prescription avec mention, dans la zone des tournées." },
  { a: "Dépistage VIH sans ordonnance", p: "pris en charge", n: "Dispositif national : confidentiel et sans frais." },
  { a: "Bilan sport / entreprise", p: "dès 35 €", n: "Hors nomenclature : tarif affiché avant le prélèvement." },
];
let TARIFS = TARIFS_SOURCE;

const AVIS_SOURCE = [
  { texte: "Prélevée à 7h10, résultats à 15h40, et un rappel du biologiste pour un point de vigilance transmis dans la foulée à mon médecin. Voilà à quoi sert un labo de quartier.", auteur: "Hélène J.", detail: "Bilan de routine" },
  { texte: "Le passage à domicile pour ma mère de 92 ans, chaque premier mardi : même préleveuse, mêmes gestes, zéro stress. Les résultats arrivent chez le médecin sans qu'on y pense.", auteur: "Fils de Mme W.", detail: "Prélèvements à domicile" },
  { texte: "Suivi de grossesse complet ici : le calendrier était géré pour moi, chaque examen expliqué. On se sent suivie, pas traitée à la chaîne.", auteur: "Manon D.", detail: "Suivi maternité" },
];
let AVIS_DEMO = AVIS_SOURCE;

const STATS_SOURCE = [
  { value: "< 15 min", label: "D'attente moyenne le matin" },
  { value: "17 h", label: "Résultats du jour en ligne" },
  { value: "COFRAC", label: "Accrédité ISO 15189" },
  { value: "4", label: "Biologistes médicaux" },
];
let STATS = STATS_SOURCE;

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

function Reveal({
  children,
  delay = 0,
  y = 28,
  style,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -8% 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.85, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Kicker : filet de 40×1 px puis capitales très espacées. */
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
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: align === "center" ? "center" : "flex-start" }}>
      <span aria-hidden style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${color})`, opacity: 0.9 }} />
      <span style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.34em", textTransform: "uppercase", color, fontWeight: 600 }}>{children}</span>
      {align === "center" && <span aria-hidden style={{ width: 40, height: 1, background: `linear-gradient(270deg, transparent, ${color})`, opacity: 0.9 }} />}
    </div>
  );
}

/** Chiffre fantôme : la texture sans image du thème. */
function Ghost({
  children,
  right = false,
  color = C.ink,
  opacity = 0.05,
  size = "clamp(200px, 26vw, 420px)",
  top = "-6%",
}: {
  children: React.ReactNode;
  right?: boolean;
  color?: string;
  opacity?: number;
  size?: string;
  top?: string;
}) {
  return (
    <span
      aria-hidden
      className="i357-ghost"
      style={{
        position: "absolute",
        top,
        [right ? "right" : "left"]: "-1%",
        fontFamily: SERIF,
        fontSize: size,
        lineHeight: 0.8,
        color,
        opacity,
        pointerEvents: "none",
        userSelect: "none",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {children}
    </span>
  );
}

/** Bouton : élévation + deux ombres + accent, sur 0,5 s. */
function Bouton({
  href,
  children,
  variant = "plein",
  large = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "plein" | "ligne";
  large?: boolean;
}) {
  const [h, setH] = useState(false);
  const plein = variant === "plein";
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      onFocus={() => setH(true)}
      onBlur={() => setH(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: large ? "16px 32px" : "14px 26px",
        minHeight: 44,
        fontFamily: SANS,
        fontSize: large ? 13.5 : 12.5,
        fontWeight: 600,
        letterSpacing: "0.04em",
        borderRadius: 2,
        textDecoration: "none",
        border: `1px solid ${plein ? "transparent" : h ? C.accent : C.border}`,
        background: plein ? (h ? C.accentDark : C.accent) : h ? C.white : "transparent",
        color: plein ? C.white : h ? C.accentDark : C.ink,
        transform: h ? "translateY(-2px)" : "translateY(0)",
        boxShadow: h
          ? `0 16px 32px -20px rgba(20,25,53,0.62), 0 2px 0 0 ${plein ? C.accentDark : C.accentLight}`
          : "0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0)",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      {children}
    </a>
  );
}

/** Lien de navigation : soulignement dont la largeur pousse. */
function NavLien({ label, href }: { label: string; href: string }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        position: "relative",
        fontFamily: SANS,
        fontSize: 12.5,
        fontWeight: 500,
        letterSpacing: "0.06em",
        color: h ? C.accentDark : C.textMuted,
        textDecoration: "none",
        padding: "12px 2px",
        transition: `color .45s ${EASE_CSS}`,
      }}
    >
      {label}
      <span aria-hidden style={{ position: "absolute", left: 0, bottom: 8, height: 1, width: h ? "100%" : "0%", background: C.accent, transition: `width .5s ${EASE_CSS}` }} />
    </a>
  );
}

/** Une analyse : colonne filetée, indice en chiffres tabulaires. */
function ColonneAnalyse({ s, n }: { s: any; n: number }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        position: "relative",
        height: "100%",
        padding: "clamp(22px, 2.6vw, 32px) clamp(16px, 2vw, 26px)",
        background: h ? C.white : "transparent",
        boxShadow: h
          ? "0 26px 48px -38px rgba(20,25,53,0.6), inset 0 2px 0 0 var(--brand, #4646b8)"
          : "0 0 0 0 rgba(0,0,0,0), inset 0 0 0 0 rgba(0,0,0,0)",
        transform: h ? "translateY(-3px)" : "translateY(0)",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
        <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, letterSpacing: "0.26em", textTransform: "uppercase", color: C.accentDark }}>{s.tag}</span>
        <span style={{ fontFamily: SANS, fontSize: 12, fontVariantNumeric: "tabular-nums", letterSpacing: "0.14em", color: C.textFaint }}>{String(n + 1).padStart(2, "0")}</span>
      </div>
      <h3 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(21px, 2.2vw, 26px)", lineHeight: 1.14, letterSpacing: "-0.012em", color: C.ink, margin: "0 0 12px" }}>{s.titre}</h3>
      <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 14.5, lineHeight: 1.76, color: C.textMuted, margin: 0 }}>{s.desc}</p>
    </div>
  );
}

/** Une ligne de la table des tarifs : en-tête au-dessus, colonnes alignées. */
function LigneTarif({ t, idx }: { t: any; idx: number }) {
  const [h, setH] = useState(false);
  return (
    <div
      className="i357-tarif"
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.25fr) minmax(0, 0.42fr)",
        gap: "clamp(12px, 2.2vw, 30px)",
        alignItems: "baseline",
        padding: "clamp(20px, 2.4vw, 28px) clamp(8px, 1.6vw, 20px)",
        borderTop: `1px solid ${C.border}`,
        background: h ? C.bgAlt : "transparent",
        boxShadow: h ? "inset 0 -1px 0 0 var(--brand, #4646b8)" : "inset 0 0 0 0 rgba(0,0,0,0)",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(18px, 2vw, 22px)", lineHeight: 1.24, color: C.ink }}>{t.a}</div>
      <div style={{ fontFamily: SANS, fontWeight: 300, fontSize: 14, lineHeight: 1.72, color: C.textMuted }}>{t.n}</div>
      <div style={{ fontFamily: SANS, fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: C.accentDark, textAlign: "right", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{t.p}</div>
    </div>
  );
}

function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ════════════════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════════════════ */

export default function AxisBioPage() {
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

  /*
    Le mot animé du héros ne peut pas porter une phrase : c'est le sous-titre de
    la première scène qui reçoit l'accroche du client. Et le mot final appartient
    au titre — sans lui, un plombier finissait la phrase d'un laboratoire. Sa
    prestation d'abord, sinon la seconde ligne de sa propre phrase, jamais celle
    de la démonstration.
  */
  HERO = clientTagline(sessionData)
    ? HERO_SOURCE.map((h, i) => ({
        ...h,
        ...(i === 0 ? { sub: clientTagline(sessionData)! } : {}),
        word: clientServices(sessionData)?.[i]?.title || clientHeroLine(sessionData, 1, 2, 18) || h.word,
      }))
    : HERO_SOURCE;

  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({ ...SERVICES_SOURCE[i % SERVICES_SOURCE.length], titre: s.title })),
    SERVICES_SOURCE,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({ ...AVIS_SOURCE[i % AVIS_SOURCE.length], auteur: r.author, texte: r.text })),
    AVIS_SOURCE,
  );
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...TARIFS_SOURCE[i % TARIFS_SOURCE.length],
      a: s.title,
      p: s.price ?? TARIFS_SOURCE[i % TARIFS_SOURCE.length].p,
      n: s.desc || s.description || TARIFS_SOURCE[i % TARIFS_SOURCE.length].n,
    })),
    TARIFS_SOURCE,
  );
  STATS = resolveList(clientStats(sessionData), STATS_SOURCE);
  ENGAGEMENT = clientList(sessionData, "engagements.liste") ?? resolveList(clientCertifications(sessionData), ENGAGEMENT_DEMO);

  brand = fd?.brandColor ?? null;
  if (brand) {
    C = { ...C, accent: brand };
  }

  const SERVICES = resolveList(
    clientServices(sessionData)?.map((s: any, n: number) => ({
      titre: s.title ?? SERVICES_DEMO[n % SERVICES_DEMO.length].titre,
      desc: s.description ?? s.desc ?? SERVICES_DEMO[n % SERVICES_DEMO.length].desc,
      tag: SERVICES_DEMO[n % SERVICES_DEMO.length].tag,
    })),
    SERVICES_DEMO,
  );
  const AVIS = resolveList(
    clientReviews(sessionData)?.map((r: any, n: number) => ({
      texte: r.text ?? AVIS_DEMO[n % AVIS_DEMO.length].texte,
      auteur: r.name ?? r.author ?? AVIS_DEMO[n % AVIS_DEMO.length].auteur,
      detail: r.location ?? r.role ?? AVIS_DEMO[n % AVIS_DEMO.length].detail,
    })),
    AVIS_DEMO,
  );

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  /* Un seul index : le mot qui se resserre, la fraction, la ligne d'appui et
     le chiffre allumé du rail le lisent tous. */
  const { i, next, prev } = useSlides(HERO.length, DWELL.normal);
  const S = HERO[i];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const nom = fd?.businessName ?? clientName(sessionData) ?? "Axis Bio";
  const ville = clientCity(sessionData) ?? "Metz";
  const phone = clientPhone(sessionData) ?? fd?.phone ?? "03 87 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33387000000").replace(/[^+\d]/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "accueil@axis-bio.fr";
  const adresse = clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "57000", "Metz");
  const laboImg = photo(0, "https://images.pexels.com/photos/8442509/pexels-photo-8442509.jpeg?auto=compress&cs=tinysrgb&w=1400");
  /* Deuxième emplacement : sans photo confiée, un panneau de repli en CSS
     (trame de résultats, halo, filets). Aucune adresse d'image inventée. */
  const siteImg = photo(1, "");

  return (
    <div id="i357-root" style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip" }}>
      <style>{`
        ${FONTS_CSS}
        #i357-root em { font-style: italic; }
        .i357-led { animation: i357-led 2.8s ${EASE_CSS} infinite; }
        @keyframes i357-led {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.25); }
        }
        @media (prefers-reduced-motion: reduce) {
          .i357-led { animation: none !important; opacity: 0.9; }
        }
        @media (max-width: 980px) {
          #i357-nav { display: none !important; }
          .i357-burger { display: flex !important; }
        }
        @media (max-width: 900px) {
          .i357-hero { grid-template-columns: minmax(0,1fr) !important; gap: 42px !important; padding-top: 122px !important; }
          .i357-rail { border-left: none !important; padding-left: 0 !important; }
          .i357-fiche { grid-template-columns: minmax(0,1fr) !important; gap: 30px !important; }
          .i357-fiche-titre { position: static !important; top: auto !important; }
          .i357-colonnes { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
          .i357-colonnes > div { border-left: none !important; }
          .i357-split { grid-template-columns: minmax(0,1fr) !important; gap: 38px !important; }
          .i357-contact { grid-template-columns: minmax(0,1fr) !important; gap: 34px !important; }
          .i357-avis { grid-template-columns: minmax(0,1fr) !important; }
          .i357-avis > div { margin-top: 0 !important; }
          .i357-tarif { grid-template-columns: minmax(0,1fr) !important; gap: 8px !important; }
          .i357-tarif > div:last-child { text-align: left !important; }
          .i357-tarif-tete { display: none !important; }
        }
        @media (max-width: 620px) {
          .i357-ghost { display: none !important; }
          .i357-colonnes { grid-template-columns: minmax(0,1fr) !important; }
        }
      `}</style>

      {/* ══ NAV ══════════════════════════════════════════════════════════ */}
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
          padding: scrolled ? "12px clamp(20px, 5vw, 60px)" : "22px clamp(20px, 5vw, 60px)",
          background: scrolled ? "rgba(245,247,251,0.93)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          transition: `padding .55s ${EASE_CSS}, background .55s ${EASE_CSS}, border-color .55s ${EASE_CSS}, backdrop-filter .55s ${EASE_CSS}`,
        }}
      >
        <a href="#i357-root" style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0, textDecoration: "none" }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={nom} style={{ height: 32, maxWidth: 168, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <FlaskConical size={17} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: SERIF, fontSize: 21, letterSpacing: "-0.01em", color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nom}</span>
              <span style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.28em", textTransform: "uppercase", color: C.textFaint, marginLeft: 4, whiteSpace: "nowrap" }}>
                {clientTrade(sessionData) ?? "Laboratoire"}
              </span>
            </>
          )}
        </a>

        <div id="i357-nav" style={{ display: "flex", gap: "clamp(16px, 2vw, 30px)", alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <NavLien key={l} label={l} href={h} />
          ))}
          <Bouton href="#contact">Mes résultats</Bouton>
        </div>

        <button
          className="i357-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: `transform .4s ${EASE_CSS}`, transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "opacity .3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: `transform .4s ${EASE_CSS}`, transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>

      {mobileOpen && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 99, background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "18px clamp(20px, 5vw, 60px) 26px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ fontFamily: SANS, color: C.ink, fontSize: 15.5, fontWeight: 500, textDecoration: "none", padding: "13px 0", borderBottom: `1px solid ${C.border}` }}>
              {l}
            </a>
          ))}
          <a href="#contact" onClick={() => setMobileOpen(false)} style={{ marginTop: 14, background: C.accent, color: C.white, fontFamily: SANS, borderRadius: 2, padding: "15px 22px", fontSize: 14.5, fontWeight: 600, textDecoration: "none", textAlign: "center" }}>
            Mes résultats
          </a>
        </div>
      )}

      {/* ══ HÉROS — H9 : double colonne + rail de chiffres ═══════════════ */}
      <section
        className="i357-hero"
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.28fr) minmax(0, 0.72fr)",
          gap: "clamp(32px, 5vw, 76px)",
          alignItems: "center",
          minHeight: "100dvh",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(132px, 15vh, 172px) clamp(20px, 5vw, 60px) clamp(80px, 10vw, 128px)",
          overflow: "hidden",
        }}
      >
        <Ghost right opacity={0.05} top="2%" size="clamp(220px, 30vw, 460px)">
          15189
        </Ghost>

        <div style={{ position: "relative", zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.08 }}>
            <Kicker>{clientEyebrow(sessionData) ?? `Biologie médicale · ${ville}`}</Kicker>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.15, ease: EASE, delay: 0.2 }}
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: "clamp(38px, 5.8vw, 70px)",
              lineHeight: 0.99,
              letterSpacing: "-0.025em",
              color: C.ink,
              margin: "clamp(20px, 2.6vw, 30px) 0 clamp(14px, 1.8vw, 20px)",
            }}
          >
            {/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ?? (
              <>
                {clientHeroLine(sessionData, 0, 2, 18) ?? "Un résultat juste,"}
                <br />
                {/* Le geste : le mot arrive espacé, puis se resserre. */}
                <TrackingCollapse word={S.word} index={i} from="0.34em" to="0.02em" style={{ color: C.accentDark, fontStyle: "italic" }} />
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.38 }}
            style={{ fontFamily: SANS, fontWeight: 300, fontSize: "clamp(15.5px, 1.5vw, 17px)", lineHeight: 1.8, color: C.textMuted, maxWidth: 520, marginBottom: "clamp(26px, 3vw, 34px)" }}
          >
            {clientHeroPrestations(sessionData) ??
              c?.heroSubline ??
              "Sans rendez-vous dès 7 h, résultats du jour avant 17 h sur le serveur sécurisé, biologistes joignables pour interpréter. La biologie médicale accréditée COFRAC, au coin de la rue."}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.5 }} style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <Bouton href={telHref} large>
              Voir les horaires des sites
            </Bouton>
            <Bouton href="#services" variant="ligne" large>
              Nos analyses
            </Bouton>
          </motion.div>

          {/* La commande du geste : même index que le mot et que le rail. */}
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: "clamp(28px, 3.6vw, 44px)", flexWrap: "wrap" }}>
            <SlideIndex i={i} total={HERO.length} variant="fraction" color={C.textFaint} className="" />
            <span style={{ fontFamily: SANS, fontWeight: 300, fontSize: 13, lineHeight: 1.6, color: C.textMuted, maxWidth: 400 }}>
              <strong style={{ color: C.ink, fontWeight: 600 }}>{S.k}</strong> — {S.sub}
            </span>
            <HairlineArrows onPrev={prev} onNext={next} color={C.ink} className="" labels={{ prev: "Repère précédent", next: "Repère suivant" }} />
          </div>
        </div>

        {/* ── Le rail de chiffres, vertical : la signature de l'archétype ── */}
        <motion.div
          className="i357-rail"
          initial={{ opacity: 0, x: 22 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.32 }}
          style={{ position: "relative", zIndex: 2, borderLeft: `1px solid ${C.border}`, paddingLeft: "clamp(20px, 2.6vw, 36px)" }}
        >
          {/* Détail gratuit : la diode du serveur de résultats. */}
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: "clamp(18px, 2.4vw, 28px)" }}>
            <span className="i357-led" style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent, display: "inline-block" }} />
            <span style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.26em", textTransform: "uppercase", color: C.textFaint }}>Serveur de résultats en ligne</span>
          </div>

          {STATS.map((s: any, idx: number) => {
            const actif = idx === i % Math.max(STATS.length, 1);
            return (
              <div
                key={s.label}
                style={{
                  padding: "clamp(14px, 1.8vw, 20px) 0",
                  borderTop: idx === 0 ? "none" : `1px solid ${C.border}`,
                  position: "relative",
                  transition: `opacity .6s ${EASE_CSS}`,
                  opacity: actif ? 1 : 0.72,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: "calc(clamp(20px, 2.6vw, 36px) * -1 - 1px)",
                    top: idx === 0 ? 0 : 1,
                    bottom: 0,
                    width: 2,
                    background: actif ? C.accent : "transparent",
                    transition: `background .6s ${EASE_CSS}`,
                  }}
                />
                <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(28px, 3.4vw, 40px)", lineHeight: 1.02, letterSpacing: "-0.02em", color: actif ? C.accentDark : C.ink, fontVariantNumeric: "tabular-nums", transition: `color .6s ${EASE_CSS}` }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: SANS, fontWeight: 300, fontSize: 12.5, lineHeight: 1.6, color: C.textMuted, marginTop: 7 }}>{s.label}</div>
              </div>
            );
          })}
        </motion.div>
      </section>

      {/* ══ RESPIRATION ═════════════════════════════════════════════════ */}
      <section style={{ background: C.bgAlt, padding: "clamp(58px, 8vw, 96px) clamp(20px, 5vw, 60px)", textAlign: "center" }}>
        <Reveal>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(21px, 2.9vw, 33px)", lineHeight: 1.5, letterSpacing: "-0.012em", color: C.ink, maxWidth: 800, margin: "0 auto" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ??
              "Un chiffre n'est pas un résultat : il le devient quand un biologiste l'a validé, situé, et expliqué à qui de droit."}
          </p>
        </Reveal>
      </section>

      {/* ══ ANALYSES — colonnes filetées ════════════════════════════════ */}
      <section id="services" style={{ background: C.bg, padding: "clamp(72px, 9vw, 124px) clamp(20px, 5vw, 60px)", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1220, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 30, flexWrap: "wrap", marginBottom: "clamp(30px, 4vw, 48px)" }}>
              <div>
                <Kicker>Analyses</Kicker>
                <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(30px, 4.4vw, 52px)", lineHeight: 1.06, letterSpacing: "-0.025em", color: C.ink, marginTop: 18 }}>
                  {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                    <>
                      Du bilan de routine
                      <br />
                      <em style={{ color: C.accentDark }}>au diagnostic pointu.</em>
                    </>
                  )}
                </h2>
              </div>
              <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 14.5, lineHeight: 1.78, color: C.textMuted, maxWidth: 360 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "services.intro") ??
                  "Toutes les analyses sont réalisées sous accréditation, sur les deux sites, avec les mêmes automates et les mêmes contrôles."}
              </p>
            </div>
          </Reveal>

          <div className="i357-colonnes" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", borderTop: `1px solid ${C.ink}` }}>
            {SERVICES.map((s: any, idx: number) => (
              <Reveal
                key={s.titre + idx}
                delay={Math.min(idx, 5) * 0.055}
                style={{
                  borderLeft: idx % 3 === 0 ? "none" : `1px solid ${C.border}`,
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <ColonneAnalyse s={s} n={idx} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ VOTRE PARCOURS — fiche à titre collant ══════════════════════ */}
      <section id="methode" style={{ background: C.bgAlt, padding: "clamp(72px, 9vw, 124px) clamp(20px, 5vw, 60px)", position: "relative", overflow: "hidden" }}>
        <Ghost opacity={0.04} top="12%" size="clamp(220px, 30vw, 440px)">
          04
        </Ghost>
        <div className="i357-fiche" style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0, 0.62fr) minmax(0, 1.38fr)", gap: "clamp(30px, 5vw, 74px)", alignItems: "start", position: "relative", zIndex: 2 }}>
          <Reveal className="i357-fiche-titre" style={{ position: "sticky", top: 120 }}>
            <div>
              <Kicker>Votre parcours</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(30px, 4vw, 48px)", lineHeight: 1.06, letterSpacing: "-0.025em", color: C.ink, margin: "18px 0 16px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                  <>
                    Un prélèvement,
                    <br />
                    <em style={{ color: C.accentDark }}>quatre garanties.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 14.5, lineHeight: 1.78, color: C.textMuted, maxWidth: 340 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "methode.intro") ??
                  "De la porte d'entrée au coup de téléphone du biologiste : ce que vous êtes en droit d'attendre, à chaque étape."}
              </p>
            </div>
          </Reveal>

          <div>
            {resolveList(fusionnerEtapes(METHODE_SOURCE, clientMethode(sessionData)), METHODE_SOURCE).map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.055}>
                <div style={{ display: "flex", gap: "clamp(16px, 2.4vw, 30px)", alignItems: "flex-start", padding: "clamp(20px, 2.6vw, 30px) 0", borderTop: `1px solid ${idx === 0 ? C.ink : C.border}` }}>
                  <span
                    style={{
                      flexShrink: 0,
                      width: 46,
                      height: 46,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `1px solid ${C.accent}`,
                      color: C.accentDark,
                      fontFamily: SANS,
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {m.n}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(20px, 2.2vw, 26px)", lineHeight: 1.18, color: C.ink, margin: "6px 0 9px", letterSpacing: "-0.012em" }}>{m.t}</h3>
                    <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 14.5, lineHeight: 1.78, color: C.textMuted, margin: 0, maxWidth: 600 }}>{m.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ NOS GARANTIES ═══════════════════════════════════════════════ */}
      <section id="engagements" style={{ background: C.bg, padding: "clamp(72px, 9vw, 124px) clamp(20px, 5vw, 60px)" }}>
        <div className="i357-split" style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0, 0.95fr) minmax(0, 1.05fr)", gap: "clamp(34px, 5vw, 70px)", alignItems: "center" }}>
          <Reveal>
            <div>
              {laboImg ? (
                <div style={{ borderRadius: 3, overflow: "hidden", border: `1px solid ${C.border}`, aspectRatio: "4 / 3.4" }}>
                  <img src={laboImg} alt="Technicienne au laboratoire" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              ) : (
                <div
                  aria-hidden
                  style={{
                    position: "relative",
                    aspectRatio: "4 / 3.4",
                    borderRadius: 3,
                    overflow: "hidden",
                    background: `linear-gradient(152deg, ${C.accentLight} 0%, ${C.bgAlt} 58%, ${C.bg} 100%)`,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <span style={{ position: "absolute", inset: 0, background: `radial-gradient(56% 56% at 68% 26%, var(--brand, #4646b8) 0%, transparent 64%)`, opacity: 0.11 }} />
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `linear-gradient(${C.accent} 1px, transparent 1px), linear-gradient(90deg, ${C.accent} 1px, transparent 1px)`,
                      backgroundSize: "34px 34px",
                      opacity: 0.08,
                    }}
                  />
                  <span style={{ position: "absolute", left: "12%", right: "12%", top: "46%", height: 1, background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`, opacity: 0.5 }} />
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div>
              <Kicker>Nos garanties</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(28px, 3.6vw, 44px)", lineHeight: 1.08, letterSpacing: "-0.022em", color: C.ink, margin: "18px 0 clamp(22px, 3vw, 30px)" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>
                    La rigueur,
                    <br />
                    <em style={{ color: C.accentDark }}>accréditée.</em>
                  </>
                )}
              </h2>
              <div style={{ borderTop: `1px solid ${C.border}` }}>
                {ENGAGEMENT.map((e: string, idx: number) => (
                  <div key={idx} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "15px 0", borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ flexShrink: 0, marginTop: 3, width: 18, height: 18, borderRadius: 2, background: C.accentLight, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                      <Check size={11} color={C.accentDark} strokeWidth={2.4} />
                    </span>
                    <span style={{ fontFamily: SANS, fontWeight: 300, fontSize: 14.5, lineHeight: 1.74, color: C.textMuted }}>{e}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "clamp(24px, 3vw, 32px)" }}>
                <Bouton href={telHref}>Nous appeler</Bouton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ PRISE EN CHARGE — table à en-tête ═══════════════════════════ */}
      <section id="tarifs" style={{ background: C.bgAlt, padding: "clamp(72px, 9vw, 124px) clamp(20px, 5vw, 60px)" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <Reveal>
            <Kicker align="center">Prise en charge</Kicker>
            <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(30px, 4.2vw, 50px)", lineHeight: 1.06, letterSpacing: "-0.025em", color: C.ink, textAlign: "center", margin: "18px 0 14px" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                <>
                  Tiers payant, <em style={{ color: C.accentDark }}>pas de surprise.</em>
                </>
              )}
            </h2>
            <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 15, lineHeight: 1.78, color: C.textMuted, maxWidth: 580, margin: "0 auto", textAlign: "center" }}>
              Les analyses prescrites sont remboursées Sécurité sociale + mutuelle en tiers payant. Les examens sans ordonnance sont affichés au tarif de la nomenclature.
            </p>
          </Reveal>

          <div style={{ marginTop: "clamp(34px, 4.5vw, 54px)" }}>
            <div
              className="i357-tarif-tete"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.25fr) minmax(0, 0.42fr)",
                gap: "clamp(12px, 2.2vw, 30px)",
                padding: "0 clamp(8px, 1.6vw, 20px) 12px",
                fontFamily: SANS,
                fontSize: 10.5,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: C.textFaint,
              }}
            >
              <span>Acte</span>
              <span>Ce que ça implique</span>
              <span style={{ textAlign: "right" }}>Vous payez</span>
            </div>
            <div style={{ borderBottom: `1px solid ${C.border}` }}>
              {TARIFS.map((t: any, idx: number) => (
                <Reveal key={t.a + idx} delay={Math.min(idx, 4) * 0.055}>
                  <LigneTarif t={t} idx={idx} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ AVIS — colonnes décalées ════════════════════════════════════ */}
      <section style={{ background: C.bgDark, padding: "clamp(72px, 9vw, 124px) clamp(20px, 5vw, 60px)", position: "relative", overflow: "hidden" }}>
        <Ghost right color={C.reactif} opacity={0.06} top="-6%" size="clamp(240px, 32vw, 480px)">
          %
        </Ghost>
        <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <Kicker color={C.reactif} align="center">
              Ce qu'on nous dit
            </Kicker>
            <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(30px, 4.2vw, 50px)", lineHeight: 1.06, color: C.white, textAlign: "center", margin: "18px 0 clamp(38px, 5vw, 58px)", letterSpacing: "-0.025em" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                <>
                  La confiance, <em style={{ color: C.reactif }}>tube après tube</em>.
                </>
              )}
            </h2>
          </Reveal>

          <div className="i357-avis" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "clamp(16px, 2vw, 26px)", alignItems: "start" }}>
            {AVIS.map((a: any, idx: number) => (
              <Reveal key={a.auteur + idx} delay={idx * 0.075} style={{ marginTop: idx % 3 === 1 ? "clamp(0px, 3vw, 42px)" : idx % 3 === 2 ? "clamp(0px, 6vw, 84px)" : 0 }}>
                <figure style={{ margin: 0, background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.1)", borderTop: `1px solid ${C.reactif}`, borderRadius: 3, padding: "clamp(24px, 3vw, 34px)" }}>
                  <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: C.reactif, marginBottom: 16, fontVariantNumeric: "tabular-nums" }}>
                    {String(idx + 1).padStart(2, "0")} / {String(AVIS.length).padStart(2, "0")}
                  </div>
                  <blockquote style={{ margin: 0, fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(16.5px, 1.8vw, 19px)", lineHeight: 1.62, color: "rgba(255,255,255,0.88)" }}>
                    « {a.texte} »
                  </blockquote>
                  <figcaption style={{ marginTop: 22, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                    <div style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 600, color: C.white }}>{a.auteur}</div>
                    <div style={{ fontFamily: SANS, fontWeight: 300, fontSize: 12.5, color: "rgba(255,255,255,0.5)", marginTop: 5 }}>{a.detail}</div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTACT — deux sites ════════════════════════════════════════ */}
      <section id="contact" style={{ background: C.bg, padding: "clamp(72px, 9vw, 124px) clamp(20px, 5vw, 60px)" }}>
        <div className="i357-contact" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 0.9fr)", gap: "clamp(34px, 5vw, 70px)", alignItems: "center" }}>
          <Reveal>
            <div>
              <Kicker>Deux sites</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(30px, 4.4vw, 52px)", lineHeight: 1.06, letterSpacing: "-0.025em", color: C.ink, margin: "18px 0 18px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                  <>
                    Le laboratoire d'à côté,
                    <br />
                    <em style={{ color: C.accentDark }}>au niveau des grands.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 15.5, lineHeight: 1.8, color: C.textMuted, maxWidth: 480, marginBottom: "clamp(24px, 3vw, 34px)" }}>
                Centre-ville et Metz-Queuleu, sans rendez-vous. Résultats en ligne sur le serveur sécurisé — identifiants remis au guichet.
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Bouton href={telHref} large>
                  {phone}
                </Bouton>
                <Bouton href={`mailto:${mail}`} variant="ligne" large>
                  Nous écrire
                </Bouton>
              </div>

              <div style={{ marginTop: "clamp(26px, 3.4vw, 38px)", borderTop: `1px solid ${C.border}` }}>
                {[
                  { icon: <MapPin size={14} />, l: "Adresse", v: adresse },
                  { icon: <Mail size={14} />, l: "Courriel", v: mail },
                  { icon: <Clock size={14} />, l: "Ouverture", v: "Lun–Ven 7h – 18h30 · Sam 7h30 – 12h30" },
                ].map((r) => (
                  <div key={r.l} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "13px 0", borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ color: C.accent, marginTop: 3, flexShrink: 0 }}>{r.icon}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.26em", textTransform: "uppercase", color: C.textFaint }}>{r.l}</div>
                      <div style={{ fontFamily: SANS, fontSize: 14.5, color: C.ink, marginTop: 4, lineHeight: 1.6, wordBreak: "break-word" }}>{r.v}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div>
              {siteImg ? (
                <div style={{ borderRadius: 3, overflow: "hidden", border: `1px solid ${C.border}`, aspectRatio: "4 / 4.2" }}>
                  <img src={siteImg} alt="L'accueil du laboratoire" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              ) : (
                /* Repli sans image : la trame d'un rendu de résultats. */
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "4 / 4.2",
                    borderRadius: 3,
                    overflow: "hidden",
                    background: C.bgDark,
                    border: `1px solid ${C.border}`,
                    padding: "clamp(24px, 3vw, 36px)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 14,
                  }}
                >
                  <span aria-hidden style={{ position: "absolute", inset: 0, background: `radial-gradient(60% 46% at 26% 18%, var(--brand, #4646b8) 0%, transparent 66%)`, opacity: 0.12 }} />
                  <div style={{ position: "relative", fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.3em", textTransform: "uppercase", color: C.reactif, marginBottom: 6 }}>
                    Compte rendu · exemple de trame
                  </div>
                  {[76, 92, 58, 84, 66, 88].map((w, idx) => (
                    <div key={idx} style={{ position: "relative", display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ height: 1, width: `${w}%`, background: "rgba(255,255,255,0.16)" }} />
                      <span style={{ height: 1, flex: 1, background: idx % 2 === 0 ? C.reactif : "rgba(255,255,255,0.1)", opacity: idx % 2 === 0 ? 0.5 : 1 }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ PIED DE PAGE ════════════════════════════════════════════════ */}
      <footer style={{ background: C.bgDarkAlt, padding: "clamp(46px, 6vw, 72px) clamp(20px, 5vw, 60px) 24px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, paddingBottom: "clamp(26px, 3.4vw, 40px)" }}>
            <div style={{ maxWidth: 430 }}>
              <div style={{ fontFamily: SERIF, fontSize: 24, color: C.reactif, letterSpacing: "-0.01em" }}>{nom}</div>
              <p style={{ fontFamily: SANS, fontWeight: 300, color: "rgba(255,255,255,0.42)", fontSize: 13.5, lineHeight: 1.75, marginTop: 12 }}>
                Laboratoire de biologie médicale · {ville} (2 sites)
                <br />
                Accréditation COFRAC ISO 15189 — biologistes médicaux
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <MapPin size={13} />, t: adresse },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Clock size={13} />, t: "Lun–Ven 7h–18h30 · Sam 7h30–12h30" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 11, color: "rgba(255,255,255,0.45)", fontSize: 13, alignItems: "center", fontFamily: SANS }}>
                  <span style={{ color: C.reactif, display: "inline-flex" }}>{item.icon}</span>
                  {item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontFamily: SANS, color: "rgba(255,255,255,0.28)", fontSize: 12 }}>
              © 2026 {nom} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
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
