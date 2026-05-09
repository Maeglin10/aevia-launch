"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"

const C = {
  bg: "#080f0a",
  cardBg: "#0d160f",
  green: "#00e676",
  greenDim: "rgba(0,230,118,0.7)",
  greenGlow: "rgba(0,230,118,0.12)",
  greenBorder: "rgba(0,230,118,0.2)",
  greenBorderHover: "rgba(0,230,118,0.5)",
  white: "#ffffff",
  gray: "#8a9e8e",
  grayDim: "rgba(138,158,142,0.6)",
  dark: "#040a05",
}

const mono = '"JetBrains Mono", "Courier New", monospace'
const sans = "system-ui, -apple-system, sans-serif"

function useCounter(target: number, active: boolean, duration = 1800) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [active, target, duration])
  return count
}

// ─── BLINKING CURSOR ──────────────────────────────────────────────────────────
function BlinkingCursor() {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const t = setInterval(() => setVisible(v => !v), 530)
    return () => clearInterval(t)
  }, [])
  return (
    <span style={{ display: "inline-block", width: "3px", height: "0.9em", background: C.green, marginLeft: "4px", verticalAlign: "middle", opacity: visible ? 1 : 0, transition: "opacity 0.05s" }} />
  )
}

// ─── TERMINAL CARD ────────────────────────────────────────────────────────────
const LOG_LINES = [
  { t: 0, text: "[SCAN] 14:32:01 — Initialisation analyse réseau...", color: C.greenDim },
  { t: 900, text: "[INFO] 14:32:03 — 247 hôtes détectés sur 10.0.0.0/24", color: C.gray },
  { t: 1800, text: "[WARN] 14:32:07 — Port 22 exposé sur srv-ext-03", color: "#ffb74d" },
  { t: 2700, text: "[BLOCK] 14:32:09 — IP 185.234.219.4 → liste noire", color: C.green },
  { t: 3600, text: "[CRIT] 14:32:14 — Tentative brute-force bloquée", color: "#ef5350" },
  { t: 4500, text: "[OK] 14:32:18 — Rapport incident #7821 généré ✓", color: C.green },
]

