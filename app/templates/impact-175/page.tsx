"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Sparkles, ArrowRight, Menu, Star, Shield, Activity, Globe, Zap, Radio, ChevronRight, Binary, Terminal, Sun, Heart, Droplets } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function Reveal({ children, delay = 0, y = 30 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0" 
         style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
  )
}

const SERVICES = [
  { name: "Radiance Veneers", cat: "Cosmetic Architecture", d: "Ultra-thin ceramic layers designed for absolute biological harmony and aesthetics." },
  { name: "Laser Whitening", cat: "Spectral Care", d: "Zero-sensitivity high-fidelity brightening protocols using spectral laser technology." },
  { name: "Elite Ortho", cat: "Structural Alignment", d: "Discrete structural correction protocols for a perfectly engineered smile." },
]

export default function LuminaDentalPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#fcfcfc] text-[#4a4a4a] font-sans min-h-screen selection:bg-[#e0f2fe] selection:text-[#0369a1] overflow-x-hidden">
      
      {/* ── AMBIENT GLOWS ────────── */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#e0f2fe]/40 blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#e0f2fe]/40 blur-[150px] pointer-events-none z-0" />

      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${scrolled ? "bg-white/70 backdrop-blur-2xl border-b border-[#e0f2fe]/30 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-full bg-[#f0f9ff] border border-[#e0f2fe] flex items-center justify-center group-hover:bg-[#0369a1] transition-all duration-700">
              <Sparkles className="w-5 h-5 text-[#0369a1] group-hover:text-white" />
            </div>
            <span className="text-xl font-light tracking-[0.4em] uppercase text-[#1a1a1a]">Lumina <span className="font-bold">Dental</span></span>
          </Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.5em] text-[#1a1a1a]/30">
            {["The Practice", "Radiance", "Alchemy", "Book"].map(l => (
              <Link key={l} href="#" className="hover:text-[#0369a1] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/30 hover:text-[#1a1a1a] transition-colors underline underline-offset-8 decoration-[#e0f2fe]">Patient Hub</button>
            <button className="px-10 py-4 bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-[#0369a1] transition-all duration-700 shadow-xl shadow-[#0369a1]/10">Book Consult</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden p-2"><Menu className="w-6 h-6 text-[#1a1a1a]" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-white border-none p-12 text-[#1a1a1a] font-sans">
                <div className="flex flex-col gap-10 mt-16 text-left">
                  {["Treatment", "Radiance", "Tech", "Contact"].map(l => (
                    <Link key={l} href="#" className="text-4xl font-light uppercase tracking-widest hover:italic transition-all">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ──────────────────── */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <GridBackground />
          <div className="absolute inset-0">
             <Image src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=2400" alt="Clinic Interior" fill className="object-cover opacity-5 scale-105" priority />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#fcfcfc]/40 to-[#fcfcfc]" />
          </div>

          <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
            <Reveal>
              <div className="flex items-center justify-center gap-8 mb-16 opacity-30">
                 <div className="w-16 h-[1px] bg-[#0369a1]" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-[#1a1a1a]">The Architecture of Radiance</span>
                 <div className="w-16 h-[1px] bg-[#0369a1]" />
              </div>
            </Reveal>
            <Reveal delay={0.2} y={70}>
              <h1 className="text-7xl md:text-[12vw] font-light tracking-tighter leading-[0.8] text-[#1a1a1a] mb-16 uppercase italic">
                Absolute <br/> <span className="font-bold not-italic">Lustre.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-col items-center justify-center gap-16">
                <p className="text-2xl text-[#1a1a1a]/40 font-light max-w-2xl leading-relaxed italic uppercase">
                  Engineering the world's most significant smiles through high-fidelity clinical protocols and digital precision.
                </p>
                <div className="flex flex-wrap justify-center gap-12">
                  <button className="px-16 py-6 bg-[#1a1a1a] text-white font-bold uppercase tracking-widest text-[10px] rounded-full hover:px-20 transition-all duration-700 shadow-2xl">
                    View Treatments
                  </button>
                  <button className="px-16 py-6 border border-[#1a1a1a]/10 text-[#1a1a1a]/40 font-bold uppercase tracking-widest text-[10px] hover:text-[#1a1a1a] transition-all flex items-center gap-4 rounded-full">
                    <Radio className="w-4 h-4 text-[#0369a1] animate-pulse" /> Live Availability
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
          
          <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end text-[9px] font-bold uppercase tracking-[0.4em] text-[#1a1a1a]/10 italic">
            <span>LONDON / NEW YORK / ZURICH / DUBAI</span>
            <div className="flex gap-6 items-center">
               <Sun className="w-4 h-4 text-[#0369a1]" />
               <span>ESTABLISHED 1994</span>
            </div>
          </div>
        </section>

        {/* ── PILLARS ───────────────── */}
        <section className="py-40 bg-white relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-24 text-center">
             {[
               { icon: Droplets, t: "Molecular Care", d: "Advanced mineral infusion protocols for absolute enamel integrity and health." },
               { icon: Activity, t: "Precision Tech", d: "High-fidelity 3D scanning and laser-guided treatment for uncompromised accuracy." },
               { icon: Heart, t: "Biological Flow", d: "Painless, high-comfort procedures designed for absolute systemic harmony." }
             ].map((p, i) => (
               <Reveal key={i} delay={i * 0.1}>
                  <div className="group cursor-pointer">
                     <div className="w-20 h-20 mx-auto rounded-full bg-[#f0f9ff] border border-[#e0f2fe] flex items-center justify-center mb-10 group-hover:bg-[#0369a1] group-hover:text-white transition-all duration-700">
                        <p.icon className="w-6 h-6 text-[#0369a1] group-hover:text-white transition-colors opacity-40 group-hover:opacity-100" />
                     </div>
                     <h3 className="text-2xl font-bold mb-6 uppercase tracking-tighter italic text-[#1a1a1a]">{p.t}</h3>
                     <p className="text-[#1a1a1a]/30 leading-relaxed font-light text-sm italic px-6 uppercase">{p.d}</p>
                  </div>
               </Reveal>
             ))}
          </div>
        </section>

        {/* ── SERVICES ───────────────── */}
        <section className="py-60 bg-[#fcfcfc] border-y border-[#e0f2fe]/40">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <Reveal>
                 <div className="flex flex-col md:flex-row items-end justify-between mb-32 gap-8 border-b border-[#e0f2fe] pb-16">
                    <div className="max-w-2xl text-left">
                       <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#0369a1] block mb-6 italic font-bold">Treatment Archive</span>
                       <h2 className="text-7xl md:text-[9vw] font-black uppercase tracking-tighter text-[#1a1a1a] leading-none italic">The <span className="font-light not-italic opacity-5">Radiance.</span></h2>
                    </div>
                    <Link href="#" className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest hover:text-[#0369a1] text-[#1a1a1a]/30 transition-colors group italic">
                       Full Treatment Menu <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </Link>
                 </div>
              </Reveal>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                 {SERVICES.map((item, i) => (
                   <Reveal key={i} delay={i * 0.15}>
                      <div className="p-16 bg-white border border-[#e0f2fe] group hover:bg-[#0369a1] transition-all duration-700 cursor-crosshair shadow-xl shadow-black/[0.01]">
                         <div className="text-[10px] font-bold uppercase tracking-widest text-[#0369a1] mb-6 italic group-hover:text-white/40">{item.cat} Protocol</div>
                         <h3 className="text-3xl font-bold uppercase mb-8 tracking-widest italic text-[#1a1a1a] group-hover:text-white">{item.name}</h3>
                         <p className="text-[#1a1a1a]/30 text-sm font-light italic leading-relaxed mb-12 group-hover:text-white/60 transition-colors uppercase">{item.d}</p>
                         <Link href="#" className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest group-hover:gap-8 transition-all group-hover:text-white">
                            Examine Alpha <ChevronRight className="w-4 h-4" />
                         </Link>
                      </div>
                   </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-60 bg-[#1a1a1a] text-white text-center px-6 relative overflow-hidden">
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none flex items-center justify-center font-black italic text-[20vw] whitespace-nowrap rotate-[-12deg]">
              LUMINA LUMINA LUMINA LUMINA
           </div>
           <div className="max-w-4xl mx-auto relative z-10">
              <Reveal>
                 <div className="w-16 h-16 border border-[#e0f2fe]/40 rounded-full mx-auto mb-20 flex items-center justify-center text-[#e0f2fe] italic font-bold text-2xl">L</div>
                 <h2 className="text-8xl md:text-[14vw] font-light uppercase tracking-tighter leading-[0.8] mb-16 italic text-white">
                    Hold The <br/> <span className="font-bold not-italic opacity-10 text-white italic">Eternal.</span>
                 </h2>
                 <p className="text-2xl text-white/40 font-light mb-20 leading-relaxed italic max-w-2xl mx-auto uppercase">
                    Limited intake for our signature transformation sessions. Experience the final layer of healthcare excellence.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                    <button className="px-20 py-10 bg-white text-black font-bold uppercase text-[10px] tracking-[0.3em] rounded-full hover:px-24 transition-all duration-700 italic shadow-2xl">
                       Request Private Consult
                    </button>
                    <button className="px-20 py-10 border border-white/10 text-white/40 font-bold uppercase text-[10px] tracking-[0.3em] rounded-full hover:bg-white/5 transition-all duration-700 italic">
                       View Case Files
                    </button>
                 </div>
              </Reveal>
           </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#fcfcfc] pt-40 pb-12 px-6 border-t border-[#e0f2fe]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
           <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-4 mb-10 group">
                <div className="w-10 h-10 rounded-full bg-[#f0f9ff] border border-[#e0f2fe] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#0369a1]" />
                </div>
                <span className="text-xl font-light tracking-[0.4em] uppercase text-[#1a1a1a]">Lumina Dental</span>
              </Link>
              <p className="text-[#1a1a1a]/30 max-w-sm leading-relaxed mb-12 text-sm font-light italic uppercase">
                 "Radiance is not an aesthetic goal. It is a biological state of uncompromised excellence. Mastered since 1994."
              </p>
              <div className="flex gap-10">
                 {["Instagram", "Journal", "Clinical Hub", "Contact"].map(s => (
                   <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/30 hover:text-[#0369a1] transition-colors italic">{s}</Link>
                 ))}
              </div>
           </div>
           
           {[
             { t: "RADIANCE", l: ["Veneer Alpha", "Laser Whitening", "Orthodontics", "Implants Elite"] },
             { t: "PRACTICE", l: ["Our Lab", "Heritage", "Bio Tech", "Journal"] },
             { t: "ENTITY", l: ["Patient Portal", "Privacy Shield", "SLA Reports", "Contact"] }
           ].map((col, i) => (
             <div key={i} className="space-y-12">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.6em] text-[#1a1a1a]/20">{col.t}</h4>
                <ul className="space-y-6">
                   {col.l.map(link => (
                     <li key={link} className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/30 hover:text-[#0369a1] transition-colors italic">
                        <Link href="#">{link}</Link>
                     </li>
                   ))}
                </ul>
             </div>
           ))}
        </div>
        <div className="max-w-[1400px] mx-auto flex flex-col md:row justify-between items-center gap-8 border-t border-[#e0f2fe] pt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-[#1a1a1a]/10 italic">
           <span>© 2026 LUMINA DENTAL CLINICAL INTEGRITY SA. THE RADIANCE IS ETERNAL.</span>
           <div className="flex gap-12">
              <Link href="#" className="hover:text-[#0369a1] transition-all">LONDON</Link>
              <Link href="#" className="hover:text-[#0369a1] transition-all">ZURICH</Link>
              <Link href="#" className="hover:text-[#0369a1] transition-all">NEW YORK</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}
