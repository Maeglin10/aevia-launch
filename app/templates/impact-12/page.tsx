"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"

const C = {
  bg: "#ffffff",
  black: "#0a0a0a",
  accent: "#8b0000",
  gray: "#f4f4f4",
  grayMid: "#e8e8e8",
  textMuted: "#888888",
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

function useCountUp(target: number, inView: boolean, duration = 1800) {
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

// ─── NAVBAR ────────────────────────────────────────────────────────────────────
function Navbar() {
  const scrolled = useScrolled(80)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <motion.nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 48px",
        height: "72px",
        background: scrolled ? C.bg : "transparent",
        borderBottom: scrolled ? `1px solid ${C.grayMid}` : "none",
        transition: "background 0.4s ease, border-color 0.4s ease",
      }}
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <span
        style={{
          fontFamily: FONT_HEADING,
          fontSize: "22px",
          fontStyle: "italic",
          letterSpacing: "0.12em",
          color: scrolled ? C.black : C.bg,
          fontWeight: 400,
          transition: "color 0.4s ease",
        }}
      >
        NOIR
      </span>

      <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>
        {["Collections", "Accessoires", "Sur-Mesure", "Maison"].map((item) => (
          <Link
            key={item}
            href="#"
            style={{
              fontFamily: FONT_BODY,
              fontSize: "12px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: scrolled ? C.black : C.bg,
              textDecoration: "none",
              transition: "color 0.4s ease",
            }}
          >
            {item}
          </Link>
        ))}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            fontFamily: FONT_BODY,
            fontSize: "11px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            background: C.accent,
            color: C.bg,
            border: "none",
            padding: "10px 24px",
            cursor: "pointer",
          }}
        >
          Boutique
        </motion.button>
      </div>
    </motion.nav>
  )
}

// ─── HERO ───────────────────────────────────────────────────────────────────────
function Hero() {
  const { scrollY } = useScroll()
  const titleY = useTransform(scrollY, [0, 600], [0, -60])
  const imagesY = useTransform(scrollY, [0, 600], [0, 30])

  const editorialImages = [
    { bg: "#1a1a1a", rotation: "-2deg", offset: "0px" },
    { bg: "#2a2a2a", rotation: "1.5deg", offset: "30px" },
    { bg: "#111111", rotation: "-0.8deg", offset: "15px" },
  ]

  return (
    <section style={{ height: "100vh", display: "flex", overflow: "hidden" }}>
      {/* Left — Black typographic side */}
      <motion.div
        style={{
          flex: "0 0 50%",
          background: C.black,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "120px 64px 64px",
          y: titleY,
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
          {["COLLECTION", "AUTOMNE", "2026"].map((word, i) => (
            <motion.div
              key={word}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 + i * 0.15, ease: "easeOut" }}
              style={{
                fontFamily: FONT_HEADING,
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: i === 0 ? "88px" : i === 1 ? "72px" : "60px",
                lineHeight: 0.92,
                color: i === 2 ? C.accent : C.bg,
                letterSpacing: "-0.02em",
                display: "block",
              }}
            >
              {word}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          style={{
            marginTop: "48px",
            paddingTop: "32px",
            borderTop: `1px solid rgba(255,255,255,0.15)`,
          }}
        >
          <p style={{
            fontFamily: FONT_BODY,
            fontSize: "13px",
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "0.1em",
            lineHeight: 1.7,
            maxWidth: "320px",
          }}>
            Une ode à la féminité contemporaine. Des silhouettes architecturales qui épousent chaque mouvement, taillées dans les plus beaux draps français et soies italiennes.
          </p>
          <motion.button
            whileHover={{ x: 6 }}
            style={{
              marginTop: "32px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "none",
              border: "none",
              color: C.bg,
              fontFamily: FONT_BODY,
              fontSize: "12px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Découvrir
            <span style={{ color: C.accent, fontSize: "18px" }}>→</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Right — Editorial images */}
      <motion.div
        style={{
          flex: "0 0 50%",
          background: C.bg,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 48px",
          y: imagesY,
        }}
      >
        {editorialImages.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: img.rotation }}
            transition={{ duration: 1, delay: 0.4 + i * 0.2, ease: "easeOut" }}
            style={{
              position: "absolute",
              width: "200px",
              height: "280px",
              background: img.bg,
              borderRadius: "2px",
              top: `${20 + i * 22}%`,
              left: `${15 + i * 18}%`,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "flex-end",
              padding: "16px",
            }}
          >
            <span style={{
              fontFamily: FONT_HEADING,
              fontStyle: "italic",
              color: "rgba(255,255,255,0.4)",
              fontSize: "11px",
              letterSpacing: "0.12em",
            }}>
              {["Manteau Sculpt", "Robe Ligne A", "Veste Boucle"][i]}
            </span>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{
            position: "absolute",
            bottom: "40px",
            right: "40px",
            fontFamily: FONT_HEADING,
            fontStyle: "italic",
            fontSize: "11px",
            color: C.textMuted,
            letterSpacing: "0.14em",
          }}
        >
          Paris, France — Maison fondée en 2011
        </motion.div>
      </motion.div>
    </section>
  )
}

// ─── STATS BAR ──────────────────────────────────────────────────────────────────
function StatsBar() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  const stats = [
    { value: 15, suffix: "", label: "Années de création" },
    { value: 42, suffix: "", label: "Pays dans le monde" },
    { value: 8, suffix: "", label: "Collections par an" },
    { value: 12000, suffix: "+", label: "Clientes fidèles" },
  ]

  return (
    <section
      ref={ref}
      style={{
        background: C.black,
        padding: "72px 48px",
        display: "flex",
        justifyContent: "center",
        gap: "0",
      }}
    >
      {stats.map((stat, i) => {
        const count = useCountUp(stat.value, inView)
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: i * 0.12 }}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "0 32px",
              borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
            }}
          >
            <div style={{
              fontFamily: FONT_HEADING,
              fontStyle: "italic",
              fontSize: "60px",
              fontWeight: 300,
              color: C.accent,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}>
              {count}{stat.suffix}
            </div>
            <div style={{
              fontFamily: FONT_BODY,
              fontSize: "11px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
              marginTop: "12px",
            }}>
              {stat.label}
            </div>
          </motion.div>
        )
      })}
    </section>
  )
}

