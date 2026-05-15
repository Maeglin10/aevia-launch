"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

/* ─── Design Tokens ─────────────────────────────────────────── */
const C = {
  bg:      "#080C06",
  bgCard:  "#111708",
  bgMid:   "#1A2112",
  green:   "#4A6741",
  moss:    "#8B9E6F",
  amber:   "#C8943A",
  cream:   "#F2EAD6",
  muted:   "#8A8E7A",
  border:  "rgba(138,158,111,0.15)",
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');`;

/* ─── Data ───────────────────────────────────────────────────── */
const SERIES = [
  {
    id: 1,
    title: "Boreal Silence",
    location: "Lapland, Finland",
    year: "2024",
    prints: 12,
    category: "Wilderness",
    aspect: "3/2",
    bg: "linear-gradient(160deg, #1C2B0F 0%, #2A3D1A 60%, #3D5228 100%)",
    accent: "#6B9E42",
  },
  {
    id: 2,
    title: "After the Rain",
    location: "Olympic Rainforest, WA",
    year: "2024",
    prints: 8,
    category: "Forest",
    aspect: "2/3",
    bg: "linear-gradient(160deg, #0F1E18 0%, #1A3028 60%, #253D30 100%)",
    accent: "#4A8E7A",
  },
  {
    id: 3,
    title: "Golden Hour Atlas",
    location: "Dolomites, Italy",
    year: "2023",
    prints: 15,
    category: "Mountain",
    aspect: "3/2",
    bg: "linear-gradient(160deg, #2B1A08 0%, #3D2810 60%, #5C3D18 100%)",
    accent: "#C8943A",
  },
  {
    id: 4,
    title: "Fog & Fern",
    location: "Faroe Islands",
    year: "2023",
    prints: 6,
    category: "Coastal",
    aspect: "2/3",
    bg: "linear-gradient(160deg, #111820 0%, #1A2530 60%, #253040 100%)",
    accent: "#6A8EA8",
  },
  {
    id: 5,
    title: "Root System",
    location: "Black Forest, Germany",
    year: "2023",
    prints: 10,
    category: "Forest",
    aspect: "1/1",
    bg: "linear-gradient(160deg, #120E08 0%, #1E1808 60%, #2A2210 100%)",
    accent: "#8B7040",
  },
  {
    id: 6,
    title: "First Light",
    location: "Yosemite, California",
    year: "2022",
    prints: 20,
    category: "Wilderness",
    aspect: "3/2",
    bg: "linear-gradient(160deg, #1A1208 0%, #2B2010 60%, #3D2E18 100%)",
    accent: "#E0A840",
  },
];

const EXHIBITIONS = [
  { year: "2025", title: "Primordial", venue: "Galerie Binôme", city: "Paris" },
  { year: "2024", title: "Undisturbed", venue: "FOAM Photography Museum", city: "Amsterdam" },
  { year: "2024", title: "Depth of Field", venue: "Aperture Foundation", city: "New York" },
  { year: "2023", title: "Threshold", venue: "Rencontres d'Arles", city: "Arles" },
];

const PRESS = [
  { quote: "Images that breathe — each frame holds the patience of hours, the weight of silence.", source: "Le Monde", author: "Claire Dumont" },
  { quote: "Léa Rousseau doesn't photograph landscapes. She photographs the feeling of standing inside them.", source: "Aperture Magazine", author: "Mark Tobias" },
  { quote: "A singular eye. What you see through her lens, you cannot unsee.", source: "British Journal of Photography", author: "Sarah Chen" },
];

const LOCATIONS = [
  "Finland", "Norway", "Faroe Islands", "Patagonia", "Lapland",
  "Dolomites", "Black Forest", "Olympic Peninsula", "Yosemite", "Hokkaido",
];

const CATEGORIES = ["All", "Wilderness", "Forest", "Mountain", "Coastal"];

/* ─── TextReveal ─────────────────────────────────────────────── */
function TextReveal({ text, delay = 0, style = {} }: { text: string; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} style={{ overflow: "hidden", ...style }}>
      <motion.div
        initial={{ y: "110%" }}
        animate={inView ? { y: 0 } : { y: "110%" }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {text}
      </motion.div>
    </div>
  );
}

/* ─── MagneticButton ─────────────────────────────────────────── */
function MagneticButton({ children, style = {}, onClick }: { children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });
  const ref = useRef<HTMLButtonElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.35);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy, cursor: "pointer", background: "none", border: "none", ...style }}
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

