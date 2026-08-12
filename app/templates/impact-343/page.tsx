"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Droplets,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Scissors,
  Shirt,
  Sparkles,
  Star,
  Wind,
} from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, HairlineArrows, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
import { WipeReveal } from "@/lib/templates/hero-kit-3";
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
   BLANC NET — Pressing & blanchisserie · Paris.
   Réécriture premium (reprise 316–383, famille II).

   Geste signature : WipeReveal — rien n'apparaît, tout se DÉVOILE de gauche à
   droite, comme la housse qu'on retire d'un vêtement rendu. Un seul index
   pilote le héros : la housse, la ligne de titre variable, l'étiquette de
   ticket et le compteur avancent ensemble.

   Héros H2 : média À GAUCHE, colonne de texte à droite — l'inverse du gabarit
   commun de la famille. Fontes P5 (DM Serif Display + DM Sans). Palette
   #fbfbfd / #4763e4 : les blancs dominent, l'encre bleue ne sert qu'aux
   arêtes. Textures sans image : tissage de lin en CSS, filets dégradés 1 px,
   chiffres fantômes, ticket perforé pour les chiffres clés, rail d'avis qui
   défile comme un convoyeur de pressing.
   ════════════════════════════════════════════════════════════════════════════ */

let C: Record<string, string> = {
  bg: "#fbfbfd",
  bgAlt: "#f1f2f8",
  bgDark: "#12141d",
  bgDarkAlt: "#0c0e15",
  bgCard: "#ffffff",
  accent: "var(--brand,#4763e4)",
  accentDark: "var(--brand-light,#2f45b8)",
  accentLight: "#e7ebff",
  ink: "#13151d",
  textMuted: "#565c72",
  textFaint: "#8a90a6",
  border: "#e2e4ef",
  borderSoft: "#eceef6",
  borderDark: "rgba(255,255,255,0.10)",
  white: "#ffffff",
  linen: "#f6f7fb",
};

const DISPLAY = "'DM Serif Display', Georgia, serif";
const BODY = "'DM Sans', system-ui, -apple-system, sans-serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const NAV = [
  { l: "Les soins", h: "#soins" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Comment ça marche", h: "#methode" },
  { l: "Engagements", h: "#engagements" },
  { l: "Contact", h: "#contact" },
];

/* ── Données de démonstration (contenu du thème, conservé mot pour mot) ───── */

const HERO_SOURCE = [
  { k: "Costumes & tailleurs", line: "Tombé impeccable, épaules vivantes.", sub: "Aquanettoyage + apprêt vapeur main." },
  { k: "Robes & soie", line: "Les matières délicates, traitées à la main.", sub: "Soie, cachemire, dentelle — fiche de soin par pièce." },
  { k: "Linge de maison", line: "Draps et nappes rendus comme à l'hôtel.", sub: "Calandrage professionnel, pliage boutique." },
];
let HERO = HERO_SOURCE;

/* Le héros porte les prestations du client dès qu'il en a saisi : le geste
   reste celui du thème, la matière nommée devient la sienne. */
function HERO_LIVE() {
  const presta = clientServices(sessionData);
  if (!presta || presta.length === 0) return HERO_SOURCE;
  return HERO_SOURCE.map((s, i) => ({
    ...s,
    k: presta[i % presta.length]?.title || s.k,
    sub: presta[i % presta.length]?.description || s.sub,
  }));
}

