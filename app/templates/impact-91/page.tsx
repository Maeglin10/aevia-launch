"use client";
// @ts-nocheck

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

  Gem,
  Star,
  Award,
  Crown,
  ShoppingBag,
  ArrowRight,
  ChevronRight,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Heart,
  Clock,
  Package,
  Sparkles,
} from "lucide-react"

/* ==========================================================================
   AURELIA JEWELS — Design Tokens
   ========================================================================== */
const C = {
  cream:     "#FAFAF9",
  creamSoft: "#F5F4F0",
  gold:      "#CA8A04",
  goldLight: "#F59E0B",
  goldDim:   "rgba(202,138,4,0.15)",
  goldBorder:"rgba(202,138,4,0.20)",
  navy:      "#1C1917",
  navyDeep:  "#0C0A09",
  navyMid:   "#292524",
  text:      "#0C0A09",
  textMuted: "#78716C",
  textLight: "#A8A29E",
  border:    "rgba(28,25,23,0.08)",
}

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Montserrat:wght@300;400;500;600&display=swap');`

/* ==========================================================================
   DATA
   ========================================================================== */
const NAV_LINKS = [
  { label: "Collections", href: "#collections" },
  { label: "Bespoke", href: "#bespoke" },
  { label: "Savoir-Faire", href: "#savoir-faire" },
  { label: "Ateliers", href: "#ateliers" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
]

const COLLECTIONS = [
  {
    id: "hiver",
    season: "Hiver Céleste",
    subtitle: "Collection Automne–Hiver 2025",
    description: "Inspirée des nuits polaires et des constellations boréales.",
    pieces: [
      { name: "Collier Polaris", material: "Or blanc 18K, Diamants", price: "4 800 €", img: "photo-1515562141207-7a88fb7ce338" },
      { name: "Bague Aurore", material: "Or 18K, Saphir de Ceylan", price: "3 200 €", img: "photo-1601121141461-9d6647bef0a0" },
      { name: "Bracelet Céleste", material: "Platine 950, Diamants taille brillant", price: "6 500 €", img: "photo-1611591437281-460bfbe1220a" },
    ],
  },
  {
    id: "ete",
    season: "Été Ardent",
    subtitle: "Collection Printemps–Été 2025",
    description: "La chaleur dorée de la Méditerranée capturée dans chaque pièce.",
    pieces: [
      { name: "Pendentif Soleil", material: "Or jaune 18K, Rubis de Birmanie", price: "5 200 €", img: "photo-1515562141207-7a88fb7ce338" },
      { name: "Boucles Ibiza", material: "Or 18K, Émeraudes de Colombie", price: "4 100 €", img: "photo-1601121141461-9d6647bef0a0" },
      { name: "Parure Capri", material: "Or rose 18K, Tanzanite", price: "8 900 €", img: "photo-1611591437281-460bfbe1220a" },
    ],
  },
  {
    id: "automne",
    season: "Automne Doré",
    subtitle: "Collection Capsule 2025",
    description: "Les teintes ambrées de l'automne sublimées en métal précieux.",
    pieces: [
      { name: "Collier Ambre", material: "Or 18K, Citrine naturelle", price: "2 900 €", img: "photo-1515562141207-7a88fb7ce338" },
      { name: "Chevalière Doré", material: "Or jaune 18K massif", price: "1 800 €", img: "photo-1601121141461-9d6647bef0a0" },
      { name: "Bracelet Feuille", material: "Or 18K, Grenat Rhodolite", price: "3 600 €", img: "photo-1611591437281-460bfbe1220a" },
    ],
  },
]

const BESPOKE_STEPS = [
  { step: "01", label: "Consultation", desc: "Un entretien privé dans nos salons du 1er arrondissement. Nous écoutons votre vision, vos émotions, l'histoire que la pièce doit raconter." },
  { step: "02", label: "Design", desc: "Nos orfèvres dessinent à la main les esquisses. Vous validez chaque détail : forme, matière, pierre, proportion." },
  { step: "03", label: "Création", desc: "Six à douze semaines en atelier. Chaque pièce est forgée, sertie, polie à la main par nos maîtres orfèvres certifiés." },
  { step: "04", label: "Livraison", desc: "La pièce vous est remise dans un écrin sur mesure, accompagnée d'un certificat d'authenticité et d'une garantie à vie." },
]

const STATS = [
  { value: "47", unit: "ans", label: "d'expertise" },
  { value: "12", unit: "", label: "orfèvres maîtres" },
  { value: "3 400", unit: "", label: "pièces créées" },
  { value: "100%", unit: "", label: "métaux certifiés" },
]

const TESTIMONIALS = [
  {
    quote: "Aurelia a créé la bague de fiançailles de mes rêves. Chaque détail dépasse ce que j'avais imaginé. Une maison d'exception.",
    author: "Isabelle M.",
    occasion: "Fiançailles",
    location: "Paris",
    rating: 5,
  },
  {
    quote: "Pour nos 25 ans de mariage, nous avons commandé deux alliances uniques. Le résultat est d'une beauté bouleversante.",
    author: "Pierre & Anne L.",
    occasion: "Anniversaire de mariage",
    location: "Lyon",
    rating: 5,
  },
  {
    quote: "Collectionneur de longue date, je n'ai jamais trouvé une telle précision de sertissage. Aurelia est dans une catégorie à part.",
    author: "Jean-François D.",
    occasion: "Collection privée",
    location: "Genève",
    rating: 5,
  },
  {
    quote: "Le pendentif créé pour ma fille à ses 18 ans est déjà son bijou de famille. Un héritage pour les générations futures.",
    author: "Marguerite T.",
    occasion: "Cadeau de majorité",
    location: "Bordeaux",
    rating: 5,
  },
]

const PRESS = [
  { name: "Vogue Bijoux", issue: "Numéro Collector 2024", quote: "La maison parisienne qui réinvente l'orfèvrerie contemporaine." },
  { name: "Le Figaro", issue: "Arts & Styles", quote: "Aurelia, gardienne vivante du savoir-faire artisanal français." },
  { name: "L'Express Styles", issue: "Luxe & Création", quote: "Quand l'or devient sculpture : les pièces uniques d'Aurelia." },
  { name: "Elle France", issue: "Spécial Bijoux", quote: "Le bespoke à la française par excellence, place Vendôme." },
  { name: "Harper's Bazaar", issue: "Fine Jewelry Edit", quote: "Aurelia's atelier produces heirlooms, not merely jewellery." },
]

const MARQUEE_ITEMS = [
  "Or 18K",
  "Diamants Naturels",
  "Rubis de Birmanie",
  "Émeraudes de Colombie",
  "Saphirs de Ceylan",
  "Platine 950",
  "Tanzanite",
  "Perles d'Akoya",
  "Grenats Rhodolite",
  "Citrine naturelle",
]

/* ==========================================================================
   HOOKS
   ========================================================================== */
function useFonts() {
  useEffect(() => {
    const id = "aurelia-fonts"
    if (!document.getElementById(id)) {
      const style = document.createElement("style")
      style.id = id
      style.innerHTML = FONTS
      document.head.appendChild(style)
    }
  }, [])
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return progress
}

/* ==========================================================================
   REVEAL COMPONENT
   ========================================================================== */
function Reveal({
  children,
  delay = 0,
  y = 48,
  x = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  x?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ==========================================================================
   NAVIGATION
   ========================================================================== */
function Nav({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: scrolled ? "rgba(250,250,249,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
        }}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="#collections" className="flex items-center gap-3">
            <span
              className="text-[28px] tracking-[0.12em]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontWeight: 600,
                color: scrolled ? C.navyDeep : C.cream,
              }}
            >
              AURELIA
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[12px] tracking-[0.18em] font-[500] transition-colors duration-300 hover:opacity-60"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  color: scrolled ? C.navyDeep : C.cream,
                  textTransform: "uppercase",
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="#contact"
              className="hidden lg:flex items-center gap-2 px-6 py-2.5 text-[11px] tracking-[0.18em] uppercase transition-all duration-300 hover:opacity-90"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 500,
                backgroundColor: C.gold,
                color: "#fff",
              }}
            >
              Prendre RDV
              <ChevronRight size={14} />
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden p-2 transition-opacity hover:opacity-60"
              aria-label="Menu"
            >
              <Menu size={22} color={scrolled ? C.navyDeep : C.cream} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] flex flex-col"
            style={{ backgroundColor: C.navyDeep }}
          >
            <div className="flex items-center justify-between px-6 h-[72px]">
              <span
                className="text-[26px] tracking-[0.12em] italic"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: C.cream, fontWeight: 600 }}
              >
                AURELIA
              </span>
              <button onClick={() => setOpen(false)} className="p-2 text-[#A8A29E] hover:text-white transition-colors">
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center px-10 gap-8">
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 + 0.1 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="text-[32px] tracking-[0.06em] italic hover:opacity-60 transition-opacity"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: C.cream, fontWeight: 500 }}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <Link
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 px-8 py-3 text-[11px] tracking-[0.18em] uppercase mt-4"
                  style={{ backgroundColor: C.gold, color: "#fff", fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                >
                  Prendre RDV
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ==========================================================================
   SCROLL PROGRESS BAR
   ========================================================================== */
function ScrollProgressBar() {
  const progress = useScrollProgress()
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[2px]" style={{ backgroundColor: "transparent" }}>
      <motion.div
        className="h-full origin-left"
        style={{ backgroundColor: C.gold, scaleX: progress / 100, transformOrigin: "left" }}
      />
    </div>
  )
}

/* ==========================================================================
   MARQUEE
   ========================================================================== */
function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div
      className="overflow-hidden py-5 relative"
      style={{ backgroundColor: C.gold }}
    >
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-4 flex-shrink-0">
            <span
              className="text-[11px] tracking-[0.22em] uppercase"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500, color: "#fff" }}
            >
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ==========================================================================
   HERO SECTION
   ========================================================================== */
