"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Shield, ArrowRight, Menu, Star, Activity, Globe, Zap, Radio, ChevronRight, Binary, Terminal, Plane, Scale, Gavel, Map } from "lucide-react"
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

const EXPERTISE = [
  { name: "Aircraft Acquisition", cat: "Structural Finance", d: "End-to-end legal orchestration for global fleet acquisition and leasing." },
  { name: "Regulatory Alpha", cat: "Compliance Hub", d: "Navigating uncompromised EASA and FAA regulatory frameworks at scale." },
  { name: "Space Law", cat: "Future Juris", d: "The final frontier of legal sovereignty. Orbital and lunar asset management." },
]

export default function AstraLawPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#050b1a] text-[#a0a0a0] font-sans min-h-screen selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* ── AVIATION OVERLAY ──────── */}
      <div className="fixed inset-0 pointer-events-none z-[60] border-[20px] border-[#050b1a] opacity-40 md:opacity-100" />
      <div className="fixed top-12 left-12 pointer-events-none text-[10px] font-bold text-white/20 uppercase tracking-widest z-[70] font-mono hidden lg:block">
         Astra_Law // Global_Jurisdiction_Active
      </div>

      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#050b1a]/95 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 border border-white/10 flex items-center justify-center group-hover:bg-white transition-all duration-700">
              <Plane className="w-6 h-6 text-white group-hover:text-black transition-colors" />
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase text-white italic">Astra<span className="text-white/20 font-light italic">Law</span></span>
          </Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
            {["Jurisdictions", "Finance", "Regulatory", "Intel"].map(l => (
              <Link key={l} href="#" className="hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors underline underline-offset-8 decoration-white/10 italic font-mono">Archive Hub</button>
            <button className="px-10 py-3.5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-transparent hover:text-white border border-transparent hover:border-white transition-all duration-500 italic">Secure Counsel</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden p-2"><Menu className="w-6 h-6 text-white" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#050b1a] border-white/5 p-12 text-white font-mono">
                <div className="flex flex-col gap-10 mt-16 text-left font-black uppercase tracking-tighter">
                  {["Aviation", "Finance", "Space", "Contact"].map(l => (
                    <Link key={l} href="#" className="text-4xl hover:text-white transition-all italic">{l}</Link>
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
             <Image src="https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&q=80&w=2400" alt="Aircraft Wing" fill className="object-cover opacity-10 scale-110 grayscale" priority />
             <div className="absolute inset-0 bg-gradient-to-t from-[#050b1a] via-transparent to-[#050b1a]/50" />
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full text-center lg:text-left">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <Reveal>
                  <div className="inline-flex items-center gap-4 mb-10 text-white/40 text-[10px] font-bold uppercase tracking-[0.5em] italic font-mono">
                    <Terminal className="w-4 h-4 text-white" /> Global_Sovereignty_Protocol_Active
                  </div>
                </Reveal>
                <Reveal delay={0.1} y={100}>
                  <h1 className="text-7xl md:text-[14vw] font-black tracking-tighter leading-[0.8] uppercase mb-16 italic text-white" style={{ fontFamily: "serif" }}>
                    Hold The <br/> <span className="text-white/10 not-italic italic">Sky.</span>
                  </h1>
                </Reveal>
                <Reveal delay={0.3}>
                  <p className="text-xl text-white/30 font-light max-w-xl leading-relaxed italic uppercase mb-16">
                    Specialized legal orchestration for the world's most significant aviation and aerospace assets. We navigate the uncompromised sky.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-10 items-center justify-center lg:justify-start">
                    <button className="px-16 py-6 bg-white text-black font-black uppercase tracking-widest text-[10px] hover:px-20 transition-all duration-700 shadow-[0_0_40px_rgba(255,255,255,0.15)] italic">
                       Request Private Audit
                    </button>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/20 flex items-center gap-4 group cursor-pointer hover:text-white transition-colors font-mono">
                       Flight Intel Feed <Radio className="w-5 h-5 text-white animate-pulse" />
                    </div>
                  </div>
                </Reveal>
              </div>
              
              <Reveal delay={0.5} y={0}>
                 <div className="relative p-10 bg-white/5 border border-white/10 rounded-sm shadow-2xl overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 text-white/5">
                       <Map className="w-60 h-60 animate-pulse opacity-10" />
                    </div>
                    <div className="relative z-10 space-y-12">
                       <div className="flex justify-between border-b border-white/5 pb-8 font-mono">
                          <div className="text-xs font-black text-white tracking-widest uppercase italic">Regulatory Status</div>
                          <div className="text-[10px] text-blue-500 uppercase tracking-widest italic animate-pulse">Sovereign_Active</div>
                       </div>
                       <div className="grid grid-cols-2 gap-12">
                          {[
                            { l: "Jurisdictions", v: "142" },
                            { l: "Fleet Value", v: "$42B+" },
                            { l: "Litigation Rate", v: "99.8%" },
                            { l: "Security Hub", v: "OMEGA" }
                          ].map((stat, i) => (
                            <div key={i}>
                               <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest mb-2 italic font-mono">{stat.l}</div>
                               <div className="text-3xl font-black text-white italic tracking-tighter" style={{ fontFamily: "serif" }}>{stat.v}</div>
                            </div>
                          ))}
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="w-[40%] h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                       </div>
                    </div>
                 </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── EXPERTISE ──────────────── */}
        <section className="py-60 bg-[#050b1a] border-y border-white/5">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <Reveal>
                 <div className="flex flex-col lg:flex-row items-end justify-between mb-32 gap-8 border-b border-white/5 pb-16">
                    <div className="max-w-2xl text-left">
                       <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white block mb-6 italic font-mono">Jurisdictional Stack</span>
                       <h2 className="text-6xl md:text-[9vw] font-black uppercase tracking-tighter text-white leading-none italic" style={{ fontFamily: "serif" }}>The <br/> <span className="font-light not-italic opacity-10">Alpha.</span></h2>
                    </div>
                    <button className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors group italic font-mono">
                       Full Practice Scope <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                 </div>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5">
                 {EXPERTISE.map((item, i) => (
                   <Reveal key={i} delay={i * 0.1}>
                      <div className="p-16 bg-[#050b1a] group hover:bg-white transition-all duration-700 cursor-crosshair">
                         <div className="w-16 h-16 border border-white/10 flex items-center justify-center mb-12 group-hover:bg-black group-hover:border-black transition-all duration-700 shadow-xl group-hover:skew-x-12">
                            {i === 0 ? <Gavel className="w-7 h-7 text-white" /> : i === 1 ? <Scale className="w-7 h-7 text-white" /> : <Globe className="w-7 h-7 text-white" />}
                         </div>
                         <h3 className="text-3xl font-black uppercase mb-8 tracking-tighter italic group-hover:text-black" style={{ fontFamily: "serif" }}>{item.name}</h3>
                         <p className="text-white/20 text-sm font-light italic leading-relaxed mb-12 group-hover:text-black/60 transition-colors uppercase">{item.d}</p>
                         <Link href="#" className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest group-hover:gap-8 transition-all group-hover:text-black font-mono">
                            Examine Dossier <ChevronRight className="w-4 h-4" />
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
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none select-none overflow-hidden whitespace-nowrap text-[20vw] font-black italic -rotate-12 font-mono uppercase">
              ASTRA ASTRA ASTRA ASTRA ASTRA
           </div>
           <div className="max-w-4xl mx-auto px-6 relative z-10">
              <Reveal>
                 <h2 className="text-8xl md:text-[14vw] font-black uppercase tracking-tighter leading-[0.8] mb-16 italic text-black" style={{ fontFamily: "serif" }}>
                    Secure <br/> <span className="font-light not-italic opacity-20 text-black italic">Alpha.</span>
                 </h2>
                 <p className="text-2xl text-black/40 font-light mb-20 leading-relaxed italic max-w-2xl mx-auto uppercase">
                    Uncompromising legal architecture for high-velocity aviation markets. We define the jurisdictional sky.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                    <button className="px-20 py-10 bg-black text-white font-black uppercase text-[10px] tracking-[0.3em] hover:px-24 transition-all duration-700 italic shadow-2xl">
                       Request Private Counsel
                    </button>
                    <button className="px-20 py-10 border-4 border-black text-black font-black uppercase text-[10px] tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-700 italic">
                       View Regional Hubs
                    </button>
                 </div>
              </Reveal>
           </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#050b1a] pt-40 pb-12 px-6 border-t border-white/5 relative z-[70]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
           <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-4 mb-10 group">
                <div className="w-10 h-10 border border-white/10 flex items-center justify-center">
                  <Plane className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tighter uppercase text-white italic">Astra Law.</span>
              </Link>
              <p className="text-white/20 max-w-sm leading-relaxed mb-12 text-[10px] font-bold uppercase italic font-mono">
                 "Law is not a boundary. It is the uncompromised architecture of global sovereignty. Master the sky."
              </p>
              <div className="flex gap-10">
                 {["LinkedIn", "Vimeo", "Maritime Hub", "Contact"].map(s => (
                   <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors italic font-mono">{s}</Link>
                 ))}
              </div>
           </div>
           
           {[
             { t: "PRACTICE", l: ["Aircraft Finance", "Regulatory Shield", "Space Hub", "Incident Intel"] },
             { t: "ENTITY", l: ["The Partners", "Archive Hub", "Legal Hub", "Journal"] },
             { t: "SUPPORT", l: ["Counsel Desk", "Privacy Shield", "SLA Reports", "Contact"] }
           ].map((col, i) => (
             <div key={i} className="space-y-12">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/20 font-mono">{col.t}</h4>
                <ul className="space-y-6">
                   {col.l.map(link => (
                     <li key={link} className="text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors italic">
                        <Link href="#">{link}</Link>
                     </li>
                   ))}
                </ul>
             </div>
           ))}
        </div>
        <div className="max-w-[1400px] mx-auto flex flex-col md:row justify-between items-center gap-8 border-t border-white/5 pt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/10 italic font-mono">
           <span>© 2026 ASTRA AVIATION LAW GLOBAL AG. SOVEREIGNTY IS ETERNAL.</span>
           <div className="flex gap-12">
              <Link href="#" className="hover:text-white transition-all underline decoration-white/10">UPLINK: ACTIVE</Link>
              <Link href="#" className="hover:text-white transition-all underline decoration-white/10">JURISDICTION: GLOBAL</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}
