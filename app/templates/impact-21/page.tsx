"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"
import Link from "next/link"

const C = {
  bg: "#fafafa",
  dark: "#1c1c1e",
  orange: "#f97316",
  grey: "#f4f4f5",
  muted: "#6b7280",
  border: "#e4e4e7",
  white: "#ffffff",
}

const FONT = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

// ─── Isometric product mockup ───────────────────────────────────────────────
function IsometricProduct() {
  return (
    <div
      style={{
        position: "relative",
        width: 280,
        height: 300,
        perspective: 1000,
        flexShrink: 0,
      }}
    >
      {/* Main body */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 40,
          width: 200,
          height: 130,
          background: C.dark,
          transform: "rotateX(20deg) rotateY(-25deg) rotateZ(0deg)",
          boxShadow: "24px 24px 0 rgba(249,115,22,0.25), 8px 8px 40px rgba(0,0,0,0.15)",
          borderRadius: 8,
        }}
      >
        {/* Screen */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            right: 12,
            bottom: 24,
            background: "#0f0f10",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          {/* Screen content lines */}
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: 6,
                background: i === 0 ? C.orange : "rgba(255,255,255,0.08)",
                width: i === 0 ? "60%" : `${50 + i * 10}%`,
                margin: `${12 + i * 16}px 12px 0`,
                borderRadius: 3,
              }}
            />
          ))}
        </div>
        {/* Home button */}
        <div
          style={{
            position: "absolute",
            bottom: 6,
            left: "50%",
            transform: "translateX(-50%)",
            width: 14,
            height: 14,
            border: "1.5px solid rgba(255,255,255,0.2)",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* Side panel */}
      <div
        style={{
          position: "absolute",
          top: 94,
          left: 212,
          width: 24,
          height: 130,
          background: "#141416",
          transform: "skewY(-20deg)",
          transformOrigin: "top left",
        }}
      />

      {/* Bottom panel */}
      <div
        style={{
          position: "absolute",
          top: 186,
          left: 40,
          width: 200,
          height: 24,
          background: "#2a2a2e",
          transform: "skewX(-25deg)",
          transformOrigin: "top left",
        }}
      />

      {/* Floating accent dot */}
      <motion.div
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: 40,
          right: 20,
          width: 12,
          height: 12,
          background: C.orange,
          borderRadius: "50%",
        }}
      />
      <motion.div
        animate={{ y: [4, -4, 4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          bottom: 60,
          right: 10,
          width: 8,
          height: 8,
          background: C.orange,
          opacity: 0.4,
          borderRadius: "50%",
        }}
      />

      {/* Small floating card */}
      <motion.div
        animate={{ y: [-6, 2, -6] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        style={{
          position: "absolute",
          top: 16,
          left: 10,
          background: C.white,
          borderRadius: 6,
          padding: "8px 12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ width: 8, height: 8, background: C.orange, borderRadius: "50%" }} />
        <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, color: C.dark, letterSpacing: "0.04em" }}>
          Red Dot Award
        </span>
      </motion.div>
    </div>
  )
}

// ─── Stat Counter ───────────────────────────────────────────────────────────
function StatCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <div ref={ref} style={{ textAlign: "center", flex: 1, minWidth: 140 }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          fontFamily: FONT,
          fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
          fontWeight: 900,
          color: C.dark,
          lineHeight: 1,
        }}
      >
        {value}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.25 }}
        style={{
          fontFamily: FONT,
          fontSize: 13,
          color: C.muted,
          marginTop: 8,
          fontWeight: 400,
        }}
      >
        {label}
      </motion.div>
    </div>
  )
}

