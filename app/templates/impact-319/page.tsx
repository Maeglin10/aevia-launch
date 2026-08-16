"use client";
// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, HairlineArrows, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
import { ParticleOrb } from "@/lib/templates/hero-kit-3";
import {
  clientAddress,
  clientCity,
  clientCodePostalVille,
  clientEmail,
  clientEyebrow,
  clientFaq,
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
   {clientName(sessionData) ?? "Éco-Clean Habitat"} — nettoyage écologique, Montpellier.
   Réécriture premium (reprise 316–383, famille I).
   Geste signature : ParticleOrb — une sphère de particules vertes respire
   derrière le titre ; au défilement le titre monte, l'orbe reste (séparation
   différentielle). Héros H6 sans photo, glows radiaux végétaux, méthode en
   timeline verticale. Fraunces + Inter (P4).
   ════════════════════════════════════════════════════════════════════════════ */

let C: Record<string, string> = {
  bg: "#f6f8f2",
  bgAlt: "#eef2e6",
  bgDark: "#1d2416",
  bgDarkAlt: "#232c1a",
  bgCard: "#ffffff",
  accent: "var(--brand,#4d7c0f)",
  accentDark: "var(--brand-light,#3a5e0b)",
  accentLight: "#e2ecd0",
  ink: "#232919",
  textMuted: "#5b634f",
  textFaint: "#8a9179",
  border: "#dde4cf",
  white: "#ffffff",
  leaf: "#6d9a3f",
};

const SERIF = "'Fraunces', Georgia, serif";
const SANS = "'Inter', system-ui, sans-serif";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const NAV = [
  { l: "Services", h: "#services" },
  { l: "Méthode", h: "#methode" },
  { l: "Philosophie", h: "#philosophie" },
  { l: "Réalisations", h: "#realisations" },
  { l: "Contact", h: "#contact" },
];

/* ── Données de démonstration (contenu du thème, conservé) ─────────────────── */

const SERVICES_SOURCE = [
  { icon: Leaf, titre: "Nettoyage Résidentiel", desc: "Un entretien complet de votre maison utilisant exclusivement des produits naturels, sans toxines, pour un environnement sain pour votre famille et vos animaux." },
  { icon: Sparkles, titre: "Nettoyage Fin de Chantier", desc: "Remise en état après travaux avec des méthodes douces mais efficaces pour éliminer la poussière et les résidus tout en préservant vos nouveaux matériaux." },
  { icon: ShieldCheck, titre: "Entretien Bureaux", desc: "Espaces de travail purifiés. Nous créons un environnement propice à la concentration et au bien-être de vos collaborateurs avec des solutions éco-responsables." },
];
let SERVICES_DEMO = SERVICES_SOURCE;

const STATS_SOURCE = [
  { value: "100%", label: "Produits naturels" },
  { value: "+500", label: "Clients satisfaits" },
  { value: "+2000", label: "Interventions" },
  { value: "Écolabel", label: "Certifié" },
];
let STATS = STATS_SOURCE;

/* La méthode reprend ce que le thème disait déjà (FAQ et contact) : contact,
   visite d'évaluation gratuite, devis sur-mesure, intervention équipée.
   Rien d'inventé, seulement remis en timeline. */
const METHODE = [
  { n: "01", t: "Premier contact", d: "Par le formulaire ou par téléphone : nous vous répondons dans les plus brefs délais pour comprendre votre besoin d'entretien." },
  { n: "02", t: "Visite d'évaluation gratuite", d: "Une première visite pour comprendre vos besoins spécifiques : surfaces, matériaux délicats, sensibilités ou allergies du foyer." },
  { n: "03", t: "Devis sur-mesure", d: "Un devis établi d'après la visite, adapté à votre espace et à la fréquence d'entretien souhaitée." },
  { n: "04", t: "Intervention équipée", d: "Nous apportons tout : aspirateurs à filtres HEPA, chiffons microfibre réutilisables et produits naturels certifiés — vinaigre blanc, bicarbonate, huiles essentielles, savon noir." },
];

const LISTE_PHILOSOPHIE = [
  "Santé préservée pour vous et vos proches.",
  "Respect des surfaces et matériaux délicats.",
  "Impact environnemental réduit au minimum.",
  "Parfums naturels et apaisants.",
];

const AVIS_SOURCE = [
  { texte: "Je suis ravie de leurs services. L'odeur après leur passage est fraîche et naturelle, contrairement aux produits chimiques habituels. Une vraie bouffée d'air pur dans mon appartement !", auteur: "Sophie L.", detail: "Cliente Régulière" },
  { texte: "Efficacité redoutable et respect total des matériaux. Leurs méthodes de nettoyage écologiques ont redonné vie à mes parquets anciens sans les agresser. Je recommande vivement.", auteur: "Marc D.", detail: "Propriétaire" },
  { texte: "Nous avons confié l'entretien de nos bureaux à Éco-Clean. Nos employés ont immédiatement remarqué la différence de qualité de l'air. Un service professionnel et aligné avec nos valeurs.", auteur: "Julie T.", detail: "Gérante d'Entreprise" },
];
let AVIS = AVIS_SOURCE;

