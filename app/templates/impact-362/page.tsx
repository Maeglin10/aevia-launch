"use client";
// @ts-nocheck

/* ════════════════════════════════════════════════════════════════════════════
   IMPACT-362 — DUO PEINTURES · Père & fille, peinture et rénovation, Orléans

   Geste signature   : InvertSweep — la page bascule du sombre au clair au fil
                       du défilement. Ici la bascule N'EST PAS décorative :
                       c'est l'avant/après du chantier, et la jauge du héros
                       affiche sa progression réelle (0 % = avant, 100 % = après).
   Archétype héros   : H6 — typographique, sans photographie. Texture de bâche
                       en hachures, mot fantôme, jauge de chantier.
   Paire de fontes   : P9 — Syne (display, structure) + Work Sans (texte, voix).
   Signature visuelle: la bande. Prestations en colonnes filetées, tarifs en
                       bandes pleine largeur, avis en bandes empilées — jamais
                       une grille de cartes.

   ⚠ Piège connu, traité ici : dans le héros, PAS UNE SEULE couleur fixe. Tout
   hérite de `currentColor`, ou se calcule en `color-mix` depuis la progression
   `invert` — sinon la moitié de la bascule se retrouve sans contraste.

   Contenu : celui du thème, mot pour mot. Rien d'inventé, aucune section
   supprimée.
   ════════════════════════════════════════════════════════════════════════════ */

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Building, CheckCircle, Clock, Mail, MapPin, Paintbrush, Phone, Quote, Users } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { InvertSweep } from "@/lib/templates/hero-kit-3";
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

/* ── Jetons ───────────────────────────────────────────────────────────────── */
let C: Record<string, string> = {
  bg: "#f9f8f4",
  bgAlt: "#eeeae1",
  bgDark: "#131a20",
  bgDarkAlt: "#0d1216",
  bgCard: "#ffffff",
  accent: "var(--brand,#356b8f)",
  accentDark: "var(--brand-light,#24506e)",
  accentLight: "#dfe9f0",
  ink: "#1a1f24",
  /* l'encre claire, celle du haut de la bascule : le héros en a besoin */
  inkLight: "#f4f3ef",
  textMuted: "#5e6670",
  textFaint: "#949aa2",
  border: "#e0dcd2",
  white: "#ffffff",
  /* clé métier : la craie du carnet de chantier */
  craie: "#c9b48d",
};

const DISPLAY = "'Syne', system-ui, sans-serif";
const BODY = "'Work Sans', system-ui, -apple-system, 'Segoe UI', sans-serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const NAV = [
  { l: "Chantiers", h: "#services" },
  { l: "La méthode", h: "#methode" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Contact", h: "#contact" },
];

/* ── Données de démonstration (contenu du thème, conservé mot pour mot) ───── */

