"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Droplets,
  FileText,
  Flame,
  HardHat,
  Mail,
  MapPin,
  Phone,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Thermometer,
  Wind,
} from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { InvertSweep } from "@/lib/templates/hero-kit-3";
import {
  clientCertifications,
  clientCity,
  clientCodePostalVille,
  clientEmail,
  clientEyebrow,
  clientFaq,
  clientHeroLine,
  clientHeroSubtitle,
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

/* ════════════════════════════════════════════════════════════════════════════
   {clientName(sessionData) ?? "Nettoyage Extrême"} — après sinistre, fin de chantier, désinfection. Lille.
   Réécriture premium (reprise 316–383, famille I).
   Geste signature : InvertSweep — TOUTE la page du héros bascule du sombre au
   clair pendant le défilement : l'avant (le sinistre) devient l'après (le
   propre). Héros H6 typographique sans photo, titres en contour, texture
   hachurée chantier, tarifs en bandes. Archivo 900 + Inter (P6).
   ════════════════════════════════════════════════════════════════════════════ */

let C: Record<string, string> = {
  bg: "#0e1116",
  bgAlt: "#12161d",
  bgDark: "#090b0f",
  bgDarkAlt: "#10141b",
  bgCard: "#151a22",
  bgLight: "#f2f4ee",
  bgLightAlt: "#e9ecdf",
  accent: "var(--brand,#a3c614)",
  accentDark: "var(--brand-light,#c6e34d)",
  accentLight: "#1a2008",
  ink: "#0e1116",
  text: "#e8ebe2",
  textMuted: "#9aa294",
  textFaint: "#5f6759",
  inkMuted: "#4a5142",
  border: "rgba(255,255,255,0.09)",
  borderLight: "rgba(14,17,22,0.14)",
  white: "#ffffff",
  hazard: "#a3c614",
};

const DISPLAY = "'Archivo', system-ui, sans-serif";
const BODY = "'Inter', system-ui, sans-serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const NAV = [
  { l: "Interventions", h: "#services" },
  { l: "Protocole", h: "#protocole" },
  { l: "Tarifs", h: "#tarifs" },
  { l: "Avis", h: "#avis" },
  { l: "Contact", h: "#contact" },
];

/* ── Données de démonstration (contenu du thème, conservé) ─────────────────── */

