"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, Mail, MapPin, Clock, CheckCircle, ArrowRight, Flower2 } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, useSlides, SlideIndex, HeldSwap } from "@/lib/templates/hero-kit-2";
import {
  clientAddress,
  clientCertifications,
  clientCity,
  clientCodePostalVille,
  clientEmail,
  clientEyebrow,
  clientHeroLine,
  clientHeroSubtitle,
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
   MAISON ESTÈVE — pompes funèbres & prévoyance. Donneur : impact-95.
   Élévation famille II.0 : le geste (HeldSwap, DWELL.slow), la palette
   sauge/ivoire et l'ordre des sections sont conservés — on élève le dessin.

   Signature : HeldSwap avec DWELL.slow — le temps mort tenu (0,5 s de scène
   vide) est ce qui rend un hero cher, et ici il porte aussi le respect.
   Rythme le plus lent du kit, 5,6 s par temps. Aucune flèche pressante :
   l'index seul, discret.

   Signature visuelle : le silence typographique. Une seule famille à
   l'honneur (Cormorant Garamond), la voix système en sourdine, des blancs
   qui respirent longtemps, des filets dégradés qui s'éteignent — jamais un
   élément qui presse.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Fontes — P3 : Cormorant Garamond seule à voix haute, système en sourdine ── */
const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&display=swap');`;
const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS = "system-ui, -apple-system, 'Segoe UI', sans-serif";

/* ── Easing unique, répété littéralement dans le CSS ───────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_CSS = "cubic-bezier(.16,1,.3,1)";

/* ── Tokens ────────────────────────────────────────────────────────────────── */
let C: Record<string, string> = {
  bg: "#faf9f6",
  bgAlt: "#f1efe9",
  bgDark: "#23262b",
  bgDarkAlt: "#1b1e22",
  bgCard: "#ffffff",
  accent: "var(--brand,#5a6b5d)",
  accentDark: "var(--brand-light,#42503f)",
  accentLight: "#e9ede8",
  ink: "#26241f",
  textMuted: "#6f6a61",
  textFaint: "#a09a8d",
  border: "#e3e0d7",
  white: "#ffffff",
  /* clé métier : l'or éteint des lettres gravées */
  gold: "#a89468",
};

const NAV = [
  { l: "Accompagnement", h: "#accompagnement" },
  { l: "Prévoyance", h: "#prevoyance" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* Trois temps de l'accompagnement, tenus lentement dans le hero.
   Photos : URLs déjà présentes dans le repo (nature, fleurs). */
function HERO_TEMPS_DEMO_LIVE() {
  return [
    {
      k: "Obsèques",
      line: "Organiser des obsèques justes, à l'image de la personne.",
      img: (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"),
      alt: "Paysage calme au lever du jour",
    },
    {
      k: "Cérémonie",
      line: "Une cérémonie qui ressemble à celle ou celui qu'on entoure.",
      img: (clientPhotos(sessionData)[2] || "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&q=80"),
      alt: "Composition florale de cérémonie",
    },
    {
      k: "Prévoyance",
      line: "Décider pour soi, pour épargner ces choix à ses proches.",
      img: (clientPhotos(sessionData)[3] || "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1200&q=80"),
      alt: "Massif de fleurs en pleine lumière",
    },
  ];
}
let HERO_TEMPS_DEMO = HERO_TEMPS_DEMO_LIVE();
let HERO_TEMPS = HERO_TEMPS_DEMO;

const SERVICES_SOURCE = [
  { titre: "Organisation d'obsèques", desc: "Inhumation ou crémation. Un interlocuteur unique organise tout : cercueil, transport, cérémonie, mise en relation avec le cimetière ou le crématorium.", tag: "24h/24" },
  { titre: "Démarches administratives", desc: "Déclaration de décès, état civil, caisses de retraite, banques, notaire : nous préparons et suivons jusqu'à vingt courriers et dossiers pour vous.", tag: "Inclus" },
  { titre: "Chambre funéraire", desc: "Salons de recueillement privés, accessibles à la famille 7j/7 de 8h à 20h, en dehors de toute contrainte horaire d'hôpital.", tag: "Recueillement" },
  { titre: "Cérémonies personnalisées", desc: "Religieuses, laïques ou mixtes. Maître de cérémonie, musiques, textes, hommages — préparés avec vous, à votre rythme.", tag: "Sur mesure" },
  { titre: "Marbrerie & monuments", desc: "Création, restauration et entretien de monuments. Gravures, porcelaine, jardinières — devis clair avant toute intervention.", tag: "Marbrerie" },
  { titre: "Contrats de prévoyance", desc: "Vos volontés écrites et financées à l'avance, capital garanti. Mensualisable, modifiable, et opposable le moment venu.", tag: "Prévoyance" },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const ENGAGEMENT_DEMO = [
  "Habilitation préfectorale n° 26-31-0142 — Préfecture de la Haute-Garonne",
  "Devis-type réglementé, gratuit et sans engagement, conforme à l'arrêté du 23 août 2010",
  "Un seul interlocuteur, joignable 24h/24, du premier appel à l'après-obsèques",
  "Toutes confessions, cérémonies civiles et laïques respectées",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

const TARIFS_DEMO = [
  { a: "Obsèques avec crémation", p: "dès 2 890 €", n: "Cercueil chêne, transport, démarches, redevance de crémation incluse. Devis-type détaillé remis avant toute signature." },
  { a: "Obsèques avec inhumation", p: "dès 3 200 €", n: "Hors concession funéraire, dont le prix dépend de la commune. Le devis distingue prestations obligatoires et optionnelles." },
  { a: "Contrat de prévoyance", p: "dès 32 €/mois", n: "Capital garanti, volontés consignées. Souscription possible à tout âge, à l'agence ou à domicile." },
  { a: "Entretien de sépulture", p: "dès 90 €/an", n: "Nettoyage, fleurissement à la Toussaint, photo envoyée après chaque passage." },
];
let TARIFS = TARIFS_DEMO;

const AVIS_SOURCE = [
  { texte: "Nous avons été reçus le soir même, sans précipitation. Chaque choix nous a été expliqué avec le prix en face. Personne n'a cherché à nous vendre quoi que ce soit de plus.", auteur: "Famille M.", detail: "Obsèques d'un père" },
  { texte: "La cérémonie laïque préparée avec le maître de cérémonie ressemblait vraiment à ma sœur. Les textes, la musique, tout était juste. Merci pour cette dignité.", auteur: "Claire V.", detail: "Cérémonie personnalisée" },
  { texte: "J'ai souscrit un contrat de prévoyance après le décès de mon mari, pour que mes enfants n'aient jamais à traverser ce que j'ai traversé. Tout est écrit, tout est financé.", auteur: "Jeanne R.", detail: "Contrat de prévoyance" },
];
let AVIS_DEMO = AVIS_SOURCE;

/* ════════════════════════════════════════════════════════════════════════════
   Primitives — tout ici est plus lent qu'ailleurs : c'est voulu.
   ════════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 22 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.0, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

/*
  Sur-titre à la barre verticale : le filet horizontal partagé devenait la
  signature de quarante-quatre thèmes. Ici la maison funéraire pose une barre
  debout, sobre, à gauche du libellé — la verticale d'une stèle.
*/
function Kicker({ children, color = C.accent, align = "left" }: { children: React.ReactNode; color?: string; align?: "left" | "center" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: align === "center" ? "center" : "flex-start" }}>
      <span aria-hidden style={{ width: 2, height: 22, background: color, display: "inline-block", opacity: 0.85, flexShrink: 0 }} />
      <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color }}>{children}</span>
    </div>
  );
}

function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || fallback;
}

/* ── Lien de nav : soulignement lent, sans hâte ────────────────────────────── */
function NavLink({ l, h }: { l: string; h: string }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={h}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        color: hov ? C.ink : C.textMuted,
        fontFamily: SANS,
        fontSize: 13.5,
        fontWeight: 500,
        letterSpacing: "0.06em",
        textDecoration: "none",
        padding: "12px 4px",
        transition: `color .6s ${EASE_CSS}`,
      }}
    >
      {l}
      <span aria-hidden style={{ position: "absolute", left: 4, bottom: 8, height: 1, width: hov ? "calc(100% - 8px)" : "0%", background: C.accent, transition: `width .65s ${EASE_CSS}` }} />
    </a>
  );
}

