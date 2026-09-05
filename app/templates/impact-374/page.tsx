"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Car, CheckCircle, Clock, HeartPulse, Mail, MapPin, Phone, Star } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DifferentialExit } from "@/lib/templates/hero-kit-3";
import { ActionMobile } from "@/lib/templates/ActionMobile";
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
   CAP CHAUFFEUR — VTC du quotidien & transport médical assis · Rennes.
   Réécriture premium : héros H9 double colonne + rail de stats vertical
   dessiné en bord de route (pointillés d'axe, jalons kilométriques),
   geste DifferentialExit — le titre, le paragraphe et le rail ne partent
   pas à la même vitesse au défilement : trois plans, trois vitesses,
   la parallaxe du trajet. P8 : Newsreader (voix) + Manrope (lecture).
   Palette claire #f4f6fa / #33518f — à distinguer d'impact-316 (même
   geste H9) par la palette bleu nuit, la paire de fontes et le dessin
   routier des sections (route horaire, tarifs en grille horaire).
   ════════════════════════════════════════════════════════════════════════════ */

let C: Record<string, string> = {
  bg: "#f4f6fa",
  bgAlt: "#e9edf5",
  bgDark: "#141d33",
  bgDarkAlt: "#0e1526",
  bgCard: "#ffffff",
  accent: "var(--brand,#33518f)",
  accentDark: "var(--brand-light,#24406f)",
  accentLight: "#dbe3f2",
  ink: "#131b2c",
  textMuted: "#4c576e",
  textFaint: "#7e89a1",
  border: "#d4dbe8",
  white: "#ffffff",
  /* Clé métier : le jaune des feux de position, réservé aux jalons. */
  jalon: "#e8b64c",
};