const FAQ_SOURCE = [
  { q: "Quels types de produits utilisez-vous ?", a: "Nous utilisons exclusivement des produits certifiés écologiques, biodégradables et non toxiques. Nos formules sont souvent à base d'ingrédients naturels comme le vinaigre blanc, le bicarbonate de soude, les huiles essentielles et le savon noir." },
  { q: "Fournissez-vous le matériel de nettoyage ?", a: "Oui, nous apportons tout le matériel nécessaire (aspirateurs avec filtres HEPA, chiffons en microfibre réutilisables, balais) ainsi que tous nos produits d'entretien naturels." },
  { q: "Vos services sont-ils adaptés aux personnes allergiques ?", a: "Absolument. Nos méthodes et produits sans chimie lourde sont particulièrement recommandés pour les personnes sensibles, asthmatiques ou sujettes aux allergies. Nos aspirateurs filtrent 99% des particules fines." },
  { q: "Comment fixer un premier rendez-vous ?", a: "Vous pouvez nous contacter via le formulaire ci-dessous ou par téléphone. Nous proposons une première visite d'évaluation gratuite pour comprendre vos besoins spécifiques et établir un devis sur-mesure." },
];
let FAQ = FAQ_SOURCE;

/* URLs photo du thème (toutes conservées — l'ancienne photo de héros vit
   désormais dans les réalisations ; aucune URL inventée). */
const PHOTO_FALLBACK = [
  "https://images.pexels.com/photos/10574049/pexels-photo-10574049.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.pexels.com/photos/10481134/pexels-photo-10481134.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.pexels.com/photos/10268087/pexels-photo-10268087.jpeg?auto=compress&cs=tinysrgb&w=2000",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
];

// Photo du client à l'emplacement i, repli sur celle du thème.
function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}

/* ── Composants ────────────────────────────────────────────────────────────── */

function Reveal({ children, delay = 0, y = 28 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

function Kicker({ children, tone = "light", center = false }: { children: React.ReactNode; tone?: "light" | "dark"; center?: boolean }) {
  const col = tone === "dark" ? "rgba(246,248,242,0.65)" : C.accentDark;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: center ? "center" : "flex-start" }}>
      <span aria-hidden style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${tone === "dark" ? "rgba(246,248,242,0.5)" : C.accentDark})` }} />
      <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.34em", textTransform: "uppercase", color: col }}>{children}</span>
      {center && <span aria-hidden style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${tone === "dark" ? "rgba(246,248,242,0.5)" : C.accentDark}, transparent)` }} />}
    </div>
  );
}

/* Colonne filetée d'un service — survol en state local : élévation, deux
   ombres, numéro qui prend l'accent, flèche qui avance. */
function ServiceCol({ s, idx }: { s: any; idx: number }) {
  const [hov, setHov] = useState(false);
  const Icon = s.icon ?? Leaf;
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "clamp(26px, 3vw, 40px) clamp(20px, 2.4vw, 34px)",
        borderLeft: `1px solid ${C.border}`,
        background: hov ? C.bgCard : "transparent",
        transform: hov ? "translateY(-5px)" : "none",
        boxShadow: hov ? "0 24px 48px rgba(35,41,25,0.10), 0 4px 12px rgba(35,41,25,0.05)" : "none",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20 }}>
        <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(30px, 3vw, 42px)", lineHeight: 1, color: hov ? C.accent : C.textFaint, transition: "color 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          {String(idx + 1).padStart(2, "0")}
        </span>
        <Icon size={20} color={C.leaf} aria-hidden />
      </div>
      <div style={{ borderRadius: 14, overflow: "hidden", aspectRatio: "4/3", background: C.accentLight, marginBottom: 20 }}>
        <img src={s.img} alt={s.titre} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: hov ? "scale(1.04)" : "scale(1)", transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)" }} />
      </div>
      <h3 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(20px, 2vw, 24px)", lineHeight: 1.2, color: C.ink, margin: "0 0 12px" }}>{s.titre}</h3>
      <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.72, color: C.textMuted, margin: 0, flex: 1 }}>{s.desc}</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20 }}>
        <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: hov ? C.accent : C.textFaint, transition: "color 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          {s.price ? s.price : "Devis gratuit"}
        </span>
        <ArrowRight size={16} color={C.accentDark} style={{ transform: hov ? "translateX(7px)" : "none", transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }} aria-hidden />
      </div>
    </div>
  );
}

