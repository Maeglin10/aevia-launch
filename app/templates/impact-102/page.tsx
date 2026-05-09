"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Leaf, ArrowRight, Menu, Star, Sparkles, Microscope, Droplets, Wind, Sun, ChevronRight, Flower2, Heart } from "lucide-react"
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
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden rounded-2xl border border-[#d4af37]/20">
      <motion.div style={{ y }} className="absolute inset-[-20%] w-[140%] h-[140%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

const SPECIMENS = [
  { name: "Emerald Monstera", genus: "Monstera Deliciosa", rarity: "Ultra-Rare", img: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=1200", desc: "A singular mutation featuring deep emerald variegation and crystalline leaf structure." },
  { name: "Golden Fern", genus: "Asplenium Aureum", rarity: "Limited", img: "https://images.unsplash.com/photo-1446071103084-c257b5f70672?auto=format&fit=crop&q=80&w=1200", desc: "Ancient lineage revived through specialized nutrient mapping and mineral infusions." },
  { name: "Velvet Alocasia", genus: "Alocasia Reginae", rarity: "Bespoke", img: "https://images.unsplash.com/photo-1592150621344-82839b6fc236?auto=format&fit=crop&q=80&w=1200", desc: "Dark-matter foliage with light-absorbing properties and silver-veined architecture." },
]

const PILLARS = [
  { icon: Microscope, title: "Genetic Tracing", desc: "Every specimen comes with a blockchain-verified genealogy and genetic map." },
  { icon: Droplets, title: "Mineral Infusion", desc: "Customized irrigation protocols using trace minerals for enhanced pigmentation." },
  { icon: Sun, title: "Luminance Control", desc: "Cultivated under full-spectrum solar simulation to ensure structural integrity." },
]

export default function VeridianBotanicalPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#051c14] text-[#d4af37] font-sans min-h-screen selection:bg-[#d4af37] selection:text-[#051c14] overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${scrolled ? "bg-[#051c14]/90 backdrop-blur-xl border-b border-[#d4af37]/10 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border border-[#d4af37]/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
              <Leaf className="w-5 h-5 text-[#d4af37]" />
            </div>
            <span className="text-xl font-light tracking-[0.2em] uppercase text-white">Veridian <span className="font-bold text-[#d4af37]">Atelier</span></span>
          </Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4af37]/40">
            {["The Conservatory", "Genealogy", "Services", "Archive"].map(l => (
              <Link key={l} href="#" className="hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-[#d4af37]/60 hover:text-white transition-colors">Collector Portal</button>
            <button className="px-8 py-3 bg-[#d4af37] text-[#051c14] text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-white transition-all duration-700">Inquire</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden"><Menu className="w-6 h-6 text-[#d4af37]" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#051c14] border-[#d4af37]/10 p-12">
                <div className="flex flex-col gap-10 mt-16 text-left text-white">
                  {["Conservatory", "Genealogy", "Atelier", "Contact"].map(l => (
                    <Link key={l} href="#" className="text-2xl font-light uppercase tracking-[0.3em] hover:text-[#d4af37] transition-colors">{l}</Link>
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
            <Image src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=2400" alt="Botanical Background" fill className="object-cover opacity-30 scale-105" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-[#051c14] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
            <Reveal>
              <div className="flex items-center justify-center gap-6 mb-12">
                 <div className="w-12 h-[1px] bg-[#d4af37]/30" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-[#d4af37]/60">Bespoke Botanical Curation</span>
                 <div className="w-12 h-[1px] bg-[#d4af37]/30" />
              </div>
            </Reveal>
            <Reveal delay={0.2} y={70}>
              <h1 className="text-7xl md:text-[9rem] font-light tracking-tighter leading-[0.85] text-white mb-12 uppercase" style={{ fontFamily: "serif" }}>
                Rare <br/> <span className="text-[#d4af37] italic">Elegance.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-col items-center justify-center gap-12">
                <p className="text-xl text-[#d4af37]/40 font-light max-w-xl leading-relaxed italic">
                  Cultivating the impossible. Veridian Atelier designs living masterpieces through advanced genetic tracing and artisan botanical craft.
                </p>
                <div className="flex flex-wrap justify-center gap-8">
                  <button className="px-12 py-5 bg-[#d4af37] text-[#051c14] font-bold uppercase tracking-widest text-[10px] hover:bg-white transition-all duration-700">
                    Explore Specimens
                  </button>
                  <button className="px-12 py-5 border border-[#d4af37]/20 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-[#d4af37]/10 transition-all flex items-center gap-3">
                    <Microscope className="w-3 h-3" /> View Genealogies
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
          
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
             <div className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#d4af37]/30">The Growth Cycle</div>
             <div className="w-[1px] h-12 bg-gradient-to-b from-[#d4af37]/40 to-transparent" />
          </motion.div>
        </section>

        {/* ── PILLARS ───────────────── */}
        <section className="py-40 bg-[#041610] border-y border-[#d4af37]/10">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
              {PILLARS.map((p, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="text-center group">
                    <div className="w-20 h-20 mx-auto rounded-full border border-[#d4af37]/10 flex items-center justify-center mb-8 group-hover:bg-[#d4af37] transition-all duration-700">
                      <p.icon className="w-6 h-6 text-[#d4af37] group-hover:text-[#051c14] transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 uppercase tracking-tighter" style={{ fontFamily: "serif" }}>{p.title}</h3>
                    <p className="text-[#d4af37]/40 leading-relaxed font-light text-sm italic">{p.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── SPECIMENS ─────────────── */}
        <section className="py-40 bg-[#051c14]">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex flex-col lg:flex-row items-end justify-between mb-32 gap-8 border-b border-[#d4af37]/10 pb-12">
                <div className="max-w-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4af37]/40 block mb-4">The Conservatory</span>
                  <h2 className="text-6xl md:text-8xl font-light uppercase tracking-tighter text-white" style={{ fontFamily: "serif" }}>Botanical <span className="italic text-[#d4af37]">Sculptures.</span></h2>
                </div>
                <Link href="#" className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest hover:text-white text-[#d4af37]/40 transition-colors group italic">
                  Collector Registry <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {SPECIMENS.map((s, i) => (
                <Reveal key={i} delay={i * 0.2}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[4/5] mb-10 overflow-hidden rounded-2xl">
                      <ParallaxImg src={s.img} alt={s.name} />
                      <div className="absolute top-8 right-8">
                         <span className="px-4 py-1.5 bg-[#051c14]/80 backdrop-blur-md border border-[#d4af37]/30 text-[#d4af37] text-[8px] font-bold uppercase tracking-widest rounded-full">{s.rarity}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between items-end">
                          <div>
                             <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#d4af37]/40 mb-1 italic">{s.genus}</div>
                             <h3 className="text-3xl font-light uppercase text-white tracking-widest" style={{ fontFamily: "serif" }}>{s.name}</h3>
                          </div>
                          <div className="w-10 h-10 rounded-full border border-[#d4af37]/20 flex items-center justify-center group-hover:bg-[#d4af37] group-hover:text-[#051c14] transition-all">
                             <ArrowRight className="w-4 h-4" />
                          </div>
                       </div>
                       <p className="text-sm text-[#d4af37]/40 leading-relaxed font-light italic">{s.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── ATELIER DETAIL ────────── */}
        <section className="py-40 relative overflow-hidden">
           <div className="absolute inset-0 bg-[#d4af37]/5 -skew-y-6 translate-y-1/2" />
           <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                 <Reveal>
                    <div className="aspect-[4/5] relative">
                       <ParallaxImg src="https://images.unsplash.com/photo-1592150621344-82839b6fc236?auto=format&fit=crop&q=80&w=1200" alt="Cultivation Lab" />
                       <div className="absolute -bottom-10 -right-10 p-10 bg-[#051c14] border border-[#d4af37]/10 w-72 hidden md:block">
                          <Flower2 className="w-8 h-8 mb-6 text-[#d4af37]/40" />
                          <h4 className="text-xl font-bold text-white mb-4 italic">The Terpene Archive</h4>
                          <p className="text-xs text-[#d4af37]/40 leading-relaxed font-light">Documenting the chemical signatures of rare flora to preserve their heritage for future generations.</p>
                       </div>
                    </div>
                 </Reveal>
                 <div className="space-y-16">
                    <Reveal delay={0.2}>
                       <h2 className="text-5xl md:text-7xl font-light uppercase text-white italic" style={{ fontFamily: "serif" }}>The Alchemy <br/> Of <span className="not-italic font-bold text-[#d4af37]">Flora.</span></h2>
                       <p className="text-xl text-[#d4af37]/40 font-light leading-relaxed italic">
                          Our atelier operates at the intersection of molecular biology and artistic curation. We don't just grow plants; we architect living legacies.
                       </p>
                    </Reveal>
                    <Reveal delay={0.3}>
                       <div className="grid grid-cols-2 gap-16 pt-12 border-t border-[#d4af37]/10">
                          <div>
                             <div className="text-4xl font-bold text-white mb-2 italic">140+</div>
                             <div className="text-[9px] font-bold uppercase tracking-widest text-[#d4af37]/40">Unique Genotypes</div>
                          </div>
                          <div>
                             <div className="text-4xl font-bold text-white mb-2 italic">22</div>
                             <div className="text-[9px] font-bold uppercase tracking-widest text-[#d4af37]/40">Global Sanctuaries</div>
                          </div>
                       </div>
                    </Reveal>
                 </div>
              </div>
           </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-40 bg-[#d4af37] text-[#051c14] text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-[1px] bg-[#051c14]/20" />
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <Reveal>
              <h2 className="text-6xl md:text-[10rem] font-light uppercase tracking-tighter leading-[0.8] mb-12" style={{ fontFamily: "serif" }}>
                Cultivate <br/> <span className="italic font-bold">Immersion.</span>
              </h2>
              <p className="text-xl text-[#051c14]/70 font-light mb-16 leading-relaxed italic">
                Our advisors are available for private consultations to design your personal conservatory. Begin your botanical legacy today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <button className="px-16 py-6 bg-[#051c14] text-white font-bold uppercase tracking-widest text-[10px] hover:px-20 transition-all duration-700 italic">
                   Request Curator Visit
                </button>
                <button className="px-16 py-6 border-2 border-[#051c14] text-[#051c14] font-bold uppercase tracking-widest text-[10px] hover:bg-[#051c14] hover:text-white transition-all duration-700 italic">
                   Join The Inner Circle
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#03110d] pt-32 pb-12 px-6 border-t border-[#d4af37]/10">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-16 mb-32">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-full border border-[#d4af37]/30 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-[#d4af37]" />
              </div>
              <span className="text-xl font-light tracking-[0.2em] uppercase text-white">Veridian <span className="font-bold text-[#d4af37]">Atelier</span></span>
            </Link>
            <p className="text-[#d4af37]/20 max-w-sm leading-relaxed mb-10 text-sm font-light italic" style={{ fontFamily: "serif" }}>
              "Nature is the greatest architect. We are simply its dedicated students and curators."
            </p>
            <div className="flex gap-10">
               {["Camera", "Journal", "Botanical Society", "Contact"].map(s => (
                 <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]/30 hover:text-white transition-colors">{s}</Link>
               ))}
            </div>
          </div>
          
          {[
            { t: "The Atelier", l: ["Conservatory", "Genealogy Lab", "Mineral Mapping", "Bespoke Curation"] },
            { t: "Services", l: ["Interior Design", "Maintenance", "Procurement", "Global Logistics"] },
            { t: "Company", l: ["Our Philosophy", "Locations", "Inner Circle", "Journal"] },
          ].map((col, i) => (
            <div key={i} className="space-y-10">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4af37]">{col.t}</h4>
              <ul className="space-y-6">
                {col.l.map(link => <li key={link}><Link href="#" className="text-xs text-[#d4af37]/30 hover:text-white transition-colors">{link}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-[1600px] mx-auto pt-12 border-t border-[#d4af37]/5 flex flex-col md:row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[#d4af37]/10">
          <span>© 2026 VERIDIAN BOTANICAL ATELIER. LIFE IS ART.</span>
          <div className="flex gap-12">
             <Link href="#" className="hover:text-white transition-colors">Genealogy Verification</Link>
             <Link href="#" className="hover:text-white transition-colors">Privacy Circle</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Lock({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  )
}
