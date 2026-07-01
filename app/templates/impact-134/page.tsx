// @ts-nocheck
"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {

  Sparkles,
  Droplets,
  Leaf,
  Heart,
  Star,
  ShoppingBag,
  Package,
  ArrowRight,
  ChevronRight,
  Menu,
  X,
  Phone,
  Mail,
  Award,
  Clock,
  Sun,
  Moon,
} from "lucide-react"

/* ==========================================================================
   LUMIÈRE BEAUTY — Design Tokens
   ========================================================================== */
const C = {
  pink:        "#FDF2F8",
  pinkMid:     "#FCE7F3",
  pinkDeep:    "#FBCFE8",
  primary:     "#EC4899",
  primaryDim:  "rgba(236,72,153,0.12)",
  primaryBorder:"rgba(236,72,153,0.20)",
  lavender:    "#8B5CF6",
  lavenderDim: "rgba(139,92,246,0.12)",
  lavenderBorder:"rgba(139,92,246,0.20)",
  text:        "#831843",
  textMid:     "#9D174D",
  textMuted:   "#BE185D",
  textLight:   "#F9A8D4",
  white:       "#FFFFFF",
  border:      "rgba(131,24,67,0.08)",
  roseGold:    "#E8929F",
}

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');`

/* ==========================================================================
   DATA
   ========================================================================== */
const NAV_LINKS = [
  { label: "Collections", href: "#collections" },
  { label: "Rituels", href: "#rituels" },
  { label: "Ingrédients", href: "#ingredients" },
  { label: "Atelier", href: "#atelier" },
  { label: "Presse", href: "#presse" },
]

const PRODUCTS = [
  {
    id: "serum",
    name: "Sérum Éclat",
    subtitle: "Sérum concentré anti-taches",
    price: "79€",
    tag: "Bestseller",
    tagColor: C.primary,
    ingredient: "Rose de Damas & Vitamine C",
    desc: "Notre sérum phare, concentré en actifs puissants pour un teint lumineux et uniformisé en 14 jours.",
    img: "photo-1596462502278-27bfdc403348",
    stars: 4.9,
    reviews: 342,
    icon: Sparkles,
  },
  {
    id: "creme-nuit",
    name: "Crème Nuit",
    subtitle: "Soin réparateur nocturne",
    price: "89€",
    tag: "Nouveau",
    tagColor: C.lavender,
    ingredient: "Squalane & Acide Hyaluronique",
    desc: "Régénère intensément pendant le sommeil. Texture fondante qui nourrit sans alourdir.",
    img: "photo-1522337360788-8b13dee7a37e",
    stars: 4.8,
    reviews: 198,
    icon: Moon,
  },
  {
    id: "huile",
    name: "Huile Précieuse",
    subtitle: "Huile végétale multi-usage",
    price: "59€",
    tag: "Vegan",
    tagColor: "#16A34A",
    ingredient: "Huile d'Argan & Rosehip",
    desc: "Visage, corps, cheveux. Une huile précieuse aux 7 huiles botaniques certifiées bio.",
    img: "photo-1598452963314-b09f397a5c48",
    stars: 4.7,
    reviews: 276,
    icon: Droplets,
  },
  {
    id: "tonique",
    name: "Tonique Floral",
    subtitle: "Eau de soin à la rose",
    price: "34€",
    tag: "Incontournable",
    tagColor: C.primary,
    ingredient: "Eau Florale de Rose & Pivoine",
    desc: "Tonique apaisant et hydratant. À utiliser matin et soir après le nettoyage.",
    img: "photo-1596462502278-27bfdc403348",
    stars: 4.9,
    reviews: 521,
    icon: Heart,
  },
  {
    id: "masque",
    name: "Masque Argile",
    subtitle: "Masque purifiant hebdomadaire",
    price: "44€",
    tag: "Purifiant",
    tagColor: "#92400E",
    ingredient: "Argile Blanche & Aloe Vera",
    desc: "Nettoie en profondeur les pores, réduit les imperfections. 10 minutes pour une peau nette.",
    img: "photo-1522337360788-8b13dee7a37e",
    stars: 4.6,
    reviews: 183,
    icon: Leaf,
  },
  {
    id: "contour",
    name: "Contour Yeux",
    subtitle: "Soin spécifique regard",
    price: "64€",
    tag: "Anti-âge",
    tagColor: C.lavender,
    ingredient: "Peptides & Caféine",
    desc: "Cernes, poches, ridules : ce soin complet transforme le regard en 4 semaines.",
    img: "photo-1598452963314-b09f397a5c48",
    stars: 4.8,
    reviews: 147,
    icon: Sun,
  },
]

const RITUELS = [
  {
    step: "01",
    label: "Purifier",
    desc: "Commencez par nettoyer votre peau en douceur avec notre Gel Nettoyant Micellair au calendula. Il élimine impuretés et pollution sans altérer le film hydrolipidique.",
    product: "Gel Nettoyant Micellair",
    icon: Droplets,
  },
  {
    step: "02",
    label: "Hydrater",
    desc: "Appliquez le Tonique Floral sur coton ou directement sur la peau pour préparer et hydrater. La peau devient réceptive aux soins suivants.",
    product: "Tonique Floral",
    icon: Heart,
  },
  {
    step: "03",
    label: "Illuminer",
    desc: "Appliquez 3 à 4 gouttes du Sérum Éclat par petits tapotements sur le visage et le cou. La Vitamine C illumine, la Rose de Damas régénère.",
    product: "Sérum Éclat",
    icon: Sparkles,
  },
  {
    step: "04",
    label: "Protéger",
    desc: "Terminez avec la Crème Jour pour sceller les actifs et protéger votre peau tout au long de la journée. SPF 20 inclus.",
    product: "Crème Jour SPF 20",
    icon: Sun,
  },
]

