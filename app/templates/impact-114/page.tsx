// @ts-nocheck
"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
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

  Camera,
  Mountain,
  Leaf,
  Wind,
  Sun,
  MapPin,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Menu,
  X,
  Download,
  Mail,
  Globe,
  Star,
} from "lucide-react"

const Instagram = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="5"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

/* ==========================================================================
   FONTS — Playfair Display + Source Serif 4
   ========================================================================== */

function useFonts() {
  useEffect(() => {
    const id = "terra-fonts"
    if (document.getElementById(id)) return
    const link = document.createElement("link")
    link.id = id
    link.rel = "stylesheet"
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,600&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap"
    document.head.appendChild(link)

    const style = document.createElement("style")
    style.innerHTML = `
      .font-playfair { font-family: 'Playfair Display', Georgia, serif; }
      .font-source-serif { font-family: 'Source Serif 4', Georgia, serif; }
      @keyframes float-slow {
        0%,100% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
      }
      .float-slow { animation: float-slow 6s ease-in-out infinite; }
      @keyframes grain {
        0%,100%{transform:translate(0,0)}
        10%{transform:translate(-1%,-1%)}
        20%{transform:translate(1%,1%)}
        30%{transform:translate(-1%,1%)}
        40%{transform:translate(1%,-1%)}
        50%{transform:translate(-1%,0)}
        60%{transform:translate(0,1%)}
        70%{transform:translate(1%,0)}
        80%{transform:translate(0,-1%)}
        90%{transform:translate(-1%,1%)}
      }
      .film-grain::after {
        content: '';
        position: absolute;
        inset: -50%;
        width: 200%;
        height: 200%;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
        animation: grain 0.5s steps(1) infinite;
        opacity: 0.3;
        pointer-events: none;
      }
    `
    document.head.appendChild(style)
  }, [])
}

/* ==========================================================================
   DATA
   ========================================================================== */

const NAV_LINKS = ["Collections", "Tirages", "Terrain", "À propos", "Contact"]

const SLIDES = [
  {
    id: 1,
    title: "Forêts Primaires",
    subtitle: "Amazonie, Brésil",
    desc: "Dans les profondeurs de la forêt amazonienne, là où la lumière ne touche jamais le sol.",
    img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1800&q=90&auto=format&fit=crop",
    season: "Saison des pluies",
    year: "2024",
  },
  {
    id: 2,
    title: "Sommets Alpins",
    subtitle: "Mont-Blanc, France",
    desc: "Le silence absolu des hauteurs, où chaque pas laisse une empreinte dans l'éternité.",
    img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1800&q=90&auto=format&fit=crop",
    season: "Hiver",
    year: "2023",
  },
  {
    id: 3,
    title: "Océans Profonds",
    subtitle: "Pacifique Sud",
    desc: "La frontière entre le monde connu et l'inconnu infini. L'horizon qui appelle.",
    img: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1800&q=90&auto=format&fit=crop",
    season: "Tempête",
    year: "2024",
  },
  {
    id: 4,
    title: "Déserts Dorés",
    subtitle: "Sahara, Maroc",
    desc: "Les dunes sculptées par le vent racontent l'histoire de millions d'années.",
    img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1800&q=90&auto=format&fit=crop",
    season: "Aube",
    year: "2023",
  },
  {
    id: 5,
    title: "Arctique Bleu",
    subtitle: "Spitzberg, Norvège",
    desc: "La dernière frontière. Un monde de glace et de lumière qui disparaît trop vite.",
    img: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1800&q=90&auto=format&fit=crop",
    season: "Nuit polaire",
    year: "2025",
  },
]

const COLLECTIONS = [
  {
    name: "Forêts Primaires",
    count: 42,
    location: "Amazonie, Borneo, Congo",
    icon: Leaf,
    img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80&auto=format&fit=crop",
  },
  {
    name: "Sommets Alpins",
    count: 38,
    location: "Alpes, Himalaya, Andes",
    icon: Mountain,
    img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80&auto=format&fit=crop",
  },
  {
    name: "Océans Profonds",
    count: 55,
    location: "Pacifique, Atlantique, Indien",
    icon: Wind,
    img: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600&q=80&auto=format&fit=crop",
  },
  {
    name: "Déserts Dorés",
    count: 29,
    location: "Sahara, Atacama, Gobi",
    icon: Sun,
    img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600&q=80&auto=format&fit=crop",
  },
  {
    name: "Steppes Sauvages",
    count: 33,
    location: "Mongolie, Kazakhstan, Patagonie",
    icon: Wind,
    img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80&auto=format&fit=crop",
  },
  {
    name: "Arctique Bleu",
    count: 21,
    location: "Spitzberg, Islande, Groenland",
    icon: Wind,
    img: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80&auto=format&fit=crop",
  },
]

