"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Check, Ear, Mail, MapPin, Phone, Volume2 } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, HairlineArrows, SlideIndex, WordFlight, useSlides } from "@/lib/templates/hero-kit-2";
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
   OCTAVE AUDITION — audioprothésiste urbain · Nantes

   Archétype héros H1 : split, média à droite. Paire de fontes P8
   (Newsreader / Manrope). Palette sable #f8f6f1 et ambre #b45309.

   Geste signature : WordFlight (hero-kit-2). Chaque mot du titre entre depuis
   son propre masque, décalé de 55 ms — la phrase ne s'affiche pas, elle
   s'assemble. C'est très exactement le sujet du métier : les mots qui volent
   sont les mots retrouvés. Un seul index (`useSlides`) pilote le titre, le
   sur-titre, la légende et la vignette du média.

   Aucune photographie n'est obligatoire : le média du héros, la vignette de
   méthode et le portrait d'engagement se replient sur des aplats et une
   courbe de gain dessinée en CSS. La page se tient images bloquées.
   ════════════════════════════════════════════════════════════════════════════ */

const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,600;1,6..72,300;1,6..72,400&family=Manrope:wght@300;400;500;600;700&display=swap');`;

const SERIF = "'Newsreader', Georgia, 'Times New Roman', serif";
const SANS = "'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif";

/* Un seul easing pour tout le thème, répété littéralement en CSS plus bas. */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

let C: Record<string, string> = {
  bg: "#f8f6f1",
  bgAlt: "#f1ece2",
  bgCard: "#ffffff",
  bgDark: "#17120c",
  bgDarkAlt: "#0f0b07",
  accent: "var(--brand,#b45309)",
  accentDark: "var(--brand-light,#8a3f07)",
  accentLight: "#f6e6d2",
  ink: "#1b1611",
  textMuted: "#6b5f51",
  textFaint: "#9c8e7d",
  border: "#e4dbcc",
  white: "#ffffff",
  /* clé métier : la couleur de la courbe de gain, plus claire que l'accent
     pour rester lisible sur les fonds sombres. */
  onde: "#d99a4e",
};

