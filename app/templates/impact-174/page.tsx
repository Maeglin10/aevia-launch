"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Zap, ArrowRight, Menu, Star, Shield, Activity, Compass, Wind, ChevronRight, Play, ShoppingBag, Gauge, Timer } from "lucide-react"
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

function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"])
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden grayscale contrast-125 group-hover:grayscale-0 transition-all duration-1000">
      <motion.div style={{ y }} className="absolute inset-[-15%] w-[130%] h-[130%]">
        <Image src={src} alt={alt} fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
      </motion.div>
    </div>
  )
}

const BIKES = [
  { name: "V-01 Aero Elite", cat: "Road // Competition", price: "€12,500", img: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=1200" },
  { name: "G-Alpha Gravel", cat: "Adventure // Speed", price: "€8,200", img: "https://images.unsplash.com/photo-1532298229144-0ee050c99d4b?auto=format&fit=crop&q=80&w=1200" },
  { name: "T-Omega Chrono", cat: "Time Trial // Pure Alpha", price: "€14,800", img: "https://images.unsplash.com/photo-1544191161-0536c646337f?auto=format&fit=crop&q=80&w=1200" },
]

export default function VelosCyclingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#fcfcfc] text-[#1a1a1a] font-sans min-h-screen selection:bg-red-600 selection:text-white overflow-x-hidden">
      
      {/* ── PERFORMANCE OVERLAY ───── */}
      <div className="fixed inset-0 pointer-events-none z-[60] border-[20px] border-white/40 hidden lg:block" />

      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-white/95 backdrop-blur-xl border-b border-black/5 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-red-600 flex items-center justify-center group-hover:-skew-x-12 transition-transform duration-500 shadow-xl shadow-red-500/20">
              <Timer className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-[0.3em] uppercase text-[#1a1a1a] italic">Velos<span className="text-red-600">.</span></span>
          </Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.5em] text-black/20">
            {["Machines", "Aero Lab", "History", "Peloton"].map(l => (
              <Link key={l} href="#" className="hover:text-red-600 transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-black/20 hover:text-black transition-colors underline underline-offset-8 decoration-red-600/30 italic">Team Portal</button>
            <button className="px-10 py-3.5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-red-600 transition-all duration-500 italic shadow-xl shadow-black/10">Order Machine</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden p-2"><Menu className="w-6 h-6 text-black" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#fcfcfc] border-none p-12 text-black font-sans">
                <div className="flex flex-col gap-10 mt-16 text-left font-black uppercase tracking-tighter italic">
                  {["Racing", "Labs", "Garage", "Contact"].map(l => (
                    <Link key={l} href="#" className="text-4xl hover:text-red-600 transition-all">{l}</Link>
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
          <div className="absolute inset-0">
             <Image src="https://images.unsplash.com/photo-1544191161-0536c646337f?auto=format&fit=crop&q=80&w=2400" alt="Racing Action" fill className="object-cover opacity-10 scale-105" priority />
             <div className="absolute inset-0 bg-gradient-to-t from-[#fcfcfc] via-transparent to-[#fcfcfc]/50" />
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto px-6 text-center">
            <Reveal>
              <div className="flex items-center justify-center gap-8 mb-16 opacity-30">
                 <div className="w-16 h-[1px] bg-red-600" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-black">Engineering The Speed of Soul</span>
                 <div className="w-16 h-[1px] bg-red-600" />
              </div>
            </Reveal>
            <Reveal delay={0.2} y={70}>
              <h1 className="text-7xl md:text-[14vw] font-black tracking-tighter leading-[0.75] text-[#1a1a1a] mb-16 uppercase italic">
                PURE <br/> <span className="font-light not-italic opacity-10 italic">MOTION.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-col items-center justify-center gap-16">
                <p className="text-2xl text-black/40 font-light max-w-2xl leading-relaxed italic uppercase">
                  Zero compromise aerodynamics. Mastered through high-fidelity carbon engineering and wind-tunnel validation.
                </p>
                <div className="flex flex-wrap justify-center gap-12">
                  <button className="px-16 py-6 bg-black text-white font-black uppercase tracking-widest text-[10px] hover:px-20 transition-all duration-700 italic shadow-2xl">
                    Configure Machine
                  </button>
                  <button className="px-16 py-6 border border-black/10 text-black/30 font-bold uppercase tracking-widest text-[10px] hover:text-black transition-all flex items-center gap-4 italic">
                    <Gauge className="w-4 h-4 text-red-600" /> The Aero Lab
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
          
          <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end text-[9px] font-bold uppercase tracking-[0.4em] text-black/10 italic">
            <span>CARBON T-1100 / AEROWALL / ELITE FLOW</span>
            <div className="flex gap-10 items-center">
               <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-1.5 h-6 bg-red-600 -skew-x-12" />
                  ))}
               </div>
               <span>OPERATIONAL_READY_v8.0</span>
            </div>
          </div>
        </section>

        {/* ── STATS ──────────────────── */}
        <section className="py-24 bg-black text-white border-y-4 border-red-600 overflow-hidden">
           <motion.div 
             animate={{ x: ["0%", "-50%"] }} 
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="flex gap-20 whitespace-nowrap text-5xl font-black uppercase italic tracking-tighter"
           >
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center gap-10">
                   <span>Lightness</span>
                   <div className="w-4 h-4 bg-red-600 -skew-x-12" />
                   <span>Aerodynamics</span>
                   <div className="w-4 h-4 bg-red-600 -skew-x-12" />
                   <span>Absolute Power</span>
                   <div className="w-4 h-4 bg-red-600 -skew-x-12" />
                </div>
              ))}
           </motion.div>
        </section>

        {/* ── THE LAB ────────────────── */}
        <section className="py-60 bg-white relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
             <Reveal>
                <div className="relative aspect-square p-2 bg-[#fcfcfc] border border-black/5 group overflow-hidden">
                   <ParallaxImg src="https://images.unsplash.com/photo-1532298229144-0ee050c99d4b?auto=format&fit=crop&q=80&w=1200" alt="Bike Frame Detail" />
                   <div className="absolute inset-0 bg-red-600/10 group-hover:bg-transparent transition-all duration-1000" />
                </div>
             </Reveal>
             <div>
                <Reveal>
                   <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-red-600 block mb-12 italic">The Engineering Core</span>
                   <h2 className="text-6xl md:text-[9vw] font-black uppercase tracking-tighter text-[#1a1a1a] leading-none mb-16 italic">Hard <br/> <span className="font-light not-italic opacity-5">Carbon.</span></h2>
                   <p className="text-2xl font-light text-black/40 leading-relaxed mb-20 italic uppercase">
                      We don't build bikes. We build extensions of the human soul. Every gram is accounted for; every curve validated in the wind.
                   </p>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                      {[
                        { icon: Wind, t: "Aero Efficiency", d: "Validated drag reduction of 14% compared to legacy architectures." },
                        { icon: Activity, t: "Stiffness Index", d: "Optimized power transfer through high-modulus T-1100 carbon layup." }
                      ].map((item, i) => (
                        <div key={i} className="group">
                           <div className="w-12 h-12 border border-black/10 flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-all -skew-x-12 shadow-lg">
                              <item.icon className="w-5 h-5" />
                           </div>
                           <h4 className="text-xs font-black uppercase tracking-widest mb-4 text-[#1a1a1a] italic">{item.t}</h4>
                           <p className="text-sm font-light leading-relaxed text-black/30 italic uppercase">{item.d}</p>
                        </div>
                      ))}
                   </div>
                </Reveal>
             </div>
          </div>
        </section>

        {/* ── COLLECTION ─────────────── */}
        <section className="py-60 bg-[#fcfcfc] border-y border-black/5">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <Reveal>
                 <div className="flex flex-col md:flex-row items-end justify-between mb-32 gap-8 border-b border-black/5 pb-16">
                    <div className="max-w-2xl text-left">
                       <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-red-600 block mb-6 italic">The Fleet</span>
                       <h2 className="text-7xl md:text-[10vw] font-black uppercase tracking-tighter text-[#1a1a1a] leading-none italic">The <span className="font-light not-italic opacity-10">Machines.</span></h2>
                    </div>
                    <Link href="#" className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest hover:text-red-600 text-black/30 transition-colors group italic">
                       View Complete Garage <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </Link>
                 </div>
              </Reveal>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                 {BIKES.map((item, i) => (
                   <Reveal key={i} delay={i * 0.15}>
                      <div className="group cursor-pointer">
                         <div className="aspect-[3/4] relative mb-12 overflow-hidden border border-black/5 p-1 bg-white shadow-xl shadow-black/[0.02]">
                            <ParallaxImg src={item.img} alt={item.name} />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-1000" />
                            <div className="absolute top-10 right-10">
                               <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 shadow-sm">
                                  <ShoppingBag className="w-5 h-5 text-white" />
                               </div>
                            </div>
                            <div className="absolute bottom-12 left-12 right-12">
                               <div className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-2 italic">{item.cat}</div>
                               <h3 className="text-4xl font-bold uppercase tracking-widest text-white italic group-hover:translate-x-2 transition-transform duration-700">{item.name}</h3>
                            </div>
                         </div>
                         <div className="flex justify-between items-center px-6">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-black/20 italic">Custom Spec Available</span>
                            <span className="text-2xl font-bold text-[#1a1a1a] tracking-tighter italic">{item.price}</span>
                         </div>
                      </div>
                   </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-60 bg-white text-black text-center relative overflow-hidden">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden whitespace-nowrap text-[20vw] font-black italic -rotate-12">
              VELOS VELOS VELOS VELOS VELOS
           </div>
           <div className="max-w-4xl mx-auto px-6 relative z-10">
              <Reveal>
                 <div className="w-20 h-20 mx-auto mb-20 border-4 border-black flex items-center justify-center font-black text-3xl italic">V</div>
                 <h2 className="text-8xl md:text-[14vw] font-black uppercase tracking-tighter leading-[0.8] mb-16 italic">
                    Claim The <br/> <span className="not-italic font-bold opacity-20 italic">Road.</span>
                 </h2>
                 <p className="text-2xl text-black/40 font-light mb-20 leading-relaxed italic max-w-2xl mx-auto uppercase">
                    Limited production for our signature chassis. Hand-finished in our Italian atelier. Master your cadence.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                    <button className="px-20 py-8 bg-black text-white font-black uppercase tracking-[0.3em] text-[10px] hover:px-24 transition-all duration-700 italic shadow-2xl">
                       Start Configuration
                    </button>
                    <button className="px-20 py-8 border border-black/10 text-black/30 font-bold uppercase tracking-[0.3em] text-[10px] hover:text-black transition-all italic">
                       View Team Reports
                    </button>
                 </div>
              </Reveal>
           </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#fcfcfc] pt-40 pb-12 px-6 border-t border-black/5 relative z-[70]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
           <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-4 mb-10 group">
                <div className="w-10 h-10 bg-red-600 flex items-center justify-center">
                  <Timer className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-black tracking-[0.3em] uppercase text-[#1a1a1a] italic">Velos Cycling.</span>
              </Link>
              <p className="text-black/20 max-w-sm leading-relaxed mb-12 text-[10px] font-bold uppercase italic">
                 "Speed is the only variable that defines the hierarchy of focus. We master the motion."
              </p>
              <div className="flex gap-10">
                 {["Instagram", "Strava", "Vimeo", "Journal"].map(s => (
                   <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-black/20 hover:text-red-600 transition-colors italic">{s}</Link>
                 ))}
              </div>
           </div>
           
           {[
             { t: "MACHINES", l: ["Road Series", "Gravel Alpha", "TT Omega", "Custom Lab"] },
             { t: "GEAR", l: ["Apparel Elite", "Components", "Wheelsets", "Aero Helmet"] },
             { t: "ENTITY", l: ["Aero Lab", "Privacy Shield", "SLA Reports", "Contact"] }
           ].map((col, i) => (
             <div key={i} className="space-y-12">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.6em] text-black/20">{col.t}</h4>
                <ul className="space-y-6">
                   {col.l.map(link => (
                     <li key={link} className="text-xs font-bold uppercase tracking-widest text-black/40 hover:text-red-600 transition-colors italic">
                        <Link href="#">{link}</Link>
                     </li>
                   ))}
                </ul>
             </div>
           ))}
        </div>
        <div className="max-w-[1400px] mx-auto flex flex-col md:row justify-between items-center gap-8 border-t border-black/5 pt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-black/10 italic">
           <span>© 2026 VELOS CYCLING PERFORMANCE AG. THE MOTION IS ETERNAL.</span>
           <div className="flex gap-12">
              <Link href="#" className="hover:text-red-600 transition-all underline decoration-red-600/20">SYSTEM: NOMINAL</Link>
              <Link href="#" className="hover:text-red-600 transition-all underline decoration-red-600/20">AERO_ENABLED</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}
