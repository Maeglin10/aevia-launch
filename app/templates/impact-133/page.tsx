"use client";
// @ts-nocheck

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";

/* ==========================================================================
   DESIGN TOKENS
   ========================================================================== */

const C = {
  bg: "#050508",
  bgCard: "#0C0D14",
  bgMid: "#141824",
  violet: "#6B5CF6",
  violetDim: "rgba(107,92,246,0.15)",
  violetBorder: "rgba(107,92,246,0.18)",
  cyan: "#22D3EE",
  cyanDim: "rgba(34,211,238,0.12)",
  cream: "#E8E4FF",
  muted: "#6A7280",
  border: "rgba(107,92,246,0.18)",
  borderFaint: "rgba(255,255,255,0.06)",
  white: "#FFFFFF",
  fontSans: "'Syne', sans-serif",
  fontMono: "'Syne Mono', monospace",
};

/* ==========================================================================
   DATA
   ========================================================================== */

const PROJECTS = [
  {
    id: "01",
    title: "Neo-Tokyo Spire",
    category: "Commercial Tower",
    year: "2031",
    status: "Under Construction",
    location: "Tokyo, JP",
    desc: "An 850-metre parametric superstructure whose latticed exoskeleton shifts load dynamically — eliminating interior columns across 120 habitable floors.",
    tag: "Vertical City",
    color: C.violet,
  },
  {
    id: "02",
    title: "Aether Gardens",
    category: "Residential Arcology",
    year: "2026",
    status: "Completed",
    location: "Singapore",
    desc: "420 metres of stacked biomes: each residential ring cultivates its own micro-climate, irrigated by atmospheric water harvesting drawn from the building's own breath.",
    tag: "Living Structure",
    color: C.cyan,
  },
  {
    id: "03",
    title: "The Kinetic Hub",
    category: "Infrastructure Node",
    year: "2033",
    status: "Planning",
    location: "Rotterdam, NL",
    desc: "A mobility interchange whose roof membrane responds to crowd density, opening kinetic vents above high-traffic zones and sealing in inclement weather — entirely algorithm-driven.",
    tag: "Responsive Skin",
    color: C.violet,
  },
  {
    id: "04",
    title: "Aqua-City Sector 4",
    category: "Floating District",
    year: "2025",
    status: "Completed",
    location: "Osaka Bay, JP",
    desc: "Twelve interlocking floating platforms housing 9,000 residents. Tidal turbines beneath each hull supply 100% of the district's baseload power.",
    tag: "Marine Urbanism",
    color: C.cyan,
  },
];

const SERVICES = [
  {
    label: "Parametric Design",
    desc: "Algorithm-generated form-finding that balances structural integrity with environmental performance. Every curve is computed, never arbitrary.",
    num: "01",
  },
  {
    label: "Urban Planning",
    desc: "District-scale master planning informed by agent-based pedestrian simulation, solar envelope analysis, and 50-year climate projection models.",
    num: "02",
  },
  {
    label: "Speculative Architecture",
    desc: "Near-future speculative briefs translated into construction-ready proposals. We design buildings that will be built — not only imagined.",
    num: "03",
  },
  {
    label: "Digital Twins",
    desc: "Full building-lifecycle digital twins synchronized to live sensor arrays. Real-time structural health, energy load, and occupancy in a single interface.",
    num: "04",
  },
];

const TECH_STACK = [
  { name: "Grasshopper", sub: "Parametric modelling" },
  { name: "Rhino 3D", sub: "NURBS geometry" },
  { name: "Houdini", sub: "Procedural simulation" },
  { name: "Unreal Engine 5", sub: "Real-time render" },
];

const PRESS = [
  { name: "Dezeen", quote: "The most ambitious practice of the decade." },
  { name: "Wallpaper*", quote: "Rewriting what architecture can be." },
  { name: "Monocle", quote: "A studio operating ten years ahead of its peers." },
  { name: "Azure", quote: "Form, data, and ethics in perfect tension." },
];

const MARQUEE_ITEMS = [
  "Neo-Tokyo Spire",
  "Aether Gardens",
  "The Kinetic Hub",
  "Aqua-City Sector 4",
  "Parametric Design",
  "Digital Twins",
  "Speculative Architecture",
];

/* ==========================================================================
   FONT INJECTION
   ========================================================================== */

function useFonts() {
  useEffect(() => {
    const id = "impact133-fonts";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Syne+Mono&display=swap');`;
    document.head.appendChild(style);
  }, []);
}

/* ==========================================================================
   TEXT REVEAL (stagger per word)
   ========================================================================== */

