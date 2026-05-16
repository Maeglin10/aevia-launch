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
import React, { useRef, useState, useEffect } from "react";

/* ─── Design Tokens ─────────────────────────────────────────── */
const C = {
  bg:      "#FAF4F0",
  bgCard:  "#F5EAE4",
  bgDark:  "#1C1210",
  petal:   "#C86878",
  petalSoft:"#E8A4B0",
  green:   "#4A6B52",
  greenSoft:"#8AAE8A",
  gold:    "#C9A86C",
  dark:    "#2A1814",
  muted:   "#8A7068",
  border:  "rgba(200,104,120,0.14)",
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&display=swap');`;

/* ─── Data ───────────────────────────────────────────────────── */
const ARRANGEMENTS = [
  { name: "Seasonal Bouquet", tag: "Bestseller", price: "65", desc: "Hand-tied seasonal flowers, locally sourced. Refreshed weekly based on what's at its peak." },
  { name: "Event Florals", tag: "Bespoke", price: "From 280", desc: "Full-service floral design for weddings, dinners, galas, and intimate celebrations." },
  { name: "Pressed & Dried", tag: "Lasting", price: "From 45", desc: "Preserved arrangements that last months. Pampas, lunaria, statice, and dried botanicals." },
  { name: "Subscription Box", tag: "Monthly", price: "55/mo", desc: "Fresh flowers delivered monthly, hand-selected and arranged. Includes care card and botanicals." },
  { name: "Table Setting", tag: "Events", price: "From 120", desc: "Complete table floralscapes — individual stems, centrepieces, scattered petal runners." },
  { name: "Custom Wreath", tag: "Seasonal", price: "85", desc: "Door wreaths and wall installations made with seasonal foliage and dried flowers." },
];

const FLOWERS = [
  "Pivoine · Ranunculus · Anemone · Rose · Tulipe · Dahlia · Lilas · Jasmin · Glycine · Muguet"
];

const PROCESS = [
  { num: "I", title: "The Harvest", desc: "Every Monday we source directly from the Rungis wholesale market, supplemented by our partner growers in Île-de-France." },
  { num: "II", title: "The Design", desc: "Each arrangement is built around one hero bloom, supported by secondary florals and complementary foliage — never symmetrical, always alive." },
  { num: "III", title: "The Delivery", desc: "Wrapped in our signature kraft paper with a care card and a botanical print. Delivered same-day in Paris, next-day nationwide." },
];

const EVENTS = [
  { name: "Spring Arrangement Workshop", date: "Sat 24 May", time: "10:00–13:00", spots: 5, price: "75" },
  { name: "Wedding Florals Consultation", date: "By appointment", time: "1h private", spots: null, price: "Free" },
  { name: "Dried Botanicals Evening", date: "Thu 5 Jun", time: "18:30–20:30", spots: 8, price: "55" },
];

const FLOWER_STRIP = [
  "Pivoine", "Ranunculus", "Anemone", "Rosa Austine", "Tulipe", "Dahlia", "Lilas",
  "Jasmin", "Glycine", "Muguet du Val", "Digitale", "Freesia",
];

/* ─── TextReveal ─────────────────────────────────────────────── */
function TextReveal({ text, delay = 0, style = {} }: { text: string; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} style={{ overflow: "hidden", ...style }}>
      <motion.div
        initial={{ y: "110%" }}
        animate={inView ? { y: 0 } : { y: "110%" }}
        transition={{ duration: 1.0, delay, ease: [0.16, 1, 0.3, 1] }}
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
  const items = [...FLOWER_STRIP, ...FLOWER_STRIP];
  return (
    <div style={{ overflow: "hidden", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "11px 0", background: C.bgDark }}>
      <motion.div
        style={{ display: "flex", gap: 56, whiteSpace: "nowrap" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      >
        {items.map((name, i) => (
          <span key={i} style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 14, letterSpacing: "0.1em", color: C.petalSoft, fontStyle: "italic" }}>
            {name}
            <span style={{ marginLeft: 56, color: C.petal, fontSize: 10 }}>✿</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── BloomingFlower — Signature Element ────────────────────── */
function BloomingFlower() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(false);

  // Build 16 petals in two rings (inner 8, outer 8)
  const innerPetals = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 8;
    return { angle, r: 55, length: 44, width: 20 };
  });
  const outerPetals = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 8 + Math.PI / 8;
    return { angle, r: 68, length: 58, width: 26 };
  });

  const petalPath = (cx: number, cy: number, angle: number, rInner: number, length: number, width: number) => {
    const tipX = cx + (rInner + length) * Math.cos(angle);
    const tipY = cy + (rInner + length) * Math.sin(angle);
    const baseL = angle + Math.PI / 2;
    const baseR = angle - Math.PI / 2;
    const baseX = cx + rInner * Math.cos(angle);
    const baseY = cy + rInner * Math.sin(angle);
    const lx = baseX + (width / 2) * Math.cos(baseL);
    const ly = baseY + (width / 2) * Math.sin(baseL);
    const rx = baseX + (width / 2) * Math.cos(baseR);
    const ry = baseY + (width / 2) * Math.sin(baseR);
    const cp1x = lx + length * 0.6 * Math.cos(angle) + width * 0.4 * Math.cos(baseL);
    const cp1y = ly + length * 0.6 * Math.sin(angle) + width * 0.4 * Math.sin(baseL);
    const cp2x = rx + length * 0.6 * Math.cos(angle) + width * 0.4 * Math.cos(baseR);
    const cp2y = ry + length * 0.6 * Math.sin(angle) + width * 0.4 * Math.sin(baseR);
    return `M${lx.toFixed(1)},${ly.toFixed(1)} C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${tipX.toFixed(1)},${tipY.toFixed(1)} ${tipX.toFixed(1)},${tipY.toFixed(1)} C${tipX.toFixed(1)},${tipY.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${rx.toFixed(1)},${ry.toFixed(1)} Z`;
  };

  const cx = 200, cy = 210;

  return (
    <div ref={ref} style={{ display: "flex", gap: 64, alignItems: "center" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ position: "relative", flexShrink: 0, cursor: "default" }}
      >
        <svg width="400" height="420" viewBox="0 0 400 420" style={{ display: "block", overflow: "visible" }}>
          <defs>
            <radialGradient id="petalGrad" cx="50%" cy="70%" r="60%">
              <stop offset="0%" stopColor={C.petal} stopOpacity="0.9" />
              <stop offset="100%" stopColor={C.petalSoft} stopOpacity="0.6" />
            </radialGradient>
            <radialGradient id="innerPetalGrad" cx="50%" cy="70%" r="60%">
              <stop offset="0%" stopColor={C.petal} stopOpacity="0.75" />
              <stop offset="100%" stopColor="#F5C0C8" stopOpacity="0.55" />
            </radialGradient>
            <radialGradient id="centerGrad" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#F5D080" />
              <stop offset="100%" stopColor={C.gold} />
            </radialGradient>
          </defs>

          {/* Outer petals — bloom outward */}
          {outerPetals.map((p, i) => (
            <motion.path
              key={`op-${i}`}
              d={petalPath(cx, cy, p.angle, p.r, p.length, p.width)}
              fill="url(#petalGrad)"
              initial={{ scale: 0, opacity: 0 }}
              animate={inView ? {
                scale: hovered ? 1.08 : 1,
                opacity: 1,
                rotate: hovered ? (i % 2 === 0 ? 3 : -3) : 0,
              } : { scale: 0, opacity: 0 }}
              style={{ originX: `${cx}px`, originY: `${cy}px` }}
              transition={{
                scale: { duration: 0.8, delay: inView ? 0.15 + i * 0.06 : 0, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.6, delay: inView ? 0.1 + i * 0.06 : 0 },
                rotate: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
              }}
            />
          ))}

          {/* Inner petals */}
          {innerPetals.map((p, i) => (
            <motion.path
              key={`ip-${i}`}
              d={petalPath(cx, cy, p.angle, p.r, p.length, p.width)}
              fill="url(#innerPetalGrad)"
              initial={{ scale: 0, opacity: 0 }}
              animate={inView ? {
                scale: hovered ? 1.06 : 1,
                opacity: 1,
              } : { scale: 0, opacity: 0 }}
              style={{ originX: `${cx}px`, originY: `${cy}px` }}
              transition={{
                scale: { duration: 0.7, delay: inView ? 0.5 + i * 0.05 : 0, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.5, delay: inView ? 0.45 + i * 0.05 : 0 },
              }}
            />
          ))}

          {/* Center disc */}
          <motion.circle
            cx={cx}
            cy={cy}
            r={28}
            fill="url(#centerGrad)"
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            style={{ originX: `${cx}px`, originY: `${cy}px` }}
            transition={{ duration: 0.5, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Stamens */}
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * Math.PI * 2) / 12;
            const r1 = 12, r2 = 24;
            return (
              <motion.g key={i}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 1.1 + i * 0.04 }}
              >
                <line
                  x1={cx + r1 * Math.cos(a)} y1={cy + r1 * Math.sin(a)}
                  x2={cx + r2 * Math.cos(a)} y2={cy + r2 * Math.sin(a)}
                  stroke={C.dark} strokeWidth="0.8" strokeOpacity="0.35"
                />
                <circle cx={cx + r2 * Math.cos(a)} cy={cy + r2 * Math.sin(a)} r="1.5" fill={C.dark} fillOpacity="0.4" />
              </motion.g>
            );
          })}

          {/* Stem */}
          <motion.path
            d={`M${cx},${cy + 28} Q${cx - 20},${cy + 120} ${cx - 15},${cy + 200}`}
            fill="none"
            stroke={C.green}
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Leaf */}
          <motion.path
            d={`M${cx - 10},${cy + 140} Q${cx - 60},${cy + 120} ${cx - 55},${cy + 160} Q${cx - 50},${cy + 180} ${cx - 10},${cy + 155} Z`}
            fill={C.green}
            fillOpacity="0.7"
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            style={{ originX: `${cx - 10}px`, originY: `${cy + 150}px` }}
            transition={{ duration: 0.6, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
      </div>

      {/* Description */}
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 11, letterSpacing: "0.4em", color: C.petal, textTransform: "uppercase", marginBottom: 20 }}>Notre Philosophie</p>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 28, color: C.dark, fontFamily: "'Cormorant Infant', serif" }}>
          <TextReveal text="Chaque fleur" />
          <TextReveal text="a sa saison." delay={0.15} style={{ fontStyle: "italic", color: C.petal }} />
        </h2>
        <p style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 16, color: C.muted, lineHeight: 1.85, marginBottom: 24, fontWeight: 300 }}>
          Hover the peony to watch it breathe. That's the same sensitivity we bring to every arrangement — reading the flower, understanding its weight, its tension, the way it opens.
        </p>
        <p style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 16, color: C.muted, lineHeight: 1.85, marginBottom: 40, fontWeight: 300 }}>
          We work exclusively with seasonal and locally-grown stems. No dyed flowers. No imported roses in winter. Just what is naturally extraordinary at this moment of the year.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { val: "100%", label: "Seasonal blooms" },
            { val: "48h", label: "Max post-cut" },
            { val: "8+", label: "Partner growers" },
          ].map(item => (
            <div key={item.label} style={{ paddingTop: 16, borderTop: `2px solid ${C.petal}` }}>
              <p style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 28, fontWeight: 600, color: C.dark, letterSpacing: "-0.01em", lineHeight: 1 }}>{item.val}</p>
              <p style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 13, color: C.muted, marginTop: 6 }}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── ArrangementCard ────────────────────────────────────────── */
