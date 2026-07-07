"use client";
// @ts-nocheck

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, ArrowRight, MapPin, Calendar, Clock, ChevronRight, Search, Globe, Wind } from "lucide-react"

function useFonts() {
  useEffect(() => {
    const id = "fonts-atlas"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id = id
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,600&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap');`
    document.head.appendChild(s)
  }, [])
}

function Reveal({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

const ARTICLES = [
  {
    id: 1,
    region: "Asie du Sud-Est",
    country: "Japon",
    title: "Kyoto en automne : l'érablière de Tofuku-ji et l'art de se perdre",
    excerpt: "Novembre transforme les collines de Kyoto en une explosion de rouge et d'or. Carnet d'une semaine à marcher entre temples et jardins...",
    date: "12 novembre 2024",
    readTime: "11 min",
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80",
    tag: "Récit",
  },
  {
    id: 2,
    region: "Afrique",
    country: "Maroc",
    title: "Les gorges du Todra à l'aube — lumière oblique sur l'ocre du désert",
    excerpt: "Il faut arriver avant six heures du matin. La caravane de touristes n'est pas encore là et les parois de 160 mètres flamboient...",
    date: "3 octobre 2024",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=80",
    tag: "Photographie",
  },
  {
    id: 3,
    region: "Europe",
    country: "Islande",
    title: "Route 1, hiver : conduire dans le noir sous les aurores boréales",
    excerpt: "Décembre en Islande est une folie douce. Cinq heures de clarté, des températures imprévisibles et le ciel qui danse...",
    date: "18 décembre 2024",
    readTime: "14 min",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
    tag: "Aventure",
  },
  {
    id: 4,
    region: "Amériques",
    country: "Pérou",
    title: "Machu Picchu avant l'aurore : une heure seul avec les pierres incas",
    excerpt: "Tout le monde sait qu'il faut partir tôt. Mais « tôt » à Aguas Calientes, c'est 3h30 du matin, dans le brouillard...",
    date: "5 septembre 2024",
    readTime: "9 min",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80",
    tag: "Récit",
  },
  {
    id: 5,
    region: "Océanie",
    country: "Australie",
    title: "L'outback à cheval : cinq jours dans les Flinders Ranges avec les Adnyamathanha",
    excerpt: "Pas de route, pas de wifi, pas d'heure. Juste la terre rouge, le ciel immense et les histoires du Temps du Rêve...",
    date: "22 juillet 2024",
    readTime: "16 min",
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=80",
    tag: "Immersion",
  },
  {
    id: 6,
    region: "Europe",
    country: "Éthiopie",
    title: "Lalibela : les églises taillées dans le roc à 2600 mètres d'altitude",
    excerpt: "Comment des hommes du XIIe siècle ont-ils pu creuser onze cathédrales dans la roche basaltique ? Une question qui obsède.",
    date: "14 juin 2024",
    readTime: "12 min",
    image: "https://images.unsplash.com/photo-1543749679-3d4e66d3b9f3?w=800&q=80",
    tag: "Patrimoine",
  },
]

const DESTINATIONS = [
  { name: "Japon", articles: 12, image: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=400&q=80" },
  { name: "Pérou", articles: 8, image: "https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=400&q=80" },
  { name: "Islande", articles: 6, image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=400&q=80" },
  { name: "Maroc", articles: 9, image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=400&q=80" },
  { name: "Éthiopie", articles: 5, image: "https://images.unsplash.com/photo-1568996508071-7f3d4b0bb2c0?w=400&q=80" },
  { name: "Australie", articles: 7, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" },
]

const REGIONS = ["Toutes", "Asie", "Afrique", "Europe", "Amériques", "Océanie"]


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
export default function AtlasPage() {
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
  const [activeRegion, setActiveRegion] = useState("Toutes")
  const [searchQuery, setSearchQuery] = useState("")
  const { scrollYProgress } = useScroll()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroImgY = useTransform(heroScroll, [0, 1], ["0%", "40%"])
  const heroTextY = useTransform(heroScroll, [0, 1], ["0%", "15%"])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    
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
return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const filtered = ARTICLES.filter(a => {
    const matchRegion = activeRegion === "Toutes" || a.region.toLowerCase().includes(activeRegion.toLowerCase())
    const matchSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.country.toLowerCase().includes(searchQuery.toLowerCase())
    return matchRegion && matchSearch
  })

  const featuredArticle = ARTICLES[0]

  return (
    <div className="min-h-screen text-[#2C1F0E]" style={{ fontFamily: "'Inter', sans-serif", background: "#F5F0E8" }}>
      <motion.div className="fixed top-0 left-0 h-[2px] bg-[#C0392B] z-[1000] origin-left" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#F5F0E8]/95 backdrop-blur-md border-b border-[#D4C9B0]" : "bg-transparent"}`}
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="#apropos" className="flex items-center gap-3">
            {fd?.logoBase64 ? (
              <img
                src={fd.logoBase64}
                alt={fd?.businessName ?? 'logo'}
                style={{ height: 32, maxWidth: 160, objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <>
                <Globe className="w-5 h-5 text-[#C0392B]" />
                <span className="text-xl font-bold tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>Atlas</span>
              </>
            )}
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#6B5A40]">
            {["Articles", "Destinations", "À propos", "Newsletter"].map(l => {
              const cleaned = l.toLowerCase().replace(" ", "-").replace("à", "a");
              return <Link key={l} href={`#${cleaned}`} className="hover:text-[#2C1F0E] transition-colors duration-200">{l}</Link>;
            })}
            <button className="relative">
              <Search className="w-5 h-5 text-[#6B5A40] hover:text-[#2C1F0E] transition-colors cursor-pointer" />
            </button>
          </div>
          <button className="md:hidden p-2 cursor-pointer" onClick={() => setMenuOpen(true)} aria-label="Menu">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="fixed inset-0 z-[200] bg-[#2C1F0E] text-[#F5F0E8] flex flex-col"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 280, damping: 28 }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#4A3520]">
              {fd?.logoBase64 ? (
                <img
                  src={fd.logoBase64}
                  alt={fd?.businessName ?? 'logo'}
                  style={{ height: 28, maxWidth: 140, objectFit: 'contain', display: 'block' }}
                />
              ) : (
                <span className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Atlas</span>
              )}
              <button onClick={() => setMenuOpen(false)} className="p-2 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col gap-8 p-10">
              {["Articles", "Destinations", "À propos", "Newsletter"].map((l, i) => (
                <motion.div key={l} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <Link href={`#${l.toLowerCase().replace(" ", "-").replace("à", "a")}`} onClick={() => setMenuOpen(false)}
                    className="text-3xl font-light hover:text-[#C0392B] transition-colors cursor-pointer"
                    style={{ fontFamily: "'Playfair Display', serif" }}>{l}</Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero — Featured article */}
      <section id="hero" ref={heroRef} className="relative min-h-screen overflow-hidden flex items-end">
        <motion.div className="absolute inset-0" style={{ y: heroImgY }}>
          <Image src={featuredArticle.image} alt={featuredArticle.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A0E05]/95 via-[#1A0E05]/40 to-transparent" />
        </motion.div>

        {/* Floating postcards — stacked */}
        <motion.div className="absolute top-24 right-8 md:right-20 hidden md:block"
          initial={{ opacity: 0, rotate: -5 }} animate={{ opacity: 1, rotate: -5 }} transition={{ delay: 0.8 }}>
          <div className="relative w-40 h-28 bg-[#FFF8EF] shadow-2xl rounded-sm overflow-hidden rotate-[-5deg]">
            <Image src="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=200&q=70" alt="postcard" fill className="object-cover" />
            <div className="absolute bottom-1 left-2 text-[8px] text-[#2C1F0E] font-mono">Kyoto, JP — 11.2024</div>
          </div>
          <div className="absolute -top-4 -right-4 w-36 h-24 bg-[#FFF8EF] shadow-xl rounded-sm overflow-hidden rotate-[8deg]">
            <Image src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=200&q=70" alt="postcard" fill className="object-cover" />
            <div className="absolute bottom-1 left-2 text-[8px] text-[#2C1F0E] font-mono">Todra, MA — 10.2024</div>
          </div>
        </motion.div>

        <motion.div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-20 pt-32" style={{ y: heroTextY }}>
          <Reveal>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs tracking-widest uppercase text-[#C0392B] bg-[#C0392B]/20 px-3 py-1 rounded-full">{featuredArticle.tag}</span>
              <span className="text-xs text-[#D4C9B0] flex items-center gap-1.5"><MapPin className="w-3 h-3" />{featuredArticle.country}</span>
              <span className="text-xs text-[#D4C9B0] flex items-center gap-1.5"><Calendar className="w-3 h-3" />{featuredArticle.date}</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-normal text-[#F5F0E8] leading-[1.05] max-w-4xl mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>{c?.heroHeadline ?? <>
              {featuredArticle.title}
            </>}</h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[#D4C9B0] text-lg leading-relaxed max-w-xl mb-8" style={{ fontFamily: "'EB Garamond', serif" }}>{c?.heroSubline ?? fd?.tagline ?? <>
              {featuredArticle.excerpt}
            </>}</p>
            <Link href="#articles" className="inline-flex items-center gap-3 text-[#F5F0E8] text-sm border-b border-[#C0392B] pb-0.5 hover:text-[#C0392B] transition-colors cursor-pointer">
              Lire le récit complet <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
          <div className="mt-16 pt-8 border-t border-[#4A3520]/60 grid grid-cols-3 md:grid-cols-6 gap-4">
            {[["87", "Récits publiés"], ["34", "Pays visités"], ["12", "Années de route"], ["480k", "Lecteurs mensuels"], ["6", "Prix reçus"], ["240h", "De vidéos"]].map(([val, label]) => (
              <div key={label}>
                <div className="text-xl text-[#C0392B]" style={{ fontFamily: "'Playfair Display', serif" }}>{val}</div>
                <div className="text-[10px] text-[#8A7560] mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Search & Filter */}
      <section id="articles" className="py-16 bg-[#EDE8DC] border-b border-[#D4C9B0]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A7560]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher un récit, un pays..."
                className="w-full bg-[#F5F0E8] border border-[#D4C9B0] pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#2C1F0E] transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map(r => (
                <button key={r} onClick={() => setActiveRegion(r)}
                  className={`px-4 py-2 text-xs tracking-wide uppercase border transition-all duration-200 cursor-pointer ${activeRegion === r ? "bg-[#2C1F0E] text-[#F5F0E8] border-[#2C1F0E]" : "bg-transparent text-[#6B5A40] border-[#D4C9B0] hover:border-[#2C1F0E]"}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles grid */}
      <section id="contact" className="py-20 max-w-7xl mx-auto px-6 md:px-12">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-[#8A7560]">
              <Wind className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p>Aucun récit pour cette sélection.</p>
            </motion.div>
          ) : (
            <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filtered.map((article, i) => (
                <motion.article key={article.id} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="group cursor-pointer">
                  <div className="relative overflow-hidden aspect-[3/2] mb-6">
                    <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-[#2C1F0E]/0 group-hover:bg-[#2C1F0E]/20 transition-all duration-500" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-[#C0392B] text-white text-[10px] tracking-widest uppercase px-2.5 py-1">{article.tag}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#8A7560] mb-3">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{article.country}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{article.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
                  </div>
                  <h2 className="text-xl font-normal leading-snug mb-3 group-hover:text-[#C0392B] transition-colors duration-200" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {article.title}
                  </h2>
                  <p className="text-sm text-[#6B5A40] leading-relaxed mb-4 line-clamp-3" style={{ fontFamily: "'EB Garamond', serif", fontSize: "16px" }}>
                    {article.excerpt}
                  </p>
                  <Link href="#newsletter" className="text-xs text-[#C0392B] flex items-center gap-1.5 hover:gap-3 transition-all duration-200 cursor-pointer">
                    Lire le récit <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Destinations grid */}
      <section id="destinations" className="py-28 bg-[#2C1F0E] text-[#F5F0E8]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-14">
            <Reveal>
              <p className="text-[#C0392B] text-xs tracking-[0.25em] uppercase mb-4">Destinations</p>
              <h2 className="text-4xl md:text-5xl font-normal" style={{ fontFamily: "'Playfair Display', serif" }}>
                Explorer par région
              </h2>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {DESTINATIONS.map((dest, i) => (
              <Reveal key={dest.name} delay={i * 0.07}>
                <div className="relative overflow-hidden aspect-[4/3] group cursor-pointer">
                  <Image src={dest.image} alt={dest.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-[#2C1F0E]/40 group-hover:bg-[#2C1F0E]/20 transition-all duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#2C1F0E]/90 to-transparent">
                    <h3 className="text-xl font-normal" style={{ fontFamily: "'Playfair Display', serif" }}>{dest.name}</h3>
                    <p className="text-xs text-[#D4C9B0] mt-0.5">{dest.articles} récits</p>
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 bg-[#C0392B] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ChevronRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* About / à propos */}
      <section id="apropos" className="py-28 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <Reveal>
            <div className="relative">
              <div className="aspect-[4/5] relative overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80" alt="Auteur" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-8 -right-6 bg-[#C0392B] text-white p-6">
                <div className="text-3xl font-light mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>2012</div>
                <div className="text-xs uppercase tracking-wide">Premier récit publié</div>
              </div>
            </div>
          </Reveal>
          <div>
            <Reveal delay={0.1}>
              <p className="text-xs tracking-[0.25em] uppercase text-[#C0392B] mb-4">À propos d&apos;Atlas</p>
              <h2 className="text-4xl md:text-5xl font-normal leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>{c?.aboutTitle ?? fd?.businessName ?? <>
                Le voyage comme<br /><em>littérature</em>
              </>}</h2>
              <p className="text-[#6B5A40] leading-relaxed mb-5" style={{ fontFamily: "'EB Garamond', serif", fontSize: "18px" }}>{c?.aboutText ?? <>
                Atlas est né d&apos;une conviction simple : les voyages méritent mieux que des guides pratiques. Chaque lieu a une histoire, une texture, une odeur. Chaque rencontre change quelque chose.
              </>}</p>
              <p className="text-[#6B5A40] leading-relaxed mb-8" style={{ fontFamily: "'EB Garamond', serif", fontSize: "18px" }}>
                Depuis 2012, nous publions des récits de voyage qui prennent le temps de raconter — l&apos;ennui du long-courrier, la chaleur du thé offert par un inconnu, le vertige du sommet. Pas des conseils, des présences.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="flex flex-wrap gap-4">
                {[["87 récits", "publiés"], ["34 pays", "parcourus"], ["480k lecteurs", "mensuels"]].map(([val, label]) => (
                  <div key={label} className="bg-[#EDE8DC] px-5 py-4">
                    <div className="text-lg font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>{val}</div>
                    <div className="text-xs text-[#8A7560]">{label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="py-24 bg-[#EDE8DC] border-y border-[#D4C9B0]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <Reveal>
            <Globe className="w-10 h-10 text-[#C0392B] mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-normal mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              La lettre d&apos;Atlas
            </h2>
            <p className="text-[#6B5A40] leading-relaxed mb-8" style={{ fontFamily: "'EB Garamond', serif", fontSize: "18px" }}>
              Chaque mois, un récit inédit, une destination à découvrir et trois choses que nous avons lues. Pas de spam, pas de publicité. Seulement le voyage.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 bg-[#F5F0E8] border border-[#D4C9B0] px-4 py-3.5 text-sm focus:outline-none focus:border-[#2C1F0E] transition-colors"
              />
              <button type="submit" className="px-8 py-3.5 bg-[#2C1F0E] text-[#F5F0E8] text-sm uppercase tracking-widest hover:bg-[#C0392B] transition-colors cursor-pointer whitespace-nowrap">
                S&apos;abonner
              </button>
            </form>
            <p className="text-xs text-[#8A7560] mt-4">Rejoignez 48 000 lecteurs. Désabonnement en un clic.</p>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A0E05] text-[#6B5A40] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-[#C0392B]" />
                <span className="text-[#F5F0E8] text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Atlas</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs" style={{ fontFamily: "'EB Garamond', serif", fontSize: "16px" }}>
                Journal de voyage littéraire. Des récits qui prennent le temps de raconter.
              </p>
            </div>
            <div>
              <p className="text-[#F5F0E8] text-xs tracking-widest uppercase mb-5">Navigation</p>
              {["Articles", "Destinations", "À propos", "Newsletter"].map(l => (
                <Link key={l} href={`#${l.toLowerCase().replace(" ", "-").replace("à", "a")}`} className="block text-sm hover:text-[#F5F0E8] mb-3 transition-colors cursor-pointer">{l}</Link>
              ))}
            </div>
            <div>
              <p className="text-[#F5F0E8] text-xs tracking-widest uppercase mb-5">Régions</p>
              {["Asie", "Afrique", "Europe", "Amériques", "Océanie"].map(r => (
                <p key={r} className="text-sm mb-3 cursor-pointer hover:text-[#F5F0E8] transition-colors">{r}</p>
              ))}
            </div>
          </div>
          <div className="pt-8 border-t border-[#2C1F0E] flex flex-col md:flex-row justify-between gap-4 text-xs">
            <span>© 2024 Atlas · Journal de voyage · Tous droits réservés</span>
            <div className="flex gap-6">
              {["Mentions légales", "Politique de confidentialité"].map(l => (
                <Link key={l} href="#articles" className="hover:text-[#F5F0E8] transition-colors cursor-pointer">{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
