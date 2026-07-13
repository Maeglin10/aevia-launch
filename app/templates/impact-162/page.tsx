"use client";
// @ts-nocheck

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, ArrowRight, Coffee, Clock, MapPin, Phone, Mail, Star, Heart, ChevronRight } from "lucide-react"

const Instagram = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="5"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

function useFonts() {
  useEffect(() => {
    const id = "fonts-essential-cafe"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id = id
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400;700&display=swap');`
    document.head.appendChild(s)
  }, [])
}

function Reveal({ children, delay = 0, y = 30 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

const MENU_ITEMS = [
  { category: "Cafés signature", items: [
    { name: "Le Matin Doré", desc: "Espresso, lait entier vapeur, miel de fleurs sauvages, une touche de cannelle", price: "4,80 €" },
    { name: "Velours Noir", desc: "Double espresso, crème de cacao, lait végétal d'avoine, poudre de fève", price: "5,20 €" },
    { name: "Cardamome & Rose", desc: "Espresso, cardamome moulue, lait entier, eau de rose, sucre de canne brut", price: "5,50 €" },
  ]},
  { category: "Pâtisseries maison", items: [
    { name: "Brioche aux agrumes", desc: "Brioche feuilletée, crème pâtissière, zestes d'orange et citron bergamote", price: "4,20 €" },
    { name: "Financier aux noisettes", desc: "Beurre noisette, noisettes du Piémont, amandes effilées, miel de châtaigner", price: "3,50 €" },
    { name: "Kouign-amann du dimanche", desc: "Pâte feuilletée caramélisée, beurre de Bretagne demi-sel, sucre blond", price: "4,50 €" },
  ]},
  { category: "Petite restauration", items: [
    { name: "Tartine du marché", desc: "Pain au levain, ricotta, légumes de saison rôtis, huile d'olive vierge extra", price: "8,50 €" },
    { name: "Bowl du moment", desc: "Céréales anciennes, légumineuses, légumes crus et cuits, vinaigrette maison", price: "12,00 €" },
    { name: "Œufs bénédictine", desc: "Muffin anglais maison, jambon artisanal, œufs pochés, sauce hollandaise", price: "13,50 €" },
  ]},
]

const TESTIMONIALS = [
  { name: "Élise M.", text: "Le café idéal pour travailler le matin. La lumière, la musique, le café... Tout est parfait.", rating: 5 },
  { name: "Thomas B.", text: "La brioche aux agrumes est un chef-d'œuvre. Je fais un détour de 20 minutes pour en avoir une le week-end.", rating: 5 },
  { name: "Pauline R.", text: "Accueil chaleureux, cadre magnifique. On s'y sent comme à la maison, mais en beaucoup mieux.", rating: 5 },
]

const HOURS = [
  { days: "Lundi — Vendredi", hours: "7h00 — 19h00" },
  { days: "Samedi", hours: "8h00 — 20h00" },
  { days: "Dimanche", hours: "9h00 — 17h00" },
]


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function EssentialCafePage() {
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
  const [activeCategory, setActiveCategory] = useState(0)
  const { scrollYProgress } = useScroll()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
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
  }, [c]);return (
    <div className="min-h-screen bg-[#FDFAF5] text-[#2A1F0E]" style={{ fontFamily: "'Lato', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 h-[2px] bg-[#8B5E3C] z-[1000] origin-left" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#FDFAF5]/95 backdrop-blur-md border-b border-[#E8DED0]" : "bg-transparent"}`}
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="#galerie" className="flex items-center gap-2.5">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <Coffee className="w-5 h-5 text-[#8B5E3C]" />
                <span className="text-xl font-normal" style={{ fontFamily: "'Playfair Display', serif" }}>Le Matin Doré</span>
              </>
            )}
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#6B5A40] font-light">
            {["Menu", "Notre histoire", "Galerie", "Nous trouver"].map(l => (
              <Link key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="hover:text-[#2A1F0E] transition-colors">{l}</Link>
            ))}
            <Link href="#nous-trouver" className="px-5 py-2.5 bg-[#8B5E3C] text-white text-sm hover:bg-[#6B4830] transition-colors cursor-pointer rounded-sm">
              Réserver une table
            </Link>
          </div>
          <button className="md:hidden p-2 cursor-pointer" onClick={() => setMenuOpen(true)} aria-label="Menu">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="fixed inset-0 z-[200] bg-[#2A1F0E] text-[#FDFAF5] flex flex-col"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 280, damping: 28 }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#4A3520]">
              <div className="flex items-center gap-2">
                {fd?.logoBase64 ? (
                  <img
                    src={fd.logoBase64}
                    alt={fd?.businessName ?? 'logo'}
                    style={{ height: 28, maxWidth: 140, objectFit: 'contain', display: 'block' }}
                  />
                ) : (
                  <>
                    <Coffee className="w-5 h-5 text-[#C9A86C]" />
                    <span style={{ fontFamily: "'Playfair Display', serif" }}>Le Matin Doré</span>
                  </>
                )}
              </div>
              <button onClick={() => setMenuOpen(false)} className="p-2 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col gap-8 p-10">
              {["Menu", "Notre histoire", "Galerie", "Nous trouver"].map((l, i) => (
                <motion.div key={l} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <Link href={`#${l.toLowerCase().replace(/ /g, "-")}`} onClick={() => setMenuOpen(false)}
                    className="text-3xl font-light hover:text-[#C9A86C] transition-colors cursor-pointer"
                    style={{ fontFamily: "'Playfair Display', serif" }}>{l}</Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section id="hero" ref={heroRef} className="relative min-h-screen overflow-hidden flex items-end">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1600&q=85" alt="Le Matin Doré" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A0E05]/90 via-[#1A0E05]/30 to-transparent" />
        </motion.div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-24 pt-32 w-full">
          <Reveal>
            <p className="text-[#C9A86C] text-xs tracking-[0.3em] uppercase mb-6">Torréfaction artisanale · Paris 11e</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-light text-white leading-[1.0] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>{c?.heroHeadline ?? <>
              Un café<br /><em>comme un rituel</em>
            </>}</h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[#D4C9B0] text-lg max-w-md mb-10 leading-relaxed">{c?.heroSubline ?? fd?.tagline ?? <>
              Chaque tasse est une promesse — de qualité, de soin, de présence. Bienvenue au Matin Doré.
            </>}</p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link href="#menu" className="inline-flex items-center gap-3 px-8 py-4 bg-[#8B5E3C] text-white text-sm uppercase tracking-widest hover:bg-[#6B4830] transition-colors cursor-pointer">
                Découvrir la carte <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#nous-trouver" className="inline-flex items-center gap-3 px-8 py-4 border border-[#D4C9B0]/50 text-white text-sm uppercase tracking-widest hover:border-[#D4C9B0] transition-colors cursor-pointer">
                Nous trouver
              </Link>
            </div>
          </Reveal>
          <div className="mt-20 pt-10 border-t border-[#4A3520] flex flex-wrap gap-10">
            {[["Depuis 2018", "Ouvert"], ["100%", "Café de spécialité"], ["Bio & Local", "Nos pâtisseries"]].map(([val, label]) => (
              <div key={label}>
                <div className="text-[#C9A86C] text-xl font-light mb-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>{val}</div>
                <div className="text-xs text-[#8A7560] uppercase tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 bg-[#FDFAF5]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Coffee, title: "Café de spécialité", desc: "Grains sourcés directement auprès de producteurs partenaires. Torréfaction légère pour préserver les arômes d'origine." },
              { icon: Heart, title: "Fait maison chaque jour", desc: "Toutes nos pâtisseries sont préparées chaque matin à l'aide de recettes de saison et de produits locaux de qualité." },
              { icon: Star, title: "Un lieu vivant", desc: "Expositions temporaires, musique live le dimanche, ateliers café. Le Matin Doré est aussi un espace de culture." },
            ].map((p, i) => {
              const Icon = p.icon
              return (
                <Reveal key={p.title} delay={i * 0.1}>
                  <div className="text-center p-8">
                    <div className="w-14 h-14 border border-[#C9A86C] flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-6 h-6 text-[#8B5E3C]" />
                    </div>
                    <h3 className="text-xl font-normal mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>{p.title}</h3>
                    <p className="text-[#6B5A40] leading-relaxed text-sm">{p.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="py-28 bg-[#F0EBE0]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-14">
            <Reveal>
              <p className="text-xs tracking-[0.25em] uppercase text-[#8B5E3C] mb-4">La carte</p>
              <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "'Playfair Display', serif" }}>
                Ce que nous vous <em>proposons</em>
              </h2>
            </Reveal>
          </div>

          <div className="flex justify-center gap-2 mb-12">
            {MENU_ITEMS.map((cat, i) => (
              <button key={cat.category} onClick={() => setActiveCategory(i)}
                className={`px-6 py-2.5 text-sm transition-all duration-200 cursor-pointer ${activeCategory === i ? "bg-[#2A1F0E] text-white" : "bg-transparent text-[#6B5A40] border border-[#D4C9B0] hover:border-[#2A1F0E]"}`}>
                {cat.category}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeCategory} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
              className="space-y-0 border-t border-[#D4C9B0]">
              {MENU_ITEMS[activeCategory].items.map((item, i) => (
                <div key={item.name} className="flex items-start justify-between py-7 border-b border-[#D4C9B0] gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-normal mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{item.name}</h3>
                    <p className="text-sm text-[#6B5A40] leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="text-xl font-light text-[#8B5E3C] whitespace-nowrap" style={{ fontFamily: "'Playfair Display', serif" }}>{item.price}</div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
          <Reveal delay={0.2}>
            <p className="text-xs text-[#8A7560] mt-6 text-center">Tous nos plats peuvent être adaptés aux régimes alimentaires spécifiques — n&apos;hésitez pas à demander.</p>
          </Reveal>
        </div>
      </section>

      {/* About */}
      <section id="notre-histoire" className="py-28 bg-[#FDFAF5]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <Reveal>
                <div className="aspect-[4/5] relative overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80" alt="Notre histoire" fill className="object-cover" />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-[#8B5E3C] text-white p-6">
                  <div className="text-3xl font-light mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>2018</div>
                  <div className="text-xs uppercase tracking-wide">Fondé à Paris</div>
                </div>
              </Reveal>
            </div>
            <div>
              <Reveal delay={0.1}>
                <p className="text-xs tracking-[0.25em] uppercase text-[#8B5E3C] mb-4">Notre histoire</p>
                <h2 className="text-4xl md:text-5xl font-light leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>{c?.aboutTitle ?? fd?.businessName ?? <>
                  Un rêve de<br /><em>café parfait</em><br />devenu réalité
                </>}</h2>
                <p className="text-[#6B5A40] leading-relaxed mb-6">{c?.aboutText ?? <>
                  Le Matin Doré est né de l&apos;obsession de Sarah Morin pour le café de spécialité. Après des années à voyager de plantation en plantation, elle a voulu créer un lieu où chaque tasse serait une invitation au ralentissement.
                </>}</p>
                <p className="text-[#6B5A40] leading-relaxed mb-10">
                  Nous torréfions nous-mêmes nos grains, sélectionnés auprès de producteurs engagés dans une agriculture durable et juste. Nos pâtisseries changent selon les saisons et l&apos;humeur du chef.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="flex flex-wrap gap-4">
                  {[["12 origines", "de café"], ["100%", "bio & local"], ["0 déchet", "objectif 2025"]].map(([val, label]) => (
                    <div key={label} className="bg-[#F0EBE0] px-5 py-4">
                      <div className="text-lg font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>{val}</div>
                      <div className="text-xs text-[#8A7560]">{label}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="galerie" className="py-16 bg-[#F0EBE0]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-light" style={{ fontFamily: "'Playfair Display', serif" }}>L&apos;ambiance du lieu</h2>
              <Link href="#galerie" className="flex items-center gap-2 text-sm text-[#8B5E3C] cursor-pointer hover:gap-3 transition-all duration-200">
                <Instagram className="w-4 h-4" /> @lematindore
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
              "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80",
              "https://images.unsplash.com/photo-1464979681340-bdd28a61699e?w=400&q=80",
              "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80",
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
              "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400&q=80",
              "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&q=80",
              "https://images.unsplash.com/photo-1516743619420-154b70a65fea?w=400&q=80",
            ].map((src, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <div className="relative aspect-square overflow-hidden group cursor-pointer">
                  <Image src={src} alt={`Galerie ${i + 1}`} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-[#2A1F0E]/0 group-hover:bg-[#2A1F0E]/30 transition-all duration-300" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#2A1F0E] text-[#FDFAF5]">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-xs tracking-[0.25em] uppercase text-[#C9A86C] mb-4 text-center">Avis</p>
            <h2 className="text-3xl font-light text-center mb-14" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ce qu&apos;ils <em>disent</em>
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <div className="bg-[#3A2A18] p-8">
                  <div className="flex gap-1 mb-5">
                    {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#C9A86C] text-[#C9A86C]" />)}
                  </div>
                  <p className="text-[#D4C9B0] leading-relaxed mb-6 italic" style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px" }}>
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="font-medium text-sm text-[#C9A86C]">{t.name}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-24 bg-[#FDFAF5]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-xs tracking-[0.25em] uppercase text-[#8B5E3C] mb-4">Agenda</p>
            <h2 className="text-3xl font-light mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>
              À venir au café
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { date: "Sam 18 jan", title: "Atelier dégustation café", desc: "Apprenez à distinguer les origines et les modes d'extraction. Max 8 personnes.", time: "10h – 12h", spots: "3 places restantes" },
              { date: "Dim 19 jan", title: "Jazz acoustique live", desc: "Le trio Fontaine joue chaque dernier dimanche du mois. Entrée libre.", time: "11h – 14h", spots: "Accès libre" },
              { date: "Sam 25 jan", title: "Vernissage : Clara Morin", desc: "Exposition de photographies argentiques sur le thème des marchés parisiens.", time: "18h – 21h", spots: "Sur invitation" },
            ].map((ev, i) => (
              <Reveal key={ev.title} delay={i * 0.08}>
                <div className="border border-[#E8DED0] p-6 hover:border-[#8B5E3C] transition-colors duration-300 cursor-pointer group">
                  <div className="text-xs tracking-widest uppercase text-[#8B5E3C] mb-3">{ev.date}</div>
                  <h3 className="text-lg font-normal mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{ev.title}</h3>
                  <p className="text-sm text-[#6B5A40] leading-relaxed mb-4">{ev.desc}</p>
                  <div className="flex items-center justify-between text-xs text-[#8A7560]">
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{ev.time}</span>
                    <span>{ev.spots}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section id="nous-trouver" className="py-28 bg-[#F0EBE0]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <Reveal>
                <p className="text-xs tracking-[0.25em] uppercase text-[#8B5E3C] mb-4">Nous trouver</p>
                <h2 className="text-4xl md:text-5xl font-light leading-tight mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Venez nous <em>rendre visite</em>
                </h2>
                <div className="space-y-5 mb-10">
                  {[{ Icon: MapPin, text: "34 rue de la Roquette, 75011 Paris" }, { Icon: Phone, text: "+33 1 43 48 22 10" }, { Icon: Mail, text: "bonjour@lematindore.fr" }, { Icon: Instagram, text: "@lematindore" }].map(({ Icon, text }) => (
                    <div key={text} className="flex items-center gap-4 text-sm text-[#6B5A40]">
                      <Icon className="w-4 h-4 text-[#8B5E3C] flex-shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="bg-[#FDFAF5] p-6 border border-[#E8DED0]">
                  <p className="text-xs tracking-widest uppercase text-[#8A7560] mb-4">Horaires d&apos;ouverture</p>
                  {HOURS.map(h => (
                    <div key={h.days} className="flex justify-between py-3 border-b border-[#E8DED0] last:border-b-0 text-sm">
                      <span className="text-[#6B5A40]">{h.days}</span>
                      <span className="font-medium text-[#2A1F0E]">{h.hours}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <div className="bg-white p-8 border border-[#E8DED0]">
                <p className="text-xs tracking-widest uppercase text-[#8A7560] mb-6">Réserver une table</p>
                <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Prénom", "Nom"].map(f => (
                      <div key={f}>
                        <label className="block text-xs text-[#8A7560] mb-2">{f}</label>
                        <input className="w-full bg-transparent border border-[#D4C9B0] px-4 py-3 text-sm focus:outline-none focus:border-[#8B5E3C] transition-colors" placeholder={f} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs text-[#8A7560] mb-2">Email</label>
                    <input type="email" className="w-full bg-transparent border border-[#D4C9B0] px-4 py-3 text-sm focus:outline-none focus:border-[#8B5E3C] transition-colors" placeholder="votre@email.fr" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#8A7560] mb-2">Date</label>
                      <input type="date" className="w-full bg-transparent border border-[#D4C9B0] px-4 py-3 text-sm focus:outline-none focus:border-[#8B5E3C] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs text-[#8A7560] mb-2">Heure</label>
                      <select className="w-full bg-[#FDFAF5] border border-[#D4C9B0] px-4 py-3 text-sm focus:outline-none focus:border-[#8B5E3C] transition-colors">
                        {["9h00", "10h00", "11h00", "12h00", "13h00", "14h00", "17h00", "18h00"].map(h => <option key={h}>{h}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-[#8A7560] mb-2">Nombre de personnes</label>
                    <select className="w-full bg-[#FDFAF5] border border-[#D4C9B0] px-4 py-3 text-sm focus:outline-none focus:border-[#8B5E3C] transition-colors">
                      {["1 personne", "2 personnes", "3 personnes", "4 personnes", "5+ personnes"].map(n => <option key={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#8A7560] mb-2">Message (optionnel)</label>
                    <textarea rows={3} className="w-full bg-transparent border border-[#D4C9B0] px-4 py-3 text-sm focus:outline-none focus:border-[#8B5E3C] transition-colors resize-none" placeholder="Allergies, occasion particulière..." />
                  </div>
                  <button type="submit" className="w-full bg-[#8B5E3C] text-white py-4 text-sm uppercase tracking-widest hover:bg-[#6B4830] transition-colors cursor-pointer">
                    Confirmer la réservation
                  </button>
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#2A1F0E] text-[#8A7560] py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Coffee className="w-5 h-5 text-[#C9A86C]" />
                <span className="text-[#FDFAF5] text-xl font-normal" style={{ fontFamily: "'Playfair Display', serif" }}>Le Matin Doré</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">Café de spécialité, pâtisseries maison, et un accueil chaleureux. Depuis 2018 au cœur du 11e.</p>
            </div>
            <div>
              <p className="text-[#FDFAF5] text-xs tracking-widest uppercase mb-5">Navigation</p>
              {["Menu", "Notre histoire", "Galerie", "Nous trouver"].map(l => (
                <Link key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="block text-sm hover:text-[#FDFAF5] mb-3 transition-colors cursor-pointer">{l}</Link>
              ))}
            </div>
            <div>
              <p className="text-[#FDFAF5] text-xs tracking-widest uppercase mb-5">Contact</p>
              <p className="text-sm mb-2">34 rue de la Roquette</p>
              <p className="text-sm mb-2">75011 Paris</p>
              <p className="text-sm mb-4">+33 1 43 48 22 10</p>
              <Link href="#contact" className="flex items-center gap-2 text-sm hover:text-[#C9A86C] transition-colors cursor-pointer"><Instagram className="w-4 h-4" /> @lematindore</Link>
            </div>
          </div>
          <div className="pt-8 border-t border-[#4A3520] flex flex-col md:flex-row justify-between gap-4 text-xs">
            <span>© 2024 Le Matin Doré · Tous droits réservés</span>
            <div className="flex gap-6">
              {["Mentions légales", "Confidentialité"].map(l => (
                <Link key={l} href="#menu" className="hover:text-[#FDFAF5] transition-colors cursor-pointer">{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
