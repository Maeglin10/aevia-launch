"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Coffee, ArrowRight, Menu, Star, Shield, Wind, Droplets, Heart, ChevronRight, Play, ShoppingBag, Zap } from "lucide-react"
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
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"])
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
      <motion.div style={{ y }} className="absolute inset-[-15%] w-[130%] h-[130%]">
        <Image src={src} alt={alt} fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
      </motion.div>
    </div>
  )
}

const BEANS = [
  { name: "Ethiopia Yirgacheffe", note: "Floral, Citrus, Earl Grey", price: "€28", img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=1200" },
  { name: "Colombia Dark Roast", note: "Dark Chocolate, Caramel, Nutty", price: "€24", img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1200" },
  { name: "Sumatra Mandheling", note: "Earthy, Spicy, Low Acidity", price: "€32", img: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=1200" },
]

export default function NeroCoffeePage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#0a0807] text-[#a8a29e] font-sans min-h-screen selection:bg-[#d4af37] selection:text-black overflow-x-hidden">
      
      {/* ── GRAIN OVERLAY ────────── */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-black/90 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 border border-[#d4af37]/30 flex items-center justify-center group-hover:border-[#d4af37] transition-all duration-700">
              <Coffee className="w-5 h-5 text-[#d4af37]" />
            </div>
            <span className="text-xl font-light tracking-[0.4em] uppercase text-white">Nero <span className="font-bold">Coffee</span></span>
          </Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.5em] text-white/30">
            {["The Roast", "Origin", "Atelier", "Brew"].map(l => (
              <Link key={l} href="#" className="hover:text-[#d4af37] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors underline underline-offset-8 decoration-[#d4af37]/20">Wholesale Portal</button>
            <button className="px-10 py-4 bg-[#d4af37] text-black text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-700 italic">Shop The Roast</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden p-2"><Menu className="w-6 h-6 text-white" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#0a0807] border-white/5 p-12 text-white font-sans">
                <div className="flex flex-col gap-10 mt-16 text-left">
                  {["Collections", "Sourcing", "The Lab", "Shop"].map(l => (
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
             <Image src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=2400" alt="Coffee Pour" fill className="object-cover opacity-10 scale-105" priority />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0a0807] via-transparent to-[#0a0807]/50" />
          </div>

          <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
            <Reveal>
              <div className="flex items-center justify-center gap-8 mb-16 opacity-30">
                 <div className="w-16 h-[1px] bg-[#d4af37]" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white">The Art of the Dark Roast</span>
                 <div className="w-16 h-[1px] bg-[#d4af37]" />
              </div>
            </Reveal>
            <Reveal delay={0.2} y={70}>
              <h1 className="text-7xl md:text-[14vw] font-light tracking-tighter leading-[0.8] text-white mb-16 uppercase italic">
                Beyond <br/> <span className="font-bold not-italic">Espresso.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-col items-center justify-center gap-16">
                <p className="text-2xl text-white/40 font-light max-w-2xl leading-relaxed italic">
                  Crafting uncompromised specialty coffee through high-fidelity roasting protocols and direct-trade sourcing.
                </p>
                <div className="flex flex-wrap justify-center gap-12">
                  <button className="px-16 py-6 bg-white text-black font-bold uppercase tracking-widest text-[10px] hover:px-20 transition-all duration-700 italic">
                    Explore Single Origins
                  </button>
                  <button className="px-16 py-6 border border-white/10 text-white/40 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-all flex items-center gap-4">
                    <Play className="w-3 h-3 fill-current" /> Witness The Roast
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
          
          <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end text-[9px] font-bold uppercase tracking-[0.4em] text-white/10 italic">
            <span>ETHIOPIA / COLOMBIA / SUMATRA / BRAZIL</span>
            <div className="flex gap-6 items-center">
               <Zap className="w-4 h-4 text-[#d4af37]" />
               <span>ROASTED DAILY IN BERLIN</span>
            </div>
          </div>
        </section>

        {/* ── PHILOSOPHY ────────────── */}
        <section className="py-60 bg-black relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                <Reveal>
                   <div className="relative aspect-square p-2 bg-[#0a0807] border border-white/5 group overflow-hidden">
                      <ParallaxImg src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=1200" alt="Coffee Beans" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-1000" />
                   </div>
                </Reveal>
                <div>
                   <Reveal>
                      <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#d4af37] block mb-12 italic">The Roast Profile</span>
                      <h2 className="text-6xl md:text-[9vw] font-light uppercase tracking-tighter text-white leading-none mb-16 italic">Absolute <br/> <span className="not-italic font-bold opacity-10">Darkness.</span></h2>
                      <p className="text-2xl font-light text-white/40 leading-relaxed mb-20 italic">
                         We don't just roast; we extract the soul of the bean. Every batch is monitored through real-time thermal curves to ensure absolute fidelity of flavor.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                         {[
                           { icon: Heart, t: "Direct Trade", d: "Sourcing directly from the world's most resilient farmers at fair price premiums." },
                           { icon: Droplets, t: "Precision Brew", d: "Recommended brewing parameters provided for every unique roast profile." }
                         ].map((item, i) => (
                           <div key={i} className="group">
                              <div className="w-12 h-12 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-[#d4af37] group-hover:text-black transition-all">
                                 <item.icon className="w-5 h-5" />
                              </div>
                              <h4 className="text-xs font-black uppercase tracking-widest mb-4 text-white italic">{item.t}</h4>
                              <p className="text-sm font-light leading-relaxed text-white/20 italic">{item.d}</p>
                           </div>
                         ))}
                      </div>
                   </Reveal>
                </div>
             </div>
          </div>
        </section>

        {/* ── COLLECTION ─────────────── */}
        <section className="py-60 bg-[#0a0807]">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <Reveal>
                 <div className="flex flex-col md:flex-row items-end justify-between mb-32 gap-8 border-b border-white/5 pb-16">
                    <div className="max-w-2xl">
                       <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#d4af37] block mb-6">Seasonal Harvest</span>
                       <h2 className="text-7xl md:text-[11vw] font-black uppercase tracking-tighter text-white leading-none italic">The <span className="font-light not-italic opacity-10">Holdings.</span></h2>
                    </div>
                    <Link href="#" className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest hover:text-[#d4af37] text-white/30 transition-colors group italic">
                       View All Roasts <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </Link>
                 </div>
              </Reveal>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                 {BEANS.map((item, i) => (
                   <Reveal key={i} delay={i * 0.15}>
                      <div className="group cursor-pointer">
                         <div className="aspect-[3/4] relative mb-12 overflow-hidden border border-white/5 p-1 bg-white/[0.02]">
                            <Image src={item.img} alt={item.name} fill className="object-cover scale-110 group-hover:scale-100 transition-all duration-[3000ms] opacity-60 group-hover:opacity-100" />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-1000" />
                            <div className="absolute top-10 right-10">
                               <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                  <ShoppingBag className="w-5 h-5 text-white" />
                               </div>
                            </div>
                            <div className="absolute bottom-12 left-12 right-12">
                               <div className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] mb-3 italic">Single Origin</div>
                               <h3 className="text-4xl font-bold uppercase tracking-widest text-white leading-tight mb-2">{item.name}</h3>
                               <p className="text-[10px] font-bold text-white/20 tracking-widest uppercase italic">{item.note}</p>
                            </div>
                         </div>
                         <div className="flex justify-between items-center px-2">
                            <button className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors underline underline-offset-4 decoration-white/10">Add to Ritual</button>
                            <span className="text-2xl font-bold text-white tracking-tighter italic">{item.price}</span>
                         </div>
                      </div>
                   </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-60 bg-white text-black text-center px-6 relative overflow-hidden">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center italic font-black text-[20vw] whitespace-nowrap rotate-[-12deg]">
              NERO NERO NERO NERO NERO
           </div>
           <div className="max-w-4xl mx-auto relative z-10">
              <Reveal>
                 <div className="w-16 h-16 border-2 border-black mx-auto mb-20 flex items-center justify-center font-black text-black text-2xl italic">N</div>
                 <h2 className="text-8xl md:text-[14vw] font-black uppercase tracking-tighter leading-[0.8] mb-16 italic">
                    Own The <br/> <span className="font-light not-italic opacity-20 text-black">Ritual.</span>
                 </h2>
                 <p className="text-2xl text-black/40 font-light mb-20 leading-relaxed italic max-w-2xl mx-auto">
                    Limited batch releases. Roasted every Tuesday, delivered to your door by Friday. Experience the absolute rhythm of the bean.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                    <button className="px-20 py-10 bg-black text-white font-bold uppercase text-[10px] tracking-[0.3em] hover:px-24 transition-all duration-700 italic shadow-2xl">
                       Join Subscription
                    </button>
                    <button className="px-20 py-10 border-4 border-black text-black font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-700 italic">
                       View Equipment
                    </button>
                 </div>
              </Reveal>
           </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-black pt-40 pb-12 px-6 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
           <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-4 mb-10 group">
                <div className="w-10 h-10 border border-[#d4af37]/30 flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-[#d4af37]" />
                </div>
                <span className="text-xl font-light tracking-[0.4em] uppercase text-white">Nero Coffee</span>
              </Link>
              <p className="text-white/20 max-w-sm leading-relaxed mb-12 text-sm font-light italic">
                 "In the darkness of the roast, we find the absolute clarity of the morning. Sourced globally, roasted in Berlin."
              </p>
              <div className="flex gap-10">
                 {["Instagram", "Journal", "Roastery", "Contact"].map(s => (
                   <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-[#d4af37] transition-colors italic">{s}</Link>
                 ))}
              </div>
           </div>
           
           {[
             { t: "THE ROAST", l: ["Single Origins", "House Blends", "Dark Series", "Decaf Alpha"] },
             { t: "ATELIER", l: ["Our Roastery", "Direct Trade", "Sustainability", "Journal"] },
             { t: "RITUAL", l: ["Brew Guides", "Subscription", "Wholesale", "Legal"] }
           ].map((col, i) => (
             <div key={i} className="space-y-12">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/20">{col.t}</h4>
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
        <div className="max-w-[1400px] mx-auto flex flex-col md:row justify-between items-center gap-8 border-t border-white/5 pt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/10 italic">
           <span>© 2026 NERO COFFEE ROASTERS BERLIN. BORN IN THE DARK.</span>
           <div className="flex gap-12">
              <Link href="#" className="hover:text-white transition-all underline decoration-[#d4af37]/20">BERLIN</Link>
              <Link href="#" className="hover:text-white transition-all underline decoration-[#d4af37]/20">LONDON</Link>
              <Link href="#" className="hover:text-white transition-all underline decoration-[#d4af37]/20">TOKYO</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}
