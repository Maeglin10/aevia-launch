"use client";
// @ts-nocheck

/* ════════════════════════════════════════════════════════════════════════════
   IMPACT-361 — {clientName(sessionData) ?? "L'Atelier des Teintes"} · Peintre décorateur, Nîmes

   Geste signature   : WipeReveal — le panneau du héros se dévoile de gauche à
                       droite, exactement comme une passe de rouleau. Un seul
                       index (useSlides) pilote le panneau, sa légende, la
                       pastille de teinte et le compteur.
   Archétype héros   : H4 — éditorial décalé. Le titre XXL chevauche le panneau
                       de droite ; les chiffres sont intégrés au héros, en rail.
   Paire de fontes   : P7 — Lora (serif, voix) + Sora (sans, appareil).
   Signature visuelle: le nuancier. Une bande de teintes revient en pied de
                       panneau, en séparateur de section et en colonne des
                       engagements — c'est l'outil du métier, pas un ornement.

   Contenu : celui du thème, mot pour mot (prestations, chantier, engagements,
   tarifs, avis, chiffres). Rien n'a été inventé, rien n'a été supprimé.
   ════════════════════════════════════════════════════════════════════════════ */

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, Droplets, Mail, MapPin, Paintbrush, Palette, Phone, Star } from "lucide-react";
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

/* ── Jetons ───────────────────────────────────────────────────────────────── */
let C: Record<string, string> = {
  bg: "#fbf9fc",
  bgAlt: "#f2ecf6",
  bgDark: "#241a2e",
  bgDarkAlt: "#191122",
  bgCard: "#ffffff",
  accent: "var(--brand,#7b3fb3)",
  accentDark: "var(--brand-light,#5c2b88)",
  accentLight: "#ece0f5",
  ink: "#211a28",
  textMuted: "#655d6d",
  textFaint: "#9c93a6",
  border: "#e4dbec",
  white: "#ffffff",
  /* clé métier : la teinte claire du nuancier, celle des échantillons A2 */
  teinte: "#c9a9e4",
};