const INGREDIENTS = [
  {
    name: "Rose de Damas",
    scientific: "Rosa damascena",
    benefit: "Régénération cellulaire, anti-oxydant puissant",
    origin: "Bulgarie",
    desc: "Récoltée à l'aube en mai, distillée dans les 6h. 5 tonnes de roses pour 1kg d'huile essentielle pure.",
    icon: Sparkles,
    color: C.primary,
  },
  {
    name: "Acide Hyaluronique",
    scientific: "Sodium Hyaluronate",
    benefit: "Hydratation profonde, repulpant immédiat",
    origin: "Synthèse fermentative",
    desc: "Capacité à retenir jusqu'à 1000x son poids en eau. 3 poids moléculaires pour agir à toutes les profondeurs.",
    icon: Droplets,
    color: "#3B82F6",
  },
  {
    name: "Huile d'Argan",
    scientific: "Argania spinosa kernel oil",
    benefit: "Nutrition intense, anti-âge naturel",
    origin: "Maroc (certifié bio)",
    desc: "Extraite à froid de l'Arganier. Riche en acides gras oméga-6 et en vitamine E. Peau velours garantie.",
    icon: Leaf,
    color: "#D97706",
  },
  {
    name: "Extrait de Pivoine",
    scientific: "Paeonia suffruticosa",
    benefit: "Anti-taches, éclat immédiat",
    origin: "Chine · Agriculture raisonnée",
    desc: "L'actif star de notre sérum. Inhibe la mélanine en surface et prévient l'apparition de nouvelles taches brunes.",
    icon: Heart,
    color: C.primary,
  },
  {
    name: "Vitamines C+E",
    scientific: "Ascorbyl Glucoside · Tocopherol",
    benefit: "Anti-oxydant double action",
    origin: "Source végétale",
    desc: "La synergie C+E multiplie par 4 l'efficacité anti-oxydante. Protège contre le vieillissement prématuré.",
    icon: Sun,
    color: "#F59E0B",
  },
  {
    name: "Squalane",
    scientific: "Squalane (olive-derived)",
    benefit: "Hydratation légère, film protecteur",
    origin: "Olive · Portugal",
    desc: "Identique au squalane naturellement produit par notre peau. Ultra-léger, non comédogène, convient à toutes peaux.",
    icon: Award,
    color: C.lavender,
  },
]

const REVIEWS = [
  {
    text: "Le Sérum Éclat a complètement transformé mon teint en 3 semaines. Mes taches de grossesse ont nettement diminué. Je recommande les yeux fermés.",
    author: "Camille D.",
    age: 34,
    skin: "Peau mixte, post-grossesse",
    result: "Taches -60% en 3 semaines",
    stars: 5,
  },
  {
    text: "Enfin une marque vegan et cruelty-free dont les produits fonctionnent vraiment ! La Crème Nuit sent le paradis et ma peau est incroyablement douce au réveil.",
    author: "Sophie M.",
    age: 28,
    skin: "Peau sèche sensible",
    result: "Hydratation +80% en 48h",
    stars: 5,
  },
  {
    text: "J'ai testé des dizaines de sérums à 100€+. Lumière est la seule marque où j'ai vu des résultats concrets et mesurables. Les formules sont d'une efficacité rare.",
    author: "Isabelle P.",
    age: 45,
    skin: "Peau mature, rides d'expression",
    result: "Ridules lissées visiblement",
    stars: 5,
  },
  {
    text: "L'Huile Précieuse est mon must-have absolu. Je l'utilise sur le visage, les pointes et les ongles. La texture est sublime, aucun film gras.",
    author: "Léa F.",
    age: 31,
    skin: "Peau normale à tendance sèche",
    result: "Peau satinée dès J1",
    stars: 5,
  },
]

const PRESS_ITEMS = [
  { name: "Vogue France", issue: "Beauté Naturelle 2025", quote: "Lumière redéfinit le luxe skincare accessible." },
  { name: "Elle France", issue: "Clean Beauty Edit", quote: "Les formules les plus efficaces de notre sélection vegan." },
  { name: "Marie Claire", issue: "Prix Beauté Or", quote: "Coup de cœur absolu : le Sérum Éclat mérite son nom." },
  { name: "Cosmopolitan", issue: "Top 10 Serums 2025", quote: "Le sérum qui tient toutes ses promesses anti-taches." },
  { name: "Le Figaro Madame", issue: "Luxe & Naturalité", quote: "L'atelier Lumière, où naît la beauté de demain." },
]

const SETS = [
  {
    name: "Essentiel",
    price: "89€",
    original: "127€",
    saving: "Économisez 38€",
    items: ["Tonique Floral 150ml", "Sérum Éclat 30ml (mini)", "Crème Jour 50ml"],
    badge: "Idéal pour commencer",
    badgeColor: C.primary,
    highlight: false,
    cta: "Choisir",
  },
  {
    name: "Rituel",
    price: "159€",
    original: "226€",
    saving: "Économisez 67€",
    items: ["Gel Nettoyant 150ml", "Tonique Floral 150ml", "Sérum Éclat 50ml", "Crème Nuit 50ml"],
    badge: "Le plus populaire",
    badgeColor: C.lavender,
    highlight: true,
    cta: "Commander",
  },
  {
    name: "Prestige",
    price: "249€",
    original: "370€",
    saving: "Économisez 121€",
    items: ["Routine complète 7 produits", "Huile Précieuse 30ml", "Masque Argile 75ml", "Contour Yeux 15ml", "Pochette Lumière offerte"],
    badge: "L'expérience totale",
    badgeColor: "#D97706",
    highlight: false,
    cta: "Choisir",
  },
]

