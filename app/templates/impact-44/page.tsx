"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, ArrowRight, Quote, Mail, Phone, MapPin, Instagram, Linkedin, ChevronRight } from "lucide-react"

function useFonts() {
  useEffect(() => {
    const id = "fonts-espace-studio"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id = id
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');`
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

const PROJECTS = [
  { id: 1, category: "Résidentiel", name: "Villa Provence", location: "Aix-en-Provence", year: "2024", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", tag: "Rénovation" },
  { id: 2, category: "Commercial", name: "Boutique Marais", location: "Paris 3e", year: "2024", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80", tag: "Concept store" },
  { id: 3, category: "Résidentiel", name: "Penthouse Hausmann", location: "Paris 8e", year: "2023", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80", tag: "Design intérieur" },
  { id: 4, category: "Commercial", name: "Hôtel Particulier", location: "Lyon", year: "2023", image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80", tag: "Hospitalité" },
  { id: 5, category: "Résidentiel", name: "Mas Luberon", location: "Gordes", year: "2023", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80", tag: "Architecture" },
  { id: 6, category: "Commercial", name: "Restaurant Sève", location: "Bordeaux", year: "2022", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80", tag: "Restauration" },
]

const PROCESS = [
  { num: "01", title: "Écoute & Vision", desc: "Une rencontre approfondie pour cerner vos usages, vos goûts et vos aspirations. Nous construisons ensemble la vision du projet avant de tracer la première ligne." },
  { num: "02", title: "Concept & Moodboard", desc: "Sélection des matières, des teintes et des mobiliers. Présentation d'un concept board complet avec planches d'atmosphère, coupes transversales et palette chromatique." },
  { num: "03", title: "Plans & Coordination", desc: "Plans techniques, suivi des corps de métier, sélection des artisans. Nous pilotons chaque intervenant pour garantir la cohérence et les délais." },
  { num: "04", title: "Livraison & Styling", desc: "Installation du mobilier, accessoirisation, mise en lumière. Votre espace est livré clé en main, prêt à être habité." },
]

const TESTIMONIALS = [
  { name: "Isabelle Fontaine", role: "Propriétaire — Villa Provence", text: "Espace Studio a transformé notre maison en un véritable havre de paix. Leur sensibilité aux matières naturelles et leur attention aux détails sont sans égal.", avatar: "IF" },
  { name: "Marc Delacroix", role: "Directeur — Boutique Marais", text: "Un travail d'orfèvre. L'espace reflète exactement l'identité de notre marque tout en étant parfaitement fonctionnel. Nos clients adorent.", avatar: "MD" },
  { name: "Sophie Renard", role: "Hôtellerie — Lyon", text: "Professionnalisme exemplaire du concept à la livraison. Chaque choix était justifié, chaque délai respecté. Un partenariat que je recommande sans réserve.", avatar: "SR" },
]

const FILTERS = ["Tous", "Résidentiel", "Commercial"]

export default function EspaceStudioPage() {
  useFonts()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeFilter, setActiveFilter] = useState("Tous")
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const { scrollYProgress } = useScroll()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef })
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "25%"])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const filtered = activeFilter === "Tous" ? PROJECTS : PROJECTS.filter(p => p.category === activeFilter)

  return (
    <div className="min-h-screen bg-[#FDFAF6] text-[#1C1C1C]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Scroll progress */}
      <motion.div className="fixed top-0 left-0 h-[2px] bg-[#C4674A] z-[1000] origin-left" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#FDFAF6]/95 backdrop-blur-md shadow-sm" : "bg-transparent"}`}
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="#" className="text-xl tracking-widest uppercase font-light" style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: "0.15em" }}>
            Espace Studio
          </Link>
          <div className="hidden md:flex items-center gap-10 text-sm font-light text-[#5A5550] tracking-wide">
            {["Projets", "Approche", "Studio", "Contact"].map(l => (
              <Link key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#C4674A] transition-colors duration-200">{l}</Link>
            ))}
            <Link href="#contact" className="ml-4 px-5 py-2.5 bg-[#1C1C1C] text-[#FDFAF6] text-xs tracking-widest uppercase hover:bg-[#C4674A] transition-colors duration-300 cursor-pointer">
              Estimer mon projet
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
          <motion.div className="fixed inset-0 z-[200] bg-[#FDFAF6] flex flex-col"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E2DA]">
              <span className="text-xl" style={{ fontFamily: "'DM Serif Display', serif" }}>Espace Studio</span>
              <button onClick={() => setMenuOpen(false)} className="p-2 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col gap-8 p-10">
              {["Projets", "Approche", "Studio", "Contact"].map((l, i) => (
                <motion.div key={l} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <Link href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                    className="text-4xl font-light text-[#1C1C1C] hover:text-[#C4674A] transition-colors cursor-pointer"
                    style={{ fontFamily: "'DM Serif Display', serif" }}>{l}</Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero — Split editorial */}
      <section ref={heroRef} className="min-h-screen grid md:grid-cols-2 pt-20">
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 md:py-0">
          <Reveal>
            <p className="text-xs tracking-[0.25em] uppercase text-[#C4674A] mb-8">Architecture d&apos;intérieur · Depuis 2010</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] mb-8" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Des espaces qui<br /><em>racontent</em><br />une histoire
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-base text-[#6B6560] leading-relaxed max-w-md mb-10">
              Espace Studio conçoit des intérieurs d&apos;exception pour des clients exigeants. Du résidentiel de prestige aux espaces commerciaux signature, nous transformons chaque lieu en une expérience singulière.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex items-center gap-6">
              <Link href="#projets" className="flex items-center gap-3 text-sm tracking-wide uppercase border-b border-[#1C1C1C] pb-1 hover:text-[#C4674A] hover:border-[#C4674A] transition-colors duration-200 cursor-pointer">
                Découvrir nos projets <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#approche" className="text-sm text-[#8A8580] hover:text-[#1C1C1C] transition-colors cursor-pointer">Notre approche</Link>
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="flex items-center gap-12 mt-16 pt-16 border-t border-[#E8E2DA]">
              {[["120+", "Projets livrés"], ["14", "Années d'expérience"], ["8", "Prix de design"]].map(([num, label]) => (
                <div key={label}>
                  <div className="text-3xl font-light" style={{ fontFamily: "'DM Serif Display', serif" }}>{num}</div>
                  <div className="text-xs text-[#8A8580] mt-1">{label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <div className="relative overflow-hidden min-h-[50vh] md:min-h-0">
          <motion.div className="absolute inset-0" style={{ y: heroY }}>
            <Image src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=85" alt="Intérieur Espace Studio" fill className="object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#FDFAF6]/10" />
          <motion.div className="absolute bottom-8 left-8 bg-[#FDFAF6]/90 backdrop-blur-sm p-5 max-w-xs"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <p className="text-xs tracking-widest uppercase text-[#C4674A] mb-1">Projet récent</p>
            <p className="text-sm font-medium" style={{ fontFamily: "'DM Serif Display', serif" }}>Villa Provence — Aix-en-Provence</p>
          </motion.div>
        </div>
      </section>

      {/* Projects */}
      <section id="projets" className="py-28 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Nos <em>réalisations</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex gap-2">
              {FILTERS.map(f => (
                <button key={f} onClick={() => setActiveFilter(f)} className={`px-5 py-2 text-xs tracking-widest uppercase border transition-all duration-200 cursor-pointer ${activeFilter === f ? "bg-[#1C1C1C] text-[#FDFAF6] border-[#1C1C1C]" : "bg-transparent text-[#6B6560] border-[#D8D2CA] hover:border-[#1C1C1C]"}`}>
                  {f}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div key={project.id} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group cursor-pointer">
                <div className="relative overflow-hidden aspect-[4/3] mb-5">
                  <Image src={project.image} alt={project.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-[#1C1C1C]/0 group-hover:bg-[#1C1C1C]/20 transition-all duration-500" />
                  <div className="absolute top-4 left-4 bg-[#FDFAF6]/90 backdrop-blur-sm px-3 py-1.5">
                    <span className="text-xs tracking-widest uppercase text-[#C4674A]">{project.tag}</span>
                  </div>
                  <div className="absolute bottom-4 right-4 w-10 h-10 bg-[#FDFAF6] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-light mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>{project.name}</h3>
                    <p className="text-sm text-[#8A8580] flex items-center gap-1.5"><MapPin className="w-3 h-3" />{project.location}</p>
                  </div>
                  <span className="text-sm text-[#8A8580]">{project.year}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Process */}
      <section id="approche" className="py-28 bg-[#F4F0EA]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-20 items-center mb-20">
            <Reveal>
              <p className="text-xs tracking-[0.25em] uppercase text-[#C4674A] mb-4">Notre méthode</p>
              <h2 className="text-4xl md:text-5xl font-light leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Un processus<br /><em>rigoureux</em> au service<br />de votre vision
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-[#6B6560] leading-relaxed">
                Chaque projet est unique. Notre processus s&apos;adapte à vos contraintes tout en maintenant les plus hauts standards de qualité. De la première esquisse à la livraison finale, nous vous accompagnons à chaque étape.
              </p>
              <Link href="#contact" className="mt-8 inline-flex items-center gap-3 text-sm tracking-wide uppercase border-b border-[#1C1C1C] pb-1 hover:text-[#C4674A] hover:border-[#C4674A] transition-colors cursor-pointer">
                Démarrer un projet <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#D8D2CA]">
            {PROCESS.map((step, i) => (
              <Reveal key={step.num} delay={i * 0.1}>
                <div className="bg-[#F4F0EA] p-8 lg:p-10 group hover:bg-[#FDFAF6] transition-colors duration-300">
                  <div className="text-5xl font-light text-[#D8D2CA] group-hover:text-[#C4674A] transition-colors duration-300 mb-8" style={{ fontFamily: "'DM Serif Display', serif" }}>
                    {step.num}
                  </div>
                  <h3 className="text-lg font-light mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>{step.title}</h3>
                  <p className="text-sm text-[#6B6560] leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* About / Studio */}
      <section id="studio" className="py-28 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <Reveal>
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80" alt="Studio" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-[#C4674A] text-[#FDFAF6] p-8 max-w-[200px]">
                <div className="text-3xl font-light mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>2010</div>
                <div className="text-xs tracking-wide">Fondé à Paris</div>
              </div>
            </Reveal>
          </div>
          <div>
            <Reveal>
              <p className="text-xs tracking-[0.25em] uppercase text-[#C4674A] mb-4">Le studio</p>
              <h2 className="text-4xl md:text-5xl font-light leading-tight mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>
                L&apos;excellence comme<br /><em>philosophie</em>
              </h2>
              <p className="text-[#6B6560] leading-relaxed mb-6">
                Fondé par Claire Beaumont en 2010, Espace Studio s&apos;est imposé comme une référence dans le design d&apos;intérieur de prestige. Notre équipe de huit designers et architectes partage une même conviction : chaque espace mérite une attention singulière.
              </p>
              <p className="text-[#6B6560] leading-relaxed mb-10">
                Nous travaillons avec des artisans d&apos;exception, des matières nobles et un réseau de fournisseurs triés sur le volet. Nos créations allient fonctionnalité et beauté intemporelle.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#E8E2DA]">
                {[["Claire Beaumont", "Fondatrice & Directrice artistique"], ["Thomas Vidal", "Architecte principal"], ["Marie Chen", "Designer senior"]].map(([name, role]) => (
                  <div key={name}>
                    <div className="w-12 h-12 rounded-full bg-[#E8E2DA] flex items-center justify-center text-xs font-medium mb-3">
                      {name.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <div className="text-sm font-medium">{name}</div>
                    <div className="text-xs text-[#8A8580] mt-0.5">{role}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#1C1C1C] text-[#FDFAF6]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <p className="text-xs tracking-[0.25em] uppercase text-[#C4674A] mb-4">Témoignages</p>
            <h2 className="text-4xl md:text-5xl font-light mb-16" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Ce qu&apos;ils <em>disent</em>
            </h2>
          </Reveal>
          <AnimatePresence mode="wait">
            <motion.div key={activeTestimonial} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
              <Quote className="w-8 h-8 text-[#C4674A] mx-auto mb-8" />
              <p className="text-xl md:text-2xl font-light leading-relaxed text-[#D8D2CA] italic mb-10" style={{ fontFamily: "'DM Serif Display', serif" }}>
                &ldquo;{TESTIMONIALS[activeTestimonial].text}&rdquo;
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#C4674A] flex items-center justify-center text-sm font-medium text-[#FDFAF6]">
                  {TESTIMONIALS[activeTestimonial].avatar}
                </div>
                <div className="text-left">
                  <div className="font-medium">{TESTIMONIALS[activeTestimonial].name}</div>
                  <div className="text-sm text-[#8A8580]">{TESTIMONIALS[activeTestimonial].role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-2 mt-10">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)} className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === activeTestimonial ? "bg-[#C4674A] w-6" : "bg-[#5A5550] w-2"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-28 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-16">
          <Reveal>
            <p className="text-xs tracking-[0.25em] uppercase text-[#C4674A] mb-4">Prestations</p>
            <h2 className="text-4xl md:text-5xl font-light leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Nos <em>services</em>
            </h2>
          </Reveal>
          <div className="space-y-0">
            {[
              { title: "Architecture intérieure", desc: "Restructuration complète, suivi de chantier, coordination des corps de métier" },
              { title: "Design d'intérieur", desc: "Sélection mobilier, matières, couleurs et luminaires. Clé en main ou conseil" },
              { title: "Architecture commerciale", desc: "Boutiques, restaurants, hôtels — des espaces qui incarnent votre marque" },
              { title: "Scénographie & Styling", desc: "Mise en scène événementielle, shooting photo, ouvertures de lieux" },
            ].map((service, i) => (
              <Reveal key={service.title} delay={i * 0.05}>
                <div className="py-8 border-b border-[#E8E2DA] group flex items-start justify-between gap-4 cursor-pointer hover:pl-4 transition-all duration-300">
                  <div>
                    <h3 className="text-lg font-light mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>{service.title}</h3>
                    <p className="text-sm text-[#8A8580]">{service.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#C4674A] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0 mt-1" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Press */}
      <section className="py-16 bg-[#F4F0EA] border-y border-[#E8E2DA]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-xs tracking-[0.25em] uppercase text-[#8A8580] text-center mb-12">Vus dans</p>
          </Reveal>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16 opacity-50">
            {["AD France", "Elle Décoration", "Côté Maison", "Architectural Digest", "Marie Claire Maison"].map(press => (
              <span key={press} className="text-sm tracking-widest uppercase font-light text-[#1C1C1C]">{press}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-28 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-20">
          <div>
            <Reveal>
              <p className="text-xs tracking-[0.25em] uppercase text-[#C4674A] mb-4">Contact</p>
              <h2 className="text-4xl md:text-5xl font-light leading-tight mb-8" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Votre projet<br /><em>commence ici</em>
              </h2>
              <p className="text-[#6B6560] leading-relaxed mb-10">
                Partagez-nous votre projet. Nous vous répondons sous 48 heures avec une première analyse de faisabilité.
              </p>
              <div className="space-y-5">
                {[{ Icon: MapPin, text: "12 rue du Faubourg Saint-Antoine, 75012 Paris" }, { Icon: Phone, text: "+33 1 42 58 74 90" }, { Icon: Mail, text: "contact@espace-studio.fr" }].map(({ Icon, text }) => (
                  <div key={text} className="flex items-center gap-4 text-sm text-[#6B6560]">
                    <Icon className="w-4 h-4 text-[#C4674A] flex-shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <form className="space-y-5" onSubmit={e => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                {["Prénom", "Nom"].map(f => (
                  <div key={f}>
                    <label className="block text-xs tracking-widest uppercase text-[#8A8580] mb-2">{f}</label>
                    <input className="w-full bg-transparent border border-[#D8D2CA] px-4 py-3 text-sm focus:outline-none focus:border-[#1C1C1C] transition-colors" placeholder={f} />
                  </div>
                ))}
              </div>
              {[["Email", "email", "votre@email.fr"], ["Téléphone", "tel", "+33 6..."]].map(([label, type, ph]) => (
                <div key={label}>
                  <label className="block text-xs tracking-widest uppercase text-[#8A8580] mb-2">{label}</label>
                  <input type={type} className="w-full bg-transparent border border-[#D8D2CA] px-4 py-3 text-sm focus:outline-none focus:border-[#1C1C1C] transition-colors" placeholder={ph} />
                </div>
              ))}
              <div>
                <label className="block text-xs tracking-widest uppercase text-[#8A8580] mb-2">Type de projet</label>
                <select className="w-full bg-[#FDFAF6] border border-[#D8D2CA] px-4 py-3 text-sm focus:outline-none focus:border-[#1C1C1C] transition-colors">
                  <option>Résidentiel — appartement ou maison</option>
                  <option>Commercial — boutique ou restaurant</option>
                  <option>Hôtellerie — hôtel ou chambre d&apos;hôtes</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-[#8A8580] mb-2">Description du projet</label>
                <textarea rows={4} className="w-full bg-transparent border border-[#D8D2CA] px-4 py-3 text-sm focus:outline-none focus:border-[#1C1C1C] transition-colors resize-none" placeholder="Décrivez votre projet, vos ambitions et votre calendrier..." />
              </div>
              <button type="submit" className="w-full bg-[#1C1C1C] text-[#FDFAF6] py-4 text-xs tracking-widest uppercase hover:bg-[#C4674A] transition-colors duration-300 cursor-pointer">
                Envoyer la demande
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1C1C1C] text-[#FDFAF6] py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="text-2xl font-light mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>Espace Studio</div>
              <p className="text-sm text-[#8A8580] leading-relaxed max-w-sm">Architecture d&apos;intérieur de prestige. Des espaces qui racontent une histoire, conçus avec rigueur et sensibilité.</p>
              <div className="flex gap-4 mt-6">
                <Link href="#" className="w-9 h-9 border border-[#5A5550] flex items-center justify-center hover:border-[#C4674A] hover:text-[#C4674A] transition-colors cursor-pointer"><Instagram className="w-4 h-4" /></Link>
                <Link href="#" className="w-9 h-9 border border-[#5A5550] flex items-center justify-center hover:border-[#C4674A] hover:text-[#C4674A] transition-colors cursor-pointer"><Linkedin className="w-4 h-4" /></Link>
              </div>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-[#8A8580] mb-5">Navigation</p>
              {["Projets", "Approche", "Studio", "Contact"].map(l => (
                <Link key={l} href={`#${l.toLowerCase()}`} className="block text-sm text-[#D8D2CA] hover:text-[#C4674A] mb-3 transition-colors cursor-pointer">{l}</Link>
              ))}
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-[#8A8580] mb-5">Prestations</p>
              {["Architecture intérieure", "Design d'intérieur", "Architecture commerciale", "Scénographie"].map(s => (
                <p key={s} className="text-sm text-[#D8D2CA] mb-3">{s}</p>
              ))}
            </div>
          </div>
          <div className="pt-8 border-t border-[#3A3A3A] flex flex-col md:flex-row justify-between gap-4 text-xs text-[#5A5550]">
            <span>© 2024 Espace Studio — Tous droits réservés</span>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-[#FDFAF6] transition-colors cursor-pointer">Mentions légales</Link>
              <Link href="#" className="hover:text-[#FDFAF6] transition-colors cursor-pointer">Politique de confidentialité</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
