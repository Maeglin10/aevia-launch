"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Moon, ArrowRight, Menu, Star, Music, Sparkles, MapPin, Camera, Disc, ChevronRight, Play, Heart } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function Reveal({ children, delay = 0, y = 30 }: { children: React.ReactNode; delay?: number; y?: number }) {
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
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"])
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden rounded-[2rem]">
      <motion.div style={{ y }} className="absolute inset-[-20%] w-[140%] h-[140%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

const EVENTS = [
  { id: "01", name: "Neon Masquerade", cat: "Exclusive Event", img: "https://images.unsplash.com/photo-1514525253361-bee8a48790c3?auto=format&fit=crop&q=80&w=1200" },
  { id: "02", name: "Midnight Solace", cat: "Rooftop Party", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200" },
  { id: "03", name: "Ethereal Beats", cat: "Private Club", img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200" },
]

export default function VelvetNightPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#050005] text-[#d1d1d1] font-sans min-h-screen selection:bg-[#ff00ff] selection:text-white overflow-x-hidden">
      
      {/* ── AMBIENT GLOWS ────────── */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ff00ff]/10 blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#4b0082]/10 blur-[150px] pointer-events-none z-0" />

      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${scrolled ? "bg-black/80 backdrop-blur-2xl border-b border-white/5 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff00ff] to-[#4b0082] flex items-center justify-center group-hover:rotate-180 transition-all duration-700 shadow-[0_0_20px_rgba(255,0,255,0.3)]">
              <Moon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-light tracking-[0.4em] uppercase text-white">Velvet <span className="font-bold">Night</span></span>
          </Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.5em] text-white/30">
            {["The Scene", "Experiences", "Members", "Archive"].map(l => (
              <Link key={l} href="#" className="hover:text-[#ff00ff] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors underline underline-offset-8 decoration-[#ff00ff]/30">VIP Login</button>
            <button className="px-10 py-4 bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-[#ff00ff] hover:text-white transition-all duration-700 shadow-xl">Join The Circle</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden p-2"><Menu className="w-6 h-6 text-white" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#050005] border-white/5 p-12 text-white">
                <div className="flex flex-col gap-10 mt-16 text-left">
                  {["Atmosphere", "Events", "Philosophy", "Apply"].map(l => (
                    <Link key={l} href="#" className="text-4xl font-light uppercase tracking-widest hover:text-[#ff00ff] transition-all italic">{l}</Link>
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
             <Image src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2400" alt="Club Atmosphere" fill className="object-cover opacity-20 scale-105" priority />
             <div className="absolute inset-0 bg-gradient-to-t from-[#050005] via-transparent to-[#050005]/80" />
          </div>

          <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
            <Reveal>
              <div className="flex items-center justify-center gap-8 mb-12 opacity-30">
                 <div className="w-16 h-[1px] bg-[#ff00ff]" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white">The Pulse of Nocturnal Elegance</span>
                 <div className="w-16 h-[1px] bg-[#ff00ff]" />
              </div>
            </Reveal>
            <Reveal delay={0.2} y={70}>
              <h1 className="text-8xl md:text-[14vw] font-light tracking-tighter leading-[0.8] text-white mb-16 uppercase italic">
                Ethereal <br/> <span className="font-bold not-italic">Rhythm.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-col items-center justify-center gap-16">
                <p className="text-2xl text-white/40 font-light max-w-2xl leading-relaxed italic">
                  Where the light fades and the soul awakens. An immersive sanctuary for the world's most discerning nocturnal explorers.
                </p>
                <div className="flex flex-wrap justify-center gap-10">
                  <button className="px-16 py-6 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded-full hover:px-20 transition-all duration-700 shadow-2xl shadow-[#ff00ff]/20">
                    Discover The Scene
                  </button>
                  <button className="px-16 py-6 border border-white/10 text-white/40 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-all flex items-center gap-4 rounded-full">
                    <Play className="w-3 h-3 fill-current" /> Witness The Night
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
          
          <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end text-[9px] font-bold uppercase tracking-[0.4em] text-white/10 italic">
            <span>BERLIN / IBIZA / TOKYO / MIAMI</span>
            <div className="flex gap-6">
               <Music className="w-4 h-4 text-[#ff00ff] animate-pulse" />
               <Sparkles className="w-4 h-4 text-[#4b0082]" />
            </div>
          </div>
        </section>

        {/* ── PILLARS ───────────────── */}
        <section className="py-40 bg-[#050005] relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
              {[
                { icon: Disc, t: "Sonic Mastery", d: "Curated auditory journeys by world-class DJs and underground sound architects." },
                { icon: Heart, t: "Elite Circles", d: "Private VIP lounges and concierge services for an uncompromised experience." },
                { icon: MapPin, t: "Hidden Stages", d: "Exclusive pop-up events in the world's most evocative architectural spaces." }
              ].map((p, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="text-center group cursor-pointer">
                    <div className="w-20 h-20 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-10 group-hover:bg-[#ff00ff]/20 group-hover:border-[#ff00ff]/30 transition-all duration-700">
                      <p.icon className="w-6 h-6 text-white/20 group-hover:text-[#ff00ff]" />
                    </div>
                    <h3 className="text-2xl font-bold mb-6 uppercase tracking-widest italic text-white">{p.t}</h3>
                    <p className="text-white/20 leading-relaxed font-light text-sm italic">{p.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── GALLERY ───────────────── */}
        <section className="py-60 bg-black relative">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex flex-col lg:flex-row items-end justify-between mb-32 gap-8 border-b border-white/5 pb-16">
                <div className="max-w-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#ff00ff] block mb-6">Archive of Essence</span>
                  <h2 className="text-6xl md:text-[9vw] font-light uppercase tracking-tighter text-white leading-none italic">Eternal <br/> <span className="not-italic font-bold opacity-10 text-white">Moments.</span></h2>
                </div>
                <Link href="#" className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest hover:text-[#ff00ff] text-white/30 transition-colors group italic">
                  Full Journal <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {EVENTS.map((item, i) => (
                <Reveal key={i} delay={i * 0.15}>
                  <div className="group cursor-pointer">
                    <div className="aspect-[4/5] relative mb-12 overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02]">
                      <ParallaxImg src={item.img} alt={item.name} />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-1000" />
                      <div className="absolute bottom-12 left-12">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[#ff00ff] mb-2 italic">{item.cat}</div>
                        <h3 className="text-4xl font-bold uppercase tracking-tighter text-white">{item.name}</h3>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-60 bg-white text-black text-center relative overflow-hidden">
           {/* Abstract Circle Gradient */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-tr from-[#ff00ff]/20 to-[#4b0082]/20 blur-[120px] pointer-events-none" />
           
           <div className="max-w-4xl mx-auto px-6 relative z-10">
              <Reveal>
                 <div className="w-20 h-20 mx-auto mb-20 rounded-full bg-black flex items-center justify-center shadow-2xl">
                    <Sparkles className="w-8 h-8 text-white" />
                 </div>
                 <h2 className="text-8xl md:text-[14vw] font-light uppercase tracking-tighter leading-[0.8] mb-16 italic">
                    Enter The <br/> <span className="font-bold not-italic opacity-10 italic">Eternal.</span>
                 </h2>
                 <p className="text-2xl text-black/40 font-light mb-20 leading-relaxed italic max-w-2xl mx-auto">
                    Membership is by invitation only. Apply for consideration and gain access to the world's most guarded nocturnal experiences.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                    <button className="px-20 py-8 bg-black text-white font-bold uppercase tracking-[0.3em] text-[10px] rounded-full hover:px-24 transition-all duration-700 italic shadow-2xl">
                       Apply For Membership
                    </button>
                    <button className="px-20 py-8 border border-black/10 text-black/40 font-bold uppercase tracking-[0.3em] text-[10px] rounded-full hover:text-black transition-all italic">
                       View Membership Tiers
                    </button>
                 </div>
              </Reveal>
           </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#050005] pt-40 pb-12 px-6 border-t border-white/5 relative z-[60]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
           <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-4 mb-10 group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff00ff] to-[#4b0082] flex items-center justify-center">
                  <Moon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-light tracking-[0.4em] uppercase text-white">Velvet Night</span>
              </Link>
              <p className="text-white/20 max-w-sm leading-relaxed mb-12 text-sm font-light italic">
                 "In the shadows of the night, we find the truth of the spirit. Curated for the few who understand the silence."
              </p>
              <div className="flex gap-10">
                 {["Camera", "Vimeo", "Soundcloud", "Contact"].map(s => (
                   <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-[#ff00ff] transition-colors italic">{s}</Link>
                 ))}
              </div>
           </div>
           
           {[
             { t: "THE EXPERIENCE", l: ["Atmosphere", "VIP Tables", "Sound Lab", "Secret Stages"] },
             { t: "LOCATIONS", l: ["Berlin Hub", "Ibiza Retreat", "Tokyo Underground", "Miami Penthouse"] },
             { t: "ENTITY", l: ["The Circle", "Membership", "Journal", "Legal"] }
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
           <span>© 2026 VELVET NIGHT GLOBAL COMMISSIONS. THE NIGHT IS ETERNAL.</span>
           <div className="flex gap-12">
              <Link href="#" className="hover:text-white transition-all underline decoration-[#ff00ff]/20">SLA: NOMINAL</Link>
              <Link href="#" className="hover:text-white transition-all underline decoration-[#ff00ff]/20">DRESS_CODE: BLACK_TIE</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}
