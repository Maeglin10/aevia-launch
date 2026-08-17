"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Mail,
  MapPin,
  Phone,
  Stethoscope,
} from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { PanelRise } from "@/lib/templates/hero-kit-3";
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
  clientMethode,
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
   {clientName(sessionData) ?? "Cabinet des Tilleuls"} — Infirmiers libéraux · Limoges

   Geste signature : PanelRise. Le bandeau sombre de la tournée monte par-dessus
   le héros au défilement, comme un volet qu'on relève sur la journée qui
   commence. Rien d'autre ne bouge tout seul dans la page : le reste est du
   survol et de la révélation à l'entrée.

   Archétype H1 (split média à droite) · fontes P10 (Spectral + IBM Plex Sans)
   · palette #f2f7f6 / #0f766e.

   Dessin qui s'écarte du squelette : les prestations sont des RANGÉES
   éditoriales numérotées (pas des cartes), les tarifs une TABLE fine, les avis
   un SPOTLIGHT qu'on fait défiler à la main, et les chiffres vivent dans le
   volet, pas dans une bande neutre.
   ════════════════════════════════════════════════════════════════════════════ */

const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,600;1,300;1,400&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');`;

const SERIF = "'Spectral', Georgia, 'Times New Roman', serif";
const SANS = "'IBM Plex Sans', system-ui, -apple-system, 'Segoe UI', sans-serif";

/* Une seule courbe pour toute la page — reprise à l'identique en CSS. */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_CSS = "cubic-bezier(.16,1,.3,1)";

let C: Record<string, string> = {
  bg: "#f2f7f6",
  bgAlt: "#e6efec",
  bgCard: "#ffffff",
  bgDark: "#0d2b26",
  bgDarkAlt: "#08201c",
  accent: "var(--brand, #0f766e)",
  accentDark: "var(--brand-light, #0b5b55)",
  accentLight: "#d7ebe6",
  ink: "#0f1f1c",
  textMuted: "#4d6360",
  textFaint: "#8ba29e",
  border: "#d5e3df",
  white: "#ffffff",
  /* Clé métier : le vert clair du dossier de soins, lisible sur le volet. */
  soin: "#7fc7a4",
};

