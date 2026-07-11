"use client";
// @ts-nocheck

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  MouseEvent as ReactMouseEvent,
} from "react"
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useSpring,
  useMotionValue,
  MotionValue,
} from "framer-motion"

// Hoisted above the design tokens: several templates read `brand` in a
// module-level const — declaring it lower caused a TDZ ReferenceError (500).
let brand: any = null;

/* ==========================================================================
   GLOBAL KEYFRAMES (injected once)
   ========================================================================== */

const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&family=Inter:wght@300;600&display=swap');

  @keyframes hue-rotate-mesh {
    0%   { filter: hue-rotate(0deg); }
    33%  { filter: hue-rotate(60deg); }
    66%  { filter: hue-rotate(140deg); }
    100% { filter: hue-rotate(0deg); }
  }

  @keyframes cursor-blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }

  @keyframes shimmer-x {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  @keyframes weave-drift {
    0%   { background-position: 0 0; }
    100% { background-position: 56px 56px; }
  }

  .cursor-blink {
    animation: cursor-blink 1s step-end infinite;
  }

  .syne { font-family: 'Syne', sans-serif; font-weight: 800; }
  .inter-light { font-family: 'Inter', sans-serif; font-weight: 300; }
  .inter-semi  { font-family: 'Inter', sans-serif; font-weight: 600; }
`

/* ==========================================================================
   DATA
   ========================================================================== */

type Material = {
  id: string
  name: string
  code: string
  type: string
  status: "PRODUCTION" | "R&D" | "PROTOTYPE"
  statusColor: string
  accentGradient: string
  desc: string
  tagline: string
  specs: { label: string; value: string; unit: string }[]
  palette: string[]
  applications: string[]
  weight: string
  origin: string
}

const MATERIALS: Material[] = [
  {
    id: "GS-v4-2026",
    name: "Graphene-Silk",
    code: "GS-420",
    type: "Conductive Smart-Textile",
    status: "PRODUCTION",
    statusColor: "#86efac",
    accentGradient: "linear-gradient(135deg,#c084fc,#67e8f9)",
    desc:
      "Single-atom carbon lattice woven into recombinant silk fibroin at 1,200 threads/cm². Enables real-time biometric telemetry, piezoelectric energy harvesting, and dynamic thermal regulation — all invisible to the wearer.",
    tagline: "Where atomic precision meets haute couture.",
    specs: [
      { label: "Conductivity",    value: "420",    unit: "S/m"    },
      { label: "Tensile Strength",value: "2.4",    unit: "GPa"    },
      { label: "Weight",          value: "38",     unit: "g/m²"   },
      { label: "Wash Cycles",     value: "800+",   unit: "cycles" },
      { label: "Power Harvest",   value: "12",     unit: "µW/cm²" },
      { label: "Temp Range",      value: "−40/+80",unit: "°C"     },
    ],
    palette: ["#c084fc","#a855f7","#7c3aed","#5b21b6","#3b0764","#1a0331"],
    applications: ["Athletic Biometrics","Military Comms","Medical Wearables","AR Interface Fabric"],
    weight: "38 g/m²",
    origin: "Paris Synthesis Lab · 2025",
  },
  {
    id: "BM-88-LVX",
    name: "Bioluminescent Mesh",
    code: "BM-088",
    type: "Photonic Living Fabric",
    status: "R&D",
    statusColor: "#67e8f9",
    accentGradient: "linear-gradient(135deg,#67e8f9,#86efac)",
    desc:
      "CRISPR-engineered bioluminescent proteins (Lux operon variant) suspended in a biocompatible hydrogel matrix and encapsulated within hollow polyamide microfibers. Emits visible photons in direct response to the wearer's serotonin and cortisol levels.",
    tagline: "Your mood, made visible.",
    specs: [
      { label: "Photon Emission", value: "480–520", unit: "nm"    },
      { label: "Tensile Strength",value: "0.8",     unit: "GPa"   },
      { label: "Weight",          value: "52",      unit: "g/m²"  },
      { label: "Biocompat.",      value: "ISO 10993",unit: ""     },
      { label: "Response Lag",    value: "<200",    unit: "ms"    },
      { label: "Half-Life",       value: "36",      unit: "months"},
    ],
    palette: ["#67e8f9","#22d3ee","#06b6d4","#0891b2","#164e63","#083344"],
    applications: ["Luxury Mood-Wear","Stage Performance","Health Monitoring","Experiential Art"],
    weight: "52 g/m²",
    origin: "Tokyo BioLab · 2025",
  },
  {
    id: "SMW-09-KIRO",
    name: "Shape-Memory Wool",
    code: "SMW-009",
    type: "Structural Adaptive Knit",
    status: "PROTOTYPE",
    statusColor: "#fbbf24",
    accentGradient: "linear-gradient(135deg,#86efac,#fbbf24)",
    desc:
      "Merino fibers crosslinked with nitinol nanocrystals and hygroscopic aerogel microspheres. The fabric autonomously adjusts its weave density, drape coefficient, and insulation factor in response to ambient humidity and body temperature — no electronics required.",
    tagline: "Intelligence encoded in every fiber.",
    specs: [
      { label: "Shape Memory",    value: "98.6",   unit: "%"      },
      { label: "Tensile Strength",value: "1.2",    unit: "GPa"    },
      { label: "Weight",          value: "210",    unit: "g/m²"   },
      { label: "Actuation Temp.", value: "34–36",  unit: "°C"     },
      { label: "Cycles",          value: "50,000+",unit: "cycles" },
      { label: "Humidity Range",  value: "20–95",  unit: "% RH"  },
    ],
    palette: ["#86efac","#4ade80","#22c55e","#16a34a","#14532d","#052e16"],
    applications: ["Climate-Adaptive Outerwear","Space Suit Underlayers","Pressure Garments","Architectural Textile"],
    weight: "210 g/m²",
    origin: "Zürich Materials Institute · 2026",
  },
]

const APPLICATIONS = [
  { label: "Defense & Aerospace", count: "14 contracts", icon: "◈" },
  { label: "Elite Athleticwear",  count: "32 brands",    icon: "◉" },
  { label: "Medical Devices",     count: "9 FDA studies", icon: "◎" },
  { label: "Luxury Fashion",      count: "6 maisons",     icon: "◆" },
  { label: "Architecture",        count: "21 projects",   icon: "◇" },
  { label: "Consumer Electronics",count: "11 partners",   icon: "◈" },
]

/* ==========================================================================
   UTILITY HOOKS
   ========================================================================== */

function useMagneticDot(strength = 12) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 400, damping: 28 })
  const springY = useSpring(y, { stiffness: 400, damping: 28 })

  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const maxDist = 80
      if (dist < maxDist) {
        const factor = (1 - dist / maxDist) * strength
        x.set((dx / dist) * factor)
        y.set((dy / dist) * factor)
      } else {
        x.set(0)
        y.set(0)
      }
    },
    [x, y, strength]
  )

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [handleMouseMove])

  return { ref, springX, springY }
}

/* ==========================================================================
   MAGNETIC COLOR DOT
   ========================================================================== */

function MagneticDot({
  color,
  active,
  onClick,
}: {
  color: string
  active: boolean
  onClick: () => void
}) {
  const { ref, springX, springY } = useMagneticDot(12)

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      className="relative cursor-pointer"
      onClick={onClick}
      whileHover={{ scale: 1.35 }}
      whileTap={{ scale: 0.9 }}
    >
      <div
        style={{
          width: active ? 22 : 16,
          height: active ? 22 : 16,
          borderRadius: "50%",
          background: color,
          boxShadow: active ? `0 0 18px 4px ${color}88` : "none",
          transition: "width .2s,height .2s,box-shadow .2s",
          border: active ? "2px solid rgba(255,255,255,0.6)" : "2px solid rgba(255,255,255,0.12)",
        }}
      />
    </motion.div>
  )
}

/* ==========================================================================
   SPEC TYPEWRITER
   ========================================================================== */

function SpecTypewriter({ specs }: { specs: { label: string; value: string; unit: string }[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const [visibleLines, setVisibleLines] = useState<number[]>([])
  const [typedTexts, setTypedTexts] = useState<string[]>(specs.map(() => ""))
  const started = useRef(false)

  useEffect(() => {
    if (!isInView || started.current) return
    started.current = true

    const fullLines = specs.map(s => `${s.label.padEnd(22,'.')}${s.value} ${s.unit}`)

    specs.forEach((_, lineIdx) => {
      // reveal the line label after delay
      setTimeout(() => {
        setVisibleLines(prev => [...prev, lineIdx])
        // then type the value character by character
        const full = fullLines[lineIdx]
        let charIdx = 0
        const interval = setInterval(() => {
          charIdx++
          setTypedTexts(prev => {
            const next = [...prev]
            next[lineIdx] = full.slice(0, charIdx)
            return next
          })
          if (charIdx >= full.length) clearInterval(interval)
        }, 28)
      }, lineIdx * 380)
    })
  }, [isInView, specs])

  return (
    <div
      ref={ref}
      style={{
        background: "rgba(3,3,7,0.85)",
        border: "1px solid rgba(192,132,252,0.18)",
        borderRadius: 2,
        padding: "28px 32px",
        fontFamily: "'Courier New', Courier, monospace",
        minHeight: 260,
      }}
    >
      {/* Terminal header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        {["#ef4444","#fbbf24","#4ade80"].map(c => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
        ))}
        <span style={{ color: "rgba(240,238,255,0.25)", fontSize: 10, marginLeft: 8, letterSpacing: "0.2em" }}>
          MATERIAL_SPEC_SHEET — TERMINAL v2.4
        </span>
      </div>

      <div style={{ color: "rgba(192,132,252,0.55)", fontSize: 11, marginBottom: 16, letterSpacing: "0.15em" }}>
        $ load --spec-sheet --format=technical
      </div>

      {specs.map((spec, i) => (
        <div key={i} style={{ minHeight: 22 }}>
          {visibleLines.includes(i) && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: i % 2 === 0 ? "#f0eeff" : "rgba(103,232,249,0.85)",
                fontSize: 12,
                lineHeight: 1.8,
                letterSpacing: "0.06em",
              }}
            >
              <span>{typedTexts[i]}</span>
              {typedTexts[i].length < (`${spec.label.padEnd(22,'.')}${spec.value} ${spec.unit}`).length && (
                <span className="cursor-blink" style={{marginLeft: 2, color: brand ?? '#c084fc' }}>█</span>
              )}
            </div>
          )}
        </div>
      ))}

      <div style={{ color: "rgba(134,239,172,0.5)", fontSize: 11, marginTop: 12, letterSpacing: "0.15em" }}>
        {visibleLines.length >= specs.length ? "$ _" : <span className="cursor-blink">$_</span>}
      </div>
    </div>
  )
}

/* ==========================================================================
   WEAVE TEXTURE BACKGROUND (scroll-driven)
   ========================================================================== */

function WeaveTexture({ scrollY }: { scrollY: MotionValue<number> }) {
  const bgPos = useTransform(scrollY, [0, 2000], ["0px 0px", "56px 56px"])

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          repeating-linear-gradient(
            45deg,
            rgba(192,132,252,0.04) 0px,
            rgba(192,132,252,0.04) 1px,
            transparent 1px,
            transparent 28px
          ),
          repeating-linear-gradient(
            -45deg,
            rgba(103,232,249,0.03) 0px,
            rgba(103,232,249,0.03) 1px,
            transparent 1px,
            transparent 28px
          )
        `,
        backgroundSize: "56px 56px",
        backgroundPosition: bgPos as unknown as string,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  )
}

