"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Baby, Clock, Mail, MapPin, Moon, Phone, Quote, Sun } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { ScrollGrow } from "@/lib/templates/hero-kit-3";
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
   LE NID DOUILLET — Crèche associative cocon · Reims

   Archétype H4 « éditorial décalé » : le titre court déborde sur un panneau
   média posé plus bas à droite. Geste de signature UNIQUE : ScrollGrow — le
   titre grandit au défilement, comme l'enfant qu'on regarde pousser.

   Les voisins de geste (impact-352 couvreur, impact-377 école de musique)
   s'en séparent par l'archétype (magazine H7, rail H5), la paire de fontes et
   l'amplitude : ici 1 → 1.42, la plus ample des trois — un titre de deux mots
   peut se permettre de grandir beaucoup.

   Le proxy bloque Unsplash et Pexels : la seule adresse d'image du thème est
   conservée telle quelle, l'autre emplacement est peint en CSS (lune, laine)
   et tient debout sans photographie.
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

/* ── Fontes — serif de lecture à l'ancienne / grotesque très ronde ────────── */
const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&family=Manrope:wght@300;400;500;600;700&display=swap');`;

const SERIF = "'Newsreader', Georgia, 'Times New Roman', serif";
const SANS = "'Manrope', system-ui, -apple-system, sans-serif";

/* ── Easing unique du thème, répété littéralement en CSS ──────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

/* ── Palette peau et rosé — le cocon ─────────────────────────────────────── */
let C: Record<string, string> = {
  bg: "#faf5f3",
  bgAlt: "#f3e9e6",
  bgDark: "#2b1d21",
  bgDarkAlt: "#221619",
  bgCard: "#ffffff",
  accent: "var(--brand, #c26565)",
  accentDark: "var(--brand-light, #9d4747)",
  accentLight: "#f6dede",
  ink: "#2b1d21",
  textMuted: "#6d5a5c",
  textFaint: "#a08a8c",
  border: "#ecdcd9",
  white: "#ffffff",
  /* Clé métier : la peau — pour les aplats organiques du cocon. */
  peau: "#e8b4a8",
};

/* ── Photos : l'adresse du client d'abord, celle du thème ensuite ─────────── */
function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* La seule photographie du thème, conservée telle quelle. */
const PHOTO_LECTURE =
  "https://images.pexels.com/photos/1741230/pexels-photo-1741230.jpeg?auto=compress&cs=tinysrgb&w=1400";

/* ── Contenus de démonstration ───────────────────────────────────────────── */
const NAV = [
  { l: "Le projet", h: "#services" },
  { l: "Une journée", h: "#methode" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

const HERO_DEMO = {
  l1: "Ils grandissent vite.",
  l2: "Nous, on prend le temps.",
  sub: "Vingt places, une association de parents, une équipe qui reste : la crèche comme une deuxième maison, où le doudou a droit de cité et où les parents ont les clés — littéralement.",
  legende: "L'heure de l'histoire, tous les jours à 16 h 30.",
};

function SERVICES_SOURCE_LIVE() {
  return [
    { tag: "Associatif", titre: "Gestion parentale", desc: "La crèche est une association de parents : vous participez aux décisions, aux permanences (2 h/mois) et à la vie de la maison. C'est exigeant, et ça change tout." },
    { tag: "Rythme", titre: "Trois groupes d'âge", desc: "Bébés, moyens, grands : des espaces dédiés, des passerelles douces entre groupes quand l'enfant est prêt — pas quand la date l'exige." },
    { tag: "Sommeil", titre: "Sommeil respecté", desc: "Chambres calmes, rituels individuels, jamais de réveil forcé. Le sommeil du tout-petit est sacré, le planning s'adapte." },
    { tag: "Cuisine", titre: "Repas maison", desc: "Cuisinière salariée de l'association, produits locaux, purées du jour. Les parents goûtent au café mensuel — et redemandent la recette." },
    { tag: "Inclusion", titre: "Accueil de l'enfant différent", desc: "Handicap, PAI, besoins spécifiques : accueil réfléchi en équipe avec la PMI et les familles, renforts dédiés quand il faut." },
    { tag: "Parents", titre: "Ateliers parents", desc: "Portage, signes avec bébé, sommeil : des soirées animées par des pros, ouvertes aussi au quartier." },
  ];
}
let SERVICES_SOURCE = SERVICES_SOURCE_LIVE();
let SERVICES_DEMO = SERVICES_SOURCE;
let SERVICES = SERVICES_SOURCE;

/* La journée : une chronologie à heures, pas des cartes. */
const METHODE_DEMO = [
  { n: "7 h", t: "Accueil individualisé", d: "Dès 7 h pour les lève-tôt. Le doudou, la tétine et les habitudes de la maison sont les bienvenus." },
  { n: "Matin", t: "Jeux et découvertes", d: "Ateliers libres, jardin d'hiver, sorties au square : chaque groupe vit à son rythme." },
  { n: "Midi", t: "Repas et siestes", d: "Cuisinés sur place, siestes à la demande dans des chambres séparées des espaces de jeu." },
  { n: "Le soir", t: "On se parle", d: "Transmissions orales complètes, cahier de vie illustré chaque semaine — pas d'appli qui remplace les visages." },
];
let METHODE = METHODE_DEMO;

const ENGAGEMENT_DEMO = [
  "Agrément PMI de la Marne, 20 places, contrôles réguliers",
  "Tarification PSU de la CAF : le prix dépend de vos revenus, pas de notre grille",
  "Équipe diplômée et stable — ancienneté moyenne de 9 ans",
  "Conseil d'administration de parents élus : les comptes sont ouverts",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

const TARIFS_DEMO = [
  { a: "Tarif horaire PSU", p: "0,20–3,71 €/h", n: "Selon barème CAF national, calculé à l'inscription, repas et couches inclus." },
  { a: "Adhésion association", p: "30 €/an", n: "Par famille — donne voix aux assemblées et aux décisions." },
  { a: "Permanences parents", p: "2 h/mois", n: "Bricolage, courses, comptes : la contribution qui fait tenir la maison." },
  { a: "Frais de dossier", p: "0 €", n: "L'inscription et l'adaptation ne se facturent pas." },
];
let TARIFS = TARIFS_DEMO;

const AVIS_SOURCE = [
  { texte: "Trois enfants passés ici en dix ans. La même directrice, presque la même équipe : cette stabilité-là ne s'achète pas, elle se construit — et on y participe.", auteur: "Famille Lambert", detail: "Parents adhérents depuis 2016" },
  { texte: "Notre fils porteur de trisomie est accueilli comme les autres, avec ce qu'il faut en plus. Les autres enfants grandissent avec lui — tout le monde y gagne.", auteur: "Parents d'Élio", detail: "Accueil inclusif" },
  { texte: "Le tarif PSU nous coûte moins cher qu'une nounou, pour une amplitude 7h-19h. Et les permanences du samedi ont fait de nous des amis des autres parents.", auteur: "Chloé & Maxence", detail: "PSU + vie associative" },
];
let AVIS_DEMO = AVIS_SOURCE;
let AVIS = AVIS_SOURCE;

const STATS_DEMO = [
  { value: "20", label: "Places en trois groupes d'âge" },
  { value: "7h–19h", label: "L'amplitude des parents qui bossent" },
  { value: "1983", label: "L'association, depuis" },
  { value: "PSU", label: "Tarif CAF selon revenus" },
];
let STATS = STATS_DEMO;

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

/** Révélation au défilement, une seule fois. */
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
      ref={ref}
      style={style}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Kicker : filet 40 × 1 px puis capitales rondes à interlettrage large. */
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
      style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: align === "center" ? "center" : "flex-start" }}
    >
      <span style={{ width: 40, height: 1, background: color, opacity: 0.75, flexShrink: 0 }} />
      <span
        style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.34em", textTransform: "uppercase", color, fontWeight: 700 }}
      >
        {children}
      </span>
      {align === "center" && (
        <span style={{ width: 40, height: 1, background: color, opacity: 0.75, flexShrink: 0 }} />
      )}
    </div>
  );
}

