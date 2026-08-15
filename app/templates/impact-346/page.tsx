"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
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
   LA HALLE AUX FROMAGES — Fromagerie-crèmerie affineur · Chambéry.
   Réécriture premium (reprise 316–383, famille II).

   Geste signature : MosaicPush — l'étal qui arrive rayon par rayon, chaque
   tuile poussée depuis la gauche à 55 ms d'écart, l'ancienne chassée par la
   droite. Monté sur un bento de tuiles INÉGALES : une grande pièce, une haute,
   deux petites — le dessin d'un plateau de fromages, pas d'une grille.

   Héros H8 (bento). Fontes P4 : Fraunces (display, opsz variable) + Inter.
   Palette claire #fdf9ef / accent #c78a1e.

   Écarts assumés au squelette standard :
   - pas de bande de chiffres sombre : les chiffres vivent DANS le héros, en
     rangée filetée sous les boutons ;
   - l'étal (prestations) est un bento inégal, pas une grille de cartes égales ;
   - les plateaux (tarifs) sont des étiquettes de fromager perforées ;
   - la cave (méthode) est une frise horizontale à filet dégradé ;
   - les avis passent en spotlight : un seul témoignage tenu à la fois.
   ════════════════════════════════════════════════════════════════════════════ */

let C: Record<string, string> = {
  bg: "#fdf9ef",
  bgAlt: "#f6efdf",
  bgDark: "#1f1a10",
  bgDarkAlt: "#151107",
  bgCard: "#ffffff",
  accent: "var(--brand,#c78a1e)",
  accentDark: "var(--brand-light,#8f6111)",
  accentLight: "#f7ecd4",
  ink: "#221c11",
  textMuted: "#6b6150",
  textFaint: "#9d9079",
  border: "#e6dbc2",
  borderSoft: "#f0e7d4",
  white: "#ffffff",
  croute: "#d9b96a",
};

const DISPLAY = "'Fraunces', Georgia, 'Times New Roman', serif";
const BODY = "'Inter', system-ui, -apple-system, sans-serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const NAV = [
  { l: "L'étal", h: "#services" },
  { l: "Plateaux", h: "#tarifs" },
  { l: "L'affinage", h: "#methode" },
  { l: "Nos fermes", h: "#engagements" },
  { l: "Contact", h: "#contact" },
];

/* ── Données de démonstration (contenu du thème, conservé mot pour mot) ───── */

const HERO_SOURCE = [
  {
    k: "Pâtes pressées",
    sub: "Les fromages d'alpage, cœur de la cave.",
    tiles: [
      { icon: Mountain, t: "Beaufort d'alpage", d: "Été 2024, chalet d'Arêches — 14 mois de cave.", ton: "accent" },
      { icon: Milk, t: "Comté 24 mois", d: "Fruité, sélectionné meule par meule dans le Jura.", ton: "sombre" },
      { icon: Clock3, t: "Abondance fermière", d: "AOP, la tomme des savoyards du dimanche.", ton: "clair" },
    ],
  },
  {
    k: "Chèvres & brebis",
    sub: "Le plateau qui change avec l'herbe.",
    tiles: [
      { icon: Milk, t: "Chevrotins AOP", d: "Fermiers, affinés doux — la saison court d'avril à novembre.", ton: "clair" },
      { icon: Mountain, t: "Persillé de Tignes", d: "Rare, raide, magnifique. Pour ceux qui savent.", ton: "accent" },
      { icon: Clock3, t: "Brebis des Bauges", d: "Tomme douce de printemps, croûte naturelle.", ton: "sombre" },
    ],
  },
  {
    k: "Crèmerie",
    sub: "Le lait dans tous ses états, en direct des fermes.",
    tiles: [
      { icon: Milk, t: "Beurre baratté cru", d: "Baratte du mercredi, motte coupée au fil devant vous.", ton: "sombre" },
      { icon: Clock3, t: "Crème crue de Savoie", d: "Épaisse à la cuillère, la vraie, en pot consigné.", ton: "accent" },
      { icon: Mountain, t: "Yaourts fermiers", d: "Lait entier du Granier, huit parfums, pots en verre.", ton: "clair" },
    ],
  },
];
let HERO = HERO_SOURCE;

/* La grande tuile du bento annonce ce que le client vend dès qu'il l'a saisi :
   le geste reste celui du thème, le fromage nommé devient le sien. */
function HERO_LIVE() {
  const presta = clientServices(sessionData);
  if (!presta || presta.length === 0) return HERO_SOURCE;
  return HERO_SOURCE.map((s, i) => ({
    ...s,
    k: presta[i % presta.length]?.title || s.k,
    tiles: s.tiles.map((t, n) => {
      const p = presta[(i * s.tiles.length + n) % presta.length];
      return { ...t, t: p?.title || t.t, d: p?.description || p?.desc || t.d };
    }),
  }));
}

const SERVICES_SOURCE = [
  { titre: "Fromages d'alpage", desc: "Beaufort, Abondance, Comté : sélectionnés meule par meule, affinés en cave jusqu'à leur pic — pas jusqu'à la date limite.", tag: "Alpage", icon: Mountain, n: "01" },
  { titre: "Chèvres et brebis", desc: "Fermiers de Savoie et d'ailleurs, au rythme des saisons de lactation. On vous dit quand c'est le moment, et quand ce ne l'est plus.", tag: "Saison", icon: Clock3, n: "02" },
  { titre: "Crèmerie crue", desc: "Beurre baratté sur place le mercredi, crème crue, faisselles et yaourts fermiers en pots consignés.", tag: "Crèmerie", icon: Milk, n: "03" },
  { titre: "Plateaux composés", desc: "Pour 4 à 40 personnes : équilibrés par famille et par force, étiquetés, avec l'ordre de dégustation conseillé.", tag: "Plateaux", icon: Milk, n: "04" },
  { titre: "Raclette & fondue", desc: "Machines prêtées, fromages coupés à la roue, mélange fondue de la maison pesé au gramme. La Savoie sans vaisselle cassée.", tag: "Savoie", icon: Mountain, n: "05" },
  { titre: "Accords & cave", desc: "Vins de Savoie et jurassiens choisis pour l'étal : on compose l'accord avec le plateau, au verre près.", tag: "Accords", icon: Clock3, n: "06" },
];
let SERVICES_DEMO = SERVICES_SOURCE;

