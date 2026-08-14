"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Baby, Blocks, BookOpen, Clock, Mail, MapPin, Music4, Phone, Soup, Sprout, TreePine } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, HairlineArrows, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
import { ComposeIn } from "@/lib/templates/hero-kit-3";
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

/* ════════════════════════════════════════════════════════════════════════════
   LES PETITS CAIRNS — Micro-crèche · Grenoble

   Archétype H2 : split avec le média À GAUCHE. Geste de signature UNIQUE :
   ComposeIn — la scène commence vide, puis les éléments arrivent un par un,
   chacun par son bord. Le vide initial est le sujet : c'est l'éveil qui se
   compose, pas une page qui charge. Une lueur qui dérive lentement (28 s, CSS
   pur) tient la scène pendant l'attente.

   Tout est rond : médaillon en galet, tuiles à grand rayon, pastilles de
   chiffres. Aucun angle vif sur la page — c'est la signature visuelle du thème
   et ce qui le sépare des deux crèches voisines du catalogue.
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

/* ── Fontes — rôles opposés : didone d'affiche / grotesque de texte ───────── */
const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700&display=swap');`;

const SERIF = "'DM Serif Display', Georgia, serif";
const SANS = "'DM Sans', system-ui, -apple-system, sans-serif";

/* ── Easing unique du thème, répété littéralement en CSS ──────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

/* ── Palette potager ─────────────────────────────────────────────────────── */
let C: Record<string, string> = {
  bg: "#f7f9f5",
  bgAlt: "#edf3ea",
  bgDark: "#1b2c22",
  bgDarkAlt: "#14211a",
  bgCard: "#ffffff",
  accent: "var(--brand, #4e8a5f)",
  accentDark: "var(--brand-light, #376849)",
  accentLight: "#dceadf",
  ink: "#17251d",
  textMuted: "#4f6357",
  textFaint: "#87a093",
  border: "#dbe6dc",
  white: "#ffffff",
  /* Clé métier : le jaune des jeux, en ponctuation seulement. */
  sun: "#e0ab3c",
};

/* ── Photos : l'adresse du client d'abord, celle du thème ensuite ─────────── */
function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* La seule photographie du thème, conservée telle quelle. */
const PHOTO_JEU =
  "https://images.pexels.com/photos/8422255/pexels-photo-8422255.jpeg?auto=compress&cs=tinysrgb&w=1400";

