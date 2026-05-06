"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Watch, ArrowRight, Menu, Star, Shield, Clock, Compass, Award, ChevronRight, Play, Settings } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function Reveal({ children, delay = 0, y = 30 }: { children: React.ReactNode; delay?: number; y?: number }) {
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
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"])
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden rounded-sm">
      <motion.div style={{ y }} className="absolute inset-[-15%] w-[130%] h-[130%]">
        <Image src={src} alt={alt} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
      </motion.div>
    </div>
  )
}

const MODELS = [
  { name: "The Chronos 01", type: "Rose Gold Edition", price: "€24,500", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200" },
  { name: "Deep Sea Master", cat: "Titanium / Ceramic", price: "€18,200", img: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=1200" },
  { name: "Lunar Phase", cat: "Platinum / Leather", price: "€42,000", img: "https://images.unsplash.com/photo-1522337360744-da4860b2995b?auto=format&fit=crop&q=80&w=1200" },
]

export default function ZenithWatchPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#0a0c10] text-[#a0a0a0] font-sans min-h-screen selection:bg-[#c9a96e] selection:text-black overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${scrolled ? "bg-[#0a0c10]/95 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 border border-[#c9a96e]/30 flex items-center justify-center group-hover:border-[#c9a96e] transition-all duration-700">
              <Watch className="w-5 h-5 text-[#c9a96e]" />
            </div>
            <span className="text-xl font-light tracking-[0.4em] uppercase text-white">Zenith <span className="font-bold">Watch</span></span>
          </Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.5em] text-white/30">
            {["The Movement", "Collections", "Atelier", "Archive"].map(l => (
              <Link key={l} href="#" className="hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors underline underline-offset-8 decoration-[#c9a96e]/20">Legacy Portal</button>
            <button className="px-10 py-3.5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#c9a96e] hover:text-black transition-all duration-700">Request Bespoke</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden p-2"><Menu className="w-6 h-6 text-white" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#0a0c10] border-white/5 p-12 text-white">
                <div className="flex flex-col gap-10 mt-16 text-left">
                  {["Experience", "Timepieces", "Journal", "Book"].map(l => (
                    <Link key={l} href="#" className="text-4xl font-light uppercase tracking-widest hover:italic transition-all">{l}</Link>
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
             <Image src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=2400" alt="Watch Macro" fill className="object-cover opacity-20 scale-105" priority />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
            <Reveal>
              <div className="flex items-center justify-center gap-8 mb-16 opacity-30">
                 <div className="w-16 h-[1px] bg-[#c9a96e]" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white">The Architecture of Time</span>
                 <div className="w-16 h-[1px] bg-[#c9a96e]" />
              </div>
            </Reveal>
            <Reveal delay={0.2} y={70}>
              <h1 className="text-8xl md:text-[12rem] font-light tracking-tighter leading-[0.8] text-white mb-16 uppercase italic">
                Silent <br/> <span className="font-bold not-italic">Caliber.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-col items-center justify-center gap-16">
                <p className="text-2xl text-white/40 font-light max-w-2xl leading-relaxed italic">
                  Crafting high-fidelity movements that beat with the rhythm of tradition and the precision of tomorrow.
                </p>
                <div className="flex flex-wrap justify-center gap-12">
                  <button className="px-16 py-6 border border-white/20 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all duration-700 italic shadow-[0_0_40px_rgba(255,255,255,0.05)]">
                    Explore Collections
                  </button>
                  <button className="px-16 py-6 bg-[#c9a96e] text-black font-bold uppercase tracking-widest text-[10px] hover:px-20 transition-all flex items-center gap-4">
                    <Play className="w-3 h-3 fill-current" /> Witness the Movement
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
          
          <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end text-[9px] font-bold uppercase tracking-[0.4em] text-white/10 italic">
            <span>GENEVA / ZURICH / TOKYO / NEW YORK</span>
            <div className="flex gap-6 items-center">
               <Clock className="w-4 h-4 text-[#c9a96e] animate-spin-slow" />
               <span>EST. 1892</span>
            </div>
          </div>
        </section>

        {/* ── THE MOVEMENT ──────────── */}
        <section className="py-60 bg-[#0a0c10] relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                <Reveal>
                   <div className="relative aspect-square p-2 bg-white/[0.02] border border-white/5 group overflow-hidden">
                      <ParallaxImg src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=1200" alt="Watch Gears" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-1000" />
                   </div>
                </Reveal>
                <div>
                   <Reveal>
                      <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c9a96e] block mb-12">Mechanical Integrity</span>
                      <h2 className="text-6xl md:text-8xl font-light uppercase tracking-tighter text-white leading-none mb-16 italic">Absolute <br/> <span className="not-italic font-bold opacity-30 text-white">Precision.</span></h2>
                      <p className="text-2xl font-light text-white/40 leading-relaxed mb-20 italic">
                         Every Zenith timepiece is powered by our proprietary Caliber-9 series movement, featuring 242 hand-polished components and a 72-hour power reserve.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                         {[
                           { icon: Settings, t: "HAND-POLISHED", d: "Each gear is finished with artisan precision under 20x magnification." },
                           { icon: Shield, t: "LUNAR STABILITY", d: "Regulated in 6 positions to ensure a variance of less than 1s/day." }
                         ].map((item, i) => (
                           <div key={i} className="group">
                              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-6 group-hover:bg-[#c9a96e] group-hover:text-black transition-all">
                                 <item.icon className="w-5 h-5" />
                              </div>
                              <h4 className="text-xs font-black uppercase tracking-widest mb-4 text-white italic">{item.t}</h4>
                              <p className="text-sm font-light leading-relaxed text-white/20 italic">{item.d}</p>
                           </div>
                         ))}
                      </div>
                   </Reveal>
                </div>
             </div>
          </div>
        </section>

        {/* ── COLLECTIONS ────────────── */}
        <section className="py-60 bg-black">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <Reveal>
                 <div className="flex flex-col md:flex-row items-end justify-between mb-32 gap-8 border-b border-white/5 pb-16">
                    <div className="max-w-2xl">
                       <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c9a96e] block mb-6">Active Portfolio</span>
                       <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter text-white leading-none italic">The <span className="font-light not-italic opacity-10 text-white">Holdings.</span></h2>
                    </div>
                    <div className="flex gap-4">
                       <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"><ArrowRight className="w-5 h-5 rotate-180" /></button>
                       <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"><ArrowRight className="w-5 h-5" /></button>
                    </div>
                 </div>
              </Reveal>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                 {MODELS.map((item, i) => (
                   <Reveal key={i} delay={i * 0.15}>
                      <div className="group cursor-pointer">
                         <div className="aspect-[4/5] relative mb-12 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000 border border-white/5 p-2 bg-white/[0.02]">
                            <Image src={item.img} alt={item.name} fill className="object-cover group-hover:scale-110 transition-all duration-[3000ms]" />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-1000" />
                            <div className="absolute bottom-10 left-10">
                               <div className="text-[10px] font-bold uppercase tracking-widest text-[#c9a96e] mb-2 italic">Ref: 0{i+1} — ZENITH</div>
                               <h3 className="text-4xl font-bold uppercase tracking-widest text-white leading-tight">{item.name}</h3>
                            </div>
                         </div>
                         <div className="flex justify-between items-center px-2">
                            <span className="text-sm font-light text-white/30 uppercase tracking-[0.2em]">{item.cat || "Luxury Edition"}</span>
                            <span className="text-xl font-bold text-white tracking-tighter italic">{item.price}</span>
                         </div>
                      </div>
                   </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-60 bg-[#fafafa] text-black text-center px-6 border-t border-black/5 relative overflow-hidden">
           {/* Technical Schematic Background */}
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
              <Watch className="w-[800px] h-[800px] animate-spin-slow" />
           </div>
           <div className="max-w-4xl mx-auto relative z-10">
              <Reveal>
                 <div className="w-16 h-16 border-2 border-black mx-auto mb-20 flex items-center justify-center font-black text-black text-2xl uppercase">Z</div>
                 <h2 className="text-8xl md:text-[14vw] font-black uppercase tracking-tighter leading-[0.8] mb-16 italic">
                    OWN THE <br/> <span className="font-light not-italic opacity-20 text-black">ETERNAL.</span>
                 </h2>
                 <p className="text-2xl text-black/40 font-light mb-20 leading-relaxed italic max-w-2xl mx-auto">
                    Limited production runs. Each piece is individually numbered and accompanied by a digital certificate of authenticity on the Zenith mesh.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                    <button className="px-20 py-10 bg-black text-white font-black uppercase text-[10px] tracking-[0.3em] hover:px-24 transition-all duration-700 italic shadow-2xl">
                       Request Allocation
                    </button>
                    <button className="px-20 py-10 border-4 border-black text-black font-black uppercase text-[10px] tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-700 italic">
                       View Registry
                    </button>
                 </div>
              </Reveal>
           </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-black pt-40 pb-12 px-6 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
           <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-4 mb-10 group">
                <div className="w-10 h-10 border border-[#c9a96e]/30 flex items-center justify-center">
                  <Watch className="w-5 h-5 text-[#c9a96e]" />
                </div>
                <span className="text-xl font-light tracking-[0.4em] uppercase text-white">Zenith Watch</span>
              </Link>
              <p className="text-white/20 max-w-sm leading-relaxed mb-12 text-sm font-light italic">
                 "In the silence of the gears, we find the absolute rhythm of existence. Mastered in Geneva since 1892."
              </p>
              <div className="flex gap-10">
                 {["Instagram", "Journal", "Whitepapers", "Contact"].map(s => (
                   <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors italic">{s}</Link>
                 ))}
              </div>
           </div>
           
           {[
             { t: "COLLECTIONS", l: ["Caliber Series", "Heritage Line", "Deep Sea", "Limited Editions"] },
             { t: "THE ATELIER", l: ["The Movement", "Master Watchmakers", "The Legacy", "Bespoke Lab"] },
             { t: "SERVICE", l: ["Global Registry", "Maintenance", "Boutiques", "Legal"] }
           ].map((col, i) => (
             <div key={i} className="space-y-12">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/30">{col.t}</h4>
                <ul className="space-y-6">
                   {col.l.map(link => (
                     <li key={link} className="text-xs font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors italic">
                        <Link href="#">{link}</Link>
                     </li>
                   ))}
                </ul>
             </div>
           ))}
        </div>
        <div className="max-w-[1400px] mx-auto flex flex-col md:row justify-between items-center gap-8 border-t border-white/5 pt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/10 italic">
           <span>© 2026 ZENITH WATCH ATELIER SA. TIME IS AN ART.</span>
           <div className="flex gap-12">
              <Link href="#" className="hover:text-white transition-all">GENEVA</Link>
              <Link href="#" className="hover:text-white transition-all">ZURICH</Link>
              <Link href="#" className="hover:text-white transition-all">TOKYO</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}
