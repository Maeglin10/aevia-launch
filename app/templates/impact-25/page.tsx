"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"

const C = {
  bg: "#070b14",
  card: "#0e1220",
  violet: "#7c3aed",
  violetLight: "#a78bfa",
  violetMuted: "rgba(124,58,237,0.15)",
  violetBorder: "rgba(124,58,237,0.2)",
  violetGlow: "rgba(124,58,237,0.08)",
  text: "#f1f5f9",
  muted: "rgba(241,245,249,0.5)",
  faint: "rgba(255,255,255,0.06)",
  cardBorder: "rgba(124,58,237,0.2)",
}

const FONT = "system-ui, -apple-system, sans-serif"
const MONO = '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace'

// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["Fonctionnalités", "Connecteurs", "Tarifs", "Documentation", "Cas clients"]

const METRICS = [
  { label: "Revenue MoM", value: "+24%", color: "#4ade80", trend: "up" },
  { label: "Churn Rate", value: "-8%", color: "#f87171", trend: "down" },
  { label: "NPS Score", value: "+12", color: "#60a5fa", trend: "up" },
]

const BAR_DATA = [
  { month: "Jan", height: 42 },
  { month: "Fév", height: 58 },
  { month: "Mar", height: 51 },
  { month: "Avr", height: 73 },
  { month: "Mai", height: 68 },
  { month: "Jun", height: 89 },
  { month: "Jul", height: 79 },
  { month: "Aoû", height: 95 },
]

const STATS = [
  { value: 3400, suffix: "+", label: "Utilisateurs actifs", prefix: "" },
  { value: 180, suffix: "+", label: "Connecteurs data", prefix: "" },
  { value: 8, suffix: " sec", label: "Temps de chargement moyen", prefix: "" },
  { value: 99.5, suffix: "%", label: "Uptime garanti", prefix: "" },
]

const TABS = [
  {
    id: "dashboards",
    label: "Tableaux de Bord",
    headline: "Des dashboards qui parlent à votre équipe",
    content:
      "Construisez des tableaux de bord en glisser-déposer en moins de 5 minutes. Chaque widget est configurable, chaque métrique est cliquable. Prism adapte automatiquement les visualisations selon le type de données : séries temporelles, entonnoirs, géographies, cohorts.",
    items: [
      "40+ types de visualisations disponibles",
      "Actualisation automatique toutes les 60 secondes",
      "Mode présentation pour les comités",
      "Filtres croisés inter-widgets",
    ],
  },
  {
    id: "predictif",
    label: "Analytics Prédictif",
    headline: "Anticipez, ne subissez pas",
    content:
      "Notre moteur ML intégré analyse vos tendances historiques et projette vos KPIs à 30, 60 et 90 jours. Les alertes intelligentes vous préviennent avant que les métriques ne dégradent — pas après. Détection d'anomalies incluse sans configuration.",
    items: [
      "Prévisions ML sur toutes vos métriques clés",
      "Alertes seuil et anomalie en temps réel",
      "Attribution multi-touch automatisée",
      "Analyse de cohortes et LTV prediction",
    ],
  },
  {
    id: "rapports",
    label: "Rapports Automatisés",
    headline: "Vos reportings s'écrivent tout seuls",
    content:
      "Planifiez des rapports PDF ou Slides générés automatiquement et envoyés à votre distribution. Nos templates métier (CMO, CFO, Board) sont pré-configurés avec les métriques standards de votre secteur. Zéro heure de préparation PowerPoint.",
    items: [
      "Templates PDF/PPTX prêts à envoyer",
      "Planification horaire, quotidienne, hebdomadaire",
      "Narration automatique des variations clés",
      "Envoi multi-canal : email, Slack, Teams",
    ],
  },
  {
    id: "collaboration",
    label: "Partage & Collaboration",
    headline: "Toute votre organisation, alignée sur les mêmes chiffres",
    content:
      "Partagez n'importe quel dashboard en lecture seule avec un lien sécurisé — sans obliger vos partenaires à créer un compte. Commentez directement sur les graphiques, assignez des tickets d'action à votre équipe, suivez les décisions prises à partir des données.",
    items: [
      "Partage par lien avec expiration paramétrable",
      "Commentaires et annotations sur graphiques",
      "Permissions granulaires par équipe et par vue",
      "Audit log complet des accès et modifications",
    ],
  },
]