// ─── FEATURES TABS ──────────────────────────────────────────────────────────────
function FeaturesTabs() {
  const [active, setActive] = useState(0)

  const tabs = [
    {
      label: "Prêt-à-Porter",
      heading: "La Silhouette Moderne",
      description: "Chaque pièce de notre prêt-à-porter est pensée comme un investissement vestimentaire. Des coupes architecturales qui transcendent les saisons, réalisées en partenariat avec les meilleures filatures françaises et italiennes. De la robe de jour au manteau de soirée, la collection Automne 2026 offre 48 pièces pensées pour une garde-robe capsule d'exception.",
      items: ["Robes & Jupes", "Manteaux & Vestes", "Pantalons & Ensembles", "Mailles & Tricots"],
    },
    {
      label: "Accessoires",
      heading: "Les Détails qui Signent",
      description: "Nos accessoires ne complètent pas une tenue — ils la définissent. Sacs en cuir pleine fleur tanné en France, écharpes en cachemire double-face, ceintures sculptées à la main. Chaque accessoire est produit en série limitée et porte un numéro d'édition gravé sur son intérieur, témoignage de son caractère unique.",
      items: ["Sacs & Pochettes", "Ceintures & Bijoux", "Écharpes & Châles", "Chaussures"],
    },
    {
      label: "Sur-Mesure",
      heading: "L'Atelier à Votre Service",
      description: "Notre service sur-mesure vous accueille sur rendez-vous dans l'atelier parisien. Un styliste dédié vous accompagne de la sélection du tissu jusqu'à l'essayage final. Chaque pièce sur-mesure est confectionnée en 6 à 8 semaines par nos petites mains, et livrée dans un coffret de présentation numéroté.",
      items: ["Consultation stylistique", "Choix des tissus", "3 essayages inclus", "Livraison en coffret"],
    },
    {
      label: "Archives",
      heading: "L'Histoire de la Maison",
      description: "Depuis 2011, chaque collection est archivée et documentée dans notre livre de maison. Certaines pièces d'archives sont disponibles à la vente dans notre espace dédié — pièces iconiques des collections passées, rééditées ou vendues telles quelles pour les collectionneuses qui souhaitent posséder un fragment de l'histoire NOIR.",
      items: ["Collections passées", "Pièces iconiques", "Éditions spéciales", "Livre de la Maison"],
    },
  ]

  return (
    <section style={{ background: C.bg, padding: "120px 48px" }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "64px" }}
        >
          <p style={{ fontFamily: FONT_BODY, fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent, marginBottom: "16px" }}>
            Notre Univers
          </p>
          <h2 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: "52px", fontWeight: 300, color: C.black, margin: 0, lineHeight: 1.1 }}>
            L'Excellence à Chaque Détail
          </h2>
        </motion.div>

        {/* Tab buttons */}
        <div style={{ display: "flex", gap: "0", borderBottom: `1px solid ${C.grayMid}`, marginBottom: "56px" }}>
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                flex: 1,
                background: "none",
                border: "none",
                borderBottom: active === i ? `2px solid ${C.black}` : "2px solid transparent",
                padding: "16px 24px",
                fontFamily: FONT_BODY,
                fontSize: "12px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: active === i ? C.black : C.textMuted,
                cursor: "pointer",
                transition: "all 0.3s ease",
                marginBottom: "-1px",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}
          >
            <div>
              <h3 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: "40px", fontWeight: 300, color: C.black, margin: "0 0 24px", lineHeight: 1.15 }}>
                {tabs[active].heading}
              </h3>
              <p style={{ fontFamily: FONT_BODY, fontSize: "15px", color: "#555", lineHeight: 1.8, margin: "0 0 32px" }}>
                {tabs[active].description}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {tabs[active].items.map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: FONT_BODY, fontSize: "13px", color: C.black, letterSpacing: "0.04em" }}>
                    <span style={{ width: "20px", height: "1px", background: C.accent, display: "inline-block", flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{
              aspectRatio: "3/4",
              background: C.gray,
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(135deg, #e8e8e8 0%, #d0d0d0 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <span style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: "22px", color: "#bbb", letterSpacing: "0.08em" }}>
                  {tabs[active].label}
                </span>
              </div>
              <div style={{
                position: "absolute",
                bottom: "20px",
                left: "20px",
                width: "40px",
                height: "3px",
                background: C.accent,
              }} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

// ─── TESTIMONIALS ───────────────────────────────────────────────────────────────
function Testimonials() {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)

  const items = [
    {
      quote: "NOIR est l'une des rares maisons qui comprend encore ce que signifie habiller une femme. Pas une silhouette — une femme. Chaque pièce porte une intention, une émotion que l'on ressent dès qu'on la met.",
      author: "Isabelle Renard",
      title: "Rédactrice en chef, Madame Figaro",
    },
    {
      quote: "J'ai découvert NOIR lors de leur troisième collection. Depuis, je n'achète presque plus ailleurs. Le manteau gris ardoise de la collection Hiver 2023 est probablement la pièce la plus parfaite que j'aie jamais portée.",
      author: "Chloé Massart",
      title: "Architecte, cliente depuis 2019",
    },
    {
      quote: "Ce qui me touche chez NOIR, c'est l'honnêteté. Des vêtements qui durent, qui vieillissent bien, qui n'ont pas besoin d'un logo pour affirmer leur valeur. C'est une mode que je défends dans chacun de mes éditoriaux.",
      author: "Sophie Delacour",
      title: "Directrice artistique, Numéro Paris",
    },
    {
      quote: "Le service sur-mesure de la Maison est une expérience en soi. On se sent comprise, accompagnée. La pièce qu'ils m'ont confectionnée pour mon mariage est un héritage que je transmettrai à ma fille.",
      author: "Margaux Thibaut",
      title: "Cliente sur-mesure, Paris",
    },
  ]

  const paginate = (newDir: number) => {
    setDir(newDir)
    setIndex((prev) => (prev + newDir + items.length) % items.length)
  }

  return (
    <section style={{ background: C.gray, padding: "120px 48px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ fontFamily: FONT_BODY, fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent, marginBottom: "56px" }}
        >
          Elles parlent de Noir
        </motion.p>

        <div style={{ position: "relative", minHeight: "240px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={index}
              custom={dir}
              initial={{ opacity: 0, x: dir * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ textAlign: "center", padding: "0 24px" }}
            >
              <p style={{
                fontFamily: FONT_HEADING,
                fontStyle: "italic",
                fontSize: "26px",
                fontWeight: 300,
                color: C.black,
                lineHeight: 1.6,
                margin: "0 0 40px",
                letterSpacing: "0.01em",
              }}>
                "{items[index].quote}"
              </p>
              <div style={{ width: "32px", height: "1px", background: C.accent, margin: "0 auto 20px" }} />
              <p style={{ fontFamily: FONT_BODY, fontSize: "13px", fontWeight: 600, color: C.black, margin: "0 0 6px", letterSpacing: "0.06em" }}>
                {items[index].author}
              </p>
              <p style={{ fontFamily: FONT_BODY, fontSize: "12px", color: C.textMuted, letterSpacing: "0.08em" }}>
                {items[index].title}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "32px", marginTop: "48px" }}>
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => paginate(-1)}
            style={{ width: "44px", height: "44px", borderRadius: "50%", border: `1px solid ${C.grayMid}`, background: C.bg, cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", color: C.black }}
          >
            ←
          </motion.button>
          <div style={{ display: "flex", gap: "8px" }}>
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDir(i > index ? 1 : -1); setIndex(i) }}
                style={{
                  width: i === index ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background: i === index ? C.accent : C.grayMid,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => paginate(1)}
            style={{ width: "44px", height: "44px", borderRadius: "50%", border: `1px solid ${C.grayMid}`, background: C.bg, cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", color: C.black }}
          >
            →
          </motion.button>
        </div>
      </div>
    </section>
  )
}

// ─── PRICING ────────────────────────────────────────────────────────────────────
function Pricing() {
  const tiers = [
    {
      name: "Découverte",
      price: "Gratuit",
      period: "",
      highlight: false,
      description: "Entrez dans l'univers NOIR avec nos contenus exclusifs et nos avant-premières newsletter.",
      features: [
        "Newsletter bi-mensuelle",
        "Accès aux ventes privées",
        "Lookbooks numériques",
        "Invitations aux pop-ups",
      ],
      cta: "Rejoindre",
    },
    {
      name: "Fidèle",
      price: "120€",
      period: "/ an",
      highlight: true,
      description: "Pour les passionnées qui souhaitent vivre la mode NOIR en avant-première, saison après saison.",
      features: [
        "Tout le niveau Découverte",
        "Accès avant-première collections",
        "Invitations défilés & showrooms",
        "Livraison offerte (2/an)",
        "Réductions sur les archives",
      ],
      cta: "Devenir Fidèle",
    },
    {
      name: "Mécène",
      price: "450€",
      period: "/ an",
      highlight: false,
      description: "L'accès le plus intime à la Maison. Pour celles qui souhaitent participer à la création.",
      features: [
        "Tout le niveau Fidèle",
        "Visite de l'atelier (1x/an)",
        "Pièces exclusives Mécène",
        "Consultation stylistique offerte",
        "Nom dans le livre de la Maison",
      ],
      cta: "Devenir Mécène",
    },
  ]

  return (
    <section style={{ background: C.bg, padding: "120px 48px" }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "72px" }}
        >
          <p style={{ fontFamily: FONT_BODY, fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent, marginBottom: "16px" }}>
            Cercle NOIR
          </p>
          <h2 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: "52px", fontWeight: 300, color: C.black, margin: 0, lineHeight: 1.1 }}>
            Rejoindre la Maison
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", alignItems: "start" }}>
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -4 }}
              style={{
                border: tier.highlight ? `2px solid ${C.black}` : `1px solid ${C.grayMid}`,
                padding: "48px 36px",
                background: tier.highlight ? C.black : C.bg,
                transform: tier.highlight ? "scale(1.03)" : "scale(1)",
                position: "relative",
              }}
            >
              {tier.highlight && (
                <div style={{
                  position: "absolute",
                  top: "-12px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: C.accent,
                  color: C.bg,
                  fontFamily: FONT_BODY,
                  fontSize: "10px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  padding: "4px 16px",
                }}>
                  Le Plus Choisi
                </div>
              )}
              <p style={{ fontFamily: FONT_BODY, fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: tier.highlight ? "rgba(255,255,255,0.5)" : C.textMuted, margin: "0 0 12px" }}>
                {tier.name}
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "8px" }}>
                <span style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: "48px", fontWeight: 300, color: tier.highlight ? C.bg : C.black, lineHeight: 1 }}>
                  {tier.price}
                </span>
                <span style={{ fontFamily: FONT_BODY, fontSize: "14px", color: tier.highlight ? "rgba(255,255,255,0.5)" : C.textMuted }}>
                  {tier.period}
                </span>
              </div>
              <p style={{ fontFamily: FONT_BODY, fontSize: "13px", color: tier.highlight ? "rgba(255,255,255,0.65)" : "#666", lineHeight: 1.7, margin: "0 0 32px" }}>
                {tier.description}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {tier.features.map((f) => (
                  <li key={f} style={{ display: "flex", gap: "10px", fontFamily: FONT_BODY, fontSize: "13px", color: tier.highlight ? "rgba(255,255,255,0.8)" : "#444" }}>
                    <span style={{ color: C.accent, flexShrink: 0, fontWeight: 700 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ opacity: 0.85 }} whileTap={{ scale: 0.97 }}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: tier.highlight ? C.accent : C.black,
                  color: C.bg,
                  border: "none",
                  fontFamily: FONT_BODY,
                  fontSize: "12px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                {tier.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ────────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  const questions = [
    {
      q: "Comment choisir ma taille chez NOIR ?",
      a: "Nos pièces sont coupées en tailles 34 à 46, avec un guide des tailles détaillé disponible sur chaque fiche produit. Pour les pièces tailleur et les manteaux, nous recommandons de vous référer à votre tour de poitrine et à votre tour de taille. En cas de doute, notre équipe de stylistes est disponible par e-mail et téléphone pour vous conseiller.",
    },
    {
      q: "Quelle est votre politique de retour ?",
      a: "Nous acceptons les retours dans les 30 jours suivant la réception de votre commande, à condition que les pièces soient dans leur état d'origine, non portées, non lavées, avec leurs étiquettes. Les pièces sur-mesure et les éditions limitées ne sont pas éligibles au retour. Les frais de retour sont à la charge de la cliente pour les commandes hors France.",
    },
    {
      q: "Livrez-vous à l'international ?",
      a: "Nous livrons dans 42 pays. Les délais varient de 3 à 7 jours ouvrés selon la destination. La livraison en France métropolitaine est offerte dès 200€ d'achat. Les commandes internationales sont expédiées via DHL Express avec numéro de suivi. Des droits de douane peuvent s'appliquer selon les réglementations locales.",
    },
    {
      q: "Quels sont les délais pour une pièce sur-mesure ?",
      a: "Le service sur-mesure requiert un délai de 6 à 8 semaines à partir de la validation de votre commande lors du second essayage. Le processus comprend une consultation initiale (1h), deux essayages de base, et un essayage final. La pièce est ensuite livrée dans son coffret de présentation numéroté.",
    },
    {
      q: "Comment entretenir mes pièces NOIR ?",
      a: "Chaque pièce est accompagnée de ses instructions d'entretien spécifiques. De manière générale, nous recommandons le nettoyage à sec pour les pièces en laine et cachemire. Les soies peuvent être lavées à la main à l'eau froide. Pour les pièces précieuses, nous proposons un service d'entretien et de remise en état en partenariat avec nos ateliers. Conservez vos vêtements dans nos housses de protection fournies à l'achat.",
    },
    {
      q: "Puis-je visiter la Maison à Paris ?",
      a: "Notre showroom parisien situé dans le 6e arrondissement est ouvert du mardi au samedi, sur rendez-vous uniquement. Nos Mécènes bénéficient d'une visite guidée de l'atelier une fois par an. Pour toute demande de rendez-vous, contactez-nous via le formulaire de contact ou appelez-nous au +33 1 42 00 00 00.",
    },
  ]

  return (
    <section style={{ background: C.gray, padding: "120px 48px" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "72px" }}
        >
          <p style={{ fontFamily: FONT_BODY, fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent, marginBottom: "16px" }}>
            Questions fréquentes
          </p>
          <h2 style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: "48px", fontWeight: 300, color: C.black, margin: 0, lineHeight: 1.1 }}>
            Tout ce que vous souhaitez savoir
          </h2>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {questions.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              style={{ borderBottom: `1px solid ${C.grayMid}` }}
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
                  padding: "24px 0",
                  cursor: "pointer",
                  textAlign: "left",
                  gap: "24px",
                }}
              >
                <span style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: "20px", fontWeight: 300, color: C.black, lineHeight: 1.3 }}>
                  {item.q}
                </span>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ flexShrink: 0, width: "20px", height: "20px", border: `1px solid ${C.black}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: C.black }}
                >
                  +
                </motion.span>
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
                      color: "#555",
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

// ─── CTA BANNER ─────────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section style={{ background: C.black, padding: "120px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "2px",
          background: C.accent,
          transformOrigin: "left",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p style={{ fontFamily: FONT_BODY, fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: C.accent, marginBottom: "24px" }}>
          Automne 2026
        </p>
        <h2 style={{
          fontFamily: FONT_HEADING,
          fontStyle: "italic",
          fontSize: "68px",
          fontWeight: 300,
          color: C.bg,
          margin: "0 0 32px",
          lineHeight: 1.05,
          letterSpacing: "-0.01em",
        }}>
          Découvrir la Collection Automne
        </h2>
        <p style={{
          fontFamily: FONT_BODY,
          fontSize: "15px",
          color: "rgba(255,255,255,0.5)",
          maxWidth: "520px",
          margin: "0 auto 48px",
          lineHeight: 1.75,
        }}>
          48 pièces conçues pour durer. Des matières rares, des coupes intemporelles, une élégance qui transcende les saisons.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            style={{
              background: C.accent,
              color: C.bg,
              border: "none",
              padding: "18px 48px",
              fontFamily: FONT_BODY,
              fontSize: "12px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Voir la Collection
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            style={{
              background: "none",
              color: C.bg,
              border: `1px solid rgba(255,255,255,0.3)`,
              padding: "18px 48px",
              fontFamily: FONT_BODY,
              fontSize: "12px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Prendre Rendez-vous
          </motion.button>
        </div>
      </motion.div>
    </section>
  )
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────────
function Footer() {
  const columns = [
    {
      title: "Collections",
      links: ["Automne 2026", "Été 2026", "Hiver 2025", "Archives"],
    },
    {
      title: "Maison",
      links: ["Notre histoire", "L'Atelier", "Engagements", "Presse"],
    },
    {
      title: "Services",
      links: ["Sur-Mesure", "Cercle NOIR", "Livraison", "Retours"],
    },
    {
      title: "Contact",
      links: ["boutique@noir-paris.fr", "+33 1 42 00 00 00", "6e arrondissement, Paris", "Lun–Sam 10h–19h"],
    },
  ]

  return (
    <footer style={{ background: C.black, padding: "80px 48px 40px", color: C.bg }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: "48px", marginBottom: "64px" }}>
          <div>
            <span style={{ fontFamily: FONT_HEADING, fontStyle: "italic", fontSize: "32px", fontWeight: 300, letterSpacing: "0.08em", color: C.bg }}>
              NOIR
            </span>
            <p style={{ fontFamily: FONT_BODY, fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.75, marginTop: "20px", maxWidth: "240px" }}>
              Maison de mode française, prêt-à-porter féminin haut de gamme. Paris, depuis 2011.
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", gap: "16px", marginTop: "28px" }}>
              {[
                { label: "Camera", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
                { label: "Bookmark", path: "M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" },
                { label: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
              ].map((s) => (
                <motion.a
                  key={s.label}
                  href="#"
                  whileHover={{ opacity: 0.6 }}
                  style={{ color: C.bg, display: "flex" }}
                  aria-label={s.label}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d={s.path} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p style={{ fontFamily: FONT_BODY, fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "20px" }}>
                {col.title}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {col.links.map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 4 }}
                      style={{ fontFamily: FONT_BODY, fontSize: "13px", color: "rgba(255,255,255,0.6)", textDecoration: "none", display: "inline-block", transition: "color 0.2s" }}
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: "12px", color: "rgba(255,255,255,0.3)", margin: 0 }}>
            © 2026 NOIR — Maison de Mode Française. Tous droits réservés.
          </p>
          <div style={{ display: "flex", gap: "24px" }}>
            {["Mentions légales", "Confidentialité", "CGV"].map((item) => (
              <a key={item} href="#" style={{ fontFamily: FONT_BODY, fontSize: "11px", color: "rgba(255,255,255,0.3)", textDecoration: "none", letterSpacing: "0.06em" }}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── PAGE ROOT ───────────────────────────────────────────────────────────────────
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
