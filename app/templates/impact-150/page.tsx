"use client"

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
  useSpring,
  useMotionValue,
  animate,
} from "framer-motion"

/* ==========================================================================
   DESIGN TOKENS — Ultra-Prestigious Law Firm
   ========================================================================== */

const COLORS = {
  cream:   "#f8f6f0",
  ink:     "#1a1208",
  bronze:  "#8b7355",
  bronzeL: "#b09a78",
  stone:   "#c8bfb0",
  mist:    "#ede9e1",
  charcoal:"#3d3528",
  fog:     "#9e9486",
} as const

/* ==========================================================================
   GOOGLE FONTS INJECTION — Cormorant Garamond
   ========================================================================== */

function FontLoader() {
  useEffect(() => {
    const existing = document.getElementById("cf-garamond-link")
    if (existing) return
    const link = document.createElement("link")
    link.id = "cf-garamond-link"
    link.rel = "stylesheet"
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Inter:wght@300;400;500;600&display=swap"
    document.head.appendChild(link)
  }, [])
  return null
}

/* ==========================================================================
   DATASET
   ========================================================================== */

const PRACTICE_AREAS = [
  {
    id: "ma",
    title: "Mergers & Acquisitions",
    roman: "I",
    tagline: "Sovereign transactions across 60 jurisdictions.",
    description:
      "Our M&A practice advises on the most consequential cross-border transactions in the world — sovereign fund acquisitions, hostile takeover defenses, and transformative restructurings where billions and reputations are at stake.",
    subspecialties: [
      "Cross-border Hostile Takeover Defence",
      "Sovereign Fund Advisory",
      "Leveraged Buyout Structuring",
      "Carve-out & Spin-off Counsel",
      "Post-merger Integration & Governance",
      "Antitrust Clearance Strategy",
    ],
    metric: "$124B+",
    metricLabel: "Transaction value advised",
  },
  {
    id: "lit",
    title: "Global Litigation",
    roman: "II",
    tagline: "Victories that reshape precedent.",
    description:
      "From the International Court of Justice to the Singapore International Commercial Court, our litigators are trusted with matters of supreme complexity. We do not settle when the law is on our side.",
    subspecialties: [
      "International Arbitration (ICC, ICSID, LCIA)",
      "Commercial Fraud & Asset Recovery",
      "Sovereign Immunity Proceedings",
      "Reputational Crisis Management",
      "Class Action Defence",
      "Cyber-Crime & Digital Evidence",
    ],
    metric: "98%",
    metricLabel: "Success rate — reported matters",
  },
  {
    id: "reg",
    title: "Regulatory & Compliance",
    roman: "III",
    tagline: "Navigating the architecture of power.",
    description:
      "Regulatory environments are not obstacles — they are terrain. We embed within the frameworks that govern AI, digital assets, financial services, and pharmaceutical approvals, helping clients move faster and more safely than their peers.",
    subspecialties: [
      "AI Governance & Algorithmic Accountability",
      "Digital Asset Regulatory Frameworks",
      "GDPR & Cross-border Data Sovereignty",
      "Financial Services Licensing",
      "Environmental & ESG Compliance",
      "Pharmaceutical & MedTech Approvals",
    ],
    metric: "400+",
    metricLabel: "Patents secured & defended",
  },
  {
    id: "tax",
    title: "International Tax",
    roman: "IV",
    tagline: "Structures that endure across generations.",
    description:
      "In an era of BEPS 2.0 and shifting global minimum tax frameworks, our tax practice delivers certainty. We design holding structures, transfer pricing policies, and treaty-compliant arrangements that withstand the scrutiny of any authority.",
    subspecialties: [
      "BEPS 2.0 & Pillar Two Implementation",
      "Transfer Pricing Documentation",
      "Treaty Shopping & Limitation-on-Benefits",
      "Family Office & Dynasty Trust Structuring",
      "Tax Controversy & Competent Authority",
      "Cryptocurrency & DeFi Taxation",
    ],
    metric: "18",
    metricLabel: "Jurisdictions — in-house tax counsel",
  },
]

