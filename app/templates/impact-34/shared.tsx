"use client"

import React, { useEffect, useRef } from "react"
import { motion, useScroll, useSpring, useInView } from "framer-motion"
import {
  Mic,
  Rss,
  BarChart3,
  DollarSign,
  Zap,
  Globe,
} from "lucide-react"

// ─── Design Tokens ─────────────────────────────────────────────────────────────
export const C = {
  bg: "#0F0F23",
  bgDark: "#0A0A1A",
  bgFooter: "#070713",
  text: "#F8FAFC",
  textMuted: "#94A3B8",
  textDark: "#64748B",
  textCharcoal: "#475569",
  accent: "#F97316",
  accentLight: "#FB923C",
  accentGlow: "rgba(249, 115, 22, 0.35)",
  border: "rgba(255, 255, 255, 0.08)",
  borderHover: "rgba(255, 255, 255, 0.15)",
  white: "#FFFFFF",
  purple: "#8B5CF6",
  green: "#10B981",
  blue: "#3B82F6",
}

export const FONT = "'Inter', sans-serif"

// ─── Mock Datasets ────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { name: "Features", href: "/templates/impact-34/features" },
  { name: "Analytics", href: "/templates/impact-34/analytics" },
  { name: "Pricing", href: "/templates/impact-34/pricing" },
]

export const FEATURES = [
  {
    icon: Mic,
    title: "Upload & Host",
    desc: "Publiez vos épisodes en quelques secondes. Drag & drop, métadonnées automatiques, couverture IA générée.",
    color: C.accent,
    href: "/templates/impact-34/features#host",
  },
  {
    icon: Rss,
    title: "RSS Distribution",
    desc: "Un seul upload, 15+ plateformes distribuées automatiquement. Spotify, Apple, Amazon Music et plus.",
    color: C.green,
    href: "/templates/impact-34/features#rss",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Listeners en temps réel, drop-off points, données géographiques, appareils, sources de trafic.",
    color: C.blue,
    href: "/templates/impact-34/analytics",
  },
  {
    icon: DollarSign,
    title: "Monetization",
    desc: "Donations, abonnements premium, insertion publicitaire dynamique. Commencez à gagner dès le 1er épisode.",
    color: C.purple,
    href: "/templates/impact-34/features#monetize",
  },
  {
    icon: Zap,
    title: "Transcription IA",
    desc: "Transcriptions automatiques en 15 langues. Show notes, chapitres, sous-titres générés automatiquement.",
    color: "#F59E0B",
    href: "/templates/impact-34/features#transcription",
  },
  {
    icon: Globe,
    title: "Custom Domain",
    desc: "Un site de podcast professionnel avec votre nom de domaine. Player intégrable partout en une ligne.",
    color: "#EC4899",
    href: "/templates/impact-34/features#domain",
  },
]

export const TESTIMONIALS = [
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

export const DISTRIBUTION_PLATFORMS = [
  "Spotify", "Apple Podcasts", "Google Podcasts", "Amazon Music",
  "Deezer", "iHeartRadio", "Pocket Casts", "Overcast",
  "Castbox", "Podcast Addict", "TuneIn", "Stitcher",
  "Breaker", "RadioPublic", "Podchaser",
]

export const PLANS = [
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
    color: C.accent,
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
    color: C.purple,
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

export const MARQUEE_STATS = [
  "50 000+ podcasters",
  "2M+ épisodes hébergés",
  "100M+ téléchargements",
  "98.9% uptime garanti",
  "15 langues de transcription",
  "Distribution en moins de 10min",
  "Paiement dans 90+ pays",
]

export const WEEKLY_DATA = [
  { day: "Lun", listeners: 4200 },
  { day: "Mar", listeners: 6800 },
  { day: "Mer", listeners: 5900 },
  { day: "Jeu", listeners: 8400 },
  { day: "Ven", listeners: 7200 },
  { day: "Sam", listeners: 9800 },
  { day: "Dim", listeners: 8100 },
]

export const TOP_EPISODES = [
  { rank: 1, title: "Comment j'ai levé 2M€ en seed", listens: "42.1K", growth: "+28%", duration: "1h 12min" },
  { rank: 2, title: "Les secrets des fondateurs à succès", listens: "38.4K", growth: "+15%", duration: "52min" },
  { rank: 3, title: "IA vs Humains: le vrai débat", listens: "31.2K", growth: "+42%", duration: "45min" },
  { rank: 4, title: "Burnout et résilience — témoignage", listens: "28.8K", growth: "+8%", duration: "1h 05min" },
]

export const FOOTER_LINKS = {
  Product: [
    { name: "Features", href: "/templates/impact-34/features" },
    { name: "Analytics", href: "/templates/impact-34/analytics" },
    { name: "Distribution", href: "/templates/impact-34/features#rss" },
    { name: "Monetization", href: "/templates/impact-34/features#monetize" },
  ],
  Creators: [
    { name: "Getting Started", href: "/templates/impact-34/pricing" },
    { name: "Community", href: "/templates/impact-34/#creators" },
  ],
  Resources: [
    { name: "Pricing Plans", href: "/templates/impact-34/pricing" },
    { name: "Contact", href: "/templates/impact-34/#contact" },
  ],
  Company: [
    { name: "Mentions légales", href: "/legal/mentions-legales" },
    { name: "Confidentialité", href: "/legal/confidentialite" },
    { name: "CGU", href: "/legal/cgu" }
  ],
}

// ─── Components ───────────────────────────────────────────────────────────────
export function Reveal({
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

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 40 })
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "left" }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#F97316] to-[#FB923C] z-[999]"
    />
  )
}

export function GlassCard({
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

export function AnimatedEQ({ barCount = 20, color = C.accent, height = 80 }: {
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

export function MarqueeStrip({ items, dark = true }: { items: string[]; dark?: boolean }) {
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
              style={{ backgroundColor: C.accent }}
            />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export function WeeklyChart() {
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
          <stop offset="0%" stopColor={C.accent} stopOpacity="0.3" />
          <stop offset="100%" stopColor={C.accent} stopOpacity="0" />
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
        stroke={C.accent}
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
          fill={C.accent}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 * i + 0.5 }}
        />
      ))}
    </svg>
  )
}
