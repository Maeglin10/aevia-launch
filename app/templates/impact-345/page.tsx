"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Award,
  Beef,
  CheckCircle,
  Clock,
  Drumstick,
  Flame,
  Mail,
  MapPin,
  Phone,
  Scissors,
  Star,
  Utensils,
} from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { CircularLabel, DWELL, HeldSwap, useSlides } from "@/lib/templates/hero-kit-2";
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
   MAISON BERTIN — Boucherie-charcuterie artisanale · Halles de Dijon.
   Réécriture premium (reprise 316–383, famille II).

   Geste signature : HeldSwap — la pièce sort, l'étal reste vide un demi-temps,
   la suivante arrive. Ce vide tenu EST le geste : rien ne se croise, rien ne
   se fond. Il est monté sur le médaillon circulaire du héros, avec DWELL.slow
   (5,6 s) pour laisser respirer les 1,4 s de sortie + attente + entrée.

   Héros H4 : éditorial décalé — le titre en Libre Baskerville chevauche le
   panneau d'étal qui porte le médaillon et les chiffres de la maison. Fontes
   P1 (Libre Baskerville + Nunito). Palette sombre #120c0e / #d46a72.
   Signatures de section : prestations en colonnes filetées à chiffres romains,
   méthode en rangées alternées, prix sur une ardoise, avis en citation
   d'exergue. Aucune couleur hors des jetons `C`.
   ════════════════════════════════════════════════════════════════════════════ */

let C: Record<string, string> = {
  bg: "#120c0e",
  bgAlt: "#180f12",
  bgDark: "#0b0708",
  bgDarkAlt: "#080506",
  bgCard: "#1b1114",
  accent: "var(--brand,#d46a72)",
  accentDark: "var(--brand-light,#e7a0a5)",
  accentLight: "#24151a",
  ink: "#f4edee",
  textMuted: "#b3a3a6",
  textFaint: "#a89a9d",
  border: "rgba(255,255,255,0.09)",
  borderSoft: "rgba(255,255,255,0.055)",
  white: "#ffffff",
  chalk: "#efe4e2",
};

const DISPLAY = "'Libre Baskerville', Georgia, serif";
const BODY = "'Nunito', system-ui, -apple-system, sans-serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const NAV = [
  { l: "Nos viandes", h: "#viandes" },
  { l: "La maison", h: "#maison" },
  { l: "Prix du moment", h: "#tarifs" },
  { l: "Traçabilité", h: "#engagements" },
  { l: "Contact", h: "#contact" },
];

/* ── Données de démonstration (contenu du thème, conservé mot pour mot) ───── */

const HERO_SOURCE = [
  { k: "Bœuf charolais", line: "Maturée 30 jours, découpée à la demande.", sub: "Élevage Perrot, Sombernon — à 34 km de l'étal." },
  { k: "Porc fermier", line: "Élevé sur paille, transformé au labo.", sub: "Terrines, saucisses et jambon maison." },
  { k: "Volaille de Bresse", line: "La seule volaille AOP de France.", sub: "Commandée le mardi, à l'étal le vendredi." },
];
let HERO = HERO_SOURCE;

/* Le médaillon annonce les pièces du client dès qu'il en a saisi : le geste
   reste celui du thème, la viande nommée devient la sienne. */
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
  { titre: "Bœuf de Charolles", desc: "Carcasses entières sélectionnées à l'abattoir de Venarey, maturées 21 à 45 jours en cave de maturation visible en boutique.", tag: "Bœuf", icon: Beef, romain: "I" },
  { titre: "Porc fermier", desc: "Élevé sur paille en Bresse louhannaise. Côtes, rôtis, et toute la charcuterie maison : terrines, boudin, saucisson à l'ail.", tag: "Porc", icon: Flame, romain: "II" },
  { titre: "Agneau de l'Aveyron", desc: "Label Rouge, travaillé entier : gigots, carrés, épaules confites préparées au labo. Sur commande de septembre à juin.", tag: "Agneau", icon: Award, romain: "III" },
  { titre: "Volailles", desc: "Bresse AOP, poulets fermiers jaunes des Landes, pintades et canettes. Effilées ou prêtes à cuire, abats sur demande.", tag: "Volaille", icon: Drumstick, romain: "IV" },
  { titre: "Charcuterie maison", desc: "Jambon blanc cuit au torchon, pâté en croûte primé, saucisses du jour : tout sort du laboratoire attenant, rien d'assemblé.", tag: "Maison", icon: Scissors, romain: "V" },
  { titre: "Plats du traiteur", desc: "Bourguignon, blanquette, lasagnes : cuisinés le matin avec nos viandes. Le déjeuner des halles, à emporter.", tag: "Traiteur", icon: Utensils, romain: "VI" },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE_SOURCE = [
  { n: "01", t: "Acheter en carcasse", d: "Nous choisissons les bêtes entières chez quatre éleveurs partenaires — pas au catalogue d'un grossiste." },
  { n: "02", t: "Maturer sur place", d: "La cave vitrée fait le travail du temps : 21 à 45 jours selon les pièces, à l'œil et au toucher." },
  { n: "03", t: "Couper devant vous", d: "La découpe se fait à la demande : épaisseur, parage, barde. Dites comment vous cuisinez, on coupe pour ça." },
  { n: "04", t: "Conseiller la cuisson", d: "Chaque pièce part avec son conseil : température, repos, sauce. La viande se respecte jusqu'à l'assiette." },
];
let METHODE = METHODE_SOURCE;

