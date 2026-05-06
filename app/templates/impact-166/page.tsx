"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Cpu, ArrowRight, Menu, Star, Shield, Activity, Globe, Zap, Radio, ChevronRight, Binary, Terminal, Server } from "lucide-react"
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
         style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
  )
}

export default function AetherCloudPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#050810] text-[#a0a0a0] font-mono min-h-screen selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* ── DATA TRAILS OVERLAY ───── */}
      <div className="fixed inset-0 pointer-events-none z-[60] border-[20px] border-[#050810] opacity-40 md:opacity-100" />

      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#050810]/95 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-blue-600 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase text-white italic">Aether<span className="text-blue-600">Cloud</span></span>
          </Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
            {["Infrastructure", "Compute", "Security", "Uptime"].map(l => (
              <Link key={l} href="#" className="hover:text-blue-600 transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors underline underline-offset-8 decoration-blue-600/30">Console Login</button>
            <button className="px-10 py-3.5 border border-blue-600/40 text-blue-600 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all duration-500">Deploy Cluster</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden p-2"><Menu className="w-6 h-6 text-white" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#050810] border-white/5 p-12 text-white font-mono">
                <div className="flex flex-col gap-10 mt-16 text-left font-black uppercase tracking-tighter">
                  {["System", "Nodes", "Network", "Contact"].map(l => (
                    <Link key={l} href="#" className="text-4xl hover:text-blue-600 transition-all italic">{l}</Link>
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
             <Image src="https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=2400" alt="Server Room" fill className="object-cover opacity-10 scale-110 grayscale" priority />
             <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-[#050810]/50" />
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full text-center lg:text-left">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <Reveal>
                  <div className="inline-flex items-center gap-4 mb-10 text-blue-600 text-[10px] font-bold uppercase tracking-[0.5em] italic">
                    <Terminal className="w-4 h-4" /> Global_Node_Active_v2.4
                  </div>
                </Reveal>
                <Reveal delay={0.1} y={100}>
                  <h1 className="text-7xl md:text-[12vw] font-black tracking-tighter leading-[0.8] uppercase mb-16 italic text-white">
                    Future <br/> <span className="text-white/10 not-italic">Compute.</span>
                  </h1>
                </Reveal>
                <Reveal delay={0.3}>
                  <p className="text-xl text-white/30 font-light max-w-xl leading-relaxed italic uppercase mb-16">
                    Engineering the foundation for the world's most demanding neural networks and industrial clusters.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-10 items-center justify-center lg:justify-start">
                    <button className="px-16 py-6 bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] hover:px-20 transition-all duration-700 shadow-[0_0_40px_rgba(37,99,235,0.2)]">
                       Provision Compute
                    </button>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/20 flex items-center gap-4 group cursor-pointer hover:text-white transition-colors">
                       Live Node Metrics <Radio className="w-5 h-5 text-blue-600 animate-pulse" />
                    </div>
                  </div>
                </Reveal>
              </div>
              
              <Reveal delay={0.5} y={0}>
                 <div className="relative p-10 bg-white/5 border border-white/10 rounded shadow-2xl overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 text-blue-600/20">
                       <Server className="w-40 h-40 animate-pulse opacity-20" />
                    </div>
                    <div className="relative z-10 space-y-12">
                       <div className="flex justify-between border-b border-white/5 pb-8">
                          <div className="text-xs font-black text-blue-600 tracking-widest uppercase italic">Infrastructure Stats</div>
                          <div className="text-[10px] text-white/30 uppercase tracking-widest italic">Stable</div>
                       </div>
                       <div className="grid grid-cols-2 gap-12">
                          {[
                            { l: "Nodes Active", v: "14,242" },
                            { l: "Global Latency", v: "8.2ms" },
                            { l: "Data Transfer", v: "12 PB/h" },
                            { l: "Uptime SLA", v: "99.999%" }
                          ].map((stat, i) => (
                            <div key={i}>
                               <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest mb-2 italic">{stat.l}</div>
                               <div className="text-2xl font-black text-white italic tracking-tighter">{stat.v}</div>
                            </div>
                          ))}
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-[30%] h-full bg-blue-600" />
                       </div>
                    </div>
                 </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── INFRASTRUCTURE ────────── */}
        <section className="py-60 bg-[#050810] border-y border-white/5">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <Reveal>
                 <div className="flex flex-col lg:flex-row items-end justify-between mb-32 gap-8 border-b border-white/5 pb-16">
                    <div className="max-w-2xl text-left">
                       <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-blue-600 block mb-6 italic">Engineering Core</span>
                       <h2 className="text-6xl md:text-[9vw] font-black uppercase tracking-tighter text-white leading-none italic">Hard <br/> <span className="font-light not-italic opacity-10">Metal.</span></h2>
                    </div>
                    <button className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-blue-600 transition-colors group italic">
                       Examine Full Stack <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                 </div>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5">
                 {[
                   { icon: Cpu, t: "H100 Clusters", d: "High-density GPU arrays optimized for massive neural training and inference." },
                   { icon: Globe, t: "Edge Nodes", d: "Ultra-low latency distribution network deployed in 42 Tier-4 global hubs." },
                   { icon: Shield, t: "Quantum Vault", d: "Post-quantum encryption layers for absolute data sovereignty and security." }
                 ].map((item, i) => (
                   <Reveal key={i} delay={i * 0.1}>
                      <div className="p-16 bg-[#050810] group hover:bg-blue-600 transition-all duration-700 cursor-crosshair">
                         <div className="w-16 h-16 border border-white/10 flex items-center justify-center mb-12 group-hover:bg-black group-hover:border-black transition-all duration-700 shadow-xl">
                            <item.icon className="w-7 h-7 text-blue-600" />
                         </div>
                         <h3 className="text-3xl font-black uppercase mb-8 tracking-tighter italic group-hover:text-black">{item.t}</h3>
                         <p className="text-white/20 text-sm font-light italic leading-relaxed mb-12 group-hover:text-black/60 transition-colors">{item.d}</p>
                         <Link href="#" className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest group-hover:gap-8 transition-all group-hover:text-black">
                            Examine System <ChevronRight className="w-4 h-4" />
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
              COMPUTE COMPUTE COMPUTE COMPUTE
           </div>
           <div className="max-w-4xl mx-auto px-6 relative z-10">
              <Reveal>
                 <h2 className="text-8xl md:text-[14vw] font-black uppercase tracking-tighter leading-[0.8] mb-16 italic">
                    Initiate <br/> <span className="font-light not-italic opacity-20 text-black">Cluster.</span>
                 </h2>
                 <p className="text-2xl text-black/40 font-light mb-20 leading-relaxed italic max-w-2xl mx-auto">
                    Provision your high-fidelity infrastructure in seconds. Scalable, secure, and engineered for the next decade of compute.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                    <button className="px-20 py-10 bg-black text-white font-black uppercase text-[10px] tracking-[0.3em] hover:px-24 transition-all duration-700 italic shadow-2xl">
                       Provision Infrastructure
                    </button>
                    <button className="px-20 py-10 border-4 border-black text-black font-black uppercase text-[10px] tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-700 italic">
                       View Regional Pricing
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
                <div className="w-10 h-10 bg-blue-600 flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tighter uppercase text-white italic">Aether Cloud.</span>
              </Link>
              <p className="text-white/20 max-w-sm leading-relaxed mb-12 text-[10px] font-bold uppercase italic">
                 "Computational power is the primary resource of the new era. We mine the future."
              </p>
              <div className="flex gap-10">
                 {["GitHub", "Vimeo", "Status", "Network"].map(s => (
                   <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-blue-600 transition-colors italic">{s}</Link>
                 ))}
              </div>
           </div>
           
           {[
             { t: "INFRASTRUCTURE", l: ["GPU Clusters", "Neural Nodes", "Edge Network", "Uptime Map"] },
             { t: "SOLUTIONS", l: ["LLM Training", "Edge Inference", "Data Vault", "Sovereign Cloud"] },
             { t: "SUPPORT", l: ["Console", "API Docs", "Legal Hub", "Contact"] }
           ].map((col, i) => (
             <div key={i} className="space-y-12">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.6em] text-blue-600/40">{col.t}</h4>
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
           <span>© 2026 AETHER CLOUD INFRASTRUCTURE AG. THE COMPUTE LAYER.</span>
           <div className="flex gap-12">
              <Link href="#" className="hover:text-blue-600 transition-all underline decoration-blue-600/20">SYSTEM: NOMINAL</Link>
              <Link href="#" className="hover:text-blue-600 transition-all underline decoration-blue-600/20">SECURITY_LEVEL: OMEGA</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}
