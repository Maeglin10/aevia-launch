"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Globe, ArrowRight, Menu, Star, Activity, Cpu, Satellite, Zap, Radio, Shield, ChevronRight, Binary, Terminal } from "lucide-react"
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
         style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
  )
}

export default function OrbitAIPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#050810] text-[#a0a0a0] font-mono min-h-screen selection:bg-cyan-500 selection:text-white overflow-x-hidden">
      
      {/* ── MISSION CONTROL OVERLAY ── */}
      <div className="fixed inset-0 pointer-events-none z-[60] border-[40px] border-[#050810] opacity-40 md:opacity-100" />
      <div className="fixed top-20 left-20 pointer-events-none text-[10px] font-bold text-cyan-500/20 uppercase tracking-widest z-[70] hidden lg:block">
         Orbit_AI // Mission_Control_Active
      </div>

      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#050810]/95 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-cyan-500 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Satellite className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase text-white italic">Orbit<span className="text-cyan-500">AI</span></span>
          </Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
            {["Constellation", "Intelligence", "Security", "Telemetry"].map(l => (
              <Link key={l} href="#" className="hover:text-cyan-500 transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors underline underline-offset-8 decoration-cyan-500/30">Network Status</button>
            <button className="px-10 py-3.5 border border-cyan-500/40 text-cyan-500 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-cyan-500 hover:text-black transition-all duration-500">Initiate Uplink</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden p-2"><Menu className="w-6 h-6 text-white" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#050810] border-white/5 p-12 text-white font-mono">
                <div className="flex flex-col gap-10 mt-16 text-left font-black uppercase tracking-tighter">
                  {["System", "Data", "Global", "Contact"].map(l => (
                    <Link key={l} href="#" className="text-4xl hover:text-cyan-500 transition-all italic">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* ── HERO ──────────────────── */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <GridBackground />
          <div className="absolute inset-0">
             <Image src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=2400" alt="Earth from Space" fill className="object-cover opacity-20 scale-110" priority />
             <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-[#050810]/50" />
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full text-center lg:text-left">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <Reveal>
                  <div className="inline-flex items-center gap-4 mb-10 text-cyan-500 text-[10px] font-bold uppercase tracking-[0.5em] italic">
                    <Terminal className="w-4 h-4" /> Global_Uplink_Established
                  </div>
                </Reveal>
                <Reveal delay={0.1} y={100}>
                  <h1 className="text-7xl md:text-[12vw] font-black tracking-tighter leading-[0.8] uppercase mb-16 italic text-white">
                    Eyes <br/> <span className="text-white/10 not-italic">Universal.</span>
                  </h1>
                </Reveal>
                <Reveal delay={0.3}>
                  <p className="text-xl text-white/30 font-light max-w-xl leading-relaxed italic uppercase mb-16">
                    Deploying the world's most advanced autonomous satellite constellation for real-time global intelligence.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-10 items-center justify-center lg:justify-start">
                    <button className="px-16 py-6 bg-cyan-500 text-black font-black uppercase tracking-widest text-[10px] hover:px-20 transition-all duration-700 shadow-[0_0_40px_rgba(6,182,212,0.2)]">
                       Acquire Data Stream
                    </button>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/20 flex items-center gap-4 group cursor-pointer hover:text-white transition-colors">
                       Live Telemetry <Radio className="w-5 h-5 text-cyan-500 animate-pulse" />
                    </div>
                  </div>
                </Reveal>
              </div>
              
              <Reveal delay={0.5} y={0}>
                 <div className="relative p-10 bg-white/5 border border-white/10 rounded shadow-2xl overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 text-cyan-500/20">
                       <Radio className="w-40 h-40 animate-ping" />
                    </div>
                    <div className="relative z-10 space-y-12">
                       <div className="flex justify-between border-b border-white/5 pb-8">
                          <div className="text-xs font-black text-cyan-500 tracking-widest uppercase italic">Network Overview</div>
                          <div className="text-[10px] text-white/30 uppercase tracking-widest">v4.0.2</div>
                       </div>
                       <div className="grid grid-cols-2 gap-12">
                          {[
                            { l: "Satellites Active", v: "1,242" },
                            { l: "Global Latency", v: "14ms" },
                            { l: "Data Throughput", v: "4.2 PB/s" },
                            { l: "Security Level", v: "Quantum" }
                          ].map((stat, i) => (
                            <div key={i}>
                               <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest mb-2 italic">{stat.l}</div>
                               <div className="text-2xl font-black text-white italic tracking-tighter">{stat.v}</div>
                            </div>
                          ))}
                       </div>
                       <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-[30%] h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                       </div>
                    </div>
                 </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── INTELLIGENCE ──────────── */}
        <section className="py-60 bg-[#050810] border-y border-white/5">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <Reveal>
                 <div className="text-center mb-32 max-w-4xl mx-auto">
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-cyan-500 block mb-10 italic">Intelligence Engine</span>
                    <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-white leading-[0.8] italic mb-12">Universal <br/> <span className="not-italic font-light opacity-10">Analysis.</span></h2>
                    <p className="text-xl text-white/30 italic font-light leading-relaxed">
                       Our proprietary AI models process petabytes of multi-spectral imagery every hour to detect sub-metric changes in infrastructure, maritime traffic, and environmental health.
                    </p>
                 </div>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5">
                 {[
                   { icon: Activity, t: "Real-time Delta", d: "Detecting changes in terrain and infrastructure with 99.9% accuracy." },
                   { icon: Globe, t: "Maritime Flow", d: "Global vessel tracking with predictive route analysis and port optimization." },
                   { icon: Shield, t: "Asset Integrity", d: "High-frequency monitoring for industrial hubs and remote energy assets." }
                 ].map((item, i) => (
                   <Reveal key={i} delay={i * 0.1}>
                      <div className="p-16 bg-[#050810] group hover:bg-cyan-500 transition-all duration-700 cursor-crosshair">
                         <div className="w-16 h-16 border border-white/10 flex items-center justify-center mb-12 group-hover:bg-black group-hover:border-black transition-all duration-700 shadow-xl">
                            <item.icon className="w-7 h-7 text-cyan-500" />
                         </div>
                         <h3 className="text-3xl font-black uppercase mb-8 tracking-tighter italic group-hover:text-black">{item.t}</h3>
                         <p className="text-white/20 text-sm font-light italic leading-relaxed mb-12 group-hover:text-black/60 transition-colors">{item.d}</p>
                         <Link href="#" className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest group-hover:gap-8 transition-all group-hover:text-black">
                            Examine Protocol <ChevronRight className="w-4 h-4" />
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
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none select-none overflow-hidden whitespace-nowrap text-[20vw] font-black italic -rotate-12">
              UPLINK UPLINK UPLINK UPLINK UPLINK
           </div>
           <div className="max-w-4xl mx-auto px-6 relative z-10">
              <Reveal>
                 <h2 className="text-8xl md:text-[14vw] font-black uppercase tracking-tighter leading-[0.8] mb-16 italic">
                    Initiate <br/> <span className="font-light not-italic opacity-20 text-black">Mission.</span>
                 </h2>
                 <p className="text-2xl text-black/40 font-light mb-20 leading-relaxed italic max-w-2xl mx-auto">
                    Transform your situational awareness with high-fidelity orbital data. Deploy your custom constellation in under 90 days.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                    <button className="px-20 py-10 bg-black text-white font-black uppercase text-[10px] tracking-[0.3em] hover:px-24 transition-all duration-700 italic shadow-2xl">
                       Request Launch Profile
                    </button>
                    <button className="px-20 py-10 border-4 border-black text-black font-black uppercase text-[10px] tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-700 italic">
                       View Constellation Map
                    </button>
                 </div>
              </Reveal>
           </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#050810] pt-40 pb-12 px-6 border-t border-white/5 relative z-[70]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
           <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-4 mb-10 group">
                <div className="w-10 h-10 bg-cyan-500 flex items-center justify-center">
                  <Satellite className="w-6 h-6 text-black" />
                </div>
                <span className="text-xl font-bold tracking-tighter uppercase text-white italic">Orbit AI.</span>
              </Link>
              <p className="text-white/20 max-w-sm leading-relaxed mb-12 text-[10px] font-bold uppercase italic">
                 "Situational awareness is no longer a luxury. It is the primary variable of global leadership. Master the orbit."
              </p>
              <div className="flex gap-10">
                 {["GitHub", "Vimeo", "Whitepapers", "Network"].map(s => (
                   <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-cyan-500 transition-colors italic">{s}</Link>
                 ))}
              </div>
           </div>
           
           {[
             { t: "CONSTELLATION", l: ["Orbit_01: LEO", "Orbit_02: MEO", "Custom Nodes", "Ground Stations"] },
             { t: "INTELLIGENCE", l: ["Maritime Lab", "Energy Audit", "Defense Intel", "Global Health"] },
             { t: "SYSTEM", l: ["Mission Control", "Security Protocol", "Legal Hub", "Contact"] }
           ].map((col, i) => (
             <div key={i} className="space-y-12">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.6em] text-cyan-500/40">{col.t}</h4>
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
           <span>© 2026 ORBIT AI GLOBAL NETWORK AG. THE UNIVERSAL EYE.</span>
           <div className="flex gap-12">
              <Link href="#" className="hover:text-cyan-500 transition-all underline decoration-cyan-500/20">UPLINK: ACTIVE</Link>
              <Link href="#" className="hover:text-cyan-500 transition-all underline decoration-cyan-500/20">SECURITY_LEVEL: OMEGA</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}
