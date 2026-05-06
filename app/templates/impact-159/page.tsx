"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Zap, ArrowRight, Menu, Star, Activity, Cpu, Globe, Share2, ChevronRight, Layout, Box, Sparkles, Terminal } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function Reveal({ children, delay = 0, y = 50 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

function GlitchText({ text }: { text: string }) {
  return (
    <div className="relative inline-block group">
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 text-red-500 opacity-0 group-hover:opacity-70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-75 animate-pulse">{text}</span>
      <span className="absolute top-0 left-0 -z-10 text-cyan-400 opacity-0 group-hover:opacity-70 group-hover:-translate-x-1 group-hover:translate-y-1 transition-all duration-75 animate-pulse">{text}</span>
    </div>
  )
}

const PROJECTS = [
  { id: "01", name: "Cyber-Vogue", cat: "Branding", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200" },
  { id: "02", name: "Neon Pulse", cat: "Motion", img: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=1200" },
  { id: "03", name: "Void Echo", cat: "Product", img: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=1200" },
  { id: "04", name: "Glitch Lab", cat: "R&D", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200" },
]

export default function GlitchStudioPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#050505] text-white font-mono min-h-screen selection:bg-cyan-400 selection:text-black overflow-x-hidden">
      
      {/* ── GRAIN OVERLAY ────────── */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-50 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-700 ${scrolled ? "bg-black/90 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-white flex items-center justify-center group-hover:bg-cyan-400 transition-colors duration-300 overflow-hidden relative">
               <motion.div animate={{ x: [-20, 20], opacity: [0, 1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="absolute inset-0 bg-red-500/20 mix-blend-screen" />
               <Zap className="w-6 h-6 text-black relative z-10" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">Glitch<span className="text-white/20">Studio.</span></span>
          </Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
            {["Disorder", "Works", "Lab", "Contact"].map(l => (
              <Link key={l} href="#" className="hover:text-cyan-400 transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors">Break System</button>
            <button className="px-8 py-3 border-2 border-white text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500">Initialize</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden p-2"><Menu className="w-6 h-6 text-white" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-black border-white/5 p-12 text-white font-mono">
                <div className="flex flex-col gap-10 mt-16 text-left">
                  {["Vision", "Chaos", "Work", "Error"].map(l => (
                    <Link key={l} href="#" className="text-4xl font-black uppercase tracking-tighter hover:text-cyan-400 transition-all italic">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main className="relative pt-40 pb-20">
        {/* ── HERO ──────────────────── */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-12 mb-60 relative">
           <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none select-none">
              <span className="text-[30vw] font-black leading-none">ERROR</span>
           </div>
           
           <div className="relative z-10">
              <Reveal>
                 <div className="inline-flex items-center gap-4 mb-12 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.5em]">
                    <Terminal className="w-4 h-4" /> System_Online_v2.0.1
                 </div>
              </Reveal>
              <Reveal delay={0.1} y={100}>
                 <h1 className="text-7xl md:text-[14vw] font-black tracking-tighter leading-[0.75] uppercase mb-16 italic">
                    <GlitchText text="CREATIVE" /> <br/> 
                    <span className="text-white/10 not-italic">CHAOS.</span>
                 </h1>
              </Reveal>
              <Reveal delay={0.3}>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-end">
                    <p className="text-2xl text-white/40 font-light max-w-xl leading-relaxed italic">
                       We are a high-fidelity creative lab. We don't design for the consensus; we design for the glitch in the matrix.
                    </p>
                    <div className="flex flex-wrap gap-10">
                       <div className="space-y-4">
                          <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Protocol_01</div>
                          <div className="text-3xl font-black italic">Distort.</div>
                       </div>
                       <div className="space-y-4">
                          <div className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Protocol_02</div>
                          <div className="text-3xl font-black italic">Amplify.</div>
                       </div>
                    </div>
                 </div>
              </Reveal>
           </div>
        </section>

        {/* ── DISORDER ──────────────── */}
        <section className="py-60 bg-[#080808] border-y border-white/5 relative overflow-hidden">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 items-center">
                 <Reveal>
                    <div className="aspect-square relative p-2 bg-white/[0.02] border border-white/10 group cursor-crosshair">
                       <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                       <Image src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200" alt="Chaos" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                       <div className="absolute bottom-10 left-10 p-6 bg-black/80 backdrop-blur-md border border-white/10">
                          <div className="text-[8px] font-bold text-white/40 mb-2 uppercase tracking-widest">Ref: LAB_SAMPLE_04</div>
                          <div className="text-xl font-bold italic">Visual Disorder v1</div>
                       </div>
                    </div>
                 </Reveal>
                 <div className="space-y-16">
                    <Reveal delay={0.2}>
                       <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20 block mb-10">The Philosophy</span>
                       <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">Break <br/> <span className="not-italic font-light opacity-10">The Loop.</span></h2>
                       <p className="text-xl text-white/30 leading-relaxed font-light italic">
                          Perfection is the enemy of innovation. We embrace the artifacts, the noise, and the unexpected results that occur when you push technology past its intended limits.
                       </p>
                    </Reveal>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-16 border-t border-white/5">
                       {[
                         { t: "KINETIC TYPE", d: "Dynamic, living typography that reacts to user proximity." },
                         { t: "NOISE MAPS", d: "Procedural background textures that evolve with every session." }
                       ].map((item, i) => (
                         <div key={i} className="group cursor-pointer">
                            <h4 className="text-xs font-black uppercase tracking-widest mb-4 italic text-cyan-400">{item.t}</h4>
                            <p className="text-sm font-light text-white/20 leading-relaxed italic">{item.d}</p>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* ── WORKS ─────────────────── */}
        <section className="py-60 bg-black">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <Reveal>
                 <div className="flex flex-col md:flex-row items-end justify-between mb-32 gap-8 border-b border-white/5 pb-16">
                    <div className="max-w-2xl">
                       <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 block mb-6">Archive_001</span>
                       <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter text-white leading-none italic">The <span className="font-light not-italic opacity-10">Static.</span></h2>
                    </div>
                    <Link href="#" className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest hover:text-cyan-400 text-white/30 transition-colors group italic">
                       View Full System <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </Link>
                 </div>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
                 {PROJECTS.map((item, i) => (
                    <Reveal key={i} delay={i * 0.1}>
                       <div className="bg-black aspect-[3/4] p-8 flex flex-col justify-between group cursor-pointer relative overflow-hidden">
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-1000">
                             <Image src={item.img} alt={item.name} fill className="object-cover scale-110 group-hover:scale-100 transition-transform duration-[3000ms]" />
                          </div>
                          <div className="relative z-10 flex justify-between items-start">
                             <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest italic">{item.id}</span>
                             <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                <ArrowRight className="w-4 h-4 rotate-[-45deg]" />
                             </div>
                          </div>
                          <div className="relative z-10">
                             <div className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest mb-2 italic">{item.cat}</div>
                             <h3 className="text-4xl font-black uppercase tracking-tighter italic group-hover:translate-x-2 transition-transform">{item.name}</h3>
                          </div>
                       </div>
                    </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-60 bg-white text-black text-center relative overflow-hidden">
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none text-[20vw] font-black whitespace-nowrap -rotate-6 select-none">
              GLITCH GLITCH GLITCH GLITCH
           </div>
           <div className="max-w-4xl mx-auto px-6 relative z-10">
              <Reveal>
                 <h2 className="text-7xl md:text-[14vw] font-black uppercase tracking-tighter leading-[0.8] mb-16 italic">
                    ABORT <br/> <span className="font-light not-italic opacity-20 italic">THE NORM.</span>
                 </h2>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                    <button className="px-20 py-10 bg-black text-white font-black uppercase tracking-[0.3em] text-[10px] hover:px-24 transition-all duration-700 italic relative overflow-hidden group">
                       <span className="relative z-10">Start Session</span>
                       <motion.div animate={{ x: [-100, 100], opacity: [0, 0.5, 0] }} transition={{ duration: 1, repeat: Infinity }} className="absolute inset-0 bg-white/20 skew-x-12" />
                    </button>
                    <button className="px-20 py-10 border-4 border-black text-black font-black uppercase tracking-[0.3em] text-[10px] hover:bg-black hover:text-white transition-all duration-700 italic">
                       View Archive
                    </button>
                 </div>
              </Reveal>
           </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-black pt-40 pb-12 px-6 border-t border-white/5 relative z-[60]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
           <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-4 mb-10 group">
                <div className="w-10 h-10 bg-white flex items-center justify-center group-hover:bg-cyan-400 transition-colors">
                  <Zap className="w-6 h-6 text-black" />
                </div>
                <span className="text-xl font-black tracking-tighter uppercase text-white italic">Glitch Studio.</span>
              </Link>
              <p className="text-white/20 max-w-sm leading-relaxed mb-12 text-[10px] font-bold uppercase italic">
                 "In the signal, we find the message. In the noise, we find the soul. Disrupt the consensus."
              </p>
              <div className="flex gap-10">
                 {["GitHub", "Vimeo", "Mirror", "Lens"].map(s => (
                   <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-cyan-400 transition-colors italic">{s}</Link>
                 ))}
              </div>
           </div>
           
           {[
             { t: "PROTOCOLS", l: ["Branding", "Motion", "Product", "R&D Lab"] },
             { t: "SYSTEM", l: ["The Team", "Archive", "Disorder", "Press"] },
             { t: "PORTAL", l: ["Client Login", "Status", "Manual", "Contact"] }
           ].map((col, i) => (
             <div key={i} className="space-y-12">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/30">{col.t}</h4>
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
           <span>© 2026 GLITCH STUDIO LAB. DISTORTION IS DESIGN.</span>
           <div className="flex gap-12">
              <Link href="#" className="hover:text-cyan-400 transition-all underline underline-offset-4 decoration-cyan-400/20">SYSTEM_NOMINAL</Link>
              <Link href="#" className="hover:text-cyan-400 transition-all underline underline-offset-4 decoration-cyan-400/20">CHAOS_ENABLED</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}
