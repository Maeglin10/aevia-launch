"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"
import Link from "next/link"

const C = {
  bg: "#f8f4ec",
  bgCard: "#fffdf8",
  bgDark: "#0f1f3d",
  bgDarkAlt: "#162848",
  text: "#0f1f3d",
  textMuted: "#5a6a7e",
  textLight: "#f8f4ec",
  textGold: "#c4a96a",
  accent: "#c4a96a",
  accentDark: "#a08448",
  accentLight: "#e8d9b8",
  border: "#e0d5c0",
  borderDark: "#1e3360",
  headingFont: '"Cormorant Garamond", Georgia, serif',
  bodyFont: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  shadow: "0 4px 24px rgba(15,31,61,0.08)",
  shadowMd: "0 8px 40px rgba(15,31,61,0.12)",
  shadowLg: "0 20px 60px rgba(15,31,61,0.15)",
  radius: "2px",
  radiusMd: "4px",
}

const NAV_LINKS = [
  { label: "Chambres", href: "#chambres" },
  { label: "Gastronomie", href: "#gastronomie" },
  { label: "Spa", href: "#spa" },
  { label: "Événements", href: "#evenements" },
  { label: "À Propos", href: "#about" },
]

const STATS = [
  { value: 12, suffix: "", label: "Suites & Chambres", prefix: "" },
  { value: 4.9, suffix: "★", label: "Note Moyenne", prefix: "" },
  { value: 150, suffix: "+", label: "Ans d'Histoire", prefix: "" },
  { value: 3, suffix: "", label: "Restaurants Étoilés", prefix: "" },
]

const TABS = [
  {
    id: "chambres",
    label: "Chambres & Suites",
    icon: "🏛",
    heading: "Des Havres de Paix Raffinés",
    body: "Chacune de nos 12 suites et chambres a été conçue par des architectes d'intérieur parisiens renommés. Boiseries anciennes, marbres de Carrare et linge de maison brodé à la main composent un univers où le temps s'arrête. Chaque chambre offre une vue imprenable sur les toits de Paris ou sur nos jardins privés.",
    details: ["Literie de 600 fils", "Bain moussant sur commande", "Minibar premium cuisiné", "Service de chambre 24h/24"],
  },
  {
    id: "gastro",
    label: "Gastronomie",
    icon: "🍷",
    heading: "Une Cuisine d'Exception",
    body: "Notre chef triplement étoilé Thierry Marchand sublime les produits du terroir français dans une carte évoluant au fil des saisons. Du petit-déjeuner continental servi en chambre au dîner gastronomique dans notre salle voûtée du XVIIIe siècle, chaque repas devient un moment d'exception.",
    details: ["Breakfast continental inclus", "Cave de 800 références", "Menu dégustation 8 plats", "Cours de cuisine privés"],
  },
  {
    id: "spa",
    label: "Spa & Bien-être",
    icon: "✦",
    heading: "Le Temps de la Sérénité",
    body: "Notre spa de 600 m² au sous-sol voûté du XIXe siècle propose des soins exclusifs développés avec la Maison Dior. Hammam traditionnel, bassins de nage contrecourant, cabines de soins privatives doubles et salle de yoga donnant sur les jardins intérieurs constituent un sanctuaire du bien-être.",
    details: ["6 cabines de soins", "Hammam & sauna privatifs", "Piscine intérieure chauffée", "Soins Dior exclusifs"],
  },
  {
    id: "events",
    label: "Événements",
    icon: "◆",
    heading: "L'Excellence pour Vos Célébrations",
    body: "De l'intime dîner de fiançailles aux réceptions de 120 convives dans notre grande salle de bal haussmannienne, nous orchestrons chaque détail avec une précision absolue. Notre équipe dédiée aux événements travaille avec les meilleurs prestataires parisiens pour créer des souvenirs impérissables.",
    details: ["Grande Salle : 120 convives", "Salon Napoléon : 30 convives", "Jardin privatif : 80 convives", "Coordination complète incluse"],
  },
]

