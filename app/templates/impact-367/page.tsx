"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Baby, CheckCircle, Clock, Mail, MapPin, Phone, Star } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { ParticleOrb } from "@/lib/templates/hero-kit-3";
import {
  clientAddress,
  clientAreas,
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
  clientTagline,
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
   {clientName(sessionData) ?? "Cabinet Naissances"} — Sage-femme libérale · Aix-en-Provence
   Réécriture premium (reprise 316–383, famille II).

   Geste signature : ParticleOrb (hero-kit-3), lu comme un BERCEAU de points —
   l'orbe est posé au CENTRE, derrière le titre, très lent (96 s le tour), très
   dense (900 points), très pâle ; sous lui une arche de berceau en SVG se
   balance de deux degrés, huit secondes l'aller-retour. Aucun anneau, aucune
   propagation : c'est ce qui sépare ce thème du 339, où le même orbe est posé
   en colonne droite, tourné vers l'oreille, et lu comme une ONDE (380 points,
   anneaux concentriques). Même mécanique, lecture opposée.

   Archétype H6 : typographique, sans photographie au-dessus de la ligne de
   flottaison ; les textures sont en CSS et en SVG.
   Paire P11 : EB Garamond (serif de titre) × Outfit (sans de labeur).
   Palette #fdf8f6 / #b96a75 — rosée, tenue, jamais sucrée.

   Dessin des sections, volontairement écarté du squelette commun :
   les chiffres ne font pas de bande sombre mais un rail vertical collant en
   marge des prestations ; les prestations sont des rangées éditoriales
   numérotées ; le suivi tient en quatre colonnes filetées ; les tarifs sont
   une table fine ; les avis défilent en marquee lent.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Fontes : deux rôles opposés, importées une fois ──────────────────────── */
const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Outfit:wght@300;400;500;600&display=swap');`;
const SERIF = "'EB Garamond', Garamond, Georgia, serif";
const SANS = "'Outfit', system-ui, -apple-system, 'Segoe UI', sans-serif";
// Les passes globales et les sous-pages lisent encore FONT / FONT_BODY.
const FONT = SERIF;
const FONT_BODY = SANS;

/* ── Courbe d'accélération unique du thème ───────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_CSS = "cubic-bezier(.16,1,.3,1)";

/* ── Jetons ──────────────────────────────────────────────────────────────── */
let C: Record<string, string> = {
  bg: "#fdf8f6",
  bgAlt: "#f7ece9",
  bgDark: "#2c1e20",
  bgDarkAlt: "#221618",
  bgCard: "#ffffff",
  accent: "var(--brand, #b96a75)",
  accentDark: "var(--brand-light, #8f4a55)",
  accentLight: "#f6e3e3",
  ink: "#2b1f21",
  textMuted: "#6f5c5e",
  textFaint: "#a4908f",
  border: "#ecdcda",
  white: "#ffffff",
  // Clé métier : la teinte du berceau — les points de l'orbe, l'arche, les filets.
  berceau: "#dba8a8",
};

