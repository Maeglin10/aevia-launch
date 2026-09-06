"use client";
import { tr } from "@/lib/templates/uiStrings";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Clock, Eye, Mail, MapPin, Phone } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, useSlides } from "@/lib/templates/hero-kit-2";
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
  clientMethode,
  fusionnerEtapes,
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
   HORIZON PROTECTION — sécurité privée commerces & résidentiel · Toulouse

   Archétype H1 (split, média à droite) · paire P10 (Spectral + IBM Plex
   Sans) · palette institutionnelle #f4f7fa / bleu préfecture #2f6098 ·
   signature : L'INTERLETTRAGE EST LA VIGILANCE — tout le thème respire par
   le tracking, du kicker au mot du héros qui se resserre.

   Le geste TrackingCollapse est partagé avec 341 (auto-école, H6 sans photo,
   ton apaisé) et 357 (laboratoire, H9 rail de chiffres) : ici il s'applique
   au QUALIFICATIF de la présence — « discrète. », « attentive. »,
   « élégante. » — dans un split H1 clair et institutionnel, au rythme lent
   d'une ronde (DWELL.slow), et le resserrement est plus ample (0.38em →
   0.02em) : le mot se met au garde-à-vous.

   L'unique photographie du thème (la ronde devant un commerce) est conservée
   telle quelle, en repli du panneau média du héros ; aucune URL inventée.
   ════════════════════════════════════════════════════════════════════════════ */

let C: Record<string, string> = {
  bg: "#f4f7fa",
  bgAlt: "#e9eff5",
  bgDark: "#101a2c",
  bgDarkAlt: "#0a1220",
  bgCard: "#ffffff",
  accent: "var(--brand,#2f6098)",
  accentDark: "var(--brand-light,#234a77)",
  accentLight: "#dbe6f2",
  ink: "#141c2b",
  textMuted: "#4f5b6e",
  textFaint: "#8493a8",
  border: "#d7dfea",
  white: "#ffffff",
  /* Clé métier : le bleu pâle d'un écran de vidéosurveillance en veille. */
  veille: "rgba(47,96,152,0.08)",
  hi: "#9db8da",
};

/*
  La paire du plan (P10) : « Spectral » — la serif des rapports et des
  attestations — porte les titres ; « IBM Plex Sans » porte la lecture,
  et son dessin d'ingénierie va bien à un métier de consignes écrites.
*/
const SERIF = "'Spectral', Georgia, 'Times New Roman', serif";
const BODY = "'IBM Plex Sans', system-ui, -apple-system, sans-serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_CSS = "cubic-bezier(.16,1,.3,1)";

