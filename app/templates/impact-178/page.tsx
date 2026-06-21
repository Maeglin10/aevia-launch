// @ts-nocheck
"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Building2, MapPin, ArrowRight, Star, Phone, Mail, Search, Bed, Bath, Square, ChevronDown, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

/* ═══════════════════════════════════════════════════════════════════════════
   ALTA TRANSACTIONS — Agence immobilière premium (Paris)
   Palette : bleu nuit profond / or champagne / blanc chaud
   Fonts : Libre Baskerville (titres) + Inter (corps) — Tailwind Reveal style
   ═══════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 35 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-70px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.0, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-[-10%] w-[120%] h-[120%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

const BIENS = [
  { type: "Appartement", title: "Haussmannien d'exception", loc: "Paris 8ème", price: "2 450 000 €", surface: 185, pieces: 6, chambres: 4, sdb: 2, img: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=1200", badge: "Exclusivité" },
  { type: "Maison", title: "Villa contemporaine à toit-terrasse", loc: "Neuilly-sur-Seine", price: "3 200 000 €", surface: 260, pieces: 8, chambres: 5, sdb: 3, img: "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&q=80&w=1200", badge: "Nouveau" },
  { type: "Penthouse", title: "Duplex vue panoramique", loc: "Paris 16ème", price: "4 800 000 €", surface: 220, pieces: 7, chambres: 4, sdb: 3, img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200", badge: "Coup de cœur" },
]

const SERVICES = [
  { num: "01", title: "Estimation gratuite", desc: "Évaluation précise de votre bien basée sur 15 ans de données de marché et une analyse comparative approfondie." },
  { num: "02", title: "Marketing premium", desc: "Photos professionnel, visite virtuelle 3D, diffusion sur 40+ portails, newsletter auprès de 2 000 acquéreurs qualifiés." },
  { num: "03", title: "Accompagnement acheteurs", desc: "Sélection exclusive, visites accompagnées, négociation, suivi notarial. Une seule personne de confiance du début à la fin." },
  { num: "04", title: "Gestion locative", desc: "Mise en location, sélection locataires, états des lieux, gestion courante. Taux d'occupation moyen : 98,2%." },
]

export default function AltaTransactionsPage() {
  const heroRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#fefdfb] text-[#11182a] overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#11182a]/97 backdrop-blur-xl py-4 border-b border-[#b8944a]/15" : "bg-transparent py-7"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 border border-[#b8944a] flex items-center justify-center">
              <Building2 className="w-3.5 h-3.5 text-[#b8944a]" />
            </div>
            <span className="text-white font-bold tracking-[0.2em] uppercase text-sm">Alta Transactions</span>
          </div>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">
            {["Acheter", "Vendre", "Estimer", "Programme neuf", "Contact"].map(l => (
              <Link key={l} href="#" className="hover:text-[#b8944a] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-4">
            <a href="tel:0144876543" className="text-[10px] font-bold uppercase tracking-widest text-[#b8944a]">01 44 87 65 43</a>
            <button className="px-6 py-2.5 bg-[#b8944a] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#cdab66] transition-colors duration-300">
              Estimer mon bien
            </button>
          </div>
          <Sheet>
            <SheetTrigger asChild><button className="lg:hidden"><Menu className="w-5 h-5 text-white" /></button></SheetTrigger>
            <SheetContent side="right" className="bg-[#11182a] border-[#b8944a]/10 p-10">
              <div className="flex flex-col gap-8 mt-16">
                {["Acheter", "Vendre", "Estimer", "Contact"].map(l => (
                  <Link key={l} href="#" className="text-3xl font-light uppercase tracking-widest text-white hover:text-[#b8944a] transition-colors">{l}</Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-[115vh] min-h-[900px] flex items-end overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=85&w=2400" alt="Immobilier prestige Paris" fill className="object-cover" priority style={{ filter: "brightness(0.55)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11182a] via-[#11182a]/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#11182a]/60 to-transparent" />
        </motion.div>

        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-12 pb-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-[1px] bg-[#b8944a]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#b8944a]">Immobilier de prestige · Paris & Île-de-France</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.92] tracking-tight mb-10 text-white"
            style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontStyle: "italic" }}>
            L'immobilier de<br />
            <span className="text-[#b8944a] not-italic">prestige</span>, autrement.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.75 }}
            className="max-w-lg text-sm text-white/45 leading-relaxed mb-10">
            15 ans d'expertise sur le marché parisien haut de gamme. 120 transactions par an. Une équipe de 6 experts totalement dédiés à vos ambitions patrimoniales.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.0 }} className="flex flex-wrap gap-4">
            <button className="px-10 py-4 bg-[#b8944a] text-white text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-[#cdab66] transition-colors duration-300">
              Voir nos biens
            </button>
            <button className="px-10 py-4 border border-white/15 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:border-[#b8944a]/50 hover:text-[#b8944a] transition-all">
              Estimer gratuitement
            </button>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <span className="text-[8px] font-bold uppercase tracking-[0.5em] text-white/15">scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} className="w-[1px] h-10 bg-gradient-to-b from-[#b8944a]/50 to-transparent" />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-[#11182a] py-16">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-0">
          {[
            { v: "2,1 Mds", l: "Volume de transactions" },
            { v: "120+", l: "Ventes/an" },
            { v: "98,2%", l: "Taux d'occupation gestion" },
            { v: "15 ans", l: "D'expertise premium" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="text-center py-8 border-r border-white/5 last:border-r-0">
                <div className="text-3xl font-bold text-[#b8944a] mb-2" style={{ fontFamily: "'Libre Baskerville', serif" }}>{s.v}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/25">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── BIENS EN VENTE ── */}
      <section className="py-32 bg-[#fefdfb]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#b8944a] mb-4">Sélection exclusive</div>
              <h2 className="text-5xl md:text-6xl font-bold text-[#11182a]" style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontStyle: "italic" }}>
                Nos biens en exclusivité.
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {BIENS.map((b, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group cursor-pointer">
                  <div className="relative aspect-[4/3] overflow-hidden mb-6">
                    <ParallaxImg src={b.img} alt={b.title} />
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-[#b8944a] text-white text-[9px] font-bold uppercase tracking-widest">{b.badge}</div>
                    <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-[#11182a]/80 backdrop-blur-md text-white text-[10px] font-bold tracking-wider">{b.price}</div>
                    <div className="absolute inset-0 bg-[#11182a]/0 group-hover:bg-[#11182a]/15 transition-all duration-700" />
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#b8944a] mb-2"><MapPin className="w-2.5 h-2.5 inline mr-1" />{b.loc} · {b.type}</div>
                  <h3 className="text-xl font-bold text-[#11182a] mb-4 group-hover:text-[#b8944a] transition-colors" style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: "italic" }}>{b.title}</h3>
                  <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-[#11182a]/40">
                    <span className="flex items-center gap-1"><Square className="w-3 h-3" /> {b.surface} m²</span>
                    <span className="flex items-center gap-1"><Bed className="w-3 h-3" /> {b.chambres} ch.</span>
                    <span className="flex items-center gap-1"><Bath className="w-3 h-3" /> {b.sdb} sdb</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div className="text-center mt-16">
              <button className="inline-flex items-center gap-3 px-10 py-4 border border-[#11182a]/10 text-[10px] font-bold uppercase tracking-widest text-[#11182a] hover:bg-[#11182a] hover:text-white transition-all duration-500">
                Voir toutes nos exclusivités <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-32 bg-[#f2ede6]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#b8944a] mb-4">Notre approche</div>
              <h2 className="text-5xl md:text-6xl font-bold text-[#11182a]" style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: "italic" }}>
                Un accompagnement<br />sans compromis.
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#11182a]/5">
            {SERVICES.map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="bg-[#f2ede6] p-10 hover:bg-white transition-colors duration-500">
                  <div className="text-[3rem] font-light text-[#b8944a]/20 mb-4 leading-none" style={{ fontFamily: "'Libre Baskerville', serif" }}>{s.num}</div>
                  <div className="w-8 h-[1px] bg-[#b8944a] mb-5" />
                  <h3 className="text-lg font-bold text-[#11182a] mb-3" style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: "italic" }}>{s.title}</h3>
                  <p className="text-sm text-[#11182a]/50 leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="py-32 bg-[#11182a]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#b8944a] mb-4">Avis clients</div>
              <h2 className="text-5xl font-bold text-white" style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: "italic" }}>Ce qu'ils en pensent.</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { q: "Vente de notre appartement en 11 jours au prix demandé. L'équipe Alta est d'une efficacité remarquable. Vrais professionnels, vrais résultats.", a: "Jean-Michel & Corinne T.", p: "Vendeurs · Paris 8ème" },
              { q: "Après 6 mois de recherche infructueuse avec d'autres agences, Alta m'a trouvé mon appartement en 3 semaines. Un réseau et une réactivité hors norme.", a: "Sophie A.", p: "Acquéreur · Neuilly" },
              { q: "La gestion locative d'Alta est irréprochable. Zéro vacance depuis 4 ans sur mes 3 biens. Un vrai partenaire patrimonial.", a: "François D.", p: "Bailleur · Portfoli 3 biens" },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="border border-white/5 p-10 hover:border-[#b8944a]/20 transition-colors duration-500">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#b8944a] text-[#b8944a]" />)}
                  </div>
                  <p className="text-white/45 text-sm leading-relaxed italic mb-8 flex-1">{`"${t.q}"`}</p>
                  <div className="border-t border-white/5 pt-6">
                    <div className="font-bold text-sm text-white uppercase tracking-widest">{t.a}</div>
                    <div className="text-[10px] text-[#b8944a]/60 tracking-widest mt-1">{t.p}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-48 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=2400" alt="Bien immobilier prestige" fill className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-[#fefdfb]/85" />
        </div>
        <Reveal className="relative z-10 text-center px-6">
          <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#b8944a] mb-6">Estimation gratuite</div>
          <h2 className="text-5xl md:text-7xl font-bold text-[#11182a] mb-8" style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: "italic" }}>
            Combien vaut<br />votre bien ?
          </h2>
          <p className="text-[#11182a]/45 max-w-md mx-auto mb-10 text-sm leading-relaxed">
            Obtenez une estimation précise et confidentielle en moins de 48h. Sans engagement.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-10 py-5 bg-[#11182a] text-white text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-[#b8944a] transition-colors duration-500">
              Demander une estimation
            </button>
            <a href="tel:0144876543" className="flex items-center gap-3 px-10 py-5 border border-[#11182a]/15 text-[#11182a] text-[10px] font-bold uppercase tracking-[0.2em] hover:border-[#b8944a] transition-all">
              <Phone className="w-4 h-4 text-[#b8944a]" /> 01 44 87 65 43
            </a>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#11182a] pt-24 pb-10 px-6 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-5 h-5 text-[#b8944a]" />
              <span className="font-bold tracking-[0.2em] uppercase text-white text-sm">Alta Transactions</span>
            </div>
            <p className="text-sm text-white/25 leading-relaxed">Immobilier de prestige · Paris & Île-de-France · Expertise depuis 2009.</p>
          </div>
          {[
            { t: "Acheter", ls: ["Appartements", "Maisons & villas", "Programme neuf", "Investissement locatif"] },
            { t: "Vendre", ls: ["Estimation gratuite", "Marketing premium", "Compte rendu hebdo", "Honoraires transparents"] },
            { t: "Agence", ls: ["Notre équipe", "Nos références", "Blog & conseils", "01 44 87 65 43"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#b8944a] mb-6">{col.t}</h4>
              <ul className="space-y-3">
                {col.ls.map(l => <li key={l}><Link href="#" className="text-sm text-white/25 hover:text-white transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1400px] mx-auto pt-8 border-t border-white/5 flex justify-between text-[9px] font-bold uppercase tracking-widest text-white/15">
          <span>© 2026 Alta Transactions · SIRET 456 789 123 00078 · Carte professionnelle T/G/S n°C</span>
          <span className="text-[#b8944a]/30">Immobilier de prestige Paris</span>
        </div>
      </footer>
    </div>
  )
}
