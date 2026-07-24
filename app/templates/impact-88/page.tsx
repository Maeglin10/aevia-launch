"use client";
// @ts-nocheck

import React, { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { resolveList } from "@/lib/templates/resolveList"
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useSpring,
  useMotionValue,
} from "framer-motion"
import {

  Sparkles,
  Star,
  Clock,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  ArrowRight,
  ChevronRight,
  Menu,
  X,
  Award,
  Users,
  Check,
} from "lucide-react"

const Instagram = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="5"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

/* ==========================================================================
   FONTS
   ========================================================================== */
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');`

function useFonts() {
  useEffect(() => {
    if (typeof document === "undefined") return
    const existing = document.querySelector('style[data-impact88-fonts]')
    if (existing) return
    const el = document.createElement("style")
    el.setAttribute("data-impact88-fonts", "1")
    el.textContent = FONTS
    document.head.appendChild(el)
    return () => { document.head.removeChild(el) }
  }, [])
}

/* ==========================================================================
   DESIGN TOKENS
   ========================================================================== */
// Lightens (positive percent) or darkens (negative) a #rrggbb hex color —
// used to derive primaryLight/primaryDark from the client's brand color.
function shadeColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) return hex;
  const amt = Math.round(2.55 * percent);
  const r = Math.max(0, Math.min(255, (num >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

let C: Record<string, string> = {
  bg:        "#FDF2F8",
  bgCard:    "#FFF0F6",
  bgDeep:    "#FCE7F3",
  primary:   "#EC4899",
  secondary: "#8B5CF6",
  text:      "#831843",
  textSoft:  "#9D174D",
  textMuted: "#BE185D",
  textLight: "#F9A8D4",
  border:    "rgba(236,72,153,0.15)",
  borderSoft:"rgba(139,92,246,0.12)",
  white:     "#FFFFFF",
  shadow:    "rgba(236,72,153,0.12)",
};
/* ==========================================================================
   DATA
   ========================================================================== */
const NAV_LINKS = ["Concept", "Portfolio", "Services", "Artistes", "FAQ", "Contact"]

const PORTFOLIO_FILTERS = ["Tout", "Gel", "Nail Art", "French", "Extensions", "Seasonal"]

const PORTFOLIO_ITEMS = [
  { id: 1, category: "Nail Art", title: "Fleurs de Cerisier", desc: "Aquarelle sur base nude rosée", accent: "#FBCFE8", img: "photo-1604654894610-df63bc536371" },
  { id: 2, category: "Gel",      title: "Rose Velours",       desc: "Gel couleur longue tenue",      accent: "#EC4899", img: "photo-1522337360788-8b13dee7a37e" },
  { id: 3, category: "French",   title: "French Classique",   desc: "Pointe blanche parfaite",       accent: "#FDF4FF", img: "photo-1604654894610-df63bc536371" },
  { id: 4, category: "Extensions","title": "Extensions Stiletto","desc": "Forme pointue couture",    accent: "#A855F7", img: "photo-1522337360788-8b13dee7a37e" },
  { id: 5, category: "Seasonal", title: "Collection Printemps","desc": "Fleurs & pastel",            accent: "#F9A8D4", img: "photo-1604654894610-df63bc536371" },
  { id: 6, category: "Nail Art", title: "Géométrie Lavande",  desc: "Lignes précises, violet doux", accent: "#8B5CF6", img: "photo-1522337360788-8b13dee7a37e" },
  { id: 7, category: "Gel",      title: "Bordeaux Intense",   desc: "Gel semi-permanent vibrant",   accent: "#BE185D", img: "photo-1604654894610-df63bc536371" },
  { id: 8, category: "French",   title: "French Ombré",       desc: "Fondu rose à ivoire",          accent: "#F0ABFC", img: "photo-1522337360788-8b13dee7a37e" },
  { id: 9, category: "Seasonal", title: "Hiver Nacré",        desc: "Nacre & paillettes fines",     accent: "#C084FC", img: "photo-1604654894610-df63bc536371" },
]

const SERVICES_DEMO = [
  { id: 1, name: "Pose Gel Couleur",    price: "45€",  duration: "60 min",  desc: "Application longue tenue avec finition brillante ou mate. Tient 3 semaines sans éclats." },
  { id: 2, name: "Nail Art Complet",    price: "85€",  duration: "90 min",  desc: "Création sur-mesure : aquarelle, géométrie, 3D, floraux. Consultation design incluse." },
  { id: 3, name: "French Manucure",     price: "35€",  duration: "45 min",  desc: "La French classique ou revisitée avec notre signature pointe couleur." },
  { id: 4, name: "Soin Japonais",       price: "55€",  duration: "75 min",  desc: "Traitement kératine premium : ongles renforcés, cuticules nourries, brillance naturelle." },
  { id: 5, name: "Extensions Résine",   price: "75€",  duration: "90 min",  desc: "Extensions légères et naturelles, sculpteées à la forme de votre choix." },
  { id: 6, name: "Dépose + Soin",       price: "40€",  duration: "45 min",  desc: "Dépose soignée du produit + bain nourrissant + évaluation santé de l'ongle." },
]

const ARTISTS_DEMO = [
  {
    id: 1,
    name: "Sophie Leroux",
    title: "Fondatrice & Nail Artist",
    specialty: "Nail Art Artistique",
    certs: ["CND Shellac Expert", "OPI Pro", "Nail Art Avancé"],
    bio: "10 ans de passion pour l'ongle parfait. Spécialiste des créations complexes et des styles uniques.",
    color: C.primary,
    img: "photo-1522337360788-8b13dee7a37e",
  },
  {
    id: 2,
    name: "Clara Dubois",
    title: "Technicienne Gel & Extensions",
    specialty: "Gel & Extensions Résine",
    certs: ["Bio Sculpture Certified", "Gelish Master", "Hygiène Pro"],
    bio: "Experte en pose gel et extensions. Ses poses tiennent 4 semaines et restent parfaitement lisses.",
    color: C.secondary,
    img: "photo-1604654894610-df63bc536371",
  },
  {
    id: 3,
    name: "Amélie Martin",
    title: "Spécialiste Soins & French",
    specialty: "Soins & French Signature",
    certs: ["Japonais Kératine", "CND Vinylux", "Aromathérapie"],
    bio: "Passionnée de soins de l'ongle naturel. Chaque consultation commence par un diagnostic précis.",
    color: "#EC4899",
    img: "photo-1522337360788-8b13dee7a37e",
  },
]

const BOOKING_STEPS = [
  { icon: Sparkles,  label: "Choisir service",    desc: "Sélectionnez parmi 6 prestations" },
  { icon: Users,     label: "Artiste",             desc: "Choisissez votre nail artist" },
  { icon: Calendar,  label: "Date & Heure",        desc: "Créneaux disponibles en temps réel" },
  { icon: Check,     label: "Confirmer",           desc: "Confirmation SMS + email instantanée" },
]

const BRANDS = [
  { name: "OPI",          detail: "Vernis professionnels" },
  { name: "CND Shellac",  detail: "Gel longue tenue #1 mondial" },
  { name: "Bio Sculpture","detail": "Extensions gel naturel" },
  { name: "Gelish",       detail: "Gel premium UV/LED" },
]

const TESTIMONIALS_DEMO = [
  { name: "Marie-Claire B.", avatar: "M", stars: 5, service: "Nail Art Complet", quote: "Un véritable atelier d'art sur mes ongles. Sophie a recréé exactement ce que j'avais en tête. Je n'irai jamais ailleurs." },
  { name: "Juliette P.",     avatar: "J", stars: 5, service: "Pose Gel Couleur", quote: "3 semaines plus tard, pas une seule petite éclat. La qualité est incomparable à tout ce que j'ai connu." },
  { name: "Océane R.",       avatar: "O", stars: 5, service: "Soin Japonais",    quote: "Mes ongles naturels n'ont jamais été aussi forts. Le soin japonais est un must absolu !" },
  { name: "Camille T.",      avatar: "C", stars: 5, service: "Extensions Résine","quote": "Extensions ultra-légères, forme parfaite. Tout le monde me demande si c'est mes vrais ongles." },
]

const FULL_PRICES = [
  {
    category: "Manucures & Soins",
    items: [
      { name: "Manucure Express",       price: "25€" },
      { name: "Manucure Complète",      price: "35€" },
      { name: "Soin Japonais",          price: "55€" },
      { name: "Soin Paraffine",         price: "45€" },
      { name: "Dépose + Soin",          price: "40€" },
    ],
  },
  {
    category: "Gel & Semi-permanent",
    items: [
      { name: "Pose Gel Couleur",       price: "45€" },
      { name: "Remplissage Gel",        price: "35€" },
      { name: "French Gel",             price: "55€" },
      { name: "Gel + Nail Art Simple",  price: "65€" },
    ],
  },
  {
    category: "Extensions",
    items: [
      { name: "Extensions Résine",      price: "75€" },
      { name: "Extensions Gel dur",     price: "80€" },
      { name: "Remplissage Extensions", price: "55€" },
      { name: "Forme + Sculpture",      price: "90€" },
    ],
  },
  {
    category: "Nail Art",
    items: [
      { name: "Nail Art Simple (2 ongles)", price: "15€" },
      { name: "Nail Art Complet",           price: "85€" },
      { name: "3D & Reliefs",               price: "95€+" },
      { name: "Aquarelle Full Design",      price: "100€+" },
    ],
  },
]

/* ==========================================================================
   HELPER COMPONENTS
   ========================================================================== */

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
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-[#EC4899] text-[#EC4899]" />
      ))}
    </div>
  )
}

