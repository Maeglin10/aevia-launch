"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Layout, ArrowRight, Menu, Star, Shield, Maximize2, Compass, Home, Map, ChevronRight, PenTool, Layers } from "lucide-react"
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
    <div ref={ref} className="relative w-full h-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
      <motion.div style={{ y }} className="absolute inset-[-15%] w-[130%] h-[130%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

const PROJECTS = [
  { name: "The Obsidian Villa", loc: "Malibu, CA", img: "https://images.unsplash.com/photo-1600585154340-be6199f7d009?auto=format&fit=crop&q=80&w=1200" },
  { name: "Glass Monolith", loc: "Berlin, DE", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200" },
  { name: "Serene Heights", loc: "Kyoto, JP", img: "https://images.unsplash.com/photo-1503387762-592cd5804557?auto=format&fit=crop&q=80&w=1200" },
]

export default function SymmetryStudioPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#fcfcfc] text-[#1a1a1a] font-sans min-h-screen selection:bg-[#1a1a1a] selection:text-white overflow-x-hidden">
      
      {/* ── GRID SYSTEM ───────────── */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" 
           style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '100px 100px' }} />

      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${scrolled ? "bg-white/80 backdrop-blur-xl border-b border-black/5 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 border border-black/10 flex items-center justify-center group-hover:bg-black transition-all duration-700">
              <Maximize2 className="w-5 h-5 group-hover:text-white transition-colors" />
            </div>
            <span className="text-xl font-light tracking-[0.4em] uppercase">Symmetry <span className="font-bold">Studio</span></span>
          </Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.5em] text-black/20">
            {["Identity", "Works", "Materials", "Contact"].map(l => (
              <Link key={l} href="#" className="hover:text-black transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-black/20 hover:text-black transition-colors underline underline-offset-8 decoration-black/10">The Journal</button>
            <button className="px-10 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-transparent hover:text-black border border-transparent hover:border-black transition-all duration-700 shadow-xl shadow-black/5">Initiate Project</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden p-2"><Menu className="w-6 h-6 text-black" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#fcfcfc] border-none p-12 text-black">
                <div className="flex flex-col gap-10 mt-16 text-left font-light uppercase tracking-widest">
                  {["Vision", "Portals", "Spaces", "Book"].map(l => (
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
        <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative z-10">
              <Reveal>
                <div className="flex items-center gap-8 mb-12 opacity-20">
                   <div className="w-16 h-[1px] bg-black" />
                   <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-black italic">Form Follows Light</span>
                </div>
              </Reveal>
              <Reveal delay={0.2} y={70}>
                <h1 className="text-7xl md:text-[10rem] font-light tracking-tighter leading-[0.8] text-[#1a1a1a] mb-16 uppercase">
                  Pure <br/> <span className="font-bold italic opacity-10">Volume.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.4}>
                <div className="flex flex-col gap-16">
                  <p className="text-2xl text-black/40 font-light max-w-lg leading-relaxed italic">
                    Architectural interventions that harmonize human ritual with the absolute geometry of nature.
                  </p>
                  <div className="flex flex-wrap gap-12">
                    <button className="px-16 py-6 bg-black text-white font-bold uppercase tracking-widest text-[10px] hover:px-20 transition-all duration-700 shadow-2xl">
                      Examine Portals
                    </button>
                    <button className="px-16 py-6 border border-black/10 text-black/30 font-bold uppercase tracking-widest text-[10px] hover:text-black transition-all flex items-center gap-4">
                      <Compass className="w-4 h-4" /> View Map Of Silence
                    </button>
                  </div>
                </div>
              </Reveal>
            </div>
            
            <Reveal delay={0.5} y={0}>
               <div className="relative aspect-[4/5] bg-black/5 overflow-hidden group">
                  <ParallaxImg src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200" alt="Architectural Minimal" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-1000" />
               </div>
            </Reveal>
          </div>
          
          <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end text-[9px] font-bold uppercase tracking-[0.4em] text-black/10 italic">
            <span>STRUCTURE / LIGHT / MATERIALITY / VOID</span>
            <span>EST. 2012</span>
          </div>
        </section>

        {/* ── PILLARS ───────────────── */}
        <section className="py-40 bg-white">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-32">
             {[
               { icon: Layers, t: "Material Integrity", d: "A relentless focus on the raw textures of concrete, glass, and steel." },
               { icon: Compass, t: "Axial Logic", d: "Defining spaces through rigid geometric paths and visual alignments." },
               { icon: Home, t: "Human Sanctuary", d: "Designing environments that provide absolute mental and physical clarity." }
             ].map((p, i) => (
               <Reveal key={i} delay={i * 0.1}>
                  <div className="group cursor-pointer">
                     <div className="w-16 h-16 border border-black/5 flex items-center justify-center mb-10 group-hover:bg-black group-hover:text-white transition-all duration-700">
                        <p.icon className="w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity" />
                     </div>
                     <h3 className="text-2xl font-bold mb-6 uppercase tracking-tighter italic">{p.t}</h3>
                     <p className="text-black/30 leading-relaxed font-light text-sm italic">{p.d}</p>
                  </div>
               </Reveal>
             ))}
          </div>
        </section>

        {/* ── WORKS ─────────────────── */}
        <section className="py-60 bg-[#fcfcfc] border-y border-black/5">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <Reveal>
                 <div className="flex flex-col lg:flex-row items-end justify-between mb-32 gap-8 pb-16 border-b border-black/5">
                    <div className="max-w-2xl">
                       <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/30 block mb-6">Archive of Form</span>
                       <h2 className="text-6xl md:text-[9vw] font-light uppercase tracking-tighter text-[#1a1a1a] leading-none italic">Silent <br/> <span className="not-italic font-bold opacity-10 italic">Spaces.</span></h2>
                    </div>
                    <Link href="#" className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest hover:text-black text-black/30 transition-colors group italic">
                       View Complete Works <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </Link>
                 </div>
              </Reveal>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                 {PROJECTS.map((item, i) => (
                   <Reveal key={i} delay={i * 0.15}>
                      <div className="group cursor-pointer">
                         <div className="aspect-video relative mb-12 overflow-hidden border border-black/5 p-1 bg-white shadow-xl shadow-black/[0.02]">
                            <ParallaxImg src={item.img} alt={item.name} />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all duration-1000" />
                         </div>
                         <div className="flex justify-between items-start">
                            <div>
                               <div className="text-[9px] font-bold uppercase tracking-widest text-black/20 mb-2 italic">Location: {item.loc}</div>
                               <h3 className="text-3xl font-bold uppercase tracking-tighter text-black italic group-hover:translate-x-2 transition-transform duration-700">{item.name}</h3>
                            </div>
                            <div className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-700">
                               <ChevronRight className="w-5 h-5" />
                            </div>
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
                 <div className="w-20 h-20 mx-auto mb-20 border-4 border-black flex items-center justify-center font-black text-3xl">S</div>
                 <h2 className="text-8xl md:text-[15vw] font-light uppercase tracking-tighter leading-[0.8] mb-16 italic">
                    Build The <br/> <span className="not-italic font-bold opacity-10 italic">Absolute.</span>
                 </h2>
                 <p className="text-2xl text-black/40 font-light mb-20 leading-relaxed italic max-w-2xl mx-auto">
                    We accept a limited number of commissions each cycle to ensure the structural integrity and conceptual purity of every space.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                    <button className="px-20 py-8 bg-black text-white font-bold uppercase tracking-[0.3em] text-[10px] hover:px-24 transition-all duration-700 italic shadow-2xl">
                       Initiate Consultation
                    </button>
                    <button className="px-20 py-8 border border-black/10 text-black/30 font-bold uppercase tracking-[0.3em] text-[10px] hover:text-black transition-all italic">
                       The Design Process
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
                  <Maximize2 className="w-5 h-5" />
                </div>
                <span className="text-xl font-light tracking-[0.4em] uppercase text-black">Symmetry Studio</span>
              </Link>
              <p className="text-black/20 max-w-sm leading-relaxed mb-12 text-sm font-light italic">
                 "Architecture is the learned game, correct and magnificent, of forms assembled in light."
              </p>
              <div className="flex gap-10">
                 {["Instagram", "Vimeo", "ArchDaily", "Journal"].map(s => (
                   <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-black/20 hover:text-black transition-colors italic">{s}</Link>
                 ))}
              </div>
           </div>
           
           {[
             { t: "EXPERTISE", l: ["Residential", "Commercial", "Interiors", "Landscape"] },
             { t: "IDENTITY", l: ["The Vision", "Works", "Philosophy", "Careers"] },
             { t: "ENTITY", l: ["Legal", "Privacy", "SLA", "Contact"] }
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
           <span>© 2026 SYMMETRY STUDIO ARCHITECTURE AG. PURE VOLUME.</span>
           <div className="flex gap-12">
              <Link href="#" className="hover:text-black transition-all">BASEL</Link>
              <Link href="#" className="hover:text-black transition-all">BERLIN</Link>
              <Link href="#" className="hover:text-black transition-all">TOKYO</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}
