"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"
import Link from "next/link"

const C = {
  bg: "#f8f9ff",
  bgCard: "#ffffff",
  bgDark: "#4c1d95",
  bgDarkDeep: "#3b1278",
  bgAccent: "#7c3aed",
  bgAccentLight: "#ede9fe",
  bgAccentLighter: "#f5f3ff",
  text: "#1e1b4b",
  textMuted: "#6b7280",
  textLight: "#ffffff",
  textAccent: "#7c3aed",
  accent: "#7c3aed",
  accentBright: "#8b5cf6",
  accentDark: "#4c1d95",
  border: "#e5e7eb",
  borderAccent: "#ddd6fe",
  bodyFont: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  shadow: "0 2px 16px rgba(124,58,237,0.08)",
  shadowMd: "0 8px 32px rgba(124,58,237,0.12)",
  shadowLg: "0 20px 60px rgba(124,58,237,0.18)",
  radius: "8px",
  radiusMd: "12px",
  radiusLg: "16px",
}

const NAV_LINKS = [
  { label: "Cours", href: "#courses" },
  { label: "Instructeurs", href: "#instructeurs" },
  { label: "Tarifs", href: "#tarifs" },
  { label: "Entreprises", href: "#entreprises" },
  { label: "Blog", href: "#blog" },
]

const STATS = [
  { value: 50000, suffix: "+", label: "Apprenants Actifs", prefix: "" },
  { value: 200, suffix: "+", label: "Cours Disponibles", prefix: "" },
  { value: 95, suffix: "%", label: "Taux de Complétion", prefix: "" },
  { value: 4.8, suffix: "★", label: "Satisfaction Moyenne", prefix: "" },
]

const TABS = [
  {
    id: "web",
    label: "Développement Web",
    badge: "87 cours",
    color: "#2563eb",
    heading: "Devenez Développeur Full-Stack",
    body: "De HTML/CSS aux frameworks modernes comme React, Vue et Next.js, notre parcours complet vous mène du débutant absolu au développeur employable en 6 à 9 mois. Projets pratiques, code reviews par des pros en activité et certification reconnue par nos 400 entreprises partenaires.",
    courses: ["React & Next.js — Maîtrise complète", "Node.js & API REST", "TypeScript avancé", "DevOps & Déploiement CI/CD"],
    instructors: "12 instructeurs · Mise à jour mensuelle",
  },
  {
    id: "design",
    label: "Design UX",
    badge: "54 cours",
    color: "#db2777",
    heading: "Concevez des Expériences Mémorables",
    body: "Research utilisateur, wireframing, prototypage Figma et design system — apprenez à penser et à travailler comme un designer senior. Nos projets s'inspirent de cas réels confiés par des startups et grandes entreprises qui recrutent ensuite nos meilleurs diplômés.",
    courses: ["UX Research & Tests utilisateurs", "Figma — du sketch au prototype", "Design System & Tokens", "Design Mobile iOS & Android"],
    instructors: "8 instructeurs · Mise à jour trimestrielle",
  },
  {
    id: "data",
    label: "Data & IA",
    badge: "63 cours",
    color: "#059669",
    heading: "Pilotez la Révolution des Données",
    body: "Python, Machine Learning, LLMs et déploiement de modèles — la filière la plus demandée du marché. Nos instructeurs travaillent chez Google, Mistral et BNP Paribas. Chaque cours est construit autour de datasets réels et de projets capstone valorisables sur votre portfolio.",
    courses: ["Python pour la Data Science", "Machine Learning avec Scikit-learn", "LLMs & Prompt Engineering", "MLOps & mise en production"],
    instructors: "10 instructeurs · Mise à jour mensuelle",
  },
  {
    id: "marketing",
    label: "Marketing Digital",
    badge: "41 cours",
    color: "#d97706",
    heading: "Construisez des Stratégies qui Convertissent",
    body: "SEO, Google Ads, Meta Ads, email marketing et analytics — maîtrisez l'ensemble du tunnel d'acquisition digital. Les cours incluent des accès à des comptes sandbox publicitaires et des budgets d'entraînement réels pour pratiquer sans risque avec de vraies campagnes.",
    courses: ["SEO Technique & Sémantique", "Google Ads & Performance Max", "Email Marketing & Automation", "Analytics GA4 & Data Studio"],
    instructors: "9 instructeurs · Mise à jour bimensuelle",
  },
]

