"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Beer, Clock, Mail, MapPin, Phone, Star, Wheat } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, useSlides } from "@/lib/templates/hero-kit-2";
import { ArcSwap } from "@/lib/templates/hero-kit-3";
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
  clientMethode,
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
   BRASSERIE DU HOUBLON FRANC — brasserie artisanale · Lille

   Archétype H3 (plein cadre, titre en bas, fond de repli C.bgDark
   OBLIGATOIRE) · paire P6 (Archivo + Inter) · palette cuivre de brasserie
   D #130f0b / #cf7f2e · signature : la bouteille qui balance.

   Le geste ArcSwap remplace le PanelRise qui trônait ici sur… la bande de
   chiffres. Il s'applique à son objet naturel : une bouteille dessinée en SVG
   qui bascule autour de son pied (transformOrigin 50 % 92 %, câblé dans le
   composant du kit), sort par la droite en tournant et revient par la gauche
   presque couchée. Un seul index pilote tout le héros : la teinte de la
   bouteille, son étiquette, la bière nommée dans la bande et la fraction.
   Une ombre au sol marque le pivot — jamais de cadre autour de l'objet.

   L'URL de photographie est celle du thème ; on n'en invente aucune, et le
   plein cadre tient sans elle (cuivre + trame de bulles).
   ════════════════════════════════════════════════════════════════════════════ */

let C: Record<string, string> = {
  bg: "#130f0b",
  bgAlt: "#1a1410",
  bgDark: "#0c0907",
  bgDarkAlt: "#080605",
  bgCard: "#1e1712",
  accent: "var(--brand,#cf7f2e)",
  accentDark: "var(--brand-light,#e2a45c)",
  accentLight: "#241708",
  ink: "#f3ece0",
  textMuted: "#a49584",
  textFaint: "#6f6355",
  border: "rgba(207,127,46,0.20)",
  white: "#ffffff",
  /* Clé métier : la mousse — le voile clair qui monte dans le verre. */
  mousse: "rgba(207,127,46,0.10)",
};

const DISPLAY = "'Archivo', 'Arial Narrow', system-ui, sans-serif";
const BODY = "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_CSS = "cubic-bezier(.16,1,.3,1)";

