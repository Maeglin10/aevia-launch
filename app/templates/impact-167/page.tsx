"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Sparkles, ArrowRight, Menu, Star, Flower2, Droplets, Heart, Wind, ChevronRight, Play, ShoppingBag } from "lucide-react"
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
    <div ref={ref} className="relative w-full h-full overflow-hidden rounded-[4rem]">
      <motion.div style={{ y }} className="absolute inset-[-15%] w-[130%] h-[130%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

const PRODUCTS = [
  { name: "Radiance Serum", note: "Hyaluronic Acid // Vitamin C", price: "€120", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1200" },
  { name: "Velvet Night Cream", note: "Retinol // Rose Extract", price: "€145", img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1200" },
  { name: "Silk Cleanser", note: "Bamboo Charcoal // Aloe", price: "€85", img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=1200" },
]

export default function VelvetBeautyPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#fcf8f7] text-[#4a4542] font-sans min-h-screen selection:bg-[#f2e1df] selection:text-[#4a4542] overflow-x-hidden">
      
      {/* ── SOFT GLOWS ───────────── */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#f2e1df]/30 blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#f2e1df]/30 blur-[150px] pointer-events-none z-0" />

      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${scrolled ? "bg-white/70 backdrop-blur-2xl border-b border-[#f2e1df]/40 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-full border border-[#f2e1df] flex items-center justify-center group-hover:bg-[#f2e1df] transition-all duration-700">
              <Flower2 className="w-5 h-5 text-[#d4af37]" />
            </div>
            <span className="text-xl font-light tracking-[0.4em] uppercase">Velvet <span className="font-bold">Beauty</span></span>
          </Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.5em] text-[#4a4542]/30">
            {["The Ritual", "Collections", "Philosophy", "Shop"].map(l => (
              <Link key={l} href="#" className="hover:text-[#d4af37] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-[#4a4542]/30 hover:text-[#4a4542] transition-colors underline underline-offset-8 decoration-[#f2e1df]">Member Club</button>
            <button className="px-10 py-4 bg-[#4a4542] text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-white hover:text-[#4a4542] border border-transparent hover:border-[#f2e1df] transition-all duration-700 shadow-lg">Shop Now</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden p-2"><Menu className="w-6 h-6 text-[#4a4542]" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#fcf8f7] border-none p-12 text-[#4a4542]">
                <div className="flex flex-col gap-10 mt-16 text-left">
                  {["Routine", "Botanicals", "Alchemy", "Apply"].map(l => (
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
             <Image src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=2400" alt="Skincare Texture" fill className="object-cover opacity-10 scale-105" priority />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#fcf8f7]/20 to-[#fcf8f7]" />
          </div>

          <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
            <Reveal>
              <div className="flex items-center justify-center gap-8 mb-16 opacity-30">
                 <div className="w-16 h-[1px] bg-[#d4af37]" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-[#4a4542]">Skin Architecture & Biology</span>
                 <div className="w-16 h-[1px] bg-[#d4af37]" />
              </div>
            </Reveal>
            <Reveal delay={0.2} y={70}>
              <h1 className="text-7xl md:text-[12rem] font-light tracking-tighter leading-[0.8] text-[#4a4542] mb-16 uppercase italic" style={{ fontFamily: "serif" }}>
                Pure <br/> <span className="font-bold not-italic">Lustre.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-col items-center justify-center gap-16">
                <p className="text-2xl text-[#4a4542]/40 font-light max-w-2xl leading-relaxed italic">
                  Cultivating a high-fidelity relationship between your skin and nature. Mastered through biological integrity.
                </p>
                <div className="flex flex-wrap justify-center gap-12">
                  <button className="px-16 py-6 bg-[#4a4542] text-white font-bold uppercase tracking-widest text-[10px] rounded-full hover:px-20 transition-all duration-700 shadow-xl shadow-[#4a4542]/10">
                    Explore The Ritual
                  </button>
                  <button className="px-16 py-6 border border-[#4a4542]/10 text-[#4a4542]/40 font-bold uppercase tracking-widest text-[10px] hover:text-[#4a4542] transition-all flex items-center gap-4 rounded-full">
                    <Droplets className="w-4 h-4 text-[#d4af37]" /> The Alchemy
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
          
          <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end text-[9px] font-bold uppercase tracking-[0.4em] text-[#4a4542]/20 italic">
            <span>PARIS / GRASSE / SEOUL / MILAN</span>
            <div className="flex gap-6">
               <Sparkles className="w-4 h-4" />
               <span>DERMATOLOGIST TESTED</span>
            </div>
          </div>
        </section>

        {/* ── PILLARS ───────────────── */}
        <section className="py-40 bg-white relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-24 text-center">
             {[
               { icon: Droplets, t: "Molecular Integrity", d: "Formulations designed at a cellular level for absolute absorption." },
               { icon: Flower2, t: "Botanical Alpha", d: "High-concentration extracts sourced from the world's most resilient flora." },
               { icon: Heart, t: "Biological Harmony", d: "pH-balanced rituals that respect your skin's natural architecture." }
             ].map((p, i) => (
               <Reveal key={i} delay={i * 0.1}>
                  <div className="group cursor-pointer">
                     <div className="w-20 h-20 mx-auto rounded-full bg-[#fcf8f7] border border-[#f2e1df] flex items-center justify-center mb-10 group-hover:bg-[#f2e1df] transition-all duration-700">
                        <p.icon className="w-6 h-6 text-[#d4af37] opacity-40 group-hover:opacity-100 transition-opacity" />
                     </div>
                     <h3 className="text-2xl font-bold mb-6 uppercase tracking-tighter italic text-[#4a4542]">{p.t}</h3>
                     <p className="text-[#4a4542]/30 leading-relaxed font-light text-sm italic px-6">{p.d}</p>
                  </div>
               </Reveal>
             ))}
          </div>
        </section>

        {/* ── COLLECTION ─────────────── */}
        <section className="py-60 bg-[#fcf8f7] border-y border-[#f2e1df]/40">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <Reveal>
                 <div className="flex flex-col md:flex-row items-end justify-between mb-32 gap-8 border-b border-[#f2e1df] pb-16">
                    <div className="max-w-2xl">
                       <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#d4af37] block mb-6">Seasonal Curation</span>
                       <h2 className="text-7xl md:text-[9vw] font-black uppercase tracking-tighter text-[#4a4542] leading-none italic" style={{ fontFamily: "serif" }}>The <span className="font-light not-italic opacity-10 text-[#4a4542]">Registry.</span></h2>
                    </div>
                    <Link href="#" className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest hover:text-[#d4af37] text-[#4a4542]/30 transition-colors group italic">
                       View All Products <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </Link>
                 </div>
              </Reveal>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                 {PRODUCTS.map((item, i) => (
                   <Reveal key={i} delay={i * 0.15}>
                      <div className="group cursor-pointer">
                         <div className="aspect-[3/4] relative mb-12 overflow-hidden rounded-[4rem] border border-[#f2e1df] p-10 bg-white">
                            <Image src={item.img} alt={item.name} fill className="object-cover scale-110 group-hover:scale-100 transition-all duration-[3000ms]" />
                            <div className="absolute inset-0 bg-[#4a4542]/5 group-hover:bg-transparent transition-all duration-1000" />
                            <div className="absolute top-10 right-10">
                               <div className="w-12 h-12 rounded-full bg-[#fcf8f7]/80 backdrop-blur-md flex items-center justify-center border border-[#f2e1df] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                  <ShoppingBag className="w-5 h-5 text-[#4a4542]" />
                               </div>
                            </div>
                            <div className="absolute bottom-12 left-12 right-12">
                               <div className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] mb-3 italic">Advanced Series</div>
                               <h3 className="text-4xl font-bold uppercase tracking-widest text-[#4a4542] leading-tight mb-2" style={{ fontFamily: "serif" }}>{item.name}</h3>
                               <p className="text-[10px] font-bold text-[#4a4542]/30 tracking-widest uppercase italic">{item.note}</p>
                            </div>
                         </div>
                         <div className="flex justify-between items-center px-6">
                            <button className="text-[10px] font-bold uppercase tracking-widest text-[#4a4542]/30 hover:text-[#4a4542] transition-colors underline underline-offset-4">Add to Ritual</button>
                            <span className="text-2xl font-bold text-[#4a4542] tracking-tighter italic">{item.price}</span>
                         </div>
                      </div>
                   </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-60 bg-[#4a4542] text-white text-center px-6 relative overflow-hidden">
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none flex items-center justify-center">
              <Sparkles className="w-[800px] h-[800px]" />
           </div>
           <div className="max-w-4xl mx-auto relative z-10">
              <Reveal>
                 <div className="w-16 h-16 border border-[#f2e1df]/40 rounded-full mx-auto mb-20 flex items-center justify-center text-[#f2e1df] italic font-bold">V</div>
                 <h2 className="text-8xl md:text-[14vw] font-light uppercase tracking-tighter leading-[0.8] mb-16 italic" style={{ fontFamily: "serif" }}>
                    Hold The <br/> <span className="font-bold not-italic opacity-10 text-white">Ethereal.</span>
                 </h2>
                 <p className="text-2xl text-white/40 font-light mb-20 leading-relaxed italic max-w-2xl mx-auto">
                    Limited production runs for our signature elixirs. Crafted in our Grasse laboratories, delivered to your sanctuary.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                    <button className="px-20 py-10 bg-white text-[#4a4542] font-bold uppercase text-[10px] tracking-[0.3em] rounded-full hover:px-24 transition-all duration-700 italic shadow-2xl">
                       Join The Club
                    </button>
                    <button className="px-20 py-10 border border-white/10 text-white/40 font-bold uppercase text-[10px] tracking-[0.3em] rounded-full hover:bg-white/5 transition-all duration-700 italic">
                       View Samples
                    </button>
                 </div>
              </Reveal>
           </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#fcf8f7] pt-40 pb-12 px-6 border-t border-[#f2e1df]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
           <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-4 mb-10 group">
                <div className="w-10 h-10 rounded-full border border-[#f2e1df] flex items-center justify-center">
                  <Flower2 className="w-5 h-5 text-[#d4af37]" />
                </div>
                <span className="text-xl font-light tracking-[0.4em] uppercase text-[#4a4542]">Velvet Beauty</span>
              </Link>
              <p className="text-[#4a4542]/30 max-w-sm leading-relaxed mb-12 text-sm font-light italic" style={{ fontFamily: "serif" }}>
                 "Beauty is not an aesthetic. It is a biological state of harmony. Cultivated in Paris since 1994."
              </p>
              <div className="flex gap-10">
                 {["Instagram", "Vogue", "Journal", "Atelier"].map(s => (
                   <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-[#4a4542]/30 hover:text-[#d4af37] transition-colors italic">{s}</Link>
                 ))}
              </div>
           </div>
           
           {[
             { t: "COLLECTIONS", l: ["Radiance Series", "Night Ritual", "Pure Cleansers", "Sun Alpha"] },
             { t: "MAISON", l: ["Our Lab", "Heritage", "Botanicals", "Journal"] },
             { t: "SERVICE", l: ["Subscription", "Shipping", "Contact", "Legal"] }
           ].map((col, i) => (
             <div key={i} className="space-y-12">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.6em] text-[#4a4542]/20">{col.t}</h4>
                <ul className="space-y-6">
                   {col.l.map(link => (
                     <li key={link} className="text-xs font-bold uppercase tracking-widest text-[#4a4542]/30 hover:text-[#4a4542] transition-colors italic">
                        <Link href="#">{link}</Link>
                     </li>
                   ))}
                </ul>
             </div>
           ))}
        </div>
        <div className="max-w-[1400px] mx-auto flex flex-col md:row justify-between items-center gap-8 border-t border-[#f2e1df] pt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-[#4a4542]/10 italic">
           <span>© 2026 VELVET BEAUTY BIOLOGICAL INTEGRITY SA. THE RADIANCE IS ETERNAL.</span>
           <div className="flex gap-12">
              <Link href="#" className="hover:text-[#d4af37] transition-all">PARIS</Link>
              <Link href="#" className="hover:text-[#d4af37] transition-all">GRASSE</Link>
              <Link href="#" className="hover:text-[#d4af37] transition-all">SEOUL</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}
