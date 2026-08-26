"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, Mail, MapPin, Mic2, Music4, Phone, Star } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, HairlineArrows, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
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
  clientName,
  clientPhone,
  clientPhotos,
  clientReviews,
  clientServices,
  clientStats,
  clientTagline,
  clientText,
  clientTrade,
} from "@/lib/templates/clientContent";

/* ════════════════════════════════════════════════════════════════════════════
   STUDIO GAMME — École de musiques actuelles · Villeurbanne

   Archétype H5 : rail latéral fixe + titre monumental. Geste signature UNIQUE :
   ScrollGrow sur le TITRE — il grandit au défilement comme un son qui monte,
   c'est le crescendo. Les deux voisins de catalogue qui partagent ScrollGrow
   s'en distinguent nettement : impact-352 (H7 magazine ardoise, EB Garamond,
   1 → 1.26 sur un titre de couverture) et impact-354 (H4 crèche, Newsreader,
   1 → 1.18 sur une CARTE, pas un titre). Ici : H5, Bricolage Grotesque,
   1 → 1.34 sur le titre lui-même, rail violet, portées musicales en filets.

   Signature visuelle : les portées (5 filets horizontaux d'1 px) traversent le
   héros et la bande de chiffres ; les nuances pp → ff graduent les rangées de
   cours ; un soufflet de crescendo (‹) est dessiné en CSS dans la méthode.

   Le proxy du conteneur bloque Unsplash/Pexels : la seule URL d'image du thème
   est conservée telle quelle, les autres emplacements sont peints en CSS et la
   page tient debout sans photographie.
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

/* ── Tokens ──────────────────────────────────────────────────────────────── */
const C = {
  bg: "#f8f6fc",
  bgAlt: "#efe9f7",
  bgDark: "#1a1224",
  bgDarkAlt: "#120c1a",
  bgCard: "#ffffff",
  accent: "var(--brand,#6d28a8)",
  accentDark: "var(--brand-light,#531f82)",
  accentLight: "#e8dcf4",
  ink: "#1e1727",
  textMuted: "#5f5769",
  textFaint: "#948b9f",
  border: "#e3dbee",
  white: "#ffffff",
  /* La lumière de scène : la seule couleur claire admise sur les fonds noirs. */
  neon: "#c9a8ea",
} as const;

/*
  La paire du plan (P12) : « Bricolage Grotesque » porte la voix — une
  grotesque à chasse large qui sonne comme une affiche de concert — et
  « Figtree » porte la lecture. Rôles opposés : la première ne descend jamais
  dans un paragraphe, la seconde ne monte jamais dans un titre. L'italique du
  thème est celui de Figtree : Bricolage n'en a pas, et c'est ce contraste
  droit/penché qui fait la figure de titre.
*/
const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@300;400;500;600;700;800&family=Figtree:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&display=swap');`;
const FONT_TITRE = "'Bricolage Grotesque', system-ui, -apple-system, sans-serif";
const FONT = "'Figtree', system-ui, -apple-system, sans-serif";
const FONT_BODY = FONT;

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Données de démonstration (contenu du thème, conservé mot pour mot) ──── */
const NAV = [{ l: "Cours", h: "#services" }, { l: "La pédagogie", h: "#methode" }, { l: "Tarifs", h: "#tarifs" }, { l: "Contact", h: "#contact" }];

/* Les six nuances : la dynamique musicale gradue les rangées de cours. */
const NUANCES = ["pp", "p", "mp", "mf", "f", "ff"] as const;

