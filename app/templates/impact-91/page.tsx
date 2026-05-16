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
import React, { useRef, useState, useEffect, useCallback } from "react";

/* ─── Design Tokens ─────────────────────────────────────────── */
const C = {
  bg:      "#080706",
  bgCard:  "#120F0C",
  bgMid:   "#1E1912",
  gold:    "#C9A86C",
  goldSoft:"#E8D5A8",
  copper:  "#A07840",
  cream:   "#F5EDE0",
  muted:   "#8A7E6E",
  border:  "rgba(201,168,108,0.13)",
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Montserrat:wght@300;400;500;600&display=swap');`;

/* ─── Data ───────────────────────────────────────────────────── */
const COLLECTIONS = [
  {
    name: "Solstice",
    type: "Ring Collection",
    pieces: 7,
    desc: "Seven rings inspired by the turning of light through the seasons. Yellow gold, rose gold, and white gold with hand-selected gemstones.",
    accent: "#C9A86C",
  },
  {
    name: "Nocturn",
    type: "Necklace Collection",
    pieces: 5,
    desc: "Fine chain necklaces with pendant stones set in blackened gold — sapphire, tourmaline, and black diamond.",
    accent: "#6A8EA8",
  },
  {
    name: "Halo",
    type: "Earring Collection",
    pieces: 9,
    desc: "Statement earrings with diamond halos and coloured centre stones. From subtle studs to sculptural drops.",
    accent: "#E8D5A8",
  },
  {
    name: "Celeste",
    type: "Bracelet Collection",
    pieces: 4,
    desc: "Celestial-inspired bracelets and bangles — pavé-set constellations in 18k gold.",
    accent: "#A8B8C8",
  },
];

const PIECES = [
  { name: "Solstice Ring No. 3", material: "18k Yellow Gold · 0.62ct Oval Sapphire", price: "4,200", tag: "Bestseller" },
  { name: "Nocturn Drop Pendant", material: "18k Blackened Gold · Black Diamond", price: "2,850", tag: "Limited" },
  { name: "Halo Cluster Earrings", material: "18k White Gold · Diamond Halo", price: "6,400", tag: "New" },
  { name: "Celeste Constellation Cuff", material: "18k Yellow Gold · 48 Pavé Diamonds", price: "8,900", tag: "Bespoke" },
];

const PROCESS = [
  { step: "I", title: "Private Consultation", desc: "We meet in our atelier to understand your vision — your style, your story, the occasion. Every bespoke piece begins with listening." },
  { step: "II", title: "Design & Gemstone Selection", desc: "Our goldsmith presents hand-drawn sketches and curated stones from our network of trusted suppliers in Antwerp and Sri Lanka." },
  { step: "III", title: "Creation & Delivery", desc: "Your piece is hand-fabricated in our Paris workshop over 6–10 weeks, then presented in a private handover ceremony." },
];

const PRESS = [
  { source: "Vogue France", quote: "Aurelia Jewels occupies a rare space — intimate enough to feel personal, extraordinary enough to feel timeless." },
  { source: "Le Figaro Madame", quote: "Each piece tells a story. That is the rarest quality in contemporary fine jewellery." },
  { source: "Tatler", quote: "The Solstice collection is the finest debut we have seen in Paris this decade." },
];

const COLLECTION_NAMES = ["Solstice", "Nocturn", "Halo", "Celeste", "Bespoke"];

/* ─── TextReveal ─────────────────────────────────────────────── */
function TextReveal({ text, delay = 0, style = {} }: { text: string; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} style={{ overflow: "hidden", ...style }}>
      <motion.div
        initial={{ y: "110%" }}
        animate={inView ? { y: 0 } : { y: "110%" }}
        transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
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
  const sx = useSpring(x, { stiffness: 250, damping: 18 });
  const sy = useSpring(y, { stiffness: 250, damping: 18 });
  const ref = useRef<HTMLButtonElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.3);
    y.set((e.clientY - r.top - r.height / 2) * 0.3);
  };
  return (
    <motion.button ref={ref} style={{ x: sx, y: sy, cursor: "pointer", background: "none", border: "none", ...style }}
      onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0); }} onClick={onClick}>
      {children}
    </motion.button>
  );
}