const MARQUEE_ITEMS = [
  "Sérum Rose",
  "Crème Lumière",
  "Huile Précieuse",
  "Gommage Perle",
  "Eau Florale",
  "Masque Or",
  "Baume Lèvres",
  "Contour Yeux",
  "Tonique Pivoine",
  "Brume Éclat",
]

/* ==========================================================================
   HOOKS
   ========================================================================== */
function useFonts() {
  useEffect(() => {
    const id = "lumiere-fonts"
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
  y = 40,
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
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ==========================================================================
   SCROLL PROGRESS BAR
   ========================================================================== */
function ScrollProgressBar() {
  const progress = useScrollProgress()
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[2px]">
      <motion.div
        className="h-full origin-left"
        style={{ background: `linear-gradient(to right, ${C.primary}, ${C.lavender})`, scaleX: progress / 100, transformOrigin: "left" }}
      />
    </div>
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
          backgroundColor: scrolled ? "rgba(253,242,248,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.primaryBorder}` : "1px solid transparent",
        }}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="#collections" className="flex items-center gap-2">
            <Sparkles size={18} color={C.primary} />
            <span
              className="text-[26px] tracking-[0.06em]"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontWeight: 600,
                color: scrolled ? C.text : C.text,
              }}
            >
              LUMIÈRE
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[12px] tracking-[0.14em] font-[500] transition-colors duration-300 hover:text-[#EC4899]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: C.textMuted,
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
              href="#sets"
              className="hidden lg:flex items-center gap-2 px-6 py-2.5 text-[11px] tracking-[0.14em] uppercase transition-all duration-300 hover:opacity-90 rounded-full"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                background: `linear-gradient(135deg, ${C.primary}, ${C.lavender})`,
                color: "#fff",
              }}
            >
              Boutique
              <ShoppingBag size={13} />
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden p-2 transition-opacity hover:opacity-60"
              aria-label="Menu"
            >
              <Menu size={22} color={C.text} />
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
            style={{ backgroundColor: C.pink }}
          >
            <div className="flex items-center justify-between px-6 h-[72px]" style={{ borderBottom: `1px solid ${C.primaryBorder}` }}>
              <span
                className="text-[24px] tracking-[0.06em] italic flex items-center gap-2"
                style={{ fontFamily: "'Playfair Display', serif", color: C.text, fontWeight: 600 }}
              >
                <Sparkles size={16} color={C.primary} />
                LUMIÈRE
              </span>
              <button onClick={() => setOpen(false)} className="p-2 transition-opacity hover:opacity-60" style={{ color: C.text }}>
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
                    className="text-[32px] italic hover:opacity-60 transition-opacity"
                    style={{ fontFamily: "'Playfair Display', serif", color: C.text, fontWeight: 500 }}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <Link
                  href="#sets"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-[11px] tracking-[0.14em] uppercase mt-4"
                  style={{
                    background: `linear-gradient(135deg, ${C.primary}, ${C.lavender})`,
                    color: "#fff",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  <ShoppingBag size={14} />
                  Boutique
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
   MARQUEE
   ========================================================================== */
function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div
      className="overflow-hidden py-5 relative"
      style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.lavender})` }}
    >
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-4 flex-shrink-0">
            <span
              className="text-[11px] tracking-[0.22em] uppercase"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, color: "#fff" }}
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
   HERO SECTION — SPLIT LAYOUT
   ========================================================================== */
function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const yImg = useTransform(scrollYProgress, [0, 1], ["0%", "18%"])
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "10%"])

  return (
    <section id="hero"
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: C.pink }}
    >
      {/* Left: content */}
      <motion.div
        className="relative z-[2] w-full lg:w-[45%] px-6 md:px-12 lg:pl-16 lg:pr-12 pt-28 pb-20 flex flex-col justify-center"
        style={{ y: yText }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="h-[1px] w-10" style={{ backgroundColor: C.primary }} />
          <span
            className="text-[10px] tracking-[0.28em] uppercase"
            style={{ fontFamily: "'Inter', sans-serif", color: C.primary, fontWeight: 500 }}
          >
            Soins d'exception · 100% vegan
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-7 leading-[1.1]"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: "clamp(42px, 5.5vw, 80px)",
            color: C.text,
          }}
        >
          La Beauté
          <br />
          Authentique
          <br />
          <span style={{ color: C.primary }}>de la Nature</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.8 }}
          className="text-[15px] leading-[1.8] mb-10 max-w-[400px]"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, color: C.textMuted }}
        >
          Formulés en petits lots dans notre atelier parisien, nos soins unissent la puissance de la botanique et la précision de la cosmétologie moderne.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 mb-12"
        >
          <Link
            href="#collections"
            className="flex items-center justify-center gap-3 px-8 py-4 text-[12px] tracking-[0.14em] uppercase rounded-full transition-all duration-300 hover:shadow-[0_8px_30px_rgba(236,72,153,0.35)]"
            style={{
              background: `linear-gradient(135deg, ${C.primary}, ${C.lavender})`,
              color: "#fff",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
            }}
          >
            Découvrir les soins
            <ArrowRight size={14} />
          </Link>
          <Link
            href="#rituels"
            className="flex items-center justify-center gap-2 px-8 py-4 text-[12px] tracking-[0.14em] uppercase rounded-full transition-all duration-300 hover:bg-[#FBCFE8]"
            style={{
              border: `1px solid ${C.primaryBorder}`,
              color: C.text,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              backgroundColor: C.white,
            }}
          >
            Mon rituel beauté
          </Link>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-wrap gap-5"
        >
          {["Vegan & Cruelty-Free", "Sans Parabènes", "Formulé en France"].map((badge) => (
            <div key={badge} className="flex items-center gap-2">
              <Leaf size={13} color={C.primary} />
              <span
                className="text-[11px] tracking-[0.06em]"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, color: C.textMuted }}
              >
                {badge}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right: image — 55% width on desktop, full height */}
      <motion.div
        className="hidden lg:block absolute top-0 right-0 w-[58%] h-full z-[1]"
        style={{ y: yImg }}
      >
        <Image
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1200&auto=format&fit=crop"
          alt="Lumière Beauty — Soins premium"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        {/* Fade left */}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to right, ${C.pink} 0%, transparent 40%)` }}
        />
        {/* Float badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3, type: "spring" }}
          className="absolute bottom-20 left-10 p-5 rounded-2xl backdrop-blur-xl"
          style={{ backgroundColor: "rgba(255,255,255,0.75)", border: `1px solid ${C.primaryBorder}` }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Star size={14} fill={C.primary} color={C.primary} />
            <Star size={14} fill={C.primary} color={C.primary} />
            <Star size={14} fill={C.primary} color={C.primary} />
            <Star size={14} fill={C.primary} color={C.primary} />
            <Star size={14} fill={C.primary} color={C.primary} />
          </div>
          <p className="text-[15px] font-semibold mb-0.5" style={{ color: C.text, fontFamily: "'Playfair Display', serif" }}>4.9 / 5</p>
          <p className="text-[11px]" style={{ color: C.textMuted, fontFamily: "'Inter', sans-serif" }}>+1 200 avis clients</p>
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ==========================================================================
   COLLECTIONS SECTION
   ========================================================================== */
function CollectionsSection() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section id="collections" className="py-24 lg:py-32" style={{ backgroundColor: C.white }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <Reveal className="text-center mb-16">
          <p
            className="text-[10px] tracking-[0.28em] uppercase mb-4"
            style={{ fontFamily: "'Inter', sans-serif", color: C.primary, fontWeight: 500 }}
          >
            Nos Produits
          </p>
          <h2
            className="mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: "clamp(36px, 5vw, 64px)",
              color: C.text,
              lineHeight: 1.1,
            }}
          >
            La Collection
            <span style={{ color: C.primary }}> Lumière</span>
          </h2>
          <p
            className="text-[14px] leading-[1.8] max-w-[480px] mx-auto"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, color: C.textMuted }}
          >
            6 produits conçus pour se compléter parfaitement. Utilisez-les ensemble pour un rituel beauté complet.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((product, i) => {
            const Icon = product.icon
            return (
              <Reveal key={product.id} delay={i * 0.1}>
                <div
                  className="group relative cursor-pointer transition-all duration-500"
                  onMouseEnter={() => setHovered(product.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    boxShadow: hovered === product.id
                      ? `0 20px 60px ${C.primaryDim}, 0 0 0 1px ${C.primaryBorder}`
                      : `0 2px 20px rgba(131,24,67,0.04)`,
                  }}
                >
                  {/* Image */}
                  <div
                    className="relative aspect-square overflow-hidden"
                    style={{ backgroundColor: C.pink }}
                  >
                    <Image
                      src={`https://images.unsplash.com/${product.img}?q=80&w=600&auto=format&fit=crop`}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                    />
                    {/* Tag */}
                    <div
                      className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] tracking-[0.10em] uppercase"
                      style={{ backgroundColor: product.tagColor, color: "#fff", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                    >
                      {product.tag}
                    </div>
                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 flex items-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(to top, ${C.text}E0 0%, transparent 55%)` }}
                    >
                      <Link
                        href="#sets"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] tracking-[0.12em] uppercase w-full justify-center"
                        style={{ backgroundColor: "#fff", color: C.text, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                      >
                        <ShoppingBag size={13} />
                        Ajouter au panier
                      </Link>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6" style={{ backgroundColor: C.white }}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3
                          className="text-[20px] mb-1"
                          style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 600, color: C.text }}
                        >
                          {product.name}
                        </h3>
                        <p
                          className="text-[11px] tracking-[0.06em]"
                          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, color: C.textMuted }}
                        >
                          {product.subtitle}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className="text-[20px]"
                          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: C.primary }}
                        >
                          {product.price}
                        </p>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} size={11} fill={C.primary} color={C.primary} />
                        ))}
                      </div>
                      <span
                        className="text-[11px]"
                        style={{ fontFamily: "'Inter', sans-serif", color: C.textMuted }}
                      >
                        {product.stars} ({product.reviews} avis)
                      </span>
                    </div>

                    <p
                      className="text-[12px] leading-[1.7]"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, color: C.textMuted }}
                    >
                      {product.desc}
                    </p>

                    {/* Key ingredient */}
                    <div
                      className="mt-4 flex items-center gap-2 px-3 py-2 rounded-full"
                      style={{ backgroundColor: C.pink }}
                    >
                      <Icon size={12} color={C.primary} />
                      <span
                        className="text-[10px] tracking-[0.06em]"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, color: C.textMuted }}
                      >
                        {product.ingredient}
                      </span>
                    </div>
                  </div>
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
   RITUELS SECTION
   ========================================================================== */
function RituelsSection() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section id="rituels" className="py-24 lg:py-32" style={{ backgroundColor: C.pink }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <Reveal className="text-center mb-16">
          <p
            className="text-[10px] tracking-[0.28em] uppercase mb-4"
            style={{ fontFamily: "'Inter', sans-serif", color: C.primary, fontWeight: 500 }}
          >
            Mon Rituel
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: "clamp(36px, 5vw, 64px)",
              color: C.text,
              lineHeight: 1.1,
            }}
          >
            4 Étapes pour une
            <br />
            <span style={{ color: C.primary }}>Peau Parfaite</span>
          </h2>
        </Reveal>

        {/* Step selector */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Steps list */}
          <div className="lg:w-[45%] space-y-4">
            {RITUELS.map((r, i) => {
              const Icon = r.icon
              return (
                <Reveal key={r.step} delay={i * 0.08}>
                  <button
                    onClick={() => setActiveStep(i)}
                    className="w-full text-left p-6 rounded-2xl transition-all duration-300"
                    style={{
                      backgroundColor: activeStep === i ? C.white : "transparent",
                      border: `1px solid ${activeStep === i ? C.primaryBorder : "transparent"}`,
                      boxShadow: activeStep === i ? `0 8px 30px ${C.primaryDim}` : "none",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          background: activeStep === i
                            ? `linear-gradient(135deg, ${C.primary}, ${C.lavender})`
                            : C.pinkDeep,
                        }}
                      >
                        <Icon size={18} color={activeStep === i ? "#fff" : C.textMuted} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span
                            className="text-[10px] tracking-[0.20em]"
                            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, color: C.primary }}
                          >
                            Étape {r.step}
                          </span>
                        </div>
                        <h3
                          className="text-[20px] mb-2"
                          style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 600, color: C.text }}
                        >
                          {r.label}
                        </h3>
                        {activeStep === i && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.4 }}
                          >
                            <p
                              className="text-[13px] leading-[1.75] mb-3"
                              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, color: C.textMuted }}
                            >
                              {r.desc}
                            </p>
                            <div
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] tracking-[0.10em] uppercase"
                              style={{ backgroundColor: C.primaryDim, color: C.primary, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                            >
                              <Package size={11} />
                              {r.product}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </button>
                </Reveal>
              )
            })}
          </div>

          {/* Right: image */}
          <Reveal x={40} y={0} className="lg:w-[55%] lg:sticky lg:top-28">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop"
                alt="Rituel beauté Lumière"
                fill
                className="object-cover"
                unoptimized
              />
              <div
                className="absolute inset-0 rounded-3xl"
                style={{ background: `linear-gradient(to top, ${C.text}60 0%, transparent 50%)` }}
              />
              {/* Overlay text */}
              <div className="absolute bottom-8 left-8 right-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="p-5 rounded-2xl backdrop-blur-xl"
                    style={{ backgroundColor: "rgba(255,255,255,0.85)" }}
                  >
                    <p
                      className="text-[10px] tracking-[0.18em] uppercase mb-1"
                      style={{ fontFamily: "'Inter', sans-serif", color: C.primary, fontWeight: 500 }}
                    >
                      Étape {RITUELS[activeStep].step}
                    </p>
                    <p
                      className="text-[18px]"
                      style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 600, color: C.text }}
                    >
                      {RITUELS[activeStep].label}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   INGRÉDIENTS SECTION
   ========================================================================== */
function IngredientsSection() {
  return (
    <section id="ingredients" className="py-24 lg:py-32" style={{ backgroundColor: C.white }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <Reveal className="text-center mb-16">
          <p
            className="text-[10px] tracking-[0.28em] uppercase mb-4"
            style={{ fontFamily: "'Inter', sans-serif", color: C.primary, fontWeight: 500 }}
          >
            La Formulation
          </p>
          <h2
            className="mb-5"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: "clamp(36px, 5vw, 64px)",
              color: C.text,
              lineHeight: 1.1,
            }}
          >
            Nos Ingrédients
            <span style={{ color: C.primary }}> d'Exception</span>
          </h2>
          <p
            className="text-[14px] leading-[1.8] max-w-[480px] mx-auto"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, color: C.textMuted }}
          >
            Chaque actif est sélectionné pour son efficacité prouvée et sa compatibilité avec les formules véganes.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INGREDIENTS.map((ing, i) => {
            const Icon = ing.icon
            return (
              <Reveal key={ing.name} delay={i * 0.09}>
                <div
                  className="p-7 rounded-2xl group transition-all duration-300 hover:shadow-[0_12px_40px_rgba(236,72,153,0.10)] cursor-default h-full"
                  style={{ backgroundColor: C.pink, border: `1px solid transparent` }}
                >
                  {/* Icon */}
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-5 group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: `${ing.color}18` }}
                  >
                    <Icon size={22} color={ing.color} />
                  </div>

                  {/* Name + scientific */}
                  <h3
                    className="text-[20px] mb-1"
                    style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 600, color: C.text }}
                  >
                    {ing.name}
                  </h3>
                  <p
                    className="text-[11px] italic mb-1"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, color: C.textMuted }}
                  >
                    {ing.scientific}
                  </p>
                  <p
                    className="text-[10px] tracking-[0.08em] uppercase mb-4"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, color: ing.color }}
                  >
                    {ing.origin}
                  </p>

                  {/* Benefit chip */}
                  <div
                    className="inline-flex items-center px-3 py-1.5 rounded-full mb-4 text-[10px] tracking-[0.06em]"
                    style={{ backgroundColor: `${ing.color}15`, color: ing.color, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                  >
                    {ing.benefit}
                  </div>

                  <p
                    className="text-[13px] leading-[1.75]"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, color: C.textMuted }}
                  >
                    {ing.desc}
                  </p>
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
   ATELIER / BRAND STORY SECTION
   ========================================================================== */
function AtelierSection() {
  return (
    <section id="atelier" className="py-24 lg:py-32" style={{ backgroundColor: C.pink }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <Reveal x={-40} y={0}>
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1598452963314-b09f397a5c48?q=80&w=800&auto=format&fit=crop"
                alt="Atelier Lumière Beauty"
                fill
                className="object-cover"
                unoptimized
              />
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute top-8 right-8 p-5 rounded-2xl backdrop-blur-xl"
                style={{ backgroundColor: "rgba(255,255,255,0.88)", border: `1px solid ${C.primaryBorder}` }}
              >
                <Leaf size={24} color={C.primary} className="mb-2" />
                <p className="text-[13px] font-semibold" style={{ color: C.text, fontFamily: "'Playfair Display', serif" }}>
                  100% Vegan
                </p>
                <p className="text-[11px]" style={{ color: C.textMuted, fontFamily: "'Inter', sans-serif" }}>
                  Cruelty-Free certifié
                </p>
              </motion.div>
            </div>
          </Reveal>

          {/* Content */}
          <div>
            <Reveal delay={0.1}>
              <p
                className="text-[10px] tracking-[0.28em] uppercase mb-5"
                style={{ fontFamily: "'Inter', sans-serif", color: C.primary, fontWeight: 500 }}
              >
                Notre Histoire
              </p>
              <h2
                className="mb-6"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: "italic",
                  fontWeight: 600,
                  fontSize: "clamp(32px, 4vw, 56px)",
                  color: C.text,
                  lineHeight: 1.15,
                }}
              >
                Formulé avec Amour
                <br />
                <span style={{ color: C.primary }}>par des Passionnées</span>
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p
                className="text-[15px] leading-[1.9] mb-6"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, color: C.textMuted }}
              >
                Lumière est née en 2019 dans une cuisine parisienne. Clara et Sophie, deux chimistes passionnées de botanique, ont voulu créer une alternative aux soins industriels : des formules courtes, traçables, d'une efficacité remarquable.
              </p>
              <p
                className="text-[15px] leading-[1.9] mb-8"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, color: C.textMuted }}
              >
                Chaque lot est fabriqué en 200 unités maximum dans notre atelier du 11ème arrondissement. Nos formules évoluent avec la science — et avec vous.
              </p>
            </Reveal>

            {/* Certifications */}
            <Reveal delay={0.3}>
              <div
                className="p-6 rounded-2xl mb-8"
                style={{ backgroundColor: C.white, border: `1px solid ${C.primaryBorder}` }}
              >
                <p
                  className="text-[11px] tracking-[0.15em] uppercase mb-4"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, color: C.primary }}
                >
                  Nos engagements
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Formulé sans parabènes",
                    "Sans silicones",
                    "Vegan & cruelty-free",
                    "Packaging recyclable",
                    "Ingrédients traçables",
                    "Fabriqué en France",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: C.primary }}
                      />
                      <span
                        className="text-[12px]"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, color: C.textMuted }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <Link
                href="#sets"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-[12px] tracking-[0.14em] uppercase transition-all duration-300 hover:shadow-[0_8px_30px_rgba(236,72,153,0.30)]"
                style={{
                  background: `linear-gradient(135deg, ${C.primary}, ${C.lavender})`,
                  color: "#fff",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                }}
              >
                Découvrir nos coffrets
                <ArrowRight size={14} />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   REVIEWS SECTION
   ========================================================================== */
function ReviewsSection() {
  return (
    <section className="py-24 lg:py-32" style={{ backgroundColor: C.white }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <Reveal className="text-center mb-16">
          <p
            className="text-[10px] tracking-[0.28em] uppercase mb-4"
            style={{ fontFamily: "'Inter', sans-serif", color: C.primary, fontWeight: 500 }}
          >
            Témoignages
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: "clamp(36px, 5vw, 64px)",
              color: C.text,
              lineHeight: 1.1,
            }}
          >
            Elles Ont Testé,
            <span style={{ color: C.primary }}> Elles Adorent</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {REVIEWS.map((review, i) => (
            <Reveal key={review.author} delay={i * 0.1}>
              <div
                className="p-8 rounded-2xl relative transition-all duration-300 hover:shadow-[0_12px_40px_rgba(236,72,153,0.10)]"
                style={{ backgroundColor: C.pink, border: `1px solid ${C.primaryBorder}` }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: review.stars }).map((_, j) => (
                    <Star key={j} size={14} fill={C.primary} color={C.primary} />
                  ))}
                </div>

                {/* Quote */}
                <p
                  className="text-[16px] leading-[1.75] mb-6"
                  style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500, color: C.text }}
                >
                  "{review.text}"
                </p>

                {/* Author + result */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${C.primary}, ${C.lavender})`,
                        color: "#fff",
                        fontFamily: "'Playfair Display', serif",
                      }}
                    >
                      {review.author[0]}
                    </div>
                    <div>
                      <p
                        className="text-[14px] font-semibold mb-0.5"
                        style={{ fontFamily: "'Playfair Display', serif", color: C.text }}
                      >
                        {review.author}, {review.age} ans
                      </p>
                      <p
                        className="text-[11px]"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, color: C.textMuted }}
                      >
                        {review.skin}
                      </p>
                    </div>
                  </div>

                  {/* Result badge */}
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] tracking-[0.06em]"
                    style={{ backgroundColor: C.primaryDim, color: C.primary, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                  >
                    <Award size={11} />
                    {review.result}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Overall rating bar */}
        <Reveal delay={0.3} className="mt-12 text-center">
          <div
            className="inline-flex flex-col sm:flex-row items-center gap-6 px-10 py-6 rounded-2xl"
            style={{ backgroundColor: C.pink, border: `1px solid ${C.primaryBorder}` }}
          >
            <div>
              <span
                className="text-[56px] leading-none"
                style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 700, color: C.primary }}
              >
                4.9
              </span>
              <span
                className="text-[18px] ml-1"
                style={{ fontFamily: "'Inter', sans-serif", color: C.textMuted }}
              >
                /5
              </span>
            </div>
            <div className="text-left">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={18} fill={C.primary} color={C.primary} />
                ))}
              </div>
              <p
                className="text-[13px]"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, color: C.textMuted }}
              >
                Basé sur 1 247 avis clients vérifiés
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ==========================================================================
   PRESSE SECTION
   ========================================================================== */
