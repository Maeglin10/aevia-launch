"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Star, CheckCircle, ArrowRight, Cross, Syringe, Pill, HeartPulse, Baby, Stethoscope, ShieldCheck } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, useSlides, SlideIndex, HairlineArrows } from "@/lib/templates/hero-kit-2";
import { MosaicPush } from "@/lib/templates/hero-kit-3";
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
   PHARMACIE DU PARC — pharmacie · Lille. Archétype H1 : split, média à droite.
   Paire P5 : DM Serif Display (titres, l'autorité douce d'une officine) contre
   DM Sans (prose). Clair #f7faf8, accent #1a7a52.

   Signature : MosaicPush — la grille qui pousse, c'est le rayonnage de
   l'officine : chaque univers arrive rayon par rayon. Hero sans photographie
   (aucune image d'officine vérifiée dans le repo) : tuiles CSS — pictogramme,
   teinte, libellé — comme une signalétique.

   Dessin des sections : le parcours ordonnance en TIMELINE verticale (pas en
   liste), et la croix de pharmacie en texture CSS discrète — jamais en logo.
   ════════════════════════════════════════════════════════════════════════════ */

let C: Record<string, string> = {
  bg: "#f7faf8",
  bgAlt: "#eef4f0",
  bgDark: "var(--brand,#123528)",
  bgDarkAlt: "#0d281e",
  bgCard: "#ffffff",
  accent: "var(--brand,#1a7a52)",
  accentDark: "var(--brand-light,#125c3d)",
  accentLight: "#dcefe5",
  ink: "#14231c",
  textMuted: "#5b6b62",
  textFaint: "#8aa093",
  border: "#dce6df",
  white: "#ffffff",
  mint: "#7fc7a4", // clé métier — le vert clair de la croix qui clignote
  shadow: "0 2px 14px rgba(20,35,28,0.07)",
  shadowLg: "0 18px 52px rgba(26,122,82,0.18)",
};

const SERIF = "'DM Serif Display', Georgia, serif";
const SANS = "'DM Sans', system-ui, -apple-system, sans-serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const NAV = [
  { l: "Services", h: "#services" },
  { l: "Ordonnances", h: "#ordonnances" },
  { l: "Infos pratiques", h: "#infos" },
  { l: "Contact", h: "#contact" },
];

/* Trois univers du rayonnage, chacun en trois tuiles CSS. */
const HERO_UNIVERS = [
  {
    k: "Ordonnances",
    line: "Votre ordonnance préparée avant votre arrivée.",
    tiles: [
      { icon: Pill, t: "Renouvellement", d: "Traitements chroniques suivis, rappels quand il est temps.", bg: "#e3f2ea", fg: "#125c3d" },
      { icon: ShieldCheck, t: "Tiers payant", d: "Aucune avance de frais avec carte Vitale et mutuelle.", bg: "var(--brand,#123528)", fg: "#dcefe5" },
      { icon: Stethoscope, t: "Conseil du pharmacien", d: "Interactions vérifiées à chaque délivrance.", bg: "#f2ecdc", fg: "#5c4a1e" },
    ],
  },
  {
    k: "Prévention",
    line: "Vaccins et dépistage, sans rendez-vous médical.",
    tiles: [
      { icon: Syringe, t: "Vaccination", d: "Grippe, COVID, rappels — pharmaciens formés, sur place.", bg: "var(--brand,#123528)", fg: "#dcefe5" },
      { icon: HeartPulse, t: "Tests TROD", d: "Angine, glycémie, tension : résultat en quelques minutes.", bg: "#e3f2ea", fg: "#125c3d" },
      { icon: CheckCircle, t: "Entretiens", d: "Asthme, anticoagulants : suivis personnalisés remboursés.", bg: "#e8e9f4", fg: "#2e3470" },
    ],
  },
  {
    k: "Parapharmacie",
    line: "Le dermo-conseil, pas seulement le rayon.",
    tiles: [
      { icon: Baby, t: "Bébé & maman", d: "Lait, soins, tire-lait en location sur ordonnance.", bg: "#f2ecdc", fg: "#5c4a1e" },
      { icon: Cross, t: "Matériel médical", d: "Béquilles, lits, tensiomètres — vente et location LPP.", bg: "#e3f2ea", fg: "#125c3d" },
      { icon: Star, t: "Dermo-cosmétique", d: "Peaux sensibles et traitements : conseils de diplômés.", bg: "var(--brand,#123528)", fg: "#dcefe5" },
    ],
  },
];

