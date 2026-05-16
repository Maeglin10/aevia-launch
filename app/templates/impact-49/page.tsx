"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useSpring,
} from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Search,
  BookOpen,
  Star,
  Users,
  Clock,
  TrendingUp,
  Award,
  Play,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Menu,
  X,
  Globe,
  Zap,
  Target,
  BarChart,
} from "lucide-react"

/* ==========================================================================
   SKILLBRIDGE — ONLINE COURSE MARKETPLACE
   bg: #F5F3FF | primary: #6366F1 | secondary: #818CF8 | CTA: #10B981
   ========================================================================== */

function useFonts() {
  useEffect(() => {
    const id = "skillbridge-font"
    if (document.getElementById(id)) return
    const link = document.createElement("link")
    link.id = id
    link.rel = "stylesheet"
    link.href =
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
    document.head.appendChild(link)
  }, [])
}

/* --------------------------------------------------------------------------
   DATA
   -------------------------------------------------------------------------- */

const NAV_LINKS = ["Cours", "Formateurs", "Parcours", "Entreprises", "Tarifs"]

const CATEGORIES = [
  { label: "Design", color: "#6366F1", count: 420 },
  { label: "Développement", color: "#818CF8", count: 980 },
  { label: "Marketing", color: "#10B981", count: 340 },
  { label: "Data & IA", color: "#F59E0B", count: 260 },
  { label: "Business", color: "#EF4444", count: 510 },
  { label: "Photographie", color: "#EC4899", count: 180 },
  { label: "Finance", color: "#14B8A6", count: 290 },
  { label: "Langues", color: "#8B5CF6", count: 140 },
]

const COURSES = [
  {
    id: 1,
    title: "React & Next.js — De Zéro à Expert",
    instructor: "Alexandre Martin",
    rating: 4.9,
    students: "18 240",
    duration: "38h",
    price: "94€",
    originalPrice: "199€",
    category: "Développement",
    badge: "Bestseller",
    categoryColor: "#818CF8",
    img: "photo-1516321318423-f06f85e504b3",
  },
  {
    id: 2,
    title: "UX Design: Figma Maîtrise Complète",
    instructor: "Sofia Bernard",
    rating: 4.8,
    students: "11 580",
    duration: "24h",
    price: "79€",
    originalPrice: "159€",
    category: "Design",
    badge: "Nouveau",
    categoryColor: "#6366F1",
    img: "photo-1522202176988-66273c2fd55f",
  },
  {
    id: 3,
    title: "Growth Hacking & SEO Avancé",
    instructor: "Clément Rousseau",
    rating: 4.7,
    students: "9 120",
    duration: "18h",
    price: "69€",
    originalPrice: "129€",
    category: "Marketing",
    badge: null,
    categoryColor: "#10B981",
    img: "photo-1516321318423-f06f85e504b3",
  },
  {
    id: 4,
    title: "Python & Machine Learning: Pratique",
    instructor: "Nadia Karim",
    rating: 4.9,
    students: "22 100",
    duration: "45h",
    price: "109€",
    originalPrice: "249€",
    category: "Data & IA",
    badge: "Bestseller",
    categoryColor: "#F59E0B",
    img: "photo-1522202176988-66273c2fd55f",
  },
  {
    id: 5,
    title: "Finance Personnelle & Investissement",
    instructor: "Thomas Lefevre",
    rating: 4.8,
    students: "14 900",
    duration: "22h",
    price: "84€",
    originalPrice: "179€",
    category: "Finance",
    badge: null,
    categoryColor: "#14B8A6",
    img: "photo-1516321318423-f06f85e504b3",
  },
  {
    id: 6,
    title: "Photographie Créative: Light & Composition",
    instructor: "Julie Morin",
    rating: 4.6,
    students: "6 780",
    duration: "14h",
    price: "59€",
    originalPrice: "99€",
    category: "Photographie",
    badge: "Populaire",
    categoryColor: "#EC4899",
    img: "photo-1522202176988-66273c2fd55f",
  },
]

