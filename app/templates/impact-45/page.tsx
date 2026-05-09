"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { Ruler, ArrowRight, Menu, Star, Layers, Layout, Zap, ChevronRight, PenTool, Hash, MoveRight, Cpu, Box } from "lucide-react"
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

const NODES = [
  { id: "NODE_01", title: "Structural Integrity", desc: "Foundational architecture built for scale and multi-generational lifespan.", icon: Layers },
  { id: "NODE_02", title: "Logic Flow", desc: "Surgical precision in user journey mapping and technical execution.", icon: Cpu },
  { id: "NODE_03", title: "Spatial Density", desc: "Optimizing every pixel for maximum information density without cognitive load.", icon: Box },
]

export default function BlueprintNodePage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#f0f0f0] text-[#2a2a2a] font-mono min-h-screen selection:bg-[#2a2a2a] selection:text-white overflow-x-hidden">
      
      {/* ── GRID BACKGROUND ───────── */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.15]" 
           style={{ backgroundImage: `linear-gradient(#2a2a2a 1px, transparent 1px), linear-gradient(90deg, #2a2a2a 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      <div className="fixed inset-0 pointer-events-none opacity-[0.05]" 
           style={{ backgroundImage: `linear-gradient(#2a2a2a 1px, transparent 1px), linear-gradient(90deg, #2a2a2a 1px, transparent 1px)`, backgroundSize: '8px 8px' }} />

      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/90 backdrop-blur-md border-b border-[#2a2a2a]/10 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 border-2 border-[#2a2a2a] flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
              <Hash className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase">Blueprint <span className="font-light text-[#2a2a2a]/40">Node</span></span>
          </Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-[#2a2a2a]/40">
            {["Drafts", "Logic", "Atelier", "Archive"].map(l => (
              <Link key={l} href="#" className="hover:text-black transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-[#2a2a2a]/40 hover:text-black transition-colors underline underline-offset-4">Project Login</button>
            <button className="px-8 py-3 border-2 border-[#2a2a2a] text-[#2a2a2a] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#2a2a2a] hover:text-white transition-all duration-500">Draft Session</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden p-2"><Menu className="w-6 h-6 text-[#2a2a2a]" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#f0f0f0] border-l-2 border-[#2a2a2a] p-12">
                <div className="flex flex-col gap-10 mt-16 text-left">
                  {["Drafts", "Logic", "Nodes", "Chat"].map(l => (
                    <Link key={l} href="#" className="text-4xl font-bold uppercase tracking-tighter hover:italic transition-all">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* ── HERO ──────────────────── */}
        <section className="relative min-h-screen flex items-center pt-32 pb-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-end">
              <div>
                <Reveal>
                  <div className="flex items-center gap-4 mb-12">
                     <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#2a2a2a]/50">Architecture First Approach</span>
                     <div className="h-[1px] flex-1 bg-[#2a2a2a]/10" />
                  </div>
                </Reveal>
                <Reveal delay={0.1} y={100}>
                  <h1 className="text-7xl md:text-[9vw] font-bold tracking-tighter leading-[0.8] uppercase mb-12">
                    Logic <br/> <span className="font-light italic">Manifest.</span>
                  </h1>
                </Reveal>
                <Reveal delay={0.3}>
                  <p className="text-xl text-[#2a2a2a]/60 font-medium max-w-lg leading-relaxed mb-12 uppercase italic">
                    Engineering digital systems through a architectural lens. We draft the future with surgical precision and structural honesty.
                  </p>
                </Reveal>
                <Reveal delay={0.4}>
                  <div className="flex flex-wrap gap-8 items-center">
                    <button className="px-12 py-5 bg-[#2a2a2a] text-white font-bold uppercase tracking-widest text-[10px] hover:px-14 transition-all duration-700">
                       Initiate Blueprint
                    </button>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-[#2a2a2a]/40 flex items-center gap-3">
                       <Ruler className="w-4 h-4" /> Scaled 1:1 Digital
                    </div>
                  </div>
                </Reveal>
              </div>
              
              <Reveal delay={0.5} y={0}>
                 <div className="relative aspect-[4/3] border-2 border-[#2a2a2a] p-1 shadow-[10px_10px_0px_rgba(42,42,42,0.1)]">
                    <div className="w-full h-full bg-white border border-[#2a2a2a]/20 relative overflow-hidden flex items-center justify-center">
                       {/* Schematic Drawings */}
                       <div className="absolute inset-0 opacity-[0.03] p-10">
                          <div className="w-full h-full border border-black rounded-full" />
                          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black" />
                          <div className="absolute top-0 left-1/2 w-[1px] h-full bg-black" />
                       </div>
                       <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="w-3/4 h-3/4 border-2 border-[#2a2a2a]/10 rounded-full flex items-center justify-center border-dashed">
                          <PenTool className="w-12 h-12 text-[#2a2a2a]/20" />
                       </motion.div>
                       {/* Label */}
                       <div className="absolute bottom-6 right-6 p-4 bg-[#2a2a2a] text-white text-[9px] font-bold uppercase tracking-widest">
                          Fig. 01: Core Architecture
                       </div>
                    </div>
                 </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── TECHNICAL DATA ────────── */}
        <section className="py-24 bg-[#2a2a2a] text-white overflow-hidden">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-wrap gap-20 justify-between italic">
              {[
                { v: "0.001mm", l: "EXECUTION TOLERANCE" },
                { v: "100%", l: "STRUCTURAL HONESTY" },
                { v: "∞", l: "SCALABLE LOGIC" },
                { v: "24/7", l: "DRAFTING UPTIME" },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 0.1}>
                   <div className="flex flex-col gap-2">
                      <div className="text-4xl font-bold uppercase tracking-tighter">{s.v}</div>
                      <div className="text-[9px] font-bold uppercase tracking-[0.4em] opacity-40">{s.l}</div>
                   </div>
                </Reveal>
              ))}
           </div>
        </section>

        {/* ── NODES ─────────────────── */}
        <section className="py-40 bg-[#f0f0f0]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex flex-col md:flex-row items-end justify-between mb-32 gap-8 border-b-2 border-[#2a2a2a]/10 pb-12">
                <div className="max-w-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#2a2a2a]/40 block mb-4">The Logic</span>
                  <h2 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter italic">Drafting <br/> <span className="not-italic font-light">Nodes.</span></h2>
                </div>
                <button className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest hover:italic transition-all group">
                  Full Tech Stack <MoveRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-[#2a2a2a]">
              {NODES.map((n, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className={`p-16 flex flex-col h-full border-[#2a2a2a] group ${i < 2 ? "md:border-r-2" : ""}`}>
                    <div className="w-14 h-14 border-2 border-[#2a2a2a] flex items-center justify-center mb-10 group-hover:bg-[#2a2a2a] group-hover:text-white transition-all duration-500">
                      <n.icon className="w-6 h-6" />
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#2a2a2a]/30 mb-4 italic">{n.id}</div>
                    <h3 className="text-3xl font-bold uppercase mb-8 tracking-tighter">{n.title}</h3>
                    <p className="text-[#2a2a2a]/60 leading-relaxed text-sm font-medium mb-12 italic">{n.desc}</p>
                    <Link href="#" className="mt-auto flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest group-hover:gap-6 transition-all">
                       Examine Node <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── SCHEMATICS ────────────── */}
        <section className="py-40 bg-white relative">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                 <Reveal>
                    <div className="aspect-square relative border-2 border-dashed border-[#2a2a2a]/20 flex items-center justify-center p-12">
                       <div className="w-full h-full border border-[#2a2a2a]/10 relative">
                          <div className="absolute top-4 left-4 p-4 border border-[#2a2a2a]/10 text-[8px] font-bold uppercase italic">Ref: 440-Node-Draft</div>
                          <div className="absolute bottom-4 right-4 p-4 border border-[#2a2a2a]/10 text-[8px] font-bold uppercase italic">Status: Validated</div>
                          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }} className="w-full h-full flex items-center justify-center opacity-[0.05]">
                             <Layout className="w-64 h-64" />
                          </motion.div>
                       </div>
                    </div>
                 </Reveal>
                 <div>
                    <Reveal>
                       <h2 className="text-5xl md:text-7xl font-bold uppercase mb-12 italic">System <br/> <span className="not-italic font-light">Integrity.</span></h2>
                       <p className="text-xl text-[#2a2a2a]/60 font-medium leading-relaxed mb-16 uppercase italic">
                          Our schematics aren't just for show. Every line represents a technical decision designed to ensure your platform remains rigid under load and flexible for expansion.
                       </p>
                       <div className="space-y-10">
                          {[
                            { t: "CORE LOGIC", d: "The central nervous system of your digital product, drafted for clarity and speed." },
                            { t: "INTERFACE GRID", d: "A mathematical approach to layout that ensures pixel-perfect rendering across all devices." }
                          ].map((item, i) => (
                            <div key={i} className="flex gap-8 group">
                               <div className="text-3xl font-bold italic opacity-10 group-hover:opacity-100 transition-opacity">0{i+1}</div>
                               <div>
                                  <h4 className="text-xl font-bold uppercase mb-2 tracking-tighter">{item.t}</h4>
                                  <p className="text-sm text-[#2a2a2a]/40 leading-relaxed font-medium italic">{item.d}</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </Reveal>
                 </div>
              </div>
           </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-40 bg-[#2a2a2a] text-white text-center relative overflow-hidden">
           {/* Schematic Background */}
           <div className="absolute inset-0 opacity-[0.02]">
              <div className="w-[120%] h-[120%] border-2 border-dashed border-white rounded-full -translate-x-1/4 -translate-y-1/4" />
           </div>
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <Reveal>
              <h2 className="text-6xl md:text-[10vw] font-bold uppercase tracking-tighter leading-[0.8] mb-16 italic">
                Commit <br/> To <span className="not-italic font-light">Logic.</span>
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
                <button className="px-16 py-8 bg-white text-[#2a2a2a] font-bold uppercase tracking-widest text-xs hover:px-20 transition-all duration-700 italic">
                   Initiate Draft
                </button>
                <button className="px-16 py-8 border-2 border-white text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all duration-700 italic">
                   View Schematics
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-white pt-32 pb-12 px-6 border-t-2 border-[#2a2a2a]/10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-16 mb-32">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-4 mb-10">
               <div className="w-10 h-10 border-2 border-[#2a2a2a] flex items-center justify-center">
                <Hash className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tighter uppercase">Blueprint Node</span>
            </Link>
            <p className="text-[#2a2a2a]/40 max-w-sm leading-relaxed mb-10 text-xs font-bold uppercase italic">
              "We draft the invisible until it becomes inevitable. Logic is the only aesthetic that endures."
            </p>
            <div className="flex gap-10">
               {["GitBranch", "LinkedIn", "Archive", "Journal"].map(s => (
                 <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-[#2a2a2a]/30 hover:text-black transition-colors underline underline-offset-4">{s}</Link>
               ))}
            </div>
          </div>
          
          {[
            { t: "DRAFTS", l: ["Case Studies", "Nodes", "Network", "Logic"] },
            { t: "ATELIER", l: ["The Process", "Schematics", "Drafting Tool", "Team"] },
            { t: "SUPPORT", l: ["Project Portal", "Docs", "SLA", "Contact"] },
          ].map((col, i) => (
            <div key={i} className="space-y-10">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#2a2a2a]">{col.t}</h4>
              <ul className="space-y-6">
                {col.l.map(link => <li key={link} className="text-xs font-bold uppercase tracking-widest text-[#2a2a2a]/40 hover:text-black transition-colors italic"><Link href="#">{link}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-[1400px] mx-auto pt-12 border-t border-[#2a2a2a]/10 flex flex-col md:row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[#2a2a2a]/20">
          <span>© 2026 BLUEPRINT NODE SYSTEMS. SCALE 1:1.</span>
          <div className="flex gap-10 italic">
             <Link href="#" className="hover:text-black transition-colors">Integrity Report</Link>
             <Link href="#" className="hover:text-black transition-colors">Privacy Circle</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