const LANDMARK_CASES = [
  {
    id: "berlin",
    year: "2019",
    title: "The Berlin Infrastructure Accord",
    category: "Energy Sovereignty",
    description:
      "Advised three sovereign governments on the legal architecture underpinning a €34 billion cross-border energy infrastructure treaty — a matter of first impression before the European Court of Justice.",
    outcome: "Treaty ratified; precedent-setting ruling on sovereign investment protection.",
  },
  {
    id: "solis",
    year: "2021",
    title: "Global Tech Antitrust v. Solis Corp.",
    category: "Market Regulation",
    description:
      "Led the defence in the largest antitrust proceeding in Singapore's history, establishing the evidentiary standard for algorithmic market dominance across APAC jurisdictions.",
    outcome: "Full acquittal; standard adopted by MAS regulatory guidance.",
  },
  {
    id: "ashford",
    year: "2023",
    title: "In re: Ashford Capital Restructuring",
    category: "Cross-border Insolvency",
    description:
      "Orchestrated simultaneous Chapter 11 and English Administration proceedings for a $12 billion asset manager, preserving value for 60,000 investors across 14 countries.",
    outcome: "100% creditor recovery; cited in UNCITRAL Model Law commentary.",
  },
  {
    id: "meridian",
    year: "2025",
    title: "Meridian Pharma v. Republic of Valdris",
    category: "Investment Arbitration",
    description:
      "Represented claimant in an ICSID arbitration arising from unlawful expropriation of pharmaceutical manufacturing assets, a proceeding spanning seven years and four continents.",
    outcome: "$2.1B award — largest ICSID award in the pharmaceutical sector.",
  },
]

const PARTNERS = [
  {
    id: "sterling",
    initials: "AS",
    name: "Sir Alistair Sterling",
    title: "Senior Partner",
    practice: "Mergers & Acquisitions",
    called: "Called to the Bar, 1987",
    bio: "Sir Alistair has advised on over $500 billion in completed M&A transactions across six decades at the Bar. Formerly of the Treasury Solicitor's Department, he is recognised by Chambers & Partners as 'the defining figure of cross-border corporate law in the modern era'.",
    hue: "#2a2218",
  },
  {
    id: "vance",
    initials: "EV",
    name: "Elena Vance KC",
    title: "Head of Global Litigation",
    practice: "Litigation & Arbitration",
    called: "King's Counsel, 2009",
    bio: "Elena Vance is one of the foremost international arbitrators of her generation. A former ICC Court of Arbitration panellist, she has appeared as lead counsel in proceedings before the ICJ, ICSID, and the UK Supreme Court.",
    hue: "#1e2428",
  },
  {
    id: "tanaka",
    initials: "HT",
    name: "Hiroshi Tanaka",
    title: "Partner, Regulatory & Technology",
    practice: "Regulatory Tech & AI Law",
    called: "Admitted, Tokyo & New York Bars",
    bio: "Hiroshi leads our globally ranked Technology & Regulatory practice. A former senior counsel at the FSA Japan, he has drafted regulatory submissions that have shaped AI governance frameworks in the EU, Singapore, and Japan.",
    hue: "#242018",
  },
  {
    id: "osei",
    initials: "AA",
    name: "Adjoa Asante",
    title: "Partner, International Tax",
    practice: "International Tax & Structuring",
    called: "Chartered Tax Adviser; LLM, NYU",
    bio: "Adjoa's practice spans the full spectrum of international tax planning, from sovereign wealth fund structuring to BEPS-compliant holding arrangements. She is the architect of tax strategies in 18 countries for family offices with combined assets exceeding $40 billion.",
    hue: "#1c2420",
  },
]

const TRUST_METRICS = [
  { value: 340, suffix: "+", label: "Attorneys Worldwide", decimals: 0 },
  { value: 98, suffix: "%", label: "Cases Won or Settled Favourably", decimals: 0 },
  { value: 60, suffix: "", label: "Countries — Active Mandates", decimals: 0 },
  { value: 127, suffix: "", label: "Years of Combined Partnership", decimals: 0 },
]

/* ==========================================================================
   1. EDITORIAL HERO TEXT REVEAL
   Word-by-word staged reveal, 80ms stagger, triggered by useInView
   ========================================================================== */