const SERVICES_SOURCE = [
  { titre: "Ordonnances & renouvellement", desc: "Envoyez la photo de votre ordonnance : elle vous attend, préparée et vérifiée. Renouvellement des traitements chroniques dans le cadre légal.", tag: "Click & collect", icon: Pill },
  { titre: "Vaccination à l'officine", desc: "Grippe, COVID-19 et rappels du calendrier vaccinal, par nos pharmaciens formés. Sans rendez-vous, traçé dans votre carnet.", tag: "Prévention", icon: Syringe },
  { titre: "Tests rapides (TROD)", desc: "Angine, glycémie, tension artérielle. Résultat en quelques minutes, orientation vers le médecin quand c'est nécessaire.", tag: "Dépistage", icon: HeartPulse },
  { titre: "Entretiens pharmaceutiques", desc: "Asthme, anticoagulants (AVK), chimiothérapie orale : des entretiens de suivi pris en charge par l'Assurance Maladie.", tag: "Suivi", icon: Stethoscope },
  { titre: "Matériel médical & location", desc: "Cannes, béquilles, lits médicalisés, tire-lait. Vente et location au tarif LPP, tiers payant sur ordonnance.", tag: "Location", icon: Cross },
  { titre: "Parapharmacie & dermo-conseil", desc: "Dermo-cosmétique, nutrition, aromathérapie : des conseils de pharmaciens diplômés, pas un simple libre-service.", tag: "Conseil", icon: Star },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const ENGAGEMENT_DEMO = [
  "Pharmacie inscrite à l'Ordre national des pharmaciens — licence n° 59#004512",
  "Pharmaciens diplômés d'État présents à chaque ouverture",
  "Tiers payant carte Vitale + mutuelle : aucune avance de frais",
  "Pharmacie de garde : composez le 3237 (0,35 €/min) en dehors de nos horaires",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

const INFOS = [
  { t: "Horaires étendus", d: "Lun–Sam 8h30–19h30, sans interruption. Le samedi jusqu'à 19h." },
  { t: "Ordonnance en avance", d: "Photo par mail ou en boutique : préparée sous 2 h, conservée 7 jours." },
  { t: "Stationnement", d: "Parking du Parc gratuit 30 min, dépose-minute devant l'officine." },
  { t: "Garde & urgences", d: "En dehors des horaires : 3237 pour la pharmacie de garde, 15 pour le SAMU." },
];

const AVIS_SOURCE = [
  { texte: "J'envoie l'ordonnance de ma mère par mail le matin, tout est prêt à midi, tiers payant compris. Pour un traitement de 12 lignes, ça change la vie.", auteur: "Sandrine P.", detail: "Renouvellement chronique" },
  { texte: "Vaccinée contre la grippe un samedi en cinq minutes, sans rendez-vous. La pharmacienne a vérifié mes rappels au passage — le tétanos datait de 12 ans.", auteur: "Marie-Claude B.", detail: "Vaccination" },
  { texte: "Location d'un lit médicalisé pour mon père en 24 h, livré et installé. On nous a expliqué la prise en charge, on n'a rien avancé.", auteur: "Éric D.", detail: "Matériel médical" },
];
let AVIS_DEMO = AVIS_SOURCE;

/* Le parcours ordonnance : quatre temps, dessinés en timeline. */
const PARCOURS_DEMO = [
  "Photographiez votre ordonnance recto complète",
  "Envoyez-la par mail avec votre nom et une heure de passage",
  "Elle est préparée et vérifiée sous 2 h, conservée 7 jours",
  "Passage en caisse en moins de 5 minutes, tiers payant appliqué",
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 26 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

/*
  Sur-titre au point : une pastille pleine de six pixels, puis le libellé.
  Rien d'autre. Une officine n'a pas besoin d'un trait pour se présenter.
*/
function Kicker({ children, center = false, color }: { children: React.ReactNode; center?: boolean; color?: string }) {
  const col = color ?? C.accent;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: center ? "center" : "flex-start" }}>
      <span aria-hidden style={{ width: 6, height: 6, borderRadius: 999, background: col, flexShrink: 0 }} />
      <span style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: col }}>{children}</span>
    </div>
  );
}

/** Lien de nav : soulignement qui pousse en largeur. */
function NavLink({ l, h }: { l: string; h: string }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={h}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ position: "relative", color: hov ? C.ink : C.textMuted, fontSize: 14, fontWeight: 500, textDecoration: "none", padding: "12px 4px", transition: "color 0.45s cubic-bezier(.16,1,.3,1)" }}
    >
      {l}
      <span aria-hidden style={{ position: "absolute", left: 4, bottom: 8, height: 1, width: hov ? "calc(100% - 8px)" : "0%", background: C.accent, transition: "width 0.45s cubic-bezier(.16,1,.3,1)" }} />
    </a>
  );
}

/** Bouton plein : élévation, double ombre, flèche qui avance. */
function CtaBtn({ href, children, big = false }: { href: string; children: React.ReactNode; big?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.accentDark : C.accent,
        color: "#fff",
        borderRadius: 10,
        padding: big ? "clamp(14px, 1.6vw, 17px) clamp(26px, 3vw, 36px)" : "13px 26px",
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: big ? "clamp(14px, 1.3vw, 16px)" : 14.5,
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 9,
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov
          ? "0 20px 44px -16px rgba(26,122,82,0.45), 0 4px 12px -4px rgba(20,35,28,0.2)"
          : "0 10px 28px -16px rgba(26,122,82,0.35), 0 2px 6px -3px rgba(20,35,28,0.12)",
        transition: "all 0.5s cubic-bezier(.16,1,.3,1)",
      }}
    >
      {children}
      <ArrowRight size={16} style={{ transform: hov ? "translateX(5px)" : "none", transition: "transform 0.5s cubic-bezier(.16,1,.3,1)" }} />
    </a>
  );
}

