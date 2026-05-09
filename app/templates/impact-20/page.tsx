"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"
import Link from "next/link"

const C = {
  bg: "#080808",
  card: "#121212",
  gold: "#d4a853",
  goldLight: "#e8c47a",
  cream: "#faf6ef",
  muted: "#888",
  border: "#1e1e1e",
}

const FONT_HEADING = '"Cormorant Garamond", Georgia, serif'
const FONT_BODY = "system-ui, -apple-system, sans-serif"

// ─── Marquee ───────────────────────────────────────────────────────────────
function Marquee() {
  const text = "BAGUES · COLLIERS · BRACELETS · BOUCLES D'OREILLES · SUR-MESURE · "
  return (
    <div style={{ overflow: "hidden", background: C.gold, padding: "10px 0" }}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
        style={{ display: "flex", whiteSpace: "nowrap", width: "max-content" }}
      >
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            style={{
              fontFamily: FONT_BODY,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.2em",
              color: C.bg,
              paddingRight: 0,
            }}
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ─── Stat Counter ──────────────────────────────────────────────────────────
function StatCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <div ref={ref} style={{ textAlign: "center", flex: 1 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{
          fontFamily: FONT_HEADING,
          fontSize: "clamp(2rem, 4vw, 3.2rem)",
          fontWeight: 300,
          fontStyle: "italic",
          color: C.gold,
          lineHeight: 1,
        }}
      >
        {value}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.2 }}
        style={{
          fontFamily: FONT_BODY,
          fontSize: 12,
          letterSpacing: "0.15em",
          color: C.muted,
          marginTop: 8,
          textTransform: "uppercase",
        }}
      >
        {label}
      </motion.div>
    </div>
  )
}

// ─── Collection Card ───────────────────────────────────────────────────────
function CollectionCard({ label, sub, delay }: { label: string; sub: string; delay: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        minWidth: 130,
        aspectRatio: "3/4",
        background: C.card,
        border: `1px solid ${hovered ? C.gold : C.border}`,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "20px 16px",
        cursor: "pointer",
        transition: "border-color 0.3s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.div
        animate={{ opacity: hovered ? 0.06 : 0 }}
        style={{
          position: "absolute",
          inset: 0,
          background: C.gold,
          transition: "opacity 0.3s",
        }}
      />
      <div
        style={{
          fontFamily: FONT_BODY,
          fontSize: 10,
          letterSpacing: "0.2em",
          color: C.gold,
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: FONT_HEADING,
          fontSize: 18,
          fontStyle: "italic",
          color: C.cream,
          fontWeight: 300,
        }}
      >
        {sub}
      </div>
    </motion.div>
  )
}

// ─── Testimonial ───────────────────────────────────────────────────────────
const testimonials = [
  {
    quote:
      "La bague de fiançailles qu'Orens a créée pour nous est d'une perfection absolue. Le solitaire en or 18 carats avec le diamant taille coussin est exactement ce que j'avais imaginé. Ma fiancée pleure chaque fois qu'elle la regarde.",
    name: "Adrien L.",
    context: "Bague de fiançailles sur-mesure",
  },
  {
    quote:
      "J'ai offert un collier Orens à ma mère pour ses 60 ans. La chaîne en or jaune avec le pendentif en lune est d'une délicatesse rare. Le coffret, la carte manuscrite — tout était parfait. Un souvenir pour la vie.",
    name: "Camille D.",
    context: "Collier Collection Fine",
  },
  {
    quote:
      "Nous avons commandé nos alliances chez Orens. Le processus sur-mesure est d'une attention remarquable : trois rendez-vous, des maquettes, des ajustements. Les alliances sont exactement à notre image. Irremplaçable.",
    name: "Sophie & Marc T.",
    context: "Alliances de mariage sur-mesure",
  },
  {
    quote:
      "Orens a réinterprété la broche de ma grand-mère en un bracelet jonc moderne. Garder la pierre d'origine, ajouter de l'or 18 carats, créer quelque chose de nouveau tout en honorant l'ancien. Du grand art.",
    name: "Isabelle R.",
    context: "Transformation et réinterprétation",
  },
]

