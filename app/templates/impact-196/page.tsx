"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useSpring,
} from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Cpu,
  Zap,
  Activity,
  Radio,
  Shield,
  Eye,
  Network,
  Brain,
  Crosshair,
  Terminal,
  Database,
  Server,
  ArrowRight,
  ChevronRight,
  Menu,
  X,
  Wifi,
  BarChart3,
  Scan,
} from "lucide-react"

/* ==========================================================================
   FONTS — Rajdhani + Space Mono
   ========================================================================== */

function useFonts() {
  useEffect(() => {
    const id = "bio-robot-fonts"
    if (document.getElementById(id)) return
    const link = document.createElement("link")
    link.id = id
    link.rel = "stylesheet"
    link.href =
      "https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
    document.head.appendChild(link)

    const style = document.createElement("style")
    style.innerHTML = `
      .font-rajdhani { font-family: 'Rajdhani', sans-serif; }
      .font-mono-space { font-family: 'Space Mono', monospace; }
      @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      .cursor-blink::after { content:'_'; animation: blink 1s step-end infinite; }
      @keyframes scan-line {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100vh); }
      }
      @keyframes pulse-ring {
        0% { transform: scale(0.8); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
      }
      .scan-line { animation: scan-line 8s linear infinite; }
      .pulse-ring { animation: pulse-ring 2s ease-out infinite; }
      @keyframes grid-move {
        0% { background-position: 0 0; }
        100% { background-position: 60px 60px; }
      }
      .bg-grid-animate {
        background-image:
          radial-gradient(circle, rgba(0,255,255,0.12) 1px, transparent 1px),
          linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px);
        background-size: 60px 60px, 60px 60px, 60px 60px;
        animation: grid-move 20s linear infinite;
      }
      @keyframes glitch {
        0%,100% { clip-path: inset(0 0 100% 0); }
        5% { clip-path: inset(30% 0 50% 0); transform: translateX(-4px); }
        10% { clip-path: inset(60% 0 10% 0); transform: translateX(4px); }
        15% { clip-path: inset(0 0 100% 0); }
        20% { clip-path: inset(80% 0 5% 0); transform: translateX(-2px); }
        25% { clip-path: inset(0 0 100% 0); }
      }
      .glitch-overlay { animation: glitch 6s steps(1) infinite; }
      @keyframes hud-flicker {
        0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.6} 94%{opacity:1} 97%{opacity:0.8} 98%{opacity:1}
      }
      .hud-flicker { animation: hud-flicker 4s ease-in-out infinite; }
      @keyframes data-stream {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-100%); opacity: 0; }
      }
    `
    document.head.appendChild(style)
  }, [])
}

/* ==========================================================================
   DATA
   ========================================================================== */

const NAV_LINKS = ["Systems", "Metrics", "Enhance", "Specs", "Protocol"]

const ENHANCEMENTS = [
  {
    id: "NRL-01",
    name: "Neural Interface",
    icon: Brain,
    status: "ONLINE",
    desc: "Direct neural-digital bridge enabling thought-speed command execution and real-time data overlay integration.",
    power: "4.2W",
    latency: "0.3ms",
    compat: "99.8%",
    color: "#00ffff",
  },
  {
    id: "EXO-02",
    name: "Exo-Skeleton",
    icon: Zap,
    status: "ONLINE",
    desc: "Carbon-fiber exoskeletal augmentation delivering 8x baseline force amplification with haptic feedback grid.",
    power: "380W",
    latency: "2.1ms",
    compat: "97.2%",
    color: "#7C3AED",
  },
  {
    id: "OCU-03",
    name: "Ocular Implant",
    icon: Eye,
    status: "STANDBY",
    desc: "Retinal display overlay with 16K resolution, UV/IR spectrum switching, and 400x optical magnification.",
    power: "1.8W",
    latency: "0.1ms",
    compat: "99.9%",
    color: "#00ffff",
  },
  {
    id: "COC-04",
    name: "Cochlear Enhancer",
    icon: Radio,
    status: "ONLINE",
    desc: "Full-spectrum audio processing: 0–200kHz range, directional isolation, real-time language translation.",
    power: "0.9W",
    latency: "0.05ms",
    compat: "99.7%",
    color: "#7C3AED",
  },
  {
    id: "HAP-05",
    name: "Haptic Feedback",
    icon: Activity,
    status: "CALIBRATING",
    desc: "Sub-dermal haptic array with 4,096 individual actuators for remote touch simulation and environmental sensing.",
    power: "12W",
    latency: "1.4ms",
    compat: "98.1%",
    color: "#00ffff",
  },
  {
    id: "MEM-06",
    name: "Memory Module",
    icon: Database,
    status: "ONLINE",
    desc: "512TB compressed memory core with photographic recall, instant search, and cross-reference AI indexing.",
    power: "6.1W",
    latency: "0.02ms",
    compat: "99.95%",
    color: "#7C3AED",
  },
]

const METRICS = [
  { label: "Neural Latency", value: 0.4, unit: "ms", max: 5, icon: Brain, color: "#00ffff" },
  { label: "Force Output", value: 847, unit: "%", max: 1000, icon: Zap, color: "#7C3AED" },
  { label: "Sensory Acuity", value: 99.7, unit: "%", max: 100, icon: Eye, color: "#00ffff" },
  { label: "Memory Index", value: 512, unit: "TB", max: 512, icon: Database, color: "#7C3AED" },
]

const MARQUEE_ITEMS = [
  "NEURAL_LINK_ACTIVE",
  "FORCE_AMPLIFIER_ONLINE",
  "SENSORY_BOOST_ENGAGED",
  "MEMORY_MODULE_SYNC",
  "THERMAL_REGULATOR_OK",
  "EXOSKELETON_CALIBRATED",
  "OCULAR_HUD_ACTIVE",
  "COCHLEAR_FILTER_ONLINE",
]

