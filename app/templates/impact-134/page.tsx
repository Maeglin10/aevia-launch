"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import React, { useState, useRef, useEffect } from "react"

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#050708",
  bgCard: "#0C1014",
  bgMid: "#141C20",
  sky: "#3AA8C8",
  orange: "#E07B3F",
  snow: "#E8F4F8",
  muted: "#7A8E9A",
  border: "rgba(58,168,200,0.15)",
  borderOrange: "rgba(224,123,63,0.25)",
  skyDim: "rgba(58,168,200,0.08)",
  skyFill: "rgba(58,168,200,0.15)",
  snowDim: "rgba(232,244,248,0.07)",
  fontBody: "'Archivo', sans-serif",
  fontMono: "'Space Grotesk', sans-serif",
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const EXPEDITIONS = [
  {
    id: 1,
    title: "Everest Base Camp Trek",
    type: "High Altitude",
    difficulty: "Expert",
    duration: "14 days",
    price: "$3,490",
    altitude: "5,364m",
    continent: "Asia",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800",
    desc: "The world's most iconic trek. Cross suspension bridges, traverse glacial moraines, and stand at the foot of the greatest mountain on Earth.",
    includes: ["Expert Sherpa guides", "Altitude acclimatization plan", "Teahouse accommodation", "All meals on trail"],
  },
  {
    id: 2,
    title: "Hawaiian Wave Mastery",
    type: "Ocean Surf",
    difficulty: "Intermediate",
    duration: "7 days",
    price: "$2,190",
    altitude: "Sea level",
    continent: "Pacific",
    img: "https://images.unsplash.com/photo-1470171485859-f5a85bcc69e3?q=80&w=800",
    desc: "Ride the legendary swells of the North Shore. Morning sessions, afternoon coaching, and evenings under a Hawaiian sky.",
    includes: ["Daily surf coaching", "Board & wetsuit rental", "Oceanfront villa", "Video analysis sessions"],
  },
  {
    id: 3,
    title: "Chamonix Ski Expedition",
    type: "Alpine Ski",
    difficulty: "Advanced",
    duration: "10 days",
    price: "$4,100",
    altitude: "3,842m",
    continent: "Europe",
    img: "https://images.unsplash.com/photo-1551632786-91b9ed0b88b1?q=80&w=800",
    desc: "Descend the legendary Vallée Blanche. Heli-drops, off-piste powder fields, and the highest cable car in the Alps.",
    includes: ["IFMGA-certified mountain guide", "Ski equipment package", "Chalet accommodation", "Avalanche safety course"],
  },
  {
    id: 4,
    title: "Great Barrier Reef Dive",
    type: "Open Water",
    difficulty: "Beginner-Friendly",
    duration: "5 days",
    price: "$1,890",
    altitude: "−15m",
    continent: "Oceania",
    img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800",
    desc: "Explore the world's largest living structure. Dive vibrant coral gardens, encounter sea turtles, and witness marine biodiversity at scale.",
    includes: ["PADI-certified dive master", "3 dives daily", "Liveaboard vessel", "Marine biologist briefings"],
  },
  {
    id: 5,
    title: "Serengeti Safari Adventure",
    type: "Wildlife Safari",
    difficulty: "Accessible",
    duration: "8 days",
    price: "$5,200",
    altitude: "1,500m",
    continent: "Africa",
    img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800",
    desc: "Witness the Great Migration — two million wildebeest moving across the plains. Sundowners on the Serengeti. This is raw Africa.",
    includes: ["Expert Masai guide", "Private 4×4 game drive", "Luxury tented camp", "Bush breakfast & dinner"],
  },
]

const MARQUEE_ITEMS = [
  "Everest Base Camp", "North Shore Hawaii", "Chamonix Mont-Blanc", "Great Barrier Reef",
  "Serengeti Plains", "Patagonia", "Dolomites", "Maldives Atolls", "Atacama Desert",
  "Norwegian Fjords", "Kilimanjaro", "Raja Ampat",
]

const TESTIMONIALS = [
  {
    quote: "Standing at Everest Base Camp, I cried. Not from exhaustion — from the realization that I had actually done it. Summit Wilds made it possible.",
    name: "Marcus D.",
    trip: "Everest Base Camp Trek",
    location: "Munich, Germany",
  },
  {
    quote: "I had never surfed in my life. Seven days later I was catching head-high sets on the North Shore. The coaching is just exceptional.",
    name: "Camille R.",
    trip: "Hawaiian Wave Mastery",
    location: "Lyon, France",
  },
  {
    quote: "The Serengeti at dawn, a cheetah sprinting fifty meters from the jeep. Nothing prepares you for that. Summit Wilds' guides are in a class of their own.",
    name: "James O.",
    trip: "Serengeti Safari",
    location: "Cape Town, South Africa",
  },
]