function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const yImg = useTransform(scrollYProgress, [0, 1], ["0%", "22%"])
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "14%"])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section id="hero"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: C.navyDeep }}
    >
      {/* Parallax image */}
      <motion.div className="absolute inset-0 z-0" style={{ y: yImg }}>
        <Image
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1920&auto=format&fit=crop"
          alt="Bijoux Aurelia"
          fill
          className="object-cover opacity-30"
          priority
          unoptimized
        />
      </motion.div>

      {/* Overlay gradient */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ background: `linear-gradient(to bottom, ${C.navyDeep}60 0%, ${C.navyDeep}90 100%)` }}
      />

      {/* Content */}
      <motion.div
        className="relative z-[2] text-center px-6 max-w-[900px] mx-auto"
        style={{ y: yText, opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="h-[1px] w-12" style={{ backgroundColor: C.gold }} />
          <span
            className="text-[10px] tracking-[0.30em] uppercase"
            style={{ fontFamily: "'Montserrat', sans-serif", color: C.gold, fontWeight: 500 }}
          >
            Maison fondée en 1977 · Paris
          </span>
          <div className="h-[1px] w-12" style={{ backgroundColor: C.gold }} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 leading-[0.9]"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: "clamp(52px, 8vw, 120px)",
            color: C.cream,
          }}
        >
          L'Orfèvrerie
          <br />
          <span style={{ color: C.gold }}>comme Art Vivant</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-[15px] leading-[1.8] mb-12 max-w-[520px] mx-auto"
          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300, color: `${C.cream}B0` }}
        >
          Depuis 1977, nos orfèvres créent des pièces intemporelles façonnées à la main,
          en or 18K et métaux précieux certifiés, au cœur de Paris.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="#collections"
            className="flex items-center gap-3 px-10 py-4 text-[11px] tracking-[0.18em] uppercase transition-all duration-300 hover:gap-5"
            style={{ backgroundColor: C.gold, color: "#fff", fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
          >
            Découvrir les Collections
            <ArrowRight size={15} />
          </Link>
          <Link
            href="#bespoke"
            className="flex items-center gap-2 px-10 py-4 text-[11px] tracking-[0.18em] uppercase transition-all duration-300 hover:opacity-70"
            style={{ border: `1px solid ${C.cream}40`, color: C.cream, fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
          >
            Pièce sur Mesure
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <motion.div
          className="w-[1px] h-14"
          style={{ backgroundColor: C.gold, transformOrigin: "top" }}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span
          className="text-[9px] tracking-[0.25em] uppercase"
          style={{ fontFamily: "'Montserrat', sans-serif", color: `${C.cream}60`, fontWeight: 400 }}
        >
          Défiler
        </span>
      </motion.div>
    </section>
  )
}

/* ==========================================================================
   COLLECTIONS SECTION
   ========================================================================== */
function CollectionsSection() {
  const [active, setActive] = useState(0)

  return (
    <section id="collections" className="py-28 lg:py-36" style={{ backgroundColor: C.cream }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        {/* Header */}
        <Reveal className="text-center mb-20">
          <p
            className="text-[10px] tracking-[0.30em] uppercase mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif", color: C.gold, fontWeight: 500 }}
          >
            Nos Créations
          </p>
          <h2
            className="mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: "clamp(40px, 5vw, 72px)",
              color: C.navyDeep,
              lineHeight: 1.1,
            }}
          >
            Collections Saisonnières
          </h2>
          <div className="w-16 h-[1px] mx-auto" style={{ backgroundColor: C.gold }} />
        </Reveal>

        {/* Season tabs */}
        <Reveal delay={0.1} className="flex flex-col sm:flex-row justify-center gap-0 mb-16 border-b" style={{ borderColor: C.border }}>
          {COLLECTIONS.map((col, i) => (
            <button
              key={col.id}
              onClick={() => setActive(i)}
              className="relative px-10 py-4 text-[11px] tracking-[0.18em] uppercase transition-all duration-300"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 500,
                color: active === i ? C.navyDeep : C.textMuted,
              }}
            >
              {col.season}
              {active === i && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-[-1px] left-0 right-0 h-[2px]"
                  style={{ backgroundColor: C.gold }}
                />
              )}
            </button>
          ))}
        </Reveal>

        {/* Active collection */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <p
                className="text-[13px] tracking-[0.10em] mb-3"
                style={{ fontFamily: "'Montserrat', sans-serif", color: C.textMuted, fontWeight: 400 }}
              >
                {COLLECTIONS[active].subtitle}
              </p>
              <p
                className="text-[16px] leading-[1.8] max-w-[480px] mx-auto"
                style={{ fontFamily: "'Montserrat', sans-serif", color: C.textMuted, fontWeight: 300 }}
              >
                {COLLECTIONS[active].description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {COLLECTIONS[active].pieces.map((piece, i) => (
                <motion.div
                  key={piece.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12 }}
                  className="group relative cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden mb-6" style={{ backgroundColor: C.creamSoft }}>
                    <Image
                      src={`https://images.unsplash.com/${piece.img}?q=80&w=600&auto=format&fit=crop`}
                      alt={piece.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center"
                      style={{ backgroundColor: `${C.navyDeep}50` }}
                    >
                      <Link
                        href="#contact"
                        className="flex items-center gap-2 px-6 py-3 text-[10px] tracking-[0.18em] uppercase"
                        style={{ backgroundColor: C.gold, color: "#fff", fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                      >
                        <ShoppingBag size={13} />
                        Commander
                      </Link>
                    </div>
                    {/* Heart */}
                    <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white">
                      <Heart size={16} color={C.navyDeep} />
                    </button>
                  </div>

                  {/* Info */}
                  <div>
                    <h3
                      className="text-[22px] mb-1"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 600, color: C.navyDeep }}
                    >
                      {piece.name}
                    </h3>
                    <p
                      className="text-[11px] tracking-[0.10em] mb-3"
                      style={{ fontFamily: "'Montserrat', sans-serif", color: C.textMuted, fontWeight: 400 }}
                    >
                      {piece.material}
                    </p>
                    <p
                      className="text-[18px]"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: C.gold }}
                    >
                      {piece.price}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <Reveal delay={0.3} className="text-center mt-14">
          <Link
            href="#contact"
            className="inline-flex items-center gap-3 text-[11px] tracking-[0.18em] uppercase pb-1 transition-all duration-300 hover:gap-5"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 500,
              color: C.navyDeep,
              borderBottom: `1px solid ${C.navyDeep}`,
            }}
          >
            Voir toutes les pièces
            <ArrowRight size={14} />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

/* ==========================================================================
   BESPOKE SECTION
   ========================================================================== */
function BespokeSection() {
  return (
    <section id="bespoke" className="py-28 lg:py-36" style={{ backgroundColor: C.navyDeep }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        {/* Header */}
        <Reveal className="text-center mb-20">
          <p
            className="text-[10px] tracking-[0.30em] uppercase mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif", color: C.gold, fontWeight: 500 }}
          >
            Création sur Mesure
          </p>
          <h2
            className="mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: "clamp(40px, 5vw, 72px)",
              color: C.cream,
              lineHeight: 1.1,
            }}
          >
            Votre Vision,
            <br />
            <span style={{ color: C.gold }}>Notre Savoir-Faire</span>
          </h2>
          <p
            className="text-[15px] leading-[1.8] max-w-[520px] mx-auto"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300, color: `${C.cream}80` }}
          >
            Chaque pièce bespoke est une collaboration intime entre votre imaginaire et notre expertise centenaire.
          </p>
        </Reveal>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0">
          {BESPOKE_STEPS.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.12}>
              <div className="relative px-8 py-10 group">
                {/* Connector line */}
                {i < BESPOKE_STEPS.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-10 right-0 w-full h-[1px] z-0"
                    style={{ backgroundColor: `${C.gold}30`, left: "50%" }}
                  />
                )}
                {/* Step number */}
                <div className="relative z-[1] mb-6">
                  <span
                    className="text-[72px] leading-none font-light select-none"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: `${C.gold}20` }}
                  >
                    {step.step}
                  </span>
                </div>
                {/* Icon */}
                <div
                  className="inline-flex items-center justify-center w-12 h-12 mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{ border: `1px solid ${C.goldBorder}`, backgroundColor: C.goldDim }}
                >
                  {i === 0 && <Sparkles size={20} color={C.gold} />}
                  {i === 1 && <Gem size={20} color={C.gold} />}
                  {i === 2 && <Crown size={20} color={C.gold} />}
                  {i === 3 && <Package size={20} color={C.gold} />}
                </div>
                <h3
                  className="text-[22px] mb-4"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 600, color: C.cream }}
                >
                  {step.label}
                </h3>
                <p
                  className="text-[13px] leading-[1.85] "
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300, color: `${C.cream}70` }}
                >
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.4} className="text-center mt-16">
          <Link
            href="#contact"
            className="inline-flex items-center gap-3 px-10 py-4 text-[11px] tracking-[0.18em] uppercase transition-all duration-300 hover:opacity-80"
            style={{ backgroundColor: C.gold, color: "#fff", fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
          >
            Commencer mon projet
            <ArrowRight size={15} />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

/* ==========================================================================
   SAVOIR-FAIRE STATS SECTION
   ========================================================================== */
function SavoirFaireSection() {
  return (
    <section id="savoir-faire" className="py-28 lg:py-36 relative overflow-hidden" style={{ backgroundColor: C.navyMid }}>
      {/* Background texture */}
      <div
        className="absolute inset-0 z-0 opacity-5"
        style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #CA8A04 0%, transparent 60%)" }}
      />

      <div className="relative z-[1] max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: text */}
          <div>
            <Reveal>
              <p
                className="text-[10px] tracking-[0.30em] uppercase mb-5"
                style={{ fontFamily: "'Montserrat', sans-serif", color: C.gold, fontWeight: 500 }}
              >
                Notre Héritage
              </p>
              <h2
                className="mb-6"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontWeight: 600,
                  fontSize: "clamp(36px, 4vw, 60px)",
                  color: C.cream,
                  lineHeight: 1.1,
                }}
              >
                L'Excellence
                <br />
                <span style={{ color: C.gold }}>depuis 1977</span>
              </h2>
              <p
                className="text-[14px] leading-[2] mb-8 max-w-[440px]"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300, color: `${C.cream}75` }}
              >
                Fondée dans les ateliers du Marais, Aurelia perpétue les techniques de l'orfèvrerie française transmises de maître en apprenti depuis cinq générations. Chaque pièce est le fruit d'un minimum de 200 heures de travail à la main.
              </p>
              <div className="flex flex-wrap gap-6">
                {["Certification Hallmark 18K", "Membre du Comité Vendôme", "Label Entreprise du Patrimoine Vivant"].map((badge) => (
                  <div key={badge} className="flex items-center gap-2">
                    <Award size={14} color={C.gold} />
                    <span
                      className="text-[11px] tracking-[0.08em]"
                      style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400, color: `${C.cream}90` }}
                    >
                      {badge}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right: stats grid */}
          <div className="grid grid-cols-2 gap-6">
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.1}>
                <div
                  className="p-8 transition-all duration-300 hover:border-[#CA8A04]/40"
                  style={{ border: `1px solid ${C.goldBorder}`, backgroundColor: `${C.gold}08` }}
                >
                  <p
                    className="mb-2 leading-none"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: "italic",
                      fontWeight: 600,
                      fontSize: "clamp(36px, 4vw, 56px)",
                      color: C.gold,
                    }}
                  >
                    {stat.value}
                    {stat.unit && (
                      <span className="text-[18px] ml-1" style={{ color: `${C.gold}80` }}>
                        {stat.unit}
                      </span>
                    )}
                  </p>
                  <p
                    className="text-[11px] tracking-[0.12em] uppercase"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400, color: `${C.cream}60` }}
                  >
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   ATELIERS SECTION
   ========================================================================== */