/* La première étape nommait les éleveurs sans dire où : la ville du client la
   rend vraie chez lui, sans rien inventer d'autre. */
function METHODE_LIVE() {
  const ville = clientCity(sessionData);
  if (!ville) return METHODE_SOURCE;
  return METHODE_SOURCE.map((m, i) => (i === 0 ? { ...m, d: `${m.d} Tous livrent l'étal de ${ville}.` } : m));
}

const ENGAGEMENT_SOURCE = [
  "Origine née-élevée-abattue affichée pour chaque viande, à l'étal et sur le ticket",
  "Quatre élevages partenaires, tous à moins de 90 km, visitables sur demande",
  "Laboratoire de transformation attenant, contrôles sanitaires HACCP quotidiens",
  "Le dimanche midi, on garde vos commandes au frais jusqu'à 12h30 précises",
];
let ENGAGEMENT = ENGAGEMENT_SOURCE;

const TARIFS_SOURCE = [
  { a: "Côte de bœuf maturée 30 j", p: "39,90 €/kg", n: "Charolais de Sombernon, coupée à l'épaisseur demandée." },
  { a: "Saucisses du jour", p: "12,90 €/kg", n: "Faites le matin au labo : nature, herbes, ou chorizo doux." },
  { a: "Poulet fermier jaune", p: "9,90 €/kg", n: "Landes Label Rouge, prêt à cuire, abats offerts sur demande." },
  { a: "Plat traiteur du jour", p: "9,50 €/part", n: "Bourguignon, blanquette ou mijoté de saison, en bocal consigné." },
];
let TARIFS = TARIFS_SOURCE;

const AVIS_SOURCE = [
  { texte: "La côte de bœuf des grandes occasions vient d'ici depuis vingt ans. Le patron connaît l'éleveur, la bête et notre four. On ne mange pas de la viande, on mange la sienne.", auteur: "Bernard C.", detail: "Client depuis 2004" },
  { texte: "Le pâté en croûte du samedi est une institution familiale. Commandé le mardi, sinon il n'y en a plus — c'est bon signe.", auteur: "Famille Morel", detail: "Charcuterie maison" },
  { texte: "J'ai demandé une découpe spéciale pour un bœuf Wellington : conseils de cuisson inclus, filet paré au millimètre. Réussi du premier coup grâce à eux.", auteur: "Antoine G.", detail: "Découpe sur mesure" },
];
let AVIS = AVIS_SOURCE;

const STATS_SOURCE = [
  { value: "34 km", label: "L'élevage le plus loin" },
  { value: "30 j", label: "De maturation sur os" },
  { value: "1962", label: "La maison, aux halles depuis" },
  { value: "100 %", label: "Viandes nées et élevées en France" },
];
let STATS = STATS_SOURCE;

const COMMANDE_SOURCE = [
  "Commande la veille pour un retrait au banc",
  "Découpe sur mesure : épaisseur, parage, barde",
  "Conservation au frais jusqu'à 12h30 le dimanche",
];
let COMMANDE = COMMANDE_SOURCE;

/* URL photo du thème — conservée telle quelle. Les autres emplacements
   attendent celles du client : sans image, le repli CSS tient la page. */
const PHOTO_FALLBACK = [
  "https://images.pexels.com/photos/35023463/pexels-photo-35023463.jpeg?auto=compress&cs=tinysrgb&w=1400",
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
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Kicker maison : filet 40×1 px, capitales très filées. */
function Kicker({ children, tone = "muted", center = false }: { children: React.ReactNode; tone?: "muted" | "accent"; center?: boolean }) {
  const col = tone === "accent" ? C.accent : C.textFaint;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: center ? "center" : "flex-start", color: col }}>
      <span aria-hidden style={{ width: 40, height: 1, background: "currentColor", opacity: 0.75, flexShrink: 0 }} />
      <span style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.36em", textTransform: "uppercase", color: "currentColor" }}>
        {children}
      </span>
      {center && <span aria-hidden style={{ width: 40, height: 1, background: "currentColor", opacity: 0.75, flexShrink: 0 }} />}
    </div>
  );
}

/**
 * Surface photographique avec repli dessiné.
 *
 * Sans image — proxy bloqué ou client qui n'en fournit pas — la boîte tient
 * seule : aplat chaud, grain de billot en CSS, tranche d'accent, et le tracé
 * au trait d'un crochet de boucherie.
 */