/* ==========================================================================
   IRIDESCENT HERO BACKGROUND
   ========================================================================== */

function IridescentHero({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>
}) {
  const rotationAngle = useTransform(scrollYProgress, [0, 0.4], [0, 120])

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        rotate: rotationAngle,
        scale: 1.4,
        transformOrigin: "center center",
        borderRadius: "50%",
        background:
          "conic-gradient(from 0deg at 50% 50%, #c084fc 0deg, #67e8f9 90deg, #86efac 180deg, #c084fc 270deg, #67e8f9 360deg)",
        opacity: 0.12,
        filter: "blur(80px) hue-rotate(0deg)",
        animation: "hue-rotate-mesh 12s ease-in-out infinite",
      }}
    />
  )
}

/* ==========================================================================
   3D FOLD MATERIAL CARD
   ========================================================================== */

function MaterialCard({
  material,
  index,
}: {
  material: Material
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const [activeColorIdx, setActiveColorIdx] = useState(0)
  const [hovered, setHovered] = useState(false)

  const accent = material.palette[activeColorIdx]

  return (
    <motion.div
      ref={ref}
      initial={{ rotateX: -90, opacity: 0 }}
      animate={isInView ? { rotateX: 0, opacity: 1 } : {}}
      transition={{
        duration: 0.95,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ perspective: "800px", transformStyle: "preserve-3d" }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "#0d0d14",
          border: `1px solid ${hovered ? accent + "55" : "rgba(240,238,255,0.07)"}`,
          transition: "border-color 0.4s",
          padding: "40px 36px",
          display: "flex",
          flexDirection: "column",
          gap: 28,
          position: "relative",
          overflow: "hidden",
          cursor: "crosshair",
        }}
      >
        {/* Accent glow blob */}
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: accent,
            opacity: hovered ? 0.08 : 0.03,
            filter: "blur(60px)",
            transition: "opacity 0.5s",
            pointerEvents: "none",
          }}
        />

        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div
            style={{
              fontSize: 10,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              letterSpacing: "0.35em",
              color: material.statusColor,
              textTransform: "uppercase",
              padding: "4px 10px",
              border: `1px solid ${material.statusColor}44`,
              background: `${material.statusColor}11`,
            }}
          >
            {material.status}
          </div>
          <span
            style={{
              fontSize: 10,
              fontFamily: "monospace",
              color: "rgba(240,238,255,0.2)",
              letterSpacing: "0.2em",
            }}
          >
            {material.code}
          </span>
        </div>

        {/* Title */}
        <div>
          <h3
            className="syne"
            style={{
              fontSize: 28,
              color: "#f0eeff",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: 6,
            }}
          >
            {material.name}
          </h3>
          <p
            style={{
              fontSize: 11,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              color: accent,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            {material.type}
          </p>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: 12,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            color: "rgba(240,238,255,0.45)",
            lineHeight: 1.75,
          }}
        >
          {material.desc}
        </p>

        {/* Color palette magnetic dots */}
        <div>
          <p
            style={{
              fontSize: 9,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              letterSpacing: "0.4em",
              color: "rgba(240,238,255,0.2)",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Color Swatches — {material.palette.length} tones
          </p>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {material.palette.map((color, ci) => (
              <MagneticDot
                key={ci}
                color={color}
                active={activeColorIdx === ci}
                onClick={() => setActiveColorIdx(ci)}
              />
            ))}
          </div>
        </div>

        {/* Spec typewriter */}
        <SpecTypewriter specs={material.specs} />

        {/* Applications */}
        <div>
          <p
            style={{
              fontSize: 9,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              letterSpacing: "0.4em",
              color: "rgba(240,238,255,0.2)",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Applications
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {material.applications.map(app => (
              <span
                key={app}
                style={{
                  fontSize: 10,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  color: accent,
                  background: `${accent}11`,
                  border: `1px solid ${accent}33`,
                  padding: "3px 10px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {app}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            paddingTop: 16,
            borderTop: "1px solid rgba(240,238,255,0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontFamily: "monospace",
              color: "rgba(240,238,255,0.15)",
              letterSpacing: "0.2em",
            }}
          >
            {material.origin}
          </span>
          <motion.button
            whileHover={{ x: 6 }}
            style={{
              fontSize: 10,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              color: accent,
              background: "none",
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Material Dossier →
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

/* ==========================================================================
   NAV
   ========================================================================== */

function Nav({ scrolled }: { scrolled: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        padding: "0 48px",
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(3,3,7,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(240,238,255,0.06)" : "none",
        transition: "background 0.4s, border-color 0.4s, backdrop-filter 0.4s",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 32,
            height: 32,
            background: "linear-gradient(135deg,#c084fc,#67e8f9)",
            clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
          }}
        />
        <span
          className="syne"
          style={{ fontSize: 16, color: "#f0eeff", letterSpacing: "-0.02em" }}
        >
          AEVIA MATERIALS
        </span>
      </div>

      {/* Desktop links */}
      <div
        id="mb159-nav"
        className="inter-semi"
        style={{
          display: "flex",
          gap: 40,
          fontSize: 11,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "rgba(240,238,255,0.35)",
        }}
      >
        {["Materials","Specs","Applications","Research","Contact"].map(l => (
          <motion.a
            key={l}
            href={`#${l.toLowerCase()}`}
            whileHover={{ color: "#f0eeff" }}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {l}
          </motion.a>
        ))}
      </div>

      {/* CTA */}
      <motion.button
        className="mb159-cta"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        style={{
          padding: "10px 24px",
          background: "linear-gradient(135deg,#c084fc,#67e8f9)",
          border: "none",
          cursor: "pointer",
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          fontSize: 10,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "#030307",
        }}
      >
        Request Sample
      </motion.button>

      <button
        className="mb159-burger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
        style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 4 }}
      >
        <span style={{ display: "block", width: 24, height: 1.5, background: "rgba(240,238,255,0.6)", transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
        <span style={{ display: "block", width: 24, height: 1.5, background: "rgba(240,238,255,0.6)", transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
        <span style={{ display: "block", width: 24, height: 1.5, background: "rgba(240,238,255,0.6)", transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
      </button>
    </motion.nav>

    {menuOpen && (
      <div style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 199, background: "rgba(3,3,7,0.97)", borderBottom: "1px solid rgba(240,238,255,0.06)", padding: "24px 48px", display: "flex", flexDirection: "column", gap: 20, backdropFilter: "blur(20px)" }}>
        {["Materials","Specs","Applications","Research","Contact"].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="inter-semi" style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,238,255,0.6)", textDecoration: "none" }}>
            {l}
          </a>
        ))}
      </div>
    )}
    <style>{`@media (max-width: 900px) { #mb159-nav { display: none !important; } .mb159-cta { display: none !important; } .mb159-burger { display: flex !important; } }`}</style>
  </>
  )
}

/* ==========================================================================
   HERO SECTION
   ========================================================================== */

function HeroSection({
  scrollYProgress,
  scrollY,
}: {
  scrollYProgress: MotionValue<number>
  scrollY: MotionValue<number>
}) {
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const y = useTransform(scrollY, [0, 600], [0, 120])

  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 80)
    return () => clearInterval(id)
  }, [])

  const waveChars = ["◈","◉","◎","◆","◇","◈","●","○","◉","◎"]
  const waveBar = waveChars.map((_, i) => {
    const h = 20 + Math.sin((tick + i * 3) * 0.4) * 18
    return h
  })

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        padding: "120px 48px 80px",
      }}
    >
      {/* Iridescent gradient bloom */}
      <IridescentHero scrollYProgress={scrollYProgress} />

      {/* Weave texture */}
      <WeaveTexture scrollY={scrollY} />

      {/* Radial dark vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 30%, #030307 85%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <motion.div
        style={{ opacity, y, position: "relative", zIndex: 2, textAlign: "center", maxWidth: 1100 }}
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 16,
            padding: "6px 20px",
            border: "1px solid rgba(192,132,252,0.25)",
            background: "rgba(192,132,252,0.06)",
            marginBottom: 48,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#86efac",
              boxShadow: "0 0 8px #86efac",
              animation: "cursor-blink 2s ease-in-out infinite",
            }}
          />
          <span
            className="inter-semi"
            style={{
              fontSize: 10,
              letterSpacing: "0.5em",
              textTransform: "uppercase",
              color: "rgba(240,238,255,0.4)",
            }}
          >
            Advanced Materials Laboratory · Collection 2026
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="syne"
          style={{
            fontSize: "clamp(56px,10vw,136px)",
            lineHeight: 0.88,
            letterSpacing: "-0.04em",
            color: "#f0eeff",
            marginBottom: 40,
            background:
              "linear-gradient(135deg,#f0eeff 0%,#c084fc 40%,#67e8f9 70%,#86efac 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            backgroundSize: "200% 200%",
            animation: "shimmer-x 6s linear infinite",
          }}
        >
          The Fabric<br/>of Tomorrow.
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.55 }}
          className="inter-light"
          style={{
            fontSize: "clamp(14px,1.6vw,18px)",
            color: "rgba(240,238,255,0.4)",
            lineHeight: 1.7,
            maxWidth: 640,
            margin: "0 auto 56px",
            letterSpacing: "0.04em",
          }}
        >
          Graphene-infused silk. CRISPR bioluminescent mesh. Nitinol shape-memory wool.
          We engineer textiles at the intersection of materials science, biotechnology, and
          haute couture.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(192,132,252,0.35)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "16px 40px",
              background: "linear-gradient(135deg,#c084fc,#67e8f9)",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#030307",
            }}
          >
            Explore Materials
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, borderColor: "rgba(192,132,252,0.5)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "16px 40px",
              background: "transparent",
              border: "1px solid rgba(240,238,255,0.15)",
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(240,238,255,0.6)",
            }}
          >
            Technical Specs
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Live waveform */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "flex-end",
          gap: 3,
          zIndex: 2,
        }}
      >
        {waveBar.map((h, i) => (
          <div
            key={i}
            style={{
              width: 3,
              height: h,
              background:
                i < 4
                  ? "#c084fc"
                  : i < 7
                  ? "#67e8f9"
                  : "#86efac",
              opacity: 0.5,
              borderRadius: 2,
              transition: "height 0.08s ease",
            }}
          />
        ))}
        <span
          className="inter-semi"
          style={{
            fontSize: 9,
            color: "rgba(240,238,255,0.2)",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            marginLeft: 12,
            alignSelf: "center",
          }}
        >
          Fiber Telemetry · Live
        </span>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{
          position: "absolute",
          bottom: 40,
          right: 48,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          zIndex: 2,
        }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{
            width: 1,
            height: 48,
            background: "linear-gradient(to bottom,rgba(192,132,252,0.6),transparent)",
          }}
        />
        <span
          className="inter-semi"
          style={{
            fontSize: 8,
            color: "rgba(240,238,255,0.2)",
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            writingMode: "vertical-rl",
          }}
        >
          Scroll
        </span>
      </motion.div>
    </section>
  )
}

