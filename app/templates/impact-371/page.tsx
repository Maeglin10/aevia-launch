"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Clock, Mail, MapPin, Phone, Shield } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, GhostSolid, HairlineArrows, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
import {
  clientAddress,
  clientCertifications,
  clientCity,
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
import { TitreDeLaPage } from "@/lib/templates/TitreDeLaPage";

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
   SENTINELLE SUD — sécurité privée · Marseille

   Archétype H3 (plein cadre, titre en bas, fond de repli C.bgDark
   OBLIGATOIRE) · paire P6 (Archivo + Inter) · palette nuit #0b0f12 / bleu de
   veille #5fb0e8 · signature : lockup contour → plein, trame de veille et
   ligne de balayage.

   Le geste GhostSolid est partagé avec deux autres thèmes du catalogue : ici
   il s'applique au lockup du héros plein cadre, dans une palette et une paire
   de fontes qui n'appartiennent qu'à ce thème — le contour se dessine, puis
   la ligne pleine se matérialise, comme un agent qui prend son poste.

   L'URL de photographie est celle du thème : on ne l'invente ni ne la
   remplace ; toute section plein cadre tient sans elle.
   ════════════════════════════════════════════════════════════════════════════ */

let C: Record<string, string> = {
  bg: "#0b0f12",
  bgAlt: "#111820",
  bgDark: "#060a0d",
  bgDarkAlt: "#04070a",
  bgCard: "#141c25",
  accent: "var(--brand,#5fb0e8)",
  accentDark: "var(--brand-light,#93cbf3)",
  accentLight: "#0e1922",
  ink: "#eef4f8",
  textMuted: "#96a4b1",
  textFaint: "#65727e",
  border: "rgba(95,176,232,0.20)",
  white: "#ffffff",
  /* Clé métier : le vert-bleu des écrans de PC de sécurité. */
  veille: "rgba(95,176,232,0.10)",
};

const DISPLAY = "'Archivo', 'Arial Narrow', system-ui, sans-serif";
const BODY = "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_CSS = "cubic-bezier(.16,1,.3,1)";

const NAV = [
  { l: "Dispositifs", h: "#services" },
  { l: "La méthode", h: "#methode" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* ── Données de démonstration — textes du thème, conservés ─────────────────── */

const SERVICES_SOURCE = [
  {
    titre: "Gardiennage de sites",
    desc: "Postes fixes jour/nuit : industries, chantiers, sièges. Agents cartés, consignes écrites, main courante électronique consultable.",
    tag: "Sites",
    n: "01",
  },
  {
    titre: "Rondes & interventions",
    desc: "Rondes aléatoires horodatées, levée de doute sur alarme, intervention sous 15 minutes en ville — rapport photo à chaque passage.",
    tag: "Rondes",
    n: "02",
  },
  {
    titre: "Événementiel",
    desc: "Concerts, salons, matchs : palpations (agents habilités), filtrage, évacuation. Dimensionnement selon les normes préfectorales.",
    tag: "Événement",
    n: "03",
  },
  {
    titre: "Sécurité incendie (SSIAP)",
    desc: "Agents SSIAP 1 à 3 pour ERP et IGH : la sécurité des personnes est une qualification, pas une option.",
    tag: "SSIAP",
    n: "04",
  },
  {
    titre: "Télésurveillance",
    desc: "Vidéo analysée depuis notre PC 24h/24, levée de doute humaine avant toute intervention — fini les déplacements pour un chat.",
    tag: "Vidéo",
    n: "05",
  },
  {
    titre: "Arrière-boutiques du luxe",
    desc: "Boutiques, joailleries, événements privés : agents en civil, discrétion contractuelle, protocoles écrits.",
    tag: "Discret",
    n: "06",
  },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE = [
  {
    n: "01",
    t: "Audit du site",
    d: "Flux, accès, points faibles, obligations réglementaires : l'audit écrit précède tout devis.",
  },
  {
    n: "02",
    t: "Dispositif dimensionné",
    d: "Le bon nombre d'agents, les bonnes qualifications (SSIAP, palpation, cynophile) — jamais de sur-vente.",
  },
  {
    n: "03",
    t: "Agents briefés et encadrés",
    d: "Consignes écrites signées, chef de poste dédié, contrôles inopinés de nos superviseurs.",
  },
  {
    n: "04",
    t: "Reporting exploitable",
    d: "Main courante électronique, rapports d'événement sous 24 h, revue mensuelle de dispositif.",
  },
];

const ENGAGEMENT_DEMO = [
  "Autorisation d'exercice CNAPS affichée, agents titulaires de la carte professionnelle",
  "Aucune sous-traitance en cascade : les agents sont nos salariés, en CDI à 85 %",
  "Assurance RC pro spécifique sécurité privée, attestations jointes aux devis",
  "Code de déontologie CNAPS appliqué et rappelé à chaque prise de poste",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

const TARIFS_DEMO = [
  {
    a: "Agent de sécurité (heure)",
    p: "dès 26 € HT",
    n: "Carté CNAPS, équipé, encadré — majorations nuit/dimanche réglementaires.",
  },
  { a: "Ronde de nuit (site)", p: "dès 39 € HT", n: "Passage horodaté, rapport photo, itinéraires aléatoires." },
  { a: "Agent SSIAP 1 (heure)", p: "dès 28 € HT", n: "ERP/IGH, registre de sécurité tenu." },
  {
    a: "Audit de site",
    p: "offert",
    n: "Pour tout dispositif étudié — rapport écrit remis dans tous les cas.",
  },
];
let TARIFS = TARIFS_DEMO;

const AVIS_SOURCE = [
  {
    texte:
      "Chantier de 18 mois en zone sensible : zéro vol depuis leur arrivée, main courante consultable en ligne, agents toujours à l'heure. Le surcoût s'est remboursé le premier mois.",
    auteur: "Conducteur de travaux, BTP",
    detail: "Gardiennage de chantier",
  },
  {
    texte:
      "Festival de 12 000 personnes : dispositif dimensionné avec la préfecture, agents pros et calmes, débriefing complet à J+2. Reconduits les yeux fermés.",
    auteur: "Organisateur de festival",
    detail: "Événementiel",
  },
  {
    texte:
      "La levée de doute vidéo a évité onze déplacements inutiles cette année — et permis une interpellation en flagrant délit. Le PC 24h/24 change tout.",
    auteur: "Gérant de concession auto",
    detail: "Télésurveillance",
  },
];
let AVIS_DEMO = AVIS_SOURCE;

function STATS_DEMO_LIVE() {
  return [
    { value: "CNAPS", label: "Autorisation d'exercice affichée" },
    { value: "24h/24", label: "PC opérationnel à " + (clientCity(sessionData) ?? "Marseille") },
    { value: "140", label: "Agents cartés en poste" },
    { value: "< 15 min", label: "Intervention sur alarme en ville" },
  ];
}
let STATS_DEMO = STATS_DEMO_LIVE();
let STATS = STATS_DEMO;

/* ── Primitives ────────────────────────────────────────────────────────────── */

function Kicker({ children, color = C.accent, align = "left" }: any) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        justifyContent: align === "center" ? "center" : "flex-start",
      }}
    >
      <span style={{ width: 40, height: 1, background: color, opacity: 0.85, flexShrink: 0 }} />
      <span
        style={{
          fontFamily: BODY,
          fontSize: 10.5,
          letterSpacing: "0.38em",
          textTransform: "uppercase",
          color,
          fontWeight: 600,
        }}
      >
        {children}
      </span>
    </div>
  );
}

function Reveal({ children, delay = 0, y = 26, style }: any) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -8% 0px" });
  return (
    <motion.div
      ref={ref}
      style={style}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Filet dégradé d'un pixel — la ligne de veille. */
function Filet({ opacity = 1 }: any) {
  return (
    <div
      aria-hidden
      style={{
        height: 1,
        width: "100%",
        background: `linear-gradient(to right, transparent, ${C.accent}, transparent)`,
        opacity: 0.32 * opacity,
        pointerEvents: "none",
      }}
    />
  );
}

function ChiffreFantome({ children, top, right, size = "clamp(8rem,20vw,20rem)" }: any) {
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        top,
        right,
        fontFamily: DISPLAY,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 0.8,
        color: C.accent,
        opacity: 0.06,
        pointerEvents: "none",
        userSelect: "none",
        letterSpacing: "-0.05em",
      }}
    >
      {children}
    </span>
  );
}

