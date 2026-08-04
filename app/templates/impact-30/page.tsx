"use client";
// @ts-nocheck

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Star,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  ChevronRight,
  Shield,
  Award,
  Heart,
  Smile,
  CheckCircle,
  Calendar,
  Menu,
  X,
  Users,
  ThumbsUp,
} from "lucide-react";
import { resolveList } from "@/lib/templates/resolveList";
import {
  useHeroSelector, HeroStage, Rise, SelectorRail,
  heroSectionStyle, railResponsiveCSS, EASE_3, EASE_4, BEAT,
} from "@/lib/templates/hero-kit";
import {
  clientCity,
  clientFaq,
  clientName,
  clientReviews,
  clientServices,
  clientStats,
  clientTeam,
} from "@/lib/templates/clientContent";

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Hoisted above the design tokens: several templates read `brand` in a
// module-level const — declaring it lower caused a TDZ ReferenceError (500).
let brand: any = null;
// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let bp: any = null;
// La session complète, pour lib/templates/clientContent : même portée
// que fd/c/bp, pour les sous-composants qui n'ont pas de props.
let sessionData: any = null;


// ─── Design Tokens ────────────────────────────────────────────────────────────
// Lightens (positive percent) or darkens (negative) a #rrggbb hex color —
// used to derive companion shades from the client's brand color.
function shadeColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) return hex;
  const amt = Math.round(2.55 * percent);
  const r = Math.max(0, Math.min(255, (num >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

let C: Record<string, string> = {
  bg: "#FFFFFF",
  bgLight: "#e8f4fd",
  bgSection: "#f8fcff",
  text: "#1a2744",
  textMuted: "#5a6a8a",
  accent: 'var(--brand,#00b894)',
  accentDark: "#00a381",
  accentLight: "#e0f9f4",
  white: "#FFFFFF",
  border: "#dce9f5",
  shadow: "0 4px 24px rgba(26,39,68,0.08)",
  shadowLg: "0 12px 48px rgba(26,39,68,0.14)",
};

const FONT = "'Inter', system-ui, sans-serif";

// ─── Animated Tooth SVG ───────────────────────────────────────────────────────
function AnimatedTooth() {
  return (
    <motion.div
      style={{ position: "relative", width: 360, height: 400 }}
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    >
      {/* Glow pulse ring */}
      <motion.div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 290,
          height: 290,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accentLight} 0%, transparent 70%)`,
          zIndex: 0,
        }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 330,
          height: 330,
          borderRadius: "50%",
          border: `2px solid ${C.accent}`,
          opacity: 0.15,
          zIndex: 0,
        }}
        animate={{ scale: [1, 1.22, 1], opacity: [0.15, 0.04, 0.15] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      />

      {/* Floating tooth SVG */}
      <motion.svg
        viewBox="0 0 200 240"
        width={240}
        height={290}
        style={{ position: "relative", zIndex: 1, margin: "0 auto", display: "block" }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Main tooth body */}
        <motion.path
          d="M100 18 C58 18, 28 44, 26 82 C24 112, 34 134, 39 162 C44 188, 47 218, 60 227 C70 235, 81 221, 88 200 C94 184, 100 170, 100 170 C100 170, 106 184, 112 200 C119 221, 130 235, 140 227 C153 218, 156 188, 161 162 C166 134, 176 112, 174 82 C172 44, 142 18, 100 18 Z"
          fill={C.white}
          stroke={C.accent}
          strokeWidth={3.5}
          filter="drop-shadow(0 10px 28px rgba(0,184,148,0.28))"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />
        {/* Tooth roots detail */}
        <motion.path
          d="M80 170 C78 190, 74 210, 68 222 M120 170 C122 190, 126 210, 132 222"
          fill="none"
          stroke={`${C.accent}40`}
          strokeWidth={6}
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        />
        {/* Shine highlight */}
        <motion.path
          d="M72 42 C65 57, 62 78, 66 98"
          fill="none"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth={6}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        />
        {/* Check mark */}
        <motion.path
          d="M80 128 L95 146 L122 112"
          fill="none"
          stroke={C.accent}
          strokeWidth={5.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.65, delay: 1.9 }}
        />
        {/* Sparkle dots */}
        {[
          { cx: 50, cy: 52, delay: 1.5 },
          { cx: 150, cy: 50, delay: 1.65 },
          { cx: 100, cy: 28, delay: 1.8 },
        ].map((dot, i) => (
          <motion.circle
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            r={4.5}
            fill={C.accent}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0.75] }}
            transition={{ duration: 0.55, delay: dot.delay }}
          />
        ))}
      </motion.svg>

      {/* ISO badge */}
      <motion.div
        style={{
          position: "absolute",
          top: 18,
          right: 8,
          background: C.accent,
          color: C.white,
          borderRadius: 12,
          padding: "7px 15px",
          fontSize: 13,
          fontWeight: 700,
          fontFamily: FONT,
          boxShadow: "0 4px 16px rgba(0,184,148,0.38)",
          zIndex: 2,
        }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.1, duration: 0.5 }}
      >
        ISO Certified
      </motion.div>

    </motion.div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "Accueil", href: "/templates/impact-30" },
    { label: "Services", href: "#services" },
    { label: "Équipe", href: "#team" },
    { label: "Tarifs", href: "#pricing" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <motion.nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 48px",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "none",
          boxShadow: scrolled ? C.shadow : "none",
          transition: "all 0.3s ease",
          fontFamily: FONT,
        }}
      >
        {/* Logo */}
        <motion.div
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          whileHover={{ scale: 1.03 }}
        >
          {fd?.logoBase64 ? (
            // Client logo (uploaded in the brief) replaces the placeholder mark —
            // essential for the client to recognise their brand in the render.
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: "contain", display: "block" }}
            />
          ) : (
            <>
              <div
                style={{
                  width: 38,
                  height: 38,
                  background: C.accent,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Smile size={22} color={C.white} />
              </div>
              <span style={{ fontWeight: 800, fontSize: 20, color: C.text, letterSpacing: -0.5 }}>{fd?.businessName ?? (clientName(sessionData) ?? "Smile Studio")}</span>
            </>
          )}
        </motion.div>

        {/* Desktop links */}
        <div className="sky-desktop-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {links.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              style={{
                color: C.text,
                fontWeight: 500,
                fontSize: 15,
                textDecoration: "none",
                cursor: "pointer",
              }}
              whileHover={{ color: C.accent }}
              transition={{ duration: 0.15 }}
            >
              {link.label}
            </motion.a>
          ))}
          <motion.button
            style={{
              background: C.accent,
              color: C.white,
              border: "none",
              borderRadius: 8,
              padding: "10px 22px",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              fontFamily: FONT,
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
            whileHover={{ background: C.accentDark, scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <Calendar size={16} />
            Prendre RDV
          </motion.button>
        </div>

        {/* Mobile toggle */}
        <motion.button
          className="sky-mobile-burger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: C.text,
          }}
          whileTap={{ scale: 0.9 }}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
        {/* Mobile header fix: collapse desktop links, reveal burger on small screens */}
        <style>{`@media (max-width: 900px){.sky-desktop-nav{display:none !important}.sky-mobile-burger{display:flex !important}}`}</style>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: "fixed",
              top: 72,
              left: 0,
              right: 0,
              zIndex: 99,
              background: C.white,
              padding: "24px 48px",
              borderBottom: `1px solid ${C.border}`,
              boxShadow: C.shadow,
              fontFamily: FONT,
            }}
          >
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  display: "block",
                  padding: "12px 0",
                  color: C.text,
                  fontWeight: 500,
                  textDecoration: "none",
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  /* A clinic hero should reassure, not dramatise — so this one stays on a light
     ground and frames the photograph in a panel instead of going full-bleed
     cinematic like the darker kit heroes. Picking a treatment swaps the panel,
     the description and the price, which is the question a patient actually
     arrives with ("what does this cost, and does it hurt"). */
  const TREATMENT_MEDIA = [
    { img: "https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&w=1600", meta: "1 séance · 90 min" },
    { img: "https://images.pexels.com/photos/305567/pexels-photo-305567.jpeg?auto=compress&cs=tinysrgb&w=1600", meta: "Garantie 10 ans" },
    { img: "https://images.pexels.com/photos/11887613/pexels-photo-11887613.jpeg?auto=compress&cs=tinysrgb&w=1600", meta: "6 à 18 mois" },
    { img: "https://images.pexels.com/photos/12917374/pexels-photo-12917374.jpeg?auto=compress&cs=tinysrgb&w=1600", meta: "Dès 3 ans" },
  ];

  const treatments = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...SERVICES_DEMO[i % SERVICES_DEMO.length],
      title: s.title ?? s.name,
      desc: s.description ?? s.desc,
      price: s.price ?? SERVICES_DEMO[i % SERVICES_DEMO.length].price,
    })),
    SERVICES_DEMO
  );

  const { active, paused, pick, hold, reduce } = useHeroSelector(treatments.length, 7000);
  const t = treatments[active % treatments.length];
  const media = TREATMENT_MEDIA[active % TREATMENT_MEDIA.length];

  return (
    <section
      id="hero"
      style={{
        ...heroSectionStyle(`linear-gradient(140deg, ${C.bg} 0%, ${C.bgLight} 100%)`, { bottomRail: true }),
        fontFamily: FONT,
      }}
    >
      {/* Soft chromatic wash — the light-ground equivalent of a scrim. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: `radial-gradient(70% 60% at 78% 30%, ${C.accentLight} 0%, transparent 60%)`,
        }}
      />

      <div style={{ position: "relative", zIndex: 3, maxWidth: 1240, margin: "0 auto", width: "100%" }}>
        <div className="imx30-split" style={{ display: "grid", gridTemplateColumns: "1fr 0.85fr", gap: "clamp(28px,4vw,64px)", alignItems: "center" }}>
          {/* Copy */}
          <div style={{ minWidth: 0 }}>
            <Rise beat="first" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <span style={{ width: 36, height: 2, background: C.accent, display: "block" }} />
              <span style={{ fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: C.accent, fontWeight: 700 }}>
                Cabinet dentaire · {clientCity(sessionData) ?? "Bordeaux"}
              </span>
            </Rise>

            <motion.h1
              initial={{ opacity: 0, rotateY: reduce ? 0 : -10, clipPath: "inset(0 100% 0 0)" }}
              animate={{ opacity: 1, rotateY: 0, clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 0.85, ease: EASE_4 }}
              style={{ fontSize: "clamp(36px, 4.4vw, 60px)", fontWeight: 800, color: C.text, lineHeight: 1.08, letterSpacing: "-0.02em", margin: "0 0 18px", transformOrigin: "left center" }}
            >{c?.heroHeadline ?? <>
              Votre sourire,<br /><span style={{ color: C.accent }}>notre passion</span>
            </>}</motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE_3, delay: BEAT.second }}
              className="hero-lede"
              style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.75, maxWidth: 440, margin: "0 0 26px" }}
            >{c?.heroSubline ?? fd?.tagline ?? <>
              Soins conservateurs, esthétique et implantologie. Devis détaillé avant chaque acte, sans engagement.
            </>}</motion.p>

            {/* What the selector drives */}
            <div className="hero-detail" style={{ minHeight: 122, marginBottom: 20 }}>
              <AnimatePresence mode="wait">
                <motion.div key={active}>
                  <Rise beat="second" duration={0.42}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
                      <span style={{ fontSize: 21, fontWeight: 700, color: C.text }}>{t.title}</span>
                      {t.tag && (
                        <span style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: C.accentDark, background: C.accentLight, padding: "4px 10px", borderRadius: 999, fontWeight: 700 }}>
                          {t.tag}
                        </span>
                      )}
                    </div>
                  </Rise>
                  <Rise beat="second" duration={0.5}>
                    <p style={{ fontSize: 15, lineHeight: 1.7, color: C.textMuted, maxWidth: 420, margin: "0 0 14px" }}>{t.desc}</p>
                  </Rise>
                  <Rise beat="third" duration={0.45}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 20, fontWeight: 800, color: C.accent }}>{t.price}</span>
                      <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.textMuted }}>{media.meta}</span>
                    </div>
                  </Rise>
                </motion.div>
              </AnimatePresence>
            </div>

            <Rise beat="third" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/templates/impact-30/soins" style={{ textDecoration: "none" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.accent, color: C.white, padding: "15px 30px", borderRadius: 999, fontWeight: 700, fontSize: 13, letterSpacing: "0.04em", minHeight: 44, boxShadow: C.shadow }}>
                  Prendre rendez-vous
                </span>
              </Link>
              <Link href="/templates/impact-30/pricing" style={{ textDecoration: "none" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: C.accentDark, border: `1px solid ${C.border}`, padding: "15px 30px", borderRadius: 999, fontWeight: 600, fontSize: 13, minHeight: 44 }}>
                  Voir les tarifs
                </span>
              </Link>
            </Rise>
          </div>

          {/* Framed photograph — panel, not full bleed. */}
          <div className="imx30-frame" style={{ position: "relative", minWidth: 0 }}>
            <div
              style={{
                position: "relative",
                aspectRatio: "1/1",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: C.shadowLg,
                background: C.bgSection,
              }}
            >
              <HeroStage
                src={fd?.photoUrls?.[active] || media.img}
                alt={`${t.title} — cabinet dentaire`}
                reduce={reduce}
                driftSeconds={18}
              />
              <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 2, background: `linear-gradient(to top, ${C.text}59 0%, transparent 45%)` }} />
            </div>
          </div>
        </div>
      </div>

      <SelectorRail
        items={treatments}
        active={active}
        onPick={pick}
        onHold={hold}
        accent={C.accent}
        fg={C.text}
        serif={FONT}
        sans={FONT}
        paused={paused}
        reduce={reduce}
        bg={C.bg}
        id="hero"
        label={(x: any) => x.title}
        sublabel={(x: any) => x.price}
      />

      <style>{`
        ${railResponsiveCSS("hero", { titleClamp: "clamp(30px, 8.5vw, 42px)" })}
        /* the framed photo costs more than it earns once the copy column is
           narrow — drop it rather than shrink both into uselessness */
        @media (max-width: 900px) {
          .imx30-split { grid-template-columns: 1fr !important; }
          .imx30-frame { display: none !important; }
        }
      `}</style>
    </section>
  );
}

const SERVICES_DEMO = [
  {
    icon: <Smile size={28} color="var(--brand,#00b894)" />,
    title: "Blanchiment dentaire",
    desc: "Technologie Zoom! pour un résultat jusqu'à 8 teintes plus blanc en une seule séance.",
    price: "À partir de 350 €",
    tag: "Populaire",
  },
  {
    icon: <Shield size={28} color="var(--brand,#00b894)" />,
    title: "Implants dentaires",
    desc: "Remplacement naturel et durable de vos dents manquantes avec une garantie 10 ans.",
    price: "À partir de 1 200 €",
    tag: "Premium",
  },
  {
    icon: <Star size={28} color="var(--brand,#00b894)" />,
    title: "Orthodontie Invisalign",
    desc: "Aligneurs transparents discrets pour corriger votre sourire sans bagues metalliques.",
    price: "À partir de 2 800 €",
    tag: "Invisible",
  },
  {
    icon: <Heart size={28} color="var(--brand,#00b894)" />,
    title: "Soins pédiatriques",
    desc: "Cabinet dédié enfants, soins préventifs et éducation bucco-dentaire dès 3 ans.",
    price: "À partir de 45 €",
    tag: "Famille",
  },
];

function Services() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const SERVICES = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      icon: SERVICES_DEMO[i % SERVICES_DEMO.length].icon,
      title: s.title ?? s.name,
      desc: s.description ?? s.desc,
      price: s.price,
      tag: SERVICES_DEMO[i % SERVICES_DEMO.length].tag,
    })),
    SERVICES_DEMO
  );

  return (
    <section
      id="services"
      ref={ref}
      style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", marginBottom: 60 }}
      >
        <div
          style={{
            display: "inline-block",
            background: C.accentLight,
            color: C.accent,
            borderRadius: 20,
            padding: "6px 18px",
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 16,
            letterSpacing: 0.8,
            textTransform: "uppercase",
          }}
        >
          Nos soins
        </div>
        <h2
          style={{
            fontSize: "clamp(28px, 3vw, 44px)",
            fontWeight: 800,
            color: C.text,
            letterSpacing: -1,
            marginBottom: 16,
          }}
        >
          Des traitements d'excellence
        </h2>
        <p style={{ fontSize: 18, color: C.textMuted, maxWidth: 520, margin: "0 auto" }}>
          Chaque soin est réalisé avec les technologies les plus récentes pour votre confort maximal.
        </p>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(250px, 100%), 1fr))",
          gap: 28,
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 44 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            whileHover={{ y: -8, boxShadow: C.shadowLg }}
            style={{
              background: C.white,
              borderRadius: 20,
              padding: 32,
              border: `1px solid ${C.border}`,
              boxShadow: C.shadow,
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              transition: "box-shadow 0.25s",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: C.accentLight,
                color: C.accent,
                borderRadius: 20,
                padding: "4px 12px",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {s.tag}
            </div>
            <div
              style={{
                width: 56,
                height: 56,
                background: C.accentLight,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              {s.icon}
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12 }}>
              {s.title}
            </h3>
            <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.65, marginBottom: 22 }}>
              {s.desc}
            </p>
            <div style={{ fontWeight: 700, color: C.accent, fontSize: 16 }}>{s.price}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
const STATS_DEMO = [
  { value: "12 000+", label: "Patients satisfaits", icon: <Users size={24} color="#fff" /> },
  { value: "4.9 / 5", label: "Note moyenne Google", icon: <Star size={24} color="#fff" /> },
  { value: "15 ans", label: "D'expérience", icon: <Award size={24} color="#fff" /> },
  { value: "98 %", label: "Taux de satisfaction", icon: <ThumbsUp size={24} color="#fff" /> },
];
let STATS = STATS_DEMO;

function Stats() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      style={{
        padding: "90px 80px",
        background: `linear-gradient(135deg, ${C.text} 0%, #253b6e 100%)`,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(190px, 100%), 1fr))",
          gap: 40,
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.82 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{ textAlign: "center" }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                background: "rgba(0,184,148,0.22)",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              {s.icon}
            </div>
            <div
              style={{
                fontSize: "clamp(28px, 3vw, 44px)",
                fontWeight: 900,
                color: C.white,
                letterSpacing: -1,
                marginBottom: 8,
              }}
            >
              {s.value}
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 15 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS_DEMO = [
  {
    name: "Sophie M.",
    treatment: "Blanchiment + Facettes",
    before: "Je n'osais plus sourire à cause de mes dents jaunies depuis des années.",
    after: "Résultat incroyable ! 8 teintes plus blanc. Je souris à nouveau en toute confiance. L'équipe est d'une gentillesse exceptionnelle.",
    stars: 5,
    date: "Mars 2025",
  },
  {
    name: "Thomas B.",
    treatment: "Implant dentaire",
    before: "J'avais perdu une dent depuis 3 ans et j'en étais très complexé au quotidien.",
    after: "L'implant est posé depuis 6 mois — aucune différence avec mes vraies dents. Dr. Laurent est tout simplement exceptionnelle !",
    stars: 5,
    date: "Janvier 2025",
  },
  {
    name: "Amina K.",
    treatment: "Aligneurs Invisalign",
    before: "Mes dents chevauchaient et j'évitais de sourire sur toutes les photos.",
    after: "18 mois de traitement et mon sourire est parfaitement aligné. Les gouttières sont vraiment très discrètes.",
    stars: 5,
    date: "Décembre 2024",
  },
];

function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const TESTIMONIALS = resolveList(
    clientReviews(sessionData)?.map((r: any) => ({
      name: r.name ?? r.author,
      treatment: r.treatment,
      before: r.before,
      after: r.after ?? r.text,
      stars: r.stars ?? r.rating ?? 5,
      date: r.date,
    })),
    TESTIMONIALS_DEMO
  );

  return (
    <section
      ref={ref}
      style={{ padding: "100px 80px", background: C.bg, fontFamily: FONT }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 60 }}
      >
        <div
          style={{
            display: "inline-block",
            background: C.accentLight,
            color: C.accent,
            borderRadius: 20,
            padding: "6px 18px",
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 16,
            textTransform: "uppercase",
            letterSpacing: 0.8,
          }}
        >
          Témoignages
        </div>
        <h2
          style={{
            fontSize: "clamp(28px, 3vw, 44px)",
            fontWeight: 800,
            color: C.text,
            letterSpacing: -1,
          }}
        >
          Avant / Après — Ils nous font confiance
        </h2>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
          gap: 28,
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name ?? i}
            initial={{ opacity: 0, y: 44 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.12 }}
            style={{
              background: C.bgSection,
              borderRadius: 20,
              overflow: "hidden",
              border: `1px solid ${C.border}`,
              boxShadow: C.shadow,
            }}
          >
            {/* Before */}
            {t.before && (
              <div style={{ padding: "24px 28px 18px", borderBottom: `1px solid ${C.border}`, background: "#fff8f8" }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#d46060", letterSpacing: 1, marginBottom: 8 }}>
                  Avant
                </div>
                <p style={{ color: C.textMuted, fontSize: 14, fontStyle: "italic", lineHeight: 1.65 }}>
                  "{t.before}"
                </p>
              </div>
            )}
            {/* After */}
            <div style={{ padding: "24px 28px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: C.accent, letterSpacing: 1, marginBottom: 8 }}>
                Après
              </div>
              <p style={{ color: C.text, fontSize: 14, lineHeight: 1.65, marginBottom: 20 }}>
                "{t.after}"
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: C.textMuted }}>{t.treatment}</div>
                </div>
                <div>
                  <div style={{ display: "flex", gap: 2, marginBottom: 3 }}>
                    {Array.from({ length: t.stars }).map((_, k) => (
                      <Star key={k} size={13} color="var(--brand-light,#f59e0b)" fill="var(--brand-light,#f59e0b)" />
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: C.textMuted, textAlign: "right" }}>{t.date}</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Team ─────────────────────────────────────────────────────────────────────
const TEAM_DEMO = [
  { name: "Dr. Claire Laurent", role: "Chirurgienne-dentiste", specialty: "Implantologie & Chirurgie orale", experience: "18 ans", initials: "CL", color: "#4a90d9" },
  { name: "Dr. Marc Dupont", role: "Orthodontiste", specialty: "Aligneurs Invisalign certifié Diamond", experience: "12 ans", initials: "MD", color: "#7c3aed" },
  { name: "Dr. Sofia Ramirez", role: "Chirurgienne-dentiste", specialty: "Esthétique dentaire & Blanchiment", experience: "9 ans", initials: "SR", color: "var(--brand,#00b894)" },
];

function Team() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const TEAM = resolveList(
    clientTeam(sessionData)?.map((m: any, i: number) => ({
      name: m.name,
      role: m.role,
      specialty: m.specialty ?? m.credentials,
      experience: m.experience,
      initials: m.initials ?? (m.name ?? "").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase(),
      color: m.color ?? TEAM_DEMO[i % TEAM_DEMO.length].color,
    })),
    TEAM_DEMO
  );

  return (
    <section
      id="team"
      ref={ref}
      style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 60 }}
      >
        <div
          style={{
            display: "inline-block",
            background: C.accentLight,
            color: C.accent,
            borderRadius: 20,
            padding: "6px 18px",
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 16,
            textTransform: "uppercase",
            letterSpacing: 0.8,
          }}
        >
          Notre équipe
        </div>
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1 }}>
          Des experts à votre service
        </h2>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
          gap: 28,
          maxWidth: 920,
          margin: "0 auto",
        }}
      >
        {TEAM.map((doc, i) => (
          <motion.div
            key={doc.name}
            initial={{ opacity: 0, y: 44 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.12 }}
            whileHover={{ y: -6, boxShadow: C.shadowLg }}
            style={{
              background: C.white,
              borderRadius: 20,
              padding: 32,
              textAlign: "center",
              border: `1px solid ${C.border}`,
              boxShadow: C.shadow,
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: doc.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: 24,
                fontWeight: 800,
                color: C.white,
                letterSpacing: 1,
              }}
            >
              {doc.initials}
            </div>
            <h3 style={{ fontSize: 19, fontWeight: 700, color: C.text, marginBottom: 4 }}>{doc.name}</h3>
            <div style={{ fontSize: 14, fontWeight: 600, color: doc.color, marginBottom: 8 }}>{doc.role}</div>
            <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 16, lineHeight: 1.55 }}>{doc.specialty}</p>
            <div
              style={{
                display: "inline-block",
                background: C.bgLight,
                borderRadius: 20,
                padding: "5px 15px",
                fontSize: 13,
                fontWeight: 600,
                color: C.text,
              }}
            >
              {doc.experience ? `${doc.experience} d'expérience` : doc.role}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
const PLANS_SOURCE = [
  {
    name: "Essentiel",
    price: "45",
    period: "/ consultation",
    desc: "Pour un bilan complet et les soins courants du quotidien.",
    features: ["Bilan bucco-dentaire complet", "Détartrage professionnel", "Radiographie panoramique", "Conseils hygiène personnalisés", "Devis gratuit sous 24h"],
    cta: "Prendre RDV",
    highlight: false,
  },
  {
    name: "Sourire",
    price: "350",
    period: "traitement complet",
    desc: "Pour un sourire éclatant et parfaitement entretenu.",
    features: ["Tout le plan Essentiel", "Blanchiment Zoom! professionnel", "Polissage dentaire intensif", "Kit d'entretien domicile inclus", "Suivi 6 mois inclus", "Garantie résultat"],
    cta: "Choisir ce plan",
    highlight: true,
  },
  {
    name: "Premium",
    price: "Devis gratuit",
    period: "traitement sur mesure",
    desc: "Pour les transformations complètes et l'implantologie avancée.",
    features: ["Tout le plan Sourire", "Implants dentaires Straumann", "Facettes céramiques Emax", "Orthodontie Invisalign Diamond", "Suivi illimité 2 ans", "Financement 0 % disponible"],
    cta: "Demander un devis",
    highlight: false,
  },
];
let PLANS = PLANS_SOURCE;

function Pricing() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="pricing"
      ref={ref}
      style={{ padding: "100px 80px", background: C.bg, fontFamily: FONT }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 60 }}
      >
        <div
          style={{
            display: "inline-block",
            background: C.accentLight,
            color: C.accent,
            borderRadius: 20,
            padding: "6px 18px",
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 16,
            textTransform: "uppercase",
            letterSpacing: 0.8,
          }}
        >
          Tarifs
        </div>
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1, marginBottom: 14 }}>
          Des prix transparents
        </h2>
        <p style={{ color: C.textMuted, fontSize: 16 }}>
          Remboursement Sécurité Sociale & mutuelles — Financement possible
        </p>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
          gap: 28,
          maxWidth: 980,
          margin: "0 auto",
          alignItems: "start",
        }}
      >
        {PLANS.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 44 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            style={{
              background: p.highlight ? C.text : C.white,
              borderRadius: 24,
              padding: "38px 32px",
              border: p.highlight ? "none" : `2px solid ${C.border}`,
              boxShadow: p.highlight ? C.shadowLg : C.shadow,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {p.highlight && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: `linear-gradient(90deg, ${C.accent}, #00e0b5)`,
                }}
              />
            )}
            {p.highlight && (
              <div
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  background: C.accent,
                  color: C.white,
                  borderRadius: 20,
                  padding: "4px 14px",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Le plus choisi
              </div>
            )}
            <h3 style={{ fontSize: 20, fontWeight: 700, color: p.highlight ? C.white : C.text, marginBottom: 8 }}>
              {p.name}
            </h3>
            <p style={{ fontSize: 14, color: p.highlight ? "rgba(255,255,255,0.6)" : C.textMuted, marginBottom: 24, lineHeight: 1.55 }}>
              {p.desc}
            </p>
            <div style={{ marginBottom: 28 }}>
              <span
                style={{
                  fontSize: p.price.includes("Devis") ? 22 : 40,
                  fontWeight: 900,
                  color: p.highlight ? C.white : C.text,
                  letterSpacing: -1,
                }}
              >
                {p.price.includes("Devis") ? p.price : `€${p.price}`}
              </span>
              {!p.price.includes("Devis") && (
                <span style={{ fontSize: 14, color: p.highlight ? "rgba(255,255,255,0.55)" : C.textMuted, marginLeft: 6 }}>
                  {p.period}
                </span>
              )}
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 30px", display: "flex", flexDirection: "column", gap: 11 }}>
              {p.features.map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CheckCircle size={16} color={C.accent} />
                  <span style={{ fontSize: 14, color: p.highlight ? "rgba(255,255,255,0.82)" : C.text }}>{f}</span>
                </li>
              ))}
            </ul>
            <motion.button
              style={{
                width: "100%",
                background: p.highlight ? C.accent : "transparent",
                color: p.highlight ? C.white : C.text,
                border: p.highlight ? "none" : `2px solid ${C.border}`,
                borderRadius: 10,
                padding: "14px",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: FONT,
              }}
              whileHover={{
                background: p.highlight ? C.accentDark : C.accentLight,
                borderColor: C.accent,
                color: p.highlight ? C.white : C.accent,
                scale: 1.02,
              }}
              whileTap={{ scale: 0.97 }}
            >
              {p.cta}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS_DEMO = [
  {
    q: "Le blanchiment dentaire est-il remboursé par la Sécurité Sociale ?",
    a: "Non, le blanchiment esthétique n'est pas pris en charge par la Sécurité Sociale. Certaines mutuelles offrent cependant une prise en charge partielle. Nous vous fournissons un devis détaillé et proposons des solutions de financement adaptées.",
  },
  {
    q: "Combien de temps dure un traitement Invisalign ?",
    a: "La durée varie selon la complexité du cas, de 6 à 24 mois en moyenne. Lors de votre consultation initiale gratuite, le Dr. Dupont établira un plan de traitement personnalisé avec une estimation précise.",
  },
  {
    q: "Les implants dentaires sont-ils douloureux ?",
    a: "La pose d'implants se fait sous anesthésie locale — vous ne ressentirez aucune douleur pendant l'intervention. Des suites légères (gonflements, sensibilités) sont normales les 2-3 premiers jours, gérables avec des antidouleurs classiques.",
  },
  {
    q: "À quelle fréquence consulter un dentiste ?",
    a: "Nous recommandons une visite de contrôle tous les 6 mois. Un détartrage professionnel est recommandé au minimum une fois par an, voire deux fois selon votre situation bucco-dentaire.",
  },
  {
    q: "Acceptez-vous les urgences dentaires ?",
    a: "Oui, nous réservons des créneaux d'urgence chaque jour. En cas de douleur aiguë ou de traumatisme, appelez-nous au 01 42 56 78 90 — nous vous prendrons en charge dans les plus brefs délais.",
  },
];