/* Le bento de l'étal : une grande pièce, deux petites, une longue. Les tailles
   se répètent au-delà de six entrées — un plateau ne se remplit pas en carré. */
const ETAL_SPANS = [2, 1, 1, 2, 1, 2];

const METHODE_SOURCE = [
  { n: "01", t: "Acheter jeune, aux fermes", d: "Quatorze fermes partenaires. Les fromages arrivent jeunes, à leur meilleur potentiel." },
  { n: "02", t: "Affiner en cave voûtée", d: "Brossage, retournes, frottage au vin blanc pour certains : chaque famille a son geste et son hygrométrie." },
  { n: "03", t: "Goûter chaque semaine", d: "On sonde, on goûte, on décide : à l'étal cette semaine, ou encore quinze jours de cave." },
  { n: "04", t: "Vendre au bon moment", d: "Un fromage se vend à son pic. S'il l'a passé, il finit en fondue maison — jamais sur l'étal." },
];
let METHODE = METHODE_SOURCE;

/* La première étape parle des fermes sans dire d'où : la ville du client la
   rend vraie chez lui, sans rien inventer d'autre. */
function METHODE_LIVE() {
  const ville = clientCity(sessionData);
  if (!ville) return METHODE_SOURCE;
  return METHODE_SOURCE.map((m, i) => (i === 0 ? { ...m, d: `${m.d} Toutes livrent l'étal de ${ville}.` } : m));
}

const ENGAGEMENT_SOURCE = [
  "Achat en direct aux fermes, prix rémunérateurs négociés à l'année",
  "Lait cru défendu et expliqué — femmes enceintes conseillées sans détour",
  "Cave d'affinage sur place, visite le samedi matin sur simple demande",
  "Étiquetage complet : ferme, lait, affinage — pas seulement « fromage de montagne »",
];
let ENGAGEMENT = ENGAGEMENT_SOURCE;

const TARIFS_SOURCE = [
  { a: "Plateau découverte (4-6 pers.)", p: "34 €", n: "Cinq fromages, cinq familles, fiche de dégustation incluse." },
  { a: "Plateau grande tablée (10-12 pers.)", p: "72 €", n: "Huit fromages dont un d'exception, pain aux noix offert." },
  { a: "Kit raclette complet (par pers.)", p: "8,90 €", n: "Trois fromages à racler, machine prêtée, charcuterie en option." },
  { a: "Mélange fondue de la maison", p: "24,90 €/kg", n: "Beaufort, Comté, Emmental de Savoie — proportions secrètes, résultat garanti." },
];
let TARIFS = TARIFS_SOURCE;

const AVIS_SOURCE = [
  { texte: "Le Beaufort d'alpage vendu ici n'a rien à voir avec ce que j'achetais avant. On m'a expliqué le chalet, l'été, la cave. On goûte tout avant d'acheter.", auteur: "Claire N.", detail: "Cliente du samedi" },
  { texte: "Plateau de mariage pour 80 : livré à l'heure, magnifique, avec les étiquettes et l'ordre de dégustation. Les invités en parlent encore.", auteur: "Élise & Romain", detail: "Plateau événement" },
  { texte: "Ils m'ont déconseillé un chèvre « pas à son mieux cette semaine » et fait goûter autre chose. Des commerçants qui refusent de vendre : rare.", auteur: "Marc T.", detail: "Habitué du mercredi" },
];
let AVIS = AVIS_SOURCE;

const STATS_SOURCE = [
  { value: "120+", label: "Fromages à l'étal" },
  { value: "9", label: "AOP de Savoie et d'ailleurs" },
  { value: "14", label: "Fermes en direct" },
  { value: "1", label: "Cave voûtée d'affinage" },
];
let STATS = STATS_SOURCE;

const COMMANDE_SOURCE = [
  "Commande la veille avant 17 h pour un plateau",
  "Tout se goûte à l'étal avant d'être pesé",
  "Machines à raclette prêtées sur réservation",
];
let COMMANDE = COMMANDE_SOURCE;

/* URL photo du thème — conservée telle quelle. Les autres emplacements
   attendent celles du client : sans image, le repli dessiné tient la page. */
const PHOTO_FALLBACK = [
  "https://images.pexels.com/photos/16214484/pexels-photo-16214484.jpeg?auto=compress&cs=tinysrgb&w=1400",
  "",
  "",
];

// Photo du client à cet emplacement, repli sur celle du thème quand il y en a.
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
function Kicker({ children, tone = "faint", center = false }: { children: React.ReactNode; tone?: "faint" | "accent" | "clair"; center?: boolean }) {
  const col = tone === "accent" ? C.accentDark : tone === "clair" ? C.croute : C.textFaint;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: center ? "center" : "flex-start", color: col }}>
      <span aria-hidden style={{ width: 40, height: 1, background: "currentColor", opacity: 0.8, flexShrink: 0 }} />
      <span style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.34em", textTransform: "uppercase", color: "currentColor" }}>
        {children}
      </span>
      {center && <span aria-hidden style={{ width: 40, height: 1, background: "currentColor", opacity: 0.8, flexShrink: 0 }} />}
    </div>
  );
}

/**
 * Surface photographique avec repli dessiné.
 *
 * Sans image — proxy bloqué ou client qui n'en fournit pas — la boîte tient
 * seule : aplat de croûte, stries de brossage en CSS, halo tiède, et le tracé
 * au trait d'une meule entamée.
 */
