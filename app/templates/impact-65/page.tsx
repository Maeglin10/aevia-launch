"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Zap, ArrowRight, Menu, Star, Activity, Cpu, Globe, Gauge, Shield, ChevronRight, Binary, Layers } from "lucide-react"
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
    <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
         style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
  )
}

export default function CarbonLabPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#050505] text-[#888] font-sans min-h-screen selection:bg-[#0070f3] selection:text-white overflow-x-hidden">
      
      {/* ── CARBON TEXTURE OVERLAY ── */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-50 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-700 ${scrolled ? "bg-black/90 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-[#0070f3] flex items-center justify-center group-hover:-skew-x-12 transition-transform duration-500">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic text-white">Carbon<span className="text-[#0070f3]">Lab</span></span>
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Materials", "Dynamics", "Aerospace", "Research"].map(l => (
              <Link key={l} href="#" className="hover:text-[#0070f3] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors underline underline-offset-8 decoration-[#0070f3]/30">Engineer Portal</button>
            <button className="px-10 py-3.5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#0070f3] hover:text-white transition-all duration-500 italic">Get Quote</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden p-2"><Menu className="w-6 h-6 text-white" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#050505] border-white/5 p-12 text-white">
                <div className="flex flex-col gap-8 mt-16 text-left font-black uppercase tracking-tighter">
                  {["Performance", "Tech", "Lab", "Contact"].map(l => (
                    <Link key={l} href="#" className="text-4xl hover:text-[#0070f3] transition-all italic">{l}</Link>
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
          <GridBackground />
          <div className="absolute inset-0">
             <Image src="https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=2400" alt="High Performance Car" fill className="object-cover opacity-10 scale-110" priority />
             <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-end">
              <div>
                <Reveal>
                  <div className="inline-flex items-center gap-4 mb-12 px-6 py-2 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.5em] italic">
                    Performance Materials v9.4
                  </div>
                </Reveal>
                <Reveal delay={0.1} y={100}>
                  <h1 className="text-7xl md:text-[14vw] font-black tracking-tighter leading-[0.75] uppercase mb-16 italic text-white">
                    Beyond <br/> <span className="text-white/10 not-italic italic">Steel.</span>
                  </h1>
                </Reveal>
                <Reveal delay={0.3}>
                  <div className="flex flex-col sm:flex-row gap-12 items-center">
                    <p className="text-xl text-white/30 font-light max-w-sm leading-relaxed uppercase italic">
                      Uncompromising structural engineering. We deliver the highest strength-to-weight ratio in the industry.
                    </p>
                    <div className="h-px w-20 bg-[#0070f3] hidden sm:block" />
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white flex flex-col gap-2">
                       <span>Tensile: 4500 MPa</span>
                       <span>Density: 1.6 g/cm³</span>
                    </div>
                  </div>
                </Reveal>
              </div>
              
              <Reveal delay={0.5} y={0}>
                 <div className="relative aspect-square md:aspect-video bg-white/5 border border-white/10 overflow-hidden group">
                    <Image src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200" alt="Racing Detail" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0070f3]/20 to-transparent mix-blend-overlay" />
                    <div className="absolute bottom-10 left-10 p-8 bg-black/80 backdrop-blur-xl border border-white/10">
                       <div className="flex items-center gap-4 text-[#0070f3] mb-4 animate-pulse">
                          <Gauge className="w-5 h-5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Real-time Stress Audit</span>
                       </div>
                       <div className="text-4xl font-black italic text-white mb-2 tracking-tighter">98.4% NOMINAL</div>
                       <div className="text-[9px] font-bold uppercase tracking-widest text-white/20 italic">Vibration Damping Active</div>
                    </div>
                 </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── METRICS ────────────────── */}
        <section className="py-24 bg-[#0070f3] text-white">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-20">
             {[
               { v: "5X", l: "STRONGER THAN STEEL" },
               { v: "2X", l: "STIFFNESS RATIO" },
               { v: "-60%", l: "WEIGHT REDUCTION" },
               { v: "0.1mm", l: "PRECISION TOLERANCE" }
             ].map((m, i) => (
               <Reveal key={i} delay={i * 0.1}>
                  <div className="text-center md:text-left">
                     <div className="text-6xl font-black tracking-tighter italic mb-4">{m.v}</div>
                     <div className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-60">{m.l}</div>
                  </div>
               </Reveal>
             ))}
          </div>
        </section>

        {/* ── APPLICATIONS ───────────── */}
        <section className="py-40 bg-[#050505]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex flex-col md:flex-row items-end justify-between mb-32 gap-8 border-b border-white/5 pb-16">
                <div className="max-w-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#0070f3] block mb-6">Sector Integration</span>
                  <h2 className="text-7xl md:text-[9vw] font-black uppercase tracking-tighter text-white leading-none italic">Hard <br/> <span className="font-light not-italic opacity-10">Logic.</span></h2>
                </div>
                <button className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-[#0070f3] transition-colors group italic">
                  Full Tech Stack <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: Globe, t: "Aerospace", d: "Thermal-resistant composite structures for next-gen orbital flight and satellite chassis." },
                { icon: Activity, t: "Automotive", d: "High-rigidity monocoques and aerodynamic components for top-tier racing and hypercars." },
                { icon: Shield, t: "Defense", d: "Ballistic-grade carbon weaves optimized for maximum energy absorption and structural integrity." }
              ].map((item, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="p-16 bg-white/[0.02] border border-white/5 group hover:bg-[#0070f3] hover:text-white transition-all duration-700">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center mb-12 group-hover:bg-white group-hover:text-black transition-all duration-700 -skew-x-12">
                      <item.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-3xl font-black uppercase mb-8 tracking-tighter italic">{item.t}</h3>
                    <p className="opacity-40 leading-relaxed text-sm font-light mb-12 italic group-hover:opacity-100 transition-opacity">{item.d}</p>
                    <Link href="#" className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest group-hover:gap-8 transition-all">
                       Examine Case <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-60 bg-white text-black text-center relative overflow-hidden">
           <GridBackground />
           <div className="max-w-4xl mx-auto px-6 relative z-10">
              <Reveal>
                 <h2 className="text-8xl md:text-[15vw] font-black uppercase tracking-tighter leading-[0.8] mb-16 italic">
                    Build <br/> <span className="font-light not-italic opacity-20 text-black">Fast.</span>
                 </h2>
                 <p className="text-2xl text-black/40 font-light mb-20 leading-relaxed italic max-w-2xl mx-auto">
                    Transform your structural requirements into high-performance assets. We are currently accepting R&D partnerships for Q3 2026.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
                    <button className="px-24 py-10 bg-black text-white font-black uppercase text-[10px] tracking-[0.3em] hover:px-28 transition-all duration-700 italic -skew-x-12">
                       Request Lab Audit
                    </button>
                    <button className="px-24 py-10 border-4 border-black text-black font-black uppercase text-[10px] tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-700 italic -skew-x-12">
                       View Materials
                    </button>
                 </div>
              </Reveal>
           </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#050505] pt-32 pb-12 px-6 border-t border-white/5 font-sans relative z-[60]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
           <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-4 mb-10 group">
                <div className="w-10 h-10 bg-[#0070f3] flex items-center justify-center -skew-x-12">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase text-white italic">Carbon Lab.</span>
              </Link>
              <p className="text-white/20 max-w-sm leading-relaxed mb-12 text-[10px] font-bold uppercase italic">
                 "Materials define the limit. We push the limit. Engineering the foundation of future performance."
              </p>
              <div className="flex gap-10">
                 {["LinkedIn", "Journal", "SLA Reports", "Network"].map(s => (
                   <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-[#0070f3] transition-colors italic">{s}</Link>
                 ))}
              </div>
           </div>
           
           {[
             { t: "MATERIALS", l: ["UD Carbon", "Woven Weave", "Forged Composite", "Hybrid Mesh"] },
             { t: "INDUSTRIES", l: ["Formula 1", "Orbital Hub", "Marine Tech", "Performance Cycle"] },
             { t: "RESOURCES", l: ["Lab Data", "Safety Sheets", "Global Distribution", "Contact"] }
           ].map((col, i) => (
             <div key={i} className="space-y-12">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#0070f3]/40">{col.t}</h4>
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
           <span>© 2026 CARBON LAB ADVANCED MATERIALS AG. STRENGTH IN WEIGHT.</span>
           <div className="flex gap-12">
              <Link href="#" className="hover:text-white transition-all underline decoration-[#0070f3]/30">ISO_9001: CERTIFIED</Link>
              <Link href="#" className="hover:text-white transition-all underline decoration-[#0070f3]/30">SYSTEM_NOMINAL</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}