/* ==========================================================================
   SCROLL PROGRESS BAR
   ========================================================================== */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "left" }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] z-[100]"
    />
  )
}

/* ==========================================================================
   NAV
   ========================================================================== */
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navBg = scrolled
    ? "bg-white/90 backdrop-blur-xl shadow-[0_2px_24px_rgba(236,72,153,0.08)]"
    : "bg-transparent"

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}
        style={{ paddingTop: scrolled ? 0 : 0 }}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-[68px] flex items-center justify-between">
          {/* Logo */}
          <Link href="#hero" className="flex items-center gap-2.5">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-[#EC4899]" />
                <span
                  className="text-[22px] font-[500] italic text-[#831843] tracking-wide"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  VELVET
                </span>
                <span
                  className="text-[10px] font-[600] uppercase tracking-[0.3em] text-[#BE185D] mt-1"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Nails
                </span>
              </>
            )}
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-[13px] font-[400] text-[#9D174D] hover:text-[#EC4899] transition-colors duration-200 tracking-wide"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {link}
              </Link>
            ))}
            <Link href="#contact" className="ml-2 px-6 py-2.5 bg-[#EC4899] text-white text-[12px] font-[600] uppercase tracking-[0.12em] rounded-full hover:bg-[#DB2777] transition-all duration-200 shadow-[0_4px_16px_rgba(236,72,153,0.35)] text-center"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              Réserver
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="lg:hidden p-2 text-[#831843]"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-40 bg-white flex flex-col pt-[80px] px-8 pb-12"
          >
            <div className="flex flex-col gap-6 flex-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div key={link} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                  <Link
                    href={`#${link.toLowerCase()}`}
                    className="text-left text-[28px] font-[500] italic text-[#831843] hover:text-[#EC4899] transition-colors"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link}
                  </Link>
                </motion.div>
              ))}
            </div>
            <Link
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="w-full py-4 bg-[#EC4899] text-white text-[14px] font-[600] uppercase tracking-[0.15em] rounded-full shadow-[0_4px_20px_rgba(236,72,153,0.35)] text-center"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Réserver en ligne
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ==========================================================================
   HERO
   ========================================================================== */
