"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"

const C = {
  bg: "#0a0f0a",
  card: "#0d1410",
  accent: "#00e5b8",
  text: "#e8f5f0",
  muted: "rgba(0,229,184,0.5)",
  border: "1px solid rgba(0,229,184,0.15)",
  borderAccent: "1px solid #00e5b8",
}

const FONT = '"JetBrains Mono", "Courier New", monospace'

// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["// projets", "// compétences", "// tarifs", "// faq", "// contact"]

const STATS = [
  { value: "7 ans", label: "d'expérience terrain" },
  { value: "60+", label: "projets livrés" },
  { value: "98%", label: "clients satisfaits" },
  { value: "4", label: "stacks maîtrisées" },
]

const SKILLS = [
  { name: "React / Next.js", level: 97 },
  { name: "Node.js / Express", level: 93 },
  { name: "TypeScript", level: 95 },
  { name: "Python / FastAPI", level: 85 },
  { name: "LLM Integration / RAG", level: 88 },
  { name: "PostgreSQL / Prisma", level: 90 },
  { name: "Docker / CI-CD", level: 82 },
  { name: "AWS / GCP", level: 78 },
]

const TABS = [
  {
    id: "frontend",
    label: "Frontend & React",
    heading: "// INTERFACES RÉACTIVES",
    body: "React 19, Next.js 15 App Router, Server Components, Suspense, TanStack Query. Je construis des interfaces qui chargent vite, qui ne crashent pas et qui restent maintenables un an après la livraison. Accessibilité WCAG AA, Core Web Vitals optimisés, animations Framer Motion.",
    tags: ["React 19", "Next.js 15", "TypeScript", "Framer Motion", "TanStack Query", "Zustand"],
    badge: "FRONTEND",
  },
  {
    id: "backend",
    label: "Backend & API",
    heading: "// APIs QUI TIENNENT",
    body: "Node.js avec Express ou NestJS selon le contexte. API REST et GraphQL, authentication JWT/OAuth, validation stricte des entrées, tests d'intégration, documentation OpenAPI auto-générée. Je pense à la prod dès le premier commit.",
    tags: ["Node.js", "NestJS", "PostgreSQL", "Prisma", "Redis", "OpenAPI"],
    badge: "BACKEND",
  },
  {
    id: "ia",
    label: "IA & LLM",
    heading: "// INTELLIGENCE INTÉGRÉE",
    body: "Intégration LLM production avec Anthropic Claude, OpenAI GPT-4o, Mistral. RAG sur base vectorielle (pgvector, Pinecone), agents autonomes, function calling, fine-tuning léger. Pas de démo YouTube — du code qui tourne en prod.",
    tags: ["Claude API", "OpenAI", "RAG", "pgvector", "LangChain", "Agents"],
    badge: "IA",
  },
  {
    id: "devops",
    label: "DevOps & Cloud",
    heading: "// DÉPLOIEMENT SANS STRESS",
    body: "Docker, GitHub Actions, Vercel, Render, AWS (EC2, S3, CloudFront, RDS). Monitoring avec Sentry et Datadog. Je configure les pipelines CI/CD, les alertes, et je m'assure que votre app reste en ligne quand ça compte.",
    tags: ["Docker", "GitHub Actions", "AWS", "Vercel", "Render", "Sentry"],
    badge: "DEVOPS",
  },
]

const TESTIMONIALS = [
  {
    quote: "Alex a livré notre MVP en 11 jours au lieu des 3 semaines estimées. Le code était propre, testé, et documenté. On a pu l'embarquer dans notre équipe sans refactoriser quoi que ce soit.",
    author: "JULIEN FERRACCI",
    role: "CTO — STARTUPFLOW",
    stack: "Next.js + Node + Stripe",
  },
  {
    quote: "On cherchait quelqu'un qui comprend à la fois le produit et la technique. Alex posait les bonnes questions avant de coder. Le résultat correspondait exactement à ce qu'on avait en tête — et souvent en mieux.",
    author: "MARIE-LAURE COHEN",
    role: "CPO — HELIOX AI",
    stack: "React + FastAPI + RAG",
  },
  {
    quote: "Notre agent IA interne a été conçu et livré en 3 semaines. Il tourne en prod depuis 8 mois sans intervention. Je recommande Alex sans réserve pour toute mission fullstack avec une composante IA.",
    author: "THOMAS GAYET",
    role: "CTO — NEXUM ANALYTICS",
    stack: "Claude API + PostgreSQL",
  },
  {
    quote: "Rare de trouver un développeur freelance qui délivre de la qualité au niveau d'une équipe senior. Alex comprend les enjeux business, communique de manière proactive et ne disparaît pas une fois le virement reçu.",
    author: "SARAH BLANCHARD",
    role: "PRODUCT MANAGER — SIDECAR LABS",
    stack: "NestJS + React + AWS",
  },
]

