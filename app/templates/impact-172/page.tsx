"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Sparkles, ArrowRight, Menu, Star, Shield, Maximize2, Compass, Layers, ChevronRight, Play, ShoppingBag, Eye, Hexagon } from "lucide-react"
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
    <div ref={ref} className="relative w-full h-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-[-15%] w-[130%] h-[130%]">
        <Image src={src} alt={alt} fill className="object-cover transition-all duration-1000 grayscale hover:grayscale-0" />
      </motion.div>
    </div>
  )
}

const DROPS = [
  { name: "The Void Series", artist: "Aetheris", price: "12.4 ETH", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200" },
  { name: "Liquid Logic", artist: "Vertex", price: "8.2 ETH", img: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=1200" },
  { name: "Organic Static", artist: "Nero", price: "15.0 ETH", img: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=1200" },
]

export default function ElysiumGalleryPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#ffffff] text-[#1a1a1a] font-sans min-h-screen selection:bg-black selection:text-white overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${scrolled ? "bg-white/80 backdrop-blur-xl border-b border-black/5 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 border border-black/10 flex items-center justify-center group-hover:bg-black transition-all duration-700">
              <Hexagon className="w-5 h-5 group-hover:text-white transition-colors" />
            </div>
            <span className="text-xl font-light tracking-[0.4em] uppercase">Elysium <span className="font-bold">Gallery</span></span>
          </Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.5em] text-black/20">
            {["Exhibitions", "Curators", "Genesis", "Journal"].map(l => (
              <Link key={l} href="#" className="hover:text-black transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-black/20 hover:text-black transition-colors underline underline-offset-8 decoration-black/5">Artist Portal</button>
            <button className="px-10 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-transparent hover:text-black border border-transparent hover:border-black/20 transition-all duration-700">Explore Drops</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden p-2"><Menu className="w-6 h-6 text-black" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-white border-none p-12 text-black font-sans">
                <div className="flex flex-col gap-10 mt-16 text-left font-light uppercase tracking-widest">
                  {["Art", "Digital", "Market", "Contact"].map(l => (
                    <Link key={l} href="#" className="text-4xl hover:italic transition-all">{l}</Link>
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
             <Image src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2400" alt="Abstract Digital Art" fill className="object-cover opacity-5 scale-105" priority />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white" />
          </div>

          <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
            <Reveal>
              <div className="flex items-center justify-center gap-8 mb-16 opacity-20">
                 <div className="w-16 h-[1px] bg-black" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-black">Art as an Immutable Asset</span>
                 <div className="w-16 h-[1px] bg-black" />
              </div>
            </Reveal>
            <Reveal delay={0.2} y={70}>
              <h1 className="text-7xl md:text-[14vw] font-light tracking-tighter leading-[0.8] text-[#1a1a1a] mb-16 uppercase italic">
                Digital <br/> <span className="font-bold not-italic">Sublime.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-col items-center justify-center gap-16">
                <p className="text-2xl text-black/40 font-light max-w-2xl leading-relaxed italic">
                  Curating the world's most significant digital artifacts. A high-fidelity gateway to the future of artistic sovereignty.
                </p>
                <div className="flex flex-wrap justify-center gap-12">
                  <button className="px-16 py-6 bg-black text-white font-bold uppercase tracking-widest text-[10px] hover:px-20 transition-all duration-700 shadow-2xl">
                    Discover Exhibits
                  </button>
                  <button className="px-16 py-6 border border-black/10 text-black/30 font-bold uppercase tracking-widest text-[10px] hover:text-black transition-all flex items-center gap-4">
                    <Maximize2 className="w-4 h-4" /> Virtual Sanctuary
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
          
          <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end text-[9px] font-bold uppercase tracking-[0.4em] text-black/10 italic">
            <span>GENESIS / REBIRTH / EVOLUTION / VOID</span>
            <div className="flex gap-6 items-center">
               <Layers className="w-4 h-4" />
               <span>CURATED SINCE 2021</span>
            </div>
          </div>
        </section>

        {/* ── MANIFESTO ─────────────── */}
        <section className="py-40 bg-white relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-32">
             {[
               { icon: Shield, t: "Sovereign Proof", d: "Absolute provenance secured through high-fidelity blockchain integration." },
               { icon: Eye, t: "Curated Vision", d: "A relentless focus on digital artifacts that define the contemporary sublime." },
               { icon: Compass, t: "Global Network", d: "Connecting elite collectors with the world's most guarded digital assets." }
             ].map((p, i) => (
               <Reveal key={i} delay={i * 0.1}>
                  <div className="group cursor-pointer">
                     <div className="w-16 h-16 border border-black/5 flex items-center justify-center mb-10 group-hover:bg-black group-hover:text-white transition-all duration-700">
                        <p.icon className="w-6 h-6 opacity-20 group-hover:opacity-100 transition-opacity" />
                     </div>
                     <h3 className="text-2xl font-bold mb-6 uppercase tracking-tighter italic text-[#1a1a1a]">{p.t}</h3>
                     <p className="text-black/30 leading-relaxed font-light text-sm italic">{p.d}</p>
                  </div>
               </Reveal>
             ))}
          </div>
        </section>

        {/* ── EXHIBITIONS ────────────── */}
        <section className="py-60 bg-[#fcfcfc] border-y border-black/5">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <Reveal>
                 <div className="flex flex-col lg:flex-row items-end justify-between mb-32 gap-8 border-b border-black/5 pb-16">
                    <div className="max-w-2xl text-left">
                       <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/30 block mb-6 italic">Current Exhibitions</span>
                       <h2 className="text-6xl md:text-[9vw] font-light uppercase tracking-tighter text-[#1a1a1a] leading-none italic">The <span className="not-italic font-bold opacity-10">Static.</span></h2>
                    </div>
                    <Link href="#" className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest hover:text-black text-black/30 transition-colors group italic">
                       View Complete Archive <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </Link>
                 </div>
              </Reveal>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                 {DROPS.map((item, i) => (
                   <Reveal key={i} delay={i * 0.15}>
                      <div className="group cursor-pointer">
                         <div className="aspect-[3/4] relative mb-12 overflow-hidden border border-black/5 p-1 bg-white shadow-xl shadow-black/[0.02]">
                            <ParallaxImg src={item.img} alt={item.name} />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-1000" />
                            <div className="absolute top-10 right-10">
                               <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center border border-black/5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 shadow-sm">
                                  <ShoppingBag className="w-5 h-5 text-black" />
                               </div>
                            </div>
                            <div className="absolute bottom-12 left-12 right-12">
                               <div className="text-[10px] font-bold uppercase tracking-widest text-black/30 mb-2 italic">Artist: {item.artist}</div>
                               <h3 className="text-4xl font-bold uppercase tracking-widest text-white italic group-hover:translate-x-2 transition-transform duration-700">{item.name}</h3>
                            </div>
                         </div>
                         <div className="flex justify-between items-center px-6">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-black/20 italic">Curated Genesis Drop</span>
                            <span className="text-2xl font-bold text-[#1a1a1a] tracking-tighter italic">{item.price}</span>
                         </div>
                      </div>
                   </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-60 bg-white text-[#1a1a1a] text-center relative overflow-hidden">
           <div className="max-w-4xl mx-auto px-6 relative z-10">
              <Reveal>
                 <div className="w-20 h-20 mx-auto mb-20 border-4 border-black flex items-center justify-center font-black text-3xl italic">E</div>
                 <h2 className="text-8xl md:text-[14vw] font-light uppercase tracking-tighter leading-[0.8] mb-16 italic">
                    Claim The <br/> <span className="not-italic font-bold opacity-10 italic">Eternal.</span>
                 </h2>
                 <p className="text-2xl text-black/40 font-light mb-20 leading-relaxed italic max-w-2xl mx-auto">
                    We accept a limited number of genesis commissions for high-tier digital artifacts. Master your legacy in the machine.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                    <button className="px-20 py-8 bg-black text-white font-bold uppercase tracking-[0.3em] text-[10px] hover:px-24 transition-all duration-700 italic shadow-2xl">
                       Apply For Exhibit
                    </button>
                    <button className="px-20 py-8 border border-black/10 text-black/30 font-bold uppercase tracking-[0.3em] text-[10px] hover:text-black transition-all italic">
                       View Market Reports
                    </button>
                 </div>
              </Reveal>
           </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#fcfcfc] pt-40 pb-12 px-6 border-t border-black/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
           <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-4 mb-10 group">
                <div className="w-10 h-10 border border-black/10 flex items-center justify-center">
                  <Hexagon className="w-5 h-5" />
                </div>
                <span className="text-xl font-light tracking-[0.4em] uppercase text-black">Elysium Gallery</span>
              </Link>
              <p className="text-black/20 max-w-sm leading-relaxed mb-12 text-sm font-light italic">
                 "Digital art is the final frontier of absolute sovereignty. We are the architects of the sublime. Curated since 2021."
              </p>
              <div className="flex gap-10">
                 {["Twitter", "Vimeo", "Mirror", "Lens"].map(s => (
                   <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-black/20 hover:text-black transition-colors italic">{s}</Link>
                 ))}
              </div>
           </div>
           
           {[
             { t: "EXHIBITS", l: ["The Genesis", "Modern Echo", "Void Collection", "Neural Art"] },
             { t: "CURATION", l: ["Artist Portals", "Drop Calendar", "Genesis Hub", "Journal"] },
             { t: "ENTITY", l: ["Privacy Shield", "SLA Reports", "Blockchain Hub", "Contact"] }
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
           <span>© 2026 ELYSIUM DIGITAL ASSETS SA. THE ART IS ETERNAL.</span>
           <div className="flex gap-12">
              <Link href="#" className="hover:text-black transition-all underline decoration-black/10">BLOCKCHAIN_SECURED</Link>
              <Link href="#" className="hover:text-black transition-all underline decoration-black/10">OMEGA_ENABLED</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}