/* ─── MarqueeStrip ───────────────────────────────────────────── */
function MarqueeStrip() {
  const items = [...LOCATIONS, ...LOCATIONS];
  return (
    <div style={{ overflow: "hidden", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "12px 0" }}>
      <motion.div
        style={{ display: "flex", gap: 64, whiteSpace: "nowrap" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {items.map((loc, i) => (
          <span key={i} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, letterSpacing: "0.2em", color: C.muted, textTransform: "uppercase" }}>
            {loc}
            <span style={{ marginLeft: 64, color: C.green }}>✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── DepthLayers — Signature Element ───────────────────────── */
function DepthLayers() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smx = useSpring(mouseX, { stiffness: 60, damping: 18 });
  const smy = useSpring(mouseY, { stiffness: 60, damping: 18 });

  // Each layer translates at different multiplier (foreground moves more)
  const l1x = useTransform(smx, [-1, 1], ["-24px", "24px"]);
  const l1y = useTransform(smy, [-1, 1], ["-16px", "16px"]);
  const l2x = useTransform(smx, [-1, 1], ["-14px", "14px"]);
  const l2y = useTransform(smy, [-1, 1], ["-10px", "10px"]);
  const l3x = useTransform(smx, [-1, 1], ["-6px", "6px"]);
  const l3y = useTransform(smy, [-1, 1], ["-4px", "4px"]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - r.left) / r.width) * 2 - 1);
    mouseY.set(((e.clientY - r.top) / r.height) * 2 - 1);
  }, [mouseX, mouseY]);

  const onMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ position: "relative", width: "100%", aspectRatio: "16/9", maxHeight: 560, overflow: "hidden", borderRadius: 4, cursor: "crosshair" }}
    >
      {/* Background layer — sky / distant mountains */}
      <motion.div style={{ x: l3x, y: l3y, position: "absolute", inset: "-20px", background: "linear-gradient(180deg, #0A1505 0%, #1A2E0A 35%, #243318 60%, #1C2A12 100%)" }} />

      {/* Mid layer — rolling hills */}
      <motion.div
        style={{ x: l2x, y: l2y, position: "absolute", inset: "-20px" }}
      >
        <svg viewBox="0 0 1440 560" style={{ position: "absolute", bottom: 0, left: 0, width: "120%", height: "60%" }} preserveAspectRatio="none">
          <path d="M-40,560 L-40,260 Q180,160 360,200 Q540,240 720,180 Q900,120 1080,160 Q1260,200 1480,140 L1480,560 Z" fill="#243318" opacity="0.9" />
          <path d="M-40,560 L-40,310 Q200,240 440,280 Q680,320 880,260 Q1080,200 1280,240 L1480,220 L1480,560 Z" fill="#1A2C0E" opacity="0.8" />
        </svg>
        {/* Distant pine silhouettes */}
        <svg viewBox="0 0 1440 560" style={{ position: "absolute", bottom: 0, left: 0, width: "120%", height: "50%" }} preserveAspectRatio="none">
          {[0, 80, 160, 240, 320, 400, 480, 560, 640, 720, 800, 880, 960, 1040, 1120, 1200, 1280, 1360].map((x, i) => (
            <polygon key={i} points={`${x},560 ${x + 14},${300 + Math.sin(i * 1.3) * 40} ${x + 28},560`} fill="#0F1A08" opacity={0.6 + (i % 3) * 0.1} />
          ))}
        </svg>
      </motion.div>

      {/* Foreground layer — close trees */}
      <motion.div style={{ x: l1x, y: l1y, position: "absolute", inset: "-20px" }}>
        <svg viewBox="0 0 1440 560" style={{ position: "absolute", bottom: 0, left: 0, width: "120%", height: "70%" }} preserveAspectRatio="none">
          {[
            [60, 340, 50], [160, 280, 62], [260, 320, 45], [380, 260, 70],
            [500, 300, 55], [620, 270, 65], [780, 290, 58], [920, 260, 72],
            [1060, 300, 50], [1180, 270, 64], [1300, 310, 48], [1400, 280, 60],
          ].map(([x, y, w], i) => (
            <g key={i}>
              <polygon points={`${x},560 ${x + w / 2},${y} ${x + w},560`} fill="#060D04" />
              <polygon points={`${x + 8},560 ${x + w / 2},${y + 50} ${x + w - 8},560`} fill="#0A1508" />
            </g>
          ))}
        </svg>

        {/* Foreground ferns */}
        <svg viewBox="0 0 1440 560" style={{ position: "absolute", bottom: 0, left: 0, width: "120%", height: "30%" }} preserveAspectRatio="none">
          {[0, 100, 220, 360, 500, 660, 820, 980, 1120, 1280].map((x, i) => (
            <g key={i} transform={`translate(${x}, 420)`}>
              <ellipse cx={30} cy={60} rx={40} ry={20} fill="#111D09" opacity={0.85} transform={`rotate(${-15 + i * 7})`} />
              <ellipse cx={50} cy={70} rx={35} ry={18} fill="#0D1807" opacity={0.7} transform={`rotate(${10 + i * 5})`} />
            </g>
          ))}
        </svg>
      </motion.div>

      {/* Light rays */}
      <motion.div
        style={{ x: l3x, y: l3y, position: "absolute", inset: "-20px", background: "radial-gradient(ellipse 60% 40% at 50% 20%, rgba(200,148,58,0.10) 0%, transparent 70%)", mixBlendMode: "screen", pointerEvents: "none" }}
      />

      {/* Mist effect */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "35%", background: "linear-gradient(to top, rgba(8,12,6,0.8) 0%, transparent 100%)", pointerEvents: "none" }} />

      {/* Label */}
      <div style={{ position: "absolute", bottom: 28, left: 32, pointerEvents: "none" }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.3em", color: C.moss, textTransform: "uppercase", marginBottom: 6 }}>INTERACTIVE DEPTH</p>
        <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: 13, color: C.muted }}>Move your cursor to reveal layers</p>
      </div>

      {/* Depth indicator — 3 dots */}
      <div style={{ position: "absolute", top: 24, right: 24, display: "flex", flexDirection: "column", gap: 6 }}>
        {["Foreground", "Midground", "Background"].map((label, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: i === 0 ? C.amber : i === 1 ? C.moss : C.green, opacity: 1 - i * 0.2 }} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, letterSpacing: "0.15em", color: C.muted, textTransform: "uppercase" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── SeriesCard ─────────────────────────────────────────────── */
function SeriesCard({ series }: { series: typeof SERIES[0] }) {
  const [hovered, setHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - r.left);
    mouseY.set(e.clientY - r.top);
  };

  const spotBg = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(280px circle at ${x}px ${y}px, rgba(138,158,111,0.12) 0%, transparent 70%), ${series.bg}`
  );

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: spotBg as any, borderRadius: 4, overflow: "hidden", cursor: "pointer", border: `1px solid ${C.border}`, position: "relative" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Photo placeholder */}
      <div style={{ aspectRatio: series.aspect, background: series.bg, position: "relative", overflow: "hidden" }}>
        {/* Simulated landscape scene */}
        <svg width="100%" height="100%" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice">
          <rect width="400" height="280" fill="transparent" />
          {/* Sky gradient */}
          <defs>
            <linearGradient id={`sky-${series.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={series.accent} stopOpacity="0.15" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <rect width="400" height="140" fill={`url(#sky-${series.id})`} />
          {/* Terrain */}
          <path d="M0,280 Q100,180 200,200 Q300,220 400,160 L400,280 Z" fill={series.accent} opacity="0.08" />
          <path d="M0,280 Q80,220 200,240 Q320,260 400,220 L400,280 Z" fill={series.accent} opacity="0.12" />
        </svg>

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ position: "absolute", inset: 0, background: "rgba(8,12,6,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <div style={{ width: 48, height: 48, borderRadius: "50%", border: `1px solid ${C.amber}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="1.5">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
          <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: 15, fontWeight: 600, color: C.cream, letterSpacing: "-0.01em" }}>{series.title}</p>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: series.accent, background: `${series.accent}18`, padding: "2px 8px", borderRadius: 2, letterSpacing: "0.1em" }}>{series.category}</span>
        </div>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.muted, letterSpacing: "0.05em" }}>{series.location} · {series.year}</p>
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: C.muted }}>{series.prints} prints available</span>
          <motion.div style={{ width: 20, height: 20, x: 0 }} animate={hovered ? { x: 4 } : { x: 0 }} transition={{ duration: 0.2 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.moss} strokeWidth="1.5">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── CountUp ────────────────────────────────────────────────── */
function CountUp({ target, suffix = "", duration = 1800 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(ease * target));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function Page() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePress, setActivePress] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.7], [1, 0]);

  const filtered = activeCategory === "All" ? SERIES : SERIES.filter(s => s.category === activeCategory);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = FONTS;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <main style={{ background: C.bg, color: C.cream, minHeight: "100vh", fontFamily: "'Archivo', sans-serif", overflowX: "hidden" }}>

      {/* ── Nav ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(8,12,6,0.85)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Leaf mark */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.moss} strokeWidth="1.5">
            <path d="M12 2C6 2 2 8 2 12c0 5.5 4 9 9 9 1 0 2-.2 3-.5C8 19 6 15 6 12c0-4 4-6 8-6s8 2 8 6-2 7-5 8" />
            <line x1="12" y1="12" x2="12" y2="22" />
          </svg>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", color: C.cream, textTransform: "uppercase" }}>Léa Rousseau</span>
        </div>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {[
            { label: "Work", id: "work" },
            { label: "Exhibitions", id: "exhibitions" },
            { label: "Prints", id: "prints" },
            { label: "About", id: "about" },
          ].map(({ label, id }) => (
            <button key={label}
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.muted, background: "none", border: "none", cursor: "pointer", letterSpacing: "0.05em", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.cream)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}>
              {label}
            </button>
          ))}
          <MagneticButton style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.bg, background: C.moss, padding: "8px 18px", borderRadius: 2, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Print Shop
          </MagneticButton>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section ref={heroRef} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", paddingTop: 64, overflow: "hidden" }}>
        {/* Parallax bg */}
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(74,103,65,0.12) 0%, transparent 70%)" }} />
          {/* Floating particles */}
          {[...Array(18)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                left: `${8 + (i * 53) % 85}%`,
                top: `${10 + (i * 37) % 75}%`,
                width: i % 3 === 0 ? 2 : 1,
                height: i % 3 === 0 ? 2 : 1,
                borderRadius: "50%",
                background: i % 4 === 0 ? C.amber : C.moss,
                opacity: 0.25 + (i % 4) * 0.1,
              }}
              animate={{ y: [-8, 8, -8], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            />
          ))}
        </motion.div>

        <motion.div style={{ opacity: heroOpacity, position: "relative", zIndex: 1, textAlign: "center", maxWidth: 900, padding: "0 24px" }}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.4em", color: C.moss, textTransform: "uppercase", marginBottom: 32 }}
          >
            Nature Photography · Fine Art Prints
          </motion.p>

          <h1 style={{ fontSize: "clamp(52px, 9vw, 120px)", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.03em", marginBottom: 40, color: C.cream }}>
            <TextReveal text="Finding" delay={0.3} style={{ display: "block" }} />
            <TextReveal text="depth" delay={0.5} style={{ display: "block", color: C.amber }} />
            <TextReveal text="in stillness." delay={0.7} style={{ display: "block", color: C.moss }} />
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, color: C.muted, lineHeight: 1.7, maxWidth: 540, margin: "0 auto 48px", fontWeight: 300 }}
          >
            Documentary and fine art landscapes from the world's most remote wilderness areas. Limited edition prints, each signed and numbered.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center" }}
          >
            <MagneticButton style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.bg, background: C.cream, padding: "14px 32px", borderRadius: 2, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
              View Series
            </MagneticButton>
            <MagneticButton style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.cream, background: "transparent", padding: "14px 32px", borderRadius: 2, letterSpacing: "0.1em", textTransform: "uppercase", border: `1px solid ${C.border}`, fontWeight: 400 }}>
              Shop Prints
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)" }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </section>

      {/* ── Marquee ── */}
      <MarqueeStrip />

      {/* ── Depth Layers — Signature Element ── */}
      <section style={{ padding: "80px 0", maxWidth: 1200, margin: "0 auto", paddingInline: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", marginBottom: 64 }}>
          <div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.35em", color: C.moss, textTransform: "uppercase", marginBottom: 20 }}>Depth Perception</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24, color: C.cream }}>
              <TextReveal text="Three planes," />
              <TextReveal text="one frame." delay={0.15} />
            </h2>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.75, fontWeight: 300, maxWidth: 380 }}>
              Every composition is built in layers — the intimate foreground, the story-telling midground, and the expansive background. Move your cursor across the scene to experience how depth creates presence.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { label: "Years active", val: 12, suffix: "" },
              { label: "Countries", val: 34, suffix: "+" },
              { label: "Limited prints", val: 280, suffix: "" },
              { label: "Exhibitions", val: 24, suffix: "" },
            ].map(stat => (
              <div key={stat.label} style={{ padding: "24px", background: C.bgCard, borderRadius: 4, border: `1px solid ${C.border}` }}>
                <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: 36, fontWeight: 900, color: C.amber, letterSpacing: "-0.03em", lineHeight: 1 }}>
                  <CountUp target={stat.val} suffix={stat.suffix} />
                </p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.muted, marginTop: 8, letterSpacing: "0.05em" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <DepthLayers />
      </section>

      {/* ── Series Grid ── */}
      <section id="work" style={{ padding: "80px 0", maxWidth: 1200, margin: "0 auto", paddingInline: 32 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48 }}>
          <div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.35em", color: C.moss, textTransform: "uppercase", marginBottom: 16 }}>Portfolio</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.cream }}>
              <TextReveal text="Selected Series" />
            </h2>
          </div>
          {/* Category filter */}
          <div style={{ display: "flex", gap: 8 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: activeCategory === cat ? C.bg : C.muted, background: activeCategory === cat ? C.moss : "transparent", border: `1px solid ${activeCategory === cat ? C.moss : C.border}`, padding: "7px 16px", borderRadius: 2, cursor: "pointer", letterSpacing: "0.08em", transition: "all 0.2s" }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry-style grid */}
        <motion.div layout style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((series, i) => (
              <motion.div
                key={series.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: [0.4, 0, 0.2, 1] }}
                style={i === 1 || i === 4 ? { gridRow: "span 1", transform: "translateY(32px)" } : {}}
              >
                <SeriesCard series={series} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ── Philosophy ── */}
      <section style={{ padding: "80px 0", maxWidth: 1200, margin: "0 auto", paddingInline: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          {/* Large photo mock */}
          <div style={{ position: "relative" }}>
            <div style={{ aspectRatio: "3/4", background: "linear-gradient(160deg, #111C08 0%, #1E2E10 50%, #2A3D18 100%)", borderRadius: 4, overflow: "hidden", border: `1px solid ${C.border}` }}>
              <svg width="100%" height="100%" viewBox="0 0 400 533">
                <defs>
                  <radialGradient id="photoGlow" cx="50%" cy="30%" r="60%">
                    <stop offset="0%" stopColor={C.amber} stopOpacity="0.08" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>
                <rect width="400" height="533" fill="url(#photoGlow)" />
                {/* Stylized tree */}
                <line x1="200" y1="533" x2="200" y2="160" stroke={C.bgCard} strokeWidth="12" />
                {[
                  [200, 280, 120], [200, 240, 100], [200, 320, 140],
                  [200, 200, 80], [200, 360, 120], [200, 160, 60],
                ].map(([cx, cy, spread], i) => (
                  <line key={i} x1={200 - spread} y1={cy + 40} x2={200 + spread} y2={cy + 40}
                    stroke={C.green} strokeWidth={2} opacity={0.3 + i * 0.05}
                  />
                ))}
                <text x="200" y="490" textAnchor="middle" fill={C.muted} fontSize="11" fontFamily="Space Grotesk" letterSpacing="0.2em">BOREAL SILENCE, 2024</text>
              </svg>
            </div>
            {/* Floating label */}
            <motion.div
              style={{ position: "absolute", bottom: -20, right: -20, background: C.bgMid, border: `1px solid ${C.border}`, borderRadius: 4, padding: "16px 20px" }}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: C.moss, letterSpacing: "0.2em", marginBottom: 4 }}>SHOT WITH</p>
              <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: 14, color: C.cream, fontWeight: 600 }}>Hasselblad X2D 100C</p>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.muted }}>100MP · XCD 65mm f/2.8</p>
            </motion.div>
          </div>

          <div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.35em", color: C.moss, textTransform: "uppercase", marginBottom: 20 }}>Philosophy</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 32, color: C.cream }}>
              <TextReveal text="The wilderness" />
              <TextReveal text="doesn't perform." delay={0.15} />
              <TextReveal text="You wait." delay={0.3} style={{ color: C.amber }} />
            </h2>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.8, fontWeight: 300, marginBottom: 24 }}>
              I spend weeks in each location before making an image. The mountains don't care about my schedule. The fog rolls in when it wants. All I do is be present — technically prepared, emotionally open, and patient enough to let the moment arrive.
            </p>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.8, fontWeight: 300, marginBottom: 40 }}>
              Each print is made in partnership with Atelier Gaspard in Lyon, using archival pigment inks on 300gsm cotton rag paper. Every edition is limited to preserve collector value and my own artistic integrity.
            </p>
            <div style={{ display: "flex", gap: 40 }}>
              {[{ val: "300gsm", label: "Cotton rag paper" }, { val: "50yr", label: "Archive guarantee" }, { val: "≤20", label: "Prints per series" }].map(item => (
                <div key={item.label}>
                  <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: 22, fontWeight: 700, color: C.cream }}>{item.val}</p>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.muted, marginTop: 4 }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Exhibitions ── */}
      <section id="exhibitions" style={{ padding: "80px 0", background: C.bgCard, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", paddingInline: 32 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48 }}>
            <div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.35em", color: C.moss, textTransform: "uppercase", marginBottom: 16 }}>Exhibitions</p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.cream }}>
                <TextReveal text="Selected shows" />
              </h2>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
            {EXHIBITIONS.map((ex, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{ display: "flex", gap: 32, padding: "28px 0", borderBottom: `1px solid ${C.border}`, alignItems: "center", cursor: "pointer" }}
                whileHover={{ x: 8 }}
              >
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.moss, letterSpacing: "0.05em", minWidth: 48 }}>{ex.year}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: 17, fontWeight: 600, color: C.cream, letterSpacing: "-0.01em", marginBottom: 4 }}>{ex.title}</p>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.muted }}>{ex.venue}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.muted }}>{ex.city}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.moss} strokeWidth="1.5">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Press ── */}
      <section style={{ padding: "80px 0", maxWidth: 900, margin: "0 auto", paddingInline: 32 }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.35em", color: C.moss, textTransform: "uppercase", marginBottom: 48, textAlign: "center" }}>Press</p>

        <div style={{ position: "relative", minHeight: 200 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activePress}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              style={{ textAlign: "center" }}
            >
              <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(18px, 3vw, 28px)", fontWeight: 300, lineHeight: 1.5, color: C.cream, marginBottom: 32, fontStyle: "italic" }}>
                "{PRESS[activePress].quote}"
              </p>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.amber, letterSpacing: "0.05em" }}>{PRESS[activePress].author}</p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.muted }}>{PRESS[activePress].source}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot nav */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 40 }}>
          {PRESS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActivePress(i)}
              style={{ width: i === activePress ? 24 : 8, height: 8, borderRadius: 4, background: i === activePress ? C.moss : C.bgMid, border: `1px solid ${i === activePress ? C.moss : C.border}`, cursor: "pointer", transition: "all 0.3s ease", padding: 0 }}
            />
          ))}
        </div>
      </section>

      {/* ── Print Shop CTA ── */}
      <section id="prints" style={{ padding: "80px 0", background: C.bgCard, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", paddingInline: 32 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.35em", color: C.moss, textTransform: "uppercase", marginBottom: 20 }}>Fine Art Prints</p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 24, color: C.cream }}>
                <TextReveal text="Bring the wild" />
                <TextReveal text="inside." delay={0.15} style={{ color: C.amber }} />
              </h2>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.75, fontWeight: 300, marginBottom: 40, maxWidth: 440 }}>
                Museum-quality archival prints, handcrafted in Lyon. Three sizes, three paper surfaces, each signed and numbered. Shipping worldwide with custom framing options.
              </p>
              <MagneticButton style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.bg, background: C.cream, padding: "16px 36px", borderRadius: 2, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>
                Shop All Prints
              </MagneticButton>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { size: "30×40", price: "390", material: "Cotton Rag" },
                { size: "50×70", price: "590", material: "Fine Art Baryta" },
                { size: "70×100", price: "890", material: "Cotton Rag" },
                { size: "100×140", price: "1,490", material: "Cotton Rag Museum" },
              ].map(print => (
                <motion.div
                  key={print.size}
                  whileHover={{ y: -4, borderColor: C.moss }}
                  style={{ padding: "20px", background: C.bg, borderRadius: 4, border: `1px solid ${C.border}`, cursor: "pointer", transition: "border-color 0.2s" }}
                >
                  <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: 18, fontWeight: 700, color: C.cream, marginBottom: 6 }}>{print.size}cm</p>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.muted, marginBottom: 12 }}>{print.material}</p>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.amber }}>from €{print.price}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="about" style={{ padding: "80px 0", maxWidth: 1200, margin: "0 auto", paddingInline: 32, textAlign: "center" }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.35em", color: C.moss, textTransform: "uppercase", marginBottom: 24 }}>Let's Talk</p>
        <h2 style={{ fontSize: "clamp(36px, 6vw, 80px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 0.95, marginBottom: 40 }}>
          <TextReveal text="Commission." style={{ display: "block", color: C.cream }} />
          <TextReveal text="License." delay={0.15} style={{ display: "block", color: C.moss }} />
          <TextReveal text="Collect." delay={0.3} style={{ display: "block", color: C.amber }} />
        </h2>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.75, maxWidth: 500, margin: "0 auto 48px", fontWeight: 300 }}>
          For editorial licensing, commercial usage, or private commissions, get in touch directly. For print enquiries, visit the shop.
        </p>
        <MagneticButton style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: C.bg, background: C.cream, padding: "18px 48px", borderRadius: 2, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>
          studio@learousseau.com
        </MagneticButton>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "32px 32px", background: C.bgCard }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.muted }}>© 2025 Léa Rousseau. All prints reserved.</p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Instagram", "Newsletter", "Press Kit"].map(link => (
              <button key={link} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.muted, background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.cream)}
                onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
                {link}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
