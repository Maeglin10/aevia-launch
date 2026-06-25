"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import React, { useState, useRef, useEffect, useCallback } from "react"

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#FAFAF8",
  bgCard: "#F2F0EB",
  bgDark: "#0E0E10",
  accent: "#1A1AFF",
  red: "#D93025",
  dark: "#0E0E0E",
  muted: "#6A6A72",
  border: "rgba(14,14,16,0.1)",
  white: "#FFFFFF",
  offWhite: "#F7F6F3",
  serif: "'Libre Baskerville', Georgia, serif",
  sans: "'Inter', system-ui, sans-serif",
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const TOPICS = ["Technology", "Business", "Culture", "Science", "Politics"]

const MARQUEE_ITEMS = [
  "Technology", "·", "Business", "·", "Culture", "·", "Science", "·", "Politics",
  "·", "AI Revolution", "·", "Supply Chains", "·", "Digital Creators", "·",
  "Quantum Computing", "·", "Democracy Algorithms", "·", "Technology", "·", "Business",
  "·", "Culture", "·", "Science", "·", "Politics",
]

const TYPEWRITER_HEADLINES = [
  "The world is changing faster than we can write about it",
  "Ideas that shape the decade",
  "Journalism for the curious mind",
]

const FEATURED = {
  id: 0,
  title: "The Generative AI Revolution Is Rewriting the Rules of Every Industry",
  subtitle: "From healthcare diagnostics to supply chain logistics, machine intelligence has crossed the threshold from experiment to infrastructure. We examine what that means for the next ten years.",
  topic: "Technology",
  reading: "22 min",
  author: "Sarah Chen",
  role: "Technology Editor",
  date: "May 13, 2026",
  img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1600&q=85",
}

const ARTICLES = [
  {
    id: 1,
    title: "Why Global Supply Chains Are Rewiring Toward Regional Hubs",
    excerpt: "The era of hyper-globalised manufacturing is giving way to a new geography of production, and the transition is anything but smooth.",
    topic: "Business",
    reading: "12 min",
    author: "Marcus Thompson",
    date: "May 12, 2026",
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    size: "large",
  },
  {
    id: 2,
    title: "The New Digital Creators Are Building Billion-Dollar Empires",
    excerpt: "A generation of independent media entrepreneurs is outpacing legacy publishers. Their secret? Ownership, directness, and algorithmic fluency.",
    topic: "Culture",
    reading: "15 min",
    author: "Elena Rodriguez",
    date: "May 11, 2026",
    img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80",
    size: "small",
  },
  {
    id: 3,
    title: "Quantum Computing Reaches a Pivotal Commercial Threshold",
    excerpt: "Error-corrected quantum processors are finally arriving in commercial cloud environments. The implications for cryptography, drug discovery, and finance are immense.",
    topic: "Science",
    reading: "10 min",
    author: "James Liu",
    date: "May 10, 2026",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    size: "small",
  },
  {
    id: 4,
    title: "Democracy's Digital Battlefield: How Algorithms Shape Elections",
    excerpt: "The platforms that mediate political discourse were not designed for democracy. We investigate whether they can be reformed — or whether they must be dismantled.",
    topic: "Politics",
    reading: "18 min",
    author: "Olivia Park",
    date: "May 9, 2026",
    img: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80",
    size: "medium",
  },
  {
    id: 5,
    title: "Private Equity's New Obsession: AI-Native Companies",
    excerpt: "Investors are restructuring entire deal theses around AI-first business models. The result is a new taxonomy of startup value that confounds traditional metrics.",
    topic: "Business",
    reading: "13 min",
    author: "Priya Shah",
    date: "May 8, 2026",
    img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    size: "medium",
  },
]

