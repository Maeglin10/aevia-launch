"use client"

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { ArrowRight, Heart, ChevronLeft, ChevronRight, Star, Leaf, Droplets, Wind } from "lucide-react"

function useFonts() {
  useEffect(() => {
    if (document.getElementById("impact-26-fonts")) return
    const style = document.createElement("style")
    style.id = "impact-26-fonts"
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500&display=swap');`
    document.head.appendChild(style)
  }, [])
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const fragrances = [
  {
    name: "Nuit Absolue",
    desc: "Oud noir, rose de Turquie, ambre gris",
    family: "Oriental",
    ml: "50ml",
    price: "€285",
    img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=600&fit=crop&crop=center",
    notes: ["Oud", "Rose", "Ambre"],
  },
  {
    name: "Aube Dorée",
    desc: "Bergamote italienne, jasmin sambac, santal blanc",
    family: "Floral",
    ml: "50ml",
    price: "€245",
    img: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=600&fit=crop&crop=center",
    notes: ["Bergamote", "Jasmin", "Santal"],
  },
  {
    name: "Brume Sauvage",
    desc: "Cèdre de l'Atlas, vétiver fumé, mousse de chêne",
    family: "Boisé",
    ml: "50ml",
    price: "€265",
    img: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&h=600&fit=crop&crop=center",
    notes: ["Cèdre", "Vétiver", "Mousse"],
  },
  {
    name: "Lumière Claire",
    desc: "Fleur d'oranger, musc blanc, poivre rose",
    family: "Frais",
    ml: "50ml",
    price: "€225",
    img: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=400&h=600&fit=crop&crop=center",
    notes: ["Oranger", "Musc", "Poivre"],
  },
]

const testimonials = [
  { text: "Un parfum qui raconte une histoire. Nuit Absolue est devenu mon identité olfactive.", name: "Camille R.", location: "Paris" },
  { text: "La qualité des matières premières est incomparable. Je ne peux plus porter autre chose.", name: "Thomas V.", location: "Lyon" },
  { text: "Éther comprend ce que la parfumerie de niche devrait être — art, pas commerce.", name: "Isabelle M.", location: "Bordeaux" },
]

export default function Impact26() {
  useFonts()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, -80])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const [activeFragrance, setActiveFragrance] = useState(0)
  const [wishlist, setWishlist] = useState<Set<number>>(new Set())
  const [testimonialIdx, setTestimonialIdx] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx(i => (i + 1) % testimonials.length), 4000)
    return () => clearInterval(t)
  }, [])

  const toggleWishlist = (i: number) => {
    setWishlist(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#1A0F1E] text-[#F5EDE8]" style={{ fontFamily: "'Jost', sans-serif" }}>
      <motion.div
        className="fixed top-0 left-0 right-0 h-px bg-[#C9956A] origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#1A0F1E]/90 backdrop-blur-md border-b border-[#C9956A]/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl tracking-[0.3em] uppercase" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
            Éther
          </div>
          <div className="hidden md:flex items-center gap-10 text-xs tracking-widest uppercase text-[#F5EDE8]/50">
            <a href="#collection" className="hover:text-[#C9956A] transition-colors cursor-pointer">Collection</a>
            <a href="#maison" className="hover:text-[#C9956A] transition-colors cursor-pointer">La Maison</a>
            <a href="#savoir-faire" className="hover:text-[#C9956A] transition-colors cursor-pointer">Savoir-Faire</a>
            <a href="#contact" className="hover:text-[#C9956A] transition-colors cursor-pointer">Contact</a>
          </div>
          <a href="#collection" className="hidden md:block border border-[#C9956A]/50 text-[#C9956A] text-xs tracking-widest uppercase px-6 py-2.5 hover:bg-[#C9956A]/10 transition-colors cursor-pointer">
            Commander
          </a>
          <button className="md:hidden p-2 cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <div className="w-5 h-px bg-[#F5EDE8] mb-1.5" />
            <div className="w-5 h-px bg-[#F5EDE8] mb-1.5" />
            <div className="w-5 h-px bg-[#F5EDE8]" />
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-[#C9956A]/10"
            >
              <div className="px-6 py-4 flex flex-col gap-4 text-xs tracking-widest uppercase text-[#F5EDE8]/60">
                {["Collection", "La Maison", "Savoir-Faire", "Contact"].map(item => (
                  <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} onClick={() => setMenuOpen(false)} className="hover:text-[#C9956A] transition-colors cursor-pointer">{item}</a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-end relative overflow-hidden pt-20">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=1600&h=900&fit=crop&crop=center"
            alt="Éther Parfums"
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F1E] via-[#1A0F1E]/60 to-transparent" />
        </motion.div>
        <div className="relative max-w-6xl mx-auto px-6 pb-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[#C9956A] text-xs tracking-[0.4em] uppercase mb-6"
          >
            Parfumerie de Niche · Paris
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="text-6xl md:text-9xl leading-[0.9] mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
          >
            L'art du<br />
            <em>invisible.</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[#F5EDE8]/60 text-lg max-w-xl mb-10 leading-relaxed"
          >
            Chaque flacon est une œuvre. Chaque note, une promesse. Éther compose des parfums pour ceux qui refusent l'ordinaire.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex items-center gap-6"
          >
            <a href="#collection" className="bg-[#C9956A] text-[#1A0F1E] text-xs tracking-widest uppercase px-8 py-4 font-medium hover:bg-[#D9A57A] transition-colors flex items-center gap-3 cursor-pointer">
              Découvrir la collection <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#savoir-faire" className="text-[#C9956A] text-xs tracking-widest uppercase border-b border-[#C9956A]/40 pb-0.5 hover:border-[#C9956A] transition-colors cursor-pointer">
              Notre histoire
            </a>
          </motion.div>
        </div>
      </section>

      {/* Collection */}
      <section id="collection" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-16">
            <p className="text-[#C9956A] text-xs tracking-[0.4em] uppercase mb-4">Collection 2026</p>
            <h2 className="text-5xl md:text-6xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
              Quatre essences,<br /><em>un monde.</em>
            </h2>
          </Reveal>

          {/* Main feature */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <Reveal>
              <div className="relative group cursor-pointer">
                <div className="overflow-hidden aspect-[3/4] rounded-sm">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFragrance}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.6 }}
                      className="w-full h-full"
                    >
                      <Image
                        src={fragrances[activeFragrance].img}
                        alt={fragrances[activeFragrance].name}
                        width={400}
                        height={600}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <button
                  onClick={() => toggleWishlist(activeFragrance)}
                  className="absolute top-4 right-4 w-10 h-10 bg-[#1A0F1E]/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 transition-colors ${wishlist.has(activeFragrance) ? "fill-[#C9956A] text-[#C9956A]" : "text-[#F5EDE8]/60"}`} />
                </button>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div>
                <div className="text-[#C9956A] text-xs tracking-widest uppercase mb-3">{fragrances[activeFragrance].family}</div>
                <h3 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
                  {fragrances[activeFragrance].name}
                </h3>
                <p className="text-[#F5EDE8]/60 italic text-lg mb-8 leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {fragrances[activeFragrance].desc}
                </p>
                <div className="flex gap-3 mb-8">
                  {fragrances[activeFragrance].notes.map(note => (
                    <span key={note} className="border border-[#C9956A]/30 text-[#C9956A] text-xs tracking-widest uppercase px-4 py-2">
                      {note}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="text-3xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{fragrances[activeFragrance].price}</div>
                    <div className="text-[#F5EDE8]/40 text-xs tracking-widest">{fragrances[activeFragrance].ml} · Eau de Parfum</div>
                  </div>
                  <button className="bg-[#C9956A] text-[#1A0F1E] text-xs tracking-widest uppercase px-8 py-3 hover:bg-[#D9A57A] transition-colors cursor-pointer">
                    Ajouter au panier
                  </button>
                </div>
                {/* Thumbnails */}
                <div className="flex gap-3">
                  {fragrances.map((f, i) => (
                    <button
                      key={f.name}
                      onClick={() => setActiveFragrance(i)}
                      className={`w-16 h-20 overflow-hidden rounded-sm transition-all cursor-pointer ${activeFragrance === i ? "ring-1 ring-[#C9956A]" : "opacity-40 hover:opacity-70"}`}
                    >
                      <Image src={f.img} alt={f.name} width={64} height={80} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* La Maison */}
      <section id="maison" className="py-24 px-6 bg-[#150C18]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <Reveal delay={0.1}>
              <div className="relative">
                <div className="aspect-[4/5] overflow-hidden rounded-sm">
                  <Image
                    src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=750&fit=crop&crop=center"
                    alt="Atelier Éther"
                    width={600}
                    height={750}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-6 left-6 bg-[#1A0F1E]/90 backdrop-blur-sm border border-[#C9956A]/20 p-6">
                  <div className="text-3xl text-[#C9956A]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>1987</div>
                  <div className="text-[#F5EDE8]/50 text-xs tracking-widest uppercase mt-1">Fondé à Paris</div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div>
                <p className="text-[#C9956A] text-xs tracking-[0.4em] uppercase mb-6">La Maison Éther</p>
                <h2 className="text-4xl md:text-5xl mb-8 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
                  Trente-sept ans de<br /><em>création olfactive.</em>
                </h2>
                <div className="space-y-6 text-[#F5EDE8]/60 leading-relaxed">
                  <p>Éther est née d'une conviction : que le parfum est le dernier art intime. Fondée en 1987 par la nez Hélène Varenne, notre maison n'a jamais renoncé à l'exigence absolue.</p>
                  <p>Chaque fragrance est composée dans notre atelier du Marais, avec des matières premières sourcing directement auprès des producteurs — fleurs de Grasse, oud du Camboge, résines d'Éthiopie.</p>
                </div>
                <div className="grid grid-cols-3 gap-6 mt-10">
                  {[
                    { icon: <Leaf className="w-5 h-5" />, label: "Ingrédients naturels", val: "93%" },
                    { icon: <Droplets className="w-5 h-5" />, label: "Concentrés parfum", val: "25–30%" },
                    { icon: <Wind className="w-5 h-5" />, label: "Tenue garantie", val: "12h+" },
                  ].map(({ icon, label, val }) => (
                    <div key={label} className="border-t border-[#C9956A]/20 pt-4">
                      <div className="text-[#C9956A] mb-2">{icon}</div>
                      <div className="text-2xl text-[#F5EDE8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{val}</div>
                      <div className="text-[#F5EDE8]/40 text-xs mt-1">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Savoir-faire */}
      <section id="savoir-faire" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-[#C9956A] text-xs tracking-[0.4em] uppercase mb-4">Savoir-Faire</p>
            <h2 className="text-4xl md:text-5xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
              Le processus de création
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Sourcing", desc: "Nous sélectionnons chaque ingrédient à la source, directement chez le producteur." },
              { step: "02", title: "Macération", desc: "Les matières reposent 6 à 8 semaines pour révéler leur plein potentiel aromatique." },
              { step: "03", title: "Composition", desc: "Notre nez assemble les accords, ajustant jusqu'à l'accord parfait — parfois 200 essais." },
              { step: "04", title: "Mise en flacon", desc: "Chaque flacon est rempli et cacheté à la main dans notre atelier parisien." },
            ].map((s, i) => (
              <Reveal key={s.step} delay={i * 0.1}>
                <div className="border-t border-[#C9956A]/20 pt-6">
                  <div className="text-[#C9956A]/30 text-4xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.step}</div>
                  <h3 className="text-xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.title}</h3>
                  <p className="text-[#F5EDE8]/50 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-[#150C18]">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <p className="text-[#C9956A] text-xs tracking-[0.4em] uppercase mb-12">Ils portent Éther</p>
            <div className="relative min-h-[180px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIdx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                >
                  <div className="flex justify-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C9956A] text-[#C9956A]" />
                    ))}
                  </div>
                  <p className="text-2xl leading-relaxed text-[#F5EDE8]/80 italic mb-8" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
                    "{testimonials[testimonialIdx].text}"
                  </p>
                  <div className="text-sm tracking-widest uppercase text-[#F5EDE8]/50">
                    {testimonials[testimonialIdx].name} · {testimonials[testimonialIdx].location}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  className={`transition-all cursor-pointer ${testimonialIdx === i ? "w-8 h-0.5 bg-[#C9956A]" : "w-2 h-0.5 bg-[#C9956A]/30 hover:bg-[#C9956A]/60"}`}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <p className="text-[#C9956A] text-xs tracking-[0.4em] uppercase mb-6">Commander</p>
            <h2 className="text-5xl md:text-7xl mb-8 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
              Votre parfum<br /><em>vous attend.</em>
            </h2>
            <p className="text-[#F5EDE8]/50 text-lg mb-12 max-w-lg mx-auto">
              Livraison mondiale. Emballage cadeau offert. Retours sous 30 jours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#collection" className="bg-[#C9956A] text-[#1A0F1E] text-xs tracking-widest uppercase px-10 py-4 font-medium hover:bg-[#D9A57A] transition-colors cursor-pointer">
                Explorer la collection
              </a>
              <a href="mailto:contact@ether-parfums.com" className="border border-[#C9956A]/40 text-[#C9956A] text-xs tracking-widest uppercase px-10 py-4 hover:border-[#C9956A] hover:bg-[#C9956A]/5 transition-colors cursor-pointer">
                Nous contacter
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#C9956A]/10 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xl tracking-[0.3em] uppercase" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
            Éther
          </div>
          <div className="flex gap-8 text-xs tracking-widest uppercase text-[#F5EDE8]/30">
            {["Collection", "La Maison", "Savoir-Faire", "Mentions Légales"].map(l => (
              <a key={l} href="#" className="hover:text-[#C9956A] transition-colors cursor-pointer">{l}</a>
            ))}
          </div>
          <p className="text-[#F5EDE8]/20 text-xs tracking-widest">© 2026 Éther Parfums, Paris</p>
        </div>
      </footer>
    </div>
  )
}