const TESTIMONIALS = [
  {
    name: "Karim Benali",
    role: "Développeur Front-End chez Doctolib",
    before: "Comptable pendant 8 ans",
    text: "J'avais 37 ans et je voulais tout changer. En 8 mois sur EduPath, j'ai appris React, TypeScript et Next.js. Mon portfolio GitHub a convaincu Doctolib lors du premier entretien. Mon salaire a augmenté de 40%. C'est le meilleur investissement de ma carrière.",
    rating: 5,
    course: "Parcours Développement Web Full-Stack",
  },
  {
    name: "Sophie Mercier",
    role: "UX Lead chez BlaBlaCar",
    before: "Graphiste en agence",
    text: "Je faisais du graphisme depuis 10 ans mais je voulais passer côté produit. Le cursus UX d'EduPath est extrêmement rigoureux — les projets sont des vrais briefs d'entreprises. Trois mois après ma certification, BlaBlaCar m'a recrutée pour restructurer toute leur app mobile.",
    rating: 5,
    course: "Parcours UX Design Complet",
  },
  {
    name: "Thomas Girard",
    role: "Data Scientist chez Société Générale",
    before: "Ingénieur industriel",
    text: "La qualité pédagogique est sans égal. Les instructeurs sont des praticiens, pas des théoriciens. Le cours MLOps m'a permis d'amener directement un projet de détection de fraude en production chez mon employeur actuel. J'ai été promu dans les 6 mois suivant ma certification.",
    rating: 5,
    course: "Parcours Data Science & IA",
  },
  {
    name: "Amina Traoré",
    role: "Responsable Marketing Digital, Freelance",
    before: "Chargée de communication print",
    text: "J'hésitais entre plusieurs plateformes. EduPath se distingue par le suivi humain — chaque apprenant a un mentor accessible. J'ai lancé mon activité freelance avec les techniques apprises dans le cours Google Ads. Mes premiers clients sont arrivés avant même que j'obtienne ma certification.",
    rating: 5,
    course: "Parcours Marketing Digital",
  },
]

const PRICING = [
  {
    name: "Gratuit",
    price: "0",
    period: "",
    badge: null,
    description: "Pour explorer et commencer à apprendre sans engagement",
    features: [
      "3 cours complets offerts",
      "Accès aux cours d'introduction",
      "Exercices pratiques inclus",
      "Forum communautaire",
      "Certificat de complétion",
    ],
    notIncluded: ["Mentor personnel", "Accès hors ligne", "Cours premium"],
    highlight: false,
    cta: "Commencer Gratuitement",
    ctaStyle: "outline",
  },
  {
    name: "Pro",
    price: "29",
    period: "/mois",
    badge: "Le plus populaire",
    description: "Accès illimité à tout le catalogue pour les apprenants individuels",
    features: [
      "200+ cours en accès illimité",
      "Nouveaux cours chaque mois",
      "Certificats reconnus par 400 entreprises",
      "Accès hors ligne (app mobile)",
      "Mentor communautaire",
      "Projets corrigés par des pros",
      "Support prioritaire 7j/7",
    ],
    notIncluded: [],
    highlight: true,
    cta: "Démarrer l'Essai Gratuit",
    ctaStyle: "filled",
  },
  {
    name: "Teams",
    price: "89",
    period: "/utilisateur/mois",
    badge: null,
    description: "Pour former vos équipes avec reporting et administration",
    features: [
      "Tout le plan Pro",
      "Tableau de bord RH & suivi",
      "Parcours personnalisés par équipe",
      "Facturation unifiée",
      "Customer Success Manager dédié",
      "SSO & intégration HRIS",
    ],
    notIncluded: [],
    highlight: false,
    cta: "Contacter les Ventes",
    ctaStyle: "outline",
  },
]

