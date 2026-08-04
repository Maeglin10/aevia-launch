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
} from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {

  Flower,
  Leaf,
  Star,
  ArrowRight,
  ChevronRight,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Heart,
  Clock,
  Award,
  Users,
  Scissors,
  Sun,
  Sparkles,
  CheckCircle,
} from "lucide-react"
import { resolveList } from "@/lib/templates/resolveList";
import {
  clientAddress,
  clientCity,
  clientFaq,
  clientName,
  clientPhotos,
  clientReviews,
  clientServices,
  clientStats,
  clientText,
} from "@/lib/templates/clientContent";

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let bp: any = null;
// La session complète, pour lib/templates/clientContent : même portée
// que fd/c/bp, pour les sous-composants qui n'ont pas de props.
let sessionData: any = null;
let brand: any = null;

const Facebook = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

/* ==========================================================================
   BOTANICA — LUXURY FLORAL ATELIER — DATA
   ========================================================================== */

const NAV_LINKS = [
  { label: "Collections", href: "#collections" },
  { label: "Événements", href: "#evenements" },
  { label: "Studio", href: "#studio" },
  { label: "Atelier", href: "#atelier" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
]

function ARRANGEMENTS_DEMO_LIVE() {
  return [
  {
    id: "a-01",
    name: "Mémoire d'Été",
    season: "Été",
    price: "195€",
    description: "Composition estivale aux roses centifolia et pivoines pêche, cueillie au lever du soleil.",
    image: (clientPhotos(sessionData)[0] || "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80"),
    tag: "Exclusif",
  },
  {
    id: "a-02",
    name: "Pivoine Atlas",
    season: "Printemps",
    price: "245€",
    description: "Bouquet monochrome de pivoines Sarah Bernhardt aux pétales soyeux et au parfum enivrant.",
    image: (clientPhotos(sessionData)[1] || "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=800&q=80"),
    tag: "Best-seller",
  },
  {
    id: "a-03",
    name: "Automne Ardent",
    season: "Automne",
    price: "175€",
    description: "Composition aux teintes profondes : dahlias café, chrysanthèmes bordeaux et branches de baies.",
    image: (clientPhotos(sessionData)[2] || "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80"),
    tag: "Saisonnier",
  },
  {
    id: "a-04",
    name: "Lys du Japon",
    season: "Été",
    price: "220€",
    description: "Élégance orientale : lys Casa Blanca immaculés entre bambous lacqués et orchidées blanches.",
    image: (clientPhotos(sessionData)[3] || "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80"),
    tag: "Signature",
  },
  {
    id: "a-05",
    name: "Jasmin de Grasse",
    season: "Printemps",
    price: "185€",
    description: "Bouquet aérien de jasmin frais, gardénias et muguet — le souvenir olfactif du sud.",
    image: (clientPhotos(sessionData)[4] || "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=800&q=80"),
    tag: "Parfumé",
  },
  {
    id: "a-06",
    name: "Anémone Sauvage",
    season: "Hiver",
    price: "165€",
    description: "Anémones sauvages de nos jardins provençaux, iris noirs et renoncules bicolores.",
    image: (clientPhotos(sessionData)[5] || "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80"),
    tag: "Hivernal",
  },
];
}
let ARRANGEMENTS_DEMO = ARRANGEMENTS_DEMO_LIVE();

const EVENTS_SOURCE = [
  {
    icon: Heart,
    title: "Mariage",
    desc: "De la cérémonie à la réception, nous orchestrons chaque détail floral pour que votre journée transcende l'ordinaire. Bouquets de mariée, arches, centres de table — une symphonie botanique.",
    features: ["Consultation privée 2h", "Maquette florale", "Installation le jour J", "Équipe dédiée"],
  },
  {
    icon: Award,
    title: "Corporate",
    desc: "Votre image de marque mérite des compositions à sa hauteur. Événements d'entreprise, lancements produits, séminaires — nous créons des environnements floraux mémorables.",
    features: ["Habillage d'espace", "Identité chromatique", "Livraison et reprise", "Devis sous 24h"],
  },
  {
    icon: Sparkles,
    title: "Réception Privée",
    desc: "Anniversaires, dîners gastronomiques, soirées de prestige. Chaque occasion mérite une mise en scène florale qui épate et émeut vos invités.",
    features: ["Thématisation complète", "Fleurs de saison", "Accord olfactif", "Suivi personnalisé"],
  },
]
let EVENTS = EVENTS_SOURCE;

const ATELIER_STEPS = [
  {
    step: "01",
    title: "Sélection",
    desc: "Chaque matin dès 4h, nous sélectionnons les fleurs auprès de nos 45 producteurs partenaires en France et en Europe.",
    icon: Leaf,
  },
  {
    step: "02",
    title: "Hydratation",
    desc: "Les tiges passent 12h en eau fraîche dans notre cellule réfrigérée pour atteindre leur hydratation optimale.",
    icon: Flower,
  },
  {
    step: "03",
    title: "Composition",
    desc: "Nos artisans assemblent chaque bouquet à la main selon les règles de la botanique artistique traditionnelle.",
    icon: Scissors,
  },
  {
    step: "04",
    title: "Livraison",
    desc: "Emballées dans notre papier de soie signature et livrées dans les 4 heures — fraîcheur garantie.",
    icon: CheckCircle,
  },
]

const STATS_DEMO = [
  { value: "15 ans", label: "d'expertise florale" },
  { value: "2000+", label: "créations réalisées" },
  { value: "98%", label: "de clients fidèles" },
  { value: "45", label: "producteurs partenaires" },
]
let STATS = STATS_DEMO;

function TESTIMONIALS_SOURCE_LIVE() {
  return [
  {
    name: "Isabelle de Montblanc",
    role: "Mariée — Château du Vexin",
    quote:
      "Botanica a sublimé notre mariage au-delà de mes espérances. Les compositions florales étaient d'une beauté renversante, et l'équipe d'une discrétion et d'un professionnalisme absolus.",
    rating: 5,
    avatar: (clientPhotos(sessionData)[6] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"),
  },
  {
    name: "Arnaud Leclercq",
    role: "Directeur Général — Maison Leclercq",
    quote:
      "Pour notre centième anniversaire, Botanica a créé une installation florale qui a ébloui nos 300 invités. Un sens artistique exceptionnel, une exécution parfaite.",
    rating: 5,
    avatar: (clientPhotos(sessionData)[7] || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80"),
  },
  {
    name: "Clémentine Faure",
    role: "Styliste — " + (clientCity(sessionData) ?? "Paris"),
    quote:
      "Je commande chez Botanica chaque semaine depuis trois ans. La qualité est invariablement irréprochable, les compositions toujours surprenantes et poétiques.",
    rating: 5,
    avatar: (clientPhotos(sessionData)[8] || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80"),
  },
];
}
let TESTIMONIALS_SOURCE = TESTIMONIALS_SOURCE_LIVE();
let TESTIMONIALS_DEMO = TESTIMONIALS_SOURCE;

const MARQUEE_ITEMS = [
  "Rosa Centifolia",
  "Pivoine de France",
  "Lys du Japon",
  "Orchidée Rare",
  "Anémone Sauvage",
  "Jasmin de Grasse",
  "Muguet des Bois",
  "Tulipe Perroquet",
  "Dahlia Café",
  "Gardénia Blanc",
]

/* ==========================================================================
   HELPER COMPONENTS
   ========================================================================== */

function Reveal({
  children,
  delay = 0,
  y = 40,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionTitle({
  subtitle,
  title,
  alignment = "center",
  accentColor = "var(--brand,#CA8A04)",
  dark = false,
}: {
  subtitle: string
  title: string
  alignment?: "center" | "left"
  accentColor?: string
  dark?: boolean
}) {
  return (
    <div className={`mb-20 ${alignment === "left" ? "text-left" : "text-center"}`}>
      <Reveal>
        <span
          className="text-[10px] font-black uppercase tracking-[0.6em] block mb-6 italic"
          style={{ color: accentColor, fontFamily: "'Jost', sans-serif" }}
        >
          {subtitle}
        </span>
        <h2
          className={`text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none ${dark ? "text-[#FAFAF9]" : "text-[#0C0A09]"}`}
          style={{ fontFamily: "'Bodoni Moda', serif" }}
        >
          {title}
        </h2>
      </Reveal>
    </div>
  )
}

function GoldDivider() {
  return (
    <div className="flex items-center gap-4 my-8">
      <div className="flex-1 h-px bg-[var(--brand,#CA8A04)]/30" />
      <Flower className="w-4 h-4 text-[var(--brand,#CA8A04)]" />
      <div className="flex-1 h-px bg-[var(--brand,#CA8A04)]/30" />
    </div>
  )
}

/* ==========================================================================
   FONT LOADER
   ========================================================================== */

function useFonts() {
  useEffect(() => {
    const id = "botanica-fonts-94"
    if (document.getElementById(id)) return
    const style = document.createElement("style")
    style.id = id
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap');`
    document.head.appendChild(style)
  }, [])
}

function FAQ_ITEMS_DEMO_LIVE() {
  return [
  {
    q: "Quels sont vos délais de création ?",
    a: "Pour les bouquets standards, nous livrons sous 4 heures à " + (clientCity(sessionData) ?? "Paris") + ". Pour les compositions sur-mesure ou les événements, nous conseillons de nous contacter au moins 48 heures à l'avance.",
  },
  {
    q: "D'où proviennent vos fleurs ?",
    a: "80% de nos fleurs proviennent de producteurs français partenaires engagés dans une charte éco-responsable. Les 20% restants proviennent de producteurs d'exception en Europe.",
  },
  {
    q: "Comment assurer la longévité de mon bouquet ?",
    a: "Coupez les tiges en biseau sur 1 cm tous les deux jours, changez l'eau quotidiennement et évitez d'exposer les fleurs directement au soleil ou à proximité d'une source de chaleur.",
  },
  {
    q: "Proposez-vous des abonnements floraux ?",
    a: "Oui, nous proposons des abonnements hebdomadaires, bi-mensuels ou mensuels pour les particuliers et les entreprises. Contactez l'atelier pour personnaliser votre offre.",
  },
  {
    q: "Puis-je commander pour un événement hors de " + (clientCity(sessionData) ?? "Paris") + " ?",
    a: "Oui, notre équipe se déplace dans toute la France et en Europe pour concevoir les décors floraux de vos grands événements (mariages, lancements corporate).",
  },
];
}
let FAQ_ITEMS_DEMO = FAQ_ITEMS_DEMO_LIVE();

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const FAQ_ITEMS = resolveList(
    clientFaq(sessionData)?.map((f: any, i: number) => ({
      q: f.q ?? FAQ_ITEMS_DEMO[i % FAQ_ITEMS_DEMO.length].q,
      a: f.a ?? FAQ_ITEMS_DEMO[i % FAQ_ITEMS_DEMO.length].a,
    })),
    FAQ_ITEMS_DEMO
  );

  return (
    <section id="faq" className="py-40 px-6 md:px-16 bg-[#FAFAF8] border-t border-[var(--brand,#CA8A04)]/10">
      <div className="max-w-4xl mx-auto">
        <SectionTitle subtitle="Des réponses à vos questions" title="Questions Fréquentes" />
        
        <div className="space-y-4 mt-12">
          {FAQ_ITEMS.map((item, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="border border-[var(--brand,#CA8A04)]/20 bg-white">
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-medium text-[#0C0A09] text-base md:text-lg" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-[var(--brand,#CA8A04)] flex-shrink-0 ml-4"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="p-6 pt-0 text-sm md:text-base text-[#0C0A09]/60 leading-relaxed font-light border-t border-[var(--brand,#CA8A04)]/10 mt-4">
                        {item.a}
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
   MAIN PAGE COMPONENT
   ========================================================================== */


// Client-uploaded photo at index i, falling back to the template's stock
// photo when the client did not upload one for that slot.
function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}
export default function Impact94Page() {
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

  bp = session?.businessProfile;
  sessionData = session;
  c = session?.generatedContent;
  ARRANGEMENTS_DEMO = ARRANGEMENTS_DEMO_LIVE();
  FAQ_ITEMS_DEMO = FAQ_ITEMS_DEMO_LIVE();
  TESTIMONIALS_SOURCE = TESTIMONIALS_SOURCE_LIVE();


  EVENTS = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({ ...EVENTS_SOURCE[i % EVENTS_SOURCE.length], title: s.title, desc: s.desc || "" || "" })),
    EVENTS_SOURCE,
  );
  TESTIMONIALS_DEMO = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({ ...TESTIMONIALS_SOURCE[i % TESTIMONIALS_SOURCE.length], name: r.author, quote: r.text })),
    TESTIMONIALS_SOURCE,
  );
  STATS = resolveList(clientStats(sessionData), STATS_DEMO);

  const ARRANGEMENTS = resolveList(
    clientServices(sessionData)?.map((s: any, i: number) => ({
      ...ARRANGEMENTS_DEMO[i % ARRANGEMENTS_DEMO.length],
      id: `svc-${i}`,
      name: s.title ?? s.name ?? ARRANGEMENTS_DEMO[i % ARRANGEMENTS_DEMO.length].name,
      description: s.description ?? s.desc ?? ARRANGEMENTS_DEMO[i % ARRANGEMENTS_DEMO.length].description,
      price: s.price ?? ARRANGEMENTS_DEMO[i % ARRANGEMENTS_DEMO.length].price,
    })),
    ARRANGEMENTS_DEMO
  );
  const TESTIMONIALS = resolveList(
    clientReviews(sessionData)?.map((r: any, i: number) => ({
      ...TESTIMONIALS_DEMO[i % TESTIMONIALS_DEMO.length],
      name: r.name ?? TESTIMONIALS_DEMO[i % TESTIMONIALS_DEMO.length].name,
      quote: r.text ?? TESTIMONIALS_DEMO[i % TESTIMONIALS_DEMO.length].quote,
      rating: r.stars ?? TESTIMONIALS_DEMO[i % TESTIMONIALS_DEMO.length].rating,
      role: r.location ?? TESTIMONIALS_DEMO[i % TESTIMONIALS_DEMO.length].role,
    })),
    TESTIMONIALS_DEMO
  );

  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    let n = 4;
    const _photoArrays: any[] = [ARRANGEMENTS, TESTIMONIALS];
    _photoArrays.forEach((arr) => {
      if (!Array.isArray(arr)) return;
      arr.forEach((item) => {
        if (!item || typeof item !== "object") return;
        for (const key of ["img", "src", "image", "imgSrc", "photo"]) {
          if (typeof item[key] === "string" && item[key].includes("images.unsplash.com")) {
            if (fd.photoUrls[n]) item[key] = fd.photoUrls[n];
            n++;
          }
        }
      });
    });
  });
  brand = fd?.brandColor ?? null; // null = keep template's original color

  useFonts()

  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeCollection, setActiveCollection] = useState<string | null>(null)
  const [contactSubmitted, setContactSubmitted] = useState(false)

  const { scrollYProgress } = useScroll()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"])
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0])

  const progressWidth = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "100%"]), {
    stiffness: 400,
    damping: 40,
  })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, []);

  return (
    <div
      className="bg-[#FAFAF9] text-[#0C0A09] min-h-dvh overflow-x-hidden"
      style={{ fontFamily: "'Jost', sans-serif" }}
    >
      {/* ── Scroll Progress Bar ── */}
      <motion.div
        className="fixed top-0 left-0 h-[2px] bg-[var(--brand,#CA8A04)] z-[1000]"
        style={{ width: progressWidth }}
      />

      {/* ════════════════════════════════════════════════════════════
          NAV
      ════════════════════════════════════════════════════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-8 md:px-16 transition-all duration-500 ${
          scrolled
            ? "py-4 bg-[#FAFAF9]/95 backdrop-blur-lg border-b border-[var(--brand,#CA8A04)]/20 shadow-sm"
            : "py-7 bg-transparent"
        }`}
      >
        {/* Logo */}
        <Link href="#hero" className="flex items-center gap-3 group">
          {fd?.logoBase64 ? (
            <img
              src={fd.logoBase64}
              alt={fd?.businessName ?? 'logo'}
              style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <>
              <Flower className="w-5 h-5 text-[var(--brand,#CA8A04)] group-hover:rotate-45 transition-transform duration-500" />
              <span
                className="text-xl font-normal tracking-[0.25em] uppercase text-[#0C0A09]"
                style={{ fontFamily: "'Bodoni Moda', serif" }}
              >{/* NOM_LOGO */ clientName(sessionData) ?? (<>
                Botanica
              </>)}</span>
            </>
          )}
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <button
                onClick={() => document.getElementById(link.href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" })}
                className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#0C0A09]/70 hover:text-[var(--brand,#CA8A04)] transition-colors duration-300"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="px-6 py-3 border border-[var(--brand,#CA8A04)] text-[var(--brand,#CA8A04)] text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-[var(--brand,#CA8A04)] hover:text-white transition-all duration-300"
          >
            Commande sur-mesure
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-[#0C0A09] z-50"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[150] bg-[#FAFAF9] flex flex-col items-center justify-center gap-8"
          >
            <button
              className="absolute top-6 right-8 text-[#0C0A09]"
              onClick={() => setMenuOpen(false)}
            >
              <X className="w-7 h-7" />
            </button>
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => {
                  setMenuOpen(false)
                  setTimeout(() => document.getElementById(link.href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" }), 300)
                }}
                className="text-3xl font-normal uppercase tracking-[0.2em] text-[#0C0A09] hover:text-[var(--brand,#CA8A04)] transition-colors"
                style={{ fontFamily: "'Bodoni Moda', serif" }}
              >
                {link.label}
              </motion.button>
            ))}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: NAV_LINKS.length * 0.08 }}
              onClick={() => {
                setMenuOpen(false)
                setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 300)
              }}
              className="mt-6 px-8 py-4 bg-[var(--brand,#CA8A04)] text-white text-sm font-medium uppercase tracking-[0.2em]"
            >
              Commande sur-mesure
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════ */}
      <section
        id="hero"
        ref={heroRef}
        className="relative h-dvh flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Parallax Image */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image
            src={photo(0, (clientPhotos(sessionData)[9] || "https://images.pexels.com/photos/17023112/pexels-photo-17023112.jpeg?auto=compress&cs=tinysrgb&w=1600"))}
            alt="Bouquet de fleurs botanica"
            fill
            className="object-cover"
            priority
          />
          {/* Gold overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0C0A09]/40 via-[#0C0A09]/20 to-[#0C0A09]/60" />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 text-center px-6"
          style={{ opacity: heroOpacity }}
        >
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.3em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[10px] font-medium uppercase text-[var(--brand,#CA8A04)] tracking-[0.5em] block mb-8"
          >
            Atelier floral de luxe — {clientCity(sessionData) ?? "Paris"}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-[10rem] lg:text-[13rem] font-normal italic text-[#FAFAF9] leading-none tracking-tight"
            style={{ fontFamily: "'Bodoni Moda', serif" }}
          >{c?.heroHeadline ?? <>
            L&apos;art
            <br />
            <span className="text-[var(--brand,#CA8A04)]">floral</span>
          </>}</motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 text-lg md:text-xl text-[#FAFAF9]/80 font-light max-w-lg mx-auto leading-relaxed"
          >{fd?.tagline ?? c?.heroSubline ?? <>
            Compositions botaniques d&apos;exception, créées à la main pour les moments qui méritent l&apos;extraordinaire.
          </>}</motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" })}
              className="px-10 py-4 bg-[var(--brand,#CA8A04)] text-white text-[11px] font-medium uppercase tracking-[0.25em] hover:bg-[#A16F03] transition-colors duration-300 flex items-center gap-2"
            >
              Découvrir les collections
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="px-10 py-4 border border-[#FAFAF9]/50 text-[#FAFAF9] text-[11px] font-medium uppercase tracking-[0.25em] hover:bg-[#FAFAF9]/10 transition-colors duration-300"
            >
              Commande sur-mesure
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#FAFAF9]/60">Défiler</span>
          <motion.div
            className="w-px h-12 bg-[var(--brand,#CA8A04)]"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
          />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          MARQUEE
      ════════════════════════════════════════════════════════════ */}
      <section id="realisations" className="bg-[var(--brand,#CA8A04)] py-5 overflow-hidden">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/90 flex items-center gap-6"
            >
              {item}
              <Flower className="w-3 h-3 text-white/60 flex-shrink-0" />
            </span>
          ))}
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          COLLECTIONS
      ════════════════════════════════════════════════════════════ */}
      <section id="collections" className="py-40 px-6 md:px-16 bg-[#FAFAF9]">
        <SectionTitle subtitle="Archives Saisonnières" title="Collections" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {ARRANGEMENTS.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.1}>
              <div
                className="group relative bg-white border border-[#0C0A09]/8 hover:border-[var(--brand,#CA8A04)]/40 transition-all duration-500 cursor-pointer overflow-hidden"
                onMouseEnter={() => setActiveCollection(item.id)}
                onMouseLeave={() => setActiveCollection(null)}
              >
                {/* Image */}
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Tag */}
                  <div className="absolute top-4 left-4 bg-[var(--brand,#CA8A04)] text-white text-[10px] font-medium uppercase tracking-[0.3em] px-3 py-1">
                    {item.tag}
                  </div>
                  {/* Season badge */}
                  <div className="absolute top-4 right-4 bg-[#0C0A09]/80 text-[var(--brand,#CA8A04)] text-[10px] font-medium uppercase tracking-[0.2em] px-3 py-1 backdrop-blur-sm">
                    {item.season}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <h3
                      className="text-2xl font-normal leading-tight"
                      style={{ fontFamily: "'Bodoni Moda', serif" }}
                    >
                      {item.name}
                    </h3>
                    <span
                      className="text-xl font-medium text-[var(--brand,#CA8A04)]"
                      style={{ fontFamily: "'Bodoni Moda', serif" }}
                    >
                      {item.price}
                    </span>
                  </div>
                  <p className="text-sm text-[#0C0A09]/60 leading-relaxed font-light">
                    {item.description}
                  </p>
                  <GoldDivider />
                  <button className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--brand,#CA8A04)] hover:gap-4 transition-all duration-300 group/btn">
                    Commander
                    <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          STUDIO — Philosophy
      ════════════════════════════════════════════════════════════ */}
      <section id="studio" className="py-40 px-6 md:px-16 bg-[#0C0A09] overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          {/* Text Side */}
          <div>
            <Reveal>
              <span
                className="text-[10px] font-black uppercase tracking-[0.6em] text-[var(--brand,#CA8A04)] block mb-6 italic"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                Notre philosophie
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2
                className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-[#FAFAF9] mb-10"
                style={{ fontFamily: "'Bodoni Moda', serif" }}
              >{c?.aboutTitle ?? fd?.businessName ?? <>
                La botanique
                <br />
                <span className="italic text-[var(--brand,#CA8A04)]">comme art</span>
              </>}</h2>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="h-px w-24 bg-[var(--brand,#CA8A04)] mb-10" />
              <p className="text-lg text-[#FAFAF9]/70 font-light leading-relaxed mb-6">{c?.aboutText ?? <>
                Depuis 2009, Botanica explore la frontière entre nature et architecture. Chaque composition est une oeuvre pensée, où la biologie des végétaux dialogue avec les principes du design.
              </>}</p>
              <p className="text-base text-[#FAFAF9]/50 font-light leading-relaxed mb-10">
                Nous sélectionnons exclusivement des fleurs cultivées dans le respect de la terre, auprès de producteurs engagés dans une démarche durable. L&apos;excellence commence au moment de la cueillette.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Fleurs françaises", value: "80%" },
                  { label: "Cultures locales", value: "45 fermes" },
                  { label: "Délai création", value: "48h" },
                  { label: "Garantie fraîcheur", value: "7 jours" },
                ].map((stat) => (
                  <div key={stat.label} className="border border-[#FAFAF9]/10 p-6">
                    <div
                      className="text-3xl font-normal text-[var(--brand,#CA8A04)] mb-1"
                      style={{ fontFamily: "'Bodoni Moda', serif" }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#FAFAF9]/40">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Image Side */}
          <Reveal delay={0.15} y={60}>
            <div className="relative">
              <div className="relative h-[700px] overflow-hidden">
                <Image
                  src={photo(1, (clientPhotos(sessionData)[10] || "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=1000&q=90"))}
                  alt="Atelier Botanica — Art botanique"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09]/50 via-transparent to-transparent" />
              </div>
              {/* Gold frame accent */}
              <div className="absolute -bottom-6 -right-6 w-48 h-48 border border-[var(--brand,#CA8A04)]/30" />
              <div className="absolute -top-6 -left-6 w-24 h-24 border border-[var(--brand,#CA8A04)]/20" />

              {/* Floating card */}
              <div className="absolute bottom-8 left-8 bg-[#0C0A09]/90 backdrop-blur-md border border-[var(--brand,#CA8A04)]/20 p-6 max-w-[220px]">
                <Flower className="w-6 h-6 text-[var(--brand,#CA8A04)] mb-3" />
                <p className="text-sm text-[#FAFAF9]/80 font-light leading-relaxed italic" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                  {"“La fleur la plus parfaite est celle qui révèle l'âme de celui qui la contemple.”"}
                </p>
                <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-[var(--brand,#CA8A04)]">— Sophie Marchand, Fondatrice</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          ÉVÉNEMENTS
      ════════════════════════════════════════════════════════════ */}
      <section id="evenements" className="py-40 px-6 md:px-16 bg-[#F5F0E8]">
        <SectionTitle subtitle="Pour chaque occasion" title="Événements" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {EVENTS.map((event, i) => {
            const Icon = event.icon
            return (
              <Reveal key={event.title} delay={i * 0.15}>
                <div className="bg-white border border-[var(--brand,#CA8A04)]/15 p-10 group hover:border-[var(--brand,#CA8A04)]/50 hover:shadow-xl transition-all duration-500">
                  <div className="w-14 h-14 bg-[var(--brand,#CA8A04)]/10 flex items-center justify-center mb-8 group-hover:bg-[var(--brand,#CA8A04)]/20 transition-colors">
                    <Icon className="w-7 h-7 text-[var(--brand,#CA8A04)]" />
                  </div>
                  <h3
                    className="text-3xl font-normal mb-6 text-[#0C0A09]"
                    style={{ fontFamily: "'Bodoni Moda', serif" }}
                  >
                    {event.title}
                  </h3>
                  <p className="text-sm text-[#0C0A09]/60 leading-relaxed font-light mb-8">
                    {event.desc}
                  </p>
                  <div className="space-y-3">
                    {event.features.map((f) => (
                      <div key={f} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-[var(--brand,#CA8A04)] flex-shrink-0" />
                        <span className="text-sm text-[#0C0A09]/70">{f}</span>
                      </div>
                    ))}
                  </div>
                  <GoldDivider />
                  <button className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--brand,#CA8A04)] hover:gap-4 transition-all duration-300">
                    Demander un devis
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          ATELIER — Behind the Scenes
      ════════════════════════════════════════════════════════════ */}
      <section id="atelier" className="py-40 px-6 md:px-16 bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto">
          <SectionTitle subtitle="Coulisses de l'atelier" title="Notre Savoir-Faire" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
            {/* Image collage */}
            <Reveal y={50}>
              <div className="relative">
                <div className="relative h-[500px] overflow-hidden">
                  <Image
                    src={photo(2, (clientPhotos(sessionData)[11] || "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1000&q=90"))}
                    alt="Atelier Botanica — Savoir-faire artisanal"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-8 -right-8 w-56 h-56 overflow-hidden border-4 border-[#FAFAF9]">
                  <Image
                    src={photo(3, (clientPhotos(sessionData)[12] || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80"))}
                    alt="Détail floral"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </Reveal>

            {/* Text */}
            <div>
              <Reveal>
                <p className="text-xl text-[#0C0A09]/70 leading-relaxed font-light mb-8">{/* TEXTE_SECTION */ clientText(sessionData, "atelier.texte") ?? (<>
                  Notre atelier parisien, niché dans le Marais, est un espace de création où se conjuguent tradition artisanale et sensibilité contemporaine.
                </>)}</p>
                <p className="text-base text-[#0C0A09]/50 leading-relaxed font-light mb-12">{/* TEXTE_SECTION */ clientText(sessionData, "atelier.texte") ?? (<>
                  Chaque arrangement suit un protocole précis, de la sélection des fleurs à la livraison finale. Nous ne composons jamais en série — chaque pièce est unique, portant en elle l&apos;empreinte de la main qui l&apos;a créée.
                </>)}</p>
              </Reveal>
            </div>
          </div>

          {/* Process Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#0C0A09]/10">
            {ATELIER_STEPS.map((step, i) => {
              const StepIcon = step.icon
              return (
                <Reveal key={step.step} delay={i * 0.12}>
                  <div className="bg-[#FAFAF9] p-10 group hover:bg-[var(--brand,#CA8A04)] transition-colors duration-500">
                    <span
                      className="text-6xl font-black text-[#0C0A09]/8 group-hover:text-white/10 transition-colors block mb-6 leading-none"
                      style={{ fontFamily: "'Bodoni Moda', serif" }}
                    >
                      {step.step}
                    </span>
                    <StepIcon className="w-7 h-7 text-[var(--brand,#CA8A04)] group-hover:text-white transition-colors mb-4" />
                    <h4
                      className="text-xl font-normal mb-3 text-[#0C0A09] group-hover:text-white transition-colors"
                      style={{ fontFamily: "'Bodoni Moda', serif" }}
                    >
                      {step.title}
                    </h4>
                    <p className="text-sm text-[#0C0A09]/60 group-hover:text-white/80 transition-colors font-light leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          STATS
      ════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-16 bg-[var(--brand,#CA8A04)]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <div className="text-center">
                <div
                  className="text-5xl md:text-7xl font-black text-white leading-none mb-3"
                  style={{ fontFamily: "'Bodoni Moda', serif" }}
                >
                  {stat.value}
                </div>
                <div className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/70">
                  {stat.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════════════════════════ */}
      <section className="py-40 px-6 md:px-16 bg-[#0C0A09]">
        <SectionTitle
          subtitle="Ils nous font confiance"
          title="Témoignages"
          dark
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.15}>
              <div className="border border-[#FAFAF9]/10 p-10 hover:border-[var(--brand,#CA8A04)]/30 transition-colors duration-500 group">
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-[var(--brand,#CA8A04)] fill-[var(--brand,#CA8A04)]" />
                  ))}
                </div>

                <p className="text-lg text-[#FAFAF9]/70 font-light leading-relaxed italic mb-10" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#FAFAF9]">{t.name}</div>
                    <div className="text-[10px] text-[var(--brand,#CA8A04)] uppercase tracking-[0.2em]">{t.role}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FAQ
      ════════════════════════════════════════════════════════════ */}
      <FaqSection />

      {/* ════════════════════════════════════════════════════════════
          CONTACT
      ════════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-40 px-6 md:px-16 bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Left — Info */}
          <div>
            <Reveal>
              <span
                className="text-[10px] font-black uppercase tracking-[0.6em] text-[var(--brand,#CA8A04)] block mb-6 italic"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                Entrer en contact
              </span>
              <h2
                className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none text-[#0C0A09] mb-10"
                style={{ fontFamily: "'Bodoni Moda', serif" }}
              >{/* TEXTE_SECTION */ clientText(sessionData, "contact.titre") ?? (<>
                Parlons de
                <br />
                <span className="italic text-[var(--brand,#CA8A04)]">votre projet</span>
              </>)}</h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="text-base text-[#0C0A09]/60 font-light leading-relaxed mb-12">
                Chaque commande sur-mesure commence par une conversation. Partagez-nous votre vision — occasion, palette de couleurs, atmosphère souhaitée — et nous créerons pour vous quelque chose d&apos;unique.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[var(--brand,#CA8A04)]/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[var(--brand,#CA8A04)]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#0C0A09]">Atelier</div>
                    <div className="text-sm text-[#0C0A09]/60">{clientAddress(sessionData) ?? `12, rue des Fleurs, 75004 ${clientCity(sessionData) ?? "Paris"}`}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[var(--brand,#CA8A04)]/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[var(--brand,#CA8A04)]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#0C0A09]">Téléphone</div>
                    <div className="text-sm text-[#0C0A09]/60">+33 (0)1 42 77 58 12</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[var(--brand,#CA8A04)]/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[var(--brand,#CA8A04)]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#0C0A09]">Email</div>
                    <div className="text-sm text-[#0C0A09]/60">{fd?.email ?? "contact@botanica-atelier.fr"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[var(--brand,#CA8A04)]/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[var(--brand,#CA8A04)]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#0C0A09]">Horaires</div>
                    <div className="text-sm text-[#0C0A09]/60">Lun — Sam, 9h — 19h</div>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="flex items-center gap-4 mt-10">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#0C0A09]/40">Suivre</span>
                <div className="h-px flex-1 bg-[#0C0A09]/10" />
                {[Facebook].map((Icon, i) => (
                  <button
                    key={i}
                    className="w-10 h-10 border border-[#0C0A09]/15 flex items-center justify-center hover:border-[var(--brand,#CA8A04)] hover:text-[var(--brand,#CA8A04)] transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right — Form */}
          <Reveal delay={0.2}>
            {contactSubmitted ? (
              <div className="border border-[var(--brand,#CA8A04)]/20 bg-white p-10 text-center flex flex-col items-center justify-center h-full">
                <Flower className="w-8 h-8 text-[var(--brand,#CA8A04)] animate-spin mb-4" style={{ animationDuration: "3s" }} />
                <h3 className="text-2xl font-normal mb-2" style={{ fontFamily: "'Bodoni Moda', serif" }}>Merci</h3>
                <p className="text-sm text-[#0C0A09]/60 font-light">Merci, nous vous répondrons sous 24h.</p>
              </div>
            ) : (
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  setContactSubmitted(true);
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#0C0A09]/50 mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full border border-[#0C0A09]/15 bg-transparent px-5 py-4 text-sm text-[#0C0A09] placeholder-[#0C0A09]/30 focus:outline-none focus:border-[var(--brand,#CA8A04)] transition-colors"
                      placeholder="Sophie"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#0C0A09]/50 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full border border-[#0C0A09]/15 bg-transparent px-5 py-4 text-sm text-[#0C0A09] placeholder-[#0C0A09]/30 focus:outline-none focus:border-[var(--brand,#CA8A04)] transition-colors"
                      placeholder="Marchand"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#0C0A09]/50 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full border border-[#0C0A09]/15 bg-transparent px-5 py-4 text-sm text-[#0C0A09] placeholder-[#0C0A09]/30 focus:outline-none focus:border-[var(--brand,#CA8A04)] transition-colors"
                    placeholder="sophie@exemple.fr"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#0C0A09]/50 mb-2">
                    Type de commande
                  </label>
                  <select required className="w-full border border-[#0C0A09]/15 bg-[#FAFAF9] px-5 py-4 text-sm text-[#0C0A09] focus:outline-none focus:border-[var(--brand,#CA8A04)] transition-colors appearance-none">
                    <option value="">Sélectionner...</option>
                    <option value="bouquet">Bouquet standard</option>
                    <option value="mariage">Mariage</option>
                    <option value="corporate">Corporate</option>
                    <option value="reception">Réception privée</option>
                    <option value="abonnement">Abonnement floral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#0C0A09]/50 mb-2">
                    Votre message
                  </label>
                  <textarea
                    rows={5}
                    required
                    className="w-full border border-[#0C0A09]/15 bg-transparent px-5 py-4 text-sm text-[#0C0A09] placeholder-[#0C0A09]/30 focus:outline-none focus:border-[var(--brand,#CA8A04)] transition-colors resize-none"
                    placeholder="Décrivez votre projet, l'occasion, les couleurs souhaitées..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-5 bg-[var(--brand,#CA8A04)] text-white text-[11px] font-medium uppercase tracking-[0.3em] hover:bg-[#A16F03] transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  Envoyer ma demande
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════ */}
      <footer className="py-16 px-6 md:px-16 bg-[#0C0A09] border-t border-[#FAFAF9]/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Flower className="w-5 h-5 text-[var(--brand,#CA8A04)]" />
            <span
              className="text-xl font-normal tracking-[0.25em] uppercase text-[#FAFAF9]"
              style={{ fontFamily: "'Bodoni Moda', serif" }}
            >
              Botanica
            </span>
          </div>

          <p className="text-[10px] text-[#FAFAF9]/30 uppercase tracking-[0.2em] text-center">
            © 2024 Botanica Atelier Floral — {clientCity(sessionData) ?? "Paris"} · Marais · 4e arrondissement{/* VILLE_PIED */}{clientCity(sessionData) ? ` · ${clientCity(sessionData)}` : ""}
          </p>

          <div className="flex items-center gap-4">
            {[
              { label: "Confidentialité", href: "/templates/impact-94/legal/confidentialite" },
              { label: "CGV", href: "/templates/impact-94/legal/cgu" },
              { label: "Mentions", href: "/templates/impact-94/legal/mentions-legales" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[10px] text-[#FAFAF9]/30 hover:text-[var(--brand,#CA8A04)] uppercase tracking-[0.2em] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
