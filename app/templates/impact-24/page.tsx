"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"
import Link from "next/link"

const C = {
  bg: "#0a0a0a",
  card: "#111111",
  lime: "#b5ff00",
  limeMuted: "rgba(181,255,0,0.08)",
  limeBorder: "rgba(181,255,0,0.25)",
  text: "#ffffff",
  muted: "rgba(255,255,255,0.5)",
  faint: "rgba(255,255,255,0.07)",
}

const FONT = "system-ui, -apple-system, sans-serif"

// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["Programme", "Mentors", "Financement", "Alumni", "FAQ"]

const COHORT_CARDS = [
  { cohort: "Promo #7", sector: "BioTech / HealthTech", raised: "28M€ levés", name: "NeuroCure" },
  { cohort: "Promo #6", sector: "Climate Tech", raised: "41M€ levés", name: "CarbonLoop" },
  { cohort: "Promo #5", sector: "Deep Learning / SaaS", raised: "19M€ levés", name: "InferAI" },
  { cohort: "Promo #4", sector: "SpaceTech", raised: "62M€ levés", name: "OrbitSat" },
  { cohort: "Promo #3", sector: "FinTech / Crypto", raised: "15M€ levés", name: "LiquidStack" },
]

const STATS = [
  { value: 7, suffix: "", label: "Promotions accompagnées", prefix: "" },
  { value: 84, suffix: "", label: "Startups dans le programme", prefix: "" },
  { value: 340, suffix: "M€", label: "Levés post-programme", prefix: "" },
  { value: 78, suffix: "%", label: "Encore actives à 3 ans", prefix: "" },
]

const TABS = [
  {
    id: "programme",
    label: "Programme 6 mois",
    headline: "6 mois pour changer d'échelle",
    content:
      "Un programme intensif structuré en 3 phases : Validation produit & marché (mois 1–2), Construction de l'équipe & go-to-market (mois 3–4), Levée de fonds & scale (mois 5–6). Chaque phase inclut des ateliers hebdomadaires, des sessions 1:1 avec des experts sectoriels et des livrables concrets.",
    items: [
      "48 ateliers collectifs thématiques",
      "12 sessions de pitch coaching individuel",
      "Accès au lab R&D partenaire",
      "Desk dans notre campus à Paris 13e",
    ],
  },
  {
    id: "mentors",
    label: "Réseau de Mentors",
    headline: "150+ mentors actifs, 0 théoriciens",
    content:
      "Chaque startup est matchée avec 3 mentors issus de son secteur. Tous ont fondé, opéré ou investi dans des entreprises tech à succès. Pas de conférenciers : des praticiens qui répondent aux appels à 22h quand la merde frappe.",
    items: [
      "Mentors issus de 40+ secteurs deep tech",
      "Office hours hebdomadaires ouvertes",
      "Accès à vie post-programme",
      "Réseau de 600+ investisseurs partenaires",
    ],
  },
  {
    id: "financement",
    label: "Financement",
    headline: "Du capital, pas juste des conseils",
    content:
      "Nous investissons directement dans les meilleures équipes via notre véhicule d'investissement Zero Fund I (30M€ sous gestion). Au-delà de notre ticket, nous co-investissons avec notre réseau de 40 fonds partenaires pour accélérer vos tours.",
    items: [
      "Ticket initial de 100K€ à 200K€",
      "Suivi possible jusqu'en Série B",
      "Valorisations négociées avec fonds partenaires",
      "Bridge disponible entre les tours",
    ],
  },
  {
    id: "alumni",
    label: "Alumni & Communauté",
    headline: "84 startups. Un seul réseau.",
    content:
      "Les alumni Zero to One constituent un des réseaux deep tech les plus denses d'Europe. Introductions chaleureuses garanties, partage de deals et de talents, entraide opérationnelle 24/7 sur Slack.",
    items: [
      "Slack privé 600+ membres actifs",
      "Summit Alumni 2x par an",
      "Job board exclusif deep tech",
      "Accès programme partenaires (AWS, GCP, Azure…)",
    ],
  },
]

