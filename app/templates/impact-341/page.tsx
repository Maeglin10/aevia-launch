"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Car, Check, Clock, Mail, MapPin, Phone } from "lucide-react";
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
   {clientName(sessionData) ?? "Conduite Zéro Stress"} — auto-école anti-stress · Toulouse

   Archétype héros H6 : typographique, sans photographie. La seule matière du
   héros est du texte et deux textures CSS — un marquage au sol en pointillés
   et un halo radial très faible. Paire de fontes P5 (DM Serif Display / DM
   Sans). Palette eau claire #f4f9f7, accent teal #0d9488.

   Geste signature : TrackingCollapse (hero-kit-3). Le dernier mot du titre
   arrive très espacé puis se resserre — l'interlettrage qui respire, c'est le
   ton de la maison : on lit la trajectoire se préciser, sans à-coup. Un seul
   index (`useSlides`) pilote le mot, le sur-titre et la légende.

   Ordre volontairement décalé du squelette : la méthode passe AVANT les
   formations, parce que c'est la méthode qui vend cette auto-école-là.
   ════════════════════════════════════════════════════════════════════════════ */

const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700&display=swap');`;

const SERIF = "'DM Serif Display', Georgia, serif";
const SANS = "'DM Sans', system-ui, -apple-system, 'Segoe UI', sans-serif";

/* Un seul easing pour tout le thème, répété littéralement en CSS plus bas. */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

let C: Record<string, string> = {
  bg: "#f4f9f7",
  bgAlt: "#e8f3f0",
  bgCard: "#ffffff",
  bgDark: "#0b1f1d",
  bgDarkAlt: "#071614",
  accent: "var(--brand,#0d9488)",
  accentDark: "var(--brand-light,#0a6f66)",
  accentLight: "#d8ece8",
  ink: "#10201e",
  textMuted: "#55706b",
  textFaint: "#8ba49f",
  border: "#d7e7e3",
  white: "#ffffff",
  /* clé métier : la teinte du marquage au sol, dessiné en CSS. */
  route: "#b7d6d0",
};