const SERVICES_SOURCE = [{"titre": "Guitare & basse", "desc": "Électrique, acoustique, du premier riff aux impros : les morceaux que VOUS choisissez servent de programme, la technique s'y glisse.", "tag": "Cordes"}, {"titre": "Batterie & percussions", "desc": "Studios insonorisés, kits acoustiques et électroniques : frapper fort sans fâcher personne, groove d'abord.", "tag": "Batterie"}, {"titre": "Chant", "desc": "Technique vocale, micro, scène : du timide de la douche au chanteur de groupe, sans jamais formater les voix.", "tag": "Chant"}, {"titre": "Piano & claviers", "desc": "Classique si vous voulez, mais aussi synthés, nappes et claviers de groupe : le piano qui sert la musique d'aujourd'hui.", "tag": "Claviers"}, {"titre": "MAO & production", "desc": "Ableton, enregistrement, mixage : produire ses morceaux dans notre studio MAO, du beat au master.", "tag": "MAO"}, {"titre": "Ateliers de groupe", "desc": "Dès le 3e mois : jouer ensemble, monter un set, préparer la scène trimestrielle. C'est là que la musique prend.", "tag": "Groupe"}];
let SERVICES_DEMO = SERVICES_SOURCE;
const METHODE = [{"n": "01", "t": "Le cours d'essai", "d": "30 minutes avec le professeur de votre instrument : niveau réel, envies réelles, plan proposé."}, {"n": "02", "t": "Vos morceaux au programme", "d": "Le solfège existe, mais il arrive par les morceaux — jamais avant eux."}, {"n": "03", "t": "Le groupe dès que possible", "d": "Au 3e mois, un atelier collectif : jouer avec d'autres change tout, surtout les progrès."}, {"n": "04", "t": "La scène du trimestre", "d": "Un vrai concert, du vrai son, un public : l'objectif qui structure les trois mois."}];
const ENGAGEMENT_DEMO = ["Professeurs diplômés (DEM, MIMA) et musiciens en activité — ils tournent, ils enregistrent", "Studios insonorisés, backline fourni : venez les mains dans les poches", "Sans engagement annuel : l'abonnement se suspend ou s'arrête au mois", "La scène trimestrielle est incluse — son, lumières et trac compris"];
let ENGAGEMENT = ENGAGEMENT_DEMO;
const TARIFS_DEMO = [{"a": "Cours individuel 30 min/sem.", "p": "89 €/mois", "n": "Instrument au choix, professeur attitré."}, {"a": "Cours individuel 45 min/sem.", "p": "119 €/mois", "n": "Le format de la progression rapide, atelier de groupe inclus."}, {"a": "Atelier MAO (2 h/sem.)", "p": "79 €/mois", "n": "En binôme sur nos stations, projets personnels encouragés."}, {"a": "Cours d'essai", "p": "offert", "n": "30 minutes avec le prof de votre instrument, sans engagement."}];
let TARIFS = TARIFS_DEMO;
const AVIS_SOURCE = [{"texte": "Vingt ans que je disais « un jour, la guitare ». Huit mois ici : je joue six morceaux, j'ai fait la scène de décembre devant mes enfants médusés. La méthode par les morceaux, ça marche.", "auteur": "Franck, 43 ans", "detail": "Guitare débutant"}, {"texte": "Ma fille de 13 ans vit pour son atelier du mercredi : son groupe a joué en mars, elle bosse sa batterie sans qu'on le demande. Du jamais vu pour les devoirs.", "auteur": "Parent d'élève", "detail": "Batterie + atelier"}, {"texte": "Le studio MAO m'a fait passer de « j'ai des idées » à « j'ai un EP ». Prof exigeant, matos sérieux, mix final au casque de studio. Objectif atteint.", "auteur": "Sofian, 26 ans", "detail": "MAO / production"}];
let AVIS_DEMO = AVIS_SOURCE;
const STATS_DEMO = [{"value": "9", "label": "Professeurs diplômés en poste"}, {"value": "4", "label": "Studios insonorisés + MAO"}, {"value": "3 mois", "label": "Avant votre premier atelier de groupe"}, {"value": "1", "label": "Scène chaque trimestre"}];
let STATS = STATS_DEMO;

/* La seule adresse d'image que portait le thème : conservée telle quelle. */
const PHOTO_SCENE = "https://images.pexels.com/photos/8520462/pexels-photo-8520462.jpeg?auto=compress&cs=tinysrgb&w=1400";

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 26, style }: { children: React.ReactNode; delay?: number; y?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} style={style} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

/** Kicker filé : 40×1 px, capitales espacées. */
function Kicker({ children, color = C.accentDark, align = "left" }: { children: React.ReactNode; color?: string; align?: "left" | "center" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: align === "center" ? "center" : "flex-start" }}>
      <span aria-hidden style={{ width: 40, height: 1, background: color, opacity: 0.7, flexShrink: 0 }} />
      <span style={{ fontFamily: FONT, fontSize: 10.5, letterSpacing: "0.36em", textTransform: "uppercase", color, fontWeight: 600 }}>{children}</span>
      {align === "center" && <span aria-hidden style={{ width: 40, height: 1, background: color, opacity: 0.7, flexShrink: 0 }} />}
    </div>
  );
}

/** Une portée : cinq filets horizontaux d'1 px, dégradés aux extrémités. */
function Portee({ height = 52, opacity = 1, color = C.border, style }: { height?: number; opacity?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <div aria-hidden style={{ height, opacity, display: "flex", flexDirection: "column", justifyContent: "space-between", pointerEvents: "none", ...style }}>
      {[0, 1, 2, 3, 4].map((n) => (
        <span key={n} style={{ display: "block", height: 1, background: `linear-gradient(90deg, transparent, ${color} 12%, ${color} 88%, transparent)` }} />
      ))}
    </div>
  );
}

/** Lien de nav : soulignement en largeur qui pousse. */
function NavLink({ label, href, dark = false, onClick }: { label: string; href: string; dark?: boolean; onClick?: () => void }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        fontFamily: FONT,
        color: h ? C.accentDark : dark ? "rgba(255,255,255,0.82)" : C.textMuted,
        fontSize: 13.5,
        fontWeight: 500,
        letterSpacing: "0.04em",
        textDecoration: "none",
        padding: "12px 2px",
        position: "relative",
        transition: "color .45s cubic-bezier(.16,1,.3,1)",
      }}
    >
      {label}
      <span aria-hidden style={{ position: "absolute", left: 0, bottom: 6, height: 1.5, width: h ? "100%" : "0%", background: C.accent, transition: "width .5s cubic-bezier(.16,1,.3,1)" }} />
    </a>
  );
}

/** Bouton principal : élévation, deux ombres, flèche qui avance. */
function CtaButton({ href, children, ghost = false, big = false }: { href: string; children: React.ReactNode; ghost?: boolean; big?: boolean }) {
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
        padding: big ? "17px 34px" : "14px 28px",
        borderRadius: 10,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: big ? 15.5 : 14.5,
        textDecoration: "none",
        background: ghost ? "transparent" : h ? C.accentDark : C.accent,
        color: ghost ? C.ink : C.white,
        border: ghost ? `1px solid ${h ? C.accent : C.border}` : "1px solid transparent",
        transform: h ? "translateY(-2px)" : "none",
        boxShadow: h
          ? "0 3px 8px rgba(30,23,39,0.10), 0 22px 44px -18px rgba(109,40,168,0.45)"
          : "0 1px 3px rgba(30,23,39,0.06), 0 10px 24px -18px rgba(30,23,39,0.25)",
        transition: "all .5s cubic-bezier(.16,1,.3,1)",
      }}
    >
      {children}
      <ArrowRight size={big ? 17 : 15} style={{ transform: h ? "translateX(4px)" : "none", transition: "transform .5s cubic-bezier(.16,1,.3,1)" }} />
    </a>
  );
}