/* ── Bouton : une élévation douce, deux ombres, jamais de sursaut ──────────── */
function CtaButton({ href, children, ghost = false }: { href: string; children: React.ReactNode; ghost?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        background: ghost ? (hov ? C.bgCard : "transparent") : C.accent,
        color: ghost ? C.ink : "#fff",
        border: ghost ? `1px solid ${hov ? C.accent : C.border}` : "1px solid transparent",
        borderRadius: 3,
        padding: ghost ? "14px 26px" : "15px 30px",
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 14.5,
        letterSpacing: "0.03em",
        textDecoration: "none",
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: ghost
          ? "none"
          : hov
            ? "0 3px 10px rgba(90,107,93,0.20), 0 20px 46px -16px rgba(90,107,93,0.42)"
            : "0 1px 4px rgba(90,107,93,0.12), 0 8px 24px -12px rgba(90,107,93,0.30)",
        transition: `all .6s ${EASE_CSS}`,
      }}
    >
      {children}
    </a>
  );
}

/* ── Carte d'accompagnement : le survol se pose, il ne bondit pas ──────────── */
function ServiceCarte({ s, idx }: { s: any; idx: number }) {
  const [hov, setHov] = useState(false);
  return (
    <Reveal delay={Math.min(idx * 0.06, 0.24)}>
      <article
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: C.bgCard,
          borderRadius: 4,
          padding: "clamp(24px, 3vw, 34px) clamp(22px, 2.8vw, 30px)",
          border: `1px solid ${hov ? "rgba(90,107,93,0.38)" : C.border}`,
          borderTop: `2px solid ${hov ? C.accent : C.border}`,
          boxShadow: hov
            ? "0 2px 10px rgba(38,36,31,0.05), 0 26px 56px -30px rgba(90,107,93,0.34)"
            : "0 2px 14px rgba(38,36,31,0.05)",
          transform: hov ? "translateY(-4px)" : "none",
          height: "100%",
          boxSizing: "border-box",
          transition: `all .6s ${EASE_CSS}`,
        }}
      >
        <span style={{ background: hov ? C.accentLight : "transparent", border: `1px solid ${hov ? "transparent" : C.border}`, color: C.accentDark, borderRadius: 2, padding: "4px 12px", fontFamily: SANS, fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.16em", transition: `all .55s ${EASE_CSS}` }}>{s.tag}</span>
        <h3 style={{ fontFamily: SERIF, fontSize: "clamp(21px, 2.1vw, 25px)", fontWeight: 500, color: C.ink, margin: "18px 0 10px", lineHeight: 1.2 }}>{s.titre}</h3>
        <p style={{ fontFamily: SANS, fontSize: 14.5, color: C.textMuted, lineHeight: 1.78, margin: 0 }}>{s.desc}</p>
      </article>
    </Reveal>
  );
}

