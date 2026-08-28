"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Clock, CloudRain, Home, Mail, MapPin, Phone, Shield } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, useSlides } from "@/lib/templates/hero-kit-2";
import { HardCutRebuild } from "@/lib/templates/hero-kit-3";
import { ActionMobile } from "@/lib/templates/ActionMobile";
import {
  clientHeroLine,
  clientTrade,
  clientCertifications,
  clientAddress,
  clientCity,
  clientCodePostalVille,
  clientEmail,
  clientName,
  clientPhone,
  clientPhotos,
  clientReviews,
  clientServices,
  clientStats,
  clientText,
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
   TOITS DE LOIRE — Couvreur-zingueur · Angers

   Archétype H3 « plein cadre, titre bas » : la photographie du chantier occupe
   tout l'écran, le titre se pose en bas de cadre — et quand le client n'a pas
   encore fourni de photo, le fond de repli `C.bgDark` porte une texture de
   rangs d'ardoise dessinée en CSS : la page tient debout sans image.

   Geste de signature UNIQUE : HardCutRebuild — la toiture déposée d'un coup
   (sortie brutale, 0,12 s), puis le titre remonté rang par rang, en décalé.
   C'est du montage, pas de la transition : la coupe franche du chantier.

   Un seul index (useSlides) pilote tout le héros : la photo, le sur-titre,
   le titre, le sous-titre et l'index de diapositive.
   ════════════════════════════════════════════════════════════════════════════ */

let C: Record<string, string> = {
  bg: "#12161a",
  bgAlt: "#171d23",
  bgDark: "#0b0e12",
  bgDarkAlt: "#07090c",
  bgCard: "#1a212a",
  accent: "var(--brand,#cc7722)",
  accentDark: "var(--brand-light,#e09a4e)",
  accentLight: "#251a0e",
  ink: "#f2f0ea",
  textMuted: "#a8adb5",
  textFaint: "#6d7480",
  border: "rgba(242,240,234,0.10)",
  white: "#ffffff",
  /* Clé métier : le gris bleuté du zinc, pour les filets et textures. */
  zinc: "#8d99a6",
};
/*
  La paire du plan (P9) : « Syne » porte la voix du thème,
  « Work Sans » porte la lecture. Le thème n'avait que
  system-ui pour tout — c'est ce qui le rendait interchangeable avec ses
  voisins. FONT reste le corps de texte, pour ne pas mettre une serif
  d'affiche dans les paragraphes ; FONT_TITRE ne va qu'aux titres.
*/
const FONTS_CSS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@300;400;500;600;700;800&family=Work+Sans:wght@300;400;500;600;700;800&display=swap');`;
const FONT_TITRE = "'Syne', system-ui, -apple-system, sans-serif";
const FONT = "'Work Sans', system-ui, -apple-system, sans-serif";
const FONT_BODY = FONT;

/* ── Easing unique du thème, répété littéralement en CSS ──────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

const NAV = [{"l": "Savoir-faire", "h": "#services"}, {"l": "Le chantier", "h": "#methode"}, {"l": "Tarifs", "h": "#tarifs"}, {"l": "Contact", "h": "#contact"}];
const HERO = [{"k": "Réfection complète", "line": "ON DÉPOSE. ON REMONTE.", "sub": "Couverture refaite rang par rang, isolation posée au passage — la maison au sec pour quarante ans."}, {"k": "Ardoise d'Anjou", "line": "L'ARDOISE, POSÉE AU CROCHET.", "sub": "Le matériau du pays, posé comme le veulent les Compagnons : au crochet inox, sur voliges saines."}, {"k": "Urgence tempête", "line": "BÂCHÉ CETTE NUIT.", "sub": "Après la tempête, on sécurise d'abord : bâchage sous 24 h, dossier photo pour votre assurance."}];

const SERVICES_SOURCE = [{"titre": "Réfection de couverture", "desc": "Dépose complète, contrôle de charpente, écran sous-toiture et remontage en ardoise, tuile ou zinc. Le chantier type qui engage quarante ans.", "tag": "Réfection"}, {"titre": "Zinguerie", "desc": "Gouttières, noues, abergements de cheminée, toitures zinc à joint debout : façonnés à l'atelier, soudés sur place.", "tag": "Zinc"}, {"titre": "Isolation de toiture", "desc": "Sarking ou combles perdus, éligible aux aides (MaPrimeRénov'). Le bon moment, c'est pendant la réfection — on chiffre les deux.", "tag": "Isolation"}, {"titre": "Réparations & entretien", "desc": "Ardoises glissées, tuiles gélives, mousse : forfait d'entretien annuel avec passage après l'hiver et rapport photo.", "tag": "Entretien"}, {"titre": "Fenêtres de toit", "desc": "Pose et remplacement de fenêtres de toit, raccords d'étanchéité garantis, volets solaires possibles.", "tag": "Lumière"}, {"titre": "Urgences & assurances", "desc": "Bâchage sous 24 h, chiffrage conforme aux attentes des experts, photos avant/après pour votre dossier.", "tag": "Urgence"}];
let SERVICES_DEMO = SERVICES_SOURCE;
const METHODE = [{"n": "01", "t": "Visite et diagnostic", "d": "Montée sur toit ou drone selon l'accès, photos commentées, diagnostic écrit de la charpente à la gouttière."}, {"n": "02", "t": "Devis détaillé", "d": "Matériaux nommés (ardoise, crochet, écran), quantités, délais. Les aides à la rénovation sont chiffrées avec."}, {"n": "03", "t": "Chantier protégé", "d": "Échafaudage aux normes, bâchage chaque soir, gravats évacués en benne — jamais dans votre jardin."}, {"n": "04", "t": "Réception en toiture", "d": "Réception avec photos de chaque zone, garanties remises, facture conforme pour l'assurance habitation."}];
const ENGAGEMENT_DEMO = ["Garantie décennale couverture-zinguerie — attestation remise avec chaque devis", "Qualibat 3212, équipes formées au travail en hauteur (habilitations à jour)", "Devis gratuit et détaillé matériau par matériau, jamais de forfait flou", "Après tempête : bâchage d'abord, devis ensuite — on ne profite pas de l'urgence"];
let ENGAGEMENT = ENGAGEMENT_DEMO;
const TARIFS_DEMO = [{"a": "Réfection ardoise naturelle", "p": "140–180 €/m²", "n": "Dépose, écran, ardoise d'Anjou au crochet inox, zinguerie comprise."}, {"a": "Réfection tuile terre cuite", "p": "95–130 €/m²", "n": "Tuiles de pays, faîtage scellé ou à sec selon DTU."}, {"a": "Gouttière zinc posée", "p": "dès 68 €/ml", "n": "Façonnée à l'atelier, naissances et descentes comprises."}, {"a": "Forfait entretien annuel", "p": "dès 290 €", "n": "Passage après l'hiver, ardoises remplacées, rapport photo envoyé."}];
let TARIFS = TARIFS_DEMO;
const AVIS_SOURCE = [{"texte": "Toiture ardoise de 1930 refaite à l'identique, isolation sarking au passage. Le chantier a duré trois semaines, bâché chaque soir, jardin impeccable au départ.", "auteur": "Famille Hervé", "detail": "Réfection complète + isolation"}, {"texte": "Tempête de novembre : bâchés le soir même à 22 h, dossier photo transmis à l'assurance, réparation programmée sans qu'on ait à se battre avec l'expert.", "auteur": "Monique C.", "detail": "Urgence tempête"}, {"texte": "Ils ont refusé de remplacer toute la toiture que deux autres artisans condamnaient : 40 ardoises reprises, gouttière refaite, 800 € au lieu de 30 000. On sait où on ira le jour venu.", "auteur": "Pierre L.", "detail": "Réparation honnête"}];
let AVIS_DEMO = AVIS_SOURCE;
const STATS_DEMO = [{"value": "10 ans", "label": "Garantie décennale"}, {"value": "Qualibat", "label": "3212 — couverture"}, {"value": "24 h", "label": "Bâchage d'urgence"}, {"value": "380+", "label": "Toitures refaites"}];
let STATS = STATS_DEMO;

/* La seule adresse d'image du thème, conservée telle quelle. */
const PHOTO_CHANTIER =
  "https://images.pexels.com/photos/31762405/pexels-photo-31762405.jpeg?auto=compress&cs=tinysrgb&w=1400";

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 26, style }: { children: React.ReactNode; delay?: number; y?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} style={style} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

