"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { Truck, ArrowRight, Menu, Star, Shield, Activity, Globe, Anchor, Box, ChevronRight, MoveRight, MapPin, Gauge } from "lucide-react"
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

export default function TitanLogisticsPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#0c0c0c] text-white font-sans min-h-screen selection:bg-yellow-400 selection:text-black overflow-x-hidden">
      
      {/* ── INDUSTRIAL OVERLAY ───── */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#0c0c0c]/95 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center group-hover:-skew-x-12 transition-transform duration-500">
              <Truck className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">Titan<span className="text-yellow-400">Logistics</span></span>
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Fleet", "Network", "Tracking", "Partners"].map(l => (
              <Link key={l} href="#" className="hover:text-yellow-400 transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors underline underline-offset-8 decoration-yellow-400/30">Client Portal</button>
            <button className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-yellow-400 transition-all duration-500">Inquire Freight</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden p-2"><Menu className="w-6 h-6 text-white" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#0c0c0c] border-white/5 p-12 text-white font-sans">
                <div className="flex flex-col gap-8 mt-16 text-left">
                  {["Fleet", "Routes", "Company", "Contact"].map(l => (
                    <Link key={l} href="#" className="text-4xl font-black uppercase tracking-tighter hover:text-yellow-400 transition-all italic">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ──────────────────── */}
        <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
          {/* Background Industrial Shape */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-[0.02] -rotate-12 pointer-events-none">
             <Anchor className="w-full h-full" />
          </div>
          
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-end">
              <div>
                <Reveal>
                  <div className="inline-flex items-center gap-4 mb-12 px-5 py-2 bg-yellow-400 text-black text-[10px] font-black uppercase tracking-[0.4em] -skew-x-12">
                    Global Distribution Network v10.0
                  </div>
                </Reveal>
                <Reveal delay={0.1} y={100}>
                  <h1 className="text-7xl md:text-[11vw] font-black tracking-tighter leading-[0.75] uppercase mb-12 italic">
                    Heavy <br/> <span className="text-white/20 not-italic">Engine.</span>
                  </h1>
                </Reveal>
                <Reveal delay={0.3}>
                  <p className="text-xl text-white/40 font-light max-w-lg leading-relaxed mb-12 uppercase italic">
                    Uncompromising industrial logistics. We move the weight that drives the global economy with surgical reliability.
                  </p>
                </Reveal>
                <Reveal delay={0.4}>
                  <div className="flex flex-col sm:flex-row gap-8">
                    <button className="px-12 py-5 bg-yellow-400 text-black font-black uppercase tracking-widest text-[10px] hover:px-16 transition-all duration-700">
                       Mobilize Freight
                    </button>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-4 group cursor-pointer hover:text-white transition-colors">
                       <Gauge className="w-5 h-5 text-yellow-400" /> System Uptime: 99.9% <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-all" />
                    </div>
                  </div>
                </Reveal>
              </div>
              
              <Reveal delay={0.5} y={0}>
                 <div className="relative p-1 bg-white/5 border border-white/10 rounded-sm">
                    <div className="bg-[#151515] p-10 font-mono text-[10px] text-white/30 space-y-6">
                       <div className="flex justify-between border-b border-white/5 pb-4">
                          <span className="text-yellow-400">MANIFEST: ID-8829</span>
                          <span>STABLE</span>
                       </div>
                       <div className="space-y-2">
                          <p>&gt; routing cargo to rotterdam...</p>
                          <p>&gt; capacity audit: 94% optimal.</p>
                          <p className="text-white">&gt; global network synchronized.</p>
                       </div>
                       <div className="grid grid-cols-4 gap-2">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="aspect-square bg-white/5 border border-white/10 flex items-center justify-center">
                               <Box className="w-4 h-4 opacity-20" />
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── TICKER ────────────────── */}
        <section className="py-12 bg-yellow-400 text-black overflow-hidden flex items-center border-y-4 border-black">
           <motion.div 
             animate={{ x: ["0%", "-50%"] }} 
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="flex gap-20 whitespace-nowrap text-5xl font-black uppercase italic tracking-tighter"
           >
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center gap-10">
                   <span>Air Freight</span>
                   <div className="w-4 h-4 bg-black rotate-45" />
                   <span>Sea Cargo</span>
                   <div className="w-4 h-4 bg-black rotate-45" />
                   <span>Land Logistics</span>
                   <div className="w-4 h-4 bg-black rotate-45" />
                </div>
              ))}
           </motion.div>
        </section>

        {/* ── THE FLEET ─────────────── */}
        <section className="py-40 bg-[#0c0c0c]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex flex-col md:flex-row items-end justify-between mb-32 gap-8 border-b-2 border-white/5 pb-16">
                <div className="max-w-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-yellow-400 block mb-6">Operations Hub</span>
                  <h2 className="text-6xl md:text-[9vw] font-black uppercase tracking-tighter text-white leading-none italic">Massive <br/> <span className="font-light not-italic opacity-10">Scale.</span></h2>
                </div>
                <button className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-yellow-400 transition-colors group">
                  Fleet Inventory <MoveRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/5">
              {[
                { icon: Globe, t: "Trans-Continental", d: "Seamless cargo transition across major oceans and borders with unified tracking." },
                { icon: Shield, t: "Asset Integrity", d: "High-security operational protocols for temperature-sensitive and high-value freight." },
                { icon: Gauge, t: "Flow Dynamics", d: "Proprietary AI-driven routing that optimizes delivery times by up to 24%." }
              ].map((item, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className={`p-16 flex flex-col h-full border-white/5 group hover:bg-white/[0.02] transition-colors ${i < 2 ? "md:border-r" : ""}`}>
                    <div className="w-20 h-20 bg-white/5 border border-white/10 flex items-center justify-center mb-12 group-hover:bg-yellow-400 group-hover:text-black transition-all duration-700 -skew-x-12">
                      <item.icon className="w-8 h-8" />
                    </div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-white/20 mb-4 italic">Protocol: T-0{i+1}</div>
                    <h3 className="text-4xl font-black uppercase mb-8 tracking-tighter italic">{item.t}</h3>
                    <p className="text-white/30 leading-relaxed text-sm font-light mb-12 italic">{item.d}</p>
                    <Link href="#" className="mt-auto flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest group-hover:gap-8 transition-all hover:text-yellow-400">
                       Examine Logistics <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-60 bg-white text-black text-center relative overflow-hidden">
           {/* Industrial Grid Background */}
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <Reveal>
              <h2 className="text-7xl md:text-[14vw] font-black uppercase tracking-tighter leading-[0.75] mb-16 italic">
                Move <br/> <span className="font-light not-italic opacity-20 text-black">The Weight.</span>
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
                <button className="px-20 py-10 bg-black text-white font-black uppercase tracking-widest text-xs hover:px-24 transition-all duration-700 italic -skew-x-12">
                   Contact Logistics Command
                </button>
                <button className="px-20 py-10 border-4 border-black text-black font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all duration-700 italic -skew-x-12">
                   View Fleet Map
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#0c0c0c] pt-32 pb-12 px-6 border-t border-white/5 font-sans">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
           <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-4 mb-10 group">
                <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center -skew-x-12">
                  <Truck className="w-6 h-6 text-black" />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase text-white italic">Titan<span className="text-yellow-400">Logistics</span></span>
              </Link>
              <p className="text-white/20 max-w-sm leading-relaxed mb-12 text-[10px] font-bold uppercase italic">
                 "Reliability isn't a goal. It's the only variable that matters. We are the engine of industrial momentum."
              </p>
              <div className="flex gap-10">
                 {["LinkedIn", "Journal", "SLA Reports", "Network"].map(s => (
                   <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-yellow-400 transition-colors underline underline-offset-8 decoration-yellow-400/10">{s}</Link>
                 ))}
              </div>
           </div>
           
           {[
             { t: "SERVICES", l: ["Heavy Freight", "Air Cargo", "Sea Logistics", "Customs"] },
             { t: "OPERATIONS", l: ["Fleet Status", "Route Audit", "Safety Lab", "Global Nodes"] },
             { t: "COMPANY", l: ["Manifesto", "Careers", "Investors", "Contact"] }
           ].map((col, i) => (
             <div key={i} className="space-y-12">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] text-yellow-400/40">{col.t}</h4>
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
           <span>© 2026 TITAN LOGISTICS GLOBAL GROUP. BUILT FOR WEIGHT.</span>
           <div className="flex gap-12">
              <Link href="#" className="hover:text-yellow-400 transition-all">TERMINAL_01: NOMINAL</Link>
              <Link href="#" className="hover:text-yellow-400 transition-all">VESSEL_TRACKING: ACTIVE</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}