const EDITORS_PICKS = [
  {
    id: 1,
    title: "The Loneliness Economy and What It Tells Us About Late Capitalism",
    topic: "Culture",
    author: "Leo Müller",
    reading: "19 min",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  },
  {
    id: 2,
    title: "Inside the Race to Build Carbon-Negative Steel",
    topic: "Science",
    author: "Aiko Tanaka",
    reading: "14 min",
    img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80",
  },
  {
    id: 3,
    title: "The Central Bankers Who Want to Reinvent Money",
    topic: "Business",
    author: "Marcus Thompson",
    reading: "16 min",
    img: "https://images.unsplash.com/photo-1565372195458-9de0b320ef04?w=600&q=80",
  },
]

// ─── TypewriterHeadline ───────────────────────────────────────────────────────
function TypewriterHeadline() {
  const [displayed, setDisplayed] = useState("")
  const [headlineIndex, setHeadlineIndex] = useState(0)
  const [phase, setPhase] = useState<"typing" | "pausing" | "fading">("typing")
  const [visible, setVisible] = useState(true)
  const charRef = useRef(0)
  const currentHeadline = TYPEWRITER_HEADLINES[headlineIndex]

  useEffect(() => {
    charRef.current = 0
    setDisplayed("")
    setPhase("typing")
    setVisible(true)
  }, [headlineIndex])

  useEffect(() => {
    if (phase === "typing") {
      if (charRef.current >= currentHeadline.length) {
        setPhase("pausing")
        return
      }
      const t = setTimeout(() => {
        charRef.current += 1
        setDisplayed(currentHeadline.slice(0, charRef.current))
      }, 60)
      return () => clearTimeout(t)
    }
    if (phase === "pausing") {
      const t = setTimeout(() => setPhase("fading"), 2500)
      return () => clearTimeout(t)
    }
    if (phase === "fading") {
      setVisible(false)
      const t = setTimeout(() => {
        setHeadlineIndex(i => (i + 1) % TYPEWRITER_HEADLINES.length)
      }, 600)
      return () => clearTimeout(t)
    }
  }, [phase, currentHeadline, displayed])

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key={headlineIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55 }}
          style={{
            fontFamily: C.serif,
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: "clamp(38px, 5.5vw, 78px)",
            color: C.dark,
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
            maxWidth: 900,
            position: "relative",
          }}
        >
          {displayed}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            style={{
              display: "inline-block",
              width: 3,
              height: "0.85em",
              background: C.accent,
              marginLeft: 4,
              verticalAlign: "text-bottom",
              borderRadius: 1,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── TextReveal ───────────────────────────────────────────────────────────────
function TextReveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28, clipPath: "inset(0 0 100% 0)" }}
      animate={isInView ? { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" } : {}}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

// ─── MagneticButton ───────────────────────────────────────────────────────────
function MagneticButton({ children, onClick, style = {} }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 480, damping: 26 })
  const sy = useSpring(y, { stiffness: 480, damping: 26 })
  const ref = useRef<HTMLButtonElement>(null)

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.32)
    y.set((e.clientY - r.top - r.height / 2) * 0.32)
  }, [x, y])

  const handleLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy, cursor: "pointer", ...style }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  )
}

