"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"

const C = {
  bg: "#0a1628",
  teal: "#0e7490",
  tealLight: "#22d3ee",
  white: "#ffffff",
  sandy: "#f0e6d3",
  sandyDim: "#c8b49a",
  navBg: "rgba(10, 22, 40, 0.95)",
  cardBg: "rgba(14, 116, 144, 0.12)",
  cardBorder: "rgba(14, 116, 144, 0.35)",
}

const font = { heading: "system-ui, -apple-system, sans-serif", body: "system-ui, -apple-system, sans-serif" }

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

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const links = [
  { label: "Formations", id: "formations" },
  { label: "Location", id: "activites" },
  { label: "Croisières", id: "activites" },
  { label: "Bases", id: "activites" },
  { label: "Contact", id: "contact" },
]

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? C.navBg : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.cardBorder}` : "none",
        transition: "background 0.3s, backdrop-filter 0.3s, border-bottom 0.3s",
        padding: "0 2rem",
        height: "72px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="17" stroke={C.tealLight} strokeWidth="2" />
          <path d="M8 22 L18 8 L28 22" stroke={C.sandy} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M18 8 L18 28" stroke={C.tealLight} strokeWidth="1.5" strokeDasharray="2 2" />
          <path d="M8 22 Q18 30 28 22" stroke={C.teal} strokeWidth="2" fill="none" />
        </svg>
        <span style={{ fontFamily: font.heading, fontWeight: 800, fontSize: "1.35rem", color: C.white, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          AZIMUT
        </span>
      </div>

      {/* Desktop links */}
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        {links.map(l => (
          <button key={l.label} onClick={() => document.getElementById(l.id)?.scrollIntoView({ behavior: "smooth" })} style={{ fontFamily: font.body, color: C.sandyDim, fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.04em", textDecoration: "none", transition: "color 0.2s", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = C.white)}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = C.sandyDim)}>
            {l.label}
          </button>
        ))}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{ cursor: "pointer", background: C.teal, color: C.white, border: "none", borderRadius: "8px", padding: "0.6rem 1.4rem", fontFamily: font.heading, fontWeight: 700, fontSize: "0.88rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Réserver
        </motion.button>
      </div>
    </motion.nav>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const { scrollY } = useScroll()
  const heroTextY = useTransform(scrollY, [0, 500], [0, -50])
  const waveY = useTransform(scrollY, [0, 400], [0, -20])

  const cards = [
    { icon: "⚓", title: "Formations Voile", desc: "Du débutant au capitaine hauturier, programmes certifiants FFV" },
    { icon: "🚤", title: "Location de Bateaux", desc: "120 voiliers & catamarans, sans ou avec équipage" },
    { icon: "🌊", title: "Croisières Méditerranée", desc: "Itinéraires Côte d'Azur, Corse, Sardaigne & Baléares" },
  ]

  return (
    <section style={{ position: "relative", minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", paddingTop: "72px" }}>
      {/* Radial glow */}
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "500px", background: "radial-gradient(ellipse, rgba(14,116,144,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Heading */}
      <motion.div style={{ y: heroTextY, textAlign: "center", position: "relative", zIndex: 2, padding: "0 1rem" }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ fontFamily: font.body, color: C.tealLight, fontWeight: 600, fontSize: "0.85rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.2rem" }}>
          École de Voile &amp; Location — Méditerranée
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          style={{ fontFamily: font.heading, fontWeight: 800, fontSize: "clamp(3.5rem, 8vw, 6.5rem)", color: C.white, lineHeight: 1.0, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "1.5rem" }}>
          Prenez<br />
          <span style={{ color: C.tealLight }}>le Large</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{ fontFamily: font.body, color: C.sandyDim, fontSize: "1.15rem", maxWidth: "520px", margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
          25 ans de passion nautique. Des formations reconnues, une flotte d'exception, et la Méditerranée pour terrain de jeu.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <motion.button
            whileHover={{ scale: 1.05, background: C.tealLight }}
            whileTap={{ scale: 0.97 }}
            style={{ cursor: "pointer", background: C.teal, color: C.white, border: "none", borderRadius: "10px", padding: "0.85rem 2rem", fontFamily: font.heading, fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.06em", textTransform: "uppercase", transition: "background 0.2s" }}>
            Voir les Formations
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, borderColor: C.tealLight, color: C.tealLight }}
            whileTap={{ scale: 0.97 }}
            style={{ cursor: "pointer", background: "transparent", color: C.sandy, border: `2px solid ${C.cardBorder}`, borderRadius: "10px", padding: "0.85rem 2rem", fontFamily: font.heading, fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.06em", textTransform: "uppercase", transition: "border-color 0.2s, color 0.2s" }}>
            Nos Bateaux
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Boat cards */}
      <div style={{ display: "flex", gap: "1.25rem", justifyContent: "center", flexWrap: "wrap", marginTop: "4rem", padding: "0 1.5rem", position: "relative", zIndex: 2 }}>
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.15, duration: 0.65, ease: "easeOut" }}
            whileHover={{ y: -6, borderColor: C.teal }}
            style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: "14px", padding: "1.5rem 1.75rem", width: "220px", textAlign: "center", cursor: "pointer", transition: "border-color 0.2s" }}>
            <div style={{ fontSize: "2.2rem", marginBottom: "0.75rem" }}>{card.icon}</div>
            <div style={{ fontFamily: font.heading, fontWeight: 700, fontSize: "0.95rem", color: C.white, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>{card.title}</div>
            <div style={{ fontFamily: font.body, color: C.sandyDim, fontSize: "0.82rem", lineHeight: 1.6 }}>{card.desc}</div>
          </motion.div>
        ))}
      </div>

      {/* Animated wave SVG */}
      <motion.div style={{ y: waveY, position: "absolute", bottom: 0, left: 0, right: 0, pointerEvents: "none" }}>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ width: "100%", height: "120px", display: "block" }}>
          <motion.path
            d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z"
            fill="rgba(14,116,144,0.18)"
            animate={{ d: ["M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z", "M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,120 L0,120 Z", "M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M0,80 C360,40 720,100 1080,60 C1260,40 1380,80 1440,80 L1440,120 L0,120 Z"
            fill="rgba(14,116,144,0.10)"
            animate={{ d: ["M0,80 C360,40 720,100 1080,60 C1260,40 1380,80 1440,80 L1440,120 L0,120 Z", "M0,60 C360,20 720,80 1080,40 C1260,20 1380,60 1440,60 L1440,120 L0,120 Z", "M0,80 C360,40 720,100 1080,60 C1260,40 1380,80 1440,80 L1440,120 L0,120 Z"] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </svg>
      </motion.div>
    </section>
  )
}

// ─── STATS BAR ────────────────────────────────────────────────────────────────
function StatItem({ value, suffix, label, active }: { value: number; suffix: string; label: string; active: boolean }) {
  const count = useCounter(value, active)
  return (
    <div style={{ textAlign: "center", flex: "1 1 160px" }}>
      <div style={{ fontFamily: font.heading, fontWeight: 800, fontSize: "clamp(2.2rem, 4vw, 3rem)", color: C.tealLight, lineHeight: 1, letterSpacing: "-0.02em" }}>
        {count}{suffix}
      </div>
      <div style={{ fontFamily: font.body, color: C.sandyDim, fontSize: "0.88rem", marginTop: "0.4rem", letterSpacing: "0.04em" }}>{label}</div>
    </div>
  )
}

function StatsBar() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  const stats = [
    { value: 25, suffix: " ans", label: "D'expérience en voile" },
    { value: 120, suffix: "", label: "Bateaux disponibles" },
    { value: 8500, suffix: "+", label: "Élèves formés" },
    { value: 6, suffix: "", label: "Bases nautiques" },
  ]

  return (
    <section ref={ref} style={{ background: `linear-gradient(135deg, #061020 0%, #0a1628 100%)`, borderTop: `1px solid ${C.cardBorder}`, borderBottom: `1px solid ${C.cardBorder}`, padding: "4.5rem 2rem" }}>
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
            transition={{ delay: i * 0.12, duration: 0.6 }}
            key={s.label}>
            <StatItem value={s.value} suffix={s.suffix} label={s.label} active={inView} />
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
      label: "Formations",
      headline: "Devenez Skipper Certifié FFV",
      body: "Nos formations couvrent tous les niveaux, du débutant curieux au futur capitaine hauturier. Pédagogie pratique, encadrement par des moniteurs brevetés d'État, et programmes validés par la Fédération Française de Voile. En fin de cursus, vous repartez avec un brevet reconnu dans toute l'Europe.",
      points: ["Initiation Week-end — 2 jours en baie", "Permis Côtier officiel — 4 jours", "Voile Hauturière — certification internationale", "Cours collectifs & stages intensifs"],
    },
    {
      label: "Location",
      headline: "120 Bateaux à Votre Disposition",
      body: "Voiliers monocoques, catamarans grand confort, day-boats : notre flotte est renouvelée chaque saison. Location à la journée, au week-end ou à la semaine, avec ou sans skipper. Tous nos bateaux sont équipés GPS, VHF, gilets et kit de sécurité complet.",
      points: ["Voiliers 7m à 15m de longueur", "Catamarans 38–50 pieds", "Option skipper professionnel incluse", "Assistance 24h disponible en mer"],
    },
    {
      label: "Croisières",
      headline: "La Méditerranée Comme Terrain de Jeu",
      body: "Partez explorer la Côte d'Azur, la Corse sauvage, la Sardaigne ensoleillée ou les Baléares. Nos croisières guidées partent chaque semaine de mai à octobre. Groupes de 4 à 8 personnes maximum, ambiance conviviale garantie et itinéraires flexibles selon la météo.",
      points: ["Nice → Corse : 7 jours", "Tour de Sardaigne : 10 jours", "Méditerranée Ouest : Ibiza & Majorque", "Croisières thématiques œnotourisme"],
    },
    {
      label: "Stages Enfants",
      headline: "La Voile Dès 7 Ans",
      body: "Nos stages enfants et ados transforment les jeunes en marins passionnés. Cadre sécurisé, petits groupes de 6 maximum, moniteurs spécialisés en pédagogie jeunesse. Une semaine sur l'eau pour décrocher le sourire et les bases de la navigation.",
      points: ["Stages 7–12 ans & 13–17 ans", "Mini-voiliers optimist & dériveurs", "Semaines thématiques été & vacances", "Groupes scolaires sur devis"],
    },
  ]

  const tab = tabs[active]

  return (
    <section id="activites" ref={ref} style={{ background: C.bg, padding: "6rem 2rem" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ fontFamily: font.body, color: C.tealLight, fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Nos Activités</p>
          <h2 style={{ fontFamily: font.heading, fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", color: C.white, textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1.1 }}>
            Choisissez Votre<br /><span style={{ color: C.tealLight }}>Aventure</span>
          </h2>
        </motion.div>

        {/* Tab buttons */}
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem" }}>
          {tabs.map((t, i) => (
            <motion.button
              key={t.label}
              onClick={() => setActive(i)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{ cursor: "pointer", background: active === i ? C.teal : "transparent", color: active === i ? C.white : C.sandyDim, border: `1.5px solid ${active === i ? C.teal : C.cardBorder}`, borderRadius: "8px", padding: "0.55rem 1.25rem", fontFamily: font.heading, fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.25s" }}>
              {t.label}
            </motion.button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.38 }}
            style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: "16px", padding: "2.5rem", display: "flex", gap: "3rem", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 280px" }}>
              <h3 style={{ fontFamily: font.heading, fontWeight: 800, fontSize: "1.5rem", color: C.white, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "1rem", lineHeight: 1.2 }}>{tab.headline}</h3>
              <p style={{ fontFamily: font.body, color: C.sandyDim, fontSize: "0.95rem", lineHeight: 1.75 }}>{tab.body}</p>
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <p style={{ fontFamily: font.heading, fontWeight: 700, fontSize: "0.8rem", color: C.tealLight, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1rem" }}>Ce qui est inclus</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {tab.points.map(p => (
                  <li key={p} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", fontFamily: font.body, color: C.sandy, fontSize: "0.9rem", lineHeight: 1.55 }}>
                    <span style={{ color: C.tealLight, fontWeight: 700, flexShrink: 0, marginTop: "2px" }}>—</span>
                    {p}
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.04, background: C.tealLight }}
                whileTap={{ scale: 0.97 }}
                style={{ cursor: "pointer", marginTop: "1.5rem", background: C.teal, color: C.white, border: "none", borderRadius: "8px", padding: "0.7rem 1.5rem", fontFamily: font.heading, fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.06em", textTransform: "uppercase", transition: "background 0.2s" }}>
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
    { name: "Camille D.", role: "Élève Permis Côtier", text: "J'ai passé mon permis côtier en 4 jours avec Azimut. Les moniteurs sont pédagogues, patients et vraiment passionnés. Je suis repartie avec mon brevet ET l'envie de continuer en hauturier !", stars: 5 },
    { name: "Marc L.", role: "Locataire — Corse 10 jours", text: "Deuxième location avec Azimut, toujours aussi pro. Le catamaran était impeccable, l'assistance répondait en moins d'une heure. On reviendra l'année prochaine pour les Baléares.", stars: 5 },
    { name: "Sophie & Pierre", role: "Croisière Côte d'Azur", text: "Notre première croisière en couple. Le skipper Azimut nous a appris les bases pendant 7 jours. Magique, nous sommes complètement conquis. Hyères, Porquerolles, Saint-Tropez… inoubliable.", stars: 5 },
    { name: "Thomas B.", role: "Stage enfant (fils de 10 ans)", text: "Mon fils est revenu du stage transformé. En une semaine, il sait gouverner un optimist et rêve déjà de naviguer autour du monde. Encadrement top, sécurité irréprochable.", stars: 5 },
  ]

  const prev = () => { setDirection(-1); setActive(a => (a - 1 + testimonials.length) % testimonials.length) }
  const next = () => { setDirection(1); setActive(a => (a + 1) % testimonials.length) }

  const t = testimonials[active]

  return (
    <section ref={ref} style={{ background: `linear-gradient(180deg, #061020 0%, ${C.bg} 100%)`, padding: "6rem 2rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <p style={{ fontFamily: font.body, color: C.tealLight, fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Ils Ont Navigué Avec Nous</p>
          <h2 style={{ fontFamily: font.heading, fontWeight: 800, fontSize: "clamp(2rem, 4vw, 2.8rem)", color: C.white, textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1.1 }}>
            Ce Qu'ils <span style={{ color: C.tealLight }}>Disent</span>
          </h2>
        </motion.div>

        <div style={{ position: "relative", overflow: "hidden", borderRadius: "18px" }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 60 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: "18px", padding: "2.5rem 3rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.4rem", letterSpacing: "0.1em", color: "#f59e0b", marginBottom: "1.2rem" }}>{"★".repeat(t.stars)}</div>
              <p style={{ fontFamily: font.body, color: C.sandy, fontSize: "1.05rem", lineHeight: 1.8, fontStyle: "italic", marginBottom: "1.8rem" }}>"{t.text}"</p>
              <div style={{ fontFamily: font.heading, fontWeight: 800, fontSize: "1rem", color: C.white, letterSpacing: "0.05em", textTransform: "uppercase" }}>{t.name}</div>
              <div style={{ fontFamily: font.body, color: C.tealLight, fontSize: "0.82rem", marginTop: "0.3rem" }}>{t.role}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1.5rem", marginTop: "2rem" }}>
          <motion.button onClick={prev} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ cursor: "pointer", background: "transparent", border: `1.5px solid ${C.cardBorder}`, borderRadius: "50%", width: "44px", height: "44px", color: C.white, fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.2s" }}>‹</motion.button>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => { setDirection(i > active ? 1 : -1); setActive(i) }} style={{ cursor: "pointer", width: i === active ? "24px" : "8px", height: "8px", borderRadius: "4px", background: i === active ? C.teal : C.cardBorder, border: "none", transition: "all 0.3s" }} />
            ))}
          </div>
          <motion.button onClick={next} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ cursor: "pointer", background: "transparent", border: `1.5px solid ${C.cardBorder}`, borderRadius: "50%", width: "44px", height: "44px", color: C.white, fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.2s" }}>›</motion.button>
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
      name: "Initiation",
      price: "390",
      duration: "Week-end 2 jours",
      tag: null,
      features: ["2 jours en baie protégée", "Théorie + pratique à bord", "Matériel & gilets inclus", "Groupe max 6 personnes", "Attestation de formation"],
      cta: "Réserver",
      highlight: false,
    },
    {
      name: "Permis Côtier",
      price: "690",
      duration: "Stage 4 jours",
      tag: "Le plus populaire",
      features: ["4 jours de formation intensive", "Préparation examen officiel", "Passage du permis inclus", "Théorie navigation & météo", "Règles COLREG & manœuvres", "Groupe max 4 personnes"],
      cta: "Réserver ma place",
      highlight: true,
    },
    {
      name: "Capitaine Large",
      price: "1 290",
      duration: "Formation 8 jours",
      tag: null,
      features: ["8 jours hauturier offshore", "Navigation de nuit incluse", "Certificat offshore FFV", "Utilisation GPS / VHF / radar", "Météorologie avancée", "Logbook personnel offert"],
      cta: "Réserver",
      highlight: false,
    },
  ]

  return (
    <section id="formations" ref={ref} style={{ background: C.bg, padding: "6rem 2rem" }}>
      <div style={{ maxWidth: "1040px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <p style={{ fontFamily: font.body, color: C.tealLight, fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Nos Formations</p>
          <h2 style={{ fontFamily: font.heading, fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", color: C.white, textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1.1 }}>
            Formules <span style={{ color: C.tealLight }}>et Tarifs</span>
          </h2>
          <p style={{ fontFamily: font.body, color: C.sandyDim, fontSize: "0.95rem", maxWidth: "480px", margin: "1rem auto 0" }}>Tous les tarifs incluent l'encadrement par moniteur breveté, le matériel pédagogique et la taxe de séjour.</p>
        </motion.div>

        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.14, duration: 0.6 }}
              whileHover={{ y: -6 }}
              style={{ flex: "1 1 280px", maxWidth: "320px", background: plan.highlight ? `linear-gradient(145deg, ${C.teal}, #0891b2)` : C.cardBg, border: `1px solid ${plan.highlight ? C.teal : C.cardBorder}`, borderRadius: "18px", padding: "2rem 1.75rem", position: "relative", boxShadow: plan.highlight ? `0 20px 60px rgba(14,116,144,0.4)` : "none" }}>
              {plan.tag && (
                <div style={{ position: "absolute", top: "-13px", left: "50%", transform: "translateX(-50%)", background: C.sandy, color: C.bg, fontFamily: font.heading, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.3rem 1rem", borderRadius: "20px", whiteSpace: "nowrap" }}>{plan.tag}</div>
              )}
              <div style={{ fontFamily: font.heading, fontWeight: 800, fontSize: "0.9rem", color: plan.highlight ? "rgba(255,255,255,0.75)" : C.tealLight, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.75rem" }}>{plan.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "0.35rem" }}>
                <span style={{ fontFamily: font.heading, fontWeight: 800, fontSize: "2.8rem", color: C.white, lineHeight: 1 }}>{plan.price}€</span>
              </div>
              <div style={{ fontFamily: font.body, color: plan.highlight ? "rgba(255,255,255,0.7)" : C.sandyDim, fontSize: "0.82rem", marginBottom: "1.5rem" }}>{plan.duration}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.75rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontFamily: font.body, color: plan.highlight ? "rgba(255,255,255,0.85)" : C.sandy, fontSize: "0.87rem" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}><circle cx="7" cy="7" r="7" fill={plan.highlight ? "rgba(255,255,255,0.25)" : "rgba(14,116,144,0.3)"} /><path d="M4 7l2 2 4-4" stroke={plan.highlight ? C.white : C.tealLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.04, background: plan.highlight ? C.white : C.teal }}
                whileTap={{ scale: 0.97 }}
                style={{ cursor: "pointer", width: "100%", background: plan.highlight ? "rgba(255,255,255,0.15)" : "transparent", color: plan.highlight ? C.white : C.tealLight, border: `2px solid ${plan.highlight ? "rgba(255,255,255,0.5)" : C.teal}`, borderRadius: "10px", padding: "0.75rem", fontFamily: font.heading, fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.2s" }}>
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
    { q: "Quel niveau est requis pour nos formations ?", a: "Aucun prérequis pour les stages Initiation et Permis Côtier. Pour la formation Capitaine Large, nous recommandons d'avoir déjà navigué quelques jours ou d'avoir obtenu le Permis Côtier au préalable. Un test de niveau est toujours proposé à l'inscription." },
    { q: "L'assurance est-elle incluse dans le prix ?", a: "Oui. Toutes nos formations incluent une assurance responsabilité civile et une garantie accident pour les stagiaires pendant la durée de la formation. Pour les locations, une assurance tous risques est proposée en option au tarif de 45€/jour." },
    { q: "Quel est l'âge minimum pour naviguer ?", a: "Les stages Enfants accueillent les 7-17 ans. Pour les formations Permis Côtier et adultes, l'âge minimum est 16 ans (avec autorisation parentale pour les mineurs). Les locations sont réservées aux personnes majeures titulaires d'un permis valide." },
    { q: "Le permis obtenu est-il reconnu en dehors de France ?", a: "Le Permis Côtier français est reconnu en Méditerranée, Adriatique et en mer du Nord selon les accords bilatéraux. Pour naviguer dans certains pays (Grèce, Croatie, Turquie), nous conseillons d'ajouter le certificat ICC, que nous pouvons faire passer sur demande." },
    { q: "Que se passe-t-il en cas de mauvaise météo ?", a: "La sécurité prime toujours. En cas de conditions défavorables, nous proposons un report de stage sur une autre date sans frais supplémentaires, ou un avoir valable 18 mois. Certaines sessions peuvent être adaptées en navigation en baie protégée si la météo le permet." },
    { q: "Peut-on payer en plusieurs fois ?", a: "Oui, nous proposons un paiement en 3 fois sans frais pour les formations supérieures à 500€. Un acompte de 30% est demandé à l'inscription, le solde étant dû 10 jours avant le début du stage." },
  ]

  return (
    <section ref={ref} style={{ background: `linear-gradient(180deg, ${C.bg} 0%, #061020 100%)`, padding: "6rem 2rem" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ fontFamily: font.body, color: C.tealLight, fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Questions Fréquentes</p>
          <h2 style={{ fontFamily: font.heading, fontWeight: 800, fontSize: "clamp(2rem, 4vw, 2.8rem)", color: C.white, textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1.1 }}>
            Tout Ce Que<br /><span style={{ color: C.tealLight }}>Vous Voulez Savoir</span>
          </h2>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{ cursor: "pointer", width: "100%", background: C.cardBg, border: `1px solid ${open === i ? C.teal : C.cardBorder}`, borderRadius: "12px", padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", textAlign: "left", transition: "border-color 0.2s" }}>
                <span style={{ fontFamily: font.heading, fontWeight: 700, fontSize: "0.95rem", color: C.white, textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1.4 }}>{item.q}</span>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ color: C.tealLight, fontSize: "1.5rem", fontWeight: 300, flexShrink: 0, lineHeight: 1 }}>+</motion.span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}>
                    <div style={{ padding: "1rem 1.5rem 1.5rem", fontFamily: font.body, color: C.sandyDim, fontSize: "0.92rem", lineHeight: 1.75, background: "rgba(14,116,144,0.05)", borderLeft: `3px solid ${C.teal}`, marginTop: "4px", borderRadius: "0 0 10px 10px" }}>
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
    <section id="contact" ref={ref} style={{ background: `linear-gradient(135deg, ${C.teal} 0%, #0891b2 50%, #0e7490 100%)`, padding: "5rem 2rem", position: "relative", overflow: "hidden" }}>
      {/* Decorative waves */}
      <svg style={{ position: "absolute", top: 0, left: 0, right: 0, opacity: 0.12 }} viewBox="0 0 1440 80" preserveAspectRatio="none" height="80">
        <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,20 1440,40 L1440,0 L0,0 Z" fill="white" />
      </svg>
      <svg style={{ position: "absolute", bottom: 0, left: 0, right: 0, opacity: 0.12 }} viewBox="0 0 1440 80" preserveAspectRatio="none" height="80">
        <path d="M0,40 C360,0 720,80 1080,40 C1260,20 1380,60 1440,40 L1440,80 L0,80 Z" fill="white" />
      </svg>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontFamily: font.heading, fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", color: C.white, textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1.1, marginBottom: "1.2rem" }}>
          Réservez Votre<br />Formation
        </h2>
        <p style={{ fontFamily: font.body, color: "rgba(255,255,255,0.8)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "2.5rem" }}>
          Les places sont limitées. Assurez la vôtre dès aujourd'hui et partez naviguer avec les meilleurs moniteurs de Méditerranée.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <motion.button
            whileHover={{ scale: 1.05, background: C.sandy }}
            whileTap={{ scale: 0.97 }}
            style={{ cursor: "pointer", background: C.white, color: C.teal, border: "none", borderRadius: "10px", padding: "0.9rem 2.2rem", fontFamily: font.heading, fontWeight: 800, fontSize: "0.95rem", letterSpacing: "0.07em", textTransform: "uppercase", transition: "background 0.2s" }}>
            Réserver Maintenant
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.2)" }}
            whileTap={{ scale: 0.97 }}
            style={{ cursor: "pointer", background: "transparent", color: C.white, border: "2px solid rgba(255,255,255,0.6)", borderRadius: "10px", padding: "0.9rem 2.2rem", fontFamily: font.heading, fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.07em", textTransform: "uppercase", transition: "background 0.2s" }}>
            Nous Contacter
          </motion.button>
        </div>
      </motion.div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  const links = {
    "Formations": ["Initiation", "Permis Côtier", "Capitaine Large", "Stages Enfants"],
    "Location": ["Voiliers", "Catamarans", "Avec Skipper", "Tarifs"],
    "Bases": ["Nice", "Marseille", "Ajaccio", "Toulon", "Barcelone", "Palma"],
  }

  const socials = [
    { label: "Users2", href: "#", icon: <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg> },
    { label: "Camera", href: "#", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg> },
    { label: "YouTube", href: "#", icon: <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" /></svg> },
  ]

  return (
    <footer style={{ background: "#040d1a", borderTop: `1px solid ${C.cardBorder}`, padding: "4rem 2rem 2rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap", marginBottom: "3rem" }}>
          {/* Brand */}
          <div style={{ flex: "1 1 220px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
              <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="17" stroke={C.tealLight} strokeWidth="2" />
                <path d="M8 22 L18 8 L28 22" stroke={C.sandy} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M8 22 Q18 30 28 22" stroke={C.teal} strokeWidth="2" fill="none" />
              </svg>
              <span style={{ fontFamily: font.heading, fontWeight: 800, fontSize: "1.2rem", color: C.white, letterSpacing: "0.08em", textTransform: "uppercase" }}>AZIMUT</span>
            </div>
            <p style={{ fontFamily: font.body, color: C.sandyDim, fontSize: "0.87rem", lineHeight: 1.7, maxWidth: "220px" }}>École de voile et location de bateaux en Méditerranée depuis 1999.</p>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
              {socials.map(s => (
                <motion.a key={s.label} href={s.href} whileHover={{ scale: 1.15, color: C.tealLight }} style={{ color: C.sandyDim, transition: "color 0.2s", cursor: "pointer" }} aria-label={s.label}>{s.icon}</motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category} style={{ flex: "1 1 130px" }}>
              <h4 style={{ fontFamily: font.heading, fontWeight: 700, fontSize: "0.75rem", color: C.tealLight, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1rem" }}>{category}</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {items.map(item => (
                  <li key={item}>
                    <Link href="#" style={{ fontFamily: font.body, color: C.sandyDim, fontSize: "0.87rem", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.white)}
                      onMouseLeave={e => (e.currentTarget.style.color = C.sandyDim)}>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div style={{ flex: "1 1 180px" }}>
            <h4 style={{ fontFamily: font.heading, fontWeight: 700, fontSize: "0.75rem", color: C.tealLight, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "1rem" }}>Contact</h4>
            <div style={{ fontFamily: font.body, color: C.sandyDim, fontSize: "0.87rem", lineHeight: 1.85 }}>
              <div>📍 Port Lympia, Nice 06300</div>
              <div>📞 +33 4 93 12 34 56</div>
              <div>✉️ contact@azimut-voile.fr</div>
              <div style={{ marginTop: "0.75rem", color: C.sandyDim }}>Ouvert 7j/7 — 8h à 19h</div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${C.cardBorder}`, paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ fontFamily: font.body, color: "rgba(200,180,154,0.45)", fontSize: "0.8rem" }}>© 2024 Azimut Voile Méditerranée. Tous droits réservés.</p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Mentions légales", "CGV", "Politique de confidentialité"].map(l => (
              <Link key={l} href="#" style={{ fontFamily: font.body, color: "rgba(200,180,154,0.45)", fontSize: "0.8rem", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.sandyDim)}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(200,180,154,0.45)")}>{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function AzimutPage() {
  return (
    <main style={{ background: C.bg, fontFamily: font.body }}>
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