const NAV = [
  { l: "Services", h: "#services" },
  { l: "La méthode", h: "#methode" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* ── Données de démonstration — textes du thème, conservés ────────────────── */

const HERO_SOURCE = [
  {
    k: "Commerces",
    word: "discrète.",
    sub: "Prévention des vols, accueil-filtrage, fermetures accompagnées.",
  },
  {
    k: "Résidences",
    word: "attentive.",
    sub: "Rondes de nuit, gestion des accès, congés sereins.",
  },
  {
    k: "Événements privés",
    word: "élégante.",
    sub: "Mariages, soirées, vernissages : le calme en costume.",
  },
];
let HERO = HERO_SOURCE;

const SERVICES_SOURCE = [
  {
    titre: "Sécurité de commerce",
    desc: "Prévention des vols à l'étalage, accueil-filtrage discret, accompagnement des fermetures de caisse : l'agent qui connaît vos équipes et vos horaires.",
    tag: "Commerce",
    n: "01",
  },
  {
    titre: "Résidences & copropriétés",
    desc: "Rondes de nuit horodatées, gestion des accès et des entreprises, surveillance renforcée pendant les congés.",
    tag: "Résidentiel",
    n: "02",
  },
  {
    titre: "Événements privés",
    desc: "Mariages, anniversaires, vernissages : filtrage des invités, gestion des abords, discrétion contractuelle — costume, pas treillis.",
    tag: "Privé",
    n: "03",
  },
  {
    titre: "Interventions sur alarme",
    desc: "Levée de doute physique sous 20 minutes en agglomération toulousaine, compte rendu photo systématique.",
    tag: "Alarme",
    n: "04",
  },
  {
    titre: "Boutiques de luxe",
    desc: "Agents formés aux codes du retail haut de gamme : la sécurité fait partie de l'expérience client, pas contre elle.",
    tag: "Luxe",
    n: "05",
  },
  {
    titre: "Conseil sûreté",
    desc: "Audit des vulnérabilités, plan de sûreté, formation des équipes aux gestes qui évitent l'incident.",
    tag: "Conseil",
    n: "06",
  },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE = [
  {
    n: "01",
    t: "Comprendre le lieu",
    d: "Chaque site a sa clientèle, ses flux, ses heures sensibles : l'audit précède le planning.",
  },
  {
    n: "02",
    t: "Affecter, pas remplir",
    d: "L'agent est choisi pour le site — profil, présentation, langues. Et il y reste : la stabilité fait la vigilance.",
  },
  {
    n: "03",
    t: "Briefer par écrit",
    d: "Consignes signées, interlocuteurs nommés, procédures d'escalade claires.",
  },
  {
    n: "04",
    t: "Rendre compte",
    d: "Main courante électronique, incidents documentés sous 24 h, point mensuel avec vous.",
  },
];

const ENGAGEMENT_DEMO = [
  "Autorisation CNAPS affichée, agents titulaires de la carte professionnelle",
  "Agents salariés de l'entreprise — aucune sous-traitance en cascade",
  "Tenues adaptées au lieu : costume en boutique, uniforme en résidence",
  "RC professionnelle sécurité privée, attestations jointes à chaque devis",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

const TARIFS_DEMO = [
  {
    a: "Agent de prévention commerce",
    p: "dès 27 € HT/h",
    n: "Carté, formé retail, majoration samedi incluse dans le contrat annuel.",
  },
  {
    a: "Ronde de nuit résidence",
    p: "dès 42 € HT",
    n: "Passage horodaté + rapport photo, itinéraires variables.",
  },
  {
    a: "Événement privé (soirée)",
    p: "dès 240 € HT",
    n: "Par agent, briefing et repérage inclus.",
  },
  {
    a: "Audit sûreté",
    p: "offert",
    n: "Pour tout dispositif étudié — rapport remis dans tous les cas.",
  },
];
let TARIFS = TARIFS_DEMO;

const AVIS_SOURCE = [
  {
    texte:
      "Notre boutique du centre a divisé la démarque par trois, sans un seul incident client. L'agent connaît nos habituées, dit bonjour, et voit tout.",
    auteur: "Gérante, prêt-à-porter",
    detail: "Contrat commerce",
  },
  {
    texte:
      "Mariage de 200 invités : deux agents en costume, invisibles sur les photos, impeccables au filtrage. Un pique-assiette éconduit sans que personne ne s'en aperçoive.",
    auteur: "Wedding planner partenaire",
    detail: "Événement privé",
  },
  {
    texte:
      "Les rondes de nuit ont mis fin aux intrusions dans nos parkings. Le rapport photo mensuel présenté en AG a convaincu même les sceptiques du budget.",
    auteur: "Syndic, résidence Les Argoulets",
    detail: "Résidentiel",
  },
];
let AVIS_DEMO = AVIS_SOURCE;

const STATS_DEMO = [
  { value: "CNAPS", label: "Autorisation affichée" },
  { value: "60+", label: "Commerces sous contrat" },
  { value: "100 %", label: "Agents cartés et salariés" },
  { value: "4,9/5", label: "Satisfaction contrats annuels" },
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
      <span style={{ width: 40, height: 1, background: color, opacity: 0.8, flexShrink: 0 }} />
      <span
        style={{
          fontFamily: BODY,
          fontSize: 10.5,
          /* L'interlettrage-signature : le kicker est le plus espacé du thème. */
          letterSpacing: "0.40em",
          textTransform: "uppercase",
          color,
          fontWeight: 600,
        }}
      >
        {children}
      </span>
      {align === "center" && (
        <span style={{ width: 40, height: 1, background: color, opacity: 0.8, flexShrink: 0 }} />
      )}
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

/** Filet dégradé d'un pixel. */
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

/** Mot fantôme très espacé — la vigilance gravée dans la marge. */
function MotFantome({ children, top, right, left, size = "clamp(6rem,14vw,13rem)", dark = false }: any) {
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        top,
        right,
        left,
        fontFamily: BODY,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 0.9,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: dark ? C.hi : C.accent,
        opacity: 0.06,
        pointerEvents: "none",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function BoutonConsigne({ href, children, plein = true, large = false }: any) {
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
        fontSize: large ? 14.5 : 13.5,
        fontWeight: 600,
        letterSpacing: "0.08em",
        textDecoration: "none",
        borderRadius: 3,
        border: `1px solid ${plein ? (h ? C.accentDark : C.accent) : h ? C.accent : C.border}`,
        background: plein ? (h ? C.accentDark : C.accent) : h ? C.accentLight : C.white,
        color: plein ? "#fff" : C.accentDark,
        transform: h ? "translateY(-3px)" : "none",
        boxShadow: h
          ? "0 18px 42px -18px rgba(47,96,152,0.55), 0 3px 12px -8px rgba(16,26,44,0.35)"
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
        letterSpacing: hov ? "0.10em" : "0.05em",
        color: hov ? C.ink : C.textMuted,
        textDecoration: "none",
        padding: "12px 2px",
        transition: `color .45s ${EASE_CSS}, letter-spacing .45s ${EASE_CSS}`,
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
export default function HorizonProtectionPage() {
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

  /*
    Le mot animé du héros ne peut pas porter une phrase : c'est le sous-titre
    de la première diapositive qui reçoit l'accroche du client. Le mot final
    appartient au titre — sans lui, un plombier finissait la phrase d'une
    société de gardiennage.
  */
  HERO = clientTagline(sessionData)
    ? HERO_SOURCE.map((h, i) => ({
        ...h,
        ...(i === 0 ? { sub: clientTagline(sessionData)! } : {}),
        word: clientServices(sessionData)?.[i]?.title || clientHeroLine(sessionData, 1, 2, 14) || h.word,
      }))
    : HERO_SOURCE;
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
    Un seul index pilote tout le héros : le mot qui se resserre, le secteur
    nommé dans la bande basse, la fiche du panneau média, la fraction.
    DWELL.slow — le rythme d'une ronde, pas d'un diaporama.
  */
  const { i, go } = useSlides(HERO.length, DWELL.slow);
  const S = HERO[i];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = clientPhone(sessionData) ?? fd?.phone ?? "05 61 00 00 01";
  const telHref = `tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33561000001").replace(/\s+/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "contact@horizon-protection.fr";
  const nom = fd?.businessName ?? clientName(sessionData) ?? "Horizon Protection";
  const ville = clientCity(sessionData) ?? "Toulouse";
  const metier = clientTrade(sessionData) ?? "Sécurité privée";

  /* La première ligne du titre — calibrée courte, le mot suivi fait le reste. */
  const ligne1 = clientHeroLine(sessionData, 0, 2, 14) ?? "Une présence";

  /*
    L'unique photographie du thème sert de repli au panneau média du split ;
    sans elle, le panneau reste un tableau de veille dessiné en CSS.
  */
  const heroImg = photo(
    0,
    "https://images.pexels.com/photos/18530592/pexels-photo-18530592.jpeg?auto=compress&cs=tinysrgb&w=1400",
  );
  const panneauImg = photo(1, "") || "https://images.pexels.com/photos/5589597/pexels-photo-5589597.jpeg?auto=compress&cs=tinysrgb&w=1600";

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: BODY, overflowX: "clip" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');

        .i372-navrow { display: flex; gap: clamp(14px,2vw,28px); align-items: center; }
        /*
          ── Héros « carte flottante en débord » ────────────────────────────
          Le retour caméra tient un cadre à droite ; la carte de consigne le
          franchit par la gauche. Miroir de la carte d'impact-362, à dix
          crans, sur moniteur clair et non sur bascule sombre.
        */
        .i372-cadre {
          position: absolute;
          top: clamp(84px, 10.5vh, 116px);
          right: 0;
          bottom: 0;
          left: 30%;
          overflow: hidden;
        }
        .i372-carte {
          position: relative;
          z-index: 2;
          width: min(520px, 44%);
          margin-left: clamp(20px, 5vw, 72px);
          background: ${C.bgCard};
          border: 1px solid ${C.border};
          border-right: 3px solid ${C.accent};
          border-radius: 4px;
          box-shadow: 0 60px 120px -60px rgba(16,26,44,0.6);
          padding: clamp(22px, 2.8vw, 38px);
        }
        /* Sous 620 px, le libellé du métier vole la place au nom du client,
           qui se casse alors en trois morceaux dans la barre. */
        @media (max-width: 620px) { .i372-metier { display: none !important; } }
        @media (max-width: 900px) {
          .i372-herosec { display: block !important; }
          .i372-cadre { position: absolute; inset: 0 0 auto 0; top: 0; left: 0; height: 42dvh; }
          .i372-carte { width: auto; margin: calc(42dvh - 50px) 14px 20px; }
        }
        .i372-split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(32px,5vw,72px); align-items: center; }
        .i372-stats { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); }
        .i372-serv { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(280px,100%),1fr)); gap: clamp(16px,2vw,26px); }
        .i372-avis { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(280px,100%),1fr)); gap: clamp(18px,2.4vw,30px); align-items: start; }

        /* Le point de veille du panneau média : seule boucle du thème. */
        @keyframes i372-pulse { 0%,100% { opacity: .35; transform: scale(1); } 50% { opacity: 1; transform: scale(1.25); } }
        .i372-pulse { animation: i372-pulse 3.4s ${EASE_CSS} infinite; }
        @media (prefers-reduced-motion: reduce) { .i372-pulse { animation: none; opacity: .7; } }

        @media (max-width: 980px) {
          .i372-hero { grid-template-columns: 1fr !important; }
          .i372-heromedia { max-width: 520px; }
        }
        @media (max-width: 900px) {
          #i372-nav { display: none !important; }
          .i372-burger { display: flex !important; }
          .aevia-action-mobile { display: inline-flex !important; }
          .i372-split { grid-template-columns: 1fr !important; }
          .i372-split > * { order: initial !important; }
        }
        @media (max-width: 860px) {
          .i372-stats { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .i372-statcell { border-left: none !important; }
          .i372-tarifrow { flex-direction: column; align-items: flex-start !important; }
          .i372-avisdecale { margin-top: 0 !important; }
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
          /* Transparente sur une photo de rue très claire, la barre laissait
             disparaître le nom et le libellé du métier. Un voile les porte. */
          background: scrolled
            ? "rgba(244,247,250,0.92)"
            : "linear-gradient(180deg, rgba(10,20,34,0.60) 0%, rgba(10,20,34,0.26) 65%, transparent 100%)",
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
              <Eye size={17} color={C.accent} style={{ flexShrink: 0 }} />
              <span
                style={{
                  fontFamily: SERIF,
                  fontWeight: 600,
                  fontSize: 19,
                  letterSpacing: "0.01em",
                  /* Le nom suit l'état de défilement, comme le fond de la barre :
                     sombre il disparaissait sur la photo de rue. */
                  color: scrolled ? C.ink : "#fff",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {nom}
              </span>
              <span
                className="i372-metier"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: scrolled ? C.textFaint : "rgba(255,255,255,0.78)",
                  marginLeft: 8,
                  whiteSpace: "nowrap",
                }}
              >
                {metier}
              </span>
            </>
          )}
        </div>
        <div id="i372-nav" className="i372-navrow">
          {NAV.map((n) => (
            <NavLien key={n.l} l={n.l} h={n.h} />
          ))}
          <BoutonConsigne href={telHref}>Devis dispositif</BoutonConsigne>
        </div>
        {/* L'appel à l'action sous le pouce : la barre est fixe, mais son
            bouton vit dans le menu déroulant, en display:none sous le point
            de rupture. Celui-ci paraît exactement avec le bouton de menu. */}
        <ActionMobile href={telHref} fond={C.accent} encre={"#fff"}>
          Appeler
        </ActionMobile>
        <button
          className="i372-burger"
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
            top: 60,
            left: 0,
            right: 0,
            zIndex: 99,
            background: C.bg,
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
              color: "#fff",
              borderRadius: 3,
              padding: "14px 22px",
              fontSize: 15,
              fontWeight: 700,
              textDecoration: "none",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            Devis dispositif
          </a>
        </div>
      )}

      {/* ── HÉROS — H1 split, média à droite, TrackingCollapse ──────────── */}
      <section
        id="hero"
        className="i372-herosec"
        style={{ position: "relative", minHeight: "100dvh", display: "flex", alignItems: "center", overflow: "hidden" }}
      >
        {/* ── HERO — carte flottante en débord ─────────────────────────────
               Le retour de vidéosurveillance tient un cadre sur la droite de
               l'écran ; la consigne se pose dessus et franchit son bord
               gauche. La grille texte-à-gauche / panneau-à-droite était la
               charpente de la série. Le geste TrackingCollapse reste, dans
               la carte. */}
        <TitreDeLaPage session={sessionData} />
        {/* La trame de veille : le quadrillage pâle d'un moniteur. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: `linear-gradient(${C.veille} 1px, transparent 1px), linear-gradient(90deg, ${C.veille} 1px, transparent 1px)`,
            backgroundSize: "88px 88px",
            maskImage: "radial-gradient(ellipse at 20% 30%, #000 0%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at 20% 30%, #000 0%, transparent 70%)",
          }}
        />
        <MotFantome top="10%" left="-2%">
          VIGILANCE
        </MotFantome>

        {/* ── Le cadre : le retour caméra, à droite ──────────────────────── */}
        <div className="i372-cadre">
          {heroImg ? (
            <img
              src={heroImg}
              alt="Agent en ronde devant un commerce"
              loading="eager"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(165deg, ${C.bgDark} 0%, ${C.bgDarkAlt} 100%)`,
                backgroundImage: `linear-gradient(rgba(157,184,218,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(157,184,218,0.10) 1px, transparent 1px)`,
                backgroundSize: "36px 36px",
              }}
            />
          )}
          {/* Le voile s'épaissit vers la gauche, là où la carte se pose. */}
          <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(260deg, rgba(10,18,32,0.12) 0%, rgba(10,18,32,0.04) 44%, rgba(10,18,32,0.6) 100%)" }} />

          {/* La réglette de veille, en pied de cadre. */}
          <div
            style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: "rgba(10,18,32,0.88)", borderTop: `1px solid rgba(157,184,218,0.22)`, padding: "12px 18px", display: "flex", alignItems: "center", gap: 12 }}
          >
            <span aria-hidden className="i372-pulse" style={{ width: 7, height: 7, borderRadius: 999, background: C.hi, flexShrink: 0 }} />
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE }}
              style={{ fontSize: 10.5, letterSpacing: "0.30em", textTransform: "uppercase", color: "rgba(255,255,255,0.78)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}
            >
              {S?.k} · {ville}
            </motion.span>
            {/* La fraction ne disait pas ce qu'on regardait ; ces traits
                mènent directement à chaque dispositif. */}
            <div style={{ display: "flex", gap: 8, marginLeft: "auto", flexShrink: 0 }}>
              {HERO.map((h: any, n: number) => (
                <button
                  key={h.k ?? n}
                  type="button"
                  onClick={() => go(n)}
                  aria-label={h.k ?? `Dispositif ${n + 1}`}
                  aria-current={n === i}
                  style={{ width: 30, height: 3, padding: 0, border: "none", cursor: "pointer", background: n === i ? C.hi : "rgba(255,255,255,0.3)", transition: "background .3s" }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── LA CARTE — la consigne, elle franchit le bord du cadre ─────── */}
        <div className="i372-carte">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
            <Kicker>{clientEyebrow(sessionData) ?? `${metier} · ${ville}`}</Kicker>
          </motion.div>

          {/* ── GESTE : TrackingCollapse — le qualificatif se resserre. ── */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.055, ease: EASE }}
            style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(2rem,3.6vw,3.4rem)", lineHeight: 1.02, letterSpacing: "-0.018em", color: C.ink, margin: "clamp(16px,2.2vw,26px) 0 0", overflowWrap: "break-word" }}
          >
            {ligne1}
            <TrackingCollapse word={S.word} index={i} from="0.38em" to="0.02em" style={{ color: C.accentDark, marginTop: 6 }} />
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.11, ease: EASE }}
            style={{ fontSize: "clamp(14px,1.15vw,16px)", color: C.textMuted, lineHeight: 1.78, margin: "clamp(16px,2vw,24px) 0 clamp(20px,2.6vw,30px)" }}
          >
            {clientHeroPrestations(sessionData) ??
              c?.heroSubline ??
              "Commerces de centre-ville, résidences, événements privés : des agents formés à la relation autant qu'à la vigilance. La sécurité qui rassure vos clients au lieu de les inquiéter."}
          </motion.p>

          {/* Une seule action pleine ; les services restent un lien. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.165, ease: EASE }}
            style={{ display: "flex", gap: "clamp(16px,2vw,24px)", flexWrap: "wrap", alignItems: "center" }}
          >
            <BoutonConsigne href={telHref} large>
              Étudier votre besoin
            </BoutonConsigne>
            <a href="#services" style={{ fontSize: 13, color: C.ink, textDecoration: "none", borderBottom: `1px solid ${C.accent}`, paddingBottom: 3 }}>
              Nos services
            </a>
          </motion.div>

          {/* Le cartouche d'autorisation, en pied de carte. */}
          <div style={{ marginTop: "clamp(20px,2.6vw,30px)", paddingTop: 16, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
            <span style={{ fontSize: 9.5, letterSpacing: "0.32em", textTransform: "uppercase", color: C.accent, fontWeight: 600 }}>
              CNAPS
            </span>
            <span style={{ fontSize: 11, color: C.textMuted, letterSpacing: "0.06em" }}>
              Autorisation affichée
            </span>
          </div>
        </div>
      </section>

      {/* ── RESPIRATION ─────────────────────────────────────────────────── */}
      <section
        style={{
          background: C.bg,
          padding: "clamp(66px,9vw,116px) clamp(24px,8vw,140px)",
          textAlign: "center",
        }}
      >
        <Reveal>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: "clamp(1.4rem,3vw,2.5rem)",
              lineHeight: 1.34,
              letterSpacing: "-0.01em",
              color: C.ink,
              maxWidth: 860,
              margin: "0 auto",
            }}
          >
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (
              <>
                La meilleure sécurité est celle que{" "}
                <span style={{ color: C.accentDark }}>vos clients ne remarquent pas</span>.
              </>
            )}
          </p>
        </Reveal>
        <Reveal delay={0.14}>
          <div style={{ width: 1, height: 64, background: `linear-gradient(${C.accent}, transparent)`, margin: "38px auto 0" }} />
        </Reveal>
      </section>

      {/* ── CHIFFRES — bande sombre filetée ─────────────────────────────── */}
      <section style={{ background: C.bgDark, position: "relative", overflow: "hidden" }}>
        <MotFantome top="-16%" right="1%" size="clamp(6rem,12vw,11rem)" dark>
          24/7
        </MotFantome>
        <div className="i372-stats" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(20px,5vw,56px)", position: "relative" }}>
          {STATS.map((s: any, idx: number) => (
            <Reveal key={s.label ?? idx} delay={idx * 0.055}>
              <div
                className="i372-statcell"
                style={{
                  padding: "clamp(26px,3vw,42px) clamp(12px,1.6vw,24px)",
                  borderLeft: idx === 0 ? "none" : "1px solid rgba(157,184,218,0.16)",
                }}
              >
                <div
                  style={{
                    fontFamily: SERIF,
                    fontWeight: 600,
                    fontSize: "clamp(22px,2.6vw,34px)",
                    color: C.hi,
                    lineHeight: 1,
                    letterSpacing: "0.02em",
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", marginTop: 9, lineHeight: 1.55, letterSpacing: "0.05em" }}>
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── SERVICES — colonnes filetées ────────────────────────────────── */}
      <section
        id="services"
        style={{
          background: C.bgAlt,
          padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <Kicker>{tr(sessionData, "Services")}</Kicker>
            <h2
              style={{
                fontFamily: SERIF,
                fontWeight: 600,
                fontSize: "clamp(1.9rem,3.9vw,3.1rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.018em",
                color: C.ink,
                margin: "22px 0 clamp(34px,4.4vw,56px)",
                maxWidth: 720,
              }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                <>
                  Protéger sans
                  <br />
                  <em style={{ fontStyle: "italic", color: C.accentDark }}>transformer le lieu en bunker.</em>
                </>
              )}
            </h2>
          </Reveal>

          <div className="i372-serv">
            {SERVICES.map((s: any, idx: number) => (
              <Reveal key={s.titre ?? idx} delay={(idx % 3) * 0.055}>
                <ColonneService s={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── LA MÉTHODE — consignes numérotées sur registre ──────────────── */}
      <section
        id="methode"
        style={{
          background: C.bg,
          padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <MotFantome top="4%" right="-1%" size="clamp(7rem,15vw,14rem)">
          §
        </MotFantome>
        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <Kicker>La méthode</Kicker>
            <h2
              style={{
                fontFamily: SERIF,
                fontWeight: 600,
                fontSize: "clamp(1.9rem,3.9vw,3.1rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.018em",
                color: C.ink,
                margin: "22px 0 clamp(34px,4.4vw,54px)",
                maxWidth: 700,
              }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                <>
                  Des agents qui savent
                  <br />
                  <em style={{ fontStyle: "italic", color: C.accentDark }}>à qui ils parlent.</em>
                </>
              )}
            </h2>
          </Reveal>

          <Filet />
          {resolveList(fusionnerEtapes(METHODE, clientMethode(sessionData)), METHODE).map((m, idx) => (
            <Reveal key={m.n} delay={idx * 0.055}>
              <ArticleConsigne m={m} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── GARANTIES — panneau de veille + liste ───────────────────────── */}
      <section
        id="engagements"
        style={{
          background: C.bgAlt,
          padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)",
        }}
      >
        <div className="i372-split" style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            {/* Second emplacement photo. Sans image, le panneau reste un
                tableau d'attestations dessiné — jamais un rectangle vide. */}
            <div
              style={{
                position: "relative",
                border: `1px solid ${C.border}`,
                borderRadius: 4,
                overflow: "hidden",
                aspectRatio: "4/3",
                background: `linear-gradient(150deg, ${C.accentLight} 0%, ${C.bg} 100%)`,
              }}
            >
              {panneauImg ? (
                <img
                  src={panneauImg}
                  alt="Agent de sécurité en poste devant un commerce"
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
                    <Eye size={30} color={C.accent} strokeWidth={1.2} />
                    <span
                      style={{
                        fontFamily: SERIF,
                        fontWeight: 600,
                        fontSize: "clamp(15px,1.8vw,20px)",
                        letterSpacing: "0.24em",
                        textTransform: "uppercase",
                        color: C.ink,
                      }}
                    >
                      Main courante
                    </span>
                    <span style={{ fontSize: 12, color: C.textFaint, letterSpacing: "0.16em" }}>
                      Électronique · consultable
                    </span>
                  </div>
                </>
              )}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  background: "rgba(10,18,32,0.86)",
                  borderTop: "1px solid rgba(157,184,218,0.22)",
                  borderRight: "1px solid rgba(157,184,218,0.22)",
                  padding: "10px 18px",
                  fontSize: 10.5,
                  letterSpacing: "0.30em",
                  textTransform: "uppercase",
                  color: C.hi,
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
                  fontFamily: SERIF,
                  fontWeight: 600,
                  fontSize: "clamp(1.8rem,3.4vw,2.7rem)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.018em",
                  color: C.ink,
                  margin: "20px 0 28px",
                }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>
                    La discrétion
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accentDark }}>n'exclut pas la rigueur.</em>
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
                <BoutonConsigne href={telHref}>Nous appeler</BoutonConsigne>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TARIFS — registre à lignes fines ────────────────────────────── */}
      <section
        id="tarifs"
        style={{
          background: C.bg,
          padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 1020, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <Kicker>Tarifs</Kicker>
            <h2
              style={{
                fontFamily: SERIF,
                fontWeight: 600,
                fontSize: "clamp(1.9rem,3.7vw,3rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.018em",
                color: C.ink,
                margin: "22px 0 14px",
              }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                <>
                  Des contrats clairs, <em style={{ fontStyle: "italic", color: C.accentDark }}>des heures déclarées.</em>
                </>
              )}
            </h2>
            <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 620, lineHeight: 1.78, margin: 0 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.texte") ??
                "Nos tarifs couvrent des agents déclarés, formés et encadrés. En dessous d'un certain prix, c'est vous qui portez le risque juridique — nous l'écrivons dans chaque devis."}
            </p>
          </Reveal>

          <div style={{ marginTop: "clamp(30px,4vw,52px)" }}>
            <Filet />
            {TARIFS.map((t: any, idx: number) => (
              <Reveal key={t.a ?? idx} delay={idx * 0.05}>
                <LigneTarif t={t} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVIS — colonnes décalées sur fond de veille ─────────────────── */}
      <section
        style={{
          background: C.bgDark,
          padding: "clamp(76px,10vw,140px) clamp(20px,5vw,64px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "-24%",
            right: "-10%",
            width: "60vw",
            height: "60vw",
            maxWidth: 860,
            maxHeight: 860,
            background: `radial-gradient(circle, ${C.hi} 0%, transparent 62%)`,
            opacity: 0.08,
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Kicker color={C.hi} align="center">
                  Ils sont protégés
                </Kicker>
              </div>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontWeight: 600,
                  fontSize: "clamp(1.8rem,3.7vw,2.9rem)",
                  lineHeight: 1.06,
                  letterSpacing: "-0.018em",
                  color: "#fff",
                  margin: "22px auto clamp(34px,4.6vw,58px)",
                  maxWidth: 700,
                }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                  <>
                    Protégés, <em style={{ fontStyle: "italic", color: C.hi }}>sereinement</em>.
                  </>
                )}
              </h2>
            </div>
          </Reveal>

          <div className="i372-avis">
            {AVIS.map((a: any, idx: number) => (
              <Reveal key={a.auteur ?? idx} delay={idx * 0.09}>
                <CarteAvis a={a} decale={idx % 2 === 1} />
              </Reveal>
            ))}
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
              <Kicker align="center">Parlons-en</Kicker>
            </div>
            <h2
              style={{
                fontFamily: SERIF,
                fontWeight: 600,
                fontSize: "clamp(2rem,4.2vw,3.3rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.018em",
                color: C.ink,
                margin: "22px 0 18px",
              }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                <>
                  La sécurité se prépare
                  <br />
                  <em style={{ fontStyle: "italic", color: C.accentDark }}>avant d'être nécessaire.</em>
                </>
              )}
            </h2>
            <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 480, margin: "0 auto 38px", lineHeight: 1.75 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ??
                "Audit de sûreté offert, devis sous 72 h. PC opérationnel joignable 24h/24 pour nos clients sous contrat."}
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <BoutonConsigne href={telHref} large>
                <Phone size={16} style={{ marginRight: 2 }} /> {phone}
              </BoutonConsigne>
              <BoutonConsigne href={`mailto:${mail}`} plein={false} large>
                <Mail size={16} style={{ marginRight: 2 }} /> Nous écrire
              </BoutonConsigne>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PIED DE PAGE ────────────────────────────────────────────────── */}
      <footer style={{ background: C.bgDarkAlt, padding: "clamp(44px,6vw,68px) clamp(20px,5vw,64px) 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 34, marginBottom: 36 }}>
            <div style={{ minWidth: 240 }}>
              <div
                style={{
                  fontFamily: SERIF,
                  fontWeight: 600,
                  fontSize: 20,
                  color: C.hi,
                  marginBottom: 10,
                  letterSpacing: "0.02em",
                }}
              >
                {nom}
              </div>
              <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 13, lineHeight: 1.75, margin: 0, maxWidth: 380 }}>
                {metier} · {clientCodePostalVille(sessionData, "", ville)}
                <br />
                {clientName(sessionData) ? "Autorisation CNAPS affichée — agents cartés" : "Autorisation CNAPS AUT-031-2126-02-20-20260045678 — agents cartés"}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <MapPin size={13} />, t: clientAddress(sessionData) ?? (clientCity(sessionData) ? ville : `${ville}, Haute-Garonne`) },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Mail size={13} />, t: mail },
                { icon: <Clock size={13} />, t: "PC 24h/24 · bureaux Lun–Ven 9h–18h" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 11, color: "rgba(255,255,255,0.42)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.hi }}>{item.icon}</span>
                  {item.t}
                </div>
              ))}
            </div>
          </div>
          <Filet />
          <div style={{ paddingTop: 18, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ color: "rgba(255,255,255,0.30)", fontSize: 12 }}>
              © 2026 {nom} — Site réalisé par Aevia WS · SIREN{" "}
              <LegalIdentity fallback="852 546 225" kind="siren" />
              {/* VILLE_PIED */}
              {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ color: "rgba(255,255,255,0.30)", fontSize: 12 }}>
              Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Sous-composants à état local ─────────────────────────────────────────── */