const NAV = [
  { l: "Accompagnement", h: "#services" },
  { l: "Le suivi", h: "#methode" },
  { l: "Prise en charge", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* ════════════════════════════════════════════════════════════════════════════
   Données de démonstration — contenu rédactionnel du thème, conservé.

   Sources figées d'un côté (les champs de présentation : tag, note), listes
   vivantes de l'autre, recalculées dans le corps du rendu une fois la session
   affectée. Une constante évaluée à l'import ne verrait jamais le client.
   ════════════════════════════════════════════════════════════════════════════ */

const SERVICES_SOURCE = [
  { titre: "Suivi de grossesse", desc: "Consultations mensuelles, entretien prénatal précoce, monitorings de fin de grossesse au cabinet : le suivi complet des grossesses physiologiques.", tag: "Grossesse" },
  { titre: "Préparation à la naissance", desc: "8 séances remboursées : physiologie, respiration, positions, place du co-parent, projet de naissance. En petit groupe ou en couple.", tag: "Préparation" },
  { titre: "Retour à la maison (PRADO)", desc: "Visites à domicile dès la sortie de maternité : poids, allaitement ou biberon, sommeil, baby-blues — tout ce qui déborde les premiers jours.", tag: "Post-partum" },
  { titre: "Allaitement", desc: "Consultations dédiées, y compris en urgence : crevasses, engorgement, doutes de croissance. Aussi : sevrage accompagné, sans culpabilité.", tag: "Allaitement" },
  { titre: "Rééducation périnéale", desc: "10 séances remboursées après la naissance : méthode manuelle et biofeedback, à votre rythme, sans tabou et sans douleur.", tag: "Rééducation" },
  { titre: "Gynécologie de prévention", desc: "Frottis, contraception, pose et retrait de DIU : les sages-femmes assurent le suivi gynécologique des femmes en bonne santé, à tout âge.", tag: "Gynéco" },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE_SOURCE = [
  { n: "01", t: "Le premier rendez-vous", d: "Long, posé : histoire, souhaits, questions. L'entretien prénatal précoce est un droit — et un vrai moment." },
  { n: "02", t: "La grossesse, suivie", d: "Une consultation par mois, monitorings en fin de parcours, lien direct avec la maternité choisie." },
  { n: "03", t: "La naissance, préparée", d: "8 séances pour arriver le jour J en connaissant son corps, ses droits et ses options." },
  { n: "04", t: "L'après, accompagné", d: "Domicile la première semaine, allaitement, rééducation, contraception : on ne disparaît pas après l'accouchement." },
];
const METHODE = METHODE_SOURCE;

const ENGAGEMENT_SOURCE = [
  "Sage-femme diplômée d'État, inscrite à l'Ordre — n° RPPS affiché au cabinet",
  "Conventionnée CPAM : consultations remboursées, 100 % dès le 6e mois de grossesse",
  "Visites à domicile dans Aix et sa couronne, coordination PRADO avec la maternité",
  "Urgences de ma patientèle : joignable 7j/7 en fin de grossesse et post-partum",
];
let ENGAGEMENT = ENGAGEMENT_SOURCE;

const TARIFS_SOURCE = [
  { a: "Consultation de suivi", p: "tarif conventionné", n: "Remboursée 70 %, puis 100 % dès le 6e mois — tiers payant.", pastille: "Remboursée" },
  { a: "Préparation à la naissance (×8)", p: "prises en charge", n: "100 % Assurance Maternité, en groupe ou en couple.", pastille: "100 %" },
  { a: "Rééducation périnéale (×10)", p: "prises en charge", n: "Sur prescription, remboursées intégralement.", pastille: "Sur prescription" },
  { a: "Suivi gynécologique / frottis", p: "tarif conventionné", n: "Remboursé comme chez un médecin — les sages-femmes y sont habilitées.", pastille: "Remboursé" },
];
let TARIFS = TARIFS_SOURCE;

const AVIS_SOURCE = [
  { texte: "Suivie du test de grossesse au dernier jour de rééducation par la même personne : cette continuité change tout. Elle connaissait mon dossier, mes peurs, mon bébé.", auteur: "Laure M.", detail: "Suivi complet" },
  { texte: "La visite à domicile du 3e jour nous a sauvés : l'allaitement partait mal, tout est rentré dans l'ordre en deux visites. Et le co-parent a eu sa place à chaque étape.", auteur: "Élise & Damien", detail: "Post-partum + allaitement" },
  { texte: "Je continue de la voir pour ma gynéco de prévention : frottis, DIU, questions sans tabou. Je ne retournerai pas m'asseoir dans une salle d'attente anonyme.", auteur: "Sophie R.", detail: "Suivi gynécologique" },
];
let AVIS_DEMO = AVIS_SOURCE;

const STATS_SOURCE = [
  { value: "100 %", label: "Grossesse remboursée dès le 6e mois" },
  { value: "7j/7", label: "Pour ma patientèle en fin de grossesse" },
  { value: "RPPS", label: "Conventionnée, inscrite à l'Ordre" },
  { value: "8", label: "Séances de préparation prises en charge" },
];
let STATS = STATS_SOURCE;

/* ── Photos ──────────────────────────────────────────────────────────────── */
/**
 * L'image téléversée à cet emplacement, sinon celle du thème.
 *
 * `||` et non `??` : une chaîne vide est un emplacement non pourvu. Le héros
 * n'a volontairement aucune photographie (H6) ; le seul emplacement du thème
 * est la vue du cabinet, et il porte un repli CSS si l'image est bloquée.
 */
function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 24, style }: { children: React.ReactNode; delay?: number; y?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} style={style} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.8, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

/** Sur-titre : un filet de 40 px, puis des capitales très espacées. */
function Kicker({ children, color = C.accentDark, align = "left" }: { children: React.ReactNode; color?: string; align?: "left" | "center" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: align === "center" ? "center" : "flex-start" }}>
      <span style={{ width: 40, height: 1, background: color, opacity: 0.7, flexShrink: 0 }} />
      <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 500, letterSpacing: "0.36em", textTransform: "uppercase", color }}>{children}</span>
      {align === "center" && <span style={{ width: 40, height: 1, background: color, opacity: 0.7, flexShrink: 0 }} />}
    </div>
  );
}

/**
 * L'arche du berceau, dessinée.
 *
 * Le thème n'a pas de photographie au-dessus de la ligne de flottaison : ce
 * trait est ce qui empêche le grand aplat rosé de paraître vide, et il donne à
 * l'orbe sa lecture — une sphère posée sur une arche devient un berceau.
 */
function Arche({ color, opacity = 0.5, height = 120, style, className = "" }: { color: string; opacity?: number; height?: number; style?: React.CSSProperties; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 600 140" preserveAspectRatio="none" className={className} style={{ display: "block", width: "100%", height, opacity, pointerEvents: "none", ...style }}>
      <path d="M20 20 C 120 138, 480 138, 580 20" fill="none" stroke={color} strokeWidth="1" />
      <path d="M64 14 C 152 118, 448 118, 536 14" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <circle cx="20" cy="20" r="3" fill={color} />
      <circle cx="580" cy="20" r="3" fill={color} />
    </svg>
  );
}

/** Un filet dégradé d'un pixel — la seule séparation du thème. */
function Filet({ color, width = "100%", style }: { color: string; width?: string | number; style?: React.CSSProperties }) {
  return <span aria-hidden style={{ display: "block", width, height: 1, background: `linear-gradient(90deg, transparent, ${color}, transparent)`, ...style }} />;
}

function NavLink({ label, href }: { label: string; href: string }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        position: "relative",
        fontFamily: SANS,
        fontSize: 13.5,
        fontWeight: 400,
        color: h ? C.ink : C.textMuted,
        textDecoration: "none",
        padding: "12px 2px",
        transition: `color .48s ${EASE_CSS}`,
      }}
    >
      {label}
      {/* le soulignement pousse en largeur, il n'apparaît pas */}
      <span style={{ position: "absolute", left: 0, bottom: 6, height: 1, width: h ? "100%" : "0%", background: C.accent, transition: `width .5s ${EASE_CSS}` }} />
    </a>
  );
}

