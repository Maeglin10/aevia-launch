"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import React, { useState, useRef } from "react"
import Link from "next/link"

const C = {
  bg: "#0a0514",
  accent: "#8b5cf6",
  mid: "#6d28d9",
  card: "#110e1f",
  text: "#f0eaff",
  muted: "#7c6fa0",
  border: "#1e1535",
  glow: "rgba(139, 92, 246, 0.18)",
}

const mono: React.CSSProperties = {
  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
}

const sans: React.CSSProperties = {
  fontFamily: "system-ui, -apple-system, sans-serif",
}

// ─── Stat counter ────────────────────────────────────────────────────────────
function StatCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  return (
    <div ref={ref} style={{ textAlign: "center", padding: "0 20px" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{
          ...sans,
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 800,
          color: C.accent,
          lineHeight: 1,
          marginBottom: 10,
        }}
      >
        {value}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.25 }}
        style={{ ...mono, fontSize: "0.72rem", color: C.muted, letterSpacing: "0.06em" }}
      >
        {label}
      </motion.div>
    </div>
  )
}

// ─── FAQ Item ────────────────────────────────────────────────────────────────
function FaqItem({ q, a, isOpen, onClick }: { q: string; a: string; isOpen: boolean; onClick: () => void }) {
  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <button
        onClick={onClick}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          padding: "20px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          gap: 16,
          textAlign: "left",
        }}
      >
        <span style={{ ...sans, fontSize: "1rem", fontWeight: 600, color: isOpen ? C.accent : C.text, transition: "color 0.3s" }}>
          {q}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ ...mono, color: C.accent, fontSize: "1.2rem", flexShrink: 0, lineHeight: 1 }}
        >
          +
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="ans"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <p style={{ ...sans, color: C.muted, fontSize: "0.92rem", lineHeight: 1.8, paddingBottom: 20, margin: 0 }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Wireframe grid SVG ──────────────────────────────────────────────────────
function WireframeGrid() {
  const lines = []
  for (let i = 0; i <= 8; i++) {
    const x = (i / 8) * 100
    lines.push(<line key={`v${i}`} x1={`${x}%`} y1="0%" x2={`${x}%`} y2="100%" stroke="#8b5cf6" strokeWidth="0.4" strokeOpacity="0.4" />)
  }
  for (let i = 0; i <= 6; i++) {
    const y = (i / 6) * 100
    lines.push(<line key={`h${i}`} x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="#8b5cf6" strokeWidth="0.4" strokeOpacity="0.4" />)
  }
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      {lines}
      {/* Corner accents */}
      <polyline points="0,0 20,0 20,3" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeOpacity="0.8" />
      <polyline points="100%,0 calc(100% - 20px),0 calc(100% - 20px),3" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeOpacity="0.8" />
      <polyline points="0,100% 20,100% 20,calc(100% - 3px)" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeOpacity="0.8" />
    </svg>
  )
}

// ─── Data ────────────────────────────────────────────────────────────────────
const tabs = [
  {
    id: "archi",
    label: "Visualisation Archi",
    content: {
      headline: "Vendre avant de construire",
      body: "Nos rendus architecturaux HD transforment vos plans en expériences immersives. Chaque image intègre la lumière naturelle, les matériaux exacts et l'ambiance atmosphérique propre à chaque projet. Nos clients promoteurs constatent en moyenne 35% d'augmentation des ventes en VEFA grâce à des présentations qui font ressentir l'espace avant même que les fondations soient posées.",
      specs: ["Résolution jusqu'à 8K", "Éclairage HDRI physiquement exact", "Intégration maquette 3D & plans", "Format REVIT / ArchiCAD / SketchUp"],
    },
  },
  {
    id: "ar",
    label: "Réalité Augmentée",
    content: {
      headline: "L'espace dans votre espace",
      body: "Nos applications AR iOS et Android permettent à vos clients de projeter un appartement, un meuble ou un bâtiment entier dans leur environnement réel — en temps réel, sans marqueur. Utilisées lors de salons immobiliers, lancements de produit ou showrooms digitaux, nos expériences AR réduisent le cycle de décision d'achat de 40% en moyenne.",
      specs: ["ARKit & ARCore natif", "WebAR compatible (sans app)", "Tracking de surface avancé", "Intégration CRM & analytics"],
    },
  },
  {
    id: "animation",
    label: "Animation 3D",
    content: {
      headline: "Le mouvement qui convainc",
      body: "Des fly-throughs architecturaux aux animations produit 360°, nos équipes maîtrisent Houdini, Cinema 4D et Blender pour produire des séquences cinématographiques à couper le souffle. Format broadcast, réseaux sociaux ou pitch deck — nous adaptons chaque livrable aux standards de votre diffusion.",
      specs: ["25fps / 60fps selon usage", "Rendu CPU & GPU hybride", "Sound design et musique inclus", "Livrés en MOV, MP4, ProRes"],
    },
  },
  {
    id: "produit",
    label: "Rendu Produit",
    content: {
      headline: "Votre produit sous son meilleur jour",
      body: "De la montre de luxe au mobilier d'exception, nos rendus produit remplacent les shootings photo coûteux et offrent une flexibilité infinie : changement de coloris, de matière, de contexte en quelques heures. Nos clients e-commerce constatent +22% de taux de conversion sur les fiches produit enrichies en 3D.",
      specs: ["Packshot & ambiance en un seul fichier", "Configurateur 3D interactif en option", "Livraison PNG 4K détouré", "Droits cession totale inclus"],
    },
  },
]