/** Nuage de laine — deux radiaux très doux, la texture du cocon, sans image. */
function laine(opacity = 0.5) {
  return {
    backgroundImage: `radial-gradient(42% 52% at 24% 30%, rgba(232,180,168,${opacity * 0.34}), transparent 70%), radial-gradient(50% 60% at 78% 72%, rgba(194,101,101,${opacity * 0.16}), transparent 72%)`,
  } as React.CSSProperties;
}

/** Mot fantôme posé en marge, en italique de lecture. */
function Ghost({
  children,
  right = false,
  size = "clamp(110px, 18vw, 260px)",
}: {
  children: React.ReactNode;
  right?: boolean;
  size?: string;
}) {
  return (
    <span
      aria-hidden
      style={{ position: "absolute", top: "-0.18em", [right ? "right" : "left"]: "-0.05em", fontFamily: SERIF, fontStyle: "italic", fontSize: size, lineHeight: 0.8, color: C.peau, opacity: 0.14, pointerEvents: "none", userSelect: "none" }}
    >
      {children}
    </span>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   1 · NAV — collante à cinq propriétés, arrondie comme le reste
   ════════════════════════════════════════════════════════════════════════════ */
function NavLink({ label, href, onClick }: { label: string; href: string; onClick?: () => void }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ position: "relative", fontFamily: SANS, fontSize: 12.5, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, color: h ? C.accent : C.textMuted, textDecoration: "none", padding: "13px 2px", transition: `color .45s ${EASE_CSS}`, display: "inline-block", minHeight: 44 }}
    >
      {label}
      <span
        style={{ position: "absolute", left: 0, bottom: 8, height: 2, borderRadius: 2, width: h ? "100%" : "0%", background: C.accent, transition: `width .5s ${EASE_CSS}` }}
      />
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

  const tel = `tel:${clientPhone(sessionData) ?? fd?.phone ?? "+33326000000"}`;

  return (
    <>
      <nav
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: solid ? "10px clamp(20px,5vw,56px)" : "22px clamp(20px,5vw,56px)", background: solid ? "rgba(250,245,243,0.93)" : "transparent", backdropFilter: solid ? "blur(14px) saturate(140%)" : "none", WebkitBackdropFilter: solid ? "blur(14px) saturate(140%)" : "none", borderBottom: `1px solid ${solid ? C.border : "transparent"}`, boxShadow: solid ? "0 12px 34px -28px rgba(43,29,33,0.5)" : "none", transition: `all .55s ${EASE_CSS}` }}
      >
        <a href="#top" style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0, textDecoration: "none" }}>
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? "logo"}
              style={{ height: 32, maxWidth: 168, objectFit: "contain", display: "block" }}
            />
          ) : (
            <>
              <Baby size={19} color={C.accent} strokeWidth={1.5} style={{ flexShrink: 0 }} />
              <span
                style={{ fontFamily: SERIF, fontSize: 21, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {fd?.businessName ?? clientName(sessionData) ?? "Le Nid Douillet"}
              </span>
              <span
                className="i354-navtrade"
                style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textFaint, marginLeft: 4, whiteSpace: "nowrap", fontWeight: 600 }}
              >
                {clientTrade(sessionData) ?? "Crèche associative"}
              </span>
            </>
          )}
        </a>

        <div id="i354-nav" style={{ display: "flex", gap: "clamp(14px,2vw,28px)", alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <NavLink key={l} label={l} href={h} />
          ))}
          <a
            href={tel}
            onMouseEnter={() => setHCta(true)}
            onMouseLeave={() => setHCta(false)}
            style={{ fontFamily: SANS, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, padding: "13px 24px", minHeight: 44, display: "inline-flex", alignItems: "center", background: hCta ? C.accentDark : C.accent, color: C.white, borderRadius: 999, textDecoration: "none", whiteSpace: "nowrap", boxShadow: hCta ? "0 16px 30px -18px rgba(157,71,71,0.8)" : "0 6px 16px -14px rgba(157,71,71,0.65)", transform: hCta ? "translateY(-2px)" : "none", transition: `all .5s ${EASE_CSS}` }}
          >
            Demander une place
          </a>
        </div>

        <button
          className="i354-burger"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: `transform .35s ${EASE_CSS}`, transform: open ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, opacity: open ? 0 : 1, transition: "opacity .3s" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: `transform .35s ${EASE_CSS}`, transform: open ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>

      {open && (
        <div
          style={{ position: "fixed", top: 66, left: 0, right: 0, zIndex: 99, background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "16px clamp(20px,5vw,56px) 24px", display: "flex", flexDirection: "column", gap: 2 }}
        >
          {NAV.map(({ l, h }) => (
            <NavLink key={l} label={l} href={h} onClick={() => setOpen(false)} />
          ))}
          <a
            href={tel}
            style={{ marginTop: 12, background: C.accent, color: C.white, padding: "15px 22px", minHeight: 44, borderRadius: 999, fontFamily: SANS, fontSize: 12.5, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, textAlign: "center", textDecoration: "none" }}
          >
            Demander une place
          </a>
        </div>
      )}
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2 · HÉROS — H4 éditorial décalé : le titre court (ScrollGrow, 1 → 1.42)
       déborde sur le panneau média posé plus bas à droite.
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const [hTitle, setHTitle] = useState(false);
  const img = photo(0, PHOTO_LECTURE);

  const l1 = clientHeroLine(sessionData, 0, 2, 20) ?? HERO_DEMO.l1;
  const l2 = clientHeroLine(sessionData, 1, 2, 20) ?? HERO_DEMO.l2;
  const sub = clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? HERO_DEMO.sub;

  return (
    <section
      id="top"
      style={{ position: "relative", background: C.bg, padding: "clamp(116px,14vw,170px) clamp(20px,5vw,60px) clamp(56px,7vw,96px)", overflow: "hidden", ...laine(0.8) }}
    >
      <div className="i354-heroGrid" style={{ position: "relative", maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1.06fr) minmax(0,0.94fr)", columnGap: "clamp(20px,3vw,44px)" }}>
        {/* ── Colonne titre — elle déborde volontairement sur le panneau ── */}
        <div className="i354-heroText" style={{ position: "relative", zIndex: 2, paddingTop: "clamp(6px,2vw,30px)" }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease: EASE, delay: 0.08 }}>
            <Kicker>{clientEyebrow(sessionData) ?? `Crèche associative · ${clientCity(sessionData) ?? "Reims"}`}</Kicker>
          </motion.div>

          <ScrollGrow from={1} to={1.42} fade>
            <motion.h1
              className="i354-h1"
              onMouseEnter={() => setHTitle(true)}
              onMouseLeave={() => setHTitle(false)}
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.05, ease: EASE, delay: 0.18 }}
              style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(2.5rem,6.8vw,6.2rem)", lineHeight: 1.02, letterSpacing: "-0.015em", color: C.ink, margin: "clamp(22px,3.4vw,44px) 0 clamp(18px,2.4vw,30px)", marginRight: "-24%", maxWidth: "none", cursor: "default", transformOrigin: "0% 50%" }}
            >
              {l1}
              <br />
              <em style={{ fontStyle: "italic", color: hTitle ? C.accentDark : C.accent, transition: `color .5s ${EASE_CSS}` }}>
                {l2}
              </em>
            </motion.h1>
          </ScrollGrow>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.34 }}
            style={{ fontFamily: SANS, fontWeight: 400, fontSize: "clamp(15px,1.45vw,17.5px)", lineHeight: 1.78, color: C.textMuted, maxWidth: 460, margin: "0 0 clamp(24px,3vw,36px)" }}
          >
            {sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.46 }}
            style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
          >
            <PillButton href={`tel:${clientPhone(sessionData) ?? fd?.phone ?? "+33326000000"}`} filled>
              Rencontrer l'équipe
            </PillButton>
            <PillButton href="#services">Notre projet</PillButton>
          </motion.div>

          {/* Rail de repères sous les boutons — les chiffres du cocon. */}
          <motion.div
            className="i354-heroStats"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}
            style={{ display: "flex", gap: "clamp(20px,3vw,40px)", flexWrap: "wrap", marginTop: "clamp(30px,4vw,52px)", paddingTop: 20, borderTop: `1px solid ${C.border}`, maxWidth: 480 }}
          >
            {STATS.slice(0, 3).map((s, i) => (
              <div key={`${s.label}-${i}`} style={{ minWidth: 0 }}>
                <div style={{ fontFamily: SERIF, fontSize: "clamp(21px,2.2vw,28px)", color: C.accentDark, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontFamily: SANS, fontSize: 11.5, lineHeight: 1.5, color: C.textFaint, marginTop: 6, maxWidth: 150 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Panneau média décalé vers le bas — le titre passe dessus ──── */}
        <motion.div
          className="i354-panel"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
          style={{ position: "relative", zIndex: 1, marginTop: "clamp(64px,10vw,150px)" }}
        >
          {/* Bande de recouvrement : un aplat calme sous la queue du titre. */}
          <div aria-hidden style={{ height: "clamp(24px,3vw,44px)", background: "transparent" }} />
          <figure style={{ position: "relative", margin: 0, borderRadius: "clamp(18px,2.4vw,30px) clamp(18px,2.4vw,30px) 120px clamp(18px,2.4vw,30px)", overflow: "hidden", background: C.bgDark, boxShadow: "0 40px 90px -50px rgba(43,29,33,0.55), 0 10px 30px -22px rgba(43,29,33,0.3)" }}>
            <div style={{ aspectRatio: "4/5", position: "relative" }}>
              {img ? (
                <img
                  src={img}
                  alt={`${fd?.businessName ?? clientName(sessionData) ?? "Le Nid Douillet"} — lecture partagée avec un enfant`}
                  loading="eager"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : (
                <div
                  style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, background: `linear-gradient(195deg, rgba(232,180,168,0.5), rgba(43,29,33,0.9))` }}
                >
                  <Moon size={52} color={C.accentLight} strokeWidth={0.9} />
                  <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(250,245,243,0.7)", fontWeight: 600 }}>
                    L'heure du calme
                  </span>
                </div>
              )}
              <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(43,29,33,0.62) 0%, rgba(43,29,33,0.06) 44%, rgba(43,29,33,0.12) 100%)" }} />
              {/* Cartouche de légende — le détail du magazine de famille. */}
              <figcaption style={{ position: "absolute", left: "clamp(16px,2.4vw,28px)", right: "clamp(16px,2.4vw,28px)", bottom: "clamp(16px,2.4vw,26px)" }}>
                <div style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(250,245,243,0.62)", marginBottom: 8, fontWeight: 600 }}>
                  Grandir accompagné
                </div>
                <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(16px,1.8vw,22px)", lineHeight: 1.36, color: "rgba(250,245,243,0.96)", margin: 0, textShadow: "0 8px 30px rgba(0,0,0,0.5)" }}>
                  {/* TEXTE_SECTION */ clientText(sessionData, "heros.legende") ?? (
                    <>{HERO_DEMO.legende}</>
                  )}
                </p>
              </figcaption>
            </div>
          </figure>
          {/* Pastille soleil — le détail gratuit, qui tourne douze fois plus lentement qu'une horloge. */}
          <div
            aria-hidden
            className="i354-soleil"
            style={{ position: "absolute", top: "clamp(6px,1vw,16px)", right: "clamp(-14px,-1vw,-8px)", width: 74, height: 74, borderRadius: "50%", background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 30px -18px rgba(157,71,71,0.5)" }}
          >
            <Sun size={30} color={C.accentDark} strokeWidth={1.2} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PillButton({
  children,
  href,
  filled = false,
}: {
  children: React.ReactNode;
  href: string;
  filled?: boolean;
}) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 28px", minHeight: 44, borderRadius: 999, fontFamily: SANS, fontSize: 12.5, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, border: `1px solid ${filled ? "transparent" : C.border}`, background: filled ? (h ? C.accentDark : C.accent) : h ? C.bgAlt : "transparent", color: filled ? C.white : C.ink, textDecoration: "none", transform: h ? "translateY(-2px)" : "none", boxShadow: h ? "0 20px 38px -24px rgba(157,71,71,0.6), 0 3px 10px -6px rgba(43,29,33,0.22)" : "0 0 0 rgba(0,0,0,0)", transition: `all .5s ${EASE_CSS}` }}
    >
      {children}
      <ArrowRight size={14} style={{ transform: h ? "translateX(5px)" : "none", transition: `transform .5s ${EASE_CSS}` }} />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3 · RESPIRATION — une phrase, un filet, rien d'autre
   ════════════════════════════════════════════════════════════════════════════ */
function Respiration() {
  return (
    <section style={{ background: C.bg, padding: "clamp(72px,10vw,140px) clamp(24px,8vw,180px)", textAlign: "center" }}>
      <Reveal>
        <p
          style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(21px,3vw,40px)", lineHeight: 1.38, color: C.ink, maxWidth: 860, margin: "0 auto" }}
        >
          {/* TEXTE_SECTION */ clientText(sessionData, "respiration.texte") ?? (
            <>Chaque enfant a son rythme — c'est le nôtre aussi.</>
          )}
        </p>
      </Reveal>
      <Reveal delay={0.12}>
        <div style={{ width: 1, height: 78, background: `linear-gradient(${C.accent}, transparent)`, margin: "clamp(30px,4.4vw,54px) auto 0" }} />
      </Reveal>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4 · LE PROJET — galets : cartes très arrondies, décalées en quinconce
   ════════════════════════════════════════════════════════════════════════════ */
function Galet({ s, i }: { s: any; i: number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={Math.min(i, 4) * 0.06} style={{ height: "100%" }}>
      <article
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        className="i354-galet"
        style={{ height: "100%", background: h ? C.bgCard : "rgba(255,255,255,0.66)", border: `1px solid ${h ? C.accentLight : C.border}`, borderRadius: i % 2 === 0 ? "26px 26px 26px 72px" : "26px 26px 72px 26px", padding: "clamp(24px,2.6vw,34px) clamp(22px,2.4vw,30px)", transform: h ? "translateY(-6px)" : i % 2 === 1 ? "translateY(clamp(0px,2vw,26px))" : "none", boxShadow: h ? "0 34px 64px -42px rgba(157,71,71,0.5), 0 6px 18px -12px rgba(43,29,33,0.2)" : "0 10px 30px -26px rgba(43,29,33,0.35)", transition: `all .5s ${EASE_CSS}`, cursor: "default" }}
      >
        <span
          style={{ display: "inline-block", fontFamily: SANS, fontSize: 10, letterSpacing: "0.26em", textTransform: "uppercase", fontWeight: 700, color: h ? C.accentDark : C.textFaint, background: h ? C.accentLight : C.bgAlt, borderRadius: 999, padding: "6px 14px", transition: `all .5s ${EASE_CSS}` }}
        >
          {s.tag}
        </span>
        <h3 style={{ fontFamily: SERIF, fontSize: "clamp(20px,2.1vw,26px)", fontWeight: 500, lineHeight: 1.2, color: C.ink, margin: "16px 0 10px" }}>
          {s.titre}
        </h3>
        <p style={{ fontFamily: SANS, fontWeight: 400, fontSize: 14.5, lineHeight: 1.74, color: C.textMuted, margin: 0 }}>
          {s.desc}
        </p>
      </article>
    </Reveal>
  );
}

function Services() {
  return (
    <section id="services" className="i354-pad" style={{ position: "relative", background: C.bgAlt, padding: "clamp(76px,10vw,136px) clamp(20px,5vw,60px)", overflow: "hidden" }}>
      <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ position: "relative", marginBottom: "clamp(36px,5vw,64px)", maxWidth: 700 }}>
            <Ghost>a</Ghost>
            <div style={{ position: "relative" }}>
              <Kicker>Le projet</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(29px,4.2vw,54px)", lineHeight: 1.06, letterSpacing: "-0.012em", color: C.ink, margin: "22px 0 0" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "projet.titre") ?? (
                  <>
                    Une crèche
                    <br />
                    <em style={{ color: C.accent }}>qui appartient aux familles.</em>
                  </>
                )}
              </h2>
            </div>
          </div>
        </Reveal>

        <div className="i354-galets" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px,100%),1fr))", gap: "clamp(16px,2vw,24px)", alignItems: "stretch" }}>
          {SERVICES.map((s, i) => (
            <Galet key={`${s.titre}-${i}`} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5 · UNE JOURNÉE — chronologie à heures sur un fil pointillé
   ════════════════════════════════════════════════════════════════════════════ */
function Journee() {
  return (
    <section id="methode" className="i354-pad" style={{ position: "relative", background: C.bg, padding: "clamp(76px,10vw,140px) clamp(20px,5vw,60px)", overflow: "hidden", ...laine(0.55) }}>
      <div style={{ position: "relative", maxWidth: 1080, margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: "clamp(36px,5vw,62px)", maxWidth: 660 }}>
            <Kicker>Une journée</Kicker>
            <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(28px,4vw,52px)", lineHeight: 1.06, letterSpacing: "-0.012em", color: C.ink, margin: "22px 0 0" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "journee.titre") ?? (
                <>
                  Douce pour eux,
                  <br />
                  <em style={{ color: C.accent }}>simple pour vous.</em>
                </>
              )}
            </h2>
          </div>
        </Reveal>

        {/* Le fil de la journée : un trait pointillé qui relie les heures. */}
        <div style={{ position: "relative", paddingLeft: "clamp(26px,3vw,40px)" }}>
          <div
            aria-hidden
            style={{ position: "absolute", left: "clamp(7px,1vw,13px)", top: 14, bottom: 26, width: 0, borderLeft: `2px dotted ${C.peau}` }}
          />
          {METHODE.map((m, i) => (
            <Reveal key={`${m.n}-${i}`} delay={i * 0.08}>
              <div className="i354-heure" style={{ position: "relative", display: "grid", gridTemplateColumns: "minmax(0,0.85fr) minmax(0,1.75fr)", gap: "clamp(14px,3vw,44px)", alignItems: "start", padding: "clamp(20px,2.4vw,30px) 0" }}>
                <span
                  aria-hidden
                  style={{ position: "absolute", left: "clamp(-26px,-3vw,-34px)", top: "clamp(26px,3vw,36px)", width: 11, height: 11, borderRadius: "50%", background: C.accent, boxShadow: `0 0 0 5px ${C.accentLight}` }}
                />
                <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(21px,2.4vw,30px)", color: C.accentDark, lineHeight: 1 }}>
                    {m.n}
                  </span>
                  <h3 style={{ fontFamily: SANS, fontSize: 15.5, fontWeight: 700, lineHeight: 1.3, color: C.ink, margin: 0 }}>
                    {m.t}
                  </h3>
                </div>
                <p style={{ fontFamily: SANS, fontWeight: 400, fontSize: 14.5, lineHeight: 1.76, color: C.textMuted, maxWidth: 520, margin: 0 }}>
                  {m.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6 · ENGAGEMENTS — panneau lune + liste numérotée filetée
   ════════════════════════════════════════════════════════════════════════════ */
function Engagements() {
  const img = photo(1, "");
  return (
    <section id="engagements" className="i354-pad" style={{ background: C.bgAlt, padding: "clamp(76px,10vw,136px) clamp(20px,5vw,60px)" }}>
      <div className="i354-split" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,0.9fr) minmax(0,1.1fr)", gap: "clamp(30px,5vw,72px)", alignItems: "center" }}>
        <Reveal>
          <div style={{ position: "relative", aspectRatio: "4/5", borderRadius: "120px 26px 26px 26px", overflow: "hidden", background: C.bgDark }}>
            {img ? (
              <img
                src={img}
                alt="La chambre des tout-petits, prête pour la sieste"
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, background: `linear-gradient(200deg, rgba(232,180,168,0.42), rgba(34,22,25,0.92))` }}>
                <Moon size={56} color={C.accentLight} strokeWidth={0.9} />
                <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(250,245,243,0.66)", fontWeight: 600, textAlign: "center", padding: "0 18px" }}>
                  Jamais de réveil forcé
                </span>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div>
            <Kicker>Nos engagements</Kicker>
            <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(26px,3.5vw,44px)", lineHeight: 1.08, letterSpacing: "-0.01em", color: C.ink, margin: "22px 0 clamp(20px,3vw,32px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                <>
                  Du sérieux,
                  <br />
                  <em style={{ color: C.accent }}>et de la tendresse.</em>
                </>
              )}
            </h2>
            <div>
              {ENGAGEMENT.map((e, i) => (
                <div
                  key={i}
                  style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: 16, alignItems: "start", padding: "15px 0", backgroundImage: i === 0 ? "none" : `linear-gradient(90deg, ${C.border}, transparent)`, backgroundSize: "100% 1px", backgroundRepeat: "no-repeat", backgroundPosition: "top left" }}
                >
                  <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 19, color: C.accent, lineHeight: 1.2, paddingTop: 1 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontFamily: SANS, fontWeight: 400, fontSize: 15, lineHeight: 1.7, color: C.textMuted }}>
                    {e}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 26 }}>
              <PillButton href={`tel:${clientPhone(sessionData) ?? fd?.phone ?? "+33326000000"}`} filled>
                Nous appeler
              </PillButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   7 · TARIFS — le barème CAF en lignes arrondies
   ════════════════════════════════════════════════════════════════════════════ */
function TarifRow({ t, i }: { t: any; i: number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={Math.min(i, 4) * 0.06}>
      <div
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        className="i354-tarif"
        style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: "clamp(14px,3vw,36px)", alignItems: "baseline", background: h ? C.bgCard : "rgba(255,255,255,0.6)", border: `1px solid ${h ? C.accentLight : C.border}`, borderRadius: 20, padding: "clamp(18px,2.2vw,26px) clamp(20px,2.4vw,30px)", marginBottom: 12, transform: h ? "translateY(-3px)" : "none", boxShadow: h ? "0 28px 54px -42px rgba(157,71,71,0.5), 0 4px 14px -10px rgba(43,29,33,0.18)" : "0 0 0 rgba(0,0,0,0)", transition: `all .5s ${EASE_CSS}` }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: SERIF, fontSize: "clamp(18px,1.9vw,23px)", fontWeight: 500, color: C.ink, lineHeight: 1.24 }}>{t.a}</div>
          <div style={{ fontFamily: SANS, fontWeight: 400, fontSize: 13.5, lineHeight: 1.66, color: C.textFaint, marginTop: 6, maxWidth: 560 }}>{t.n}</div>
        </div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(18px,2vw,24px)", color: h ? C.accentDark : C.accent, whiteSpace: "nowrap", transition: `color .5s ${EASE_CSS}` }}>
          {t.p}
        </div>
      </div>
    </Reveal>
  );
}

function Tarifs() {
  return (
    <section id="tarifs" className="i354-pad" style={{ position: "relative", background: C.bg, padding: "clamp(76px,10vw,140px) clamp(20px,5vw,60px)", overflow: "hidden" }}>
      <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
        <Reveal>
          <div style={{ position: "relative", marginBottom: "clamp(28px,4vw,48px)" }}>
            <Ghost right>€</Ghost>
            <div style={{ position: "relative" }}>
              <Kicker>Tarifs</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(28px,4vw,50px)", lineHeight: 1.06, letterSpacing: "-0.012em", color: C.ink, margin: "22px 0 14px", maxWidth: 620 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                  <>
                    Le barème CAF, <em style={{ color: C.accent }}>rien d'autre.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontWeight: 400, fontSize: 15, lineHeight: 1.76, color: C.textMuted, maxWidth: 540, margin: 0 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.intro") ?? (
                  <>
                    En PSU, votre tarif horaire est calculé par la CAF selon vos revenus et votre famille — de
                    0,20 € à 3,71 €/h en 2026. L'association n'ajoute rien.
                  </>
                )}
              </p>
            </div>
          </div>
        </Reveal>

        <div>
          {TARIFS.map((t, i) => (
            <TarifRow key={`${t.a}-${i}`} t={t} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   8 · AVIS — colonnes décalées sur fond sombre, la parole des familles
   ════════════════════════════════════════════════════════════════════════════ */
function AvisCarte({ a, i }: { a: any; i: number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={i * 0.09} style={{ height: "100%" }}>
      <figure
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        className="i354-avis"
        style={{ height: "100%", margin: 0, background: h ? "rgba(255,255,255,0.075)" : "rgba(255,255,255,0.045)", border: `1px solid ${h ? "rgba(232,180,168,0.4)" : "rgba(255,255,255,0.1)"}`, borderRadius: i % 2 === 0 ? "22px 22px 22px 64px" : "22px 22px 64px 22px", padding: "clamp(24px,2.6vw,34px)", transform: `translateY(${i % 3 === 1 ? "clamp(0px,2.4vw,34px)" : i % 3 === 2 ? "clamp(0px,1.2vw,17px)" : "0px"}) ${h ? "translateY(-5px)" : ""}`, boxShadow: h ? "0 30px 60px -44px rgba(0,0,0,0.7)" : "none", transition: `all .5s ${EASE_CSS}` }}
      >
        <Quote size={22} color={C.peau} strokeWidth={1.2} style={{ opacity: 0.85, marginBottom: 14 }} />
        <blockquote style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(15.5px,1.5vw,18px)", lineHeight: 1.66, color: "rgba(250,245,243,0.9)", margin: "0 0 18px" }}>
          « {a.texte} »
        </blockquote>
        <figcaption style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 14 }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, color: C.white, fontSize: 13.5 }}>{a.auteur}</div>
          <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: C.peau, marginTop: 6, fontWeight: 600 }}>
            {a.detail}
          </div>
        </figcaption>
      </figure>
    </Reveal>
  );
}

