// @ts-nocheck
"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Volume2, ArrowRight, Menu, Star, Activity, Shield, Mic2, Speaker, Headphones, Zap, Play, ChevronRight, Music } from "lucide-react"
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

function AudioBars({ active = false }: { active?: boolean }) {
  return (
    <div className="flex items-end gap-[2px] h-8">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] bg-white"
          animate={active 
            ? { height: ["20%", "90%", "40%", "80%", "30%"] } 
            : { height: "20%" }
          }
          transition={{ 
            duration: 0.8 + Math.random() * 0.5, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: i * 0.05
          }}
        />
      ))}
    </div>
  )
}

const PRODUCTS = [
  { name: "A1 Monitor", type: "Reference Studio Speakers", price: "$4,200", img: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=1200", specs: "Carbon fiber dome, 120dB dynamic range." },
  { name: "Aether Tube", type: "Vacuum Tube Amplifier", price: "$8,900", img: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?auto=format&fit=crop&q=80&w=1200", specs: "Hand-wired circuitry, pure Class A operation." },
  { name: "Void Pro", type: "Open-Back Headphones", price: "$1,850", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200", specs: "Planar magnetic drivers, aircraft-grade aluminum." },
]

export default function AetherSoundPage() {
  const [scrolled, setScrolled] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#050505] text-white font-sans min-h-screen selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${scrolled ? "bg-black/90 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white transition-all duration-700">
              <Volume2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-[0.2em] uppercase">Aether <span className="font-light text-white/40">Sound</span></span>
          </Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">
            {["Acoustics", "Manifesto", "Instruments", "Journal"].map(l => (
              <Link key={l} href="#hero" className="hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">Trade Portal</button>
            <button className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm hover:bg-transparent hover:text-white hover:border-white border border-transparent transition-all duration-700">Request Audit</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden"><Menu className="w-6 h-6 text-white" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-black border-white/5 p-12 text-white">
                <div className="flex flex-col gap-10 mt-16 text-left">
                  {["Acoustics", "Instruments", "About", "Contact"].map(l => (
                    <Link key={l} href="#contact" className="text-2xl font-light uppercase tracking-[0.3em] hover:text-white transition-colors">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ──────────────────── */}
        <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
          </div>

          <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
            <Reveal>
              <div className="flex items-center justify-center gap-4 mb-12">
                <AudioBars active />
                <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/40">Pure Signal Integrity</span>
                <AudioBars active />
              </div>
            </Reveal>
            <Reveal delay={0.2} y={70}>
              <h1 className="text-7xl md:text-[9rem] font-light tracking-tighter leading-[0.85] text-white mb-12 uppercase">
                Zero <br/> <span className="font-bold italic">Artifact.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-col items-center justify-center gap-12">
                <p className="text-xl text-white/40 font-light max-w-xl leading-relaxed">
                  Luthier-grade acoustic engineering for the discerning audiophile. Experience the silence between the notes.
                </p>
                <div className="flex flex-wrap justify-center gap-8">
                  <button className="px-12 py-5 bg-white text-black font-bold uppercase tracking-widest text-[10px] hover:bg-transparent hover:text-white border border-white transition-all duration-700">
                    Explore Instruments
                  </button>
                  <button className="px-12 py-5 border border-white/20 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all flex items-center gap-3">
                    <Play className="w-3 h-3 fill-current" /> Hear the Void
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
          
          <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
            <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">Frequency Response: 2Hz — 45kHz</div>
            <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">THD: &lt;0.0001%</div>
          </div>
        </section>

        {/* ── PRODUCTS ──────────────── */}
        <section id="collections" className="py-40 bg-[#050505]">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex flex-col lg:flex-row items-end justify-between mb-32 gap-8 border-b border-white/5 pb-12">
                <div className="max-w-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 block mb-4">The Collection</span>
                  <h2 className="text-6xl md:text-8xl font-light uppercase tracking-tighter">Acoustic <span className="italic font-bold">Sculptures.</span></h2>
                </div>
                <Link href="#collections" className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest hover:text-white text-white/40 transition-colors group">
                  View Specifications <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {PRODUCTS.map((p, i) => (
                <Reveal key={i} delay={i * 0.15}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[4/5] mb-10 overflow-hidden bg-white/[0.02]">
                      <Image src={p.img} alt={p.name} fill className="object-cover opacity-50 grayscale group-hover:opacity-80 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                      <div className="absolute top-8 left-8">
                         <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">{p.type}</div>
                         <h3 className="text-3xl font-bold uppercase tracking-widest">{p.name}</h3>
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                       <p className="text-sm text-white/30 max-w-[200px] font-light leading-relaxed">{p.specs}</p>
                       <div className="text-2xl font-bold">{p.price}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── MANIFESTO ─────────────── */}
        <section className="py-40 relative bg-black overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="max-w-4xl mx-auto px-6 text-center">
            <Reveal>
              <Music className="w-12 h-12 mx-auto mb-16 text-white/20" />
              <h2 className="text-4xl md:text-6xl font-light italic leading-tight text-white mb-16">
                "We don't reproduce sound. We recreate the air as it was at the moment of creation."
              </h2>
              <div className="w-24 h-[1px] bg-white/40 mx-auto mb-8" />
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40">The Aether Principle</p>
            </Reveal>
          </div>
        </section>

        {/* ── ENGINEERING ───────────── */}
        <section className="py-32 bg-[#050505]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <Reveal>
                <div className="relative aspect-square border border-white/5 flex items-center justify-center p-20">
                   <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.02)_0%,transparent_70%)]" />
                   <div className="relative w-full h-full border-2 border-white/5 rounded-full flex items-center justify-center">
                      <div className="w-2/3 h-2/3 border border-white/10 rounded-full flex items-center justify-center animate-[pulse_4s_ease-in-out_infinite]">
                         <Speaker className="w-16 h-16 text-white/20" />
                      </div>
                      {/* Technical markings */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-black border border-white/20 text-[8px] font-bold uppercase tracking-widest">Phase Align</div>
                   </div>
                </div>
              </Reveal>
              <div>
                <Reveal>
                  <h2 className="text-5xl md:text-7xl font-light uppercase tracking-tighter mb-16">Bespoke <br/><span className="italic font-bold text-white/40">Acousics.</span></h2>
                  <div className="space-y-12">
                    {[
                      { icon: Mic2, t: "Reference Linearity", d: "Measurement-grade accuracy for monitoring and critical listening sessions." },
                      { icon: Zap, t: "Instantaneous Transient", d: "Zero-latency response times for the most complex harmonic textures." },
                      { icon: Shield, t: "Resonance Isolation", d: "Mass-loaded polymer shells that eliminate cabinet vibration and coloration." }
                    ].map((f, i) => (
                      <div key={i} className="flex gap-8 group">
                         <div className="w-12 h-12 shrink-0 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-700">
                            <f.icon className="w-5 h-5 text-white/40 group-hover:text-black transition-colors" />
                         </div>
                         <div>
                            <h4 className="text-lg font-bold uppercase tracking-widest mb-2">{f.t}</h4>
                            <p className="text-sm text-white/30 leading-relaxed font-light">{f.d}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ──────────── */}
        <section id="equipe" className="py-40 bg-[#050505] border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex items-end justify-between mb-20 border-b border-white/5 pb-12 gap-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 block mb-6">Who Listens</span>
                  <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter italic text-white leading-none">Client <span className="font-light not-italic opacity-10">Voices.</span></h2>
                </div>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
              {[
                { quote: "We installed the Studio Array in our film scoring stage. The first session, the composer wept. The clarity revealed things we had been missing for a decade.", name: "J. Wren", origin: "London · Scoring Stage B" },
                { quote: "I've designed rooms with every major brand. None hold a candle to what their engineering team achieved at this price point. Extraordinary.", name: "M. Belfort", origin: "Paris · Studio Acoustics" },
                { quote: "The monitoring accuracy of the Reference Series changed my mixes. I'm hearing nuances I used to think only other engineers had the ears to perceive.", name: "T. Osei", origin: "Lagos · Mastering Engineer" },
              ].map((t, i) => (
                <Reveal key={i} delay={i * 0.12}>
                  <div className="bg-[#050505] p-14 flex flex-col gap-8 hover:bg-black transition-colors">
                    <div className="text-6xl text-white/5 font-serif leading-none">&ldquo;</div>
                    <p className="text-white/40 font-light leading-relaxed italic flex-1 text-lg">{t.quote}</p>
                    <div className="border-t border-white/5 pt-8">
                      <div className="text-sm font-bold text-white uppercase tracking-widest">{t.name}</div>
                      <div className="text-xs text-white/25 tracking-widest mt-2">{t.origin}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── ACOUSTIC AWARDS ─────────── */}
        <section className="py-32 bg-black border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex flex-wrap items-center justify-between gap-8 mb-16 border-b border-white/5 pb-12">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">Recognised by</span>
                <div className="flex flex-wrap gap-8">
                  {["AES Gold Medal 2024", "TEC Award Best Hardware", "Mix Magazine Premier Award", "Pro Sound Europe"].map(a => (
                    <span key={a} className="text-[10px] font-bold uppercase tracking-widest text-white/15 hover:text-white/40 transition-colors">{a}</span>
                  ))}
                </div>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
              {[
                { v: "140+", l: "Studios Built" },
                { v: "0.001%", l: "THD at ref level" },
                { v: "22Hz", l: "Low-end extension" },
                { v: "41yr", l: "Acoustic Research" },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="bg-black p-12 text-center hover:bg-white/[0.02] transition-colors">
                    <div className="text-3xl font-black italic text-white mb-2">{s.v}</div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-white/20">{s.l}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section id="contact" className="py-40 bg-white text-black text-center">
          <div className="max-w-4xl mx-auto px-6">
            <Reveal>
              <h2 className="text-6xl md:text-9xl font-light uppercase tracking-tighter leading-[0.8] mb-12">
                Hear The <br/> <span className="font-bold italic">Truth.</span>
              </h2>
              <p className="text-xl text-black/60 font-light mb-16 leading-relaxed">
                Schedule a private acoustic audit at our Berlin or Tokyo studios. Experience the pinnacle of audio engineering.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <button className="px-16 py-6 bg-black text-white font-bold uppercase tracking-widest text-[10px] hover:bg-transparent hover:text-black border border-black transition-all duration-700">
                  Book Private Audition
                </button>
                <button className="px-16 py-6 border border-black/20 text-black font-bold uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all">
                  Contact Engineer
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-black pt-24 pb-12 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-16 mb-24">
          <div className="md:col-span-2">
            <Link href="#hero" className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-[0.2em] uppercase text-white">Aether <span className="font-light text-white/40">Sound</span></span>
            </Link>
            <p className="text-white/20 max-w-sm leading-relaxed mb-10 text-sm font-light">
              Founded on the belief that perfect audio is not measured in decibels, but in emotional resonance. Engineered for the infinite.
            </p>
            <div className="flex gap-8">
               {["Camera", "Journal", "Technical Paper", "Discord"].map(s => (
                 <Link key={s} href="#hero" className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">{s}</Link>
               ))}
            </div>
          </div>
          
          {[
            { t: "The Atelier", l: ["Luthier Craft", "Acoustic Labs", "Our History", "The Team"] },
            { t: "Instruments", l: ["Speakers", "Amplifiers", "Source Gear", "Cabling"] },
            { t: "Support", l: ["Installation", "Warranty", "Trade Program", "Contact"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white mb-10">{col.t}</h4>
              <ul className="space-y-6">
                {col.l.map(link => <li key={link}><Link href="#contact" className="text-xs text-white/30 hover:text-white transition-colors">{link}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-[1400px] mx-auto pt-12 border-t border-white/5 flex flex-col md:row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-white/10">
          <span>© 2026 AETHER SOUND AG. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-10">
             <Link href="#contact" className="hover:text-white transition-colors">Privacy Circle</Link>
             <Link href="#contact" className="hover:text-white transition-colors">Technical Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Lock({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  )
}
