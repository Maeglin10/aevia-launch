"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, Ear, Mail, MapPin, Phone, Star, Volume2 } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { HairlineArrows, SlideIndex } from "@/lib/templates/hero-kit-2";
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

/* ════════════════════════════════════════════════════════════════════════════
   {clientName(sessionData) ?? "Maison de l'Audition"} — Audioprothésistes D.E. · Tours
   Geste signature : ParticleOrb (hero-kit-3), mais lu comme une ONDE et non
   comme une planète : l'orbe est posé à droite, à hauteur d'oreille, et des
   anneaux CSS s'en échappent — la source, puis la propagation. Rien n'est
   centré, rien n'est symétrique : c'est ce qui sépare ce thème du 367, qui
   pose le même orbe au centre d'un héros centré.
   Archétype H6 : typographique, sans photographie, textures en courbes CSS.
   Paire de fontes P3 : Cormorant Garamond (serif de titre) × system-ui.
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

/* ── Fontes ──────────────────────────────────────────────────────────────── */
const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');`;
const SERIF = "'Cormorant Garamond', Garamond, Georgia, serif";
const SANS = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
// Les sous-pages du thème lisent encore FONT/FONT_BODY : on garde les deux noms.
const FONT = SERIF;
const FONT_BODY = SANS;

/* ── Courbe d'accélération unique du thème ───────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_CSS = "cubic-bezier(.16,1,.3,1)";

/* ── Jetons ──────────────────────────────────────────────────────────────── */
let C: Record<string, string> = {
  bg: "#fdfaf5",
  bgAlt: "#f5ecdd",
  bgDark: "#24190f",
  bgDarkAlt: "#1a120a",
  bgCard: "#ffffff",
  accent: "var(--brand, #c07a2c)",
  accentDark: "var(--brand-light, #96591b)",
  accentLight: "#f6e6cf",
  ink: "#241c12",
  textMuted: "#6c5f4e",
  textFaint: "#9c8c78",
  border: "#e8dcc7",
  white: "#ffffff",
  // Clé métier : la teinte de l'onde — les anneaux, l'orbe, les courbes.
  onde: "#d9a860",
};