const TESTIMONIALS = [
  {
    name: "Isabelle Fontaine",
    role: "Directrice Artistique, Paris",
    text: "Le Grand Palais est l'adresse la plus secrète et la plus précieuse de Paris. J'y séjourne chaque fois que je veux retrouver cette sensation rare d'être au cœur de l'histoire tout en bénéficiant d'un confort absolu. Le personnel anticipe chaque désir avec une discrétion admirable.",
    rating: 5,
    stay: "Suite Prestige, Novembre 2025",
  },
  {
    name: "James & Catherine Whitmore",
    role: "Voyageurs, Londres",
    text: "Notre lune de miel au Grand Palais restera le plus beau souvenir de notre vie. Depuis le champagne de bienvenue jusqu'au petit-déjeuner servi dans notre suite avec vue sur les toits, chaque instant a été parfaitement orchestré. Le chef Marchand nous a même préparé un menu personnalisé.",
    rating: 5,
    stay: "Suite Impériale, Juin 2025",
  },
  {
    name: "Ahmed Al-Rashid",
    role: "Chef d'Entreprise, Dubaï",
    text: "J'ai séjourné dans les plus grands palaces du monde, de Tokyo à New York. Le Grand Palais occupe une place à part : c'est là que l'architecture haussmannienne, la gastronomie française et l'art de vivre parisien se conjuguent dans leur expression la plus pure. Je n'imagine plus séjourner ailleurs.",
    rating: 5,
    stay: "Suite Prestige, Mars 2025",
  },
  {
    name: "Marie-Claire Dubois",
    role: "Écrivaine, Lyon",
    text: "Je suis venue pour un week-end d'écriture et je suis repartie avec un roman entier dans la tête. Les jardins intérieurs, le silence feutré des couloirs, la lumière dorée qui filtre par les hautes fenêtres — tout ici invite à la contemplation et à la création. Un lieu magique.",
    rating: 5,
    stay: "Chambre Classique, Janvier 2026",
  },
]

const PRICING = [
  {
    name: "Chambre Classique",
    price: "450",
    period: "/ nuit",
    description: "L'élégance parisienne dans sa forme la plus pure",
    features: [
      "Chambre de 32 m²",
      "Vue sur jardins ou cour intérieure",
      "Petit-déjeuner continental inclus",
      "Accès Spa (2h/jour)",
      "Conciergerie 24h/24",
      "WiFi haut débit",
    ],
    highlight: false,
    cta: "Réserver",
  },
  {
    name: "Suite Prestige",
    price: "890",
    period: "/ nuit",
    description: "Notre suite signature avec salon séparé",
    features: [
      "Suite de 65 m² avec salon",
      "Vue panoramique sur les toits",
      "Petit-déjeuner en suite inclus",
      "Accès Spa illimité",
      "Butler personnel dédié",
      "Transfert aéroport inclus",
      "Champagne de bienvenue",
    ],
    highlight: true,
    cta: "Réserver la Suite",
  },
  {
    name: "Suite Impériale",
    price: "1 800",
    period: "/ nuit",
    description: "L'expérience ultime de l'art de vivre parisien",
    features: [
      "Suite de 120 m² sur 2 niveaux",
      "Terrasse privée avec vue 360°",
      "Chef privé sur demande",
      "Spa privatif inclus",
      "Rolls-Royce à disposition",
      "Personal shopper inclus",
      "Tous repas inclus",
    ],
    highlight: false,
    cta: "Contacter",
  },
]

const FAQS = [
  {
    q: "Quels sont les horaires d'arrivée et de départ ?",
    a: "L'arrivée est prévue à partir de 15h00 et le départ avant 12h00. Nous proposons le check-in anticipé et le late check-out sous réserve de disponibilité, souvent sans supplément pour nos hôtes réguliers. Vos bagages peuvent être déposés dès votre arrivée quel que soit l'horaire.",
  },
  {
    q: "Y a-t-il un parking disponible à l'hôtel ?",
    a: "Nous disposons d'un parking privé sécurisé avec service voiturier, accessible 24h/24. Le tarif est de 45€ par nuit. Nous proposons également un service de transfert depuis les aéroports Charles de Gaulle et Orly avec nos véhicules de prestige. La réservation est conseillée.",
  },
  {
    q: "Comment réserver une table au restaurant gastronomique ?",
    a: "La réservation au Restaurant Marchand est vivement recommandée, idéalement 3 à 4 semaines à l'avance pour les dîners du week-end. En tant que client de l'hôtel, vous bénéficiez d'une priorité de réservation et d'une table avec vue privilégiée. Notre conciergerie se charge de tout.",
  },
  {
    q: "Les animaux de compagnie sont-ils acceptés ?",
    a: "Le Grand Palais accueille avec plaisir les animaux de compagnie de petite taille (moins de 8 kg) dans les chambres classiques. Un supplément de 35€ par nuit s'applique. Nous mettons à disposition gamelles, coussins et une sélection de friandises gourmandes. Les animaux ne sont pas admis dans les espaces de restauration.",
  },
  {
    q: "Quelle est votre politique d'annulation ?",
    a: "L'annulation est gratuite jusqu'à 72 heures avant l'arrivée pour les chambres classiques, et jusqu'à 7 jours pour les suites. Au-delà, une nuit sera facturée. Pour les séjours de plus de 3 nuits ou les événements privatisés, des conditions spécifiques s'appliquent, précisées lors de la réservation.",
  },
  {
    q: "Proposez-vous des offres spéciales et des forfaits romantiques ?",
    a: "Nous créons régulièrement des forfaits sur mesure : weekends romantiques avec dîner aux chandelles et soins en duo, escapades gastronomiques incluant des cours de cuisine privés, ou séjours culturels avec visites privées des musées parisiens. Contactez notre équipe pour un devis personnalisé.",
  },
]