// ─── Tabs data ──────────────────────────────────────────────────────────────
const tabs = [
  {
    label: "Design Produit",
    heading: "Du brief au brevet",
    body: "Nous transformons vos cahiers des charges en objets désirables. Research utilisateur, étude concurrentielle, sketching, CAO et rendus réalistes : chaque phase est documentée et validée avec vous. Notre équipe maîtrise les contraintes de production dès la conception — zéro surprise en phase industrielle.",
    points: ["Étude ergonomique complète", "Rendus photoréalistes 4K", "Fichiers CAO prêts pour outillage", "Rapport de faisabilité inclus"],
  },
  {
    label: "UX & Interface",
    heading: "L'expérience avant tout",
    body: "Un produit physique brillant mérite une interface à la hauteur. Nous concevons les écrans, panneaux de contrôle, applications mobiles et dashboards qui accompagnent vos produits connectés. Tests utilisateurs, prototypes interactifs Figma, guidelines design system livrés en fin de sprint.",
    points: ["Audit UX existing products", "Wireframes + prototypes Figma", "Tests utilisateurs (5+ sessions)", "Design system complet"],
  },
  {
    label: "Packaging",
    heading: "La première impression",
    body: "Le packaging est un vecteur de désirabilité souvent sous-estimé. Nous concevons des emballages qui reflètent l'identité du produit, optimisent la protection, et respectent les contraintes logistiques. De la boîte retail au packaging premium, en passant par le packaging industriel.",
    points: ["Diecut 3D et maquettes physiques", "Sélection matières et finitions", "BAT et suivi impression", "Pack éco-responsable sur demande"],
  },
  {
    label: "Prototypage Rapide",
    heading: "Tenir le concept en main",
    body: "Impression 3D FDM et SLA, usinage CNC, électronique embarquée — notre atelier de prototypage permet de valider l'ergonomie, les assemblages et le ressenti utilisateur en quelques jours. Nos prototypes servent aussi de maquettes investisseurs et outils de présentation commerciale.",
    points: ["Délai 48h à 5 jours", "Impression SLA haute résolution", "Assemblage et finition manuelle", "Photos produit incluses"],
  },
]

// ─── Testimonials ───────────────────────────────────────────────────────────
const testimonials = [
  {
    quote: "Forme Studio a transformé notre concept en produit commercialisable en 11 semaines. Leur capacité à anticiper les contraintes fabrication dès le design nous a économisé au moins 3 mois et 40k€. Un partenaire indispensable.",
    name: "Théo Marchetti",
    title: "CEO, Zeno Technologies",
    company: "Startup deeptech, 1er levée de fonds",
  },
  {
    quote: "Nous avions un cahier des charges complexe : un dispositif médical de classe IIA avec une interface tactile intuitive. Forme Studio a livré un design qui a passé les tests utilisateurs du premier coup. Impressionnant.",
    name: "Dr. Laure Fontaine",
    title: "Directrice Innovation, MedGroup",
    company: "Industriel médical, 200 salariés",
  },
  {
    quote: "Le sprint de 4 semaines pour notre MVP visuel a été décisif pour notre levée. Les investisseurs ont immédiatement compris le produit. Forme Studio a su synthétiser notre vision et la rendre tangible, désirable, crédible.",
    name: "Antoine Bruel",
    title: "Co-fondateur, Looop",
    company: "Startup hardware, pré-seed",
  },
  {
    quote: "En retainer depuis 18 mois, Forme Studio est devenu notre département design interne. Réactivité, qualité constante, compréhension fine de nos contraintes industrielles — exactement ce dont un ETI a besoin.",
    name: "Christelle Moreau",
    title: "Directrice R&D, Groupe Innopack",
    company: "ETI packaging industriel",
  },
]