function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════════════ */
export default function StudioGammePage() {
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
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s, i) => ({ ...TARIFS_DEMO[i % TARIFS_DEMO.length], a: s.title, p: s.price ?? TARIFS_DEMO[i % TARIFS_DEMO.length].p, n: s.desc || TARIFS_DEMO[i % TARIFS_DEMO.length].n })),
    TARIFS_DEMO,
  );
  STATS = resolveList(clientStats(sessionData), STATS_DEMO);
  ENGAGEMENT = resolveList(clientCertifications(sessionData), ENGAGEMENT_DEMO);
  brand = fd?.brandColor ?? null;

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
      auteur: r.name ?? AVIS_DEMO[n % AVIS_DEMO.length].auteur,
      detail: r.location ?? r.role ?? AVIS_DEMO[n % AVIS_DEMO.length].detail,
    })),
    AVIS_DEMO,
  );

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [rangSurvole, setRangSurvole] = useState(-1);
  const [tarifSurvole, setTarifSurvole] = useState(-1);

  /* Un seul index pilote le spotlight d'avis : compteur, flèches, citation. */
  const { i: iAvis, next: avisSuivant, prev: avisPrecedent } = useSlides(AVIS.length, DWELL.slow);
  const A = AVIS[iAvis];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = clientPhone(sessionData) ?? "04 72 00 00 01";
  const telHref = `tel:${(clientPhone(sessionData) ?? "+33472000001").replace(/[^+\d]/g, "")}`;
  const mail = clientEmail(sessionData) ?? "hello@studio-gamme.fr";
  const nom = fd?.businessName ?? clientName(sessionData) ?? "Studio Gamme";
  const ville = clientCity(sessionData) ?? "Villeurbanne";

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: FONT_BODY, overflowX: "clip", WebkitFontSmoothing: "antialiased" }}>
      <style>{`${FONTS_CSS}

        /*
          ── Héros « liste immédiate » ──────────────────────────────────────
          Le programme des cours posé d'emblée, mesure par mesure.
        */
        .i377-annonce {
          display: grid;
          grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.9fr);
          gap: clamp(24px, 4vw, 64px);
          align-items: end;
        }
        .i377-ligne { transition: background .3s ease, padding-left .3s ease; }
        .i377-ligne:hover { background: ${C.accentLight}; padding-left: clamp(8px, 1.2vw, 18px); }
        @media (max-width: 900px) {
          .i377-annonce { grid-template-columns: minmax(0,1fr); row-gap: 22px; align-items: start; }
          .i377-tag { display: none; }
          .i377-stats { grid-template-columns: 1fr 1fr !important; row-gap: 8px; }
        }

        @media (max-width: 900px) { #i377-nav { display: none !important; } .i377-burger { display: flex !important; } }
        @media (max-width: 860px) {
          .i377-rail { display: none !important; }
          .i377-hero { padding-left: clamp(20px,6vw,32px) !important; }
          .i377-stats { grid-template-columns: 1fr 1fr !important; row-gap: clamp(18px,4vw,26px) !important; }
          .i377-stats .i377-statcell { border-right: none !important; }
          .i377-rang { grid-template-columns: 1fr !important; gap: 8px !important; }
          .i377-rang .i377-rangnuance { position: static !important; }
          .i377-split { grid-template-columns: 1fr !important; }
          .i377-split > * { order: initial !important; }
          .i377-scene { grid-template-columns: 1fr !important; }
          .i377-tarif { grid-template-columns: 1fr !important; }
          .i377-tarif .i377-tarifprix { justify-self: start !important; margin-top: 4px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .i377-eq span { animation: none !important; height: 30% !important; }
        }
        @keyframes i377-eq {
          0%, 100% { transform: scaleY(0.24); }
          50% { transform: scaleY(1); }
        }
      `}</style>

      {/* ── NAV — collante, quatre propriétés en transition ─────────────── */}
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
          padding: scrolled ? "10px clamp(20px,4.5vw,48px)" : "20px clamp(20px,4.5vw,48px)",
          background: scrolled ? "rgba(248,246,252,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          transition: "all .55s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={nom} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Music4 size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: FONT_TITRE, fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em", color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nom}</span>
              <span style={{ fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textFaint, marginLeft: 6 }}>{clientTrade(sessionData) ?? "Musiques actuelles"}</span>
            </>
          )}
        </div>
        <div id="i377-nav" style={{ display: "flex", gap: "clamp(14px,2vw,26px)", alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <NavLink key={l} label={l} href={h} />
          ))}
          <CtaButton href={telHref}>Cours d'essai offert</CtaButton>
        </div>
        <button className="i377-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 99, background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "20px 28px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ color: C.ink, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "12px 0" }}>{l}</a>
          ))}
          <a href={telHref} style={{ background: C.accent, color: "#fff", borderRadius: 10, padding: "13px 22px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 8 }}>Cours d'essai offert</a>
        </div>
      )}

      {/* ── HÉROS — H5 : rail latéral fixe + titre monumental (ScrollGrow) ── */}
      <section
        className="i377-hero"
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "clamp(20px,2.8vh,36px)",
          padding: "clamp(112px,13vh,150px) clamp(24px,6vw,88px) clamp(36px,5vh,64px)",
          background: C.bg,
          overflow: "clip",
        }}
      >
        {/* ── HERO — liste immédiate : le programme sur la portée ──────────
               Une école se lit comme un programme de cours, pas comme une
               affiche : les six enseignements sont posés d'emblée, chacun
               sur sa ligne de portée, numérotés comme des mesures. Le rail
               vertical FixedRail — une colonne de plus — s'efface ; le
               crescendo ScrollGrow reste sur le titre. */}

        {/* Portées en filets : la texture du métier, sans image. */}
        <Portee height={64} opacity={0.6} style={{ position: "absolute", top: "12%", left: 0, right: 0 }} />
        {/* Nuance fantôme — opacité sous 0.1, jamais cliquable. */}
        <span aria-hidden style={{ position: "absolute", right: "clamp(8px,4vw,60px)", top: "6%", fontFamily: FONT, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(140px,22vw,320px)", lineHeight: 1, color: C.accent, opacity: 0.06, pointerEvents: "none", userSelect: "none" }}>ff</span>
        {/* Glow de scène, radial et discret. */}
        <div aria-hidden style={{ position: "absolute", inset: 0, background: `radial-gradient(60% 46% at 68% 30%, rgba(109,40,168,0.10), transparent 70%)`, pointerEvents: "none" }} />

        {/* L'annonce : d'où l'on parle, et par où commencer. */}
        <div className="i377-annonce" style={{ position: "relative", zIndex: 2 }}>
          <div style={{ minWidth: 0 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, duration: 0.7, ease: EASE }}>
              <Kicker>{clientEyebrow(sessionData) ?? <>École de musiques actuelles · {ville}</>}</Kicker>
            </motion.div>

            {/* Le geste : ScrollGrow sur le titre. On défile, il grandit — crescendo. */}
            <ScrollGrow from={1} to={1.18} fade>
              <motion.h1
                initial={{ opacity: 0, y: 34 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.95, ease: EASE }}
                style={{
                  fontFamily: FONT_TITRE,
                  fontWeight: 700,
                  fontSize: "clamp(34px,5vw,66px)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.025em",
                  color: C.ink,
                  margin: "clamp(16px,2.2vw,26px) 0 0",
                  maxWidth: 700,
                  overflowWrap: "break-word",
                }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "section-1.titre") ??
                  c?.heroHeadline ??
                  clientHeroLine(sessionData, 0, 1, 34) ?? (
                    <>
                      Jouer les morceaux <span style={{ color: C.accent }}>que vous écoutez vraiment.</span>
                    </>
                  )}
              </motion.h1>
            </ScrollGrow>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.8, ease: EASE }} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
            <p style={{ fontSize: "clamp(14px,1.2vw,15.5px)", color: C.textMuted, lineHeight: 1.75, maxWidth: 380, margin: 0 }}>
              {clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? "Guitare, batterie, chant, MAO : des cours individuels sur les musiques que vous aimez, des ateliers de groupe dès le troisième mois, et une vraie scène chaque trimestre. La théorie vient en jouant."}
            </p>
            {/* Une seule action pleine ; les cours restent un lien. */}
            <div style={{ display: "flex", gap: "clamp(14px,2vw,24px)", flexWrap: "wrap", alignItems: "center" }}>
              <CtaButton href={telHref} big>Réserver un cours d'essai</CtaButton>
              <a href="#services" style={{ fontSize: 13, color: C.ink, textDecoration: "none", borderBottom: `1px solid ${C.accent}`, paddingBottom: 3 }}>
                Les cours
              </a>
            </div>
          </motion.div>
        </div>

        {/* ── LE PROGRAMME — les six enseignements, mesure par mesure ────── */}
        <nav aria-label="Les cours" style={{ position: "relative", zIndex: 2, borderTop: `1px solid ${C.border}` }}>
          {SERVICES_DEMO.slice(0, 6).map((sv: any, n: number) => (
            <Reveal key={sv.titre ?? n} delay={0.5 + n * 0.05} y={10}>
              <a
                href="#services"
                className="i377-ligne"
                style={{ display: "grid", gridTemplateColumns: "clamp(28px,3.4vw,48px) minmax(0,1fr) auto", alignItems: "baseline", gap: "clamp(12px,2vw,26px)", padding: "clamp(9px,1.3vh,15px) 0", borderBottom: `1px solid ${C.border}`, textDecoration: "none", color: "inherit" }}
              >
                <span style={{ fontFamily: FONT, fontStyle: "italic", fontSize: 12, fontWeight: 600, color: C.accentDark, fontVariantNumeric: "tabular-nums" }}>
                  {String(n + 1).padStart(2, "0")}
                </span>
                <span style={{ fontFamily: FONT_TITRE, fontWeight: 700, fontSize: "clamp(17px,2vw,27px)", lineHeight: 1.16, letterSpacing: "-0.018em", color: C.ink }}>
                  {sv.titre}
                </span>
                <span className="i377-tag" style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textFaint, whiteSpace: "nowrap" }}>
                  {sv.tag ?? ""}
                </span>
              </a>
            </Reveal>
          ))}
        </nav>

        {/* Les chiffres, posés sur leur portée — la signature du thème. */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <Reveal delay={0.15}>
            <div style={{ position: "relative" }}>
              <Portee height={48} opacity={0.9} style={{ position: "absolute", left: 0, right: 0, top: "50%", transform: "translateY(-50%)" }} />
              <div className="i377-stats" style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 0 }}>
                {STATS.map((s, idx) => (
                  <div key={s.label} className="i377-statcell" style={{ padding: "clamp(10px,1.4vw,16px) clamp(12px,1.6vw,22px)", borderRight: idx < STATS.length - 1 ? `1px solid ${C.border}` : "none", background: "transparent" }}>
                    <div style={{ fontFamily: FONT_TITRE, fontWeight: 700, fontSize: "clamp(21px,2.3vw,30px)", letterSpacing: "-0.02em", color: C.accentDark, lineHeight: 1, background: C.bg, display: "inline-block", padding: "2px 6px 2px 0" }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 6, lineHeight: 1.45, background: C.bg, display: "inline-block", paddingRight: 6 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── RESPIRATION — une phrase penchée, seule ─────────────────────── */}
      <section style={{ background: C.bgAlt, padding: "clamp(72px,10vw,140px) clamp(24px,7vw,120px)", textAlign: "center" }}>
        <Reveal>
          <Kicker align="center" color={C.textFaint}>La maison</Kicker>
        </Reveal>
        <Reveal delay={0.1}>
          <p style={{ fontFamily: FONT, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(24px,3.4vw,44px)", lineHeight: 1.35, letterSpacing: "-0.01em", color: C.ink, maxWidth: 900, margin: "clamp(22px,3vw,34px) auto 0" }}>{/* TEXTE_SECTION */ clientText(sessionData, "hero.texte") ?? (<>
            La théorie vient <span style={{ color: C.accent, fontStyle: "normal", fontFamily: FONT_TITRE, fontWeight: 600 }}>en jouant</span>.
          </>)}</p>
        </Reveal>
        <Reveal delay={0.2}>
          <div aria-hidden style={{ width: 1, height: "clamp(52px,6vw,84px)", background: `linear-gradient(${C.accent}, transparent)`, margin: "clamp(30px,4vw,48px) auto 0" }} />
        </Reveal>
      </section>

      {/* ── COURS — rangées éditoriales graduées pp → ff ─────────────────── */}
      <section id="services" style={{ background: C.bg, padding: "clamp(84px,11vw,160px) clamp(24px,6vw,88px)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <Reveal>
            <Kicker>Cours</Kicker>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 style={{ fontFamily: FONT_TITRE, fontWeight: 700, fontSize: "clamp(30px,4.4vw,58px)", letterSpacing: "-0.02em", color: C.ink, lineHeight: 1.06, margin: "clamp(16px,2vw,24px) 0 clamp(12px,1.6vw,18px)" }}>{/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>
              Votre instrument, vos morceaux,<br /><em style={{ fontFamily: FONT, fontWeight: 400, color: C.accent }}>votre rythme.</em>
            </>)}</h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p style={{ fontSize: 15.5, color: C.textMuted, lineHeight: 1.75, maxWidth: 500, marginBottom: "clamp(36px,4.5vw,60px)" }}>
              Six pupitres, une même règle : la nuance monte rangée après rangée — du premier accord joué pianissimo au set complet, fortissimo, sur la scène du trimestre.
            </p>
          </Reveal>

          <div style={{ borderTop: `1px solid ${C.border}` }}>
            {SERVICES.map((s, idx) => {
              const survole = rangSurvole === idx;
              return (
                <Reveal key={s.titre} delay={idx * 0.05}>
                  <div
                    className="i377-rang"
                    onMouseEnter={() => setRangSurvole(idx)}
                    onMouseLeave={() => setRangSurvole(-1)}
                    style={{
                      position: "relative",
                      display: "grid",
                      gridTemplateColumns: "clamp(56px,7vw,96px) minmax(0,1fr) auto",
                      gap: "clamp(14px,2.4vw,36px)",
                      alignItems: "baseline",
                      padding: "clamp(20px,2.6vw,34px) clamp(8px,1.4vw,18px)",
                      borderBottom: `1px solid ${C.border}`,
                      background: survole ? C.bgCard : "transparent",
                      transform: survole ? "translateX(8px)" : "none",
                      boxShadow: survole
                        ? "0 2px 6px rgba(30,23,39,0.05), 0 24px 48px -28px rgba(109,40,168,0.35)"
                        : "none",
                      transition: "all .5s cubic-bezier(.16,1,.3,1)",
                      cursor: "default",
                    }}
                  >
                    {/* La nuance : pp → ff, le crescendo des rangées. */}
                    <div className="i377-rangnuance" style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span style={{ fontFamily: FONT_TITRE, fontWeight: 600, fontSize: 13, color: C.textFaint, letterSpacing: "0.08em" }}>{String(idx + 1).padStart(2, "0")}</span>
                      <span aria-hidden style={{ fontFamily: FONT, fontStyle: "italic", fontWeight: 500, fontSize: 15 + idx * 1.6, lineHeight: 1, color: survole ? C.accent : C.textFaint, transition: "color .45s cubic-bezier(.16,1,.3,1)" }}>{NUANCES[idx % NUANCES.length]}</span>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{ fontFamily: FONT_TITRE, fontWeight: 700, fontSize: "clamp(19px,2vw,26px)", letterSpacing: "-0.015em", color: C.ink, margin: "0 0 8px" }}>{s.titre}</h3>
                      <p style={{ fontSize: 14.5, color: C.textMuted, lineHeight: 1.72, maxWidth: 520, margin: 0 }}>{s.desc}</p>
                    </div>
                    <span style={{ alignSelf: "center", background: survole ? C.accent : C.accentLight, color: survole ? C.white : C.accentDark, borderRadius: 999, padding: "5px 14px", fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", whiteSpace: "nowrap", transition: "all .45s cubic-bezier(.16,1,.3,1)" }}>{s.tag}</span>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PÉDAGOGIE — quatre temps sous un soufflet de crescendo ───────── */}
      <section id="methode" style={{ position: "relative", background: C.bgDark, padding: "clamp(84px,11vw,160px) clamp(24px,6vw,88px)", overflow: "clip" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(52% 50% at 82% 12%, rgba(201,168,234,0.12), transparent 70%)", pointerEvents: "none" }} />
        <span aria-hidden style={{ position: "absolute", left: "-0.03em", bottom: "-0.16em", fontFamily: FONT_TITRE, fontWeight: 800, fontSize: "clamp(140px,22vw,320px)", lineHeight: 1, color: C.white, opacity: 0.04, pointerEvents: "none", userSelect: "none" }}>04</span>
        <div style={{ position: "relative", maxWidth: 1160, margin: "0 auto" }}>
          <Reveal>
            <Kicker color={C.neon}>La pédagogie</Kicker>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 style={{ fontFamily: FONT_TITRE, fontWeight: 700, fontSize: "clamp(30px,4.2vw,54px)", letterSpacing: "-0.02em", color: C.white, lineHeight: 1.06, margin: "clamp(16px,2vw,24px) 0 clamp(34px,4vw,52px)" }}>{/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (<>
              On apprend la musique<br /><em style={{ fontFamily: FONT, fontWeight: 300, color: C.neon }}>en la jouant fort.</em>
            </>)}</h2>
          </Reveal>

          {/* Le soufflet : un crescendo dessiné en deux filets qui s'écartent. */}
          <Reveal delay={0.12}>
            <div aria-hidden style={{ position: "relative", height: 34, marginBottom: "clamp(26px,3vw,40px)" }}>
              <span style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 1, background: `linear-gradient(90deg, rgba(201,168,234,0.65), rgba(201,168,234,0.15))`, transform: "rotate(-1.1deg)", transformOrigin: "left center" }} />
              <span style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 1, background: `linear-gradient(90deg, rgba(201,168,234,0.65), rgba(201,168,234,0.15))`, transform: "rotate(1.1deg)", transformOrigin: "left center" }} />
              <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", fontFamily: FONT, fontStyle: "italic", fontSize: 15, color: C.neon }}>ff</span>
              <span style={{ position: "absolute", left: 0, top: "50%", transform: "translate(-2px,-50%)", fontFamily: FONT, fontStyle: "italic", fontSize: 11, color: "rgba(201,168,234,0.6)" }}>pp</span>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: "clamp(16px,2vw,26px)" }}>
            {METHODE.map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.08}>
                <div style={{ position: "relative", borderTop: `1px solid rgba(255,255,255,${0.14 + idx * 0.08})`, padding: "clamp(18px,2.2vw,28px) 2px 0", height: "100%" }}>
                  <div style={{ fontFamily: FONT_TITRE, fontWeight: 700, fontSize: "clamp(24px,2.4vw,32px)", color: C.neon, marginBottom: 12, letterSpacing: "-0.02em" }}>{m.n}</div>
                  <h3 style={{ fontSize: 16.5, fontWeight: 700, color: C.white, marginBottom: 9, fontFamily: FONT }}>{m.t}</h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.62)", lineHeight: 1.72, margin: 0 }}>{m.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── LA SCÈNE DU TRIMESTRE — plein cadre, repli sombre obligatoire ── */}
      <section style={{ position: "relative", background: C.bgDark, overflow: "clip" }}>
        <div className="i377-scene" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.05fr) minmax(0,0.95fr)", minHeight: "min(76vh, 680px)" }}>
          <div style={{ position: "relative", background: C.bgDark, minHeight: 320 }}>
            {photo(0, PHOTO_SCENE) ? (
              <img src={photo(0, PHOTO_SCENE)} alt="La scène du trimestre — cours et concert" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : null}
            {/* Scrim à trois arrêts : la photo reste lisible, le texte aussi. */}
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(18,12,26,0.15) 0%, rgba(18,12,26,0.05) 45%, rgba(18,12,26,0.72) 100%)" }} />
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(18,12,26,0.6), transparent 40%)" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(48px,6vw,96px) clamp(24px,5vw,80px)", position: "relative" }}>
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(70% 60% at 30% 50%, rgba(109,40,168,0.12), transparent 75%)", pointerEvents: "none" }} />
            <Reveal>
              <Kicker color={C.neon}>La scène du trimestre</Kicker>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 style={{ fontFamily: FONT_TITRE, fontWeight: 700, fontSize: "clamp(28px,3.6vw,50px)", letterSpacing: "-0.02em", color: C.white, lineHeight: 1.06, margin: "clamp(16px,2vw,22px) 0 clamp(14px,1.8vw,20px)", position: "relative" }}>{/* TEXTE_SECTION */ clientText(sessionData, "scene.titre") ?? (<>
                Trois mois de travail,<br /><em style={{ fontFamily: FONT, fontWeight: 300, color: C.neon }}>un vrai concert.</em>
              </>)}</h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p style={{ fontSize: 15.5, color: "rgba(255,255,255,0.68)", lineHeight: 1.78, maxWidth: 480, margin: "0 0 clamp(26px,3vw,36px)", position: "relative" }}>
                La scène trimestrielle est incluse — son, lumières et trac compris. Un vrai concert, du vrai son, un public : l'objectif qui structure les trois mois.
              </p>
            </Reveal>
            {/* Le détail gratuit : un égaliseur qui respire, coupé si le
                visiteur préfère l'immobilité. */}
            <Reveal delay={0.24}>
              <div className="i377-eq" aria-hidden style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 44, position: "relative" }}>
                {[0.7, 0.4, 0.9, 0.55, 1, 0.45, 0.8, 0.35, 0.65, 0.95, 0.5, 0.75].map((amp, k) => (
                  <span
                    key={k}
                    style={{
                      display: "block",
                      width: 4,
                      height: `${amp * 100}%`,
                      borderRadius: 2,
                      transformOrigin: "bottom",
                      background: `linear-gradient(to top, ${C.accent}, ${C.neon})`,
                      animation: `i377-eq ${1.3 + (k % 5) * 0.22}s ease-in-out ${k * 0.09}s infinite`,
                    }}
                  />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENTS — panneau peint (sans photo obligée) + liste ─────── */}
      <section id="engagements" style={{ background: C.bgAlt, padding: "clamp(84px,11vw,160px) clamp(24px,6vw,88px)" }}>
        <div className="i377-split" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(36px,5.5vw,72px)", alignItems: "center" }}>
          <Reveal>
            {photo(1, "") ? (
              <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${C.border}`, aspectRatio: "4/3", background: C.bgDark }}>
                <img src={photo(1, "")} alt="Les studios de l'école" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            ) : (
              /* Repli peint : une cabine de studio — mousse, portée, micro. */
              <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", border: `1px solid ${C.border}`, aspectRatio: "4/3", background: `linear-gradient(150deg, ${C.bgDark} 0%, #241a31 55%, #2d2040 100%)` }}>
                <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1.6px)`, backgroundSize: "18px 18px" }} />
                <Portee height={60} opacity={0.35} color={C.neon} style={{ position: "absolute", left: 0, right: 0, top: "30%" }} />
                <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(48% 42% at 50% 42%, rgba(201,168,234,0.16), transparent 72%)" }} />
                <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                  <Mic2 size={72} color={C.neon} strokeWidth={1} />
                </div>
                <span style={{ position: "absolute", left: 18, bottom: 14, fontFamily: FONT, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>Studios insonorisés · backline fourni</span>
              </div>
            )}
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              <Kicker>L'école</Kicker>
              <h2 style={{ fontFamily: FONT_TITRE, fontWeight: 700, fontSize: "clamp(26px,3.2vw,44px)", letterSpacing: "-0.02em", color: C.ink, margin: "clamp(14px,1.8vw,20px) 0 clamp(20px,2.6vw,30px)", lineHeight: 1.08 }}>{/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (<>
                Exigeante sur le son,<br /><em style={{ fontFamily: FONT, fontWeight: 400, color: C.accent }}>détendue sur le reste.</em>
              </>)}</h2>
              {ENGAGEMENT.map((e, idx) => (
                <div key={idx} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                  <CheckCircle size={17} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.68 }}>{e}</span>
                </div>
              ))}
              <div style={{ marginTop: 26 }}>
                <CtaButton href={telHref}>Nous appeler</CtaButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TARIFS — table fine, filets et prix à droite ─────────────────── */}
      <section id="tarifs" style={{ background: C.bg, padding: "clamp(84px,11vw,160px) clamp(24px,6vw,88px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <Kicker align="center" color={C.textFaint}>Tarifs</Kicker>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 style={{ textAlign: "center", fontFamily: FONT_TITRE, fontWeight: 700, fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-0.02em", color: C.ink, lineHeight: 1.06, margin: "clamp(14px,1.8vw,22px) 0 14px" }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Au mois, <em style={{ fontFamily: FONT, fontWeight: 400, color: C.accent }}>sans engagement.</em></>)}</h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p style={{ textAlign: "center", fontSize: 15, color: C.textMuted, maxWidth: 520, margin: "0 auto clamp(34px,4vw,52px)", lineHeight: 1.72 }}>
              Tout est mensuel et sans engagement annuel. L'atelier de groupe et la scène trimestrielle sont inclus dès la formule standard.
            </p>
          </Reveal>
          <div style={{ borderTop: `1px solid ${C.border}` }}>
            {TARIFS.map((tt, idx) => {
              const survole = tarifSurvole === idx;
              return (
                <Reveal key={tt.a} delay={idx * 0.05}>
                  <div
                    className="i377-tarif"
                    onMouseEnter={() => setTarifSurvole(idx)}
                    onMouseLeave={() => setTarifSurvole(-1)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(0,1fr) auto",
                      gap: "clamp(10px,2vw,28px)",
                      alignItems: "baseline",
                      padding: "clamp(18px,2.4vw,28px) clamp(6px,1vw,14px)",
                      borderBottom: `1px solid ${C.border}`,
                      background: survole ? C.bgCard : "transparent",
                      boxShadow: survole ? "0 2px 6px rgba(30,23,39,0.05), 0 20px 40px -26px rgba(109,40,168,0.3)" : "none",
                      transition: "all .5s cubic-bezier(.16,1,.3,1)",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: FONT_TITRE, fontWeight: 600, fontSize: "clamp(16.5px,1.6vw,19px)", color: C.ink }}>{tt.a}</div>
                      <div style={{ fontSize: 13.5, color: C.textMuted, marginTop: 5, lineHeight: 1.6 }}>{tt.n}</div>
                    </div>
                    <div className="i377-tarifprix" style={{ fontFamily: FONT_TITRE, fontWeight: 700, fontSize: "clamp(17px,1.8vw,21px)", letterSpacing: "-0.01em", color: survole ? C.accent : C.accentDark, whiteSpace: "nowrap", transition: "color .45s cubic-bezier(.16,1,.3,1)" }}>{tt.p}</div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── AVIS — spotlight rotatif : une voix à la fois ────────────────── */}
      <section style={{ position: "relative", background: C.bgDark, padding: "clamp(84px,11vw,160px) clamp(24px,6vw,88px)", overflow: "clip" }}>
        <span aria-hidden style={{ position: "absolute", left: "clamp(8px,3vw,48px)", top: "clamp(8px,3vw,40px)", fontFamily: FONT_TITRE, fontWeight: 800, fontSize: "clamp(150px,24vw,340px)", lineHeight: 0.8, color: C.white, opacity: 0.04, pointerEvents: "none", userSelect: "none" }}>“</span>
        <div style={{ position: "relative", maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <h2 style={{ fontFamily: FONT_TITRE, fontWeight: 700, fontSize: "clamp(26px,3.6vw,46px)", letterSpacing: "-0.02em", color: C.white, marginBottom: "clamp(34px,4.5vw,56px)" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-7.titre") ?? (<>Ils jouent, <em style={{ fontFamily: FONT, fontWeight: 300, color: C.neon }}>enfin</em>.</>)}</h2>
          </Reveal>
          <div style={{ minHeight: "clamp(220px,26vw,280px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <motion.blockquote
              key={iAvis}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE }}
              style={{ margin: 0 }}
            >
              <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 18 }} aria-label="5 étoiles">
                {[...Array(5)].map((_, j) => <Star key={j} size={14} fill={C.neon} color={C.neon} strokeWidth={0} />)}
              </div>
              <p style={{ fontFamily: FONT, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(18px,2.3vw,28px)", color: "rgba(255,255,255,0.88)", lineHeight: 1.6, margin: "0 auto clamp(20px,2.6vw,30px)", maxWidth: 780 }}>
                «&nbsp;{A.texte}&nbsp;»
              </p>
              <div style={{ fontWeight: 700, color: C.white, fontSize: 15, fontFamily: FONT }}>{A.auteur}</div>
              <div style={{ color: C.neon, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 6 }}>{A.detail}</div>
            </motion.blockquote>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22, marginTop: "clamp(22px,3vw,34px)", color: "rgba(255,255,255,0.6)" }}>
            <SlideIndex i={iAvis} total={AVIS.length} variant="fraction" color="rgba(255,255,255,0.6)" className="" />
            <HairlineArrows onPrev={avisPrecedent} onNext={avisSuivant} color="rgba(255,255,255,0.85)" className="" />
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section id="contact" style={{ position: "relative", background: C.accentLight, padding: "clamp(84px,11vw,160px) clamp(24px,6vw,88px)", textAlign: "center", overflow: "clip" }}>
        <Portee height={56} opacity={0.55} color="rgba(109,40,168,0.25)" style={{ position: "absolute", left: 0, right: 0, top: "14%" }} />
        <Reveal>
          <Kicker align="center">Essayez</Kicker>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 style={{ fontFamily: FONT_TITRE, fontWeight: 700, fontSize: "clamp(30px,4.6vw,58px)", letterSpacing: "-0.02em", color: C.ink, lineHeight: 1.05, margin: "clamp(16px,2vw,24px) 0 clamp(14px,1.8vw,18px)" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
            30 minutes d'essai,<br /><em style={{ fontFamily: FONT, fontWeight: 400, color: C.accent }}>et vous saurez.</em>
          </>)}</h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 470, margin: "0 auto clamp(30px,4vw,44px)", lineHeight: 1.72 }}>
            Cours d'essai offert sur l'instrument de votre choix. Studios ouverts en semaine jusqu'à 21 h — venez après le travail.
          </p>
        </Reveal>
        <Reveal delay={0.22}>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <CtaButton href={telHref} big><Phone size={17} /> {phone}</CtaButton>
            <CtaButton href={`mailto:${mail}`} ghost big><Mail size={17} /> Nous écrire</CtaButton>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer style={{ background: C.bgDarkAlt, padding: "clamp(48px,6vw,80px) clamp(24px,6vw,88px) 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 36 }}>
            <div style={{ maxWidth: 380 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
                <Music4 size={16} color={C.neon} />
                <span style={{ fontFamily: FONT_TITRE, fontWeight: 700, fontSize: 18, color: C.white }}>{nom}</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 13, lineHeight: 1.75, margin: 0 }}>
                {clientTagline(sessionData) ?? (<>École de musiques actuelles · {ville}<br />Professeurs diplômés (DEM, MIMA) — scène trimestrielle</>)}
              </p>
              <Portee height={30} opacity={0.35} color="rgba(255,255,255,0.25)" style={{ marginTop: 22, maxWidth: 220 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {[
                { icon: <MapPin size={13} />, t: clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "69100", "Villeurbanne") },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Mail size={13} />, t: mail },
                { icon: <Clock size={13} />, t: "Lun–Ven 14h–21h · Mer & Sam 9h–19h" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.5)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.neon }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.28)", fontSize: 12 }}>
              © 2026 {nom} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />{/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ color: "rgba(255,255,255,0.28)", fontSize: 12 }}>Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