/** Kicker : filet 40 × 1 px puis capitales à interlettrage large. */
function Kicker({
  children,
  color = C.accent,
  align = "left",
}: {
  children: React.ReactNode;
  color?: string;
  align?: "left" | "center";
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: align === "center" ? "center" : "flex-start" }}>
      <span style={{ width: 40, height: 1, background: color, opacity: 0.75, flexShrink: 0 }} />
      <span style={{ fontFamily: FONT, fontSize: 10.5, letterSpacing: "0.36em", textTransform: "uppercase", color, fontWeight: 600 }}>
        {children}
      </span>
      {align === "center" && (
        <span style={{ width: 40, height: 1, background: color, opacity: 0.75, flexShrink: 0 }} />
      )}
    </div>
  );
}

/** Chiffre fantôme posé en marge — texture sans image. */
function Ghost({
  children,
  right = false,
  size = "clamp(120px, 20vw, 300px)",
}: {
  children: React.ReactNode;
  right?: boolean;
  size?: string;
}) {
  return (
    <span
      aria-hidden
      style={{ position: "absolute", top: "-0.14em", [right ? "right" : "left"]: "-0.05em", fontFamily: FONT_TITRE, fontWeight: 800, fontSize: size, lineHeight: 0.8, color: C.zinc, opacity: 0.07, pointerEvents: "none", userSelect: "none" }}
    >
      {children}
    </span>
  );
}

/** Texture de rangs d'ardoise, sans image — pour les fonds de repli. */
function ardoise(opacity = 0.12) {
  return {
    backgroundImage: `repeating-linear-gradient(0deg, rgba(141,153,166,${opacity}) 0 1px, transparent 1px 34px), repeating-linear-gradient(90deg, rgba(141,153,166,${opacity * 0.55}) 0 1px, transparent 1px 58px)`,
  } as React.CSSProperties;
}

function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || fallback;
}

/** Lien de nav : soulignement dont la largeur pousse au survol. */
function NavLink({ label, href, onClick }: { label: string; href: string; onClick?: () => void }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ position: "relative", fontFamily: FONT, fontSize: 12.5, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, color: h ? C.ink : C.textMuted, textDecoration: "none", padding: "13px 2px", transition: `color .45s ${EASE_CSS}`, display: "inline-block", minHeight: 44 }}
    >
      {label}
      <span style={{ position: "absolute", left: 0, bottom: 8, height: 1, width: h ? "100%" : "0%", background: C.accent, transition: `width .5s ${EASE_CSS}` }} />
    </a>
  );
}

/** Bouton : élévation, deux ombres, flèche qui avance — 0,5 s. */
function CtaButton({
  children,
  href,
  filled = false,
}: {
  children: React.ReactNode;
  href: string;
  filled?: boolean;
}) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 28px", minHeight: 44, fontFamily: FONT, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, border: `1px solid ${filled ? "transparent" : C.border}`, background: filled ? C.accent : h ? "rgba(242,240,234,0.06)" : "transparent", color: filled ? "#101010" : C.ink, textDecoration: "none", transform: h ? "translateY(-2px)" : "none", boxShadow: h ? "0 20px 40px -22px rgba(204,119,34,0.5), 0 4px 12px -8px rgba(0,0,0,0.6)" : "0 0 0 rgba(0,0,0,0)", filter: filled && h ? "brightness(1.08)" : "none", transition: `all .5s ${EASE_CSS}` }}
    >
      {children}
      <ArrowRight size={14} style={{ transform: h ? "translateX(5px)" : "none", transition: `transform .5s ${EASE_CSS}` }} />
    </a>
  );
}

