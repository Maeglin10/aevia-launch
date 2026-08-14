"use client";
// @ts-nocheck

/* ════════════════════════════════════════════════════════════════════════════
   PHARMACIE DE L'HORLOGE — Officine de centre-ville · Besançon
   ─────────────────────────────────────────────────────────────────────────────
   Pharmacie, 2e variante (la 1re est impact-330, MosaicPush).

   Geste signature : StickyProgress — le parcours de l'ordonnance, épinglé.
   Application propre à ce thème, et volontairement éloignée de celle
   d'impact-378 (gestion de patrimoine) qui pose le même composant : ici le
   bloc collé porte un CADRAN d'horloge en conic-gradient qui avance d'un
   quart à chaque étape, et la colonne mobile reçoit un `renderMedia` — une
   ordonnance dessinée en CSS qui se remplit, se vérifie, se tamponne puis se
   range. 378 n'a ni cadran, ni média, ni fond alterné à cet endroit.

   Archétype héros : H9 — double colonne de texte + rail de chiffres VERTICAL.
   Aucune photographie au-dessus de la ligne de flottaison : la seule image du
   thème est celle du comptoir, plus bas.

   Fontes : P10 — Spectral (titres) × IBM Plex Sans (texte, chiffres tabulaires).
   ════════════════════════════════════════════════════════════════════════════ */

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, Cross, Mail, MapPin, Phone } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { StickyProgress } from "@/lib/templates/hero-kit-3";
import {
  clientAddress,
  clientAreas,
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

/* ── Jetons ──────────────────────────────────────────────────────────────── */
let C: Record<string, string> = {
  bg: "#faf8fb",
  bgAlt: "#f1ecf5",
  bgDark: "#221a2a",
  bgDarkAlt: "#191320",
  bgCard: "#ffffff",
  accent: "var(--brand, #6d4a8a)",
  accentDark: "var(--brand-light, #54386b)",
  accentLight: "#e9def2",
  ink: "#201a27",
  textMuted: "#645c6c",
  textFaint: "#958ba1",
  border: "#e2d9ea",
  white: "#ffffff",
  /* clé métier : la croix verte de l'officine, seule couleur hors marque */
  croix: "#bda0d8",
};

const SERIF = "'Spectral', Georgia, serif";
const SANS = "'IBM Plex Sans', system-ui, -apple-system, sans-serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_CSS = "cubic-bezier(.16,1,.3,1)";

const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;1,300;1,400&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');`;

const NAV = [
  { l: "Le parcours", h: "#parcours" },
  { l: "Services", h: "#services" },
  { l: "Infos pratiques", h: "#infos" },
  { l: "Prise en charge", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* ── Données de démonstration ────────────────────────────────────────────── */

const PARCOURS_SOURCE = [
  { n: "01", title: "Photographiez", body: "L'ordonnance en entier, recto complet, depuis votre téléphone. Un mail suffit — pas d'application à installer." },
  { n: "02", title: "Nous préparons", body: "Vérification des interactions, substitutions expliquées si besoin, tout est prêt et mis de côté sous deux heures." },
  { n: "03", title: "Vous passez", body: "Moins de cinq minutes au comptoir dédié. Carte Vitale et mutuelle : tiers payant appliqué, aucune avance de frais." },
  { n: "04", title: "Nous suivons", body: "Renouvellements anticipés, rappels quand il est temps, et un pharmacien joignable pour toute question sur le traitement." },
];
let PARCOURS = PARCOURS_SOURCE;

const SERVICES_SOURCE = [
  { titre: "Ordonnances & renouvellements", desc: "Préparation anticipée par mail, renouvellement des traitements chroniques dans le cadre légal, livraison possible pour les patients isolés.", tag: "Comptoir" },
  { titre: "Vaccination", desc: "Grippe, COVID-19, rappels dTP : par nos pharmaciens formés, sans rendez-vous, tracé dans votre carnet de vaccination électronique.", tag: "Prévention" },
  { titre: "Tests rapides", desc: "Angine (TROD), glycémie, tension : résultat en quelques minutes et orientation médicale quand c'est nécessaire.", tag: "Dépistage" },
  { titre: "Entretiens pharmaceutiques", desc: "Asthme, anticoagulants, chimiothérapie orale : des entretiens de suivi pris en charge par l'Assurance Maladie.", tag: "Suivi" },
  { titre: "Matériel médical", desc: "Location et vente : cannes, fauteuils, lits médicalisés, tire-lait. Tarifs LPP, tiers payant sur ordonnance, livraison à domicile.", tag: "Matériel" },
  { titre: "Préparations magistrales", desc: "Préparatoire agréé sur place : dosages pédiatriques, gélules à façon, préparations dermatologiques sur prescription.", tag: "Préparatoire" },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const INFOS = [
  { n: "01", t: "Horaires étendus", d: "Lun–Sam 8h30–19h30 sans interruption, sous l'horloge de la Grande Rue." },
  { n: "02", t: "Comptoir ordonnances", d: "File dédiée aux ordonnances préparées : moins de cinq minutes, mesuré chaque mois." },
  { n: "03", t: "Accès et parking", d: "Arrêt de tram à 50 m, parking Saint-Pierre gratuit 30 minutes avec validation." },
  { n: "04", t: "Garde et urgences", d: "En dehors de nos horaires, composez le 3237 pour la pharmacie de garde, le 15 pour le SAMU." },
];

const URGENCES_SOURCE = [
  "Pharmacie de garde : 3237",
  "Urgence vitale : 15 (SAMU)",
];
let URGENCES = URGENCES_SOURCE;

const ENGAGEMENT_DEMO = [
  "Inscrite à l'Ordre national des pharmaciens — licence n° 25#002214",
  "Un pharmacien diplômé d'État présent à chaque heure d'ouverture",
  "Tiers payant carte Vitale + mutuelle : aucune avance de frais",
  "Secret professionnel au comptoir : un espace de confidentialité dédié",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

const TARIFS_DEMO = [
  { a: "Vaccination grippe", p: "prise en charge", n: "Sur bon de l'Assurance Maladie pour les publics éligibles ; sinon vaccin + injection au tarif affiché." },
  { a: "Entretien pharmaceutique", p: "remboursé", n: "Asthme, AVK, anticancéreux oraux : pris en charge à 100 % par l'Assurance Maladie." },
  { a: "Location lit médicalisé", p: "tarif LPP", n: "Tiers payant intégral sur ordonnance, livraison et installation comprises." },
  { a: "Test angine (TROD)", p: "pris en charge", n: "Sur orientation ou sans ordonnance selon votre situation — résultat en 10 minutes." },
];
let TARIFS = TARIFS_DEMO;

const AVIS_SOURCE = [
  { texte: "Le traitement de mon père fait onze lignes. Je l'envoie par mail, tout est prêt, vérifié, et la pharmacienne m'a signalé une interaction que l'hôpital avait ratée.", auteur: "Sylvie R.", detail: "Renouvellement chronique" },
  { texte: "Vaccinée un samedi matin en cinq minutes, rappel dTP vérifié au passage. C'est exactement ce qu'on attend d'une pharmacie de quartier.", auteur: "Inès K.", detail: "Vaccination" },
  { texte: "Lit médicalisé livré et installé en 24 h pour mon mari, tiers payant complet, explications posées. Merci pour l'humanité.", auteur: "Colette D.", detail: "Matériel médical" },
];
let AVIS_DEMO = AVIS_SOURCE;

const STATS_DEMO = [
  { value: "2 h", label: "Ordonnance préparée" },
  { value: "6 j/7", label: "Sans interruption" },
  { value: "0 €", label: "D'avance de frais" },
  { value: "5", label: "Pharmaciens diplômés" },
];
let STATS = STATS_DEMO;

function ZONES_SOURCE_LIVE() {
  return [(clientCity(sessionData) ?? "Besançon") + " centre", "Doubs"];
}
let ZONES_SOURCE = ZONES_SOURCE_LIVE();
let ZONES = ZONES_SOURCE;

/* ── Primitives ──────────────────────────────────────────────────────────── */

function Reveal({ children, delay = 0, y = 26, style }: { children: React.ReactNode; delay?: number; y?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  return (
    <motion.div ref={ref} style={style} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.9, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}

function Kicker({ children, color = C.accentDark, align = "left" }: { children: React.ReactNode; color?: string; align?: "left" | "center" }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 14, justifyContent: align === "center" ? "center" : "flex-start" }}>
      <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${color})`, flexShrink: 0 }} />
      <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.32em", textTransform: "uppercase", color }}>{children}</span>
      {align === "center" && <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${color}, transparent)`, flexShrink: 0 }} />}
    </span>
  );
}