const SERVICES_SOURCE = [
  { titre: "Aquanettoyage", desc: "Nettoyage à l'eau haute précision : programmes par fibre, détergents biodégradables, zéro solvant chloré. Meilleur pour les fibres, pour vous et pour l'atelier.", tag: "Écologique", icon: Droplets },
  { titre: "Costumes & manteaux", desc: "Détachage main, nettoyage, apprêt vapeur sur mannequin : les épaules gardent leur forme, les revers leur roulé.", tag: "Homme", icon: Shirt },
  { titre: "Robes, soie & delicates", desc: "Soie, mousseline, perles et sequins : traitement à la main, séchage à plat, fiche de soin pièce par pièce.", tag: "Délicat", icon: Sparkles },
  { titre: "Robes de mariée", desc: "Nettoyage après le grand jour et conservation en boîte anti-acide avec papier de soie — prête pour trente ans de souvenirs.", tag: "Mariage", icon: Star },
  { titre: "Linge de maison", desc: "Couettes, draps, nappes damassées : lavage grand volume, calandrage, pliage boutique. Retrait sous 72 h.", tag: "Maison", icon: Wind },
  { titre: "Retouches & couture", desc: "Ourlets, fermetures, boutons, cintrage de veste : l'atelier couture répare pendant que le pressing nettoie.", tag: "Retouches", icon: Scissors },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE = [
  { n: "01", t: "Diagnostic au comptoir", d: "Chaque pièce examinée devant vous : taches signalées, boutons fragiles notés, délai annoncé.", h: "Au dépôt" },
  { n: "02", t: "Fiche de soin par pièce", d: "Fibre, tache, traitement : chaque vêtement suit sa fiche, pas un tapis roulant.", h: "Atelier, matin" },
  { n: "03", t: "Atelier sur place", d: "Rien ne part en sous-traitance : nettoyage, repassage et retouches se font derrière la vitrine.", h: "Atelier, journée" },
  { n: "04", t: "Prêt le lendemain 17 h", d: "Déposé avant 10 h, prêt le lendemain. SMS quand c'est prêt, conservation 3 mois sans frais.", h: "J+1 · 17 h" },
];

const ENGAGEMENT_SOURCE = [
  "Aquanettoyage exclusivement : zéro perchloroéthylène (interdit en boutique depuis 2022 — chez nous depuis 2020)",
  "Détergents biodégradables, eau recyclée à 40 %, cintres repris et réutilisés",
  "Toute pièce abîmée par notre fait est indemnisée selon le barème IFTH, sans discussion",
  "Prix affichés en boutique et en ligne — le comptoir n'invente rien",
];
let ENGAGEMENT = ENGAGEMENT_SOURCE;

const TARIFS_SOURCE = [
  { a: "Chemise (lavée + repassée main)", p: "4,90 €", n: "Pliée ou sur cintre. Dégressif dès 5 chemises." },
  { a: "Costume 2 pièces", p: "19,90 €", n: "Aquanettoyage + apprêt vapeur sur mannequin, rendu 24 h." },
  { a: "Robe de mariée", p: "dès 149 €", n: "Nettoyage main + boîte de conservation anti-acide incluse." },
  { a: "Couette (2 places)", p: "24,90 €", n: "Lavage grand volume, séchage complet contrôlé, housse de transport offerte." },
];
let TARIFS = TARIFS_SOURCE;

const AVIS_SOURCE = [
  { texte: "Costume porté tous les jours : ici, il ressort avec les épaules en place et le pli du pantalon net. J'ai comparé ailleurs, on ne m'y reprendra pas.", auteur: "Julien M.", detail: "Abonné costume hebdo" },
  { texte: "Une robe en soie tachée au champagne le soir du mariage de ma sœur. Rendue parfaite, avec la fiche détaillant le traitement. Chapeau l'atelier.", auteur: "Capucine L.", detail: "Robe soie — détachage" },
  { texte: "Le passage à l'aquanettoyage se sent : plus d'odeur chimique dans les vestes, et mes pulls en laine ne feutrent pas. Et prêt le lendemain, vraiment.", auteur: "Hervé D.", detail: "Client depuis 12 ans" },
];
let AVIS = AVIS_SOURCE;

const STATS_SOURCE = [
  { value: "0 %", label: "Perchloroéthylène (aqua only)" },
  { value: "24 h", label: "Costume rendu apprêté" },
  { value: "15 000+", label: "Pièces traitées par an" },
  { value: "30 ans", label: "Le même atelier, rue du Commerce" },
];
let STATS = STATS_SOURCE;

/* Le dernier chiffre nommait la rue de la démonstration : sur le site d'un
   client, « rue du Commerce » est une adresse fausse. On y met sa ville dès
   qu'elle est connue — le chiffre, lui, ne bouge pas. */
function STATS_LIVE() {
  const ville = clientCity(sessionData);
  if (!ville) return STATS_SOURCE;
  return STATS_SOURCE.map((s, i) =>
    i === STATS_SOURCE.length - 1 ? { ...s, label: `Le même atelier, à ${ville}` } : s,
  );
}

const REPERES_SOURCE = ["Dépôt sans rendez-vous", "SMS quand c'est prêt", "Conservation 3 mois offerte"];
let REPERES = REPERES_SOURCE;

/* URL photo du thème — conservée telle quelle. Les autres emplacements
   attendent celles du client : sans image, le repli CSS tient la page. */
const PHOTO_FALLBACK = [
  "https://images.pexels.com/photos/8774451/pexels-photo-8774451.jpeg?auto=compress&cs=tinysrgb&w=1400",
  "",
  "",
  "",
];

// Photo du client à l'emplacement i, repli sur celle du thème quand il y en a.
function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ── Primitives ───────────────────────────────────────────────────────────── */

function Reveal({ children, delay = 0, y = 26 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Le kicker de la maison : filet 40×1 px puis capitales très filées. */
function Kicker({ children, tone = "ink", center = false }: { children: React.ReactNode; tone?: "ink" | "light" | "accent"; center?: boolean }) {
  const col = tone === "light" ? "rgba(255,255,255,0.62)" : tone === "accent" ? C.accentDark : C.textFaint;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: center ? "center" : "flex-start" }}>
      <span aria-hidden style={{ width: 40, height: 1, background: col, opacity: 0.8, flexShrink: 0 }} />
      <span style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.36em", textTransform: "uppercase", color: col }}>
        {children}
      </span>
      {center && <span aria-hidden style={{ width: 40, height: 1, background: col, opacity: 0.8, flexShrink: 0 }} />}
    </div>
  );
}

/**
 * Surface photographique avec repli dessiné.
 *
 * Le proxy bloque les images distantes et le client n'en fournit pas toujours :
 * la boîte porte donc son propre décor — tissage de lin, filet d'accent, cintre
 * tracé au trait. L'image, quand elle existe, se pose par-dessus.
 */
