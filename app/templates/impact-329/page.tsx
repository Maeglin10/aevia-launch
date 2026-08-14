"use client";
import { tr } from "@/lib/templates/uiStrings";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Star, CheckCircle, ArrowRight, Truck, Package, Shield } from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, useSlides, SlideIndex, HairlineArrows } from "@/lib/templates/hero-kit-2";
import { HardCutRebuild, FixedRail } from "@/lib/templates/hero-kit-3";
import {
  clientHeroLine,
  clientTrade,
  clientAccrocheRestante,
  clientAddress,
  clientCertifications,
  clientCity,
  clientCodePostalVille,
  clientEmail,
  clientEyebrow,
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
   CAP DÉMÉNAGEMENTS — déménageur · Nantes. Archétype H5 : rail latéral fixe
   + titre monumental. Paire P6 : Archivo (voix impact, capitales serrées)
   contre Inter (prose). Sombre #0b0d11, accent #f2760a.

   Signature : HardCutRebuild — coupe brutale (0,12 s) puis reconstruction
   pièce par pièce, c'est littéralement le métier : on démonte tout, on
   remonte tout. Le FixedRail à gauche est l'axe qui ne bouge jamais pendant
   que tout le reste coupe : sans lui la coupe se lirait comme un bug.

   Hero sans photographie (aucune image de camion vérifiée dans le repo) :
   typographie monumentale et pile de « cartons » CSS, précédent impact-213.

   Dessin des sections : stats monumentales (chiffres en Archivo 900 pleine
   bande), formules en bandes horizontales — pas en cartes.
   ════════════════════════════════════════════════════════════════════════════ */

let C: Record<string, string> = {
  bg: "#0b0d11",
  bgAlt: "#0e1117",
  bgDark: "#07090d",
  bgDarkAlt: "#050609",
  bgCard: "#12151b",
  accent: "var(--brand,#f2760a)",
  accentDark: "var(--brand-light,#c85e05)",
  accentLight: "#ffb37a",
  accentSoft: "rgba(242,118,10,0.12)",
  ink: "#f2f1ed",
  textMuted: "#9aa0ab",
  textFaint: "#5c6169",
  border: "rgba(255,255,255,0.09)",
  white: "#ffffff",
  kraft: "#c9a87c", // clé métier — le carton kraft
};

const DISPLAY = "'Archivo', 'Inter', -apple-system, sans-serif";
const TEXTE = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const NAV = [
  { l: "Formules", h: "#formules" },
  { l: "Services", h: "#services" },
  { l: "La méthode", h: "#methode" },
  { l: "Contact", h: "#contact" },
];

/* Les trois formules, coupées net et remontées pièce par pièce. */
const HERO_FORMULES_SOURCE = [
  {
    k: "Éco",
    big: "ON TRANSPORTE.",
    p: "dès 490 €",
    d: "Vous emballez, nous portons, roulons et livrons. Le prix le plus juste pour un studio ou un T2.",
  },
  {
    k: "Standard",
    big: "ON EMBALLE.",
    p: "dès 890 €",
    d: "Le fragile emballé par nos équipes, le mobilier démonté et remonté. La formule de la plupart des familles.",
  },
  {
    k: "Clé en main",
    big: "ON S'OCCUPE DE TOUT.",
    p: "dès 1 490 €",
    d: "Cartons faits et défaits, meubles remontés à l'identique, penderies re-rangées. Vous n'ouvrez pas un carton.",
  },
];

let HERO_FORMULES = HERO_FORMULES_SOURCE;

const SERVICES_SOURCE = [
  { titre: "Déménagement particuliers", desc: "Du studio à la maison familiale, dans toute la France. Camions capitonnés, sangles, couvertures et équipe formée au portage lourd.", tag: "Particuliers" },
  { titre: "Monte-meubles", desc: "Étages sans ascenseur, cages d'escalier étroites, pianos : monte-meubles jusqu'au 8e étage, opérateur certifié inclus.", tag: "Technique" },
  { titre: "Garde-meubles sécurisé", desc: "Box individuels de 3 à 30 m³, accès sur rendez-vous, site alarmé et assuré. Au mois, sans engagement de durée.", tag: "Stockage" },
  { titre: "Transfert d'entreprise", desc: "Bureaux, ateliers, archives. Intervention le week-end pour zéro jour d'activité perdu, référent unique côté client.", tag: "Pro" },
  { titre: "Emballage professionnel", desc: "Vaisselle, verrerie, œuvres et écrans emballés par nos équipes avec bulle, croisillons et caisses renforcées.", tag: "Fragile" },
  { titre: "Cartons & fournitures", desc: "Packs de cartons livrés à domicile avant le jour J, repris gratuitement après. Adhésif, housses matelas, penderies.", tag: "Fournitures" },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const METHODE = [
  { n: "01", t: "Visite & devis en 45 min", d: "À domicile ou en visio. Volume calculé pièce par pièce, devis ferme remis sous 24 h — c'est lui qui fait foi." },
  { n: "02", t: "Cartons livrés avant le jour J", d: "Fournitures déposées chez vous une semaine avant. En formule Standard et Clé en main, on emballe le fragile la veille." },
  { n: "03", t: "Jour J : démonté, roulé, remonté", d: "Mobilier démonté, protégé, remonté à l'identique dans le nouveau logement. Lettre de voiture signée au départ et à l'arrivée." },
  { n: "04", t: "Tour du logement ensemble", d: "Rien ne part avant un dernier tour des pièces avec vous, rien n'est terminé avant votre signature à l'arrivée." },
];

const ENGAGEMENT_DEMO = [
  "Inscrits au registre des transporteurs — DREAL Pays de la Loire",
  "Assurance ad valorem incluse jusqu'à 50 000 € de mobilier déclaré",
  "Devis ferme après visite : le prix signé est le prix facturé",
  "Lettre de voiture réglementaire remise au départ et à l'arrivée",
];
let ENGAGEMENT = ENGAGEMENT_DEMO;

const STATS_DEMO = [
  { value: "1 800+", label: "Déménagements réalisés" },
  { value: "98,4%", label: "Sans aucune casse déclarée" },
  { value: "45 min", label: "Pour un devis ferme" },
  { value: "50 000 €", label: "D'assurance incluse" },
];
let STATS = STATS_DEMO;

function AVIS_SOURCE_LIVE() {
  return [
    { texte: "Formule clé en main pour un T4 avec piano. Le monte-meubles était en place à 8h, le piano remonté au salon à 14h, et pas une rayure sur les murs — ni les leurs, ni les nôtres.", auteur: "Sophie & Marc D.", detail: (clientCity(sessionData) ?? "Nantes") + " → Rennes, clé en main" },
    { texte: "Le devis n'a pas bougé d'un euro alors qu'on avait sous-estimé la cave. L'équipe a absorbé la différence sans commentaire. C'est rare et ça mérite d'être écrit.", auteur: "Antoine G.", detail: "T2, formule éco" },
    { texte: "Transfert de nos bureaux un samedi : le lundi matin, chaque poste était remonté, branché, étiqueté. Aucune heure d'activité perdue.", auteur: "Cabinet Ligeria", detail: "Transfert d'entreprise" },
  ];
}
let AVIS_SOURCE = AVIS_SOURCE_LIVE();
let AVIS_DEMO = AVIS_SOURCE;

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 28 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

/** Kicker filé : 40×1 px dégradé, capitales très espacées. */
function Kicker({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: center ? "center" : "flex-start" }}>
      <span aria-hidden style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${C.accent}, transparent)`, flexShrink: 0 }} />
      <span style={{ fontFamily: DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: "0.36em", textTransform: "uppercase", color: C.accent }}>{children}</span>
      {center ? <span aria-hidden style={{ width: 40, height: 1, background: `linear-gradient(270deg, ${C.accent}, transparent)`, flexShrink: 0 }} /> : null}
    </div>
  );
}

/** Lien de nav : soulignement qui pousse en largeur. */
function NavLink({ l, h }: { l: string; h: string }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={h}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ position: "relative", color: hov ? C.ink : C.textMuted, fontSize: 14, fontWeight: 500, textDecoration: "none", padding: "12px 4px", transition: "color 0.45s cubic-bezier(.16,1,.3,1)" }}
    >
      {l}
      <span aria-hidden style={{ position: "absolute", left: 4, bottom: 8, height: 1, width: hov ? "calc(100% - 8px)" : "0%", background: C.accent, transition: "width 0.45s cubic-bezier(.16,1,.3,1)" }} />
    </a>
  );
}

/** Bouton plein : élévation + double ombre + flèche qui avance. */
function CtaBtn({ href, children, big = false }: { href: string; children: React.ReactNode; big?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.accentLight : C.accent,
        color: "#101010",
        borderRadius: 8,
        padding: big ? "clamp(14px, 1.6vw, 17px) clamp(28px, 3vw, 38px)" : "14px 28px",
        fontFamily: DISPLAY,
        fontWeight: 800,
        fontSize: big ? "clamp(14px, 1.3vw, 16px)" : 15,
        letterSpacing: "0.02em",
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov
          ? "0 18px 40px -14px rgba(242,118,10,0.55), 0 4px 12px -4px rgba(0,0,0,0.6)"
          : "0 8px 24px -14px rgba(242,118,10,0.35), 0 2px 6px -2px rgba(0,0,0,0.4)",
        transition: "all 0.5s cubic-bezier(.16,1,.3,1)",
      }}
    >
      {children}
      <ArrowRight size={16} style={{ transform: hov ? "translateX(5px)" : "none", transition: "transform 0.5s cubic-bezier(.16,1,.3,1)" }} />
    </a>
  );
}

/** Formule en bande horizontale : le dessin signature de ce thème. */
function FormuleBande({ fo, idx, telHref }: { fo: any; idx: number; telHref: string }) {
  const [hov, setHov] = useState(false);
  const star = idx === 1;
  return (
    <Reveal delay={idx * 0.08}>
      <div
        className="i329-bande"
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.4fr) minmax(0, 0.7fr)",
          gap: "clamp(16px, 2.6vw, 40px)",
          alignItems: "center",
          background: star ? C.accentSoft : hov ? C.bgAlt : C.bgCard,
          border: `1px solid ${star || hov ? C.accent : C.border}`,
          borderLeft: `${hov ? 5 : 3}px solid ${star || hov ? C.accent : "rgba(242,118,10,0.35)"}`,
          borderRadius: 10,
          padding: "clamp(22px, 3vw, 36px) clamp(20px, 3vw, 40px)",
          marginBottom: 14,
          transform: hov ? "translateY(-4px)" : "none",
          boxShadow: hov
            ? "0 24px 56px -24px rgba(242,118,10,0.35), 0 8px 20px -12px rgba(0,0,0,0.6)"
            : "0 2px 10px -6px rgba(0,0,0,0.4)",
          transition: "all 0.5s cubic-bezier(.16,1,.3,1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Chiffre fantôme de la bande */}
        <span aria-hidden style={{ position: "absolute", right: "clamp(90px, 14vw, 190px)", top: "50%", transform: "translateY(-50%)", fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(70px, 9vw, 130px)", color: C.ink, opacity: 0.045, pointerEvents: "none", userSelect: "none", lineHeight: 1 }}>
          {String(idx + 1).padStart(2, "0")}
        </span>
        <div style={{ position: "relative" }}>
          {star && (
            <span style={{ display: "inline-block", background: C.accent, color: "#101010", borderRadius: 999, padding: "4px 12px", fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12, fontFamily: DISPLAY }}>
              La plus choisie
            </span>
          )}
          <div style={{ fontFamily: DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: C.accent, marginBottom: 8 }}>{fo.k}</div>
          <div style={{ fontFamily: DISPLAY, fontSize: "clamp(19px, 2.1vw, 26px)", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1.02, color: C.ink }}>{fo.big}</div>
        </div>
        <p style={{ fontSize: "clamp(13.5px, 1.15vw, 15px)", color: C.textMuted, lineHeight: 1.7, margin: 0, position: "relative" }}>{fo.d}</p>
        <div style={{ textAlign: "right", position: "relative" }}>
          <div style={{ fontFamily: DISPLAY, fontSize: "clamp(24px, 2.6vw, 34px)", fontWeight: 900, letterSpacing: "-0.02em", color: C.accent, whiteSpace: "nowrap" }}>{fo.p}</div>
          <a href={telHref} style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 10, color: hov ? C.accentLight : C.textMuted, fontSize: 13.5, fontWeight: 700, textDecoration: "none", transition: "color 0.45s cubic-bezier(.16,1,.3,1)", whiteSpace: "nowrap" }}>
            Chiffrer cette formule
            <ArrowRight size={14} style={{ transform: hov ? "translateX(4px)" : "none", transition: "transform 0.45s cubic-bezier(.16,1,.3,1)" }} />
          </a>
        </div>
      </div>
    </Reveal>
  );
}

/** Carte service : filet haut, tag, survol 3+ propriétés. */
function ServiceCard({ s, idx }: { s: any; idx: number }) {
  const [hov, setHov] = useState(false);
  return (
    <Reveal delay={idx * 0.06}>
      <article
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: hov ? C.bgAlt : C.bg,
          borderRadius: 10,
          padding: "clamp(24px, 2.4vw, 32px) clamp(20px, 2.2vw, 28px)",
          border: `1px solid ${hov ? "rgba(242,118,10,0.5)" : C.border}`,
          borderTop: `2px solid ${hov ? C.accent : "rgba(242,118,10,0.28)"}`,
          height: "100%",
          transform: hov ? "translateY(-6px)" : "none",
          boxShadow: hov
            ? "0 26px 54px -26px rgba(0,0,0,0.75), 0 10px 24px -18px rgba(242,118,10,0.4)"
            : "0 2px 8px -6px rgba(0,0,0,0.5)",
          transition: "all 0.5s cubic-bezier(.16,1,.3,1)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span aria-hidden style={{ position: "absolute", top: -8, right: 6, fontFamily: DISPLAY, fontWeight: 900, fontSize: 78, lineHeight: 1, color: C.ink, opacity: hov ? 0.09 : 0.05, pointerEvents: "none", userSelect: "none", transition: "opacity 0.5s cubic-bezier(.16,1,.3,1)" }}>
          {String(idx + 1).padStart(2, "0")}
        </span>
        <span style={{ alignSelf: "flex-start", background: C.accentSoft, color: C.accent, borderRadius: 999, padding: "4px 12px", fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: DISPLAY }}>{s.tag}</span>
        <h3 style={{ fontFamily: DISPLAY, fontSize: "clamp(16.5px, 1.4vw, 18.5px)", fontWeight: 800, letterSpacing: "-0.01em", margin: "16px 0 10px", color: C.ink }}>{s.titre}</h3>
        <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.72, margin: 0 }}>{s.desc}</p>
      </article>
    </Reveal>
  );
}

/** Carte avis : guillemet fantôme + survol. */
function AvisCard({ a, idx }: { a: any; idx: number }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.bgAlt : C.bg,
        border: `1px solid ${hov ? "rgba(242,118,10,0.45)" : C.border}`,
        borderRadius: 10,
        padding: "clamp(24px, 2.6vw, 32px) clamp(20px, 2.2vw, 28px)",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        transform: hov ? "translateY(-5px)" : "none",
        boxShadow: hov
          ? "0 24px 52px -26px rgba(0,0,0,0.7), 0 8px 22px -16px rgba(242,118,10,0.35)"
          : "0 2px 8px -6px rgba(0,0,0,0.45)",
        transition: "all 0.5s cubic-bezier(.16,1,.3,1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <span aria-hidden style={{ position: "absolute", top: -26, left: 10, fontFamily: DISPLAY, fontWeight: 900, fontSize: 120, lineHeight: 1, color: C.accent, opacity: 0.07, pointerEvents: "none", userSelect: "none" }}>&ldquo;</span>
      <div style={{ display: "flex", gap: 3, marginBottom: 14, position: "relative" }}>
        {[...Array(5)].map((_, j) => <Star key={j} size={13} fill={C.accent} color={C.accent} />)}
      </div>
      <p style={{ fontSize: 14.5, color: "rgba(242,241,237,0.85)", lineHeight: 1.72, marginBottom: 18, flexGrow: 1, position: "relative" }}>&ldquo;{a.texte}&rdquo;</p>
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, color: C.ink }}>{a.auteur}</div>
        <div style={{ color: C.accent, fontSize: 12, marginTop: 4, letterSpacing: "0.04em" }}>{a.detail}</div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════════════════ */

export default function CapDemenagementsPage() {
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
  bp = session?.businessProfile;
  c = session?.generatedContent;
  sessionData = session;
  AVIS_SOURCE = AVIS_SOURCE_LIVE();

  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({ ...SERVICES_SOURCE[i % SERVICES_SOURCE.length], titre: s.title })),
    SERVICES_SOURCE,
  );
  AVIS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({ ...AVIS_SOURCE[i % AVIS_SOURCE.length], auteur: r.author, texte: r.text })),
    AVIS_SOURCE,
  );
  /*
    Les formules portent un prix : c'est celui du client dès qu'il l'a saisi.
    Le libellé et la phrase de la démonstration restent quand il n'a rempli
    que le nom — une bande sans texte vaut moins que la bande d'origine.
  */
  HERO_FORMULES = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...HERO_FORMULES_SOURCE[i % HERO_FORMULES_SOURCE.length],
      k: s.title,
      big: String(s.title || "").toUpperCase(),
      ...(s.price ? { p: s.price } : {}),
      ...(s.desc ? { d: s.desc } : {}),
    })),
    HERO_FORMULES_SOURCE,
  );
  STATS = resolveList(clientStats(sessionData), STATS_DEMO);
  ENGAGEMENT = resolveList(clientCertifications(sessionData), ENGAGEMENT_DEMO);
  brand = fd?.brandColor ?? null;
  if (brand) {
    C = { ...C, accent: brand };
  }

  const SERVICES = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      titre: s.title ?? SERVICES_DEMO[i % SERVICES_DEMO.length].titre,
      desc: s.description ?? SERVICES_DEMO[i % SERVICES_DEMO.length].desc,
      tag: SERVICES_DEMO[i % SERVICES_DEMO.length].tag,
    })),
    SERVICES_DEMO
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
  const { i, next, prev } = useSlides(HERO_FORMULES.length, DWELL.normal);
  const f = HERO_FORMULES[i];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = clientPhone(sessionData) ?? fd?.phone ?? "02 40 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? fd?.phone ?? "+33240000000").replace(/[\s.]/g, "")}`;
  const mail = clientEmail(sessionData) ?? fd?.email ?? "devis@cap-demenagements.fr";

  /* Photo optionnelle du client dans le panneau engagements : jamais de stock
     à la place — sans photo, l'aplat kraft + chiffre fantôme tient seul. */
  const photoEngagement = fd?.photoUrls?.[0] || clientPhotos(sessionData)[0] || "";

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: TEXTE, overflowX: "clip" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,500;0,600;0,700;0,800;0,900;1,500;1,600&family=Inter:wght@300;400;500;600;700&display=swap');
        html { scroll-behavior: smooth; }
        @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }

        @media (max-width: 900px) {
          #i329-nav { display: none !important; }
          .i329-burger { display: flex !important; }
          .i329-stack { display: none !important; }
          .i329-rail { display: none !important; }
          .i329-herotext { padding-left: clamp(24px, 5vw, 48px) !important; }
        }
        @media (max-width: 860px) {
          .i329-split { grid-template-columns: 1fr !important; }
          .i329-split > * { order: initial !important; }
          .i329-stats { grid-template-columns: 1fr 1fr !important; row-gap: 8px; }
          .i329-stats .i329-statcell { border-right: none !important; }
          .i329-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i329-hero { padding: 128px 24px 54px !important; }
          .i329-bande { grid-template-columns: 1fr !important; }
          .i329-bande > div:last-child { text-align: left !important; }
          .i329-methsticky { position: static !important; }
          .i329-avis-off { margin-top: 0 !important; }
        }
      `}</style>

      {/* ── NAV — collante, 4 propriétés animées ─────────────────────────── */}
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
          padding: scrolled ? "0 clamp(20px, 4vw, 48px)" : "0 clamp(24px, 4.5vw, 56px)",
          height: scrolled ? 64 : 76,
          background: scrolled ? "rgba(11,13,17,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          transition: "height 0.55s cubic-bezier(.16,1,.3,1), padding 0.55s cubic-bezier(.16,1,.3,1), background 0.55s cubic-bezier(.16,1,.3,1), border-color 0.55s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Truck size={19} color={C.accent} />
              <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fd?.businessName ?? (clientName(sessionData) ?? "Cap Déménagements")}</span>
            </>
          )}
        </div>
        <div id="i329-nav" style={{ display: "flex", gap: 22, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <NavLink key={l} l={l} h={h} />
          ))}
          <CtaBtn href={telHref}>Devis gratuit</CtaBtn>
        </div>
        <button className="i329-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
          <span style={{ display: "block", width: 24, height: 1.5, background: "#fff", transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "#fff", transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: "#fff", transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 99, background: "rgba(11,13,17,0.98)", borderBottom: `1px solid ${C.border}`, padding: "20px 28px", display: "flex", flexDirection: "column", gap: 4, backdropFilter: "blur(12px)" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ color: C.ink, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "12px 0" }}>{l}</a>
          ))}
          <a href={telHref} style={{ background: C.accent, color: "#101010", borderRadius: 8, padding: "13px 24px", fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 8, fontFamily: DISPLAY }}>Devis gratuit</a>
        </div>
      )}

      {/* ── HERO — H5 : FixedRail + titre monumental + HardCutRebuild ────── */}
      <section style={{ position: "relative", minHeight: "100dvh", display: "flex", alignItems: "stretch", background: C.bg, overflow: "hidden" }}>
        {/* L'axe qui ne bouge jamais pendant que tout le reste coupe. */}
        <FixedRail color={C.accent} side="left" className="i329-rail">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <span aria-hidden style={{ writingMode: "vertical-rl", fontFamily: DISPLAY, fontSize: 10, fontWeight: 800, letterSpacing: "0.42em", textTransform: "uppercase", color: "#101010" }}>
              Démonté · Roulé · Remonté
            </span>
            <div style={{ fontFamily: DISPLAY, fontSize: 12, fontWeight: 800, color: "#101010" }}>
              <SlideIndex i={i} total={HERO_FORMULES.length} variant="flat" color="#101010" className="" />
            </div>
          </div>
        </FixedRail>

        {/* Filet vertical 1px dégradé, entre le rail et le texte */}
        <span aria-hidden style={{ position: "absolute", left: "clamp(46px, 4.4vw, 74px)", top: "12%", bottom: "12%", width: 1, background: `linear-gradient(180deg, transparent, ${C.border} 30%, ${C.border} 70%, transparent)`, pointerEvents: "none" }} />

        {/* Chiffre fantôme du volume : le m³, l'unité du métier. */}
        <span aria-hidden style={{ position: "absolute", right: "-1%", bottom: "-4%", fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(160px, 24vw, 340px)", lineHeight: 1, color: C.ink, opacity: 0.04, pointerEvents: "none", userSelect: "none", letterSpacing: "-0.04em" }}>
          m³
        </span>

        {/* Pile de « cartons » : rythme de blocs kraft, aucun asset externe. */}
        <div aria-hidden className="i329-stack" style={{ position: "absolute", right: "clamp(24px, 4vw, 56px)", top: "20%", bottom: "18%", width: "min(28vw, 300px)", opacity: 0.55, display: "grid", gridTemplateRows: "repeat(5, 1fr)", gap: 10, pointerEvents: "none" }}>
          {[0.5, 0.8, 0.65, 0.9, 0.55].map((w, n) => (
            <motion.div
              key={n}
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 + n * 0.12, duration: 0.7, ease: EASE }}
              style={{
                width: `${w * 100}%`,
                justifySelf: "end",
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                background: n % 2 ? `linear-gradient(135deg, ${C.bgCard} 0%, rgba(201,168,124,0.06) 100%)` : "transparent",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* le ruban adhésif du carton : un filet kraft au centre */}
              <span style={{ position: "absolute", left: "44%", top: 0, bottom: 0, width: "12%", background: "rgba(201,168,124,0.10)" }} />
            </motion.div>
          ))}
        </div>

        <div className="i329-hero i329-herotext" style={{ position: "relative", zIndex: 6, display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(120px, 15vh, 160px) clamp(32px, 6vw, 96px) clamp(48px, 7vh, 80px)", paddingLeft: "clamp(70px, 7.5vw, 128px)", maxWidth: 1240, width: "100%" }}>
          <div style={{ maxWidth: 780 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} style={{ display: "inline-flex", alignItems: "center", gap: 8, border: `1px solid ${C.border}`, borderRadius: 999, padding: "7px 16px", fontSize: 12.5, color: C.textMuted, marginBottom: "clamp(20px, 3vh, 30px)" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent }} />
              {clientEyebrow(sessionData) ?? ((clientTrade(sessionData) ?? "Déménageur") + " professionnel · " + (clientCity(sessionData) ?? "Nantes") + " & toute la France")}
            </motion.div>

            {/* La coupe franche puis la reconstruction, élément par élément :
                exactement ce qu'on vend. */}
            <HardCutRebuild index={i} stagger={0.09}>
              {[
                <div key="k" style={{ fontFamily: DISPLAY, fontSize: 13, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", color: C.accent, marginBottom: 14 }}>
                  Formule {f.k}
                </div>,
                <h1 key="big" style={{ fontFamily: DISPLAY, fontSize: "clamp(42px, 7.4vw, 104px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 0.96, margin: "0 0 20px", color: C.ink, textTransform: "uppercase" }}>
                  {clientHeroLine(sessionData, 0, 1, 16) ?? c?.heroHeadline ?? f.big}
                </h1>,
                /*
                  Le hero de ce thème est un carrousel de formules : son titre et
                  son paragraphe décrivent la formule affichée, pas l'entreprise.
                  La phrase du client n'avait donc aucune place — et ne se lisait
                  nulle part. Cette ligne n'apparaît que s'il en a écrit une.
                */
                clientAccrocheRestante(sessionData) ? (
                  <p key="accroche" style={{ fontSize: "clamp(15px, 1.4vw, 17px)", color: C.ink, opacity: 0.82, lineHeight: 1.65, maxWidth: 520, margin: "0 0 14px" }}>
                    {clientAccrocheRestante(sessionData)}
                  </p>
                ) : null,
                <div key="p" style={{ fontFamily: DISPLAY, fontSize: "clamp(19px, 1.9vw, 24px)", fontWeight: 800, color: C.accent, marginBottom: 14, letterSpacing: "-0.01em" }}>{f.p}</div>,
                <p key="d" style={{ fontSize: "clamp(15px, 1.35vw, 16.5px)", color: C.textMuted, lineHeight: 1.78, maxWidth: 500, margin: 0 }}>
                  {c?.heroSubline ?? f.d}
                </p>,
              ]}
            </HardCutRebuild>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", marginTop: "clamp(26px, 4vh, 38px)" }}>
              <CtaBtn href={telHref} big>Obtenir mon devis ferme</CtaBtn>
              <motion.a href="#formules" style={{ background: "rgba(255,255,255,0.05)", color: C.ink, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 26px", fontWeight: 600, fontSize: 15, textDecoration: "none" }} whileHover={{ background: "rgba(255,255,255,0.09)" }}>
                Comparer les formules
              </motion.a>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: "clamp(32px, 5vh, 48px)" }}>
              <SlideIndex i={i} total={HERO_FORMULES.length} variant="fraction" color={C.textMuted} className="" />
              <span aria-hidden style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${C.border}, transparent)` }} />
              <HairlineArrows onPrev={prev} onNext={next} color={C.ink} className="" />
            </div>
          </div>
        </div>
      </section>

      {/* ── RESPIRATION — une phrase, rien d'autre ───────────────────────── */}
      <section className="i329-pad" style={{ padding: "clamp(64px, 9vw, 120px) clamp(32px, 6vw, 96px)", background: C.bgAlt, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <span aria-hidden style={{ position: "absolute", left: "50%", top: "-40%", transform: "translateX(-50%)", width: "60%", height: "120%", background: "radial-gradient(ellipse, rgba(242,118,10,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <Reveal>
          <p style={{ fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 500, fontSize: "clamp(20px, 2.8vw, 34px)", lineHeight: 1.4, letterSpacing: "-0.01em", color: C.ink, maxWidth: 820, margin: "0 auto", position: "relative" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.texte") ?? (<>
              Un déménagement réussi, c&apos;est celui dont il ne reste{" "}
              <em style={{ color: C.accent, fontStyle: "italic" }}>aucune histoire</em> à raconter.
            </>)}
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <span aria-hidden style={{ display: "block", width: 1, height: "clamp(40px, 6vw, 72px)", background: `linear-gradient(180deg, ${C.accent}, transparent)`, margin: "clamp(28px, 4vw, 44px) auto 0" }} />
        </Reveal>
      </section>

      {/* ── STATS MONUMENTALES ───────────────────────────────────────────── */}
      <section style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.bgDark, position: "relative", overflow: "hidden" }}>
        <span aria-hidden style={{ position: "absolute", left: "-2%", top: "50%", transform: "translateY(-50%)", fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(120px, 18vw, 260px)", lineHeight: 1, color: C.ink, opacity: 0.035, pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap" }}>
          1 800
        </span>
        <div className="i329-stats i329-pad" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", maxWidth: 1240, margin: "0 auto", padding: "0 32px", position: "relative" }}>
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 0.08}>
              <div className="i329-statcell" style={{ padding: "clamp(36px, 5vw, 64px) clamp(8px, 1.5vw, 20px)", textAlign: "center", borderRight: idx < 3 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ fontFamily: DISPLAY, fontSize: "clamp(34px, 4.6vw, 68px)", fontWeight: 900, letterSpacing: "-0.03em", color: C.accent, lineHeight: 0.95, whiteSpace: "nowrap" }}>{s.value}</div>
                <div style={{ fontSize: "clamp(12px, 1.1vw, 13.5px)", color: C.textMuted, marginTop: 12, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FORMULES — en bandes, pas en cartes ──────────────────────────── */}
      <section id="formules" className="i329-pad" style={{ padding: "clamp(72px, 10vw, 130px) clamp(32px, 6vw, 96px)", background: C.bg }}>
        <div style={{ maxWidth: 1150, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(36px, 5vw, 60px)" }}>
              <Kicker>Trois formules</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(30px, 4.2vw, 54px)", fontWeight: 900, letterSpacing: "-0.025em", marginTop: 16, lineHeight: 1.04, color: C.ink }}>{/* TEXTE_SECTION */ clientText(sessionData, "formules.titre") ?? (<>
                Vous choisissez où<br />vous vous arrêtez<span style={{ color: C.accent }}>.</span>
              </>)}</h2>
              <p style={{ fontSize: "clamp(14px, 1.25vw, 15.5px)", color: C.textMuted, maxWidth: 500, margin: "16px 0 0", lineHeight: 1.75 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "formules.texte") ?? "Trois niveaux de prise en charge, un seul principe : le devis signé après visite est le prix facturé, quel que soit le volume constaté le jour J."}
              </p>
            </div>
          </Reveal>
          <div>
            {HERO_FORMULES.map((fo, idx) => (
              <FormuleBande key={fo.k} fo={fo} idx={idx} telHref={telHref} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section id="services" className="i329-pad" style={{ padding: "clamp(72px, 10vw, 130px) clamp(32px, 6vw, 96px)", background: C.bgCard, borderTop: `1px solid ${C.border}`, position: "relative", overflow: "hidden" }}>
        <span aria-hidden style={{ position: "absolute", right: "-3%", top: -30, fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(120px, 16vw, 240px)", lineHeight: 1, color: C.ink, opacity: 0.03, pointerEvents: "none", userSelect: "none" }}>
          CAP
        </span>
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{ marginBottom: "clamp(36px, 5vw, 60px)" }}>
              <Kicker>{tr(sessionData, "Services")}</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(30px, 4.2vw, 54px)", fontWeight: 900, letterSpacing: "-0.025em", marginTop: 16, lineHeight: 1.04, color: C.ink }}>{/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>
                Tout ce qui roule,<br />porte et protège<span style={{ color: C.accent }}>.</span>
              </>)}</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: "clamp(14px, 1.6vw, 20px)" }}>
            {SERVICES.map((s, idx) => (
              <ServiceCard key={s.titre} s={s} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── MÉTHODE — colonne collante + étapes filées ───────────────────── */}
      <section id="methode" className="i329-pad" style={{ padding: "clamp(72px, 10vw, 130px) clamp(32px, 6vw, 96px)", background: C.bg }}>
        <div className="i329-split" style={{ maxWidth: 1150, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0, 0.85fr) minmax(0, 1.15fr)", gap: "clamp(36px, 6vw, 80px)", alignItems: "start" }}>
          <div className="i329-methsticky" style={{ position: "sticky", top: 100 }}>
            <Reveal>
              <Kicker>La méthode</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(30px, 4.2vw, 54px)", fontWeight: 900, letterSpacing: "-0.025em", marginTop: 16, lineHeight: 1.02, color: C.ink, textTransform: "uppercase" }}>{/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (<>
                Démonté.<br />Roulé.<br /><span style={{ color: C.accent }}>Remonté.</span>
              </>)}</h2>
              <p style={{ fontSize: "clamp(14px, 1.25vw, 15.5px)", color: C.textMuted, maxWidth: 460, margin: "18px 0 0", lineHeight: 1.78 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "methode.texte") ?? "Quatre étapes, toujours dans le même ordre, du premier passage chez vous à votre signature à l'arrivée. C'est cet ordre qui fait qu'il ne se perd rien — ni carton, ni journée."}
              </p>
            </Reveal>
          </div>
          <div>
            {METHODE.map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.08}>
                <div style={{ display: "grid", gridTemplateColumns: "clamp(48px, 5vw, 68px) 1fr", gap: "clamp(16px, 2.4vw, 30px)", padding: "clamp(22px, 2.8vw, 34px) 0", borderTop: `1px solid ${C.border}`, alignItems: "start" }}>
                  <div style={{ fontFamily: DISPLAY, fontSize: "clamp(26px, 3vw, 40px)", fontWeight: 900, color: C.accent, lineHeight: 1, letterSpacing: "-0.02em" }}>{m.n}</div>
                  <div>
                    <h3 style={{ fontFamily: DISPLAY, fontSize: "clamp(16px, 1.5vw, 19px)", fontWeight: 800, marginBottom: 9, color: C.ink, letterSpacing: "-0.01em" }}>{m.t}</h3>
                    <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.72, margin: 0, maxWidth: 480 }}>{m.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Engagements : bande sombre + photo du client quand il en a une. */}
        <div className="i329-split" style={{ maxWidth: 1150, margin: "clamp(44px, 6vw, 72px) auto 0", display: "grid", gridTemplateColumns: photoEngagement ? "minmax(0, 0.9fr) minmax(0, 1.1fr)" : "1fr", gap: "clamp(24px, 4vw, 48px)", alignItems: "stretch" }}>
          {photoEngagement ? (
            <Reveal>
              <div style={{ borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden", background: C.bgDark, height: "100%", minHeight: 260 }}>
                <img src={photoEngagement} alt={`${fd?.businessName ?? clientName(sessionData) ?? "Cap Déménagements"} — l'équipe en intervention`} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            </Reveal>
          ) : null}
          <Reveal delay={0.12}>
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: "clamp(24px, 3vw, 36px) clamp(22px, 3vw, 34px)", background: `linear-gradient(150deg, ${C.bgCard} 0%, rgba(201,168,124,0.05) 100%)`, height: "100%", position: "relative", overflow: "hidden" }}>
              <span aria-hidden style={{ position: "absolute", right: -14, bottom: -34, fontFamily: DISPLAY, fontWeight: 900, fontSize: 130, lineHeight: 1, color: C.kraft, opacity: 0.06, pointerEvents: "none", userSelect: "none" }}>OK</span>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <Shield size={22} color={C.accent} style={{ flexShrink: 0 }} />
                <span style={{ fontFamily: DISPLAY, fontSize: 12, fontWeight: 800, letterSpacing: "0.26em", textTransform: "uppercase", color: C.accent }}>Nos garanties</span>
              </div>
              {ENGAGEMENT.map((e, idx) => (
                <div key={idx} style={{ display: "flex", gap: 11, alignItems: "flex-start", fontSize: 14, color: C.textMuted, lineHeight: 1.65, marginBottom: 13 }}>
                  <CheckCircle size={15} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                  {e}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── AVIS — colonnes légèrement décalées ──────────────────────────── */}
      <section className="i329-pad" style={{ padding: "clamp(72px, 10vw, 130px) clamp(32px, 6vw, 96px)", background: C.bgCard, borderTop: `1px solid ${C.border}` }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "clamp(36px, 5vw, 56px)" }}>
            <Kicker center>Ils déménagent avec nous</Kicker>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(28px, 3.8vw, 50px)", fontWeight: 900, letterSpacing: "-0.025em", marginTop: 16, lineHeight: 1.05, color: C.ink }}>{/* TEXTE_SECTION */ clientText(sessionData, "section-6.titre") ?? (<>
              Ils ont posé leurs cartons<span style={{ color: C.accent }}>.</span>
            </>)}</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: "clamp(14px, 1.6vw, 20px)", maxWidth: 1120, margin: "0 auto" }}>
          {AVIS.map((a, idx) => (
            <Reveal key={a.auteur} delay={idx * 0.1}>
              <div className={idx % 2 === 1 ? "i329-avis-off" : ""} style={{ marginTop: idx % 2 === 1 ? 28 : 0, height: "100%" }}>
                <AvisCard a={a} idx={idx} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <section id="contact" className="i329-pad" style={{ padding: "clamp(80px, 12vw, 160px) clamp(32px, 6vw, 96px)", textAlign: "center", background: C.bgDark, position: "relative", overflow: "hidden" }}>
        <span aria-hidden style={{ position: "absolute", left: "50%", top: "-30%", transform: "translateX(-50%)", width: "70%", height: "80%", background: "radial-gradient(ellipse, rgba(242,118,10,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />
        <span aria-hidden style={{ position: "absolute", left: "50%", bottom: -40, transform: "translateX(-50%)", fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(90px, 14vw, 200px)", lineHeight: 1, color: C.ink, opacity: 0.03, pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap" }}>
          45 MIN
        </span>
        <Reveal>
          <Package size={30} color={C.accent} style={{ margin: "0 auto 18px", position: "relative" }} />
          <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(30px, 4.6vw, 60px)", fontWeight: 900, letterSpacing: "-0.025em", marginBottom: 16, lineHeight: 1.02, color: C.ink, position: "relative" }}>{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
            On chiffre votre volume<br />en 45 minutes<span style={{ color: C.accent }}>.</span>
          </>)}</h2>
          <p style={{ fontSize: "clamp(14.5px, 1.3vw, 16px)", color: C.textMuted, maxWidth: 460, margin: "0 auto clamp(28px, 4vw, 40px)", lineHeight: 1.75, position: "relative" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ?? "Visite à domicile ou en visio, devis ferme sous 24 h. Cartons offerts dès la formule Standard."}
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
            <CtaBtn href={telHref} big><Phone size={17} /> {phone}</CtaBtn>
            <motion.a href={`mailto:${mail}`} style={{ background: "transparent", color: C.ink, border: `1px solid ${C.border}`, borderRadius: 8, padding: "15px 32px", fontWeight: 600, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }} whileHover={{ borderColor: C.accent }}>
              <Mail size={18} /> Écrire
            </motion.a>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="i329-pad" style={{ borderTop: `1px solid ${C.border}`, padding: "clamp(40px, 5vw, 56px) clamp(32px, 6vw, 96px) 22px", background: C.bgDarkAlt }}>
        <div style={{ maxWidth: 1150, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 30 }}>
            <div>
              <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 17, marginBottom: 8, letterSpacing: "-0.01em" }}>{fd?.businessName ?? (clientName(sessionData) ?? "Cap Déménagements")}</div>
              <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.7 }}>
                {clientTrade(sessionData) ?? "Déménageur"} professionnel · {clientCity(sessionData) ?? "Nantes"}<br />Registre des transporteurs — DREAL Pays de la Loire
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { icon: <MapPin size={13} />, t: clientCodePostalVille(sessionData, "44000", "Nantes") },
                { icon: <Phone size={13} />, t: phone },
                { icon: <Mail size={13} />, t: mail },
                { icon: <Clock size={13} />, t: "Lun–Sam 8h–19h" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, color: C.textMuted, fontSize: 13, alignItems: "center" }}>
                  <span style={{ color: C.accent }}>{item.icon}</span>{item.t}
                </div>
              ))}
              {clientAddress(sessionData) ? null : (
                <div style={{ display: "flex", gap: 10, color: C.textFaint, fontSize: 12, alignItems: "center" }}>
                  <span style={{ color: C.accent }}><Truck size={13} /></span>Départs de toute la Loire-Atlantique
                </div>
              )}
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
              © 2026 {fd?.businessName ?? (clientName(sessionData) ?? "Cap Déménagements")} — Site réalisé par Aevia WS · SIREN {/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}<LegalIdentity fallback="852 546 225" kind="siren" />
            </span>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Mentions légales : éditeur {clientName(sessionData) ?? "Aevia WS"} · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