function Plate({ src, alt, ratio = "4/3", label }: { src: string; alt: string; ratio?: string; label?: string }) {
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: ratio,
        background: C.accentLight,
        overflow: "hidden",
        borderRadius: 3,
        boxShadow: `inset 0 0 0 1px ${C.border}`,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.55,
          backgroundImage: `repeating-linear-gradient(118deg, ${C.croute}22 0 1px, transparent 1px 10px)`,
        }}
      />
      <div
        aria-hidden
        style={{ position: "absolute", inset: 0, background: `radial-gradient(88% 70% at 28% 18%, ${C.accent} 0%, transparent 72%)`, opacity: 0.12 }}
      />
      {!src && (
        <svg aria-hidden viewBox="0 0 120 120" style={{ position: "absolute", left: "50%", top: "50%", width: "40%", transform: "translate(-50%,-50%)", opacity: 0.55 }}>
          <circle cx="60" cy="60" r="38" fill="none" stroke={C.accentDark} strokeWidth="1.4" />
          <path d="M60 22 L60 60 L94 74" fill="none" stroke={C.accentDark} strokeWidth="1.4" />
          <circle cx="47" cy="66" r="4.5" fill="none" stroke={C.accentDark} strokeWidth="1.1" />
          <circle cx="68" cy="47" r="3" fill="none" stroke={C.accentDark} strokeWidth="1.1" />
        </svg>
      )}
      {src && <img src={src} alt={alt} loading="lazy" style={{ position: "relative", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
      <span aria-hidden style={{ position: "absolute", left: 0, bottom: 0, width: "36%", height: 3, background: C.accent }} />
      {label && (
        <span
          style={{
            position: "absolute",
            left: 14,
            bottom: 14,
            fontFamily: BODY,
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: C.ink,
            background: "rgba(253,249,239,0.9)",
            border: `1px solid ${C.border}`,
            padding: "6px 11px",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

/** Tuile du héros : trois tons alternés pour que le bento ne soit pas plat. */
function HeroTuile({ icon: Icon, t, d, ton, grande }: any) {
  const fond = ton === "sombre" ? C.bgDark : ton === "accent" ? C.accentLight : C.bgCard;
  const encre = ton === "sombre" ? C.bgAlt : C.ink;
  const doux = ton === "sombre" ? "rgba(246,239,223,0.68)" : C.textMuted;
  return (
    <div
      style={{
        background: fond,
        color: encre,
        border: `1px solid ${ton === "sombre" ? "rgba(255,255,255,0.09)" : C.border}`,
        borderRadius: 4,
        padding: grande ? "clamp(20px, 2.4vw, 30px)" : "clamp(16px, 1.9vw, 22px)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 12,
        boxShadow: ton === "sombre" ? "0 22px 44px rgba(31,26,16,0.24)" : "0 12px 30px rgba(31,26,16,0.07)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: ton === "sombre" ? 0.16 : 0.35,
          pointerEvents: "none",
          backgroundImage: `repeating-linear-gradient(118deg, ${ton === "sombre" ? "rgba(255,255,255,0.05)" : C.croute + "1c"} 0 1px, transparent 1px 12px)`,
        }}
      />
      <Icon size={grande ? 24 : 19} color={ton === "sombre" ? C.croute : C.accent} aria-hidden style={{ flexShrink: 0, position: "relative" }} />
      <div style={{ position: "relative", minWidth: 0 }}>
        <div style={{ fontFamily: DISPLAY, fontSize: grande ? "clamp(19px, 2.1vw, 25px)" : "clamp(15px, 1.6vw, 17px)", lineHeight: 1.22, marginBottom: 7 }}>{t}</div>
        <div style={{ fontFamily: BODY, fontWeight: 300, fontSize: grande ? 14 : 12.8, lineHeight: 1.66, color: doux }}>{d}</div>
      </div>
    </div>
  );
}

/** Tuile de l'étal : chiffre fantôme, filet qui pousse, flèche qui avance. */
function EtalTuile({ s, large }: { s: any; large: boolean }) {
  const [hov, setHov] = useState(false);
  const Icon = s.icon ?? Milk;
  return (
    <article
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        height: "100%",
        background: hov ? C.bgCard : C.white,
        border: `1px solid ${hov ? C.accent : C.border}`,
        borderRadius: 4,
        padding: large ? "clamp(28px, 3.2vw, 42px)" : "clamp(24px, 2.6vw, 32px)",
        transform: hov ? "translateY(-5px)" : "none",
        boxShadow: hov
          ? "0 26px 52px rgba(31,26,16,0.14), 0 4px 12px rgba(31,26,16,0.08)"
          : "0 1px 0 rgba(31,26,16,0.02)",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        overflow: "hidden",
      }}
    >
      <span
        aria-hidden
        style={{ position: "absolute", left: -1, top: 0, width: 2, height: hov ? "100%" : 0, background: C.accent, transition: "height 0.55s cubic-bezier(0.16, 1, 0.3, 1)" }}
      />
      <span
        aria-hidden
        style={{
          position: "absolute",
          right: 12,
          bottom: -26,
          fontFamily: DISPLAY,
          fontSize: large ? 150 : 110,
          lineHeight: 0.78,
          color: C.ink,
          opacity: 0.055,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {s.n}
      </span>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 15 }}>
          <Icon size={17} color={hov ? C.accent : C.textFaint} aria-hidden style={{ transition: "color 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }} />
          <span style={{ fontFamily: BODY, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: C.textFaint }}>{s.tag}</span>
        </div>
        <h3 style={{ fontFamily: DISPLAY, fontSize: large ? "clamp(21px, 2.4vw, 30px)" : "clamp(18px, 2vw, 22px)", lineHeight: 1.22, color: C.ink, margin: "0 0 12px", letterSpacing: "-0.008em" }}>
          {s.titre}
        </h3>
        <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: large ? 15 : 14, lineHeight: 1.75, color: C.textMuted, margin: 0, maxWidth: large ? 520 : 380 }}>{s.desc}</p>
        <div
          style={{
            marginTop: "auto",
            paddingTop: 20,
            display: "flex",
            alignItems: "center",
            gap: 9,
            fontFamily: BODY,
            fontSize: 12.5,
            fontWeight: 700,
            color: hov ? C.accentDark : C.textFaint,
            transition: "color 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          Le goûter à l'étal
          <ArrowRight size={14} aria-hidden style={{ transform: hov ? "translateX(7px)" : "none", transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }} />
        </div>
      </div>
    </article>
  );
}

/** Étiquette de fromager : le carton perforé planté dans le plateau. */
function Etiquette({ t }: { t: any }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        background: C.white,
        border: `1px solid ${hov ? C.accent : C.border}`,
        borderRadius: 3,
        padding: "clamp(26px, 3vw, 34px) clamp(20px, 2.4vw, 28px) clamp(20px, 2.4vw, 26px)",
        transform: hov ? "translateY(-6px) rotate(-0.4deg)" : "none",
        boxShadow: hov
          ? "0 28px 54px rgba(31,26,16,0.16), 0 6px 14px rgba(31,26,16,0.09)"
          : "0 8px 22px rgba(31,26,16,0.05)",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* La perforation et sa ficelle : le détail qui fait l'étiquette. */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 13,
          left: "50%",
          transform: "translateX(-50%)",
          width: 13,
          height: 13,
          borderRadius: "50%",
          background: C.bgAlt,
          boxShadow: `inset 0 0 0 1px ${C.border}`,
        }}
      />
      <span aria-hidden style={{ position: "absolute", top: 0, left: "50%", width: 1, height: 14, background: C.border }} />
      <div style={{ fontFamily: DISPLAY, fontSize: "clamp(18px, 2vw, 21px)", lineHeight: 1.28, color: C.ink, margin: "6px 0 10px" }}>{t.a}</div>
      <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 13.5, lineHeight: 1.7, color: C.textMuted, margin: "0 0 18px" }}>{t.n}</p>
      <div style={{ marginTop: "auto", display: "flex", alignItems: "baseline", gap: 12, borderTop: `1px dashed ${C.border}`, paddingTop: 14 }}>
        <span style={{ fontFamily: BODY, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textFaint }}>Sur commande</span>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: DISPLAY,
            fontSize: "clamp(20px, 2.3vw, 26px)",
            color: hov ? C.accentDark : C.accent,
            whiteSpace: "nowrap",
            transition: "color 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {t.p}
        </span>
      </div>
    </div>
  );
}

/** Avis en spotlight : un seul témoignage tenu, les autres au repos. */
function AvisSpotlight({ avis }: { avis: any[] }) {
  const [n, setN] = useState(0);
  if (!avis.length) return null;
  const a = avis[n % avis.length];
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center", position: "relative" }}>
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: "-14%",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: DISPLAY,
          fontSize: "clamp(140px, 20vw, 240px)",
          lineHeight: 0.7,
          color: C.ink,
          opacity: 0.05,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        «
      </span>
      <motion.figure
        key={n}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{ margin: 0, position: "relative" }}
      >
        <div style={{ display: "flex", gap: 4, marginBottom: 20, justifyContent: "center" }}>
          {[...Array(5)].map((_, j) => (
            <Star key={j} size={13} fill={C.accent} color={C.accent} aria-hidden />
          ))}
        </div>
        <blockquote style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: "clamp(19px, 2.5vw, 30px)", lineHeight: 1.5, color: C.ink, margin: "0 0 24px" }}>
          {a.texte}
        </blockquote>
        <figcaption style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
          <span aria-hidden style={{ width: 40, height: 1, background: C.accent }} />
          <span style={{ fontFamily: BODY, fontSize: 13.5, fontWeight: 700, color: C.ink }}>{a.auteur}</span>
          <span style={{ fontFamily: BODY, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: C.textFaint }}>{a.detail}</span>
        </figcaption>
      </motion.figure>
      {avis.length > 1 && (
        <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 28 }}>
          {avis.map((x: any, j: number) => (
            <button
              key={j}
              type="button"
              onClick={() => setN(j)}
              aria-label={`Témoignage ${j + 1} : ${x.auteur}`}
              style={{
                minWidth: 44,
                minHeight: 44,
                display: "grid",
                placeItems: "center",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <span
                aria-hidden
                style={{
                  display: "block",
                  width: j === n % avis.length ? 26 : 9,
                  height: 2,
                  background: j === n % avis.length ? C.accent : C.border,
                  transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function HalleAuxFromagesPage() {
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
      n: SERVICES_DEMO[n % SERVICES_DEMO.length].n,
    })),
    SERVICES_DEMO,
  );

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Un seul index pilote tout le héros : bento, sur-titre, légende, compteur.
     DWELL.normal (4,2 s) tient six fois la poussée de 0,7 s. */
  const { i, next, prev } = useSlides(HERO.length, DWELL.normal);
  const S = HERO[i];

  /* Le bento : quatre tuiles inégales — une grande, une haute, deux petites.
     La quatrième reprend la famille de la diapositive, rien d'inventé. */
  const tiles = [
    {
      area: { gridColumn: "1 / span 2", gridRow: "1" },
      node: <HeroTuile {...S.tiles[0]} grande />,
    },
    {
      area: { gridColumn: "1", gridRow: "2 / span 2" },
      node: <HeroTuile {...S.tiles[1]} />,
    },
    {
      area: { gridColumn: "2", gridRow: "2" },
      node: <HeroTuile {...S.tiles[2]} />,
    },
    {
      area: { gridColumn: "2", gridRow: "3" },
      node: (
        <div
          style={{
            background: C.accentLight,
            border: `1px solid ${C.border}`,
            borderRadius: 4,
            padding: "clamp(16px, 1.9vw, 22px)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <span style={{ fontFamily: BODY, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: C.accentDark }}>
            À l'étal cette semaine
          </span>
          <span style={{ fontFamily: DISPLAY, fontSize: "clamp(16px, 1.8vw, 19px)", lineHeight: 1.28, color: C.ink }}>{S.k}</span>
          <span style={{ fontFamily: BODY, fontWeight: 300, fontSize: 12.8, lineHeight: 1.6, color: C.textMuted }}>{S.sub}</span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const nom = clientName(sessionData) ?? fd?.businessName ?? "La Halle aux Fromages";
  const ville = clientCity(sessionData) ?? "Chambéry";
  const metier = clientTrade(sessionData) ?? "Fromager-affineur";
  const phone = clientPhone(sessionData) ?? fd?.phone ?? "04 79 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33479000000").replace(/[^+\d]/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "cave@halle-aux-fromages.fr";
  const adresse = clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "73000", "Chambéry");
  const horaires = "Mar–Sam 8h30–13h / 15h–19h30 · Dim 8h30–12h30";

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: BODY, overflowX: "clip" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Inter:wght@300;400;500;600;700&display=swap');

        @media (max-width: 980px) { #i346-nav { display: none !important; } .i346-burger { display: flex !important; } }
        @media (max-width: 900px) {
          .i346-hero { grid-template-columns: minmax(0,1fr) !important; gap: 34px !important; }
          .i346-bentohero { grid-template-columns: minmax(0,1fr) !important; grid-template-rows: none !important; }
          .i346-bentohero > * { grid-column: 1 !important; grid-row: auto !important; }
        }
        @media (max-width: 860px) {
          .i346-split { grid-template-columns: minmax(0,1fr) !important; }
          .i346-split > * { order: initial !important; }
          .i346-etal { grid-template-columns: minmax(0,1fr) !important; }
          .i346-etal > * { grid-column: auto !important; }
          .i346-frise { grid-template-columns: minmax(0,1fr) !important; }
          .i346-frise > * { border-left: none !important; border-top: 1px solid ${C.border} !important; }
          .i346-stats { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
          .i346-stats > * { border-left: none !important; }
          .i346-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i346-sticky { position: static !important; }
        }

        .i346-navlink { position: relative; }
        .i346-navlink::after {
          content: ""; position: absolute; left: 8px; bottom: 8px; height: 1.5px; width: 0;
          background: ${C.accent}; transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .i346-navlink:hover::after { width: calc(100% - 16px); }

        /* Détail gratuit : la meule qui tourne lentement dans la respiration. */
        @keyframes i346-meule { to { transform: rotate(360deg); } }
        .i346-meule { animation: i346-meule 44s linear infinite; transform-origin: 50% 50%; }

        @media (prefers-reduced-motion: reduce) {
          .i346-navlink::after { transition: none; }
          .i346-meule { animation: none; }
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
          padding: "0 clamp(20px, 4vw, 52px)",
          background: scrolled ? "rgba(253,249,239,0.93)" : "transparent",
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
              <Milk size={17} color={C.accent} aria-hidden style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: DISPLAY, fontSize: 18, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nom}</span>
              <span style={{ fontFamily: BODY, fontSize: 9.5, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textFaint, marginLeft: 8 }}>{metier}</span>
            </>
          )}
        </div>
        <div id="i346-nav" style={{ display: "flex", gap: 2, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} className="i346-navlink" style={{ fontFamily: BODY, color: C.textMuted, fontSize: 13.5, fontWeight: 500, textDecoration: "none", padding: "12px 8px" }}>
              {l}
            </a>
          ))}
          <motion.a
            href={telHref}
            style={{ background: C.accentDark, color: C.white, padding: "12px 22px", fontFamily: BODY, fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", marginLeft: 14, borderRadius: 3 }}
            whileHover={{ scale: 1.03, y: -1 }}
          >
            Commander un plateau
          </motion.a>
        </div>
        <button
          className="i346-burger"
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
          <a href={telHref} style={{ background: C.accentDark, color: C.white, padding: "14px 22px", fontFamily: BODY, fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 10, borderRadius: 3 }}>
            Commander un plateau
          </a>
        </div>
      )}

      {/* ── HÉROS H8 — bento de tuiles inégales, poussées rayon par rayon ─── */}
      <section
        className="i346-hero i346-pad"
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "grid",
          gridTemplateColumns: "minmax(0,0.94fr) minmax(0,1.06fr)",
          gap: "clamp(28px, 4vw, 58px)",
          alignItems: "center",
          padding: "clamp(128px, 15vh, 172px) clamp(24px, 5vw, 64px) clamp(56px, 8vh, 92px)",
          maxWidth: 1300,
          margin: "0 auto",
        }}
      >
        {/* Textures sans image : grain de croûte, halo tiède, chiffre fantôme. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.5,
            backgroundImage: `repeating-linear-gradient(118deg, ${C.croute}18 0 1px, transparent 1px 13px)`,
          }}
        />
        <div
          aria-hidden
          style={{ position: "absolute", top: "4%", left: "-8%", width: 560, height: 560, borderRadius: "50%", background: `radial-gradient(circle, ${C.accent} 0%, transparent 68%)`, opacity: 0.1, pointerEvents: "none" }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "-2vw",
            bottom: "2vh",
            fontFamily: DISPLAY,
            fontSize: "clamp(120px, 21vw, 290px)",
            lineHeight: 0.76,
            color: C.ink,
            opacity: 0.04,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {STATS[0]?.value ?? "120+"}
        </div>

        {/* Colonne éditoriale */}
        <div style={{ position: "relative", zIndex: 2, minWidth: 0 }}>
          <Kicker tone="accent">{clientEyebrow(sessionData) ?? `${metier} · ${ville}`}</Kicker>

          <h1
            style={{
              fontFamily: DISPLAY,
              fontSize: "clamp(35px, 5.2vw, 70px)",
              lineHeight: 0.99,
              letterSpacing: "-0.024em",
              color: C.ink,
              margin: "24px 0 22px",
            }}
          >
            {/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ?? (
              <>
                {clientHeroLine(sessionData, 0, 2, 18) ?? "Des fromages qui ont"}
                <br />
                <em style={{ fontStyle: "italic", color: C.accentDark }}>{clientHeroLine(sessionData, 1, 2, 18) ?? "un alpage et une saison."}</em>
              </>
            )}
          </h1>

          <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: "clamp(15px, 1.6vw, 17.5px)", lineHeight: 1.78, color: C.textMuted, maxWidth: 480, margin: "0 0 32px" }}>
            {clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? "Beaufort d'alpage, tommes fermières, chèvres du plateau : achetés jeunes aux fermes, affinés dans notre cave voûtée, vendus à leur heure exacte. Goûtez la différence d'un affineur."}
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <motion.a
              href={telHref}
              style={{ background: C.accentDark, color: C.white, padding: "16px 30px", fontFamily: BODY, fontSize: 14.5, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, borderRadius: 3 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              Composer un plateau <ArrowRight size={16} aria-hidden />
            </motion.a>
            <a
              href="#services"
              style={{ border: `1px solid ${C.border}`, background: C.white, color: C.ink, padding: "15px 26px", fontFamily: BODY, fontSize: 14.5, fontWeight: 600, textDecoration: "none", borderRadius: 3 }}
            >
              L'étal du moment
            </a>
          </div>

          {/* Le compteur du geste : même index que le bento. */}
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: "clamp(26px, 4vh, 40px)", flexWrap: "wrap" }}>
            <SlideIndex i={i} total={HERO.length} variant="fraction" color={C.textFaint} className="" />
            <span style={{ fontFamily: BODY, fontSize: 13, color: C.textMuted, maxWidth: 330 }}>
              <strong style={{ color: C.ink, fontWeight: 700 }}>{S.k}</strong> — {S.sub}
            </span>
            <HairlineArrows onPrev={prev} onNext={next} color={C.ink} className="" labels={{ prev: "Rayon précédent", next: "Rayon suivant" }} />
          </div>

          {/* Les chiffres vivent dans le héros : pas de bande sombre séparée. */}
          <div
            className="i346-stats"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(STATS.length, 4)}, minmax(0,1fr))`,
              gap: 0,
              marginTop: "clamp(28px, 4vh, 44px)",
              borderTop: `1px solid ${C.border}`,
              paddingTop: 20,
            }}
          >
            {STATS.map((s: any, idx: number) => (
              <div key={s.label} style={{ padding: "6px clamp(10px, 1.4vw, 18px)", borderLeft: idx === 0 ? "none" : `1px solid ${C.borderSoft}` }}>
                <div style={{ fontFamily: DISPLAY, fontSize: "clamp(21px, 2.5vw, 29px)", lineHeight: 1, color: C.accentDark }}>{s.value}</div>
                <div style={{ fontFamily: BODY, fontSize: 11.5, lineHeight: 1.45, color: C.textFaint, marginTop: 7 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Le plateau : quatre tuiles inégales, poussées l'une après l'autre. */}
        <div style={{ position: "relative", zIndex: 2, minWidth: 0 }}>
          <MosaicPush
            index={i}
            tiles={tiles}
            stagger={0.055}
            className="i346-bentohero"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,1.18fr) minmax(0,0.82fr)",
              gridTemplateRows: "minmax(160px, auto) minmax(112px, auto) minmax(112px, auto)",
              gap: 12,
            }}
          />
        </div>
      </section>

      {/* ── RESPIRATION — une phrase, la meule qui tourne derrière ────────── */}
      <section className="i346-pad" style={{ position: "relative", background: C.bg, padding: "clamp(58px, 8vw, 104px) 64px clamp(32px, 4vw, 52px)", textAlign: "center", overflow: "hidden" }}>
        <svg aria-hidden viewBox="0 0 200 200" className="i346-meule" style={{ position: "absolute", left: "50%", top: "50%", width: 340, transform: "translate(-50%,-50%)", opacity: 0.055, pointerEvents: "none" }}>
          <circle cx="100" cy="100" r="92" fill="none" stroke={C.ink} strokeWidth="1" />
          <circle cx="100" cy="100" r="62" fill="none" stroke={C.ink} strokeWidth="1" />
          <path d="M100 8 L100 192 M8 100 L192 100 M35 35 L165 165 M165 35 L35 165" stroke={C.ink} strokeWidth="0.7" />
        </svg>
        <Reveal>
          <p style={{ position: "relative", fontFamily: DISPLAY, fontStyle: "italic", fontSize: "clamp(20px, 2.6vw, 31px)", lineHeight: 1.55, color: C.textMuted, maxWidth: 700, margin: "0 auto" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (
              <>
                Un fromage n'a pas de date de vente. <span style={{ color: C.ink }}>Il a une heure juste, et c'est la cave qui la dit.</span>
              </>
            )}
          </p>
        </Reveal>
      </section>

      {/* ── L'ÉTAL — bento inégal, une tuile large par rangée ─────────────── */}
      <section id="services" className="i346-pad" style={{ background: C.bgAlt, padding: "clamp(74px, 9vw, 122px) 64px" }}>
        <div style={{ maxWidth: 1220, margin: "0 auto" }}>
          <Reveal>
            <Kicker>L'étal</Kicker>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(28px, 4vw, 52px)", lineHeight: 1.06, letterSpacing: "-0.018em", color: C.ink, margin: "16px 0 14px", maxWidth: 720 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                <>
                  Chaque fromage, <em style={{ fontStyle: "italic", color: C.accentDark }}>à son heure exacte.</em>
                </>
              )}
            </h2>
            <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 15, lineHeight: 1.78, color: C.textMuted, maxWidth: 540, margin: "0 0 clamp(30px, 4vw, 48px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "services.chapeau") ?? (
                <>Quatorze fermes, une cave voûtée, cent vingt fromages : l'étal change chaque semaine parce que les fromages, eux, ne s'arrêtent pas de vivre.</>
              )}
            </p>
          </Reveal>
          <div
            className="i346-etal"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gridAutoFlow: "dense", gap: 14 }}
          >
            {SERVICES.map((s: any, idx: number) => {
              const span = ETAL_SPANS[idx % ETAL_SPANS.length];
              return (
                <div key={s.titre} style={{ gridColumn: `span ${span}` }}>
                  <Reveal delay={(idx % 3) * 0.055} y={18}>
                    <EtalTuile s={s} large={span === 2} />
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PLATEAUX — étiquettes de fromager perforées ───────────────────── */}
      <section id="tarifs" className="i346-pad" style={{ background: C.bg, padding: "clamp(76px, 9vw, 126px) 64px" }}>
        <div className="i346-split" style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,0.72fr) minmax(0,1.28fr)", gap: "clamp(32px, 5vw, 66px)", alignItems: "start" }}>
          <div className="i346-sticky" style={{ position: "sticky", top: 108 }}>
            <Reveal>
              <Kicker>Plateaux</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(26px, 3.6vw, 46px)", lineHeight: 1.06, color: C.ink, margin: "16px 0 16px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                  <>
                    Composés, <em style={{ fontStyle: "italic", color: C.accentDark }}>équilibrés, étiquetés.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 14.5, lineHeight: 1.78, color: C.textMuted, maxWidth: 400, margin: 0 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.note") ?? (
                  <>Plateaux préparés le matin du retrait, fromages coupés minute. Commande la veille avant 17 h.</>
                )}
              </p>
              <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 10, fontFamily: BODY, fontSize: 12.5, color: C.textFaint }}>
                <Clock size={14} color={C.accent} aria-hidden />
                {horaires}
              </div>
              <div style={{ marginTop: 30 }}>
                <Reveal delay={0.1}>
                  <Plate src={photo(2, PHOTO_FALLBACK[2])} alt="Plateau de fromages composé" ratio="4/3" label="Plateau composé" />
                </Reveal>
              </div>
            </Reveal>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 16 }}>
            {TARIFS.map((t: any, idx: number) => (
              <Reveal key={t.a} delay={idx * 0.055} y={20}>
                <Etiquette t={t} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── LA CAVE — frise horizontale à filet dégradé ───────────────────── */}
      <section id="methode" className="i346-pad" style={{ background: C.bgDark, color: C.bgAlt, padding: "clamp(76px, 9vw, 126px) 64px", position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden
          style={{ position: "absolute", inset: 0, opacity: 0.28, pointerEvents: "none", backgroundImage: "repeating-linear-gradient(118deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 14px)" }}
        />
        <div
          aria-hidden
          style={{ position: "absolute", right: "-6%", top: "-10%", width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, ${C.accent} 0%, transparent 68%)`, opacity: 0.11, pointerEvents: "none" }}
        />
        <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <Kicker tone="clair">L'affinage</Kicker>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(28px, 4vw, 50px)", lineHeight: 1.06, color: C.bgAlt, margin: "16px 0 14px", maxWidth: 640 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                <>
                  La cave fait <em style={{ fontStyle: "italic", color: C.croute }}>la moitié du goût.</em>
                </>
              )}
            </h2>
            <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 15, lineHeight: 1.78, color: "rgba(246,239,223,0.62)", maxWidth: 520, margin: "0 0 clamp(34px, 5vw, 56px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "methode.chapeau") ?? (
                <>Quatre gestes, répétés toute l'année sous la voûte. C'est tout le métier d'affineur, et il ne se délègue pas.</>
              )}
            </p>
          </Reveal>

          {/* Le filet dégradé qui relie les quatre temps. */}
          <div aria-hidden style={{ height: 1, background: `linear-gradient(90deg, transparent 0%, ${C.croute} 18%, ${C.croute} 82%, transparent 100%)`, opacity: 0.5, marginBottom: -1 }} />
          <div className="i346-frise" style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(min(240px, 100%), 1fr))`, gap: 0 }}>
            {METHODE.map((m: any, idx: number) => (
              <Reveal key={m.n} delay={idx * 0.055} y={20}>
                <div
                  style={{
                    position: "relative",
                    padding: "clamp(30px, 3.4vw, 44px) clamp(18px, 2.2vw, 30px)",
                    borderLeft: idx === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
                    height: "100%",
                    overflow: "hidden",
                  }}
                >
                  <span
                    aria-hidden
                    style={{ position: "absolute", left: "clamp(18px, 2.2vw, 30px)", top: 0, width: 26, height: 3, background: C.accent }}
                  />
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      right: 8,
                      bottom: -22,
                      fontFamily: DISPLAY,
                      fontSize: 118,
                      lineHeight: 0.78,
                      color: C.bgAlt,
                      opacity: 0.06,
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >
                    {m.n}
                  </span>
                  <div style={{ position: "relative" }}>
                    <div style={{ fontFamily: BODY, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: C.croute, marginBottom: 16 }}>{m.n}</div>
                    <h3 style={{ fontFamily: DISPLAY, fontSize: "clamp(18px, 2.1vw, 23px)", lineHeight: 1.24, color: C.bgAlt, margin: "0 0 12px" }}>{m.t}</h3>
                    <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 14, lineHeight: 1.75, color: "rgba(246,239,223,0.6)", margin: 0 }}>{m.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div style={{ marginTop: "clamp(36px, 5vw, 58px)", maxWidth: 620 }}>
            <Reveal delay={0.1}>
              <Plate src={photo(1, PHOTO_FALLBACK[1])} alt="Cave d'affinage voûtée" ratio="16/9" label="La cave voûtée" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── NOS FERMES — panneau photo + engagements ──────────────────────── */}
      <section id="engagements" className="i346-pad" style={{ background: C.bgAlt, padding: "clamp(76px, 9.5vw, 126px) 64px" }}>
        <div className="i346-split" style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(34px, 5vw, 74px)", alignItems: "center" }}>
          <Reveal>
            <Plate src={photo(0, PHOTO_FALLBACK[0])} alt="Comptoir de la fromagerie" ratio="4/5" label="Le comptoir" />
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              <Kicker>Nos engagements</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(26px, 3.6vw, 46px)", lineHeight: 1.06, color: C.ink, margin: "16px 0 20px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>
                    Du lait cru, <em style={{ fontStyle: "italic", color: C.accentDark }}>et des fermes debout.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 15, lineHeight: 1.78, color: C.textMuted, margin: "0 0 26px", maxWidth: 480 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.texte") ?? c?.aboutText ?? (
                  <>Une fromagerie se juge à ce qu'elle accepte d'écrire au-dessus de ses meules : la ferme, le lait, la durée d'affinage.</>
                )}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 30 }}>
                {ENGAGEMENT.map((e: any, idx: number) => (
                  <div key={idx} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <CheckCircle size={16} color={C.accent} aria-hidden style={{ flexShrink: 0, marginTop: 3 }} />
                    <span style={{ fontFamily: BODY, fontSize: 14.5, fontWeight: 300, color: C.textMuted, lineHeight: 1.7 }}>{e}</span>
                  </div>
                ))}
              </div>
              <motion.a
                href={telHref}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.accentDark, color: C.white, padding: "15px 28px", fontFamily: BODY, fontSize: 14, fontWeight: 700, textDecoration: "none", borderRadius: 3 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                Nous appeler <ArrowRight size={15} aria-hidden />
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── AVIS — spotlight : un seul témoignage tenu à la fois ──────────── */}
      <section className="i346-pad" style={{ background: C.bg, padding: "clamp(76px, 9vw, 126px) 64px", position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden
          style={{ position: "absolute", bottom: "-10%", right: "-6%", width: 480, height: 480, borderRadius: "50%", background: `radial-gradient(circle, ${C.accent} 0%, transparent 68%)`, opacity: 0.08, pointerEvents: "none" }}
        />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <Kicker center>Les habitués de la halle</Kicker>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(24px, 3.2vw, 40px)", lineHeight: 1.1, color: C.ink, textAlign: "center", margin: "18px auto clamp(34px, 5vw, 54px)", maxWidth: 640 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                <>
                  La Savoie <em style={{ fontStyle: "italic", color: C.accentDark }}>à l'heure juste.</em>
                </>
              )}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <AvisSpotlight avis={AVIS} />
          </Reveal>
        </div>
      </section>

      {/* ── CONTACT — la boutique, et la commande de la veille ────────────── */}
      <section id="contact" className="i346-pad" style={{ background: C.accentLight, padding: "clamp(76px, 9.5vw, 126px) 64px", position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: "-3%",
            bottom: "-18%",
            fontFamily: DISPLAY,
            fontSize: "clamp(110px, 19vw, 270px)",
            lineHeight: 0.8,
            color: C.ink,
            opacity: 0.035,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          8h30
        </div>
        <div className="i346-split" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1.08fr) minmax(0,0.92fr)", gap: "clamp(34px, 5vw, 70px)", alignItems: "center", position: "relative" }}>
          <Reveal>
            <div>
              <Kicker tone="accent">La boutique</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(28px, 4vw, 50px)", lineHeight: 1.04, color: C.ink, margin: "16px 0 18px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                  <>
                    Goûtez d'abord, <em style={{ fontStyle: "italic", color: C.accentDark }}>choisissez ensuite.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 15.5, lineHeight: 1.78, color: C.textMuted, maxWidth: 450, margin: "0 0 26px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ?? (
                  <>Tout se goûte à l'étal. Plateaux sur commande la veille, machines à raclette prêtées sur réservation.</>
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
                  style={{ background: C.accentDark, color: C.white, padding: "16px 32px", fontFamily: BODY, fontSize: 15.5, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, borderRadius: 3 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <Phone size={17} aria-hidden /> {phone}
                </motion.a>
                <motion.a
                  href={`mailto:${mail}`}
                  style={{ background: "transparent", color: C.ink, border: `1.5px solid ${C.accent}`, padding: "15px 28px", fontFamily: BODY, fontSize: 15.5, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, borderRadius: 3 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <Mail size={17} aria-hidden /> Nous écrire
                </motion.a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, padding: "clamp(24px, 3vw, 36px)", boxShadow: "0 26px 60px rgba(31,26,16,0.1)", borderRadius: 4 }}>
              {[
                { icon: MapPin, label: "Boutique & cave", value: adresse },
                { icon: Phone, label: "Téléphone", value: phone, href: telHref },
                { icon: Mail, label: "E-mail", value: mail, href: `mailto:${mail}` },
                { icon: Clock, label: "Horaires", value: horaires },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} style={{ display: "flex", gap: 15, alignItems: "flex-start", padding: "14px 0", borderTop: idx > 0 ? `1px solid ${C.borderSoft}` : "none" }}>
                    <div style={{ width: 38, height: 38, background: C.accentLight, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.accentDark, flexShrink: 0, borderRadius: 3 }}>
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
      <footer className="i346-pad" style={{ background: C.bgDarkAlt, color: "rgba(246,239,223,0.55)", padding: "clamp(46px, 6vw, 70px) 64px 24px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 34 }}>
            <div style={{ maxWidth: 340 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
                <Milk size={16} color={C.croute} aria-hidden />
                <span style={{ fontFamily: DISPLAY, fontSize: 18, color: C.bgAlt }}>{nom}</span>
              </div>
              <p style={{ fontFamily: BODY, fontSize: 13, fontWeight: 300, lineHeight: 1.75, color: "rgba(246,239,223,0.45)", margin: 0 }}>
                Fromagerie-crèmerie affineur · {clientCodePostalVille(sessionData, "73000", "Chambéry")}
                <br />
                Cave d'affinage sur place, AOP de Savoie en direct des fermes
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <span style={{ fontFamily: BODY, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(246,239,223,0.6)", fontWeight: 700 }}>Navigation</span>
              {NAV.map(({ l, h }) => (
                <a key={l} href={h} style={{ fontFamily: BODY, fontSize: 13, color: "rgba(246,239,223,0.45)", textDecoration: "none", padding: "2px 0" }}>
                  {l}
                </a>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <span style={{ fontFamily: BODY, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(246,239,223,0.6)", fontWeight: 700 }}>Nous trouver</span>
              <span style={{ fontFamily: BODY, fontSize: 13, color: "rgba(246,239,223,0.45)", display: "flex", gap: 9, alignItems: "center" }}>
                <MapPin size={13} aria-hidden /> {adresse}
              </span>
              <a href={telHref} style={{ fontFamily: DISPLAY, fontSize: 16, color: C.croute, textDecoration: "none" }}>{phone}</a>
              <span style={{ fontFamily: BODY, fontSize: 13, color: "rgba(246,239,223,0.45)", display: "flex", gap: 9, alignItems: "center", lineHeight: 1.5 }}>
                <Clock size={13} aria-hidden /> {horaires}
              </span>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontFamily: BODY, fontSize: 12, color: "rgba(246,239,223,0.4)" }}>
              © {new Date().getFullYear()} {nom} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
              {/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ fontFamily: BODY, fontSize: 12, color: "rgba(246,239,223,0.4)" }}>
              Mentions légales : éditeur {nom} · hébergement Vercel Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
