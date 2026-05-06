"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { TrendingUp, ArrowRight, Menu, Star, Zap, Activity, Cpu, Globe, PieChart, Shield, ChevronRight, BarChart3, MoveRight } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function Reveal({ children, delay = 0, y = 20 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

export default function ApexCapitalPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#fafafa] text-[#1a1a1a] font-sans min-h-screen selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/90 backdrop-blur-xl border-b border-black/5 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-indigo-600 rounded flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter">Apex <span className="text-indigo-600">Capital</span></span>
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.25em] text-black/30">
            {["Thesis", "Portfolio", "Insights", "Company"].map(l => (
              <Link key={l} href="#" className="hover:text-indigo-600 transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-black/30 hover:text-black transition-colors">Investor Login</button>
            <button className="px-8 py-3 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded hover:bg-black transition-all duration-500 shadow-lg shadow-indigo-200">Partner With Us</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden p-2"><Menu className="w-6 h-6 text-black" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-white border-l border-black/5 p-12">
                <div className="flex flex-col gap-8 mt-16 text-left">
                  {["Vision", "Assets", "Strategy", "Contact"].map(l => (
                    <Link key={l} href="#" className="text-3xl font-bold tracking-tighter hover:text-indigo-600 transition-all">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main className="pt-32">
        {/* ── HERO ──────────────────── */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 lg:py-40">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <Reveal>
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-[0.3em] mb-10 rounded">
                    <Activity className="w-4 h-4" /> Assets Under Management: $2.4B+
                  </div>
                </Reveal>
                <Reveal delay={0.1}>
                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase mb-10 text-[#111]">
                    Investing <br/> in the <span className="text-indigo-600 italic">Inevitable.</span>
                  </h1>
                </Reveal>
                <Reveal delay={0.2}>
                  <p className="text-xl text-black/50 font-medium max-w-lg leading-relaxed mb-12">
                    We back high-fidelity engineering teams building the foundational layers of the next industrial revolution. From AI nodes to energy autonomy.
                  </p>
                </Reveal>
                <Reveal delay={0.3}>
                  <div className="flex flex-col sm:flex-row gap-8">
                    <button className="px-12 py-5 bg-black text-white font-bold uppercase tracking-widest text-[10px] rounded hover:bg-indigo-600 transition-all duration-500 shadow-xl">
                       View Active Portfolio
                    </button>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-black/30 flex items-center gap-4 group cursor-pointer hover:text-indigo-600 transition-colors">
                       Our Investment Thesis <MoveRight className="w-5 h-5 group-hover:translate-x-2 transition-all" />
                    </div>
                  </div>
                </Reveal>
              </div>
              
              <Reveal delay={0.4} y={0}>
                 <div className="relative p-10 bg-white border border-black/5 rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                       <PieChart className="w-64 h-64 text-indigo-600" />
                    </div>
                    <div className="relative z-10 space-y-10">
                       <div className="flex justify-between items-end border-b border-black/5 pb-8">
                          <div>
                             <div className="text-[10px] font-bold text-black/30 uppercase tracking-widest mb-1">Portfolio Growth</div>
                             <div className="text-4xl font-black tracking-tighter">+42.8%</div>
                          </div>
                          <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest italic">FY 2025 Audit</div>
                       </div>
                       <div className="h-48 flex items-end gap-2">
                          {[40, 70, 45, 90, 65, 80, 100, 55, 75, 95].map((h, i) => (
                             <motion.div key={i} className="flex-1 bg-indigo-600/10 rounded-t"
                               initial={{ height: 0 }}
                               animate={{ height: `${h}%` }}
                               transition={{ duration: 1, delay: 0.5 + i * 0.05 }} />
                          ))}
                       </div>
                       <div className="grid grid-cols-2 gap-10">
                          <div>
                             <div className="text-[9px] font-bold text-black/30 uppercase tracking-widest mb-2">Exits To Date</div>
                             <div className="text-2xl font-bold">14 Successful</div>
                          </div>
                          <div>
                             <div className="text-[9px] font-bold text-black/30 uppercase tracking-widest mb-2">Average Multiplier</div>
                             <div className="text-2xl font-bold">12.4x</div>
                          </div>
                       </div>
                    </div>
                 </div>
              </Reveal>
           </div>
        </section>

        {/* ── SECTORS ───────────────── */}
        <section className="py-32 bg-white border-y border-black/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
                <div className="max-w-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-indigo-600 block mb-4">Strategic Focus</span>
                  <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#111] leading-none">Global <br/> <span className="text-black/10">Theses.</span></h2>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-black/30">Targeting Series A-C</div>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: Cpu, t: "Applied AI", d: "Large-scale inference nodes and specialized vertical intelligence layers." },
                { icon: Zap, t: "Energy Autonomy", d: "Next-gen storage and decentralized grid management systems." },
                { icon: Shield, t: "Cyber Resilience", d: "High-fidelity security protocols for the decentralized web." }
              ].map((item, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="p-12 bg-[#fafafa] border border-black/5 rounded-xl group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div className="w-14 h-14 bg-white border border-black/5 rounded flex items-center justify-center mb-10 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold uppercase mb-6 tracking-tighter">{item.t}</h3>
                    <p className="text-black/40 leading-relaxed text-sm font-medium mb-10">{item.d}</p>
                    <Link href="#" className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest group-hover:gap-6 transition-all text-indigo-600">
                       Examine Sector <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PORTFOLIO ─────────────── */}
        <section className="py-40 bg-[#fafafa]">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <Reveal>
                 <div className="text-center mb-32">
                    <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-[#111] mb-8">Portfolio.</h2>
                    <p className="text-xl text-black/40 font-medium max-w-xl mx-auto italic">Backing the founders who refuse to build for the status quo.</p>
                 </div>
              </Reveal>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/5 border border-black/5 rounded-2xl overflow-hidden">
                 {Array.from({ length: 8 }).map((_, i) => (
                    <Reveal key={i} delay={i * 0.05}>
                       <div className="bg-white p-12 flex flex-col items-center justify-center h-48 group cursor-pointer hover:bg-indigo-50 transition-all duration-500">
                          <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                             <Globe className="w-6 h-6 text-black/20 group-hover:text-indigo-600" />
                          </div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-black/40">Entity_{i+102}</div>
                       </div>
                    </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-40 bg-indigo-600 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
             <BarChart3 className="w-[800px] h-[800px]" />
          </div>
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <Reveal>
              <h2 className="text-7xl md:text-[12vw] font-black uppercase tracking-tighter leading-[0.8] mb-12">
                Accelerate <br/> <span className="text-indigo-900">Capital.</span>
              </h2>
              <p className="text-xl text-white/60 font-medium mb-16 leading-relaxed max-w-2xl mx-auto">
                We are currently reviewing Series A applications for our 2026 Innovation Fund. Partner with a thesis-driven firm.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
                <button className="px-16 py-8 bg-white text-indigo-600 font-bold uppercase tracking-widest text-[10px] rounded hover:bg-black hover:text-white transition-all duration-700 shadow-2xl">
                   Submit Application
                </button>
                <button className="px-16 py-8 border-2 border-white/20 text-white font-bold uppercase tracking-widest text-[10px] rounded hover:bg-white hover:text-black transition-all duration-700">
                   Investor Portal
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-white pt-32 pb-12 px-6 border-t border-black/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
           <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-10 group">
                <div className="w-9 h-9 bg-indigo-600 rounded flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tighter text-black">Apex Capital</span>
              </Link>
              <p className="text-black/30 max-w-sm leading-relaxed mb-12 text-sm font-medium italic">
                 "Capital is a tool for engineering the future. We deploy it with surgical intent and long-term vision."
              </p>
              <div className="flex gap-10">
                 {["LinkedIn", "Twitter", "GitHub", "Insights"].map(s => (
                   <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-black/20 hover:text-indigo-600 transition-colors italic">{s}</Link>
                 ))}
              </div>
           </div>
           
           {[
             { t: "THESIS", l: ["Applied AI", "Energy Hub", "Bio Security", "Neural Mesh"] },
             { t: "FIRM", l: ["The Team", "Portfolio", "Careers", "Archive"] },
             { t: "PORTAL", l: ["Investors", "Founders", "Legal", "Contact"] }
           ].map((col, i) => (
             <div key={i} className="space-y-12">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-indigo-600/40">{col.t}</h4>
                <ul className="space-y-6">
                   {col.l.map(link => (
                     <li key={link} className="text-xs font-bold uppercase tracking-widest text-black/40 hover:text-indigo-600 transition-colors italic">
                        <Link href="#">{link}</Link>
                     </li>
                   ))}
                </ul>
             </div>
           ))}
        </div>
        <div className="max-w-[1400px] mx-auto flex flex-col md:row justify-between items-center gap-8 border-t border-black/5 pt-12 text-[10px] font-bold uppercase tracking-widest text-black/10 italic">
           <span>© 2026 APEX CAPITAL PARTNERS LLC. DATA VERIFIED.</span>
           <div className="flex gap-12">
              <Link href="#" className="hover:text-black transition-all">SLA: NOMINAL</Link>
              <Link href="#" className="hover:text-black transition-all">PRIVACY_PROTOCOL_ACTIVE</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}
