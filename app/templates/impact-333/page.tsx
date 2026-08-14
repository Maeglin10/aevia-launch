"use client";
// @ts-nocheck

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Check, Mail, MapPin, Phone, Scale } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, HairlineArrows, SlideIndex, WordFlight, useSlides } from "@/lib/templates/hero-kit-2";
import {
  clientAddress,
  clientCertifications,
  clientCity,
  clientCodePostalVille,
  clientEmail,
  clientEyebrow,
  clientHeroLine,
  clientHeroPrestations,
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
   ÉTUDE DU CANAL — Notaires · Rennes

   Notaire, 2e variante (la 1re est impact-326, luxe ivoire). Celle-ci est
   urbaine et sombre : une revue de droit plutôt qu'une plaque de cuivre.

   Archétype H7 : magazine. Méta-rangée en tête (numéro, matière, ressort),
   titre serif géant, bandeau média en bas de page couverture.

   Geste signature : WordFlight (hero-kit-2). Chaque mot du titre entre depuis
   son propre décalage, échelonné de 55 ms : l'acte s'assemble clause après
   clause. Un seul index — celui des trois domaines — pilote le titre, la
   méta-rangée, la légende du bandeau et le compteur.

   Fontes P11 — EB Garamond (titres, citations, chiffres du barème) contre
   Outfit (libellés, tableaux, mentions). La lettre d'imprimerie contre la
   grotesque géométrique.
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
const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Outfit:wght@200;300;400;500;600;700&display=swap');`;

const SERIF = "'EB Garamond', Garamond, Georgia, serif";
const SANS = "'Outfit', system-ui, -apple-system, 'Segoe UI', sans-serif";

/* ── Easing unique, répété littéralement en CSS ──────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Palette ─────────────────────────────────────────────────────────────── */
let C: Record<string, string> = { bg: "#0c0e14", bgAlt: "#11141c", bgDark: "#080a0f", bgDarkAlt: "#05060b", bgCard: "#141827", accent: "var(--brand, #7d8ff2)", accentDark: "var(--brand-light, #a5b2f7)", accentLight: "#131624", ink: "#eef0f6", textMuted: "#98a0b4", textFaint: "#626c84", border: "rgba(255,255,255,0.09)", white: "#ffffff", /* le texte posé SUR l'accent : jamais du blanc, il n'y passerait pas */ onAccent: "#0b0d16", /* clé métier : le papier chiffon des minutes, en très sombre */ minute: "#cfd4e6", };

/* ════════════════════════════════════════════════════════════════════════════
   Données — SOURCE figée, LIVE ré-appelée dans le rendu
   ════════════════════════════════════════════════════════════════════════════ */

const NAV = [ { l: "Domaines", h: "#services" }, { l: "L'étude", h: "#etude" }, { l: "La méthode", h: "#methode" }, { l: "Tarifs", h: "#tarifs" }, { l: "Contact", h: "#contact" }, ];

const HERO_SOURCE = [ { k: "Immobilier", line: "Signer un achat sans découvrir de clause après coup.", sub: "Compromis, vente, VEFA, prêt — vérifiés ligne à ligne.", }, { k: "Famille", line: "Transmettre clairement, de son vivant.", sub: "Donations, testaments authentiques, PACS, adoption.", }, { k: "Entreprise", line: "Donner force exécutoire à vos accords d'affaires.", sub: "Cessions, baux commerciaux, statuts, garanties.", }, ];
let HERO = HERO_SOURCE;

const SERVICES_SOURCE = [ { titre: "Ventes immobilières", desc: "De l'avant-contrat à la remise des clés : urbanisme, diagnostics, origine de propriété et servitudes vérifiés avant que vous ne signiez.", tag: "Immobilier", }, { titre: "Successions", desc: "Acte de notoriété, inventaire, partage, déclaration fiscale dans les six mois. Un interlocuteur unique pour toute la famille.", tag: "Succession", }, { titre: "Donations & testaments", desc: "Donation-partage, donation entre époux, testament authentique conservé au fichier central. Transmettre sans créer de conflit.", tag: "Famille", }, { titre: "Contrats de mariage & PACS", desc: "Séparation de biens, participation aux acquêts, convention de PACS notariée : le régime choisi, pas le régime subi.", tag: "Couple", }, { titre: "Entreprise & sociétés", desc: "Cession de fonds, baux commerciaux, constitution et cession de parts. La date certaine et la force exécutoire en plus.", tag: "Affaires", }, { titre: "Conseil patrimonial", desc: "Démembrement, SCI, mandat de protection future, assurance-vie : un rendez-vous conseil avant les grandes décisions.", tag: "Patrimoine", }, ];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE_SOURCE = [ { n: "01", r: "I", t: "Écoute et pièces", d: "Un premier échange pour cerner la situation, une liste de pièces claire — et une seule fois.", }, { n: "02", r: "II", t: "Projet d'acte commenté", d: "Le projet vous est envoyé avant le rendez-vous, annoté en langage courant. Vous arrivez en connaissant votre dossier.", }, { n: "03", r: "III", t: "Signature expliquée", d: "Chaque clause relue à voix haute, chaque question posée a sa réponse avant le stylo.", }, { n: "04", r: "IV", t: "Suites assurées", d: "Publicité foncière, enregistrement, attestations : l'étude suit le dossier jusqu'au dernier document.", }, ];

const ENGAGEMENT_SOURCE = [ "Notaires nommés par le garde des Sceaux — nos actes ont force exécutoire", "Membres de la Chambre des notaires d'Ille-et-Vilaine, inspection annuelle", "Émoluments réglementés : pour un même acte, le même prix partout en France", "Secret professionnel absolu, y compris entre membres d'une même famille", ];
let ENGAGEMENT = ENGAGEMENT_SOURCE;

const TARIFS_SOURCE = [ { a: "Acte de notoriété", p: "57,69 € HT", n: "Émolument fixe national, identique dans toute la France." }, { a: "Donation entre époux", p: "115,39 € HT", n: "Émolument fixe, hors droits d'enregistrement éventuels." }, { a: "Testament authentique", p: "113,19 € HT", n: "Reçu par deux notaires ou un notaire et deux témoins, inscrit au fichier central.", }, { a: "Vente immobilière", p: "barème proportionnel", n: "Émoluments dégressifs par tranches. Simulation chiffrée remise avant l'avant-contrat.", }, ];
let TARIFS = TARIFS_SOURCE;

const AVIS_SOURCE = [ { texte: "Succession réglée en quatre mois avec une sœur à l'étranger. Visio pour les rendez-vous, procurations gérées par l'étude, déclaration déposée dans les délais.", auteur: "François T.", detail: "Succession internationale", }, { texte: "Le projet d'acte annoté reçu une semaine avant la signature change tout : on a posé nos questions par écrit, la signature a duré quarante minutes au lieu de deux heures.", auteur: "Élodie & Marc P.", detail: "Achat immobilier", }, { texte: "Cession de mes parts préparée avec mon expert-comptable et l'étude en direct. Fiscalité anticipée, calendrier tenu.", auteur: "Gaëlle M.", detail: "Cession de parts", }, ];
let AVIS_DEMO = AVIS_SOURCE;

const STATS_SOURCE = [ { value: "3", label: "Notaires et 6 collaborateurs" }, { value: "900+", label: "Actes reçus par an" }, { value: "48 h", label: "Réponse écrite garantie" }, { value: "7 j", label: "Premier rendez-vous" }, ];
let STATS = STATS_SOURCE;

const ROMAINS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

function Reveal({
  children,
  delay = 0,
  y = 30,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -8% 0px" });
  return (
    <motion.div
      ref={ref} style={style} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.95, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function Kicker({
  children,
  color = C.accentDark,
  align = "left",
}: {
  children: React.ReactNode;
  color?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: align === "center" ? "center" : "flex-start", }}
    >
      <span style={{ width: 40, height: 1, background: color, opacity: 0.8, flexShrink: 0 }} />
      <span
        style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.36em", textTransform: "uppercase", fontWeight: 500, color, }}
      >
        {children}
      </span>
      {align === "center" && (
        <span style={{ width: 40, height: 1, background: color, opacity: 0.8, flexShrink: 0 }} />
      )}
    </div>
  );
}

/** Chiffre romain fantôme : la texture de la revue. */
function Ghost({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span
      aria-hidden style={{ position: "absolute", fontFamily: SERIF, fontWeight: 500, lineHeight: 0.78, color: C.white, opacity: 0.055, pointerEvents: "none", userSelect: "none", ...style, }}
    >
      {children}
    </span>
  );
}

/** Le sceau notarial, dessiné : deux cercles, une balance, aucune requête. */
function SceauSVG({ size = 260, stroke = C.accent, opacity = 1 }: { size?: number; stroke?: string; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 260 260" fill="none" aria-hidden style={{ display: "block", opacity, overflow: "visible" }}>
      <circle cx="130" cy="130" r="112" stroke={stroke} strokeWidth="1.6" />
      <circle cx="130" cy="130" r="98" stroke={stroke} strokeWidth="1" opacity="0.5" strokeDasharray="3 6" />
      <circle cx="130" cy="130" r="72" stroke={stroke} strokeWidth="1.2" opacity="0.7" />
      {/* fléau */}
      <path d="M78 106 H 182" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M130 92 V 168" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M110 168 H 150" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
      {/* plateaux */}
      <path d="M78 106 L 64 138 H 92 Z" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M182 106 L 168 138 H 196 Z" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
      {/* les douze crans du sceau — le détail gratuit */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI) / 6;
        const x1 = 130 + Math.cos(a) * 112;
        const y1 = 130 + Math.sin(a) * 112;
        const x2 = 130 + Math.cos(a) * 122;
        const y2 = 130 + Math.sin(a) * 122;
        return <path key={i} d={`M${x1} ${y1} L ${x2} ${y2}`} stroke={stroke} strokeWidth="1.2" opacity="0.6" strokeLinecap="round" />;
      })}
    </svg>
  );
}