const NAV = [
  { l: "La méthode", h: "#methode" },
  { l: "Formations", h: "#services" },
  { l: "Formules", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* Le mot animé est la fin du titre ; `k` et `sub` légendent la diapositive. */
const HERO_SOURCE = [
  { k: "Permis B", word: "sereinement.", sub: "La boîte manuelle, sans les sueurs froides." },
  { k: "Conduite accompagnée", word: "tôt.", sub: "Dès 15 ans — 74 % de réussite nationale, la nôtre : 85 %." },
  { k: "Boîte automatique", word: "simplement.", sub: "13 h de minimum légal, examen identique." },
];
let HERO = HERO_SOURCE;

const SERVICES_SOURCE = [
  {
    titre: "Code de la route",
    desc: "Salle connectée + application illimitée, séances thématiques animées par un moniteur — pas seulement des QCM en boucle.",
    tag: "Code",
  },
  {
    titre: "Permis B manuel",
    desc: "20 h de minimum légal, évaluation de départ offerte pour estimer VOTRE volume réel. Livret numérique suivi à chaque leçon.",
    tag: "Permis B",
  },
  {
    titre: "Conduite accompagnée (AAC)",
    desc: "Dès 15 ans : formation initiale, rendez-vous pédagogiques inclus, assurance guidée pour les parents.",
    tag: "AAC",
  },
  {
    titre: "Boîte automatique",
    desc: "13 h de minimum légal, passerelle possible vers la manuelle après 3 mois. Idéal reprise de confiance.",
    tag: "Automatique",
  },
  {
    titre: "Perfectionnement & post-permis",
    desc: "Autoroute, nuit, pluie, créneaux : des heures ciblées pour les jeunes permis — et la formation post-permis qui réduit la période probatoire.",
    tag: "Post-permis",
  },
  {
    titre: "Financements",
    desc: "CPF (permis B éligible), permis à 1 €/jour pour les 15-25 ans, paiement en 4 fois sans frais au secrétariat.",
    tag: "Financement",
  },
];
let SERVICES_DEMO = SERVICES_SOURCE;

/*
  Les deux minimums légaux, tels que les décrivent déjà les formations du
  thème : « 20 h de minimum légal » pour la boîte manuelle, « 13 h de minimum
  légal » pour l'automatique. Rien d'ajouté — la réglette ne fait que poser à
  l'échelle ce que le texte dit en toutes lettres.
*/
const MINIMA = [
  { h: 13, titre: "Boîte automatique", note: "Minimum légal — passerelle vers la manuelle après 3 mois." },
  { h: 20, titre: "Boîte manuelle", note: "Minimum légal — votre volume réel est estimé à l'évaluation." },
];

/* La ville du client apparaît à l'étape 03 : la fonction est rappelée dans le
   corps du rendu, jamais évaluée à l'import. */
function METHODE_LIVE() {
  return [
    { n: "01", t: "Évaluation honnête", d: "45 minutes offertes pour estimer votre volume d'heures réel — écrit sur le contrat, pas révisé à la hausse en cours de route." },
    { n: "02", t: "Un moniteur référent", d: "Le même moniteur vous suit ; les étapes du livret sont validées ensemble, jamais subies." },
    { n: "03", t: "Simulateur d'examen", d: "Deux passages blancs dans les conditions réelles, sur les parcours d'examen de " + (clientCity(sessionData) ?? "Toulouse") + "." },
    { n: "04", t: "Présentation quand c'est prêt", d: "On ne présente pas pour libérer un créneau : on présente quand les compétences sont validées. C'est ça, 78 %." },
  ];
}
let METHODE = METHODE_LIVE();

const ENGAGEMENT_DEMO = [
  "Agrément préfectoral E 26 031 0042 0 — moniteurs titulaires du Titre Pro ECSR",
  "Label « qualité des formations au sein des écoles de conduite » : taux de réussite affichés",
  "Contrat écrit : volume estimé, prix des heures supplémentaires identique au forfait",
  "Éligible CPF et permis à 1 €/jour — dossiers montés par le secrétariat",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

const TARIFS_DEMO = [
  { a: "Code (salle + appli illimitées)", p: "290 €", n: "Jusqu'à réussite, séances thématiques avec moniteur incluses." },
  { a: "Forfait 20 h — permis B", p: "1 390 €", n: "Évaluation offerte, livret numérique, 2 examens blancs, présentation incluse." },
  { a: "Conduite accompagnée (AAC)", p: "1 490 €", n: "Formation initiale + 2 rendez-vous pédagogiques obligatoires inclus." },
  { a: "Heure supplémentaire", p: "46 €", n: "Le même prix qu'au forfait — comparez, c'est rare." },
];
let TARIFS = TARIFS_DEMO;

const AVIS_SOURCE = [
  {
    texte:
      "Deux échecs dans une autre auto-école, la boule au ventre à chaque leçon. Ici, mon moniteur n'a jamais élevé la voix. Permis au premier passage avec eux.",
    auteur: "Léa G., 24 ans",
    detail: "Reprise après échecs",
  },
  {
    texte:
      "Mon fils en conduite accompagnée : les deux rendez-vous pédagogiques nous ont appris, à nous parents, comment accompagner sans crisper. Reçu à 18 ans et 2 semaines.",
    auteur: "Père d'Enzo, AAC",
    detail: "Conduite accompagnée",
  },
  {
    texte:
      "Dossier CPF monté par le secrétariat en dix minutes. L'évaluation avait dit 28 h : il m'en a fallu 28. Personne n'a essayé de m'en vendre 40.",
    auteur: "Karim T., 31 ans",
    detail: "Permis B — CPF",
  },
];
let AVIS_DEMO = AVIS_SOURCE;

const STATS_DEMO = [
  { value: "78 %", label: "Réussite au 1er passage (B)" },
  { value: "12", label: "Moniteurs diplômés d'État" },
  { value: "6", label: "Voitures de moins de 3 ans" },
  { value: "0 €", label: "Frais de dossier cachés" },
];
let STATS = STATS_DEMO;

/* Les repères affichés en marge du héros reprennent les tags des formations :
   rien d'inventé, le vocabulaire du thème posé au bon endroit. */
const REPERES_DEMO = SERVICES_SOURCE.map((s) => s.tag);
let REPERES = REPERES_DEMO;

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 28, style }: { children: React.ReactNode; delay?: number; y?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -8% 0px" });
  return (
    <motion.div ref={ref} style={style} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.95, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

/** Kicker : filet de 40 × 1 px puis capitales très espacées. */
function Kicker({ children, color = C.accent, align = "left" }: { children: React.ReactNode; color?: string; align?: "left" | "center" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: align === "center" ? "center" : "flex-start" }}>
      <span style={{ width: 40, height: 1, background: color, opacity: 0.75, flexShrink: 0 }} />
      <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, letterSpacing: "0.34em", textTransform: "uppercase", color }}>{children}</span>
      {align === "center" && <span style={{ width: 40, height: 1, background: color, opacity: 0.75, flexShrink: 0 }} />}
    </div>
  );
}

/** Chiffre ou signe fantôme : texture sans image, jamais cliquable. */
function Ghost({ children, right = false, top = -20, size = "clamp(130px, 24vw, 280px)", color = "rgba(13,148,136,0.07)" }: { children: React.ReactNode; right?: boolean; top?: number; size?: string; color?: string }) {
  return (
    <span aria-hidden style={{ position: "absolute", top, [right ? "right" : "left"]: -10, fontFamily: SERIF, fontSize: size, lineHeight: 0.8, color, pointerEvents: "none", userSelect: "none", zIndex: 0 }}>
      {children}
    </span>
  );
}

/** Le marquage au sol : deux filets pointillés qui donnent l'axe de la page. */
function Marquage({ opacity = 1, color = C.route }: { opacity?: number; color?: string }) {
  return (
    <div aria-hidden style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 116, opacity, pointerEvents: "none", backgroundImage: `repeating-linear-gradient(to right, ${color} 0 42px, transparent 42px 84px), repeating-linear-gradient(to right, ${color} 0 18px, transparent 18px 54px)`, backgroundSize: "100% 3px, 100% 2px", backgroundPosition: "0 52px, 0 92px", backgroundRepeat: "no-repeat" }} />
  );
}

/** Photo du client à cet emplacement, sinon le repli du thème. */
function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ════════════════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════════════════ */

