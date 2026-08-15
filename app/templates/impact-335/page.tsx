"use client";
// @ts-nocheck

/* ════════════════════════════════════════════════════════════════════════════
   {clientName(sessionData) ?? "Rives Blanches"} — Pompes funèbres · Nice
   ─────────────────────────────────────────────────────────────────────────────
   Pompes funèbres, 2e variante (la 1re est impact-328, HeldSwap lent).
   Celle-ci est côtière et lumineuse.

   Geste signature : PanelRise — le titre du héros ne bouge pas ; c'est la page
   qui monte par-dessus, comme un volet qu'on relève. Piloté par le défilement,
   jamais par une horloge : rien ne presse ici.

   Archétype héros : H3 — plein cadre, titre en bas. Fond de repli C.bgDark
   obligatoire : la section reste belle quand l'image ne charge pas.

   Fontes : P3 — Cormorant Garamond (titres) × system-ui (texte).

   Rythme : lent. Paddings doublés par rapport au reste du catalogue,
   entrées à 1,0–1,2 s, aucune rotation automatique, aucun compteur.
   ════════════════════════════════════════════════════════════════════════════ */

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Anchor, Mail, MapPin, Phone } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { PanelRise } from "@/lib/templates/hero-kit-3";
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
  bg: "#f5f8fa",
  bgAlt: "#e7eff4",
  bgDark: "#102431",
  bgDarkAlt: "#0a1922",
  bgCard: "#ffffff",
  accent: "var(--brand, #2a6f97)",
  accentDark: "var(--brand-light, #1d5273)",
  accentLight: "#dcebf3",
  ink: "#14222c",
  textMuted: "#54666f",
  textFaint: "#8a9aa3",
  border: "#d7e3ea",
  white: "#ffffff",
  /* clé métier : l'écume, le seul ton clair qui tient sur le fond sombre */
  ecume: "#9ec9de",
};

const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_CSS = "cubic-bezier(.16,1,.3,1)";

const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');`;