function TerminalCard({ terminalY }: { terminalY: ReturnType<typeof useTransform> }) {
  const [visibleLines, setVisibleLines] = useState<typeof LOG_LINES>([])
  const [loopKey, setLoopKey] = useState(0)

  useEffect(() => {
    setVisibleLines([])
    const timers: ReturnType<typeof setTimeout>[] = []
    LOG_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleLines(prev => [...prev, line])
      }, line.t)
      timers.push(t)
    })
    const reset = setTimeout(() => {
      setLoopKey(k => k + 1)
    }, 6800)
    timers.push(reset)
    return () => timers.forEach(clearTimeout)
  }, [loopKey])

  return (
    <motion.div
      style={{ y: terminalY, flex: "1 1 380px", maxWidth: "480px" }}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.7 }}>
      <div style={{ background: C.cardBg, border: `1px solid ${C.greenBorder}`, borderRadius: "12px", overflow: "hidden", boxShadow: `0 0 40px rgba(0,230,118,0.08), 0 20px 60px rgba(0,0,0,0.5)` }}>
        {/* Terminal header */}
        <div style={{ padding: "0.75rem 1rem", background: "#0a1a0c", borderBottom: `1px solid ${C.greenBorder}`, display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef5350" }} />
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ffb74d" }} />
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#00e676" }} />
          <span style={{ marginLeft: "0.5rem", fontFamily: mono, fontSize: "0.72rem", color: C.gray }}>fortress-soc — threat-scanner v2.4.1</span>
        </div>
        {/* Terminal body */}
        <div style={{ padding: "1.25rem 1.25rem", minHeight: "240px", fontFamily: mono, fontSize: "0.76rem", lineHeight: 1.85 }}>
          <AnimatePresence>
            {visibleLines.map((line, i) => (
              <motion.div
                key={`${loopKey}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                style={{ color: line.color, wordBreak: "break-all" }}>
                {line.text}
              </motion.div>
            ))}
          </AnimatePresence>
          {visibleLines.length < LOG_LINES.length && (
            <span style={{ color: C.green }}>█</span>
          )}
        </div>
        {/* Status bar */}
        <div style={{ padding: "0.6rem 1.25rem", background: "#0a1a0c", borderTop: `1px solid ${C.greenBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: mono, fontSize: "0.7rem", color: C.green }}>● SOC ACTIF</span>
          <span style={{ fontFamily: mono, fontSize: "0.7rem", color: C.gray }}>uptime: 99.98%</span>
          <span style={{ fontFamily: mono, fontSize: "0.7rem", color: C.gray }}>TLS 1.3 ✓</span>
        </div>
      </div>
    </motion.div>
  )
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const links = ["Solutions", "SOC 24/7", "Conformité", "Tarifs", "Contact"]

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100 }}>
      {/* Animated top border */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        style={{ height: "2px", background: `linear-gradient(90deg, transparent, ${C.green}, transparent)`, transformOrigin: "left" }} />

      <div style={{ background: scrolled ? "rgba(8,15,10,0.97)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? `1px solid ${C.greenBorder}` : "none", padding: "0 2rem", height: "70px", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "background 0.3s, backdrop-filter 0.3s" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" fill={C.green} fillOpacity="0.12" />
            <rect width="28" height="28" rx="6" stroke={C.green} strokeWidth="1" />
            <path d="M7 14 L11 10 L14 13 L17 8 L21 14" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="14" cy="20" r="2" fill={C.green} />
          </svg>
          <span style={{ fontFamily: mono, fontWeight: 700, fontSize: "1.15rem", color: C.white, letterSpacing: "0.08em" }}>FORTRESS</span>
        </div>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          {links.map(l => (
            <Link key={l} href="#" style={{ fontFamily: sans, color: C.gray, fontSize: "0.88rem", fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.green)}
              onMouseLeave={e => (e.currentTarget.style.color = C.gray)}>
              {l}
            </Link>
          ))}
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: `0 0 20px rgba(0,230,118,0.3)` }}
            whileTap={{ scale: 0.97 }}
            style={{ cursor: "pointer", background: "transparent", color: C.green, border: `1.5px solid ${C.green}`, borderRadius: "6px", padding: "0.55rem 1.3rem", fontFamily: mono, fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.08em", transition: "box-shadow 0.2s" }}>
            Audit Gratuit
          </motion.button>
        </div>
      </div>
    </motion.nav>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const { scrollY } = useScroll()
  const heroTextY = useTransform(scrollY, [0, 500], [0, -40])
  const terminalY = useTransform(scrollY, [0, 500], [0, 20])
  const [pulse, setPulse] = useState(true)

  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 1800)
    return () => clearInterval(t)
  }, [])

  return (
    <section style={{ position: "relative", minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", overflow: "hidden", paddingTop: "70px" }}>
      {/* Grid background */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.greenBorder} 1px, transparent 1px), linear-gradient(90deg, ${C.greenBorder} 1px, transparent 1px)`, backgroundSize: "60px 60px", opacity: 0.4, pointerEvents: "none" }} />
      {/* Radial glow */}
      <div style={{ position: "absolute", top: "40%", left: "30%", transform: "translate(-50%,-50%)", width: "600px", height: "600px", background: "radial-gradient(ellipse, rgba(0,230,118,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 2rem", display: "flex", alignItems: "center", gap: "4rem", flexWrap: "wrap", width: "100%", position: "relative", zIndex: 2 }}>
        {/* Left text */}
        <motion.div style={{ y: heroTextY, flex: "1 1 400px" }}>
          {/* Threat counter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", background: C.greenGlow, border: `1px solid ${C.greenBorder}`, borderRadius: "6px", padding: "0.4rem 1rem", marginBottom: "2rem" }}>
            <motion.span
              animate={{ scale: pulse ? 1.3 : 1, opacity: pulse ? 1 : 0.5 }}
              transition={{ duration: 0.4 }}
              style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: C.green, flexShrink: 0 }} />
            <span style={{ fontFamily: mono, fontSize: "0.78rem", color: C.green }}>+247 menaces bloquées aujourd'hui</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            style={{ fontFamily: mono, fontWeight: 700, fontSize: "clamp(2.2rem, 5vw, 3.8rem)", color: C.white, lineHeight: 1.15, marginBottom: "1.5rem" }}>
            Votre Sécurité.<br />
            <span style={{ color: C.green }}>Notre Mission.</span>
            <BlinkingCursor />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{ fontFamily: sans, color: C.gray, fontSize: "1.05rem", lineHeight: 1.75, maxWidth: "480px", marginBottom: "2.5rem" }}>
            Fortress protège les PME et ETI contre les cybermenaces 24h/24 avec un SOC dédié, des audits de conformité RGPD et une réponse aux incidents en moins de 15 minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: `0 0 30px rgba(0,230,118,0.35)` }}
              whileTap={{ scale: 0.97 }}
              style={{ cursor: "pointer", background: C.green, color: C.dark, border: "none", borderRadius: "8px", padding: "0.85rem 2rem", fontFamily: mono, fontWeight: 700, fontSize: "0.88rem", letterSpacing: "0.06em", transition: "box-shadow 0.2s" }}>
              Audit Gratuit →
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, borderColor: C.green, color: C.white }}
              whileTap={{ scale: 0.97 }}
              style={{ cursor: "pointer", background: "transparent", color: C.gray, border: `1.5px solid ${C.greenBorder}`, borderRadius: "8px", padding: "0.85rem 2rem", fontFamily: mono, fontWeight: 700, fontSize: "0.88rem", letterSpacing: "0.06em", transition: "border-color 0.2s, color 0.2s" }}>
              Voir le SOC
            </motion.button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            style={{ marginTop: "2.5rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {["ISO 27001", "RGPD Conforme", "ANSSI Référencé"].map(badge => (
              <div key={badge} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="7" fill={C.greenGlow} /><path d="M4 7l2 2 4-4" stroke={C.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span style={{ fontFamily: mono, fontSize: "0.72rem", color: C.gray }}>{badge}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Terminal */}
        <TerminalCard terminalY={terminalY} />
      </div>
    </section>
  )
}

// ─── STATS BAR ────────────────────────────────────────────────────────────────
function StatItem({ value, suffix, label, active, decimals }: { value: number; suffix: string; label: string; active: boolean; decimals?: boolean }) {
  const count = useCounter(decimals ? Math.round(value * 100) : value, active)
  const display = decimals ? (count / 100).toFixed(2) : count

  return (
    <div style={{ textAlign: "center", flex: "1 1 160px" }}>
      <div style={{ fontFamily: mono, fontWeight: 700, fontSize: "clamp(2rem, 3.5vw, 2.8rem)", color: C.green, lineHeight: 1 }}>
        {display}{suffix}
      </div>
      <div style={{ fontFamily: sans, color: C.gray, fontSize: "0.85rem", marginTop: "0.4rem" }}>{label}</div>
    </div>
  )
}

function StatsBar() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  const stats = [
    { value: 1200, suffix: "+", label: "Entreprises protégées", decimals: false },
    { value: 9998, suffix: "%", label: "Uptime garanti (SLA)", decimals: true },
    { value: 15, suffix: " min", label: "Temps de réponse incident", decimals: false },
    { value: 0, suffix: "", label: "Brèche confirmée depuis 2019", decimals: false },
  ]

  return (
    <section ref={ref} style={{ background: C.cardBg, borderTop: `1px solid ${C.greenBorder}`, borderBottom: `1px solid ${C.greenBorder}`, padding: "4.5rem 2rem" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        style={{ maxWidth: "960px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "3rem", justifyContent: "space-around", alignItems: "center" }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.12, duration: 0.6 }}>
            <StatItem value={s.value} suffix={s.suffix} label={s.label} active={inView} decimals={s.decimals} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

// ─── FEATURES / TABS ──────────────────────────────────────────────────────────
function Features() {
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  const tabs = [
    {
      label: "Audit & Conformité",
      headline: "Conformité RGPD et NIS2 Sans Compromis",
      body: "Nos auditeurs certifiés CISA et ISO 27001 analysent l'intégralité de votre système d'information : infrastructure, applications, politiques internes, gestion des accès. Vous recevez un rapport priorisé avec un plan de remédiation actionnable et un accompagnement jusqu'à la certification.",
      points: ["Audit technique complet du SI (2-5 jours)", "Analyse des risques selon ISO 27005", "Plan de mise en conformité RGPD / NIS2", "Rapport RSSI livré en 72h", "Accompagnement remédiation inclus"],
    },
    {
      label: "SOC 24/7",
      headline: "Centre Opérationnel de Sécurité Permanent",
      body: "Notre SOC surveille en temps réel vos équipements, serveurs, postes et applications. Des analystes N1/N2/N3 qualifiés répondent à chaque alerte, 24h/24, 365j/an. Avec un SIEM de dernière génération et des playbooks éprouvés, nous containons les incidents avant qu'ils deviennent des catastrophes.",
      points: ["Surveillance temps réel 24h/365j", "SIEM corrélation multi-sources", "Temps de réponse garanti 15 min", "Analystes N1 N2 N3 certifiés", "Escalade et astreinte RSSI on-call"],
    },
    {
      label: "Formation Équipes",
      headline: "Vos Collaborateurs, Première Ligne de Défense",
      body: "85% des incidents sont liés à l'erreur humaine. Nos formations sensibilisent vos équipes aux vraies menaces : phishing, ingénierie sociale, gestion des mots de passe, comportement sur le réseau. E-learning, ateliers pratiques, simulations de phishing ciblé — nous adaptons tout à votre secteur.",
      points: ["Phishing simulation mensuelle", "E-learning modules certifiants", "Ateliers hands-on en présentiel", "Rapports de progression individuels", "Formation RSSI / IT sur demande"],
    },
    {
      label: "Réponse à Incident",
      headline: "Containment Immédiat. Reprise Rapide.",
      body: "Lorsqu'une attaque survient, chaque minute compte. Notre équipe DFIR (Digital Forensics & Incident Response) intervient en remote ou sur site en moins de 4 heures. Isolation des systèmes compromis, analyse forensique, reconstruction des journaux, rapport légal pour assureurs et autorités.",
      points: ["Intervention remote en 15 min", "Déplacement sur site en 4h (France)", "Isolation & containment immédiats", "Analyse forensique complète", "Rapport légal pour assureurs / CNIL"],
    },
  ]

  const tab = tabs[active]

  return (
    <section ref={ref} style={{ background: C.bg, padding: "6rem 2rem" }}>
      <div style={{ maxWidth: "1050px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ fontFamily: mono, color: C.green, fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}># nos solutions</p>
          <h2 style={{ fontFamily: mono, fontWeight: 700, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: C.white, lineHeight: 1.15 }}>
            Une Protection <span style={{ color: C.green }}>360°</span>
          </h2>
        </motion.div>

        {/* Tab buttons */}
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem" }}>
          {tabs.map((t, i) => (
            <motion.button
              key={t.label}
              onClick={() => setActive(i)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{ cursor: "pointer", background: active === i ? C.greenGlow : "transparent", color: active === i ? C.green : C.gray, border: `1px solid ${active === i ? C.green : C.greenBorder}`, borderRadius: "6px", padding: "0.5rem 1.1rem", fontFamily: mono, fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.06em", transition: "all 0.22s" }}>
              {t.label}
            </motion.button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            style={{ background: C.cardBg, border: `1px solid ${C.greenBorder}`, borderRadius: "14px", padding: "2.5rem", display: "flex", gap: "3rem", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 260px" }}>
              <div style={{ fontFamily: mono, fontSize: "0.72rem", color: C.green, marginBottom: "0.75rem", letterSpacing: "0.1em" }}>// {tabs[active].label.toLowerCase()}</div>
              <h3 style={{ fontFamily: mono, fontWeight: 700, fontSize: "1.3rem", color: C.white, lineHeight: 1.3, marginBottom: "1rem" }}>{tab.headline}</h3>
              <p style={{ fontFamily: sans, color: C.gray, fontSize: "0.93rem", lineHeight: 1.75 }}>{tab.body}</p>
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <p style={{ fontFamily: mono, fontWeight: 700, fontSize: "0.72rem", color: C.green, letterSpacing: "0.15em", marginBottom: "1rem" }}>// INCLUS</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {tab.points.map(p => (
                  <li key={p} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", fontFamily: sans, color: "#b0c4b3", fontSize: "0.88rem", lineHeight: 1.55 }}>
                    <span style={{ color: C.green, fontFamily: mono, flexShrink: 0, marginTop: "2px" }}>▸</span>
                    {p}
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.04, background: C.green, color: C.dark }}
                whileTap={{ scale: 0.97 }}
                style={{ cursor: "pointer", marginTop: "1.75rem", background: "transparent", color: C.green, border: `1px solid ${C.green}`, borderRadius: "6px", padding: "0.65rem 1.5rem", fontFamily: mono, fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.06em", transition: "all 0.2s" }}>
                En savoir plus →
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

// ─── TESTIMONIALS CAROUSEL ────────────────────────────────────────────────────
function Testimonials() {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  const testimonials = [
    { name: "Renaud M.", role: "DSI — Groupe Laroche (380 salariés)", text: "Nous avons subi une tentative de ransomware à 3h du matin. L'équipe Fortress a isolé le serveur en 8 minutes, avant toute propagation. Sans eux, nous aurions perdu des semaines de données clients. Je ne peux que recommander.", stars: 5 },
    { name: "Isabelle C.", role: "DAF — Cabinet Juridique Delorme", text: "La conformité RGPD nous faisait peur. L'audit Fortress a été clair, pédagogique et sans jargon. En 3 mois, nous étions conformes avec un DPO externalisé et un registre des traitements complet. Parfait pour une structure de 45 personnes.", stars: 5 },
    { name: "Thomas K.", role: "CEO — SaaS Fintech Proxio", text: "Notre client bancaire exigeait une certification ISO 27001. Fortress nous a accompagnés de A à Z : audit, plan de remédiation, formation équipes, passage de l'audit de certification. Obtenu du premier coup. Deal-breaker évité.", stars: 5 },
    { name: "Claire B.", role: "IT Manager — Clinique Saint-Exupéry", text: "Secteur médical, données sensibles — nous n'avions pas le droit à l'erreur. Le SOC 24/7 Fortress nous donne une visibilité totale sur notre réseau. Les rapports mensuels sont lisibles par la direction non-technique. Excellent.", stars: 5 },
  ]

  const prev = () => { setDirection(-1); setActive(a => (a - 1 + testimonials.length) % testimonials.length) }
  const next = () => { setDirection(1); setActive(a => (a + 1) % testimonials.length) }

  const t = testimonials[active]

  return (
    <section ref={ref} style={{ background: C.cardBg, borderTop: `1px solid ${C.greenBorder}`, padding: "6rem 2rem" }}>
      <div style={{ maxWidth: "820px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <p style={{ fontFamily: mono, color: C.green, fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}># retours clients</p>
          <h2 style={{ fontFamily: mono, fontWeight: 700, fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: C.white, lineHeight: 1.15 }}>
            Ce Que Disent<br /><span style={{ color: C.green }}>Nos Clients</span>
          </h2>
        </motion.div>

        <div style={{ position: "relative", overflow: "hidden", borderRadius: "14px" }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 60 }}
              transition={{ duration: 0.38, ease: "easeInOut" }}
              style={{ background: C.bg, border: `1px solid ${C.greenBorder}`, borderRadius: "14px", padding: "2.5rem 3rem" }}>
              <div style={{ fontFamily: mono, fontSize: "0.72rem", color: C.green, letterSpacing: "0.1em", marginBottom: "1rem" }}>{"★".repeat(t.stars).split("").join("  ")}</div>
              <p style={{ fontFamily: sans, color: "#c8d8cb", fontSize: "1.02rem", lineHeight: 1.8, fontStyle: "italic", marginBottom: "1.8rem" }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: C.greenGlow, border: `1px solid ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, fontWeight: 700, color: C.green, fontSize: "0.85rem" }}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontFamily: mono, fontWeight: 700, fontSize: "0.9rem", color: C.white }}>{t.name}</div>
                  <div style={{ fontFamily: sans, color: C.gray, fontSize: "0.8rem", marginTop: "0.1rem" }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1.5rem", marginTop: "2rem" }}>
          <motion.button onClick={prev} whileHover={{ scale: 1.1, borderColor: C.green }} whileTap={{ scale: 0.9 }} style={{ cursor: "pointer", background: "transparent", border: `1px solid ${C.greenBorder}`, borderRadius: "50%", width: "42px", height: "42px", color: C.green, fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, transition: "border-color 0.2s" }}>‹</motion.button>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => { setDirection(i > active ? 1 : -1); setActive(i) }} style={{ cursor: "pointer", width: i === active ? "22px" : "7px", height: "7px", borderRadius: "4px", background: i === active ? C.green : C.greenBorder, border: "none", transition: "all 0.3s" }} />
            ))}
          </div>
          <motion.button onClick={next} whileHover={{ scale: 1.1, borderColor: C.green }} whileTap={{ scale: 0.9 }} style={{ cursor: "pointer", background: "transparent", border: `1px solid ${C.greenBorder}`, borderRadius: "50%", width: "42px", height: "42px", color: C.green, fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, transition: "border-color 0.2s" }}>›</motion.button>
        </div>
      </div>
    </section>
  )
}