function TextReveal({
  text,
  delay = 0,
  style = {},
}: {
  text: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const words = text.split(" ");
  return (
    <span
      ref={ref}
      style={{ display: "inline-flex", flexWrap: "wrap", gap: "0.3em", ...style }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 28, filter: "blur(4px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{
            duration: 0.65,
            delay: delay + i * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: "inline-block" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ==========================================================================
   MAGNETIC BUTTON
   ========================================================================== */

function MagneticButton({
  children,
  style = {},
  onClick,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18 });
  const springY = useSpring(y, { stiffness: 200, damping: 18 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      x.set((e.clientX - cx) * 0.35);
      y.set((e.clientY - cy) * 0.35);
    },
    [x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY, ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.button>
  );
}

/* ==========================================================================
   SPOTLIGHT CARD
   ========================================================================== */

function SpotlightCard({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]: number[]) =>
      `radial-gradient(300px circle at ${x}px ${y}px, rgba(107,92,246,0.10) 0%, transparent 70%)`
  );

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      style={{
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

/* ==========================================================================
   MARQUEE STRIP
   ========================================================================== */

function MarqueeStrip() {
  const repeated = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div
      style={{
        background: C.bgCard,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        overflow: "hidden",
        padding: "18px 0",
        position: "relative",
      }}
    >
      <motion.div
        style={{ display: "flex", gap: 0, width: "max-content" }}
        animate={{ x: [0, -1 * (MARQUEE_ITEMS.length * 260)] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: C.fontMono,
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: i % 2 === 0 ? C.cream : C.muted,
              padding: "0 40px",
              whiteSpace: "nowrap",
              display: "inline-flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            {item}
            <span style={{ color: C.violet, fontSize: 10 }}>✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ==========================================================================
   PARAMETRIC GRID (Signature Element)
   ========================================================================== */

function ParametricGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);

  const springX = useSpring(rawX, { stiffness: 50, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 50, damping: 20 });

  const skewX = useTransform(springX, [0, 1], [-5, 5]);
  const skewY = useTransform(springY, [0, 1], [-5, 5]);
  const rotateX = useTransform(springY, [0, 1], [4, -4]);
  const rotateY = useTransform(springX, [0, 1], [-6, 6]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      rawX.set((e.clientX - rect.left) / rect.width);
      rawY.set((e.clientY - rect.top) / rect.height);
    },
    [rawX, rawY]
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0.5);
    rawY.set(0.5);
  }, [rawX, rawY]);

  // Build grid lines: 10 vertical + 8 horizontal in 800×500 viewBox
  const cols = 10;
  const rows = 8;
  const W = 800;
  const H = 500;
  const colStep = W / cols;
  const rowStep = H / rows;

  const vLines = Array.from({ length: cols + 1 }, (_, i) => i * colStep);
  const hLines = Array.from({ length: rows + 1 }, (_, i) => i * rowStep);

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        width: "100%",
        cursor: "crosshair",
        userSelect: "none",
      }}
    >
      {/* Perspective wrapper */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          perspective: 800,
        }}
      >
        {/* SVG grid with skew */}
        <motion.svg
          ref={ref}
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            skewX,
            skewY,
            filter: "drop-shadow(0 0 12px rgba(107,92,246,0.18))",
          }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.2 }}
        >
          <defs>
            <radialGradient id="pgFade" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor={C.violet} stopOpacity="0.35" />
              <stop offset="100%" stopColor={C.violet} stopOpacity="0.02" />
            </radialGradient>
          </defs>

          {/* Background fade */}
          <rect width={W} height={H} fill="url(#pgFade)" rx="4" />

          {/* Vertical lines */}
          {vLines.map((x, i) => (
            <motion.line
              key={`v${i}`}
              x1={x}
              y1={0}
              x2={x}
              y2={H}
              stroke={C.violet}
              strokeWidth={i === 0 || i === cols ? 0.5 : 0.4}
              strokeOpacity={0.22}
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.0, delay: i * 0.04 }}
            />
          ))}

          {/* Horizontal lines */}
          {hLines.map((y, i) => (
            <motion.line
              key={`h${i}`}
              x1={0}
              y1={y}
              x2={W}
              y2={y}
              stroke={C.violet}
              strokeWidth={i === 0 || i === rows ? 0.5 : 0.4}
              strokeOpacity={0.22}
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.0, delay: i * 0.06 }}
            />
          ))}

          {/* Intersection dots */}
          {vLines.map((x, vi) =>
            hLines.map((y, hi) => (
              <motion.circle
                key={`dot-${vi}-${hi}`}
                cx={x}
                cy={y}
                r={vi % 2 === 0 && hi % 2 === 0 ? 2.5 : 1.5}
                fill={C.violet}
                fillOpacity={vi % 2 === 0 && hi % 2 === 0 ? 0.5 : 0.2}
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{
                  duration: 0.4,
                  delay: 0.5 + (vi + hi) * 0.018,
                  ease: "backOut",
                }}
              />
            ))
          )}

          {/* Diagonal accent lines */}
          <motion.line
            x1={0}
            y1={0}
            x2={W}
            y2={H}
            stroke={C.cyan}
            strokeWidth={0.6}
            strokeOpacity={0.12}
            strokeDasharray="8 12"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.8 }}
          />
          <motion.line
            x1={W}
            y1={0}
            x2={0}
            y2={H}
            stroke={C.cyan}
            strokeWidth={0.6}
            strokeOpacity={0.12}
            strokeDasharray="8 12"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.5, delay: 1.0 }}
          />

          {/* Central polygon accent */}
          <motion.polygon
            points={`${W / 2},${H * 0.15} ${W * 0.75},${H * 0.5} ${W / 2},${H * 0.85} ${W * 0.25},${H * 0.5}`}
            fill="none"
            stroke={C.violet}
            strokeWidth={0.8}
            strokeOpacity={0.3}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 1.2, delay: 1.2, ease: "backOut" }}
            style={{ transformOrigin: `${W / 2}px ${H / 2}px` }}
          />
        </motion.svg>
      </motion.div>
    </div>
  );
}