/* ==========================================================================
   STATS BAND
   ========================================================================== */

function StatsBand() {
  const stats = [
    { value: "3",        label: "Proprietary Materials" },
    { value: "420 S/m", label: "Peak Conductivity"      },
    { value: "2.4 GPa", label: "Tensile Strength"       },
    { value: "36 mo.",  label: "Biolum. Half-Life"       },
    { value: "50K+",    label: "Shape-Memory Cycles"    },
    { value: "98.6%",   label: "Form Retention"          },
  ]

  return (
    <section
      style={{
        padding: "0",
        borderTop: "1px solid rgba(240,238,255,0.06)",
        borderBottom: "1px solid rgba(240,238,255,0.06)",
        overflow: "hidden",
        background: "#030307",
      }}
    >
      <motion.div
        animate={{ x: [0, -1200] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", gap: 0, whiteSpace: "nowrap" }}
      >
        {[...stats, ...stats].map((s, i) => (
          <div
            key={i}
            style={{
              padding: "28px 64px",
              borderRight: "1px solid rgba(240,238,255,0.06)",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              minWidth: 220,
            }}
          >
            <span
              className="syne"
              style={{ fontSize: 22, color: "#f0eeff", letterSpacing: "-0.02em" }}
            >
              {s.value}
            </span>
            <span
              className="inter-semi"
              style={{
                fontSize: 9,
                color: "rgba(240,238,255,0.25)",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
              }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  )
}

/* ==========================================================================
   MATERIALS GRID SECTION (3D fold cards)
   ========================================================================== */

function MaterialsSection() {
  return (
    <section
      id="materials"
      style={{
        padding: "120px 48px",
        background: "#030307",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Section header */}
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 80,
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="inter-semi"
              style={{fontSize: 10,
                letterSpacing: "0.5em",
                textTransform: "uppercase",
                color: brand ?? '#c084fc',
                display: "block",
                marginBottom: 16,
              }}
            >
              Material Registry
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="syne"
              style={{
                fontSize: "clamp(36px,5vw,64px)",
                color: "#f0eeff",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              Three Breakthroughs.<br/>One Collection.
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="inter-light"
            style={{
              fontSize: 13,
              color: "rgba(240,238,255,0.35)",
              lineHeight: 1.7,
              maxWidth: 360,
            }}
          >
            Each material undergoes 24 months of laboratory validation before
            entering our production registry. Click any color swatch to shift
            the accent tone.
          </motion.p>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))",
            gap: 24,
          }}
        >
          {MATERIALS.map((mat, i) => (
            <MaterialCard key={mat.id} material={mat} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   IRIDESCENT ACCENT DIVIDER (scroll-driven color)
   ========================================================================== */

function IridescentDivider({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const hue = useTransform(scrollYProgress, [0, 0.5, 1], [280, 185, 130])

  return (
    <motion.div
      style={{
        height: 2,
        background: `hsl(${hue.get()}deg 80% 75%)`,
        width: "100%",
        opacity: 0.3,
      }}
    />
  )
}

/* ==========================================================================
   APPLICATIONS SECTION
   ========================================================================== */

function ApplicationsSection() {
  return (
    <section
      id="applications"
      style={{
        padding: "120px 48px",
        background: "#07070f",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="inter-semi"
          style={{
            fontSize: 10,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: "#67e8f9",
            display: "block",
            marginBottom: 16,
          }}
        >
          Deployment Sectors
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="syne"
          style={{
            fontSize: "clamp(32px,4.5vw,56px)",
            color: "#f0eeff",
            letterSpacing: "-0.03em",
            marginBottom: 72,
            lineHeight: 1.05,
          }}
        >
          Engineered for<br/>Extreme Environments.
        </motion.h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 2,
          }}
        >
          {APPLICATIONS.map((app, i) => (
            <motion.div
              key={app.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{
                background: "rgba(192,132,252,0.06)",
                borderColor: "rgba(192,132,252,0.25)",
              }}
              style={{
                padding: "36px 32px",
                background: "rgba(240,238,255,0.02)",
                border: "1px solid rgba(240,238,255,0.06)",
                cursor: "pointer",
                transition: "background 0.3s,border-color 0.3s",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <span style={{ fontSize: 28, lineHeight: 1 }}>{app.icon}</span>
              <div>
                <h3
                  className="inter-semi"
                  style={{
                    fontSize: 14,
                    color: "#f0eeff",
                    letterSpacing: "-0.01em",
                    marginBottom: 6,
                  }}
                >
                  {app.label}
                </h3>
                <p
                  className="inter-light"
                  style={{
                    fontSize: 11,
                    color: "rgba(240,238,255,0.3)",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  {app.count}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   RESEARCH TICKER
   ========================================================================== */

function ResearchTicker() {
  const items = [
    "Graphene conductivity: 420 S/m verified",
    "ISO 10993 biocompatibility approved",
    "50,000 shape-memory cycles — zero degradation",
    "36-month bioluminescent half-life confirmed",
    "Tensile: 2.4 GPa — surpasses Kevlar 49",
    "38 g/m² — lighter than standard silk",
    "Temperature range: −40°C to +80°C",
    "98.6% shape-memory retention after 1 year",
  ]

  return (
    <div
      style={{
        background: "rgba(192,132,252,0.06)",
        borderTop: "1px solid rgba(192,132,252,0.15)",
        borderBottom: "1px solid rgba(192,132,252,0.15)",
        padding: "14px 0",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <motion.div
        animate={{ x: [0, -2400] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", gap: 0, whiteSpace: "nowrap" }}
      >
        {[...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className="inter-semi"
            style={{fontSize: 10,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: brand ?? '#c084fc',
              padding: "0 48px",
            }}
          >
            {item}
            <span style={{ color: "rgba(240,238,255,0.15)", marginLeft: 48 }}>◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ==========================================================================
   SPEC DEEP-DIVE (LARGE FEATURE SECTION)
   ========================================================================== */

function SpecDeepDive() {
  const [activeTab, setActiveTab] = useState(0)
  const mat = MATERIALS[activeTab]

  return (
    <section
      id="specs"
      style={{
        padding: "120px 48px",
        background: "#030307",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background weave */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `repeating-linear-gradient(45deg,rgba(103,232,249,0.025) 0,rgba(103,232,249,0.025) 1px,transparent 1px,transparent 40px),repeating-linear-gradient(-45deg,rgba(192,132,252,0.02) 0,rgba(192,132,252,0.02) 1px,transparent 1px,transparent 40px)`,
          backgroundSize: "80px 80px",
          animation: "weave-drift 8s linear infinite",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="inter-semi"
          style={{
            fontSize: 10,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: "#86efac",
            display: "block",
            marginBottom: 16,
          }}
        >
          Technical Specification
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="syne"
          style={{
            fontSize: "clamp(32px,4.5vw,56px)",
            color: "#f0eeff",
            letterSpacing: "-0.03em",
            marginBottom: 56,
            lineHeight: 1.05,
          }}
        >
          Spec Sheet.<br/>Terminal Read.
        </motion.h2>

        {/* Tab selectors */}
        <div
          style={{
            display: "flex",
            gap: 2,
            marginBottom: 48,
            borderBottom: "1px solid rgba(240,238,255,0.08)",
            paddingBottom: 0,
          }}
        >
          {MATERIALS.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setActiveTab(i)}
              style={{
                padding: "12px 28px",
                background: activeTab === i ? "rgba(192,132,252,0.1)" : "transparent",
                border: "none",
                borderBottom: activeTab === i ? `2px solid #c084fc` : "2px solid transparent",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: activeTab === i ? "#c084fc" : "rgba(240,238,255,0.3)",
                transition: "all 0.25s",
              }}
            >
              {m.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 40,
            }}
          >
            {/* Left: meta */}
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <div
                style={{
                  padding: "32px",
                  background: "#0d0d14",
                  border: "1px solid rgba(240,238,255,0.07)",
                }}
              >
                <h3
                  className="syne"
                  style={{ fontSize: 28, color: "#f0eeff", marginBottom: 8 }}
                >
                  {mat.name}
                </h3>
                <p
                  className="inter-light"
                  style={{fontSize: 11,
                    color: brand ?? '#c084fc',
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    marginBottom: 20,
                  }}
                >
                  {mat.type}
                </p>
                <p
                  className="inter-light"
                  style={{
                    fontSize: 13,
                    color: "rgba(240,238,255,0.45)",
                    lineHeight: 1.75,
                  }}
                >
                  {mat.desc}
                </p>
              </div>

              <div
                style={{
                  padding: "24px 32px",
                  background: "#0d0d14",
                  border: "1px solid rgba(240,238,255,0.07)",
                }}
              >
                <p
                  className="inter-semi"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.4em",
                    color: "rgba(240,238,255,0.2)",
                    textTransform: "uppercase",
                    marginBottom: 16,
                  }}
                >
                  Color Palette — Magnetic Response
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {mat.palette.map((c, ci) => (
                    <motion.div
                      key={ci}
                      whileHover={{ scale: 1.3, y: -4 }}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: c,
                        cursor: "pointer",
                        border: "2px solid rgba(255,255,255,0.1)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: terminal typewriter */}
            <div>
              <SpecTypewriter specs={mat.specs} />
              <div
                style={{
                  marginTop: 16,
                  padding: "20px 32px",
                  background: "#0d0d14",
                  border: "1px solid rgba(240,238,255,0.07)",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                {mat.applications.map(app => (
                  <span
                    key={app}
                    className="inter-semi"
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: mat.statusColor,
                      background: `${mat.statusColor}11`,
                      border: `1px solid ${mat.statusColor}33`,
                      padding: "4px 12px",
                    }}
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

/* ==========================================================================
   CTA SECTION
   ========================================================================== */

function CTASection() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section
      style={{
        padding: "140px 48px",
        background: "#07070f",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "70vw",
          height: "70vh",
          background:
            "radial-gradient(ellipse at center,rgba(192,132,252,0.08),transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto" }}>
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="inter-semi"
          style={{fontSize: 10,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: brand ?? '#c084fc',
            display: "block",
            marginBottom: 24,
          }}
        >
          Partner Access
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="syne"
          style={{
            fontSize: "clamp(40px,6vw,80px)",
            color: "#f0eeff",
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
            marginBottom: 32,
          }}
        >
          Request Your<br/>
          <span
            style={{
              background: "linear-gradient(135deg,#c084fc,#67e8f9,#86efac)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Material Sample.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="inter-light"
          style={{
            fontSize: 15,
            color: "rgba(240,238,255,0.35)",
            lineHeight: 1.7,
            marginBottom: 56,
          }}
        >
          Physical sample kits are available to qualified research institutions,
          luxury brands, and defense contractors. NDA required for R&D materials.
        </motion.p>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              style={{ display: "flex", gap: 0, maxWidth: 560, margin: "0 auto" }}
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="institutional@email.com"
                required
                style={{
                  flex: 1,
                  padding: "16px 20px",
                  background: "rgba(240,238,255,0.04)",
                  border: "1px solid rgba(240,238,255,0.12)",
                  borderRight: "none",
                  color: "#f0eeff",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "16px 32px",
                  background: "linear-gradient(135deg,#c084fc,#67e8f9)",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#030307",
                  whiteSpace: "nowrap",
                }}
              >
                Request Access
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                padding: "24px 40px",
                border: "1px solid rgba(134,239,172,0.3)",
                background: "rgba(134,239,172,0.06)",
                maxWidth: 480,
                margin: "0 auto",
              }}
            >
              <p
                className="inter-semi"
                style={{
                  fontSize: 12,
                  color: "#86efac",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                }}
              >
                Request logged. Our lab team will reach out within 48h.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <p
          className="inter-light"
          style={{
            fontSize: 10,
            color: "rgba(240,238,255,0.15)",
            marginTop: 20,
            letterSpacing: "0.2em",
          }}
        >
          By submitting you accept our Material NDA Terms. Samples shipped from Paris.
        </p>
      </div>
    </section>
  )
}

/* ==========================================================================
   FOOTER
   ========================================================================== */

function Footer() {
  const links = {
    Materials:    ["Graphene-Silk","Bioluminescent Mesh","Shape-Memory Wool","Coming 2027"],
    Research:     ["White Papers","Lab Reports","Patent Database","Open Data"],
    Company:      ["About","Careers","Press Kit","Investor Relations"],
    Legal:        ["Privacy","Terms","NDA Template","Patent Notices"],
  }

  return (
    <footer id="contact"
      style={{
        background: "#030307",
        borderTop: "1px solid rgba(240,238,255,0.06)",
        padding: "80px 48px 40px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 72,
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  background: "linear-gradient(135deg,#c084fc,#67e8f9)",
                  clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
                }}
              />
              <span
                className="syne"
                style={{ fontSize: 14, color: "#f0eeff", letterSpacing: "-0.02em" }}
              >
                AEVIA MATERIALS
              </span>
            </div>
            <p
              className="inter-light"
              style={{
                fontSize: 12,
                color: "rgba(240,238,255,0.25)",
                lineHeight: 1.7,
                maxWidth: 280,
                marginBottom: 24,
              }}
            >
              Engineering the textile future through graphene, biotech, and
              shape-memory materials science.
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              {["Research Portal","Lab Updates","Open Data"].map(l => (
                <a
                  key={l}
                  href="#hero"
                  className="inter-semi"
                  style={{
                    fontSize: 9,
                    color: "rgba(240,238,255,0.2)",
                    textDecoration: "none",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    transition: "color 0.2s",
                  }}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([col, items]) => (
            <div key={col}>
              <h4
                className="inter-semi"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  color: "rgba(240,238,255,0.2)",
                  marginBottom: 20,
                }}
              >
                {col}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {items.map(item => (
                  <li key={item}>
                    <a
                      href="#hero"
                      className="inter-light"
                      style={{
                        fontSize: 12,
                        color: "rgba(240,238,255,0.3)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(240,238,255,0.06)",
            paddingTop: 32,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <span
            className="inter-light"
            style={{
              fontSize: 10,
              color: "rgba(240,238,255,0.15)",
              letterSpacing: "0.2em",
            }}
          >
            © 2026 Aevia Materials AG · All rights reserved · Paris / Tokyo / Zürich
          </span>
          <div style={{ display: "flex", gap: 32 }}>
            {["STATUS: NOMINAL","REGISTRY v4.2.1","ISO 10993 CERTIFIED"].map(s => (
              <span
                key={s}
                className="inter-semi"
                style={{
                  fontSize: 9,
                  color: "rgba(240,238,255,0.1)",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ==========================================================================
   ROOT
   ========================================================================== */


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
export default function SmartTextilesPremium() {
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

  const containerRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)

  const { scrollY, scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  useEffect(() => {
    const unsub = scrollY.on("change", v => setScrolled(v > 40))
    return () => unsub()
  }, [scrollY]);

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
  }, [c]);return (
    <div
      ref={containerRef}
      style={{
        background: "#030307",
        color: "#f0eeff",
        minHeight: "100vh",
        overflowX: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Inject keyframes */}
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      {/* Nav */}
      <Nav scrolled={scrolled} />

      {/* Hero */}
      <HeroSection scrollYProgress={scrollYProgress} scrollY={scrollY} />

      {/* Stats ticker */}
      <StatsBand />

      {/* Research ticker */}
      <ResearchTicker />

      {/* Materials grid with 3D fold */}
      <MaterialsSection />

      {/* Spec terminal deep-dive */}
      <SpecDeepDive />

      {/* Applications */}
      <ApplicationsSection />

      {/* CTA */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