function AteliersSection() {
  return (
    <section id="ateliers" className="py-28 lg:py-36" style={{ backgroundColor: C.cream }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <Reveal x={-40} y={0}>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1601121141461-9d6647bef0a0?q=80&w=800&auto=format&fit=crop"
                alt="Atelier Aurelia"
                fill
                className="object-cover"
                unoptimized
              />
              {/* Gold frame overlay */}
              <div
                className="absolute inset-4 pointer-events-none"
                style={{ border: `1px solid ${C.goldBorder}` }}
              />
              {/* Badge */}
              <div
                className="absolute bottom-8 right-8 p-5"
                style={{ backgroundColor: C.gold }}
              >
                <Gem size={28} color="#fff" />
              </div>
            </div>
          </Reveal>

          {/* Content */}
          <div>
            <Reveal delay={0.1}>
              <p
                className="text-[10px] tracking-[0.30em] uppercase mb-5"
                style={{ fontFamily: "'Montserrat', sans-serif", color: C.gold, fontWeight: 500 }}
              >
                Nos Ateliers
              </p>
              <h2
                className="mb-6"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontWeight: 600,
                  fontSize: "clamp(36px, 4vw, 60px)",
                  color: C.navyDeep,
                  lineHeight: 1.1,
                }}
              >
                Un Art
                <br />
                à Contempler
              </h2>
            </Reveal>

            {/* Pullquote */}
            <Reveal delay={0.2}>
              <blockquote
                className="relative pl-8 mb-8 py-2"
                style={{ borderLeft: `2px solid ${C.gold}` }}
              >
                <p
                  className="text-[20px] leading-[1.6]"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontWeight: 500,
                    color: C.navyDeep,
                  }}
                >
                  "Chaque pièce naît du dialogue entre la flamme, le métal et les mains de l'artisan. C'est là que réside la vraie magie d'Aurelia."
                </p>
                <footer
                  className="mt-3 text-[11px] tracking-[0.12em] uppercase"
                  style={{ fontFamily: "'Montserrat', sans-serif", color: C.gold, fontWeight: 500 }}
                >
                  — Henri Moreau, Orfèvre Maître
                </footer>
              </blockquote>
            </Reveal>

            <Reveal delay={0.3}>
              <p
                className="text-[14px] leading-[2] mb-8"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300, color: C.textMuted }}
              >
                Nous vous invitons à découvrir nos ateliers du 1er arrondissement. En rendez-vous privé, observez nos orfèvres à l'œuvre : repoussage, ciselure, sertissage, polissage. Une expérience réservée à une clientèle de connaisseurs.
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#contact"
                  className="inline-flex items-center gap-3 px-8 py-4 text-[11px] tracking-[0.18em] uppercase transition-all duration-300 hover:opacity-80"
                  style={{ backgroundColor: C.navyDeep, color: C.cream, fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                >
                  Visiter l'Atelier
                  <ArrowRight size={14} />
                </Link>
                <div className="flex items-center gap-3 text-[12px]" style={{ fontFamily: "'Montserrat', sans-serif", color: C.textMuted }}>
                  <Clock size={15} color={C.gold} />
                  <span>Lun–Sam 10h–19h · Sur RDV</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   TESTIMONIALS SECTION
   ========================================================================== */
function TestimonialsSection() {
  return (
    <section className="py-28 lg:py-36" style={{ backgroundColor: C.creamSoft }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <Reveal className="text-center mb-20">
          <p
            className="text-[10px] tracking-[0.30em] uppercase mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif", color: C.gold, fontWeight: 500 }}
          >
            Témoignages
          </p>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: "clamp(36px, 4.5vw, 64px)",
              color: C.navyDeep,
              lineHeight: 1.1,
            }}
          >
            Ce que Disent
            <br />
            <span style={{ color: C.gold }}>Nos Clients</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.author} delay={i * 0.1}>
              <div
                className="p-10 relative group transition-all duration-300 hover:shadow-[0_8px_40px_rgba(202,138,4,0.08)]"
                style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={13} fill={C.gold} color={C.gold} />
                  ))}
                </div>

                {/* Quote mark */}
                <div
                  className="absolute top-8 right-10 text-[80px] leading-none select-none"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: `${C.gold}15`, fontWeight: 600 }}
                >
                  "
                </div>

                <p
                  className="text-[17px] leading-[1.75] mb-8 relative z-[1]"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 500, color: C.navyDeep }}
                >
                  {t.quote}
                </p>

                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-semibold"
                    style={{ backgroundColor: C.gold, color: "#fff", fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {t.author[0]}
                  </div>
                  <div>
                    <p
                      className="text-[14px]"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: C.navyDeep }}
                    >
                      {t.author}
                    </p>
                    <p
                      className="text-[11px] tracking-[0.08em]"
                      style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400, color: C.textMuted }}
                    >
                      {t.occasion} · {t.location}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   PRESSE SECTION
   ========================================================================== */