function HeroWordReveal({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const words = text.split(" ")

  return (
    <span ref={ref} className={className} style={{ display: "inline" }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.7,
            delay: i * 0.08,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{ display: "inline-block", marginRight: "0.28em" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

/* ==========================================================================
   2. ANIMATED COUNTER — decimal precision, triggered on scroll
   ========================================================================== */

function AnimatedCounter({
  value,
  suffix,
  decimals,
}: {
  value: number
  suffix: string
  decimals: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const motionValue = useMotionValue(0)
  const [display, setDisplay] = useState("0")

  useEffect(() => {
    if (!isInView) return
    const controls = animate(motionValue, value, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
    })
    const unsub = motionValue.on("change", (v) => {
      setDisplay(
        decimals > 0
          ? v.toFixed(decimals)
          : Math.floor(v).toString()
      )
    })
    return () => {
      controls.stop()
      unsub()
    }
  }, [isInView, value, decimals, motionValue])

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}

/* ==========================================================================
   3. GENERIC SCROLL REVEAL
   ========================================================================== */

function Reveal({
  children,
  delay = 0,
  y = 32,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.1, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ==========================================================================
   NAVIGATION
   ========================================================================== */

function Navigation() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: scrolled ? "rgba(248,246,240,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${COLORS.stone}` : "1px solid transparent",
        transition: "background-color 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
        padding: "0 60px",
        height: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Wordmark */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 500,
            fontSize: 22,
            color: COLORS.ink,
            letterSpacing: "0.04em",
          }}
        >
          Alderton &amp; Sterling
        </span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: 11,
            color: COLORS.bronze,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          LLP
        </span>
      </div>

      {/* Nav links */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 48,
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: COLORS.charcoal,
        }}
      >
        {["Practice Areas", "Landmark Cases", "Partners", "Contact"].map((item) => (
          <motion.a
            key={item}
            href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
            whileHover={{ color: COLORS.bronze }}
            style={{ color: COLORS.charcoal, textDecoration: "none", transition: "color 0.2s" }}
          >
            {item}
          </motion.a>
        ))}
        <motion.button
          whileHover={{ backgroundColor: COLORS.ink, color: COLORS.cream }}
          style={{
            backgroundColor: "transparent",
            border: `1px solid ${COLORS.ink}`,
            color: COLORS.ink,
            padding: "10px 28px",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "background-color 0.25s ease, color 0.25s ease",
          }}
        >
          Request Counsel
        </motion.button>
      </div>
    </motion.nav>
  )
}

/* ==========================================================================
   SECTION: HERO
   ========================================================================== */

function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const subtitleY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 0.6])

  return (
    <section id="hero"
      ref={ref}
      style={{
        minHeight: "100vh",
        backgroundColor: COLORS.cream,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        paddingTop: 80,
      }}
    >
      {/* Subtle ruled-line background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 79px,
            ${COLORS.stone}40 79px,
            ${COLORS.stone}40 80px
          )`,
          opacity: 0.4,
          pointerEvents: "none",
        }}
      />

      {/* Scroll-driven vignette */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: COLORS.ink,
          opacity: overlayOpacity,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 1200,
          margin: "0 auto",
          padding: "100px 60px 120px",
          textAlign: "center",
        }}
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: COLORS.bronze,
            marginBottom: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 48,
              height: 1,
              backgroundColor: COLORS.bronze,
            }}
          />
          Est. 1897 — London, New York, Singapore
          <span
            style={{
              display: "inline-block",
              width: 48,
              height: 1,
              backgroundColor: COLORS.bronze,
            }}
          />
        </motion.div>

        {/* Main headline — editorial word reveal */}
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(64px, 9vw, 128px)",
            lineHeight: 0.92,
            color: COLORS.ink,
            letterSpacing: "-0.02em",
            marginBottom: 0,
          }}
        >
          <span style={{ display: "block" }}>
            <HeroWordReveal text="Authority" />
          </span>
          <span style={{ display: "block", fontStyle: "italic", fontWeight: 300 }}>
            <HeroWordReveal text="in every" />
          </span>
          <span style={{ display: "block" }}>
            <HeroWordReveal text="jurisdiction." />
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          style={{
            y: subtitleY,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: 17,
            lineHeight: 1.8,
            color: COLORS.charcoal,
            maxWidth: 560,
            margin: "56px auto 80px",
            opacity: 0.8,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          For over a century, Alderton &amp; Sterling has represented sovereign
          governments, global corporations, and ultra-high-net-worth families in
          the most consequential legal matters of the age.
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}
        >
          <motion.button
            whileHover={{ backgroundColor: COLORS.bronze, borderColor: COLORS.bronze }}
            style={{
              backgroundColor: COLORS.ink,
              color: COLORS.cream,
              border: `1px solid ${COLORS.ink}`,
              padding: "16px 48px",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "background-color 0.3s ease, border-color 0.3s ease",
            }}
          >
            Request a Consultation
          </motion.button>
          <motion.button
            whileHover={{ backgroundColor: COLORS.mist }}
            style={{
              backgroundColor: "transparent",
              color: COLORS.ink,
              border: `1px solid ${COLORS.stone}`,
              padding: "16px 48px",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "background-color 0.25s ease",
            }}
          >
            View Practice Areas
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            marginTop: 96,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: COLORS.fog,
            }}
          >
            Scroll
          </span>
          <div
            style={{
              width: 1,
              height: 40,
              background: `linear-gradient(to bottom, ${COLORS.bronze}, transparent)`,
            }}
          />
        </motion.div>
      </div>
    </section>
  )
}