function PressSection() {
  return (
    <section id="presse" className="py-20 lg:py-28" style={{ backgroundColor: C.text }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <Reveal className="text-center mb-12">
          <p
            className="text-[10px] tracking-[0.28em] uppercase mb-3"
            style={{ fontFamily: "'Inter', sans-serif", color: C.primary, fontWeight: 500 }}
          >
            Ils en Parlent
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: "clamp(28px, 4vw, 52px)",
              color: "#fff",
              lineHeight: 1.1,
            }}
          >
            Presse & Médias
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {PRESS_ITEMS.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.08}>
              <div
                className="p-6 rounded-xl flex flex-col gap-3 transition-all duration-300 hover:border-[#EC4899]/40 h-full"
                style={{ border: `1px solid ${C.primaryBorder}`, backgroundColor: `${C.primary}08` }}
              >
                <p
                  className="text-[17px]"
                  style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 600, color: C.primary }}
                >
                  {item.name}
                </p>
                <p
                  className="text-[10px] tracking-[0.10em] uppercase"
                  style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.40)", fontWeight: 400 }}
                >
                  {item.issue}
                </p>
                <p
                  className="text-[12px] leading-[1.7] flex-1 italic"
                  style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.65)", fontWeight: 300 }}
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
   SETS / PRICING SECTION
   ========================================================================== */
