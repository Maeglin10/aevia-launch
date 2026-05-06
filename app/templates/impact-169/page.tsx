"use client"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Wind, ArrowRight, Menu, Star, Flower2, Droplets, Heart, Sun, MapPin, ChevronRight, Play, ShoppingBag } from "lucide-react"
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

function BreathingCircle() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
       <motion.div 
         animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} 
         transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
         className="w-[80vw] h-[80vw] rounded-full bg-[#d9c5b2]/40 blur-[120px]" 
       />
    </div>
  )
}

const EXPERIENCES = [
  { name: "The Silent Ritual", cat: "Meditation", d: "A 90-minute immersion into absolute acoustic silence and guided mindfulness." },
  { name: "Mineral Rebirth", cat: "Hydrotherapy", d: "Thermal circuits designed with volcanic minerals for absolute cellular recovery." },
  { name: "Solar Alchemy", cat: "Yoga", d: "A rhythmic movement practice synchronized with the circadian cycle." },
]

export default function OasisWellnessPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#f2eee9] text-[#5c544e] font-sans min-h-screen selection:bg-[#d9c5b2] selection:text-[#5c544e] overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${scrolled ? "bg-white/60 backdrop-blur-2xl border-b border-[#d9c5b2]/30 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-full border border-[#d9c5b2] flex items-center justify-center group-hover:bg-[#d9c5b2] transition-all duration-700">
              <Sun className="w-5 h-5 text-[#8c735a]" />
            </div>
            <span className="text-xl font-light tracking-[0.4em] uppercase text-[#5c544e]">Oasis <span className="font-bold">Wellness</span></span>
          </Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.5em] text-[#5c544e]/30">
            {["Sanctuary", "Rituals", "Retreats", "Philosophy"].map(l => (
              <Link key={l} href="#" className="hover:text-[#8c735a] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-[#5c544e]/30 hover:text-[#5c544e] transition-colors underline underline-offset-8 decoration-[#d9c5b2]">Inner Circle</button>
            <button className="px-10 py-4 bg-[#5c544e] text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-white hover:text-[#5c544e] border border-transparent hover:border-[#d9c5b2] transition-all duration-700 shadow-xl shadow-[#d9c5b2]/20">Book Retreat</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden p-2"><Menu className="w-6 h-6 text-[#5c544e]" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#f2eee9] border-none p-12 text-[#5c544e]">
                <div className="flex flex-col gap-10 mt-16 text-left">
                  {["Experience", "Sanctuary", "Alchemy", "Apply"].map(l => (
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
          <BreathingCircle />
          <div className="absolute inset-0">
             <Image src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=2400" alt="Wellness Space" fill className="object-cover opacity-10 scale-105" priority />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f2eee9]/40 to-[#f2eee9]" />
          </div>

          <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
            <Reveal>
              <div className="flex items-center justify-center gap-8 mb-16 opacity-30">
                 <div className="w-16 h-[1px] bg-[#8c735a]" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-[#5c544e]">Return To The Center</span>
                 <div className="w-16 h-[1px] bg-[#8c735a]" />
              </div>
            </Reveal>
            <Reveal delay={0.2} y={70}>
              <h1 className="text-7xl md:text-[12rem] font-light tracking-tighter leading-[0.8] text-[#5c544e] mb-16 uppercase italic" style={{ fontFamily: "serif" }}>
                Silent <br/> <span className="font-bold not-italic">Rhythm.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-col items-center justify-center gap-16">
                <p className="text-2xl text-[#5c544e]/40 font-light max-w-2xl leading-relaxed italic">
                  A high-fidelity sanctuary for the modern spirit. Rediscover absolute clarity through curated biological and mental rituals.
                </p>
                <div className="flex flex-wrap justify-center gap-12">
                  <button className="px-16 py-6 bg-[#5c544e] text-white font-bold uppercase tracking-widest text-[10px] rounded-full hover:px-20 transition-all duration-700 shadow-xl shadow-[#d9c5b2]/30">
                    Discover Sanctuary
                  </button>
                  <button className="px-16 py-6 border border-[#5c544e]/10 text-[#5c544e]/40 font-bold uppercase tracking-widest text-[10px] hover:text-[#5c544e] transition-all flex items-center gap-4 rounded-full">
                    <Droplets className="w-4 h-4 text-[#8c735a]" /> The Alchemy
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
          
          <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end text-[9px] font-bold uppercase tracking-[0.4em] text-[#5c544e]/20 italic">
            <span>BALI / TULUM / IBIZA / KYOTO</span>
            <div className="flex gap-6">
               <Wind className="w-4 h-4" />
               <span>CIRCADIAN ALIGNED</span>
            </div>
          </div>
        </section>

        {/* ── PILLARS ───────────────── */}
        <section className="py-40 bg-white relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-24 text-center">
             {[
               { icon: Droplets, t: "Hydro Alchemy", d: "Mineral-rich thermal circuits designed for absolute systemic recovery." },
               { icon: Flower2, t: "Botanical Flow", d: "Plant-based treatments using rare high-altitude extracts and cold-pressed oils." },
               { icon: Heart, t: "Mental Clarity", d: "Curated meditation and neural-pacing sessions for deep cognitive reset." }
             ].map((p, i) => (
               <Reveal key={i} delay={i * 0.1}>
                  <div className="group cursor-pointer">
                     <div className="w-20 h-20 mx-auto rounded-full bg-[#f2eee9] border border-[#d9c5b2] flex items-center justify-center mb-10 group-hover:bg-[#d9c5b2] transition-all duration-700">
                        <p.icon className="w-6 h-6 text-[#8c735a] opacity-40 group-hover:opacity-100 transition-opacity" />
                     </div>
                     <h3 className="text-2xl font-bold mb-6 uppercase tracking-tighter italic text-[#5c544e]">{p.t}</h3>
                     <p className="text-[#5c544e]/30 leading-relaxed font-light text-sm italic px-6">{p.d}</p>
                  </div>
               </Reveal>
             ))}
          </div>
        </section>

        {/* ── EXPERIENCES ────────────── */}
        <section className="py-60 bg-[#f2eee9] border-y border-[#d9c5b2]/30">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <Reveal>
                 <div className="flex flex-col md:flex-row items-end justify-between mb-32 gap-8 border-b border-[#d9c5b2] pb-16">
                    <div className="max-w-2xl text-left">
                       <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#8c735a] block mb-6 italic">The Sanctuary Files</span>
                       <h2 className="text-7xl md:text-[9vw] font-black uppercase tracking-tighter text-[#5c544e] leading-none italic" style={{ fontFamily: "serif" }}>Pure <br/> <span className="font-light not-italic opacity-10">Rituals.</span></h2>
                    </div>
                    <Link href="#" className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest hover:text-[#8c735a] text-[#5c544e]/30 transition-colors group italic">
                       View Complete Menu <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </Link>
                 </div>
              </Reveal>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                 {EXPERIENCES.map((item, i) => (
                   <Reveal key={i} delay={i * 0.15}>
                      <div className="group cursor-pointer">
                         <div className="aspect-[4/5] relative mb-12 overflow-hidden rounded-[4rem] border border-[#d9c5b2] p-10 bg-white">
                            <Image src={`https://images.unsplash.com/photo-${i === 0 ? "1515377905703-c4788e51af15" : i === 1 ? "1544161515-4ab6ce6db874" : "1506126613408-eca07ce68773"}?auto=format&fit=crop&q=80&w=1200`} alt={item.name} fill className="object-cover scale-110 group-hover:scale-100 transition-all duration-[3000ms] opacity-60 grayscale group-hover:grayscale-0" />
                            <div className="absolute inset-0 bg-[#5c544e]/5 group-hover:bg-transparent transition-all duration-1000" />
                            <div className="absolute top-10 right-10">
                               <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center border border-[#d9c5b2] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                  <ArrowRight className="w-5 h-5 text-[#5c544e] rotate-[-45deg]" />
                               </div>
                            </div>
                            <div className="absolute bottom-12 left-12 right-12">
                               <div className="text-[10px] font-bold uppercase tracking-widest text-[#8c735a] mb-3 italic">{item.cat} Protocol</div>
                               <h3 className="text-4xl font-bold uppercase tracking-widest text-[#5c544e] leading-tight mb-2" style={{ fontFamily: "serif" }}>{item.name}</h3>
                               <p className="text-[10px] font-bold text-[#5c544e]/30 tracking-widest uppercase italic">{item.d}</p>
                            </div>
                         </div>
                      </div>
                   </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-60 bg-[#5c544e] text-white text-center px-6 relative overflow-hidden">
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none flex items-center justify-center">
              <Sun className="w-[800px] h-[800px]" />
           </div>
           <div className="max-w-4xl mx-auto relative z-10">
              <Reveal>
                 <div className="w-16 h-16 border border-[#d9c5b2]/40 rounded-full mx-auto mb-20 flex items-center justify-center text-[#d9c5b2] italic font-bold">O</div>
                 <h2 className="text-8xl md:text-[14vw] font-light uppercase tracking-tighter leading-[0.8] mb-16 italic" style={{ fontFamily: "serif" }}>
                    Hold The <br/> <span className="font-bold not-italic opacity-10 text-white">Silence.</span>
                 </h2>
                 <p className="text-2xl text-white/40 font-light mb-20 leading-relaxed italic max-w-2xl mx-auto">
                    Limited reservations available for our seasonal retreats. Master the art of return.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                    <button className="px-20 py-10 bg-white text-[#5c544e] font-bold uppercase text-[10px] tracking-[0.3em] rounded-full hover:px-24 transition-all duration-700 italic shadow-2xl">
                       Inquire Availability
                    </button>
                    <button className="px-20 py-10 border border-white/10 text-white/40 font-bold uppercase text-[10px] tracking-[0.3em] rounded-full hover:bg-white/5 transition-all duration-700 italic">
                       The Journal
                    </button>
                 </div>
              </Reveal>
           </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#f2eee9] pt-40 pb-12 px-6 border-t border-[#d9c5b2]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
           <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-4 mb-10 group">
                <div className="w-10 h-10 rounded-full border border-[#d9c5b2] flex items-center justify-center">
                  <Sun className="w-5 h-5 text-[#8c735a]" />
                </div>
                <span className="text-xl font-light tracking-[0.4em] uppercase text-[#5c544e]">Oasis Wellness</span>
              </Link>
              <p className="text-[#5c544e]/30 max-w-sm leading-relaxed mb-12 text-sm font-light italic" style={{ fontFamily: "serif" }}>
                 "Stillness is not the absence of movement. It is the absolute presence of the spirit. Curated since 2012."
              </p>
              <div className="flex gap-10">
                 {["Instagram", "Journal", "Retreats", "Atelier"].map(s => (
                   <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-[#5c544e]/30 hover:text-[#8c735a] transition-colors italic">{s}</Link>
                 ))}
              </div>
           </div>
           
           {[
             { t: "SANCTUARY", l: ["Mineral Baths", "Silent Room", "Solar Studio", "Botany Lab"] },
             { t: "RETREATS", l: ["Bali Ritual", "Ibiza Flow", "Kyoto Silence", "Tulum Soul"] },
             { t: "ENTITY", l: ["The Inner Circle", "Careers", "Legal", "Contact"] }
           ].map((col, i) => (
             <div key={i} className="space-y-12">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.6em] text-[#5c544e]/20">{col.t}</h4>
                <ul className="space-y-6">
                   {col.l.map(link => (
                     <li key={link} className="text-xs font-bold uppercase tracking-widest text-[#5c544e]/30 hover:text-[#5c544e] transition-colors italic">
                        <Link href="#">{link}</Link>
                     </li>
                   ))}
                </ul>
             </div>
           ))}
        </div>
        <div className="max-w-[1400px] mx-auto flex flex-col md:row justify-between items-center gap-8 border-t border-[#d9c5b2] pt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-[#5c544e]/10 italic">
           <span>© 2026 OASIS WELLNESS SANCTUARY GROUP. THE SILENCE IS ETERNAL.</span>
           <div className="flex gap-12">
              <Link href="#" className="hover:text-[#8c735a] transition-all">BALI</Link>
              <Link href="#" className="hover:text-[#8c735a] transition-all">IBIZA</Link>
              <Link href="#" className="hover:text-[#8c735a] transition-all">KYOTO</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}
