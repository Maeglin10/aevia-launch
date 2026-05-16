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
  Mic,
  Radio,
  Headphones,
  Play,
  Pause,
  BarChart3,
  Rss,
  Download,
  Share2,
  Users,
  TrendingUp,
  Star,
  ChevronRight,
  ArrowRight,
  Menu,
  X,
  Zap,
  Globe,
  DollarSign,
} from "lucide-react"

/* ==========================================================================
   WAVEFORM — PODCAST HOSTING PLATFORM
   bg: #0F0F23 | accent: #F97316 (orange) | text: #F8FAFC
   OLED dark, creator aesthetic, glassmorphism
   ========================================================================== */

function useFonts() {
  useEffect(() => {
    const id = "waveform-font"
    if (document.getElementById(id)) return
    const link = document.createElement("link")
    link.id = id
    link.rel = "stylesheet"
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
    document.head.appendChild(link)
  }, [])
}

/* --------------------------------------------------------------------------
   DATA
   -------------------------------------------------------------------------- */

const NAV_LINKS = ["Features", "Creators", "Analytics", "Pricing", "Blog"]

const EQ_BARS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  height: [
    20, 60, 35, 80, 45, 90, 30, 70, 55, 85,
    25, 65, 40, 75, 50, 95, 35, 60, 45, 80,
  ][i],
  delay: i * 0.08,
}))

const FEATURES = [
  {
    icon: Mic,
    title: "Upload & Host",
    desc: "Publiez vos épisodes en quelques secondes. Drag & drop, métadonnées automatiques, couverture IA générée.",
    color: "#F97316",
  },
  {
    icon: Rss,
    title: "RSS Distribution",
    desc: "Un seul upload, 15+ plateformes distribuées automatiquement. Spotify, Apple, Amazon Music et plus.",
    color: "#10B981",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Listeners en temps réel, drop-off points, données géographiques, appareils, sources de trafic.",
    color: "#3B82F6",
  },
  {
    icon: DollarSign,
    title: "Monetization",
    desc: "Donations, abonnements premium, insertion publicitaire dynamique. Commencez à gagner dès le 1er épisode.",
    color: "#8B5CF6",
  },
  {
    icon: Zap,
    title: "Transcription IA",
    desc: "Transcriptions automatiques en 15 langues. Show notes, chapitres, sous-titres générés automatiquement.",
    color: "#F59E0B",
  },
  {
    icon: Globe,
    title: "Custom Domain",
    desc: "Un site de podcast professionnel avec votre nom de domaine. Player intégrable partout en une ligne.",
    color: "#EC4899",
  },
]

const TESTIMONIALS = [
  {
    name: "Sarah Leroy",
    show: "The Startup Blueprint",
    niche: "Business & Entrepreneuriat",
    listeners: "84K",
    monthlyListeners: "84 000 auditeurs/mois",
    quote:
      "WaveForm a tout changé pour moi. En 6 mois, j'ai triplé mon audience. L'analytics m'a montré exactement quel contenu résonnait. Le player intégrable a explosé mes téléchargements.",
    rating: 5,
    avatar: "SL",
    growth: "+312%",
  },
  {
    name: "Marcus Webb",
    show: "Deep Tech Weekly",
    niche: "Technologie & IA",
    listeners: "142K",
    monthlyListeners: "142 000 auditeurs/mois",
    quote:
      "La transcription IA me fait économiser 4 heures par épisode. Les show notes sont générées, les chapitres aussi. Je me concentre sur le contenu, WaveForm fait le reste.",
    rating: 5,
    avatar: "MW",
    growth: "+180%",
  },
  {
    name: "Amira Khalil",
    show: "Mind & Movement",
    niche: "Bien-être & Santé",
    listeners: "201K",
    monthlyListeners: "201 000 auditeurs/mois",
    quote:
      "La monétisation sur WaveForm couvre mes frais d'enregistrement 8x. Les abonnements premium ont créé un vrai community de super-fans. Indispensable.",
    rating: 5,
    avatar: "AK",
    growth: "+440%",
  },
  {
    name: "Julien Moreau",
    show: "True Crime Files",
    niche: "True Crime",
    listeners: "310K",
    monthlyListeners: "310 000 auditeurs/mois",
    quote:
      "Distribution automatique sur 15 plateformes en un clic. Avant WaveForm, je passais 2 heures à uploader partout manuellement. Maintenant c'est instantané.",
    rating: 5,
    avatar: "JM",
    growth: "+650%",
  },
]