/* ==========================================================================
   SECTION: TRUST METRICS — animated counters
   ========================================================================== */

function MetricsSection() {
  return (
    <section
      style={{
        backgroundColor: COLORS.ink,
        padding: "100px 60px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Separator label */}
        <Reveal>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginBottom: 80,
            }}
          >
            <div style={{ flex: 1, height: 1, backgroundColor: `${COLORS.cream}15` }} />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 10,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: COLORS.bronze,
              }}
            >
              The Firm in Numbers
            </span>
            <div style={{ flex: 1, height: 1, backgroundColor: `${COLORS.cream}15` }} />
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 0,
          }}
        >
          {TRUST_METRICS.map((metric, i) => (
            <Reveal key={metric.label} delay={i * 0.12}>
              <div
                style={{
                  padding: "48px 40px",
                  borderRight: i < 3 ? `1px solid ${COLORS.cream}12` : "none",
                  textAlign: "center",
                }}
              >
                {/* Counter number */}
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 300,
                    fontSize: "clamp(56px, 6vw, 88px)",
                    lineHeight: 1,
                    color: COLORS.cream,
                    letterSpacing: "-0.03em",
                    marginBottom: 16,
                  }}
                >
                  <AnimatedCounter
                    value={metric.value}
                    suffix={metric.suffix}
                    decimals={metric.decimals}
                  />
                </div>

                {/* Horizontal separator */}
                <div
                  style={{
                    width: 32,
                    height: 1,
                    backgroundColor: COLORS.bronze,
                    margin: "0 auto 20px",
                  }}
                />

                {/* Label */}
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: 12,
                    letterSpacing: "0.06em",
                    color: `${COLORS.cream}60`,
                    lineHeight: 1.6,
                    maxWidth: 160,
                    margin: "0 auto",
                  }}
                >
                  {metric.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   SECTION: PRACTICE AREAS — accordion with AnimatePresence + height animation
   ========================================================================== */

function PracticeAreasSection() {
  const [open, setOpen] = useState<string | null>("ma")

  const toggle = useCallback((id: string) => {
    setOpen((prev) => (prev === id ? null : id))
  }, [])

  return (
    <section
      id="practice-areas"
      style={{
        backgroundColor: COLORS.cream,
        padding: "140px 60px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Section header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "end",
            marginBottom: 96,
          }}
        >
          <Reveal>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 10,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: COLORS.bronze,
                display: "block",
                marginBottom: 24,
              }}
            >
              Practice Areas
            </span>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(40px, 5vw, 72px)",
                lineHeight: 1.05,
                color: COLORS.ink,
                letterSpacing: "-0.02em",
              }}
            >
              <HeroWordReveal text="The full spectrum of" />
              <br />
              <span style={{ fontStyle: "italic" }}>
                <HeroWordReveal text="legal excellence." />
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                fontSize: 16,
                lineHeight: 1.9,
                color: COLORS.charcoal,
                opacity: 0.75,
              }}
            >
              Four integrated practice groups, each ranked Band 1 by Chambers &amp;
              Partners globally. Our practitioners operate across 60 countries, drawing
              on a depth of expertise that comes only from a century of unbroken practice
              at the highest level.
            </p>
          </Reveal>
        </div>

        {/* Accordion items */}
        <div
          style={{
            borderTop: `1px solid ${COLORS.stone}`,
          }}
        >
          {PRACTICE_AREAS.map((area, areaIdx) => (
            <div key={area.id} style={{ borderBottom: `1px solid ${COLORS.stone}` }}>
              {/* Accordion header */}
              <motion.button
                onClick={() => toggle(area.id)}
                whileHover={{ backgroundColor: `${COLORS.mist}80` }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 40,
                  padding: "36px 32px",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background-color 0.2s ease",
                }}
              >
                {/* Roman numeral */}
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 300,
                    fontSize: 14,
                    color: COLORS.bronze,
                    letterSpacing: "0.1em",
                    width: 32,
                    flexShrink: 0,
                    fontStyle: "italic",
                  }}
                >
                  {area.roman}
                </span>

                {/* Title */}
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: open === area.id ? 500 : 400,
                    fontSize: "clamp(22px, 3vw, 34px)",
                    color: COLORS.ink,
                    letterSpacing: "-0.01em",
                    flex: 1,
                    transition: "font-weight 0.2s ease",
                  }}
                >
                  {area.title}
                </span>

                {/* Metric */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontWeight: 500,
                      fontSize: 28,
                      color: open === area.id ? COLORS.bronze : COLORS.stone,
                      letterSpacing: "-0.02em",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {area.metric}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 10,
                      color: COLORS.fog,
                      letterSpacing: "0.08em",
                      marginTop: 2,
                    }}
                  >
                    {area.metricLabel}
                  </div>
                </div>

                {/* Expand icon */}
                <motion.div
                  animate={{ rotate: open === area.id ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{
                    width: 32,
                    height: 32,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${COLORS.stone}`,
                    color: COLORS.ink,
                    fontSize: 20,
                    lineHeight: 1,
                    fontWeight: 300,
                  }}
                >
                  +
                </motion.div>
              </motion.button>

              {/* Accordion panel — AnimatePresence + motion.div height: 0 → auto */}
              <AnimatePresence initial={false}>
                {open === area.id && (
                  <motion.div
                    key="panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
                      opacity: { duration: 0.3, delay: open === area.id ? 0.1 : 0 },
                    }}
                    style={{ overflow: "hidden" }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "72px 1fr 1fr",
                        gap: 40,
                        padding: "0 32px 56px",
                      }}
                    >
                      {/* Spacer for roman numeral column */}
                      <div />

                      {/* Description */}
                      <div>
                        <p
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 300,
                            fontSize: 15,
                            lineHeight: 1.9,
                            color: COLORS.charcoal,
                            marginBottom: 32,
                          }}
                        >
                          {area.description}
                        </p>
                        <span
                          style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontStyle: "italic",
                            fontSize: 13,
                            color: COLORS.bronze,
                            letterSpacing: "0.04em",
                          }}
                        >
                          {area.tagline}
                        </span>
                      </div>

                      {/* Sub-specialties — staggered list */}
                      <div>
                        <p
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 10,
                            fontWeight: 500,
                            letterSpacing: "0.22em",
                            textTransform: "uppercase",
                            color: COLORS.bronze,
                            marginBottom: 20,
                          }}
                        >
                          Sub-specialties
                        </p>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                          {area.subspecialties.map((sub, si) => (
                            <motion.li
                              key={sub}
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.4,
                                delay: si * 0.04,
                                ease: "easeOut",
                              }}
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 400,
                                fontSize: 13,
                                color: COLORS.charcoal,
                                padding: "9px 0",
                                borderBottom: `1px solid ${COLORS.stone}50`,
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                              }}
                            >
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 4,
                                  height: 4,
                                  backgroundColor: COLORS.bronze,
                                  borderRadius: "50%",
                                  flexShrink: 0,
                                }}
                              />
                              {sub}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   SECTION: LANDMARK CASES — scroll-activated vertical timeline
   ========================================================================== */

function TimelineCase({
  caseItem,
  index,
}: {
  caseItem: (typeof LANDMARK_CASES)[number]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-120px" })

  return (
    <div
      ref={ref}
      style={{
        display: "grid",
        gridTemplateColumns: "80px 48px 1fr",
        gap: "0 40px",
        marginBottom: 0,
        position: "relative",
      }}
    >
      {/* Year column */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          paddingTop: 6,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: 16,
          color: COLORS.bronze,
          textAlign: "right",
        }}
      >
        {caseItem.year}
      </motion.div>

      {/* Timeline connector column */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Node dot */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "backOut" }}
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: isInView ? COLORS.bronze : COLORS.stone,
            border: `2px solid ${COLORS.cream}`,
            boxShadow: isInView ? `0 0 0 4px ${COLORS.bronze}25` : "none",
            zIndex: 2,
            flexShrink: 0,
            marginTop: 4,
            transition: "box-shadow 0.4s ease",
          }}
        />
        {/* Connector line — extends downward when active */}
        {index < LANDMARK_CASES.length - 1 && (
          <motion.div
            initial={{ scaleY: 0, originY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              flex: 1,
              width: 1,
              backgroundColor: COLORS.stone,
              transformOrigin: "top",
              marginTop: 8,
            }}
          />
        )}
      </div>

      {/* Card column */}
      <motion.div
        initial={{ opacity: 0.3, scale: 0.97, y: 16 }}
        animate={
          isInView
            ? { opacity: 1, scale: 1, y: 0 }
            : { opacity: 0.3, scale: 0.97, y: 16 }
        }
        transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          paddingBottom: index < LANDMARK_CASES.length - 1 ? 80 : 0,
          paddingTop: 0,
        }}
      >
        {/* Category tag */}
        <motion.span
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={
            isInView
              ? { clipPath: "inset(0 0% 0 0)" }
              : { clipPath: "inset(0 100% 0 0)" }
          }
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            display: "inline-block",
            fontFamily: "'Inter', sans-serif",
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: COLORS.bronze,
            marginBottom: 14,
          }}
        >
          {caseItem.category}
        </motion.span>

        <h3
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 500,
            fontSize: "clamp(22px, 2.5vw, 32px)",
            lineHeight: 1.2,
            color: COLORS.ink,
            letterSpacing: "-0.01em",
            marginBottom: 16,
          }}
        >
          {caseItem.title}
        </h3>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: 14,
            lineHeight: 1.85,
            color: COLORS.charcoal,
            opacity: 0.8,
            marginBottom: 20,
            maxWidth: 640,
          }}
        >
          {caseItem.description}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            color: COLORS.fog,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 28,
              height: 1,
              backgroundColor: COLORS.bronze,
            }}
          />
          {caseItem.outcome}
        </div>
      </motion.div>
    </div>
  )
}

function CaseTimelineSection() {
  return (
    <section
      id="landmark-cases"
      style={{
        backgroundColor: COLORS.mist,
        padding: "140px 60px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: 100,
            alignItems: "start",
          }}
        >
          {/* Sticky label column */}
          <div style={{ position: "sticky", top: 120 }}>
            <Reveal>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: COLORS.bronze,
                  display: "block",
                  marginBottom: 24,
                }}
              >
                Landmark Cases
              </span>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 400,
                  fontSize: "clamp(36px, 4vw, 60px)",
                  lineHeight: 1.1,
                  color: COLORS.ink,
                  letterSpacing: "-0.02em",
                  marginBottom: 32,
                }}
              >
                Cases that{" "}
                <span style={{ fontStyle: "italic" }}>shaped</span>{" "}
                the law.
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  fontSize: 14,
                  lineHeight: 1.9,
                  color: COLORS.charcoal,
                  opacity: 0.75,
                }}
              >
                A selection of landmark matters in which our counsel established
                new precedent, protected sovereign interests, or delivered outcomes
                that redefined the boundaries of what is possible in international law.
              </p>
            </Reveal>
          </div>

          {/* Timeline */}
          <div>
            {LANDMARK_CASES.map((c, i) => (
              <TimelineCase key={c.id} caseItem={c} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   SECTION: PARTNERS — scroll reveal + hover bio overlay
   ========================================================================== */

function PartnerCard({ partner, delay }: { partner: (typeof PARTNERS)[number]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: "pointer" }}
    >
      {/* Photo area — CSS gray rectangle with initials */}
      <div
        style={{
          position: "relative",
          aspectRatio: "3/4",
          backgroundColor: partner.hue,
          overflow: "hidden",
          marginBottom: 24,
        }}
      >
        {/* Initials */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: 72,
            color: `${COLORS.cream}25`,
            letterSpacing: "0.1em",
            userSelect: "none",
          }}
        >
          {partner.initials}
        </div>

        {/* Subtle gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to bottom, transparent 40%, ${COLORS.ink}90)`,
          }}
        />

        {/* Practice tag */}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            fontFamily: "'Inter', sans-serif",
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: COLORS.bronze,
          }}
        >
          {partner.practice}
        </div>

        {/* Bio overlay — slides up from bottom on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              key="bio"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: `${COLORS.ink}f5`,
                backdropFilter: "blur(8px)",
                padding: "28px 24px",
              }}
            >
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  fontSize: 12,
                  lineHeight: 1.85,
                  color: `${COLORS.cream}cc`,
                  marginBottom: 16,
                }}
              >
                {partner.bio}
              </p>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  color: COLORS.bronze,
                  fontStyle: "italic",
                }}
              >
                {partner.called}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Name & title */}
      <div>
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 500,
            fontSize: 22,
            color: COLORS.ink,
            letterSpacing: "-0.01em",
            marginBottom: 4,
          }}
        >
          {partner.name}
        </h3>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: 12,
            color: COLORS.fog,
            letterSpacing: "0.06em",
          }}
        >
          {partner.title}
        </p>
      </div>
    </motion.div>
  )
}

