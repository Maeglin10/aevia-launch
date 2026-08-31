"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  Check,
  ClipboardList,
  Clock,
  Clock3,
  HeartPulse,
  Home,
  Mail,
  MapPin,
  Phone,
  Syringe,
} from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, useSlides } from "@/lib/templates/hero-kit-2";
import { ComposeIn } from "@/lib/templates/hero-kit-3";
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
  clientMethode,
  clientName,
  clientPhone,
  clientPhotos,
  clientReviews,
  clientServices,
  clientStats,
  clientText,
  clientTrade,
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
   {clientName(sessionData) ?? "Soins de l'Estuaire"} — Cabinet infirmier côtier · Saint-Nazaire

   Geste signature : ComposeIn. La tournée du jour ne défile pas, elle SE
   COMPOSE — un carton entre par la gauche, un deuxième par la droite, le
   troisième monte du bas, après une seconde de scène vide. Un seul index
   pilote tout le héros ; les flèches et la fraction lisent le même.

   Archétype H3 (plein cadre, titre en bas, fond de repli C.bgDark obligatoire)
   · fontes P3 (Cormorant Garamond + system-ui) · palette #f6fafb / #227c9d.

   Dessin qui s'écarte du squelette : prestations en BENTO de tuiles inégales,
   organisation en rail horizontal numéroté, tarifs en BANDES pleine largeur,
   avis en MARQUEE qui dérive comme une marée.
   ════════════════════════════════════════════════════════════════════════════ */

const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');`;

const SERIF = "'Cormorant Garamond', Garamond, Georgia, serif";
const SANS = "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/* Une seule courbe pour toute la page — reprise à l'identique en CSS. */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_CSS = "cubic-bezier(.16,1,.3,1)";

let C: Record<string, string> = {
  bg: "#f6fafb",
  bgAlt: "#e7f1f5",
  bgCard: "#ffffff",
  bgDark: "#0e2634",
  bgDarkAlt: "#0a1c27",
  accent: "var(--brand, #227c9d)",
  accentDark: "var(--brand-light, #17607b)",
  accentLight: "#d6e9f1",
  ink: "#10242f",
  textMuted: "#4a626e",
  textFaint: "#87a1ad",
  border: "#d4e3ea",
  white: "#ffffff",
  /* Clé métier : l'écume de l'estuaire, seule couleur claire sur les fonds sombres. */
  ecume: "#8ecbe0",
};

