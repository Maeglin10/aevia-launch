"use client";
// @ts-nocheck

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  ChevronDown,
  Clock,
  Droplets,
  Home as HomeIcon,
  Mail,
  MapPin,
  Phone,
  Shield,
  Sparkles,
  Star,
  User,
} from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import { LegalIdentity } from "@/app/templates/LegalIdentity";
import { DWELL, HairlineArrows, SlideIndex, useSlides } from "@/lib/templates/hero-kit-2";
import { PanelDrop } from "@/lib/templates/hero-kit-3";
import {
  clientAddress,
  clientCity,
  clientEmail,
  clientEyebrow,
  clientFaq,
  clientHeroLine,
  clientHeroSubtitle,
  clientName,
  clientPhone,
  clientPhotos,
  clientReviews,
  clientServices,
  clientStats,
  clientTagline,
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

/* ════════════════════════════════════════════════════════════════════════════
   SPARKLE HOME / {clientName(sessionData) ?? "Ménage Dynamique"} — Nettoyage résidentiel.
   Réécriture premium : héros H1 split média droite, geste PanelDrop
   (le panneau descend comme un rideau vertical pendant que la photo change),
   services en bento, avis en marquee, calculateur d'estimation conservé.
   Fontes : DM Serif Display × DM Sans. Palette #faf7fc / #7c3aed.
   ════════════════════════════════════════════════════════════════════════════ */

const C = {
  bg: "#faf7fc",
  bgAlt: "#f2ecf9",
  bgDark: "#1d1430",
  bgDarkAlt: "#150e24",
  bgCard: "#ffffff",
  accent: "var(--brand,#7c3aed)",
  accentDark: "var(--brand-light,#5f2bb8)",
  accentLight: "#e9defc",
  ink: "#221a33",
  textMuted: "#5b5273",
  textFaint: "#948aa8",
  border: "#e3daf0",
  white: "#ffffff",
  gold: "#facc15",
} as const;

const SERIF = "'DM Serif Display', Georgia, serif" as const;
const SANS = "'DM Sans', system-ui, sans-serif" as const;
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Photos — URLs existantes du thème, jamais de nouvelle URL ───────────── */
function photo(i: number, repli: string): string {
  return fd?.photoUrls?.[i] || clientPhotos(sessionData)[i] || repli;
}
const P_HERO = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=2000";
const P_ABOUT = "https://images.pexels.com/photos/4239127/pexels-photo-4239127.jpeg?auto=compress&cs=tinysrgb&w=1000";
const P_SERV = [
  "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800",
];
const P_GAL = [
  "https://images.pexels.com/photos/6195194/pexels-photo-6195194.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600",
];

/* ── Données de démonstration (contenu rédactionnel conservé) ────────────── */
const SERVICES_SOURCE = [
  { icon: HomeIcon, title: "Nettoyage Résidentiel", desc: "Un intérieur étincelant pour votre confort au quotidien, avec des produits respectueux de l'environnement." },
  { icon: User, title: "Nettoyage Commercial", desc: "Des bureaux impeccables pour booster la productivité de vos équipes et l'image de votre entreprise." },
  { icon: Droplets, title: "Grand Ménage de Printemps", desc: "Un nettoyage en profondeur pour éliminer la poussière et les allergènes dans les moindres recoins." },
];
let SERVICES = SERVICES_SOURCE;

const AVIS_SOURCE = [
  { name: "Marie L.", text: "Une équipe dynamique et redoutablement efficace. Mon appartement n'a jamais été aussi propre !", role: "Cliente fidèle" },
  { name: "Julien D.", text: "Le service pour nos bureaux est exceptionnel. Ils sont discrets et le résultat est toujours parfait.", role: "Manager" },
  { name: "Sophie M.", text: "J'adore leur énergie. Le nettoyage est fait avec le sourire et le niveau de détail est impressionnant.", role: "Propriétaire" },
];
let AVIS = AVIS_SOURCE;

const STATS_SOURCE = [
  { value: "5+", label: "Années d'expérience" },
  { value: "1k+", label: "Espaces nettoyés" },
  { value: "100%", label: "Satisfaction" },
  { value: "24/7", label: "Support client" },
];
let STATS = STATS_SOURCE;

const AVANTAGES_SOURCE = [
  { icon: Shield, title: "Personnel de confiance", desc: "Tous nos agents sont rigoureusement sélectionnés et formés." },
  { icon: Clock, title: "Ponctualité garantie", desc: "Nous respectons votre emploi du temps à la minute près." },
  { icon: Droplets, title: "Produits écologiques", desc: "Des solutions respectueuses de votre santé et de l'environnement." },
];

const FAQ_SOURCE = [
  { q: "Fournissez-vous les produits de nettoyage ?", a: "Oui, nous apportons tout le matériel et les produits nécessaires, tous respectueux de l'environnement." },
  { q: "Dois-je être présent pendant le nettoyage ?", a: "Ce n'est pas obligatoire. Vous pouvez nous confier vos clés ou être présent selon votre préférence." },
  { q: "Comment modifier ou annuler un rendez-vous ?", a: "Vous pouvez modifier ou annuler gratuitement jusqu'à 24h avant l'intervention via votre espace client ou par téléphone." },
  { q: "Vos agents sont-ils assurés ?", a: "Absolument. Tous nos agents sont entièrement assurés en cas de dommage accidentel lors de la prestation." },
];

const FREQUENCY_LABELS: Record<string, string> = {
  weekly: "Hebdomadaire",
  biweekly: "Bimensuel",
  once: "Une seule fois",
};

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
    <div style={{ display: "flex", alignItems: "center", gap: 13, justifyContent: align === "center" ? "center" : "flex-start" }}>
      <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${color})`, opacity: 0.9, flexShrink: 0 }} />
      <span style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.34em", textTransform: "uppercase", color, fontWeight: 600 }}>
        {children}
      </span>
      {align === "center" && (
        <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${color}, transparent)`, opacity: 0.9, flexShrink: 0 }} />
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
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Bouton pilule, flèche qui avance, double ombre au survol. */
function Pill({
  children,
  href,
  filled = true,
  type,
  full = false,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  href?: string;
  filled?: boolean;
  type?: "submit";
  full?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const [h, setH] = useState(false);
  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    width: full ? "100%" : undefined,
    padding: "15px 30px",
    borderRadius: 999,
    fontFamily: SANS,
    fontSize: 14.5,
    fontWeight: 600,
    letterSpacing: "0.01em",
    cursor: disabled ? "not-allowed" : "pointer",
    textDecoration: "none",
    border: `1.5px solid ${C.accent}`,
    background: filled ? (h ? C.accentDark : C.accent) : h ? "rgba(124,58,237,0.08)" : "transparent",
    color: filled ? C.white : C.accent,
    transform: h && !disabled ? "translateY(-2px)" : "none",
    boxShadow: h && filled && !disabled
      ? "0 16px 32px -14px rgba(124,58,237,0.55), 0 4px 12px -6px rgba(34,26,51,0.18)"
      : "0 0 0 0 rgba(0,0,0,0)",
    opacity: disabled ? 0.6 : 1,
    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
  };
  const arrow = (
    <ArrowRight size={16} style={{ transform: h ? "translateX(5px)" : "none", transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }} />
  );
  if (type === "submit" || onClick) {
    return (
      <button type={type ?? "button"} disabled={disabled} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={style}>
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
        fontSize: 14,
        fontWeight: 500,
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
          bottom: 7,
          height: 2,
          borderRadius: 2,
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
    { label: "Services", href: "#services" },
    { label: "Tarifs", href: "#tarifs" },
    { label: "Avantages", href: "#avantages" },
    { label: "Témoignages", href: "#temoignages" },
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
          padding: solid ? "10px clamp(20px,5vw,64px)" : "22px clamp(20px,5vw,64px)",
          background: solid ? "rgba(250,247,252,0.92)" : "transparent",
          backdropFilter: solid ? "blur(14px) saturate(150%)" : "none",
          WebkitBackdropFilter: solid ? "blur(14px) saturate(150%)" : "none",
          borderBottom: solid ? `1px solid ${C.border}` : "1px solid transparent",
          transition: "all 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <a href="#hero" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? "logo"} style={{ height: 32, maxWidth: 160, objectFit: "contain", display: "block" }} />
          ) : (
            <>
              <span style={{ width: 36, height: 36, borderRadius: 11, background: C.accent, display: "grid", placeItems: "center", color: C.white, transform: "rotate(-8deg)", flexShrink: 0 }}>
                <Sparkles size={19} />
              </span>
              <span style={{ fontFamily: SERIF, fontSize: 21, color: C.ink, lineHeight: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {clientName(sessionData) ?? "Ménage Dynamique"}
              </span>
            </>
          )}
        </a>
        <div className="i317-navlinks" style={{ display: "flex", alignItems: "center", gap: "clamp(18px,2.6vw,38px)" }}>
          {links.map((l) => (
            <NavLink key={l.label} label={l.label} href={l.href} />
          ))}
          <Pill href="#contact">{c?.ctaPrimary ?? "Demander un devis"}</Pill>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="i317-burger"
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 10, minWidth: 44, minHeight: 44 }}
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
            background: "rgba(250,247,252,0.98)",
            borderBottom: `1px solid ${C.border}`,
            padding: "18px clamp(20px,5vw,48px) 26px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {links.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)} style={{ color: C.ink, textDecoration: "none", fontFamily: SANS, fontSize: 16, fontWeight: 500, padding: "12px 0" }}>
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            style={{ marginTop: 10, background: C.accent, color: C.white, textAlign: "center", textDecoration: "none", fontFamily: SANS, fontSize: 15, fontWeight: 600, padding: "14px 24px", borderRadius: 999 }}
          >
            {c?.ctaPrimary ?? "Demander un devis"}
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

  SERVICES = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...SERVICES_SOURCE[i % SERVICES_SOURCE.length],
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
  STATS = resolveList(
    clientStats(sessionData)?.map((s: any, i: number) => ({
      ...STATS_SOURCE[i % STATS_SOURCE.length],
      value: s.value,
      label: s.label,
    })),
    STATS_SOURCE,
  );
  const FAQ = resolveList(
    clientFaq(sessionData)?.map((f: any) => ({ q: f.q, a: f.a })),
    FAQ_SOURCE,
  );

  /* ── Calculateur d'estimation (section conservée du thème) ─────────────── */
  const [hours, setHours] = useState(2);
  const [frequency, setFrequency] = useState("weekly");
  /*
    Le taux horaire vient du client dès qu'il en a saisi un — mais seulement
    s'il est bien horaire. Une prestation facturée au forfait (« à partir de
    9 400 € ») multipliée par un nombre d'heures donnerait une estimation
    absurde, et l'estimation est ce que le visiteur retient. À défaut, le
    thème garde le sien.
  */
  const tauxClient = (() => {
    for (const s of clientServices(sessionData) ?? []) {
      const p = String(s.price ?? "");
      if (!/\/\s*h|heure|de l'heure/i.test(p)) continue;
      const n = parseFloat(p.replace(/\s/g, "").replace(",", ".").match(/\d+(\.\d+)?/)?.[0] ?? "");
      if (Number.isFinite(n) && n > 0) return n;
    }
    return null;
  })();
  const hourlyRate = tauxClient ?? 35;
  const calculateEstimate = () => {
    let rate = hourlyRate;
    if (frequency === "weekly") rate = hourlyRate * 0.9;
    if (frequency === "biweekly") rate = hourlyRate * 0.95;
    return (hours * rate).toFixed(2);
  };

  /* ── Formulaire de contact, relié au calculateur ───────────────────────── */
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) return;
    setContactLoading(true);
    setTimeout(() => {
      setContactLoading(false);
      setContactSent(true);
    }, 1400);
  };

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [hoverTile, setHoverTile] = useState<number | null>(null);
  const [hoverGal, setHoverGal] = useState<number | null>(null);

  const phone = clientPhone(sessionData) ?? "01 78 37 77 85";
  const telHref = `tel:${(clientPhone(sessionData) ?? "0178377785").replace(/[\s().]/g, "")}`;
  const email = clientEmail(sessionData) ?? "contact@menagedynamique.fr";
  const address = clientAddress(sessionData) ?? "123 Avenue de la Propreté, 75000 Paris";
  const tagline = clientTagline(sessionData) ?? c?.tagline ?? "Le nettoyage qui redonne vie à votre espace.";

  /* ── Diapositives du héros : la photo tourne avec la prestation ────────── */
  const HERO_SLIDES = SERVICES.slice(0, 3).map((s: any, i: number) => ({
    k: s.title,
    img: i === 0 ? photo(0, P_HERO) : photo(2 + (i % P_SERV.length), P_SERV[i % P_SERV.length]),
  }));
  const { i, next, prev } = useSlides(HERO_SLIDES.length, DWELL.normal);
  const S = HERO_SLIDES[i] ?? HERO_SLIDES[0];

  /* Patron de spans du bento : 7 / 5 / 5 / 7, en boucle. */
  const bentoSpan = (idx: number) => [7, 5, 5, 7][idx % 4];

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: SANS, minHeight: "100dvh", overflowX: "clip", WebkitFontSmoothing: "antialiased" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        @media (max-width: 900px) {
          .i317-navlinks { display: none !important; }
          .i317-burger { display: flex !important; }
        }
        @media (max-width: 880px) {
          .i317-hero { grid-template-columns: 1fr !important; gap: 44px !important; }
          .i317-bento { grid-template-columns: 1fr !important; }
          .i317-bento > * { grid-column: auto !important; min-height: 300px !important; }
          .i317-split { grid-template-columns: 1fr !important; }
          .i317-calc { grid-template-columns: 1fr !important; }
          .i317-contact { grid-template-columns: 1fr !important; }
          .i317-footgrid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 540px) {
          .i317-footgrid { grid-template-columns: 1fr !important; }
        }
        @keyframes i317-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .i317-marquee-track { animation: i317-marquee 42s linear infinite; }
        .i317-marquee:hover .i317-marquee-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .i317-marquee-track { animation: none !important; }
          .i317-marquee { overflow-x: auto !important; }
          .i317-float { animation: none !important; }
        }
        @keyframes i317-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      `}</style>

      <Nav />

      {/* ════════ HERO — H1 split média droite · geste PanelDrop ════════
          Le panneau photo descend comme un rideau vertical à chaque
          prestation ; un seul index pilote la photo et sa légende. */}
      <section
        id="hero"
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          padding: "clamp(120px,15vh,170px) clamp(24px,6vw,96px) clamp(48px,7vh,88px)",
          overflow: "hidden",
        }}
      >
        {/* Texture : bulles de savon en dégradés radiaux, sans image */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 12% 18%, rgba(124,58,237,0.07) 0 110px, transparent 111px), radial-gradient(circle at 85% 12%, rgba(250,204,21,0.09) 0 70px, transparent 71px), radial-gradient(circle at 74% 82%, rgba(124,58,237,0.05) 0 150px, transparent 151px)",
            pointerEvents: "none",
          }}
        />
        {/* Lettre fantôme */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: "-1%",
            bottom: "-9%",
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: "clamp(12rem,30vw,30rem)",
            lineHeight: 1,
            color: C.accent,
            opacity: 0.05,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          é
        </span>

        <div
          className="i317-hero"
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: 1240,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(0,1.08fr) minmax(0,0.92fr)",
            gap: "clamp(48px,6vw,90px)",
            alignItems: "center",
          }}
        >
          {/* Colonne texte */}
          <div>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease: EASE, delay: 0.05 }}>
              <Eyebrow>{clientEyebrow(sessionData) ?? "Nettoyage résidentiel & commercial"}</Eyebrow>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 42 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.15, ease: EASE, delay: 0.16 }}
              style={{
                fontFamily: SERIF,
                fontWeight: 400,
                fontSize: "clamp(2.7rem,6.4vw,5.4rem)",
                lineHeight: 0.99,
                letterSpacing: "-0.015em",
                color: C.ink,
                margin: "clamp(20px,2.6vw,32px) 0 clamp(16px,2vw,26px)",
                maxWidth: "15ch",
              }}
            >{/* ACCROCHE */ (clientHeroLine(sessionData, 0, 2, 17) != null) ? (<>
              {clientHeroLine(sessionData, 0, 2, 17)}
              <br />
              {clientHeroLine(sessionData, 1, 2, 17)}
            </>) : (<>
              L&apos;énergie de la propreté à votre{" "}
              <em style={{ fontStyle: "italic", color: C.accent }}>service</em>
            </>)}</motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: EASE, delay: 0.38 }}
              style={{
                fontFamily: SANS,
                fontWeight: 300,
                fontSize: "clamp(1rem,1.6vw,1.2rem)",
                lineHeight: 1.72,
                color: C.textMuted,
                maxWidth: 510,
                margin: "0 0 clamp(26px,3.4vw,40px)",
              }}
            >
              {clientHeroSubtitle(sessionData) ?? c?.heroSubtitle ?? "Des services de nettoyage résidentiels et commerciaux rapides, efficaces et éclatants pour un environnement toujours impeccable."}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: EASE, delay: 0.54 }}
              style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
            >
              <Pill href="#contact">{c?.ctaPrimary ?? "Demander un devis"}</Pill>
              <Pill href="#services" filled={false}>{c?.ctaSecondary ?? "Voir nos services"}</Pill>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: EASE, delay: 0.7 }}
              style={{ marginTop: "clamp(30px,4vw,44px)", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}
            >
              <div style={{ display: "flex" }}>
                {["ML", "JD", "AF", "PR"].map((ini, k) => (
                  <span
                    key={ini}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      border: `3px solid ${C.bg}`,
                      background: C.accentDark,
                      color: C.white,
                      display: "grid",
                      placeItems: "center",
                      fontFamily: SANS,
                      fontSize: 12,
                      fontWeight: 700,
                      marginLeft: k !== 0 ? -13 : 0,
                      zIndex: 10 - k,
                      position: "relative",
                    }}
                  >
                    {ini}
                  </span>
                ))}
              </div>
              <div>
                <div style={{ display: "flex", gap: 2 }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} fill={C.gold} color={C.gold} />
                  ))}
                </div>
                <span style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 500, color: C.textMuted }}>Plus de 500 clients satisfaits</span>
              </div>
            </motion.div>

            {/* Contrôles du rideau : un seul index pilote tout le héros */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0, ease: EASE, delay: 0.85 }}
              style={{ display: "flex", alignItems: "center", gap: 18, marginTop: "clamp(24px,3vw,36px)", flexWrap: "wrap" }}
            >
              <SlideIndex i={i} total={HERO_SLIDES.length} variant="fraction" color={C.textFaint} className="" />
              <span style={{ fontFamily: SANS, fontSize: 13, color: C.textMuted, maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                <strong style={{ color: C.ink, fontWeight: 600 }}>{S?.k}</strong>
              </span>
              <HairlineArrows onPrev={prev} onNext={next} color={C.ink} className="" />
            </motion.div>
          </div>

          {/* Panneau média — le rideau tombe, la photo change derrière */}
          <motion.div
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.15, ease: EASE, delay: 0.3 }}
            style={{ position: "relative" }}
          >
            {/* Cadre pointillé décalé — détail gratuit conservé du thème */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: -18,
                left: -18,
                right: 20,
                bottom: 20,
                border: `2px dashed ${C.accent}`,
                opacity: 0.55,
                borderRadius: 26,
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: "relative",
                zIndex: 1,
                borderRadius: 26,
                overflow: "hidden",
                aspectRatio: "4/5",
                background: C.bgDark,
                boxShadow: "0 32px 64px -24px rgba(34,26,51,0.35), 0 8px 24px -12px rgba(34,26,51,0.18)",
              }}
            >
              <PanelDrop index={i} direction="down" style={{ position: "absolute", inset: 0 }}>
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  <img
                    src={S?.img}
                    alt={`${clientName(sessionData) ?? "Ménage Dynamique"} — ${S?.k ?? "prestation"}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(29,20,48,0.6) 0%, rgba(29,20,48,0.05) 38%, transparent 60%)" }} />
                  <div style={{ position: "absolute", left: 22, bottom: 20, right: 22 }}>
                    <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", fontWeight: 600, marginBottom: 6 }}>
                      Prestation
                    </div>
                    <div style={{ fontFamily: SERIF, fontSize: "clamp(1.2rem,1.9vw,1.6rem)", color: C.white, lineHeight: 1.15 }}>{S?.k}</div>
                  </div>
                </div>
              </PanelDrop>
            </div>
            {/* Badge flottant conservé */}
            <div
              className="i317-float"
              style={{
                position: "absolute",
                bottom: 30,
                left: -20,
                zIndex: 2,
                background: C.white,
                padding: "16px 20px",
                borderRadius: 16,
                boxShadow: "0 14px 36px -16px rgba(34,26,51,0.3)",
                display: "flex",
                alignItems: "center",
                gap: 14,
                animation: "i317-float 3.4s ease-in-out infinite",
              }}
            >
              <span style={{ width: 46, height: 46, borderRadius: 12, background: C.accentLight, display: "grid", placeItems: "center", color: C.accent }}>
                <Sparkles size={24} />
              </span>
              <span>
                <span style={{ display: "block", fontFamily: SERIF, fontSize: 22, color: C.ink, lineHeight: 1 }}>100%</span>
                <span style={{ display: "block", fontFamily: SANS, fontSize: 13, color: C.textMuted, fontWeight: 500, marginTop: 3 }}>Garanti</span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════ RESPIRATION — une phrase serif italique ════════ */}
      <section style={{ background: C.bgAlt, padding: "clamp(80px,11vw,150px) clamp(24px,8vw,160px)", textAlign: "center" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
            <Eyebrow color={C.textMuted} align="center">La promesse</Eyebrow>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: "clamp(1.5rem,3.2vw,2.9rem)",
              lineHeight: 1.36,
              color: C.ink,
              maxWidth: 900,
              margin: "0 auto",
            }}
          >{/* TEXTE_SECTION */ clientText(sessionData, "respiration.texte") ?? (<>{tagline}</>)}</p>
        </Reveal>
        <Reveal delay={0.2}>
          <div style={{ width: 1, height: 72, background: `linear-gradient(${C.accent}, transparent)`, margin: "46px auto 0" }} />
        </Reveal>
      </section>

      {/* ════════ STATS — bande accent ════════ */}
      <section style={{ background: `linear-gradient(120deg, ${C.accentDark}, ${C.accent})`, padding: "clamp(56px,8vw,96px) clamp(24px,6vw,96px)", position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 88% 20%, rgba(255,255,255,0.1) 0 90px, transparent 91px), radial-gradient(circle at 8% 85%, rgba(255,255,255,0.07) 0 130px, transparent 131px)",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: 1140, margin: "0 auto", position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(190px, 100%), 1fr))", gap: "clamp(24px,4vw,44px)" }}>
          {STATS.map((s, k) => (
            <Reveal key={s.label + k} delay={k * 0.08}>
              <div style={{ textAlign: "center", color: C.white }}>
                <div style={{ fontFamily: SERIF, fontSize: "clamp(2.2rem,4vw,3.2rem)", lineHeight: 1, marginBottom: 8 }}>{s.value}</div>
                <div style={{ fontFamily: SANS, fontSize: 12.5, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.82, fontWeight: 500 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ════════ SERVICES — bento à tuiles inégales ════════ */}
      <section id="services" style={{ background: C.bg, padding: "clamp(88px,12vw,160px) clamp(24px,6vw,96px)" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <Reveal>
            <Eyebrow>Nos prestations</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{
                fontFamily: SERIF,
                fontWeight: 400,
                fontSize: "clamp(1.9rem,4.4vw,3.8rem)",
                lineHeight: 1.06,
                color: C.ink,
                margin: "18px 0 14px",
                maxWidth: "20ch",
              }}
            >{/* TEXTE_SECTION */ clientText(sessionData, "services.titre") ?? (<>
              Des services conçus pour{" "}
              <em style={{ fontStyle: "italic", color: C.accent }}>briller</em>
            </>)}</h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: "clamp(0.95rem,1.4vw,1.1rem)", lineHeight: 1.75, color: C.textMuted, maxWidth: 500, margin: "0 0 clamp(36px,4.6vw,56px)" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "services.texte") ?? (<>
              Que ce soit pour votre domicile ou votre entreprise, nous avons la solution de nettoyage parfaite pour vous.
              </>)}
            </p>
          </Reveal>

          <div className="i317-bento" style={{ display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: "clamp(14px,1.8vw,22px)" }}>
            {SERVICES.map((s: any, k: number) => {
              const Icon = s.icon;
              const on = hoverTile === k;
              const img = photo(2 + (k % P_SERV.length), P_SERV[k % P_SERV.length]);
              return (
                <Reveal key={s.title + k} delay={k * 0.08} style={{ gridColumn: `span ${bentoSpan(k)}` }}>
                  <article
                    onMouseEnter={() => setHoverTile(k)}
                    onMouseLeave={() => setHoverTile(null)}
                    style={{
                      position: "relative",
                      borderRadius: 22,
                      overflow: "hidden",
                      minHeight: "clamp(300px,32vw,400px)",
                      height: "100%",
                      background: C.bgDark,
                      boxShadow: on
                        ? "0 30px 60px -26px rgba(34,26,51,0.4), 0 8px 20px -12px rgba(34,26,51,0.22)"
                        : "0 14px 40px -30px rgba(34,26,51,0.32)",
                      transform: on ? "translateY(-6px)" : "none",
                      transition: "all 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
                      cursor: "default",
                    }}
                  >
                    <img
                      src={img}
                      alt={s.title}
                      loading="lazy"
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transform: on ? "scale(1.05)" : "scale(1)",
                        transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(29,20,48,0.88) 0%, rgba(29,20,48,0.32) 52%, rgba(29,20,48,0.06) 78%)" }} />
                    <span
                      style={{
                        position: "absolute",
                        top: 18,
                        right: 18,
                        width: 46,
                        height: 46,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.92)",
                        display: "grid",
                        placeItems: "center",
                        color: C.accent,
                        transform: on ? "rotate(-8deg) scale(1.08)" : "none",
                        transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <Icon size={22} />
                    </span>
                    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "clamp(20px,2.6vw,32px)" }}>
                      <h3 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(1.3rem,2vw,1.7rem)", color: C.white, margin: "0 0 10px", lineHeight: 1.15 }}>
                        {s.title}
                      </h3>
                      <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 14, lineHeight: 1.62, color: "rgba(255,255,255,0.82)", margin: 0, maxWidth: 460 }}>
                        {s.desc}
                      </p>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          marginTop: 14,
                          fontFamily: SANS,
                          fontSize: 12,
                          letterSpacing: "0.16em",
                          textTransform: "uppercase",
                          fontWeight: 600,
                          color: on ? C.gold : "rgba(255,255,255,0.7)",
                          transition: "color 0.4s",
                        }}
                      >
                        En savoir plus
                        <ArrowRight size={13} style={{ transform: on ? "translateX(5px)" : "none", transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }} />
                      </span>
                    </div>
                  </article>
                </Reveal>
              );
            })}
            {/* Tuile accent : le chiffre de satisfaction, réemployé du bandeau */}
            <Reveal delay={0.2} style={{ gridColumn: `span ${bentoSpan(SERVICES.length)}` }}>
              <div
                style={{
                  borderRadius: 22,
                  minHeight: "clamp(220px,22vw,300px)",
                  height: "100%",
                  background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "clamp(24px,3vw,40px)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <span aria-hidden style={{ position: "absolute", right: -22, top: -30, fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(7rem,11vw,11rem)", color: C.white, opacity: 0.09, lineHeight: 1, userSelect: "none" }}>
                  %
                </span>
                <div style={{ fontFamily: SERIF, fontSize: "clamp(3rem,5vw,4.4rem)", color: C.white, lineHeight: 1 }}>{STATS[2]?.value ?? "100%"}</div>
                <div style={{ fontFamily: SANS, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)", fontWeight: 600, marginTop: 12 }}>
                  {STATS[2]?.label ?? "Satisfaction"}
                </div>
                <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.6, maxWidth: 300, margin: "14px 0 0" }}>
                  *Ceci est une promesse tenue à chaque intervention, pas un slogan.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════ TARIFS — calculateur d'estimation (conservé) ════════ */}
      <section id="tarifs" style={{ background: C.bgAlt, padding: "clamp(88px,12vw,160px) clamp(24px,6vw,96px)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "clamp(36px,4.6vw,56px)" }}>
            <Reveal>
              <Eyebrow align="center">Estimation instantanée</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(1.8rem,4vw,3.4rem)", lineHeight: 1.08, color: C.ink, margin: "18px 0 0" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "tarifs.titre") ?? (<>
                Calculez votre <em style={{ fontStyle: "italic", color: C.accent }}>tarif</em>
                </>)}
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.16}>
            <div
              style={{
                background: C.bgCard,
                borderRadius: 28,
                padding: "clamp(24px,4.6vw,56px)",
                boxShadow: "0 30px 70px -40px rgba(34,26,51,0.3), 0 6px 20px -12px rgba(34,26,51,0.1)",
                border: `1px solid ${C.border}`,
              }}
            >
              <div className="i317-calc" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(28px,3.6vw,44px)" }}>
                <div>
                  <h3 style={{ fontFamily: SANS, fontSize: "clamp(1.05rem,1.6vw,1.25rem)", fontWeight: 600, margin: "0 0 20px", color: C.ink }}>
                    Nombre d&apos;heures estimées
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 34 }}>
                    <input
                      type="range"
                      min="2"
                      max="10"
                      step="0.5"
                      value={hours}
                      onChange={(e) => setHours(parseFloat(e.target.value))}
                      aria-label="Nombre d'heures"
                      style={{ flexGrow: 1, accentColor: "#7c3aed", height: 8, borderRadius: 4, cursor: "pointer", minWidth: 0 }}
                    />
                    <span style={{ fontFamily: SERIF, fontSize: "clamp(1.3rem,2vw,1.6rem)", color: C.accent, minWidth: 56, textAlign: "right" }}>{hours}h</span>
                  </div>

                  <h3 style={{ fontFamily: SANS, fontSize: "clamp(1.05rem,1.6vw,1.25rem)", fontWeight: 600, margin: "0 0 18px", color: C.ink }}>
                    Fréquence
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { id: "weekly", label: "Hebdomadaire", discount: "-10%" },
                      { id: "biweekly", label: "Bimensuel", discount: "-5%" },
                      { id: "once", label: "Une seule fois", discount: null },
                    ].map((freq) => (
                      <label
                        key={freq.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 10,
                          padding: "15px 18px",
                          borderRadius: 14,
                          border: `1.5px solid ${frequency === freq.id ? C.accent : C.border}`,
                          background: frequency === freq.id ? "rgba(124,58,237,0.06)" : "transparent",
                          cursor: "pointer",
                          transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                          minHeight: 44,
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <input
                            type="radio"
                            name="frequency"
                            value={freq.id}
                            checked={frequency === freq.id}
                            onChange={() => setFrequency(freq.id)}
                            style={{ accentColor: "#7c3aed", width: 17, height: 17 }}
                          />
                          <span style={{ fontFamily: SANS, fontWeight: 500, color: C.ink, fontSize: 15 }}>{freq.label}</span>
                        </span>
                        {freq.discount && (
                          <span style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 700, color: C.gold, background: C.ink, padding: "4px 9px", borderRadius: 8 }}>
                            {freq.discount}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    background: `linear-gradient(150deg, ${C.accent}, ${C.accentDark})`,
                    borderRadius: 20,
                    padding: "clamp(28px,3.6vw,44px)",
                    color: C.white,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <span aria-hidden style={{ position: "absolute", left: -18, bottom: -36, fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(6rem,9vw,9rem)", color: C.white, opacity: 0.08, lineHeight: 1, userSelect: "none" }}>
                    €
                  </span>
                  <Calculator size={40} style={{ opacity: 0.85, marginBottom: 18 }} />
                  <div style={{ fontFamily: SANS, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.9, marginBottom: 8, fontWeight: 600 }}>
                    Tarif estimé
                  </div>
                  <div style={{ fontFamily: SERIF, fontSize: "clamp(2.8rem,5.4vw,4.4rem)", lineHeight: 1, marginBottom: 14 }}>{calculateEstimate()}€</div>
                  <div style={{ fontFamily: SANS, fontWeight: 300, fontSize: 13, opacity: 0.82, marginBottom: 28, lineHeight: 1.6 }}>
                    *Ceci est une estimation. Le prix final peut varier selon l&apos;état des lieux.
                  </div>
                  <a
                    href="#contact"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      width: "100%",
                      padding: "15px 24px",
                      borderRadius: 999,
                      background: C.white,
                      color: "#5f2bb8",
                      fontFamily: SANS,
                      fontSize: 14.5,
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    Réserver maintenant <ArrowRight size={15} />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════ AVANTAGES — split photo + points forts ════════ */}
      <section id="avantages" style={{ background: C.bg, padding: "clamp(88px,12vw,160px) clamp(24px,6vw,96px)" }}>
        <div
          className="i317-split"
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(0,0.95fr) minmax(0,1.05fr)",
            gap: "clamp(44px,6vw,96px)",
            alignItems: "center",
          }}
        >
          <Reveal y={46}>
            <div style={{ position: "relative" }}>
              <div style={{ borderRadius: 26, overflow: "hidden", aspectRatio: "4/4.6", background: C.bgDark, boxShadow: "0 30px 60px -30px rgba(34,26,51,0.35)" }}>
                <img src={photo(1, P_ABOUT)} alt="Notre équipe à l'œuvre" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div
                className="i317-float"
                style={{
                  position: "absolute",
                  top: -24,
                  right: -18,
                  width: 108,
                  height: 108,
                  borderRadius: "50%",
                  background: C.gold,
                  color: C.ink,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 14px 30px -12px rgba(34,26,51,0.3)",
                  fontFamily: SERIF,
                  fontSize: 27,
                  lineHeight: 1,
                  animation: "i317-float 4.2s ease-in-out infinite",
                }}
              >
                100%
                <span style={{ fontSize: 13, fontWeight: 600, fontFamily: SANS, marginTop: 4 }}>Fiable</span>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <Eyebrow>Pourquoi nous choisir</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(1.8rem,3.8vw,3.2rem)", lineHeight: 1.08, color: C.ink, margin: "18px 0 28px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "avantages.titre") ?? (<>
                Une approche <em style={{ fontStyle: "italic", color: C.accent }}>différente</em> du nettoyage
                </>)}
              </h2>
            </Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {AVANTAGES_SOURCE.map((item, k) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} delay={0.14 + k * 0.07}>
                    <div style={{ display: "flex", gap: 18, padding: "16px 0", borderTop: `1px solid ${C.border}` }}>
                      <span style={{ width: 54, height: 54, borderRadius: 15, background: C.bgCard, display: "grid", placeItems: "center", color: C.accent, flexShrink: 0, boxShadow: "0 10px 22px -12px rgba(34,26,51,0.2)" }}>
                        <Icon size={24} />
                      </span>
                      <span>
                        <span style={{ display: "block", fontFamily: SANS, fontSize: "clamp(1.02rem,1.5vw,1.15rem)", fontWeight: 600, color: C.ink, marginBottom: 6 }}>{item.title}</span>
                        <span style={{ display: "block", fontFamily: SANS, fontWeight: 300, fontSize: 14.5, color: C.textMuted, lineHeight: 1.65 }}>{item.desc}</span>
                      </span>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ RÉALISATIONS ════════ */}
      <section style={{ background: C.bgAlt, padding: "clamp(80px,11vw,150px) clamp(24px,6vw,96px)" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "clamp(36px,4.6vw,56px)" }}>
            <Reveal>
              <Eyebrow align="center">Nos réalisations</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(1.8rem,3.8vw,3.2rem)", lineHeight: 1.08, color: C.ink, margin: "18px 0 0" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "realisations.titre") ?? (<>
                Des résultats <em style={{ fontStyle: "italic", color: C.accent }}>éclatants</em>
                </>)}
              </h2>
            </Reveal>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: "clamp(14px,1.8vw,22px)" }}>
            {P_GAL.map((repli, k) => (
              <Reveal key={k} delay={k * 0.08}>
                <div
                  onMouseEnter={() => setHoverGal(k)}
                  onMouseLeave={() => setHoverGal(null)}
                  style={{
                    borderRadius: 20,
                    overflow: "hidden",
                    aspectRatio: "1",
                    background: C.bgDark,
                    boxShadow: hoverGal === k
                      ? "0 26px 54px -26px rgba(34,26,51,0.42), 0 6px 16px -8px rgba(34,26,51,0.2)"
                      : "0 12px 34px -26px rgba(34,26,51,0.3)",
                    transform: hoverGal === k ? "translateY(-6px)" : "none",
                    transition: "all 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <img
                    src={photo(5 + k, repli)}
                    alt={`Réalisation ${k + 1}`}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      transform: hoverGal === k ? "scale(1.06)" : "scale(1)",
                      transition: "transform 0.95s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ AVIS — marquee ════════ */}
      <section id="temoignages" style={{ background: C.bgDark, padding: "clamp(88px,12vw,160px) 0", position: "relative", overflow: "hidden" }}>
        <span aria-hidden style={{ position: "absolute", top: -14, left: 22, fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(9rem,17vw,17rem)", color: C.accent, opacity: 0.1, lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>
          &ldquo;
        </span>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 clamp(24px,6vw,96px)", position: "relative", zIndex: 2, textAlign: "center", marginBottom: "clamp(40px,5vw,64px)" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Eyebrow color={C.gold} align="center">Avis clients</Eyebrow>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(1.8rem,4vw,3.4rem)", lineHeight: 1.06, color: C.white, margin: "18px 0 0" }}>
              {/* TEXTE_SECTION */ clientText(sessionData, "avis.titre") ?? (<>
              Ce qu&apos;ils disent de <em style={{ fontStyle: "italic", color: C.gold }}>nous</em>
              </>)}
            </h2>
          </Reveal>
        </div>

        {/* Le ruban défile en continu ; il se fige au survol et sous
            prefers-reduced-motion (où il redevient défilable au doigt). */}
        <div className="i317-marquee" style={{ overflow: "hidden", position: "relative", zIndex: 2 }}>
          <div className="i317-marquee-track" style={{ display: "flex", gap: "clamp(16px,2vw,26px)", width: "max-content", padding: "8px clamp(24px,6vw,96px)" }}>
            {[...AVIS, ...AVIS].map((t, k) => (
              <figure
                key={k}
                style={{
                  width: "min(380px, 82vw)",
                  flexShrink: 0,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 20,
                  padding: "clamp(24px,2.8vw,34px)",
                  margin: 0,
                  boxSizing: "border-box",
                }}
              >
                <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={15} fill={C.gold} color={C.gold} />
                  ))}
                </div>
                <blockquote style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(1rem,1.5vw,1.15rem)", color: "rgba(255,255,255,0.88)", lineHeight: 1.62, margin: "0 0 22px", whiteSpace: "normal" }}>
                  &ldquo;{t.text}&rdquo;
                </blockquote>
                <figcaption style={{ display: "flex", alignItems: "center", gap: 14, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16 }}>
                  <span style={{ width: 44, height: 44, borderRadius: "50%", background: C.accent, color: C.white, display: "grid", placeItems: "center", fontFamily: SANS, fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                    {String(t.name ?? "•").split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                  </span>
                  <span>
                    <span style={{ display: "block", fontFamily: SANS, fontSize: 15, fontWeight: 600, color: C.white }}>{t.name}</span>
                    <span style={{ display: "block", fontFamily: SANS, fontSize: 12.5, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ FAQ ════════ */}
      <section style={{ background: C.bg, padding: "clamp(80px,11vw,150px) clamp(24px,6vw,96px)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "clamp(36px,4.6vw,56px)" }}>
            <Reveal>
              <Eyebrow align="center">FAQ</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(1.7rem,3.6vw,3rem)", lineHeight: 1.08, color: C.ink, margin: "18px 0 0" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "faq.titre") ?? (<>
                Questions <em style={{ fontStyle: "italic", color: C.accent }}>fréquentes</em>
                </>)}
              </h2>
            </Reveal>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQ.map((faq: any, k: number) => (
              <Reveal key={k} delay={k * 0.06}>
                <div
                  style={{
                    background: C.bgCard,
                    borderRadius: 16,
                    border: `1.5px solid ${activeFaq === k ? C.accent : C.border}`,
                    boxShadow: activeFaq === k ? "0 14px 32px -20px rgba(124,58,237,0.35)" : "none",
                    overflow: "hidden",
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === k ? null : k)}
                    style={{
                      width: "100%",
                      padding: "clamp(18px,2.4vw,24px)",
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
                    <span style={{ fontFamily: SANS, fontSize: "clamp(0.98rem,1.5vw,1.1rem)", fontWeight: 600, color: C.ink, lineHeight: 1.4 }}>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      style={{ transform: activeFaq === k ? "rotate(180deg)" : "none", transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)", color: activeFaq === k ? C.accent : C.textFaint, flexShrink: 0 }}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {activeFaq === k && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        style={{ overflow: "hidden" }}
                      >
                        <p style={{ padding: "0 clamp(18px,2.4vw,24px) clamp(18px,2.4vw,24px)", fontFamily: SANS, fontWeight: 300, fontSize: 14.5, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CONTACT — panneau accent + formulaire relié au calculateur ════════ */}
      <section id="contact" style={{ background: C.bgAlt, padding: "clamp(88px,12vw,160px) clamp(24px,6vw,96px)" }}>
        <div
          className="i317-contact"
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
            borderRadius: 32,
            overflow: "hidden",
            boxShadow: "0 40px 90px -50px rgba(34,26,51,0.4)",
          }}
        >
          <div style={{ background: `linear-gradient(160deg, ${C.accent}, ${C.accentDark})`, padding: "clamp(32px,5vw,72px)", color: C.white, position: "relative", overflow: "hidden" }}>
            <span aria-hidden style={{ position: "absolute", right: -30, bottom: -50, fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(8rem,13vw,13rem)", color: C.white, opacity: 0.08, lineHeight: 1, userSelect: "none" }}>
              ✳
            </span>
            <Reveal>
              <h2 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(1.8rem,3.6vw,3rem)", lineHeight: 1.12, margin: "0 0 20px" }}>
                {/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
                Prêt à faire briller votre intérieur ?
                </>)}
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: "clamp(0.98rem,1.5vw,1.12rem)", opacity: 0.92, lineHeight: 1.7, margin: "0 0 36px", maxWidth: 420 }}>
                Contactez-nous dès aujourd&apos;hui pour un devis personnalisé ou pour planifier votre première prestation.
              </p>
            </Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { icon: <Phone size={20} />, value: phone, href: telHref },
                { icon: <Mail size={20} />, value: email, href: `mailto:${email}` },
                { icon: <MapPin size={20} />, value: address },
              ].map((item, k) => (
                <Reveal key={k} delay={0.14 + k * 0.06}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(255,255,255,0.18)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                      {item.icon}
                    </span>
                    {item.href ? (
                      <a href={item.href} style={{ fontFamily: SANS, fontSize: "clamp(1rem,1.5vw,1.15rem)", fontWeight: 600, color: C.white, textDecoration: "none", overflowWrap: "anywhere" }}>
                        {item.value}
                      </a>
                    ) : (
                      <span style={{ fontFamily: SANS, fontSize: "clamp(0.95rem,1.4vw,1.08rem)", fontWeight: 500, overflowWrap: "anywhere" }}>{item.value}</span>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div style={{ background: C.bgCard, padding: "clamp(32px,5vw,72px)" }}>
            <h3 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(1.4rem,2.2vw,1.8rem)", color: C.ink, margin: "0 0 26px" }}>
              Envoyez-nous un message
            </h3>
            {contactSent ? (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: EASE }} style={{ textAlign: "center", padding: "24px 0" }}>
                <CheckCircle2 size={46} style={{ color: C.accent, margin: "0 auto 16px", display: "block" }} />
                <h4 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(1.2rem,1.8vw,1.5rem)", color: C.ink, margin: "0 0 10px" }}>Demande envoyée !</h4>
                <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 14.5, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>
                  Merci {contactForm.name}, votre demande pour {hours}h de ménage ({FREQUENCY_LABELS[frequency]}, ~{calculateEstimate()}€) a bien été reçue. Nous vous recontactons rapidement.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleContactSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ padding: "13px 17px", borderRadius: 12, background: C.bg, border: `1px solid ${C.border}`, fontFamily: SANS, fontSize: 13.5, color: C.textMuted }}>
                  <strong style={{ color: C.ink, fontWeight: 600 }}>Récapitulatif :</strong> {hours}h · {FREQUENCY_LABELS[frequency]} · ~{calculateEstimate()}€
                </div>
                <div>
                  <label htmlFor="i317-name" style={{ display: "block", fontFamily: SANS, fontSize: 12.5, fontWeight: 600, color: C.ink, marginBottom: 6 }}>Votre nom</label>
                  <input
                    id="i317-name"
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    style={{ padding: "14px 18px", minHeight: 44, boxSizing: "border-box", borderRadius: 12, border: `1.5px solid ${C.border}`, fontFamily: SANS, fontSize: 15, outline: "none", width: "100%", background: C.bgCard, color: C.ink }}
                  />
                </div>
                <div>
                  <label htmlFor="i317-email" style={{ display: "block", fontFamily: SANS, fontSize: 12.5, fontWeight: 600, color: C.ink, marginBottom: 6 }}>Votre email</label>
                  <input
                    id="i317-email"
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    style={{ padding: "14px 18px", minHeight: 44, boxSizing: "border-box", borderRadius: 12, border: `1.5px solid ${C.border}`, fontFamily: SANS, fontSize: 15, outline: "none", width: "100%", background: C.bgCard, color: C.ink }}
                  />
                </div>
                <div>
                  <label htmlFor="i317-message" style={{ display: "block", fontFamily: SANS, fontSize: 12.5, fontWeight: 600, color: C.ink, marginBottom: 6 }}>Votre message (facultatif)</label>
                  <textarea
                    id="i317-message"
                    placeholder="Précisions sur votre logement, accès, etc."
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    style={{ padding: "14px 18px", boxSizing: "border-box", borderRadius: 12, border: `1.5px solid ${C.border}`, fontFamily: SANS, fontSize: 15, outline: "none", width: "100%", resize: "vertical", background: C.bgCard, color: C.ink, lineHeight: 1.6 }}
                  />
                </div>
                <Pill type="submit" full disabled={contactLoading}>
                  {contactLoading ? "Envoi en cours…" : "Envoyer"}
                </Pill>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer style={{ background: C.bgDarkAlt, color: "rgba(255,255,255,0.86)", padding: "clamp(56px,8vw,100px) clamp(24px,6vw,96px) 36px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div className="i317-footgrid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr", gap: "clamp(30px,4.6vw,56px)", marginBottom: "clamp(40px,5.6vw,60px)" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 18 }}>
                <span style={{ width: 38, height: 38, borderRadius: 11, background: C.accent, display: "grid", placeItems: "center", color: C.white, transform: "rotate(-8deg)" }}>
                  <Sparkles size={20} />
                </span>
                <span style={{ fontFamily: SERIF, fontSize: 21, lineHeight: 1, color: C.white }}>{clientName(sessionData) ?? "Ménage Dynamique"}</span>
              </div>
              <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 14.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0, maxWidth: 300 }}>
                {tagline}
              </p>
            </div>
            <div>
              <h4 style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: C.gold, fontWeight: 600, margin: "0 0 18px" }}>Liens utiles</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 11 }}>
                {[
                  { label: "Accueil", href: "#hero" },
                  { label: "Services", href: "#services" },
                  { label: "Tarifs", href: "#tarifs" },
                  { label: "Témoignages", href: "#temoignages" },
                  { label: "Contact", href: "#contact" },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontFamily: SANS, fontWeight: 300, fontSize: 14 }}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: C.gold, fontWeight: 600, margin: "0 0 18px" }}>Horaires</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 11, fontFamily: SANS, fontWeight: 300, fontSize: 14, color: "rgba(255,255,255,0.6)" }}>
                <li style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <span>Lun – Ven</span> <span>08:00 – 19:00</span>
                </li>
                <li style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <span>Samedi</span> <span>09:00 – 17:00</span>
                </li>
                <li style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <span>Dimanche</span> <span>Fermé</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: C.gold, fontWeight: 600, margin: "0 0 18px" }}>Newsletter</h4>
              <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 13.5, color: "rgba(255,255,255,0.55)", margin: "0 0 14px", lineHeight: 1.6 }}>
                Recevez nos astuces propreté et nos offres exclusives.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="email"
                  placeholder="Email"
                  aria-label="Votre email pour la newsletter"
                  style={{ padding: "12px 16px", minHeight: 44, boxSizing: "border-box", borderRadius: 999, border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.06)", color: C.white, outline: "none", flexGrow: 1, fontFamily: SANS, fontSize: 14, minWidth: 0 }}
                />
                <button aria-label="S'inscrire" style={{ background: C.accent, color: C.white, border: "none", borderRadius: "50%", width: 44, height: 44, cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: 24,
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              fontFamily: SANS,
              fontSize: 12.5,
              color: "rgba(255,255,255,0.4)",
            }}
          >
            <span>
              © {new Date().getFullYear()} {clientName(sessionData) ?? "Ménage Dynamique"}. Tous droits réservés.
              {/* VILLE_PIED */}
              {clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
            </span>
            <span>
              Éditeur : {clientName(sessionData) ?? "Aevia WS"} · SIREN <LegalIdentity fallback="852 546 225" kind="siren" /> · Hébergeur : Vercel Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
