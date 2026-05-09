"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, ArrowRight, Menu, Star, Shield, Key, Home, Building2, Map, ChevronRight, Maximize2, MoveRight } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function Reveal({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"])
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden rounded-sm">
      <motion.div style={{ y }} className="absolute inset-[-15%] w-[130%] h-[130%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

const PROPERTIES = [
  { name: "The Obsidian Penthouse", loc: "New York, NY", price: "$24,500,000", img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200" },
  { name: "Azure Cliff Villa", loc: "Santorini, GR", price: "$12,800,000", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200" },
  { name: "Veridian Estate", loc: "Kyoto, JP", price: "$18,200,000", img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200" },
]

export default function ArcaneRealtyPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#0a0a0a] text-white font-sans min-h-screen selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${scrolled ? "bg-black/90 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 border border-white/20 flex items-center justify-center group-hover:border-white transition-all duration-700">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-[0.2em] uppercase">Arcane <span className="font-light text-white/40">Realty</span></span>
          </Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">
            {["Portfolio", "Concierge", "Locations", "Journal"].map(l => (
              <Link key={l} href="#" className="hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">Seller Portal</button>
            <button className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm hover:bg-transparent hover:text-white hover:border-white border border-transparent transition-all duration-700">Request Tour</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden p-2"><Menu className="w-6 h-6 text-white" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-black border-white/5 p-12 text-white">
                <div className="flex flex-col gap-10 mt-16 text-left">
                  {["Collection", "Concierge", "About", "Contact"].map(l => (
                    <Link key={l} href="#" className="text-3xl font-light uppercase tracking-widest hover:text-white transition-all">{l}</Link>
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
             <Image src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2400" alt="Luxury Property" fill className="object-cover opacity-50 scale-105" priority />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
             <div className="absolute inset-0 bg-black/30" />
          </div>

          <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
            <Reveal>
              <div className="flex items-center justify-center gap-4 mb-10">
                 <div className="w-12 h-[1px] bg-white/30" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/60">The Apex of Private Living</span>
                 <div className="w-12 h-[1px] bg-white/30" />
              </div>
            </Reveal>
            <Reveal delay={0.2} y={70}>
              <h1 className="text-7xl md:text-[10rem] font-light tracking-tighter leading-[0.8] text-white mb-12 uppercase">
                Rare <br/> <span className="font-bold italic">Holdings.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-col items-center justify-center gap-12">
                <p className="text-xl text-white/40 font-light max-w-xl leading-relaxed italic">
                  Securing the world's most exclusive architectural masterpieces for the most discerning collectors.
                </p>
                <div className="flex flex-wrap justify-center gap-8">
                  <button className="px-12 py-5 bg-white text-black font-bold uppercase tracking-widest text-[10px] hover:bg-transparent hover:text-white border border-white transition-all duration-700">
                    Explore Collection
                  </button>
                  <button className="px-12 py-5 border border-white/20 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all flex items-center gap-3">
                    <Map className="w-3 h-3" /> Digital Roadmap
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
          
          <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
            <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/20 flex items-center gap-3"><MapPin className="w-3 h-3" /> GLOBAL ASSETS: 242</div>
            <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">ESTABLISHED 1992</div>
          </div>
        </section>

        {/* ── PORTFOLIO ─────────────── */}
        <section className="py-40 bg-[#0a0a0a]">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex flex-col lg:flex-row items-end justify-between mb-32 gap-8 border-b border-white/5 pb-12">
                <div className="max-w-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 block mb-4">Active Listings</span>
                  <h2 className="text-6xl md:text-8xl font-light uppercase tracking-tighter text-white leading-none">Curated <span className="italic font-bold">Space.</span></h2>
                </div>
                <Link href="#" className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest hover:text-white text-white/40 transition-colors group italic">
                  Private Inventory <MoveRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {PROPERTIES.map((p, i) => (
                <Reveal key={i} delay={i * 0.15}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[4/5] mb-10 overflow-hidden bg-white/[0.02]">
                      <ParallaxImg src={p.img} alt={p.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                      <div className="absolute top-8 left-8 flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                         <span className="text-[8px] font-bold uppercase tracking-widest text-white/60">Available</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-start">
                       <div>
                          <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2 italic flex items-center gap-2"><MapPin className="w-3 h-3" /> {p.loc}</div>
                          <h3 className="text-3xl font-bold uppercase tracking-widest text-white">{p.name}</h3>
                       </div>
                       <div className="text-xl font-light tracking-tighter text-white/60">{p.price}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONCIERGE ─────────────── */}
        <section className="py-40 relative bg-black overflow-hidden border-y border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
               <div>
                  <Reveal>
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 block mb-8">The Experience</span>
                    <h2 className="text-5xl md:text-8xl font-light uppercase tracking-tighter text-white italic mb-12">White <br/> <span className="not-italic font-bold">Glove.</span></h2>
                    <div className="space-y-12">
                       {[
                         { icon: Shield, t: "Strict Confidentiality", d: "Non-disclosure agreements at the first point of contact. Your privacy is our highest priority." },
                         { icon: Key, t: "Turnkey Transitions", d: "Full concierge service including international logistics, legal filing, and asset management." },
                         { icon: Star, t: "Private Previews", d: "Exclusive first-access to off-market holdings before global public release." }
                       ].map((f, i) => (
                         <div key={i} className="flex gap-8 group">
                            <div className="w-16 h-16 shrink-0 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-700">
                               <f.icon className="w-5 h-5 text-white/40 group-hover:text-black transition-colors" />
                            </div>
                            <div>
                               <h4 className="text-xl font-bold uppercase tracking-widest mb-2 italic">{f.t}</h4>
                               <p className="text-sm text-white/30 leading-relaxed font-light">{f.d}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                  </Reveal>
               </div>
               <Reveal delay={0.2}>
                  <div className="relative aspect-square grayscale hover:grayscale-0 transition-all duration-1000 p-2 bg-white/[0.02]">
                     <ParallaxImg src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200" alt="Estate Interior" />
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-white/10 rotate-45" />
                  </div>
               </Reveal>
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-40 bg-white text-black text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <Reveal>
              <h2 className="text-6xl md:text-[10rem] font-light uppercase tracking-tighter leading-[0.8] mb-12">
                Begin The <br/> <span className="font-bold italic">Acquisition.</span>
              </h2>
              <p className="text-xl text-black/60 font-light mb-16 leading-relaxed italic">
                Our advisors are ready to discuss your specific requirements. We don't find houses; we secure legacies.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <button className="px-16 py-6 bg-black text-white font-bold uppercase tracking-widest text-[10px] hover:px-20 transition-all duration-700 italic">
                   Request Private Audit
                </button>
                <button className="px-16 py-6 border-2 border-black text-black font-bold uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all duration-700 italic">
                   View Portfolio
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#050505] pt-32 pb-12 px-6 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-16 mb-32">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-[0.2em] uppercase text-white">Arcane <span className="font-light text-white/40">Realty</span></span>
            </Link>
            <p className="text-white/20 max-w-sm leading-relaxed mb-10 text-sm font-light italic">
              "We architecturalize wealth through the acquisition of the world's most rare holdings."
            </p>
            <div className="flex gap-10">
               {["Camera", "Journal", "Technical Paper", "Contact"].map(s => (
                 <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">{s}</Link>
               ))}
            </div>
          </div>
          
          {[
            { t: "Holdings", l: ["Residential", "Commercial", "Private Islands", "Archive"] },
            { t: "Services", l: ["Acquisition", "Management", "Concierge", "Tax Strategy"] },
            { t: "Company", l: ["Our Legacy", "Advisors", "Contact", "Journal"] },
          ].map((col, i) => (
            <div key={i} className="space-y-10">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">{col.t}</h4>
              <ul className="space-y-6">
                {col.l.map(link => <li key={link} className="text-xs text-white/30 hover:text-white transition-colors italic font-light"><Link href="#">{link}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-[1400px] mx-auto pt-12 border-t border-white/5 flex flex-col md:row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-white/10">
          <span>© 2026 ARCANE REALTY GLOBAL HOLDINGS. BUILT FOR THE INFINITE.</span>
          <div className="flex gap-12 italic">
             <Link href="#" className="hover:text-white transition-colors">Privacy Circle</Link>
             <Link href="#" className="hover:text-white transition-colors">Listing Verification</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