function FaqItem({ item }: { item: any }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", minHeight: 44, padding: "20px 24px", background: "none", border: "none", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, cursor: "pointer" }}
      >
        <span style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 16.5, color: C.ink }}>{item.q}</span>
        <ChevronDown size={18} color={C.accent} style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }} aria-hidden />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }} style={{ overflow: "hidden" }}>
            <p style={{ padding: "0 24px 22px", margin: 0, fontFamily: SANS, fontSize: 14.5, lineHeight: 1.7, color: C.textMuted }}>{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────────── */

export default function EcoCleanHabitatPage() {
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

  SERVICES_DEMO = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({ ...SERVICES_SOURCE[i % SERVICES_SOURCE.length], titre: s.title })),
    SERVICES_SOURCE,
  );
  STATS = resolveList(clientStats(sessionData), STATS_SOURCE);
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
    C = { ...C, accent: brand, leaf: brand };
  }

  const SERVICES = resolveList(
    clientServices(sessionData)?.map((s: any, n: number) => ({
      titre: s.title ?? SERVICES_DEMO[n % SERVICES_DEMO.length].titre,
      desc: s.description ?? s.desc ?? SERVICES_DEMO[n % SERVICES_DEMO.length].desc,
      icon: SERVICES_DEMO[n % SERVICES_DEMO.length].icon,
      price: s.price,
    })),
    SERVICES_DEMO,
  );

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Séparation différentielle du héros : le titre monte au défilement,
     l'orbe reste. Le MotionValue ne pilote qu'un wrapper distinct des
     éléments qui portent l'animation d'entrée. */
  const heroRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const textLift = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const textFade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const orbDrift = useTransform(scrollYProgress, [0, 1], [0, 34]);

  /* Avis en spotlight rotatif : une seule citation à la fois, DWELL lent,
     index + flèches filaires du kit. */
  const { i: avisI, next: avisNext, prev: avisPrev } = useSlides(AVIS.length, DWELL.slow);
  const avis = AVIS[avisI % AVIS.length];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const nom = clientName(sessionData) ?? "Éco-Clean Habitat";
  const ville = clientCity(sessionData) ?? "Montpellier";
  const phone = clientPhone(sessionData) ?? "01 20 51 13 32";
  const telHref = `tel:${(clientPhone(sessionData) ?? "0120511332").replace(/[^+\d]/g, "")}`;
  const mail = clientEmail(sessionData) ?? "contact@eco-clean-habitat.fr";
  const adresse = fd?.contactAddress ?? clientAddress(sessionData) ?? `123 Rue de la Nature, ${ville}`;

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, overflowX: "clip" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400;1,9..144,500&family=Inter:wght@300;400;500;600;700&display=swap');
        @media (max-width: 900px) { #i319-nav { display: none !important; } .i319-burger { display: flex !important; } }
        @media (max-width: 860px) {
          .i319-split { grid-template-columns: 1fr !important; }
          .i319-split > * { order: initial !important; }
          .i319-cols { grid-template-columns: 1fr !important; }
          .i319-cols > * { border-left: none !important; border-top: 1px solid ${C.border}; }
          .i319-stats { grid-template-columns: 1fr 1fr !important; row-gap: 22px !important; }
          .i319-stats .i319-statcell { border-left: none !important; }
          .i319-timeline { padding-left: 26px !important; }
          .i319-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .i319-spot { padding: 40px 24px !important; }
        }
        .i319-navlink { position: relative; }
        .i319-navlink::after {
          content: ""; position: absolute; left: 10px; bottom: 8px; height: 1.5px; width: 0;
          background: ${C.leaf}; transition: width 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .i319-navlink:hover::after { width: calc(100% - 20px); }
        @keyframes i319breathe { 0%, 100% { transform: scale(1); opacity: 0.75; } 50% { transform: scale(1.5); opacity: 1; } }
        .i319-dot { animation: i319breathe 3.2s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .i319-dot { animation: none; }
          .i319-navlink::after { transition: none; }
        }
      `}</style>

      {/* ── NAV — collante à 4 propriétés (fond, flou, filet, hauteur) ───── */}
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          height: scrolled ? 64 : 80,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 clamp(20px, 4vw, 48px)",
          background: scrolled ? "rgba(246,248,242,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
          transition: "all 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 32, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <Leaf size={19} color={C.accent} style={{ flexShrink: 0 }} aria-hidden />
              <span style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 19, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nom}</span>
              <span style={{ fontSize: 9.5, letterSpacing: "0.26em", textTransform: "uppercase", color: C.textFaint, marginLeft: 6 }}>{clientTrade(sessionData) ?? "Entretien naturel"}</span>
            </>
          )}
        </div>
        <div id="i319-nav" style={{ display: "flex", gap: 2, alignItems: "center" }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} className="i319-navlink" style={{ color: C.textMuted, fontSize: 13.5, fontWeight: 500, textDecoration: "none", padding: "12px 10px" }}>{l}</a>
          ))}
          <motion.a href="#contact" style={{ background: C.accent, color: C.white, borderRadius: 999, padding: "12px 24px", fontSize: 13.5, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap", marginLeft: 12 }} whileHover={{ scale: 1.03 }}>
            Demander un devis
          </motion.a>
        </div>
        <button className="i319-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}>
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.ink, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 99, background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "20px 28px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map(({ l, h }) => (
            <a key={l} href={h} onClick={() => setMobileOpen(false)} style={{ color: C.ink, fontSize: 16, fontWeight: 500, textDecoration: "none", padding: "12px 0" }}>{l}</a>
          ))}
          <a href="#contact" onClick={() => setMobileOpen(false)} style={{ background: C.accent, color: C.white, borderRadius: 999, padding: "13px 24px", fontSize: 15, fontWeight: 600, textDecoration: "none", textAlign: "center", marginTop: 8 }}>Demander un devis</a>
        </div>
      )}

      {/* ── HÉROS H6 — l'orbe de particules derrière le titre, aucun média.
             Au défilement le texte monte et s'estompe, l'orbe dérive à
             peine : la séparation différentielle du geste. ─────────────── */}
      <section ref={heroRef} style={{ position: "relative", minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "120px 24px 80px" }}>
        {/* Glows radiaux végétaux — jamais au-dessus de 0.12. */}
        <div aria-hidden style={{ position: "absolute", top: "-12%", left: "-8%", width: "48vw", height: "48vw", borderRadius: "50%", background: `radial-gradient(circle, ${C.leaf} 0%, transparent 62%)`, opacity: 0.12, pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", bottom: "-16%", right: "-10%", width: "54vw", height: "54vw", borderRadius: "50%", background: `radial-gradient(circle, ${C.leaf} 0%, transparent 60%)`, opacity: 0.1, pointerEvents: "none" }} />

        {/* L'orbe : il reste quand le titre part. */}
        <div aria-hidden style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <motion.div style={{ y: reduce ? 0 : orbDrift, width: "min(78vw, 620px)", height: "min(78vw, 620px)" }}>
            <ParticleOrb count={700} color={C.leaf} seconds={44} style={{ width: "100%", height: "100%" }} />
          </motion.div>
        </div>

        <motion.div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 880, y: reduce ? 0 : textLift, opacity: reduce ? 1 : textFade }}>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginBottom: 26 }}>
              {/* Le détail gratuit : le point qui respire, au rythme d'une
                  maison aérée. */}
              <span className="i319-dot" aria-hidden style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent, display: "inline-block" }} />
              <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.36em", textTransform: "uppercase", color: C.accentDark }}>
                {/* clientEyebrow porte déjà « Métier · Ville » : n'ajouter la
                    ville qu'au repli, sinon elle s'écrit deux fois. */}
                {clientEyebrow(sessionData) ?? <>Entretien naturel · {ville}</>}
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.3 }}
            style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(40px, 7vw, 84px)", lineHeight: 1.0, letterSpacing: "-0.015em", color: C.ink, margin: "0 0 26px" }}
          >
            {clientHeroLine(sessionData, 0, 2, 20) ?? c?.heroTitle ?? "La pureté"}
            <br />
            <em style={{ fontStyle: "italic", fontWeight: 300, color: C.accentDark }}>{clientHeroLine(sessionData, 1, 2, 20) ?? "au naturel."}</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
            style={{ fontFamily: SANS, fontWeight: 300, fontSize: "clamp(15px, 1.7vw, 18px)", lineHeight: 1.75, color: C.textMuted, maxWidth: 520, margin: "0 auto 38px" }}
          >
            {clientHeroSubtitle(sessionData) ?? clientTagline(sessionData) ?? c?.heroSubtitle ?? "Services de nettoyage professionnel respectueux de l'environnement, de votre santé et de votre bien-être."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.65 }}
            style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}
          >
            <motion.a href="#services" style={{ background: C.accent, color: C.white, borderRadius: 999, padding: "16px 34px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, boxShadow: "0 10px 28px rgba(77,124,15,0.28)" }} whileHover={{ scale: 1.03, y: -2 }}>
              Découvrir nos services <ArrowRight size={16} aria-hidden />
            </motion.a>
            <motion.a href="#contact" style={{ border: `1px solid ${C.accentDark}`, color: C.accentDark, borderRadius: 999, padding: "15px 30px", fontWeight: 500, fontSize: 15, textDecoration: "none" }} whileHover={{ scale: 1.02 }}>
              Nous contacter
            </motion.a>
          </motion.div>
        </motion.div>

        <div style={{ position: "absolute", bottom: 26, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: C.textFaint, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" }}>
          <span>Défiler</span>
          <ChevronDown size={14} aria-hidden />
        </div>
      </section>

      {/* ── RESPIRATION — une phrase serif italique, centrée ─────────────── */}
      <section className="i319-pad" style={{ background: C.bg, padding: "clamp(30px, 5vw, 70px) 64px clamp(60px, 8vw, 100px)", textAlign: "center" }}>
        <Reveal>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(20px, 2.6vw, 29px)", lineHeight: 1.55, color: C.textMuted, maxWidth: 620, margin: "0 auto" }}>
            {/* TEXTE_SECTION */ clientText(sessionData, "respiration.phrase") ?? (<>La nature nous offre tout ce qu'il faut pour nettoyer, <em style={{ color: C.accentDark }}>assainir</em> et parfumer nos intérieurs.</>)}
          </p>
        </Reveal>
      </section>

      {/* ── SERVICES — trois colonnes filetées, numérotées ───────────────── */}
      <section id="services" className="i319-pad" style={{ background: C.bgAlt, padding: "clamp(72px, 9vw, 118px) 64px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <Kicker>Notre expertise</Kicker>
            <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(30px, 4.4vw, 52px)", lineHeight: 1.06, color: C.ink, margin: "16px 0 clamp(30px, 4vw, 52px)", maxWidth: 640 }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>Des solutions pour <em style={{ fontStyle: "italic", color: C.accentDark }}>chaque espace</em></>)}
            </h2>
          </Reveal>
          <div className="i319-cols" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px,100%),1fr))", gap: 0, borderRight: `1px solid ${C.border}` }}>
            {SERVICES.map((s, idx) => (
              <Reveal key={s.titre} delay={idx * 0.08} y={20}>
                <ServiceCol s={{ ...s, img: photo((idx % 3) + 1, PHOTO_FALLBACK[(idx % 3) + 1]) }} idx={idx} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MÉTHODE EN TIMELINE ──────────────────────────────────────────── */}
      <section id="methode" className="i319-pad" style={{ background: C.bg, padding: "clamp(76px, 9vw, 122px) 64px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", right: "-4%", top: "8%", fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(120px, 20vw, 280px)", lineHeight: 0.9, color: C.leaf, opacity: 0.06, pointerEvents: "none", userSelect: "none" }}>éco</div>
        <div className="i319-split" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,0.9fr) minmax(0,1.1fr)", gap: "clamp(36px, 6vw, 88px)", position: "relative" }}>
          <Reveal>
            <div>
              <Kicker>Comment ça se passe</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1.06, color: C.ink, margin: "16px 0 18px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (<>Du premier appel à l'air <em style={{ fontStyle: "italic", color: C.accentDark }}>plus pur</em></>)}
              </h2>
              <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 15, lineHeight: 1.75, color: C.textMuted, maxWidth: 380, margin: 0 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "methode.texte") ?? (<>Une méthode simple et transparente : nous venons voir, nous chiffrons, nous intervenons avec notre propre matériel — vous n'avez rien à fournir.</>)}
              </p>
            </div>
          </Reveal>
          <div className="i319-timeline" style={{ position: "relative", paddingLeft: 38 }}>
            {/* Le fil de la timeline : filet dégradé 1 px. */}
            <span aria-hidden style={{ position: "absolute", left: 9, top: 8, bottom: 8, width: 1, background: `linear-gradient(180deg, transparent, ${C.leaf} 12%, ${C.leaf} 88%, transparent)` }} />
            {METHODE.map((m, idx) => (
              <Reveal key={m.n} delay={idx * 0.1} y={20}>
                <div style={{ position: "relative", paddingBottom: idx === METHODE.length - 1 ? 0 : "clamp(28px, 3.4vw, 44px)" }}>
                  <span aria-hidden style={{ position: "absolute", left: -34, top: 7, width: 11, height: 11, borderRadius: "50%", background: C.bg, border: `2px solid ${C.accent}`, boxShadow: `0 0 0 4px ${C.accentLight}` }} />
                  <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 8 }}>
                    <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: 24, color: C.accentDark }}>{m.n}</span>
                    <h3 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(19px, 2vw, 23px)", color: C.ink, margin: 0 }}>{m.t}</h3>
                  </div>
                  <p style={{ fontFamily: SANS, fontSize: 14.5, lineHeight: 1.72, color: C.textMuted, margin: 0, maxWidth: 480 }}>{m.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHIE — split photo + liste ────────────────────────────── */}
      <section id="philosophie" className="i319-pad" style={{ background: C.bgAlt, padding: "clamp(76px, 9vw, 122px) 64px" }}>
        <div className="i319-split" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(36px, 5vw, 76px)", alignItems: "center" }}>
          <Reveal>
            {/* Repli soigné : aplat végétal + glow si la photo ne charge pas. */}
            <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", aspectRatio: "4/5", background: `linear-gradient(160deg, ${C.accentLight}, ${C.bgAlt})` }}>
              <div aria-hidden style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 30% 25%, ${C.leaf} 0%, transparent 55%)`, opacity: 0.12 }} />
              <img src={photo(0, PHOTO_FALLBACK[0])} alt="Produits d'entretien naturels" loading="lazy" style={{ position: "relative", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <span aria-hidden style={{ position: "absolute", left: 18, bottom: 18, width: 54, height: 54, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", color: C.white }}>
                <Leaf size={22} aria-hidden />
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              <Kicker>Notre philosophie</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1.08, color: C.ink, margin: "16px 0 20px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "section-4.titre") ?? (<>L'alliance de l'efficacité et de <em style={{ fontStyle: "italic", color: C.accentDark }}>l'écologie</em>.</>)}
              </h2>
              <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 15.5, lineHeight: 1.78, color: C.textMuted, margin: "0 0 26px", maxWidth: 500 }}>
                {c?.aboutText ?? "Nous croyons fermement qu'il n'est pas nécessaire d'utiliser des produits chimiques agressifs pour obtenir un résultat impeccable. Au contraire, la nature nous offre tout ce dont nous avons besoin pour nettoyer, assainir et parfumer nos intérieurs."}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 13 }}>
                {/* LISTE_LIBELLES */ (clientList(sessionData, "bloc.liste1") ?? LISTE_PHILOSOPHIE).map((item, idx) => (
                  <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <CheckCircle2 size={18} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden />
                    <span style={{ fontFamily: SANS, fontSize: 15, color: C.ink, lineHeight: 1.6 }}>{item}</span>
                  </li>
                ))}
              </ul>
              <motion.a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.accent, color: C.white, borderRadius: 999, padding: "15px 30px", fontWeight: 600, fontSize: 14.5, textDecoration: "none", boxShadow: "0 10px 26px rgba(77,124,15,0.24)" }} whileHover={{ scale: 1.03, y: -2 }}>
                Parlons de votre projet <ArrowRight size={15} aria-hidden />
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CHIFFRES + AVIS EN SPOTLIGHT — le bloc sombre végétal ────────── */}
      <section className="i319-pad" style={{ background: C.bgDark, padding: "clamp(76px, 9vw, 122px) 64px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", top: "-20%", right: "-8%", width: "50vw", height: "50vw", borderRadius: "50%", background: `radial-gradient(circle, ${C.leaf} 0%, transparent 60%)`, opacity: 0.1, pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", bottom: "-24%", left: "-10%", width: "44vw", height: "44vw", borderRadius: "50%", background: `radial-gradient(circle, ${C.leaf} 0%, transparent 62%)`, opacity: 0.09, pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div className="i319-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 0, marginBottom: "clamp(48px, 7vw, 84px)" }}>
            {STATS.map((s, idx) => (
              <Reveal key={s.label} delay={idx * 0.08}>
                <div className="i319-statcell" style={{ padding: "6px 22px", borderLeft: idx > 0 ? "1px solid rgba(246,248,242,0.12)" : "none", textAlign: "center" }}>
                  <div style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(26px, 3vw, 40px)", lineHeight: 1.05, color: "#f6f8f2" }}>{s.value}</div>
                  <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(246,248,242,0.5)", marginTop: 8 }}>{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <Kicker tone="dark" center>Ils respirent mieux</Kicker>
            <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(26px, 3.6vw, 44px)", lineHeight: 1.08, color: "#f6f8f2", textAlign: "center", margin: "16px 0 clamp(28px, 4vw, 44px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "section-6.titre") ?? (<>Ce qu'ils disent <em style={{ fontStyle: "italic", color: C.leaf }}>de nous</em></>)}
            </h2>
          </Reveal>

          {/* Spotlight rotatif : une citation à la fois, pilotée par useSlides. */}
          <div className="i319-spot" style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", padding: "clamp(30px, 4vw, 54px) clamp(24px, 5vw, 64px)", border: "1px solid rgba(246,248,242,0.12)", borderRadius: 22, background: "rgba(246,248,242,0.04)", backdropFilter: "blur(4px)", position: "relative" }}>
            <Quote size={30} color={C.leaf} style={{ opacity: 0.55, marginBottom: 16 }} aria-hidden />
            <AnimatePresence mode="wait">
              <motion.figure
                key={avisI}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.7, ease: EASE }}
                style={{ margin: 0 }}
              >
                <blockquote style={{ margin: 0 }}>
                  <p style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(17px, 2vw, 22px)", lineHeight: 1.62, color: "rgba(246,248,242,0.9)", margin: "0 0 22px" }}>
                    "{avis.texte}"
                  </p>
                </blockquote>
                <figcaption>
                  <div style={{ display: "flex", gap: 3, justifyContent: "center", marginBottom: 10 }}>
                    {[...Array(5)].map((_, j) => <Star key={j} size={13} fill={C.leaf} color={C.leaf} aria-hidden />)}
                  </div>
                  <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 14.5, color: "#f6f8f2" }}>{avis.auteur}</div>
                  <div style={{ fontFamily: SANS, fontSize: 12, color: "rgba(246,248,242,0.5)", marginTop: 3 }}>{avis.detail}</div>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginTop: 26 }}>
              <SlideIndex i={avisI % AVIS.length} total={AVIS.length} variant="fraction" color="rgba(246,248,242,0.55)" className="" />
              <HairlineArrows onPrev={avisPrev} onNext={avisNext} color="rgba(246,248,242,0.75)" labels={{ prev: "Avis précédent", next: "Avis suivant" }} className="" />
            </div>
          </div>
        </div>
      </section>

      {/* ── RÉALISATIONS — mosaïque (URLs du thème conservées) ───────────── */}
      <section id="realisations" className="i319-pad" style={{ background: C.bg, padding: "clamp(76px, 9vw, 118px) 64px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 18, marginBottom: "clamp(28px, 4vw, 48px)" }}>
              <div>
                <Kicker>Nos réalisations</Kicker>
                <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(28px, 3.8vw, 46px)", lineHeight: 1.08, color: C.ink, margin: "16px 0 0" }}>
                  {/* TEXTE_SECTION */ clientText(sessionData, "section-5.titre") ?? (<>Avant, pendant, <em style={{ fontStyle: "italic", color: C.accentDark }}>après</em>.</>)}
                </h2>
              </div>
              <span style={{ fontFamily: SANS, fontSize: 12.5, color: C.textFaint }}>Intérieurs entretenus aux produits naturels</span>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 16 }}>
            {[
              { i: 4, repli: PHOTO_FALLBACK[4], alt: "Salle de bain assainie" },
              { i: 5, repli: PHOTO_FALLBACK[5], alt: "Cuisine entretenue au naturel" },
              { i: 6, repli: PHOTO_FALLBACK[6], alt: "Pièce à vivre propre et lumineuse" },
              { i: 7, repli: PHOTO_FALLBACK[7], alt: "Intérieur résidentiel entretenu" },
            ].map((ph, idx) => (
              <Reveal key={ph.i} delay={idx * 0.08}>
                <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", aspectRatio: "4/5", background: `linear-gradient(150deg, ${C.accentLight}, ${C.bgAlt})`, marginTop: idx % 2 === 1 ? 26 : 0 }}>
                  <img src={photo(ph.i, ph.repli)} alt={ph.alt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="i319-pad" style={{ background: C.bgAlt, padding: "clamp(72px, 9vw, 112px) 64px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <Reveal>
            <Kicker center>Questions fréquentes</Kicker>
            <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(26px, 3.6vw, 42px)", lineHeight: 1.08, color: C.ink, textAlign: "center", margin: "16px 0 clamp(28px, 4vw, 44px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "section-7.titre") ?? (<>Tout savoir sur notre <em style={{ fontStyle: "italic", color: C.accentDark }}>approche</em></>)}
            </h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {FAQ.map((item, idx) => (
              <Reveal key={idx} delay={idx * 0.05} y={14}>
                <FaqItem item={item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <section id="contact" className="i319-pad" style={{ background: C.bg, padding: "clamp(76px, 9vw, 122px) 64px" }}>
        <div className="i319-split" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,0.9fr) minmax(0,1.1fr)", gap: "clamp(36px, 5vw, 76px)" }}>
          <Reveal>
            <div>
              <Kicker>Contact</Kicker>
              <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1.08, color: C.ink, margin: "16px 0 18px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>Prêt pour un intérieur <em style={{ fontStyle: "italic", color: C.accentDark }}>plus sain</em> ?</>)}
              </h2>
              <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 15, lineHeight: 1.75, color: C.textMuted, margin: "0 0 36px", maxWidth: 420 }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.texte") ?? (<>Discutons de vos besoins d'entretien. Remplissez le formulaire ou contactez-nous directement, nous vous répondrons dans les plus brefs délais.</>)}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  { icon: Phone, label: "Téléphone", value: phone, href: telHref },
                  { icon: Mail, label: "E-mail", value: mail, href: `mailto:${mail}` },
                  { icon: MapPin, label: "Adresse", value: adresse },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} style={{ display: "flex", gap: 15, alignItems: "center" }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", color: C.accentDark, flexShrink: 0 }}>
                        <Icon size={17} aria-hidden />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.16em", textTransform: "uppercase", color: C.textFaint }}>{item.label}</div>
                        {item.href ? (
                          <a href={item.href} style={{ fontFamily: SANS, fontWeight: 600, fontSize: 15, color: C.ink, textDecoration: "none" }}>{item.value}</a>
                        ) : (
                          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 15, color: C.ink }}>{item.value}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <form
              onSubmit={(e) => e.preventDefault()}
              style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 20, padding: "clamp(26px, 3.4vw, 42px)", display: "flex", flexDirection: "column", gap: 18, boxShadow: "0 24px 60px rgba(35,41,25,0.06)" }}
            >
              <div className="i319-split" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 18 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, color: C.ink }}>Nom complet</label>
                  <input type="text" placeholder="Jean Dupont" style={{ padding: "13px 16px", borderRadius: 10, border: `1px solid ${C.border}`, fontFamily: SANS, fontSize: 14.5, outline: "none", background: C.bg, color: C.ink }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, color: C.ink }}>Téléphone</label>
                  <input type="tel" placeholder="06 20 51 13 32" style={{ padding: "13px 16px", borderRadius: 10, border: `1px solid ${C.border}`, fontFamily: SANS, fontSize: 14.5, outline: "none", background: C.bg, color: C.ink }} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, color: C.ink }}>Email</label>
                <input type="email" placeholder="jean@exemple.com" style={{ padding: "13px 16px", borderRadius: 10, border: `1px solid ${C.border}`, fontFamily: SANS, fontSize: 14.5, outline: "none", background: C.bg, color: C.ink }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, color: C.ink }}>Service souhaité</label>
                <select style={{ padding: "13px 16px", borderRadius: 10, border: `1px solid ${C.border}`, fontFamily: SANS, fontSize: 14.5, outline: "none", background: C.bg, color: C.ink }}>
                  {SERVICES.map((s) => (
                    <option key={s.titre}>{s.titre}</option>
                  ))}
                  <option>Autre demande</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, color: C.ink }}>Message (optionnel)</label>
                <textarea rows={4} placeholder="Détaillez votre besoin…" style={{ padding: "13px 16px", borderRadius: 10, border: `1px solid ${C.border}`, fontFamily: SANS, fontSize: 14.5, outline: "none", resize: "vertical", background: C.bg, color: C.ink }} />
              </div>
              <motion.button type="submit" style={{ background: C.accent, color: C.white, border: "none", borderRadius: 999, padding: "16px 30px", fontFamily: SANS, fontWeight: 600, fontSize: 15, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 4, boxShadow: "0 10px 26px rgba(77,124,15,0.24)" }} whileHover={{ scale: 1.02 }}>
                Envoyer la demande <ArrowRight size={16} aria-hidden />
              </motion.button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="i319-pad" style={{ background: C.bgDark, padding: "clamp(48px, 6vw, 68px) 64px 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 36 }}>
            <div style={{ maxWidth: 320 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
                <Leaf size={18} color={C.leaf} aria-hidden />
                <span style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 19, color: "#f6f8f2" }}>{nom}</span>
              </div>
              <p style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.75, color: "rgba(246,248,242,0.45)", margin: 0 }}>
                Votre partenaire de confiance pour un intérieur impeccable, sain et respectueux de l'environnement · {clientCodePostalVille(sessionData) ?? ville}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <span style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(246,248,242,0.55)", fontWeight: 700 }}>Navigation</span>
              {NAV.map(({ l, h }) => (
                <a key={l} href={h} style={{ fontFamily: SANS, fontSize: 13, color: "rgba(246,248,242,0.45)", textDecoration: "none", padding: "2px 0" }}>{l}</a>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <span style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(246,248,242,0.55)", fontWeight: 700 }}>Contact</span>
              <div style={{ display: "flex", gap: 9, alignItems: "center", color: "rgba(246,248,242,0.45)", fontSize: 13 }}>
                <MapPin size={13} color={C.leaf} aria-hidden /> {adresse}
              </div>
              <a href={telHref} style={{ display: "flex", gap: 9, alignItems: "center", color: "rgba(246,248,242,0.45)", fontSize: 13, textDecoration: "none" }}>
                <Phone size={13} color={C.leaf} aria-hidden /> {phone}
              </a>
              <a href={`mailto:${mail}`} style={{ display: "flex", gap: 9, alignItems: "center", color: "rgba(246,248,242,0.45)", fontSize: 13, textDecoration: "none" }}>
                <Mail size={13} color={C.leaf} aria-hidden /> {mail}
              </a>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(246,248,242,0.1)", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontFamily: SANS, fontSize: 12, color: "rgba(246,248,242,0.35)" }}>
              © {new Date().getFullYear()} {nom} — Site réalisé par Aevia WS · SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
              {/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span style={{ fontFamily: SANS, fontSize: 12, color: "rgba(246,248,242,0.35)" }}>Mentions légales : éditeur {nom} · hébergement Vercel Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
