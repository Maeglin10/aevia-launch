"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Car,
  CheckCircle,
  Clock,
  FileText,
  HeartPulse,
  Home,
  Mail,
  MapPin,
  Minus,
  Phone,
  Plus,
  Shield,
  Star,
  Umbrella,
} from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, HairlineArrows, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
import { ComposeIn } from "@/lib/templates/hero-kit-3";
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
   {clientName(sessionData) ?? "Cap Assurances"} — Courtier en assurances · Brest
   Geste signature : ComposeIn (hero-kit-3). La scène du hero part vide, puis
   les garanties arrivent une par une, chacune depuis son bord — c'est la
   couverture qui se compose devant l'assuré, pas un diaporama qui défile.
   Archétype H4 : titre éditorial décalé, chevauchant le panneau de garanties.
   Paire de fontes P4 : Fraunces (serif de titre) × Inter (sans de labeur).
   Sans photographie au-dessus de la ligne de flottaison.
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
const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,400&family=Inter:wght@300;400;500;600;700&display=swap');`;
const SERIF = "'Fraunces', 'Times New Roman', Georgia, serif";
const SANS = "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";
// Les sous-pages du thème lisent encore FONT/FONT_BODY : on garde les deux noms.
const FONT = SERIF;
const FONT_BODY = SANS;

/* ── Courbe d'accélération unique du thème ───────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
// Sa transcription littérale, pour les transitions écrites en CSS.
const EASE_CSS = "cubic-bezier(.16,1,.3,1)";

/* ── Jetons ──────────────────────────────────────────────────────────────── */
let C: Record<string, string> = {
  bg: "#f7f8fb",
  bgAlt: "#eaeef5",
  bgDark: "#131a2b",
  bgDarkAlt: "#0d1320",
  bgCard: "#ffffff",
  accent: "var(--brand, #2c4a8a)",
  accentDark: "var(--brand-light, #22396b)",
  accentLight: "#dde6f4",
  ink: "#161c2b",
  textMuted: "#5a6273",
  textFaint: "#8d94a4",
  border: "#dbe1ec",
  white: "#ffffff",
  // Clé métier : la teinte des garanties sur fond sombre (police d'assurance).
  police: "#9db4e0",
};