/** Une colonne de service : filet en tête qui s'épaissit au survol. */
function ColonneService({ s }: any) {
  const [h, setH] = useState(false);
  return (
    <article
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        position: "relative",
        background: h ? C.bgCard : "transparent",
        borderTop: `2px solid ${h ? C.accent : C.border}`,
        padding: "clamp(22px,2.6vw,30px) clamp(16px,2vw,24px) clamp(24px,2.8vw,32px)",
        height: "100%",
        transform: h ? "translateY(-6px)" : "none",
        boxShadow: h
          ? "0 28px 56px -36px rgba(16,26,44,0.4), 0 5px 16px -12px rgba(16,26,44,0.25)"
          : "none",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, marginBottom: 14 }}>
        <span
          aria-hidden
          style={{
            fontFamily: BODY,
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.24em",
            color: C.accent,
            opacity: h ? 1 : 0.55,
            transition: `opacity .5s ${EASE_CSS}`,
          }}
        >
          {s.n}
        </span>
        <span
          style={{
            fontSize: 9.5,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.26em",
            color: C.textFaint,
            whiteSpace: "nowrap",
          }}
        >
          {s.tag}
        </span>
      </div>
      <h3
        style={{
          fontFamily: SERIF,
          fontWeight: 600,
          fontSize: "clamp(17px,1.8vw,21px)",
          color: C.ink,
          margin: "0 0 10px",
          letterSpacing: "-0.012em",
        }}
      >
        {s.titre}
      </h3>
      <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
    </article>
  );
}