/** Bouton : le thème est doux, ses boutons sont donc des galets. */
function CTA({ href, children, filled = false, big = false, sombre = false }: { href: string; children: React.ReactNode; filled?: boolean; big?: boolean; sombre?: boolean }) {
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
        fontFamily: SANS,
        fontSize: big ? 15 : 14,
        fontWeight: 500,
        padding: big ? "16px 32px" : "13px 26px",
        borderRadius: 999,
        textDecoration: "none",
        whiteSpace: "nowrap",
        border: `1px solid ${filled ? "transparent" : sombre ? "rgba(255,255,255,0.28)" : C.border}`,
        background: filled ? (h ? C.accentDark : C.accent) : h ? (sombre ? "rgba(255,255,255,0.10)" : C.white) : "transparent",
        color: filled ? C.white : sombre ? C.white : C.ink,
        transform: h ? "translateY(-2px)" : "none",
        boxShadow: h
          ? `0 18px 36px -22px rgba(44,30,32,0.62), 0 2px 0 0 ${filled ? "rgba(255,255,255,0.22)" : sombre ? "rgba(255,255,255,0.14)" : C.accentLight}`
          : "0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0)",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      {children}
      <ArrowRight size={15} style={{ transform: h ? "translateX(5px)" : "none", transition: `transform .5s ${EASE_CSS}` }} />
    </a>
  );
}

/**
 * Une prestation, en rangée éditoriale.
 *
 * Pas une carte : un numéro fantôme, un filet, et du texte. Les six
 * accompagnements se lisent comme un sommaire, ce qui convient à un métier où
 * l'on suit une histoire du début à la fin.
 */
function PrestationRangee({ s, idx, dernier }: { s: any; idx: number; dernier: boolean }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={Math.min(idx, 5) * 0.055} y={18}>
      <article
        className="i367-rangee"
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "72px minmax(0,1fr)",
          gap: "clamp(14px,2vw,28px)",
          alignItems: "start",
          padding: "clamp(22px,2.4vw,30px) clamp(14px,1.6vw,22px)",
          borderRadius: 18,
          background: h ? C.bgCard : "transparent",
          borderBottom: dernier ? "1px solid transparent" : `1px solid ${h ? "transparent" : C.border}`,
          transform: h ? "translateX(6px)" : "none",
          boxShadow: h ? `0 26px 52px -44px rgba(44,30,32,0.6), 0 2px 0 0 ${C.accentLight}` : "0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0)",
          transition: `all .5s ${EASE_CSS}`,
        }}
      >
        <div
          style={{
            fontFamily: SERIF,
            fontSize: "clamp(34px,3.6vw,48px)",
            lineHeight: 0.9,
            color: h ? C.accent : C.accentLight,
            transition: `color .5s ${EASE_CSS}`,
          }}
        >
          {String(idx + 1).padStart(2, "0")}
        </div>
        <div style={{ minWidth: 0 }}>
          <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 500, letterSpacing: "0.26em", textTransform: "uppercase", color: C.accentDark }}>{s.tag}</span>
          <h3 style={{ fontFamily: SERIF, fontSize: "clamp(24px,2.5vw,32px)", fontWeight: 500, color: C.ink, lineHeight: 1.1, margin: "10px 0 10px", letterSpacing: "-0.004em" }}>{s.titre}</h3>
          <p style={{ fontFamily: SANS, fontSize: 14.5, color: C.textMuted, lineHeight: 1.78, margin: 0, maxWidth: 520 }}>{s.desc}</p>
        </div>
      </article>
    </Reveal>
  );
}

/** Un temps du suivi : une colonne filetée, pas une carte. */
function TempsColonne({ m, idx }: { m: any; idx: number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={idx * 0.08} y={20}>
      <div
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          position: "relative",
          height: "100%",
          padding: "clamp(26px,2.4vw,34px) clamp(16px,1.8vw,24px) clamp(22px,2vw,28px)",
          borderRadius: 20,
          background: h ? C.bgCard : "transparent",
          transform: h ? "translateY(-5px)" : "none",
          boxShadow: h ? `0 30px 56px -46px rgba(44,30,32,0.6), 0 2px 0 0 ${C.accentLight}` : "0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0)",
          transition: `all .5s ${EASE_CSS}`,
        }}
      >
        {/* la perle posée sur le fil du parcours */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: -6,
            left: "clamp(16px,1.8vw,24px)",
            width: 11,
            height: 11,
            borderRadius: "50%",
            background: h ? C.accent : C.bg,
            border: `1px solid ${C.accent}`,
            boxShadow: `0 0 0 5px ${C.bg}`,
            transition: `background .5s ${EASE_CSS}`,
          }}
        />
        <div style={{ fontFamily: SERIF, fontSize: "clamp(15px,1.4vw,17px)", letterSpacing: "0.22em", color: h ? C.accent : C.textFaint, marginTop: 10, transition: `color .5s ${EASE_CSS}` }}>{m.n}</div>
        <h3 style={{ fontFamily: SERIF, fontSize: "clamp(22px,2.2vw,28px)", fontWeight: 500, color: C.ink, lineHeight: 1.12, margin: "12px 0 10px" }}>{m.t}</h3>
        <p style={{ fontFamily: SANS, fontSize: 14, color: C.textMuted, lineHeight: 1.76, margin: 0 }}>{m.d}</p>
      </div>
    </Reveal>
  );
}