const NAV = [
  { l: "Couvertures", h: "#services" },
  { l: "La méthode", h: "#methode" },
  { l: "Honoraires", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* ════════════════════════════════════════════════════════════════════════════
   Données de démonstration.

   Chaque bloc existe en deux temps : la source figée (`_SOURCE`), qui porte les
   champs de présentation du thème — icône, ton de tuile, étiquette — et la
   version vivante (`_LIVE()`), ré-appelée dans le corps du rendu une fois la
   session affectée. Une constante de module évaluée à l'import ne verrait
   jamais la session : le thème resterait en démonstration quoi que le client
   saisisse.
   ════════════════════════════════════════════════════════════════════════════ */

/** Trois scènes de garanties : c'est l'index du hero qui les fait entrer. */
const HERO_SOURCE = [
  {
    k: "Particuliers",
    sub: "La maison, la voiture, la famille — assemblées sans doublon.",
    tiles: [
      { icon: Home, t: "Habitation", d: "Garanties ajustées à votre logement réel, pas à un forfait.", ton: "clair", from: "left" },
      { icon: Car, t: "Auto & deux-roues", d: "Bonus défendu, malussés acceptés, jeunes conducteurs suivis.", ton: "sombre", from: "right" },
      { icon: HeartPulse, t: "Santé & prévoyance", d: "Complémentaire au bon niveau, ni sur- ni sous-assuré.", ton: "pale", from: "bottom" },
    ],
  },
  {
    k: "Professionnels",
    sub: "Le local, la responsabilité, les hommes — d'un seul tenant.",
    tiles: [
      { icon: Briefcase, t: "RC professionnelle", d: "Adaptée à votre code NAF et à vos contrats clients.", ton: "sombre", from: "left" },
      { icon: Shield, t: "Multirisque pro", d: "Local, matériel, perte d'exploitation : chiffrés au réel.", ton: "clair", from: "right" },
      { icon: HeartPulse, t: "Santé collective", d: "Obligations employeur tenues, budget maîtrisé.", ton: "pale", from: "bottom" },
    ],
  },
  {
    k: "Au sinistre",
    sub: "C'est là qu'un courtier se juge : nous gérons le dossier.",
    tiles: [
      { icon: FileText, t: "Déclaration guidée", d: "Nous déclarons avec vous, dans les délais, pièces à l'appui.", ton: "pale", from: "left" },
      { icon: Umbrella, t: "Défense de l'assuré", d: "Face à l'expert de la compagnie, vous n'êtes pas seul.", ton: "clair", from: "right" },
      { icon: Shield, t: "Suivi jusqu'au chèque", d: "Relances faites, indemnisation suivie jusqu'au versement.", ton: "sombre", from: "bottom" },
    ],
  },
];

const SERVICES_SOURCE = [
  { titre: "Auto & deux-roues", desc: "Du tiers étendu au tous risques, bonus 50 défendu, résiliés et malussés étudiés. La bonne formule, pas la plus chère.", tag: "Auto", icon: Car },
  { titre: "Habitation", desc: "Propriétaire, locataire, PNO : capitaux mobiliers estimés avec vous, objets de valeur déclarés correctement — c'est ce qui fait payer les sinistres.", tag: "Habitation", icon: Home },
  { titre: "Santé & prévoyance", desc: "Complémentaire santé lisible, prévoyance qui maintient le revenu en cas d'arrêt. Analyse de vos contrats actuels offerte.", tag: "Santé", icon: HeartPulse },
  { titre: "Emprunteur", desc: "Changez d'assurance de prêt à tout moment (loi Lemoine) : à garanties équivalentes, souvent des milliers d'euros économisés.", tag: "Crédit", icon: FileText },
  { titre: "Professionnels & TNS", desc: "RC pro, décennale, multirisque, mutuelle et retraite Madelin : un seul dossier pour tout le risque de l'entreprise.", tag: "Pro", icon: Briefcase },
  { titre: "Gestion de sinistre", desc: "Déclaration, expertise, contre-expertise si besoin : nous portons le dossier face à la compagnie jusqu'à l'indemnisation.", tag: "Sinistre", icon: Umbrella },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE_SOURCE = [
  { n: "01", t: "Bilan de l'existant", d: "Vos contrats actuels relus ligne à ligne : doublons, trous de garantie, franchises oubliées." },
  { n: "02", t: "Étude comparative écrite", d: "Vingt compagnies interrogées, trois propositions argumentées, remises sous 48 h avec nos recommandations." },
  { n: "03", t: "Souscription sans rupture", d: "Résiliations gérées par nos soins, aucune journée sans couverture, cartes vertes et attestations immédiates." },
  { n: "04", t: "Revue annuelle", d: "Chaque année, on vérifie que vos contrats suivent votre vie : déménagement, naissance, nouveau véhicule, nouvelle activité." },
];
const METHODE = METHODE_SOURCE;

const ENGAGEMENT_SOURCE = [
  "Immatriculés à l'ORIAS (n° 26 004 512), contrôlés par l'ACPR",
  "Devoir de conseil formalisé : nos recommandations sont écrites et motivées",
  "Rémunération transparente : commissions affichées, honoraires annoncés avant mission",
  "Aucun engagement d'exclusivité avec une compagnie — c'est votre intérêt qui arbitre",
];
let ENGAGEMENT = ENGAGEMENT_SOURCE;

const TARIFS_SOURCE = [
  { a: "Bilan assurantiel particulier", p: "gratuit", n: "Relecture de vos contrats et étude comparative écrite, sans engagement." },
  { a: "Audit assurances entreprise", p: "dès 390 €", n: "Cartographie des risques, rapport écrit, déduit si vous nous confiez les contrats." },
  { a: "Assurance emprunteur", p: "économie moyenne 6 400 €", n: "Sur la durée du prêt, à garanties équivalentes (loi Lemoine)." },
  { a: "Accompagnement sinistre", p: "inclus", n: "Pour tous nos clients, jusqu'à l'indemnisation. C'est le métier." },
];
let TARIFS = TARIFS_SOURCE;

const AVIS_SOURCE = [
  { texte: "Dégât des eaux important : le courtier a géré la déclaration, l'expert, la contre-expertise. Indemnisation doublée par rapport à la première proposition de la compagnie.", auteur: "Yann & Morgane L.", detail: "Sinistre habitation" },
  { texte: "Ils ont repris nos cinq contrats : deux doublons supprimés, une garantie perte d'exploitation ajoutée — qu'on n'avait pas et qui nous aurait coûté l'entreprise.", auteur: "Menuiserie Kerbrat", detail: "Audit entreprise" },
  { texte: "Assurance de prêt renégociée en trois semaines : 41 € de moins par mois, mêmes garanties, banque prévenue par leurs soins.", auteur: "Simon G.", detail: "Emprunteur — loi Lemoine" },
];
let AVIS_DEMO = AVIS_SOURCE;

const STATS_SOURCE = [
  { value: "20", label: "Compagnies comparées" },
  { value: "1 900+", label: "Foyers et pros assurés" },
  { value: "-23 %", label: "Économie moyenne à garanties égales" },
  { value: "48 h", label: "Étude comparative rendue" },
];
let STATS = STATS_SOURCE;

/* ── Photos ──────────────────────────────────────────────────────────────── */
/**
 * L'image téléversée à cet emplacement, sinon celle du thème.
 *
 * `||` et non `??` : une chaîne vide est un emplacement non pourvu, pas une
 * valeur. Les emplacements sans URL de thème rendent un aplat CSS soigné —
 * la page doit rester belle images bloquées.
 */
function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 26, style }: { children: React.ReactNode; delay?: number; y?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} style={style} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.75, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

/** Sur-titre : un filet de 40 px, puis les capitales très espacées. */
function Kicker({ children, color = C.accentDark, align = "left" }: { children: React.ReactNode; color?: string; align?: "left" | "center" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: align === "center" ? "center" : "flex-start" }}>
      <span style={{ width: 40, height: 1, background: color, opacity: 0.75, flexShrink: 0 }} />
      <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.36em", textTransform: "uppercase", color }}>{children}</span>
      {align === "center" && <span style={{ width: 40, height: 1, background: color, opacity: 0.75, flexShrink: 0 }} />}
    </div>
  );
}

/** Lien de nav : le soulignement pousse en largeur, il n'apparaît pas. */
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
        letterSpacing: "0.01em",
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