const PRINTS = [
  {
    size: "30 × 20 cm",
    price: "89",
    label: "Découverte",
    desc: "Format portrait de bureau. Papier Hahnemühle Photo Rag 308g, impression pigmentaire archivale.",
    details: ["Papier 308g acid-free", "Durée vie estimée 100+ ans", "Sous film de protection"],
    featured: false,
  },
  {
    size: "60 × 40 cm",
    price: "189",
    label: "Signature",
    desc: "Le format idéal pour valoriser un intérieur. Numérotation et signature manuscrite incluses.",
    details: ["Édition limitée 50 ex.", "Certificat d'authenticité", "Emballage premium bois"],
    featured: true,
  },
  {
    size: "90 × 60 cm",
    price: "289",
    label: "Collector",
    desc: "Grand format d'exposition. Présence inégalée. Tirage collector avec encadrement option.",
    details: ["Édition limitée 25 ex.", "Encadrement aluminium option", "Livraison white-glove"],
    featured: false,
  },
]

const FIELD_NOTES = [
  {
    location: "Forêt Lacandone, Chiapas",
    date: "14 mars 2024",
    icon: Leaf,
    excerpt:
      "Trois semaines dans l'une des dernières forêts primaires de Mésoamérique. La pluie ne s'arrête jamais vraiment — elle devient une présence constante, une respiration. J'ai attendu sept jours cette lumière oblique qui traverse la canopée à 6h47.",
  },
  {
    location: "Vallée de Chamonix, Alpes",
    date: "2 janvier 2023",
    icon: Mountain,
    excerpt:
      "−28°C au sommet. L'équipement se fige, les doigts refusent d'obtempérer. Mais il y a dans ce silence arctique quelque chose d'absolument pur. La montagne ne ment pas : elle est exactement ce qu'elle est.",
  },
  {
    location: "Erg Chebbi, Maroc",
    date: "17 octobre 2023",
    icon: Sun,
    excerpt:
      "Le désert se lève avant le soleil. J'ai marché deux heures dans l'obscurité pour atteindre cette dune précise. À l'aube, les ombres créent une géographie en perpétuel mouvement. Chaque seconde est une photographie différente.",
  },
]

const PROCESS_STEPS = [
  {
    n: "01",
    title: "Planification",
    icon: MapPin,
    desc: "Chaque expédition commence des mois avant le départ. Analyse météorologique, cartographie des lumières, étude des saisons. La photographie de nature ne laisse aucune place à l'improvisation.",
  },
  {
    n: "02",
    title: "Terrain",
    icon: Mountain,
    desc: "Des semaines, parfois des mois sur place. Le temps de comprendre un lieu, d'en saisir les rythmes. Lever avant l'aube, veilles nocturnes, marches en altitude. La patience est le premier outil.",
  },
  {
    n: "03",
    title: "Traitement",
    icon: Camera,
    desc: "Le développement RAW respecte ce que l'œil a vu. Aucun élément ajouté, aucun ciel de substitution. La retouche sert la vérité de l'instant — jamais son embellissement.",
  },
  {
    n: "04",
    title: "Impression",
    icon: Star,
    desc: "Chaque tirage est produit en atelier partenaire, contrôlé à la colorimétrie calibrée. Papiers archivaux Hahnemühle, encres pigmentaires longue durée. Un tirage Terra est fait pour durer cent ans.",
  },
]

/* ==========================================================================
   COMPONENTS
   ========================================================================== */

