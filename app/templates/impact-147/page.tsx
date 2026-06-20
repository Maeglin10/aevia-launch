// @ts-nocheck
"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { Shield, ArrowRight, Menu, Lock, Zap, Activity, Cpu, Globe, Terminal, ChevronRight, Eye, Radar } from "lucide-react"
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
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
    </div>
  )
}

export default function VanguardLegalPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#02040a] text-white font-mono min-h-screen selection:bg-[#00ff41] selection:text-black overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#02040a]/95 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 border border-[#00ff41]/30 flex items-center justify-center group-hover:border-[#00ff41] transition-all duration-500">
              <Shield className="w-5 h-5 text-[#00ff41]" />
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase">Vanguard <span className="text-[#00ff41]">Legal</span></span>
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
            {["Offense", "Intelligence", "Global Nodes", "Archive"].map(l => (
              <Link key={l} href="#" className="hover:text-[#00ff41] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors underline underline-offset-8 decoration-[#00ff41]/20">Secure Portal</button>
            <button className="px-8 py-3 bg-[#00ff41] text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-all duration-500 shadow-[0_0_20px_rgba(0,255,65,0.2)]">Enlist</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden p-2"><Menu className="w-6 h-6 text-white" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#02040a] border-white/5 p-12 text-white font-mono">
                <div className="flex flex-col gap-8 mt-16 text-left">
                  {["Offense", "Network", "Protocol", "Contact"].map(l => (
                    <Link key={l} href="#" className="text-3xl font-bold uppercase tracking-tighter hover:text-[#00ff41] transition-all italic">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main className="relative">
        <GridBackground />
        
        {/* ── HERO ──────────────────── */}
        <section className="relative min-h-screen flex items-center pt-32 pb-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <Reveal>
                  <div className="inline-flex items-center gap-4 mb-12 px-4 py-1.5 bg-[#00ff41]/5 border border-[#00ff41]/20 text-[#00ff41] text-[10px] font-bold uppercase tracking-[0.4em]">
                    <Activity className="w-4 h-4 animate-pulse" /> Active Defense Grid v8.0
                  </div>
                </Reveal>
                <Reveal delay={0.1} y={100}>
                  <h1 className="text-6xl md:text-[10vw] font-black tracking-tighter leading-[0.8] uppercase mb-12 italic">
                    Silent <br/> <span className="text-white/20 not-italic">Justice.</span>
                  </h1>
                </Reveal>
                <Reveal delay={0.3}>
                  <p className="text-xl text-white/40 font-light max-w-lg leading-relaxed mb-12 uppercase italic">
                    Specializing in global asset recovery and cyber-legal defense for the ultra-high-net-worth. We don't just protect; we neutralize.
                  </p>
                </Reveal>
                <Reveal delay={0.4}>
                  <div className="flex flex-col sm:flex-row gap-8">
                    <button className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-[#00ff41] transition-all duration-700">
                       Request Strategy Brief
                    </button>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-4 group cursor-pointer">
                       <Radar className="w-5 h-5 text-[#00ff41]" /> View Threat Map <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-all" />
                    </div>
                  </div>
                </Reveal>
              </div>
              
              <Reveal delay={0.5} y={0}>
                 <div className="relative p-1 bg-gradient-to-br from-[#00ff41]/20 to-transparent rounded-sm">
                    <div className="bg-black/80 backdrop-blur-xl rounded-sm p-12 border border-white/5 relative overflow-hidden">
                       <div className="flex justify-between mb-12 opacity-30 text-[10px]">
                          <span>TERMINAL_SESSION: VANGUARD_001</span>
                          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse" /> ONLINE</span>
                       </div>
                       <div className="space-y-6 mb-12 font-mono text-xs leading-relaxed text-[#00ff41]/60">
                          <p>&gt; scan initialized...</p>
                          <p>&gt; identifying leak vectors...</p>
                          <p className="text-white">&gt; 12 global nodes synchronized.</p>
                          <p>&gt; defense protocol: ALPHA_ZERO active.</p>
                       </div>
                       <div className="h-40 border border-[#00ff41]/10 flex items-center justify-center relative group">
                          <div className="absolute inset-0 flex items-center justify-center opacity-[0.05]">
                             <Shield className="w-32 h-32" />
                          </div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/60 animate-pulse">Monitoring...</div>
                       </div>
                    </div>
                 </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── STATS TICKER ──────────── */}
        <section className="py-8 bg-[#00ff41] text-black overflow-hidden flex items-center">
           <motion.div 
             animate={{ x: ["0%", "-50%"] }} 
             transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
             className="flex gap-20 whitespace-nowrap text-3xl font-black uppercase italic"
           >
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-10">
                   <span>Asset Recovery</span>
                   <Lock className="w-8 h-8" />
                   <span>Cyber Defense</span>
                   <Lock className="w-8 h-8" />
                   <span>Global Surveillance</span>
                   <Lock className="w-8 h-8" />
                </div>
              ))}
           </motion.div>
        </section>

        {/* ── THE OFFENSE ────────────── */}
        <section className="py-40 bg-[#02040a]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex flex-col md:flex-row items-end justify-between mb-32 gap-8 border-b border-white/5 pb-16">
                <div className="max-w-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00ff41] block mb-6">Offensive Protocol</span>
                  <h2 className="text-6xl md:text-[8vw] font-black uppercase tracking-tighter text-white leading-none italic">Neutralize <br/> <span className="font-light not-italic opacity-20">The Risk.</span></h2>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-4">Total Recovered: $2.4B — 2025</div>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/5">
              {[
                { icon: Radar, t: "Asset Intelligence", d: "Deep-web tracing and forensic accounting to locate misappropriated holdings globally." },
                { icon: Lock, t: "Extraction Strategy", d: "Surgical legal maneuvers to freeze and extract assets across complex jurisdictions." },
                { icon: Eye, t: "Privacy Cloaking", d: "Digital erasure and physical security protocols to ensure your movements remain invisible." }
              ].map((item, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className={`p-16 flex flex-col h-full border-white/5 group ${i < 2 ? "md:border-r" : ""}`}>
                    <div className="w-16 h-16 border border-[#00ff41]/20 flex items-center justify-center mb-12 group-hover:bg-[#00ff41] group-hover:text-black transition-all duration-700">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-[#00ff41]/40 mb-4 italic">Protocol: 0{i+1}</div>
                    <h3 className="text-3xl font-black uppercase mb-8 tracking-tighter italic">{item.t}</h3>
                    <p className="text-white/30 leading-relaxed text-sm font-light mb-12 italic">{item.d}</p>
                    <Link href="#" className="mt-auto flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest group-hover:gap-8 transition-all">
                       Initialize Protocol <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── INTELLIGENCE ──────────── */}
        <section className="py-40 bg-black relative">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                 <div>
                    <Reveal>
                       <h2 className="text-5xl md:text-8xl font-black uppercase mb-12 italic leading-none">Global <br/> <span className="not-italic font-light opacity-30">Watch.</span></h2>
                       <p className="text-xl text-white/40 font-light leading-relaxed mb-20 uppercase italic">
                          Our proprietary monitoring grid ensures that no movement goes unnoticed. We operate 24/7/365 across all time zones to ensure perpetual readiness.
                       </p>
                       <div className="space-y-12">
                          {[
                            { t: "REAL-TIME TELEMETRY", d: "Instant alerts on asset movement across digital and physical borders." },
                            { v: "14", l: "SECURE OPERATIONAL HUBS", d: "Strategic locations in London, Zug, Singapore, and Grand Cayman." }
                          ].map((item, i) => (
                            <div key={i} className="flex gap-10 group">
                               <div className="text-4xl font-black italic text-[#00ff41] shrink-0 w-24">0{i+1}</div>
                               <div>
                                  <h4 className="text-lg font-bold uppercase tracking-widest mb-2 italic">{(item as any).t || (item as any).l}</h4>
                                  <p className="text-xs text-white/20 font-light italic leading-relaxed">{(item as any).d}</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </Reveal>
                 </div>
                 <Reveal delay={0.3}>
                    <div className="aspect-square relative border border-white/5 bg-[#050505] p-12 overflow-hidden flex items-center justify-center">
                       <div className="relative w-full h-full border border-[#00ff41]/5 rounded-full flex items-center justify-center">
                          <div className="w-full h-full border border-[#00ff41]/10 rounded-full animate-[ping_4s_linear_infinite] opacity-20" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <Globe className="w-32 h-32 text-[#00ff41]/10" />
                          </div>
                          {/* Node markers */}
                          <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-[#00ff41] rounded-full shadow-[0_0_15px_#00ff41]" />
                          <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-[#00ff41] rounded-full shadow-[0_0_10px_#00ff41] opacity-50" />
                       </div>
                       <div className="absolute bottom-10 left-10 text-[8px] font-mono text-[#00ff41]/40 space-y-1">
                          <p>SCANNING_NODE: ZUG_ALPHA</p>
                          <p>STATUS: ACTIVE</p>
                          <p>SIGNAL_STRENGTH: 100%</p>
                       </div>
                    </div>
                 </Reveal>
              </div>
           </div>
        </section>

        {/* ── TESTIMONIALS ──────────── */}
        <section className="py-40 bg-[#02040a] border-t border-[#00ff41]/10">
          <div className="max-w-6xl mx-auto px-6 md:px-12 font-mono">
            <Reveal>
              <p className="text-[10px] uppercase tracking-[0.5em] text-[#00ff41]/40 mb-6">// verified operators</p>
              <h2 className="text-4xl md:text-7xl font-black text-white mb-20 leading-none tracking-tighter">
                FIELD<br /><span className="text-[#00ff41]/10">REPORTS.</span>
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#00ff41]/5">
              {[
                { quote: "Our red team couldn't find a single gap after deployment. The threat graph identified a lateral movement path we had missed for two years. Mission critical.", handle: "// SEC_LEAD_ORION", org: "Fortune 500 · Financial Sector" },
                { quote: "Six ransomware attempts blocked in 90 days. Zero successful intrusions. The AI intercepts attacks before our SOC analysts even see the alert.", handle: "// CISO_MERIDIAN", org: "Critical Infrastructure" },
                { quote: "We replaced four separate tools with this single platform. Coverage increased 40%, cost dropped 60%. The ROI conversation with the board was the easiest I've had.", handle: "// INFOSEC_VOSS", org: "Global SaaS · Series C" },
              ].map((t, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="bg-[#02040a] p-10 flex flex-col gap-6 hover:bg-black transition-colors border border-[#00ff41]/5 hover:border-[#00ff41]/20">
                    <Terminal className="w-4 h-4 text-[#00ff41]/40" />
                    <p className="text-white/40 leading-relaxed flex-1 text-sm">{t.quote}</p>
                    <div className="border-t border-[#00ff41]/10 pt-6">
                      <div className="text-[#00ff41] text-xs font-bold tracking-widest">{t.handle}</div>
                      <div className="text-[10px] text-white/20 mt-1">{t.org}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEAM ──────────────────── */}
        <section className="py-40 bg-black border-t border-[#00ff41]/10">
          <div className="max-w-6xl mx-auto px-6 md:px-12 font-mono">
            <Reveal>
              <p className="text-[10px] uppercase tracking-[0.5em] text-[#00ff41]/40 mb-6">// core team</p>
              <h2 className="text-4xl md:text-7xl font-black text-white mb-20 leading-none tracking-tighter">
                OPERATORS.
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-[#00ff41]/5">
              {[
                { handle: "WRAITH", name: "Elara Voss", role: "Threat Intelligence", clearance: "ALPHA", years: "14yr" },
                { handle: "CIPHER", name: "Ryo Tanaka", role: "Offensive Security", clearance: "BRAVO", years: "11yr" },
                { handle: "GHOST", name: "Omar Al Farsi", role: "AI/ML Defense", clearance: "ALPHA", years: "9yr" },
                { handle: "SPECTER", name: "Nova Chen", role: "Incident Response", clearance: "CHARLIE", years: "7yr" },
              ].map((m, i) => (
                <Reveal key={m.handle} delay={i * 0.08}>
                  <div className="bg-black p-10 hover:bg-[#02040a] transition-colors group">
                    <div className="w-12 h-12 border border-[#00ff41]/20 flex items-center justify-center mb-6 group-hover:border-[#00ff41]/60 transition-colors">
                      <span className="text-[#00ff41] text-xs font-black">{m.handle.slice(0, 2)}</span>
                    </div>
                    <div className="text-[10px] text-[#00ff41]/40 mb-1">[{m.clearance}] · {m.years}</div>
                    <div className="text-white font-bold text-sm tracking-wider mb-1">{m.name}</div>
                    <div className="text-[10px] text-white/20 uppercase tracking-widest">{m.role}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-60 bg-[#00ff41] text-black text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02]">
             <div className="w-[150%] h-[150%] border-2 border-dashed border-black rounded-full -translate-x-1/4 -translate-y-1/4 animate-[spin_60s_linear_infinite]" />
          </div>
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <Reveal>
              <h2 className="text-7xl md:text-[14vw] font-black uppercase tracking-tighter leading-[0.75] mb-16 italic">
                Secure <br/> <span className="font-light not-italic opacity-30">Your Legacy.</span>
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
                <button className="px-16 py-8 bg-black text-white font-black uppercase tracking-[0.2em] text-xs hover:px-24 transition-all duration-700 italic">
                   Initiate Strategy Session
                </button>
                <button className="px-16 py-8 border-2 border-black text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-black hover:text-white transition-all duration-700 italic">
                   Request Private Audit
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#02040a] pt-32 pb-12 px-6 border-t border-white/5 font-mono">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
           <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-4 mb-10 group">
                <div className="w-10 h-10 border border-[#00ff41]/30 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#00ff41]" />
                </div>
                <span className="text-xl font-bold tracking-tighter uppercase text-white italic">Vanguard <span className="text-[#00ff41]">Legal</span></span>
              </Link>
              <p className="text-white/20 max-w-sm leading-relaxed mb-12 text-[10px] font-bold uppercase italic">
                 "Conflict is inevitable. Neutralization is an choice. We are the choice of the prepared."
              </p>
              <div className="flex gap-10">
                 {["GitHub", "Archive", "Signal", "Contact"].map(s => (
                   <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-[#00ff41] transition-colors underline underline-offset-8 decoration-[#00ff41]/10">{s}</Link>
                 ))}
              </div>
           </div>
           
           {[
             { t: "PROTOCOLS", l: ["Asset Recovery", "Intelligence", "Defense", "Surveillance"] },
             { t: "NODES", l: ["London Hub", "Zug Office", "Cayman Base", "Singapore"] },
             { t: "RESOURCES", l: ["Portal", "Status", "Manual", "Press"] }
           ].map((col, i) => (
             <div key={i} className="space-y-12">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00ff41]/40">{col.t}</h4>
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
           <span>© 2026 VANGUARD STRATEGIC LEGAL DEFENSE. CONNECTION ENCRYPTED.</span>
           <div className="flex gap-12">
              <Link href="#" className="hover:text-[#00ff41] transition-all">SYSTEM_STATUS: NOMINAL</Link>
              <Link href="#" className="hover:text-[#00ff41] transition-all">PRIVACY_PROTOCOL_ENABLED</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}
