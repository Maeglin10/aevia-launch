"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, ArrowRight, CheckCircle, ChevronRight, Phone, Mail, MapPin, Clock, Award, Microscope, Shield, FlaskConical, Stethoscope, Sparkles } from "lucide-react"

function useFonts() {
  useEffect(() => {
    const id = "fonts-lumiere-clinic"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id = id
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap');`
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

const TREATMENTS = [
  {
    id: "botox",
    icon: Sparkles,
    label: "Toxine botulique",
    title: "Relaxation musculaire de précision",
    desc: "Traitement des rides d'expression par injection de toxine botulique de grade médical. Protocole personnalisé selon l'anatomie faciale, résultats naturels préservant l'expressivité.",
    duration: "30 min",
    results: "3–6 mois",
    detail: ["Rides du front", "Pattes d'oie", "Rides du lion", "Transpiration excessive (hyperhidrose)"],
  },
  {
    id: "filler",
    icon: FlaskConical,
    label: "Acide hyaluronique",
    title: "Restauration volumétrique ciblée",
    desc: "Comblement des rides profondes, restauration des volumes faciaux et traitement des cernes. Produits réversibles et biodégradables, techniques d'injection cannule.",
    duration: "45 min",
    results: "12–18 mois",
    detail: ["Lèvres & contour buccal", "Sillons naso-géniens", "Cernes & joues", "Remodelage mandibulaire"],
  },
  {
    id: "laser",
    icon: Microscope,
    label: "Lasers médicaux",
    title: "Photobiostimulation & resurfaçage",
    desc: "Gamme de lasers Nd:YAG, CO2 fractionné et IPL pour le traitement des taches pigmentaires, du vieillissement cutané, de la rosacée et des cicatrices.",
    duration: "20–60 min",
    results: "Permanent",
    detail: ["Taches pigmentaires", "Rosacée & couperose", "Resurfaçage cutané", "Épilation définitive"],
  },
  {
    id: "bio",
    icon: Shield,
    label: "Biostimulation",
    title: "Régénération cellulaire profonde",
    desc: "PRP (Plasma Riche en Plaquettes), Skinbooster Restylane Vital, polynucléotides. Traitements de fond pour améliorer la qualité de peau en profondeur.",
    duration: "60 min",
    results: "6–12 mois",
    detail: ["PRP & mesothérapie", "Skinboosters", "Polynucléotides PDRN", "Radicaux libres & antioxydants"],
  },
  {
    id: "lifting",
    icon: Stethoscope,
    label: "Fils tenseurs",
    title: "Remodelage par traction tissulaire",
    desc: "Fils résorbables PDO et PLLA pour lifting non-chirurgical. Repositionnement des tissus ptosés et stimulation naturelle de la néocollagénèse.",
    duration: "60–90 min",
    results: "18–24 mois",
    detail: ["Lifting ovale visage", "Lifting du cou", "Repositionnement jugal", "Stimulation collagène"],
  },
]

const DOCTORS = [
  { name: "Dr. Sophie Marchand", spec: "Médecine esthétique", diploma: "DESC Médecine esthétique — Paris VI", exp: "18 ans d'expérience", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80" },
  { name: "Dr. Laurent Faure", spec: "Dermatologie & Lasers", diploma: "DES Dermatologie — Paris Descartes", exp: "14 ans d'expérience", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80" },
  { name: "Dr. Isabelle Roux", spec: "Chirurgie réparatrice", diploma: "DESC Chirurgie plastique — Lyon", exp: "22 ans d'expérience", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80" },
]

const SCIENCE = [
  { icon: FlaskConical, title: "Protocoles validés", desc: "Tous nos traitements reposent sur des études cliniques de niveau 1 et des recommandations de sociétés savantes (SFML, SFD)." },
  { icon: Shield, title: "Produits CE médical", desc: "Nous utilisons exclusivement des produits homologués CE et FDA, approvisionnés directement auprès des laboratoires." },
  { icon: Microscope, title: "Matériel de pointe", desc: "Lasers médicaux Alma, Quanta et Cynosure. Maintenance certifiée, calibrage semestriel par les constructeurs." },
  { icon: Award, title: "Formation continue", desc: "Nos praticiens se forment chaque année aux congrès IMCAS (Paris), AMWC (Monaco) et AAD (USA)." },
]

export default function LumiereCliniquePage() {
  useFonts()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeTreatment, setActiveTreatment] = useState(0)
  const { scrollYProgress } = useScroll()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const ActiveIcon = TREATMENTS[activeTreatment].icon

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#181410]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 h-[2px] bg-[#3A8080] z-[1000] origin-left" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#FAFAF8]/95 backdrop-blur-md border-b border-[#E8E4DE]" : "bg-transparent"}`}
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="#" className="flex flex-col">
            <span className="text-xl tracking-widest font-light" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.1em" }}>Lumière Clinic</span>
            <span className="text-[9px] tracking-[0.25em] uppercase text-[#3A8080]">Médecine esthétique médicale</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-light text-[#6B6560]">
            {["Traitements", "Praticiens", "Science", "Contact"].map(l => (
              <Link key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#181410] transition-colors duration-200">{l}</Link>
            ))}
            <Link href="#contact" className="ml-2 px-5 py-2.5 bg-[#181410] text-[#FAFAF8] text-xs tracking-widest uppercase hover:bg-[#3A8080] transition-colors duration-300 cursor-pointer">
              Prendre RDV
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
          <motion.div className="fixed inset-0 z-[200] bg-[#FAFAF8] flex flex-col"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 280, damping: 28 }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E4DE]">
              <span style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl">Lumière Clinic</span>
              <button onClick={() => setMenuOpen(false)} className="p-2 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col gap-8 p-10">
              {["Traitements", "Praticiens", "Science", "Contact"].map((l, i) => (
                <motion.div key={l} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <Link href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                    className="text-3xl font-light hover:text-[#3A8080] transition-colors cursor-pointer"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>{l}</Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=85" alt="Lumière Clinic" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAFAF8]/95 via-[#FAFAF8]/70 to-[#FAFAF8]/20" />
        </motion.div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-36 pb-24 min-h-screen flex flex-col justify-center">
          <Reveal>
            <p className="text-xs tracking-[0.3em] uppercase text-[#3A8080] mb-8">Médecine esthétique de précision</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-light leading-[1.0] mb-8 max-w-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              La beauté<br /><em>comme résultat</em><br />de la science
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[#6B6560] text-lg leading-relaxed max-w-lg mb-12">
              Lumière Clinic allie rigueur médicale et approche esthétique personnalisée. Chaque protocole est co-construit avec le patient, fondé sur des preuves scientifiques et exécuté avec précision.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link href="#contact" className="inline-flex items-center gap-3 px-8 py-4 bg-[#181410] text-[#FAFAF8] text-sm uppercase tracking-widest hover:bg-[#3A8080] transition-colors cursor-pointer">
                Consultation médicale <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#traitements" className="inline-flex items-center gap-3 px-8 py-4 border border-[#C9C0B0] text-[#181410] text-sm uppercase tracking-widest hover:border-[#181410] transition-colors cursor-pointer">
                Nos traitements
              </Link>
            </div>
          </Reveal>
          <div className="mt-20 pt-10 border-t border-[#E8E4DE] grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl">
            {[["3 médecins", "Spécialistes"], ["18 ans", "D'expertise"], ["4 800+", "Patients suivis"], ["97%", "Satisfaction"]].map(([val, label]) => (
              <div key={label}>
                <div className="text-2xl font-light text-[#3A8080] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{val}</div>
                <div className="text-xs text-[#8A8278] uppercase tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Treatments */}
      <section id="traitements" className="py-28 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-5 gap-10 mb-16">
            <div className="md:col-span-2">
              <Reveal>
                <p className="text-xs tracking-[0.25em] uppercase text-[#3A8080] mb-4">Traitements</p>
                <h2 className="text-4xl md:text-5xl font-light leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Protocoles<br />médicaux de<br /><em>référence</em>
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-3">
              <Reveal delay={0.1}>
                <p className="text-[#6B6560] leading-relaxed">
                  Chaque traitement est précédé d&apos;une consultation médicale approfondie (30 min). Nous établissons un bilan complet, définissons les objectifs et proposons un protocole adapté. Aucun geste sans accord éclairé.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-0 border border-[#E8E4DE]">
            <div className="lg:col-span-2 border-r border-[#E8E4DE]">
              {TREATMENTS.map((t, i) => {
                const Icon = t.icon
                return (
                  <button key={t.id} onClick={() => setActiveTreatment(i)}
                    className={`w-full text-left p-5 border-b border-[#E8E4DE] last:border-b-0 flex items-center gap-4 transition-all duration-200 cursor-pointer group ${activeTreatment === i ? "bg-[#181410] text-[#FAFAF8]" : "hover:bg-[#F0EDE8]"}`}>
                    <div className={`w-9 h-9 flex items-center justify-center flex-shrink-0 ${activeTreatment === i ? "text-[#3A8080]" : "text-[#3A8080]"}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className={`text-sm font-medium ${activeTreatment === i ? "text-[#FAFAF8]" : "text-[#181410]"}`}>{t.label}</div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ml-auto transition-colors ${activeTreatment === i ? "text-[#3A8080]" : "text-[#3A8080] opacity-0 group-hover:opacity-100"}`} />
                  </button>
                )
              })}
            </div>

            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div key={activeTreatment} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                  className="p-8 md:p-12">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 border border-[#3A8080] flex items-center justify-center">
                      <ActiveIcon className="w-6 h-6 text-[#3A8080]" />
                    </div>
                    <div className="flex gap-4 text-xs">
                      <span className="bg-[#EEF4F4] text-[#3A8080] px-3 py-1.5 flex items-center gap-1.5"><Clock className="w-3 h-3" />{TREATMENTS[activeTreatment].duration}</span>
                      <span className="bg-[#EEF4F4] text-[#3A8080] px-3 py-1.5">Résultats : {TREATMENTS[activeTreatment].results}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {TREATMENTS[activeTreatment].title}
                  </h3>
                  <p className="text-[#6B6560] leading-relaxed mb-8">{TREATMENTS[activeTreatment].desc}</p>
                  <div className="space-y-3">
                    <p className="text-xs tracking-[0.2em] uppercase text-[#3A8080] mb-4">Indications traitées</p>
                    {TREATMENTS[activeTreatment].detail.map(d => (
                      <div key={d} className="flex items-center gap-3 text-sm">
                        <CheckCircle className="w-4 h-4 text-[#3A8080] flex-shrink-0" />
                        <span className="text-[#3A3028]">{d}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="#contact" className="mt-10 inline-flex items-center gap-2 text-sm text-[#3A8080] border-b border-[#3A8080] pb-0.5 hover:text-[#181410] hover:border-[#181410] transition-colors cursor-pointer">
                    Prendre rendez-vous <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors */}
      <section id="praticiens" className="py-28 bg-[#F0EDE8]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-14">
            <Reveal>
              <p className="text-xs tracking-[0.25em] uppercase text-[#3A8080] mb-4">L&apos;équipe médicale</p>
              <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Nos <em>praticiens</em>
              </h2>
            </Reveal>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {DOCTORS.map((doc, i) => (
              <Reveal key={doc.name} delay={i * 0.1}>
                <div className="bg-[#FAFAF8] group">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={doc.image} alt={doc.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale" />
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#3A8080] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-light mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{doc.name}</h3>
                    <p className="text-[#3A8080] text-xs tracking-wide uppercase mb-3">{doc.spec}</p>
                    <p className="text-xs text-[#8A8278] mb-1">{doc.diploma}</p>
                    <p className="text-xs text-[#8A8278]">{doc.exp}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Science pillars */}
      <section id="science" className="py-28 bg-[#181410] text-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 mb-16">
            <Reveal>
              <p className="text-xs tracking-[0.25em] uppercase text-[#3A8080] mb-4">Notre approche scientifique</p>
              <h2 className="text-4xl md:text-5xl font-light leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                La rigueur médicale<br />au service de<br /><em>l&apos;esthétique</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-[#8A8278] leading-relaxed mt-8 md:mt-0">
                Nous refusons les traitements « tendance » sans fondement clinique. Chaque technique que nous pratiquons est validée par la communauté scientifique internationale. Notre réputation repose sur des résultats durables, pas sur des promesses.
              </p>
            </Reveal>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#3A3020]">
            {SCIENCE.map((s, i) => {
              const Icon = s.icon
              return (
                <Reveal key={s.title} delay={i * 0.08}>
                  <div className="bg-[#181410] p-8 group hover:bg-[#231E14] transition-colors duration-300">
                    <div className="w-10 h-10 border border-[#3A8080] flex items-center justify-center mb-6 group-hover:bg-[#3A8080] transition-colors duration-300">
                      <Icon className="w-5 h-5 text-[#3A8080] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-lg font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.title}</h3>
                    <p className="text-sm text-[#8A8278] leading-relaxed">{s.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-28 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-xs tracking-[0.25em] uppercase text-[#3A8080] mb-4 text-center">Témoignages patients</p>
            <h2 className="text-4xl font-light text-center mb-16" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Des résultats qui <em>parlent</em>
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Claire M.", age: "47 ans", treatment: "Toxine botulique + AH", text: "J'appréhendais depuis des années. Le Dr. Marchand a pris le temps de m'expliquer chaque geste. Le résultat est exactement ce que je voulais : naturel. On ne voit pas que j'ai été traitée, on dit seulement que j'ai l'air reposée.", stars: 5 },
              { name: "Sophie L.", age: "38 ans", treatment: "Laser pigmentaire", text: "Trois séances pour des taches que j'avais depuis ma grossesse. Le Dr. Faure a été d'une précision chirurgicale. Six mois plus tard, les taches ont complètement disparu. Incroyable.", stars: 5 },
              { name: "Marie-Anne P.", age: "54 ans", treatment: "Fils tenseurs PDO", text: "L'ovale de mon visage s'était relâché après une perte de poids. Les fils ont repositionné les tissus de manière subtile. Résultat progressif sur 3 mois, naturel et durable. Je recommande sans réserve.", stars: 5 },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <div className="bg-[#F0EDE8] p-8">
                  <div className="flex gap-1 mb-5">
                    {[...Array(t.stars)].map((_, i) => (
                      <div key={i} className="w-3 h-3 bg-[#C9A86C] rounded-full" />
                    ))}
                  </div>
                  <p className="text-[#3A3028] leading-relaxed mb-8 italic" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px" }}>
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div>
                    <div className="font-medium text-sm">{t.name} · {t.age}</div>
                    <div className="text-xs text-[#8A8278] mt-0.5">{t.treatment}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section className="py-24 bg-[#F0EDE8]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-xs tracking-[0.25em] uppercase text-[#3A8080] mb-4">Honoraires</p>
            <h2 className="text-3xl font-light mb-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Transparence tarifaire
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border border-[#D8D0C8]">
            {[
              { label: "Consultation médicale initiale", price: "80 €", note: "Offerte si traitement réalisé le jour même" },
              { label: "Toxine botulique — 1 zone", price: "À partir de 180 €", note: "3 zones : à partir de 420 €" },
              { label: "Acide hyaluronique — 1 ml", price: "À partir de 350 €", note: "Tarif variable selon zone et produit" },
              { label: "Séance laser pigmentaire", price: "À partir de 150 €", note: "Forfait 3 séances disponible (−15%)" },
              { label: "Skinbooster — séance", price: "À partir de 380 €", note: "Protocole 3 séances recommandé" },
              { label: "Fils tenseurs PDO", price: "À partir de 900 €", note: "Selon nombre de fils et zone" },
            ].map((tarif, i) => (
              <Reveal key={tarif.label} delay={i * 0.05}>
                <div className="bg-[#FAFAF8] p-6 border-b border-r border-[#D8D0C8] last:border-r-0">
                  <div className="text-sm font-medium mb-2">{tarif.label}</div>
                  <div className="text-lg font-light text-[#3A8080] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{tarif.price}</div>
                  <div className="text-xs text-[#8A8278]">{tarif.note}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <p className="text-xs text-[#8A8278] mt-6">* Les honoraires sont fixés après consultation médicale individuelle. Devis détaillé remis systématiquement avant tout acte.</p>
          </Reveal>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-28 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <Reveal>
                <p className="text-xs tracking-[0.25em] uppercase text-[#3A8080] mb-4">Rendez-vous</p>
                <h2 className="text-4xl md:text-5xl font-light leading-tight mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Prenez rendez-vous<br />pour une consultation<br /><em>médicale</em>
                </h2>
                <p className="text-[#6B6560] leading-relaxed mb-10">
                  La première consultation (30 min) est un bilan médical complet. Aucun geste n&apos;est pratiqué sans votre accord éclairé. Nous pouvons réaliser les soins le même jour si vous le souhaitez.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="space-y-5">
                  {[{ Icon: MapPin, text: "24 avenue de la Grande Armée, 75017 Paris" }, { Icon: Phone, text: "+33 1 45 72 98 30" }, { Icon: Mail, text: "rdv@lumiere-clinic.fr" }, { Icon: Clock, text: "Lun–Ven 9h–19h · Sam 9h–14h" }].map(({ Icon, text }) => (
                    <div key={text} className="flex items-center gap-4 text-sm text-[#6B6560]">
                      <Icon className="w-4 h-4 text-[#3A8080] flex-shrink-0" />
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
                      <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-2">{f}</label>
                      <input className="w-full bg-transparent border border-[#D8D0C8] px-4 py-3 text-sm focus:outline-none focus:border-[#181410] transition-colors" placeholder={f} />
                    </div>
                  ))}
                </div>
                {[["Email", "email", "votre@email.fr"], ["Téléphone", "tel", "+33 6..."]].map(([label, type, ph]) => (
                  <div key={label}>
                    <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-2">{label}</label>
                    <input type={type} className="w-full bg-transparent border border-[#D8D0C8] px-4 py-3 text-sm focus:outline-none focus:border-[#181410] transition-colors" placeholder={ph} />
                  </div>
                ))}
                <div>
                  <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-2">Traitement souhaité</label>
                  <select className="w-full bg-[#FAFAF8] border border-[#D8D0C8] px-4 py-3 text-sm focus:outline-none focus:border-[#181410] transition-colors">
                    <option>Consultation initiale (bilan complet)</option>
                    {TREATMENTS.map(t => <option key={t.id}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-[#8A8278] mb-2">Message (optionnel)</label>
                  <textarea rows={3} className="w-full bg-transparent border border-[#D8D0C8] px-4 py-3 text-sm focus:outline-none focus:border-[#181410] transition-colors resize-none" placeholder="Précisions sur votre demande..." />
                </div>
                <button type="submit" className="w-full bg-[#181410] text-[#FAFAF8] py-4 text-xs tracking-widest uppercase hover:bg-[#3A8080] transition-colors duration-300 cursor-pointer">
                  Demander un rendez-vous
                </button>
                <p className="text-xs text-[#8A8278] text-center">Nous vous rappelons sous 24h pour confirmer le créneau.</p>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0E0A06] text-[#6B6560] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="text-[#FAFAF8] text-xl font-light mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Lumière Clinic</div>
              <div className="text-[#3A8080] text-xs tracking-widest uppercase mb-4">Médecine esthétique médicale</div>
              <p className="text-sm leading-relaxed max-w-xs">Rigueur médicale, résultats naturels. Traitements validés cliniquement, pratiqués par des médecins diplômés.</p>
            </div>
            <div>
              <p className="text-[#FAFAF8] text-xs tracking-widest uppercase mb-5">Navigation</p>
              {["Traitements", "Praticiens", "Science", "Contact"].map(l => (
                <Link key={l} href={`#${l.toLowerCase()}`} className="block text-sm hover:text-[#FAFAF8] mb-3 transition-colors cursor-pointer">{l}</Link>
              ))}
            </div>
            <div>
              <p className="text-[#FAFAF8] text-xs tracking-widest uppercase mb-5">Contact</p>
              <p className="text-sm mb-2">24 av. de la Grande Armée</p>
              <p className="text-sm mb-2">75017 Paris</p>
              <p className="text-sm mb-2">+33 1 45 72 98 30</p>
              <p className="text-sm text-[#3A8080] mt-4 text-xs">Lun–Ven 9h–19h · Sam 9h–14h</p>
            </div>
          </div>
          <div className="pt-8 border-t border-[#2A1E12] flex flex-col md:flex-row justify-between gap-4 text-xs">
            <span>© 2024 Lumière Clinic — Tous droits réservés · Ordre National des Médecins</span>
            <div className="flex gap-6">
              {["Mentions légales", "Politique de confidentialité", "RGPD"].map(l => (
                <Link key={l} href="#" className="hover:text-[#FAFAF8] transition-colors cursor-pointer">{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