/** Carte de savoir-faire à coupe franche : l'angle tranché du chantier. */
function ServiceCard({ s, i }: { s: any; i: number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={Math.min(i, 4) * 0.055} style={{ height: "100%" }}>
      <article
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{ position: "relative", background: h ? C.bgCard : C.bgAlt, border: `1px solid ${h ? "rgba(204,119,34,0.4)" : C.border}`, clipPath: "polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 0 100%)", padding: "clamp(24px,2.8vw,34px) clamp(22px,2.6vw,30px)", height: "100%", boxSizing: "border-box", transform: h ? "translateY(-6px)" : "none", boxShadow: h ? "0 30px 60px -34px rgba(0,0,0,0.85), 0 6px 18px -12px rgba(204,119,34,0.35)" : "0 2px 14px -12px rgba(0,0,0,0.7)", transition: `all .5s ${EASE_CSS}`, cursor: "default" }}
      >
        {/* La coupe : un liseré accent sur l'angle tranché. */}
        <span aria-hidden style={{ position: "absolute", top: 0, right: 0, width: 37, height: 1.5, background: h ? C.accent : C.zinc, opacity: h ? 1 : 0.4, transform: "rotate(45deg) translate(6px, 12px)", transformOrigin: "100% 0", transition: `all .5s ${EASE_CSS}` }} />
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
          <span style={{ fontFamily: FONT, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, color: h ? C.accentDark : C.textFaint, transition: `color .5s ${EASE_CSS}` }}>{s.tag}</span>
          <span style={{ fontFamily: FONT_TITRE, fontWeight: 700, fontSize: 15, color: h ? C.accent : C.textFaint, transition: `color .5s ${EASE_CSS}` }}>{String(i + 1).padStart(2, "0")}</span>
        </div>
        <h3 style={{ fontFamily: FONT_TITRE, fontWeight: 700, fontSize: "clamp(18px,1.9vw,22px)", lineHeight: 1.16, color: C.ink, margin: "0 0 12px" }}>{s.titre}</h3>
        <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 14.5, color: C.textMuted, lineHeight: 1.72, margin: 0 }}>{s.desc}</p>
      </article>
    </Reveal>
  );
}

/** Bande de tarif : titre, note, prix à droite — table fine sombre. */
function TarifRow({ t, i }: { t: any; i: number }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={Math.min(i, 4) * 0.06}>
      <div
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        className="i351-tarif"
        style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: "clamp(14px,3vw,36px)", alignItems: "baseline", padding: "clamp(20px,2.4vw,28px) clamp(8px,1.4vw,18px)", borderTop: `1px solid ${C.border}`, background: h ? C.bgAlt : "transparent", transform: h ? "translateY(-2px)" : "none", boxShadow: h ? "0 26px 50px -38px rgba(0,0,0,0.9), 0 3px 10px -8px rgba(204,119,34,0.3)" : "0 0 0 rgba(0,0,0,0)", transition: `all .5s ${EASE_CSS}` }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: FONT_TITRE, fontWeight: 600, fontSize: "clamp(17px,1.8vw,21px)", color: C.ink, lineHeight: 1.24 }}>{t.a}</div>
          <div style={{ fontFamily: FONT, fontWeight: 300, fontSize: 13.5, color: C.textFaint, marginTop: 6, lineHeight: 1.65, maxWidth: 560 }}>{t.n}</div>
        </div>
        <div style={{ fontFamily: FONT_TITRE, fontWeight: 700, fontSize: "clamp(17px,2vw,22px)", color: h ? C.accentDark : C.accent, whiteSpace: "nowrap", transition: `color .5s ${EASE_CSS}` }}>{t.p}</div>
      </div>
    </Reveal>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE — une seule pièce : le patron de câblage lit tout dans le corps
   du rendu, après l'affectation des variables de module.
   ════════════════════════════════════════════════════════════════════════════ */