const DEPARTURES = [
  { expedition: "Everest Base Camp Trek", date: "Sep 15, 2026", spots: 3, difficulty: "Expert" },
  { expedition: "Chamonix Ski Expedition", date: "Jan 08, 2027", spots: 5, difficulty: "Advanced" },
  { expedition: "Hawaiian Wave Mastery", date: "Oct 03, 2026", spots: 6, difficulty: "Intermediate" },
  { expedition: "Serengeti Safari Adventure", date: "Aug 22, 2026", spots: 2, difficulty: "Accessible" },
  { expedition: "Great Barrier Reef Dive", date: "Nov 12, 2026", spots: 4, difficulty: "Beginner" },
]

// ─── Utility: TextReveal ──────────────────────────────────────────────────────
function TextReveal({ text, delay = 0, style = {} }: { text: string; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const words = text.split(" ")
  return (
    <span ref={ref} style={{ display: "inline-block", ...style }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 32, rotateX: -20 }}
          animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 0.55, delay: delay + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "inline-block", marginRight: "0.28em", transformOrigin: "bottom" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

// ─── Utility: MagneticButton ──────────────────────────────────────────────────
function MagneticButton({
  children,
  onClick,
  style = {},
}: {
  children: React.ReactNode
  onClick?: () => void
  style?: React.CSSProperties
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 600, damping: 28 })
  const sy = useSpring(y, { stiffness: 600, damping: 28 })
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.38)
    y.set((e.clientY - r.top - r.height / 2) * 0.38)
  }
  const onLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy, display: "inline-block", cursor: "pointer", ...style }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.div>
  )
}

// ─── Utility: FadeIn ──────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, y = 24 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ─── Section 1: Nav ───────────────────────────────────────────────────────────
function Nav({ onBook }: { onBook: () => void }) {
  const { scrollY } = useScroll()
  const bg = useTransform(scrollY, [0, 80], ["rgba(5,7,8,0)", "rgba(5,7,8,0.97)"])
  const borderOp = useTransform(scrollY, [0, 80], [0, 1])
  const [open, setOpen] = useState(false)

  return (
    <motion.nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: bg,
        borderBottom: `1px solid rgba(58,168,200,${borderOp})`,
        padding: "0 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 68,
        fontFamily: C.fontBody,
        backdropFilter: "blur(12px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: C.sky, boxShadow: `0 0 10px ${C.sky}`,
        }} />
        <span style={{ color: C.snow, fontWeight: 700, fontSize: 17, letterSpacing: "0.04em" }}>
          SUMMIT WILDS
        </span>
      </div>
      <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
        {["Expeditions", "Philosophy", "Why Us", "Contact"].map((item) => (
          <motion.a
            key={item}
            onClick={() => document.getElementById(item.toLowerCase().replace(" ", "-"))?.scrollIntoView({behavior:"smooth"})}
            whileHover={{ color: C.sky }}
            style={{ color: C.muted, fontSize: 13, fontWeight: 500, letterSpacing: "0.08em", textDecoration: "none", transition: "color 0.2s" }}
          >
            {item.toUpperCase()}
          </motion.a>
        ))}
        <MagneticButton onClick={onBook}>
          <div style={{
            padding: "9px 22px",
            background: C.orange,
            color: "#fff",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.06em",
          }}>
            BOOK NOW
          </div>
        </MagneticButton>
      </div>
    </motion.nav>
  )
}