const DISTRIBUTION_PLATFORMS = [
  "Spotify", "Apple Podcasts", "Google Podcasts", "Amazon Music",
  "Deezer", "iHeartRadio", "Pocket Casts", "Overcast",
  "Castbox", "Podcast Addict", "TuneIn", "Stitcher",
  "Breaker", "RadioPublic", "Podchaser",
]

const PLANS = [
  {
    name: "Starter",
    price: "0",
    period: "Free forever",
    description: "Pour tester le concept",
    highlight: false,
    cta: "Start Free",
    color: "#6B7280",
    features: [
      "5 heures/mois de stockage",
      "RSS feed automatique",
      "Distribution 3 plateformes",
      "Analytics basiques",
      "Player intégrable",
    ],
    missing: ["Unlimited storage", "All platforms", "Advanced analytics", "Monetization", "Custom domain"],
  },
  {
    name: "Creator",
    price: "19",
    period: "/month",
    description: "Pour les créateurs sérieux",
    highlight: true,
    cta: "Start Free Trial",
    color: "#F97316",
    features: [
      "Unlimited épisodes & stockage",
      "Distribution 15+ plateformes",
      "Analytics avancés & temps réel",
      "Transcriptions IA illimitées",
      "Donations & abonnements",
      "Custom domain",
      "Player personnalisable",
      "Support prioritaire",
    ],
    missing: [],
  },
  {
    name: "Studio",
    price: "49",
    period: "/month",
    description: "Pour les équipes & réseaux",
    highlight: false,
    cta: "Contact Sales",
    color: "#8B5CF6",
    features: [
      "Tout Creator",
      "Jusqu'à 10 shows",
      "Collaboration d'équipe",
      "Dynamic Ad Insertion",
      "White-label player",
      "API access",
      "Reporting avancé",
      "Account manager dédié",
    ],
    missing: [],
  },
]

const MARQUEE_STATS = [
  "50 000+ podcasters",
  "2M+ épisodes hébergés",
  "100M+ téléchargements",
  "98.9% uptime garanti",
  "15 langues de transcription",
  "Distribution en moins de 10min",
  "Paiement dans 90+ pays",
]

const WEEKLY_DATA = [
  { day: "Lun", listeners: 4200 },
  { day: "Mar", listeners: 6800 },
  { day: "Mer", listeners: 5900 },
  { day: "Jeu", listeners: 8400 },
  { day: "Ven", listeners: 7200 },
  { day: "Sam", listeners: 9800 },
  { day: "Dim", listeners: 8100 },
]

const TOP_EPISODES = [
  { rank: 1, title: "Comment j'ai levé 2M€ en seed", listens: "42.1K", growth: "+28%", duration: "1h 12min" },
  { rank: 2, title: "Les secrets des fondateurs à succès", listens: "38.4K", growth: "+15%", duration: "52min" },
  { rank: 3, title: "IA vs Humains: le vrai débat", listens: "31.2K", growth: "+42%", duration: "45min" },
  { rank: 4, title: "Burnout et résilience — témoignage", listens: "28.8K", growth: "+8%", duration: "1h 05min" },
]