// ─── Feature Tabs ──────────────────────────────────────────────────────────
const tabs = [
  {
    id: "collections",
    label: "Collections",
    heading: "Éclat du quotidien",
    body: "Nos collections permanentes Orens conjuguent lignes épurées et matières précieuses. Chaque pièce — bague, collier, bracelet — est conçue pour traverser les saisons et les tendances. Or 18 carats, pierres fines sélectionnées, finitions à la main. Disponibles en boutique Paris et en ligne.",
    detail: "Bagues dès 380€ · Colliers dès 290€ · Bracelets dès 240€",
  },
  {
    id: "fiancailles",
    label: "Fiançailles & Mariage",
    heading: "L'instant décisif",
    body: "Solitaires, pavés diamants, trilogies, alliances plates ou martelées : notre atelier conçoit les symboles de vos engagements. Chaque bague de fiançailles est fabriquée à Paris, certifiée or 18 carats, livrée avec rapport gemmologique pour le diamant central.",
    detail: "Solitaires dès 890€ · Alliances dès 580€ · Consultation gratuite",
  },
  {
    id: "surmesure",
    label: "Sur-Mesure",
    heading: "Votre vision, notre savoir-faire",
    body: "Décrivez-nous votre bijou idéal. Notre équipe de créateurs parisiens traduit vos idées en esquisses, puis en maquettes 3D, avant la fabrication finale. Du choix de la pierre à la forme du chaton, chaque détail est décidé ensemble. Délai : 6 à 10 semaines.",
    detail: "À partir de 2 400€ · Consultation incluse · 3 rendez-vous atelier",
  },
  {
    id: "entretien",
    label: "Entretien & Gravure",
    heading: "Perpétuer l'éclat",
    body: "Rhodiage, polissage, changement de griffes, nettoyage aux ultrasons — notre atelier prend soin de vos bijoux Orens et de toute autre pièce fine. La gravure personnalisée est disponible sur la quasi-totalité de nos créations : date, prénom, coordonnées GPS d'un lieu.",
    detail: "Gravure dès 45€ · Entretien dès 35€ · Délai 5 jours ouvrés",
  },
]

// ─── FAQ ───────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "Comment l'or et les pierres sont-ils certifiés ?",
    a: "Tous nos bijoux sont fabriqués en or 18 carats (750‰) poinçonné, conforme aux normes françaises. Les diamants sont accompagnés d'un certificat GIA ou IGI. Les pierres fines (saphirs, rubis, émeraudes) sont sourcées auprès de fournisseurs éthiques certifiés. Chaque pièce livrée inclut un certificat d'authenticité Orens.",
  },
  {
    q: "Quel est le délai pour une création sur-mesure ?",
    a: "Comptez 6 à 10 semaines à compter de la validation du design final. Le processus comprend une consultation initiale (en boutique ou visio), la création d'esquisses, un rendu 3D pour validation, puis la fabrication à la main dans notre atelier parisien. Un acompte de 30% est demandé à la commande.",
  },
  {
    q: "La gravure est-elle possible sur toutes les pièces ?",
    a: "La gravure est disponible sur la très grande majorité de nos créations — alliances, solitaires, colliers pendentif, bracelets jonc. Elle peut être manuscrite (reproduction de votre écriture) ou en typographie standard. Délai : 3 à 5 jours ouvrés supplémentaires. Tarif dès 45€ selon la complexité.",
  },
  {
    q: "Peut-on reprendre ou retravailler une vieille bague ?",
    a: "Absolument. Notre service de transformation permet de retravailler vos bijoux existants : remonter une pierre sur un nouvel anneau, transformer une broche en pendant, fondre de l'or pour créer une nouvelle pièce. Chaque projet est évalué lors d'un rendez-vous dédié. Tarification sur devis.",
  },
  {
    q: "Comment se passe la livraison pour les pièces de valeur ?",
    a: "Toutes les commandes sont expédiées via colissimo recommandé avec signature, assurées à hauteur de leur valeur déclarée. Pour les pièces au-dessus de 2 000€, nous travaillons avec un transporteur sécurisé spécialisé (Brink's). La livraison internationale est disponible dans 35 pays, avec droits de douane à la charge du destinataire.",
  },
  {
    q: "Les bijoux Orens sont-ils disponibles en dehors de Paris ?",
    a: "Notre boutique principale est située au 14 rue de la Paix, Paris 2e. Nous expédions dans toute la France et dans 35 pays. Des consultations visio pour le sur-mesure sont disponibles quelle que soit votre localisation. Deux pop-ups annuels à Lyon et Bordeaux complètent notre présence physique.",
  },
]

