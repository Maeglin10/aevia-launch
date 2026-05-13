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
import { useRef, useState, useEffect } from "react";

/* ─── Design Tokens ─────────────────────────────────────────── */
const C = {
  bg:      "#080B0F",
  bgCard:  "#10151E",
  bgMid:   "#1A2030",
  ice:     "#7AAFC8",
  amber:   "#D9703A",
  snow:    "#E8F0F5",
  muted:   "#7A8A9A",
  border:  "rgba(122,175,200,0.14)",
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700;900&family=Space+Grotesk:wght@300;400;500;600&display=swap');`;

/* ─── Data ───────────────────────────────────────────────────── */
const SLIDES = [
  { id: 1, title: "Svalbard", sub: "The Frozen Frontier", loc: "Norway · 77°N", date: "March 2024", tag: "Arctic", bg: "linear-gradient(160deg, #060A10 0%, #0D1828 40%, #162840 70%, #0A1520 100%)", accent: "#7AAFC8" },
  { id: 2, title: "Patagonia", sub: "The Last Wilderness", loc: "Chile · Torres del Paine", date: "November 2023", tag: "Mountain", bg: "linear-gradient(160deg, #0A0C0E 0%, #1A1810 40%, #2A2418 70%, #181410 100%)", accent: "#C8943A" },
  { id: 3, title: "Faroe Islands", sub: "Where Sea Meets Sky", loc: "Denmark · 62°N", date: "July 2023", tag: "Coastal", bg: "linear-gradient(160deg, #0C0E12 0%, #141820 40%, #1C2030 70%, #101420 100%)", accent: "#8A9EB8" },
  { id: 4, title: "Hokkaido", sub: "Silence in the Snowfields", loc: "Japan · Biei", date: "February 2024", tag: "Winter", bg: "linear-gradient(160deg, #0A0C10 0%, #161820 40%, #1E2030 70%, #121620 100%)", accent: "#B8C8D8" },
];

const SERIES = [
  { name: "Svalbard", year: "2024", count: 18, tag: "Arctic" },
  { name: "Patagonia", year: "2023", count: 24, tag: "Wilderness" },
  { name: "Faroe Islands", year: "2023", count: 14, tag: "Coastal" },
  { name: "Hokkaido", year: "2024", count: 20, tag: "Winter" },
  { name: "Namibia", year: "2022", count: 31, tag: "Desert" },
  { name: "Iceland", year: "2022", count: 22, tag: "Volcanic" },
];

const LOCATIONS = ["Svalbard", "Patagonia", "Faroe Islands", "Hokkaido", "Namibia", "Iceland", "Kamchatka", "Atacama", "Greenland", "Tasmania"];

/* ─── TextReveal ─────────────────────────────────────────────── */
function TextReveal({ text, delay = 0, style = {} }: { text: string; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} style={{ overflow: "hidden", ...style }}>
      <motion.div
        initial={{ y: "110%" }}
        animate={inView ? { y: 0 } : { y: "110%" }}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
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
  const items = [...LOCATIONS, ...LOCATIONS];
  return (
    <div style={{ overflow: "hidden", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "10px 0" }}>
      <motion.div
        style={{ display: "flex", gap: 56, whiteSpace: "nowrap" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {items.map((loc, i) => (
          <span key={i} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, letterSpacing: "0.2em", color: C.muted, textTransform: "uppercase" }}>
            {loc}<span style={{ marginLeft: 56, color: C.ice, fontSize: 8 }}>◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── CurtainReveal — Signature Element ──────────────────────── */
function CurtainReveal({ revealed }: { revealed: boolean }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}>
      {/* Left curtain */}
      <motion.div
        initial={{ x: "0%" }}
        animate={revealed ? { x: "-100%" } : { x: "0%" }}
        transition={{ duration: 1.8, ease: [0.76, 0, 0.24, 1] }}
        style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "50%", background: C.bg, zIndex: 2 }}
      >
        {/* Curtain edge detail */}
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom, transparent, ${C.ice}60, transparent)` }} />
      </motion.div>
      {/* Right curtain */}
      <motion.div
        initial={{ x: "0%" }}
        animate={revealed ? { x: "100%" } : { x: "0%" }}
        transition={{ duration: 1.8, ease: [0.76, 0, 0.24, 1] }}
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "50%", background: C.bg, zIndex: 2 }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom, transparent, ${C.ice}60, transparent)` }} />
      </motion.div>
    </div>
  );
}