/** Une ligne de la table des prises en charge. */
function TarifLigne({ t, idx }: { t: any; idx: number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={idx * 0.05} y={14}>
      <div
        className="i367-tarif"
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) auto",
          gap: "clamp(12px,3vw,40px)",
          alignItems: "baseline",
          padding: "clamp(20px,2.2vw,28px) clamp(10px,1.6vw,20px)",
          borderTop: `1px solid ${C.border}`,
          background: h ? C.bgCard : "transparent",
          transform: h ? "translateX(5px)" : "none",
          boxShadow: h ? `0 22px 46px -42px rgba(44,30,32,0.58), 0 2px 0 0 ${C.accentLight}` : "0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0)",
          transition: `all .5s ${EASE_CSS}`,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontFamily: SERIF, fontSize: "clamp(21px,2vw,26px)", fontWeight: 500, color: C.ink, letterSpacing: "-0.004em" }}>{t.a}</span>
            {t.pastille && (
              <span style={{ fontFamily: SANS, fontSize: 9.5, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accentDark, background: C.accentLight, borderRadius: 999, padding: "5px 11px" }}>{t.pastille}</span>
            )}
          </div>
          <div style={{ fontFamily: SANS, fontSize: 13.5, color: C.textMuted, lineHeight: 1.72, marginTop: 8, maxWidth: 540 }}>{t.n}</div>
        </div>
        <div style={{ fontFamily: SERIF, fontSize: "clamp(19px,1.9vw,24px)", fontStyle: "italic", color: C.accentDark, whiteSpace: "nowrap" }}>{t.p}</div>
      </div>
    </Reveal>
  );
}

/**
 * Un avis, sur le ruban qui défile.
 *
 * Le ruban est la seule bande sombre de la page : quatre sections claires se
 * suivent sans jamais alterner mécaniquement, puis la parole des patientes
 * arrive sur fond profond. C'est le seul endroit où l'on change de lumière.
 */
function AvisCarte({ a }: { a: any }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        flex: "0 0 auto",
        width: "min(78vw, 380px)",
        background: h ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.045)",
        border: `1px solid ${h ? "rgba(219,168,168,0.42)" : "rgba(255,255,255,0.10)"}`,
        borderRadius: 24,
        padding: "clamp(26px,2.6vw,34px)",
        transform: h ? "translateY(-5px)" : "none",
        boxShadow: h ? "0 32px 60px -44px rgba(0,0,0,0.9), 0 2px 0 0 rgba(219,168,168,0.30)" : "0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0)",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {[...Array(5)].map((_, j) => (
          <Star key={j} size={12} fill={C.berceau} color={C.berceau} />
        ))}
      </div>
      <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(17px,1.7vw,20px)", color: "rgba(255,255,255,0.86)", lineHeight: 1.52, margin: "0 0 20px" }}>« {a.texte} »</p>
      <Filet color="rgba(255,255,255,0.22)" />
      <div style={{ marginTop: 14 }}>
        <div style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 500, color: C.white }}>{a.auteur}</div>
        <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.berceau, marginTop: 6 }}>{a.detail}</div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════════════════ */