function PartnersSection() {
  return (
    <section
      id="partners"
      style={{
        backgroundColor: COLORS.cream,
        padding: "140px 60px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 96,
            gap: 60,
            flexWrap: "wrap",
          }}
        >
          <Reveal>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 10,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: COLORS.bronze,
                display: "block",
                marginBottom: 24,
              }}
            >
              Our Partners
            </span>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(40px, 5vw, 68px)",
                lineHeight: 1.05,
                color: COLORS.ink,
                letterSpacing: "-0.02em",
              }}
            >
              Counsel of{" "}
              <span style={{ fontStyle: "italic" }}>singular</span>
              <br />
              distinction.
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                fontSize: 14,
                lineHeight: 1.9,
                color: COLORS.charcoal,
                opacity: 0.75,
                maxWidth: 380,
              }}
            >
              Hover any portrait to read a partner biography. Our leadership team
              is drawn from the most senior ranks of the international Bar, government,
              and the judiciary.
            </p>
          </Reveal>
        </div>

        {/* Partners grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 40,
          }}
        >
          {PARTNERS.map((partner, i) => (
            <PartnerCard key={partner.id} partner={partner} delay={i * 0.1} />
          ))}
        </div>

        {/* "View all partners" link */}
        <Reveal delay={0.3}>
          <div style={{ textAlign: "center", marginTop: 72 }}>
            <motion.button
              whileHover={{ letterSpacing: "0.22em" }}
              style={{
                backgroundColor: "transparent",
                border: "none",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: COLORS.bronze,
                cursor: "pointer",
                padding: "12px 0",
                borderBottom: `1px solid ${COLORS.bronze}`,
                transition: "letter-spacing 0.3s ease",
              }}
            >
              View All Partners
            </motion.button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ==========================================================================
   SECTION: GLOBAL OFFICES
   ========================================================================== */

