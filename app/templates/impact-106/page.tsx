"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { PenTool, ArrowRight, Menu, Star, Layers, Eye, Palette, Zap, Award, Users, ChevronRight, ArrowUpRight } from "lucide-react"
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

function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"])
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-[-12%] w-[124%] h-[124%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

const PROJECTS = [
  { title: "Flux Identity", client: "Flux Labs", type: "Brand System", img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=1200", year: "2024" },
  { title: "Prism Launch", client: "Prism Analytics", type: "Product Design", img: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1200", year: "2024" },
  { title: "Ember Editorial", client: "Ember Magazine", type: "Editorial + Web", img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200", year: "2023" },
  { title: "Vertex Motion", client: "Vertex Films", type: "Motion Design", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200", year: "2023" },
]

const CAPABILITIES = [
  { icon: Palette, title: "Visual Identity", desc: "Logo, color system, typography, and brand guidelines that scale from app icon to billboard." },
  { icon: Layers, title: "Product Design", desc: "User research, wireframes, prototypes, and pixel-perfect UI for web and mobile." },
  { icon: PenTool, title: "Art Direction", desc: "Photo shoots, illustration commissions, and visual storytelling for campaigns." },
  { icon: Zap, title: "Motion & 3D", desc: "Animated logos, explainer videos, and three-dimensional brand worlds." },
]

export default function StudioVersaPage() {
  const [scrolled, setScrolled] = useState(false)

  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#faf5f0] text-[#1a1a1a] font-sans min-h-screen selection:bg-orange-500 selection:text-white overflow-x-hidden">

      {/* ── NAVBAR ─────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#faf5f0]/90 backdrop-blur-xl border-b border-orange-500/10 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-light tracking-[0.15em] uppercase">Studio <span className="font-black text-orange-500">Versa</span></span>
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-[#1a1a1a]/40">
            {["Work", "Capabilities", "Team", "Journal"].map(l => (
              <Link key={l} href="#" className="hover:text-orange-500 transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <button className="hidden md:block px-8 py-3 bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-orange-500 transition-colors duration-500">
              Start a Project
            </button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden"><Menu className="w-6 h-6" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#faf5f0] p-12">
                <div className="flex flex-col gap-8 mt-16">
                  {["Work", "Capabilities", "Team", "Contact"].map(l => (
                    <Link key={l} href="#" className="text-3xl font-light uppercase tracking-widest hover:text-orange-500 transition-colors">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ─────────────────── */}
        <section className="relative min-h-[90vh] flex items-center pt-40 pb-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-[50vw] h-full hidden lg:block">
            <ParallaxImg src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=1600" alt="Studio" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#faf5f0] via-[#faf5f0]/40 to-transparent" />
          </div>

          <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 w-full">
            <Reveal>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-[2px] bg-orange-500" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-500">Multidisciplinary Creative Studio</span>
              </div>
            </Reveal>
            <Reveal delay={0.1} y={60}>
              <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter leading-[0.8] mb-8 max-w-4xl">
                Design<br/>With <span className="text-orange-500 italic">Intent.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-xl text-[#1a1a1a]/50 font-light max-w-lg leading-relaxed mb-10">
                We craft brand identities, digital products, and visual stories for companies that want to matter.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-wrap gap-6">
                {[
                  { v: "86", l: "Projects" },
                  { v: "14", l: "Awards" },
                  { v: "7yr", l: "Active" },
                ].map((s, i) => (
                  <div key={i} className="border-l-2 border-orange-500/20 pl-4">
                    <div className="text-2xl font-black text-orange-500">{s.v}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/30">{s.l}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </motion.div>
        </section>

        {/* ── WORK ──────────────────── */}
        <section className="py-32 bg-[#faf5f0]">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex justify-between items-end mb-20">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-500 block mb-4">Portfolio</span>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter">Selected <span className="text-orange-500 italic">Work.</span></h2>
                </div>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {PROJECTS.map((p, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-6">
                      <ParallaxImg src={p.img} alt={p.title} />
                      <div className="absolute inset-0 bg-orange-900/0 group-hover:bg-orange-900/10 transition-colors duration-700" />
                      <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <ArrowUpRight className="w-5 h-5 text-[#1a1a1a]" />
                      </div>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold group-hover:text-orange-500 transition-colors mb-1">{p.title}</h3>
                        <div className="text-sm text-[#1a1a1a]/40">{p.client} · {p.type}</div>
                      </div>
                      <span className="text-xs text-[#1a1a1a]/30 font-mono">{p.year}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CAPABILITIES ──────────── */}
        <section className="py-32 bg-[#1a1a1a] text-white">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-24">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-400 block mb-4">What We Do</span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter">Our <span className="text-orange-400 italic">Craft.</span></h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CAPABILITIES.map((c, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="group p-10 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-orange-500/30 transition-all duration-500 cursor-default">
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-500">
                        <c.icon className="w-6 h-6 text-orange-400 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-3">{c.title}</h3>
                        <p className="text-sm text-white/40 leading-relaxed">{c.desc}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────── */}
        <section className="py-32 bg-[#faf5f0]">
          <div className="max-w-[800px] mx-auto px-6 text-center">
            <Reveal>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                Let's Make<br/><span className="text-orange-500 italic">Something.</span>
              </h2>
              <p className="text-lg text-[#1a1a1a]/40 font-light max-w-md mx-auto mb-10">
                We're selective about the projects we take on. If you're serious about great design, we should talk.
              </p>
              <button className="px-12 py-5 bg-[#1a1a1a] text-white font-bold rounded-full hover:bg-orange-500 transition-colors duration-500">
                Start a Conversation
              </button>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ─────────────────── */}
      <footer className="bg-[#1a1a1a] text-white pt-24 pb-12 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center"><PenTool className="w-4 h-4 text-white" /></div>
              <span className="font-light tracking-[0.15em] uppercase">Studio <span className="font-black text-orange-400">Versa</span></span>
            </div>
            <p className="text-sm text-white/30 leading-relaxed">Multidisciplinary creative studio for ambitious brands.</p>
          </div>
          {[
            { title: "Studio", links: ["Work", "Capabilities", "Awards", "Team"] },
            { title: "Connect", links: ["Contact", "Careers", "Press", "Newsletter"] },
            { title: "Social", links: ["Camera", "Behance", "Dribbble", "LinkedIn"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-400 mb-6">{col.title}</h4>
              <ul className="space-y-3 text-sm text-white/30">
                {col.links.map(l => <li key={l}><Link href="#" className="hover:text-white transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1200px] mx-auto pt-8 border-t border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/20 flex justify-between">
          <span>© 2026 STUDIO VERSA.</span>
          <span>DESIGN WITH INTENT.</span>
        </div>
      </footer>
    </div>
  )
}
