"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Watch, ArrowRight, Menu, Star, Sparkles, Shield, Clock, Award, Hammer, Compass, ChevronRight, Play } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function Reveal({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"])
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1])
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden">
      <motion.div style={{ y, scale }} className="absolute inset-[-20%] w-[140%] h-[140%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

const COLLECTION = [
  { name: "Horology One", series: "Precision Series", price: "€14,500", img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=1200", desc: "Brushed titanium case with a 72-hour power reserve and sapphire crystal." },
  { name: "Deep Sea", series: "Oceanic Series", price: "€18,200", img: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=1200", desc: "Professional diver's watch water resistant to 1000m with helium escape valve." },
  { name: "Lunar Phase", series: "Astral Series", price: "€22,900", img: "https://images.unsplash.com/photo-1522337360744-47309047ffcf?auto=format&fit=crop&q=80&w=1200", desc: "Perpetual moon phase complication with 18k rose gold hand-engraved dial." },
]

const CRAFT = [
  { icon: Hammer, title: "Artisan Hand-Assembly", desc: "Over 200 hours of precision assembly by master horologists in our Swiss atelier." },
  { icon: Compass, title: "Navigational Precision", desc: "Calibrated to +/- 1 second per day, surpassing traditional COSC standards." },
  { icon: Shield, title: "Indestructible Materials", desc: "Grade 5 titanium and scratch-proof sapphire with multi-layer anti-reflective coating." },
]

export default function ChronosLuxuryPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#050505] text-[#d4af37] font-sans min-h-screen selection:bg-[#d4af37] selection:text-black overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${scrolled ? "bg-[#050505]/95 backdrop-blur-xl border-b border-[#d4af37]/10 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 border border-[#d4af37]/30 flex items-center justify-center group-hover:rotate-45 transition-transform duration-700">
              <Watch className="w-5 h-5 text-[#d4af37]" />
            </div>
            <span className="text-xl font-light tracking-[0.4em] uppercase text-white">Chronos</span>
          </Link>
          <div className="hidden lg:flex gap-12 text-[9px] font-bold uppercase tracking-[0.4em] text-[#d4af37]/40">
            {["The Atelier", "Collection", "Craftsmanship", "Heritage"].map(l => (
              <Link key={l} href="#" className="hover:text-[#d4af37] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block text-[9px] font-bold uppercase tracking-widest text-[#d4af37]/60 hover:text-[#d4af37] transition-colors">Private Concierge</button>
            <button className="px-8 py-3 border border-[#d4af37] text-[#d4af37] text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-[#d4af37] hover:text-black transition-all duration-700">Explore</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden"><Menu className="w-6 h-6 text-[#d4af37]" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#050505] border-[#d4af37]/10 p-12">
                <div className="flex flex-col gap-10 mt-16 text-left">
                  {["Atelier", "Collection", "Craft", "Legacy"].map(l => (
                    <Link key={l} href="#" className="text-2xl font-light uppercase tracking-[0.3em] hover:text-[#d4af37] transition-colors text-white">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ──────────────────── */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=2400" alt="Chronos Watch" fill className="object-cover opacity-40 scale-105" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
            <Reveal>
              <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-[#d4af37]/60 block mb-10 italic">Defining Time Since 1924</span>
            </Reveal>
            <Reveal delay={0.2} y={70}>
              <h1 className="text-7xl md:text-[9rem] font-extralight tracking-tighter leading-[0.85] text-white mb-12 uppercase" style={{ fontFamily: "serif" }}>
                Mastery In <br/> <span className="text-[#d4af37] italic">Motion.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-col items-center justify-center gap-12">
                <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-[#d4af37]/40 to-transparent" />
                <div className="flex flex-wrap justify-center gap-8">
                  <button className="px-12 py-5 bg-[#d4af37] text-black font-bold uppercase tracking-widest text-[10px] hover:px-14 transition-all duration-700">
                    View Collection
                  </button>
                  <button className="px-12 py-5 border border-white/20 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all flex items-center gap-3">
                    <Play className="w-3 h-3 fill-current" /> Watch Film
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── QUOTE ─────────────────── */}
        <section className="py-40 bg-[#050505] text-center border-y border-white/5">
           <div className="max-w-4xl mx-auto px-6">
              <Reveal>
                 <h2 className="text-3xl md:text-5xl font-light italic leading-relaxed text-white/80" style={{ fontFamily: "serif" }}>
                    "A watch does not simply tell the time; it tells a story of patience, precision, and the pursuit of perfection."
                 </h2>
                 <div className="mt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4af37]">Leo Aris — Master Horologist</div>
              </Reveal>
           </div>
        </section>

        {/* ── COLLECTION ────────────── */}
        <section className="py-32 bg-[#050505]">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex items-end justify-between mb-24 border-b border-white/5 pb-12">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4af37] block mb-4">The Collection</span>
                  <h2 className="text-5xl md:text-7xl font-extralight uppercase text-white" style={{ fontFamily: "serif" }}>Selected <span className="italic">Series.</span></h2>
                </div>
                <button className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]/60 hover:text-[#d4af37] transition-colors flex items-center gap-4 group">
                   Browse All <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {COLLECTION.map((c, i) => (
                <Reveal key={i} delay={i * 0.2}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[4/5] mb-8 overflow-hidden">
                      <ParallaxImg src={c.img} alt={c.name} />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-700" />
                      <div className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                         <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#d4af37] mb-1">{c.series}</div>
                         <h3 className="text-2xl font-light uppercase text-white tracking-widest">{c.name}</h3>
                      </div>
                      <div className="text-xl font-bold italic">{c.price}</div>
                    </div>
                    <p className="text-sm text-white/40 leading-relaxed font-light">{c.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CRAFT ─────────────────── */}
        <section className="py-32 relative bg-[#080808]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <Reveal>
                <div className="relative aspect-square">
                  <ParallaxImg src="https://images.unsplash.com/photo-1522337360744-47309047ffcf?auto=format&fit=crop&q=80&w=1200" alt="Atelier Detail" />
                  <div className="absolute -bottom-12 -left-12 p-8 bg-[#050505] border border-white/5 w-64 hidden md:block">
                     <div className="text-3xl font-bold mb-2 text-white">100%</div>
                     <div className="text-[9px] font-bold uppercase tracking-widest text-[#d4af37]">In-House Calibre</div>
                  </div>
                </div>
              </Reveal>
              <div>
                <Reveal>
                  <h2 className="text-5xl md:text-7xl font-extralight uppercase text-white mb-16 italic" style={{ fontFamily: "serif" }}>Born In <br/>The <span className="not-italic">Alps.</span></h2>
                  <div className="space-y-16">
                    {CRAFT.map((item, i) => (
                      <div key={i} className="flex gap-8 group">
                        <div className="w-12 h-12 shrink-0 border border-[#d4af37]/20 flex items-center justify-center group-hover:bg-[#d4af37] group-hover:border-[#d4af37] transition-all duration-700">
                          <item.icon className="w-5 h-5 text-[#d4af37] group-hover:text-black transition-colors" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold uppercase tracking-widest text-white mb-4">{item.title}</h4>
                          <p className="text-sm text-white/40 leading-relaxed max-w-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONCIERGE ─────────────── */}
        <section className="py-40 bg-[#050505] text-center">
          <div className="max-w-4xl mx-auto px-6">
            <Reveal>
              <h2 className="text-5xl md:text-8xl font-extralight uppercase text-white mb-12" style={{ fontFamily: "serif" }}>Personal <span className="italic text-[#d4af37]">Curation.</span></h2>
              <p className="text-xl text-white/40 font-light mb-16 leading-relaxed">
                Connect with our horological advisors for a private viewing of our latest complications, or to begin the creation of a bespoke masterpiece.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <button className="px-16 py-6 bg-[#d4af37] text-black font-bold uppercase tracking-widest text-[10px] hover:px-20 transition-all duration-700">
                   Request Private Viewing
                </button>
                <button className="px-16 py-6 border border-white/20 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all">
                   Contact Boutique
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-black pt-24 pb-12 px-6">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-16 mb-24">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-10">
              <div className="w-8 h-8 border border-[#d4af37]/30 flex items-center justify-center">
                <Watch className="w-4 h-4 text-[#d4af37]" />
              </div>
              <span className="text-xl font-light tracking-[0.4em] uppercase text-white">Chronos</span>
            </Link>
            <p className="text-white/30 max-w-sm leading-relaxed mb-10 text-sm italic" style={{ fontFamily: "serif" }}>
              "Time is the most valuable luxury of all. We simply provide the vessel to measure it."
            </p>
            <div className="flex gap-8">
               {["Camera", "Vimeo", "WeChat", "LinkedIn"].map(s => (
                 <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]/40 hover:text-[#d4af37] transition-colors">{s}</Link>
               ))}
            </div>
          </div>
          
          {[
            { t: "Explore", l: ["All Series", "Bespoke Service", "Pre-Owned", "Accessories"] },
            { t: "Discover", l: ["Our Atelier", "Heritage", "Innovation", "Journal"] },
            { t: "Client Care", l: ["Servicing", "Authentication", "Warranty", "Contact"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4af37] mb-10">{col.t}</h4>
              <ul className="space-y-6">
                {col.l.map(link => <li key={link}><Link href="#" className="text-xs text-white/40 hover:text-white transition-colors">{link}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-[1600px] mx-auto pt-12 border-t border-white/5 flex flex-col md:row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-white/20">
          <span>© 2026 CHRONOS HOROLOGY SA. GENÈVE.</span>
          <div className="flex gap-10">
             <Link href="#" className="hover:text-[#d4af37] transition-colors">Legal Mention</Link>
             <Link href="#" className="hover:text-[#d4af37] transition-colors">Privacy Circle</Link>
             <Link href="#" className="hover:text-[#d4af37] transition-colors">Cookies Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
