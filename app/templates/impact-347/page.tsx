"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle,
  Clock,
  FileCheck,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Star,
  Target,
} from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, useSlides } from "@/lib/templates/hero-kit-2";
import {
  clientAccrocheRestante,
  clientAddress,
  clientCertifications,
  clientCity,
  clientCodePostalVille,
  clientEmail,
  clientEyebrow,
  clientHeroLine,
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
import { TitreDeLaPage } from "@/lib/templates/TitreDeLaPage";
import { ActionMobile } from "@/lib/templates/ActionMobile";

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
   PRISME FORMATION — Organisme de formation certifié Qualiopi · Paris.
   Réécriture premium (reprise 316–383, famille II).

   Héros — archétype « liste immédiate ». Le carrousel ne montrait qu'une
   formation à la fois derrière une fraction 01/03 : deux tiers du catalogue
   passaient sous le pli. Les trois sont désormais posées d'emblée, en
   rangées. La méta-rangée fine et le bandeau média sombre sont partis avec
   lui — ce sont les archétypes d'impact-331 et d'impact-341, et deux voisins
   ne partagent jamais leur composition.

   LineScroll ne s'applique plus au titre : il masque chaque ligne dans une
   fenêtre en overflow hidden, prévue pour des lignes coupées à la main. Un
   titre d'un seul tenant s'y fait tronquer au lieu de passer à la ligne, et
   sa longueur vient du client.
   Fontes P10 : Spectral (serif de labeur) + IBM Plex Sans. Palette claire
   #f6f7fa / accent #4338ca.

   Écarts assumés au squelette standard :
   - la certification Qualiopi passe AVANT le catalogue, en exergue plein
     cadre sombre — c'est ce qui ouvre les financements, donc ce qui se lit
     en premier ;
   - le catalogue est un sommaire numéroté de magazine, pas une grille ;
   - le déroulé est un rail vertical à points, titre épinglé ;
   - les financements sont une table fine à deux colonnes ;
   - les avis sont trois colonnes décalées, sans fond sombre.
   ════════════════════════════════════════════════════════════════════════════ */

let C: Record<string, string> = {
  bg: "#f6f7fa",
  bgAlt: "#eaeef7",
  bgDark: "#141834",
  bgDarkAlt: "#0d1027",
  bgCard: "#ffffff",
  accent: "var(--brand,#4338ca)",
  accentDark: "var(--brand-light,#312780)",
  accentLight: "#e4e6fb",
  ink: "#12162b",
  textMuted: "#565f7a",
  textFaint: "#8d95ad",
  border: "#dde2ee",
  borderSoft: "#e9edf6",
  white: "#ffffff",
  certif: "#a3aef5",
};

const DISPLAY = "'Spectral', Georgia, 'Times New Roman', serif";
const BODY = "'IBM Plex Sans', system-ui, -apple-system, sans-serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const NAV = [
  { l: "Qualiopi", h: "#engagements" },
  { l: "Catalogue", h: "#services" },
  { l: "Le déroulé", h: "#methode" },
  { l: "Financements", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* ── Données de démonstration (contenu du thème, conservé mot pour mot) ───── */

const HERO_SOURCE = [
  { k: "Bureautique", lines: ["Excel enfin maîtrisé,", "certification TOSA à la clé."], sub: "Du tableau croisé aux macros, niveau mesuré avant/après." },
  { k: "Management", lines: ["Manager une équipe,", "ça s'apprend aussi."], sub: "Prise de poste, entretiens, conflits — en 4 jours espacés." },
  { k: "Langues", lines: ["L'anglais professionnel,", "attesté par le LILATE."], sub: "Petits groupes de niveau, oral d'abord." },
];
let HERO = HERO_SOURCE;

/* La première ligne du sommaire porte l'accroche du client dès qu'il en a une ;
   les suivantes prennent le nom de ses formations. Rien n'est inventé : sans
   saisie, le thème garde ses trois exemples. */
function HERO_LIVE() {
  const presta = clientServices(sessionData);
  const base = HERO_SOURCE.map((s, i) => {
    const p = presta?.[i % (presta.length || 1)];
    if (!p) return s;
    return { ...s, k: p.title || s.k, sub: p.description || p.desc || s.sub };
  });
  const l0 = clientHeroLine(sessionData, 0, 2, 22);
  const l1 = clientHeroLine(sessionData, 1, 2, 22);
  if (!l0) return base;
  /* `filter(Boolean)` ne retire pas `undefined` du TYPE : sans ce filtre
     explicite, lines devient (string | undefined)[] et ne s'assigne plus. */
  const lignes: string[] = [l0, l1].filter((x): x is string => Boolean(x));
  return base.map((s, i) => (i === 0 ? { ...s, lines: lignes } : s));
}

const SERVICES_SOURCE = [
  { titre: "Bureautique & Excel", desc: "Excel, Word, PowerPoint du niveau débutant à expert. Certification TOSA en fin de parcours — un score, pas une attestation de présence.", tag: "TOSA", n: "01", icon: Target },
  { titre: "Management d'équipe", desc: "Prise de poste, entretiens annuels, gestion de conflit. Quatre journées espacées de trois semaines pour appliquer entre les sessions.", tag: "Management", n: "02", icon: GraduationCap },
  { titre: "Langues professionnelles", desc: "Anglais, espagnol, allemand des affaires en groupes de 6 maximum, évalués LILATE. L'oral d'abord, la grammaire ensuite.", tag: "Langues", n: "03", icon: FileCheck },
  { titre: "Digital & réseaux", desc: "Community management, SEO, IA générative au bureau : des cas réels de votre entreprise travaillés en session.", tag: "Digital", n: "04", icon: Target },
  { titre: "Comptabilité-gestion", desc: "Lire un bilan, construire un budget, piloter sa trésorerie — pour dirigeants de TPE et responsables non-financiers.", tag: "Gestion", n: "05", icon: FileCheck },
  { titre: "Intra-entreprise sur mesure", desc: "Vos équipes, vos cas, vos locaux ou les nôtres. Programme co-construit et audité Qualiopi comme le reste.", tag: "Intra", n: "06", icon: GraduationCap },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE_SOURCE = [
  { n: "01", t: "Positionnement", d: "Test de niveau et entretien de besoins avant l'inscription. Si la formation ne vous sert pas, on vous le dit." },
  { n: "02", t: "Convention & financement", d: "Dossier CPF ou OPCO monté par nos soins, convention conforme, convocations sous 48 h." },
  { n: "03", t: "Formation active", d: "Groupes de 8 maximum, cas réels, formateur praticien. Émargement et supports remis au fil de l'eau." },
  { n: "04", t: "Certification & suivi à froid", d: "Passage de la certification, enquête à chaud puis à 3 mois — les résultats sont publiés, c'est Qualiopi." },
];
let METHODE = METHODE_SOURCE;

const ENGAGEMENT_SOURCE = [
  "Certification Qualiopi (actions de formation) — audit de surveillance passé en 2025",
  "Numéro de déclaration d'activité 11 75 61234 75, éligible CPF et financements OPCO",
  "Taux de satisfaction et de réussite publiés, formation par formation",
  "Accessibilité handicap : référent dédié, parcours et supports adaptables",
];
let ENGAGEMENT = ENGAGEMENT_SOURCE;

const TARIFS_SOURCE = [
  { a: "Excel — parcours complet (21 h)", p: "1 190 €", n: "Certification TOSA incluse. Éligible CPF : reste à charge souvent nul." },
  { a: "Management — 4 jours", p: "1 890 €", n: "Financement OPCO entreprise, déjeuners inclus." },
  { a: "Anglais pro — 30 h", p: "1 590 €", n: "Groupes de 6, évaluation LILATE incluse, éligible CPF." },
  { a: "Intra-entreprise (jour)", p: "dès 1 500 €", n: "Jusqu'à 8 participants, programme sur mesure, partout en France." },
];
let TARIFS = TARIFS_SOURCE;

const AVIS_SOURCE = [
  { texte: "Le test de positionnement m'a évité de payer trois jours pour ce que je savais déjà : parcours ajusté à 14 h au lieu de 21. Sérieux rare, TOSA 890/1000.", auteur: "Sonia D.", detail: "Excel avancé — CPF" },
  { texte: "Devenu manager sans formation, j'improvisais. Les journées espacées permettent d'essayer entre les sessions et de revenir avec ses ratés. Ça change tout.", auteur: "Mathieu R.", detail: "Management d'équipe" },
  { texte: "Notre OPCO a tout pris en charge, dossier monté par leur équipe. Six commerciaux formés à l'anglais téléphonique, résultats mesurés au LILATE.", auteur: "DRH, PME e-commerce", detail: "Intra langues" },
];
let AVIS = AVIS_SOURCE;

const STATS_SOURCE = [
  { value: "Qualiopi", label: "Certifié depuis 2021" },
  { value: "4 200+", label: "Stagiaires formés" },
  { value: "94 %", label: "De satisfaction (enquêtes à froid)" },
  { value: "87 %", label: "De réussite aux certifications" },
];
let STATS = STATS_SOURCE;

const REPERES_SOURCE = [
  "Bilan CPF/OPCO gratuit par téléphone",
  "Convocations sous 48 h une fois le dossier accepté",
  "Sessions en présentiel ou en visio, jamais en e-learning seul",
];
let REPERES = REPERES_SOURCE;

/* URL photo du thème — conservée telle quelle. Les autres emplacements
   attendent celles du client : sans image, le repli dessiné tient la page. */
const PHOTO_FALLBACK = [
  "https://images.pexels.com/photos/5756649/pexels-photo-5756649.jpeg?auto=compress&cs=tinysrgb&w=1400",
  "",
  "",
];

// Photo du client à cet emplacement, repli sur celle du thème quand il y en a.
function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ── Primitives ───────────────────────────────────────────────────────────── */

function Reveal({ children, delay = 0, y = 26 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Kicker maison : filet 40×1 px, capitales très filées. */
function Kicker({ children, tone = "faint", center = false }: { children: React.ReactNode; tone?: "faint" | "accent" | "clair"; center?: boolean }) {
  const col = tone === "accent" ? C.accentDark : tone === "clair" ? C.certif : C.textFaint;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: center ? "center" : "flex-start", color: col }}>
      <span aria-hidden style={{ width: 40, height: 1, background: "currentColor", opacity: 0.8, flexShrink: 0 }} />
      <span style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.36em", textTransform: "uppercase", color: "currentColor" }}>
        {children}
      </span>
      {center && <span aria-hidden style={{ width: 40, height: 1, background: "currentColor", opacity: 0.8, flexShrink: 0 }} />}
    </div>
  );
}

/**
 * Surface photographique avec repli dessiné.
 *
 * Sans image — proxy bloqué ou client qui n'en fournit pas — la boîte tient
 * seule : aplat encre, quadrillage de cahier en CSS, glow d'accent, et le tracé
 * au trait d'un tableau de session.
 */
function Plate({ src, alt, ratio = "4/3", label, sombre = false }: { src: string; alt: string; ratio?: string; label?: string; sombre?: boolean }) {
  const fond = sombre ? C.bgDarkAlt : C.accentLight;
  const trait = sombre ? C.certif : C.accentDark;
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: ratio,
        background: fond,
        overflow: "hidden",
        borderRadius: 2,
        boxShadow: `inset 0 0 0 1px ${sombre ? "rgba(255,255,255,0.09)" : C.border}`,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: sombre ? 0.5 : 0.7,
          backgroundImage: `linear-gradient(${sombre ? "rgba(255,255,255,0.045)" : "rgba(18,22,43,0.05)"} 1px, transparent 1px), linear-gradient(90deg, ${sombre ? "rgba(255,255,255,0.045)" : "rgba(18,22,43,0.05)"} 1px, transparent 1px)`,
          backgroundSize: "22px 22px",
        }}
      />
      <div
        aria-hidden
        style={{ position: "absolute", inset: 0, background: `radial-gradient(85% 68% at 26% 16%, ${C.accent} 0%, transparent 72%)`, opacity: sombre ? 0.2 : 0.11 }}
      />
      {!src && (
        <svg aria-hidden viewBox="0 0 140 100" style={{ position: "absolute", left: "50%", top: "50%", width: "42%", transform: "translate(-50%,-50%)", opacity: 0.55 }}>
          <rect x="10" y="12" width="120" height="62" fill="none" stroke={trait} strokeWidth="1.3" />
          <path d="M24 30 H86 M24 42 H104 M24 54 H68" stroke={trait} strokeWidth="1.1" />
          <path d="M70 74 V88 M52 92 H88" stroke={trait} strokeWidth="1.1" />
        </svg>
      )}
      {src && <img src={src} alt={alt} loading="lazy" style={{ position: "relative", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
      <span aria-hidden style={{ position: "absolute", left: 0, bottom: 0, width: "32%", height: 3, background: C.accent }} />
      {label && (
        <span
          style={{
            position: "absolute",
            left: 14,
            bottom: 14,
            fontFamily: BODY,
            fontSize: 9.5,
            fontWeight: 600,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: sombre ? C.white : C.ink,
            background: sombre ? "rgba(13,16,39,0.82)" : "rgba(246,247,250,0.9)",
            border: `1px solid ${sombre ? "rgba(255,255,255,0.14)" : C.border}`,
            padding: "6px 11px",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

/** Rangée de sommaire : numéro, titre, filet qui pousse, flèche qui avance. */
function SommaireRow({ s }: { s: any }) {
  const [hov, setHov] = useState(false);
  const Icon = s.icon ?? GraduationCap;
  return (
    <article
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="i347-rangee"
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "minmax(0,0.36fr) minmax(0,1fr)",
        gap: "clamp(16px, 3vw, 48px)",
        alignItems: "start",
        padding: "clamp(24px, 3.2vw, 38px) clamp(10px, 1.6vw, 22px)",
        borderTop: `1px solid ${C.border}`,
        background: hov ? C.white : "transparent",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? "0 24px 48px rgba(18,22,43,0.09), 0 4px 12px rgba(18,22,43,0.05)" : "none",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        overflow: "hidden",
      }}
    >
      <span
        aria-hidden
        style={{ position: "absolute", left: 0, top: -1, height: 2, width: hov ? "100%" : 0, background: C.accent, transition: "width 0.55s cubic-bezier(0.16, 1, 0.3, 1)" }}
      />
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, minWidth: 0 }}>
        <span
          style={{
            fontFamily: DISPLAY,
            fontSize: "clamp(30px, 4vw, 54px)",
            lineHeight: 0.9,
            color: "transparent",
            WebkitTextStroke: `1px ${hov ? C.accent : C.textFaint}`,
            transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {s.n}
        </span>
        <span style={{ fontFamily: BODY, fontSize: 9.5, fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textFaint, whiteSpace: "nowrap" }}>{s.tag}</span>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 10 }}>
          <Icon size={16} color={hov ? C.accent : C.textFaint} aria-hidden style={{ transition: "color 0.5s cubic-bezier(0.16, 1, 0.3, 1)", flexShrink: 0 }} />
          <h3 style={{ fontFamily: DISPLAY, fontSize: "clamp(19px, 2.2vw, 26px)", lineHeight: 1.22, color: C.ink, margin: 0, letterSpacing: "-0.008em" }}>{s.titre}</h3>
        </div>
        <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 14.5, lineHeight: 1.78, color: C.textMuted, margin: 0, maxWidth: 620 }}>{s.desc}</p>
        <div
          style={{
            marginTop: 16,
            display: "flex",
            alignItems: "center",
            gap: 9,
            fontFamily: BODY,
            fontSize: 12.5,
            fontWeight: 600,
            color: hov ? C.accentDark : C.textFaint,
            transition: "color 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          Le programme détaillé
          <ArrowRight size={14} aria-hidden style={{ transform: hov ? "translateX(7px)" : "none", transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }} />
        </div>
      </div>
    </article>
  );
}

/** Ligne de la table fine des financements. */
function TarifRow({ t, idx }: { t: any; idx: number }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="i347-tarifrow"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0,1fr) auto",
        gap: "clamp(14px, 2.4vw, 34px)",
        alignItems: "baseline",
        padding: "clamp(18px, 2.4vw, 26px) clamp(14px, 2vw, 24px)",
        borderTop: idx === 0 ? "none" : `1px solid ${C.borderSoft}`,
        background: hov ? C.bgAlt : "transparent",
        boxShadow: hov ? `inset 3px 0 0 0 ${C.accent}` : "inset 0 0 0 0 transparent",
        transform: hov ? "translateX(4px)" : "none",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: DISPLAY, fontSize: "clamp(17px, 1.9vw, 21px)", lineHeight: 1.28, color: C.ink }}>{t.a}</div>
        <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 13.5, lineHeight: 1.7, color: C.textMuted, margin: "7px 0 0", maxWidth: 560 }}>{t.n}</p>
      </div>
      <div style={{ fontFamily: DISPLAY, fontSize: "clamp(19px, 2.2vw, 25px)", color: hov ? C.accentDark : C.accent, whiteSpace: "nowrap", transition: "color 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        {t.p}
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function PrismeFormationPage() {
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

  /* Blocs vivants : recalculés à chaque rendu, une fois la session affectée. */
  HERO = HERO_LIVE();
  STATS = resolveList(clientStats(sessionData), STATS_SOURCE);
  ENGAGEMENT = resolveList(clientCertifications(sessionData), ENGAGEMENT_SOURCE);
  REPERES = resolveList(clientList(sessionData, "contact.reperes"), REPERES_SOURCE);
  METHODE = resolveList(clientList(sessionData, "methode.etapes")?.map((x: string, i: number) => ({ ...METHODE_SOURCE[i % METHODE_SOURCE.length], t: x })), METHODE_SOURCE);
  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({ ...SERVICES_SOURCE[i % SERVICES_SOURCE.length], titre: s.title })),
    SERVICES_SOURCE,
  );
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...TARIFS_SOURCE[i % TARIFS_SOURCE.length],
      a: s.title,
      p: s.price || TARIFS_SOURCE[i % TARIFS_SOURCE.length].p,
      n: s.description || s.desc || TARIFS_SOURCE[i % TARIFS_SOURCE.length].n,
    })),
    TARIFS_SOURCE,
  );
  AVIS = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      ...AVIS_SOURCE[i % AVIS_SOURCE.length],
      texte: r.text || AVIS_SOURCE[i % AVIS_SOURCE.length].texte,
      auteur: r.name || r.author || AVIS_SOURCE[i % AVIS_SOURCE.length].auteur,
      detail: r.location || r.role || AVIS_SOURCE[i % AVIS_SOURCE.length].detail,
    })),
    AVIS_SOURCE,
  );
  brand = fd?.brandColor ?? null;
  if (brand) {
    C = { ...C, accent: brand };
  }

  const SERVICES = resolveList(
    clientServices(sessionData)?.map((s: any, n: number) => ({
      titre: s.title || SERVICES_DEMO[n % SERVICES_DEMO.length].titre,
      desc: s.description || s.desc || SERVICES_DEMO[n % SERVICES_DEMO.length].desc,
      tag: SERVICES_DEMO[n % SERVICES_DEMO.length].tag,
      n: SERVICES_DEMO[n % SERVICES_DEMO.length].n,
      icon: SERVICES_DEMO[n % SERVICES_DEMO.length].icon,
    })),
    SERVICES_DEMO,
  );

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Un seul index pilote tout le héros : lignes du titre, méta-rangée,
     légende, compteur. DWELL.slow (5,6 s) laisse lire les deux lignes. */
  const { i } = useSlides(HERO.length, DWELL.slow);
  const S = HERO[i];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const nom = clientName(sessionData) ?? fd?.businessName ?? "Prisme Formation";
  const ville = clientCity(sessionData) ?? "Paris";
  const metier = clientTrade(sessionData) ?? "Formation professionnelle";
  const phone = clientPhone(sessionData) ?? clientEmail(sessionData) ?? fd?.email ?? "01 43 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? clientEmail(sessionData) ?? fd?.email ?? "+33143000000").replace(/[^+\d]/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "inscription@prisme-formation.fr";
  const adresse = clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "75011", "Paris");
  const horaires = "Lun–Ven 9h–18h";

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: BODY, overflowX: "clip" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');

        /*
          ── Héros « liste immédiate » ──────────────────────────────────────
          Le catalogue est posé d'emblée, les trois formations visibles à la
          fois. L'annonce tient la ligne du haut : le titre à gauche, la
          certification et l'action à droite.
        */
        .i347-annonce {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.9fr);
          gap: clamp(24px, 4vw, 64px);
          align-items: end;
        }
        /* Chaque rangée du catalogue s'éclaire au survol : c'est un sommaire
           cliquable, il doit se comporter comme tel. */
        .i347-ligne { transition: background .3s ease, padding-left .3s ease; }
        .i347-ligne:hover { background: ${C.bgAlt}; padding-left: clamp(8px, 1.2vw, 18px); }
        .i347-bstats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0,1fr));
          gap: 0;
        }

        @media (max-width: 980px) { #i347-nav { display: none !important; } .i347-burger { display: flex !important; } }
          .aevia-action-mobile { display: inline-flex !important; }
        @media (max-width: 900px) {
          .i347-annonce { grid-template-columns: minmax(0,1fr); row-gap: 26px; align-items: start; }
          /* La description de la formation passerait à la ligne et casserait
             la grille du catalogue : sous 900 elle disparaît, le numéro et le
             nom suffisent. */
          .i347-ligne { grid-template-columns: clamp(28px,7vw,40px) minmax(0,1fr) !important; }
          .i347-ligne > span:last-child { display: none; }
          .i347-bstats { grid-template-columns: repeat(2, minmax(0,1fr)) !important; row-gap: 18px; }
          .i347-bstats > * { border-left: none !important; }
        }
        @media (max-width: 860px) {
          .i347-split { grid-template-columns: minmax(0,1fr) !important; }
          .i347-split > * { order: initial !important; }
          .i347-rangee { grid-template-columns: minmax(0,1fr) !important; gap: 14px !important; }
          .i347-rangee > * { order: initial !important; }
          .i347-decale { grid-template-columns: minmax(0,1fr) !important; }
          .i347-decale > * { margin-top: 0 !important; }
          .i347-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i347-sticky { position: static !important; }
        }
        /* Le geste écrit ses lignes en « nowrap » : sous 520 px on réduit le
           corps du titre plutôt que de laisser la ligne se faire rogner. */
        @media (max-width: 520px) {
          .i347-titre { font-size: clamp(21px, 6.2vw, 30px) !important; }
        }

        .i347-navlink { position: relative; }
        .i347-navlink::after {
          content: ""; position: absolute; left: 8px; bottom: 8px; height: 1.5px; width: 0;
          background: ${C.accent}; transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .i347-navlink:hover::after { width: calc(100% - 16px); }

        /* Détail gratuit : le sceau de certification qui respire lentement. */
        @keyframes i347-sceau {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.06); opacity: 1; }
        }
        .i347-sceau { animation: i347-sceau 6.4s cubic-bezier(0.16, 1, 0.3, 1) infinite; }

        @media (prefers-reduced-motion: reduce) {
          .i347-navlink::after { transition: none; }
          .i347-sceau { animation: none; }
        }
      `}</style>

      {/* ── NAV — collante à quatre propriétés : hauteur, fond, flou, filet ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: scrolled ? 62 : 78,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(20px, 4vw, 52px)",
          background: scrolled ? "rgba(246,247,250,0.93)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={nom} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <GraduationCap size={17} color={C.accent} aria-hidden style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: DISPLAY, fontSize: 18, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nom}</span>
              <span style={{ fontFamily: BODY, fontSize: 9.5, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textFaint, marginLeft: 8 }}>Qualiopi</span>
            </>
          )}
        </div>
        <div id="i347-nav" style={{ display: "flex", gap: 2, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} className="i347-navlink" style={{ fontFamily: BODY, color: C.textMuted, fontSize: 13.5, fontWeight: 500, textDecoration: "none", padding: "12px 8px" }}>
              {l}
            </a>
          ))}
          <motion.a
            href={telHref}
            style={{ background: C.accent, color: C.white, padding: "12px 22px", fontFamily: BODY, fontSize: 13, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap", marginLeft: 14, borderRadius: 2 }}
            whileHover={{ scale: 1.03, y: -1 }}
          >
            Dossier CPF
          </motion.a>
        </div>
        {/* L'appel à l'action sous le pouce : la barre est fixe, mais son
            bouton vit dans le menu déroulant, en display:none sous le point
            de rupture. Celui-ci paraît exactement avec le bouton de menu. */}
        <ActionMobile href={telHref} fond={C.accent} encre={C.white}>
          Appeler
        </ActionMobile>
        <button
          className="i347-burger"
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
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ fontFamily: BODY, color: C.ink, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "12px 0" }}>
              {l}
            </a>
          ))}
          <a href={telHref} style={{ background: C.accent, color: C.white, padding: "14px 22px", fontFamily: BODY, fontSize: 15, fontWeight: 600, textDecoration: "none", textAlign: "center", marginTop: 10, borderRadius: 2 }}>
            Dossier CPF
          </a>
        </div>
      )}

      {/* ── HÉROS H7 — magazine : méta-rangée, titre défilant, bandeau bas ── */}
      {/* ── HERO — liste immédiate ────────────────────────────────────────
             Un centre de formation se lit comme un catalogue, pas comme une
             affiche : les trois formations sont posées d'emblée, toutes les
             trois, au lieu de tourner une par une derrière une fraction
             01/03. Plus de méta-rangée ni de bandeau média en pied — ce sont
             les archétypes d'impact-331 et d'impact-341. */}
      <section
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "clamp(22px, 3vh, 38px)",
          padding: "clamp(118px, 13vh, 154px) 0 clamp(46px, 6vh, 76px)",
          background: C.bg,
          overflow: "hidden",
        }}
      >
        <TitreDeLaPage session={sessionData} />
        {/* Textures sans image : quadrillage de cahier, glow, chiffre fantôme. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.6,
            backgroundImage: "linear-gradient(rgba(18,22,43,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(18,22,43,0.028) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />
        <div
          aria-hidden
          style={{ position: "absolute", top: "-8%", right: "-6%", width: 560, height: 560, borderRadius: "50%", background: `radial-gradient(circle, ${C.accent} 0%, transparent 68%)`, opacity: 0.1, pointerEvents: "none" }}
        />

        <div className="i347-pad" style={{ position: "relative", width: "100%", maxWidth: 1240, margin: "0 auto", padding: "0 clamp(24px, 5vw, 64px)", display: "flex", flexDirection: "column", gap: "clamp(22px, 3vh, 38px)" }}>
          {/* L'annonce : d'où l'on parle, et la certification qui compte. */}
          <div className="i347-annonce">
            <div style={{ minWidth: 0 }}>
              <Kicker tone="accent">{clientEyebrow(sessionData) ?? `${metier} · ${ville}`}</Kicker>
              <h1
                className="i347-titre"
                style={{ fontFamily: DISPLAY, fontSize: "clamp(28px, 4.2vw, 56px)", fontWeight: 600, lineHeight: 1.02, letterSpacing: "-0.022em", color: C.ink, margin: "clamp(16px, 2vw, 24px) 0 0", maxWidth: 760, overflowWrap: "break-word" }}
              >
                {/*
                  Pas de LineScroll ici : il masque chaque ligne dans une
                  fenêtre en overflow hidden, prévue pour des lignes déjà
                  coupées à la main. Un titre d'un seul tenant s'y fait
                  TRONQUER au lieu de passer à la ligne — vérifié à l'écran,
                  « Des formations courtes, un » s'arrêtait net. La longueur
                  du titre vient du client : on ne peut pas la garantir.
                */}
                {/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ??
                  clientHeroLine(sessionData, 0, 1, 44) ??
                  "Des formations courtes, un formateur dans la salle."}
              </h1>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 18 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: BODY, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: C.accentDark }}>
                <BadgeCheck size={14} aria-hidden className="i347-sceau" />
                {STATS[0]?.value ?? "Qualiopi"}
              </span>
              <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: "clamp(14px, 1.2vw, 15.5px)", lineHeight: 1.78, color: C.textMuted, maxWidth: 360, margin: 0 }}>
                {clientAccrocheRestante(sessionData, 2, 22) ?? c?.heroSubline ?? "Bureautique, management, langues, digital : des formations courtes certifiées Qualiopi, finançables CPF et OPCO, avec un vrai formateur dans la salle — ou en visio, mais jamais un simple e-learning abandonné."}
              </p>
              {/* Une seule action pleine ; le catalogue reste un lien. */}
              <div style={{ display: "flex", gap: "clamp(14px, 2vw, 24px)", flexWrap: "wrap", alignItems: "center" }}>
                <motion.a
                  href={telHref}
                  style={{ background: C.accent, color: C.white, padding: "16px 30px", fontFamily: BODY, fontSize: 14.5, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, borderRadius: 2 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  Monter mon dossier CPF <ArrowRight size={16} aria-hidden />
                </motion.a>
                <a href="#services" style={{ fontFamily: BODY, fontSize: 13, color: C.ink, textDecoration: "none", borderBottom: `1px solid ${C.accent}`, paddingBottom: 3 }}>
                  Le catalogue
                </a>
              </div>
            </div>
          </div>

          {/* ── LES TROIS FORMATIONS, toutes visibles d'emblée ─────────────
               Le carrousel n'en montrait qu'une à la fois : deux tiers du
               catalogue passaient sous le pli. */}
          <nav aria-label="Nos formations" style={{ position: "relative", borderTop: `1px solid ${C.border}` }}>
            {HERO.map((h: any, n: number) => (
              <a
                key={h.k ?? n}
                href="#services"
                className="i347-ligne"
                style={{ display: "grid", gridTemplateColumns: "clamp(32px, 4vw, 54px) minmax(0, 1.1fr) minmax(0, 1fr)", alignItems: "baseline", gap: "clamp(12px, 2vw, 28px)", padding: "clamp(12px, 1.7vh, 20px) 0", borderBottom: `1px solid ${C.border}`, textDecoration: "none", color: "inherit" }}
              >
                <span style={{ fontFamily: BODY, fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", color: C.accentDark, fontVariantNumeric: "tabular-nums" }}>
                  {String(n + 1).padStart(2, "0")}
                </span>
                <span style={{ fontFamily: DISPLAY, fontSize: "clamp(18px, 2.2vw, 30px)", fontWeight: 600, lineHeight: 1.14, letterSpacing: "-0.018em", color: C.ink }}>
                  {h.k}
                </span>
                <span style={{ fontFamily: BODY, fontWeight: 300, fontSize: "clamp(13px, 1.15vw, 14.5px)", lineHeight: 1.65, color: C.textMuted }}>
                  {h.sub}
                </span>
              </a>
            ))}
          </nav>

          {/* Les chiffres publiés, en une seule ligne fine. */}
          <div className="i347-bstats">
            {STATS.map((s: any, idx: number) => (
              <div key={s.label} style={{ padding: "0 clamp(10px, 1.4vw, 20px)", borderLeft: idx === 0 ? "none" : `1px solid ${C.border}` }}>
                <div style={{ fontFamily: DISPLAY, fontSize: "clamp(19px, 2.2vw, 26px)", lineHeight: 1, color: C.accentDark }}>{s.value}</div>
                <div style={{ fontFamily: BODY, fontSize: 11.5, lineHeight: 1.45, color: C.textFaint, marginTop: 8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESPIRATION ──────────────────────────────────────────────────── */}
      <section className="i347-pad" style={{ background: C.bg, padding: "clamp(58px, 8vw, 104px) 64px clamp(30px, 4vw, 50px)", textAlign: "center" }}>
        <Reveal>
          <p style={{ fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(20px, 2.6vw, 31px)", lineHeight: 1.55, color: C.textMuted, maxWidth: 720, margin: "0 auto" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (
              <>
                Une formation ne se mesure pas en heures de présence. <span style={{ color: C.ink }}>Elle se mesure à ce qu'on sait faire le lundi suivant.</span>
              </>
            )}
          </p>
        </Reveal>
      </section>

      {/* ── QUALIOPI EN EXERGUE — plein cadre sombre, avant le catalogue ──── */}
      <section id="engagements" className="i347-pad" style={{ background: C.bgDark, color: C.white, padding: "clamp(76px, 9.5vw, 126px) 64px", position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.5,
            pointerEvents: "none",
            backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />
        <div
          aria-hidden
          style={{ position: "absolute", left: "-6%", bottom: "-14%", width: 560, height: 560, borderRadius: "50%", background: `radial-gradient(circle, ${C.accent} 0%, transparent 68%)`, opacity: 0.12, pointerEvents: "none" }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: "-2%",
            top: "-6%",
            fontFamily: DISPLAY,
            fontSize: "clamp(110px, 18vw, 260px)",
            lineHeight: 0.8,
            color: C.white,
            opacity: 0.035,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {STATS[3]?.value ?? "87 %"}
        </div>
        <div className="i347-split" style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.05fr)", gap: "clamp(34px, 5vw, 74px)", alignItems: "center", position: "relative" }}>
          <Reveal>
            <div>
              <Kicker tone="clair">La certification</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(28px, 4vw, 50px)", fontWeight: 600, lineHeight: 1.04, letterSpacing: "-0.02em", color: C.white, margin: "16px 0 20px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "qualiopi.titre") ?? (
                  <>
                    Qualiopi, <em style={{ fontStyle: "italic", color: C.certif }}>pas que le logo.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 15.5, lineHeight: 1.8, color: "rgba(255,255,255,0.66)", margin: "0 0 30px", maxWidth: 500 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "qualiopi.texte") ?? c?.aboutText ?? (
                  <>La certification n'est pas un macaron : c'est un audit qui vérifie que le positionnement, l'accessibilité et le suivi à froid existent vraiment. C'est aussi elle qui ouvre le CPF et les fonds OPCO.</>
                )}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
                {ENGAGEMENT.map((e: any, idx: number) => (
                  <div key={idx} style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
                    <CheckCircle size={16} color={C.certif} aria-hidden style={{ flexShrink: 0, marginTop: 3 }} />
                    <span style={{ fontFamily: BODY, fontSize: 14.5, fontWeight: 300, color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}>{e}</span>
                  </div>
                ))}
              </div>
              <motion.a
                href={telHref}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.certif, color: C.bgDarkAlt, padding: "15px 28px", fontFamily: BODY, fontSize: 14, fontWeight: 600, textDecoration: "none", borderRadius: 2 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                Vérifier mes droits <ArrowRight size={15} aria-hidden />
              </motion.a>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div style={{ position: "relative" }}>
              {/* Le héros ne porte plus de photographie : si le client n'en a
                   téléversé qu'une, elle se serait perdue. Elle prend cette
                   place à défaut de deuxième. */}
              <Plate src={photo(1, "") || photo(0, PHOTO_FALLBACK[1])} alt="Attestation de certification affichée au centre" ratio="4/5" label="Audit passé" sombre />
              {/* Détail gratuit : le sceau posé sur l'angle du panneau. */}
              <div
                className="i347-sceau"
                style={{
                  position: "absolute",
                  right: -18,
                  top: -18,
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  background: C.bgDarkAlt,
                  border: `1px solid ${C.certif}`,
                  display: "grid",
                  placeItems: "center",
                  textAlign: "center",
                  boxShadow: "0 20px 44px rgba(0,0,0,0.4)",
                }}
              >
                <div>
                  <BadgeCheck size={20} color={C.certif} aria-hidden />
                  <div style={{ fontFamily: BODY, fontSize: 8.5, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.66)", marginTop: 5 }}>
                    Certifié
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CATALOGUE — sommaire numéroté de magazine ─────────────────────── */}
      <section id="services" className="i347-pad" style={{ background: C.bg, padding: "clamp(76px, 9vw, 124px) 64px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <Reveal>
            <Kicker>Catalogue</Kicker>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.02em", color: C.ink, margin: "16px 0 14px", maxWidth: 700 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                <>
                  Des compétences <em style={{ fontStyle: "italic", color: C.accentDark }}>qui se certifient.</em>
                </>
              )}
            </h2>
            <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 15, lineHeight: 1.78, color: C.textMuted, maxWidth: 540, margin: "0 0 clamp(28px, 4vw, 44px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "services.chapeau") ?? (
                <>Six familles, un même principe : un niveau mesuré à l'entrée, un résultat mesuré à la sortie, et une certification qui vaut sur un CV.</>
              )}
            </p>
          </Reveal>
          <div style={{ borderBottom: `1px solid ${C.border}` }}>
            {SERVICES.map((s: any, idx: number) => (
              <Reveal key={s.titre} delay={(idx % 3) * 0.055} y={18}>
                <SommaireRow s={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── LE DÉROULÉ — rail vertical à points, titre épinglé ────────────── */}
      <section id="methode" className="i347-pad" style={{ background: C.bgAlt, padding: "clamp(76px, 9vw, 126px) 64px" }}>
        <div className="i347-split" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,0.8fr) minmax(0,1.2fr)", gap: "clamp(32px, 5vw, 70px)", alignItems: "start" }}>
          <div className="i347-sticky" style={{ position: "sticky", top: 110 }}>
            <Reveal>
              <Kicker>Le déroulé</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(26px, 3.6vw, 46px)", fontWeight: 600, lineHeight: 1.05, color: C.ink, margin: "16px 0 16px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                  <>
                    Avant, pendant, <em style={{ fontStyle: "italic", color: C.accentDark }}>après — et à froid.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 14.5, lineHeight: 1.78, color: C.textMuted, maxWidth: 380, margin: 0 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "methode.chapeau") ?? (
                  <>Quatre temps, aucun raccourci : c'est ce déroulé-là que l'audit vérifie, et c'est lui qui fait qu'une formation sert encore trois mois plus tard.</>
                )}
              </p>
              <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 10, fontFamily: BODY, fontSize: 12.5, color: C.textFaint }}>
                <Clock size={14} color={C.accent} aria-hidden />
                Convocations sous 48 h
              </div>
            </Reveal>
          </div>
          <div style={{ position: "relative", paddingLeft: "clamp(22px, 3vw, 34px)" }}>
            {/* Le rail : un filet dégradé, un point par étape. */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                top: 8,
                bottom: 8,
                width: 1,
                background: `linear-gradient(180deg, ${C.accent} 0%, ${C.border} 88%, transparent 100%)`,
              }}
            />
            {METHODE.map((m: any, idx: number) => (
              <Reveal key={m.n} delay={idx * 0.055} y={20}>
                <div style={{ position: "relative", padding: "0 0 clamp(28px, 3.6vw, 44px)" }}>
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: "calc(-1 * clamp(22px, 3vw, 34px) - 4.5px)",
                      top: 7,
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: C.bgAlt,
                      border: `2px solid ${C.accent}`,
                    }}
                  />
                  <div style={{ fontFamily: BODY, fontSize: 10, fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: C.accentDark, marginBottom: 10 }}>
                    Étape {m.n}
                  </div>
                  <h3 style={{ fontFamily: DISPLAY, fontSize: "clamp(19px, 2.2vw, 25px)", lineHeight: 1.24, color: C.ink, margin: "0 0 10px" }}>{m.t}</h3>
                  <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 14.5, lineHeight: 1.78, color: C.textMuted, margin: 0, maxWidth: 560 }}>{m.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINANCEMENTS — table fine ─────────────────────────────────────── */}
      <section id="tarifs" className="i347-pad" style={{ background: C.bg, padding: "clamp(76px, 9vw, 126px) 64px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <Kicker>Financements</Kicker>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(28px, 3.8vw, 48px)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.02em", color: C.ink, margin: "16px 0 14px", maxWidth: 640 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                <>
                  Souvent, <em style={{ fontStyle: "italic", color: C.accentDark }}>ça ne vous coûte rien.</em>
                </>
              )}
            </h2>
            <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 15, lineHeight: 1.78, color: C.textMuted, maxWidth: 580, margin: "0 0 clamp(28px, 4vw, 44px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.note") ?? (
                <>CPF pour les particuliers, OPCO pour les entreprises, plan de développement des compétences : on monte le dossier avec vous avant l'inscription.</>
              )}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 3, boxShadow: "0 22px 52px rgba(18,22,43,0.06)", overflow: "hidden" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0,1fr) auto",
                  gap: "clamp(14px, 2.4vw, 34px)",
                  padding: "14px clamp(14px, 2vw, 24px)",
                  borderBottom: `1px solid ${C.border}`,
                  background: C.bgAlt,
                }}
              >
                <span style={{ fontFamily: BODY, fontSize: 9.5, fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textFaint }}>Programme</span>
                <span style={{ fontFamily: BODY, fontSize: 9.5, fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textFaint }}>Tarif</span>
              </div>
              {TARIFS.map((t: any, idx: number) => (
                <TarifRow key={t.a} t={t} idx={idx} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── AVIS — trois colonnes décalées ────────────────────────────────── */}
      <section className="i347-pad" style={{ background: C.bgAlt, padding: "clamp(76px, 9vw, 126px) 64px", position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden
          style={{ position: "absolute", top: "-10%", left: "-6%", width: 480, height: 480, borderRadius: "50%", background: `radial-gradient(circle, ${C.accent} 0%, transparent 68%)`, opacity: 0.08, pointerEvents: "none" }}
        />
        <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <Kicker>Stagiaires</Kicker>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(26px, 3.6vw, 46px)", fontWeight: 600, lineHeight: 1.05, color: C.ink, margin: "16px 0 clamp(32px, 5vw, 54px)", maxWidth: 620 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                <>
                  Des compétences <em style={{ fontStyle: "italic", color: C.accentDark }}>qui restent.</em>
                </>
              )}
            </h2>
          </Reveal>
          <div className="i347-decale" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: "clamp(18px, 2.4vw, 30px)", alignItems: "start" }}>
            {AVIS.map((a: any, idx: number) => (
              <div key={a.auteur} style={{ marginTop: idx % 3 === 1 ? "clamp(0px, 4vw, 46px)" : idx % 3 === 2 ? "clamp(0px, 2vw, 22px)" : 0 }}>
                <Reveal delay={idx * 0.08} y={22}>
                  <figure
                    style={{
                      margin: 0,
                      background: C.white,
                      border: `1px solid ${C.border}`,
                      borderRadius: 3,
                      padding: "clamp(26px, 3vw, 36px)",
                      boxShadow: "0 18px 44px rgba(18,22,43,0.06)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        position: "absolute",
                        right: 14,
                        top: -14,
                        fontFamily: DISPLAY,
                        fontSize: 120,
                        lineHeight: 0.8,
                        color: C.ink,
                        opacity: 0.05,
                        pointerEvents: "none",
                        userSelect: "none",
                      }}
                    >
                      «
                    </span>
                    <div style={{ display: "flex", gap: 3, marginBottom: 15, position: "relative" }}>
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={12} fill={C.accent} color={C.accent} aria-hidden />
                      ))}
                    </div>
                    <blockquote style={{ fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 300, fontSize: 15.5, lineHeight: 1.78, color: C.ink, margin: "0 0 20px", position: "relative" }}>
                      {a.texte}
                    </blockquote>
                    <figcaption style={{ borderTop: `1px solid ${C.borderSoft}`, paddingTop: 14 }}>
                      <div style={{ fontFamily: BODY, fontSize: 13.5, fontWeight: 600, color: C.ink }}>{a.auteur}</div>
                      <div style={{ fontFamily: BODY, fontSize: 11.5, letterSpacing: "0.08em", color: C.textFaint, marginTop: 5 }}>{a.detail}</div>
                    </figcaption>
                  </figure>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <section id="contact" className="i347-pad" style={{ background: C.bg, padding: "clamp(76px, 9.5vw, 126px) 64px", position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: "-3%",
            bottom: "-18%",
            fontFamily: DISPLAY,
            fontSize: "clamp(110px, 19vw, 260px)",
            lineHeight: 0.8,
            color: C.ink,
            opacity: 0.035,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          48 h
        </div>
        <div className="i347-split" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1.08fr) minmax(0,0.92fr)", gap: "clamp(34px, 5vw, 70px)", alignItems: "center", position: "relative" }}>
          <Reveal>
            <div>
              <Kicker tone="accent">On en parle ?</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(28px, 4vw, 50px)", fontWeight: 600, lineHeight: 1.04, color: C.ink, margin: "16px 0 18px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                  <>
                    Dix minutes pour vérifier <em style={{ fontStyle: "italic", color: C.accentDark }}>vos droits à formation.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 15.5, lineHeight: 1.78, color: C.textMuted, maxWidth: 460, margin: "0 0 26px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ?? (
                  <>Bilan CPF/OPCO gratuit par téléphone. Convocations sous 48 h une fois le dossier accepté.</>
                )}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 10 }}>
                {REPERES.map((r: any, idx: number) => (
                  <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontFamily: BODY, fontSize: 14, fontWeight: 300, color: C.textMuted, lineHeight: 1.6 }}>
                    <span aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, marginTop: 8, flexShrink: 0 }} />
                    {r}
                  </li>
                ))}
              </ul>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <motion.a
                  href={telHref}
                  style={{ background: C.accent, color: C.white, padding: "16px 32px", fontFamily: BODY, fontSize: 15.5, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, borderRadius: 2 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <Phone size={17} aria-hidden /> {phone}
                </motion.a>
                <motion.a
                  href={`mailto:${mail}`}
                  style={{ background: "transparent", color: C.ink, border: `1.5px solid ${C.accent}`, padding: "15px 28px", fontFamily: BODY, fontSize: 15.5, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, borderRadius: 2 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <Mail size={17} aria-hidden /> Nous écrire
                </motion.a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, padding: "clamp(24px, 3vw, 36px)", boxShadow: "0 26px 60px rgba(18,22,43,0.08)", borderRadius: 3 }}>
              {[
                { icon: MapPin, label: "Centre de formation", value: adresse },
                { icon: Phone, label: "Téléphone", value: phone, href: telHref },
                { icon: Mail, label: "E-mail", value: mail, href: `mailto:${mail}` },
                { icon: Clock, label: "Horaires", value: horaires },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} style={{ display: "flex", gap: 15, alignItems: "flex-start", padding: "14px 0", borderTop: idx > 0 ? `1px solid ${C.borderSoft}` : "none" }}>
                    <div style={{ width: 38, height: 38, background: C.accentLight, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.accentDark, flexShrink: 0, borderRadius: 2 }}>
                      <Icon size={16} aria-hidden />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: BODY, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.textFaint }}>{item.label}</div>
                      {item.href ? (
                        <a href={item.href} style={{ fontFamily: DISPLAY, fontSize: 15.5, color: C.ink, textDecoration: "none" }}>{item.value}</a>
                      ) : (
                        <div style={{ fontFamily: DISPLAY, fontSize: 15.5, color: C.ink, lineHeight: 1.45 }}>{item.value}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="i347-pad" style={{ background: C.bgDarkAlt, color: "rgba(255,255,255,0.5)", padding: "clamp(46px, 6vw, 70px) 64px 24px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 34 }}>
            <div style={{ maxWidth: 340 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
                <GraduationCap size={16} color={C.certif} aria-hidden />
                <span style={{ fontFamily: DISPLAY, fontSize: 18, color: C.white }}>{nom}</span>
              </div>
              <p style={{ fontFamily: BODY, fontSize: 13, fontWeight: 300, lineHeight: 1.75, color: "rgba(255,255,255,0.42)", margin: 0 }}>
                Organisme de formation certifié Qualiopi · {clientCodePostalVille(sessionData, "75011", "Paris")}
                <br />
                NDA 11 75 61234 75 — éligible CPF et OPCO
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <span style={{ fontFamily: BODY, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>Navigation</span>
              {NAV.map(({ l, h }) => (
                <a key={l} href={h} style={{ fontFamily: BODY, fontSize: 13, color: "rgba(255,255,255,0.42)", textDecoration: "none", padding: "2px 0" }}>
                  {l}
                </a>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <span style={{ fontFamily: BODY, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>Nous joindre</span>
              <span style={{ fontFamily: BODY, fontSize: 13, color: "rgba(255,255,255,0.42)", display: "flex", gap: 9, alignItems: "center" }}>
                <MapPin size={13} aria-hidden /> {adresse}
              </span>
              <a href={telHref} style={{ fontFamily: DISPLAY, fontSize: 16, color: C.certif, textDecoration: "none" }}>{phone}</a>
              <span style={{ fontFamily: BODY, fontSize: 13, color: "rgba(255,255,255,0.42)", display: "flex", gap: 9, alignItems: "center", lineHeight: 1.5 }}>
                <Clock size={13} aria-hidden /> {horaires}
              </span>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontFamily: BODY, fontSize: 12, color: "rgba(255,255,255,0.38)" }}>
              © {new Date().getFullYear()} {nom} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
              {/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ fontFamily: BODY, fontSize: 12, color: "rgba(255,255,255,0.38)" }}>
              Mentions légales : éditeur {nom} · hébergement Vercel Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
