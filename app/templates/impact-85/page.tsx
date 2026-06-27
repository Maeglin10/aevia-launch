"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, ArrowRight, FlaskConical, Microscope, Leaf, Shield, Star, ChevronRight, Search, Mail, Phone, MapPin } from "lucide-react"

function useFonts() {
  useEffect(() => {
    const id = "fonts-aether-labs"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id = id
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500&display=swap');`
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

const PRODUCTS = [
  { id: "serum", name: "Luminos Sérum", tagline: "L'essence luminosité", desc: "Complexe Vita-C 15% encapsulé, niacinamide 5%, acide férulique et Bakuchiol certifié. La formule anti-âge cliniquement prouvée.", price: "148 €", volume: "30 ml", score: 98, image: "https://images.unsplash.com/photo-1556228852-6d35a585d566?w=600&q=80", badges: ["Cliniquement testé", "Végan"] },
  { id: "moisture", name: "Cellulaire Crème", tagline: "Régénération nocturne", desc: "Rétinol 0,5% encapsulé, peptides de cuivre EGF-like, céramides NP et probiotiques lactobacillus. Régénération intensive nocturne.", price: "124 €", volume: "50 ml", score: 96, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80", badges: ["Dermatologiquement testé", "Sans parfum"] },
  { id: "mask", name: "Kaolin Masque", tagline: "Pureté enzymatique", desc: "Kaolin, enzymes de papaye et ananas, zinc PCA et acide salicylique 1%. Purification douce et régulation du sébum.", price: "68 €", volume: "75 ml", score: 94, image: "https://images.unsplash.com/photo-1585651374645-5f2b87d06a5e?w=600&q=80", badges: ["Naturel", "Sensory"] },
  { id: "protect", name: "Photon SPF 50+", tagline: "Protection ultime", desc: "SPF 50+ UVA/UVB, filtres minéraux nano, niacinamide 4%, vitamine E. Fini invisible, compatible sous le maquillage.", price: "58 €", volume: "50 ml", score: 99, image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80", badges: ["SPF 50+", "Reef safe"] },
]

const INGREDIENTS = [
  { name: "Vita-C encapsulé", origin: "Synthèse biotechnologique", icon: FlaskConical, desc: "Vitamine C stable à 15%, délivrée en microcapsules pour une efficacité maximale et une oxydation nulle." },
  { name: "Bakuchiol certifié", origin: "Psoralea corylifolia · Inde", icon: Leaf, desc: "Alternative botanique au rétinol cliniquement prouvée. Anti-âge sans irritation, compatible grossesse." },
  { name: "Peptides EGF-like", origin: "Biotechnologie blanc", icon: Microscope, desc: "Séquences peptidiques mimant le facteur de croissance épidermique pour stimuler la synthèse de collagène." },
  { name: "Probiotiques lactobacillus", origin: "Fermentation contrôlée", icon: Shield, desc: "Microbiome skin-safe. Renforcement de la barrière cutanée et réduction de l'inflammation de bas grade." },
]

const FAQS = [
  { q: "Vos produits sont-ils adaptés aux peaux très sensibles ?", a: "Oui. Toutes nos formules sont testées sous contrôle dermatologique et exemptes d'huiles essentielles irritantes, de silicones et de parfums de synthèse pour minimiser les risques d'allergies." },
  { q: "Qu'est-ce que la biotechnologie blanche utilisée dans vos soins ?", a: "La biotechnologie blanche utilise des micro-organismes vivants (comme des levures ou des bactéries) pour synthétiser des actifs hautement performants de manière durable, comme nos peptides EGF-like ou l'acide hyaluronique." },
  { q: "Vos soins sont-ils certifiés biologiques ou véganes ?", a: "Oui, nos produits respectent la charte COSMOS Natural. De plus, toutes nos formules sont certifiées 100% véganes par la Vegan Society et certifiées Cruelty-Free par la PETA." },
  { q: "Combien de temps faut-il pour voir des résultats sur ma peau ?", a: "Les premiers résultats sur l'hydratation et l'éclat sont visibles dès 7 à 10 jours. Pour les taches pigmentaires et la fermeté (renouvellement cellulaire), une utilisation constante pendant 4 à 6 semaines est recommandée." },
  { q: "Quelle est votre politique de livraison et de retour ?", a: "Nous livrons en France sous 48h (offerte dès 80 €). Si un produit ne convient pas à votre peau, vous disposez de 14 jours pour le retourner gratuitement et obtenir un remboursement complet." }
];

export default function AetherLabsPage() {
  useFonts()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeProduct, setActiveProduct] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [contactSubmitted, setContactSubmitted] = useState(false)
  const { scrollYProgress } = useScroll()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "25%"])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#1C1814]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 h-[2px] bg-[#8B7355] z-[1000] origin-left" style={{ scaleX: scrollYProgress }} />

      {/* Nav */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#F8F6F2]/95 backdrop-blur-md border-b border-[#E4DDD4]" : "bg-transparent"}`}
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="#contact" className="flex flex-col">
            <span className="text-xl font-light tracking-widest" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.15em" }}>Aether Labs</span>
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#8B7355]">Cosmétique scientifique</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-light text-[#6B5A40]">
            {["Formules", "Science", "Rituels", "Journal", "FAQ", "Contact"].map(l => (
              <Link key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#1C1814] transition-colors">{l}</Link>
            ))}
            <button className="cursor-pointer"><Search className="w-4 h-4 text-[#6B5A40] hover:text-[#1C1814] transition-colors" /></button>
            <Link href="#formules" className="ml-2 px-5 py-2.5 bg-[#1C1814] text-[#F8F6F2] text-xs tracking-widest uppercase hover:bg-[#8B7355] transition-colors cursor-pointer">
              Découvrir
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
          <motion.div className="fixed inset-0 z-[200] bg-[#F8F6F2] flex flex-col"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 280, damping: 28 }}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E4DDD4]">
              <span style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl">Aether Labs</span>
              <button onClick={() => setMenuOpen(false)} className="p-2 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col gap-8 p-10">
              {["Formules", "Science", "Rituels", "Journal", "FAQ", "Contact"].map((l, i) => (
                <motion.div key={l} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <Link href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                    className="text-3xl font-light hover:text-[#8B7355] transition-colors cursor-pointer"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>{l}</Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section id="hero" ref={heroRef} className="relative min-h-screen overflow-hidden grid md:grid-cols-2">
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 pt-28 pb-16 md:py-0">
          <Reveal>
            <p className="text-xs tracking-[0.3em] uppercase text-[#8B7355] mb-8">Laboratoire cosmétique — Grasse, France</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-[1.0] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              La peau<br />révélée par la<br /><em>science pure</em>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[#6B5A40] leading-relaxed max-w-md mb-10">
              Aether Labs formule des soins à l&apos;intersection de la chimie organique et de la cosmétique clinique. Chaque produit est développé en laboratoire, testé sous contrôle dermatologique.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex gap-5">
              <Link href="#formules" className="px-8 py-4 bg-[#1C1814] text-[#F8F6F2] text-xs tracking-widest uppercase hover:bg-[#8B7355] transition-colors cursor-pointer">
                Nos formules
              </Link>
              <Link href="#science" className="px-8 py-4 border border-[#D4C9B0] text-[#1C1814] text-xs tracking-widests uppercase hover:border-[#1C1814] transition-colors cursor-pointer">
                La science
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="flex items-center gap-10 mt-16 pt-10 border-t border-[#E4DDD4]">
              {[["12 ans", "De R&D"], ["0 parabène", "0 silicone"], ["Dermatologiquement", "Testé"]].map(([val, label]) => (
                <div key={val}>
                  <div className="text-xl font-light mb-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{val}</div>
                  <div className="text-xs text-[#8A7860]">{label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <div className="relative overflow-hidden min-h-[50vh] md:min-h-0">
          <motion.div className="absolute inset-0" style={{ y: heroY }}>
            <Image src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=85" alt="Aether Labs" fill className="object-cover" />
          </motion.div>
        </div>
      </section>

      {/* Products */}
      <section id="formules" className="py-28 bg-[#F8F6F2]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-14">
            <Reveal>
              <p className="text-xs tracking-[0.25em] uppercase text-[#8B7355] mb-4">Formules signatures</p>
              <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                La collection <em>Aether</em>
              </h2>
            </Reveal>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 border border-[#E4DDD4] mb-12 overflow-x-auto">
            {PRODUCTS.map((p, i) => (
              <button key={p.id} onClick={() => setActiveProduct(i)}
                className={`flex-1 min-w-[140px] px-6 py-4 text-xs tracking-widests uppercase border-r border-[#E4DDD4] last:border-r-0 transition-all duration-200 cursor-pointer whitespace-nowrap ${activeProduct === i ? "bg-[#1C1814] text-[#F8F6F2]" : "hover:bg-[#F0EBE0] text-[#6B5A40]"}`}>
                {p.name}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeProduct} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}
              className="grid md:grid-cols-2 gap-16 items-center">
              <div className="relative aspect-square overflow-hidden bg-[#F0EBE0]">
                <Image src={PRODUCTS[activeProduct].image} alt={PRODUCTS[activeProduct].name} fill className="object-cover" />
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {PRODUCTS[activeProduct].badges.map(b => (
                    <span key={b} className="bg-[#F8F6F2]/90 backdrop-blur-sm text-[#1C1814] text-[10px] tracking-widests uppercase px-2.5 py-1">{b}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[#8B7355] mb-3">{PRODUCTS[activeProduct].tagline}</p>
                <h3 className="text-3xl font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{PRODUCTS[activeProduct].name}</h3>
                <p className="text-[#6B5A40] leading-relaxed mb-6">{PRODUCTS[activeProduct].desc}</p>
                <div className="flex items-center gap-6 mb-8 p-4 bg-[#F0EBE0]">
                  <div>
                    <div className="text-2xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{PRODUCTS[activeProduct].score}<span className="text-base text-[#8B7355]">/100</span></div>
                    <div className="text-xs text-[#8A7860]">Score formule INCI</div>
                  </div>
                  <div className="h-12 w-[1px] bg-[#D4C9B0]" />
                  <div>
                    <div className="text-2xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{PRODUCTS[activeProduct].volume}</div>
                    <div className="text-xs text-[#8A7860]">Contenance</div>
                  </div>
                  <div className="h-12 w-[1px] bg-[#D4C9B0]" />
                  <div>
                    <div className="text-2xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{PRODUCTS[activeProduct].price}</div>
                    <div className="text-xs text-[#8A7860]">Prix TTC</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="flex-1 py-4 bg-[#1C1814] text-[#F8F6F2] text-xs tracking-widests uppercase hover:bg-[#8B7355] transition-colors cursor-pointer">
                    Ajouter au panier
                  </button>
                  <button className="px-6 py-4 border border-[#E4DDD4] text-[#1C1814] text-xs tracking-widests uppercase hover:border-[#1C1814] transition-colors cursor-pointer">
                    Diagnostic peau
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Ingredients */}
      <section id="science" className="py-28 bg-[#1C1814] text-[#F8F6F2]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-20 mb-16">
            <Reveal>
              <p className="text-xs tracking-[0.25em] uppercase text-[#8B7355] mb-4">Ingrédients actifs</p>
              <h2 className="text-4xl md:text-5xl font-light leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                La transparence<br />comme <em>éthique</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-[#6B5A40] leading-relaxed mt-8 md:mt-0">
                Nous publions l&apos;origine de chaque ingrédient, sa concentration et les études cliniques qui le soutiennent. Notre liste INCI complète est disponible pour chaque produit.
              </p>
            </Reveal>
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-[#3A3020]">
            {INGREDIENTS.map((ing, i) => {
              const Icon = ing.icon
              return (
                <Reveal key={ing.name} delay={i * 0.08}>
                  <div className="bg-[#1C1814] p-8 group hover:bg-[#231E14] transition-colors duration-300">
                    <div className="flex items-start gap-5">
                      <div className="w-10 h-10 border border-[#3A3020] flex items-center justify-center flex-shrink-0 group-hover:border-[#8B7355] transition-colors duration-300">
                        <Icon className="w-5 h-5 text-[#8B7355]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-light mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{ing.name}</h3>
                        <p className="text-xs text-[#8B7355] mb-3">{ing.origin}</p>
                        <p className="text-sm text-[#6A6058] leading-relaxed">{ing.desc}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Ritual */}
      <section id="rituels" className="py-28 bg-[#F0EBE0]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-14">
            <Reveal>
              <p className="text-xs tracking-[0.25em] uppercase text-[#8B7355] mb-4">Protocole</p>
              <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Le rituel <em>Aether</em>
              </h2>
            </Reveal>
          </div>
          <div className="grid md:grid-cols-4 gap-px bg-[#D4C9B0]">
            {[
              { step: "01", time: "Matin", name: "Luminos Sérum", action: "2–3 gouttes en tapotant délicatement sur peau propre et humide" },
              { step: "02", time: "Matin", name: "Photon SPF 50+", action: "2,5 mg/cm² en couche uniforme sur visage et cou" },
              { step: "03", time: "Soir", name: "Cellulaire Crème", action: "Noisette en massage ascendant sur peau nettoyée" },
              { step: "04", time: "1× / semaine", name: "Kaolin Masque", action: "Couche épaisse 15 min, rincer à l'eau fraîche" },
            ].map((r, i) => (
              <Reveal key={r.step} delay={i * 0.08}>
                <div className="bg-[#F0EBE0] p-8 hover:bg-[#F8F6F2] transition-colors duration-300">
                  <div className="text-4xl font-light text-[#D4C9B0] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{r.step}</div>
                  <p className="text-xs tracking-widests uppercase text-[#8B7355] mb-2">{r.time}</p>
                  <h3 className="text-lg font-light mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{r.name}</h3>
                  <p className="text-sm text-[#6B5A40] leading-relaxed">{r.action}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#F8F6F2]">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-xs tracking-[0.25em] uppercase text-[#8B7355] mb-4 text-center">Témoignages</p>
            <h2 className="text-3xl font-light text-center mb-14" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Ce que la peau <em>nous dit</em>
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Claire M.", skin: "Peau mixte, 38 ans", text: "Le Luminos Sérum a effacé mes taches de grossesse en 6 semaines. J'ai essayé des dizaines de produits. Aucun n'avait été aussi précis.", rating: 5 },
              { name: "Anaïs B.", skin: "Peau sensible, 29 ans", text: "Le Bakuchiol était ma seule option rétinol-free. Les résultats en 4 semaines ont dépassé mes attentes. Et aucune irritation.", rating: 5 },
              { name: "Sophie T.", skin: "Peau mature, 52 ans", text: "La Cellulaire Crème a transformé la texture de ma peau. Ma dermatologue a demandé ce que j'utilisais. Elle commande maintenant pour sa clinique.", rating: 5 },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <div className="bg-[#F0EBE0] p-8">
                  <div className="flex gap-1 mb-5">
                    {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-[#8B7355] text-[#8B7355]" />)}
                  </div>
                  <p className="text-[#3A3028] leading-relaxed mb-5 italic" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "17px" }}>
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-[#8A7860] mt-0.5">{t.skin}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Journal */}
      <section id="journal" className="py-24 bg-[#F0EBE0]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-10">
            <Reveal>
              <p className="text-xs tracking-[0.25em] uppercase text-[#8B7355] mb-3">Le journal scientifique</p>
              <h2 className="text-3xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Nos dernières publications</h2>
            </Reveal>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { cat: "Ingrédients", title: "Le Bakuchiol : revue de la littérature scientifique 2020–2024", date: "Décembre 2024" },
              { cat: "Formulation", title: "pH optimal et stabilité des vitamines C dans les formules cosmétiques", date: "Octobre 2024" },
              { cat: "Microbiome", title: "Probiotiques topiques et fonction barrière cutanée : état de l'art", date: "Septembre 2024" },
            ].map((article, i) => (
              <Reveal key={article.title} delay={i * 0.08}>
                <div className="border border-[#D4C9B0] p-6 hover:border-[#8B7355] transition-colors duration-300 cursor-pointer group">
                  <p className="text-xs tracking-widests uppercase text-[#8B7355] mb-3">{article.cat}</p>
                  <h3 className="text-base font-light leading-snug mb-4 group-hover:text-[#8B7355] transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {article.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-[#8A7860]">
                    <span>{article.date}</span>
                    <ArrowRight className="w-4 h-4 text-[#8B7355] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-[#F8F6F2] border-t border-[#E4DDD4]">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <p className="text-xs tracking-[0.25em] uppercase text-[#8B7355] mb-4 text-center">Foire aux questions</p>
            <h2 className="text-3xl md:text-4xl font-light text-center mb-16" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Questions <em>fréquentes</em>
            </h2>
          </Reveal>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="border-b border-[#E4DDD4] pb-4">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between text-left py-4 text-[#1C1814] font-light hover:text-[#8B7355] transition-colors focus:outline-none cursor-pointer"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px" }}
                  >
                    <span>{faq.q}</span>
                    <span className="text-xs transform transition-transform duration-300 ml-4">
                      {openFaq === i ? "—" : "+"}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-[#6B5A40] leading-relaxed pb-4">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-[#1C1814] text-[#F8F6F2] text-center px-6">
        <Reveal>
          <p className="text-xs tracking-[0.25em] uppercase text-[#8B7355] mb-4">Laboratoire ouvert</p>
          <h2 className="text-3xl font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Restez informés de nos <em>recherches</em>
          </h2>
          <p className="text-[#6A6058] text-sm mb-8 max-w-md mx-auto">Formulations exclusives, études cliniques, nouveaux actifs. Notre lettre mensuelle sans compromis.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Votre email" className="flex-1 bg-transparent border border-[#3A3020] px-5 py-3.5 text-sm text-[#F8F6F2] focus:outline-none focus:border-[#8B7355] transition-colors" />
            <button type="submit" className="px-8 py-3.5 bg-[#8B7355] text-[#F8F6F2] text-xs tracking-widests uppercase hover:bg-[#A08B6A] transition-colors cursor-pointer">
              Suivre
            </button>
          </form>
        </Reveal>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-[#F0EBE0] border-t border-[#E4DDD4]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <Reveal>
              <p className="text-xs tracking-[0.25em] uppercase text-[#8B7355] mb-4">Contact</p>
              <h2 className="text-4xl font-light mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Prendre <em>contact</em>
              </h2>
              <p className="text-[#6B5A40] leading-relaxed mb-8 text-sm">
                Vous avez des questions sur nos formulations, besoin d'un diagnostic peau sur-mesure ou d'informations sur votre commande ? Notre équipe scientifique vous répond sous 24h.
              </p>
              <div className="space-y-6 text-sm text-[#6B5A40]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-[#D4C9B0] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#8B7355]" />
                  </div>
                  <div>
                    <div className="text-xs text-[#8A7860] uppercase tracking-wider">Email</div>
                    <a href="mailto:contact@aetherlabs.fr" className="text-[#1C1814] hover:underline">contact@aetherlabs.fr</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-[#D4C9B0] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#8B7355]" />
                  </div>
                  <div>
                    <div className="text-xs text-[#8A7860] uppercase tracking-wider">Téléphone</div>
                    <a href="tel:+33493000000" className="text-[#1C1814] hover:underline">+33 4 93 00 00 00</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-[#D4C9B0] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#8B7355]" />
                  </div>
                  <div>
                    <div className="text-xs text-[#8A7860] uppercase tracking-wider">Laboratoire</div>
                    <span className="text-[#1C1814]">12 Route de Cannes, 06130 Grasse, France</span>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="bg-[#F8F6F2] p-8 border border-[#E4DDD4]">
                {contactSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border border-[#8B7355] flex items-center justify-center mx-auto mb-6">
                      <span className="text-[#8B7355] text-lg font-light">✓</span>
                    </div>
                    <h3 className="text-2xl font-light mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Message envoyé</h3>
                    <p className="text-[#6B5A40] text-sm leading-relaxed max-w-xs mx-auto text-center">
                      Merci, nous vous répondrons sous 24h.
                    </p>
                    <button
                      onClick={() => setContactSubmitted(false)}
                      className="mt-8 px-6 py-2.5 bg-[#1C1814] text-[#F8F6F2] text-xs tracking-widest uppercase hover:bg-[#8B7355] transition-colors cursor-pointer"
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
                  >
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#8A7860] mb-2" htmlFor="c-nom">Nom complet</label>
                      <input
                        id="c-nom"
                        type="text"
                        required
                        placeholder="Votre nom"
                        className="w-full bg-transparent border-b border-[#D4C9B0] py-3 text-[#1C1814] outline-none focus:border-[#8B7355] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#8A7860] mb-2" htmlFor="c-email">Email</label>
                      <input
                        id="c-email"
                        type="email"
                        required
                        placeholder="vous@email.com"
                        className="w-full bg-transparent border-b border-[#D4C9B0] py-3 text-[#1C1814] outline-none focus:border-[#8B7355] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#8A7860] mb-2" htmlFor="c-message">Message</label>
                      <textarea
                        id="c-message"
                        rows={4}
                        required
                        placeholder="Votre message..."
                        className="w-full bg-transparent border-b border-[#D4C9B0] py-3 text-[#1C1814] outline-none focus:border-[#8B7355] transition-colors resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-4 bg-[#1C1814] text-[#F8F6F2] text-xs tracking-widest uppercase hover:bg-[#8B7355] transition-colors cursor-pointer"
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

      {/* Footer */}
      <footer className="bg-[#0E0B08] text-[#5A5040] py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <div className="text-[#F8F6F2] text-xl font-light mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Aether Labs</div>
              <div className="text-xs text-[#8B7355] tracking-widests uppercase mb-4">Cosmétique scientifique · Grasse</div>
              <p className="text-sm leading-relaxed max-w-xs">Laboratoire fondé en 2012. Chaque formule est développée en interne, testée sous contrôle dermatologique et sourcée de façon éthique.</p>
            </div>
            <div>
              <p className="text-[#F8F6F2] text-xs tracking-widests uppercase mb-5">Navigation</p>
              {["Formules", "Science", "Rituels", "Journal", "FAQ", "Contact"].map(l => (
                <Link key={l} href={`#${l.toLowerCase()}`} className="block text-sm hover:text-[#F8F6F2] mb-3 transition-colors cursor-pointer">{l}</Link>
              ))}
            </div>
            <div>
              <p className="text-[#F8F6F2] text-xs tracking-widests uppercase mb-5">Certifications</p>
              {["COSMOS Natural", "Cruelty-free PETA", "Végan Society", "ISO 22716 GMP"].map(c => (
                <p key={c} className="text-sm mb-2">{c}</p>
              ))}
            </div>
          </div>
          <div className="pt-8 border-t border-[#1C1814] flex flex-col md:flex-row justify-between gap-4 text-xs">
            <span>© 2024 Aether Labs — Tous droits réservés</span>
            <div className="flex gap-6">
              {[
                { name: "Mentions légales", path: "/templates/impact-85/templates/impact-85/legal/mentions-legales" },
                { name: "CGU", path: "/templates/impact-85/templates/impact-85/legal/cgu" },
                { name: "Confidentialité", path: "/templates/impact-85/templates/impact-85/legal/confidentialite" }
              ].map(l => (
                <Link key={l.name} href={l.path} className="hover:text-[#F8F6F2] transition-colors cursor-pointer">{l.name}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