const testimonials = [
  {
    quote:
      "Vertex Studio a livré nos rendus d'un programme de 45 logements en 12 jours ouvrés. La qualité surpassait tout ce que nous avions produit en interne depuis 5 ans. Nos commerciaux ont vendu 28 appartements en avant-première sur la seule force des visuels.",
    name: "Aurélien Fabre",
    role: "Directeur de programmes, Nexity Promotion Régionale",
    tag: "Visualisation Architecture",
  },
  {
    quote:
      "L'application AR livrée par Vertex nous a permis de présenter notre nouvelle gamme de mobilier à Maison & Objet sans transporter un seul meuble. L'engagement sur notre stand a été multiplié par 3. ROI immédiat sur un investissement que j'aurais repoussé à tort.",
    name: "Sophie Leclercq",
    role: "Directrice Marketing, Ligne Roset",
    tag: "Réalité Augmentée",
  },
  {
    quote:
      "Travaillant sur des montres à 15 000€ pièce, la qualité du rendu 3D est non négociable. Vertex Studio a livré 120 visuels produit en 3 semaines — qualité parfaite, aucun aller-retour. Nous avons entièrement abandonné les shootings studio classiques pour notre e-commerce.",
    name: "Marc-Antoine Rieux",
    role: "Head of Digital, Maison Dubail Horlogerie",
    tag: "Rendu Produit 3D",
  },
]

const faqs = [
  {
    q: "Quels formats de fichiers source acceptez-vous ?",
    a: "Nous travaillons avec tous les formats standards du secteur : REVIT (.rvt), ArchiCAD (.pln), SketchUp (.skp), Rhino (.3dm), AutoCAD (.dwg/.dxf), et les formats universels FBX, OBJ, STEP, IGES. Pour les projets AR, nous acceptons également des scans 3D (Matterport, LIDAR iPhone/iPad). Si votre fichier n'est pas dans cette liste, contactez-nous — nous avons traité des formats propriétaires exotiques.",
  },
  {
    q: "Quel est le délai de livraison standard ?",
    a: "Un rendu statique standard (5 images HD) est livré en 5 à 8 jours ouvrés. Une animation 60 secondes nécessite 3 à 4 semaines. Un projet AR simple (sans configurateur) est livré en 4 à 6 semaines. Nous proposons un service express (+30% sur le tarif) pour les délais critiques — nos équipes travaillent en 3×8 pour les projets urgents. Chaque projet démarre par un brief de cadrage (1h) pour valider les délais ensemble.",
  },
  {
    q: "Combien de révisions sont incluses ?",
    a: "Tous nos forfaits incluent 3 cycles de révision complets. Un cycle de révision couvre : modifications de caméra, ajustements de lumière, changements de matériaux, corrections de proportion. Au-delà de 3 cycles, les révisions sont facturées 80€/heure. Notre expérience montre que 95% des projets sont validés en 2 cycles maximum grâce à notre processus de brief et moodboard en amont.",
  },
  {
    q: "Peut-on intégrer les visuels directement sur notre site web ?",
    a: "Oui, c'est même notre spécialité. Nous livrons des rendus optimisés pour le web (WebP, AVIF, compression intelligente), des visionneuses 3D embarquables (iframe ou SDK), et des expériences WebAR sans application à installer. Notre équipe peut également développer une page de présentation projet sur mesure, intégrée à votre CMS (WordPress, Webflow, Drupal, custom).",
  },
  {
    q: "Tous les droits nous sont-ils cédés ?",
    a: "Oui, intégralement. À la livraison finale et après règlement complet, l'ensemble des droits patrimoniaux sur les rendus, animations et applications sont cédés à titre exclusif, pour le monde entier, pour toute durée et tout support. Vous pouvez les utiliser à des fins commerciales, publicitaires, de communication institutionnelle sans restriction. Nous conservons uniquement le droit de porter le projet dans notre portfolio, sauf accord de confidentialité signé.",
  },
]