/** Carte service : pictogramme dans pastille, survol 3+ propriétés. */
function ServiceCard({ s, idx }: { s: any; idx: number }) {
  const [hov, setHov] = useState(false);
  const Icon = s.icon ?? Pill;
  return (
    <Reveal delay={idx * 0.06}>
      <article
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: C.white,
          borderRadius: 14,
          padding: "clamp(24px, 2.4vw, 32px) clamp(20px, 2.2vw, 28px)",
          border: `1px solid ${hov ? "rgba(26,122,82,0.45)" : C.border}`,
          borderTop: `2px solid ${hov ? C.accent : "rgba(26,122,82,0.18)"}`,
          height: "100%",
          transform: hov ? "translateY(-6px)" : "none",
          boxShadow: hov
            ? "0 26px 54px -26px rgba(26,122,82,0.3), 0 8px 22px -16px rgba(20,35,28,0.18)"
            : C.shadow,
          transition: "all 0.5s cubic-bezier(.16,1,.3,1)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span aria-hidden style={{ position: "absolute", top: -10, right: 2, fontFamily: SERIF, fontSize: 82, lineHeight: 1, color: C.accent, opacity: hov ? 0.09 : 0.05, pointerEvents: "none", userSelect: "none", transition: "opacity 0.5s cubic-bezier(.16,1,.3,1)" }}>
          {String(idx + 1).padStart(2, "0")}
        </span>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span aria-hidden style={{ width: 42, height: 42, borderRadius: 12, background: hov ? C.accent : C.accentLight, color: hov ? "#fff" : C.accentDark, display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "all 0.5s cubic-bezier(.16,1,.3,1)" }}>
            <Icon size={19} />
          </span>
          <span style={{ background: C.accentLight, color: C.accentDark, borderRadius: 999, padding: "4px 12px", fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.tag}</span>
        </div>
        <h3 style={{ fontFamily: SERIF, fontSize: "clamp(18px, 1.6vw, 21px)", fontWeight: 400, margin: "0 0 10px", color: C.ink, lineHeight: 1.15 }}>{s.titre}</h3>
        <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.72, margin: 0 }}>{s.desc}</p>
      </article>
    </Reveal>
  );
}

/** Carte avis (section sombre) : survol discret, guillemet fantôme. */
function AvisCard({ a }: { a: any }) {
  const [hov, setHov] = useState(false);
  return (
    <figure
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)",
        border: `1px solid ${hov ? "rgba(127,199,164,0.45)" : "rgba(255,255,255,0.10)"}`,
        borderRadius: 14,
        padding: "clamp(24px, 2.6vw, 32px) clamp(20px, 2.2vw, 28px)",
        height: "100%",
        margin: 0,
        position: "relative",
        overflow: "hidden",
        transform: hov ? "translateY(-5px)" : "none",
        boxShadow: hov ? "0 24px 48px -28px rgba(0,0,0,0.5), 0 6px 18px -12px rgba(127,199,164,0.25)" : "none",
        transition: "all 0.5s cubic-bezier(.16,1,.3,1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <span aria-hidden style={{ position: "absolute", top: -30, left: 8, fontFamily: SERIF, fontSize: 130, lineHeight: 1, color: C.mint, opacity: 0.08, pointerEvents: "none", userSelect: "none" }}>&ldquo;</span>
      <div style={{ display: "flex", gap: 3, marginBottom: 14, position: "relative" }}>
        {[...Array(5)].map((_, j) => <Star key={j} size={13} fill={C.mint} color={C.mint} />)}
      </div>
      <blockquote style={{ fontSize: 14.5, color: "rgba(255,255,255,0.87)", lineHeight: 1.72, margin: "0 0 18px", flexGrow: 1, position: "relative" }}>&ldquo;{a.texte}&rdquo;</blockquote>
      <figcaption style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 14 }}>
        <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{a.auteur}</div>
        <div style={{ color: C.mint, fontSize: 12, marginTop: 4, letterSpacing: "0.04em" }}>{a.detail}</div>
      </figcaption>
    </figure>
  );
}

