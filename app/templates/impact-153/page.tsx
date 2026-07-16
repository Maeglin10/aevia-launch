"use client";
// @ts-nocheck

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react"
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion"
import Link from "next/link"

/* ==========================================================================
   TYPOGRAPHY — Google Fonts injected via style tag
   ========================================================================== */

const FONT_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Inter:wght@300;400;500;600&display=swap');
`

/* ==========================================================================
   COLOUR PALETTE & DESIGN TOKENS
   ========================================================================== */

// Lightens (positive percent) or darkens (negative) a #rrggbb hex color —
// used to derive light/dark shades from the client's brand color.
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
  bg:        "#0a0d0f",
  bgMid:     "#0e1215",
  bgLight:   "#141a1f",
  text:      "#e8e4d8",
  textMuted: "rgba(232,228,216,0.45)",
  textDim:   "rgba(232,228,216,0.18)",
  accent:    "#e85d04",
  accentDim: "rgba(232,93,4,0.18)",
  snow:      "#f5f2ec",
  border:    "rgba(232,228,216,0.1)",
  borderFaint:"rgba(232,228,216,0.06)",
};

/* ==========================================================================
   EXPEDITION DATA
   ========================================================================== */

const EXPEDITIONS = [
  {
    id:          "k2",
    name:        "K2 North Face",
    region:      "Karakoram · Pakistan",
    altitude:    8849,
    altDisplay:  "8,849",
    difficulty:  "EXTREME",
    duration:    "45 Days",
    season:      "Jun — Aug",
    coordinates: "35.8800° N, 76.5151° E",
    slots:       4,
    price:       "€ 48,000",
    color:       "#e85d04",
    tag:         "World's Hardest Mountain",
    description: "The Savage Mountain. Only 400 people have ever stood on its summit — fewer than have died trying. Technical ice climbing above 8,000m in the death zone.",
  },
  {
    id:          "vinson",
    name:        "Vinson Massif",
    region:      "Ellsworth Mountains · Antarctica",
    altitude:    7382,
    altDisplay:  "7,382",
    difficulty:  "HARD",
    duration:    "22 Days",
    season:      "Nov — Jan",
    coordinates: "78.5333° S, 85.6167° W",
    slots:       6,
    price:       "€ 36,000",
    color:       "#6ea8fe",
    tag:         "Highest Peak on Earth's Last Continent",
    description: "Antarctica's frozen crown. Temperatures plunge to -40°C with 100 km/h winds. The most remote high-altitude objective on the planet.",
  },
  {
    id:          "aconcagua",
    name:        "Aconcagua Summit",
    region:      "Andes · Argentina",
    altitude:    6961,
    altDisplay:  "6,961",
    difficulty:  "MODERATE",
    duration:    "18 Days",
    season:      "Jan — Feb",
    coordinates: "32.6532° S, 70.0109° W",
    slots:       8,
    price:       "€ 18,500",
    color:       "#6fcf97",
    tag:         "Roof of the Western Hemisphere",
    description: "The gateway to the Eight-Thousanders. High-altitude acclimatisation above 5,500m with exposed ridge traverses and violent Viento Blanco winds.",
  },
]

/* ==========================================================================
   GEAR DATA
   ========================================================================== */

const GEAR_ITEMS = [
  {
    id:    "tent",
    name:  "High-Camp Shelter",
    model: "Atlas X1 Four-Season",
    spec:  "–60 °C rated · 1.8 kg · Dyneema composite",
    icon:  (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48 }}>
        <path d="M8 52 L32 14 L56 52 Z" />
        <path d="M20 52 L32 34 L44 52" />
        <line x1="8" y1="52" x2="56" y2="52" />
      </svg>
    ),
  },
  {
    id:    "boots",
    name:  "Double Mountaineering Boots",
    model: "Phantom 8000",
    spec:  "–50 °C rated · BOA dial · Carbon shank",
    icon:  (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48 }}>
        <path d="M10 44 Q10 34 20 34 L30 34 L30 20 Q30 14 36 14 L44 14 Q52 14 52 24 L52 44 Z" />
        <line x1="10" y1="44" x2="52" y2="44" />
        <line x1="22" y1="34" x2="22" y2="44" />
      </svg>
    ),
  },
  {
    id:    "crampons",
    name:  "Technical Crampons",
    model: "Vertigo 14-Point",
    spec:  "Stainless steel · 620 g/pair · Anti-balling",
    icon:  (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48 }}>
        <rect x="16" y="26" width="32" height="12" rx="2" />
        <line x1="20" y1="38" x2="18" y2="50" />
        <line x1="26" y1="38" x2="24" y2="50" />
        <line x1="32" y1="38" x2="32" y2="50" />
        <line x1="38" y1="38" x2="40" y2="50" />
        <line x1="44" y1="38" x2="46" y2="50" />
        <line x1="24" y1="26" x2="22" y2="14" />
        <line x1="32" y1="26" x2="32" y2="14" />
        <line x1="40" y1="26" x2="42" y2="14" />
      </svg>
    ),
  },
  {
    id:    "axe",
    name:  "Ice Axe",
    model: "Petzl Sirocco",
    spec:  "280 g · T-rated · 60 cm aluminium shaft",
    icon:  (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48 }}>
        <line x1="18" y1="46" x2="46" y2="18" />
        <path d="M14 36 L28 22 L36 14 L46 18 L42 28 L28 36 Z" />
        <line x1="42" y1="46" x2="46" y2="50" />
      </svg>
    ),
  },
  {
    id:    "gps",
    name:  "Satellite GPS Beacon",
    model: "Garmin inReach Expedition",
    spec:  "Global two-way · 100h battery · SOS relay",
    icon:  (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48 }}>
        <circle cx="32" cy="28" r="12" />
        <line x1="32" y1="10" x2="32" y2="6" />
        <line x1="32" y1="50" x2="32" y2="58" />
        <line x1="14" y1="28" x2="10" y2="28" />
        <line x1="50" y1="28" x2="54" y2="28" />
        <circle cx="32" cy="28" r="4" fill="currentColor" />
      </svg>
    ),
  },
]

/* ==========================================================================
   WEATHER CONDITIONS TICKER DATA
   ========================================================================== */

const WEATHER_CONDITIONS = [
  { location: "K2 Camp IV",         temp: "–38 °C",   wind: "97 km/h",  altitude: "7,900 m", status: "STORM" },
  { location: "Vinson Base Camp",   temp: "–24 °C",   wind: "41 km/h",  altitude: "2,100 m", status: "CLEAR" },
  { location: "Aconcagua Nido",     temp: "–12 °C",   wind: "68 km/h",  altitude: "5,570 m", status: "WIND" },
  { location: "K2 Summit Approach", temp: "–45 °C",   wind: "110 km/h", altitude: "8,400 m", status: "DANGER" },
  { location: "Vinson Summit",      temp: "–31 °C",   wind: "22 km/h",  altitude: "4,892 m", status: "SUMMIT" },
]

/* ==========================================================================
   UTILITY — Reveal on Scroll
   ========================================================================== */

function Reveal({
  children,
  delay = 0,
  y = 32,
  x = 0,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  x?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ==========================================================================
   SECTION LABEL
   ========================================================================== */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display:       "inline-flex",
        alignItems:    "center",
        gap:           10,
        fontSize:      10,
        fontFamily:    "'Inter', sans-serif",
        fontWeight:    600,
        letterSpacing: "0.5em",
        textTransform: "uppercase",
        color:         C.accent,
        marginBottom:  32,
      }}
    >
      <span style={{ width: 24, height: 1, background: C.accent, display: "block", flexShrink: 0 }} />
      {children}
    </div>
  )
}

/* ==========================================================================
   1. PARALLAX MOUNTAIN HERO
   ========================================================================== */

function ParallaxMountainHero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target:  heroRef,
    offset:  ["start start", "end start"],
  })

  // Each layer at a different depth multiplier
  const skyY       = useTransform(scrollYProgress, [0, 1], ["0%", "5%"])
  const farMountY  = useTransform(scrollYProgress, [0, 1], ["0%", "15%"])
  const nearMountY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])
  const fgY        = useTransform(scrollYProgress, [0, 1], ["0%", "60%"])
  const textY      = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity    = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section id="hero"
      ref={heroRef}
      style={{
        position:   "relative",
        height:     "100dvh",
        minHeight:  700,
        overflow:   "hidden",
        display:    "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* ─── Layer 1: Sky gradient ─── */}
      <motion.div
        style={{ y: skyY, position: "absolute", inset: 0, zIndex: 1 }}
      >
        <div
          style={{
            width:      "100%",
            height:     "100%",
            background: `linear-gradient(185deg, #040608 0%, #0f1820 38%, #1a1008 100%)`,
          }}
        />
        {/* Stars */}
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            style={{
              position:  "absolute",
              width:     Math.random() < 0.3 ? 2 : 1,
              height:    Math.random() < 0.3 ? 2 : 1,
              borderRadius: "50%",
              background: "#e8e4d8",
              opacity:   Math.random() * 0.6 + 0.1,
              top:       `${Math.random() * 55}%`,
              left:      `${Math.random() * 100}%`,
            }}
          />
        ))}
      </motion.div>

      {/* ─── Layer 2: Far mountains (distant ridge) ─── */}
      <motion.div
        style={{
          y:        farMountY,
          position: "absolute",
          bottom:   0,
          left:     0,
          right:    0,
          zIndex:   2,
          height:   "62%",
        }}
      >
        <svg
          viewBox="0 0 1440 500"
          preserveAspectRatio="none"
          style={{ width: "100%", height: "100%", display: "block" }}
          fill="none"
        >
          {/* Far ridge — soft blue-grey */}
          <polygon
            points="0,500 0,340 80,260 160,300 240,210 320,270 400,180 480,240 560,160 640,220 720,140 800,200 880,130 960,190 1040,120 1120,175 1200,110 1280,170 1360,100 1440,160 1440,500"
            fill="#1c2535"
          />
          {/* Snow caps on far ridge */}
          <polygon
            points="700,145 720,140 740,148 730,165 710,165"
            fill={C.snow}
            opacity="0.7"
          />
          <polygon
            points="1040,125 1060,120 1080,128 1072,142 1050,142"
            fill={C.snow}
            opacity="0.7"
          />
          <polygon
            points="380,185 400,180 420,188 412,202 390,202"
            fill={C.snow}
            opacity="0.6"
          />
          <polygon
            points="1200,115 1220,110 1238,118 1230,132 1210,132"
            fill={C.snow}
            opacity="0.65"
          />
        </svg>
      </motion.div>

      {/* ─── Layer 3: Near mountains (mid range) ─── */}
      <motion.div
        style={{
          y:        nearMountY,
          position: "absolute",
          bottom:   0,
          left:     0,
          right:    0,
          zIndex:   3,
          height:   "50%",
        }}
      >
        <svg
          viewBox="0 0 1440 420"
          preserveAspectRatio="none"
          style={{ width: "100%", height: "100%", display: "block" }}
          fill="none"
        >
          {/* Near ridge — darker silhouette */}
          <polygon
            points="0,420 0,320 60,250 130,290 200,200 290,270 380,150 450,210 540,100 620,170 700,80 780,160 860,60 940,140 1020,50 1100,130 1180,65 1260,150 1340,90 1440,160 1440,420"
            fill="#0e1215"
          />
          {/* K2-like main peak — dramatic centre */}
          <polygon
            points="680,90 700,80 720,90 714,108 686,108"
            fill={C.snow}
            opacity="0.9"
          />
          {/* Snow streaks on near ridge */}
          <polygon
            points="858,68 876,60 894,70 888,88 864,88"
            fill={C.snow}
            opacity="0.85"
          />
          <polygon
            points="1018,58 1036,50 1052,58 1047,74 1025,74"
            fill={C.snow}
            opacity="0.8"
          />
          <polygon
            points="378,158 396,150 413,158 408,174 385,174"
            fill={C.snow}
            opacity="0.75"
          />
        </svg>
      </motion.div>

      {/* ─── Layer 4: Foreground silhouette ─── */}
      <motion.div
        style={{
          y:        fgY,
          position: "absolute",
          bottom:   0,
          left:     0,
          right:    0,
          zIndex:   4,
          height:   "30%",
        }}
      >
        <svg
          viewBox="0 0 1440 280"
          preserveAspectRatio="none"
          style={{ width: "100%", height: "100%", display: "block" }}
          fill="none"
        >
          {/* Foreground rock formation */}
          <polygon
            points="0,280 0,200 100,180 200,220 320,160 420,200 500,180 580,200 680,140 760,180 840,150 940,180 1040,200 1160,160 1280,200 1380,180 1440,195 1440,280"
            fill={C.bg}
          />
        </svg>
      </motion.div>

      {/* ─── Hero text ─── */}
      <motion.div
        style={{
          y:              textY,
          opacity,
          position:       "relative",
          zIndex:         10,
          textAlign:      "center",
          padding:        "0 24px",
          maxWidth:       1100,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            display:        "inline-flex",
            alignItems:     "center",
            gap:            12,
            fontSize:       10,
            fontFamily:     "'Inter', sans-serif",
            fontWeight:     600,
            letterSpacing:  "0.55em",
            textTransform:  "uppercase",
            color:          C.accent,
            marginBottom:   40,
            padding:        "8px 20px",
            border:         `1px solid ${C.accentDim}`,
            borderRadius:   2,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, display: "block", flexShrink: 0 }} />
          Expedition Logistics · Est. 2009
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily:   "'Syne', sans-serif",
            fontWeight:   800,
            fontSize:     "clamp(52px, 10vw, 130px)",
            lineHeight:   0.88,
            color:        C.text,
            marginBottom: 36,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
          }}
        >
          The World's<br />
          <span style={{ color: C.accent }}>Highest</span><br />
          Summits
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          style={{
            fontFamily:   "'Inter', sans-serif",
            fontWeight:   400,
            fontSize:     16,
            color:        C.textMuted,
            maxWidth:     540,
            margin:       "0 auto 48px",
            lineHeight:   1.7,
          }}
        >
          Full-service expedition logistics for K2, Vinson Massif, and Aconcagua.
          Where preparation is the difference between summit and survival.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.2 }}
          style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
        >
          <motion.a
            href="#expeditions"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display:        "inline-flex",
              alignItems:     "center",
              gap:            10,
              padding:        "16px 36px",
              background:     C.accent,
              color:          "#fff",
              fontFamily:     "'Inter', sans-serif",
              fontWeight:     600,
              fontSize:       13,
              letterSpacing:  "0.06em",
              textTransform:  "uppercase",
              textDecoration: "none",
              borderRadius:   2,
            }}
          >
            View Expeditions
            <span style={{ fontSize: 16 }}>↓</span>
          </motion.a>
          <motion.a
            href="#enquiry"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display:        "inline-flex",
              alignItems:     "center",
              gap:            10,
              padding:        "16px 36px",
              background:     "transparent",
              color:          C.text,
              fontFamily:     "'Inter', sans-serif",
              fontWeight:     600,
              fontSize:       13,
              letterSpacing:  "0.06em",
              textTransform:  "uppercase",
              textDecoration: "none",
              border:         `1px solid ${C.border}`,
              borderRadius:   2,
            }}
          >
            Book Enquiry
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
        style={{
          position:   "absolute",
          bottom:     40,
          left:       "50%",
          transform:  "translateX(-50%)",
          zIndex:     10,
          opacity:    0.4,
          display:    "flex",
          flexDirection: "column",
          alignItems: "center",
          gap:        8,
        }}
      >
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: C.textMuted }}>
          Scroll
        </span>
        <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, ${C.textMuted}, transparent)` }} />
      </motion.div>
    </section>
  )
}

/* ==========================================================================
   2. ALTITUDE COUNTER
   ========================================================================== */

function AltitudeCounter({ target, suffix = "m" }: { target: number; suffix?: string }) {
  const [current, setCurrent] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const startedRef = useRef(false)

  const formatNum = useCallback((n: number) => {
    return Math.floor(n).toLocaleString("en-GB")
  }, [])

  useEffect(() => {
    if (!inView || startedRef.current) return
    startedRef.current = true

    const DURATION = 2200
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / DURATION, 1)
      // Ease-out expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setCurrent(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target])

  return (
    <div ref={ref}>
      <span>{formatNum(current)}</span>
      <span
        style={{
          fontFamily:    "'Inter', sans-serif",
          fontWeight:    400,
          fontSize:      "0.35em",
          color:         C.accent,
          marginLeft:    6,
          verticalAlign: "middle",
        }}
      >
        {suffix}
      </span>
    </div>
  )
}

function AltitudeStatsSection() {
  return (
    <section
      id="stats"
      style={{
        background:   C.bgMid,
        padding:      "120px 24px",
        borderTop:    `1px solid ${C.borderFaint}`,
        borderBottom: `1px solid ${C.borderFaint}`,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <SectionLabel>Summit Elevations</SectionLabel>
          <p
            style={{
              fontFamily:  "'Syne', sans-serif",
              fontWeight:  800,
              fontSize:    "clamp(32px, 5vw, 56px)",
              color:       C.text,
              marginBottom: 80,
              lineHeight:  1.1,
              letterSpacing: "-0.02em",
              maxWidth:    600,
            }}
          >
            Above the Death Zone
          </p>
        </Reveal>

        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
            gap:                 "1px",
            background:          C.borderFaint,
            border:              `1px solid ${C.borderFaint}`,
          }}
        >
          {EXPEDITIONS.map((exp, i) => (
            <Reveal key={exp.id} delay={i * 0.12}>
              <div
                style={{
                  background: C.bg,
                  padding:    "56px 48px",
                }}
              >
                {/* Horizontal separator above number */}
                <div
                  style={{
                    width:        40,
                    height:       1,
                    background:   exp.color,
                    marginBottom: 24,
                  }}
                />
                <div
                  style={{
                    fontFamily:    "'Syne', sans-serif",
                    fontWeight:    800,
                    fontSize:      "clamp(48px, 6vw, 80px)",
                    lineHeight:    1,
                    color:         C.text,
                    marginBottom:  20,
                    letterSpacing: "-0.04em",
                  }}
                >
                  <AltitudeCounter target={exp.altitude} />
                </div>
                {/* Horizontal separator below number */}
                <div
                  style={{
                    width:        "100%",
                    height:       1,
                    background:   C.borderFaint,
                    marginBottom: 20,
                  }}
                />
                <div
                  style={{
                    fontFamily:   "'Syne', sans-serif",
                    fontWeight:   800,
                    fontSize:     18,
                    color:        C.text,
                    marginBottom: 8,
                  }}
                >
                  {exp.name}
                </div>
                <div
                  style={{
                    fontFamily:    "'Inter', sans-serif",
                    fontSize:      12,
                    color:         C.textMuted,
                    letterSpacing: "0.04em",
                  }}
                >
                  {exp.region}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   3. EXPEDITIONS GRID
   ========================================================================== */

function ExpeditionsSection() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section
      id="expeditions"
      style={{
        background: C.bg,
        padding:    "140px 24px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display:        "flex",
            justifyContent: "space-between",
            alignItems:     "flex-end",
            flexWrap:       "wrap",
            gap:            32,
            marginBottom:   80,
          }}
        >
          <Reveal>
            <SectionLabel>Active Expeditions</SectionLabel>
            <h2
              style={{
                fontFamily:    "'Syne', sans-serif",
                fontWeight:    800,
                fontSize:      "clamp(36px, 5.5vw, 64px)",
                color:         C.text,
                lineHeight:    1.05,
                letterSpacing: "-0.02em",
                maxWidth:      500,
              }}
            >
              Choose Your<br />Objective
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize:   14,
                color:      C.textMuted,
                maxWidth:   320,
                lineHeight: 1.7,
              }}
            >
              Three of the world's most demanding high-altitude objectives.
              All itineraries include full logistics, permitting, and on-mountain support.
            </p>
          </Reveal>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {EXPEDITIONS.map((exp, i) => (
            <Reveal key={exp.id} delay={i * 0.1}>
              <motion.div
                onHoverStart={() => setHovered(exp.id)}
                onHoverEnd={() => setHovered(null)}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                style={{
                  background:   hovered === exp.id ? C.bgLight : C.bgMid,
                  border:       `1px solid ${hovered === exp.id ? exp.color + "40" : C.borderFaint}`,
                  padding:      "40px 48px",
                  cursor:       "pointer",
                  transition:   "background 0.3s, border-color 0.3s",
                  display:      "grid",
                  gridTemplateColumns: "auto 1fr auto auto",
                  gap:          "32px 48px",
                  alignItems:   "center",
                }}
              >
                {/* Index */}
                <div
                  style={{
                    fontFamily:    "'Syne', sans-serif",
                    fontWeight:    800,
                    fontSize:      13,
                    color:         exp.color,
                    letterSpacing: "0.1em",
                    minWidth:      32,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Main info */}
                <div>
                  <div
                    style={{
                      display:       "inline-flex",
                      alignItems:    "center",
                      gap:           8,
                      fontSize:      9,
                      fontFamily:    "'Inter', sans-serif",
                      fontWeight:    600,
                      letterSpacing: "0.5em",
                      textTransform: "uppercase",
                      color:         exp.color,
                      marginBottom:  10,
                    }}
                  >
                    {exp.difficulty}
                    <span style={{ color: C.textDim }}>·</span>
                    {exp.season}
                  </div>
                  <h3
                    style={{
                      fontFamily:    "'Syne', sans-serif",
                      fontWeight:    800,
                      fontSize:      "clamp(22px, 3vw, 32px)",
                      color:         C.text,
                      marginBottom:  6,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {exp.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize:   13,
                      color:      C.textMuted,
                      lineHeight: 1.5,
                      maxWidth:   520,
                    }}
                  >
                    {exp.description}
                  </p>
                </div>

                {/* Altitude + duration */}
                <div
                  style={{
                    textAlign:  "right",
                    whiteSpace: "nowrap",
                  }}
                >
                  <div
                    style={{
                      fontFamily:    "'Syne', sans-serif",
                      fontWeight:    800,
                      fontSize:      28,
                      color:         C.text,
                      letterSpacing: "-0.03em",
                      lineHeight:    1,
                      marginBottom:  4,
                    }}
                  >
                    {exp.altDisplay}
                    <span style={{ fontSize: 14, fontFamily: "'Inter',sans-serif", fontWeight: 400, color: C.accent, marginLeft: 4 }}>m</span>
                  </div>
                  <div
                    style={{
                      fontFamily:  "'Inter', sans-serif",
                      fontSize:    11,
                      color:       C.textMuted,
                      letterSpacing: "0.06em",
                    }}
                  >
                    {exp.duration} · {exp.slots} slots
                  </div>
                </div>

                {/* Price + CTA */}
                <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  <div
                    style={{
                      fontFamily:    "'Syne', sans-serif",
                      fontWeight:    800,
                      fontSize:      18,
                      color:         exp.color,
                      marginBottom:  12,
                    }}
                  >
                    {exp.price}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    style={{
                      padding:       "10px 20px",
                      background:    hovered === exp.id ? exp.color : "transparent",
                      color:         hovered === exp.id ? "#fff" : exp.color,
                      border:        `1px solid ${exp.color}`,
                      fontFamily:    "'Inter', sans-serif",
                      fontWeight:    600,
                      fontSize:      11,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      cursor:        "pointer",
                      transition:    "background 0.25s, color 0.25s",
                      borderRadius:  2,
                    }}
                  >
                    Enquire →
                  </motion.button>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   4. ROUTE SVG PATH DRAW
   ========================================================================== */

function RoutePathSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [pathLength, setPathLength] = useState(0)

  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ["start end", "end start"],
  })

  const dashOffset = useTransform(
    scrollYProgress,
    [0.1, 0.65],
    [1, 0]
  )

  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength()
      setPathLength(len)
    }
  }, [])

  // Convert dashOffset (0–1) to actual pixel offset
  const strokeDashoffset = useTransform(dashOffset, (v) => v * pathLength)

  // Label opacity tied to scroll
  const labelOpacity = useTransform(scrollYProgress, [0.2, 0.45], [0, 1])

  const ROUTE_POINTS = [
    { x: 80,  y: 380, label: "Base Camp",    alt: "5,150m" },
    { x: 200, y: 310, label: "Camp I",       alt: "6,065m" },
    { x: 340, y: 250, label: "Camp II",      alt: "6,700m" },
    { x: 460, y: 195, label: "Camp III",     alt: "7,200m" },
    { x: 570, y: 150, label: "Camp IV",      alt: "7,900m" },
    { x: 640, y: 80,  label: "Summit",       alt: "8,849m" },
  ]

  const pathD =
    `M ${ROUTE_POINTS[0].x} ${ROUTE_POINTS[0].y} ` +
    ROUTE_POINTS.slice(1)
      .map((p, i) => {
        const prev = ROUTE_POINTS[i]
        const cpx = (prev.x + p.x) / 2
        const cpy = prev.y - 20
        return `Q ${cpx} ${cpy} ${p.x} ${p.y}`
      })
      .join(" ")

  return (
    <section id="equipe"
      ref={sectionRef}
      style={{
        background:   C.bgMid,
        padding:      "140px 24px",
        borderTop:    `1px solid ${C.borderFaint}`,
        borderBottom: `1px solid ${C.borderFaint}`,
        overflow:     "hidden",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="imx-mobstack"
          style={{
            display:   "grid",
            gridTemplateColumns: "1fr 1fr",
            gap:       80,
            alignItems: "center",
          }}
        >
          {/* Text */}
          <div>
            <Reveal>
              <SectionLabel>Route Visualization</SectionLabel>
              <h2
                style={{
                  fontFamily:    "'Syne', sans-serif",
                  fontWeight:    800,
                  fontSize:      "clamp(32px, 4.5vw, 52px)",
                  color:         C.text,
                  lineHeight:    1.1,
                  letterSpacing: "-0.02em",
                  marginBottom:  24,
                }}
              >
                From Base Camp<br />to Summit
              </h2>
              <p
                style={{
                  fontFamily:  "'Inter', sans-serif",
                  fontSize:    15,
                  color:       C.textMuted,
                  lineHeight:  1.75,
                  marginBottom: 40,
                  maxWidth:    420,
                }}
              >
                Every expedition follows a meticulously planned acclimatisation
                schedule. Our route team has made over 240 summit bids on these
                objectives across 16 years of operations.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {ROUTE_POINTS.map((pt) => (
                  <div
                    key={pt.label}
                    style={{
                      display:     "flex",
                      justifyContent: "space-between",
                      borderBottom: `1px solid ${C.borderFaint}`,
                      paddingBottom: 14,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize:   13,
                        color:      C.textMuted,
                      }}
                    >
                      {pt.label}
                    </span>
                    <span
                      style={{
                        fontFamily:  "'Syne', sans-serif",
                        fontWeight:  800,
                        fontSize:    14,
                        color:       C.accent,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {pt.alt}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* SVG Route */}
          <div
            style={{
              position:     "relative",
              background:   C.bg,
              border:       `1px solid ${C.borderFaint}`,
              borderRadius: 4,
              padding:      "32px 24px",
            }}
          >
            <svg
              viewBox="0 0 720 440"
              style={{ width: "100%", height: "auto", display: "block" }}
              fill="none"
            >
              {/* Mountain silhouette behind route */}
              <polygon
                points="40,430 200,180 360,280 500,100 640,220 720,150 720,430"
                fill={C.bgMid}
              />
              {/* Snow peaks */}
              <polygon points="492,106 508,100 524,106 517,122 499,122" fill={C.snow} opacity="0.25" />
              <polygon points="193,188 208,180 225,188 218,204 200,204" fill={C.snow} opacity="0.2" />

              {/* Route dashed track underneath */}
              <path
                d={pathD}
                stroke={C.borderFaint}
                strokeWidth="2"
                strokeDasharray="6 6"
                fill="none"
              />

              {/* Animating route path */}
              {pathLength > 0 && (
                <motion.path
                  ref={pathRef}
                  d={pathD}
                  stroke={C.accent}
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={pathLength}
                  style={{ strokeDashoffset }}
                />
              )}
              {/* Hidden path just to measure */}
              {pathLength === 0 && (
                <path
                  ref={pathRef}
                  d={pathD}
                  stroke="transparent"
                  strokeWidth="2"
                  fill="none"
                />
              )}

              {/* Camp dots */}
              {ROUTE_POINTS.map((pt, i) => (
                <motion.g key={pt.label} style={{ opacity: labelOpacity }}>
                  <circle cx={pt.x} cy={pt.y} r="5" fill={C.accent} />
                  <circle cx={pt.x} cy={pt.y} r="9" stroke={C.accent} strokeWidth="1" fill="none" opacity="0.35" />
                  {/* Label */}
                  <text
                    x={pt.x + (i < 3 ? 14 : -14)}
                    y={pt.y + 4}
                    textAnchor={i < 3 ? "start" : "end"}
                    fill={C.textMuted}
                    fontSize="10"
                    fontFamily="Inter, sans-serif"
                  >
                    {pt.label}
                  </text>
                  <text
                    x={pt.x + (i < 3 ? 14 : -14)}
                    y={pt.y + 17}
                    textAnchor={i < 3 ? "start" : "end"}
                    fill={C.accent}
                    fontSize="9"
                    fontFamily="Inter, sans-serif"
                    fontWeight="600"
                  >
                    {pt.alt}
                  </text>
                </motion.g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   5. GEAR HORIZONTAL SCROLL TRACK
   ========================================================================== */

function GearScrollSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target:  trackRef,
    offset:  ["start end", "end start"],
  })

  // Drive horizontal translation — how far depends on card count
  const x = useTransform(scrollYProgress, [0.05, 0.85], ["10%", "-55%"])

  return (
    <section
      style={{
        background: C.bg,
        padding:    "140px 0",
        overflow:   "hidden",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", marginBottom: 72 }}>
        <Reveal>
          <SectionLabel>Equipment</SectionLabel>
          <h2
            style={{
              fontFamily:    "'Syne', sans-serif",
              fontWeight:    800,
              fontSize:      "clamp(32px, 5vw, 56px)",
              color:         C.text,
              lineHeight:    1.1,
              letterSpacing: "-0.02em",
              maxWidth:      600,
            }}
          >
            Summit-Grade<br />Gear Included
          </h2>
        </Reveal>
      </div>

      {/* Sticky scroll track */}
      <div
        ref={trackRef}
        style={{
          height:     "300vh",
          position:   "relative",
        }}
      >
        <div
          style={{
            position:   "sticky",
            top:        0,
            height:     "100dvh",
            display:    "flex",
            alignItems: "center",
            overflow:   "hidden",
          }}
        >
          <motion.div
            style={{
              x,
              display: "flex",
              gap:     32,
              paddingLeft: 24,
              paddingRight: 100,
              willChange: "transform",
            }}
          >
            {GEAR_ITEMS.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
                style={{
                  flexShrink:   0,
                  width:        300,
                  background:   C.bgMid,
                  border:       `1px solid ${C.borderFaint}`,
                  borderRadius: 4,
                  padding:      "48px 40px",
                  cursor:       "pointer",
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width:          72,
                    height:         72,
                    borderRadius:   "50%",
                    background:     C.accentDim,
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    color:          C.accent,
                    marginBottom:   32,
                  }}
                >
                  {item.icon}
                </div>

                {/* Index */}
                <div
                  style={{
                    fontFamily:    "'Inter', sans-serif",
                    fontWeight:    600,
                    fontSize:      10,
                    letterSpacing: "0.4em",
                    textTransform: "uppercase",
                    color:         C.accent,
                    marginBottom:  12,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>

                <h3
                  style={{
                    fontFamily:    "'Syne', sans-serif",
                    fontWeight:    800,
                    fontSize:      20,
                    color:         C.text,
                    marginBottom:  8,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {item.name}
                </h3>

                <div
                  style={{
                    fontFamily:  "'Inter', sans-serif",
                    fontSize:    12,
                    color:       C.accent,
                    marginBottom: 16,
                    fontWeight:  500,
                  }}
                >
                  {item.model}
                </div>

                <div
                  style={{
                    width:        "100%",
                    height:       1,
                    background:   C.borderFaint,
                    marginBottom: 16,
                  }}
                />

                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize:   12,
                    color:      C.textMuted,
                    lineHeight: 1.6,
                  }}
                >
                  {item.spec}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   6. WEATHER CONDITION LIVE TICKER
   ========================================================================== */

function WeatherTicker() {
  const [index, setIndex] = useState(0)
  const [displayed, setDisplayed] = useState("")
  const [charIdx, setCharIdx] = useState(0)

  const current = WEATHER_CONDITIONS[index]
  const fullText = `${current.location} · ${current.temp} · Wind ${current.wind} · ${current.altitude}`

  // Cycle every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % WEATHER_CONDITIONS.length)
      setDisplayed("")
      setCharIdx(0)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  // Typewriter
  useEffect(() => {
    setDisplayed("")
    setCharIdx(0)
  }, [index])

  useEffect(() => {
    if (charIdx >= fullText.length) return
    const t = setTimeout(() => {
      setDisplayed(fullText.slice(0, charIdx + 1))
      setCharIdx((c) => c + 1)
    }, 28)
    return () => clearTimeout(t)
  }, [charIdx, fullText])

  const statusColor: Record<string, string> = {
    STORM:  "#ef4444",
    CLEAR:  "#6fcf97",
    WIND:   "#f59e0b",
    DANGER: "#ef4444",
    SUMMIT: C.accent,
  }

  return (
    <section
      style={{
        background:   C.bgLight,
        borderTop:    `1px solid ${C.borderFaint}`,
        borderBottom: `1px solid ${C.borderFaint}`,
        padding:      "140px 24px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <SectionLabel>Live Conditions Feed</SectionLabel>
          <h2
            style={{
              fontFamily:    "'Syne', sans-serif",
              fontWeight:    800,
              fontSize:      "clamp(28px, 4vw, 48px)",
              color:         C.text,
              marginBottom:  64,
              letterSpacing: "-0.02em",
            }}
          >
            Real-Time Summit Weather
          </h2>
        </Reveal>

        <div
          style={{
            background:   C.bg,
            border:       `1px solid ${C.borderFaint}`,
            borderRadius: 4,
            padding:      "48px 56px",
            position:     "relative",
            overflow:     "hidden",
          }}
        >
          {/* Status badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.status}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35 }}
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                gap:            8,
                padding:        "6px 16px",
                border:         `1px solid ${statusColor[current.status]}`,
                borderRadius:   2,
                marginBottom:   40,
              }}
            >
              <span
                style={{
                  width:        6,
                  height:       6,
                  borderRadius: "50%",
                  background:   statusColor[current.status],
                  display:      "block",
                  flexShrink:   0,
                }}
              />
              <span
                style={{
                  fontFamily:    "'Inter', sans-serif",
                  fontWeight:    600,
                  fontSize:      10,
                  letterSpacing: "0.5em",
                  textTransform: "uppercase",
                  color:         statusColor[current.status],
                }}
              >
                {current.status}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Typewriter line */}
          <div
            style={{
              fontFamily:    "'Syne', sans-serif",
              fontWeight:    800,
              fontSize:      "clamp(20px, 3.5vw, 38px)",
              color:         C.text,
              letterSpacing: "-0.02em",
              minHeight:     "1.3em",
              marginBottom:  48,
            }}
          >
            {displayed}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
              style={{ color: C.accent }}
            >
              |
            </motion.span>
          </div>

          {/* Metrics grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.4 }}
              style={{
                display:             "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(160px, 100%), 1fr))",
                gap:                 "1px",
                background:          C.borderFaint,
                border:              `1px solid ${C.borderFaint}`,
              }}
            >
              {[
                { label: "Temperature",  value: current.temp },
                { label: "Wind Speed",   value: current.wind },
                { label: "Altitude",     value: current.altitude },
                { label: "Status",       value: current.status },
              ].map((m) => (
                <div
                  key={m.label}
                  style={{
                    background: C.bgMid,
                    padding:    "24px 28px",
                  }}
                >
                  <div
                    style={{
                      fontFamily:    "'Inter', sans-serif",
                      fontSize:      10,
                      fontWeight:    600,
                      letterSpacing: "0.4em",
                      textTransform: "uppercase",
                      color:         C.textDim,
                      marginBottom:  8,
                    }}
                  >
                    {m.label}
                  </div>
                  <div
                    style={{
                      fontFamily:    "'Syne', sans-serif",
                      fontWeight:    800,
                      fontSize:      20,
                      color:         m.label === "Status" ? statusColor[current.status] : C.text,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {m.value}
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div style={{ display: "flex", gap: 8, marginTop: 36 }}>
            {WEATHER_CONDITIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setIndex(i); setDisplayed(""); setCharIdx(0) }}
                style={{
                  width:         i === index ? 28 : 8,
                  height:        8,
                  borderRadius:  4,
                  background:    i === index ? C.accent : C.borderFaint,
                  border:        "none",
                  cursor:        "pointer",
                  transition:    "width 0.3s, background 0.3s",
                  padding:       0,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   7. BOOKING ENQUIRY SECTION
   ========================================================================== */

function BookingEnquiry() {
  const [formData, setFormData] = useState({
    name:        "",
    email:       "",
    expedition:  "",
    experience:  "",
    message:     "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const inputStyle: React.CSSProperties = {
    width:          "100%",
    background:     C.bgLight,
    border:         `1px solid ${C.borderFaint}`,
    borderRadius:   2,
    padding:        "16px 20px",
    fontFamily:     "'Inter', sans-serif",
    fontSize:       14,
    color:          C.text,
    outline:        "none",
    boxSizing:      "border-box",
    transition:     "border-color 0.2s",
  }

  return (
    <section
      id="enquiry"
      style={{
        background: C.bgMid,
        padding:    "140px 24px",
        borderTop:  `1px solid ${C.borderFaint}`,
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <Reveal>
          <SectionLabel>Expedition Enquiry</SectionLabel>
          <h2
            style={{
              fontFamily:    "'Syne', sans-serif",
              fontWeight:    800,
              fontSize:      "clamp(32px, 5vw, 56px)",
              color:         C.text,
              lineHeight:    1.1,
              letterSpacing: "-0.02em",
              marginBottom:  20,
            }}
          >
            Begin Your<br />Application
          </h2>
          <p
            style={{
              fontFamily:  "'Inter', sans-serif",
              fontSize:    15,
              color:       C.textMuted,
              lineHeight:  1.7,
              marginBottom: 64,
              maxWidth:    520,
            }}
          >
            Each expedition is limited to 4–8 climbers. Our team will review your
            application and schedule a 30-minute briefing call within 48 hours.
          </p>
        </Reveal>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                background:   C.bg,
                border:       `1px solid ${C.accentDim}`,
                borderRadius: 4,
                padding:      "64px 56px",
                textAlign:    "center",
              }}
            >
              <div
                style={{
                  width:          64,
                  height:         64,
                  borderRadius:   "50%",
                  background:     C.accentDim,
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  margin:         "0 auto 32px",
                  fontSize:       28,
                }}
              >
                ↑
              </div>
              <h3
                style={{
                  fontFamily:    "'Syne', sans-serif",
                  fontWeight:    800,
                  fontSize:      28,
                  color:         C.text,
                  marginBottom:  12,
                }}
              >
                Application Received
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize:   14,
                  color:      C.textMuted,
                  lineHeight: 1.6,
                }}
              >
                Our expedition team will contact you within 48 hours to schedule
                your qualification briefing.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background:   C.bg,
                border:       `1px solid ${C.borderFaint}`,
                borderRadius: 4,
                padding:      "56px 48px",
                display:      "flex",
                flexDirection: "column",
                gap:          24,
              }}
            >
              {/* Row 1 */}
              <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label
                    style={{
                      fontFamily:    "'Inter', sans-serif",
                      fontSize:      11,
                      fontWeight:    600,
                      letterSpacing: "0.35em",
                      textTransform: "uppercase",
                      color:         C.textMuted,
                      display:       "block",
                      marginBottom:  8,
                    }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Your name"
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontFamily:    "'Inter', sans-serif",
                      fontSize:      11,
                      fontWeight:    600,
                      letterSpacing: "0.35em",
                      textTransform: "uppercase",
                      color:         C.textMuted,
                      display:       "block",
                      marginBottom:  8,
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    placeholder="you@example.com"
                    required
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="imx-mobstack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label
                    style={{
                      fontFamily:    "'Inter', sans-serif",
                      fontSize:      11,
                      fontWeight:    600,
                      letterSpacing: "0.35em",
                      textTransform: "uppercase",
                      color:         C.textMuted,
                      display:       "block",
                      marginBottom:  8,
                    }}
                  >
                    Expedition
                  </label>
                  <select
                    value={formData.expedition}
                    onChange={(e) => setFormData((p) => ({ ...p, expedition: e.target.value }))}
                    required
                    style={{
                      ...inputStyle,
                      cursor: "pointer",
                    }}
                  >
                    <option value="" disabled>Select objective</option>
                    {EXPEDITIONS.map((e) => (
                      <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      fontFamily:    "'Inter', sans-serif",
                      fontSize:      11,
                      fontWeight:    600,
                      letterSpacing: "0.35em",
                      textTransform: "uppercase",
                      color:         C.textMuted,
                      display:       "block",
                      marginBottom:  8,
                    }}
                  >
                    Experience Level
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData((p) => ({ ...p, experience: e.target.value }))}
                    required
                    style={{
                      ...inputStyle,
                      cursor: "pointer",
                    }}
                  >
                    <option value="" disabled>Your background</option>
                    <option value="beginner">Trekking / Beginner</option>
                    <option value="intermediate">Alpine / Intermediate</option>
                    <option value="advanced">Technical / Advanced</option>
                    <option value="expert">8000m Experience</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  style={{
                    fontFamily:    "'Inter', sans-serif",
                    fontSize:      11,
                    fontWeight:    600,
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    color:         C.textMuted,
                    display:       "block",
                    marginBottom:  8,
                  }}
                >
                  Tell us about your mountaineering background
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                  placeholder="Summit history, technical skills, preferred dates…"
                  rows={5}
                  style={{
                    ...inputStyle,
                    resize:    "vertical",
                    minHeight: 120,
                  }}
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding:       "18px 40px",
                  background:    C.accent,
                  color:         "#fff",
                  border:        "none",
                  borderRadius:  2,
                  fontFamily:    "'Inter', sans-serif",
                  fontWeight:    600,
                  fontSize:      13,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor:        "pointer",
                  alignSelf:     "flex-start",
                }}
              >
                Submit Application →
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

/* ==========================================================================
   NAVIGATION
   ========================================================================== */

function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const links = [
    { label: "Expeditions", href: "#expeditions" },
    { label: "Equipment",   href: "#gear" },
    { label: "Enquiry",     href: "#enquiry" },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position:    "fixed",
          top:         0,
          left:        0,
          right:       0,
          zIndex:      100,
          height:      72,
          display:     "flex",
          alignItems:  "center",
          justifyContent: "space-between",
          padding:     "0 48px",
          background:  scrolled ? "rgba(10,13,15,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.borderFaint}` : "none",
          transition:  "background 0.4s, border-color 0.4s",
        }}
      >
        {/* Logo */}
        <Link
          href="#hero"
          style={{
            fontFamily:    "'Syne', sans-serif",
            fontWeight:    800,
            fontSize:      22,
            color:         C.text,
            textDecoration: "none",
            letterSpacing: "-0.02em",
            display:       "flex",
            alignItems:    "center",
            gap:           10,
          }}
        >
          {fd?.logoBase64 ? (
            <img src={fd.logoBase64} alt={fd?.businessName ?? 'logo'} style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }} />
          ) : (
            <>
              <svg viewBox="0 0 32 32" style={{ width: 28, height: 28 }} fill="none">
                <polygon points="16,4 28,26 4,26" fill={C.accent} />
                <polygon points="16,10 24,26 8,26" fill={C.bg} />
              </svg>
              ATLAS<span style={{ color: C.accent }}>EXP</span>
            </>
          )}
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              style={{
                fontFamily:    "'Inter', sans-serif",
                fontWeight:    500,
                fontSize:      13,
                letterSpacing: "0.04em",
                color:         C.textMuted,
                textDecoration: "none",
                transition:    "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#enquiry"
            style={{
              padding:       "10px 24px",
              background:    C.accent,
              color:         "#fff",
              fontFamily:    "'Inter', sans-serif",
              fontWeight:    600,
              fontSize:      12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius:  2,
              transition:    "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Book Now
          </a>
        </div>
      </motion.nav>

      {/* Mobile overlay (simplified) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position:   "fixed",
              inset:      0,
              zIndex:     200,
              background: "rgba(10,13,15,0.97)",
              display:    "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap:        40,
            }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                position:  "absolute",
                top:       24,
                right:     24,
                background: "none",
                border:    "none",
                color:     C.text,
                fontSize:  28,
                cursor:    "pointer",
              }}
            >
              ×
            </button>
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontFamily:    "'Syne', sans-serif",
                  fontWeight:    800,
                  fontSize:      36,
                  color:         C.text,
                  textDecoration: "none",
                }}
              >
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ==========================================================================
   FOOTER
   ========================================================================== */

function Footer() {
  const year = new Date().getFullYear()
  const cols = [
    { title: "Objectives", links: ["K2 North Face", "Vinson Massif", "Aconcagua", "Custom Routes"] },
    { title: "Services",   links: ["Logistics", "Permitting", "Gear Rental", "Training"] },
    { title: "Company",    links: ["About", "Safety Record", "Team", "Contact"] },
  ]

  return (
    <footer id="contact"
      style={{
        background:  "#060809",
        padding:     "100px 48px 48px",
        borderTop:   `1px solid ${C.borderFaint}`,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap:                 64,
            marginBottom:        80,
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily:    "'Syne', sans-serif",
                fontWeight:    800,
                fontSize:      24,
                color:         C.text,
                marginBottom:  20,
                letterSpacing: "-0.02em",
                display:       "flex",
                alignItems:    "center",
                gap:           10,
              }}
            >
              <svg viewBox="0 0 32 32" style={{ width: 26, height: 26 }} fill="none">
                <polygon points="16,4 28,26 4,26" fill={C.accent} />
                <polygon points="16,10 24,26 8,26" fill="#060809" />
              </svg>
              ATLAS<span style={{ color: C.accent }}>EXP</span>
            </div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize:   13,
                color:      C.textMuted,
                lineHeight: 1.7,
                maxWidth:   300,
                marginBottom: 32,
              }}
            >
              The world's leading expedition logistics provider for extreme
              high-altitude mountaineering since 2009. 240+ successful summits.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {["IG", "FB", "YT"].map((s) => (
                <a
                  key={s}
                  href="#stats"
                  style={{
                    width:          36,
                    height:         36,
                    border:         `1px solid ${C.borderFaint}`,
                    borderRadius:   2,
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    fontFamily:     "'Inter', sans-serif",
                    fontSize:       10,
                    fontWeight:     600,
                    color:          C.textMuted,
                    textDecoration: "none",
                    transition:     "border-color 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.borderFaint; e.currentTarget.style.color = C.textMuted }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <h4
                style={{
                  fontFamily:    "'Inter', sans-serif",
                  fontWeight:    600,
                  fontSize:      10,
                  letterSpacing: "0.45em",
                  textTransform: "uppercase",
                  color:         C.accent,
                  marginBottom:  24,
                }}
              >
                {col.title}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#stats"
                      style={{
                        fontFamily:    "'Inter', sans-serif",
                        fontSize:      13,
                        color:         C.textMuted,
                        textDecoration: "none",
                        transition:    "color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop:      `1px solid ${C.borderFaint}`,
            paddingTop:     32,
            display:        "flex",
            justifyContent: "space-between",
            alignItems:     "center",
            flexWrap:       "wrap",
            gap:            16,
          }}
        >
          <span
            style={{
              fontFamily:    "'Inter', sans-serif",
              fontSize:      12,
              color:         C.textDim,
              letterSpacing: "0.03em",
            }}
          >
            © {year} Atlas Expedition Logistics AG. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy", "Terms", "Safety"].map((l) => (
              <a
                key={l}
                href="#stats"
                style={{
                  fontFamily:    "'Inter', sans-serif",
                  fontSize:      12,
                  color:         C.textDim,
                  textDecoration: "none",
                  transition:    "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.textMuted)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.textDim)}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ==========================================================================
   ROOT PAGE COMPONENT
   ========================================================================== */


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function ExpeditionTemplatePage() {
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
  if (brand) {
    C = { ...C, accent: brand };
  }

  
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
    <>
      <style>{`
        /* mobile: stack 2-col grids to single column (added by responsive fix) */
        @media (max-width: 768px) {
          .imx-mobstack { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <style dangerouslySetInnerHTML={{ __html: FONT_STYLE + `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${C.bg}; color: ${C.text}; -webkit-font-smoothing: antialiased; }
        ::selection { background: ${C.accentDim}; color: ${C.text}; }
        input, select, textarea, button { font-family: inherit; }
        select option { background: ${C.bgLight}; color: ${C.text}; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.borderFaint}; border-radius: 3px; }

        @media (max-width: 768px) {
          nav > div:last-child { display: none !important; }
        }
        @media (max-width: 900px) {
          .route-grid { grid-template-columns: 1fr !important; }
          .exp-row { grid-template-columns: auto 1fr !important; }
        }
      `}} />

      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          background: C.bg,
          color:      C.text,
          minHeight:  "100dvh",
          overflowX:  "hidden",
        }}
      >
        <Navigation />

        <main>
          {/* 1. Parallax Mountain Hero */}
          <ParallaxMountainHero />

          {/* 2. Altitude Counters */}
          <AltitudeStatsSection />

          {/* 3. Expeditions Grid */}
          <ExpeditionsSection />

          {/* 4. Route SVG Path Draw */}
          <RoutePathSection />

          {/* 5. Gear Horizontal Scroll */}
          <GearScrollSection />

          {/* 6. Weather Ticker */}
          <WeatherTicker />

          {/* 7. Booking Enquiry */}
          <BookingEnquiry />
        </main>

        <Footer />
      </div>
    </>
  )
}