/** Bouton plein ou filet : élévation, deux ombres, flèche qui avance. */
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
        letterSpacing: "0.01em",
        padding: big ? "16px 32px" : "14px 26px",
        borderRadius: 4,
        textDecoration: "none",
        border: `1px solid ${filled ? "transparent" : C.border}`,
        background: filled ? (h ? C.accentDark : C.accent) : h ? C.white : "transparent",
        color: filled ? C.white : C.ink,
        transform: h ? "translateY(-2px)" : "none",
        boxShadow: h
          ? `0 14px 30px -18px rgba(19,26,43,0.55), 0 2px 0 0 ${filled ? "rgba(255,255,255,0.18)" : C.accentLight}`
          : "0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0)",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      {children}
      <ArrowRight size={15} style={{ transform: h ? "translateX(5px)" : "none", transition: `transform .5s ${EASE_CSS}` }} />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Une garantie du dossier — la rangée d'accordéon.

   Le catalogue des couvertures n'est pas une grille de cartes : c'est une
   liste de garanties qu'on ouvre une par une, comme on déplie un contrat.
   ════════════════════════════════════════════════════════════════════════════ */
function GarantieRow({ s, n, ouvert, onToggle }: { s: any; n: number; ouvert: boolean; onToggle: () => void }) {
  const [h, setH] = useState(false);
  const Icon = s.icon ?? Shield;
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        borderTop: `1px solid ${C.border}`,
        background: ouvert ? C.bgCard : h ? "rgba(255,255,255,0.55)" : "transparent",
        boxShadow: ouvert
          ? `0 22px 44px -34px rgba(19,26,43,0.5), inset 3px 0 0 0 ${C.accent}`
          : h
            ? `0 14px 30px -30px rgba(19,26,43,0.45), inset 3px 0 0 0 ${C.accentLight}`
            : "inset 0 0 0 0 rgba(0,0,0,0)",
        transition: `all .5s ${EASE_CSS}`,
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={ouvert}
        style={{
          width: "100%",
          minHeight: 44,
          display: "flex",
          alignItems: "center",
          gap: "clamp(14px,2vw,26px)",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          padding: "clamp(20px,2.4vw,28px) clamp(14px,2.4vw,30px)",
          color: "inherit",
        }}
      >
        <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, letterSpacing: "0.22em", color: ouvert ? C.accent : C.textFaint, width: 28, flexShrink: 0 }}>
          {String(n + 1).padStart(2, "0")}
        </span>
        <Icon size={19} color={ouvert || h ? C.accent : C.textFaint} style={{ flexShrink: 0, transition: `color .5s ${EASE_CSS}` }} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontFamily: SERIF, fontSize: "clamp(19px,2.1vw,25px)", fontWeight: 400, color: C.ink, lineHeight: 1.2, letterSpacing: "-0.01em" }}>{s.titre}</span>
        </span>
        <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.textFaint, whiteSpace: "nowrap" }} className="i337-tag">
          {s.tag}
        </span>
        <span
          aria-hidden
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: `1px solid ${ouvert ? C.accent : C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: ouvert ? C.accent : C.textMuted,
            background: ouvert ? C.accentLight : "transparent",
            transition: `all .5s ${EASE_CSS}`,
          }}
        >
          {ouvert ? <Minus size={15} /> : <Plus size={15} />}
        </span>
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateRows: ouvert ? "1fr" : "0fr",
          transition: `grid-template-rows .55s ${EASE_CSS}`,
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <p
            style={{
              margin: 0,
              padding: "0 clamp(14px,2.4vw,30px) clamp(24px,2.6vw,32px) clamp(56px,6vw,84px)",
              fontFamily: SANS,
              fontSize: 15,
              lineHeight: 1.78,
              color: C.textMuted,
              maxWidth: 620,
              opacity: ouvert ? 1 : 0,
              transition: `opacity .5s ${EASE_CSS}`,
            }}
          >
            {s.desc}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Une rangée éditoriale de la méthode : filet, chiffre fantôme, texte. */
function MethodeRow({ m, idx, img, alt }: { m: any; idx: number; img?: string; alt?: string }) {
  const [h, setH] = useState(false);
  const inverse = idx % 2 === 1;
  return (
    <Reveal delay={idx * 0.06}>
      <div
        className="i337-mrow"
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "minmax(0,0.34fr) minmax(0,0.66fr)",
          gap: "clamp(18px,3vw,54px)",
          alignItems: "flex-start",
          padding: "clamp(28px,3.4vw,46px) 0",
          borderTop: `1px solid ${C.border}`,
        }}
      >
        {/* Le filet qui se colore et s'épaissit au survol : le détail gratuit. */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: -1,
            left: 0,
            height: 1,
            width: h ? "100%" : "0%",
            background: `linear-gradient(90deg, ${C.accent}, transparent)`,
            transition: `width .6s ${EASE_CSS}`,
          }}
        />
        <div style={{ order: inverse ? 2 : 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <span style={{ fontFamily: SERIF, fontSize: "clamp(40px,5.2vw,72px)", lineHeight: 0.9, color: h ? C.accent : C.accentLight, transition: `color .5s ${EASE_CSS}` }}>{m.n}</span>
            <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: C.textFaint }}>Étape</span>
          </div>
          {img !== undefined && (
            <div
              style={{
                marginTop: 22,
                borderRadius: 4,
                overflow: "hidden",
                aspectRatio: "5/4",
                border: `1px solid ${C.border}`,
                background: img
                  ? C.bgAlt
                  : `linear-gradient(140deg, ${C.accentLight} 0%, ${C.bgAlt} 58%, ${C.white} 100%)`,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-start",
              }}
            >
              {img ? (
                <img src={img} alt={alt ?? ""} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              ) : (
                /* Repli sans image : un aplat, une trame de filets, un mot. */
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `repeating-linear-gradient(115deg, ${C.border} 0px, ${C.border} 1px, transparent 1px, transparent 13px)`,
                      opacity: 0.55,
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: 18,
                      bottom: 16,
                      fontFamily: SERIF,
                      fontStyle: "italic",
                      fontSize: 18,
                      color: C.accentDark,
                      opacity: 0.8,
                    }}
                  >
                    Le dossier
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        <div style={{ order: inverse ? 1 : 2 }}>
          <h3 style={{ fontFamily: SERIF, fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 400, color: C.ink, lineHeight: 1.16, letterSpacing: "-0.012em", margin: "0 0 12px" }}>{m.t}</h3>
          <p style={{ fontFamily: SANS, fontSize: 15.5, lineHeight: 1.78, color: C.textMuted, maxWidth: 500, margin: 0 }}>{m.d}</p>
        </div>
      </div>
    </Reveal>
  );
}

/** Une ligne d'honoraires : table fine, prix aligné à droite en serif. */
function TarifRow({ t, idx }: { t: any; idx: number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={idx * 0.05}>
      <div
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        className="i337-tarif"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) auto",
          gap: "clamp(12px,3vw,40px)",
          alignItems: "baseline",
          padding: "clamp(18px,2vw,26px) clamp(10px,1.6vw,20px)",
          borderBottom: `1px solid ${C.border}`,
          background: h ? C.white : "transparent",
          boxShadow: h ? `0 18px 34px -30px rgba(19,26,43,0.5), inset 2px 0 0 0 ${C.accent}` : "inset 0 0 0 0 rgba(0,0,0,0)",
          transform: h ? "translateX(3px)" : "none",
          transition: `all .5s ${EASE_CSS}`,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: SERIF, fontSize: "clamp(18px,1.9vw,22px)", fontWeight: 400, color: C.ink, letterSpacing: "-0.01em" }}>{t.a}</div>
          <div style={{ fontFamily: SANS, fontSize: 13.5, color: C.textMuted, lineHeight: 1.7, marginTop: 6, maxWidth: 520 }}>{t.n}</div>
        </div>
        <div style={{ fontFamily: SERIF, fontSize: "clamp(17px,1.9vw,21px)", color: C.accentDark, whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>{t.p}</div>
      </div>
    </Reveal>
  );
}

/** Un avis, en colonne décalée : l'élévation change trois propriétés. */
function AvisCard({ a, idx }: { a: any; idx: number }) {
  const [h, setH] = useState(false);
  // Colonnes décalées : la deuxième descend, la troisième descend davantage.
  const decalage = [0, 34, 16][idx % 3];
  return (
    <Reveal delay={idx * 0.09}>
      <article
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        className="i337-avis"
        style={{
          marginTop: decalage,
          background: h ? "rgba(255,255,255,0.075)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${h ? "rgba(157,180,224,0.42)" : "rgba(255,255,255,0.10)"}`,
          borderRadius: 4,
          padding: "clamp(24px,2.6vw,34px)",
          height: "100%",
          transform: h ? "translateY(-6px)" : "none",
          boxShadow: h ? "0 34px 60px -40px rgba(0,0,0,0.85), 0 2px 0 0 rgba(157,180,224,0.35)" : "0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0)",
          transition: `all .5s ${EASE_CSS}`,
        }}
      >
        <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
          {[...Array(5)].map((_, j) => (
            <Star key={j} size={12} fill={C.police} color={C.police} />
          ))}
        </div>
        <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(15.5px,1.6vw,18px)", color: "rgba(255,255,255,0.84)", lineHeight: 1.68, margin: "0 0 22px" }}>« {a.texte} »</p>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.10)", paddingTop: 16 }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 13.5, color: C.white }}>{a.auteur}</div>
          <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.police, marginTop: 6 }}>{a.detail}</div>
        </div>
      </article>
    </Reveal>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════════════════ */