function Plate({ src, alt, ratio = "4/3", label, round = false }: { src: string; alt: string; ratio?: string; label?: string; round?: boolean }) {
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: ratio,
        background: C.accentLight,
        overflow: "hidden",
        borderRadius: round ? "50%" : 0,
        boxShadow: `inset 0 0 0 1px ${C.border}`,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.5,
          backgroundImage: "repeating-linear-gradient(115deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 9px)",
        }}
      />
      <div aria-hidden style={{ position: "absolute", inset: 0, background: `radial-gradient(90% 70% at 30% 20%, ${C.accent} 0%, transparent 70%)`, opacity: 0.16 }} />
      {!src && (
        <svg aria-hidden viewBox="0 0 120 120" style={{ position: "absolute", left: "50%", top: "50%", width: "34%", transform: "translate(-50%,-50%)", opacity: 0.5 }}>
          <path d="M60 18c9 0 14 6 14 13s-5 11-5 16v9" fill="none" stroke={C.accentDark} strokeWidth="1.4" />
          <path d="M40 60h40l-6 40H46L40 60Z" fill="none" stroke={C.accentDark} strokeWidth="1.4" />
        </svg>
      )}
      {src && <img src={src} alt={alt} loading="lazy" style={{ position: "relative", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
      {!round && <span aria-hidden style={{ position: "absolute", left: 0, bottom: 0, width: "34%", height: 3, background: C.accent }} />}
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
            background: "rgba(11,7,8,0.78)",
            border: `1px solid ${C.border}`,
            padding: "6px 12px",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

/* Colonne filetée d'une viande : chiffre romain fantôme, filet d'accent qui
   pousse au survol, flèche qui avance. */
function ViandeCol({ s, idx }: { s: any; idx: number }) {
  const [hov, setHov] = useState(false);
  const Icon = s.icon ?? Beef;
  return (
    <article
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        padding: "clamp(26px, 3vw, 38px) clamp(18px, 2.2vw, 30px)",
        borderLeft: `1px solid ${C.borderSoft}`,
        background: hov ? C.bgCard : "transparent",
        transform: hov ? "translateY(-4px)" : "none",
        boxShadow: hov ? "0 24px 48px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.3)" : "none",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        minHeight: "100%",
        overflow: "hidden",
      }}
    >
      <span aria-hidden style={{ position: "absolute", left: -1, top: 0, width: 2, height: hov ? "100%" : 0, background: C.accent, transition: "height 0.55s cubic-bezier(0.16, 1, 0.3, 1)" }} />
      <span
        aria-hidden
        style={{ position: "absolute", right: 10, bottom: -18, fontFamily: DISPLAY, fontSize: 116, lineHeight: 0.8, color: C.ink, opacity: 0.055, pointerEvents: "none", userSelect: "none" }}
      >
        {s.romain}
      </span>
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <Icon size={18} color={hov ? C.accent : C.textFaint} aria-hidden style={{ transition: "color 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }} />
          <span style={{ fontFamily: BODY, fontSize: 10, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: C.textFaint }}>{s.tag}</span>
        </div>
        <h3 style={{ fontFamily: DISPLAY, fontSize: "clamp(19px, 2.1vw, 24px)", lineHeight: 1.25, color: C.ink, margin: "0 0 12px" }}>{s.titre}</h3>
        <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 14, lineHeight: 1.75, color: C.textMuted, margin: 0 }}>{s.desc}</p>
        <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 9, fontFamily: BODY, fontSize: 12.5, fontWeight: 700, color: hov ? C.accent : C.textFaint, transition: "color 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          Commander cette pièce
          <ArrowRight size={14} aria-hidden style={{ transform: hov ? "translateX(7px)" : "none", transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }} />
        </div>
      </div>
    </article>
  );
}

/* Ligne d'ardoise : le prix écrit à la craie, la conduite de points au milieu. */
function ArdoiseLine({ t, idx }: { t: any; idx: number }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "clamp(18px, 2.4vw, 26px) clamp(10px, 2vw, 22px)",
        borderTop: idx === 0 ? "none" : `1px solid ${C.borderSoft}`,
        background: hov ? "rgba(255,255,255,0.035)" : "transparent",
        transform: hov ? "translateX(6px)" : "none",
        boxShadow: hov ? `inset 3px 0 0 0 ${C.accent}` : "inset 0 0 0 0 transparent",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontFamily: DISPLAY, fontSize: "clamp(16px, 1.9vw, 21px)", color: C.chalk, lineHeight: 1.25 }}>{t.a}</span>
        <span aria-hidden style={{ flex: "1 1 40px", minWidth: 30, height: 1, borderBottom: `1px dotted ${hov ? C.accent : C.border}`, transform: "translateY(-4px)", transition: "border-color 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }} />
        <span style={{ fontFamily: DISPLAY, fontSize: "clamp(17px, 2vw, 22px)", color: hov ? C.accentDark : C.accent, whiteSpace: "nowrap", transition: "color 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }}>{t.p}</span>
      </div>
      <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 13.5, lineHeight: 1.68, color: C.textMuted, margin: "7px 0 0", maxWidth: 560 }}>{t.n}</p>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function MaisonBertinPage() {
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

  /* Blocs vivants : recalculés à chaque rendu, une fois la session affectée. */
  HERO = HERO_LIVE();
  METHODE = METHODE_LIVE();
  STATS = resolveList(clientStats(sessionData), STATS_SOURCE);
  ENGAGEMENT = resolveList(clientCertifications(sessionData), ENGAGEMENT_SOURCE);
  COMMANDE = resolveList(clientList(sessionData, "contact.reperes"), COMMANDE_SOURCE);
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
      romain: SERVICES_DEMO[n % SERVICES_DEMO.length].romain,
    })),
    SERVICES_DEMO,
  );

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Un seul index pour tout le héros : médaillon, sur-titre, légende,
     compteur. DWELL.slow (5,6 s) laisse le vide se tenir entre deux pièces. */
  const { i, go } = useSlides(HERO.length, DWELL.slow);
  const S = HERO[i];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const nom = clientName(sessionData) ?? fd?.businessName ?? "Maison Bertin";
  const ville = clientCity(sessionData) ?? "Dijon";
  const metier = clientTrade(sessionData) ?? "Boucher-charcutier";
  const phone = clientPhone(sessionData) ?? "03 80 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? "+33380000000").replace(/[^+\d]/g, "")}`;
  const mail = clientEmail(sessionData) ?? "commande@maison-bertin.fr";
  const adresse = clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "21000", "Dijon");
  const anneeStat = STATS.find((s: any) => /^\d{4}$/.test(String(s.value ?? "")));

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: BODY, overflowX: "clip" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Nunito:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&display=swap');

        /*
          ── Héros « chiffre en avant » ─────────────────────────────────────
          Le millésime tient la place du titre ; le médaillon l'accompagne
          sans lui faire face — il est nettement plus petit, sinon on
          retomberait sur deux colonnes de même poids, la charpente qu'on
          quitte.
        */
        .i345-millesime {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: minmax(0, 1fr) clamp(150px, 20vw, 260px);
          gap: clamp(24px, 4vw, 64px);
          align-items: center;
        }
        .i345-medaillon { position: relative; width: 100%; }
        .i345-dire {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.6fr);
          gap: clamp(22px, 3.4vw, 52px);
          align-items: start;
        }
        .i345-piece { border-left: 1px solid ${C.borderSoft}; padding-left: clamp(16px, 2vw, 28px); }

        @media (max-width: 980px) { #i345-nav { display: none !important; } .i345-burger { display: flex !important; } }
          .aevia-action-mobile { display: inline-flex !important; }
        @media (max-width: 900px) {
          .i345-hero { gap: 26px !important; }
          /* Empilés, le médaillon se recentre et le filet vertical de la
             pièce du jour redevient horizontal. */
          .i345-millesime { grid-template-columns: minmax(0,1fr); row-gap: 26px; }
          .i345-medaillon { max-width: 220px; margin: 0 auto; }
          .i345-dire { grid-template-columns: minmax(0,1fr); row-gap: 26px; }
          .i345-piece { border-left: none; border-top: 1px solid ${C.borderSoft}; padding-left: 0; padding-top: 22px; }
        }
        @media (max-width: 560px) {
          /* 220 px de millésime ne tiennent pas dans 390. */
          .i345-annee { font-size: clamp(64px, 22vw, 104px) !important; }
        }
        @media (max-width: 860px) {
          .i345-split { grid-template-columns: minmax(0,1fr) !important; }
          .i345-split > * { order: initial !important; }
          .i345-rangee { grid-template-columns: minmax(0,1fr) !important; }
          .i345-rangee > * { order: initial !important; }
          .i345-colonnes > * { border-left: none !important; border-top: 1px solid ${C.borderSoft} !important; }
          .i345-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i345-sticky { position: static !important; }
        }

        .i345-navlink { position: relative; }
        .i345-navlink::after {
          content: ""; position: absolute; left: 8px; bottom: 7px; height: 1.5px; width: 0;
          background: ${C.accent}; transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .i345-navlink:hover::after { width: calc(100% - 16px); }

        @media (prefers-reduced-motion: reduce) {
          .i345-navlink::after { transition: none; }
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
          background: scrolled ? "rgba(11,7,8,0.93)" : "transparent",
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
              <Beef size={17} color={C.accent} style={{ flexShrink: 0 }} aria-hidden />
              <span style={{ fontFamily: DISPLAY, fontSize: 18, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nom}</span>
              <span style={{ fontFamily: BODY, fontSize: 9.5, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textFaint, marginLeft: 8 }}>{metier}</span>
            </>
          )}
        </div>
        <div id="i345-nav" style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} className="i345-navlink" style={{ fontFamily: BODY, color: C.textMuted, fontSize: 13.5, fontWeight: 600, textDecoration: "none", padding: "12px 8px" }}>
              {l}
            </a>
          ))}
          <motion.a
            href={telHref}
            style={{ background: C.accent, color: C.bgDark, padding: "12px 22px", fontFamily: BODY, fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", marginLeft: 12 }}
            whileHover={{ scale: 1.03, y: -1 }}
          >
            Commander
          </motion.a>
        </div>
        {/* L'appel à l'action sous le pouce : la barre est fixe, mais son
            bouton vit dans le menu déroulant, en display:none sous le point
            de rupture. Celui-ci paraît exactement avec le bouton de menu. */}
        <ActionMobile href={telHref} fond={C.accent} encre={C.bgDark}>
          Appeler
        </ActionMobile>
        <button
          className="i345-burger"
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
        <div style={{ position: "fixed", top: 62, left: 0, right: 0, zIndex: 99, background: C.bgDark, borderBottom: `1px solid ${C.border}`, padding: "18px 26px 24px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ fontFamily: BODY, color: C.ink, fontSize: 16, fontWeight: 600, textDecoration: "none", padding: "12px 0" }}>
              {l}
            </a>
          ))}
          <a href={telHref} style={{ background: C.accent, color: C.bgDark, padding: "14px 22px", fontFamily: BODY, fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 10 }}>
            Commander
          </a>
        </div>
      )}

      {/* ── HÉROS H4 — le titre chevauche le panneau d'étal ──────────────── */}
      {/* ── HERO — le chiffre en avant : l'année d'installation ────────────
             Elle traînait en fond à 4 % d'opacité pendant que le titre
             chevauchait un panneau à sa droite. Aux halles, l'ancienneté est
             l'argument : elle passe donc au premier plan et prend la place du
             titre, qui descend d'un cran. Plus de colonne texte face à une
             colonne panneau — c'était la charpente de la série. */}
      <section
        className="i345-hero i345-pad"
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "clamp(24px, 3.4vh, 44px)",
          padding: "clamp(124px, 14vh, 160px) clamp(24px, 5vw, 64px) clamp(48px, 7vh, 80px)",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        {/* Grain de billot + halo : la seule texture du héros, sans image. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.5,
            backgroundImage: "repeating-linear-gradient(115deg, rgba(255,255,255,0.022) 0 1px, transparent 1px 11px)",
          }}
        />
        <div
          aria-hidden
          style={{ position: "absolute", top: "6%", right: "12%", width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, ${C.accent} 0%, transparent 68%)`, opacity: 0.1, pointerEvents: "none" }}
        />

        <Kicker tone="accent">{clientEyebrow(sessionData) ?? `${metier} · Halles de ${ville}`}</Kicker>

        {/* ── L'ANNÉE, et le médaillon de la pièce du jour ───────────────── */}
        <div className="i345-millesime">
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: BODY, fontSize: "clamp(11px, 1.1vw, 13px)", fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: C.accent, marginBottom: "clamp(8px, 1.2vw, 16px)" }}>
              {anneeStat?.label ?? "Aux halles depuis"}
            </div>
            {/* Le millésime déborde légèrement à gauche : il ouvre la page. */}
            <div
              className="i345-annee"
              style={{ fontFamily: DISPLAY, fontSize: "clamp(86px, 15vw, 220px)", lineHeight: 0.8, letterSpacing: "-0.045em", color: C.ink, marginLeft: "-0.04em", textShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
            >
              {anneeStat?.value ?? "1962"}
            </div>
          </div>

          {/* Le médaillon : la pièce posée, tenue, remplacée. */}
          <div className="i345-medaillon">
            <div style={{ position: "relative", width: "100%" }}>
              <HeldSwap index={i} tilt={6}>
                <div style={{ position: "relative" }}>
                  <Plate src={photo(0, PHOTO_FALLBACK[0])} alt={`${nom} — ${S.k}`} ratio="1/1" round />
                  <span aria-hidden style={{ position: "absolute", inset: -10, borderRadius: "50%", border: `1px solid ${C.border}`, pointerEvents: "none" }} />
                </div>
              </HeldSwap>
              {/* Détail gratuit : le sceau tournant de la maison. */}
              <div style={{ position: "absolute", right: -14, bottom: -14 }}>
                <CircularLabel
                  text={`${nom} · ${metier} · `}
                  size={98}
                  color={C.accentDark}
                  fontSize={7.4}
                  seconds={26}
                  className=""
                >
                  <Award size={17} color={C.accent} aria-hidden />
                </CircularLabel>
              </div>
            </div>
          </div>
        </div>

        {/* la règle qui sépare le millésime de ce qu'il garantit */}
        <span aria-hidden style={{ position: "relative", zIndex: 1, height: 1, background: `linear-gradient(90deg, ${C.accent}, ${C.border} 40%, transparent)` }} />

        {/* ── Ce que l'année achète ──────────────────────────────────────── */}
        <div className="i345-dire">
          <div style={{ minWidth: 0 }}>
            <h1
              className="i345-titre"
              style={{ fontFamily: DISPLAY, fontSize: "clamp(26px, 3.4vw, 46px)", lineHeight: 1.04, letterSpacing: "-0.02em", color: C.ink, margin: 0, overflowWrap: "break-word" }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ??
                clientHeroLine(sessionData, 0, 1, 34) ??
                "La viande d'éleveurs qu'on connaît par leur prénom."}
            </h1>
            <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: "clamp(14.5px, 1.4vw, 16.5px)", lineHeight: 1.78, color: C.textMuted, maxWidth: 480, margin: "clamp(14px, 1.8vw, 20px) 0 clamp(22px, 2.6vw, 30px)" }}>
              {clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? "Charolais de Côte-d'Or, porc fermier élevé sur paille, volailles de Bresse : tout est tracé, maturé sur place et coupé devant vous. Une boucherie, pas un rayon."}
            </p>
            {/* Une seule action pleine ; les viandes restent un lien. */}
            <div style={{ display: "flex", gap: "clamp(16px, 2vw, 26px)", flexWrap: "wrap", alignItems: "center" }}>
              <motion.a
                href={telHref}
                style={{ background: C.accent, color: C.bgDark, padding: "16px 30px", fontFamily: BODY, fontSize: 14.5, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                Commander pour le week-end <ArrowRight size={16} aria-hidden />
              </motion.a>
              <a href="#viandes" style={{ fontFamily: BODY, fontSize: 13, color: C.ink, textDecoration: "none", borderBottom: `1px solid ${C.accent}`, paddingBottom: 3 }}>
                Nos viandes
              </a>
            </div>
          </div>

          {/* La pièce montrée, et de quoi passer aux autres. */}
          <div className="i345-piece">
            <div style={{ fontFamily: BODY, fontSize: 10, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: C.accent, marginBottom: 7 }}>{S.k}</div>
            <div style={{ fontFamily: DISPLAY, fontSize: "clamp(15px, 1.6vw, 18px)", lineHeight: 1.35, color: C.ink }}>{S.line}</div>
            <div style={{ fontFamily: BODY, fontSize: 12.5, color: C.textMuted, lineHeight: 1.7, marginTop: 9 }}>{S.sub}</div>
            {/*
              La fraction « 01 / 03 » ne disait pas ce qu'on regardait ; ces
              traits nomment les pièces et y mènent directement.
            */}
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              {HERO.map((h: any, n: number) => (
                <button
                  key={h.k ?? n}
                  type="button"
                  onClick={() => go(n)}
                  aria-label={h.k ?? `Pièce ${n + 1}`}
                  aria-current={n === i}
                  style={{ width: 34, height: 3, padding: 0, border: "none", cursor: "pointer", background: n === i ? C.accent : C.borderSoft, transition: "background .3s" }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RESPIRATION — une phrase, le vide autour ─────────────────────── */}
      <section className="i345-pad" style={{ background: C.bg, padding: "clamp(56px, 8vw, 100px) 64px clamp(30px, 4vw, 48px)", textAlign: "center" }}>
        <Reveal>
          <p style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: "clamp(20px, 2.6vw, 31px)", lineHeight: 1.55, color: C.textMuted, maxWidth: 680, margin: "0 auto" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (
              <>
                On ne vend pas de la viande. <span style={{ color: C.ink }}>On vend celle d'une bête qu'on a choisie.</span>
              </>
            )}
          </p>
        </Reveal>
      </section>

      {/* ── NOS VIANDES — colonnes filetées, chiffres romains fantômes ───── */}
      <section id="viandes" className="i345-pad" style={{ background: C.bgAlt, padding: "clamp(72px, 9vw, 118px) 64px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <Kicker>Nos viandes</Kicker>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(28px, 4vw, 50px)", lineHeight: 1.08, letterSpacing: "-0.012em", color: C.ink, margin: "16px 0 14px", maxWidth: 700 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                <>
                  Peu d'élevages, <em style={{ fontStyle: "italic", color: C.accent }}>mais les bons.</em>
                </>
              )}
            </h2>
            <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 15, lineHeight: 1.75, color: C.textMuted, maxWidth: 520, margin: "0 0 clamp(28px, 4vw, 46px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "services.chapeau") ?? (
                <>Quatre éleveurs, des bêtes entières, une cave de maturation visible depuis la boutique : tout le reste en découle.</>
              )}
            </p>
          </Reveal>
          <div className="i345-colonnes" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: 0, borderTop: `1px solid ${C.borderSoft}`, borderBottom: `1px solid ${C.borderSoft}` }}>
            {SERVICES.map((s: any, idx: number) => (
              <Reveal key={s.titre} delay={idx * 0.055} y={18}>
                <ViandeCol s={s} idx={idx} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── LA MAISON — rangées alternées, numéros géants ────────────────── */}
      <section id="maison" className="i345-pad" style={{ background: C.bg, padding: "clamp(76px, 9vw, 124px) 64px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <Kicker>La maison</Kicker>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(28px, 4vw, 50px)", lineHeight: 1.08, color: C.ink, margin: "16px 0 clamp(34px, 5vw, 58px)", maxWidth: 620 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                <>
                  Trois générations <em style={{ fontStyle: "italic", color: C.accent }}>derrière le même billot.</em>
                </>
              )}
            </h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {METHODE.map((m: any, idx: number) => (
              <Reveal key={m.n} delay={idx * 0.07} y={20}>
                <div
                  className="i345-rangee"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0,0.34fr) minmax(0,1fr)",
                    gap: "clamp(18px, 3vw, 48px)",
                    alignItems: "start",
                    padding: "clamp(26px, 3.4vw, 42px) 0",
                    borderTop: `1px solid ${C.borderSoft}`,
                  }}
                >
                  <div style={{ order: idx % 2 === 1 ? 2 : 1 }}>
                    <div style={{ fontFamily: DISPLAY, fontSize: "clamp(46px, 6vw, 88px)", lineHeight: 0.9, color: "transparent", WebkitTextStroke: `1px ${C.accent}`, opacity: 0.9 }}>{m.n}</div>
                  </div>
                  <div style={{ order: idx % 2 === 1 ? 1 : 2, textAlign: idx % 2 === 1 ? "right" : "left" }}>
                    <h3 style={{ fontFamily: DISPLAY, fontSize: "clamp(19px, 2.2vw, 26px)", lineHeight: 1.25, color: C.ink, margin: "0 0 12px" }}>{m.t}</h3>
                    <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 14.5, lineHeight: 1.78, color: C.textMuted, margin: 0, maxWidth: 560, marginLeft: idx % 2 === 1 ? "auto" : 0 }}>{m.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* L'étal, en deux emplacements — beaux même sans image. */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 16, marginTop: "clamp(36px, 5vw, 60px)" }}>
            {[
              { i: 1, alt: "Vitrine réfrigérée de la boucherie", label: "L'étal" },
              { i: 2, alt: "Cave de maturation vitrée", label: "La cave" },
            ].map((ph, idx) => (
              <Reveal key={ph.i} delay={idx * 0.08}>
                <Plate src={photo(ph.i, PHOTO_FALLBACK[ph.i])} alt={ph.alt} ratio="16/10" label={ph.label} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIX DU MOMENT — l'ardoise ───────────────────────────────────── */}
      <section id="tarifs" className="i345-pad" style={{ background: C.bgDark, padding: "clamp(76px, 9vw, 124px) 64px" }}>
        <div className="i345-split" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,0.78fr) minmax(0,1.22fr)", gap: "clamp(30px, 5vw, 64px)", alignItems: "start" }}>
          <div className="i345-sticky" style={{ position: "sticky", top: 110 }}>
            <Reveal>
              <Kicker>Prix du moment</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(26px, 3.6vw, 44px)", lineHeight: 1.08, color: C.ink, margin: "16px 0 16px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                  <>
                    Le juste prix <em style={{ fontStyle: "italic", color: C.accent }}>d'une bête bien élevée.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 14.5, lineHeight: 1.75, color: C.textMuted, maxWidth: 380, margin: 0 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.note") ?? (
                  <>Les prix varient avec les saisons et les bêtes — ceux-ci sont indicatifs, l'étal fait foi.</>
                )}
              </p>
              <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 10, fontFamily: BODY, fontSize: 12.5, color: C.textFaint }}>
                <Clock size={14} color={C.accent} aria-hidden />
                Les plus belles pièces partent avant 10 h
              </div>
            </Reveal>
          </div>
          {/* La surface d'ardoise : aplat très sombre, cadre de craie, grain CSS. */}
          <Reveal delay={0.1}>
            <div
              style={{
                position: "relative",
                background: C.bgDarkAlt,
                border: `1px solid ${C.border}`,
                boxShadow: `inset 0 0 0 6px ${C.bgDark}, 0 26px 60px rgba(0,0,0,0.45)`,
                padding: "clamp(24px, 3vw, 40px)",
                overflow: "hidden",
              }}
            >
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.16,
                  pointerEvents: "none",
                  backgroundImage: `repeating-radial-gradient(circle at 20% 30%, ${C.chalk} 0 0.6px, transparent 0.6px 5px), repeating-radial-gradient(circle at 70% 60%, ${C.chalk} 0 0.5px, transparent 0.5px 7px)`,
                }}
              />
              <div style={{ position: "relative" }}>
                <div style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: "clamp(19px, 2.2vw, 25px)", color: C.chalk, marginBottom: 18, letterSpacing: "0.01em" }}>
                  Ardoise du jour
                </div>
                {TARIFS.map((t: any, idx: number) => (
                  <ArdoiseLine key={t.a} t={t} idx={idx} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TRAÇABILITÉ — panneau à gauche, engagements à droite ─────────── */}
      <section id="engagements" className="i345-pad" style={{ background: C.bgAlt, padding: "clamp(76px, 9.5vw, 124px) 64px" }}>
        <div className="i345-split" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(34px, 5vw, 72px)", alignItems: "center" }}>
          <Reveal>
            <Plate src={photo(1, PHOTO_FALLBACK[1])} alt="Origine des viandes affichée à l'étal" ratio="4/5" label="Origine affichée" />
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              <Kicker>Nos engagements</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(26px, 3.6vw, 44px)", lineHeight: 1.08, color: C.ink, margin: "16px 0 20px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>
                    La traçabilité, <em style={{ fontStyle: "italic", color: C.accent }}>affichée à la craie.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 15, lineHeight: 1.78, color: C.textMuted, margin: "0 0 26px", maxWidth: 480 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.texte") ?? c?.aboutText ?? (
                  <>Une boucherie se juge à ce qu'elle accepte d'écrire au-dessus de ses pièces : l'origine, l'éleveur, la date de maturation.</>
                )}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 30 }}>
                {ENGAGEMENT.map((e: any, idx: number) => (
                  <div key={idx} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <CheckCircle size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} aria-hidden />
                    <span style={{ fontFamily: BODY, fontSize: 14.5, fontWeight: 300, color: C.textMuted, lineHeight: 1.7 }}>{e}</span>
                  </div>
                ))}
              </div>
              <motion.a
                href={telHref}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.accent, color: C.bgDark, padding: "15px 28px", fontFamily: BODY, fontSize: 14, fontWeight: 700, textDecoration: "none" }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                Nous appeler <ArrowRight size={15} aria-hidden />
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── AVIS — une citation d'exergue, deux colonnes filetées ────────── */}
      <section className="i345-pad" style={{ background: C.bg, padding: "clamp(76px, 9vw, 124px) 64px", position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden
          style={{ position: "absolute", top: "-8%", left: "-6%", width: 480, height: 480, borderRadius: "50%", background: `radial-gradient(circle, ${C.accent} 0%, transparent 68%)`, opacity: 0.08, pointerEvents: "none" }}
        />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <Kicker center>Les habitués des halles</Kicker>
          </Reveal>
          {AVIS.length > 0 && (
            <Reveal delay={0.08}>
              <figure style={{ margin: "clamp(28px, 4vw, 46px) auto clamp(34px, 5vw, 56px)", maxWidth: 820, textAlign: "center" }}>
                <blockquote style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: "clamp(20px, 2.6vw, 32px)", lineHeight: 1.5, color: C.ink, margin: "0 0 22px" }}>
                  «&nbsp;{AVIS[0].texte}&nbsp;»
                </blockquote>
                <figcaption style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
                  <span aria-hidden style={{ width: 40, height: 1, background: C.accent }} />
                  <span style={{ fontFamily: BODY, fontSize: 13.5, fontWeight: 700, color: C.ink }}>{AVIS[0].auteur}</span>
                  <span style={{ fontFamily: BODY, fontSize: 11.5, letterSpacing: "0.16em", textTransform: "uppercase", color: C.textFaint }}>{AVIS[0].detail}</span>
                </figcaption>
              </figure>
            </Reveal>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: 0, borderTop: `1px solid ${C.borderSoft}` }}>
            {AVIS.slice(1).map((a: any, idx: number) => (
              <Reveal key={a.auteur} delay={idx * 0.1}>
                <figure style={{ margin: 0, padding: "clamp(26px, 3vw, 38px) clamp(18px, 2.4vw, 32px)", borderLeft: idx > 0 ? `1px solid ${C.borderSoft}` : "none" }}>
                  <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={12} fill={C.accent} color={C.accent} aria-hidden />
                    ))}
                  </div>
                  <blockquote style={{ fontFamily: BODY, fontStyle: "italic", fontWeight: 300, fontSize: 14.5, lineHeight: 1.78, color: C.textMuted, margin: "0 0 18px" }}>
                    «&nbsp;{a.texte}&nbsp;»
                  </blockquote>
                  <figcaption>
                    <div style={{ fontFamily: DISPLAY, fontSize: 14.5, color: C.ink }}>{a.auteur}</div>
                    <div style={{ fontFamily: BODY, fontSize: 11.5, letterSpacing: "0.06em", color: C.textFaint, marginTop: 5 }}>{a.detail}</div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT — la commande de la veille ───────────────────────────── */}
      <section id="contact" className="i345-pad" style={{ background: C.bgDark, padding: "clamp(76px, 9.5vw, 124px) 64px", position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden
          style={{ position: "absolute", right: "-3%", bottom: "-16%", fontFamily: DISPLAY, fontSize: "clamp(110px, 19vw, 280px)", lineHeight: 0.8, color: C.ink, opacity: 0.035, pointerEvents: "none", userSelect: "none" }}
        >
          7h30
        </div>
        <div className="i345-split" style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,0.9fr)", gap: "clamp(34px, 5vw, 68px)", alignItems: "center", position: "relative" }}>
          <Reveal>
            <div>
              <Kicker>Halles centrales</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(28px, 4vw, 50px)", lineHeight: 1.06, color: C.ink, margin: "16px 0 18px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                  <>
                    Passez tôt, <em style={{ fontStyle: "italic", color: C.accent }}>ou commandez la veille.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 15.5, lineHeight: 1.75, color: C.textMuted, maxWidth: 450, margin: "0 0 26px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ?? (
                  <>Les plus belles pièces partent avant 10 h. Commande par téléphone, retrait au banc — on vous garde tout au frais.</>
                )}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 10 }}>
                {COMMANDE.map((r: any, idx: number) => (
                  <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontFamily: BODY, fontSize: 14, fontWeight: 300, color: C.textMuted, lineHeight: 1.6 }}>
                    <span aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, marginTop: 8, flexShrink: 0 }} />
                    {r}
                  </li>
                ))}
              </ul>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <motion.a
                  href={telHref}
                  style={{ background: C.accent, color: C.bgDark, padding: "16px 32px", fontFamily: BODY, fontSize: 15.5, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}
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
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "clamp(24px, 3vw, 36px)", boxShadow: "0 26px 60px rgba(0,0,0,0.45)" }}>
              {[
                { icon: MapPin, label: "Boutique & laboratoire", value: adresse },
                { icon: Phone, label: "Téléphone", value: phone, href: telHref },
                { icon: Mail, label: "E-mail", value: mail, href: `mailto:${mail}` },
                { icon: Clock, label: "Horaires", value: "Mar–Sam 7h30–13h / 15h30–19h30 · Dim 8h–12h30" },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} style={{ display: "flex", gap: 15, alignItems: "flex-start", padding: "14px 0", borderTop: idx > 0 ? `1px solid ${C.borderSoft}` : "none" }}>
                    <div style={{ width: 38, height: 38, background: C.accentLight, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, flexShrink: 0 }}>
                      <Icon size={16} aria-hidden />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: BODY, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.textFaint }}>{item.label}</div>
                      {item.href ? (
                        <a href={item.href} style={{ fontFamily: DISPLAY, fontSize: 15.5, color: C.ink, textDecoration: "none" }}>{item.value}</a>
                      ) : (
                        <div style={{ fontFamily: DISPLAY, fontSize: 15.5, color: C.ink, lineHeight: 1.45 }}>{item.value}</div>
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
      <footer className="i345-pad" style={{ background: C.bgDarkAlt, color: C.textFaint, padding: "clamp(46px, 6vw, 68px) 64px 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 34 }}>
            <div style={{ maxWidth: 330 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
                <Beef size={16} color={C.accent} aria-hidden />
                <span style={{ fontFamily: DISPLAY, fontSize: 18, color: C.ink }}>{nom}</span>
              </div>
              <p style={{ fontFamily: BODY, fontSize: 13, fontWeight: 300, lineHeight: 1.75, color: C.textFaint, margin: 0 }}>
                Boucherie-charcuterie artisanale · {clientCodePostalVille(sessionData, "21000", "Dijon")}
                <br />
                Viandes françaises, traçabilité affichée à l'étal
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <span style={{ fontFamily: BODY, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textMuted, fontWeight: 700 }}>Navigation</span>
              {NAV.map(({ l, h }) => (
                <a key={l} href={h} style={{ fontFamily: BODY, fontSize: 13, color: C.textFaint, textDecoration: "none", padding: "2px 0" }}>
                  {l}
                </a>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <span style={{ fontFamily: BODY, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textMuted, fontWeight: 700 }}>Nous trouver</span>
              <span style={{ fontFamily: BODY, fontSize: 13, color: C.textFaint, display: "flex", gap: 9, alignItems: "center" }}>
                <MapPin size={13} aria-hidden /> {adresse}
              </span>
              <a href={telHref} style={{ fontFamily: DISPLAY, fontSize: 16, color: C.accentDark, textDecoration: "none" }}>{phone}</a>
              <span style={{ fontFamily: BODY, fontSize: 13, color: C.textFaint, display: "flex", gap: 9, alignItems: "center", lineHeight: 1.5 }}>
                <Clock size={13} aria-hidden /> Mar–Sam 7h30–13h / 15h30–19h30 · Dim 8h–12h30
              </span>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontFamily: BODY, fontSize: 12, color: C.textFaint }}>
              © {new Date().getFullYear()} {nom} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
              {/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ fontFamily: BODY, fontSize: 12, color: C.textFaint }}>
              Mentions légales : éditeur {nom} · hébergement Vercel Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