/* ==========================================================================
   SECTION: NAV
   ========================================================================== */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 100,
        transition: "background 0.4s ease, border-color 0.4s ease, padding 0.3s ease",
        background: scrolled ? "rgba(5,5,8,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
        padding: scrolled ? "14px 0" : "24px 0",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <polygon
              points="16,2 30,10 30,22 16,30 2,22 2,10"
              stroke={C.violet}
              strokeWidth="1.5"
              fill="none"
            />
            <polygon
              points="16,8 24,13 24,20 16,24 8,20 8,13"
              fill={C.violet}
              fillOpacity="0.18"
              stroke={C.violet}
              strokeWidth="1"
            />
            <circle cx="16" cy="16" r="3" fill={C.violet} />
          </svg>
          <span
            style={{
              fontFamily: C.fontSans,
              fontWeight: 800,
              fontSize: 18,
              letterSpacing: "0.06em",
              color: C.cream,
            }}
          >
            FORMA
            <span style={{ color: C.violet }}>.STUDIO</span>
          </span>
        </div>

        {/* Nav links — hidden on mobile */}
        <div
          className="forma-navlinks"
          style={{
            display: "flex",
            gap: 40,
            fontFamily: C.fontMono,
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: C.muted,
          }}
        >
          {["Projects", "Services", "Manifesto", "Technology", "Contact"].map(
            (item) => (
              <motion.a
                key={item}
                onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({behavior:"smooth"})}
                whileHover={{ color: C.cream }}
                style={{ color: C.muted, textDecoration: "none", transition: "color 0.2s", cursor: "pointer" }}
              >
                {item}
              </motion.a>
            )
          )}
        </div>

        {/* CTA — hidden on mobile */}
        <div className="forma-cta">
        <MagneticButton
          style={{
            padding: "10px 24px",
            background: C.violetDim,
            border: `1px solid ${C.border}`,
            borderRadius: 4,
            color: C.cream,
            fontFamily: C.fontMono,
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase" as const,
            cursor: "pointer",
          }}
        >
          Commission
        </MagneticButton>
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="forma-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 4 }}
        >
          <span style={{ display: "block", width: 24, height: 1.5, background: C.cream, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.cream, transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 1.5, background: C.cream, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{ display: "none" }} className="forma-mobile-menu">
          <div style={{
            padding: "32px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}>
            {["Projects", "Services", "Manifesto", "Technology", "Contact"].map(item => (
              <a
                key={item}
                onClick={() => { document.getElementById(item.toLowerCase())?.scrollIntoView({behavior:"smooth"}); setMobileOpen(false); }}
                style={{ fontFamily: C.fontMono, fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted, textDecoration: "none", cursor: "pointer" }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .forma-navlinks { display: none !important; }
          .forma-cta { display: none !important; }
          .forma-burger { display: flex !important; }
          .forma-mobile-menu { display: block !important; background: rgba(5,5,8,0.97); border-top: 1px solid rgba(255,255,255,0.08); }
        }
      `}</style>
    </nav>
  );
}

/* ==========================================================================
   SECTION: HERO
   ========================================================================== */

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Animated particles
  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: `${5 + Math.random() * 90}%`,
    y: `${5 + Math.random() * 90}%`,
    size: 1 + Math.random() * 2.5,
    delay: Math.random() * 3,
    dur: 3 + Math.random() * 4,
  }));

  return (
    <section id="hero"
      ref={ref}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: C.bg,
      }}
    >
      {/* Geometric background particles */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: p.id % 3 === 0 ? C.violet : p.id % 3 === 1 ? C.cyan : C.cream,
            }}
            animate={{
              opacity: [0.1, 0.7, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: p.dur,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Large geometric accent rings */}
        <motion.div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 700,
            height: 700,
            border: `1px solid ${C.violetBorder}`,
            borderRadius: "50%",
            transform: "translate(-50%,-50%)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 500,
            height: 500,
            border: `1px solid rgba(34,211,238,0.08)`,
            borderRadius: "50%",
            transform: "translate(-50%,-50%)",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 300,
            height: 300,
            border: `1px solid ${C.violetBorder}`,
            transform: "translate(-50%,-50%) rotate(45deg)",
          }}
          animate={{ rotate: [45, 405] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 900,
          height: 500,
          background: "radial-gradient(ellipse at center, rgba(107,92,246,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Hero copy */}
      <motion.div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          padding: "0 24px",
          maxWidth: 1200,
          y,
          opacity,
        }}
      >
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            fontFamily: C.fontMono,
            fontSize: 11,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: C.violet,
            display: "block",
            marginBottom: 28,
          }}
        >
          Speculative Architecture & Urban Design Studio — Est. 2019
        </motion.span>

        <h1
          style={{
            fontFamily: C.fontSans,
            fontWeight: 800,
            fontSize: "clamp(56px, 9vw, 130px)",
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            color: C.cream,
            marginBottom: 36,
          }}
        >
          <TextReveal text="We Build" delay={0.1} />
          <br />
          <TextReveal
            text="The Future"
            delay={0.3}
            style={{ color: C.violet }}
          />
          <br />
          <TextReveal text="Of Cities." delay={0.5} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          style={{
            fontFamily: C.fontSans,
            fontWeight: 400,
            fontSize: 18,
            color: C.muted,
            maxWidth: 560,
            margin: "0 auto 48px",
            lineHeight: 1.65,
          }}
        >
          Forma Studio fuses parametric computation with speculative vision —
          producing architecture that is alive, adaptive, and unmistakably of
          its moment.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1 }}
          style={{ display: "flex", justifyContent: "center", gap: 16 }}
        >
          <MagneticButton
            style={{
              padding: "16px 40px",
              background: C.violet,
              border: "none",
              borderRadius: 4,
              color: C.white,
              fontFamily: C.fontMono,
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase" as const,
              cursor: "pointer",
            }}
          >
            View Projects
          </MagneticButton>
          <MagneticButton
            style={{
              padding: "16px 40px",
              background: "transparent",
              border: `1px solid ${C.border}`,
              borderRadius: 4,
              color: C.cream,
              fontFamily: C.fontMono,
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase" as const,
              cursor: "pointer",
            }}
          >
            Studio Manifesto
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          fontFamily: C.fontMono,
          fontSize: 10,
          letterSpacing: "0.2em",
          color: C.muted,
          textTransform: "uppercase",
        }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      >
        <span>Scroll</span>
        <motion.div
          style={{
            width: 1,
            height: 48,
            background: `linear-gradient(to bottom, ${C.violet}, transparent)`,
          }}
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}

/* ==========================================================================
   SECTION: PARAMETRIC GRID (Signature)
   ========================================================================== */

function ParametricSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="parametric"
      ref={ref}
      style={{
        background: C.bgMid,
        padding: "120px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "0 40px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "center",
        }}
      >
        {/* Left: grid */}
        <div>
          <ParametricGrid />
          <p
            style={{
              fontFamily: C.fontMono,
              fontSize: 10,
              color: C.muted,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginTop: 16,
              textAlign: "center",
            }}
          >
            Move cursor over grid — parametric deformation active
          </p>
        </div>

        {/* Right: text */}
        <div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7 }}
            style={{
              fontFamily: C.fontMono,
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: C.violet,
              display: "block",
              marginBottom: 24,
            }}
          >
            Studio Philosophy
          </motion.span>

          <h2
            style={{
              fontFamily: C.fontSans,
              fontWeight: 800,
              fontSize: "clamp(36px, 4vw, 58px)",
              lineHeight: 1.05,
              color: C.cream,
              marginBottom: 28,
              letterSpacing: "-0.02em",
            }}
          >
            <TextReveal text="Architecture is" delay={0.1} />
            <br />
            <TextReveal text="a living algorithm." delay={0.3} style={{ color: C.violet }} />
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              fontFamily: C.fontSans,
              fontSize: 16,
              lineHeight: 1.75,
              color: C.muted,
              marginBottom: 20,
            }}
          >
            We treat every structural decision as a parameter — a variable in
            an ongoing computation. Our buildings do not just stand; they
            optimise, adapt, and respond to the living systems around them.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.65 }}
            style={{
              fontFamily: C.fontSans,
              fontSize: 16,
              lineHeight: 1.75,
              color: C.muted,
              marginBottom: 40,
            }}
          >
            Parametric design is not aesthetic decoration. It is the engine
            by which we derive form from force, material constraint, and the
            precise demands of climate and culture.
          </motion.p>

          <div style={{ display: "flex", gap: 40 }}>
            {[
              { val: "14", label: "Projects Built" },
              { val: "8", label: "Countries" },
              { val: "4", label: "Awards 2025" },
            ].map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.8 }}
              >
                <div
                  style={{
                    fontFamily: C.fontSans,
                    fontWeight: 800,
                    fontSize: 40,
                    color: C.cream,
                    lineHeight: 1,
                  }}
                >
                  {s.val}
                </div>
                <div
                  style={{
                    fontFamily: C.fontMono,
                    fontSize: 10,
                    color: C.muted,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    marginTop: 6,
                  }}
                >
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   SECTION: PROJECTS
   ========================================================================== */

function ProjectsSection() {
  const [hovered, setHovered] = useState<string | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="projects"
      ref={ref}
      style={{ background: C.bg, padding: "120px 0", position: "relative" }}
    >
      <div
        style={{
          position: "absolute",
          top: "30%",
          right: "10%",
          width: 600,
          height: 600,
          background: "radial-gradient(ellipse, rgba(107,92,246,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 40px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 72,
          }}
        >
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7 }}
              style={{
                fontFamily: C.fontMono,
                fontSize: 11,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: C.violet,
                display: "block",
                marginBottom: 16,
              }}
            >
              Selected Work
            </motion.span>
            <h2
              style={{
                fontFamily: C.fontSans,
                fontWeight: 800,
                fontSize: "clamp(40px, 5vw, 72px)",
                lineHeight: 1,
                color: C.cream,
                letterSpacing: "-0.025em",
              }}
            >
              <TextReveal text="Projects" delay={0.1} />
            </h2>
          </div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{
              fontFamily: C.fontMono,
              fontSize: 11,
              color: C.muted,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              paddingBottom: 8,
            }}
          >
            4 Landmark Structures
          </motion.span>
        </div>

        {/* Project cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 24,
          }}
        >
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              onMouseEnter={() => setHovered(project.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <SpotlightCard
                style={{
                  background: C.bgCard,
                  border: `1px solid ${hovered === project.id ? project.color + "44" : C.border}`,
                  borderRadius: 8,
                  padding: 40,
                  minHeight: 320,
                  transition: "border-color 0.3s ease",
                  cursor: "pointer",
                }}
              >
                {/* Card top */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 32,
                  }}
                >
                  <span
                    style={{
                      fontFamily: C.fontMono,
                      fontSize: 11,
                      color: project.color,
                      letterSpacing: "0.2em",
                    }}
                  >
                    {project.id}
                  </span>
                  <span
                    style={{
                      fontFamily: C.fontMono,
                      fontSize: 10,
                      color: C.muted,
                      background: C.bgMid,
                      border: `1px solid ${C.borderFaint}`,
                      padding: "4px 10px",
                      borderRadius: 2,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    {project.status}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: C.fontSans,
                    fontWeight: 700,
                    fontSize: 28,
                    color: C.cream,
                    marginBottom: 8,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {project.title}
                </h3>

                <div
                  style={{
                    fontFamily: C.fontMono,
                    fontSize: 11,
                    color: project.color,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    marginBottom: 20,
                  }}
                >
                  {project.tag}
                </div>

                {/* AnimatePresence hover details */}
                <AnimatePresence>
                  {hovered === project.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35 }}
                      style={{ overflow: "hidden" }}
                    >
                      <p
                        style={{
                          fontFamily: C.fontSans,
                          fontSize: 14,
                          color: C.muted,
                          lineHeight: 1.7,
                          marginBottom: 24,
                        }}
                      >
                        {project.desc}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Card footer */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 24,
                    paddingTop: 20,
                    borderTop: `1px solid ${C.borderFaint}`,
                  }}
                >
                  <div style={{ display: "flex", gap: 24 }}>
                    <div>
                      <div
                        style={{
                          fontFamily: C.fontMono,
                          fontSize: 10,
                          color: C.muted,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          marginBottom: 4,
                        }}
                      >
                        Location
                      </div>
                      <div
                        style={{
                          fontFamily: C.fontSans,
                          fontWeight: 600,
                          fontSize: 13,
                          color: C.cream,
                        }}
                      >
                        {project.location}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: C.fontMono,
                          fontSize: 10,
                          color: C.muted,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          marginBottom: 4,
                        }}
                      >
                        Year
                      </div>
                      <div
                        style={{
                          fontFamily: C.fontSans,
                          fontWeight: 600,
                          fontSize: 13,
                          color: C.cream,
                        }}
                      >
                        {project.year}
                      </div>
                    </div>
                  </div>

                  <motion.div
                    animate={{
                      x: hovered === project.id ? 4 : 0,
                      color: hovered === project.id ? project.color : C.muted,
                    }}
                    transition={{ duration: 0.2 }}
                    style={{
                      fontFamily: C.fontMono,
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                    }}
                  >
                    View →
                  </motion.div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   SECTION: SERVICES
   ========================================================================== */

function ServicesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="services"
      ref={ref}
      style={{ background: C.bgMid, padding: "120px 0", position: "relative" }}
    >
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 40px" }}>
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7 }}
          style={{
            fontFamily: C.fontMono,
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: C.violet,
            display: "block",
            marginBottom: 16,
          }}
        >
          What We Do
        </motion.span>

        <h2
          style={{
            fontFamily: C.fontSans,
            fontWeight: 800,
            fontSize: "clamp(40px, 5vw, 72px)",
            lineHeight: 1,
            color: C.cream,
            letterSpacing: "-0.025em",
            marginBottom: 72,
          }}
        >
          <TextReveal text="Services" delay={0.1} />
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 2,
          }}
        >
          {SERVICES.map((svc, i) => (
            <motion.div
              key={svc.num}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.1 }}
            >
              <SpotlightCard
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  padding: "40px 32px",
                  height: "100%",
                  minHeight: 320,
                  display: "flex",
                  flexDirection: "column",
                  transition: "border-color 0.3s",
                  cursor: "default",
                }}
              >
                <span
                  style={{
                    fontFamily: C.fontMono,
                    fontSize: 11,
                    color: C.violet,
                    letterSpacing: "0.2em",
                    marginBottom: 32,
                    display: "block",
                  }}
                >
                  {svc.num}
                </span>
                <h3
                  style={{
                    fontFamily: C.fontSans,
                    fontWeight: 700,
                    fontSize: 20,
                    color: C.cream,
                    marginBottom: 16,
                    lineHeight: 1.2,
                  }}
                >
                  {svc.label}
                </h3>
                <p
                  style={{
                    fontFamily: C.fontSans,
                    fontSize: 14,
                    color: C.muted,
                    lineHeight: 1.7,
                    flexGrow: 1,
                  }}
                >
                  {svc.desc}
                </p>
                <div
                  style={{
                    marginTop: 32,
                    width: 32,
                    height: 1,
                    background: C.violet,
                    opacity: 0.5,
                  }}
                />
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   SECTION: MANIFESTO
   ========================================================================== */

function ManifestoSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const lines = [
    "Architecture is not decoration.",
    "It is the material consequence",
    "of how we choose to live.",
    "We choose to live",
    "without compromise.",
  ];

  return (
    <section
      id="manifesto"
      ref={ref}
      style={{
        background: C.bg,
        padding: "160px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background accent */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 50% at 50% 50%, rgba(107,92,246,0.07) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 40px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7 }}
          style={{
            fontFamily: C.fontMono,
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: C.violet,
            display: "block",
            marginBottom: 60,
            textAlign: "center",
          }}
        >
          Our Manifesto
        </motion.span>

        <div style={{ textAlign: "center" }}>
          {lines.map((line, i) => (
            <div key={i} style={{ overflow: "hidden", lineHeight: 1.1, marginBottom: 4 }}>
              <motion.div
                initial={{ y: "110%", opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{
                  duration: 0.85,
                  delay: i * 0.14,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  fontFamily: C.fontSans,
                  fontWeight: 800,
                  fontSize: "clamp(32px, 5.5vw, 80px)",
                  letterSpacing: "-0.03em",
                  color: i === 3 || i === 4 ? C.violet : C.cream,
                  display: "block",
                }}
              >
                {line}
              </motion.div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.9 }}
          style={{
            width: 80,
            height: 2,
            background: C.violet,
            margin: "64px auto 0",
            transformOrigin: "left",
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.1 }}
          style={{
            fontFamily: C.fontSans,
            fontSize: 18,
            color: C.muted,
            textAlign: "center",
            maxWidth: 560,
            margin: "32px auto 0",
            lineHeight: 1.7,
          }}
        >
          Forma Studio was founded on the belief that architecture must earn
          the right to exist — through structural clarity, ecological
          honesty, and visionary daring.
        </motion.p>
      </div>
    </section>
  );
}

/* ==========================================================================
   SECTION: TECHNOLOGY STACK
   ========================================================================== */

function TechnologySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="technology"
      ref={ref}
      style={{ background: C.bgMid, padding: "120px 0", position: "relative" }}
    >
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 100, alignItems: "start" }}>
          {/* Left */}
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7 }}
              style={{
                fontFamily: C.fontMono,
                fontSize: 11,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: C.violet,
                display: "block",
                marginBottom: 16,
              }}
            >
              Our Toolkit
            </motion.span>

            <h2
              style={{
                fontFamily: C.fontSans,
                fontWeight: 800,
                fontSize: "clamp(36px, 4vw, 60px)",
                lineHeight: 1.05,
                color: C.cream,
                letterSpacing: "-0.025em",
                marginBottom: 28,
              }}
            >
              <TextReveal text="Built with the" delay={0.1} />
              <br />
              <TextReveal
                text="industry's finest"
                delay={0.25}
                style={{ color: C.violet }}
              />
              <br />
              <TextReveal text="instruments." delay={0.4} />
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.65 }}
              style={{
                fontFamily: C.fontSans,
                fontSize: 16,
                color: C.muted,
                lineHeight: 1.75,
              }}
            >
              We combine computational design tools with real-time rendering
              pipelines. Every deliverable — from concept to construction
              document — passes through an integrated digital ecosystem.
            </motion.p>
          </div>

          {/* Right: tool cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 8 }}>
            {TECH_STACK.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.65, delay: i * 0.12 }}
                whileHover={{ x: 6 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "28px 32px",
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  cursor: "default",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: C.fontSans,
                      fontWeight: 700,
                      fontSize: 20,
                      color: C.cream,
                      marginBottom: 4,
                    }}
                  >
                    {tool.name}
                  </div>
                  <div
                    style={{
                      fontFamily: C.fontMono,
                      fontSize: 11,
                      color: C.muted,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    {tool.sub}
                  </div>
                </div>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    border: `1px solid ${C.border}`,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: C.violet,
                    fontFamily: C.fontMono,
                    fontSize: 16,
                  }}
                >
                  →
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   SECTION: PRESS / COLLABORATIONS
   ========================================================================== */

function PressSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      style={{ background: C.bg, padding: "120px 0", position: "relative" }}
    >
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 40px" }}>
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7 }}
          ref={ref}
          style={{
            fontFamily: C.fontMono,
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: C.violet,
            display: "block",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Press & Recognition
        </motion.span>

        <h2
          style={{
            fontFamily: C.fontSans,
            fontWeight: 800,
            fontSize: "clamp(36px, 4.5vw, 64px)",
            lineHeight: 1.05,
            color: C.cream,
            letterSpacing: "-0.025em",
            marginBottom: 80,
            textAlign: "center",
          }}
        >
          <TextReveal text="What the world says." delay={0.1} />
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 1,
            borderTop: `1px solid ${C.border}`,
            borderLeft: `1px solid ${C.border}`,
          }}
        >
          {PRESS.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.1 }}
              style={{
                padding: "48px 32px",
                background: C.bgCard,
                borderRight: `1px solid ${C.border}`,
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <div
                style={{
                  fontFamily: C.fontSans,
                  fontWeight: 800,
                  fontSize: 22,
                  color: C.violet,
                  marginBottom: 20,
                }}
              >
                {item.name}
              </div>
              <p
                style={{
                  fontFamily: C.fontSans,
                  fontSize: 15,
                  color: C.muted,
                  lineHeight: 1.65,
                  fontStyle: "italic",
                }}
              >
                &ldquo;{item.quote}&rdquo;
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   SECTION: CONTACT + FOOTER
   ========================================================================== */

function ContactFooter() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <footer
      id="contact"
      ref={ref}
      style={{
        background: C.bgCard,
        borderTop: `1px solid ${C.border}`,
        padding: "120px 0 48px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid bg */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${C.violetBorder} 1px, transparent 1px), linear-gradient(90deg, ${C.violetBorder} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: 0.18,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "0 40px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* CTA headline */}
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7 }}
            style={{
              fontFamily: C.fontMono,
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: C.violet,
              display: "block",
              marginBottom: 24,
            }}
          >
            Start a Conversation
          </motion.span>

          <h2
            style={{
              fontFamily: C.fontSans,
              fontWeight: 800,
              fontSize: "clamp(40px, 6vw, 88px)",
              lineHeight: 1,
              color: C.cream,
              letterSpacing: "-0.03em",
              marginBottom: 40,
            }}
          >
            <TextReveal text="Let's build" delay={0.1} />
            <br />
            <TextReveal text="something" delay={0.25} />
            <br />
            <TextReveal text="impossible." delay={0.4} style={{ color: C.violet }} />
          </h2>

          <MagneticButton
            style={{
              padding: "20px 56px",
              background: C.violet,
              border: "none",
              borderRadius: 4,
              color: C.white,
              fontFamily: C.fontMono,
              fontSize: 13,
              letterSpacing: "0.14em",
              textTransform: "uppercase" as const,
              cursor: "pointer",
            }}
          >
            Commission a Project
          </MagneticButton>
        </div>

        {/* Footer grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
            paddingTop: 64,
            borderTop: `1px solid ${C.border}`,
            marginBottom: 48,
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                <polygon
                  points="16,2 30,10 30,22 16,30 2,22 2,10"
                  stroke={C.violet}
                  strokeWidth="1.5"
                  fill="none"
                />
                <circle cx="16" cy="16" r="3" fill={C.violet} />
              </svg>
              <span
                style={{
                  fontFamily: C.fontSans,
                  fontWeight: 800,
                  fontSize: 16,
                  color: C.cream,
                  letterSpacing: "0.06em",
                }}
              >
                FORMA<span style={{ color: C.violet }}>.STUDIO</span>
              </span>
            </div>
            <p
              style={{
                fontFamily: C.fontSans,
                fontSize: 14,
                color: C.muted,
                lineHeight: 1.7,
                maxWidth: 280,
              }}
            >
              Speculative architecture and parametric urban design. We operate at
              the intersection of data, climate, and human ambition.
            </p>
          </div>

          {[
            {
              title: "Studio",
              links: ["Projects", "Services", "Process", "Awards"],
            },
            {
              title: "Connect",
              links: ["Instagram", "LinkedIn", "Are.na", "Dezeen"],
            },
            {
              title: "Offices",
              links: ["Tokyo, JP", "Rotterdam, NL", "London, UK", "Singapore"],
            },
          ].map((col) => (
            <div key={col.title}>
              <div
                style={{
                  fontFamily: C.fontMono,
                  fontSize: 10,
                  color: C.violet,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                {col.title}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {col.links.map((link) => (
                  <li key={link} style={{ marginBottom: 12 }}>
                    <motion.a
                      href="#pgFade"
                      whileHover={{ color: C.cream, x: 3 }}
                      style={{
                        fontFamily: C.fontSans,
                        fontSize: 14,
                        color: C.muted,
                        textDecoration: "none",
                        display: "block",
                        transition: "color 0.2s",
                      }}
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 24,
            borderTop: `1px solid ${C.borderFaint}`,
            fontFamily: C.fontMono,
            fontSize: 10,
            color: C.muted,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <span>&copy; {new Date().getFullYear()} Forma Studio. All rights reserved.</span>
          <span style={{ color: C.violet }}>
            Parametric Design — Urban Planning — Speculative Architecture
          </span>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy", "Terms", "Accessibility"].map((item) => (
              <motion.a
                key={item}
                href="#pgFade"
                whileHover={{ color: C.cream }}
                style={{ color: C.muted, textDecoration: "none" }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ==========================================================================
   ROOT PAGE
   ========================================================================== */


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Impact133Page() {
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
  c = session?.generatedContent;
  brand = fd?.brandColor ?? null; // null = keep template's original color

  useFonts();

  
  // Dynamic Services & Testimonials Mutation for Session Data
  useEffect(() => {
    if (c?.services) {
      const services_arrays = [
        typeof SERVICES !== 'undefined' ? SERVICES : null,
        typeof features !== 'undefined' ? features : null,
        typeof services !== 'undefined' ? services : null,
        typeof FEATURES !== 'undefined' ? FEATURES : null,
      ];
      services_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((s, idx) => {
            if (idx < 3 && c.services[idx]) {
              if (s && typeof s === 'object') {
                s.title = c.services[idx].title ?? s.title;
                if ('desc' in s) s.desc = c.services[idx].description ?? s.desc;
                if ('description' in s) s.description = c.services[idx].description ?? s.description;
              }
            }
          });
        }
      });
    }
    if (c?.testimonials) {
      const testimonials_arrays = [
        typeof TESTIMONIALS !== 'undefined' ? TESTIMONIALS : null,
        typeof testimonials !== 'undefined' ? testimonials : null,
        typeof REVIEWS !== 'undefined' ? REVIEWS : null,
        typeof reviews !== 'undefined' ? reviews : null,
      ];
      testimonials_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((t, idx) => {
            if (idx < 3 && c.testimonials[idx]) {
              if (t && typeof t === 'object') {
                t.name = c.testimonials[idx].name ?? t.name;
                if ('role' in t) t.role = c.testimonials[idx].role ?? t.role;
                if ('text' in t) t.text = c.testimonials[idx].text ?? t.text;
                if ('quote' in t) t.quote = c.testimonials[idx].text ?? t.quote;
                if ('desc' in t) t.desc = c.testimonials[idx].text ?? t.desc;
              }
            }
          });
        }
      });
    }
  }, [c]);
return (
    <div
      style={{
        background: C.bg,
        color: C.cream,
        fontFamily: C.fontSans,
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Nav />
      <HeroSection />
      <MarqueeStrip />
      <ParametricSection />
      <ProjectsSection />
      <ServicesSection />
      <ManifestoSection />
      <TechnologySection />
      <PressSection />
      <ContactFooter />
    </div>
  );
}