export default function ConduiteZeroStressPage() {
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

  METHODE = METHODE_LIVE();

  /*
    Le mot animé appartient au titre : sans lui, un plombier finissait la
    phrase d'une auto-école. On y met sa prestation d'abord, sinon la seconde
    moitié de sa propre accroche — jamais celle de la démonstration. Le
    gabarit tient 21 caractères par ligne sur deux lignes.
  */
  HERO = clientTagline(sessionData)
    ? HERO_SOURCE.map((h, n) => ({
        ...h,
        ...(n === 0 ? { sub: clientTagline(sessionData)! } : {}),
        word: clientServices(sessionData)?.[n]?.title || clientHeroLine(sessionData, 1, 2, 21) || h.word,
      }))
    : HERO_SOURCE;

  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, n: number) => ({ ...SERVICES_SOURCE[n % SERVICES_SOURCE.length], titre: s.title })),
    SERVICES_SOURCE,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, n: number) => ({ ...AVIS_SOURCE[n % AVIS_SOURCE.length], auteur: r.author, texte: r.text })),
    AVIS_SOURCE,
  );
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s: any, n: number) => ({ ...TARIFS_DEMO[n % TARIFS_DEMO.length], a: s.title, p: s.price ?? TARIFS_DEMO[n % TARIFS_DEMO.length].p, n: s.desc || s.description || TARIFS_DEMO[n % TARIFS_DEMO.length].n })),
    TARIFS_DEMO,
  );
  STATS = resolveList(clientStats(sessionData), STATS_DEMO);
  ENGAGEMENT = resolveList(clientCertifications(sessionData), ENGAGEMENT_DEMO);
  REPERES = clientList(sessionData, "heros.reperes") ?? REPERES_DEMO;

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
  const [hoverEtape, setHoverEtape] = useState<number | null>(null);
  const [hoverForm, setHoverForm] = useState<number | null>(null);
  const [hoverTarif, setHoverTarif] = useState<number | null>(null);

  /* Un seul index pilote tout le héros : le mot, le sur-titre, la légende. */
  const { i, next, prev } = useSlides(HERO.length, DWELL.normal);
  const S = HERO[i];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = clientPhone(sessionData) ?? fd?.phone ?? "05 61 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33561000000").replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "inscription@conduite-zero-stress.fr";
  const ville = clientCity(sessionData) ?? "Toulouse";
  const maison = fd?.businessName ?? clientName(sessionData) ?? "Conduite Zéro Stress";
  const metier = clientTrade(sessionData) ?? "Auto-école";
  const adresse = clientAddress(sessionData);
  /* Emplacement 0 : la bande d'ambiance de la méthode, sans repli — un aplat
     et le marquage CSS la remplacent. Emplacement 1 : le véhicule-école, dont
     le thème a déjà une image. */
  const BANDE = photo(0, "");
  const VOITURE = photo(1, "https://images.pexels.com/photos/37112146/pexels-photo-37112146.jpeg?auto=compress&cs=tinysrgb&w=1400");

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip" }}>
      <style>{`
        ${FONTS_CSS}
        .i341-link { position: relative; }
        .i341-link::after { content: ""; position: absolute; left: 0; bottom: 6px; height: 1px; width: 0; background: ${C.accent}; transition: width .5s cubic-bezier(0.16,1,0.3,1); }
        .i341-link:hover::after { width: 100%; }
        .i341-arrow { transition: transform .5s cubic-bezier(0.16,1,0.3,1); }
        .i341-cta:hover .i341-arrow { transform: translateX(6px); }

        .i341-heroGrid { display: grid; grid-template-columns: minmax(0,1fr) 210px; gap: clamp(28px, 5vw, 64px); align-items: end; }
        .i341-split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(28px, 5vw, 64px); align-items: center; }
        .i341-cols { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 0; }
        .i341-etape { display: grid; grid-template-columns: 64px minmax(0,1fr); gap: clamp(14px, 2vw, 26px); align-items: start; }
        .i341-tarif { display: grid; grid-template-columns: 120px minmax(0,1fr); gap: clamp(16px, 2.4vw, 34px); align-items: baseline; }
        .i341-contact { display: grid; grid-template-columns: minmax(0,1.1fr) minmax(0,0.9fr); gap: clamp(28px, 5vw, 70px); align-items: start; }
        .i341-avis { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: clamp(18px, 2.6vw, 30px); align-items: start; }
        .i341-decal-1 { margin-top: 44px; }
        .i341-decal-2 { margin-top: 88px; }

        @media (max-width: 900px) { #i341-nav { display: none !important; } .i341-burger { display: flex !important; } }
        @media (max-width: 1040px) {
          .i341-heroGrid { grid-template-columns: 1fr !important; align-items: start !important; }
          .i341-contact { grid-template-columns: 1fr !important; }
          .i341-avis { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
          .i341-decal-1, .i341-decal-2 { margin-top: 0 !important; }
        }
        @media (max-width: 860px) {
          .i341-split { grid-template-columns: 1fr !important; }
          .i341-cols { grid-template-columns: 1fr !important; }
          .i341-avis { grid-template-columns: 1fr !important; }
          .i341-stats { grid-template-columns: 1fr 1fr !important; }
          .i341-pad { padding-left: 22px !important; padding-right: 22px !important; }
          .i341-sticky { position: static !important; }
        }
        @media (max-width: 560px) {
          .i341-stats { grid-template-columns: 1fr !important; }
          .i341-tarif { grid-template-columns: 1fr !important; }
          .i341-etape { grid-template-columns: 1fr !important; gap: 8px !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: scrolled ? "12px clamp(20px,4vw,52px)" : "22px clamp(20px,4vw,52px)", background: scrolled ? "rgba(244,249,247,0.94)" : "transparent", backdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none", WebkitBackdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "padding .55s cubic-bezier(0.16,1,0.3,1), background .55s cubic-bezier(0.16,1,0.3,1), border-color .55s cubic-bezier(0.16,1,0.3,1), backdrop-filter .55s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={maison} style={{ height: 32, maxWidth: 170, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Car size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: SERIF, fontSize: "clamp(17px, 2vw, 21px)", letterSpacing: "0.005em", color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{maison}</span>
            </>
          )}
        </div>
        <div id="i341-nav" style={{ display: "flex", gap: 26, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} className="i341-link" style={{ color: C.textMuted, fontSize: 13.5, fontWeight: 500, letterSpacing: "0.02em", textDecoration: "none", padding: "12px 2px" }}>{l}</a>
          ))}
          <motion.a href={telHref} className="i341-cta" style={{ background: C.accent, color: C.white, borderRadius: 999, padding: "13px 26px", fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textDecoration: "none", whiteSpace: "nowrap" }} whileHover={{ y: -2, boxShadow: "0 10px 24px rgba(13,148,136,0.26), 0 2px 6px rgba(16,32,30,0.12)" }} transition={{ duration: 0.5, ease: EASE }}>
            Évaluation offerte
          </motion.a>
        </div>
        <button className="i341-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all .3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all .3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all .3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 62, left: 0, right: 0, zIndex: 99, background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "18px 26px 22px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ color: C.ink, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "13px 0" }}>{l}</a>
          ))}
          <a href={telHref} style={{ background: C.accent, color: C.white, borderRadius: 999, padding: "14px 22px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 8 }}>Évaluation offerte</a>
        </div>
      )}

      {/* ── HÉROS — H6 typographique, sans photographie ─────────────────── */}
      <section className="i341-pad" style={{ position: "relative", minHeight: "100dvh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(122px, 16vh, 176px) clamp(22px, 5vw, 68px) clamp(72px, 11vh, 118px)", maxWidth: 1200, margin: "0 auto", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(52% 44% at 76% 22%, rgba(13,148,136,0.10), transparent 72%)", pointerEvents: "none" }} />
        <Ghost top={72} size="clamp(160px, 30vw, 360px)">{"›"}</Ghost>
        <Marquage opacity={0.55} />

        <div className="i341-heroGrid" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ minWidth: 0 }}>
            <Kicker>{clientEyebrow(sessionData) ?? `${metier} · ${ville}`}</Kicker>

            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(38px, 6.6vw, 84px)", fontWeight: 400, lineHeight: 0.98, letterSpacing: "-0.018em", color: C.ink, margin: "clamp(20px, 3vw, 32px) 0 0" }}>
              <span style={{ display: "block", letterSpacing: "-0.024em" }}>{clientHeroLine(sessionData, 0, 2, 21) ?? "Apprendre à conduire,"}</span>
              <TrackingCollapse word={S.word} index={i} from="0.34em" to="0.02em" style={{ color: C.accent, fontStyle: "italic", marginTop: 6 }} />
            </h1>

            <p style={{ fontFamily: SANS, fontSize: "clamp(15px, 1.5vw, 17px)", color: C.textMuted, lineHeight: 1.8, maxWidth: 500, margin: "clamp(20px, 2.6vw, 30px) 0 clamp(26px, 3.4vw, 38px)" }}>
              {clientHeroPrestations(sessionData) ?? c?.heroSubline ?? "Des moniteurs diplômés qui ne crient jamais, des voitures récentes, et une méthode par étapes validées. 78 % de réussite au premier passage — affiché, parce que c'est vérifiable."}
            </p>

            <div style={{ display: "flex", gap: 13, flexWrap: "wrap", alignItems: "center" }}>
              <motion.a href={telHref} className="i341-cta" style={{ background: C.accent, color: C.white, borderRadius: 999, padding: "16px 32px", fontWeight: 700, fontSize: 14.5, letterSpacing: "0.02em", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }} whileHover={{ y: -2, boxShadow: "0 14px 30px rgba(13,148,136,0.28), 0 3px 8px rgba(16,32,30,0.14)" }} transition={{ duration: 0.5, ease: EASE }}>
                S'inscrire ou se renseigner <ArrowRight size={16} className="i341-arrow" />
              </motion.a>
              <motion.a href="#tarifs" style={{ background: "transparent", color: C.ink, border: `1px solid ${C.border}`, borderRadius: 999, padding: "15px 28px", fontWeight: 600, fontSize: 14.5, textDecoration: "none" }} whileHover={{ borderColor: C.accent, backgroundColor: C.accentLight }} transition={{ duration: 0.5, ease: EASE }}>
                Nos formules
              </motion.a>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: "clamp(32px, 4.6vw, 54px)", paddingTop: 20, borderTop: `1px solid ${C.border}`, flexWrap: "wrap" }}>
              <SlideIndex i={i} total={HERO.length} variant="fraction" color={C.textFaint} className="" />
              <span style={{ fontSize: 13.5, color: C.textMuted, lineHeight: 1.6 }}>
                <strong style={{ color: C.ink, fontWeight: 700 }}>{S.k}</strong> — {S.sub}
              </span>
              <HairlineArrows onPrev={prev} onNext={next} color={C.ink} className="" />
            </div>
          </div>

          {/* Rail de repères : le vocabulaire des formations, en marge. */}
          <div style={{ minWidth: 0, borderLeft: `1px solid ${C.border}`, paddingLeft: "clamp(16px, 2vw, 26px)" }}>
            <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: C.textFaint }}>Ce qu'on enseigne</span>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 11 }}>
              {REPERES.slice(0, 6).map((r, n) => (
                <motion.span key={`${r}-${n}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.25 + n * 0.055 }} style={{ fontFamily: SERIF, fontSize: "clamp(15px, 1.6vw, 19px)", color: n % 2 === 1 ? C.accent : C.textMuted, fontStyle: n % 2 === 1 ? "italic" : "normal", lineHeight: 1.25 }}>
                  {r}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RESPIRATION ─────────────────────────────────────────────────── */}
      <section className="i341-pad" style={{ background: C.bgAlt, padding: "clamp(58px, 9vw, 106px) clamp(22px, 5vw, 68px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(to right, transparent, ${C.border}, transparent)` }} />
        <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(21px, 3.1vw, 36px)", lineHeight: 1.45, letterSpacing: "-0.01em", color: C.ink, maxWidth: 760, margin: "0 auto" }}>
          {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (
            <>Le stress ne fait pas <em style={{ color: C.accent, fontStyle: "normal" }}>de meilleurs conducteurs</em>.</>
          )}
        </p>
      </section>

      {/* ── LA RÉGLETTE — les deux minimums légaux, posés à l'échelle ────── */}
      <section className="i341-pad" style={{ background: C.bgAlt, padding: "0 clamp(22px, 5vw, 68px) clamp(58px, 9vw, 100px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "clamp(28px, 4vw, 44px)" }}>
              <Kicker align="center">Les minimums légaux</Kicker>
              <p style={{ fontSize: 14.5, color: C.textMuted, lineHeight: 1.75, maxWidth: 520, margin: "16px auto 0" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "minima.intro") ?? "Le minimum légal n'est pas une promesse de volume : c'est le plancher. Le vôtre est estimé à l'évaluation, puis écrit au contrat."}
              </p>
            </div>
          </Reveal>
          {MINIMA.map((m, n) => (
            <Reveal key={m.titre} delay={n * 0.08}>
              <div style={{ padding: "clamp(18px, 2.4vw, 26px) 0", borderTop: `1px solid ${C.border}`, borderBottom: n === MINIMA.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: SANS, fontSize: "clamp(15px, 1.6vw, 17px)", fontWeight: 700, color: C.ink }}>{m.titre}</span>
                  <span style={{ fontFamily: SERIF, fontSize: "clamp(24px, 3vw, 34px)", lineHeight: 1, color: C.accent, letterSpacing: "-0.02em" }}>{m.h} h</span>
                </div>
                {/* La réglette : la piste va jusqu'à 30 h, la barre s'arrête au minimum. */}
                <div style={{ position: "relative", height: 6, marginTop: 16, borderRadius: 999, background: C.white, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  <motion.span initial={{ width: 0 }} whileInView={{ width: `${(m.h / 30) * 100}%` }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.9, ease: EASE, delay: 0.1 + n * 0.055 }} style={{ position: "absolute", left: 0, top: 0, bottom: 0, background: `linear-gradient(to right, ${C.accent}, ${C.route})`, display: "block" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 14, marginTop: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13.5, color: C.textMuted, lineHeight: 1.65, maxWidth: 520 }}>{m.note}</span>
                  <span style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textFaint }}>Échelle 0 — 30 h</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── LA MÉTHODE — avant les formations, parce que c'est elle qui vend ── */}
      <section id="methode" className="i341-pad" style={{ background: C.bg, padding: "clamp(74px, 10vw, 126px) clamp(22px, 5vw, 68px)", position: "relative", overflow: "hidden" }}>
        <Ghost right top={44} size="clamp(170px, 30vw, 350px)" color="rgba(16,32,30,0.045)">{"04"}</Ghost>
        <div className="i341-split" style={{ maxWidth: 1140, margin: "0 auto", position: "relative", zIndex: 1, alignItems: "start" }}>
          <div className="i341-sticky" style={{ position: "sticky", top: 110 }}>
            <Kicker>La méthode</Kicker>
            <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(28px, 4.2vw, 52px)", lineHeight: 1.06, letterSpacing: "-0.02em", color: C.ink, margin: "18px 0 20px" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                <>Quatre étapes,<br /><em style={{ color: C.accent }}>aucune surprise.</em></>
              )}
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: C.textMuted, maxWidth: 420 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "methode.intro") ?? "Le volume d'heures est estimé une fois, écrit au contrat, et tenu. Tout le reste de la pédagogie en découle."}
            </p>

            {/* Bande d'ambiance : photo du client, sinon un aplat au marquage. */}
            <div style={{ marginTop: 30, position: "relative", border: `1px solid ${C.border}`, borderRadius: 4, overflow: "hidden", background: `linear-gradient(150deg, ${C.accentLight}, ${C.bgAlt})`, aspectRatio: "16/9" }}>
              {BANDE ? (
                <img src={BANDE} alt={`${maison} — la salle et les véhicules`} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              ) : (
                <>
                  <Marquage opacity={0.85} color={C.route} />
                  <span style={{ position: "absolute", left: 20, top: 18, fontFamily: SANS, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: C.accentDark }}>Parcours d'examen · {ville}</span>
                </>
              )}
            </div>
          </div>

          <div>
            {METHODE.map((m, n) => (
              <Reveal key={m.n} delay={n * 0.055}>
                <div className="i341-etape" onMouseEnter={() => setHoverEtape(n)} onMouseLeave={() => setHoverEtape(null)} style={{ padding: "clamp(20px, 2.6vw, 30px) clamp(10px, 1.6vw, 18px)", borderTop: `1px solid ${C.border}`, background: hoverEtape === n ? C.bgCard : "transparent", transform: hoverEtape === n ? "translateY(-3px)" : "none", boxShadow: hoverEtape === n ? "0 18px 34px rgba(16,32,30,0.07), 0 2px 6px rgba(16,32,30,0.05)" : "none", transition: "background .5s cubic-bezier(0.16,1,0.3,1), transform .5s cubic-bezier(0.16,1,0.3,1), box-shadow .5s cubic-bezier(0.16,1,0.3,1)" }}>
                  <div>
                    <div style={{ fontFamily: SERIF, fontSize: "clamp(26px, 3vw, 36px)", color: hoverEtape === n ? C.accent : C.textFaint, lineHeight: 1, transition: "color .5s cubic-bezier(0.16,1,0.3,1)" }}>{m.n}</div>
                    <div aria-hidden style={{ width: hoverEtape === n ? 40 : 22, height: 1, marginTop: 12, background: `linear-gradient(to right, ${C.accent}, transparent)`, transition: "width .5s cubic-bezier(0.16,1,0.3,1)" }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontFamily: SANS, fontSize: "clamp(16px, 1.7vw, 19px)", fontWeight: 700, color: C.ink, margin: "0 0 9px" }}>{m.t}</h3>
                    <p style={{ fontSize: 14.5, lineHeight: 1.75, color: C.textMuted, margin: 0, maxWidth: 480 }}>{m.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            <div style={{ borderTop: `1px solid ${C.border}` }} />
          </div>
        </div>
      </section>

      {/* ── FORMATIONS — colonnes filetées ──────────────────────────────── */}
      <section id="services" className="i341-pad" style={{ background: C.bgAlt, padding: "clamp(74px, 10vw, 126px) clamp(22px, 5vw, 68px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <Kicker>Formations</Kicker>
            <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(28px, 4.2vw, 52px)", lineHeight: 1.06, letterSpacing: "-0.02em", color: C.ink, margin: "18px 0 clamp(34px, 5vw, 56px)", maxWidth: 720 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                <>Du code au permis,<br /><em style={{ color: C.accent }}>par étapes validées.</em></>
              )}
            </h2>
          </Reveal>

          <div className="i341-cols">
            {SERVICES.map((s, n) => (
              <Reveal key={`${s.titre}-${n}`} delay={(n % 3) * 0.06}>
                <div onMouseEnter={() => setHoverForm(n)} onMouseLeave={() => setHoverForm(null)} style={{ padding: "clamp(24px, 3vw, 36px) clamp(18px, 2.4vw, 30px)", borderTop: `1px solid ${C.border}`, borderLeft: `1px solid ${C.border}`, height: "100%", background: hoverForm === n ? C.bgCard : "transparent", transform: hoverForm === n ? "translateY(-4px)" : "none", boxShadow: hoverForm === n ? "0 20px 38px rgba(16,32,30,0.08), 0 3px 7px rgba(16,32,30,0.05)" : "none", transition: "background .5s cubic-bezier(0.16,1,0.3,1), transform .5s cubic-bezier(0.16,1,0.3,1), box-shadow .5s cubic-bezier(0.16,1,0.3,1)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <span aria-hidden style={{ width: hoverForm === n ? 26 : 14, height: 1, background: C.accent, transition: "width .5s cubic-bezier(0.16,1,0.3,1)" }} />
                    <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: C.accent }}>{s.tag}</span>
                  </div>
                  <h3 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(19px, 2.1vw, 24px)", lineHeight: 1.2, letterSpacing: "-0.01em", color: C.ink, margin: "0 0 12px" }}>{s.titre}</h3>
                  <p style={{ fontSize: 14.5, lineHeight: 1.75, color: C.textMuted, margin: 0 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHIFFRES — bande sombre ─────────────────────────────────────── */}
      <section className="i341-pad" style={{ background: C.bgDark, padding: "clamp(58px, 8vw, 92px) clamp(22px, 5vw, 68px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(50% 60% at 20% 20%, rgba(13,148,136,0.12), transparent 70%)", pointerEvents: "none" }} />
        <div className="i341-stats" style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", position: "relative", zIndex: 1 }}>
          {STATS.map((s, n) => (
            <Reveal key={`${s.label}-${n}`} delay={n * 0.055}>
              <div style={{ padding: "clamp(14px, 2vw, 26px) clamp(12px, 2vw, 24px)", borderLeft: "1px solid rgba(255,255,255,0.10)", height: "100%" }}>
                <div style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4.4vw, 52px)", lineHeight: 1, letterSpacing: "-0.02em", color: C.route }}>{s.value}</div>
                <div style={{ fontSize: 12.5, lineHeight: 1.6, color: "rgba(255,255,255,0.5)", marginTop: 12, maxWidth: 210 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FORMULES — bandes tarifaires ────────────────────────────────── */}
      <section id="tarifs" className="i341-pad" style={{ background: C.bg, padding: "clamp(74px, 10vw, 126px) clamp(22px, 5vw, 68px)", position: "relative", overflow: "hidden" }}>
        <Ghost top={40} size="clamp(150px, 26vw, 300px)" color="rgba(13,148,136,0.06)">{"€"}</Ghost>
        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <Kicker align="center">Formules</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(28px, 3.9vw, 48px)", lineHeight: 1.06, letterSpacing: "-0.02em", color: C.ink, margin: "18px 0 14px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Des forfaits <em style={{ color: C.accent }}>sans piège.</em></>)}
              </h2>
              <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 540, margin: "0 auto", lineHeight: 1.75 }}>
                L'heure supplémentaire est au même prix que l'heure du forfait — c'est écrit au contrat. Frais de présentation à l'examen inclus.
              </p>
            </div>
          </Reveal>

          <div style={{ marginTop: "clamp(34px, 5vw, 54px)" }}>
            {TARIFS.map((tt, n) => (
              <Reveal key={`${tt.a}-${n}`} delay={n * 0.05}>
                <div className="i341-tarif" onMouseEnter={() => setHoverTarif(n)} onMouseLeave={() => setHoverTarif(null)} style={{ padding: "clamp(20px, 2.6vw, 30px) clamp(14px, 2vw, 24px)", borderTop: `1px solid ${C.border}`, borderBottom: n === TARIFS.length - 1 ? `1px solid ${C.border}` : "none", background: hoverTarif === n ? C.bgCard : "transparent", transform: hoverTarif === n ? "translateY(-2px)" : "none", boxShadow: hoverTarif === n ? "0 16px 32px rgba(16,32,30,0.07), 0 2px 5px rgba(16,32,30,0.05)" : "none", transition: "background .5s cubic-bezier(0.16,1,0.3,1), transform .5s cubic-bezier(0.16,1,0.3,1), box-shadow .5s cubic-bezier(0.16,1,0.3,1)" }}>
                  <div style={{ fontFamily: SERIF, fontSize: "clamp(22px, 2.6vw, 30px)", lineHeight: 1, letterSpacing: "-0.02em", color: hoverTarif === n ? C.accentDark : C.accent, transition: "color .5s cubic-bezier(0.16,1,0.3,1)", whiteSpace: "nowrap" }}>{tt.p}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: SANS, fontSize: "clamp(16px, 1.7vw, 18.5px)", fontWeight: 700, color: C.ink }}>{tt.a}</div>
                    <div style={{ fontSize: 13.5, color: C.textMuted, marginTop: 7, lineHeight: 1.7, maxWidth: 620 }}>{tt.n}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENTS ─────────────────────────────────────────────────── */}
      <section id="engagements" className="i341-pad" style={{ background: C.bgAlt, padding: "clamp(74px, 10vw, 126px) clamp(22px, 5vw, 68px)" }}>
        <div className="i341-split" style={{ maxWidth: 1140, margin: "0 auto" }}>
          <Reveal>
            <div style={{ position: "relative", border: `1px solid ${C.border}`, borderRadius: 4, overflow: "hidden", background: `linear-gradient(150deg, ${C.accentLight}, ${C.bg})`, aspectRatio: "4/3" }}>
              {VOITURE ? (
                <img src={VOITURE} alt="Véhicule d'auto-école plaques L" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              ) : (
                <Marquage opacity={0.9} />
              )}
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              <Kicker>Nos engagements</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(26px, 3.6vw, 44px)", lineHeight: 1.08, letterSpacing: "-0.02em", color: C.ink, margin: "18px 0 clamp(22px, 3vw, 32px)" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>Une auto-école<br /><em style={{ color: C.accent }}>qui affiche tout.</em></>
                )}
              </h2>
              {ENGAGEMENT.map((e, n) => (
                <div key={n} style={{ display: "flex", gap: 14, padding: "14px 0", borderTop: n === 0 ? `1px solid ${C.border}` : "none", borderBottom: `1px solid ${C.border}` }}>
                  <Check size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 4 }} />
                  <span style={{ fontSize: 14.5, color: C.textMuted, lineHeight: 1.7 }}>{e}</span>
                </div>
              ))}
              <motion.a href={telHref} className="i341-cta" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 28, background: C.accent, color: C.white, borderRadius: 999, padding: "15px 30px", fontWeight: 700, fontSize: 14.5, textDecoration: "none" }} whileHover={{ y: -2, boxShadow: "0 14px 30px rgba(13,148,136,0.28), 0 3px 8px rgba(16,32,30,0.14)" }} transition={{ duration: 0.5, ease: EASE }}>
                Nous appeler <ArrowRight size={16} className="i341-arrow" />
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── AVIS — colonnes décalées ────────────────────────────────────── */}
      <section className="i341-pad" style={{ background: C.bg, padding: "clamp(74px, 10vw, 126px) clamp(22px, 5vw, 68px)", position: "relative", overflow: "hidden" }}>
        <Ghost right top={30} size="clamp(180px, 30vw, 380px)" color="rgba(13,148,136,0.07)">{"”"}</Ghost>
        <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "clamp(34px, 5vw, 58px)" }}>
              <Kicker align="center">Ils l'ont passé ici</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(26px, 3.7vw, 44px)", lineHeight: 1.08, letterSpacing: "-0.02em", color: C.ink, margin: "18px 0 0" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>Permis en poche, <em style={{ color: C.accent }}>calme gardé</em>.</>)}
              </h2>
            </div>
          </Reveal>
          <div className="i341-avis">
            {AVIS.map((a, n) => (
              <Reveal key={`${a.auteur}-${n}`} delay={n * 0.09} style={{ height: "100%" }}>
                <div className={n === 1 ? "i341-decal-1" : n === 2 ? "i341-decal-2" : ""} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 4, padding: "clamp(24px, 3vw, 34px)", height: "100%" }}>
                  <div aria-hidden style={{ width: 34, height: 1, background: C.accent, marginBottom: 20 }} />
                  <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(16px, 1.8vw, 19px)", lineHeight: 1.62, color: C.ink, margin: "0 0 22px" }}>« {a.texte} »</p>
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 15 }}>
                    <div style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 700, color: C.ink }}>{a.auteur}</div>
                    <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: C.accent, marginTop: 7 }}>{a.detail}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section id="contact" className="i341-pad" style={{ background: C.accentLight, padding: "clamp(74px, 10vw, 126px) clamp(22px, 5vw, 68px)", position: "relative", overflow: "hidden" }}>
        <Marquage opacity={0.5} color={C.white} />
        <div className="i341-contact" style={{ maxWidth: 1080, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal>
            <div>
              <Kicker color={C.accentDark}>Évaluation offerte</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(28px, 4.1vw, 50px)", lineHeight: 1.05, letterSpacing: "-0.022em", color: C.ink, margin: "18px 0 18px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                  <>45 minutes pour savoir<br /><em style={{ color: C.accentDark }}>combien d'heures il VOUS faut.</em></>
                )}
              </h2>
              <p style={{ fontSize: 15.5, color: C.textMuted, maxWidth: 470, lineHeight: 1.78, margin: 0 }}>
                Évaluation de départ offerte, en voiture, avec un moniteur diplômé. Le chiffre est écrit au contrat.
              </p>
              <div style={{ display: "flex", gap: 13, flexWrap: "wrap", marginTop: 32 }}>
                <motion.a href={telHref} className="i341-cta" style={{ background: C.accent, color: C.white, borderRadius: 999, padding: "16px 34px", fontWeight: 700, fontSize: 15.5, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }} whileHover={{ y: -2, boxShadow: "0 14px 30px rgba(13,148,136,0.28), 0 3px 8px rgba(16,32,30,0.14)" }} transition={{ duration: 0.5, ease: EASE }}>
                  <Phone size={17} /> {phone}
                </motion.a>
                <motion.a href={`mailto:${mail}`} style={{ background: "transparent", color: C.ink, border: `1px solid ${C.accentDark}`, borderRadius: 999, padding: "15px 30px", fontWeight: 700, fontSize: 15.5, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }} whileHover={{ backgroundColor: C.accent, color: C.white }} transition={{ duration: 0.5, ease: EASE }}>
                  <Mail size={17} /> Nous écrire
                </motion.a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 4, padding: "clamp(24px, 3.4vw, 38px)" }}>
              <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: C.accent }}>Le secrétariat</span>
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <MapPin size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontSize: 14.5, color: C.textMuted, lineHeight: 1.7 }}>{clientCodePostalVille(sessionData, "31000", "Toulouse")}</span>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Phone size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <a href={telHref} style={{ fontSize: 14.5, color: C.textMuted, textDecoration: "none", lineHeight: 1.7 }}>{phone}</a>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Mail size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <a href={`mailto:${mail}`} style={{ fontSize: 14.5, color: C.textMuted, textDecoration: "none", lineHeight: 1.7, overflowWrap: "anywhere" }}>{mail}</a>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Clock size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontSize: 14.5, color: C.textMuted, lineHeight: 1.7 }}>
                    {/* TEXTE_SECTION */ clientText(sessionData, "contact.acces") ?? "Le dossier CPF ou permis à 1 €/jour est monté sur place, en une visite."}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="i341-pad" style={{ background: C.bgDark, padding: "clamp(46px, 6vw, 66px) clamp(22px, 5vw, 68px) 26px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 30, marginBottom: 34 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: SERIF, fontSize: "clamp(19px, 2.2vw, 24px)", color: C.route, marginBottom: 12 }}>{maison}</div>
              <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 13, lineHeight: 1.75, maxWidth: 430 }}>
                {metier} agréée · {ville}
                <br />
                Agrément préfectoral E 26 031 0042 0 — Label qualité des formations
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <MapPin size={13} />, t: adresse ?? `${ville}, Haute-Garonne` },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Clock size={13} />, t: "Lun–Ven 10h–19h · Sam 9h–17h" },
              ].map((item, n) => (
                <div key={n} style={{ display: "flex", gap: 11, color: "rgba(255,255,255,0.44)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.route }}>{item.icon}</span>
                  <span style={{ overflowWrap: "anywhere" }}>{item.t}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ color: "rgba(255,255,255,0.28)", fontSize: 12 }}>
              © 2026 {maison} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
              {/* VILLE_PIED */}
              {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ color: "rgba(255,255,255,0.28)", fontSize: 12 }}>
              Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
