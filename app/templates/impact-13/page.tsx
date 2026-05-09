"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"

const C = {
  bg: "#0f0f0f",
  cream: "#f5f0e8",
  brass: "#b87333",
  brassLight: "#d4924a",
  surface: "#1a1a1a",
  border: "#2a2a2a",
  textMuted: "#888877",
}

const FONT_HEADING = '"Cormorant Garamond", Georgia, serif'
const FONT_BODY = "system-ui, -apple-system, sans-serif"

function useScrolled(threshold = 80) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [threshold])
  return scrolled
}

function useCountUp(target: number, inView: boolean, duration = 2000) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target, duration])
  return count
}

// ─── NAVBAR ─────────────────────────────────────────────────────────────────────
function Navbar() {
  const scrolled = useScrolled(80)

  return (
    <motion.nav
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 56px",
        height: "76px",
        background: scrolled ? "rgba(15,15,15,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        transition: "background 0.5s ease, border-color 0.5s ease",
      }}
      initial={{ y: -76, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{
          fontFamily: FONT_HEADING,
          fontStyle: "italic",
          fontSize: "20px",
          fontWeight: 300,
          color: C.cream,
          letterSpacing: "0.16em",
          lineHeight: 1,
        }}>
          Atelier Mécanique
        </span>
        <span style={{ fontFamily: FONT_BODY, fontSize: "9px", letterSpacing: "0.24em", textTransform: "uppercase", color: C.brass }}>
          Horlogerie Indépendante — Genève
        </span>
      </div>

      <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>
        {["Manufacture", "Collections", "Sur-Mesure", "Service"].map((item) => (
          <Link
            key={item}
            href="#"
            style={{
              fontFamily: FONT_BODY,
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(245,240,232,0.65)",
              textDecoration: "none",
              transition: "color 0.3s",
            }}
          >
            {item}
          </Link>
        ))}
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          style={{
            background: "none",
            border: `1px solid ${C.brass}`,
            color: C.brass,
            padding: "10px 24px",
            fontFamily: FONT_BODY,
            fontSize: "11px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Rendez-vous
        </motion.button>
      </div>
    </motion.nav>
  )
}

// ─── HERO ────────────────────────────────────────────────────────────────────────
function Hero() {
  const { scrollY } = useScroll()
  const heroTitleY = useTransform(scrollY, [0, 500], [0, -50])

  const watchDetails = [
    { label: "Le Cadran", spec: "Email guilloché, index appliqués en laiton", offsetX: "-140px", offsetY: "20px" },
    { label: "La Couronne", spec: "Acier 316L, gravée à la main", offsetX: "10px", offsetY: "60px" },
    { label: "Le Mouvement", spec: "Calibre maison AM-3601, 29 rubis", offsetX: "160px", offsetY: "10px" },
  ]

  return (
    <section style={{
      minHeight: "100vh",
      background: C.bg,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      paddingTop: "76px",
    }}>
      {/* Subtle radial glow */}
      <div style={{
        position: "absolute",
        top: "40%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px",
        height: "600px",
        background: `radial-gradient(circle, rgba(184,115,51,0.07) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Main title */}
      <motion.div style={{ y: heroTitleY, textAlign: "center", zIndex: 2, marginBottom: "80px" }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            fontFamily: FONT_BODY,
            fontSize: "10px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: C.brass,
            marginBottom: "24px",
          }}
        >
          Genève — Fondé en 1987
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          style={{
            fontFamily: FONT_HEADING,
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "96px",
            lineHeight: 0.95,
            color: C.cream,
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          L'Art du Temps
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          style={{
            width: "80px",
            height: "1px",
            background: C.brass,
            margin: "32px auto",
            transformOrigin: "center",
          }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          style={{
            fontFamily: FONT_BODY,
            fontSize: "14px",
            color: "rgba(245,240,232,0.5)",
            letterSpacing: "0.06em",
            lineHeight: 1.75,
            maxWidth: "480px",
            margin: "0 auto",
          }}
        >
          Chaque montre est une conversation entre l'artisan et le temps. Fabriquée à la main, pièce par pièce, dans notre manufacture genevoise depuis 37 ans.
        </motion.p>
      </motion.div>

      {/* Watch detail cards — 3-column grid with individual parallax */}
      <div style={{
        display: "flex",
        gap: "24px",
        position: "relative",
        zIndex: 2,
      }}>
        {watchDetails.map((detail, i) => {
          const cardY = useTransform(scrollY, [0, 600], [0, i * 15])
          return (
            <motion.div
              key={i}
              style={{ y: cardY }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5 + i * 0.18, ease: "easeOut" }}
            >
              <div style={{
                width: "220px",
                background: C.surface,
                border: `1px solid ${C.border}`,
                padding: "28px 24px",
                position: "relative",
              }}>
                <div style={{
                  width: "100%",
                  height: "140px",
                  background: `linear-gradient(135deg, #222 0%, #1a1a1a 100%)`,
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {/* Decorative watch element */}
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <circle cx="30" cy="30" r="28" stroke={C.brass} strokeWidth="0.8" strokeDasharray="4 3" opacity="0.5" />
                    <circle cx="30" cy="30" r="20" stroke={C.brass} strokeWidth="0.4" opacity="0.3" />
                    {i === 0 && <path d="M30 12 L32 28 L30 30 L28 28Z" fill={C.brass} opacity="0.7" />}
                    {i === 1 && <circle cx="30" cy="30" r="4" fill={C.brass} opacity="0.6" />}
                    {i === 2 && <>
                      <path d="M20 30 A10 10 0 0 1 40 30" stroke={C.brass} strokeWidth="0.8" opacity="0.5" />
                      <path d="M20 30 A10 10 0 0 0 40 30" stroke={C.brass} strokeWidth="0.4" opacity="0.25" strokeDasharray="2 2" />
                    </>}
                  </svg>
                </div>
                <div style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "3px",
                  height: "40px",
                  background: C.brass,
                }} />
                <p style={{ fontFamily: FONT_BODY, fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: C.brass, margin: "0 0 8px" }}>
                  {detail.label}
                </p>
                <p style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: "15px", color: C.cream, margin: "0 0 6px", lineHeight: 1.3 }}>
                  {detail.spec}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          style={{ width: "1px", height: "40px", background: `linear-gradient(to bottom, ${C.brass}, transparent)` }}
        />
        <span style={{ fontFamily: FONT_BODY, fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: C.textMuted }}>
          Défiler
        </span>
      </motion.div>
    </section>
  )
}