// ─── MarqueeStrip ─────────────────────────────────────────────────────────────
function MarqueeStrip() {
  return (
    <div style={{ overflow: "hidden", background: C.dark, padding: "14px 0", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", gap: 32, whiteSpace: "nowrap", width: "max-content" }}
      >
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: C.sans,
              fontWeight: item === "·" ? 300 : 600,
              fontSize: 12,
              letterSpacing: item === "·" ? 0 : "0.12em",
              textTransform: "uppercase",
              color: item === "·" ? C.muted : C.white,
              opacity: item === "·" ? 0.4 : 0.85,
            }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ─── TopicPill ────────────────────────────────────────────────────────────────
function TopicPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      style={{
        cursor: "pointer",
        padding: "8px 20px",
        borderRadius: 999,
        border: `1.5px solid ${active ? C.accent : C.border}`,
        background: active ? C.accent : "transparent",
        color: active ? C.white : C.dark,
        fontFamily: C.sans,
        fontWeight: 600,
        fontSize: 13,
        letterSpacing: "0.04em",
        transition: "background 0.2s, color 0.2s, border-color 0.2s",
      }}
    >
      {label}
    </motion.button>
  )
}

// ─── ArticleCard ─────────────────────────────────────────────────────────────
function ArticleCard({ article, index }: { article: typeof ARTICLES[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      style={{
        background: C.bgCard,
        borderRadius: 4,
        overflow: "hidden",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${C.border}`,
      }}
    >
      <div style={{ position: "relative", height: 220, overflow: "hidden", flexShrink: 0 }}>
        <motion.img
          src={article.img}
          alt={article.title}
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.55 }}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(14,14,14,0.55) 0%, transparent 55%)",
        }} />
        <span style={{
          position: "absolute", top: 16, left: 16,
          fontFamily: C.sans, fontWeight: 700, fontSize: 11,
          letterSpacing: "0.1em", textTransform: "uppercase",
          color: C.white, background: C.accent,
          padding: "4px 10px", borderRadius: 2,
        }}>
          {article.topic}
        </span>
      </div>
      <div style={{ padding: "24px 24px 28px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        <h3 style={{
          fontFamily: C.serif, fontWeight: 700, fontSize: 18,
          color: C.dark, lineHeight: 1.38, margin: 0,
        }}>
          {article.title}
        </h3>
        <p style={{ fontFamily: C.sans, fontSize: 14, color: C.muted, lineHeight: 1.65, margin: 0 }}>
          {article.excerpt}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
          <span style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 13, color: C.dark }}>
            {article.author}
          </span>
          <span style={{ fontFamily: C.sans, fontSize: 12, color: C.muted, letterSpacing: "0.04em" }}>
            {article.reading} read
          </span>
        </div>
      </div>
    </motion.article>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Impact132() {
  const [activeTopic, setActiveTopic] = useState("All")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: containerRef })
  const { scrollY } = useScroll()

  const heroParallaxY = useTransform(scrollYProgress, [0, 0.5], ["0%", "18%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0])
  const navBorderOpacity = useTransform(scrollY, [0, 60], [0, 1])

  // Google Fonts injection
  useEffect(() => {
    const id = "impact-132-fonts"
    if (document.getElementById(id)) return
    const style = document.createElement("style")
    style.id = id
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');`
    document.head.appendChild(style)
  }, [])

  const filteredArticles = activeTopic === "All"
    ? ARTICLES
    : ARTICLES.filter(a => a.topic === activeTopic)

  // ── Nav ──────────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      style={{
        background: C.bg,
        minHeight: "100vh",
        overflowX: "hidden",
        fontFamily: C.sans,
        color: C.dark,
      }}
    >

      {/* ── SECTION 1: Masthead Nav ─────────────────────────────────────────── */}
      <motion.header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: C.bgDark,
          borderBottom: `1px solid rgba(255,255,255,0.07)`,
        }}
      >
        {/* Top bar — issue meta */}
        <div style={{
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "8px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <span style={{ fontFamily: C.sans, fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Vol. XII · Issue 19 · May 13, 2026
          </span>
          <div style={{ display: "flex", gap: 24 }}>
            {["Subscribe", "Sign In"].map(item => (
              <button key={item} style={{
                fontFamily: C.sans, fontSize: 11, fontWeight: 600,
                color: "rgba(255,255,255,0.5)", background: "none", border: "none",
                cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase",
              }}>
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Main nav row */}
        <div style={{
          padding: "0 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}>
          {/* Wordmark */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{
              fontFamily: C.serif,
              fontWeight: 700,
              fontSize: 26,
              color: C.white,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}>
              The Review
            </span>
            <span style={{
              fontFamily: C.sans,
              fontSize: 11,
              fontWeight: 500,
              color: C.accent,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              paddingBottom: 2,
            }}>
              Magazine
            </span>
          </div>

          {/* Nav links */}
          <nav id="mb132-nav" style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {TOPICS.map(t => (
              <button key={t} style={{
                fontFamily: C.sans, fontWeight: 500, fontSize: 13,
                color: "rgba(255,255,255,0.6)", background: "none", border: "none",
                cursor: "pointer", letterSpacing: "0.04em",
                transition: "color 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = C.white)}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                onClick={() => {
                  setActiveTopic(t);
                  document.getElementById("topics")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {t}
              </button>
            ))}
          </nav>

          {/* Subscribe CTA */}
          <div className="mb132-cta">
            <MagneticButton style={{
              padding: "10px 22px",
              background: C.accent,
              border: "none",
              borderRadius: 2,
              fontFamily: C.sans,
              fontWeight: 700,
              fontSize: 13,
              color: C.white,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}>
              Subscribe
            </MagneticButton>
          </div>

          <button
            className="mb132-burger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
            style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 4 }}
          >
            <span style={{ display: "block", width: 24, height: 1.5, background: "rgba(255,255,255,0.8)", transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none" }} />
            <span style={{ display: "block", width: 24, height: 1.5, background: "rgba(255,255,255,0.8)", transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: 24, height: 1.5, background: "rgba(255,255,255,0.8)", transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none" }} />
          </button>
        </div>
      </motion.header>

      {mobileOpen && (
        <div style={{ position: "fixed", top: 120, left: 0, right: 0, zIndex: 99, background: "rgba(10,10,20,0.97)", borderBottom: `1px solid rgba(255,255,255,0.1)`, padding: "24px 32px", display: "flex", flexDirection: "column", gap: 16, backdropFilter: "blur(12px)" }}>
          {TOPICS.map(t => (
            <button key={t} onClick={() => { setActiveTopic(t); setMobileOpen(false); document.getElementById("topics")?.scrollIntoView({ behavior: "smooth" }); }} style={{ fontFamily: C.sans, fontWeight: 500, fontSize: 15, color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer", textAlign: "left", letterSpacing: "0.04em", padding: "4px 0" }}>
              {t}
            </button>
          ))}
        </div>
      )}
      <style>{`@media (max-width: 900px) { #mb132-nav { display: none !important; } .mb132-cta { display: none !important; } .mb132-burger { display: flex !important; } }`}</style>

      {/* ── SECTION 2: Hero with TypewriterHeadline ─────────────────────────── */}
      <section id="hero"
        ref={heroRef}
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          position: "relative",
          overflow: "hidden",
          paddingTop: 120,
        }}
      >
        {/* Parallax background image */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            y: heroParallaxY,
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1800&q=85"
            alt="Hero"
            style={{ width: "100%", height: "110%", objectFit: "cover", display: "block" }}
          />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(10,10,12,0.92) 0%, rgba(10,10,12,0.5) 45%, rgba(10,10,12,0.15) 100%)",
          }} />
        </motion.div>

        {/* Hero content */}
        <motion.div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "0 80px 80px",
            maxWidth: 1200,
            opacity: heroOpacity,
          }}
        >
          {/* Kicker */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 36,
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              style={{
                width: 8, height: 8, borderRadius: "50%",
                background: C.red, display: "inline-block",
              }}
            />
            <span style={{
              fontFamily: C.sans, fontWeight: 700, fontSize: 11,
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: C.red,
            }}>
              Breaking
            </span>
            <span style={{
              fontFamily: C.sans, fontSize: 13,
              color: "rgba(255,255,255,0.55)",
            }}>
              Issue 19 · Flagship Investigation
            </span>
          </motion.div>

          {/* TypewriterHeadline signature element */}
          <TypewriterHeadline />

          {/* Descriptor */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            style={{
              fontFamily: C.sans,
              fontSize: 18,
              fontWeight: 300,
              color: "rgba(255,255,255,0.55)",
              marginTop: 28,
              maxWidth: 560,
              lineHeight: 1.7,
            }}
          >
            Rigorous, long-form reporting on the forces remaking technology, business, culture, science, and political life.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            style={{ display: "flex", gap: 16, marginTop: 44, alignItems: "center" }}
          >
            <MagneticButton style={{
              padding: "14px 32px",
              background: C.white,
              border: "none",
              borderRadius: 2,
              fontFamily: C.sans,
              fontWeight: 700,
              fontSize: 14,
              color: C.dark,
              letterSpacing: "0.04em",
            }}>
              Read the Issue
            </MagneticButton>
            <button style={{
              padding: "14px 32px",
              background: "transparent",
              border: `1px solid rgba(255,255,255,0.3)`,
              borderRadius: 2,
              fontFamily: C.sans,
              fontWeight: 500,
              fontSize: 14,
              color: "rgba(255,255,255,0.75)",
              cursor: "pointer",
            }}>
              Our Mission ↓
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute",
          bottom: 36,
          right: 64,
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            style={{
              width: 1,
              height: 52,
              background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 100%)",
            }}
          />
          <span style={{
            fontFamily: C.sans, fontSize: 10, fontWeight: 600,
            color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em",
            textTransform: "uppercase", writingMode: "vertical-rl",
          }}>
            Scroll
          </span>
        </div>
      </section>

      {/* ── SECTION 3: MarqueeStrip ──────────────────────────────────────────── */}
      <MarqueeStrip />

      {/* ── SECTION 4: Featured Article ──────────────────────────────────────── */}
      <section style={{ background: C.bg, padding: "80px 80px 60px" }}>
        <TextReveal>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
            <span style={{
              fontFamily: C.sans, fontWeight: 700, fontSize: 11,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: C.accent,
            }}>
              Cover Story
            </span>
            <div style={{ height: 1, flex: 1, background: C.border }} />
          </div>
        </TextReveal>

        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.3 }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
            background: C.bgCard,
            border: `1px solid ${C.border}`,
            cursor: "pointer",
            overflow: "hidden",
          }}
        >
          {/* Image side */}
          <div style={{ position: "relative", overflow: "hidden", minHeight: 520 }}>
            <motion.img
              src={FEATURED.img}
              alt={FEATURED.title}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.6 }}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(26,26,255,0.18) 0%, transparent 60%)",
            }} />
          </div>

          {/* Content side */}
          <div style={{
            padding: "56px 52px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}>
            <div>
              <span style={{
                fontFamily: C.sans, fontWeight: 700, fontSize: 11,
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: C.accent, display: "block", marginBottom: 20,
              }}>
                {FEATURED.topic}
              </span>
              <TextReveal delay={0.1}>
                <h2 style={{
                  fontFamily: C.serif,
                  fontWeight: 700,
                  fontSize: "clamp(24px, 2.8vw, 38px)",
                  color: C.dark,
                  lineHeight: 1.22,
                  margin: "0 0 24px",
                }}>
                  {FEATURED.title}
                </h2>
              </TextReveal>
              <TextReveal delay={0.2}>
                <p style={{
                  fontFamily: C.sans,
                  fontSize: 16,
                  fontWeight: 300,
                  color: C.muted,
                  lineHeight: 1.72,
                  margin: 0,
                }}>
                  {FEATURED.subtitle}
                </p>
              </TextReveal>
            </div>

            <div>
              <div style={{ height: 1, background: C.border, margin: "36px 0 28px" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 14, color: C.dark }}>
                    {FEATURED.author}
                  </div>
                  <div style={{ fontFamily: C.sans, fontSize: 12, color: C.muted, marginTop: 3 }}>
                    {FEATURED.role} · {FEATURED.date}
                  </div>
                </div>
                <div style={{
                  fontFamily: C.sans, fontSize: 12, fontWeight: 500,
                  color: C.muted, letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}>
                  {FEATURED.reading} read
                </div>
              </div>

              <MagneticButton style={{
                marginTop: 32,
                width: "100%",
                padding: "14px 0",
                background: C.dark,
                border: "none",
                borderRadius: 2,
                fontFamily: C.sans,
                fontWeight: 700,
                fontSize: 13,
                color: C.white,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}>
                Read Full Article →
              </MagneticButton>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── SECTION 5: Article Grid (5 articles, asymmetric editorial layout) ── */}
      <section style={{ background: C.bg, padding: "20px 80px 80px" }}>
        <TextReveal>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
            <span style={{
              fontFamily: C.sans, fontWeight: 700, fontSize: 11,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: C.muted,
            }}>
              Latest Dispatches
            </span>
            <div style={{ height: 1, flex: 1, background: C.border }} />
          </div>
        </TextReveal>

        {/* Row 1: large + two smalls */}
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: 24, marginBottom: 24 }}>
          {ARTICLES.slice(0, 3).map((article, i) => (
            <ArticleCard key={article.id} article={article} index={i} />
          ))}
        </div>

        {/* Row 2: two mediums */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {ARTICLES.slice(3, 5).map((article, i) => (
            <ArticleCard key={article.id} article={article} index={i + 3} />
          ))}
        </div>
      </section>

      {/* ── SECTION 6: Topic Filter with AnimatePresence transitions ─────────── */}
      <section id="topics" style={{ background: C.bgCard, padding: "72px 80px", borderTop: `1px solid ${C.border}` }}>
        <TextReveal>
          <h2 style={{
            fontFamily: C.serif, fontWeight: 700, fontSize: 32,
            color: C.dark, marginBottom: 36, letterSpacing: "-0.02em",
          }}>
            Browse by Topic
          </h2>
        </TextReveal>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: 10, marginBottom: 52, flexWrap: "wrap" }}>
          {["All", ...TOPICS].map(t => (
            <TopicPill key={t} label={t} active={activeTopic === t} onClick={() => setActiveTopic(t)} />
          ))}
        </div>

        {/* Filtered results with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTopic}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}
          >
            {filteredArticles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: i * 0.07 }}
                style={{
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  borderRadius: 3,
                  padding: "28px 28px 24px",
                  cursor: "pointer",
                }}
              >
                <span style={{
                  fontFamily: C.sans, fontWeight: 700, fontSize: 10,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: C.accent, display: "block", marginBottom: 12,
                }}>
                  {article.topic}
                </span>
                <h4 style={{
                  fontFamily: C.serif, fontWeight: 700, fontSize: 17,
                  color: C.dark, lineHeight: 1.38, margin: "0 0 12px",
                }}>
                  {article.title}
                </h4>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: C.sans, fontSize: 13, fontWeight: 600, color: C.dark }}>
                    {article.author}
                  </span>
                  <span style={{ fontFamily: C.sans, fontSize: 12, color: C.muted }}>
                    {article.reading}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── SECTION 7: Newsletter CTA ────────────────────────────────────────── */}
      <section style={{
        background: C.dark,
        padding: "100px 80px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative lines */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${12 + i * 20}%`,
              width: 1,
              background: "rgba(26,26,255,0.12)",
              pointerEvents: "none",
            }}
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8 }}
          />
        ))}

        <div style={{ position: "relative", zIndex: 2, maxWidth: 640, margin: "0 auto" }}>
          <TextReveal>
            <span style={{
              fontFamily: C.sans, fontWeight: 700, fontSize: 11,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: C.accent, display: "block", marginBottom: 24,
            }}>
              The Weekly Dispatch
            </span>
          </TextReveal>

          <TextReveal delay={0.1}>
            <h2 style={{
              fontFamily: C.serif,
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: "clamp(28px, 3.5vw, 48px)",
              color: C.white,
              lineHeight: 1.22,
              margin: "0 0 20px",
              letterSpacing: "-0.02em",
            }}>
              The world's best editorial journalism, in your inbox every Sunday.
            </h2>
          </TextReveal>

          <TextReveal delay={0.2}>
            <p style={{
              fontFamily: C.sans,
              fontSize: 16,
              fontWeight: 300,
              color: "rgba(255,255,255,0.45)",
              marginBottom: 48,
              lineHeight: 1.7,
            }}>
              Join 340,000 readers who start their week with The Review. No noise. No algorithm. Just the five stories that matter most, with original commentary from our editors.
            </p>
          </TextReveal>

          {!subscribed ? (
            <TextReveal delay={0.3}>
              <div style={{ display: "flex", gap: 0, maxWidth: 480, margin: "0 auto" }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{
                    flex: 1,
                    padding: "15px 20px",
                    background: "rgba(255,255,255,0.06)",
                    border: `1px solid rgba(255,255,255,0.15)`,
                    borderRight: "none",
                    borderRadius: "2px 0 0 2px",
                    fontFamily: C.sans,
                    fontSize: 14,
                    color: C.white,
                    outline: "none",
                  }}
                />
                <MagneticButton
                  onClick={() => { if (email) setSubscribed(true) }}
                  style={{
                    padding: "15px 28px",
                    background: C.accent,
                    border: "none",
                    borderRadius: "0 2px 2px 0",
                    fontFamily: C.sans,
                    fontWeight: 700,
                    fontSize: 13,
                    color: C.white,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  Subscribe Free
                </MagneticButton>
              </div>
            </TextReveal>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                padding: "20px 32px",
                background: "rgba(26,26,255,0.15)",
                border: `1px solid ${C.accent}`,
                borderRadius: 2,
                fontFamily: C.sans,
                fontSize: 15,
                color: C.white,
                display: "inline-block",
              }}
            >
              You're subscribed. First edition arrives Sunday.
            </motion.div>
          )}

          <p style={{
            fontFamily: C.sans, fontSize: 12, color: "rgba(255,255,255,0.25)",
            marginTop: 18,
          }}>
            Unsubscribe at any time. No spam. We take privacy seriously.
          </p>
        </div>
      </section>

      {/* ── SECTION 8: Editor's Picks ─────────────────────────────────────────── */}
      <section style={{ background: C.bg, padding: "80px 80px 72px" }}>
        <TextReveal>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 52 }}>
            <span style={{
              fontFamily: C.sans, fontWeight: 700, fontSize: 11,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: C.dark,
            }}>
              Editor's Picks
            </span>
            <div style={{ height: 1, flex: 1, background: C.border }} />
            <span style={{
              fontFamily: C.serif, fontStyle: "italic", fontSize: 13,
              color: C.muted,
            }}>
              Selected by the Editors
            </span>
          </div>
        </TextReveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: C.border }}>
          {EDITORS_PICKS.map((pick, i) => {
            const ref = useRef(null)
            const isInView = useInView(ref, { once: true, margin: "-40px" })
            return (
              <motion.article
                key={pick.id}
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                whileHover={{ background: C.bgCard }}
                style={{
                  background: C.bg,
                  padding: "40px 36px",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              >
                <div style={{ position: "relative", height: 180, overflow: "hidden", marginBottom: 24 }}>
                  <motion.img
                    src={pick.img}
                    alt={pick.title}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
                <div style={{
                  fontFamily: C.sans, fontWeight: 700, fontSize: 10,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: C.accent, marginBottom: 14,
                }}>
                  {pick.topic}
                </div>
                <h3 style={{
                  fontFamily: C.serif, fontWeight: 700, fontSize: 20,
                  color: C.dark, lineHeight: 1.35, margin: "0 0 20px",
                }}>
                  {pick.title}
                </h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: C.sans, fontSize: 13, fontWeight: 500, color: C.dark }}>
                    {pick.author}
                  </span>
                  <span style={{ fontFamily: C.sans, fontSize: 12, color: C.muted }}>
                    {pick.reading} read
                  </span>
                </div>
              </motion.article>
            )
          })}
        </div>
      </section>

      {/* ── SECTION 9: About / Mission ───────────────────────────────────────── */}
      <section id="contact" style={{
        background: C.bgDark,
        padding: "96px 80px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(26,26,255,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 96, alignItems: "center" }}>
          <div>
            <TextReveal>
              <span style={{
                fontFamily: C.sans, fontWeight: 700, fontSize: 11,
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: C.accent, display: "block", marginBottom: 24,
              }}>
                Our Mission
              </span>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2 style={{
                fontFamily: C.serif,
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: "clamp(28px, 3vw, 44px)",
                color: C.white,
                lineHeight: 1.2,
                margin: "0 0 28px",
                letterSpacing: "-0.02em",
              }}>
                We exist to make the world's most important ideas accessible to anyone curious enough to seek them.
              </h2>
            </TextReveal>
            <TextReveal delay={0.2}>
              <p style={{
                fontFamily: C.sans,
                fontSize: 16,
                fontWeight: 300,
                color: "rgba(255,255,255,0.48)",
                lineHeight: 1.78,
                marginBottom: 20,
              }}>
                Founded in 2014, The Review was built on a single conviction: that long-form journalism, done with rigour and independence, changes how people think and act. We cover the intersections of technology, power, culture, science, and democracy.
              </p>
            </TextReveal>
            <TextReveal delay={0.25}>
              <p style={{
                fontFamily: C.sans,
                fontSize: 16,
                fontWeight: 300,
                color: "rgba(255,255,255,0.48)",
                lineHeight: 1.78,
              }}>
                We accept no venture capital. We carry no programmatic advertising. Our only obligation is to our readers, and to the truth.
              </p>
            </TextReveal>
          </div>

          <div>
            {[
              { stat: "340K+", label: "Subscribers worldwide" },
              { stat: "1,200+", label: "Investigations published" },
              { stat: "12 years", label: "Of independent journalism" },
              { stat: "0", label: "Investor obligations" },
            ].map((item, i) => {
              const ref = useRef(null)
              const isInView = useInView(ref, { once: true, margin: "-40px" })
              return (
                <motion.div
                  key={item.stat}
                  ref={ref}
                  initial={{ opacity: 0, x: 24 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 24,
                    padding: "28px 0",
                    borderBottom: i < 3 ? `1px solid rgba(255,255,255,0.08)` : "none",
                  }}
                >
                  <span style={{
                    fontFamily: C.serif,
                    fontWeight: 700,
                    fontSize: 40,
                    color: C.white,
                    lineHeight: 1,
                    minWidth: 120,
                  }}>
                    {item.stat}
                  </span>
                  <span style={{
                    fontFamily: C.sans,
                    fontSize: 14,
                    color: "rgba(255,255,255,0.38)",
                    letterSpacing: "0.04em",
                  }}>
                    {item.label}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 10: Footer ──────────────────────────────────────────────── */}
      <footer style={{
        background: "#08080A",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "64px 80px 40px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Top row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 64,
            paddingBottom: 56,
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}>
            {/* Brand */}
            <div>
              <div style={{
                fontFamily: C.serif,
                fontWeight: 700,
                fontSize: 22,
                color: C.white,
                marginBottom: 16,
                letterSpacing: "-0.02em",
              }}>
                The Review
              </div>
              <p style={{
                fontFamily: C.sans,
                fontSize: 13,
                fontWeight: 300,
                color: "rgba(255,255,255,0.35)",
                lineHeight: 1.75,
                maxWidth: 260,
              }}>
                Independent journalism for the curious mind. Technology, business, culture, science, politics.
              </p>
            </div>

            {/* Column links */}
            {[
              { heading: "Sections", links: TOPICS },
              { heading: "Company", links: ["About", "Careers", "Press", "Contact"] },
              { heading: "Subscribe", links: ["Weekly Dispatch", "Digital Access", "Print Edition", "Gift a Sub"] },
            ].map(col => (
              <div key={col.heading}>
                <div style={{
                  fontFamily: C.sans,
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                  marginBottom: 20,
                }}>
                  {col.heading}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {col.links.map(link => (
                    <button key={link} style={{
                      fontFamily: C.sans,
                      fontSize: 13,
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.45)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      padding: 0,
                      transition: "color 0.2s",
                    }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.white)}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                    >
                      {link}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 32,
          }}>
            <span style={{
              fontFamily: C.sans,
              fontSize: 12,
              color: "rgba(255,255,255,0.2)",
            }}>
              © 2026 The Review Magazine. All rights reserved.
            </span>
            <div style={{ display: "flex", gap: 24 }}>
              {["Privacy Policy", "Terms of Use", "Accessibility"].map(item => (
                <button key={item} style={{
                  fontFamily: C.sans,
                  fontSize: 12,
                  color: "rgba(255,255,255,0.25)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "color 0.2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