const NAV = [
  { l: "Nos bières", h: "#services" },
  { l: "Le brassage", h: "#methode" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* Les robes des bières : la bouteille du geste se teinte avec la diapositive.
   Blonde, IPA ambrée, brune, blanche — puis la boucle reprend. */
const ROBES = ["#e3b048", "#c96f2a", "#3a2313", "#efe3c2", "#cf7f2e", "#8a5a2a"];

/* ── Données de démonstration — textes du thème, conservés ────────────────── */

const SERVICES_SOURCE = [
  {
    titre: "La Blonde de Soif",
    desc: "4,8 % — maltée, sèche, désaltérante. Celle qu'on sert aux sceptiques et qu'ils finissent par commander en fût.",
    tag: "Blonde",
    n: "01",
  },
  {
    titre: "L'IPA du Beffroi",
    desc: "6,2 % — houblons américains et néo-zélandais, amertume franche, agrumes et résine. Notre best-seller au taproom.",
    tag: "IPA",
    n: "02",
  },
  {
    titre: "La Brune d'Hiver",
    desc: "7 % — malts torréfiés, café et chocolat noir, longueur en bouche. Brassée de septembre à mars uniquement.",
    tag: "Brune",
    n: "03",
  },
  {
    titre: "La Blanche du Canal",
    desc: "4,5 % — froment lillois, coriandre, zeste d'orange amère. La terrasse d'été en bouteille.",
    tag: "Blanche",
    n: "04",
  },
  {
    titre: "Les saisonnières",
    desc: "Tous les deux mois : bière de garde, stout au café d'un torréfacteur voisin, sour aux fruits de saison. Quand c'est fini, c'est fini.",
    tag: "Éphémère",
    n: "05",
  },
  {
    titre: "Fûts pour bars & événements",
    desc: "Fûts 20 et 30 L, tireuses prêtées, livraison sur Lille : bars, mariages, comités d'entreprise.",
    tag: "CHR",
    n: "06",
  },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE = [
  {
    n: "01",
    t: "Le malt d'à côté",
    d: "Orges de Flandre maltées à 30 km : la matière première voyage moins que nos bouteilles.",
  },
  {
    n: "02",
    t: "Le brassin de 20 hL",
    d: "Petits volumes, brassage tous les mardis : on peut se permettre d'arrêter une recette qui ne nous plaît plus.",
  },
  {
    n: "03",
    t: "Fermentation lente",
    d: "Trois semaines minimum, garde à froid : le temps que le brasseur industriel n'a pas et que le goût réclame.",
  },
  {
    n: "04",
    t: "Ni filtrée ni pasteurisée",
    d: "La bière reste vivante, un léger dépôt est normal — c'est la preuve, pas le défaut.",
  },
];

const ENGAGEMENT_DEMO = [
  "Brasserie indépendante : aucun groupe au capital, aucune bière brassée pour d'autres",
  "Malts d'orge de Flandre, houblons tracés, aucun additif ni arôme",
  "Bières non filtrées, non pasteurisées — DLUO courte, goût long",
  "Consigne bouteilles et fûts : rapportez, on reprend, on relave",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

function TARIFS_DEMO_LIVE() {
  return [
    { a: "Bouteille 33 cl (boutique)", p: "3,20 €", n: "Consigne 0,20 € rendue au retour." },
    { a: "Caisse de 12 (assortie)", p: "34 €", n: "Composez avec les permanentes et la saisonnière du moment." },
    {
      a: "Fût 20 L + tireuse prêtée",
      p: "145 €",
      n: "Caution tireuse, livraison sur " + (clientCity(sessionData) ?? "Lille") + " comprise.",
    },
    { a: "Visite-dégustation (1 h 30)", p: "12 €", n: "Cuves, brassin en cours, 4 dégustations. Le samedi à 15 h." },
  ];
}
let TARIFS_DEMO = TARIFS_DEMO_LIVE();
let TARIFS = TARIFS_DEMO;

const AVIS_SOURCE = [
  {
    texte:
      "L'IPA du Beffroi est devenue la bière officielle de nos vendredis. Le taproom au pied des cuves, avec le brasseur qui passe expliquer le brassin en cours : c'est ça, boire local.",
    auteur: "Habitué du taproom",
    detail: "Taproom",
  },
  {
    texte:
      "Fûts et tireuse pour notre mariage de 120 personnes : livrés, installés, repris le lundi. La blanche a fait l'unanimité, même chez les non-buveurs de bière.",
    auteur: "Marion & Cédric",
    detail: "Fûts événement",
  },
  {
    texte:
      "La visite du samedi avec dégustation vaut largement les 12 €. On a compris pourquoi une bière artisanale coûte ce qu'elle coûte — et on l'achète sans broncher depuis.",
    auteur: "Groupe d'amis lillois",
    detail: "Visite-dégustation",
  },
];
let AVIS_DEMO = AVIS_SOURCE;

const STATS_DEMO = [
  { value: "4", label: "Bières permanentes" },
  { value: "1 200 hL", label: "Brassés par an — pas un de plus" },
  { value: "0", label: "Filtration, pasteurisation, additif" },
  { value: "30 km", label: "Rayon des orges maltées" },
];
let STATS = STATS_DEMO;

/* ── Primitives ───────────────────────────────────────────────────────────── */

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
          letterSpacing: "0.36em",
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

/** Filet dégradé d'un pixel — la ligne de tirage. */
function Filet({ opacity = 1 }: any) {
  return (
    <div
      aria-hidden
      style={{
        height: 1,
        width: "100%",
        background: `linear-gradient(to right, transparent, ${C.accent}, transparent)`,
        opacity: 0.34 * opacity,
        pointerEvents: "none",
      }}
    />
  );
}

function TexteFantome({ children, top, right, left, size = "clamp(8rem,20vw,19rem)" }: any) {
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        top,
        right,
        left,
        fontFamily: DISPLAY,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 0.8,
        color: C.accent,
        opacity: 0.06,
        pointerEvents: "none",
        userSelect: "none",
        letterSpacing: "-0.05em",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function BoutonCuivre({ href, children, plein = true, large = false }: any) {
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
        letterSpacing: "0.04em",
        textDecoration: "none",
        borderRadius: 3,
        border: `1px solid ${plein ? (h ? C.accentDark : C.accent) : h ? C.accent : "rgba(243,236,224,0.26)"}`,
        background: plein ? (h ? C.accentDark : C.accent) : h ? "rgba(207,127,46,0.10)" : "transparent",
        color: plein ? "#160e05" : C.ink,
        transform: h ? "translateY(-3px)" : "none",
        boxShadow: h
          ? "0 18px 42px -18px rgba(207,127,46,0.55), 0 3px 12px -6px rgba(0,0,0,0.6)"
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
        letterSpacing: "0.04em",
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

/** La bouteille du geste : SVG, aucune image. La robe suit la bière. */
function Bouteille({ robe, etiquette, nom }: any) {
  return (
    <svg viewBox="0 0 140 400" width="100%" height="100%" aria-hidden style={{ display: "block", overflow: "visible" }}>
      {/* capsule */}
      <rect x="57" y="8" width="26" height="16" rx="4" fill={C.accent} />
      {/* le verre : col, épaules, corps, pied */}
      <path
        d="M60 24 h20 v66 c0 26 28 34 28 68 v212 c0 13 -10 22 -23 22 h-30 c-13 0 -23 -9 -23 -22 v-212 c0 -34 28 -42 28 -68 z"
        fill={robe}
        stroke="rgba(0,0,0,0.35)"
        strokeWidth="1.5"
      />
      {/* voile sombre du verre : la robe se lit sans être criarde */}
      <path
        d="M60 24 h20 v66 c0 26 28 34 28 68 v212 c0 13 -10 22 -23 22 h-30 c-13 0 -23 -9 -23 -22 v-212 c0 -34 28 -42 28 -68 z"
        fill="rgba(12,9,7,0.42)"
      />
      {/* reflet */}
      <rect x="42" y="176" width="7" height="176" rx="3.5" fill="rgba(255,255,255,0.14)" />
      {/* étiquette */}
      <rect x="38" y="238" width="64" height="78" rx="5" fill="#f3ece0" stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
      <line x1="46" y1="252" x2="94" y2="252" stroke={robe} strokeWidth="2.5" />
      <text
        x="70"
        y="278"
        textAnchor="middle"
        fontFamily={DISPLAY}
        fontWeight="800"
        fontSize="13"
        letterSpacing="1.5"
        fill="#160e05"
        style={{ textTransform: "uppercase" }}
      >
        {String(etiquette ?? "").toUpperCase().slice(0, 8)}
      </text>
      <text x="70" y="296" textAnchor="middle" fontFamily={BODY} fontSize="7.5" letterSpacing="1.1" fill="#6f6355">
        {String(nom ?? "").toUpperCase().slice(0, 22)}
      </text>
      <line x1="46" y1="304" x2="94" y2="304" stroke={robe} strokeWidth="1" opacity="0.6" />
      {/* collerette */}
      <rect x="56" y="96" width="28" height="20" rx="3" fill="#f3ece0" opacity="0.9" />
    </svg>
  );
}

function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || fallback;
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════════════ */
export default function BrasserieHoublonPage() {
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

  TARIFS_DEMO = TARIFS_DEMO_LIVE();
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
      texte: r.text, detail: "", })),
    AVIS_SOURCE,
  );
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...TARIFS_DEMO[i % TARIFS_DEMO.length],
      a: s.title,
      p: s.price ?? "Sur devis",
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
    Un seul index pilote tout le héros : la robe de la bouteille, son
    étiquette, la bière nommée dans la bande de tirage et la fraction. Il ne
    fabrique aucun texte — il fait tourner les bières que le thème (ou le
    client) a déjà écrites. DWELL.slow : l'arc dure 0,9 s, l'arrêt 5,6 s.
  */
  const { i, go } = useSlides(SERVICES.length, DWELL.slow);
  const BIERE = SERVICES[i % SERVICES.length];
  const robe = ROBES[i % ROBES.length];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = clientPhone(sessionData) ?? fd?.phone ?? "03 20 00 00 02";
  const telHref = `tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33320000002").replace(/\s+/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "taproom@houblon-franc.fr";
  const nom = fd?.businessName ?? clientName(sessionData) ?? "Brasserie du Houblon Franc";
  const ville = clientCity(sessionData) ?? "Lille";
  const metier = clientTrade(sessionData) ?? "Brasserie artisanale";

  /* Titre du héros — deux lignes courtes : le gabarit H3 est énorme. */
  const ligne1 = clientHeroLine(sessionData, 0, 2, 17) ?? "La bière brassée ici,";
  const ligne2 = clientHeroLine(sessionData, 1, 2, 17) ?? "bue ici, aimée ici.";

  /* L'unique emplacement photographié d'origine : le plein cadre du héros. */
  const heroImg = photo(
    0,
    "https://images.pexels.com/photos/1267348/pexels-photo-1267348.jpeg?auto=compress&cs=tinysrgb&w=1400",
  );
  /* Emplacements supplémentaires, sans URL inventée : le CSS tient seul. */
  const taproomImg = photo(1, "") || "https://images.pexels.com/photos/6366897/pexels-photo-6366897.jpeg?auto=compress&cs=tinysrgb&w=1600";
  const cuvesImg = photo(2, "") || "https://images.pexels.com/photos/5532845/pexels-photo-5532845.jpeg?auto=compress&cs=tinysrgb&w=1600";

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: BODY, overflowX: "clip" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,500;0,600;0,700;0,800;1,700&family=Inter:wght@300;400;500;600&display=swap');

        .i380-navrow { display: flex; gap: clamp(16px,2vw,30px); align-items: center; }
        .i380-split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(32px,5vw,72px); align-items: center; }
        .i380-stats { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); }
        .i380-bieres { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(280px,100%),1fr)); gap: 16px; }
        /*
          ── Héros « grille éditoriale » ────────────────────────────────────
          L'ours de gazette, le titre pleine largeur, puis trois colonnes :
          chapô, bouteille en balancier, fiche du tirage.
        */
        .i380-masthead {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(14px, 2.2vw, 32px);
          padding-bottom: clamp(12px, 1.8vw, 20px);
          border-bottom: 1px solid rgba(243,236,224,0.18);
        }
        .i380-mcell + .i380-mcell { border-left: 1px solid rgba(243,236,224,0.14); padding-left: clamp(14px, 2.2vw, 32px); }
        .i380-colonnes {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) clamp(170px, 19vw, 240px) minmax(0, 0.65fr);
          gap: clamp(22px, 3.4vw, 56px);
          align-items: end;
          margin-top: clamp(20px, 2.8vw, 34px);
          padding-top: clamp(18px, 2.4vw, 28px);
          border-top: 1px solid rgba(243,236,224,0.18);
        }
        .i380-fiche { border-left: 1px solid rgba(243,236,224,0.14); padding-left: clamp(14px, 1.8vw, 26px); min-width: 0; }
        @media (max-width: 980px) {
          .i380-masthead { grid-template-columns: 1fr 1fr; row-gap: 14px; }
          .i380-mcell:nth-child(odd) { border-left: none; padding-left: 0; }
          .i380-colonnes { grid-template-columns: minmax(0,1fr) clamp(150px,26vw,200px); }
          .i380-fiche { grid-column: 1 / -1; border-left: none; padding-left: 0; border-top: 1px solid rgba(243,236,224,0.14); padding-top: 16px; }
        }
        @media (max-width: 640px) {
          .i380-colonnes { grid-template-columns: minmax(0,1fr); }
          .i380-flacon { max-width: 200px; }
        }
        .i380-brassage { display: grid; grid-template-columns: minmax(0,0.9fr) minmax(0,1.1fr); gap: clamp(32px,5vw,72px); align-items: start; }

        /* Le détail gratuit : trois bulles montent dans le cuivre du héros. */
        @keyframes i380-bulle {
          0% { transform: translateY(0); opacity: 0; }
          12% { opacity: .5; }
          88% { opacity: .5; }
          100% { transform: translateY(-58vh); opacity: 0; }
        }
        .i380-bulle { animation: i380-bulle 11s linear infinite; }
        .i380-bulle2 { animation-duration: 14s; animation-delay: 3s; }
        .i380-bulle3 { animation-duration: 9s; animation-delay: 6s; }
        @media (prefers-reduced-motion: reduce) { .i380-bulle { animation: none; opacity: .18; } }

        @media (max-width: 1000px) {
          .i380-brassage { grid-template-columns: 1fr; }
          .i380-brassticky { position: static !important; }
        }
        @media (max-width: 900px) {
          #i380-nav { display: none !important; }
          .i380-burger { display: flex !important; }
          .aevia-action-mobile { display: inline-flex !important; }
          .i380-split { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 860px) {
          .i380-herobas { grid-template-columns: 1fr; }
          .i380-flacon { display: none !important; }
          .i380-stats { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .i380-statcell { border-left: none !important; }
          .i380-tarifrow { flex-direction: column; align-items: flex-start !important; }
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
          background: scrolled ? "rgba(12,9,7,0.92)" : "transparent",
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
              <Beer size={17} color={C.accent} style={{ flexShrink: 0 }} />
              <span
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  fontSize: 17.5,
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
                {ville}
              </span>
            </>
          )}
        </div>
        <div id="i380-nav" className="i380-navrow">
          {NAV.map((n) => (
            <NavLien key={n.l} l={n.l} h={n.h} />
          ))}
          <BoutonCuivre href={telHref}>Visite & dégustation</BoutonCuivre>
        </div>
        {/* L'appel à l'action sous le pouce : la barre est fixe, mais son
            bouton vit dans le menu déroulant, en display:none sous le point
            de rupture. Celui-ci paraît exactement avec le bouton de menu. */}
        <ActionMobile href={telHref} fond={C.accent} encre={"#160e05"}>
          Appeler
        </ActionMobile>
        <button
          className="i380-burger"
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
              color: "#160e05",
              borderRadius: 3,
              padding: "14px 22px",
              fontSize: 15,
              fontWeight: 700,
              textDecoration: "none",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            Visite & dégustation
          </a>
        </div>
      )}

      {/* ── HÉROS — H3 plein cadre, titre en bas, bouteille en balancier ── */}
      <section
        id="hero"
        className="i380-herosec"
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "clamp(20px,2.8vh,36px)",
          overflow: "hidden",
          background: C.bgDark,
          padding: "clamp(112px,13vh,150px) clamp(20px,5vw,64px) clamp(40px,5vh,64px)",
        }}
      >
        {/* ── HERO — grille éditoriale : la gazette de brasserie ───────────
               Bandeau de méta fileté, titre pleine largeur, puis trois
               colonnes : le chapô, la bouteille qui balance (ArcSwap), la
               fiche de la bière au tirage. Le plein cadre à titre bas était
               la composition de cinq autres thèmes. */}

        {heroImg ? (
          <img
            src={heroImg}
            alt=""
            aria-hidden
            loading="eager"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }}
          />
        ) : null}
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(24,16,10,0.86) 0%, rgba(24,16,10,0.68) 50%, rgba(24,16,10,0.92) 100%)" }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 1280, width: "100%", margin: "0 auto" }}>
          {/* ── Le bandeau de méta, comme l'ours d'une gazette ───────────── */}
          <div className="i380-masthead">
            {[
              { l: "La brasserie", v: nom },
              { l: "Le métier", v: clientEyebrow(sessionData) ?? `${metier} · ${ville}` },
              { l: "Au tirage", v: BIERE?.titre ?? "Quatre permanentes" },
              { l: "La règle", v: "Jamais filtrée" },
            ].map((m) => (
              <div key={m.l} className="i380-mcell">
                <div style={{ fontSize: 9.5, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(243,236,224,0.5)", marginBottom: 7 }}>
                  {m.l}
                </div>
                <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "clamp(13px, 1.1vw, 15.5px)", color: C.ink, lineHeight: 1.35, overflowWrap: "break-word" }}>
                  {m.v}
                </div>
              </div>
            ))}
          </div>

          {/* ── Le titre, pleine largeur, d'un seul tenant ────────────────── */}
          <motion.h1
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.055, ease: EASE }}
            style={{
              margin: "clamp(18px,2.6vw,32px) 0 0",
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: "clamp(2.4rem,6.4vw,5.6rem)",
              lineHeight: 0.96,
              letterSpacing: "-0.035em",
              textTransform: "uppercase",
              color: C.ink,
              maxWidth: 1120,
              overflowWrap: "break-word",
            }}
          >
            {ligne1} {ligne2}
          </motion.h1>

          {/* ── Les trois colonnes ────────────────────────────────────────── */}
          <div className="i380-colonnes">
            {/* 1 — le chapô et l'action */}
            <div style={{ minWidth: 0 }}>
              <motion.p
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.11, ease: EASE }}
                style={{ fontSize: "clamp(14.5px,1.2vw,16.5px)", color: "rgba(243,236,224,0.80)", lineHeight: 1.78, margin: "0 0 clamp(20px,2.6vw,30px)" }}
              >
                {clientHeroSubtitle(sessionData) ??
                  c?.heroSubline ??
                  "Quatre bières permanentes, une saisonnière tous les deux mois, un taproom au pied des cuves : une brasserie indépendante qui brasse en petits volumes et refuse de filtrer ce qui donne le goût."}
              </motion.p>
              {/* Une seule action pleine ; les bières restent un lien. */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.165, ease: EASE }}
                style={{ display: "flex", gap: "clamp(16px,2vw,26px)", flexWrap: "wrap", alignItems: "center" }}
              >
                <BoutonCuivre href={telHref} large>
                  Réserver une visite-dégustation
                </BoutonCuivre>
                <a href="#services" style={{ fontSize: 13, color: C.ink, textDecoration: "none", borderBottom: `1px solid ${C.accent}`, paddingBottom: 3 }}>
                  Nos bières
                </a>
              </motion.div>
            </div>

            {/* 2 — la bouteille qui balance : le geste, à sa place de colonne */}
            <div className="i380-flacon" style={{ position: "relative", height: "clamp(240px,26vw,340px)" }}>
              <ArcSwap index={i} sweep={52} hold={0.42} className="">
                <div style={{ height: "clamp(240px,26vw,340px)" }}>
                  <Bouteille robe={robe} etiquette={BIERE?.tag} nom={nom} />
                </div>
              </ArcSwap>
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: -6,
                  transform: "translateX(-50%)",
                  width: "68%",
                  height: 18,
                  borderRadius: "50%",
                  background: "radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* 3 — la fiche de la bière au tirage */}
            <div className="i380-fiche">
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
                <span style={{ fontSize: 10.5, letterSpacing: "0.30em", textTransform: "uppercase", color: C.accent, display: "block", marginBottom: 6 }}>
                  {BIERE?.tag}
                </span>
                <span style={{ fontSize: 14.5, color: "rgba(243,236,224,0.9)", fontWeight: 500, lineHeight: 1.5 }}>
                  {BIERE?.titre}
                </span>
              </motion.div>
              {/*
                La fraction ne disait pas ce qu'on regardait ; ces traits
                mènent directement à chaque bière.
              */}
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                {SERVICES.map((sv: any, n: number) => (
                  <button
                    key={sv.titre ?? n}
                    type="button"
                    onClick={() => go(n)}
                    aria-label={sv.titre ?? `Bière ${n + 1}`}
                    aria-current={n === i}
                    style={{ width: 30, height: 3, padding: 0, border: "none", cursor: "pointer", background: n === i ? C.accent : "rgba(243,236,224,0.28)", transition: "background .3s" }}
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
              fontWeight: 700,
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
                La bière reste vivante — le léger dépôt,{" "}
                <span style={{ color: C.accent }}>c'est la preuve, pas le défaut.</span>
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
        <div className="i380-stats" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(20px,5vw,56px)" }}>
          {STATS.map((s: any, idx: number) => (
            <Reveal key={s.label ?? idx} delay={idx * 0.055}>
              <div
                className="i380-statcell"
                style={{
                  padding: "clamp(26px,3vw,40px) clamp(12px,1.6vw,24px)",
                  borderLeft: idx === 0 ? "none" : `1px solid ${C.border}`,
                }}
              >
                <div
                  style={{
                    fontFamily: DISPLAY,
                    fontWeight: 800,
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

      {/* ── NOS BIÈRES — étiquettes en grille ───────────────────────────── */}
      <section
        id="services"
        style={{
          background: C.bg,
          padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <TexteFantome top="2%" right="-3%">
          20 hL
        </TexteFantome>
        <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <Kicker>Nos bières</Kicker>
            <h2
              style={{
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: "clamp(1.8rem,3.8vw,3rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.032em",
                color: C.ink,
                margin: "22px 0 16px",
                maxWidth: 760,
              }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                <>
                  Quatre permanentes,
                  <br />
                  <em style={{ fontStyle: "italic", color: C.accent }}>et ce qui nous passe par la tête.</em>
                </>
              )}
            </h2>
            <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.75, maxWidth: 560, margin: "0 0 clamp(32px,4vw,48px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "services.intro") ??
                "Brassées en 20 hL, non filtrées, non pasteurisées. La saisonnière change tous les deux mois — quand c'est fini, c'est fini."}
            </p>
          </Reveal>
          <div className="i380-bieres">
            {SERVICES.map((s: any, idx: number) => (
              <Reveal key={s.titre ?? idx} delay={(idx % 3) * 0.055} style={{ height: "100%" }}>
                <CarteBiere s={s} robe={ROBES[idx % ROBES.length]} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── LE BRASSAGE — rail collant + chronologie filetée ────────────── */}
      <section
        id="methode"
        style={{
          background: C.bgAlt,
          padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="i380-brassage" style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div className="i380-brassticky" style={{ position: "sticky", top: 108 }}>
              <Kicker>Le brassage</Kicker>
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
                {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                  <>
                    Petits volumes,
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accent }}>grandes exigences.</em>
                  </>
                )}
              </h2>
              {/* Troisième emplacement photo : les cuves. Sans image, le
                  panneau reste un objet dessiné — jamais un rectangle vide. */}
              <div
                style={{
                  position: "relative",
                  border: `1px solid ${C.border}`,
                  borderRadius: 3,
                  overflow: "hidden",
                  aspectRatio: "4/3",
                  maxWidth: 420,
                  background: `linear-gradient(150deg, ${C.accentLight} 0%, ${C.bgDarkAlt} 100%)`,
                }}
              >
                {cuvesImg ? (
                  <img
                    src={cuvesImg}
                    alt="Cuves de brassage"
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
                        backgroundImage: `repeating-linear-gradient(90deg, ${C.mousse} 0px, ${C.mousse} 1px, transparent 1px, transparent 46px)`,
                      }}
                    />
                    <div
                      aria-hidden
                      style={{
                        position: "absolute",
                        top: "-30%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "90%",
                        height: "120%",
                        borderRadius: "0 0 46% 46% / 0 0 30% 30%",
                        border: `1px solid ${C.border}`,
                        background: `linear-gradient(to bottom, transparent 30%, ${C.mousse} 100%)`,
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
                        gap: 12,
                        textAlign: "center",
                        padding: 24,
                      }}
                    >
                      <Wheat size={30} color={C.accent} strokeWidth={1.2} />
                      <span
                        style={{
                          fontFamily: DISPLAY,
                          fontWeight: 700,
                          fontSize: "clamp(14px,1.6vw,18px)",
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                          color: C.ink,
                        }}
                      >
                        Brassin du mardi
                      </span>
                      <span style={{ fontSize: 12, color: C.textFaint, letterSpacing: "0.14em" }}>20 hL · {ville}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Reveal>

          <div style={{ position: "relative", paddingLeft: "clamp(30px,5vw,64px)" }}>
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
            {resolveList(fusionnerEtapes(METHODE, clientMethode(sessionData)), METHODE).map((m, idx) => (
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
                  <div style={{ fontSize: 10.5, letterSpacing: "0.32em", textTransform: "uppercase", color: C.accent, marginBottom: 8 }}>
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
                  <p style={{ fontSize: 14.5, color: C.textMuted, lineHeight: 1.75, margin: 0, maxWidth: 560 }}>{m.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── LA MAISON — panneau taproom + engagements ───────────────────── */}
      <section
        id="engagements"
        style={{ background: C.bg, padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)" }}
      >
        <div className="i380-split" style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            {/* Deuxième emplacement photo : le taproom. Repli dessiné. */}
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
              {taproomImg ? (
                <img
                  src={taproomImg}
                  alt="Le taproom au pied des cuves"
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
                      backgroundImage: `linear-gradient(${C.mousse} 1px, transparent 1px), linear-gradient(90deg, ${C.mousse} 1px, transparent 1px)`,
                      backgroundSize: "42px 42px",
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
                    <Beer size={30} color={C.accent} strokeWidth={1.2} />
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
                      Le taproom
                    </span>
                    <span style={{ fontSize: 12, color: C.textFaint, letterSpacing: "0.14em" }}>Au pied des cuves · {ville}</span>
                  </div>
                </>
              )}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  background: "rgba(8,6,5,0.86)",
                  borderTop: `1px solid ${C.border}`,
                  borderRight: `1px solid ${C.border}`,
                  padding: "10px 18px",
                  fontSize: 10.5,
                  letterSpacing: "0.30em",
                  textTransform: "uppercase",
                  color: C.accent,
                }}
              >
                Indépendante
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              <Kicker>La maison</Kicker>
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
                    Indépendants,
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accent }}>et fiers de l'être.</em>
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
                <BoutonCuivre href={telHref}>Nous appeler</BoutonCuivre>
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
        <TexteFantome top="8%" right="1%" size="clamp(6rem,13vw,14rem)">
          33 cl
        </TexteFantome>
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
                  Au verre, <em style={{ fontStyle: "italic", color: C.accent }}>au fût, à la caisse.</em>
                </>
              )}
            </h2>
            <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 620, lineHeight: 1.75, margin: 0 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.intro") ??
                `Vente directe à la boutique et au taproom. Tarifs CHR sur demande, livraison offerte sur ${ville} dès 6 fûts.`}
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

      {/* ── AVIS — sous-bocks posés sur le comptoir ─────────────────────── */}
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
            opacity: 0.09,
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "clamp(36px,5vw,56px)" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Kicker align="center">Le comptoir</Kicker>
              </div>
              <h2
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 800,
                  fontSize: "clamp(1.8rem,3.6vw,2.8rem)",
                  lineHeight: 1.06,
                  letterSpacing: "-0.032em",
                  color: C.ink,
                  margin: "22px 0 0",
                }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                  <>
                    On revient <em style={{ fontStyle: "italic", color: C.accent }}>le jeudi soir</em>.
                  </>
                )}
              </h2>
            </div>
          </Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(300px,100%),1fr))",
              gap: "clamp(16px,2.4vw,28px)",
            }}
          >
            {AVIS.map((a: any, idx: number) => (
              <Reveal key={a.auteur ?? idx} delay={idx * 0.09} style={{ height: "100%" }}>
                <SousBock a={a} idx={idx} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT — le taproom ────────────────────────────────────────── */}
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
            backgroundImage: `linear-gradient(${C.mousse} 1px, transparent 1px), linear-gradient(90deg, ${C.mousse} 1px, transparent 1px)`,
            backgroundSize: "56px 56px",
            opacity: 0.7,
          }}
        />
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Kicker align="center">Le taproom</Kicker>
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
                  Les cuves sont là,
                  <br />
                  <em style={{ fontStyle: "italic", color: C.accent }}>les verres aussi.</em>
                </>
              )}
            </h2>
            <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 480, margin: "0 auto 38px", lineHeight: 1.75 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ??
                "Taproom du jeudi au samedi soir, boutique du mercredi au samedi après-midi. Visites-dégustations le samedi à 15 h, sur réservation."}
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <BoutonCuivre href={telHref} large>
                <Phone size={16} style={{ marginRight: 2 }} /> {phone}
              </BoutonCuivre>
              <BoutonCuivre href={`mailto:${mail}`} plein={false} large>
                <Mail size={16} style={{ marginRight: 2 }} /> Nous écrire
              </BoutonCuivre>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PIED DE PAGE ────────────────────────────────────────────────── */}
      <footer style={{ background: C.bgDark, padding: "clamp(44px,6vw,68px) clamp(20px,5vw,64px) 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 34, marginBottom: 30 }}>
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
                {/* TEXTE_SECTION */ clientText(sessionData, "pied.description") ?? (
                  <>
                    Brasserie artisanale indépendante · {clientCodePostalVille(sessionData, "", ville)}
                    <br />
                    Bières non filtrées, non pasteurisées — vente directe et CHR
                  </>
                )}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <MapPin size={13} />, t: clientAddress(sessionData) ?? (clientCity(sessionData) ? ville : `${ville}, Nord`) },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Mail size={13} />, t: mail },
                { icon: <Clock size={13} />, t: "Taproom : Jeu–Sam 17h–00h · boutique Mer–Sam 14h–19h" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 11, color: C.textFaint, fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.accent }}>{item.icon}</span>
                  {item.t}
                </div>
              ))}
            </div>
          </div>
          <p style={{ color: C.textFaint, fontSize: 12, margin: "0 0 18px", opacity: 0.85, letterSpacing: "0.04em" }}>
            L'abus d'alcool est dangereux pour la santé — à consommer avec modération. Vente interdite aux mineurs.
          </p>
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

/* ── Sous-composants à état local ─────────────────────────────────────────── */

/** Carte-étiquette : la bière comme sur la bouteille — filet, robe, corps. */
function CarteBiere({ s, robe }: any) {
  const [h, setH] = useState(false);
  return (
    <article
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        position: "relative",
        height: "100%",
        boxSizing: "border-box",
        background: h ? C.bgCard : "rgba(30,23,18,0.55)",
        border: `1px solid ${h ? "rgba(207,127,46,0.45)" : C.border}`,
        borderTop: `3px solid ${robe}`,
        borderRadius: 4,
        padding: "clamp(22px,2.6vw,32px) clamp(20px,2.4vw,28px)",
        transform: h ? "translateY(-6px)" : "none",
        boxShadow: h
          ? "0 26px 52px -30px rgba(0,0,0,0.9), 0 6px 18px -10px rgba(207,127,46,0.35)"
          : "0 8px 24px -20px rgba(0,0,0,0.7)",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
        <span
          style={{
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: 22,
            color: C.accent,
            opacity: h ? 0.9 : 0.4,
            letterSpacing: "-0.03em",
            transition: `opacity .5s ${EASE_CSS}`,
          }}
        >
          {s.n}
        </span>
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
      <h3
        style={{
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: "clamp(17px,1.8vw,21px)",
          color: C.ink,
          margin: "0 0 10px",
          letterSpacing: "-0.018em",
        }}
      >
        {s.titre}
      </h3>
      <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.72, margin: 0 }}>{s.desc}</p>
    </article>
  );
}

function BandeTarif({ t }: any) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className="i380-tarifrow"
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

/** L'avis en sous-bock : légère rotation alternée, redressé au survol. */
function SousBock({ a, idx }: any) {
  const [h, setH] = useState(false);
  const angle = idx % 2 === 0 ? -1.1 : 1.3;
  return (
    <figure
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        height: "100%",
        boxSizing: "border-box",
        margin: 0,
        background: "rgba(30,23,18,0.65)",
        border: `1px solid ${h ? "rgba(207,127,46,0.45)" : C.border}`,
        borderRadius: 10,
        padding: "clamp(24px,3vw,36px)",
        display: "flex",
        flexDirection: "column",
        transform: h ? "rotate(0deg) translateY(-6px)" : `rotate(${angle}deg)`,
        boxShadow: h
          ? "0 28px 56px -32px rgba(0,0,0,0.95), 0 8px 20px -12px rgba(207,127,46,0.3)"
          : "0 10px 30px -24px rgba(0,0,0,0.8)",
        transition: `all .55s ${EASE_CSS}`,
      }}
    >
      <div style={{ display: "flex", gap: 4, marginBottom: 18 }} aria-label="5 étoiles">
        {Array.from({ length: 5 }).map((_, s) => (
          <Star key={s} size={13} fill={C.accent} color={C.accent} strokeWidth={0} />
        ))}
      </div>
      <blockquote
        style={{
          fontFamily: DISPLAY,
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: "clamp(15px,1.4vw,17px)",
          lineHeight: 1.66,
          color: C.ink,
          margin: "0 0 22px",
          flex: 1,
          letterSpacing: "-0.01em",
        }}
      >
        «&nbsp;{a.texte}&nbsp;»
      </blockquote>
      <figcaption style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.white }}>{a.auteur}</div>
        <div style={{ fontSize: 11, color: C.accent, marginTop: 5, letterSpacing: "0.26em", textTransform: "uppercase" }}>
          {a.detail}
        </div>
      </figcaption>
    </figure>
  );
}