const PROJECTS = [
  {
    name: "HELIOX RAG ENGINE",
    description: "Moteur de recherche sémantique sur 2M de documents légaux. RAG avec pgvector + Claude, temps de réponse < 800ms.",
    stack: ["Next.js", "FastAPI", "pgvector", "Claude API"],
    year: "2025",
    type: "IA / FULLSTACK",
  },
  {
    name: "SIDECAR ANALYTICS",
    description: "Dashboard temps réel pour une startup SaaS B2B. WebSocket, graphiques D3, permissions granulaires par rôle.",
    stack: ["React", "NestJS", "PostgreSQL", "Redis"],
    year: "2024",
    type: "FULLSTACK",
  },
  {
    name: "NEXUM AGENT",
    description: "Agent IA autonome pour analyse de données financières. Function calling, mémoire persistante, audit trail complet.",
    stack: ["Claude API", "Node.js", "Prisma", "Docker"],
    year: "2025",
    type: "IA AGENTS",
  },
  {
    name: "STARTUPFLOW MVP",
    description: "MVP SaaS complet en 11 jours. Auth, billing Stripe, onboarding, email transactionnel, dashboard admin.",
    stack: ["Next.js", "Stripe", "Resend", "Vercel"],
    year: "2024",
    type: "MVP / SAAS",
  },
]

const PRICING = [
  {
    name: "JOURNÉE",
    price: "750€",
    sub: "par jour — flexible",
    features: [
      "Facturation à la journée",
      "Rapport d'avancement quotidien",
      "Code reviewé et documenté",
      "Git propre, PR commentées",
    ],
    cta: "> réserver une journée",
    highlighted: false,
  },
  {
    name: "SPRINT 2 SEMAINES",
    price: "6 500€",
    sub: "feature complète livrée",
    features: [
      "Périmètre défini ensemble",
      "Daily async (Loom ou écrit)",
      "Tests unitaires inclus",
      "Déploiement inclus",
      "1 semaine de support post-livraison",
    ],
    cta: "> démarrer un sprint",
    highlighted: true,
  },
  {
    name: "MISSION LONGUE",
    price: "500€/j",
    sub: "réduction 33% dès 3 mois",
    features: [
      "Engagement minimum 3 mois",
      "Intégration équipe existante",
      "Code reviews de l'équipe",
      "Disponibilité 4j/semaine",
      "Point hebdomadaire en visio",
      "Priorité calendrier garantie",
    ],
    cta: "> discuter de la mission",
    highlighted: false,
  },
]

const FAQS = [
  {
    q: "// Disponible quand?",
    a: "Ma prochaine disponibilité est en juin 2026 pour de nouvelles missions. Pour un sprint court (2 semaines), il peut y avoir des créneaux plus tôt selon le planning en cours. Contactez-moi pour vérifier — je réponds sous 24h en semaine.",
  },
  {
    q: "// Remote only?",
    a: "Je travaille en full remote depuis Bordeaux. Je me déplace occasionnellement pour des ateliers de cadrage ou des présentations importantes — à facturer en plus. Mes clients sont principalement à Paris, Londres, et quelques startups à Montréal.",
  },
  {
    q: "// Stack imposée par le client?",
    a: "Oui, je m'adapte. Si votre projet tourne sur une stack que je ne maîtrise pas parfaitement, je le dis clairement plutôt que de sous-estimer. En pratique, React/Next + Node/Python + PostgreSQL couvre 90% des demandes. Pour des stacks exotiques, on en parle.",
  },
  {
    q: "// NDA et confidentialité?",
    a: "Je signe systématiquement les NDA standards. Le code produit en mission vous appartient intégralement — pas de clause de récupération, pas de code réutilisé sur d'autres projets. Les projets que je montre dans mon portfolio sont toujours validés explicitement par le client.",
  },
  {
    q: "// Comment se passe la facturation?",
    a: "En micro-entreprise, TVA non applicable. Pour les sprints : 30% à la commande, 70% à la livraison. Pour les missions longues : facturation mensuelle à 30 jours. Je fournis un compte-rendu détaillé des jours travaillés avec chaque facture.",
  },
  {
    q: "// Un projet urgent, c'est possible?",
    a: "Selon le planning. Si c'est vraiment urgent (< 1 semaine), je peux parfois réorganiser si la fenêtre existe. Il y a une majoration de 25% pour les missions avec préavis < 72h. Ce n'est pas du tout automatique — contactez-moi d'abord.",
  },
]