const TESTIMONIALS = [
  {
    name: "Chloé Martens",
    role: "CEO & Co-founder, NeuroCure",
    raised: "Série A — 28M€",
    quote:
      "Zero to One nous a appris une chose essentielle : la vitesse d'exécution est la seule vraie défense contre l'incertitude. En 6 mois nous avons obtenu notre marquage CE et signé 3 CHU. Sans ce programme, nous aurions mis 3 ans.",
  },
  {
    name: "Karim Ould",
    role: "CTO & Co-founder, CarbonLoop",
    raised: "Série B — 41M€",
    quote:
      "Le réseau de mentors est réel. Pas du name-dropping — de vraies personnes qui décrachent leur téléphone. Mon mentor m'a présenté notre lead investor un samedi matin. Ça ne s'improvise pas.",
  },
  {
    name: "Anaïs Lefebvre",
    role: "CEO, InferAI",
    raised: "Seed — 19M€",
    quote:
      "J'étais convaincue d'avoir un bon produit. Le programme m'a montré que j'avais en fait un excellent technologie mais un product-market fit flou. Cette distinction nous a sauvées. On a pivoté au mois 3, levé au mois 7.",
  },
  {
    name: "Thomas Varga",
    role: "Co-founder, OrbitSat",
    raised: "Série A — 62M€",
    quote:
      "Le plus dur dans le deep tech, c'est d'apprendre à parler aux investisseurs généralistes. Zero to One nous a formés à traduire la physique en business case. Notre deck est encore cité en exemple dans les LP meetings.",
  },
]

const PRICING_TIERS = [
  {
    name: "Pré-Seed",
    tag: "Idée + Équipe",
    price: "Gratuit",
    equity: "3% equity",
    description: "Pour les équipes avec une vision claire mais sans MVP. Vous apportez le talent, nous apportons tout le reste.",
    features: [
      "Accès programme complet 6 mois",
      "Desk au campus Paris 13e",
      "3 mentors dédiés",
      "Accès réseau investisseurs",
      "Aucun ticket d'entrée en cash",
    ],
    cta: "Candidater Pré-Seed",
    highlighted: false,
  },
  {
    name: "Seed",
    tag: "MVP validé",
    price: "100K€",
    equity: "8% equity",
    description: "Pour les équipes avec un MVP et des premiers signaux marché. Nous co-investissons dès l'entrée dans le programme.",
    features: [
      "Tout le niveau Pré-Seed",
      "Investissement direct 100K€",
      "Co-investissement fonds partenaires",
      "Introductions Série A préparées",
      "Support legal & corporate",
    ],
    cta: "Candidater Seed",
    highlighted: true,
  },
  {
    name: "Série A Ready",
    tag: "Revenus + traction prouvée",
    price: "200K€",
    equity: "6% equity",
    description: "Pour les startups avec revenus récurrents et traction démontrée cherchant à scale rapidement vers une Série A.",
    features: [
      "Tout le niveau Seed",
      "Investissement direct 200K€",
      "Accès Zero Fund bridging",
      "LP introductions directes (Tier 1 VCs)",
      "PR & media support inclus",
    ],
    cta: "Candidater Série A",
    highlighted: false,
  },
]