/** Lien de navigation : soulignement en largeur qui pousse. */
function NavLink({ label, href }: { label: string; href: string }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ position: "relative", fontFamily: SANS, fontSize: 12.5, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 400, color: h ? C.ink : C.textMuted, textDecoration: "none", padding: "13px 2px", transition: "color .45s cubic-bezier(0.16, 1, 0.3, 1)", }}
    >
      {label}
      <span
        style={{ position: "absolute", left: 0, bottom: 8, height: 1, width: h ? "100%" : "0%", background: C.accent, transition: "width .5s cubic-bezier(0.16, 1, 0.3, 1)", }}
      />
    </a>
  );
}

/** Entrée du sommaire : numéro romain, titre, points de conduite, matière. */
function SommaireRow({
  s,
  n,
}: {
  s: { titre: string; desc: string; tag: string };
  n: number;
}) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ position: "relative", borderTop: `1px solid ${h ? C.accent : C.border}`, background: h ? C.bgCard : "transparent", transform: h ? "translateY(-3px)" : "translateY(0)", boxShadow: h ? "0 22px 46px -30px rgba(0,0,0,0.95), inset 0 1px 0 0 rgba(255,255,255,0.06)" : "0 0 0 0 rgba(0,0,0,0), inset 0 0 0 0 rgba(255,255,255,0)", transition: "all .5s cubic-bezier(0.16, 1, 0.3, 1)", padding: "clamp(22px, 2.8vw, 34px) clamp(12px, 1.8vw, 26px)", }}
    >
      <div className="i333-som">
        <span
          style={{ fontFamily: SERIF, fontSize: "clamp(20px, 2.2vw, 28px)", lineHeight: 1, color: h ? C.accent : C.textFaint, fontVariantNumeric: "tabular-nums", transition: "color .5s cubic-bezier(0.16, 1, 0.3, 1)", }}
        >
          {ROMAINS[n % ROMAINS.length]}
        </span>

        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <h3
              style={{ fontFamily: SERIF, fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 500, lineHeight: 1.1, letterSpacing: "-0.012em", color: C.ink, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", }}
            >
              {s.titre}
            </h3>
            <span
              aria-hidden className="i333-conduite" style={{ flex: 1, minWidth: 20, borderBottom: `1px dotted ${h ? C.accent : C.border}`, transform: "translateY(-5px)", transition: "border-color .5s cubic-bezier(0.16, 1, 0.3, 1)", }}
            />
            <span
              style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.26em", textTransform: "uppercase", color: C.accentDark, whiteSpace: "nowrap", }}
            >
              {s.tag}
            </span>
          </div>
          <p
            style={{ fontFamily: SANS, fontSize: 14, fontWeight: 300, lineHeight: 1.82, color: C.textMuted, margin: "12px 0 0", maxWidth: 660, }}
          >
            {s.desc}
          </p>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 13, fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent, opacity: h ? 1 : 0, transform: h ? "translateX(0)" : "translateX(-8px)", transition: "all .5s cubic-bezier(0.16, 1, 0.3, 1)", }}
          >
            En parler à l'étude
            <ArrowRight size={13} style={{ transform: h ? "translateX(4px)" : "translateX(0)", transition: "transform .5s cubic-bezier(0.16, 1, 0.3, 1)" }} />
          </span>
        </div>
      </div>
    </div>
  );
}