const SKILL_PATHS = [
  {
    id: "sp1",
    title: "Développeur Frontend",
    subtitle: "12 cours · 120h de contenu",
    icon: Zap,
    color: "#6366F1",
    bg: "#EEF2FF",
    steps: ["HTML & CSS", "JavaScript ES6+", "React", "Next.js", "TypeScript", "Tests & CI/CD"],
    progress: 68,
    students: "8 400",
    level: "Débutant → Avancé",
  },
  {
    id: "sp2",
    title: "Data Analyst",
    subtitle: "9 cours · 90h de contenu",
    icon: BarChart,
    color: "#F59E0B",
    bg: "#FFFBEB",
    steps: ["Excel Avancé", "SQL", "Python", "Pandas", "Visualisation", "Power BI"],
    progress: 45,
    students: "6 200",
    level: "Intermédiaire",
  },
  {
    id: "sp3",
    title: "UX Designer",
    subtitle: "8 cours · 80h de contenu",
    icon: Target,
    color: "#10B981",
    bg: "#ECFDF5",
    steps: ["Research UX", "Wireframing", "Figma", "Prototypage", "Tests utilisateurs", "Design System"],
    progress: 30,
    students: "4 900",
    level: "Tous niveaux",
  },
]

const MARQUEE_ITEMS = [
  "50 000+ apprenants actifs",
  "3 200+ cours disponibles",
  "180+ formateurs experts",
  "4.8★ satisfaction moyenne",
  "Certifications reconnues",
  "Accès à vie aux cours achetés",
  "Support 7j/7",
  "Mises à jour incluses",
]

const INSTRUCTORS = [
  {
    name: "Alexandre Martin",
    specialty: "React & Node.js Expert",
    students: "42K",
    courses: 11,
    rating: 4.9,
    bio: "Ex-Senior Engineer chez Doctolib. 8 ans d'expérience en développement full-stack.",
  },
  {
    name: "Sofia Bernard",
    specialty: "UX & Product Design",
    students: "28K",
    courses: 6,
    rating: 4.8,
    bio: "Designer Lead chez Ledger. Spécialiste Figma et design systems à grande échelle.",
  },
  {
    name: "Nadia Karim",
    specialty: "Data Science & IA",
    students: "61K",
    courses: 14,
    rating: 4.9,
    bio: "PhD en ML, ex-chercheuse DeepMind. Auteure de 3 publications Nature sur l'IA générative.",
  },
]

const TESTIMONIALS = [
  {
    name: "Maxime Dubois",
    before: "Caissier",
    after: "Développeur Frontend @ Deezer",
    salary: "+87% salaire",
    rating: 5,
    quote:
      "En 9 mois avec le parcours Frontend de Skillbridge, j'ai décroché un poste que je n'aurais jamais cru possible. La qualité des cours est incomparable.",
    avatar: "MD",
  },
  {
    name: "Camille Renard",
    before: "Assistante RH",
    after: "UX Designer @ Sncf Connect",
    salary: "+65% salaire",
    rating: 5,
    quote:
      "J'avais peur que la reconversion soit trop longue. Avec Skillbridge, j'ai eu mon premier job en UX 6 mois après avoir commencé. Le parcours est structuré parfaitement.",
    avatar: "CR",
  },
  {
    name: "Julien Parra",
    before: "Commercial",
    after: "Data Analyst @ BNP Paribas",
    salary: "+72% salaire",
    rating: 5,
    quote:
      "Le parcours Data Analyst est d'une densité impressionnante. Les projets pratiques m'ont permis de construire un portfolio solide pour convaincre les recruteurs.",
    avatar: "JP",
  },
  {
    name: "Léa Fournier",
    before: "Infirmière",
    after: "Growth Manager @ Qonto",
    salary: "+90% salaire",
    rating: 5,
    quote:
      "Incroyable. Je n'aurais jamais imaginé être Growth Manager. Skillbridge m'a donné toutes les clés pour réussir une reconversion complète en moins d'un an.",
    avatar: "LF",
  },
]

