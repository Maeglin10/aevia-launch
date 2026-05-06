"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { BarChart3, ArrowRight, Menu, Star, Shield, Activity, Globe, Zap, Radio, ChevronRight, Binary, Terminal, Layout, Layers } from "lucide-react"
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

export default function VertexAnalyticsPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#fcfcfc] text-[#4a4a4a] font-sans min-h-screen selection:bg-[#2563eb] selection:text-white overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-white/80 backdrop-blur-xl border-b border-black/5 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-[#2563eb] flex items-center justify-center group-hover:rotate-180 transition-transform duration-700 shadow-xl shadow-blue-500/20">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase text-[#1a1a1a]">Vertex<span className="text-[#2563eb]">.</span></span>
          </Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-black/30">
            {["Platform", "Insights", "Security", "Scale"].map(l => (
              <Link key={l} href="#" className="hover:text-[#2563eb] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-black/20 hover:text-[#1a1a1a] transition-colors underline underline-offset-8 decoration-blue-500/20">API Docs</button>
            <button className="px-10 py-3.5 bg-[#2563eb] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#1a1a1a] transition-all duration-500">Request Demo</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden p-2"><Menu className="w-6 h-6 text-[#1a1a1a]" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-white border-none p-12 text-[#1a1a1a]">
                <div className="flex flex-col gap-10 mt-16 text-left font-black uppercase tracking-tighter">
                  {["System", "Metrics", "Global", "Contact"].map(l => (
                    <Link key={l} href="#" className="text-4xl hover:text-[#2563eb] transition-all italic">{l}</Link>
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
          <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <Reveal>
                  <div className="inline-flex items-center gap-4 mb-10 text-[#2563eb] text-[10px] font-bold uppercase tracking-[0.5em] italic">
                     Decision Intelligence Engine v4.0
                  </div>
                </Reveal>
                <Reveal delay={0.1} y={100}>
                  <h1 className="text-7xl md:text-[11vw] font-black tracking-tighter leading-[0.8] uppercase mb-16 text-[#1a1a1a]">
                    Absolute <br/> <span className="text-black/5 not-italic italic">Clarity.</span>
                  </h1>
                </Reveal>
                <Reveal delay={0.3}>
                  <p className="text-xl text-black/40 font-light max-w-xl leading-relaxed italic uppercase mb-16">
                    Transforming petabytes of raw signal into uncompromised strategic action. The high-fidelity layer for your business intelligence.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-10 items-center justify-center lg:justify-start">
                    <button className="px-16 py-6 bg-[#2563eb] text-white font-black uppercase tracking-widest text-[10px] hover:px-20 transition-all duration-700 shadow-2xl shadow-blue-500/20">
                       Deploy Platform
                    </button>
                    <div className="text-[10px] font-black uppercase tracking-widest text-black/20 flex items-center gap-4 group cursor-pointer hover:text-[#1a1a1a] transition-colors">
                       View Metrics <Activity className="w-5 h-5 text-[#2563eb] animate-pulse" />
                    </div>
                  </div>
                </Reveal>
              </div>
              
              <Reveal delay={0.5} y={0}>
                 <div className="relative p-10 bg-white border border-black/5 rounded-xl shadow-[0_40px_100px_rgba(0,0,0,0.05)] overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 text-blue-500/5">
                       <Layers className="w-60 h-60 animate-pulse" />
                    </div>
                    <div className="relative z-10 space-y-12">
                       <div className="flex justify-between border-b border-black/5 pb-8">
                          <div className="text-xs font-black text-[#2563eb] tracking-widest uppercase italic">Live Data Stream</div>
                          <div className="text-[10px] text-green-500 uppercase tracking-widest italic animate-pulse">Processing_v2</div>
                       </div>
                       <div className="grid grid-cols-2 gap-12">
                          {[
                            { l: "Signals/Sec", v: "1.4M" },
                            { l: "Global Nodes", v: "242" },
                            { l: "Compute Load", v: "42%" },
                            { l: "Anomaly Det", v: "99.9%" }
                          ].map((stat, i) => (
                            <div key={i}>
                               <div className="text-[8px] font-bold text-black/20 uppercase tracking-widest mb-2 italic">{stat.l}</div>
                               <div className="text-3xl font-black text-[#1a1a1a] italic tracking-tighter">{stat.v}</div>
                            </div>
                          ))}
                       </div>
                       <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                          <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-[30%] h-full bg-[#2563eb]" />
                       </div>
                    </div>
                 </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── SOLUTIONS ──────────────── */}
        <section className="py-60 bg-white border-y border-black/5">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <Reveal>
                 <div className="flex flex-col lg:flex-row items-end justify-between mb-32 gap-8 border-b border-black/5 pb-16">
                    <div className="max-w-2xl text-left">
                       <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#2563eb] block mb-6 italic">Sector Optimization</span>
                       <h2 className="text-6xl md:text-[9vw] font-black uppercase tracking-tighter text-[#1a1a1a] leading-none italic">Hard <br/> <span className="font-light not-italic opacity-5">Metrics.</span></h2>
                    </div>
                    <button className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-[#2563eb] transition-colors group italic">
                       Full Protocol Stack <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                 </div>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/5 border border-black/5">
                 {[
                   { icon: Shield, t: "Risk Alpha", d: "Identify hidden market volatility with proprietary neural-based predictive models." },
                   { icon: Globe, t: "Supply Intelligence", d: "Global supply chain optimization through real-time logistics and maritime data." },
                   { icon: Zap, t: "Consumer Pulse", d: "Deep behavioral analytics that predict demand shifts before they happen." }
                 ].map((item, i) => (
                   <Reveal key={i} delay={i * 0.1}>
                      <div className="p-16 bg-white group hover:bg-[#2563eb] transition-all duration-700 cursor-crosshair">
                         <div className="w-16 h-16 border border-black/5 flex items-center justify-center mb-12 group-hover:bg-white group-hover:border-white transition-all duration-700 shadow-sm">
                            <item.icon className="w-7 h-7 text-[#2563eb]" />
                         </div>
                         <h3 className="text-3xl font-black uppercase mb-8 tracking-tighter italic group-hover:text-white">{item.t}</h3>
                         <p className="text-black/30 text-sm font-light italic leading-relaxed mb-12 group-hover:text-white/60 transition-colors">{item.d}</p>
                         <Link href="#" className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest group-hover:gap-8 transition-all group-hover:text-white">
                            Examine System <ChevronRight className="w-4 h-4" />
                         </Link>
                      </div>
                   </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-60 bg-[#1a1a1a] text-white text-center relative overflow-hidden">
           <GridBackground />
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden whitespace-nowrap text-[20vw] font-black italic -rotate-12">
              VERTEX VERTEX VERTEX VERTEX
           </div>
           <div className="max-w-4xl mx-auto px-6 relative z-10">
              <Reveal>
                 <h2 className="text-8xl md:text-[14vw] font-black uppercase tracking-tighter leading-[0.8] mb-16 italic text-white">
                    Command <br/> <span className="font-light not-italic opacity-10 text-white">Truth.</span>
                 </h2>
                 <p className="text-2xl text-white/40 font-light mb-20 leading-relaxed italic max-w-2xl mx-auto uppercase">
                    Stop guessing. Start knowing. Deploy the Vertex intelligence layer across your entire infrastructure in 24 hours.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                    <button className="px-20 py-10 bg-white text-black font-black uppercase text-[10px] tracking-[0.3em] hover:px-24 transition-all duration-700 italic shadow-2xl">
                       Request Full Audit
                    </button>
                    <button className="px-20 py-10 border-4 border-white text-white font-black uppercase text-[10px] tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-700 italic">
                       View Case Files
                    </button>
                 </div>
              </Reveal>
           </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#fcfcfc] pt-40 pb-12 px-6 border-t border-black/5 relative z-50">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
           <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-4 mb-10 group">
                <div className="w-10 h-10 bg-[#2563eb] flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tighter uppercase text-[#1a1a1a] italic">Vertex Analytics.</span>
              </Link>
              <p className="text-black/20 max-w-sm leading-relaxed mb-12 text-[10px] font-bold uppercase italic">
                 "In the signal, we find the message. In the message, we find the absolute edge. Master the data."
              </p>
              <div className="flex gap-10">
                 {["GitHub", "Vimeo", "Mirror", "LinkedIn"].map(s => (
                   <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-black/20 hover:text-[#2563eb] transition-colors italic">{s}</Link>
                 ))}
              </div>
           </div>
           
           {[
             { t: "PLATFORM", l: ["Signal Ingestion", "Neural Logic", "Edge Insights", "Global Mesh"] },
             { t: "SOLUTIONS", l: ["Finance Alpha", "Logistics Pulse", "Retail Intel", "Gov Security"] },
             { t: "ENTITY", l: ["The Lab", "SLA Status", "Privacy Shield", "Contact"] }
           ].map((col, i) => (
             <div key={i} className="space-y-12">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.6em] text-black/20">{col.t}</h4>
                <ul className="space-y-6">
                   {col.l.map(link => (
                     <li key={link} className="text-xs font-bold uppercase tracking-widest text-black/30 hover:text-[#2563eb] transition-colors italic">
                        <Link href="#">{link}</Link>
                     </li>
                   ))}
                </ul>
             </div>
           ))}
        </div>
        <div className="max-w-[1400px] mx-auto flex flex-col md:row justify-between items-center gap-8 border-t border-black/5 pt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-black/10 italic">
           <span>© 2026 VERTEX ANALYTICS SOLUTIONS AG. DATA IS TRUTH.</span>
           <div className="flex gap-12">
              <Link href="#" className="hover:text-[#2563eb] transition-all underline decoration-blue-500/20">SYSTEM: NOMINAL</Link>
              <Link href="#" className="hover:text-[#2563eb] transition-all underline decoration-blue-500/20">SECURITY_LEVEL: OMEGA</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}