/** Ligne du barème : table réglementée, numérotation romaine, prix en serif. */
function BaremeRow({ t, n }: { t: { a: string; p: string; n: string }; n: number }) {
  const [h, setH] = useState(false);
  return (
    <div
      className="i333-bareme" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ borderTop: `1px solid ${C.border}`, borderLeft: `2px solid ${h ? C.accent : "transparent"}`, background: h ? C.bgCard : "transparent", transform: h ? "translateY(-2px)" : "none", boxShadow: h ? "0 18px 40px -28px rgba(0,0,0,0.95), inset 0 1px 0 0 rgba(255,255,255,0.05)" : "none", transition: "all .48s cubic-bezier(0.16, 1, 0.3, 1)", }}
    >
      <span style={{ fontFamily: SERIF, fontSize: 15, color: C.textFaint, letterSpacing: "0.08em" }}>
        {ROMAINS[n % ROMAINS.length]}
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: SERIF, fontSize: "clamp(18px, 1.8vw, 23px)", color: C.ink, lineHeight: 1.22 }}>{t.a}</div>
        <div style={{ fontFamily: SANS, fontSize: 13.2, fontWeight: 300, lineHeight: 1.74, color: C.textMuted, marginTop: 7, maxWidth: 520 }}>
          {t.n}
        </div>
      </div>
      <div
        style={{ fontFamily: SERIF, fontSize: "clamp(18px, 1.9vw, 24px)", fontStyle: "italic", color: C.accentDark, whiteSpace: "nowrap", textAlign: "right", fontVariantNumeric: "tabular-nums", }}
      >
        {t.p}
      </div>
    </div>
  );
}

/* ── Repli photo : le client d'abord, le thème ensuite ───────────────────── */
function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/** Cadre à repli dessiné : sans image, le sceau tient la place. */
function Plaque({
  src,
  alt,
  legende,
  ratio = "4 / 3",
}: {
  src: string;
  alt: string;
  legende: string;
  ratio?: string;
}) {
  const [h, setH] = useState(false);
  return (
    <figure
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ margin: 0, border: `1px solid ${h ? C.accent : C.border}`, background: C.bgDark, transform: h ? "translateY(-4px)" : "none", boxShadow: h ? "0 28px 54px -32px rgba(0,0,0,0.95), inset 0 1px 0 0 rgba(255,255,255,0.06)" : "none", transition: "all .5s cubic-bezier(0.16, 1, 0.3, 1)", }}
    >
      <div
        style={{ position: "relative", aspectRatio: ratio, overflow: "hidden", background: `linear-gradient(158deg, ${C.bgCard} 0%, ${C.bgDark} 58%, ${C.bgDarkAlt} 100%)`, }}
      >
        <div aria-hidden className="i333-reglure" style={{ position: "absolute", inset: 0, opacity: 0.55 }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <SceauSVG size={190} stroke={C.minute} opacity={0.26} />
        </div>
        {src ? (
          <img
            src={src} alt={alt} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", transform: h ? "scale(1.04)" : "scale(1)", transition: "transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)", }}
          />
        ) : null}
      </div>
      <figcaption
        style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: C.textMuted, background: C.bgAlt, padding: "13px 16px", borderTop: `1px solid ${C.border}`, }}
      >
        {legende}
      </figcaption>
    </figure>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════════════════ */
