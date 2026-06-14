"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

export const C = {
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

export const SERIES = [
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

export const EXHIBITIONS = [
  { year: "2025", title: "Primordial", venue: "Galerie Binôme", city: "Paris" },
  { year: "2024", title: "Undisturbed", venue: "FOAM Photography Museum", city: "Amsterdam" },
  { year: "2024", title: "Depth of Field", venue: "Aperture Foundation", city: "New York" },
  { year: "2023", title: "Threshold", venue: "Rencontres d'Arles", city: "Arles" },
];

export const PRESS = [
  { quote: "Images that breathe — each frame holds the patience of hours, the weight of silence.", source: "Le Monde", author: "Claire Dumont" },
  { quote: "Léa Rousseau doesn't photograph landscapes. She photographs the feeling of standing inside them.", source: "Aperture Magazine", author: "Mark Tobias" },
  { quote: "A singular eye. What you see through her lens, you cannot unsee.", source: "British Journal of Photography", author: "Sarah Chen" },
];

export const LOCATIONS = [
  "Finland", "Norway", "Faroe Islands", "Patagonia", "Lapland",
  "Dolomites", "Black Forest", "Olympic Peninsula", "Yosemite", "Hokkaido",
];

export const CATEGORIES = ["All", "Wilderness", "Forest", "Mountain", "Coastal"];

export function TextReveal({ text, delay = 0, style = {} }: { text: string; delay?: number; style?: React.CSSProperties }) {
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

export function MagneticButton({ children, style = {}, onClick }: { children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void }) {
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

export function MarqueeStrip() {
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

export function DepthLayers() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smx = useSpring(mouseX, { stiffness: 60, damping: 18 });
  const smy = useSpring(mouseY, { stiffness: 60, damping: 18 });

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
      <motion.div style={{ x: l3x, y: l3y, position: "absolute", inset: "-20px", background: "linear-gradient(180deg, #0A1505 0%, #1A2E0A 35%, #243318 60%, #1C2A12 100%)" }} />

      <motion.div
        style={{ x: l2x, y: l2y, position: "absolute", inset: "-20px" }}
      >
        <svg viewBox="0 0 1440 560" style={{ position: "absolute", bottom: 0, left: 0, width: "120%", height: "60%" }} preserveAspectRatio="none">
          <path d="M-40,560 L-40,260 Q180,160 360,200 Q540,240 720,180 Q900,120 1080,160 Q1260,200 1480,140 L1480,560 Z" fill="#243318" opacity="0.9" />
          <path d="M-40,560 L-40,310 Q200,240 440,280 Q680,320 880,260 Q1080,200 1280,240 L1480,220 L1480,560 Z" fill="#1A2C0E" opacity="0.8" />
        </svg>
        <svg viewBox="0 0 1440 560" style={{ position: "absolute", bottom: 0, left: 0, width: "120%", height: "50%" }} preserveAspectRatio="none">
          {[0, 80, 160, 240, 320, 400, 480, 560, 640, 720, 800, 880, 960, 1040, 1120, 1200, 1280, 1360].map((x, i) => (
            <polygon key={i} points={`${x},560 ${x + 14},${300 + Math.sin(i * 1.3) * 40} ${x + 28},560`} fill="#0F1A08" opacity={0.6 + (i % 3) * 0.1} />
          ))}
        </svg>
      </motion.div>

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

        <svg viewBox="0 0 1440 560" style={{ position: "absolute", bottom: 0, left: 0, width: "120%", height: "30%" }} preserveAspectRatio="none">
          {[0, 100, 220, 360, 500, 660, 820, 980, 1120, 1280].map((x, i) => (
            <g key={i} transform={`translate(${x}, 420)`}>
              <ellipse cx={30} cy={60} rx={40} ry={20} fill="#111D09" opacity={0.85} transform={`rotate(${-15 + i * 7})`} />
              <ellipse cx={50} cy={70} rx={35} ry={18} fill="#0D1807" opacity={0.7} transform={`rotate(${10 + i * 5})`} />
            </g>
          ))}
        </svg>
      </motion.div>

      <motion.div
        style={{ x: l3x, y: l3y, position: "absolute", inset: "-20px", background: "radial-gradient(ellipse 60% 40% at 50% 20%, rgba(200,148,58,0.10) 0%, transparent 70%)", mixBlendMode: "screen", pointerEvents: "none" }}
      />

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "35%", background: "linear-gradient(to top, rgba(8,12,6,0.8) 0%, transparent 100%)", pointerEvents: "none" }} />

      <div style={{ position: "absolute", bottom: 28, left: 32, pointerEvents: "none" }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.3em", color: C.moss, textTransform: "uppercase", marginBottom: 6 }}>INTERACTIVE DEPTH</p>
        <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: 13, color: C.muted }}>Move your cursor to reveal layers</p>
      </div>

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

export function SeriesCard({ series, onClick }: { series: typeof SERIES[0]; onClick?: () => void }) {
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
      onClick={onClick}
      style={{ background: spotBg as any, borderRadius: 4, overflow: "hidden", cursor: "pointer", border: `1px solid ${C.border}`, position: "relative", textAlign: "left" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <div style={{ aspectRatio: series.aspect, background: series.bg, position: "relative", overflow: "hidden" }}>
        <svg width="100%" height="100%" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice">
          <rect width="400" height="280" fill="transparent" />
          <defs>
            <linearGradient id={`sky-${series.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={series.accent} stopOpacity="0.15" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <rect width="400" height="140" fill={`url(#sky-${series.id})`} />
          <path d="M0,280 Q100,180 200,200 Q300,220 400,160 L400,280 Z" fill={series.accent} opacity="0.08" />
          <path d="M0,280 Q80,220 200,240 Q320,260 400,220 L400,280 Z" fill={series.accent} opacity="0.12" />
        </svg>

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

export function CountUp({ target, suffix = "", duration = 1800 }: { target: number; suffix?: string; duration?: number }) {
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