function BoutonVeille({ href, children, plein = true, large = false }: any) {
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
        padding: large ? "17px 34px" : "14px 28px",
        fontFamily: BODY,
        fontSize: large ? 15 : 14,
        fontWeight: 600,
        letterSpacing: "0.05em",
        textDecoration: "none",
        borderRadius: 3,
        border: `1px solid ${plein ? (h ? C.accentDark : C.accent) : h ? C.accent : "rgba(238,244,248,0.24)"}`,
        background: plein ? (h ? C.accentDark : C.accent) : h ? "rgba(95,176,232,0.10)" : "transparent",
        color: plein ? C.bgDark : C.ink,
        transform: h ? "translateY(-3px)" : "none",
        boxShadow: h
          ? "0 18px 42px -18px rgba(95,176,232,0.55), 0 3px 12px -6px rgba(0,0,0,0.6)"
          : "0 0 0 0 rgba(0,0,0,0)",
        transition: `all .5s ${EASE_CSS}`,
        minHeight: 44,
      }}
    >
      {children}
      <ArrowRight
        size={15}
        style={{ transform: h ? "translateX(5px)" : "none", transition: `transform .5s ${EASE_CSS}` }}
      />
    </a>
  );
}

function NavLien({ l, h }: any) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={h}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        fontFamily: BODY,
        fontSize: 13.5,
        fontWeight: 500,
        letterSpacing: "0.05em",
        color: hov ? C.ink : C.textMuted,
        textDecoration: "none",
        padding: "12px 2px",
        transition: `color .45s ${EASE_CSS}`,
      }}
    >
      {l}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          bottom: 6,
          height: 1,
          width: hov ? "100%" : "0%",
          background: C.accent,
          transition: `width .5s ${EASE_CSS}`,
        }}
      />
    </a>
  );
}