const SERIF = "'Lora', Georgia, 'Times New Roman', serif";
const SANS = "'Sora', system-ui, -apple-system, 'Segoe UI', sans-serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const NAV = [
  { l: "Finitions", h: "#services" },
  { l: "Le chantier", h: "#methode" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* ── Données de démonstration (contenu du thème, conservé mot pour mot) ───── */

function HERO_LIVE() {
  return [
    {
      k: "Terracotta de " + (clientCity(sessionData) ?? "Nîmes"),
      line: "La teinte qui réchauffe un salon plein nord.",
      sub: "Peinture minérale mate, échantillon posé avant.",
      chip: "accent",
    },
    {
      k: "Chaux ferrée",
      line: "L'enduit qui donne de la profondeur aux murs.",
      sub: "Salle de bain, crédence, pièce à vivre.",
      chip: "teinte",
    },
    {
      k: "Panoramique",
      line: "Le papier peint qui devient le tableau.",
      sub: "Pose au millimètre, raccords invisibles.",
      chip: "accentDark",
    },
  ];
}
let HERO = HERO_LIVE();

const SERVICES_SOURCE = [
  { titre: "Peinture intérieure", desc: "Murs, plafonds, boiseries : préparation soignée (rebouchage, ponçage, sous-couche), finitions mates profondes ou satinées lessivables.", tag: "Intérieur" },
  { titre: "Conseil couleur", desc: "Une décoratrice à domicile, des échantillons A4 posés sur VOS murs, regardés à VOTRE lumière — le nuancier ment, la lumière non.", tag: "Couleur" },
  { titre: "Enduits décoratifs", desc: "Chaux ferrée, tadelakt, béton ciré mural : les matières qui donnent aux murs une profondeur que la peinture seule n'a pas.", tag: "Matière" },
  { titre: "Papiers peints", desc: "Panoramiques, intissés, raccords complexes : posés au plomb et au millimètre. On répare aussi les catastrophes des week-ends de motivation.", tag: "Papier" },
  { titre: "Façades & extérieurs", desc: "Ravalement, chaux sur pierre, volets et ferronneries : la façade nîmoise traitée dans les règles, échafaudage déclaré compris.", tag: "Façade" },
  { titre: "Peintures saines", desc: "Gammes A+ faibles émissions, peintures dépolluantes pour chambres d'enfant, chantier ventilé et aspiré chaque soir.", tag: "Santé" },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE_SOURCE = [
  { n: "01", t: "Visite & devis en 48 h", d: "Surfaces mesurées, supports sondés, teintes discutées. Devis détaillé par pièce et par couche." },
  { n: "02", t: "Échantillons sur vos murs", d: "Deux ou trois teintes posées en A2, regardées matin et soir. On décide ensuite, pas avant." },
  { n: "03", t: "Protection totale", d: "Sols bâchés, meubles housés, prises démontées. Le chantier est aspiré chaque soir — vous vivez chez vous." },
  { n: "04", t: "Réception à la lumière", d: "Chaque mur inspecté en lumière rasante avec vous. Les reprises se font tout de suite, pas « la semaine prochaine »." },
];

const ENGAGEMENT_SOURCE = [
  "Garantie décennale et RC professionnelle — attestations jointes au devis",
  "Devis détaillé par pièce, par support et par couche : comparable ligne à ligne",
  "Chantier bâché, aspiré chaque soir, habitable pendant les travaux",
  "Peintures classées A+ par défaut, fiches techniques fournies",
];
let ENGAGEMENT = ENGAGEMENT_SOURCE;

const TARIFS_SOURCE = [
  { a: "Murs & plafonds (2 couches)", p: "28–38 €/m²", n: "Selon état du support, peinture A+ comprise." },
  { a: "Chaux ferrée / tadelakt", p: "dès 90 €/m²", n: "Matière, passes multiples et cire de finition comprises." },
  { a: "Pose papier peint panoramique", p: "dès 45 €/m²", n: "Lé simple dès 25 €/m², raccords complexes sur devis." },
  { a: "Conseil couleur à domicile", p: "120 €", n: "Une heure trente + planche de teintes, déduit si chantier." },
];
let TARIFS = TARIFS_SOURCE;

const AVIS_SOURCE = [
  { texte: "Le conseil couleur a tout changé : la teinte que j'avais choisie sur nuancier aurait été une erreur. Celle posée est parfaite du matin au soir. Chantier impeccable, appartement habitable tout du long.", auteur: "Émilie R.", detail: "Salon + conseil couleur" },
  { texte: "Chaux ferrée dans la salle de bain : une matière magnifique, des artisans qui aiment visiblement leur métier. La lumière rasante de la réception ne pardonne rien — il n'y avait rien à reprendre.", auteur: "Marc & Sofia", detail: "Enduits décoratifs" },
  { texte: "Panoramique de 4 lés posé sans un raccord visible dans la chambre. Ils ont même corrigé un mur pas droit à l'enduit avant. Du travail d'atelier.", auteur: "Julie C.", detail: "Papier peint panoramique" },
];
let AVIS = AVIS_SOURCE;

const STATS_SOURCE = [
  { value: "500+", label: "Pièces transformées" },
  { value: "48 h", label: "Devis après visite" },
  { value: "10 ans", label: "Garantie décennale" },
  { value: "A+", label: "Peintures faibles émissions" },
];
let STATS = STATS_SOURCE;

/* La seule photographie que porte ce thème. Les deux autres emplacements
   attendent celles du client : sans elles, le repli CSS tient la page. */
const PHOTO_REPLI = [
  "https://images.pexels.com/photos/1669754/pexels-photo-1669754.jpeg?auto=compress&cs=tinysrgb&w=1400",
  "",
  "",
];

function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ── Primitives ───────────────────────────────────────────────────────────── */

function Reveal({ children, delay = 0, y = 26, style }: { children: React.ReactNode; delay?: number; y?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -10% 0px" });
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

/** Kicker : filet de 40 px puis capitales très espacées. */
function Kicker({ children, tone = "accent", center = false }: { children: React.ReactNode; tone?: "accent" | "light"; center?: boolean }) {
  const col = tone === "light" ? "rgba(255,255,255,0.66)" : C.accentDark;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: center ? "center" : "flex-start" }}>
      <span aria-hidden style={{ width: 40, height: 1, background: col, opacity: 0.75, flexShrink: 0 }} />
      <span style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.36em", textTransform: "uppercase", fontWeight: 600, color: col }}>
        {children}
      </span>
      {center && <span aria-hidden style={{ width: 40, height: 1, background: col, opacity: 0.75, flexShrink: 0 }} />}
    </div>
  );
}

/** Filet dégradé de 1 px — le séparateur de toutes les sections claires. */
function Filet({ marge = "0" }: { marge?: string }) {
  return (
    <div
      aria-hidden
      style={{
        height: 1,
        margin: marge,
        background: `linear-gradient(90deg, transparent 0%, ${C.border} 18%, ${C.teinte} 50%, ${C.border} 82%, transparent 100%)`,
      }}
    />
  );
}

/**
 * Le nuancier — la signature du thème.
 *
 * Six pastilles de teinte prises dans les jetons de la page. Au survol, la
 * pastille s'élargit et sa légende apparaît : le détail gratuit du thème.
 */
function Nuancier({ chips, compact = false }: { chips: { c: string; l: string }[]; compact?: boolean }) {
  const [actif, setActif] = useState(-1);
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "stretch", width: "100%" }}>
      {chips.map((ch, n) => (
        <div
          key={ch.l + n}
          onMouseEnter={() => setActif(n)}
          onMouseLeave={() => setActif(-1)}
          style={{
            flex: actif === n ? 2.1 : 1,
            minWidth: 0,
            height: compact ? 12 : 78,
            background: ch.c,
            borderRadius: compact ? 2 : 4,
            position: "relative",
            overflow: "hidden",
            transition: "flex 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            boxShadow: actif === n ? "0 10px 26px rgba(36,26,46,0.20), 0 2px 6px rgba(36,26,46,0.14)" : "none",
            cursor: compact ? "default" : "pointer",
          }}
        >
          {!compact && (
            <span
              style={{
                position: "absolute",
                left: 9,
                bottom: 8,
                fontFamily: SANS,
                fontSize: 9.5,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: C.white,
                mixBlendMode: "difference",
                opacity: actif === n ? 1 : 0,
                transform: actif === n ? "translateY(0)" : "translateY(6px)",
                transition: "opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
                whiteSpace: "nowrap",
              }}
            >
              {ch.l}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/** Rangée éditoriale numérotée — le dessin des prestations. */
function ServiceRow({ s, idx }: { s: any; idx: number }) {
  const [h, setH] = useState(false);
  const num = String(idx + 1).padStart(2, "0");
  return (
    <Reveal delay={Math.min(idx, 4) * 0.055}>
      <div
        className="i361-row"
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "minmax(0,0.36fr) minmax(0,0.64fr)",
          gap: "clamp(18px, 3vw, 48px)",
          alignItems: "start",
          padding: "clamp(24px, 3.2vw, 40px) clamp(14px, 2vw, 28px)",
          background: h ? C.bgCard : "transparent",
          borderRadius: 4,
          transform: h ? "translateY(-4px)" : "translateY(0)",
          boxShadow: h ? "0 22px 48px rgba(36,26,46,0.10), 0 3px 10px rgba(36,26,46,0.06)" : "none",
          transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), background 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* chiffre fantôme */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            right: "clamp(8px, 2vw, 26px)",
            top: "-6%",
            fontFamily: SERIF,
            fontSize: "clamp(72px, 9vw, 132px)",
            lineHeight: 1,
            color: C.ink,
            opacity: h ? 0.09 : 0.055,
            pointerEvents: "none",
            userSelect: "none",
            transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {num}
        </span>
        <div style={{ minWidth: 0, position: "relative" }}>
          <span
            style={{
              fontFamily: SANS,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: h ? C.accent : C.textFaint,
              transition: "color 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {num} — {s.tag}
          </span>
          <h3
            style={{
              fontFamily: SERIF,
              fontWeight: 500,
              fontSize: "clamp(21px, 2.5vw, 30px)",
              lineHeight: 1.16,
              letterSpacing: "-0.01em",
              color: C.ink,
              margin: "12px 0 0",
            }}
          >
            {s.titre}
          </h3>
          <span
            aria-hidden
            style={{
              display: "block",
              height: 2,
              width: h ? 56 : 22,
              marginTop: 14,
              background: C.accent,
              transition: "width 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        </div>
        <p
          style={{
            fontFamily: SANS,
            fontWeight: 300,
            fontSize: "clamp(14.5px, 1.5vw, 16px)",
            lineHeight: 1.78,
            color: C.textMuted,
            maxWidth: 520,
            margin: 0,
            position: "relative",
          }}
        >
          {s.desc}
        </p>
      </div>
    </Reveal>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function AtelierTeintesPage() {
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
  HERO = HERO_LIVE();

  /* Blocs vivants : recalculés à chaque rendu, une fois la session affectée. */
  STATS = resolveList(clientStats(sessionData), STATS_SOURCE);
  ENGAGEMENT = resolveList(clientCertifications(sessionData) ?? clientList(sessionData, "engagements.liste"), ENGAGEMENT_SOURCE);
  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...SERVICES_SOURCE[i % SERVICES_SOURCE.length],
      titre: s.title || SERVICES_SOURCE[i % SERVICES_SOURCE.length].titre,
      desc: s.description || s.desc || SERVICES_SOURCE[i % SERVICES_SOURCE.length].desc,
    })),
    SERVICES_SOURCE,
  );
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...TARIFS_SOURCE[i % TARIFS_SOURCE.length],
      a: s.title || TARIFS_SOURCE[i % TARIFS_SOURCE.length].a,
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

  const SERVICES = SERVICES_DEMO;

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { i, next, prev } = useSlides(HERO.length, DWELL.normal);
  const S = HERO[i];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const nom = fd?.businessName ?? clientName(sessionData) ?? "L'Atelier des Teintes";
  const ville = clientCity(sessionData) ?? "Nîmes";
  const metier = clientTrade(sessionData) ?? "Peintre décorateur";
  const phone = clientPhone(sessionData) ?? "04 66 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? "+33466000000").replace(/[^+\d]/g, "")}`;
  const mail = clientEmail(sessionData) ?? "devis@atelier-des-teintes.fr";
  const adresse = clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "30000", "Nîmes");

  /* Le nuancier : les trois teintes nommées du héros, puis les tons de la
     maison. Les libellés viennent du contenu du thème, pas d'une invention. */
  const CHIPS = [
    { c: C.accentLight, l: HERO[0].k },
    { c: C.teinte, l: HERO[1].k },
    { c: C.accent, l: HERO[2].k },
    { c: C.accentDark, l: "Fond profond" },
    { c: C.bgAlt, l: "Blanc cassé" },
    { c: C.bgDark, l: "Encre" },
  ];

  const heroPhoto = photo(0, PHOTO_REPLI[0]);
  const bandePhoto = photo(1, PHOTO_REPLI[1]);
  const nuancierPhoto = photo(2, PHOTO_REPLI[2]);

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Sora:wght@200;300;400;500;600;700&display=swap');

        @media (max-width: 980px) { #i361-nav { display: none !important; } .i361-burger { display: flex !important; } }
        @media (max-width: 1080px) {
          .i361-over { width: 100% !important; }
          .i361-panel { transform: none !important; }
        }
        @media (max-width: 900px) {
          .i361-hero { grid-template-columns: minmax(0,1fr) !important; }
          .i361-split { grid-template-columns: minmax(0,1fr) !important; }
          .i361-split > * { order: initial !important; }
          .i361-row { grid-template-columns: minmax(0,1fr) !important; gap: 14px !important; }
          .i361-timeline { grid-template-columns: minmax(0,1fr) !important; }
          .i361-sticky { position: static !important; }
          .i361-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i361-avis > * { margin-top: 0 !important; }
        }
        @media (max-width: 620px) {
          .i361-tarif { grid-template-columns: minmax(0,1fr) !important; row-gap: 6px !important; }
          .i361-tarif .i361-prix { text-align: left !important; }
        }

        .i361-navlink { position: relative; }
        .i361-navlink::after {
          content: ""; position: absolute; left: 8px; bottom: 8px; height: 1.5px; width: 0;
          background: currentColor; transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .i361-navlink:hover::after { width: calc(100% - 16px); }
        .i361-fleche { transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .i361-cta:hover .i361-fleche { transform: translateX(5px); }

        @media (prefers-reduced-motion: reduce) {
          .i361-navlink::after, .i361-fleche { transition: none !important; }
        }
      `}</style>

      {/* ── NAV — collante sur quatre propriétés : hauteur, fond, flou, filet ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: scrolled ? 64 : 82,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(20px, 4vw, 52px)",
          background: scrolled ? "rgba(251,249,252,0.93)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={nom} style={{ height: 30, maxWidth: 168, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Paintbrush size={17} color={C.accent} style={{ flexShrink: 0 }} aria-hidden />
              <span style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 19.5, letterSpacing: "-0.005em", color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nom}</span>
              <span style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.26em", textTransform: "uppercase", color: C.textFaint, marginLeft: 8, whiteSpace: "nowrap" }}>{metier}</span>
            </>
          )}
        </div>
        <div id="i361-nav" style={{ display: "flex", gap: 2, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} className="i361-navlink" style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 400, color: C.textMuted, textDecoration: "none", padding: "12px 10px" }}>
              {l}
            </a>
          ))}
          <motion.a
            href={telHref}
            className="i361-cta"
            style={{ background: C.accentDark, color: C.white, borderRadius: 3, padding: "12px 22px", fontFamily: SANS, fontSize: 13, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap", marginLeft: 14, display: "inline-flex", alignItems: "center", gap: 8 }}
            whileHover={{ scale: 1.03, y: -1 }}
          >
            Devis gratuit <ArrowRight size={14} className="i361-fleche" aria-hidden />
          </motion.a>
        </div>
        <button
          className="i361-burger"
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
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 99, background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "18px 26px 24px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ fontFamily: SANS, color: C.ink, fontSize: 16, fontWeight: 400, textDecoration: "none", padding: "12px 0" }}>
              {l}
            </a>
          ))}
          <a href={telHref} style={{ background: C.accentDark, color: C.white, borderRadius: 3, padding: "14px 22px", fontFamily: SANS, fontSize: 15, fontWeight: 600, textDecoration: "none", textAlign: "center", marginTop: 10 }}>
            Devis gratuit
          </a>
        </div>
      )}

      {/* ── HÉROS H4 — le titre chevauche le panneau ; WipeReveal le dévoile ── */}
      <section
        className="i361-hero i361-pad"
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "minmax(0,1.06fr) minmax(0,0.94fr)",
          gap: "clamp(28px, 4vw, 64px)",
          alignItems: "center",
          minHeight: "100dvh",
          maxWidth: 1320,
          margin: "0 auto",
          padding: "clamp(126px, 16vh, 176px) clamp(24px, 5vw, 64px) clamp(56px, 8vh, 92px)",
        }}
      >
        {/* Glow radial : la lumière d'atelier, sans image. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "-12%",
            left: "-8%",
            width: "min(70vw, 780px)",
            height: "min(70vw, 780px)",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C.teinte} 0%, transparent 62%)`,
            opacity: 0.11,
            filter: "blur(28px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 3 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: EASE, delay: 0.12 }}>
            <Kicker>{clientEyebrow(sessionData) ?? `${metier} · ${ville}`}</Kicker>
          </motion.div>

          <motion.h1
            className="i361-over"
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.15, ease: EASE, delay: 0.24 }}
            style={{
              fontFamily: SERIF,
              fontWeight: 500,
              fontSize: "clamp(42px, 6.6vw, 88px)",
              lineHeight: 0.98,
              letterSpacing: "-0.022em",
              color: C.ink,
              margin: "clamp(22px, 3vw, 34px) 0 clamp(20px, 2.6vw, 30px)",
              width: "calc(100% + 15%)",
              position: "relative",
            }}
          >
            {/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ?? (
              <>
                <span style={{ display: "block" }}>{clientHeroLine(sessionData, 0, 2, 20) ?? "La couleur juste,"}</span>
                <em style={{ display: "block", fontStyle: "italic", color: C.accentDark }}>
                  {clientHeroLine(sessionData, 1, 2, 20) ?? "posée juste."}
                </em>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, ease: EASE, delay: 0.42 }}
            style={{ fontFamily: SANS, fontWeight: 300, fontSize: "clamp(15px, 1.6vw, 17px)", lineHeight: 1.78, color: C.textMuted, maxWidth: 486, margin: "0 0 clamp(26px, 3.4vw, 38px)" }}
          >
            {c?.heroSubline ?? clientHeroSubtitle(sessionData) ?? "Peintures dépolluantes, enduits à la chaux, papiers peints panoramiques : un atelier de peintres décorateurs qui prépare les murs comme on prépare une toile — parce que c'est pareil."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.56 }}
            style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}
          >
            <motion.a
              href={telHref}
              className="i361-cta"
              style={{ background: C.accentDark, color: C.white, borderRadius: 3, padding: "16px 30px", fontFamily: SANS, fontSize: 14.5, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              Demander un devis <ArrowRight size={16} className="i361-fleche" aria-hidden />
            </motion.a>
            <a
              href="#services"
              style={{ border: `1px solid ${C.border}`, background: C.bgCard, color: C.ink, borderRadius: 3, padding: "15px 26px", fontFamily: SANS, fontSize: 14.5, fontWeight: 500, textDecoration: "none" }}
            >
              Nos finitions
            </a>
          </motion.div>

          {/* Chiffres intégrés au héros — un rail fin, pas une bande sombre. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.78 }}
            style={{ marginTop: "clamp(38px, 5.5vh, 62px)", borderTop: `1px solid ${C.border}`, paddingTop: 22, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(128px, 100%), 1fr))", gap: "18px 10px" }}
          >
            {STATS.map((s: any) => (
              <div key={s.label} style={{ minWidth: 0 }}>
                <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(24px, 2.6vw, 32px)", lineHeight: 1, color: C.accentDark, letterSpacing: "-0.01em" }}>{s.value}</div>
                <div style={{ fontFamily: SANS, fontWeight: 300, fontSize: 12, lineHeight: 1.5, color: C.textFaint, marginTop: 7 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Le panneau — décalé vers le bas, sous le titre qui le chevauche. */}
        <div className="i361-panel" style={{ position: "relative", zIndex: 2, transform: "translateY(6%)" }}>
          <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden", boxShadow: "0 30px 70px rgba(36,26,46,0.14), 0 6px 16px rgba(36,26,46,0.06)" }}>
            <WipeReveal index={i} duration={0.95}>
              <div style={{ aspectRatio: "4/3", background: `linear-gradient(140deg, ${C.accentLight} 0%, ${C.teinte} 58%, ${C.accent} 100%)`, position: "relative", overflow: "hidden" }}>
                {heroPhoto ? (
                  <img src={heroPhoto} alt={`${nom} — ${S.k}`} loading="eager" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                  /* Repli sans image : la passe de rouleau, en CSS. */
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.16) 0 2px, transparent 2px 15px)",
                    }}
                  />
                )}
              </div>
            </WipeReveal>
            <div style={{ padding: "clamp(18px, 2.4vw, 26px) clamp(20px, 2.6vw, 28px) clamp(16px, 2vw, 22px)" }}>
              <WipeReveal index={i} duration={0.85} delay={0.06}>
                <div>
                  <div style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, letterSpacing: "0.32em", textTransform: "uppercase", color: C.accentDark, marginBottom: 10 }}>{S.k}</div>
                  <div style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(17px, 1.9vw, 21px)", lineHeight: 1.4, color: C.ink }}>{S.line}</div>
                  <div style={{ fontFamily: SANS, fontWeight: 300, fontSize: 13, lineHeight: 1.65, color: C.textMuted, marginTop: 10 }}>{S.sub}</div>
                </div>
              </WipeReveal>
            </div>
            {/* Pied de panneau : le nuancier, en filet. */}
            <div style={{ padding: "0 clamp(20px, 2.6vw, 28px) clamp(18px, 2.2vw, 24px)" }}>
              <Nuancier chips={CHIPS} compact />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 18, flexWrap: "wrap" }}>
            <SlideIndex i={i} total={HERO.length} variant="fraction" color={C.textFaint} className="" />
            <span style={{ fontFamily: SANS, fontWeight: 300, fontSize: 12.5, color: C.textMuted, flex: 1, minWidth: 140 }}>
              Passe {i + 1} sur {HERO.length}
            </span>
            <HairlineArrows onPrev={prev} onNext={next} color={C.ink} className="" />
          </div>
        </div>
      </section>

      {/* ── RESPIRATION — une phrase, en serif italique, rien d'autre ─────── */}
      <section className="i361-pad" style={{ background: C.bg, padding: "clamp(52px, 7vw, 92px) 64px clamp(30px, 4vw, 48px)", textAlign: "center" }}>
        <Reveal>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(20px, 2.7vw, 31px)", lineHeight: 1.5, letterSpacing: "-0.01em", color: C.textMuted, maxWidth: 720, margin: "0 auto" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (
              <>
                Le nuancier ment. <span style={{ color: C.ink }}>La lumière, non.</span>
              </>
            )}
          </p>
        </Reveal>
        <div style={{ maxWidth: 760, margin: "clamp(30px, 4vw, 46px) auto 0" }}>
          <Filet />
        </div>
      </section>

      {/* ── FINITIONS — rangées éditoriales numérotées ────────────────────── */}
      <section id="services" className="i361-pad" style={{ background: C.bg, padding: "clamp(28px, 4vw, 46px) clamp(24px, 5vw, 64px) clamp(78px, 9vw, 124px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(30px, 4vw, 52px)" }}>
              <Kicker>Finitions</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(30px, 4.2vw, 52px)", lineHeight: 1.06, letterSpacing: "-0.022em", color: C.ink, margin: "18px 0 0", maxWidth: 760 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                  <>
                    Des murs qui font
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accentDark }}>tout l'intérieur.</em>
                  </>
                )}
              </h2>
            </div>
          </Reveal>
          <div>
            {SERVICES.map((s: any, idx: number) => (
              <React.Fragment key={s.titre + idx}>
                {idx > 0 && <Filet marge="0 clamp(14px, 2vw, 28px)" />}
                <ServiceRow s={s} idx={idx} />
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── LE CHANTIER — timeline filetée, quatre temps ──────────────────── */}
      <section id="methode" className="i361-pad" style={{ background: C.bgAlt, padding: "clamp(78px, 9vw, 124px) clamp(24px, 5vw, 64px)", position: "relative", overflow: "hidden" }}>
        {/* Chiffre fantôme : les 80 % de préparation. */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            right: "-2vw",
            top: "4vh",
            fontFamily: SERIF,
            fontSize: "clamp(140px, 26vw, 380px)",
            lineHeight: 0.8,
            color: C.ink,
            opacity: 0.045,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          80
        </span>
        <div className="i361-timeline" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,0.9fr) minmax(0,1.1fr)", gap: "clamp(32px, 5vw, 76px)", alignItems: "start", position: "relative" }}>
          <div className="i361-sticky" style={{ position: "sticky", top: 118 }}>
            <Reveal>
              <Kicker>Le chantier</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(28px, 3.8vw, 46px)", lineHeight: 1.06, letterSpacing: "-0.02em", color: C.ink, margin: "18px 0 20px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                  <>
                    80 % de préparation,
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accentDark }}>20 % de peinture.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 15, lineHeight: 1.78, color: C.textMuted, maxWidth: 420, margin: 0 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "methode.intro") ?? (
                  <>Quatre temps, dans cet ordre, sur chaque chantier — de la visite à la réception en lumière rasante.</>
                )}
              </p>
              <div style={{ marginTop: 30, maxWidth: 320 }}>
                <Nuancier chips={CHIPS.slice(0, 4)} />
              </div>
            </Reveal>
          </div>

          <div style={{ position: "relative" }}>
            {/* Le fil du chantier : un filet vertical pointillé. */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: 15,
                top: 10,
                bottom: 10,
                width: 1,
                backgroundImage: `linear-gradient(${C.accent} 45%, transparent 0%)`,
                backgroundSize: "1px 9px",
                backgroundRepeat: "repeat-y",
                opacity: 0.45,
              }}
            />
            {resolveList(fusionnerEtapes(METHODE_SOURCE, clientMethode(sessionData)), METHODE_SOURCE).map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.055}>
                <div style={{ display: "flex", gap: "clamp(16px, 2.4vw, 26px)", padding: "0 0 clamp(28px, 3.6vw, 42px)", position: "relative" }}>
                  <span
                    style={{
                      flexShrink: 0,
                      width: 31,
                      height: 31,
                      borderRadius: "50%",
                      background: C.bg,
                      border: `1px solid ${C.accent}`,
                      display: "grid",
                      placeItems: "center",
                      fontFamily: SANS,
                      fontSize: 10.5,
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      color: C.accentDark,
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {m.n}
                  </span>
                  <div style={{ minWidth: 0, paddingTop: 3 }}>
                    <h3 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(18px, 2vw, 22px)", lineHeight: 1.24, color: C.ink, margin: "0 0 9px" }}>{m.t}</h3>
                    <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 14.5, lineHeight: 1.76, color: C.textMuted, maxWidth: 500, margin: 0 }}>{m.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BANDE DE CHANTIER — plein cadre, repli sombre obligatoire ─────── */}
      <section
        aria-hidden={!bandePhoto}
        style={{
          position: "relative",
          background: C.bgDark,
          minHeight: "clamp(220px, 34vw, 400px)",
          overflow: "hidden",
          display: "grid",
          placeItems: "center",
        }}
      >
        {bandePhoto ? (
          <img src={bandePhoto} alt="Chantier de peinture en cours" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(115deg, ${C.bgDarkAlt} 0%, ${C.bgDark} 42%, ${C.accentDark} 100%)`,
            }}
          />
        )}
        {/* Scrim à trois arrêts : le texte reste lisible avec ou sans photo. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(25,17,34,0.72) 0%, rgba(25,17,34,0.42) 46%, rgba(25,17,34,0.86) 100%)",
          }}
        />
        <div style={{ position: "relative", textAlign: "center", padding: "clamp(48px, 7vw, 84px) clamp(24px, 5vw, 64px)", maxWidth: 820 }}>
          <Reveal>
            <Kicker tone="light" center>
              Lumière rasante
            </Kicker>
            <p style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(21px, 3vw, 34px)", lineHeight: 1.42, color: C.white, margin: "20px 0 0" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "bande.phrase") ?? (
                <>Chaque mur inspecté avec vous, à la lampe rasante. Les reprises se font tout de suite.</>
              )}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── NUANCIER & ENGAGEMENTS ────────────────────────────────────────── */}
      <section id="engagements" className="i361-pad" style={{ background: C.bg, padding: "clamp(78px, 9vw, 124px) clamp(24px, 5vw, 64px)" }}>
        <div className="i361-split" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,0.86fr) minmax(0,1.14fr)", gap: "clamp(32px, 5vw, 72px)", alignItems: "center" }}>
          <Reveal>
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 6, background: C.bgCard, padding: "clamp(20px, 2.6vw, 28px)", boxShadow: "0 18px 46px rgba(36,26,46,0.07)" }}>
              <div style={{ aspectRatio: "5/4", borderRadius: 4, overflow: "hidden", background: `linear-gradient(150deg, ${C.accentLight} 0%, ${C.teinte} 100%)`, position: "relative", display: "grid", placeItems: "center" }}>
                {nuancierPhoto ? (
                  <img src={nuancierPhoto} alt="Échantillons de teintes posés sur le mur" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                  <>
                    <div
                      aria-hidden
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `repeating-linear-gradient(45deg, ${C.white}22 0 10px, transparent 10px 20px)`,
                      }}
                    />
                    <Palette size={74} color={C.accentDark} strokeWidth={1} aria-hidden style={{ position: "relative", opacity: 0.75 }} />
                  </>
                )}
              </div>
              <div style={{ marginTop: 18 }}>
                <Nuancier chips={CHIPS} />
              </div>
              <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 12, lineHeight: 1.65, color: C.textFaint, margin: "14px 0 0" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "nuancier.legende") ?? (
                  <>Les teintes de la maison — survolez une pastille pour la nommer.</>
                )}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              <Kicker>Nos engagements</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(27px, 3.4vw, 42px)", lineHeight: 1.08, letterSpacing: "-0.02em", color: C.ink, margin: "18px 0 26px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>
                    Propre pendant,
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accentDark }}>parfait après.</em>
                  </>
                )}
              </h2>
              {ENGAGEMENT.map((e: string, idx: number) => (
                <div key={idx} style={{ display: "flex", gap: 13, padding: "13px 0", borderBottom: idx < ENGAGEMENT.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <CheckCircle size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} aria-hidden />
                  <span style={{ fontFamily: SANS, fontWeight: 300, fontSize: 14.5, lineHeight: 1.7, color: C.textMuted }}>{e}</span>
                </div>
              ))}
              <motion.a
                href={telHref}
                className="i361-cta"
                style={{ display: "inline-flex", alignItems: "center", gap: 9, marginTop: 26, background: C.accentDark, color: C.white, borderRadius: 3, padding: "15px 28px", fontFamily: SANS, fontSize: 14.5, fontWeight: 600, textDecoration: "none" }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                Nous appeler <ArrowRight size={16} className="i361-fleche" aria-hidden />
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TARIFS — table fine, conduite de points ───────────────────────── */}
      <section id="tarifs" className="i361-pad" style={{ background: C.bgAlt, padding: "clamp(78px, 9vw, 124px) clamp(24px, 5vw, 64px)" }}>
        <div style={{ maxWidth: 940, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "clamp(26px, 3.4vw, 42px)" }}>
              <Kicker center>Tarifs</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(28px, 3.8vw, 46px)", lineHeight: 1.08, letterSpacing: "-0.02em", color: C.ink, margin: "18px 0 0" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                  <>
                    Au m², préparation <em style={{ fontStyle: "italic", color: C.accentDark }}>comprise.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 15, lineHeight: 1.76, color: C.textMuted, maxWidth: 560, margin: "16px auto 0" }}>
                Les prix incluent la préparation des supports (rebouchage, ponçage, sous-couche) — c'est elle qui fait la différence dans trois ans.
              </p>
            </div>
          </Reveal>
          <div style={{ borderTop: `1px solid ${C.border}` }}>
            {TARIFS.map((t: any, idx: number) => (
              <Reveal key={t.a + idx} delay={Math.min(idx, 4) * 0.05}>
                <div
                  className="i361-tarif"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0,1fr) auto",
                    gap: "6px 24px",
                    alignItems: "baseline",
                    padding: "clamp(18px, 2.4vw, 26px) 4px",
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(17px, 1.9vw, 21px)", lineHeight: 1.3, color: C.ink }}>{t.a}</div>
                    <div style={{ fontFamily: SANS, fontWeight: 300, fontSize: 13.5, lineHeight: 1.68, color: C.textMuted, marginTop: 7, maxWidth: 560 }}>{t.n}</div>
                  </div>
                  <div className="i361-prix" style={{ fontFamily: SANS, fontWeight: 600, fontSize: "clamp(15px, 1.7vw, 18px)", color: C.accentDark, whiteSpace: "nowrap", textAlign: "right", letterSpacing: "0.01em" }}>
                    {t.p}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVIS — colonnes décalées, sur fond profond ────────────────────── */}
      <section className="i361-pad" style={{ background: C.bgDark, padding: "clamp(78px, 9.5vw, 128px) clamp(24px, 5vw, 64px)", position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            top: "-18%",
            width: "min(80vw, 900px)",
            height: "min(80vw, 900px)",
            transform: "translateX(-50%)",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C.accent} 0%, transparent 66%)`,
            opacity: 0.1,
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "clamp(34px, 4.4vw, 56px)" }}>
              <Kicker tone="light" center>
                Ils ont vu la lumière changer
              </Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(27px, 3.6vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: C.white, margin: "18px 0 0" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                  <>
                    Des intérieurs <em style={{ fontStyle: "italic", color: C.teinte }}>rendus vivants</em>.
                  </>
                )}
              </h2>
            </div>
          </Reveal>
          <div className="i361-avis" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "clamp(16px, 2vw, 26px)", alignItems: "start" }}>
            {AVIS.map((a: any, idx: number) => (
              <Reveal key={a.auteur + idx} delay={idx * 0.09} style={{ marginTop: idx % 2 === 1 ? "clamp(18px, 3vw, 44px)" : 0 }}>
                <div style={{ background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 5, padding: "clamp(22px, 2.6vw, 30px)", height: "100%" }}>
                  <div style={{ display: "flex", gap: 3, marginBottom: 16 }} aria-hidden>
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={12} fill={C.teinte} color={C.teinte} />
                    ))}
                  </div>
                  <p style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(15px, 1.6vw, 16.5px)", lineHeight: 1.72, color: "rgba(255,255,255,0.84)", margin: "0 0 20px" }}>
                    « {a.texte} »
                  </p>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.10)", paddingTop: 14 }}>
                    <div style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 600, color: C.white }}>{a.auteur}</div>
                    <div style={{ fontFamily: SANS, fontWeight: 300, fontSize: 12, color: C.teinte, marginTop: 5 }}>{a.detail}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────────────────────── */}
      <section id="contact" className="i361-pad" style={{ background: C.accentLight, padding: "clamp(78px, 9vw, 124px) clamp(24px, 5vw, 64px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: "-1vw",
            bottom: "-4vh",
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: "clamp(120px, 22vw, 300px)",
            lineHeight: 0.8,
            color: C.accentDark,
            opacity: 0.06,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          A+
        </span>
        <Reveal>
          <div style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}>
            <Kicker center>Devis gratuit</Kicker>
            <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(29px, 4.2vw, 50px)", lineHeight: 1.06, letterSpacing: "-0.022em", color: C.ink, margin: "20px 0 18px" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                <>
                  Vos murs ont du potentiel.
                  <br />
                  <em style={{ fontStyle: "italic", color: C.accentDark }}>Venez le voir en couleur.</em>
                </>
              )}
            </h2>
            <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 16, lineHeight: 1.76, color: C.textMuted, maxWidth: 480, margin: "0 auto clamp(28px, 4vw, 40px)" }}>
              Visite et devis gratuits à {ville} et alentours. Conseil couleur à domicile, déduit si le chantier se fait.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <motion.a
                href={telHref}
                style={{ background: C.accentDark, color: C.white, borderRadius: 3, padding: "17px 34px", fontFamily: SANS, fontSize: 15.5, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}
                whileHover={{ scale: 1.03, y: -2 }}
              >
                <Phone size={17} aria-hidden /> {phone}
              </motion.a>
              <motion.a
                href={`mailto:${mail}`}
                style={{ background: "transparent", color: C.ink, border: `1.5px solid ${C.accentDark}`, borderRadius: 3, padding: "16px 30px", fontFamily: SANS, fontSize: 15.5, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <Mail size={17} aria-hidden /> Nous écrire
              </motion.a>
            </div>
            <div style={{ display: "flex", gap: "10px 28px", justifyContent: "center", flexWrap: "wrap", marginTop: 30 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: SANS, fontWeight: 300, fontSize: 13, color: C.textMuted }}>
                <MapPin size={13} color={C.accentDark} aria-hidden /> {adresse}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: SANS, fontWeight: 300, fontSize: 13, color: C.textMuted }}>
                <Clock size={13} color={C.accentDark} aria-hidden /> Lun–Ven 8h–18h30
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: SANS, fontWeight: 300, fontSize: 13, color: C.textMuted }}>
                <Droplets size={13} color={C.accentDark} aria-hidden /> Peintures classées A+
              </span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="i361-pad" style={{ background: C.bgDarkAlt, padding: "clamp(48px, 6vw, 72px) clamp(24px, 5vw, 64px) 26px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ marginBottom: 30 }}>
            <Nuancier chips={CHIPS} compact />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 30, marginBottom: 32 }}>
            <div style={{ minWidth: 240 }}>
              <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 20, color: C.teinte, marginBottom: 10 }}>{nom}</div>
              <p style={{ fontFamily: SANS, fontWeight: 300, color: "rgba(255,255,255,0.40)", fontSize: 13, lineHeight: 1.75, margin: 0 }}>
                Peinture & décoration · {ville}
                <br />
                Garantie décennale, applicateur agréé enduits à la chaux
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {[
                { icon: <MapPin size={13} aria-hidden />, t: adresse },
                { icon: <Phone size={13} aria-hidden />, t: phone },
                { icon: <Mail size={13} aria-hidden />, t: mail },
                { icon: <Clock size={13} aria-hidden />, t: "Lun–Ven 8h–18h30" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.44)", fontFamily: SANS, fontWeight: 300, fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.teinte, display: "inline-flex" }}>{item.icon}</span>
                  {item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontFamily: SANS, fontWeight: 300, color: "rgba(255,255,255,0.26)", fontSize: 12 }}>
              © 2026 {nom} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
              {/* VILLE_PIED */}
              {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ fontFamily: SANS, fontWeight: 300, color: "rgba(255,255,255,0.26)", fontSize: 12 }}>
              Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