/* ── Contenus de démonstration ───────────────────────────────────────────── */
const NAV = [
  { l: "Le projet", h: "#services" },
  { l: "Une journée", h: "#methode" },
  { l: "Tarifs & aides", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

const HERO_DEMO = {
  l1: "Douze enfants,",
  l2: "quatre adultes, un vrai dehors.",
  sub: "Une micro-crèche à taille de famille : douze places, une équipe stable diplômée, un jardin pour sortir tous les jours — même en hiver, surtout en hiver. Repas bio cuisinés sur place.",
};

/* Les trois scènes du héros : chacune se recompose, tuile par tuile. */
const SCENES = [
  {
    k: "Grandir dehors",
    sub: "Le jardin n'est pas une option météo.",
    tiles: [
      { icon: TreePine, t: "Dehors tous les jours", d: "Combinaisons de pluie fournies — il n'y a pas de mauvais temps.", ton: "clair" },
      { icon: Blocks, t: "Motricité libre", d: "Au sol, pieds nus, à son rythme : on ne met pas assis un bébé qui ne s'assoit pas.", ton: "sombre" },
      { icon: Baby, t: "Référente par enfant", d: "Une professionnelle repère pour chaque enfant, du premier au dernier jour.", ton: "pale" },
    ],
  },
  {
    k: "Bien manger",
    sub: "La cuisine est dans la crèche, pas dans un camion.",
    tiles: [
      { icon: Soup, t: "Cuisiné sur place", d: "Repas bio du jour, adaptés à chaque âge et chaque allergie.", ton: "sombre" },
      { icon: Baby, t: "Diversification menée", d: "Introduction des aliments coordonnée avec vous, jamais imposée.", ton: "clair" },
      { icon: Sprout, t: "Potager des petits", d: "Les tomates cerises qu'on a plantées ont un autre goût.", ton: "pale" },
    ],
  },
  {
    k: "S'éveiller",
    sub: "Peu d'écrans zéro, beaucoup de vrais objets.",
    tiles: [
      { icon: Music4, t: "Éveil musical", d: "Une intervenante chaque semaine, des instruments à toucher.", ton: "pale" },
      { icon: BookOpen, t: "Livres partout", d: "Lecture libre et racontées du matin — la bibliothèque est au sol.", ton: "clair" },
      { icon: Blocks, t: "Jeu libre d'abord", d: "Le programme, c'est le leur : on prépare l'environnement, ils font le reste.", ton: "sombre" },
    ],
  },
];

const SERVICES_SOURCE = [
  { tag: "Régulier", titre: "Accueil régulier", desc: "De 2 mois ½ à 3 ans, contrats de 1 à 5 jours par semaine. Adaptation progressive sur deux semaines, à votre rythme et au sien." },
  { tag: "Occasionnel", titre: "Accueil occasionnel", desc: "Quelques heures ou une journée quand une place se libère — pour souffler, un rendez-vous, ou commencer en douceur." },
  { tag: "Nature", titre: "Pédagogie du dehors", desc: "Jardin quotidien, sorties au parc Paul-Mistral, semaine à la ferme au printemps. Les enfants rentrent sales et contents : c'est le but." },
  { tag: "Cuisine", titre: "Repas bio sur place", desc: "Une cuisinière dédiée, menus validés par une diététicienne, allergies gérées avec PAI. Le menu de la semaine est affiché et envoyé." },
  { tag: "Familles", titre: "Lien aux familles", desc: "Transmissions du soir en face à face, application photos sobre (privée), café des parents chaque premier vendredi." },
  { tag: "3 ans", titre: "Passerelle école", desc: "La dernière année prépare en douceur : autonomie, groupe, visite de l'école du quartier au troisième trimestre." },
];
let SERVICES_DEMO = SERVICES_SOURCE;
let SERVICES = SERVICES_SOURCE;

const METHODE_DEMO = [
  { n: "01", h: "7h30 – 9h30", t: "Arrivées échelonnées", d: "Chaque enfant est accueilli individuellement, transmission du matin avec le parent." },
  { n: "02", h: "9h30 – 11h30", t: "Jardin & activités", d: "Dehors chaque matin, ateliers libres ensuite. Les siestes ne sont jamais réveillées." },
  { n: "03", h: "11h30 – 14h", t: "Repas ensemble", d: "Cuisinés sur place, servis à table dès que l'enfant s'assoit — les grands aident à mettre le couvert." },
  { n: "04", h: "16h30 – 18h30", t: "Transmissions du soir", d: "Ce qu'il a mangé, dormi, découvert : cinq vraies minutes par famille, pas un tableau à la porte." },
];
let METHODE = METHODE_DEMO;

const ENGAGEMENT_DEMO = [
  "Agrément PMI de l'Isère — 12 places, locaux et taux d'encadrement contrôlés",
  "Équipe 100 % diplômée (EJE, auxiliaires de puériculture, CAP AEPE), stable depuis l'ouverture",
  "Analyse de pratiques mensuelle avec une psychologue extérieure",
  "Éligible CMG de la CAF : le vrai reste à charge est souvent proche d'une crèche municipale",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

const TARIFS_DEMO = [
  { a: "Journée (contrat régulier)", p: "dès 68 €", n: "Avant CMG. Repas bio, couches et produits de soin inclus." },
  { a: "Semaine 5 jours", p: "dès 310 €", n: "Avant aides — reste à charge simulé lors de la visite." },
  { a: "Accueil occasionnel (demi-journée)", p: "38 €", n: "Selon places disponibles, repas inclus." },
  { a: "Frais d'inscription", p: "0 €", n: "La visite, le dossier et l'adaptation ne se facturent pas." },
];
let TARIFS = TARIFS_DEMO;

const AVIS_SOURCE = [
  { texte: "Notre fille rentre avec de la terre sous les ongles et des histoires plein la tête. L'équipe n'a pas bougé en trois ans — ça dit tout de cette maison.", auteur: "Parents de Léonie, 2 ans ½", detail: "Accueil régulier" },
  { texte: "L'adaptation en deux semaines, à son rythme, sans forcer : notre fils de 4 mois s'est posé tout seul. Les transmissions du soir sont un vrai moment.", auteur: "Camille & Hugo", detail: "Entrée en crèche" },
  { texte: "La simulation CMG faite à la visite nous a surpris : 12 € par jour de reste à charge réel. On croyait la micro-crèche inaccessible.", auteur: "Parents de Nino", detail: "Tarifs & CAF" },
];
let AVIS_DEMO = AVIS_SOURCE;
let AVIS = AVIS_SOURCE;

const STATS_DEMO = [
  { value: "12", label: "Places — pas une de plus" },
  { value: "1:3", label: "Adulte pour 3 bébés" },
  { value: "100 %", label: "Équipe diplômée petite enfance" },
  { value: "0", label: "Écran, nulle part" },
];
let STATS = STATS_DEMO;

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

/** Révélation au défilement, une seule fois. */
function Reveal({ children, delay = 0, y = 28 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -8% 0px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.9, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}

/** Kicker : filet 40 × 1 px puis capitales à interlettrage large. */
function Kicker({ children, color = C.accentDark, align = "left" }: { children: React.ReactNode; color?: string; align?: "left" | "center" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: align === "center" ? "center" : "flex-start" }}>
      <span style={{ width: 40, height: 1, background: color, opacity: 0.7, flexShrink: 0 }} />
      <span style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.34em", textTransform: "uppercase", color, fontWeight: 700 }}>{children}</span>
      {align === "center" && <span style={{ width: 40, height: 1, background: color, opacity: 0.7, flexShrink: 0 }} />}
    </div>
  );
}

/** Motif de galets : les cairns du nom, en CSS, sans image. */
function pebbleTexture(opacity = 0.08) {
  return {
    backgroundImage: `radial-gradient(circle at 20% 30%, rgba(78,138,95,${opacity}) 0 9px, transparent 10px), radial-gradient(circle at 68% 72%, rgba(78,138,95,${opacity * 0.8}) 0 13px, transparent 14px), radial-gradient(circle at 88% 20%, rgba(224,171,60,${opacity * 0.7}) 0 6px, transparent 7px)`,
    backgroundSize: "132px 118px",
  } as React.CSSProperties;
}

/** Chiffre fantôme posé en marge. */
function Ghost({ children, right = false, size = "clamp(130px, 21vw, 320px)" }: { children: React.ReactNode; right?: boolean; size?: string }) {
  return (
    <span aria-hidden style={{ position: "absolute", top: "-0.2em", [right ? "right" : "left"]: "-0.04em", fontFamily: SERIF, fontSize: size, lineHeight: 0.8, color: C.accent, opacity: 0.07, pointerEvents: "none", userSelect: "none" }}>
      {children}
    </span>
  );
}

/** Bouton à coin rond, trois propriétés au survol. */
function RoundButton({ children, href, filled = false, onClick }: { children: React.ReactNode; href: string; filled?: boolean; onClick?: () => void }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 28px", minHeight: 44, borderRadius: 999, fontFamily: SANS, fontSize: 14.5, fontWeight: 700, border: `1px solid ${filled ? "transparent" : C.border}`, background: filled ? (h ? C.accentDark : C.accent) : h ? C.bgCard : "transparent", color: filled ? C.white : C.ink, textDecoration: "none", transform: h ? "translateY(-3px)" : "none", boxShadow: h ? "0 22px 42px -26px rgba(23,37,29,0.55), 0 4px 12px -8px rgba(23,37,29,0.3)" : "0 0 0 rgba(0,0,0,0)", transition: `all .5s ${EASE_CSS}` }}
    >
      {children}
      <ArrowRight size={15} style={{ transform: h ? "translateX(5px)" : "none", transition: `transform .5s ${EASE_CSS}` }} />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   1 · NAV
   ════════════════════════════════════════════════════════════════════════════ */
function NavLink({ label, href, onClick }: { label: string; href: string; onClick?: () => void }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ position: "relative", fontFamily: SANS, fontSize: 14.5, fontWeight: 500, color: h ? C.accentDark : C.textMuted, textDecoration: "none", padding: "13px 2px", minHeight: 44, display: "inline-block", transition: `color .45s ${EASE_CSS}` }}
    >
      {label}
      <span style={{ position: "absolute", left: 0, bottom: 8, height: 2, borderRadius: 2, width: h ? "100%" : "0%", background: C.accent, transition: `width .5s ${EASE_CSS}` }} />
    </a>
  );
}

