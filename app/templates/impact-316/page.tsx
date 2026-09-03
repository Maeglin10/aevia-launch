"use client";
// @ts-nocheck

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle,
  ChevronDown,
  ClipboardCheck,
  Globe,
  Layers,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DifferentialExit } from "@/lib/templates/hero-kit-3";
import {
  clientAddress,
  clientCertifications,
  clientCity,
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

/* ════════════════════════════════════════════════════════════════════════════
   {clientName(sessionData) ?? "Pro-Nettoyage SERVICES"} — Nettoyage professionnel B2B (bureaux, copropriétés).
   Réécriture premium : héros H9 double colonne + rail de stats vertical,
   geste DifferentialExit (trois plans, trois vitesses au défilement),
   services en rangées éditoriales à filet, chiffres fantômes.
   Fontes : Spectral (serif) × IBM Plex Sans. Palette #f4f6f8 / #22577a.
   ════════════════════════════════════════════════════════════════════════════ */

const C = {
  bg: "#f4f6f8",
  bgAlt: "#e9edf2",
  bgDark: "#101c26",
  bgDarkAlt: "#0b141c",
  bgCard: "#ffffff",
  accent: "var(--brand,#22577a)",
  accentDark: "var(--brand-light,#173d57)",
  accentLight: "#d7e3ed",
  ink: "#12202c",
  textMuted: "#41556a",
  textFaint: "#7d8fa2",
  border: "#d3dce4",
  white: "#ffffff",
  mint: "#2d8a63",
} as const;

const SERIF = "'Spectral', Georgia, serif" as const;
const SANS = "'IBM Plex Sans', system-ui, sans-serif" as const;
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Photos — URLs existantes du thème, jamais de nouvelle URL ───────────── */
function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}
const P_ABOUT = "https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=1600&auto=format&fit=crop";
const P_G1 = "https://images.pexels.com/photos/34516664/pexels-photo-34516664.jpeg?auto=compress&cs=tinysrgb&w=1600";
const P_G2 = "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop";
const P_G3 = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop";
const P_G4 = "https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=800&auto=format&fit=crop";

/* ── Données de démonstration (contenu rédactionnel conservé) ────────────── */
const STATS_SOURCE = [
  { value: "350+", label: "Clients B2B actifs" },
  { value: "1.2M", label: "m² nettoyés / mois" },
  { value: "16 ans", label: "d'expérience" },
  { value: "ISO", label: "14001 certifié" },
];
let STATS = STATS_SOURCE;

const SERVICES_SOURCE = [
  { icon: Building2, num: "01", title: "Nettoyage de Bureaux", desc: "Entretien quotidien ou hebdomadaire de vos open-spaces, salles de réunion et espaces communs." },
  { icon: Layers, num: "02", title: "Copropriétés", desc: "Parties communes, halls d'entrée, escaliers, locaux poubelles. Contrat sur mesure." },
  { icon: Globe, num: "03", title: "Vitrerie Professionnelle", desc: "Nettoyage intérieur et extérieur de baies vitrées, façades, verrières de grande hauteur." },
  { icon: ShieldCheck, num: "04", title: "Désinfection", desc: "Protocole virucide certifié EN 14476 pour bureaux, salles d'attente et espaces médicaux." },
  { icon: Sparkles, num: "05", title: "Remise en État", desc: "Nettoyage après travaux, fin de bail, déménagement. Restitution à l'état d'origine." },
  { icon: ClipboardCheck, num: "06", title: "Audit & Qualité", desc: "Contrôles qualité réguliers, reporting mensuel, interlocuteur dédié. Certification ISO 14001." },
];
let SERVICES = SERVICES_SOURCE;

const METHODE_SOURCE = [
  { step: "01", title: "Audit gratuit", desc: "Visite de vos locaux, analyse des besoins et cahier des charges personnalisé." },
  { step: "02", title: "Devis détaillé", desc: "Proposition claire, transparente et sans engagement sous 48h." },
  { step: "03", title: "Mise en place", desc: "Équipe dédiée, planning adapté à vos horaires, clés en main." },
  { step: "04", title: "Suivi qualité", desc: "Contrôles réguliers, reporting mensuel et ajustements continus." },
];

const ENGAGEMENTS_SOURCE = [
  "Certification ISO 14001",
  "Contrôle qualité mensuel",
  "Personnel formé & déclaré",
  "Assurance RC Pro incluse",
  "Interlocuteur dédié",
];
let ENGAGEMENTS = ENGAGEMENTS_SOURCE;

function AVIS_SOURCE_LIVE() {
  return [
    { name: "Laurent P.", role: "Directeur Général, TechCorp " + (clientCity(sessionData) ?? "Paris"), text: `${clientName(sessionData) ?? "Pro-Nettoyage"} assure l'entretien de nos 2 000 m² de bureaux depuis 3 ans. Fiabilité exemplaire, équipes discrètes et résultats constants.`, detail: "Bureaux · contrat 3 ans" },
    { name: "Nathalie F.", role: "Syndic, Résidence Les Érables", text: "Les parties communes n'ont jamais été aussi propres. Les résidents sont unanimes. Le reporting mensuel est un vrai plus.", detail: "Copropriété" },
    { name: "Stéphane R.", role: "DRH, Cabinet Juridique Bordeaux", text: "Passage quotidien impeccable, équipe stable et professionnelle. Notre cabinet a un standing irréprochable grâce à leur travail.", detail: "Passage quotidien" },
  ];
}
let AVIS_SOURCE = AVIS_SOURCE_LIVE();
let AVIS = AVIS_SOURCE;