const OFFICES = [
  { city: "London", role: "Global Headquarters", est: "Est. 1897" },
  { city: "New York", role: "Americas Practice Hub", est: "Est. 1954" },
  { city: "Singapore", role: "Asia-Pacific Centre", est: "Est. 1982" },
  { city: "Zurich", role: "Swiss Office", est: "Est. 2003" },
  { city: "Dubai", role: "MENA Practice", est: "Est. 2011" },
  { city: "Paris", role: "Continental Europe", est: "Est. 1971" },
]

function OfficesSection() {
  return (
    <section
      style={{
        backgroundColor: COLORS.ink,
        padding: "140px 60px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 80,
              flexWrap: "wrap",
              gap: 32,
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: COLORS.bronze,
                  display: "block",
                  marginBottom: 20,
                }}
              >
                Global Presence
              </span>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 400,
                  fontSize: "clamp(36px, 5vw, 64px)",
                  lineHeight: 1.05,
                  color: COLORS.cream,
                  letterSpacing: "-0.02em",
                }}
              >
                Six cities.{" "}
                <span style={{ fontStyle: "italic" }}>One standard.</span>
              </h2>
            </div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                fontSize: 14,
                lineHeight: 1.9,
                color: `${COLORS.cream}60`,
                maxWidth: 360,
              }}
            >
              Each office operates under the same protocols, the same quality of
              counsel, and the same commitment to client confidentiality — regardless
              of time zone.
            </p>
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            borderTop: `1px solid ${COLORS.cream}15`,
            borderLeft: `1px solid ${COLORS.cream}15`,
          }}
        >
          {OFFICES.map((office, i) => (
            <Reveal key={office.city} delay={i * 0.08}>
              <motion.div
                whileHover={{ backgroundColor: `${COLORS.cream}07` }}
                style={{
                  padding: "48px 40px",
                  borderRight: `1px solid ${COLORS.cream}15`,
                  borderBottom: `1px solid ${COLORS.cream}15`,
                  transition: "background-color 0.25s ease",
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 400,
                    fontSize: 32,
                    color: COLORS.cream,
                    letterSpacing: "-0.01em",
                    marginBottom: 8,
                  }}
                >
                  {office.city}
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: 12,
                    color: COLORS.bronze,
                    letterSpacing: "0.08em",
                    marginBottom: 4,
                  }}
                >
                  {office.role}
                </p>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                    fontSize: 11,
                    color: `${COLORS.cream}35`,
                    fontStyle: "italic",
                  }}
                >
                  {office.est}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   SECTION: CTA
   ========================================================================== */