function PressSection() {
  return (
    <section id="presse" className="py-24 lg:py-32" style={{ backgroundColor: C.navyDeep }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <Reveal className="text-center mb-16">
          <p
            className="text-[10px] tracking-[0.30em] uppercase mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif", color: C.gold, fontWeight: 500 }}
          >
            Ils Parlent de Nous
          </p>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: "clamp(32px, 4vw, 56px)",
              color: C.cream,
              lineHeight: 1.1,
            }}
          >
            Presse & Médias
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {PRESS.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.08}>
              <div
                className="p-7 flex flex-col gap-4 transition-all duration-300 hover:border-[#CA8A04]/40 group h-full"
                style={{ border: `1px solid ${C.goldBorder}`, backgroundColor: `${C.gold}06` }}
              >
                <p
                  className="text-[16px]"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 600, color: C.gold }}
                >
                  {item.name}
                </p>
                <p
                  className="text-[10px] tracking-[0.12em] uppercase"
                  style={{ fontFamily: "'Montserrat', sans-serif", color: `${C.cream}50`, fontWeight: 400 }}
                >
                  {item.issue}
                </p>
                <p
                  className="text-[13px] leading-[1.7] flex-1"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontStyle: "italic", color: `${C.cream}70`, fontWeight: 300 }}
                >
                  "{item.quote}"
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   FAQ SECTION
   ========================================================================== */
