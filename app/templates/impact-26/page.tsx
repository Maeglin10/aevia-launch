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

type ActivePage =
  | "home"
  | "collection"
  | "maison"
  | "savoir-faire"
  | "contact"
  | "mentions"
  | "cgv"
  | "privacy";

export default function Impact26() {
  useFonts()
  const [page, setPage] = useState<ActivePage>("home");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const goTo = (p: ActivePage) => {
    setPage(p);
    setSelectedProduct(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  };

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
    <div ref={containerRef} className="min-h-screen bg-[#1A0F1E] text-[#F5EDE8]" style={{ fontFamily: "'Jost', sans-serif", overflowX: "clip" }}>
      <motion.div
        className="fixed top-0 left-0 right-0 h-px bg-[#C9956A] origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#1A0F1E]/90 backdrop-blur-md border-b border-[#C9956A]/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div
            onClick={() => goTo("home")}
            className="text-2xl tracking-[0.3em] uppercase cursor-pointer"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
          >
            Éther
          </div>
          <div className="hidden md:flex items-center gap-10 text-xs tracking-widest uppercase text-[#F5EDE8]/50">
            <button
              onClick={() => goTo("collection")}
              className="hover:text-[#C9956A] transition-colors cursor-pointer text-[#F5EDE8]/50 text-xs tracking-widest uppercase"
              style={{ background: "none", border: "none", fontFamily: "'Jost', sans-serif", padding: 0 }}
            >
              Collection
            </button>
            <button
              onClick={() => goTo("maison")}
              className="hover:text-[#C9956A] transition-colors cursor-pointer text-[#F5EDE8]/50 text-xs tracking-widest uppercase"
              style={{ background: "none", border: "none", fontFamily: "'Jost', sans-serif", padding: 0 }}
            >
              La Maison
            </button>
            <button
              onClick={() => goTo("savoir-faire")}
              className="hover:text-[#C9956A] transition-colors cursor-pointer text-[#F5EDE8]/50 text-xs tracking-widest uppercase"
              style={{ background: "none", border: "none", fontFamily: "'Jost', sans-serif", padding: 0 }}
            >
              Savoir-Faire
            </button>
            <button
              onClick={() => goTo("contact")}
              className="hover:text-[#C9956A] transition-colors cursor-pointer text-[#F5EDE8]/50 text-xs tracking-widest uppercase"
              style={{ background: "none", border: "none", fontFamily: "'Jost', sans-serif", padding: 0 }}
            >
              Contact
            </button>
          </div>
          <button
            onClick={() => goTo("collection")}
            className="hidden md:block border border-[#C9956A]/50 text-[#C9956A] text-xs tracking-widest uppercase px-6 py-2.5 hover:bg-[#C9956A]/10 transition-colors cursor-pointer"
            style={{ background: "none", fontFamily: "'Jost', sans-serif" }}
          >
            Commander
          </button>
          <button className="md:hidden p-2 cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" style={{ background: "none", border: "none" }}>
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
              <div className="px-6 py-4 flex flex-col gap-4 text-xs tracking-widest uppercase text-[#F5EDE8]/60 items-start">
                {[
                  { label: "Collection", key: "collection" as const },
                  { label: "La Maison", key: "maison" as const },
                  { label: "Savoir-Faire", key: "savoir-faire" as const },
                  { label: "Contact", key: "contact" as const },
                ].map(({ label, key }) => (
                  <button
                    key={key}
                    onClick={() => {
                      setMenuOpen(false);
                      goTo(key);
                    }}
                    className="hover:text-[#C9956A] transition-colors cursor-pointer text-[#F5EDE8]/60 text-xs tracking-widest uppercase"
                    style={{ background: "none", border: "none", fontFamily: "'Jost', sans-serif", padding: 0 }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {page === "home" && (
        <>
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
            <button
              onClick={() => goTo("collection")}
              className="bg-[#C9956A] text-[#1A0F1E] text-xs tracking-widest uppercase px-8 py-4 font-medium hover:bg-[#D9A57A] transition-colors flex items-center gap-3 cursor-pointer"
              style={{ background: "#C9956A", border: "none", fontFamily: "'Jost', sans-serif" }}
            >
              Découvrir la collection <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => goTo("maison")}
              className="text-[#C9956A] text-xs tracking-widest uppercase border-b border-[#C9956A]/40 pb-0.5 hover:border-[#C9956A] transition-colors cursor-pointer"
              style={{ background: "none", border: "none", fontFamily: "'Jost', sans-serif", padding: 0 }}
            >
              Notre histoire
            </button>
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
              <button
                onClick={() => goTo("collection")}
                className="bg-[#C9956A] text-[#1A0F1E] text-xs tracking-widest uppercase px-10 py-4 font-medium hover:bg-[#D9A57A] transition-colors cursor-pointer"
                style={{ background: "#C9956A", border: "none", fontFamily: "'Jost', sans-serif" }}
              >
                Explorer la collection
              </button>
              <button
                onClick={() => goTo("contact")}
                className="border border-[#C9956A]/40 text-[#C9956A] text-xs tracking-widest uppercase px-10 py-4 hover:border-[#C9956A] hover:bg-[#C9956A]/5 transition-colors cursor-pointer"
                style={{ background: "none", fontFamily: "'Jost', sans-serif" }}
              >
                Nous contacter
              </button>
            </div>
          </Reveal>
        </div>
      </section>
      </>
      )}

      {/* ── SUB-PAGES ROUTING ── */}
      {page === "collection" && (
        <BoutiquePage
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          goTo={goTo}
        />
      )}
      {page === "maison" && <MaisonPage />}
      {page === "savoir-faire" && <SavoirFairePage />}
      {page === "contact" && <ContactPage />}
      {page === "mentions" && <LegalPage variant="mentions" />}
      {page === "cgv" && <LegalPage variant="cgv" />}
      {page === "privacy" && <LegalPage variant="privacy" />}

      {/* Footer */}
      <footer className="border-t border-[#C9956A]/10 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xl tracking-[0.3em] uppercase" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
            Éther
          </div>
          <div className="flex flex-wrap gap-6 text-xs tracking-widest uppercase text-[#F5EDE8]/30">
            {[
              { label: "Collection", key: "collection" as const },
              { label: "La Maison", key: "maison" as const },
              { label: "Savoir-Faire", key: "savoir-faire" as const },
              { label: "Contact", key: "contact" as const },
              { label: "Mentions Légales", key: "mentions" as const },
              { label: "CGV", key: "cgv" as const },
              { label: "Confidentialité", key: "privacy" as const },
            ].map(({ label, key }) => (
              <button
                key={key}
                onClick={() => goTo(key)}
                className="hover:text-[#C9956A] transition-colors cursor-pointer"
                style={{ background: "none", border: "none", color: "inherit", fontFamily: "'Jost', sans-serif", fontSize: "inherit", letterSpacing: "inherit", textTransform: "inherit", padding: 0 }}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-[#F5EDE8]/20 text-xs tracking-widest">© 2026 Éther Parfums, Paris</p>
        </div>
      </footer>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-PAGE COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

interface BoutiquePageProps {
  selectedProduct: any | null;
  setSelectedProduct: (p: any | null) => void;
  goTo: (p: any) => void;
}

function BoutiquePage({ selectedProduct, setSelectedProduct, goTo }: BoutiquePageProps) {
  const [successMsg, setSuccessMsg] = useState(false);
  const products = fragrances;

  if (selectedProduct) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          padding: "160px 24px 100px",
          maxWidth: 1000,
          margin: "0 auto",
          minHeight: "80vh",
          fontFamily: "'Jost', sans-serif",
        }}
      >
        <button
          onClick={() => setSelectedProduct(null)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "'Jost', sans-serif",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#C9956A",
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 48,
            padding: 0,
          }}
        >
          ← Retour à la collection
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 64 }}>
          {/* Visual wrapper */}
          <div
            style={{
              aspectRatio: "3/4",
              borderRadius: 4,
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(201, 149, 106, 0.15)",
            }}
          >
            <Image
              src={selectedProduct.img}
              alt={selectedProduct.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ color: "#C9956A", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
              {selectedProduct.family}
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, color: "#F5EDE8", marginBottom: 16 }}>
              {selectedProduct.name}
            </h1>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: "#F5EDE8", marginBottom: 24 }}>
              {selectedProduct.price}
            </div>
            <p style={{ color: "#F5EDE8", opacity: 0.6, fontSize: 13, letterSpacing: "0.05em", marginBottom: 28 }}>
              Contenance : {selectedProduct.ml} · Eau de Parfum
            </p>

            <p style={{ color: "#F5EDE8", opacity: 0.75, fontSize: 15, lineHeight: 1.8, marginBottom: 32, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
              {selectedProduct.desc}. Une composition unique issue des matières premières les plus nobles, sélectionnées avec un soin absolu pour une expérience sensorielle singulière et persistante.
            </p>

            <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 40 }}>
              {selectedProduct.notes.map((note: string) => (
                <span key={note} className="border border-[#C9956A]/30 text-[#C9956A] text-[10px] tracking-widest uppercase px-3 py-1.5">
                  {note}
                </span>
              ))}
            </div>

            {successMsg ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: "16px 24px",
                  border: "1px solid #C9956A",
                  color: "#C9956A",
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: 24,
                  textAlign: "center",
                }}
              >
                ✦ Ajouté au panier ✦
              </motion.div>
            ) : (
              <button
                onClick={() => setSuccessMsg(true)}
                style={{
                  background: "#C9956A",
                  border: "none",
                  color: "#1A0F1E",
                  fontSize: 10,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  padding: "18px 40px",
                  cursor: "pointer",
                  fontWeight: 600,
                  marginBottom: 32,
                  width: "fit-content",
                }}
              >
                Ajouter au panier
              </button>
            )}

            <div style={{ fontSize: 12, color: "#F5EDE8", opacity: 0.4, lineHeight: 1.8, borderTop: "1px solid rgba(201, 149, 106, 0.1)", paddingTop: 24 }}>
              • Livraison offerte à domicile sous 2 à 4 jours ouvrés<br />
              • Un échantillon de la même essence inclus dans votre envoi pour essayer avant d'ouvrir<br />
              • Retours simplifiés acceptés sous 30 jours
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        padding: "160px 24px 100px",
        maxWidth: 1200,
        margin: "0 auto",
        minHeight: "80vh",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 80 }}>
        <p style={{ color: "#C9956A", fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 16 }}>Collection 2026</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 56, fontWeight: 300, color: "#F5EDE8", marginBottom: 20 }}>
          La Collection Éther
        </h1>
        <p style={{ color: "#F5EDE8", opacity: 0.6, fontSize: 15, maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
          Découvrez nos créations olfactives d'exception, formulées à partir de matières premières rares et précieuses.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 32 }}>
        {products.map((product) => (
          <div
            key={product.name}
            onClick={() => {
              setSelectedProduct(product);
              if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
            }}
            style={{
              cursor: "pointer",
              background: "rgba(255, 255, 255, 0.01)",
              border: "1px solid rgba(201, 149, 106, 0.1)",
              borderRadius: 4,
              padding: "24px",
              transition: "border-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(201, 149, 106, 0.3)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(201, 149, 106, 0.1)")}
          >
            <div style={{ aspectRatio: "3/4", position: "relative", overflow: "hidden", borderRadius: 2, marginBottom: 20 }}>
              <Image src={product.img} alt={product.name} fill className="object-cover" />
            </div>
            <p style={{ color: "#C9956A", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
              {product.family}
            </p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: "#F5EDE8", marginBottom: 8 }}>
              {product.name}
            </h3>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 16, color: "#F5EDE8" }}>{product.price}</span>
              <span style={{ fontSize: 11, color: "#C9956A", letterSpacing: "0.1em" }}>Découvrir →</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function MaisonPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        padding: "160px 24px 100px",
        maxWidth: 800,
        margin: "0 auto",
        minHeight: "80vh",
        fontFamily: "'Jost', sans-serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 72 }}>
        <p style={{ color: "#C9956A", fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 16 }}>Notre Histoire</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 56, fontWeight: 300, color: "#F5EDE8", marginBottom: 20 }}>
          La Maison Éther
        </h1>
        <div style={{ width: 48, height: 1, background: "#C9956A", margin: "0 auto" }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 36, fontSize: 16, lineHeight: 1.8, color: "#F5EDE8", opacity: 0.75 }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontStyle: "italic", textAlign: "center" }}>
          "Le parfum est la forme la plus intense du souvenir. C'est l'art de l'invisible."
        </p>
        <p>
          Fondée en 1987 à Paris par la nez Hélène Varenne, la Maison Éther est née d'un désir de liberté créative absolue. Éloignée des diktats de la parfumerie industrielle, elle explore des contrées olfactives singulières où les émotions brutes guident le nez.
        </p>
        <p>
          Notre atelier historique, situé au cœur du Marais parisien, abrite nos formules et nos secrets de macération. C'est là que chaque flacon prend vie, fruit d'un minutieux assemblage de molécules naturelles et synthétiques soigneusement sélectionnées.
        </p>
        <p>
          Maison Éther s'engage pour une parfumerie responsable. Nous développons des partenariats à long terme avec nos producteurs de matières premières à travers le monde, garantissant une rémunération équitable et le respect de la biodiversité.
        </p>
      </div>
    </motion.div>
  );
}

function SavoirFairePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        padding: "160px 24px 100px",
        maxWidth: 900,
        margin: "0 auto",
        minHeight: "80vh",
        fontFamily: "'Jost', sans-serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 72 }}>
        <p style={{ color: "#C9956A", fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 16 }}>Savoir-Faire</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 56, fontWeight: 300, color: "#F5EDE8", marginBottom: 20 }}>
          Le Processus de Création
        </h1>
        <div style={{ width: 48, height: 1, background: "#C9956A", margin: "0 auto" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 48 }}>
        {[
          {
            num: "01",
            title: "Le Sourcing Éthique",
            desc: "Chaque fleur de Grasse, chaque bois d'oud précieux d'Asie et chaque résine d'Éthiopie est issu d'un approvisionnement direct et éco-responsable auprès de petits producteurs partenaires.",
          },
          {
            num: "02",
            title: "La Formulation d'Auteur",
            desc: "Notre processus commence par une formulation libre de toute contrainte de coût ou de temps. Hélène Varenne teste des centaines d'accords pour capturer l'esprit exact d'un instant ou d'un souvenir.",
          },
          {
            num: "03",
            title: "La Macération en Cuve",
            desc: "Les concentrés parfumés reposent dans nos cuves entre 6 et 8 semaines. Ce repos permet aux matières de fusionner et de développer leur sillage caractéristique, stable et complexe.",
          },
          {
            num: "04",
            title: "Le Flaconnage à la Main",
            desc: "Chaque flacon est rempli, bouché et cacheté manuellement dans notre atelier parisien, scellant un produit d'artisanat français d'exception.",
          },
        ].map((step) => (
          <div key={step.num} style={{ display: "flex", gap: 32, paddingBottom: 32, borderBottom: "1px solid rgba(201, 149, 106, 0.1)" }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, color: "#C9956A", opacity: 0.5, lineHeight: 1 }}>
              {step.num}
            </span>
            <div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: "#F5EDE8", marginBottom: 12 }}>
                {step.title}
              </h3>
              <p style={{ color: "#F5EDE8", opacity: 0.6, fontSize: 14, lineHeight: 1.7 }}>
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", msg: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.msg) {
      setSubmitted(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        padding: "160px 24px 100px",
        maxWidth: 900,
        margin: "0 auto",
        minHeight: "80vh",
        fontFamily: "'Jost', sans-serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 72 }}>
        <p style={{ color: "#C9956A", fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 16 }}>Prendre Contact</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 56, fontWeight: 300, color: "#F5EDE8", marginBottom: 20 }}>
          Nous Écrire
        </h1>
        <div style={{ width: 48, height: 1, background: "#C9956A", margin: "0 auto" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 64 }}>
        {/* Form */}
        <div>
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form key="form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#F5EDE8", opacity: 0.5 }}>Nom complet</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(201, 149, 106, 0.2)",
                      borderRadius: 2,
                      padding: "14px 16px",
                      color: "#F5EDE8",
                      outline: "none",
                      fontFamily: "'Jost', sans-serif",
                    }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#F5EDE8", opacity: 0.5 }}>Adresse e-mail</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(201, 149, 106, 0.2)",
                      borderRadius: 2,
                      padding: "14px 16px",
                      color: "#F5EDE8",
                      outline: "none",
                      fontFamily: "'Jost', sans-serif",
                    }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#F5EDE8", opacity: 0.5 }}>Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.msg}
                    onChange={(e) => setFormData({ ...formData, msg: e.target.value })}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(201, 149, 106, 0.2)",
                      borderRadius: 2,
                      padding: "14px 16px",
                      color: "#F5EDE8",
                      outline: "none",
                      resize: "none",
                      fontFamily: "'Jost', sans-serif",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    background: "#C9956A",
                    border: "none",
                    color: "#1A0F1E",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    padding: "16px 32px",
                    cursor: "pointer",
                    fontWeight: 600,
                    width: "fit-content",
                  }}
                >
                  Envoyer
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: "40px 24px",
                  border: "1px solid #C9956A",
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <p style={{ color: "#C9956A", fontSize: 16, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>✦ Message envoyé ✦</p>
                <p style={{ color: "#F5EDE8", opacity: 0.6, fontSize: 13 }}>Nous vous répondrons dans les meilleurs délais.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Address */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, color: "#F5EDE8", marginBottom: 12 }}>
              L'Atelier Le Marais
            </h2>
            <p style={{ color: "#F5EDE8", opacity: 0.6, fontSize: 14, lineHeight: 1.7 }}>
              Rue des Francs-Bourgeois, 75004 Paris<br />
              Du lundi au vendredi, de 10h à 18h.<br />
              E-mail : contact@ether-parfums.com<br />
              Téléphone : +33 1 44 55 66 77
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LegalPage({ variant }: { variant: "mentions" | "cgv" | "privacy" }) {
  if (variant === "mentions") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          padding: "160px 24px 100px",
          maxWidth: 800,
          margin: "0 auto",
          minHeight: "80vh",
          fontFamily: "'Jost', sans-serif",
          lineHeight: 1.8,
        }}
      >
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: "#F5EDE8", marginBottom: 40 }}>Mentions Légales</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: 32, color: "#F5EDE8", opacity: 0.8 }}>
          <div>
            <h3 style={{ color: "#C9956A", fontSize: 16, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Éditeur du site</h3>
            <p>
              Aevia WS — Valentin Milliand<br />
              Entrepreneur individuel<br />
              SIREN : 852 546 225<br />
              RCS : Bourg-en-Bresse<br />
              Adresse : communiquée sur demande<br />
              E-mail : contact@aevia.io
            </p>
          </div>
          <div>
            <h3 style={{ color: "#C9956A", fontSize: 16, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Hébergement</h3>
            <p>
              Vercel Inc.<br />
              340 S Lemon Ave #4133<br />
              Walnut, CA 91789, États-Unis
            </p>
          </div>
          <div>
            <h3 style={{ color: "#C9956A", fontSize: 16, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Propriété intellectuelle</h3>
            <p>
              Le contenu de ce site web (visuels, textes, marques) est protégé au titre de la propriété intellectuelle. Toute exploitation sans accord préalable est illicite.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === "cgv") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          padding: "160px 24px 100px",
          maxWidth: 800,
          margin: "0 auto",
          minHeight: "80vh",
          fontFamily: "'Jost', sans-serif",
          lineHeight: 1.8,
        }}
      >
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: "#F5EDE8", marginBottom: 40 }}>Conditions Générales de Vente</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: 32, color: "#F5EDE8", opacity: 0.8 }}>
          <div>
            <h3 style={{ color: "#C9956A", fontSize: 16, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>1. Commandes</h3>
            <p>
              Les commandes d'essences de parfum s'effectuent en ligne. Le client reçoit un échantillon dans sa livraison pour pouvoir essayer la fragrance sans rompre l'emballage sécurisé du flacon.
            </p>
          </div>
          <div>
            <h3 style={{ color: "#C9956A", fontSize: 16, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>2. Prix & Paiement</h3>
            <p>
              Les prix de vente indiqués s'entendent toutes taxes comprises (TTC). Le règlement s'effectue de manière sécurisée en ligne.
            </p>
          </div>
          <div>
            <h3 style={{ color: "#C9956A", fontSize: 16, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>3. Rétractation</h3>
            <p>
              Le client dispose de 30 jours à compter de la livraison pour retourner le produit dans son emballage d'origine non ouvert s'il ne souhaite pas le conserver.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        padding: "160px 24px 100px",
        maxWidth: 800,
        margin: "0 auto",
        minHeight: "80vh",
        fontFamily: "'Jost', sans-serif",
        lineHeight: 1.8,
      }}
    >
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: "#F5EDE8", marginBottom: 40 }}>Politique de Confidentialité</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 32, color: "#F5EDE8", opacity: 0.8 }}>
        <div>
          <h3 style={{ color: "#C9956A", fontSize: 16, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Données personnelles</h3>
          <p>
            Les données recueillies sont destinées uniquement à la gestion de vos commandes et au suivi personnalisé de notre relation client.
          </p>
        </div>
        <div>
          <h3 style={{ color: "#C9956A", fontSize: 16, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Confidentialité absolue</h3>
          <p>
            Maison Éther s'engage à ne jamais communiquer vos informations personnelles à des tiers à des fins publicitaires.
          </p>
        </div>
        <div>
          <h3 style={{ color: "#C9956A", fontSize: 16, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Vos droits</h3>
          <p>
            Vous disposez d'un droit d'accès, de modification et d'effacement de vos données personnelles en contactant notre service client à : contact@aevia.io.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