const PROTOCOL_STEPS = [
  {
    step: "01",
    name: "Evaluation",
    icon: Scan,
    desc: "Complete biometric scan and neural compatibility assessment. Full genomic sequencing to determine augmentation viability and contraindications.",
    duration: "72h",
  },
  {
    step: "02",
    name: "Neural Mapping",
    icon: Brain,
    desc: "High-resolution 3D neural cartography of target integration zones. AI-assisted pathway optimization for minimal signal interference.",
    duration: "48h",
  },
  {
    step: "03",
    name: "Integration",
    icon: Cpu,
    desc: "Precision microsurgical implantation under full neuro-monitoring. Nanotube interface anchoring with bio-compatible polymer sealing.",
    duration: "12h",
  },
  {
    step: "04",
    name: "Calibration",
    icon: Crosshair,
    desc: "Adaptive firmware tuning and neural pathway reinforcement. Progressive load testing with real-time biometric feedback monitoring.",
    duration: "30d",
  },
]

const CASE_STUDIES = [
  {
    subject: "SUBJECT_7734-ALPHA",
    name: "Marcus Chen",
    role: "Combat Operator",
    package: "ELITE",
    stats: [
      "reaction_time: 0.08s (-91%)",
      "force_output: 8.4kN (+840%)",
      "visual_range: 4.2km (+6000%)",
      "memory_precision: 99.97%",
    ],
    note: "// Full-stack augmentation. Field-deployed 18 months.",
  },
  {
    subject: "SUBJECT_4421-BETA",
    name: "Dr. Yuki Tanaka",
    role: "Neuroscience Lead",
    package: "ADVANCED",
    stats: [
      "cognitive_speed: +340%",
      "recall_accuracy: 99.99%",
      "focus_duration: 36h_sustained",
      "neural_latency: 0.12ms",
    ],
    note: "// Neural + Memory stack. Research output +870%.",
  },
  {
    subject: "SUBJECT_9901-GAMMA",
    name: "Elena Voss",
    role: "Intelligence Operative",
    package: "ADVANCED",
    stats: [
      "threat_detection: +520%",
      "language_modules: 47_loaded",
      "sensory_range: +400%",
      "uptime: 99.94%_24mo",
    ],
    note: "// Sensory + Cochlear + Neural. Zero adverse events.",
  },
]

const PRICING = [
  {
    tier: "CORE",
    price: "29,900",
    tag: "Entry Protocol",
    desc: "Single-system cybernetic enhancement for targeted capability augmentation.",
    features: [
      "1 enhancement system",
      "Neural Interface OR Ocular Implant",
      "24/7 remote monitoring",
      "Annual calibration",
      "5-year hardware warranty",
      "Encrypted biolink",
    ],
    cta: "Initialize Core",
    featured: false,
  },
  {
    tier: "ADVANCED",
    price: "89,900",
    tag: "Dual Integration",
    desc: "Multi-system augmentation stack for comprehensive bio-digital enhancement.",
    features: [
      "3 enhancement systems",
      "Neural + Memory + Sensory",
      "Priority 4h field support",
      "Quarterly calibration",
      "10-year hardware warranty",
      "Secure uplink channel",
      "Custom firmware profiles",
    ],
    cta: "Initialize Advanced",
    featured: true,
  },
  {
    tier: "ELITE",
    price: "199,900",
    tag: "Full Stack",
    desc: "Complete human augmentation suite — every system, maximum capability.",
    features: [
      "All 6 enhancement systems",
      "Neural + Exo + Ocular + Cochlear + Haptic + Memory",
      "Dedicated biotech agent",
      "Monthly calibration + upgrades",
      "Lifetime hardware warranty",
      "Military-grade encryption",
      "Priority surgical scheduling",
      "Custom AI personality core",
    ],
    cta: "Initialize Elite",
    featured: false,
  },
]

const SPECS_TABLE = [
  { spec: "Neural Interface Bandwidth", value: "42 Gbps" },
  { spec: "Operating Frequency", value: "2.4 / 5 / 60 GHz" },
  { spec: "Power Source", value: "Bio-kinetic + Wireless" },
  { spec: "Battery Life (passive)", value: "72 hours" },
  { spec: "Biocompatibility Rating", value: "ISO 10993-1 Class III" },
  { spec: "Operating Temperature", value: "-40°C to +85°C" },
  { spec: "Encryption Standard", value: "AES-512 + Quantum-resistant" },
  { spec: "Firmware OTA Updates", value: "Encrypted air-gap tunnel" },
  { spec: "Maintenance Interval", value: "90 days standard" },
  { spec: "Warranty Duration", value: "5–lifetime (tier)" },
  { spec: "Regulatory Approval", value: "CE, FDA Class III, ISO 13485" },
  { spec: "Integration Protocol", value: "BNCI-v4.2 standard" },
]

/* ==========================================================================
   COMPONENTS
   ========================================================================== */