/** L'horloge de la Grande Rue, en CSS. Le détail gratuit du thème. */
function Cadran({ progres, size = 132 }: { progres: number; size?: number }) {
  const angle = Math.max(0.001, progres) * 360;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }} aria-hidden>
      {/* la course parcourue */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `conic-gradient(${C.accent} 0deg ${angle}deg, ${C.accentLight} ${angle}deg 360deg)`,
          transition: `background .7s ${EASE_CSS}`,
        }}
      />
      {/* les douze traits d'heure */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `repeating-conic-gradient(from 0deg, rgba(32,26,39,0.28) 0deg 0.7deg, transparent 0.7deg 30deg)`,
        }}
      />
      <div style={{ position: "absolute", inset: 9, borderRadius: "50%", background: C.bgCard, border: `1px solid ${C.border}` }} />
      {/* les aiguilles */}
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 2, height: size * 0.26, background: C.ink, transformOrigin: "50% 100%", transform: `translate(-50%,-100%) rotate(${angle * 0.5}deg)`, borderRadius: 2, transition: `transform .7s ${EASE_CSS}` }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 1.5, height: size * 0.34, background: C.accent, transformOrigin: "50% 100%", transform: `translate(-50%,-100%) rotate(${angle}deg)`, borderRadius: 2, transition: `transform .7s ${EASE_CSS}` }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 7, height: 7, borderRadius: "50%", background: C.accent, transform: "translate(-50%,-50%)" }} />
    </div>
  );
}