const NAV = [
  { l: "Accompagnement", h: "#services" },
  { l: "Notre approche", h: "#methode" },
  { l: "Les salons", h: "#salons" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* ── Données de démonstration ────────────────────────────────────────────── */

function SERVICES_SOURCE_LIVE() {
  return [
    { titre: "Organisation d'obsèques", desc: "Inhumation ou crémation, à " + (clientCity(sessionData) ?? "Nice") + " et dans toutes les Alpes-Maritimes. Un interlocuteur unique du premier appel à l'après.", tag: "24h/24" },
    { titre: "Chambre funéraire", desc: "Trois salons privés en étage clair, accessibles à la famille 7j/7 de 8h à 20h, hors de toute contrainte hospitalière.", tag: "Recueillement" },
    { titre: "Cérémonies", desc: "Religieuses, laïques ou mixtes ; en chapelle, au crématorium ou en plein air. Maître de cérémonie, textes et musiques préparés avec vous.", tag: "Cérémonie" },
    { titre: "Démarches", desc: "État civil, caisses, banques, notaire : jusqu'à vingt courriers préparés et suivis par nos soins, pour vous en libérer.", tag: "Inclus" },
    { titre: "Marbrerie", desc: "Monuments, gravures, restauration et entretien de sépultures dans les cimetières de la ville et des communes voisines.", tag: "Marbrerie" },
    { titre: "Prévoyance obsèques", desc: "Vos volontés écrites et financées à l'avance, capital garanti, contrat conforme à la loi Sueur — modifiable à tout moment.", tag: "Prévoyance" },
  ];
}
let SERVICES_SOURCE = SERVICES_SOURCE_LIVE();
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE = [
  { n: "I", t: "Une voix, pas un standard", d: "À toute heure, quelqu'un de la maison répond, se déplace et prend le relais immédiatement." },
  { n: "II", t: "Le devis avant tout", d: "Devis-type réglementé, gratuit, distinguant l'obligatoire de l'optionnel. Vous décidez à tête reposée." },
  { n: "III", t: "Une cérémonie fidèle", d: "Textes, musiques, gestes : préparés avec la famille, à son rythme, jamais standardisés." },
  { n: "IV", t: "L'après, aussi", d: "Remise du dossier complet, aide aux démarches restantes, et une présence si vous en avez besoin." },
];

const ENGAGEMENT_DEMO = [
  "Habilitation préfectorale n° 26-06-0287 — Préfecture des Alpes-Maritimes",
  "Devis-type conforme à l'arrêté du 23 août 2010, remis avant tout engagement",
  "Prix affichés en agence et consultables — aucune prestation imposée",
  "Toutes confessions et convictions respectées, cérémonies civiles incluses",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

const TARIFS_DEMO = [
  { a: "Obsèques avec crémation", p: "dès 2 990 €", n: "Cercueil, transport, démarches et redevance de crémation inclus." },
  { a: "Obsèques avec inhumation", p: "dès 3 400 €", n: "Hors concession, dont le tarif dépend de la commune. Détail poste par poste." },
  { a: "Contrat de prévoyance", p: "dès 35 €/mois", n: "Capital garanti, volontés consignées, souscription en agence ou à domicile." },
  { a: "Entretien de sépulture", p: "dès 95 €/an", n: "Nettoyage et fleurissement à la Toussaint, photo transmise après chaque passage." },
];
let TARIFS = TARIFS_DEMO;

const AVIS_SOURCE = [
  { texte: "Reçus un dimanche soir, sans aucune précipitation. Chaque choix avait son prix en face, personne n'a poussé vers le haut. La cérémonie ressemblait à notre mère.", auteur: "Famille S.", detail: "Obsèques et cérémonie" },
  { texte: "Les salons de recueillement clairs, face au jardin, ont changé ces trois jours. On pouvait venir à toute heure, rester longtemps, être tranquilles.", auteur: "Paul et Anne G.", detail: "Chambre funéraire" },
  { texte: "J'ai signé ma prévoyance ici après avoir comparé trois maisons : la seule qui m'a remis le devis-type complet sans que je le demande.", auteur: "Josette M.", detail: "Contrat de prévoyance" },
];
let AVIS_DEMO = AVIS_SOURCE;

function STATS_SOURCE_LIVE() {
  return [
    { value: "24h/24", label: "Une voix qui répond" },
    { value: "3", label: "Salons de recueillement" },
    { value: "1892", label: "Maison fondée à " + (clientCity(sessionData) ?? "Nice") },
    { value: "0 €", label: "Le devis, toujours" },
  ];
}
let STATS_SOURCE = STATS_SOURCE_LIVE();
let STATS = STATS_SOURCE;

/* Les repères des salons : trois lignes tirées de la description existante,
   rien de plus. */
const SALONS_SOURCE = [
  "Trois salons privés en étage clair",
  "Ouverts à la famille 7j/7, de 8h à 20h",
  "Hors de toute contrainte hospitalière",
];
let SALONS = SALONS_SOURCE;

function ZONES_SOURCE_LIVE() {
  return [clientCity(sessionData) ?? "Nice", "Alpes-Maritimes", "communes voisines"];
}
let ZONES_SOURCE = ZONES_SOURCE_LIVE();
let ZONES = ZONES_SOURCE;

/* ── Primitives ──────────────────────────────────────────────────────────── */

/** Révélation lente : c'est le rythme du thème, pas un défaut de réglage. */
function Reveal({ children, delay = 0, y = 26, style }: { children: React.ReactNode; delay?: number; y?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  return (
    <motion.div
      ref={ref}
      style={style}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function Kicker({ children, color = C.accentDark, align = "left" }: { children: React.ReactNode; color?: string; align?: "left" | "center" }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 14, justifyContent: align === "center" ? "center" : "flex-start" }}>
      <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${color})`, flexShrink: 0 }} />
      <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.34em", textTransform: "uppercase", color }}>{children}</span>
      {align === "center" && <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${color}, transparent)`, flexShrink: 0 }} />}
    </span>
  );
}

function NavLink({ label, href, light, onClick }: { label: string; href: string; light?: boolean; onClick?: () => void }) {
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
        letterSpacing: "0.10em",
        textTransform: "uppercase",
        color: light ? (h ? C.white : "rgba(255,255,255,0.78)") : h ? C.ink : C.textMuted,
        textDecoration: "none",
        padding: "12px 2px",
        transition: `color .5s ${EASE_CSS}`,
      }}
    >
      {label}
      <span style={{ position: "absolute", left: 0, bottom: 6, height: 1, width: h ? "100%" : "0%", background: light ? C.ecume : C.accent, transition: `width .55s ${EASE_CSS}` }} />
    </a>
  );
}

