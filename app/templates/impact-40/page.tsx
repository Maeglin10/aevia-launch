"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Camera, ArrowRight, Menu, Star, Maximize2, MoveRight, Layers, Layout, Zap, ChevronRight, Play } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function Reveal({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

const PROJECTS = [
  { title: "Obsidian", cat: "Art Direction", img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200" },
  { title: "Vapor", cat: "3D Motion", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200" },
  { title: "Prism", cat: "Web Design", img: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=1200" },
  { title: "Kinetics", cat: "Typography", img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200" },
  { title: "Fluid", cat: "Visual Identity", img: "https://images.unsplash.com/photo-1550684399-3f41d5ecc33e?auto=format&fit=crop&q=80&w=1200" },
]

export default function KineticLensPage() {
  const [scrolled, setScrolled] = useState(false)
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: targetRef })
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#050505] text-white font-sans min-h-screen selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-black/90 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <Camera className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-[0.2em] uppercase">Kinetic <span className="font-light text-white/40">Lens</span></span>
          </Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">
            {["Gallery", "Method", "Atelier", "Archive"].map(l => (
              <Link key={l} href="#" className="hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
             <button className="hidden md:block px-8 py-3 border border-white text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-700">Project Brief</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden p-2"><Menu className="w-6 h-6 text-white" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-black border-white/5 p-12 text-white">
                <div className="flex flex-col gap-10 mt-16 text-left">
                  {["Work", "Labs", "Contact"].map(l => (
                    <Link key={l} href="#" className="text-4xl font-bold uppercase tracking-tighter hover:italic transition-all">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ──────────────────── */}
        <section className="relative h-screen flex items-center pt-20 overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-20">
             <div>
                <Reveal>
                  <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/40 block mb-12">Creative Studio — London / NYC</span>
                </Reveal>
                <Reveal delay={0.1} y={100}>
                  <h1 className="text-7xl md:text-[10vw] font-black leading-[0.85] uppercase tracking-tighter mb-12">
                    Crafting <br/> <span className="text-white/20 italic">Motion.</span>
                  </h1>
                </Reveal>
                <Reveal delay={0.3}>
                   <div className="flex items-center gap-8 group cursor-pointer">
                      <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-700">
                         <Play className="w-6 h-6 text-white group-hover:text-black fill-current" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest italic group-hover:translate-x-4 transition-transform duration-700">Watch Studio Showreel</span>
                   </div>
                </Reveal>
             </div>
             <div className="flex flex-col justify-end pb-20">
                <Reveal delay={0.4}>
                   <p className="text-xl md:text-3xl font-light text-white/60 leading-tight max-w-md">
                      Specializing in the intersection of high-fidelity 3D motion and interactive digital design.
                   </p>
                </Reveal>
             </div>
          </div>
          {/* Background Text */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[30vw] font-black uppercase text-white/[0.02] pointer-events-none select-none">
             STUDIO
          </div>
        </section>

        {/* ── HORIZONTAL WORK ───────── */}
        <section ref={targetRef} className="h-[400vh] relative">
          <div className="sticky top-0 h-screen flex items-center overflow-hidden">
             <motion.div style={{ x }} className="flex gap-20 px-24">
                <div className="w-[80vw] md:w-[40vw] shrink-0 flex flex-col justify-center">
                   <Reveal>
                      <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-8 leading-none">THE <br/> GALLERY.</h2>
                      <p className="text-lg text-white/40 max-w-sm">A collection of our most recent experiments in spatial design and motion graphics.</p>
                   </Reveal>
                </div>
                {PROJECTS.map((p, i) => (
                  <div key={i} className="w-[80vw] md:w-[60vw] shrink-0 relative group">
                     <div className="aspect-[16/9] relative overflow-hidden rounded-sm grayscale group-hover:grayscale-0 transition-all duration-1000">
                        <Image src={p.img} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-1000" />
                        <div className="absolute top-12 left-12 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                           <div className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4">0{i+1} / Project</div>
                           <h3 className="text-4xl font-black uppercase tracking-tighter italic">{p.title}</h3>
                        </div>
                     </div>
                     <div className="mt-8 flex justify-between items-end border-b border-white/10 pb-8">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">{p.cat}</span>
                        <ArrowUpRight className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0" />
                     </div>
                  </div>
                ))}
                <div className="w-[40vw] shrink-0 flex flex-col justify-center items-center text-center">
                   <Link href="#" className="group">
                      <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40 mb-12 group-hover:text-white transition-colors italic">Ready For More?</div>
                      <h4 className="text-4xl md:text-6xl font-black uppercase tracking-tighter group-hover:italic transition-all underline underline-offset-[20px]">View Full Archive</h4>
                   </Link>
                </div>
             </motion.div>
          </div>
        </section>

        {/* ── METHOD ────────────────── */}
        <section className="py-40 bg-white text-black">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                <Reveal>
                   <div className="relative aspect-square bg-[#050505] p-2 overflow-hidden">
                      <Image src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200" alt="Detail" fill className="object-cover opacity-50 grayscale" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-2/3 h-2/3 border border-white/20 rounded-full flex items-center justify-center animate-[spin_30s_linear_infinite]">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full" />
                         </div>
                      </div>
                   </div>
                </Reveal>
                <div>
                   <Reveal>
                      <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/30 block mb-8">Our Method</span>
                      <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-12 italic">Digital <br/> <span className="not-italic">Physics.</span></h2>
                      <p className="text-2xl font-light text-black/60 leading-relaxed mb-16">
                         We don't just animate. We simulate weight, friction, and light to create digital objects that feel like they belong in the real world.
                      </p>
                      <div className="space-y-12">
                         {[
                           { t: "KINETIC DEPTH", d: "Layered 3D environments that respond to user interaction with organic movement." },
                           { t: "LIGHT SIMULATION", d: "Custom-built lighting rigs for digital objects to ensure physical accuracy." }
                         ].map((item, i) => (
                           <div key={i} className="flex gap-8 group">
                              <div className="text-3xl font-black italic opacity-20 group-hover:opacity-100 transition-opacity italic-none">0{i+1}</div>
                              <div>
                                 <h4 className="text-xl font-bold uppercase tracking-widest mb-2">{item.t}</h4>
                                 <p className="text-sm text-black/40 leading-relaxed font-light">{item.d}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </Reveal>
                </div>
             </div>
          </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-40 bg-[#050505] text-center border-t border-white/10">
           <div className="max-w-4xl mx-auto px-6">
              <Reveal>
                 <h2 className="text-6xl md:text-[10vw] font-black uppercase tracking-tighter leading-[0.8] mb-16">
                    SHIFT <br/> <span className="text-white/20 italic">GEARS.</span>
                 </h2>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
                    <button className="px-16 py-6 bg-white text-black font-bold uppercase tracking-widest text-[10px] hover:px-20 transition-all duration-700">
                       Start Project
                    </button>
                    <button className="px-16 py-6 border border-white/20 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all">
                       Studio Journal
                    </button>
                 </div>
              </Reveal>
           </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-black pt-32 pb-12 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-16 mb-32">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <Camera className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold tracking-[0.2em] uppercase text-white">Kinetic Lens</span>
            </Link>
            <p className="text-white/20 max-w-sm leading-relaxed mb-10 text-sm italic font-light">
              Redefining the digital frontier through physics-driven motion and high-fidelity interaction.
            </p>
            <div className="flex gap-8">
               {["Vimeo", "Instagram", "Behance", "X"].map(s => (
                 <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">{s}</Link>
               ))}
            </div>
          </div>
          
          {[
            { t: "STUDIO", l: ["Our Lab", "The Team", "Process", "Careers"] },
            { t: "SERVICES", l: ["Motion Design", "Interactive", "3D Art", "Branding"] },
            { t: "CLIENTS", l: ["Access Hub", "Archive", "Log In", "Support"] },
          ].map((col, i) => (
            <div key={i} className="space-y-10">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">{col.t}</h4>
              <ul className="space-y-6">
                {col.l.map(link => <li key={link} className="text-xs font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors italic"><Link href="#">{link}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-[1400px] mx-auto pt-12 border-t border-white/5 flex flex-col md:row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-white/10">
          <span>© 2026 KINETIC LENS STUDIO. MOTION IS LIFE.</span>
          <div className="flex gap-10 italic">
             <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
             <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
  )
}
