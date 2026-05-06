"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Menu, Plus, X, ArrowUpRight, Minus, MoveRight, Layers, Layout, Maximize2, Zap } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function Reveal({ children, delay = 0, y = 100 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.33, 1, 0.68, 1] }}>
      {children}
    </motion.div>
  )
}

const PROJECTS = [
  { id: "01", title: "CHROME DREAMS", cat: "Visual Identity", year: "2024" },
  { id: "02", title: "STATIC FLOW", cat: "Digital Product", year: "2023" },
  { id: "03", title: "NEON RIOT", cat: "Art Direction", year: "2024" },
  { id: "04", title: "VOID SPACE", cat: "Spatial Design", year: "2023" },
]

export default function FlipStudioPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-white text-black font-mono min-h-screen selection:bg-black selection:text-white overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white border-b-4 border-black py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-black text-xl">F</div>
            <span className="text-2xl font-black uppercase tracking-tighter">Flip <span className="text-white bg-black px-2">Studio</span></span>
          </Link>
          <div className="hidden lg:flex gap-12 text-xs font-black uppercase tracking-widest">
            {["Work", "Labs", "Agency", "Contact"].map(l => (
              <Link key={l} href="#" className="hover:line-through transition-all">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <button className="hidden md:block text-xs font-black uppercase border-2 border-black px-6 py-2 hover:bg-black hover:text-white transition-all">Hire Us</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden p-2 bg-black text-white"><Menu className="w-6 h-6" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-white border-l-4 border-black p-12">
                <div className="flex flex-col gap-10 mt-16 text-left">
                  {["Projects", "Labs", "Story", "Chat"].map(l => (
                    <Link key={l} href="#" className="text-5xl font-black uppercase hover:italic transition-all">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ──────────────────── */}
        <section className="relative min-h-screen flex items-center pt-40 pb-20 border-b-8 border-black">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12 w-full">
            <Reveal y={150}>
              <h1 className="text-[12vw] md:text-[18vw] font-black leading-[0.75] uppercase tracking-tighter mb-10">
                RAW <br/> <span className="italic">IDEAS.</span>
              </h1>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
              <Reveal delay={0.2}>
                <p className="text-xl md:text-3xl font-bold uppercase leading-tight max-w-xl">
                  We create confrontational digital experiences that refuse to be ignored. Brutal by design, surgical in execution.
                </p>
              </Reveal>
              <div className="flex justify-end">
                <Reveal delay={0.4}>
                  <div className="group relative cursor-pointer">
                    <div className="absolute inset-0 bg-black translate-x-3 translate-y-3 transition-transform group-hover:translate-x-5 group-hover:translate-y-5" />
                    <div className="relative bg-white border-4 border-black p-10 flex flex-col items-center gap-6">
                       <Zap className="w-12 h-12" />
                       <span className="text-xs font-black uppercase tracking-[0.3em]">Scroll To Explore</span>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── TICKER ────────────────── */}
        <section className="py-6 bg-black text-white overflow-hidden flex items-center">
           <motion.div 
             animate={{ x: ["0%", "-50%"] }} 
             transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
             className="flex gap-20 whitespace-nowrap text-4xl font-black uppercase"
           >
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-10">
                   <span>Brutal Digital</span>
                   <Plus className="w-8 h-8" />
                   <span>No Placeholders</span>
                   <Plus className="w-8 h-8" />
                </div>
              ))}
           </motion.div>
        </section>

        {/* ── WORK GRID ─────────────── */}
        <section className="py-40 bg-white">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12">
            <Reveal>
               <div className="flex justify-between items-baseline mb-20 border-b-4 border-black pb-10">
                  <h2 className="text-6xl md:text-9xl font-black uppercase italic">WORK.</h2>
                  <span className="text-xs font-black uppercase">Selected Projects 2023/24</span>
               </div>
            </Reveal>

            <div className="space-y-0">
              {PROJECTS.map((p, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <Link href="#" className="group flex flex-col md:flex-row items-center justify-between py-12 border-b-4 border-black hover:bg-black hover:text-white transition-all duration-300 px-6">
                    <div className="flex items-center gap-10 mb-6 md:mb-0">
                       <span className="text-xl font-black opacity-30 group-hover:opacity-100">{p.id}</span>
                       <h3 className="text-4xl md:text-7xl font-black uppercase group-hover:italic">{p.title}</h3>
                    </div>
                    <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-end">
                       <span className="text-xs font-black uppercase tracking-widest">{p.cat}</span>
                       <div className="w-12 h-12 border-4 border-black group-hover:border-white flex items-center justify-center">
                          <ArrowUpRight className="w-6 h-6" />
                       </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── EXPERTISE ─────────────── */}
        <section className="py-40 bg-white border-y-8 border-black">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-0">
             {[
               { t: "STRATEGY", d: "Hard truths only. We audit your brand until it bleeds efficiency and purpose." },
               { t: "DESIGN", d: "Anti-minimalism. We use type and space to create tension and memorable impact." },
               { t: "TECH", d: "High-performance engines. Clean code, zero bloat, maximum speed delivery." }
             ].map((f, i) => (
               <Reveal key={i} delay={i * 0.1}>
                  <div className={`p-16 flex flex-col h-full border-black ${i < 2 ? "lg:border-r-4 border-b-4 lg:border-b-0" : "border-b-0"}`}>
                     <div className="w-16 h-16 bg-black text-white flex items-center justify-center font-black text-2xl mb-10">{i + 1}</div>
                     <h4 className="text-4xl font-black uppercase mb-8">{f.t}</h4>
                     <p className="text-lg font-bold leading-relaxed">{f.d}</p>
                  </div>
               </Reveal>
             ))}
          </div>
        </section>

        {/* ── IMAGE SECTION ─────────── */}
        <section className="py-40 bg-white">
           <div className="max-w-[1800px] mx-auto px-6 md:px-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <Reveal>
                    <div className="relative group overflow-hidden border-4 border-black">
                       <div className="aspect-square bg-black relative">
                          <div className="absolute inset-0 bg-white/20 group-hover:inset-10 transition-all duration-500 border-4 border-white flex items-center justify-center">
                             <Maximize2 className="w-20 h-20 text-white" />
                          </div>
                       </div>
                    </div>
                 </Reveal>
                 <div className="flex flex-col justify-center space-y-12">
                    <Reveal delay={0.2}>
                       <h2 className="text-5xl md:text-8xl font-black uppercase leading-none">NO <br/> FLUFF.</h2>
                       <p className="text-xl md:text-2xl font-bold uppercase leading-tight max-w-sm">
                          Every pixel has to justify its existence. If it doesn't add value, it gets cut.
                       </p>
                    </Reveal>
                    <Reveal delay={0.3}>
                       <div className="p-8 border-4 border-black bg-black text-white">
                          <div className="text-[10vw] font-black leading-none uppercase tracking-tighter">100% RAW</div>
                       </div>
                    </Reveal>
                 </div>
              </div>
           </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-40 bg-black text-white text-center">
           <div className="max-w-4xl mx-auto px-6">
              <Reveal>
                 <h2 className="text-6xl md:text-[12vw] font-black uppercase leading-[0.8] mb-12 tracking-tighter">
                    READY <br/> TO <span className="italic text-black bg-white px-4">START?</span>
                 </h2>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
                    <button className="px-16 py-8 bg-white text-black font-black uppercase text-xl hover:italic transition-all">
                       Let's Chat
                    </button>
                    <button className="px-16 py-8 border-4 border-white text-white font-black uppercase text-xl hover:bg-white hover:text-black transition-all">
                       See All Work
                    </button>
                 </div>
              </Reveal>
           </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-white pt-32 pb-12 px-6 border-t-8 border-black">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-32">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-2xl">F</div>
              <span className="text-3xl font-black uppercase tracking-tighter">Flip Studio</span>
            </Link>
            <p className="text-xl font-bold max-w-sm leading-tight uppercase mb-10">
              Raw digital products for companies that value honesty over aesthetics.
            </p>
            <div className="flex gap-10 font-black uppercase text-sm">
               {["Insta", "Twit", "Link", "Git"].map(s => <Link key={s} href="#" className="hover:line-through transition-all">{s}</Link>)}
            </div>
          </div>
          
          {[
            { t: "OFFICE", l: ["Berlin, DE", "Copenhagen, DK", "Tokyo, JP"] },
            { t: "PAGES", l: ["Projects", "Labs", "Story", "Careers"] },
          ].map((col, i) => (
            <div key={i} className="space-y-10">
              <h4 className="text-xs font-black uppercase tracking-[0.4em] opacity-30">{col.t}</h4>
              <ul className="space-y-6">
                {col.l.map(link => <li key={link} className="text-lg font-black uppercase hover:italic transition-all"><Link href="#">{link}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-[1800px] mx-auto pt-12 border-t-4 border-black flex flex-col md:row justify-between items-center gap-6 text-xs font-black uppercase tracking-widest">
          <span>© 2026 FLIP STUDIO. EST 2021.</span>
          <div className="flex gap-10">
             <Link href="#" className="hover:line-through transition-all">Privacy</Link>
             <Link href="#" className="hover:line-through transition-all">Terms</Link>
             <Link href="#" className="hover:line-through transition-all">Sitemap</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
