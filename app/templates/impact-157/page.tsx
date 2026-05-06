"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ArrowRight, Menu, Star, Flower2, Moon, Sparkles, MapPin, Camera, Music, ChevronRight, Play } from "lucide-react"
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

function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden rounded-[4rem]">
      <motion.div style={{ y }} className="absolute inset-[-15%] w-[130%] h-[130%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

export default function ElysianEventsPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#faf7f2] text-[#4a4a4a] font-sans min-h-screen selection:bg-[#f3e5f5] selection:text-[#4a4a4a] overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${scrolled ? "bg-white/80 backdrop-blur-xl border-b border-black/5 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-[#f3e5f5] transition-all duration-700">
              <Flower2 className="w-5 h-5 text-[#8e8e8e]" />
            </div>
            <span className="text-xl font-light tracking-[0.3em] uppercase">Elysian <span className="font-bold">Events</span></span>
          </Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-black/30">
            {["Sanctuary", "Destinations", "Essence", "Journal"].map(l => (
              <Link key={l} href="#" className="hover:text-black transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors underline underline-offset-8 decoration-pink-200">The Gallery</button>
            <button className="px-10 py-4 bg-[#4a4a4a] text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-transparent hover:text-[#4a4a4a] border border-transparent hover:border-black/20 transition-all duration-700">Inquire</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden p-2"><Menu className="w-6 h-6 text-black" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#faf7f2] border-none p-12 text-black">
                <div className="flex flex-col gap-10 mt-16 text-left">
                  {["Experience", "Locations", "Philosophy", "Book"].map(l => (
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
          <div className="absolute inset-0">
             <Image src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=2400" alt="Luxury Event" fill className="object-cover opacity-10 scale-105" priority />
          </div>

          <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
            <Reveal>
              <div className="flex items-center justify-center gap-6 mb-12 opacity-30">
                 <div className="w-12 h-[1px] bg-black" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-black">Artisan Celebration</span>
                 <div className="w-12 h-[1px] bg-black" />
              </div>
            </Reveal>
            <Reveal delay={0.2} y={70}>
              <h1 className="text-7xl md:text-[11vw] font-light tracking-tighter leading-[0.8] text-[#1a1a1a] mb-12 uppercase" style={{ fontFamily: "serif" }}>
                Rare <br/> <span className="italic">Moments.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-col items-center justify-center gap-12">
                <p className="text-2xl text-black/40 font-light max-w-xl leading-relaxed italic">
                  Curating the world's most intimate and ethereal celebrations. Where architectural beauty meets human connection.
                </p>
                <div className="flex flex-wrap justify-center gap-10">
                  <button className="px-16 py-6 bg-[#4a4a4a] text-white font-bold uppercase tracking-widest text-[10px] rounded-full hover:px-20 transition-all duration-700">
                    Discover The Essence
                  </button>
                  <button className="px-16 py-6 border border-black/10 text-black/60 font-bold uppercase tracking-widest text-[10px] hover:bg-black/5 transition-all flex items-center gap-4 rounded-full">
                    <Play className="w-3 h-3 fill-current" /> Witness A Moment
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
          
          <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end text-[9px] font-bold uppercase tracking-[0.4em] text-black/20 italic">
            <span>PARIS / COMO / SANTORINI / BALI</span>
            <div className="flex gap-4">
               <Heart className="w-3 h-3" />
               <Sparkles className="w-3 h-3" />
            </div>
          </div>
        </section>

        {/* ── PILLARS ───────────────── */}
        <section className="py-40 bg-white">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
                 {[
                   { icon: Flower2, t: "Botanical Design", d: "Sourcing the world's most rare florals to create immersive living atmospheres." },
                   { icon: Music, t: "Sonic Ambiance", d: "Curated soundscapes and performances that define the emotional rhythm of your day." },
                   { icon: Camera, t: "Visual Legacy", d: "Cinematic documentation of every subtle interaction and architectural detail." }
                 ].map((p, i) => (
                   <Reveal key={i} delay={i * 0.1}>
                      <div className="text-center group">
                         <div className="w-20 h-20 mx-auto rounded-full border border-black/5 flex items-center justify-center mb-10 group-hover:bg-[#fdf3f2] transition-colors duration-700">
                            <p.icon className="w-6 h-6 text-black/20" />
                         </div>
                         <h3 className="text-2xl font-bold mb-6 uppercase tracking-tighter italic" style={{ fontFamily: "serif" }}>{p.t}</h3>
                         <p className="text-black/40 leading-relaxed font-light text-sm italic">{p.d}</p>
                      </div>
                   </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ── DESTINATIONS ──────────── */}
        <section className="py-60 bg-[#faf7f2] relative overflow-hidden">
           <div className="max-w-[1600px] mx-auto px-6 md:px-12">
              <Reveal>
                 <div className="flex flex-col lg:flex-row items-end justify-between mb-32 gap-8 border-b border-black/5 pb-16">
                    <div className="max-w-2xl">
                       <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/30 block mb-6">The Global Stage</span>
                       <h2 className="text-6xl md:text-[8vw] font-light uppercase tracking-tighter text-[#1a1a1a] leading-none italic" style={{ fontFamily: "serif" }}>Ethereal <br/> <span className="not-italic font-bold opacity-10">Venues.</span></h2>
                    </div>
                    <Link href="#" className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest hover:text-black text-black/40 transition-colors group italic">
                       View Map Of Essence <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </Link>
                 </div>
              </Reveal>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                 <Reveal>
                    <div className="relative aspect-[16/11]">
                       <ParallaxImg src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200" alt="Santorini Event" />
                       <div className="absolute bottom-12 left-12 p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                          <div className="text-[9px] font-bold text-white uppercase tracking-widest mb-1 italic">Location 01</div>
                          <div className="text-2xl font-bold text-white tracking-tighter" style={{ fontFamily: "serif" }}>Aethra Cliffs, Greece</div>
                       </div>
                    </div>
                 </Reveal>
                 <div className="flex flex-col justify-center space-y-16 lg:pl-20">
                    <Reveal delay={0.2}>
                       <h3 className="text-4xl md:text-6xl font-light uppercase text-[#1a1a1a] italic leading-tight" style={{ fontFamily: "serif" }}>The World <br/> As Your <span className="not-italic font-bold opacity-10">Altar.</span></h3>
                       <p className="text-2xl text-black/40 font-light leading-relaxed italic max-w-md">
                          From the marble palazzos of Lake Como to the untouched cliffs of the Cyclades, we secure the world's most evocative stages for your story.
                       </p>
                    </Reveal>
                    <Reveal delay={0.3}>
                       <div className="flex gap-12">
                          <button className="px-12 py-5 bg-[#4a4a4a] text-white font-bold uppercase tracking-widest text-[10px] rounded-full hover:px-14 transition-all">Request Venue Audit</button>
                          <div className="flex -space-x-3 items-center">
                             {[1,2,3,4].map(i => (
                               <div key={i} className="w-10 h-10 rounded-full border-2 border-[#faf7f2] bg-pink-100 flex items-center justify-center overflow-hidden">
                                  <div className="w-full h-full bg-gradient-to-br from-pink-200 to-white" />
                               </div>
                             ))}
                             <span className="text-[9px] font-bold uppercase tracking-widest text-black/20 pl-6">Active Collections</span>
                          </div>
                       </div>
                    </Reveal>
                 </div>
              </div>
           </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-60 bg-white text-[#1a1a1a] text-center relative overflow-hidden">
           <div className="max-w-4xl mx-auto px-6 relative z-10">
              <Reveal>
                 <div className="w-20 h-20 mx-auto mb-20 rounded-full bg-[#fdf3f2] flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-[#8e8e8e]" />
                 </div>
                 <h2 className="text-7xl md:text-[15vw] font-light uppercase tracking-tighter leading-[0.8] mb-16 italic" style={{ fontFamily: "serif" }}>
                    Hold The <br/> <span className="not-italic font-bold opacity-10 italic">Eternal.</span>
                 </h2>
                 <p className="text-2xl text-black/40 font-light mb-20 leading-relaxed italic max-w-2xl mx-auto">
                    We accept a limited number of commissions each season to ensure absolute focus on the refinement of every interaction.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                    <button className="px-20 py-8 bg-[#1a1a1a] text-white font-bold uppercase tracking-[0.3em] text-[10px] rounded-full hover:px-24 transition-all duration-700 italic">
                       Initiate Commission
                    </button>
                    <button className="px-20 py-8 border border-black/10 text-black/40 font-bold uppercase tracking-[0.3em] text-[10px] rounded-full hover:text-black transition-all italic">
                       View Portfolio
                    </button>
                 </div>
              </Reveal>
           </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#faf7f2] pt-40 pb-12 px-6 border-t border-black/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
           <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-4 mb-10 group">
                <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center">
                  <Flower2 className="w-5 h-5 text-[#8e8e8e]" />
                </div>
                <span className="text-xl font-light tracking-[0.3em] uppercase text-black">Elysian Events</span>
              </Link>
              <p className="text-black/20 max-w-sm leading-relaxed mb-12 text-sm font-light italic" style={{ fontFamily: "serif" }}>
                 "In the silence of the moment, we find the beauty of a lifetime. Curated with absolute intent."
              </p>
              <div className="flex gap-10">
                 {["Instagram", "Vimeo", "Pinterest", "Journal"].map(s => (
                   <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-black/20 hover:text-black transition-colors italic">{s}</Link>
                 ))}
              </div>
           </div>
           
           {[
             { t: "THE EXPERIENCE", l: ["Bespoke Planning", "Venue Audit", "Botanical Design", "Sonic Lab"] },
             { t: "DESTINATIONS", l: ["Season 2026", "Lake Como", "Cyclades", "Bali Retreats"] },
             { t: "ENTITY", l: ["Our Legacy", "The Team", "Commissions", "Legal"] }
           ].map((col, i) => (
             <div key={i} className="space-y-12">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.6em] text-black/20">{col.t}</h4>
                <ul className="space-y-6">
                   {col.l.map(link => (
                     <li key={link} className="text-xs font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors italic">
                        <Link href="#">{link}</Link>
                     </li>
                   ))}
                </ul>
             </div>
           ))}
        </div>
        <div className="max-w-[1400px] mx-auto flex flex-col md:row justify-between items-center gap-8 border-t border-black/5 pt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-black/10 italic">
           <span>© 2026 ELYSIAN EVENTS GLOBAL COMMISSIONS. MOMENTS ARE ETERNAL.</span>
           <div className="flex gap-12">
              <Link href="#" className="hover:text-black transition-all">FLORENCE</Link>
              <Link href="#" className="hover:text-black transition-all">NEW YORK</Link>
              <Link href="#" className="hover:text-black transition-all">TOKYO</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}
