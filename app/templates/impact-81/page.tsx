"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, ArrowRight, Instagram, Twitter, ChevronRight } from "lucide-react"

function useFonts() {
  useEffect(() => {
    const id = "fonts-vogue-noire"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id = id
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@300;400;500&display=swap');`
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

const EDITORIALS = [
  { title: "Corps Céleste", season: "Automne / Hiver 2025", designer: "Maison Leroux", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", tag: "Couture" },
  { title: "Lumière Froide", season: "Printemps / Été 2025", designer: "Atelier Vidal", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80", tag: "Éditorial" },
  { title: "Ombre et Matière", season: "Resort 2025", designer: "Studio Beaumont", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80", tag: "Art" },
  { title: "Minuit Parisien", season: "Automne / Hiver 2025", designer: "Collectif Nuit", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80", tag: "Exclusif" },
  { title: "Texture Vivante", season: "Couture 2025", designer: "Maison du Fil", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80", tag: "Couture" },
  { title: "Le Grand Geste", season: "Printemps / Été 2025", designer: "Atelier Blanc", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80", tag: "Éditorial" },
]

const FEATURES = [
  { issue: "N° 214 · Janvier 2025", title: "Vers un luxe invisible", subtitle: "Comment les grandes maisons réinventent la discrétion comme ultime statut", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80" },
  { issue: "N° 213 · Décembre 2024", title: "Les mains qui font", subtitle: "Portrait de six artisans dont le savoir-faire dessine l'avenir de la mode", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80" },
  { issue: "N° 212 · Novembre 2024", title: "Corps politiques", subtitle: "La mode comme langage du pouvoir — anatomie d'une saison chargée", image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80" },
]

const BOUTIQUES = [
  { city: "Paris", address: "15 rue du Faubourg Saint-Honoré, 75008", hours: "10h–19h (sf dimanche)" },
  { city: "Milan", address: "Via Montenapoleone 12, 20121", hours: "10h–19h" },
  { city: "New York", address: "720 Fifth Avenue, NY 10019", hours: "10h–20h" },
]

export default function VogueNoirePage() {
  useFonts()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeFilter, setActiveFilter] = useState("Tous")
  const { scrollYProgress } = useScroll()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroImgY = useTransform(heroScroll, [0, 1], ["0%", "30%"])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const FILTERS = ["Tous", "Couture", "Éditorial", "Art", "Exclusif"]
  const filtered = activeFilter === "Tous" ? EDITORIALS : EDITORIALS.filter(e => e.tag === activeFilter)

  return (
    <div className="min-h-screen bg-[#0A0A08] text-[#F0EBE0]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 h-[1px] bg-[#F0EBE0] z-[1000] origin-left" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#0A0A08]/95 backdrop-blur-md border-b border-[#2A2A20]" : "bg-transparent"}`}
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="#" className="text-2xl font-light tracking-[0.2em] uppercase" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Vogue Noire
          </Link>
          <div className="hidden md:flex items-center gap-10 text-xs tracking-[0.15em] uppercase text-[#A0988A]">
            {["Éditoriaux", "Magazine", "Maisons", "Boutiques"].map(l => (
              <Link key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#F0EBE0] transition-colors duration-200">{l}</Link>
            ))}
            <Link href="#" className="ml-4 px-5 py-2.5 border border-[#A0988A] text-xs tracking-widest uppercase hover:bg-[#F0EBE0] hover:text-[#0A0A08] transition-all duration-300 cursor-pointer">
              S&apos;abonner
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
          <motion.div className="fixed inset-0 z-[200] bg-[#0A0A08] flex flex-col"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#2A2A20]">
              <span className="text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Vogue Noire</span>
              <button onClick={() => setMenuOpen(false)} className="p-2 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col gap-10 p-10">
              {["Éditoriaux", "Magazine", "Maisons", "Boutiques"].map((l, i) => (
                <motion.div key={l} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <Link href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                    className="text-4xl font-light text-[#F0EBE0] hover:text-[#C9A86C] transition-colors cursor-pointer"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>{l}</Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero — asymmetric mosaic */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroImgY }}>
          <Image src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85" alt="Vogue Noire" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A08] via-[#0A0A08]/50 to-[#0A0A08]/20" />
        </motion.div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-32 min-h-screen flex flex-col">
          <div className="flex-1 flex flex-col justify-center">
            <Reveal>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-8">Numéro 214 · Janvier 2025</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-light leading-[0.9] mb-8 tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Corps<br /><em>Céleste</em>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-[#A0988A] text-lg max-w-md leading-relaxed mb-10">
                La saison Automne / Hiver 2025 porte en elle une nouvelle grammaire du corps. Entre retenue et explosion, les maisons réinventent leur vocabulaire.
              </p>
              <Link href="#éditoriaux" className="inline-flex items-center gap-3 text-sm tracking-widest uppercase border-b border-[#C9A86C] pb-1 text-[#C9A86C] hover:text-[#F0EBE0] hover:border-[#F0EBE0] transition-colors cursor-pointer">
                Explorer le numéro <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>
          </div>
          {/* Bottom meta */}
          <div className="pb-12 flex items-center justify-between">
            <div className="flex gap-10 text-xs text-[#6A6058] tracking-wide">
              <span>Couverture : Maison Leroux</span>
              <span>Photo : E. Fontaine</span>
            </div>
            <div className="flex gap-4">
              <Link href="#" className="w-9 h-9 border border-[#3A3028] flex items-center justify-center hover:border-[#F0EBE0] transition-colors cursor-pointer"><Instagram className="w-4 h-4" /></Link>
              <Link href="#" className="w-9 h-9 border border-[#3A3028] flex items-center justify-center hover:border-[#F0EBE0] transition-colors cursor-pointer"><Twitter className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Current issue features */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-3">Dans ce numéro</p>
          <h2 className="text-4xl md:text-5xl font-light mb-14" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            À lire ce mois-ci
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-1">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.1}>
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden aspect-[3/4] mb-5">
                  <Image src={f.image} alt={f.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-[#0A0A08]/30" />
                  <div className="absolute top-4 left-4 text-[10px] tracking-widest uppercase text-[#C9A86C]">{f.issue}</div>
                </div>
                <h3 className="text-2xl font-light mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{f.title}</h3>
                <p className="text-sm text-[#6A6058] leading-relaxed mb-4">{f.subtitle}</p>
                <Link href="#" className="text-xs text-[#C9A86C] flex items-center gap-1.5 hover:gap-3 transition-all cursor-pointer">Lire <ArrowRight className="w-3.5 h-3.5" /></Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Editorial grid */}
      <section id="éditoriaux" className="py-24 bg-[#0E0E0C]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <Reveal>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-3">Éditoriaux</p>
              <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                La saison en images
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex flex-wrap gap-2">
                {FILTERS.map(f => (
                  <button key={f} onClick={() => setActiveFilter(f)}
                    className={`px-4 py-2 text-[10px] tracking-widest uppercase border transition-all duration-200 cursor-pointer ${activeFilter === f ? "bg-[#F0EBE0] text-[#0A0A08] border-[#F0EBE0]" : "bg-transparent text-[#6A6058] border-[#2A2A20] hover:border-[#F0EBE0]"}`}>
                    {f}
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-1">
            <AnimatePresence mode="popLayout">
              {filtered.map((editorial, i) => (
                <motion.div key={editorial.title} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group cursor-pointer relative overflow-hidden">
                  <div className="relative aspect-[3/4]">
                    <Image src={editorial.image} alt={editorial.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A08]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-[10px] text-[#C9A86C] tracking-widest uppercase mb-1">{editorial.designer}</p>
                      <h3 className="text-xl font-light text-[#F0EBE0]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{editorial.title}</h3>
                      <p className="text-xs text-[#A0988A] mt-1">{editorial.season}</p>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="text-[10px] tracking-widest uppercase bg-[#0A0A08]/60 text-[#C9A86C] px-2.5 py-1.5 backdrop-blur-sm">{editorial.tag}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Featured interview */}
      <section id="magazine" className="py-28 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80" alt="Interview" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A08]/60 to-transparent" />
            </div>
          </Reveal>
          <div>
            <Reveal delay={0.1}>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-6">Portrait du mois</p>
              <h2 className="text-4xl md:text-5xl font-light leading-tight mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                &ldquo;La mode est<br />un langage politique<br /><em>avant tout&rdquo;</em>
              </h2>
              <p className="text-[#A0988A] leading-relaxed mb-4">
                Hanna Kovacs, 34 ans, est la directrice artistique qui a bousculé les codes de la haute couture en moins de trois saisons. Nous l&apos;avons rencontrée dans son atelier du Marais, entre deux fittings.
              </p>
              <p className="text-[#A0988A] leading-relaxed mb-10">
                Elle parle de corps comme d&apos;arguments, de tissu comme de manifeste. Sa collection Automne 2025 interroge les liens entre silhouette et pouvoir avec une radicalité rare pour une jeune maison.
              </p>
              <Link href="#" className="inline-flex items-center gap-3 text-sm tracking-widest uppercase border-b border-[#C9A86C] pb-1 text-[#C9A86C] hover:text-[#F0EBE0] hover:border-[#F0EBE0] transition-colors cursor-pointer">
                Lire l&apos;interview complète <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Maisons */}
      <section id="maisons" className="py-24 bg-[#0E0E0C]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-3">Répertoire</p>
            <h2 className="text-4xl md:text-5xl font-light mb-14" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Les maisons <em>partenaires</em>
            </h2>
          </Reveal>
          <div className="space-y-0">
            {["Maison Leroux", "Atelier Vidal", "Studio Beaumont", "Collectif Nuit", "Maison du Fil", "Atelier Blanc", "La Forge", "Studio Diaphane"].map((maison, i) => (
              <Reveal key={maison} delay={i * 0.04}>
                <div className="py-6 border-b border-[#2A2A20] flex items-center justify-between group cursor-pointer hover:pl-4 transition-all duration-300">
                  <div className="flex items-center gap-6">
                    <span className="text-xs text-[#3A3028]">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-xl font-light group-hover:text-[#C9A86C] transition-colors duration-200" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{maison}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#C9A86C] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-16 bg-[#C9A86C]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-[#0A0A08]">
            {[["214", "Numéros publiés"], ["28", "Pays de diffusion"], ["180k", "Lecteurs mensuels"], ["1998", "Année de fondation"]].map(([val, label]) => (
              <Reveal key={label}>
                <div className="text-4xl font-light mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{val}</div>
                <div className="text-xs tracking-widest uppercase">{label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Boutiques */}
      <section id="boutiques" className="py-28 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <Reveal>
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">Nos boutiques</p>
            <h2 className="text-4xl md:text-5xl font-light leading-tight mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Nous retrouver<br /><em>en boutique</em>
            </h2>
            <p className="text-[#A0988A] leading-relaxed">
              Retrouvez tous nos numéros, nos objets éditoriaux et nos collaborations exclusives dans nos boutiques à travers le monde.
            </p>
          </Reveal>
          <div className="space-y-0">
            {BOUTIQUES.map((b, i) => (
              <Reveal key={b.city} delay={i * 0.08}>
                <div className="py-8 border-b border-[#2A2A20] group cursor-pointer hover:pl-4 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-light mb-2 group-hover:text-[#C9A86C] transition-colors duration-200" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{b.city}</h3>
                      <p className="text-sm text-[#6A6058] mb-1">{b.address}</p>
                      <p className="text-xs text-[#3A3028]">{b.hours}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#C9A86C] opacity-0 group-hover:opacity-100 transition-opacity mt-2" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-[#0E0E0C] text-center px-6">
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86C] mb-4">Restez informés</p>
          <h2 className="text-4xl md:text-5xl font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            La lettre de <em>Vogue Noire</em>
          </h2>
          <p className="text-[#6A6058] text-sm mb-8 max-w-md mx-auto">Actualités des maisons, portfolios exclusifs, événements de la mode. Chaque semaine, dans votre boîte mail.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Votre adresse email" className="flex-1 bg-transparent border border-[#2A2A20] px-5 py-3.5 text-sm text-[#F0EBE0] focus:outline-none focus:border-[#C9A86C] transition-colors" />
            <button type="submit" className="px-8 py-3.5 bg-[#C9A86C] text-[#0A0A08] text-xs tracking-widest uppercase font-medium hover:bg-[#F0EBE0] transition-colors cursor-pointer">
              S&apos;abonner
            </button>
          </form>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0A08] border-t border-[#2A2A20] py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="text-2xl font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Vogue Noire</div>
              <p className="text-sm text-[#6A6058] leading-relaxed max-w-xs">Magazine de mode, culture et création. Depuis 1998, la voix de la mode contemporaine.</p>
            </div>
            <div>
              <p className="text-[10px] tracking-widest uppercase text-[#3A3028] mb-5">Navigation</p>
              {["Éditoriaux", "Magazine", "Maisons", "Boutiques"].map(l => (
                <Link key={l} href={`#${l.toLowerCase()}`} className="block text-sm text-[#6A6058] hover:text-[#F0EBE0] mb-3 transition-colors cursor-pointer">{l}</Link>
              ))}
            </div>
            <div>
              <p className="text-[10px] tracking-widest uppercase text-[#3A3028] mb-5">Suivez-nous</p>
              {[["Instagram", "@vogue.noire"], ["Twitter", "@VogueNoire"], ["Pinterest", "Vogue Noire"]].map(([network, handle]) => (
                <p key={network} className="text-sm text-[#6A6058] mb-3">{network} <span className="text-[#C9A86C]">{handle}</span></p>
              ))}
            </div>
          </div>
          <div className="pt-8 border-t border-[#1A1A14] flex flex-col md:flex-row justify-between gap-4 text-xs text-[#3A3028]">
            <span>© 2025 Vogue Noire — Tous droits réservés</span>
            <div className="flex gap-6">
              {["Mentions légales", "Politique de confidentialité", "CGU"].map(l => (
                <Link key={l} href="#" className="hover:text-[#F0EBE0] transition-colors cursor-pointer">{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