function useCounter(target: number, inView: boolean, duration = 1800) {
  const [count, setCount] = useState(0)
  const isDecimal = target % 1 !== 0

  const prev = useRef(false)
  if (inView && !prev.current) {
    prev.current = true
    const steps = 60
    const increment = target / steps
    let current = 0
    let step = 0
    const timer = setInterval(() => {
      step++
      current = Math.min(increment * step, target)
      setCount(parseFloat(current.toFixed(isDecimal ? 1 : 0)))
      if (step >= steps) clearInterval(timer)
    }, duration / steps)
  }

  return count
}

function StatItem({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const count = useCounter(stat.value, inView)

  return (
    <motion.div
      ref={ref}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      style={{
        textAlign: "center",
        padding: "0 32px",
        borderRight: index < STATS.length - 1 ? `1px solid ${C.accentLight}` : "none",
      }}
    >
      <div
        style={{
          fontFamily: C.headingFont,
          fontSize: "clamp(2.4rem, 5vw, 3.4rem)",
          fontStyle: "italic",
          fontWeight: 600,
          color: C.accent,
          lineHeight: 1,
          letterSpacing: "-0.01em",
        }}
      >
        {stat.prefix}{count}{stat.suffix}
      </div>
      <div
        style={{
          fontFamily: C.bodyFont,
          fontSize: "0.82rem",
          color: C.textMuted,
          marginTop: "8px",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          fontWeight: 500,
        }}
      >
        {stat.label}
      </div>
    </motion.div>
  )
}

export default function Page() {
  const { scrollY } = useScroll()
  const heroTextY = useTransform(scrollY, [0, 600], [0, -60])
  const cardsY = useTransform(scrollY, [0, 600], [0, 40])

  const [activeTab, setActiveTab] = useState(0)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const featuresRef = useRef(null)
  const pricingRef = useRef(null)
  const ctaRef = useRef(null)
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" })
  const pricingInView = useInView(pricingRef, { once: true, margin: "-100px" })
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" })

  const prevTestimonial = () =>
    setActiveTestimonial((p) => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  const nextTestimonial = () =>
    setActiveTestimonial((p) => (p + 1) % TESTIMONIALS.length)

  if (typeof window !== "undefined") {
    window.onscroll = () => setScrolled(window.scrollY > 40)
  }

  const ROOM_CARDS = [
    { label: "Suite Prestige", detail: "65 m² • Vue toits de Paris", color: "#1a2e55", rotation: "-3deg" },
    { label: "Suite Impériale", detail: "120 m² • Terrasse privée", color: "#0f1f3d", rotation: "0deg" },
    { label: "Chambre Classique", detail: "32 m² • Jardins intérieurs", color: "#2a3f6e", rotation: "3deg" },
  ]

  return (
    <div style={{ background: C.bg, fontFamily: C.bodyFont, color: C.text, minHeight: "100vh" }}>

      {/* ── NAVBAR ── */}
      <motion.nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: scrolled ? "12px 48px" : "22px 48px",
          background: scrolled ? "rgba(248,244,236,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "none",
          transition: "all 0.35s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontFamily: C.headingFont,
            fontSize: "1.5rem",
            fontStyle: "italic",
            fontWeight: 600,
            color: scrolled ? C.text : C.textLight,
            letterSpacing: "0.04em",
          }}
        >
          Grand Palais
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "36px" }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: C.bodyFont,
                fontSize: "0.82rem",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: scrolled ? C.textMuted : "rgba(248,244,236,0.85)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="#reservation"
            style={{
              fontFamily: C.bodyFont,
              fontSize: "0.78rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: C.bgDark,
              background: C.accent,
              padding: "10px 22px",
              textDecoration: "none",
              transition: "background 0.2s",
              cursor: "pointer",
            }}
          >
            Réserver
          </a>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section
        id="hero"
        style={{
          minHeight: "100vh",
          background: `linear-gradient(135deg, ${C.bgDark} 0%, #1a2f55 60%, #0a1628 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 6vw",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 60% 50%, rgba(196,169,106,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        {/* Gold line accent */}
        <div
          style={{
            position: "absolute",
            left: "6vw",
            top: "50%",
            transform: "translateY(-50%)",
            width: "2px",
            height: "140px",
            background: `linear-gradient(to bottom, transparent, ${C.accent}, transparent)`,
          }}
        />

        {/* LEFT: Hero text */}
        <motion.div
          style={{ y: heroTextY, flex: "0 0 auto", maxWidth: "520px", paddingLeft: "32px" }}
        >
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              fontFamily: C.bodyFont,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              color: C.accent,
              marginBottom: "24px",
              fontWeight: 500,
            }}
          >
            Palace — Paris · Since 1872
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{
              fontFamily: C.headingFont,
              fontSize: "clamp(3rem, 7vw, 5.5rem)",
              fontStyle: "italic",
              fontWeight: 600,
              color: C.textLight,
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              margin: "0 0 20px",
            }}
          >
            L'Art de<br />l'Accueil
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            style={{
              fontFamily: C.bodyFont,
              fontSize: "1.05rem",
              color: "rgba(248,244,236,0.7)",
              lineHeight: 1.7,
              marginBottom: "40px",
              maxWidth: "420px",
            }}
          >
            Au cœur du 8e arrondissement, le Grand Palais incarne 150 ans d'hospitalité parisienne raffinée, entre tradition haussmannienne et luxe contemporain.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            style={{ display: "flex", gap: "16px", alignItems: "center" }}
          >
            <a
              href="#reservation"
              style={{
                fontFamily: C.bodyFont,
                fontSize: "0.82rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: C.bgDark,
                background: C.accent,
                padding: "16px 36px",
                textDecoration: "none",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Réservez Votre Séjour
            </a>
            <a
              href="#chambres"
              style={{
                fontFamily: C.bodyFont,
                fontSize: "0.82rem",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "rgba(248,244,236,0.75)",
                textDecoration: "none",
                cursor: "pointer",
                borderBottom: `1px solid rgba(196,169,106,0.4)`,
                paddingBottom: "2px",
              }}
            >
              Découvrir les Chambres
            </a>
          </motion.div>
        </motion.div>

        {/* RIGHT: Stacked room cards */}
        <motion.div
          style={{
            y: cardsY,
            flex: "0 0 auto",
            position: "relative",
            width: "320px",
            height: "420px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {ROOM_CARDS.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 30, rotate: card.rotation }}
              animate={{ opacity: 1, y: 0, rotate: card.rotation }}
              transition={{ duration: 0.9, delay: 0.5 + i * 0.15 }}
              style={{
                position: "absolute",
                width: "260px",
                background: card.color,
                border: `1px solid rgba(196,169,106,0.25)`,
                padding: "28px 24px",
                top: `${i * 60}px`,
                boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
                transform: `rotate(${card.rotation})`,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "80px",
                  background: `linear-gradient(135deg, rgba(196,169,106,0.15), rgba(196,169,106,0.05))`,
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    border: `1px solid ${C.accent}`,
                    transform: "rotate(45deg)",
                    opacity: 0.6,
                  }}
                />
              </div>
              <div
                style={{
                  fontFamily: C.headingFont,
                  fontSize: "1.15rem",
                  fontStyle: "italic",
                  color: C.textLight,
                  marginBottom: "6px",
                }}
              >
                {card.label}
              </div>
              <div
                style={{
                  fontFamily: C.bodyFont,
                  fontSize: "0.75rem",
                  color: C.accent,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {card.detail}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
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
          <div
            style={{
              fontFamily: C.bodyFont,
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "rgba(248,244,236,0.45)",
            }}
          >
            Découvrir
          </div>
          <div
            style={{
              width: "1px",
              height: "36px",
              background: `linear-gradient(to bottom, ${C.accent}, transparent)`,
            }}
          />
        </motion.div>
      </section>

      {/* ── STATS BAR ── */}
      <section
        style={{
          background: C.bgCard,
          padding: "56px 0",
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0",
          }}
        >
          {STATS.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </section>

      {/* ── FEATURES / TABS ── */}
      <section
        ref={featuresRef}
        id="chambres"
        style={{ padding: "100px 6vw", maxWidth: "1200px", margin: "0 auto" }}
      >
        <motion.div
          animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "64px" }}
        >
          <p
            style={{
              fontFamily: C.bodyFont,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              color: C.accent,
              marginBottom: "16px",
              fontWeight: 500,
            }}
          >
            Nos Services
          </p>
          <h2
            style={{
              fontFamily: C.headingFont,
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              fontStyle: "italic",
              fontWeight: 600,
              color: C.text,
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Une Expérience Totale
          </h2>
        </motion.div>

        {/* Tab selectors */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0",
            marginBottom: "56px",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(i)}
              style={{
                fontFamily: C.bodyFont,
                fontSize: "0.8rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: activeTab === i ? C.accent : C.textMuted,
                background: "none",
                border: "none",
                padding: "14px 28px",
                cursor: "pointer",
                borderBottom: activeTab === i ? `2px solid ${C.accent}` : "2px solid transparent",
                transition: "all 0.2s",
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
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.38 }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "64px",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: C.bodyFont,
                  fontSize: "2.5rem",
                  marginBottom: "24px",
                  opacity: 0.8,
                }}
              >
                {TABS[activeTab].icon}
              </div>
              <h3
                style={{
                  fontFamily: C.headingFont,
                  fontSize: "2.2rem",
                  fontStyle: "italic",
                  fontWeight: 600,
                  color: C.text,
                  margin: "0 0 20px",
                  lineHeight: 1.15,
                }}
              >
                {TABS[activeTab].heading}
              </h3>
              <p
                style={{
                  fontFamily: C.bodyFont,
                  fontSize: "1rem",
                  color: C.textMuted,
                  lineHeight: 1.75,
                  margin: "0 0 32px",
                }}
              >
                {TABS[activeTab].body}
              </p>
              <a
                href="#reservation"
                style={{
                  fontFamily: C.bodyFont,
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: C.bgDark,
                  background: C.accent,
                  padding: "13px 28px",
                  textDecoration: "none",
                  cursor: "pointer",
                  display: "inline-block",
                }}
              >
                En Savoir Plus
              </a>
            </div>

            <div
              style={{
                background: C.bgDark,
                padding: "40px",
                borderLeft: `3px solid ${C.accent}`,
              }}
            >
              <p
                style={{
                  fontFamily: C.bodyFont,
                  fontSize: "0.72rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: C.accent,
                  marginBottom: "28px",
                  fontWeight: 600,
                }}
              >
                Inclus dans votre séjour
              </p>
              {TABS[activeTab].details.map((detail, i) => (
                <motion.div
                  key={detail}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.08 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "14px 0",
                    borderBottom: i < TABS[activeTab].details.length - 1 ? `1px solid ${C.borderDark}` : "none",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      background: C.accent,
                      flexShrink: 0,
                      transform: "rotate(45deg)",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: C.bodyFont,
                      fontSize: "0.9rem",
                      color: "rgba(248,244,236,0.85)",
                    }}
                  >
                    {detail}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section
        style={{
          background: C.bgDark,
          padding: "100px 6vw",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(196,169,106,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              fontFamily: C.bodyFont,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              color: C.accent,
              marginBottom: "16px",
              fontWeight: 500,
            }}
          >
            Témoignages
          </p>
          <h2
            style={{
              fontFamily: C.headingFont,
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontStyle: "italic",
              fontWeight: 600,
              color: C.textLight,
              margin: "0 0 64px",
              lineHeight: 1.1,
            }}
          >
            Ce Que Disent Nos Hôtes
          </h2>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.45 }}
              style={{
                background: C.bgDarkAlt,
                padding: "52px 56px",
                borderLeft: `3px solid ${C.accent}`,
                textAlign: "left",
                marginBottom: "48px",
              }}
            >
              <div style={{ marginBottom: "24px" }}>
                {Array.from({ length: TESTIMONIALS[activeTestimonial].rating }).map((_, i) => (
                  <span key={i} style={{ color: C.accent, fontSize: "1.1rem", marginRight: "3px" }}>★</span>
                ))}
              </div>
              <blockquote
                style={{
                  fontFamily: C.headingFont,
                  fontSize: "clamp(1.1rem, 2.5vw, 1.45rem)",
                  fontStyle: "italic",
                  color: "rgba(248,244,236,0.9)",
                  lineHeight: 1.65,
                  margin: "0 0 36px",
                  quotes: "none",
                }}
              >
                "{TESTIMONIALS[activeTestimonial].text}"
              </blockquote>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div
                    style={{
                      fontFamily: C.bodyFont,
                      fontWeight: 600,
                      fontSize: "0.92rem",
                      color: C.textLight,
                      marginBottom: "4px",
                    }}
                  >
                    {TESTIMONIALS[activeTestimonial].name}
                  </div>
                  <div
                    style={{
                      fontFamily: C.bodyFont,
                      fontSize: "0.8rem",
                      color: "rgba(248,244,236,0.5)",
                    }}
                  >
                    {TESTIMONIALS[activeTestimonial].role}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: C.bodyFont,
                    fontSize: "0.72rem",
                    color: C.accent,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    textAlign: "right",
                  }}
                >
                  {TESTIMONIALS[activeTestimonial].stay}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "24px" }}>
            <button
              onClick={prevTestimonial}
              style={{
                width: "44px",
                height: "44px",
                background: "none",
                border: `1px solid rgba(196,169,106,0.4)`,
                color: C.accent,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                transition: "all 0.2s",
              }}
            >
              ←
            </button>
            <div style={{ display: "flex", gap: "10px" }}>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  style={{
                    width: i === activeTestimonial ? "28px" : "8px",
                    height: "8px",
                    background: i === activeTestimonial ? C.accent : "rgba(196,169,106,0.3)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    padding: 0,
                  }}
                />
              ))}
            </div>
            <button
              onClick={nextTestimonial}
              style={{
                width: "44px",
                height: "44px",
                background: "none",
                border: `1px solid rgba(196,169,106,0.4)`,
                color: C.accent,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                transition: "all 0.2s",
              }}
            >
              →
            </button>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section
        ref={pricingRef}
        id="reservation"
        style={{ padding: "100px 6vw", background: C.bg }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.div
            animate={pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7 }}
            style={{ textAlign: "center", marginBottom: "64px" }}
          >
            <p
              style={{
                fontFamily: C.bodyFont,
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                color: C.accent,
                marginBottom: "16px",
                fontWeight: 500,
              }}
            >
              Tarifs
            </p>
            <h2
              style={{
                fontFamily: C.headingFont,
                fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
                fontStyle: "italic",
                fontWeight: 600,
                color: C.text,
                margin: "0 0 16px",
                lineHeight: 1.1,
              }}
            >
              Nos Hébergements
            </h2>
            <p
              style={{
                fontFamily: C.bodyFont,
                fontSize: "0.95rem",
                color: C.textMuted,
                maxWidth: "480px",
                margin: "0 auto",
              }}
            >
              Tarifs par nuit, petit-déjeuner continental inclus. À partir de 2 nuits en semaine.
            </p>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "24px",
              alignItems: "start",
            }}
          >
            {PRICING.map((plan, i) => (
              <motion.div
                key={plan.name}
                animate={pricingInView ? { opacity: 1, y: 0, scale: plan.highlight ? 1.03 : 1 } : { opacity: 0, y: 30, scale: 1 }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                style={{
                  background: plan.highlight ? C.bgDark : C.bgCard,
                  border: plan.highlight ? `2px solid ${C.accent}` : `1px solid ${C.border}`,
                  padding: "44px 36px",
                  position: "relative",
                  boxShadow: plan.highlight ? C.shadowLg : C.shadow,
                }}
              >
                {plan.highlight && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-14px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: C.accent,
                      color: C.bgDark,
                      fontFamily: C.bodyFont,
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      padding: "5px 18px",
                    }}
                  >
                    Le Plus Populaire
                  </div>
                )}

                <div
                  style={{
                    fontFamily: C.bodyFont,
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    color: C.accent,
                    marginBottom: "12px",
                    fontWeight: 600,
                  }}
                >
                  {plan.name}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "10px" }}>
                  <span
                    style={{
                      fontFamily: C.headingFont,
                      fontSize: "3rem",
                      fontStyle: "italic",
                      fontWeight: 600,
                      color: plan.highlight ? C.textLight : C.text,
                      lineHeight: 1,
                    }}
                  >
                    {plan.price}€
                  </span>
                  <span
                    style={{
                      fontFamily: C.bodyFont,
                      fontSize: "0.85rem",
                      color: plan.highlight ? "rgba(248,244,236,0.5)" : C.textMuted,
                    }}
                  >
                    {plan.period}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: C.bodyFont,
                    fontSize: "0.88rem",
                    color: plan.highlight ? "rgba(248,244,236,0.65)" : C.textMuted,
                    marginBottom: "32px",
                    lineHeight: 1.5,
                  }}
                >
                  {plan.description}
                </p>

                <div style={{ marginBottom: "36px" }}>
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 0",
                        borderBottom: `1px solid ${plan.highlight ? C.borderDark : C.border}`,
                      }}
                    >
                      <div
                        style={{
                          width: "5px",
                          height: "5px",
                          background: C.accent,
                          flexShrink: 0,
                          transform: "rotate(45deg)",
                        }}
                      />
                      <span
                        style={{
                          fontFamily: C.bodyFont,
                          fontSize: "0.87rem",
                          color: plan.highlight ? "rgba(248,244,236,0.82)" : C.text,
                        }}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: plan.highlight ? C.accent : "transparent",
                    border: plan.highlight ? "none" : `1px solid ${C.accent}`,
                    color: plan.highlight ? C.bgDark : C.accent,
                    fontFamily: C.bodyFont,
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "100px 6vw", background: C.bgCard }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <p
              style={{
                fontFamily: C.bodyFont,
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                color: C.accent,
                marginBottom: "16px",
                fontWeight: 500,
              }}
            >
              Questions Fréquentes
            </p>
            <h2
              style={{
                fontFamily: C.headingFont,
                fontSize: "clamp(2rem, 5vw, 3.4rem)",
                fontStyle: "italic",
                fontWeight: 600,
                color: C.text,
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Tout Ce Qu'il Faut Savoir
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                style={{
                  borderBottom: `1px solid ${C.border}`,
                  borderTop: i === 0 ? `1px solid ${C.border}` : "none",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "24px 0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: "20px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: C.headingFont,
                      fontSize: "1.2rem",
                      fontStyle: "italic",
                      fontWeight: 600,
                      color: openFaq === i ? C.accent : C.text,
                      lineHeight: 1.3,
                      transition: "color 0.2s",
                    }}
                  >
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      width: "24px",
                      height: "24px",
                      border: `1px solid ${openFaq === i ? C.accent : C.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: openFaq === i ? C.accent : C.textMuted,
                      fontSize: "1rem",
                      lineHeight: 1,
                      transition: "border-color 0.2s, color 0.2s",
                    }}
                  >
                    +
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
                          fontFamily: C.bodyFont,
                          fontSize: "0.95rem",
                          color: C.textMuted,
                          lineHeight: 1.75,
                          paddingBottom: "24px",
                          margin: 0,
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

      {/* ── CTA BANNER ── */}
      <section
        ref={ctaRef}
        style={{
          background: `linear-gradient(135deg, ${C.bgDark} 0%, #1a2f55 100%)`,
          padding: "100px 6vw",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(196,169,106,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "1px",
            height: "60px",
            background: `linear-gradient(to bottom, transparent, ${C.accent})`,
          }}
        />
        <motion.div
          animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          style={{ position: "relative", maxWidth: "680px", margin: "0 auto" }}
        >
          <p
            style={{
              fontFamily: C.bodyFont,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              color: C.accent,
              marginBottom: "24px",
              fontWeight: 500,
            }}
          >
            Disponibilités
          </p>
          <h2
            style={{
              fontFamily: C.headingFont,
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontStyle: "italic",
              fontWeight: 600,
              color: C.textLight,
              margin: "0 0 20px",
              lineHeight: 1.05,
            }}
          >
            Réservez Votre Séjour
          </h2>
          <p
            style={{
              fontFamily: C.bodyFont,
              fontSize: "1.05rem",
              color: "rgba(248,244,236,0.65)",
              lineHeight: 1.7,
              marginBottom: "48px",
              maxWidth: "480px",
              margin: "0 auto 48px",
            }}
          >
            Contactez notre équipe de conciergerie pour créer votre séjour sur mesure. Chaque visite au Grand Palais est unique.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="tel:+33142654545"
              style={{
                fontFamily: C.bodyFont,
                fontSize: "0.82rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                color: C.bgDark,
                background: C.accent,
                padding: "18px 44px",
                textDecoration: "none",
                cursor: "pointer",
                display: "inline-block",
                transition: "all 0.2s",
              }}
            >
              +33 1 42 65 45 45
            </a>
            <a
              href="mailto:reservations@grandpalais-paris.fr"
              style={{
                fontFamily: C.bodyFont,
                fontSize: "0.82rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: C.textLight,
                background: "transparent",
                border: `1px solid rgba(248,244,236,0.3)`,
                padding: "18px 44px",
                textDecoration: "none",
                cursor: "pointer",
                display: "inline-block",
                transition: "all 0.2s",
              }}
            >
              Envoyer un Message
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: "#070e1c",
          padding: "72px 6vw 40px",
          color: "rgba(248,244,236,0.5)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: "48px",
              marginBottom: "64px",
            }}
          >
            {/* Brand */}
            <div>
              <div
                style={{
                  fontFamily: C.headingFont,
                  fontSize: "1.8rem",
                  fontStyle: "italic",
                  fontWeight: 600,
                  color: C.textLight,
                  marginBottom: "16px",
                }}
              >
                Grand Palais
              </div>
              <p
                style={{
                  fontFamily: C.bodyFont,
                  fontSize: "0.88rem",
                  lineHeight: 1.7,
                  color: "rgba(248,244,236,0.45)",
                  marginBottom: "28px",
                  maxWidth: "280px",
                }}
              >
                8 Avenue Montaigne, 75008 Paris<br />
                Depuis 1872, l'art de recevoir à la parisienne.
              </p>
              <div style={{ display: "flex", gap: "16px" }}>
                {/* Camera */}
                <a href="#" style={{ color: "rgba(248,244,236,0.4)", transition: "color 0.2s", cursor: "pointer" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                {/* Users2 */}
                <a href="#" style={{ color: "rgba(248,244,236,0.4)", transition: "color 0.2s", cursor: "pointer" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                {/* TripAdvisor owl icon */}
                <a href="#" style={{ color: "rgba(248,244,236,0.4)", transition: "color 0.2s", cursor: "pointer" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm4 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
                    <path d="M6 8c1.5-1.5 3-2 6-2s4.5.5 6 2" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Hébergement */}
            <div>
              <h4
                style={{
                  fontFamily: C.bodyFont,
                  fontSize: "0.72rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: C.accent,
                  marginBottom: "20px",
                  fontWeight: 600,
                }}
              >
                Hébergement
              </h4>
              {["Chambres Classiques", "Suites Prestige", "Suite Impériale", "Offres Spéciales", "Cadeaux & Bons"].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    display: "block",
                    fontFamily: C.bodyFont,
                    fontSize: "0.87rem",
                    color: "rgba(248,244,236,0.5)",
                    textDecoration: "none",
                    marginBottom: "12px",
                    transition: "color 0.2s",
                    cursor: "pointer",
                  }}
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Expériences */}
            <div>
              <h4
                style={{
                  fontFamily: C.bodyFont,
                  fontSize: "0.72rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: C.accent,
                  marginBottom: "20px",
                  fontWeight: 600,
                }}
              >
                Expériences
              </h4>
              {["Restaurant Marchand", "Bar Le Napoléon", "Spa & Bien-être", "Privatisation", "Séminaires"].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    display: "block",
                    fontFamily: C.bodyFont,
                    fontSize: "0.87rem",
                    color: "rgba(248,244,236,0.5)",
                    textDecoration: "none",
                    marginBottom: "12px",
                    transition: "color 0.2s",
                    cursor: "pointer",
                  }}
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Informations */}
            <div>
              <h4
                style={{
                  fontFamily: C.bodyFont,
                  fontSize: "0.72rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: C.accent,
                  marginBottom: "20px",
                  fontWeight: 600,
                }}
              >
                Informations
              </h4>
              {["À Propos", "Actualités", "Presse", "Mentions Légales", "Contact"].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    display: "block",
                    fontFamily: C.bodyFont,
                    fontSize: "0.87rem",
                    color: "rgba(248,244,236,0.5)",
                    textDecoration: "none",
                    marginBottom: "12px",
                    transition: "color 0.2s",
                    cursor: "pointer",
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(248,244,236,0.08)",
              paddingTop: "32px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <p
              style={{
                fontFamily: C.bodyFont,
                fontSize: "0.8rem",
                color: "rgba(248,244,236,0.3)",
                margin: 0,
              }}
            >
              © 2026 Grand Palais Paris. Tous droits réservés.
            </p>
            <div style={{ display: "flex", gap: "28px" }}>
              {["Confidentialité", "CGV", "Cookies"].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    fontFamily: C.bodyFont,
                    fontSize: "0.78rem",
                    color: "rgba(248,244,236,0.3)",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