const SERVICES_SOURCE = [
  { icon: HardHat, titre: "Fin de chantier", desc: "Nettoyage complet après travaux de construction ou rénovation. Poussière, gravats, résidus de peinture, joints.", tag: "Chantier" },
  { icon: Droplets, titre: "Dégât des eaux", desc: "Assèchement, extraction d'eau, nettoyage et remise en état après inondation ou fuite majeure.", tag: "Sinistre" },
  { icon: Flame, titre: "Après incendie", desc: "Décontamination, élimination de la suie, traitement anti-odeurs, nettoyage structurel complet.", tag: "Sinistre" },
  { icon: Thermometer, titre: "Désinfection", desc: "Protocole virucide/bactéricide certifié EN 14476. Locaux professionnels, médicaux, alimentaires.", tag: "Sanitaire" },
  { icon: Wind, titre: "Nettoyage industriel", desc: "Entretien d'usines, entrepôts, parkings, zones de production. Haute pression, autolaveuse.", tag: "Industrie" },
  { icon: Shield, titre: "Débarras & curage", desc: "Vidage complet de locaux, caves, greniers, appartements. Tri, recyclage et évacuation en déchetterie.", tag: "Curage" },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const STATS_SOURCE = [
  { value: "< 2h", label: "Délai d'intervention" },
  { value: "24/7", label: "Disponibilité urgence" },
  { value: "1 500+", label: "Sinistres traités" },
  { value: "100%", label: "Taux de restitution" },
];
let STATS = STATS_SOURCE;

let METHODE = [
  { n: "01", t: "Diagnostic terrain", d: "Évaluation sur site en moins de 2h. Identification des risques, périmètre d'intervention, devis immédiat.", icon: Target },
  { n: "02", t: "Sécurisation", d: "Mise en sécurité de la zone, balisage, extraction des matériaux dangereux et ventilation forcée.", icon: ShieldCheck },
  { n: "03", t: "Nettoyage technique", d: "Équipement haute pression, extracteurs, produits professionnels certifiés. Traitement surface par surface.", icon: Sparkles },
  { n: "04", t: "Contrôle & rapport", d: "Inspection finale, photos avant/après, rapport d'intervention détaillé pour votre assurance.", icon: FileText },
];

const ENGAGEMENT_SOURCE = [
  "Intervention < 2h en zone urbaine",
  "Matériel professionnel haute capacité",
  "Rapport d'intervention pour assurances",
  "Protocoles EN 14476 certifiés",
  "Équipes formées risques chimiques",
];
let ENGAGEMENT = ENGAGEMENT_SOURCE;

/* Le thème n'a jamais affiché de montants : les bandes tarifaires reprennent
   les modes de chiffrage déjà écrits dans le contenu (visite < 2h, urgence
   24h/24, dossier assurance) — aucun prix inventé. Le prix du client, s'il en
   saisit un, remplace la mention. */
const TARIFS_SOURCE = [
  { a: "Fin de chantier", p: "Sur devis · visite < 2h", n: "Chiffrage sur site après évaluation du périmètre, devis immédiat." },
  { a: "Dégât des eaux", p: "Urgence 24h/24", n: "Assèchement et remise en état — rapport détaillé pour votre assurance." },
  { a: "Après incendie", p: "Sur devis assurance", n: "Décontamination et traitement anti-odeurs, photos avant/après fournies." },
  { a: "Désinfection EN 14476", p: "Contrat ou ponctuel", n: "Protocole certifié, traçabilité complète, milieux alimentaires agréés." },
];
let TARIFS = TARIFS_SOURCE;

const AVIS_SOURCE = [
  { texte: "Après un chantier de 6 mois, l'équipe a livré un immeuble impeccable en 48h. Rapport qualité-prix imbattable. Partenariat reconduit.", auteur: "Guillaume M.", detail: "Chef de chantier, BTP Provence" },
  { texte: "Intervention rapide et professionnelle après un dégât des eaux. Le rapport d'intervention détaillé facilite le traitement du sinistre.", auteur: "Isabelle K.", detail: "Expert d'assurance, AXA" },
  { texte: "Désinfection mensuelle de nos locaux de production. Protocole rigoureux, traçabilité parfaite, aucune non-conformité depuis 2 ans.", auteur: "Romain T.", detail: "Directeur usine, Agroalimentaire" },
];
let AVIS = AVIS_SOURCE;

const FAQ_SOURCE = [
  { q: "Quel est votre délai d'intervention en urgence ?", a: "Nous sommes sur site en moins de 2 heures en zone urbaine, et sous 4 heures en zone rurale. Disponibilité 24h/24, 7j/7, week-ends et jours fériés compris." },
  { q: "Travaillez-vous directement avec les assurances ?", a: "Oui. Notre rapport d'intervention détaillé (photos avant/après, protocole suivi, produits utilisés) est conçu pour faciliter vos démarches auprès de votre assurance habitation ou multirisque." },
  { q: "Quels types de produits utilisez-vous ?", a: "Nous utilisons des produits professionnels certifiés (EN 14476 pour les virucides, EN 1276 pour les bactéricides). Pour les interventions en milieu alimentaire, nous employons des produits agréés contact alimentaire." },
  { q: "Intervenez-vous pour les particuliers ?", a: "Oui. Nous intervenons aussi bien pour les professionnels (BTP, industrie, syndics) que pour les particuliers (dégât des eaux à domicile, nettoyage après travaux de rénovation)." },
];
let FAQ = FAQ_SOURCE;

/* URLs photo du thème (conservées — aucune nouvelle URL). */
const PHOTO_FALLBACK = [
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
  "https://images.pexels.com/photos/29994840/pexels-photo-29994840.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=800&auto=format&fit=crop",
];

// Photo du client à l'emplacement i, repli sur celle du thème.
function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ── Composants ────────────────────────────────────────────────────────────── */

function Reveal({ children, delay = 0, y = 26 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

function Kicker({ children, tone = "dark", center = false }: { children: React.ReactNode; tone?: "dark" | "light" | "inherit"; center?: boolean }) {
  const col = tone === "inherit" ? "inherit" : tone === "light" ? C.inkMuted : C.textMuted;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: center ? "center" : "flex-start" }}>
      <span aria-hidden style={{ width: 40, height: 1, background: "currentColor", opacity: 0.55, color: col }} />
      <span style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.36em", textTransform: "uppercase", color: col, opacity: tone === "inherit" ? 0.72 : 1 }}>
        {children}
      </span>
      {center && <span aria-hidden style={{ width: 40, height: 1, background: "currentColor", opacity: 0.55, color: col }} />}
    </div>
  );
}

/* Rangée éditoriale numérotée d'une intervention — survol en state local :
   élévation, deux ombres, accent sur le numéro, flèche qui avance. */