const pricing = [
  {
    name: "Rendu Statique",
    sub: "5 images HD livrées",
    price: "à partir de 800€",
    desc: "Idéal pour lancer une commercialisation, enrichir un dossier de presse ou valider un concept architectural.",
    features: [
      "5 vues caméra au choix",
      "Résolution 4K (3840×2160px)",
      "3 cycles de révision",
      "Livraison PNG + JPG",
      "Droits cession totale",
    ],
    highlighted: false,
  },
  {
    name: "Animation 360°",
    sub: "Visite virtuelle complète",
    price: "à partir de 3 500€",
    desc: "Fly-through cinématographique ou visite interactive — le format qui transforme vos présentations commerciales.",
    features: [
      "Jusqu'à 2 min de séquence",
      "Rendu 4K 25fps ou 60fps",
      "Sound design inclus",
      "Format web + broadcast",
      "3 cycles de révision",
      "Accès studio de correction couleur",
    ],
    highlighted: true,
  },
  {
    name: "Projet AR",
    sub: "Application iOS & Android",
    price: "à partir de 8 000€",
    desc: "Application de réalité augmentée sur mesure pour salons, showrooms ou e-commerce — livrée clé en main.",
    features: [
      "App iOS + Android native",
      "WebAR compatible (sans app)",
      "Analytics & tracking intégrés",
      "Jusqu'à 10 modèles 3D",
      "Support 12 mois inclus",
    ],
    highlighted: false,
  },
]

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function VertexStudioPage() {
  const { scrollY } = useScroll()
  const heroTextY = useTransform(scrollY, [0, 500], [0, -50])
  const viewportRotateX = useTransform(scrollY, [0, 400], [10, 0])

  const [activeTab, setActiveTab] = useState("archi")
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [direction, setDirection] = useState(1)
  const [hoveredService, setHoveredService] = useState<string | null>(null)

  const currentTab = tabs.find((t) => t.id === activeTab)!

  function nextTestimonial() {
    setDirection(1)
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
  }
  function prevTestimonial() {
    setDirection(-1)
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }
  function goTestimonial(i: number) {
    setDirection(i > activeTestimonial ? 1 : -1)
    setActiveTestimonial(i)
  }

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 48px",
          background: "rgba(10, 5, 20, 0.9)",
          backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: `linear-gradient(135deg, ${C.accent}, ${C.mid})`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <polygon points="7,1 13,4 13,10 7,13 1,10 1,4" stroke="white" strokeWidth="1.2" fill="none" />
              <polygon points="7,4 10,5.5 10,8.5 7,10 4,8.5 4,5.5" fill="white" opacity="0.6" />
            </svg>
          </div>
          <span style={{ ...sans, fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.01em" }}>Vertex Studio</span>
        </div>

        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["Services", "Réalisations", "Tarifs", "À propos"].map((l) => (
            <Link
              key={l}
              href="#"
              style={{ ...sans, color: C.muted, fontSize: "0.85rem", textDecoration: "none", cursor: "pointer", fontWeight: 500 }}
            >
              {l}
            </Link>
          ))}
        </div>

        <motion.a
          href="#"
          whileHover={{ scale: 1.04, boxShadow: `0 0 20px ${C.glow}` }}
          whileTap={{ scale: 0.97 }}
          style={{
            ...sans,
            background: `linear-gradient(135deg, ${C.accent}, ${C.mid})`,
            color: "#fff",
            padding: "10px 22px",
            fontSize: "0.83rem",
            fontWeight: 600,
            textDecoration: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Demander un devis
        </motion.a>
      </motion.nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          alignItems: "center",
          padding: "120px 48px 80px",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        {/* Left: Text */}
        <motion.div style={{ y: heroTextY }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ ...mono, fontSize: "0.72rem", color: C.accent, letterSpacing: "0.08em", marginBottom: 20 }}
          >
            // studio.3d.ar.visualisation
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              ...sans,
              fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              margin: "0 0 24px",
              letterSpacing: "-0.03em",
              background: `linear-gradient(135deg, ${C.text} 0%, ${C.accent} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Visualisez l'Avenir
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ ...sans, color: C.muted, fontSize: "1.05rem", lineHeight: 1.75, margin: "0 0 40px", maxWidth: 460 }}
          >
            Design 3D, réalité augmentée et visualisation architecturale de niveau international. Nous transformons vos plans en expériences qui vendent, convainquent et inspirent.
          </motion.p>

          {/* Metric badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ display: "flex", gap: 12, marginBottom: 36, flexWrap: "wrap" }}
          >
            {[["220+", "projets"], ["15 ans", "d'expertise"], ["98%", "renouvellement"]].map(([val, lbl]) => (
              <div
                key={val}
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: "10px 16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span style={{ ...sans, fontWeight: 800, fontSize: "1.1rem", color: C.accent }}>{val}</span>
                <span style={{ ...mono, fontSize: "0.65rem", color: C.muted }}>{lbl}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
          >
            <motion.a
              href="#"
              whileHover={{ scale: 1.03, boxShadow: `0 0 30px ${C.glow}` }}
              whileTap={{ scale: 0.97 }}
              style={{
                ...sans,
                background: `linear-gradient(135deg, ${C.accent}, ${C.mid})`,
                color: "#fff",
                padding: "14px 32px",
                fontSize: "0.9rem",
                fontWeight: 700,
                textDecoration: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Demander un Devis Gratuit
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ borderColor: C.accent }}
              style={{
                ...sans,
                background: "transparent",
                color: C.text,
                padding: "14px 28px",
                fontSize: "0.9rem",
                fontWeight: 600,
                textDecoration: "none",
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                cursor: "pointer",
                transition: "border-color 0.25s",
              }}
            >
              Voir nos réalisations →
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Right: 3D Viewport mock */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          <motion.div
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              overflow: "hidden",
              position: "relative",
              transformOrigin: "center top",
              rotateX: viewportRotateX,
              perspective: 600,
              boxShadow: `0 0 80px ${C.glow}, 0 0 0 1px ${C.border}`,
            }}
          >
            {/* Viewport top bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 16px",
                background: "rgba(139, 92, 246, 0.06)",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#febc2e" }} />
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840" }} />
              <span style={{ ...mono, fontSize: "0.68rem", color: C.muted, marginLeft: 8 }}>viewport_3d — Vertex Studio</span>
            </div>

            {/* Grid area */}
            <div style={{ position: "relative", height: 320, background: `linear-gradient(135deg, #0d0920 0%, #0a0514 100%)` }}>
              <WireframeGrid />

              {/* Central 3D shape */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 140,
                  height: 100,
                  border: `1.5px solid ${C.accent}`,
                  opacity: 0.8,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-32%, -68%) perspective(200px) rotateX(45deg) rotateZ(0deg)",
                  width: 140,
                  height: 100,
                  border: `1px solid ${C.accent}`,
                  opacity: 0.35,
                }}
              />
              {/* Connecting lines (pseudo isometric) */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                <line x1="50%" y1="32%" x2="39%" y2="16%" stroke={C.accent} strokeWidth="1" strokeOpacity="0.35" />
                <line x1="50%" y1="32%" x2="61%" y2="16%" stroke={C.accent} strokeWidth="1" strokeOpacity="0.35" />
                <line x1="39%" y1="68%" x2="28%" y2="52%" stroke={C.accent} strokeWidth="1" strokeOpacity="0.35" />
                <line x1="61%" y1="68%" x2="72%" y2="52%" stroke={C.accent} strokeWidth="1" strokeOpacity="0.35" />
              </svg>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  background: "rgba(139, 92, 246, 0.15)",
                  border: `1px solid ${C.accent}44`,
                  borderRadius: 6,
                  padding: "8px 12px",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div style={{ ...mono, fontSize: "0.6rem", color: C.accent }}>poly_count</div>
                <div style={{ ...sans, fontWeight: 800, fontSize: "0.85rem", color: C.text }}>2.4M</div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                style={{
                  position: "absolute",
                  bottom: 20,
                  left: 20,
                  background: "rgba(139, 92, 246, 0.15)",
                  border: `1px solid ${C.accent}44`,
                  borderRadius: 6,
                  padding: "8px 12px",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div style={{ ...mono, fontSize: "0.6rem", color: C.accent }}>render_time</div>
                <div style={{ ...sans, fontWeight: 800, fontSize: "0.85rem", color: C.text }}>4K / 3h</div>
              </motion.div>
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                style={{
                  position: "absolute",
                  bottom: 20,
                  right: 20,
                  background: `rgba(109, 40, 217, 0.2)`,
                  border: `1px solid ${C.mid}55`,
                  borderRadius: 6,
                  padding: "8px 12px",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div style={{ ...mono, fontSize: "0.6rem", color: "#a78bfa" }}>status</div>
                <div style={{ ...sans, fontWeight: 700, fontSize: "0.8rem", color: "#a78bfa" }}>rendering…</div>
              </motion.div>
            </div>

            {/* Bottom status bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 16px",
                background: "rgba(139, 92, 246, 0.04)",
                borderTop: `1px solid ${C.border}`,
              }}
            >
              <span style={{ ...mono, fontSize: "0.65rem", color: C.muted }}>Camera: HERO_01 · FOV 45°</span>
              <span style={{ ...mono, fontSize: "0.65rem", color: C.accent }}>● LIVE</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "72px 48px",
          background: C.card,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <StatCounter value="220+" label="projets livrés" />
          <StatCounter value="15 ans" label="d'expertise 3D" />
          <StatCounter value="98%" label="clients renouvelants" />
          <StatCounter value="35" label="secteurs servis" />
        </div>
      </section>

      {/* ── FEATURES / TABS ──────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 56 }}
          >
            <div style={{ ...mono, fontSize: "0.72rem", color: C.accent, letterSpacing: "0.06em", marginBottom: 14 }}>
              // nos.services
            </div>
            <h2 style={{ ...sans, fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
              Ce Que Nous Maîtrisons
            </h2>
          </motion.div>

          {/* Tabs with animated underline indicator */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center", gap: 0, marginBottom: 56, borderBottom: `1px solid ${C.border}` }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  position: "relative",
                  background: "none",
                  border: "none",
                  padding: "14px 28px",
                  ...sans,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: activeTab === tab.id ? C.accent : C.muted,
                  cursor: "pointer",
                  transition: "color 0.25s",
                  zIndex: 1,
                }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-underline"
                    style={{
                      position: "absolute",
                      bottom: -1,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: `linear-gradient(90deg, ${C.accent}, ${C.mid})`,
                      borderRadius: 1,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}
            >
              <div>
                <h3 style={{ ...sans, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 800, margin: "0 0 20px", letterSpacing: "-0.02em" }}>
                  {currentTab.content.headline}
                </h3>
                <p style={{ ...sans, color: C.muted, lineHeight: 1.8, fontSize: "0.95rem", margin: "0 0 32px" }}>
                  {currentTab.content.body}
                </p>
                <motion.a
                  href="#"
                  whileHover={{ x: 4 }}
                  style={{
                    ...sans,
                    color: C.accent,
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  Voir les réalisations →
                </motion.a>
              </div>

              {/* Specs cards with purple glow on hover */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {currentTab.content.specs.map((spec, i) => (
                  <motion.div
                    key={spec}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.07 }}
                    onHoverStart={() => setHoveredService(spec)}
                    onHoverEnd={() => setHoveredService(null)}
                    style={{
                      background: C.card,
                      border: `1px solid ${hoveredService === spec ? C.accent : C.border}`,
                      borderRadius: 10,
                      padding: "20px 16px",
                      cursor: "default",
                      transition: "border-color 0.25s",
                      boxShadow: hoveredService === spec ? `0 0 24px ${C.glow}` : "none",
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: `linear-gradient(135deg, ${C.accent}22, ${C.mid}22)`,
                        border: `1px solid ${C.accent}44`,
                        marginBottom: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <polyline points="2,6 5,9 10,3" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div style={{ ...mono, fontSize: "0.75rem", color: C.text, lineHeight: 1.5 }}>{spec}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "100px 48px",
          background: C.card,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 56 }}
          >
            <div style={{ ...mono, fontSize: "0.72rem", color: C.accent, letterSpacing: "0.06em", marginBottom: 14 }}>
              // client.testimonials
            </div>
            <h2 style={{ ...sans, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
              Ce Que Disent Nos Clients
            </h2>
          </motion.div>

          <div style={{ position: "relative", minHeight: 300 }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeTestimonial}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                style={{
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: "44px 48px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Glow */}
                <div
                  style={{
                    position: "absolute",
                    top: -60,
                    left: -60,
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    background: C.glow,
                    filter: "blur(60px)",
                    pointerEvents: "none",
                  }}
                />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ ...mono, fontSize: "0.7rem", color: C.accent, marginBottom: 20 }}>
                    [{testimonials[activeTestimonial].tag}]
                  </div>
                  <p
                    style={{
                      ...sans,
                      fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)",
                      color: C.text,
                      lineHeight: 1.75,
                      margin: "0 0 28px",
                      fontWeight: 400,
                    }}
                  >
                    "{testimonials[activeTestimonial].quote}"
                  </p>
                  <div style={{ ...sans, fontWeight: 700, fontSize: "0.9rem", color: C.accent, marginBottom: 4 }}>
                    {testimonials[activeTestimonial].name}
                  </div>
                  <div style={{ ...sans, fontSize: "0.8rem", color: C.muted }}>
                    {testimonials[activeTestimonial].role}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginTop: 32 }}>
            <button
              onClick={prevTestimonial}
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                color: C.muted,
                width: 40,
                height: 40,
                borderRadius: 8,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
              }}
            >
              ←
            </button>
            <div style={{ display: "flex", gap: 8 }}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTestimonial(i)}
                  style={{
                    width: i === activeTestimonial ? 24 : 6,
                    height: 6,
                    borderRadius: 3,
                    background: i === activeTestimonial ? C.accent : C.border,
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "all 0.3s",
                  }}
                />
              ))}
            </div>
            <button
              onClick={nextTestimonial}
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                color: C.muted,
                width: 40,
                height: 40,
                borderRadius: 8,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
              }}
            >
              →
            </button>
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 64 }}
          >
            <div style={{ ...mono, fontSize: "0.72rem", color: C.accent, letterSpacing: "0.06em", marginBottom: 14 }}>
              // pricing.transparent
            </div>
            <h2 style={{ ...sans, fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, margin: "0 0 14px", letterSpacing: "-0.02em" }}>
              Nos Forfaits
            </h2>
            <p style={{ ...sans, color: C.muted, fontSize: "0.95rem", maxWidth: 480, margin: "0 auto" }}>
              Tarifs transparents, sans surprises. Chaque devis inclut un brief gratuit de cadrage. TVA en sus.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {pricing.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: tier.highlighted ? `linear-gradient(135deg, ${C.accent}18, ${C.mid}10)` : C.card,
                  border: `1px solid ${tier.highlighted ? C.accent : C.border}`,
                  borderRadius: 14,
                  padding: "36px 30px",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: tier.highlighted ? `0 0 60px ${C.glow}` : "none",
                }}
              >
                {tier.highlighted && (
                  <div
                    style={{
                      position: "absolute",
                      top: -14,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: `linear-gradient(135deg, ${C.accent}, ${C.mid})`,
                      color: "#fff",
                      padding: "4px 18px",
                      borderRadius: 999,
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      fontFamily: "system-ui, sans-serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Le Plus Demandé
                  </div>
                )}

                <div style={{ ...mono, fontSize: "0.7rem", color: C.accent, marginBottom: 8 }}>
                  {tier.sub}
                </div>
                <div style={{ ...sans, fontSize: "1.2rem", fontWeight: 800, color: C.text, marginBottom: 4 }}>
                  {tier.name}
                </div>
                <div style={{ ...sans, fontSize: "2rem", fontWeight: 800, color: C.accent, marginBottom: 16, letterSpacing: "-0.02em" }}>
                  {tier.price}
                </div>
                <p style={{ ...sans, fontSize: "0.85rem", color: C.muted, lineHeight: 1.65, margin: "0 0 24px", flexGrow: 1 }}>
                  {tier.desc}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px" }}>
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      style={{
                        ...sans,
                        fontSize: "0.83rem",
                        color: C.muted,
                        padding: "8px 0",
                        borderBottom: `1px solid ${C.border}`,
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                        <circle cx="7" cy="7" r="6" stroke={C.accent} strokeWidth="1" />
                        <polyline points="4,7 6.5,9.5 10,4.5" stroke={C.accent} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.02, boxShadow: tier.highlighted ? `0 0 20px ${C.glow}` : "none" }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "13px 0",
                    background: tier.highlighted ? `linear-gradient(135deg, ${C.accent}, ${C.mid})` : "transparent",
                    border: `1px solid ${tier.highlighted ? "transparent" : C.border}`,
                    color: tier.highlighted ? "#fff" : C.text,
                    fontSize: "0.83rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  Demander un devis
                </motion.a>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ ...mono, fontSize: "0.72rem", color: C.muted, textAlign: "center", marginTop: 28 }}
          >
            // Tous les projets débutent par un brief gratuit de 60 min. Devis sous 48h ouvrées.
          </motion.p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "100px 48px",
          background: C.card,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 56 }}
          >
            <div style={{ ...mono, fontSize: "0.72rem", color: C.accent, letterSpacing: "0.06em", marginBottom: 14 }}>
              // faq.common_questions
            </div>
            <h2 style={{ ...sans, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
              Questions Fréquentes
            </h2>
          </motion.div>
          <div>
            {faqs.map((faq, i) => (
              <FaqItem
                key={i}
                q={faq.q}
                a={faq.a}
                isOpen={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "120px 48px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(135deg, #0f0820 0%, ${C.bg} 100%)`,
        }}
      >
        {/* Purple glow bg */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${C.accent}22 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        {/* Grid pattern */}
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.06, pointerEvents: "none" }}
        >
          {Array.from({ length: 16 }).map((_, i) => (
            <line key={`cv${i}`} x1={`${(i / 15) * 100}%`} y1="0%" x2={`${(i / 15) * 100}%`} y2="100%" stroke={C.accent} strokeWidth="0.5" />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`ch${i}`} x1="0%" y1={`${(i / 7) * 100}%`} x2="100%" y2={`${(i / 7) * 100}%`} stroke={C.accent} strokeWidth="0.5" />
          ))}
        </svg>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <div style={{ ...mono, fontSize: "0.72rem", color: C.accent, letterSpacing: "0.08em", marginBottom: 20 }}>
            // ready.to.visualize
          </div>
          <h2
            style={{
              ...sans,
              fontSize: "clamp(2.5rem, 5vw, 4.2rem)",
              fontWeight: 800,
              margin: "0 0 20px",
              letterSpacing: "-0.03em",
              background: `linear-gradient(135deg, ${C.text} 0%, ${C.accent} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Demander un Devis Gratuit
          </h2>
          <p style={{ ...sans, color: C.muted, fontSize: "1.05rem", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 48px" }}>
            Brief de cadrage gratuit de 60 minutes. Devis précis sous 48h ouvrées. Aucun engagement. Nous avons livré des projets pour Nexity, Ligne Roset, BNP Paribas Real Estate et plus de 200 entreprises dans 35 secteurs.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a
              href="#"
              whileHover={{ scale: 1.04, boxShadow: `0 0 40px ${C.glow}` }}
              whileTap={{ scale: 0.97 }}
              style={{
                ...sans,
                background: `linear-gradient(135deg, ${C.accent}, ${C.mid})`,
                color: "#fff",
                padding: "16px 40px",
                fontSize: "0.95rem",
                fontWeight: 700,
                textDecoration: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Démarrer un projet →
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ borderColor: C.accent }}
              style={{
                ...sans,
                background: "transparent",
                color: C.text,
                padding: "16px 36px",
                fontSize: "0.95rem",
                fontWeight: 600,
                textDecoration: "none",
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                cursor: "pointer",
                transition: "border-color 0.25s",
              }}
            >
              Voir le portfolio
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer style={{ background: C.bg, borderTop: `1px solid ${C.border}`, padding: "60px 48px 36px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${C.accent}, ${C.mid})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                    <polygon points="7,1 13,4 13,10 7,13 1,10 1,4" stroke="white" strokeWidth="1.2" fill="none" />
                    <polygon points="7,4 10,5.5 10,8.5 7,10 4,8.5 4,5.5" fill="white" opacity="0.6" />
                  </svg>
                </div>
                <span style={{ ...sans, fontWeight: 800, fontSize: "1.05rem" }}>Vertex Studio</span>
              </div>
              <p style={{ ...sans, color: C.muted, fontSize: "0.83rem", lineHeight: 1.7, maxWidth: 270 }}>
                Studio de design 3D, réalité augmentée et visualisation architecturale. 220+ projets livrés, 35 secteurs d'activité.
              </p>
              <div style={{ display: "flex", gap: 14, marginTop: 24 }}>
                {/* LinkedIn */}
                <a href="#" style={{ color: C.muted, cursor: "pointer" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="4" />
                    <line x1="8" y1="11" x2="8" y2="17" />
                    <line x1="8" y1="7" x2="8" y2="8" />
                    <path d="M12 17v-6M16 17v-3a2 2 0 0 0-4 0" />
                  </svg>
                </a>
                {/* Behance */}
                <a href="#" style={{ color: C.muted, cursor: "pointer" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12h5M8 9h4a1.5 1.5 0 010 3M8 12h4.5a1.5 1.5 0 010 3H8" />
                  </svg>
                </a>
                {/* Camera */}
                <a href="#" style={{ color: C.muted, cursor: "pointer" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Services */}
            <div>
              <div style={{ ...mono, fontSize: "0.68rem", color: C.accent, letterSpacing: "0.06em", marginBottom: 20 }}>services</div>
              {["Visualisation Archi", "Réalité Augmentée", "Animation 3D", "Rendu Produit"].map((l) => (
                <a key={l} href="#" style={{ ...sans, display: "block", color: C.muted, fontSize: "0.83rem", marginBottom: 10, textDecoration: "none", cursor: "pointer" }}>{l}</a>
              ))}
            </div>

            {/* Studio */}
            <div>
              <div style={{ ...mono, fontSize: "0.68rem", color: C.accent, letterSpacing: "0.06em", marginBottom: 20 }}>studio</div>
              {["Portfolio", "Notre équipe", "Processus", "Presse"].map((l) => (
                <a key={l} href="#" style={{ ...sans, display: "block", color: C.muted, fontSize: "0.83rem", marginBottom: 10, textDecoration: "none", cursor: "pointer" }}>{l}</a>
              ))}
            </div>

            {/* Contact */}
            <div>
              <div style={{ ...mono, fontSize: "0.68rem", color: C.accent, letterSpacing: "0.06em", marginBottom: 20 }}>contact</div>
              <p style={{ ...sans, fontSize: "0.83rem", color: C.muted, lineHeight: 1.65, margin: "0 0 12px" }}>
                contact@vertex-studio.fr
              </p>
              <p style={{ ...sans, fontSize: "0.83rem", color: C.muted, lineHeight: 1.65, margin: "0 0 12px" }}>
                +33 1 84 60 42 18
              </p>
              <p style={{ ...sans, fontSize: "0.83rem", color: C.muted, lineHeight: 1.65, margin: 0 }}>
                10 Rue de la Paix, 75002 Paris
              </p>
            </div>
          </div>

          <div
            style={{
              borderTop: `1px solid ${C.border}`,
              paddingTop: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <span style={{ ...mono, color: C.muted, fontSize: "0.72rem" }}>
              © 2026 Vertex Studio SAS. Tous droits réservés.
            </span>
            <div style={{ display: "flex", gap: 24 }}>
              {["Mentions légales", "CGV", "Confidentialité"].map((l) => (
                <a key={l} href="#" style={{ ...sans, color: C.muted, fontSize: "0.75rem", textDecoration: "none", cursor: "pointer" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
