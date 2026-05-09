"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"

const C = {
  bg: "#080808",
  card: "#111111",
  silver: "#9ca3af",
  accent: "#c4a96a",
  white: "#f5f5f5",
  border: "#1e1e1e",
}

const headingFont = '"Cormorant Garamond", Georgia, serif'
const bodyFont = "system-ui, sans-serif"

// ─── Grain Overlay ────────────────────────────────────────────────────────────
function GrainOverlay() {
  const [freq, setFreq] = useState(0.65)
  useEffect(() => {
    const iv = setInterval(() => {
      setFreq(0.62 + Math.random() * 0.06)
    }, 120)
    return () => clearInterval(iv)
  }, [])
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", opacity: 0.04, overflow: "hidden" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency={`${freq}`} numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  )
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function Counter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1800
    const step = 16
    const increment = target / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, step)
    return () => clearInterval(timer)
  }, [inView, target])
  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString("fr-FR")}{suffix}
    </span>
  )
}

// ─── Photo Card ───────────────────────────────────────────────────────────────
function PhotoCard({ rotate, label, delay }: { rotate: number; label: string; delay: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      style={{
        transform: hovered ? "rotate(0deg)" : `rotate(${rotate}deg)`,
        transition: "transform 0.4s ease",
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 4,
        overflow: "hidden",
        cursor: "pointer",
        aspectRatio: "3/4",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(135deg, #1a1a1a 0%, #222 50%, #161616 100%)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: 12,
      }}>
        <span style={{ fontFamily: bodyFont, fontSize: 11, color: C.silver, letterSpacing: 1.5, textTransform: "uppercase" }}>{label}</span>
      </div>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ObscuraStudio() {
  const { scrollY } = useScroll()
  const heroTitleY = useTransform(scrollY, [0, 500], [0, -70])
  const gridY = useTransform(scrollY, [0, 500], [0, 30])

  const [activeTab, setActiveTab] = useState(0)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [testimonialDir, setTestimonialDir] = useState(1)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const tabs = [
    {
      label: "Portraits",
      title: "Le Portrait comme Révélation",
      body: "Chaque visage raconte une histoire unique. Notre approche du portrait va au-delà de la simple ressemblance — nous cherchons à capturer ce moment fugace où le sujet oublie la caméra et révèle quelque chose d'essentiel. Sessions en studio avec éclairage sur mesure ou en extérieur en lumière naturelle.",
      detail: "Séances individuelles, professionnelles, artistiques ou de famille. Durée 1h à 3h. Consultation préalable offerte.",
    },
    {
      label: "Architecture",
      title: "L'Espace Sublimé",
      body: "L'architecture photographiée est une double création : celle de l'architecte et celle du photographe qui choisit l'angle, la lumière, l'instant. Nous travaillons en étroite collaboration avec architectes et promoteurs pour produire des images qui valorisent chaque projet.",
      detail: "Intérieur, extérieur, chantier, livraison. Visite de repérage incluse. Droits d'utilisation illimités.",
    },
    {
      label: "Mariage & Événements",
      title: "L'Instant Suspendu",
      body: "Le mariage est l'un des rares moments où chaque seconde mérite d'être préservée. Notre style documentaire se mêle à une sensibilité artistique pour produire un reportage authentique, loin des poses convenues. Disponible en France entière et à l'international.",
      detail: "Engagement session incluse. Album premium disponible. Second photographe sur demande.",
    },
    {
      label: "Laboratoire Argentique",
      title: "Le Retour à l'Essentiel",
      body: "Notre laboratoire argentique est l'un des rares encore actifs à Paris. Développement C-41, E-6 et noir & blanc. Tirages baryté fibre, impression contact, agrandissements format XXL. Nous proposons également des ateliers de pratique argentique pour particuliers et professionnels.",
      detail: "Développement sous 48h. Numérisations haute résolution. Stockage archive sécurisé.",
    },
  ]

  const testimonials = [
    {
      name: "Marie-Claire Fontaine",
      role: "Architecte d'intérieur",
      text: "Obscura a transformé la documentation de mes projets. Les images qu'ils produisent capturent non seulement l'espace, mais son âme. Chaque photo que je leur confie revient avec une profondeur que je ne savais pas possible. Partenaire incontournable depuis 2019.",
    },
    {
      name: "Thomas & Élise Renard",
      role: "Mariés en juin 2024",
      text: "Nous avions peur de sembler coincés sur nos photos de mariage. Avec Obscura, c'est tout l'inverse — chaque image respire, chaque moment semble vrai. Le tirage argentique de nos vœux trône dans notre salon. Une œuvre, pas juste une photo.",
    },
    {
      name: "Jean-Baptiste Moreau",
      role: "Directeur artistique, Maison Ledoux",
      text: "J'ai confié à Obscura la campagne portrait de notre collection printemps. La direction artistique, la maîtrise de la lumière, le soin apporté à chaque détail — tout était au niveau de nos exigences les plus élevées. Le résultat a dépassé nos attentes.",
    },
    {
      name: "Camille Assémat",
      role: "Galeriste, Espace 11",
      text: "Obscura documente nos expositions depuis trois ans. Leur sensibilité pour les œuvres d'art est rare — ils savent rendre justice à une sculpture ou une peinture sans en trahir les couleurs ni les textures. Un studio d'une intégrité remarquable.",
    },
  ]

  const faqs = [
    {
      q: "Quel est le délai de livraison des photos ?",
      a: "Pour un portrait ou une séance studio, comptez 10 à 15 jours ouvrés. Pour un reportage mariage, le délai est de 4 à 6 semaines afin de prendre le temps nécessaire à une sélection et une retouche soignées. Les tirages argentiques ont un délai spécifique de 3 à 4 semaines supplémentaires selon la technique.",
    },
    {
      q: "Dans quels formats livrez-vous les fichiers ?",
      a: "Tous nos fichiers numériques sont livrés en JPEG haute résolution (minimum 20 mégapixels) et, sur demande, en TIFF non compressé pour un usage impression grand format. Les photos sont transmises via une galerie privée en ligne sécurisée, téléchargeable pendant 12 mois.",
    },
    {
      q: "Les tirages papier sont-ils inclus dans les formules ?",
      a: "La formule Reportage Découverte inclut 5 tirages fine-art 20×30 cm. La formule Séance Complète inclut 15 tirages fine-art au choix jusqu'au 40×60 cm. Pour les projets sur-mesure, une liasse de tirages est intégrée au devis. Des tirages argentiques supplémentaires sont disponibles à la carte.",
    },
    {
      q: "Réalisez-vous des shootings en extérieur ?",
      a: "Absolument. Nous connaissons une sélection de lieux à Paris et en Île-de-France (friches industrielles, jardins confidentiels, cours d'immeubles haussmanniens) qui offrent une lumière et une atmosphère uniques. Nous pouvons également nous déplacer en province ou à l'international selon votre projet.",
    },
    {
      q: "Peut-on commander des retouches supplémentaires ?",
      a: "Les retouches incluses dans chaque formule correspondent à notre standard éditorial : ajustement d'exposition, de couleur, recadrage et retouche peau légère. Des retouches avancées (compositing, manipulation extensive) sont facturées 45€ de l'heure. Nous vous consultons toujours avant d'engager des heures supplémentaires.",
    },
    {
      q: "Comment se passe la première prise de contact ?",
      a: "Après votre demande en ligne, nous vous proposons un entretien de 30 minutes (en personne au studio ou en visio) pour comprendre votre projet, vos attentes esthétiques et définir ensemble la formule la plus adaptée. Cet entretien est offert et sans engagement.",
    },
  ]

  const pricingTiers = [
    {
      name: "Reportage Découverte",
      price: "450€",
      duration: "2 heures",
      features: ["30 photos retouchées", "5 tirages fine-art 20×30", "Galerie privée 12 mois", "1 format de livraison", "Consultation incluse"],
      highlight: false,
    },
    {
      name: "Séance Complète",
      price: "890€",
      duration: "Demi-journée (4h)",
      features: ["80 photos retouchées", "15 tirages fine-art jusqu'au 40×60", "Galerie privée 24 mois", "JPEG + TIFF inclus", "Repérage de lieu", "Consultant stylisme"],
      highlight: true,
    },
    {
      name: "Projet Sur-Mesure",
      price: "Sur devis",
      duration: "Selon le projet",
      features: ["Campagne de marque", "Livre photographique", "Préparation d'exposition", "Droits commerciaux complets", "Équipe dédiée", "Suivi éditorial complet"],
      highlight: false,
    },
  ]

  function prevTestimonial() {
    setTestimonialDir(-1)
    setActiveTestimonial(i => (i - 1 + testimonials.length) % testimonials.length)
  }
  function nextTestimonial() {
    setTestimonialDir(1)
    setActiveTestimonial(i => (i + 1) % testimonials.length)
  }

  return (
    <div style={{ background: C.bg, color: C.white, fontFamily: bodyFont, minHeight: "100vh" }}>

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px", height: 72,
        background: "rgba(8,8,8,0.92)", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: headingFont, fontSize: 22, fontStyle: "italic", color: C.accent, letterSpacing: 2 }}>
            OBSCURA
          </span>
        </Link>

        <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {["Studio", "Services", "Galerie", "Laboratoire", "Contact"].map(link => (
            <Link key={link} href={`#${link.toLowerCase()}`} style={{
              fontFamily: bodyFont, fontSize: 13, color: C.silver,
              textDecoration: "none", letterSpacing: 1.5, textTransform: "uppercase",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = C.white)}
              onMouseLeave={e => (e.currentTarget.style.color = C.silver)}
            >
              {link}
            </Link>
          ))}
          <motion.a
            href="#booking"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              fontFamily: bodyFont, fontSize: 12, letterSpacing: 2, textTransform: "uppercase",
              background: C.accent, color: C.bg, padding: "10px 24px",
              textDecoration: "none", cursor: "pointer", fontWeight: 600,
            }}
          >
            Réserver
          </motion.a>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section style={{
        position: "relative", height: "100vh", minHeight: 700,
        display: "flex", alignItems: "center",
        overflow: "hidden", paddingTop: 72,
      }}>
        <GrainOverlay />

        {/* Vertical text label */}
        <div style={{
          position: "absolute", left: 32, top: "50%",
          transform: "translateY(-50%) rotate(-90deg)",
          transformOrigin: "center center",
          fontFamily: bodyFont, fontSize: 10, letterSpacing: 6,
          color: C.silver, textTransform: "uppercase", opacity: 0.5,
          whiteSpace: "nowrap", zIndex: 3,
        }}>
          OBSCURA STUDIO — PARIS — DEPUIS 2008
        </div>

        {/* Left: Heading */}
        <div style={{ flex: "0 0 55%", paddingLeft: 96, paddingRight: 48, zIndex: 3 }}>
          <motion.div style={{ y: heroTitleY }}>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ fontFamily: bodyFont, fontSize: 11, letterSpacing: 4, color: C.accent, textTransform: "uppercase", marginBottom: 24 }}
            >
              Studio & Laboratoire photographique
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              style={{
                fontFamily: headingFont, fontStyle: "italic",
                fontSize: "clamp(56px, 7vw, 96px)", fontWeight: 300,
                lineHeight: 1.05, color: C.white, margin: 0,
              }}
            >
              La Lumière<br />
              <span style={{ color: C.accent }}>comme</span><br />
              Medium
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              style={{ fontFamily: bodyFont, fontSize: 16, color: C.silver, marginTop: 28, maxWidth: 440, lineHeight: 1.7 }}
            >
              Photographie argentique et numérique. Portraits, architecture, mariages. Laboratoire de tirage à Paris 11e.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              style={{ display: "flex", gap: 16, marginTop: 40 }}
            >
              <motion.a
                href="#booking"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  fontFamily: bodyFont, fontSize: 12, letterSpacing: 2, textTransform: "uppercase",
                  background: C.accent, color: C.bg, padding: "14px 32px",
                  textDecoration: "none", cursor: "pointer", fontWeight: 700,
                }}
              >
                Réserver une séance
              </motion.a>
              <motion.a
                href="#galerie"
                whileHover={{ borderColor: C.accent, color: C.accent }}
                style={{
                  fontFamily: bodyFont, fontSize: 12, letterSpacing: 2, textTransform: "uppercase",
                  border: `1px solid ${C.border}`, color: C.silver, padding: "14px 32px",
                  textDecoration: "none", cursor: "pointer", transition: "all 0.3s",
                }}
              >
                Voir la galerie
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        {/* Right: Photo grid */}
        <motion.div
          style={{ flex: "0 0 45%", paddingRight: 64, y: gridY, zIndex: 3 }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 380, marginLeft: "auto" }}>
            <PhotoCard rotate={-2} label="Portrait — 2024" delay={0.5} />
            <PhotoCard rotate={1} label="Architecture — Paris" delay={0.65} />
            <PhotoCard rotate={-1} label="Mariage — Bourgogne" delay={0.8} />
            <PhotoCard rotate={2} label="Argentique — Leica" delay={0.95} />
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 3,
          }}
        >
          <span style={{ fontFamily: bodyFont, fontSize: 10, letterSpacing: 3, color: C.silver, textTransform: "uppercase" }}>Défiler</span>
          <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, ${C.silver}, transparent)` }} />
        </motion.div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────────────────── */}
      <section style={{
        borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
        padding: "60px 48px",
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        gap: 0,
      }}>
        {[
          { label: "Fondé en", value: 2008, suffix: "", prefix: "" },
          { label: "Séances réalisées", value: 3200, suffix: "+", prefix: "" },
          { label: "Ans d'expertise", value: 16, suffix: "", prefix: "" },
          { label: "Clients satisfaits", value: 98, suffix: "%", prefix: "" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            style={{
              padding: "0 40px",
              borderRight: i < 3 ? `1px solid ${C.border}` : "none",
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: 52, color: C.accent, lineHeight: 1 }}>
              <Counter target={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
            </div>
            <div style={{ fontFamily: bodyFont, fontSize: 12, color: C.silver, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 8 }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </section>

      {/* ── FEATURES / TABS ────────────────────────────────────────────────── */}
      <section id="services" style={{ padding: "120px 96px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 64 }}
        >
          <p style={{ fontFamily: bodyFont, fontSize: 11, letterSpacing: 4, color: C.accent, textTransform: "uppercase", marginBottom: 16 }}>
            Nos Services
          </p>
          <h2 style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: 52, color: C.white, margin: 0, fontWeight: 300 }}>
            Quatre disciplines, une exigence
          </h2>
        </motion.div>

        {/* Tab buttons */}
        <div style={{ display: "flex", gap: 0, marginBottom: 56, borderBottom: `1px solid ${C.border}` }}>
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              style={{
                background: "none", border: "none",
                fontFamily: bodyFont, fontSize: 13, letterSpacing: 2, textTransform: "uppercase",
                color: activeTab === i ? C.accent : C.silver,
                padding: "16px 32px", cursor: "pointer",
                borderBottom: activeTab === i ? `2px solid ${C.accent}` : "2px solid transparent",
                marginBottom: -1, transition: "all 0.3s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}
          >
            <div>
              <h3 style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: 40, color: C.white, margin: "0 0 20px", fontWeight: 300 }}>
                {tabs[activeTab].title}
              </h3>
              <p style={{ fontFamily: bodyFont, fontSize: 16, color: C.silver, lineHeight: 1.75, margin: "0 0 24px" }}>
                {tabs[activeTab].body}
              </p>
              <p style={{ fontFamily: bodyFont, fontSize: 13, color: C.accent, lineHeight: 1.6, borderLeft: `2px solid ${C.accent}`, paddingLeft: 16 }}>
                {tabs[activeTab].detail}
              </p>
            </div>
            <div style={{
              background: C.card, border: `1px solid ${C.border}`,
              aspectRatio: "4/3",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: 18, color: C.silver, opacity: 0.4 }}>
                {tabs[activeTab].label}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────────── */}
      <section style={{
        background: C.card, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
        padding: "120px 96px",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 64, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}
        >
          <div>
            <p style={{ fontFamily: bodyFont, fontSize: 11, letterSpacing: 4, color: C.accent, textTransform: "uppercase", marginBottom: 16 }}>
              Témoignages
            </p>
            <h2 style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: 52, color: C.white, margin: 0, fontWeight: 300 }}>
              Ce que disent nos clients
            </h2>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {[prevTestimonial, nextTestimonial].map((fn, i) => (
              <button
                key={i}
                onClick={fn}
                style={{
                  width: 48, height: 48, background: "none",
                  border: `1px solid ${C.border}`, color: C.silver,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, transition: "all 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.accent; (e.currentTarget as HTMLButtonElement).style.color = C.accent }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.border; (e.currentTarget as HTMLButtonElement).style.color = C.silver }}
              >
                {i === 0 ? "←" : "→"}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait" custom={testimonialDir}>
          <motion.div
            key={activeTestimonial}
            custom={testimonialDir}
            initial={{ opacity: 0, x: testimonialDir * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: testimonialDir * -60 }}
            transition={{ duration: 0.5 }}
            style={{
              maxWidth: 760,
            }}
          >
            <p style={{
              fontFamily: headingFont, fontStyle: "italic",
              fontSize: 26, color: C.white, lineHeight: 1.65, margin: "0 0 32px",
              fontWeight: 300,
            }}>
              "{testimonials[activeTestimonial].text}"
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: C.accent, display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: bodyFont, fontWeight: 700, color: C.bg, fontSize: 14,
              }}>
                {testimonials[activeTestimonial].name[0]}
              </div>
              <div>
                <div style={{ fontFamily: bodyFont, fontWeight: 600, color: C.white, fontSize: 14 }}>
                  {testimonials[activeTestimonial].name}
                </div>
                <div style={{ fontFamily: bodyFont, fontSize: 12, color: C.silver, marginTop: 2 }}>
                  {testimonials[activeTestimonial].role}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div style={{ display: "flex", gap: 8, marginTop: 40 }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => { setTestimonialDir(i > activeTestimonial ? 1 : -1); setActiveTestimonial(i) }}
              style={{
                width: i === activeTestimonial ? 24 : 6, height: 6,
                background: i === activeTestimonial ? C.accent : C.border,
                border: "none", cursor: "pointer", padding: 0,
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────────────────── */}
      <section id="tarifs" style={{ padding: "120px 96px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 64, textAlign: "center" }}
        >
          <p style={{ fontFamily: bodyFont, fontSize: 11, letterSpacing: 4, color: C.accent, textTransform: "uppercase", marginBottom: 16 }}>
            Tarifs
          </p>
          <h2 style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: 52, color: C.white, margin: 0, fontWeight: 300 }}>
            Nos formules
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {pricingTiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              style={{
                background: tier.highlight ? C.card : C.bg,
                border: tier.highlight ? `1px solid ${C.accent}` : `1px solid ${C.border}`,
                padding: "48px 36px",
                transform: tier.highlight ? "scale(1.03)" : "scale(1)",
                position: "relative",
              }}
            >
              {tier.highlight && (
                <div style={{
                  position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  background: C.accent, color: C.bg, fontFamily: bodyFont, fontSize: 10,
                  letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, padding: "4px 16px",
                }}>
                  Le plus choisi
                </div>
              )}
              <p style={{ fontFamily: bodyFont, fontSize: 11, letterSpacing: 3, color: C.accent, textTransform: "uppercase", margin: "0 0 16px" }}>
                {tier.name}
              </p>
              <div style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: 48, color: C.white, margin: "0 0 4px" }}>
                {tier.price}
              </div>
              <p style={{ fontFamily: bodyFont, fontSize: 13, color: C.silver, margin: "0 0 32px" }}>{tier.duration}</p>
              <div style={{ width: 40, height: 1, background: C.accent, marginBottom: 32 }} />
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px", display: "flex", flexDirection: "column", gap: 12 }}>
                {tier.features.map(f => (
                  <li key={f} style={{ fontFamily: bodyFont, fontSize: 14, color: C.silver, display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: C.accent, flexShrink: 0 }}>—</span> {f}
                  </li>
                ))}
              </ul>
              <motion.a
                href="#booking"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "block", textAlign: "center", textDecoration: "none",
                  padding: "14px 0",
                  background: tier.highlight ? C.accent : "none",
                  border: tier.highlight ? "none" : `1px solid ${C.border}`,
                  color: tier.highlight ? C.bg : C.silver,
                  fontFamily: bodyFont, fontSize: 12, letterSpacing: 2, textTransform: "uppercase",
                  fontWeight: tier.highlight ? 700 : 400, cursor: "pointer",
                }}
              >
                {tier.price === "Sur devis" ? "Demander un devis" : "Réserver"}
              </motion.a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section style={{
        background: C.card, borderTop: `1px solid ${C.border}`,
        padding: "120px 96px",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 64 }}
        >
          <p style={{ fontFamily: bodyFont, fontSize: 11, letterSpacing: 4, color: C.accent, textTransform: "uppercase", marginBottom: 16 }}>
            Questions fréquentes
          </p>
          <h2 style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: 52, color: C.white, margin: 0, fontWeight: 300 }}>
            Tout ce que vous devez savoir
          </h2>
        </motion.div>

        <div style={{ maxWidth: 800, display: "flex", flexDirection: "column", gap: 0 }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{ borderBottom: `1px solid ${C.border}` }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%", background: "none", border: "none",
                  padding: "28px 0", display: "flex", justifyContent: "space-between", alignItems: "center",
                  cursor: "pointer", textAlign: "left",
                }}
              >
                <span style={{ fontFamily: bodyFont, fontSize: 16, color: C.white, fontWeight: 400, paddingRight: 24 }}>
                  {faq.q}
                </span>
                <motion.span
                  animate={{ rotate: openFaq === i ? 45 : 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ color: C.accent, fontSize: 22, flexShrink: 0, lineHeight: 1 }}
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
                    transition={{ duration: 0.35 }}
                    style={{ overflow: "hidden" }}
                  >
                    <p style={{
                      fontFamily: bodyFont, fontSize: 15, color: C.silver,
                      lineHeight: 1.75, paddingBottom: 28, margin: 0,
                    }}>
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────────────────── */}
      <section id="booking" style={{
        padding: "120px 96px",
        background: C.bg,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          background: `radial-gradient(ellipse at 30% 50%, ${C.accent} 0%, transparent 60%)`,
          pointerEvents: "none",
        }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", position: "relative", zIndex: 1 }}
        >
          <p style={{ fontFamily: bodyFont, fontSize: 11, letterSpacing: 4, color: C.accent, textTransform: "uppercase", marginBottom: 24 }}>
            Passez à l'étape suivante
          </p>
          <h2 style={{
            fontFamily: headingFont, fontStyle: "italic", fontSize: "clamp(40px, 5vw, 72px)",
            color: C.white, margin: "0 auto 24px", fontWeight: 300, maxWidth: 700, lineHeight: 1.15,
          }}>
            Votre vision mérite d'être photographiée avec soin
          </h2>
          <p style={{ fontFamily: bodyFont, fontSize: 16, color: C.silver, maxWidth: 500, margin: "0 auto 48px", lineHeight: 1.7 }}>
            Entretien découverte offert. Réponse sous 24h. Studio au 14 rue de la Roquette, Paris 11e.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <motion.a
              href="mailto:contact@obscura-studio.fr"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                fontFamily: bodyFont, fontSize: 12, letterSpacing: 2, textTransform: "uppercase",
                background: C.accent, color: C.bg, padding: "18px 48px",
                textDecoration: "none", cursor: "pointer", fontWeight: 700,
              }}
            >
              Réserver une Séance
            </motion.a>
            <motion.a
              href="tel:+33142001122"
              whileHover={{ borderColor: C.accent, color: C.accent }}
              style={{
                fontFamily: bodyFont, fontSize: 12, letterSpacing: 2, textTransform: "uppercase",
                border: `1px solid ${C.border}`, color: C.silver, padding: "18px 48px",
                textDecoration: "none", cursor: "pointer", transition: "all 0.3s",
              }}
            >
              +33 1 42 00 11 22
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer style={{
        background: C.card, borderTop: `1px solid ${C.border}`,
        padding: "64px 96px 40px",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 56 }}>
          <div>
            <span style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: 28, color: C.accent }}>OBSCURA</span>
            <p style={{ fontFamily: bodyFont, fontSize: 14, color: C.silver, lineHeight: 1.7, marginTop: 16, maxWidth: 280 }}>
              Studio et laboratoire photographique au cœur de Paris. Argentique & numérique depuis 2008.
            </p>
            <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
              {/* Camera */}
              <a href="#" style={{ color: C.silver, transition: "color 0.2s", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
                onMouseLeave={e => (e.currentTarget.style.color = C.silver)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              {/* Behance / Portfolio */}
              <a href="#" style={{ color: C.silver, transition: "color 0.2s", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
                onMouseLeave={e => (e.currentTarget.style.color = C.silver)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.17 11.4c.44-.24.75-.52.95-.84.2-.32.3-.7.3-1.16 0-.46-.1-.87-.3-1.22-.2-.35-.48-.64-.84-.87-.36-.23-.79-.4-1.28-.5-.5-.1-1.02-.15-1.57-.15H2v9.68h4.62c.58 0 1.12-.06 1.63-.18.5-.12.95-.32 1.32-.58.37-.26.66-.59.87-.99.21-.4.32-.88.32-1.43 0-.63-.16-1.17-.48-1.61-.32-.44-.76-.76-1.31-.95h.2zm-4.74-3.3h2.1c.21 0 .41.02.6.06.2.04.37.1.52.19.15.09.27.22.36.38.09.16.13.37.13.62 0 .48-.14.83-.42 1.04-.28.21-.65.32-1.12.32H4.43V8.1zm3.5 6.04c-.1.17-.24.31-.41.41-.17.1-.36.17-.58.21-.22.04-.44.06-.67.06H4.43V12h1.98c.5 0 .91.11 1.22.33.31.22.47.58.47 1.09 0 .28-.05.5-.15.72h-.02zM20.38 8.28H15.6v1.48h4.78V8.28zM15.4 14.5c.15.32.36.58.63.77.27.19.59.32.95.4.36.08.74.12 1.14.12.38 0 .76-.04 1.12-.13.36-.09.68-.22.97-.41.29-.19.53-.44.71-.75.18-.31.27-.69.27-1.13h-1.9c0 .34-.11.6-.33.77-.22.17-.49.26-.82.26-.35 0-.63-.07-.85-.2-.22-.13-.39-.3-.5-.5-.11-.2-.18-.43-.2-.67-.02-.24-.03-.47-.03-.7h4.72c.01-.1.02-.22.02-.34v-.34c0-.47-.08-.9-.23-1.3-.15-.4-.37-.75-.66-1.04-.29-.29-.64-.52-1.04-.68-.4-.16-.86-.24-1.37-.24-.5 0-.96.08-1.37.24-.41.16-.77.39-1.07.69-.3.3-.53.66-.69 1.08-.16.42-.24.88-.24 1.39 0 .53.07 1.01.22 1.43l.03.07h.01zM17.1 11.1c.2-.18.46-.27.8-.27.2 0 .38.04.53.11.15.07.27.17.37.28.1.11.18.24.23.38.05.14.08.28.09.43h-2.86c.06-.37.21-.68.41-.93h.43z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#" style={{ color: C.silver, transition: "color 0.2s", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
                onMouseLeave={e => (e.currentTarget.style.color = C.silver)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {[
            { title: "Studio", links: ["À propos", "Notre équipe", "Galerie", "Presse"] },
            { title: "Services", links: ["Portraits", "Architecture", "Mariage", "Laboratoire"] },
            { title: "Informations", links: ["Tarifs", "FAQ", "Contact", "Mentions légales"] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontFamily: bodyFont, fontSize: 11, letterSpacing: 3, color: C.accent, textTransform: "uppercase", margin: "0 0 20px" }}>
                {col.title}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" style={{
                      fontFamily: bodyFont, fontSize: 14, color: C.silver, textDecoration: "none",
                      transition: "color 0.2s", cursor: "pointer",
                    }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.white)}
                      onMouseLeave={e => (e.currentTarget.style.color = C.silver)}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{
          borderTop: `1px solid ${C.border}`, paddingTop: 32,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <p style={{ fontFamily: bodyFont, fontSize: 12, color: C.silver, margin: 0 }}>
            © 2024 Obscura Studio. 14 rue de la Roquette, 75011 Paris.
          </p>
          <p style={{ fontFamily: bodyFont, fontSize: 12, color: C.silver, margin: 0 }}>
            Tous droits réservés — SIRET 842 610 733 00021
          </p>
        </div>
      </footer>
    </div>
  )
}