export default function CabinetNaissancesPage() {
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
         création, elle peut n'être pas encore lisible. Trois tentatives. */
      for (const attente of [0, 600, 2000]) {
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
  brand = fd?.brandColor ?? null;
  if (brand) {
    C = { ...C, accent: brand };
  }

  /* ── Listes : le client écrase, le thème complète ───────────────────────── */
  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...SERVICES_SOURCE[i % SERVICES_SOURCE.length],
      titre: s.title ?? SERVICES_SOURCE[i % SERVICES_SOURCE.length].titre,
      desc: s.description ?? s.desc ?? SERVICES_SOURCE[i % SERVICES_SOURCE.length].desc,
    })),
    SERVICES_SOURCE,
  );
  const SERVICES = SERVICES_DEMO;

  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      ...AVIS_SOURCE[i % AVIS_SOURCE.length],
      texte: r.text ?? AVIS_SOURCE[i % AVIS_SOURCE.length].texte,
      auteur: r.author ?? r.name ?? AVIS_SOURCE[i % AVIS_SOURCE.length].auteur,
      detail: r.source ?? r.location ?? r.role ?? AVIS_SOURCE[i % AVIS_SOURCE.length].detail,
    })),
    AVIS_SOURCE,
  );
  const AVIS = AVIS_DEMO;

  TARIFS = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...TARIFS_SOURCE[i % TARIFS_SOURCE.length],
      a: s.title ?? TARIFS_SOURCE[i % TARIFS_SOURCE.length].a,
      p: s.price ?? TARIFS_SOURCE[i % TARIFS_SOURCE.length].p,
      n: s.description ?? s.desc ?? TARIFS_SOURCE[i % TARIFS_SOURCE.length].n,
    })),
    TARIFS_SOURCE,
  );
  STATS = resolveList(clientStats(sessionData), STATS_SOURCE);
  ENGAGEMENT = resolveList(clientList(sessionData, "engagements.liste") ?? clientCertifications(sessionData), ENGAGEMENT_SOURCE);

  const ZONES = clientAreas(sessionData) ?? [];

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  /* ── Contact ───────────────────────────────────────────────────────────── */
  const phone = clientPhone(sessionData) ?? fd?.phone ?? "04 42 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33442000000").replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "rdv@cabinet-naissances.fr";
  const cabinet = fd?.businessName ?? clientName(sessionData) ?? "Cabinet Naissances";
  const ville = clientCity(sessionData) ?? "Aix-en-Provence";
  const metier = clientTrade(sessionData) ?? "Sage-femme";

  /* L'unique emplacement photographique du thème : la vue du cabinet. */
  const photoCabinet = photo(0, "https://images.pexels.com/photos/7088531/pexels-photo-7088531.jpeg?auto=compress&cs=tinysrgb&w=1400");

  /* Le ruban d'avis est doublé pour boucler sans saut : la seconde moitié est
     une copie masquée aux lecteurs d'écran. */
  const RUBAN = [...AVIS, ...AVIS];

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip" }}>
      <style>{`
        ${FONTS_CSS}

        @media (max-width: 980px) { #i367-nav { display: none !important; } .i367-burger { display: flex !important; } }

        /* Prestations : rail de chiffres collant à gauche, sommaire à droite.
           Sous 980 px le rail redevient une bande horizontale et cesse d'être
           collant — un élément sticky dans une colonne d'une seule piste ne
           colle à rien, il occupe seulement de la place. */
        @media (max-width: 980px) {
          .i367-presta { grid-template-columns: minmax(0,1fr) !important; gap: 34px !important; }
          .i367-rail { position: static !important; }
          .i367-railgrille { grid-template-columns: repeat(auto-fit, minmax(min(150px,100%),1fr)) !important; }
        }
        @media (max-width: 860px) {
          .i367-split { grid-template-columns: minmax(0,1fr) !important; gap: 34px !important; }
          .i367-contact { grid-template-columns: minmax(0,1fr) !important; gap: 34px !important; }
          .i367-sticky { position: static !important; }
        }
        @media (max-width: 640px) {
          .i367-tarif { grid-template-columns: minmax(0,1fr) !important; }
          .i367-rangee { grid-template-columns: minmax(0,1fr) !important; gap: 6px !important; }
        }

        /* Le berceau : deux degrés de balancement, huit secondes l'aller-retour.
           C'est le seul mouvement de la page hors de l'orbe, et il est assez
           lent pour qu'on le ressente sans le regarder. */
        @keyframes i367-berce {
          0%, 100% { transform: rotate(-1.6deg); }
          50%      { transform: rotate(1.6deg); }
        }
        .i367-berceau { animation: i367-berce 8.4s ${EASE_CSS} infinite; transform-origin: 50% 6%; }

        /* Le ruban d'avis : un défilement continu, arrêté au survol. */
        @keyframes i367-ruban {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .i367-ruban { animation: i367-ruban 58s linear infinite; }
        .i367-rubanwrap:hover .i367-ruban { animation-play-state: paused; }

        @media (prefers-reduced-motion: reduce) {
          .i367-berceau { animation: none !important; }
          .i367-ruban { animation: none !important; }
        }
      `}</style>

      {/* ── NAV — collante à quatre propriétés : hauteur, fond, flou, filet ─ */}
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
          gap: 16,
          padding: scrolled ? "12px clamp(20px,4vw,56px)" : "22px clamp(20px,4vw,56px)",
          background: scrolled ? "rgba(253,248,246,0.93)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          transition: `all .55s ${EASE_CSS}`,
        }}
      >
        <a href="#hero" style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, textDecoration: "none" }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={cabinet} style={{ height: 30, maxWidth: 170, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Baby size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: SERIF, fontSize: 23, fontWeight: 500, color: C.ink, letterSpacing: "0.005em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cabinet}</span>
            </>
          )}
        </a>
        <div id="i367-nav" style={{ display: "flex", gap: "clamp(18px,2.2vw,30px)", alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <NavLink key={l} label={l} href={h} />
          ))}
          <CTA href={telHref} filled>
            Prendre RDV
          </CTA>
        </div>
        <button
          className="i367-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: `transform .35s ${EASE_CSS}`, transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "opacity .3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: `transform .35s ${EASE_CSS}`, transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 99, background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "18px clamp(20px,5vw,32px) 26px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ fontFamily: SANS, color: C.ink, fontSize: 16, fontWeight: 400, textDecoration: "none", padding: "12px 0" }}>
              {l}
            </a>
          ))}
          <a href={telHref} style={{ fontFamily: SANS, background: C.accent, color: C.white, borderRadius: 999, padding: "14px 22px", fontSize: 15, fontWeight: 500, textDecoration: "none", textAlign: "center", marginTop: 10 }}>
            Prendre RDV
          </a>
        </div>
      )}

      {/* ══ HÉROS H6 — typographie centrée, berceau de points derrière ═════ */}
      <section
        id="hero"
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "clamp(136px,14vw,180px) clamp(20px,6vw,80px) clamp(56px,7vw,92px)",
          overflow: "hidden",
        }}
      >
        {/* Le glow rosé : il pose l'orbe sur quelque chose, sinon le canevas
            paraît découpé dans la page. */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: "46%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(96vw, 900px)",
            aspectRatio: "1",
            borderRadius: "50%",
            background: `radial-gradient(circle at 50% 50%, ${C.accentLight} 0%, rgba(246,227,227,0.42) 42%, transparent 70%)`,
            opacity: 0.9,
            pointerEvents: "none",
          }}
        />

        {/* L'ORBE — centré, derrière le titre. 900 points, 96 s le tour :
            deux fois plus dense et une fois et demie plus lent que sur le 339,
            où le même composant sert d'onde sonore. Ici il ne se propage pas,
            il berce. */}
        <ParticleOrb
          color={C.berceau}
          count={900}
          seconds={96}
          className=""
          style={{
            position: "absolute",
            top: "46%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(84vw, 700px)",
            aspectRatio: "1",
            opacity: 0.42,
            pointerEvents: "none",
          }}
        />

        {/* L'arche qui berce l'orbe : c'est elle qui fait lire un berceau. */}
        <div
          aria-hidden
          className="i367-berceau"
          style={{
            position: "absolute",
            top: "calc(46% + min(30vw, 250px))",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(80vw, 640px)",
            pointerEvents: "none",
          }}
        >
          <Arche color={C.accent} opacity={0.28} height={120} />
        </div>

        {/* Texture : un « 9 » fantôme — les neuf mois. */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            right: "clamp(-14px,-1vw,0px)",
            top: "clamp(88px,11vw,150px)",
            fontFamily: SERIF,
            fontSize: "clamp(160px,26vw,380px)",
            lineHeight: 0.72,
            color: C.accent,
            opacity: 0.06,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          9
        </span>

        <div style={{ position: "relative", zIndex: 2, maxWidth: 860, width: "100%" }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.12 }} style={{ display: "flex", justifyContent: "center" }}>
            <Kicker align="center">{clientEyebrow(sessionData) ?? `${metier} · ${ville}`}</Kicker>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 1, ease: EASE }}
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(42px,7vw,96px)",
              fontWeight: 400,
              color: C.ink,
              lineHeight: 0.99,
              letterSpacing: "-0.016em",
              margin: "clamp(22px,2.8vw,38px) 0 clamp(18px,2vw,28px)",
            }}
          >
            {/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ?? (
              <>
                {c?.heroHeadline ?? (
                  <>
                    {clientHeroLine(sessionData, 0, 2, 24) ?? "Neuf mois, une naissance,"}
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accent }}>{clientHeroLine(sessionData, 1, 2, 24) ?? "et tout ce qui vient après."}</em>
                  </>
                )}
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.9, ease: EASE }}
            style={{ fontFamily: SANS, fontSize: "clamp(15.5px,1.5vw,17px)", color: C.textMuted, lineHeight: 1.8, maxWidth: 520, margin: "0 auto clamp(28px,3.2vw,38px)" }}
          >
            {clientHeroSubtitle(sessionData) ??
              c?.heroSubline ??
              "Suivi de grossesse, préparation à la naissance, retour à la maison, rééducation : une sage-femme conventionnée vous accompagne du test positif aux premiers mois — et pour votre suivi gynécologique ensuite."}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.64, duration: 0.85, ease: EASE }} style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <CTA href={telHref} filled big>
              Prendre rendez-vous
            </CTA>
            <CTA href="#services" big>
              L'accompagnement
            </CTA>
          </motion.div>

          {/* Le détail gratuit : une ligne qui dit quand appeler, posée sous
              un filet. Elle ne vend rien, elle situe. */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.92, duration: 1, ease: EASE }} style={{ marginTop: "clamp(34px,4vw,56px)", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <Filet color={C.accent} width="min(100%, 260px)" style={{ opacity: 0.5 }} />
            <span style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.28em", textTransform: "uppercase", color: C.textFaint }}>L'entretien prénatal, dès le 3e mois</span>
          </motion.div>
        </div>
      </section>

      {/* ══ RESPIRATION — une phrase, rien d'autre ════════════════════════ */}
      <section style={{ background: C.bgAlt, padding: "clamp(76px,10vw,148px) clamp(24px,8vw,140px)", textAlign: "center" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
            <Kicker color={C.textMuted} align="center">
              Le cabinet
            </Kicker>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(24px,3.6vw,50px)", lineHeight: 1.32, fontWeight: 400, maxWidth: 940, margin: "0 auto", color: C.ink }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (
              <>Une grossesse n'est pas une maladie : c'est une traversée, et personne ne devrait la faire sans quelqu'un qui connaisse son nom.</>
            )}
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div style={{ maxWidth: 420, margin: "clamp(34px,4vw,54px) auto 0" }}>
            <Arche color={C.accent} opacity={0.35} height={64} />
          </div>
        </Reveal>
      </section>

      {/* ══ ACCOMPAGNEMENT — rail de chiffres collant + sommaire numéroté ══ */}
      <section id="services" style={{ position: "relative", background: C.bg, padding: "clamp(72px,9vw,132px) clamp(20px,5vw,72px)", overflow: "hidden" }}>
        <div
          className="i367-presta"
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(0,0.42fr) minmax(0,1fr)",
            gap: "clamp(28px,5vw,80px)",
            alignItems: "start",
          }}
        >
          {/* Les chiffres ne font pas de bande sombre : ils tiennent la marge,
              en rail vertical, et suivent la lecture du sommaire. */}
          <div className="i367-rail" style={{ position: "sticky", top: 116 }}>
            <Reveal>
              <Kicker>Accompagnement</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4.4vw,56px)", fontWeight: 400, color: C.ink, marginTop: 18, lineHeight: 1.06, letterSpacing: "-0.014em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                  <>
                    Une seule praticienne,
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accent }}>toute l'histoire.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 15, color: C.textMuted, lineHeight: 1.78, maxWidth: 380, marginTop: 18 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "services.texte") ?? (
                  <>Six accompagnements, un seul fil : la personne qui vous suit au premier rendez-vous est celle qui viendra chez vous après la naissance.</>
                )}
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <div style={{ marginTop: "clamp(28px,3vw,40px)" }}>
                <Filet color={C.accent} style={{ opacity: 0.55 }} />
                <div className="i367-railgrille" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: "clamp(16px,1.8vw,24px)", marginTop: 22 }}>
                  {STATS.map((s: any, idx: number) => (
                    <div key={s.label ?? idx} style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
                      <div style={{ fontFamily: SERIF, fontSize: "clamp(28px,3vw,40px)", color: C.accent, lineHeight: 1, minWidth: 74 }}>{s.value}</div>
                      <div style={{ fontFamily: SANS, fontSize: 11.5, color: C.textFaint, lineHeight: 1.55 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <div>
            {SERVICES.map((s: any, idx: number) => (
              <PrestationRangee key={`${s.titre}-${idx}`} s={s} idx={idx} dernier={idx === SERVICES.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ LE SUIVI — quatre temps en colonnes filetées ═══════════════════ */}
      <section id="methode" style={{ position: "relative", background: C.bgAlt, padding: "clamp(72px,9vw,132px) clamp(20px,5vw,72px)", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(36px,4vw,58px)", maxWidth: 740 }}>
              <Kicker>Le suivi</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4.6vw,60px)", fontWeight: 400, color: C.ink, marginTop: 18, lineHeight: 1.06, letterSpacing: "-0.014em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                  <>
                    Le même visage,
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accent }}>du début à la fin.</em>
                  </>
                )}
              </h2>
            </div>
          </Reveal>
          {/* Le fil du parcours : un filet dégradé, et quatre perles dessus. */}
          <div style={{ position: "relative", paddingTop: 6 }}>
            <span aria-hidden style={{ position: "absolute", top: 0, left: "2%", right: "2%", height: 1, background: `linear-gradient(90deg, transparent, ${C.accent}, ${C.accent}, transparent)`, opacity: 0.5 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px,100%), 1fr))", gap: "clamp(10px,1.6vw,20px)" }}>
              {METHODE.map((m, idx) => (
                <TempsColonne key={m.n} m={m} idx={idx} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ PRISE EN CHARGE — table fine, dans la continuité du suivi ═════
          Le suivi et sa prise en charge partagent le même fond : ce sont deux
          moitiés d'une même question, et l'alternance des fonds ne doit pas
          être un métronome. Un filet les sépare, pas un changement de teinte. */}
      <section id="tarifs" style={{ background: C.bgAlt, padding: "clamp(20px,3vw,40px) clamp(20px,5vw,72px) clamp(72px,9vw,132px)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto clamp(48px,6vw,84px)" }}>
          <Filet color={C.accent} style={{ opacity: 0.45 }} />
        </div>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(28px,3vw,42px)" }}>
              <Kicker>Prise en charge</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4.4vw,56px)", fontWeight: 400, color: C.ink, marginTop: 18, lineHeight: 1.06, letterSpacing: "-0.014em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                  <>
                    La maternité, <em style={{ fontStyle: "italic", color: C.accent }}>c'est remboursé.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 15, color: C.textMuted, maxWidth: 580, marginTop: 16, lineHeight: 1.78 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.texte") ?? (
                  <>Consultations au tarif conventionné, remboursées à 70 % puis 100 % du 6e mois au 12e jour après la naissance. Tiers payant pratiqué.</>
                )}
              </p>
            </div>
          </Reveal>
          <div>
            {TARIFS.map((t: any, idx: number) => (
              <TarifLigne key={`${t.a}-${idx}`} t={t} idx={idx} />
            ))}
            <div style={{ borderTop: `1px solid ${C.border}` }} />
          </div>
        </div>
      </section>

      {/* ══ ENGAGEMENTS — la seule photographie de la page ════════════════ */}
      <section id="engagements" style={{ background: C.bg, padding: "clamp(72px,9vw,132px) clamp(20px,5vw,72px)" }}>
        <div
          className="i367-split"
          style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,0.92fr) minmax(0,1.08fr)", gap: "clamp(28px,5vw,72px)", alignItems: "center" }}
        >
          <Reveal>
            <div style={{ position: "relative" }}>
              {/* Sans image : un aplat rosé et une arche — la section reste
                  tenue, elle n'est simplement pas photographiée. */}
              <div
                style={{
                  borderRadius: 26,
                  border: `1px solid ${C.border}`,
                  background: photoCabinet ? C.accentLight : `radial-gradient(circle at 50% 30%, ${C.accentLight} 0%, ${C.bg} 70%)`,
                  aspectRatio: "4/5",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                {photoCabinet ? (
                  <img src={photoCabinet} alt="Consultation de suivi de grossesse" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                  <div style={{ width: "76%", paddingBottom: "18%" }}>
                    <Arche color={C.accent} opacity={0.4} height={140} />
                  </div>
                )}
              </div>
              {/* Détail gratuit : une arche posée en débord, le motif du thème. */}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  left: "-7%",
                  bottom: "-5%",
                  width: "46%",
                  aspectRatio: "2/1",
                  borderRadius: "0 0 100% 100% / 0 0 100% 100%",
                  border: `1px solid ${C.accent}`,
                  borderTop: "none",
                  opacity: 0.35,
                  pointerEvents: "none",
                }}
              />
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              <Kicker>Le cabinet</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,4vw,50px)", fontWeight: 400, color: C.ink, margin: "18px 0 26px", lineHeight: 1.08, letterSpacing: "-0.014em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>
                    Conventionnée,
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accent }}>et engagée.</em>
                  </>
                )}
              </h2>
              {ENGAGEMENT.map((e: string, idx: number) => (
                <div key={idx} style={{ display: "flex", gap: 13, marginBottom: 16, paddingBottom: 16, borderBottom: idx < ENGAGEMENT.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <CheckCircle size={17} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontFamily: SANS, fontSize: 15, color: C.textMuted, lineHeight: 1.72 }}>{e}</span>
                </div>
              ))}
              <div style={{ marginTop: 26 }}>
                <CTA href={telHref} filled>
                  Nous appeler
                </CTA>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ AVIS — ruban lent sur fond profond, arrêté au survol ══════════ */}
      <section style={{ position: "relative", background: C.bgDark, padding: "clamp(76px,9vw,134px) 0", overflow: "hidden" }}>
        {/* glow rosé très faible : le fond sombre ne doit pas être un trou */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: "-30%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(120vw, 1100px)",
            aspectRatio: "1",
            borderRadius: "50%",
            background: `radial-gradient(circle at 50% 50%, ${C.berceau} 0%, transparent 62%)`,
            opacity: 0.1,
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", padding: "0 clamp(20px,5vw,72px)", marginBottom: "clamp(34px,4vw,54px)" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
              <Kicker color={C.berceau} align="center">
                Elles racontent
              </Kicker>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,4vw,52px)", fontWeight: 400, color: C.white, textAlign: "center", lineHeight: 1.08, letterSpacing: "-0.014em", margin: 0 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                <>
                  Des débuts <em style={{ fontStyle: "italic", color: C.berceau }}>bien entourés</em>.
                </>
              )}
            </h2>
          </Reveal>
        </div>
        <div className="i367-rubanwrap" style={{ position: "relative", overflowX: "auto", paddingBottom: 8 }}>
          <div className="i367-ruban" style={{ display: "flex", gap: "clamp(14px,1.8vw,22px)", padding: "6px clamp(20px,5vw,72px)", width: "max-content" }}>
            {RUBAN.map((a: any, idx: number) => (
              <AvisCarte key={`${a.auteur}-${idx}`} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTACT ═══════════════════════════════════════════════════════ */}
      <section id="contact" style={{ background: C.bgAlt, padding: "clamp(72px,9vw,132px) clamp(20px,5vw,72px)" }}>
        <div className="i367-contact" style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1.06fr) minmax(0,0.94fr)", gap: "clamp(28px,5vw,72px)", alignItems: "center" }}>
          <Reveal>
            <div>
              <Kicker>Rencontrons-nous</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4.6vw,58px)", fontWeight: 400, color: C.ink, margin: "18px 0 18px", lineHeight: 1.06, letterSpacing: "-0.014em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                  <>
                    Votre histoire commence,
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accent }}>parlons-en tôt.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 16, color: C.textMuted, maxWidth: 480, lineHeight: 1.8, marginBottom: 30 }}>
                {clientTagline(sessionData) ?? "Idéalement avant la fin du 3e mois pour l'entretien prénatal. Rendez-vous par téléphone — je rappelle entre deux consultations."}
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <CTA href={telHref} filled big>
                  <Phone size={17} /> {phone}
                </CTA>
                <CTA href={`mailto:${mail}`} big>
                  <Mail size={17} /> Nous écrire
                </CTA>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div
              className="i367-sticky"
              style={{ position: "sticky", top: 116, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 26, padding: "clamp(24px,2.6vw,34px)", boxShadow: "0 40px 76px -64px rgba(44,30,32,0.7)" }}
            >
              <Kicker color={C.textFaint}>Le cabinet</Kicker>
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <MapPin size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontFamily: SANS, fontSize: 14.5, color: C.textMuted, lineHeight: 1.68 }}>{clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "13100", "Aix-en-Provence")}</span>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Phone size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <a href={telHref} style={{ fontFamily: SANS, fontSize: 14.5, color: C.ink, textDecoration: "none" }}>
                    {phone}
                  </a>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Mail size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <a href={`mailto:${mail}`} style={{ fontFamily: SANS, fontSize: 14.5, color: C.ink, textDecoration: "none", wordBreak: "break-word" }}>
                    {mail}
                  </a>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Clock size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontFamily: SANS, fontSize: 14.5, color: C.textMuted, lineHeight: 1.68 }}>Lun–Ven 8h30–19h · urgences patientèle 7j/7</span>
                </div>
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 22, paddingTop: 18 }}>
                <p style={{ fontFamily: SANS, fontSize: 13.5, color: C.textMuted, lineHeight: 1.72, margin: 0 }}>
                  {ZONES.length >= 2 ? `Visites à domicile à ${ZONES.slice(0, 6).join(", ")}.` : `Visites à domicile à ${ville} et dans sa couronne, coordination PRADO avec la maternité.`}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ PIED ══════════════════════════════════════════════════════════ */}
      <footer style={{ background: C.bgDarkAlt, padding: "clamp(44px,5vw,64px) clamp(20px,5vw,72px) 26px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 34 }}>
            <div style={{ maxWidth: 380 }}>
              <div style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 500, color: C.berceau, marginBottom: 10 }}>{cabinet}</div>
              <p style={{ fontFamily: SANS, color: "rgba(255,255,255,0.40)", fontSize: 13, lineHeight: 1.75, margin: 0 }}>
                {metier} libérale · {ville}
                <br />
                Conventionnée CPAM — Ordre des sages-femmes, n° RPPS affiché
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <MapPin size={13} />, t: clientAddress(sessionData) ?? `${ville}, Bouches-du-Rhône` },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Mail size={13} />, t: mail },
                { icon: <Clock size={13} />, t: "Lun–Ven 8h30–19h · urgences patientèle 7j/7" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.44)", fontFamily: SANS, fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.berceau, display: "flex" }}>{item.icon}</span>
                  {item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontFamily: SANS, color: "rgba(255,255,255,0.28)", fontSize: 12 }}>
              © 2026 {cabinet} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
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