// ─── PRICING ──────────────────────────────────────────────────────────────────
function Pricing() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  const plans = [
    {
      name: "Essentiel",
      price: "490",
      unit: "€ / mois",
      scope: "Monitoring basique — 1 à 50 postes",
      tag: null,
      features: ["Monitoring réseau 8h-20h j. ouvrés", "Alertes email & SMS", "Rapport mensuel de sécurité", "Scan de vulnérabilités mensuel", "Support ticket J+1"],
      cta: "Commencer",
      highlight: false,
    },
    {
      name: "Professionnel",
      price: "1 290",
      unit: "€ / mois",
      scope: "SOC 24/7 — 51 à 200 postes",
      tag: "Recommandé PME",
      features: ["SOC actif 24h/24 — 365j/an", "SIEM corrélation multi-sources", "Réponse incident sous 15 min", "Scan hebdomadaire + pentest semestriel", "RSSI externalisé 4h/mois", "Formation équipes incluse", "Dashboard temps réel"],
      cta: "Choisir ce plan",
      highlight: true,
    },
    {
      name: "Entreprise",
      price: "Sur devis",
      unit: "",
      scope: "SIEM + Pentest annuel — 200+ postes",
      tag: null,
      features: ["Tout le plan Professionnel", "Pentest annuel complet", "Red team exercices", "RSSI à temps partiel dédié", "SLA 99.99% garanti", "Onboarding prioritaire 48h", "Intégration SI existant sur mesure"],
      cta: "Nous contacter",
      highlight: false,
    },
  ]

  return (
    <section ref={ref} style={{ background: C.bg, padding: "6rem 2rem" }}>
      <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <p style={{ fontFamily: mono, color: C.green, fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}># tarifs</p>
          <h2 style={{ fontFamily: mono, fontWeight: 700, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: C.white, lineHeight: 1.15 }}>
            Investissez Dans<br /><span style={{ color: C.green }}>Votre Sécurité</span>
          </h2>
          <p style={{ fontFamily: sans, color: C.gray, fontSize: "0.93rem", maxWidth: "460px", margin: "1rem auto 0", lineHeight: 1.7 }}>Sans engagement. Résiliation à tout moment. Déploiement en 48h.</p>
        </motion.div>

        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.14, duration: 0.6 }}
              whileHover={{ y: -5 }}
              style={{ flex: "1 1 280px", maxWidth: "330px", background: plan.highlight ? C.greenGlow : C.cardBg, border: `1px solid ${plan.highlight ? C.green : C.greenBorder}`, borderRadius: "14px", padding: "2rem 1.75rem", position: "relative", boxShadow: plan.highlight ? `0 0 40px rgba(0,230,118,0.12), 0 20px 60px rgba(0,0,0,0.4)` : "none" }}>
              {plan.tag && (
                <div style={{ position: "absolute", top: "-13px", left: "50%", transform: "translateX(-50%)", background: C.green, color: C.dark, fontFamily: mono, fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.1em", padding: "0.3rem 1rem", borderRadius: "20px", whiteSpace: "nowrap" }}>{plan.tag}</div>
              )}
              <div style={{ fontFamily: mono, fontWeight: 700, fontSize: "0.78rem", color: plan.highlight ? C.green : C.gray, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem" }}>{plan.name}</div>
              <div style={{ marginBottom: "0.35rem" }}>
                {plan.price === "Sur devis" ? (
                  <span style={{ fontFamily: mono, fontWeight: 700, fontSize: "2rem", color: C.white }}>Sur devis</span>
                ) : (
                  <span style={{ fontFamily: mono, fontWeight: 700, fontSize: "2.5rem", color: C.white }}>{plan.price}<span style={{ fontSize: "1rem", color: C.gray }}>{plan.unit}</span></span>
                )}
              </div>
              <div style={{ fontFamily: sans, color: C.gray, fontSize: "0.8rem", marginBottom: "1.5rem", lineHeight: 1.5 }}>{plan.scope}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.75rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", fontFamily: sans, color: plan.highlight ? "#c8d8cb" : C.gray, fontSize: "0.85rem", lineHeight: 1.5 }}>
                    <span style={{ color: C.green, fontFamily: mono, flexShrink: 0, marginTop: "2px" }}>▸</span>
                    {f}
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.04, background: plan.highlight ? C.green : C.greenGlow, color: plan.highlight ? C.dark : C.green }}
                whileTap={{ scale: 0.97 }}
                style={{ cursor: "pointer", width: "100%", background: plan.highlight ? "rgba(0,230,118,0.15)" : "transparent", color: plan.highlight ? C.green : C.gray, border: `1px solid ${plan.highlight ? C.green : C.greenBorder}`, borderRadius: "8px", padding: "0.75rem", fontFamily: mono, fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.06em", transition: "all 0.2s" }}>
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  const items = [
    { q: "Qu'est-ce qu'un SOC et pourquoi en ai-je besoin ?", a: "Un SOC (Security Operations Center) est une équipe d'experts qui surveille votre système d'information en permanence à la recherche de menaces. Sans SOC, une intrusion peut rester non détectée pendant des semaines — les études montrent 197 jours en moyenne. Avec notre SOC, vous êtes alerté et protégé en minutes. Pour les PME sans équipe cybersécurité interne, c'est la solution la plus efficace au meilleur coût." },
    { q: "Fortress garantit-il la conformité RGPD de mon entreprise ?", a: "Oui. Notre audit RGPD couvre l'ensemble des 99 articles du règlement applicables à votre activité : registre des traitements, base légale, gestion des droits des personnes, transferts hors UE, et mesures de sécurité techniques. Nous livrons un plan de mise en conformité et nous accompagnons la mise en œuvre. En cas de contrôle CNIL, nous vous assistons dans la réponse." },
    { q: "Êtes-vous engagés sur une durée minimale ?", a: "Aucun engagement de durée n'est imposé. Nos contrats fonctionnent au mois, résiliables à tout moment avec un préavis de 30 jours. Nous préférons vous garder grâce à la qualité de notre service plutôt que par des clauses contractuelles. Des remises de 10% à 20% sont disponibles pour des engagements annuels ou pluriannuels." },
    { q: "Comment Fortress s'intègre-t-il à mon infrastructure SI existante ?", a: "Notre équipe d'intégration déploie des agents de monitoring légers (< 0.1% CPU) compatibles Windows, Linux, macOS, et ESXi. Nous nous connectons à vos outils existants : Active Directory, Azure AD, Office 365, GSuite, pare-feux Fortinet, Cisco, Palo Alto. Le déploiement complet se fait en 48 à 72h sans interruption de service." },
    { q: "Quel est le délai entre la signature du contrat et le démarrage de la protection ?", a: "La protection démarre en 48h. Dès la signature, notre équipe d'intégration vous contacte pour le déploiement des agents. Les premières alertes sont opérationnelles en 24h, et la couverture complète avec règles de détection personnalisées à votre secteur est finalisée en 72h maximum. Les plans Entreprise bénéficient d'un onboarding dédié avec chef de projet." },
    { q: "Que se passe-t-il en cas d'incident confirmé ?", a: "Notre procédure d'incident suit 4 étapes : 1) Détection et qualification (< 5 min), 2) Containment et isolation du périmètre affecté (< 15 min), 3) Remédiation et éradication de la menace, 4) Rapport post-mortem avec analyse forensique. Vous êtes notifié à chaque étape. Si un dépôt de plainte ou une notification CNIL est nécessaire, nous préparons le dossier complet." },
  ]

  return (
    <section ref={ref} style={{ background: C.cardBg, borderTop: `1px solid ${C.greenBorder}`, padding: "6rem 2rem" }}>
      <div style={{ maxWidth: "780px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ fontFamily: mono, color: C.green, fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}># FAQ</p>
          <h2 style={{ fontFamily: mono, fontWeight: 700, fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: C.white, lineHeight: 1.15 }}>
            Questions <span style={{ color: C.green }}>Fréquentes</span>
          </h2>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.5 }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{ cursor: "pointer", width: "100%", background: C.bg, border: `1px solid ${open === i ? C.green : C.greenBorder}`, borderRadius: "10px", padding: "1.2rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", textAlign: "left", transition: "border-color 0.2s" }}>
                <span style={{ fontFamily: sans, fontWeight: 600, fontSize: "0.93rem", color: C.white, lineHeight: 1.4 }}>{item.q}</span>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.22 }}
                  style={{ color: C.green, fontFamily: mono, fontSize: "1.4rem", fontWeight: 400, flexShrink: 0, lineHeight: 1 }}>+</motion.span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.33, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}>
                    <div style={{ padding: "1rem 1.5rem 1.5rem", fontFamily: sans, color: C.gray, fontSize: "0.9rem", lineHeight: 1.78, background: C.greenGlow, borderLeft: `2px solid ${C.green}`, marginTop: "3px", borderRadius: "0 0 8px 8px" }}>
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA BANNER ───────────────────────────────────────────────────────────────
function CTABanner() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section ref={ref} style={{ background: C.bg, padding: "6rem 2rem", position: "relative", overflow: "hidden" }}>
      {/* Decorative grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.greenBorder} 1px, transparent 1px), linear-gradient(90deg, ${C.greenBorder} 1px, transparent 1px)`, backgroundSize: "40px 40px", opacity: 0.5, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(0,230,118,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", background: C.greenGlow, border: `1px solid ${C.greenBorder}`, borderRadius: "6px", padding: "0.4rem 1rem", marginBottom: "2rem" }}>
          <span style={{ fontFamily: mono, fontSize: "0.76rem", color: C.green }}>// audit.gratuit — sans engagement</span>
        </div>
        <h2 style={{ fontFamily: mono, fontWeight: 700, fontSize: "clamp(1.8rem, 4vw, 3rem)", color: C.white, lineHeight: 1.15, marginBottom: "1.2rem" }}>
          Audit Gratuit de<br /><span style={{ color: C.green }}>Votre Infrastructure</span>
        </h2>
        <p style={{ fontFamily: sans, color: C.gray, fontSize: "1rem", lineHeight: 1.75, marginBottom: "2.5rem" }}>
          En 48h, nos experts identifient vos 3 vulnérabilités les plus critiques. Rapport offert, sans condition. 1 200 entreprises nous font déjà confiance.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: `0 0 35px rgba(0,230,118,0.4)` }}
            whileTap={{ scale: 0.97 }}
            style={{ cursor: "pointer", background: C.green, color: C.dark, border: "none", borderRadius: "8px", padding: "0.9rem 2.2rem", fontFamily: mono, fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.06em", transition: "box-shadow 0.2s" }}>
            Demander mon audit gratuit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, borderColor: C.green, color: C.white }}
            whileTap={{ scale: 0.97 }}
            style={{ cursor: "pointer", background: "transparent", color: C.gray, border: `1px solid ${C.greenBorder}`, borderRadius: "8px", padding: "0.9rem 2.2rem", fontFamily: mono, fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.06em", transition: "border-color 0.2s, color 0.2s" }}>
            Parler à un expert
          </motion.button>
        </div>
      </motion.div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  const links = {
    "Solutions": ["Audit & Conformité", "SOC 24/7", "Formation Équipes", "Réponse Incident"],
    "Entreprise": ["À propos", "Équipe", "Partenaires", "Recrutement"],
    "Ressources": ["Blog Cybersécurité", "Guides RGPD", "Webinaires", "Rapport annuel"],
  }

  const socials = [
    { label: "LinkedIn", href: "#", icon: <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg> },
    { label: "MessageSquare", href: "#", icon: <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg> },
    { label: "GitHub", href: "#", icon: <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" /></svg> },
  ]

  return (
    <footer style={{ background: C.dark, borderTop: `1px solid ${C.greenBorder}`, padding: "4rem 2rem 2rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap", marginBottom: "3rem" }}>
          {/* Brand */}
          <div style={{ flex: "1 1 220px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="6" fill={C.green} fillOpacity="0.1" />
                <rect width="28" height="28" rx="6" stroke={C.green} strokeWidth="1" />
                <path d="M7 14 L11 10 L14 13 L17 8 L21 14" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              <span style={{ fontFamily: mono, fontWeight: 700, fontSize: "1.1rem", color: C.white, letterSpacing: "0.08em" }}>FORTRESS</span>
            </div>
            <p style={{ fontFamily: sans, color: C.gray, fontSize: "0.85rem", lineHeight: 1.7, maxWidth: "210px" }}>Cybersécurité managée pour les PME et ETI françaises. SOC 24/7, conformité, et réponse aux incidents.</p>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
              {socials.map(s => (
                <motion.a key={s.label} href={s.href} whileHover={{ scale: 1.15, color: C.green }} style={{ color: C.gray, transition: "color 0.2s", cursor: "pointer" }} aria-label={s.label}>{s.icon}</motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category} style={{ flex: "1 1 130px" }}>
              <h4 style={{ fontFamily: mono, fontWeight: 700, fontSize: "0.72rem", color: C.green, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1rem" }}>{category}</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {items.map(item => (
                  <li key={item}>
                    <Link href="#" style={{ fontFamily: sans, color: C.gray, fontSize: "0.85rem", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.green)}
                      onMouseLeave={e => (e.currentTarget.style.color = C.gray)}>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div style={{ flex: "1 1 180px" }}>
            <h4 style={{ fontFamily: mono, fontWeight: 700, fontSize: "0.72rem", color: C.green, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1rem" }}>Contact</h4>
            <div style={{ fontFamily: sans, color: C.gray, fontSize: "0.85rem", lineHeight: 2 }}>
              <div>contact@fortress-cyber.fr</div>
              <div>+33 1 83 64 XX XX</div>
              <div>Paris — Lyon — Bordeaux</div>
              <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ display: "inline-block", width: "7px", height: "7px", borderRadius: "50%", background: C.green }} />
                <span style={{ color: C.green, fontSize: "0.8rem", fontFamily: mono }}>SOC opérationnel</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${C.greenBorder}`, paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ fontFamily: mono, color: "rgba(138,158,142,0.4)", fontSize: "0.78rem" }}>© 2024 Fortress Cybersecurity SAS. Tous droits réservés.</p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Mentions légales", "CGV", "Politique de confidentialité", "Politique cookies"].map(l => (
              <Link key={l} href="#" style={{ fontFamily: sans, color: "rgba(138,158,142,0.4)", fontSize: "0.78rem", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.gray)}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(138,158,142,0.4)")}>{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function FortressPage() {
  return (
    <main style={{ background: C.bg, fontFamily: sans }}>
      <Navbar />
      <Hero />
      <StatsBar />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTABanner />
      <Footer />
    </main>
  )
}
