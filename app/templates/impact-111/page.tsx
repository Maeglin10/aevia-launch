// @ts-nocheck
"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Ruler, ArrowRight, Menu, Star, MapPin, TreePine, Shovel, Layers, Mountain, ChevronRight, Globe, Wind } from "lucide-react"
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

const PROJECTS = [
  { title: "Stone House", location: "Mallorca, ES", year: "2024", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200" },
  { title: "Cedar Pavilion", location: "Vancouver, CA", year: "2023", img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200" },
  { title: "Clay Studio", location: "Oaxaca, MX", year: "2024", img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200" },
  { title: "Glass Retreat", location: "Hokkaido, JP", year: "2023", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" },
]

const PILLARS = [
  { icon: TreePine, title: "Biophilic Integration", desc: "Dissolving the boundaries between indoor living and the natural ecosystem." },
  { icon: Layers, title: "Honest Materials", desc: "Prioritizing raw timber, rammed earth, and local stone with zero toxic finishes." },
  { icon: Wind, title: "Passive Energy", desc: "Leveraging solar pathing and cross-ventilation to eliminate mechanical cooling." },
]

export default function TerraArchitecturePage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#f2f0eb] text-[#3d3a35] font-sans min-h-screen selection:bg-[#c4b5a2] selection:text-white overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${scrolled ? "bg-[#f2f0eb]/90 backdrop-blur-xl border-b border-[#3d3a35]/5 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-[#3d3a35] flex items-center justify-center group-hover:rotate-90 transition-transform duration-700">
              <Ruler className="w-5 h-5 text-[#f2f0eb]" />
            </div>
            <span className="text-xl font-bold tracking-[0.1em] uppercase">Terra <span className="font-light italic text-[#3d3a35]/60">Studio</span></span>
          </Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-[#3d3a35]/40">
            {["Work", "Philosophy", "Process", "Team"].map(l => (
              <Link key={l} href="#equipe" className="hover:text-[#3d3a35] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-[#3d3a35]/60 hover:text-[#3d3a35] transition-colors">Start a Project</button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-6 h-6 text-[#3d3a35]" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#f2f0eb] border-[#3d3a35]/5 p-12">
                <div className="flex flex-col gap-10 mt-16 text-left">
                  {["Projects", "Our Way", "Atelier", "Contact"].map(l => (
                    <Link key={l} href="#contact" className="text-3xl font-light uppercase tracking-widest hover:text-[#3d3a35] transition-colors">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ──────────────────── */}
        <section id="hero" className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <Reveal>
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-[1px] bg-[#3d3a35]/30" />
                     <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#3d3a35]/50">Sustainability First Architecture</span>
                  </div>
                </Reveal>
                <Reveal delay={0.1} y={60}>
                  <h1 className="text-7xl md:text-[8rem] font-light tracking-tighter leading-[0.85] mb-12 uppercase">
                    Rooted <br/> In <span className="italic text-[#c4b5a2] font-normal">Nature.</span>
                  </h1>
                </Reveal>
                <Reveal delay={0.3}>
                  <p className="text-xl text-[#3d3a35]/60 font-light max-w-lg leading-relaxed mb-12">
                    We design structures that don't just sit on the earth, but emerge from it. Minimalist, sustainable, and timeless architecture.
                  </p>
                </Reveal>
                <Reveal delay={0.4}>
                  <div className="flex flex-wrap gap-8">
                    <button className="px-12 py-5 bg-[#3d3a35] text-[#f2f0eb] font-bold rounded-full hover:px-14 transition-all duration-700">
                      View Projects
                    </button>
                    <button className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest group">
                       The Terra Way <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </Reveal>
              </div>
              
              <Reveal delay={0.5}>
                <div className="relative aspect-[4/5] bg-[#c4b5a2]/20 rounded-sm">
                   <ParallaxImg src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200" alt="Main Project" />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── PILLARS ───────────────── */}
        <section className="py-32 bg-[#e8e6e1] border-y border-[#3d3a35]/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
              {PILLARS.map((p, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="group">
                    <p.icon className="w-8 h-8 text-[#c4b5a2] mb-8 group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-bold mb-4 uppercase tracking-tighter">{p.title}</h3>
                    <p className="text-[#3d3a35]/50 leading-relaxed text-sm">{p.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROJECTS GRID ─────────── */}
        <section id="realisations" className="py-32 bg-[#f2f0eb]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
                <div className="max-w-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c4b5a2] block mb-4">Portfolio</span>
                  <h2 className="text-6xl md:text-8xl font-light uppercase tracking-tighter italic">Selected <br/> <span className="not-italic font-normal">Works.</span></h2>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#3d3a35]/40 mb-2">2020 — 2026</div>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {PROJECTS.map((p, i) => (
                <Reveal key={i} delay={i * 0.15}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[16/10] mb-8 overflow-hidden">
                      <ParallaxImg src={p.img} alt={p.title} />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700" />
                    </div>
                    <div className="flex justify-between items-start">
                       <div>
                          <h3 className="text-3xl font-bold mb-2 uppercase tracking-tight">{p.title}</h3>
                          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[#3d3a35]/40">
                             <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {p.location}</span>
                             <span>·</span>
                             <span>{p.year}</span>
                          </div>
                       </div>
                       <button className="w-12 h-12 rounded-full border border-[#3d3a35]/10 flex items-center justify-center group-hover:bg-[#3d3a35] group-hover:text-[#f2f0eb] transition-all duration-700">
                          <ArrowRight className="w-5 h-5" />
                       </button>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── QUOTE ─────────────────── */}
        <section id="contact" className="py-40 bg-[#3d3a35] text-[#f2f0eb] overflow-hidden relative">
          <div className="absolute top-0 right-0 opacity-5 -translate-y-1/2 translate-x-1/4">
             <Mountain className="w-[800px] h-[800px]" />
          </div>
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <Reveal>
              <h2 className="text-4xl md:text-6xl font-light italic leading-tight mb-12">
                "Architecture is the learned game, correct and magnificent, of forms assembled in the light."
              </h2>
              <div className="w-20 h-[1px] bg-[#c4b5a2] mx-auto mb-8" />
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c4b5a2]">The Terra Manifesto</p>
            </Reveal>
          </div>
        </section>

        {/* ── TEAM ──────────────────── */}
        <section id="equipe" className="py-40 bg-[#f2f0eb]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex items-end justify-between mb-20 border-b border-[#3d3a35]/10 pb-12 gap-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#3d3a35]/40 block mb-4">The Atelier</span>
                  <h2 className="text-5xl md:text-7xl font-light uppercase tracking-tighter text-[#3d3a35]">The <span className="italic">Team.</span></h2>
                </div>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: "Clara Thorn", role: "Principal Architect", exp: "18yr", spec: "Biophilic structures", tags: ["LEED", "RIBA Fellow"] },
                { name: "Samuel Osei", role: "Landscape Lead", exp: "12yr", spec: "Rewilding & restoration", tags: ["ASLA", "RHS"] },
                { name: "Vera Kessler", role: "Interior Systems", exp: "9yr", spec: "Material culture & craft", tags: ["Dezeen Award"] },
                { name: "Jin Park", role: "Structural Innovator", exp: "14yr", spec: "Mass timber & earth", tags: ["SE Certified", "CIBSE"] },
              ].map((m, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="group border border-[#3d3a35]/10 rounded-2xl p-8 hover:border-[#3d3a35]/30 transition-all duration-500 cursor-default">
                    <div className="w-16 h-16 rounded-full bg-[#3d3a35]/5 flex items-center justify-center mb-6 group-hover:bg-[#3d3a35] transition-colors duration-500">
                      <span className="text-xl font-light text-[#3d3a35] group-hover:text-[#f2f0eb] transition-colors" style={{ fontFamily: "serif" }}>{m.name.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-[#c4b5a2] mb-1">{m.exp} · {m.spec}</div>
                    <h3 className="text-xl font-bold text-[#3d3a35] mb-1">{m.name}</h3>
                    <p className="text-xs text-[#3d3a35]/40 uppercase tracking-wider mb-4">{m.role}</p>
                    <div className="flex flex-wrap gap-2">{m.tags.map(t => <span key={t} className="text-[8px] font-bold uppercase tracking-widest px-2 py-1 border border-[#3d3a35]/10 text-[#3d3a35]/30">{t}</span>)}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── RECOGNITION ───────────── */}
        <section id="tarifs" className="py-20 bg-[#3d3a35] border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex flex-wrap items-center justify-between gap-8">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c4b5a2]">Recognised by</span>
                <div className="flex flex-wrap gap-8">
                  {["Architectural Digest", "Dezeen 2024 Award", "RIBA National Award", "World Architecture Festival", "Prix Europa Nostra"].map(a => (
                    <span key={a} className="text-[10px] font-bold uppercase tracking-widest text-[#f2f0eb]/25 hover:text-[#c4b5a2] transition-colors cursor-default">{a}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-40 bg-[#f2f0eb] text-center px-6">
          <div className="max-w-3xl mx-auto">
            <Reveal>
              <h2 className="text-5xl md:text-8xl font-light uppercase tracking-tighter mb-12">Start Your <span className="italic">Legacy.</span></h2>
              <p className="text-xl text-[#3d3a35]/60 font-light mb-16 leading-relaxed">
                Whether it's a private retreat or a sustainable commercial hub, let's create a space that respects the past and preserves the future.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <button className="px-14 py-6 bg-[#3d3a35] text-[#f2f0eb] font-bold rounded-full hover:px-16 transition-all duration-700 shadow-2xl">
                  Request Consultation
                </button>
                <button className="px-14 py-6 border border-[#3d3a35]/20 text-[#3d3a35] font-bold rounded-full hover:bg-[#3d3a35] hover:text-[#f2f0eb] transition-all">
                  Join Our Atelier
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#f2f0eb] pt-24 pb-12 px-6 border-t border-[#3d3a35]/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-16 mb-24">
          <div className="md:col-span-2">
            <Link href="#hero" className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 bg-[#3d3a35] flex items-center justify-center">
                <Ruler className="w-5 h-5 text-[#f2f0eb]" />
              </div>
              <span className="text-xl font-bold tracking-[0.1em] uppercase">Terra <span className="font-light italic text-[#3d3a35]/60">Studio</span></span>
            </Link>
            <p className="text-[#3d3a35]/40 max-w-sm leading-relaxed mb-10 text-sm italic">
              "We believe in architecture that breathes with the world, using the elements of earth to build the dreams of man."
            </p>
            <div className="flex gap-8">
               {["Camera", "Bookmark", "Journal", "WeWork"].map(s => (
                 <Link key={s} href="#hero" className="text-[10px] font-bold uppercase tracking-widest text-[#3d3a35]/30 hover:text-[#3d3a35] transition-colors">{s}</Link>
               ))}
            </div>
          </div>
          
          {[
            { t: "Studio", l: ["Selected Work", "Atelier", "Team", "Journal"] },
            { t: "Focus", l: ["Sustainability", "Materials", "Passive Design", "Consulting"] },
            { t: "Legal", l: ["Privacy", "Terms", "Impressum"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#3d3a35] mb-10">{col.t}</h4>
              <ul className="space-y-6">
                {col.l.map(link => <li key={link}><Link href="#equipe" className="text-xs text-[#3d3a35]/50 hover:text-[#3d3a35] transition-colors">{link}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-[1400px] mx-auto pt-12 border-t border-[#3d3a35]/5 flex flex-col md:row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[#3d3a35]/30">
          <span>© 2026 TERRA ARCHITECTURE STUDIO. BUILT WITH EARTH.</span>
          <div className="flex gap-10">
             <Link href="#contact" className="hover:text-[#3d3a35] transition-colors flex items-center gap-2"><Globe className="w-3 h-3" /> BASED IN COPENHAGEN</Link>
             <Link href="#contact" className="hover:text-[#3d3a35] transition-colors flex items-center gap-2"><MapPin className="w-3 h-3" /> PARIS · TOKYO</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