/* ─── SlideScene — Landscape SVG ─────────────────────────────── */
function SlideScene({ slide }: { slide: typeof SLIDES[0] }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 1440 680" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id={`sky-${slide.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={slide.accent} stopOpacity="0.12" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <rect width="1440" height="680" fill={slide.bg} />
      <rect width="1440" height="320" fill={`url(#sky-${slide.id})`} />

      {/* Horizon terrain */}
      <path d="M0,680 Q200,380 400,420 Q600,460 720,380 Q840,300 1080,360 Q1200,400 1440,320 L1440,680 Z" fill={slide.accent} fillOpacity="0.05" />
      <path d="M0,680 Q300,460 600,480 Q900,500 1200,440 L1440,460 L1440,680 Z" fill={slide.accent} fillOpacity="0.08" />
      <path d="M0,680 Q360,540 720,560 Q1080,580 1440,540 L1440,680 Z" fill={slide.accent} fillOpacity="0.12" />

      {/* Foreground silhouette (terrain-specific) */}
      {slide.tag === "Arctic" && (
        <>
          {[0, 80, 160, 240, 320, 400, 480, 560, 640, 720, 800, 880, 960, 1040, 1120, 1200, 1280, 1360].map((x, i) => (
            <polygon key={i} points={`${x},680 ${x + 20},${560 + Math.sin(i * 1.4) * 60} ${x + 40},680`} fill={C.bgCard} opacity={0.6} />
          ))}
        </>
      )}
      {slide.tag === "Mountain" && (
        <>
          <polygon points="300,680 560,280 820,680" fill={C.bgMid} opacity="0.8" />
          <polygon points="620,680 880,200 1140,680" fill={C.bgCard} opacity="0.9" />
          <polygon points="0,680 200,420 400,680" fill={C.bgMid} opacity="0.7" />
          <polygon points="1100,680 1280,360 1440,680" fill={C.bgCard} opacity="0.8" />
        </>
      )}
      {slide.tag === "Coastal" && (
        <>
          <path d="M0,680 Q360,580 720,600 Q1080,620 1440,580 L1440,680 Z" fill={C.bgCard} opacity="0.7" />
          <path d="M0,580 Q180,560 360,590" fill="none" stroke={slide.accent} strokeWidth="1" opacity="0.3" />
        </>
      )}
      {slide.tag === "Winter" && (
        <>
          {[...Array(20)].map((_, i) => (
            <circle key={i} cx={80 + i * 66} cy={580 + Math.sin(i * 2) * 30} r={4} fill="white" opacity="0.08" />
          ))}
          <path d="M0,680 Q720,560 1440,600 L1440,680 Z" fill="white" opacity="0.04" />
        </>
      )}

      {/* Stars / particles */}
      {[...Array(24)].map((_, i) => (
        <circle key={i} cx={60 + (i * 58) % 1320} cy={20 + (i * 31) % 280} r={0.8 + (i % 3) * 0.4} fill="white" opacity={0.15 + (i % 4) * 0.1} />
      ))}

      {/* Vignette overlay */}
      <radialGradient id="vign" cx="50%" cy="50%" r="70%">
        <stop offset="50%" stopColor="transparent" />
        <stop offset="100%" stopColor={C.bg} stopOpacity="0.7" />
      </radialGradient>
      <rect width="1440" height="680" fill="url(#vign)" />
    </svg>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function Page() {
  const [revealed, setRevealed] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const slide = SLIDES[activeSlide];

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = FONTS;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const goNext = () => setActiveSlide(p => (p + 1) % SLIDES.length);
  const goPrev = () => setActiveSlide(p => (p - 1 + SLIDES.length) % SLIDES.length);

  return (
    <main style={{ background: C.bg, color: C.snow, minHeight: "100vh", fontFamily: "'Archivo', sans-serif", overflowX: "hidden" }}>

      {/* ── Nav ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 60, padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(8,11,15,0.8)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.ice} strokeWidth="1.5">
            <circle cx="12" cy="12" r="3" />
            <path d="M3 12h3M18 12h3M12 3v3M12 18v3" />
            <path d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
          </svg>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", color: C.snow, textTransform: "uppercase" }}>Terra</span>
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {["Work", "Series", "Prints", "About"].map(item => (
            <button key={item} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.muted, background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.snow)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
              {item}
            </button>
          ))}
          <MagneticButton style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: C.bg, background: C.ice, padding: "8px 20px", borderRadius: 2, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Print Shop
          </MagneticButton>
        </div>
      </nav>

      {/* ── Hero with CurtainReveal ── */}
      <section ref={heroRef} style={{ height: "100vh", position: "relative", overflow: "hidden", paddingTop: 64 }}>
        {/* Slide background — animated between slides */}
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              style={{ position: "absolute", inset: 0 }}
            >
              <SlideScene slide={slide} />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Curtain — opens on mount */}
        <CurtainReveal revealed={revealed} />

        {/* Hero content */}
        <motion.div style={{ opacity: heroOpacity, position: "absolute", inset: 0, zIndex: 3, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 56px 56px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              {/* Location tag */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={revealed ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 2.0 }}
                style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}
              >
                <div style={{ width: 32, height: 1, background: C.ice }} />
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: C.ice, letterSpacing: "0.25em", textTransform: "uppercase" }}>
                  {slide.loc} · {slide.date}
                </span>
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div key={activeSlide}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h1 style={{ fontSize: "clamp(56px, 10vw, 128px)", fontWeight: 900, lineHeight: 0.88, letterSpacing: "-0.04em", color: C.snow, marginBottom: 8 }}>
                    {slide.title}
                  </h1>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, color: C.muted, letterSpacing: "0.02em", fontWeight: 300 }}>
                    {slide.sub}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slide controls */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
              {/* Slide counter */}
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.muted, marginBottom: 12, letterSpacing: "0.1em" }}>
                {String(activeSlide + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={goPrev} style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: `1px solid ${C.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = `rgba(122,175,200,0.2)`)}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.snow} strokeWidth="1.5">
                    <path d="M19 12H5M12 5l-7 7 7 7" />
                  </svg>
                </button>
                <button onClick={goNext} style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: `1px solid ${C.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = `rgba(122,175,200,0.2)`)}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.snow} strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Progress dots */}
          <div style={{ position: "absolute", bottom: 56, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 }}>
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setActiveSlide(i)} style={{ width: i === activeSlide ? 32 : 8, height: 4, borderRadius: 2, background: i === activeSlide ? C.ice : "rgba(255,255,255,0.25)", cursor: "pointer", border: "none", padding: 0, transition: "all 0.3s" }} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Marquee ── */}
      <MarqueeStrip />

      {/* ── Series Grid ── */}
      <section style={{ padding: "80px 0", maxWidth: 1200, margin: "0 auto", paddingInline: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56 }}>
          <div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.3em", color: C.ice, textTransform: "uppercase", marginBottom: 16 }}>Portfolio</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em", color: C.snow }}>
              <TextReveal text="Expeditions" />
              <TextReveal text="& Series" delay={0.15} style={{ color: C.ice }} />
            </h2>
          </div>
          <MagneticButton style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: C.ice, background: "transparent", border: `1px solid ${C.border}`, padding: "10px 24px", borderRadius: 2, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            All Series
          </MagneticButton>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
          {SERIES.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "32px 28px", cursor: "pointer" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: C.ice, background: `${C.ice}18`, padding: "3px 10px", borderRadius: 2, letterSpacing: "0.1em" }}>{s.tag}</span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.muted }}>{s.year}</span>
              </div>
              {/* Landscape preview */}
              <div style={{ aspectRatio: "16/9", background: C.bgMid, marginBottom: 16, borderRadius: 2, position: "relative", overflow: "hidden" }}>
                <svg width="100%" height="100%" viewBox="0 0 320 180">
                  <rect width="320" height="180" fill="transparent" />
                  <path d="M0,180 Q80,100 160,120 Q240,140 320,90 L320,180 Z" fill={C.bg} opacity="0.7" />
                  <path d="M0,180 Q100,140 200,150 Q280,160 320,140 L320,180 Z" fill={C.bgCard} opacity="0.8" />
                  {[...Array(8)].map((_, j) => (
                    <circle key={j} cx={20 + j * 38} cy={20 + Math.sin(j * 1.5) * 30} r={0.8} fill="white" opacity="0.2" />
                  ))}
                </svg>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <h3 style={{ fontFamily: "'Archivo', sans-serif", fontSize: 20, fontWeight: 700, color: C.snow, letterSpacing: "-0.02em" }}>{s.name}</h3>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.muted }}>{s.count} frames</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── About / Statement ── */}
      <section style={{ padding: "80px 0", background: C.bgCard, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", paddingInline: 32 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.3em", color: C.ice, textTransform: "uppercase", marginBottom: 24 }}>About</p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.snow, marginBottom: 28 }}>
                <TextReveal text="Chasing light" />
                <TextReveal text="at the edge" delay={0.15} />
                <TextReveal text="of the world." delay={0.3} style={{ color: C.ice }} />
              </h2>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.8, fontWeight: 300, marginBottom: 24 }}>
                I spend weeks in some of the planet's most extreme environments — Arctic archipelagos, high-altitude plateaus, volcanic coastlines — in pursuit of the unrepeatable moment.
              </p>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.8, fontWeight: 300, marginBottom: 40 }}>
                Every print is produced in partnership with a specialist fine art lab using archival pigment inks. Each expedition generates a limited edition series — never more than 30 prints per image.
              </p>
              <div style={{ display: "flex", gap: 40 }}>
                {[{ val: "35+", label: "Countries" }, { val: "12yr", label: "Active" }, { val: "≤30", label: "Prints/image" }].map(item => (
                  <div key={item.label}>
                    <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: 28, fontWeight: 900, color: C.snow, letterSpacing: "-0.02em" }}>{item.val}</p>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.muted, marginTop: 4 }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Camera / field notes callout */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Camera", value: "Hasselblad X2D 100C · 100MP medium format" },
                { label: "Lenses", value: "XCD 65mm f/2.8 · XCD 30mm f/3.5 · XCD 135mm f/2.8" },
                { label: "Processing", value: "Capture One Pro · bespoke colour grading per series" },
                { label: "Print partner", value: "Atelier Nüssle, Zurich — Hahnemühle Fine Art papers" },
                { label: "Editions", value: "Maximum 30 prints per image, signed + numbered" },
              ].map(item => (
                <div key={item.label} style={{ padding: "18px 24px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 2 }}>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: C.ice, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>{item.label}</p>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.snow }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Print CTA ── */}
      <section style={{ padding: "80px 0", maxWidth: 900, margin: "0 auto", paddingInline: 32, textAlign: "center" }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: "0.3em", color: C.ice, textTransform: "uppercase", marginBottom: 24 }}>Fine Art Prints</p>
        <h2 style={{ fontSize: "clamp(36px, 6vw, 80px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 0.92, marginBottom: 36, color: C.snow }}>
          <TextReveal text="Own a" style={{ display: "block" }} />
          <TextReveal text="moment" delay={0.15} style={{ display: "block", color: C.ice }} />
          <TextReveal text="in time." delay={0.3} style={{ display: "block" }} />
        </h2>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, color: C.muted, lineHeight: 1.75, maxWidth: 500, margin: "0 auto 48px", fontWeight: 300 }}>
          Museum-quality archival prints in four sizes. Hand-packed and shipped with a certificate of authenticity.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <MagneticButton style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.bg, background: C.snow, padding: "16px 44px", borderRadius: 2, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
            Browse Prints
          </MagneticButton>
          <MagneticButton style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: C.snow, background: "transparent", border: `1px solid ${C.border}`, padding: "16px 44px", borderRadius: 2, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Commission
          </MagneticButton>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "28px 32px", background: C.bgCard }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.muted }}>© 2025 Terra. All expeditions reserved.</p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Instagram", "Newsletter", "Contact"].map(link => (
              <button key={link} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: C.muted, background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.snow)}
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