const TESTIMONIALS = [
  {
    name: "Sophie Aubert",
    role: "CMO, Retailink Group",
    company: "E-commerce · 800 collaborateurs",
    quote:
      "Avant Prism, je passais 4h chaque lundi à consolider des exports Excel de 5 sources différentes pour mon comité. Maintenant ce dashboard s'actualise seul. Je passe ce temps à analyser — pas à assembler des chiffres.",
  },
  {
    name: "Marc Delacroix",
    role: "CFO, Lumières SaaS",
    company: "SaaS B2B · ARR 12M€",
    quote:
      "La partie prédictive est remarquable. Prism a détecté une dégradation du churn 6 semaines avant que nos outils habituels ne la signalent. Nous avons eu le temps d'agir. C'est la différence entre piloter et subir.",
  },
  {
    name: "Inès Mabrouk",
    role: "Head of Growth, FinCoach",
    company: "FinTech · 45 collaborateurs",
    quote:
      "L'intégration Stripe + HubSpot + GA4 a pris 20 minutes. On avait tout en place l'après-midi du premier jour. La qualité des données est irréprochable — pas de doublons, pas de délais. Les reports se font seuls le lundi matin.",
  },
  {
    name: "Antoine Fournier",
    role: "VP Marketing, Medisyn",
    company: "HealthTech · Series B",
    quote:
      "Nos investisseurs Board reçoivent un PDF automatique chaque premier lundi du mois. Propre, en marque blanche, avec la narration des variations. Notre CFO a récupéré 6h par mois. Ce seul cas d'usage justifie l'abonnement.",
  },
]

const PRICING_TIERS = [
  {
    name: "Solo",
    tag: "Indépendants & freelances",
    price: "89",
    period: "/mois",
    description: "Pour un utilisateur avec des besoins de reporting structurés et des sources de données multiples.",
    features: [
      "1 utilisateur",
      "5 dashboards actifs",
      "25 connecteurs disponibles",
      "Rapports automatisés (PDF)",
      "Support email < 48h",
    ],
    cta: "Démarrer en Solo",
    highlighted: false,
  },
  {
    name: "Équipe",
    tag: "Équipes marketing & finance",
    price: "390",
    period: "/mois",
    description: "Pour les équipes qui veulent aligner toute leur organisation sur les mêmes données en temps réel.",
    features: [
      "Jusqu'à 10 utilisateurs",
      "Dashboards illimités",
      "180+ connecteurs disponibles",
      "Analytics prédictif inclus",
      "Partage externe par lien",
      "Support prioritaire < 4h",
    ],
    cta: "Démarrer en Équipe",
    highlighted: true,
  },
  {
    name: "Enterprise",
    tag: "Grandes organisations",
    price: "Sur devis",
    period: "",
    description: "Pour les entreprises avec des exigences avancées en matière de sécurité, conformité et infrastructure.",
    features: [
      "Utilisateurs illimités",
      "SSO / SAML 2.0",
      "On-premise disponible",
      "SLA 99.9% contractualisé",
      "Customer success manager dédié",
      "Intégrations custom sur mesure",
    ],
    cta: "Contacter l'équipe commerciale",
    highlighted: false,
  },
]

const FAQS = [
  {
    q: "Quels connecteurs data sont disponibles ?",
    a: "Prism propose 180+ connecteurs natifs couvrant : CRM (Salesforce, HubSpot, Pipedrive), Analytics (Google Analytics 4, Mixpanel, Amplitude), Finance (Stripe, Chargebee, QuickBooks), Publicité (Meta Ads, Google Ads, LinkedIn Ads), E-commerce (Shopify, WooCommerce), bases SQL/BI (BigQuery, Redshift, Snowflake, PostgreSQL) et bien d'autres. Tous sont maintenus et mis à jour par nos équipes.",
  },
  {
    q: "Quel est le délai d'intégration habituel ?",
    a: "La plupart des connecteurs s'activent en moins de 5 minutes via OAuth ou clé API. Les premières données apparaissent dans les 15 à 60 minutes selon le volume historique à synchroniser. Pour les intégrations Enterprise avec SQL ou connecteurs custom, notre équipe vous accompagne sous 48h.",
  },
  {
    q: "Mes données sont-elles exportables ?",
    a: "Oui, intégralement. Vous pouvez exporter n'importe quelle vue en CSV, Excel, JSON ou via notre API REST publique. Vous êtes propriétaire de vos données à tout moment. En cas de résiliation, vos exports sont disponibles pendant 90 jours.",
  },
  {
    q: "La formation est-elle incluse dans l'abonnement ?",
    a: "Toutes les formules incluent l'accès à Prism Academy (vidéos, guides interactifs, templates métier). La formule Équipe inclut une session d'onboarding live de 2h avec un spécialiste Prism. La formule Enterprise inclut un programme de formation sur mesure pour votre équipe.",
  },
  {
    q: "Prism est-il conforme au RGPD avec hébergement en Europe ?",
    a: "Oui. Toutes nos données sont hébergées exclusivement en Europe (AWS eu-west-3, Paris). Nous sommes conformes RGPD, ISO 27001, et fournissons un DPA (Data Processing Agreement) à la signature. Nos serveurs ne transmettent aucune donnée client hors de l'UE.",
  },
  {
    q: "Puis-je changer de formule en cours d'abonnement ?",
    a: "Oui, à tout moment. L'upgrade est immédiat et proratisé à la journée. Le downgrade prend effet à la prochaine date de renouvellement. Aucun engagement minimum, aucuns frais de résiliation. Vous pouvez annuler depuis votre espace client en 2 clics.",
  },
]