const SERVICES_SOURCE = [
  { titre: "Appartements locatifs", desc: "Remise en blanc entre deux locataires : murs, plafonds, boiseries en une semaine, photos avant/après pour le dossier du propriétaire.", tag: "Locatif" },
  { titre: "Cages d'escalier", desc: "Le chantier que les copropriétés repoussent : échafaudage d'escalier, travail par demi-volées, immeuble praticable tous les jours.", tag: "Copro" },
  { titre: "Maisons familiales", desc: "Pièce par pièce ou tout d'un coup : on planifie avec votre vie, pas contre elle. Meubles déplacés et remis, sols garantis.", tag: "Maison" },
  { titre: "Plafonds & dégâts des eaux", desc: "Après sinistre : traitement des auréoles, sous-couche isolante, raccords invisibles. Facture conforme pour l'assurance.", tag: "Sinistre" },
  { titre: "Boiseries & radiateurs", desc: "Portes, plinthes, fenêtres, radiateurs déposés-peints-reposés : les finitions qui datent un intérieur — ou le rajeunissent.", tag: "Boiseries" },
  { titre: "Petits chantiers assumés", desc: "Une chambre, un couloir, un plafond : pas de chantier trop petit — le carnet de la semaine leur garde de la place.", tag: "Petits" },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE_SOURCE = [
  { n: "01", t: "Visite et devis en 48 h", d: "Métré, état des supports, contraintes d'accès. Le devis détaille tout, y compris ce qu'on ne fera pas." },
  { n: "02", t: "Dates bloquées, tenues", d: "Le chantier commence à la date écrite. Si un imprévu décale, vous le savez une semaine avant — pas la veille." },
  { n: "03", t: "Le carnet de chantier", d: "Chaque jour : ce qui est fait, ce qui reste, photo à l'appui. Posé sur le chantier, consultable par tous." },
  { n: "04", t: "Réception et retouches", d: "Tour complet ensemble, retouches immédiates, garanties et factures remises le jour même." },
];

const ENGAGEMENT_SOURCE = [
  "Garantie décennale et RC pro à jour, attestations jointes à chaque devis",
  "Jamais de sous-traitance ni d'intérim : ceux qui devisent sont ceux qui peignent",
  "Date de début écrite au devis, pénalité offerte si on la manque de notre fait",
  "Chantier aspiré et rangé chaque soir — la poussière ne fait pas partie du devis",
];
let ENGAGEMENT = ENGAGEMENT_SOURCE;

const TARIFS_SOURCE = [
  { a: "Remise en blanc (pièce 12 m²)", p: "490 € forfait", n: "Murs + plafond + plinthes, blanc satiné lessivable." },
  { a: "Murs & plafonds sur mesure", p: "26–34 €/m²", n: "Selon supports, teintes au choix sans supplément." },
  { a: "Cage d'escalier (par étage)", p: "dès 890 €", n: "Échafaudage, murs, plafonds, rampe — praticable chaque soir." },
  { a: "Plafond après dégât des eaux", p: "dès 390 €", n: "Traitement, sous-couche isolante, raccord invisible." },
];
let TARIFS = TARIFS_SOURCE;

function AVIS_SOURCE_LIVE() {
  return [
    { texte: "Trois appartements locatifs remis en blanc en trois semaines, photos avant/après envoyées à chaque fin. Mes locations repartent plus vite et je ne visite même plus les chantiers.", auteur: "Propriétaire bailleur", detail: "Remises en blanc" },
    { texte: "La cage d'escalier de notre copro repoussée depuis cinq ans : faite en huit jours, immeuble praticable tous les soirs. Le carnet de chantier posé dans le hall a mis tout le monde d'accord.", auteur: "Conseil syndical, " + (clientCity(sessionData) ?? "Orléans") + " centre", detail: "Copropriété" },
    { texte: "Un père et une fille qui bossent en silence, protègent tout, et laissent la maison plus propre que trouvée. Le devis n'a pas bougé d'un euro.", auteur: "Régine M.", detail: "Maison familiale" },
  ];
}
let AVIS_SOURCE = AVIS_SOURCE_LIVE();
let AVIS = AVIS_SOURCE;

const STATS_SOURCE = [
  { value: "2", label: "Compagnons — et pas d'intérim" },
  { value: "48 h", label: "Devis après visite" },
  { value: "850+", label: "Chantiers depuis 1998" },
  { value: "J+0", label: "Chantier aspiré chaque soir" },
];
let STATS = STATS_SOURCE;

/* Une seule photographie dans ce thème — le héros est typographique. Le second
   emplacement attend celle du client ; sans elle, le repli CSS tient la page. */
const PHOTO_REPLI = [
  "https://images.pexels.com/photos/7217983/pexels-photo-7217983.jpeg?auto=compress&cs=tinysrgb&w=1400",
  "",
];

function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ── Primitives ───────────────────────────────────────────────────────────── */

function Reveal({ children, delay = 0, y = 24, style }: { children: React.ReactNode; delay?: number; y?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -10% 0px" });
  return (
    <motion.div
      ref={ref}
      style={style}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.88, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Kicker : filet de 40 px, capitales très espacées. `inherit` pour le héros. */
function Kicker({ children, tone = "ink", center = false }: { children: React.ReactNode; tone?: "ink" | "light" | "inherit"; center?: boolean }) {
  const col = tone === "light" ? "rgba(255,255,255,0.68)" : tone === "inherit" ? "currentColor" : C.accentDark;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: center ? "center" : "flex-start", color: col, opacity: tone === "inherit" ? 0.78 : 1 }}>
      <span aria-hidden style={{ width: 40, height: 1, background: "currentColor", opacity: 0.8, flexShrink: 0 }} />
      <span style={{ fontFamily: BODY, fontSize: 10.5, letterSpacing: "0.34em", textTransform: "uppercase", fontWeight: 600, color: "currentColor" }}>{children}</span>
      {center && <span aria-hidden style={{ width: 40, height: 1, background: "currentColor", opacity: 0.8, flexShrink: 0 }} />}
    </div>
  );
}

/**
 * La jauge avant → après.
 *
 * Elle n'illustre pas la bascule : elle la mesure. `progress` est la valeur
 * réelle rendue par InvertSweep, donc la barre et la page disent la même chose.
 * Tracée en `currentColor` : lisible sur les deux fonds, par construction.
 */
function JaugeChantier({ progress }: { progress: number }) {
  const pct = Math.round(progress * 100);
  return (
    <div style={{ maxWidth: 460, color: "currentColor" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <span style={{ fontFamily: BODY, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 600, opacity: pct > 55 ? 0.35 : 0.9 }}>Avant</span>
        <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 12, letterSpacing: "0.04em", opacity: 0.55, fontVariantNumeric: "tabular-nums" }}>{pct} %</span>
        <span style={{ fontFamily: BODY, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 600, opacity: pct > 55 ? 0.9 : 0.35 }}>Après</span>
      </div>
      <div style={{ position: "relative", height: 2, background: "currentColor", opacity: 0.9 }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "currentColor", opacity: 0.22 }} />
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            top: -1,
            height: 4,
            width: `${pct}%`,
            background: "currentColor",
            transition: "width 120ms linear",
          }}
        />
      </div>
      {/* graduations : la règle du peintre */}
      <div aria-hidden style={{ display: "flex", justifyContent: "space-between", marginTop: 5, opacity: 0.32 }}>
        {[...Array(11)].map((_, n) => (
          <span key={n} style={{ width: 1, height: n % 5 === 0 ? 8 : 4, background: "currentColor", display: "block" }} />
        ))}
      </div>
      <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 12.5, lineHeight: 1.6, opacity: 0.6, margin: "14px 0 0" }}>
        Faites défiler — l'avant / après se révèle.
      </p>
    </div>
  );
}