// ─── FAQ data ───────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "Livrez-vous les fichiers source et les DPI ?",
    a: "Oui, systématiquement. Tous les livrables incluent les fichiers sources ouverts : STEP et IGES pour la CAO, Figma avec variables et composants pour l'UX, Adobe Illustrator pour le packaging. Vous êtes propriétaire à 100% de tout ce que nous produisons. Aucune dépendance logicielle propriétaire.",
  },
  {
    q: "Comment gérez-vous la confidentialité et les NDA ?",
    a: "Nous signons un NDA bilatéral avant tout échange de brief ou de données produit. Notre équipe est formée à la gestion des informations confidentielles. Les projets sont compartimentés : seuls les membres directement assignés y ont accès. Nos serveurs sont hébergés en Europe (ISO 27001). Le dépôt de brevet éventuel reste à votre initiative.",
  },
  {
    q: "Assurez-vous un suivi en phase de production ?",
    a: "Pour les projets Complet, nous incluons un suivi de 3 mois post-livraison : validation des prototypes série, passage en revue des premières pièces produites, ajustements de design si nécessaire. Pour les clients en Retainer, le suivi production est inclus dans le scope mensuel. Nous travaillons avec un réseau de sous-traitants certifiés en Europe et Asie.",
  },
  {
    q: "Quels sont les délais réalistes pour un projet ?",
    a: "Sprint Design MVP : 4 semaines. Projet Complet (recherche → proto → specs production) : 12 à 20 semaines selon la complexité. Packaging seul : 3 à 6 semaines. Prototypage rapide : 48h à 5 jours. Ces délais supposent une disponibilité client pour les ateliers de validation bi-hebdomadaires. Les délais sont contractualisés avec pénalités.",
  },
  {
    q: "Combien de tours de révisions sont inclus ?",
    a: "Pour le Sprint Design : 2 tours de révisions inclus par phase (concepts, développement, final). Pour le Projet Complet : 3 tours par phase. Pour le Retainer : révisions illimitées dans le scope mensuel convenu. Au-delà, des heures supplémentaires sont facturées au taux horaire (120€/h senior, 80€/h junior), toujours estimées et validées à l'avance.",
  },
]