function Reveal({
  children,
  delay = 0,
  y = 40,
  x = 0,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  x?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function HUDCorner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const styles = {
    tl: "top-0 left-0 border-t border-l",
    tr: "top-0 right-0 border-t border-r",
    bl: "bottom-0 left-0 border-b border-l",
    br: "bottom-0 right-0 border-b border-r",
  }
  return (
    <div
      className={`absolute w-5 h-5 border-[#00ffff]/40 ${styles[position]}`}
    />
  )
}

function BlinkDot({ color = "#00ffff" }: { color?: string }) {
  return (
    <motion.span
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
      className="inline-block w-2 h-2 rounded-full mr-2"
      style={{ backgroundColor: color }}
    />
  )
}

function ArcGauge({
  value,
  max,
  color,
  size = 120,
}: {
  value: number
  max: number
  color: string
  size?: number
}) {
  const pct = value / max
  const r = 48
  const circ = 2 * Math.PI * r
  const dash = pct * circ * 0.75
  const gap = circ - dash
  const offset = circ * 0.125

  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="6"
        strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
        strokeDashoffset={-offset}
        strokeLinecap="round"
      />
      <motion.circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeDasharray={`${dash} ${gap + circ * 0.25}`}
        strokeDashoffset={-offset}
        strokeLinecap="round"
        initial={{ strokeDasharray: `0 ${circ}` }}
        animate={{ strokeDasharray: `${dash} ${gap + circ * 0.25}` }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
    </svg>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ONLINE: "#00ffff",
    STANDBY: "#7C3AED",
    CALIBRATING: "#f59e0b",
  }
  return (
    <span
      className="text-[9px] font-bold tracking-widest px-2 py-0.5 border font-mono-space"
      style={{ color: colors[status], borderColor: `${colors[status]}40`, backgroundColor: `${colors[status]}10` }}
    >
      {status}
    </span>
  )
}

/* ==========================================================================
   MAIN PAGE
   ========================================================================== */

export default function Impact196Page() {
  useFonts()

  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeEnhancement, setActiveEnhancement] = useState(0)
  const [counters, setCounters] = useState({ packets: 0, latency: 0, sync: 0 })
  const [formData, setFormData] = useState({ name: "", email: "", tier: "CORE", notes: "" })
  const [formSent, setFormSent] = useState(false)
  const [hoveredSpec, setHoveredSpec] = useState<number | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const heroY = useTransform(scrollYProgress, [0, 0.35], [0, -140])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Animated counters
  useEffect(() => {
    const targets = { packets: 14.2, latency: 0.4, sync: 99.99 }
    const duration = 2200
    const steps = 60
    const interval = duration / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      const p = Math.min(step / steps, 1)
      setCounters({
        packets: parseFloat((targets.packets * p).toFixed(1)),
        latency: parseFloat((targets.latency * p).toFixed(2)),
        sync: parseFloat((targets.sync * p).toFixed(2)),
      })
      if (step >= steps) clearInterval(timer)
    }, interval)
    return () => clearInterval(timer)
  }, [])

  // Auto-cycle enhancements
  useEffect(() => {
    const t = setInterval(() => setActiveEnhancement(p => (p + 1) % ENHANCEMENTS.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div
      ref={containerRef}
      className="bg-[#000000] text-[#E2E8F0] font-rajdhani overflow-x-hidden min-h-screen selection:bg-[#7C3AED]/30 selection:text-[#00ffff]"
      style={{ fontFamily: "'Rajdhani', sans-serif" }}
    >
      {/* SCROLL PROGRESS BAR */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left"
        style={{
          scaleX,
          background: "linear-gradient(90deg, #7C3AED, #00ffff)",
          boxShadow: "0 0 10px rgba(0,255,255,0.6)",
        }}
      />

      {/* ================================================================
          1. NAVIGATION
          ================================================================ */}
      <motion.nav
        className="fixed top-[2px] left-0 right-0 z-50 transition-all duration-500"
        animate={{
          backgroundColor: scrolled ? "rgba(0,0,0,0.95)" : "transparent",
          borderBottomColor: scrolled ? "rgba(0,255,255,0.1)" : "transparent",
          borderBottomWidth: "1px",
        }}
        style={{ backdropFilter: scrolled ? "blur(20px)" : "none" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-8 h-8 border border-[#00ffff]/60 flex items-center justify-center group-hover:border-[#00ffff] transition-colors">
                <Cpu className="w-4 h-4 text-[#00ffff]" />
              </div>
              <div className="absolute -top-0.5 -left-0.5 w-2 h-2 border-t border-l border-[#00ffff]" />
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 border-b border-r border-[#00ffff]" />
            </div>
            <span
              className="text-xl font-bold tracking-[0.3em] text-[#E2E8F0] uppercase"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              BIO<span className="text-[#00ffff]">-</span>ROBOT
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#E2E8F0]/50 hover:text-[#00ffff] transition-colors"
              >
                {link}
              </Link>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2 px-5 py-2 border border-[#7C3AED]/60 text-[10px] font-bold tracking-widest uppercase text-[#7C3AED] hover:bg-[#7C3AED]/10 hover:border-[#7C3AED] transition-all">
              <Zap className="w-3 h-3" />
              Initialize
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-10 h-10 border border-[#00ffff]/20 flex items-center justify-center text-[#00ffff] hover:border-[#00ffff]/60 transition-colors"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#000000]/98 border-t border-[#00ffff]/10 overflow-hidden"
            >
              <div className="px-6 py-6 flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-bold tracking-[0.2em] uppercase text-[#E2E8F0]/60 hover:text-[#00ffff] transition-colors py-2 border-b border-[#ffffff]/5"
                  >
                    <ChevronRight className="inline w-3 h-3 mr-2 text-[#7C3AED]" />
                    {link}
                  </Link>
                ))}
                <button className="mt-2 flex items-center justify-center gap-2 px-5 py-3 bg-[#7C3AED]/10 border border-[#7C3AED]/60 text-sm font-bold tracking-widest uppercase text-[#7C3AED]">
                  <Zap className="w-4 h-4" />
                  Initialize
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ================================================================
          2. HERO — OLED BLACK HUD
          ================================================================ */}
      <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-grid-animate opacity-60" />

        {/* HUD scan line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="scan-line absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00ffff]/20 to-transparent" />
        </div>

        {/* Corner brackets */}
        <div className="absolute top-24 left-8 md:left-16 w-16 h-16 border-t-2 border-l-2 border-[#00ffff]/30" />
        <div className="absolute top-24 right-8 md:right-16 w-16 h-16 border-t-2 border-r-2 border-[#00ffff]/30" />
        <div className="absolute bottom-24 left-8 md:left-16 w-16 h-16 border-b-2 border-l-2 border-[#7C3AED]/30" />
        <div className="absolute bottom-24 right-8 md:right-16 w-16 h-16 border-b-2 border-r-2 border-[#7C3AED]/30" />

        {/* Pulse rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="pulse-ring absolute w-96 h-96 rounded-full border border-[#7C3AED]/10" />
          <div
            className="pulse-ring absolute w-64 h-64 rounded-full border border-[#00ffff]/10"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          {/* System tag */}
          <Reveal>
            <div className="inline-flex items-center gap-3 px-4 py-2 border border-[#00ffff]/20 bg-[#00ffff]/5 mb-8">
              <BlinkDot color="#00ffff" />
              <span
                className="text-[9px] font-bold tracking-[0.5em] uppercase text-[#00ffff]/80"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                SYSTEM_STATUS: OPERATIONAL // BIO-ROBOT_v4.2
              </span>
            </div>
          </Reveal>

          {/* Headline with glitch */}
          <Reveal delay={0.1}>
            <div className="relative inline-block">
              <h1
                className="text-[13vw] md:text-[10vw] font-bold leading-[0.85] uppercase tracking-tight text-[#E2E8F0] mb-4"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}
              >
                AUGMENT
                <br />
                <span className="text-transparent" style={{ WebkitTextStroke: "1px rgba(124,58,237,0.5)" }}>
                  YOUR
                </span>
                <br />
                <span className="text-[#00ffff]">HUMANITY</span>
              </h1>
              {/* Glitch overlay */}
              <div
                className="glitch-overlay absolute inset-0 pointer-events-none text-[13vw] md:text-[10vw] font-bold leading-[0.85] uppercase tracking-tight text-[#00ffff] opacity-30"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}
                aria-hidden
              >
                AUGMENT
                <br />
                YOUR
                <br />
                HUMANITY
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p
              className="text-sm md:text-base text-[#E2E8F0]/40 tracking-[0.2em] uppercase max-w-2xl mx-auto mb-12"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Bio-digital integration systems for the next stage of human evolution.
              <br />
              Precision engineering. Military-grade. Clinically certified.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="flex items-center justify-center gap-2 px-8 py-4 bg-[#7C3AED] text-white text-[11px] font-bold tracking-widest uppercase hover:bg-[#6d28d9] transition-all" style={{ boxShadow: "0 0 30px rgba(124,58,237,0.4)" }}>
                <Zap className="w-4 h-4" />
                Initialize Enhancement
              </button>
              <button className="flex items-center justify-center gap-2 px-8 py-4 border border-[#00ffff]/30 text-[#00ffff] text-[11px] font-bold tracking-widest uppercase hover:bg-[#00ffff]/5 hover:border-[#00ffff]/60 transition-all">
                <Scan className="w-4 h-4" />
                System Overview
              </button>
            </div>
          </Reveal>

          {/* Live metrics */}
          <Reveal delay={0.5}>
            <div className="mt-16 grid grid-cols-3 gap-0 border border-[#ffffff]/5 max-w-2xl mx-auto">
              {[
                { label: "PACKETS/SEC", value: `${counters.packets}B`, icon: Wifi },
                { label: "LATENCY", value: `${counters.latency}ms`, icon: Activity },
                { label: "SYNC RATE", value: `${counters.sync}%`, icon: Network },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center py-4 px-4 border-r border-[#ffffff]/5 last:border-r-0"
                >
                  <item.icon className="w-4 h-4 text-[#00ffff]/50 mb-2" />
                  <span
                    className="text-xl font-bold text-[#00ffff]"
                    style={{ fontFamily: "'Space Mono', monospace", textShadow: "0 0 20px rgba(0,255,255,0.5)" }}
                  >
                    {item.value}
                  </span>
                  <span className="text-[8px] tracking-widest uppercase text-[#E2E8F0]/30 mt-1" style={{ fontFamily: "'Space Mono', monospace" }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </motion.div>
      </section>

      {/* ================================================================
          3. MARQUEE
          ================================================================ */}
      <div className="border-y border-[#00ffff]/10 bg-[#0F0F23]/80 overflow-hidden py-3 hud-flicker">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 mx-8 text-[10px] font-bold tracking-widest uppercase"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              <span className="text-[#00ffff]/30">▶</span>
              <span className="text-[#E2E8F0]/40">[{item}]</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* ================================================================
          4. SYSTEMS — 6 ENHANCEMENTS
          ================================================================ */}
      <section id="systems" className="py-28 px-6 md:px-12 max-w-[1400px] mx-auto">
        <Reveal>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-[#00ffff]/60" />
            <span className="text-[9px] font-bold tracking-[0.5em] uppercase text-[#00ffff]/60" style={{ fontFamily: "'Space Mono', monospace" }}>
              SYS_MODULE // 006 UNITS AVAILABLE
            </span>
          </div>
          <h2
            className="text-5xl md:text-7xl font-bold uppercase tracking-tight text-[#E2E8F0] mb-4"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Enhancement
            <br />
            <span className="text-[#7C3AED]">Systems</span>
          </h2>
          <p className="text-[#E2E8F0]/40 max-w-xl text-sm tracking-wider mb-16" style={{ fontFamily: "'Space Mono', monospace" }}>
            Select a module below to review technical specifications and activation parameters.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#ffffff]/5">
          {ENHANCEMENTS.map((enh, i) => {
            const Icon = enh.icon
            const isActive = activeEnhancement === i
            return (
              <Reveal key={enh.id} delay={i * 0.08}>
                <motion.div
                  onClick={() => setActiveEnhancement(i)}
                  whileHover={{ backgroundColor: "rgba(15,15,35,1)" }}
                  className="relative bg-[#000000] p-8 cursor-pointer group transition-all"
                  animate={{ borderColor: isActive ? enh.color : "transparent" }}
                  style={{ border: `1px solid ${isActive ? `${enh.color}40` : "transparent"}` }}
                >
                  {/* Corner brackets */}
                  <HUDCorner position="tl" />
                  <HUDCorner position="br" />

                  {/* Active glow */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: `radial-gradient(ellipse at 20% 20%, ${enh.color}08, transparent 70%)` }}
                    />
                  )}

                  <div className="flex items-start justify-between mb-6">
                    <div
                      className="w-10 h-10 border flex items-center justify-center"
                      style={{ borderColor: `${enh.color}40`, backgroundColor: `${enh.color}08` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: enh.color }} />
                    </div>
                    <StatusBadge status={enh.status} />
                  </div>

                  <div className="mb-1">
                    <span className="text-[9px] text-[#E2E8F0]/30 tracking-widest" style={{ fontFamily: "'Space Mono', monospace" }}>
                      {enh.id}
                    </span>
                  </div>
                  <h3
                    className="text-xl font-bold uppercase tracking-wide text-[#E2E8F0] mb-3 group-hover:text-[#00ffff] transition-colors"
                    style={{ fontFamily: "'Rajdhani', sans-serif" }}
                  >
                    {enh.name}
                  </h3>
                  <p className="text-[#E2E8F0]/40 text-xs leading-relaxed mb-6" style={{ fontFamily: "'Space Mono', monospace" }}>
                    {enh.desc}
                  </p>

                  <div className="grid grid-cols-3 gap-2 border-t border-[#ffffff]/5 pt-4">
                    {[
                      { k: "POWER", v: enh.power },
                      { k: "LATENCY", v: enh.latency },
                      { k: "COMPAT", v: enh.compat },
                    ].map((d) => (
                      <div key={d.k}>
                        <div className="text-[8px] text-[#E2E8F0]/20 tracking-widest mb-1" style={{ fontFamily: "'Space Mono', monospace" }}>
                          {d.k}
                        </div>
                        <div className="text-xs font-bold" style={{ color: enh.color, fontFamily: "'Space Mono', monospace" }}>
                          {d.v}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* ================================================================
          5. METRICS — LIVE GAUGES
          ================================================================ */}
      <section id="metrics" className="py-28 px-6 md:px-12 bg-[#0F0F23] border-y border-[#ffffff]/5">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px bg-[#7C3AED]/60" />
              <span className="text-[9px] font-bold tracking-[0.5em] uppercase text-[#7C3AED]/60" style={{ fontFamily: "'Space Mono', monospace" }}>
                LIVE_METRICS // REAL_TIME_BIOMETRIC_FEED
              </span>
            </div>
            <h2
              className="text-5xl md:text-7xl font-bold uppercase tracking-tight text-[#E2E8F0] mb-16"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              Neural <span className="text-[#00ffff]">Performance</span>
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#ffffff]/5">
            {METRICS.map((metric, i) => {
              const Icon = metric.icon
              return (
                <Reveal key={metric.label} delay={i * 0.1}>
                  <div className="bg-[#0F0F23] p-8 relative">
                    <HUDCorner position="tl" />
                    <HUDCorner position="br" />

                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-4">
                        <ArcGauge value={metric.value} max={metric.max} color={metric.color} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Icon className="w-6 h-6" style={{ color: metric.color }} />
                        </div>
                      </div>

                      <motion.div
                        className="text-3xl font-bold mb-1"
                        style={{ color: metric.color, fontFamily: "'Space Mono', monospace", textShadow: `0 0 20px ${metric.color}60` }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: i * 0.1 + 1 }}
                      >
                        {metric.value}
                        <span className="text-lg ml-1">{metric.unit}</span>
                      </motion.div>

                      <span className="text-[10px] font-bold tracking-widest uppercase text-[#E2E8F0]/50" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                        {metric.label}
                      </span>

                      <div className="mt-4 w-full bg-[#ffffff]/5 h-px relative overflow-hidden">
                        <motion.div
                          className="absolute left-0 top-0 h-full"
                          initial={{ width: "0%" }}
                          whileInView={{ width: `${(metric.value / metric.max) * 100}%` }}
                          transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                          style={{ background: `linear-gradient(90deg, ${metric.color}, transparent)` }}
                        />
                      </div>
                      <div className="mt-1 text-[8px] text-[#E2E8F0]/20" style={{ fontFamily: "'Space Mono', monospace" }}>
                        {((metric.value / metric.max) * 100).toFixed(1)}% CAPACITY
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>

          {/* Additional live chart */}
          <Reveal delay={0.3}>
            <div className="mt-px bg-[#0F0F23] border border-[#ffffff]/5 p-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold tracking-widest uppercase text-[#E2E8F0]/40" style={{ fontFamily: "'Space Mono', monospace" }}>
                  NEURAL_SIGNAL_WAVE // LIVE
                </span>
                <div className="flex items-center gap-2">
                  <BlinkDot color="#00ffff" />
                  <span className="text-[9px] text-[#00ffff]/60" style={{ fontFamily: "'Space Mono', monospace" }}>RECORDING</span>
                </div>
              </div>
              <div className="flex items-end gap-1 h-16">
                {[...Array(48)].map((_, i) => {
                  const h = Math.sin(i * 0.4) * 40 + Math.sin(i * 0.8) * 20 + 50
                  return (
                    <motion.div
                      key={i}
                      className="flex-1"
                      animate={{ height: [`${h}%`, `${Math.random() * 60 + 20}%`, `${h}%`] }}
                      transition={{ duration: 1.5 + Math.random(), repeat: Infinity, delay: i * 0.04 }}
                      style={{ background: i % 2 === 0 ? "#00ffff20" : "#7C3AED20", minWidth: "2px" }}
                    />
                  )
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================================================================
          6. TECHNICAL SPECS
          ================================================================ */}
      <section id="specs" className="py-28 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <Reveal>
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-px bg-[#00ffff]/60" />
                <span className="text-[9px] font-bold tracking-[0.5em] uppercase text-[#00ffff]/60" style={{ fontFamily: "'Space Mono', monospace" }}>
                  TECHNICAL // SPECIFICATIONS
                </span>
              </div>
              <h2
                className="text-5xl md:text-6xl font-bold uppercase tracking-tight text-[#E2E8F0] mb-8"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}
              >
                System
                <br />
                <span className="text-[#7C3AED]">Architecture</span>
              </h2>
              <p className="text-[#E2E8F0]/40 text-xs leading-relaxed max-w-md" style={{ fontFamily: "'Space Mono', monospace" }}>
                Every BIO-ROBOT enhancement system is engineered to ISO Class III medical device standards with military-grade encryption and quantum-resistant communication protocols.
              </p>

              <div className="mt-12 border border-[#00ffff]/10 p-6 bg-[#0F0F23]/50 relative">
                <HUDCorner position="tl" />
                <HUDCorner position="br" />
                <div className="text-[9px] font-bold tracking-widest text-[#00ffff]/40 mb-4 uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>
                  // CORE SYSTEM STATUS
                </div>
                {["Neural Bus: ACTIVE", "Bio-Link: ENCRYPTED", "OTA Channel: SECURE", "Power Cell: 94.2%"].map((line, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-[#ffffff]/5 last:border-0">
                    <BlinkDot color={i === 3 ? "#7C3AED" : "#00ffff"} />
                    <span className="text-[10px] text-[#E2E8F0]/50" style={{ fontFamily: "'Space Mono', monospace" }}>
                      {line}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="border border-[#ffffff]/5 relative">
              <HUDCorner position="tl" />
              <HUDCorner position="br" />
              <div className="px-6 py-4 border-b border-[#ffffff]/5 flex items-center gap-3">
                <Terminal className="w-3 h-3 text-[#00ffff]/60" />
                <span className="text-[9px] font-bold tracking-widest uppercase text-[#E2E8F0]/40" style={{ fontFamily: "'Space Mono', monospace" }}>
                  SPEC_TABLE // v4.2.1
                </span>
              </div>
              <div>
                {SPECS_TABLE.map((row, i) => (
                  <motion.div
                    key={i}
                    onHoverStart={() => setHoveredSpec(i)}
                    onHoverEnd={() => setHoveredSpec(null)}
                    className="grid grid-cols-2 border-b border-[#ffffff]/5 last:border-0 transition-colors"
                    animate={{ backgroundColor: hoveredSpec === i ? "rgba(0,255,255,0.03)" : "transparent" }}
                  >
                    <div className="px-6 py-3 border-r border-[#ffffff]/5">
                      <span className="text-[10px] text-[#E2E8F0]/40" style={{ fontFamily: "'Space Mono', monospace" }}>
                        {row.spec}
                      </span>
                    </div>
                    <div className="px-6 py-3">
                      <span
                        className="text-[10px] font-bold"
                        style={{
                          color: hoveredSpec === i ? "#00ffff" : "#E2E8F0",
                          fontFamily: "'Space Mono', monospace",
                        }}
                      >
                        {row.value}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================================================================
          7. PROTOCOL — 4 STEPS
          ================================================================ */}
      <section id="protocol" className="py-28 px-6 md:px-12 bg-[#0F0F23] border-y border-[#ffffff]/5">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px bg-[#7C3AED]/60" />
              <span className="text-[9px] font-bold tracking-[0.5em] uppercase text-[#7C3AED]/60" style={{ fontFamily: "'Space Mono', monospace" }}>
                ENHANCEMENT_PROTOCOL // SEQUENCE_4
              </span>
            </div>
            <h2
              className="text-5xl md:text-7xl font-bold uppercase tracking-tight text-[#E2E8F0] mb-16"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              Integration
              <br />
              <span className="text-[#00ffff]">Protocol</span>
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#ffffff]/5">
            {PROTOCOL_STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <Reveal key={step.step} delay={i * 0.12}>
                  <div className="bg-[#0F0F23] p-8 relative group">
                    <HUDCorner position="tl" />

                    {/* Step number */}
                    <div
                      className="text-[80px] font-bold leading-none mb-4 select-none"
                      style={{
                        color: "transparent",
                        WebkitTextStroke: "1px rgba(124,58,237,0.15)",
                        fontFamily: "'Rajdhani', sans-serif",
                      }}
                    >
                      {step.step}
                    </div>

                    <div
                      className="w-10 h-10 border border-[#00ffff]/20 flex items-center justify-center mb-6 group-hover:border-[#00ffff]/60 transition-colors"
                      style={{ backgroundColor: "rgba(0,255,255,0.05)" }}
                    >
                      <Icon className="w-5 h-5 text-[#00ffff]" />
                    </div>

                    <h3
                      className="text-xl font-bold uppercase tracking-wide text-[#E2E8F0] mb-3 group-hover:text-[#00ffff] transition-colors"
                      style={{ fontFamily: "'Rajdhani', sans-serif" }}
                    >
                      {step.name}
                    </h3>
                    <p className="text-[#E2E8F0]/40 text-xs leading-relaxed mb-6" style={{ fontFamily: "'Space Mono', monospace" }}>
                      {step.desc}
                    </p>

                    <div className="flex items-center gap-2 border-t border-[#ffffff]/5 pt-4">
                      <Server className="w-3 h-3 text-[#7C3AED]/60" />
                      <span className="text-[9px] text-[#7C3AED]/60" style={{ fontFamily: "'Space Mono', monospace" }}>
                        DURATION: {step.duration}
                      </span>
                    </div>

                    {/* Connector line */}
                    {i < PROTOCOL_STEPS.length - 1 && (
                      <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                        <ArrowRight className="w-4 h-4 text-[#00ffff]/20" />
                      </div>
                    )}
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          8. CASE STUDIES
          ================================================================ */}
      <section className="py-28 px-6 md:px-12 max-w-[1400px] mx-auto">
        <Reveal>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-[#00ffff]/60" />
            <span className="text-[9px] font-bold tracking-[0.5em] uppercase text-[#00ffff]/60" style={{ fontFamily: "'Space Mono', monospace" }}>
              CASE_STUDIES // CLASSIFIED_DATA
            </span>
          </div>
          <h2
            className="text-5xl md:text-7xl font-bold uppercase tracking-tight text-[#E2E8F0] mb-16"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Subject
            <br />
            <span className="text-[#7C3AED]">Reports</span>
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-px bg-[#ffffff]/5">
          {CASE_STUDIES.map((cs, i) => (
            <Reveal key={cs.subject} delay={i * 0.12}>
              <div className="bg-[#000000] p-8 relative group border border-transparent hover:border-[#7C3AED]/20 transition-all">
                <HUDCorner position="tl" />
                <HUDCorner position="br" />

                <div className="mb-6">
                  <span className="text-[8px] text-[#7C3AED]/60 block mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
                    {cs.subject}
                  </span>
                  <h3
                    className="text-xl font-bold uppercase text-[#E2E8F0]"
                    style={{ fontFamily: "'Rajdhani', sans-serif" }}
                  >
                    {cs.name}
                  </h3>
                  <p className="text-[10px] text-[#E2E8F0]/40" style={{ fontFamily: "'Space Mono', monospace" }}>
                    {cs.role} // PACKAGE: {cs.package}
                  </p>
                </div>

                <div
                  className="bg-[#0F0F23] border border-[#00ffff]/10 p-4 font-mono-space text-[10px] leading-loose"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  <div className="text-[#00ffff]/40 mb-2">{"// PERFORMANCE_DELTA"}</div>
                  {cs.stats.map((stat, j) => (
                    <div key={j} className="text-[#00ffff]/70">
                      <span className="text-[#7C3AED]/60">{`[${String(j + 1).padStart(2, "0")}] `}</span>
                      {stat}
                    </div>
                  ))}
                  <div className="text-[#E2E8F0]/20 mt-2">{cs.note}</div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Shield className="w-3 h-3 text-[#00ffff]/40" />
                  <span className="text-[8px] text-[#E2E8F0]/30 tracking-widest" style={{ fontFamily: "'Space Mono', monospace" }}>
                    VERIFIED // NO ADVERSE EVENTS
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================================================================
          9. PRICING
          ================================================================ */}
      <section id="enhance" className="py-28 px-6 md:px-12 bg-[#0F0F23] border-y border-[#ffffff]/5">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-[#00ffff]/60" />
                <span className="text-[9px] font-bold tracking-[0.5em] uppercase text-[#00ffff]/60" style={{ fontFamily: "'Space Mono', monospace" }}>
                  PACKAGES // ENHANCEMENT_TIERS
                </span>
                <div className="w-8 h-px bg-[#00ffff]/60" />
              </div>
              <h2
                className="text-5xl md:text-7xl font-bold uppercase tracking-tight text-[#E2E8F0]"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}
              >
                Select Your
                <br />
                <span className="text-[#7C3AED]">Protocol</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-px bg-[#ffffff]/5">
            {PRICING.map((pkg, i) => (
              <Reveal key={pkg.tier} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="relative bg-[#0F0F23] p-8 flex flex-col"
                  style={{
                    border: pkg.featured ? "1px solid rgba(124,58,237,0.4)" : "1px solid transparent",
                    boxShadow: pkg.featured ? "0 0 40px rgba(124,58,237,0.1), inset 0 0 40px rgba(124,58,237,0.02)" : "none",
                  }}
                >
                  {pkg.featured && (
                    <div className="absolute -top-px left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent" />
                  )}
                  <HUDCorner position="tl" />
                  <HUDCorner position="br" />

                  {pkg.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="text-[8px] font-bold tracking-widest px-2 py-1 bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[#7C3AED]" style={{ fontFamily: "'Space Mono', monospace" }}>
                        RECOMMENDED
                      </span>
                    </div>
                  )}

                  <div className="mb-8">
                    <div className="text-[9px] text-[#E2E8F0]/30 tracking-widest mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
                      TIER_{pkg.tier}
                    </div>
                    <h3
                      className="text-3xl font-bold uppercase tracking-wide text-[#E2E8F0] mb-1"
                      style={{ fontFamily: "'Rajdhani', sans-serif" }}
                    >
                      {pkg.tier}
                    </h3>
                    <p className="text-[10px] text-[#E2E8F0]/40" style={{ fontFamily: "'Space Mono', monospace" }}>
                      {pkg.tag}
                    </p>
                  </div>

                  <div className="mb-6">
                    <span
                      className="text-5xl font-bold"
                      style={{
                        fontFamily: "'Rajdhani', sans-serif",
                        color: pkg.featured ? "#7C3AED" : "#E2E8F0",
                        textShadow: pkg.featured ? "0 0 30px rgba(124,58,237,0.5)" : "none",
                      }}
                    >
                      {pkg.price}€
                    </span>
                    <div className="text-[9px] text-[#E2E8F0]/30 mt-1" style={{ fontFamily: "'Space Mono', monospace" }}>
                      one-time integration fee
                    </div>
                  </div>

                  <p className="text-[#E2E8F0]/40 text-xs mb-8" style={{ fontFamily: "'Space Mono', monospace" }}>
                    {pkg.desc}
                  </p>

                  <div className="space-y-3 flex-1 mb-8">
                    {pkg.features.map((f, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <ChevronRight className="w-3 h-3 text-[#00ffff]/60 mt-0.5 flex-shrink-0" />
                        <span className="text-[10px] text-[#E2E8F0]/60" style={{ fontFamily: "'Space Mono', monospace" }}>
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    className="w-full py-3 text-[11px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: pkg.featured ? "#7C3AED" : "transparent",
                      border: pkg.featured ? "none" : "1px solid rgba(0,255,255,0.3)",
                      color: pkg.featured ? "#ffffff" : "#00ffff",
                    }}
                  >
                    <Zap className="w-3 h-3" />
                    {pkg.cta}
                  </button>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          10. CONTACT / INITIALIZE
          ================================================================ */}
      <section id="initialize" className="py-28 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Info */}
          <Reveal>
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-px bg-[#00ffff]/60" />
                <span className="text-[9px] font-bold tracking-[0.5em] uppercase text-[#00ffff]/60" style={{ fontFamily: "'Space Mono', monospace" }}>
                  SECURE_CHANNEL // AES-512
                </span>
              </div>
              <h2
                className="text-5xl md:text-6xl font-bold uppercase tracking-tight text-[#E2E8F0] mb-8"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}
              >
                Begin
                <br />
                <span className="text-[#7C3AED]">Initialization</span>
              </h2>
              <p className="text-[#E2E8F0]/40 text-xs leading-relaxed max-w-md mb-12" style={{ fontFamily: "'Space Mono', monospace" }}>
                Transmission encrypted end-to-end. A BIO-ROBOT integration specialist will contact you within 24 hours to begin the evaluation protocol.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Terminal, label: "COMMS", value: "secure@bio-robot.tech" },
                  { icon: Shield, label: "CLEARANCE", value: "TOP_SECRET // AUTHORIZED" },
                  { icon: Network, label: "UPLINK", value: "+33 1 00 00 00 00" },
                  { icon: Server, label: "NODE", value: "Paris // Berlin // Tokyo" },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-center gap-4">
                      <div className="w-8 h-8 border border-[#00ffff]/20 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#00ffff]/60" />
                      </div>
                      <div>
                        <div className="text-[8px] text-[#E2E8F0]/20 tracking-widest" style={{ fontFamily: "'Space Mono', monospace" }}>
                          {item.label}
                        </div>
                        <div className="text-xs text-[#E2E8F0]/60" style={{ fontFamily: "'Space Mono', monospace" }}>
                          {item.value}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </Reveal>

          {/* Right: Form */}
          <Reveal delay={0.2}>
            <div className="border border-[#ffffff]/5 relative">
              <HUDCorner position="tl" />
              <HUDCorner position="br" />

              <div className="px-6 py-4 border-b border-[#ffffff]/5 flex items-center gap-3">
                <BlinkDot color="#00ffff" />
                <span className="text-[9px] font-bold tracking-widest uppercase text-[#E2E8F0]/40" style={{ fontFamily: "'Space Mono', monospace" }}>
                  INITIALIZATION_FORM // ENCRYPTED_CHANNEL_READY
                </span>
              </div>

              <AnimatePresence mode="wait">
                {!formSent ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={(e) => { e.preventDefault(); setFormSent(true) }}
                    className="p-8 space-y-6"
                  >
                    {[
                      { label: "SUBJECT_ID", placeholder: "Full name", type: "text", key: "name" },
                      { label: "COMMS_ADDRESS", placeholder: "Email address", type: "email", key: "email" },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="block text-[8px] font-bold tracking-widest uppercase text-[#E2E8F0]/30 mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          value={formData[field.key as keyof typeof formData]}
                          onChange={(e) => setFormData(p => ({ ...p, [field.key]: e.target.value }))}
                          className="w-full bg-[#0F0F23] border border-[#ffffff]/10 px-4 py-3 text-xs text-[#E2E8F0] placeholder-[#E2E8F0]/20 focus:border-[#00ffff]/40 focus:outline-none transition-colors"
                          style={{ fontFamily: "'Space Mono', monospace" }}
                        />
                      </div>
                    ))}

                    <div>
                      <label className="block text-[8px] font-bold tracking-widest uppercase text-[#E2E8F0]/30 mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
                        PACKAGE_SELECTION
                      </label>
                      <select
                        value={formData.tier}
                        onChange={(e) => setFormData(p => ({ ...p, tier: e.target.value }))}
                        className="w-full bg-[#0F0F23] border border-[#ffffff]/10 px-4 py-3 text-xs text-[#E2E8F0] focus:border-[#00ffff]/40 focus:outline-none transition-colors"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                      >
                        <option value="CORE">CORE — 29,900€</option>
                        <option value="ADVANCED">ADVANCED — 89,900€</option>
                        <option value="ELITE">ELITE — 199,900€</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[8px] font-bold tracking-widest uppercase text-[#E2E8F0]/30 mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
                        NOTES // OPTIONAL
                      </label>
                      <textarea
                        placeholder="Additional requirements or medical history..."
                        value={formData.notes}
                        onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
                        rows={4}
                        className="w-full bg-[#0F0F23] border border-[#ffffff]/10 px-4 py-3 text-xs text-[#E2E8F0] placeholder-[#E2E8F0]/20 focus:border-[#00ffff]/40 focus:outline-none transition-colors resize-none"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-[#7C3AED] text-white text-[11px] font-bold tracking-widest uppercase hover:bg-[#6d28d9] transition-all flex items-center justify-center gap-2"
                      style={{ boxShadow: "0 0 30px rgba(124,58,237,0.3)" }}
                    >
                      <Terminal className="w-4 h-4" />
                      Transmit Request
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-12 text-center"
                  >
                    <div className="w-12 h-12 border border-[#00ffff]/40 flex items-center justify-center mx-auto mb-6">
                      <Shield className="w-6 h-6 text-[#00ffff]" />
                    </div>
                    <h3 className="text-2xl font-bold uppercase text-[#00ffff] mb-3" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                      Request Transmitted
                    </h3>
                    <p className="text-[10px] text-[#E2E8F0]/40" style={{ fontFamily: "'Space Mono', monospace" }}>
                      ENCRYPTED_CHANNEL: OPEN
                      <br />
                      RESPONSE_ETA: 24H
                      <br />
                      STATUS: AWAITING_CLEARANCE
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================================================================
          FOOTER
          ================================================================ */}
      <footer className="border-t border-[#ffffff]/5 bg-[#000000] py-12 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border border-[#00ffff]/30 flex items-center justify-center">
              <Cpu className="w-3 h-3 text-[#00ffff]/60" />
            </div>
            <span className="text-sm font-bold tracking-[0.3em] uppercase text-[#E2E8F0]/40" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              BIO<span className="text-[#00ffff]/40">-</span>ROBOT
            </span>
          </div>

          <div className="flex items-center gap-2">
            <BlinkDot color="#00ffff" />
            <span className="text-[8px] text-[#E2E8F0]/20 tracking-widest" style={{ fontFamily: "'Space Mono', monospace" }}>
              ALL_SYSTEMS_NOMINAL // UPTIME: 99.99%
            </span>
          </div>

          <span className="text-[9px] text-[#E2E8F0]/20" style={{ fontFamily: "'Space Mono', monospace" }}>
            © 2026 BIO-ROBOT Corp. Classified.
          </span>
        </div>
      </footer>
    </div>
  )
}