// ─── STATS BAR ───────────────────────────────────────────────────────────────────
function StatsBar() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  const stats = [
    { value: 1987, suffix: "", label: "Fondé en", prefix: "" },
    { value: 37, suffix: " ans", label: "d'expertise horlogère", prefix: "" },
    { value: 200, suffix: "", label: "pièces par an (tirage limité)", prefix: "" },
    { value: 47, suffix: "", label: "pays dans le monde", prefix: "" },
  ]

  return (
    <section ref={ref} style={{ background: C.surface, padding: "88px 56px" }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0" }}>
        {stats.map((stat, i) => {
          const count = useCountUp(stat.value, inView, i === 0 ? 2400 : 1800)
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.13 }}
              style={{
                padding: "0 40px",
                borderLeft: `4px solid ${C.brass}`,
                marginLeft: i > 0 ? "0" : "0",
                paddingLeft: "32px",
                position: "relative",
              }}
            >
              {i > 0 && (
                <div style={{
                  position: "absolute",
                  left: 0, top: 0, bottom: 0,
                  width: "1px",
                  background: C.border,
                }} />
              )}
              <div style={{
                fontFamily: FONT_HEADING,
                fontStyle: "italic",
                fontSize: "58px",
                fontWeight: 300,
                color: C.brass,
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}>
                {count}{stat.suffix}
              </div>
              <div style={{
                fontFamily: FONT_BODY,
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: C.textMuted,
                marginTop: "10px",
                lineHeight: 1.5,
              }}>
                {stat.label}
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

// ─── FEATURES TABS ───────────────────────────────────────────────────────────────
function FeaturesTabs() {
  const [active, setActive] = useState(0)

  const tabs = [
    {
      label: "Manufacture",
      heading: "L'Atelier au Cœur du Processus",
      description: "Notre manufacture genevoise abrite 14 horlogers maîtres dont la formation s'étend sur dix années minimum. Chaque composant — du plateau au coq de balancier — est usiné, poli et assemblé dans nos ateliers. Nous refusons la sous-traitance pour les pièces qui touchent au mouvement. C'est ce choix radical qui définit notre ADN depuis 1987.",
      specs: ["Calibre maison AM-3601 (29 rubis)", "3 600 oscillations par heure", "Réserve de marche 72h", "Décoration Côtes de Genève, bleuissage à la main"],
    },
    {
      label: "Collections",
      heading: "Trois Familles, Une Vision",
      description: "La Collection Classique célèbre l'élégance intemporelle avec des cadrans épurés, des boîtes en acier 316L et des aiguilles bâton en laiton massif. La Série Limitée pousse l'audace artisanale — guillochage mécanique, complications rares, boîtiers en or gris. Chaque pièce est numérotée et accompagnée d'un certificat d'authenticité nominatif.",
      specs: ["Collection Classique (12 références)", "Série Limitée (6 pièces/an maximum)", "Grand Complication (sur commande)", "Numérotation gravée sur fond de boîte"],
    },
    {
      label: "Sur-Mesure",
      heading: "Votre Temps, Votre Montre",
      description: "Le programme sur-mesure est une collaboration intime entre vous et notre maître horloger chef. Vous choisissez chaque détail — le métal du boîtier, la couleur du cadran, le motif guilloché, la nature du bracelet, les index. La montre est conçue en 12 à 18 mois selon la complexité, et livrée dans un écrin de chêne fabriqué par nos partenaires menuisiers à Lausanne.",
      specs: ["Consultation initiale (2h avec le maître horloger)", "Plans techniques remis au client", "Suivi photographique de la fabrication", "Livraison en écrin de chêne numéroté"],
    },
    {
      label: "Service & Révision",
      heading: "La Garantie du Temps Long",
      description: "Toute montre Atelier Mécanique est couverte par une garantie de 5 ans pièces et main d'œuvre. Nous recommandons une révision complète tous les 7 à 10 ans. Notre service après-vente prend en charge les montres de toutes générations, y compris les pièces fabriquées en 1987. Nous ne substituons jamais un composant original par une pièce de remplacement si l'original peut être restauré.",
      specs: ["Révision complète en 6 semaines", "Remplacement pièces 100% maison", "Rapport de révision photographique", "Garantie post-révision 2 ans"],
    },
  ]

  return (
    <section style={{ background: C.bg, padding: "120px 56px" }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: "64px" }}
        >
          <p style={{ fontFamily: FONT_BODY, fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", color: C.brass, marginBottom: "16px" }}>
            Savoir-faire
          </p>
          <h2 style={{
            fontFamily: FONT_HEADING,
            fontStyle: "italic",
            fontSize: "54px",
            fontWeight: 300,
            color: C.cream,
            margin: 0,
            lineHeight: 1.1,
            maxWidth: "520px",
          }}>
            Quatre Piliers d'une Maison Indépendante
          </h2>
        </motion.div>

        {/* Tab buttons */}
        <div style={{ display: "flex", gap: "0", borderBottom: `1px solid ${C.border}`, marginBottom: "60px" }}>
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                background: "none",
                border: "none",
                borderBottom: active === i ? `2px solid ${C.brass}` : "2px solid transparent",
                padding: "14px 28px",
                fontFamily: FONT_BODY,
                fontSize: "11px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: active === i ? C.brass : C.textMuted,
                cursor: "pointer",
                transition: "all 0.3s ease",
                marginBottom: "-1px",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}
          >
            <div>
              <h3 style={{
                fontFamily: FONT_HEADING,
                fontStyle: "italic",
                fontSize: "38px",
                fontWeight: 300,
                color: C.cream,
                margin: "0 0 24px",
                lineHeight: 1.2,
              }}>
                {tabs[active].heading}
              </h3>
              <p style={{
                fontFamily: FONT_BODY,
                fontSize: "14px",
                color: "rgba(245,240,232,0.6)",
                lineHeight: 1.85,
                margin: "0 0 36px",
              }}>
                {tabs[active].description}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                {tabs[active].specs.map((spec) => (
                  <li key={spec} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                    <span style={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      background: C.brass,
                      flexShrink: 0,
                      marginTop: "6px",
                    }} />
                    <span style={{ fontFamily: FONT_BODY, fontSize: "13px", color: "rgba(245,240,232,0.75)", lineHeight: 1.5 }}>
                      {spec}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{
              aspectRatio: "1",
              background: C.surface,
              border: `1px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Decorative watch face */}
              <svg width="260" height="260" viewBox="0 0 260 260" fill="none" opacity="0.6">
                <circle cx="130" cy="130" r="120" stroke={C.brass} strokeWidth="0.6" />
                <circle cx="130" cy="130" r="100" stroke={C.brass} strokeWidth="0.3" strokeDasharray="3 4" />
                <circle cx="130" cy="130" r="6" fill={C.brass} />
                {[...Array(12)].map((_, i) => {
                  const angle = (i * 30 - 90) * (Math.PI / 180)
                  const x1 = 130 + 108 * Math.cos(angle)
                  const y1 = 130 + 108 * Math.sin(angle)
                  const x2 = 130 + 116 * Math.cos(angle)
                  const y2 = 130 + 116 * Math.sin(angle)
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.brass} strokeWidth={i % 3 === 0 ? "2" : "0.8"} />
                })}
                <line x1="130" y1="130" x2="130" y2="50" stroke={C.cream} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                <line x1="130" y1="130" x2="180" y2="130" stroke={C.cream} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
              </svg>
              <div style={{
                position: "absolute",
                bottom: "24px",
                right: "24px",
                fontFamily: FONT_HEADING,
                fontStyle: "italic",
                fontSize: "11px",
                color: C.brass,
                letterSpacing: "0.1em",
              }}>
                Calibre AM-3601
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────────
function Testimonials() {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)

  const items = [
    {
      quote: "J'ai acquis ma première pièce Atelier Mécanique en 1998 — une Classique en acier, cadran ardoise. Vingt-six ans plus tard, elle fonctionne comme au premier jour. Cette montre a assisté à mes remises de prix, accompagné mes voyages sur quatre continents. C'est l'objet le plus précieux que je possède.",
      author: "Jean-François Lebrun",
      title: "Collectionneur, Lyon — Propriétaire depuis 1998",
    },
    {
      quote: "Ce qui me fascine chez Atelier Mécanique, c'est leur refus de compromis. Dans un secteur où les marques indépendantes cèdent les unes après les autres aux grands groupes, ils ont maintenu leur manufacture à Genève, leurs artisans formés en interne, leur calibre maison. Cela mérite un respect profond.",
      author: "Hiroshi Tanaka",
      title: "Critique horloger, Watch Collector Japan",
    },
    {
      quote: "La Série Limitée 2023, référence SL-07, est probablement la montre la plus belle que j'aie jamais portée. Le cadran guilloché à la main capte la lumière d'une manière que la photographie ne peut pas retranscrire. Il faut la voir sur le poignet pour comprendre.",
      author: "Aleksandr Petrov",
      title: "Collectionneur privé, Genève",
    },
    {
      quote: "Le programme sur-mesure d'Atelier Mécanique m'a permis de collaborer avec leur maître horloger sur chaque détail de ma montre de mariée. Du choix de l'or blanc à la couleur ivoire du cadran, du gravure du fond de boîte à la longueur du bracelet. Dix-huit mois pour créer quelque chose d'unique — cela vaut chaque centime.",
      author: "Émilie Casanova",
      title: "Cliente sur-mesure, Paris",
    },
  ]

  const paginate = (newDir: number) => {
    setDir(newDir)
    setIndex((prev) => (prev + newDir + items.length) % items.length)
  }

  return (
    <section style={{ background: C.surface, padding: "120px 56px" }}>
      <div style={{ maxWidth: "840px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "72px" }}
        >
          <p style={{ fontFamily: FONT_BODY, fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", color: C.brass, marginBottom: "16px" }}>
            Ils nous font confiance
          </p>
          <h2 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: "48px", fontWeight: 300, color: C.cream, margin: 0, lineHeight: 1.1 }}>
            La Parole des Collectionneurs
          </h2>
        </motion.div>

        <div style={{ position: "relative", minHeight: "280px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={index}
              custom={dir}
              initial={{ opacity: 0, x: dir * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -60 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ textAlign: "center", padding: "0 32px" }}
            >
              <svg width="32" height="22" viewBox="0 0 32 22" fill="none" style={{ marginBottom: "32px", opacity: 0.4 }}>
                <path d="M0 22V13.2C0 9.73333 0.8 6.86667 2.4 4.6C4 2.33333 6.4 0.8 9.6 0L11.2 2.6C9.06667 3.26667 7.46667 4.33333 6.4 5.8C5.33333 7.26667 4.86667 9 5 11H9.6V22H0ZM20.8 22V13.2C20.8 9.73333 21.6 6.86667 23.2 4.6C24.8 2.33333 27.2 0.8 30.4 0L32 2.6C29.8667 3.26667 28.2667 4.33333 27.2 5.8C26.1333 7.26667 25.6667 9 25.8 11H30.4V22H20.8Z" fill={C.brass} />
              </svg>
              <p style={{
                fontFamily: FONT_HEADING,
                fontStyle: "italic",
                fontSize: "22px",
                fontWeight: 300,
                color: C.cream,
                lineHeight: 1.65,
                margin: "0 0 40px",
                letterSpacing: "0.01em",
              }}>
                {items[index].quote}
              </p>
              <div style={{ width: "28px", height: "1px", background: C.brass, margin: "0 auto 20px" }} />
              <p style={{ fontFamily: FONT_BODY, fontSize: "13px", fontWeight: 600, color: C.cream, margin: "0 0 6px", letterSpacing: "0.08em" }}>
                {items[index].author}
              </p>
              <p style={{ fontFamily: FONT_BODY, fontSize: "12px", color: C.textMuted, letterSpacing: "0.06em" }}>
                {items[index].title}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "28px", marginTop: "48px" }}>
          <motion.button
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
            onClick={() => paginate(-1)}
            style={{ width: "44px", height: "44px", border: `1px solid ${C.border}`, background: "none", cursor: "pointer", color: C.cream, fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            ←
          </motion.button>
          <div style={{ display: "flex", gap: "8px" }}>
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDir(i > index ? 1 : -1); setIndex(i) }}
                style={{
                  width: i === index ? "28px" : "8px",
                  height: "2px",
                  background: i === index ? C.brass : C.border,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  padding: 0,
                }}
              />
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
            onClick={() => paginate(1)}
            style={{ width: "44px", height: "44px", border: `1px solid ${C.border}`, background: "none", cursor: "pointer", color: C.cream, fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            →
          </motion.button>
        </div>
      </div>
    </section>
  )
}

// ─── PRICING ─────────────────────────────────────────────────────────────────────
function Pricing() {
  const tiers = [
    {
      name: "Collection Classique",
      price: "à partir de 4 800€",
      highlight: false,
      description: "L'entrée dans l'univers Atelier Mécanique. Nos références permanentes en acier inoxydable, cadrans épurés, mouvement maison AM-3601.",
      features: [
        "Boîtier acier 316L (38 ou 40mm)",
        "Calibre maison AM-3601",
        "Réserve de marche 72 heures",
        "Étanchéité 50m",
        "Garantie 5 ans",
        "Bracelet cuir ou acier au choix",
      ],
      cta: "Découvrir la Collection",
    },
    {
      name: "Série Limitée",
      price: "à partir de 12 500€",
      highlight: true,
      description: "6 pièces maximum par référence. Cadrans guillochés mécaniquement, complications exclusives, boîtiers en or gris ou rose sur demande.",
      features: [
        "Tirage limité à 6 exemplaires",
        "Cadran guilloché à la machine",
        "Complications (GMT, chronographe)",
        "Or gris ou acier DLC",
        "Certificat nominatif numéroté",
        "Livraison écrin en chêne",
        "Garantie 7 ans",
      ],
      cta: "Voir les Disponibilités",
    },
    {
      name: "Grand Complication",
      price: "à partir de 38 000€",
      highlight: false,
      description: "Réservé aux amateurs de haute horlogerie. Tourbillon, répétition minutes, ou perpetual calendar — sur commande uniquement.",
      features: [
        "Tourbillon ou Grande Complication",
        "Fabrication 12 à 18 mois",
        "Rendez-vous atelier inclus",
        "Suivi de fabrication photographique",
        "Pièce unique ou tirée à 1",
        "Fond de boîte saphir gravé",
      ],
      cta: "Prendre Rendez-vous",
    },
  ]

  return (
    <section style={{ background: C.bg, padding: "120px 56px" }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: "72px" }}
        >
          <p style={{ fontFamily: FONT_BODY, fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", color: C.brass, marginBottom: "16px" }}>
            Collections
          </p>
          <h2 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: "54px", fontWeight: 300, color: C.cream, margin: 0, lineHeight: 1.1 }}>
            Trois Niveaux d'Horlogerie
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", alignItems: "start" }}>
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.13 }}
              whileHover={{ y: -6 }}
              style={{
                background: tier.highlight ? C.surface : "transparent",
                border: tier.highlight ? `1px solid ${C.brass}` : `1px solid ${C.border}`,
                padding: "48px 36px",
                transform: tier.highlight ? "scale(1.03)" : "scale(1)",
                position: "relative",
              }}
            >
              {tier.highlight && (
                <div style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0,
                  height: "3px",
                  background: C.brass,
                }} />
              )}
              <p style={{
                fontFamily: FONT_BODY,
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: tier.highlight ? C.brass : C.textMuted,
                margin: "0 0 16px",
              }}>
                {tier.name}
              </p>
              <div style={{
                fontFamily: FONT_HEADING,
                fontStyle: "italic",
                fontSize: "28px",
                fontWeight: 300,
                color: tier.highlight ? C.cream : C.cream,
                margin: "0 0 8px",
                lineHeight: 1.2,
                opacity: tier.highlight ? 1 : 0.8,
              }}>
                {tier.price}
              </div>
              <p style={{
                fontFamily: FONT_BODY,
                fontSize: "13px",
                color: "rgba(245,240,232,0.5)",
                lineHeight: 1.75,
                margin: "16px 0 32px",
              }}>
                {tier.description}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {tier.features.map((f) => (
                  <li key={f} style={{ display: "flex", gap: "12px", fontFamily: FONT_BODY, fontSize: "13px", color: "rgba(245,240,232,0.65)", alignItems: "flex-start" }}>
                    <span style={{ color: C.brass, flexShrink: 0, fontSize: "11px", marginTop: "2px" }}>◆</span>
                    {f}
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ opacity: 0.8 }} whileTap={{ scale: 0.97 }}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: tier.highlight ? C.brass : "none",
                  color: tier.highlight ? "#0f0f0f" : C.cream,
                  border: tier.highlight ? "none" : `1px solid ${C.border}`,
                  fontFamily: FONT_BODY,
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  fontWeight: tier.highlight ? 600 : 400,
                }}
              >
                {tier.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            fontFamily: FONT_BODY,
            fontSize: "12px",
            color: C.textMuted,
            textAlign: "center",
            marginTop: "40px",
            letterSpacing: "0.04em",
          }}
        >
          Les prix sont indiqués en euros TTC, hors options et personnalisations. Financement disponible sur demande.
        </motion.p>
      </div>
    </section>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  const questions = [
    {
      q: "Quel est le délai de fabrication d'une montre ?",
      a: "Pour une Collection Classique disponible en stock, le délai de livraison est de 2 à 3 semaines. Pour les Séries Limitées, les pièces sont généralement commandées avant fabrication — le délai est de 4 à 6 mois selon la complexité du cadran. Pour une Grand Complication, comptez 12 à 18 mois minimum, avec plusieurs rendez-vous à l'atelier pour suivre l'avancement.",
    },
    {
      q: "Quelle garantie couvre les montres Atelier Mécanique ?",
      a: "Toutes nos montres bénéficient d'une garantie de 5 ans sur les pièces et la main d'œuvre (7 ans pour les Séries Limitées). Cette garantie couvre les défauts de fabrication et tout dysfonctionnement mécanique non lié à un choc ou une immersion excessive. En cas de problème, nous prenons en charge les frais de port aller-retour pour les clients en Europe.",
    },
    {
      q: "À quelle fréquence faut-il faire réviser sa montre ?",
      a: "Nous recommandons une révision complète tous les 7 à 10 ans pour les calibres mécaniques standards. La révision comprend le démontage intégral du mouvement, le nettoyage des composants aux ultrasons, le remplacement des pièces d'usure (ressorts, joints), le réglage fin, et la repolissage optionnel du boîtier. Une révision Atelier Mécanique est garantie 2 ans.",
    },
    {
      q: "Est-il possible de reprendre une pièce ancienne ?",
      a: "Nous proposons un programme d'échange pour les pièces Atelier Mécanique uniquement (toutes générations). L'estimation est réalisée par notre équipe après examen de la montre. La valeur de reprise varie selon l'état de la pièce, la référence et la rareté. Certaines pièces des premières années (1987–1995) ont une valeur de collection supérieure à leur valeur de marché standard.",
    },
    {
      q: "Proposez-vous un financement pour les achats ?",
      a: "Oui, nous travaillons avec un partenaire financier agréé pour les achats supérieurs à 5 000€. Plusieurs formules sont disponibles : paiement en 3, 6 ou 12 fois sans frais (sous conditions), ou crédit sur 24 à 48 mois pour les Grand Complications. Les modalités sont étudiées individuellement lors de votre rendez-vous en boutique ou à l'atelier.",
    },
    {
      q: "Puis-je visiter la manufacture à Genève ?",
      a: "Les visites de la manufacture sont organisées deux fois par mois, sur invitation ou sur demande pour les clients propriétaires d'une pièce Atelier Mécanique. La visite (environ 90 minutes) vous permet d'observer les horlogers au travail, de découvrir les ateliers d'usinage et d'assemblage, et d'assister — si le planning le permet — à une démonstration de guilloché mécanique.",
    },
  ]

  return (
    <section style={{ background: C.surface, padding: "120px 56px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: "72px" }}
        >
          <p style={{ fontFamily: FONT_BODY, fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", color: C.brass, marginBottom: "16px" }}>
            Questions fréquentes
          </p>
          <h2 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: "50px", fontWeight: 300, color: C.cream, margin: 0, lineHeight: 1.1 }}>
            Ce que nos collectionneurs souhaitent savoir
          </h2>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {questions.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              style={{ borderBottom: `1px solid ${C.border}` }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "none",
                  border: "none",
                  padding: "26px 0",
                  cursor: "pointer",
                  textAlign: "left",
                  gap: "24px",
                }}
              >
                <span style={{
                  fontFamily: FONT_HEADING,
                  fontStyle: "italic",
                  fontSize: "20px",
                  fontWeight: 300,
                  color: open === i ? C.brass : C.cream,
                  lineHeight: 1.3,
                  transition: "color 0.3s",
                }}>
                  {item.q}
                </span>
                <motion.div
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    flexShrink: 0,
                    width: "24px",
                    height: "24px",
                    border: `1px solid ${open === i ? C.brass : C.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    color: open === i ? C.brass : C.textMuted,
                    transition: "border-color 0.3s, color 0.3s",
                  }}
                >
                  +
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <p style={{
                      fontFamily: FONT_BODY,
                      fontSize: "14px",
                      color: "rgba(245,240,232,0.55)",
                      lineHeight: 1.85,
                      padding: "0 0 28px",
                      margin: 0,
                    }}>
                      {item.a}
                    </p>
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

// ─── CTA BANNER ──────────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section style={{
      background: `linear-gradient(135deg, #1a1411 0%, ${C.bg} 100%)`,
      padding: "120px 56px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
      borderTop: `1px solid ${C.border}`,
    }}>
      {/* Background decorative element */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "800px",
        height: "800px",
        borderRadius: "50%",
        border: `1px solid rgba(184,115,51,0.06)`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "550px",
        height: "550px",
        borderRadius: "50%",
        border: `1px solid rgba(184,115,51,0.04)`,
        pointerEvents: "none",
      }} />

      <motion.div
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        style={{ position: "relative", zIndex: 1 }}
      >
        <p style={{
          fontFamily: FONT_BODY,
          fontSize: "10px",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: C.brass,
          marginBottom: "28px",
        }}>
          Manufacture Genevoise
        </p>
        <h2 style={{
          fontFamily: FONT_HEADING,
          fontStyle: "italic",
          fontSize: "72px",
          fontWeight: 300,
          color: C.cream,
          margin: "0 0 32px",
          lineHeight: 1.0,
          letterSpacing: "-0.01em",
        }}>
          Prendre Rendez-vous à l'Atelier
        </h2>
        <p style={{
          fontFamily: FONT_BODY,
          fontSize: "15px",
          color: "rgba(245,240,232,0.45)",
          maxWidth: "520px",
          margin: "0 auto 52px",
          lineHeight: 1.8,
        }}>
          Venez découvrir notre manufacture, rencontrer nos horlogers, et commencer votre voyage vers la montre parfaite. Les rendez-vous sont disponibles du mardi au vendredi à Genève.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <motion.button
            whileHover={{ scale: 1.04, background: C.brassLight }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: C.brass,
              color: "#0f0f0f",
              border: "none",
              padding: "18px 52px",
              fontFamily: FONT_BODY,
              fontSize: "12px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontWeight: 600,
              transition: "background 0.3s ease",
            }}
          >
            Réserver mon Rendez-vous
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            style={{
              background: "none",
              color: C.cream,
              border: `1px solid rgba(245,240,232,0.2)`,
              padding: "18px 52px",
              fontFamily: FONT_BODY,
              fontSize: "12px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Catalogue PDF
          </motion.button>
        </div>
        <p style={{
          fontFamily: FONT_BODY,
          fontSize: "12px",
          color: C.textMuted,
          marginTop: "28px",
          letterSpacing: "0.06em",
        }}>
          +41 22 700 00 00 · contact@ateliermecanique.ch · Rue de Rive 14, 1204 Genève
        </p>
      </motion.div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────────
function Footer() {
  const columns = [
    {
      title: "Collections",
      links: ["Classique", "Série Limitée", "Grand Complication", "Sur-Mesure"],
    },
    {
      title: "Manufacture",
      links: ["Notre histoire", "Les artisans", "Le calibre AM-3601", "Visiter l'atelier"],
    },
    {
      title: "Services",
      links: ["Révision & entretien", "Financement", "Programme de reprise", "Livraison & assurance"],
    },
    {
      title: "Contact",
      links: ["contact@ateliermecanique.ch", "+41 22 700 00 00", "Rue de Rive 14, Genève", "Mar–Ven 9h–18h (sur RDV)"],
    },
  ]

  return (
    <footer style={{ background: "#080808", padding: "80px 56px 40px" }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: "48px", marginBottom: "64px" }}>
          <div>
            <div style={{ marginBottom: "4px" }}>
              <span style={{
                fontFamily: FONT_HEADING,
                fontStyle: "italic",
                fontSize: "26px",
                fontWeight: 300,
                color: C.cream,
                letterSpacing: "0.08em",
              }}>
                Atelier Mécanique
              </span>
            </div>
            <p style={{
              fontFamily: FONT_BODY,
              fontSize: "10px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: C.brass,
              margin: "4px 0 20px",
            }}>
              Horlogerie Indépendante · Genève
            </p>
            <p style={{
              fontFamily: FONT_BODY,
              fontSize: "13px",
              color: "rgba(245,240,232,0.35)",
              lineHeight: 1.75,
              maxWidth: "240px",
            }}>
              Maîtres horlogers genevois depuis 1987. Chaque pièce est fabriquée à la main, pour durer une vie.
            </p>
            <div style={{ display: "flex", gap: "16px", marginTop: "28px" }}>
              {[
                { label: "Camera", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
                { label: "YouTube", path: "M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" },
                { label: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
              ].map((s) => (
                <motion.a
                  key={s.label}
                  href="#"
                  whileHover={{ opacity: 0.5 }}
                  style={{ color: C.brass, display: "flex" }}
                  aria-label={s.label}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d={s.path} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p style={{
                fontFamily: FONT_BODY,
                fontSize: "9px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(245,240,232,0.25)",
                marginBottom: "20px",
              }}>
                {col.title}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {col.links.map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 4, color: C.cream }}
                      style={{
                        fontFamily: FONT_BODY,
                        fontSize: "13px",
                        color: "rgba(245,240,232,0.45)",
                        textDecoration: "none",
                        display: "inline-block",
                        transition: "color 0.2s",
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

        <div style={{
          borderTop: `1px solid ${C.border}`,
          paddingTop: "32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: "12px", color: "rgba(245,240,232,0.2)", margin: 0, letterSpacing: "0.04em" }}>
            © 2026 Atelier Mécanique SA — Horlogerie Indépendante, Genève. Tous droits réservés.
          </p>
          <div style={{ display: "flex", gap: "24px" }}>
            {["Mentions légales", "Confidentialité", "CGV"].map((item) => (
              <a key={item} href="#" style={{ fontFamily: FONT_BODY, fontSize: "11px", color: "rgba(245,240,232,0.2)", textDecoration: "none", letterSpacing: "0.06em" }}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── PAGE ROOT ────────────────────────────────────────────────────────────────────
export default function Page() {
  return (
    <main style={{ background: C.bg, minHeight: "100vh", fontFamily: FONT_BODY }}>
      <Navbar />
      <Hero />
      <StatsBar />
      <FeaturesTabs />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTABanner />
      <Footer />
    </main>
  )
}