function FAQ() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [open, setOpen] = useState<number | null>(null);
  const FAQS = resolveList(clientFaq(sessionData), FAQS_DEMO);

  return (
    <section
      ref={ref}
      style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 60 }}
      >
        <div
          style={{
            display: "inline-block",
            background: C.accentLight,
            color: C.accent,
            borderRadius: 20,
            padding: "6px 18px",
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 16,
            textTransform: "uppercase",
            letterSpacing: 0.8,
          }}
        >
          FAQ
        </div>
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1 }}>
          Questions fréquentes
        </h2>
      </motion.div>

      <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
        {FAQS.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            style={{
              background: C.white,
              borderRadius: 14,
              border: `1px solid ${open === i ? C.accent : C.border}`,
              overflow: "hidden",
              transition: "border-color 0.2s",
            }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%",
                padding: "20px 24px",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
                textAlign: "left",
                fontFamily: FONT,
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 16, color: C.text, lineHeight: 1.4 }}>{faq.q}</span>
              <motion.div
                animate={{ rotate: open === i ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                style={{ flexShrink: 0 }}
              >
                <ChevronDown size={20} color={open === i ? C.accent : C.textMuted} />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{ padding: "0 24px 22px", fontSize: 15, color: C.textMuted, lineHeight: 1.72 }}>
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function Impact30() {
  const [session, setSession] = useState<{
    formData?: {
      businessName?: string; businessType?: string; tagline?: string;
      city?: string; mainService?: string; benefits?: string[];
      priceRange?: string; targetAudience?: string; brandColor?: string;
      email?: string; phone?: string; instagram?: string; linkedin?: string;
    };
    generatedContent?: {
      heroHeadline?: string; heroSubline?: string; aboutTitle?: string;
      aboutText?: string; ctaText?: string; metaTitle?: string;
      metaDescription?: string;
      services?: { title?: string; description?: string }[];
      testimonials?: { name?: string; role?: string; text?: string; rating?: number }[];
    };
    businessProfile?: any;
  } | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  PLANS = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({ ...PLANS_SOURCE[i % PLANS_SOURCE.length], name: s.title, desc: s.desc || "" || "", price: s.price ?? PLANS_SOURCE[i % PLANS_SOURCE.length].price })),
    PLANS_SOURCE,
  );
  c = session?.generatedContent;
  bp = session?.businessProfile;
  sessionData = session;
  STATS = resolveList(clientStats(sessionData), STATS_DEMO);
  brand = fd?.brandColor ?? null; // null = keep template's original color
  if (brand) {
    C = { ...C, accent: brand, accentLight: shadeColor(brand, 25), accentDark: shadeColor(brand, -20) };
  }

return (
    // layout.tsx (this route segment's shared layout) already renders a fixed
    // Navbar above {children} — this page rendered a second, near-identical
    // fixed Navbar on top of it, producing the doubled logo / garbled
    // overlapping nav links reported at every breakpoint. The page-local
    // Navbar is redundant; layout.tsx's is the single source of truth.
    <main style={{ background: C.bg, fontFamily: FONT, overflowX: "hidden" }}>
      <Hero />
      <Services />
      <Stats />
      <Testimonials />
      <Team />
      <Pricing />
      <FAQ />
      {/* layout.tsx renders the site footer; this page rendered a second one
          on top of it, so the site showed two stacked footers. */}
    </main>
  );
}