const FAQ_SOURCE = [
  { q: "Quelle est la durée minimum d'engagement ?", a: "Nos contrats sont flexibles. Nous proposons des engagements de 3, 6 ou 12 mois avec des conditions avantageuses pour les contrats annuels. Un préavis de 30 jours suffit." },
  { q: "Intervenez-vous en dehors des heures de bureau ?", a: "Oui, nos équipes s'adaptent à vos horaires : interventions matinales dès 5h, en soirée après 19h ou le week-end. Aucun supplément pour les créneaux standards hors bureau." },
  { q: "Comment gérez-vous les accès et la sécurité ?", a: "Chaque agent signe une clause de confidentialité. Nous gérons les badges, clés et protocoles d'accès en coordination avec votre responsable sécurité." },
  { q: "Proposez-vous un suivi de qualité ?", a: "Absolument. Un responsable qualité effectue des contrôles mensuels. Vous recevez un rapport détaillé avec photos et scores de conformité." },
];

/* ════════════════════════════════════════════════════════════════════════════
   Primitives
   ════════════════════════════════════════════════════════════════════════════ */

/** Kicker : filet 40×1 px + capitales interlettrées. */
function Eyebrow({
  children,
  color = C.accent,
  align = "left",
}: {
  children: React.ReactNode;
  color?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        justifyContent: align === "center" ? "center" : "flex-start",
      }}
    >
      <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${color})`, opacity: 0.85, flexShrink: 0 }} />
      <span
        style={{
          fontFamily: SANS,
          fontSize: 10.5,
          letterSpacing: "0.36em",
          textTransform: "uppercase",
          color,
          fontWeight: 600,
        }}
      >
        {children}
      </span>
      {align === "center" && (
        <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${color}, transparent)`, opacity: 0.85, flexShrink: 0 }} />
      )}
    </div>
  );
}