const NAV = [
  { l: "Accompagnements", h: "#services" },
  { l: "Le parcours", h: "#methode" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* ════════════════════════════════════════════════════════════════════════════
   Données de démonstration.

   Sources figées (champs de présentation du thème) d'un côté, listes vivantes
   de l'autre — recalculées dans le corps du rendu, une fois la session
   affectée. Une constante évaluée à l'import ne verrait jamais le client.
   ════════════════════════════════════════════════════════════════════════════ */

const SERVICES_SOURCE = [
  { titre: "Bilan auditif complet", desc: "Audiométrie tonale et vocale en cabine, dans le calme et dans le bruit. Résultats expliqués, compte rendu transmis à votre médecin.", tag: "Bilan" },
  { titre: "Essai 30 jours", desc: "Vos appareils réglés puis portés un mois dans votre vraie vie : repas de famille, téléphone, télévision. On ajuste, vous décidez.", tag: "Essai" },
  { titre: "Appareillage sur mesure", desc: "Intra-auriculaires invisibles, contours discrets, connectés au téléphone. Toutes grandes marques, choisies pour votre perte, pas pour la marge.", tag: "Appareils" },
  { titre: "Suivi 4 ans inclus", desc: "Réglages illimités, nettoyages, contrôles semestriels : inclus dans le prix affiché, comme l'exige le 100 % Santé — et au-delà.", tag: "Suivi" },
  { titre: "Protections auditives", desc: "Bouchons sur mesure pour musiciens, chasseurs, travail en bruit et sommeil. Empreintes prises au centre.", tag: "Protection" },
  { titre: "Acouphènes", desc: "Bilan spécifique et solutions d'habituation sonore. On ne promet pas de miracle : on améliore le quotidien, mesurablement.", tag: "Acouphènes" },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE_SOURCE = [
  { n: "01", t: "Bilan et écoute", d: "Une heure pour mesurer votre audition et comprendre vos situations difficiles — la réunion, le restaurant, les aigus." },
  { n: "02", t: "Choix argumenté", d: "Deux ou trois appareils proposés avec prix, classe et différences expliquées. Le devis normalisé part avec vous." },
  { n: "03", t: "Essai d'un mois", d: "Port réel à domicile, réglages à mi-parcours. Vous ne payez qu'à l'adoption, jamais à l'essai." },
  { n: "04", t: "Suivi de long terme", d: "Réglages illimités 4 ans, remplacement des pièces d'usure, contrôle annuel de l'audition." },
];
const METHODE = METHODE_SOURCE;

const ENGAGEMENT_SOURCE = [
  "Audioprothésistes diplômés d'État — le titre est protégé, le nôtre est affiché",
  "Devis normalisé systématique : classe I (0 € de reste à charge) toujours proposée",
  "Essai de 30 jours sans engagement, prescription médicale respectée",
  "Tiers payant Sécurité sociale et mutuelles : aucune avance de frais",
];
let ENGAGEMENT = ENGAGEMENT_SOURCE;

const TARIFS_SOURCE = [
  { a: "Appareil classe I (100 % Santé)", p: "0 € de reste à charge", n: "Prix plafonné 950 €, intégralement remboursé Sécurité sociale + mutuelle responsable.", phare: true },
  { a: "Appareil classe II", p: "dès 1 190 €", n: "Technologies premium : réduction de bruit avancée, connectivité, rechargeable. Remboursement partiel.", phare: false },
  { a: "Bilan auditif", p: "offert", n: "Audiométrie complète en cabine. Le bilan médical ORL reste indispensable pour la prescription.", phare: false },
  { a: "Protections sur mesure", p: "dès 89 €", n: "La paire, empreintes et ajustage compris.", phare: false },
];
let TARIFS = TARIFS_SOURCE;

const AVIS_SOURCE = [
  { texte: "Trois ans à faire répéter tout le monde. Après l'essai d'un mois, j'ai signé : au repas de Noël, j'ai suivi toutes les conversations, même en bout de table.", auteur: "Michel P., 71 ans", detail: "Appareillage classe II" },
  { texte: "Ma mutuelle ne couvre pas grand-chose : l'audioprothésiste a défendu la classe I d'emblée. Zéro euro, et elle entend la télévision sans la mettre à fond.", auteur: "Fils de Mme R.", detail: "100 % Santé" },
  { texte: "Acouphènes depuis dix ans. Pas de promesse magique ici, mais un vrai protocole : je dors à nouveau, et le sifflement s'oublie des heures entières.", auteur: "Laurence V.", detail: "Prise en charge acouphènes" },
];
let AVIS_DEMO = AVIS_SOURCE;

const STATS_SOURCE = [
  { value: "30 j", label: "D'essai réel, à domicile" },
  { value: "0 €", label: "Reste à charge classe I" },
  { value: "4 ans", label: "De suivi et réglages inclus" },
  { value: "2", label: "Audioprothésistes D.E." },
];
let STATS = STATS_SOURCE;

/* ── Photos ──────────────────────────────────────────────────────────────── */
/**
 * L'image téléversée à cet emplacement, sinon celle du thème.
 *
 * `||` et non `??` : une chaîne vide est un emplacement non pourvu. Les
 * emplacements sans URL de thème rendent des anneaux CSS sur fond sombre —
 * la page reste tenue images bloquées.
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

/** Sur-titre : filet de 40 px puis capitales très espacées. */
function Kicker({ children, color = C.accentDark, align = "left" }: { children: React.ReactNode; color?: string; align?: "left" | "center" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: align === "center" ? "center" : "flex-start" }}>
      <span style={{ width: 40, height: 1, background: color, opacity: 0.75, flexShrink: 0 }} />
      <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.38em", textTransform: "uppercase", color }}>{children}</span>
      {align === "center" && <span style={{ width: 40, height: 1, background: color, opacity: 0.75, flexShrink: 0 }} />}
    </div>
  );
}

/**
 * L'onde, dessinée : une sinusoïde d'un pixel, tracée en SVG.
 *
 * Le thème n'a pas de photographie au-dessus de la ligne de flottaison. Ce
 * trait est ce qui empêche les grands aplats de paraître vides — et il dit le
 * métier sans qu'on ait à l'écrire.
 */
function Onde({ color, opacity = 0.5, height = 46, style }: { color: string; opacity?: number; height?: number; style?: React.CSSProperties }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      style={{ display: "block", width: "100%", height, opacity, pointerEvents: "none", ...style }}
    >
      <path d="M0 30 C 75 0, 125 60, 200 30 S 325 0, 400 30 S 525 60, 600 30 S 725 0, 800 30 S 925 60, 1000 30 S 1125 0, 1200 30" fill="none" stroke={color} strokeWidth="1" />
      <path d="M0 30 C 100 14, 150 46, 250 30 S 400 14, 500 30 S 650 46, 750 30 S 900 14, 1000 30 S 1150 46, 1200 30" fill="none" stroke={color} strokeWidth="1" opacity="0.45" />
    </svg>
  );
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
        fontWeight: 500,
        color: h ? C.ink : C.textMuted,
        textDecoration: "none",
        padding: "12px 2px",
        transition: `color .45s ${EASE_CSS}`,
      }}
    >
      {label}
      <span style={{ position: "absolute", left: 0, bottom: 6, height: 1, width: h ? "100%" : "0%", background: C.accent, transition: `width .5s ${EASE_CSS}` }} />
    </a>
  );
}