// ─── Section 2: Hero ──────────────────────────────────────────────────────────
function Hero({ onBook }: { onBook: () => void }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section ref={ref} style={{
      position: "relative",
      height: "100vh",
      minHeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      background: C.bg,
      fontFamily: C.fontBody,
    }}>
      {/* Parallax background image */}
      <motion.div style={{ position: "absolute", inset: 0, y }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url(https://images.unsplash.com/photo-1464207687429-7505649dae38?q=80&w=1600)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.35,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(to bottom, rgba(5,7,8,0.4) 0%, rgba(5,7,8,0.7) 60%, ${C.bg} 100%)`,
        }} />
      </motion.div>

      {/* Floating particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            borderRadius: "50%",
            background: i % 2 === 0 ? C.sky : C.orange,
            left: `${10 + i * 9}%`,
            top: `${20 + (i % 4) * 20}%`,
            opacity: 0.5,
          }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
        />
      ))}

      <motion.div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px", opacity }}>
        {/* Floating badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 18px",
            border: `1px solid ${C.border}`,
            borderRadius: 100,
            background: "rgba(58,168,200,0.08)",
            backdropFilter: "blur(8px)",
            marginBottom: 32,
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.sky, boxShadow: `0 0 8px ${C.sky}` }} />
          <span style={{ color: C.sky, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", fontFamily: C.fontMono }}>
            5 CONTINENTS · 12 EXPEDITIONS · 180+ CLIENTS
          </span>
        </motion.div>

        <h1 style={{
          color: C.snow,
          fontSize: "clamp(52px, 9vw, 104px)",
          fontWeight: 900,
          lineHeight: 0.95,
          letterSpacing: "-0.02em",
          marginBottom: 28,
          fontFamily: C.fontBody,
        }}>
          <TextReveal text="Your next" delay={0.3} />
          <br />
          <span style={{ color: C.sky, display: "block" }}>
            <TextReveal text="expedition" delay={0.5} />
          </span>
          <TextReveal text="awaits." delay={0.7} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          style={{ color: C.muted, fontSize: 18, maxWidth: 520, margin: "0 auto 44px", lineHeight: 1.65, fontFamily: C.fontMono }}
        >
          Expert-guided adventures to the most extraordinary places on Earth.
          Small groups. Zero compromises.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center" }}
        >
          <MagneticButton onClick={onBook}>
            <div style={{
              padding: "15px 38px",
              background: C.orange,
              color: "#fff",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.08em",
              boxShadow: `0 0 32px rgba(224,123,63,0.35)`,
            }}>
              VIEW EXPEDITIONS
            </div>
          </MagneticButton>
          <MagneticButton>
            <div style={{
              padding: "15px 38px",
              border: `1px solid ${C.border}`,
              color: C.snow,
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "0.08em",
              background: "rgba(255,255,255,0.03)",
            }}>
              OUR PHILOSOPHY
            </div>
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        style={{
          position: "absolute",
          bottom: 36,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
      >
        <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, transparent, ${C.sky})` }} />
        <span style={{ color: C.muted, fontSize: 10, letterSpacing: "0.15em", fontFamily: C.fontMono }}>SCROLL</span>
      </motion.div>
    </section>
  )
}

// ─── Section 3: MarqueeStrip ──────────────────────────────────────────────────
function MarqueeStrip() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div style={{
      background: C.bgMid,
      borderTop: `1px solid ${C.border}`,
      borderBottom: `1px solid ${C.border}`,
      padding: "16px 0",
      overflow: "hidden",
      position: "relative",
      fontFamily: C.fontMono,
    }}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", gap: 0, whiteSpace: "nowrap" }}
      >
        {doubled.map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 0 }}>
            <span style={{ color: C.muted, fontSize: 12, fontWeight: 500, letterSpacing: "0.12em", padding: "0 28px" }}>
              {item.toUpperCase()}
            </span>
            <span style={{ color: C.sky, fontSize: 10, opacity: 0.6 }}>✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ─── Section 4 SIGNATURE: AltitudeChart ──────────────────────────────────────
function AltitudeChart() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  // SVG path for Everest-style elevation profile
  const mainPath = "M0,180 L40,168 L80,155 L110,138 L140,115 L165,90 L185,62 L200,38 L220,22 L240,30 L258,52 L275,80 L295,108 L320,128 L355,142 L395,152 L440,158 L500,162"
  const areaPath = `${mainPath} L500,200 L0,200 Z`

  // Key points for labels
  const labelPoints = [
    { x: 220, y: 22, label: "8,849m", sub: "Summit", align: "center" as const },
    { x: 165, y: 90, label: "6,500m", sub: "Camp III", align: "center" as const },
    { x: 110, y: 138, label: "5,364m", sub: "Base Camp", align: "center" as const },
    { x: 395, y: 152, label: "4,200m", sub: "Descent", align: "center" as const },
  ]

  // Dot animation: moves along path after drawing completes
  const dotProgress = useMotionValue(0)
  const dotSpring = useSpring(dotProgress, { stiffness: 30, damping: 20 })

  useEffect(() => {
    if (!inView) return
    const timer = setTimeout(() => {
      dotProgress.set(1)
    }, 2200)
    return () => clearTimeout(timer)
  }, [inView, dotProgress])

  // We'll animate dot via offsetDistance on a motion path
  const dotOffset = useTransform(dotSpring, [0, 1], ["0%", "100%"])

  return (
    <section id="philosophy" style={{
      background: C.bg,
      borderTop: `1px solid ${C.border}`,
      borderBottom: `1px solid ${C.border}`,
      padding: "100px 40px",
      fontFamily: C.fontBody,
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", gap: 80, alignItems: "flex-start", marginBottom: 64, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 320px" }}>
            <FadeIn>
              <div style={{ color: C.sky, fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", fontFamily: C.fontMono, marginBottom: 16 }}>
                ELEVATION PROFILE
              </div>
              <h2 style={{ color: C.snow, fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 20 }}>
                The altitude<br />
                <span style={{ color: C.sky }}>shapes the soul.</span>
              </h2>
              <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.75, maxWidth: 360, fontFamily: C.fontMono }}>
                Every summit tells a story of perseverance. We map each expedition
                from approach to peak — so you know exactly what awaits.
              </p>
            </FadeIn>
          </div>
          <div style={{ flex: "1 1 220px", display: "flex", gap: 40 }}>
            {[
              { value: "5", label: "Continents" },
              { value: "12", label: "Expeditions" },
              { value: "180+", label: "Clients" },
            ].map((stat) => (
              <FadeIn key={stat.label} delay={0.15}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: C.snow, fontSize: 40, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div style={{ color: C.muted, fontSize: 12, fontFamily: C.fontMono, marginTop: 6, letterSpacing: "0.08em" }}>
                    {stat.label.toUpperCase()}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* SVG Chart */}
        <FadeIn delay={0.2}>
          <div ref={ref} style={{
            position: "relative",
            background: C.bgCard,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            padding: "40px 40px 32px",
            overflow: "hidden",
          }}>
            {/* Background grid lines */}
            <svg
              viewBox="0 0 500 200"
              style={{ position: "absolute", inset: "40px 40px 32px", width: "calc(100% - 80px)", height: "calc(100% - 72px)", pointerEvents: "none" }}
              preserveAspectRatio="none"
            >
              {[0.2, 0.4, 0.6, 0.8].map((t, i) => (
                <line
                  key={i}
                  x1="0" y1={200 * t}
                  x2="500" y2={200 * t}
                  stroke={C.border}
                  strokeWidth="0.5"
                  strokeDasharray="4 6"
                />
              ))}
            </svg>

            {/* Main chart SVG */}
            <svg
              viewBox="0 0 500 200"
              style={{ width: "100%", height: "auto", maxHeight: 260, display: "block" }}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.sky} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={C.sky} stopOpacity="0.0" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Area fill — fades in after path draws */}
              <motion.path
                d={areaPath}
                fill="url(#skyGrad)"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1.2, delay: 1.6 }}
              />

              {/* Animated stroke path */}
              <motion.path
                d={mainPath}
                fill="none"
                stroke={C.sky}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 1 }}
                animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 1 }}
                transition={{ duration: 2.0, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
                style={{ pathLength: undefined }}
              />

              {/* Altitude label vertical lines */}
              {labelPoints.map((pt, i) => (
                <motion.g
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 2.2 + i * 0.1, duration: 0.4 }}
                >
                  <line
                    x1={pt.x} y1={pt.y}
                    x2={pt.x} y2={pt.y - 22}
                    stroke={C.orange}
                    strokeWidth="0.8"
                    strokeDasharray="3 3"
                  />
                  <circle cx={pt.x} cy={pt.y} r="3" fill={C.orange} />
                  <text
                    x={pt.x}
                    y={pt.y - 30}
                    textAnchor="middle"
                    fill={C.snow}
                    fontSize="8"
                    fontFamily={C.fontMono}
                    fontWeight="600"
                  >
                    {pt.label}
                  </text>
                  <text
                    x={pt.x}
                    y={pt.y - 20}
                    textAnchor="middle"
                    fill={C.muted}
                    fontSize="6.5"
                    fontFamily={C.fontMono}
                  >
                    {pt.sub}
                  </text>
                </motion.g>
              ))}

              {/* Animated climber dot — travels along path after drawing */}
              <motion.circle
                r="5"
                fill={C.sky}
                stroke={C.snow}
                strokeWidth="1.5"
                filter="url(#glow)"
                style={{
                  offsetPath: `path("${mainPath}")`,
                  offsetDistance: dotOffset,
                } as React.CSSProperties}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 2.1, duration: 0.3 }}
              />
            </svg>

            {/* X-axis labels */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 12,
              padding: "0 2px",
            }}>
              {["Lukla", "Namche Bazaar", "Base Camp", "Khumbu Icefall", "Summit", "Return", "Kathmandu"].map((label) => (
                <span key={label} style={{
                  color: C.muted,
                  fontSize: 9,
                  fontFamily: C.fontMono,
                  letterSpacing: "0.06em",
                }}>
                  {label}
                </span>
              ))}
            </div>

            {/* Legend */}
            <div style={{
              position: "absolute",
              top: 16,
              right: 24,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 20, height: 2, background: C.sky, borderRadius: 2 }} />
                <span style={{ color: C.muted, fontSize: 10, fontFamily: C.fontMono }}>Elevation profile</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.orange }} />
                <span style={{ color: C.muted, fontSize: 10, fontFamily: C.fontMono }}>Key waypoints</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.sky, border: `1px solid ${C.snow}` }} />
                <span style={{ color: C.muted, fontSize: 10, fontFamily: C.fontMono }}>Your position</span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── Section 5: Expeditions ───────────────────────────────────────────────────