/** L'ordonnance dessinée, jamais photographiée : elle se remplit d'une étape à l'autre. */
function Ordonnance({ etape }: { etape: number }) {
  const lignes = [92, 78, 86, 64, 71, 55];
  return (
    <div
      aria-hidden
      style={{
        position: "relative",
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: 3,
        padding: "clamp(20px,2.4vw,30px)",
        maxWidth: 420,
        boxShadow: "0 26px 54px -40px rgba(32,26,39,0.5)",
        overflow: "hidden",
      }}
    >
      {/* le coin corné : le détail qui coûte deux lignes */}
      <div style={{ position: "absolute", top: 0, right: 0, width: 26, height: 26, background: `linear-gradient(225deg, ${C.bgAlt} 50%, transparent 50%)`, borderLeft: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <Cross size={15} color={C.accent} />
        <span style={{ fontFamily: SANS, fontSize: 9.5, fontWeight: 600, letterSpacing: "0.26em", textTransform: "uppercase", color: C.textFaint }}>Ordonnance</span>
      </div>
      <div style={{ height: 1, background: C.border, marginBottom: 18 }} />
      {lignes.map((w, n) => (
        <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              flexShrink: 0,
              background: etape >= 1 && n < (etape + 1) * 2 ? C.accent : C.border,
              transition: `background .6s ${EASE_CSS}`,
            }}
          />
          <span
            style={{
              display: "block",
              height: 7,
              width: `${w}%`,
              borderRadius: 3,
              background: etape >= 1 && n < (etape + 1) * 2 ? C.accentLight : C.bgAlt,
              transition: `background .6s ${EASE_CSS}`,
            }}
          />
        </div>
      ))}
      {/* le tampon : il n'apparaît qu'au troisième temps */}
      <div
        style={{
          marginTop: 20,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "7px 14px",
          border: `1.5px solid ${etape >= 2 ? C.accent : "transparent"}`,
          borderRadius: 3,
          transform: etape >= 2 ? "rotate(-3deg)" : "rotate(-3deg) scale(0.94)",
          opacity: etape >= 2 ? 1 : 0,
          transition: `opacity .6s ${EASE_CSS}, transform .6s ${EASE_CSS}, border-color .6s ${EASE_CSS}`,
        }}
      >
        <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: C.accent }}>
          {etape >= 3 ? "Suivi ouvert" : "Vérifié"}
        </span>
      </div>
    </div>
  );
}

function NavLink({ label, href, onClick }: { label: string; href: string; onClick?: () => void }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        position: "relative",
        fontFamily: SANS,
        fontSize: 12.5,
        fontWeight: 500,
        letterSpacing: "0.09em",
        textTransform: "uppercase",
        color: h ? C.ink : C.textMuted,
        textDecoration: "none",
        padding: "12px 2px",
        transition: `color .5s ${EASE_CSS}`,
      }}
    >
      {label}
      <span style={{ position: "absolute", left: 0, bottom: 6, height: 1, width: h ? "100%" : "0%", background: C.accent, transition: `width .5s ${EASE_CSS}` }} />
    </a>
  );
}

function Btn({ children, href, filled = false }: { children: React.ReactNode; href: string; filled?: boolean }) {
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
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.13em",
        textTransform: "uppercase",
        borderRadius: 3,
        textDecoration: "none",
        border: `1px solid ${filled ? "transparent" : C.border}`,
        background: filled ? (h ? C.accentDark : C.accent) : h ? C.bgAlt : C.white,
        color: filled ? C.white : C.ink,
        boxShadow: h && filled ? "0 18px 36px -20px rgba(34,26,42,0.6), 0 4px 12px -8px rgba(34,26,42,0.4)" : "0 0 0 rgba(0,0,0,0)",
        transform: h ? "translateY(-2px)" : "none",
        transition: `background .5s ${EASE_CSS}, box-shadow .5s ${EASE_CSS}, transform .5s ${EASE_CSS}, border-color .5s ${EASE_CSS}`,
      }}
    >
      {children}
    </a>
  );
}

/** Une tuile du bento des services. */
function Tuile({ item, i, large }: { item: any; i: number; large: boolean }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        position: "relative",
        height: "100%",
        boxSizing: "border-box",
        background: h ? C.bgCard : "rgba(255,255,255,0.62)",
        border: `1px solid ${h ? C.accent : C.border}`,
        borderRadius: 4,
        padding: large ? "clamp(28px,3.4vw,44px)" : "clamp(24px,2.8vw,34px)",
        transform: h ? "translateY(-6px)" : "none",
        boxShadow: h ? "0 32px 62px -42px rgba(34,26,42,0.5), 0 6px 16px -12px rgba(34,26,42,0.26)" : "0 0 0 rgba(0,0,0,0)",
        transition: `background .5s ${EASE_CSS}, transform .5s ${EASE_CSS}, box-shadow .5s ${EASE_CSS}, border-color .5s ${EASE_CSS}`,
        overflow: "hidden",
      }}
    >
      <span aria-hidden style={{ position: "absolute", right: 12, bottom: -18, fontFamily: SERIF, fontStyle: "italic", fontSize: large ? 132 : 92, color: "rgba(109,74,138,0.055)", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>
        {String(i + 1).padStart(2, "0")}
      </span>
      <span style={{ display: "inline-block", fontFamily: SANS, fontSize: 9.5, fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: C.accentDark, borderBottom: `1px solid ${h ? C.accent : C.border}`, paddingBottom: 5, transition: `border-color .5s ${EASE_CSS}` }}>
        {item.tag}
      </span>
      <h3 style={{ position: "relative", fontFamily: SERIF, fontWeight: 400, fontSize: large ? "clamp(23px,2.6vw,33px)" : "clamp(19px,2vw,24px)", color: C.ink, margin: "16px 0 12px", lineHeight: 1.16, letterSpacing: "-0.008em" }}>{item.titre}</h3>
      <p style={{ position: "relative", fontFamily: SANS, fontSize: "clamp(14px,1.1vw,15.5px)", fontWeight: 300, color: C.textMuted, lineHeight: 1.78, margin: 0, maxWidth: 520 }}>{item.desc}</p>
    </div>
  );
}