function CtaSection() {
  return (
    <section
      id="contact"
      style={{
        backgroundColor: COLORS.cream,
        padding: "160px 60px",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <Reveal>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: COLORS.bronze,
              display: "block",
              marginBottom: 40,
            }}
          >
            Begin the Conversation
          </span>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(48px, 6vw, 88px)",
              lineHeight: 1.0,
              color: COLORS.ink,
              letterSpacing: "-0.025em",
              marginBottom: 40,
            }}
          >
            <HeroWordReveal text="When the matter" />
            <br />
            <span style={{ fontStyle: "italic" }}>
              <HeroWordReveal text="cannot wait." />
            </span>
          </h2>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              fontSize: 17,
              lineHeight: 1.8,
              color: COLORS.charcoal,
              opacity: 0.75,
              marginBottom: 64,
            }}
          >
            Our intake team is available around the clock. All enquiries are treated
            with absolute confidentiality under our global attorney-client privilege policy.
          </p>

          <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.button
              whileHover={{ backgroundColor: COLORS.bronze, borderColor: COLORS.bronze }}
              style={{
                backgroundColor: COLORS.ink,
                color: COLORS.cream,
                border: `1px solid ${COLORS.ink}`,
                padding: "20px 60px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "background-color 0.3s ease, border-color 0.3s ease",
              }}
            >
              Schedule a Consultation
            </motion.button>
            <motion.button
              whileHover={{ backgroundColor: COLORS.mist }}
              style={{
                backgroundColor: "transparent",
                color: COLORS.ink,
                border: `1px solid ${COLORS.stone}`,
                padding: "20px 60px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "background-color 0.25s ease",
              }}
            >
              +44 (0)20 7946 0000
            </motion.button>
          </div>
        </Reveal>

        {/* Divider */}
        <Reveal delay={0.3}>
          <div
            style={{
              marginTop: 120,
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div style={{ flex: 1, height: 1, backgroundColor: COLORS.stone }} />
            <span
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                fontSize: 15,
                color: COLORS.fog,
                whiteSpace: "nowrap",
              }}
            >
              Alderton &amp; Sterling LLP
            </span>
            <div style={{ flex: 1, height: 1, backgroundColor: COLORS.stone }} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ==========================================================================
   FOOTER
   ========================================================================== */