/** Un article de consigne : numéro à gauche, texte à droite, registre. */
function ArticleConsigne({ m }: any) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "flex",
        gap: "clamp(18px,3vw,44px)",
        alignItems: "flex-start",
        padding: "clamp(24px,3vw,36px) clamp(8px,1.6vw,20px)",
        borderBottom: `1px solid ${C.border}`,
        background: h ? C.bgCard : "transparent",
        transform: h ? "translateX(8px)" : "none",
        boxShadow: h
          ? `inset 2px 0 0 0 ${C.accent}, 0 20px 44px -32px rgba(16,26,44,0.4)`
          : "none",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      <span
        aria-hidden
        style={{
          flexShrink: 0,
          fontFamily: SERIF,
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: "clamp(24px,2.6vw,36px)",
          color: C.accent,
          opacity: h ? 0.95 : 0.4,
          lineHeight: 1,
          minWidth: 56,
          transition: `opacity .5s ${EASE_CSS}`,
        }}
      >
        {m.n}
      </span>
      <div style={{ minWidth: 0 }}>
        <h3
          style={{
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: "clamp(17px,1.8vw,22px)",
            color: C.ink,
            margin: "0 0 9px",
            letterSpacing: "-0.012em",
          }}
        >
          {m.t}
        </h3>
        <p style={{ fontSize: 14.5, color: C.textMuted, lineHeight: 1.78, margin: 0, maxWidth: 640 }}>{m.d}</p>
      </div>
    </div>
  );
}