const FAQS = [
  {
    q: "Le contenu des cours est-il régulièrement mis à jour ?",
    a: "Oui, c'est l'une de nos priorités. Chaque cours est revu au minimum tous les trimestres. Les filières en évolution rapide comme Data & IA et Développement Web bénéficient de mises à jour mensuelles. Nos instructeurs travaillent en activité professionnelle et intègrent les dernières pratiques du marché. Vous recevez une notification à chaque mise à jour des cours que vous suivez.",
  },
  {
    q: "Les certificats EduPath sont-ils reconnus par les employeurs ?",
    a: "EduPath est partenaire officiel de plus de 400 entreprises françaises et européennes dont Doctolib, BlaBlaCar, Leboncoin, Capgemini et Société Générale. Nos certificats sont enregistrés dans notre base vérifiable en ligne par les recruteurs. 84% de nos diplômés Pro trouvent un emploi correspondant à leur formation dans les 6 mois suivant leur certification.",
  },
  {
    q: "Puis-je accéder aux cours hors ligne ?",
    a: "L'accès hors ligne est disponible sur l'application mobile EduPath (iOS et Android) pour les abonnés Pro et Teams. Vous pouvez télécharger jusqu'à 30 leçons simultanément. Le contenu téléchargé est synchronisé avec votre progression en ligne dès que vous retrouvez une connexion. La fonctionnalité n'est pas disponible sur le plan Gratuit.",
  },
  {
    q: "Quelle est votre politique de remboursement ?",
    a: "Nous offrons une garantie satisfait ou remboursé de 14 jours sans condition pour tous les nouveaux abonnements Pro. Si vous n'êtes pas satisfait pour quelque raison que ce soit dans les 14 premiers jours, contactez notre support et nous vous remboursons intégralement dans les 48h. Les abonnements Teams bénéficient d'une période d'évaluation de 30 jours.",
  },
  {
    q: "Comment fonctionne le système de mentorat ?",
    a: "Chaque apprenant Pro est associé à un mentor communautaire — un alumni ayant réussi sa reconversion ou sa promotion. Les échanges se font via notre plateforme de messagerie avec un délai de réponse garanti de 48h. Pour les questions techniques urgentes, notre forum communautaire dépasse 50 000 membres actifs. Les abonnés Teams ont accès à des sessions live hebdomadaires.",
  },
  {
    q: "Combien de temps faut-il consacrer par semaine pour progresser efficacement ?",
    a: "Nos parcours sont conçus pour s'adapter à votre emploi du temps. En consacrant 8 à 10 heures par semaine, vous pouvez compléter un parcours complet en 6 à 9 mois. Les leçons durent en moyenne 12 minutes pour s'intégrer dans vos pauses. Aucun prérequis académique n'est nécessaire — seule la régularité compte, et notre système de rappels intelligents vous aide à maintenir le rythme.",
  },
]