function ServiceRow({ s, idx }: { s: any; idx: number }) {
  const [hov, setHov] = useState(false);
  const Icon = s.icon ?? HardHat;
  return (
    <div
      className="i318-srow"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0,0.28fr) minmax(0,1fr)",
        gap: 28,
        alignItems: "start",
        padding: "clamp(26px, 3.4vw, 40px) clamp(10px, 2vw, 26px)",
        borderTop: `1px solid ${C.borderLight}`,
        background: hov ? "rgba(14,17,22,0.035)" : "transparent",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? "0 18px 40px rgba(14,17,22,0.10), 0 3px 10px rgba(14,17,22,0.06)" : "none",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
        <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(30px, 3.4vw, 46px)", lineHeight: 1, color: hov ? C.accent : "transparent", WebkitTextStroke: hov ? "0px" : `1.2px ${C.ink}`, transition: "color 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          {String(idx + 1).padStart(2, "0")}
        </span>
        <span style={{ fontFamily: BODY, fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: C.inkMuted }}>{s.tag}</span>
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <Icon size={19} color={C.inkMuted} aria-hidden />
          <h3 style={{ fontFamily: DISPLAY, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.01em", fontSize: "clamp(19px, 2.2vw, 26px)", color: C.ink, margin: 0 }}>{s.titre}</h3>
          <ArrowRight size={17} color={C.inkMuted} style={{ transform: hov ? "translateX(8px)" : "none", transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }} aria-hidden />
        </div>
        <p style={{ fontFamily: BODY, fontSize: 14.5, lineHeight: 1.7, color: C.inkMuted, margin: "10px 0 0", maxWidth: 520 }}>{s.desc}</p>
      </div>
    </div>
  );
}

/* Bande tarifaire — barre d'accent qui pousse à gauche au survol. */
function TarifBand({ t, idx }: { t: any; idx: number }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "clamp(22px, 3vw, 34px) clamp(18px, 3vw, 40px)",
        borderTop: `1px solid ${C.border}`,
        background: hov ? C.bgDarkAlt : "transparent",
        transform: hov ? "translateX(6px)" : "none",
        boxShadow: hov ? `inset 4px 0 0 0 ${C.accent}, 0 14px 34px rgba(0,0,0,0.35)` : "inset 0 0 0 0 transparent",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        overflow: "hidden",
      }}
    >
      <span aria-hidden style={{ position: "absolute", right: 14, top: -8, fontFamily: DISPLAY, fontWeight: 900, fontSize: 74, lineHeight: 1, color: C.text, opacity: 0.05, pointerEvents: "none" }}>
        {String(idx + 1).padStart(2, "0")}
      </span>
      <div style={{ minWidth: 0, maxWidth: 560 }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, textTransform: "uppercase", fontSize: "clamp(17px, 2vw, 23px)", color: C.text, letterSpacing: "0.015em" }}>{t.a}</div>
        <div style={{ fontFamily: BODY, fontSize: 13.5, color: C.textMuted, marginTop: 6, lineHeight: 1.65 }}>{t.n}</div>
      </div>
      <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(15px, 1.7vw, 19px)", textTransform: "uppercase", letterSpacing: "0.03em", color: hov ? C.accent : C.accentDark, whiteSpace: "nowrap", transition: "color 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        {t.p}
      </div>
    </div>
  );
}