function Btn({ children, href, filled = false, light = false }: { children: React.ReactNode; href: string; filled?: boolean; light?: boolean }) {
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
        padding: filled ? "16px 32px" : "15px 28px",
        fontFamily: SANS,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        borderRadius: 2,
        textDecoration: "none",
        border: `1px solid ${filled ? "transparent" : light ? "rgba(255,255,255,0.42)" : C.border}`,
        background: filled ? (h ? C.accentDark : C.accent) : h ? (light ? "rgba(255,255,255,0.12)" : C.bgAlt) : light ? "transparent" : C.white,
        color: filled ? C.white : light ? "rgba(255,255,255,0.94)" : C.ink,
        boxShadow: h && filled ? "0 18px 38px -20px rgba(16,36,49,0.62), 0 4px 12px -8px rgba(16,36,49,0.4)" : "0 0 0 rgba(0,0,0,0)",
        transform: h ? "translateY(-2px)" : "none",
        transition: `background .55s ${EASE_CSS}, box-shadow .55s ${EASE_CSS}, transform .55s ${EASE_CSS}, border-color .55s ${EASE_CSS}`,
      }}
    >
      {children}
    </a>
  );
}

/** Une prestation : colonne filetée, numérotée, sans carte ni ombre. */
function ServiceColumn({ item, i }: { item: any; i: number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={(i % 3) * 0.08}>
      <div
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          position: "relative",
          height: "100%",
          padding: "clamp(26px,3vw,38px) clamp(16px,1.8vw,26px) clamp(30px,3.4vw,44px)",
          borderTop: `1px solid ${h ? C.accent : C.border}`,
          background: h ? C.bgCard : "transparent",
          transform: h ? "translateY(-5px)" : "none",
          boxShadow: h ? "0 30px 58px -40px rgba(16,36,49,0.5), 0 5px 14px -10px rgba(16,36,49,0.22)" : "0 0 0 rgba(0,0,0,0)",
          transition: `background .55s ${EASE_CSS}, transform .55s ${EASE_CSS}, box-shadow .55s ${EASE_CSS}, border-color .55s ${EASE_CSS}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
          <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(22px,2.4vw,30px)", color: h ? C.accent : C.textFaint, lineHeight: 1, transition: `color .55s ${EASE_CSS}` }}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span style={{ fontFamily: SANS, fontSize: 9.5, fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: C.accentDark }}>{item.tag}</span>
        </div>
        <h3 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(22px,2.4vw,31px)", color: C.ink, margin: "0 0 14px", lineHeight: 1.14, letterSpacing: "-0.008em" }}>{item.titre}</h3>
        <p style={{ fontFamily: SANS, fontSize: "clamp(14px,1.1vw,15.5px)", fontWeight: 300, color: C.textMuted, lineHeight: 1.82, margin: 0, maxWidth: 480 }}>{item.desc}</p>
      </div>
    </Reveal>
  );
}

function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════════════ */
export default function RivesBlanchesPage() {
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
  STATS_SOURCE = STATS_SOURCE_LIVE();
  ZONES_SOURCE = ZONES_SOURCE_LIVE();


  const CLIENT_SERVICES = clientServices(sessionData);

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
  STATS = resolveList(clientStats(sessionData), STATS_SOURCE);
  ENGAGEMENT = resolveList(clientCertifications(sessionData), ENGAGEMENT_DEMO);
  ZONES = resolveList(clientAreas(sessionData), ZONES_SOURCE);
  SALONS = resolveList(clientList(sessionData, "salons.reperes"), SALONS_SOURCE);

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
    const h = () => setScrolled(window.scrollY > 60);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const marque = fd?.businessName ?? clientName(sessionData) ?? "Rives Blanches";
  const ville = clientCity(sessionData) ?? "Nice";
  const phone = clientPhone(sessionData) ?? fd?.phone ?? "04 93 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33493000000").replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "contact@rives-blanches.fr";
  const adresse = clientAddress(sessionData);
  const lieu = clientCodePostalVille(sessionData, "", ville).trim();

  /* Le héros est plein cadre : sans image, la section doit rester belle. Le
     repli est C.bgDark plus un dégradé d'horizon, jamais une URL inventée. */
  const heroImg = photo(0, "https://images.pexels.com/photos/8865105/pexels-photo-8865105.jpeg?auto=compress&cs=tinysrgb&w=1600");
  const salonsImg = photo(2, "");

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip", WebkitFontSmoothing: "antialiased" }}>
      <style>{FONTS_CSS}</style>
      <style>{`
        @media (max-width: 980px) { #i335-nav { display: none !important; } .i335-burger { display: flex !important; } }
        @media (max-width: 900px) {
          .i335-split { grid-template-columns: minmax(0,1fr) !important; gap: 34px !important; }
          .i335-split > * { order: initial !important; }
          .i335-methoderow { grid-template-columns: minmax(0,1fr) !important; gap: 14px !important; }
          .i335-methoderow > * { order: initial !important; }
          .i335-statband { grid-template-columns: repeat(auto-fit, minmax(min(150px,100%),1fr)) !important; }
          .i335-statcell { border-left: none !important; border-top: 1px solid ${C.border} !important; }
          .i335-avis { grid-template-columns: repeat(auto-fit, minmax(min(260px,100%),1fr)) !important; }
          .i335-avis > * { margin-top: 0 !important; }
          .i335-salons { grid-template-columns: minmax(0,1fr) !important; }
          .i335-pad { padding-left: 22px !important; padding-right: 22px !important; }
          .i335-herotext { padding-left: 22px !important; padding-right: 22px !important; }
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
          padding: scrolled ? "10px clamp(20px,4vw,52px)" : "22px clamp(20px,4vw,52px)",
          background: scrolled ? "rgba(245,248,250,0.93)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(125%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(125%)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          transition: `padding .6s ${EASE_CSS}, background .6s ${EASE_CSS}, backdrop-filter .6s ${EASE_CSS}, border-color .6s ${EASE_CSS}`,
        }}
      >
        <a href="#top" style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, textDecoration: "none" }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={marque} style={{ height: 30, maxWidth: 170, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Anchor size={17} color={scrolled ? C.accent : C.ecume} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 400, color: scrolled ? C.ink : C.white, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", transition: `color .6s ${EASE_CSS}` }}>{marque}</span>
              <span style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.26em", textTransform: "uppercase", color: scrolled ? C.textFaint : "rgba(255,255,255,0.6)", marginLeft: 6, transition: `color .6s ${EASE_CSS}` }}>
                {clientTrade(sessionData) ?? "Pompes funèbres"}
              </span>
            </>
          )}
        </a>
        <div id="i335-nav" style={{ display: "flex", gap: "clamp(14px,1.8vw,26px)", alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <NavLink key={l} label={l} href={h} light={!scrolled} />
          ))}
          <Btn href={telHref} filled>
            Nous joindre
          </Btn>
        </div>
        <button
          className="i335-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: scrolled ? C.ink : C.white, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: scrolled ? C.ink : C.white, transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: scrolled ? C.ink : C.white, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 62, left: 0, right: 0, zIndex: 99, background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "18px 26px 24px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map(({ l, h }) => (
            <NavLink key={l} label={l} href={h} onClick={() => setMobileOpen(false)} />
          ))}
          <a href={telHref} style={{ background: C.accent, color: C.white, borderRadius: 2, padding: "14px 22px", fontFamily: SANS, fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", textAlign: "center", marginTop: 12 }}>
            Nous joindre — 24h/24
          </a>
        </div>
      )}

      {/* ── HERO — H3 : plein cadre, titre en bas, repli C.bgDark ────────── */}
      <section
        id="top"
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: C.bgDark,
          overflow: "hidden",
        }}
      >
        {/* Repli sans image : un horizon dessiné, pas un trou noir. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to bottom, ${C.bgDarkAlt} 0%, rgba(42,111,151,0.26) 46%, rgba(42,111,151,0.46) 62%, ${C.bgDark} 100%)`,
          }}
        />
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(70% 42% at 50% 58%, rgba(158,201,222,0.12), transparent 72%)" }} />
        {heroImg ? (
          <img
            src={heroImg}
            alt="Lys blancs déposés sur la pierre"
            loading="eager"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : null}
        {/* Scrim à trois arrêts : le titre se lit quoi qu'il y ait derrière. */}
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,25,34,0.52) 0%, rgba(10,25,34,0.14) 34%, rgba(10,25,34,0.55) 72%, rgba(10,25,34,0.92) 100%)" }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 88% at 24% 74%, transparent 34%, rgba(10,25,34,0.52) 100%)" }} />

        <div
          className="i335-herotext"
          style={{ position: "relative", zIndex: 2, padding: "clamp(120px,14vw,180px) clamp(22px,7vw,110px) clamp(64px,9vw,120px)", maxWidth: 1180, width: "100%", margin: "0 auto", boxSizing: "border-box" }}
        >
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.1, delay: 0.2, ease: EASE }}>
            <Kicker color={C.ecume}>{clientEyebrow(sessionData) ?? <>Pompes funèbres · {ville}</>}</Kicker>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.25, delay: 0.36, ease: EASE }}
            style={{
              fontFamily: SERIF,
              fontWeight: 300,
              fontSize: "clamp(40px,7vw,92px)",
              color: C.white,
              lineHeight: 0.98,
              letterSpacing: "-0.018em",
              margin: "clamp(22px,2.6vw,34px) 0 clamp(20px,2.2vw,30px)",
              textShadow: "0 14px 60px rgba(0,0,0,0.5)",
              maxWidth: 900,
            }}
          >{/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ?? (<>
            {clientHeroLine(sessionData, 0, 2, 16) ?? "Ce qui compte,"}
            <br />
            <em style={{ fontStyle: "italic", color: C.ecume }}>{clientHeroLine(sessionData, 1, 2, 16) ?? "c'est comment on entoure."}</em>
          </>)}</motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.15, delay: 0.56, ease: EASE }}
            style={{ fontFamily: SANS, fontSize: "clamp(15.5px,1.3vw,17.5px)", fontWeight: 300, color: "rgba(255,255,255,0.8)", lineHeight: 1.8, maxWidth: 520, marginBottom: "clamp(28px,3.4vw,40px)" }}
          >
            {clientHeroSubtitle(sessionData) ??
              clientTagline(sessionData) ??
              "Une maison familiale face à la mer, pour organiser des obsèques dignes — inhumation, crémation, cérémonies civiles ou religieuses. Au prix écrit, jamais pressé."}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.05, delay: 0.74, ease: EASE }} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Btn href={telHref} filled>
              Nous joindre — 24h/24
            </Btn>
            <Btn href="#tarifs" light>
              Anticiper
            </Btn>
          </motion.div>
        </div>
      </section>

      {/* ── PanelRise — la page monte par-dessus le titre resté en place ─── */}
      <div style={{ background: C.bgDarkAlt }}>
        <PanelRise style={{ background: C.bg, overflow: "hidden" }}>
          <section className="i335-pad" style={{ padding: "clamp(90px,13vw,180px) clamp(22px,9vw,170px)", textAlign: "center" }}>
            <Reveal>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
                <Kicker color={C.textMuted} align="center">La maison</Kicker>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <p style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(25px,3.6vw,50px)", lineHeight: 1.38, color: C.ink, maxWidth: 940, margin: "0 auto", letterSpacing: "-0.006em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "respiration.texte") ?? (<>
                Rien ne presse ici. Une famille reçue prend le temps qu'il lui faut, et le prix de chaque choix est écrit en face.
              </>)}</p>
            </Reveal>
            <Reveal delay={0.24}>
              <div style={{ width: 1, height: 96, background: `linear-gradient(${C.accent}, transparent)`, margin: "clamp(42px,5vw,64px) auto 0" }} />
            </Reveal>
          </section>
        </PanelRise>
      </div>

      {/* ── ACCOMPAGNEMENT — colonnes filetées, aucune carte ─────────────── */}
      <section id="services" className="i335-pad" style={{ background: C.bg, padding: "clamp(70px,10vw,140px) clamp(22px,5vw,64px)" }}>
        <div style={{ maxWidth: 1220, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(30px,4vw,52px)", maxWidth: 780 }}>
              <Kicker>Accompagnement</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(32px,4.6vw,62px)", color: C.ink, margin: "18px 0 0", lineHeight: 1.05, letterSpacing: "-0.016em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>
                Tout est porté,<br /><em style={{ fontStyle: "italic", color: C.accent }}>rien n'est imposé.</em>
              </>)}</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "0 clamp(20px,3vw,44px)" }}>
            {SERVICES.map((s: any, idx: number) => (
              <ServiceColumn key={s.titre} item={s} i={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CHIFFRES — bande claire, filets verticaux, chiffres fantômes ─── */}
      <section className="i335-pad" style={{ background: C.bgAlt, padding: "clamp(20px,3vw,34px) clamp(22px,5vw,64px)", position: "relative", overflow: "hidden" }}>
        <div
          className="i335-statband"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1160, margin: "0 auto", position: "relative" }}
        >
          {STATS.map((s: any, idx: number) => (
            <Reveal key={s.label} delay={idx * 0.09}>
              <div
                className="i335-statcell"
                style={{ position: "relative", padding: "clamp(34px,4.4vw,58px) clamp(12px,2vw,26px)", borderLeft: idx === 0 ? "none" : `1px solid ${C.border}`, overflow: "hidden" }}
              >
                <span aria-hidden style={{ position: "absolute", right: 8, bottom: -12, fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(72px,8vw,124px)", color: "rgba(42,111,151,0.07)", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div style={{ position: "relative", fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(32px,3.8vw,50px)", color: C.accent, lineHeight: 1, letterSpacing: "-0.02em" }}>{s.value}</div>
                <div style={{ position: "relative", fontFamily: SANS, fontSize: 12, letterSpacing: "0.10em", textTransform: "uppercase", color: C.textMuted, marginTop: 14, lineHeight: 1.6 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── NOTRE APPROCHE — quatre temps, rangées alternées très aérées ─── */}
      <section id="methode" className="i335-pad" style={{ background: C.bg, padding: "clamp(80px,12vw,170px) clamp(22px,5vw,64px)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "clamp(40px,5.5vw,76px)" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Kicker align="center">Notre approche</Kicker>
              </div>
              <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(32px,4.4vw,58px)", color: C.ink, margin: "18px 0 0", lineHeight: 1.05, letterSpacing: "-0.016em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (<>
                La clarté<br /><em style={{ fontStyle: "italic", color: C.accent }}>est une forme de respect.</em>
              </>)}</h2>
            </div>
          </Reveal>
          {METHODE.map((m, idx) => (
            <Reveal key={m.n} delay={0.05}>
              <div
                className="i335-methoderow"
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0,0.42fr) minmax(0,1fr)",
                  gap: "clamp(18px,4vw,64px)",
                  alignItems: "baseline",
                  padding: "clamp(34px,4.6vw,64px) 0",
                  borderTop: `1px solid ${C.border}`,
                }}
              >
                <div style={{ order: idx % 2 === 0 ? 1 : 2, textAlign: idx % 2 === 0 ? "left" : "right" }}>
                  <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(36px,5vw,70px)", color: C.accentLight, lineHeight: 1, display: "block" }}>{m.n}</span>
                  <h3 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(21px,2.3vw,30px)", color: C.ink, margin: "10px 0 0", lineHeight: 1.16 }}>{m.t}</h3>
                </div>
                <p
                  style={{
                    order: idx % 2 === 0 ? 2 : 1,
                    fontFamily: SANS,
                    fontSize: "clamp(15px,1.25vw,17px)",
                    fontWeight: 300,
                    color: C.textMuted,
                    lineHeight: 1.86,
                    margin: 0,
                    maxWidth: 520,
                    justifySelf: idx % 2 === 0 ? "start" : "end",
                  }}
                >
                  {m.d}
                </p>
              </div>
            </Reveal>
          ))}
          <div style={{ borderTop: `1px solid ${C.border}` }} />
        </div>
      </section>

      {/* ── LES SALONS — bande plein cadre, repli C.bgDark dessiné ───────── */}
      <section id="salons" style={{ background: C.bgDark, position: "relative", overflow: "hidden" }}>
        <div
          className="i335-salons"
          style={{ display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,0.9fr)", minHeight: "clamp(380px,52vw,560px)" }}
        >
          <div style={{ position: "relative", minHeight: 260, background: C.bgDark, overflow: "hidden" }}>
            {/* Repli sans image : mer et horizon en CSS. */}
            <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, ${C.bgDarkAlt} 0%, rgba(42,111,151,0.22) 52%, rgba(158,201,222,0.42) 53%, rgba(42,111,151,0.30) 100%), ${C.bgDark}` }} />
            <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 14px)", opacity: 0.6 }} />
            {salonsImg ? (
              <img src={salonsImg} alt="Salon de recueillement en étage clair" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : null}
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,25,34,0.42) 0%, rgba(10,25,34,0.06) 45%, rgba(10,25,34,0.48) 100%)" }} />
          </div>
          <div className="i335-pad" style={{ padding: "clamp(52px,7vw,96px) clamp(22px,4.5vw,64px)", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
            <Reveal>
              <Kicker color={C.ecume}>Les salons</Kicker>
              <p style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(23px,2.8vw,38px)", color: C.white, lineHeight: 1.34, margin: "22px 0 30px", maxWidth: 460 }}>{/* TEXTE_SECTION */ clientText(sessionData, "salons.texte") ?? (<>
                Trois jours se passent ici. Ils doivent être clairs, calmes, et ouverts à toute heure.
              </>)}</p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {SALONS.map((s: string, idx: number) => (
                  <li key={idx} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "13px 0", borderTop: idx === 0 ? "none" : "1px solid rgba(255,255,255,0.10)" }}>
                    <span aria-hidden style={{ marginTop: 10, width: 16, height: 1, background: C.ecume, flexShrink: 0 }} />
                    <span style={{ fontFamily: SANS, fontSize: "clamp(14px,1.1vw,15.5px)", fontWeight: 300, color: "rgba(255,255,255,0.76)", lineHeight: 1.76 }}>{s}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENTS ─────────────────────────────────────────────────── */}
      <section id="engagements" className="i335-pad" style={{ background: C.bg, padding: "clamp(80px,12vw,164px) clamp(22px,5vw,64px)" }}>
        <div className="i335-split" style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(34px,5.5vw,84px)", alignItems: "center" }}>
          <Reveal style={{ order: 1 }}>
            <div style={{ position: "relative", borderRadius: 2, overflow: "hidden", background: C.bgDark }}>
              <img
                src={photo(1, "https://images.pexels.com/photos/32846096/pexels-photo-32846096.jpeg?auto=compress&cs=tinysrgb&w=1600")}
                alt="Horizon marin au matin"
                loading="lazy"
                style={{ width: "100%", aspectRatio: "4/3.3", objectFit: "cover", display: "block" }}
              />
              <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,25,34,0.34) 0%, transparent 46%)" }} />
            </div>
          </Reveal>
          <Reveal delay={0.14} style={{ order: 2 }}>
            <div>
              <Kicker>Une maison de confiance</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(29px,4vw,50px)", color: C.ink, margin: "18px 0 28px", lineHeight: 1.07, letterSpacing: "-0.016em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (<>
                Ce que la loi impose,<br /><em style={{ fontStyle: "italic", color: C.accent }}>ce que nous y ajoutons.</em>
              </>)}</h2>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {ENGAGEMENT.map((e: string, idx: number) => (
                  <li key={idx} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "16px 0", borderTop: idx === 0 ? "none" : `1px solid ${C.border}` }}>
                    <span aria-hidden style={{ marginTop: 10, width: 18, height: 1, background: C.accent, flexShrink: 0 }} />
                    <span style={{ fontFamily: SANS, fontSize: "clamp(14px,1.12vw,15.5px)", fontWeight: 300, color: C.textMuted, lineHeight: 1.78 }}>{e}</span>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 32 }}>
                <Btn href={telHref} filled>
                  Nous appeler
                </Btn>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TARIFS — la table du devis-type, lignes fines ────────────────── */}
      <section id="tarifs" className="i335-pad" style={{ background: C.bgAlt, padding: "clamp(80px,12vw,164px) clamp(22px,5vw,64px)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Kicker align="center">Tarifs</Kicker>
              </div>
              <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(32px,4.3vw,56px)", color: C.ink, margin: "18px 0 0", lineHeight: 1.05, letterSpacing: "-0.016em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Des prix <em style={{ fontStyle: "italic", color: C.accent }}>écrits.</em></>)}</h2>
              <p style={{ fontFamily: SANS, fontSize: "clamp(14.5px,1.15vw,16px)", fontWeight: 300, color: C.textMuted, maxWidth: 560, margin: "20px auto 0", lineHeight: 1.82 }}>
                Le devis-type réglementé distingue prestations obligatoires, courantes et optionnelles. Il reste valable si vous consultez d'autres maisons.
              </p>
            </div>
          </Reveal>

          <div style={{ marginTop: "clamp(36px,4.6vw,58px)", background: C.bgCard, border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "14px clamp(18px,2.4vw,30px)", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
              <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textFaint }}>Prestation</span>
              <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textFaint }}>À partir de</span>
            </div>
            {TARIFS.map((t: any, idx: number) => (
              <Reveal key={t.a} delay={idx * 0.05}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px clamp(14px,2vw,30px)",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    padding: "clamp(20px,2.5vw,30px) clamp(18px,2.4vw,30px)",
                    borderTop: idx === 0 ? "none" : `1px solid ${C.border}`,
                  }}
                >
                  <div style={{ minWidth: 0, flex: "1 1 280px" }}>
                    <div style={{ fontFamily: SERIF, fontSize: "clamp(19px,1.9vw,25px)", color: C.ink, lineHeight: 1.22 }}>{t.a}</div>
                    <div style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 300, color: C.textFaint, marginTop: 8, lineHeight: 1.72, maxWidth: 540 }}>{t.n}</div>
                  </div>
                  <div style={{ fontFamily: SERIF, fontSize: "clamp(20px,2vw,26px)", color: C.accent, whiteSpace: "nowrap" }}>{t.p}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVIS — colonnes décalées, sans carte ni étoile ───────────────── */}
      <section className="i335-pad" style={{ background: C.bg, padding: "clamp(80px,12vw,164px) clamp(22px,5vw,64px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(36px,5vw,66px)", maxWidth: 720 }}>
              <Kicker>Des familles nous écrivent</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(30px,4.2vw,54px)", color: C.ink, margin: "18px 0 0", lineHeight: 1.06, letterSpacing: "-0.016em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>Ce qu'elles ont <em style={{ fontStyle: "italic", color: C.accent }}>retenu</em>.</>)}</h2>
            </div>
          </Reveal>
          <div className="i335-avis" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "clamp(22px,3.2vw,48px)", alignItems: "start" }}>
            {AVIS.map((a: any, idx: number) => (
              <Reveal key={a.auteur} delay={idx * 0.11} style={{ marginTop: idx % 3 === 1 ? "clamp(0px,4vw,56px)" : idx % 3 === 2 ? "clamp(0px,8vw,104px)" : 0 }}>
                <figure style={{ margin: 0, paddingTop: 26, borderTop: `1px solid ${C.border}` }}>
                  <blockquote style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(18px,1.9vw,24px)", color: C.ink, lineHeight: 1.6, margin: "0 0 24px" }}>
                    « {a.texte} »
                  </blockquote>
                  <figcaption>
                    <div style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 600, color: C.ink }}>{a.auteur}</div>
                    <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: C.accent, marginTop: 8 }}>{a.detail}</div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section id="contact" className="i335-pad" style={{ background: C.bgDark, padding: "clamp(84px,12vw,168px) clamp(22px,5vw,64px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(58% 58% at 50% 24%, rgba(158,201,222,0.12), transparent 72%)" }} />
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Kicker color={C.ecume} align="center">À votre écoute</Kicker>
            </div>
            <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(32px,4.6vw,62px)", color: C.white, margin: "20px 0 20px", lineHeight: 1.05, letterSpacing: "-0.016em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
              À toute heure,<br /><em style={{ fontStyle: "italic", color: C.ecume }}>quelqu'un répond.</em>
            </>)}</h2>
            <p style={{ fontFamily: SANS, fontSize: "clamp(15px,1.2vw,16.5px)", fontWeight: 300, color: "rgba(255,255,255,0.72)", maxWidth: 470, margin: "0 auto clamp(30px,3.8vw,44px)", lineHeight: 1.82 }}>
              En cas de décès, appelez-nous : nous nous déplaçons et prenons le relais, de jour comme de nuit.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href={telHref} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.accent, color: C.white, borderRadius: 2, padding: "17px 34px", fontFamily: SANS, fontSize: 15.5, fontWeight: 600, textDecoration: "none" }}>
                <Phone size={17} /> {phone}
              </a>
              <a href={`mailto:${mail}`} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "transparent", color: "rgba(255,255,255,0.92)", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 2, padding: "17px 30px", fontFamily: SANS, fontSize: 15.5, fontWeight: 600, textDecoration: "none" }}>
                <Mail size={17} /> Nous écrire
              </a>
            </div>
            <div style={{ marginTop: 34, fontFamily: SANS, fontSize: 12.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.9 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                <MapPin size={13} color={C.ecume} />
                {adresse ?? lieu} · Nous intervenons à {ZONES.join(", ")}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="i335-pad" style={{ background: C.bgDarkAlt, padding: "clamp(52px,7vw,84px) clamp(22px,5vw,64px) 26px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 38 }}>
            <div style={{ maxWidth: 360 }}>
              <div style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(22px,2.2vw,30px)", color: C.ecume, marginBottom: 12 }}>{marque}</div>
              <p style={{ fontFamily: SANS, fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.4)", lineHeight: 1.85, margin: 0 }}>
                Pompes funèbres & prévoyance · {ville}
                <br />
                Habilitation préfectorale n° 26-06-0287
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <MapPin size={13} />, t: adresse ?? `${lieu}, Alpes-Maritimes` },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Mail size={13} />, t: mail },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.44)", fontFamily: SANS, fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.ecume, display: "flex" }}>{item.icon}</span>
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