function useCounter(target: number, inView: boolean, duration = 1600) {
  const [count, setCount] = useState(0)
  const isDecimal = target % 1 !== 0
  const started = useRef(false)

  if (inView && !started.current) {
    started.current = true
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
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const count = useCounter(stat.value, inView)

  const displayValue = stat.value >= 1000
    ? `${(count / 1000).toFixed(count >= 1000 ? 0 : 1)}k`
    : count.toString()

  return (
    <motion.div
      ref={ref}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      style={{
        textAlign: "center",
        padding: "32px 40px",
        background: C.bgCard,
        borderRadius: C.radiusMd,
        boxShadow: C.shadow,
        border: `1px solid ${C.borderAccent}`,
        flex: "1 1 160px",
      }}
    >
      <div
        style={{
          fontSize: "clamp(2rem, 4vw, 2.8rem)",
          fontWeight: 800,
          color: C.accent,
          lineHeight: 1,
          fontFamily: C.bodyFont,
          letterSpacing: "-0.02em",
        }}
      >
        {stat.prefix}{displayValue}{stat.suffix}
      </div>
      <div
        style={{
          fontSize: "0.82rem",
          color: C.textMuted,
          marginTop: "8px",
          fontWeight: 500,
          fontFamily: C.bodyFont,
        }}
      >
        {stat.label}
      </div>
    </motion.div>
  )
}

const COURSE_CARDS = [
  {
    title: "React & Next.js",
    category: "Développement Web",
    duration: "42h",
    students: "12 400",
    level: "Intermédiaire",
    color: "#2563eb",
    bg: "#eff6ff",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    title: "UX Design System",
    category: "Design UX",
    duration: "28h",
    students: "8 200",
    level: "Tous niveaux",
    color: "#db2777",
    bg: "#fdf2f8",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#db2777" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
  {
    title: "Machine Learning",
    category: "Data & IA",
    duration: "56h",
    students: "9 800",
    level: "Avancé",
    color: "#059669",
    bg: "#f0fdf4",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
  },
]

export default function Page() {
  const { scrollY } = useScroll()
  const cardsY = useTransform(scrollY, [0, 500], [0, -30])
  const heroBgY = useTransform(scrollY, [0, 600], [0, 60])

  const [activeTab, setActiveTab] = useState(0)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null)

  const statsRef = useRef(null)
  const featuresRef = useRef(null)
  const pricingRef = useRef(null)
  const ctaRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" })
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
          padding: scrolled ? "12px 48px" : "20px 48px",
          background: scrolled ? "rgba(255,255,255,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "none",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              background: `linear-gradient(135deg, ${C.accent}, ${C.accentBright})`,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: "1.2rem",
              color: scrolled ? C.text : C.textLight,
              letterSpacing: "-0.02em",
            }}
          >
            EduPath
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: "0.88rem",
                fontWeight: 500,
                color: scrolled ? C.textMuted : "rgba(255,255,255,0.8)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="#auth"
            style={{
              fontSize: "0.85rem",
              fontWeight: 500,
              color: scrolled ? C.accent : "rgba(255,255,255,0.9)",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Connexion
          </a>
          <a
            href="#tarifs"
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: C.textLight,
              background: `linear-gradient(135deg, ${C.accent}, ${C.accentBright})`,
              padding: "10px 22px",
              borderRadius: "8px",
              textDecoration: "none",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(124,58,237,0.3)",
              transition: "all 0.2s",
            }}
          >
            Commencer
          </a>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section
        style={{
          minHeight: "100vh",
          background: `linear-gradient(135deg, ${C.bgDark} 0%, ${C.bgAccent} 50%, #9333ea 100%)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 6vw 80px",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        {/* Animated background shapes */}
        <motion.div
          style={{ y: heroBgY }}
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.06)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "8%",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "12%",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "100px",
            padding: "6px 18px",
            marginBottom: "32px",
            backdropFilter: "blur(8px)",
          }}
        >
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80" }} />
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "0.04em",
            }}
          >
            50 000+ professionnels formés en 2025
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          style={{
            fontSize: "clamp(2.6rem, 7vw, 5.2rem)",
            fontWeight: 800,
            color: C.textLight,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            margin: "0 0 24px",
            maxWidth: "820px",
          }}
        >
          Maîtrisez les<br />
          <span
            style={{
              background: "linear-gradient(90deg, #f0abfc, #c4b5fd)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Compétences de Demain
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          style={{
            fontSize: "clamp(1rem, 2.2vw, 1.2rem)",
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.7,
            marginBottom: "44px",
            maxWidth: "560px",
            margin: "0 auto 44px",
          }}
        >
          Des parcours structurés en Développement Web, Design UX, Data & IA et Marketing — conçus par et pour des professionnels qui souhaitent évoluer.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "72px" }}
        >
          <a
            href="#tarifs"
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              color: C.accent,
              background: C.textLight,
              padding: "16px 40px",
              borderRadius: "10px",
              textDecoration: "none",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              transition: "all 0.2s",
            }}
          >
            Commencer Gratuitement
          </a>
          <a
            href="#courses"
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: C.textLight,
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.25)",
              padding: "16px 40px",
              borderRadius: "10px",
              textDecoration: "none",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              transition: "all 0.2s",
            }}
          >
            Voir les Cours
          </a>
        </motion.div>

        {/* Floating course cards */}
        <motion.div
          style={{ y: cardsY }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75 }}
        >
          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {COURSE_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.85 + i * 0.12 }}
                style={{
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(16px)",
                  borderRadius: "14px",
                  padding: "20px 24px",
                  width: "210px",
                  textAlign: "left",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
                  border: "1px solid rgba(255,255,255,0.6)",
                  transform: i === 1 ? "translateY(-12px)" : i === 2 ? "translateY(-4px)" : "translateY(4px)",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    background: card.bg,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "14px",
                  }}
                >
                  {card.icon}
                </div>
                <div
                  style={{
                    fontSize: "0.92rem",
                    fontWeight: 700,
                    color: C.text,
                    marginBottom: "4px",
                    lineHeight: 1.3,
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: C.textMuted,
                    marginBottom: "12px",
                  }}
                >
                  {card.category}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: card.color,
                      background: card.bg,
                      padding: "3px 10px",
                      borderRadius: "100px",
                    }}
                  >
                    {card.level}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: C.textMuted }}>{card.duration}</span>
                </div>
                <div
                  style={{
                    marginTop: "10px",
                    paddingTop: "10px",
                    borderTop: `1px solid ${C.border}`,
                    fontSize: "0.72rem",
                    color: C.textMuted,
                  }}
                >
                  {card.students} apprenants
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── STATS BAR ── */}
      <section
        ref={statsRef}
        style={{
          padding: "72px 6vw",
          background: C.bg,
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            justifyContent: "center",
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
        id="courses"
        style={{ padding: "80px 6vw 100px", background: C.bgCard }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <motion.div
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: "56px" }}
          >
            <div
              style={{
                display: "inline-block",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: C.accent,
                background: C.bgAccentLighter,
                padding: "5px 16px",
                borderRadius: "100px",
                marginBottom: "20px",
              }}
            >
              Nos Filières
            </div>
            <h2
              style={{
                fontSize: "clamp(1.9rem, 4vw, 3.2rem)",
                fontWeight: 800,
                color: C.text,
                margin: "0 0 16px",
                letterSpacing: "-0.025em",
                lineHeight: 1.15,
              }}
            >
              Une Expertise, Une Filière
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: C.textMuted,
                maxWidth: "520px",
                margin: "0 auto",
                lineHeight: 1.65,
              }}
            >
              Choisissez la discipline qui correspond à votre ambition. Chaque filière est conçue avec des experts du secteur.
            </p>
          </motion.div>

          {/* Tab pills */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "48px",
              flexWrap: "wrap",
            }}
          >
            {TABS.map((tab, i) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 22px",
                  borderRadius: "100px",
                  border: `1.5px solid ${activeTab === i ? C.accent : C.border}`,
                  background: activeTab === i ? C.bgAccentLighter : "transparent",
                  cursor: "pointer",
                  fontFamily: C.bodyFont,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: activeTab === i ? C.accent : C.textMuted,
                  transition: "all 0.2s",
                }}
              >
                {tab.label}
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: "100px",
                    background: activeTab === i ? C.accent : C.border,
                    color: activeTab === i ? C.textLight : C.textMuted,
                    transition: "all 0.2s",
                  }}
                >
                  {tab.badge}
                </span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.33 }}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "48px",
                alignItems: "center",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                    fontWeight: 800,
                    color: C.text,
                    margin: "0 0 18px",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                  }}
                >
                  {TABS[activeTab].heading}
                </h3>
                <p
                  style={{
                    fontSize: "0.97rem",
                    color: C.textMuted,
                    lineHeight: 1.75,
                    margin: "0 0 32px",
                  }}
                >
                  {TABS[activeTab].body}
                </p>
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: C.textMuted,
                    marginBottom: "28px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  {TABS[activeTab].instructors}
                </div>
                <a
                  href="#courses"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    color: C.textLight,
                    background: `linear-gradient(135deg, ${C.accent}, ${C.accentBright})`,
                    padding: "13px 28px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(124,58,237,0.28)",
                  }}
                >
                  Explorer la filière
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </a>
              </div>

              {/* Right: course list */}
              <div
                style={{
                  background: C.bg,
                  borderRadius: C.radiusMd,
                  padding: "32px",
                  border: `1px solid ${C.borderAccent}`,
                }}
              >
                <p
                  style={{
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: C.accent,
                    fontWeight: 700,
                    marginBottom: "24px",
                  }}
                >
                  Cours phares de la filière
                </p>
                {TABS[activeTab].courses.map((course, i) => (
                  <motion.div
                    key={course}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.07 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "14px 0",
                      borderBottom: i < TABS[activeTab].courses.length - 1 ? `1px solid ${C.border}` : "none",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        background: C.bgAccentLighter,
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: C.accent,
                      }}
                    >
                      {i + 1}
                    </div>
                    <span
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        color: C.text,
                        lineHeight: 1.4,
                      }}
                    >
                      {course}
                    </span>
                    <svg
                      style={{ marginLeft: "auto", flexShrink: 0 }}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={C.textMuted}
                      strokeWidth="2"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section
        style={{
          padding: "100px 6vw",
          background: `linear-gradient(135deg, ${C.bgDark} 0%, ${C.bgAccent} 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div
              style={{
                display: "inline-block",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "#c4b5fd",
                background: "rgba(196,181,253,0.15)",
                padding: "5px 16px",
                borderRadius: "100px",
                marginBottom: "20px",
              }}
            >
              Témoignages
            </div>
            <h2
              style={{
                fontSize: "clamp(1.9rem, 4.5vw, 3.2rem)",
                fontWeight: 800,
                color: C.textLight,
                margin: 0,
                letterSpacing: "-0.025em",
                lineHeight: 1.15,
              }}
            >
              Ils ont Changé de Trajectoire
            </h2>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              style={{
                background: "rgba(255,255,255,0.07)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "20px",
                padding: "52px",
                marginBottom: "40px",
              }}
            >
              {/* Before → After */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "rgba(74,222,128,0.12)",
                  border: "1px solid rgba(74,222,128,0.2)",
                  borderRadius: "100px",
                  padding: "5px 16px",
                  marginBottom: "28px",
                }}
              >
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)" }}>
                  {TESTIMONIALS[activeTestimonial].before}
                </span>
                <span style={{ color: "#4ade80", fontSize: "0.78rem" }}>→</span>
                <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#4ade80" }}>
                  {TESTIMONIALS[activeTestimonial].role}
                </span>
              </div>

              <div style={{ marginBottom: "20px" }}>
                {Array.from({ length: TESTIMONIALS[activeTestimonial].rating }).map((_, i) => (
                  <span key={i} style={{ color: "#fbbf24", fontSize: "1rem", marginRight: "2px" }}>★</span>
                ))}
              </div>

              <blockquote
                style={{
                  fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.88)",
                  lineHeight: 1.7,
                  margin: "0 0 36px",
                  quotes: "none",
                }}
              >
                "{TESTIMONIALS[activeTestimonial].text}"
              </blockquote>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: C.textLight,
                      marginBottom: "4px",
                    }}
                  >
                    {TESTIMONIALS[activeTestimonial].name}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#c4b5fd",
                    fontWeight: 500,
                    textAlign: "right",
                  }}
                >
                  {TESTIMONIALS[activeTestimonial].course}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px" }}>
            <button
              onClick={prevTestimonial}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: C.textLight,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                transition: "all 0.2s",
              }}
            >
              ←
            </button>
            <div style={{ display: "flex", gap: "8px" }}>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  style={{
                    width: i === activeTestimonial ? "24px" : "8px",
                    height: "8px",
                    borderRadius: "100px",
                    background: i === activeTestimonial ? C.textLight : "rgba(255,255,255,0.3)",
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
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: C.textLight,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
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
        id="tarifs"
        style={{ padding: "100px 6vw", background: C.bg }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <motion.div
            animate={pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: "64px" }}
          >
            <div
              style={{
                display: "inline-block",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: C.accent,
                background: C.bgAccentLighter,
                padding: "5px 16px",
                borderRadius: "100px",
                marginBottom: "20px",
              }}
            >
              Tarifs Simples
            </div>
            <h2
              style={{
                fontSize: "clamp(1.9rem, 4vw, 3.2rem)",
                fontWeight: 800,
                color: C.text,
                margin: "0 0 16px",
                letterSpacing: "-0.025em",
              }}
            >
              Commencez Gratuitement
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: C.textMuted,
                maxWidth: "460px",
                margin: "0 auto",
                lineHeight: 1.65,
              }}
            >
              Essayez EduPath sans carte bancaire. Passez à Pro quand vous êtes prêt.
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
                animate={pricingInView
                  ? {
                      opacity: 1,
                      y: 0,
                      scale: plan.highlight ? 1.04 : 1,
                    }
                  : { opacity: 0, y: 24, scale: 1 }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                onMouseEnter={() => setHoveredPlan(i)}
                onMouseLeave={() => setHoveredPlan(null)}
                style={{
                  background: plan.highlight
                    ? `linear-gradient(145deg, ${C.bgDark} 0%, ${C.bgAccent} 100%)`
                    : C.bgCard,
                  border: plan.highlight ? "none" : `1px solid ${C.border}`,
                  borderRadius: C.radiusMd,
                  padding: "40px 32px",
                  position: "relative",
                  boxShadow: plan.highlight ? C.shadowLg : hoveredPlan === i ? C.shadowMd : C.shadow,
                  transition: "box-shadow 0.2s",
                  cursor: "default",
                }}
              >
                {plan.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-14px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "linear-gradient(90deg, #f0abfc, #c4b5fd)",
                      color: C.bgDark,
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      padding: "5px 18px",
                      borderRadius: "100px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {plan.badge}
                  </div>
                )}

                <div
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: plan.highlight ? "rgba(196,181,253,0.8)" : C.textMuted,
                    marginBottom: "16px",
                  }}
                >
                  {plan.name}
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "8px" }}>
                  <span
                    style={{
                      fontSize: "3.2rem",
                      fontWeight: 800,
                      color: plan.highlight ? C.textLight : C.text,
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                    }}
                  >
                    {plan.price === "0" ? "Gratuit" : `${plan.price}€`}
                  </span>
                  {plan.period && (
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: plan.highlight ? "rgba(255,255,255,0.5)" : C.textMuted,
                        marginLeft: "2px",
                      }}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>
                <p
                  style={{
                    fontSize: "0.87rem",
                    color: plan.highlight ? "rgba(255,255,255,0.6)" : C.textMuted,
                    marginBottom: "28px",
                    lineHeight: 1.5,
                  }}
                >
                  {plan.description}
                </p>

                <div style={{ marginBottom: "32px" }}>
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        padding: "9px 0",
                        borderBottom: `1px solid ${plan.highlight ? "rgba(255,255,255,0.06)" : C.border}`,
                      }}
                    >
                      <svg
                        style={{ flexShrink: 0, marginTop: "1px" }}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={plan.highlight ? "#4ade80" : C.accent}
                        strokeWidth="2.5"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span
                        style={{
                          fontSize: "0.87rem",
                          color: plan.highlight ? "rgba(255,255,255,0.85)" : C.text,
                          lineHeight: 1.4,
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
                    borderRadius: "10px",
                    border: plan.ctaStyle === "outline" ? `1.5px solid ${plan.highlight ? "rgba(255,255,255,0.3)" : C.border}` : "none",
                    background: plan.ctaStyle === "filled"
                      ? "linear-gradient(135deg, #f0abfc, #c4b5fd)"
                      : plan.highlight ? "rgba(255,255,255,0.1)" : "transparent",
                    color: plan.ctaStyle === "filled" ? C.bgDark : plan.highlight ? C.textLight : C.accent,
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontFamily: C.bodyFont,
                    letterSpacing: "0.02em",
                  }}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>

          <p
            style={{
              textAlign: "center",
              marginTop: "32px",
              fontSize: "0.85rem",
              color: C.textMuted,
            }}
          >
            Garantie satisfait ou remboursé 14 jours · Aucune carte bancaire requise pour le plan Gratuit
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "100px 6vw", background: C.bgCard }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div
              style={{
                display: "inline-block",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: C.accent,
                background: C.bgAccentLighter,
                padding: "5px 16px",
                borderRadius: "100px",
                marginBottom: "20px",
              }}
            >
              FAQ
            </div>
            <h2
              style={{
                fontSize: "clamp(1.9rem, 4vw, 3rem)",
                fontWeight: 800,
                color: C.text,
                margin: 0,
                letterSpacing: "-0.025em",
                lineHeight: 1.15,
              }}
            >
              Questions Fréquentes
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                style={{
                  background: C.bg,
                  borderRadius: "12px",
                  border: `1px solid ${openFaq === i ? C.borderAccent : C.border}`,
                  overflow: "hidden",
                  transition: "border-color 0.2s",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "22px 24px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: "20px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.97rem",
                      fontWeight: 600,
                      color: openFaq === i ? C.accent : C.text,
                      lineHeight: 1.4,
                      transition: "color 0.2s",
                      fontFamily: C.bodyFont,
                    }}
                  >
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      border: `1.5px solid ${openFaq === i ? C.accent : C.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: openFaq === i ? C.accent : C.textMuted,
                      fontSize: "1.1rem",
                      lineHeight: 1,
                      transition: "border-color 0.2s, color 0.2s",
                      background: openFaq === i ? C.bgAccentLighter : "transparent",
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
                      transition={{ duration: 0.28 }}
                      style={{ overflow: "hidden" }}
                    >
                      <p
                        style={{
                          fontSize: "0.93rem",
                          color: C.textMuted,
                          lineHeight: 1.75,
                          padding: "0 24px 24px",
                          margin: 0,
                          fontFamily: C.bodyFont,
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
          padding: "100px 6vw",
          background: C.bg,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <motion.div
          animate={ctaInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.7 }}
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            background: `linear-gradient(135deg, ${C.bgDark} 0%, #6d28d9 50%, ${C.bgAccent} 100%)`,
            borderRadius: "24px",
            padding: "72px 64px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            boxShadow: C.shadowLg,
          }}
        >
          {/* Decoration circles */}
          <div
            style={{
              position: "absolute",
              top: "-60px",
              right: "-60px",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.06)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-80px",
              left: "-40px",
              width: "280px",
              height: "280px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "100px",
              padding: "6px 18px",
              marginBottom: "28px",
            }}
          >
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80" }} />
            <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
              Rejoignez 50 000+ professionnels
            </span>
          </div>

          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3.6rem)",
              fontWeight: 800,
              color: C.textLight,
              margin: "0 0 20px",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              position: "relative",
            }}
          >
            Commencez Gratuitement<br />Aujourd'hui
          </h2>
          <p
            style={{
              fontSize: "1.05rem",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.7,
              maxWidth: "500px",
              margin: "0 auto 48px",
              position: "relative",
            }}
          >
            Accédez à 3 cours complets sans carte bancaire. Passez à Pro à tout moment pour débloquer l'ensemble du catalogue.
          </p>

          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
              position: "relative",
            }}
          >
            <a
              href="#tarifs"
              style={{
                fontSize: "0.95rem",
                fontWeight: 700,
                color: C.bgDark,
                background: C.textLight,
                padding: "18px 44px",
                borderRadius: "10px",
                textDecoration: "none",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                transition: "all 0.2s",
                display: "inline-block",
              }}
            >
              Commencer Gratuitement
            </a>
            <a
              href="#courses"
              style={{
                fontSize: "0.95rem",
                fontWeight: 600,
                color: C.textLight,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "18px 44px",
                borderRadius: "10px",
                textDecoration: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "inline-block",
              }}
            >
              Voir le Catalogue
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: "#0d0a1e",
          padding: "72px 6vw 40px",
          color: "rgba(255,255,255,0.45)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
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
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    background: `linear-gradient(135deg, ${C.accent}, ${C.accentBright})`,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: "1.2rem",
                    color: C.textLight,
                    letterSpacing: "-0.02em",
                  }}
                >
                  EduPath
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.88rem",
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: "28px",
                  maxWidth: "280px",
                }}
              >
                La plateforme de formation professionnelle en ligne pensée pour les actifs qui veulent progresser sans sacrifier leur quotidien.
              </p>
              {/* Social icons */}
              <div style={{ display: "flex", gap: "14px" }}>
                <a href="#" style={{ color: "rgba(255,255,255,0.35)", cursor: "pointer", transition: "color 0.2s" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                </a>
                <a href="#" style={{ color: "rgba(255,255,255,0.35)", cursor: "pointer", transition: "color 0.2s" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a href="#" style={{ color: "rgba(255,255,255,0.35)", cursor: "pointer", transition: "color 0.2s" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                  </svg>
                </a>
                <a href="#" style={{ color: "rgba(255,255,255,0.35)", cursor: "pointer", transition: "color 0.2s" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Apprendre */}
            <div>
              <h4
                style={{
                  fontSize: "0.72rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  color: C.accentBright,
                  marginBottom: "20px",
                  fontWeight: 700,
                  fontFamily: C.bodyFont,
                }}
              >
                Apprendre
              </h4>
              {["Développement Web", "Design UX", "Data & IA", "Marketing Digital", "Tous les Cours"].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    display: "block",
                    fontSize: "0.87rem",
                    color: "rgba(255,255,255,0.45)",
                    textDecoration: "none",
                    marginBottom: "12px",
                    transition: "color 0.2s",
                    cursor: "pointer",
                    fontFamily: C.bodyFont,
                  }}
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Entreprises */}
            <div>
              <h4
                style={{
                  fontSize: "0.72rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  color: C.accentBright,
                  marginBottom: "20px",
                  fontWeight: 700,
                  fontFamily: C.bodyFont,
                }}
              >
                Entreprises
              </h4>
              {["EduPath Teams", "Nos Partenaires", "Cas Clients", "Demander une Démo", "API Formation"].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    display: "block",
                    fontSize: "0.87rem",
                    color: "rgba(255,255,255,0.45)",
                    textDecoration: "none",
                    marginBottom: "12px",
                    transition: "color 0.2s",
                    cursor: "pointer",
                    fontFamily: C.bodyFont,
                  }}
                >
                  {item}
                </a>
              ))}
            </div>

            {/* À propos */}
            <div>
              <h4
                style={{
                  fontSize: "0.72rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  color: C.accentBright,
                  marginBottom: "20px",
                  fontWeight: 700,
                  fontFamily: C.bodyFont,
                }}
              >
                À Propos
              </h4>
              {["Notre Mission", "Blog & Ressources", "Devenir Instructeur", "Presse", "Contact"].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    display: "block",
                    fontSize: "0.87rem",
                    color: "rgba(255,255,255,0.45)",
                    textDecoration: "none",
                    marginBottom: "12px",
                    transition: "color 0.2s",
                    cursor: "pointer",
                    fontFamily: C.bodyFont,
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
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
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.25)",
                margin: 0,
                fontFamily: C.bodyFont,
              }}
            >
              © 2026 EduPath SAS. Tous droits réservés. · Paris, France
            </p>
            <div style={{ display: "flex", gap: "28px" }}>
              {["Confidentialité", "CGU", "Cookies", "Mentions Légales"].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    fontSize: "0.78rem",
                    color: "rgba(255,255,255,0.25)",
                    textDecoration: "none",
                    cursor: "pointer",
                    fontFamily: C.bodyFont,
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