const PLANS = [
  {
    name: "Free",
    price: "0€",
    period: "/mois",
    description: "Découvrez Skillbridge sans engagement",
    highlight: false,
    cta: "Commencer gratuitement",
    features: [
      "5 cours gratuits à vie",
      "Accès aux previews de tous les cours",
      "Communauté étudiante",
      "Certificat de complétion",
      "Application mobile",
    ],
    missing: ["Cours premium", "Parcours guidés", "Mentorat", "Support prioritaire"],
  },
  {
    name: "Pro",
    price: "29€",
    period: "/mois",
    description: "L'accès complet pour apprendre sans limites",
    highlight: true,
    cta: "Essai gratuit 7 jours",
    features: [
      "Accès illimité à 3 200+ cours",
      "Tous les parcours guidés",
      "Certificats vérifiables",
      "Téléchargements offline",
      "Support prioritaire 24/7",
      "Sessions live mensuelles",
      "Mises à jour cours incluses",
    ],
    missing: [],
  },
  {
    name: "Team",
    price: "49€",
    period: "/utilisateur/mois",
    description: "La solution pour former vos équipes",
    highlight: false,
    cta: "Contacter les ventes",
    features: [
      "Tout le plan Pro",
      "Tableau de bord RH",
      "Rapports de progression",
      "SSO & SAML",
      "Contenu personnalisé",
      "Gestionnaire de compte dédié",
      "Facturation centralisée",
    ],
    missing: [],
  },
]

const COMPANY_LOGOS = [
  "Doctolib", "Deezer", "BlaBlaCar", "Ledger", "Qonto", "Swile", "Alan", "Dataiku",
]

const FOOTER_LINKS = {
  "Apprendre": ["Tous les cours", "Parcours guidés", "Certifications", "Cours gratuits", "Nouveautés"],
  "Formateurs": ["Devenir formateur", "Ressources", "Programme partenaires", "Studio qualité"],
  "Entreprises": ["Solutions équipes", "Cas clients", "Tarifs entreprise", "Démo"],
  "Aide": ["Centre d'aide", "Communauté", "Politique remboursement", "Accessibilité"],
}

/* --------------------------------------------------------------------------
   COMPONENTS
   -------------------------------------------------------------------------- */

function Reveal({
  children,
  delay = 0,
  y = 32,
  x = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  x?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          style={{ width: size, height: size }}
          className={s <= Math.floor(rating) ? "fill-[#F59E0B] text-[#F59E0B]" : "fill-[#E2E8F0] text-[#E2E8F0]"}
        />
      ))}
      <span className="ml-1 text-[#6366F1] font-bold text-xs">{rating.toFixed(1)}</span>
    </div>
  )
}

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 40 })
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "left" }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#6366F1] to-[#10B981] z-[999]"
    />
  )
}