// ─── STAT COUNTER ────────────────────────────────────────────────────────────

function StatCounter({ value, suffix, prefix, label }: { value: number; suffix: string; prefix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1600
    const steps = 50
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplay(value)
        clearInterval(timer)
      } else {
        setDisplay(parseFloat(current.toFixed(1)))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, value])

  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{ fontFamily: MONO, fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 700, color: C.violetLight, lineHeight: 1 }}>
        {prefix}{display}{suffix}
      </div>
      <div style={{ fontFamily: FONT, fontSize: "0.875rem", fontWeight: 500, color: C.muted, marginTop: "0.6rem" }}>
        {label}
      </div>
    </div>
  )
}

// ─── ANIMATED BAR CHART ──────────────────────────────────────────────────────

function BarChart() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "80px", padding: "0 4px" }}>
      {BAR_DATA.map((bar, i) => (
        <div key={bar.month} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flex: 1 }}>
          <motion.div
            initial={{ height: 0 }}
            animate={inView ? { height: `${bar.height}%` } : { height: 0 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" }}
            style={{
              width: "100%",
              background: i === BAR_DATA.length - 1
                ? `linear-gradient(180deg, ${C.violetLight} 0%, ${C.violet} 100%)`
                : `rgba(124,58,237,0.4)`,
              borderRadius: "3px 3px 0 0",
              minHeight: "4px",
            }}
          />
          <span style={{ fontFamily: MONO, fontSize: "9px", color: C.muted }}>{bar.month}</span>
        </div>
      ))}
    </div>
  )
}

// ─── DASHBOARD MOCKUP ────────────────────────────────────────────────────────