function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || fallback;
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════════════ */
export default function SentinellePage() {
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

  STATS_DEMO = STATS_DEMO_LIVE();
  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...SERVICES_SOURCE[i % SERVICES_SOURCE.length],
      titre: s.title,
    })),
    SERVICES_SOURCE,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      ...AVIS_SOURCE[i % AVIS_SOURCE.length],
      auteur: r.author,
      texte: r.text,
    })),
    AVIS_SOURCE,
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
  STATS = resolveList(clientStats(sessionData), STATS_DEMO);
  ENGAGEMENT = resolveList(
    clientList(sessionData, "engagements.liste") ?? clientCertifications(sessionData),
    ENGAGEMENT_DEMO,
  );
  brand = fd?.brandColor ?? null;
  if (brand) {
    C = { ...C, accent: brand };
  }

  const SERVICES = resolveList(
    clientServices(sessionData)?.map((s: any, n: number) => ({
      titre: s.title ?? SERVICES_DEMO[n % SERVICES_DEMO.length].titre,
      desc: s.description ?? s.desc ?? SERVICES_DEMO[n % SERVICES_DEMO.length].desc,
      tag: SERVICES_DEMO[n % SERVICES_DEMO.length].tag,
      n: SERVICES_DEMO[n % SERVICES_DEMO.length].n,
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

  /*
    Un seul index pilote tout le héros : le secteur nommé dans la bande de
    veille, la fraction, la position de la ligne de balayage. Il ne fabrique
    aucun texte — il fait défiler les dispositifs que le thème (ou le client)
    a déjà écrits.
  */
  const { i, go } = useSlides(SERVICES.length, DWELL.slow);
  const secteur = SERVICES[i];
  /* Deuxième index, hors héros : les avis en projecteur. */
  const avis = useSlides(AVIS.length, DWELL.slow);
  const A = AVIS[avis.i];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = clientPhone(sessionData) ?? fd?.phone ?? "04 91 00 00 01";
  const telHref = `tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33491000001").replace(/\s+/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "operations@sentinelle-sud.fr";
  const nom = fd?.businessName ?? clientName(sessionData) ?? "Sentinelle Sud";
  const ville = clientCity(sessionData) ?? "Marseille";
  const metier = clientTrade(sessionData) ?? "Sécurité privée";

  /*
    Le lockup du geste. Le contour porte la première ligne du titre, le plein
    la seconde : c'est exactement la figure « présence qui se matérialise ».
    Calibré court (14 caractères) parce que les deux lignes sont énormes.
  */
  const ghost = (clientHeroLine(sessionData, 0, 2, 14) ?? "Votre site").toUpperCase();
  const solid = (clientHeroLine(sessionData, 1, 2, 14) ?? "Protégé.").toUpperCase();

  /* L'unique emplacement photographié du thème : plein cadre du héros. */
  const heroImg = photo(
    0,
    "https://images.pexels.com/photos/35562107/pexels-photo-35562107.png?auto=compress&cs=tinysrgb&w=1400",
  );
  /* Second emplacement, sans URL de repli : la bande tient en CSS seule. */
  const bandeImg = photo(1, "");

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: BODY, overflowX: "clip" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,500;0,600;0,700;0,800;1,600&family=Inter:wght@300;400;500;600&display=swap');

        .i371-navrow { display: flex; gap: clamp(16px,2vw,30px); align-items: center; }
        .i371-split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(32px,5vw,72px); align-items: center; }
        .i371-rail  { display: grid; grid-template-columns: minmax(0,0.38fr) minmax(0,1fr); gap: clamp(28px,4vw,60px); align-items: start; }
        .i371-stats { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); }
        .i371-serv  { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(280px,100%),1fr)); gap: 16px; }

        /* Ligne de balayage du héros : la seule animation en boucle du thème,
           coupée pour qui demande moins de mouvement. */
        @keyframes i371-scan { 0% { transform: translateY(-8vh); opacity: 0; } 12% { opacity: .55; } 88% { opacity: .55; } 100% { transform: translateY(108vh); opacity: 0; } }
        .i371-scan { animation: i371-scan 9s ${EASE_CSS} infinite; }
        /*
          ── Héros « bandeau bas » ──────────────────────────────────────────
          La parole en haut sur la trame de veille, le poste photographié en
          bandeau plein bord au pied.
        */
        .i371-dire {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: clamp(112px,13vh,152px) clamp(20px,5vw,64px) 0;
        }
        .i371-sousrit {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
          gap: clamp(22px, 3.4vw, 52px);
          align-items: end;
          margin-top: clamp(18px, 2.4vw, 28px);
          padding-top: clamp(18px, 2.4vw, 26px);
          border-top: 1px solid rgba(238,244,248,0.14);
        }
        .i371-bandeau { position: relative; z-index: 2; width: 100%; }
        .i371-bandeau-img {
          position: relative;
          height: clamp(160px, 26vh, 300px);
          overflow: hidden;
          border-top: 1px solid rgba(238,244,248,0.14);
        }
        .i371-bandeau-legende {
          position: absolute;
          left: clamp(20px, 5vw, 64px);
          right: clamp(20px, 5vw, 64px);
          bottom: clamp(14px, 2.4vh, 24px);
          z-index: 2;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
        }
        @media (max-width: 860px) {
          .i371-sousrit { grid-template-columns: minmax(0,1fr); row-gap: 20px; }
        }

        @media (prefers-reduced-motion: reduce) { .i371-scan { animation: none; opacity: .2; } }

        @media (max-width: 1000px) {
          .i371-rail { grid-template-columns: 1fr; }
          .i371-railsticky { position: static !important; }
        }
        @media (max-width: 900px) {
          #i371-nav { display: none !important; }
          .i371-burger { display: flex !important; }
          .i371-split { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 860px) {
          .i371-stats { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .i371-statcell { border-left: none !important; }
          .i371-tarifrow { flex-direction: column; align-items: flex-start !important; }
          .i371-herobas { padding: 0 24px 40px !important; }
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
          padding: scrolled ? "12px clamp(20px,5vw,56px)" : "22px clamp(20px,5vw,56px)",
          background: scrolled ? "rgba(6,10,13,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          transition: `padding .55s ${EASE_CSS}, background .55s ${EASE_CSS}, border-color .55s ${EASE_CSS}, backdrop-filter .55s ${EASE_CSS}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={nom}
              style={{ height: 30, maxWidth: 168, objectFit: "contain", display: "block" }}
            />
          ) : (
            <>
              <Shield size={17} color={C.accent} style={{ flexShrink: 0 }} />
              <span
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  fontSize: 18,
                  letterSpacing: "-0.005em",
                  color: C.ink,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {nom}
              </span>
              <span
                style={{
                  fontSize: 9.5,
                  letterSpacing: "0.30em",
                  textTransform: "uppercase",
                  color: C.textFaint,
                  marginLeft: 8,
                  whiteSpace: "nowrap",
                }}
              >
                {metier}
              </span>
            </>
          )}
        </div>
        <div id="i371-nav" className="i371-navrow">
          {NAV.map((n) => (
            <NavLien key={n.l} l={n.l} h={n.h} />
          ))}
          <BoutonVeille href={telHref}>Audit de site</BoutonVeille>
        </div>
        <button
          className="i371-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          style={{
            display: "none",
            flexDirection: "column",
            justifyContent: "center",
            gap: 5,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 10,
            minWidth: 44,
            minHeight: 44,
          }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: `transform .35s ${EASE_CSS}`, transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "opacity .3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: `transform .35s ${EASE_CSS}`, transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: 62,
            left: 0,
            right: 0,
            zIndex: 99,
            background: C.bgDark,
            borderBottom: `1px solid ${C.border}`,
            padding: "18px clamp(20px,6vw,28px) 24px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {NAV.map(({ l, h }) => (
            <a
              key={l}
              href={h}
              onClick={() => setMobileOpen(false)}
              style={{ color: C.ink, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "12px 0" }}
            >
              {l}
            </a>
          ))}
          <a
            href={telHref}
            style={{
              background: C.accent,
              color: C.bgDark,
              borderRadius: 3,
              padding: "14px 22px",
              fontSize: 15,
              fontWeight: 700,
              textDecoration: "none",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            Audit de site
          </a>
        </div>
      )}

      {/* ── HÉROS — H3 plein cadre, titre en bas ────────────────────────── */}
      <section
        id="hero"
        className="i371-hero"
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
          background: C.bgDark,
        }}
      >
        {/* ── HERO — bandeau bas ──────────────────────────────────────────
               La parole tient le haut sur la trame de veille ; le poste
               photographié court en bandeau d'un bord à l'autre, en pied
               d'écran. Le plein cadre à titre bas était la composition
               d'impact-349 — qui porte aussi le geste GhostSolid : deux
               pages jumelles à dix crans, c'est ce qu'on défait. Le geste
               reste, la charpente change. */}
        <TitreDeLaPage session={sessionData} />

        {/* Trame de veille : la nuit tient sans photographie. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: `linear-gradient(${C.veille} 1px, transparent 1px), linear-gradient(90deg, ${C.veille} 1px, transparent 1px)`,
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse at 22% 30%, #000 0%, transparent 74%)",
            WebkitMaskImage: "radial-gradient(ellipse at 22% 30%, #000 0%, transparent 74%)",
          }}
        />

        <div className="i371-dire">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <Kicker>{clientEyebrow(sessionData) ?? `${metier} · ${ville}`}</Kicker>
          </motion.div>

          {/* ── GESTE : GhostSolid ──────────────────────────────────────
              Le contour arrive le premier, la ligne pleine 55 ms plus tard :
              la présence se dessine, puis se matérialise. */}
          <motion.div
            initial={{ opacity: 0, y: 34, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.95, delay: 0.055, ease: EASE }}
            style={{
              margin: "clamp(18px,2.4vw,28px) 0 0",
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: "clamp(2.4rem,6.6vw,5.8rem)",
              lineHeight: 0.94,
              letterSpacing: "-0.035em",
              textTransform: "uppercase",
            }}
          >
            <GhostSolid ghost={ghost} solid={solid} accent={C.accent} className="" strokeWidth={1} />
          </motion.div>

          <div className="i371-sousrit">
            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.11, ease: EASE }}
              style={{ fontSize: "clamp(14.5px,1.2vw,16.5px)", color: "rgba(238,244,248,0.80)", lineHeight: 1.78, margin: 0 }}
            >
              {clientHeroPrestations(sessionData) ??
                c?.heroSubline ??
                "Gardiennage, rondes, événementiel, télésurveillance : une société de sécurité privée agréée CNAPS, des agents formés et encadrés, et un PC qui répond à la troisième sonnerie."}
            </motion.p>

            {/* Une seule action pleine ; les prestations restent un lien. */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.165, ease: EASE }}
              style={{ display: "flex", gap: "clamp(16px,2vw,26px)", flexWrap: "wrap", alignItems: "center" }}
            >
              <BoutonVeille href={telHref} large>
                Évaluer mon site
              </BoutonVeille>
              <a href="#services" style={{ fontSize: 13, color: C.white, textDecoration: "none", borderBottom: `1px solid ${C.accent}`, paddingBottom: 3 }}>
                Nos prestations
              </a>
            </motion.div>
          </div>
        </div>

        {/* ── LE BANDEAU — le poste, d'un bord à l'autre ─────────────────── */}
        <div className="i371-bandeau">
          <div className="i371-bandeau-img">
            {heroImg ? (
              <img
                src={heroImg}
                alt="Agent de sécurité en poste"
                loading="eager"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <div aria-hidden style={{ position: "absolute", inset: 0, background: C.bgDarkAlt, backgroundImage: `linear-gradient(${C.veille} 1px, transparent 1px), linear-gradient(90deg, ${C.veille} 1px, transparent 1px)`, backgroundSize: "44px 44px" }} />
            )}
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(7,12,17,0.92) 0%, rgba(7,12,17,0.3) 46%, rgba(7,12,17,0.6) 100%)" }} />

            {/* Le secteur montré, et de quoi passer aux autres. */}
            <div className="i371-bandeau-legende">
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} style={{ minWidth: 0 }}>
                <span style={{ fontSize: 10.5, letterSpacing: "0.30em", textTransform: "uppercase", color: C.accent, display: "block", marginBottom: 5 }}>
                  {secteur?.tag}
                </span>
                <span style={{ fontSize: 14, color: "rgba(238,244,248,0.86)", fontWeight: 500 }}>
                  {secteur?.titre}
                </span>
              </motion.div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                {SERVICES.map((sv: any, n: number) => (
                  <button
                    key={sv.titre ?? n}
                    type="button"
                    onClick={() => go(n)}
                    aria-label={sv.titre ?? `Secteur ${n + 1}`}
                    aria-current={n === i}
                    style={{ width: 32, height: 3, padding: 0, border: "none", cursor: "pointer", background: n === i ? C.accent : "rgba(238,244,248,0.28)", transition: "background .3s" }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RESPIRATION ─────────────────────────────────────────────────── */}
      <section
        style={{
          background: C.bg,
          padding: "clamp(70px,10vw,128px) clamp(24px,8vw,140px)",
          textAlign: "center",
        }}
      >
        <Reveal>
          <p
            style={{
              fontFamily: DISPLAY,
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: "clamp(1.3rem,2.9vw,2.5rem)",
              lineHeight: 1.34,
              letterSpacing: "-0.02em",
              color: C.ink,
              maxWidth: 880,
              margin: "0 auto",
            }}
          >
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (
              <>
                La bonne présence, <span style={{ color: C.accent }}>au bon endroit</span> — et
                rien de plus.
              </>
            )}
          </p>
        </Reveal>
        <Reveal delay={0.14}>
          <div style={{ width: 1, height: 68, background: `linear-gradient(${C.accent}, transparent)`, margin: "40px auto 0" }} />
        </Reveal>
      </section>

      {/* ── CHIFFRES — bande fine ───────────────────────────────────────── */}
      <section style={{ background: C.bgDark }}>
        <div
          className="i371-stats"
          style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(20px,5vw,56px)" }}
        >
          {STATS.map((s: any, idx: number) => (
            <Reveal key={s.label ?? idx} delay={idx * 0.055}>
              <div
                className="i371-statcell"
                style={{
                  padding: "clamp(26px,3vw,40px) clamp(12px,1.6vw,24px)",
                  borderLeft: idx === 0 ? "none" : `1px solid ${C.border}`,
                }}
              >
                <div
                  style={{
                    fontFamily: DISPLAY,
                    fontWeight: 700,
                    fontSize: "clamp(22px,2.6vw,34px)",
                    color: C.accent,
                    lineHeight: 1,
                    letterSpacing: "-0.025em",
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: 12.5, color: C.textFaint, marginTop: 9, lineHeight: 1.55, letterSpacing: "0.03em" }}>
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── DISPOSITIFS — rangées éditoriales numérotées ────────────────── */}
      <section
        id="services"
        style={{
          background: C.bg,
          padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <ChiffreFantome top="3%" right="-2%">
          24
        </ChiffreFantome>
        <div className="i371-rail" style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
          {/* Rail de gauche : il tient pendant que les dispositifs défilent. */}
          <Reveal>
            <div className="i371-railsticky" style={{ position: "sticky", top: 108 }}>
              <Kicker>Dispositifs</Kicker>
              <h2
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 800,
                  fontSize: "clamp(1.8rem,3.6vw,2.9rem)",
                  lineHeight: 1.06,
                  letterSpacing: "-0.032em",
                  color: C.ink,
                  margin: "22px 0 20px",
                }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                  <>
                    La bonne présence,
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accent }}>au bon endroit.</em>
                  </>
                )}
              </h2>
              <p style={{ fontSize: 14.5, color: C.textMuted, lineHeight: 1.75, maxWidth: 340, margin: 0 }}>
                Six dispositifs, une seule règle : ce qui est écrit dans les consignes est ce
                qui est fait sur le terrain.
              </p>
            </div>
          </Reveal>

          <div>
            <Filet />
            {SERVICES.map((s: any, idx: number) => (
              <Reveal key={s.titre ?? idx} delay={(idx % 3) * 0.055}>
                <RangeeDispositif s={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── LA MÉTHODE — chronologie filetée ────────────────────────────── */}
      <section
        id="methode"
        style={{
          background: C.bgAlt,
          padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <Kicker>La méthode</Kicker>
            <h2
              style={{
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: "clamp(1.8rem,3.8vw,3rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.032em",
                color: C.ink,
                margin: "22px 0 clamp(34px,4vw,54px)",
                maxWidth: 720,
              }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                <>
                  Des consignes écrites,
                  <br />
                  <em style={{ fontStyle: "italic", color: C.accent }}>des comptes rendus lisibles.</em>
                </>
              )}
            </h2>
          </Reveal>

          <div style={{ position: "relative", paddingLeft: "clamp(30px,5vw,64px)" }}>
            {/* La colonne de veille : un filet vertical d'un pixel. */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: "clamp(9px,1.6vw,20px)",
                top: 8,
                bottom: 8,
                width: 1,
                background: `linear-gradient(to bottom, transparent, ${C.accent}, transparent)`,
                opacity: 0.4,
              }}
            />
            {METHODE.map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.055}>
                <div style={{ position: "relative", paddingBottom: idx === METHODE.length - 1 ? 0 : "clamp(28px,3.4vw,44px)" }}>
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: "calc(clamp(9px,1.6vw,20px) - clamp(30px,5vw,64px) - 3px)",
                      top: 7,
                      width: 7,
                      height: 7,
                      borderRadius: 999,
                      background: C.accent,
                      boxShadow: `0 0 0 4px ${C.accentLight}`,
                    }}
                  />
                  <div
                    style={{
                      fontSize: 10.5,
                      letterSpacing: "0.32em",
                      textTransform: "uppercase",
                      color: C.accent,
                      marginBottom: 8,
                    }}
                  >
                    Étape {m.n}
                  </div>
                  <h3
                    style={{
                      fontFamily: DISPLAY,
                      fontWeight: 700,
                      fontSize: "clamp(17px,1.7vw,21px)",
                      color: C.ink,
                      margin: "0 0 9px",
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {m.t}
                  </h3>
                  <p style={{ fontSize: 14.5, color: C.textMuted, lineHeight: 1.75, margin: 0, maxWidth: 620 }}>
                    {m.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENTS — panneau de nuit + liste ───────────────────────── */}
      <section
        id="engagements"
        style={{
          background: C.bg,
          padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)",
        }}
      >
        <div className="i371-split" style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            {/* Deuxième emplacement photo. Sans image, le panneau reste un
                objet dessiné — jamais un rectangle vide. */}
            <div
              style={{
                position: "relative",
                border: `1px solid ${C.border}`,
                borderRadius: 3,
                overflow: "hidden",
                aspectRatio: "4/3",
                background: `linear-gradient(150deg, ${C.accentLight} 0%, ${C.bgDarkAlt} 100%)`,
              }}
            >
              {bandeImg ? (
                <img
                  src={bandeImg}
                  alt="Poste de contrôle et main courante"
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : (
                <>
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `linear-gradient(${C.veille} 1px, transparent 1px), linear-gradient(90deg, ${C.veille} 1px, transparent 1px)`,
                      backgroundSize: "34px 34px",
                    }}
                  />
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                      width: "70%",
                      height: "70%",
                      borderRadius: 999,
                      background: `radial-gradient(circle, ${C.accent} 0%, transparent 66%)`,
                      opacity: 0.12,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 14,
                      padding: 24,
                      textAlign: "center",
                    }}
                  >
                    <Shield size={30} color={C.accent} strokeWidth={1.2} />
                    <span
                      style={{
                        fontFamily: DISPLAY,
                        fontWeight: 700,
                        fontSize: "clamp(15px,1.8vw,20px)",
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: C.ink,
                      }}
                    >
                      PC opérationnel
                    </span>
                    <span style={{ fontSize: 12, color: C.textFaint, letterSpacing: "0.14em" }}>24h/24 · {ville}</span>
                  </div>
                </>
              )}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  background: "rgba(4,7,10,0.86)",
                  borderTop: `1px solid ${C.border}`,
                  borderRight: `1px solid ${C.border}`,
                  padding: "10px 18px",
                  fontSize: 10.5,
                  letterSpacing: "0.30em",
                  textTransform: "uppercase",
                  color: C.accent,
                }}
              >
                Agents cartés
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              <Kicker>Nos garanties</Kicker>
              <h2
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 800,
                  fontSize: "clamp(1.7rem,3.2vw,2.6rem)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.032em",
                  color: C.ink,
                  margin: "20px 0 28px",
                }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>
                    Réglementés,
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accent }}>et contrôlables.</em>
                  </>
                )}
              </h2>
              {ENGAGEMENT.map((e: any, idx: number) => (
                <div key={idx} style={{ display: "flex", gap: 14, marginBottom: 16, alignItems: "flex-start" }}>
                  <span
                    aria-hidden
                    style={{ flexShrink: 0, marginTop: 9, width: 22, height: 1, background: C.accent, opacity: 0.85 }}
                  />
                  <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.7 }}>{e}</span>
                </div>
              ))}
              <div style={{ marginTop: 30 }}>
                <BoutonVeille href={telHref}>Nous appeler</BoutonVeille>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TARIFS — bandes fines ───────────────────────────────────────── */}
      <section
        id="tarifs"
        style={{
          background: C.bgDark,
          padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <ChiffreFantome top="8%" right="1%" size="clamp(6rem,13vw,14rem)">
          €
        </ChiffreFantome>
        <div style={{ maxWidth: 1020, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <Kicker>Tarifs</Kicker>
            <h2
              style={{
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: "clamp(1.8rem,3.6vw,2.9rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.032em",
                color: C.ink,
                margin: "22px 0 14px",
              }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                <>
                  Au juste prix <em style={{ fontStyle: "italic", color: C.accent }}>d'un agent déclaré.</em>
                </>
              )}
            </h2>
            <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 620, lineHeight: 1.75, margin: 0 }}>
              Un tarif anormalement bas signifie toujours travail dissimulé ou agent non
              carté — les donneurs d'ordre sont co-responsables. Nos prix tiennent la route et
              les contrôles.
            </p>
          </Reveal>

          <div style={{ marginTop: "clamp(30px,4vw,52px)" }}>
            <Filet />
            {TARIFS.map((t: any, idx: number) => (
              <Reveal key={t.a ?? idx} delay={idx * 0.05}>
                <BandeTarif t={t} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVIS — projecteur rotatif ───────────────────────────────────── */}
      <section
        style={{
          background: C.bgDarkAlt,
          padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "72vw",
            height: "72vw",
            maxWidth: 1020,
            maxHeight: 1020,
            background: `radial-gradient(circle, ${C.accent} 0%, transparent 62%)`,
            opacity: 0.1,
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", textAlign: "center" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Kicker align="center">Retours de terrain</Kicker>
            </div>
            <h2
              style={{
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: "clamp(1.8rem,3.6vw,2.8rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.032em",
                color: C.ink,
                margin: "22px 0 clamp(32px,4vw,48px)",
              }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                <>
                  Des sites <em style={{ fontStyle: "italic", color: C.accent }}>tenus</em>.
                </>
              )}
            </h2>
          </Reveal>

          <motion.blockquote
            key={avis.i}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: EASE }}
            style={{ margin: 0 }}
          >
            <p
              style={{
                fontFamily: DISPLAY,
                fontStyle: "italic",
                fontWeight: 600,
                fontSize: "clamp(1.05rem,2vw,1.55rem)",
                lineHeight: 1.56,
                color: C.ink,
                margin: "0 auto",
                maxWidth: 780,
                letterSpacing: "-0.01em",
              }}
            >
              «&nbsp;{A?.texte}&nbsp;»
            </p>
            <footer style={{ marginTop: 26 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.white, letterSpacing: "0.04em" }}>{A?.auteur}</div>
              <div
                style={{
                  fontSize: 11.5,
                  color: C.accent,
                  marginTop: 6,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                }}
              >
                {A?.detail}
              </div>
            </footer>
          </motion.blockquote>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginTop: 32 }}>
            <SlideIndex i={avis.i} total={AVIS.length} variant="flat" color={C.textFaint} className="" />
            <HairlineArrows onPrev={avis.prev} onNext={avis.next} color={C.textMuted} className="" />
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section
        id="contact"
        style={{
          background: C.accentLight,
          padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: `linear-gradient(${C.veille} 1px, transparent 1px), linear-gradient(90deg, ${C.veille} 1px, transparent 1px)`,
            backgroundSize: "56px 56px",
            opacity: 0.7,
          }}
        />
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Kicker align="center">Audit offert</Kicker>
            </div>
            <h2
              style={{
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: "clamp(1.9rem,4vw,3.1rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.032em",
                color: C.ink,
                margin: "22px 0 18px",
              }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                <>
                  Votre site a des failles.
                  <br />
                  <em style={{ fontStyle: "italic", color: C.accent }}>Autant les connaître.</em>
                </>
              )}
            </h2>
            <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 480, margin: "0 auto 38px", lineHeight: 1.75 }}>
              Audit de sûreté offert, rapport écrit remis même si vous ne donnez pas suite. PC
              opérationnel joignable 24h/24.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <BoutonVeille href={telHref} large>
                <Phone size={16} style={{ marginRight: 2 }} /> {phone}
              </BoutonVeille>
              <BoutonVeille href={`mailto:${mail}`} plein={false} large>
                <Mail size={16} style={{ marginRight: 2 }} /> Nous écrire
              </BoutonVeille>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PIED DE PAGE ────────────────────────────────────────────────── */}
      <footer style={{ background: C.bgDark, padding: "clamp(44px,6vw,68px) clamp(20px,5vw,64px) 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 34, marginBottom: 36 }}>
            <div style={{ minWidth: 240 }}>
              <div
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  fontSize: 19,
                  color: C.accent,
                  marginBottom: 10,
                  letterSpacing: "-0.005em",
                }}
              >
                {nom}
              </div>
              <p style={{ color: C.textFaint, fontSize: 13, lineHeight: 1.75, margin: 0, maxWidth: 360 }}>
                {metier} · {ville}
                <br />
                Autorisation CNAPS AUT-013-2126-01-15-20260012345 — agents cartés
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <MapPin size={13} />, t: clientAddress(sessionData) ?? `${ville}, Bouches-du-Rhône` },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Mail size={13} />, t: mail },
                { icon: <Clock size={13} />, t: "PC opérationnel 24h/24 · bureaux Lun–Ven 9h–18h" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 11, color: C.textFaint, fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.accent }}>{item.icon}</span>
                  {item.t}
                </div>
              ))}
            </div>
          </div>
          <Filet />
          <div style={{ paddingTop: 18, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ color: C.textFaint, fontSize: 12, opacity: 0.8 }}>
              © 2026 {nom} — Site réalisé par Aevia WS · SIREN{" "}
              <LegalIdentity fallback="852 546 225" kind="siren" />
              {/* VILLE_PIED */}
              {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ color: C.textFaint, fontSize: 12, opacity: 0.8 }}>
              Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Sous-composants à état local ──────────────────────────────────────────── */

