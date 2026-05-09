"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { Brain, ArrowRight, Menu, Star, Zap, Activity, Cpu, Globe, Shield, Box, Layout, MoveRight, ChevronRight, Share2, Search } from "lucide-react"
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

export default function NeuralMeshPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#02040a] text-white font-sans min-h-screen selection:bg-cyan-500 selection:text-white overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#02040a]/90 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter">Neural<span className="text-cyan-500">Mesh</span></span>
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Ecosystem", "Intelligence", "Network", "Specs"].map(l => (
              <Link key={l} href="#" className="hover:text-cyan-400 transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:block px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-cyan-500 hover:text-white transition-all duration-500">Get Access</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden p-2"><Menu className="w-6 h-6 text-white" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#02040a] border-white/5 p-12 text-white">
                <div className="flex flex-col gap-10 mt-16 text-left">
                  {["System", "Network", "Logic", "Support"].map(l => (
                    <Link key={l} href="#" className="text-4xl font-bold uppercase tracking-tighter hover:text-cyan-400 transition-all">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main className="pt-40 pb-20">
        {/* ── HERO ──────────────────── */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-12 mb-20">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <Reveal>
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-12">
                    <Zap className="w-4 h-4" /> Cognitive Infrastructure v4.2
                  </div>
                </Reveal>
                <Reveal delay={0.1} y={60}>
                  <h1 className="text-6xl md:text-[8vw] font-black tracking-tighter leading-[0.8] uppercase mb-12">
                    Sync <br/> Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Mind.</span>
                  </h1>
                </Reveal>
                <Reveal delay={0.3}>
                  <p className="text-xl text-white/40 font-light max-w-lg leading-relaxed mb-12 italic">
                    The first unified intelligence layer for decentralized neural networks. High-bandwidth cognition at the speed of thought.
                  </p>
                </Reveal>
              </div>
              <Reveal delay={0.5} y={0}>
                 <div className="relative p-1 bg-gradient-to-br from-white/10 to-transparent rounded-[2rem]">
                    <div className="bg-[#0a0f1a] rounded-[1.8rem] p-10 border border-white/5 overflow-hidden font-mono text-[10px] leading-relaxed text-cyan-400/60">
                       <div className="flex justify-between mb-8 opacity-40">
                          <span>SYSTEM_BOOT</span>
                          <span>STABLE</span>
                       </div>
                       <div className="space-y-2 mb-8">
                          <p>&gt; initializing neural pathways...</p>
                          <p>&gt; binding mesh to global consensus...</p>
                          <p className="text-cyan-400">&gt; synchronization complete [100%]</p>
                       </div>
                       <div className="h-40 bg-white/5 rounded-xl border border-white/5 flex items-end gap-1 p-4">
                          {Array.from({ length: 32 }).map((_, i) => (
                            <motion.div key={i} className="flex-1 bg-cyan-500/40" 
                              animate={{ height: `${10 + Math.random() * 90}%` }}
                              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }} />
                          ))}
                       </div>
                    </div>
                 </div>
              </Reveal>
           </div>
        </section>

        {/* ── BENTO GRID ────────────── */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-12 mb-40">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Tile 1: Massive */}
              <Reveal className="md:col-span-2 md:row-span-2">
                 <div className="h-full p-12 rounded-[2.5rem] bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-white/10 flex flex-col justify-between group overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-1000">
                       <Brain className="w-64 h-64" />
                    </div>
                    <div>
                       <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center mb-10">
                          <Activity className="w-6 h-6 text-cyan-400" />
                       </div>
                       <h3 className="text-4xl font-bold uppercase tracking-tight mb-6">Autonomous <br/>Intelligence.</h3>
                       <p className="text-white/40 leading-relaxed font-light max-w-sm italic text-lg">Self-correcting neural pathways that optimize in real-time based on global network feedback.</p>
                    </div>
                    <div className="mt-20">
                       <button className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-cyan-400 hover:gap-6 transition-all">
                          Read Technical Whitepaper <MoveRight className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
              </Reveal>

              {/* Tile 2: Square */}
              <Reveal delay={0.1} className="md:col-span-2">
                 <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex flex-col justify-between group">
                    <div className="flex justify-between items-start">
                       <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center"><Globe className="w-5 h-5 text-blue-400" /></div>
                       <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 italic">0.02ms Latency</span>
                    </div>
                    <div>
                       <h4 className="text-2xl font-bold uppercase tracking-tight mb-4">Global Reach.</h4>
                       <p className="text-sm text-white/40 leading-relaxed font-light">140+ nodes globally distributed for minimum latency and maximum resilience.</p>
                    </div>
                 </div>
              </Reveal>

              {/* Tile 3: Square */}
              <Reveal delay={0.2}>
                 <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex flex-col justify-between group h-full">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-8"><Shield className="w-5 h-5 text-green-400" /></div>
                    <h4 className="text-xl font-bold uppercase tracking-tight mb-2">Immutable.</h4>
                    <p className="text-xs text-white/40 leading-relaxed font-light italic">Secured by decentralized consensus and zk-proofs.</p>
                 </div>
              </Reveal>

              {/* Tile 4: Square */}
              <Reveal delay={0.3}>
                 <div className="p-10 rounded-[2.5rem] bg-cyan-500 text-black flex flex-col justify-between group h-full">
                    <div className="w-10 h-10 rounded-lg bg-black/10 flex items-center justify-center mb-8"><Zap className="w-5 h-5 fill-current" /></div>
                    <h4 className="text-xl font-bold uppercase tracking-tight mb-2 italic">Scale Now.</h4>
                    <p className="text-xs text-black/60 leading-relaxed font-bold">Unlimited throughput on any L1/L2 network.</p>
                 </div>
              </Reveal>

              {/* Tile 5: Large Horizontal */}
              <Reveal delay={0.4} className="md:col-span-3">
                 <div className="p-12 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex flex-col md:flex-row items-center gap-12 group">
                    <div className="flex-1">
                       <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-cyan-500 mb-6 block">Real-time Visualization</div>
                       <h3 className="text-3xl font-bold uppercase tracking-tight mb-6 italic">The Neural Dashboard.</h3>
                       <p className="text-white/40 leading-relaxed font-light text-sm italic mb-8">Manage, monitor, and evolve your neural deployment from a single high-fidelity interface.</p>
                       <div className="flex gap-4">
                          <button className="px-6 py-2.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-lg">Demo Hub</button>
                          <button className="px-6 py-2.5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-white/5 transition-all">API Ref</button>
                       </div>
                    </div>
                    <div className="w-full md:w-1/3 aspect-video bg-black rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
                       <div className="relative w-full h-full p-4 flex gap-1 items-end">
                          {Array.from({ length: 16 }).map((_, i) => (
                             <motion.div key={i} className="flex-1 bg-cyan-500/20 border border-cyan-500/30"
                               animate={{ height: `${20 + Math.random() * 80}%` }}
                               transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }} />
                          ))}
                       </div>
                    </div>
                 </div>
              </Reveal>

              {/* Tile 6: Small Vertical */}
              <Reveal delay={0.5}>
                 <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center text-center group h-full">
                    <Share2 className="w-8 h-8 text-white/20 mb-6 group-hover:text-cyan-400 transition-colors" />
                    <div className="text-4xl font-black italic mb-2 tracking-tighter">84k</div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-white/30">Active Mesh Nodes</div>
                 </div>
              </Reveal>

           </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="max-w-[1400px] mx-auto px-6 mb-20">
           <Reveal>
              <div className="p-20 rounded-[3rem] bg-gradient-to-r from-cyan-600 to-blue-700 text-center relative overflow-hidden">
                 <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                 <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-12 italic relative z-10">
                    JOIN THE <br/> <span className="text-black not-italic font-black">CONSENSUS.</span>
                 </h2>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-10 relative z-10">
                    <button className="px-16 py-6 bg-black text-white font-bold uppercase tracking-widest text-[10px] hover:px-20 transition-all duration-700 italic">
                       Get Developer Access
                    </button>
                    <button className="px-16 py-6 border-2 border-black text-black font-bold uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all duration-700 italic">
                       Contact Sales
                    </button>
                 </div>
              </div>
           </Reveal>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#02040a] pt-32 pb-12 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-16 mb-32">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-10">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tighter text-white">NeuralMesh</span>
            </Link>
            <p className="text-white/20 max-w-sm leading-relaxed mb-10 text-sm font-light italic">
              Building the fabric of decentralized cognition. Empowering the world's most complex intelligence systems.
            </p>
            <div className="flex gap-8">
               {["GitBranch", "Discord", "MessageSquare", "Whitepaper"].map(s => (
                 <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-cyan-400 transition-colors">{s}</Link>
               ))}
            </div>
          </div>
          
          {[
            { t: "SYSTEM", l: ["Architecture", "Mesh Nodes", "Consensus", "Ecosystem"] },
            { t: "DOCS", l: ["API Reference", "Deployment", "Security", "Status"] },
            { t: "ENTITY", l: ["About", "Careers", "Security Audit", "Contact"] },
          ].map((col, i) => (
            <div key={i} className="space-y-10">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-cyan-500">{col.t}</h4>
              <ul className="space-y-6">
                {col.l.map(link => <li key={link} className="text-xs font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors italic"><Link href="#">{link}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-[1400px] mx-auto pt-12 border-t border-white/5 flex flex-col md:row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-white/10">
          <span>© 2026 NEURAL MESH FOUNDATION. COGNITION IS DECENTRALIZED.</span>
          <div className="flex gap-10 italic">
             <Link href="#" className="hover:text-white transition-colors">Privacy Circle</Link>
             <Link href="#" className="hover:text-white transition-colors">Nodes Status</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