function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      q: "Comment se déroule le processus de création sur mesure (Bespoke) ?",
      a: "Chaque projet débute par une consultation privée pour comprendre votre vision. Nous réalisons ensuite des esquisses à la main, suivies d'une modélisation 3D avant de façonner le bijou dans nos ateliers parisiens.",
    },
    {
      q: "Quels sont les délais de fabrication d'une pièce unique ?",
      a: "Il faut généralement compter entre 6 et 12 semaines pour la création d'une pièce sur mesure, selon la complexité du design et la recherche de pierres précieuses spécifiques.",
    },
    {
      q: "D'où proviennent vos métaux précieux et vos pierres ?",
      a: "Nous utilisons exclusivement de l'or 18K recyclé certifié CoC (Chain of Custody) et des diamants naturels conformes au processus de Kimberley, garantissant une provenance éthique et responsable.",
    },
    {
      q: "Proposez-vous un service de restauration ou de transformation ?",
      a: "Oui, la Maison Aurelia propose de restaurer vos bijoux anciens ou de transformer vos pièces de famille pour leur donner une nouvelle vie tout en conservant leur valeur sentimentale.",
    },
    {
      q: "Vos créations sont-elles garanties ?",
      a: "Toutes nos pièces de haute joaillerie sont accompagnées d'un certificat d'authenticité certifiant la qualité des métaux et des pierres, et bénéficient d'une garantie à vie contre tout vice de fabrication.",
    },
  ]

  return (
    <section id="faq" className="py-28 lg:py-36" style={{ backgroundColor: C.creamSoft }}>
      <div className="max-w-[800px] mx-auto px-6">
        <Reveal className="text-center mb-16">
          <p
            className="text-[10px] tracking-[0.30em] uppercase mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif", color: C.gold, fontWeight: 500 }}
          >
            Des Questions ?
          </p>
          <h2
            className="mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: "clamp(36px, 4.5vw, 64px)",
              color: C.navyDeep,
              lineHeight: 1.1,
            }}
          >
            Questions Fréquentes
          </h2>
          <div className="w-16 h-[1px] mx-auto" style={{ backgroundColor: C.gold }} />
        </Reveal>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <Reveal key={i} delay={i * 0.05}>
                <div
                  className="border transition-all duration-300"
                  style={{
                    borderColor: isOpen ? C.gold : C.border,
                    backgroundColor: C.cream,
                  }}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left"
                  >
                    <span
                      className="text-[15px] font-medium"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        color: C.navyDeep,
                      }}
                    >
                      {faq.q}
                    </span>
                    <span
                      className="text-[20px] transition-transform duration-300 select-none"
                      style={{
                        color: C.gold,
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                    >
                      +
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div
                          className="px-6 pb-6 text-[13px] leading-[1.8]"
                          style={{
                            fontFamily: "'Montserrat', sans-serif",
                            color: C.textMuted,
                            borderTop: `1px solid ${C.border}`,
                            paddingTop: "16px",
                          }}
                        >
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   CONTACT + FOOTER SECTION
   ========================================================================== */
function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", service: "collection" })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section id="contact" className="py-28 lg:py-36" style={{ backgroundColor: C.cream }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left: info */}
          <Reveal>
            <p
              className="text-[10px] tracking-[0.30em] uppercase mb-5"
              style={{ fontFamily: "'Montserrat', sans-serif", color: C.gold, fontWeight: 500 }}
            >
              Nous Contacter
            </p>
            <h2
              className="mb-6"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontWeight: 600,
                fontSize: "clamp(36px, 4vw, 60px)",
                color: C.navyDeep,
                lineHeight: 1.1,
              }}
            >
              Rencontrons-nous
            </h2>
            <p
              className="text-[14px] leading-[2] mb-12"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300, color: C.textMuted }}
            >
              Notre salon privé vous accueille sur rendez-vous au cœur du 1er arrondissement de Paris, à quelques pas de la Place Vendôme — le berceau de la haute joaillerie mondiale.
            </p>

            <div className="space-y-6 mb-12">
              {[
                { icon: MapPin, label: "Adresse", value: "12 Rue de la Paix, 75001 Paris" },
                { icon: Phone, label: "Téléphone", value: "+33 1 42 60 XX XX" },
                { icon: Mail, label: "Email", value: "contact@aurelia-joaillerie.fr" },
                { icon: Clock, label: "Horaires", value: "Lun–Sam 10h–19h · Dim sur RDV" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center mt-0.5"
                    style={{ border: `1px solid ${C.goldBorder}`, backgroundColor: C.goldDim }}
                  >
                    <Icon size={16} color={C.gold} />
                  </div>
                  <div>
                    <p
                      className="text-[10px] tracking-[0.15em] uppercase mb-1"
                      style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500, color: C.textMuted }}
                    >
                      {label}
                    </p>
                    <p
                      className="text-[14px]"
                      style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400, color: C.navyDeep }}
                    >
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map embed placeholder */}
            <div
              className="relative h-52 overflow-hidden"
              style={{ backgroundColor: C.creamSoft, border: `1px solid ${C.border}` }}
            >
              <Image
                src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop"
                alt="Localisation Aurelia"
                fill
                className="object-cover opacity-50"
                unoptimized
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={28} color={C.gold} className="mx-auto mb-2" />
                  <p
                    className="text-[12px] tracking-[0.12em] uppercase"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500, color: C.navyDeep }}
                  >
                    12 Rue de la Paix · Paris 1er
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right: form */}
          <Reveal delay={0.15}>
            <div
              className="p-10 lg:p-12"
              style={{ backgroundColor: C.navyDeep }}
            >
              <h3
                className="text-[28px] mb-8"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 600, color: C.cream }}
              >
                Prendre Rendez-Vous
              </h3>

              {sent ? (
                <div className="text-center py-12">
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 mb-6"
                    style={{ backgroundColor: C.goldDim, border: `1px solid ${C.goldBorder}` }}
                  >
                    <Sparkles size={28} color={C.gold} />
                  </div>
                  <p
                    className="text-[22px] mb-3"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: C.cream }}
                  >
                    Demande reçue
                  </p>
                  <p
                    className="text-[13px]"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300, color: `${C.cream}70` }}
                  >
                    Merci, nous vous répondrons sous 24h.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        className="block text-[10px] tracking-[0.18em] uppercase mb-2"
                        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500, color: `${C.cream}70` }}
                      >
                        Nom complet
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 text-[13px] outline-none transition-all duration-300"
                        style={{
                          backgroundColor: `${C.cream}08`,
                          border: `1px solid ${C.goldBorder}`,
                          color: C.cream,
                          fontFamily: "'Montserrat', sans-serif",
                        }}
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-[10px] tracking-[0.18em] uppercase mb-2"
                        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500, color: `${C.cream}70` }}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 text-[13px] outline-none transition-all duration-300"
                        style={{
                          backgroundColor: `${C.cream}08`,
                          border: `1px solid ${C.goldBorder}`,
                          color: C.cream,
                          fontFamily: "'Montserrat', sans-serif",
                        }}
                        placeholder="votre@email.fr"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-[10px] tracking-[0.18em] uppercase mb-2"
                      style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500, color: `${C.cream}70` }}
                    >
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 text-[13px] outline-none transition-all duration-300"
                      style={{
                        backgroundColor: `${C.cream}08`,
                        border: `1px solid ${C.goldBorder}`,
                        color: C.cream,
                        fontFamily: "'Montserrat', sans-serif",
                      }}
                      placeholder="+33 6 XX XX XX XX"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-[10px] tracking-[0.18em] uppercase mb-2"
                      style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500, color: `${C.cream}70` }}
                    >
                      Type de projet
                    </label>
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="w-full px-4 py-3 text-[13px] outline-none transition-all duration-300"
                      style={{
                        backgroundColor: C.navyMid,
                        border: `1px solid ${C.goldBorder}`,
                        color: `${C.cream}90`,
                        fontFamily: "'Montserrat', sans-serif",
                      }}
                    >
                      <option value="collection">Pièce de collection</option>
                      <option value="bespoke">Création sur mesure</option>
                      <option value="mariage">Alliances & fiançailles</option>
                      <option value="visite">Visite de l'atelier</option>
                      <option value="cadeau">Cadeau exceptionnel</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className="block text-[10px] tracking-[0.18em] uppercase mb-2"
                      style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500, color: `${C.cream}70` }}
                    >
                      Votre projet
                    </label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 text-[13px] outline-none transition-all duration-300 resize-none"
                      style={{
                        backgroundColor: `${C.cream}08`,
                        border: `1px solid ${C.goldBorder}`,
                        color: C.cream,
                        fontFamily: "'Montserrat', sans-serif",
                      }}
                      placeholder="Décrivez votre vision, l'occasion, le budget..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 py-4 text-[11px] tracking-[0.18em] uppercase transition-all duration-300 hover:opacity-80"
                    style={{ backgroundColor: C.gold, color: "#fff", fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                  >
                    Envoyer ma demande
                    <ArrowRight size={14} />
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   FOOTER
   ========================================================================== */
function Footer() {
  return (
    <footer style={{ backgroundColor: C.navyDeep, borderTop: `1px solid ${C.goldBorder}` }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <span
              className="text-[28px] tracking-[0.12em] italic block mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: C.cream }}
            >
              AURELIA
            </span>
            <p
              className="text-[13px] leading-[2] mb-6 max-w-[320px]"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300, color: `${C.cream}60` }}
            >
              Maison de haute joaillerie française. Orfèvrerie artisanale depuis 1977. Chaque pièce, une histoire. Chaque pierre, une âme.
            </p>
            <div className="flex gap-4">
              {[Phone, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#collections"
                  className="w-9 h-9 flex items-center justify-center transition-all duration-300 hover:border-[#CA8A04]/60"
                  style={{ border: `1px solid ${C.goldBorder}` }}
                >
                  <Icon size={16} color={`${C.cream}80`} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <p
              className="text-[10px] tracking-[0.20em] uppercase mb-5"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500, color: C.gold }}
            >
              Maison
            </p>
            <ul className="space-y-3">
              {["Collections", "Bespoke", "Savoir-Faire", "Ateliers", "Presse", "Carrières"].map((item) => (
                <li key={item}>
                  <Link
                    href="#collections"
                    className="text-[12px] tracking-[0.06em] hover:opacity-100 transition-opacity"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300, color: `${C.cream}60` }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p
              className="text-[10px] tracking-[0.20em] uppercase mb-5"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500, color: C.gold }}
            >
              Services
            </p>
            <ul className="space-y-3">
              {["Rendez-vous privé", "Gravure personnalisée", "Entretien & restauration", "Expertise & estimations", "Livraison sécurisée"].map((item) => (
                <li key={item}>
                  <Link
                    href="#contact"
                    className="text-[12px] tracking-[0.06em] hover:opacity-100 transition-opacity"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300, color: `${C.cream}60` }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: `1px solid ${C.goldBorder}` }}
        >
          <p
            className="text-[11px] tracking-[0.08em]"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300, color: `${C.cream}40` }}
          >
            © 2025 Aurelia Joaillerie. Tous droits réservés. Entreprise du Patrimoine Vivant.
          </p>
          <div className="flex gap-6">
            <Link
              href="#contact"
              className="text-[10px] tracking-[0.12em] uppercase hover:opacity-80 transition-opacity"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400, color: `${C.cream}40` }}
            >
              Mentions légales
            </Link>
            <Link
              href="#contact"
              className="text-[10px] tracking-[0.12em] uppercase hover:opacity-80 transition-opacity"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400, color: `${C.cream}40` }}
            >
              Confidentialité
            </Link>
            <Link
              href="#contact"
              className="text-[10px] tracking-[0.12em] uppercase hover:opacity-80 transition-opacity"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400, color: `${C.cream}40` }}
            >
              CGU
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function Impact91Page() {
  const [session, setSession] = useState<{
    formData?: {
      businessName?: string; businessType?: string; tagline?: string;
      city?: string; mainService?: string; benefits?: string[];
      priceRange?: string; targetAudience?: string; brandColor?: string;
      email?: string; phone?: string; instagram?: string; linkedin?: string;
    };
    generatedContent?: {
      heroHeadline?: string; heroSubline?: string; aboutTitle?: string;
      aboutText?: string; ctaText?: string; metaTitle?: string;
      metaDescription?: string;
      services?: { title?: string; description?: string }[];
      testimonials?: { name?: string; role?: string; text?: string; rating?: number }[];
    };
  } | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  c = session?.generatedContent;
  brand = fd?.brandColor ?? null; // null = keep template's original color

  useFonts()
  const [scrolled, setScrolled] = useState(false)

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 60)
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    
  // Dynamic Services & Testimonials Mutation for Session Data
  useEffect(() => {
    if (c?.services) {
      const services_arrays = [
        typeof SERVICES !== 'undefined' ? SERVICES : null,
        typeof features !== 'undefined' ? features : null,
        typeof services !== 'undefined' ? services : null,
        typeof FEATURES !== 'undefined' ? FEATURES : null,
      ];
      services_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((s, idx) => {
            if (idx < 3 && c.services[idx]) {
              if (s && typeof s === 'object') {
                s.title = c.services[idx].title ?? s.title;
                if ('desc' in s) s.desc = c.services[idx].description ?? s.desc;
                if ('description' in s) s.description = c.services[idx].description ?? s.description;
              }
            }
          });
        }
      });
    }
    if (c?.testimonials) {
      const testimonials_arrays = [
        typeof TESTIMONIALS !== 'undefined' ? TESTIMONIALS : null,
        typeof testimonials !== 'undefined' ? testimonials : null,
        typeof REVIEWS !== 'undefined' ? REVIEWS : null,
        typeof reviews !== 'undefined' ? reviews : null,
      ];
      testimonials_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((t, idx) => {
            if (idx < 3 && c.testimonials[idx]) {
              if (t && typeof t === 'object') {
                t.name = c.testimonials[idx].name ?? t.name;
                if ('role' in t) t.role = c.testimonials[idx].role ?? t.role;
                if ('text' in t) t.text = c.testimonials[idx].text ?? t.text;
                if ('quote' in t) t.quote = c.testimonials[idx].text ?? t.quote;
                if ('desc' in t) t.desc = c.testimonials[idx].text ?? t.desc;
              }
            }
          });
        }
      });
    }
  }, [c]);
return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  return (
    <div style={{ backgroundColor: C.cream, fontFamily: "'Montserrat', sans-serif" }}>
      <ScrollProgressBar />
      <Nav scrolled={scrolled} />
      <Hero />
      <Marquee />
      <CollectionsSection />
      <BespokeSection />
      <SavoirFaireSection />
      <AteliersSection />
      <TestimonialsSection />
      <PressSection />
      <FaqSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