/* ── Ligne de tarif : le devis-type se lit comme un document, calmement ────── */
function TarifLigne({ t, idx }: { t: any; idx: number }) {
  const [hov, setHov] = useState(false);
  return (
    <Reveal delay={idx * 0.06} y={14}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          justifyContent: "space-between",
          alignItems: "baseline",
          background: hov ? C.bgCard : "transparent",
          padding: "clamp(18px, 2.4vw, 26px) clamp(12px, 2vw, 22px)",
          paddingLeft: hov ? "clamp(20px, 2.8vw, 32px)" : "clamp(12px, 2vw, 22px)",
          transition: `all .6s ${EASE_CSS}`,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: SERIF, fontSize: "clamp(19px, 2vw, 23px)", fontWeight: 500, color: hov ? C.accentDark : C.ink, transition: `color .55s ${EASE_CSS}` }}>{t.a}</div>
          <div style={{ fontFamily: SANS, fontSize: 13.5, color: C.textMuted, marginTop: 6, lineHeight: 1.68, maxWidth: 560 }}>{t.n}</div>
        </div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(19px, 2.1vw, 24px)", color: C.accentDark, whiteSpace: "nowrap" }}>{t.p}</div>
      </div>
      <div aria-hidden style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.border} 14%, ${C.border} 86%, transparent)` }} />
    </Reveal>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════════════════ */
export default function MaisonEstevePage() {
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
  HERO_TEMPS_DEMO = HERO_TEMPS_DEMO_LIVE();
  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({ ...SERVICES_SOURCE[i % SERVICES_SOURCE.length], titre: s.title })),
    SERVICES_SOURCE,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({ ...AVIS_SOURCE[i % AVIS_SOURCE.length], auteur: r.author, texte: r.text })),
    AVIS_SOURCE,
  );
  HERO_TEMPS = HERO_TEMPS_DEMO.map((row, i) => ({
    ...row,
    img: clientPhotos(sessionData)[0 + i] || row.img,
  }));
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s, i) => ({ ...TARIFS_DEMO[i % TARIFS_DEMO.length], a: s.title, p: s.price ?? TARIFS_DEMO[i % TARIFS_DEMO.length].p, n: s.desc || TARIFS_DEMO[i % TARIFS_DEMO.length].n })),
    TARIFS_DEMO,
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

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  /* Le rythme le plus lent du kit : 5,6 s par temps, transition tenue.
     Un seul index pilote le panneau, la légende et la fraction. */
  const { i } = useSlides(HERO_TEMPS.length, DWELL.slow);
  const temps = HERO_TEMPS[i];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = clientPhone(sessionData) ?? "05 61 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? "+33561000000").replace(/[^+\d]/g, "")}`;
  const mail = clientEmail(sessionData) ?? "contact@maison-esteve.fr";

  return (
    <div style={{ background: C.bg, fontFamily: SANS, overflowX: "clip" }}>
      <style>{FONTS_CSS}</style>
      <style>{`
        @media (max-width: 900px) { #i328-nav { display: none !important; } .i328-burger { display: flex !important; } }
        @media (max-width: 860px) {
          .i328-hero { grid-template-columns: 1fr !important; padding: 46px 24px 46px !important; gap: 34px !important; }
          .i328-heldcard { max-width: 380px; margin: 0 auto; }
          .i328-split { grid-template-columns: 1fr !important; }
          .i328-split > * { order: initial !important; }
          .i328-pad { padding-left: 24px !important; padding-right: 24px !important; }
        }
        @keyframes i328-veille { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .i328-root * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
        }
      `}</style>

      {/* ── Bandeau 24h/24 — le point de veille respire, sans presser ───── */}
      <div style={{ background: C.bgDark, color: "rgba(255,255,255,0.72)", fontFamily: SANS, fontSize: 13, textAlign: "center", padding: "9px 16px", letterSpacing: "0.02em" }}>
        <span aria-hidden style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: C.gold, marginRight: 9, verticalAlign: "middle", animation: "i328-veille 4s ease-in-out infinite" }} />
        Nous sommes joignables 24h/24, 7j/7 —{" "}
        <a href={telHref} style={{ color: "#fff", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3, padding: "8px 2px" }}>{phone}</a>
      </div>

      {/* ── NAV — collante à 4 propriétés : filet, ombre, hauteur, fond ──── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          height: scrolled ? 66 : 74,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(24px, 4vw, 48px)",
          background: scrolled ? "rgba(250,249,246,0.98)" : "rgba(250,249,246,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          boxShadow: scrolled ? "0 12px 36px -26px rgba(38,36,31,0.35)" : "none",
          transition: `all .65s ${EASE_CSS}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 170, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Flower2 size={17} color={C.accent} />
              <span style={{ fontFamily: SERIF, fontSize: 22, color: C.ink, fontWeight: 500, letterSpacing: "0.01em" }}>{fd?.businessName ?? "Maison Estève"}</span>
              <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textMuted, marginLeft: 6 }}>{clientTrade(sessionData) ?? "Pompes funèbres"}</span>
            </>
          )}
        </div>
        <div id="i328-nav" style={{ display: "flex", gap: 22, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <NavLink key={l} l={l} h={h} />
          ))}
          <CtaButton href={telHref}>Nous joindre</CtaButton>
        </div>
        <button className="i328-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 105, left: 0, right: 0, zIndex: 99, background: "rgba(250,249,246,0.99)", borderBottom: `1px solid ${C.border}`, padding: "20px 28px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ color: C.ink, fontFamily: SANS, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "12px 0" }}>{l}</a>
          ))}
          <a href={telHref} style={{ background: C.accent, color: "#fff", borderRadius: 3, padding: "13px 24px", fontSize: 15, fontWeight: 600, textDecoration: "none", textAlign: "center", marginTop: 8 }}>Nous joindre</a>
        </div>
      )}

      {/* ── HERO — HeldSwap, tenu lentement ─────────────────────────────── */}
      <section className="i328-hero i328-root" style={{ minHeight: "calc(100dvh - 105px)", display: "grid", gridTemplateColumns: "minmax(0,1.05fr) minmax(0,0.95fr)", gap: "clamp(38px, 5vw, 64px)", alignItems: "center", padding: "clamp(48px, 8vh, 80px) clamp(24px, 5vw, 64px) clamp(44px, 7vh, 64px)", maxWidth: 1240, margin: "0 auto", position: "relative" }}>
        {/* Glow très doux — la seule texture que la page s'autorise ici */}
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(50% 60% at 24% 40%, rgba(90,107,93,0.06), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 1.0 }}>
            <Kicker>{clientEyebrow(sessionData) ?? <>Pompes funèbres & prévoyance · {clientCity(sessionData) ?? "Toulouse"}</>}</Kicker>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 1.1, ease: EASE }}
            style={{ fontFamily: SERIF, fontSize: "clamp(38px, 5vw, 70px)", fontWeight: 400, color: C.ink, lineHeight: 1.0, letterSpacing: "-0.01em", margin: "clamp(16px, 2.2vw, 24px) 0 clamp(18px, 2.4vw, 26px)" }}
          >{/* TEXTE_SECTION */ clientText(sessionData, "section-1.titre") ?? (<>
            {c?.heroHeadline ?? (<>{clientHeroLine(sessionData, 0, 2, 21) ?? "Accompagner,"}<br /><em style={{ color: C.accent }}>{clientHeroLine(sessionData, 1, 2, 21) ?? "avec calme et clarté."}</em></>)}
          </>)}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 1.0, ease: EASE }} style={{ fontFamily: SANS, fontSize: "clamp(15.5px, 1.5vw, 17px)", color: C.textMuted, lineHeight: 1.82, maxWidth: 480, marginBottom: "clamp(26px, 3.6vw, 38px)" }}>
            {clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? "Depuis trois générations, notre maison organise des obsèques dignes et des cérémonies fidèles à la personne — au prix annoncé, sans jamais rien presser."}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72, duration: 1.0, ease: EASE }} style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <CtaButton href={telHref}><Phone size={16} /> Nous joindre — 24h/24</CtaButton>
            <CtaButton href="#prevoyance" ghost>Anticiper pour ses proches</CtaButton>
          </motion.div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: "clamp(32px, 5vh, 48px)" }}>
            <SlideIndex i={i} total={HERO_TEMPS.length} variant="fraction" color={C.textMuted} className="" />
            <span style={{ fontFamily: SANS, fontSize: 13.5, letterSpacing: "0.12em", textTransform: "uppercase", color: C.textFaint }}>{temps.k}</span>
          </div>
        </div>

        {/* Le panneau tenu : il entre, se pose, reste. Le temps mort entre
            deux temps est voulu — c'est lui qui porte le respect. */}
        <div className="i328-heldcard" style={{ position: "relative" }}>
          <HeldSwap index={i} tilt={7}>
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 4, overflow: "hidden", boxShadow: "0 2px 14px rgba(38,36,31,0.06), 0 26px 60px -22px rgba(90,107,93,0.24)" }}>
              <div style={{ position: "relative", background: C.bgDark }}>
                <img src={photo(i, temps.img)} alt={temps.alt} loading="lazy" style={{ width: "100%", aspectRatio: "4/3.4", objectFit: "cover", display: "block" }} />
                <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(35,38,43,0.22), transparent 40%)", pointerEvents: "none" }} />
              </div>
              <div style={{ padding: "clamp(20px, 2.6vw, 28px) clamp(22px, 2.8vw, 30px)" }}>
                <div style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.30em", textTransform: "uppercase", color: C.accent, marginBottom: 10 }}>{temps.k}</div>
                <div style={{ fontFamily: SERIF, fontSize: "clamp(19px, 2vw, 23px)", fontWeight: 400, color: C.ink, lineHeight: 1.4 }}>{temps.line}</div>
              </div>
            </div>
          </HeldSwap>
        </div>
      </section>

      {/* ── RESPIRATION — la page se tait un instant ────────────────────── */}
      <section className="i328-pad" style={{ background: C.bgAlt, padding: "clamp(80px, 11vw, 156px) clamp(24px, 8vw, 120px)", textAlign: "center" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <Kicker align="center" color={C.textMuted}>La maison</Kicker>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(23px, 3.1vw, 42px)", fontWeight: 400, lineHeight: 1.4, letterSpacing: "-0.005em", maxWidth: 860, margin: "0 auto", color: C.ink }}>{/* TEXTE_SECTION */ clientText(sessionData, "respiration.texte") ?? (<>
            Tout est pris en charge. Rien ne vous est imposé.
          </>)}</p>
        </Reveal>
        <Reveal delay={0.24}>
          <div aria-hidden style={{ width: 1, height: "clamp(64px, 9vw, 104px)", background: `linear-gradient(${C.accent}, transparent)`, margin: "clamp(40px, 6vw, 64px) auto 0", opacity: 0.7 }} />
        </Reveal>
      </section>

      {/* ── ACCOMPAGNEMENT ──────────────────────────────────────────────── */}
      <section id="accompagnement" className="i328-pad" style={{ padding: "clamp(80px, 10vw, 136px) clamp(24px, 5vw, 64px)", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(36px, 5vw, 58px)" }}>
              <Kicker>Notre accompagnement</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4vw, 54px)", fontWeight: 400, color: C.ink, marginTop: 16, lineHeight: 1.06, letterSpacing: "-0.005em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "accompagnement.titre") ?? (<>
                À chaque étape,<br /><em style={{ color: C.accent }}>quelqu'un vous accompagne.</em>
              </>)}</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: "clamp(14px, 2vw, 22px)" }}>
            {SERVICES.map((s, idx) => (
              <ServiceCarte key={s.titre} s={s} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PRÉVOYANCE ──────────────────────────────────────────────────── */}
      <section id="prevoyance" className="i328-pad" style={{ padding: "clamp(80px, 10vw, 136px) clamp(24px, 5vw, 64px)", background: C.bgAlt, position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(46% 60% at 80% 30%, rgba(168,148,104,0.07), transparent 70%)", pointerEvents: "none" }} />
        <div className="i328-split" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(38px, 6vw, 72px)", alignItems: "center", position: "relative" }}>
          <Reveal>
            <div style={{ position: "relative", padding: "0 14px 14px 0" }}>
              <span aria-hidden style={{ position: "absolute", top: 14, left: 14, right: 0, bottom: 0, border: `1px solid ${C.gold}`, borderRadius: 4, opacity: 0.45, pointerEvents: "none" }} />
              <img src={photo(4, "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80")} alt="Horizon paisible au petit matin" loading="lazy" style={{ width: "100%", borderRadius: 4, aspectRatio: "4/3", objectFit: "cover", display: "block", position: "relative", boxShadow: "0 22px 54px -28px rgba(38,36,31,0.35)" }} />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <Kicker>Une maison de confiance</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3.2vw, 46px)", fontWeight: 400, color: C.ink, margin: "16px 0 18px", lineHeight: 1.06, letterSpacing: "-0.005em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "prevoyance.titre") ?? (<>
                Ce que la loi garantit,<br /><em style={{ color: C.accent }}>ce que nous y ajoutons.</em>
              </>)}</h2>
              <p style={{ fontFamily: SANS, fontSize: 15, color: C.textMuted, lineHeight: 1.78, maxWidth: 470, margin: "0 0 24px" }}>{/* TEXTE_SECTION */ clientText(sessionData, "prevoyance.texte") ?? (<>
                Le contrat de prévoyance consigne vos volontés et les finance à l'avance : le moment venu, vos proches n'ont ni choix douloureux ni facture à porter.
              </>)}</p>
              {ENGAGEMENT.map((e, idx) => (
                <div key={idx} style={{ display: "flex", gap: 12, padding: "12px 0", borderTop: idx === 0 ? "none" : `1px solid ${C.border}` }}>
                  <CheckCircle size={17} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontFamily: SANS, fontSize: 15, color: C.textMuted, lineHeight: 1.7 }}>{e}</span>
                </div>
              ))}
              <div style={{ marginTop: 24 }}>
                <CtaButton href={telHref}>Parler prévoyance <ArrowRight size={15} /></CtaButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TARIFS — le devis-type, lisible comme un document ───────────── */}
      <section id="tarifs" className="i328-pad" style={{ padding: "clamp(80px, 10vw, 136px) clamp(24px, 5vw, 64px)", background: C.bg }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "clamp(20px, 3vw, 32px)" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Kicker align="center">Tarifs</Kicker>
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 3.8vw, 50px)", fontWeight: 400, color: C.ink, marginTop: 14, lineHeight: 1.06, letterSpacing: "-0.005em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Des prix <em style={{ color: C.accent }}>annoncés avant tout.</em></>)}</h2>
              <p style={{ fontFamily: SANS, fontSize: 15, color: C.textMuted, maxWidth: 560, margin: "16px auto 0", lineHeight: 1.78 }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.intro") ?? (<>
                Le devis-type réglementé distingue prestations obligatoires, courantes et optionnelles. Il est gratuit, remis avant tout engagement, et reste valable si vous consultez d'autres maisons.
              </>)}</p>
            </div>
          </Reveal>
          <div style={{ marginTop: "clamp(28px, 4vw, 44px)", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 4, padding: "clamp(8px, 1.2vw, 14px) clamp(14px, 2vw, 26px)", boxShadow: "0 2px 14px rgba(38,36,31,0.05), 0 26px 64px -38px rgba(90,107,93,0.30)" }}>
            {TARIFS.map((t, idx) => (
              <TarifLigne key={t.a} t={t} idx={idx} />
            ))}
            <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 15, color: C.textFaint, textAlign: "center", margin: "clamp(16px, 2.2vw, 22px) 0 10px", lineHeight: 1.6 }}>
              Devis-type conforme à l'arrêté du 23 août 2010 — remis gratuitement, avant toute signature.
            </p>
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES — sans étoiles, sans bruit ──────────────────────── */}
      <section className="i328-pad" style={{ padding: "clamp(80px, 10vw, 136px) clamp(24px, 5vw, 64px)", background: C.bgDark, position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(56% 80% at 50% 100%, rgba(168,148,104,0.07), transparent 60%)", pointerEvents: "none" }} />
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "clamp(36px, 5vw, 56px)", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <Kicker align="center" color={C.gold}>Elles nous écrivent</Kicker>
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3.6vw, 48px)", fontWeight: 400, color: "#fff", lineHeight: 1.06, letterSpacing: "-0.005em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-5.titre") ?? (<>
              Des familles <em style={{ color: C.gold }}>nous écrivent</em>.
            </>)}</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: "clamp(14px, 2vw, 22px)", maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          {AVIS.map((a, idx) => (
            <Reveal key={a.auteur} delay={idx * 0.12}>
              <figure style={{ position: "relative", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 4, padding: "clamp(26px, 3.2vw, 36px) clamp(22px, 2.8vw, 30px)", height: "100%", margin: 0, boxSizing: "border-box", overflow: "hidden" }}>
                <span aria-hidden style={{ position: "absolute", top: -20, right: 4, fontFamily: SERIF, fontStyle: "italic", fontSize: 130, lineHeight: 1, color: "rgba(168,148,104,0.09)", pointerEvents: "none", userSelect: "none" }}>”</span>
                <blockquote style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(16.5px, 1.7vw, 19px)", color: "rgba(255,255,255,0.84)", lineHeight: 1.72, margin: "0 0 20px" }}>
                  "{a.texte}"
                </blockquote>
                <figcaption style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14 }}>
                  <div style={{ fontFamily: SANS, fontWeight: 600, color: "#fff", fontSize: 14 }}>{a.auteur}</div>
                  <div style={{ fontFamily: SANS, fontSize: 11.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.gold, marginTop: 5 }}>{a.detail}</div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section id="contact" className="i328-pad" style={{ padding: "clamp(88px, 11vw, 150px) clamp(24px, 5vw, 64px)", background: C.accentLight, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(50% 70% at 50% 0%, rgba(90,107,93,0.08), transparent 65%)", pointerEvents: "none" }} />
        <Reveal>
          <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
            <Kicker align="center" color={C.accentDark}>À votre écoute</Kicker>
          </div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4.2vw, 54px)", fontWeight: 400, color: C.ink, margin: "18px 0 16px", lineHeight: 1.06, letterSpacing: "-0.005em", position: "relative" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
            À toute heure,<br /><em style={{ color: C.accent }}>quelqu'un répond.</em>
          </>)}</h2>
          <p style={{ fontFamily: SANS, fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto clamp(28px, 4vw, 40px)", lineHeight: 1.78, position: "relative" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ?? (<>
            En cas de décès, appelez-nous : nous nous déplaçons et prenons le relais immédiatement, de jour comme de nuit.
          </>)}</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
            <CtaButton href={telHref}><Phone size={17} /> {phone}</CtaButton>
            <CtaButton href={`mailto:${mail}`} ghost><Mail size={17} /> Nous écrire</CtaButton>
          </div>
          {clientAddress(sessionData) && (
            <p style={{ fontFamily: SANS, fontSize: 14, color: C.textMuted, marginTop: 26, display: "inline-flex", alignItems: "center", gap: 8, position: "relative" }}>
              <MapPin size={14} color={C.accentDark} /> {clientAddress(sessionData)}
            </p>
          )}
        </Reveal>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="i328-pad" style={{ background: C.bgDarkAlt, padding: "clamp(44px, 6vw, 64px) clamp(24px, 5vw, 64px) 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 30 }}>
            <div>
              <div style={{ fontFamily: SERIF, fontSize: 21, color: C.gold, marginBottom: 8 }}>{fd?.businessName ?? "Maison Estève"}</div>
              <p style={{ fontFamily: SANS, color: "rgba(255,255,255,0.35)", fontSize: 13, lineHeight: 1.7 }}>
                {clientTrade(sessionData) ?? "Pompes funèbres"} & prévoyance · {clientCity(sessionData) ?? "Toulouse"}<br />
                Habilitation préfectorale n° 26-31-0142
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { icon: <MapPin size={13} />, t: clientCodePostalVille(sessionData, "31000", "Toulouse") },
                { icon: <Phone size={13} />, t: `${phone} — 24h/24, 7j/7` },
                { icon: <Mail size={13} />, t: mail },
                { icon: <Clock size={13} />, t: "Agence : Lun–Sam 8h30–18h30" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.40)", fontFamily: SANS, fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.gold }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
          <div aria-hidden style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(168,148,104,0.28), transparent)" }} />
          <div style={{ paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontFamily: SANS, color: "rgba(255,255,255,0.22)", fontSize: 12, letterSpacing: "0.03em" }}>
              © 2026 {fd?.businessName ?? "Maison Estève"} — Site réalisé par Aevia WS · SIREN {/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}<LegalIdentity fallback="852 546 225" kind="siren" />
            </span>
            <span style={{ fontFamily: SANS, color: "rgba(255,255,255,0.22)", fontSize: 12, letterSpacing: "0.03em" }}>Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