export default function CapAssurancesPage() {
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
  brand = fd?.brandColor ?? null;
  if (brand) {
    C = { ...C, accent: brand };
  }

  /* ── Listes : le client d'abord, la démonstration pour la présentation ──── */
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

  /* Les scènes du hero : la première porte le métier du client quand il y en
     a un, les suivantes montrent les autres facettes du courtage. */
  const HERO = HERO_SOURCE;

  const ZONES = clientAreas(sessionData) ?? [];

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ouvert, setOuvert] = useState<number>(0);

  // Un seul index pilote tout le hero : les tuiles, l'étiquette, la fraction.
  const { i, next, prev } = useSlides(HERO.length, DWELL.normal);
  const S = HERO[i];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  /* ── Contact ───────────────────────────────────────────────────────────── */
  const phone = clientPhone(sessionData) ?? fd?.phone ?? "02 98 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33298000000").replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "conseil@cap-assurances.fr";
  const maison = fd?.businessName ?? clientName(sessionData) ?? "Cap Assurances";
  const ville = clientCity(sessionData) ?? "Brest";
  const metier = clientTrade(sessionData) ?? "Courtier en assurances";

  /* ── Tuiles du geste ───────────────────────────────────────────────────── */
  const tonDeTuile = (ton: string) =>
    ton === "sombre"
      ? { background: C.bgDark, color: C.accentLight, border: "1px solid rgba(255,255,255,0.08)" }
      : ton === "clair"
        ? { background: C.accentLight, color: C.accentDark, border: `1px solid ${C.border}` }
        : { background: C.white, color: C.accentDark, border: `1px solid ${C.border}` };

  const tiles = S.tiles.map(({ icon: Icon, t: titre, d, ton, from }) => ({
    from: from as "left" | "right" | "bottom",
    node: (
      <div
        style={{
          ...tonDeTuile(ton),
          borderRadius: 4,
          padding: "clamp(18px,2vw,24px)",
          height: "100%",
          display: "flex",
          gap: 16,
          alignItems: "flex-start",
          boxShadow: "0 24px 44px -38px rgba(19,26,43,0.75)",
        }}
      >
        <Icon size={21} style={{ flexShrink: 0, marginTop: 3 }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 15, letterSpacing: "0.005em", marginBottom: 6 }}>{titre}</div>
          <div style={{ fontFamily: SANS, fontSize: 13.5, lineHeight: 1.62, opacity: 0.86 }}>{d}</div>
        </div>
      </div>
    ),
  }));

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip" }}>
      <style>{`
        ${FONTS_CSS}

        /* Nav : la barre passe de transparente à posée en quatre propriétés. */
        @media (max-width: 980px) { #i337-nav { display: none !important; } .i337-burger { display: flex !important; } }

        /* Hero H4 : le titre chevauche le panneau. En dessous de 980px la
           superposition n'a plus de place — les deux colonnes s'empilent. */
        @media (max-width: 980px) {
          .i337-hero { grid-template-columns: minmax(0,1fr) !important; gap: 40px !important; padding-top: 116px !important; }
          .i337-panel { margin-left: 0 !important; }
          .i337-title { margin-right: 0 !important; }
        }
        @media (max-width: 860px) {
          .i337-split { grid-template-columns: minmax(0,1fr) !important; gap: 34px !important; }
          .i337-mrow { grid-template-columns: minmax(0,1fr) !important; gap: 18px !important; }
          /* Les rangées alternées reprennent l'ordre de lecture du document. */
          .i337-mrow > * { order: initial !important; }
          .i337-statrail { grid-template-columns: repeat(auto-fit, minmax(min(140px,100%),1fr)) !important; }
          .i337-avis { margin-top: 0 !important; }
          .i337-contact { grid-template-columns: minmax(0,1fr) !important; }
          .i337-tag { display: none !important; }
          /* Le rail collant redevient statique : sur téléphone il masquerait
             la moitié de la section. */
          .i337-sticky { position: static !important; }
        }
        @media (max-width: 640px) {
          .i337-tarif { grid-template-columns: minmax(0,1fr) !important; }
        }

        /* Le glissement lent du glow : c'est ce qui empêche la scène vide du
           ComposeIn de ressembler à une page qui n'a pas fini de charger. */
        @keyframes i337-derive {
          0%   { transform: translate3d(-4%, 0, 0) scale(1); }
          50%  { transform: translate3d(4%, -2%, 0) scale(1.06); }
          100% { transform: translate3d(-4%, 0, 0) scale(1); }
        }
        .i337-derive { animation: i337-derive 28s ${EASE_CSS} infinite; }

        @media (prefers-reduced-motion: reduce) {
          .i337-derive { animation: none !important; }
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
          background: scrolled ? "rgba(247,248,251,0.92)" : "transparent",
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
              <Umbrella size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: SERIF, fontSize: 19, color: C.ink, letterSpacing: "-0.015em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{maison}</span>
              <span style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.26em", textTransform: "uppercase", color: C.textFaint, marginLeft: 8 }} className="i337-tag">
                Courtage
              </span>
            </>
          )}
        </a>
        <div id="i337-nav" style={{ display: "flex", gap: "clamp(18px,2.2vw,30px)", alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <NavLink key={l} label={l} href={h} />
          ))}
          <CTA href={telHref} filled>
            Bilan gratuit
          </CTA>
        </div>
        <button
          className="i337-burger"
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
          <a href={telHref} style={{ fontFamily: SANS, background: C.accent, color: C.white, borderRadius: 4, padding: "14px 22px", fontSize: 15, fontWeight: 600, textDecoration: "none", textAlign: "center", marginTop: 10 }}>
            Bilan gratuit
          </a>
        </div>
      )}

      {/* ══ HERO — H4 : le titre déborde sur le panneau des garanties ═════ */}
      <section
        id="hero"
        className="i337-hero"
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "grid",
          gridTemplateColumns: "minmax(0,1.04fr) minmax(0,0.96fr)",
          alignItems: "center",
          gap: "clamp(24px,3vw,44px)",
          padding: "clamp(132px,13vw,168px) clamp(20px,5vw,72px) clamp(60px,7vw,92px)",
          maxWidth: 1320,
          margin: "0 auto",
        }}
      >
        {/* Texture : glow radial très bas, et un mot fantôme en fond. */}
        <div
          aria-hidden
          className="i337-derive"
          style={{
            position: "absolute",
            top: "-10%",
            right: "-6%",
            width: "min(70vw, 780px)",
            height: "min(70vw, 780px)",
            background: `radial-gradient(circle at 50% 50%, rgba(44,74,138,0.12) 0%, rgba(44,74,138,0.05) 42%, transparent 70%)`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: "clamp(-30px,-2vw,0px)",
            bottom: "clamp(10px,4vw,60px)",
            fontFamily: SERIF,
            fontSize: "clamp(120px,20vw,300px)",
            lineHeight: 0.8,
            color: C.accent,
            opacity: 0.055,
            pointerEvents: "none",
            userSelect: "none",
            letterSpacing: "-0.04em",
            zIndex: 0,
          }}
        >
          20
        </span>

        {/* Colonne de titre — z-index supérieur : c'est elle qui chevauche. */}
        <div style={{ position: "relative", zIndex: 3 }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}>
            <Kicker>{clientEyebrow(sessionData) ?? `${metier} · ${ville}`}</Kicker>
          </motion.div>

          <motion.h1
            className="i337-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.95, ease: EASE }}
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(40px,6.6vw,92px)",
              fontWeight: 400,
              color: C.ink,
              lineHeight: 0.98,
              letterSpacing: "-0.028em",
              /* Le débord sur le panneau — l'archétype H4. Il est calé sur la
                 gouttière du panneau et jamais sur le texte des tuiles : un
                 titre posé par-dessus une garantie rendrait les deux illisibles. */
              margin: "clamp(20px,2.4vw,34px) -6% clamp(18px,2vw,26px) 0",
              position: "relative",
            }}
          >
            {/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ?? (
              <>
                {c?.heroHeadline ?? (
                  <>
                    {clientHeroLine(sessionData, 0, 2, 16) ?? "Assuré pour ce qui compte,"}
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accent }}>{clientHeroLine(sessionData, 1, 2, 16) ?? "pas pour remplir un contrat."}</em>
                  </>
                )}
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44, duration: 0.85, ease: EASE }}
            style={{ fontFamily: SANS, fontSize: "clamp(15.5px,1.5vw,17px)", color: C.textMuted, lineHeight: 1.76, maxWidth: 480, marginBottom: "clamp(26px,3vw,36px)" }}
          >
            {clientHeroSubtitle(sessionData) ??
              c?.heroSubline ??
              "Un courtier indépendant compare pour vous auto, habitation, santé et prévoyance auprès de vingt compagnies — et reste votre interlocuteur au moment du sinistre."}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8, ease: EASE }} style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <CTA href={telHref} filled big>
              Faire le point gratuitement
            </CTA>
            <CTA href="#services">Nos couvertures</CTA>
          </motion.div>

          {/* Pilotage du geste : une seule fraction, une seule paire de flèches. */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: "clamp(30px,3.4vw,44px)", flexWrap: "wrap" }}>
            <SlideIndex i={i} total={HERO.length} variant="fraction" color={C.textFaint} className="" />
            <span style={{ fontFamily: SANS, fontSize: 13, color: C.textMuted, maxWidth: 380 }}>
              <strong style={{ fontFamily: SANS, color: C.ink, fontWeight: 600 }}>{S.k}</strong> — {S.sub}
            </span>
            <HairlineArrows onPrev={prev} onNext={next} color={C.ink} className="" />
          </div>

          {/* Les chiffres en marge du héros, pas en bandeau séparé. */}
          <div
            className="i337-statrail"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(150px,100%), 1fr))",
              gap: "clamp(10px,1.4vw,20px)",
              marginTop: "clamp(30px,3.6vw,46px)",
              borderTop: `1px solid ${C.border}`,
              paddingTop: "clamp(18px,2vw,26px)",
            }}
          >
            {STATS.map((s: any, idx: number) => (
              <Reveal key={s.label ?? idx} delay={idx * 0.07} y={14}>
                <div>
                  <div style={{ fontFamily: SERIF, fontSize: "clamp(24px,2.6vw,32px)", color: C.accent, lineHeight: 1, letterSpacing: "-0.02em" }}>{s.value}</div>
                  <div style={{ fontFamily: SANS, fontSize: 11.5, color: C.textFaint, marginTop: 8, lineHeight: 1.5, letterSpacing: "0.04em" }}>{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Panneau des garanties — la scène du ComposeIn. */}
        <div
          className="i337-panel"
          style={{
            position: "relative",
            zIndex: 1,
            marginLeft: "clamp(-90px,-5vw,0px)",
            background: C.bgAlt,
            border: `1px solid ${C.border}`,
            borderRadius: 4,
            /* Gouttière gauche élargie : c'est elle que le titre recouvre. */
            padding: "clamp(20px,2.4vw,30px) clamp(20px,2.4vw,30px) clamp(20px,2.4vw,30px) clamp(26px,4.6vw,66px)",
            minHeight: "clamp(360px,44vw,470px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 18 }}>
            <Kicker color={C.textFaint}>Le dossier</Kicker>
            <span style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: C.accent }}>{S.k}</span>
          </div>
          <ComposeIn
            index={i}
            items={tiles}
            hold={1.2}
            beat={0.16}
            style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gridTemplateRows: "repeat(3, minmax(104px, auto))", gap: 12 }}
          />
          {/* Détail gratuit : l'arc du parapluie, tracé en CSS, jamais expliqué. */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              right: -1,
              bottom: -1,
              width: 120,
              height: 120,
              borderRight: `1px solid ${C.accent}`,
              borderBottom: `1px solid ${C.accent}`,
              borderBottomRightRadius: 120,
              opacity: 0.35,
              pointerEvents: "none",
            }}
          />
        </div>
      </section>

      {/* ══ RESPIRATION ═══════════════════════════════════════════════════ */}
      <section style={{ background: C.bgAlt, padding: "clamp(76px,10vw,142px) clamp(24px,8vw,140px)", textAlign: "center" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
            <Kicker color={C.textMuted} align="center">
              Le métier
            </Kicker>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(22px,3.2vw,44px)", lineHeight: 1.34, fontWeight: 300, maxWidth: 940, margin: "0 auto", color: C.ink, letterSpacing: "-0.012em" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (
              <>Un contrat ne se juge pas le jour où on le signe, mais le jour où il faut s'en servir.</>
            )}
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div style={{ width: 1, height: 86, background: `linear-gradient(${C.accent}, transparent)`, margin: "clamp(34px,4vw,54px) auto 0" }} />
        </Reveal>
      </section>

      {/* ══ COUVERTURES — les garanties en accordéon ══════════════════════ */}
      <section id="services" style={{ background: C.bg, padding: "clamp(72px,9vw,124px) clamp(20px,5vw,72px)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(30px,3.6vw,48px)", maxWidth: 720 }}>
              <Kicker>Couvertures</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,4.2vw,54px)", fontWeight: 400, color: C.ink, marginTop: 18, lineHeight: 1.06, letterSpacing: "-0.026em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                  <>
                    Comparer vraiment,
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accent }}>pas vendre une marque.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 15.5, color: C.textMuted, lineHeight: 1.76, maxWidth: 520, marginTop: 18 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "services.texte") ?? (
                  <>Chaque garantie s'ouvre : ce qu'elle couvre, ce qu'elle ne couvre pas, et ce qui se discute avec la compagnie.</>
                )}
              </p>
            </div>
          </Reveal>
          <div style={{ borderBottom: `1px solid ${C.border}` }}>
            {SERVICES.map((s: any, idx: number) => (
              <Reveal key={`${s.titre}-${idx}`} delay={Math.min(idx, 4) * 0.055} y={16}>
                <GarantieRow s={s} n={idx} ouvert={ouvert === idx} onToggle={() => setOuvert(ouvert === idx ? -1 : idx)} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MÉTHODE — rangées éditoriales numérotées ══════════════════════ */}
      <section id="methode" style={{ background: C.bgAlt, padding: "clamp(72px,9vw,130px) clamp(20px,5vw,72px)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(24px,3vw,40px)", maxWidth: 700 }}>
              <Kicker>La méthode</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,4.2vw,54px)", fontWeight: 400, color: C.ink, marginTop: 18, lineHeight: 1.06, letterSpacing: "-0.026em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                  <>
                    Le devoir de conseil,
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accent }}>pris au sérieux.</em>
                  </>
                )}
              </h2>
            </div>
          </Reveal>
          {METHODE.map((m, idx) => (
            <MethodeRow
              key={m.n}
              m={m}
              idx={idx}
              /* Un seul emplacement photo dans la méthode : la deuxième rangée.
                 Sans image, la boîte rend sa trame de filets — pas un trou. */
              img={idx === 1 ? photo(1, "") : undefined}
              alt="Étude comparative remise au client"
            />
          ))}
          <div style={{ borderTop: `1px solid ${C.border}` }} />
        </div>
      </section>

      {/* ══ ENGAGEMENTS — split réglementaire ════════════════════════════ */}
      <section id="engagements" style={{ background: C.bg, padding: "clamp(72px,9vw,130px) clamp(20px,5vw,72px)" }}>
        <div
          className="i337-split"
          style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,0.92fr) minmax(0,1.08fr)", gap: "clamp(28px,5vw,72px)", alignItems: "center" }}
        >
          <Reveal>
            <div style={{ position: "relative" }}>
              <div style={{ borderRadius: 4, border: `1px solid ${C.border}`, background: C.accentLight, aspectRatio: "4/5", overflow: "hidden" }}>
                <img
                  src={photo(0, "https://images.pexels.com/photos/8441774/pexels-photo-8441774.jpeg?auto=compress&cs=tinysrgb&w=1400")}
                  alt="Rendez-vous conseil avec un client"
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
              {/* Cartouche ORIAS posé en débord : la preuve avant la promesse. */}
              <div
                style={{
                  position: "absolute",
                  right: "clamp(-16px,-1vw,0px)",
                  bottom: "clamp(-18px,-1.4vw,0px)",
                  background: C.bgDark,
                  color: C.accentLight,
                  borderRadius: 4,
                  padding: "16px 20px",
                  maxWidth: 230,
                  boxShadow: "0 30px 60px -40px rgba(19,26,43,0.9)",
                }}
              >
                <div style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.28em", textTransform: "uppercase", color: C.police }}>Immatriculation</div>
                <div style={{ fontFamily: SERIF, fontSize: 19, marginTop: 6, letterSpacing: "-0.01em" }}>ORIAS n° 26 004 512</div>
                <div style={{ fontFamily: SANS, fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 6, lineHeight: 1.5 }}>Sous le contrôle de l'ACPR</div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              <Kicker>Nos engagements</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px,3.6vw,46px)", fontWeight: 400, color: C.ink, margin: "18px 0 26px", lineHeight: 1.08, letterSpacing: "-0.024em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>
                    Indépendants,
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accent }}>et réglementés.</em>
                  </>
                )}
              </h2>
              {ENGAGEMENT.map((e: string, idx: number) => (
                <div key={idx} style={{ display: "flex", gap: 13, marginBottom: 16, paddingBottom: 16, borderBottom: idx < ENGAGEMENT.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <CheckCircle size={17} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontFamily: SANS, fontSize: 15, color: C.textMuted, lineHeight: 1.7 }}>{e}</span>
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

      {/* ══ HONORAIRES — table fine ═══════════════════════════════════════ */}
      <section id="tarifs" style={{ background: C.bgAlt, padding: "clamp(72px,9vw,130px) clamp(20px,5vw,72px)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(26px,3vw,40px)" }}>
              <Kicker>Honoraires</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,4vw,50px)", fontWeight: 400, color: C.ink, marginTop: 18, lineHeight: 1.06, letterSpacing: "-0.026em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                  <>
                    Payé pour conseiller, <em style={{ fontStyle: "italic", color: C.accent }}>pas pour placer.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 15, color: C.textMuted, maxWidth: 560, marginTop: 16, lineHeight: 1.74 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.texte") ?? (
                  <>
                    Pour les particuliers, notre rémunération est incluse dans la prime (commission compagnie, affichée). Les missions spécifiques sont facturées au forfait annoncé.
                  </>
                )}
              </p>
            </div>
          </Reveal>
          <div style={{ borderTop: `1px solid ${C.border}` }}>
            {TARIFS.map((t: any, idx: number) => (
              <TarifRow key={`${t.a}-${idx}`} t={t} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ AVIS — colonnes décalées sur fond sombre ══════════════════════ */}
      <section style={{ position: "relative", background: C.bgDark, padding: "clamp(76px,9vw,132px) clamp(20px,5vw,72px)", overflow: "hidden" }}>
        <div
          aria-hidden
          className="i337-derive"
          style={{
            position: "absolute",
            left: "-10%",
            top: "-20%",
            width: "min(80vw, 760px)",
            height: "min(80vw, 760px)",
            background: "radial-gradient(circle at 50% 50%, rgba(157,180,224,0.11) 0%, transparent 68%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", maxWidth: 1120, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(32px,3.6vw,50px)", maxWidth: 680 }}>
              <Kicker color={C.police}>Ils nous ont confié leurs contrats</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px,3.8vw,48px)", fontWeight: 400, color: C.white, marginTop: 18, lineHeight: 1.06, letterSpacing: "-0.024em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                  <>
                    Assurés, <em style={{ fontStyle: "italic", color: C.police }}>et défendus</em>.
                  </>
                )}
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px,100%), 1fr))", gap: "clamp(14px,2vw,22px)", alignItems: "start" }}>
            {AVIS.map((a: any, idx: number) => (
              <AvisCard key={`${a.auteur}-${idx}`} a={a} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTACT ═══════════════════════════════════════════════════════ */}
      <section id="contact" style={{ background: C.bg, padding: "clamp(72px,9vw,132px) clamp(20px,5vw,72px)" }}>
        <div className="i337-contact" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1.06fr) minmax(0,0.94fr)", gap: "clamp(28px,5vw,72px)", alignItems: "center" }}>
          <Reveal>
            <div>
              <Kicker>Bilan gratuit</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,4.2vw,54px)", fontWeight: 400, color: C.ink, margin: "18px 0 18px", lineHeight: 1.06, letterSpacing: "-0.026em" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                  <>
                    Vingt minutes pour savoir
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accent }}>ce que vous couvrez vraiment.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 16, color: C.textMuted, maxWidth: 480, lineHeight: 1.76, marginBottom: 30 }}>
                {clientTagline(sessionData) ?? "Apportez vos contrats, on les lit ensemble. Étude comparative écrite sous 48 h, sans engagement."}
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
              className="i337-sticky"
              style={{
                position: "sticky",
                top: 110,
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                borderRadius: 4,
                padding: "clamp(24px,2.6vw,34px)",
                boxShadow: "0 40px 70px -60px rgba(19,26,43,0.7)",
              }}
            >
              <Kicker color={C.textFaint}>Le cabinet</Kicker>
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <MapPin size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontFamily: SANS, fontSize: 14.5, color: C.textMuted, lineHeight: 1.65 }}>
                    {clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "29200", "Brest")}
                  </span>
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
                  <span style={{ fontFamily: SANS, fontSize: 14.5, color: C.textMuted, lineHeight: 1.65 }}>Lun–Ven 9h–18h30 · Sam 9h–12h30</span>
                </div>
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 22, paddingTop: 18 }}>
                <p style={{ fontFamily: SANS, fontSize: 13.5, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>
                  {ZONES.length >= 2
                    ? `Nous suivons nos assurés à ${ZONES.slice(0, 6).join(", ")}.`
                    : `Nous recevons à ${ville} et suivons nos assurés dans tout le Finistère.`}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ PIED ══════════════════════════════════════════════════════════ */}
      <footer style={{ background: C.bgDarkAlt, padding: "clamp(44px,5vw,64px) clamp(20px,5vw,72px) 26px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 34 }}>
            <div style={{ maxWidth: 360 }}>
              <div style={{ fontFamily: SERIF, fontSize: 22, color: C.police, marginBottom: 10, letterSpacing: "-0.015em" }}>{maison}</div>
              <p style={{ fontFamily: SANS, color: "rgba(255,255,255,0.40)", fontSize: 13, lineHeight: 1.75, margin: 0 }}>
                {metier} · {ville}
                <br />
                ORIAS n° 26 004 512 — sous le contrôle de l'ACPR
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <MapPin size={13} />, t: clientAddress(sessionData) ?? `${ville}, Finistère` },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Mail size={13} />, t: mail },
                { icon: <Clock size={13} />, t: "Lun–Ven 9h–18h30 · Sam 9h–12h30" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.44)", fontFamily: SANS, fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.police, display: "flex" }}>{item.icon}</span>
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