export default function ToitsDeLoirePage() {
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
  if (brand) {
    C = { ...C, accent: brand };
  }

  /*
    Les services venaient uniquement de `bp` (businessProfile), rempli par les
    seules niches pilotes. Pour tout le reste, `bp` est vide et la page servait
    les services de démonstration — un couvreur lyonnais lisait ceux d'un
    couvreur d'Angers. On lit donc aussi `c.services`, que la génération
    produit pour chaque client.
  */
  const CLIENT_SERVICES = clientServices(sessionData);
  const SERVICES = resolveList(
    CLIENT_SERVICES?.map((s: any, n: number) => ({
      titre: s.title ?? SERVICES_DEMO[n % SERVICES_DEMO.length].titre,
      desc: s.description ?? s.desc ?? SERVICES_DEMO[n % SERVICES_DEMO.length].desc,
      tag: SERVICES_DEMO[n % SERVICES_DEMO.length].tag,
    })),
    SERVICES_DEMO
  );
  const CLIENT_AVIS = clientReviews(sessionData);
  const AVIS = resolveList(
    CLIENT_AVIS?.map((r: any, n: number) => ({
      texte: r.text ?? AVIS_DEMO[n % AVIS_DEMO.length].texte,
      auteur: r.name ?? AVIS_DEMO[n % AVIS_DEMO.length].auteur,
      detail: r.location ?? r.role ?? AVIS_DEMO[n % AVIS_DEMO.length].detail,
    })),
    AVIS_DEMO
  );

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  /*
    Le hero affichait toujours les trois accroches de démonstration. La première
    diapositive porte désormais le titre généré pour le client ; les suivantes
    gardent celles du thème, qui montrent d'autres facettes du métier. Si la
    génération n'a rien produit, on retombe sur la démo — mais alors c'est un
    repli, pas le cas normal.
  */
  const HERO_SLIDES = (clientHeroLine(sessionData, 0, 1, 24) ?? c?.heroHeadline)
    ? [
        {
          k: (CLIENT_SERVICES?.[0]?.title as string) ?? HERO[0].k,
          line: (clientHeroLine(sessionData, 0, 1, 24)?.toUpperCase() ?? c?.heroHeadline) as string,
          sub: (c?.heroSubline as string) ?? HERO[0].sub,
        },
        // Les diapositives suivantes viennent des services du client, pas du
        // thème : garder « L'ARDOISE, POSÉE AU CROCHET » et « Ardoise d'Anjou »
        // sur le site d'un couvreur lyonnais, c'est laisser la démonstration
        // parler à sa place.
        // `k` sert de sur-titre au-dessus du `line` : y remettre le même mot
        // l'affichait deux fois. On y met la promesse du métier, pas le titre.
        ...(CLIENT_SERVICES ?? []).slice(1, 3).map((sv: any) => ({
          k: HERO[0].k,
          line: ((sv.title as string) ?? "").toUpperCase(),
          sub: (sv.description as string) ?? (sv.desc as string) ?? "",
        })),
      ]
    : HERO;
  /*
    La photo tourne avec la diapositive. On ne met une image que si le client en
    a fourni : afficher une photo de stock à la place de la sienne serait pire
    que de n'en afficher aucune — le fond de repli `C.bgDark`, texturé en CSS,
    tient le plein cadre à sa place.
  */
  const HERO_IMG: string | null = fd?.photoUrls?.length
    ? fd.photoUrls[0]
    : clientPhotos(sessionData)[0] || null;
  const { i, go } = useSlides(HERO_SLIDES.length, DWELL.normal);
  const S = HERO_SLIDES[i];


  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  /* Le contrat d'abord (fiche d'entreprise puis formulaire), la démo ensuite. */
  const phone = clientPhone(sessionData) ?? clientEmail(sessionData) ?? fd?.email ?? "02 41 00 00 00";
  const telHref = `tel:${clientPhone(sessionData) ?? clientEmail(sessionData) ?? fd?.email ?? "+33241000000"}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "devis@toits-de-loire.fr";

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: FONT_BODY, overflowX: "clip" }}>
      <style>{`${FONTS_CSS}

        @media (max-width: 900px) { #i351-nav { display: none !important; } .i351-burger { display: flex !important; } }
          .aevia-action-mobile { display: inline-flex !important; }

        /* Le geste : la photo coupe et se remonte avec l'index. */
        .i351-cut { position: absolute; inset: 0; }
        .i351-cut > div { height: 100%; }

        /*
          ── Héros « bandeau bas » ──────────────────────────────────────────
          Le texte tient le haut, le chantier court d'un bord à l'autre en
          pied d'écran. Le plein cadre était juste pour ce métier, mais
          impact-349 — deux crans plus loin — et impact-340 le portent déjà.
        */
        .i351-dire { flex: 0 0 auto; }
        .i351-bandeau { position: relative; z-index: 2; width: 100%; }
        .i351-bandeau-img {
          position: relative;
          width: 100%;
          /* Hauteur mesurée : au-delà de 22vh, le texte du haut plus le
             bandeau dépassent les 100dvh de la section et la bande tombe
             sous la ligne de flottaison — vérifié à l'écran en 1280×860. */
          height: clamp(130px, 21vh, 230px);
          overflow: hidden;
          border-top: 1px solid rgba(242,240,234,0.12);
        }
        .i351-bandeau-legende {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
          max-width: 1280px;
          margin: 0 auto;
          padding: clamp(14px, 2vw, 22px) clamp(34px, 7vw, 84px) clamp(20px, 3vh, 34px);
          box-sizing: border-box;
        }

        /* Grilles à deux colonnes : media queries locales du thème,
           on ne compte pas sur app/templates/layout.tsx. */
        @media (max-width: 900px) {
          .i351-split { grid-template-columns: minmax(0,1fr) !important; }
          .i351-contact { grid-template-columns: minmax(0,1fr) !important; }
          .i351-footgrid { grid-template-columns: minmax(0,1fr) !important; }
          .i351-step { grid-template-columns: minmax(0,1fr) !important; row-gap: 10px; }
          .i351-avisrow { grid-template-columns: minmax(0,1fr) !important; row-gap: 14px; }
        }
        @media (max-width: 860px) {
          .i351-stats { grid-template-columns: 1fr 1fr !important; row-gap: 8px; }
          .i351-stats .i351-statcell { border-right: none !important; }
          .i351-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i351-herobas { flex-direction: column; align-items: flex-start !important; gap: 18px !important; }
        }
        @media (max-width: 760px) {
          .i351-tarif { grid-template-columns: minmax(0,1fr) !important; row-gap: 8px; }
        }

        /* Le geste et les révélations honorent la préférence système. */
        @media (prefers-reduced-motion: reduce) {
          .i351-cut img { transform: none !important; }
        }

        #i351-nav a, .i351-burger { transition: all .5s ${EASE_CSS}; }
      `}</style>

      {/* ── NAV — collante à cinq propriétés ────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: scrolled ? "10px clamp(20px,5vw,56px)" : "20px clamp(20px,5vw,56px)", background: scrolled ? "rgba(18,22,26,0.92)" : "transparent", backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none", WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, boxShadow: scrolled ? "0 14px 38px -30px rgba(0,0,0,0.9)" : "none", transition: `all .55s ${EASE_CSS}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Home size={18} color={C.accent} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: FONT_TITRE, fontWeight: 700, fontSize: 18, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Toits de Loire"))}</span>
              <span className="i351-navtrade" style={{ fontSize: 9.5, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textFaint, marginLeft: 6, whiteSpace: "nowrap" }}>{clientTrade(sessionData) ?? "Couvreur-zingueur"}</span>
            </>
          )}
        </div>
        <div id="i351-nav" style={{ display: "flex", gap: "clamp(14px,2vw,26px)", alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <NavLink key={l} label={l} href={h} />
          ))}
          <CtaButton href={telHref} filled>
            Devis toiture
          </CtaButton>
        </div>
        {/* L'appel à l'action sous le pouce : la barre est fixe, mais son
            bouton vit dans le menu déroulant, en display:none sous le point
            de rupture. Celui-ci paraît exactement avec le bouton de menu. */}
        <ActionMobile href={telHref} fond={C.accent} encre={"#101010"}>
          Appeler
        </ActionMobile>
        <button className="i351-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 99, background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "18px 28px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map(({ l, h }) => (
            <NavLink key={l} label={l} href={h} onClick={() => setMobileOpen(false)} />
          ))}
          <a href={telHref} style={{ background: C.accent, color: "#101010", padding: "14px 22px", fontFamily: FONT, fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 10 }}>Devis toiture</a>
        </div>
      )}

      {/* ── HERO — bandeau bas ────────────────────────────────────────────
             Le texte tient le haut ; le chantier court en bandeau d'un bord à
             l'autre, en pied d'écran, et la coupe franche l'emporte à chaque
             diapositive. Le plein cadre était juste, mais impact-349 et
             impact-340 le portent déjà — et 349 n'est qu'à deux crans d'ici.
             La photographie du client reste au-dessus de la ligne de
             flottaison, ce qui était le point du plein cadre. */}
      <section className="i351-hero" style={{ position: "relative", minHeight: "100dvh", display: "flex", flexDirection: "column", justifyContent: "space-between", background: C.bgDark, overflow: "hidden" }}>
        {/* Le fond : rangs d'ardoise en CSS, jamais un trou noir. */}
        <div aria-hidden style={{ position: "absolute", inset: 0, background: C.bgDark, ...ardoise(0.16) }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, background: `radial-gradient(70% 60% at 74% 18%, rgba(204,119,34,0.14), transparent 65%), linear-gradient(196deg, rgba(141,153,166,0.10), transparent 46%)` }} />

        {/* Barre fixe : l'axe que la coupe ne déplace jamais. */}
        <span aria-hidden style={{ position: "absolute", left: "clamp(20px,5vw,56px)", top: "16%", bottom: "42%", width: 2, background: `linear-gradient(${C.accent}, transparent)`, opacity: 0.85 }} />

        <div className="i351-pad i351-dire" style={{ position: "relative", zIndex: 2, padding: "clamp(112px,13vh,150px) clamp(34px,7vw,84px) 0", maxWidth: 1280, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
          <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: "0.34em", textTransform: "uppercase", color: C.accentDark }}>
            {/* {clientCity(sessionData) ?? "Angers"} était écrit en dur : la ville du thème survivait à celle du client. */}
            {clientTrade(sessionData) ?? "Couvreur-zingueur"}{fd?.city ? ` · ${fd.city}` : " · " + (clientCity(sessionData) ?? "Angers")}
          </span>
          <HardCutRebuild index={i} stagger={0.09}>
            {[
              <div key="k" style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: C.accent, margin: "18px 0 12px" }}>{S.k}</div>,
              <h1 key="h" style={{ fontFamily: FONT_TITRE, fontSize: "clamp(2rem, 4.8vw, 4rem)", fontWeight: 800, color: C.white, lineHeight: 0.99, letterSpacing: "-0.015em", margin: "0 0 16px", maxWidth: "18ch", textShadow: "0 14px 54px rgba(0,0,0,0.65)" }}>{S.line}</h1>,
              <p key="d" style={{ fontFamily: FONT, fontWeight: 300, fontSize: "clamp(15px,1.5vw,17px)", color: "rgba(242,240,234,0.85)", lineHeight: 1.75, maxWidth: 520, margin: 0 }}>{S.sub}</p>,
            ]}
          </HardCutRebuild>
          <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: "clamp(14px,1.35vw,16px)", color: "rgba(242,240,234,0.62)", lineHeight: 1.75, maxWidth: 560, margin: "16px 0 28px" }}>
            {fd?.tagline ?? c?.heroSubline ?? "Ardoise d'Anjou, zinc à joint debout, tuiles de pays : trois équipes de couvreurs qui déposent, isolent et remontent dans les règles de l'art. Décennale, Qualibat, et un bâchage d'urgence qui répond la nuit."}
          </p>
          {/* Une seule action pleine ; les chantiers restent un lien. */}
          <div style={{ display: "flex", gap: "clamp(16px,2vw,26px)", flexWrap: "wrap", alignItems: "center" }}>
            <CtaButton href={telHref} filled>
              Demander un devis
            </CtaButton>
            <a href="#services" style={{ fontFamily: FONT, fontSize: 13, color: C.ink, textDecoration: "none", borderBottom: `1px solid ${C.accent}`, paddingBottom: 3 }}>
              Nos chantiers
            </a>
          </div>
        </div>

        {/* ── LE BANDEAU — le chantier, d'un bord à l'autre ──────────────── */}
        <div className="i351-bandeau">
          <div className="i351-bandeau-img">
            {HERO_IMG ? (
              <HardCutRebuild index={i} stagger={0} className="i351-cut">
                {[
                  <img
                    key="img"
                    src={HERO_IMG}
                    alt={`${fd?.businessName ?? "Chantier"} — ${S.k}`}
                    loading="eager"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />,
                ]}
              </HardCutRebuild>
            ) : (
              /*
                Sans photographie du client, le bandeau garde ses rangs
                d'ardoise, appuyés. Le thème refuse le stock dans le héros —
                une image de couverture qui n'est pas la sienne dit un
                chantier qu'il n'a pas fait — donc la bande se tient à la
                texture, mais assez marquée pour se lire comme une bande.
              */
              <div aria-hidden style={{ position: "absolute", inset: 0, backgroundColor: C.bgDarkAlt }}>
                {/*
                  Deux couches, pas une : `ardoise()` rend un backgroundImage,
                  et le poser après un raccourci `background` écrase le
                  dégradé sans prévenir — la bande redevenait un aplat noir.
                */}
                <span style={{ position: "absolute", inset: 0, background: `linear-gradient(100deg, rgba(141,153,166,0.16) 0%, rgba(141,153,166,0.05) 44%, rgba(204,119,34,0.26) 100%)` }} />
                <span style={{ position: "absolute", inset: 0, ...ardoise(0.34) }} />
              </div>
            )}
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(11,14,18,0.9) 0%, rgba(11,14,18,0.25) 46%, rgba(11,14,18,0.55) 100%)" }} />
          </div>

          {/*
            Le nom du chantier, et de quoi passer aux autres. La fraction
            « 01 / 03 » ne disait pas ce qu'on regardait.
          */}
          <div className="i351-bandeau-legende i351-pad">
            <span style={{ fontSize: 13, color: "rgba(242,240,234,0.72)", lineHeight: 1.6, minWidth: 0 }}>
              <strong style={{ color: C.white, fontWeight: 700 }}>{S.k}</strong> — {S.sub}
            </span>
            <div style={{ display: "flex", gap: 9, flexShrink: 0 }}>
              {HERO_SLIDES.map((h: any, n: number) => (
                <button
                  key={h.k ?? n}
                  type="button"
                  onClick={() => go(n)}
                  aria-label={h.k ?? `Chantier ${n + 1}`}
                  aria-current={n === i}
                  style={{ width: 38, height: 3, padding: 0, border: "none", cursor: "pointer", background: n === i ? C.accent : "rgba(242,240,234,0.28)", transition: "background .3s" }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RESPIRATION — une phrase, rien d'autre ──────────────────────── */}
      <section style={{ background: C.bg, padding: "clamp(76px,11vw,150px) clamp(24px,8vw,160px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: "auto -10% -50% -10%", height: "80%", background: "radial-gradient(55% 60% at 50% 60%, rgba(204,119,34,0.08), transparent 70%)", pointerEvents: "none" }} />
        <Reveal>
          <p style={{ fontFamily: FONT_TITRE, fontWeight: 500, fontStyle: "italic", fontSize: "clamp(21px,3vw,40px)", lineHeight: 1.34, letterSpacing: "-0.008em", color: C.ink, maxWidth: 880, margin: "0 auto", position: "relative" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.texte") ?? (
              <>Une toiture bien remontée, c'est <em style={{ color: C.accentDark }}>la maison au sec pour quarante ans.</em></>
            )}
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <div style={{ width: 1, height: 78, background: `linear-gradient(${C.accent}, transparent)`, margin: "clamp(32px,5vw,54px) auto 0" }} />
        </Reveal>
      </section>

      {/* ── SERVICES — cartes à coupe franche ───────────────────────────── */}
      <section id="services" className="i351-pad" style={{ position: "relative", padding: "clamp(76px,10vw,132px) clamp(24px,5vw,64px)", background: C.bgAlt, overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, ...ardoise(0.07), pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ position: "relative", marginBottom: "clamp(36px,5vw,58px)", maxWidth: 720 }}>
              <Ghost>Z</Ghost>
              <div style={{ position: "relative" }}>
                <Kicker>Savoir-faire</Kicker>
                <h2 style={{ fontFamily: FONT_TITRE, fontWeight: 700, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.ink, margin: "20px 0 0", lineHeight: 1.06, letterSpacing: "-0.014em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>
                  Du faîtage<br /><em style={{ color: C.accent }}>à la gouttière.</em>
                </>)}</h2>
              </div>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: "clamp(14px,1.8vw,20px)" }}>
            {SERVICES.map((s, idx) => (
              <ServiceCard key={`${s.titre}-${idx}`} s={s} i={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS — bande monumentale, filets dégradés ──────────────────── */}
      <section style={{ position: "relative", background: C.bgDarkAlt, overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, ...ardoise(0.1), pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", inset: "-40% 40% auto -10%", height: "120%", background: "radial-gradient(50% 60% at 40% 50%, rgba(204,119,34,0.1), transparent 70%)", pointerEvents: "none" }} />
        <div className="i351-stats i351-pad" style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1160, margin: "0 auto", padding: "0 32px" }}>
          {STATS.map((s, idx) => (
            <Reveal key={`${s.label}-${idx}`} delay={idx * 0.08}>
              <div className="i351-statcell" style={{ padding: "clamp(30px,4vw,48px) 12px", textAlign: "center", borderRight: idx < 3 ? "none" : "none", backgroundImage: idx > 0 ? "linear-gradient(180deg, rgba(141,153,166,0.02), rgba(141,153,166,0.3), rgba(141,153,166,0.02))" : "none", backgroundSize: "1px 100%", backgroundRepeat: "no-repeat", backgroundPosition: "left center" }}>
                <div style={{ fontFamily: FONT_TITRE, fontWeight: 800, fontSize: "clamp(26px,3.2vw,40px)", color: C.accentDark, lineHeight: 1, letterSpacing: "-0.01em" }}>{s.value}</div>
                <div style={{ fontFamily: FONT, fontWeight: 300, fontSize: 13, color: "rgba(242,240,234,0.5)", marginTop: 10, lineHeight: 1.5 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── MÉTHODE — le chantier, dans l'ordre ─────────────────────────── */}
      <section id="methode" className="i351-pad" style={{ position: "relative", padding: "clamp(76px,10vw,136px) clamp(24px,5vw,64px)", background: C.bg, overflow: "hidden" }}>
        <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ position: "relative", marginBottom: "clamp(34px,5vw,56px)", maxWidth: 720 }}>
              <Ghost right>04</Ghost>
              <div style={{ position: "relative" }}>
                <Kicker>Le chantier</Kicker>
                <h2 style={{ fontFamily: FONT_TITRE, fontWeight: 700, fontSize: "clamp(28px, 3.8vw, 46px)", color: C.ink, margin: "20px 0 0", lineHeight: 1.06, letterSpacing: "-0.014em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (<>
                  Une toiture se refait<br /><em style={{ color: C.accent }}>dans l'ordre, ou pas du tout.</em>
                </>)}</h2>
              </div>
            </div>
          </Reveal>
          <div>
            {METHODE.map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.08}>
                <div className="i351-step" style={{ display: "grid", gridTemplateColumns: "96px minmax(0,0.9fr) minmax(0,1.5fr)", gap: "clamp(16px,3vw,44px)", alignItems: "start", padding: "clamp(22px,2.8vw,34px) clamp(8px,1.4vw,20px)", borderTop: `1px solid ${C.border}` }}>
                  <div style={{ fontFamily: FONT_TITRE, fontWeight: 800, fontSize: "clamp(24px,2.8vw,36px)", lineHeight: 1, color: C.accent }}>{m.n}</div>
                  <h3 style={{ fontFamily: FONT_TITRE, fontWeight: 700, fontSize: "clamp(17px,1.9vw,22px)", lineHeight: 1.2, color: C.ink, margin: 0 }}>{m.t}</h3>
                  <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 14.5, color: C.textMuted, lineHeight: 1.75, margin: 0, maxWidth: 520 }}>{m.d}</p>
                </div>
              </Reveal>
            ))}
            <div style={{ borderTop: `1px solid ${C.border}` }} />
          </div>
        </div>
      </section>

      {/* ── TARIFS — bandes fines, repères honnêtes ─────────────────────── */}
      <section id="tarifs" className="i351-pad" style={{ position: "relative", padding: "clamp(76px,10vw,136px) clamp(24px,5vw,64px)", background: C.bgAlt, overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, ...ardoise(0.06), pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 980, margin: "0 auto" }}>
          <Reveal>
            <div style={{ position: "relative", marginBottom: "clamp(28px,4vw,46px)" }}>
              <Ghost right>€</Ghost>
              <div style={{ position: "relative" }}>
                <Kicker>Tarifs</Kicker>
                <h2 style={{ fontFamily: FONT_TITRE, fontWeight: 700, fontSize: "clamp(28px, 3.5vw, 44px)", color: C.ink, margin: "20px 0 14px", lineHeight: 1.06, letterSpacing: "-0.014em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Des repères <em style={{ color: C.accent }}>honnêtes.</em></>)}</h2>
                <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 15, color: C.textMuted, maxWidth: 540, margin: 0, lineHeight: 1.72 }}>
                  {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.intro") ?? (
                    <>Chaque toit est unique : ces fourchettes situent le budget, le devis après visite fait foi. Aides MaPrimeRénov' déduites quand l'isolation s'y prête.</>
                  )}
                </p>
              </div>
            </div>
          </Reveal>
          <div>
            {TARIFS.map((tt, idx) => (
              <TarifRow key={`${tt.a}-${idx}`} t={tt} i={idx} />
            ))}
            <div style={{ borderTop: `1px solid ${C.border}` }} />
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENTS — le chantier photographié, la liste filetée ────── */}
      <section id="engagements" className="i351-pad" style={{ padding: "clamp(76px,10vw,136px) clamp(24px,5vw,64px)", background: C.bg }}>
        <div className="i351-split" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(32px,5vw,64px)", alignItems: "center" }}>
          <Reveal>
            <div style={{ position: "relative", border: `1px solid ${C.border}`, background: C.bgDark, aspectRatio: "4/3", overflow: "hidden", ...ardoise(0.2) }}>
              {photo(1, PHOTO_CHANTIER) ? (
                <img src={photo(1, PHOTO_CHANTIER)} alt="Couvreurs sur une toiture" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              ) : (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, background: "linear-gradient(200deg, rgba(204,119,34,0.22), rgba(7,9,12,0.8))" }}>
                  <CloudRain size={46} color={C.accentDark} strokeWidth={1} />
                  <span style={{ fontFamily: FONT, fontSize: 10, letterSpacing: "0.34em", textTransform: "uppercase", color: "rgba(242,240,234,0.55)" }}>Chantier bâché chaque soir</span>
                </div>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <Kicker>Nos engagements</Kicker>
              <h2 style={{ fontFamily: FONT_TITRE, fontWeight: 700, fontSize: "clamp(26px, 3vw, 40px)", color: C.ink, margin: "20px 0 clamp(20px,3vw,30px)", lineHeight: 1.1, letterSpacing: "-0.012em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (<>
                Couvreurs,<br /><em style={{ color: C.accent }}>et assurés pour l'être.</em>
              </>)}</h2>
              <div>
                {ENGAGEMENT.map((e, idx) => (
                  <div key={idx} style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: 16, alignItems: "start", padding: "15px 0", borderTop: `1px solid ${C.border}` }}>
                    <span style={{ fontFamily: FONT, fontSize: 10.5, letterSpacing: "0.22em", color: C.accent, fontWeight: 700, paddingTop: 4 }}>{String(idx + 1).padStart(2, "0")}</span>
                    <span style={{ fontFamily: FONT, fontWeight: 300, fontSize: 15, color: C.textMuted, lineHeight: 1.68 }}>{e}</span>
                  </div>
                ))}
                <div style={{ borderTop: `1px solid ${C.border}`, marginBottom: 26 }} />
              </div>
              <CtaButton href={telHref} filled>
                Nous appeler
              </CtaButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── AVIS — bandes de toits qui tiennent ─────────────────────────── */}
      <section className="i351-pad" style={{ position: "relative", padding: "clamp(76px,10vw,140px) clamp(24px,5vw,64px)", background: C.bgDarkAlt, overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, ...ardoise(0.09), pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", inset: "-30% -10% auto 40%", height: "90%", background: "radial-gradient(50% 60% at 60% 40%, rgba(204,119,34,0.1), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 1080, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(34px,5vw,56px)" }}>
              <Kicker color={C.accentDark}>Ils nous ont ouvert leur toit</Kicker>
              <h2 style={{ fontFamily: FONT_TITRE, fontWeight: 700, fontSize: "clamp(26px, 3.4vw, 42px)", color: C.white, margin: "20px 0 0", lineHeight: 1.08, letterSpacing: "-0.012em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-7.titre") ?? (<>Des toits <em style={{ color: C.accentDark }}>qui tiennent</em>.</>)}</h2>
            </div>
          </Reveal>
          <div>
            {AVIS.map((a, idx) => (
              <Reveal key={`${a.auteur}-${idx}`} delay={idx * 0.09}>
                <figure className="i351-avisrow" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) minmax(0,0.7fr)", gap: "clamp(18px,3vw,48px)", alignItems: "end", margin: 0, padding: "clamp(24px,3vw,38px) 0", backgroundImage: "linear-gradient(90deg, rgba(141,153,166,0.28), rgba(141,153,166,0.02))", backgroundSize: "100% 1px", backgroundRepeat: "no-repeat", backgroundPosition: "top left" }}>
                  <blockquote style={{ fontFamily: FONT, fontWeight: 300, fontStyle: "italic", fontSize: "clamp(15.5px,1.8vw,19px)", color: "rgba(242,240,234,0.86)", lineHeight: 1.72, margin: 0, maxWidth: 640 }}>
                    « {a.texte} »
                  </blockquote>
                  <figcaption style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: FONT_TITRE, fontWeight: 700, fontSize: 15, color: C.white }}>{a.auteur}</div>
                    <div style={{ fontFamily: FONT, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accentDark, marginTop: 6 }}>{a.detail}</div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
            <div style={{ backgroundImage: "linear-gradient(90deg, rgba(141,153,166,0.28), rgba(141,153,166,0.02))", backgroundSize: "100% 1px", backgroundRepeat: "no-repeat", height: 1 }} />
          </div>
        </div>
      </section>

      {/* ── CONTACT — le devis d'abord, les coordonnées à côté ──────────── */}
      <section id="contact" className="i351-pad" style={{ position: "relative", padding: "clamp(76px,10vw,140px) clamp(24px,5vw,64px)", background: C.bg, overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: "auto -10% -40% -10%", height: "70%", background: "radial-gradient(50% 60% at 50% 60%, rgba(204,119,34,0.08), transparent 70%)", pointerEvents: "none" }} />
        <div className="i351-contact" style={{ position: "relative", maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,0.9fr)", gap: "clamp(32px,5vw,76px)", alignItems: "start" }}>
          <Reveal>
            <div>
              <Kicker>Devis gratuit</Kicker>
              <h2 style={{ fontFamily: FONT_TITRE, fontWeight: 700, fontSize: "clamp(28px, 4vw, 48px)", color: C.ink, margin: "20px 0 16px", lineHeight: 1.05, letterSpacing: "-0.016em" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
                Faites regarder votre toit<br /><em style={{ color: C.accent }}>avant qu'il ne se rappelle à vous.</em>
              </>)}</h2>
              <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 16, color: C.textMuted, maxWidth: 480, margin: "0 0 clamp(24px,3vw,34px)", lineHeight: 1.72 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ?? (
                  <>Visite et diagnostic gratuits dans tout le Maine-et-Loire. Urgence bâchage : on répond aussi la nuit.</>
                )}
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <CtaButton href={telHref} filled>
                  {phone}
                </CtaButton>
                <CtaButton href={`mailto:${mail}`}>Nous écrire</CtaButton>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "clamp(24px,3vw,36px)" }}>
              {[
                { icon: <Phone size={15} strokeWidth={1.5} />, l: "Téléphone", v: phone },
                { icon: <Mail size={15} strokeWidth={1.5} />, l: "Courriel", v: mail },
                { icon: <MapPin size={15} strokeWidth={1.5} />, l: "Atelier", v: clientAddress(sessionData) ?? clientCodePostalVille(sessionData, "49000", "Angers") + ", Maine-et-Loire" },
                { icon: <Clock size={15} strokeWidth={1.5} />, l: "Horaires", v: "Lun–Ven 7h30–18h · Urgence bâchage 7j/7" },
              ].map((row, n) => (
                <div key={row.l} style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: 14, alignItems: "start", padding: "15px 0", borderTop: n === 0 ? "none" : `1px solid ${C.border}` }}>
                  <span style={{ color: C.accent, paddingTop: 3 }}>{row.icon}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: FONT, fontSize: 9.5, letterSpacing: "0.3em", textTransform: "uppercase", color: C.textFaint, marginBottom: 6 }}>{row.l}</div>
                    <div style={{ fontFamily: FONT_TITRE, fontWeight: 600, fontSize: 16.5, color: C.ink, wordBreak: "break-word" }}>{row.v}</div>
                  </div>
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18, marginTop: 4, display: "flex", gap: 12, alignItems: "center" }}>
                <Shield size={16} color={C.accent} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                <span style={{ fontFamily: FONT, fontWeight: 300, fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>Décennale et Qualibat 3212 : les attestations partent avec chaque devis.</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="i351-pad" style={{ position: "relative", background: C.bgDarkAlt, padding: "clamp(44px,6vw,72px) clamp(24px,5vw,64px) 22px", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, ...ardoise(0.07), pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto" }}>
          <div className="i351-footgrid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)", gap: "clamp(24px,4vw,56px)", marginBottom: 30 }}>
            <div>
              <div style={{ fontFamily: FONT_TITRE, fontWeight: 700, fontSize: 20, color: C.accentDark, marginBottom: 10 }}>{fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Toits de Loire"))}</div>
              <p style={{ fontFamily: FONT, fontWeight: 300, color: "rgba(242,240,234,0.42)", fontSize: 13, lineHeight: 1.75, margin: 0, maxWidth: 360 }}>Couverture · Zinguerie · {clientCity(sessionData) ?? "Angers"} et Maine-et-Loire<br />Garantie décennale, Qualibat 3212</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {[{ icon: <MapPin size={13} />, t: (clientAddress(sessionData) ?? ((clientCity(sessionData) ?? "Angers") + ", Maine-et-Loire")) }, { icon: <Phone size={13} />, t: phone }, { icon: <Mail size={13} />, t: mail }, { icon: <Clock size={13} />, t: "Lun–Ven 7h30–18h · Urgence bâchage 7j/7" }].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: "rgba(242,240,234,0.46)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.accentDark, display: "flex" }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(242,240,234,0.09)", paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(242,240,234,0.28)", fontSize: 12 }}>
              © 2026 {fd?.businessName ?? (clientName(sessionData) ?? (clientName(sessionData) ?? "Toits de Loire"))} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />{/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ color: "rgba(242,240,234,0.28)", fontSize: 12 }}>Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