function ArrangementCard({ item }: { item: typeof ARRANGEMENTS[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      style={{ background: hovered ? C.bgCard : C.bg, border: `1px solid ${hovered ? C.petal : C.border}`, borderRadius: 4, padding: "28px", cursor: "pointer", transition: "background 0.25s, border-color 0.25s" }}
    >
      {/* Small botanical mark */}
      <div style={{ marginBottom: 20 }}>
        <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
          <line x1="14" y1="36" x2="14" y2="10" stroke={C.green} strokeWidth="1.5" />
          {[14, 20, 26].map((y, i) => (
            <g key={i}>
              <ellipse cx={8} cy={y} rx={5} ry={3} fill={C.green} opacity={0.55} transform={`rotate(-25,8,${y})`} />
              <ellipse cx={20} cy={y} rx={5} ry={3} fill={C.green} opacity={0.55} transform={`rotate(25,20,${y})`} />
            </g>
          ))}
          <circle cx={14} cy={9} r={5} fill={C.petal} fillOpacity="0.7" />
        </svg>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <h3 style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 18, fontWeight: 600, color: C.dark, lineHeight: 1.2 }}>{item.name}</h3>
        <span style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 17, color: C.dark }}>€{item.price}</span>
      </div>
      <span style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 11, color: C.petal, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12, display: "block" }}>{item.tag}</span>
      <p style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 14, color: C.muted, lineHeight: 1.7 }}>{item.desc}</p>
      <motion.div style={{ marginTop: 20, height: 1.5, background: `linear-gradient(to right, ${C.petal}, ${C.petalSoft})`, scaleX: hovered ? 1 : 0, transformOrigin: "left" }} transition={{ duration: 0.35 }} />
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function Page() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = FONTS;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <main style={{ background: C.bg, color: C.dark, minHeight: "100vh", fontFamily: "'Cormorant Infant', serif", overflowX: "hidden" }}>

      {/* ── Nav ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "0 40px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(250,244,240,0.94)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="20" height="26" viewBox="0 0 20 26" fill="none">
            <line x1="10" y1="26" x2="10" y2="8" stroke={C.green} strokeWidth="1.5" />
            {[10, 16].map((y, i) => (
              <g key={i}>
                <ellipse cx={5} cy={y} rx={4} ry={2.5} fill={C.green} opacity={0.7} transform={`rotate(-25,5,${y})`} />
                <ellipse cx={15} cy={y} rx={4} ry={2.5} fill={C.green} opacity={0.7} transform={`rotate(25,15,${y})`} />
              </g>
            ))}
            <circle cx={10} cy={7} r={4} fill={C.petal} fillOpacity="0.8" />
          </svg>
          <div>
            <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 22, color: C.dark, lineHeight: 1 }}>Botanica</p>
            <p style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 9, color: C.muted, letterSpacing: "0.25em", textTransform: "uppercase", lineHeight: 1 }}>Floral Atelier</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {["Boutique", "Événements", "Ateliers", "Notre Histoire"].map(item => (
            <button key={item} onClick={() => document.getElementById(({"Boutique": "boutique", "Événements": "evenements", "Ateliers": "ateliers", "Notre Histoire": "histoire"})[item] || "")?.scrollIntoView({behavior:"smooth"})}
              style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 14, color: C.muted, background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.dark)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
              {item}
            </button>
          ))}
          <MagneticButton style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 13, color: C.bg, background: C.petal, padding: "9px 22px", borderRadius: 2, letterSpacing: "0.05em" }}>
            Commander
          </MagneticButton>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section ref={heroRef} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", paddingTop: 64, overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 75% 60% at 50% 30%, rgba(200,104,120,0.09) 0%, transparent 65%)" }} />
          {/* Floating petal shapes */}
          {[
            { x: "5%", y: "20%", delay: 0 }, { x: "88%", y: "15%", delay: 0.5 },
            { x: "8%", y: "70%", delay: 1 }, { x: "85%", y: "65%", delay: 0.3 },
            { x: "50%", y: "5%", delay: 0.8 }, { x: "25%", y: "85%", delay: 1.4 },
          ].map((item, i) => (
            <motion.div key={i} style={{ position: "absolute", left: item.x, top: item.y }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 0.18, y: 0 }}
              transition={{ delay: item.delay, duration: 1.2 }}>
              <motion.div animate={{ y: [-8, 8, -8], rotate: [-5, 5, -5] }} transition={{ duration: 5 + i * 0.8, repeat: Infinity, ease: "easeInOut" }}>
                <svg width={24 + i * 6} height={32 + i * 8} viewBox="0 0 30 40">
                  <path d="M15,2 C8,4 4,14 5,22 Q6,34 15,38 Q24,34 25,22 C26,14 22,4 15,2 Z" fill={C.petal} />
                  <path d="M15,38 Q15,28 15,20" stroke={C.green} strokeWidth="1.5" fill="none" />
                </svg>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div style={{ opacity: heroOpacity, position: "relative", zIndex: 1, textAlign: "center", maxWidth: 860, padding: "0 24px" }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 12, letterSpacing: "0.35em", color: C.petal, textTransform: "uppercase", marginBottom: 20 }}
          >
            Atelier Floral · Paris 11e
          </motion.p>

          <h1 style={{ fontSize: "clamp(52px, 9vw, 110px)", lineHeight: 0.9, marginBottom: 16 }}>
            <TextReveal text="La beauté" delay={0.3} style={{ display: "block", fontFamily: "'Great Vibes', cursive", color: C.dark, fontSize: "clamp(64px, 11vw, 140px)" }} />
          </h1>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 68px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 40, fontFamily: "'Cormorant Infant', serif" }}>
            <TextReveal text="qui dure" delay={0.55} style={{ display: "block", fontStyle: "italic", color: C.green }} />
            <TextReveal text="le temps d'une fleur." delay={0.75} style={{ display: "block", color: C.dark }} />
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 17, color: C.muted, lineHeight: 1.8, maxWidth: 540, margin: "0 auto 48px", fontWeight: 300 }}
          >
            Bouquets saisonniers, créations événementielles et ateliers de composition florale. Chaque arrangement est une histoire racontée avec des fleurs locales, fraîches du marché.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            style={{ display: "flex", gap: 16, justifyContent: "center" }}
          >
            <MagneticButton style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 14, color: C.bg, background: C.petal, padding: "15px 40px", borderRadius: 2, letterSpacing: "0.05em" }}>
              Découvrir la Boutique
            </MagneticButton>
            <MagneticButton style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 14, color: C.dark, background: "transparent", padding: "15px 40px", borderRadius: 2, letterSpacing: "0.05em", border: `1px solid ${C.border}` }}>
              Événements
            </MagneticButton>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Marquee ── */}
      <MarqueeStrip />

      {/* ── Blooming Flower — Signature Element ── */}
      <section id="boutique" style={{ padding: "80px 0", maxWidth: 1100, margin: "0 auto", paddingInline: 40 }}>
        <BloomingFlower />
      </section>

      {/* ── Arrangements ── */}
      <section id="evenements" style={{ padding: "80px 0", background: C.bgCard, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", paddingInline: 40 }}>
          <div style={{ marginBottom: 56 }}>
            <p style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 11, letterSpacing: "0.35em", color: C.petal, textTransform: "uppercase", marginBottom: 16 }}>La Boutique</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.dark, fontFamily: "'Cormorant Infant', serif" }}>
              <TextReveal text="Nos créations" />
              <TextReveal text="du moment." delay={0.15} style={{ fontStyle: "italic" }} />
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {ARRANGEMENTS.map((item, i) => (
              <motion.div key={item.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}>
                <ArrangementCard item={item} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section id="ateliers" style={{ padding: "80px 0", maxWidth: 1100, margin: "0 auto", paddingInline: 40 }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 11, letterSpacing: "0.35em", color: C.petal, textTransform: "uppercase", marginBottom: 16 }}>Notre Méthode</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.dark, fontFamily: "'Great Vibes', cursive" }}>
            Du marché à vos mains
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
          {PROCESS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ textAlign: "center" }}
            >
              <div style={{ width: 56, height: 56, borderRadius: "50%", border: `1.5px solid ${C.petal}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", background: `${C.petal}10` }}>
                <span style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 18, color: C.petal, fontStyle: "italic" }}>{step.num}</span>
              </div>
              <h3 style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 20, fontWeight: 600, color: C.dark, marginBottom: 12 }}>{step.title}</h3>
              <p style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 15, color: C.muted, lineHeight: 1.75, fontWeight: 300 }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Events & Workshops ── */}
      <section id="histoire" style={{ padding: "80px 0", background: C.bgDark }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", paddingInline: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56 }}>
            <div>
              <p style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 11, letterSpacing: "0.35em", color: C.petal, textTransform: "uppercase", marginBottom: 20 }}>Ateliers & Événements</p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, lineHeight: 1.1, color: C.bg, fontFamily: "'Cormorant Infant', serif" }}>
                <TextReveal text="Venez créer" />
                <TextReveal text="avec nous." delay={0.15} style={{ fontStyle: "italic", color: C.petalSoft }} />
              </h2>
            </div>
            <MagneticButton style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 13, color: C.bg, background: C.petal, padding: "11px 28px", borderRadius: 2, letterSpacing: "0.05em" }}>
              Tous les Ateliers
            </MagneticButton>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {EVENTS.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ x: 8 }}
                style={{ display: "flex", gap: 32, padding: "28px 0", borderBottom: `1px solid rgba(200,104,120,0.14)`, alignItems: "center", cursor: "pointer" }}
              >
                <div style={{ flexShrink: 0, minWidth: 140 }}>
                  <p style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 15, color: C.petalSoft }}>{event.date}</p>
                  <p style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 13, color: C.muted }}>{event.time}</p>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 18, fontWeight: 600, color: C.bg }}>{event.name}</p>
                  {event.spots && <p style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 13, color: C.petal, marginTop: 4 }}>{event.spots} places restantes</p>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 18, color: C.petalSoft }}>€{event.price}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.petal} strokeWidth="1.5">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px 0", maxWidth: 700, margin: "0 auto", paddingInline: 40, textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: "clamp(48px, 8vw, 96px)", color: C.dark, lineHeight: 1, marginBottom: 24 }}>Une fleur pour quelqu'un ?</h2>
        <p style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 16, color: C.muted, lineHeight: 1.8, marginBottom: 48, fontWeight: 300 }}>Livraison le jour même à Paris. Commandez avant 12h pour une livraison l'après-midi. Emballage kraft recyclé, carte manuscrite incluse.</p>
        <MagneticButton style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 15, color: C.bg, background: C.petal, padding: "18px 56px", borderRadius: 2, letterSpacing: "0.05em" }}>
          Commander un Bouquet
        </MagneticButton>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "28px 40px", background: C.bgCard }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 22, color: C.dark }}>Botanica</p>
          <p style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 12, color: C.muted }}>© 2025 — Atelier Floral Paris</p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Instagram", "Newsletter", "Contact"].map(link => (
              <button key={link} style={{ fontFamily: "'Cormorant Infant', serif", fontSize: 13, color: C.muted, background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.dark)}
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
