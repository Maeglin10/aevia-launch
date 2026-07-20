"use client";
// @ts-nocheck
import React, { useState, useEffect, useRef } from "react"
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useSpring,
  useMotionValue,
  useAnimationFrame,
} from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Heart,
  Star,
  Camera,
  Music,
  Flower2,
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  ArrowRight,
  ChevronRight,
  Users,
  Award,
  Check,
} from "lucide-react"

/* ==========================================================================
   CÉRÉMONIE — Wedding Planner (impact-200)
   Design: blush pink #FDF2F8, primary #DB2777, gold #CA8A04, text #831843
   Fonts: Great Vibes (script) + Cormorant Infant (serif) + Playfair Display
   ========================================================================== */

function useFonts() {
  useEffect(() => {
    const id = "fonts-impact-200"
    if (document.getElementById(id)) return
    const style = document.createElement("style")
    style.id = id
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;1,400&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');`
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
      initial={{ opacity: 0, x: -50 }}
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
      initial={{ opacity: 0, x: 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* --- Infinite Marquee ---------------------------------------------------- */
function Marquee({ items, speed = 40 }: { items: string[]; speed?: number }) {
  const baseX = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useAnimationFrame((_, delta) => {
    const moveBy = -(delta / 1000) * speed
    baseX.set(baseX.get() + moveBy)
    if (containerRef.current) {
      const width = containerRef.current.scrollWidth / 2
      if (Math.abs(baseX.get()) >= width) {
        baseX.set(0)
      }
    }
  })

  const doubled = [...items, ...items]

  return (
    <div className="overflow-hidden w-full" ref={containerRef}>
      <motion.div className="flex gap-0 whitespace-nowrap" style={{ x: baseX }}>
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-6 px-6">
            <Heart className="w-3 h-3 text-[#DB2777] flex-shrink-0" fill="currentColor" />
            <span
              className="text-[#831843]/60 text-sm tracking-[0.2em] uppercase"
              style={{ fontFamily: "'Cormorant Infant', serif" }}
            >
              {item}
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* --- Data ------------------------------------------------------------------ */

const SERVICES = [
  {
    title: "Coordination Complète",
    subtitle: "De A à Z",
    desc: "Nous prenons en charge la totalité de l'organisation — des premiers prestataires jusqu'au bouquet final. Votre rôle : vous laisser émouvoir.",
    icon: <Award className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
  },
  {
    title: "Décoration Florale",
    subtitle: "Art floral personnalisé",
    desc: "Nos fleuristes créent des compositions sur mesure : arches de fleurs, centres de table, boutonnières, et cascades pétales pour l'allée.",
    icon: <Flower2 className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80",
  },
  {
    title: "Animation Musicale",
    subtitle: "Quatuor à cordes & DJ",
    desc: "Cérémonie en quatuor de violons, cocktail jazz acoustique, soirée avec DJ résident — chaque moment sonore est orchestré avec soin.",
    icon: <Music className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1525772764200-be829a350797?w=600&q=80",
  },
  {
    title: "Photographie & Film",
    subtitle: "Souvenirs éternels",
    desc: "Nos photographes et vidéastes partenaires capturent chaque regard, chaque larme, chaque éclat de rire dans toute leur authenticité.",
    icon: <Camera className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
  },
  {
    title: "Traiteur Gastronomique",
    subtitle: "Tables d'exception",
    desc: "Cocktail dînatoire ou banquet assis, menus entièrement personnalisés, accords mets-vins par notre sommelier référent. Le goût du bonheur.",
    icon: <Star className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80",
  },
  {
    title: "Voyage de Noces",
    subtitle: "L'après aussi",
    desc: "Maldives, Kyoto, Santorini ou Amalfi — nous organisons votre lune de miel avec la même attention portée à chaque détail.",
    icon: <Heart className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1525772764200-be829a350797?w=600&q=80",
  },
]

const GALLERY_ITEMS = [
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    year: "2024",
    location: "Château de Vaux-le-Vicomte",
    size: "large",
  },
  {
    src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
    year: "2024",
    location: "Villa Ephrussi, Côte d'Azur",
    size: "small",
  },
  {
    src: "https://images.unsplash.com/photo-1525772764200-be829a350797?w=800&q=80",
    year: "2023",
    location: "Hôtel Meurice, Paris",
    size: "small",
  },
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    year: "2024",
    location: "Domaine de Chantilly",
    size: "medium",
  },
  {
    src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
    year: "2023",
    location: "Château de Versailles",
    size: "medium",
  },
  {
    src: "https://images.unsplash.com/photo-1525772764200-be829a350797?w=800&q=80",
    year: "2024",
    location: "Mas Provençal, Luberon",
    size: "small",
  },
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    year: "2023",
    location: "Bordeaux, Vignoble Médoc",
    size: "small",
  },
  {
    src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
    year: "2024",
    location: "Abbaye de Fontfroide",
    size: "large",
  },
]

const PACKAGES = [
  {
    name: "Essentiel",
    price: "2 990€",
    desc: "Pour les couples qui souhaitent une aide ciblée le Jour J.",
    features: [
      "Coordination Jour J (12h)",
      "Planning détaillé remis 1 mois avant",
      "1 réunion de bilan avec nos équipes",
      "Coordination de 8 prestataires max",
      "Support téléphonique 48h avant",
      "Livre de bienvenue personnalisé",
    ],
    highlight: false,
    cta: "Choisir Essentiel",
  },
  {
    name: "Prestige",
    price: "5 490€",
    desc: "Notre formule la plus appréciée — organisation complète sur 6 mois.",
    features: [
      "Organisation 6 mois avant",
      "Sélection & négociation prestataires",
      "Coordination Jour J illimitée",
      "Décoration & thème personnalisés",
      "Accompagnement mairie & cérémonie",
      "Séance d'essai traiteur offerte",
      "Assistant dédié disponible 7j/7",
      "Suivi budgétaire hebdomadaire",
    ],
    highlight: true,
    cta: "Choisir Prestige",
  },
  {
    name: "Signature",
    price: "9 990€+",
    desc: "L'excellence absolue — un mariage d'exception sans aucune limite.",
    features: [
      "Organisation sur 12 mois",
      "Accès aux lieux privatisés exclusifs",
      "Décorations sur mesure haut de gamme",
      "Fleurs importées directement",
      "Chef étoilé à table",
      "Photographe & vidéaste premium",
      "Lune de miel organisée incluse",
      "Conciergerie 24h/24 pendant la cérémonie",
    ],
    highlight: false,
    cta: "Sur mesure — Nous contacter",
  },
]

const STEPS = [
  {
    num: "01",
    title: "La Rencontre",
    desc: "Café ou visio — nous apprenons à vous connaître, votre histoire, vos rêves, votre vision de ce jour parfait. Pas de formulaires, juste une conversation sincère.",
    icon: <Heart className="w-7 h-7 text-[#DB2777]" />,
  },
  {
    num: "02",
    title: "La Vision",
    desc: "Nous construisons ensemble votre moodboard — ambiance, palette de couleurs, thème floral, atmosphère souhaitée. Votre ADN, transcrit visuellement.",
    icon: <Star className="w-7 h-7 text-[#DB2777]" />,
  },
  {
    num: "03",
    title: "La Planification",
    desc: "Sélection des prestataires, négociation des contrats, planning détaillé. Vous validez à chaque étape, nous gérons l'administratif.",
    icon: <Calendar className="w-7 h-7 text-[#DB2777]" />,
  },
  {
    num: "04",
    title: "La Répétition",
    desc: "Visite de reconnaissance du lieu, brief général des équipes, répétition de la cérémonie. Le Jour J commence ici, dans les coulisses.",
    icon: <Users className="w-7 h-7 text-[#DB2777]" />,
  },
  {
    num: "05",
    title: "Le Grand Jour",
    desc: "Vous vivez votre mariage pleinement. Nous gérons tout — des imprévus aux transitions — pour que vous n'ayez qu'à vous souvenir.",
    icon: <Award className="w-7 h-7 text-[#DB2777]" />,
  },
]

const TESTIMONIALS = [
  {
    names: "Sophie & Mathieu",
    date: "14 Juin 2024",
    location: "Château de Vaux-le-Vicomte",
    quote: "Cérémonie a transformé notre rêve en quelque chose de bien au-delà. Chaque détail respirait l'amour. Nous avons pleuré, dansé, ri — et n'avons eu à penser à rien. Une magie absolue.",
    stars: 5,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=200&q=80",
  },
  {
    names: "Clara & Antoine",
    date: "28 Septembre 2024",
    location: "Villa Ephrussi, Côte d'Azur",
    quote: "L'équipe a su comprendre notre vision sans qu'on ait les mots pour la décrire. Les fleurs, la lumière, la musique — tout était parfaitement nous. Nos invités en parlent encore.",
    stars: 5,
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=200&q=80",
  },
  {
    names: "Amira & Lucas",
    date: "12 Juillet 2024",
    location: "Abbaye de Fontfroide",
    quote: "Nous étions sceptiques sur le recours à une wedding planner — aujourd'hui, c'est la meilleure décision de nos préparatifs. Une tranquillité d'esprit inestimable, et un résultat époustouflant.",
    stars: 5,
    image: "https://images.unsplash.com/photo-1525772764200-be829a350797?w=200&q=80",
  },
  {
    names: "Julie & Maxime",
    date: "22 Mars 2024",
    location: "Domaine de Chantilly",
    quote: "Notre mariage était un défi logistique — 180 invités, des prestataires dans 4 pays. Cérémonie a tout orchestré avec une sérénité impressionnante. Résultat : une perfection.",
    stars: 5,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=200&q=80",
  },
]

const PARTNERS = [
  "Château de Versailles",
  "Hôtel Meurice",
  "Villa Ephrussi",
  "Château de Vaux-le-Vicomte",
  "Abbaye de Fontfroide",
  "Domaine de Chantilly",
  "Hôtel Plaza Athénée",
  "Mas Provençal",
]

const MARQUEE_ITEMS = [
  "Mariage",
  "Fiançailles",
  "Anniversaire de Noces",
  "Vœux de Mariage",
  "Cérémonie Laïque",
  "Renouvellement",
  "Mariage Civil",
  "Réception de Gala",
]

/* ==========================================================================
   MAIN PAGE
   ========================================================================== */


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function Impact200Page() {
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

  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [formData, setFormData] = useState({
    names: "",
    email: "",
    phone: "",
    date: "",
    guests: "",
    location: "",
    package: "",
    message: "",
  })
  const [formSent, setFormSent] = useState(false)

  const { scrollYProgress } = useScroll()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "25%"])
  const heroOpacity = useTransform(heroScroll, [0, 0.85], [1, 0])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, []);

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
  }, [c]);// Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((p) => (p + 1) % TESTIMONIALS.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSent(true)
  }

  return (
    <div
      className="min-h-dvh overflow-x-hidden bg-[#FDF2F8] text-[#831843]"
      style={{ fontFamily: "'Cormorant Infant', serif" }}
    >
      {/* ── Scroll Progress Bar ──────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-[#DB2777] to-[#CA8A04] z-[1000] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-[900] transition-all duration-500 ${
          scrolled
            ? "bg-[#FDF2F8]/95 backdrop-blur-md shadow-sm shadow-[#DB2777]/10"
            : "bg-transparent"
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="#hero" className="flex items-center gap-3">
            {fd?.logoBase64 ? (
              // Client logo (uploaded in the brief) replaces the placeholder mark —
              // essential for the client to recognise their brand in the render.
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <Heart className="w-5 h-5 text-[#DB2777]" fill="currentColor" />
                <span
                  className="text-4xl text-[#831843]"
                  style={{ fontFamily: "'Great Vibes', cursive" }}
                >{fd?.businessName ?? "Cérémonie"}</span>
              </>
            )}
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {["Services", "Galerie", "Packages", "Témoignages", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-light text-[#831843]/60 hover:text-[#DB2777] transition-colors tracking-wide"
                style={{ fontFamily: "'Cormorant Infant', serif" }}
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTA + Burger */}
          <div className="flex items-center gap-4">
            <a
              href="#contact"
              className="hidden lg:flex items-center gap-2 bg-[#DB2777] hover:bg-[#be185d] text-white text-sm font-medium px-6 py-3 rounded-full tracking-wide transition-all shadow-lg shadow-[#DB2777]/20"
              style={{ fontFamily: "'Cormorant Infant', serif" }}
            >
              Commencer
              <Heart className="w-3 h-3" fill="currentColor" />
            </a>
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden text-[#831843] p-2"
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
            className="fixed inset-0 z-[950] bg-[#FDF2F8] flex flex-col"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-6 h-20 flex items-center justify-between border-b border-[#DB2777]/10">
              {fd?.logoBase64 ? (
                // Client logo (uploaded in the brief) replaces the placeholder mark —
                // essential for the client to recognise their brand in the render.
                <img
                  src={fd.logoBase64}
                  alt={fd?.businessName ?? 'logo'}
                  style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
                />
              ) : (
                <span
                  className="text-4xl text-[#831843]"
                  style={{ fontFamily: "'Great Vibes', cursive" }}
                >{fd?.businessName ?? "Cérémonie"}</span>
              )}
              <button onClick={() => setMenuOpen(false)} className="p-2 text-[#831843]">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col flex-1 justify-center px-10 gap-8">
              {["Services", "Galerie", "Packages", "Témoignages", "Contact"].map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-5xl text-[#831843]/70 hover:text-[#DB2777] transition-colors border-b border-[#DB2777]/10 pb-6"
                  style={{ fontFamily: "'Great Vibes', cursive" }}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {item}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="mt-4 bg-[#DB2777] text-white text-center py-5 rounded-full text-lg tracking-wide"
                style={{ fontFamily: "'Cormorant Infant', serif" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Commencer notre histoire
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        id="hero"
        className="relative h-dvh min-h-[700px] flex items-center overflow-hidden"
      >
        {/* Soft pink overlay base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FDF2F8] via-[#FDF2F8]/80 to-[#FDF2F8]/60 z-10" />

        {/* Parallax Image */}
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY, opacity: heroOpacity }}>
          <Image
            src={photo(0, "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=90")}
            alt="Mariage de rêve"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Decorative floral divider */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FDF2F8] to-transparent z-20" />

        {/* Content */}
        <div className="relative z-30 max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
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
              <Heart className="w-4 h-4 text-[#DB2777]" fill="currentColor" />
              <span
                className="text-[#DB2777] text-sm tracking-[0.15em] font-light italic"
                style={{ fontFamily: "'Cormorant Infant', serif" }}
              >
                Wedding Planner · Paris & France entière
              </span>
            </motion.div>

            {/* Script headline */}
            <motion.h1
              className="text-[clamp(3.5rem,8vw,7rem)] leading-[0.9] text-[#831843] mb-6"
              style={{ fontFamily: "'Great Vibes', cursive" }}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >{c?.heroHeadline ?? <>
              Votre Jour,
              <br />
              Notre Art
            </>}</motion.h1>

            {/* Serif subtitle */}
            <motion.p
              className="text-[#831843]/60 text-xl max-w-lg mb-10 leading-relaxed italic font-light"
              style={{ fontFamily: "'Playfair Display', serif" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >{c?.heroSubline ?? fd?.tagline ?? <>
              Nous orchestrons chaque détail de votre mariage avec une élégance méticuleuse, pour que ce jour reste gravé à jamais dans les mémoires.
            </>}</motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 bg-[#DB2777] hover:bg-[#be185d] text-white font-medium px-8 py-5 rounded-full tracking-wide text-base transition-all shadow-xl shadow-[#DB2777]/30"
              >
                Commencer notre histoire
                <Heart className="w-4 h-4 group-hover:scale-125 transition-transform" fill="currentColor" />
              </a>
              <a
                href="#galerie"
                className="inline-flex items-center gap-3 border border-[#DB2777]/30 hover:border-[#DB2777] text-[#831843] hover:text-[#DB2777] font-medium px-8 py-5 rounded-full tracking-wide text-base transition-all"
              >
                Voir nos mariages
                <ChevronRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex gap-10 mt-14 pt-10 border-t border-[#DB2777]/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.1 }}
            >
              {[
                { val: "320+", label: "Mariages organisés" },
                { val: "12", label: "Années d'expérience" },
                { val: "100%", label: "Couples heureux" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p
                    className="text-3xl text-[#DB2777] font-semibold"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {stat.val}
                  </p>
                  <p className="text-[#831843]/40 text-xs tracking-wider mt-1 font-light">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Floating card */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: 60, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <div className="relative w-full max-w-sm mx-auto">
                <div className="aspect-[4/5] relative rounded-3xl overflow-hidden shadow-2xl shadow-[#DB2777]/20">
                  <Image
                    src={photo(1, "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80")}
                    alt="Mariage romantique"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Glass badge */}
                <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-[#DB2777]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#DB2777]/10 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-[#CA8A04]" fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-[#831843] font-semibold text-sm">5.0 · Exceptionnel</p>
                      <p className="text-[#831843]/40 text-xs">320+ avis vérifiés</p>
                    </div>
                  </div>
                </div>

                {/* Top badge */}
                <div className="absolute -top-4 -right-4 bg-[#CA8A04] rounded-2xl px-4 py-2 shadow-lg">
                  <p className="text-white text-xs font-medium tracking-wide">Meilleur Wedding Planner 2024</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────────── */}
      <section className="py-8 bg-white/60 border-y border-[#DB2777]/10 overflow-hidden">
        <Marquee items={MARQUEE_ITEMS} speed={35} />
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────── */}
      <section id="services" className="py-32 bg-[#FDF2F8]">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex items-center gap-4 mb-6">
              <Heart className="w-4 h-4 text-[#DB2777]" fill="currentColor" />
              <span
                className="text-[#DB2777] text-sm tracking-[0.2em] italic font-light"
                style={{ fontFamily: "'Cormorant Infant', serif" }}
              >
                Ce que nous faisons pour vous
              </span>
            </div>
            <h2
              className="text-[clamp(2.5rem,6vw,5rem)] leading-tight text-[#831843] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Nos Services
            </h2>
            <h3
              className="text-[clamp(2rem,5vw,4rem)] text-[#DB2777] mb-6 leading-none"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >{c?.aboutTitle ?? fd?.businessName ?? <>
              avec amour
            </>}</h3>
            <p
              className="text-[#831843]/60 max-w-xl text-lg leading-relaxed mb-20 italic font-light"
              style={{ fontFamily: "'Cormorant Infant', serif" }}
            >{c?.aboutText ?? <>
              Chaque mariage est une histoire unique. Nous construisons la vôtre avec la même passion depuis 12 ans.
            </>}</p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, i) => (
              <Reveal key={service.title} delay={i * 0.1}>
                <motion.div
                  className="group bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-[#DB2777]/10 hover:border-[#DB2777]/30 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-[#DB2777]/10"
                  whileHover={{ y: -6 }}
                >
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                    <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#DB2777]">
                      {service.icon}
                    </div>
                  </div>

                  <div className="p-6">
                    <p
                      className="text-[#CA8A04] text-xs tracking-[0.2em] uppercase mb-1 font-medium"
                    >
                      {service.subtitle}
                    </p>
                    <h3
                      className="text-xl text-[#831843] mb-3 font-semibold"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {service.title}
                    </h3>
                    <p
                      className="text-[#831843]/50 text-sm leading-relaxed italic font-light"
                      style={{ fontFamily: "'Cormorant Infant', serif" }}
                    >
                      {service.desc}
                    </p>
                    <div className="flex items-center gap-2 mt-4 text-[#DB2777] text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>En savoir plus</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALERIE ─────────────────────────────────────────────── */}
      <section id="galerie" className="py-32 bg-white/40">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex items-center gap-4 mb-6">
              <Heart className="w-4 h-4 text-[#DB2777]" fill="currentColor" />
              <span
                className="text-[#DB2777] text-sm tracking-[0.2em] italic font-light"
                style={{ fontFamily: "'Cormorant Infant', serif" }}
              >
                Nos plus belles histoires
              </span>
            </div>
            <h2
              className="text-[clamp(2.5rem,6vw,5rem)] leading-tight text-[#831843] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              La Galerie
            </h2>
            <h3
              className="text-[clamp(2rem,5vw,4rem)] text-[#DB2777] mb-16 leading-none"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              de souvenirs
            </h3>
          </Reveal>

          {/* Masonry-style grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GALLERY_ITEMS.map((item, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <motion.div
                  className={`group relative overflow-hidden rounded-2xl cursor-pointer bg-[#FDF2F8] ${
                    item.size === "large"
                      ? "row-span-2"
                      : ""
                  }`}
                  style={{
                    aspectRatio: item.size === "large" ? "3/4" : item.size === "medium" ? "4/3" : "1/1",
                  }}
                  whileHover={{ scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={item.src}
                    alt={`${item.location} ${item.year}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#831843]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <p
                      className="text-white font-semibold text-sm"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {item.location}
                    </p>
                    <p className="text-white/60 text-xs">{item.year}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PACKAGES ─────────────────────────────────────────────── */}
      <section id="packages" className="py-32 bg-[#FDF2F8]">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex items-center gap-4 mb-6">
              <Heart className="w-4 h-4 text-[#DB2777]" fill="currentColor" />
              <span
                className="text-[#DB2777] text-sm tracking-[0.2em] italic font-light"
                style={{ fontFamily: "'Cormorant Infant', serif" }}
              >
                Formules & tarifs
              </span>
            </div>
            <h2
              className="text-[clamp(2.5rem,6vw,5rem)] leading-tight text-[#831843] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Nos Packages
            </h2>
            <h3
              className="text-[clamp(2rem,5vw,4rem)] text-[#DB2777] mb-6 leading-none"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              à votre image
            </h3>
            <p
              className="text-[#831843]/60 max-w-xl text-lg leading-relaxed mb-20 italic font-light"
              style={{ fontFamily: "'Cormorant Infant', serif" }}
            >
              Trois niveaux de service, une même promesse d'excellence. Chaque formule est personnalisable selon vos envies.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PACKAGES.map((pkg, i) => (
              <Reveal key={pkg.name} delay={i * 0.1}>
                <div
                  className={`relative rounded-3xl p-8 flex flex-col transition-all duration-500 ${
                    pkg.highlight
                      ? "bg-[#831843] text-white shadow-2xl shadow-[#831843]/30 scale-[1.02]"
                      : "bg-white/80 backdrop-blur-sm border border-[#DB2777]/10 hover:border-[#DB2777]/30 hover:shadow-xl hover:shadow-[#DB2777]/10"
                  }`}
                >
                  {pkg.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-[#CA8A04] text-white text-xs font-medium px-4 py-1.5 rounded-full tracking-wide shadow-lg">
                        Le plus choisi
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3
                      className={`text-2xl font-semibold mb-1 ${pkg.highlight ? "text-white" : "text-[#831843]"}`}
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {pkg.name}
                    </h3>
                    <p
                      className={`text-4xl font-bold mb-2 ${pkg.highlight ? "text-[#CA8A04]" : "text-[#DB2777]"}`}
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {pkg.price}
                    </p>
                    <p
                      className={`text-sm italic font-light ${pkg.highlight ? "text-white/60" : "text-[#831843]/50"}`}
                      style={{ fontFamily: "'Cormorant Infant', serif" }}
                    >
                      {pkg.desc}
                    </p>
                  </div>

                  <ul className="space-y-3 flex-1 mb-8">
                    {pkg.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            pkg.highlight ? "bg-[#CA8A04]/20" : "bg-[#DB2777]/10"
                          }`}
                        >
                          <Check
                            className={`w-3 h-3 ${pkg.highlight ? "text-[#CA8A04]" : "text-[#DB2777]"}`}
                          />
                        </div>
                        <span
                          className={`text-sm font-light ${pkg.highlight ? "text-white/80" : "text-[#831843]/70"}`}
                          style={{ fontFamily: "'Cormorant Infant', serif" }}
                        >
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contact"
                    className={`text-center py-4 rounded-full text-sm font-medium tracking-wide transition-all flex items-center justify-center gap-2 ${
                      pkg.highlight
                        ? "bg-[#CA8A04] hover:bg-[#b45309] text-white shadow-lg shadow-[#CA8A04]/30"
                        : "bg-[#DB2777] hover:bg-[#be185d] text-white"
                    }`}
                  >
                    {pkg.cta}
                    <Heart className="w-3 h-3" fill="currentColor" />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESSUS ─────────────────────────────────────────────── */}
      <section className="py-32 bg-white/50">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="flex items-center gap-4 mb-6">
              <Heart className="w-4 h-4 text-[#DB2777]" fill="currentColor" />
              <span
                className="text-[#DB2777] text-sm tracking-[0.2em] italic font-light"
                style={{ fontFamily: "'Cormorant Infant', serif" }}
              >
                Comment nous travaillons
              </span>
            </div>
            <h2
              className="text-[clamp(2.5rem,6vw,5rem)] leading-tight text-[#831843] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Notre Processus
            </h2>
            <h3
              className="text-[clamp(2rem,5vw,4rem)] text-[#DB2777] mb-16 leading-none"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              en cinq étapes
            </h3>
          </Reveal>

          <div className="space-y-6">
            {STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 0.08}>
                <div className="group grid md:grid-cols-[80px_1fr] gap-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#DB2777]/10 hover:border-[#DB2777]/30 transition-all duration-500 hover:shadow-lg hover:shadow-[#DB2777]/10">
                  {/* Step number */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-[#FDF2F8] group-hover:bg-[#DB2777]/10 rounded-full flex items-center justify-center transition-colors duration-300">
                      {step.icon}
                    </div>
                    <span
                      className="text-[#DB2777]/30 text-xs font-semibold tracking-widest"
                    >
                      {step.num}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center">
                    <h3
                      className="text-xl text-[#831843] font-semibold mb-2"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-[#831843]/55 text-base italic font-light leading-relaxed"
                      style={{ fontFamily: "'Cormorant Infant', serif" }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ───────────────────────────────────────────── */}
      <section id="témoignages" className="py-32 bg-[#FDF2F8]">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="flex items-center gap-4 mb-6">
              <Heart className="w-4 h-4 text-[#DB2777]" fill="currentColor" />
              <span
                className="text-[#DB2777] text-sm tracking-[0.2em] italic font-light"
                style={{ fontFamily: "'Cormorant Infant', serif" }}
              >
                Ils nous font confiance
              </span>
            </div>
            <h2
              className="text-[clamp(2.5rem,6vw,5rem)] leading-tight text-[#831843] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Témoignages
            </h2>
            <h3
              className="text-[clamp(2rem,5vw,4rem)] text-[#DB2777] mb-16 leading-none"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              de couples heureux
            </h3>
          </Reveal>

          {/* Active testimonial */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 md:p-14 border border-[#DB2777]/10 shadow-xl shadow-[#DB2777]/5 mb-8"
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-6">
                {Array.from({ length: TESTIMONIALS[activeTestimonial].stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#CA8A04]" fill="currentColor" />
                ))}
              </div>

              <blockquote
                className="text-[#831843] text-xl md:text-2xl leading-relaxed italic font-light mb-8"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                "{TESTIMONIALS[activeTestimonial].quote}"
              </blockquote>

              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#DB2777]/20">
                  <Image
                    src={TESTIMONIALS[activeTestimonial].image}
                    alt={TESTIMONIALS[activeTestimonial].names}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p
                    className="text-[#831843] font-semibold"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {TESTIMONIALS[activeTestimonial].names}
                  </p>
                  <div className="flex items-center gap-3 text-[#831843]/40 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{TESTIMONIALS[activeTestimonial].date}</span>
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{TESTIMONIALS[activeTestimonial].location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`rounded-full transition-all duration-300 ${
                  activeTestimonial === i
                    ? "w-8 h-2 bg-[#DB2777]"
                    : "w-2 h-2 bg-[#DB2777]/20 hover:bg-[#DB2777]/40"
                }`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>

          {/* Grid of couples */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`group relative overflow-hidden rounded-2xl p-4 border text-left transition-all duration-300 ${
                  activeTestimonial === i
                    ? "border-[#DB2777]/50 bg-[#DB2777]/5"
                    : "border-[#DB2777]/10 bg-white/60 hover:border-[#DB2777]/30"
                }`}
              >
                <p
                  className={`text-sm font-semibold mb-0.5 ${activeTestimonial === i ? "text-[#DB2777]" : "text-[#831843]"}`}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t.names}
                </p>
                <p className="text-[#831843]/40 text-xs">{t.date}</p>
                <div className="flex items-center gap-0.5 mt-2">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-3 h-3 text-[#CA8A04]" fill="currentColor" />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTENAIRES ───────────────────────────────────────────── */}
      <section className="py-16 bg-white/40 border-y border-[#DB2777]/10">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <p
              className="text-center text-[#831843]/40 text-sm tracking-[0.2em] uppercase mb-10"
              style={{ fontFamily: "'Cormorant Infant', serif" }}
            >
              Nos lieux partenaires d'exception
            </p>
          </Reveal>
          <Marquee items={PARTNERS} speed={30} />
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────── */}
      <section id="contact" className="py-32 bg-[#FDF2F8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left */}
            <RevealLeft>
              <div className="flex items-center gap-4 mb-6">
                <Heart className="w-4 h-4 text-[#DB2777]" fill="currentColor" />
                <span
                  className="text-[#DB2777] text-sm tracking-[0.2em] italic font-light"
                  style={{ fontFamily: "'Cormorant Infant', serif" }}
                >
                  Parlons de votre mariage
                </span>
              </div>
              <h2
                className="text-[clamp(2.5rem,6vw,5rem)] leading-tight text-[#831843] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Commençons
              </h2>
              <h3
                className="text-[clamp(2rem,5vw,4rem)] text-[#DB2777] mb-8 leading-none"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                votre histoire
              </h3>

              <p
                className="text-[#831843]/60 text-lg leading-relaxed mb-12 italic font-light max-w-md"
                style={{ fontFamily: "'Cormorant Infant', serif" }}
              >
                Première consultation offerte et sans engagement. Parlons de votre vision, de votre date, de votre rêve.
              </p>

              {/* Contact info */}
              <div className="space-y-6 mb-12">
                {[
                  {
                    icon: <MapPin className="w-5 h-5" />,
                    label: "Notre Studio",
                    value: "18 Avenue Montaigne, 75008 Paris",
                    sub: "Métro Franklin D. Roosevelt",
                  },
                  {
                    icon: <Phone className="w-5 h-5" />,
                    label: "Téléphone",
                    value: "+33 1 47 00 00 00",
                    sub: "Lundi – Vendredi, 9h – 19h",
                  },
                  {
                    icon: <Mail className="w-5 h-5" />,
                    label: "Email",
                    value: "bonjour@ceremonie.fr",
                    sub: "Réponse sous 24h",
                  },
                  {
                    icon: <Clock className="w-5 h-5" />,
                    label: "Consultations",
                    value: "Lun – Sam : 9h – 20h",
                    sub: "Sur rendez-vous uniquement",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="text-[#DB2777] mt-0.5 flex-shrink-0">{item.icon}</div>
                    <div>
                      <p className="text-[#831843]/40 text-xs tracking-wider uppercase mb-0.5 font-medium">{item.label}</p>
                      <p
                        className="text-[#831843] font-medium"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {item.value}
                      </p>
                      <p className="text-[#831843]/40 text-xs italic">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Award callout */}
              <div className="flex items-center gap-4 p-5 bg-[#CA8A04]/10 rounded-2xl border border-[#CA8A04]/20">
                <Award className="w-8 h-8 text-[#CA8A04] flex-shrink-0" />
                <div>
                  <p
                    className="text-[#831843] font-semibold text-sm"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Meilleur Wedding Planner France 2024
                  </p>
                  <p className="text-[#831843]/50 text-xs italic">Décerné par French Wedding Awards</p>
                </div>
              </div>
            </RevealLeft>

            {/* Right: Form */}
            <RevealRight>
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-[#DB2777]/10 shadow-2xl shadow-[#DB2777]/5 p-8 md:p-10">
                {formSent ? (
                  <motion.div
                    className="flex flex-col items-center justify-center h-80 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-20 h-20 bg-[#DB2777]/10 rounded-full flex items-center justify-center mb-6">
                      <Heart className="w-10 h-10 text-[#DB2777]" fill="currentColor" />
                    </div>
                    <h3
                      className="text-3xl text-[#831843] mb-3"
                      style={{ fontFamily: "'Great Vibes', cursive" }}
                    >
                      Merci pour votre confiance
                    </h3>
                    <p
                      className="text-[#831843]/60 text-base italic font-light max-w-xs"
                      style={{ fontFamily: "'Cormorant Infant', serif" }}
                    >
                      Nous reviendrons vers vous dans les 24h pour organiser votre consultation offerte.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="mb-6">
                      <h3
                        className="text-3xl text-[#831843] mb-1"
                        style={{ fontFamily: "'Great Vibes', cursive" }}
                      >
                        Votre mariage de rêve
                      </h3>
                      <p
                        className="text-[#831843]/50 text-sm italic"
                        style={{ fontFamily: "'Cormorant Infant', serif" }}
                      >
                        Consultation gratuite, sans engagement
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[#831843]/50 text-xs tracking-wider uppercase block mb-2">
                          Vos prénoms
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.names}
                          onChange={(e) => setFormData({ ...formData, names: e.target.value })}
                          className="w-full bg-[#FDF2F8] border border-[#DB2777]/20 focus:border-[#DB2777] text-[#831843] text-sm px-4 py-3 rounded-xl outline-none transition-colors"
                          placeholder="Sophie & Antoine"
                          style={{ fontFamily: "'Cormorant Infant', serif" }}
                        />
                      </div>
                      <div>
                        <label className="text-[#831843]/50 text-xs tracking-wider uppercase block mb-2">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-[#FDF2F8] border border-[#DB2777]/20 focus:border-[#DB2777] text-[#831843] text-sm px-4 py-3 rounded-xl outline-none transition-colors"
                          placeholder="+33 6 00 00 00 00"
                          style={{ fontFamily: "'Cormorant Infant', serif" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[#831843]/50 text-xs tracking-wider uppercase block mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#FDF2F8] border border-[#DB2777]/20 focus:border-[#DB2777] text-[#831843] text-sm px-4 py-3 rounded-xl outline-none transition-colors"
                        placeholder="couple@example.com"
                        style={{ fontFamily: "'Cormorant Infant', serif" }}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[#831843]/50 text-xs tracking-wider uppercase block mb-2">
                          Date envisagée
                        </label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full bg-[#FDF2F8] border border-[#DB2777]/20 focus:border-[#DB2777] text-[#831843] text-sm px-4 py-3 rounded-xl outline-none transition-colors"
                          style={{ fontFamily: "'Cormorant Infant', serif" }}
                        />
                      </div>
                      <div>
                        <label className="text-[#831843]/50 text-xs tracking-wider uppercase block mb-2">
                          Nombre d'invités
                        </label>
                        <select
                          value={formData.guests}
                          onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                          className="w-full bg-[#FDF2F8] border border-[#DB2777]/20 focus:border-[#DB2777] text-[#831843] text-sm px-4 py-3 rounded-xl outline-none transition-colors"
                          style={{ fontFamily: "'Cormorant Infant', serif" }}
                        >
                          <option value="">Estimé</option>
                          <option>Moins de 50</option>
                          <option>50 – 100</option>
                          <option>100 – 200</option>
                          <option>200+</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[#831843]/50 text-xs tracking-wider uppercase block mb-2">
                        Formule souhaitée
                      </label>
                      <select
                        value={formData.package}
                        onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                        className="w-full bg-[#FDF2F8] border border-[#DB2777]/20 focus:border-[#DB2777] text-[#831843] text-sm px-4 py-3 rounded-xl outline-none transition-colors"
                        style={{ fontFamily: "'Cormorant Infant', serif" }}
                      >
                        <option value="">Choisir une formule</option>
                        {PACKAGES.map((p) => (
                          <option key={p.name} value={p.name}>
                            {p.name} — {p.price}
                          </option>
                        ))}
                        <option value="Conseil">Je ne sais pas encore</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[#831843]/50 text-xs tracking-wider uppercase block mb-2">
                        Parlez-nous de votre rêve
                      </label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-[#FDF2F8] border border-[#DB2777]/20 focus:border-[#DB2777] text-[#831843] text-sm px-4 py-3 rounded-xl outline-none transition-colors resize-none"
                        placeholder="Lieu de rêve, ambiance, thème, quelques mots sur votre histoire..."
                        style={{ fontFamily: "'Cormorant Infant', serif" }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#DB2777] hover:bg-[#be185d] text-white font-medium py-5 rounded-full tracking-wide text-base transition-all shadow-xl shadow-[#DB2777]/30 flex items-center justify-center gap-2"
                      style={{ fontFamily: "'Cormorant Infant', serif" }}
                    >
                      Commencer notre histoire
                      <Heart className="w-4 h-4" fill="currentColor" />
                    </button>

                    <p
                      className="text-[#831843]/30 text-xs text-center italic"
                      style={{ fontFamily: "'Cormorant Infant', serif" }}
                    >
                      Consultation de 45 minutes offerte · Sans engagement · Confidentiel
                    </p>
                  </form>
                )}
              </div>
            </RevealRight>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="bg-[#831843] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#DB2777]" fill="currentColor" />
                <span
                  className="text-3xl text-white/90"
                  style={{ fontFamily: "'Great Vibes', cursive" }}
                >{fd?.businessName ?? "Cérémonie"}</span>
              </div>
              <p
                className="text-white/40 text-xs italic"
                style={{ fontFamily: "'Cormorant Infant', serif" }}
              >
                Wedding Planner · Paris & France entière
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6">
              {["Services", "Galerie", "Packages", "Témoignages", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-white/40 text-sm hover:text-white/70 transition-colors"
                  style={{ fontFamily: "'Cormorant Infant', serif" }}
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="text-center md:text-right">
              <p
                className="text-white/30 text-xs italic mb-1"
                style={{ fontFamily: "'Cormorant Infant', serif" }}
              >
                © {new Date().getFullYear()} Cérémonie. Tous droits réservés.
              </p>
              <p
                className="text-white/20 text-xs"
                style={{ fontFamily: "'Cormorant Infant', serif" }}
              >
                18 Avenue Montaigne, Paris 8ème
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