function Hero() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section id="hero"
      ref={heroRef}
      className="relative min-h-dvh flex items-center justify-center overflow-hidden"
    >
      {/* Parallax gradient bg */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#FDF2F8] via-[#FCE7F3] to-[#F5D0FE]" />
        {/* Radial petal accents */}
        <div className="absolute top-[10%] left-[8%] w-[420px] h-[420px] bg-[#EC4899]/8 rounded-full blur-[80px]" />
        <div className="absolute bottom-[15%] right-[10%] w-[380px] h-[380px] bg-[#8B5CF6]/10 rounded-full blur-[90px]" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F9A8D4]/12 rounded-full blur-[120px]" />
      </motion.div>

      {/* Floating nail art blobs */}
      {[
        { left: "6%",  top: "18%", size: 56, delay: 0,   duration: 5 },
        { left: "88%", top: "14%", size: 40, delay: 0.8, duration: 4.5 },
        { left: "4%",  top: "70%", size: 32, delay: 1.2, duration: 6 },
        { left: "90%", top: "65%", size: 48, delay: 0.4, duration: 5.5 },
        { left: "48%", top: "6%",  size: 24, delay: 1,   duration: 7 },
      ].map((blob, i) => (
        <motion.div
          key={i}
          className="absolute z-[1] pointer-events-none"
          style={{ left: blob.left, top: blob.top }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.22, scale: 1 }}
          transition={{ duration: 1, delay: blob.delay }}
        >
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: blob.duration, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width={blob.size} height={blob.size * 1.4} viewBox="0 0 24 34" fill="none">
              <path
                d="M12 2C7 2 3 7 3 12 L3 26 C3 29 5.6 32 9 32 L15 32 C18.4 32 21 29 21 26 L21 12 C21 7 17 2 12 2 Z"
                fill="#EC4899"
              />
              <ellipse cx="8.5" cy="9" rx="2.5" ry="4" fill="white" fillOpacity="0.15" />
            </svg>
          </motion.div>
        </motion.div>
      ))}

      {/* Parallax hero image overlay */}
      <motion.div style={{ y: bgY, opacity: heroOpacity }} className="absolute inset-0 z-[2] pointer-events-none">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block overflow-hidden">
          <div className="relative h-full w-full">
            <Image
              src={photo(0, "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=900&q=80")}
              alt="Nail art salon photography"
              fill
              className="object-cover object-center opacity-30"
              sizes="50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FDF2F8] via-[#FDF2F8]/60 to-transparent" />
          </div>
        </div>
      </motion.div>

      {/* Hero content */}
      <motion.div
        style={{ opacity: heroOpacity }}
        className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10 pt-[80px] w-full"
      >
        <div className="max-w-[640px]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#EC4899]/10 rounded-full mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#EC4899]" />
            <span
              className="text-[11px] font-[600] uppercase tracking-[0.3em] text-[#EC4899]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Nail Atelier · Paris 9e
            </span>
          </motion.div>

          <h1
            className="text-[clamp(52px,8vw,96px)] font-[700] italic leading-[0.92] tracking-[-0.02em] text-[#831843] mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              L'Art de
            </motion.span>
            <motion.span
              className="block text-[#EC4899]"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              l'Ongle
            </motion.span>
            <motion.span
              className="block not-italic font-[400] text-[#8B5CF6]"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Parfait.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-[16px] font-[300] text-[#9D174D] leading-[1.75] max-w-[460px] mb-10"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Pose gel, nail art sur-mesure et extensions résine dans un salon premium au cœur de Paris. Des mains qui racontent votre style.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-wrap gap-4"
          >
            <button className="px-8 py-4 bg-[#EC4899] text-white text-[13px] font-[600] uppercase tracking-[0.12em] rounded-full hover:bg-[#DB2777] transition-all duration-200 shadow-[0_8px_28px_rgba(236,72,153,0.4)] flex items-center gap-2"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              <Calendar className="w-4 h-4" /> Réserver ma séance
            </button>
            <button className="px-8 py-4 bg-white/80 backdrop-blur text-[#831843] text-[13px] font-[500] uppercase tracking-[0.12em] rounded-full border border-[rgba(236,72,153,0.2)] hover:border-[#EC4899] transition-all duration-200 flex items-center gap-2"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              <Heart className="w-4 h-4 text-[#EC4899]" /> Voir le Portfolio
            </button>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="mt-12 flex flex-wrap items-center gap-6"
          >
            {[
              { icon: Star, label: "4.9/5 — 280+ avis" },
              { icon: Users, label: "3 artistes expertes" },
              { icon: Award, label: "10 ans d'expertise" },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-[#EC4899]" />
                <span className="text-[12px] text-[#9D174D] font-[400]" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-[#EC4899]/30 flex justify-center pt-2">
          <motion.div
            className="w-1 h-2 rounded-full bg-[#EC4899]"
            animate={{ opacity: [1, 0, 1], y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}

/* ==========================================================================
   SECTION 3: PORTFOLIO FILTERABLE
   ========================================================================== */
function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState("Tout")

  const filtered = activeFilter === "Tout"
    ? PORTFOLIO_ITEMS
    : PORTFOLIO_ITEMS.filter((p) => p.category === activeFilter)

  return (
    <section className="py-[100px] bg-[#FFF0F6]" id="portfolio">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <Reveal>
          <p
            className="text-[11px] font-[600] uppercase tracking-[0.35em] text-[#EC4899] mb-4"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Portfolio
          </p>
          <h2
            className="text-[clamp(36px,5vw,64px)] font-[700] italic text-[#831843] leading-[1.05] mb-12"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Nos créations <span className="not-italic font-[400] text-[#8B5CF6]">en images</span>
          </h2>
        </Reveal>

        {/* Filter tabs */}
        <Reveal delay={0.1}>
          <div className="flex flex-wrap gap-3 mb-12">
            {PORTFOLIO_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full text-[12px] font-[500] uppercase tracking-[0.1em] transition-all duration-300 ${
                  activeFilter === filter
                    ? "bg-[#EC4899] text-white shadow-[0_4px_16px_rgba(236,72,153,0.35)]"
                    : "bg-white text-[#9D174D] border border-[rgba(236,72,153,0.2)] hover:border-[#EC4899]"
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {filter}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Grid with AnimatePresence */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="group relative overflow-hidden rounded-[16px] bg-white shadow-[0_2px_20px_rgba(236,72,153,0.06)] hover:shadow-[0_8px_40px_rgba(236,72,153,0.15)] transition-all duration-400 cursor-pointer"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={photo(4 + item.id, `https://images.unsplash.com/${item.img}?w=500&q=75`)}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-5"
                    style={{ background: "linear-gradient(to top, rgba(131,24,67,0.85) 0%, transparent 55%)" }}
                  >
                    <div>
                      <p className="text-white text-[15px] font-[600] italic mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</p>
                      <p className="text-white/70 text-[11px] font-[400]" style={{ fontFamily: "'Inter', sans-serif" }}>{item.desc}</p>
                    </div>
                  </div>
                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className="px-3 py-1 rounded-full text-[10px] font-[600] uppercase tracking-[0.1em] text-white"
                      style={{ background: item.accent, fontFamily: "'Inter', sans-serif" }}
                    >
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[15px] font-[500] italic text-[#831843]" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

/* ==========================================================================
   SECTION 4: SERVICES
   ========================================================================== */
function ServicesSection() {
  const services: any[] = resolveList(bp?.services, SERVICES_DEMO)
  return (
    <section className="py-[100px] bg-white" id="services">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <Reveal>
            <p
              className="text-[11px] font-[600] uppercase tracking-[0.35em] text-[#EC4899] mb-4"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Services
            </p>
            <h2
              className="text-[clamp(36px,5vw,64px)] font-[700] italic text-[#831843] leading-[1.05]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Chaque soin,
              <br />
              <span className="not-italic font-[400] text-[#8B5CF6]">un rituel.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p
              className="text-[14px] text-[#9D174D] max-w-[360px] leading-[1.75] font-[300]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              6 prestations conçues pour sublimer vos ongles avec des produits professionnels et un savoir-faire d'exception.
            </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service: any, i: number) => (
            <Reveal key={service.id ?? service.name ?? i} delay={i * 0.07}>
              <div className="group p-7 bg-[#FDF2F8] border border-[rgba(236,72,153,0.1)] rounded-[20px] hover:border-[#EC4899]/40 hover:shadow-[0_8px_40px_rgba(236,72,153,0.12)] transition-all duration-400 cursor-pointer relative overflow-hidden">
                {/* Pink bloom on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#EC4899]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-[20px]" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-[#EC4899]/10 flex items-center justify-center group-hover:bg-[#EC4899]/20 transition-colors duration-300">
                      <Sparkles className="w-5 h-5 text-[#EC4899]" />
                    </div>
                    <span
                      className="text-[28px] font-[700] text-[#831843] leading-none"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {service.price}
                    </span>
                  </div>
                  <h3
                    className="text-[20px] font-[600] italic text-[#831843] mb-1.5 leading-[1.2]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {service.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mb-4">
                    <Clock className="w-3.5 h-3.5 text-[#EC4899]" />
                    <span className="text-[11px] text-[#BE185D] font-[500] uppercase tracking-[0.1em]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {service.duration}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#9D174D] leading-[1.7] font-[300]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {service.desc ?? service.description}
                  </p>
                  <div className="mt-5 flex items-center gap-2 text-[#EC4899] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[12px] font-[600] uppercase tracking-[0.12em]" style={{ fontFamily: "'Inter', sans-serif" }}>Réserver</span>
                    <ChevronRight className="w-4 h-4" />
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
   SECTION 5: ARTISTES
   ========================================================================== */
function ArtistesSection() {
  const artists: any[] = resolveList(bp?.team, ARTISTS_DEMO)
  return (
    <section className="py-[100px] bg-gradient-to-b from-[#FCE7F3] to-[#FDF2F8]" id="artistes">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <Reveal className="text-center mb-16">
          <p className="text-[11px] font-[600] uppercase tracking-[0.35em] text-[#EC4899] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            Notre Équipe
          </p>
          <h2 className="text-[clamp(36px,5vw,64px)] font-[700] italic text-[#831843] leading-[1.05]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Les <span className="not-italic text-[#8B5CF6]">Artistes</span>
          </h2>
          <p className="text-[15px] text-[#9D174D] max-w-[520px] mx-auto mt-5 leading-[1.75] font-[300]" style={{ fontFamily: "'Inter', sans-serif" }}>
            Trois expertes passionnées, chacune avec sa spécialité, unies par l'amour du détail et la recherche de la perfection.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8">
          {artists.map((artist: any, i: number) => (
            <Reveal key={artist.id ?? artist.name ?? i} delay={i * 0.1}>
              <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_2px_24px_rgba(236,72,153,0.06)] hover:shadow-[0_12px_48px_rgba(236,72,153,0.14)] transition-all duration-500 group">
                {/* Photo area */}
                {(artist.img || artist.photoUrl) && (
                  <div className="relative h-[260px] overflow-hidden">
                    <Image
                      src={photo(1 + (artist.id ?? i), artist.photoUrl ?? `https://images.unsplash.com/${artist.img}?w=600&q=80`)}
                      alt={artist.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#831843]/60 to-transparent" />
                    <div className="absolute bottom-4 left-5 right-5">
                      <p className="text-white text-[18px] font-[600] italic" style={{ fontFamily: "'Playfair Display', serif" }}>{artist.name}</p>
                      <p className="text-white/80 text-[11px] font-[400] uppercase tracking-[0.1em] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>{artist.title ?? artist.role}</p>
                    </div>
                  </div>
                )}

                {/* Info area */}
                <div className="p-6">
                  {!(artist.img || artist.photoUrl) && (
                    <div className="mb-5">
                      <p className="text-[#831843] text-[18px] font-[600] italic" style={{ fontFamily: "'Playfair Display', serif" }}>{artist.name}</p>
                      {(artist.title ?? artist.role) && <p className="text-[#9D174D]/70 text-[11px] font-[400] uppercase tracking-[0.1em] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>{artist.title ?? artist.role}</p>}
                    </div>
                  )}
                  {(artist.specialty) && (
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-[600] uppercase tracking-[0.1em] mb-5"
                      style={{ background: `${artist.color ?? "#EC4899"}14`, color: artist.color ?? "#EC4899", fontFamily: "'Inter', sans-serif" }}
                    >
                      <Award className="w-3 h-3" />
                      {artist.specialty}
                    </div>
                  )}
                  {(artist.bio) && (
                    <p className="text-[13px] text-[#9D174D] leading-[1.7] mb-5 font-[300]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {artist.bio}
                    </p>
                  )}
                  {/* Certifications */}
                  {(Array.isArray(artist.certs) ? artist.certs : artist.credentials ? [artist.credentials] : []).length > 0 && (
                    <div className="space-y-2 mb-6">
                      {(Array.isArray(artist.certs) ? artist.certs : [artist.credentials]).map((cert: string, ci: number) => (
                        <div key={ci} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#EC4899] flex-shrink-0" />
                          <span className="text-[12px] text-[#BE185D]" style={{ fontFamily: "'Inter', sans-serif" }}>{cert}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    className="w-full py-3 text-[12px] font-[600] uppercase tracking-[0.12em] rounded-full border-2 text-[#EC4899] border-[#EC4899] hover:bg-[#EC4899] hover:text-white transition-all duration-300"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Réserver avec {artist.name.split(" ")[0]}
                  </button>
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
   SECTION 6: BOOKING PROCESS
   ========================================================================== */
function BookingProcess() {
  return (
    <section className="py-[100px] bg-[#831843]" id="soins">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <Reveal className="text-center mb-16">
          <p className="text-[11px] font-[600] uppercase tracking-[0.35em] text-[#F9A8D4] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            Comment réserver
          </p>
          <h2 className="text-[clamp(36px,5vw,60px)] font-[700] italic text-white leading-[1.05]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Simple comme <span className="not-italic font-[400] text-[#F9A8D4]">un clic.</span>
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {BOOKING_STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <Reveal key={i} delay={i * 0.1}>
                <div className="text-center">
                  {/* Number + connector */}
                  <div className="flex items-center mb-8">
                    <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto relative">
                      <Icon className="w-6 h-6 text-white" />
                      <span
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#EC4899] text-white text-[11px] font-[700] flex items-center justify-center"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {i + 1}
                      </span>
                    </div>
                    {i < BOOKING_STEPS.length - 1 && (
                      <div className="flex-1 h-[1px] bg-white/15 ml-4 hidden lg:block" />
                    )}
                  </div>
                  <h3
                    className="text-[18px] font-[600] italic text-white mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {step.label}
                  </h3>
                  <p
                    className="text-[13px] text-white/60 font-[300] leading-[1.65]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={0.4} className="text-center mt-14">
          <button className="px-10 py-4 bg-white text-[#831843] text-[13px] font-[600] uppercase tracking-[0.14em] rounded-full hover:bg-[#F9A8D4] transition-all duration-300 shadow-[0_8px_28px_rgba(0,0,0,0.2)] flex items-center gap-2 mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}>
            <Calendar className="w-4 h-4" /> Prendre rendez-vous maintenant
          </button>
        </Reveal>
      </div>
    </section>
  )
}

/* ==========================================================================
   SECTION 7: BRANDS
   ========================================================================== */
function BrandsSection() {
  return (
    <section className="py-[80px] bg-white border-t border-b border-[rgba(236,72,153,0.08)]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <Reveal className="text-center mb-12">
          <p className="text-[11px] font-[600] uppercase tracking-[0.35em] text-[#EC4899] mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
            Produits professionnels
          </p>
          <h2 className="text-[28px] font-[500] italic text-[#831843]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Nous travaillons exclusivement avec les meilleures marques
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {BRANDS.map((brand, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="group p-7 bg-[#FDF2F8] rounded-[20px] border border-[rgba(236,72,153,0.1)] text-center hover:border-[#EC4899]/40 hover:shadow-[0_6px_28px_rgba(236,72,153,0.1)] transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-[#EC4899]/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#EC4899]/20 transition-colors duration-300">
                  <Award className="w-5 h-5 text-[#EC4899]" />
                </div>
                <p
                  className="text-[18px] font-[700] italic text-[#831843] mb-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {brand.name}
                </p>
                <p
                  className="text-[11px] text-[#BE185D] font-[400]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {brand.detail}
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
   SECTION 8: TÉMOIGNAGES
   ========================================================================== */
function TestimonialsSection() {
  const [active, setActive] = useState(0)
  const testimonials: any[] = resolveList(bp?.reputation?.featuredReviews, TESTIMONIALS_DEMO)

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % testimonials.length), 5000)
    return () => clearInterval(t)
  }, [testimonials.length])

  return (
    <section className="py-[100px] bg-gradient-to-br from-[#FDF2F8] to-[#F5D0FE]/30" id="temoignages">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <Reveal className="text-center mb-16">
          <p className="text-[11px] font-[600] uppercase tracking-[0.35em] text-[#EC4899] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            Témoignages
          </p>
          <h2 className="text-[clamp(36px,5vw,60px)] font-[700] italic text-[#831843] leading-[1.05]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ce qu'elles <span className="not-italic text-[#8B5CF6]">disent</span>
          </h2>
        </Reveal>

        {/* Featured testimonial */}
        <div className="max-w-[820px] mx-auto mb-12">
          <div className="relative bg-white rounded-[28px] shadow-[0_4px_40px_rgba(236,72,153,0.08)] p-10 text-center min-h-[220px] flex flex-col justify-center">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="w-8 h-8 rounded-full bg-[#EC4899] flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
              >
                <StarRating />
                <div className="flex justify-center mb-5 mt-3" />
                <p
                  className="text-[18px] md:text-[22px] font-[400] italic text-[#831843] leading-[1.55] mb-6"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  &ldquo;{testimonials[active].quote ?? testimonials[active].text}&rdquo;
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#EC4899] to-[#8B5CF6] flex items-center justify-center text-white text-[14px] font-[700]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {testimonials[active].avatar ?? (testimonials[active].name ?? testimonials[active].author ?? "?")[0]}
                  </div>
                  <div className="text-left">
                    <p className="text-[14px] font-[600] text-[#831843]" style={{ fontFamily: "'Inter', sans-serif" }}>{testimonials[active].name ?? testimonials[active].author}</p>
                    <p className="text-[12px] text-[#EC4899]" style={{ fontFamily: "'Inter', sans-serif" }}>{testimonials[active].service ?? testimonials[active].source}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-2 mb-16">
          {testimonials.map((_: any, i: number) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-300 ${
                i === active ? "w-8 h-2.5 bg-[#EC4899]" : "w-2.5 h-2.5 bg-[#EC4899]/25"
              }`}
            />
          ))}
        </div>

        {/* All cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t: any, i: number) => {
            const quote = t.quote ?? t.text ?? "";
            return (
            <Reveal key={i} delay={i * 0.08}>
              <div
                onClick={() => setActive(i)}
                className={`p-6 rounded-[20px] border cursor-pointer transition-all duration-300 ${
                  i === active
                    ? "bg-white border-[#EC4899]/40 shadow-[0_4px_24px_rgba(236,72,153,0.12)]"
                    : "bg-white/50 border-[rgba(236,72,153,0.1)] hover:border-[#EC4899]/30"
                }`}
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.stars ?? t.rating ?? 5 }).map((_, si) => (
                    <Star key={si} className="w-3 h-3 fill-[#EC4899] text-[#EC4899]" />
                  ))}
                </div>
                <p className="text-[13px] italic text-[#9D174D] leading-[1.65] mb-4 font-[400]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  &ldquo;{quote.slice(0, 80)}…&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#EC4899] to-[#8B5CF6] flex items-center justify-center text-white text-[11px] font-[700]">
                    {t.avatar ?? (t.name ?? t.author ?? "?")[0]}
                  </div>
                  <div>
                    <p className="text-[12px] font-[600] text-[#831843]" style={{ fontFamily: "'Inter', sans-serif" }}>{t.name ?? t.author}</p>
                    <p className="text-[10px] text-[#EC4899]" style={{ fontFamily: "'Inter', sans-serif" }}>{t.service ?? t.source}</p>
                  </div>
                </div>
              </div>
            </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   SECTION 9: TARIFS COMPLETS
   ========================================================================== */
function TarifsSection() {
  return (
    <section className="py-[100px] bg-white" id="tarifs">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <Reveal className="text-center mb-16">
          <p className="text-[11px] font-[600] uppercase tracking-[0.35em] text-[#EC4899] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            Tarifs
          </p>
          <h2 className="text-[clamp(36px,5vw,64px)] font-[700] italic text-[#831843] leading-[1.05]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Grille tarifaire <span className="not-italic font-[400] text-[#8B5CF6]">complète</span>
          </h2>
          <p className="text-[15px] text-[#9D174D] mt-5 font-[300]" style={{ fontFamily: "'Inter', sans-serif" }}>
            Tous nos prix incluent la consultation initiale et les produits de qualité professionnelle.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FULL_PRICES.map((cat, ci) => (
            <Reveal key={ci} delay={ci * 0.08}>
              <div className="bg-[#FDF2F8] rounded-[20px] p-6 border border-[rgba(236,72,153,0.1)] hover:border-[#EC4899]/30 transition-all duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-[#EC4899]" />
                  <h3
                    className="text-[14px] font-[600] uppercase tracking-[0.1em] text-[#831843]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {cat.category}
                  </h3>
                </div>
                <div className="space-y-3">
                  {cat.items.map((item, ii) => (
                    <div key={ii} className="flex items-center justify-between py-2 border-b border-[rgba(236,72,153,0.08)] last:border-0">
                      <span
                        className="text-[13px] text-[#9D174D] font-[300]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {item.name}
                      </span>
                      <span
                        className="text-[14px] font-[700] text-[#EC4899]"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3} className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-3 bg-[#FCE7F3] rounded-full">
            <Sparkles className="w-4 h-4 text-[#EC4899]" />
            <p className="text-[12px] text-[#831843] font-[400]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Forfaits mariée & groupe sur devis — Contactez-nous pour un rendez-vous personnalisé
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ==========================================================================
   SECTION 10: CONTACT + FOOTER MEGA
   ========================================================================== */
function ContactFooter() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setEmail("")
  }

  return (
    <footer className="bg-[#831843]">
      {/* Contact info band */}
      <div className="py-[80px] border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Address */}
            <Reveal>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-[#F9A8D4]" />
                  <span className="text-[11px] font-[600] uppercase tracking-[0.2em] text-[#F9A8D4]" style={{ fontFamily: "'Inter', sans-serif" }}>Adresse</span>
                </div>
                <p className="text-white text-[14px] font-[300] leading-[1.7]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  24 rue des Petites Écuries<br />
                  75009 Paris<br />
                  Métro Bonne Nouvelle (L8/9)
                </p>
              </div>
            </Reveal>

            {/* Hours */}
            <Reveal delay={0.1}>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-[#F9A8D4]" />
                  <span className="text-[11px] font-[600] uppercase tracking-[0.2em] text-[#F9A8D4]" style={{ fontFamily: "'Inter', sans-serif" }}>Horaires</span>
                </div>
                <div className="space-y-2">
                  {[
                    { j: "Lun", h: "Fermé" },
                    { j: "Mar – Ven", h: "9h – 19h" },
                    { j: "Samedi", h: "9h – 18h" },
                    { j: "Dimanche", h: "Fermé" },
                  ].map(({ j, h }) => (
                    <div key={j} className="flex justify-between items-center">
                      <span className="text-[13px] text-white/60 font-[300]" style={{ fontFamily: "'Inter', sans-serif" }}>{j}</span>
                      <span className={`text-[13px] font-[400] ${h === "Fermé" ? "text-white/40" : "text-white"}`} style={{ fontFamily: "'Inter', sans-serif" }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Contact */}
            <Reveal delay={0.15}>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Phone className="w-4 h-4 text-[#F9A8D4]" />
                  <span className="text-[11px] font-[600] uppercase tracking-[0.2em] text-[#F9A8D4]" style={{ fontFamily: "'Inter', sans-serif" }}>Contact</span>
                </div>
                <div className="space-y-3">
                  <a href={`tel:${fd?.phone ?? "+33123456789"}`} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-[13px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <Phone className="w-3.5 h-3.5" />
                    +33 1 23 45 67 89
                  </a>
                  <a href={`mailto:${fd?.email ?? "bonjour@velvetnails.fr"}`} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-[13px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <Mail className="w-3.5 h-3.5" />{fd?.email ?? "bonjour@velvetnails.fr"}</a>
                  <a href="#contact" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-[13px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <Instagram className="w-3.5 h-3.5" />
                    @velvetnails.paris
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Newsletter */}
            <Reveal delay={0.2}>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-4 h-4 text-[#F9A8D4]" />
                  <span className="text-[11px] font-[600] uppercase tracking-[0.2em] text-[#F9A8D4]" style={{ fontFamily: "'Inter', sans-serif" }}>Newsletter</span>
                </div>
                <p className="text-[13px] text-white/60 mb-4 font-[300]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Collections saisonnières, offres exclusives & conseils beauté.
                </p>
                {sent ? (
                  <div className="flex items-center gap-2 text-[#F9A8D4] text-[13px]">
                    <Check className="w-4 h-4" />
                    <span style={{ fontFamily: "'Inter', sans-serif" }}>Merci, vous êtes inscrite !</span>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletter} className="space-y-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.fr"
                      required
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 text-[13px] focus:outline-none focus:border-[#F9A8D4] transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#EC4899] text-white text-[12px] font-[600] uppercase tracking-[0.12em] rounded-lg hover:bg-[#DB2777] transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      S'abonner
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>

          {/* Google Maps embed placeholder */}
          <Reveal delay={0.25} className="mt-14">
            <div className="w-full h-[200px] rounded-[16px] overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-[#F9A8D4] mx-auto mb-2" />
                <p className="text-white/60 text-[13px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  24 rue des Petites Écuries, 75009 Paris
                </p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-[#F9A8D4] text-[12px] hover:text-white transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Voir sur Google Maps <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="py-6">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F9A8D4]" />
            <span className="text-[15px] font-[500] italic text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{fd?.businessName ?? "Velvet Nails"}</span>
            <span className="text-white/40 text-[12px]" style={{ fontFamily: "'Inter', sans-serif" }}>· Paris 9e</span>
          </div>
          <p className="text-[11px] text-white/40 font-[300]" style={{ fontFamily: "'Inter', sans-serif" }}>
            © 2025 Velvet Nails — Tous droits réservés
          </p>
          <div className="flex gap-5">
            <Link href="/templates/impact-88/mentions-legales" className="text-[11px] text-white/40 hover:text-white/80 transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
              Mentions légales
            </Link>
            <Link href="/templates/impact-88/confidentialite" className="text-[11px] text-white/40 hover:text-white/80 transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
              Confidentialité
            </Link>
            <Link href="/templates/impact-88/cgu" className="text-[11px] text-white/40 hover:text-white/80 transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
              CGU
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ==========================================================================
   SECTION: CONCEPT (ABOUT)
   ========================================================================== */
function AboutSection() {
  return (
    <section className="py-[100px] bg-white border-b border-[rgba(236,72,153,0.08)]" id="concept">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden shadow-[0_4px_30px_rgba(236,72,153,0.1)]">
              <Image
                src={photo(1, "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80")}
                alt="Velvet Nails concept"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <p
                className="text-[11px] font-[600] uppercase tracking-[0.35em] text-[#EC4899] mb-4"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Notre Philosophie
              </p>
              <h2
                className="text-[clamp(36px,5vw,56px)] font-[700] italic text-[#831843] leading-[1.1] mb-8"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                La beauté <br />
                <span className="not-italic font-[400] text-[#8B5CF6]">jusqu'au bout des doigts.</span>
              </h2>
              <p
                className="text-[15px] text-[#9D174D] leading-[1.8] font-[300] mb-6"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Chez Velvet Nails, nous croyons que la manucure est une extension de votre personnalité. Notre salon parisien a été pensé comme un havre de détente où le soin de l'ongle naturel rencontre l'excellence artistique.
              </p>
              <p
                className="text-[15px] text-[#9D174D] leading-[1.8] font-[300] mb-8"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Nous travaillons uniquement avec des marques certifiées respectueuses de la santé de vos ongles (sans composants toxiques) et formons continuellement nos artistes aux dernières techniques de nail art de précision.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[rgba(236,72,153,0.1)]">
                <div>
                  <h4 className="text-[18px] font-[600] italic text-[#831843] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Produits Clean</h4>
                  <p className="text-[12px] text-[#BE185D] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>Sans composants nocifs pour préserver vos ongles.</p>
                </div>
                <div>
                  <h4 className="text-[18px] font-[600] italic text-[#831843] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Nail Art Précis</h4>
                  <p className="text-[12px] text-[#BE185D] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>Des tracés haute définition réalisés au pinceau fin.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   SECTION: FAQ
   ========================================================================== */
const FAQS_88 = [
  { q: "Quelle est la différence entre le gel et le semi-permanent ?", a: "Le semi-permanent est un vernis cuit sous lampe UV qui dure 2 à 3 semaines, idéal pour les ongles naturels sains. Le gel permet de renforcer l'ongle, de corriger sa forme ou de l'allonger (extensions) avec une tenue de 3 à 4 semaines." },
  { q: "Vos prestations abîment-elles les ongles naturels ?", a: "Non, si la pose et surtout la dépose sont effectuées correctement. Nous utilisons des techniques douces et des produits de haute qualité. Nous recommandons de faire retirer votre gel ou semi-permanent dans notre salon pour éviter d'arracher la kératine." },
  { q: "Comment se passe la création d'un Nail Art ?", a: "Vous pouvez venir avec des inspirations (photos, motifs, couleurs). Lors de votre rendez-vous, nous prenons quelques minutes pour discuter de votre projet et l'adapter à la longueur et à la forme de vos ongles." },
  { q: "Puis-je annuler ou déplacer mon rendez-vous ?", a: "Oui, vous pouvez modifier ou annuler votre rendez-vous gratuitement jusqu'à 24 heures à l'avance. Au-delà, des frais peuvent s'appliquer conformément à nos conditions." }
];

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs: any[] = resolveList(bp?.faq, FAQS_88)
  return (
    <section className="py-[100px] bg-white border-b border-[rgba(236,72,153,0.08)]" id="faq">
      <div className="max-w-[800px] mx-auto px-6">
        <Reveal className="text-center mb-16">
          <p className="text-[11px] font-[600] uppercase tracking-[0.35em] text-[#EC4899] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>FAQ</p>
          <h2 className="text-[clamp(36px,5vw,56px)] font-[700] italic text-[#831843] leading-[1.1]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Questions <span className="not-italic font-[400] text-[#8B5CF6]">Fréquentes</span>
          </h2>
        </Reveal>
        <div className="space-y-4">
          {faqs.map((faq: any, idx: number) => (
            <Reveal key={idx} delay={idx * 0.05}>
              <div className="border border-[rgba(236,72,153,0.15)] rounded-[16px] bg-[#FDF2F8]/30 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-[500] text-[#831843] hover:text-[#EC4899] transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px" }}
                >
                  <span>{faq.q}</span>
                  <span className="text-lg font-light">{openIndex === idx ? "−" : "+"}</span>
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-5 text-[14px] text-[#9D174D]/80 leading-relaxed font-[300]" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {faq.a}
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
  )
}

/* ==========================================================================
   SECTION: CONTACT FORM
   ========================================================================== */
function ContactSection() {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  return (
    <section className="py-[100px] bg-[#FFF0F6]" id="contact">
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <p className="text-[11px] font-[600] uppercase tracking-[0.35em] text-[#EC4899] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>Contact</p>
            <h2 className="text-[clamp(36px,5vw,56px)] font-[700] italic text-[#831843] leading-[1.1] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Écrivez-nous <span className="not-italic font-[400] text-[#8B5CF6]">un message</span>
            </h2>
            <p className="text-[15px] text-[#9D174D] leading-[1.75] font-[300] mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
              Pour toute demande spécifique, projet de nail art sur-mesure ou question sur nos prestations, n'hésitez pas à nous envoyer un message. Notre équipe vous répondra sous 24h.
            </p>
            <div className="space-y-4 font-[300] text-[#9D174D] text-[14px]" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#EC4899]" />
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#EC4899]" />
                <span>{fd?.email ?? "bonjour@velvetnails.fr"}</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="bg-white rounded-[24px] p-8 border border-[rgba(236,72,153,0.1)] shadow-[0_4px_30px_rgba(236,72,153,0.05)] text-left">
              {contactSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-[#EC4899]/10 flex items-center justify-center mx-auto mb-6">
                    <Check className="w-6 h-6 text-[#EC4899]" />
                  </div>
                  <h3 className="text-[20px] font-[600] italic text-[#831843] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Message envoyé</h3>
                  <p className="text-[#9D174D] text-sm leading-relaxed max-w-xs mx-auto text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Merci, nous vous répondrons sous 24h.
                  </p>
                  <button
                    onClick={() => setContactSubmitted(false)}
                    className="mt-8 px-6 py-2.5 bg-[#EC4899] text-white text-[12px] font-[600] uppercase tracking-[0.12em] rounded-full hover:bg-[#DB2777] transition-all"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Nouveau message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                  className="space-y-6 text-sm"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <div>
                    <label className="block text-xs font-[600] uppercase tracking-wider text-[#9D174D] mb-2" htmlFor="c-nom">Nom complet</label>
                    <input
                      id="c-nom"
                      type="text"
                      required
                      placeholder="Votre nom"
                      className="w-full bg-[#FDF2F8]/50 border border-[rgba(236,72,153,0.15)] rounded-xl px-4 py-3 text-[#831843] outline-none focus:border-[#EC4899] focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-[600] uppercase tracking-wider text-[#9D174D] mb-2" htmlFor="c-email">Email</label>
                    <input
                      id="c-email"
                      type="email"
                      required
                      placeholder="vous@email.com"
                      className="w-full bg-[#FDF2F8]/50 border border-[rgba(236,72,153,0.15)] rounded-xl px-4 py-3 text-[#831843] outline-none focus:border-[#EC4899] focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-[600] uppercase tracking-wider text-[#9D174D] mb-2" htmlFor="c-message">Message</label>
                    <textarea
                      id="c-message"
                      rows={4}
                      required
                      placeholder="Votre message..."
                      className="w-full bg-[#FDF2F8]/50 border border-[rgba(236,72,153,0.15)] rounded-xl px-4 py-3 text-[#831843] outline-none focus:border-[#EC4899] focus:bg-white transition-all resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#EC4899] text-white text-[12px] font-[600] uppercase tracking-[0.12em] rounded-full hover:bg-[#DB2777] transition-all cursor-pointer shadow-[0_4px_16px_rgba(236,72,153,0.3)]"
                  >
                    Envoyer le message
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
   PAGE EXPORT
   ========================================================================== */

// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
let bp: any = null;
// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function Impact88Page() {
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
    businessProfile?: any;
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
  bp = session?.businessProfile;
  brand = fd?.brandColor ?? null; // null = keep template's original color
  if (brand) {
    C = { ...C, primary: brand, primaryLight: shadeColor(brand, 25), primaryDark: shadeColor(brand, -20) };
  }

  useFonts()

return (
    <main className="bg-[#FDF2F8] text-[#831843] min-h-dvh overflow-x-hidden">
      <ScrollProgressBar />
      <Nav />
      <Hero />

      {/* Section: Concept (About) */}
      <AboutSection />

      {/* Section 3: Portfolio */}
      <PortfolioSection />

      {/* Section 4: Services */}
      <ServicesSection />

      {/* Section 5: Artistes */}
      <ArtistesSection />

      {/* Section 6: Booking Process */}
      <BookingProcess />

      {/* Section 7: Brands */}
      <BrandsSection />

      {/* Section 8: Témoignages */}
      <TestimonialsSection />

      {/* Section 9: Tarifs complets */}
      <TarifsSection />

      {/* Section: FAQ */}
      <FaqSection />

      {/* Section: Contact Form */}
      <ContactSection />

      {/* Section 10: Contact + Footer mega */}
      <ContactFooter />
    </main>
  )
}