const NAV = [
  { l: "Soins", h: "#services" },
  { l: "La tournée", h: "#methode" },
  { l: "Prise en charge", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* ── Contenu rédactionnel du thème (conservé mot pour mot) ───────────────── */

const SERVICES_SOURCE = [
  { titre: "Prises de sang", desc: "À domicile dès 6h30 (à jeun sans attendre midi) ou au cabinet sans rendez-vous de 7h à 9h. Résultats via votre laboratoire habituel.", tag: "Prélèvements" },
  { titre: "Pansements & plaies", desc: "Post-opératoires, ulcères, brûlures : protocoles suivis avec photos sécurisées transmises au médecin quand la plaie évolue.", tag: "Plaies" },
  { titre: "Injections & perfusions", desc: "Antibiothérapie, anticoagulants, chimiothérapie à domicile en lien avec l'hôpital : le retour à la maison, sécurisé.", tag: "Perfusions" },
  { titre: "Soins chroniques & dépendance", desc: "Diabète, piluliers, nursing : des passages réguliers aux mêmes heures, par les mêmes visages. La routine qui rassure.", tag: "Chronique" },
  { titre: "Soins palliatifs", desc: "En coordination avec l'HAD et les équipes mobiles : rester chez soi, entouré, jusqu'au bout si c'est le choix de la famille.", tag: "Palliatif" },
  { titre: "Vaccins & dépistages", desc: "Grippe, COVID, TROD angine : au cabinet ou à domicile, tracés dans votre dossier.", tag: "Prévention" },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE_SOURCE = [
  { n: "01", t: "Ordonnance transmise", d: "Par photo, mail ou papier : nous vérifions la cotation et prévenons votre médecin si quelque chose manque." },
  { n: "02", t: "Passage planifié", d: "Un créneau fiable, les mêmes infirmiers, prévenance par SMS si la tournée glisse de plus de 20 minutes." },
  { n: "03", t: "Soin tracé", d: "Chaque acte noté au dossier de soins, partagé entre nous quatre — pas de « c'était qui hier ? »." },
  { n: "04", t: "Coordination", d: "Médecin, kiné, pharmacie, HAD : nous parlons aux autres soignants, vous n'avez pas à porter les messages." },
];

function ENGAGEMENT_DEMO_LIVE() {
  return [
    "Infirmiers diplômés d'État, inscrits à l'Ordre national — n° RPPS affichés au cabinet",
    "Conventionnés CPAM secteur 1 : tarifs de la nomenclature, tiers payant systématique",
    "Dossier de soins partagé et sécurisé entre les quatre infirmiers du cabinet",
    "Zone d'intervention claire : " + (clientCity(sessionData) ?? "Limoges") + " et première couronne, annoncée avant d'accepter",
  ];
}
let ENGAGEMENT_DEMO = ENGAGEMENT_DEMO_LIVE();
let ENGAGEMENT = ENGAGEMENT_DEMO;

const TARIFS_SOURCE = [
  { a: "Prise de sang à domicile", p: "tiers payant", n: "Sur ordonnance : AMI + indemnité de déplacement, sans avance de frais." },
  { a: "Pansement complexe", p: "tiers payant", n: "Coté selon la NGAP, protocole suivi et transmis au prescripteur." },
  { a: "Passage quotidien chronique", p: "tiers payant", n: "Diabète, piluliers, nursing : pris en charge sur prescription." },
  { a: "Vaccin au cabinet (sans RDV)", p: "selon nomenclature", n: "Grippe : apportez le vaccin et votre bon, l'injection est prise en charge." },
];
let TARIFS = TARIFS_SOURCE;

const AVIS_SOURCE = [
  { texte: "Perfusions d'antibiotiques après une hospitalisation : passage deux fois par jour, à l'heure, les mêmes visages. La coordination avec l'hôpital était parfaite.", auteur: "René B., 74 ans", detail: "Retour d'hospitalisation" },
  { texte: "Ma mère diabétique voit la même infirmière chaque matin depuis deux ans. Ce lien-là fait autant que l'insuline.", auteur: "Fille de Mme T.", detail: "Soins chroniques" },
  { texte: "Prise de sang à 6h45 à domicile avant le travail : le laboratoire avait les tubes à 8h. Efficace, aimable, remboursé.", auteur: "Karima L.", detail: "Prélèvement à jeun" },
];
let AVIS_DEMO = AVIS_SOURCE;

const STATS_SOURCE = [
  { value: "4", label: "Infirmiers D.E. conventionnés" },
  { value: "7j/7", label: "Pour les soins quotidiens" },
  { value: "6h30", label: "Première tournée (à jeun compris)" },
  { value: "100 %", label: "Tiers payant sur ordonnance" },
];
let STATS = STATS_SOURCE;

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

function Reveal({
  children,
  delay = 0,
  y = 28,
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
      transition={{ duration: 0.85, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Kicker : filet de 40×1 px puis capitales très espacées. */
function Kicker({
  children,
  color = C.accentDark,
  align = "left",
}: {
  children: React.ReactNode;
  color?: string;
  align?: "left" | "center";
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: align === "center" ? "center" : "flex-start" }}>
      <span aria-hidden style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${color})`, opacity: 0.85 }} />
      <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.36em", textTransform: "uppercase", color, fontWeight: 600 }}>
        {children}
      </span>
      {align === "center" && (
        <span aria-hidden style={{ width: 40, height: 1, background: `linear-gradient(270deg, transparent, ${color})`, opacity: 0.85 }} />
      )}
    </div>
  );
}

/** Chiffre fantôme : la texture sans image du thème. */
function Ghost({
  children,
  right = false,
  color = C.ink,
  opacity = 0.055,
  size = "clamp(200px, 26vw, 420px)",
  top = "-6%",
}: {
  children: React.ReactNode;
  right?: boolean;
  color?: string;
  opacity?: number;
  size?: string;
  top?: string;
}) {
  return (
    <span
      aria-hidden
      className="i355-ghost"
      style={{
        position: "absolute",
        top,
        [right ? "right" : "left"]: "-2%",
        fontFamily: SERIF,
        fontSize: size,
        lineHeight: 0.8,
        color,
        opacity,
        pointerEvents: "none",
        userSelect: "none",
        fontStyle: "italic",
      }}
    >
      {children}
    </span>
  );
}

/** Bouton : élévation + deux ombres + accent, sur 0,5 s. */
function Bouton({
  href,
  children,
  variant = "plein",
  large = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "plein" | "ligne";
  large?: boolean;
}) {
  const [h, setH] = useState(false);
  const plein = variant === "plein";
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      onFocus={() => setH(true)}
      onBlur={() => setH(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: large ? "17px 34px" : "15px 28px",
        minHeight: 44,
        fontFamily: SANS,
        fontSize: large ? 14 : 13,
        fontWeight: 600,
        letterSpacing: "0.06em",
        borderRadius: 4,
        textDecoration: "none",
        border: `1px solid ${plein ? "transparent" : h ? C.accent : C.border}`,
        background: plein ? (h ? C.accentDark : C.accent) : h ? C.white : "transparent",
        color: plein ? C.white : h ? C.accentDark : C.ink,
        transform: h ? "translateY(-2px)" : "translateY(0)",
        boxShadow: h
          ? `0 14px 30px -18px rgba(13,43,38,0.55), 0 2px 0 0 ${plein ? C.accentDark : C.accentLight}`
          : "0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0)",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      {children}
      <ArrowRight size={15} style={{ transform: h ? "translateX(4px)" : "none", transition: `transform .5s ${EASE_CSS}` }} />
    </a>
  );
}

/** Lien de navigation : soulignement dont la largeur pousse. */
function NavLien({ label, href, onClick }: { label: string; href: string; onClick?: () => void }) {
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
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: "0.04em",
        color: h ? C.accentDark : C.textMuted,
        textDecoration: "none",
        padding: "12px 2px",
        transition: `color .45s ${EASE_CSS}`,
      }}
    >
      {label}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          bottom: 8,
          height: 1,
          width: h ? "100%" : "0%",
          background: C.accent,
          transition: `width .5s ${EASE_CSS}`,
        }}
      />
    </a>
  );
}

/** Une prestation : rangée éditoriale numérotée, pas une carte. */
function RangeeService({ s, n }: { s: any; n: number }) {
  const [h, setH] = useState(false);
  return (
    <div
      className="i355-row"
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "clamp(58px, 7vw, 104px) minmax(0, 0.9fr) minmax(0, 1.25fr)",
        gap: "clamp(14px, 2.4vw, 34px)",
        alignItems: "start",
        padding: "clamp(22px, 2.8vw, 34px) clamp(10px, 1.6vw, 22px)",
        borderTop: `1px solid ${C.border}`,
        background: h ? C.white : "transparent",
        boxShadow: h
          ? "0 22px 44px -34px rgba(13,43,38,0.5), inset 3px 0 0 0 var(--brand, #0f766e)"
          : "0 0 0 0 rgba(0,0,0,0), inset 0 0 0 0 rgba(0,0,0,0)",
        transform: h ? "translateX(4px)" : "translateX(0)",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      <div style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4vw, 46px)", lineHeight: 0.9, color: h ? C.accent : C.textFaint, transition: `color .5s ${EASE_CSS}` }}>
        {String(n + 1).padStart(2, "0")}
      </div>
      <div>
        <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.28em", textTransform: "uppercase", color: C.accentDark, marginBottom: 9 }}>{s.tag}</div>
        <h3 style={{ fontFamily: SERIF, fontSize: "clamp(21px, 2.3vw, 27px)", fontWeight: 400, lineHeight: 1.16, color: C.ink, margin: 0, letterSpacing: "-0.01em" }}>{s.titre}</h3>
      </div>
      <p style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.78, color: C.textMuted, margin: 0, maxWidth: 520 }}>{s.desc}</p>
    </div>
  );
}

/** Une ligne de la table des tarifs : filet, pas de carte. */
function LigneTarif({ t, idx }: { t: any; idx: number }) {
  const [h, setH] = useState(false);
  return (
    <div
      className="i355-tarif"
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 0.45fr)",
        gap: "clamp(12px, 2vw, 28px)",
        alignItems: "baseline",
        padding: "clamp(20px, 2.4vw, 28px) clamp(4px, 1.4vw, 18px)",
        borderTop: `1px solid ${idx === 0 ? C.ink : C.border}`,
        background: h ? C.bgAlt : "transparent",
        boxShadow: h ? "inset 0 -1px 0 0 var(--brand, #0f766e), 0 16px 34px -30px rgba(13,43,38,0.5)" : "inset 0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0)",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: SERIF, fontSize: "clamp(18px, 2vw, 22px)", color: C.ink, lineHeight: 1.25 }}>{t.a}</div>
        <div style={{ fontFamily: SANS, fontSize: 13.5, color: C.textMuted, marginTop: 7, lineHeight: 1.68, maxWidth: 560 }}>{t.n}</div>
      </div>
      <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: C.accentDark, textAlign: "right", whiteSpace: "nowrap" }}>{t.p}</div>
    </div>
  );
}

function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ════════════════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════════════════ */

export default function TilleulsIdelPage() {
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
    (async () => {
      /* La session vient d'un stockage distant : chargée dans la foulée de sa
         création, elle peut n'être pas encore lisible. Cinq tentatives, jusqu'à
         onze secondes : trois ne suffisaient pas, et une page qui rate la
         dernière garde le repli de la démonstration pour toujours. */
      for (const attente of [0, 500, 1500, 3000, 6000]) {
        if (attente) await new Promise((r) => setTimeout(r, attente));
        try {
          const reponse = await fetch(`/api/sessions?id=${id}`);
          if (!reponse.ok) continue;
          const donnees = await reponse.json();
          if (donnees) { setSession(donnees); return; }
        } catch {}
      }
    })();
  }, []);

  fd = session?.formData;
  c = session?.generatedContent;
  bp = session?.businessProfile;
  sessionData = session;
  ENGAGEMENT_DEMO = ENGAGEMENT_DEMO_LIVE();

  /* Les blocs qui lisent la session sont recalculés ici, après affectation :
     évalués à l'import, ils resteraient ceux de la démonstration pour toujours. */

  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({ ...SERVICES_SOURCE[i % SERVICES_SOURCE.length], titre: s.title })),
    SERVICES_SOURCE,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({ ...AVIS_SOURCE[i % AVIS_SOURCE.length], auteur: r.author, texte: r.text })),
    AVIS_SOURCE,
  );
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...TARIFS_SOURCE[i % TARIFS_SOURCE.length],
      a: s.title,
      p: s.price ?? TARIFS_SOURCE[i % TARIFS_SOURCE.length].p,
      n: s.desc || s.description || TARIFS_SOURCE[i % TARIFS_SOURCE.length].n,
    })),
    TARIFS_SOURCE,
  );
  STATS = resolveList(clientStats(sessionData), STATS_SOURCE);
  /* La liste des engagements peut être retouchée telle quelle depuis l'aperçu ;
     sinon ce sont les certifications saisies, sinon celles du thème. */
  ENGAGEMENT = clientList(sessionData, "engagements.liste") ?? resolveList(clientCertifications(sessionData), ENGAGEMENT_DEMO);

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
      auteur: r.name ?? r.author ?? AVIS_DEMO[n % AVIS_DEMO.length].auteur,
      detail: r.location ?? r.role ?? AVIS_DEMO[n % AVIS_DEMO.length].detail,
    })),
    AVIS_DEMO,
  );

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  /* Le spotlight des avis n'a pas d'horloge : le geste signature de la page est
     le volet qui monte, et deux mouvements automatiques se disputeraient l'œil. */
  const [avis, setAvis] = useState(0);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const nom = fd?.businessName ?? clientName(sessionData) ?? "Cabinet des Tilleuls";
  const ville = clientCity(sessionData) ?? "Limoges";
  const phone = clientPhone(sessionData) ?? fd?.phone ?? "05 55 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33555000000").replace(/[^+\d]/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "cabinet@idel-tilleuls.fr";
  const adresse = clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "87000", "Limoges");
  const heroImg = photo(0, "https://images.pexels.com/photos/7653136/pexels-photo-7653136.jpeg?auto=compress&cs=tinysrgb&w=1400");
  /* Deuxième emplacement : sans photo confiée, le panneau se tient tout seul
     (aplat, filets et croix de soin en CSS). Aucune adresse d'image inventée. */
  const cabinetImg = photo(1, "");
  const avisCourant = AVIS[avis % AVIS.length];

  return (
    <div id="i355-root" style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip" }}>
      <style>{`
        ${FONTS_CSS}
        #i355-root em { font-style: italic; }
        .i355-pulse { animation: i355-beat 3.4s ${EASE_CSS} infinite; transform-origin: center; }
        @keyframes i355-beat {
          0%, 62%, 100% { opacity: 0.28; transform: scaleY(1); }
          70% { opacity: 1; transform: scaleY(1.5); }
          78% { opacity: 0.4; transform: scaleY(0.9); }
        }
        @media (prefers-reduced-motion: reduce) {
          .i355-pulse { animation: none !important; opacity: 0.5; }
        }
        @media (max-width: 980px) {
          #i355-nav { display: none !important; }
          .i355-burger { display: flex !important; }
        }
        @media (max-width: 900px) {
          .i355-hero { grid-template-columns: minmax(0,1fr) !important; gap: 40px !important; padding-top: 120px !important; }
          .i355-media { max-width: 520px; }
          .i355-split { grid-template-columns: minmax(0,1fr) !important; gap: 40px !important; }
          .i355-split-media { order: initial !important; }
          .i355-contact { grid-template-columns: minmax(0,1fr) !important; gap: 36px !important; }
          .i355-row { grid-template-columns: minmax(0,1fr) !important; gap: 12px !important; }
          .i355-rownum { font-size: 26px !important; }
          .i355-stats { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
          .i355-statcell { border-right: none !important; border-top: 1px solid rgba(255,255,255,0.09) !important; }
          .i355-tarif { grid-template-columns: minmax(0,1fr) !important; gap: 8px !important; }
          .i355-tarif > div:last-child { text-align: left !important; }
        }
        @media (max-width: 620px) {
          .i355-ghost { display: none !important; }
        }
      `}</style>

      {/* ══ NAV ══════════════════════════════════════════════════════════ */}
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
          padding: scrolled ? "12px clamp(20px, 5vw, 60px)" : "22px clamp(20px, 5vw, 60px)",
          background: scrolled ? "rgba(242,247,246,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          transition: `padding .55s ${EASE_CSS}, background .55s ${EASE_CSS}, border-color .55s ${EASE_CSS}, backdrop-filter .55s ${EASE_CSS}`,
        }}
      >
        <a href="#i355-root" style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0, textDecoration: "none" }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={nom} style={{ height: 32, maxWidth: 168, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Stethoscope size={17} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: SERIF, fontSize: 20, letterSpacing: "-0.01em", color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nom}</span>
              <span style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.28em", textTransform: "uppercase", color: C.textFaint, marginLeft: 4, whiteSpace: "nowrap" }}>
                {clientTrade(sessionData) ?? "Infirmiers"}
              </span>
            </>
          )}
        </a>

        <div id="i355-nav" style={{ display: "flex", gap: "clamp(16px, 2vw, 30px)", alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <NavLien key={l} label={l} href={h} />
          ))}
          <Bouton href={telHref}>Nous appeler</Bouton>
        </div>

        <button
          className="i355-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: `transform .4s ${EASE_CSS}`, transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "opacity .3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: `transform .4s ${EASE_CSS}`, transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>

      {mobileOpen && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 99, background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "18px clamp(20px, 5vw, 60px) 26px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ fontFamily: SANS, color: C.ink, fontSize: 15.5, fontWeight: 500, textDecoration: "none", padding: "13px 0", borderBottom: `1px solid ${C.border}` }}>
              {l}
            </a>
          ))}
          <a href={telHref} style={{ marginTop: 14, background: C.accent, color: C.white, fontFamily: SANS, borderRadius: 4, padding: "15px 22px", fontSize: 14.5, fontWeight: 600, textDecoration: "none", textAlign: "center" }}>
            {phone}
          </a>
        </div>
      )}

      {/* ══ HÉROS — H1, média à droite ══════════════════════════════════ */}
      <section
        className="i355-hero"
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.06fr) minmax(0, 0.94fr)",
          gap: "clamp(30px, 5vw, 66px)",
          alignItems: "center",
          padding: "clamp(130px, 15vh, 168px) clamp(20px, 5vw, 60px) clamp(90px, 12vw, 140px)",
          maxWidth: 1280,
          margin: "0 auto",
          minHeight: "100dvh",
          overflow: "hidden",
        }}
      >
        <Ghost right opacity={0.05} top="4%">
          +
        </Ghost>

        <div style={{ position: "relative", zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.08 }}>
            <Kicker>{clientEyebrow(sessionData) ?? `Infirmiers à domicile · ${ville}`}</Kicker>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.15, ease: EASE, delay: 0.2 }}
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: "clamp(40px, 6.2vw, 74px)",
              lineHeight: 0.99,
              letterSpacing: "-0.022em",
              color: C.ink,
              margin: "clamp(20px, 2.6vw, 32px) 0 clamp(16px, 2vw, 24px)",
            }}
          >
            {/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ?? (
              <>
                {clientHeroLine(sessionData, 0, 2, 20) ?? "Le soin qui vient"}
                <br />
                <em style={{ color: C.accentDark }}>{clientHeroLine(sessionData, 1, 2, 20) ?? "jusqu'à votre porte."}</em>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.36 }}
            style={{ fontFamily: SANS, fontWeight: 300, fontSize: "clamp(15.5px, 1.5vw, 17.5px)", lineHeight: 1.8, color: C.textMuted, maxWidth: 496, marginBottom: "clamp(26px, 3vw, 36px)" }}
          >
            {clientHeroSubtitle(sessionData) ??
              c?.heroSubline ??
              "Quatre infirmiers libéraux conventionnés : prises de sang, pansements, perfusions, soins chroniques — à domicile 7j/7 ou au cabinet sans rendez-vous le matin. Tiers payant, carte Vitale."}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.5 }} style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <Bouton href={telHref} large>
              Appeler le cabinet
            </Bouton>
            <Bouton href="#services" variant="ligne" large>
              Nos soins
            </Bouton>
          </motion.div>

          {/* Détail gratuit : le tracé de pouls qui bat sous la ligne de prise
              en charge. Purement CSS, coupé par prefers-reduced-motion. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.72 }}
            style={{ display: "flex", alignItems: "center", gap: 14, marginTop: "clamp(30px, 4vw, 46px)", flexWrap: "wrap" }}
          >
            <svg width="52" height="16" viewBox="0 0 52 16" fill="none" aria-hidden style={{ flexShrink: 0 }}>
              <path className="i355-pulse" d="M0 8h13l3-6 4 12 4-9 3 3h25" stroke={C.accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontFamily: SANS, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: C.textFaint }}>
              Conventionnés CPAM · Tiers payant · Carte Vitale
            </span>
          </motion.div>
        </div>

        {/* Média : la photo confiée, sinon celle du thème. Le cadre reste beau
            image bloquée grâce à l'aplat et au filet. */}
        <motion.div
          className="i355-media"
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.25, ease: EASE, delay: 0.3 }}
          style={{ position: "relative", zIndex: 2, width: "100%", justifySelf: "center" }}
        >
          <div
            style={{
              position: "relative",
              borderRadius: "4px 4px 96px 4px",
              overflow: "hidden",
              background: `linear-gradient(155deg, ${C.accentLight} 0%, ${C.bgAlt} 60%, ${C.bg} 100%)`,
              border: `1px solid ${C.border}`,
              aspectRatio: "4 / 4.2",
              boxShadow: "0 42px 70px -50px rgba(13,43,38,0.6)",
            }}
          >
            {heroImg ? (
              <img src={heroImg} alt="Soins à domicile auprès d'une famille" loading="eager" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <div aria-hidden style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Stethoscope size={92} color={C.accent} strokeWidth={0.8} style={{ opacity: 0.4 }} />
              </div>
            )}
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,43,38,0.55) 0%, rgba(13,43,38,0.08) 42%, transparent 70%)" }} />
          </div>

          {/* Carte d'appui : les deux premiers chiffres, posés sur le média. */}
          <div
            style={{
              position: "absolute",
              left: "clamp(-6px, -1vw, 0px)",
              bottom: "clamp(-20px, -2vw, -12px)",
              background: C.white,
              border: `1px solid ${C.border}`,
              borderLeft: `2px solid var(--brand, #0f766e)`,
              borderRadius: 3,
              padding: "16px 22px",
              display: "flex",
              gap: 26,
              boxShadow: "0 26px 44px -34px rgba(13,43,38,0.65)",
              maxWidth: "88%",
            }}
          >
            {STATS.slice(0, 2).map((s: any) => (
              <div key={s.label} style={{ minWidth: 0 }}>
                <div style={{ fontFamily: SERIF, fontSize: 27, lineHeight: 1, color: C.accentDark }}>{s.value}</div>
                <div style={{ fontFamily: SANS, fontSize: 11, lineHeight: 1.45, color: C.textMuted, marginTop: 6, maxWidth: 132 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══ RESPIRATION ═════════════════════════════════════════════════ */}
      <section style={{ background: C.bgAlt, padding: "clamp(58px, 8vw, 96px) clamp(20px, 5vw, 60px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <Reveal>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(21px, 2.9vw, 33px)",
              lineHeight: 1.5,
              letterSpacing: "-0.01em",
              color: C.ink,
              maxWidth: 780,
              margin: "0 auto",
            }}
          >
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ??
              "Un soin qui vient jusqu'à votre porte ne s'improvise pas : il s'organise, la veille, entre quatre soignants qui se parlent."}
          </p>
        </Reveal>
      </section>

      {/* ══ LE VOLET — geste signature PanelRise ════════════════════════ */}
      <PanelRise>
        <section
          style={{
            background: C.bgDark,
            padding: "clamp(62px, 8vw, 104px) clamp(20px, 5vw, 60px) clamp(50px, 6vw, 76px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Ghost right color={C.soin} opacity={0.06} top="-14%" size="clamp(220px, 30vw, 460px)">
            7
          </Ghost>
          <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative", zIndex: 2 }}>
            <Reveal>
              <Kicker color={C.soin}>La journée</Kicker>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontWeight: 300,
                  fontSize: "clamp(28px, 4vw, 48px)",
                  lineHeight: 1.06,
                  letterSpacing: "-0.02em",
                  color: C.white,
                  margin: "18px 0 clamp(34px, 4vw, 52px)",
                  maxWidth: 640,
                }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "tournee.titre") ?? (
                  <>
                    La tournée se lève <em style={{ color: C.soin }}>avant vous.</em>
                  </>
                )}
              </h2>
            </Reveal>

            <div className="i355-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
              {STATS.map((s: any, idx: number) => (
                <Reveal key={s.label} delay={idx * 0.055}>
                  <div
                    className="i355-statcell"
                    style={{
                      padding: "clamp(24px, 3vw, 36px) clamp(12px, 1.6vw, 24px)",
                      borderRight: idx < STATS.length - 1 ? "1px solid rgba(255,255,255,0.09)" : "none",
                      height: "100%",
                    }}
                  >
                    <div style={{ fontFamily: SERIF, fontSize: "clamp(30px, 3.6vw, 44px)", lineHeight: 1, color: C.soin, letterSpacing: "-0.02em" }}>{s.value}</div>
                    <div style={{ fontFamily: SANS, fontSize: 12.5, lineHeight: 1.6, color: "rgba(255,255,255,0.52)", marginTop: 11, maxWidth: 190 }}>{s.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </PanelRise>

      {/* ══ PRESTATIONS — rangées éditoriales ═══════════════════════════ */}
      <section id="services" style={{ background: C.bg, padding: "clamp(72px, 9vw, 124px) clamp(20px, 5vw, 60px)", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 28, flexWrap: "wrap", marginBottom: "clamp(30px, 4vw, 48px)" }}>
              <div>
                <Kicker>Nos soins</Kicker>
                <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(30px, 4.4vw, 52px)", lineHeight: 1.06, letterSpacing: "-0.022em", color: C.ink, marginTop: 18 }}>
                  {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                    <>
                      Du prélèvement
                      <br />
                      <em style={{ color: C.accentDark }}>au long cours.</em>
                    </>
                  )}
                </h2>
              </div>
              <p style={{ fontFamily: SANS, fontSize: 14.5, lineHeight: 1.75, color: C.textMuted, maxWidth: 380 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "services.intro") ??
                  "Tous ces actes se font sur ordonnance, à domicile ou au cabinet. Si le vôtre n'est pas dans la liste, appelez : c'est probablement que nous le faisons aussi."}
              </p>
            </div>
          </Reveal>

          <div style={{ borderBottom: `1px solid ${C.border}` }}>
            {SERVICES.map((s: any, idx: number) => (
              <Reveal key={s.titre + idx} delay={Math.min(idx, 4) * 0.055}>
                <RangeeService s={s} n={idx} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ LA TOURNÉE — timeline verticale ═════════════════════════════ */}
      <section id="methode" style={{ background: C.bgAlt, padding: "clamp(72px, 9vw, 124px) clamp(20px, 5vw, 60px)", position: "relative", overflow: "hidden" }}>
        <Ghost opacity={0.045} top="10%">
          04
        </Ghost>
        <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <Kicker>À domicile</Kicker>
            <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(30px, 4.4vw, 52px)", lineHeight: 1.06, letterSpacing: "-0.022em", color: C.ink, margin: "18px 0 clamp(38px, 5vw, 60px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                <>
                  Une tournée bien faite,
                  <br />
                  <em style={{ color: C.accentDark }}>ça se sent.</em>
                </>
              )}
            </h2>
          </Reveal>

          <div style={{ position: "relative", paddingLeft: "clamp(26px, 4vw, 46px)" }}>
            {/* Le filet vertical de la timeline : dégradé, 1 px. */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                top: 8,
                bottom: 24,
                width: 1,
                background: `linear-gradient(to bottom, ${C.accent}, ${C.border} 82%, transparent)`,
              }}
            />
            {resolveList(clientMethode(sessionData)?.map((e: any, i: number) => ({ ...METHODE_SOURCE[i % METHODE_SOURCE.length], ...e })), METHODE_SOURCE).map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.06}>
                <div style={{ position: "relative", paddingBottom: idx === METHODE_SOURCE.length - 1 ? 0 : "clamp(28px, 3.6vw, 44px)" }}>
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: "calc(clamp(26px, 4vw, 46px) * -1 - 4px)",
                      top: 9,
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: C.bgAlt,
                      border: `1px solid ${C.accent}`,
                    }}
                  />
                  <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: SERIF, fontSize: 15, letterSpacing: "0.12em", color: C.accentDark }}>{m.n}</span>
                    <h3 style={{ fontFamily: SERIF, fontSize: "clamp(20px, 2.2vw, 26px)", fontWeight: 400, color: C.ink, margin: 0, letterSpacing: "-0.012em" }}>{m.t}</h3>
                  </div>
                  <p style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.78, color: C.textMuted, margin: "10px 0 0", maxWidth: 620 }}>{m.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ LE CABINET / ENGAGEMENTS ════════════════════════════════════ */}
      <section id="engagements" style={{ background: C.bg, padding: "clamp(72px, 9vw, 124px) clamp(20px, 5vw, 60px)" }}>
        <div className="i355-split" style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0, 0.92fr) minmax(0, 1.08fr)", gap: "clamp(34px, 5vw, 72px)", alignItems: "center" }}>
          <Reveal style={{ order: 0 }}>
            <div className="i355-split-media" style={{ position: "relative" }}>
              {cabinetImg ? (
                <div style={{ borderRadius: "96px 4px 4px 4px", overflow: "hidden", border: `1px solid ${C.border}`, aspectRatio: "4 / 3.4" }}>
                  <img src={cabinetImg} alt="Le cabinet d'infirmiers" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              ) : (
                /* Repli sans image : croix de soin dessinée en CSS sur un aplat
                   dégradé, filets d'appui et halo à 0,1 d'opacité. */
                <div
                  aria-hidden
                  style={{
                    position: "relative",
                    aspectRatio: "4 / 3.4",
                    borderRadius: "96px 4px 4px 4px",
                    overflow: "hidden",
                    background: `linear-gradient(150deg, ${C.accentLight} 0%, ${C.bgAlt} 55%, ${C.bg} 100%)`,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <span style={{ position: "absolute", inset: 0, background: `radial-gradient(60% 60% at 30% 26%, var(--brand, #0f766e) 0%, transparent 62%)`, opacity: 0.1 }} />
                  <span style={{ position: "absolute", left: "50%", top: "50%", width: "34%", height: 14, marginLeft: "-17%", marginTop: -7, background: C.accent, opacity: 0.24, borderRadius: 2 }} />
                  <span style={{ position: "absolute", left: "50%", top: "50%", width: 14, height: "34%", marginLeft: -7, marginTop: "-17%", background: C.accent, opacity: 0.24, borderRadius: 2 }} />
                  <span style={{ position: "absolute", left: 0, right: 0, top: "22%", height: 1, background: `linear-gradient(90deg, transparent, ${C.border}, transparent)` }} />
                  <span style={{ position: "absolute", left: 0, right: 0, bottom: "22%", height: 1, background: `linear-gradient(90deg, transparent, ${C.border}, transparent)` }} />
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div>
              <Kicker>Le cabinet</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(28px, 3.6vw, 44px)", lineHeight: 1.08, letterSpacing: "-0.02em", color: C.ink, margin: "18px 0 clamp(22px, 3vw, 32px)" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>
                    Conventionnés,
                    <br />
                    <em style={{ color: C.accentDark }}>et à l'heure.</em>
                  </>
                )}
              </h2>
              <div style={{ borderTop: `1px solid ${C.border}` }}>
                {ENGAGEMENT.map((e: string, idx: number) => (
                  <div key={idx} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "15px 0", borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ flexShrink: 0, marginTop: 3, width: 18, height: 18, borderRadius: "50%", background: C.accentLight, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                      <Check size={11} color={C.accentDark} strokeWidth={2.4} />
                    </span>
                    <span style={{ fontFamily: SANS, fontSize: 14.5, lineHeight: 1.72, color: C.textMuted }}>{e}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "clamp(24px, 3vw, 34px)" }}>
                <Bouton href={telHref}>Nous appeler</Bouton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ PRISE EN CHARGE — table fine ════════════════════════════════ */}
      <section id="tarifs" style={{ background: C.bgAlt, padding: "clamp(72px, 9vw, 124px) clamp(20px, 5vw, 60px)" }}>
        <div style={{ maxWidth: 940, margin: "0 auto" }}>
          <Reveal>
            <Kicker align="center">Prise en charge</Kicker>
            <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1.08, letterSpacing: "-0.022em", color: C.ink, textAlign: "center", margin: "18px 0 14px" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                <>
                  Sur ordonnance, <em style={{ color: C.accentDark }}>vous n'avancez rien.</em>
                </>
              )}
            </h2>
            <p style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.78, color: C.textMuted, maxWidth: 570, margin: "0 auto", textAlign: "center" }}>
              Les soins infirmiers prescrits sont remboursés par l'Assurance Maladie (60 à 100 %) ; le tiers payant fait le reste. Les tarifs suivent la nomenclature nationale (NGAP).
            </p>
          </Reveal>

          <div style={{ marginTop: "clamp(34px, 4.5vw, 56px)", borderBottom: `1px solid ${C.border}` }}>
            {TARIFS.map((t: any, idx: number) => (
              <Reveal key={t.a + idx} delay={Math.min(idx, 4) * 0.055}>
                <LigneTarif t={t} idx={idx} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ AVIS — spotlight à la main ══════════════════════════════════ */}
      <section style={{ background: C.bgDarkAlt, padding: "clamp(72px, 9vw, 124px) clamp(20px, 5vw, 60px)", position: "relative", overflow: "hidden" }}>
        <Ghost color={C.soin} opacity={0.07} top="-8%" size="clamp(260px, 34vw, 520px)">
          “
        </Ghost>
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <Kicker color={C.soin} align="center">
              Ce qu'ils en disent
            </Kicker>
            <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(28px, 4vw, 46px)", lineHeight: 1.08, color: C.white, textAlign: "center", margin: "18px 0 clamp(36px, 5vw, 56px)", letterSpacing: "-0.02em" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                <>
                  Soignés <em style={{ color: C.soin }}>chez eux</em>.
                </>
              )}
            </h2>
          </Reveal>

          <div style={{ minHeight: 210, display: "flex", alignItems: "center" }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.blockquote
                key={avis}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14, transition: { duration: 0.32, ease: EASE } }}
                transition={{ duration: 0.7, ease: EASE }}
                style={{ margin: 0, textAlign: "center", width: "100%" }}
              >
                <p style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(19px, 2.5vw, 28px)", lineHeight: 1.55, color: "rgba(255,255,255,0.9)", margin: "0 auto", maxWidth: 760 }}>
                  « {avisCourant?.texte} »
                </p>
                <div style={{ marginTop: 26, fontFamily: SANS, fontSize: 13.5, fontWeight: 600, color: C.white, letterSpacing: "0.02em" }}>{avisCourant?.auteur}</div>
                <div style={{ marginTop: 5, fontFamily: SANS, fontSize: 11.5, letterSpacing: "0.22em", textTransform: "uppercase", color: C.soin }}>{avisCourant?.detail}</div>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, marginTop: "clamp(28px, 3.4vw, 42px)" }}>
            <button
              onClick={() => setAvis((n) => (n - 1 + AVIS.length) % AVIS.length)}
              aria-label="Avis précédent"
              style={{ minWidth: 44, minHeight: 44, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "none", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "50%", color: "rgba(255,255,255,0.75)", cursor: "pointer", transition: `all .5s ${EASE_CSS}` }}
            >
              <ArrowLeft size={15} />
            </button>
            <div style={{ display: "flex", gap: 8 }}>
              {AVIS.map((_: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setAvis(idx)}
                  aria-label={`Avis ${idx + 1}`}
                  style={{
                    width: idx === avis % AVIS.length ? 26 : 8,
                    height: 8,
                    minHeight: 8,
                    padding: 0,
                    borderRadius: 99,
                    border: "none",
                    cursor: "pointer",
                    background: idx === avis % AVIS.length ? C.soin : "rgba(255,255,255,0.22)",
                    transition: `all .5s ${EASE_CSS}`,
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => setAvis((n) => (n + 1) % AVIS.length)}
              aria-label="Avis suivant"
              style={{ minWidth: 44, minHeight: 44, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "none", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "50%", color: "rgba(255,255,255,0.75)", cursor: "pointer", transition: `all .5s ${EASE_CSS}` }}
            >
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ══ CONTACT ═════════════════════════════════════════════════════ */}
      <section id="contact" style={{ background: C.bg, padding: "clamp(72px, 9vw, 124px) clamp(20px, 5vw, 60px)" }}>
        <div className="i355-contact" style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0, 1.15fr) minmax(0, 0.85fr)", gap: "clamp(34px, 5vw, 72px)", alignItems: "center" }}>
          <Reveal>
            <div>
              <Kicker>On vous répond</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(30px, 4.4vw, 52px)", lineHeight: 1.06, letterSpacing: "-0.022em", color: C.ink, margin: "18px 0 18px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                  <>
                    Un soin prescrit ?
                    <br />
                    <em style={{ color: C.accentDark }}>Appelez, on organise.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 15.5, lineHeight: 1.8, color: C.textMuted, maxWidth: 470, marginBottom: "clamp(26px, 3vw, 36px)" }}>
                Réponse aux heures de tournée (rappel rapide sinon). Cabinet ouvert sans rendez-vous de 7h à 9h pour les prélèvements.
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Bouton href={telHref} large>
                  {phone}
                </Bouton>
                <Bouton href={`mailto:${mail}`} variant="ligne" large>
                  Nous écrire
                </Bouton>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div style={{ background: C.bgAlt, border: `1px solid ${C.border}`, borderTop: `2px solid var(--brand, #0f766e)`, borderRadius: 3, padding: "clamp(24px, 3vw, 34px)" }}>
              {[
                { icon: <MapPin size={14} />, l: "Le cabinet", v: adresse },
                { icon: <Phone size={14} />, l: "Téléphone", v: phone },
                { icon: <Mail size={14} />, l: "Courriel", v: mail },
                { icon: <Clock size={14} />, l: "Tournées", v: "6h30 – 20h · 7j/7 pour les soins qui l'exigent" },
              ].map((r, idx) => (
                <div key={r.l} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 0", borderTop: idx === 0 ? "none" : `1px solid ${C.border}` }}>
                  <span style={{ color: C.accent, marginTop: 3, flexShrink: 0 }}>{r.icon}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.26em", textTransform: "uppercase", color: C.textFaint }}>{r.l}</div>
                    <div style={{ fontFamily: SANS, fontSize: 14.5, color: C.ink, marginTop: 5, lineHeight: 1.6, wordBreak: "break-word" }}>{r.v}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ PIED DE PAGE ════════════════════════════════════════════════ */}
      <footer style={{ background: C.bgDark, padding: "clamp(46px, 6vw, 72px) clamp(20px, 5vw, 60px) 24px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, paddingBottom: "clamp(26px, 3.4vw, 40px)" }}>
            <div style={{ maxWidth: 420 }}>
              <div style={{ fontFamily: SERIF, fontSize: 23, color: C.soin, letterSpacing: "-0.01em" }}>{nom}</div>
              <p style={{ fontFamily: SANS, color: "rgba(255,255,255,0.42)", fontSize: 13.5, lineHeight: 1.75, marginTop: 12 }}>
                Cabinet d'infirmiers libéraux · {ville}
                <br />
                Conventionnés CPAM — Ordre national des infirmiers
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <MapPin size={13} />, t: adresse },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Clock size={13} />, t: "Tournées 6h30–20h · 7j/7 pour les soins qui l'exigent" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 11, color: "rgba(255,255,255,0.45)", fontSize: 13, alignItems: "center", fontFamily: SANS }}>
                  <span style={{ color: C.soin, display: "inline-flex" }}>{item.icon}</span>
                  {item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontFamily: SANS, color: "rgba(255,255,255,0.28)", fontSize: 12 }}>
              © 2026 {nom} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
              {/* VILLE_PIED */}
              {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ fontFamily: SANS, color: "rgba(255,255,255,0.28)", fontSize: 12 }}>
              Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