function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [hCta, setHCta] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tel = `tel:${clientPhone(sessionData) ?? fd?.phone ?? "+33476000000"}`;

  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: solid ? "10px clamp(20px,5vw,60px)" : "20px clamp(20px,5vw,60px)", background: solid ? "rgba(247,249,245,0.94)" : "transparent", backdropFilter: solid ? "blur(14px) saturate(140%)" : "none", WebkitBackdropFilter: solid ? "blur(14px) saturate(140%)" : "none", borderBottom: `1px solid ${solid ? C.border : "transparent"}`, boxShadow: solid ? "0 14px 34px -30px rgba(23,37,29,0.6)" : "none", transition: `all .55s ${EASE_CSS}` }}>
        <a href="#top" style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, textDecoration: "none" }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 32, maxWidth: 168, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <span style={{ width: 30, height: 30, borderRadius: 999, background: C.accentLight, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Blocks size={16} color={C.accentDark} strokeWidth={1.7} />
              </span>
              <span style={{ fontFamily: SERIF, fontSize: 21, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {fd?.businessName ?? clientName(sessionData) ?? "Les Petits Cairns"}
              </span>
              <span className="i353-navtrade" style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.26em", textTransform: "uppercase", color: C.textFaint, marginLeft: 4, whiteSpace: "nowrap" }}>
                {clientTrade(sessionData) ?? "Micro-crèche"}
              </span>
            </>
          )}
        </a>

        <div id="i353-nav" style={{ display: "flex", gap: "clamp(16px,2.2vw,30px)", alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <NavLink key={l} label={l} href={h} />
          ))}
          <a
            href={tel}
            onMouseEnter={() => setHCta(true)}
            onMouseLeave={() => setHCta(false)}
            style={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, padding: "12px 24px", minHeight: 44, borderRadius: 999, display: "inline-flex", alignItems: "center", background: hCta ? C.accentDark : C.accent, color: C.white, textDecoration: "none", whiteSpace: "nowrap", transform: hCta ? "translateY(-2px)" : "none", boxShadow: hCta ? "0 18px 32px -20px rgba(55,104,73,0.8)" : "0 6px 16px -14px rgba(55,104,73,0.6)", transition: `all .5s ${EASE_CSS}` }}
          >
            Pré-inscription
          </a>
        </div>

        <button className="i353-burger" onClick={() => setOpen(!open)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
          <span style={{ display: "block", width: 24, height: 2, borderRadius: 2, background: C.ink, transition: `transform .35s ${EASE_CSS}`, transform: open ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 2, borderRadius: 2, background: C.ink, opacity: open ? 0 : 1, transition: "opacity .3s" }} />
          <span style={{ display: "block", width: 24, height: 2, borderRadius: 2, background: C.ink, transition: `transform .35s ${EASE_CSS}`, transform: open ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>

      {open && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 99, background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "14px clamp(20px,5vw,60px) 22px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map(({ l, h }) => (
            <NavLink key={l} label={l} href={h} onClick={() => setOpen(false)} />
          ))}
          <a href={tel} style={{ marginTop: 12, background: C.accent, color: C.white, borderRadius: 999, padding: "15px 22px", minHeight: 44, fontFamily: SANS, fontSize: 15, fontWeight: 700, textAlign: "center", textDecoration: "none" }}>
            Pré-inscription
          </a>
        </div>
      )}
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · HÉROS — H2 : la scène (média) à GAUCHE, le texte à droite.
       Geste : ComposeIn, un seul index pilote tout.
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const { i, next, prev } = useSlides(SCENES.length, DWELL.normal);
  const S = SCENES[i];
  const img = photo(0, PHOTO_JEU);

  const l1 = clientHeroLine(sessionData, 0, 2, 18) ?? HERO_DEMO.l1;
  const l2 = clientHeroLine(sessionData, 1, 2, 18) ?? HERO_DEMO.l2;
  const sub = clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? HERO_DEMO.sub;

  const fonds: Record<string, { bg: string; fg: string; sub: string }> = {
    clair: { bg: C.accentLight, fg: C.accentDark, sub: "rgba(55,104,73,0.82)" },
    sombre: { bg: C.bgDark, fg: C.accentLight, sub: "rgba(220,234,223,0.76)" },
    pale: { bg: C.bgCard, fg: C.ink, sub: C.textMuted },
  };

  /* Les quatre pièces de la scène. L'ordre d'arrivée fait le récit :
     le galet-photo d'abord, puis les trois attentions. */
  const pieces = [
    {
      from: "left" as const,
      style: { gridColumn: "1", gridRow: "1 / span 2" },
      node: (
        <div className="i353-galet" style={{ position: "relative", height: "100%", minHeight: 240, overflow: "hidden", borderRadius: "54% 46% 48% 52% / 48% 52% 48% 52%", background: C.accentLight, boxShadow: "0 34px 70px -44px rgba(23,37,29,0.6)" }}>
          {img ? (
            <img src={img} alt={`${fd?.businessName ?? clientName(sessionData) ?? "Les Petits Cairns"} — temps de jeu à la micro-crèche`} loading="eager" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, background: "linear-gradient(150deg, rgba(78,138,95,0.22), rgba(224,171,60,0.16))" }}>
              <Sprout size={44} color={C.accentDark} strokeWidth={1.1} />
              <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.accentDark, textAlign: "center", padding: "0 22px" }}>
                Le jardin, chaque jour
              </span>
            </div>
          )}
        </div>
      ),
    },
    ...S.tiles.map((t, n) => {
      const Icon = t.icon;
      const ton = fonds[t.ton] ?? fonds.pale;
      return {
        from: (n === 1 ? "bottom" : "right") as "right" | "bottom",
        style: n === 2 ? { gridColumn: "1 / -1", gridRow: "3" } : { gridColumn: "2", gridRow: String(n + 1) },
        node: (
          <div style={{ background: ton.bg, color: ton.fg, borderRadius: 26, padding: "20px 22px", height: "100%", display: "flex", gap: 15, alignItems: "flex-start", border: t.ton === "pale" ? `1px solid ${C.border}` : "1px solid transparent" }}>
            <span style={{ width: 34, height: 34, borderRadius: 999, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", background: t.ton === "sombre" ? "rgba(220,234,223,0.14)" : "rgba(78,138,95,0.12)" }}>
              <Icon size={18} strokeWidth={1.7} />
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 15.5, marginBottom: 5 }}>{t.t}</div>
              <div style={{ fontFamily: SANS, fontWeight: 300, fontSize: 13.5, lineHeight: 1.66, color: ton.sub }}>{t.d}</div>
            </div>
          </div>
        ),
      };
    }),
  ];

  return (
    <section id="top" className="i353-hero" style={{ position: "relative", display: "grid", gridTemplateColumns: "minmax(0,0.98fr) minmax(0,1.02fr)", gap: "clamp(30px,5vw,70px)", alignItems: "center", maxWidth: 1260, margin: "0 auto", padding: "clamp(112px,13vw,168px) clamp(20px,5vw,64px) clamp(56px,7vw,96px)" }}>
      {/* La lueur qui dérive : ce qui empêche la scène vide de ressembler à
          une page qui n'a pas fini de charger. */}
      <div aria-hidden className="i353-derive" style={{ position: "absolute", inset: "-10% -20%", background: "radial-gradient(38% 42% at 30% 45%, rgba(78,138,95,0.16), transparent 70%)", pointerEvents: "none" }} />

      {/* ── MÉDIA À GAUCHE : la scène qui se compose ─────────────────────── */}
      <ComposeIn
        index={i}
        items={pieces}
        hold={1.4}
        beat={0.17}
        className="i353-scene"
        style={{ position: "relative", display: "grid", gridTemplateColumns: "minmax(0,1.08fr) minmax(0,0.92fr)", gridTemplateRows: "minmax(112px,auto) minmax(112px,auto) minmax(96px,auto)", gap: 14 }}
      />

      {/* ── TEXTE À DROITE ──────────────────────────────────────────────── */}
      <div style={{ position: "relative" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: EASE, delay: 0.12 }}>
          <Kicker>{clientEyebrow(sessionData) ?? `Micro-crèche · ${clientCity(sessionData) ?? "Grenoble"}`}</Kicker>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.95, ease: EASE, delay: 0.22 }} style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(2.3rem,5.4vw,4.6rem)", lineHeight: 0.99, letterSpacing: "-0.015em", color: C.ink, margin: "clamp(18px,2.4vw,28px) 0 clamp(16px,2vw,24px)" }}>
          {l1}
          <br />
          <em style={{ fontStyle: "italic", color: C.accent }}>{l2}</em>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.36 }} style={{ fontFamily: SANS, fontWeight: 300, fontSize: "clamp(15.5px,1.5vw,18px)", lineHeight: 1.8, color: C.textMuted, maxWidth: 500, margin: "0 0 clamp(24px,3vw,34px)" }}>
          {sub}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.48 }} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <RoundButton href={`tel:${clientPhone(sessionData) ?? fd?.phone ?? "+33476000000"}`} filled>
            Demander une place
          </RoundButton>
          <RoundButton href="#methode">Une journée ici</RoundButton>
        </motion.div>

        {/* Légende de scène : le seul index qui pilote tout le héros. */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: "clamp(28px,4vw,44px)", flexWrap: "wrap" }}>
          <SlideIndex i={i} total={SCENES.length} variant="fraction" color={C.textFaint} className="" />
          <span style={{ fontFamily: SANS, fontSize: 13.5, color: C.textMuted, minWidth: 0 }}>
            <strong style={{ color: C.ink, fontWeight: 700 }}>{S.k}</strong> — {S.sub}
          </span>
          <HairlineArrows onPrev={prev} onNext={next} color={C.ink} className="" />
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · RESPIRATION
   ════════════════════════════════════════════════════════════════════════════ */