const FOOTER_LINKS = {
  Product: ["Features", "Analytics", "Distribution", "Monetization", "Player", "API"],
  Creators: ["Getting Started", "Creator Stories", "Creator Fund", "Community"],
  Resources: ["Documentation", "Blog", "Podcast Tips", "Academy", "Status Page"],
  Company: ["About", "Careers", "Press", "Contact", "Privacy", "Terms"],
}

/* --------------------------------------------------------------------------
   COMPONENTS
   -------------------------------------------------------------------------- */

function Reveal({
  children,
  delay = 0,
  y = 32,
  x = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  x?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 40 })
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "left" }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#F97316] to-[#FB923C] z-[999]"
    />
  )
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 backdrop-blur-sm ${className}`}
      style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
    >
      {children}
    </div>
  )
}

function AnimatedEQ({ barCount = 20, color = "#F97316", height = 80 }: {
  barCount?: number
  color?: string
  height?: number
}) {
  const bars = Array.from({ length: barCount }, (_, i) => i)
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {bars.map((i) => (
        <motion.div
          key={i}
          animate={{
            scaleY: [0.2, 0.8 + Math.random() * 0.2, 0.3, 1, 0.5, 0.7, 0.2],
          }}
          transition={{
            duration: 1.4 + (i % 5) * 0.2,
            repeat: Infinity,
            delay: i * 0.07,
            ease: "easeInOut",
          }}
          className="w-1.5 rounded-full origin-bottom"
          style={{ backgroundColor: color, height: "100%" }}
        />
      ))}
    </div>
  )
}

function MarqueeStrip({ items, dark = true }: { items: string[]; dark?: boolean }) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        className="inline-flex gap-12 items-center"
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-3 text-sm font-semibold ${
              dark ? "text-[#F8FAFC]/70" : "text-[#1E1B4B]"
            }`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ backgroundColor: "#F97316" }}
            />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* Inline SVG line chart for analytics preview */