/** Bouton : le thème est doux, ses boutons sont donc des galets. */
function CTA({ href, children, filled = false, big = false }: { href: string; children: React.ReactNode; filled?: boolean; big?: boolean }) {
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
        fontWeight: 600,
        padding: big ? "16px 32px" : "13px 26px",
        borderRadius: 999,
        textDecoration: "none",
        border: `1px solid ${filled ? "transparent" : C.border}`,
        background: filled ? (h ? C.accentDark : C.accent) : h ? C.white : "transparent",
        color: filled ? C.white : C.ink,
        transform: h ? "translateY(-2px)" : "none",
        boxShadow: h
          ? `0 16px 34px -20px rgba(36,25,15,0.6), 0 2px 0 0 ${filled ? "rgba(255,255,255,0.2)" : C.accentLight}`
          : "0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0)",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      {children}
      <ArrowRight size={15} style={{ transform: h ? "translateX(5px)" : "none", transition: `transform .5s ${EASE_CSS}` }} />
    </a>
  );
}

/** Un accompagnement, en médaillon : l'anneau se referme au survol. */
function MedaillonCard({ s, idx }: { s: any; idx: number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={Math.min(idx, 5) * 0.06}>
      <article
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          position: "relative",
          height: "100%",
          background: h ? C.bgCard : "rgba(255,255,255,0.55)",
          border: `1px solid ${h ? C.accentLight : C.border}`,
          borderRadius: 22,
          padding: "clamp(26px,2.8vw,34px)",
          overflow: "hidden",
          transform: h ? "translateY(-5px)" : "none",
          boxShadow: h ? `0 30px 54px -40px rgba(36,25,15,0.55), 0 2px 0 0 ${C.accentLight}` : "0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0)",
          transition: `all .5s ${EASE_CSS}`,
        }}
      >
        {/* L'anneau d'onde en fond du médaillon : il grandit au survol. */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: -70,
            right: -70,
            width: 190,
            height: 190,
            borderRadius: "50%",
            border: `1px solid ${C.accent}`,
            opacity: h ? 0.28 : 0.14,
            transform: h ? "scale(1.08)" : "scale(1)",
            transition: `all .55s ${EASE_CSS}`,
            pointerEvents: "none",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: `1px solid ${h ? C.accent : C.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: SERIF,
              fontSize: 17,
              color: h ? C.accent : C.textFaint,
              flexShrink: 0,
              transition: `all .5s ${EASE_CSS}`,
            }}
          >
            {String(idx + 1).padStart(2, "0")}
          </span>
          <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: C.accentDark }}>{s.tag}</span>
        </div>
        <h3 style={{ fontFamily: SERIF, fontSize: "clamp(23px,2.3vw,29px)", fontWeight: 500, color: C.ink, lineHeight: 1.12, margin: "0 0 12px", letterSpacing: "-0.005em" }}>{s.titre}</h3>
        <p style={{ fontFamily: SANS, fontSize: 14.5, color: C.textMuted, lineHeight: 1.78, margin: 0 }}>{s.desc}</p>
      </article>
    </Reveal>
  );
}

/** Une étape du parcours, posée sur la courbe. */
function EtapeCard({ m, idx }: { m: any; idx: number }) {
  const [h, setH] = useState(false);
  // Les quatre étapes ne sont pas alignées : elles suivent une courbe.
  const offsets = [0, 26, 26, 0];
  return (
    <Reveal delay={idx * 0.08}>
      <div
        className="i339-etape"
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          position: "relative",
          marginTop: offsets[idx % 4],
          height: "100%",
          background: h ? C.bgCard : "transparent",
          border: `1px solid ${h ? C.accentLight : "transparent"}`,
          borderRadius: 20,
          padding: "clamp(20px,2.2vw,28px)",
          boxShadow: h ? "0 26px 50px -42px rgba(36,25,15,0.6), 0 2px 0 0 rgba(217,168,96,0.35)" : "0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0)",
          transform: h ? "translateY(-4px)" : "none",
          transition: `all .5s ${EASE_CSS}`,
        }}
      >
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: -7,
            left: "clamp(20px,2.2vw,28px)",
            width: 13,
            height: 13,
            borderRadius: "50%",
            background: h ? C.accent : C.bg,
            border: `1px solid ${C.accent}`,
            boxShadow: `0 0 0 5px ${C.bg}`,
            transition: `background .5s ${EASE_CSS}`,
          }}
        />
        <div style={{ fontFamily: SERIF, fontSize: "clamp(38px,4vw,54px)", color: h ? C.accent : C.accentLight, lineHeight: 0.92, marginTop: 12, marginBottom: 14, transition: `color .5s ${EASE_CSS}` }}>{m.n}</div>
        <h3 style={{ fontFamily: SERIF, fontSize: "clamp(21px,2.1vw,26px)", fontWeight: 500, color: C.ink, lineHeight: 1.14, margin: "0 0 10px" }}>{m.t}</h3>
        <p style={{ fontFamily: SANS, fontSize: 14, color: C.textMuted, lineHeight: 1.74, margin: 0 }}>{m.d}</p>
      </div>
    </Reveal>
  );
}

/** Une ligne de tarif : la classe I porte son propre liseré. */
function TarifLigne({ t, idx }: { t: any; idx: number }) {
  const [h, setH] = useState(false);
  const phare = Boolean(t.phare);
  return (
    <Reveal delay={idx * 0.05}>
      <div
        className="i339-tarif"
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) auto",
          gap: "clamp(12px,3vw,40px)",
          alignItems: "baseline",
          padding: "clamp(20px,2.2vw,28px) clamp(16px,2vw,26px)",
          background: phare ? C.accentLight : h ? C.bgCard : "transparent",
          borderRadius: 16,
          border: `1px solid ${phare ? C.accent : h ? C.border : "transparent"}`,
          marginBottom: 10,
          transform: h ? "translateX(4px)" : "none",
          boxShadow: h ? "0 22px 44px -40px rgba(36,25,15,0.6), 0 2px 0 0 rgba(217,168,96,0.3)" : "0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0)",
          transition: `all .5s ${EASE_CSS}`,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: SERIF, fontSize: "clamp(20px,2vw,25px)", fontWeight: 500, color: C.ink, letterSpacing: "-0.005em" }}>{t.a}</div>
          <div style={{ fontFamily: SANS, fontSize: 13.5, color: C.textMuted, lineHeight: 1.72, marginTop: 7, maxWidth: 540 }}>{t.n}</div>
        </div>
        <div style={{ fontFamily: SERIF, fontSize: "clamp(19px,2vw,24px)", color: C.accentDark, whiteSpace: "nowrap" }}>{t.p}</div>
      </div>
    </Reveal>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════════════════ */
export default function MaisonAuditionPage() {
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
  brand = fd?.brandColor ?? null;
  if (brand) {
    C = { ...C, accent: brand };
  }

  /* ── Listes ────────────────────────────────────────────────────────────── */
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
  /*
    Le spotlight des avis n'a pas d'horloge : le geste du thème est l'orbe, qui
    tourne en continu. Un second automatisme volerait l'attention à celui-là —
    ici le visiteur avance lui-même, à son rythme.
  */
  const [avisIndex, setAvisIndex] = useState(0);
  const avisCourant = AVIS[avisIndex % AVIS.length];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  /* ── Contact ───────────────────────────────────────────────────────────── */
  const phone = clientPhone(sessionData) ?? fd?.phone ?? "02 47 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33247000000").replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "rdv@maison-audition-tours.fr";
  const maison = fd?.businessName ?? clientName(sessionData) ?? "Maison de l'Audition";
  const ville = clientCity(sessionData) ?? "Tours";
  const metier = clientTrade(sessionData) ?? "Audioprothésistes";

  const photoCabine = photo(1, "");

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip" }}>
      <style>{`
        ${FONTS_CSS}

        @media (max-width: 980px) { #i339-nav { display: none !important; } .i339-burger { display: flex !important; } }

        /* Héros : deux colonnes désaxées au-dessus de 980px, une seule en
           dessous — l'orbe passe alors SOUS le titre, jamais derrière lui
           (le texte doit rester lisible sur un canevas animé). */
        @media (max-width: 980px) {
          .i339-hero { grid-template-columns: minmax(0,1fr) !important; gap: 36px !important; padding-top: 120px !important; }
          .i339-orbwrap { margin: 0 auto !important; max-width: 460px !important; }
        }
        @media (max-width: 860px) {
          .i339-split { grid-template-columns: minmax(0,1fr) !important; gap: 34px !important; }
          .i339-contact { grid-template-columns: minmax(0,1fr) !important; }
          .i339-statrail { grid-template-columns: repeat(auto-fit, minmax(min(140px,100%),1fr)) !important; }
          /* Les étapes ne suivent plus la courbe : elles s'empilent droit. */
          .i339-etape { margin-top: 0 !important; }
          .i339-sticky { position: static !important; }
        }
        @media (max-width: 640px) {
          .i339-tarif { grid-template-columns: minmax(0,1fr) !important; }
        }

        /* Les anneaux qui s'échappent de l'orbe : la propagation, en CSS. */
        @keyframes i339-onde {
          0%   { transform: scale(0.62); opacity: 0; }
          18%  { opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .i339-anneau { animation: i339-onde 7.2s ${EASE_CSS} infinite; }
        .i339-anneau-2 { animation-delay: 2.4s; }
        .i339-anneau-3 { animation-delay: 4.8s; }

        @media (prefers-reduced-motion: reduce) {
          .i339-anneau { animation: none !important; opacity: 0.22 !important; transform: scale(1) !important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
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
          background: scrolled ? "rgba(253,250,245,0.93)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          transition: `all .55s ${EASE_CSS}`,
        }}
      >
        <a href="#hero" style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, textDecoration: "none" }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={maison} style={{ height: 30, maxWidth: 170, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Ear size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 500, color: C.ink, letterSpacing: "0.005em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{maison}</span>
            </>
          )}
        </a>
        <div id="i339-nav" style={{ display: "flex", gap: "clamp(18px,2.2vw,30px)", alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <NavLink key={l} label={l} href={h} />
          ))}
          <CTA href={telHref} filled>
            Bilan auditif offert
          </CTA>
        </div>
        <button
          className="i339-burger"
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
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ fontFamily: SANS, color: C.ink, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "12px 0" }}>
              {l}
            </a>
          ))}
          <a href={telHref} style={{ fontFamily: SANS, background: C.accent, color: C.white, borderRadius: 999, padding: "14px 22px", fontSize: 15, fontWeight: 600, textDecoration: "none", textAlign: "center", marginTop: 10 }}>
            Bilan auditif offert
          </a>
        </div>
      )}

      {/* ══ HERO — H6 : typographie à gauche, source sonore à droite ══════ */}
      <section
        id="hero"
        className="i339-hero"
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "grid",
          gridTemplateColumns: "minmax(0,1.12fr) minmax(0,0.88fr)",
          alignItems: "center",
          gap: "clamp(28px,4vw,64px)",
          padding: "clamp(136px,13vw,172px) clamp(20px,5vw,76px) clamp(56px,7vw,88px)",
          maxWidth: 1300,
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        {/* Texture : un « 30 » fantôme, les trente jours d'essai. */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: "clamp(-26px,-2vw,0px)",
            bottom: "clamp(6px,3vw,54px)",
            fontFamily: SERIF,
            fontSize: "clamp(150px,24vw,340px)",
            lineHeight: 0.74,
            color: C.accent,
            opacity: 0.07,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          30
        </span>

        <div style={{ position: "relative", zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}>
            <Kicker>{clientEyebrow(sessionData) ?? `${metier} · ${ville}`}</Kicker>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 1, ease: EASE }}
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(44px,7.4vw,104px)",
              fontWeight: 300,
              color: C.ink,
              lineHeight: 0.99,
              letterSpacing: "-0.018em",
              margin: "clamp(20px,2.6vw,36px) 0 clamp(18px,2vw,28px)",
            }}
          >
            {/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ?? (
              <>
                {c?.heroHeadline ?? (
                  <>
                    {clientHeroLine(sessionData, 0, 2, 18) ?? "Réentendre les voix,"}
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accent }}>{clientHeroLine(sessionData, 1, 2, 18) ?? "pas seulement le bruit."}</em>
                  </>
                )}
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.46, duration: 0.9, ease: EASE }}
            style={{ fontFamily: SANS, fontSize: "clamp(15.5px,1.5vw,17px)", color: C.textMuted, lineHeight: 1.82, maxWidth: 500, marginBottom: "clamp(26px,3vw,36px)" }}
          >
            {clientHeroSubtitle(sessionData) ??
              c?.heroSubline ??
              "Bilan auditif complet, essai réel de 30 jours à domicile, réglages illimités. Des appareils invisibles au 100 % Santé sans reste à charge — choisis pour votre oreille, pas pour la vitrine."}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62, duration: 0.85, ease: EASE }} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <CTA href={telHref} filled big>
              Réserver un bilan auditif
            </CTA>
            <CTA href="#services">Nos accompagnements</CTA>
          </motion.div>

          {/* Les chiffres, en bas de héros, séparés par une onde d'un pixel. */}
          <div style={{ marginTop: "clamp(30px,3.6vw,48px)" }}>
            <Onde color={C.accent} opacity={0.3} height={26} />
            <div className="i339-statrail" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(150px,100%), 1fr))", gap: "clamp(10px,1.4vw,20px)", marginTop: 16 }}>
              {STATS.map((s: any, idx: number) => (
                <Reveal key={s.label ?? idx} delay={idx * 0.07} y={12}>
                  <div>
                    <div style={{ fontFamily: SERIF, fontSize: "clamp(28px,3vw,38px)", color: C.accent, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontFamily: SANS, fontSize: 11.5, color: C.textFaint, marginTop: 8, lineHeight: 1.5 }}>{s.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* La source : l'orbe, à hauteur d'oreille, et ses anneaux. */}
        <div className="i339-orbwrap" style={{ position: "relative", zIndex: 1, aspectRatio: "1", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {[0, 1, 2].map((n) => (
            <span
              key={n}
              aria-hidden
              className={`i339-anneau${n === 1 ? " i339-anneau-2" : n === 2 ? " i339-anneau-3" : ""}`}
              style={{
                position: "absolute",
                inset: "6%",
                borderRadius: "50%",
                border: `1px solid ${C.onde}`,
                pointerEvents: "none",
              }}
            />
          ))}
          {/* Le halo derrière l'orbe : sans lui, le canevas paraît découpé. */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: "10%",
              borderRadius: "50%",
              background: `radial-gradient(circle at 50% 50%, ${C.accentLight} 0%, rgba(246,230,207,0.35) 45%, transparent 72%)`,
              pointerEvents: "none",
            }}
          />
          <ParticleOrb
            color={C.onde}
            count={380}
            seconds={64}
            className=""
            style={{
              position: "relative",
              width: "84%",
              aspectRatio: "1",
              opacity: 0.72,
              pointerEvents: "none",
            }}
          />
          {/* Le repère de lecture : l'orbe est une onde, on le dit une fois. */}
          <span
            style={{
              position: "absolute",
              bottom: "2%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: SANS,
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: C.textFaint,
              whiteSpace: "nowrap",
            }}
          >
            <Volume2 size={13} color={C.accent} /> Le son, rendu visible
          </span>
        </div>
      </section>

      {/* ══ RESPIRATION ═══════════════════════════════════════════════════ */}
      <section style={{ background: C.bgAlt, padding: "clamp(76px,10vw,146px) clamp(24px,8vw,140px)", textAlign: "center" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
            <Kicker color={C.textMuted} align="center">
              La maison
            </Kicker>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(24px,3.6vw,50px)", lineHeight: 1.32, fontWeight: 300, maxWidth: 960, margin: "0 auto", color: C.ink }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (
              <>On n'appareille pas une oreille : on rend à quelqu'un les conversations qu'il avait cessé de suivre.</>
            )}
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div style={{ maxWidth: 560, margin: "clamp(34px,4vw,52px) auto 0" }}>
            <Onde color={C.accent} opacity={0.4} height={40} />
          </div>
        </Reveal>
      </section>

      {/* ══ LE PARCOURS — quatre temps posés sur la courbe ════════════════ */}
      <section id="methode" style={{ position: "relative", background: C.bg, padding: "clamp(72px,9vw,128px) clamp(20px,5vw,72px)", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(34px,4vw,54px)", maxWidth: 720 }}>
              <Kicker>Le parcours</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4.6vw,60px)", fontWeight: 400, color: C.ink, marginTop: 18, lineHeight: 1.06, letterSpacing: "-0.012em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                  <>
                    Quatre rendez-vous
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accent }}>pour réentendre durablement.</em>
                  </>
                )}
              </h2>
            </div>
          </Reveal>
          <div style={{ position: "relative" }}>
            {/* La courbe qui relie les quatre temps — pas une ligne droite. */}
            <svg aria-hidden viewBox="0 0 1200 90" preserveAspectRatio="none" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 90, pointerEvents: "none" }}>
              <path d="M40 12 C 260 12, 300 62, 480 62 S 760 62, 900 20 S 1120 12, 1180 14" fill="none" stroke={C.accent} strokeWidth="1" opacity="0.4" />
            </svg>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px,100%), 1fr))", gap: "clamp(12px,1.8vw,22px)", paddingTop: 14 }}>
              {METHODE.map((m, idx) => (
                <EtapeCard key={m.n} m={m} idx={idx} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ ACCOMPAGNEMENTS — médaillons ══════════════════════════════════ */}
      <section id="services" style={{ background: C.bgAlt, padding: "clamp(72px,9vw,128px) clamp(20px,5vw,72px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(32px,3.8vw,50px)", maxWidth: 720 }}>
              <Kicker>Accompagnements</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4.6vw,60px)", fontWeight: 400, color: C.ink, marginTop: 18, lineHeight: 1.06, letterSpacing: "-0.012em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                  <>
                    L'audition se règle,
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accent }}>elle ne s'achète pas.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 15.5, color: C.textMuted, lineHeight: 1.8, maxWidth: 520, marginTop: 18 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "services.texte") ?? (
                  <>Six accompagnements, un seul principe : le réglage compte davantage que l'appareil, et le suivi davantage que la vente.</>
                )}
              </p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px,100%), 1fr))", gap: "clamp(14px,1.8vw,22px)" }}>
            {SERVICES.map((s: any, idx: number) => (
              <MedaillonCard key={`${s.titre}-${idx}`} s={s} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ TARIFS — le 100 % Santé en tête, pas en note de bas de page ═══ */}
      <section id="tarifs" style={{ background: C.bg, padding: "clamp(72px,9vw,128px) clamp(20px,5vw,72px)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(26px,3vw,40px)" }}>
              <Kicker>Tarifs</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4.4vw,56px)", fontWeight: 400, color: C.ink, marginTop: 18, lineHeight: 1.06, letterSpacing: "-0.012em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                  <>
                    Le 100 % Santé, <em style={{ fontStyle: "italic", color: C.accent }}>pour de vrai.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 15, color: C.textMuted, maxWidth: 580, marginTop: 16, lineHeight: 1.78 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.texte") ?? (
                  <>
                    Depuis 2021, chaque devis comporte obligatoirement une offre 100 % Santé (classe I). Chez nous, elle est présentée en premier — pas en note de bas de page.
                  </>
                )}
              </p>
            </div>
          </Reveal>
          <div>
            {TARIFS.map((t: any, idx: number) => (
              <TarifLigne key={`${t.a}-${idx}`} t={t} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ ENGAGEMENTS — split, avec la seule photographie de la page ════ */}
      <section id="engagements" style={{ background: C.bgAlt, padding: "clamp(72px,9vw,128px) clamp(20px,5vw,72px)" }}>
        <div
          className="i339-split"
          style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,0.94fr) minmax(0,1.06fr)", gap: "clamp(28px,5vw,72px)", alignItems: "center" }}
        >
          <Reveal>
            <div style={{ position: "relative" }}>
              <div style={{ borderRadius: 24, border: `1px solid ${C.border}`, background: C.accentLight, aspectRatio: "4/5", overflow: "hidden" }}>
                <img
                  src={photo(0, "https://images.pexels.com/photos/5206951/pexels-photo-5206951.jpeg?auto=compress&cs=tinysrgb&w=1400")}
                  alt="Examen de l'oreille à l'otoscope"
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
              {/* Anneau d'onde posé en débord : le motif du thème, une fois de plus. */}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  left: "-8%",
                  bottom: "-6%",
                  width: "42%",
                  aspectRatio: "1",
                  borderRadius: "50%",
                  border: `1px solid ${C.accent}`,
                  opacity: 0.35,
                  pointerEvents: "none",
                }}
              />
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              <Kicker>Nos engagements</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,4vw,50px)", fontWeight: 400, color: C.ink, margin: "18px 0 26px", lineHeight: 1.08, letterSpacing: "-0.012em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>
                    La transparence,
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accent }}>jusqu'au tympan.</em>
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

      {/* ══ LA CABINE — bande sombre, repli sans image assumé ═════════════ */}
      <section style={{ position: "relative", background: C.bgDark, overflow: "hidden" }}>
        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "minmax(0,1fr)", minHeight: "clamp(280px,34vw,420px)" }}>
          {photoCabine ? (
            <img src={photoCabine} alt="Cabine d'audiométrie du centre" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: 0.55 }} />
          ) : (
            /* Sans image : des anneaux concentriques sur le fond sombre — la
               section reste une image, elle n'est simplement pas photographiée. */
            <span
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(circle at 78% 50%, rgba(217,168,96,0.16) 0%, transparent 55%), repeating-radial-gradient(circle at 78% 50%, rgba(217,168,96,0.16) 0px, rgba(217,168,96,0.16) 1px, transparent 1px, transparent 58px)`,
                pointerEvents: "none",
              }}
            />
          )}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 18,
              padding: "clamp(48px,6vw,84px) clamp(20px,5vw,72px)",
              maxWidth: 900,
              background: photoCabine ? "linear-gradient(90deg, rgba(26,18,10,0.94) 0%, rgba(26,18,10,0.78) 55%, rgba(26,18,10,0.2) 100%)" : "transparent",
            }}
          >
            <Kicker color={C.onde}>La cabine</Kicker>
            <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(22px,3.2vw,42px)", lineHeight: 1.28, fontWeight: 300, color: C.white, maxWidth: 720, margin: 0 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "cabine.texte") ?? (
                <>Une heure au calme, dans le bruit, au téléphone : on mesure ce que vous entendez vraiment, situation par situation.</>
              )}
            </p>
            <div style={{ maxWidth: 420, marginTop: 6 }}>
              <Onde color={C.onde} opacity={0.55} height={34} />
            </div>
          </div>
        </div>
      </section>

      {/* ══ AVIS — spotlight, avancé par le visiteur ══════════════════════ */}
      <section style={{ background: C.bg, padding: "clamp(76px,9vw,132px) clamp(20px,5vw,72px)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 26 }}>
              <Kicker align="center">Ils sont revenus dans la conversation</Kicker>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,4vw,52px)", fontWeight: 400, color: C.ink, textAlign: "center", lineHeight: 1.08, letterSpacing: "-0.012em", margin: "0 0 clamp(30px,3.6vw,48px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                <>
                  Ils ont retrouvé <em style={{ fontStyle: "italic", color: C.accent }}>les conversations</em>.
                </>
              )}
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <div
              style={{
                position: "relative",
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                borderRadius: 26,
                padding: "clamp(30px,4vw,58px) clamp(24px,4vw,64px)",
                textAlign: "center",
                boxShadow: "0 40px 80px -70px rgba(36,25,15,0.75)",
                minHeight: "clamp(280px,26vw,330px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <span
                aria-hidden
                style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", width: "42%", height: 1, background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)` }}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={avisIndex}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.55, ease: EASE }}
                >
                  <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 22 }}>
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={13} fill={C.accent} color={C.accent} />
                    ))}
                  </div>
                  <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(20px,2.6vw,30px)", color: C.ink, lineHeight: 1.42, fontWeight: 300, maxWidth: 720, margin: "0 auto 26px" }}>
                    « {avisCourant?.texte} »
                  </p>
                  <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 14, color: C.ink }}>{avisCourant?.auteur}</div>
                  <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accentDark, marginTop: 7 }}>{avisCourant?.detail}</div>
                </motion.div>
              </AnimatePresence>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, marginTop: 30, flexWrap: "wrap" }}>
                <SlideIndex i={avisIndex} total={AVIS.length} variant="fraction" color={C.textFaint} className="" />
                <HairlineArrows
                  onPrev={() => setAvisIndex((n) => (n - 1 + AVIS.length) % AVIS.length)}
                  onNext={() => setAvisIndex((n) => (n + 1) % AVIS.length)}
                  color={C.ink}
                  className=""
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ CONTACT ═══════════════════════════════════════════════════════ */}
      <section id="contact" style={{ background: C.bgAlt, padding: "clamp(72px,9vw,130px) clamp(20px,5vw,72px)" }}>
        <div className="i339-contact" style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1.06fr) minmax(0,0.94fr)", gap: "clamp(28px,5vw,72px)", alignItems: "center" }}>
          <Reveal>
            <div>
              <Kicker>Bilan offert</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4.6vw,58px)", fontWeight: 400, color: C.ink, margin: "18px 0 18px", lineHeight: 1.06, letterSpacing: "-0.012em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                  <>
                    Trente minutes pour savoir
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accent }}>où en est votre audition.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 16, color: C.textMuted, maxWidth: 480, lineHeight: 1.8, marginBottom: 30 }}>
                {clientTagline(sessionData) ?? "Bilan auditif offert, sans engagement. Venez accompagné : les voix familières sont le meilleur test."}
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
              className="i339-sticky"
              style={{ position: "sticky", top: 110, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 24, padding: "clamp(24px,2.6vw,34px)", boxShadow: "0 40px 76px -64px rgba(36,25,15,0.7)" }}
            >
              <Kicker color={C.textFaint}>Le centre</Kicker>
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <MapPin size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontFamily: SANS, fontSize: 14.5, color: C.textMuted, lineHeight: 1.68 }}>{clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "37000", "Tours")}</span>
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
                  <span style={{ fontFamily: SANS, fontSize: 14.5, color: C.textMuted, lineHeight: 1.68 }}>Lun–Ven 9h–18h30 · Sam 9h–13h</span>
                </div>
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 22, paddingTop: 18 }}>
                <p style={{ fontFamily: SANS, fontSize: 13.5, color: C.textMuted, lineHeight: 1.72, margin: 0 }}>
                  {ZONES.length >= 2 ? `Patients reçus de ${ZONES.slice(0, 6).join(", ")}.` : `Centre agréé 100 % Santé, tiers payant — à ${ville}.`}
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
            <div style={{ maxWidth: 360 }}>
              <div style={{ fontFamily: SERIF, fontSize: 25, fontWeight: 500, color: C.onde, marginBottom: 10 }}>{maison}</div>
              <p style={{ fontFamily: SANS, color: "rgba(255,255,255,0.40)", fontSize: 13, lineHeight: 1.75, margin: 0 }}>
                {metier} diplômés d'État · {ville}
                <br />
                Centre agréé 100 % Santé, tiers payant
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <MapPin size={13} />, t: clientAddress(sessionData) ?? `${ville}, Indre-et-Loire` },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Mail size={13} />, t: mail },
                { icon: <Clock size={13} />, t: "Lun–Ven 9h–18h30 · Sam 9h–13h" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.44)", fontFamily: SANS, fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.onde, display: "flex" }}>{item.icon}</span>
                  {item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontFamily: SANS, color: "rgba(255,255,255,0.28)", fontSize: 12 }}>
              © 2026 {maison} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
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