const FAQS = [
  {
    q: "À quel stade dois-je candidater ?",
    a: "Nous acceptons des équipes dès l'idée validée jusqu'aux startups avec revenus récurrents. Le programme s'adapte à votre stade via nos 3 tracks (Pré-Seed, Seed, Série A Ready). L'essentiel : une équipe forte, un problème réel, et la conviction de le résoudre.",
  },
  {
    q: "Quels secteurs sont prioritaires ?",
    a: "Nous sommes spécialisés deep tech au sens large : BioTech, HealthTech, Climate Tech, SpaceTech, IA industrielle, Matériaux avancés, Quantique, Cybersécurité. Nous n'acceptons pas les apps B2C grand public, les marketplaces classiques ou l'e-commerce.",
  },
  {
    q: "Le programme est-il possible en remote ?",
    a: "Partiellement. Les ateliers hebdomadaires sont hybrides (Paris + streaming), mais nous exigeons une présence physique minimum 2 semaines par mois au campus. Les sessions de pitch, demo days et rencontres investisseurs sont exclusivement en présentiel.",
  },
  {
    q: "Dois-je être basé en France pour candidater ?",
    a: "Non. Nous acceptons des équipes de toute l'Europe et de l'international. Cependant, l'entité juridique doit être domiciliée en France ou accepter de créer une filiale française avant l'entrée en programme (nous vous accompagnons sur ce point).",
  },
  {
    q: "Quand commence la prochaine promotion ?",
    a: "La Promotion #8 débute en septembre 2026. Les candidatures sont ouvertes jusqu'au 30 juin 2026. Les sélections finales (jury day) auront lieu mi-juillet. Nous acceptons 12 à 15 startups par promotion.",
  },
  {
    q: "Comment se passe la sélection ?",
    a: "4 étapes : dossier de candidature en ligne → entretien téléphonique (15 min) → pitch devant comité de présélection (30 min) → jury final avec investisseurs (60 min). Le taux de sélection est de 3,2% — exigeant, mais nous investissons réellement dans chaque équipe acceptée.",
  },
]

// ─── STAT COUNTER ────────────────────────────────────────────────────────────