function Reveal({
  children,
  delay = 0,
  y = 32,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  return (
    <motion.div
      ref={ref}
      style={style}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.95, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Bouton institutionnel, angle net, flèche qui avance. */
function CtaButton({
  children,
  href = "#devis",
  filled = true,
  onDark = false,
  type,
}: {
  children: React.ReactNode;
  href?: string;
  filled?: boolean;
  onDark?: boolean;
  type?: "submit";
}) {
  const [h, setH] = useState(false);
  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "15px 30px",
    fontFamily: SANS,
    fontSize: 12,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "none",
    border: `1px solid ${filled ? C.accent : onDark ? "rgba(255,255,255,0.4)" : C.accent}`,
    background: filled ? (h ? C.accentDark : C.accent) : h ? (onDark ? "rgba(255,255,255,0.1)" : "rgba(34,87,122,0.07)") : "transparent",
    color: filled ? C.white : onDark ? "rgba(255,255,255,0.92)" : C.accent,
    transform: h ? "translateY(-2px)" : "none",
    boxShadow: h
      ? "0 14px 34px -14px rgba(16,28,38,0.45), 0 3px 10px -4px rgba(16,28,38,0.25)"
      : "0 0 0 0 rgba(0,0,0,0)",
    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
  };
  const arrow = (
    <ArrowRight
      size={14}
      style={{ transform: h ? "translateX(5px)" : "none", transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}
    />
  );
  if (type === "submit") {
    return (
      <button type="submit" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={style}>
        {children}
        {arrow}
      </button>
    );
  }
  return (
    <a href={href} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={style}>
      {children}
      {arrow}
    </a>
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
        fontFamily: SANS,
        fontSize: 12.5,
        fontWeight: 500,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: h ? C.ink : C.textMuted,
        textDecoration: "none",
        transition: "color 0.35s",
        position: "relative",
        padding: "12px 2px",
      }}
    >
      {label}
      <span
        style={{
          position: "absolute",
          left: 0,
          bottom: 8,
          height: 1,
          width: h ? "100%" : "0%",
          background: C.accent,
          transition: "width 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   Nav — collante à 4 propriétés (padding, fond, flou, filet)
   ════════════════════════════════════════════════════════════════════════════ */
function Nav() {
  const [solid, setSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Prestations", href: "#services" },
    { label: "Méthode", href: "#methode" },
    { label: "Engagements", href: "#engagements" },
    { label: "Références", href: "#references" },
  ];

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 90,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: solid ? "12px clamp(20px,5vw,64px)" : "24px clamp(20px,5vw,64px)",
          background: solid ? "rgba(244,246,248,0.92)" : "transparent",
          backdropFilter: solid ? "blur(14px) saturate(140%)" : "none",
          WebkitBackdropFilter: solid ? "blur(14px) saturate(140%)" : "none",
          borderBottom: solid ? `1px solid ${C.border}` : "1px solid transparent",
          transition: "all 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <a href="#hero" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: 8, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 30, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <span style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, letterSpacing: "0.02em", color: C.ink, whiteSpace: "nowrap" }}>
                {clientName(sessionData) ?? "Pro-Nettoyage"}
              </span>
              <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.accent, fontWeight: 600 }}>
                {clientTrade(sessionData) ?? "Services"}
              </span>
            </>
          )}
        </a>
        <div className="i316-navlinks" style={{ display: "flex", alignItems: "center", gap: "clamp(18px,2.4vw,36px)" }}>
          {links.map((l) => (
            <NavLink key={l.label} label={l.label} href={l.href} />
          ))}
          <CtaButton href="#devis">Devis gratuit</CtaButton>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="i316-burger"
          aria-label="Menu"
          style={{
            display: "none",
            flexDirection: "column",
            justifyContent: "center",
            gap: 5,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 10,
            minWidth: 44,
            minHeight: 44,
          }}
        >
          <span style={{ width: 22, height: 1.5, background: C.ink, display: "block", transition: "transform 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ width: 22, height: 1.5, background: C.ink, display: "block", opacity: mobileOpen ? 0 : 1, transition: "opacity 0.3s" }} />
          <span style={{ width: 22, height: 1.5, background: C.ink, display: "block", transition: "transform 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </nav>
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: 58,
            left: 0,
            right: 0,
            zIndex: 89,
            background: "rgba(244,246,248,0.98)",
            borderBottom: `1px solid ${C.border}`,
            padding: "18px clamp(20px,5vw,48px) 26px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{ color: C.ink, textDecoration: "none", fontFamily: SANS, fontSize: 15, letterSpacing: "0.08em", textTransform: "uppercase", padding: "12px 0" }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#devis"
            onClick={() => setMobileOpen(false)}
            style={{ marginTop: 10, background: C.accent, color: C.white, textAlign: "center", textDecoration: "none", fontFamily: SANS, fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600, padding: "14px 24px" }}
          >
            Devis gratuit
          </a>
        </div>
      )}
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════════════ */
export default function Page() {
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
  AVIS_SOURCE = AVIS_SOURCE_LIVE();

  STATS = resolveList(
    clientStats(sessionData)?.map((s: any, i: number) => ({
      ...STATS_SOURCE[i % STATS_SOURCE.length],
      value: s.value,
      label: s.label,
    })),
    STATS_SOURCE,
  );
  SERVICES = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...SERVICES_SOURCE[i % SERVICES_SOURCE.length],
      num: String(i + 1).padStart(2, "0"),
      title: s.title ?? s.name ?? SERVICES_SOURCE[i % SERVICES_SOURCE.length].title,
      desc: s.description ?? s.desc ?? SERVICES_SOURCE[i % SERVICES_SOURCE.length].desc,
    })),
    SERVICES_SOURCE,
  );
  AVIS = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      ...AVIS_SOURCE[i % AVIS_SOURCE.length],
      name: r.name ?? r.author ?? AVIS_SOURCE[i % AVIS_SOURCE.length].name,
      text: r.text ?? r.quote ?? AVIS_SOURCE[i % AVIS_SOURCE.length].text,
      role: r.location ?? r.role ?? AVIS_SOURCE[i % AVIS_SOURCE.length].role,
    })),
    AVIS_SOURCE,
  );
  ENGAGEMENTS = resolveList(clientCertifications(sessionData), ENGAGEMENTS_SOURCE);

  const FAQ = resolveList(
    clientFaq(sessionData)?.map((f: any) => ({ q: f.q, a: f.a })),
    FAQ_SOURCE,
  );

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [hoverService, setHoverService] = useState<number | null>(null);
  const [hoverGal, setHoverGal] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) setFormSubmitted(true);
  };

  const phone = clientPhone(sessionData) ?? "+33 (0)1 00 00 00 00";
  const telHref = `tel:${(clientPhone(sessionData) ?? "+33177307474").replace(/[\s().]/g, "")}`;
  const email = clientEmail(sessionData) ?? "commercial@pro-nettoyage.fr";
  const zone = clientAddress(sessionData) ?? fd?.city ?? "Île-de-France & Grand Ouest";

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, minHeight: "100dvh", overflowX: "clip", WebkitFontSmoothing: "antialiased" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        .i316-ease { transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
        @media (max-width: 900px) {
          .i316-navlinks { display: none !important; }
          .i316-burger { display: flex !important; }
        }
        @media (max-width: 880px) {
          .i316-hero { grid-template-columns: 1fr !important; gap: 44px !important; padding-top: 120px !important; }
          .i316-rail { border-left: none !important; border-top: 1px solid ${C.border}; padding-left: 0 !important; padding-top: 26px !important; flex-direction: row !important; flex-wrap: wrap; gap: 26px !important; }
          .i316-rail > div { flex: 1 1 40%; }
          .i316-split { grid-template-columns: 1fr !important; }
          .i316-srow { grid-template-columns: 48px 1fr !important; }
          .i316-srow .i316-sicon { display: none !important; }
          .i316-contact { grid-template-columns: 1fr !important; }
          .i316-footgrid { grid-template-columns: 1fr 1fr !important; }
          .i316-avis > * { margin-top: 0 !important; }
        }
        @media (max-width: 540px) {
          .i316-footgrid { grid-template-columns: 1fr !important; }
          .i316-formgrid { grid-template-columns: 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .i316-cue { display: none !important; }
          .i316-stamp { animation: none !important; }
        }
        @keyframes i316-spin { to { transform: rotate(360deg); } }
      `}</style>

      <Nav />

      {/* ════════ HERO — H9 : double colonne texte + rail de stats vertical ════════
          Geste : DifferentialExit — au défilement, le titre, le paragraphe et le
          rail ne partent pas à la même vitesse. Trois plans, trois rythmes. */}
      <section
        id="hero"
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          background: C.bg,
          overflow: "hidden",
          padding: "clamp(120px,16vh,180px) clamp(24px,6vw,96px) clamp(56px,8vh,96px)",
        }}
      >
        {/* Texture : quadrillage technique très pâle */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              `repeating-linear-gradient(90deg, rgba(34,87,122,0.045) 0 1px, transparent 1px 96px), repeating-linear-gradient(0deg, rgba(34,87,122,0.035) 0 1px, transparent 1px 96px)`,
            pointerEvents: "none",
          }}
        />
        {/* Chiffre fantôme — le fond, part lentement */}
        <DifferentialExit depth={0.05} style={{ position: "absolute", right: "-2%", bottom: "-4%", pointerEvents: "none", zIndex: 0 }}>
          <div
            aria-hidden
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(11rem,26vw,26rem)",
              lineHeight: 1,
              color: C.accent,
              opacity: 0.07,
              userSelect: "none",
              whiteSpace: "nowrap",
            }}
          >
            m²
          </div>
        </DifferentialExit>

        <div
          className="i316-hero"
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: 1240,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(0,1.5fr) minmax(0,0.6fr)",
            gap: "clamp(48px,6vw,96px)",
            alignItems: "center",
          }}
        >
          {/* Colonne texte — premier plan, part vite */}
          <div>
            <DifferentialExit depth={0.9}>
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}>
                <Eyebrow>{clientEyebrow(sessionData) ?? "Nettoyage professionnel · B2B"}</Eyebrow>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 44 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.16 }}
                style={{
                  fontFamily: SERIF,
                  fontWeight: 500,
                  fontSize: "clamp(2.7rem,6.2vw,5.6rem)",
                  lineHeight: 0.99,
                  letterSpacing: "-0.015em",
                  color: C.ink,
                  margin: "clamp(20px,2.6vw,34px) 0 clamp(18px,2.2vw,28px)",
                  maxWidth: "16ch",
                }}
              >{/* ACCROCHE */ (clientHeroLine(sessionData, 0, 2, 18) != null) ? (<>
                {clientHeroLine(sessionData, 0, 2, 18)}
                <br />
                {clientHeroLine(sessionData, 1, 2, 18)}
              </>) : (<>
                L&apos;excellence au service de vos espaces{" "}
                <em style={{ fontStyle: "italic", color: C.accent }}>professionnels</em>.
              </>)}</motion.h1>
            </DifferentialExit>

            <DifferentialExit depth={0.55}>
              <motion.p
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.05, ease: EASE, delay: 0.4 }}
                style={{
                  fontFamily: SANS,
                  fontWeight: 300,
                  fontSize: "clamp(1rem,1.6vw,1.2rem)",
                  lineHeight: 1.72,
                  color: C.textMuted,
                  maxWidth: 500,
                  margin: "0 0 clamp(28px,3.6vw,44px)",
                }}
              >
                {c?.heroSubline ?? clientHeroSubtitle(sessionData) ?? "Nettoyage de bureaux, copropriétés et locaux commerciaux. Équipes formées, certifiées et engagées pour un résultat irréprochable."}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: EASE, delay: 0.58 }}
                style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
              >
                <CtaButton href="#devis">Demander un devis</CtaButton>
                <CtaButton href="#services" filled={false}>Nos prestations</CtaButton>
              </motion.div>
            </DifferentialExit>
          </div>

          {/* Rail de stats vertical — plan intermédiaire */}
          <DifferentialExit depth={0.25}>
            <motion.div
              className="i316-rail"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.5 }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(24px,3.4vh,40px)",
                borderLeft: `1px solid ${C.border}`,
                paddingLeft: "clamp(24px,2.6vw,40px)",
                position: "relative",
              }}
            >
              {STATS.map((s, i) => (
                <div key={s.label + i}>
                  <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(1.9rem,3vw,2.6rem)", lineHeight: 1, color: C.accent, letterSpacing: "-0.01em" }}>
                    {s.value}
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.textFaint, marginTop: 8, fontWeight: 500 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </DifferentialExit>
        </div>

        {/* Cue défilement */}
        <div
          className="i316-cue"
          style={{
            position: "absolute",
            bottom: 26,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            color: C.textFaint,
            fontSize: 10,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            zIndex: 3,
          }}
        >
          <span>Défiler</span>
          <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}>
            <ChevronDown size={15} color={C.accent} strokeWidth={1.5} />
          </motion.div>
        </div>
      </section>

      {/* ════════ RESPIRATION — une phrase serif italique ════════ */}
      <section style={{ background: C.bgAlt, padding: "clamp(88px,12vw,168px) clamp(24px,8vw,160px)", textAlign: "center" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <Eyebrow color={C.textMuted} align="center">Notre philosophie</Eyebrow>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(1.5rem,3.2vw,2.9rem)",
              lineHeight: 1.38,
              color: C.ink,
              maxWidth: 940,
              margin: "0 auto",
            }}
          >{/* TEXTE_SECTION */ clientText(sessionData, "philosophie.texte") ?? (<>
            Des locaux impeccables, des équipes stables,{" "}
            <span style={{ color: C.accent }}>un interlocuteur unique</span>.
          </>)}</p>
        </Reveal>
        <Reveal delay={0.2}>
          <div style={{ width: 1, height: 76, background: `linear-gradient(${C.accent}, transparent)`, margin: "48px auto 0" }} />
        </Reveal>
      </section>

      {/* ════════ SERVICES — rangées éditoriales numérotées à filet ════════ */}
      <section id="services" style={{ background: C.bg, padding: "clamp(88px,12vw,160px) clamp(24px,6vw,96px)" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <Reveal>
            <Eyebrow>Nos prestations B2B</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontWeight: 500,
                fontSize: "clamp(1.9rem,4.4vw,3.8rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.01em",
                color: C.ink,
                margin: "20px 0 14px",
                maxWidth: "22ch",
              }}
            >{/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>
              Des solutions sur mesure pour chaque{" "}
              <em style={{ fontStyle: "italic", color: C.accent }}>espace</em>
            </>)}</h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: "clamp(0.95rem,1.4vw,1.1rem)", lineHeight: 1.75, color: C.textMuted, maxWidth: 500, margin: "0 0 clamp(40px,5vw,64px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "services.texte") ?? (<>
              Bureaux, commerces, copropriétés ou établissements de santé — nous adaptons nos protocoles à chaque environnement.
              </>)}
            </p>
          </Reveal>

          <div>
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              const on = hoverService === i;
              return (
                <Reveal key={s.num + s.title} delay={i * 0.05}>
                  <div
                    className="i316-srow"
                    onMouseEnter={() => setHoverService(i)}
                    onMouseLeave={() => setHoverService(null)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "clamp(56px,8vw,110px) 1fr auto",
                      gap: "clamp(16px,3vw,44px)",
                      alignItems: "center",
                      padding: "clamp(24px,3.2vw,40px) clamp(10px,1.4vw,20px)",
                      borderTop: `1px solid ${C.border}`,
                      borderImage: on ? `linear-gradient(90deg, ${C.accent}, transparent 70%) 1` : undefined,
                      background: on ? C.bgCard : "transparent",
                      transform: on ? "translateX(8px)" : "none",
                      boxShadow: on
                        ? "0 26px 54px -34px rgba(16,28,38,0.35), 0 4px 14px -8px rgba(16,28,38,0.12)"
                        : "none",
                      transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                      cursor: "default",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: SERIF,
                        fontStyle: "italic",
                        fontWeight: 300,
                        fontSize: "clamp(1.5rem,2.6vw,2.2rem)",
                        color: on ? C.accent : C.textFaint,
                        lineHeight: 1,
                        transition: "color 0.45s",
                      }}
                    >
                      {s.num}
                    </span>
                    <div>
                      <h3 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(1.15rem,1.8vw,1.5rem)", color: C.ink, margin: "0 0 8px", lineHeight: 1.2 }}>
                        {s.title}
                      </h3>
                      <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 14.5, lineHeight: 1.68, color: C.textMuted, margin: 0, maxWidth: 560 }}>
                        {s.desc}
                      </p>
                    </div>
                    <span
                      className="i316-sicon"
                      style={{
                        width: 52,
                        height: 52,
                        display: "grid",
                        placeItems: "center",
                        border: `1px solid ${on ? C.accent : C.border}`,
                        color: on ? C.accent : C.textFaint,
                        borderRadius: "50%",
                        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                        transform: on ? "rotate(-8deg) scale(1.06)" : "none",
                      }}
                    >
                      <Icon size={20} strokeWidth={1.5} />
                    </span>
                  </div>
                </Reveal>
              );
            })}
            <div style={{ borderTop: `1px solid ${C.border}` }} />
          </div>
        </div>
      </section>

      {/* ════════ MÉTHODE — bande sombre, chiffres fantômes ════════ */}
      <section id="methode" style={{ background: C.bgDark, padding: "clamp(88px,12vw,160px) clamp(24px,6vw,96px)", position: "relative", overflow: "hidden" }}>
        {/* Glow radial discret */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "-30%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            height: "70%",
            background: "radial-gradient(ellipse, rgba(34,87,122,0.32) 0%, transparent 68%)",
            opacity: 0.35,
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: 1140, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Eyebrow color={C.accentLight} align="center">Notre processus</Eyebrow>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontWeight: 500,
                fontSize: "clamp(1.8rem,4vw,3.4rem)",
                lineHeight: 1.06,
                color: C.white,
                textAlign: "center",
                margin: "20px auto clamp(48px,6vw,80px)",
                maxWidth: "24ch",
              }}
            >{/* TEXTE_SECTION */ clientText(sessionData, "methode.titre") ?? (<>
              Du premier contact à l&apos;excellence{" "}
              <em style={{ fontStyle: "italic", color: C.accentLight }}>quotidienne</em>
            </>)}</h2>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(230px, 100%), 1fr))", gap: "clamp(18px,2.4vw,28px)" }}>
            {resolveList(fusionnerEtapes(METHODE_SOURCE, clientMethode(sessionData)), METHODE_SOURCE).map((m, i) => (
              <Reveal key={m.step} delay={i * 0.09}>
                <div
                  style={{
                    position: "relative",
                    padding: "clamp(26px,3vw,38px) clamp(20px,2.4vw,30px)",
                    borderTop: `1px solid rgba(215,227,237,0.18)`,
                    height: "100%",
                  }}
                >
                  {/* Chiffre fantôme */}
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 8,
                      fontFamily: SERIF,
                      fontStyle: "italic",
                      fontSize: "clamp(4.4rem,7vw,6.4rem)",
                      lineHeight: 1,
                      color: C.accentLight,
                      opacity: 0.08,
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >
                    {m.step}
                  </span>
                  <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: C.accentLight, fontWeight: 600, marginBottom: 16 }}>
                    Étape {m.step}
                  </div>
                  <h3 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(1.15rem,1.7vw,1.4rem)", color: C.white, margin: "0 0 10px" }}>
                    {m.title}
                  </h3>
                  <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 14, lineHeight: 1.7, color: "rgba(215,227,237,0.66)", margin: 0 }}>
                    {m.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ ENGAGEMENTS — split photo + garanties ════════ */}
      <section id="engagements" style={{ background: C.bg, padding: "clamp(88px,12vw,160px) clamp(24px,6vw,96px)" }}>
        <div
          className="i316-split"
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(0,0.92fr) minmax(0,1.08fr)",
            gap: "clamp(40px,6vw,96px)",
            alignItems: "center",
          }}
        >
          <Reveal y={46}>
            <div style={{ position: "relative", overflow: "hidden", aspectRatio: "4/5", background: C.bgDark }}>
              <img
                src={photo(0, P_ABOUT)}
                alt="Nos équipes en intervention"
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(16,28,38,0.72) 0%, rgba(16,28,38,0.08) 42%, transparent 70%)" }} />
              <div style={{ position: "absolute", left: 24, bottom: 22 }}>
                <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.3em", textTransform: "uppercase", color: C.accentLight, fontWeight: 600 }}>
                  Depuis 2008
                </div>
                <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(1.05rem,1.6vw,1.3rem)", color: C.white, marginTop: 6 }}>
                  Hygiène, rigueur, durabilité.
                </div>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <Eyebrow>Notre entreprise</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontWeight: 500,
                  fontSize: "clamp(1.8rem,3.8vw,3.2rem)",
                  lineHeight: 1.08,
                  color: C.ink,
                  margin: "20px 0 22px",
                }}
              >{/* TEXTE_SECTION */ clientText(sessionData, "engagements.titre") ?? (c?.aboutTitle ?? (<>
                Un partenaire de <em style={{ fontStyle: "italic", color: C.accent }}>confiance</em> pour vos locaux
              </>))}</h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: "clamp(0.95rem,1.4vw,1.08rem)", lineHeight: 1.78, color: C.textMuted, maxWidth: 500, margin: "0 0 14px" }}>
                {c?.aboutText ?? ((clientName(sessionData) ?? "Pro-Nettoyage") + " Services accompagne les entreprises, syndics et collectivités dans l'entretien de leurs espaces. Notre engagement : des locaux impeccables, des équipes stables et un interlocuteur unique.")}
              </p>
              <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: "clamp(0.95rem,1.4vw,1.08rem)", lineHeight: 1.78, color: C.textMuted, maxWidth: 500, margin: "0 0 30px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "engagements.texte") ?? (<>
                Certifiés ISO 14001, nous utilisons des produits éco-responsables et des protocoles rigoureux pour garantir hygiène et durabilité.
                </>)}
              </p>
            </Reveal>
            <div>
              {ENGAGEMENTS.map((e, i) => (
                <Reveal key={i} delay={0.18 + i * 0.05}>
                  <div
                    style={{
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                      padding: "13px 0",
                      borderTop: i === 0 ? `1px solid ${C.border}` : `1px solid ${C.border}`,
                    }}
                  >
                    <span style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(45,138,99,0.12)", display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1 }}>
                      <Check size={13} color={C.mint} strokeWidth={2.4} />
                    </span>
                    <span style={{ fontFamily: SANS, fontSize: 15, color: C.ink, lineHeight: 1.55 }}>{e}</span>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.4}>
              <div style={{ marginTop: 30 }}>
                <CtaButton href="#devis">Demander un audit gratuit</CtaButton>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════ RÉALISATIONS ════════ */}
      <section style={{ background: C.bgAlt, padding: "clamp(80px,11vw,150px) clamp(24px,6vw,96px)" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "clamp(40px,5vw,60px)" }}>
            <Reveal>
              <Eyebrow align="center">Réalisations</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(1.8rem,3.8vw,3.2rem)", lineHeight: 1.08, color: C.ink, margin: "18px auto 0", maxWidth: "24ch" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "realisations.titre") ?? (<>
                Des espaces qui inspirent <em style={{ fontStyle: "italic", color: C.accent }}>confiance</em>
                </>)}
              </h2>
            </Reveal>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: "clamp(12px,1.6vw,20px)" }}>
            {[photo(1, P_G1), photo(2, P_G2), photo(3, P_G3), photo(4, P_G4)].map((src, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div
                  onMouseEnter={() => setHoverGal(i)}
                  onMouseLeave={() => setHoverGal(null)}
                  style={{
                    overflow: "hidden",
                    aspectRatio: "4/3",
                    position: "relative",
                    background: C.bgDark,
                    boxShadow: hoverGal === i
                      ? "0 30px 60px -30px rgba(16,28,38,0.45), 0 6px 18px -10px rgba(16,28,38,0.2)"
                      : "0 10px 30px -24px rgba(16,28,38,0.3)",
                    transform: hoverGal === i ? "translateY(-6px)" : "none",
                    transition: "all 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <img
                    src={src}
                    alt={`Réalisation ${i + 1}`}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      transform: hoverGal === i ? "scale(1.05)" : "scale(1)",
                      transition: "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(16,28,38,0.5), transparent 45%)", opacity: hoverGal === i ? 1 : 0.6, transition: "opacity 0.5s" }} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ RÉFÉRENCES — colonnes décalées ════════ */}
      <section id="references" style={{ background: C.bg, padding: "clamp(88px,12vw,160px) clamp(24px,6vw,96px)" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <Reveal>
            <Eyebrow>Références clients</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(1.8rem,4vw,3.4rem)", lineHeight: 1.06, color: C.ink, margin: "20px 0 clamp(40px,5vw,64px)", maxWidth: "20ch" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>
              Ce que disent nos <em style={{ fontStyle: "italic", color: C.accent }}>partenaires</em>
              </>)}
            </h2>
          </Reveal>
          <div className="i316-avis" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "clamp(20px,2.6vw,32px)", alignItems: "start" }}>
            {AVIS.map((t, i) => (
              <Reveal key={t.name + i} delay={i * 0.1} style={{ marginTop: i % 2 === 1 ? 44 : 0 }}>
                <figure
                  style={{
                    background: C.bgCard,
                    border: `1px solid ${C.border}`,
                    borderTop: `2px solid ${C.accent}`,
                    padding: "clamp(26px,3.2vw,40px)",
                    margin: 0,
                    boxShadow: "0 18px 50px -38px rgba(16,28,38,0.3)",
                    height: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.24em", textTransform: "uppercase", color: C.textFaint, marginBottom: 18, fontWeight: 600 }}>
                    {t.detail}
                  </div>
                  <blockquote
                    style={{
                      fontFamily: SERIF,
                      fontStyle: "italic",
                      fontWeight: 300,
                      fontSize: "clamp(1rem,1.5vw,1.18rem)",
                      lineHeight: 1.68,
                      color: C.ink,
                      margin: "0 0 24px",
                    }}
                  >
                    &ldquo;{t.text}&rdquo;
                  </blockquote>
                  <figcaption style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 15, color: C.accent }}>{t.name}</div>
                    <div style={{ fontFamily: SANS, fontSize: 12.5, color: C.textFaint, marginTop: 4 }}>{t.role}</div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ FAQ ════════ */}
      <section id="faq" style={{ background: C.bgAlt, padding: "clamp(80px,11vw,150px) clamp(24px,6vw,96px)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "clamp(36px,4.6vw,56px)" }}>
            <Reveal>
              <Eyebrow align="center">FAQ</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(1.7rem,3.6vw,3rem)", lineHeight: 1.08, color: C.ink, margin: "18px 0 0" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "faq.titre") ?? (<>
                Questions <em style={{ fontStyle: "italic", color: C.accent }}>fréquentes</em>
                </>)}
              </h2>
            </Reveal>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FAQ.map((item: any, i: number) => (
              <Reveal key={i} delay={i * 0.05}>
                <div style={{ background: C.bgCard, border: `1px solid ${expandedFaq === i ? C.accent : C.border}`, overflow: "hidden", transition: "border-color 0.4s" }}>
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    style={{
                      width: "100%",
                      padding: "clamp(18px,2.4vw,24px) clamp(18px,2.6vw,28px)",
                      background: "transparent",
                      border: "none",
                      textAlign: "left",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      gap: 12,
                      minHeight: 44,
                    }}
                  >
                    <span style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(0.98rem,1.5vw,1.15rem)", color: C.ink, lineHeight: 1.4 }}>{item.q}</span>
                    <ChevronDown
                      size={17}
                      style={{ transform: expandedFaq === i ? "rotate(180deg)" : "none", transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)", color: C.accent, flexShrink: 0 }}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {expandedFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ padding: "0 clamp(18px,2.6vw,28px) clamp(18px,2.4vw,24px)", fontFamily: SANS, fontWeight: 300, fontSize: 14.5, lineHeight: 1.72, color: C.textMuted }}>
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ DEVIS / CONTACT — section sombre, glow radial ════════ */}
      <section id="devis" style={{ background: C.bgDark, padding: "clamp(96px,13vw,180px) clamp(24px,6vw,96px)", position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "-24%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "70%",
            height: "60%",
            background: "radial-gradient(ellipse, rgba(34,87,122,0.35) 0%, transparent 70%)",
            opacity: 0.34,
            pointerEvents: "none",
          }}
        />
        {/* Détail gratuit : tampon circulaire ISO qui tourne lentement */}
        <div aria-hidden className="i316-stamp" style={{ position: "absolute", top: "clamp(28px,5vw,64px)", right: "clamp(20px,5vw,72px)", width: 108, height: 108, opacity: 0.4, animation: "i316-spin 34s linear infinite", pointerEvents: "none" }}>
          <svg viewBox="0 0 100 100" width="108" height="108">
            <defs>
              <path id="i316c" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
            </defs>
            <circle cx="50" cy="50" r="26" fill="none" stroke="rgba(215,227,237,0.35)" strokeWidth="0.6" />
            <text style={{ fontFamily: SANS, fontSize: 8.4, letterSpacing: 2.6, fill: "rgba(215,227,237,0.55)", textTransform: "uppercase" }}>
              <textPath href="#i316c">iso 14001 · qualité contrôlée · reporting mensuel ·</textPath>
            </text>
          </svg>
        </div>

        <div
          className="i316-contact"
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1140,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(0,0.95fr) minmax(0,1.05fr)",
            gap: "clamp(44px,6vw,96px)",
            alignItems: "start",
          }}
        >
          <div>
            <Reveal>
              <Eyebrow color={C.accentLight}>Contact commercial</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(1.9rem,4.2vw,3.6rem)", lineHeight: 1.05, color: C.white, margin: "20px 0 18px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
                Prêt à transformer vos <em style={{ fontStyle: "italic", color: C.accentLight }}>espaces</em> ?
                </>)}
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: "clamp(0.95rem,1.4vw,1.1rem)", lineHeight: 1.75, color: "rgba(215,227,237,0.72)", maxWidth: 460, margin: "0 0 36px" }}>
                Audit gratuit de vos locaux. Devis sous 48h. Sans engagement. Notre équipe commerciale vous recontacte sous 24h.
              </p>
            </Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { icon: <Phone size={17} />, label: "Téléphone", value: phone, href: telHref },
                { icon: <Mail size={17} />, label: "E-mail", value: email, href: `mailto:${email}` },
                { icon: <MapPin size={17} />, label: "Zone d'intervention", value: zone },
              ].map((item, i) => (
                <Reveal key={i} delay={0.2 + i * 0.06}>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <span style={{ width: 44, height: 44, borderRadius: "50%", border: "1px solid rgba(215,227,237,0.25)", display: "grid", placeItems: "center", color: C.accentLight, flexShrink: 0 }}>
                      {item.icon}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(215,227,237,0.5)", fontWeight: 600 }}>{item.label}</div>
                      {item.href ? (
                        <a href={item.href} style={{ fontFamily: SANS, fontSize: 15.5, color: C.white, fontWeight: 500, textDecoration: "none", overflowWrap: "anywhere" }}>{item.value}</a>
                      ) : (
                        <div style={{ fontFamily: SANS, fontSize: 15.5, color: C.white, fontWeight: 500 }}>{item.value}</div>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.14}>
            <div style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(215,227,237,0.16)", padding: "clamp(26px,3.6vw,44px)" }}>
              {formSubmitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: EASE }} style={{ textAlign: "center", padding: "24px 0" }}>
                  <CheckCircle size={44} color={C.accentLight} style={{ margin: "0 auto 16px", display: "block" }} />
                  <h3 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(1.3rem,2vw,1.6rem)", color: C.white, margin: "0 0 10px" }}>Demande envoyée !</h3>
                  <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 14.5, color: "rgba(215,227,237,0.7)", lineHeight: 1.7, margin: 0 }}>
                    Merci {formData.name}, notre équipe commerciale vous recontactera sous 24h pour organiser un audit gratuit de vos locaux.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <div className="i316-formgrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
                    {[
                      { label: "Nom & Prénom", key: "name", type: "text", required: true },
                      { label: "E-mail professionnel", key: "email", type: "email", required: true },
                      { label: "Entreprise", key: "company", type: "text", required: false },
                      { label: "Téléphone", key: "phone", type: "tel", required: false },
                    ].map((field) => (
                      <div key={field.key}>
                        <label htmlFor={`i316-${field.key}`} style={{ display: "block", fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accentLight, marginBottom: 6, fontWeight: 600 }}>
                          {field.label}
                        </label>
                        <input
                          id={`i316-${field.key}`}
                          type={field.type}
                          required={field.required}
                          value={(formData as any)[field.key]}
                          onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                          style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "13px 2px",
                            minHeight: 44,
                            background: "transparent",
                            border: "none",
                            borderBottom: "1px solid rgba(215,227,237,0.28)",
                            color: C.white,
                            fontFamily: SANS,
                            fontSize: 15,
                            outline: "none",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label htmlFor="i316-message" style={{ display: "block", fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accentLight, marginBottom: 6, fontWeight: 600 }}>
                      Décrivez votre besoin
                    </label>
                    <textarea
                      id="i316-message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Surface des locaux, fréquence souhaitée, horaires d'intervention…"
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "13px 2px",
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid rgba(215,227,237,0.28)",
                        color: C.white,
                        fontFamily: SANS,
                        fontSize: 15,
                        outline: "none",
                        resize: "vertical",
                        lineHeight: 1.6,
                      }}
                    />
                  </div>
                  <div>
                    <CtaButton type="submit">Envoyer ma demande</CtaButton>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer style={{ background: C.bgDarkAlt, padding: "clamp(56px,8vw,100px) clamp(24px,6vw,96px) 36px", borderTop: "1px solid rgba(34,87,122,0.35)" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div className="i316-footgrid" style={{ display: "grid", gridTemplateColumns: "1.4fr repeat(3, 1fr)", gap: "clamp(30px,4.6vw,56px)", marginBottom: "clamp(40px,5.6vw,64px)" }}>
            <div>
              <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 19, color: C.white }}>
                {clientName(sessionData) ?? "Pro-Nettoyage Services"}
              </div>
              <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 13.5, lineHeight: 1.7, color: "rgba(215,227,237,0.5)", marginTop: 14, maxWidth: 300 }}>
                {clientTrade(sessionData) ?? "Nettoyage professionnel B2B"}
                {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
              </p>
              {fd?.instagram && (
                <a href={fd.instagram} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 16, fontFamily: SANS, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: C.accentLight, textDecoration: "none" }}>
                  Instagram
                </a>
              )}
            </div>
            <div>
              <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.28em", textTransform: "uppercase", color: C.accentLight, fontWeight: 600, marginBottom: 18 }}>Navigation</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                {[
                  { label: "Prestations", href: "#services" },
                  { label: "Méthode", href: "#methode" },
                  { label: "Engagements", href: "#engagements" },
                  { label: "Références", href: "#references" },
                  { label: "Contact", href: "#devis" },
                ].map((l) => (
                  <a key={l.label} href={l.href} style={{ fontFamily: SANS, fontWeight: 300, fontSize: 13.5, color: "rgba(215,227,237,0.6)", textDecoration: "none" }}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.28em", textTransform: "uppercase", color: C.accentLight, fontWeight: 600, marginBottom: 18 }}>Horaires</div>
              <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 13.5, lineHeight: 1.75, color: "rgba(215,227,237,0.6)", margin: 0 }}>
                Interventions 5h–22h
                <br />
                Bureau Lun–Ven 8h30–18h
              </p>
            </div>
            <div>
              <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.28em", textTransform: "uppercase", color: C.accentLight, fontWeight: 600, marginBottom: 18 }}>Légal</div>
              <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 12.5, lineHeight: 1.8, color: "rgba(215,227,237,0.5)", margin: 0 }}>
                Éditeur : {clientName(sessionData) ?? "Aevia WS"}
                <br />
                SIREN <LegalIdentity fallback="852 546 225" kind="siren" />
                <br />
                Hébergeur : Vercel Inc.
              </p>
            </div>
          </div>
          <div
            style={{
              paddingTop: 22,
              borderTop: "1px solid rgba(215,227,237,0.1)",
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 10,
              fontFamily: SANS,
              fontSize: 12,
              color: "rgba(215,227,237,0.36)",
            }}
          >
            <span>
              © {new Date().getFullYear()} {clientName(sessionData) ?? "Pro-Nettoyage Services"}. Tous droits réservés.
              {/* VILLE_PIED */}
              {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span>Devis gratuit sous 48h · Audit sans engagement</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
