"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import React, { useState, useRef } from "react"
import Link from "next/link"

const C = {
  bg: "#050508",
  text: "#f8f4f0",
  accent: "#c4a096",
  plum: "#3d1c2e",
  muted: "#8a7a74",
  card: "#0e0a0d",
  border: "#2a1a24",
}

const heading: React.CSSProperties = {
  fontFamily: '"Cormorant Garamond", Georgia, serif',
  fontStyle: "italic",
}

const body: React.CSSProperties = {
  fontFamily: "system-ui, sans-serif",
}

// ─── Stat counter with useInView ────────────────────────────────────────────
function StatCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  return (
    <div ref={ref} style={{ textAlign: "center", padding: "0 24px" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{
          ...heading,
          fontSize: "clamp(2rem, 4vw, 3.2rem)",
          fontWeight: 400,
          color: C.accent,
          letterSpacing: "0.02em",
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        {value}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        style={{ ...body, fontSize: "0.78rem", color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase" }}
      >
        {label}
      </motion.div>
    </div>
  )
}

// ─── FAQ Item ───────────────────────────────────────────────────────────────
function FaqItem({ q, a, isOpen, onClick }: { q: string; a: string; isOpen: boolean; onClick: () => void }) {
  return (
    <div
      style={{
        borderBottom: `1px solid ${C.border}`,
        overflow: "hidden",
      }}
    >
      <button
        onClick={onClick}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          padding: "22px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          textAlign: "left",
          gap: 16,
        }}
      >
        <span
          style={{
            ...heading,
            fontSize: "1.15rem",
            color: isOpen ? C.accent : C.text,
            fontStyle: "italic",
            transition: "color 0.3s",
          }}
        >
          {q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ color: C.accent, fontSize: "1.4rem", flexShrink: 0, lineHeight: 1 }}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <p style={{ ...body, color: C.muted, fontSize: "0.95rem", lineHeight: 1.75, paddingBottom: 22, margin: 0 }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Testimonial Card ────────────────────────────────────────────────────────
const testimonials = [
  {
    quote:
      "Je n'avais jamais ressenti un parfum me raconter une histoire avant Éther. Leur Vétiver Nocturne m'a accompagné lors de moments que je n'oublierai jamais. C'est bien plus qu'un parfum, c'est une empreinte.",
    name: "Isabelle Moreau",
    role: "Directrice artistique, Paris",
    scent: "Vétiver Nocturne",
  },
  {
    quote:
      "J'ai offert le Coffret Découverte à ma mère pour son anniversaire et elle m'a rappelée en larmes — de joie. La qualité des matières premières se sent immédiatement. Rien de chimique, rien d'artificiel. Pure nature.",
    name: "Camille Durand",
    role: "Acheteuse luxe, Lyon",
    scent: "Coffret Ambre & Rose",
  },
  {
    quote:
      "En tant que nez amateur, je cherchais des compositions honnêtes. Éther utilise des absolus réels, pas des reconstitutions. La tenue est remarquable — douze heures sur peau chaude, sans jamais virer à l'agressif.",
    name: "Thomas Vergne",
    role: "Collectionneur de parfums, Bordeaux",
    scent: "Iris Poudré Absolu",
  },
]

const tabs = [
  {
    id: "signature",
    label: "Collection Signature",
    content: {
      headline: "L'Essence de Notre Maison",
      body: "Nos 12 eaux de parfum permanentes constituent l'âme d'Éther. Chaque fragrance naît d'une obsession : trouver la matière première la plus noble — rose de Taïf, oud du Laos, iris de Florence — et la sublimer sans artifice. Des compositions qui évoluent sur la peau, révélant de nouvelles facettes à chaque heure.",
      items: ["Rose de Taïf & Bois de Santal", "Vétiver Nocturne", "Iris Poudré Absolu", "Oud Blanc & Musc Sacré"],
    },
  },
  {
    id: "editions",
    label: "Éditions Limitées",
    content: {
      headline: "La Rareté, Révélée",
      body: "Deux fois par an, notre maîtresse parfumeuse part en quête d'une matière première exceptionnelle disponible en quantité infime. Ces éditions — limitées à 200 flacons — explorent des territoires olfactifs audacieux : tabac vert du Zimbabwe, encens d'Éthiopie, tubéreuse mexicaine absolue.",
      items: ["Tabac Vert (Automne 2025)", "Encens d'Harar (Printemps 2025)", "Tubéreuse Méxicaine (Automne 2024)", "Cyprès & Sel Marin (Épuisé)"],
    },
  },
  {
    id: "bougies",
    label: "Bougies & Ambiance",
    content: {
      headline: "La Maison Éther",
      body: "Nos bougies de cire végétale portent les mêmes compositions que nos eaux de parfum. Conçues pour embaumer sans agressivité, elles diffusent pendant 55 à 60 heures une fragrance vraie, qui respire avec la pièce. Leur verre soufflé, gravé à la main, devient une pièce de décoration après usage.",
      items: ["Bougies Signature 220g (55h)", "Bougies Miniatures 80g (20h)", "Diffuseurs de Roseau 200ml", "Spray d'Ambiance 100ml"],
    },
  },
  {
    id: "coffrets",
    label: "Coffrets Cadeaux",
    content: {
      headline: "L'Art d'Offrir",
      body: "Chaque coffret Éther est assemblé à la main dans notre atelier parisien. Du Coffret Découverte 3×10ml — idéal pour l'initiation — au Grand Coffret Maison réunissant une eau de parfum 100ml et sa bougie assortie, chaque présentation est pensée pour faire de l'ouverture un rituel en soi.",
      items: ["Coffret Découverte 3×10ml", "Coffret Duo EDP + Bougie", "Grand Coffret Maison", "Coffret Personnalisable sur mesure"],
    },
  },
]

const faqs = [
  {
    q: "Vos ingrédients sont-ils vraiment naturels ?",
    a: "Tous nos parfums sont formulés avec un minimum de 95% d'ingrédients d'origine naturelle, certifiés COSMOS Natural par Ecocert. Nous travaillons en direct avec des producteurs de matières premières sélectionnés pour leur éthique et la qualité de leur récolte. Les 5% restants correspondent à des conservateurs naturels indispensables à la stabilité du flacon.",
  },
  {
    q: "Quelle est la tenue de vos parfums ?",
    a: "Nos eaux de parfum titrent entre 22% et 28% de concentration en matières premières, bien au-delà des standards de marché. Sur une peau chaude et bien hydratée, comptez 8 à 14 heures de tenue. Pour prolonger la diffusion, nous recommandons d'appliquer notre Baume Neutre Éther sur les poignets avant la fragrance.",
  },
  {
    q: "Livrez-vous à l'international ?",
    a: "Nous livrons dans 62 pays via DHL Express (3-5 jours ouvrés) et La Poste Colissimo pour la France et les DOM-TOM (2-3 jours). Les commandes sont préparées dans notre atelier parisien le jour ouvré suivant la commande, emballées dans un écrin recyclable. Les frais de douane sont à la charge du destinataire hors UE.",
  },
  {
    q: "Puis-je recevoir des échantillons avant d'acheter ?",
    a: "Absolument. Notre Coffret Découverte 3×10ml est conçu précisément pour cela — vous choisissez vos trois fragrances parmi l'intégralité de la collection. Nous offrons également deux échantillons de 1,5ml avec chaque commande, en cadeau. Ces flacons de voyage sont aussi disponibles séparément à l'unité sur notre boutique.",
  },
  {
    q: "Votre politique de retour ?",
    a: "Nous acceptons les retours de flacons non ouverts et non descellés dans un délai de 14 jours suivant la réception, conformément au droit de rétractation européen. En cas de défaut de fabrication avéré, nous assurons le remplacement ou le remboursement intégral. Contactez notre service client à contact@ether-parfums.fr pour initier toute démarche.",
  },
  {
    q: "Vos flacons sont-ils rechargeables ?",
    a: "Depuis 2023, l'intégralité de notre collection Signature est disponible en format rechargeable. Nos flacons 100ml acceptent notre recharge hermétique, réduisant les déchets de verre et le coût à la recharge (-25% par rapport au flacon neuf). Nous proposons également la collecte des flacons vides en boutique pour recyclage.",
  },
]

const pricingTiers = [
  {
    name: "Eau de Parfum",
    volume: "50 ml",
    price: "à partir de 120€",
    desc: "L'entrée dans l'univers Éther. Concentration 22–24%, flacon verre soufflé, bouchon laqué.",
    features: ["12 fragrances disponibles", "Flacon collector réutilisable", "Notice olfactive incluse", "Emballage cadeau offert"],
    highlighted: false,
  },
  {
    name: "Eau de Parfum",
    volume: "100 ml",
    price: "à partir de 195€",
    desc: "Le grand format, conçu pour ceux qui ont trouvé leur signature. Rechargeable dès 2024.",
    features: ["Format rechargeable", "Concentrations exclusives 26–28%", "Gravure prénom offerte", "Livraison express prioritaire", "Accès éditions limitées en avant-première"],
    highlighted: true,
  },
  {
    name: "Coffret Découverte",
    volume: "3 × 10 ml",
    price: "89€",
    desc: "Explorez trois fragrances de votre choix dans des flacons de voyage élégants, idéal en cadeau.",
    features: ["Choix libre parmi 12 créations", "Coffret bois laqué inclus", "Carte olfactive personnalisée", "Échange possible sous 30 jours"],
    highlighted: false,
  },
]

// ─── SVG Noise pattern for feature cards ────────────────────────────────────
function NoiseOverlay() {
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="noise-ether">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise-ether)" />
    </svg>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function EtherPage() {
  const { scrollY } = useScroll()
  const heroCircleScale = useTransform(scrollY, [0, 500], [1, 1.2])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])

  const [activeTab, setActiveTab] = useState("signature")
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [direction, setDirection] = useState(1)

  const currentTab = tabs.find((t) => t.id === activeTab)!

  function goTestimonial(index: number) {
    setDirection(index > activeTestimonial ? 1 : -1)
    setActiveTestimonial(index)
  }
  function nextTestimonial() {
    const next = (activeTestimonial + 1) % testimonials.length
    setDirection(1)
    setActiveTestimonial(next)
  }
  function prevTestimonial() {
    const prev = (activeTestimonial - 1 + testimonials.length) % testimonials.length
    setDirection(-1)
    setActiveTestimonial(prev)
  }

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", overflowX: "hidden" }}>
      {/* Rose gold top bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, background: C.accent, zIndex: 100 }} />

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          position: "fixed",
          top: 3,
          left: 0,
          right: 0,
          zIndex: 99,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 48px",
          background: "rgba(5, 5, 8, 0.88)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ ...heading, fontSize: "1.5rem", letterSpacing: "0.3em", color: C.accent, fontStyle: "normal", fontWeight: 400 }}>
          ÉTHER
        </div>
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {["Collection", "Éditions", "Bougies", "Notre Histoire"].map((link) => (
            <Link
              key={link}
              href="#"
              style={{ ...body, color: C.muted, fontSize: "0.8rem", letterSpacing: "0.1em", textDecoration: "none", textTransform: "uppercase", cursor: "pointer", transition: "color 0.2s" }}
            >
              {link}
            </Link>
          ))}
        </div>
        <motion.a
          href="#"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            ...body,
            background: C.accent,
            color: C.bg,
            padding: "10px 24px",
            fontSize: "0.75rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          Boutique
        </motion.a>
      </motion.nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          paddingTop: 80,
          overflow: "hidden",
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 70% 60% at 50% 40%, ${C.plum}44 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        <motion.div
          style={{ scale: heroCircleScale, opacity: heroOpacity, position: "relative" }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Rotating SVG circle */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            style={{ position: "absolute", inset: -20, pointerEvents: "none" }}
          >
            <svg viewBox="0 0 460 460" style={{ width: "100%", height: "100%" }}>
              <circle
                cx="230" cy="230" r="215"
                fill="none"
                stroke={C.accent}
                strokeWidth="0.8"
                strokeDasharray="8 14"
                opacity="0.5"
              />
              <circle
                cx="230" cy="230" r="200"
                fill="none"
                stroke={C.accent}
                strokeWidth="0.3"
                opacity="0.3"
              />
            </svg>
          </motion.div>

          {/* Inner content circle */}
          <div
            style={{
              width: 420,
              height: 420,
              borderRadius: "50%",
              border: `1px solid ${C.border}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              background: `radial-gradient(ellipse at center, ${C.plum}22 0%, transparent 70%)`,
            }}
          >
            <div
              style={{
                ...heading,
                fontSize: "clamp(3rem, 6vw, 5.5rem)",
                letterSpacing: "0.5em",
                color: C.text,
                fontStyle: "normal",
                fontWeight: 300,
                lineHeight: 1,
                marginBottom: 16,
              }}
            >
              ÉTHER
            </div>
            <div
              style={{
                ...heading,
                fontSize: "clamp(0.9rem, 2vw, 1.2rem)",
                color: C.accent,
                fontStyle: "italic",
                letterSpacing: "0.05em",
                textAlign: "center",
              }}
            >
              L'Invisible Made Visible
            </div>
          </div>
        </motion.div>

        {/* Collection pills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8 }}
          style={{ display: "flex", gap: 12, marginTop: 48, flexWrap: "wrap", justifyContent: "center" }}
        >
          {["Collection Signature", "Éditions Limitées", "Bougies & Maison"].map((label) => (
            <div
              key={label}
              style={{
                ...body,
                border: `1px solid ${C.border}`,
                color: C.muted,
                padding: "8px 20px",
                fontSize: "0.72rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                borderRadius: 999,
              }}
            >
              {label}
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ position: "absolute", bottom: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
        >
          <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, transparent, ${C.accent})` }} />
          <span style={{ ...body, fontSize: "0.65rem", letterSpacing: "0.2em", color: C.muted, textTransform: "uppercase" }}>Défiler</span>
        </motion.div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 48px", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 24,
          }}
        >
          <StatCounter value="2018" label="Année de fondation" />
          <StatCounter value="24" label="Créations olfactives" />
          <StatCounter value="100%" label="Ingrédients naturels certifiés" />
          <StatCounter value="62" label="Pays de livraison" />
        </div>
      </section>

      {/* ── FEATURES / TABS ──────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <div style={{ ...body, fontSize: "0.7rem", letterSpacing: "0.22em", color: C.accent, textTransform: "uppercase", marginBottom: 16 }}>
            Notre Univers
          </div>
          <h2 style={{ ...heading, fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 400, margin: 0, color: C.text }}>
            La Maison Éther
          </h2>
        </motion.div>

        {/* Tab selector */}
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 56, flexWrap: "wrap" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? C.accent : "transparent",
                color: activeTab === tab.id ? C.bg : C.muted,
                border: `1px solid ${activeTab === tab.id ? C.accent : C.border}`,
                padding: "10px 22px",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "system-ui, sans-serif",
                transition: "all 0.25s",
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
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              alignItems: "center",
            }}
          >
            <div>
              <h3 style={{ ...heading, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 400, color: C.text, margin: "0 0 20px" }}>
                {currentTab.content.headline}
              </h3>
              <p style={{ ...body, color: C.muted, lineHeight: 1.8, fontSize: "0.95rem", margin: "0 0 32px" }}>
                {currentTab.content.body}
              </p>
              <motion.a
                href="#"
                whileHover={{ x: 4 }}
                style={{
                  ...body,
                  color: C.accent,
                  fontSize: "0.8rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Explorer →
              </motion.a>
            </div>

            {/* Fragrance family cards with noise texture */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {currentTab.content.items.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4, borderColor: C.accent }}
                  style={{
                    position: "relative",
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    padding: "24px 18px",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "border-color 0.3s",
                  }}
                >
                  <NoiseOverlay />
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ width: 24, height: 1, background: C.accent, marginBottom: 14 }} />
                    <div style={{ ...heading, fontSize: "0.9rem", color: C.text, fontStyle: "italic", lineHeight: 1.4 }}>
                      {item}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
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
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 56 }}
          >
            <div style={{ ...body, fontSize: "0.7rem", letterSpacing: "0.22em", color: C.accent, textTransform: "uppercase", marginBottom: 16 }}>
              Témoignages
            </div>
            <h2 style={{ ...heading, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 400, color: C.text, margin: 0 }}>
              Ce Que Disent Nos Clients
            </h2>
          </motion.div>

          <div style={{ position: "relative", minHeight: 280 }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeTestimonial}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ textAlign: "center" }}
              >
                {/* Quote marks */}
                <div style={{ ...heading, fontSize: "5rem", color: C.accent, opacity: 0.3, lineHeight: 0.6, marginBottom: 24 }}>"</div>
                <p
                  style={{
                    ...heading,
                    fontSize: "clamp(1rem, 2vw, 1.25rem)",
                    fontStyle: "italic",
                    color: C.text,
                    lineHeight: 1.7,
                    margin: "0 0 32px",
                  }}
                >
                  {testimonials[activeTestimonial].quote}
                </p>
                <div style={{ ...body, fontSize: "0.85rem", color: C.accent, marginBottom: 4 }}>
                  {testimonials[activeTestimonial].name}
                </div>
                <div style={{ ...body, fontSize: "0.75rem", color: C.muted }}>
                  {testimonials[activeTestimonial].role}
                </div>
                <div
                  style={{
                    ...body,
                    fontSize: "0.7rem",
                    color: C.muted,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginTop: 6,
                    opacity: 0.7,
                  }}
                >
                  {testimonials[activeTestimonial].scent}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginTop: 40 }}>
            <button
              onClick={prevTestimonial}
              style={{
                background: "none",
                border: `1px solid ${C.border}`,
                color: C.muted,
                width: 40,
                height: 40,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                transition: "border-color 0.2s",
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
                    background: i === activeTestimonial ? C.accent : C.border,
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    borderRadius: 3,
                    padding: 0,
                  }}
                />
              ))}
            </div>
            <button
              onClick={nextTestimonial}
              style={{
                background: "none",
                border: `1px solid ${C.border}`,
                color: C.muted,
                width: 40,
                height: 40,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                transition: "border-color 0.2s",
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
            <div style={{ ...body, fontSize: "0.7rem", letterSpacing: "0.22em", color: C.accent, textTransform: "uppercase", marginBottom: 16 }}>
              Tarifs
            </div>
            <h2 style={{ ...heading, fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 400, color: C.text, margin: 0 }}>
              Nos Formats
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, alignItems: "stretch" }}>
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.name + tier.volume}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: tier.highlighted ? C.plum : C.card,
                  border: `1px solid ${tier.highlighted ? C.accent : C.border}`,
                  padding: "40px 32px",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {tier.highlighted && (
                  <div
                    style={{
                      position: "absolute",
                      top: -1,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: C.accent,
                      color: C.bg,
                      padding: "4px 16px",
                      fontSize: "0.65rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      fontFamily: "system-ui, sans-serif",
                    }}
                  >
                    Le Plus Populaire
                  </div>
                )}

                <div style={{ ...body, fontSize: "0.7rem", letterSpacing: "0.15em", color: C.accent, textTransform: "uppercase", marginBottom: 8 }}>
                  {tier.name}
                </div>
                <div style={{ ...heading, fontSize: "1.5rem", color: C.text, marginBottom: 4, fontStyle: "normal" }}>
                  {tier.volume}
                </div>
                <div style={{ ...heading, fontSize: "2rem", color: C.accent, marginBottom: 16, fontWeight: 400 }}>
                  {tier.price}
                </div>
                <p style={{ ...body, fontSize: "0.85rem", color: C.muted, lineHeight: 1.65, marginBottom: 28, flexGrow: 1 }}>
                  {tier.desc}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px" }}>
                  {tier.features.map((f) => (
                    <li key={f} style={{ ...body, fontSize: "0.83rem", color: C.muted, padding: "7px 0", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ color: C.accent, flexShrink: 0 }}>✦</span> {f}
                    </li>
                  ))}
                </ul>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "13px 0",
                    background: tier.highlighted ? C.accent : "transparent",
                    border: `1px solid ${tier.highlighted ? C.accent : C.border}`,
                    color: tier.highlighted ? C.bg : C.text,
                    fontSize: "0.75rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    cursor: "pointer",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  Commander
                </motion.a>
              </motion.div>
            ))}
          </div>
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
            style={{ textAlign: "center", marginBottom: 60 }}
          >
            <div style={{ ...body, fontSize: "0.7rem", letterSpacing: "0.22em", color: C.accent, textTransform: "uppercase", marginBottom: 16 }}>
              Questions Fréquentes
            </div>
            <h2 style={{ ...heading, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 400, color: C.text, margin: 0 }}>
              Ce Que Vous Voulez Savoir
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
          background: `linear-gradient(135deg, ${C.plum} 0%, #1a0a14 50%, ${C.bg} 100%)`,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 80% 80% at 50% 50%, ${C.accent}11 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <div style={{ ...body, fontSize: "0.7rem", letterSpacing: "0.22em", color: C.accent, textTransform: "uppercase", marginBottom: 20 }}>
            Bienvenue dans l'Univers Éther
          </div>
          <h2
            style={{
              ...heading,
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontWeight: 300,
              color: C.text,
              margin: "0 0 20px",
              lineHeight: 1.1,
            }}
          >
            Découvrir Nos Créations
          </h2>
          <p style={{ ...body, color: C.muted, fontSize: "1.05rem", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 48px" }}>
            Chaque flacon renferme des centaines d'heures de recherche, de voyages et d'exigence. Commencez votre voyage olfactif avec notre Coffret Découverte ou explorez la collection complète.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a
              href="#"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: C.accent,
                color: C.bg,
                padding: "16px 40px",
                fontSize: "0.8rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textDecoration: "none",
                cursor: "pointer",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Explorer la Boutique
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: "transparent",
                color: C.text,
                padding: "16px 40px",
                fontSize: "0.8rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textDecoration: "none",
                border: `1px solid ${C.border}`,
                cursor: "pointer",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Commander un Coffret Découverte
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: C.bg,
          borderTop: `1px solid ${C.border}`,
          padding: "60px 48px 40px",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
            {/* Brand */}
            <div>
              <div style={{ ...heading, fontSize: "1.8rem", letterSpacing: "0.3em", color: C.accent, fontStyle: "normal", fontWeight: 400, marginBottom: 16 }}>
                ÉTHER
              </div>
              <p style={{ ...body, color: C.muted, fontSize: "0.85rem", lineHeight: 1.7, maxWidth: 280 }}>
                Maison de parfumerie artisanale fondée à Paris en 2018. 100% ingrédients naturels certifiés. Livraison dans 62 pays.
              </p>
              <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
                {/* Camera SVG */}
                <a href="#" style={{ color: C.muted, cursor: "pointer", transition: "color 0.2s" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                {/* Bookmark SVG */}
                <a href="#" style={{ color: C.muted, cursor: "pointer" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.76 1.23-5.21 1.23-5.21s-.31-.63-.31-1.56c0-1.46.85-2.55 1.9-2.55.9 0 1.33.67 1.33 1.48 0 .9-.58 2.26-.87 3.51-.25 1.05.52 1.9 1.54 1.9 1.85 0 3.09-2.39 3.09-5.21 0-2.15-1.45-3.77-4.08-3.77-2.98 0-4.83 2.22-4.83 4.71 0 .85.25 1.47.64 1.94.18.21.21.3.14.54-.05.17-.16.58-.21.75-.07.24-.28.33-.51.24-1.44-.59-2.11-2.19-2.11-3.98 0-2.97 2.51-6.55 7.49-6.55 4.03 0 6.69 2.93 6.69 6.08 0 4.17-2.3 7.28-5.69 7.28-1.14 0-2.22-.62-2.59-1.31l-.72 2.78c-.24.9-.86 2.02-1.33 2.77.83.25 1.7.38 2.6.38 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                  </svg>
                </a>
                {/* Email SVG */}
                <a href="mailto:contact@ether-parfums.fr" style={{ color: C.muted, cursor: "pointer" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M2 7l10 7 10-7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Collections */}
            <div>
              <div style={{ ...body, fontSize: "0.7rem", letterSpacing: "0.15em", color: C.accent, textTransform: "uppercase", marginBottom: 20 }}>Collections</div>
              {["Collection Signature", "Éditions Limitées", "Bougies & Ambiance", "Coffrets Cadeaux"].map((l) => (
                <a key={l} href="#" style={{ ...body, display: "block", color: C.muted, fontSize: "0.83rem", marginBottom: 10, textDecoration: "none", cursor: "pointer" }}>{l}</a>
              ))}
            </div>

            {/* Maison */}
            <div>
              <div style={{ ...body, fontSize: "0.7rem", letterSpacing: "0.15em", color: C.accent, textTransform: "uppercase", marginBottom: 20 }}>La Maison</div>
              {["Notre Histoire", "L'Atelier Parisien", "La Parfumeuse", "Presse & Médias"].map((l) => (
                <a key={l} href="#" style={{ ...body, display: "block", color: C.muted, fontSize: "0.83rem", marginBottom: 10, textDecoration: "none", cursor: "pointer" }}>{l}</a>
              ))}
            </div>

            {/* Service */}
            <div>
              <div style={{ ...body, fontSize: "0.7rem", letterSpacing: "0.15em", color: C.accent, textTransform: "uppercase", marginBottom: 20 }}>Service Client</div>
              {["Livraison & Retours", "FAQ", "Boutiques Partenaires", "Contact"].map((l) => (
                <a key={l} href="#" style={{ ...body, display: "block", color: C.muted, fontSize: "0.83rem", marginBottom: 10, textDecoration: "none", cursor: "pointer" }}>{l}</a>
              ))}
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
            <span style={{ ...body, color: C.muted, fontSize: "0.75rem" }}>
              © 2026 Éther — Maison de Parfumerie. Tous droits réservés.
            </span>
            <div style={{ display: "flex", gap: 24 }}>
              {["Mentions légales", "Politique de confidentialité", "CGV"].map((l) => (
                <a key={l} href="#" style={{ ...body, color: C.muted, fontSize: "0.75rem", textDecoration: "none", cursor: "pointer" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
