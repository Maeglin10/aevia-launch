"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
  type TargetAndTransition,
} from "framer-motion";
import type { SessionData } from "@/lib/sessions";
import { Star, Heart, MapPin, DollarSign } from "lucide-react";

// ---------------------------------------------------------------------------
// Reusable animation components
// ---------------------------------------------------------------------------

function FadeUp({
  children,
  delay = 0,
  duration = 0.6,
  className,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration, delay, ease: "easeOut" }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function StaggerContainer({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({
  children,
  style,
  whileHover,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  whileHover?: TargetAndTransition;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
      }}
      whileHover={whileHover}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function RevealText({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const words = text.split(" ");
  return (
    <span ref={ref} style={{ display: "inline" }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.5, delay: delay + i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ display: "inline-block", marginRight: "0.28em" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// Magnetic CTA button
function MagneticButton({
  href,
  style,
  children,
}: {
  href: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    x.set(dx * 6);
    y.set(dy * 6);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      href={href}
      style={{ ...style, x: springX, y: springY, display: "inline-block", cursor: "pointer", textDecoration: "none" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.a>
  );
}

// ---------------------------------------------------------------------------
// Theme layout config
// ---------------------------------------------------------------------------

type HeroStyle = "centered" | "left-aligned" | "fullbleed" | "luxury" | "brutalist" | "magazine" | "aurora" | "3d-tech" | "minimal-pro" | "marketplace" | "livestream";

type ThemeLayout = {
  dark: boolean;
  heroStyle: HeroStyle;
  accentStyle: "neon" | "warm" | "minimal" | "bold" | "luxury" | "brutalist" | "aurora" | "3dtech" | "minpro" | "marketplace" | "livestream";
  servicesLabel: string;
  ctaStyle: "conversion" | "trust" | "urgency" | "impact";
};

function getThemeLayout(template: string): ThemeLayout {
  switch (template) {
    case "saas":
    case "startup":
      return { dark: true, heroStyle: "centered", accentStyle: "neon", servicesLabel: "Features", ctaStyle: "conversion" };
    case "agency":
    case "landing":
      return { dark: false, heroStyle: "left-aligned", accentStyle: "bold", servicesLabel: "What we offer", ctaStyle: "conversion" };
    case "restaurant":
    case "hotel":
      return { dark: false, heroStyle: "fullbleed", accentStyle: "warm", servicesLabel: "Our Menu", ctaStyle: "trust" };
    case "fitness":
      return { dark: false, heroStyle: "fullbleed", accentStyle: "bold", servicesLabel: "Classes & Services", ctaStyle: "urgency" };
    case "consultant":
    case "portfolio":
      return { dark: false, heroStyle: "left-aligned", accentStyle: "minimal", servicesLabel: "Services", ctaStyle: "trust" };
    case "event":
      return { dark: true, heroStyle: "centered", accentStyle: "neon", servicesLabel: "Programme", ctaStyle: "urgency" };
    case "nonprofit":
      return { dark: false, heroStyle: "centered", accentStyle: "warm", servicesLabel: "Our Work", ctaStyle: "impact" };
    case "realestate":
      return { dark: false, heroStyle: "left-aligned", accentStyle: "minimal", servicesLabel: "Listings", ctaStyle: "trust" };
    case "healthcare":
      return { dark: false, heroStyle: "left-aligned", accentStyle: "minimal", servicesLabel: "Our Services", ctaStyle: "trust" };
    case "ecommerce":
      return { dark: false, heroStyle: "fullbleed", accentStyle: "bold", servicesLabel: "Collections", ctaStyle: "conversion" };
    // Premium templates
    case "luxury":
      return { dark: true, heroStyle: "luxury", accentStyle: "luxury", servicesLabel: "Our Collections", ctaStyle: "trust" };
    case "brutalist":
      return { dark: false, heroStyle: "brutalist", accentStyle: "brutalist", servicesLabel: "Work", ctaStyle: "conversion" };
    case "magazine":
      return { dark: false, heroStyle: "magazine", accentStyle: "minimal", servicesLabel: "Sections", ctaStyle: "trust" };
    case "aurora":
      return { dark: true, heroStyle: "aurora", accentStyle: "aurora", servicesLabel: "Our Rituals", ctaStyle: "trust" };
    case "3d-tech":
      return { dark: true, heroStyle: "3d-tech", accentStyle: "3dtech", servicesLabel: "What we build", ctaStyle: "conversion" };
    case "minimal-pro":
      return { dark: false, heroStyle: "minimal-pro", accentStyle: "minpro", servicesLabel: "Services", ctaStyle: "trust" };
    case "marketplace":
      return { dark: true, heroStyle: "marketplace", accentStyle: "marketplace", servicesLabel: "Top Categories", ctaStyle: "conversion" };
    case "livestream":
      return { dark: true, heroStyle: "livestream", accentStyle: "livestream", servicesLabel: "Upcoming Shows", ctaStyle: "urgency" };
    default:
      return { dark: false, heroStyle: "left-aligned", accentStyle: "minimal", servicesLabel: "What we offer", ctaStyle: "trust" };
  }
}

// ---------------------------------------------------------------------------
// Hero images per template
// ---------------------------------------------------------------------------
const HERO_IMAGES: Record<string, string> = {
  saas: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80",
  startup: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&q=80",
  agency: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1600&q=80",
  landing: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
  vitrine: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
  consultant: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&q=80",
  portfolio: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=80",
  ecommerce: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80",
  restaurant: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80",
  hotel: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1600&q=80",
  healthcare: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&q=80",
  realestate: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80",
  fitness: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80",
  event: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80",
  nonprofit: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1600&q=80",
  luxury: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80",
  brutalist: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80",
  magazine: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&q=80",
  aurora: "https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=1600&q=80",
  "3d-tech": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1600&q=80",
  "minimal-pro": "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1600&q=80",
  marketplace: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1600&q=80",
  livestream: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1600&q=80",
};

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------
function hex(color: string, alpha = 1): string {
  if (alpha === 1) return color;
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ---------------------------------------------------------------------------
// Keyframe injection helper (runs once on mount)
// ---------------------------------------------------------------------------
function useGlobalStyles(css: string) {
  useEffect(() => {
    const id = "aevia-generated-styles";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = css;
    document.head.appendChild(el);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, [css]);
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function GeneratedSite({ session }: { session: SessionData }) {
  const { formData, generatedContent: c } = session;
  if (!c) return null;

  const brand = formData.brandColor || "#7c3aed";
  const template = formData.template || "landing";
  const layout = getThemeLayout(template);

  const heroImage =
    formData.heroImageBase64 ||
    formData.heroImageUrl ||
    HERO_IMAGES[template] ||
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80";

  const aboutParagraphs = c.aboutText.split("\n\n").filter(Boolean);

  const bgMain = layout.dark ? "#0f0f0f" : "#fff";
  const bgAlt = layout.dark ? "#161616" : "#f9fafb";
  const textPrimary = layout.dark ? "#fff" : "#111";
  const textSecondary = layout.dark ? "rgba(255,255,255,0.65)" : "#6b7280";
  const borderColor = layout.dark ? "#2a2a2a" : "#e5e7eb";
  const cardBg = layout.dark ? "#1a1a1a" : "#fff";

  const fontFamily =
    layout.accentStyle === "neon" || layout.accentStyle === "3dtech"
      ? "'Courier New', 'Courier', monospace, system-ui"
      : layout.accentStyle === "luxury"
      ? "Georgia, 'Times New Roman', serif"
      : layout.accentStyle === "brutalist"
      ? "'Arial Black', 'Helvetica Neue', Impact, sans-serif"
      : "system-ui, -apple-system, sans-serif";

  const neonGlow =
    layout.accentStyle === "neon" || layout.accentStyle === "3dtech"
      ? `0 0 20px ${hex(brand, 0.5)}, 0 0 40px ${hex(brand, 0.25)}`
      : "none";

  // Inject keyframes for premium templates
  const premiumCSS = `
    @keyframes luxuryZoom {
      0%   { transform: scale(1.05); }
      100% { transform: scale(1.15); }
    }
    @keyframes auroraBlob1 {
      0%, 100% { transform: translate(0px, 0px) scale(1); }
      33%       { transform: translate(40px, -30px) scale(1.08); }
      66%       { transform: translate(-20px, 20px) scale(0.95); }
    }
    @keyframes auroraBlob2 {
      0%, 100% { transform: translate(0px, 0px) scale(1); }
      33%       { transform: translate(-50px, 30px) scale(1.05); }
      66%       { transform: translate(30px, -40px) scale(1.1); }
    }
    @keyframes auroraBlob3 {
      0%, 100% { transform: translate(0px, 0px) scale(1); }
      50%       { transform: translate(25px, 35px) scale(0.92); }
    }
    @keyframes iridescent {
      0%   { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
    @keyframes gridPulse {
      0%, 100% { opacity: 0.35; }
      50%        { opacity: 0.55; }
    }
    @keyframes glitch1 {
      0%  { clip-path: inset(40% 0 61% 0); transform: translate(-4px, 0); }
      20% { clip-path: inset(92% 0 1% 0);  transform: translate(4px, 0); }
      40% { clip-path: inset(43% 0 1% 0);  transform: translate(0, 0); }
      60% { clip-path: inset(25% 0 58% 0); transform: translate(3px, 0); }
      80% { clip-path: inset(54% 0 7% 0);  transform: translate(-2px, 0); }
      100%{ clip-path: inset(58% 0 43% 0); transform: translate(2px, 0); }
    }
    @keyframes glitch2 {
      0%  { clip-path: inset(50% 0 30% 0); transform: translate(4px, 0); }
      25% { clip-path: inset(10% 0 80% 0); transform: translate(-3px, 0); }
      50% { clip-path: inset(70% 0 5% 0);  transform: translate(2px, 0); }
      75% { clip-path: inset(30% 0 50% 0); transform: translate(-4px, 0); }
      100%{ clip-path: inset(60% 0 20% 0); transform: translate(3px, 0); }
    }
    @keyframes underlineDraw {
      0%   { width: 0; }
      100% { width: 100%; }
    }
    .luxury-cta:hover .luxury-underline {
      animation: underlineDraw 0.4s ease forwards;
    }
    .brutalist-flip {
      transition: none;
    }
    .brutalist-flip:hover {
      background: #000 !important;
      color: #fff !important;
    }
    @keyframes livePulse {
      0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(239,68,68,0.7); }
      50% { opacity: 0.7; box-shadow: 0 0 0 8px rgba(239,68,68,0); }
    }
    @keyframes marketplaceFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-6px); }
    }
    @keyframes scanLine {
      0% { top: -2px; }
      100% { top: 100%; }
    }
  `;

  useGlobalStyles(premiumCSS);

  // -------------------------------------------------------------------------
  // Scroll parallax (window-based — avoids FM target ref hydration error)
  // -------------------------------------------------------------------------
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);

  return (
    <div style={{ fontFamily, backgroundColor: bgMain, color: textPrimary, overflowX: "hidden" }}>

      {/* -------------------------------------------------------------------*/}
      {/* Global style tag for premium animations                             */}
      {/* -------------------------------------------------------------------*/}

      {/* ----------------------------------------------------------------- */}
      {/* Nav                                                                */}
      {/* ----------------------------------------------------------------- */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          background: layout.dark
            ? layout.accentStyle === "luxury"
              ? "rgba(10,8,6,0.96)"
              : "rgba(15,15,15,0.95)"
            : "#fff",
          borderBottom: layout.accentStyle === "minpro"
            ? `1px solid #e5e7eb`
            : layout.accentStyle === "luxury"
            ? `1px solid rgba(201,168,76,0.2)`
            : `1px solid ${borderColor}`,
          padding: layout.accentStyle === "minpro" ? "0 60px" : "0 24px",
          height: layout.accentStyle === "minpro" ? 72 : 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{
          fontWeight: layout.accentStyle === "luxury" ? 400 : layout.accentStyle === "minpro" ? 300 : 700,
          fontSize: layout.accentStyle === "luxury" ? 15 : layout.accentStyle === "minpro" ? 17 : 18,
          color: layout.accentStyle === "luxury" ? "#c9a84c" : layout.accentStyle === "neon" || layout.accentStyle === "3dtech" ? brand : textPrimary,
          letterSpacing: layout.accentStyle === "luxury" ? "0.2em" : layout.accentStyle === "minpro" ? "0.04em" : "normal",
          textTransform: layout.accentStyle === "luxury" ? "uppercase" : "none",
          textShadow: layout.accentStyle === "neon" || layout.accentStyle === "3dtech" ? neonGlow : "none",
        }}>
          {formData.logoBase64
            ? <img src={formData.logoBase64} alt="Logo" style={{ height: 32, objectFit: "contain" }} />
            : formData.businessName}
        </div>
        <MagneticButton
          href="#contact"
          style={{
            background: layout.accentStyle === "neon" || layout.accentStyle === "3dtech"
              ? "transparent"
              : layout.accentStyle === "luxury"
              ? "transparent"
              : layout.accentStyle === "minpro"
              ? "transparent"
              : layout.accentStyle === "brutalist"
              ? "#000"
              : brand,
            color: layout.accentStyle === "luxury"
              ? "#c9a84c"
              : layout.accentStyle === "minpro"
              ? "#111"
              : layout.accentStyle === "neon" || layout.accentStyle === "3dtech" || layout.accentStyle === "brutalist"
              ? brand
              : "#fff",
            border: layout.accentStyle === "neon" || layout.accentStyle === "3dtech"
              ? `1px solid ${brand}`
              : layout.accentStyle === "luxury"
              ? "1px solid rgba(201,168,76,0.5)"
              : layout.accentStyle === "minpro"
              ? "1px solid #111"
              : layout.accentStyle === "brutalist"
              ? "2px solid #000"
              : "none",
            padding: "8px 20px",
            borderRadius: layout.accentStyle === "brutalist" || layout.accentStyle === "minpro" ? 0 : 999,
            fontSize: 13,
            fontWeight: layout.accentStyle === "luxury" ? 400 : 600,
            letterSpacing: layout.accentStyle === "luxury" ? "0.15em" : layout.accentStyle === "minpro" ? "0.06em" : "normal",
            textTransform: layout.accentStyle === "luxury" ? "uppercase" : layout.accentStyle === "minpro" ? "uppercase" : "none",
            boxShadow: layout.accentStyle === "neon" || layout.accentStyle === "3dtech" ? neonGlow : "none",
          }}
        >
          {c.ctaText}
        </MagneticButton>
      </motion.nav>

      {/* ----------------------------------------------------------------- */}
      {/* HERO — centered (SaaS / startup / event)                           */}
      {/* ----------------------------------------------------------------- */}
      {layout.heroStyle === "centered" && (
        <section style={{
          position: "relative",
          minHeight: 560,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          textAlign: "center",
          padding: "80px 40px",
          background: layout.dark
            ? `radial-gradient(ellipse at 60% 0%, ${hex(brand, 0.15)} 0%, transparent 70%), #0f0f0f`
            : `radial-gradient(ellipse at 60% 0%, ${hex(brand, 0.08)} 0%, transparent 70%), #fff`,
        }}>
          {layout.accentStyle === "neon" && (
            <div style={{
              position: "absolute",
              top: "20%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 600,
              height: 300,
              background: `radial-gradient(ellipse, ${hex(brand, 0.12)} 0%, transparent 70%)`,
              pointerEvents: "none",
            }} />
          )}
          <div style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}>
            {layout.ctaStyle === "urgency" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                style={{
                  display: "inline-block",
                  background: hex(brand, 0.15),
                  border: `1px solid ${hex(brand, 0.4)}`,
                  color: brand,
                  borderRadius: 999,
                  padding: "6px 16px",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 24,
                }}
              >
                Limited spots available
              </motion.div>
            )}
            <h1 style={{
              fontSize: "clamp(2rem, 5vw, 3.75rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 24,
              color: textPrimary,
              textShadow: layout.accentStyle === "neon" ? neonGlow : "none",
            }}>
              <RevealText text={c.heroHeadline} delay={0.1} />
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              style={{ fontSize: 19, color: textSecondary, maxWidth: 540, margin: "0 auto 36px" }}
            >
              {c.heroSubline}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
            >
              <MagneticButton
                href="#contact"
                style={{
                  background: brand,
                  color: "#fff",
                  padding: "14px 36px",
                  borderRadius: 999,
                  fontSize: 15,
                  fontWeight: 700,
                  boxShadow: layout.accentStyle === "neon" ? neonGlow : `0 4px 20px ${hex(brand, 0.35)}`,
                }}
              >
                {c.ctaText}
              </MagneticButton>
              <MagneticButton
                href="#services"
                style={{
                  background: "transparent",
                  color: textSecondary,
                  padding: "14px 32px",
                  borderRadius: 999,
                  fontSize: 15,
                  fontWeight: 600,
                  border: `1px solid ${borderColor}`,
                }}
              >
                Learn more
              </MagneticButton>
            </motion.div>
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* HERO — fullbleed with parallax                                     */}
      {/* ----------------------------------------------------------------- */}
      {layout.heroStyle === "fullbleed" && (
        <section ref={heroRef} style={{ position: "relative", height: 580, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
          <motion.img
            src={heroImage}
            alt="Hero"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "110%",
              objectFit: "cover",
              y: parallaxY,
            }}
          />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)",
          }} />
          <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", padding: "0 40px 60px", width: "100%" }}>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: 16, maxWidth: 620 }}
            >
              {c.heroHeadline}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", maxWidth: 480, marginBottom: 32 }}
            >
              {c.heroSubline}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
            >
              <MagneticButton
                href="#contact"
                style={{
                  background: brand,
                  color: "#fff",
                  padding: "14px 32px",
                  borderRadius: 999,
                  fontSize: 15,
                  fontWeight: 700,
                  boxShadow: `0 4px 20px ${hex(brand, 0.4)}`,
                }}
              >
                {c.ctaText}
              </MagneticButton>
            </motion.div>
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* HERO — left-aligned                                                */}
      {/* ----------------------------------------------------------------- */}
      {layout.heroStyle === "left-aligned" && (
        <section style={{ position: "relative", display: "flex", alignItems: "center", overflow: "hidden", minHeight: 520 }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ flex: 1, padding: "80px 40px 80px 10%", maxWidth: 620, position: "relative", zIndex: 1 }}
          >
            {layout.ctaStyle === "trust" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} style={{ width: 16, height: 16, fill: "#f59e0b", color: "#f59e0b" }} />
                ))}
                <span style={{ fontSize: 14, color: textSecondary, fontWeight: 500 }}>Trusted by 200+ clients</span>
              </div>
            )}
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20, color: textPrimary }}>
              <RevealText text={c.heroHeadline} delay={0.1} />
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{ fontSize: 17, color: textSecondary, lineHeight: 1.7, marginBottom: 36, maxWidth: 460 }}
            >
              {c.heroSubline}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
            >
              <MagneticButton
                href="#contact"
                style={{
                  background: brand,
                  color: "#fff",
                  padding: "13px 30px",
                  borderRadius: 999,
                  fontSize: 15,
                  fontWeight: 700,
                  boxShadow: `0 4px 20px ${hex(brand, 0.35)}`,
                }}
              >
                {c.ctaText}
              </MagneticButton>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ flex: 1, position: "relative", height: 520, overflow: "hidden" }}
          >
            <img src={heroImage} alt="Hero" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, white 0%, transparent 30%)" }} />
          </motion.div>
        </section>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* HERO — LUXURY                                                       */}
      {/* ----------------------------------------------------------------- */}
      {layout.heroStyle === "luxury" && (
        <section style={{
          position: "relative",
          height: "100vh",
          minHeight: 640,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "#0a0806",
        }}>
          {/* Slow-zoom background */}
          <img
            src={heroImage}
            alt="Hero"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              animation: "luxuryZoom 8s ease-in-out infinite alternate",
              transformOrigin: "center center",
            }}
          />
          {/* Dark noise overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(10,8,6,0.7) 0%, rgba(10,8,6,0.55) 50%, rgba(10,8,6,0.8) 100%)",
          }} />
          {/* SVG noise texture */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }}>
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>

          <div style={{ position: "relative", textAlign: "center", padding: "0 40px", maxWidth: 860 }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              style={{
                fontSize: 11,
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "#c9a84c",
                marginBottom: 32,
                fontFamily: "Georgia, serif",
              }}
            >
              {formData.city || "Established"}
            </motion.div>
            <h1 style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 400,
              lineHeight: 1.15,
              color: "#f5f0e8",
              letterSpacing: "0.05em",
              marginBottom: 32,
            }}>
              <RevealText text={c.heroHeadline} delay={0.4} />
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              style={{
                fontSize: 15,
                color: "rgba(245,240,232,0.65)",
                letterSpacing: "0.08em",
                lineHeight: 1.9,
                maxWidth: 520,
                margin: "0 auto 48px",
                fontFamily: "Georgia, serif",
              }}
            >
              {c.heroSubline}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <a
                href="#contact"
                className="luxury-cta"
                style={{
                  display: "inline-block",
                  position: "relative",
                  color: "#c9a84c",
                  textDecoration: "none",
                  fontSize: 12,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  fontFamily: "Georgia, serif",
                  paddingBottom: 6,
                }}
              >
                {c.ctaText}
                <span
                  className="luxury-underline"
                  style={{
                    display: "block",
                    height: 1,
                    background: "#c9a84c",
                    width: 0,
                    marginTop: 4,
                  }}
                />
              </a>
            </motion.div>
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* HERO — BRUTALIST                                                    */}
      {/* ----------------------------------------------------------------- */}
      {layout.heroStyle === "brutalist" && (
        <section
          className="brutalist-flip"
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            background: "#fff",
            overflow: "hidden",
            padding: "60px 40px",
          }}
        >
          {/* Diagonal accent stripe */}
          <div style={{
            position: "absolute",
            top: 0,
            right: "-10%",
            width: "45%",
            height: "100%",
            background: brand,
            transform: "skewX(-6deg)",
            transformOrigin: "top right",
            opacity: 0.12,
            pointerEvents: "none",
          }} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", width: "100%" }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                fontSize: 11,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "#999",
                marginBottom: 20,
              }}
            >
              {formData.businessType} — {formData.city}
            </motion.div>
            <h1 style={{
              fontSize: "clamp(4rem, 12vw, 9rem)",
              fontWeight: 900,
              lineHeight: 0.9,
              color: "#000",
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              marginBottom: 0,
              wordBreak: "break-word",
            }}>
              <RevealText text={c.heroHeadline} delay={0.05} />
            </h1>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 40, flexWrap: "wrap", gap: 24 }}>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                style={{
                  fontSize: 18,
                  color: "#555",
                  maxWidth: 400,
                  lineHeight: 1.6,
                  borderLeft: `4px solid ${brand}`,
                  paddingLeft: 20,
                }}
              >
                {c.heroSubline}
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <MagneticButton
                  href="#contact"
                  style={{
                    background: "#000",
                    color: "#fff",
                    padding: "16px 40px",
                    borderRadius: 0,
                    fontSize: 13,
                    fontWeight: 900,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    border: "none",
                  }}
                >
                  {c.ctaText}
                </MagneticButton>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* HERO — MAGAZINE                                                     */}
      {/* ----------------------------------------------------------------- */}
      {layout.heroStyle === "magazine" && (
        <section style={{
          background: "#fafafa",
          padding: "60px 40px 40px",
          borderBottom: "2px solid #0a0a0a",
        }}>
          <div style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 2px 1.6fr",
            gap: "0 40px",
            alignItems: "start",
          }}>
            {/* Left column — pull quote */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: brand, marginBottom: 20, fontWeight: 700 }}>
                Issue {new Date().getFullYear()}
              </div>
              <div style={{
                fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                fontWeight: 700,
                lineHeight: 1.2,
                color: "#0a0a0a",
                fontStyle: "italic",
                marginBottom: 24,
              }}>
                &ldquo;{c.heroHeadline}&rdquo;
              </div>
              <div style={{ height: 1, background: "#0a0a0a", marginBottom: 24 }} />
              <p style={{ fontSize: 14, color: "#555", lineHeight: 1.8 }}>{c.heroSubline}</p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                style={{ marginTop: 32 }}
              >
                <MagneticButton
                  href="#contact"
                  style={{
                    background: brand,
                    color: "#fff",
                    padding: "12px 28px",
                    borderRadius: 0,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {c.ctaText}
                </MagneticButton>
              </motion.div>
            </motion.div>
            {/* Divider */}
            <div style={{ background: "#0a0a0a", alignSelf: "stretch" }} />
            {/* Right column — hero image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              style={{ position: "relative" }}
            >
              <img
                src={heroImage}
                alt="Hero"
                style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }}
              />
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
                padding: "24px 20px 20px",
              }}>
                <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)" }}>
                  {formData.businessName}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* HERO — AURORA                                                       */}
      {/* ----------------------------------------------------------------- */}
      {layout.heroStyle === "aurora" && (
        <section style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "#0d0d1a",
          padding: "80px 40px",
        }}>
          {/* Animated blobs */}
          <div style={{
            position: "absolute",
            top: "10%",
            left: "5%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)",
            animation: "auroraBlob1 10s ease-in-out infinite",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute",
            bottom: "5%",
            right: "10%",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)",
            animation: "auroraBlob2 12s ease-in-out infinite",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)",
            animation: "auroraBlob3 8s ease-in-out infinite",
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative", textAlign: "center", maxWidth: 700 }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{
                fontSize: 11,
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                marginBottom: 28,
              }}
            >
              {formData.businessType}
            </motion.div>
            <h1 style={{
              fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: 28,
              background: "linear-gradient(135deg, #fff 0%, #c4b5fd 40%, #f9a8d4 70%, #67e8f9 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "iridescent 6s linear infinite",
            }}>
              <RevealText text={c.heroHeadline} delay={0.3} />
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              style={{
                fontSize: 17,
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.8,
                maxWidth: 500,
                margin: "0 auto 44px",
              }}
            >
              {c.heroSubline}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <MagneticButton
                href="#contact"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "#fff",
                  padding: "14px 40px",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                }}
              >
                {c.ctaText}
              </MagneticButton>
            </motion.div>
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* HERO — 3D-TECH                                                      */}
      {/* ----------------------------------------------------------------- */}
      {layout.heroStyle === "3d-tech" && (
        <section style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "#030712",
          padding: "80px 40px",
        }}>
          {/* Animated grid */}
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              repeating-linear-gradient(0deg, rgba(0,255,136,0.06) 0px, transparent 1px, transparent 60px, rgba(0,255,136,0.06) 60px),
              repeating-linear-gradient(90deg, rgba(0,255,136,0.06) 0px, transparent 1px, transparent 60px, rgba(0,255,136,0.06) 60px)
            `,
            animation: "gridPulse 4s ease-in-out infinite",
            transform: "perspective(600px) rotateX(8deg)",
            transformOrigin: "center bottom",
          }} />
          {/* Gradient fade at bottom */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, background: "linear-gradient(to top, #030712, transparent)", pointerEvents: "none" }} />

          <div style={{ position: "relative", textAlign: "center", maxWidth: 820 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                display: "inline-block",
                background: "rgba(0,255,136,0.08)",
                border: "1px solid rgba(0,255,136,0.25)",
                color: "#00ff88",
                padding: "5px 16px",
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 32,
                fontFamily: "'Courier New', monospace",
              }}
            >
              v2.0 — Now Live
            </motion.div>

            {/* Glitch headline container */}
            <div style={{ position: "relative", marginBottom: 32 }}>
              <h1 style={{
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                fontWeight: 900,
                lineHeight: 1.05,
                color: "#e2e8f0",
                fontFamily: "'Courier New', monospace",
                textShadow: `0 0 30px rgba(0,255,136,0.3)`,
              }}>
                <RevealText text={c.heroHeadline} delay={0.2} />
              </h1>
              {/* Glitch layers */}
              <div style={{
                position: "absolute",
                inset: 0,
                color: "#00ff88",
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                fontWeight: 900,
                fontFamily: "'Courier New', monospace",
                opacity: 0.15,
                animation: "glitch1 3s steps(1) infinite",
                pointerEvents: "none",
                userSelect: "none",
              }}>
                {c.heroHeadline}
              </div>
              <div style={{
                position: "absolute",
                inset: 0,
                color: "#06b6d4",
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                fontWeight: 900,
                fontFamily: "'Courier New', monospace",
                opacity: 0.12,
                animation: "glitch2 3s steps(1) 0.5s infinite",
                pointerEvents: "none",
                userSelect: "none",
              }}>
                {c.heroHeadline}
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 15,
                color: "rgba(226,232,240,0.6)",
                lineHeight: 1.9,
                maxWidth: 560,
                margin: "0 auto 48px",
              }}
            >
              <span style={{ color: "#00ff88" }}>&gt; </span>{c.heroSubline}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
            >
              <MagneticButton
                href="#contact"
                style={{
                  background: "#00ff88",
                  color: "#030712",
                  padding: "14px 36px",
                  borderRadius: 4,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontFamily: "'Courier New', monospace",
                  boxShadow: "0 0 30px rgba(0,255,136,0.4)",
                }}
              >
                {c.ctaText}
              </MagneticButton>
              <MagneticButton
                href="#services"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(0,255,136,0.3)",
                  color: "#00ff88",
                  padding: "14px 32px",
                  borderRadius: 4,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontFamily: "'Courier New', monospace",
                }}
              >
                View docs
              </MagneticButton>
            </motion.div>
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* HERO — MINIMAL-PRO                                                  */}
      {/* ----------------------------------------------------------------- */}
      {layout.heroStyle === "minimal-pro" && (
        <section style={{
          background: "#fff",
          padding: "120px 60px 100px",
          borderBottom: "1px solid #e5e7eb",
        }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ height: 1, background: "#111", marginBottom: 48, transformOrigin: "left" }}
            />
            <h1 style={{
              fontSize: "clamp(3rem, 7vw, 6.5rem)",
              fontWeight: 300,
              lineHeight: 1.05,
              color: "#111",
              letterSpacing: "-0.02em",
              maxWidth: 880,
              marginBottom: 60,
            }}>
              <RevealText text={c.heroHeadline} delay={0.2} />
            </h1>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                style={{ fontSize: 17, color: "#6b7280", lineHeight: 1.75, maxWidth: 420 }}
              >
                {c.heroSubline}
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <MagneticButton
                  href="#contact"
                  style={{
                    border: "1px solid #111",
                    color: "#111",
                    background: "transparent",
                    padding: "14px 36px",
                    borderRadius: 0,
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  {c.ctaText}
                </MagneticButton>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* HERO — MARKETPLACE                                                  */}
      {/* ----------------------------------------------------------------- */}
      {layout.heroStyle === "marketplace" && (
        <section style={{
          position: "relative",
          minHeight: 620,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "#0a0a0f",
          padding: "80px 40px",
        }}>
          {/* Subtle warm grid */}
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              repeating-linear-gradient(0deg, rgba(245,158,11,0.04) 0px, transparent 1px, transparent 80px, rgba(245,158,11,0.04) 80px),
              repeating-linear-gradient(90deg, rgba(245,158,11,0.04) 0px, transparent 1px, transparent 80px, rgba(245,158,11,0.04) 80px)
            `,
            pointerEvents: "none",
          }} />
          {/* Radial glow */}
          <div style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 700,
            height: 350,
            background: `radial-gradient(ellipse, rgba(245,158,11,0.1) 0%, transparent 70%)`,
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative", textAlign: "center", maxWidth: 800, width: "100%" }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(245,158,11,0.1)",
                border: "1px solid rgba(245,158,11,0.3)",
                borderRadius: 999,
                padding: "5px 16px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#f59e0b",
                marginBottom: 32,
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b" }} />
              {formData.businessType}
            </motion.div>
            <h1 style={{
              fontSize: "clamp(2.5rem, 5.5vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 24,
              color: "#fff",
              letterSpacing: "-0.02em",
            }}>
              <RevealText text={c.heroHeadline} delay={0.15} />
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.7 }}
            >
              {c.heroSubline}
            </motion.p>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
                padding: "6px 6px 6px 20px",
                maxWidth: 560,
                margin: "0 auto 32px",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 15, color: "rgba(255,255,255,0.3)", flex: 1, textAlign: "left" }}>
                Search products, sellers…
              </span>
              <div style={{
                background: brand,
                color: "#000",
                borderRadius: 8,
                padding: "10px 24px",
                fontSize: 13,
                fontWeight: 700,
                flexShrink: 0,
              }}>
                Search
              </div>
            </motion.div>

            {/* Category chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}
            >
              {["Electronics", "Fashion", "Home & Garden", "Sports", "Books", "Art"].map((cat, i) => (
                <div key={cat} style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: `1px solid ${i === 0 ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.08)"}`,
                  fontSize: 12,
                  color: i === 0 ? "#f59e0b" : "rgba(255,255,255,0.45)",
                  background: i === 0 ? "rgba(245,158,11,0.15)" : "transparent",
                }}>
                  {cat}
                </div>
              ))}
            </motion.div>

            {/* Trust stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}
            >
              {[
                { value: "2M+", label: "Products" },
                { value: "50K", label: "Sellers" },
                { value: "4.8★", label: "Avg rating" },
                { value: "Free", label: "Returns" },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#f59e0b" }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2, letterSpacing: "0.08em" }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* HERO — LIVESTREAM                                                   */}
      {/* ----------------------------------------------------------------- */}
      {layout.heroStyle === "livestream" && (
        <section style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "#050508",
          padding: "80px 40px",
        }}>
          {/* Scan line effect */}
          <div style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 2,
            background: "linear-gradient(to right, transparent, rgba(239,68,68,0.4), transparent)",
            animation: "scanLine 6s linear infinite",
            pointerEvents: "none",
          }} />
          {/* Background image with dark overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.08,
          }} />
          {/* Gradient overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, rgba(239,68,68,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative", textAlign: "center", maxWidth: 820 }}>
            {/* LIVE badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 36,
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.4)",
                borderRadius: 999,
                padding: "6px 16px",
              }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#ef4444",
                  animation: "livePulse 1.5s ease-in-out infinite",
                }} />
                <span style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#ef4444",
                }}>Live</span>
              </div>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>
                · {formData.city}
              </span>
            </motion.div>

            <h1 style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 900,
              lineHeight: 1.05,
              marginBottom: 24,
              color: "#fff",
              letterSpacing: "-0.02em",
            }}>
              <RevealText text={c.heroHeadline} delay={0.2} />
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", maxWidth: 520, margin: "0 auto 48px", lineHeight: 1.75 }}
            >
              {c.heroSubline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
            >
              <MagneticButton
                href="#contact"
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  padding: "14px 36px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  boxShadow: "0 0 32px rgba(239,68,68,0.4)",
                  letterSpacing: "0.03em",
                }}
              >
                {c.ctaText}
              </MagneticButton>
              <MagneticButton
                href="#services"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.7)",
                  padding: "14px 32px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                See schedule
              </MagneticButton>
            </motion.div>

            {/* Next broadcast info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              style={{
                marginTop: 56,
                padding: "20px 32px",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                background: "rgba(255,255,255,0.03)",
                display: "inline-flex",
                alignItems: "center",
                gap: 20,
                backdropFilter: "blur(12px)",
              }}
            >
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>
                  Next broadcast
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{formData.businessName} Live</div>
              </div>
              <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.1)" }} />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>
                  Starts in
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#ef4444", fontVariantNumeric: "tabular-nums" }}>
                  2h 34m
                </div>
              </div>
              <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.1)" }} />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>
                  Viewers
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>12.4K</div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Tech/SaaS: Feature strip                                            */}
      {/* ----------------------------------------------------------------- */}
      {(template === "saas" || template === "startup") && (
        <FadeIn delay={0.1}>
          <div style={{
            borderTop: `1px solid ${borderColor}`,
            borderBottom: `1px solid ${borderColor}`,
            padding: "20px 40px",
            display: "flex",
            justifyContent: "center",
            gap: 48,
            flexWrap: "wrap",
            background: bgAlt,
          }}>
            {["No credit card required", "14-day free trial", "Cancel anytime"].map((feat) => (
              <div key={feat} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: textSecondary }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: brand }} />
                {feat}
              </div>
            ))}
          </div>
        </FadeIn>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* NonProfit: Impact numbers                                           */}
      {/* ----------------------------------------------------------------- */}
      {template === "nonprofit" && (
        <FadeUp>
          <section style={{ background: brand, padding: "48px 40px" }}>
            <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 32, textAlign: "center" }}>
              {[
                { value: "12,000+", label: "People reached" },
                { value: "3", label: "Continents" },
                { value: "98%", label: "Fund transparency" },
                { value: "10yr", label: "Field experience" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div style={{ fontSize: 36, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, marginTop: 6 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </section>
        </FadeUp>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Event: Schedule / speaker teaser                                    */}
      {/* ----------------------------------------------------------------- */}
      {template === "event" && (
        <FadeUp>
          <section style={{ background: bgAlt, padding: "60px 40px", borderTop: `1px solid ${borderColor}` }}>
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: textPrimary, marginBottom: 32, textAlign: "center" }}>Event Schedule</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  { time: "09:00", title: "Opening Keynote", speaker: "Founder & CEO" },
                  { time: "10:30", title: "Workshop Sessions", speaker: "Industry experts" },
                  { time: "12:30", title: "Networking Lunch", speaker: "All attendees" },
                  { time: "14:00", title: "Panel Discussion", speaker: "4 speakers" },
                  { time: "17:00", title: "Closing & Drinks", speaker: "All attendees" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    style={{ display: "flex", alignItems: "center", gap: 24, padding: "16px 0", borderBottom: `1px solid ${borderColor}` }}
                  >
                    <div style={{ width: 60, fontSize: 13, fontWeight: 700, color: brand, fontFamily: "'Courier New', monospace" }}>{item.time}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: textPrimary, fontSize: 15 }}>{item.title}</div>
                      <div style={{ fontSize: 13, color: textSecondary, marginTop: 2 }}>{item.speaker}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </FadeUp>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Consultant / Portfolio: Authority signals                           */}
      {/* ----------------------------------------------------------------- */}
      {(template === "consultant" || template === "portfolio") && (
        <FadeUp>
          <section style={{ background: bgAlt, padding: "48px 40px", borderTop: `1px solid ${borderColor}` }}>
            <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 24, textAlign: "center" }}>
              {[
                { value: "10+", label: "Years experience" },
                { value: "200+", label: "Clients served" },
                { value: "98%", label: "Satisfaction rate" },
                { value: "4.9★", label: "Average rating" },
              ].map((s) => (
                <div key={s.label} style={{ padding: "20px 0" }}>
                  <div style={{ fontSize: 30, fontWeight: 800, color: brand }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: textSecondary, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </section>
        </FadeUp>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Real Estate: Property card grid                                     */}
      {/* ----------------------------------------------------------------- */}
      {template === "realestate" && (
        <section id="services" style={{ padding: "80px 40px", maxWidth: 1000, margin: "0 auto" }}>
          <FadeUp>
            <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, color: textPrimary }}>Featured Properties</h2>
            <p style={{ color: textSecondary, marginBottom: 40 }}>A curated selection of our current listings</p>
          </FadeUp>
          <StaggerContainer style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {c.services.map((s, i) => (
              <StaggerItem
                key={i}
                whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }}
                style={{
                  border: `1px solid ${borderColor}`,
                  borderRadius: 16,
                  overflow: "hidden",
                  background: cardBg,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  transition: "box-shadow 0.25s",
                }}
              >
                <div style={{
                  height: 180,
                  background: `linear-gradient(135deg, ${hex(brand, 0.12)} 0%, ${hex(brand, 0.04)} 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 48,
                }}>
                  🏠
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 16, color: textPrimary, margin: 0 }}>{s.title}</h3>
                    <DollarSign style={{ width: 16, height: 16, color: brand, flexShrink: 0 }} />
                  </div>
                  <p style={{ color: textSecondary, fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>{s.description}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: brand }}>
                    <MapPin style={{ width: 12, height: 12 }} />
                    {formData.city || "Prime location"}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* ----------------------------------------------------------------- */}
      {/* Marketplace: Featured sellers                                        */}
      {/* ----------------------------------------------------------------- */}
      {template === "marketplace" && (
        <FadeUp>
          <section style={{ background: "#0d0d14", padding: "60px 40px", borderTop: "1px solid rgba(245,158,11,0.1)" }}>
            <div style={{ maxWidth: 1000, margin: "0 auto" }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Top Sellers This Week</h2>
              <p style={{ color: "rgba(255,255,255,0.35)", marginBottom: 32, fontSize: 14 }}>
                Trusted vendors with verified reviews
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                {[
                  { name: "TechZone Store", items: "1,240 items", rating: "4.9", badge: "Top Rated" },
                  { name: "Maison Décor", items: "820 items", rating: "4.8", badge: "Fast Ship" },
                  { name: "SportsPro Shop", items: "530 items", rating: "4.7", badge: "New" },
                  { name: "BookNest", items: "2,100 items", rating: "5.0", badge: "Top Rated" },
                ].map((seller, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -4, borderColor: "rgba(245,158,11,0.4)" }}
                    style={{
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 12,
                      padding: 20,
                      background: "rgba(255,255,255,0.03)",
                      transition: "border-color 0.2s",
                    }}
                  >
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: `linear-gradient(135deg, rgba(245,158,11,0.3), rgba(245,158,11,0.05))`,
                      border: "1px solid rgba(245,158,11,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      marginBottom: 12,
                    }}>
                      🏪
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 4 }}>{seller.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>{seller.items}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: "#f59e0b", fontWeight: 600 }}>★ {seller.rating}</span>
                      <span style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: seller.badge === "Top Rated" ? "#f59e0b" : seller.badge === "Fast Ship" ? "#10b981" : "#a855f7",
                        background: seller.badge === "Top Rated" ? "rgba(245,158,11,0.1)" : seller.badge === "Fast Ship" ? "rgba(16,185,129,0.1)" : "rgba(168,85,247,0.1)",
                        padding: "3px 8px",
                        borderRadius: 999,
                      }}>
                        {seller.badge}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </FadeUp>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Livestream: Broadcast schedule                                       */}
      {/* ----------------------------------------------------------------- */}
      {template === "livestream" && (
        <FadeUp>
          <section style={{ background: "#08080d", padding: "60px 40px", borderTop: "1px solid rgba(239,68,68,0.1)" }}>
            <div style={{ maxWidth: 860, margin: "0 auto" }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Broadcast Schedule</h2>
              <p style={{ color: "rgba(255,255,255,0.35)", marginBottom: 32, fontSize: 14 }}>Upcoming live events</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  { time: "20:00", title: "Opening Night — Live Premiere", status: "LIVE", viewers: "12.4K" },
                  { time: "21:30", title: "Artist Q&A Session", status: "NEXT", viewers: "—" },
                  { time: "22:00", title: "Behind The Scenes", status: "", viewers: "—" },
                  { time: "23:00", title: "Fan Requests & Encores", status: "", viewers: "—" },
                  { time: "00:00", title: "Replay & Archive Access", status: "REPLAY", viewers: "—" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 24,
                      padding: "16px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div style={{ width: 56, fontSize: 13, fontWeight: 700, color: "#ef4444", fontVariantNumeric: "tabular-nums" }}>
                      {item.time}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: "#fff", fontSize: 15 }}>{item.title}</div>
                      {item.viewers !== "—" && (
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                          {item.viewers} watching
                        </div>
                      )}
                    </div>
                    {item.status && (
                      <div style={{
                        fontSize: 9,
                        fontWeight: 800,
                        letterSpacing: "0.15em",
                        padding: "4px 10px",
                        borderRadius: 999,
                        color: item.status === "LIVE" ? "#ef4444" : item.status === "NEXT" ? "#f59e0b" : "rgba(255,255,255,0.4)",
                        background: item.status === "LIVE" ? "rgba(239,68,68,0.15)" : item.status === "NEXT" ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${item.status === "LIVE" ? "rgba(239,68,68,0.4)" : item.status === "NEXT" ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.1)"}`,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}>
                        {item.status === "LIVE" && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#ef4444", animation: "livePulse 1.5s ease-in-out infinite" }} />}
                        {item.status}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </FadeUp>
      )}

      {/* Standard services section (all non-realestate templates)            */}
      {/* ----------------------------------------------------------------- */}
      {template !== "realestate" && (
        <section
          id="services"
          style={{
            padding: template === "luxury" ? "100px 40px" : template === "minimal-pro" ? "100px 60px" : "80px 40px",
            maxWidth: template === "minimal-pro" ? "none" : 960,
            margin: "0 auto",
            background: template === "luxury" ? "#0a0806" : template === "3d-tech" ? "#030712" : template === "marketplace" ? "#0d0d14" : template === "livestream" ? "#08080d" : bgMain,
          }}
        >
          {/* Section heading */}
          {template === "magazine" ? (
            <FadeUp>
              <div style={{ maxWidth: 1100, margin: "0 auto 48px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
                  <div style={{ height: 1, flex: 1, background: "#0a0a0a" }} />
                  <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, color: brand }}>
                    {layout.servicesLabel}
                  </div>
                  <div style={{ height: 1, flex: 1, background: "#0a0a0a" }} />
                </div>
              </div>
            </FadeUp>
          ) : template === "minimal-pro" ? (
            <FadeUp style={{ maxWidth: 1100, margin: "0 auto" }}>
              <div style={{ paddingLeft: 60, paddingRight: 60, marginBottom: 60 }}>
                <h2 style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6b7280", fontWeight: 400, marginBottom: 0 }}>
                  {layout.servicesLabel}
                </h2>
              </div>
            </FadeUp>
          ) : (
            <FadeUp>
              <h2 style={{
                fontSize: 32,
                fontWeight: template === "luxury" ? 400 : template === "brutalist" ? 900 : 700,
                textAlign: template === "left-aligned" || template === "luxury" || template === "brutalist" ? "left" : "center",
                marginBottom: 12,
                color: template === "luxury" ? "#f5f0e8" : template === "3d-tech" ? "#e2e8f0" : textPrimary,
                textShadow: layout.accentStyle === "neon" || layout.accentStyle === "3dtech" ? neonGlow : "none",
                fontFamily: template === "luxury" ? "Georgia, serif" : template === "brutalist" ? "'Arial Black', Impact, sans-serif" : "inherit",
                letterSpacing: template === "luxury" ? "0.1em" : template === "brutalist" ? "-0.02em" : "normal",
                textTransform: template === "luxury" ? "uppercase" : template === "brutalist" ? "uppercase" : "none",
              }}>
                {layout.servicesLabel}
              </h2>
              {(layout.accentStyle === "neon" || layout.accentStyle === "3dtech") && (
                <p style={{ textAlign: "center", color: textSecondary, marginBottom: 48 }}>
                  Everything you need in one place
                </p>
              )}
              {layout.accentStyle !== "neon" && layout.accentStyle !== "3dtech" && <div style={{ marginBottom: 48 }} />}
            </FadeUp>
          )}

          {/* Services grid */}
          {template === "minimal-pro" ? (
            // Minimal-pro: numbered list with separators
            <div style={{ maxWidth: 1100, margin: "0 auto", paddingLeft: 60, paddingRight: 60 }}>
              {c.services.map((s, i) => (
                <FadeUp key={i} delay={i * 0.1}>
                  <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 48,
                    padding: "40px 0",
                    borderBottom: "1px solid #e5e7eb",
                  }}>
                    <div style={{ fontSize: 13, color: "#9ca3af", fontWeight: 300, minWidth: 32, letterSpacing: "0.05em" }}>
                      0{i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: 22, fontWeight: 300, color: "#111", marginBottom: 12, letterSpacing: "-0.01em" }}>{s.title}</h3>
                      <p style={{ color: "#6b7280", lineHeight: 1.7, fontSize: 15 }}>{s.description}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          ) : template === "luxury" ? (
            // Luxury: elegant centered cards
            <StaggerContainer style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 1, background: "rgba(201,168,76,0.1)" }}>
              {c.services.map((s, i) => (
                <StaggerItem
                  key={i}
                  whileHover={{ backgroundColor: "rgba(201,168,76,0.05)" }}
                  style={{
                    background: "#0a0806",
                    padding: "52px 36px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 11, color: "#c9a84c", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 20 }}>
                    0{i + 1}
                  </div>
                  <h3 style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 400, color: "#f5f0e8", marginBottom: 16, letterSpacing: "0.05em" }}>
                    {s.title}
                  </h3>
                  <div style={{ width: 30, height: 1, background: "rgba(201,168,76,0.4)", margin: "0 auto 16px" }} />
                  <p style={{ color: "rgba(245,240,232,0.55)", lineHeight: 1.8, fontSize: 14, fontFamily: "Georgia, serif" }}>{s.description}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : template === "brutalist" ? (
            // Brutalist: heavy bordered boxes
            <StaggerContainer style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 0, border: "2px solid #000" }}>
              {c.services.map((s, i) => (
                <StaggerItem
                  key={i}
                  whileHover={{ backgroundColor: "#000", color: "#fff" }}
                  style={{
                    padding: "40px 32px",
                    borderRight: i < c.services.length - 1 ? "2px solid #000" : "none",
                    background: "#fff",
                    cursor: "pointer",
                    transition: "background 0.15s, color 0.15s",
                  }}
                >
                  <div style={{ fontSize: 48, fontWeight: 900, color: brand, lineHeight: 1, marginBottom: 16 }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, textTransform: "uppercase", marginBottom: 12, letterSpacing: "-0.01em" }}>{s.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: "inherit", opacity: 0.7 }}>{s.description}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : template === "aurora" ? (
            // Aurora: glassmorphism cards
            <StaggerContainer style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
              {c.services.map((s, i) => (
                <StaggerItem
                  key={i}
                  whileHover={{ y: -6, boxShadow: "0 20px 60px rgba(139,92,246,0.2)" }}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 20,
                    padding: "36px 28px",
                    transition: "box-shadow 0.3s",
                  }}
                >
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, rgba(139,92,246,0.5), rgba(236,72,153,0.5))`,
                    marginBottom: 20,
                  }} />
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.75, fontSize: 14 }}>{s.description}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : template === "3d-tech" ? (
            // 3D-Tech: terminal-style bordered cards
            <StaggerContainer style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              {c.services.map((s, i) => (
                <StaggerItem
                  key={i}
                  whileHover={{ y: -4, borderColor: "rgba(0,255,136,0.5)" }}
                  style={{
                    border: "1px solid rgba(0,255,136,0.15)",
                    borderRadius: 8,
                    padding: "32px 24px",
                    background: "rgba(0,255,136,0.02)",
                    position: "relative",
                    overflow: "hidden",
                    transition: "border-color 0.25s",
                  }}
                >
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(to right, #00ff88, transparent)" }} />
                  <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#00ff88", marginBottom: 16, letterSpacing: "0.2em" }}>
                    SYS.MODULE_{String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0", marginBottom: 10, fontFamily: "'Courier New', monospace" }}>{s.title}</h3>
                  <p style={{ color: "rgba(226,232,240,0.55)", lineHeight: 1.7, fontSize: 13, fontFamily: "'Courier New', monospace" }}>{s.description}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : template === "magazine" ? (
            // Magazine: article-style layout
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              {c.services.map((s, i) => (
                <FadeUp key={i} delay={i * 0.09}>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr",
                    gap: "0 32px",
                    padding: "32px 0",
                    borderBottom: "1px solid #e5e7eb",
                  }}>
                    <div style={{ fontSize: 36, fontWeight: 700, color: brand, lineHeight: 1 }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0a0a0a", marginBottom: 8 }}>{s.title}</h3>
                      <p style={{ color: "#555", lineHeight: 1.75, fontSize: 15 }}>{s.description}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          ) : template === "marketplace" ? (
            // Marketplace: category cards with icons
            <StaggerContainer style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
              {c.services.map((s, i) => (
                <StaggerItem
                  key={i}
                  whileHover={{ y: -4, borderColor: `rgba(245,158,11,0.4)` }}
                  style={{
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 14,
                    padding: 24,
                    background: "rgba(255,255,255,0.03)",
                    transition: "border-color 0.2s",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${brand}, transparent)`, opacity: 0.6 }} />
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: `rgba(245,158,11,0.12)`,
                    border: "1px solid rgba(245,158,11,0.2)",
                    marginBottom: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}>
                    🏷️
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, color: "#fff" }}>{s.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.6, fontSize: 13 }}>{s.description}</p>
                  <div style={{ marginTop: 16, fontSize: 11, color: "#f59e0b", fontWeight: 600, letterSpacing: "0.06em" }}>
                    Browse →
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : template === "livestream" ? (
            // Livestream: show/episode cards
            <StaggerContainer style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
              {c.services.map((s, i) => (
                <StaggerItem
                  key={i}
                  whileHover={{ y: -4, borderColor: "rgba(239,68,68,0.3)" }}
                  style={{
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 12,
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.02)",
                    transition: "border-color 0.2s",
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{
                    height: 120,
                    background: `linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.03))`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      border: "2px solid rgba(239,68,68,0.6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <div style={{ width: 0, height: 0, borderTop: "7px solid transparent", borderBottom: "7px solid transparent", borderLeft: "12px solid rgba(239,68,68,0.9)", marginLeft: 2 }} />
                    </div>
                    <div style={{ position: "absolute", bottom: 8, right: 10, fontSize: 10, color: "rgba(255,255,255,0.4)", fontVariantNumeric: "tabular-nums" }}>
                      {["32:14", "18:45", "52:08", "24:37"][i % 4]}
                    </div>
                  </div>
                  <div style={{ padding: 16 }}>
                    <h3 style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, color: "#fff", lineHeight: 1.4 }}>{s.title}</h3>
                    <p style={{ color: "rgba(255,255,255,0.38)", lineHeight: 1.55, fontSize: 12 }}>{s.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            // Standard card grid
            <StaggerContainer style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
              {c.services.map((s, i) => (
                <StaggerItem
                  key={i}
                  whileHover={{ y: -4, boxShadow: `0 12px 40px ${hex(brand, 0.15)}` }}
                  style={{
                    border: `1px solid ${layout.dark ? borderColor : "#e5e7eb"}`,
                    borderRadius: 16,
                    padding: 28,
                    background: cardBg,
                    position: "relative",
                    overflow: "hidden",
                    transition: "box-shadow 0.25s",
                  }}
                >
                  {layout.accentStyle === "neon" && (
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${brand}, transparent)` }} />
                  )}
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: layout.accentStyle === "neon" ? 8 : 12,
                    background: layout.dark ? hex(brand, 0.15) : hex(brand, 0.1),
                    border: layout.accentStyle === "neon" ? `1px solid ${hex(brand, 0.4)}` : "none",
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, background: brand }} />
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 8, color: textPrimary }}>{s.title}</h3>
                  <p style={{ color: textSecondary, lineHeight: 1.65, fontSize: 14 }}>{s.description}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </section>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* About / Story                                                       */}
      {/* ----------------------------------------------------------------- */}
      <section style={{
        background: template === "luxury"
          ? "#070503"
          : template === "3d-tech"
          ? "#050c14"
          : template === "aurora"
          ? "#0a0a17"
          : template === "marketplace"
          ? "#0a0a0f"
          : template === "livestream"
          ? "#06060a"
          : template === "brutalist"
          ? "#f5f5f5"
          : template === "minimal-pro"
          ? "#fafafa"
          : bgAlt,
        padding: template === "minimal-pro" ? "100px 120px" : "80px 40px",
        borderTop: template === "luxury"
          ? "1px solid rgba(201,168,76,0.1)"
          : template === "brutalist"
          ? "4px solid #000"
          : template === "3d-tech"
          ? "1px solid rgba(0,255,136,0.1)"
          : template === "marketplace"
          ? "1px solid rgba(245,158,11,0.1)"
          : template === "livestream"
          ? "1px solid rgba(239,68,68,0.1)"
          : `1px solid ${borderColor}`,
      }}>
        <FadeUp>
          <div style={{
            maxWidth: template === "minimal-pro" ? 1100 : 800,
            margin: "0 auto",
            display: layout.heroStyle === "left-aligned" && template !== "luxury" ? "grid" : "block",
            gridTemplateColumns: layout.heroStyle === "left-aligned" ? "1fr 1fr" : undefined,
            gap: 60,
            alignItems: "start",
          }}>
            <div>
              <h2 style={{
                fontSize: template === "luxury" ? 28 : template === "brutalist" ? 48 : template === "minimal-pro" ? 42 : 32,
                fontWeight: template === "luxury" ? 400 : template === "brutalist" ? 900 : template === "minimal-pro" ? 300 : 700,
                marginBottom: 24,
                color: template === "luxury" ? "#c9a84c" : template === "3d-tech" ? "#00ff88" : template === "aurora" ? "#c4b5fd" : template === "marketplace" ? "#f59e0b" : template === "livestream" ? "#ef4444" : textPrimary,
                fontFamily: template === "luxury" ? "Georgia, serif" : template === "brutalist" ? "'Arial Black', Impact, sans-serif" : "inherit",
                letterSpacing: template === "luxury" ? "0.1em" : template === "brutalist" ? "-0.02em" : template === "minimal-pro" ? "-0.02em" : "normal",
                textTransform: template === "luxury" ? "uppercase" : template === "brutalist" ? "uppercase" : "none",
              }}>
                {c.aboutTitle}
              </h2>
              {aboutParagraphs.map((p, i) => (
                <p key={i} style={{
                  color: template === "luxury"
                    ? "rgba(245,240,232,0.6)"
                    : template === "3d-tech"
                    ? "rgba(226,232,240,0.6)"
                    : template === "aurora"
                    ? "rgba(255,255,255,0.6)"
                    : layout.dark
                    ? "rgba(255,255,255,0.75)"
                    : "#374151",
                  lineHeight: 1.85,
                  marginBottom: 20,
                  fontSize: template === "luxury" ? 15 : 15,
                  fontFamily: template === "luxury" ? "Georgia, serif" : template === "3d-tech" ? "'Courier New', monospace" : "inherit",
                }}>
                  {p}
                </p>
              ))}
              {formData.priceRange && (
                <div style={{
                  display: "inline-block",
                  background: template === "luxury" ? "rgba(201,168,76,0.08)" : hex(brand, 0.1),
                  border: template === "luxury" ? "1px solid rgba(201,168,76,0.3)" : `1px solid ${hex(brand, 0.3)}`,
                  borderRadius: template === "brutalist" || template === "minimal-pro" ? 0 : 12,
                  padding: "12px 24px",
                  marginTop: 8,
                }}>
                  <span style={{ fontWeight: 600, color: template === "luxury" ? "#c9a84c" : brand }}>
                    {formData.priceRange}
                  </span>
                </div>
              )}
            </div>
            {layout.heroStyle === "left-aligned" && template !== "luxury" && (
              <div>
                <div style={{
                  width: "100%",
                  aspectRatio: "4/5",
                  borderRadius: template === "brutalist" || template === "minimal-pro" ? 0 : 20,
                  background: `linear-gradient(135deg, ${hex(brand, 0.15)} 0%, ${hex(brand, 0.04)} 100%)`,
                  border: `1px solid ${hex(brand, 0.2)}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                }}>
                  <div style={{ fontSize: 64 }}>👤</div>
                  <div style={{ fontSize: 14, color: textSecondary }}>{formData.businessName}</div>
                </div>
              </div>
            )}
          </div>
        </FadeUp>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Testimonials                                                         */}
      {/* ----------------------------------------------------------------- */}
      <section style={{
        padding: template === "minimal-pro" ? "100px 120px" : "80px 40px",
        maxWidth: template === "minimal-pro" ? "none" : 960,
        margin: "0 auto",
        background: template === "luxury" ? "#0a0806" : template === "3d-tech" ? "#030712" : template === "aurora" ? "#0d0d1a" : template === "marketplace" ? "#0d0d14" : template === "livestream" ? "#08080d" : "inherit",
      }}>
        <FadeUp>
          <h2 style={{
            fontSize: template === "luxury" ? 22 : template === "minimal-pro" ? 13 : 32,
            fontWeight: template === "luxury" ? 400 : template === "minimal-pro" ? 400 : 700,
            textAlign: template === "luxury" ? "center" : template === "minimal-pro" ? "left" : "center",
            marginBottom: template === "minimal-pro" ? 60 : 48,
            color: template === "luxury" ? "#c9a84c" : template === "3d-tech" ? "#00ff88" : template === "aurora" ? "#c4b5fd" : textPrimary,
            fontFamily: template === "luxury" ? "Georgia, serif" : "inherit",
            letterSpacing: template === "luxury" ? "0.2em" : template === "minimal-pro" ? "0.2em" : "normal",
            textTransform: template === "luxury" ? "uppercase" : template === "minimal-pro" ? "uppercase" : "none",
          }}>
            {layout.ctaStyle === "impact" ? "Stories of change" : "What clients say"}
          </h2>
        </FadeUp>
        <StaggerContainer style={{
          display: "grid",
          gridTemplateColumns: template === "minimal-pro"
            ? "repeat(auto-fit, minmax(300px, 1fr))"
            : "repeat(auto-fit, minmax(260px, 1fr))",
          gap: template === "minimal-pro" ? 0 : 24,
          maxWidth: template === "minimal-pro" ? 1100 : "none",
          margin: template === "minimal-pro" ? "0 auto" : "0",
          paddingLeft: template === "minimal-pro" ? 60 : 0,
          paddingRight: template === "minimal-pro" ? 60 : 0,
        }}>
          {c.testimonials.map((t, i) => (
            <StaggerItem
              key={i}
              whileHover={
                template === "luxury"
                  ? { borderColor: "rgba(201,168,76,0.4)" }
                  : template === "3d-tech"
                  ? { borderColor: "rgba(0,255,136,0.3)" }
                  : template === "aurora"
                  ? { boxShadow: "0 16px 48px rgba(139,92,246,0.2)" }
                  : { y: -4, boxShadow: `0 12px 36px ${hex(brand, 0.1)}` }
              }
              style={{
                border: template === "luxury"
                  ? "1px solid rgba(201,168,76,0.12)"
                  : template === "3d-tech"
                  ? "1px solid rgba(0,255,136,0.1)"
                  : template === "aurora"
                  ? "1px solid rgba(255,255,255,0.08)"
                  : template === "brutalist"
                  ? "2px solid #000"
                  : template === "minimal-pro"
                  ? "none"
                  : `1px solid ${borderColor}`,
                borderRadius: template === "brutalist" || template === "minimal-pro" ? 0 : template === "luxury" ? 0 : 16,
                padding: template === "minimal-pro" ? "40px 0" : 28,
                background: template === "luxury"
                  ? "#0a0806"
                  : template === "3d-tech"
                  ? "rgba(0,255,136,0.01)"
                  : template === "aurora"
                  ? "rgba(255,255,255,0.04)"
                  : cardBg,
                position: "relative",
                borderBottom: template === "minimal-pro" ? "1px solid #e5e7eb" : undefined,
                backdropFilter: template === "aurora" ? "blur(10px)" : "none",
                transition: "border-color 0.25s, box-shadow 0.25s",
                marginLeft: i % 2 === 0 && template === "default" ? 0 : undefined,
              }}
            >
              {template === "nonprofit" && (
                <Heart style={{ position: "absolute", top: 20, right: 20, width: 16, height: 16, color: brand, fill: brand }} />
              )}
              <div style={{ display: "flex", marginBottom: 14 }}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} style={{ width: 15, height: 15, fill: template === "luxury" ? "#c9a84c" : "#f59e0b", color: template === "luxury" ? "#c9a84c" : "#f59e0b" }} />
                ))}
              </div>
              <p style={{
                color: template === "luxury"
                  ? "rgba(245,240,232,0.65)"
                  : template === "3d-tech"
                  ? "rgba(226,232,240,0.65)"
                  : template === "aurora"
                  ? "rgba(255,255,255,0.65)"
                  : layout.dark
                  ? "rgba(255,255,255,0.8)"
                  : "#374151",
                lineHeight: 1.7,
                marginBottom: 16,
                fontStyle: template === "luxury" ? "italic" : "italic",
                fontSize: 14,
                fontFamily: template === "luxury" ? "Georgia, serif" : template === "3d-tech" ? "'Courier New', monospace" : "inherit",
              }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <div style={{
                fontWeight: 600,
                fontSize: 14,
                color: template === "luxury" ? "#c9a84c" : template === "3d-tech" ? "#00ff88" : template === "aurora" ? "#c4b5fd" : template === "marketplace" ? "#f59e0b" : template === "livestream" ? "#ef4444" : textPrimary,
                fontFamily: template === "luxury" ? "Georgia, serif" : "inherit",
              }}>
                {t.name}
              </div>
              <div style={{
                color: textSecondary,
                fontSize: 13,
                fontFamily: template === "3d-tech" ? "'Courier New', monospace" : "inherit",
              }}>
                {t.role}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Contact / CTA section                                               */}
      {/* ----------------------------------------------------------------- */}
      <FadeUp>
        <section id="contact" style={{
          background: template === "luxury"
            ? "#070503"
            : template === "brutalist"
            ? "#000"
            : template === "3d-tech"
            ? "#050c14"
            : template === "aurora"
            ? "transparent"
            : template === "marketplace"
            ? "#0a0a0f"
            : template === "livestream"
            ? "#06060a"
            : template === "minimal-pro"
            ? "#111"
            : layout.ctaStyle === "impact"
            ? `linear-gradient(135deg, ${brand} 0%, ${hex(brand, 0.7)} 100%)`
            : layout.dark
            ? `linear-gradient(135deg, ${hex(brand, 0.2)} 0%, #0f0f0f 100%)`
            : brand,
          padding: template === "minimal-pro" ? "100px 120px" : "80px 40px",
          textAlign: template === "minimal-pro" ? "left" : "center",
          borderTop: template === "luxury"
            ? "1px solid rgba(201,168,76,0.15)"
            : template === "brutalist"
            ? "4px solid #000"
            : template === "3d-tech"
            ? "1px solid rgba(0,255,136,0.15)"
            : template === "marketplace"
            ? "1px solid rgba(245,158,11,0.1)"
            : template === "livestream"
            ? "1px solid rgba(239,68,68,0.12)"
            : layout.dark
            ? `1px solid ${borderColor}`
            : "none",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Aurora CTA background blobs */}
          {template === "aurora" && (
            <>
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, rgba(139,92,246,0.3) 0%, rgba(236,72,153,0.2) 50%, rgba(6,182,212,0.2) 100%)",
              }} />
              <div style={{ position: "absolute", inset: 0, background: "#0d0d1a", opacity: 0.4 }} />
            </>
          )}

          {template === "nonprofit" && (
            <div style={{ marginBottom: 20 }}>
              <Heart style={{ width: 40, height: 40, color: "#fff", fill: "#fff", display: "inline-block" }} />
            </div>
          )}

          <div style={{ position: "relative", maxWidth: template === "minimal-pro" ? 1100 : "none", margin: "0 auto" }}>
            {template === "minimal-pro" && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 40 }}>
                <div>
                  <div style={{ fontSize: 12, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>
                    Contact
                  </div>
                  <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 24, maxWidth: 540 }}>
                    {layout.ctaStyle === "trust" ? "Ready to work together?" : "Ready to get started?"}
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, maxWidth: 400, lineHeight: 1.7 }}>
                    {c.heroSubline}
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end" }}>
                  {formData.email && (
                    <a href={`mailto:${formData.email}`} style={{ color: "#fff", textDecoration: "none", fontSize: 15, letterSpacing: "0.02em", borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: 4 }}>
                      {formData.email}
                    </a>
                  )}
                  {formData.phone && (
                    <a href={`tel:${formData.phone}`} style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 14 }}>
                      {formData.phone}
                    </a>
                  )}
                </div>
              </div>
            )}

            {template !== "minimal-pro" && (
              <>
                <h2 style={{
                  fontSize: 32,
                  fontWeight: template === "luxury" ? 400 : template === "brutalist" ? 900 : 700,
                  color: template === "3d-tech" ? "#00ff88" : "#fff",
                  marginBottom: 16,
                  fontFamily: template === "luxury" ? "Georgia, serif" : template === "brutalist" ? "'Arial Black', Impact, sans-serif" : "inherit",
                  letterSpacing: template === "luxury" ? "0.1em" : "normal",
                  textTransform: template === "luxury" ? "uppercase" : template === "brutalist" ? "uppercase" : "none",
                  textShadow: template === "3d-tech" ? "0 0 30px rgba(0,255,136,0.4)" : "none",
                }}>
                  {layout.ctaStyle === "urgency" ? "Don't wait — spots are limited" :
                   layout.ctaStyle === "impact" ? "Make a difference today" :
                   layout.ctaStyle === "trust" ? "Ready to work together?" :
                   "Ready to get started?"}
                </h2>
                <p style={{
                  color: template === "3d-tech" ? "rgba(226,232,240,0.6)" : "rgba(255,255,255,0.85)",
                  fontSize: 18,
                  marginBottom: 32,
                  maxWidth: 520,
                  margin: "0 auto 32px",
                  fontFamily: template === "3d-tech" ? "'Courier New', monospace" : template === "luxury" ? "Georgia, serif" : "inherit",
                }}>
                  {c.heroSubline}
                </p>
                <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                  {formData.email && (
                    <MagneticButton
                      href={`mailto:${formData.email}`}
                      style={{
                        background: template === "brutalist" || template === "3d-tech" ? "#fff" : template === "luxury" ? "rgba(201,168,76,0.1)" : "#fff",
                        color: template === "luxury" ? "#c9a84c" : brand,
                        padding: "14px 32px",
                        borderRadius: template === "brutalist" || template === "minimal-pro" ? 0 : template === "3d-tech" ? 4 : 999,
                        fontWeight: 700,
                        fontSize: 15,
                        border: template === "luxury" ? "1px solid rgba(201,168,76,0.4)" : "none",
                        fontFamily: template === "3d-tech" ? "'Courier New', monospace" : "inherit",
                        letterSpacing: template === "luxury" ? "0.1em" : "normal",
                      }}
                    >
                      {formData.email}
                    </MagneticButton>
                  )}
                  {formData.phone && (
                    <MagneticButton
                      href={`tel:${formData.phone}`}
                      style={{
                        border: "2px solid rgba(255,255,255,0.5)",
                        color: "#fff",
                        padding: "14px 32px",
                        borderRadius: template === "brutalist" || template === "minimal-pro" ? 0 : template === "3d-tech" ? 4 : 999,
                        fontWeight: 600,
                        fontSize: 15,
                        background: "transparent",
                        fontFamily: template === "3d-tech" ? "'Courier New', monospace" : "inherit",
                      }}
                    >
                      {formData.phone}
                    </MagneticButton>
                  )}
                  {!formData.email && !formData.phone && (
                    <MagneticButton
                      href="#"
                      style={{
                        background: template === "brutalist" ? "#fff" : template === "3d-tech" ? "#00ff88" : "#fff",
                        color: template === "3d-tech" ? "#030712" : brand,
                        padding: "14px 32px",
                        borderRadius: template === "brutalist" ? 0 : template === "3d-tech" ? 4 : 999,
                        fontWeight: 700,
                        fontSize: 15,
                        fontFamily: template === "3d-tech" ? "'Courier New', monospace" : "inherit",
                        letterSpacing: template === "3d-tech" ? "0.1em" : "normal",
                      }}
                    >
                      {c.ctaText}
                    </MagneticButton>
                  )}
                </div>
              </>
            )}

            {formData.city && (
              <p style={{ color: "rgba(255,255,255,0.6)", marginTop: 24, fontSize: 14 }}>
                <MapPin style={{ width: 12, height: 12, display: "inline", verticalAlign: "middle", marginRight: 4 }} />
                {formData.city}
              </p>
            )}
          </div>
        </section>
      </FadeUp>

      {/* ----------------------------------------------------------------- */}
      {/* Footer                                                              */}
      {/* ----------------------------------------------------------------- */}
      <footer style={{
        background: template === "luxury" ? "#050301" : template === "minimal-pro" ? "#fff" : layout.dark ? "#0a0a0a" : "#111",
        color: template === "minimal-pro" ? "#9ca3af" : "#9ca3af",
        padding: template === "minimal-pro" ? "32px 120px" : "24px 40px",
        fontSize: 13,
        borderTop: template === "luxury" ? "1px solid rgba(201,168,76,0.1)" : template === "minimal-pro" ? "1px solid #e5e7eb" : template === "brutalist" ? "none" : layout.dark ? `1px solid ${borderColor}` : "none",
        display: template === "minimal-pro" ? "flex" : "block",
        alignItems: template === "minimal-pro" ? "center" : undefined,
        justifyContent: template === "minimal-pro" ? "space-between" : undefined,
        textAlign: template === "minimal-pro" ? undefined : "center",
      }}>
        {template === "minimal-pro" ? (
          <>
            <span style={{ color: "#111", fontWeight: 300 }}>{formData.businessName}</span>
            <span>© {new Date().getFullYear()} — All rights reserved.</span>
          </>
        ) : (
          <>© {new Date().getFullYear()} {formData.businessName}. All rights reserved.</>
        )}
      </footer>
    </div>
  );
}