function DashboardMockup({ dashY }: { dashY: any }) {
  return (
    <motion.div style={{ y: dashY, position: "relative" }}>
      {/* Rotating gradient border effect */}
      <style>{`
        @keyframes prism-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .prism-border-glow {
          animation: prism-spin 4s linear infinite;
        }
      `}</style>

      {/* Outer glow wrapper */}
      <div style={{ position: "relative", borderRadius: "16px", padding: "1px", background: `linear-gradient(135deg, ${C.violet}, transparent, ${C.violetLight}, transparent, ${C.violet})` }}>
        <div
          style={{
            background: C.card,
            borderRadius: "15px",
            padding: "1.5rem",
            boxShadow: `0 0 60px rgba(124,58,237,0.15), 0 20px 80px rgba(0,0,0,0.6)`,
          }}
        >
          {/* Dashboard header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <div>
              <div style={{ fontFamily: MONO, fontSize: "0.7rem", color: C.muted, marginBottom: "2px" }}>PRISM ANALYTICS</div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: C.text }}>Vue d'ensemble — Mai 2026</div>
            </div>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f87171" }} />
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fbbf24" }} />
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80" }} />
            </div>
          </div>

          {/* Metric cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.625rem", marginBottom: "1.25rem" }}>
            {METRICS.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.15 }}
                style={{
                  background: "#070b14",
                  border: `1px solid ${C.faint}`,
                  borderRadius: "8px",
                  padding: "0.75rem",
                }}
              >
                <div style={{ fontFamily: MONO, fontSize: "1.2rem", fontWeight: 700, color: metric.color }}>{metric.value}</div>
                <div style={{ fontSize: "0.65rem", color: C.muted, marginTop: "2px", fontFamily: FONT }}>{metric.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Bar chart section */}
          <div style={{ background: "#070b14", border: `1px solid ${C.faint}`, borderRadius: "8px", padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 600, color: C.muted, fontFamily: FONT }}>REVENUE PAR MOIS</span>
              <span style={{ fontFamily: MONO, fontSize: "0.7rem", color: C.violetLight }}>+31% YoY</span>
            </div>
            <BarChart />
          </div>

          {/* Bottom status bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80" }} />
              <span style={{ fontFamily: MONO, fontSize: "0.6rem", color: C.muted }}>180 sources actives · Mis à jour il y a 38s</span>
            </div>
            <span style={{ fontFamily: MONO, fontSize: "0.6rem", color: C.muted }}>99.5% uptime</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function PrismAnalyticsPage() {
  const { scrollY } = useScroll()
  const heroTextY = useTransform(scrollY, [0, 500], [0, -40])
  const dashY = useTransform(scrollY, [0, 500], [0, 20])

  const [activeTab, setActiveTab] = useState("dashboards")
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const activeTabData = TABS.find((t) => t.id === activeTab)!
  const activeTesti = TESTIMONIALS[testimonialIndex]

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT, overflowX: "hidden" }}>

      {/* ── 1. NAVBAR ──────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 clamp(1.5rem, 5vw, 4rem)",
          height: "72px",
          background: "rgba(7,11,20,0.88)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${C.violetBorder}`,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div style={{ width: "32px", height: "32px", background: `linear-gradient(135deg, ${C.violet}, ${C.violetLight})`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" fill="white" opacity="0.9"/>
              <path d="M8 5L11 7V10L8 12L5 10V7L8 5Z" fill={C.violet}/>
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em", color: C.text }}>Prism</span>
          <span style={{ fontWeight: 400, fontSize: "1.1rem", letterSpacing: "-0.02em", color: C.muted }}>Analytics</span>
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", gap: "2.25rem", alignItems: "center" }}>
          {NAV_LINKS.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`}
              style={{ color: C.muted, textDecoration: "none", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.text)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
              {link}
            </a>
          ))}
          <button onClick={() => document.getElementById("essai")?.scrollIntoView({behavior:"smooth"})}
            whileHover={{ scale: 1.04, boxShadow: `0 0 24px rgba(124,58,237,0.5)` }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: C.violet, color: "#fff",
              padding: "0.55rem 1.4rem", borderRadius: "8px",
              fontWeight: 700, fontSize: "0.875rem",
              textDecoration: "none", cursor: "pointer",
            }}
          >
            Essai gratuit 14j
          </button>
        </div>
      </motion.nav>

      {/* ── 2. HERO ────────────────────────────────────────────────────────── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: "72px", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 50% 60% at 70% 50%, rgba(124,58,237,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "10%", left: "5%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ display: "grid", gridTemplateColumns: "60fr 40fr", gap: "4rem", alignItems: "center", width: "100%", maxWidth: "1280px", margin: "0 auto", padding: "0 clamp(1.5rem, 5vw, 4rem)" }}>

          {/* LEFT */}
          <motion.div style={{ y: heroTextY }}>
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: C.violetMuted, border: `1px solid ${C.violetBorder}`, color: C.violetLight, padding: "0.3rem 0.9rem", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 600, marginBottom: "2rem" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                180+ connecteurs · Hébergement EU · RGPD certifié
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              style={{ margin: 0, fontWeight: 800, fontSize: "clamp(2.5rem, 5.5vw, 5rem)", letterSpacing: "-0.04em", lineHeight: 1.06 }}
            >
              <span style={{ display: "block", color: C.text }}>Vos Données.</span>
              <span style={{ display: "block", background: `linear-gradient(135deg, ${C.violet} 0%, ${C.violetLight} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Vos Décisions.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              style={{ color: C.muted, fontSize: "1.1rem", lineHeight: 1.75, marginTop: "1.75rem", maxWidth: "520px" }}
            >
              Prism centralise toutes vos sources de données en un seul tableau de bord intelligent. Marketing, finance, produit — vos équipes pilotent avec les mêmes chiffres, en temps réel.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              style={{ display: "flex", gap: "1rem", marginTop: "2.5rem", flexWrap: "wrap" }}
            >
              <button onClick={() => document.getElementById("essai")?.scrollIntoView({behavior:"smooth"})}
                whileHover={{ scale: 1.04, boxShadow: `0 0 40px rgba(124,58,237,0.5)` }}
                whileTap={{ scale: 0.97 }}
                style={{ display: "inline-block", background: C.violet, color: "#fff", padding: "1rem 2rem", borderRadius: "10px", fontWeight: 700, fontSize: "1rem", textDecoration: "none", cursor: "pointer" }}
              >
                Essayer 14 jours gratuitement
              </button>
              <button onClick={() => document.getElementById("connecteurs")?.scrollIntoView({behavior:"smooth"})}
                whileHover={{ borderColor: C.violet, color: C.violetLight }}
                style={{ display: "inline-block", border: `1px solid ${C.faint}`, color: C.muted, padding: "1rem 2rem", borderRadius: "10px", fontWeight: 600, fontSize: "1rem", textDecoration: "none", cursor: "pointer", transition: "border-color 0.2s, color 0.2s" }}
              >
                Voir les connecteurs
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{ display: "flex", alignItems: "center", gap: "2rem", marginTop: "2.5rem", flexWrap: "wrap" }}
            >
              {["Sans carte bancaire", "Annulation à tout moment", "Support inclus"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: C.muted, fontSize: "0.8rem" }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5L12 4" stroke={C.violetLight} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {item}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT: Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <DashboardMockup dashY={dashY} />
          </motion.div>
        </div>
      </section>

      {/* ── 3. STATS BAR ───────────────────────────────────────────────────── */}
      <section style={{ background: C.card, borderTop: `1px solid ${C.violetBorder}`, borderBottom: `1px solid ${C.violetBorder}`, padding: "4rem clamp(1.5rem, 5vw, 4rem)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem" }}>
          {STATS.map((stat) => (
            <StatCounter key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      {/* ── CONNECTOR LOGOS STRIP ──────────────────────────────────────────── */}
      <section id="connecteurs" style={{ padding: "3.5rem clamp(1.5rem, 5vw, 4rem)", overflow: "hidden" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ color: C.muted, fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "2rem" }}>
            Compatible avec vos outils existants
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
            {["Salesforce", "HubSpot", "Google Analytics 4", "Stripe", "Mixpanel", "BigQuery", "Shopify", "Meta Ads", "Snowflake", "PostgreSQL", "Amplitude", "Chargebee", "Pipedrive", "LinkedIn Ads", "QuickBooks"].map((tool) => (
              <div key={tool} style={{ background: C.card, border: `1px solid ${C.faint}`, borderRadius: "8px", padding: "0.5rem 1rem", fontSize: "0.8rem", fontWeight: 600, color: C.muted, fontFamily: MONO }}>
                {tool}
              </div>
            ))}
            <div style={{ background: C.violetMuted, border: `1px solid ${C.violetBorder}`, borderRadius: "8px", padding: "0.5rem 1rem", fontSize: "0.8rem", fontWeight: 600, color: C.violetLight, fontFamily: MONO }}>
              +165 autres →
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. FEATURES / TABS ─────────────────────────────────────────────── */}
      <section id="fonctionnalités" style={{ padding: "7rem clamp(1.5rem, 5vw, 4rem)", background: C.card, borderTop: `1px solid ${C.faint}` }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: "3.5rem" }}
          >
            <span style={{ color: C.violetLight, fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Ce que Prism fait pour vous</span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800, margin: "0.75rem 0 0", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Quatre modules. Un seul outil.
            </h2>
          </motion.div>

          {/* Tab Nav */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? C.violet : "transparent",
                  color: activeTab === tab.id ? "#fff" : C.muted,
                  border: `1px solid ${activeTab === tab.id ? C.violet : C.faint}`,
                  padding: "0.6rem 1.4rem",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  fontFamily: FONT,
                  transition: "all 0.2s",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              style={{
                background: C.bg,
                border: `1px solid ${C.violetBorder}`,
                borderRadius: "14px",
                padding: "2.5rem",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "3rem",
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ fontWeight: 800, fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)", margin: "0 0 1rem", letterSpacing: "-0.025em", color: C.text }}>{activeTabData.headline}</h3>
                <p style={{ color: C.muted, lineHeight: 1.78, fontSize: "0.975rem", margin: 0 }}>{activeTabData.content}</p>
              </div>
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  {activeTabData.items.map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.09 }}
                      style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem", background: C.card, border: `1px solid ${C.faint}`, borderRadius: "8px", padding: "0.875rem 1rem" }}
                    >
                      <div style={{ width: "20px", height: "20px", background: C.violetMuted, border: `1px solid ${C.violetBorder}`, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1px" }}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke={C.violetLight} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <span style={{ color: C.text, fontWeight: 500, fontSize: "0.9rem", lineHeight: 1.5 }}>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── 5. TESTIMONIALS ────────────────────────────────────────────────── */}
      <section style={{ padding: "7rem clamp(1.5rem, 5vw, 4rem)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: "-100px", top: "50%", transform: "translateY(-50%)", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: "3.5rem" }}
          >
            <span style={{ color: C.violetLight, fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Ils pilotent avec Prism</span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, margin: "0.75rem 0 0", letterSpacing: "-0.03em" }}>
              Paroles de directeurs
            </h2>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={testimonialIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              style={{
                background: C.card,
                border: `1px solid ${C.violetBorder}`,
                borderRadius: "14px",
                padding: "2.5rem",
                position: "relative",
              }}
            >
              <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem", fontFamily: MONO, fontSize: "4rem", color: C.violetMuted, lineHeight: 1, userSelect: "none" }}>"</div>
              <div style={{ fontSize: "clamp(1rem, 1.8vw, 1.2rem)", fontWeight: 400, lineHeight: 1.8, color: C.text, marginBottom: "2rem", fontStyle: "italic", position: "relative" }}>
                "{activeTesti.quote}"
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: `linear-gradient(135deg, ${C.violet}, ${C.violetLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.1rem", color: "#fff" }}>
                    {activeTesti.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{activeTesti.name}</div>
                    <div style={{ color: C.muted, fontSize: "0.8rem", marginTop: "2px" }}>{activeTesti.role}</div>
                  </div>
                </div>
                <div style={{ background: C.violetMuted, border: `1px solid ${C.violetBorder}`, padding: "0.4rem 0.9rem", borderRadius: "6px", fontSize: "0.75rem", color: C.muted, fontFamily: MONO }}>
                  {activeTesti.company}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginTop: "2rem" }}>
            <button
              onClick={() => setTestimonialIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              style={{ width: "40px", height: "40px", borderRadius: "50%", border: `1px solid ${C.violetBorder}`, background: "transparent", color: C.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT }}
            >
              ←
            </button>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  style={{ width: i === testimonialIndex ? "24px" : "8px", height: "8px", borderRadius: "4px", background: i === testimonialIndex ? C.violet : C.faint, border: "none", cursor: "pointer", transition: "all 0.3s" }}
                />
              ))}
            </div>
            <button
              onClick={() => setTestimonialIndex((i) => (i + 1) % TESTIMONIALS.length)}
              style={{ width: "40px", height: "40px", borderRadius: "50%", border: `1px solid ${C.violetBorder}`, background: "transparent", color: C.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT }}
            >
              →
            </button>
          </div>
        </div>
      </section>

      {/* ── 6. PRICING ─────────────────────────────────────────────────────── */}
      <section id="tarifs" style={{ background: C.card, padding: "7rem clamp(1.5rem, 5vw, 4rem)", borderTop: `1px solid ${C.faint}` }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: "4rem" }}
          >
            <span style={{ color: C.violetLight, fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Tarification</span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800, margin: "0.75rem 0 0", letterSpacing: "-0.03em" }}>
              Transparent. Prévisible. Scalable.
            </h2>
            <p style={{ color: C.muted, marginTop: "1rem", maxWidth: "480px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.7 }}>
              Aucun frais de setup, aucun engagement minimum. Commencez gratuitement, passez à l'abonnement quand vous êtes prêt.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", alignItems: "start" }}>
            {PRICING_TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                style={{
                  background: tier.highlighted ? `linear-gradient(180deg, rgba(124,58,237,0.2) 0%, ${C.bg} 100%)` : C.bg,
                  border: `1px solid ${tier.highlighted ? C.violet : C.faint}`,
                  borderRadius: "14px",
                  padding: "2.25rem",
                  position: "relative",
                  transform: tier.highlighted ? "scale(1.03)" : "scale(1)",
                  boxShadow: tier.highlighted ? `0 0 40px rgba(124,58,237,0.15)` : "none",
                }}
              >
                {tier.highlighted && (
                  <div style={{ position: "absolute", top: "-1px", left: "50%", transform: "translateX(-50%)", background: C.violet, color: "#fff", padding: "0.3rem 1.2rem", borderRadius: "0 0 8px 8px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    Le plus populaire
                  </div>
                )}

                <div style={{ color: C.muted, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem", fontFamily: MONO }}>{tier.tag}</div>
                <div style={{ fontWeight: 800, fontSize: "1.4rem", marginBottom: "1.25rem" }}>{tier.name}</div>

                <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "0.5rem" }}>
                  {tier.period ? (
                    <>
                      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: "2.5rem", color: tier.highlighted ? C.violetLight : C.text }}>{tier.price}€</span>
                      <span style={{ color: C.muted, fontSize: "0.85rem" }}>{tier.period}</span>
                    </>
                  ) : (
                    <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: "1.5rem", color: C.muted }}>{tier.price}</span>
                  )}
                </div>

                <p style={{ color: C.muted, fontSize: "0.85rem", lineHeight: 1.65, marginBottom: "1.75rem", minHeight: "60px" }}>{tier.description}</p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginBottom: "2rem" }}>
                  {tier.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem" }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}>
                        <circle cx="8" cy="8" r="7" fill={C.violetMuted} stroke={C.violetBorder}/>
                        <path d="M5 8L7 10L11 6" stroke={C.violetLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span style={{ fontSize: "0.875rem", color: C.text, lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: "100%",
                    padding: "0.9rem",
                    background: tier.highlighted ? C.violet : "transparent",
                    color: tier.highlighted ? "#fff" : C.violetLight,
                    border: `1px solid ${tier.highlighted ? C.violet : C.violetBorder}`,
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    fontFamily: FONT,
                    transition: "all 0.2s",
                  }}
                >
                  {tier.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ACCORDION ───────────────────────────────────────────────── */}
      <section id="faq" style={{ padding: "7rem clamp(1.5rem, 5vw, 4rem)" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: "3rem" }}
          >
            <span style={{ color: C.violetLight, fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Questions fréquentes</span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, margin: "0.75rem 0 0", letterSpacing: "-0.03em" }}>
              Tout ce que vous voulez savoir
            </h2>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                style={{
                  background: C.card,
                  border: `1px solid ${openFaq === i ? C.violetBorder : C.faint}`,
                  borderRadius: "10px",
                  overflow: "hidden",
                  transition: "border-color 0.25s",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%", padding: "1.35rem 1.5rem", background: "transparent", border: "none",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
                    color: C.text, fontWeight: 600, fontSize: "0.975rem", textAlign: "left", cursor: "pointer", fontFamily: FONT,
                  }}
                >
                  <span>{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ width: "24px", height: "24px", background: openFaq === i ? C.violetMuted : C.faint, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                  >
                    <span style={{ color: openFaq === i ? C.violetLight : C.muted, fontSize: "1.1rem", lineHeight: 1 }}>+</span>
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ padding: "0 1.5rem 1.5rem", color: C.muted, lineHeight: 1.78, fontSize: "0.925rem" }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. CTA BANNER ──────────────────────────────────────────────────── */}
      <section id="essai" style={{ padding: "7rem clamp(1.5rem, 5vw, 4rem)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(7,11,20,0) 60%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, border: "none", borderRadius: "0" }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            maxWidth: "860px",
            margin: "0 auto",
            textAlign: "center",
            background: C.card,
            border: `1px solid ${C.violetBorder}`,
            borderRadius: "20px",
            padding: "5rem clamp(2rem, 6vw, 5rem)",
            position: "relative",
            overflow: "hidden",
            boxShadow: `0 0 80px rgba(124,58,237,0.12)`,
          }}
        >
          <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "280px", height: "280px", background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ position: "relative" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: C.violetMuted, border: `1px solid ${C.violetBorder}`, color: C.violetLight, padding: "0.35rem 1rem", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 600, marginBottom: "1.75rem" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
              Aucune carte bancaire requise
            </div>

            <h2 style={{ fontWeight: 800, fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)", margin: "0 0 1.25rem", letterSpacing: "-0.035em", lineHeight: 1.1 }}>
              Essayer Prism <span style={{ background: `linear-gradient(135deg, ${C.violet}, ${C.violetLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>14 Jours</span> Gratuitement
            </h2>

            <p style={{ color: C.muted, fontSize: "1.05rem", lineHeight: 1.75, maxWidth: "520px", margin: "0 auto 2.5rem" }}>
              Connectez vos sources de données, créez votre premier dashboard et voyez la différence avant de vous engager. Aucun frais, aucune limite cachée pendant l'essai.
            </p>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <motion.a
                href="#"
                whileHover={{ scale: 1.05, boxShadow: `0 0 50px rgba(124,58,237,0.5)` }}
                whileTap={{ scale: 0.97 }}
                style={{ display: "inline-block", background: C.violet, color: "#fff", padding: "1.1rem 2.75rem", borderRadius: "10px", fontWeight: 700, fontSize: "1.05rem", textDecoration: "none", cursor: "pointer" }}
              >
                Démarrer l'essai gratuit →
              </button>
              <motion.a
                href="#"
                whileHover={{ borderColor: C.violet }}
                style={{ display: "inline-block", border: `1px solid ${C.faint}`, color: C.muted, padding: "1.1rem 2rem", borderRadius: "10px", fontWeight: 600, fontSize: "1.05rem", textDecoration: "none", cursor: "pointer", transition: "border-color 0.2s" }}
              >
                Demander une démo
              </button>
            </div>

            <div style={{ marginTop: "2rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
              {["Setup en 20 minutes", "Hébergement EU · RGPD", "Support 7j/7"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: C.muted, fontSize: "0.8rem" }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 6.5L4.5 9.5L11.5 3" stroke={C.violetLight} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── 9. FOOTER ──────────────────────────────────────────────────────── */}
      <footer style={{ background: "#04070f", borderTop: `1px solid ${C.violetBorder}`, padding: "4.5rem clamp(1.5rem, 5vw, 4rem) 2.5rem" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "3.5rem" }}>

            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.25rem" }}>
                <div style={{ width: "32px", height: "32px", background: `linear-gradient(135deg, ${C.violet}, ${C.violetLight})`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" fill="white" opacity="0.9"/>
                    <path d="M8 5L11 7V10L8 12L5 10V7L8 5Z" fill={C.violet}/>
                  </svg>
                </div>
                <span style={{ fontWeight: 800, fontSize: "1.1rem", color: C.text }}>Prism Analytics</span>
              </div>
              <p style={{ color: C.muted, fontSize: "0.875rem", lineHeight: 1.7, maxWidth: "280px", margin: "0 0 1.5rem" }}>
                L'intelligence data pour les directeurs marketing et finance qui veulent piloter, pas subir.
              </p>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {/* LinkedIn */}
                <a href="#" style={{ width: "36px", height: "36px", background: C.faint, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={C.muted}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                {/* MessageSquare/X */}
                <a href="#" style={{ width: "36px", height: "36px", background: C.faint, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={C.muted}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                {/* GitHub */}
                <a href="#" style={{ width: "36px", height: "36px", background: C.faint, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={C.muted}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                </a>
              </div>
            </div>

            {/* Produit */}
            <div>
              <div style={{ fontWeight: 700, marginBottom: "1.25rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.09em", color: C.text }}>Produit</div>
              {["Fonctionnalités", "Connecteurs", "Tarification", "Mises à jour", "Roadmap"].map((l) => (
                <a key={l} href="#" style={{ display: "block", color: C.muted, fontSize: "0.875rem", textDecoration: "none", marginBottom: "0.6rem", cursor: "pointer" }}>{l}</a>
              ))}
            </div>

            {/* Ressources */}
            <div>
              <div style={{ fontWeight: 700, marginBottom: "1.25rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.09em", color: C.text }}>Ressources</div>
              {["Documentation", "API Reference", "Tutoriels vidéo", "Blog data", "Cas clients"].map((l) => (
                <a key={l} href="#" style={{ display: "block", color: C.muted, fontSize: "0.875rem", textDecoration: "none", marginBottom: "0.6rem", cursor: "pointer" }}>{l}</a>
              ))}
            </div>

            {/* Entreprise */}
            <div>
              <div style={{ fontWeight: 700, marginBottom: "1.25rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.09em", color: C.text }}>Entreprise</div>
              {["À propos", "Équipe", "Sécurité", "RGPD", "Contact"].map((l) => (
                <a key={l} href="#" style={{ display: "block", color: C.muted, fontSize: "0.875rem", textDecoration: "none", marginBottom: "0.6rem", cursor: "pointer" }}>{l}</a>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: `1px solid ${C.faint}`, paddingTop: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <span style={{ color: C.muted, fontSize: "0.8rem" }}>© 2026 Prism Analytics SAS. Tous droits réservés.</span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: C.muted, fontSize: "0.75rem", fontFamily: MONO }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                99.5% uptime · Données hébergées EU
              </span>
            </div>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              {["Mentions légales", "CGU", "Confidentialité", "Cookies"].map((l) => (
                <a key={l} href="#" style={{ color: C.muted, fontSize: "0.78rem", textDecoration: "none", cursor: "pointer" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