/** Carte info pratique : survol 3+ propriétés, chiffre fantôme. */
function InfoCard({ m, idx }: { m: any; idx: number }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.white,
        border: `1px solid ${hov ? "rgba(26,122,82,0.4)" : C.border}`,
        borderRadius: 14,
        padding: "clamp(22px, 2.4vw, 30px) clamp(20px, 2.2vw, 26px)",
        height: "100%",
        boxShadow: hov
          ? "0 22px 46px -24px rgba(26,122,82,0.28), 0 6px 18px -14px rgba(20,35,28,0.16)"
          : C.shadow,
        transform: hov ? "translateY(-5px)" : "none",
        transition: "all 0.5s cubic-bezier(.16,1,.3,1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span aria-hidden style={{ position: "absolute", right: -8, top: -18, fontFamily: SERIF, fontSize: 74, lineHeight: 1, color: C.accent, opacity: hov ? 0.09 : 0.05, pointerEvents: "none", userSelect: "none", transition: "opacity 0.5s cubic-bezier(.16,1,.3,1)" }}>{String(idx + 1).padStart(2, "0")}</span>
      <Clock size={20} color={hov ? C.accentDark : C.accent} style={{ marginBottom: 14, transition: "color 0.5s cubic-bezier(.16,1,.3,1)" }} />
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 9, fontFamily: SANS }}>{m.t}</h3>
      <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>{m.d}</p>
    </div>
  );
}

