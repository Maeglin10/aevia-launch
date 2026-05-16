"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"

const C = {
  bg: "#fafafa",
  charcoal: "#1a1a1a",
  grey: "#6b7280",
  lightGrey: "#e5e7eb",
  accent: "#c45c3a",
  white: "#ffffff",
  card: "#f3f4f6",
}

const headingFont = '"Cormorant Garamond", serif'
const bodyFont = "system-ui, sans-serif"

// ─── Blueprint Grid Background ─────────────────────────────────────────────────
function BlueprintGrid() {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.04 }}>
        <defs>
          <pattern id="blueprint-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={C.charcoal} strokeWidth="0.5" />
          </pattern>
          <pattern id="blueprint-grid-large" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            <rect width="200" height="200" fill="url(#blueprint-grid)" />
            <path d="M 200 0 L 0 0 0 200" fill="none" stroke={C.charcoal} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#blueprint-grid-large)" />
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
    <span ref={ref}>{prefix}{count.toLocaleString("fr-FR")}{suffix}</span>
  )
}

// ─── Project Row ──────────────────────────────────────────────────────────────
function ProjectRow({ name, location, year, delay }: { name: string; location: string; year: string; delay: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "20px 0 20px 24px",
        borderBottom: `1px solid ${C.lightGrey}`,
        borderLeft: `3px solid ${hovered ? C.accent : "transparent"}`,
        transition: "border-color 0.3s, padding-left 0.3s",
        cursor: "pointer",
        paddingLeft: hovered ? 28 : 24,
      }}
    >
      <div style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: 20, color: C.charcoal, fontWeight: 400 }}>
        {name}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
        <span style={{ fontFamily: bodyFont, fontSize: 12, color: C.grey }}>{location}</span>
        <span style={{ fontFamily: bodyFont, fontSize: 12, color: C.accent }}>{year}</span>
      </div>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function KeopsCabinet() {
  const { scrollY } = useScroll()
  const heroTextY = useTransform(scrollY, [0, 600], [0, -60])
  const listY = useTransform(scrollY, [0, 600], [0, -30])

  const [activeTab, setActiveTab] = useState(0)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [testimonialDir, setTestimonialDir] = useState(1)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const tabs = [
    {
      label: "Logement",
      title: "Habiter avec intention",
      body: "De la villa individuelle à la résidence collective, nous concevons des espaces résidentiels où chaque décision architecturale sert la qualité de vie. Lumière naturelle, rapport à l'extérieur, circulation intérieure, matériaux durables : notre approche est globale et centrée sur l'habitant.",
      detail: "Permis de construire, suivi de chantier, réception des travaux. Honoraires : 8 à 12% du coût des travaux HT.",
      tags: ["Villa", "Résidence", "Rénovation", "Extension"],
    },
    {
      label: "Tertiaire & Commercial",
      title: "L'espace de travail repensé",
      body: "Bureaux, commerces, hôtels, restaurants — l'architecture tertiaire est un levier stratégique pour l'attractivité et la performance. Nous concevons des espaces qui reflètent l'identité de marque tout en optimisant les flux, l'acoustique et le bien-être des équipes.",
      detail: "De l'esquisse à la livraison. Coordination MOE. Mise en conformité ERP. Mission complète ou partielle.",
      tags: ["Bureaux", "Commerce", "Hôtellerie", "Restauration"],
    },
    {
      label: "Réhabilitation",
      title: "Révéler le patrimoine",
      body: "La réhabilitation est notre domaine de prédilection. Transformer un bâtiment existant sans en trahir l'âme, améliorer ses performances thermiques sans effacer son histoire, réinterpréter un espace pour de nouveaux usages — c'est là que notre sensibilité s'exprime pleinement.",
      detail: "Diagnostic technique et patrimonial inclus. Travaux BIMBY, surélévation, changement de destination.",
      tags: ["Bâtiment classé", "Patrimoine", "Surélévation", "Changement d'usage"],
    },
    {
      label: "Urbanisme",
      title: "La ville à l'échelle humaine",
      body: "Notre département urbanisme accompagne collectivités, aménageurs et promoteurs dans la conception de quartiers, de ZAC et d'espaces publics. Nous sommes convaincus que la ville doit être pensée à l'échelle de ses habitants, et non l'inverse.",
      detail: "PLU, études préalables, concours publics, maîtrise d'œuvre urbaine. Équipe pluridisciplinaire interne.",
      tags: ["ZAC", "Espace public", "Concours", "PLU"],
    },
  ]

  const testimonials = [
    {
      name: "Édouard Lemaire",
      role: "Directeur général, Groupe Lemaire Immobilier",
      text: "Kéops a livré notre résidence Les Acacias à Bordeaux avec une rigueur et une inventivité que je n'avais pas rencontrées depuis longtemps. Chaque logement est distinct, chaque espace commun est pensé. Les délais ont été tenus, le budget respecté. Nous leur avons confié deux programmes supplémentaires.",
    },
    {
      name: "Nathalie Orcel",
      role: "Propriétaire, rénovation maison de maître — Lyon",
      text: "J'avais une maison de maître des années 1890 que je voulais rénover sans la dénaturer. Kéops a compris immédiatement ce que je cherchais — ce dialogue entre passé et présent. Le résultat est saisissant : la maison a retrouvé son élégance tout en étant parfaitement contemporaine dans ses usages.",
    },
    {
      name: "Serge Moatti",
      role: "Directeur des opérations, Châteauform'",
      text: "La conversion de notre domaine en centre de séminaires était un projet complexe : patrimoine classé, contraintes PMR, budget serré. Kéops a navigué avec une intelligence rare entre toutes ces contraintes. La livraison a été exemplaire et les retours de nos clients sont unanimement positifs.",
    },
    {
      name: "Florence Dupré",
      role: "Adjointe à l'urbanisme, Mairie de Villeurbanne",
      text: "Le cabinet Kéops a remporté notre concours pour la requalification du quartier Gratte-Ciel historique. Leur approche combine une compréhension fine du patrimoine moderniste et une vision prospective des usages. Leur équipe est accessible, réactive et d'une probité intellectuelle rare dans les marchés publics.",
    },
  ]

  const faqs = [
    {
      q: "Combien coûtent les honoraires d'architecte en pourcentage ?",
      a: "Les honoraires varient selon la complexité et la mission : de 8 à 12% du montant HT des travaux pour une maison individuelle neuve, de 10 à 15% pour une réhabilitation (plus complexe techniquement), et de 5 à 8% pour des projets tertiaires d'envergure. Pour les missions partielles (esquisse seule, suivi de chantier seul), nous établissons des forfaits adaptés. Un premier chiffrage indicatif est fourni lors de notre entretien initial.",
    },
    {
      q: "Quelle est la durée typique d'un projet de construction ?",
      a: "Un projet résidentiel neuf (villa) prend généralement 18 à 24 mois de la première esquisse à la livraison : 3 à 4 mois pour les études, 3 à 6 mois pour l'instruction du permis de construire, puis 12 à 16 mois de chantier. Un projet de réhabilitation peut être plus court (12 à 18 mois) si les fondations et la structure sont saines. Nous établissons un planning détaillé dès la phase ESQ.",
    },
    {
      q: "Est-ce que vous gérez le permis de construire ?",
      a: "Oui, le dépôt et le suivi du permis de construire font partie intégrante de nos missions standard (phase PC/DCE). Nous constituons le dossier complet, gérons les éventuelles demandes de pièces complémentaires des services instructeurs, et vous informons à chaque étape. Pour les projets en secteur protégé ou ABF, nous avons l'expérience des procédures spécifiques.",
    },
    {
      q: "Intervenez-vous sur des projets de rénovation énergétique ?",
      a: "C'est l'un de nos axes de développement prioritaires. Nous proposons une mission AMO Rénovation Énergétique complète : audit thermique, définition du programme de travaux, sélection des entreprises, coordination des interventions (isolation, menuiseries, CVC, ENR). Nous vous accompagnons également dans l'accès aux aides (MaPrimeRénov', CEE, prêt éco-PTZ) et la labellisation BBC Rénovation.",
    },
    {
      q: "L'architecte est-il obligatoire pour mon projet ?",
      a: "En France, le recours à un architecte est obligatoire pour tout projet dont la surface de plancher créée dépasse 150 m² (pour une construction neuve) ou dont les travaux portent la surface totale au-delà de 150 m². Pour les particuliers en dessous de ce seuil, le recours est facultatif mais vivement recommandé : un architecte optimise la conception, sécurise les démarches administratives et coordonne les entreprises pour vous.",
    },
    {
      q: "Travaillez-vous à l'international ?",
      a: "Oui. Nous intervenons régulièrement en Europe (Belgique, Suisse, Portugal, Maroc) et avons livré des projets sur 12 pays à ce jour. Notre équipe inclut des architectes maîtrisant l'anglais et l'espagnol. Pour les projets hors France, nous travaillons en association avec des cabinets locaux qui gèrent les procédures réglementaires spécifiques à chaque pays.",
    },
  ]

  const pricingTiers = [
    {
      name: "Esquisse Conseil",
      price: "600€",
      duration: "Session de 2 heures",
      features: [
        "Vision stratégique du projet",
        "Analyse faisabilité et contraintes",
        "Orientations architecturales",
        "Estimation budgétaire indicative",
        "Compte-rendu écrit sous 5 jours",
      ],
      highlight: false,
      cta: "Prendre rendez-vous",
    },
    {
      name: "Mission Complète",
      price: "% honoraires",
      duration: "De l'esquisse au suivi chantier",
      features: [
        "Esquisse, APS, APD, PRO",
        "Permis de construire",
        "Consultation des entreprises",
        "Direction des travaux (DET)",
        "Réception et levée des réserves",
        "Garantie de parfait achèvement",
      ],
      highlight: true,
      cta: "Discutons de votre projet",
    },
    {
      name: "AMO & Expertise",
      price: "Sur devis",
      duration: "Assistance Maîtrise d'Ouvrage",
      features: [
        "Audit technique et patrimonial",
        "Assistance concours et appels d'offres",
        "Expertises amiables et judiciaires",
        "Rénovation énergétique (DPE → B)",
        "Coordination OPC externe",
      ],
      highlight: false,
      cta: "Demander une expertise",
    },
  ]

  const recentProjects = [
    { name: "Résidence Les Acacias", location: "Bordeaux, France", year: "2024" },
    { name: "Hôtel Particulier Gambetta", location: "Lyon, France", year: "2023" },
    { name: "Siège Social Athos Capital", location: "Bruxelles, Belgique", year: "2023" },
    { name: "ZAC du Vieux-Port Nord", location: "Marseille, France", year: "2022" },
    { name: "Villa Azurra", location: "Lagos, Portugal", year: "2022" },
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
    <div style={{ background: C.bg, color: C.charcoal, fontFamily: bodyFont, minHeight: "100vh" }}>

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 56px", height: 72,
        background: "rgba(250,250,250,0.94)", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.lightGrey}`,
      }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: 26, color: C.charcoal, letterSpacing: 1 }}>
            Kéops
          </span>
          <span style={{ fontFamily: bodyFont, fontSize: 11, color: C.grey, letterSpacing: 3, textTransform: "uppercase" }}>
            Architecture
          </span>
        </Link>

        <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {["Agence", "Projets", "Services", "Réalisations", "Contact"].map(link => (
            <Link key={link} href={`#${link.toLowerCase()}`} style={{
              fontFamily: bodyFont, fontSize: 12, color: C.grey,
              textDecoration: "none", letterSpacing: 1.5, textTransform: "uppercase",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = C.charcoal)}
              onMouseLeave={e => (e.currentTarget.style.color = C.grey)}
            >
              {link}
            </Link>
          ))}
          <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              fontFamily: bodyFont, fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
              background: C.accent, color: C.white, padding: "10px 24px",
              textDecoration: "none", cursor: "pointer", fontWeight: 600,
            }}
          >
            Projet
          </button>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section style={{
        position: "relative", height: "100vh", minHeight: 700,
        display: "flex", alignItems: "center",
        overflow: "hidden", paddingTop: 72,
        borderBottom: `1px solid ${C.lightGrey}`,
      }}>
        {/* Left: Heading */}
        <div style={{ flex: "0 0 55%", paddingLeft: 96, paddingRight: 48, zIndex: 2 }}>
          <motion.div style={{ y: heroTextY }}>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ fontFamily: bodyFont, fontSize: 11, letterSpacing: 4, color: C.accent, textTransform: "uppercase", marginBottom: 32 }}
            >
              Cabinet fondé en 1996 — Paris & Lyon
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.35 }}
              style={{
                fontFamily: headingFont, fontStyle: "italic",
                fontSize: "clamp(64px, 7.5vw, 100px)", fontWeight: 300,
                lineHeight: 0.95, color: C.charcoal, margin: 0,
                letterSpacing: -1,
              }}
            >
              Architecture
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{
                fontFamily: headingFont, fontStyle: "italic",
                fontSize: "clamp(64px, 7.5vw, 100px)", fontWeight: 300,
                lineHeight: 0.95, color: C.charcoal, margin: "8px 0",
                letterSpacing: -1,
              }}
            >
              du
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.65 }}
              style={{
                fontFamily: headingFont, fontStyle: "italic",
                fontSize: "clamp(64px, 7.5vw, 100px)", fontWeight: 300,
                lineHeight: 0.95, color: C.charcoal, margin: 0,
                letterSpacing: -1,
              }}
            >
              Vivant
            </motion.h1>

            {/* Terracotta underline accent */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              style={{ height: 3, background: C.accent, marginTop: 24, marginBottom: 32 }}
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              style={{ fontFamily: bodyFont, fontSize: 16, color: C.grey, maxWidth: 400, lineHeight: 1.7, margin: "0 0 40px" }}
            >
              Logement, tertiaire, réhabilitation, urbanisme. 28 ans d'exercice. 340 projets livrés sur 12 pays.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              style={{ display: "flex", gap: 16 }}
            >
              <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  fontFamily: bodyFont, fontSize: 12, letterSpacing: 2, textTransform: "uppercase",
                  background: C.accent, color: C.white, padding: "14px 36px",
                  textDecoration: "none", cursor: "pointer", fontWeight: 600,
                }}
              >
                Discutons de votre projet
              </button>
              <button onClick={() => document.getElementById("projets")?.scrollIntoView({behavior:"smooth"})}
                whileHover={{ borderColor: C.accent, color: C.accent }}
                style={{
                  fontFamily: bodyFont, fontSize: 12, letterSpacing: 2, textTransform: "uppercase",
                  border: `1px solid ${C.lightGrey}`, color: C.grey, padding: "14px 36px",
                  textDecoration: "none", cursor: "pointer", transition: "all 0.3s",
                }}
              >
                Nos réalisations
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Right: Project list */}
        <motion.div
          style={{ flex: "0 0 45%", paddingRight: 80, y: listY, zIndex: 2 }}
        >
          <div style={{ borderTop: `1px solid ${C.lightGrey}` }}>
            {recentProjects.map((project, i) => (
              <ProjectRow
                key={project.name}
                name={project.name}
                location={project.location}
                year={project.year}
                delay={0.5 + i * 0.1}
              />
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{ fontFamily: bodyFont, fontSize: 11, color: C.grey, letterSpacing: 2, textTransform: "uppercase", marginTop: 16 }}
          >
            Sélection de projets récents
          </motion.p>
        </motion.div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────────────────── */}
      <section style={{
        padding: "80px 96px",
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        borderBottom: `1px solid ${C.lightGrey}`,
        background: C.white,
      }}>
        {[
          { label: "Ans d'exercice", value: 28, suffix: "" },
          { label: "Projets livrés", value: 340, suffix: "+" },
          { label: "Pays", value: 12, suffix: "" },
          { label: "Récompenses nationales", value: 6, suffix: "" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            style={{
              padding: "0 40px",
              borderRight: i < 3 ? `1px solid ${C.lightGrey}` : "none",
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: 64, color: C.accent, lineHeight: 1 }}>
              <Counter target={stat.value} suffix={stat.suffix} />
            </div>
            <div style={{ fontFamily: bodyFont, fontSize: 12, color: C.grey, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 8 }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </section>

      {/* ── FEATURES / TABS ────────────────────────────────────────────────── */}
      <section id="services" style={{ padding: "120px 96px", position: "relative" }}>
        <BlueprintGrid />
        <div style={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: 64 }}
          >
            <p style={{ fontFamily: bodyFont, fontSize: 11, letterSpacing: 4, color: C.accent, textTransform: "uppercase", marginBottom: 16 }}>
              Domaines d'expertise
            </p>
            <h2 style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: 52, color: C.charcoal, margin: 0, fontWeight: 300 }}>
              Quatre disciplines, une architecture
            </h2>
          </motion.div>

          {/* Tab buttons */}
          <div style={{ display: "flex", gap: 0, marginBottom: 56, borderBottom: `2px solid ${C.lightGrey}` }}>
            {tabs.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                style={{
                  background: "none", border: "none",
                  fontFamily: bodyFont, fontSize: 12, letterSpacing: 2, textTransform: "uppercase",
                  color: activeTab === i ? C.accent : C.grey,
                  padding: "16px 32px", cursor: "pointer",
                  borderBottom: activeTab === i ? `2px solid ${C.accent}` : "2px solid transparent",
                  marginBottom: -2, transition: "all 0.3s",
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
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}
            >
              <div>
                <h3 style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: 40, color: C.charcoal, margin: "0 0 20px", fontWeight: 300 }}>
                  {tabs[activeTab].title}
                </h3>
                <p style={{ fontFamily: bodyFont, fontSize: 16, color: C.grey, lineHeight: 1.8, margin: "0 0 24px" }}>
                  {tabs[activeTab].body}
                </p>
                <p style={{ fontFamily: bodyFont, fontSize: 13, color: C.accent, lineHeight: 1.6, borderLeft: `2px solid ${C.accent}`, paddingLeft: 16, margin: "0 0 32px" }}>
                  {tabs[activeTab].detail}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {tabs[activeTab].tags.map(tag => (
                    <span key={tag} style={{
                      fontFamily: bodyFont, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase",
                      color: C.grey, border: `1px solid ${C.lightGrey}`, padding: "6px 14px",
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div style={{
                  background: C.card, border: `1px solid ${C.lightGrey}`,
                  aspectRatio: "4/3",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", overflow: "hidden",
                }}>
                  <span style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: 22, color: C.grey, opacity: 0.4 }}>
                    {tabs[activeTab].label}
                  </span>
                  {/* Terracotta corner accent */}
                  <div style={{
                    position: "absolute", top: 0, left: 0,
                    width: 4, height: 64, background: C.accent,
                  }} />
                  <div style={{
                    position: "absolute", top: 0, left: 0,
                    width: 64, height: 4, background: C.accent,
                  }} />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────────── */}
      <section style={{
        background: C.charcoal,
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
              Ce qu'ils disent
            </p>
            <h2 style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: 52, color: C.white, margin: 0, fontWeight: 300 }}>
              Paroles de clients
            </h2>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {[prevTestimonial, nextTestimonial].map((fn, i) => (
              <button
                key={i}
                onClick={fn}
                style={{
                  width: 48, height: 48, background: "none",
                  border: `1px solid rgba(255,255,255,0.15)`, color: "rgba(255,255,255,0.5)",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, transition: "all 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.accent; (e.currentTarget as HTMLButtonElement).style.color = C.accent }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.15)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.5)" }}
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
            style={{ maxWidth: 760 }}
          >
            <p style={{
              fontFamily: headingFont, fontStyle: "italic",
              fontSize: 26, color: C.white, lineHeight: 1.65, margin: "0 0 36px",
              fontWeight: 300,
            }}>
              "{testimonials[activeTestimonial].text}"
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: C.accent, display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: bodyFont, fontWeight: 700, color: C.white, fontSize: 14,
              }}>
                {testimonials[activeTestimonial].name[0]}
              </div>
              <div>
                <div style={{ fontFamily: bodyFont, fontWeight: 600, color: C.white, fontSize: 14 }}>
                  {testimonials[activeTestimonial].name}
                </div>
                <div style={{ fontFamily: bodyFont, fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                  {testimonials[activeTestimonial].role}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div style={{ display: "flex", gap: 8, marginTop: 48 }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => { setTestimonialDir(i > activeTestimonial ? 1 : -1); setActiveTestimonial(i) }}
              style={{
                width: i === activeTestimonial ? 28 : 6, height: 6,
                background: i === activeTestimonial ? C.accent : "rgba(255,255,255,0.15)",
                border: "none", cursor: "pointer", padding: 0,
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────────────────── */}
      <section id="tarifs" style={{ padding: "120px 96px", background: C.bg }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 64 }}
        >
          <p style={{ fontFamily: bodyFont, fontSize: 11, letterSpacing: 4, color: C.accent, textTransform: "uppercase", marginBottom: 16 }}>
            Nos missions
          </p>
          <h2 style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: 52, color: C.charcoal, margin: 0, fontWeight: 300 }}>
            Trois niveaux d'intervention
          </h2>
          <p style={{ fontFamily: bodyFont, fontSize: 16, color: C.grey, marginTop: 16, maxWidth: 540, lineHeight: 1.7 }}>
            Nous adaptons notre mission à votre besoin : consultation stratégique, mission complète ou assistance à maîtrise d'ouvrage.
          </p>
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
                background: tier.highlight ? C.charcoal : C.white,
                border: tier.highlight ? `1px solid ${C.accent}` : `1px solid ${C.lightGrey}`,
                padding: "48px 36px",
                transform: tier.highlight ? "scale(1.03)" : "scale(1)",
                position: "relative",
              }}
            >
              {tier.highlight && (
                <div style={{
                  position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  background: C.accent, color: C.white, fontFamily: bodyFont, fontSize: 10,
                  letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, padding: "4px 16px",
                }}>
                  Notre mission phare
                </div>
              )}
              <p style={{ fontFamily: bodyFont, fontSize: 11, letterSpacing: 3, color: C.accent, textTransform: "uppercase", margin: "0 0 16px" }}>
                {tier.name}
              </p>
              <div style={{
                fontFamily: headingFont, fontStyle: "italic",
                fontSize: tier.price.length > 5 ? 32 : 48,
                color: tier.highlight ? C.white : C.charcoal,
                margin: "0 0 4px", lineHeight: 1.1,
              }}>
                {tier.price}
              </div>
              <p style={{ fontFamily: bodyFont, fontSize: 13, color: tier.highlight ? "rgba(255,255,255,0.45)" : C.grey, margin: "0 0 32px" }}>
                {tier.duration}
              </p>
              <div style={{ width: 40, height: 2, background: C.accent, marginBottom: 32 }} />
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px", display: "flex", flexDirection: "column", gap: 14 }}>
                {tier.features.map(f => (
                  <li key={f} style={{
                    fontFamily: bodyFont, fontSize: 14,
                    color: tier.highlight ? "rgba(255,255,255,0.7)" : C.grey,
                    display: "flex", gap: 10, alignItems: "flex-start",
                  }}>
                    <span style={{ color: C.accent, flexShrink: 0 }}>—</span> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "block", textAlign: "center", textDecoration: "none",
                  padding: "14px 0",
                  background: tier.highlight ? C.accent : "none",
                  border: tier.highlight ? "none" : `1px solid ${C.lightGrey}`,
                  color: tier.highlight ? C.white : C.grey,
                  fontFamily: bodyFont, fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
                  fontWeight: tier.highlight ? 600 : 400, cursor: "pointer",
                }}
              >
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section style={{
        background: C.white,
        borderTop: `1px solid ${C.lightGrey}`,
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
          <h2 style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: 52, color: C.charcoal, margin: 0, fontWeight: 300 }}>
            Ce que l'on nous demande
          </h2>
        </motion.div>

        <div style={{ maxWidth: 840, display: "flex", flexDirection: "column", gap: 0 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${C.lightGrey}` }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%", background: "none", border: "none",
                  padding: "28px 0", display: "flex", justifyContent: "space-between", alignItems: "center",
                  cursor: "pointer", textAlign: "left",
                }}
              >
                <span style={{ fontFamily: bodyFont, fontSize: 16, color: C.charcoal, fontWeight: 400, paddingRight: 24 }}>
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
                      fontFamily: bodyFont, fontSize: 15, color: C.grey,
                      lineHeight: 1.8, paddingBottom: 28, margin: 0,
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
      <section id="contact" style={{
        padding: "140px 96px",
        background: C.bg,
        position: "relative", overflow: "hidden",
        borderTop: `1px solid ${C.lightGrey}`,
      }}>
        {/* Decorative terracotta vertical line */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: 4, background: C.accent, opacity: 0.5,
        }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: 700 }}
        >
          <p style={{ fontFamily: bodyFont, fontSize: 11, letterSpacing: 4, color: C.accent, textTransform: "uppercase", marginBottom: 24 }}>
            Parlons de votre projet
          </p>
          <h2 style={{
            fontFamily: headingFont, fontStyle: "italic", fontSize: "clamp(40px, 5vw, 72px)",
            color: C.charcoal, margin: "0 0 24px", fontWeight: 300, lineHeight: 1.1,
          }}>
            Discutons de Votre Projet
          </h2>
          <p style={{ fontFamily: bodyFont, fontSize: 16, color: C.grey, maxWidth: 480, margin: "0 0 48px", lineHeight: 1.7 }}>
            Premier entretien sans engagement. Réponse sous 48h. Agences à Paris (11e) et Lyon (2e).
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <motion.a
              href="mailto:contact@keops-architecture.fr"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                fontFamily: bodyFont, fontSize: 12, letterSpacing: 2, textTransform: "uppercase",
                background: C.accent, color: C.white, padding: "18px 48px",
                textDecoration: "none", cursor: "pointer", fontWeight: 600,
              }}
            >
              Envoyer un message
            </button>
            <motion.a
              href="tel:+33145001234"
              whileHover={{ borderColor: C.accent, color: C.accent }}
              style={{
                fontFamily: bodyFont, fontSize: 12, letterSpacing: 2, textTransform: "uppercase",
                border: `1px solid ${C.lightGrey}`, color: C.grey, padding: "18px 48px",
                textDecoration: "none", cursor: "pointer", transition: "all 0.3s",
              }}
            >
              +33 1 45 00 12 34
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer style={{
        background: C.charcoal,
        padding: "80px 96px 48px",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 64 }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 20 }}>
              <span style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: 28, color: C.white }}>Kéops</span>
              <span style={{ fontFamily: bodyFont, fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 3, textTransform: "uppercase" }}>Architecture</span>
            </div>
            <p style={{ fontFamily: bodyFont, fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.75, maxWidth: 280, margin: "0 0 28px" }}>
              Cabinet d'architecture, d'urbanisme et de design intérieur fondé à Paris en 1996. 28 ans d'exercice, 340 projets livrés.
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              {/* LinkedIn */}
              <a href="#" style={{ color: "rgba(255,255,255,0.35)", transition: "color 0.2s", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              {/* Camera */}
              <a href="#" style={{ color: "rgba(255,255,255,0.35)", transition: "color 0.2s", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              {/* X / MessageSquare */}
              <a href="#" style={{ color: "rgba(255,255,255,0.35)", transition: "color 0.2s", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* Bookmark */}
              <a href="#" style={{ color: "rgba(255,255,255,0.35)", transition: "color 0.2s", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                </svg>
              </a>
            </div>
          </div>

          {[
            { title: "Le Cabinet", links: ["Notre histoire", "L'équipe", "Engagements", "Presse & Distinctions"] },
            { title: "Expertises", links: ["Logement", "Tertiaire", "Réhabilitation", "Urbanisme"] },
            { title: "Contact", links: ["Paris 11e", "Lyon 2e", "Consultation", "Mentions légales"] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontFamily: bodyFont, fontSize: 10, letterSpacing: 3, color: C.accent, textTransform: "uppercase", margin: "0 0 20px" }}>
                {col.title}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" style={{
                      fontFamily: bodyFont, fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none",
                      transition: "color 0.2s", cursor: "pointer",
                    }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.white)}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{
          borderTop: `1px solid rgba(255,255,255,0.08)`, paddingTop: 32,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <p style={{ fontFamily: bodyFont, fontSize: 12, color: "rgba(255,255,255,0.25)", margin: 0 }}>
            © 2024 Kéops Architecture & Urbanisme. Tous droits réservés.
          </p>
          <p style={{ fontFamily: bodyFont, fontSize: 12, color: "rgba(255,255,255,0.25)", margin: 0 }}>
            DPLG — SIRET 404 872 109 00038 — Inscrit à l'Ordre des Architectes d'Île-de-France
          </p>
        </div>
      </footer>
    </div>
  )
}