function RangeeDispositif({ s }: any) {
  const [h, setH] = useState(false);
  return (
    <article
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        position: "relative",
        display: "flex",
        gap: "clamp(16px,2.4vw,32px)",
        alignItems: "flex-start",
        padding: "clamp(22px,2.8vw,32px) clamp(10px,1.6vw,22px)",
        borderBottom: `1px solid ${C.border}`,
        background: h ? C.bgCard : "transparent",
        transform: h ? "translateX(8px)" : "none",
        boxShadow: h
          ? `inset 2px 0 0 0 ${C.accent}, 0 16px 36px -26px rgba(0,0,0,0.9)`
          : "none",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      <span
        aria-hidden
        style={{
          flexShrink: 0,
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: "clamp(20px,2.2vw,28px)",
          color: C.accent,
          opacity: h ? 0.85 : 0.35,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          transition: `opacity .5s ${EASE_CSS}`,
          minWidth: 44,
        }}
      >
        {s.n}
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 9 }}>
          <h3
            style={{
              fontFamily: DISPLAY,
              fontWeight: 700,
              fontSize: "clamp(17px,1.8vw,22px)",
              color: C.ink,
              margin: 0,
              letterSpacing: "-0.018em",
            }}
          >
            {s.titre}
          </h3>
          <span
            style={{
              border: `1px solid ${C.border}`,
              color: C.accent,
              borderRadius: 999,
              padding: "3px 11px",
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              whiteSpace: "nowrap",
            }}
          >
            {s.tag}
          </span>
        </div>
        <p style={{ fontSize: 14.5, color: C.textMuted, lineHeight: 1.75, margin: 0, maxWidth: 620 }}>{s.desc}</p>
      </div>
    </article>
  );
}

function BandeTarif({ t }: any) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className="i371-tarifrow"
      style={{
        display: "flex",
        gap: 18,
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "clamp(20px,2.4vw,28px) clamp(8px,1.4vw,18px)",
        borderBottom: `1px solid ${C.border}`,
        background: h ? C.bgCard : "transparent",
        transform: h ? "translateX(6px)" : "none",
        boxShadow: h ? `inset 2px 0 0 0 ${C.accent}, 0 12px 30px -22px rgba(0,0,0,0.85)` : "none",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      <div style={{ minWidth: 0, flex: "1 1 320px" }}>
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: "clamp(16px,1.5vw,19px)",
            color: C.ink,
            letterSpacing: "-0.015em",
          }}
        >
          {t.a}
        </div>
        <div style={{ fontSize: 13.5, color: C.textMuted, marginTop: 7, lineHeight: 1.65, maxWidth: 540 }}>{t.n}</div>
      </div>
      <div
        style={{
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: "clamp(17px,1.7vw,22px)",
          color: h ? C.accentDark : C.accent,
          whiteSpace: "nowrap",
          transition: `color .5s ${EASE_CSS}`,
        }}
      >
        {t.p}
      </div>
    </div>
  );
}