function StatCounter({ value, suffix, prefix, label }: { value: number; suffix: string; prefix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const [display, setDisplay] = useState(0)

  if (inView && display === 0 && value > 0) {
    const duration = 1400
    const steps = 40
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplay(value)
        clearInterval(timer)
      } else {
        setDisplay(Math.floor(current))
      }
    }, duration / steps)
  }

  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{ fontFamily: FONT, fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, color: "#0a0a0a", lineHeight: 1 }}>
        {prefix}{display}{suffix}
      </div>
      <div style={{ fontFamily: FONT, fontSize: "0.95rem", fontWeight: 500, color: "rgba(0,0,0,0.6)", marginTop: "0.5rem", maxWidth: "140px", margin: "0.5rem auto 0" }}>
        {label}
      </div>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function ZeroToOnePage() {
  const { scrollY } = useScroll()
  const heroTextY = useTransform(scrollY, [0, 500], [0, -50])
  const timelineY = useTransform(scrollY, [0, 500], [0, -30])

  const [activeTab, setActiveTab] = useState("programme")
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

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
          background: "rgba(10,10,10,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${C.faint}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: "28px", height: "28px", background: C.lime, borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontWeight: 900, fontSize: "14px", color: "#0a0a0a" }}>Z1</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em" }}>Zero to One</span>
        </div>

        <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
          {NAV_LINKS.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} style={{ color: C.muted, textDecoration: "none", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.text)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
              {link}
            </a>
          ))}
          <motion.a
            href="#candidater"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: C.lime, color: "#0a0a0a", padding: "0.55rem 1.4rem",
              borderRadius: "6px", fontWeight: 700, fontSize: "0.875rem",
              textDecoration: "none", cursor: "pointer", display: "inline-block",
            }}
          >
            Candidater
          </motion.a>
        </div>
      </motion.nav>

      {/* ── 2. HERO ────────────────────────────────────────────────────────── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: "72px", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 30% 60%, rgba(181,255,0,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center", width: "100%", maxWidth: "1280px", margin: "0 auto", padding: "0 clamp(1.5rem, 5vw, 4rem)" }}>

          {/* LEFT: Heading */}
          <motion.div style={{ y: heroTextY }}>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <span style={{ display: "inline-block", background: C.limeMuted, border: `1px solid ${C.limeBorder}`, color: C.lime, padding: "0.3rem 0.9rem", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2rem" }}>
                Promo #8 — Candidatures ouvertes
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              style={{ margin: 0, lineHeight: 0.95, letterSpacing: "-0.03em" }}
            >
              <span style={{ display: "block", fontSize: "clamp(2.8rem, 6vw, 5.5rem)", fontWeight: 900, textTransform: "uppercase", color: C.text }}>DE L'IDÉE</span>
              <span style={{ display: "block", fontSize: "clamp(4rem, 9vw, 8rem)", fontWeight: 900, textTransform: "uppercase", color: C.lime, lineHeight: 1 }}>À</span>
              <span style={{ display: "block", fontSize: "clamp(2.8rem, 6vw, 5.5rem)", fontWeight: 900, textTransform: "uppercase", color: C.text }}>L'IMPACT</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              style={{ color: C.muted, fontSize: "1.1rem", lineHeight: 1.7, marginTop: "1.75rem", maxWidth: "480px" }}
            >
              L'accélérateur deep tech qui investit dans vos équipes, pas juste dans vos slides. 6 mois, un réseau réel, du capital, et 84 startups qui peuvent vous le confirmer.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              style={{ display: "flex", gap: "1rem", marginTop: "2.5rem", flexWrap: "wrap" }}
            >
              <motion.a
                href="#candidater"
                whileHover={{ scale: 1.04, boxShadow: `0 0 32px rgba(181,255,0,0.4)` }}
                whileTap={{ scale: 0.97 }}
                style={{ background: C.lime, color: "#0a0a0a", padding: "1rem 2rem", borderRadius: "8px", fontWeight: 800, fontSize: "1rem", textDecoration: "none", cursor: "pointer", display: "inline-block" }}
              >
                Candidater à la Promo #8
              </motion.a>
              <motion.a
                href="#programme"
                whileHover={{ borderColor: C.lime, color: C.lime }}
                style={{ border: `1px solid ${C.faint}`, color: C.muted, padding: "1rem 2rem", borderRadius: "8px", fontWeight: 600, fontSize: "1rem", textDecoration: "none", cursor: "pointer", display: "inline-block", transition: "border-color 0.2s, color 0.2s" }}
              >
                Voir le programme
              </motion.a>
            </motion.div>
          </motion.div>

          {/* RIGHT: Cohort Timeline */}
          <motion.div style={{ y: timelineY }}>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.35 }}
              style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}
            >
              <div style={{ color: C.muted, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                Nos dernières promotions
              </div>
              {COHORT_CARDS.map((card, i) => (
                <motion.div
                  key={card.name}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                  style={{
                    background: C.card,
                    border: `1px solid ${C.faint}`,
                    borderLeft: `3px solid ${C.lime}`,
                    borderRadius: "8px",
                    padding: "1rem 1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.25rem" }}>
                      <span style={{ fontWeight: 800, fontSize: "1rem" }}>{card.name}</span>
                      <span style={{ background: C.limeMuted, color: C.lime, padding: "0.15rem 0.5rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 700 }}>{card.cohort}</span>
                    </div>
                    <div style={{ color: C.muted, fontSize: "0.8rem" }}>{card.sector}</div>
                  </div>
                  <div style={{ color: C.lime, fontWeight: 800, fontSize: "0.9rem", whiteSpace: "nowrap" }}>{card.raised}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. STATS BAR ───────────────────────────────────────────────────── */}
      <section style={{ background: C.lime, padding: "4rem clamp(1.5rem, 5vw, 4rem)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem" }}>
          {STATS.map((stat) => (
            <StatCounter key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      {/* ── 4. FEATURES / TABS ─────────────────────────────────────────────── */}
      <section id="programme" style={{ padding: "7rem clamp(1.5rem, 5vw, 4rem)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: "3.5rem" }}
          >
            <span style={{ color: C.lime, fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Ce qu'on construit ensemble</span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 900, margin: "0.75rem 0 0", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Un programme. Quatre dimensions.
            </h2>
          </motion.div>

          {/* Tab Nav */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? C.lime : C.card,
                  color: activeTab === tab.id ? "#0a0a0a" : C.muted,
                  border: `1px solid ${activeTab === tab.id ? C.lime : C.faint}`,
                  padding: "0.6rem 1.4rem",
                  borderRadius: "6px",
                  fontWeight: 700,
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
              transition={{ duration: 0.35 }}
              style={{
                background: C.card,
                border: `1px solid ${C.faint}`,
                borderRadius: "12px",
                padding: "2.5rem",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "3rem",
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ fontWeight: 900, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", margin: "0 0 1rem", letterSpacing: "-0.02em" }}>{activeTabData.headline}</h3>
                <p style={{ color: C.muted, lineHeight: 1.75, fontSize: "1rem", margin: 0 }}>{activeTabData.content}</p>
              </div>
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  {activeTabData.items.map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem" }}
                    >
                      <div style={{ width: "20px", height: "20px", background: C.lime, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px" }}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <span style={{ color: C.text, fontWeight: 500, lineHeight: 1.5 }}>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── 5. TESTIMONIALS ────────────────────────────────────────────────── */}
      <section style={{ background: C.card, padding: "7rem clamp(1.5rem, 5vw, 4rem)", borderTop: `1px solid ${C.faint}`, borderBottom: `1px solid ${C.faint}` }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: "3.5rem" }}
          >
            <span style={{ color: C.lime, fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Ils l'ont vécu</span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, margin: "0.75rem 0 0", letterSpacing: "-0.03em" }}>
              Ce que disent nos fondateurs
            </h2>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={testimonialIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              style={{
                background: C.bg,
                border: `1px solid ${C.faint}`,
                borderLeft: `4px solid ${C.lime}`,
                borderRadius: "12px",
                padding: "2.5rem",
              }}
            >
              <div style={{ fontSize: "clamp(1.1rem, 2vw, 1.35rem)", fontWeight: 500, lineHeight: 1.75, color: C.text, fontStyle: "italic", marginBottom: "2rem" }}>
                "{activeTesti.quote}"
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "1rem" }}>{activeTesti.name}</div>
                  <div style={{ color: C.muted, fontSize: "0.875rem", marginTop: "0.2rem" }}>{activeTesti.role}</div>
                </div>
                <div style={{ background: C.limeMuted, border: `1px solid ${C.limeBorder}`, color: C.lime, padding: "0.4rem 1rem", borderRadius: "6px", fontWeight: 700, fontSize: "0.85rem" }}>
                  {activeTesti.raised}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginTop: "2rem" }}>
            <button
              onClick={() => setTestimonialIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              style={{ width: "40px", height: "40px", borderRadius: "50%", border: `1px solid ${C.faint}`, background: "transparent", color: C.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: "1rem" }}
            >
              ←
            </button>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  style={{ width: i === testimonialIndex ? "24px" : "8px", height: "8px", borderRadius: "4px", background: i === testimonialIndex ? C.lime : C.faint, border: "none", cursor: "pointer", transition: "all 0.3s" }}
                />
              ))}
            </div>
            <button
              onClick={() => setTestimonialIndex((i) => (i + 1) % TESTIMONIALS.length)}
              style={{ width: "40px", height: "40px", borderRadius: "50%", border: `1px solid ${C.faint}`, background: "transparent", color: C.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: "1rem" }}
            >
              →
            </button>
          </div>
        </div>
      </section>

      {/* ── 6. PRICING (Program Tiers) ─────────────────────────────────────── */}
      <section id="financement" style={{ padding: "7rem clamp(1.5rem, 5vw, 4rem)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: "4rem" }}
          >
            <span style={{ color: C.lime, fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Structure du programme</span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 900, margin: "0.75rem 0 0", letterSpacing: "-0.03em" }}>
              Trois tracks, un seul objectif
            </h2>
            <p style={{ color: C.muted, marginTop: "1rem", maxWidth: "500px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.7 }}>
              Nous investissons selon votre stade. Pas de frais cachés, pas d'engagements excessifs — juste du capital et de l'accompagnement.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {PRICING_TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                style={{
                  background: tier.highlighted ? C.lime : C.card,
                  border: tier.highlighted ? "none" : `1px solid ${C.faint}`,
                  borderRadius: "12px",
                  padding: "2.25rem",
                  position: "relative",
                  transform: tier.highlighted ? "scale(1.04)" : "scale(1)",
                }}
              >
                {tier.highlighted && (
                  <div style={{ position: "absolute", top: "-1px", left: "50%", transform: "translateX(-50%)", background: "#0a0a0a", color: C.lime, padding: "0.3rem 1.2rem", borderRadius: "0 0 8px 8px", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Le plus choisi
                  </div>
                )}
                <div style={{ color: tier.highlighted ? "rgba(0,0,0,0.6)" : C.muted, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{tier.tag}</div>
                <div style={{ fontWeight: 900, fontSize: "1.5rem", color: tier.highlighted ? "#0a0a0a" : C.text }}>{tier.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", margin: "1.25rem 0 0.25rem" }}>
                  <span style={{ fontWeight: 900, fontSize: "2.2rem", color: tier.highlighted ? "#0a0a0a" : C.lime }}>{tier.price}</span>
                </div>
                <div style={{ color: tier.highlighted ? "rgba(0,0,0,0.7)" : C.muted, fontSize: "0.85rem", fontWeight: 600, marginBottom: "1rem" }}>+ {tier.equity}</div>
                <p style={{ color: tier.highlighted ? "rgba(0,0,0,0.7)" : C.muted, fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1.75rem" }}>{tier.description}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
                  {tier.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                      <div style={{ width: "18px", height: "18px", background: tier.highlighted ? "#0a0a0a" : C.limeMuted, border: tier.highlighted ? "none" : `1px solid ${C.limeBorder}`, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px" }}>
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3 6L8 1" stroke={tier.highlighted ? C.lime : "#0a0a0a"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <span style={{ fontSize: "0.875rem", color: tier.highlighted ? "#0a0a0a" : C.text, fontWeight: 500 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: "100%",
                    padding: "0.9rem",
                    background: tier.highlighted ? "#0a0a0a" : C.lime,
                    color: tier.highlighted ? C.lime : "#0a0a0a",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    fontFamily: FONT,
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
      <section id="faq" style={{ background: C.card, padding: "7rem clamp(1.5rem, 5vw, 4rem)", borderTop: `1px solid ${C.faint}` }}>
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: "3rem" }}
          >
            <span style={{ color: C.lime, fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Questions fréquentes</span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, margin: "0.75rem 0 0", letterSpacing: "-0.03em" }}>
              Tout ce que vous voulez savoir
            </h2>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                style={{ background: C.bg, border: `1px solid ${openFaq === i ? C.limeBorder : C.faint}`, borderRadius: "10px", overflow: "hidden", transition: "border-color 0.2s" }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%", padding: "1.35rem 1.5rem", background: "transparent", border: "none",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
                    color: C.text, fontWeight: 700, fontSize: "1rem", textAlign: "left", cursor: "pointer", fontFamily: FONT,
                  }}
                >
                  <span>{faq.q}</span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ color: C.lime, fontSize: "1.5rem", lineHeight: 1, flexShrink: 0, fontWeight: 300 }}
                  >
                    +
                  </motion.span>
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
                      <div style={{ padding: "0 1.5rem 1.5rem", color: C.muted, lineHeight: 1.75, fontSize: "0.95rem" }}>
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
      <section id="candidater" style={{ padding: "7rem clamp(1.5rem, 5vw, 4rem)", background: C.lime, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "300px", height: "300px", background: "rgba(0,0,0,0.08)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-80px", left: "5%", width: "200px", height: "200px", background: "rgba(0,0,0,0.05)", borderRadius: "50%", pointerEvents: "none" }} />

        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div style={{ fontSize: "0.8rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(0,0,0,0.55)", marginBottom: "1.25rem" }}>
              Promo #8 — Septembre 2026
            </div>
            <h2 style={{ fontWeight: 900, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#0a0a0a", margin: "0 0 1.5rem", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
              Candidater à la<br />Prochaine Promotion
            </h2>
            <p style={{ color: "rgba(0,0,0,0.65)", fontSize: "1.1rem", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto 2.5rem" }}>
              Les candidatures pour la Promo #8 sont ouvertes jusqu'au 30 juin 2026. 12 à 15 startups sélectionnées. 3,2% de taux d'acceptation. Commencez maintenant.
            </p>
            <motion.a
              href="https://zerotoonlab.com/candidater"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}
              whileTap={{ scale: 0.97 }}
              style={{ display: "inline-block", background: "#0a0a0a", color: C.lime, padding: "1.1rem 2.75rem", borderRadius: "10px", fontWeight: 900, fontSize: "1.1rem", textDecoration: "none", cursor: "pointer" }}
            >
              Déposer ma candidature →
            </motion.a>
            <div style={{ marginTop: "1.5rem", color: "rgba(0,0,0,0.5)", fontSize: "0.85rem" }}>
              Résultats communiqués mi-juillet · Début programme septembre 2026
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 9. FOOTER ──────────────────────────────────────────────────────── */}
      <footer style={{ background: "#050505", borderTop: `1px solid ${C.faint}`, padding: "4rem clamp(1.5rem, 5vw, 4rem) 2.5rem" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "3rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
                <div style={{ width: "28px", height: "28px", background: C.lime, borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontWeight: 900, fontSize: "14px", color: "#0a0a0a" }}>Z1</span>
                </div>
                <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>Zero to One</span>
              </div>
              <p style={{ color: C.muted, fontSize: "0.875rem", lineHeight: 1.7, maxWidth: "280px", margin: "0 0 1.5rem" }}>
                L'accélérateur deep tech européen. 6 mois pour aller de l'idée à l'impact — avec du capital réel et des mentors qui ont fait le chemin.
              </p>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {/* LinkedIn */}
                <a href="#" style={{ width: "36px", height: "36px", background: C.faint, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={C.muted}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                {/* MessageSquare/X */}
                <a href="#" style={{ width: "36px", height: "36px", background: C.faint, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={C.muted}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                {/* YouTube */}
                <a href="#" style={{ width: "36px", height: "36px", background: C.faint, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={C.muted}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#050505"/></svg>
                </a>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: "1.25rem", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Programme</div>
              {["Comment ça marche", "Nos promotions", "Mentors", "Réseau alumni", "Deep tech lab"].map((l) => (
                <a key={l} href="#" style={{ display: "block", color: C.muted, fontSize: "0.875rem", textDecoration: "none", marginBottom: "0.6rem", cursor: "pointer" }}>{l}</a>
              ))}
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: "1.25rem", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Candidatures</div>
              {["Déposer un dossier", "Critères de sélection", "FAQ candidats", "Agenda des demos", "Partenaires investisseurs"].map((l) => (
                <a key={l} href="#" style={{ display: "block", color: C.muted, fontSize: "0.875rem", textDecoration: "none", marginBottom: "0.6rem", cursor: "pointer" }}>{l}</a>
              ))}
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: "1.25rem", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Entreprise</div>
              {["À propos", "Équipe", "Presse", "Blog", "Contact"].map((l) => (
                <a key={l} href="#" style={{ display: "block", color: C.muted, fontSize: "0.875rem", textDecoration: "none", marginBottom: "0.6rem", cursor: "pointer" }}>{l}</a>
              ))}
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${C.faint}`, paddingTop: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <span style={{ color: C.muted, fontSize: "0.8rem" }}>© 2026 Zero to One Accelerator SAS. Tous droits réservés.</span>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              {["Mentions légales", "CGU", "Politique de confidentialité"].map((l) => (
                <a key={l} href="#" style={{ color: C.muted, fontSize: "0.8rem", textDecoration: "none", cursor: "pointer" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