// ─── Main Component ────────────────────────────────────────────────────────
export default function OrensPage() {
  const { scrollY } = useScroll()
  const heroTextY = useTransform(scrollY, [0, 500], [0, -50])
  const cardsY = useTransform(scrollY, [0, 500], [0, 20])

  const [activeTab, setActiveTab] = useState(0)
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const [testimonialDir, setTestimonialDir] = useState(1)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [navScrolled, setNavScrolled] = useState(false)

  const statsRef = useRef<HTMLDivElement>(null)

  // Track scroll for nav background
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setNavScrolled(window.scrollY > 60)
    }, { passive: true })
  }

  function nextTestimonial() {
    setTestimonialDir(1)
    setTestimonialIndex((i) => (i + 1) % testimonials.length)
  }
  function prevTestimonial() {
    setTestimonialDir(-1)
    setTestimonialIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div style={{ background: C.bg, color: C.cream, fontFamily: FONT_BODY, overflowX: "hidden" }}>

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
          padding: "0 clamp(24px, 5vw, 80px)",
          height: 64,
          background: navScrolled ? "rgba(8,8,8,0.95)" : "transparent",
          borderBottom: navScrolled ? `1px solid ${C.border}` : "1px solid transparent",
          backdropFilter: navScrolled ? "blur(12px)" : "none",
          transition: "background 0.4s, border-color 0.4s, backdrop-filter 0.4s",
        }}
      >
        <span
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 22,
            fontStyle: "italic",
            color: C.gold,
            letterSpacing: "0.12em",
            fontWeight: 300,
          }}
        >
          Orens
        </span>
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {["Collections", "Fiançailles", "Sur-Mesure", "Atelier"].map((l) => (
            <Link
              key={l}
              href="#"
              style={{
                fontFamily: FONT_BODY,
                fontSize: 12,
                letterSpacing: "0.12em",
                color: C.cream,
                textDecoration: "none",
                textTransform: "uppercase",
                opacity: 0.8,
                transition: "opacity 0.2s",
              }}
            >
              {l}
            </Link>
          ))}
          <a
            href="#contact"
            style={{
              fontFamily: FONT_BODY,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: C.bg,
              background: C.gold,
              padding: "9px 20px",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Prendre RDV
          </a>
        </div>
      </nav>

      {/* ── 2. HERO ───────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: C.bg,
          position: "relative",
          overflow: "hidden",
          paddingTop: 64,
        }}
      >
        {/* Background subtle texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(212,168,83,0.04) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <motion.div
          style={{ y: heroTextY, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}
        >
          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
              width: 52,
              height: 52,
              border: `1px solid ${C.gold}`,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 36,
            }}
          >
            <span
              style={{
                fontFamily: FONT_HEADING,
                fontSize: 24,
                fontStyle: "italic",
                color: C.gold,
                fontWeight: 300,
              }}
            >
              O
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{
              fontFamily: FONT_BODY,
              fontSize: 10,
              letterSpacing: "0.28em",
              color: C.gold,
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            Joaillerie fine · Paris
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            style={{
              fontFamily: FONT_HEADING,
              fontSize: "clamp(3rem, 8vw, 6.5rem)",
              fontStyle: "italic",
              fontWeight: 300,
              color: C.cream,
              textAlign: "center",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              marginBottom: 16,
            }}
          >
            Éclat du Présent
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            style={{
              fontFamily: FONT_BODY,
              fontSize: 15,
              color: C.muted,
              textAlign: "center",
              maxWidth: 380,
              lineHeight: 1.7,
              marginBottom: 52,
            }}
          >
            Bijoux d'exception façonnés à la main. Or 18 carats, pierres certifiées, créations sur-mesure depuis Paris.
          </motion.p>
        </motion.div>

        {/* Collection cards row */}
        <motion.div
          style={{
            y: cardsY,
            display: "flex",
            gap: 12,
            padding: "0 clamp(24px, 5vw, 80px)",
            width: "100%",
            maxWidth: 760,
            zIndex: 2,
          }}
        >
          {[
            { label: "Bagues", sub: "Solitaires & Joncs" },
            { label: "Colliers", sub: "Chaînes & Pendentifs" },
            { label: "Fiançailles", sub: "Alliances & Solitaires" },
            { label: "Sur-Mesure", sub: "Votre vision" },
          ].map((c, i) => (
            <CollectionCard key={c.label} label={c.label} sub={c.sub} delay={1 + i * 0.12} />
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          style={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: 1, height: 48, background: `linear-gradient(to bottom, ${C.gold}, transparent)` }}
          />
        </motion.div>
      </section>

      {/* ── MARQUEE ───────────────────────────────────────────────────── */}
      <Marquee />

      {/* ── 3. STATS BAR ──────────────────────────────────────────────── */}
      <section
        ref={statsRef}
        style={{
          background: C.card,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
          padding: "64px clamp(24px, 8vw, 120px)",
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
          <StatCounter value="2015" label="Fondée à Paris" />
          <StatCounter value="2 800+" label="Pièces créées" />
          <StatCounter value="100%" label="Or 18 carats certifié" />
          <StatCounter value="35" label="Pays livrés" />
        </div>
      </section>

      {/* ── 4. FEATURES / TABS ────────────────────────────────────────── */}
      <section
        style={{
          padding: "100px clamp(24px, 8vw, 120px)",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            fontFamily: FONT_BODY,
            fontSize: 11,
            letterSpacing: "0.2em",
            color: C.gold,
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Nos services
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            fontFamily: FONT_HEADING,
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontStyle: "italic",
            fontWeight: 300,
            color: C.cream,
            marginBottom: 52,
          }}
        >
          L'art de la joaillerie fine
        </motion.h2>

        {/* Tab buttons */}
        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.border}`, marginBottom: 48 }}>
          {tabs.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(i)}
              style={{
                background: "none",
                border: "none",
                borderBottom: i === activeTab ? `2px solid ${C.gold}` : "2px solid transparent",
                padding: "12px 28px",
                fontFamily: FONT_BODY,
                fontSize: 13,
                letterSpacing: "0.08em",
                color: i === activeTab ? C.gold : C.muted,
                cursor: "pointer",
                transition: "color 0.3s, border-color 0.3s",
                marginBottom: -1,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            style={{ display: "flex", gap: 60, alignItems: "flex-start", flexWrap: "wrap" }}
          >
            <div style={{ flex: 1, minWidth: 280 }}>
              <h3
                style={{
                  fontFamily: FONT_HEADING,
                  fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                  fontStyle: "italic",
                  fontWeight: 300,
                  color: C.cream,
                  marginBottom: 20,
                  lineHeight: 1.2,
                }}
              >
                {tabs[activeTab].heading}
              </h3>
              <p
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 15,
                  lineHeight: 1.85,
                  color: C.muted,
                  marginBottom: 24,
                }}
              >
                {tabs[activeTab].body}
              </p>
              <div
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  color: C.gold,
                  padding: "12px 0",
                  borderTop: `1px solid ${C.border}`,
                }}
              >
                {tabs[activeTab].detail}
              </div>
            </div>
            <div
              style={{
                width: 280,
                height: 340,
                background: C.card,
                border: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    border: `1px solid ${C.gold}`,
                    borderRadius: "50%",
                    margin: "0 auto 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontFamily: FONT_HEADING, fontSize: 28, fontStyle: "italic", color: C.gold }}>O</span>
                </div>
                <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.muted, letterSpacing: "0.12em" }}>
                  ATELIER PARIS
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── 5. TESTIMONIALS CAROUSEL ──────────────────────────────────── */}
      <section
        style={{
          background: C.card,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
          padding: "100px clamp(24px, 8vw, 120px)",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{
              fontFamily: FONT_BODY,
              fontSize: 11,
              letterSpacing: "0.2em",
              color: C.gold,
              textTransform: "uppercase",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            Témoignages
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontFamily: FONT_HEADING,
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              fontStyle: "italic",
              fontWeight: 300,
              color: C.cream,
              textAlign: "center",
              marginBottom: 60,
            }}
          >
            Ce que nos clients disent
          </motion.h2>

          <div style={{ position: "relative", minHeight: 220 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: testimonialDir * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: testimonialDir * -40 }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: "center" }}
              >
                <div
                  style={{
                    fontFamily: FONT_HEADING,
                    fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
                    fontStyle: "italic",
                    fontWeight: 300,
                    color: C.cream,
                    lineHeight: 1.7,
                    marginBottom: 32,
                  }}
                >
                  "{testimonials[testimonialIndex].quote}"
                </div>
                <div
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.gold,
                    letterSpacing: "0.08em",
                    marginBottom: 4,
                  }}
                >
                  {testimonials[testimonialIndex].name}
                </div>
                <div
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 11,
                    color: C.muted,
                    letterSpacing: "0.1em",
                  }}
                >
                  {testimonials[testimonialIndex].context}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Nav dots + arrows */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginTop: 40 }}>
            <button
              onClick={prevTestimonial}
              style={{
                background: "none",
                border: `1px solid ${C.border}`,
                color: C.cream,
                width: 40,
                height: 40,
                cursor: "pointer",
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "border-color 0.2s",
              }}
            >
              ←
            </button>
            <div style={{ display: "flex", gap: 8 }}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setTestimonialDir(i > testimonialIndex ? 1 : -1); setTestimonialIndex(i) }}
                  style={{
                    width: i === testimonialIndex ? 24 : 6,
                    height: 6,
                    borderRadius: 3,
                    background: i === testimonialIndex ? C.gold : C.border,
                    border: "none",
                    cursor: "pointer",
                    transition: "width 0.3s, background 0.3s",
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
                color: C.cream,
                width: 40,
                height: 40,
                cursor: "pointer",
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "border-color 0.2s",
              }}
            >
              →
            </button>
          </div>
        </div>
      </section>

      {/* ── 6. PRICING ────────────────────────────────────────────────── */}
      <section style={{ padding: "100px clamp(24px, 8vw, 120px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{
              fontFamily: FONT_BODY,
              fontSize: 11,
              letterSpacing: "0.2em",
              color: C.gold,
              textTransform: "uppercase",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            Nos gammes
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontFamily: FONT_HEADING,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontStyle: "italic",
              fontWeight: 300,
              color: C.cream,
              textAlign: "center",
              marginBottom: 60,
            }}
          >
            Pour chaque moment précieux
          </motion.h2>

          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              {
                name: "Bijou Signature",
                price: "à partir de 380€",
                highlight: false,
                features: [
                  "Or 18 carats poinçonné",
                  "Pierres fines sélectionnées",
                  "Coffret cadeau Orens",
                  "Certificat d'authenticité",
                  "Livraison assurée incluse",
                ],
                cta: "Découvrir",
              },
              {
                name: "Collection Fine",
                price: "à partir de 890€",
                highlight: true,
                features: [
                  "Or 18 carats + diamants",
                  "Rapport gemmologique GIA/IGI",
                  "Gravure personnalisée offerte",
                  "Service conciergerie",
                  "Livraison sécurisée",
                  "Entretien offert 1 an",
                ],
                cta: "Explorer la collection",
              },
              {
                name: "Création Sur-Mesure",
                price: "à partir de 2 400€",
                highlight: false,
                features: [
                  "3 rendez-vous atelier",
                  "Esquisse & maquette 3D",
                  "Choix de la pierre",
                  "Fabrication 100% Paris",
                  "Certificats inclus",
                  "Suivi à vie",
                ],
                cta: "Prendre rendez-vous",
              },
            ].map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                style={{
                  flex: "1 1 280px",
                  maxWidth: 320,
                  background: tier.highlight ? C.gold : C.card,
                  border: `1px solid ${tier.highlight ? C.gold : C.border}`,
                  padding: "40px 32px",
                  position: "relative",
                }}
              >
                {tier.highlight && (
                  <div
                    style={{
                      position: "absolute",
                      top: -1,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: C.bg,
                      border: `1px solid ${C.gold}`,
                      padding: "4px 16px",
                      fontFamily: FONT_BODY,
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      color: C.gold,
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Le plus choisi
                  </div>
                )}
                <div
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 11,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: tier.highlight ? C.bg : C.muted,
                    marginBottom: 12,
                  }}
                >
                  {tier.name}
                </div>
                <div
                  style={{
                    fontFamily: FONT_HEADING,
                    fontSize: "1.7rem",
                    fontStyle: "italic",
                    fontWeight: 300,
                    color: tier.highlight ? C.bg : C.cream,
                    marginBottom: 28,
                    lineHeight: 1.1,
                  }}
                >
                  {tier.price}
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      style={{
                        fontFamily: FONT_BODY,
                        fontSize: 13,
                        color: tier.highlight ? "#3a2800" : C.muted,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span style={{ color: tier.highlight ? C.bg : C.gold }}>—</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  style={{
                    width: "100%",
                    padding: "13px 0",
                    background: tier.highlight ? C.bg : "transparent",
                    border: `1px solid ${tier.highlight ? C.bg : C.gold}`,
                    color: tier.highlight ? C.gold : C.gold,
                    fontFamily: FONT_BODY,
                    fontSize: 12,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                >
                  {tier.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ACCORDION ──────────────────────────────────────────── */}
      <section
        style={{
          background: C.card,
          borderTop: `1px solid ${C.border}`,
          padding: "100px clamp(24px, 8vw, 120px)",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{
              fontFamily: FONT_BODY,
              fontSize: 11,
              letterSpacing: "0.2em",
              color: C.gold,
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Questions fréquentes
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontFamily: FONT_HEADING,
              fontSize: "clamp(2rem, 4vw, 2.8rem)",
              fontStyle: "italic",
              fontWeight: 300,
              color: C.cream,
              marginBottom: 48,
            }}
          >
            Tout ce que vous voulez savoir
          </motion.h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "none",
                    border: "none",
                    padding: "22px 0",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: 16,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_HEADING,
                      fontSize: "clamp(1rem, 2vw, 1.2rem)",
                      fontStyle: "italic",
                      fontWeight: 300,
                      color: C.cream,
                    }}
                  >
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      display: "block",
                      fontSize: 22,
                      color: C.gold,
                      flexShrink: 0,
                      lineHeight: 1,
                    }}
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
                      <p
                        style={{
                          fontFamily: FONT_BODY,
                          fontSize: 14,
                          lineHeight: 1.8,
                          color: C.muted,
                          paddingBottom: 24,
                        }}
                      >
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${C.border}` }} />
          </div>
        </div>
      </section>

      {/* ── 8. CTA BANNER ─────────────────────────────────────────────── */}
      <section
        style={{
          background: C.gold,
          padding: "100px clamp(24px, 8vw, 120px)",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: 11,
              letterSpacing: "0.22em",
              color: C.bg,
              textTransform: "uppercase",
              marginBottom: 16,
              opacity: 0.6,
            }}
          >
            Atelier Paris · Sur-Mesure
          </p>
          <h2
            style={{
              fontFamily: FONT_HEADING,
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontStyle: "italic",
              fontWeight: 300,
              color: C.bg,
              lineHeight: 1.05,
              marginBottom: 24,
            }}
          >
            Créer Votre Pièce Unique
          </h2>
          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: 16,
              color: "#3a2800",
              maxWidth: 440,
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}
          >
            Rencontrons-nous. En boutique rue de la Paix ou en visioconférence, nos créateurs donnent vie à votre bijou de rêve.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              style={{
                background: C.bg,
                border: "none",
                color: C.gold,
                fontFamily: FONT_BODY,
                fontSize: 13,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                padding: "16px 40px",
                cursor: "pointer",
              }}
            >
              Prendre rendez-vous
            </button>
            <button
              style={{
                background: "transparent",
                border: `1px solid ${C.bg}`,
                color: C.bg,
                fontFamily: FONT_BODY,
                fontSize: 13,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                padding: "16px 40px",
                cursor: "pointer",
              }}
            >
              Voir les collections
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── 9. FOOTER ─────────────────────────────────────────────────── */}
      <footer
        style={{
          background: C.bg,
          borderTop: `1px solid ${C.border}`,
          padding: "64px clamp(24px, 8vw, 120px) 40px",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 40, marginBottom: 60 }}>
            {/* Brand */}
            <div style={{ maxWidth: 260 }}>
              <div
                style={{
                  fontFamily: FONT_HEADING,
                  fontSize: 26,
                  fontStyle: "italic",
                  color: C.gold,
                  fontWeight: 300,
                  marginBottom: 12,
                }}
              >
                Orens
              </div>
              <p
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 13,
                  color: C.muted,
                  lineHeight: 1.7,
                  marginBottom: 20,
                }}
              >
                Joaillerie fine contemporaine. 14 rue de la Paix, Paris 2e. Ouvert du mardi au samedi, 10h–19h.
              </p>
              {/* Social icons */}
              <div style={{ display: "flex", gap: 14 }}>
                {/* Camera */}
                <a href="#" style={{ color: C.muted, cursor: "pointer", transition: "color 0.2s" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                {/* Bookmark */}
                <a href="#" style={{ color: C.muted, cursor: "pointer" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.23-5.19 1.23-5.19s-.31-.63-.31-1.56c0-1.47.85-2.56 1.91-2.56.9 0 1.34.68 1.34 1.49 0 .91-.58 2.27-.88 3.53-.25 1.05.53 1.91 1.56 1.91 1.88 0 3.13-2.4 3.13-5.23 0-2.15-1.45-3.76-4.09-3.76-2.98 0-4.82 2.22-4.82 4.7 0 .85.25 1.45.64 1.91.18.21.2.3.14.54-.05.17-.15.58-.19.74-.06.24-.25.32-.46.23-1.29-.53-1.9-1.95-1.9-3.55 0-2.64 2.23-5.81 6.65-5.81 3.56 0 5.9 2.58 5.9 5.36 0 3.67-2.04 6.43-5.01 6.43-.99 0-1.93-.54-2.25-1.14l-.62 2.41c-.22.86-.82 1.93-1.22 2.59.92.28 1.89.43 2.9.43 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                  </svg>
                </a>
                {/* Users2 */}
                <a href="#" style={{ color: C.muted, cursor: "pointer" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Links */}
            {[
              {
                heading: "Collections",
                links: ["Bagues", "Colliers", "Bracelets", "Boucles d'oreilles", "Parures"],
              },
              {
                heading: "Services",
                links: ["Fiançailles & Mariage", "Création sur-mesure", "Entretien & Gravure", "Transformation"],
              },
              {
                heading: "Orens",
                links: ["Notre histoire", "L'atelier Paris", "Presse", "Contact", "Livre d'or"],
              },
            ].map((col) => (
              <div key={col.heading}>
                <div
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 11,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: C.gold,
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
                        fontFamily: FONT_BODY,
                        fontSize: 13,
                        color: C.muted,
                        textDecoration: "none",
                        cursor: "pointer",
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
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.muted }}>
              © 2026 Orens Joaillerie. Tous droits réservés.
            </span>
            <div style={{ display: "flex", gap: 24 }}>
              {["Mentions légales", "CGV", "Politique de confidentialité"].map((l) => (
                <a
                  key={l}
                  href="#"
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 12,
                    color: C.muted,
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
