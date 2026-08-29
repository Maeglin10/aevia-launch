"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Star, CheckCircle, ArrowRight, Scale } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, useSlides, SlideIndex, HairlineArrows } from "@/lib/templates/hero-kit-2";
import { ArcSwap } from "@/lib/templates/hero-kit-3";
import {
  clientAddress,
  clientBookingUrl,
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
   ÉTUDE NOTARIALE VASSEUR & DELMAS — donneur : impact-03 (luxe clair, serif).
   Élévation famille II.0 : le geste (ArcSwap), la palette ivoire/laiton et
   l'ordre des sections sont conservés — on élève le dessin.

   Signature : ArcSwap. La plaque en laiton d'une étude est littéralement un
   objet suspendu qui oscille — chaque domaine d'intervention entre et sort
   en balancier, pivot au pied, pendant que le texte reste immobile.

   Signature visuelle : filets dégradés 1 px, chiffres romains fantômes sur
   les domaines, tarifs notariés en table fine — le barème est un document
   officiel, il se lit comme tel.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Fontes — P11 : EB Garamond (voix de l'acte) + Outfit (voix du greffe) ── */
const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Outfit:wght@300;400;500;600;700&display=swap');`;
const SERIF = "'EB Garamond', Georgia, 'Times New Roman', serif";
const SANS = "'Outfit', system-ui, -apple-system, sans-serif";

/* ── Easing unique, répété littéralement dans le CSS ───────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_CSS = "cubic-bezier(.16,1,.3,1)";

/* ── Tokens ────────────────────────────────────────────────────────────────── */
let C: Record<string, string> = {
  bg: "#faf8f3",
  bgAlt: "#f2ede3",
  bgDark: "#161a24",
  bgDarkAlt: "#10141c",
  bgCard: "#ffffff",
  accent: "var(--brand,#8a6d3f)",
  accentDark: "var(--brand-light,#6d5530)",
  accentLight: "#f0e6d2",
  ink: "#1c1a16",
  textMuted: "#6b6357",
  textFaint: "#a2967f",
  border: "#e2d9c8",
  white: "#ffffff",
  /* clé métier : le laiton de la plaque, pour les fonds sombres */
  brass: "#cfb37a",
  navy: "#1d2a44",
};

const STATS_DEMO = [
  { value: "2", label: "Notaires associés" },
  { value: "30 ans", label: "D'exercice cumulé" },
  { value: "1 200", label: "Actes reçus par an" },
  { value: "8 jours", label: "Premier rendez-vous" },
];
let STATS = STATS_DEMO;

const NAV = [
  { l: "Domaines", h: "#domaines" },
  { l: "L'étude", h: "#etude" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* Les trois faces de la plaque du hero. Photos : uniquement des URLs déjà
   présentes dans le repo et vérifiées (cabinets juridiques / documents). */
function HERO_DOMAINES_DEMO_LIVE() {
  return [
    {
      k: "Immobilier",
      num: "I",
      line: "L'acte authentique qui sécurise la vente.",
      sub: "Compromis, vente, VEFA — chaque clause vérifiée avant signature.",
      img: (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80"),
      alt: "Dossier d'acte de vente sur le bureau de l'étude",
    },
    {
      k: "Famille",
      num: "II",
      line: "Transmettre sans laisser de conflit derrière soi.",
      sub: "Donations, testaments authentiques, successions réglées au clair.",
      img: (clientPhotos(sessionData)[2] || "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80"),
      alt: "Signature d'une donation, stylo et documents",
    },
    {
      k: "Entreprise",
      num: "III",
      line: "Des statuts aux murs, l'entreprise sur des bases saines.",
      sub: "Cessions de fonds, baux commerciaux, garanties et sûretés.",
      img: (clientPhotos(sessionData)[3] || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80"),
      alt: "Bibliothèque juridique du bureau des notaires",
    },
  ];
}
let HERO_DOMAINES_DEMO = HERO_DOMAINES_DEMO_LIVE();
let HERO_DOMAINES = HERO_DOMAINES_DEMO;

const DOMAINES_DEMO = [
  { num: "I", titre: "Immobilier", desc: "Avant-contrat, vente, VEFA, servitudes, prêt hypothécaire. Nous vérifions urbanisme, diagnostics et origine de propriété avant que vous n'engagiez votre signature.", tag: "Acte authentique" },
  { num: "II", titre: "Famille & succession", desc: "Contrat de mariage, PACS, donation entre époux, testament authentique, règlement complet de succession avec déclaration fiscale.", tag: "Transmission" },
  { num: "III", titre: "Entreprise", desc: "Cession de fonds de commerce, baux commerciaux, constitution de sociétés, garanties. Le notaire donne date certaine et force exécutoire à vos accords.", tag: "Professionnels" },
  { num: "IV", titre: "Patrimoine & conseil", desc: "Démembrement, SCI familiale, anticipation de la dépendance, mandat de protection future. Un rendez-vous conseil avant les grandes décisions.", tag: "Conseil" },
];

const ENGAGEMENT_DEMO = [
  "Officiers publics nommés par le garde des Sceaux — nos actes ont force exécutoire",
  "Membres de la Chambre des notaires de la Gironde, contrôlés chaque année",
  "Secret professionnel absolu, sur chaque dossier et chaque échange",
  "Réponse écrite sous 48 h ouvrées à toute demande de rendez-vous",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

/* Émoluments : barème national fixé par arrêté (art. A444 du code de commerce).
   Les montants cités sont les émoluments d'actes courants, hors débours et taxes. */
const TARIFS_DEMO = [
  { a: "Acte de notoriété (succession)", p: "57,69 € HT", n: "Émolument fixe national — identique dans toute la France." },
  { a: "Donation entre époux", p: "115,39 € HT", n: "Émolument fixe, hors droits d'enregistrement éventuels." },
  { a: "PACS (convention par acte notarié)", p: "101,41 € HT", n: "Enregistrement et formalités inclus dans nos formalités courantes." },
  { a: "Vente immobilière", p: "barème proportionnel", n: "Émoluments dégressifs par tranches, fixés par l'État. Simulation chiffrée remise avant tout engagement." },
];
let TARIFS = TARIFS_DEMO;

const AVIS_SOURCE = [
  { texte: "Succession de mon père réglée en cinq mois, avec une déclaration fiscale limpide. Chaque étape nous a été expliquée avant d'être engagée, sans jargon.", auteur: "Hélène D.", detail: "Règlement de succession" },
  { texte: "Achat de notre première maison. L'étude a repéré une servitude non déclarée dans le compromis et l'a fait corriger avant signature. C'est exactement ce qu'on attend d'un notaire.", auteur: "Julien & Sarah M.", detail: "Vente immobilière" },
  { texte: "Cession de mon fonds de commerce préparée en parallèle du bail. Calendrier tenu à la semaine près, et un conseil fiscal qui m'a évité une erreur coûteuse.", auteur: "Patrick L.", detail: "Cession de fonds" },
];
let AVIS_DEMO = AVIS_SOURCE;

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 28 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.85, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

/** Kicker filé : 40×1 px dégradé, capitales Outfit, interlettrage 0.36em. */
function Kicker({ children, color = C.accentDark, align = "left" }: { children: React.ReactNode; color?: string; align?: "left" | "center" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: align === "center" ? "center" : "flex-start" }}>
      <span aria-hidden style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${C.accent})`, display: "inline-block" }} />
      <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, letterSpacing: "0.36em", textTransform: "uppercase", color }}>{children}</span>
      {align === "center" && (
        <span aria-hidden style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${C.accent}, transparent)`, display: "inline-block" }} />
      )}
    </div>
  );
}