function Avis() {
  return (
    <section className="i354-pad" style={{ position: "relative", background: C.bgDark, padding: "clamp(76px,10vw,144px) clamp(20px,5vw,60px)", overflow: "hidden" }}>
      <div
        aria-hidden
        style={{ position: "absolute", inset: "-30% -10% auto 30%", height: "80%", background: "radial-gradient(50% 60% at 50% 40%, rgba(194,101,101,0.14), transparent 70%)", pointerEvents: "none" }}
      />
      <div style={{ position: "relative", maxWidth: 1140, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "clamp(36px,5vw,60px)" }}>
            <Kicker color={C.peau} align="center">Les familles</Kicker>
            <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(27px,3.8vw,48px)", lineHeight: 1.08, color: C.white, margin: "20px 0 0" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                <>
                  Ceux qui ont <em style={{ color: C.peau }}>les clés</em> en parlent.
                </>
              )}
            </h2>
          </div>
        </Reveal>
        <div className="i354-avisgrid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px,100%),1fr))", gap: "clamp(16px,2vw,24px)", alignItems: "stretch" }}>
          {AVIS.map((a, i) => (
            <AvisCarte key={`${a.auteur}-${i}`} a={a} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   9 · CONTACT — portes ouvertes + cartouche coordonnées
   ════════════════════════════════════════════════════════════════════════════ */
function Contact() {
  const tel = clientPhone(sessionData) ?? fd?.phone ?? "03 26 00 00 00";
  const telHref = `tel:${clientPhone(sessionData) ?? fd?.phone ?? "+33326000000"}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "familles@nid-douillet.fr";

  return (
    <section id="contact" className="i354-pad" style={{ position: "relative", background: C.bg, padding: "clamp(76px,10vw,140px) clamp(20px,5vw,60px)", overflow: "hidden", ...laine(0.8) }}>
      <div className="i354-contact" style={{ position: "relative", maxWidth: 1060, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,0.9fr)", gap: "clamp(30px,5vw,76px)", alignItems: "start" }}>
        <Reveal>
          <div>
            <Kicker>Portes ouvertes</Kicker>
            <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(29px,4.2vw,54px)", lineHeight: 1.05, letterSpacing: "-0.014em", color: C.ink, margin: "22px 0 18px" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                <>
                  Poussez la porte,
                  <br />
                  <em style={{ color: C.accent }}>restez pour le café.</em>
                </>
              )}
            </h2>
            <p style={{ fontFamily: SANS, fontWeight: 400, fontSize: 15.5, lineHeight: 1.78, color: C.textMuted, maxWidth: 480, margin: "0 0 clamp(22px,3vw,34px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ?? (
                <>
                  Portes ouvertes chaque premier samedi du mois, 10h–12h. Liste d'attente par téléphone — les
                  fratries sont prioritaires.
                </>
              )}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <PillButton href={telHref} filled>
                <Phone size={15} /> {tel}
              </PillButton>
              <PillButton href={`mailto:${mail}`}>
                <Mail size={15} /> Nous écrire
              </PillButton>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "26px 26px 26px 84px", padding: "clamp(24px,2.8vw,36px)", boxShadow: "0 24px 60px -46px rgba(43,29,33,0.4)" }}>
            {[
              { icon: <Phone size={15} strokeWidth={1.6} />, l: "Téléphone", v: tel },
              { icon: <Mail size={15} strokeWidth={1.6} />, l: "Courriel", v: mail },
              {
                icon: <MapPin size={15} strokeWidth={1.6} />,
                l: "La maison",
                v: clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "51100", "Reims") + ", Marne",
              },
              { icon: <Clock size={15} strokeWidth={1.6} />, l: "Amplitude", v: STATS[1]?.value ? `${STATS[1].value}, du lundi au vendredi` : "7h–19h, du lundi au vendredi" },
            ].map((row, n) => (
              <div
                key={row.l}
                style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: 14, alignItems: "start", padding: "15px 0", borderTop: n === 0 ? "none" : `1px solid ${C.border}` }}
              >
                <span style={{ color: C.accent, paddingTop: 3 }}>{row.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.28em", textTransform: "uppercase", color: C.textFaint, marginBottom: 6, fontWeight: 700 }}>
                    {row.l}
                  </div>
                  <div style={{ fontFamily: SERIF, fontSize: 17.5, color: C.ink, wordBreak: "break-word" }}>{row.v}</div>
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
   10 · PIED DE PAGE
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  const nom = fd?.businessName ?? clientName(sessionData) ?? "Le Nid Douillet";
  const tel = clientPhone(sessionData) ?? fd?.phone ?? "03 26 00 00 00";
  const mail = clientEmail(sessionData) ?? fd?.email ?? "familles@nid-douillet.fr";
  return (
    <footer className="i354-pad" style={{ position: "relative", background: C.bgDarkAlt, color: "rgba(250,245,243,0.5)", padding: "clamp(48px,6vw,76px) clamp(20px,5vw,60px) 24px", overflow: "hidden" }}>
      <div
        aria-hidden
        style={{ position: "absolute", inset: "auto -10% -50% -10%", height: "80%", background: "radial-gradient(50% 60% at 50% 80%, rgba(194,101,101,0.1), transparent 70%)", pointerEvents: "none" }}
      />
      <div style={{ position: "relative", maxWidth: 1120, margin: "0 auto" }}>
        <div className="i354-footgrid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)", gap: "clamp(26px,4vw,60px)", paddingBottom: "clamp(26px,4vw,40px)" }}>
          <div>
            <div style={{ fontFamily: SERIF, fontSize: 24, color: C.peau, marginBottom: 12 }}>{nom}</div>
            <p style={{ fontFamily: SANS, fontWeight: 400, fontSize: 13.5, lineHeight: 1.8, margin: 0, maxWidth: 380 }}>
              {clientTrade(sessionData) ?? "Crèche associative"} · {clientCity(sessionData) ?? "Reims"}
              <br />
              Agrément PMI Marne — gestion parentale participative
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {[
              { icon: <MapPin size={13} strokeWidth={1.6} />, t: clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "51100", "Reims") + ", Marne" },
              { icon: <Phone size={13} strokeWidth={1.6} />, t: tel },
              { icon: <Mail size={13} strokeWidth={1.6} />, t: mail },
              { icon: <Clock size={13} strokeWidth={1.6} />, t: "Lun–Ven 7h–19h" },
            ].map((row, n) => (
              <div key={n} style={{ display: "flex", gap: 11, alignItems: "center", fontFamily: SANS, fontSize: 13 }}>
                <span style={{ color: C.peau, display: "flex" }}>{row.icon}</span>
                {row.t}
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(250,245,243,0.1)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, fontFamily: SANS, fontSize: 11.5, color: "rgba(250,245,243,0.3)" }}>
          <span>
            © 2026 {nom} — Site réalisé par Aevia WS · SIREN{" "}
            <LegalIdentity fallback="852 546 225" kind="siren" />
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
export default function NidDouilletPage() {
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
  SERVICES_SOURCE = SERVICES_SOURCE_LIVE();
  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...SERVICES_SOURCE[i % SERVICES_SOURCE.length],
      titre: s.title,
    })),
    SERVICES_SOURCE,
  );
  SERVICES = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...SERVICES_SOURCE[i % SERVICES_SOURCE.length],
      tag: SERVICES_SOURCE[i % SERVICES_SOURCE.length].tag,
      titre: s.title ?? SERVICES_SOURCE[i % SERVICES_SOURCE.length].titre,
      desc: s.description ?? s.desc ?? SERVICES_SOURCE[i % SERVICES_SOURCE.length].desc,
    })),
    SERVICES_DEMO,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      ...AVIS_SOURCE[i % AVIS_SOURCE.length],
      auteur: r.author,
      texte: r.text,
    })),
    AVIS_SOURCE,
  );
  AVIS = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      ...AVIS_DEMO[i % AVIS_DEMO.length],
      texte: r.text ?? AVIS_DEMO[i % AVIS_DEMO.length].texte,
      auteur: r.name ?? r.author ?? AVIS_DEMO[i % AVIS_DEMO.length].auteur,
      detail: r.location ?? r.role ?? AVIS_DEMO[i % AVIS_DEMO.length].detail,
    })),
    AVIS_DEMO,
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
  METHODE = resolveList(
    clientList(sessionData, "journee.etapes")?.map((l: string, i: number) => ({
      ...METHODE_DEMO[i % METHODE_DEMO.length],
      t: l,
    })),
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

        /* Nav : le bloc de liens disparaît au profit du menu au pouce. */
        @media (max-width: 980px) {
          #i354-nav { display: none !important; }
          .i354-burger { display: flex !important; }
        }
        @media (max-width: 560px) { .i354-navtrade { display: none !important; } }

        /* Le débord du titre H4 ne vaut que sur deux colonnes : en dessous,
           il rentre dans le rang et le panneau suit dans le flux. */
        @media (max-width: 940px) {
          .i354-heroGrid { grid-template-columns: minmax(0,1fr) !important; row-gap: 30px; }
          .i354-h1 { margin-right: 0 !important; }
          .i354-panel { margin-top: 0 !important; max-width: 460px; }
          .i354-soleil { display: none !important; }
          .i354-split { grid-template-columns: minmax(0,1fr) !important; }
          .i354-contact { grid-template-columns: minmax(0,1fr) !important; }
          .i354-footgrid { grid-template-columns: minmax(0,1fr) !important; }
          .i354-heure { grid-template-columns: minmax(0,1fr) !important; row-gap: 8px; }
          /* Le quinconce des galets et des avis se remet à plat. */
          .i354-galet { transform: none !important; }
          .i354-avis { transform: none !important; }
        }
        @media (max-width: 760px) {
          .i354-tarif { grid-template-columns: minmax(0,1fr) !important; row-gap: 8px; }
        }
        @media (max-width: 480px) {
          .i354-pad { padding-left: 20px !important; padding-right: 20px !important; }
        }

        /* Le geste honore la préférence système (le kit s'en charge aussi). */
        @media (prefers-reduced-motion: reduce) {
          .i354-galet, .i354-avis { transition: none !important; }
        }
      `}</style>

      <Nav />
      <Hero />
      <Respiration />
      <Services />
      <Journee />
      <Engagements />
      <Tarifs />
      <Avis />
      <Contact />
      <Footer />
    </div>
  );
}