/** Une ligne du registre des tarifs. */
function LigneTarif({ t }: any) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className="i372-tarifrow"
      style={{
        display: "flex",
        gap: 18,
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "clamp(20px,2.4vw,30px) clamp(8px,1.4vw,18px)",
        borderBottom: `1px solid ${C.border}`,
        background: h ? C.bgCard : "transparent",
        transform: h ? "translateX(6px)" : "none",
        boxShadow: h ? `inset 2px 0 0 0 ${C.accent}, 0 14px 34px -26px rgba(16,26,44,0.4)` : "none",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      <div style={{ minWidth: 0, flex: "1 1 320px" }}>
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "clamp(16px,1.6vw,19px)", color: C.ink, letterSpacing: "-0.012em" }}>
          {t.a}
        </div>
        <div style={{ fontSize: 13.5, color: C.textMuted, marginTop: 7, lineHeight: 1.65, maxWidth: 540 }}>{t.n}</div>
      </div>
      <div
        style={{
          fontFamily: SERIF,
          fontWeight: 600,
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

/** Une carte d'avis en colonne décalée, sur la bande sombre. */
function CarteAvis({ a, decale }: any) {
  const [h, setH] = useState(false);
  return (
    <figure
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className={decale ? "i372-avisdecale" : ""}
      style={{
        margin: 0,
        marginTop: decale ? 44 : 0,
        background: h ? "rgba(157,184,218,0.10)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${h ? "rgba(157,184,218,0.34)" : "rgba(157,184,218,0.16)"}`,
        borderRadius: 4,
        padding: "clamp(24px,3vw,36px) clamp(20px,2.6vw,30px)",
        height: "100%",
        boxSizing: "border-box",
        transform: h ? "translateY(-6px)" : "none",
        boxShadow: h
          ? "0 30px 60px -40px rgba(0,0,0,0.85), 0 6px 18px -12px rgba(0,0,0,0.6)"
          : "none",
        transition: `all .5s ${EASE_CSS}`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <span
        aria-hidden
        style={{
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: 44,
          lineHeight: 0.6,
          color: C.hi,
          opacity: 0.5,
          display: "block",
          marginBottom: 18,
        }}
      >
        «
      </span>
      <blockquote
        style={{
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: "clamp(15px,1.5vw,17.5px)",
          lineHeight: 1.68,
          color: "rgba(255,255,255,0.88)",
          margin: "0 0 24px",
          flex: 1,
        }}
      >
        {a.texte}
      </blockquote>
      <figcaption style={{ borderTop: "1px solid rgba(157,184,218,0.16)", paddingTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", letterSpacing: "0.03em" }}>{a.auteur}</div>
        <div
          style={{
            fontSize: 10.5,
            color: C.hi,
            marginTop: 6,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
          }}
        >
          {a.detail}
        </div>
      </figcaption>
    </figure>
  );
}
