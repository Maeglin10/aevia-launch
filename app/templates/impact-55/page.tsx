"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Menu, Plus, X, ArrowUpRight, MoveRight, Layers, Layout, Zap, Minus } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function Reveal({ children, delay = 0, y = 80 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

export default function EchoScrollPage() {
  const [scrolled, setScrolled] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  
  // Dynamic background color shift
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["#fafafa", "#1a1a1a", "#ff3b30", "#007aff", "#fafafa"]
  )
  const textColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["#1a1a1a", "#fafafa", "#ffffff", "#ffffff", "#1a1a1a"]
  )

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <motion.div style={{ backgroundColor }} className="font-sans min-h-screen selection:bg-black selection:text-white transition-colors duration-700" ref={containerRef}>
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "mix-blend-difference py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div style={{ color: textColor }} className="text-3xl font-black uppercase tracking-tighter">Echo<span className="font-light italic">.</span></motion.div>
          </Link>
          <div className="hidden lg:flex gap-12">
            {["Work", "Story", "Atelier", "Chat"].map(l => (
              <motion.div key={l} style={{ color: textColor }}>
                <Link href="#" className="text-[10px] font-bold uppercase tracking-[0.4em] hover:opacity-50 transition-opacity">{l}</Link>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <motion.button style={{ color: textColor }} className="hidden md:block text-[10px] font-bold uppercase tracking-widest hover:opacity-50 transition-opacity">Manifesto</motion.button>
            <Sheet>
              <SheetTrigger asChild>
                 <motion.button style={{ color: textColor }}><Menu className="w-6 h-6" /></motion.button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black text-white border-none p-12">
                <div className="flex flex-col gap-10 mt-16 text-left">
                  {["Vision", "Lab", "Works", "Contact"].map(l => (
                    <Link key={l} href="#" className="text-5xl font-black uppercase tracking-tighter hover:italic transition-all">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ──────────────────── */}
        <section className="relative h-screen flex flex-col justify-center px-6 md:px-12 overflow-hidden">
          <Reveal y={150}>
            <motion.h1 style={{ color: textColor }} className="text-[15vw] md:text-[22vw] font-black leading-[0.7] uppercase tracking-tighter">
              LESS <br/> <span className="italic font-light">BUT</span> <br/> BETTER.
            </motion.h1>
          </Reveal>
          
          <div className="absolute bottom-20 right-12 text-right">
             <Reveal delay={0.4}>
                <motion.p style={{ color: textColor }} className="text-xl md:text-3xl font-light max-w-lg leading-tight uppercase italic">
                   We believe in the power of negative space and the weight of every character.
                </motion.p>
             </Reveal>
          </div>
        </section>

        {/* ── THE MESSAGE ───────────── */}
        <section className="py-60 px-6 md:px-12">
           <div className="max-w-[1400px] mx-auto">
              <Reveal>
                 <motion.h2 style={{ color: textColor }} className="text-4xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-40">
                    Design is not <br/> decoration. <br/> <span className="opacity-30 italic font-light">It is intent.</span>
                 </motion.h2>
              </Reveal>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 items-start">
                 <Reveal delay={0.2}>
                    <motion.div style={{ color: textColor }} className="space-y-12">
                       <p className="text-xl md:text-4xl font-light leading-tight uppercase">
                          The noise of the digital world requires a silence in execution. We provide that silence.
                       </p>
                       <div className="w-20 h-[2px] bg-current" />
                       <p className="text-lg opacity-60 leading-relaxed font-light">
                          Our approach is reductive. We peel back the layers of a brand until only the core remains. That core is then amplified through rhythm and scale.
                       </p>
                    </motion.div>
                 </Reveal>
                 <div className="flex flex-col gap-20">
                    {[
                      { t: "CLARITY", d: "Removing the friction between the user and the message." },
                      { t: "IMPACT", d: "Creating memorable moments through typographic scale." },
                      { t: "TIMELESS", d: "Avoiding trends in favor of structural longevity." }
                    ].map((item, i) => (
                      <Reveal key={i} delay={i * 0.1}>
                         <motion.div style={{ color: textColor }} className="group cursor-pointer">
                            <div className="text-[10px] font-bold uppercase tracking-[0.5em] mb-4 opacity-30 group-hover:opacity-100 transition-opacity italic">0{i+1} / Core Pillar</div>
                            <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter group-hover:italic transition-all">{item.t}</h3>
                            <p className="text-sm opacity-40 mt-6 max-w-xs">{item.d}</p>
                         </motion.div>
                      </Reveal>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* ── QUOTE ─────────────────── */}
        <section className="py-40 border-y border-current">
           <div className="overflow-hidden whitespace-nowrap flex items-center py-20">
              <motion.div 
                animate={{ x: ["0%", "-50%"] }} 
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="flex gap-20 text-[10vw] font-black uppercase leading-none"
              >
                 {Array.from({ length: 4 }).map((_, i) => (
                   <motion.div key={i} style={{ color: textColor }} className="flex gap-20 items-center">
                      <span>ECHO STUDIO</span>
                      <Plus className="w-20 h-20" />
                      <span className="italic font-light">INTENTIONAL</span>
                      <Plus className="w-20 h-20" />
                   </motion.div>
                 ))}
              </motion.div>
           </div>
        </section>

        {/* ── SERVICES ──────────────── */}
        <section className="py-60 px-6 md:px-12">
           <div className="max-w-[1400px] mx-auto text-center">
              <Reveal>
                 <motion.h2 style={{ color: textColor }} className="text-6xl md:text-[12vw] font-black uppercase tracking-tighter mb-40">SERVICES.</motion.h2>
              </Reveal>
              <div className="flex flex-col gap-12">
                 {["Visual Identity", "Digital Strategy", "Creative Direction", "Typography Lab"].map((s, i) => (
                   <Reveal key={i} delay={i * 0.1}>
                      <motion.div 
                        style={{ color: textColor }} 
                        className="text-4xl md:text-8xl font-black uppercase tracking-tighter hover:italic hover:opacity-100 opacity-20 transition-all cursor-pointer border-b border-current pb-12"
                      >
                         {s}
                      </motion.div>
                   </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-60 px-6 md:px-12 text-center">
           <Reveal>
              <motion.h2 style={{ color: textColor }} className="text-7xl md:text-[15vw] font-black uppercase tracking-tighter leading-[0.8] mb-20">
                 SPEAK <br/> <span className="italic font-light">LOUDER.</span>
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                 <motion.button style={{ color: textColor, borderColor: textColor }} className="px-16 py-6 border-2 font-black uppercase text-xl hover:bg-current hover:text-black transition-all italic">
                    Contact Us
                 </motion.button>
                 <motion.button style={{ color: textColor }} className="text-xl font-bold uppercase tracking-widest underline underline-offset-8 decoration-2 italic">
                    View Manifesto
                 </motion.button>
              </div>
           </Reveal>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="pt-40 pb-12 px-6 md:px-12 border-t border-current">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-20 mb-40">
           <div className="md:col-span-2">
              <motion.div style={{ color: textColor }} className="text-4xl font-black uppercase tracking-tighter mb-10 italic">Echo.</motion.div>
              <motion.p style={{ color: textColor }} className="text-2xl font-light uppercase italic max-w-sm leading-tight opacity-60">
                 The sound of intention in a world of noise.
              </motion.p>
           </div>
           {[
             { t: "CONNECT", l: ["Instagram", "Twitter", "LinkedIn", "Vimeo"] },
             { t: "ATELIER", l: ["Process", "Lab", "Story", "Careers"] }
           ].map((col, i) => (
             <div key={i} className="space-y-12">
                <motion.h4 style={{ color: textColor }} className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">{col.t}</motion.h4>
                <ul className="space-y-6">
                   {col.l.map(link => (
                     <li key={link}>
                        <motion.div style={{ color: textColor }}>
                           <Link href="#" className="text-xl font-black uppercase tracking-tighter hover:italic transition-all">{link}</Link>
                        </motion.div>
                     </li>
                   ))}
                </ul>
             </div>
           ))}
        </div>
        <div className="max-w-[1400px] mx-auto flex flex-col md:row justify-between items-center gap-8 border-t border-current pt-12">
           <motion.span style={{ color: textColor }} className="text-[10px] font-bold uppercase tracking-widest opacity-20">© 2026 ECHO STUDIO AG. ALL RIGHTS RESERVED.</motion.span>
           <div className="flex gap-12">
              {["Privacy", "Terms", "Legal"].map(l => (
                <motion.div key={l} style={{ color: textColor }}>
                   <Link href="#" className="text-[10px] font-bold uppercase tracking-widest hover:italic transition-all">{l}</Link>
                </motion.div>
              ))}
           </div>
        </div>
      </footer>
    </motion.div>
  )
}