/** Croix de pharmacie fantôme : deux barres CSS, aucune image. */
function GhostCross({ size, color, opacity, style }: { size: number | string; color: string; opacity: number; style?: React.CSSProperties }) {
  return (
    <span aria-hidden style={{ position: "absolute", width: size, height: size, opacity, pointerEvents: "none", userSelect: "none", ...style }}>
      <span style={{ position: "absolute", left: "36%", top: 0, width: "28%", height: "100%", background: color, borderRadius: 6 }} />
      <span style={{ position: "absolute", top: "36%", left: 0, height: "28%", width: "100%", background: color, borderRadius: 6 }} />
    </span>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════════════════ */

export default function PharmacieDuParcPage() {
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
  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({ ...SERVICES_SOURCE[i % SERVICES_SOURCE.length], titre: s.title })),
    SERVICES_SOURCE,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({ ...AVIS_SOURCE[i % AVIS_SOURCE.length], auteur: r.author, texte: r.text })),
    AVIS_SOURCE,
  );
  ENGAGEMENT = resolveList(clientCertifications(sessionData), ENGAGEMENT_DEMO);
  brand = fd?.brandColor ?? null;
  if (brand) {
    C = { ...C, accent: brand };
  }

  const SERVICES = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      titre: s.title ?? SERVICES_DEMO[i % SERVICES_DEMO.length].titre,
      desc: s.description ?? SERVICES_DEMO[i % SERVICES_DEMO.length].desc,
      tag: SERVICES_DEMO[i % SERVICES_DEMO.length].tag,
      icon: SERVICES_DEMO[i % SERVICES_DEMO.length].icon,
    })),
    SERVICES_DEMO
  );
  const AVIS = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      texte: r.text ?? AVIS_DEMO[i % AVIS_DEMO.length].texte,
      auteur: r.name ?? AVIS_DEMO[i % AVIS_DEMO.length].auteur,
      detail: r.location ?? AVIS_DEMO[i % AVIS_DEMO.length].detail,
    })),
    AVIS_DEMO
  );
  const PARCOURS = clientList(sessionData, "ordonnances.liste1") ?? PARCOURS_DEMO;

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { i, next, prev } = useSlides(HERO_UNIVERS.length, DWELL.normal);
  const univers = HERO_UNIVERS[i];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = clientPhone(sessionData) ?? fd?.phone ?? "03 20 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33320000000").replace(/[\s.]/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "ordonnances@pharmacieduparc-lille.fr";

  /* Photo optionnelle de l'officine : jamais de stock à la place — sans
     photo, l'aplat menthe + croix fantôme tient la place, et il est beau. */
  const photoOfficine = fd?.photoUrls?.[0] || clientPhotos(sessionData)[0] || "";
  /* La vitrine du héros : la photo du client, sinon une officine de repli. */
  const photoVitrine =
    photoOfficine ||
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1800&q=80&auto=format&fit=crop";

  /* Le rayonnage : trois tuiles empilées, poussées de gauche à droite
     à chaque changement d'univers. */
  const tiles = univers.tiles.map(({ icon: Icon, t, d, bg, fg }, n) => ({
    area: { gridColumn: "1", gridRow: `${n + 1}` },
    node: (
      <div style={{ background: bg, color: fg, borderRadius: 14, padding: "clamp(18px, 1.9vw, 24px) clamp(18px, 2vw, 24px)", height: "100%", display: "flex", gap: 16, alignItems: "flex-start", position: "relative", overflow: "hidden" }}>
        <span aria-hidden style={{ position: "absolute", right: -6, bottom: -18, fontFamily: SERIF, fontSize: 64, lineHeight: 1, color: fg, opacity: 0.08, pointerEvents: "none", userSelect: "none" }}>{String(n + 1).padStart(2, "0")}</span>
        <Icon size={22} style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ minWidth: 0, position: "relative" }}>
          <div style={{ fontWeight: 700, fontSize: 15.5, marginBottom: 5, fontFamily: SANS }}>{t}</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.6, opacity: 0.85 }}>{d}</div>
        </div>
      </div>
    ),
  }));

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&display=swap');
        html { scroll-behavior: smooth; }
        @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }

        /* La croix de pharmacie en semis discret — dessinée en SVG inline,
           aucune requête réseau, opacité ≤ 0.05. */
        .i330-croixmotif {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cpath d='M28 20h8v8h8v8h-8v8h-8v-8h-8v-8h8z' fill='%231a7a52' fill-opacity='0.05'/%3E%3C/svg%3E");
          background-size: 64px 64px;
        }
        .i330-croixmotif-sombre {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72'%3E%3Cpath d='M32 22h8v10h10v8H40v10h-8V40H22v-8h10z' fill='%23ffffff' fill-opacity='0.04'/%3E%3C/svg%3E");
          background-size: 72px 72px;
        }

        /* Le détail gratuit : le point « ouvert » respire comme la croix
           verte au coin de la rue. */
        @keyframes i330-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(26,122,82,0.35); }
          50% { box-shadow: 0 0 0 6px rgba(26,122,82,0); }
        }
        .i330-dot { animation: i330-pulse 2.4s ease-in-out infinite; }

        /* Le bandeau des services qui défilent — deux pistes identiques,
           translation de -50%, boucle invisible. */
        @keyframes i330-defile {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .i330-marquee-piste {
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          animation: i330-defile 34s linear infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .i330-dot { animation: none; }
          .i330-marquee-piste { animation: none; }
        }

        @media (max-width: 900px) {
          #i330-nav { display: none !important; }
          .i330-burger { display: flex !important; }
          .aevia-action-mobile { display: inline-flex !important; }
        }
        @media (max-width: 860px) {
          .i330-hero { grid-template-columns: 1fr !important; padding: 118px 24px 46px !important; gap: 34px !important; }
          .i330-split { grid-template-columns: 1fr !important; }
          .i330-split > * { order: initial !important; }
          .i330-infosgrid { grid-template-columns: 1fr !important; }
          .i330-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i330-timelinesticky { position: static !important; }
        }
      `}</style>

      {/* ── NAV — collante, 4 propriétés animées ─────────────────────────── */}
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
          height: scrolled ? 64 : 76,
          padding: scrolled ? "0 clamp(20px, 4vw, 48px)" : "0 clamp(24px, 4.5vw, 56px)",
          background: scrolled ? "rgba(247,250,248,0.97)" : "rgba(247,250,248,0.6)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          boxShadow: scrolled ? "0 8px 30px -18px rgba(20,35,28,0.18)" : "none",
          transition: "height 0.55s cubic-bezier(.16,1,.3,1), padding 0.55s cubic-bezier(.16,1,.3,1), border-color 0.55s cubic-bezier(.16,1,.3,1), box-shadow 0.55s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 170, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <span aria-hidden style={{ width: 30, height: 30, borderRadius: 8, background: C.accent, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Cross size={16} />
              </span>
              <span style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 19, letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fd?.businessName ?? (clientName(sessionData) ?? "Pharmacie du Parc")}</span>
            </>
          )}
        </div>
        <div id="i330-nav" style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <NavLink key={l} l={l} h={h} />
          ))}
          <CtaBtn href={`mailto:${mail}`}>Envoyer mon ordonnance</CtaBtn>
        </div>
        {/* L'appel à l'action sous le pouce : la barre est fixe, mais son
            bouton vit dans le menu déroulant, en display:none sous le point
            de rupture. Celui-ci paraît exactement avec le bouton de menu. */}
        <ActionMobile href={telHref} fond={C.accent} encre={"#fff"}>
          Appeler
        </ActionMobile>
        <button className="i330-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 99, background: "rgba(247,250,248,0.99)", borderBottom: `1px solid ${C.border}`, padding: "20px 28px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ color: C.ink, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "12px 0" }}>{l}</a>
          ))}
          <a href={`mailto:${mail}`} style={{ background: C.accent, color: "#fff", borderRadius: 10, padding: "13px 24px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 8 }}>Envoyer mon ordonnance</a>
        </div>
      )}

      {/* ── HERO — devanture : colonne unique centrée, rayonnage en bandeau ── */}
      <section className="i330-hero i330-croixmotif" style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative", padding: "clamp(96px, 12vh, 150px) clamp(20px, 6vw, 80px) clamp(40px, 6vh, 70px)", textAlign: "center", overflow: "hidden" }}>
        <GhostCross size="clamp(320px, 40vw, 620px)" color={C.accent} opacity={0.045} style={{ left: "50%", top: "44%", transform: "translate(-50%, -50%)" }} />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ marginBottom: 22, position: "relative" }}>
          <Kicker center>{clientEyebrow(sessionData) ?? `Pharmacie d'officine · ${clientCity(sessionData) ?? "Lille"}`}</Kicker>
        </motion.div>

        {/* Le titre tient la page : une seule ligne, sans seconde ligne penchée. */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.8, ease: EASE }}
          style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(44px, 8.4vw, 116px)", lineHeight: 0.98, letterSpacing: "-0.03em", color: C.ink, maxWidth: 1180, position: "relative", margin: 0 }}
        >
          {c?.heroHeadline ?? clientHeroLine(sessionData, 0, 1, 30) ?? "Votre pharmacie de quartier"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.7, ease: EASE }}
          style={{ fontFamily: SANS, fontSize: "clamp(15px, 1.5vw, 19px)", lineHeight: 1.65, color: C.textMuted, maxWidth: 620, marginTop: "clamp(22px, 3vh, 32px)", position: "relative" }}
        >
          {clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? "Ordonnances préparées à l'avance, vaccination sans rendez-vous, tests rapides et conseil qui prend le temps."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.58, duration: 0.7, ease: EASE }}
          style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: "clamp(26px, 4vh, 40px)", position: "relative" }}
        >
          <CtaBtn href={`mailto:${mail}`} big>Envoyer mon ordonnance</CtaBtn>
          <motion.a href={telHref} style={{ background: "transparent", color: C.ink, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 26px", fontFamily: SANS, fontSize: 15, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <Phone size={16} /> {phone}
          </motion.a>
        </motion.div>

        {/* La vitrine : un bandeau large sous le titre, jamais une colonne
            latérale — c'est la colonne latérale qui rendait tous ces thèmes
            semblables. */}
        <motion.div
          initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72, duration: 0.9, ease: EASE }}
          style={{ position: "relative", width: "min(100%, 1180px)", marginTop: "clamp(30px, 4.6vh, 52px)", borderRadius: 18, overflow: "hidden", border: `1px solid ${C.border}`, boxShadow: "0 26px 60px -32px rgba(16,40,28,0.35)" }}
        >
          <img
            src={photoVitrine}
            alt={`${fd?.businessName ?? clientName(sessionData) ?? "Pharmacie du Parc"} — l'officine`}
            style={{ display: "block", width: "100%", aspectRatio: "21/7", objectFit: "cover" }}
          />
          <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${C.white}22, transparent 55%)` }} />
        </motion.div>

        {/* L'information de service en bandeau, à la place de l'index de carrousel. */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.76, duration: 0.7 }}
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "clamp(14px, 3vw, 36px)", marginTop: "clamp(34px, 5vh, 54px)", paddingTop: "clamp(20px, 3vh, 30px)", borderTop: `1px solid ${C.border}`, width: "min(100%, 900px)", position: "relative" }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: SANS, fontSize: 13.5, color: C.textMuted }}>
            <span aria-hidden style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent }} />
            Ouvert Lun–Sam 8h30–19h30, sans interruption
          </span>
          {HERO_UNIVERS.map((u) => (
            <span key={u.k} style={{ fontFamily: SANS, fontSize: 13.5, color: C.textMuted }}>
              <strong style={{ color: C.ink, fontWeight: 700 }}>{u.k}</strong>
            </span>
          ))}
        </motion.div>
      </section>

      {/* Le rayonnage, en bande pleine largeur sous la devanture. */}
      <section style={{ padding: "clamp(28px, 5vh, 56px) clamp(20px, 6vw, 80px)", background: C.white, borderTop: `1px solid ${C.border}` }}>
        <MosaicPush
          index={i}
          tiles={tiles}
          stagger={0.07}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 14, maxWidth: 1280, margin: "0 auto" }}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, marginTop: 22 }}>
          <span style={{ fontFamily: SANS, fontSize: 13.5, color: C.textMuted, maxWidth: 420, textAlign: "center" }}>
            <strong style={{ color: C.ink, fontWeight: 700 }}>{univers.k}</strong> — {univers.line}
          </span>
          <HairlineArrows onPrev={prev} onNext={next} color={C.ink} className="" />
        </div>
      </section>

      {/* ── RESPIRATION — une phrase, rien d'autre ───────────────────────── */}
      <section className="i330-pad" style={{ padding: "clamp(60px, 8.5vw, 110px) clamp(32px, 6vw, 96px)", background: C.bgAlt, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <span aria-hidden style={{ position: "absolute", left: "50%", top: "-45%", transform: "translateX(-50%)", width: "60%", height: "130%", background: "radial-gradient(ellipse, rgba(26,122,82,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <Reveal>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(21px, 2.8vw, 34px)", lineHeight: 1.42, color: C.ink, maxWidth: 800, margin: "0 auto", position: "relative" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.texte") ?? (<>
              Une officine, ce n&apos;est pas un commerce de boîtes&nbsp;: c&apos;est le dernier
              endroit où l&apos;on vous écoute <em style={{ color: C.accent }}>sans rendez-vous</em>.
            </>)}
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <span aria-hidden style={{ display: "block", width: 1, height: "clamp(38px, 5.5vw, 64px)", background: `linear-gradient(180deg, ${C.accent}, transparent)`, margin: "clamp(26px, 4vw, 42px) auto 0" }} />
        </Reveal>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section id="services" className="i330-pad" style={{ padding: "clamp(72px, 10vw, 128px) clamp(32px, 6vw, 96px)", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(36px, 5vw, 56px)" }}>
              <Kicker>Nos services</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4vw, 50px)", fontWeight: 400, letterSpacing: "-0.015em", marginTop: 16, lineHeight: 1.06 }}>{/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>
                Une officine qui soigne,<br /><em style={{ color: C.accent, fontStyle: "italic" }}>pas seulement qui délivre.</em>
              </>)}</h2>
              <p style={{ fontSize: "clamp(14px, 1.25vw, 15.5px)", color: C.textMuted, maxWidth: 500, margin: "16px 0 0", lineHeight: 1.75 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "services.texte") ?? "Six missions de santé assurées derrière le même comptoir, dans le cadre fixé par l'Ordre national des pharmaciens et l'Assurance Maladie."}
              </p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: "clamp(14px, 1.6vw, 20px)" }}>
            {SERVICES.map((s, idx) => (
              <ServiceCard key={s.titre} s={s} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ORDONNANCES — le parcours en timeline ────────────────────────── */}
      <section id="ordonnances" className="i330-pad" style={{ padding: "clamp(72px, 10vw, 128px) clamp(32px, 6vw, 96px)", background: C.bgAlt }}>
        <div className="i330-split" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1.05fr) minmax(0,0.95fr)", gap: "clamp(36px, 5.5vw, 72px)", alignItems: "start" }}>
          <Reveal>
            <div className="i330-croixmotif-sombre" style={{ background: C.bgDark, borderRadius: 18, padding: "clamp(28px, 3.4vw, 42px) clamp(24px, 3vw, 38px)", color: "#eaf4ee", position: "relative", overflow: "hidden" }}>
              <GhostCross size={150} color={C.mint} opacity={0.07} style={{ right: -34, bottom: -34 }} />
              <Kicker color={C.mint}>Ordonnance en avance</Kicker>
              <h3 style={{ fontFamily: SERIF, fontSize: "clamp(23px, 2.4vw, 30px)", fontWeight: 400, margin: "16px 0 8px", lineHeight: 1.15, color: "#fff" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "ordonnances.texte") ?? "Quatre gestes, zéro attente."}
              </h3>
              <p style={{ fontSize: 13.5, color: "rgba(234,244,238,0.65)", lineHeight: 1.7, margin: "0 0 26px", maxWidth: 420 }}>
                Le parcours tel qu&apos;il se passe vraiment, du téléphone dans votre cuisine au comptoir de l&apos;officine.
              </p>
              {/* La timeline : un fil vertical, un temps par point. */}
              <div style={{ position: "relative", paddingLeft: 6 }}>
                <span aria-hidden style={{ position: "absolute", left: 18, top: 10, bottom: 26, width: 1, background: `linear-gradient(180deg, ${C.mint}, rgba(127,199,164,0.15))` }} />
                {PARCOURS.map((step, n) => (
                  <div key={n} style={{ display: "flex", gap: 16, marginBottom: n === PARCOURS.length - 1 ? 0 : 22, alignItems: "flex-start", position: "relative" }}>
                    <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: "50%", background: "rgba(127,199,164,0.16)", border: `1px solid ${C.mint}`, color: C.mint, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12.5, fontWeight: 700, position: "relative", zIndex: 1 }}>{n + 1}</span>
                    <div style={{ paddingTop: 3 }}>
                      <span style={{ fontSize: 14.5, lineHeight: 1.65, opacity: 0.92 }}>{step}</span>
                    </div>
                  </div>
                ))}
              </div>
              <a href={`mailto:${mail}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 28, background: C.mint, color: "#123528", borderRadius: 10, padding: "13px 26px", fontWeight: 700, fontSize: 14, textDecoration: "none", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                <Mail size={15} style={{ flexShrink: 0 }} /> {mail}
              </a>
            </div>
          </Reveal>
          <div className="i330-timelinesticky" style={{ position: "sticky", top: 100 }}>
            <Reveal delay={0.12}>
              <Kicker>Une officine de l&apos;Ordre</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3.2vw, 42px)", fontWeight: 400, letterSpacing: "-0.01em", margin: "14px 0 26px", lineHeight: 1.1 }}>{/* TEXTE_SECTION */ clientText(sessionData, "ordonnances.titre") ?? (<>
                Ce que garantit<br /><em style={{ color: C.accent, fontStyle: "italic" }}>une vraie pharmacie.</em>
              </>)}</h2>
              {ENGAGEMENT.map((e, idx) => (
                <div key={idx} style={{ display: "flex", gap: 12, marginBottom: 15, alignItems: "flex-start" }}>
                  <CheckCircle size={17} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.68 }}>{e}</span>
                </div>
              ))}
              {/* La vitrine, quand le client en a une photo. Sinon rien à sa
                  place — jamais de photo de stock sous son enseigne. */}
              {photoOfficine ? (
                <div style={{ marginTop: 26, borderRadius: 14, overflow: "hidden", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
                  <img src={photoOfficine} alt={`${fd?.businessName ?? clientName(sessionData) ?? "Pharmacie du Parc"} — l'officine`} loading="lazy" style={{ width: "100%", height: "auto", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
                </div>
              ) : (
                <div aria-hidden style={{ marginTop: 26, borderRadius: 14, border: `1px solid ${C.border}`, background: `linear-gradient(145deg, ${C.accentLight} 0%, rgba(220,239,229,0.35) 100%)`, aspectRatio: "16/6", position: "relative", overflow: "hidden" }}>
                  <GhostCross size={92} color={C.accent} opacity={0.12} style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }} />
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── INFOS PRATIQUES ──────────────────────────────────────────────── */}
      <section id="infos" className="i330-pad" style={{ padding: "clamp(72px, 10vw, 128px) clamp(32px, 6vw, 96px)", background: C.bg }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(36px, 5vw, 56px)" }}>
              <Kicker>Infos pratiques</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4vw, 50px)", fontWeight: 400, letterSpacing: "-0.015em", marginTop: 16, lineHeight: 1.06 }}>{/* TEXTE_SECTION */ clientText(sessionData, "infos.titre") ?? (<>
                Venir, se garer,<br /><em style={{ color: C.accent, fontStyle: "italic" }}>être servi vite.</em>
              </>)}</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: "clamp(14px, 1.6vw, 20px)" }}>
            {INFOS.map((m, idx) => (
              <Reveal key={m.t} delay={idx * 0.08}>
                <InfoCard m={m} idx={idx} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVIS ─────────────────────────────────────────────────────────── */}
      <section className="i330-pad i330-croixmotif-sombre" style={{ padding: "clamp(72px, 10vw, 128px) clamp(32px, 6vw, 96px)", background: C.bgDark, position: "relative", overflow: "hidden" }}>
        <GhostCross size="clamp(160px, 18vw, 260px)" color={C.mint} opacity={0.04} style={{ left: "-4%", bottom: "-12%" }} />
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "clamp(34px, 4.8vw, 52px)", position: "relative" }}>
            <Kicker color={C.mint} center>Au comptoir</Kicker>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3.6vw, 46px)", fontWeight: 400, letterSpacing: "-0.01em", color: "#fff", marginTop: 16, lineHeight: 1.08 }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-5.titre") ?? (<>
              Le quartier en parle<em style={{ color: C.mint, fontStyle: "italic" }}>.</em>
            </>)}</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: "clamp(14px, 1.6vw, 20px)", maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          {AVIS.map((a, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <AvisCard a={a} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <section id="contact" className="i330-pad i330-croixmotif" style={{ padding: "clamp(76px, 11vw, 140px) clamp(32px, 6vw, 96px)", background: C.accentLight, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <span aria-hidden style={{ position: "absolute", left: "50%", top: "-35%", transform: "translateX(-50%)", width: "70%", height: "90%", background: "radial-gradient(ellipse, rgba(26,122,82,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />
        <Reveal>
          <Kicker center>À votre service</Kicker>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4.4vw, 54px)", fontWeight: 400, letterSpacing: "-0.015em", margin: "16px 0 16px", lineHeight: 1.06, position: "relative" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
            Une question santé ?<br /><em style={{ color: C.accent, fontStyle: "italic" }}>Un pharmacien répond.</em>
          </>)}</h2>
          <p style={{ fontSize: "clamp(14.5px, 1.3vw, 16px)", color: C.textMuted, maxWidth: 460, margin: "0 auto clamp(28px, 4vw, 38px)", lineHeight: 1.75, position: "relative" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ?? "Par téléphone aux horaires d'ouverture, ou passez simplement : le conseil ne prend pas de ticket."}
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
            <CtaBtn href={telHref} big><Phone size={17} /> {phone}</CtaBtn>
            <motion.a href={`mailto:${mail}`} style={{ background: "transparent", color: C.ink, border: `2px solid ${C.accent}`, borderRadius: 10, padding: "14px 32px", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ background: C.accent, color: "#fff" }}>
              <Mail size={18} /> Nous écrire
            </motion.a>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="i330-pad" style={{ background: C.bgDarkAlt, padding: "clamp(40px, 5vw, 56px) clamp(32px, 6vw, 96px) 22px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 30 }}>
            <div>
              <div style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 19, color: "#fff", marginBottom: 8 }}>{fd?.businessName ?? (clientName(sessionData) ?? "Pharmacie du Parc")}</div>
              <p style={{ color: "rgba(255,255,255,0.40)", fontSize: 13, lineHeight: 1.7 }}>
                {clientTrade(sessionData) ?? "Pharmacie d'officine"} · {clientCity(sessionData) ?? "Lille"}<br />
                Ordre national des pharmaciens — licence n° 59#004512
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { icon: <MapPin size={13} />, t: clientAddress(sessionData) ?? `Quartier du Parc, ${clientCodePostalVille(sessionData, "59000", "Lille")}` },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Mail size={13} />, t: mail },
                { icon: <Clock size={13} />, t: "Lun–Sam 8h30–19h30 · Garde : 3237" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.45)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.mint }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
              © 2026 {fd?.businessName ?? (clientName(sessionData) ?? "Pharmacie du Parc")} — Site réalisé par Aevia WS · SIREN {/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}<LegalIdentity fallback="852 546 225" kind="siren" />
            </span>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