function FaqItem({ item, idx }: { item: any; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: `1px solid ${C.border}`, background: C.bgCard, overflow: "hidden" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", minHeight: 44, padding: "18px 22px", background: "transparent", border: "none", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, cursor: "pointer", color: C.text }}
      >
        <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, letterSpacing: "0.01em" }}>{item.q}</span>
        <ChevronDown size={17} color={C.accent} style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }} aria-hidden />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }} style={{ overflow: "hidden" }}>
            <p style={{ padding: "0 22px 20px", margin: 0, fontFamily: BODY, fontSize: 14, lineHeight: 1.7, color: C.textMuted }}>{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────────── */

export default function NettoyageExtremePage() {
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
  /* La méthode du client remplace les étapes de la démonstration. */
  METHODE = resolveList(
    fusionnerEtapes(METHODE, clientMethode(sessionData)),
    METHODE,
  );

  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({ ...SERVICES_SOURCE[i % SERVICES_SOURCE.length], titre: s.title })),
    SERVICES_SOURCE,
  );
  STATS = resolveList(clientStats(sessionData), STATS_SOURCE);
  ENGAGEMENT = resolveList(clientCertifications(sessionData), ENGAGEMENT_SOURCE);
  TARIFS = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...TARIFS_SOURCE[i % TARIFS_SOURCE.length],
      a: s.title,
      p: s.price ?? TARIFS_SOURCE[i % TARIFS_SOURCE.length].p,
      n: s.description ?? s.desc ?? TARIFS_SOURCE[i % TARIFS_SOURCE.length].n,
    })),
    TARIFS_SOURCE,
  );
  AVIS = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      ...AVIS_SOURCE[i % AVIS_SOURCE.length],
      texte: r.text ?? AVIS_SOURCE[i % AVIS_SOURCE.length].texte,
      auteur: r.name ?? r.author ?? AVIS_SOURCE[i % AVIS_SOURCE.length].auteur,
      detail: r.location ?? r.role ?? AVIS_SOURCE[i % AVIS_SOURCE.length].detail,
    })),
    AVIS_SOURCE,
  );
  FAQ = resolveList(
    clientFaq(sessionData)?.map((f: any) => ({ q: f.q, a: f.a })),
    FAQ_SOURCE,
  );
  brand = fd?.brandColor ?? null;
  if (brand) {
    C = { ...C, accent: brand, hazard: brand };
  }

  const SERVICES = resolveList(
    clientServices(sessionData)?.map((s: any, n: number) => ({
      titre: s.title ?? SERVICES_DEMO[n % SERVICES_DEMO.length].titre,
      desc: s.description ?? s.desc ?? SERVICES_DEMO[n % SERVICES_DEMO.length].desc,
      tag: SERVICES_DEMO[n % SERVICES_DEMO.length].tag,
      icon: SERVICES_DEMO[n % SERVICES_DEMO.length].icon,
    })),
    SERVICES_DEMO,
  );

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const phone = clientPhone(sessionData) ?? "+33 (0)1 00 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? "+33179448021").replace(/[^+\d]/g, "")}`;
  const mail = clientEmail(sessionData) ?? "urgence@nettoyage-extreme.fr";
  const ville = clientCity(sessionData) ?? "Lille";
  const nom = clientName(sessionData) ?? "Nettoyage Extrême";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email) setFormSent(true);
  };

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: BODY, overflowX: "clip" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;800;900&family=Inter:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400&display=swap');
        @media (max-width: 900px) { #i318-nav { display: none !important; } .i318-burger { display: flex !important; } }
        @media (max-width: 860px) {
          .i318-split { grid-template-columns: 1fr !important; }
          .i318-split > * { order: initial !important; }
          .i318-stats { grid-template-columns: 1fr 1fr !important; row-gap: 18px !important; }
          .i318-stats .i318-statcell { border-left: none !important; }
          .i318-srow { grid-template-columns: 1fr !important; gap: 12px !important; }
          .i318-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i318-methode { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .i318-methode { grid-template-columns: 1fr !important; }
        }
        .i318-navlink { position: relative; }
        .i318-navlink::after {
          content: ""; position: absolute; left: 4px; bottom: 8px; height: 1.5px; width: 0;
          background: ${C.hazard}; transition: width 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .i318-navlink:hover::after { width: calc(100% - 8px); }
        @media (prefers-reduced-motion: reduce) {
          .i318-navlink::after { transition: none; }
        }
      `}</style>

      {/* ── NAV — collante à 4 propriétés (fond, flou, filet, hauteur) ───── */}
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          height: scrolled ? 62 : 76,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 clamp(20px, 4vw, 48px)",
          background: scrolled ? "rgba(9,11,15,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          transition: "all 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <AlertTriangle size={18} color={C.accent} style={{ flexShrink: 0 }} aria-hidden />
              <span style={{ fontFamily: DISPLAY, fontWeight: 900, textTransform: "uppercase", fontSize: 16, letterSpacing: "0.04em", color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nom}</span>
              <span style={{ fontSize: 9.5, letterSpacing: "0.26em", textTransform: "uppercase", color: C.textMuted, marginLeft: 6 }}>{clientTrade(sessionData) ?? "Sinistres & chantiers"}</span>
            </>
          )}
        </div>
        <div id="i318-nav" style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} className="i318-navlink" style={{ color: C.textMuted, fontSize: 13, fontWeight: 500, textDecoration: "none", padding: "12px 10px" }}>{l}</a>
          ))}
          <motion.a href={telHref} style={{ background: C.accent, color: C.ink, padding: "12px 22px", fontSize: 13, fontWeight: 800, fontFamily: DISPLAY, textTransform: "uppercase", letterSpacing: "0.08em", textDecoration: "none", whiteSpace: "nowrap", marginLeft: 10 }} whileHover={{ scale: 1.03 }}>
            Urgence 24h
          </motion.a>
        </div>
        <button className="i318-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
          <span style={{ display: "block", width: 24, height: 1.5, background: C.text, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.text, transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.text, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 62, left: 0, right: 0, zIndex: 99, background: C.bgDark, borderBottom: `1px solid ${C.border}`, padding: "20px 28px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ color: C.text, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "12px 0" }}>{l}</a>
          ))}
          <a href={telHref} style={{ background: C.accent, color: C.ink, padding: "13px 22px", fontSize: 14, fontWeight: 800, fontFamily: DISPLAY, textTransform: "uppercase", letterSpacing: "0.08em", textDecoration: "none", textAlign: "center", marginTop: 8 }}>Urgence 24h</a>
        </div>
      )}

      {/* ── HÉROS — InvertSweep : la page bascule du sombre (l'avant) au
             clair (l'après) pendant qu'on défile. Pas de section hero
             classique : le composant EST la surface (cf. impact-344/362).
             Kicker et titres HÉRITENT la couleur pilotée par le geste —
             jamais une couleur d'accent fixe, qui ne contrasterait pas sur
             les deux fonds. ─────────────────────────────────────────────── */}
      <InvertSweep dark={C.bg} light={C.bgLight} textDark={C.text} textLight="#12150d" accent={C.hazard} className="">
        {(invert) => (
          <div style={{ position: "relative", minHeight: "100dvh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(120px, 16vh, 170px) 24px clamp(36px, 6vh, 64px)" }}>
            {/* Texture chantier : hachures diagonales en currentColor, lisibles
                sur les deux fonds parce qu'elles héritent la couleur du geste. */}
            <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.05, backgroundImage: "repeating-linear-gradient(-45deg, currentColor 0 2px, transparent 2px 28px)" }} />
            {/* Chiffre fantôme métier : la disponibilité, en très grand. */}
            <div aria-hidden style={{ position: "absolute", right: "-1vw", bottom: "4vh", fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(140px, 26vw, 380px)", lineHeight: 0.8, letterSpacing: "-0.04em", color: "currentColor", opacity: 0.055, pointerEvents: "none", userSelect: "none" }}>
              24H
            </div>

            <div style={{ maxWidth: 1180, margin: "0 auto", width: "100%", position: "relative" }}>
              <Kicker tone="inherit">
                {/* clientEyebrow porte déjà « Métier · Ville » : n'ajouter la
                    ville qu'aux replis, sinon elle s'écrit deux fois. */}
                {clientEyebrow(sessionData) ?? <>{clientTrade(sessionData) ?? "Nettoyage extrême"} · {ville}</>}
              </Kicker>

              {/* Titre en contour : la 1re ligne est détourée (l'avant, encore
                  sale), la 2e est pleine (l'après, rendu net). La couleur du
                  trait suit la bascule du geste. */}
              <h1 style={{ fontFamily: DISPLAY, fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(44px, 8.4vw, 118px)", lineHeight: 0.94, letterSpacing: "-0.015em", margin: "22px 0 24px", maxWidth: 1050 }}>
                <span style={{ display: "block", color: "transparent", WebkitTextStroke: `1.5px color-mix(in srgb, #12150d ${Math.round(invert * 100)}%, ${C.text})` }}>
                  {clientHeroLine(sessionData, 0, 2, 14) ?? "L'avant, on"}
                </span>
                <span style={{ display: "block" }}>
                  {clientHeroLine(sessionData, 1, 2, 14) ?? "l'efface."}
                </span>
              </h1>

              <p style={{ fontFamily: BODY, fontSize: "clamp(15px, 1.6vw, 17.5px)", fontWeight: 300, lineHeight: 1.75, opacity: 0.78, maxWidth: 520, margin: "0 0 34px" }}>
                {c?.heroSubline ?? clientHeroSubtitle(sessionData) ?? "Intervention rapide 24h/24. Dégât des eaux, incendie, fin de chantier, décontamination. Équipement professionnel et protocoles certifiés."}
              </p>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
                <motion.a href={telHref} style={{ background: C.accent, color: C.ink, padding: "16px 32px", fontFamily: DISPLAY, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 13.5, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }} whileHover={{ scale: 1.02, y: -2 }}>
                  Appel urgence 24h <ArrowRight size={15} aria-hidden />
                </motion.a>
                <a href="#services" style={{ border: "1px solid currentColor", color: "inherit", padding: "15px 28px", fontFamily: DISPLAY, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 13, textDecoration: "none", opacity: 0.85 }}>
                  Nos interventions
                </a>
              </div>

              {/* Les chiffres clés vivent dans le héros (pas de bande à part) :
                  ils basculent de couleur avec lui. */}
              <div className="i318-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 0, marginTop: "clamp(44px, 7vh, 76px)", maxWidth: 960 }}>
                {STATS.map((s, idx) => (
                  <div key={s.label} className="i318-statcell" style={{ padding: "6px 18px", borderLeft: idx > 0 ? "1px solid rgba(128,134,120,0.35)" : "none" }}>
                    <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(24px, 2.6vw, 34px)", lineHeight: 1.05 }}>{s.value}</div>
                    <div style={{ fontFamily: BODY, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.6, marginTop: 6 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Le détail gratuit : le compteur d'avancement du nettoyage,
                  branché sur la progression réelle de la bascule. */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 40, fontSize: 12, opacity: 0.55 }}>
                <span aria-hidden style={{ width: 72, height: 2, background: "rgba(128,134,120,0.35)", position: "relative", overflow: "hidden" }}>
                  <span style={{ position: "absolute", inset: 0, background: "currentColor", transformOrigin: "left", transform: `scaleX(${invert})` }} />
                </span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>Défilez — nettoyé à {Math.round(invert * 100)} %</span>
              </div>
            </div>
          </div>
        )}
      </InvertSweep>

      {/* ── L'APRÈS — respiration sur fond clair, une seule phrase ───────── */}
      <section className="i318-pad" style={{ background: C.bgLight, color: C.ink, padding: "clamp(64px, 9vw, 110px) 64px clamp(30px, 4vw, 48px)", textAlign: "center" }}>
        <Reveal>
          <p style={{ fontFamily: BODY, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(19px, 2.4vw, 27px)", lineHeight: 1.6, color: C.inkMuted, maxWidth: 640, margin: "0 auto" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (<>Là où le nettoyage classique s'arrête, <em style={{ fontStyle: "italic", fontWeight: 400, color: C.ink }}>notre métier commence</em>.</>)}
          </p>
        </Reveal>
      </section>

      {/* ── INTERVENTIONS — rangées éditoriales numérotées, fond clair ───── */}
      <section id="services" className="i318-pad" style={{ background: C.bgLight, color: C.ink, padding: "clamp(56px, 7vw, 96px) 64px clamp(72px, 9vw, 120px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <Kicker tone="light">Types d'interventions</Kicker>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(28px, 4.2vw, 52px)", lineHeight: 1.06, letterSpacing: "-0.01em", color: C.ink, margin: "14px 0 clamp(30px, 4vw, 54px)", maxWidth: 720 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>Chaque situation exige <span style={{ color: "transparent", WebkitTextStroke: `1.3px ${C.ink}` }}>un protocole</span> adapté</>)}
            </h2>
          </Reveal>
          <div style={{ borderBottom: `1px solid ${C.borderLight}` }}>
            {SERVICES.map((s, idx) => (
              <Reveal key={s.titre} delay={idx * 0.05} y={18}>
                <ServiceRow s={s} idx={idx} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROTOCOLE — 4 étapes, colonnes filetées sur clair-alt ────────── */}
      <section id="protocole" className="i318-pad" style={{ background: C.bgLightAlt, color: C.ink, padding: "clamp(72px, 9vw, 118px) 64px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <Kicker tone="light">Protocole d'intervention</Kicker>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(26px, 3.8vw, 46px)", lineHeight: 1.06, color: C.ink, margin: "14px 0 clamp(30px, 4vw, 52px)", maxWidth: 680 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (<>4 étapes pour une restitution parfaite</>)}
            </h2>
          </Reveal>
          <div className="i318-methode" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 0 }}>
            {METHODE.map((m, idx) => {
              const Icon = m.icon;
              return (
                <Reveal key={m.n} delay={idx * 0.08}>
                  <div style={{ padding: "clamp(20px, 2.4vw, 34px) clamp(16px, 2vw, 28px)", borderLeft: `1px solid ${C.borderLight}`, position: "relative", minHeight: "100%" }}>
                    <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(34px, 3.6vw, 52px)", lineHeight: 1, color: "transparent", WebkitTextStroke: `1.2px ${C.ink}`, marginBottom: 18 }}>{m.n}</div>
                    <Icon size={20} color={C.inkMuted} aria-hidden />
                    <h3 style={{ fontFamily: DISPLAY, fontWeight: 800, textTransform: "uppercase", fontSize: 15.5, letterSpacing: "0.02em", color: C.ink, margin: "12px 0 10px" }}>{m.t}</h3>
                    <p style={{ fontFamily: BODY, fontSize: 13.5, lineHeight: 1.7, color: C.inkMuted, margin: 0 }}>{m.d}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── L'ENTREPRISE / ENGAGEMENTS — retour au sombre ────────────────── */}
      <section id="entreprise" className="i318-pad" style={{ background: C.bg, padding: "clamp(80px, 10vw, 130px) 64px" }}>
        <div className="i318-split" style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(36px, 5vw, 72px)", alignItems: "center" }}>
          <Reveal>
            {/* Repli soigné : si aucune photo ne charge, l'aplat sombre +
                hachures + filet accent tiennent la composition seuls. */}
            <div style={{ position: "relative", aspectRatio: "4/5", background: C.bgDarkAlt, overflow: "hidden", boxShadow: `inset 0 0 0 1px ${C.border}` }}>
              <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.07, backgroundImage: "repeating-linear-gradient(-45deg, #e8ebe2 0 2px, transparent 2px 26px)" }} />
              <img
                src={photo(0, PHOTO_FALLBACK[0])}
                alt="Équipe d'intervention en décontamination"
                loading="lazy"
                style={{ position: "relative", width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <span aria-hidden style={{ position: "absolute", left: 0, bottom: 0, width: "38%", height: 4, background: C.accent }} />
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              <Kicker>L'entreprise</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(26px, 3.8vw, 46px)", lineHeight: 1.06, color: C.text, margin: "14px 0 20px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "entreprise.titre") ?? c?.aboutTitle ?? (<>Spécialistes des situations <span style={{ color: "transparent", WebkitTextStroke: `1.3px ${C.accent}` }}>critiques</span></>)}
              </h2>
              <p style={{ fontFamily: BODY, fontSize: 15, fontWeight: 300, lineHeight: 1.78, color: C.textMuted, margin: "0 0 26px", maxWidth: 500 }}>
                {c?.aboutText ?? `${nom} intervient dans les situations où le nettoyage classique ne suffit plus. Après un sinistre, un incendie ou un chantier, nos équipes formées aux protocoles de décontamination restaurent vos locaux à l'état d'origine.`}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                {ENGAGEMENT.map((e, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <CheckCircle size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} aria-hidden />
                    <span style={{ fontFamily: BODY, fontSize: 14.5, color: C.text, lineHeight: 1.6 }}>{e}</span>
                  </div>
                ))}
              </div>
              <motion.a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.accent, color: C.ink, padding: "15px 30px", fontFamily: DISPLAY, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 13, textDecoration: "none" }} whileHover={{ scale: 1.02, y: -2 }}>
                Demander une intervention <ArrowRight size={15} aria-hidden />
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TARIFS EN BANDES ─────────────────────────────────────────────── */}
      <section id="tarifs" className="i318-pad" style={{ background: C.bgDark, padding: "clamp(72px, 9vw, 118px) 64px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: "-10%", right: "-6%", width: 460, height: 460, borderRadius: "50%", background: `radial-gradient(circle, ${C.hazard} 0%, transparent 65%)`, opacity: 0.08, pointerEvents: "none" }} />
        <div style={{ maxWidth: 1040, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <Kicker>Tarifs</Kicker>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(26px, 3.8vw, 46px)", lineHeight: 1.06, color: C.text, margin: "14px 0 12px" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>Un chiffrage <span style={{ color: "transparent", WebkitTextStroke: `1.3px ${C.text}` }}>net</span>, jamais flou</>)}
            </h2>
            <p style={{ fontFamily: BODY, fontSize: 14.5, fontWeight: 300, lineHeight: 1.7, color: C.textMuted, maxWidth: 560, margin: "0 0 clamp(28px, 4vw, 44px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.note") ?? (<>Chaque sinistre est unique : le devis est établi sur site, en moins de 2h en zone urbaine, et transmis avec le rapport attendu par votre assurance.</>)}
            </p>
          </Reveal>
          <div style={{ borderBottom: `1px solid ${C.border}` }}>
            {TARIFS.map((t, idx) => (
              <Reveal key={t.a} delay={idx * 0.06} y={16}>
                <TarifBand t={t} idx={idx} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TERRAIN — bande de trois photos (URLs du thème conservées) ───── */}
      <section className="i318-pad" style={{ background: C.bgDark, padding: "0 64px clamp(72px, 9vw, 110px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 14 }}>
          {[
            { i: 1, repli: PHOTO_FALLBACK[1], alt: "Chantier avant intervention" },
            { i: 2, repli: PHOTO_FALLBACK[2], alt: "Intervention technique en cours" },
            { i: 3, repli: PHOTO_FALLBACK[3], alt: "Locaux restitués après nettoyage" },
          ].map((ph, idx) => (
            <Reveal key={ph.i} delay={idx * 0.08}>
              <div style={{ position: "relative", aspectRatio: "4/3", background: C.bgDarkAlt, overflow: "hidden", boxShadow: `inset 0 0 0 1px ${C.border}` }}>
                <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "repeating-linear-gradient(-45deg, #e8ebe2 0 2px, transparent 2px 24px)" }} />
                <img src={photo(ph.i, ph.repli)} alt={ph.alt} loading="lazy" style={{ position: "relative", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── AVIS — colonnes décalées sur sombre-alt ──────────────────────── */}
      <section id="avis" className="i318-pad" style={{ background: C.bgDarkAlt, padding: "clamp(72px, 9vw, 118px) 64px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <Reveal>
            <Kicker center>Retours terrain</Kicker>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(26px, 3.8vw, 46px)", lineHeight: 1.06, color: C.text, textAlign: "center", margin: "14px 0 clamp(34px, 5vw, 56px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>Ce que disent <span style={{ color: "transparent", WebkitTextStroke: `1.3px ${C.text}` }}>nos clients</span></>)}
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: 20, alignItems: "start" }}>
            {AVIS.map((a, idx) => (
              <Reveal key={a.auteur} delay={idx * 0.1}>
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "28px 26px", marginTop: idx % 2 === 1 ? 34 : 0 }}>
                  <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                    {[...Array(5)].map((_, j) => <Star key={j} size={13} fill={C.hazard} color={C.hazard} aria-hidden />)}
                  </div>
                  <p style={{ fontFamily: BODY, fontStyle: "italic", fontWeight: 300, fontSize: 14.5, lineHeight: 1.75, color: C.text, margin: "0 0 18px" }}>"{a.texte}"</p>
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                    <div style={{ fontFamily: DISPLAY, fontWeight: 800, textTransform: "uppercase", fontSize: 12.5, letterSpacing: "0.05em", color: C.text }}>{a.auteur}</div>
                    <div style={{ fontFamily: BODY, fontSize: 12, color: C.textMuted, marginTop: 4 }}>{a.detail}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="i318-pad" style={{ background: C.bg, padding: "clamp(72px, 9vw, 112px) 64px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Reveal>
            <Kicker center>FAQ technique</Kicker>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(24px, 3.4vw, 40px)", lineHeight: 1.06, color: C.text, textAlign: "center", margin: "14px 0 clamp(28px, 4vw, 44px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "faq.titre") ?? (<>Questions fréquentes</>)}
            </h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQ.map((item, idx) => (
              <Reveal key={idx} delay={idx * 0.05} y={14}>
                <FaqItem item={item} idx={idx} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <section id="contact" className="i318-pad" style={{ background: C.bgDark, padding: "clamp(80px, 10vw, 124px) 64px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", left: "-4%", bottom: "-16%", fontFamily: DISPLAY, fontWeight: 900, fontSize: "clamp(120px, 20vw, 300px)", lineHeight: 0.8, color: C.text, opacity: 0.04, pointerEvents: "none", userSelect: "none" }}>&lt;2H</div>
        <div className="i318-split" style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(36px, 5vw, 72px)", position: "relative" }}>
          <Reveal>
            <div>
              <Kicker>Urgence & devis</Kicker>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(26px, 3.8vw, 46px)", lineHeight: 1.06, color: C.text, margin: "14px 0 18px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>Intervention <span style={{ color: "transparent", WebkitTextStroke: `1.3px ${C.accent}` }}>rapide</span></>)}
              </h2>
              <p style={{ fontFamily: BODY, fontSize: 14.5, fontWeight: 300, lineHeight: 1.72, color: C.textMuted, margin: "0 0 36px", maxWidth: 440 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ?? (<>Sinistre en cours ? Appelez-nous directement. Pour un devis planifié, remplissez le formulaire ci-contre.</>)}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                {[
                  { icon: Phone, label: "Urgence 24h/24", value: phone, href: telHref },
                  { icon: Mail, label: "E-mail", value: mail, href: `mailto:${mail}` },
                  { icon: MapPin, label: "Zone d'intervention", value: clientCodePostalVille(sessionData) ?? `${ville} et métropole` },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <div style={{ width: 44, height: 44, background: C.accentLight, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, flexShrink: 0 }}>
                        <Icon size={17} aria-hidden />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: BODY, fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color: C.textFaint }}>{item.label}</div>
                        {item.href ? (
                          <a href={item.href} style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 15.5, color: C.text, textDecoration: "none" }}>{item.value}</a>
                        ) : (
                          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 15.5, color: C.text }}>{item.value}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "clamp(26px, 3vw, 40px)" }}>
              {formSent ? (
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: EASE }} style={{ textAlign: "center", padding: "24px 0" }}>
                  <CheckCircle size={44} color={C.accent} style={{ margin: "0 auto 16px", display: "block" }} aria-hidden />
                  <h3 style={{ fontFamily: DISPLAY, fontWeight: 900, textTransform: "uppercase", fontSize: 20, color: C.text, margin: "0 0 8px" }}>Demande reçue</h3>
                  <p style={{ fontFamily: BODY, fontSize: 14, color: C.textMuted, lineHeight: 1.65, margin: 0 }}>Merci {form.name}, un technicien vous recontacte dans les plus brefs délais.</p>
                </motion.div>
              ) : (
                <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {[
                    { label: "Nom complet", key: "name", type: "text" },
                    { label: "E-mail", key: "email", type: "email" },
                    { label: "Téléphone", key: "phone", type: "tel" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label style={{ display: "block", fontFamily: BODY, fontSize: 10.5, letterSpacing: "0.16em", textTransform: "uppercase", color: C.textMuted, marginBottom: 8, fontWeight: 600 }}>{f.label}</label>
                      <input
                        type={f.type}
                        required={f.key !== "phone"}
                        value={(form as any)[f.key]}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        style={{ width: "100%", padding: "13px 15px", background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontFamily: BODY, fontSize: 14, outline: "none" }}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: "block", fontFamily: BODY, fontSize: 10.5, letterSpacing: "0.16em", textTransform: "uppercase", color: C.textMuted, marginBottom: 8, fontWeight: 600 }}>Description du sinistre / besoin</label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Type de sinistre, surface, urgence…"
                      style={{ width: "100%", padding: "13px 15px", background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontFamily: BODY, fontSize: 14, outline: "none", resize: "none" }}
                    />
                  </div>
                  <motion.button type="submit" style={{ background: C.accent, color: C.ink, border: "none", padding: "16px 28px", fontFamily: DISPLAY, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 13.5, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10 }} whileHover={{ scale: 1.02 }}>
                    Envoyer ma demande <ArrowRight size={15} aria-hidden />
                  </motion.button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="i318-pad" style={{ background: C.bgDark, borderTop: `1px solid ${C.border}`, padding: "clamp(44px, 6vw, 64px) 64px 24px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 30, marginBottom: 34 }}>
            <div style={{ maxWidth: 320 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <AlertTriangle size={16} color={C.accent} aria-hidden />
                <span style={{ fontFamily: DISPLAY, fontWeight: 900, textTransform: "uppercase", fontSize: 16, color: C.text }}>{nom}</span>
              </div>
              <p style={{ fontFamily: BODY, fontSize: 13, lineHeight: 1.7, color: C.textFaint, margin: 0 }}>
                Spécialistes sinistres & chantiers · {clientCodePostalVille(sessionData) ?? ville}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ fontFamily: BODY, fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: C.textMuted, fontWeight: 700 }}>Navigation</span>
              {NAV.map(({ l, h }) => (
                <a key={l} href={h} style={{ fontFamily: BODY, fontSize: 13, color: C.textFaint, textDecoration: "none", padding: "2px 0" }}>{l}</a>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ fontFamily: BODY, fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: C.textMuted, fontWeight: 700 }}>Disponibilité</span>
              <p style={{ fontFamily: BODY, fontSize: 13, lineHeight: 1.8, color: C.textFaint, margin: 0 }}>
                Urgences 24h/24 · 7j/7<br />Bureau Lun–Ven 8h–18h
              </p>
              <a href={telHref} style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 14, color: C.accent, textDecoration: "none" }}>{phone}</a>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontFamily: BODY, fontSize: 12, color: C.textFaint }}>
              © {new Date().getFullYear()} {nom} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
              {/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ fontFamily: BODY, fontSize: 12, color: C.textFaint }}>Mentions légales : éditeur {nom} · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
