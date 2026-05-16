"use client"
import React, { useState, useEffect, useRef } from "react"
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useSpring,
  useMotionValue,
} from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Pen,
  Scissors,
  Star,
  Clock,
  MapPin,
  Phone,
  Instagram,
  Mail,
  ChevronRight,
  ArrowRight,
  Menu,
  X,
  Award,
  Users,
  Heart,
} from "lucide-react"

/* ==========================================================================
   ENCRE & ÂME — Artistic Tattoo Studio (impact-199)
   Design: OLED black, punk editorial, Bebas Neue + Space Grotesk
   ========================================================================== */

function useFonts() {
  useEffect(() => {
    const id = "fonts-impact-199"
    if (document.getElementById(id)) return
    const style = document.createElement("style")
    style.id = id
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@300;400;500;600&display=swap');`
    document.head.appendChild(style)
  }, [])
}

function Reveal({
  children,
  delay = 0,
  y = 40,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function RevealLeft({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function RevealRight({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* --- Data ------------------------------------------------------------------ */

const STYLES = [
  {
    name: "Traditional",
    desc: "Couleurs audacieuses, contours épais — les racines du tatouage américain revisitées.",
    image: "https://images.unsplash.com/photo-1598452963314-b09f397a5c48?w=600&q=80",
    tag: "Old School",
  },
  {
    name: "Japanese",
    desc: "Irezumi — légendes, koi et chrysanthèmes dans un seul récit visuel enveloppant.",
    image: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=600&q=80",
    tag: "Irezumi",
  },
  {
    name: "Blackwork",
    desc: "Noir absolu et géométrie sacrée pour une déclaration sans compromis.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
    tag: "Contemporain",
  },
  {
    name: "Neo-Traditional",
    desc: "Symbolisme vintage rencontrant la palette moderne — élégance narrative.",
    image: "https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=600&q=80",
    tag: "Évolutif",
  },
  {
    name: "Fineline",
    desc: "Précision chirurgicale, aiguilles fines, résultats d'une délicatesse époustouflante.",
    image: "https://images.unsplash.com/photo-1590246814883-55516d5d75e1?w=600&q=80",
    tag: "Délicat",
  },
  {
    name: "Geometric",
    desc: "Mandalas, sacred geometry et patterns mathématiques gravés à jamais.",
    image: "https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?w=600&q=80",
    tag: "Sacred",
  },
]

const ARTISTS = [
  {
    name: "Kira Voss",
    specialty: "Japanese & Neo-Traditional",
    years: 11,
    bio: "Formée à Tokyo pendant 3 ans, Kira apporte une profondeur narrative unique à chaque pièce. Sa maîtrise du Irezumi traditionnel mêlée à sa vision contemporaine crée des œuvres d'une intensité rare.",
    slots: 4,
    tag: "Disponible",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
  },
  {
    name: "Théo Marck",
    specialty: "Blackwork & Geometric",
    years: 8,
    bio: "Architecte reconverti en tatoueur, Théo voit la peau comme une surface d'architecture. Chaque trait est calculé, chaque espace négatif intentionnel. Ses mandalas géométriques sont recherchés en Europe.",
    slots: 2,
    tag: "Dernières places",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
  },
  {
    name: "Léa Sorel",
    specialty: "Fineline & Watercolor",
    years: 6,
    bio: "Née à Lyon, Léa a développé une signature inimitable : la finesse aquarelle. Ses tatouages semblent peints sur la peau. Spécialisée dans les pièces féminines et les portraits botaniques ultra-fins.",
    slots: 0,
    tag: "Complet",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
  },
]

const FLASH_PIECES = [
  { name: "Serpent Tribal", price: 80, size: "5cm", style: "Traditional" },
  { name: "Lune & Étoiles", price: 120, size: "8cm", style: "Fineline" },
  { name: "Crâne Floral", price: 180, size: "12cm", style: "Neo-Trad" },
  { name: "Koi Japonaise", price: 250, size: "15cm", style: "Japanese" },
  { name: "Mandala Solaire", price: 150, size: "10cm", style: "Geometric" },
  { name: "Rose Noire", price: 90, size: "6cm", style: "Blackwork" },
  { name: "Loup Géométrique", price: 220, size: "14cm", style: "Geometric" },
  { name: "Phoenix", price: 200, size: "12cm", style: "Japanese" },
  { name: "Ancre Traditionnelle", price: 70, size: "4cm", style: "Traditional" },
  { name: "Feuilles Botaniques", price: 110, size: "8cm", style: "Fineline" },
  { name: "Triangle Sacré", price: 100, size: "7cm", style: "Geometric" },
  { name: "Papillon Sombre", price: 160, size: "10cm", style: "Neo-Trad" },
]

const STEPS = [
  {
    num: "01",
    title: "Consultation",
    desc: "Échange en studio ou en ligne. On discute de votre vision, emplacement, style souhaité et vos inspirations. Aucun engagement.",
    icon: <Pen className="w-6 h-6" />,
  },
  {
    num: "02",
    title: "Design",
    desc: "L'artiste crée votre dessin sur mesure. Vous recevez la proposition dans les 48-72h via email avec possibilité de retouches.",
    icon: <Scissors className="w-6 h-6" />,
  },
  {
    num: "03",
    title: "Approbation",
    desc: "Vous validez le design final. Un acompte de 30% sécurise votre créneau. Modifications mineures incluses jusqu'à validation.",
    icon: <Star className="w-6 h-6" />,
  },
  {
    num: "04",
    title: "Séance",
    desc: "Le jour J, studio stérilisé, encres vegan certifiées, équipement dernier cri. Nous veillons à votre confort tout au long.",
    icon: <Award className="w-6 h-6" />,
  },
  {
    num: "05",
    title: "Cicatrisation",
    desc: "Nous vous fournissons un kit de soin complet et assurons un suivi 30 jours post-séance. Retouche offerte si nécessaire.",
    icon: <Heart className="w-6 h-6" />,
  },
]

const PRICING = [
  {
    size: "Small",
    range: "80€ – 150€",
    dimensions: "Jusqu'à 8cm",
    duration: "1 – 2h",
    desc: "Petites pièces, flash designs, letterings simples",
    details: ["Fineline portraits", "Symboles et icônes", "Dates & signatures"],
  },
  {
    size: "Medium",
    range: "150€ – 400€",
    dimensions: "8 – 20cm",
    duration: "2 – 5h",
    desc: "Pièces narratives, bras et chevilles",
    details: ["Compositions florales", "Animaux stylisés", "Mandalas géométriques"],
  },
  {
    size: "Large",
    range: "400€ – 900€+",
    dimensions: "20 – 40cm",
    duration: "5 – 12h",
    desc: "Grandes pièces, dos, cuisses",
    details: ["Back pieces dramatiques", "Compositions Japanese", "Blackwork intégral"],
  },
  {
    size: "Sleeve",
    range: "Sur devis",
    dimensions: "Bras complet",
    duration: "Plusieurs séances",
    desc: "Projet d'envergure, consultation obligatoire",
    details: ["Half sleeve dès 800€", "Full sleeve dès 1800€", "Paiement échelonné"],
  },
]

const FAQS = [
  {
    q: "Est-ce que ça fait vraiment mal ?",
    a: "La douleur varie selon l'emplacement, la durée et votre seuil personnel. Les zones osseuses (côtes, colonne, coudes) sont plus sensibles. Nos artistes adaptent leur rythme et vous encouragent à prendre des pauses. La plupart de nos clients décrivent ça comme une expérience méditative.",
  },
  {
    q: "Comment prendre soin de mon tatouage ?",
    a: "Nous fournissons un kit de soin complet à chaque client. En résumé : film protecteur 24h, hydratation légère quotidienne, pas de soleil direct pendant 3 semaines, pas de bain ni de piscine. Nous assurons un suivi personnalisé sur 30 jours.",
  },
  {
    q: "Dois-je verser un acompte ?",
    a: "Un acompte de 30% du devis est demandé pour confirmer votre créneau. Il est non remboursable en cas d'annulation à moins de 48h. Il sera déduit du montant total le jour de la séance.",
  },
  {
    q: "Peut-on faire recouvrir un ancien tatouage ?",
    a: "Absolument. Nos artistes sont spécialisés dans les cover-ups complexes. Une consultation en studio est indispensable pour évaluer la faisabilité. Selon l'encre existante, certaines options peuvent être limitées.",
  },
  {
    q: "Utilisez-vous des encres vegan ?",
    a: "Oui, à 100%. Toutes nos encres sont certifiées vegan, non testées sur les animaux, et conformes aux normes européennes REACH. Notre équipement est stérilisé à l'autoclave et entièrement à usage unique.",
  },
  {
    q: "À partir de quel âge peut-on se faire tatouer ?",
    a: "Il faut avoir minimum 18 ans révolus. Une pièce d'identité sera systématiquement demandée. Aucune exception ni dérogation parentale — la loi française est claire sur ce point.",
  },
]

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1598452963314-b09f397a5c48?w=800&q=80",
  "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=800&q=80",
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
  "https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=800&q=80",
  "https://images.unsplash.com/photo-1590246814883-55516d5d75e1?w=800&q=80",
  "https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?w=800&q=80",
  "https://images.unsplash.com/photo-1590246814883-55516d5d75e1?w=800&q=80",
  "https://images.unsplash.com/photo-1598452963314-b09f397a5c48?w=800&q=80",
  "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=800&q=80",
]

/* ==========================================================================
   MAIN PAGE
   ========================================================================== */

export default function Impact199Page() {
  useFonts()

  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeStyle, setActiveStyle] = useState<number | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", style: "", message: "", date: "" })
  const [formSent, setFormSent] = useState(false)

  const { scrollYProgress } = useScroll()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"])
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSent(true)
  }

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#000000] text-[#FAFAFA]"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {/* ── Scroll Progress Bar ──────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 h-[2px] bg-[#DC2626] z-[1000] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-[900] transition-all duration-500 ${
          scrolled ? "bg-[#000000]/95 backdrop-blur-md border-b border-white/5" : "bg-transparent"
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="#" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#DC2626] flex items-center justify-center">
              <Pen className="w-4 h-4 text-white" />
            </div>
            <span
              className="text-3xl tracking-widest text-white"
              style={{ fontFamily: "'Bebas Neue', cursive" }}
            >
              ENCRE & ÂME
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {["Styles", "Artistes", "Flash", "Tarifs", "Galerie", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-white/60 hover:text-white transition-colors tracking-wider uppercase"
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTA + Burger */}
          <div className="flex items-center gap-4">
            <a
              href="#contact"
              className="hidden lg:flex items-center gap-2 bg-[#DC2626] hover:bg-[#b91c1c] text-white text-sm font-semibold px-6 py-3 tracking-widest uppercase transition-colors"
            >
              Book Now
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden text-white p-2"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile Menu ─────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[950] bg-[#000000] flex flex-col"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-6 h-20 flex items-center justify-between border-b border-white/10">
              <span
                className="text-3xl tracking-widest"
                style={{ fontFamily: "'Bebas Neue', cursive" }}
              >
                ENCRE & ÂME
              </span>
              <button onClick={() => setMenuOpen(false)} className="p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col flex-1 justify-center px-10 gap-8">
              {["Styles", "Artistes", "Flash", "Tarifs", "Galerie", "Contact"].map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-5xl tracking-widest text-white/80 hover:text-white transition-colors border-b border-white/10 pb-6"
                  style={{ fontFamily: "'Bebas Neue', cursive" }}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {item}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="mt-4 bg-[#DC2626] text-white text-center py-5 text-xl tracking-widest uppercase"
                style={{ fontFamily: "'Bebas Neue', cursive" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Book Now
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        id="hero"
        className="relative h-screen min-h-[700px] flex items-center overflow-hidden"
      >
        {/* Parallax Image */}
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY, opacity: heroOpacity }}>
          <Image
            src="https://images.unsplash.com/photo-1598452963314-b09f397a5c48?w=1920&q=90"
            alt="Studio Encre & Âme"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />
        </motion.div>

        {/* Decorative red line */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-40 bg-[#DC2626] z-10"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Label */}
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="w-8 h-[1px] bg-[#DC2626]" />
              <span className="text-[#DC2626] text-xs tracking-[0.3em] uppercase font-medium">
                Studio de Tatouage — Paris XI
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              className="text-[clamp(4rem,12vw,10rem)] leading-[0.9] tracking-wide text-white mb-6"
              style={{ fontFamily: "'Bebas Neue', cursive" }}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              L'ART VIVANT
              <br />
              <span className="text-[#DC2626]">SUR</span> VOTRE PEAU
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-white/60 text-lg max-w-xl mb-10 leading-relaxed font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Trois artistes d'exception, un seul objectif : transformer votre vision en œuvre permanente. Tatouage sur mesure à Paris depuis 2014.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 bg-[#DC2626] hover:bg-[#b91c1c] text-white font-semibold px-8 py-5 tracking-widest uppercase text-sm transition-all"
              >
                Prendre Rendez-Vous
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#galerie"
                className="inline-flex items-center gap-3 border border-white/20 hover:border-white/60 text-white font-medium px-8 py-5 tracking-widest uppercase text-sm transition-all"
              >
                Voir la Galerie
                <ChevronRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex gap-10 mt-16 pt-10 border-t border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.1 }}
            >
              {[
                { val: "10+", label: "Ans d'expérience" },
                { val: "4 000+", label: "Tatouages réalisés" },
                { val: "3", label: "Artistes experts" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p
                    className="text-4xl text-white"
                    style={{ fontFamily: "'Bebas Neue', cursive" }}
                  >
                    {stat.val}
                  </p>
                  <p className="text-white/40 text-xs tracking-wider uppercase mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase">Scroll</p>
          <motion.div
            className="w-[1px] h-12 bg-gradient-to-b from-white/30 to-transparent"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* ── STYLES SHOWCASE ────────────────────────────────────────── */}
      <section id="styles" className="py-32 bg-[#000000]">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-[#DC2626]" />
              <span className="text-[#DC2626] text-xs tracking-[0.3em] uppercase">Nos Spécialités</span>
            </div>
            <h2
              className="text-[clamp(3rem,8vw,6rem)] leading-none text-white mb-6"
              style={{ fontFamily: "'Bebas Neue', cursive" }}
            >
              LES STYLES
            </h2>
            <p className="text-white/50 max-w-xl text-base leading-relaxed mb-16">
              Du traditionnel américain au fineline contemporain — nos artistes maîtrisent l'ensemble du spectre du tatouage moderne.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STYLES.map((style, i) => (
              <Reveal key={style.name} delay={i * 0.08}>
                <motion.div
                  className="group relative overflow-hidden bg-[#0A0A0A] cursor-pointer border border-white/5 hover:border-[#DC2626]/40 transition-all duration-500"
                  onHoverStart={() => setActiveStyle(i)}
                  onHoverEnd={() => setActiveStyle(null)}
                  whileHover={{ y: -4 }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={style.image}
                      alt={style.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-50 group-hover:brightness-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute top-4 right-4">
                      <span className="bg-[#DC2626] text-white text-xs px-3 py-1 tracking-widest uppercase">
                        {style.tag}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3
                      className="text-3xl text-white mb-3 group-hover:text-[#DC2626] transition-colors duration-300"
                      style={{ fontFamily: "'Bebas Neue', cursive" }}
                    >
                      {style.name}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed">{style.desc}</p>
                    <div className="flex items-center gap-2 mt-4 text-[#DC2626] text-xs tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Explorer ce style</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARTISTES ──────────────────────────────────────────────── */}
      <section id="artistes" className="py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-[#DC2626]" />
              <span className="text-[#DC2626] text-xs tracking-[0.3em] uppercase">L'Équipe</span>
            </div>
            <h2
              className="text-[clamp(3rem,8vw,6rem)] leading-none text-white mb-4"
              style={{ fontFamily: "'Bebas Neue', cursive" }}
            >
              NOS ARTISTES
            </h2>
            <p className="text-white/50 max-w-xl text-base leading-relaxed mb-20">
              Trois talents différents, une même obsession : l'excellence technique au service de votre vision.
            </p>
          </Reveal>

          <div className="space-y-4">
            {ARTISTS.map((artist, i) => (
              <Reveal key={artist.name} delay={i * 0.1}>
                <div className="group grid md:grid-cols-[300px_1fr] border border-white/5 hover:border-white/10 transition-all duration-500 bg-[#0A0A0A]">
                  {/* Photo */}
                  <div className="relative h-72 md:h-auto overflow-hidden">
                    <Image
                      src={artist.image}
                      alt={artist.name}
                      fill
                      className="object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A0A0A] hidden md:block" />
                    <div className="absolute top-4 left-4">
                      <span
                        className={`text-xs px-3 py-1 tracking-widest uppercase ${
                          artist.slots === 0
                            ? "bg-white/20 text-white/60"
                            : artist.slots <= 2
                              ? "bg-amber-500/80 text-black"
                              : "bg-green-500/80 text-black"
                        }`}
                      >
                        {artist.tag}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3
                          className="text-5xl text-white mb-1"
                          style={{ fontFamily: "'Bebas Neue', cursive" }}
                        >
                          {artist.name}
                        </h3>
                        <p className="text-[#DC2626] text-sm tracking-widest uppercase">
                          {artist.specialty}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className="text-4xl text-white/20"
                          style={{ fontFamily: "'Bebas Neue', cursive" }}
                        >
                          {artist.years}
                        </p>
                        <p className="text-white/30 text-xs tracking-wider">ans exp.</p>
                      </div>
                    </div>

                    <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-lg">{artist.bio}</p>

                    <div className="flex items-center gap-6">
                      <a
                        href="#contact"
                        className={`inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 tracking-widest uppercase transition-all ${
                          artist.slots === 0
                            ? "bg-white/10 text-white/40 cursor-not-allowed"
                            : "bg-[#DC2626] hover:bg-[#b91c1c] text-white"
                        }`}
                      >
                        {artist.slots === 0 ? "Liste d'attente" : "Réserver"}
                        <ArrowRight className="w-3 h-3" />
                      </a>
                      <div className="flex items-center gap-2 text-white/30 text-xs">
                        <Clock className="w-3 h-3" />
                        <span>{artist.slots > 0 ? `${artist.slots} créneaux disponibles` : "Complet"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLASH GALLERY ────────────────────────────────────────── */}
      <section id="flash" className="py-32 bg-[#000000]">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-[#DC2626]" />
              <span className="text-[#DC2626] text-xs tracking-[0.3em] uppercase">Disponible Maintenant</span>
            </div>
            <h2
              className="text-[clamp(3rem,8vw,6rem)] leading-none text-white mb-4"
              style={{ fontFamily: "'Bebas Neue', cursive" }}
            >
              FLASH TATTOOS
            </h2>
            <p className="text-white/50 max-w-xl text-base leading-relaxed mb-4">
              Designs prêts à tatouer. Sélectionnez un flash, choisissez votre artiste — rendez-vous disponible sous 72h.
            </p>
          </Reveal>

          {/* Flash grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-12">
            {FLASH_PIECES.map((flash, i) => (
              <Reveal key={flash.name} delay={i * 0.05}>
                <motion.div
                  className="group relative bg-[#0A0A0A] border border-white/5 hover:border-[#DC2626]/50 p-6 cursor-pointer transition-all duration-300"
                  whileHover={{ y: -4 }}
                >
                  {/* Placeholder image for flash design */}
                  <div className="relative h-36 mb-4 overflow-hidden bg-[#111111] flex items-center justify-center">
                    <Pen className="w-12 h-12 text-white/10 group-hover:text-white/20 transition-colors" />
                    <div className="absolute top-2 right-2">
                      <span className="bg-[#DC2626] text-white text-[10px] px-2 py-0.5 tracking-widest uppercase">
                        {flash.style}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-white text-sm font-semibold mb-1">{flash.name}</h4>
                  <p className="text-white/30 text-xs mb-3">{flash.size}</p>

                  <div className="flex items-center justify-between">
                    <span
                      className="text-2xl text-[#DC2626]"
                      style={{ fontFamily: "'Bebas Neue', cursive" }}
                    >
                      {flash.price}€
                    </span>
                    <button className="text-white/40 hover:text-white text-xs tracking-wider uppercase transition-colors flex items-center gap-1">
                      Choisir
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>

          {/* Flash CTA */}
          <Reveal delay={0.2}>
            <div className="mt-12 p-8 border border-[#DC2626]/20 bg-[#DC2626]/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3
                  className="text-3xl text-white mb-2"
                  style={{ fontFamily: "'Bebas Neue', cursive" }}
                >
                  Flash disponibles de 50€ à 250€
                </h3>
                <p className="text-white/50 text-sm">
                  Designs exclusifs créés par nos artistes. Chaque flash est unique — premier arrivé, premier servi.
                </p>
              </div>
              <a
                href="#contact"
                className="flex-shrink-0 bg-[#DC2626] hover:bg-[#b91c1c] text-white font-semibold px-8 py-4 tracking-widest uppercase text-sm transition-all flex items-center gap-2"
              >
                Réserver un Flash
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PROCESSUS ─────────────────────────────────────────────── */}
      <section id="processus" className="py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-[#DC2626]" />
              <span className="text-[#DC2626] text-xs tracking-[0.3em] uppercase">De A à Z</span>
            </div>
            <h2
              className="text-[clamp(3rem,8vw,6rem)] leading-none text-white mb-4"
              style={{ fontFamily: "'Bebas Neue', cursive" }}
            >
              COMMENT ÇA MARCHE
            </h2>
            <p className="text-white/50 max-w-xl text-base leading-relaxed mb-20">
              De votre première idée à la cicatrisation complète — nous vous accompagnons à chaque étape.
            </p>
          </Reveal>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-10 left-10 right-10 h-[1px] bg-gradient-to-r from-[#DC2626]/30 via-[#DC2626]/10 to-transparent hidden lg:block" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {STEPS.map((step, i) => (
                <Reveal key={step.num} delay={i * 0.1}>
                  <div className="relative group">
                    {/* Number badge */}
                    <div className="w-20 h-20 bg-[#0A0A0A] border border-white/10 group-hover:border-[#DC2626]/50 flex items-center justify-center mb-6 transition-all duration-300">
                      <span
                        className="text-3xl text-white/20 group-hover:text-[#DC2626] transition-colors"
                        style={{ fontFamily: "'Bebas Neue', cursive" }}
                      >
                        {step.num}
                      </span>
                    </div>

                    <h3
                      className="text-2xl text-white mb-3"
                      style={{ fontFamily: "'Bebas Neue', cursive" }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TARIFS ───────────────────────────────────────────────── */}
      <section id="tarifs" className="py-32 bg-[#000000]">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-[#DC2626]" />
              <span className="text-[#DC2626] text-xs tracking-[0.3em] uppercase">Transparence Totale</span>
            </div>
            <h2
              className="text-[clamp(3rem,8vw,6rem)] leading-none text-white mb-4"
              style={{ fontFamily: "'Bebas Neue', cursive" }}
            >
              NOS TARIFS
            </h2>
            <p className="text-white/50 max-w-xl text-base leading-relaxed mb-6">
              Les prix varient selon la complexité du design, l'emplacement, la durée de séance et l'artiste choisi. Chaque devis est personnalisé.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {PRICING.map((tier, i) => (
              <Reveal key={tier.size} delay={i * 0.08}>
                <div className="group bg-[#0A0A0A] border border-white/5 hover:border-[#DC2626]/30 p-8 flex flex-col transition-all duration-500 hover:bg-[#0F0F0F]">
                  <div className="flex items-start justify-between mb-6">
                    <h3
                      className="text-4xl text-white"
                      style={{ fontFamily: "'Bebas Neue', cursive" }}
                    >
                      {tier.size}
                    </h3>
                    <span className="text-[#DC2626] text-[10px] tracking-widest uppercase bg-[#DC2626]/10 px-2 py-1">
                      {tier.dimensions}
                    </span>
                  </div>

                  <p
                    className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-white mb-2 leading-none"
                    style={{ fontFamily: "'Bebas Neue', cursive" }}
                  >
                    {tier.range}
                  </p>

                  <div className="flex items-center gap-2 text-white/30 text-xs mb-4">
                    <Clock className="w-3 h-3" />
                    <span>{tier.duration}</span>
                  </div>

                  <p className="text-white/40 text-sm mb-6 leading-relaxed border-b border-white/5 pb-6">
                    {tier.desc}
                  </p>

                  <ul className="space-y-3 flex-1">
                    {tier.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-3 text-white/50 text-sm">
                        <div className="w-1 h-1 bg-[#DC2626] rounded-full flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contact"
                    className="mt-8 border border-white/10 hover:border-[#DC2626] text-white hover:text-[#DC2626] text-xs tracking-widest uppercase py-3 text-center transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Obtenir un devis
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Factors */}
          <Reveal delay={0.2}>
            <div className="mt-12 p-8 bg-[#0A0A0A] border border-white/5">
              <h4
                className="text-2xl text-white mb-6"
                style={{ fontFamily: "'Bebas Neue', cursive" }}
              >
                CE QUI INFLUENCE LE PRIX
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: <Scissors className="w-5 h-5" />, label: "Complexité du design" },
                  { icon: <MapPin className="w-5 h-5" />, label: "Emplacement sur le corps" },
                  { icon: <Clock className="w-5 h-5" />, label: "Durée de la séance" },
                  { icon: <Award className="w-5 h-5" />, label: "Expérience de l'artiste" },
                ].map((factor) => (
                  <div key={factor.label} className="flex items-center gap-3">
                    <div className="text-[#DC2626]">{factor.icon}</div>
                    <span className="text-white/50 text-sm">{factor.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="py-32 bg-[#050505]">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-[#DC2626]" />
              <span className="text-[#DC2626] text-xs tracking-[0.3em] uppercase">Questions Fréquentes</span>
            </div>
            <h2
              className="text-[clamp(3rem,8vw,6rem)] leading-none text-white mb-16"
              style={{ fontFamily: "'Bebas Neue', cursive" }}
            >
              FAQ
            </h2>
          </Reveal>

          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="border border-white/5 bg-[#0A0A0A]">
                  <button
                    className="w-full flex items-center justify-between p-6 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="text-white font-medium pr-4">{faq.q}</span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <ArrowRight className="w-4 h-4 text-[#DC2626]" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 border-t border-white/5 pt-4">
                          <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALERIE ────────────────────────────────────────────────── */}
      <section id="galerie" className="py-32 bg-[#000000]">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-[#DC2626]" />
              <span className="text-[#DC2626] text-xs tracking-[0.3em] uppercase">Portfolio</span>
            </div>
            <h2
              className="text-[clamp(3rem,8vw,6rem)] leading-none text-white mb-4"
              style={{ fontFamily: "'Bebas Neue', cursive" }}
            >
              LA GALERIE
            </h2>
            <p className="text-white/50 max-w-xl text-base leading-relaxed mb-16">
              Chaque tatouage est une conversation entre l'artiste et son client. Voici quelques-unes de nos œuvres récentes.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {GALLERY_IMAGES.map((img, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <motion.div
                  className={`relative overflow-hidden bg-[#0A0A0A] cursor-pointer group ${
                    i === 0 ? "row-span-2 col-span-1" : ""
                  }`}
                  style={{ aspectRatio: i === 0 ? "3/4" : "1/1" }}
                  whileHover={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={img}
                    alt={`Tattoo ${i + 1}`}
                    fill
                    className="object-cover filter grayscale hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black">
                    <p className="text-white text-xs tracking-widest uppercase">Voir en détail</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="text-center mt-12">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border border-white/20 hover:border-white/60 text-white px-8 py-4 tracking-widest uppercase text-sm transition-all"
              >
                <Instagram className="w-4 h-4" />
                Voir tout le portfolio sur Instagram
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CONTACT / BOOKING ──────────────────────────────────────── */}
      <section id="contact" className="py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left: Info */}
            <RevealLeft>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-[1px] bg-[#DC2626]" />
                <span className="text-[#DC2626] text-xs tracking-[0.3em] uppercase">Venir Nous Voir</span>
              </div>
              <h2
                className="text-[clamp(3rem,6vw,5rem)] leading-none text-white mb-8"
                style={{ fontFamily: "'Bebas Neue', cursive" }}
              >
                PRENDRE RENDEZ-VOUS
              </h2>
              <p className="text-white/50 text-base leading-relaxed mb-12 max-w-md">
                Complétez le formulaire ci-contre ou contactez-nous directement. Nous répondons sous 24h pour confirmer votre créneau.
              </p>

              {/* Contact info */}
              <div className="space-y-6 mb-12">
                {[
                  {
                    icon: <MapPin className="w-5 h-5" />,
                    label: "Adresse",
                    value: "42 Rue Oberkampf, 75011 Paris",
                    sub: "Métro Oberkampf (Ligne 5 & 9)",
                  },
                  {
                    icon: <Phone className="w-5 h-5" />,
                    label: "Téléphone",
                    value: "+33 1 42 00 00 00",
                    sub: "Du mardi au samedi",
                  },
                  {
                    icon: <Mail className="w-5 h-5" />,
                    label: "Email",
                    value: "contact@encre-ame.fr",
                    sub: "Réponse sous 24h",
                  },
                  {
                    icon: <Clock className="w-5 h-5" />,
                    label: "Horaires",
                    value: "Mar – Sam : 10h – 20h",
                    sub: "Fermé dimanche et lundi",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4 group">
                    <div className="text-[#DC2626] mt-0.5 flex-shrink-0">{item.icon}</div>
                    <div>
                      <p className="text-white/30 text-xs tracking-wider uppercase mb-0.5">{item.label}</p>
                      <p className="text-white text-sm font-medium">{item.value}</p>
                      <p className="text-white/40 text-xs">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div className="flex items-center gap-4">
                <p className="text-white/30 text-xs tracking-widest uppercase">Suivez-nous</p>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-white/10 hover:border-[#DC2626] flex items-center justify-center text-white/50 hover:text-[#DC2626] transition-all"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </RevealLeft>

            {/* Right: Form */}
            <RevealRight>
              <div className="bg-[#0A0A0A] border border-white/5 p-8">
                {formSent ? (
                  <motion.div
                    className="flex flex-col items-center justify-center h-80 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="w-16 h-16 bg-[#DC2626]/10 flex items-center justify-center mb-4">
                      <Heart className="w-8 h-8 text-[#DC2626]" />
                    </div>
                    <h3
                      className="text-3xl text-white mb-3"
                      style={{ fontFamily: "'Bebas Neue', cursive" }}
                    >
                      MESSAGE ENVOYÉ
                    </h3>
                    <p className="text-white/50 text-sm max-w-xs">
                      On revient vers vous dans les 24h pour confirmer votre rendez-vous. À bientôt !
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h3
                      className="text-3xl text-white mb-6"
                      style={{ fontFamily: "'Bebas Neue', cursive" }}
                    >
                      VOTRE PROJET
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-[#111111] border border-white/10 focus:border-[#DC2626] text-white text-sm px-4 py-3 outline-none transition-colors"
                          placeholder="Jean Dupont"
                        />
                      </div>
                      <div>
                        <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-[#111111] border border-white/10 focus:border-[#DC2626] text-white text-sm px-4 py-3 outline-none transition-colors"
                          placeholder="+33 6 00 00 00 00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#111111] border border-white/10 focus:border-[#DC2626] text-white text-sm px-4 py-3 outline-none transition-colors"
                        placeholder="jean@example.com"
                      />
                    </div>

                    <div>
                      <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">
                        Style souhaité
                      </label>
                      <select
                        value={formData.style}
                        onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                        className="w-full bg-[#111111] border border-white/10 focus:border-[#DC2626] text-white text-sm px-4 py-3 outline-none transition-colors"
                      >
                        <option value="">Choisir un style</option>
                        {STYLES.map((s) => (
                          <option key={s.name} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                        <option value="Flash">Flash tattoo</option>
                        <option value="Conseil">Besoin de conseils</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">
                        Date souhaitée
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-[#111111] border border-white/10 focus:border-[#DC2626] text-white text-sm px-4 py-3 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">
                        Décrivez votre projet
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-[#111111] border border-white/10 focus:border-[#DC2626] text-white text-sm px-4 py-3 outline-none transition-colors resize-none"
                        placeholder="Décrivez votre idée, l'emplacement souhaité, les dimensions approximatives..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#DC2626] hover:bg-[#b91c1c] text-white font-semibold py-5 tracking-widest uppercase text-sm transition-all flex items-center justify-center gap-2"
                    >
                      Envoyer ma demande
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <p className="text-white/20 text-xs text-center">
                      Acompte de 30% demandé à la confirmation. Réponse sous 24h.
                    </p>
                  </form>
                )}
              </div>
            </RevealRight>
          </div>
        </div>
      </section>

      {/* ── STUDIO FEATURES ───────────────────────────────────────── */}
      <section className="py-24 bg-[#000000] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-[#DC2626]" />
              <span className="text-[#DC2626] text-xs tracking-[0.3em] uppercase">Notre Engagement</span>
            </div>
            <h2
              className="text-[clamp(3rem,8vw,5rem)] leading-none text-white mb-16"
              style={{ fontFamily: "'Bebas Neue', cursive" }}
            >
              POURQUOI NOUS CHOISIR
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Award className="w-8 h-8 text-[#DC2626]" />,
                title: "Hygiène Irréprochable",
                desc: "Stérilisation autoclave systématique. Matériel entièrement à usage unique. Nous dépassons les normes sanitaires en vigueur.",
              },
              {
                icon: <Users className="w-8 h-8 text-[#DC2626]" />,
                title: "Équipe Certifiée",
                desc: "Nos trois artistes sont certifiés par la Société Française de Tatouage. Formations continues en Europe et au Japon.",
              },
              {
                icon: <Heart className="w-8 h-8 text-[#DC2626]" />,
                title: "Encres Vegan",
                desc: "100% vegan, conformes REACH, non testées sur les animaux. Nous ne faisons aucun compromis sur les matériaux.",
              },
              {
                icon: <Star className="w-8 h-8 text-[#DC2626]" />,
                title: "Suivi 30 Jours",
                desc: "Kit de soin offert à chaque client. Retouche gratuite si nécessaire. Nous ne vous abandonnons pas après la séance.",
              },
            ].map((feature, i) => (
              <Reveal key={feature.title} delay={i * 0.1}>
                <div className="group bg-[#0A0A0A] border border-white/5 hover:border-[#DC2626]/30 p-8 transition-all duration-500">
                  <div className="mb-5">{feature.icon}</div>
                  <h3
                    className="text-2xl text-white mb-3"
                    style={{ fontFamily: "'Bebas Neue', cursive" }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE TESTIMONIALS ───────────────────────────────────── */}
      <section className="py-20 bg-[#050505] overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-[#DC2626]" />
              <span className="text-[#DC2626] text-xs tracking-[0.3em] uppercase">Ce qu'ils disent</span>
            </div>
            <h2
              className="text-[clamp(3rem,8vw,5rem)] leading-none text-white"
              style={{ fontFamily: "'Bebas Neue', cursive" }}
            >
              TÉMOIGNAGES
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 max-w-7xl mx-auto">
          {[
            {
              name: "Camille R.",
              text: "Kira a su comprendre exactement ce que je voulais. Le résultat dépasse tout ce que j'avais imaginé. Chef-d'œuvre.",
              style: "Japanese",
              stars: 5,
            },
            {
              name: "Thomas D.",
              text: "Théo est un génie de la géométrie. Mon sleeve blackwork est une œuvre d'art. Studio impeccable, équipe pro.",
              style: "Blackwork",
              stars: 5,
            },
            {
              name: "Éléonore V.",
              text: "Léa a réalisé mon tatouage floral fineline avec une précision époustouflante. Je recommande les yeux fermés.",
              style: "Fineline",
              stars: 5,
            },
          ].map((testimonial, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="bg-[#0A0A0A] border border-white/5 p-8 space-y-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: testimonial.stars }).map((_, j) => (
                    <Star key={j} className="w-3 h-3 text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-white/60 text-sm leading-relaxed italic">"{testimonial.text}"</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-white text-sm font-medium">{testimonial.name}</span>
                  <span className="text-[#DC2626] text-[10px] tracking-widest uppercase bg-[#DC2626]/10 px-2 py-0.5">
                    {testimonial.style}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <Reveal delay={0.3}>
          <div className="max-w-7xl mx-auto px-6 mt-12">
            <div className="bg-[#DC2626] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3
                  className="text-3xl text-white mb-1"
                  style={{ fontFamily: "'Bebas Neue', cursive" }}
                >
                  PRÊT À ÉCRIRE VOTRE HISTOIRE SUR VOTRE PEAU ?
                </h3>
                <p className="text-white/70 text-sm">Consultation gratuite — réponse sous 24h</p>
              </div>
              <a
                href="#contact"
                className="flex-shrink-0 bg-white hover:bg-white/90 text-[#DC2626] font-semibold px-8 py-4 tracking-widest uppercase text-sm transition-all flex items-center gap-2"
              >
                Réserver maintenant
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="bg-[#000000] border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-[#DC2626] flex items-center justify-center">
                <Pen className="w-3 h-3 text-white" />
              </div>
              <span
                className="text-2xl tracking-widest text-white"
                style={{ fontFamily: "'Bebas Neue', cursive" }}
              >
                ENCRE & ÂME
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              {["Styles", "Artistes", "Flash", "Tarifs", "Galerie", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-white/30 text-xs hover:text-white/60 transition-colors tracking-wider uppercase"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="text-center md:text-right space-y-1">
              <p className="text-white/20 text-xs">
                © {new Date().getFullYear()} Encre & Âme. Tous droits réservés.
              </p>
              <p className="text-white/15 text-xs">42 Rue Oberkampf, Paris XI</p>
              <div className="flex items-center justify-center md:justify-end gap-4 mt-2">
                {["Mentions légales", "Confidentialité", "CGV"].map((item) => (
                  <a key={item} href="#" className="text-white/20 text-[10px] hover:text-white/40 transition-colors">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