/*
  La paire du plan (P8) : « Newsreader » porte la voix du thème — une serif
  de quotidien, celle des horaires imprimés — et « Manrope » porte la
  lecture. Deux rôles opposés : la serif ne va qu'aux titres et aux chiffres
  du rail, la sans-serif à tout ce qui se lit.
*/
const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Manrope:wght@300;400;500;600;700;800&display=swap');`;
const SERIF = "'Newsreader', Georgia, 'Times New Roman', serif";
const SANS = "'Manrope', system-ui, -apple-system, sans-serif";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const NAV = [
  { l: "Services", h: "#services" },
  { l: "Médical & TAP", h: "#tap" },
  { l: "Comment ça marche", h: "#methode" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* ── Données de démonstration ────────────────────────────────────────────── */

function SERVICES_SOURCE_LIVE() {
  return [
    { titre: "Transport médical assis (TAP)", desc: "Dialyses, chimiothérapies, consultations : conventionné Assurance Maladie — sur prescription médicale de transport, vous n'avancez rien.", tag: "Médical" },
    { titre: "Abonnements réguliers", desc: "Les mêmes trajets chaque semaine : travail, kiné, école de musique des enfants. Le même chauffeur, l'horaire garanti, la facture mensuelle.", tag: "Réguliers" },
    { titre: "Gares & aéroport", desc: (clientCity(sessionData) ?? "Rennes") + " en TGV part tôt : prises en charge dès 6 h, bagages portés, dépose au plus près du quai.", tag: "Gares" },
    { titre: "Aînés & mobilité douce", desc: "Aide à la montée, accompagnement jusqu'à la salle d'attente, patience véritable : le trajet fait partie du soin.", tag: "Aînés" },
    { titre: "Enfants & ados", desc: "Conservatoire, sport, garde alternée : des trajets confiés au même chauffeur connu des parents — avec SMS d'arrivée.", tag: "Familles" },
    { titre: "Courses ponctuelles", desc: "Un dîner, un rendez-vous, une voiture au garage : le VTC classique, au prix annoncé avant de monter.", tag: "Ponctuel" },
  ];
}
let SERVICES_SOURCE = SERVICES_SOURCE_LIVE();
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE = [
  { n: "01", t: "On cale vos trajets", d: "Un appel pour poser les habitudes : jours, heures, adresses, particularités. Tout est écrit." },
  { n: "02", t: "Confirmation la veille", d: "SMS la veille au soir avec l'heure et le chauffeur. Pas de doute au réveil." },
  { n: "03", t: "Le trajet, soigné", d: "Ponctualité, aide à la montée, conduite souple : les habitués choisissent leur musique — ou le silence." },
  { n: "04", t: "La facturation simple", d: "Tiers payant pour le médical conventionné, facture mensuelle pour les abonnés, reçu immédiat sinon." },
];

const ENGAGEMENT_DEMO = [
  "Carte professionnelle VTC, entreprise au registre REVTC, assurance transport de personnes",
  "Conventionné transport assis (TAP) : le médical sur prescription, sans avance de frais",
  "Chauffeurs stables : vos trajets réguliers gardent le même visage",
  "SMS de confirmation la veille et d'arrivée à destination pour les proches qui s'inquiètent",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

function TARIFS_DEMO_LIVE() {
  return [
    { a: "Transport médical assis (TAP)", p: "conventionné", n: "Sur prescription médicale de transport — tiers payant, zéro avance." },
    { a: "Trajet en ville", p: "dès 12 €", n: "Prix ferme annoncé à la réservation, attente raisonnable incluse." },
    { a: "Abonnement hebdo (4 trajets)", p: "dès 44 €/sem.", n: "Mêmes trajets, même chauffeur, facturé au mois." },
    { a: "Gare de " + (clientCity(sessionData) ?? "Rennes") + " (départ 6h-8h)", p: "18 €", n: "Prise en charge à domicile, dépose au plus près du quai." },
  ];
}
let TARIFS_DEMO = TARIFS_DEMO_LIVE();
let TARIFS = TARIFS_DEMO;

const AVIS_SOURCE = [
  { texte: "Trois dialyses par semaine depuis un an : toujours à l'heure, toujours le même chauffeur, la prescription gérée avec la CPAM sans que je m'en occupe. Ce service tient ma semaine debout.", auteur: "Gérard L., 71 ans", detail: "Transport médical TAP" },
  { texte: "Ma fille va au conservatoire le mercredi avec Cap Chauffeur depuis deux ans. SMS au départ, SMS à l'arrivée : je travaille tranquille, elle est autonome en sécurité.", auteur: "Maman de Jeanne, 11 ans", detail: "Abonnement famille" },
  { texte: "TGV de 6h38 tous les lundis : le chauffeur sonne à 6h05, le café est encore chaud à Montparnasse. La régularité parfaite, sans y penser.", auteur: "Consultant rennais", detail: "Abonnement gare" },
];
let AVIS_DEMO = AVIS_SOURCE;

const STATS_DEMO = [
  { value: "TAP", label: "Transport médical assis conventionné" },
  { value: "6h", label: "Premières prises en charge" },
  { value: "180+", label: "Abonnés réguliers" },
  { value: "100 %", label: "De courses confirmées la veille" },
];
let STATS = STATS_DEMO;

/* Les arrêts de la journée type — tous tirés des services existants. */
const TRAJETS_DEMO = [
  "Gares & aéroport, dès 6 h",
  "Dialyses & rendez-vous médicaux",
  "Travail, kiné, courses du quotidien",
  "Conservatoire, sport, sorties d'école",
];
let TRAJETS = TRAJETS_DEMO;

/* ── Primitives ──────────────────────────────────────────────────────────── */

/** Kicker filé : 40×1 px + capitales espacées. */
function Eyebrow({ children, color = C.accent, align = "left" }: { children: React.ReactNode; color?: string; align?: "left" | "center" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: align === "center" ? "center" : "flex-start" }}>
      <span style={{ width: 40, height: 1, background: color, opacity: 0.75, flexShrink: 0 }} />
      <span style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.36em", textTransform: "uppercase", color, fontWeight: 700 }}>{children}</span>
      {align === "center" ? <span style={{ width: 40, height: 1, background: color, opacity: 0.75, flexShrink: 0 }} /> : null}
    </div>
  );
}

function Reveal({ children, delay = 0, y = 30, style }: { children: React.ReactNode; delay?: number; y?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  return (
    <motion.div ref={ref} style={style} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.9, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}

/** Bouton principal — élévation, deux ombres, flèche qui avance. */
function CtaButton({ href, children, filled = true, dark = false }: { href: string; children: React.ReactNode; filled?: boolean; dark?: boolean }) {
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
        padding: filled ? "15px 30px" : "14px 26px",
        fontFamily: SANS,
        fontSize: 14.5,
        fontWeight: 700,
        letterSpacing: "0.02em",
        textDecoration: "none",
        borderRadius: 8,
        border: `1.5px solid ${filled ? "transparent" : dark ? "rgba(255,255,255,0.35)" : C.border}`,
        background: filled ? (h ? C.accentDark : C.accent) : h ? (dark ? "rgba(255,255,255,0.08)" : "rgba(51,81,143,0.06)") : "transparent",
        color: filled ? "#ffffff" : dark ? "#ffffff" : C.ink,
        transform: h ? "translateY(-2px)" : "none",
        boxShadow: h
          ? filled
            ? "0 14px 34px -12px rgba(51,81,143,0.55), 0 3px 10px -4px rgba(19,27,44,0.25)"
            : "0 10px 26px -14px rgba(19,27,44,0.3), 0 2px 8px -4px rgba(19,27,44,0.12)"
          : "none",
        transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {children}
      <ArrowRight size={16} style={{ transform: h ? "translateX(5px)" : "none", transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)" }} />
    </a>
  );
}

function NavLink({ l, h }: { l: string; h: string }) {
  const [on, setOn] = useState(false);
  return (
    <a
      href={h}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      style={{ position: "relative", color: on ? C.ink : C.textMuted, fontSize: 13.5, fontWeight: 600, textDecoration: "none", padding: "12px 4px", transition: "color 0.3s" }}
    >
      {l}
      <span style={{ position: "absolute", left: 4, bottom: 8, height: 1.5, width: on ? "calc(100% - 8px)" : "0%", background: C.accent, transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)" }} />
    </a>
  );
}

/** Une prestation : rangée numérotée, filet, glissement au survol. */
function ServiceRow({ s, idx }: { s: any; idx: number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={(idx % 2) * 0.08} style={{ height: "100%" }}>
      <article
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          borderTop: `1px solid ${h ? C.accent : C.border}`,
          background: h ? C.bgCard : "transparent",
          padding: "clamp(20px,2.4vw,30px) clamp(14px,1.6vw,22px)",
          height: "100%",
          boxSizing: "border-box",
          transform: h ? "translateY(-4px)" : "none",
          boxShadow: h ? "0 22px 44px -26px rgba(19,27,44,0.35), 0 4px 14px -8px rgba(51,81,143,0.18)" : "none",
          borderRadius: h ? 10 : 0,
          transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
          cursor: "default",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
          <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(1.4rem,1.9vw,1.8rem)", color: h ? C.accent : C.textFaint, lineHeight: 1, transition: "color 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
            {String(idx + 1).padStart(2, "0")}
          </span>
          <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.accent, background: C.accentLight, borderRadius: 999, padding: "4px 12px" }}>{s.tag}</span>
        </div>
        <h3 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(1.15rem,1.6vw,1.4rem)", color: C.ink, margin: "0 0 10px", lineHeight: 1.2 }}>{s.titre}</h3>
        <p style={{ fontFamily: SANS, fontSize: 14.5, color: C.textMuted, lineHeight: 1.72, margin: 0 }}>{s.desc}</p>
      </article>
    </Reveal>
  );
}

function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || fallback;
}

/* ════════════════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════════════════ */

export default function CapChauffeurPage() {
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
  bp = session?.businessProfile;
  c = session?.generatedContent;
  sessionData = session;
  SERVICES_SOURCE = SERVICES_SOURCE_LIVE();
  TARIFS_DEMO = TARIFS_DEMO_LIVE();

  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({ ...SERVICES_SOURCE[i % SERVICES_SOURCE.length], titre: s.title })),
    SERVICES_SOURCE,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({ ...AVIS_SOURCE[i % AVIS_SOURCE.length], auteur: r.author, texte: r.text, detail: "", })),
    AVIS_SOURCE,
  );
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s, i) => ({ ...TARIFS_DEMO[i % TARIFS_DEMO.length], a: s.title, p: s.price ?? "Sur devis", n: s.desc || "" })),
    TARIFS_DEMO,
  );
  STATS = resolveList(clientStats(sessionData), STATS_DEMO);
  ENGAGEMENT = resolveList(clientCertifications(sessionData), ENGAGEMENT_DEMO);
  TRAJETS = resolveList(clientList(sessionData, "trajets.liste"), TRAJETS_DEMO);
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
      auteur: r.name ?? AVIS_DEMO[n % AVIS_DEMO.length].auteur,
      detail: r.location ?? r.role ?? AVIS_DEMO[n % AVIS_DEMO.length].detail,
    })),
    AVIS_DEMO,
  );

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = clientPhone(sessionData) ?? "02 99 00 00 01";
  const telHref = `tel:${(clientPhone(sessionData) ?? "+33299000001").replace(/[\s().]/g, "")}`;
  const mail = clientEmail(sessionData) ?? "courses@cap-chauffeur.fr";

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip", WebkitFontSmoothing: "antialiased" }}>
      <style>{`
        @media (max-width: 700px) { .i374-metier { display: none !important; } }${FONTS_CSS}
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        .i374-ease { transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }

        /* La voiture suit désormais la route horizontale, pas l'axe vertical. */
        @keyframes i374-roule { 0% { left: 4%; } 100% { left: 92%; } }

        /*
          ── Héros « diagonale asymétrique » ────────────────────────────────
          La masse teintée traverse le pied de l'écran en biais — la route
          qui file — et porte les jalons. La coupe monte de gauche à droite :
          aucune des trois autres diagonales (334, 354, 364) ne traverse le
          pied de page.
        */
        .i374-route {
          position: relative;
          background: linear-gradient(180deg, ${C.accentLight} 0%, rgba(51,81,143,0.08) 100%);
          clip-path: polygon(0 34%, 100% 0, 100% 100%, 0 100%);
          transform: none;
          padding: clamp(44px, 7vh, 84px) clamp(24px, 6vw, 96px) clamp(20px, 3vh, 34px);
        }
        .i374-route > .i374-axe { top: calc(34% + 14px); transform: rotate(-2.9deg); transform-origin: right center; }
        .i374-jalons {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(14px, 2.6vw, 44px);
          max-width: 1280px;
          margin: 0 auto;
        }
        @media (max-width: 860px) {
          .i374-jalons { grid-template-columns: 1fr 1fr; row-gap: 18px; }
          .i374-jalon > span { display: none !important; }
        }
        @keyframes i374-route { 0% { background-position-x: 0; } 100% { background-position-x: -64px; } }

        @media (max-width: 900px) {
          .i374-navlinks { display: none !important; }
          .i374-burger { display: flex !important; }
          .aevia-action-mobile { display: inline-flex !important; }
        }
        @media (max-width: 880px) {
          .i374-hero { grid-template-columns: 1fr !important; gap: 46px !important; }
          .i374-rail { border-left: none !important; padding-left: 0 !important; flex-direction: row !important; flex-wrap: wrap; gap: 26px !important; }
          .i374-rail .i374-axe { display: none !important; }
          .i374-rail .i374-jalon { flex: 1 1 40%; }
          .i374-rail .i374-dot { display: none !important; }
          .i374-voiture { display: none !important; }
          .i374-split { grid-template-columns: 1fr !important; }
          .i374-split > * { order: initial !important; }
          .i374-sticky { position: static !important; }
          .i374-services { grid-template-columns: 1fr !important; }
          .i374-route { grid-template-columns: 1fr !important; }
          .i374-route .i374-stop { border-top: none !important; border-left: 2px dashed ${C.accentLight}; padding: 10px 0 10px 22px !important; }
          .i374-avis > * { margin-top: 0 !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .i374-voiture { animation: none !important; }
          .i374-cue { display: none !important; }
        }
      `}</style>

      {/* ── NAV — collante à quatre propriétés ─────────────────────────────── */}
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
          padding: scrolled ? "10px clamp(20px,4.5vw,56px)" : "20px clamp(20px,4.5vw,56px)",
          /* Cette barre porte un texte sombre : voile clair. */
          background: scrolled ? "rgba(244,246,250,0.92)" : "linear-gradient(180deg, rgba(244,246,250,0.94) 0%, rgba(244,246,250,0.62) 62%, rgba(244,246,250,0) 100%)",
          backdropFilter: scrolled ? "blur(14px) saturate(150%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(150%)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          transition: "all 0.55s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", flexWrap: "nowrap", gap: 10, minWidth: 0, maxWidth: "62vw" }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Car size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 19, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {fd?.businessName ?? (clientName(sessionData) ?? "Cap Chauffeur")}
              </span>
              {/* Sous 700 px, l'étiquette du métier gonflait la barre. */}
              <span className="i374-metier" style={{ fontSize: 9.5, letterSpacing: "0.26em", textTransform: "uppercase", color: C.textFaint, marginLeft: 6, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>
                {clientTrade(sessionData) ?? "VTC du quotidien"}
              </span>
            </>
          )}
        </div>
        <div className="i374-navlinks" style={{ display: "flex", gap: "clamp(14px,2vw,26px)", alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <NavLink key={l} l={l} h={h} />
          ))}
          <motion.a
            href={telHref}
            style={{ background: C.accent, color: "#fff", borderRadius: 8, padding: "12px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}
            whileHover={{ scale: 1.03 }}
          >
            Réserver
          </motion.a>
        </div>
        {/* L'appel à l'action sous le pouce : la barre est fixe, mais son
            bouton vit dans le menu déroulant, en display:none sous le point
            de rupture. Celui-ci paraît exactement avec le bouton de menu. */}
        <ActionMobile href={telHref} fond={C.accent} encre={"#fff"}>
          Appeler
        </ActionMobile>
        <button
          className="i374-burger"
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
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 99, background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "20px 28px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ color: C.ink, fontSize: 16, fontWeight: 600, textDecoration: "none", padding: "12px 0" }}>
              {l}
            </a>
          ))}
          <a href={telHref} style={{ background: C.accent, color: "#fff", borderRadius: 8, padding: "13px 22px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 8 }}>
            Réserver
          </a>
        </div>
      )}

      <section
        id="hero"
        className="i374-herosec"
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "flex",
          alignItems: "flex-start",
          background: C.bg,
          overflow: "hidden",
          padding: "clamp(112px,13vh,150px) clamp(24px,6vw,96px) 0",
        }}
      >
        {/* ── HERO — diagonale asymétrique : la route coupe l'écran ────────
               La masse teintée traverse le pied de page en biais, comme une
               route qui file, et l'axe des jalons la suit : le rail vertical
               de droite — une colonne de plus — devient la route elle-même.
               Le texte vit dans le grand pan clair. La coupe monte de gauche
               à droite : aucune des trois autres diagonales (334, 354, 364)
               ne traverse le pied. Le geste DifferentialExit reste : trois
               plans, trois vitesses. */}

        {/* Texture : voies horizontales très pâles. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "repeating-linear-gradient(0deg, rgba(51,81,143,0.05) 0 1px, transparent 1px 128px)",
            pointerEvents: "none",
          }}
        />
        {/* Chiffre fantôme — l'heure de la première prise en charge. */}
        <DifferentialExit depth={0.05} style={{ position: "absolute", right: "2%", top: "10%", pointerEvents: "none", zIndex: 0 }}>
          <div
            aria-hidden
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: "clamp(140px,20vw,320px)",
              lineHeight: 0.8,
              color: C.accent,
              opacity: 0.06,
              userSelect: "none",
            }}
          >
            5h45
          </div>
        </DifferentialExit>

        {/* ── Le pan de parole ───────────────────────────────────────────── */}
        <div className="i374-pan" style={{ position: "relative", zIndex: 2, maxWidth: 1280, width: "100%", margin: "0 auto" }}>
          <div style={{ maxWidth: 640 }}>
            <DifferentialExit depth={0.9}>
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease: EASE, delay: 0.05 }}>
                <Eyebrow>{clientEyebrow(sessionData) ?? "VTC du quotidien · Rennes"}</Eyebrow>
              </motion.div>
              {/*
                Titre d'un seul tenant, d'une seule couleur : la seconde ligne
                en italique d'un autre ton était la signature de gabarit de la
                série.
              */}
              <motion.h1
                initial={{ opacity: 0, y: 42 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: EASE, delay: 0.16 }}
                style={{
                  fontFamily: SERIF,
                  fontWeight: 500,
                  fontSize: "clamp(2.3rem,5vw,4.4rem)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.015em",
                  color: C.ink,
                  margin: "clamp(18px,2.4vw,28px) 0 clamp(16px,2vw,24px)",
                  overflowWrap: "break-word",
                }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "section-1.titre") ??
                  clientHeroLine(sessionData, 0, 1, 38) ??
                  "Le chauffeur des jours où ça compte."}
              </motion.h1>
            </DifferentialExit>

            <DifferentialExit depth={0.55}>
              <motion.p
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.95, ease: EASE, delay: 0.4 }}
                style={{
                  fontFamily: SANS,
                  fontWeight: 400,
                  fontSize: "clamp(0.95rem,1.35vw,1.1rem)",
                  lineHeight: 1.75,
                  color: C.textMuted,
                  maxWidth: 500,
                  margin: "0 0 clamp(22px,2.8vw,32px)",
                }}
              >
                {clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? "Rendez-vous médicaux, gares matinales, enfants à récupérer, parents à véhiculer : un VTC de confiance pour les trajets de la vraie vie — dont le transport médical assis conventionné."}
              </motion.p>
              {/* Une seule action pleine ; les services restent un lien. */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.56 }}
                style={{ display: "flex", gap: "clamp(16px,2vw,26px)", flexWrap: "wrap", alignItems: "center" }}
              >
                <CtaButton href={telHref}>Organiser mes trajets</CtaButton>
                <a href="#services" style={{ fontFamily: SANS, fontSize: 13, color: C.ink, textDecoration: "none", borderBottom: `1px solid ${C.accent}`, paddingBottom: 3 }}>
                  Nos services
                </a>
              </motion.div>
              {/* Le détail gratuit : la promesse SMS, avec son point de position. */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.75 }}
                style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "clamp(20px,2.6vw,30px)" }}
              >
                <span style={{ position: "relative", width: 8, height: 8, flexShrink: 0 }}>
                  <span style={{ position: "absolute", inset: 0, borderRadius: 999, background: C.jalon }} />
                  <motion.span
                    aria-hidden
                    animate={{ scale: [1, 2.1], opacity: [0.55, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                    style={{ position: "absolute", inset: 0, borderRadius: 999, background: C.jalon }}
                  />
                </span>
                <span style={{ fontFamily: SANS, fontSize: 13, color: C.textFaint, fontWeight: 600, letterSpacing: "0.04em" }}>
                  Confirmation SMS la veille · arrivée annoncée aux proches
                </span>
              </motion.div>
            </DifferentialExit>
          </div>
        </div>

        {/* ── LA ROUTE — la masse en biais, et les jalons qui la suivent ─── */}
        <DifferentialExit depth={0.2} style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 1 }}>
          <div className="i374-route">
            {/* L'axe : la ligne discontinue du marquage, le long de la coupe. */}
            <span
              aria-hidden
              className="i374-axe"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: 2,
                background: `repeating-linear-gradient(90deg, ${C.accent} 0 18px, transparent 18px 38px)`,
                opacity: 0.7,
              }}
            />
            {/* La voiture — un point qui suit la route. */}
            <span
              className="i374-voiture"
              aria-hidden
              /* Posée SOUS la coupe : au-dessus, elle serait rognée par le
                 clip-path de la route. Elle suit la pente à l'œil. */
              style={{
                position: "absolute",
                top: "calc(34% + 8px)",
                left: "6%",
                width: 10,
                height: 10,
                borderRadius: 999,
                background: C.accent,
                boxShadow: `0 0 0 4px ${C.accentLight}`,
                animation: "i374-roule 9s cubic-bezier(0.16,1,0.3,1) infinite alternate",
              }}
            />
            <div className="i374-jalons">
              {STATS.map((s, n) => (
                <div key={s.label + n} className="i374-jalon" style={{ position: "relative", minWidth: 0 }}>
                  <span
                    aria-hidden
                    style={{ position: "absolute", left: 0, top: "calc(clamp(18px,2.6vh,30px) * -1 - 4px)", width: 8, height: 8, borderRadius: 999, border: `2px solid ${C.accent}`, background: C.bg }}
                  />
                  <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(1.5rem,2.4vw,2.2rem)", lineHeight: 1, color: C.accent, letterSpacing: "-0.01em" }}>{s.value}</div>
                  <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.textFaint, marginTop: 7, fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </DifferentialExit>
      </section>

      {/* ── RESPIRATION — une phrase, avant le premier bloc dense ──────────── */}
      <section style={{ background: C.bgAlt, padding: "clamp(72px,10vw,130px) clamp(24px,8vw,160px)", textAlign: "center" }}>
        <Reveal>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(1.45rem,3vw,2.5rem)", lineHeight: 1.4, color: C.ink, maxWidth: 860, margin: "0 auto" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.texte") ?? (<>
              La régularité n&apos;est pas un luxe : c&apos;est ce qui tient une semaine <em style={{ color: C.accent }}>debout</em>.
            </>)}
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div style={{ width: 2, height: 64, background: `linear-gradient(${C.accent}, transparent)`, margin: "44px auto 0", borderRadius: 2 }} />
        </Reveal>
      </section>

      {/* ── LA ROUTE — les arrêts d'une journée type, en ligne pointillée ──── */}
      <section style={{ background: C.bg, padding: "clamp(70px,9vw,120px) clamp(24px,6vw,96px)", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <Eyebrow>Une journée sur la route</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(1.8rem,3.6vw,3rem)", lineHeight: 1.06, color: C.ink, margin: "clamp(16px,2vw,24px) 0 clamp(30px,4vw,52px)", maxWidth: "24ch" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "trajets.titre") ?? (<>
                Du premier train du matin <em style={{ fontStyle: "italic", color: C.accent }}>à la sortie du conservatoire.</em>
              </>)}
            </h2>
          </Reveal>
          <div
            className="i374-route"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${TRAJETS.length}, minmax(0,1fr))`,
              gap: "clamp(18px,2.4vw,32px)",
              position: "relative",
            }}
          >
            {TRAJETS.map((t, i) => (
              <Reveal key={t + i} delay={i * 0.09}>
                <div
                  className="i374-stop"
                  style={{
                    borderTop: `2px dashed ${C.accentLight}`,
                    paddingTop: 18,
                    position: "relative",
                  }}
                >
                  <span
                    aria-hidden
                    style={{ position: "absolute", top: -6, left: 0, width: 10, height: 10, borderRadius: 999, background: i === 0 ? C.jalon : C.accent, boxShadow: `0 0 0 4px ${C.bg}` }}
                  />
                  <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(1.05rem,1.4vw,1.25rem)", color: C.ink, lineHeight: 1.35 }}>{t}</div>
                  <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textFaint, marginTop: 8, fontWeight: 700 }}>
                    Arrêt {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES — rangées numérotées à filet, en deux colonnes ────────── */}
      <section id="services" style={{ background: C.bgAlt, padding: "clamp(80px,11vw,150px) clamp(24px,6vw,96px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <Eyebrow>Nos services</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(2rem,4.2vw,3.6rem)", lineHeight: 1.05, color: C.ink, margin: "clamp(16px,2vw,26px) 0 clamp(34px,4.5vw,60px)", maxWidth: "20ch" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>
                Les trajets qui <em style={{ fontStyle: "italic", color: C.accent }}>tiennent une vie.</em>
              </>)}
            </h2>
          </Reveal>
          <div className="i374-services" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "0 clamp(28px,4vw,64px)" }}>
            {SERVICES.map((s, idx) => (
              <ServiceRow key={s.titre + idx} s={s} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TAP & ENGAGEMENTS — le bloc sombre : médical conventionné ──────── */}
      <section id="tap" style={{ background: C.bgDark, padding: "clamp(84px,11vw,150px) clamp(24px,6vw,96px)", position: "relative", overflow: "hidden" }}>
        {/* Glow radial discret + fantôme TAP. */}
        <div aria-hidden style={{ position: "absolute", top: "-16%", right: "-6%", width: "52%", height: "68%", background: "radial-gradient(ellipse, rgba(232,182,76,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", right: "-2%", bottom: "-8%", fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(9rem,20vw,20rem)", lineHeight: 1, color: C.white, opacity: 0.05, userSelect: "none", pointerEvents: "none" }}>
          TAP
        </div>
        <div
          className="i374-split"
          style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1.05fr) minmax(0,0.95fr)", gap: "clamp(44px,6vw,96px)", alignItems: "center", position: "relative", zIndex: 1 }}
        >
          <div>
            <Reveal>
              <Eyebrow color={C.jalon}>Transport médical assis · conventionné</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(1.9rem,3.8vw,3.2rem)", lineHeight: 1.06, color: C.white, margin: "clamp(16px,2vw,26px) 0 clamp(18px,2.4vw,28px)", maxWidth: "18ch" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (<>
                  De la confiance, <em style={{ fontStyle: "italic", color: C.jalon }}>trajet après trajet.</em>
                </>)}
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: "clamp(0.98rem,1.4vw,1.1rem)", lineHeight: 1.78, color: "rgba(255,255,255,0.72)", maxWidth: 480, margin: "0 0 clamp(24px,3vw,36px)" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tap.texte") ?? (
                  "Dialyses, chimiothérapies, consultations : le transport assis professionnalisé est conventionné Assurance Maladie. Sur prescription médicale de transport, vous n'avancez rien — le tiers payant est géré pour vous."
                )}
              </p>
            </Reveal>
            <div>
              {ENGAGEMENT.map((e, idx) => (
                <Reveal key={idx} delay={0.18 + idx * 0.06}>
                  <div style={{ display: "flex", gap: 14, padding: "13px 0", borderTop: idx === 0 ? "none" : "1px solid rgba(255,255,255,0.09)", alignItems: "flex-start" }}>
                    <CheckCircle size={17} color={C.jalon} style={{ flexShrink: 0, marginTop: 3 }} />
                    <span style={{ fontFamily: SANS, fontSize: 14.5, color: "rgba(255,255,255,0.8)", lineHeight: 1.65 }}>{e}</span>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.4}>
              <div style={{ marginTop: "clamp(22px,3vw,34px)" }}>
                <CtaButton href={telHref} dark>Nous appeler</CtaButton>
              </div>
            </Reveal>
          </div>

          {/* Photo du client — l'habitacle. Sans photo, l'aplat dessiné tient seul. */}
          <Reveal delay={0.15}>
            <div style={{ position: "relative" }}>
              <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)", aspectRatio: "4/3.2", background: `linear-gradient(150deg, rgba(51,81,143,0.45) 0%, rgba(19,27,44,0.9) 62%), repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 42px)` }}>
                <img
                  src={photo(0, "https://images.pexels.com/photos/11790230/pexels-photo-11790230.jpeg?auto=compress&cs=tinysrgb&w=1400")}
                  alt="Habitacle prêt pour la course"
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
              {/* Cartouche posé sur la photo — le badge conventionné. */}
              <div style={{ position: "absolute", bottom: -16, left: "clamp(16px,2.5vw,30px)", background: C.jalon, color: C.bgDarkAlt, borderRadius: 8, padding: "12px 18px", display: "flex", alignItems: "center", gap: 9, boxShadow: "0 14px 34px -14px rgba(0,0,0,0.55)" }}>
                <HeartPulse size={16} strokeWidth={2.2} />
                <span style={{ fontFamily: SANS, fontSize: 12.5, fontWeight: 800, letterSpacing: "0.06em" }}>TAP conventionné · tiers payant</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── MÉTHODE — la feuille de route, en jalons verticaux ─────────────── */}
      <section id="methode" style={{ background: C.bg, padding: "clamp(80px,11vw,150px) clamp(24px,6vw,96px)" }}>
        <div className="i374-split" style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,0.85fr) minmax(0,1.15fr)", gap: "clamp(44px,6vw,96px)", alignItems: "start" }}>
          <div style={{ position: "sticky", top: 110, alignSelf: "start" }} className="i374-sticky">
            <Reveal>
              <Eyebrow>Comment ça marche</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(1.9rem,3.8vw,3.2rem)", lineHeight: 1.06, color: C.ink, margin: "clamp(16px,2vw,24px) 0 clamp(16px,2vw,22px)", maxWidth: "16ch" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (<>
                  La régularité, <em style={{ fontStyle: "italic", color: C.accent }}>c&apos;est notre métier.</em>
                </>)}
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p style={{ fontFamily: SANS, fontSize: "clamp(0.95rem,1.35vw,1.05rem)", lineHeight: 1.75, color: C.textMuted, maxWidth: 400 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "methode.texte") ?? (
                  "Quatre étapes, toujours les mêmes : c'est ce qui fait qu'un trajet régulier ne demande plus d'y penser."
                )}
              </p>
            </Reveal>
            {/* Photo du chauffeur en tournée — sans photo, le médaillon dessiné
                (dégradé + marquage au sol) tient seul. */}
            <Reveal delay={0.2}>
              <div style={{ marginTop: "clamp(22px,3vw,34px)", borderRadius: 14, overflow: "hidden", border: `1px solid ${C.border}`, aspectRatio: "4/3", maxWidth: 400, background: `linear-gradient(150deg, ${C.accentLight} 0%, ${C.bgAlt} 58%), repeating-linear-gradient(90deg, rgba(51,81,143,0.07) 0 1px, transparent 1px 34px)`, position: "relative" }}>
                {photo(1, "") ? (
                  <img src={photo(1, "")} alt="Chauffeur en tournée" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                  <span aria-hidden style={{ position: "absolute", left: "10%", right: "10%", top: "50%", height: 2, background: `repeating-linear-gradient(90deg, ${C.accent} 0 14px, transparent 14px 30px)`, opacity: 0.45 }} />
                )}
              </div>
            </Reveal>
          </div>
          <div style={{ position: "relative", paddingLeft: "clamp(30px,3.4vw,48px)" }}>
            {/* L'axe pointillé de la feuille de route. */}
            <span aria-hidden style={{ position: "absolute", left: 9, top: 12, bottom: 12, width: 2, background: `repeating-linear-gradient(180deg, ${C.border} 0 12px, transparent 12px 24px)` }} />
            {METHODE.map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.08}>
                <div style={{ position: "relative", padding: "clamp(18px,2.4vw,28px) 0", borderBottom: idx < METHODE.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <span aria-hidden style={{ position: "absolute", left: "calc(clamp(30px,3.4vw,48px) * -1 + 4px)", top: "clamp(24px,3vw,34px)", width: 12, height: 12, borderRadius: 999, border: `2.5px solid ${C.accent}`, background: C.bg }} />
                  <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                    <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(1.5rem,2.2vw,2rem)", color: C.accent, lineHeight: 1, flexShrink: 0 }}>{m.n}</span>
                    <div>
                      <h3 style={{ fontFamily: SANS, fontWeight: 800, fontSize: "clamp(1.05rem,1.5vw,1.25rem)", color: C.ink, margin: "0 0 8px", letterSpacing: "-0.01em" }}>{m.t}</h3>
                      <p style={{ fontFamily: SANS, fontSize: 14.5, color: C.textMuted, lineHeight: 1.72, margin: 0, maxWidth: 480 }}>{m.d}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TARIFS — la grille horaire : lignes à points de conduite ───────── */}
      <section id="tarifs" style={{ background: C.bgAlt, padding: "clamp(80px,11vw,150px) clamp(24px,6vw,96px)" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <Eyebrow align="center">Tarifs</Eyebrow>
              <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(2rem,4vw,3.4rem)", lineHeight: 1.05, color: C.ink, margin: "clamp(16px,2vw,24px) 0 14px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>
                  Prévus, <em style={{ fontStyle: "italic", color: C.accent }}>pas subis.</em>
                </>)}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: "clamp(0.95rem,1.35vw,1.05rem)", color: C.textMuted, maxWidth: 560, margin: "0 auto", lineHeight: 1.72 }}>
                Transport médical conventionné : pris en charge sur prescription (bon de transport). Le reste : prix ferme annoncé à la réservation.
              </p>
            </div>
          </Reveal>
          <div style={{ marginTop: "clamp(36px,4.5vw,56px)", borderTop: `1px solid ${C.border}` }}>
            {TARIFS.map((tt, idx) => (
              <Reveal key={tt.a + idx} delay={idx * 0.06}>
                <div style={{ padding: "clamp(18px,2.4vw,26px) 4px", borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                    <span style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(1.05rem,1.6vw,1.3rem)", color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tt.a}</span>
                    {/* La ligne de conduite : les points de la grille horaire. */}
                    <span aria-hidden style={{ flex: 1, borderBottom: `2px dotted ${C.border}`, transform: "translateY(-4px)" }} />
                    <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(1.1rem,1.7vw,1.4rem)", color: C.accent, whiteSpace: "nowrap" }}>{tt.p}</span>
                  </div>
                  <p style={{ fontFamily: SANS, fontSize: 13.5, color: C.textFaint, margin: "8px 0 0", lineHeight: 1.6, maxWidth: 560 }}>{tt.n}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVIS — colonnes décalées, sur fond nuit ────────────────────────── */}
      <section style={{ background: C.bgDarkAlt, padding: "clamp(84px,11vw,150px) clamp(24px,6vw,96px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: "-24%", left: "50%", transform: "translateX(-50%)", width: "70%", height: "56%", background: "radial-gradient(ellipse, rgba(51,81,143,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "clamp(38px,5vw,64px)" }}>
              <Eyebrow color={C.jalon} align="center">Ils montent chaque semaine</Eyebrow>
              <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(1.9rem,3.8vw,3.2rem)", lineHeight: 1.06, color: C.white, margin: "clamp(16px,2vw,24px) 0 0" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "section-7.titre") ?? (<>
                  Des habitudes <em style={{ fontStyle: "italic", color: C.jalon }}>bien accompagnées.</em>
                </>)}
              </h2>
            </div>
          </Reveal>
          <div className="i374-avis" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: "clamp(18px,2.4vw,30px)", alignItems: "start" }}>
            {AVIS.map((a, idx) => (
              <Reveal key={a.auteur + idx} delay={idx * 0.1} style={{ marginTop: idx % 3 === 1 ? "clamp(0px,3vw,44px)" : 0 }}>
                <figure style={{ background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "clamp(24px,3vw,36px)", margin: 0, height: "100%", boxSizing: "border-box" }}>
                  <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={13} fill={C.jalon} color={C.jalon} />
                    ))}
                  </div>
                  <blockquote style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(1rem,1.4vw,1.15rem)", color: "rgba(255,255,255,0.86)", lineHeight: 1.68, margin: "0 0 20px" }}>
                    &ldquo;{a.texte}&rdquo;
                  </blockquote>
                  <figcaption style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 14 }}>
                    <div style={{ fontFamily: SANS, fontWeight: 800, color: C.white, fontSize: 14 }}>{a.auteur}</div>
                    <div style={{ fontFamily: SANS, color: C.jalon, fontSize: 11.5, marginTop: 4, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>{a.detail}</div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ────────────────────────────────────────────────────────── */}
      <section id="contact" style={{ background: C.bg, padding: "clamp(84px,11vw,150px) clamp(24px,6vw,96px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(51,81,143,0.045) 0 1px, transparent 1px 128px)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}>
          <Reveal>
            <Eyebrow align="center">On s&apos;organise</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(2rem,4.4vw,3.8rem)", lineHeight: 1.04, color: C.ink, margin: "clamp(16px,2vw,26px) 0 16px" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
                Vos trajets réguliers <em style={{ fontStyle: "italic", color: C.accent }}>méritent un vrai service.</em>
              </>)}
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p style={{ fontFamily: SANS, fontSize: "clamp(0.98rem,1.4vw,1.1rem)", color: C.textMuted, maxWidth: 470, margin: "0 auto clamp(30px,4vw,44px)", lineHeight: 1.72 }}>
              Appelez pour poser vos habitudes : devis d&apos;abonnement immédiat, premier trajet d&apos;essai sans engagement.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <CtaButton href={telHref}>
                <Phone size={16} /> {phone}
              </CtaButton>
              <CtaButton href={`mailto:${mail}`} filled={false}>
                <Mail size={16} /> Nous écrire
              </CtaButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer style={{ background: C.bgDarkAlt, padding: "clamp(48px,6vw,80px) clamp(24px,6vw,96px) 24px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 36 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
                <Car size={16} color={C.jalon} />
                <span style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 19, color: C.white }}>{fd?.businessName ?? (clientName(sessionData) ?? "Cap Chauffeur")}</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 13, lineHeight: 1.75, maxWidth: 320, margin: 0 }}>
                {clientTrade(sessionData) ?? "VTC & transport assis"} · {clientCity(sessionData) ?? "Rennes"}
                <br />
                REVTC — conventionné transport assis professionnalisé (TAP)
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {[
                { icon: <MapPin size={13} />, t: clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "35000", "Rennes, Ille-et-Vilaine") },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Mail size={13} />, t: mail },
                { icon: <Clock size={13} />, t: "Lun–Sam 6h–22h · abonnés 7j/7" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.48)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.jalon }}>{item.icon}</span>
                  {item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.28)", fontSize: 12 }}>
              © 2026 {fd?.businessName ?? (clientName(sessionData) ?? "Cap Chauffeur")} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
              {/* VILLE_PIED */}
              {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ color: "rgba(255,255,255,0.28)", fontSize: 12 }}>Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