/** Filet dégradé horizontal — la signature graphique de l'étude. */
function Filet({ margin = "0" }: { margin?: string }) {
  return <div aria-hidden style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.border} 18%, ${C.accent} 50%, ${C.border} 82%, transparent)`, opacity: 0.8, margin }} />;
}

function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || fallback;
}

/* ── Lien de nav : soulignement en largeur qui pousse ──────────────────────── */
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
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        textDecoration: "none",
        padding: "12px 4px",
        transition: `color .45s ${EASE_CSS}`,
      }}
    >
      {l}
      <span aria-hidden style={{ position: "absolute", left: 4, bottom: 8, height: 1, width: hov ? "calc(100% - 8px)" : "0%", background: C.accent, transition: `width .5s ${EASE_CSS}` }} />
    </a>
  );
}

/* ── Bouton principal : élévation + double ombre + flèche qui avance ──────── */
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
        background: ghost ? (hov ? C.bgCard : "transparent") : hov ? C.navy : C.navy,
        color: ghost ? C.ink : "#fff",
        border: ghost ? `1px solid ${hov ? C.accent : C.border}` : `1px solid ${C.navy}`,
        borderRadius: 3,
        padding: ghost ? "14px 26px" : "15px 30px",
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 14,
        letterSpacing: "0.06em",
        textDecoration: "none",
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov
          ? "0 3px 10px rgba(29,42,68,0.18), 0 18px 44px -14px rgba(29,42,68,0.35)"
          : "0 1px 3px rgba(29,42,68,0.10), 0 6px 18px -10px rgba(29,42,68,0.18)",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      {children}
      <ArrowRight size={15} style={{ transform: hov ? "translateX(4px)" : "none", transition: `transform .5s ${EASE_CSS}` }} />
    </a>
  );
}

/* ── Colonne filetée d'un domaine, chiffre romain fantôme derrière ─────────── */
function DomaineColonne({ d, idx }: { d: any; idx: number }) {
  const [hov, setHov] = useState(false);
  return (
    <Reveal delay={idx * 0.08}>
      <article
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          position: "relative",
          height: "100%",
          padding: "clamp(24px, 3vw, 36px) clamp(18px, 2.2vw, 28px) clamp(26px, 3vw, 38px)",
          borderTop: `1px solid ${C.border}`,
          background: hov ? C.bgCard : "transparent",
          transform: hov ? "translateY(-6px)" : "none",
          boxShadow: hov
            ? "0 2px 10px rgba(28,26,22,0.06), 0 24px 56px -26px rgba(138,109,63,0.35)"
            : "none",
          transition: `all .55s ${EASE_CSS}`,
          overflow: "hidden",
        }}
      >
        {/* Le filet du haut prend la couleur de l'accent au survol */}
        <span aria-hidden style={{ position: "absolute", top: -1, left: 0, height: 1, width: hov ? "100%" : "0%", background: `linear-gradient(90deg, ${C.accent}, transparent)`, transition: `width .6s ${EASE_CSS}` }} />
        {/* Chiffre romain fantôme */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: "-0.08em",
            right: 6,
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: "clamp(84px, 9vw, 128px)",
            lineHeight: 1,
            color: hov ? "rgba(138,109,63,0.12)" : "rgba(138,109,63,0.07)",
            pointerEvents: "none",
            userSelect: "none",
            transition: `color .55s ${EASE_CSS}`,
          }}
        >
          {d.num}
        </span>
        <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.26em", textTransform: "uppercase", color: hov ? C.accentDark : C.textFaint, transition: `color .45s ${EASE_CSS}` }}>{d.tag}</span>
        <h3 style={{ fontFamily: SERIF, fontSize: "clamp(21px, 2.1vw, 26px)", fontWeight: 500, color: C.ink, lineHeight: 1.18, margin: "16px 0 12px", position: "relative" }}>{d.titre}</h3>
        <p style={{ fontFamily: SANS, fontSize: 14.5, fontWeight: 300, color: C.textMuted, lineHeight: 1.72, margin: 0, position: "relative" }}>{d.desc}</p>
      </article>
    </Reveal>
  );
}

/* ── Ligne de la table des émoluments ──────────────────────────────────────── */
function TarifLigne({ t, idx }: { t: any; idx: number }) {
  const [hov, setHov] = useState(false);
  return (
    <Reveal delay={idx * 0.06} y={16}>
      <div
        className="i326-tarifrow"
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1.7fr) minmax(0,0.9fr)",
          gap: "10px clamp(16px, 3vw, 44px)",
          alignItems: "baseline",
          padding: `clamp(18px, 2.4vw, 26px) clamp(10px, 1.6vw, 18px)`,
          paddingLeft: hov ? "clamp(18px, 2.4vw, 30px)" : "clamp(10px, 1.6vw, 18px)",
          background: hov ? "rgba(240,230,210,0.45)" : "transparent",
          transition: `all .5s ${EASE_CSS}`,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: SERIF, fontSize: "clamp(17px, 1.8vw, 21px)", fontWeight: 500, color: hov ? C.accentDark : C.ink, transition: `color .45s ${EASE_CSS}` }}>{t.a}</div>
          <div style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 300, color: C.textMuted, marginTop: 6, lineHeight: 1.65, maxWidth: 520 }}>{t.n}</div>
        </div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(17px, 1.9vw, 22px)", color: C.accentDark, whiteSpace: "nowrap", textAlign: "right" }}>{t.p}</div>
      </div>
      <div aria-hidden style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.border} 12%, ${C.border} 88%, transparent)` }} />
    </Reveal>
  );
}