/** Une bande de tarif : pleine largeur, prix à droite, filet dessous. */
function BandeTarif({ t, idx }: { t: any; idx: number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={Math.min(idx, 4) * 0.05}>
      <div
        className="i362-bande"
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          display: "grid",
          gridTemplateColumns: "56px minmax(0,1fr) auto",
          gap: "6px clamp(14px, 2.4vw, 32px)",
          alignItems: "center",
          padding: "clamp(20px, 2.6vw, 30px) clamp(12px, 2vw, 24px)",
          borderBottom: `1px solid ${C.border}`,
          background: h ? C.bgCard : "transparent",
          transform: h ? "translateX(6px)" : "translateX(0)",
          boxShadow: h ? "0 16px 40px rgba(19,26,32,0.08), 0 2px 8px rgba(19,26,32,0.05)" : "none",
          transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), background 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(22px, 3vw, 34px)", lineHeight: 1, color: h ? C.accent : C.border, transition: "color 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          {String(idx + 1).padStart(2, "0")}
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "clamp(16.5px, 1.9vw, 20px)", lineHeight: 1.26, letterSpacing: "-0.015em", color: C.ink }}>{t.a}</div>
          <div style={{ fontFamily: BODY, fontWeight: 300, fontSize: 13.5, lineHeight: 1.68, color: C.textMuted, marginTop: 7, maxWidth: 560 }}>{t.n}</div>
        </div>
        <div className="i362-prix" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(15px, 1.8vw, 19px)", color: C.accentDark, whiteSpace: "nowrap", textAlign: "right" }}>
          {t.p}
        </div>
      </div>
    </Reveal>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function DuoPeinturesPage() {
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
  AVIS_SOURCE = AVIS_SOURCE_LIVE();
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
      p: s.price || "Sur devis",
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

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const nom = fd?.businessName ?? clientName(sessionData) ?? "Duo Peintures";
  const ville = clientCity(sessionData) ?? "Orléans";
  const metier = clientTrade(sessionData) ?? "Peinture & rénovation";
  const phone = clientPhone(sessionData) ?? "02 38 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? "+33238000000").replace(/[^+\d]/g, "")}`;
  const mail = clientEmail(sessionData) ?? "contact@duo-peintures.fr";
  const adresse = clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "45000", "Orléans");

  const equipePhoto = photo(0, PHOTO_REPLI[0]);
  const carnetPhoto = photo(1, PHOTO_REPLI[1]);

  /* Le fond courant de la bascule : sert de couleur de texte aux boutons pleins
     du héros, qui sont donc lisibles du sombre au clair sans un hex fixe. */
  const fondCourant = (p: number) => `color-mix(in srgb, ${C.bg} ${Math.round(p * 100)}%, ${C.bgDark})`;
  /* L'encre courante, calculée comme InvertSweep la calcule. Le bouton plein
     écrivait `background: currentColor` en se donnant AUSSI `color:
     fondCourant(...)` : or currentColor se résout à la couleur de l'élément
     lui-même, pas à celle qu'il hérite — le fond du bouton devenait la
     couleur de son texte, et le bouton disparaissait dans la carte. */
  const encreCourante = (p: number) => `color-mix(in srgb, ${C.ink} ${Math.round(p * 100)}%, ${C.inkLight})`;

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: BODY, overflowX: "clip" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Work+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

        /*
          ── Héros « carte flottante en débord » ────────────────────────────
          Le cadre du chantier s'arrête avant le bord droit ; la carte le
          franchit. Sans marge, rien ne peut déborder de rien.
        */
        .i362-hero {
          position: relative;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: clamp(112px, 13vh, 152px) clamp(24px, 5vw, 64px) clamp(44px, 6vh, 72px);
        }
        .i362-cadre {
          position: absolute;
          top: clamp(84px, 10.5vh, 116px);
          left: 0;
          bottom: 0;
          width: 68%;
          overflow: hidden;
        }
        .i362-carte {
          position: relative;
          z-index: 2;
          width: min(560px, 46%);
          border: 1px solid;
          box-shadow: 0 60px 120px -60px rgba(12,12,14,0.8);
          padding: clamp(24px, 3vw, 40px);
        }

        @media (max-width: 900px) {
          /* Sur un téléphone le cadre prend le haut de l'écran et la carte se
             pose dessous, en le chevauchant d'un cran. */
          .i362-hero { display: block; padding: 0 14px 20px; }
          .i362-cadre { position: absolute; inset: 0 0 auto 0; top: 0; width: 100%; height: 44dvh; }
          .i362-carte { width: auto; margin-top: calc(44dvh - 60px); }
        }

        @media (max-width: 980px) { #i362-nav { display: none !important; } .i362-burger { display: flex !important; } }
          .aevia-action-mobile { display: inline-flex !important; }
        @media (max-width: 900px) {
          .i362-split { grid-template-columns: minmax(0,1fr) !important; }
          .i362-split > * { order: initial !important; }
          .i362-colonnes { grid-template-columns: minmax(0,1fr) !important; }
          .i362-etape { grid-template-columns: minmax(0,1fr) !important; gap: 12px !important; }
          .i362-avis { grid-template-columns: minmax(0,1fr) !important; }
          .i362-sticky { position: static !important; }
          .i362-pad { padding-left: 24px !important; padding-right: 24px !important; }
        }
        @media (max-width: 620px) {
          .i362-bande { grid-template-columns: minmax(0,1fr) !important; }
          .i362-bande .i362-prix { text-align: left !important; }
          .i362-statgrille { grid-template-columns: repeat(auto-fit, minmax(min(140px,100%), 1fr)) !important; }
        }

        .i362-navlink { position: relative; }
        .i362-navlink::after {
          content: ""; position: absolute; left: 8px; bottom: 8px; height: 1.5px; width: 0;
          background: currentColor; transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .i362-navlink:hover::after { width: calc(100% - 16px); }
        .i362-fleche { transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .i362-cta:hover .i362-fleche { transform: translateX(5px); }

        @media (prefers-reduced-motion: reduce) {
          .i362-navlink::after, .i362-fleche { transition: none !important; }
        }
      `}</style>

      {/* ── NAV — collante : hauteur, fond, flou, filet + couleur d'encre ── */}
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
          background: scrolled ? "rgba(249,248,244,0.94)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          color: scrolled ? C.ink : C.inkLight,
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={nom} style={{ height: 30, maxWidth: 168, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Paintbrush size={17} color="currentColor" style={{ flexShrink: 0 }} aria-hidden />
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 19, letterSpacing: "-0.02em", color: "currentColor", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nom}</span>
              {clientName(sessionData) ? null : <span style={{ fontFamily: BODY, fontSize: 9.5, letterSpacing: "0.26em", textTransform: "uppercase", color: "currentColor", opacity: 0.6, marginLeft: 8, whiteSpace: "nowrap" }}>Père &amp; fille</span>}
            </>
          )}
        </div>
        <div id="i362-nav" style={{ display: "flex", gap: 2, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} className="i362-navlink" style={{ fontFamily: BODY, fontSize: 13.5, fontWeight: 400, color: "currentColor", opacity: 0.8, textDecoration: "none", padding: "12px 10px" }}>
              {l}
            </a>
          ))}
          <motion.a
            href={telHref}
            className="i362-cta"
            style={{ background: C.accentDark, color: C.white, padding: "12px 22px", fontFamily: BODY, fontSize: 13, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap", marginLeft: 14, display: "inline-flex", alignItems: "center", gap: 8 }}
            whileHover={{ scale: 1.03, y: -1 }}
          >
            Devis sous 48 h <ArrowRight size={14} className="i362-fleche" aria-hidden />
          </motion.a>
        </div>
        {/* L'appel à l'action sous le pouce : la barre est fixe, mais son
            bouton vit dans le menu déroulant, en display:none sous le point
            de rupture. Celui-ci paraît exactement avec le bouton de menu. */}
        <ActionMobile href={telHref} fond={C.accent} encre={C.white}>
          Appeler
        </ActionMobile>
        <button
          className="i362-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44, color: "currentColor" }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "currentColor", transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 99, background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "18px 26px 24px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ fontFamily: BODY, color: C.ink, fontSize: 16, fontWeight: 400, textDecoration: "none", padding: "12px 0" }}>
              {l}
            </a>
          ))}
          <a href={telHref} style={{ background: C.accentDark, color: C.white, padding: "14px 22px", fontFamily: BODY, fontSize: 15, fontWeight: 600, textDecoration: "none", textAlign: "center", marginTop: 10 }}>
            Devis sous 48 h
          </a>
        </div>
      )}

      {/* ── HÉROS — carte flottante en débord, sur la bascule InvertSweep ──
             Le chantier photographié tient un cadre à gauche, qui s'arrête
             avant le bord droit de l'écran ; la carte du devis se pose
             dessus et franchit ce bord. Le geste du thème ne change pas : la
             page bascule toujours du sombre au clair au fil du défilement,
             et la carte comme le cadre héritent l'encre courante — aucun hex
             figé, c'est la condition pour que les deux extrémités de la
             bascule restent lisibles. */}
      <InvertSweep dark={C.bgDark} light={C.bg} textDark={C.inkLight} textLight={C.ink} accent={C.accent} className="">
        {(invert) => (
          <div className="i362-hero">
            {/* Texture : la bâche de protection, hachures diagonales en
                currentColor — visible sur les deux fonds par construction. */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                opacity: 0.06,
                backgroundImage: "repeating-linear-gradient(-45deg, currentColor 0 1px, transparent 1px 26px)",
              }}
            />

            {/* ── Le cadre : le chantier, ou la bâche dessinée ───────────── */}
            <div className="i362-cadre">
              {equipePhoto ? (
                <img
                  src={equipePhoto}
                  alt={`${nom} — sur le chantier`}
                  loading="eager"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : (
                <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.14, backgroundImage: "repeating-linear-gradient(-45deg, currentColor 0 2px, transparent 2px 22px)" }} />
              )}
              {/* Le voile s'épaissit vers la droite, là où la carte se pose. */}
              <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, rgba(12,12,14,0.16) 0%, rgba(12,12,14,0.05) 40%, rgba(12,12,14,0.6) 100%)" }} />
              {/* Le mot du métier, posé sur le chantier. */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  left: "clamp(18px, 2.6vw, 34px)",
                  bottom: "clamp(12px, 2vh, 22px)",
                  fontFamily: DISPLAY,
                  fontWeight: 800,
                  fontSize: "clamp(40px, 6.5vw, 96px)",
                  lineHeight: 0.8,
                  letterSpacing: "-0.05em",
                  color: "rgba(255,255,255,0.2)",
                  textTransform: "uppercase",
                  userSelect: "none",
                }}
              >
                Avant
              </div>
            </div>

            {/* ── LA CARTE — elle franchit le bord droit du cadre ────────── */}
            <div className="i362-carte" style={{ background: fondCourant(invert), borderColor: "currentColor" }}>
              <Kicker tone="inherit">{clientEyebrow(sessionData) ?? `${metier} · ${ville}`}</Kicker>

              {/*
                Titre d'un seul tenant. La seconde ligne en italique fine
                soulignée était la figure — mais aussi la signature de gabarit
                de toute la série : le trait souligné suffit, sur une seule
                ligne, à dire l'avant/après.
              */}
              <h1
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 800,
                  fontSize: "clamp(30px, 3.8vw, 52px)",
                  lineHeight: 0.98,
                  letterSpacing: "-0.033em",
                  margin: "clamp(16px, 2.2vw, 26px) 0 clamp(16px, 2vw, 24px)",
                  color: "currentColor",
                  textTransform: "uppercase",
                  overflowWrap: "break-word",
                }}
              >
                {/* TEXTE_SECTION */ clientText(sessionData, "hero.titre") ?? (
                  <>
                    {clientHeroLine(sessionData, 0, 1, 40) ?? (
                      <>
                        Avant, après :{" "}
                        <span style={{ borderBottom: "3px solid currentColor", paddingBottom: "0.04em" }}>c'est tout notre métier.</span>
                      </>
                    )}
                  </>
                )}
              </h1>

              <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: "clamp(14px, 1.25vw, 16px)", lineHeight: 1.78, opacity: 0.76, margin: "0 0 clamp(20px, 2.6vw, 28px)", color: "currentColor" }}>
                {clientHeroSubtitle(sessionData) ?? c?.heroSubline ?? "Un père compagnon, une fille reprise d'entreprise : deux peintres qui rénovent cages d'escalier, appartements locatifs et maisons familiales — vite, proprement, au prix écrit."}
              </p>

              {/* Une seule action pleine ; les chantiers restent un lien. */}
              <div style={{ display: "flex", gap: "clamp(16px, 2vw, 24px)", flexWrap: "wrap", alignItems: "center", marginBottom: "clamp(22px, 3vh, 32px)" }}>
                <a
                  href={telHref}
                  className="i362-cta"
                  style={{
                    background: encreCourante(invert),
                    color: fondCourant(invert),
                    padding: "16px 30px",
                    fontFamily: BODY,
                    fontSize: 14.5,
                    fontWeight: 600,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  Demander un devis <ArrowRight size={16} className="i362-fleche" aria-hidden />
                </a>
                <a
                  href="#services"
                  style={{ color: "currentColor", fontFamily: BODY, fontSize: 13, textDecoration: "none", borderBottom: "1px solid currentColor", paddingBottom: 3, opacity: 0.86 }}
                >
                  Nos chantiers
                </a>
              </div>

              <JaugeChantier progress={invert} />
            </div>
          </div>
        )}
      </InvertSweep>

      {/* ── RESPIRATION ───────────────────────────────────────────────────── */}
      <section className="i362-pad" style={{ background: C.bg, padding: "clamp(54px, 7.5vw, 96px) 64px clamp(28px, 4vw, 44px)", textAlign: "center" }}>
        <Reveal>
          <p style={{ fontFamily: BODY, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(20px, 2.7vw, 31px)", lineHeight: 1.5, letterSpacing: "-0.015em", color: C.textMuted, maxWidth: 700, margin: "0 auto" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (
              <>
                Deux mains, deux générations. <span style={{ fontStyle: "normal", fontFamily: DISPLAY, fontWeight: 700, color: C.ink }}>Un seul carnet.</span>
              </>
            )}
          </p>
        </Reveal>
      </section>

      {/* ── LA MÉTHODE — quatre bandes numérotées, chiffres en marge ──────── */}
      <section id="methode" className="i362-pad" style={{ background: C.bg, padding: "clamp(28px, 4vw, 48px) clamp(24px, 5vw, 64px) clamp(76px, 9vw, 120px)" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(28px, 4vw, 48px)" }}>
              <Kicker>La méthode</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(30px, 4.2vw, 54px)", lineHeight: 1.02, letterSpacing: "-0.035em", color: C.ink, margin: "18px 0 0", maxWidth: 780, textTransform: "uppercase" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (
                  <>
                    Deux compagnons,
                    <br />
                    <span style={{ fontFamily: BODY, fontStyle: "italic", fontWeight: 300, textTransform: "none", letterSpacing: "-0.02em", color: C.accentDark }}>un carnet de chantier.</span>
                  </>
                )}
              </h2>
            </div>
          </Reveal>

          <div style={{ borderTop: `1px solid ${C.border}` }}>
            {METHODE_SOURCE.map((m, idx) => (
              <Reveal key={m.n} delay={Math.min(idx, 4) * 0.055}>
                <div
                  className="i362-etape"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0,0.34fr) minmax(0,0.66fr)",
                    gap: "clamp(14px, 3vw, 48px)",
                    alignItems: "start",
                    padding: "clamp(24px, 3.2vw, 38px) 0",
                    borderBottom: `1px solid ${C.border}`,
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: 14, minWidth: 0 }}>
                    <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(30px, 4.6vw, 56px)", lineHeight: 0.9, letterSpacing: "-0.04em", color: C.accentLight }}>{m.n}</span>
                    <h3 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "clamp(17px, 2vw, 22px)", lineHeight: 1.2, letterSpacing: "-0.02em", color: C.ink, margin: 0 }}>{m.t}</h3>
                  </div>
                  <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: "clamp(14.5px, 1.5vw, 16px)", lineHeight: 1.8, color: C.textMuted, margin: 0, maxWidth: 560 }}>{m.d}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Les chiffres, en marge de la méthode — pas en bande sombre. */}
          <Reveal delay={0.1}>
            <div className="i362-statgrille" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(180px, 100%), 1fr))", gap: "clamp(16px, 2.4vw, 28px)", marginTop: "clamp(36px, 5vw, 58px)" }}>
              {STATS.map((s: any, idx: number) => (
                <div key={s.label} style={{ borderLeft: `2px solid ${idx === 0 ? C.accent : C.border}`, paddingLeft: 16, minWidth: 0 }}>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(26px, 3vw, 38px)", lineHeight: 1, letterSpacing: "-0.03em", color: C.ink }}>{s.value}</div>
                  <div style={{ fontFamily: BODY, fontWeight: 300, fontSize: 12.5, lineHeight: 1.55, color: C.textFaint, marginTop: 9 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CHANTIERS — colonnes filetées, jamais de cartes ───────────────── */}
      <section id="services" className="i362-pad" style={{ background: C.bgAlt, padding: "clamp(76px, 9vw, 124px) clamp(24px, 5vw, 64px)", position: "relative", overflow: "hidden" }}>
        <span
          aria-hidden
          style={{
            position: "absolute",
            right: "-2vw",
            top: "2vh",
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: "clamp(120px, 24vw, 340px)",
            lineHeight: 0.76,
            letterSpacing: "-0.05em",
            color: C.ink,
            opacity: 0.04,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          1998
        </span>
        <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(30px, 4vw, 50px)" }}>
              <Kicker>Chantiers</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(30px, 4.2vw, 54px)", lineHeight: 1.02, letterSpacing: "-0.035em", color: C.ink, margin: "18px 0 0", maxWidth: 760, textTransform: "uppercase" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (
                  <>
                    La rénovation
                    <br />
                    <span style={{ fontFamily: BODY, fontStyle: "italic", fontWeight: 300, textTransform: "none", letterSpacing: "-0.02em", color: C.accentDark }}>qui rafraîchit tout.</span>
                  </>
                )}
              </h2>
            </div>
          </Reveal>
          <div className="i362-colonnes" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 0, borderTop: `1px solid ${C.border}` }}>
            {SERVICES.map((s: any, idx: number) => (
              <Reveal key={s.titre + idx} delay={Math.min(idx, 5) * 0.05}>
                <ColonneService s={s} idx={idx} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TARIFS — en bandes pleine largeur ─────────────────────────────── */}
      <section id="tarifs" className="i362-pad" style={{ background: C.bg, padding: "clamp(76px, 9vw, 124px) clamp(24px, 5vw, 64px)" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(26px, 3.4vw, 42px)", maxWidth: 640 }}>
              <Kicker>Tarifs</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(28px, 3.8vw, 48px)", lineHeight: 1.04, letterSpacing: "-0.035em", color: C.ink, margin: "18px 0 0", textTransform: "uppercase" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (
                  <>
                    Simples, <span style={{ fontFamily: BODY, fontStyle: "italic", fontWeight: 300, textTransform: "none", letterSpacing: "-0.02em", color: C.accentDark }}>tout compris.</span>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 15, lineHeight: 1.78, color: C.textMuted, margin: "16px 0 0" }}>
                Préparation, protection et deux couches comprises. Les remises en blanc locatives sont au forfait par pièce — le propriétaire sait d'avance.
              </p>
            </div>
          </Reveal>
          <div style={{ borderTop: `1px solid ${C.border}` }}>
            {TARIFS.map((t: any, idx: number) => (
              <BandeTarif key={t.a + idx} t={t} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENTS — le carnet, ouvert ───────────────────────────────── */}
      <section id="engagements" className="i362-pad" style={{ background: C.bgDark, color: "rgba(255,255,255,0.82)", padding: "clamp(76px, 9.5vw, 124px) clamp(24px, 5vw, 64px)" }}>
        <div className="i362-split" style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(32px, 5vw, 72px)", alignItems: "center" }}>
          <Reveal>
            <div>
              <Kicker tone="light">Nos engagements</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(28px, 3.8vw, 46px)", lineHeight: 1.04, letterSpacing: "-0.035em", color: C.white, margin: "18px 0 26px", textTransform: "uppercase" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (
                  <>
                    Le prix écrit,
                    <br />
                    <span style={{ fontFamily: BODY, fontStyle: "italic", fontWeight: 300, textTransform: "none", letterSpacing: "-0.02em", color: C.craie }}>le délai tenu.</span>
                  </>
                )}
              </h2>
              {ENGAGEMENT.map((e: string, idx: number) => (
                <div key={idx} style={{ display: "flex", gap: 13, padding: "13px 0", borderBottom: idx < ENGAGEMENT.length - 1 ? "1px solid rgba(255,255,255,0.10)" : "none" }}>
                  <CheckCircle size={16} color={C.craie} style={{ flexShrink: 0, marginTop: 3 }} aria-hidden />
                  <span style={{ fontFamily: BODY, fontWeight: 300, fontSize: 14.5, lineHeight: 1.72, color: "rgba(255,255,255,0.76)" }}>{e}</span>
                </div>
              ))}
              <motion.a
                href={telHref}
                className="i362-cta"
                style={{ display: "inline-flex", alignItems: "center", gap: 9, marginTop: 26, background: C.white, color: C.bgDark, padding: "15px 28px", fontFamily: BODY, fontSize: 14.5, fontWeight: 600, textDecoration: "none" }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                Nous appeler <ArrowRight size={16} className="i362-fleche" aria-hidden />
              </motion.a>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div style={{ position: "relative" }}>
              <div style={{ aspectRatio: "4/3", overflow: "hidden", background: `linear-gradient(150deg, ${C.bgDarkAlt} 0%, ${C.accentDark} 100%)`, position: "relative", display: "grid", placeItems: "center" }}>
                {equipePhoto ? (
                  <img src={equipePhoto} alt="Duo de peintres en chantier" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                  <>
                    <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(-45deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 22px)" }} />
                    <Users size={72} color={C.craie} strokeWidth={1} aria-hidden style={{ position: "relative", opacity: 0.85 }} />
                  </>
                )}
              </div>
              {/* Étiquette de carnet, posée en débord — le détail gratuit. */}
              <div
                style={{
                  position: "absolute",
                  right: -1,
                  bottom: -16,
                  background: C.craie,
                  color: C.bgDark,
                  padding: "10px 16px",
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  maxWidth: "calc(100% - 24px)",
                }}
              >
                Carnet de chantier · jour {String(new Date().getDate()).padStart(2, "0")}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── AVIS — bandes empilées, une par témoignage ────────────────────── */}
      <section className="i362-pad" style={{ background: C.bg, padding: "clamp(76px, 9vw, 122px) clamp(24px, 5vw, 64px)" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(28px, 3.6vw, 46px)" }}>
              <Kicker>Après le chantier</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(27px, 3.6vw, 46px)", lineHeight: 1.04, letterSpacing: "-0.035em", color: C.ink, margin: "18px 0 0", textTransform: "uppercase" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (
                  <>
                    Avant, après — <span style={{ fontFamily: BODY, fontStyle: "italic", fontWeight: 300, textTransform: "none", letterSpacing: "-0.02em", color: C.accentDark }}>ils ont vu les deux.</span>
                  </>
                )}
              </h2>
            </div>
          </Reveal>
          <div style={{ borderTop: `1px solid ${C.border}` }}>
            {AVIS.map((a: any, idx: number) => (
              <Reveal key={a.auteur + idx} delay={Math.min(idx, 4) * 0.07}>
                <div
                  className="i362-avis"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0,1fr) minmax(0,0.42fr)",
                    gap: "clamp(14px, 3vw, 44px)",
                    alignItems: "start",
                    padding: "clamp(26px, 3.4vw, 42px) 0",
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <div style={{ minWidth: 0, display: "flex", gap: 16 }}>
                    <Quote size={20} color={C.accentLight} style={{ flexShrink: 0, marginTop: 4 }} aria-hidden />
                    <p style={{ fontFamily: BODY, fontWeight: 300, fontStyle: "italic", fontSize: "clamp(16px, 1.9vw, 20px)", lineHeight: 1.66, color: C.ink, margin: 0 }}>
                      {a.texte}
                    </p>
                  </div>
                  <div style={{ minWidth: 0, paddingTop: 6 }}>
                    <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em", color: C.ink }}>{a.auteur}</div>
                    <div style={{ fontFamily: BODY, fontWeight: 300, fontSize: 12.5, color: C.textFaint, marginTop: 6 }}>{a.detail}</div>
                    <span aria-hidden style={{ display: "block", width: 34, height: 2, background: C.accent, marginTop: 12 }} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────────────────────── */}
      <section id="contact" className="i362-pad" style={{ background: C.bgAlt, padding: "clamp(76px, 9vw, 124px) clamp(24px, 5vw, 64px)" }}>
        <div className="i362-split" style={{ maxWidth: 1060, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,0.9fr)", gap: "clamp(30px, 5vw, 68px)", alignItems: "start" }}>
          <Reveal>
            <div>
              <Kicker>Devis sous 48 h</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(29px, 4.2vw, 52px)", lineHeight: 1.02, letterSpacing: "-0.035em", color: C.ink, margin: "20px 0 18px", textTransform: "uppercase" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (
                  <>
                    Montrez-nous l'avant,
                    <br />
                    <span style={{ fontFamily: BODY, fontStyle: "italic", fontWeight: 300, textTransform: "none", letterSpacing: "-0.02em", color: C.accentDark }}>on s'occupe de l'après.</span>
                  </>
                )}
              </h2>
              <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 16, lineHeight: 1.78, color: C.textMuted, maxWidth: 480, margin: "0 0 clamp(26px, 3.6vw, 38px)" }}>
                Visite gratuite à {ville} et 30 km. Envoyez des photos par mail pour un premier avis — on vous dit franchement si ça vaut un devis.
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <motion.a
                  href={telHref}
                  style={{ background: C.accentDark, color: C.white, padding: "17px 32px", fontFamily: BODY, fontSize: 15.5, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                >
                  <Phone size={17} aria-hidden /> {phone}
                </motion.a>
                <motion.a
                  href={`mailto:${mail}`}
                  style={{ background: "transparent", color: C.ink, border: `1.5px solid ${C.accentDark}`, padding: "16px 28px", fontFamily: BODY, fontSize: 15.5, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <Mail size={17} aria-hidden /> Nous écrire
                </motion.a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "clamp(22px, 3vw, 32px)" }}>
              {carnetPhoto && (
                <div style={{ aspectRatio: "16/9", overflow: "hidden", marginBottom: 20 }}>
                  <img src={carnetPhoto} alt="Chantier de rénovation terminé" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              )}
              <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em", color: C.ink, marginBottom: 18, textTransform: "uppercase" }}>
                L'atelier
              </div>
              {[
                { icon: <MapPin size={14} aria-hidden />, l: "Adresse", t: adresse },
                { icon: <Phone size={14} aria-hidden />, l: "Téléphone", t: phone },
                { icon: <Mail size={14} aria-hidden />, l: "E-mail", t: mail },
                { icon: <Clock size={14} aria-hidden />, l: "Horaires", t: "Lun–Ven 7h30–18h" },
                { icon: <Building size={14} aria-hidden />, l: "Interventions", t: `${ville} et 30 km` },
              ].map((r, idx) => (
                <div key={idx} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "11px 0", borderTop: idx === 0 ? "none" : `1px solid ${C.border}` }}>
                  <span style={{ color: C.accent, display: "inline-flex", marginTop: 2 }}>{r.icon}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: BODY, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textFaint, fontWeight: 600 }}>{r.l}</div>
                    <div style={{ fontFamily: BODY, fontWeight: 400, fontSize: 14, lineHeight: 1.6, color: C.ink, marginTop: 4, overflowWrap: "break-word" }}>{r.t}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="i362-pad" style={{ background: C.bgDarkAlt, padding: "clamp(46px, 6vw, 70px) clamp(24px, 5vw, 64px) 26px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 30, marginBottom: 32 }}>
            <div style={{ minWidth: 240 }}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em", color: C.craie, marginBottom: 10, textTransform: "uppercase" }}>{nom}</div>
              <p style={{ fontFamily: BODY, fontWeight: 300, color: "rgba(255,255,255,0.40)", fontSize: 13, lineHeight: 1.75, margin: 0 }}>
                Entreprise de peinture · {ville}
                <br />
                {clientName(sessionData) ? "Décennale — un carnet de chantier tenu" : "Décennale — deux compagnons, un carnet de chantier tenu"}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {[
                { icon: <MapPin size={13} aria-hidden />, t: adresse },
                { icon: <Phone size={13} aria-hidden />, t: phone },
                { icon: <Mail size={13} aria-hidden />, t: mail },
                { icon: <Clock size={13} aria-hidden />, t: "Lun–Ven 7h30–18h" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.44)", fontFamily: BODY, fontWeight: 300, fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.craie, display: "inline-flex" }}>{item.icon}</span>
                  {item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontFamily: BODY, fontWeight: 300, color: "rgba(255,255,255,0.26)", fontSize: 12 }}>
              © 2026 {nom} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
              {/* VILLE_PIED */}
              {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ fontFamily: BODY, fontWeight: 300, color: "rgba(255,255,255,0.26)", fontSize: 12 }}>
              Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/** Une colonne filetée de prestation — le dessin des « chantiers ». */
function ColonneService({ s, idx }: { s: any; idx: number }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        borderBottom: `1px solid ${C.border}`,
        borderRight: `1px solid ${C.border}`,
        padding: "clamp(24px, 3vw, 34px) clamp(18px, 2.4vw, 30px)",
        height: "100%",
        background: h ? C.bgCard : "transparent",
        transform: h ? "translateY(-4px)" : "translateY(0)",
        boxShadow: h ? "0 20px 44px rgba(19,26,32,0.10), 0 3px 10px rgba(19,26,32,0.06)" : "none",
        transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), background 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
        <span style={{ fontFamily: BODY, fontSize: 10, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: h ? C.accent : C.textFaint, transition: "color 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          {s.tag}
        </span>
        <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 13, color: C.textFaint, opacity: 0.5 }}>{String(idx + 1).padStart(2, "0")}</span>
      </div>
      <h3 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: "clamp(18px, 2vw, 22px)", lineHeight: 1.2, letterSpacing: "-0.025em", color: C.ink, margin: "0 0 12px" }}>{s.titre}</h3>
      <span aria-hidden style={{ display: "block", height: 2, width: h ? 52 : 20, background: C.accent, marginBottom: 14, transition: "width 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }} />
      <p style={{ fontFamily: BODY, fontWeight: 300, fontSize: 14.5, lineHeight: 1.78, color: C.textMuted, margin: 0 }}>{s.desc}</p>
    </div>
  );
}