/* ─── MarqueeStrip ───────────────────────────────────────────── */
function MarqueeStrip() {
  const items = [...COLLECTION_NAMES, ...COLLECTION_NAMES, ...COLLECTION_NAMES, ...COLLECTION_NAMES];
  return (
    <div style={{ overflow: "hidden", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "10px 0" }}>
      <motion.div
        style={{ display: "flex", gap: 64, whiteSpace: "nowrap" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {items.map((name, i) => (
          <span key={i} style={{ fontFamily: "'Cormorant', serif", fontSize: 14, letterSpacing: "0.3em", color: C.muted, fontStyle: "italic" }}>
            {name}
            <span style={{ marginLeft: 64, color: C.gold, fontSize: 8 }}>◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── DiamondFacets — Signature Element ─────────────────────── */
function DiamondFacets() {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smx = useSpring(mouseX, { stiffness: 80, damping: 22 });
  const smy = useSpring(mouseY, { stiffness: 80, damping: 22 });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width);
    mouseY.set((e.clientY - r.top) / r.height);
  }, [mouseX, mouseY]);

  const onMouseLeave = useCallback(() => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  // Compute light position from mouse
  const lightX = useTransform(smx, [0, 1], [80, 320]);
  const lightY = useTransform(smy, [0, 1], [60, 300]);

  // 16 brillant-cut facets defined as polygon points (simplified top view)
  const cx = 200, cy = 200, R = 160, r = 80, innerR = 40;

  const facets = Array.from({ length: 8 }, (_, i) => {
    const a0 = (i * Math.PI * 2) / 8;
    const a1 = ((i + 1) * Math.PI * 2) / 8;
    const am = (a0 + a1) / 2;
    return {
      // Outer kite
      outer: [
        { x: cx + R * Math.cos(a0), y: cy + R * Math.sin(a0) },
        { x: cx + r * Math.cos(am - 0.15), y: cy + r * Math.sin(am - 0.15) },
        { x: cx + innerR * Math.cos(am), y: cy + innerR * Math.sin(am) },
        { x: cx + r * Math.cos(am + 0.15), y: cy + r * Math.sin(am + 0.15) },
        { x: cx + R * Math.cos(a1), y: cy + R * Math.sin(a1) },
      ],
      // Inner triangle
      inner: [
        { x: cx + r * Math.cos(am - 0.15), y: cy + r * Math.sin(am - 0.15) },
        { x: cx + innerR * Math.cos(am), y: cy + innerR * Math.sin(am) },
        { x: cx + r * Math.cos(am + 0.15), y: cy + r * Math.sin(am + 0.15) },
        { x: cx, y: cy },
      ],
      angle: am,
    };
  });

  function toPath(pts: { x: number; y: number }[]) {
    return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";
  }

  return (
    <div style={{ display: "flex", gap: 64, alignItems: "center" }}>
      {/* Diamond SVG */}
      <div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ position: "relative", flexShrink: 0, cursor: "crosshair" }}
      >
        <svg width="400" height="400" viewBox="0 0 400 400" style={{ display: "block" }}>
          <defs>
            <motion.radialGradient
              id="lightSource"
              cx={useTransform(lightX, v => `${(v / 400) * 100}%`) as any}
              cy={useTransform(lightY, v => `${(v / 400) * 100}%`) as any}
              r="60%"
            >
              <stop offset="0%" stopColor={C.goldSoft} stopOpacity="0.6" />
              <stop offset="100%" stopColor="transparent" />
            </motion.radialGradient>

            <filter id="gemGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer ring / girdle */}
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.gold} strokeWidth="0.5" strokeOpacity="0.3" />

          {/* Outer facets */}
          {facets.map((f, i) => (
            <motion.path
              key={`outer-${i}`}
              d={toPath(f.outer)}
              fill={C.bgCard}
              stroke={C.gold}
              strokeWidth="0.5"
              strokeOpacity="0.4"
              whileHover={{ fill: C.bgMid }}
              animate={{
                fillOpacity: [0.7, 0.9, 0.7],
              }}
              transition={{
                duration: 3 + i * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
              style={{ cursor: "crosshair" }}
            />
          ))}

          {/* Inner triangles */}
          {facets.map((f, i) => (
            <motion.path
              key={`inner-${i}`}
              d={toPath(f.inner)}
              fill={C.bgMid}
              stroke={C.gold}
              strokeWidth="0.5"
              strokeOpacity="0.3"
              animate={{
                fillOpacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2.5 + i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15 + 0.5,
              }}
            />
          ))}

          {/* Table (center octagon) */}
          <polygon
            points={Array.from({ length: 8 }, (_, i) => {
              const a = (i * Math.PI * 2) / 8;
              return `${(cx + innerR * Math.cos(a)).toFixed(1)},${(cy + innerR * Math.sin(a)).toFixed(1)}`;
            }).join(" ")}
            fill={C.bgMid}
            stroke={C.gold}
            strokeWidth="0.5"
            strokeOpacity="0.5"
          />

          {/* Light refraction overlay — follows mouse */}
          <rect x="40" y="40" width="320" height="320" rx="160" fill="url(#lightSource)" style={{ mixBlendMode: "screen" } as any} />

          {/* Light rays from center */}
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI * 2) / 8 + Math.PI / 8;
            return (
              <motion.line
                key={i}
                x1={cx}
                y1={cy}
                x2={cx + R * Math.cos(a)}
                y2={cy + R * Math.sin(a)}
                stroke={C.gold}
                strokeWidth="0.5"
                strokeOpacity="0"
                animate={{ strokeOpacity: [0, 0.25, 0] }}
                transition={{ duration: 3, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
              />
            );
          })}

          {/* Sparkle points */}
          {[
            [cx + R - 10, cy - 20, 3],
            [cx - R + 15, cy + 30, 2],
            [cx + 20, cy - R + 10, 2.5],
            [cx - 30, cy + R - 15, 2],
          ].map(([x, y, r], i) => (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              fill={C.goldSoft}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
              transition={{ duration: 2.5, delay: i * 0.8, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </svg>

        {/* Glow beneath */}
        <div style={{ position: "absolute", bottom: -20, left: "50%", transform: "translateX(-50%)", width: 200, height: 24, background: C.gold, opacity: 0.07, borderRadius: "50%", filter: "blur(16px)" }} />
      </div>

      {/* Description */}
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: "0.4em", color: C.gold, textTransform: "uppercase", marginBottom: 24 }}>The Craft</p>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 28, color: C.cream, fontFamily: "'Cormorant', serif" }}>
          <TextReveal text="Every stone" />
          <TextReveal text="chosen by hand." delay={0.15} style={{ fontStyle: "italic", color: C.gold }} />
        </h2>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.85, marginBottom: 32, fontWeight: 300 }}>
          Move your cursor across the diamond to discover how light behaves differently in each facet — the same principle guides how we select every stone. We handle each gem in natural light, from multiple angles, until we understand its character.
        </p>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.85, marginBottom: 40, fontWeight: 300 }}>
          All our diamonds are GIA-certified. Coloured stones are sourced directly from ethical suppliers in Sri Lanka, Mozambique, and Colombia.
        </p>
        <div style={{ display: "flex", gap: 40 }}>
          {[
            { val: "GIA", label: "Certified diamonds" },
            { val: "18k", label: "All metals" },
            { val: "100%", label: "Ethical sourcing" },
          ].map(item => (
            <div key={item.label} style={{ paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
              <p style={{ fontFamily: "'Cormorant', serif", fontSize: 26, fontWeight: 600, color: C.gold, letterSpacing: "-0.01em", lineHeight: 1 }}>{item.val}</p>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: C.muted, marginTop: 6, letterSpacing: "0.05em" }}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── CollectionCard ─────────────────────────────────────────── */
function CollectionCard({ col }: { col: typeof COLLECTIONS[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      style={{ background: C.bgCard, border: `1px solid ${hovered ? col.accent : C.border}`, borderRadius: 4, padding: "32px", cursor: "pointer", transition: "border-color 0.3s" }}
    >
      {/* Gem shape indicator */}
      <div style={{ marginBottom: 24 }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <polygon points="16,4 28,12 28,20 16,28 4,20 4,12" fill="none" stroke={col.accent} strokeWidth="1" strokeOpacity="0.7" />
          <polygon points="16,9 24,13 24,19 16,23 8,19 8,13" fill={col.accent} fillOpacity="0.1" stroke={col.accent} strokeWidth="0.5" strokeOpacity="0.4" />
        </svg>
      </div>
      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: C.muted, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>{col.type} · {col.pieces} pièces</p>
      <h3 style={{ fontFamily: "'Cormorant', serif", fontSize: 24, fontWeight: 600, color: C.cream, marginBottom: 16, letterSpacing: "-0.01em" }}>{col.name}</h3>
      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.75, fontWeight: 300 }}>{col.desc}</p>
      <motion.div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 8, opacity: hovered ? 1 : 0.4 }} animate={{ opacity: hovered ? 1 : 0.4 }} transition={{ duration: 0.2 }}>
        <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: col.accent, letterSpacing: "0.15em", textTransform: "uppercase" }}>Découvrir</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={col.accent} strokeWidth="1.5">
          <path d="M7 17L17 7M17 7H7M17 7v10" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function Page() {
  const [activePress, setActivePress] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = FONTS;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActivePress(p => (p + 1) % PRESS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <main style={{ background: C.bg, color: C.cream, minHeight: "100vh", fontFamily: "'Montserrat', sans-serif", overflowX: "hidden" }}>

      {/* ── Nav ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "0 40px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(8,7,6,0.92)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Gem mark */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <polygon points="10,2 18,7 18,13 10,18 2,13 2,7" fill="none" stroke={C.gold} strokeWidth="1" />
            <polygon points="10,6 15,8.5 15,11.5 10,14 5,11.5 5,8.5" fill={C.gold} fillOpacity="0.25" />
          </svg>
          <span style={{ fontFamily: "'Cormorant', serif", fontSize: 16, fontWeight: 600, color: C.cream, letterSpacing: "0.08em" }}>Aurelia Jewels</span>
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {[
            { label: "Collections", id: "collections" },
            { label: "Bespoke", id: "bespoke" },
            { label: "Atelier", id: "atelier" },
            { label: "About", id: "about" },
          ].map(({ label, id }) => (
            <button key={label}
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: C.muted, background: "none", border: "none", cursor: "pointer", letterSpacing: "0.06em", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.cream)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}>
              {label}
            </button>
          ))}
          <MagneticButton style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: C.bg, background: C.gold, padding: "9px 22px", borderRadius: 2, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
            Book Consultation
          </MagneticButton>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section ref={heroRef} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", paddingTop: 64, overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 35%, rgba(201,168,108,0.07) 0%, transparent 65%)" }} />
          {/* Floating gem shapes */}
          {[
            { x: "6%", y: "18%", s: 40, delay: 0 },
            { x: "88%", y: "20%", s: 28, delay: 0.6 },
            { x: "10%", y: "68%", s: 20, delay: 1.2 },
            { x: "84%", y: "65%", s: 36, delay: 0.4 },
          ].map((g, i) => (
            <motion.div key={i} style={{ position: "absolute", left: g.x, top: g.y }}
              initial={{ opacity: 0 }} animate={{ opacity: 0.12 }} transition={{ delay: g.delay, duration: 1 }}>
              <motion.div animate={{ y: [-6, 6, -6], rotate: [0, 10, 0] }} transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}>
                <svg width={g.s} height={g.s} viewBox="0 0 24 24" fill="none">
                  <polygon points="12,2 22,8 22,16 12,22 2,16 2,8" stroke={C.gold} strokeWidth="1" fill={C.gold} fillOpacity="0.08" />
                </svg>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div style={{ opacity: heroOpacity, position: "relative", zIndex: 1, textAlign: "center", maxWidth: 860, padding: "0 24px" }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 36 }}
          >
            <div style={{ height: "0.5px", width: 48, background: C.gold, opacity: 0.5 }} />
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: "0.4em", color: C.gold, textTransform: "uppercase" }}>Fine Jewellery · Paris</p>
            <div style={{ height: "0.5px", width: 48, background: C.gold, opacity: 0.5 }} />
          </motion.div>

          <h1 style={{ fontSize: "clamp(52px, 9.5vw, 120px)", fontWeight: 400, lineHeight: 0.92, letterSpacing: "-0.03em", marginBottom: 44, fontFamily: "'Cormorant', serif" }}>
            <TextReveal text="Crafted for" delay={0.3} style={{ display: "block", color: C.cream }} />
            <TextReveal text="those who" delay={0.5} style={{ display: "block", fontStyle: "italic", color: C.gold }} />
            <TextReveal text="remember." delay={0.7} style={{ display: "block", color: C.cream }} />
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.8, maxWidth: 500, margin: "0 auto 52px", fontWeight: 300 }}
          >
            Fine jewellery made in Paris, worn for a lifetime. Bespoke commissions, four seasonal collections, and a gemstone archive like no other.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            style={{ display: "flex", gap: 16, justifyContent: "center" }}
          >
            <MagneticButton style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: C.bg, background: C.gold, padding: "16px 40px", borderRadius: 2, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>
              View Collections
            </MagneticButton>
            <MagneticButton style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: C.cream, background: "transparent", padding: "16px 40px", borderRadius: 2, letterSpacing: "0.12em", textTransform: "uppercase", border: `1px solid ${C.border}` }}>
              Bespoke Enquiry
            </MagneticButton>
          </motion.div>
        </motion.div>

        <motion.div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)" }}
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </section>

      {/* ── Marquee ── */}
      <MarqueeStrip />

      {/* ── Diamond Facets — Signature Element ── */}
      <section style={{ padding: "80px 0", maxWidth: 1100, margin: "0 auto", paddingInline: 40 }}>
        <DiamondFacets />
      </section>

      {/* ── Collections ── */}
      <section id="collections" style={{ padding: "80px 0", background: C.bgCard, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", paddingInline: 40 }}>
          <div style={{ marginBottom: 56 }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: "0.4em", color: C.gold, textTransform: "uppercase", marginBottom: 20 }}>Collections</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.cream, fontFamily: "'Cormorant', serif" }}>
              <TextReveal text="Four collections," />
              <TextReveal text="one vision." delay={0.15} style={{ fontStyle: "italic", color: C.gold }} />
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {COLLECTIONS.map((col, i) => (
              <motion.div key={col.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}>
                <CollectionCard col={col} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Flagship Pieces ── */}
      <section id="atelier" style={{ padding: "80px 0", maxWidth: 1100, margin: "0 auto", paddingInline: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56 }}>
          <div>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: "0.4em", color: C.gold, textTransform: "uppercase", marginBottom: 20 }}>Flagship Pieces</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, lineHeight: 1.1, color: C.cream, fontFamily: "'Cormorant', serif" }}>
              <TextReveal text="Selected Works" />
            </h2>
          </div>
          <MagneticButton style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: C.gold, background: "transparent", border: `1px solid ${C.gold}`, padding: "10px 24px", borderRadius: 2, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Full Archive
          </MagneticButton>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {PIECES.map((piece, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <motion.div
                whileHover={{ y: -6, borderColor: C.gold }}
                style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 4, overflow: "hidden", cursor: "pointer", transition: "border-color 0.3s" }}
              >
                {/* Piece visual */}
                <div style={{ aspectRatio: "3/4", background: C.bgMid, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <polygon points="40,6 72,22 72,58 40,74 8,58 8,22" fill="none" stroke={C.gold} strokeWidth="0.8" strokeOpacity="0.5" />
                    <polygon points="40,16 62,26 62,54 40,64 18,54 18,26" fill={C.gold} fillOpacity="0.06" stroke={C.gold} strokeWidth="0.5" strokeOpacity="0.3" />
                    <polygon points="40,26 54,32 54,48 40,54 26,48 26,32" fill={C.gold} fillOpacity="0.1" />
                    <circle cx="40" cy="40" r="5" fill={C.gold} fillOpacity="0.35" />
                  </svg>
                  <div style={{ position: "absolute", top: 12, left: 12 }}>
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, color: C.gold, background: `${C.gold}18`, padding: "2px 8px", borderRadius: 2, letterSpacing: "0.1em", textTransform: "uppercase" }}>{piece.tag}</span>
                  </div>
                </div>
                <div style={{ padding: "16px 20px" }}>
                  <p style={{ fontFamily: "'Cormorant', serif", fontSize: 15, fontWeight: 600, color: C.cream, marginBottom: 6, lineHeight: 1.3 }}>{piece.name}</p>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: C.muted, lineHeight: 1.5, marginBottom: 12 }}>{piece.material}</p>
                  <p style={{ fontFamily: "'Cormorant', serif", fontSize: 17, color: C.gold }}>€{piece.price}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Bespoke Process ── */}
      <section id="bespoke" style={{ padding: "80px 0", background: C.bgCard, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", paddingInline: 40 }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: "0.4em", color: C.gold, textTransform: "uppercase", marginBottom: 20 }}>Bespoke</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 400, lineHeight: 1.1, color: C.cream, fontFamily: "'Cormorant', serif" }}>
              <TextReveal text="A piece made" />
              <TextReveal text="only for you." delay={0.15} style={{ fontStyle: "italic", color: C.gold } as any} />
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, position: "relative" }}>
            {/* Connecting line */}
            <div style={{ position: "absolute", top: 28, left: "16%", right: "16%", height: "0.5px", background: `linear-gradient(to right, transparent, ${C.gold}40, transparent)` }} />
            {PROCESS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                style={{ padding: "0 32px", textAlign: "center" }}
              >
                <div style={{ width: 56, height: 56, borderRadius: "50%", border: `1px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", background: C.bgCard }}>
                  <span style={{ fontFamily: "'Cormorant', serif", fontSize: 18, color: C.gold, fontStyle: "italic" }}>{step.step}</span>
                </div>
                <h3 style={{ fontFamily: "'Cormorant', serif", fontSize: 20, fontWeight: 600, color: C.cream, marginBottom: 12 }}>{step.title}</h3>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.75, fontWeight: 300 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 56 }}>
            <MagneticButton style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: C.bg, background: C.gold, padding: "16px 48px", borderRadius: 2, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>
              Begin Your Bespoke Journey
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* ── Press ── */}
      <section id="about" style={{ padding: "80px 0", maxWidth: 800, margin: "0 auto", paddingInline: 40, textAlign: "center" }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: "0.4em", color: C.gold, textTransform: "uppercase", marginBottom: 48 }}>As Seen In</p>
        <div style={{ position: "relative", minHeight: 160 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activePress}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45 }}
            >
              <p style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(18px, 3vw, 28px)", fontWeight: 400, color: C.cream, lineHeight: 1.55, marginBottom: 28, fontStyle: "italic" }}>
                "{PRESS[activePress].quote}"
              </p>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: C.gold, letterSpacing: "0.1em" }}>{PRESS[activePress].source}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 36 }}>
          {PRESS.map((_, i) => (
            <button key={i} onClick={() => setActivePress(i)} style={{ width: i === activePress ? 28 : 8, height: 8, borderRadius: 4, background: i === activePress ? C.gold : C.bgMid, border: `1px solid ${i === activePress ? C.gold : C.border}`, cursor: "pointer", transition: "all 0.3s", padding: 0 }} />
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "28px 40px", background: C.bgCard }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontFamily: "'Cormorant', serif", fontSize: 14, color: C.muted, fontStyle: "italic" }}>Aurelia Jewels · Paris</p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: C.muted, letterSpacing: "0.06em" }}>© 2025 — All pieces reserved</p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Instagram", "Appointments", "Press"].map(link => (
              <button key={link} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: C.muted, background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
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