const NAV = [
  { l: "Soins", h: "#services" },
  { l: "L'organisation", h: "#methode" },
  { l: "Prise en charge", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* ── Contenu rédactionnel du thème (conservé mot pour mot) ───────────────── */

/* Les trois scènes du héros. Le `ton` remplace les hex écrits dans la donnée :
   la couleur d'une tuile appartient à la palette, pas au contenu. */
const HERO_SOURCE = [
  {
    k: "La tournée du matin",
    sub: "Composée la veille, tenue le jour même.",
    tiles: [
      { icon: Syringe, t: "6h30 — À jeun d'abord", d: "Prélèvements et glycémies avant le petit-déjeuner des patients.", ton: "clair" },
      { icon: Home, t: "Matinée — Soins lourds", d: "Pansements complexes et perfusions, quand on a le temps de bien faire.", ton: "sombre" },
      { icon: Clock3, t: "Créneaux fiables", d: "SMS si la tournée glisse — votre matinée n'attend pas la nôtre.", ton: "pale" },
    ],
  },
  {
    k: "Le suivi partagé",
    sub: "La famille informée, le médecin aussi.",
    tiles: [
      { icon: ClipboardList, t: "Dossier commun", d: "Six infirmiers, un seul dossier de soins — la continuité, vraiment.", ton: "sombre" },
      { icon: HeartPulse, t: "Appli famille", d: "Passage confirmé, constantes notées : les proches éloignés respirent.", ton: "clair" },
      { icon: Home, t: "Lien médecin", d: "Photos de plaies sécurisées, alertes précoces — le médecin sait avant que ça s'aggrave.", ton: "pale" },
    ],
  },
  {
    k: "Les soins techniques",
    sub: "L'hôpital à la maison, en sécurité.",
    tiles: [
      { icon: Syringe, t: "Perfusions & PICC", d: "Antibiothérapies, nutrition, chimio orale accompagnée — protocoles hospitaliers.", ton: "pale" },
      { icon: ClipboardList, t: "Chimio & post-op", d: "Retours de bloc suivis en lien direct avec les services.", ton: "clair" },
      { icon: HeartPulse, t: "Palliatif coordonné", d: "Avec l'HAD et l'équipe mobile : rester chez soi, accompagné.", ton: "sombre" },
    ],
  },
];

const SERVICES_SOURCE = [
  { titre: "Prélèvements", desc: "À domicile dès 6h30, au cabinet sans rendez-vous de 7h30 à 9h30. Acheminement direct aux deux laboratoires de la ville.", tag: "Biologie" },
  { titre: "Plaies & cicatrisation", desc: "Formation plaies et cicatrisation (DU) au cabinet : escarres, ulcères, plaies chroniques suivies par protocole photographié.", tag: "Expertise" },
  { titre: "Perfusions à domicile", desc: "PICC-line, chambres implantables, pompes : les soins d'hôpital à la maison, avec les protocoles de l'hôpital.", tag: "Technique" },
  { titre: "Grand âge & dépendance", desc: "Toilettes, piluliers, surveillance : des passages réguliers qui maintiennent à domicile dans la dignité.", tag: "Autonomie" },
  { titre: "Diabète", desc: "Éducation, glycémies, insuline, prévention du pied diabétique : le suivi rapproché qui évite les hospitalisations.", tag: "Diabète" },
  { titre: "Coordination familles", desc: "Application dédiée : passages confirmés, transmissions visibles, messagerie sécurisée. Les enfants à distance restent informés.", tag: "Familles" },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE_SOURCE = [
  { n: "01", t: "Un appel, une réponse", d: "La secrétaire décroche de 8h à 18h : ordonnance reçue, tournée organisée, créneau confirmé dans l'heure." },
  { n: "02", t: "La bonne compétence", d: "Plaies complexes au titulaire du DU, perfusions aux référents techniques : chacun son domaine." },
  { n: "03", t: "Le passage confirmé", d: "SMS ou notification à chaque passage — utile pour les proches, rassurant pour tous." },
  { n: "04", t: "Le lien qui remonte", d: "Toute évolution signalée au médecin le jour même. Les urgences évitées valent mieux que les urgences gérées." },
];

const ENGAGEMENT_DEMO = [
  "Six infirmiers diplômés d'État, conventionnés CPAM, inscrits à l'Ordre",
  "Secrétariat humain 8h-18h — pas de répondeur qui promet de rappeler",
  "Dossier de soins unique partagé, messagerie sécurisée de santé (MSSanté)",
  "Zone d'intervention annoncée et tenue : on refuse plutôt que de mal faire",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

const TARIFS_SOURCE = [
  { a: "Soins sur ordonnance", p: "tiers payant", n: "AMI/AIS selon nomenclature + indemnités de déplacement réglementaires." },
  { a: "Prélèvement au cabinet", p: "tiers payant", n: "Sans rendez-vous 7h30-9h30, résultats via votre laboratoire." },
  { a: "Bilan de soins infirmiers (BSI)", p: "pris en charge", n: "Pour les patients dépendants : évaluation complète, plan de soins transmis." },
  { a: "Appli familles", p: "incluse", n: "Pour tous les patients en soins réguliers, sans supplément." },
];
let TARIFS = TARIFS_SOURCE;

const AVIS_SOURCE = [
  { texte: "Depuis Paris, je vois chaque passage chez mon père à Saint-Nazaire : confirmé, commenté, avec les constantes. Cette appli m'a rendu des nuits de sommeil.", auteur: "Fils de M. G.", detail: "Suivi à distance" },
  { texte: "Escarre de stade 3 reprise en trois mois par l'infirmière au DU plaies. Photos envoyées au médecin chaque semaine, protocole ajusté sans que je me déplace.", auteur: "Épouse de R.", detail: "Plaies complexes" },
  { texte: "Le secrétariat change tout : un humain répond, la tournée est calée le jour même. Après deux cabinets injoignables, on mesure la différence.", auteur: "Nadège P.", detail: "Perfusions post-op" },
];
let AVIS_DEMO = AVIS_SOURCE;

const STATS_SOURCE = [
  { value: "6", label: "Infirmiers D.E." },
  { value: "1", label: "Secrétaire qui décroche" },
  { value: "20 km", label: "De zone couverte annoncée" },
  { value: "98 %", label: "De passages dans le créneau" },
];
let STATS = STATS_SOURCE;

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

function Reveal({
  children,
  delay = 0,
  y = 30,
  style,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -8% 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.9, ease: EASE, delay }}
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
      <span aria-hidden style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${color})`, opacity: 0.9 }} />
      <span style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.38em", textTransform: "uppercase", color, fontWeight: 600 }}>{children}</span>
      {align === "center" && <span aria-hidden style={{ width: 40, height: 1, background: `linear-gradient(270deg, transparent, ${color})`, opacity: 0.9 }} />}
    </div>
  );
}

/** Le mot fantôme du fond : texture sans image. */
function Ghost({
  children,
  right = false,
  color = C.ink,
  opacity = 0.05,
  size = "clamp(210px, 28vw, 440px)",
  top = "-8%",
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
      className="i356-ghost"
      style={{
        position: "absolute",
        top,
        [right ? "right" : "left"]: "-1%",
        fontFamily: SERIF,
        fontStyle: "italic",
        fontWeight: 300,
        fontSize: size,
        lineHeight: 0.78,
        color,
        opacity,
        pointerEvents: "none",
        userSelect: "none",
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
  clair = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "plein" | "ligne";
  large?: boolean;
  /** Posé sur un fond sombre : le contour et le texte passent en clair. */
  clair?: boolean;
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
        padding: large ? "16px 32px" : "14px 26px",
        minHeight: 44,
        fontFamily: SANS,
        fontSize: large ? 13.5 : 12.5,
        fontWeight: 600,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        borderRadius: 2,
        textDecoration: "none",
        border: `1px solid ${plein ? "transparent" : clair ? "rgba(255,255,255,0.45)" : h ? C.accent : C.border}`,
        background: plein ? (h ? C.accentDark : C.accent) : h ? (clair ? "rgba(255,255,255,0.12)" : C.white) : "transparent",
        color: plein ? C.white : clair ? C.white : h ? C.accentDark : C.ink,
        transform: h ? "translateY(-2px)" : "translateY(0)",
        boxShadow: h
          ? `0 16px 32px -20px rgba(10,28,39,0.6), 0 2px 0 0 ${plein ? C.accentDark : C.accentLight}`
          : "0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0)",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      {children}
    </a>
  );
}

/** Lien de navigation : soulignement dont la largeur pousse. */
function NavLien({ label, href, clair }: { label: string; href: string; clair: boolean }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        position: "relative",
        fontFamily: SANS,
        fontSize: 12.5,
        fontWeight: 500,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: clair ? (h ? C.white : "rgba(255,255,255,0.82)") : h ? C.accentDark : C.textMuted,
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
          background: clair ? C.ecume : C.accent,
          transition: `width .5s ${EASE_CSS}`,
        }}
      />
    </a>
  );
}

/** Une tuile du bento des prestations. Tailles inégales assumées. */
function TuileService({ s, idx }: { s: any; idx: number }) {
  const [h, setH] = useState(false);
  /* Rythme du bento : 1re et 4e tuiles larges, la 3e haute. */
  const large = idx % 5 === 0 || idx % 5 === 3;
  const sombre = idx % 5 === 2;
  return (
    <article
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: "100%",
        background: sombre ? C.bgDark : C.white,
        border: `1px solid ${sombre ? "rgba(255,255,255,0.1)" : C.border}`,
        borderRadius: 3,
        padding: "clamp(24px, 3vw, 38px)",
        height: "100%",
        transform: h ? "translateY(-4px)" : "translateY(0)",
        boxShadow: h
          ? "0 30px 54px -38px rgba(10,28,39,0.62), 0 1px 0 0 var(--brand, #227c9d)"
          : "0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0)",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <span style={{ width: 26, height: 1, background: sombre ? C.ecume : C.accent, opacity: 0.9 }} />
        <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: sombre ? C.ecume : C.accentDark, fontWeight: 600 }}>{s.tag}</span>
      </div>
      <h3
        style={{
          fontFamily: SERIF,
          fontWeight: 400,
          fontSize: large ? "clamp(26px, 3vw, 36px)" : "clamp(22px, 2.4vw, 28px)",
          lineHeight: 1.1,
          letterSpacing: "-0.01em",
          color: sombre ? C.white : C.ink,
          margin: "0 0 12px",
        }}
      >
        {s.titre}
      </h3>
      <p style={{ fontFamily: SANS, fontSize: 14.5, lineHeight: 1.75, color: sombre ? "rgba(255,255,255,0.66)" : C.textMuted, margin: 0, maxWidth: large ? 560 : 380 }}>{s.desc}</p>
    </article>
  );
}

/** Une bande de tarif : pleine largeur, filet haut, prix à droite. */
function BandeTarif({ t, idx }: { t: any; idx: number }) {
  const [h, setH] = useState(false);
  return (
    <div
      className="i356-bande"
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 0.34fr) minmax(0, 1.2fr) minmax(0, 0.4fr)",
        gap: "clamp(12px, 2.4vw, 32px)",
        alignItems: "baseline",
        padding: "clamp(22px, 2.8vw, 34px) clamp(8px, 2vw, 26px)",
        borderTop: `1px solid ${idx === 0 ? C.ink : C.border}`,
        background: h ? C.white : "transparent",
        boxShadow: h ? "0 20px 40px -34px rgba(10,28,39,0.6), inset 0 -1px 0 0 var(--brand, #227c9d)" : "0 0 0 0 rgba(0,0,0,0), inset 0 0 0 0 rgba(0,0,0,0)",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      <div style={{ fontFamily: SERIF, fontSize: "clamp(20px, 2.2vw, 26px)", lineHeight: 1.2, color: C.ink }}>{t.a}</div>
      <div style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.72, color: C.textMuted }}>{t.n}</div>
      <div style={{ fontFamily: SANS, fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: C.accentDark, textAlign: "right", whiteSpace: "nowrap" }}>{t.p}</div>
    </div>
  );
}

function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ════════════════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════════════════ */

export default function SoinsEstuairePage() {
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

  /* Les scènes du héros reprennent les prestations du client quand il en a
     saisi : la tuile garde son dessin et son icône, le texte devient le sien. */
  const DU_CLIENT = clientServices(sessionData);
  const HERO = HERO_SOURCE.map((scene, s) => ({
    ...scene,
    tiles: scene.tiles.map((tile, t) => {
      if (!DU_CLIENT?.length) return tile;
      const presta = SERVICES[(s * 3 + t) % SERVICES.length];
      return { ...tile, t: presta?.titre ?? tile.t, d: presta?.desc ?? tile.d };
    }),
  }));

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  /* Un seul index pour tout le héros : les tuiles, la fraction et les flèches. */
  const { i, go } = useSlides(HERO.length, DWELL.slow);
  const S = HERO[i];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const nom = fd?.businessName ?? clientName(sessionData) ?? "Soins de l'Estuaire";
  const ville = clientCity(sessionData) ?? "Saint-Nazaire";
  const phone = clientPhone(sessionData) ?? fd?.phone ?? "02 40 00 00 01";
  const telHref = `tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33240000001").replace(/[^+\d]/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "secretariat@soins-estuaire.fr";
  const adresse = clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "44600", "Saint-Nazaire");
  /* Plein cadre : la photo du client d'abord, celle du thème ensuite. Le fond
     sombre est peint dessous — image bloquée, le héros tient quand même. */
  const heroImg = photo(0, "https://images.pexels.com/photos/7345459/pexels-photo-7345459.jpeg?auto=compress&cs=tinysrgb&w=1400");
  /* Deuxième emplacement : sans photo confiée, panneau CSS (dégradé d'estuaire,
     filets d'horizon, halo). Aucune adresse d'image inventée. */
  /* Le héros est passé en typographie seule : plus aucune photographie n'y
     entre. Le portrait d'équipe prend donc la première photo du client quand
     il n'en a fourni qu'une — sans quoi elle ne s'afficherait plus nulle
     part. Aucun repli de stock ici : sans photo, l'aplat tient seul. */
  /* Le repli était vide : sans photo du client, l'emplacement tombait sur un
     simple dégradé et la page n'affichait aucune image. Une photo de
     démonstration tient la place ; celle du client passe toujours avant. */
  const cabinetImg = photo(1, "") || photo(0, "") || "https://images.pexels.com/photos/6753262/pexels-photo-6753262.jpeg?auto=compress&cs=tinysrgb&w=1600";

  /* Les tuiles du geste : le contenu de la scène, le dessin du thème. */
  const tuiles = S.tiles.map((tile: any, n: number) => {
    const Icon = tile.icon;
    const sombre = tile.ton === "sombre";
    const pale = tile.ton === "pale";
    return {
      from: (n === 0 ? "left" : n === 1 ? "right" : "bottom") as "left" | "right" | "bottom",
      node: (
        <div
          style={{
            background: sombre ? C.bgDark : pale ? "rgba(255,255,255,0.9)" : C.accentLight,
            color: sombre ? C.white : C.ink,
            border: `1px solid ${sombre ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.55)"}`,
            borderLeft: `2px solid ${sombre ? C.ecume : C.accent}`,
            borderRadius: 3,
            padding: "18px 20px",
            display: "flex",
            gap: 15,
            alignItems: "flex-start",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          <Icon size={19} style={{ flexShrink: 0, marginTop: 3, color: sombre ? C.ecume : C.accentDark }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 14, letterSpacing: "0.01em", marginBottom: 5 }}>{tile.t}</div>
            <div style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.62, opacity: 0.82 }}>{tile.d}</div>
          </div>
        </div>
      ),
    };
  });

  return (
    <div id="i356-root" style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip" }}>
      <style>{`
        ${FONTS_CSS}
        #i356-root em { font-style: italic; }
        .i356-marquee { display: flex; gap: 20px; width: max-content; animation: i356-derive 46s linear infinite; }
        .i356-marquee:hover { animation-play-state: paused; }
        @keyframes i356-derive {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .i356-marquee { animation: none !important; }
          .i356-piste { overflow-x: auto !important; }
        }
        /* Le pied du héros typographique : la prose d'un côté, la tournée
           du jour de l'autre. */
        .i356-herobas {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
          gap: clamp(24px, 4vw, 60px);
          align-items: start;
          padding-top: clamp(20px, 2.6vw, 30px);
          border-top: 1px solid rgba(255,255,255,0.14);
        }

        @media (max-width: 980px) {
          #i356-nav { display: none !important; }
          .i356-burger { display: flex !important; }
          .aevia-action-mobile { display: inline-flex !important; }
        }
        @media (max-width: 900px) {
          .i356-herobas { grid-template-columns: minmax(0,1fr) !important; gap: 30px !important; }
          .i356-bento { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
          .i356-tuile { grid-column: span 2 !important; }
          .i356-rail { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
          .i356-split { grid-template-columns: minmax(0,1fr) !important; gap: 38px !important; }
          .i356-split-media { order: initial !important; }
          .i356-contact { grid-template-columns: minmax(0,1fr) !important; gap: 34px !important; }
          .i356-stats { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
          .i356-statcell { border-right: none !important; }
          .i356-bande { grid-template-columns: minmax(0,1fr) !important; gap: 8px !important; }
          .i356-bande > div:last-child { text-align: left !important; }
        }
        @media (max-width: 620px) {
          .i356-ghost { display: none !important; }
          .i356-bento { grid-template-columns: minmax(0,1fr) !important; }
          .i356-rail { grid-template-columns: minmax(0,1fr) !important; }
        }
      `}</style>

      {/* ══ NAV — claire tant qu'on est sur le plein cadre ═══════════════ */}
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
          padding: scrolled ? "12px clamp(20px, 5vw, 62px)" : "22px clamp(20px, 5vw, 62px)",
          background: scrolled ? "rgba(246,250,251,0.94)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          transition: `padding .55s ${EASE_CSS}, background .55s ${EASE_CSS}, border-color .55s ${EASE_CSS}, backdrop-filter .55s ${EASE_CSS}`,
        }}
      >
        <a href="#i356-root" style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0, textDecoration: "none" }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={nom} style={{ height: 32, maxWidth: 168, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <HeartPulse size={17} color={scrolled ? C.accent : C.ecume} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: SERIF, fontSize: 23, letterSpacing: "0.01em", color: scrolled ? C.ink : C.white, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", transition: `color .55s ${EASE_CSS}` }}>{nom}</span>
              <span style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.28em", textTransform: "uppercase", color: scrolled ? C.textFaint : "rgba(255,255,255,0.6)", marginLeft: 4, whiteSpace: "nowrap" }}>
                {clientTrade(sessionData) ?? "Infirmiers"}
              </span>
            </>
          )}
        </a>

        <div id="i356-nav" style={{ display: "flex", gap: "clamp(16px, 2vw, 30px)", alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <NavLien key={l} label={l} href={h} clair={!scrolled} />
          ))}
          <Bouton href={telHref} variant={scrolled ? "plein" : "ligne"} clair={!scrolled}>
            Le secrétariat
          </Bouton>
        </div>

        {/* L'appel à l'action sous le pouce : la barre est fixe, mais son
            bouton vit dans le menu déroulant, en display:none sous le point
            de rupture. Celui-ci paraît exactement avec le bouton de menu. */}
        <ActionMobile href={telHref} fond={C.accent} encre={C.white}>
          Appeler
        </ActionMobile>
        <button
          className="i356-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: scrolled ? C.ink : C.white, transition: `transform .4s ${EASE_CSS}`, transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: scrolled ? C.ink : C.white, transition: "opacity .3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: scrolled ? C.ink : C.white, transition: `transform .4s ${EASE_CSS}`, transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>

      {mobileOpen && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 99, background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "18px clamp(20px, 5vw, 62px) 26px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ fontFamily: SANS, color: C.ink, fontSize: 15.5, fontWeight: 500, textDecoration: "none", padding: "13px 0", borderBottom: `1px solid ${C.border}` }}>
              {l}
            </a>
          ))}
          <a href={telHref} style={{ marginTop: 14, background: C.accent, color: C.white, fontFamily: SANS, borderRadius: 2, padding: "15px 22px", fontSize: 14.5, fontWeight: 600, textDecoration: "none", textAlign: "center" }}>
            {phone}
          </a>
        </div>
      )}

      {/* ══ HÉROS — H3 plein cadre, titre en bas ═════════════════════════ */}
      {/* ── HERO — typographie seule ──────────────────────────────────────
             Aucune photographie. Le héros était plein cadre avec le titre
             posé en bas : la composition qu'impact-349, impact-340 et
             impact-328 portent déjà, et son voisin de métier impact-355
             montre justement la sienne en vignette. Ici l'estuaire dessiné
             tient le fond, le titre tient l'écran, et les scènes de tournée
             se lisent en colonne à droite du titre plutôt qu'en tuiles
             posées sur une image.

             La photographie du client n'est pas perdue : le portrait
             d'équipe, plus bas, la prend quand il n'en a fourni qu'une. */}
      <section
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: C.bgDark,
          overflow: "hidden",
          padding: "clamp(120px, 15vh, 172px) clamp(20px, 5vw, 62px) clamp(48px, 7vh, 84px)",
        }}
      >
        {/* L'estuaire en CSS — dégradé d'eau, bandes d'horizon, halo bas. */}
        <div aria-hidden style={{ position: "absolute", inset: 0 }}>
          <span style={{ position: "absolute", inset: 0, background: `linear-gradient(168deg, ${C.bgDarkAlt} 0%, ${C.bgDark} 46%, var(--brand, #227c9d) 190%)` }} />
          <span style={{ position: "absolute", inset: 0, background: `radial-gradient(72% 48% at 24% 82%, var(--brand, #227c9d) 0%, transparent 68%)`, opacity: 0.12 }} />
          {[0.34, 0.46, 0.58, 0.7].map((y) => (
            <span key={y} style={{ position: "absolute", left: 0, right: 0, top: `${y * 100}%`, height: 1, background: `linear-gradient(90deg, transparent, rgba(142,203,224,0.28), transparent)` }} />
          ))}
        </div>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 82% at 22% 78%, transparent 30%, rgba(10,28,39,0.55) 100%)", mixBlendMode: "multiply" }} />

        <Ghost right color={C.ecume} opacity={0.07} top="8%" size="clamp(240px, 32vw, 500px)">
          6
        </Ghost>

        <div style={{ position: "relative", zIndex: 3, maxWidth: 1280, margin: "0 auto", width: "100%" }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}>
            <Kicker color={C.ecume}>{clientEyebrow(sessionData) ?? `Cabinet infirmier · ${ville}`}</Kicker>
          </motion.div>

          {/*
            Le titre tient l'écran à lui seul, d'un seul tenant et d'une seule
            couleur : la seconde ligne dans le ton clair était la signature de
            gabarit de toute la série.
          */}
          <motion.h1
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.22 }}
            style={{
              fontFamily: SERIF,
              fontWeight: 300,
              fontSize: "clamp(40px, 8vw, 112px)",
              lineHeight: 0.96,
              letterSpacing: "-0.018em",
              color: C.white,
              margin: "clamp(20px, 2.8vw, 36px) 0 clamp(22px, 2.8vw, 34px)",
              maxWidth: 1080,
              textShadow: "0 14px 50px rgba(10,28,39,0.55)",
              overflowWrap: "break-word",
            }}
          >
            {/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ??
              clientHeroLine(sessionData, 0, 1, 46) ??
              "Votre traitement suit, même quand la vie bouge."}
          </motion.h1>

          {/* ── La ligne du bas : la prose, l'action, la tournée du jour ─── */}
          <div className="i356-herobas">
            <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.05, ease: EASE, delay: 0.4 }} style={{ minWidth: 0 }}>
              <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: "clamp(14.5px, 1.35vw, 16.5px)", lineHeight: 1.78, color: "rgba(255,255,255,0.78)", margin: "0 0 clamp(22px, 2.8vw, 32px)" }}>
                {clientHeroSubtitle(sessionData) ??
                  c?.heroSubline ??
                  "Six infirmiers, une secrétaire qui décroche, une application de suivi pour les familles : le cabinet infirmier organisé comme il devrait l'être partout. Conventionné, tiers payant."}
              </p>

              {/* Une seule action pleine ; les soins restent un lien. */}
              <div style={{ display: "flex", gap: "clamp(16px, 2vw, 26px)", flexWrap: "wrap", alignItems: "center" }}>
                <Bouton href={telHref} large>
                  Organiser des soins
                </Bouton>
                <a href="#services" style={{ fontFamily: SANS, fontSize: 13, color: C.white, textDecoration: "none", borderBottom: `1px solid ${C.ecume}`, paddingBottom: 3 }}>
                  Nos soins
                </a>
              </div>
            </motion.div>

            {/* ── Le geste : la scène se compose, tuile après tuile ── */}
            <div style={{ minWidth: 0 }}>
              <ComposeIn
                index={i}
                items={tuiles}
                hold={1.1}
                beat={0.16}
                className="i356-tuiles"
                style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gridAutoRows: "minmax(76px, auto)", gap: 10 }}
              />
              {/*
                La fraction « 01 / 03 » ne disait pas ce qu'on regardait ; ces
                traits nomment les scènes de tournée et y mènent directement.
              */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16, flexWrap: "wrap", color: "rgba(255,255,255,0.72)" }}>
                <span style={{ fontFamily: SANS, fontSize: 12.5, lineHeight: 1.55, minWidth: 0 }}>
                  <strong style={{ color: C.white, fontWeight: 600 }}>{S.k}</strong> — {S.sub}
                </span>
                <div style={{ display: "flex", gap: 8, flexShrink: 0, marginLeft: "auto" }}>
                  {HERO.map((h: any, n: number) => (
                    <button
                      key={h.k ?? n}
                      type="button"
                      onClick={() => go(n)}
                      aria-label={h.k ?? `Scène ${n + 1}`}
                      aria-current={n === i}
                      style={{ width: 32, height: 3, padding: 0, border: "none", cursor: "pointer", background: n === i ? C.ecume : "rgba(255,255,255,0.26)", transition: "background .3s" }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CHIFFRES — bande fine sous le plein cadre ═══════════════════ */}
      <section style={{ background: C.bgDarkAlt, padding: "0 clamp(20px, 5vw, 62px)" }}>
        <div className="i356-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1180, margin: "0 auto" }}>
          {STATS.map((s: any, idx: number) => (
            <Reveal key={s.label} delay={idx * 0.055}>
              <div
                className="i356-statcell"
                style={{
                  padding: "clamp(26px, 3.2vw, 40px) clamp(10px, 1.6vw, 22px)",
                  borderRight: idx < STATS.length - 1 ? "1px solid rgba(255,255,255,0.09)" : "none",
                  height: "100%",
                }}
              >
                <div style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(32px, 3.8vw, 48px)", lineHeight: 1, color: C.ecume }}>{s.value}</div>
                <div style={{ fontFamily: SANS, fontSize: 12.5, lineHeight: 1.6, color: "rgba(255,255,255,0.5)", marginTop: 10, maxWidth: 190 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ RESPIRATION ═════════════════════════════════════════════════ */}
      <section style={{ background: C.bg, padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 62px)", textAlign: "center" }}>
        <Reveal>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(23px, 3.2vw, 38px)", lineHeight: 1.42, color: C.ink, maxWidth: 800, margin: "0 auto", letterSpacing: "-0.005em" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ??
              "Une tournée n'est pas une liste de passages : c'est une journée que six soignants tiennent ensemble, du premier prélèvement au dernier appel au médecin."}
          </p>
        </Reveal>
      </section>

      {/* ══ PRESTATIONS — bento de tuiles inégales ══════════════════════ */}
      <section id="services" style={{ background: C.bgAlt, padding: "clamp(72px, 9vw, 124px) clamp(20px, 5vw, 62px)", position: "relative", overflow: "hidden" }}>
        <Ghost opacity={0.045} top="4%">
          soin
        </Ghost>
        <div style={{ maxWidth: 1220, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 30, flexWrap: "wrap", marginBottom: "clamp(30px, 4vw, 50px)" }}>
              <div>
                <Kicker>Nos soins</Kicker>
                <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(32px, 4.8vw, 58px)", lineHeight: 1.04, letterSpacing: "-0.018em", color: C.ink, marginTop: 18 }}>
                  {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                    <>
                      Techniques ou quotidiens,
                      <br />
                      <em style={{ color: C.accentDark }}>avec la même rigueur.</em>
                    </>
                  )}
                </h2>
              </div>
              <p style={{ fontFamily: SANS, fontSize: 14.5, lineHeight: 1.78, color: C.textMuted, maxWidth: 360 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "services.intro") ??
                  "Chaque acte est confié au soignant qui l'a le plus pratiqué. C'est la seule façon d'être aussi sûr sur une escarre que sur une prise de sang."}
              </p>
            </div>
          </Reveal>

          <div className="i356-bento" style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0,1fr))", gap: "clamp(12px, 1.6vw, 20px)" }}>
            {SERVICES.map((s: any, idx: number) => (
              <Reveal
                key={s.titre + idx}
                delay={Math.min(idx, 4) * 0.055}
                className="i356-tuile"
                style={{ gridColumn: idx % 5 === 0 || idx % 5 === 3 ? "span 4" : "span 2", display: "flex" }}
              >
                <TuileService s={s} idx={idx} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ L'ORGANISATION — rail horizontal numéroté ═══════════════════ */}
      <section id="methode" style={{ background: C.bg, padding: "clamp(72px, 9vw, 124px) clamp(20px, 5vw, 62px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <Kicker>L'organisation</Kicker>
            <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(32px, 4.8vw, 58px)", lineHeight: 1.04, letterSpacing: "-0.018em", color: C.ink, margin: "18px 0 clamp(34px, 4.4vw, 54px)", maxWidth: 700 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                <>
                  Un cabinet qui tourne,
                  <br />
                  <em style={{ color: C.accentDark }}>des patients qui le sentent.</em>
                </>
              )}
            </h2>
          </Reveal>

          <div className="i356-rail" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: "clamp(16px, 2.4vw, 34px)" }}>
            {resolveList(fusionnerEtapes(METHODE_SOURCE, clientMethode(sessionData)), METHODE_SOURCE).map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.055}>
                <div style={{ borderTop: `1px solid ${C.ink}`, paddingTop: 20, height: "100%" }}>
                  <div style={{ fontFamily: SERIF, fontSize: "clamp(40px, 5vw, 60px)", lineHeight: 0.9, color: C.accentLight, marginBottom: 14 }}>{m.n}</div>
                  <h3 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(20px, 2.2vw, 25px)", lineHeight: 1.2, color: C.ink, margin: "0 0 10px" }}>{m.t}</h3>
                  <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.75, color: C.textMuted, margin: 0 }}>{m.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ LE CABINET / ENGAGEMENTS ════════════════════════════════════ */}
      <section id="engagements" style={{ background: C.bgAlt, padding: "clamp(72px, 9vw, 124px) clamp(20px, 5vw, 62px)" }}>
        <div className="i356-split" style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 0.95fr)", gap: "clamp(34px, 5vw, 70px)", alignItems: "center" }}>
          <Reveal delay={0.1}>
            <div>
              <Kicker>Le cabinet</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(30px, 4vw, 48px)", lineHeight: 1.06, letterSpacing: "-0.018em", color: C.ink, margin: "18px 0 clamp(22px, 3vw, 30px)" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>
                    Organisés
                    <br />
                    <em style={{ color: C.accentDark }}>parce que c'est du soin.</em>
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
              <div style={{ marginTop: "clamp(24px, 3vw, 32px)" }}>
                <Bouton href={telHref}>Nous appeler</Bouton>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.02}>
            <div className="i356-split-media">
              {cabinetImg ? (
                <div style={{ borderRadius: "3px 3px 3px 110px", overflow: "hidden", border: `1px solid ${C.border}`, aspectRatio: "4 / 3.6" }}>
                  <img src={cabinetImg} alt="L'équipe du cabinet infirmier" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              ) : (
                <div
                  aria-hidden
                  style={{
                    position: "relative",
                    aspectRatio: "4 / 3.6",
                    borderRadius: "3px 3px 3px 110px",
                    overflow: "hidden",
                    background: `linear-gradient(158deg, ${C.accentLight} 0%, ${C.bg} 58%, ${C.bgAlt} 100%)`,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <span style={{ position: "absolute", inset: 0, background: `radial-gradient(58% 58% at 72% 28%, var(--brand, #227c9d) 0%, transparent 64%)`, opacity: 0.11 }} />
                  {[0.3, 0.42, 0.54, 0.66, 0.78].map((y) => (
                    <span key={y} style={{ position: "absolute", left: "8%", right: "8%", top: `${y * 100}%`, height: 1, background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`, opacity: 0.25 }} />
                  ))}
                  <span style={{ position: "absolute", left: "50%", top: "26%", width: 12, height: 12, marginLeft: -6, borderRadius: "50%", background: C.accent, opacity: 0.4 }} />
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ PRISE EN CHARGE — bandes ════════════════════════════════════ */}
      <section id="tarifs" style={{ background: C.bg, padding: "clamp(72px, 9vw, 124px) clamp(20px, 5vw, 62px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Reveal>
            <Kicker align="center">Prise en charge</Kicker>
            <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(30px, 4.4vw, 52px)", lineHeight: 1.06, letterSpacing: "-0.018em", color: C.ink, textAlign: "center", margin: "18px 0 14px" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                <>
                  Nomenclature, <em style={{ color: C.accentDark }}>tiers payant, point.</em>
                </>
              )}
            </h2>
            <p style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.78, color: C.textMuted, maxWidth: 580, margin: "0 auto", textAlign: "center" }}>
              Actes cotés selon la NGAP, remboursés par l'Assurance Maladie sur prescription. Le tiers payant est systématique — vous ne sortez pas la carte bleue.
            </p>
          </Reveal>

          <div style={{ marginTop: "clamp(34px, 4.5vw, 54px)", borderBottom: `1px solid ${C.border}` }}>
            {TARIFS.map((t: any, idx: number) => (
              <Reveal key={t.a + idx} delay={Math.min(idx, 4) * 0.055}>
                <BandeTarif t={t} idx={idx} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ AVIS — marquee qui dérive ═══════════════════════════════════ */}
      <section style={{ background: C.bgDark, padding: "clamp(72px, 9vw, 116px) 0", position: "relative", overflow: "hidden" }}>
        <div style={{ padding: "0 clamp(20px, 5vw, 62px)", marginBottom: "clamp(34px, 4.4vw, 54px)" }}>
          <Reveal>
            <Kicker color={C.ecume} align="center">
              Ce qu'on nous écrit
            </Kicker>
            <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(30px, 4.4vw, 52px)", lineHeight: 1.06, color: C.white, textAlign: "center", margin: "18px 0 0", letterSpacing: "-0.018em" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                <>
                  Des soins <em style={{ color: C.ecume }}>qui s'organisent</em>.
                </>
              )}
            </h2>
          </Reveal>
        </div>

        <div className="i356-piste" style={{ overflow: "hidden", maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)" }}>
          <div className="i356-marquee">
            {[...AVIS, ...AVIS].map((a: any, idx: number) => (
              <figure
                key={idx}
                style={{
                  margin: 0,
                  width: "min(78vw, 400px)",
                  flexShrink: 0,
                  background: "rgba(255,255,255,0.045)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderTop: `1px solid ${C.ecume}`,
                  borderRadius: 3,
                  padding: "clamp(24px, 3vw, 32px)",
                }}
              >
                <blockquote style={{ margin: 0, fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(17px, 1.9vw, 21px)", lineHeight: 1.55, color: "rgba(255,255,255,0.88)" }}>
                  « {a.texte} »
                </blockquote>
                <figcaption style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 600, color: C.white }}>{a.auteur}</div>
                  <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.24em", textTransform: "uppercase", color: C.ecume, marginTop: 6 }}>{a.detail}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTACT ═════════════════════════════════════════════════════ */}
      <section id="contact" style={{ background: C.bg, padding: "clamp(72px, 9vw, 124px) clamp(20px, 5vw, 62px)" }}>
        <div className="i356-contact" style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0, 1.12fr) minmax(0, 0.88fr)", gap: "clamp(34px, 5vw, 70px)", alignItems: "center" }}>
          <Reveal>
            <div>
              <Kicker>Secrétariat 8h-18h</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(32px, 4.8vw, 56px)", lineHeight: 1.04, letterSpacing: "-0.018em", color: C.ink, margin: "18px 0 18px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                  <>
                    Une ordonnance ?
                    <br />
                    <em style={{ color: C.accentDark }}>La tournée s'organise aujourd'hui.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 15.5, lineHeight: 1.8, color: C.textMuted, maxWidth: 470, marginBottom: "clamp(24px, 3vw, 34px)" }}>
                Appelez le secrétariat : créneau confirmé dans l'heure, premier passage souvent le jour même.
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
            <div style={{ background: C.bgAlt, border: `1px solid ${C.border}`, borderLeft: `2px solid var(--brand, #227c9d)`, borderRadius: 2, padding: "clamp(24px, 3vw, 34px)" }}>
              {[
                { icon: <MapPin size={14} />, l: "Le cabinet", v: adresse },
                { icon: <Phone size={14} />, l: "Secrétariat", v: phone },
                { icon: <Mail size={14} />, l: "Courriel", v: mail },
                { icon: <Clock size={14} />, l: "Tournées", v: "6h30 – 20h30 · permanence téléphonique 8h – 18h" },
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
      <footer style={{ background: C.bgDarkAlt, padding: "clamp(46px, 6vw, 72px) clamp(20px, 5vw, 62px) 24px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, paddingBottom: "clamp(26px, 3.4vw, 40px)" }}>
            <div style={{ maxWidth: 420 }}>
              <div style={{ fontFamily: SERIF, fontSize: 27, color: C.ecume, fontWeight: 400 }}>{nom}</div>
              <p style={{ fontFamily: SANS, color: "rgba(255,255,255,0.42)", fontSize: 13.5, lineHeight: 1.75, marginTop: 12 }}>
                Cabinet infirmier · {ville}
                <br />
                Conventionné CPAM — Ordre national des infirmiers
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <MapPin size={13} />, t: adresse },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Clock size={13} />, t: "Tournées 6h30–20h30 · permanence téléphonique 8h–18h" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 11, color: "rgba(255,255,255,0.45)", fontSize: 13, alignItems: "center", fontFamily: SANS }}>
                  <span style={{ color: C.ecume, display: "inline-flex" }}>{item.icon}</span>
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