// ─── Main Component ─────────────────────────────────────────────────────────
export default function FormeStudioPage() {
  const { scrollY } = useScroll()
  const heroTitleY = useTransform(scrollY, [0, 500], [0, -60])
  const panelY = useTransform(scrollY, [0, 500], [0, 30])

  const [activeTab, setActiveTab] = useState(0)
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const [testimonialDir, setTestimonialDir] = useState(1)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  function nextTestimonial() {
    setTestimonialDir(1)
    setTestimonialIndex((i) => (i + 1) % testimonials.length)
  }
  function prevTestimonial() {
    setTestimonialDir(-1)
    setTestimonialIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div style={{ background: C.bg, color: C.dark, fontFamily: FONT, overflowX: "hidden" }}>

      {/* ── 1. NAVBAR ─────────────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(20px, 5vw, 80px)",
          height: 60,
          background: "rgba(250,250,250,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              background: C.orange,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" fill="white" />
              <rect x="8" y="1" width="5" height="5" fill="white" opacity="0.5" />
              <rect x="1" y="8" width="5" height="5" fill="white" opacity="0.5" />
              <rect x="8" y="8" width="5" height="5" fill="white" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: FONT,
              fontSize: 15,
              fontWeight: 800,
              color: C.dark,
              letterSpacing: "-0.03em",
            }}
          >
            Forme Studio
          </span>
        </div>

        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["Services", "Projets", "Studio", "Blog"].map((l) => (
            <Link
              key={l}
              href="#"
              style={{
                fontFamily: FONT,
                fontSize: 14,
                fontWeight: 500,
                color: C.muted,
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              {l}
            </Link>
          ))}
          <a
            href="#contact"
            style={{
              fontFamily: FONT,
              fontSize: 14,
              fontWeight: 700,
              color: C.white,
              background: C.orange,
              padding: "9px 22px",
              textDecoration: "none",
              cursor: "pointer",
              borderRadius: 4,
              transition: "background 0.2s",
            }}
          >
            Lancer un projet
          </a>
        </div>
      </nav>

      {/* ── 2. HERO ───────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          padding: "0 clamp(20px, 5vw, 80px)",
          paddingTop: 60,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Orange diagonal panel (right) */}
        <motion.div
          style={{
            y: panelY,
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "46%",
            background: C.orange,
            clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0% 100%)",
            zIndex: 0,
          }}
        />

        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: 120,
            left: "clamp(20px, 5vw, 80px)",
            fontFamily: FONT,
            fontSize: "clamp(5rem, 14vw, 12rem)",
            fontWeight: 900,
            color: "rgba(28,28,30,0.03)",
            userSelect: "none",
            lineHeight: 1,
            zIndex: 0,
          }}
        >
          DESIGN
        </div>

        {/* Left: heading */}
        <motion.div
          style={{
            y: heroTitleY,
            flex: 1,
            zIndex: 2,
            maxWidth: 560,
            paddingRight: 40,
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: C.grey,
              border: `1px solid ${C.border}`,
              borderRadius: 100,
              padding: "6px 14px",
              marginBottom: 32,
            }}
          >
            <div style={{ width: 7, height: 7, background: C.orange, borderRadius: "50%" }} />
            <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: C.muted }}>
              Studio fondé en 2013 · Paris
            </span>
          </motion.div>

          <div>
            {[
              { word: "Design.", size: "clamp(3rem, 7vw, 5.5rem)", delay: 0.1 },
              { word: "Fonctionnel.", size: "clamp(2.4rem, 5.5vw, 4.5rem)", delay: 0.2 },
              { word: "Désirable.", size: "clamp(3rem, 7vw, 5.5rem)", delay: 0.3 },
            ].map(({ word, size, delay }) => (
              <motion.div
                key={word}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay }}
                style={{
                  fontFamily: FONT,
                  fontSize: size,
                  fontWeight: 900,
                  color: C.dark,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                }}
              >
                {word}
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              fontFamily: FONT,
              fontSize: 17,
              color: C.muted,
              lineHeight: 1.7,
              margin: "28px 0 40px",
              maxWidth: 440,
            }}
          >
            Cabinet de design produit industriel et UX. Nous transformons vos idées en produits que les gens veulent acheter et utiliser.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
          >
            <button
              style={{
                background: C.orange,
                border: "none",
                color: C.white,
                fontFamily: FONT,
                fontSize: 15,
                fontWeight: 700,
                padding: "16px 36px",
                borderRadius: 4,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              Lancer Votre Projet
            </button>
            <button
              style={{
                background: "transparent",
                border: `2px solid ${C.dark}`,
                color: C.dark,
                fontFamily: FONT,
                fontSize: 15,
                fontWeight: 600,
                padding: "14px 36px",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Voir nos projets →
            </button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{ display: "flex", gap: 24, marginTop: 40, alignItems: "center" }}
          >
            {["3× Red Dot", "8 Brevets", "180+ Produits"].map((b) => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, background: C.orange, borderRadius: "50%" }} />
                <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: C.muted }}>{b}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: isometric product */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "0 0 auto",
            width: "min(380px, 45vw)",
          }}
        >
          <IsometricProduct />
        </motion.div>
      </section>

      {/* ── 3. STATS BAR ──────────────────────────────────────────────── */}
      <section
        style={{
          background: C.dark,
          padding: "72px clamp(20px, 8vw, 120px)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 40,
            justifyContent: "center",
            flexWrap: "wrap",
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          {[
            { value: "12 ans", label: "d'expérience studio" },
            { value: "180+", label: "produits lancés" },
            { value: "8", label: "brevets déposés" },
            { value: "3×", label: "Red Dot Award" },
          ].map(({ value, label }) => (
            <div key={label} style={{ flex: 1, minWidth: 140, textAlign: "center" }}>
              <StatCounter
                value={value}
                label={label}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. FEATURES / TABS ────────────────────────────────────────── */}
      <section style={{ padding: "100px clamp(20px, 8vw, 120px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{
              display: "inline-block",
              background: "#fff3eb",
              color: C.orange,
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              padding: "6px 14px",
              borderRadius: 100,
              marginBottom: 16,
            }}
          >
            NOS SERVICES
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontFamily: FONT,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 900,
              color: C.dark,
              letterSpacing: "-0.03em",
              marginBottom: 52,
              lineHeight: 1.1,
            }}
          >
            Ce que nous faisons<br />
            <span style={{ color: C.orange }}>mieux que quiconque.</span>
          </motion.h2>

          {/* Tab buttons with sliding indicator */}
          <div style={{ position: "relative", borderBottom: `2px solid ${C.border}`, marginBottom: 52 }}>
            <div style={{ display: "flex", gap: 0 }}>
              {tabs.map((t, i) => (
                <button
                  key={t.label}
                  onClick={() => setActiveTab(i)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "14px 28px",
                    fontFamily: FONT,
                    fontSize: 14,
                    fontWeight: i === activeTab ? 700 : 500,
                    color: i === activeTab ? C.dark : C.muted,
                    cursor: "pointer",
                    transition: "color 0.25s, font-weight 0.25s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {/* Sliding orange indicator */}
            <motion.div
              animate={{
                left: `calc(${activeTab} * (100% / ${tabs.length}))`,
                width: `calc(100% / ${tabs.length})`,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 36 }}
              style={{
                position: "absolute",
                bottom: -2,
                height: 3,
                background: C.orange,
                borderRadius: "2px 2px 0 0",
              }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              style={{ display: "flex", gap: 64, alignItems: "flex-start", flexWrap: "wrap" }}
            >
              <div style={{ flex: 1, minWidth: 280 }}>
                <h3
                  style={{
                    fontFamily: FONT,
                    fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                    fontWeight: 900,
                    color: C.dark,
                    letterSpacing: "-0.03em",
                    marginBottom: 18,
                    lineHeight: 1.15,
                  }}
                >
                  {tabs[activeTab].heading}
                </h3>
                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: 15,
                    lineHeight: 1.8,
                    color: C.muted,
                    marginBottom: 28,
                  }}
                >
                  {tabs[activeTab].body}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {tabs[activeTab].points.map((p) => (
                    <li key={p} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 6, height: 6, background: C.orange, borderRadius: "50%", flexShrink: 0 }} />
                      <span style={{ fontFamily: FONT, fontSize: 14, color: C.dark, fontWeight: 500 }}>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual aside */}
              <div
                style={{
                  width: 300,
                  height: 320,
                  background: C.grey,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "40%",
                    background: C.orange,
                    opacity: 0.08,
                  }}
                />
                <div style={{ textAlign: "center", zIndex: 1 }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      background: C.orange,
                      borderRadius: 12,
                      margin: "0 auto 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: C.dark }}>
                    {tabs[activeTab].label}
                  </span>
                  <div style={{ fontFamily: FONT, fontSize: 12, color: C.muted, marginTop: 4 }}>
                    Forme Studio
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── 5. TESTIMONIALS CAROUSEL ──────────────────────────────────── */}
      <section style={{ background: C.grey, padding: "100px clamp(20px, 8vw, 120px)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 56 }}
          >
            <div
              style={{
                display: "inline-block",
                background: "#fff3eb",
                color: C.orange,
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                padding: "6px 14px",
                borderRadius: 100,
                marginBottom: 16,
              }}
            >
              TÉMOIGNAGES CLIENTS
            </div>
            <h2
              style={{
                fontFamily: FONT,
                fontSize: "clamp(2rem, 4vw, 2.8rem)",
                fontWeight: 900,
                color: C.dark,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Ce que disent nos clients
            </h2>
          </motion.div>

          <div
            style={{
              background: C.white,
              borderRadius: 12,
              padding: "52px 52px 40px",
              boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
              minHeight: 260,
              position: "relative",
            }}
          >
            {/* Orange accent */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 4,
                height: "100%",
                background: C.orange,
                borderRadius: "12px 0 0 12px",
              }}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: testimonialDir * 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: testimonialDir * -30 }}
                transition={{ duration: 0.4 }}
              >
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: "clamp(1rem, 2.2vw, 1.2rem)",
                    lineHeight: 1.75,
                    color: C.dark,
                    marginBottom: 32,
                    fontWeight: 400,
                  }}
                >
                  "{testimonials[testimonialIndex].quote}"
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      background: C.orange,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONT,
                        fontSize: 16,
                        fontWeight: 800,
                        color: C.white,
                      }}
                    >
                      {testimonials[testimonialIndex].name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: FONT,
                        fontSize: 14,
                        fontWeight: 700,
                        color: C.dark,
                      }}
                    >
                      {testimonials[testimonialIndex].name}
                    </div>
                    <div style={{ fontFamily: FONT, fontSize: 12, color: C.muted }}>
                      {testimonials[testimonialIndex].title} · {testimonials[testimonialIndex].company}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 32 }}>
            <button
              onClick={prevTestimonial}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: C.white,
                border: `1px solid ${C.border}`,
                cursor: "pointer",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              ←
            </button>
            <div style={{ display: "flex", gap: 8 }}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setTestimonialDir(i > testimonialIndex ? 1 : -1)
                    setTestimonialIndex(i)
                  }}
                  style={{
                    width: i === testimonialIndex ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    background: i === testimonialIndex ? C.orange : C.border,
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "width 0.3s, background 0.3s",
                  }}
                />
              ))}
            </div>
            <button
              onClick={nextTestimonial}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: C.white,
                border: `1px solid ${C.border}`,
                cursor: "pointer",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              →
            </button>
          </div>
        </div>
      </section>

      {/* ── 6. PRICING ────────────────────────────────────────────────── */}
      <section style={{ padding: "100px clamp(20px, 8vw, 120px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 56 }}
          >
            <div
              style={{
                display: "inline-block",
                background: "#fff3eb",
                color: C.orange,
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                padding: "6px 14px",
                borderRadius: 100,
                marginBottom: 16,
              }}
            >
              OFFRES
            </div>
            <h2
              style={{
                fontFamily: FONT,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 900,
                color: C.dark,
                letterSpacing: "-0.03em",
              }}
            >
              Des engagements clairs,<br />des résultats mesurables.
            </h2>
          </motion.div>

          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", alignItems: "stretch" }}>
            {[
              {
                name: "Sprint Design",
                price: "8 500€",
                sub: "4 semaines",
                highlight: false,
                description: "Idéal pour valider un concept, préparer un dossier investisseur ou tester la désirabilité avant de développer.",
                features: [
                  "Brief + benchmark concurrentiel",
                  "3 directions de design",
                  "MVP visuel haute fidélité",
                  "Specs techniques pour dev",
                  "2 tours de révisions inclus",
                  "Présentation finale",
                ],
                cta: "Démarrer un Sprint",
              },
              {
                name: "Projet Complet",
                price: "28 000€+",
                sub: "12 à 20 semaines",
                highlight: true,
                description: "De la recherche au prototype série : un accompagnement complet pour lancer un produit industriel ou digital solide.",
                features: [
                  "Recherche utilisateur (10+ entretiens)",
                  "Design produit + UX intégrés",
                  "Prototypage physique ou interactif",
                  "Suivi production 3 mois",
                  "Dossier fabricant complet",
                  "Brevets (accompagnement)",
                  "3 tours de révisions / phase",
                ],
                cta: "Discuter du projet",
              },
              {
                name: "Retainer Studio",
                price: "4 500€/mois",
                sub: "Partenariat dédié",
                highlight: false,
                description: "Un designer senior dédié à votre entreprise, disponible chaque semaine. Pour les équipes qui ont besoin de design en continu.",
                features: [
                  "80h/mois garanties",
                  "Designer senior dédié",
                  "Réunion hebdomadaire",
                  "Révisions illimitées (scope)",
                  "Accès aux outils studio",
                  "Suivi production inclus",
                ],
                cta: "Demander une démo",
              },
            ].map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                style={{
                  flex: "1 1 290px",
                  maxWidth: 330,
                  background: tier.highlight ? C.dark : C.white,
                  border: tier.highlight ? `2px solid ${C.orange}` : `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: "40px 32px",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: tier.highlight ? "0 12px 48px rgba(249,115,22,0.18)" : "0 2px 16px rgba(0,0,0,0.05)",
                }}
              >
                {tier.highlight && (
                  <div
                    style={{
                      position: "absolute",
                      top: -14,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: C.orange,
                      color: C.white,
                      fontFamily: FONT,
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      padding: "5px 18px",
                      borderRadius: 100,
                      whiteSpace: "nowrap",
                    }}
                  >
                    RECOMMANDÉ
                  </div>
                )}

                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: 13,
                    fontWeight: 700,
                    color: tier.highlight ? C.muted : C.muted,
                    marginBottom: 8,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {tier.name}
                </div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: "2rem",
                    fontWeight: 900,
                    color: tier.highlight ? C.white : C.dark,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  {tier.price}
                </div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: 13,
                    color: C.orange,
                    fontWeight: 600,
                    marginBottom: 16,
                  }}
                >
                  {tier.sub}
                </div>
                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: 13,
                    lineHeight: 1.65,
                    color: tier.highlight ? "#9ca3af" : C.muted,
                    marginBottom: 24,
                    borderBottom: `1px solid ${tier.highlight ? "rgba(255,255,255,0.08)" : C.border}`,
                    paddingBottom: 20,
                  }}
                >
                  {tier.description}
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "0 0 32px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    flex: 1,
                  }}
                >
                  {tier.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="7" fill={C.orange} opacity={tier.highlight ? 1 : 0.15} />
                        <path d="M4 7l2 2 4-4" stroke={tier.highlight ? C.white : C.orange} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span
                        style={{
                          fontFamily: FONT,
                          fontSize: 13,
                          color: tier.highlight ? "#d1d5db" : C.dark,
                          fontWeight: 400,
                        }}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  style={{
                    width: "100%",
                    padding: "14px 0",
                    background: tier.highlight ? C.orange : "transparent",
                    border: tier.highlight ? "none" : `2px solid ${C.dark}`,
                    color: tier.highlight ? C.white : C.dark,
                    fontFamily: FONT,
                    fontSize: 14,
                    fontWeight: 700,
                    borderRadius: 6,
                    cursor: "pointer",
                    transition: "background 0.2s, transform 0.15s",
                  }}
                >
                  {tier.cta}
                </button>
              </motion.div>
            ))}
          </div>

          <p
            style={{
              textAlign: "center",
              fontFamily: FONT,
              fontSize: 13,
              color: C.muted,
              marginTop: 32,
            }}
          >
            Tous les projets commencent par un appel découverte gratuit de 30 minutes. Aucun engagement.
          </p>
        </div>
      </section>

      {/* ── 7. FAQ ACCORDION ──────────────────────────────────────────── */}
      <section style={{ background: C.grey, padding: "100px clamp(20px, 8vw, 120px)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ marginBottom: 48 }}
          >
            <div
              style={{
                display: "inline-block",
                background: "#fff3eb",
                color: C.orange,
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                padding: "6px 14px",
                borderRadius: 100,
                marginBottom: 16,
              }}
            >
              FAQ
            </div>
            <h2
              style={{
                fontFamily: FONT,
                fontSize: "clamp(2rem, 4vw, 2.8rem)",
                fontWeight: 900,
                color: C.dark,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Vos questions, nos réponses.
            </h2>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ background: C.white, borderRadius: 8, marginBottom: 8, overflow: "hidden" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "none",
                    border: "none",
                    padding: "20px 24px",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: 16,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT,
                      fontSize: 15,
                      fontWeight: 700,
                      color: C.dark,
                      lineHeight: 1.3,
                    }}
                  >
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      width: 28,
                      height: 28,
                      background: openFaq === i ? C.orange : C.grey,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "background 0.25s",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 2v8M2 6h8" stroke={openFaq === i ? C.white : C.dark} strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </motion.div>
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
                          fontSize: 14,
                          lineHeight: 1.75,
                          color: C.muted,
                          padding: "0 24px 24px",
                        }}
                      >
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. CTA BANNER ─────────────────────────────────────────────── */}
      <section
        style={{
          background: C.dark,
          padding: "100px clamp(20px, 8vw, 120px)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background graphic */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            background: C.orange,
            opacity: 0.06,
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -60,
            width: 300,
            height: 300,
            background: C.orange,
            opacity: 0.04,
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <div
            style={{
              display: "inline-block",
              background: "rgba(249,115,22,0.15)",
              color: C.orange,
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              padding: "6px 14px",
              borderRadius: 100,
              marginBottom: 24,
            }}
          >
            PRÊT À DÉMARRER ?
          </div>

          <h2
            style={{
              fontFamily: FONT,
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 900,
              color: C.white,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              marginBottom: 20,
            }}
          >
            Lancer Votre Projet
          </h2>

          <p
            style={{
              fontFamily: FONT,
              fontSize: 18,
              color: "#9ca3af",
              maxWidth: 480,
              margin: "0 auto 44px",
              lineHeight: 1.65,
            }}
          >
            Appel découverte gratuit, 30 minutes. On écoute votre brief, on vous dit ce qui est faisable, en combien de temps, et pour combien.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              style={{
                background: C.orange,
                border: "none",
                color: C.white,
                fontFamily: FONT,
                fontSize: 16,
                fontWeight: 700,
                padding: "18px 44px",
                borderRadius: 6,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              Réserver un appel gratuit
            </button>
            <button
              style={{
                background: "transparent",
                border: `1.5px solid rgba(255,255,255,0.2)`,
                color: C.white,
                fontFamily: FONT,
                fontSize: 16,
                fontWeight: 500,
                padding: "18px 44px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Voir nos réalisations
            </button>
          </div>

          <p
            style={{
              fontFamily: FONT,
              fontSize: 13,
              color: "#4b5563",
              marginTop: 24,
            }}
          >
            Réponse garantie sous 24h · NDA signé avant tout échange
          </p>
        </motion.div>
      </section>

      {/* ── 9. FOOTER ─────────────────────────────────────────────────── */}
      <footer
        style={{
          background: C.white,
          borderTop: `1px solid ${C.border}`,
          padding: "64px clamp(20px, 8vw, 120px) 32px",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 40, marginBottom: 56 }}>
            {/* Brand column */}
            <div style={{ maxWidth: 280 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    background: C.orange,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 4,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                    <rect x="1" y="1" width="5" height="5" fill="white" />
                    <rect x="8" y="1" width="5" height="5" fill="white" opacity="0.5" />
                    <rect x="1" y="8" width="5" height="5" fill="white" opacity="0.5" />
                    <rect x="8" y="8" width="5" height="5" fill="white" />
                  </svg>
                </div>
                <span
                  style={{
                    fontFamily: FONT,
                    fontSize: 16,
                    fontWeight: 800,
                    color: C.dark,
                    letterSpacing: "-0.03em",
                  }}
                >
                  Forme Studio
                </span>
              </div>
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: 13,
                  color: C.muted,
                  lineHeight: 1.7,
                  marginBottom: 24,
                }}
              >
                Cabinet de design produit industriel et UX. 12 Place de la Bourse, Paris 2e. hello@forme.studio
              </p>
              {/* Social icons */}
              <div style={{ display: "flex", gap: 12 }}>
                {/* LinkedIn */}
                <a href="#" style={{ color: C.muted, cursor: "pointer", transition: "color 0.2s" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                {/* MessageSquare/X */}
                <a href="#" style={{ color: C.muted, cursor: "pointer" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                {/* Behance */}
                <a href="#" style={{ color: C.muted, cursor: "pointer" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 12c0-1.657.896-3 2-3h4c1.1 0 2 1.343 2 3s-.9 3-2 3H3c-1.104 0-2-1.343-2-3z" />
                    <path d="M1 6h7M9 9c0-1.657.896-3 2-3h4c1.104 0 2 1.343 2 3v6c0 1.657-.896 3-2 3h-4c-1.104 0-2-1.343-2-3V9z" />
                    <path d="M9 12h8" />
                  </svg>
                </a>
                {/* Dribbble */}
                <a href="#" style={{ color: C.muted, cursor: "pointer" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Link columns */}
            {[
              {
                heading: "Services",
                links: ["Design Produit", "UX & Interface", "Packaging", "Prototypage Rapide", "Audit Design"],
              },
              {
                heading: "Studio",
                links: ["Notre approche", "L'équipe", "Nos projets", "Presse & Awards", "Blog"],
              },
              {
                heading: "Contact",
                links: ["Appel découverte", "Devis sur-mesure", "Partenariats", "Offres d'emploi", "Mentions légales"],
              },
            ].map((col) => (
              <div key={col.heading}>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: 12,
                    fontWeight: 800,
                    color: C.dark,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    marginBottom: 18,
                  }}
                >
                  {col.heading}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map((l) => (
                    <a
                      key={l}
                      href="#"
                      style={{
                        fontFamily: FONT,
                        fontSize: 13,
                        color: C.muted,
                        textDecoration: "none",
                        cursor: "pointer",
                        fontWeight: 400,
                        transition: "color 0.2s",
                      }}
                    >
                      {l}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
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
            <span style={{ fontFamily: FONT, fontSize: 13, color: C.muted }}>
              © 2026 Forme Studio. Tous droits réservés. · Paris, France
            </span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ width: 6, height: 6, background: "#22c55e", borderRadius: "50%" }} />
              <span style={{ fontFamily: FONT, fontSize: 13, color: C.muted }}>
                Disponible pour nouveaux projets
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