function Expeditions({ onBook }: { onBook: (exp: (typeof EXPEDITIONS)[0]) => void }) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section id="expeditions" style={{
      background: C.bgMid,
      padding: "100px 40px",
      fontFamily: C.fontBody,
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ color: C.sky, fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", fontFamily: C.fontMono, marginBottom: 12 }}>
            OUR EXPEDITIONS
          </div>
          <h2 style={{ color: C.snow, fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 56 }}>
            Five worlds.<br />One outfitter.
          </h2>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {EXPEDITIONS.map((exp, i) => (
            <FadeIn key={exp.id} delay={i * 0.09}>
              <motion.div
                onHoverStart={() => setHovered(exp.id)}
                onHoverEnd={() => setHovered(null)}
                style={{
                  position: "relative",
                  background: C.bgCard,
                  border: `1px solid ${hovered === exp.id ? C.sky : C.border}`,
                  borderRadius: 12,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "border-color 0.3s",
                }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
              >
                {/* Image */}
                <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                  <motion.div
                    animate={{ scale: hovered === exp.id ? 1.06 : 1 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      position: "absolute", inset: 0,
                      backgroundImage: `url(${exp.img})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to bottom, transparent 40%, rgba(12,16,20,0.9) 100%)",
                  }} />
                  {/* Difficulty badge */}
                  <div style={{
                    position: "absolute", top: 14, left: 14,
                    padding: "4px 12px",
                    background: "rgba(12,16,20,0.75)",
                    backdropFilter: "blur(8px)",
                    border: `1px solid ${C.border}`,
                    borderRadius: 100,
                    color: C.sky,
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    fontFamily: C.fontMono,
                  }}>
                    {exp.difficulty.toUpperCase()}
                  </div>
                  {/* Altitude badge */}
                  <div style={{
                    position: "absolute", top: 14, right: 14,
                    padding: "4px 10px",
                    background: "rgba(224,123,63,0.15)",
                    border: `1px solid ${C.borderOrange}`,
                    borderRadius: 100,
                    color: C.orange,
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    fontFamily: C.fontMono,
                  }}>
                    {exp.altitude}
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: "20px 22px 22px" }}>
                  <div style={{ color: C.muted, fontSize: 10, fontFamily: C.fontMono, letterSpacing: "0.1em", marginBottom: 8 }}>
                    {exp.type.toUpperCase()} · {exp.continent.toUpperCase()}
                  </div>
                  <h3 style={{ color: C.snow, fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", marginBottom: 10 }}>
                    {exp.title}
                  </h3>
                  <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.65, fontFamily: C.fontMono, marginBottom: 18 }}>
                    {exp.desc}
                  </p>

                  {/* AnimatePresence hover reveal */}
                  <AnimatePresence>
                    {hovered === exp.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: "hidden", marginBottom: 16 }}
                      >
                        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                          {exp.includes.map((item) => (
                            <div key={item} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.sky, flexShrink: 0 }} />
                              <span style={{ color: C.muted, fontSize: 12, fontFamily: C.fontMono }}>{item}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ color: C.snow, fontSize: 22, fontWeight: 800 }}>{exp.price}</div>
                      <div style={{ color: C.muted, fontSize: 10, fontFamily: C.fontMono }}>{exp.duration} / per person</div>
                    </div>
                    <motion.div
                      onClick={() => onBook(exp)}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        padding: "9px 20px",
                        background: hovered === exp.id ? C.orange : "transparent",
                        border: `1px solid ${hovered === exp.id ? C.orange : C.border}`,
                        borderRadius: 6,
                        color: hovered === exp.id ? "#fff" : C.muted,
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        cursor: "pointer",
                        transition: "all 0.25s",
                        fontFamily: C.fontMono,
                      }}
                    >
                      RESERVE
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section 6: Why Us ────────────────────────────────────────────────────────
function WhyUs() {
  const pillars = [
    {
      icon: "⛰",
      title: "Expert Guides",
      desc: "Every guide holds IFMGA, PADI, or equivalent certification. They've summited, surfed, and survived — and they'll get you there safely.",
    },
    {
      icon: "◉",
      title: "Small Groups",
      desc: "Maximum 12 people per expedition. You're not a number. You're a climber, a surfer, a safari traveler. We know your name on day one.",
    },
    {
      icon: "♺",
      title: "Leave No Trace",
      desc: "Certified carbon-offset programs, porter welfare standards, and reef-safe protocols. We protect the places we love.",
    },
  ]

  return (
    <section id="why-us" style={{
      background: C.bg,
      padding: "100px 40px",
      fontFamily: C.fontBody,
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ color: C.sky, fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", fontFamily: C.fontMono, marginBottom: 12 }}>
            WHY SUMMIT WILDS
          </div>
          <h2 style={{ color: C.snow, fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 64 }}>
            Three pillars.<br />
            <span style={{ color: C.muted, fontWeight: 300 }}>No shortcuts.</span>
          </h2>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {pillars.map((pillar, i) => (
            <FadeIn key={pillar.title} delay={i * 0.12}>
              <motion.div
                whileHover={{ borderColor: C.sky, y: -4 }}
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  borderRadius: 14,
                  padding: "40px 36px",
                  transition: "border-color 0.3s",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 20 }}>{pillar.icon}</div>
                <h3 style={{ color: C.snow, fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em", marginBottom: 14 }}>
                  {pillar.title}
                </h3>
                <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.75, fontFamily: C.fontMono }}>
                  {pillar.desc}
                </p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section 7: Booking Process ───────────────────────────────────────────────
function BookingProcess({ onBook }: { onBook: () => void }) {
  const steps = [
    {
      num: "01",
      title: "Choose Your Expedition",
      desc: "Browse our 12 expeditions across 5 continents. Filter by difficulty, duration, and season to find your perfect match.",
    },
    {
      num: "02",
      title: "Reserve Your Spot",
      desc: "Secure your place with a 30% deposit. Your reservation is confirmed instantly. Remaining balance due 90 days before departure.",
    },
    {
      num: "03",
      title: "Prepare & Depart",
      desc: "Receive your custom preparation plan, gear checklist, and pre-expedition briefing call. Then show up ready — we handle the rest.",
    },
  ]

  return (
    <section style={{
      background: C.bgMid,
      padding: "100px 40px",
      fontFamily: C.fontBody,
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ color: C.sky, fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", fontFamily: C.fontMono, marginBottom: 12 }}>
            HOW IT WORKS
          </div>
          <h2 style={{ color: C.snow, fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 64 }}>
            Three steps to<br />your expedition.
          </h2>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 2 }}>
          {steps.map((step, i) => (
            <FadeIn key={step.num} delay={i * 0.12}>
              <div style={{
                padding: "40px 36px",
                borderTop: `2px solid ${i === 0 ? C.sky : C.border}`,
                position: "relative",
              }}>
                <div style={{
                  color: C.border,
                  fontSize: 64,
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  marginBottom: 24,
                  fontFamily: C.fontBody,
                }}>
                  {step.num}
                </div>
                <h3 style={{ color: C.snow, fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", marginBottom: 14 }}>
                  {step.title}
                </h3>
                <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.75, fontFamily: C.fontMono }}>
                  {step.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <div style={{ textAlign: "center", marginTop: 56 }}>
            <MagneticButton onClick={onBook}>
              <div style={{
                display: "inline-block",
                padding: "16px 48px",
                background: C.orange,
                color: "#fff",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.08em",
                boxShadow: `0 0 40px rgba(224,123,63,0.3)`,
              }}>
                START YOUR JOURNEY
              </div>
            </MagneticButton>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── Section 8: Testimonials ──────────────────────────────────────────────────
function Testimonials() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % TESTIMONIALS.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <section style={{
      background: C.bg,
      padding: "100px 40px",
      fontFamily: C.fontBody,
    }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ color: C.sky, fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", fontFamily: C.fontMono, marginBottom: 12, textAlign: "center" }}>
            CLIENT STORIES
          </div>
          <h2 style={{ color: C.snow, fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 56, textAlign: "center" }}>
            They went. They came back changed.
          </h2>
        </FadeIn>

        <div style={{ position: "relative", minHeight: 260 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: "48px 52px",
                textAlign: "center",
              }}
            >
              <div style={{ color: C.sky, fontSize: 48, lineHeight: 1, marginBottom: 24, opacity: 0.4 }}>"</div>
              <p style={{
                color: C.snow,
                fontSize: 20,
                lineHeight: 1.65,
                fontStyle: "italic",
                fontWeight: 300,
                marginBottom: 36,
                maxWidth: 640,
                margin: "0 auto 36px",
              }}>
                {TESTIMONIALS[active].quote}
              </p>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24 }}>
                <div style={{ color: C.snow, fontWeight: 700, fontSize: 15 }}>{TESTIMONIALS[active].name}</div>
                <div style={{ color: C.sky, fontSize: 12, fontFamily: C.fontMono, marginTop: 4 }}>
                  {TESTIMONIALS[active].trip} · {TESTIMONIALS[active].location}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot navigation */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 28 }}>
          {TESTIMONIALS.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setActive(i)}
              animate={{ width: i === active ? 24 : 8, background: i === active ? C.sky : C.muted }}
              transition={{ duration: 0.3 }}
              style={{
                height: 8,
                borderRadius: 100,
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section 9: Upcoming Departures ──────────────────────────────────────────
function Departures({ onBook }: { onBook: () => void }) {
  const difficultyColor: Record<string, string> = {
    Expert: C.orange,
    Advanced: "#C8773A",
    Intermediate: C.sky,
    Accessible: "#5ABF8C",
    Beginner: "#5ABF8C",
  }

  return (
    <section style={{
      background: C.bgMid,
      padding: "100px 40px",
      fontFamily: C.fontBody,
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 56, flexWrap: "wrap", gap: 24 }}>
            <div>
              <div style={{ color: C.sky, fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", fontFamily: C.fontMono, marginBottom: 12 }}>
                UPCOMING DEPARTURES
              </div>
              <h2 style={{ color: C.snow, fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                Next windows closing fast.
              </h2>
            </div>
            <MagneticButton onClick={onBook}>
              <div style={{
                padding: "12px 28px",
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                color: C.snow,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.08em",
                fontFamily: C.fontMono,
              }}>
                VIEW ALL DATES
              </div>
            </MagneticButton>
          </div>
        </FadeIn>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {DEPARTURES.map((dep, i) => (
            <FadeIn key={dep.expedition} delay={i * 0.07}>
              <motion.div
                whileHover={{ backgroundColor: "rgba(58,168,200,0.04)", x: 4 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "22px 28px",
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  background: C.bgCard,
                  gap: 16,
                  flexWrap: "wrap",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              >
                <div style={{ flex: "1 1 220px" }}>
                  <div style={{ color: C.snow, fontWeight: 700, fontSize: 16 }}>{dep.expedition}</div>
                </div>
                <div style={{ color: C.muted, fontSize: 14, fontFamily: C.fontMono, minWidth: 120 }}>{dep.date}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 120 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: dep.spots <= 3 ? C.orange : "#5ABF8C",
                  }} />
                  <span style={{ color: dep.spots <= 3 ? C.orange : "#5ABF8C", fontSize: 13, fontFamily: C.fontMono, fontWeight: 600 }}>
                    {dep.spots} spot{dep.spots !== 1 ? "s" : ""} left
                  </span>
                </div>
                <div style={{
                  padding: "4px 14px",
                  borderRadius: 100,
                  background: `${difficultyColor[dep.difficulty] ?? C.sky}18`,
                  border: `1px solid ${difficultyColor[dep.difficulty] ?? C.sky}40`,
                  color: difficultyColor[dep.difficulty] ?? C.sky,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  fontFamily: C.fontMono,
                }}>
                  {dep.difficulty.toUpperCase()}
                </div>
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  onClick={onBook}
                  style={{
                    padding: "9px 20px",
                    background: C.orange,
                    borderRadius: 6,
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    cursor: "pointer",
                    fontFamily: C.fontMono,
                  }}
                >
                  BOOK
                </motion.div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section 10: Contact + Footer ─────────────────────────────────────────────
function ContactFooter() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section id="contact" style={{
      background: C.bg,
      borderTop: `1px solid ${C.border}`,
      padding: "100px 40px 60px",
      fontFamily: C.fontBody,
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, marginBottom: 80, flexWrap: "wrap" } as React.CSSProperties}>
          {/* Contact form */}
          <FadeIn>
            <div>
              <div style={{ color: C.sky, fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", fontFamily: C.fontMono, marginBottom: 12 }}>
                GET IN TOUCH
              </div>
              <h2 style={{ color: C.snow, fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 32 }}>
                Ready to start<br />planning your trip?
              </h2>

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.div key="form" exit={{ opacity: 0, y: -10 }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {[
                      { placeholder: "Full name", type: "text" },
                      { placeholder: "Email address", type: "email" },
                      { placeholder: "Expedition of interest", type: "text" },
                    ].map((field) => (
                      <input
                        key={field.placeholder}
                        type={field.type}
                        placeholder={field.placeholder}
                        style={{
                          background: C.bgCard,
                          border: `1px solid ${C.border}`,
                          borderRadius: 8,
                          padding: "13px 16px",
                          color: C.snow,
                          fontSize: 14,
                          fontFamily: C.fontMono,
                          outline: "none",
                          width: "100%",
                          boxSizing: "border-box" as const,
                        }}
                      />
                    ))}
                    <textarea
                      placeholder="Tell us about your adventure goals..."
                      rows={4}
                      style={{
                        background: C.bgCard,
                        border: `1px solid ${C.border}`,
                        borderRadius: 8,
                        padding: "13px 16px",
                        color: C.snow,
                        fontSize: 14,
                        fontFamily: C.fontMono,
                        outline: "none",
                        resize: "vertical",
                        width: "100%",
                        boxSizing: "border-box" as const,
                      }}
                    />
                    <MagneticButton onClick={() => setSubmitted(true)}>
                      <div style={{
                        padding: "14px 32px",
                        background: C.orange,
                        color: "#fff",
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        display: "inline-block",
                      }}>
                        SEND MESSAGE
                      </div>
                    </MagneticButton>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: C.bgCard,
                      border: `1px solid rgba(90,191,140,0.3)`,
                      borderRadius: 12,
                      padding: "36px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ color: "#5ABF8C", fontSize: 28, marginBottom: 16 }}>✓</div>
                    <div style={{ color: C.snow, fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Message received.</div>
                    <div style={{ color: C.muted, fontSize: 14, fontFamily: C.fontMono }}>Our team will reach out within 24 hours.</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeIn>

          {/* Info */}
          <FadeIn delay={0.15}>
            <div style={{ paddingTop: 60 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                {[
                  { label: "Email", value: "expeditions@summitwild.co" },
                  { label: "Phone", value: "+1 (415) 902-7840" },
                  { label: "Headquarters", value: "San Francisco, CA" },
                  { label: "Operating since", value: "2016" },
                ].map((item) => (
                  <div key={item.label}>
                    <div style={{ color: C.muted, fontSize: 11, fontFamily: C.fontMono, letterSpacing: "0.12em", marginBottom: 6 }}>
                      {item.label.toUpperCase()}
                    </div>
                    <div style={{ color: C.snow, fontSize: 15, fontWeight: 500 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Footer bar */}
        <div style={{
          borderTop: `1px solid ${C.border}`,
          paddingTop: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.sky }} />
            <span style={{ color: C.snow, fontWeight: 700, fontSize: 15, letterSpacing: "0.04em" }}>SUMMIT WILDS</span>
          </div>
          <div style={{ color: C.muted, fontSize: 12, fontFamily: C.fontMono }}>
            © 2026 Summit Wilds Expeditions. All rights reserved.
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy", "Terms", "Safety"].map((link) => (
              <span key={link} style={{ color: C.muted, fontSize: 12, fontFamily: C.fontMono, cursor: "pointer" }}>
                {link}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Booking Modal ─────────────────────────────────────────────────────────────
function BookingModal({
  open,
  onClose,
  expedition,
}: {
  open: boolean
  onClose: () => void
  expedition: (typeof EXPEDITIONS)[0] | null
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 200,
              background: "rgba(5,7,8,0.85)",
              backdropFilter: "blur(6px)",
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 201,
              background: C.bgCard,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              padding: "44px 48px",
              width: "100%",
              maxWidth: 480,
              fontFamily: C.fontBody,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
              <div>
                <div style={{ color: C.sky, fontSize: 11, fontFamily: C.fontMono, letterSpacing: "0.12em", marginBottom: 8 }}>
                  SECURE YOUR SPOT
                </div>
                <h3 style={{ color: C.snow, fontSize: 22, fontWeight: 800 }}>
                  {expedition ? expedition.title : "Reserve an Expedition"}
                </h3>
              </div>
              <motion.div
                onClick={onClose}
                whileHover={{ rotate: 90 }}
                style={{ color: C.muted, fontSize: 20, cursor: "pointer", lineHeight: 1 }}
              >
                ×
              </motion.div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { placeholder: "Full name", type: "text" },
                { placeholder: "Email address", type: "email" },
                { placeholder: "Phone number", type: "tel" },
              ].map((f) => (
                <input
                  key={f.placeholder}
                  type={f.type}
                  placeholder={f.placeholder}
                  style={{
                    background: C.bgMid,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: "12px 16px",
                    color: C.snow,
                    fontSize: 14,
                    fontFamily: C.fontMono,
                    outline: "none",
                    width: "100%",
                    boxSizing: "border-box" as const,
                  }}
                />
              ))}
              <select
                style={{
                  background: C.bgMid,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: "12px 16px",
                  color: C.snow,
                  fontSize: 14,
                  fontFamily: C.fontMono,
                  outline: "none",
                  width: "100%",
                }}
              >
                <option value="">Select preferred departure date</option>
                {DEPARTURES.map((d) => (
                  <option key={d.date} value={d.date}>{d.expedition} — {d.date}</option>
                ))}
              </select>
              <MagneticButton style={{ marginTop: 8, width: "100%" }}>
                <div style={{
                  padding: "14px",
                  background: C.orange,
                  color: "#fff",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textAlign: "center",
                  boxShadow: `0 0 32px rgba(224,123,63,0.35)`,
                }}>
                  REQUEST RESERVATION
                </div>
              </MagneticButton>
              <p style={{ color: C.muted, fontSize: 11, fontFamily: C.fontMono, textAlign: "center", marginTop: 4 }}>
                30% deposit to confirm · Full refund up to 60 days before
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── Root Page ────────────────────────────────────────────────────────────────
export default function SummitWildsPage() {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [selectedExp, setSelectedExp] = useState<(typeof EXPEDITIONS)[0] | null>(null)

  // Inject Google Fonts
  useEffect(() => {
    const id = "summit-wilds-fonts"
    if (document.getElementById(id)) return
    const style = document.createElement("style")
    style.id = id
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700;900&family=Space+Grotesk:wght@300;400;500;600&display=swap');`
    document.head.appendChild(style)
  }, [])

  const openBook = (exp?: (typeof EXPEDITIONS)[0]) => {
    if (exp) setSelectedExp(exp)
    setBookingOpen(true)
  }

  return (
    <div style={{
      background: C.bg,
      color: C.snow,
      minHeight: "100vh",
      overflowX: "hidden",
      fontFamily: C.fontBody,
    }}>
      <Nav onBook={() => openBook()} />
      <Hero onBook={() => openBook()} />
      <MarqueeStrip />
      <AltitudeChart />
      <Expeditions onBook={(exp) => openBook(exp)} />
      <WhyUs />
      <BookingProcess onBook={() => openBook()} />
      <Testimonials />
      <Departures onBook={() => openBook()} />
      <ContactFooter />
      <BookingModal
        open={bookingOpen}
        onClose={() => { setBookingOpen(false); setSelectedExp(null) }}
        expedition={selectedExp}
      />
    </div>
  )
}