function WeeklyChart() {
  const maxVal = Math.max(...WEEKLY_DATA.map((d) => d.listeners))
  const w = 420
  const h = 140
  const pad = 20

  const points = WEEKLY_DATA.map((d, i) => ({
    x: pad + (i / (WEEKLY_DATA.length - 1)) * (w - pad * 2),
    y: h - pad - ((d.listeners / maxVal) * (h - pad * 2)),
  }))

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ")

  const areaD = `${pathD} L ${points[points.length - 1].x} ${h - pad} L ${points[0].x} ${h - pad} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F97316" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={areaD}
        fill="url(#chartGrad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      />
      <motion.path
        d={pathD}
        fill="none"
        stroke="#F97316"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      {points.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4"
          fill="#F97316"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 * i + 0.5 }}
        />
      ))}
    </svg>
  )
}

/* --------------------------------------------------------------------------
   MAIN COMPONENT
   -------------------------------------------------------------------------- */

export default function Impact34Page() {
  useFonts()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentEpisode, setCurrentEpisode] = useState(0)
  const [playProgress, setPlayProgress] = useState(32)
  const [activePricingPlan, setActivePricingPlan] = useState<string>("Creator")
  const [billingAnnual, setBillingAnnual] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: heroRef })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 180])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Simulate play progress
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setPlayProgress((prev) => (prev >= 100 ? 0 : prev + 0.5))
    }, 200)
    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <div
      ref={containerRef}
      className="bg-[#0F0F23] text-[#F8FAFC] min-h-screen overflow-x-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <ScrollProgressBar />

      {/* =====================================================================
          1. NAV
          ===================================================================== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/5"
            : ""
        }`}
        style={{
          backgroundColor: scrolled ? "rgba(15,15,35,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex items-center gap-1.5">
              <Radio className="w-5 h-5 text-[#F97316]" />
              <span className="text-lg font-black tracking-tight text-white">WAVEFORM</span>
              {/* Pulse dot */}
              <span className="relative flex h-2 w-2 ml-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F97316]" />
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link}
                href="#"
                className="text-sm font-medium text-[#94A3B8] hover:text-white transition-colors"
              >
                {link}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="#" className="text-sm font-medium text-[#94A3B8] hover:text-white transition-colors">
              Sign in
            </Link>
            <Link
              href="#"
              className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-[0_4px_14px_rgba(249,115,22,0.35)]"
              style={{ backgroundColor: "#F97316" }}
            >
              Start Free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden border-t border-white/5 px-6 py-5"
              style={{ backgroundColor: "rgba(15,15,35,0.98)" }}
            >
              <div className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link}
                    href="#"
                    className="text-sm font-medium text-[#94A3B8] hover:text-white py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link}
                  </Link>
                ))}
                <hr className="border-white/10" />
                <Link
                  href="#"
                  className="w-full text-center py-3 rounded-xl text-white text-sm font-semibold"
                  style={{ backgroundColor: "#F97316" }}
                >
                  Start Free
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* =====================================================================
          2. HERO — OLED DARK + ANIMATED EQ + PARALLAX
          ===================================================================== */}
      <section
        id="hero"
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-16"
      >
        {/* Parallax BG */}
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 pointer-events-none"
        >
          {/* Glow blobs */}
          <div className="absolute top-[-15%] left-[5%] w-[700px] h-[700px] rounded-full opacity-20 blur-[120px]"
            style={{ background: "radial-gradient(circle, #F97316 0%, transparent 70%)" }} />
          <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-10 blur-[100px]"
            style={{ background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)" }} />
          <div className="absolute bottom-[-10%] left-[40%] w-[600px] h-[600px] rounded-full opacity-15 blur-[120px]"
            style={{ background: "radial-gradient(circle, #F97316 0%, transparent 70%)" }} />
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(249,115,22,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Chip */}
          <Reveal>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#F97316]/30 bg-[#F97316]/10 mb-10">
              <Mic className="w-3.5 h-3.5 text-[#F97316]" />
              <span className="text-xs font-semibold text-[#FB923C]">
                Trusted by 50,000+ podcasters worldwide
              </span>
            </div>
          </Reveal>

          {/* Big EQ visualization */}
          <Reveal delay={0.05}>
            <div className="flex justify-center mb-8">
              <AnimatedEQ barCount={24} color="#F97316" height={90} />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.0] tracking-tight mb-6">
              Your Podcast.{" "}
              <span
                className="inline-block"
                style={{
                  background: "linear-gradient(135deg, #F97316, #FB923C, #FDBA74)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Amplified.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-lg md:text-xl text-[#94A3B8] max-w-2xl mx-auto leading-relaxed mb-10">
              Host, distribute, and monetize your podcast on 15+ platforms — all from one
              dashboard. No tech skills required. Start in minutes.
            </p>
          </Reveal>

          {/* CTA buttons */}
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 rounded-2xl text-white font-bold text-base shadow-[0_8px_32px_rgba(249,115,22,0.4)] hover:shadow-[0_12px_40px_rgba(249,115,22,0.5)] transition-all"
                style={{ backgroundColor: "#F97316" }}
              >
                Start Your Podcast Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 rounded-2xl font-bold text-base border border-white/10 text-[#F8FAFC] hover:bg-white/5 transition-all flex items-center gap-2 justify-center"
              >
                <Play className="w-4 h-4" /> Watch Demo
              </motion.button>
            </div>
          </Reveal>

          {/* Hero stats */}
          <Reveal delay={0.4}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { value: "50K+", label: "Active Podcasters" },
                { value: "2M+", label: "Episodes Hosted" },
                { value: "100M+", label: "Total Downloads" },
                { value: "98.9%", label: "Uptime SLA" },
              ].map((stat) => (
                <GlassCard key={stat.label} className="py-5 px-4 text-center">
                  <div
                    className="text-2xl font-black mb-1"
                    style={{ color: "#F97316" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#64748B]">{stat.label}</div>
                </GlassCard>
              ))}
            </div>
          </Reveal>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-9 border-2 border-[#F97316]/30 rounded-full flex justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-[#F97316]"
            />
          </div>
        </motion.div>
      </section>

      {/* =====================================================================
          3. FEATURES — 6 CREATOR TOOLS
          ===================================================================== */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F97316] block mb-2">
                Creator Tools
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                Everything you need to grow
              </h2>
              <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
                Professional-grade tools that used to cost thousands a month — now included
                in every WaveForm plan.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature, i) => {
              const IconComponent = feature.icon
              return (
                <Reveal key={feature.title} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="p-7 rounded-2xl border border-white/8 hover:border-white/15 transition-all group"
                    style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: feature.color + "20" }}
                    >
                      <IconComponent className="w-6 h-6" style={{ color: feature.color }} />
                    </div>
                    <h3 className="font-bold text-lg text-[#F8FAFC] mb-2">{feature.title}</h3>
                    <p className="text-sm text-[#64748B] leading-relaxed">{feature.desc}</p>
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold"
                      style={{ color: feature.color }}>
                      Learn more <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </motion.div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. ANALYTICS PREVIEW — MOCK DASHBOARD
          ===================================================================== */}
      <section id="analytics" className="py-24 px-6 bg-[#0A0A1A]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <span className="text-xs font-bold uppercase tracking-widest text-[#F97316] block mb-3">
                Analytics
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                Know your audience<br />
                <span style={{ color: "#F97316" }}>like never before</span>
              </h2>
              <p className="text-lg text-[#64748B] leading-relaxed mb-8">
                Real-time listener data, episode drop-off analysis, geographic heatmaps, and
                subscriber growth charts — all in one beautiful dashboard.
              </p>
              <ul className="flex flex-col gap-3 mb-8">
                {[
                  "Listener count by episode & date range",
                  "Drop-off points by minute",
                  "Geographic & device breakdown",
                  "Subscriber churn & growth rate",
                  "Revenue attribution per episode",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-[#94A3B8]">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "#F97316" + "20" }}>
                      <BarChart3 className="w-3 h-3 text-[#F97316]" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90"
                style={{ backgroundColor: "#F97316" }}>
                Explore Analytics <ArrowRight className="w-4 h-4" />
              </button>
            </Reveal>

            {/* Mock dashboard */}
            <Reveal delay={0.2} x={40}>
              <GlassCard className="p-6">
                {/* Dashboard header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-[#64748B] mb-1">Weekly Listeners</p>
                    <p className="text-2xl font-black text-white">51,400</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: "#10B981" + "15" }}>
                    <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="text-xs font-bold text-[#10B981]">+24.8%</span>
                  </div>
                </div>

                {/* Chart */}
                <div className="mb-4">
                  <div className="mb-2 flex justify-between">
                    {WEEKLY_DATA.map((d) => (
                      <span key={d.day} className="text-[10px] text-[#475569]">{d.day}</span>
                    ))}
                  </div>
                  <WeeklyChart />
                </div>

                {/* Top episodes */}
                <div className="mt-6">
                  <p className="text-xs font-bold text-[#475569] uppercase tracking-wider mb-3">
                    Top Episodes This Week
                  </p>
                  <div className="flex flex-col gap-2">
                    {TOP_EPISODES.map((ep) => (
                      <div key={ep.rank} className="flex items-center gap-3 p-3 rounded-xl"
                        style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                        <span className="text-xs font-black text-[#F97316] w-5 text-center">
                          #{ep.rank}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#F8FAFC] truncate">{ep.title}</p>
                          <p className="text-[10px] text-[#475569]">{ep.duration}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-[#F8FAFC]">{ep.listens}</p>
                          <p className="text-[10px] text-[#10B981]">{ep.growth}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Listener demographics mini */}
                <div className="mt-5 p-4 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                  <p className="text-xs font-bold text-[#475569] uppercase tracking-wider mb-3">
                    Top Regions
                  </p>
                  {[
                    { region: "France", pct: 62, color: "#F97316" },
                    { region: "Canada", pct: 15, color: "#8B5CF6" },
                    { region: "Belgique", pct: 12, color: "#3B82F6" },
                    { region: "Suisse", pct: 11, color: "#10B981" },
                  ].map((region) => (
                    <div key={region.region} className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-[#64748B] w-16">{region.region}</span>
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${region.pct}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: region.color }}
                        />
                      </div>
                      <span className="text-xs font-bold text-[#94A3B8] w-8 text-right">{region.pct}%</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. DISTRIBUTION MARQUEE — FEATURED ON
          ===================================================================== */}
      <section className="py-8 border-y border-white/5 overflow-hidden bg-[#0F0F23]">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-[#475569] mb-6">
          Featured on
        </p>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="inline-flex gap-12 whitespace-nowrap"
        >
          {[...DISTRIBUTION_PLATFORMS, ...DISTRIBUTION_PLATFORMS].map((platform, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-sm font-bold text-[#475569] hover:text-[#F97316] transition-colors cursor-pointer">
              <Headphones className="w-4 h-4" />
              {platform}
            </span>
          ))}
        </motion.div>
      </section>

      {/* =====================================================================
          6. CREATOR TESTIMONIALS
          ===================================================================== */}
      <section id="creators" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F97316] block mb-2">
                Success Stories
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                Creators who chose WaveForm
              </h2>
              <p className="text-lg text-[#64748B] max-w-xl mx-auto">
                Real results from real podcasters — not marketing copy.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="p-8 rounded-2xl border border-white/8 hover:border-[#F97316]/30 transition-all"
                  style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                >
                  {/* Show info */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Mic className="w-4 h-4 text-[#F97316]" />
                        <span className="text-sm font-bold text-[#F8FAFC]">{t.show}</span>
                      </div>
                      <span className="text-xs text-[#64748B]">{t.niche}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-[#F97316]">{t.listeners}</div>
                      <div className="text-xs text-[#64748B]">listeners/mo</div>
                    </div>
                  </div>

                  {/* Growth badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-5"
                    style={{ backgroundColor: "#10B981" + "15" }}>
                    <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="text-xs font-bold text-[#10B981]">{t.growth} growth with WaveForm</span>
                  </div>

                  <p className="text-[#94A3B8] leading-relaxed mb-6 italic text-sm">
                    "{t.quote}"
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ background: "linear-gradient(135deg, #F97316, #FB923C)" }}
                      >
                        {t.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#F8FAFC]">{t.name}</div>
                        <div className="text-xs text-[#64748B]">{t.monthlyListeners}</div>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. DISTRIBUTION GRID — 15 PLATFORMS
          ===================================================================== */}
      <section id="distribution" className="py-24 px-6 bg-[#0A0A1A]">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F97316] block mb-2">
                Distribution
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                One upload. Everywhere.
              </h2>
              <p className="text-lg text-[#64748B] max-w-xl mx-auto">
                Your episodes automatically appear on every major podcast platform within minutes.
                No manual uploads, ever.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {DISTRIBUTION_PLATFORMS.map((platform, i) => (
                <motion.div
                  key={platform}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -3, borderColor: "rgba(249,115,22,0.4)" }}
                  className="aspect-[2/1] flex items-center justify-center rounded-xl text-xs font-bold text-[#475569] border border-white/5 hover:text-[#F97316] transition-all cursor-pointer"
                  style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                >
                  {platform}
                </motion.div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-10 text-center">
              <p className="text-sm text-[#475569]">
                New platforms added regularly. Request a platform not listed.{" "}
                <Link href="#" className="text-[#F97316] hover:underline font-medium">
                  View all →
                </Link>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =====================================================================
          8. PRICING — 3 PLANS
          ===================================================================== */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F97316] block mb-2">
                Pricing
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                Simple, transparent pricing
              </h2>
              <p className="text-lg text-[#64748B] max-w-xl mx-auto mb-8">
                Start free. Upgrade when you're ready to grow seriously.
              </p>
            </div>
          </Reveal>

          {/* Annual toggle */}
          <Reveal delay={0.1}>
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`text-sm font-medium ${!billingAnnual ? "text-[#F8FAFC]" : "text-[#64748B]"}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingAnnual(!billingAnnual)}
                className="relative w-12 h-6 rounded-full transition-colors"
                style={{ backgroundColor: billingAnnual ? "#F97316" : "#1E293B" }}
              >
                <motion.div
                  animate={{ x: billingAnnual ? 24 : 2 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                />
              </button>
              <span className={`text-sm font-medium ${billingAnnual ? "text-[#F8FAFC]" : "text-[#64748B]"}`}>
                Annual
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ backgroundColor: "#10B981" + "20", color: "#10B981" }}>
                Save 25%
              </span>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  onClick={() => setActivePricingPlan(plan.name)}
                  className={`relative rounded-2xl p-8 border transition-all cursor-pointer ${
                    plan.highlight
                      ? "border-[#F97316]/60 shadow-[0_0_60px_rgba(249,115,22,0.2)]"
                      : activePricingPlan === plan.name
                      ? "border-white/20"
                      : "border-white/8"
                  }`}
                  style={{
                    backgroundColor: plan.highlight
                      ? "rgba(249,115,22,0.06)"
                      : "rgba(255,255,255,0.03)",
                  }}
                >
                  {plan.highlight && (
                    <div
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-bold whitespace-nowrap"
                      style={{ backgroundColor: "#F97316" }}
                    >
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-black text-[#F8FAFC] mb-1">{plan.name}</h3>
                    <p className="text-sm text-[#64748B]">{plan.description}</p>
                  </div>

                  <div className="mb-8">
                    {plan.price === "0" ? (
                      <span className="text-4xl font-black text-[#F8FAFC]">Free</span>
                    ) : (
                      <>
                        <span className="text-4xl font-black text-[#F8FAFC]">
                          ${billingAnnual
                            ? Math.round(parseInt(plan.price) * 0.75)
                            : plan.price}
                        </span>
                        <span className="text-sm text-[#64748B] ml-1">{plan.period}</span>
                      </>
                    )}
                    {plan.price !== "0" && billingAnnual && (
                      <div className="text-xs text-[#10B981] mt-1">Billed annually</div>
                    )}
                  </div>

                  <ul className="flex flex-col gap-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <span
                          className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: plan.color + "20" }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: plan.color }}
                          />
                        </span>
                        <span className="text-[#94A3B8]">{feature}</span>
                      </li>
                    ))}
                    {plan.missing.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm opacity-30">
                        <div className="w-4 h-4 rounded-full border border-[#475569] flex-shrink-0" />
                        <span className="text-[#475569]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className="w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                    style={{
                      backgroundColor: plan.highlight ? "#F97316" : "rgba(255,255,255,0.06)",
                      color: plan.highlight ? "white" : "#F8FAFC",
                      border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {plan.cta}
                  </button>
                </motion.div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <p className="text-center text-sm text-[#475569] mt-8">
              All plans include 14-day free trial · No credit card required · Cancel anytime
            </p>
          </Reveal>
        </div>
      </section>

      {/* =====================================================================
          9. STATS MARQUEE
          ===================================================================== */}
      <section className="py-5 border-y border-white/5 overflow-hidden" style={{ backgroundColor: "#0A0A1A" }}>
        <MarqueeStrip items={MARQUEE_STATS} />
      </section>

      {/* =====================================================================
          10. CTA + DARK MEGA FOOTER
          ===================================================================== */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* BG glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
            style={{ background: "radial-gradient(circle, #F97316, transparent 70%)" }} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <Reveal>
            {/* EQ bars above CTA */}
            <div className="flex justify-center mb-10">
              <AnimatedEQ barCount={16} color="#F97316" height={60} />
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
              Start your podcast{" "}
              <span style={{ color: "#F97316" }}>in 5 minutes</span>
            </h2>
            <p className="text-lg text-[#64748B] mb-10 max-w-xl mx-auto">
              No experience required. WaveForm handles the tech, you handle the content.
              Your audience is waiting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-10 py-5 rounded-2xl text-white font-black text-base shadow-[0_8px_40px_rgba(249,115,22,0.4)] hover:shadow-[0_16px_56px_rgba(249,115,22,0.5)] transition-all"
                style={{ backgroundColor: "#F97316" }}
              >
                Start Free — No Credit Card
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                className="px-10 py-5 rounded-2xl font-bold text-base border border-white/10 text-[#F8FAFC] hover:bg-white/5 transition-all"
              >
                See Pricing Plans
              </motion.button>
            </div>
            <p className="text-sm text-[#475569] mt-6">
              Join 50,000+ podcasters. Free plan available forever.
            </p>
          </Reveal>
        </div>
      </section>

      {/* MEGA FOOTER */}
      <footer className="border-t border-white/5 pt-16 pb-10 px-6" style={{ backgroundColor: "#070713" }}>
        <div className="max-w-7xl mx-auto">
          {/* Top footer */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-14">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <Radio className="w-5 h-5 text-[#F97316]" />
                <span className="text-lg font-black text-white">WAVEFORM</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F97316]" />
                </span>
              </div>
              <p className="text-sm text-[#475569] leading-relaxed mb-6">
                The podcast platform built for creators who are serious about growing their audience and monetizing their content.
              </p>
              {/* Mini player */}
              <GlassCard className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#F97316" + "20" }}>
                    <Headphones className="w-5 h-5 text-[#F97316]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#F8FAFC] truncate">The Startup Blueprint #42</p>
                    <p className="text-[10px] text-[#64748B]">Sarah Leroy · 52min</p>
                  </div>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#F97316" }}
                  >
                    {isPlaying ? (
                      <Pause className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Play className="w-3.5 h-3.5 text-white ml-0.5" />
                    )}
                  </button>
                </div>
                {/* Progress bar */}
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ width: `${playProgress}%`, backgroundColor: "#F97316" }}
                  />
                </div>
              </GlassCard>
            </div>

            {/* Links */}
            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-sm font-bold text-[#F8FAFC] mb-4 uppercase tracking-wider">
                  {category}
                </h4>
                <ul className="flex flex-col gap-2">
                  {links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-sm text-[#475569] hover:text-[#F97316] transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter strip */}
          <div className="p-6 rounded-2xl border border-white/5 mb-10"
            style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <p className="text-sm font-bold text-[#F8FAFC] mb-1">Get creator tips weekly</p>
                <p className="text-xs text-[#64748B]">Growth strategies, platform updates, and monetization tips.</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 md:w-64 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-[#475569] outline-none focus:border-[#F97316]/50 transition-colors"
                />
                <button
                  className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                  style={{ backgroundColor: "#F97316" }}
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#334155]">
              © 2024 WaveForm. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {["Privacy", "Terms", "Cookies", "GDPR"].map((link) => (
                <Link key={link} href="#" className="text-xs text-[#334155] hover:text-[#F97316] transition-colors">
                  {link}
                </Link>
              ))}
            </div>
            <div className="flex gap-3">
              {["TW", "LI", "YT", "IG"].map((social) => (
                <div
                  key={social}
                  className="w-8 h-8 rounded-lg border border-white/5 flex items-center justify-center text-[10px] font-bold text-[#475569] hover:border-[#F97316]/40 hover:text-[#F97316] transition-all cursor-pointer"
                >
                  {social}
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