function Respiration() {
  return (
    <section style={{ background: C.bg, padding: "clamp(70px,10vw,140px) clamp(24px,8vw,170px)", textAlign: "center" }}>
      <Reveal>
        <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(22px,3.1vw,42px)", lineHeight: 1.36, color: C.ink, maxWidth: 880, margin: "0 auto" }}>
          {/* TEXTE_SECTION */ clientText(sessionData, "respiration.texte") ?? (
            <>Le jardin n'est pas une option météo.</>
          )}
        </p>
      </Reveal>
      <Reveal delay={0.12}>
        <div style={{ width: 1, height: 76, background: `linear-gradient(${C.accent}, transparent)`, margin: "clamp(30px,4vw,52px) auto 0" }} />
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · UNE JOURNÉE — ruban d'horaires à pastilles, avant le projet :
       ce que les parents veulent savoir d'abord.
   ════════════════════════════════════════════════════════════════════════════ */
function Journee() {
  const img = photo(1, "");
  return (
    <section id="methode" className="i353-pad" style={{ position: "relative", background: C.bgAlt, padding: "clamp(74px,9vw,132px) clamp(20px,5vw,64px)", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, ...pebbleTexture(0.07), pointerEvents: "none" }} />
      <div className="i353-journee" style={{ position: "relative", maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,0.86fr) minmax(0,1.14fr)", gap: "clamp(30px,5vw,72px)", alignItems: "start" }}>
        <Reveal>
          <div>
            <Kicker>Une journée</Kicker>
            <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(29px,4vw,52px)", lineHeight: 1.06, letterSpacing: "-0.012em", color: C.ink, margin: "20px 0 24px" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "journee.titre") ?? (
                <>
                  Le rythme des enfants,
                  <br />
                  <em style={{ fontStyle: "italic", color: C.accent }}>pas celui d'un planning.</em>
                </>
              )}
            </h2>
            <div className="i353-rond" style={{ position: "relative", aspectRatio: "1/1", maxWidth: 340, borderRadius: 999, overflow: "hidden", background: C.accentLight, marginTop: 8 }}>
              {img ? (
                <img src={img} alt="Un moment d'atelier libre" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              ) : (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, background: "radial-gradient(70% 70% at 40% 35%, rgba(224,171,60,0.22), rgba(78,138,95,0.20))" }}>
                  <Baby size={40} color={C.accentDark} strokeWidth={1.1} />
                  <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.accentDark }}>Atelier libre</span>
                </div>
              )}
            </div>
          </div>
        </Reveal>

        <div style={{ position: "relative" }}>
          {METHODE.map((m, n) => (
            <Reveal key={`${m.n}-${n}`} delay={n * 0.075}>
              <div className="i353-etape" style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: "clamp(16px,2.4vw,28px)", alignItems: "start", padding: "clamp(18px,2.2vw,26px) 0" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 46, height: 46, borderRadius: 999, background: C.bgCard, border: `1px solid ${C.border}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 19, color: C.accentDark, flexShrink: 0 }}>
                    {m.n}
                  </span>
                  {n < METHODE.length - 1 && <span aria-hidden style={{ width: 1, flex: 1, minHeight: 34, background: `linear-gradient(${C.accent}, transparent)` }} />}
                </div>
                <div style={{ paddingTop: 4 }}>
                  <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.26em", textTransform: "uppercase", color: C.accent, fontWeight: 700, marginBottom: 8 }}>{m.h}</div>
                  <h3 style={{ fontFamily: SERIF, fontSize: "clamp(20px,2.1vw,27px)", fontWeight: 400, lineHeight: 1.2, color: C.ink, margin: "0 0 8px" }}>{m.t}</h3>
                  <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 15, lineHeight: 1.76, color: C.textMuted, maxWidth: 520, margin: 0 }}>{m.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · CHIFFRES — pastilles rondes, pas une bande de tableaux
   ════════════════════════════════════════════════════════════════════════════ */
function Chiffres() {
  return (
    <section className="i353-pad" style={{ position: "relative", background: C.bgDark, color: C.white, padding: "clamp(64px,8vw,108px) clamp(20px,5vw,64px)", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: "-40% -10% auto -10%", height: "120%", background: "radial-gradient(40% 50% at 25% 40%, rgba(78,138,95,0.20), transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", maxWidth: 1120, margin: "0 auto" }}>
        <Reveal>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(19px,2.3vw,29px)", lineHeight: 1.5, color: "rgba(247,249,245,0.9)", maxWidth: 620, margin: "0 0 clamp(30px,4vw,50px)" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "chiffres.texte") ?? (
              <>Douze places, pas une de plus : <em style={{ color: C.accentLight }}>la taille est le projet.</em></>
            )}
          </p>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px,100%), 1fr))", gap: "clamp(14px,2.4vw,26px)" }}>
          {STATS.map((s, n) => (
            <Reveal key={`${s.label}-${n}`} delay={n * 0.07}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ width: "clamp(74px,9vw,94px)", height: "clamp(74px,9vw,94px)", borderRadius: 999, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", background: n % 2 === 0 ? "rgba(220,234,223,0.10)" : "rgba(224,171,60,0.14)", border: "1px solid rgba(220,234,223,0.16)", fontFamily: SERIF, fontSize: "clamp(21px,2.4vw,29px)", color: C.accentLight, textAlign: "center", padding: 6, lineHeight: 1 }}>
                  {s.value}
                </span>
                <span style={{ fontFamily: SANS, fontWeight: 300, fontSize: 13.5, lineHeight: 1.6, color: "rgba(247,249,245,0.6)" }}>{s.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · LE PROJET — bento de tuiles inégales, toutes arrondies
   ════════════════════════════════════════════════════════════════════════════ */
function ProjetTuile({ s, n }: { s: any; n: number }) {
  const [h, setH] = useState(false);
  /* Tuiles inégales : la première et la quatrième prennent deux colonnes. */
  const large = n === 0 || n === 3;
  return (
    <Reveal delay={Math.min(n, 4) * 0.06}>
      <article
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        className={large ? "i353-tuile i353-tuile-large" : "i353-tuile"}
        style={{ background: C.bgCard, borderRadius: 28, border: `1px solid ${h ? C.accent : C.border}`, padding: "clamp(24px,2.8vw,34px)", height: "100%", transform: h ? "translateY(-6px)" : "none", boxShadow: h ? "0 30px 58px -36px rgba(23,37,29,0.42), 0 6px 16px -10px rgba(23,37,29,0.22)" : "0 8px 24px -22px rgba(23,37,29,0.3)", transition: `all .5s ${EASE_CSS}`, cursor: "default" }}
      >
        <span style={{ display: "inline-block", borderRadius: 999, background: h ? C.accent : C.accentLight, color: h ? C.white : C.accentDark, padding: "5px 14px", fontFamily: SANS, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", transition: `all .5s ${EASE_CSS}` }}>
          {s.tag}
        </span>
        <h3 style={{ fontFamily: SERIF, fontSize: "clamp(21px,2.2vw,28px)", fontWeight: 400, lineHeight: 1.2, color: C.ink, margin: "16px 0 10px" }}>{s.titre}</h3>
        <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 14.5, lineHeight: 1.76, color: C.textMuted, margin: 0, maxWidth: large ? 620 : 420 }}>{s.desc}</p>
      </article>
    </Reveal>
  );
}

function Projet() {
  return (
    <section id="services" className="i353-pad" style={{ position: "relative", background: C.bg, padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)", overflow: "hidden" }}>
      <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto" }}>
        <Reveal>
          <div style={{ position: "relative", marginBottom: "clamp(32px,4vw,56px)", maxWidth: 700 }}>
            <Ghost>12</Ghost>
            <div style={{ position: "relative" }}>
              <Kicker>Le projet</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(30px,4.2vw,56px)", lineHeight: 1.06, letterSpacing: "-0.014em", color: C.ink, margin: "20px 0 0" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "projet.titre") ?? (
                  <>
                    Petit par la taille,
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accent }}>grand par l'attention.</em>
                  </>
                )}
              </h2>
            </div>
          </div>
        </Reveal>

        <div className="i353-bento" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px,100%), 1fr))", gap: "clamp(14px,2vw,22px)" }}>
          {SERVICES.map((s, n) => (
            <ProjetTuile key={`${s.titre}-${n}`} s={s} n={n} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · ENGAGEMENTS — liste filetée sur fond pâle, pastille par ligne
   ════════════════════════════════════════════════════════════════════════════ */
function Engagements() {
  return (
    <section id="engagements" className="i353-pad" style={{ position: "relative", background: C.bgAlt, padding: "clamp(76px,10vw,136px) clamp(20px,5vw,64px)", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, ...pebbleTexture(0.06), pointerEvents: "none" }} />
      <div className="i353-split" style={{ position: "relative", maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,0.94fr) minmax(0,1.06fr)", gap: "clamp(30px,5vw,74px)", alignItems: "start" }}>
        <Reveal>
          <div>
            <Kicker>Nos engagements</Kicker>
            <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(28px,3.8vw,48px)", lineHeight: 1.07, letterSpacing: "-0.012em", color: C.ink, margin: "20px 0 22px" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                <>
                  Sérieux dedans,
                  <br />
                  <em style={{ fontStyle: "italic", color: C.accent }}>joyeux dehors.</em>
                </>
              )}
            </h2>
            <RoundButton href={`tel:${clientPhone(sessionData) ?? fd?.phone ?? "+33476000000"}`} filled>
              Nous appeler
            </RoundButton>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div>
            {ENGAGEMENT.map((e, n) => (
              <div key={n} style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: 16, alignItems: "start", padding: "18px 0", borderTop: n === 0 ? "none" : `1px solid ${C.border}` }}>
                <span style={{ width: 26, height: 26, borderRadius: 999, background: C.accentLight, color: C.accentDark, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: SANS, fontSize: 11.5, fontWeight: 700 }}>
                  {n + 1}
                </span>
                <span style={{ fontFamily: SANS, fontWeight: 300, fontSize: 15, lineHeight: 1.74, color: C.textMuted }}>{e}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · TARIFS & AIDES — bandes arrondies, le prix en pastille
   ════════════════════════════════════════════════════════════════════════════ */
function TarifBande({ t, n }: { t: any; n: number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={Math.min(n, 4) * 0.06}>
      <div
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        className="i353-tarif"
        style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: "clamp(14px,3vw,32px)", alignItems: "center", background: C.bgCard, borderRadius: 22, border: `1px solid ${h ? C.accent : C.border}`, padding: "clamp(18px,2.2vw,26px) clamp(20px,2.4vw,30px)", marginBottom: 12, transform: h ? "translateY(-3px)" : "none", boxShadow: h ? "0 26px 50px -34px rgba(23,37,29,0.4), 0 5px 14px -10px rgba(23,37,29,0.2)" : "0 6px 20px -20px rgba(23,37,29,0.28)", transition: `all .5s ${EASE_CSS}` }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: SERIF, fontSize: "clamp(19px,2vw,24px)", color: C.ink, lineHeight: 1.24 }}>{t.a}</div>
          <div style={{ fontFamily: SANS, fontWeight: 300, fontSize: 13.5, lineHeight: 1.68, color: C.textFaint, marginTop: 6 }}>{t.n}</div>
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: "clamp(15px,1.7vw,18px)", color: h ? C.white : C.accentDark, background: h ? C.accent : C.accentLight, borderRadius: 999, padding: "10px 20px", whiteSpace: "nowrap", transition: `all .5s ${EASE_CSS}` }}>
          {t.p}
        </div>
      </div>
    </Reveal>
  );
}

function Tarifs() {
  return (
    <section id="tarifs" className="i353-pad" style={{ background: C.bg, padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)" }}>
      <div style={{ maxWidth: 940, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "clamp(28px,4vw,46px)" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Kicker align="center">Tarifs & aides</Kicker>
            </div>
            <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(29px,4vw,52px)", lineHeight: 1.07, color: C.ink, margin: "20px 0 16px" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                <>Moins cher <em style={{ fontStyle: "italic", color: C.accent }}>qu'on ne le croit.</em></>
              )}
            </h2>
            <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 15, lineHeight: 1.76, color: C.textMuted, maxWidth: 560, margin: "0 auto" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.intro") ?? (
                <>
                  Le Complément de libre choix du Mode de Garde (CMG) de la CAF rembourse une large part
                  selon vos revenus. Simulation faite avec vous avant tout engagement.
                </>
              )}
            </p>
          </div>
        </Reveal>
        <div>
          {TARIFS.map((t, n) => (
            <TarifBande key={`${t.a}-${n}`} t={t} n={n} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · AVIS — colonnes décalées, une carte qui monte plus haut que l'autre
   ════════════════════════════════════════════════════════════════════════════ */
function Avis() {
  return (
    <section className="i353-pad" style={{ position: "relative", background: C.bgAlt, padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, ...pebbleTexture(0.07), pointerEvents: "none" }} />
      <div style={{ position: "relative", maxWidth: 1160, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "clamp(30px,4vw,52px)" }}>
            <Kicker align="center">{/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? "Des parents tranquilles"}</Kicker>
          </div>
        </Reveal>
        <div className="i353-avis" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px,100%), 1fr))", gap: "clamp(16px,2.4vw,26px)", alignItems: "start" }}>
          {AVIS.map((a, n) => (
            <Reveal key={`${a.auteur}-${n}`} delay={n * 0.09}>
              {/* Colonnes décalées : la rangée respire au lieu de s'aligner. */}
              <figure className="i353-avis-carte" style={{ margin: 0, marginTop: n % 3 === 1 ? "clamp(0px,4vw,54px)" : n % 3 === 2 ? "clamp(0px,2vw,26px)" : 0, background: C.bgCard, borderRadius: 28, border: `1px solid ${C.border}`, padding: "clamp(24px,2.8vw,34px)" }}>
                <span aria-hidden style={{ fontFamily: SERIF, fontSize: 46, lineHeight: 0.6, color: C.accent, opacity: 0.35, display: "block", marginBottom: 12 }}>“</span>
                <blockquote style={{ fontFamily: SANS, fontWeight: 300, fontSize: 15, lineHeight: 1.78, color: C.textMuted, margin: 0 }}>{a.texte}</blockquote>
                <figcaption style={{ borderTop: `1px solid ${C.border}`, marginTop: 20, paddingTop: 16 }}>
                  <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, color: C.ink }}>{a.auteur}</div>
                  <div style={{ fontFamily: SANS, fontSize: 11.5, letterSpacing: "0.16em", textTransform: "uppercase", color: C.accent, marginTop: 6 }}>{a.detail}</div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   10 · CONTACT
   ════════════════════════════════════════════════════════════════════════════ */
function Contact() {
  const tel = clientPhone(sessionData) ?? fd?.phone ?? "04 76 00 00 00";
  const telHref = `tel:${clientPhone(sessionData) ?? fd?.phone ?? "+33476000000"}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "inscription@petits-cairns.fr";

  return (
    <section id="contact" className="i353-pad" style={{ position: "relative", background: C.bg, padding: "clamp(76px,10vw,146px) clamp(20px,5vw,64px)", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: "auto -10% -50% -10%", height: "80%", background: "radial-gradient(45% 55% at 50% 60%, rgba(78,138,95,0.14), transparent 70%)", pointerEvents: "none" }} />
      <div className="i353-contact" style={{ position: "relative", maxWidth: 1060, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1.05fr) minmax(0,0.95fr)", gap: "clamp(30px,5vw,72px)", alignItems: "center" }}>
        <Reveal>
          <div>
            <Kicker>Visites le samedi</Kicker>
            <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(30px,4.2vw,56px)", lineHeight: 1.05, letterSpacing: "-0.015em", color: C.ink, margin: "20px 0 18px" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                <>
                  Venez voir le jardin,
                  <br />
                  <em style={{ fontStyle: "italic", color: C.accent }}>les enfants font le reste.</em>
                </>
              )}
            </h2>
            <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 16, lineHeight: 1.8, color: C.textMuted, maxWidth: 480, margin: "0 0 clamp(24px,3vw,34px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ?? (
                <>
                  Visites sur rendez-vous un samedi par mois. Pré-inscription par téléphone toute l'année —
                  les places de septembre partent au printemps.
                </>
              )}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <RoundButton href={telHref} filled>{tel}</RoundButton>
              <RoundButton href={`mailto:${mail}`}>Nous écrire</RoundButton>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div style={{ background: C.bgCard, borderRadius: 30, border: `1px solid ${C.border}`, padding: "clamp(26px,3vw,38px)" }}>
            {[
              { icon: <Phone size={16} strokeWidth={1.6} />, l: "Téléphone", v: tel },
              { icon: <Mail size={16} strokeWidth={1.6} />, l: "Courriel", v: mail },
              { icon: <MapPin size={16} strokeWidth={1.6} />, l: "La maison", v: clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "38000", "Grenoble") + ", Isère" },
              { icon: <Clock size={16} strokeWidth={1.6} />, l: "Ouverture", v: "Lun–Ven 7h30–18h30" },
            ].map((row, n) => (
              <div key={row.l} style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: 14, alignItems: "center", padding: "15px 0", borderTop: n === 0 ? "none" : `1px solid ${C.border}` }}>
                <span style={{ width: 38, height: 38, borderRadius: 999, background: C.accentLight, color: C.accentDark, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{row.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.28em", textTransform: "uppercase", color: C.textFaint, marginBottom: 5 }}>{row.l}</div>
                  <div style={{ fontFamily: SERIF, fontSize: 18, color: C.ink, wordBreak: "break-word" }}>{row.v}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   11 · PIED DE PAGE
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const nom = fd?.businessName ?? clientName(sessionData) ?? "Les Petits Cairns";
  const tel = clientPhone(sessionData) ?? fd?.phone ?? "04 76 00 00 00";
  return (
    <footer className="i353-pad" style={{ position: "relative", background: C.bgDarkAlt, color: "rgba(247,249,245,0.55)", padding: "clamp(50px,7vw,82px) clamp(20px,5vw,64px) 26px", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, ...pebbleTexture(0.08), pointerEvents: "none" }} />
      <div style={{ position: "relative", maxWidth: 1120, margin: "0 auto" }}>
        <div className="i353-footgrid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)", gap: "clamp(26px,4vw,60px)", paddingBottom: "clamp(26px,4vw,42px)" }}>
          <div>
            <div style={{ fontFamily: SERIF, fontSize: 25, color: C.accentLight, marginBottom: 12 }}>{nom}</div>
            <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 13.5, lineHeight: 1.8, margin: 0, maxWidth: 400 }}>
              {clientTrade(sessionData) ?? "Micro-crèche"} (12 places) · {clientCity(sessionData) ?? "Grenoble"}
              <br />
              Agrément PMI Isère — équipe diplômée petite enfance
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {[
              { icon: <MapPin size={13} strokeWidth={1.6} />, t: clientCodePostalVille(sessionData, "38000", "Grenoble") + ", Isère" },
              { icon: <Phone size={13} strokeWidth={1.6} />, t: tel },
              { icon: <Clock size={13} strokeWidth={1.6} />, t: "Lun–Ven 7h30–18h30" },
            ].map((row, n) => (
              <div key={n} style={{ display: "flex", gap: 11, alignItems: "center", fontFamily: SANS, fontSize: 13 }}>
                <span style={{ color: C.accentLight, display: "flex" }}>{row.icon}</span>
                {row.t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(247,249,245,0.1)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, fontFamily: SANS, fontSize: 11.5, color: "rgba(247,249,245,0.3)" }}>
          <span>
            © 2026 {nom} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
            {/* VILLE_PIED */}
            {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
          </span>
          <span>Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════════════ */
export default function PetitsCairnsPage() {
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

  /* Les variables de module d'abord : tout helper appelé plus bas les lit. */
  fd = session?.formData;
  c = session?.generatedContent;
  bp = session?.businessProfile;
  sessionData = session;
  brand = fd?.brandColor ?? null;
  if (brand) C = { ...C, accent: brand };

  /* Les blocs vivants, ré-évalués à chaque rendu. */
  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, n: number) => ({ ...SERVICES_SOURCE[n % SERVICES_SOURCE.length], titre: s.title })),
    SERVICES_SOURCE,
  );
  SERVICES = resolveList(
    clientServices(sessionData)?.map((s: any, n: number) => ({
      ...SERVICES_SOURCE[n % SERVICES_SOURCE.length],
      tag: SERVICES_SOURCE[n % SERVICES_SOURCE.length].tag,
      titre: s.title ?? SERVICES_SOURCE[n % SERVICES_SOURCE.length].titre,
      desc: s.description ?? s.desc ?? SERVICES_SOURCE[n % SERVICES_SOURCE.length].desc,
    })),
    SERVICES_DEMO,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, n: number) => ({ ...AVIS_SOURCE[n % AVIS_SOURCE.length], auteur: r.author, texte: r.text })),
    AVIS_SOURCE,
  );
  AVIS = resolveList(
    clientReviews(sessionData)?.map((r: any, n: number) => ({
      ...AVIS_DEMO[n % AVIS_DEMO.length],
      texte: r.text ?? AVIS_DEMO[n % AVIS_DEMO.length].texte,
      auteur: r.name ?? r.author ?? AVIS_DEMO[n % AVIS_DEMO.length].auteur,
      detail: r.location ?? r.role ?? AVIS_DEMO[n % AVIS_DEMO.length].detail,
    })),
    AVIS_DEMO,
  );
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s: any, n: number) => ({
      ...TARIFS_DEMO[n % TARIFS_DEMO.length],
      a: s.title,
      p: s.price ?? TARIFS_DEMO[n % TARIFS_DEMO.length].p,
      n: s.desc || TARIFS_DEMO[n % TARIFS_DEMO.length].n,
    })),
    TARIFS_DEMO,
  );
  METHODE = resolveList(
    clientList(sessionData, "journee.etapes")?.map((l: string, n: number) => ({ ...METHODE_DEMO[n % METHODE_DEMO.length], t: l })),
    METHODE_DEMO,
  );
  STATS = resolveList(clientStats(sessionData), STATS_DEMO);
  ENGAGEMENT = resolveList(
    clientList(sessionData, "engagements.liste") ?? clientCertifications(sessionData),
    ENGAGEMENT_DEMO,
  );

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip" }}>
      <style>{`
        ${FONTS_CSS}

        @media (max-width: 980px) {
          #i353-nav { display: none !important; }
          .i353-burger { display: flex !important; }
        }
        @media (max-width: 560px) { .i353-navtrade { display: none !important; } }

        /* Grilles à deux colonnes : media queries locales du thème.
           On ne compte pas sur app/templates/layout.tsx. */
        @media (max-width: 900px) {
          .i353-hero { grid-template-columns: minmax(0,1fr) !important; }
          .i353-scene { grid-template-columns: minmax(0,1fr) !important; }
          /* Les placements sont posés en style inline par ComposeIn :
             seul !important les défait. */
          .i353-scene > * { grid-column: auto !important; grid-row: auto !important; }
          .i353-galet { min-height: 240px; }
          .i353-journee { grid-template-columns: minmax(0,1fr) !important; }
          .i353-split { grid-template-columns: minmax(0,1fr) !important; }
          .i353-contact { grid-template-columns: minmax(0,1fr) !important; }
          .i353-footgrid { grid-template-columns: minmax(0,1fr) !important; }
          /* Les colonnes décalées se réalignent : le décalage n'a de sens
             que sur une vraie rangée. */
          .i353-avis-carte { margin-top: 0 !important; }
        }
        /* Bento : tuiles inégales seulement quand la largeur le permet.
           Les enfants ciblés sont les enveloppes de révélation, pas les
           cartes — c'est l'enveloppe qui est l'élément de grille. */
        @media (min-width: 1000px) {
          .i353-bento { grid-template-columns: repeat(6, minmax(0,1fr)) !important; }
          .i353-bento > * { grid-column: span 3; }
          .i353-bento > *:nth-child(1), .i353-bento > *:nth-child(4) { grid-column: span 4; }
          .i353-bento > *:nth-child(2), .i353-bento > *:nth-child(3) { grid-column: span 2; }
          .i353-bento > *:nth-child(5), .i353-bento > *:nth-child(6) { grid-column: span 3; }
        }
        @media (max-width: 700px) {
          .i353-tarif { grid-template-columns: minmax(0,1fr) !important; row-gap: 12px; justify-items: start; }
          .i353-rond { max-width: 260px; }
        }
        @media (max-width: 480px) {
          .i353-pad { padding-left: 20px !important; padding-right: 20px !important; }
        }

        /* La lueur dérive lentement — et s'arrête si le système le demande. */
        @keyframes i353-derive {
          0%   { transform: translate3d(-3%, 0, 0) scale(1); }
          50%  { transform: translate3d(6%, 3%, 0) scale(1.08); }
          100% { transform: translate3d(-3%, 0, 0) scale(1); }
        }
        .i353-derive { animation: i353-derive 28s ${EASE_CSS} infinite; }
        @media (prefers-reduced-motion: reduce) {
          .i353-derive { animation: none !important; }
        }
      `}</style>

      <Nav />
      <Hero />
      <Respiration />
      <Journee />
      <Chiffres />
      <Projet />
      <Engagements />
      <Tarifs />
      <Avis />
      <Contact />
      <Footer />
    </div>
  );
}