function Plate({
  src,
  alt,
  ratio = "4/3",
  label,
  children,
}: {
  src: string;
  alt: string;
  ratio?: string;
  label?: string;
  children?: React.ReactNode;
}) {
  return (
    <div style={{ position: "relative", aspectRatio: ratio, background: C.linen, overflow: "hidden", boxShadow: `inset 0 0 0 1px ${C.border}` }}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.5,
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(19,21,29,0.05) 0 1px, transparent 1px 7px), repeating-linear-gradient(0deg, rgba(19,21,29,0.05) 0 1px, transparent 1px 7px)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(120% 90% at 30% 10%, ${C.white} 0%, transparent 60%)`,
          opacity: 0.85,
        }}
      />
      {!src && (
        <svg aria-hidden viewBox="0 0 120 90" style={{ position: "absolute", left: "50%", top: "50%", width: "42%", transform: "translate(-50%,-50%)", opacity: 0.5 }}>
          <path d="M60 14a7 7 0 1 1 7 7c-4 0-7 2-7 6v4" fill="none" stroke={C.accent} strokeWidth="1" />
          <path d="M60 31 18 62c-4 3-2 9 3 9h78c5 0 7-6 3-9L60 31Z" fill="none" stroke={C.accent} strokeWidth="1" />
        </svg>
      )}
      {src && (
        <img src={src} alt={alt} loading="lazy" style={{ position: "relative", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      )}
      <span aria-hidden style={{ position: "absolute", left: 0, bottom: 0, width: "34%", height: 3, background: C.accent }} />
      {label && (
        <span
          style={{
            position: "absolute",
            left: 16,
            bottom: 16,
            fontFamily: BODY,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: C.ink,
            background: "rgba(255,255,255,0.9)",
            padding: "6px 12px",
          }}
        >
          {label}
        </span>
      )}
      {children}
    </div>
  );
}

/* Rangée éditoriale de soin : le tag vit dans la marge, le numéro passe du
   contour à l'accent au survol, la flèche avance. */
function SoinRow({ s, idx }: { s: any; idx: number }) {
  const [hov, setHov] = useState(false);
  const Icon = s.icon ?? Shirt;
  return (
    <div
      className="i343-soinrow"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0,0.3fr) minmax(0,1fr)",
        gap: 26,
        alignItems: "start",
        padding: "clamp(24px, 3.2vw, 38px) clamp(10px, 2vw, 24px)",
        borderTop: `1px solid ${C.borderSoft}`,
        background: hov ? C.white : "transparent",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? "0 20px 44px rgba(19,21,29,0.09), 0 3px 10px rgba(19,21,29,0.05)" : "none",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
        <span
          style={{
            fontFamily: DISPLAY,
            fontSize: "clamp(28px, 3.2vw, 42px)",
            lineHeight: 1,
            color: hov ? C.accent : "transparent",
            WebkitTextStroke: hov ? "0px" : `1px ${C.textFaint}`,
            transition: "color 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {String(idx + 1).padStart(2, "0")}
        </span>
        <span style={{ fontFamily: BODY, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: C.textFaint }}>{s.tag}</span>
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 13, flexWrap: "wrap" }}>
          <Icon size={18} color={hov ? C.accent : C.textFaint} aria-hidden style={{ transition: "color 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }} />
          <h3 style={{ fontFamily: DISPLAY, fontSize: "clamp(20px, 2.2vw, 27px)", lineHeight: 1.15, color: C.ink, margin: 0 }}>{s.titre}</h3>
          <ArrowRight size={16} color={C.accent} aria-hidden style={{ transform: hov ? "translateX(9px)" : "none", transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }} />
        </div>
        <p style={{ fontFamily: BODY, fontSize: 14.5, fontWeight: 300, lineHeight: 1.75, color: C.textMuted, margin: "10px 0 0", maxWidth: 520 }}>{s.desc}</p>
      </div>
    </div>
  );
}

/* Ligne de la table de tarifs : conduite de points, prix à droite. */
function TarifLine({ t, idx }: { t: any; idx: number }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "clamp(18px, 2.4vw, 26px) clamp(8px, 1.6vw, 18px)",
        borderTop: `1px solid ${idx === 0 ? C.border : C.borderSoft}`,
        background: hov ? C.white : "transparent",
        boxShadow: hov ? "0 16px 36px rgba(19,21,29,0.08), inset 3px 0 0 0 " + C.accent : "inset 0 0 0 0 transparent",
        transform: hov ? "translateX(5px)" : "none",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontFamily: DISPLAY, fontSize: "clamp(17px, 1.9vw, 22px)", color: C.ink, lineHeight: 1.2 }}>{t.a}</span>
        <span aria-hidden style={{ flex: "1 1 40px", minWidth: 30, height: 1, borderBottom: `1px dotted ${hov ? C.accent : C.border}`, transform: "translateY(-4px)", transition: "border-color 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }} />
        <span style={{ fontFamily: DISPLAY, fontSize: "clamp(18px, 2vw, 23px)", color: hov ? C.accent : C.accentDark, whiteSpace: "nowrap", transition: "color 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }}>{t.p}</span>
      </div>
      <p style={{ fontFamily: BODY, fontSize: 13.5, fontWeight: 300, lineHeight: 1.65, color: C.textMuted, margin: "7px 0 0", maxWidth: 560 }}>{t.n}</p>
    </div>
  );
}

/* Carte d'avis du rail : le convoyeur de la boutique, en petit. */
function AvisCard({ a }: { a: any }) {
  const [hov, setHov] = useState(false);
  return (
    <figure
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "min(78vw, 360px)",
        flexShrink: 0,
        margin: 0,
        background: hov ? C.white : C.bgCard,
        border: `1px solid ${hov ? C.accent : C.border}`,
        padding: "26px 24px",
        transform: hov ? "translateY(-4px)" : "none",
        boxShadow: hov ? "0 22px 46px rgba(19,21,29,0.10), 0 4px 12px rgba(19,21,29,0.05)" : "0 1px 0 rgba(19,21,29,0.03)",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div style={{ display: "flex", gap: 3, marginBottom: 13 }}>
        {[...Array(5)].map((_, j) => (
          <Star key={j} size={12} fill={C.accent} color={C.accent} aria-hidden />
        ))}
      </div>
      <blockquote style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: 15.5, lineHeight: 1.65, color: C.ink, margin: "0 0 18px" }}>
        «&nbsp;{a.texte}&nbsp;»
      </blockquote>
      <figcaption style={{ borderTop: `1px solid ${C.borderSoft}`, paddingTop: 13 }}>
        <div style={{ fontFamily: BODY, fontSize: 13, fontWeight: 700, color: C.ink }}>{a.auteur}</div>
        <div style={{ fontFamily: BODY, fontSize: 11.5, letterSpacing: "0.08em", color: C.textFaint, marginTop: 4 }}>{a.detail}</div>
      </figcaption>
    </figure>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function BlancNetPage() {
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

  /* Les blocs vivants sont recalculés à chaque rendu, une fois la session
     affectée : évalués au niveau module, ils resteraient ceux de la démo. */
  HERO = HERO_LIVE();
  STATS = resolveList(clientStats(sessionData), STATS_LIVE());
  ENGAGEMENT = resolveList(clientCertifications(sessionData), ENGAGEMENT_SOURCE);
  REPERES = resolveList(clientList(sessionData, "hero.reperes"), REPERES_SOURCE);
  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({ ...SERVICES_SOURCE[i % SERVICES_SOURCE.length], titre: s.title })),
    SERVICES_SOURCE,
  );
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...TARIFS_SOURCE[i % TARIFS_SOURCE.length],
      a: s.title,
      p: s.price || TARIFS_SOURCE[i % TARIFS_SOURCE.length].p,
      n: s.description || s.desc || TARIFS_SOURCE[i % TARIFS_SOURCE.length].n,
    })),
    TARIFS_SOURCE,
  );
  AVIS = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      ...AVIS_SOURCE[i % AVIS_SOURCE.length],
      texte: r.text || AVIS_SOURCE[i % AVIS_SOURCE.length].texte,
      auteur: r.name || r.author || AVIS_SOURCE[i % AVIS_SOURCE.length].auteur,
      detail: r.location || r.role || AVIS_SOURCE[i % AVIS_SOURCE.length].detail,
    })),
    AVIS_SOURCE,
  );
  brand = fd?.brandColor ?? null;
  if (brand) {
    C = { ...C, accent: brand };
  }

  const SERVICES = resolveList(
    clientServices(sessionData)?.map((s: any, n: number) => ({
      titre: s.title || SERVICES_DEMO[n % SERVICES_DEMO.length].titre,
      desc: s.description || s.desc || SERVICES_DEMO[n % SERVICES_DEMO.length].desc,
      tag: SERVICES_DEMO[n % SERVICES_DEMO.length].tag,
      icon: SERVICES_DEMO[n % SERVICES_DEMO.length].icon,
    })),
    SERVICES_DEMO,
  );

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Un seul index pour tout le héros : housse, ligne variable, ticket,
     compteur. DWELL.normal = 4,2 s, soit 4,4× la durée du dévoilement. */
  const { i, next, prev } = useSlides(HERO.length, DWELL.normal);
  const S = HERO[i];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const nom = clientName(sessionData) ?? fd?.businessName ?? "Blanc Net";
  const ville = clientCity(sessionData) ?? "Paris";
  const metier = clientTrade(sessionData) ?? "Pressing";
  const phone = clientPhone(sessionData) ?? "01 45 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? "+33145000000").replace(/[^+\d]/g, "")}`;
  const mail = clientEmail(sessionData) ?? "atelier@blanc-net.fr";
  const adresse = clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "75015", "Paris");

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: BODY, overflowX: "clip" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,300;1,9..40,400&display=swap');

        @media (max-width: 980px) { #i343-nav { display: none !important; } .i343-burger { display: flex !important; } }
        @media (max-width: 900px) {
          .i343-hero { grid-template-columns: minmax(0,1fr) !important; gap: 34px !important; padding-top: 116px !important; }
          .i343-heromedia { order: 2 !important; max-width: 440px; }
          .i343-herotext { order: 1 !important; }
        }
        @media (max-width: 860px) {
          .i343-split { grid-template-columns: minmax(0,1fr) !important; }
          .i343-split > * { order: initial !important; }
          .i343-soinrow { grid-template-columns: minmax(0,1fr) !important; gap: 12px !important; }
          .i343-ticket { grid-template-columns: minmax(0,1fr) minmax(0,1fr) !important; }
          .i343-ticket .i343-ticketcell { border-left: none !important; }
          .i343-frise { grid-template-columns: minmax(0,1fr) minmax(0,1fr) !important; }
          .i343-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i343-sticky { position: static !important; }
        }
        @media (max-width: 560px) {
          .i343-ticket, .i343-frise { grid-template-columns: minmax(0,1fr) !important; }
        }

        .i343-navlink { position: relative; }
        .i343-navlink::after {
          content: ""; position: absolute; left: 8px; bottom: 7px; height: 1.5px; width: 0;
          background: ${C.accent}; transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .i343-navlink:hover::after { width: calc(100% - 16px); }

        .i343-railwrap { overflow: hidden; }
        .i343-rail { display: flex; gap: 18px; width: max-content; animation: i343-convoyeur 52s linear infinite; }
        .i343-railwrap:hover .i343-rail { animation-play-state: paused; }
        @keyframes i343-convoyeur { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        @media (prefers-reduced-motion: reduce) {
          .i343-rail { animation: none; }
          .i343-railwrap { overflow-x: auto; }
          .i343-navlink::after { transition: none; }
        }
      `}</style>

      {/* ── NAV — collante à quatre propriétés : hauteur, fond, flou, filet ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: scrolled ? 62 : 78,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(20px, 4vw, 48px)",
          background: scrolled ? "rgba(251,251,253,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={nom} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Shirt size={17} color={C.accent} style={{ flexShrink: 0 }} aria-hidden />
              <span style={{ fontFamily: DISPLAY, fontSize: 20, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", letterSpacing: "0.005em" }}>{nom}</span>
              <span style={{ fontFamily: BODY, fontSize: 9.5, letterSpacing: "0.26em", textTransform: "uppercase", color: C.textFaint, marginLeft: 8 }}>{metier}</span>
            </>
          )}
        </div>
        <div id="i343-nav" style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} className="i343-navlink" style={{ fontFamily: BODY, color: C.textMuted, fontSize: 13.5, fontWeight: 500, textDecoration: "none", padding: "12px 8px" }}>
              {l}
            </a>
          ))}
          <motion.a
            href={telHref}
            style={{ background: C.accent, color: C.white, padding: "12px 22px", fontFamily: BODY, fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", textDecoration: "none", whiteSpace: "nowrap", marginLeft: 12 }}
            whileHover={{ scale: 1.03, y: -1 }}
          >
            Nous appeler
          </motion.a>
        </div>
        <button
          className="i343-burger"
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
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ fontFamily: BODY, color: C.ink, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "12px 0" }}>
              {l}
            </a>
          ))}
          <a href={telHref} style={{ background: C.accent, color: C.white, padding: "14px 22px", fontFamily: BODY, fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 10 }}>
            Nous appeler
          </a>
        </div>
      )}

      {/* ── HÉROS H2 — média À GAUCHE, texte à droite ─────────────────────── */}
      <section
        className="i343-hero i343-pad"
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "grid",
          gridTemplateColumns: "minmax(0,0.92fr) minmax(0,1.08fr)",
          gap: "clamp(34px, 5vw, 68px)",
          alignItems: "center",
          padding: "clamp(130px, 15vh, 168px) clamp(24px, 5vw, 64px) clamp(56px, 8vh, 88px)",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        {/* Tissage de lin : la seule texture de fond du héros, sans image. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.55,
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(19,21,29,0.035) 0 1px, transparent 1px 9px), repeating-linear-gradient(0deg, rgba(19,21,29,0.035) 0 1px, transparent 1px 9px)",
            maskImage: "radial-gradient(120% 80% at 20% 30%, #000 0%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(120% 80% at 20% 30%, #000 0%, transparent 72%)",
          }}
        />
        {/* Chiffre fantôme : l'heure de retrait, promesse centrale de la maison. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: "-2vw",
            bottom: "2vh",
            fontFamily: DISPLAY,
            fontSize: "clamp(130px, 24vw, 330px)",
            lineHeight: 0.78,
            color: C.ink,
            opacity: 0.045,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          17h
        </div>

        {/* Colonne média — la housse qu'on retire, geste WipeReveal. */}
        <div className="i343-heromedia" style={{ position: "relative", width: "100%" }}>
          <div style={{ position: "relative", background: C.white, boxShadow: "0 30px 70px rgba(19,21,29,0.12), 0 4px 14px rgba(19,21,29,0.05)" }}>
            <WipeReveal index={i} duration={0.95}>
              <Plate src={photo(0, PHOTO_FALLBACK[0])} alt={`Atelier de pressing — ${S.k}`} ratio="4/5" />
            </WipeReveal>
            <div style={{ padding: "20px 24px 24px", borderTop: `3px solid ${C.accent}` }}>
              <WipeReveal index={i} duration={0.95} delay={0.055}>
                <div style={{ fontFamily: BODY, fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: C.accentDark, marginBottom: 9 }}>{S.k}</div>
              </WipeReveal>
              <WipeReveal index={i} duration={0.95} delay={0.11}>
                <div style={{ fontFamily: DISPLAY, fontSize: "clamp(17px, 1.9vw, 21px)", color: C.ink, lineHeight: 1.32 }}>{S.line}</div>
              </WipeReveal>
            </div>
          </div>
          {/* Détail gratuit : l'étiquette de ticket agrafée à la housse. */}
          <div
            aria-hidden={false}
            style={{
              position: "absolute",
              right: "clamp(-14px, -1vw, -6px)",
              top: 26,
              background: C.ink,
              color: C.white,
              padding: "10px 14px",
              transform: "rotate(-2deg)",
              boxShadow: "0 10px 24px rgba(19,21,29,0.22)",
            }}
          >
            <div style={{ fontFamily: BODY, fontSize: 9, letterSpacing: "0.26em", textTransform: "uppercase", opacity: 0.6 }}>Ticket</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 17, lineHeight: 1.1, marginTop: 2 }}>N° {String(i + 1).padStart(3, "0")}</div>
          </div>
        </div>

        {/* Colonne texte */}
        <div className="i343-herotext" style={{ position: "relative", minWidth: 0 }}>
          <Kicker tone="accent">{clientEyebrow(sessionData) ?? `${metier} · ${ville}`}</Kicker>

          <h1
            style={{
              fontFamily: DISPLAY,
              fontSize: "clamp(38px, 5.6vw, 76px)",
              lineHeight: 0.98,
              letterSpacing: "-0.015em",
              color: C.ink,
              margin: "22px 0 22px",
              maxWidth: 620,
            }}
          >
            {/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ?? (
              <>
                {clientHeroLine(sessionData, 0, 2, 18) ?? "Vos vêtements rendus"}
                <br />
                <em style={{ fontStyle: "italic", color: C.accent }}>{clientHeroLine(sessionData, 1, 2, 18) ?? "mieux que confiés."}</em>
              </>
            )}
          </h1>

          <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: "clamp(15px, 1.6vw, 17.5px)", lineHeight: 1.78, color: C.textMuted, maxWidth: 480, margin: "0 0 32px" }}>
            {clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? "Aquanettoyage sans solvant toxique, repassage main, retouches sur place. Déposé avant 10 h, prêt le lendemain 17 h — et vos costumes savent la différence."}
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <motion.a
              href={telHref}
              style={{ background: C.accent, color: C.white, padding: "16px 30px", fontFamily: BODY, fontSize: 14.5, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              Nous appeler <ArrowRight size={16} aria-hidden />
            </motion.a>
            <a
              href="#soins"
              style={{ border: `1px solid ${C.border}`, background: C.white, color: C.ink, padding: "15px 26px", fontFamily: BODY, fontSize: 14.5, fontWeight: 500, textDecoration: "none" }}
            >
              Nos soins
            </a>
          </div>

          {/* Repères courts — retouchables ligne à ligne depuis l'aperçu. */}
          <ul style={{ display: "flex", flexWrap: "wrap", gap: "10px 22px", listStyle: "none", padding: 0, margin: "30px 0 0" }}>
            {REPERES.map((r: any, idx: number) => (
              <li key={idx} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: BODY, fontSize: 12.5, color: C.textMuted }}>
                <CheckCircle size={14} color={C.accent} aria-hidden />
                {r}
              </li>
            ))}
          </ul>

          {/* Le compteur du geste : même index que la housse. */}
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: "clamp(28px, 5vh, 46px)", flexWrap: "wrap" }}>
            <SlideIndex i={i} total={HERO.length} variant="fraction" color={C.textFaint} className="" />
            <span style={{ fontFamily: BODY, fontSize: 13, color: C.textMuted, maxWidth: 320 }}>
              <strong style={{ color: C.ink, fontWeight: 700 }}>{S.k}</strong> — {S.sub}
            </span>
            <HairlineArrows onPrev={prev} onNext={next} color={C.ink} className="" labels={{ prev: "Soin précédent", next: "Soin suivant" }} />
          </div>
        </div>
      </section>

      {/* ── RESPIRATION — une phrase, rien d'autre ───────────────────────── */}
      <section className="i343-pad" style={{ background: C.bg, padding: "clamp(48px, 7vw, 86px) 64px clamp(30px, 4vw, 44px)", textAlign: "center" }}>
        <Reveal>
          <p style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: "clamp(20px, 2.6vw, 30px)", lineHeight: 1.55, color: C.textMuted, maxWidth: 660, margin: "0 auto" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (
              <>
                Un vêtement propre ne se remarque pas. <span style={{ color: C.ink }}>C'est exactement le but.</span>
              </>
            )}
          </p>
        </Reveal>
      </section>

      {/* ── CHIFFRES — bande de ticket perforé ───────────────────────────── */}
      <section className="i343-pad" style={{ background: C.bg, padding: "clamp(20px, 3vw, 34px) 64px clamp(56px, 8vw, 92px)" }}>
        <Reveal>
          <div
            className="i343-ticket"
            style={{
              maxWidth: 1080,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0,1fr))",
              background: C.white,
              border: `1px solid ${C.border}`,
              position: "relative",
              boxShadow: "0 18px 44px rgba(19,21,29,0.07)",
            }}
          >
            {/* Perforations du ticket, en CSS pur. */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: -6,
                height: 12,
                backgroundImage: `radial-gradient(circle at 6px 6px, ${C.bg} 5px, transparent 5.5px)`,
                backgroundSize: "18px 12px",
              }}
            />
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: -6,
                height: 12,
                backgroundImage: `radial-gradient(circle at 6px 6px, ${C.bg} 5px, transparent 5.5px)`,
                backgroundSize: "18px 12px",
              }}
            />
            {STATS.map((s: any, idx: number) => (
              <div
                key={s.label}
                className="i343-ticketcell"
                style={{ padding: "clamp(24px, 3vw, 34px) clamp(14px, 2vw, 24px)", borderLeft: idx > 0 ? `1px dashed ${C.border}` : "none", textAlign: "center" }}
              >
                <div style={{ fontFamily: DISPLAY, fontSize: "clamp(26px, 3vw, 38px)", lineHeight: 1, color: C.accent }}>{s.value}</div>
                <div style={{ fontFamily: BODY, fontSize: 11.5, letterSpacing: "0.1em", color: C.textFaint, marginTop: 9, lineHeight: 1.5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── LES SOINS — rangées éditoriales numérotées ───────────────────── */}
      <section id="soins" className="i343-pad" style={{ background: C.bgAlt, padding: "clamp(72px, 9vw, 118px) 64px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <Reveal>
            <Kicker>Nos soins</Kicker>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(30px, 4.2vw, 54px)", lineHeight: 1.06, letterSpacing: "-0.012em", color: C.ink, margin: "16px 0 clamp(12px, 2vw, 22px)", maxWidth: 720 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                <>
                  Chaque matière <em style={{ fontStyle: "italic", color: C.accent }}>a son protocole.</em>
                </>
              )}
            </h2>
            <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 15, lineHeight: 1.75, color: C.textMuted, maxWidth: 520, margin: "0 0 clamp(26px, 4vw, 44px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "services.chapeau") ?? (
                <>La fiche de soin est écrite à la réception : c'est elle qui décide du programme, jamais la cadence de la machine.</>
              )}
            </p>
          </Reveal>
          <div style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
            {SERVICES.map((s: any, idx: number) => (
              <Reveal key={s.titre} delay={idx * 0.055} y={18}>
                <SoinRow s={s} idx={idx} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TARIFS — table fine à conduite de points ─────────────────────── */}
      <section id="tarifs" className="i343-pad" style={{ background: C.bg, padding: "clamp(72px, 9vw, 118px) 64px", position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden
          style={{ position: "absolute", top: "8%", left: "-8%", width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle, ${C.accent} 0%, transparent 68%)`, opacity: 0.09, pointerEvents: "none" }}
        />
        <div className="i343-split" style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,0.8fr) minmax(0,1.2fr)", gap: "clamp(30px, 5vw, 64px)", alignItems: "start", position: "relative" }}>
          <div className="i343-sticky" style={{ position: "sticky", top: 110 }}>
            <Reveal>
              <Kicker>Tarifs</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(28px, 3.8vw, 46px)", lineHeight: 1.06, color: C.ink, margin: "16px 0 16px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                  <>
                    Affichés, <em style={{ fontStyle: "italic", color: C.accent }}>tout compris.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 14.5, lineHeight: 1.75, color: C.textMuted, maxWidth: 380, margin: 0 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.note") ?? (
                  <>Détachage courant et apprêt compris dans le prix. Les pièces très tachées font l'objet d'un devis au comptoir, avant traitement.</>
                )}
              </p>
              <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 10, fontFamily: BODY, fontSize: 12.5, color: C.textFaint }}>
                <Clock size={14} color={C.accent} aria-hidden />
                Dépôt avant 10 h → retrait le lendemain 17 h
              </div>
            </Reveal>
          </div>
          <div>
            {TARIFS.map((t: any, idx: number) => (
              <Reveal key={t.a} delay={idx * 0.05} y={16}>
                <TarifLine t={t} idx={idx} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE — frise horizontale à filets ───────────────── */}
      <section id="methode" className="i343-pad" style={{ background: C.bgDark, color: C.white, padding: "clamp(72px, 9vw, 120px) 64px", position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden
          style={{ position: "absolute", inset: 0, opacity: 0.06, pointerEvents: "none", backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 11px)" }}
        />
        <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <Kicker tone="light">Comment ça marche</Kicker>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(28px, 4vw, 50px)", lineHeight: 1.06, color: C.white, margin: "16px 0 clamp(34px, 5vw, 58px)", maxWidth: 640 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                <>
                  Déposez le matin, <em style={{ fontStyle: "italic", color: C.accentLight }}>oubliez le reste.</em>
                </>
              )}
            </h2>
          </Reveal>
          <div className="i343-frise" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 0 }}>
            {METHODE.map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.08}>
                <div style={{ padding: "clamp(20px, 2.4vw, 32px) clamp(16px, 2vw, 26px)", borderLeft: `1px solid rgba(255,255,255,0.12)`, minHeight: "100%", position: "relative" }}>
                  <span aria-hidden style={{ position: "absolute", left: -3, top: 0, width: 5, height: 5, borderRadius: "50%", background: C.accent }} />
                  <div style={{ fontFamily: BODY, fontSize: 10, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: C.accentLight, opacity: 0.85 }}>{m.h}</div>
                  <div style={{ fontFamily: DISPLAY, fontSize: "clamp(32px, 3.4vw, 48px)", lineHeight: 1, color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.4)", margin: "14px 0 16px" }}>{m.n}</div>
                  <h3 style={{ fontFamily: DISPLAY, fontSize: 18, lineHeight: 1.25, color: C.white, margin: "0 0 10px" }}>{m.t}</h3>
                  <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 13.5, lineHeight: 1.72, color: "rgba(255,255,255,0.62)", margin: 0 }}>{m.d}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Vitrine : deux emplacements photo, beaux même vides. */}
          <div className="i343-frise" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 16, marginTop: "clamp(34px, 5vw, 58px)" }}>
            {[
              { i: 2, alt: "Repassage à la vapeur en atelier", label: "Atelier" },
              { i: 3, alt: "Vêtements rendus sous housse", label: "Retrait" },
            ].map((ph, idx) => (
              <Reveal key={ph.i} delay={idx * 0.08}>
                <Plate src={photo(ph.i, PHOTO_FALLBACK[ph.i])} alt={ph.alt} ratio="16/10" label={ph.label} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENTS — panneau photo à gauche, liste à droite ─────────── */}
      <section id="engagements" className="i343-pad" style={{ background: C.bgAlt, padding: "clamp(76px, 9.5vw, 124px) 64px" }}>
        <div className="i343-split" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(34px, 5vw, 72px)", alignItems: "center" }}>
          <Reveal>
            <Plate src={photo(1, PHOTO_FALLBACK[1])} alt="Linge plié et prêt à être rendu" ratio="4/5" label="Aquanettoyage" />
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              <Kicker>Nos engagements</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(26px, 3.6vw, 44px)", lineHeight: 1.08, color: C.ink, margin: "16px 0 22px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>
                    Propre, <em style={{ fontStyle: "italic", color: C.accent }}>dans tous les sens.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 15, lineHeight: 1.78, color: C.textMuted, margin: "0 0 26px", maxWidth: 480 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.texte") ?? c?.aboutText ?? (
                  <>L'atelier est derrière la vitrine : ce qui entre en boutique en ressort, sans passer par un sous-traitant ni par un solvant chloré.</>
                )}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 30 }}>
                {ENGAGEMENT.map((e: any, idx: number) => (
                  <div key={idx} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <Leaf size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} aria-hidden />
                    <span style={{ fontFamily: BODY, fontSize: 14.5, fontWeight: 300, color: C.textMuted, lineHeight: 1.7 }}>{e}</span>
                  </div>
                ))}
              </div>
              <motion.a
                href={telHref}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.ink, color: C.white, padding: "15px 28px", fontFamily: BODY, fontSize: 14, fontWeight: 700, textDecoration: "none" }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                Nous appeler <ArrowRight size={15} aria-hidden />
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── AVIS — le rail du pressing : les cartes défilent comme sur le
             convoyeur, et s'arrêtent quand la souris s'y pose. ──────────── */}
      <section className="i343-pad" style={{ background: C.bg, padding: "clamp(72px, 9vw, 116px) 0", overflow: "hidden" }}>
        <div style={{ padding: "0 clamp(24px, 5vw, 64px)" }}>
          <Reveal>
            <Kicker center>Le quartier</Kicker>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(26px, 3.6vw, 44px)", lineHeight: 1.08, color: C.ink, textAlign: "center", margin: "16px 0 clamp(34px, 5vw, 52px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                <>
                  Ils reviennent <em style={{ fontStyle: "italic", color: C.accent }}>chaque semaine.</em>
                </>
              )}
            </h2>
          </Reveal>
        </div>
        <div className="i343-railwrap">
          <div className="i343-rail">
            {[...AVIS, ...AVIS].map((a: any, idx: number) => (
              <AvisCard key={`${a.auteur}-${idx}`} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <section id="contact" className="i343-pad" style={{ background: C.bgAlt, padding: "clamp(76px, 9.5vw, 124px) 64px", position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden
          style={{ position: "absolute", left: "-3%", bottom: "-14%", fontFamily: DISPLAY, fontSize: "clamp(120px, 20vw, 290px)", lineHeight: 0.8, color: C.ink, opacity: 0.04, pointerEvents: "none", userSelect: "none" }}
        >
          10h
        </div>
        <div className="i343-split" style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,0.9fr)", gap: "clamp(34px, 5vw, 68px)", alignItems: "center", position: "relative" }}>
          <Reveal>
            <div>
              <Kicker>La boutique</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(28px, 4vw, 50px)", lineHeight: 1.06, color: C.ink, margin: "16px 0 18px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                  <>
                    Déposez en passant, <em style={{ fontStyle: "italic", color: C.accent }}>on s'occupe du reste.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 15.5, lineHeight: 1.75, color: C.textMuted, maxWidth: 440, margin: "0 0 34px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ?? (
                  <>Sans rendez-vous aux heures d'ouverture. Dépôt avant 10 h = prêt le lendemain 17 h.</>
                )}
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <motion.a
                  href={telHref}
                  style={{ background: C.accent, color: C.white, padding: "16px 32px", fontFamily: BODY, fontSize: 15.5, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <Phone size={17} aria-hidden /> {phone}
                </motion.a>
                <motion.a
                  href={`mailto:${mail}`}
                  style={{ background: "transparent", color: C.ink, border: `1.5px solid ${C.accent}`, padding: "15px 28px", fontFamily: BODY, fontSize: 15.5, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <Mail size={17} aria-hidden /> Nous écrire
                </motion.a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, padding: "clamp(24px, 3vw, 36px)", boxShadow: "0 20px 48px rgba(19,21,29,0.07)" }}>
              {[
                { icon: MapPin, label: "Boutique & atelier", value: adresse },
                { icon: Phone, label: "Téléphone", value: phone, href: telHref },
                { icon: Mail, label: "E-mail", value: mail, href: `mailto:${mail}` },
                { icon: Clock, label: "Horaires", value: "Lun–Ven 7h30–19h30 · Sam 9h–18h" },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} style={{ display: "flex", gap: 15, alignItems: "flex-start", padding: "14px 0", borderTop: idx > 0 ? `1px solid ${C.borderSoft}` : "none" }}>
                    <div style={{ width: 38, height: 38, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", color: C.accentDark, flexShrink: 0 }}>
                      <Icon size={16} aria-hidden />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: BODY, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.textFaint }}>{item.label}</div>
                      {item.href ? (
                        <a href={item.href} style={{ fontFamily: DISPLAY, fontSize: 16.5, color: C.ink, textDecoration: "none" }}>{item.value}</a>
                      ) : (
                        <div style={{ fontFamily: DISPLAY, fontSize: 16.5, color: C.ink, lineHeight: 1.4 }}>{item.value}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="i343-pad" style={{ background: C.bgDarkAlt, color: "rgba(255,255,255,0.6)", padding: "clamp(46px, 6vw, 68px) 64px 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 34 }}>
            <div style={{ maxWidth: 320 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
                <Shirt size={16} color={C.accentLight} aria-hidden />
                <span style={{ fontFamily: DISPLAY, fontSize: 20, color: C.white }}>{nom}</span>
              </div>
              <p style={{ fontFamily: BODY, fontSize: 13, fontWeight: 300, lineHeight: 1.75, color: "rgba(255,255,255,0.45)", margin: 0 }}>
                {metier} & blanchisserie · {clientCodePostalVille(sessionData, "75015", "Paris")}
                <br />
                Aquanettoyage — zéro perchloroéthylène depuis 2020
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <span style={{ fontFamily: BODY, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>Navigation</span>
              {NAV.map(({ l, h }) => (
                <a key={l} href={h} style={{ fontFamily: BODY, fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none", padding: "2px 0" }}>
                  {l}
                </a>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <span style={{ fontFamily: BODY, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>Nous trouver</span>
              <span style={{ fontFamily: BODY, fontSize: 13, color: "rgba(255,255,255,0.55)", display: "flex", gap: 9, alignItems: "center" }}>
                <MapPin size={13} aria-hidden /> {adresse}
              </span>
              <a href={telHref} style={{ fontFamily: DISPLAY, fontSize: 16, color: C.accentLight, textDecoration: "none" }}>{phone}</a>
              <span style={{ fontFamily: BODY, fontSize: 13, color: "rgba(255,255,255,0.55)", display: "flex", gap: 9, alignItems: "center" }}>
                <Clock size={13} aria-hidden /> Lun–Ven 7h30–19h30 · Sam 9h–18h
              </span>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontFamily: BODY, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
              © {new Date().getFullYear()} {nom} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
              {/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ fontFamily: BODY, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
              Mentions légales : éditeur {nom} · hébergement Vercel Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
