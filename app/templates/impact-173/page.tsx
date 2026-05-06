"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Zap, ArrowRight, Menu, Star, Shield, Activity, Globe, Radio, ChevronRight, Binary, Terminal, Sun, Wind, Droplets } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function Reveal({ children, delay = 0, y = 30 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" 
         style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />
  )
}

export default function KryptonEnergyPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#fcfcfc] text-[#4a4a4a] font-sans min-h-screen selection:bg-[#ccff00] selection:text-black overflow-x-hidden">
      
      {/* ── ENERGY PULSE OVERLAY ──── */}
      <div className="fixed inset-0 pointer-events-none z-[60] border-[20px] border-white/40 hidden lg:block" />

      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-white/80 backdrop-blur-xl border-b border-black/5 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-[#ccff00] flex items-center justify-center group-hover:skew-x-12 transition-transform duration-500 shadow-[0_0_20px_rgba(204,255,0,0.3)]">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase text-[#1a1a1a] italic">Krypton<span className="text-[#ccff00]">Energy</span></span>
          </Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-black/30">
            {["Solar", "Hydrogen", "Storage", "Impact"].map(l => (
              <Link key={l} href="#" className="hover:text-black transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-black/20 hover:text-black transition-colors underline underline-offset-8 decoration-[#ccff00]">Carbon Portal</button>
            <button className="px-10 py-3.5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#ccff00] hover:text-black transition-all duration-500 italic shadow-lg shadow-black/5">Energize Future</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden p-2"><Menu className="w-6 h-6 text-black" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-white border-none p-12 text-black font-sans">
                <div className="flex flex-col gap-10 mt-16 text-left font-black uppercase tracking-tighter italic">
                  {["Systems", "Nodes", "Network", "Contact"].map(l => (
                    <Link key={l} href="#" className="text-4xl hover:text-[#ccff00] transition-all">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* ── HERO ──────────────────── */}
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
          <GridBackground />
          <div className="absolute inset-0">
             <Image src="https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?auto=format&fit=crop&q=80&w=2400" alt="Solar Farm" fill className="object-cover opacity-10 scale-110 grayscale" priority />
             <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/50" />
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <Reveal>
                  <div className="inline-flex items-center gap-4 mb-10 text-[#ccff00] bg-black px-4 py-2 text-[10px] font-bold uppercase tracking-[0.5em] italic -skew-x-12">
                     Sustainable_Grid_v10.0
                  </div>
                </Reveal>
                <Reveal delay={0.1} y={100}>
                  <h1 className="text-7xl md:text-[14vw] font-black tracking-tighter leading-[0.75] uppercase mb-16 italic text-[#1a1a1a]">
                    PURE <br/> <span className="text-black/5 not-italic italic">POWΞR.</span>
                  </h1>
                </Reveal>
                <Reveal delay={0.3}>
                  <p className="text-xl text-black/40 font-light max-w-xl leading-relaxed italic uppercase mb-16">
                    Engineering the foundation for the world's most resilient renewable infrastructure. High-fidelity energy solutions for the next century.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-10 items-center justify-center lg:justify-start">
                    <button className="px-16 py-6 bg-black text-white font-black uppercase tracking-widest text-[10px] hover:px-20 transition-all duration-700 italic -skew-x-12 shadow-2xl">
                       Inquire Infrastructure
                    </button>
                    <div className="text-[10px] font-black uppercase tracking-widest text-black/20 flex items-center gap-4 group cursor-pointer hover:text-black transition-colors">
                       Live Grid Output <Radio className="w-5 h-5 text-[#ccff00] animate-pulse" />
                    </div>
                  </div>
                </Reveal>
              </div>
              
              <Reveal delay={0.5} y={0}>
                 <div className="relative p-10 bg-white border border-black/5 rounded-sm shadow-[0_40px_100px_rgba(0,0,0,0.05)] overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 text-black/5">
                       <Zap className="w-60 h-60 animate-pulse" />
                    </div>
                    <div className="relative z-10 space-y-12">
                       <div className="flex justify-between border-b border-black/5 pb-8">
                          <div className="text-xs font-black text-black tracking-widest uppercase italic">Operational Status</div>
                          <div className="text-[10px] text-green-500 uppercase tracking-widest italic animate-pulse">Grid_Stable_100%</div>
                       </div>
                       <div className="grid grid-cols-2 gap-12">
                          {[
                            { l: "GW/h Active", v: "14.2" },
                            { l: "Carbon Offset", v: "124M t" },
                            { l: "Global Nodes", v: "842" },
                            { l: "SLA Uptime", v: "100%" }
                          ].map((stat, i) => (
                            <div key={i}>
                               <div className="text-[8px] font-bold text-black/20 uppercase tracking-widest mb-2 italic">{stat.l}</div>
                               <div className="text-3xl font-black text-[#1a1a1a] italic tracking-tighter">{stat.v}</div>
                            </div>
                          ))}
                       </div>
                       <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                          <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="w-[40%] h-full bg-[#ccff00]" />
                       </div>
                    </div>
                 </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── TECHNOLOGY ──────────────── */}
        <section className="py-60 bg-white border-y border-black/5">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <Reveal>
                 <div className="flex flex-col lg:flex-row items-end justify-between mb-32 gap-8 border-b-2 border-black/5 pb-16">
                    <div className="max-w-2xl text-left">
                       <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#ccff00] bg-black px-4 py-1 inline-block mb-6 italic -skew-x-12">System Architecture</span>
                       <h2 className="text-6xl md:text-[9vw] font-black uppercase tracking-tighter text-[#1a1a1a] leading-none italic">Hard <br/> <span className="font-light not-italic opacity-10">Energy.</span></h2>
                    </div>
                    <button className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors group italic">
                       Full Portfolio <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                 </div>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/5 border border-black/5">
                 {[
                   { icon: Sun, t: "Spectral Solar", d: "High-density photovoltaic arrays optimized for maximum spectral absorption and lifespan." },
                   { icon: Droplets, t: "Green Hydrogen", d: "Zero-emission electrolysis hubs producing high-purity hydrogen for industrial scaling." },
                   { icon: Wind, t: "Grid Storage", d: "Giga-scale kinetic and chemical storage systems for absolute power sovereignty." }
                 ].map((item, i) => (
                   <Reveal key={i} delay={i * 0.1}>
                      <div className="p-16 bg-white group hover:bg-black transition-all duration-700 cursor-crosshair overflow-hidden relative">
                         <div className="w-16 h-16 border border-black/10 flex items-center justify-center mb-12 group-hover:bg-[#ccff00] group-hover:border-[#ccff00] transition-all duration-700 -skew-x-12">
                            <item.icon className="w-7 h-7 text-black" />
                         </div>
                         <h3 className="text-3xl font-black uppercase mb-8 tracking-tighter italic group-hover:text-white transition-colors">{item.t}</h3>
                         <p className="text-black/30 text-sm font-light italic leading-relaxed mb-12 group-hover:text-white/40 transition-colors">{item.d}</p>
                         <Link href="#" className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest group-hover:gap-8 transition-all group-hover:text-[#ccff00]">
                            Examine System <ChevronRight className="w-4 h-4" />
                         </Link>
                         <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/5 blur-[60px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                   </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-60 bg-[#ccff00] text-black text-center relative overflow-hidden">
           <GridBackground />
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none select-none overflow-hidden whitespace-nowrap text-[20vw] font-black italic -rotate-12">
              KRYPTON KRYPTON KRYPTON KRYPTON
           </div>
           <div className="max-w-4xl mx-auto px-6 relative z-10">
              <Reveal>
                 <h2 className="text-8xl md:text-[14vw] font-black uppercase tracking-tighter leading-[0.8] mb-16 italic">
                    Initiate <br/> <span className="font-light not-italic opacity-20 text-black italic">Future.</span>
                 </h2>
                 <p className="text-2xl text-black/60 font-light mb-20 leading-relaxed italic max-w-2xl mx-auto uppercase">
                    Stop decaying. Start energizing. Secure your position in the new energy hierarchy today.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                    <button className="px-24 py-10 bg-black text-white font-black uppercase text-[10px] tracking-[0.3em] hover:px-28 transition-all duration-700 italic -skew-x-12 shadow-2xl">
                       Provision My Grid
                    </button>
                    <button className="px-24 py-10 border-4 border-black text-black font-black uppercase text-[10px] tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-700 italic">
                       View Regional Reports
                    </button>
                 </div>
              </Reveal>
           </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-white pt-40 pb-12 px-6 border-t border-black/5 relative z-50">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
           <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-4 mb-10 group">
                <div className="w-10 h-10 bg-[#ccff00] flex items-center justify-center">
                  <Zap className="w-6 h-6 text-black" />
                </div>
                <span className="text-xl font-black tracking-tighter uppercase text-[#1a1a1a] italic">Krypton Energy.</span>
              </Link>
              <p className="text-black/20 max-w-sm leading-relaxed mb-12 text-[10px] font-bold uppercase italic">
                 "Power is the only variable that defines the hierarchy of progress. We master the sun."
              </p>
              <div className="flex gap-10">
                 {["LinkedIn", "Journal", "Solar Map", "Atelier"].map(s => (
                   <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-black/20 hover:text-black transition-colors italic">{s}</Link>
                 ))}
              </div>
           </div>
           
           {[
             { t: "INFRASTRUCTURE", l: ["Solar Farm Alpha", "Hydrogen Hubs", "Grid Storage", "Edge Nodes"] },
             { t: "SOLUTIONS", l: ["City Power", "Industrial Grid", "Sovereign Energy", "Carbon Trade"] },
             { t: "ENTITY", l: ["Mission Control", "Legal Hub", "SLA Reports", "Contact"] }
           ].map((col, i) => (
             <div key={i} className="space-y-12">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.6em] text-black/20">{col.t}</h4>
                <ul className="space-y-6">
                   {col.l.map(link => (
                     <li key={link} className="text-xs font-bold uppercase tracking-widest text-black/30 hover:text-black transition-colors italic">
                        <Link href="#">{link}</Link>
                     </li>
                   ))}
                </ul>
             </div>
           ))}
        </div>
        <div className="max-w-[1400px] mx-auto flex flex-col md:row justify-between items-center gap-8 border-t border-black/5 pt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-black/10 italic">
           <span>© 2026 KRYPTON ENERGY SOLUTIONS AG. THE GRID IS ETERNAL.</span>
           <div className="flex gap-12">
              <Link href="#" className="hover:text-black transition-all underline decoration-[#ccff00]">SYSTEM_NOMINAL</Link>
              <Link href="#" className="hover:text-black transition-all underline decoration-[#ccff00]">CAPACITY: 100%</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}