function MarqueeStrip({ items }: { items: string[] }) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="inline-flex gap-12 items-center"
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 text-sm font-semibold text-[#1E1B4B]">
            <span className="w-2 h-2 rounded-full bg-[#6366F1] inline-block" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* --------------------------------------------------------------------------
   MAIN COMPONENT
   -------------------------------------------------------------------------- */

export default function Impact49Page() {
  useFonts()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activePath, setActivePath] = useState("sp1")
  const [billingAnnual, setBillingAnnual] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: heroRef })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const activePlan = SKILL_PATHS.find((p) => p.id === activePath) ?? SKILL_PATHS[0]

  return (
    <div
      ref={containerRef}
      className="bg-[#F5F3FF] text-[#1E1B4B] min-h-screen overflow-x-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <ScrollProgressBar />

      {/* =====================================================================
          1. NAV
          ===================================================================== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_2px_24px_rgba(99,102,241,0.08)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#6366F1] flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-[#1E1B4B]">
              SKILL<span className="text-[#6366F1]">BRIDGE</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link}
                href="#"
                className="text-sm font-medium text-[#4B5563] hover:text-[#6366F1] transition-colors"
              >
                {link}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="#" className="text-sm font-medium text-[#1E1B4B] hover:text-[#6366F1] transition-colors">
              Connexion
            </Link>
            <Link
              href="#"
              className="px-5 py-2.5 rounded-xl bg-[#10B981] text-white text-sm font-semibold hover:bg-[#059669] transition-all shadow-[0_4px_14px_rgba(16,185,129,0.3)]"
            >
              Commencer gratuitement
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[#EEF2FF] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden bg-white border-t border-[#EEF2FF] px-6 py-4"
            >
              <div className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link}
                    href="#"
                    className="text-sm font-medium text-[#4B5563] hover:text-[#6366F1] py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link}
                  </Link>
                ))}
                <hr className="border-[#EEF2FF]" />
                <Link
                  href="#"
                  className="w-full text-center py-3 rounded-xl bg-[#10B981] text-white text-sm font-semibold"
                >
                  Commencer gratuitement
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* =====================================================================
          2. HERO — PARALLAX + BIG SEARCH BAR
          ===================================================================== */}
      <section
        id="hero"
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-16"
      >
        {/* Parallax background blobs */}
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-[#6366F1]/10 blur-[100px]" />
          <div className="absolute top-[20%] right-[5%] w-[400px] h-[400px] rounded-full bg-[#818CF8]/15 blur-[80px]" />
          <div className="absolute bottom-[-5%] left-[30%] w-[500px] h-[500px] rounded-full bg-[#10B981]/10 blur-[100px]" />
          {/* Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366F110_1px,transparent_1px),linear-gradient(to_bottom,#6366F110_1px,transparent_1px)] bg-[size:40px_40px]" />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E0E7FF] shadow-sm mb-8">
              <Zap className="w-3.5 h-3.5 text-[#6366F1]" />
              <span className="text-xs font-semibold text-[#6366F1]">
                +2 000 nouveaux cours cette année
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
              Apprenez ce que{" "}
              <span className="relative inline-block">
                <span className="text-[#6366F1]">vous voulez</span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="absolute bottom-0 left-0 right-0 h-1 bg-[#6366F1]/30 rounded-full origin-left"
                />
              </span>
              <br />
              quand vous voulez.
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-lg text-[#4B5563] mb-10 max-w-2xl mx-auto leading-relaxed">
              Plus de 3 200 cours conçus par des experts pour accélérer votre carrière,
              changer de métier ou maîtriser une nouvelle compétence.
            </p>
          </Reveal>

          {/* Big search bar */}
          <Reveal delay={0.3}>
            <div className="relative max-w-2xl mx-auto mb-8">
              <div className="flex items-center bg-white rounded-2xl shadow-[0_8px_40px_rgba(99,102,241,0.12)] border border-[#E0E7FF] overflow-hidden">
                <div className="pl-5">
                  <Search className="w-5 h-5 text-[#9CA3AF]" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un cours, une compétence, un formateur..."
                  className="flex-1 px-4 py-5 text-sm outline-none bg-transparent text-[#1E1B4B] placeholder-[#9CA3AF]"
                />
                <button className="m-2 px-6 py-3 bg-[#6366F1] text-white text-sm font-semibold rounded-xl hover:bg-[#4F46E5] transition-colors whitespace-nowrap">
                  Rechercher
                </button>
              </div>
            </div>
          </Reveal>

          {/* Category pills */}
          <Reveal delay={0.4}>
            <div className="flex flex-wrap justify-center gap-2 mb-16">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(activeCategory === cat.label ? null : cat.label)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                    activeCategory === cat.label
                      ? "text-white border-transparent shadow-md"
                      : "bg-white text-[#4B5563] border-[#E5E7EB] hover:border-[#6366F1] hover:text-[#6366F1]"
                  }`}
                  style={
                    activeCategory === cat.label
                      ? { backgroundColor: cat.color, borderColor: cat.color }
                      : {}
                  }
                >
                  {cat.label}
                  <span className="ml-1.5 text-xs opacity-60">({cat.count})</span>
                </button>
              ))}
            </div>
          </Reveal>

          {/* Hero stats */}
          <Reveal delay={0.5}>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {[
                { value: "50 000+", label: "Apprenants actifs" },
                { value: "3 200+", label: "Cours disponibles" },
                { value: "180+", label: "Formateurs experts" },
                { value: "4.8★", label: "Satisfaction moyenne" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-extrabold text-[#1E1B4B]">{stat.value}</div>
                  <div className="text-sm text-[#6B7280] mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-9 border-2 border-[#6366F1]/30 rounded-full flex justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-[#6366F1]"
            />
          </div>
        </motion.div>
      </section>

      {/* =====================================================================
          3. FEATURED COURSES
          ===================================================================== */}
      <section id="cours" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#6366F1] block mb-2">
                  Cours phares
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                  Les cours les plus populaires
                </h2>
              </div>
              <Link
                href="#"
                className="hidden md:flex items-center gap-2 text-sm font-semibold text-[#6366F1] hover:gap-3 transition-all"
              >
                Voir tout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.map((course, i) => (
              <Reveal key={course.id} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-sm hover:shadow-[0_12px_40px_rgba(99,102,241,0.12)] transition-all cursor-pointer group"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-[#EEF2FF]">
                    <Image
                      src={`https://images.unsplash.com/${course.img}?w=640&h=360&fit=crop&auto=format`}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    {/* Badge */}
                    {course.badge && (
                      <div
                        className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-bold text-white"
                        style={{ backgroundColor: course.categoryColor }}
                      >
                        {course.badge}
                      </div>
                    )}
                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 text-[#6366F1] ml-0.5" />
                      </div>
                    </div>
                    {/* Category tag */}
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-white/90 text-xs font-semibold"
                      style={{ color: course.categoryColor }}>
                      {course.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-[#1E1B4B] leading-snug mb-2 group-hover:text-[#6366F1] transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-[#6B7280] mb-3">par {course.instructor}</p>

                    <div className="flex items-center gap-3 mb-4">
                      <StarRating rating={course.rating} />
                      <span className="text-xs text-[#9CA3AF]">({course.students} élèves)</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-[#6B7280] mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> {course.students}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-extrabold text-[#1E1B4B]">{course.price}</span>
                        <span className="text-xs text-[#9CA3AF] line-through">{course.originalPrice}</span>
                      </div>
                      <button className="px-4 py-2 rounded-xl bg-[#EEF2FF] text-[#6366F1] text-xs font-semibold hover:bg-[#6366F1] hover:text-white transition-colors">
                        Voir le cours
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. SKILL PATHS
          ===================================================================== */}
      <section id="parcours" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#10B981] block mb-2">
                Parcours guidés
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                Devenez expert avec un parcours structuré
              </h2>
              <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
                Nos parcours vous guident pas à pas vers la maîtrise d'une compétence clé,
                avec des projets pratiques à chaque étape.
              </p>
            </div>
          </Reveal>

          {/* Path selector tabs */}
          <Reveal delay={0.1}>
            <div className="flex gap-3 justify-center mb-10 flex-wrap">
              {SKILL_PATHS.map((path) => {
                const IconComponent = path.icon
                return (
                  <button
                    key={path.id}
                    onClick={() => setActivePath(path.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all border ${
                      activePath === path.id
                        ? "text-white border-transparent shadow-md"
                        : "bg-white text-[#4B5563] border-[#E5E7EB] hover:border-[#6366F1]"
                    }`}
                    style={
                      activePath === path.id
                        ? { backgroundColor: path.color, borderColor: path.color }
                        : {}
                    }
                  >
                    <IconComponent className="w-4 h-4" />
                    {path.title}
                  </button>
                )
              })}
            </div>
          </Reveal>

          {/* Active path card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePlan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-sm"
            >
              <div className="grid lg:grid-cols-2">
                {/* Left info */}
                <div className="p-10 md:p-14" style={{ backgroundColor: activePlan.bg }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: activePlan.color + "20" }}
                    >
                      {React.createElement(activePlan.icon, {
                        className: "w-6 h-6",
                        style: { color: activePlan.color },
                      })}
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold">{activePlan.title}</h3>
                      <p className="text-sm text-[#6B7280]">{activePlan.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mb-8 text-sm text-[#4B5563]">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#9CA3AF]" />
                      {activePlan.students} étudiants
                    </span>
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-[#9CA3AF]" />
                      {activePlan.level}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mb-8">
                    <div className="flex justify-between text-xs text-[#6B7280] mb-2">
                      <span>Progression moyenne</span>
                      <span className="font-bold" style={{ color: activePlan.color }}>
                        {activePlan.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-white rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${activePlan.progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: activePlan.color }}
                      />
                    </div>
                  </div>

                  <button
                    className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-white text-sm font-semibold shadow-md hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: activePlan.color }}
                  >
                    Démarrer ce parcours <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Right: steps */}
                <div className="p-10 md:p-14">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-[#9CA3AF] mb-6">
                    Étapes du parcours
                  </h4>
                  <div className="flex flex-col gap-4">
                    {activePlan.steps.map((step, idx) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.06 }}
                        className="flex items-center gap-4 p-4 rounded-xl bg-[#F9FAFB] border border-[#F3F4F6] hover:border-[#6366F1]/30 transition-colors"
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{
                            backgroundColor:
                              idx < Math.round((activePlan.progress / 100) * activePlan.steps.length)
                                ? activePlan.color
                                : "#E5E7EB",
                            color:
                              idx < Math.round((activePlan.progress / 100) * activePlan.steps.length)
                                ? "white"
                                : "#9CA3AF",
                          }}
                        >
                          {idx < Math.round((activePlan.progress / 100) * activePlan.steps.length) ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            idx + 1
                          )}
                        </div>
                        <span className="text-sm font-medium text-[#1E1B4B]">{step}</span>
                        <ChevronRight className="w-4 h-4 text-[#D1D5DB] ml-auto" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* =====================================================================
          5. STATS MARQUEE
          ===================================================================== */}
      <section className="py-6 bg-[#6366F1] overflow-hidden">
        <MarqueeStrip
          items={MARQUEE_ITEMS.map((item) => (
            <span key={item} className="text-white">
              {item}
            </span>
          ) as unknown as string[])}
        />
      </section>
      <div className="py-4 bg-[#6366F1]/10 overflow-hidden border-y border-[#6366F1]/10">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="inline-flex gap-12 whitespace-nowrap"
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-3 text-sm font-semibold text-[#1E1B4B]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] inline-block" />
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* =====================================================================
          6. INSTRUCTORS
          ===================================================================== */}
      <section id="formateurs" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#6366F1] block mb-2">
                Formateurs
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                Apprenez des meilleurs experts
              </h2>
              <p className="text-lg text-[#6B7280] max-w-xl mx-auto">
                Nos formateurs sont des praticiens reconnus dans leur domaine,
                pas seulement des théoriciens.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {INSTRUCTORS.map((instructor, i) => (
              <Reveal key={instructor.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm hover:shadow-[0_12px_40px_rgba(99,102,241,0.1)] transition-all"
                >
                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#818CF8] flex items-center justify-center text-white text-xl font-extrabold">
                      {instructor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[#1E1B4B]">{instructor.name}</h3>
                      <p className="text-sm text-[#6366F1] font-medium">{instructor.specialty}</p>
                    </div>
                  </div>

                  <p className="text-sm text-[#6B7280] leading-relaxed mb-6">{instructor.bio}</p>

                  <div className="grid grid-cols-3 gap-4 p-4 bg-[#F9FAFB] rounded-xl mb-6">
                    {[
                      { label: "Élèves", value: instructor.students },
                      { label: "Cours", value: instructor.courses },
                      { label: "Note", value: instructor.rating + "★" },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div className="text-lg font-extrabold text-[#1E1B4B]">{stat.value}</div>
                        <div className="text-xs text-[#9CA3AF]">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <StarRating rating={instructor.rating} size={16} />

                  <button className="mt-4 w-full py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#1E1B4B] hover:border-[#6366F1] hover:text-[#6366F1] transition-colors flex items-center justify-center gap-2">
                    Voir tous ses cours <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. TESTIMONIALS
          ===================================================================== */}
      <section id="temoignages" className="py-24 px-6 bg-[#1E1B4B]">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#818CF8] block mb-2">
                Success stories
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
                Ils ont changé de carrière
              </h2>
              <p className="text-lg text-[#A5B4FC] max-w-xl mx-auto">
                Des milliers d'apprenants ont transformé leur vie professionnelle grâce à Skillbridge.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:border-[#6366F1]/40 transition-all"
                >
                  {/* Before/After */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20">
                      <span className="text-xs font-semibold text-red-400">{t.before}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#818CF8]" />
                    <div className="px-3 py-1 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20">
                      <span className="text-xs font-semibold text-[#10B981]">{t.after}</span>
                    </div>
                  </div>

                  <p className="text-[#E0E7FF] leading-relaxed mb-6 italic">"{t.quote}"</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366F1] to-[#818CF8] flex items-center justify-center text-white text-sm font-bold">
                        {t.avatar}
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">{t.name}</div>
                        <div className="text-[#818CF8] text-xs">{t.salary}</div>
                      </div>
                    </div>
                    <StarRating rating={t.rating} size={13} />
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>

          {/* Social proof bar */}
          <Reveal delay={0.3}>
            <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#F59E0B]" />
                <span className="text-white text-sm font-semibold">Top Platform 2024 — Product Hunt</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B]" />
                <span className="text-white text-sm font-semibold">4.8/5 sur 12 000+ avis</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#818CF8]" />
                <span className="text-white text-sm font-semibold">42 pays représentés</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =====================================================================
          8. TARIFS
          ===================================================================== */}
      <section id="tarifs" className="py-24 px-6 bg-[#F5F3FF]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#6366F1] block mb-2">
                Tarifs
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                Investissez dans votre avenir
              </h2>
              <p className="text-lg text-[#6B7280] max-w-xl mx-auto mb-8">
                Commencez gratuitement, passez au Pro quand vous êtes prêt.
              </p>
            </div>
          </Reveal>

          {/* Billing toggle */}
          <Reveal delay={0.1}>
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`text-sm font-medium ${!billingAnnual ? "text-[#1E1B4B]" : "text-[#9CA3AF]"}`}>
                Mensuel
              </span>
              <button
                onClick={() => setBillingAnnual(!billingAnnual)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  billingAnnual ? "bg-[#6366F1]" : "bg-[#E5E7EB]"
                }`}
              >
                <motion.div
                  animate={{ x: billingAnnual ? 24 : 2 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                />
              </button>
              <span className={`text-sm font-medium ${billingAnnual ? "text-[#1E1B4B]" : "text-[#9CA3AF]"}`}>
                Annuel
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981] text-xs font-bold">
                -30%
              </span>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className={`relative rounded-2xl p-8 border transition-all ${
                    plan.highlight
                      ? "bg-[#6366F1] text-white border-[#6366F1] shadow-[0_20px_60px_rgba(99,102,241,0.3)]"
                      : "bg-white border-[#E5E7EB] shadow-sm"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#10B981] text-white text-xs font-bold">
                      Le plus populaire
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className={`text-lg font-extrabold mb-1 ${plan.highlight ? "text-white" : "text-[#1E1B4B]"}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-sm ${plan.highlight ? "text-[#A5B4FC]" : "text-[#6B7280]"}`}>
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-8">
                    <span className={`text-4xl font-extrabold ${plan.highlight ? "text-white" : "text-[#1E1B4B]"}`}>
                      {billingAnnual && plan.price !== "0€"
                        ? plan.price.replace("€", "").replace("29", "20").replace("49", "34") + "€"
                        : plan.price}
                    </span>
                    <span className={`text-sm ml-1 ${plan.highlight ? "text-[#A5B4FC]" : "text-[#9CA3AF]"}`}>
                      {plan.period}
                    </span>
                  </div>

                  <ul className="flex flex-col gap-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <CheckCircle
                          className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? "text-[#10B981]" : "text-[#6366F1]"}`}
                        />
                        <span className={plan.highlight ? "text-white" : "text-[#1E1B4B]"}>{feature}</span>
                      </li>
                    ))}
                    {plan.missing.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm opacity-40">
                        <div className="w-4 h-4 rounded-full border border-current flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all ${
                      plan.highlight
                        ? "bg-white text-[#6366F1] hover:bg-[#EEF2FF]"
                        : "bg-[#6366F1] text-white hover:bg-[#4F46E5]"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </motion.div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <p className="text-center text-sm text-[#9CA3AF] mt-8">
              Paiement sécurisé · Remboursement 30 jours · Sans engagement
            </p>
          </Reveal>
        </div>
      </section>

      {/* =====================================================================
          9. ENTREPRISES (B2B)
          ===================================================================== */}
      <section id="entreprises" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#10B981] block mb-3">
                  Solutions entreprises
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                  Formez votre équipe avec Skillbridge
                </h2>
                <p className="text-lg text-[#6B7280] leading-relaxed mb-8">
                  Plus de 200 entreprises de toutes tailles utilisent Skillbridge Team pour
                  développer les compétences de leurs collaborateurs et réduire leur turnover.
                </p>
                <ul className="flex flex-col gap-4 mb-10">
                  {[
                    "Tableau de bord RH avec suivi en temps réel",
                    "Contenu personnalisé selon vos métiers",
                    "Intégration SIRH et SSO",
                    "Rapports d'engagement et de complétion",
                    "Sessions live exclusives avec les formateurs",
                    "Gestionnaire de compte dédié",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-[#4B5563]">
                      <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-4">
                  <button className="px-7 py-3.5 rounded-xl bg-[#1E1B4B] text-white text-sm font-semibold hover:bg-[#312E81] transition-colors">
                    Voir la démo
                  </button>
                  <button className="px-7 py-3.5 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#1E1B4B] hover:border-[#6366F1] hover:text-[#6366F1] transition-colors">
                    Contacter les ventes
                  </button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2} x={40}>
              <div>
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { value: "200+", label: "Entreprises clientes", color: "#6366F1" },
                    { value: "89%", label: "Taux de rétention", color: "#10B981" },
                    { value: "4.2×", label: "ROI moyen", color: "#F59E0B" },
                    { value: "-34%", label: "Turnover constaté", color: "#EF4444" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="p-6 rounded-2xl bg-[#F9FAFB] border border-[#F3F4F6] text-center"
                    >
                      <div className="text-2xl font-extrabold mb-1" style={{ color: stat.color }}>
                        {stat.value}
                      </div>
                      <div className="text-xs text-[#6B7280]">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Company logos */}
                <div>
                  <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest mb-4 text-center">
                    Ils nous font confiance
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    {COMPANY_LOGOS.map((logo) => (
                      <div
                        key={logo}
                        className="aspect-[2/1] bg-[#F9FAFB] rounded-xl flex items-center justify-center border border-[#F3F4F6] hover:border-[#6366F1]/30 transition-colors"
                      >
                        <span className="text-xs font-bold text-[#9CA3AF] tracking-wide">{logo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =====================================================================
          10. NEWSLETTER + FOOTER
          ===================================================================== */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#6366F1] to-[#4F46E5]">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Recevez nos meilleures ressources gratuitement
            </h2>
            <p className="text-[#A5B4FC] text-lg mb-8">
              Guide de reconversion, conseils carrière, nouvelles formations — chaque semaine dans votre boîte mail.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="votre@email.com"
                className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-[#A5B4FC] text-sm outline-none focus:border-white transition-colors"
              />
              <button className="px-7 py-3.5 rounded-xl bg-[#10B981] text-white text-sm font-semibold hover:bg-[#059669] transition-colors whitespace-nowrap shadow-md">
                S'abonner gratuitement
              </button>
            </div>
            <p className="text-[#A5B4FC] text-xs mt-4">
              Rejoignez 15 000+ professionnels. Désinscription en 1 clic.
            </p>
          </Reveal>
        </div>
      </section>

      <footer className="bg-[#1E1B4B] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Top footer */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-12">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#6366F1] flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-extrabold text-white">SKILLBRIDGE</span>
              </div>
              <p className="text-sm text-[#A5B4FC] leading-relaxed mb-6">
                La plateforme de formation en ligne qui transforme votre expertise en opportunités réelles.
              </p>
              <div className="flex gap-3">
                {["TW", "LI", "YT", "IG"].map((social) => (
                  <div
                    key={social}
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-[#818CF8] hover:bg-[#6366F1] hover:border-[#6366F1] hover:text-white transition-all cursor-pointer"
                  >
                    {social}
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">{category}</h4>
                <ul className="flex flex-col gap-2">
                  {links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-sm text-[#818CF8] hover:text-white transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom footer */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#6366F1]/60">
              © 2024 Skillbridge. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              {["Confidentialité", "CGU", "Cookies", "Mentions légales"].map((link) => (
                <Link key={link} href="#" className="text-xs text-[#818CF8]/60 hover:text-white transition-colors">
                  {link}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