// ─── TYPING ANIMATION ──────────────────────────────────────────────────────

function TypingLine({
  text,
  delay = 0,
  onDone,
}: {
  text: string
  delay?: number
  onDone?: () => void
}) {
  const [displayed, setDisplayed] = useState("")
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  useEffect(() => {
    if (!started) return
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        onDone?.()
      }
    }, 28)
    return () => clearInterval(interval)
  }, [started, text, onDone])

  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: "clamp(14px, 1.6vw, 18px)",
        color: C.text,
        lineHeight: 1.8,
        minHeight: "1.8em",
      }}
    >
      <span style={{ color: C.accent, marginRight: "8px" }}>{">"}</span>
      {displayed}
      {displayed.length < text.length && started && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          style={{ color: C.accent }}
        >
          █
        </motion.span>
      )}
    </div>
  )
}

// ─── SKILL BAR ─────────────────────────────────────────────────────────────

function SkillBar({ name, level }: { name: string; level: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <div ref={ref} style={{ marginBottom: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <span
          style={{
            fontFamily: FONT,
            fontSize: "12px",
            color: C.text,
            letterSpacing: "1px",
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontFamily: FONT,
            fontSize: "12px",
            color: C.muted,
          }}
        >
          {level}%
        </span>
      </div>
      <div
        style={{
          height: "4px",
          background: "rgba(0,229,184,0.1)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          style={{
            height: "100%",
            background: C.accent,
            borderRadius: "2px",
          }}
        />
      </div>
    </div>
  )
}

// ─── STAT ITEM ─────────────────────────────────────────────────────────────

function StatItem({ value, label }: { value: string; label: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      style={{
        textAlign: "center",
        padding: "40px 20px",
        borderRight: "1px solid rgba(0,229,184,0.1)",
        flex: 1,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: "clamp(36px, 5vw, 56px)",
          color: C.accent,
          fontWeight: 700,
          lineHeight: 1,
          marginBottom: "12px",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: "11px",
          color: C.muted,
          letterSpacing: "1px",
        }}
      >
        {label}
      </div>
    </motion.div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function GlitchDevPage() {
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, -30])

  const [activeTab, setActiveTab] = useState(0)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [direction, setDirection] = useState(1)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [line2Done, setLine2Done] = useState(false)
  const [line3Done, setLine3Done] = useState(false)

  function goTestimonial(idx: number) {
    setDirection(idx > activeTestimonial ? 1 : -1)
    setActiveTestimonial(idx)
  }
  function prevTestimonial() {
    const next = (activeTestimonial - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
    setDirection(-1)
    setActiveTestimonial(next)
  }
  function nextTestimonial() {
    const next = (activeTestimonial + 1) % TESTIMONIALS.length
    setDirection(1)
    setActiveTestimonial(next)
  }

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT, overflowX: "hidden" }}>

      {/* ── 1. NAVBAR ──────────────────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(10,15,10,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0,229,184,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          height: "60px",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: "16px",
            color: C.accent,
            letterSpacing: "1px",
          }}
        >
          glitch<span style={{ color: C.muted }}>.</span>dev
        </div>
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link}
              href="#"
              style={{
                fontFamily: FONT,
                fontSize: "12px",
                color: C.muted,
                textDecoration: "none",
                cursor: "pointer",
                transition: "color 0.2s",
              }}
            >
              {link}
            </Link>
          ))}
          <motion.button
            whileHover={{ background: C.accent, color: C.bg }}
            transition={{ duration: 0.15 }}
            style={{
              fontFamily: FONT,
              fontSize: "12px",
              padding: "8px 20px",
              border: `1px solid ${C.accent}`,
              background: "transparent",
              color: C.accent,
              cursor: "pointer",
              letterSpacing: "1px",
            }}
          >
            {">"} contact
          </motion.button>
        </div>
      </nav>

      {/* ── 2. HERO ────────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          background: C.bg,
          paddingTop: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 40px 80px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "900px" }}>
          <motion.div style={{ y: heroY }}>
            {/* Terminal window */}
            <div
              style={{
                background: C.card,
                border: "1px solid rgba(0,229,184,0.18)",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 0 60px rgba(0,229,184,0.06)",
              }}
            >
              {/* Terminal titlebar */}
              <div
                style={{
                  background: "#111a11",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  borderBottom: "1px solid rgba(0,229,184,0.1)",
                }}
              >
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff5f57" }} />
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ffbd2e" }} />
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#28c840" }} />
                <span
                  style={{
                    fontFamily: FONT,
                    fontSize: "12px",
                    color: "rgba(0,229,184,0.3)",
                    marginLeft: "12px",
                  }}
                >
                  alex@glitch.dev ~ portfolio
                </span>
              </div>

              {/* Terminal body */}
              <div style={{ padding: "36px 40px", minHeight: "240px" }}>
                <TypingLine text="Bonjour, je suis Alex Martin." delay={300} onDone={() => setLine2Done(true)} />
                {line2Done && (
                  <TypingLine
                    text="Développeur Fullstack & Ingénieur IA."
                    delay={100}
                    onDone={() => setLine3Done(true)}
                  />
                )}
                {line3Done && (
                  <TypingLine text="Disponible pour missions freelance." delay={100} />
                )}
                {line3Done && (
                  <div style={{ marginTop: "8px", display: "flex", alignItems: "center" }}>
                    <span style={{ color: C.accent, marginRight: "8px" }}>{">"}</span>
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      style={{ color: C.accent, fontFamily: FONT }}
                    >
                      █
                    </motion.span>
                  </div>
                )}
              </div>
            </div>

            {/* Tech stack pills */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "32px",
                flexWrap: "wrap",
              }}
            >
              {["React · Next.js", "Node.js · Python", "IA · LLM · RAG"].map((pill) => (
                <div
                  key={pill}
                  style={{
                    fontFamily: FONT,
                    fontSize: "12px",
                    color: C.accent,
                    padding: "8px 20px",
                    border: `1px solid rgba(0,229,184,0.3)`,
                    background: "rgba(0,229,184,0.04)",
                    borderRadius: "2px",
                    letterSpacing: "1px",
                  }}
                >
                  {pill}
                </div>
              ))}
            </div>

            {/* CTA below terminal */}
            <div style={{ display: "flex", gap: "16px", marginTop: "40px" }}>
              <motion.a
                href="#projets"
                whileHover={{ background: C.accent, color: C.bg }}
                transition={{ duration: 0.15 }}
                style={{
                  fontFamily: FONT,
                  fontSize: "13px",
                  color: C.accent,
                  padding: "14px 32px",
                  border: `1px solid ${C.accent}`,
                  background: "transparent",
                  textDecoration: "none",
                  display: "inline-block",
                  cursor: "pointer",
                  letterSpacing: "1px",
                }}
              >
                {">"} voir mes projets
              </motion.a>
              <motion.a
                href="mailto:alex@glitch.dev"
                whileHover={{ color: C.accent }}
                transition={{ duration: 0.15 }}
                style={{
                  fontFamily: FONT,
                  fontSize: "13px",
                  color: C.muted,
                  padding: "14px 32px",
                  border: `1px solid rgba(0,229,184,0.15)`,
                  background: "transparent",
                  textDecoration: "none",
                  display: "inline-block",
                  cursor: "pointer",
                  letterSpacing: "1px",
                }}
              >
                {">"} discuter d'une mission
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. STATS ───────────────────────────────────────────────────────── */}
      <section
        style={{
          background: C.card,
          borderTop: "1px solid rgba(0,229,184,0.1)",
          borderBottom: "1px solid rgba(0,229,184,0.1)",
        }}
      >
        <div style={{ display: "flex" }}>
          {STATS.map((s, i) => (
            <div
              key={s.label}
              style={{
                flex: 1,
                borderRight: i < STATS.length - 1 ? "1px solid rgba(0,229,184,0.1)" : "none",
              }}
            >
              <StatItem value={s.value} label={s.label} />
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. FEATURES / TABS ─────────────────────────────────────────────── */}
      <section style={{ background: C.bg, padding: "100px 40px" }} id="projets">
        <div style={{ marginBottom: "8px" }}>
          <span style={{ fontFamily: FONT, fontSize: "11px", color: C.muted }}>
            compétences techniques
          </span>
        </div>
        <h2
          style={{
            fontFamily: FONT,
            fontSize: "clamp(28px, 4vw, 48px)",
            color: C.accent,
            marginBottom: "16px",
            letterSpacing: "-1px",
          }}
        >
          // COMPÉTENCES
        </h2>
        <div
          style={{
            fontFamily: FONT,
            fontSize: "14px",
            color: C.muted,
            marginBottom: "56px",
          }}
        >
          4 domaines, 1 développeur. Pas de généraliste vague — des choix de stack assumés.
        </div>

        {/* Skill bars first */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 80px", marginBottom: "80px" }}>
          {SKILLS.map((skill) => (
            <SkillBar key={skill.name} name={skill.name} level={skill.level} />
          ))}
        </div>

        {/* Tab header */}
        <h3
          style={{
            fontFamily: FONT,
            fontSize: "clamp(22px, 3vw, 36px)",
            color: C.accent,
            marginBottom: "32px",
          }}
        >
          // PROJETS PAR DOMAINE
        </h3>

        {/* Tab labels */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid rgba(0,229,184,0.15)",
            marginBottom: "0",
            overflowX: "auto",
            gap: "0",
          }}
        >
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(i)}
              style={{
                fontFamily: FONT,
                fontSize: "12px",
                padding: "16px 28px",
                border: "none",
                borderBottom: activeTab === i ? `2px solid ${C.accent}` : "2px solid transparent",
                background: "transparent",
                color: activeTab === i ? C.accent : C.muted,
                cursor: "pointer",
                whiteSpace: "nowrap",
                marginBottom: "-1px",
                letterSpacing: "1px",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div
          style={{
            background: C.card,
            border: "1px solid rgba(0,229,184,0.12)",
            borderTop: "none",
            minHeight: "300px",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              style={{ padding: "40px" }}
            >
              <div style={{ display: "flex", gap: "60px" }}>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "inline-block",
                      fontFamily: FONT,
                      fontSize: "10px",
                      color: C.bg,
                      background: C.accent,
                      padding: "3px 10px",
                      marginBottom: "20px",
                      letterSpacing: "2px",
                    }}
                  >
                    {TABS[activeTab].badge}
                  </div>
                  <h3
                    style={{
                      fontFamily: FONT,
                      fontSize: "clamp(18px, 2.5vw, 28px)",
                      color: C.accent,
                      marginBottom: "16px",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {TABS[activeTab].heading}
                  </h3>
                  <p
                    style={{
                      fontFamily: FONT,
                      fontSize: "14px",
                      color: C.text,
                      lineHeight: 1.8,
                      marginBottom: "28px",
                    }}
                  >
                    {TABS[activeTab].body}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {TABS[activeTab].tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontFamily: FONT,
                          fontSize: "11px",
                          padding: "4px 12px",
                          border: "1px solid rgba(0,229,184,0.2)",
                          color: C.muted,
                          borderRadius: "2px",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Featured projects grid */}
        <div style={{ marginTop: "60px" }}>
          <h3
            style={{
              fontFamily: FONT,
              fontSize: "clamp(22px, 3vw, 36px)",
              color: C.accent,
              marginBottom: "32px",
            }}
          >
            // PROJETS RÉCENTS
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "rgba(0,229,184,0.1)" }}>
            {PROJECTS.map((project) => (
              <motion.div
                key={project.name}
                whileHover={{ background: "#111a11" }}
                transition={{ duration: 0.2 }}
                style={{
                  background: C.card,
                  padding: "36px",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                  <span
                    style={{
                      fontFamily: FONT,
                      fontSize: "10px",
                      color: C.accent,
                      background: "rgba(0,229,184,0.08)",
                      padding: "3px 10px",
                      borderRadius: "2px",
                      letterSpacing: "2px",
                    }}
                  >
                    {project.type}
                  </span>
                  <span style={{ fontFamily: FONT, fontSize: "11px", color: C.muted }}>
                    {project.year}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: "16px",
                    color: C.text,
                    fontWeight: 700,
                    marginBottom: "12px",
                    letterSpacing: "1px",
                  }}
                >
                  {project.name}
                </div>
                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: "13px",
                    color: C.muted,
                    lineHeight: 1.7,
                    marginBottom: "20px",
                  }}
                >
                  {project.description}
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      style={{
                        fontFamily: FONT,
                        fontSize: "11px",
                        color: "rgba(0,229,184,0.4)",
                        border: "1px solid rgba(0,229,184,0.12)",
                        padding: "2px 8px",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. TESTIMONIALS ────────────────────────────────────────────────── */}
      <section
        style={{
          background: C.card,
          padding: "100px 40px",
          borderTop: "1px solid rgba(0,229,184,0.1)",
        }}
      >
        <div style={{ marginBottom: "8px" }}>
          <span style={{ fontFamily: FONT, fontSize: "11px", color: C.muted }}>
            ils ont fait confiance
          </span>
        </div>
        <h2
          style={{
            fontFamily: FONT,
            fontSize: "clamp(28px, 4vw, 48px)",
            color: C.accent,
            marginBottom: "56px",
          }}
        >
          // TÉMOIGNAGES
        </h2>

        <div style={{ position: "relative" }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeTestimonial}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.4 }}
              style={{
                background: C.bg,
                border: "1px solid rgba(0,229,184,0.15)",
                padding: "48px 52px",
              }}
            >
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: "clamp(14px, 1.8vw, 20px)",
                  color: C.text,
                  lineHeight: 1.75,
                  marginBottom: "40px",
                }}
              >
                <span style={{ color: C.accent, fontSize: "1.4em", marginRight: "4px" }}>"</span>
                {TESTIMONIALS[activeTestimonial].quote}
                <span style={{ color: C.accent, fontSize: "1.4em", marginLeft: "4px" }}>"</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "rgba(0,229,184,0.12)",
                      border: `1px solid ${C.accent}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontFamily: FONT, fontSize: "16px", color: C.accent }}>{">"}</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: FONT, fontSize: "13px", color: C.accent, letterSpacing: "1px" }}>
                      {TESTIMONIALS[activeTestimonial].author}
                    </div>
                    <div style={{ fontFamily: FONT, fontSize: "11px", color: C.muted, marginTop: "4px" }}>
                      {TESTIMONIALS[activeTestimonial].role}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: "11px",
                    color: "rgba(0,229,184,0.25)",
                    border: "1px solid rgba(0,229,184,0.1)",
                    padding: "4px 12px",
                  }}
                >
                  {TESTIMONIALS[activeTestimonial].stack}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "24px",
            }}
          >
            <div style={{ display: "flex", gap: "8px" }}>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTestimonial(i)}
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: i === activeTestimonial ? C.accent : "rgba(0,229,184,0.2)",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    transition: "background 0.3s",
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: "0" }}>
              <motion.button
                whileHover={{ background: C.accent, color: C.bg }}
                transition={{ duration: 0.15 }}
                onClick={prevTestimonial}
                style={{
                  fontFamily: FONT,
                  fontSize: "14px",
                  padding: "10px 20px",
                  border: "1px solid rgba(0,229,184,0.2)",
                  background: "transparent",
                  color: C.accent,
                  cursor: "pointer",
                }}
              >
                ←
              </motion.button>
              <motion.button
                whileHover={{ background: C.accent, color: C.bg }}
                transition={{ duration: 0.15 }}
                onClick={nextTestimonial}
                style={{
                  fontFamily: FONT,
                  fontSize: "14px",
                  padding: "10px 20px",
                  border: "1px solid rgba(0,229,184,0.2)",
                  borderLeft: "none",
                  background: "transparent",
                  color: C.accent,
                  cursor: "pointer",
                }}
              >
                →
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. PRICING ─────────────────────────────────────────────────────── */}
      <section
        style={{
          background: C.bg,
          padding: "100px 40px",
          borderTop: "1px solid rgba(0,229,184,0.1)",
        }}
        id="tarifs"
      >
        <div style={{ marginBottom: "8px" }}>
          <span style={{ fontFamily: FONT, fontSize: "11px", color: C.muted }}>
            transparence totale
          </span>
        </div>
        <h2
          style={{
            fontFamily: FONT,
            fontSize: "clamp(28px, 4vw, 48px)",
            color: C.accent,
            marginBottom: "16px",
          }}
        >
          // TARIFS
        </h2>
        <div
          style={{
            fontFamily: FONT,
            fontSize: "14px",
            color: C.muted,
            marginBottom: "56px",
          }}
        >
          Pas de grille tarifaire cachée. Pas de surprises en fin de mission.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: "rgba(0,229,184,0.08)" }}>
          {PRICING.map((tier) => (
            <motion.div
              key={tier.name}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              style={{
                background: tier.highlighted ? "rgba(0,229,184,0.06)" : C.card,
                padding: "40px 36px",
                position: "relative",
                border: tier.highlighted ? `1px solid rgba(0,229,184,0.35)` : "none",
              }}
            >
              {tier.highlighted && (
                <div
                  style={{
                    position: "absolute",
                    top: "-1px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontFamily: FONT,
                    fontSize: "9px",
                    color: C.bg,
                    background: C.accent,
                    padding: "4px 16px",
                    letterSpacing: "2px",
                  }}
                >
                  RECOMMANDÉ
                </div>
              )}
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: "11px",
                  color: C.muted,
                  letterSpacing: "3px",
                  marginBottom: "20px",
                  marginTop: tier.highlighted ? "16px" : "0",
                }}
              >
                {tier.name}
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: "clamp(28px, 3.5vw, 44px)",
                  color: tier.highlighted ? C.accent : C.text,
                  fontWeight: 700,
                  lineHeight: 1,
                  marginBottom: "8px",
                }}
              >
                {tier.price}
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: "12px",
                  color: "rgba(0,229,184,0.35)",
                  marginBottom: "32px",
                }}
              >
                {tier.sub}
              </div>
              <div
                style={{
                  borderTop: "1px solid rgba(0,229,184,0.1)",
                  paddingTop: "24px",
                  marginBottom: "32px",
                }}
              >
                {tier.features.map((f) => (
                  <div
                    key={f}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <span style={{ fontFamily: FONT, fontSize: "12px", color: C.accent, flexShrink: 0 }}>
                      ✓
                    </span>
                    <span style={{ fontFamily: FONT, fontSize: "12px", color: C.text, lineHeight: 1.5 }}>
                      {f}
                    </span>
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{
                  background: tier.highlighted ? C.accent : "rgba(0,229,184,0.08)",
                  color: tier.highlighted ? C.bg : C.accent,
                }}
                transition={{ duration: 0.15 }}
                style={{
                  fontFamily: FONT,
                  fontSize: "12px",
                  padding: "14px 24px",
                  border: tier.highlighted ? `1px solid ${C.accent}` : "1px solid rgba(0,229,184,0.2)",
                  background: "transparent",
                  color: tier.highlighted ? C.accent : C.muted,
                  cursor: "pointer",
                  width: "100%",
                  letterSpacing: "1px",
                  textAlign: "left",
                }}
              >
                {tier.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 7. FAQ ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: C.card,
          padding: "100px 40px",
          borderTop: "1px solid rgba(0,229,184,0.1)",
        }}
        id="faq"
      >
        <div style={{ marginBottom: "8px" }}>
          <span style={{ fontFamily: FONT, fontSize: "11px", color: C.muted }}>
            questions fréquentes
          </span>
        </div>
        <h2
          style={{
            fontFamily: FONT,
            fontSize: "clamp(28px, 4vw, 48px)",
            color: C.accent,
            marginBottom: "56px",
          }}
        >
          // FAQ
        </h2>

        <div style={{ maxWidth: "800px" }}>
          {FAQS.map((faq, i) => (
            <div
              key={i}
              style={{ borderTop: "1px solid rgba(0,229,184,0.1)" }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "24px 0",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  gap: "20px",
                }}
              >
                <span
                  style={{
                    fontFamily: FONT,
                    fontSize: "clamp(13px, 1.4vw, 16px)",
                    color: openFaq === i ? C.accent : C.text,
                    letterSpacing: "0.5px",
                  }}
                >
                  {faq.q}
                </span>
                <motion.span
                  animate={{ rotate: openFaq === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    fontFamily: FONT,
                    fontSize: "20px",
                    color: C.accent,
                    flexShrink: 0,
                    display: "inline-block",
                  }}
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
                    <p
                      style={{
                        fontFamily: FONT,
                        fontSize: "13px",
                        color: C.muted,
                        lineHeight: 1.8,
                        paddingBottom: "28px",
                      }}
                    >
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <div style={{ borderTop: "1px solid rgba(0,229,184,0.1)" }} />
        </div>
      </section>

      {/* ── 8. CTA BANNER ──────────────────────────────────────────────────── */}
      <section
        style={{
          background: C.bg,
          padding: "120px 40px",
          textAlign: "center",
          borderTop: "1px solid rgba(0,229,184,0.1)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: "12px",
              color: C.muted,
              letterSpacing: "3px",
              marginBottom: "24px",
            }}
          >
            {"// vous avez un projet?"}
          </div>
          <h2
            style={{
              fontFamily: FONT,
              fontSize: "clamp(32px, 6vw, 80px)",
              color: C.accent,
              letterSpacing: "-2px",
              lineHeight: 1,
              marginBottom: "16px",
            }}
          >
            Discuter de
            <br />
            Votre Mission
          </h2>
          <p
            style={{
              fontFamily: FONT,
              fontSize: "14px",
              color: C.muted,
              marginBottom: "48px",
              lineHeight: 1.7,
            }}
          >
            Je réponds sous 24h. On définit ensemble le périmètre, le budget, le timing.
            <br />
            Pas de devis automatique — une vraie conversation.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
            <motion.a
              href="mailto:alex@glitch.dev"
              whileHover={{ background: C.accent, color: C.bg }}
              transition={{ duration: 0.15 }}
              style={{
                fontFamily: FONT,
                fontSize: "13px",
                color: C.accent,
                padding: "16px 40px",
                border: `1px solid ${C.accent}`,
                background: "transparent",
                textDecoration: "none",
                display: "inline-block",
                cursor: "pointer",
                letterSpacing: "1px",
              }}
            >
              {">"} alex@glitch.dev
            </motion.a>
            <motion.a
              href="https://cal.com/glitch-dev"
              whileHover={{ background: "rgba(0,229,184,0.08)" }}
              transition={{ duration: 0.15 }}
              style={{
                fontFamily: FONT,
                fontSize: "13px",
                color: C.muted,
                padding: "16px 40px",
                border: "1px solid rgba(0,229,184,0.15)",
                background: "transparent",
                textDecoration: "none",
                display: "inline-block",
                cursor: "pointer",
                letterSpacing: "1px",
              }}
            >
              {">"} réserver un créneau
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* ── 9. FOOTER ──────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: C.card,
          padding: "60px 40px 40px",
          borderTop: "1px solid rgba(0,229,184,0.1)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gap: "60px",
            marginBottom: "48px",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: "20px",
                color: C.accent,
                marginBottom: "16px",
                letterSpacing: "1px",
              }}
            >
              glitch<span style={{ color: C.muted }}>.</span>dev
            </div>
            <p
              style={{
                fontFamily: FONT,
                fontSize: "12px",
                color: "rgba(0,229,184,0.3)",
                lineHeight: 1.7,
                maxWidth: "280px",
                marginBottom: "24px",
              }}
            >
              Développeur Fullstack & Ingénieur IA freelance. React, Node.js, Python, LLM. Basé à Bordeaux, remote worldwide.
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", gap: "16px" }}>
              {/* GitHub */}
              <a href="https://github.com/glitch-dev" style={{ cursor: "pointer" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(0,229,184,0.4)">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://linkedin.com" style={{ cursor: "pointer" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(0,229,184,0.4)">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              {/* MessageSquare/X */}
              <a href="https://x.com" style={{ cursor: "pointer" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(0,229,184,0.4)">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* Dev.to */}
              <a href="https://dev.to" style={{ cursor: "pointer" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(0,229,184,0.4)">
                  <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.29zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.74 0 .74.04 0 .14-1.67 6.38-1.8 6.68z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: "10px",
                color: "rgba(0,229,184,0.25)",
                letterSpacing: "3px",
                marginBottom: "20px",
              }}
            >
              // NAVIGATION
            </div>
            {NAV_LINKS.map((link) => (
              <Link
                key={link}
                href="#"
                style={{
                  display: "block",
                  fontFamily: FONT,
                  fontSize: "12px",
                  color: "rgba(0,229,184,0.4)",
                  textDecoration: "none",
                  marginBottom: "12px",
                  cursor: "pointer",
                }}
              >
                {link}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: "10px",
                color: "rgba(0,229,184,0.25)",
                letterSpacing: "3px",
                marginBottom: "20px",
              }}
            >
              // CONTACT
            </div>
            {[
              "alex@glitch.dev",
              "Bordeaux, France",
              "Remote worldwide",
              "",
              "SIRET 123 456 789 00011",
              "Micro-entrepreneur",
            ].map((line, i) =>
              line ? (
                <div
                  key={i}
                  style={{
                    fontFamily: FONT,
                    fontSize: "12px",
                    color: "rgba(0,229,184,0.4)",
                    marginBottom: "8px",
                  }}
                >
                  {line}
                </div>
              ) : (
                <div key={i} style={{ height: "8px" }} />
              )
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(0,229,184,0.08)",
            paddingTop: "28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontFamily: FONT, fontSize: "11px", color: "rgba(0,229,184,0.2)" }}>
            © 2026 glitch.dev — Alex Martin — Tous droits réservés
          </div>
          <div style={{ display: "flex", gap: "24px" }}>
            {["mentions légales", "politique de confidentialité"].map((item) => (
              <Link
                key={item}
                href="#"
                style={{
                  fontFamily: FONT,
                  fontSize: "11px",
                  color: "rgba(0,229,184,0.2)",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                {"// "}{item}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