export default function EtudeDuCanalPage() {
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

  /* Affectations AVANT tout appel de helper. */
  fd = session?.formData;
  c = session?.generatedContent;
  bp = session?.businessProfile;
  sessionData = session;
  brand = fd?.brandColor ?? null;

  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...SERVICES_SOURCE[i % SERVICES_SOURCE.length],
      titre: s.title ?? SERVICES_SOURCE[i % SERVICES_SOURCE.length].titre,
      desc: s.description ?? s.desc ?? SERVICES_SOURCE[i % SERVICES_SOURCE.length].desc,
    })),
    SERVICES_SOURCE,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      ...AVIS_SOURCE[i % AVIS_SOURCE.length],
      auteur: r.name ?? r.author ?? AVIS_SOURCE[i % AVIS_SOURCE.length].auteur,
      texte: r.text ?? AVIS_SOURCE[i % AVIS_SOURCE.length].texte,
      detail: r.location ?? r.role ?? AVIS_SOURCE[i % AVIS_SOURCE.length].detail,
    })),
    AVIS_SOURCE,
  );
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
  ENGAGEMENT = resolveList(
    clientList(sessionData, "engagements.liste") ?? clientCertifications(sessionData),
    ENGAGEMENT_SOURCE,
  );

  /*
    La couverture tourne : trois écrans se succèdent, et chacun porte un
    grand titre. Le premier prenait l'accroche du client, les deux suivants
    gardaient la phrase du thème — « Transmettre clairement, de son vivant. »
    s'affichait donc en titre chez un couvreur, quelques secondes après son
    propre nom. Un titre qui parle du métier d'un autre est le défaut le plus
    visible qu'une page puisse avoir.

    Les couvertures suivantes portent donc les prestations du client, et la
    mention « Matière » son métier. Sans données du client, le thème garde ses
    propres mots — c'est la règle.
  */
  const CLIENT_SERVICES = clientServices(sessionData);
  const accroche = clientHeroLine(sessionData, 0, 1, 54) ?? clientTagline(sessionData);
  const metierClient = clientTrade(sessionData);
  HERO = accroche
    ? HERO_SOURCE.map((h, i) =>
        i === 0
          ? { ...h, k: (CLIENT_SERVICES?.[0]?.title as string) ?? h.k, line: accroche }
          : {
              ...h,
              k: metierClient ?? h.k,
              line: (CLIENT_SERVICES?.[i]?.title as string) ?? h.line,
              sub: (CLIENT_SERVICES?.[i]?.description as string) ?? h.sub,
            },
      )
    : HERO_SOURCE;

  const SERVICES = SERVICES_DEMO;
  const AVIS = AVIS_DEMO;
  const METHODE = METHODE_SOURCE;

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  /* Un seul index pilote tout le héros : titre, méta-rangée, bandeau, compteur. */
  const { i, next, prev } = useSlides(HERO.length, DWELL.slow);
  const S = HERO[i] ?? HERO_SOURCE[0];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const marque = fd?.businessName ?? clientName(sessionData) ?? "Étude du Canal";
  const ville = clientCity(sessionData) ?? "Rennes";
  const metier = clientTrade(sessionData) ?? "Notaires";
  const tel = clientPhone(sessionData) ?? "02 99 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? "+33299000000").replace(/\s/g, "")}`;
  const mail = clientEmail(sessionData) ?? "accueil@etude-du-canal.fr";
  const adresse = clientAddress(sessionData);

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip" }}>
      <style>{`${FONTS_CSS}

        /* ── texture métier : la réglure des minutes ──────────────────────── */
        .i333-reglure {
          background-image: repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, rgba(255,255,255,0) 1px 30px);
          pointer-events: none;
        }

        /* ── grilles pilotées ici, jamais en style inline ─────────────────── */
        .i333-meta {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(10px, 1.6vw, 24px);
          border-top: 1px solid rgba(255,255,255,0.09);
          border-bottom: 1px solid rgba(255,255,255,0.09);
          padding: 14px 0;
        }

        .i333-bandeau {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
          gap: clamp(18px, 3vw, 40px);
          align-items: center;
          border-top: 1px solid rgba(255,255,255,0.09);
          padding-top: clamp(20px, 2.6vw, 30px);
        }

        .i333-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          max-width: 1180px;
          margin: 0 auto;
        }

        .i333-som {
          display: grid;
          grid-template-columns: minmax(0, 46px) minmax(0, 1fr);
          gap: clamp(12px, 2vw, 28px);
          align-items: start;
        }

        .i333-methode {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(230px, 100%), 1fr));
          gap: 0;
        }

        .i333-split {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
          gap: clamp(30px, 5vw, 76px);
          align-items: center;
          max-width: 1140px;
          margin: 0 auto;
        }

        .i333-bareme {
          display: grid;
          grid-template-columns: minmax(0, 40px) minmax(0, 1fr) minmax(0, 210px);
          gap: clamp(12px, 2vw, 26px);
          align-items: baseline;
          padding: clamp(20px, 2.4vw, 30px) clamp(12px, 1.8vw, 24px);
        }

        .i333-avis {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
          gap: clamp(18px, 2.4vw, 32px);
        }

        .i333-pied {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr);
          gap: clamp(24px, 4vw, 56px);
        }

        /* ── points de rupture ────────────────────────────────────────────── */
        @media (max-width: 1000px) {
          #i333-nav { display: none !important; }
          .i333-burger { display: flex !important; }
          .i333-split { grid-template-columns: 1fr; }
          .i333-pied { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 860px) {
          .i333-meta { grid-template-columns: 1fr 1fr; row-gap: 14px; }
          .i333-bandeau { grid-template-columns: 1fr; }
          .i333-stats { grid-template-columns: 1fr 1fr; }
          .i333-conduite { display: none !important; }
          .i333-som { grid-template-columns: minmax(0, 34px) minmax(0, 1fr); }
          .i333-bareme { grid-template-columns: minmax(0, 32px) minmax(0, 1fr); row-gap: 10px; }
          .i333-bareme > :last-child { grid-column: 2 / -1; text-align: left; }
          .i333-pied { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .i333-bareme { transition: none !important; }
        }
      `}</style>

      {/* ══ NAV ══════════════════════════════════════════════════════════ */}
      <nav
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: scrolled ? "10px clamp(18px, 5vw, 56px)" : "22px clamp(18px, 5vw, 56px)", background: scrolled ? "rgba(12,14,20,0.93)" : "transparent", backdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none", WebkitBackdropFilter: scrolled ? "blur(14px) saturate(130%)" : "none", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "padding .55s cubic-bezier(0.16, 1, 0.3, 1), background .55s cubic-bezier(0.16, 1, 0.3, 1), border-color .55s cubic-bezier(0.16, 1, 0.3, 1), backdrop-filter .55s cubic-bezier(0.16, 1, 0.3, 1)", }}
      >
        <a href="#haut" style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0, textDecoration: "none" }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={marque} style={{ height: 32, maxWidth: 168, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Scale size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span
                style={{ fontFamily: SERIF, fontSize: 21, letterSpacing: "0.01em", color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", }}
              >
                {marque}
              </span>
              <span
                style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.3em", textTransform: "uppercase", color: C.textFaint, marginLeft: 4, whiteSpace: "nowrap", }}
              >
                {metier}
              </span>
            </>
          )}
        </a>

        <div id="i333-nav" style={{ display: "flex", gap: "clamp(14px, 1.8vw, 28px)", alignItems: "center" }}>
          {NAV.map((n) => (
            <NavLink key={n.l} label={n.l} href={n.h} />
          ))}
          <motion.a
            href={telHref} whileHover={{ y: -2 }} transition={{ duration: 0.45, ease: EASE }} style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, background: C.accent, color: C.onAccent, padding: "13px 24px", textDecoration: "none", whiteSpace: "nowrap", }}
          >
            Prendre rendez-vous
          </motion.a>
        </div>

        <button
          className="i333-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44, }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "transform .35s cubic-bezier(0.16, 1, 0.3, 1)", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "opacity .3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "transform .35s cubic-bezier(0.16, 1, 0.3, 1)", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>

      {mobileOpen && (
        <div
          style={{ position: "fixed", top: 60, left: 0, right: 0, zIndex: 99, background: C.bgAlt, borderBottom: `1px solid ${C.border}`, padding: "18px clamp(20px, 6vw, 32px) 26px", display: "flex", flexDirection: "column", gap: 2, }}
        >
          {NAV.map((n) => (
            <a
              key={n.l} href={n.h} onClick={() => setMobileOpen(false)} style={{ fontFamily: SANS, fontSize: 15, letterSpacing: "0.05em", color: C.ink, textDecoration: "none", padding: "13px 0", borderBottom: `1px solid ${C.border}`, }}
            >
              {n.l}
            </a>
          ))}
          <a
            href={telHref} style={{ marginTop: 14, background: C.accent, color: C.onAccent, textAlign: "center", padding: "15px 22px", fontFamily: SANS, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, textDecoration: "none", }}
          >
            Prendre rendez-vous
          </a>
        </div>
      )}

      {/* ══ HERO — H7 magazine ═══════════════════════════════════════════ */}
      <section
        id="haut" style={{ position: "relative", minHeight: "100dvh", display: "flex", flexDirection: "column", justifyContent: "center", gap: "clamp(24px, 3.4vw, 44px)", maxWidth: 1240, margin: "0 auto", padding: "clamp(120px, 15vh, 168px) clamp(22px, 6vw, 68px) clamp(44px, 6vw, 76px)", }}
      >
        <div aria-hidden className="i333-reglure" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />
        <div
          aria-hidden style={{ position: "absolute", top: "-4%", left: "-10%", width: "min(860px, 95vw)", height: "min(860px, 95vw)", background: "radial-gradient(circle, rgba(125,143,242,0.12) 0%, rgba(125,143,242,0) 62%)", pointerEvents: "none", }}
        />
        <Ghost style={{ bottom: "12%", right: "1%", fontSize: "clamp(150px, 24vw, 340px)", opacity: 0.05 }}>
          {ROMAINS[i % ROMAINS.length]}
        </Ghost>

        {/* méta-rangée de couverture */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.05 }} style={{ position: "relative", zIndex: 2 }}
        >
          <div className="i333-meta">
            {[
              { l: "L'étude", v: marque },
              { l: "Matière", v: S.k },
              { l: "Ressort", v: clientEyebrow(sessionData) ?? `${metier} · ${ville}` },
              { l: "Régime", v: "Émoluments réglementés" },
            ].map((m) => (
              <div key={m.l}>
                <div
                  style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: "0.3em", textTransform: "uppercase", color: C.textFaint, marginBottom: 7, }}
                >
                  {m.l}
                </div>
                <div
                  style={{ fontFamily: SERIF, fontSize: "clamp(14px, 1.2vw, 17px)", color: C.ink, lineHeight: 1.4, }}
                >
                  {m.v}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── GESTE SIGNATURE : les mots de l'acte entrent en vol ───────── */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <h1
            style={{ fontFamily: SERIF, fontSize: "clamp(38px, 6.6vw, 90px)", fontWeight: 400, lineHeight: 0.99, letterSpacing: "-0.026em", color: C.ink, margin: 0, minHeight: "2.1em", overflowWrap: "break-word", }}
          >
            <WordFlight text={S.line} keyed={i} className="" />
          </h1>
          <p
            style={{ fontFamily: SANS, fontSize: "clamp(15px, 1.25vw, 17px)", fontWeight: 300, lineHeight: 1.82, color: C.textMuted, maxWidth: 560, margin: "clamp(22px, 2.6vw, 32px) 0 clamp(26px, 3vw, 36px)", }}
          >
            {/*
              Le titre porte déjà l'accroche du client : le sous-titre annonce
              donc ce que l'étude fait, jamais la même phrase deux fois.
            */}
            {clientHeroPrestations(sessionData) ??
              c?.heroSubline ??
              "Une étude jeune, des actes anciens comme le droit : vente, donation, succession, société. Chaque clause expliquée avant d'être signée, au tarif réglementé national."}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <motion.a
              href={telHref} whileHover={{ y: -3 }} transition={{ duration: 0.45, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.accent, color: C.onAccent, fontFamily: SANS, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, padding: "17px 32px", textDecoration: "none", boxShadow: "0 18px 38px -22px rgba(125,143,242,0.9)", }}
            >
              Prendre rendez-vous <ArrowRight size={15} />
            </motion.a>
            <motion.a
              href="#services" whileHover={{ y: -3 }} transition={{ duration: 0.45, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "transparent", color: C.ink, border: `1px solid ${C.border}`, fontFamily: SANS, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 400, padding: "16px 28px", textDecoration: "none", }}
            >
              Nos domaines
            </motion.a>
          </div>
        </div>

        {/* bandeau média bas de couverture */}
        <div className="i333-bandeau" style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
            <SlideIndex i={i} total={HERO.length} variant="fraction" color={C.textMuted} className="" />
            <span style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 300, color: C.textMuted, lineHeight: 1.7, maxWidth: 420 }}>
              <strong style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 16, color: C.ink }}>{S.k}</strong> — {S.sub}
            </span>
            <HairlineArrows onPrev={prev} onNext={next} color={C.ink} className="" labels={{ prev: "Domaine précédent", next: "Domaine suivant" }} />
          </div>
          <div style={{ position: "relative", border: `1px solid ${C.border}`, overflow: "hidden", background: C.bgDark }}>
            <div style={{ position: "relative", aspectRatio: "21 / 9", overflow: "hidden" }}>
              <div aria-hidden style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: `linear-gradient(150deg, ${C.bgCard} 0%, ${C.bgDarkAlt} 100%)` }}>
                <SceauSVG size={150} stroke={C.minute} opacity={0.24} />
              </div>
              <img
                src={photo(0, "https://images.pexels.com/photos/7820383/pexels-photo-7820383.jpeg?auto=compress&cs=tinysrgb&w=1400")}
                alt="Signature d'un acte à l'étude"
                loading="eager"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <div
                aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(12,14,20,0.72) 0%, rgba(12,14,20,0.18) 44%, rgba(12,14,20,0.66) 100%)", }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══ RESPIRATION ══════════════════════════════════════════════════ */}
      <section
        style={{ padding: "clamp(56px, 9vw, 118px) clamp(22px, 6vw, 68px)", background: C.bgAlt, borderTop: `1px solid ${C.border}`, textAlign: "center", }}
      >
        <Reveal>
          <p
            style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(22px, 3vw, 38px)", lineHeight: 1.42, letterSpacing: "-0.012em", color: C.ink, maxWidth: 800, margin: "0 auto", }}
          >
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (
              <>
                Chaque clause relue à voix haute, <span style={{ color: C.accentDark }}>avant le stylo.</span>
              </>
            )}
          </p>
        </Reveal>
      </section>

      {/* ══ SOMMAIRE — les domaines, numérotés ══════════════════════════ */}
      <section id="services" style={{ padding: "clamp(64px, 10vw, 132px) clamp(22px, 6vw, 68px)", background: C.bg, position: "relative" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <div
              style={{ display: "flex", flexWrap: "wrap", gap: 22, alignItems: "flex-end", justifyContent: "space-between", marginBottom: "clamp(26px, 3.4vw, 46px)", }}
            >
              <div style={{ maxWidth: 680 }}>
                <Kicker>Sommaire des domaines</Kicker>
                <h2
                  style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4.4vw, 58px)", fontWeight: 400, lineHeight: 1.04, letterSpacing: "-0.024em", color: C.ink, margin: "clamp(16px, 2vw, 24px) 0 0", }}
                >
                  {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                    <>
                      Le droit qui engage,
                      <br />
                      <em style={{ fontStyle: "italic", color: C.accentDark }}>expliqué avant signature.</em>
                    </>
                  )}
                </h2>
              </div>
              <p style={{ fontFamily: SANS, fontSize: 14, fontWeight: 300, lineHeight: 1.82, color: C.textMuted, maxWidth: 380, margin: 0 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "services.texte") ??
                  "Six matières, un interlocuteur unique par dossier — et le même barème national d'un bout à l'autre de la France."}
              </p>
            </div>
          </Reveal>

          <div style={{ borderBottom: `1px solid ${C.border}` }}>
            {SERVICES.map((s: any, idx: number) => (
              <Reveal key={`${s.titre}-${idx}`} delay={Math.min(idx, 5) * 0.055} y={22}>
                <SommaireRow s={s} n={idx} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CHIFFRES ═════════════════════════════════════════════════════ */}
      <section style={{ background: C.bgDark, position: "relative", overflow: "hidden", borderTop: `1px solid ${C.border}` }}>
        <div aria-hidden className="i333-reglure" style={{ position: "absolute", inset: 0, opacity: 0.45 }} />
        <div className="i333-stats" style={{ position: "relative", padding: "0 clamp(16px, 4vw, 40px)" }}>
          {STATS.map((s: any, idx: number) => (
            <Reveal key={`${s.label}-${idx}`} delay={idx * 0.06} y={18}>
              <div
                style={{ position: "relative", padding: "clamp(30px, 4vw, 48px) clamp(10px, 1.6vw, 20px)", borderRight: idx < STATS.length - 1 ? `1px solid ${C.border}` : "none", overflow: "hidden", }}
              >
                <Ghost style={{ top: "4%", left: "4%", fontSize: "clamp(64px, 8vw, 112px)" }}>{ROMAINS[idx % ROMAINS.length]}</Ghost>
                <div
                  style={{ position: "relative", fontFamily: SERIF, fontSize: "clamp(32px, 3.8vw, 50px)", lineHeight: 1, letterSpacing: "-0.02em", color: C.accentDark, }}
                >
                  {s.value}
                </div>
                <div
                  style={{ position: "relative", fontFamily: SANS, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.textFaint, marginTop: 11, lineHeight: 1.6, }}
                >
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ MÉTHODE — quatre colonnes filetées ══════════════════════════ */}
      <section id="methode" style={{ padding: "clamp(64px, 10vw, 130px) clamp(22px, 6vw, 68px)", background: C.bg }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(26px, 3.4vw, 44px)", maxWidth: 720 }}>
              <Kicker>La méthode</Kicker>
              <h2
                style={{ fontFamily: SERIF, fontSize: "clamp(29px, 4.2vw, 54px)", fontWeight: 400, lineHeight: 1.04, letterSpacing: "-0.024em", color: C.ink, margin: "clamp(16px, 2vw, 24px) 0 0", }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                  <>
                    Un acte se prépare
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accentDark }}>comme il s'exécute : sans surprise.</em>
                  </>
                )}
              </h2>
            </div>
          </Reveal>

          <div aria-hidden style={{ height: 1, background: `linear-gradient(to right, ${C.accent} 0%, ${C.border} 52%, rgba(255,255,255,0) 100%)` }} />
          <div className="i333-methode">
            {METHODE.map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.07} y={22}>
                <div
                  style={{ position: "relative", height: "100%", padding: "clamp(26px, 3vw, 40px) clamp(16px, 2vw, 30px) clamp(28px, 3.4vw, 44px)", borderRight: `1px solid ${C.border}`, overflow: "hidden", }}
                >
                  <Ghost style={{ bottom: -12, right: 8, fontSize: "clamp(70px, 8vw, 118px)" }}>{m.r}</Ghost>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent, marginTop: -4, marginBottom: 20, boxShadow: `0 0 0 5px ${C.bg}` }} />
                  <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.accentDark, marginBottom: 12 }}>
                    Temps {m.r}
                  </div>
                  <h3
                    style={{ position: "relative", fontFamily: SERIF, fontSize: "clamp(20px, 2vw, 26px)", fontWeight: 500, lineHeight: 1.16, color: C.ink, margin: "0 0 11px", }}
                  >
                    {m.t}
                  </h3>
                  <p style={{ position: "relative", fontFamily: SANS, fontSize: 13.8, fontWeight: 300, lineHeight: 1.8, color: C.textMuted, margin: 0 }}>
                    {m.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ L'ÉTUDE — engagements ═══════════════════════════════════════ */}
      <section
        id="etude" style={{ padding: "clamp(64px, 10vw, 132px) clamp(22px, 6vw, 68px)", background: C.bgAlt, borderTop: `1px solid ${C.border}` }}
      >
        <div className="i333-split">
          <Reveal>
            <div>
              <Kicker>L'étude</Kicker>
              <h2
                style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3.8vw, 48px)", fontWeight: 400, lineHeight: 1.06, letterSpacing: "-0.022em", color: C.ink, margin: "clamp(14px, 1.8vw, 22px) 0 clamp(22px, 2.6vw, 32px)", }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>
                    Officiers publics,
                    <br />
                    <em style={{ fontStyle: "italic", color: C.accentDark }}>et joignables.</em>
                  </>
                )}
              </h2>
              <div>
                {ENGAGEMENT.map((e: string, idx: number) => (
                  <div
                    key={idx} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "15px 0", borderTop: idx === 0 ? `1px solid ${C.border}` : "none", borderBottom: `1px solid ${C.border}`, }}
                  >
                    <Check size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 4 }} />
                    <span style={{ fontFamily: SANS, fontSize: 14.5, fontWeight: 300, lineHeight: 1.76, color: C.textMuted }}>{e}</span>
                  </div>
                ))}
              </div>
              <motion.a
                href={telHref} whileHover={{ y: -3 }} transition={{ duration: 0.45, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: "clamp(22px, 2.6vw, 32px)", background: C.accent, color: C.onAccent, fontFamily: SANS, fontSize: 11.5, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, padding: "16px 30px", textDecoration: "none", }}
              >
                Nous appeler <ArrowRight size={15} />
              </motion.a>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div style={{ display: "grid", gap: "clamp(14px, 2vw, 20px)" }}>
              <Plaque src={photo(1, "")} alt="Salle de signature de l'étude" legende="Salle de signature" ratio="16 / 10" />
              <div
                style={{ position: "relative", border: `1px solid ${C.border}`, background: `linear-gradient(150deg, ${C.bgCard} 0%, ${C.bgDark} 100%)`, padding: "clamp(22px, 2.8vw, 32px)", display: "flex", alignItems: "center", gap: "clamp(18px, 2.4vw, 28px)", overflow: "hidden", }}
              >
                <div aria-hidden className="i333-reglure" style={{ position: "absolute", inset: 0, opacity: 0.6 }} />
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <SceauSVG size={110} stroke={C.accentDark} />
                </div>
                <div style={{ position: "relative", minWidth: 0 }}>
                  <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: C.accent, marginBottom: 10 }}>
                    Force exécutoire
                  </div>
                  <p style={{ fontFamily: SERIF, fontSize: "clamp(16px, 1.5vw, 20px)", fontStyle: "italic", lineHeight: 1.5, color: C.ink, margin: 0 }}>
                    Nommés par le garde des Sceaux : ce que nous recevons vaut jugement.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ TARIFS — le barème ══════════════════════════════════════════ */}
      <section id="tarifs" style={{ padding: "clamp(64px, 10vw, 130px) clamp(22px, 6vw, 68px)", background: C.bg }}>
        <div style={{ maxWidth: 1020, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(26px, 3.4vw, 44px)" }}>
              <Kicker>Tarifs</Kicker>
              <h2
                style={{ fontFamily: SERIF, fontSize: "clamp(29px, 4.2vw, 54px)", fontWeight: 400, lineHeight: 1.04, letterSpacing: "-0.024em", color: C.ink, margin: "clamp(14px, 1.8vw, 22px) 0 0", }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                  <>
                    Le barème, <em style={{ fontStyle: "italic", color: C.accentDark }}>pas l'arbitraire.</em>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 14.5, fontWeight: 300, lineHeight: 1.8, color: C.textMuted, maxWidth: 600, margin: "16px 0 0" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.texte") ??
                  "La rémunération du notaire est fixée par l'État (art. A444 du code de commerce). S'y ajoutent débours et taxes collectés pour le Trésor public."}
              </p>
            </div>
          </Reveal>

          <div style={{ borderBottom: `1px solid ${C.border}` }}>
            {TARIFS.map((t: any, idx: number) => (
              <Reveal key={`${t.a}-${idx}`} delay={Math.min(idx, 4) * 0.055} y={18}>
                <BaremeRow t={t} n={idx} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <p style={{ fontFamily: SANS, fontSize: 12, fontWeight: 300, color: C.textFaint, marginTop: 20, lineHeight: 1.75 }}>
              Émoluments hors taxes. Débours et droits d'enregistrement sont collectés pour le compte du Trésor public et détaillés sur le décompte remis à la signature.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══ AVIS — blocs magazine ═══════════════════════════════════════ */}
      <section
        style={{ padding: "clamp(64px, 10vw, 134px) clamp(22px, 6vw, 68px)", background: C.bgDark, position: "relative", overflow: "hidden", borderTop: `1px solid ${C.border}`, }}
      >
        <div aria-hidden className="i333-reglure" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
        <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(32px, 4vw, 56px)", maxWidth: 680 }}>
              <Kicker>Dossiers clos</Kicker>
              <h2
                style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3.9vw, 48px)", fontWeight: 400, lineHeight: 1.06, letterSpacing: "-0.022em", color: C.white, margin: "clamp(14px, 1.8vw, 22px) 0 0", }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                  <>
                    Des dossiers <em style={{ fontStyle: "italic", color: C.accentDark }}>menés au bout</em>.
                  </>
                )}
              </h2>
            </div>
          </Reveal>

          <div className="i333-avis">
            {AVIS.map((a: any, idx: number) => (
              <Reveal key={`${a.auteur}-${idx}`} delay={idx * 0.09} y={26}>
                <article
                  style={{ position: "relative", height: "100%", paddingTop: 22, borderTop: `1px solid ${C.border}`, overflow: "hidden", }}
                >
                  <span
                    aria-hidden style={{ position: "absolute", top: -6, left: -4, fontFamily: SERIF, fontSize: 128, lineHeight: 1, color: C.white, opacity: 0.06, pointerEvents: "none", }}
                  >
                    &laquo;
                  </span>
                  <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: C.accent, marginBottom: 16 }}>
                    {ROMAINS[idx % ROMAINS.length]} · {a.detail}
                  </div>
                  <p
                    style={{ position: "relative", fontFamily: SERIF, fontSize: "clamp(16px, 1.5vw, 19px)", fontStyle: "italic", lineHeight: 1.62, color: "rgba(255,255,255,0.86)", margin: "0 0 20px", }}
                  >
                    {a.texte}
                  </p>
                  <div style={{ fontFamily: SANS, fontSize: 12.5, fontWeight: 500, letterSpacing: "0.06em", color: C.minute }}>{a.auteur}</div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTACT ══════════════════════════════════════════════════════ */}
      <section
        id="contact" style={{ padding: "clamp(66px, 10vw, 136px) clamp(22px, 6vw, 68px)", background: C.accentLight, textAlign: "center", position: "relative", overflow: "hidden", borderTop: `1px solid ${C.border}`, }}
      >
        <Ghost style={{ top: "-10%", left: "50%", transform: "translateX(-50%)", fontSize: "clamp(150px, 22vw, 320px)", opacity: 0.05 }}>
          ACTE
        </Ghost>
        <div style={{ position: "relative", maxWidth: 780, margin: "0 auto" }}>
          <Reveal>
            <Kicker align="center">Premier rendez-vous</Kicker>
            <h2
              style={{ fontFamily: SERIF, fontSize: "clamp(30px, 4.6vw, 58px)", fontWeight: 400, lineHeight: 1.04, letterSpacing: "-0.026em", color: C.ink, margin: "clamp(16px, 2vw, 24px) 0 clamp(14px, 1.8vw, 20px)", }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                <>
                  Exposez votre situation,
                  <br />
                  <em style={{ fontStyle: "italic", color: C.accentDark }}>repartez avec un plan.</em>
                </>
              )}
            </h2>
            <p
              style={{ fontFamily: SANS, fontSize: "clamp(14.5px, 1.2vw, 16px)", fontWeight: 300, lineHeight: 1.82, color: C.textMuted, maxWidth: 480, margin: "0 auto clamp(28px, 3.4vw, 40px)", }}
            >
              {/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ??
                "Premier échange téléphonique sans engagement. Rendez-vous sous sept jours, à l'étude ou en visio."}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <motion.a
                href={telHref} whileHover={{ y: -3 }} transition={{ duration: 0.45, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.accent, color: C.onAccent, fontFamily: SANS, fontSize: 13, letterSpacing: "0.08em", fontWeight: 600, padding: "18px 34px", textDecoration: "none", boxShadow: "0 20px 40px -24px rgba(125,143,242,0.95)", }}
              >
                <Phone size={17} /> {tel}
              </motion.a>
              <motion.a
                href={`mailto:${mail}`} whileHover={{ y: -3 }} transition={{ duration: 0.45, ease: EASE }} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "transparent", color: C.ink, border: `1px solid ${C.accent}`, fontFamily: SANS, fontSize: 13, letterSpacing: "0.08em", fontWeight: 600, padding: "17px 30px", textDecoration: "none", }}
              >
                <Mail size={17} /> Nous écrire
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════════════ */}
      <footer style={{ background: C.bgDarkAlt, padding: "clamp(44px, 6vw, 72px) clamp(22px, 6vw, 68px) clamp(22px, 3vw, 30px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div className="i333-pied" style={{ marginBottom: "clamp(28px, 4vw, 46px)" }}>
            <div>
              <div style={{ fontFamily: SERIF, fontSize: 23, color: C.accentDark, marginBottom: 12 }}>{marque}</div>
              <p style={{ fontFamily: SANS, fontSize: 13, fontWeight: 300, lineHeight: 1.8, color: C.textFaint, maxWidth: 340, margin: 0 }}>
                Officiers publics et ministériels · {ville}
                <br />
                Chambre des notaires d'Ille-et-Vilaine
              </p>
            </div>

            <div>
              <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>
                Nous joindre
              </div>
              {[
                { icon: <MapPin size={13} />, t: adresse ?? clientCodePostalVille(sessionData, "35000", "Rennes") },
                { icon: <Phone size={13} />, t: tel },
                { icon: <Mail size={13} />, t: mail },
              ].map((it, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, alignItems: "center", fontFamily: SANS, fontSize: 13, fontWeight: 300, color: C.textFaint, marginBottom: 9 }}>
                  <span style={{ color: C.accent, display: "flex" }}>{it.icon}</span>
                  {it.t}
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>
                Sections
              </div>
              {NAV.map((n) => (
                <a key={n.l} href={n.h} style={{ display: "block", fontFamily: SANS, fontSize: 13, fontWeight: 300, color: C.textFaint, textDecoration: "none", marginBottom: 9 }}>
                  {n.l}
                </a>
              ))}
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 300, color: "rgba(255,255,255,0.28)" }}>
              © 2026 {marque} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
              {/* VILLE_PIED */}
              {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 300, color: "rgba(255,255,255,0.28)" }}>
              Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