const NAV = [
  { l: "Technologie", h: "#services" },
  { l: "Le protocole", h: "#methode" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* Les trois facettes du métier. La première reçoit l'accroche du client. */
const HERO_SOURCE = [
  {
    k: "Conversations",
    line: "Chaque mot compte. Surtout ceux qu'on ratait.",
    sub: "Réduction de bruit ciblée sur la parole.",
    legende: "Gain mesuré au tympan, bande par bande",
  },
  {
    k: "Musique",
    line: "Le piano retrouve ses aigus, la salle son relief.",
    sub: "Programmes dédiés musique, réglés à l'oreille.",
    legende: "Programme musique — dynamique préservée",
  },
  {
    k: "Connecté",
    line: "Le téléphone sonne directement dans l'oreille.",
    sub: "Bluetooth, télé, visio — appairés au centre.",
    legende: "Streaming direct, sans boîtier intermédiaire",
  },
];
let HERO = HERO_SOURCE;

const SERVICES_SOURCE = [
  {
    titre: "Mesure in-vivo",
    desc: "Micro-sonde au tympan : on mesure ce que VOTRE oreille reçoit vraiment, pas la moyenne du fabricant. Le réglage devient objectif.",
    tag: "Précision",
  },
  {
    titre: "Cabine d'environnements",
    desc: "Restaurant, rue, open-space simulés en cabine : vos appareils sont réglés dans les situations qui vous posent problème.",
    tag: "Réel",
  },
  {
    titre: "Appareils connectés",
    desc: "Streaming téléphone et télé, réglages à distance entre deux rendez-vous, application de suivi de port.",
    tag: "Connecté",
  },
  {
    titre: "Intra invisibles",
    desc: "Empreinte numérique 3D, coque imprimée sur mesure : des intras profonds réellement invisibles, quand l'anatomie le permet — on vous le dit avant.",
    tag: "Discrétion",
  },
  {
    titre: "Suivi augmenté",
    desc: "Statistiques de port et d'environnement analysées à chaque contrôle : le réglage évolue avec votre vie, pas au hasard.",
    tag: "Suivi",
  },
  {
    titre: "Ateliers proches aidants",
    desc: "Une heure pour les proches : comment parler, se placer, régler la télé. L'appareillage réussit mieux à deux.",
    tag: "Aidants",
  },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE = [
  {
    n: "01",
    t: "Audiométrie complète",
    d: "Tonale, vocale, dans le bruit. Compte rendu chiffré remis et envoyé à votre ORL.",
  },
  {
    n: "02",
    t: "Réglage in-vivo",
    d: "La sonde au tympan objective le gain réel. Deux appareils candidats, comparés à l'aveugle.",
  },
  {
    n: "03",
    t: "Un mois de terrain",
    d: "Port en vie réelle, données de port analysées, réglage à mi-parcours. Adoption seulement si l'amélioration est mesurable.",
  },
  {
    n: "04",
    t: "Contrôles semestriels",
    d: "Audition re-testée, appareils re-mesurés, pièces d'usure remplacées. Quatre ans inclus.",
  },
];

const ENGAGEMENT_DEMO = [
  "Audioprothésistes diplômés d'État, formation continue constructeurs certifiée",
  "Devis normalisé avec offre 100 % Santé classe I systématiquement chiffrée",
  "Essai 30 jours : vous ne payez qu'à l'adoption, résultats mesurés à l'appui",
  "Tiers payant intégral Sécurité sociale + mutuelles",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

const TARIFS_DEMO = [
  {
    a: "Classe I — 100 % Santé",
    p: "0 € de reste à charge",
    n: "Appareils plafonnés 950 €, remboursés intégralement. Suivi 4 ans inclus.",
  },
  {
    a: "Classe II — technologies avancées",
    p: "dès 1 290 €",
    n: "Streaming, rechargeable, réduction de bruit IA. Reste à charge simulé avec votre mutuelle.",
  },
  {
    a: "Test auditif + démonstration",
    p: "gratuit",
    n: "Audiométrie complète et essai immédiat en cabine d'environnements.",
  },
  {
    a: "Bouchons musiciens sur mesure",
    p: "dès 119 €",
    n: "Filtres interchangeables, atténuation plate certifiée.",
  },
];
let TARIFS = TARIFS_DEMO;

const AVIS_SOURCE = [
  {
    texte:
      "Ingénieur, j'avais besoin de comprendre : la mesure in-vivo m'a convaincu. On voit littéralement la courbe se corriger. En réunion, je ne devine plus, j'entends.",
    auteur: "Bertrand C., 58 ans",
    detail: "Mesure in-vivo + classe II",
  },
  {
    texte:
      "La cabine qui simule le restaurant a tout changé : mes appareils précédents, réglés « en silence », étaient inutilisables dehors. Ceux-ci fonctionnent partout.",
    auteur: "Annick M.",
    detail: "Ré-appareillage",
  },
  {
    texte:
      "L'atelier proches aidants avec ma fille a évité tous les malentendus du début. Elle sait se placer, je porte mes appareils du matin au soir.",
    auteur: "Georges L., 79 ans",
    detail: "Premier appareillage",
  },
];
let AVIS_DEMO = AVIS_SOURCE;

const STATS_DEMO = [
  { value: "in-vivo", label: "Mesure au tympan, pas en moyenne" },
  { value: "30 j", label: "D'essai en conditions réelles" },
  { value: "0 €", label: "Classe I sans reste à charge" },
  { value: "98 %", label: "De porteurs suivis à un an" },
];
let STATS = STATS_DEMO;

/* La bande de « mots retrouvés » reprend les tags des prestations : rien
   d'inventé, le vocabulaire du thème remis en mouvement. */
const MOTS_DEMO = SERVICES_SOURCE.map((s) => s.tag);
let MOTS = MOTS_DEMO;

/* Courbe de gain dessinée en CSS — jamais une donnée de patient, une
   illustration. Onze points, en pourcentage de la boîte. */
const COURBE = [8, 14, 21, 30, 42, 52, 61, 67, 74, 79, 83];

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
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -8% 0px" });
  return (
    <motion.div
      ref={ref}
      style={style}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.95, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Kicker : filet de 40 × 1 px puis capitales très espacées. */
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
        style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, letterSpacing: "0.36em", textTransform: "uppercase", color, }}
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
  right = false,
  top = -28,
  size = "clamp(120px, 22vw, 260px)",
  color = "rgba(180,83,9,0.07)",
}: {
  children: React.ReactNode;
  right?: boolean;
  top?: number;
  size?: string;
  color?: string;
}) {
  return (
    <span
      aria-hidden
      style={{ position: "absolute", top, [right ? "right" : "left"]: -12, fontFamily: SERIF, fontSize: size, lineHeight: 0.8, color, pointerEvents: "none", userSelect: "none", zIndex: 0, }}
    >
      {children}
    </span>
  );
}

/** Le média de repli du héros : une courbe de gain tracée en CSS pur. */
function CourbeDeGain({ legende, index }: { legende: string; index: number }) {
  return (
    <div
      className="i340-courbe"
      style={{ position: "relative", background: `linear-gradient(155deg, ${C.bgDark} 0%, ${C.bgDarkAlt} 62%, #241a10 100%)`, border: `1px solid ${C.border}`, borderRadius: 2, padding: "clamp(22px, 3vw, 34px)", overflow: "hidden", minHeight: "clamp(320px, 42vw, 460px)", display: "flex", flexDirection: "column", justifyContent: "space-between", }}
    >
      {/* trame de fond : lignes de fréquence */}
      <div
        aria-hidden
        style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(to right, rgba(255,255,255,0.055) 0 1px, transparent 1px 11.11%), repeating-linear-gradient(to bottom, rgba(255,255,255,0.04) 0 1px, transparent 1px 20%)", pointerEvents: "none", }}
      />
      {/* halo radial, sous 0.12 d'opacité */}
      <div
        aria-hidden
        style={{ position: "absolute", inset: 0, background: `radial-gradient(60% 50% at 68% 30%, rgba(217,154,78,0.11), transparent 70%)`, pointerEvents: "none", }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <span
          style={{ fontFamily: SANS, fontSize: 10, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase", color: C.onde, }}
        >
          125 Hz — 8 kHz
        </span>
      </div>

      {/* la courbe : onze pastilles posées en pourcentage */}
      <div style={{ position: "relative", flex: 1, margin: "22px 0 18px", minHeight: 150 }}>
        {COURBE.map((v, n) => (
          <motion.span
            key={`${index}-${n}`}
            aria-hidden
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: EASE, delay: n * 0.055 }}
            style={{ position: "absolute", left: `${(n / (COURBE.length - 1)) * 100}%`, bottom: `${v}%`, width: 9, height: 9, marginLeft: -4.5, borderRadius: "50%", background: n % 2 === 0 ? C.onde : "rgba(217,154,78,0.5)", boxShadow: "0 0 0 4px rgba(217,154,78,0.10)", }}
          />
        ))}
        <div
          aria-hidden
          style={{ position: "absolute", left: 0, right: 0, bottom: "8%", height: 1, background: "linear-gradient(to right, rgba(217,154,78,0.55), rgba(217,154,78,0.05))", }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{ fontFamily: SERIF, fontSize: "clamp(15px, 1.5vw, 18px)", fontStyle: "italic", color: "rgba(255,255,255,0.86)", lineHeight: 1.5, }}
        >
          {legende}
        </div>
        <div
          style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.36)", marginTop: 9, }}
        >
          Illustration — courbe de gain
        </div>
      </div>
    </div>
  );
}

/** Photo du client à cet emplacement, sinon le repli du thème. */
function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ════════════════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════════════════ */

export default function OctaveAuditionPage() {
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

  /*
    Le titre du héros porte l'accroche du client sur sa première facette. Le
    gabarit est large (WordFlight replie les mots), d'où un maxLigne de 52 sur
    une seule ligne logique ; les deux autres facettes restent celles du thème,
    qui décrivent des spécialités du métier et non l'entreprise.
  */
  const ACCROCHE = clientHeroLine(sessionData, 0, 1, 52) ?? clientTagline(sessionData);
  HERO = ACCROCHE
    ? HERO_SOURCE.map((h, n) => (n === 0 ? { ...h, line: ACCROCHE } : h))
    : HERO_SOURCE;

  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, n: number) => ({
      ...SERVICES_SOURCE[n % SERVICES_SOURCE.length],
      titre: s.title,
    })),
    SERVICES_SOURCE,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, n: number) => ({
      ...AVIS_SOURCE[n % AVIS_SOURCE.length],
      auteur: r.author,
      texte: r.text,
    })),
    AVIS_SOURCE,
  );
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s: any, n: number) => ({
      ...TARIFS_DEMO[n % TARIFS_DEMO.length],
      a: s.title,
      p: s.price ?? TARIFS_DEMO[n % TARIFS_DEMO.length].p,
      n: s.desc || s.description || TARIFS_DEMO[n % TARIFS_DEMO.length].n,
    })),
    TARIFS_DEMO,
  );
  STATS = resolveList(clientStats(sessionData), STATS_DEMO);
  ENGAGEMENT = resolveList(clientCertifications(sessionData), ENGAGEMENT_DEMO);
  MOTS = clientList(sessionData, "mots.liste") ?? MOTS_DEMO;

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
  const [hoverService, setHoverService] = useState<number | null>(null);
  const [hoverTarif, setHoverTarif] = useState<number | null>(null);
  const [avisIdx, setAvisIdx] = useState(0);

  /* Un seul index pilote tout le héros : titre, sur-titre, légende, courbe. */
  const { i, next, prev } = useSlides(HERO.length, DWELL.normal);
  const S = HERO[i];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = clientPhone(sessionData) ?? fd?.phone ?? "02 40 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33240000000").replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "contact@octave-audition.fr";
  const ville = clientCity(sessionData) ?? "Nantes";
  const maison = fd?.businessName ?? clientName(sessionData) ?? "Octave Audition";
  const metier = clientTrade(sessionData) ?? "Audioprothésiste";
  const adresse = clientAddress(sessionData);
  /* Emplacement 0 : le média du héros, sans repli — la courbe CSS le remplace.
     Emplacement 1 : le portrait d'engagement, dont le thème a déjà une image. */
  const HERO_MEDIA = photo(0, "");
  const PORTRAIT = photo(
    1,
    "https://images.pexels.com/photos/8000615/pexels-photo-8000615.jpeg?auto=compress&cs=tinysrgb&w=1400",
  );
  const avis = AVIS[avisIdx % AVIS.length];

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip" }}>
      <style>{`
        ${FONTS_CSS}
        .i340-link { position: relative; }
        .i340-link::after {
          content: ""; position: absolute; left: 0; bottom: 6px; height: 1px; width: 0;
          background: ${C.accent}; transition: width .5s cubic-bezier(0.16,1,0.3,1);
        }
        .i340-link:hover::after { width: 100%; }
        .i340-arrow { transition: transform .5s cubic-bezier(0.16,1,0.3,1); }
        .i340-cta:hover .i340-arrow { transform: translateX(6px); }

        .i340-hero { display: grid; grid-template-columns: minmax(0,1.06fr) minmax(0,0.94fr); gap: clamp(32px, 5vw, 72px); align-items: center; }
        .i340-split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(28px, 5vw, 64px); align-items: center; }
        .i340-row { display: grid; grid-template-columns: 82px minmax(0,1.05fr) minmax(0,1.25fr); gap: clamp(16px, 2.4vw, 34px); align-items: start; }
        .i340-tarif { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: clamp(14px, 2vw, 30px); align-items: baseline; }
        .i340-piste { display: grid; grid-template-columns: 60px minmax(0,1fr); gap: clamp(14px, 2vw, 26px); align-items: start; }
        .i340-contact { display: grid; grid-template-columns: minmax(0,1.1fr) minmax(0,0.9fr); gap: clamp(28px, 5vw, 70px); align-items: start; }

        .i340-marquee-wrap { overflow: hidden; }
        .i340-marquee { display: inline-flex; white-space: nowrap; animation: i340glide 34s linear infinite; }
        @keyframes i340glide { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        @media (prefers-reduced-motion: reduce) {
          .i340-marquee { animation: none !important; }
        }
        @media (max-width: 900px) {
          #i340-nav { display: none !important; }
          .i340-burger { display: flex !important; }
        }
        @media (max-width: 980px) {
          .i340-hero { grid-template-columns: 1fr !important; }
          .i340-contact { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 860px) {
          .i340-split { grid-template-columns: 1fr !important; }
          .i340-row { grid-template-columns: 1fr !important; gap: 10px !important; }
          .i340-stats { grid-template-columns: 1fr 1fr !important; }
          .i340-pad { padding-left: 22px !important; padding-right: 22px !important; }
          .i340-sticky { position: static !important; }
        }
        @media (max-width: 560px) {
          .i340-stats { grid-template-columns: 1fr !important; }
          .i340-tarif { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: scrolled ? "12px clamp(20px,4vw,52px)" : "22px clamp(20px,4vw,52px)", background: scrolled ? "rgba(248,246,241,0.94)" : "transparent", backdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none", WebkitBackdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "padding .55s cubic-bezier(0.16,1,0.3,1), background .55s cubic-bezier(0.16,1,0.3,1), border-color .55s cubic-bezier(0.16,1,0.3,1), backdrop-filter .55s cubic-bezier(0.16,1,0.3,1)", }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={maison}
              style={{ height: 32, maxWidth: 170, objectFit: "contain", display: "block" }}
            />
          ) : (
            <>
              <Volume2 size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span
                style={{ fontFamily: SERIF, fontSize: "clamp(17px, 2vw, 21px)", letterSpacing: "-0.01em", color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", }}
              >
                {maison}
              </span>
            </>
          )}
        </div>
        <div id="i340-nav" style={{ display: "flex", gap: 26, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a
              key={l}
              href={h}
              className="i340-link"
              style={{ color: C.textMuted, fontSize: 13.5, fontWeight: 500, letterSpacing: "0.02em", textDecoration: "none", padding: "12px 2px", }}
            >
              {l}
            </a>
          ))}
          <motion.a
            href={telHref}
            className="i340-cta"
            style={{ background: C.accent, color: C.white, borderRadius: 2, padding: "13px 24px", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textDecoration: "none", whiteSpace: "nowrap", }}
            whileHover={{ y: -2, boxShadow: "0 10px 24px rgba(180,83,9,0.24), 0 2px 6px rgba(27,22,17,0.12)" }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            Test auditif gratuit
          </motion.a>
        </div>
        <button
          className="i340-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44, }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all .3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all .3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all .3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div
          style={{ position: "fixed", top: 62, left: 0, right: 0, zIndex: 99, background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "18px 26px 22px", display: "flex", flexDirection: "column", gap: 2, }}
        >
          {NAV.map(({ l, h }) => (
            <a
              key={l}
              href={h}
              onClick={() => setMobileOpen(false)}
              style={{ color: C.ink, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "13px 0" }}
            >
              {l}
            </a>
          ))}
          <a
            href={telHref}
            style={{ background: C.accent, color: C.white, borderRadius: 2, padding: "14px 22px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 8, }}
          >
            Test auditif gratuit
          </a>
        </div>
      )}

      {/* ── HÉROS — H1 split, média à droite ────────────────────────────── */}
      <section
        className="i340-hero i340-pad"
        style={{ minHeight: "100dvh", padding: "clamp(120px, 15vh, 168px) clamp(22px, 5vw, 68px) clamp(56px, 8vh, 88px)", maxWidth: 1240, margin: "0 auto", position: "relative", }}
      >
        <Ghost top={64} size="clamp(150px, 26vw, 320px)">{"("}</Ghost>

        <div style={{ position: "relative", zIndex: 1, minWidth: 0 }}>
          <Kicker>{clientEyebrow(sessionData) ?? `${metier} · ${ville}`}</Kicker>

          <h1
            style={{ fontFamily: SERIF, fontSize: "clamp(34px, 4.9vw, 62px)", fontWeight: 400, letterSpacing: "-0.022em", lineHeight: 0.99, color: C.ink, margin: "clamp(18px, 2.6vw, 28px) 0 0", minHeight: "2.6em", }}
          >
            <WordFlight text={S.line} keyed={i} className="" />
          </h1>

          <p
            style={{ fontFamily: SANS, fontSize: "clamp(15px, 1.5vw, 17px)", color: C.textMuted, lineHeight: 1.78, maxWidth: 480, margin: "clamp(16px, 2vw, 24px) 0 clamp(26px, 3.4vw, 38px)", }}
          >
            {clientHeroSubtitle(sessionData) ??
              c?.heroSubline ??
              "Appareils connectés, réglages par l'oreille ET par la donnée : mesure in-vivo, environnements sonores réels, application de suivi. L'audition, traitée comme une science exacte."}
          </p>

          <div style={{ display: "flex", gap: 13, flexWrap: "wrap", alignItems: "center" }}>
            <motion.a
              href={telHref}
              className="i340-cta"
              style={{ background: C.accent, color: C.white, borderRadius: 2, padding: "16px 30px", fontWeight: 700, fontSize: 14.5, letterSpacing: "0.03em", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, }}
              whileHover={{ y: -2, boxShadow: "0 14px 30px rgba(180,83,9,0.26), 0 3px 8px rgba(27,22,17,0.14)" }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              Tester mon audition <ArrowRight size={16} className="i340-arrow" />
            </motion.a>
            <motion.a
              href="#services"
              style={{ background: "transparent", color: C.ink, border: `1px solid ${C.border}`, borderRadius: 2, padding: "15px 26px", fontWeight: 600, fontSize: 14.5, textDecoration: "none", }}
              whileHover={{ borderColor: C.accent, backgroundColor: C.accentLight }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              La technologie
            </motion.a>
          </div>

          <div
            style={{ display: "flex", alignItems: "center", gap: 16, marginTop: "clamp(32px, 4.6vw, 52px)", paddingTop: 20, borderTop: `1px solid ${C.border}`, flexWrap: "wrap", }}
          >
            <SlideIndex i={i} total={HERO.length} variant="fraction" color={C.textFaint} className="" />
            <span style={{ fontSize: 13.5, color: C.textMuted, lineHeight: 1.6 }}>
              <strong style={{ color: C.ink, fontWeight: 700 }}>{S.k}</strong> — {S.sub}
            </span>
            <HairlineArrows onPrev={prev} onNext={next} color={C.ink} className="" />
          </div>
        </div>

        {/* Média : la photo du client si elle existe, sinon la courbe CSS. */}
        <div style={{ position: "relative", zIndex: 1, minWidth: 0 }}>
          {HERO_MEDIA ? (
            <div
              style={{ position: "relative", border: `1px solid ${C.border}`, background: C.bgDark, overflow: "hidden", borderRadius: 2, }}
            >
              <img
                src={HERO_MEDIA}
                alt={`${maison} — ${S.k}`}
                loading="eager"
                style={{ width: "100%", height: "auto", aspectRatio: "4/5", objectFit: "cover", display: "block" }}
              />
              <div
                style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "40px 22px 18px", background: "linear-gradient(to top, rgba(23,18,12,0.88), rgba(23,18,12,0.35) 55%, transparent)", fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(14px, 1.4vw, 17px)", color: "rgba(255,255,255,0.9)", }}
              >
                {S.legende}
              </div>
            </div>
          ) : (
            <CourbeDeGain legende={S.legende} index={i} />
          )}
        </div>
      </section>

      {/* ── RESPIRATION ─────────────────────────────────────────────────── */}
      <section
        className="i340-pad"
        style={{ background: C.bgAlt, padding: "clamp(58px, 9vw, 104px) clamp(22px, 5vw, 68px)", textAlign: "center", position: "relative", overflow: "hidden", }}
      >
        <div
          aria-hidden
          style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(to right, transparent, ${C.border}, transparent)`, }}
        />
        <p
          style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(21px, 3.1vw, 36px)", lineHeight: 1.44, letterSpacing: "-0.012em", color: C.ink, maxWidth: 760, margin: "0 auto", }}
        >
          {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (
            <>
              L'audition, traitée comme <em style={{ color: C.accent }}>une science exacte</em>.
            </>
          )}
        </p>
      </section>

      {/* ── LES MOTS RETROUVÉS — bande filante ──────────────────────────── */}
      <section
        style={{ background: C.bg, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "clamp(20px, 3vw, 30px) 0", }}
      >
        <div className="i340-marquee-wrap">
          <div className="i340-marquee">
            {[0, 1].map((copie) => (
              <span key={copie} style={{ display: "inline-flex", alignItems: "center" }}>
                {MOTS.map((m, n) => (
                  <span key={`${copie}-${n}`} style={{ display: "inline-flex", alignItems: "center" }}>
                    <span
                      style={{ fontFamily: SERIF, fontSize: "clamp(20px, 3vw, 34px)", fontStyle: n % 2 === 1 ? "italic" : "normal", color: n % 2 === 1 ? C.accent : C.textFaint, padding: "0 clamp(16px, 2.4vw, 30px)", whiteSpace: "nowrap", }}
                    >
                      {m}
                    </span>
                    <span aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", background: C.border, flexShrink: 0 }} />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHIFFRES — bande à filets ───────────────────────────────────── */}
      <section
        className="i340-pad"
        style={{ background: C.bg, padding: "clamp(52px, 7vw, 84px) clamp(22px, 5vw, 68px)", position: "relative", }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div
            className="i340-stats"
            style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 0 }}
          >
            {STATS.map((s, n) => (
              <Reveal key={`${s.label}-${n}`} delay={n * 0.055}>
                <div
                  style={{ padding: "clamp(14px, 2vw, 26px) clamp(12px, 2vw, 24px)", borderLeft: `1px solid ${C.border}`, height: "100%", }}
                >
                  <div
                    style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4.2vw, 50px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1, color: C.accent, }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{ fontFamily: SANS, fontSize: 12.5, lineHeight: 1.6, color: C.textMuted, marginTop: 12, maxWidth: 210, }}
                  >
                    {s.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRESTATIONS — rangées éditoriales numérotées ─────────────────── */}
      <section
        id="services"
        className="i340-pad"
        style={{ background: C.bgAlt, padding: "clamp(74px, 10vw, 126px) clamp(22px, 5vw, 68px)", position: "relative", overflow: "hidden", }}
      >
        <Ghost right top={30} size="clamp(160px, 28vw, 340px)" color="rgba(27,22,17,0.045)">
          {"01"}
        </Ghost>
        <div style={{ maxWidth: 1140, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal>
            <Kicker>Technologie</Kicker>
            <h2
              style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(28px, 4.1vw, 50px)", lineHeight: 1.06, letterSpacing: "-0.022em", color: C.ink, margin: "18px 0 clamp(34px, 5vw, 58px)", maxWidth: 700, }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                <>
                  Des appareils réglés
                  <br />
                  <em style={{ color: C.accent }}>sur vos pixels sonores.</em>
                </>
              )}
            </h2>
          </Reveal>

          <div>
            {SERVICES.map((s, n) => (
              <Reveal key={`${s.titre}-${n}`} delay={n * 0.05}>
                <div
                  className="i340-row"
                  onMouseEnter={() => setHoverService(n)}
                  onMouseLeave={() => setHoverService(null)}
                  style={{ padding: "clamp(22px, 3vw, 34px) clamp(12px, 2vw, 22px)", borderTop: `1px solid ${C.border}`, background: hoverService === n ? C.bgCard : "transparent", transform: hoverService === n ? "translateY(-3px)" : "none", boxShadow: hoverService === n ? "0 18px 34px rgba(27,22,17,0.08), 0 2px 6px rgba(27,22,17,0.06)" : "none", transition: "background .5s cubic-bezier(0.16,1,0.3,1), transform .5s cubic-bezier(0.16,1,0.3,1), box-shadow .5s cubic-bezier(0.16,1,0.3,1)", }}
                >
                  <div
                    style={{ fontFamily: SERIF, fontSize: "clamp(22px, 2.6vw, 30px)", fontWeight: 300, color: hoverService === n ? C.accent : C.textFaint, lineHeight: 1, transition: "color .5s cubic-bezier(0.16,1,0.3,1)", }}
                  >
                    {String(n + 1).padStart(2, "0")}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <span
                      style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: C.accent, }}
                    >
                      {s.tag}
                    </span>
                    <h3
                      style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(19px, 2.2vw, 25px)", letterSpacing: "-0.015em", lineHeight: 1.18, color: C.ink, margin: "10px 0 0", }}
                    >
                      {s.titre}
                    </h3>
                  </div>
                  <p
                    style={{ fontFamily: SANS, fontSize: 14.5, lineHeight: 1.72, color: C.textMuted, margin: 0, maxWidth: 520, }}
                  >
                    {s.desc}
                  </p>
                </div>
              </Reveal>
            ))}
            <div style={{ borderTop: `1px solid ${C.border}` }} />
          </div>
        </div>
      </section>

      {/* ── PROTOCOLE — piste verticale ─────────────────────────────────── */}
      <section
        id="methode"
        className="i340-pad"
        style={{ background: C.bgDark, color: "rgba(255,255,255,0.9)", padding: "clamp(74px, 10vw, 126px) clamp(22px, 5vw, 68px)", position: "relative", overflow: "hidden", }}
      >
        <div
          aria-hidden
          style={{ position: "absolute", inset: 0, background: "radial-gradient(55% 45% at 78% 12%, rgba(217,154,78,0.10), transparent 72%)", pointerEvents: "none", }}
        />
        <div className="i340-split" style={{ maxWidth: 1140, margin: "0 auto", position: "relative", zIndex: 1, alignItems: "start" }}>
          <div className="i340-sticky" style={{ position: "sticky", top: 110 }}>
            <Kicker color={C.onde}>Le protocole</Kicker>
            <h2
              style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(28px, 4.1vw, 50px)", lineHeight: 1.06, letterSpacing: "-0.022em", color: C.white, margin: "18px 0 20px", }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                <>
                  Mesurer, essayer,
                  <br />
                  <em style={{ color: C.onde }}>prouver.</em>
                </>
              )}
            </h2>
            <p
              style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.55)", maxWidth: 420, }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "methode.intro") ??
                "Quatre rendez-vous, dans cet ordre, sans en sauter un seul. C'est ce qui rend le résultat vérifiable."}
            </p>
          </div>

          <div>
            {METHODE.map((m, n) => (
              <Reveal key={m.n} delay={n * 0.055}>
                <div
                  className="i340-piste"
                  style={{ padding: "clamp(20px, 2.6vw, 30px) 0", borderBottom: n < METHODE.length - 1 ? "1px solid rgba(255,255,255,0.09)" : "none", }}
                >
                  <div style={{ position: "relative" }}>
                    <div
                      style={{ fontFamily: SERIF, fontSize: "clamp(26px, 3vw, 34px)", fontWeight: 300, color: C.onde, lineHeight: 1, }}
                    >
                      {m.n}
                    </div>
                    <div
                      aria-hidden
                      style={{ width: 26, height: 1, marginTop: 12, background: "linear-gradient(to right, rgba(217,154,78,0.7), transparent)", }}
                    />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3
                      style={{ fontFamily: SANS, fontSize: "clamp(16px, 1.7vw, 19px)", fontWeight: 700, letterSpacing: "-0.005em", color: C.white, margin: "0 0 9px", }}
                    >
                      {m.t}
                    </h3>
                    <p style={{ fontSize: 14.5, lineHeight: 1.75, color: "rgba(255,255,255,0.58)", margin: 0, maxWidth: 480 }}>
                      {m.d}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENTS ─────────────────────────────────────────────────── */}
      <section
        id="engagements"
        className="i340-pad"
        style={{ background: C.bg, padding: "clamp(74px, 10vw, 126px) clamp(22px, 5vw, 68px)", }}
      >
        <div className="i340-split" style={{ maxWidth: 1140, margin: "0 auto" }}>
          <Reveal>
            <div
              style={{ position: "relative", border: `1px solid ${C.border}`, background: `linear-gradient(150deg, ${C.accentLight}, ${C.bgAlt})`, aspectRatio: "4/5", overflow: "hidden", borderRadius: 2, }}
            >
              {PORTRAIT ? (
                <img
                  src={PORTRAIT}
                  alt="Réglage d'un appareil auditif"
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : null}
              <div
                aria-hidden
                style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(135deg, rgba(180,83,9,0.06) 0 1px, transparent 1px 14px)", pointerEvents: "none", }}
              />
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              <Kicker>Nos engagements</Kicker>
              <h2
                style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(26px, 3.5vw, 42px)", lineHeight: 1.08, letterSpacing: "-0.02em", color: C.ink, margin: "18px 0 clamp(22px, 3vw, 32px)", }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>
                    La preuve,
                    <br />
                    <em style={{ color: C.accent }}>pas la promesse.</em>
                  </>
                )}
              </h2>
              {ENGAGEMENT.map((e, n) => (
                <div
                  key={n}
                  style={{ display: "flex", gap: 14, padding: "14px 0", borderTop: n === 0 ? `1px solid ${C.border}` : "none", borderBottom: `1px solid ${C.border}`, }}
                >
                  <Check size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 4 }} />
                  <span style={{ fontSize: 14.5, color: C.textMuted, lineHeight: 1.7 }}>{e}</span>
                </div>
              ))}
              <motion.a
                href={telHref}
                className="i340-cta"
                style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 28, background: C.accent, color: C.white, borderRadius: 2, padding: "15px 28px", fontWeight: 700, fontSize: 14.5, textDecoration: "none", }}
                whileHover={{ y: -2, boxShadow: "0 14px 30px rgba(180,83,9,0.26), 0 3px 8px rgba(27,22,17,0.14)" }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                Nous appeler <ArrowRight size={16} className="i340-arrow" />
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TARIFS — table fine ─────────────────────────────────────────── */}
      <section
        id="tarifs"
        className="i340-pad"
        style={{ background: C.bgAlt, padding: "clamp(74px, 10vw, 126px) clamp(22px, 5vw, 68px)", position: "relative", overflow: "hidden", }}
      >
        <Ghost top={40} size="clamp(150px, 26vw, 300px)" color="rgba(27,22,17,0.04)">
          {"€"}
        </Ghost>
        <div style={{ maxWidth: 980, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <Kicker align="center">Tarifs</Kicker>
              <h2
                style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(28px, 3.9vw, 46px)", lineHeight: 1.06, letterSpacing: "-0.022em", color: C.ink, margin: "18px 0 14px", }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                  <>
                    Chiffrés, <em style={{ color: C.accent }}>comparés, choisis.</em>
                  </>
                )}
              </h2>
              <p
                style={{ fontSize: 15, color: C.textMuted, maxWidth: 520, margin: "0 auto", lineHeight: 1.75, }}
              >
                Chaque devis présente classe I et classe II côte à côte, avec le reste à charge exact selon votre
                mutuelle — calculé avant, pas découvert après.
              </p>
            </div>
          </Reveal>

          <div style={{ marginTop: "clamp(34px, 5vw, 54px)" }}>
            <div
              className="i340-tarif"
              style={{ padding: "0 clamp(4px, 1vw, 12px) 12px", borderBottom: `1px solid ${C.ink}`, }}
            >
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: C.textFaint }}>
                Prestation
              </span>
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: C.textFaint }}>
                Repère
              </span>
            </div>
            {TARIFS.map((tt, n) => (
              <Reveal key={`${tt.a}-${n}`} delay={n * 0.05}>
                <div
                  className="i340-tarif"
                  onMouseEnter={() => setHoverTarif(n)}
                  onMouseLeave={() => setHoverTarif(null)}
                  style={{ padding: "clamp(18px, 2.4vw, 26px) clamp(4px, 1vw, 12px)", borderBottom: `1px solid ${C.border}`, background: hoverTarif === n ? C.bgCard : "transparent", boxShadow: hoverTarif === n ? "0 16px 30px rgba(27,22,17,0.07), 0 2px 5px rgba(27,22,17,0.05)" : "none", transform: hoverTarif === n ? "translateY(-2px)" : "none", transition: "background .5s cubic-bezier(0.16,1,0.3,1), transform .5s cubic-bezier(0.16,1,0.3,1), box-shadow .5s cubic-bezier(0.16,1,0.3,1)", }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{ fontFamily: SERIF, fontSize: "clamp(17px, 1.9vw, 21px)", fontWeight: 400, color: C.ink, letterSpacing: "-0.012em", }}
                    >
                      {tt.a}
                    </div>
                    <div style={{ fontSize: 13.5, color: C.textMuted, marginTop: 7, lineHeight: 1.65, maxWidth: 560 }}>
                      {tt.n}
                    </div>
                  </div>
                  <div
                    style={{ fontFamily: SANS, fontSize: "clamp(15px, 1.6vw, 18px)", fontWeight: 700, color: hoverTarif === n ? C.accentDark : C.accent, whiteSpace: "nowrap", transition: "color .5s cubic-bezier(0.16,1,0.3,1)", }}
                  >
                    {tt.p}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVIS — spotlight ────────────────────────────────────────────── */}
      <section
        className="i340-pad"
        style={{ background: C.bgDarkAlt, padding: "clamp(74px, 10vw, 126px) clamp(22px, 5vw, 68px)", position: "relative", overflow: "hidden", }}
      >
        <Ghost top={20} size="clamp(180px, 30vw, 380px)" color="rgba(217,154,78,0.06)">
          {"“"}
        </Ghost>
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          <Reveal>
            <Kicker align="center" color={C.onde}>
              Ce qu'ils entendent
            </Kicker>
            <h2
              style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(26px, 3.6vw, 42px)", lineHeight: 1.08, letterSpacing: "-0.02em", color: C.white, margin: "18px 0 clamp(30px, 4.5vw, 48px)", }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                <>
                  Mesuré, <em style={{ color: C.onde }}>entendu</em>.
                </>
              )}
            </h2>
          </Reveal>

          <motion.blockquote
            key={avisIdx}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(19px, 2.6vw, 30px)", lineHeight: 1.5, color: "rgba(255,255,255,0.9)", margin: 0, maxWidth: 780, marginLeft: "auto", marginRight: "auto", }}
          >
            « {avis.texte} »
          </motion.blockquote>

          <div style={{ marginTop: 28 }}>
            <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, color: C.white }}>{avis.auteur}</div>
            <div
              style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: C.onde, marginTop: 7, }}
            >
              {avis.detail}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
            {AVIS.map((a, n) => (
              <button
                key={`${a.auteur}-${n}`}
                onClick={() => setAvisIdx(n)}
                aria-label={`Avis ${n + 1}`}
                style={{ minWidth: 44, minHeight: 44, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", padding: 0, }}
              >
                <span
                  style={{ display: "block", width: n === avisIdx % AVIS.length ? 34 : 14, height: 2, background: n === avisIdx % AVIS.length ? C.onde : "rgba(255,255,255,0.22)", transition: "width .5s cubic-bezier(0.16,1,0.3,1), background .5s cubic-bezier(0.16,1,0.3,1)", }}
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section
        id="contact"
        className="i340-pad"
        style={{ background: C.accentLight, padding: "clamp(74px, 10vw, 126px) clamp(22px, 5vw, 68px)", }}
      >
        <div className="i340-contact" style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Reveal>
            <div>
              <Kicker>Test gratuit</Kicker>
              <h2
                style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1.05, letterSpacing: "-0.024em", color: C.ink, margin: "18px 0 18px", }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                  <>
                    Vingt minutes de mesures,
                    <br />
                    <em style={{ color: C.accent }}>des années de conversations.</em>
                  </>
                )}
              </h2>
              <p style={{ fontSize: 15.5, color: C.textMuted, maxWidth: 470, lineHeight: 1.78, margin: 0 }}>
                Test auditif complet gratuit, démonstration en cabine immédiate. Avec ou sans ordonnance pour tester ;
                l'ordonnance ORL reste requise pour l'appareillage.
              </p>
              <div style={{ display: "flex", gap: 13, flexWrap: "wrap", marginTop: 32 }}>
                <motion.a
                  href={telHref}
                  className="i340-cta"
                  style={{ background: C.accent, color: C.white, borderRadius: 2, padding: "16px 32px", fontWeight: 700, fontSize: 15.5, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, }}
                  whileHover={{ y: -2, boxShadow: "0 14px 30px rgba(180,83,9,0.26), 0 3px 8px rgba(27,22,17,0.14)" }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <Phone size={17} /> {phone}
                </motion.a>
                <motion.a
                  href={`mailto:${mail}`}
                  style={{ background: "transparent", color: C.ink, border: `1px solid ${C.accent}`, borderRadius: 2, padding: "15px 28px", fontWeight: 700, fontSize: 15.5, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, }}
                  whileHover={{ backgroundColor: C.accent, color: C.white }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <Mail size={17} /> Nous écrire
                </motion.a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div
              style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 2, padding: "clamp(24px, 3.4vw, 38px)", }}
            >
              <span
                style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: C.accent, }}
              >
                Le centre
              </span>
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <MapPin size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontSize: 14.5, color: C.textMuted, lineHeight: 1.7 }}>
                    {clientCodePostalVille(sessionData, "44000", "Nantes")}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Phone size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <a href={telHref} style={{ fontSize: 14.5, color: C.textMuted, textDecoration: "none", lineHeight: 1.7 }}>
                    {phone}
                  </a>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Mail size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <a href={`mailto:${mail}`} style={{ fontSize: 14.5, color: C.textMuted, textDecoration: "none", lineHeight: 1.7, overflowWrap: "anywhere" }}>
                    {mail}
                  </a>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Ear size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontSize: 14.5, color: C.textMuted, lineHeight: 1.7 }}>
                    {/* TEXTE_SECTION */ clientText(sessionData, "contact.acces") ??
                      "Cabine d'environnements sur place — prévoyez 45 minutes pour le premier rendez-vous."}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer
        className="i340-pad"
        style={{ background: C.bgDark, padding: "clamp(46px, 6vw, 66px) clamp(22px, 5vw, 68px) 26px", }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 30, marginBottom: 34 }}>
            <div style={{ minWidth: 0 }}>
              <div
                style={{ fontFamily: SERIF, fontSize: "clamp(19px, 2.2vw, 24px)", color: C.onde, marginBottom: 12, letterSpacing: "-0.012em", }}
              >
                {maison}
              </div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.75, maxWidth: 420 }}>
                {metier} · {ville}
                <br />
                Audioprothésistes D.E. — devis normalisé, tiers payant
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <MapPin size={13} />, t: adresse ?? `${ville}, Loire-Atlantique` },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Mail size={13} />, t: mail },
              ].map((item, n) => (
                <div key={n} style={{ display: "flex", gap: 11, color: "rgba(255,255,255,0.44)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.onde }}>{item.icon}</span>
                  <span style={{ overflowWrap: "anywhere" }}>{item.t}</span>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, }}
          >
            <span style={{ color: "rgba(255,255,255,0.26)", fontSize: 12 }}>
              © 2026 {maison} — Site réalisé par Aevia WS · SIREN{" "}
              <LegalIdentity fallback="852 546 225" kind="siren" />
              {/* VILLE_PIED */}
              {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ color: "rgba(255,255,255,0.26)", fontSize: 12 }}>
              Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