function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════════════ */
export default function PharmacieHorlogePage() {
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

  ZONES_SOURCE = ZONES_SOURCE_LIVE();

  const CLIENT_SERVICES = clientServices(sessionData);

  PARCOURS = resolveList(
    CLIENT_SERVICES?.slice(0, 4).map((s: any, i: number) => ({
      ...PARCOURS_SOURCE[i % PARCOURS_SOURCE.length],
      title: s.title,
      body: s.description || s.desc || PARCOURS_SOURCE[i % PARCOURS_SOURCE.length].body,
    })),
    PARCOURS_SOURCE,
  );
  SERVICES_DEMO = resolveList(
    CLIENT_SERVICES?.map((s: any, i: number) => ({ ...SERVICES_SOURCE[i % SERVICES_SOURCE.length], titre: s.title })),
    SERVICES_SOURCE,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({ ...AVIS_SOURCE[i % AVIS_SOURCE.length], auteur: r.author, texte: r.text })),
    AVIS_SOURCE,
  );
  TARIFS = resolveList(
    CLIENT_SERVICES?.map((s: any, i: number) => ({
      ...TARIFS_DEMO[i % TARIFS_DEMO.length],
      a: s.title,
      p: s.price ?? TARIFS_DEMO[i % TARIFS_DEMO.length].p,
      n: s.description || s.desc || TARIFS_DEMO[i % TARIFS_DEMO.length].n,
    })),
    TARIFS_DEMO,
  );
  STATS = resolveList(clientStats(sessionData), STATS_DEMO);
  ENGAGEMENT = resolveList(clientCertifications(sessionData), ENGAGEMENT_DEMO);
  ZONES = resolveList(clientAreas(sessionData), ZONES_SOURCE);
  URGENCES = resolveList(clientList(sessionData, "urgences.liste"), URGENCES_SOURCE);

  brand = fd?.brandColor ?? null;
  if (brand) C = { ...C, accent: brand };

  const SERVICES = resolveList(
    CLIENT_SERVICES?.map((s: any, n: number) => ({
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
    const h = () => setScrolled(window.scrollY > 40);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const marque = fd?.businessName ?? clientName(sessionData) ?? "Pharmacie de l'Horloge";
  const ville = clientCity(sessionData) ?? "Besançon";
  const phone = clientPhone(sessionData) ?? fd?.phone ?? "03 81 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33381000000").replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "ordonnances@pharmacie-horloge.fr";
  const adresse = clientAddress(sessionData);
  const lieu = clientCodePostalVille(sessionData, "", ville).trim();

  /* Le marquee des avis répète la liste : deux copies, une seule source. */
  const AVIS_RUBAN = [...AVIS, ...AVIS];

  /* Deuxième emplacement photo, facultatif : rien n'est inventé en repli. */
  const officineImg = photo(1, "");

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip", WebkitFontSmoothing: "antialiased" }}>
      <style>{FONTS_CSS}</style>
      <style>{`
        @media (max-width: 980px) { #i336-nav { display: none !important; } .i336-burger { display: flex !important; } }
        @media (max-width: 900px) {
          .i336-hero { grid-template-columns: minmax(0,1fr) !important; padding: 116px 22px 56px !important; gap: 34px !important; }
          .i336-rail { border-left: none !important; padding-left: 0 !important; }
          .i336-parcours { grid-template-columns: minmax(0,1fr) !important; gap: 22px !important; }
          .i336-parcours > div:first-child { position: static !important; }
          .i336-bento { grid-template-columns: minmax(0,1fr) !important; }
          .i336-bento > * { grid-column: auto !important; }
          .i336-split { grid-template-columns: minmax(0,1fr) !important; gap: 32px !important; }
          .i336-split > * { order: initial !important; }
          .i336-infos { grid-template-columns: repeat(auto-fit, minmax(min(240px,100%),1fr)) !important; }
          .i336-pad { padding-left: 22px !important; padding-right: 22px !important; }
        }
        /* Le kit rend un h3 et un p nus : on les habille ici plutôt que de
           dupliquer sa mécanique. */
        .i336-parcours h3 {
          font-family: ${SERIF};
          font-weight: 400;
          font-size: clamp(22px, 2.6vw, 32px);
          color: ${C.ink};
          line-height: 1.14;
          letter-spacing: -0.01em;
        }
        .i336-parcours p {
          font-family: ${SANS};
          font-weight: 300;
          font-size: clamp(14.5px, 1.15vw, 16px);
          color: ${C.textMuted};
          line-height: 1.82;
        }
        .i336-parcours > div:last-child > div > div > div > span:first-child {
          font-family: ${SERIF};
          font-style: italic;
          font-size: clamp(26px, 3vw, 40px);
          color: ${C.accent};
          line-height: 1;
        }
        @keyframes i336-ruban { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .i336-ruban { animation: i336-ruban 46s linear infinite; }
        .i336-ruban:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .i336-ruban { animation: none !important; }
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
          padding: scrolled ? "10px clamp(20px,4vw,52px)" : "20px clamp(20px,4vw,52px)",
          background: scrolled ? "rgba(250,248,251,0.93)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          transition: `padding .55s ${EASE_CSS}, background .55s ${EASE_CSS}, backdrop-filter .55s ${EASE_CSS}, border-color .55s ${EASE_CSS}`,
        }}
      >
        <a href="#top" style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, textDecoration: "none" }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={marque} style={{ height: 30, maxWidth: 175, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Cross size={17} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: SERIF, fontSize: 19, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", letterSpacing: "-0.01em" }}>{marque}</span>
              <span style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.26em", textTransform: "uppercase", color: C.textFaint, marginLeft: 6 }}>{clientTrade(sessionData) ?? "Officine"}</span>
            </>
          )}
        </a>
        <div id="i336-nav" style={{ display: "flex", gap: "clamp(14px,1.7vw,26px)", alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <NavLink key={l} label={l} href={h} />
          ))}
          <Btn href={`mailto:${mail}`} filled>
            Envoyer mon ordonnance
          </Btn>
        </div>
        <button
          className="i336-burger"
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
            <NavLink key={l} label={l} href={h} onClick={() => setMobileOpen(false)} />
          ))}
          <a href={`mailto:${mail}`} style={{ background: C.accent, color: C.white, borderRadius: 3, padding: "14px 22px", fontFamily: SANS, fontSize: 12, fontWeight: 600, letterSpacing: "0.13em", textTransform: "uppercase", textDecoration: "none", textAlign: "center", marginTop: 12 }}>
            Envoyer mon ordonnance
          </a>
        </div>
      )}

      {/* ── HERO — H9 : double colonne + rail de chiffres VERTICAL ───────── */}
      <section
        id="top"
        className="i336-hero i336-pad"
        style={{
          minHeight: "100dvh",
          display: "grid",
          gridTemplateColumns: "minmax(0,1.5fr) minmax(0,1fr)",
          gap: "clamp(30px,5vw,76px)",
          alignItems: "center",
          padding: "clamp(130px,14vw,168px) clamp(22px,5vw,64px) clamp(60px,7vw,88px)",
          maxWidth: 1260,
          margin: "0 auto",
          position: "relative",
        }}
      >
        {/* Le cadran fantôme : la texture métier, sans une image */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: "-6vw",
            top: "12vh",
            width: "clamp(300px,42vw,620px)",
            height: "clamp(300px,42vw,620px)",
            borderRadius: "50%",
            background: `repeating-conic-gradient(from 0deg, rgba(109,74,138,0.075) 0deg 0.5deg, transparent 0.5deg 30deg)`,
            pointerEvents: "none",
          }}
        />
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(52% 44% at 14% 30%, rgba(109,74,138,0.10), transparent 70%)" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.15, ease: EASE }}>
            <Kicker>{clientEyebrow(sessionData) ?? <>Pharmacie · {ville} centre</>}</Kicker>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.28, ease: EASE }}
            style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(37px,5.2vw,66px)", color: C.ink, lineHeight: 0.99, letterSpacing: "-0.022em", margin: "clamp(18px,2vw,26px) 0 clamp(16px,1.8vw,24px)" }}
          >{/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ?? (<>
            {clientHeroLine(sessionData, 0, 2, 21) ?? "La santé de quartier,"}
            <br />
            <em style={{ fontStyle: "italic", color: C.accent }}>{clientHeroLine(sessionData, 1, 2, 21) ?? "au rythme de l'horloge."}</em>
          </>)}</motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.44, ease: EASE }}
            style={{ fontFamily: SANS, fontSize: "clamp(15.5px,1.25vw,17px)", fontWeight: 300, color: C.textMuted, lineHeight: 1.8, maxWidth: 500, marginBottom: "clamp(24px,3vw,34px)" }}
          >
            {clientHeroSubtitle(sessionData) ??
              clientTagline(sessionData) ??
              "Ordonnance envoyée le matin, prête à midi. Vaccination sans rendez-vous, tests rapides, matériel médical — et de vrais conseils au comptoir, pas une file d'attente."}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.58, ease: EASE }} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Btn href={`mailto:${mail}`} filled>
              Envoyer mon ordonnance
            </Btn>
            <Btn href="#parcours">Voir le parcours</Btn>
          </motion.div>

          {/* le rappel réglementaire, jamais enterré dans le pied de page */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 26px", marginTop: "clamp(28px,3.6vw,42px)", paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
            {URGENCES.map((u: string, idx: number) => (
              <span key={idx} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: SANS, fontSize: 12.5, color: C.textMuted, fontVariantNumeric: "tabular-nums" }}>
                <span aria-hidden style={{ width: 14, height: 1, background: C.accent }} />
                {u}
              </span>
            ))}
          </div>
        </div>

        {/* Le rail : les chiffres empilés, filet à gauche, pas une bande */}
        <motion.div
          className="i336-rail"
          initial={{ opacity: 0, x: 22 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: EASE }}
          style={{ position: "relative", zIndex: 1, borderLeft: `1px solid ${C.border}`, paddingLeft: "clamp(22px,3vw,44px)" }}
        >
          <div style={{ fontFamily: SANS, fontSize: 9.5, fontWeight: 600, letterSpacing: "0.30em", textTransform: "uppercase", color: C.textFaint, marginBottom: 22 }}>L'officine en chiffres</div>
          {STATS.map((s: any, idx: number) => (
            <div key={s.label} style={{ padding: "clamp(16px,1.8vw,22px) 0", borderTop: idx === 0 ? "none" : `1px solid ${C.border}` }}>
              <div style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(28px,3.2vw,42px)", color: C.accent, lineHeight: 1, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
              <div style={{ fontFamily: SANS, fontSize: 12, letterSpacing: "0.08em", color: C.textMuted, marginTop: 9, lineHeight: 1.55 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── RESPIRATION ─────────────────────────────────────────────────── */}
      <section className="i336-pad" style={{ background: C.bgAlt, padding: "clamp(70px,10vw,136px) clamp(22px,8vw,150px)", textAlign: "center" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <Kicker color={C.textMuted} align="center">L'officine</Kicker>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(23px,3.2vw,44px)", lineHeight: 1.38, color: C.ink, maxWidth: 920, margin: "0 auto", letterSpacing: "-0.006em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "respiration.texte") ?? (<>
            Une ordonnance n'est pas une commande : elle se lit, se vérifie, s'explique — et cela prend deux heures, pas une file d'attente.
          </>)}</p>
        </Reveal>
        <Reveal delay={0.2}>
          <div style={{ width: 1, height: 84, background: `linear-gradient(${C.accent}, transparent)`, margin: "clamp(34px,4vw,54px) auto 0" }} />
        </Reveal>
      </section>

      {/* ── PARCOURS — StickyProgress : cadran épinglé + ordonnance dessinée */}
      <section id="parcours" className="i336-pad" style={{ background: C.bg, padding: "clamp(70px,10vw,140px) clamp(22px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `repeating-linear-gradient(0deg, ${C.border} 0px, ${C.border} 1px, transparent 1px, transparent 96px)`, opacity: 0.4 }} />
        <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>
          <StickyProgress
            steps={PARCOURS}
            className="i336-parcours"
            style={{ display: "grid", gridTemplateColumns: "minmax(0,0.9fr) minmax(0,1.1fr)", gap: "clamp(24px,4vw,64px)" }}
            renderTitle={(active) => (
              <div>
                <Kicker>Le parcours</Kicker>
                <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(28px,3.6vw,48px)", color: C.ink, lineHeight: 1.06, letterSpacing: "-0.018em", margin: "18px 0 0" }}>{/* TEXTE_SECTION */ clientText(sessionData, "parcours.titre") ?? (<>
                  Votre ordonnance,<br /><em style={{ fontStyle: "italic", color: C.accent }}>quatre temps, zéro attente.</em>
                </>)}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "clamp(18px,2.6vw,32px)", marginTop: "clamp(26px,3.2vw,40px)", flexWrap: "wrap" }}>
                  <Cadran progres={(active + 1) / Math.max(1, PARCOURS.length)} />
                  <div>
                    <div style={{ fontFamily: SANS, fontSize: 9.5, fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: C.textFaint, marginBottom: 10 }}>
                      Temps {String(active + 1).padStart(2, "0")} / {String(PARCOURS.length).padStart(2, "0")}
                    </div>
                    <div style={{ fontFamily: SERIF, fontSize: "clamp(19px,2vw,25px)", color: C.ink, lineHeight: 1.25, maxWidth: 240 }}>
                      {PARCOURS[Math.min(active, PARCOURS.length - 1)]?.title}
                    </div>
                  </div>
                </div>
              </div>
            )}
            renderMedia={(n) => <Ordonnance etape={n} />}
          />
        </div>
      </section>

      {/* ── SERVICES — bento, tuiles inégales ────────────────────────────── */}
      <section id="services" className="i336-pad" style={{ background: C.bgAlt, padding: "clamp(76px,10vw,144px) clamp(22px,5vw,64px)" }}>
        <div style={{ maxWidth: 1220, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(30px,4vw,50px)", maxWidth: 760 }}>
              <Kicker>Nos services</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(30px,4.3vw,56px)", color: C.ink, margin: "18px 0 0", lineHeight: 1.06, letterSpacing: "-0.018em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>
                Une officine qui soigne,<br /><em style={{ fontStyle: "italic", color: C.accent }}>pas un libre-service.</em>
              </>)}</h2>
            </div>
          </Reveal>
          <div className="i336-bento" style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0,1fr))", gap: "clamp(14px,1.8vw,22px)" }}>
            {SERVICES.map((s: any, idx: number) => (
              <Reveal key={s.titre} delay={(idx % 3) * 0.06} style={{ gridColumn: idx % 5 === 0 ? "span 3" : "span 2", height: "100%" }}>
                <Tuile item={s} i={idx} large={idx % 5 === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── INFOS PRATIQUES ─────────────────────────────────────────────── */}
      <section id="infos" className="i336-pad" style={{ background: C.bg, padding: "clamp(76px,10vw,144px) clamp(22px,5vw,64px)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(28px,3.6vw,48px)", maxWidth: 720 }}>
              <Kicker>Infos pratiques</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(29px,4vw,52px)", color: C.ink, margin: "18px 0 0", lineHeight: 1.06, letterSpacing: "-0.018em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "infos.titre") ?? (<>
                Venir, se garer,<br /><em style={{ fontStyle: "italic", color: C.accent }}>être servi vite.</em>
              </>)}</h2>
            </div>
          </Reveal>
          <div className="i336-infos" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: "0 clamp(20px,3vw,44px)" }}>
            {INFOS.map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.07}>
                <div style={{ height: "100%", padding: "clamp(24px,2.8vw,34px) 0", borderTop: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <Clock size={14} color={C.accent} />
                    <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", color: C.textFaint, fontVariantNumeric: "tabular-nums" }}>{m.n}</span>
                  </div>
                  <h3 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(18px,1.9vw,23px)", color: C.ink, margin: "0 0 10px", lineHeight: 1.2 }}>{m.t}</h3>
                  <p style={{ fontFamily: SANS, fontSize: "clamp(13.5px,1.08vw,15px)", fontWeight: 300, color: C.textMuted, lineHeight: 1.8, margin: 0 }}>{m.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BANDEAU — la deuxième photo du client, si elle existe ────────
          Aucun repli inventé : sans photo, la bande n'existe pas et le
          rythme de la page ne s'en trouve pas troué. */}
      {officineImg ? (
        <section style={{ background: C.bgDark, position: "relative", overflow: "hidden" }}>
          <img src={officineImg} alt={`${marque} — l'officine`} loading="lazy" style={{ width: "100%", aspectRatio: "21/8", objectFit: "cover", display: "block" }} />
          <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(25,19,32,0.34) 0%, rgba(25,19,32,0.02) 46%, rgba(25,19,32,0.46) 100%)" }} />
        </section>
      ) : null}

      {/* ── ENGAGEMENTS — la croix de l'officine sur la photo du comptoir ── */}
      <section id="engagements" className="i336-pad" style={{ background: C.bgDark, padding: "clamp(76px,10vw,144px) clamp(22px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(58% 62% at 78% 20%, rgba(189,160,216,0.11), transparent 72%)" }} />
        <div className="i336-split" style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(32px,5vw,76px)", alignItems: "center", position: "relative" }}>
          <Reveal style={{ order: 2 }}>
            <div style={{ position: "relative", borderRadius: 4, overflow: "hidden", background: C.bgDarkAlt, border: "1px solid rgba(255,255,255,0.09)" }}>
              <img
                src={photo(0, "https://images.pexels.com/photos/8657373/pexels-photo-8657373.jpeg?auto=compress&cs=tinysrgb&w=1400")}
                alt="Comptoir de la pharmacie"
                loading="lazy"
                style={{ width: "100%", aspectRatio: "4/3.2", objectFit: "cover", display: "block" }}
              />
              <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(25,19,32,0.62) 0%, rgba(25,19,32,0.08) 44%, transparent 100%)" }} />
              {/* la croix, dessinée : elle tient même image bloquée */}
              <div aria-hidden style={{ position: "absolute", right: 18, top: 18, width: 44, height: 44 }}>
                <span style={{ position: "absolute", left: 17, top: 0, width: 10, height: 44, background: C.croix, opacity: 0.9, borderRadius: 2 }} />
                <span style={{ position: "absolute", top: 17, left: 0, height: 10, width: 44, background: C.croix, opacity: 0.9, borderRadius: 2 }} />
              </div>
              <div style={{ position: "absolute", left: 20, bottom: 18, fontFamily: SANS, fontSize: 10, fontWeight: 600, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(255,255,255,0.86)" }}>
                Le comptoir
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12} style={{ order: 1 }}>
            <div>
              <Kicker color={C.croix}>Une officine de l'Ordre</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(28px,3.8vw,48px)", color: C.white, margin: "18px 0 26px", lineHeight: 1.07, letterSpacing: "-0.018em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (<>
                Ce que garantit<br /><em style={{ fontStyle: "italic", color: C.croix }}>une vraie pharmacie.</em>
              </>)}</h2>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {ENGAGEMENT.map((e: string, idx: number) => (
                  <li key={idx} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "15px 0", borderTop: idx === 0 ? "none" : "1px solid rgba(255,255,255,0.10)" }}>
                    <span aria-hidden style={{ marginTop: 10, width: 18, height: 1, background: C.croix, flexShrink: 0 }} />
                    <span style={{ fontFamily: SANS, fontSize: "clamp(14px,1.12vw,15.5px)", fontWeight: 300, color: "rgba(255,255,255,0.74)", lineHeight: 1.78 }}>{e}</span>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 30 }}>
                <a href={telHref} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.accent, color: C.white, borderRadius: 3, padding: "15px 30px", fontFamily: SANS, fontSize: 12, fontWeight: 600, letterSpacing: "0.13em", textTransform: "uppercase", textDecoration: "none" }}>
                  <Phone size={15} /> Nous appeler
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PRISE EN CHARGE — bandes, pas de cartes ──────────────────────── */}
      <section id="tarifs" className="i336-pad" style={{ background: C.bg, padding: "clamp(76px,10vw,144px) clamp(22px,5vw,64px)" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Kicker align="center">Prise en charge</Kicker>
              </div>
              <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(30px,4.1vw,54px)", color: C.ink, margin: "18px 0 0", lineHeight: 1.06, letterSpacing: "-0.018em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Remboursé, <em style={{ fontStyle: "italic", color: C.accent }}>expliqué.</em></>)}</h2>
              <p style={{ fontFamily: SANS, fontSize: "clamp(14.5px,1.15vw,16px)", fontWeight: 300, color: C.textMuted, maxWidth: 560, margin: "18px auto 0", lineHeight: 1.8 }}>
                La plupart de nos actes sont pris en charge par l'Assurance Maladie. Ce qui reste à votre charge est annoncé avant, jamais découvert en caisse.
              </p>
            </div>
          </Reveal>
          <div style={{ marginTop: "clamp(34px,4.4vw,54px)", display: "flex", flexDirection: "column", gap: 10 }}>
            {TARIFS.map((t: any, idx: number) => (
              <Reveal key={t.a} delay={idx * 0.05}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px clamp(16px,2.4vw,34px)",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "clamp(20px,2.4vw,28px) clamp(20px,2.6vw,32px)",
                    background: idx % 2 === 0 ? C.bgAlt : C.bgCard,
                    borderLeft: `3px solid ${C.accent}`,
                    borderTop: `1px solid ${C.border}`,
                    borderRight: `1px solid ${C.border}`,
                    borderBottom: `1px solid ${C.border}`,
                    borderRadius: "0 3px 3px 0",
                  }}
                >
                  <div style={{ minWidth: 0, flex: "1 1 280px" }}>
                    <div style={{ fontFamily: SERIF, fontSize: "clamp(18px,1.85vw,24px)", color: C.ink, lineHeight: 1.22 }}>{t.a}</div>
                    <div style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 300, color: C.textFaint, marginTop: 7, lineHeight: 1.72, maxWidth: 560 }}>{t.n}</div>
                  </div>
                  <div
                    style={{
                      fontFamily: SANS,
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: C.accentDark,
                      background: C.accentLight,
                      borderRadius: 99,
                      padding: "8px 16px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.p}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVIS — ruban continu, le quartier qui défile ─────────────────── */}
      <section className="i336-pad" style={{ background: C.bgAlt, padding: "clamp(76px,10vw,140px) 0", overflow: "hidden" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "clamp(34px,4.4vw,54px)", padding: "0 22px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Kicker align="center">Le quartier en parle</Kicker>
            </div>
            <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(28px,3.8vw,48px)", color: C.ink, margin: "18px 0 0", lineHeight: 1.06, letterSpacing: "-0.018em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>Ce qu'on nous dit <em style={{ fontStyle: "italic", color: C.accent }}>au comptoir</em>.</>)}</h2>
          </div>
        </Reveal>
        <div style={{ position: "relative", overflow: "hidden" }}>
          <div className="i336-ruban" style={{ display: "flex", gap: "clamp(16px,2vw,26px)", width: "max-content" }}>
            {AVIS_RUBAN.map((a: any, idx: number) => (
              <figure
                key={a.auteur + String(idx)}
                style={{
                  margin: 0,
                  width: "clamp(280px,32vw,420px)",
                  flexShrink: 0,
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  borderRadius: 4,
                  padding: "clamp(24px,2.8vw,34px)",
                  boxSizing: "border-box",
                }}
              >
                <span aria-hidden style={{ display: "block", fontFamily: SERIF, fontStyle: "italic", fontSize: 44, color: C.accentLight, lineHeight: 0.6, marginBottom: 14 }}>
                  &laquo;
                </span>
                <blockquote style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(15.5px,1.4vw,18px)", color: C.ink, lineHeight: 1.66, margin: "0 0 20px" }}>{a.texte}</blockquote>
                <figcaption style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                  <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.ink }}>{a.auteur}</div>
                  <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent, marginTop: 7 }}>{a.detail}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section id="contact" className="i336-pad" style={{ background: C.accentLight, padding: "clamp(78px,10vw,146px) clamp(22px,5vw,64px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "clamp(320px,44vw,660px)",
            height: "clamp(320px,44vw,660px)",
            transform: "translate(-50%,-50%)",
            borderRadius: "50%",
            background: `repeating-conic-gradient(from 0deg, rgba(84,56,107,0.07) 0deg 0.5deg, transparent 0.5deg 30deg)`,
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Kicker align="center">À votre service</Kicker>
            </div>
            <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(30px,4.3vw,56px)", color: C.ink, margin: "18px 0 18px", lineHeight: 1.06, letterSpacing: "-0.018em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
              Une question santé ?<br /><em style={{ fontStyle: "italic", color: C.accent }}>Un pharmacien répond.</em>
            </>)}</h2>
            <p style={{ fontFamily: SANS, fontSize: "clamp(15px,1.2vw,16.5px)", fontWeight: 300, color: C.textMuted, maxWidth: 470, margin: "0 auto clamp(28px,3.6vw,40px)", lineHeight: 1.8 }}>
              Par téléphone aux horaires d'ouverture, ou passez : le conseil ne prend pas de ticket.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href={telHref} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.accent, color: C.white, borderRadius: 3, padding: "16px 32px", fontFamily: SANS, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
                <Phone size={17} /> {phone}
              </a>
              <a href={`mailto:${mail}`} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "transparent", color: C.ink, border: `1px solid ${C.accent}`, borderRadius: 3, padding: "16px 30px", fontFamily: SANS, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
                <Mail size={17} /> Nous écrire
              </a>
            </div>
            <div style={{ marginTop: 30, fontFamily: SANS, fontSize: 12.5, color: C.textMuted, lineHeight: 1.9 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                <MapPin size={13} color={C.accentDark} />
                {adresse ?? lieu} · Nous servons {ZONES.join(", ")}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="i336-pad" style={{ background: C.bgDarkAlt, padding: "clamp(52px,7vw,84px) clamp(22px,5vw,64px) 26px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 38 }}>
            <div style={{ maxWidth: 360 }}>
              <div style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(20px,2vw,27px)", color: C.croix, marginBottom: 12, letterSpacing: "-0.01em" }}>{marque}</div>
              <p style={{ fontFamily: SANS, fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.4)", lineHeight: 1.85, margin: 0 }}>
                Pharmacie d'officine · {ville}
                <br />
                Ordre national des pharmaciens — licence n° 25#002214
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <MapPin size={13} />, t: adresse ?? `${lieu}, Doubs` },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Mail size={13} />, t: mail },
                { icon: <Clock size={13} />, t: "Lun–Sam 8h30–19h30 · Garde : 3237" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.44)", fontFamily: SANS, fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.croix, display: "flex" }}>{item.icon}</span>
                  {item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 18, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ color: "rgba(255,255,255,0.26)", fontFamily: SANS, fontSize: 11.5 }}>
              © 2026 {marque} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
              {/* VILLE_PIED */}
              {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ color: "rgba(255,255,255,0.26)", fontFamily: SANS, fontSize: 11.5 }}>
              Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