function SetsSection() {
  return (
    <section id="sets" className="py-24 lg:py-32" style={{ backgroundColor: C.pink }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <Reveal className="text-center mb-16">
          <p
            className="text-[10px] tracking-[0.28em] uppercase mb-4"
            style={{ fontFamily: "'Inter', sans-serif", color: C.primary, fontWeight: 500 }}
          >
            Coffrets Découverte
          </p>
          <h2
            className="mb-5"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: "clamp(36px, 5vw, 64px)",
              color: C.text,
              lineHeight: 1.1,
            }}
          >
            Commencez votre
            <span style={{ color: C.primary }}> Rituel</span>
          </h2>
          <p
            className="text-[14px] leading-[1.8] max-w-[440px] mx-auto"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, color: C.textMuted }}
          >
            Trois coffrets pour découvrir Lumière à votre rythme. Expédition offerte sur toutes les commandes.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1000px] mx-auto">
          {SETS.map((set, i) => (
            <Reveal key={set.name} delay={i * 0.1}>
              <div
                className="relative rounded-3xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-[0_20px_60px_rgba(236,72,153,0.18)]"
                style={{
                  backgroundColor: set.highlight ? C.text : C.white,
                  border: `1px solid ${set.highlight ? C.primary : C.primaryBorder}`,
                  transform: set.highlight ? "scale(1.04)" : "scale(1)",
                }}
              >
                {/* Popular badge */}
                {set.highlight && (
                  <div
                    className="absolute top-0 left-0 right-0 py-2 text-center text-[10px] tracking-[0.18em] uppercase"
                    style={{
                      background: `linear-gradient(135deg, ${C.primary}, ${C.lavender})`,
                      color: "#fff",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Le plus populaire
                  </div>
                )}

                <div className={`p-8 flex flex-col flex-1 ${set.highlight ? "pt-14" : ""}`}>
                  {/* Badge */}
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] tracking-[0.10em] uppercase mb-6 self-start"
                    style={{ backgroundColor: `${set.badgeColor}18`, color: set.badgeColor, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                  >
                    <Sparkles size={10} />
                    {set.badge}
                  </div>

                  {/* Name & Price */}
                  <h3
                    className="text-[30px] mb-1"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontStyle: "italic",
                      fontWeight: 700,
                      color: set.highlight ? "#fff" : C.text,
                    }}
                  >
                    {set.name}
                  </h3>

                  <div className="flex items-end gap-3 mb-2">
                    <span
                      className="text-[40px] leading-none"
                      style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: set.highlight ? C.primary : C.primary }}
                    >
                      {set.price}
                    </span>
                    <span
                      className="text-[16px] line-through mb-1"
                      style={{ fontFamily: "'Inter', sans-serif", color: set.highlight ? "rgba(255,255,255,0.35)" : C.textLight }}
                    >
                      {set.original}
                    </span>
                  </div>
                  <p
                    className="text-[11px] tracking-[0.08em] uppercase mb-8"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, color: set.highlight ? C.lavender : C.lavender }}
                  >
                    {set.saving}
                  </p>

                  {/* Items */}
                  <ul className="space-y-3 flex-1 mb-8">
                    {set.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[6px]"
                          style={{ backgroundColor: set.highlight ? C.primary : C.primary }}
                        />
                        <span
                          className="text-[13px]"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 300,
                            color: set.highlight ? "rgba(255,255,255,0.75)" : C.textMuted,
                          }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Expédition badge */}
                  <div
                    className="flex items-center gap-2 mb-6 text-[11px]"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, color: set.highlight ? "rgba(255,255,255,0.55)" : C.textMuted }}
                  >
                    <Package size={13} color={set.highlight ? C.primary : C.primary} />
                    Expédition offerte
                  </div>

                  {/* CTA */}
                  <button
                    className="w-full py-4 rounded-full text-[12px] tracking-[0.14em] uppercase transition-all duration-300 hover:opacity-90 font-medium"
                    style={{
                      background: set.highlight
                        ? `linear-gradient(135deg, ${C.primary}, ${C.lavender})`
                        : `transparent`,
                      border: set.highlight ? "none" : `1px solid ${C.primaryBorder}`,
                      color: set.highlight ? "#fff" : C.text,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {set.cta}
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
   FOOTER
   ========================================================================== */
function Footer() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  return (
    <footer id="contact" style={{ backgroundColor: C.text, borderTop: `1px solid ${C.primaryBorder}` }}>
      {/* Newsletter */}
      <div
        className="py-16"
        style={{ backgroundColor: C.pinkMid, borderBottom: `1px solid ${C.primaryBorder}` }}
      >
        <div className="max-w-[600px] mx-auto text-center px-6">
          <Sparkles size={28} color={C.primary} className="mx-auto mb-4" />
          <h3
            className="text-[28px] mb-3"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 600, color: C.text }}
          >
            Rejoignez la communauté
          </h3>
          <p
            className="text-[14px] mb-8"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, color: C.textMuted }}
          >
            Rituels beauté, conseils experts, offres exclusives — 2 emails par mois, pas plus.
          </p>
          {subscribed ? (
            <div
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full"
              style={{ backgroundColor: C.primaryDim, color: C.primary, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
            >
              <Heart size={16} />
              Bienvenue dans l'univers Lumière !
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSubscribed(true) }}
              className="flex gap-3 max-w-[440px] mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.fr"
                className="flex-1 px-5 py-3.5 rounded-full text-[13px] outline-none"
                style={{
                  border: `1px solid ${C.primaryBorder}`,
                  backgroundColor: C.white,
                  color: C.text,
                  fontFamily: "'Inter', sans-serif",
                }}
              />
              <button
                type="submit"
                className="px-6 py-3.5 rounded-full text-[12px] tracking-[0.12em] uppercase transition-all duration-300 hover:opacity-90 flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${C.primary}, ${C.lavender})`,
                  color: "#fff",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                }}
              >
                S'inscrire
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles size={16} color={C.primary} />
              <span
                className="text-[26px] italic"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: "#fff" }}
              >
                LUMIÈRE
              </span>
            </div>
            <p
              className="text-[13px] leading-[2] mb-6 max-w-[300px]"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, color: "rgba(255,255,255,0.55)" }}
            >
              Soins premium formulés en France. Vegan, cruelty-free, efficaces. La beauté authentique de la nature.
            </p>
            <div className="flex gap-4">
              {[Mail, Phone].map((Icon, i) => (
                <a
                  key={i}
                  href="#collections"
                  className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 hover:border-[#EC4899]/50"
                  style={{ border: `1px solid ${C.primaryBorder}` }}
                >
                  <Icon size={16} color="rgba(255,255,255,0.60)" />
                </a>
              ))}
            </div>
          </div>

          {/* Produits */}
          <div>
            <p
              className="text-[10px] tracking-[0.20em] uppercase mb-5"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, color: C.primary }}
            >
              Produits
            </p>
            <ul className="space-y-3">
              {["Sérum Éclat", "Crème Nuit", "Huile Précieuse", "Tonique Floral", "Masque Argile", "Contour Yeux"].map((item) => (
                <li key={item}>
                  <Link
                    href="#collections"
                    className="text-[12px] hover:opacity-100 transition-opacity"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, color: "rgba(255,255,255,0.55)" }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Aide */}
          <div>
            <p
              className="text-[10px] tracking-[0.20em] uppercase mb-5"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, color: C.primary }}
            >
              Aide & Infos
            </p>
            <ul className="space-y-3">
              {["Mon compte", "Suivre ma commande", "Retours & remboursements", "FAQ beauté", "Nous contacter", "Programme fidélité"].map((item) => (
                <li key={item}>
                  <Link
                    href="#collections"
                    className="text-[12px] hover:opacity-100 transition-opacity"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, color: "rgba(255,255,255,0.55)" }}
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
          style={{ borderTop: `1px solid ${C.primaryBorder}` }}
        >
          <p
            className="text-[11px]"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, color: "rgba(255,255,255,0.35)" }}
          >
            © 2025 Lumière Beauty. Tous droits réservés. Formulé & fabriqué en France.
          </p>
          <div className="flex gap-6">
            {["Mentions légales", "Confidentialité", "CGV"].map((item) => (
              <Link
                key={item}
                href="#sets"
                className="text-[10px] tracking-[0.10em] uppercase hover:opacity-80 transition-opacity"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, color: "rgba(255,255,255,0.35)" }}
              >
                {item}
              </Link>
            ))}
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
export default function Impact134Page() {
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
    <div style={{ backgroundColor: C.pink, fontFamily: "'Inter', sans-serif" }}>
      <ScrollProgressBar />
      <Nav scrolled={scrolled} />
      <Hero />
      <Marquee />
      <CollectionsSection />
      <RituelsSection />
      <IngredientsSection />
      <AtelierSection />
      <ReviewsSection />
      <PressSection />
      <SetsSection />
      <Footer />
    </div>
  )
}