function Footer() {
  const footerLinks = {
    "Practice Areas": ["Mergers & Acquisitions", "Global Litigation", "Regulatory & Compliance", "International Tax"],
    "The Firm": ["Our Partners", "Global Offices", "Landmark Cases", "Careers"],
    "Knowledge": ["Legal Insights", "Client Portal", "Press Office", "Legal Notice"],
    "Contact": ["London HQ", "New York", "Singapore", "Emergency Counsel"],
  }

  return (
    <footer
      style={{
        backgroundColor: COLORS.ink,
        padding: "80px 60px 48px",
        borderTop: `1px solid ${COLORS.cream}10`,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Top row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: 80,
            marginBottom: 72,
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 500,
                fontSize: 24,
                color: COLORS.cream,
                letterSpacing: "0.02em",
                marginBottom: 8,
              }}
            >
              Alderton &amp; Sterling
            </div>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: COLORS.bronze,
                marginBottom: 28,
              }}
            >
              LLP — Est. 1897
            </div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                fontSize: 13,
                lineHeight: 1.8,
                color: `${COLORS.cream}45`,
              }}
            >
              International law counsel of singular distinction, operating across
              six global offices for over a century.
            </p>
          </div>

          {/* Link columns */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 40,
            }}
          >
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: COLORS.bronze,
                    marginBottom: 20,
                  }}
                >
                  {category}
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {links.map((link) => (
                    <li key={link} style={{ marginBottom: 10 }}>
                      <motion.a
                        href="#practice-areas"
                        whileHover={{ color: COLORS.cream }}
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 300,
                          fontSize: 12,
                          color: `${COLORS.cream}45`,
                          textDecoration: "none",
                          transition: "color 0.2s ease",
                        }}
                      >
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: `1px solid ${COLORS.cream}12`,
            paddingTop: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              fontSize: 11,
              color: `${COLORS.cream}30`,
              letterSpacing: "0.06em",
            }}
          >
            © 2026 Alderton &amp; Sterling LLP. Regulated by the Solicitors Regulation Authority.
            All rights reserved.
          </p>
          <div
            style={{
              display: "flex",
              gap: 32,
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              color: `${COLORS.cream}30`,
            }}
          >
            {["Privacy Policy", "Terms of Use", "Cookie Policy", "Accessibility"].map((item) => (
              <motion.a
                key={item}
                href="#practice-areas"
                whileHover={{ color: `${COLORS.cream}70` }}
                style={{
                  color: `${COLORS.cream}30`,
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ==========================================================================
   ROOT COMPONENT
   ========================================================================== */

export default function LegalFirmTemplate() {
  return (
    <>
      <FontLoader />
      <div
        style={{
          backgroundColor: COLORS.cream,
          color: COLORS.ink,
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        <Navigation />
        <HeroSection />
        <MetricsSection />
        <PracticeAreasSection />
        <CaseTimelineSection />
        <PartnersSection />
        <OfficesSection />
        <CtaSection />
        <Footer />
      </div>
    </>
  )
}