/* ── Carte d'avis, fond sombre ─────────────────────────────────────────────── */
function AvisCarte({ a, idx }: { a: any; idx: number }) {
  const [hov, setHov] = useState(false);
  return (
    <Reveal delay={idx * 0.1}>
      <figure
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          position: "relative",
          background: hov ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${hov ? "rgba(207,179,122,0.35)" : "rgba(255,255,255,0.09)"}`,
          borderRadius: 4,
          padding: "clamp(24px, 3vw, 34px) clamp(22px, 2.6vw, 30px)",
          height: "100%",
          margin: 0,
          boxSizing: "border-box",
          transform: hov ? "translateY(-5px)" : "none",
          boxShadow: hov ? "0 4px 14px rgba(0,0,0,0.25), 0 26px 60px -24px rgba(0,0,0,0.5)" : "none",
          transition: `all .55s ${EASE_CSS}`,
          overflow: "hidden",
        }}
      >
        {/* Guillemet fantôme */}
        <span aria-hidden style={{ position: "absolute", top: -18, right: 6, fontFamily: SERIF, fontStyle: "italic", fontSize: 120, lineHeight: 1, color: "rgba(207,179,122,0.08)", pointerEvents: "none", userSelect: "none" }}>”</span>
        <div style={{ display: "flex", gap: 3, marginBottom: 14 }} aria-label="5 étoiles">
          {[...Array(5)].map((_, j) => <Star key={j} size={13} fill={C.brass} color={C.brass} strokeWidth={0} />)}
        </div>
        <blockquote style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(15.5px, 1.55vw, 17.5px)", color: "rgba(255,255,255,0.82)", lineHeight: 1.72, margin: "0 0 20px" }}>
          "{a.texte}"
        </blockquote>
        <figcaption style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14 }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, color: "#fff", fontSize: 14, letterSpacing: "0.02em" }}>{a.auteur}</div>
          <div style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: C.brass, marginTop: 5 }}>{a.detail}</div>
        </figcaption>
      </figure>
    </Reveal>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════════════════ */
export default function EtudeNotarialePage() {
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
  HERO_DOMAINES_DEMO = HERO_DOMAINES_DEMO_LIVE();
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({ ...AVIS_SOURCE[i % AVIS_SOURCE.length], auteur: r.author, texte: r.text })),
    AVIS_SOURCE,
  );
  HERO_DOMAINES = HERO_DOMAINES_DEMO.map((row, i) => ({
    ...row,
    img: clientPhotos(sessionData)[0 + i] || row.img,
  }));
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s, i) => ({ ...TARIFS_DEMO[i % TARIFS_DEMO.length], a: s.title, p: s.price ?? TARIFS_DEMO[i % TARIFS_DEMO.length].p, n: s.desc || TARIFS_DEMO[i % TARIFS_DEMO.length].n })),
    TARIFS_DEMO,
  );
  STATS = resolveList(clientStats(sessionData), STATS_DEMO);
  ENGAGEMENT = resolveList(clientCertifications(sessionData), ENGAGEMENT_DEMO);
  brand = fd?.brandColor ?? null;
  if (brand) {
    C = { ...C, accent: brand };
  }

  const DOMAINES = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      num: DOMAINES_DEMO[i % DOMAINES_DEMO.length].num,
      titre: s.title ?? DOMAINES_DEMO[i % DOMAINES_DEMO.length].titre,
      desc: s.description ?? DOMAINES_DEMO[i % DOMAINES_DEMO.length].desc,
      tag: DOMAINES_DEMO[i % DOMAINES_DEMO.length].tag,
    })),
    DOMAINES_DEMO
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
  const [brandHov, setBrandHov] = useState(false);
  const { i, go, next, prev } = useSlides(HERO_DOMAINES.length, DWELL.normal);
  const dom = HERO_DOMAINES[i];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = clientPhone(sessionData) ?? "05 56 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? "+33556000000").replace(/[^+\d]/g, "")}`;
  const mail = clientEmail(sessionData) ?? "contact@etude-vasseur-delmas.fr";

  return (
    <div style={{ background: C.bg, fontFamily: SANS, overflowX: "clip" }}>
      <style>{FONTS_CSS}</style>
      <style>{`
        @media (max-width: 900px) { #i326-nav { display: none !important; } .i326-burger { display: flex !important; } }
        @media (max-width: 860px) {
          .i326-hero { grid-template-columns: 1fr !important; padding: 118px 24px 46px !important; gap: 34px !important; }
          .i326-plaque { max-width: 340px; margin: 0 auto; }
          .i326-split { grid-template-columns: 1fr !important; }
          .i326-split > * { order: initial !important; }
          .i326-stats { grid-template-columns: 1fr 1fr !important; row-gap: 8px; }
          .i326-stats .i326-statcell { border-right: none !important; }
          .i326-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i326-tarifhead { display: none !important; }
        }
        @media (max-width: 560px) {
          .i326-tarifrow { grid-template-columns: 1fr !important; }
          .i326-tarifrow > div:last-child { text-align: left !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .i326-root * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
        }
      `}</style>

      {/* ── NAV — collante à 4 propriétés : fond, hauteur, filet, ombre ──── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: scrolled ? 66 : 78,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(24px, 4vw, 48px)",
          background: scrolled ? "rgba(250,248,243,0.97)" : "rgba(250,248,243,0.6)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          boxShadow: scrolled ? "0 10px 34px -22px rgba(28,26,22,0.35)" : "none",
          transition: `all .55s ${EASE_CSS}`,
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "default" }}
          onMouseEnter={() => setBrandHov(true)}
          onMouseLeave={() => setBrandHov(false)}
        >
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 170, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Scale size={17} color={C.accent} />
              {/* Détail gratuit : la marque s'aère comme une gravure au survol */}
              <span style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 500, color: C.ink, letterSpacing: brandHov ? "0.10em" : "0.03em", transition: `letter-spacing .6s ${EASE_CSS}` }}>{fd?.businessName ?? "Vasseur & Delmas"}</span>
              <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 500, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textMuted, marginLeft: 6 }}>{clientTrade(sessionData) ?? "Notaires"}</span>
            </>
          )}
        </div>
        <div id="i326-nav" style={{ display: "flex", gap: 22, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <NavLink key={l} l={l} h={h} />
          ))}
          <CtaButton href={telHref}>Prendre rendez-vous</CtaButton>
        </div>
        <button className="i326-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 66, left: 0, right: 0, zIndex: 99, background: "rgba(250,248,243,0.99)", borderBottom: `1px solid ${C.border}`, padding: "20px 28px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ color: C.ink, fontFamily: SANS, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "12px 0" }}>{l}</a>
          ))}
          <a href={clientBookingUrl(sessionData) ?? telHref} {...(clientBookingUrl(sessionData) ? { target: "_blank", rel: "noopener noreferrer" } : {})} style={{ background: C.navy, color: "#fff", borderRadius: 3, padding: "13px 24px", fontSize: 15, fontWeight: 600, textDecoration: "none", textAlign: "center", marginTop: 8 }}>Prendre rendez-vous</a>
        </div>
      )}

      {/* ── HERO — ArcSwap sur la plaque de l'étude ─────────────────────── */}
      <section className="i326-hero i326-root" style={{ minHeight: "100dvh", display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,0.9fr)", gap: "clamp(36px, 5vw, 64px)", alignItems: "center", padding: "clamp(120px, 15vh, 150px) clamp(24px, 5vw, 64px) clamp(46px, 7vh, 74px)", maxWidth: 1280, margin: "0 auto", position: "relative" }}>
        {/* Paragraphe fantôme : le signe de l'acte, en filigrane */}
        <span aria-hidden style={{ position: "absolute", top: "12%", right: "4%", fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(160px, 22vw, 320px)", lineHeight: 1, color: "rgba(138,109,63,0.05)", pointerEvents: "none", userSelect: "none", zIndex: 0 }}>§</span>
        <div style={{ position: "relative", zIndex: 1 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }}>
            <Kicker>{clientEyebrow(sessionData) ?? <>Étude notariale · {clientCity(sessionData) ?? "Bordeaux"}</>}</Kicker>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.95, ease: EASE }}
            style={{ fontFamily: SERIF, fontSize: "clamp(38px, 5.2vw, 72px)", fontWeight: 500, color: C.ink, lineHeight: 1.0, letterSpacing: "-0.015em", margin: "clamp(16px, 2vw, 24px) 0 clamp(18px, 2.2vw, 26px)" }}
          >{/* TEXTE_SECTION */ clientText(sessionData, "section-1.titre") ?? (<>
            {c?.heroHeadline ?? (<>{clientHeroLine(sessionData, 0, 2, 23) ?? "Un acte qui engage,"}<br /><em style={{ color: C.accent, fontWeight: 400 }}>{clientHeroLine(sessionData, 1, 2, 23) ?? "un conseil qui protège."}</em></>)}
          </>)}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.85, ease: EASE }} style={{ fontFamily: SANS, fontWeight: 300, fontSize: "clamp(15.5px, 1.5vw, 17px)", color: C.textMuted, lineHeight: 1.78, maxWidth: 490, marginBottom: "clamp(26px, 3.4vw, 38px)" }}>
            {c?.heroSubline ?? clientHeroSubtitle(sessionData) ?? "Immobilier, famille, entreprise : deux notaires associés reçoivent, expliquent et sécurisent chacun de vos engagements — au tarif réglementé, le même partout en France."}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72, duration: 0.85, ease: EASE }} style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <CtaButton href={telHref}>Prendre rendez-vous</CtaButton>
            <CtaButton href="#domaines" ghost>Nos domaines</CtaButton>
          </motion.div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: "clamp(32px, 5vh, 48px)", flexWrap: "wrap" }}>
            <SlideIndex i={i} total={HERO_DOMAINES.length} variant="fraction" color={C.textMuted} className="" />
            <span style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 300, color: C.textMuted }}>
              <strong style={{ color: C.ink, fontWeight: 600 }}>{dom.k}</strong> — {dom.sub}
            </span>
            <HairlineArrows onPrev={prev} onNext={next} color={C.ink} className="" />
          </div>
        </div>

        {/* La plaque : elle est suspendue, elle oscille. ArcSwap et lui seul. */}
        <div className="i326-plaque" style={{ position: "relative", zIndex: 1 }}>
          <ArcSwap index={i} sweep={46}>
            <div style={{ position: "relative", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 4, overflow: "hidden", boxShadow: "0 2px 12px rgba(28,26,22,0.08), 0 26px 64px -18px rgba(138,109,63,0.32)" }}>
              {/* Les quatre vis de la plaque en laiton — le détail gratuit */}
              {[{ top: 8, left: 8 }, { top: 8, right: 8 }, { bottom: 8, left: 8 }, { bottom: 8, right: 8 }].map((pos, v) => (
                <span key={v} aria-hidden style={{ position: "absolute", width: 5, height: 5, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, #e8d9b8, ${C.brass} 60%, #8a6d3f)`, zIndex: 2, ...pos }} />
              ))}
              <div style={{ position: "relative", background: C.bgDark }}>
                <img src={photo(i, dom.img)} alt={dom.alt} loading="lazy" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
                {/* Voile laiton en pied d'image */}
                <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(22,26,36,0.34) 0%, rgba(22,26,36,0.05) 32%, transparent 55%)", pointerEvents: "none" }} />
              </div>
              <div style={{ padding: "clamp(18px, 2.4vw, 26px) clamp(20px, 2.6vw, 28px)", borderTop: `2px solid ${C.accent}` }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.30em", textTransform: "uppercase", color: C.accentDark, marginBottom: 8 }}>{dom.k}</div>
                  <span aria-hidden style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 22, color: "rgba(138,109,63,0.30)", lineHeight: 1 }}>{dom.num}</span>
                </div>
                <div style={{ fontFamily: SERIF, fontSize: "clamp(17px, 1.9vw, 21px)", fontWeight: 500, color: C.ink, lineHeight: 1.32 }}>{dom.line}</div>
              </div>
            </div>
          </ArcSwap>
        </div>
      </section>

      {/* ── RESPIRATION — une phrase, un filet, rien d'autre ────────────── */}
      <section className="i326-pad" style={{ background: C.bgAlt, padding: "clamp(72px, 10vw, 140px) clamp(24px, 8vw, 120px)", textAlign: "center" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
            <Kicker align="center" color={C.textMuted}>L'office</Kicker>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(22px, 3vw, 40px)", fontWeight: 400, lineHeight: 1.38, letterSpacing: "-0.005em", maxWidth: 860, margin: "0 auto", color: C.ink }}>{/* TEXTE_SECTION */ clientText(sessionData, "respiration.texte") ?? (<>
            L'acte authentique donne date certaine et force exécutoire à vos engagements.
          </>)}</p>
        </Reveal>
        <Reveal delay={0.2}>
          <div aria-hidden style={{ width: 1, height: "clamp(56px, 8vw, 92px)", background: `linear-gradient(${C.accent}, transparent)`, margin: "clamp(36px, 5vw, 56px) auto 0" }} />
        </Reveal>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ background: C.bgDark, position: "relative", overflow: "hidden" }}>
        {/* Glow laiton discret */}
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(70% 120% at 50% 0%, rgba(207,179,122,0.10), transparent 60%)", pointerEvents: "none" }} />
        <div className="i326-stats i326-pad" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1100, margin: "0 auto", padding: "0 32px", position: "relative" }}>
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 0.08}>
              <div className="i326-statcell" style={{ padding: "clamp(26px, 3.4vw, 40px) 8px", textAlign: "center", borderRight: idx < 3 ? "1px solid transparent" : "none", borderImage: idx < 3 ? "linear-gradient(to bottom, transparent, rgba(207,179,122,0.35), transparent) 1" : undefined }}>
                <div style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3vw, 38px)", fontWeight: 500, color: brand ? "var(--brand, #cfb37a)" : C.brass, lineHeight: 1, letterSpacing: "-0.01em" }}>{s.value}</div>
                <div style={{ fontFamily: SANS, fontSize: 12, fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginTop: 9 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── DOMAINES — colonnes filetées, chiffres romains fantômes ─────── */}
      <section id="domaines" className="i326-pad" style={{ padding: "clamp(80px, 10vw, 130px) clamp(24px, 5vw, 64px)", background: C.bg }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(36px, 5vw, 60px)" }}>
              <Kicker>Domaines d'intervention</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4vw, 54px)", fontWeight: 500, color: C.ink, marginTop: 16, lineHeight: 1.06, letterSpacing: "-0.01em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "domaines.titre") ?? (<>
                Quatre domaines,<br /><em style={{ color: C.accent, fontWeight: 400 }}>une même exigence.</em>
              </>)}</h2>
            </div>
          </Reveal>
          <Filet margin="0 0 6px" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: "0 clamp(12px, 2vw, 24px)" }}>
            {DOMAINES.map((d, idx) => (
              <DomaineColonne key={d.titre} d={d} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── L'ÉTUDE ─────────────────────────────────────────────────────── */}
      <section id="etude" className="i326-pad" style={{ padding: "clamp(80px, 10vw, 130px) clamp(24px, 5vw, 64px)", background: C.bgAlt }}>
        <div className="i326-split" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(36px, 6vw, 72px)", alignItems: "center" }}>
          <Reveal>
            {/* Cadre décalé : la photo dans son passe-partout */}
            <div style={{ position: "relative", padding: "0 14px 14px 0" }}>
              <span aria-hidden style={{ position: "absolute", top: 14, left: 14, right: 0, bottom: 0, border: `1px solid ${C.accent}`, borderRadius: 4, opacity: 0.5, pointerEvents: "none" }} />
              <img src={photo(4, "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80")} alt="Notaire associé de l'étude" loading="lazy" style={{ width: "100%", borderRadius: 4, aspectRatio: "4/3", objectFit: "cover", display: "block", position: "relative", boxShadow: "0 20px 56px -24px rgba(28,26,22,0.35)" }} />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <Kicker>L'étude</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3.2vw, 46px)", fontWeight: 500, color: C.ink, margin: "16px 0 18px", lineHeight: 1.06, letterSpacing: "-0.01em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "etude.titre") ?? (<>
                Un officier public<br /><em style={{ color: C.accent, fontWeight: 400 }}>à votre service.</em>
              </>)}</h2>
              <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 15, color: C.textMuted, lineHeight: 1.75, maxWidth: 460, margin: "0 0 26px" }}>{/* TEXTE_SECTION */ clientText(sessionData, "etude.texte") ?? (<>
                Le notaire est nommé par l'État : ce qu'il reçoit en la forme authentique a la même force qu'un jugement.
              </>)}</p>
              {ENGAGEMENT.map((e, idx) => (
                <div key={idx} style={{ display: "flex", gap: 12, padding: "13px 0", borderTop: idx === 0 ? "none" : `1px solid ${C.border}` }}>
                  <CheckCircle size={17} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontFamily: SANS, fontWeight: 300, fontSize: 15, color: C.textMuted, lineHeight: 1.65 }}>{e}</span>
                </div>
              ))}
              <div style={{ marginTop: 24 }}>
                <CtaButton href={telHref}>Exposer votre situation</CtaButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TARIFS — la table des émoluments, comme au barème ───────────── */}
      <section id="tarifs" className="i326-pad" style={{ padding: "clamp(80px, 10vw, 130px) clamp(24px, 5vw, 64px)", background: C.bg, position: "relative", overflow: "hidden" }}>
        {/* Chiffre fantôme du barème */}
        <span aria-hidden style={{ position: "absolute", bottom: "-0.1em", left: "2%", fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(140px, 18vw, 260px)", lineHeight: 1, color: "rgba(138,109,63,0.05)", pointerEvents: "none", userSelect: "none" }}>A444</span>
        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "clamp(20px, 3vw, 34px)" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Kicker align="center">Tarifs</Kicker>
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 3.8vw, 50px)", fontWeight: 500, color: C.ink, marginTop: 14, lineHeight: 1.06, letterSpacing: "-0.01em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Des émoluments <em style={{ color: C.accent, fontWeight: 400 }}>réglementés.</em></>)}</h2>
              <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 15, color: C.textMuted, maxWidth: 560, margin: "16px auto 0", lineHeight: 1.75 }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.intro") ?? (<>
                La rémunération du notaire est fixée par l'État (barème national) : pour un même acte, l'émolument est identique dans toute la France. Hors débours, droits et taxes collectés pour le Trésor public.
              </>)}</p>
            </div>
          </Reveal>
          <div style={{ marginTop: "clamp(28px, 4vw, 44px)", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 4, padding: "clamp(6px, 1vw, 12px) clamp(12px, 2vw, 24px) clamp(10px, 1.4vw, 16px)", boxShadow: "0 2px 12px rgba(28,26,22,0.05), 0 24px 60px -34px rgba(138,109,63,0.28)" }}>
            {/* Tête de table */}
            <div className="i326-tarifhead" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.7fr) minmax(0,0.9fr)", gap: "0 clamp(16px, 3vw, 44px)", padding: "clamp(14px, 1.8vw, 20px) clamp(10px, 1.6vw, 18px) 10px" }}>
              <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.30em", textTransform: "uppercase", color: C.textFaint }}>Acte reçu</span>
              <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.30em", textTransform: "uppercase", color: C.textFaint, textAlign: "right" }}>Émolument</span>
            </div>
            <div aria-hidden style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.accent} 30%, ${C.accent} 70%, transparent)`, opacity: 0.55 }} />
            {TARIFS.map((t, idx) => (
              <TarifLigne key={t.a} t={t} idx={idx} />
            ))}
            <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 14.5, color: C.textFaint, textAlign: "center", margin: "clamp(14px, 2vw, 20px) 0 8px", lineHeight: 1.6 }}>
              Barème national — art. A444 du code de commerce. Simulation chiffrée remise avant tout engagement.
            </p>
          </div>
        </div>
      </section>

      {/* ── AVIS ────────────────────────────────────────────────────────── */}
      <section className="i326-pad" style={{ padding: "clamp(80px, 10vw, 130px) clamp(24px, 5vw, 64px)", background: C.bgDark, position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 90% at 50% 100%, rgba(207,179,122,0.08), transparent 60%)", pointerEvents: "none" }} />
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "clamp(36px, 5vw, 56px)", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <Kicker align="center" color={C.brass}>Ils témoignent</Kicker>
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3.6vw, 48px)", fontWeight: 500, color: "#fff", lineHeight: 1.06, letterSpacing: "-0.01em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-6.titre") ?? (<>
              Ils nous ont confié <em style={{ color: brand ? "var(--brand, #cfb37a)" : C.brass, fontWeight: 400 }}>leurs actes</em>.
            </>)}</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: "clamp(14px, 2vw, 22px)", maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          {AVIS.map((a, idx) => (
            <AvisCarte key={a.auteur} a={a} idx={idx} />
          ))}
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section id="contact" className="i326-pad" style={{ padding: "clamp(88px, 11vw, 140px) clamp(24px, 5vw, 64px)", background: C.accentLight, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <span aria-hidden style={{ position: "absolute", top: "-0.12em", right: "3%", fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(140px, 20vw, 280px)", lineHeight: 1, color: "rgba(138,109,63,0.07)", pointerEvents: "none", userSelect: "none" }}>§</span>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Kicker align="center">Premier rendez-vous</Kicker>
          </div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4.2vw, 54px)", fontWeight: 500, color: C.ink, margin: "18px 0 16px", lineHeight: 1.06, letterSpacing: "-0.01em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
            Votre situation mérite<br /><em style={{ color: C.accent, fontWeight: 400 }}>un conseil posé.</em>
          </>)}</h2>
          <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "0 auto clamp(28px, 4vw, 40px)", lineHeight: 1.75 }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ?? (<>
            Premier échange au téléphone sans engagement. Rendez-vous à l'étude sous huit jours, en soirée le jeudi.
          </>)}</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <CtaButton href={telHref}><Phone size={17} /> {phone}</CtaButton>
            <CtaButton href={`mailto:${mail}`} ghost><Mail size={17} /> Écrire à l'étude</CtaButton>
          </div>
          {clientAddress(sessionData) && (
            <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 14, color: C.textMuted, marginTop: 26, display: "inline-flex", alignItems: "center", gap: 8 }}>
              <MapPin size={14} color={C.accentDark} /> {clientAddress(sessionData)}
            </p>
          )}
        </Reveal>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="i326-pad" style={{ background: C.bgDarkAlt, padding: "clamp(44px, 6vw, 64px) clamp(24px, 5vw, 64px) 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 30 }}>
            <div>
              <div style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 500, color: brand ? "var(--brand, #cfb37a)" : C.brass, marginBottom: 8, letterSpacing: "0.02em" }}>{fd?.businessName ?? "Vasseur & Delmas"} — {clientTrade(sessionData) ?? "Notaires associés"}</div>
              <p style={{ fontFamily: SANS, fontWeight: 300, color: "rgba(255,255,255,0.35)", fontSize: 13, lineHeight: 1.7 }}>
                Officiers publics et ministériels · {clientCity(sessionData) ?? "Bordeaux"}<br />Membres de la Chambre des notaires de la Gironde
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { icon: <MapPin size={13} />, t: clientCodePostalVille(sessionData, "33000", "Bordeaux") },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Mail size={13} />, t: mail },
                { icon: <Clock size={13} />, t: "Lun–Ven 9h–18h, jeudi jusqu'à 20h" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.40)", fontFamily: SANS, fontWeight: 300, fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: brand ? "var(--brand, #cfb37a)" : C.brass }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
          <div aria-hidden style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(207,179,122,0.30), transparent)" }} />
          <div style={{ paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontFamily: SANS, fontWeight: 300, color: "rgba(255,255,255,0.24)", fontSize: 12, letterSpacing: "0.04em" }}>
              © 2026 {fd?.businessName ?? "Vasseur & Delmas"} — Site réalisé par {clientName(sessionData) ?? "Aevia WS"} · SIREN {/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}<LegalIdentity fallback="852 546 225" kind="siren" />
            </span>
            <span style={{ fontFamily: SANS, fontWeight: 300, color: "rgba(255,255,255,0.24)", fontSize: 12, letterSpacing: "0.04em" }}>Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