function Reveal({
  children,
  delay = 0,
  y = 50,
  x = 0,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  x?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 1.3, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-[#2d1b0e]/10" />
      <Leaf className="w-3 h-3 text-[#3d5a3e]/40" />
      <div className="flex-1 h-px bg-[#2d1b0e]/10" />
    </div>
  )
}

/* ==========================================================================
   CURTAIN SLIDER — THE SHOWSTOPPER
   ========================================================================== */

function CurtainSlider() {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback(
    (next: number, dir: 1 | -1) => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setPrev(current)
      setDirection(dir)
      setCurrent(next)
      setTimeout(() => {
        setPrev(null)
        setIsTransitioning(false)
      }, 1100)
    },
    [current, isTransitioning]
  )

  const goNext = useCallback(() => {
    goTo((current + 1) % SLIDES.length, 1)
  }, [current, goTo])

  const goPrev = useCallback(() => {
    goTo((current - 1 + SLIDES.length) % SLIDES.length, -1)
  }, [current, goTo])

  const resetAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current)
    autoRef.current = setInterval(goNext, 5200)
  }, [goNext])

  useEffect(() => {
    autoRef.current = setInterval(goNext, 5200)
    return () => { if (autoRef.current) clearInterval(autoRef.current) }
  }, [goNext])

  const handleNext = () => { goNext(); resetAuto() }
  const handlePrev = () => { goPrev(); resetAuto() }
  const handleDot = (i: number) => {
    if (i === current || isTransitioning) return
    goTo(i, i > current ? 1 : -1)
    resetAuto()
  }

  const slide = SLIDES[current]
  const prevSlide = prev !== null ? SLIDES[prev] : null

  return (
    <div id="hero" className="relative w-full h-screen overflow-hidden bg-[#1a1a1a]">
      {/* Previous slide — stays underneath */}
      {prevSlide && (
        <div className="absolute inset-0 z-0">
          <Image
            src={prevSlide.img}
            alt={prevSlide.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/65" />
        </div>
      )}

      {/* Current slide */}
      <div className="absolute inset-0 z-10">
        <Image
          src={slide.img}
          alt={slide.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />
      </div>

      {/* CURTAIN — the core reveal animation */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key={`curtain-${current}-${direction}`}
            className="absolute inset-0 z-20"
            style={{ backgroundColor: "#faf8f3" }}
            initial={{
              scaleX: 1,
              transformOrigin: direction === 1 ? "0% 50%" : "100% 50%",
              x: direction === 1 ? "0%" : "0%",
            }}
            animate={{
              scaleX: 0,
              transformOrigin: direction === 1 ? "100% 50%" : "0% 50%",
            }}
            transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Slide text content */}
      <div className="absolute inset-0 z-30 flex flex-col justify-end px-8 md:px-16 pb-20 md:pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${current}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-4 h-4 text-white/50" />
              <span
                className="text-sm text-white/55 tracking-[0.25em] uppercase"
                style={{ fontFamily: "'Source Serif 4', serif" }}
              >
                {slide.subtitle}
              </span>
              <span className="text-white/20 mx-1">·</span>
              <span className="text-sm text-white/35" style={{ fontFamily: "'Source Serif 4', serif" }}>
                {slide.season} {slide.year}
              </span>
            </div>

            <h2
              className="text-5xl md:text-7xl lg:text-[8vw] text-white mb-5 leading-[0.9]"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
            >
              {slide.title}
            </h2>

            <p
              className="text-white/55 text-base md:text-lg max-w-lg leading-relaxed"
              style={{ fontFamily: "'Source Serif 4', serif", fontStyle: "italic" }}
            >
              {slide.desc}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="flex items-center gap-6 mt-10">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="w-12 h-12 border border-white/20 flex items-center justify-center text-white/55 hover:border-white/55 hover:text-white transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 border border-white/20 flex items-center justify-center text-white/55 hover:border-white/55 hover:text-white transition-all"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-3">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDot(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="relative h-[2px] transition-all duration-500 overflow-hidden"
                style={{ width: i === current ? "32px" : "12px" }}
              >
                <div className="absolute inset-0 bg-white/20" />
                {i === current && (
                  <motion.div
                    layoutId="dot"
                    className="absolute inset-0 bg-white"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="ml-auto">
            <span
              className="text-white/35 text-sm tabular-nums"
              style={{ fontFamily: "'Source Serif 4', serif" }}
            >
              {String(current + 1).padStart(2, "0")}
              <span className="text-white/20 mx-1">/</span>
              {String(SLIDES.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* Film grain */}
      <div className="film-grain absolute inset-0 z-[31] pointer-events-none" />
    </div>
  )
}

/* ==========================================================================
   MAIN PAGE
   ========================================================================== */

export default function Impact114Page() {
  useFonts()

  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [emailInput, setEmailInput] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [hoveredCollection, setHoveredCollection] = useState<number | null>(null)
  const [selectedPrint, setSelectedPrint] = useState(1)
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" })
  const [contactSent, setContactSent] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  // Parallax for about section image
  const aboutRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: aboutProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"],
  })
  const aboutImgY = useTransform(aboutProgress, [0, 1], [-60, 60])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      ref={containerRef}
      className="bg-[#faf8f3] text-[#2d1b0e] overflow-x-hidden min-h-screen selection:bg-[#3d5a3e]/15 selection:text-[#2d1b0e]"
      style={{ fontFamily: "'Source Serif 4', serif" }}
    >
      {/* SCROLL PROGRESS BAR */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left bg-[#3d5a3e]"
        style={{ scaleX }}
      />

      {/* ================================================================
          1. NAVIGATION
          ================================================================ */}
      <motion.nav
        className="fixed top-[2px] left-0 right-0 z-50 transition-all duration-500"
        animate={{
          backgroundColor: scrolled ? "rgba(250,248,243,0.96)" : "transparent",
          borderBottomWidth: "1px",
          borderBottomColor: scrolled ? "rgba(45,27,14,0.07)" : "transparent",
        }}
        style={{ backdropFilter: scrolled ? "blur(20px)" : "none" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="#hero" className="flex items-center gap-2 group">
            <Leaf className="w-4 h-4 text-[#3d5a3e] group-hover:rotate-12 transition-transform" />
            <span
              className="text-2xl tracking-[0.15em] text-[#2d1b0e]"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}
            >
              TERRA
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link}
                href={`#${link.toLowerCase().replace("à", "a").replace(/ /g, "")}`}
                className="text-[11px] font-light tracking-[0.2em] uppercase text-[#2d1b0e]/45 hover:text-[#2d1b0e] transition-colors"
                style={{ fontFamily: "'Source Serif 4', serif" }}
              >
                {link}
              </Link>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="#tirages"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-[#2d1b0e] text-[#faf8f3] text-[11px] tracking-[0.2em] uppercase hover:bg-[#3d5a3e] transition-colors"
              style={{ fontFamily: "'Source Serif 4', serif" }}
            >
              Voir les tirages
              <ArrowRight className="w-3 h-3" />
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-[#2d1b0e]/50 hover:text-[#2d1b0e] transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#faf8f3]/97 border-t border-[#2d1b0e]/6 overflow-hidden"
            >
              <div className="px-6 py-6 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    onClick={() => setMenuOpen(false)}
                    className="text-base text-[#2d1b0e]/55 hover:text-[#2d1b0e] transition-colors py-3 border-b border-[#2d1b0e]/5"
                    style={{ fontFamily: "'Source Serif 4', serif" }}
                  >
                    {link}
                  </Link>
                ))}
                <Link
                  href="#tirages"
                  onClick={() => setMenuOpen(false)}
                  className="mt-4 flex items-center justify-center gap-2 px-5 py-3 bg-[#2d1b0e] text-[#faf8f3] text-sm tracking-widest uppercase"
                  style={{ fontFamily: "'Source Serif 4', serif" }}
                >
                  Voir les tirages
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ================================================================
          2. HERO — FULL-SCREEN CURTAIN REVEAL SLIDER
          ================================================================ */}
      <CurtainSlider />

      {/* ================================================================
          3. COLLECTIONS
          ================================================================ */}
      <section id="collections" className="py-28 px-6 md:px-12 max-w-[1400px] mx-auto">
        <Reveal>
          <div className="max-w-2xl mb-16">
            <span
              className="text-[11px] tracking-[0.3em] uppercase text-[#3d5a3e] block mb-5"
              style={{ fontFamily: "'Source Serif 4', serif" }}
            >
              — Photographie de nature
            </span>
            <h2
              className="text-5xl md:text-6xl text-[#2d1b0e] mb-6 leading-[1.1]"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
            >
              Les Collections
            </h2>
            <p
              className="text-[#8b7355] text-lg leading-relaxed"
              style={{ fontFamily: "'Source Serif 4', serif", fontStyle: "italic" }}
            >
              Chaque série est le résultat d'une immersion totale — des semaines, parfois des mois dans un seul écosystème, jusqu'à en saisir l'essence.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COLLECTIONS.map((col, i) => {
            const isHovered = hoveredCollection === i
            return (
              <Reveal key={col.name} delay={i * 0.08}>
                <motion.div
                  onHoverStart={() => setHoveredCollection(i)}
                  onHoverEnd={() => setHoveredCollection(null)}
                  whileHover={{ y: -6 }}
                  className="relative group cursor-pointer overflow-hidden"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={col.img}
                      alt={col.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2d1b0e]/70 via-transparent to-transparent" />

                    <motion.div
                      className="absolute inset-0 bg-[#3d5a3e]/25"
                      animate={{ opacity: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.4 }}
                    />

                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="flex items-end justify-between">
                        <div>
                          <h3
                            className="text-white text-lg font-bold"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                          >
                            {col.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="w-3 h-3 text-white/45" />
                            <span className="text-white/45 text-xs" style={{ fontFamily: "'Source Serif 4', serif" }}>
                              {col.location}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className="text-2xl font-bold text-white"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                          >
                            {col.count}
                          </span>
                          <span className="text-white/35 text-xs block" style={{ fontFamily: "'Source Serif 4', serif" }}>
                            photos
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    className="absolute top-4 right-4"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-8 h-8 bg-[#faf8f3]/90 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-[#2d1b0e]" />
                    </div>
                  </motion.div>
                </motion.div>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* ================================================================
          4. PRINT SHOP
          ================================================================ */}
      <section id="tirages" className="py-28 px-6 md:px-12 bg-[#2d1b0e]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="max-w-2xl mb-16">
              <span
                className="text-[11px] tracking-[0.3em] uppercase text-[#8b7355] block mb-5"
                style={{ fontFamily: "'Source Serif 4', serif" }}
              >
                — Éditions limitées
              </span>
              <h2
                className="text-5xl md:text-6xl text-[#faf8f3] mb-6 leading-[1.1]"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
              >
                Les Tirages
              </h2>
              <p
                className="text-[#8b7355] text-lg leading-relaxed"
                style={{ fontFamily: "'Source Serif 4', serif", fontStyle: "italic" }}
              >
                Chaque tirage est produit à la main dans notre atelier partenaire. Papiers archivaux, encres pigmentaires, éditions numérotées.
              </p>
            </div>
          </Reveal>

          {/* Format tabs */}
          <div className="flex gap-3 mb-10 flex-wrap">
            {PRINTS.map((p, i) => (
              <button
                key={i}
                onClick={() => setSelectedPrint(i)}
                className="px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase transition-all border"
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  backgroundColor: selectedPrint === i ? "#faf8f3" : "transparent",
                  borderColor: selectedPrint === i ? "#faf8f3" : "rgba(250,248,243,0.18)",
                  color: selectedPrint === i ? "#2d1b0e" : "rgba(250,248,243,0.45)",
                }}
              >
                {p.size}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-[#faf8f3]/5">
            {PRINTS.map((p, i) => (
              <Reveal key={p.size} delay={i * 0.1}>
                <motion.div
                  onClick={() => setSelectedPrint(i)}
                  className="p-8 cursor-pointer border relative"
                  animate={{
                    backgroundColor: selectedPrint === i ? "rgba(250,248,243,0.05)" : "rgba(0,0,0,0)",
                    borderColor: selectedPrint === i ? "rgba(250,248,243,0.15)" : "transparent",
                  }}
                >
                  {p.featured && (
                    <div className="absolute top-4 right-4">
                      <span
                        className="text-[10px] tracking-widest uppercase px-2 py-1 bg-[#3d5a3e] text-[#faf8f3]"
                        style={{ fontFamily: "'Source Serif 4', serif" }}
                      >
                        Populaire
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <span
                      className="text-[11px] text-[#8b7355] tracking-widest uppercase block mb-2"
                      style={{ fontFamily: "'Source Serif 4', serif" }}
                    >
                      {p.label}
                    </span>
                    <h3
                      className="text-2xl text-[#faf8f3] font-bold"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {p.size}
                    </h3>
                  </div>

                  <div className="mb-6">
                    <span
                      className="text-5xl font-bold text-[#faf8f3]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {p.price}€
                    </span>
                  </div>

                  <p
                    className="text-[#8b7355] text-sm leading-relaxed mb-6"
                    style={{ fontFamily: "'Source Serif 4', serif" }}
                  >
                    {p.desc}
                  </p>

                  <div className="space-y-2 mb-8">
                    {p.details.map((d, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <Leaf className="w-3 h-3 text-[#3d5a3e] flex-shrink-0" />
                        <span
                          className="text-xs text-[#faf8f3]/45"
                          style={{ fontFamily: "'Source Serif 4', serif" }}
                        >
                          {d}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    className="w-full py-3 text-[11px] tracking-[0.2em] uppercase transition-all border flex items-center justify-center gap-2"
                    style={{
                      fontFamily: "'Source Serif 4', serif",
                      backgroundColor: selectedPrint === i ? "#faf8f3" : "transparent",
                      borderColor: selectedPrint === i ? "#faf8f3" : "rgba(250,248,243,0.18)",
                      color: selectedPrint === i ? "#2d1b0e" : "rgba(250,248,243,0.45)",
                    }}
                  >
                    <Download className="w-3 h-3" />
                    Commander ce format
                  </button>
                </motion.div>
              </Reveal>
            ))}
          </div>

          {/* Quality pillars */}
          <Reveal delay={0.3}>
            <div className="mt-12 border-t border-[#faf8f3]/8 pt-10 grid md:grid-cols-3 gap-8">
              {[
                { icon: Star, title: "Archival Quality", desc: "Papiers et encres conçus pour traverser les siècles sans altération." },
                { icon: Camera, title: "Signature Manuscrite", desc: "Chaque tirage est signé et numéroté personnellement par l'auteur." },
                { icon: Globe, title: "Expédition mondiale", desc: "Emballage museum-grade, livraison assurée partout dans le monde." },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-8 h-8 border border-[#faf8f3]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-[#8b7355]" />
                    </div>
                    <div>
                      <h4
                        className="text-[#faf8f3]/75 text-sm font-bold mb-1"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {item.title}
                      </h4>
                      <p
                        className="text-[#8b7355] text-xs leading-relaxed"
                        style={{ fontFamily: "'Source Serif 4', serif" }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================================================================
          5. ABOUT PHOTOGRAPHER
          ================================================================ */}
      <section id="apropos" ref={aboutRef} className="py-28 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Portrait with parallax */}
          <Reveal x={-40}>
            <div className="relative aspect-[3/4] overflow-hidden">
              <motion.div
                style={{ y: aboutImgY }}
                className="absolute inset-0"
                style={{ top: "-60px", bottom: "-60px", left: 0, right: 0, y: aboutImgY }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=85&auto=format&fit=crop"
                  alt="Julien Moreau photographe"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </motion.div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#2d1b0e]/75 to-transparent p-8 z-10">
                <span
                  className="text-[#faf8f3]/50 text-xs tracking-[0.2em] uppercase"
                  style={{ fontFamily: "'Source Serif 4', serif" }}
                >
                  Forêt Lacandone, Mexique · 2024
                </span>
              </div>
            </div>
          </Reveal>

          {/* Text */}
          <Reveal x={40} delay={0.15}>
            <div>
              <span
                className="text-[11px] tracking-[0.3em] uppercase text-[#3d5a3e] block mb-6"
                style={{ fontFamily: "'Source Serif 4', serif" }}
              >
                — Le photographe
              </span>

              <h2
                className="text-4xl md:text-5xl text-[#2d1b0e] mb-8 leading-[1.15]"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
              >
                Julien Moreau
              </h2>

              {/* Italic pullquote */}
              <blockquote
                className="text-xl text-[#3d5a3e] leading-relaxed mb-8 pl-6 border-l-2 border-[#3d5a3e]/25"
                style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
              >
                "Je ne cherche pas le beau. Je cherche le vrai — et parfois, dans les endroits les plus reculés de la planète, le vrai est d'une beauté absolument insupportable."
              </blockquote>

              <div className="space-y-4 text-[#8b7355] leading-relaxed text-sm" style={{ fontFamily: "'Source Serif 4', serif" }}>
                <p>
                  Après quinze ans passés sur les cinq continents, Julien Moreau a développé une approche singulière de la photographie de nature : celle d'un documentariste qui refuse le spectacle au profit de la vérité.
                </p>
                <p>
                  Ses expéditions durent rarement moins de trois semaines. Il dort sur place, mange local, apprend les langues. "On ne peut pas photographier ce qu'on ne comprend pas", répète-t-il à ses étudiants.
                </p>
                <p>
                  Son travail a été exposé au Musée de la Nature de Berlin, au Natural History Museum de Londres, et dans 23 pays. 200 collections. 48 territoires. Un seul sujet : la beauté périssable du monde naturel.
                </p>
              </div>

              <Divider />

              <div className="flex gap-6 flex-wrap">
                {[
                  { icon: Instagram, label: "@terra.moreau" },
                  { icon: Globe, label: "terra-photo.com" },
                  { icon: Mail, label: "contact@terra-photo.com" },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.label}
                      className="flex items-center gap-2 text-xs text-[#2d1b0e]/35 hover:text-[#3d5a3e] transition-colors"
                      style={{ fontFamily: "'Source Serif 4', serif" }}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================================================================
          6. FIELD NOTES
          ================================================================ */}
      <section id="terrain" className="py-28 px-6 md:px-12 bg-[#f2ede4]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="max-w-2xl mb-16">
              <span
                className="text-[11px] tracking-[0.3em] uppercase text-[#3d5a3e] block mb-5"
                style={{ fontFamily: "'Source Serif 4', serif" }}
              >
                — Carnets de terrain
              </span>
              <h2
                className="text-5xl md:text-6xl text-[#2d1b0e] mb-2 leading-[1.1]"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
              >
                Notes du
                <br />
                <span style={{ fontStyle: "italic" }}>Terrain</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {FIELD_NOTES.map((note, i) => {
              const Icon = note.icon
              return (
                <Reveal key={i} delay={i * 0.12}>
                  <article className="bg-[#faf8f3] p-8 border-b-2 border-[#3d5a3e]/15 hover:border-[#3d5a3e] transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-3 h-3 text-[#3d5a3e]" />
                          <span
                            className="text-xs text-[#3d5a3e] font-semibold"
                            style={{ fontFamily: "'Source Serif 4', serif" }}
                          >
                            {note.location}
                          </span>
                        </div>
                        <span
                          className="text-xs text-[#8b7355]"
                          style={{ fontFamily: "'Source Serif 4', serif" }}
                        >
                          {note.date}
                        </span>
                      </div>
                      <div className="w-8 h-8 border border-[#2d1b0e]/8 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#8b7355]" />
                      </div>
                    </div>

                    <p
                      className="text-[#2d1b0e]/65 text-sm leading-relaxed mb-6"
                      style={{ fontFamily: "'Source Serif 4', serif", fontStyle: "italic" }}
                    >
                      &ldquo;{note.excerpt}&rdquo;
                    </p>

                    <button
                      className="flex items-center gap-2 text-xs text-[#3d5a3e] group-hover:gap-3 transition-all"
                      style={{ fontFamily: "'Source Serif 4', serif" }}
                    >
                      Lire la suite
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          7. PROCESS — 4 STEPS
          ================================================================ */}
      <section className="py-28 px-6 md:px-12 max-w-[1400px] mx-auto">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span
              className="text-[11px] tracking-[0.3em] uppercase text-[#3d5a3e] block mb-5"
              style={{ fontFamily: "'Source Serif 4', serif" }}
            >
              — Méthode
            </span>
            <h2
              className="text-5xl md:text-6xl text-[#2d1b0e] leading-[1.1]"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
            >
              De la nature
              <br />
              <span style={{ fontStyle: "italic" }}>à votre mur</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {PROCESS_STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <Reveal key={step.n} delay={i * 0.1}>
                <div className="relative">
                  {/* Large decorative number */}
                  <div
                    className="text-[110px] font-bold leading-none text-[#2d1b0e]/4 mb-2 select-none"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {step.n}
                  </div>

                  <div className="-mt-14 pt-4">
                    <div className="w-10 h-10 border border-[#3d5a3e]/25 flex items-center justify-center mb-5 hover:border-[#3d5a3e]/60 transition-colors">
                      <Icon className="w-5 h-5 text-[#3d5a3e]" />
                    </div>

                    <h3
                      className="text-xl text-[#2d1b0e] font-bold mb-3"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-[#8b7355] text-sm leading-relaxed"
                      style={{ fontFamily: "'Source Serif 4', serif" }}
                    >
                      {step.desc}
                    </p>
                  </div>

                  {i < PROCESS_STEPS.length - 1 && (
                    <div className="hidden lg:block absolute right-0 top-[calc(50%-20px)] translate-x-1/2 z-10">
                      <ChevronRight className="w-4 h-4 text-[#2d1b0e]/12" />
                    </div>
                  )}
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* ================================================================
          8. STATS
          ================================================================ */}
      <section id="realisations" className="py-20 px-6 md:px-12 bg-[#3d5a3e]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#faf8f3]/10">
            {[
              { value: "48", label: "Pays explorés", suffix: "" },
              { value: "200", label: "Collections", suffix: "+" },
              { value: "5M", label: "Vues cumulées", suffix: "+" },
              { value: "2800", label: "Tirages vendus", suffix: "+" },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.08}>
                <div className="px-8 py-10 text-center">
                  <motion.div
                    className="text-5xl md:text-6xl font-bold text-[#faf8f3] mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {stat.value}
                    <span className="text-3xl">{stat.suffix}</span>
                  </motion.div>
                  <p
                    className="text-[#faf8f3]/45 text-[11px] tracking-[0.25em] uppercase"
                    style={{ fontFamily: "'Source Serif 4', serif" }}
                  >
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          9. NEWSLETTER
          ================================================================ */}
      <section className="py-28 px-6 md:px-12">
        <div className="max-w-[680px] mx-auto text-center">
          <Reveal>
            <Leaf className="w-8 h-8 text-[#3d5a3e]/35 mx-auto mb-8 float-slow" />

            <h2
              className="text-4xl md:text-5xl text-[#2d1b0e] mb-5 leading-[1.15]"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
            >
              Rejoignez la
              <br />
              <span style={{ fontStyle: "italic" }}>Communauté Terra</span>
            </h2>
            <p
              className="text-[#8b7355] text-base leading-relaxed mb-10 max-w-md mx-auto"
              style={{ fontFamily: "'Source Serif 4', serif" }}
            >
              Recevez en avant-première les nouvelles collections, les carnets d'expédition et les tirages en édition limitée — avant tout le monde.
            </p>

            <AnimatePresence mode="wait">
              {!emailSent ? (
                <motion.form
                  key="nl-form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={(e) => { e.preventDefault(); if (emailInput) setEmailSent(true) }}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                  <input
                    type="email"
                    required
                    placeholder="votre@email.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="flex-1 px-5 py-3 border border-[#2d1b0e]/12 bg-white text-[#2d1b0e] placeholder-[#8b7355]/50 focus:border-[#3d5a3e] focus:outline-none text-sm transition-colors"
                    style={{ fontFamily: "'Source Serif 4', serif" }}
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#2d1b0e] text-[#faf8f3] text-[11px] tracking-[0.2em] uppercase hover:bg-[#3d5a3e] transition-colors whitespace-nowrap"
                    style={{ fontFamily: "'Source Serif 4', serif" }}
                  >
                    S'inscrire
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="nl-success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-10 h-10 border border-[#3d5a3e]/25 flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-[#3d5a3e]" />
                  </div>
                  <p
                    className="text-[#3d5a3e] font-semibold text-lg"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Bienvenue dans la communauté Terra.
                  </p>
                  <p
                    className="text-[#8b7355] text-sm"
                    style={{ fontFamily: "'Source Serif 4', serif", fontStyle: "italic" }}
                  >
                    Vous recevrez prochainement votre premier carnet de terrain.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <p
              className="text-[#8b7355]/40 text-xs mt-6"
              style={{ fontFamily: "'Source Serif 4', serif" }}
            >
              Pas de spam. Désabonnement en un clic. Vos données ne sont jamais partagées.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ================================================================
          10. CONTACT
          ================================================================ */}
      <section id="contact" className="py-28 px-6 md:px-12 bg-[#f2ede4]">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 items-start">
          {/* Left info */}
          <Reveal>
            <span
              className="text-[11px] tracking-[0.3em] uppercase text-[#3d5a3e] block mb-6"
              style={{ fontFamily: "'Source Serif 4', serif" }}
            >
              — Contact &amp; Collaborations
            </span>
            <h2
              className="text-5xl md:text-6xl text-[#2d1b0e] mb-8 leading-[1.1]"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
            >
              Travaillons
              <br />
              <span style={{ fontStyle: "italic" }}>Ensemble</span>
            </h2>
            <p
              className="text-[#8b7355] text-base leading-relaxed mb-12 max-w-md"
              style={{ fontFamily: "'Source Serif 4', serif" }}
            >
              Pour les demandes de presse, d'exposition, de collaboration éditoriale ou d'acquisition de collections complètes — contactez l'atelier Terra directement.
            </p>

            <div className="space-y-5">
              {[
                { icon: Mail, label: "Email", value: "contact@terra-photo.com" },
                { icon: Instagram, label: "Instagram", value: "@terra.moreau" },
                { icon: Globe, label: "Web", value: "terra-photo.com" },
                { icon: MapPin, label: "Studio", value: "Paris, France" },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-[#2d1b0e]/8 bg-[#faf8f3] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#3d5a3e]" />
                    </div>
                    <div>
                      <div
                        className="text-[10px] text-[#8b7355]/55 tracking-[0.2em] uppercase"
                        style={{ fontFamily: "'Source Serif 4', serif" }}
                      >
                        {item.label}
                      </div>
                      <div
                        className="text-sm text-[#2d1b0e]"
                        style={{ fontFamily: "'Source Serif 4', serif" }}
                      >
                        {item.value}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Reveal>

          {/* Contact form */}
          <Reveal delay={0.2}>
            <div className="bg-[#faf8f3] p-8 border border-[#2d1b0e]/5">
              <AnimatePresence mode="wait">
                {!contactSent ? (
                  <motion.form
                    key="contact-form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={(e) => { e.preventDefault(); setContactSent(true) }}
                    className="space-y-6"
                  >
                    {[
                      { label: "Votre nom", placeholder: "Prénom Nom", type: "text", key: "name" },
                      { label: "Adresse email", placeholder: "votre@email.com", type: "email", key: "email" },
                    ].map((field) => (
                      <div key={field.key}>
                        <label
                          className="block text-[10px] tracking-[0.25em] uppercase text-[#8b7355] mb-2"
                          style={{ fontFamily: "'Source Serif 4', serif" }}
                        >
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          value={contactForm[field.key as keyof typeof contactForm]}
                          onChange={(e) => setContactForm(p => ({ ...p, [field.key]: e.target.value }))}
                          className="w-full border border-[#2d1b0e]/10 px-4 py-3 text-sm text-[#2d1b0e] placeholder-[#8b7355]/35 focus:border-[#3d5a3e] focus:outline-none transition-colors bg-transparent"
                          style={{ fontFamily: "'Source Serif 4', serif" }}
                        />
                      </div>
                    ))}

                    <div>
                      <label
                        className="block text-[10px] tracking-[0.25em] uppercase text-[#8b7355] mb-2"
                        style={{ fontFamily: "'Source Serif 4', serif" }}
                      >
                        Message
                      </label>
                      <textarea
                        rows={5}
                        placeholder="Décrivez votre projet, demande d'exposition, acquisition..."
                        value={contactForm.message}
                        onChange={(e) => setContactForm(p => ({ ...p, message: e.target.value }))}
                        className="w-full border border-[#2d1b0e]/10 px-4 py-3 text-sm text-[#2d1b0e] placeholder-[#8b7355]/35 focus:border-[#3d5a3e] focus:outline-none transition-colors bg-transparent resize-none"
                        style={{ fontFamily: "'Source Serif 4', serif" }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-[#2d1b0e] text-[#faf8f3] text-[11px] tracking-[0.2em] uppercase hover:bg-[#3d5a3e] transition-colors flex items-center justify-center gap-2"
                      style={{ fontFamily: "'Source Serif 4', serif" }}
                    >
                      <Mail className="w-4 h-4" />
                      Envoyer le message
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="contact-success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-16 text-center"
                  >
                    <div className="w-12 h-12 border border-[#3d5a3e]/20 flex items-center justify-center mx-auto mb-6">
                      <Leaf className="w-6 h-6 text-[#3d5a3e]" />
                    </div>
                    <h3
                      className="text-2xl text-[#2d1b0e] font-bold mb-3"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Message reçu.
                    </h3>
                    <p
                      className="text-[#8b7355] text-sm"
                      style={{ fontFamily: "'Source Serif 4', serif", fontStyle: "italic" }}
                    >
                      Nous revenons vers vous sous 48 heures ouvrées.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================================================================
          FOOTER
          ================================================================ */}
      <footer className="border-t border-[#2d1b0e]/6 bg-[#faf8f3] py-12 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-[#3d5a3e]/40" />
            <span
              className="text-xl tracking-[0.15em] text-[#2d1b0e]/50"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
            >
              TERRA
            </span>
          </div>

          <div className="flex items-center gap-5">
            {[Globe, Mail].map((Icon, i) => (
              <a
                key={i}
                href="#n"
                className="text-[#2d1b0e]/25 hover:text-[#3d5a3e] transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          <span
            className="text-xs text-[#8b7355]/40"
            style={{ fontFamily: "'Source Serif 4', serif" }}
          >
            © 2026 Terra · Julien Moreau Photography. Tous droits réservés.
          </span>
        </div>
      </footer>
    </div>
  )
}
