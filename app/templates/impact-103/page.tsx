"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Scale, ArrowRight, Menu, Star, Shield, Gavel, Briefcase, Landmark, Globe, ChevronRight, Quote, FileText } from "lucide-react"
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
    <div ref={ref} className="relative w-full h-full overflow-hidden rounded-sm">
      <motion.div style={{ y }} className="absolute inset-[-15%] w-[130%] h-[130%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

const EXPERTISE = [
  { icon: Gavel, title: "High-Stakes Litigation", desc: "Aggressive representation in complex civil and criminal proceedings with a track record of landmark victories." },
  { icon: Briefcase, title: "Strategic M&A", desc: "Navigating multi-billion dollar transactions with surgical precision and cross-border expertise." },
  { icon: Landmark, title: "Regulatory Affairs", desc: "Shaping the landscape of tomorrow through deep-level engagement with legislative and regulatory bodies." },
]

const PARTNERS = [
  { name: "Julian Thorne", role: "Managing Partner", focus: "Global Litigation", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" },
  { name: "Elena Rossi", role: "Senior Partner", focus: "M&A / Private Equity", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" },
  { name: "Marcus Vane", role: "Senior Partner", focus: "International Law", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800" },
]

export default function LuminaLawPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#fafafa] text-[#1a1a1a] font-sans min-h-screen selection:bg-[#1a365d] selection:text-white overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-white/95 backdrop-blur-xl border-b border-black/5 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#1a365d] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tighter text-[#1a365d]">Lumina<span className="font-light">Law</span></span>
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
            {["Expertise", "Partners", "Insights", "Case Studies"].map(l => (
              <Link key={l} href="#" className="hover:text-[#1a365d] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:block px-6 py-2.5 text-black/40 text-[10px] font-bold uppercase tracking-widest hover:text-black transition-colors">Client Portal</button>
            <button className="px-8 py-3 bg-[#1a365d] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-[#2c5282] transition-all duration-500">Consultation</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden"><Menu className="w-6 h-6 text-black" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-white border-black/5 p-12 text-black">
                <div className="flex flex-col gap-8 mt-16 text-left">
                  {["Expertise", "Partners", "Insights", "Contact"].map(l => (
                    <Link key={l} href="#" className="text-3xl font-bold tracking-tighter hover:text-[#1a365d] transition-colors">{l}</Link>
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
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <Reveal>
                  <div className="inline-flex items-center gap-4 mb-10">
                     <div className="w-12 h-[2px] bg-[#1a365d]" />
                     <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#1a365d]">Elite Legal Counsel</span>
                  </div>
                </Reveal>
                <Reveal delay={0.1} y={60}>
                  <h1 className="text-7xl md:text-[9rem] font-bold tracking-tighter leading-[0.8] text-[#1a1a1a] mb-12 uppercase" style={{ fontFamily: "serif" }}>
                    Power <br/> <span className="text-[#1a365d] font-light italic italic-none">In Truth.</span>
                  </h1>
                </Reveal>
                <Reveal delay={0.3}>
                  <p className="text-xl text-black/60 font-light max-w-lg leading-relaxed mb-12">
                    Lumina Law is a high-stakes firm dedicated to complex litigation and corporate strategy. When the outcome defines your legacy, we are the standard.
                  </p>
                </Reveal>
                <Reveal delay={0.4}>
                  <div className="flex flex-col sm:flex-row gap-8">
                    <button className="px-12 py-5 bg-[#1a365d] text-white font-bold uppercase tracking-widest text-[10px] hover:bg-black transition-all duration-700">
                       Meet The Partners
                    </button>
                    <button className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest group">
                       Our Success Map <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </Reveal>
              </div>
              
              <Reveal delay={0.5} y={0}>
                 <div className="relative">
                    <div className="absolute -inset-10 bg-[#1a365d]/5 blur-[100px] rounded-full" />
                    <div className="relative aspect-[4/5] bg-white border border-black/5 p-3 rounded-sm shadow-2xl">
                       <ParallaxImg src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" alt="Law Office" />
                       <div className="absolute bottom-10 left-10 p-10 bg-white border border-black/5 w-72 hidden md:block shadow-xl">
                          <Quote className="w-8 h-8 mb-6 text-[#1a365d]/20" />
                          <p className="text-sm italic font-light leading-relaxed mb-4" style={{ fontFamily: "serif" }}>"Integrity is the only foundation upon which true victory can be built."</p>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-[#1a365d]">Julian Thorne — Founding Partner</div>
                       </div>
                    </div>
                 </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── EXPERTISE ─────────────── */}
        <section className="py-40 bg-white border-y border-black/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-32">
                 <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#1a365d] block mb-6">Our Dominance</span>
                 <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter" style={{ fontFamily: "serif" }}>Practice <span className="font-light italic">Areas.</span></h2>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {EXPERTISE.map((e, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="p-12 bg-[#fafafa] border border-black/5 hover:border-[#1a365d]/20 transition-all duration-700 group h-full">
                    <div className="w-16 h-16 bg-white border border-black/5 flex items-center justify-center mb-10 group-hover:bg-[#1a365d] transition-all duration-700">
                      <e.icon className="w-6 h-6 text-[#1a365d] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold mb-6 uppercase tracking-tight" style={{ fontFamily: "serif" }}>{e.title}</h3>
                    <p className="text-black/40 leading-relaxed text-sm font-light mb-10">{e.desc}</p>
                    <Link href="#" className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[#1a365d] group-hover:gap-6 transition-all">
                       Learn More <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PARTNERS ──────────────── */}
        <section className="py-40 bg-[#fafafa]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex flex-col lg:flex-row items-end justify-between mb-32 gap-8 border-b border-black/5 pb-12">
                <div className="max-w-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#1a365d] block mb-4">Leadership</span>
                  <h2 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter text-[#1a1a1a]" style={{ fontFamily: "serif" }}>The <span className="italic font-light">Partners.</span></h2>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-black/20 mb-2">120+ Years of Combined Experience</div>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {PARTNERS.map((p, i) => (
                <Reveal key={i} delay={i * 0.2}>
                  <div className="group">
                    <div className="relative aspect-[4/5] mb-10 grayscale hover:grayscale-0 transition-all duration-1000 overflow-hidden">
                      <Image src={p.img} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a365d]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-center">
                       <h3 className="text-3xl font-bold uppercase tracking-tight mb-2" style={{ fontFamily: "serif" }}>{p.name}</h3>
                       <div className="text-[10px] font-bold uppercase tracking-widest text-[#1a365d] mb-4">{p.role}</div>
                       <p className="text-sm text-black/40 font-light italic">{p.focus}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS / PHILOSOPHY ────── */}
        <section className="py-40 bg-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-1/3 h-full bg-[#1a365d]/5 -skew-x-12 translate-x-1/4" />
           <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                 <div>
                    <Reveal>
                       <h2 className="text-5xl md:text-7xl font-bold uppercase text-[#1a1a1a] mb-16" style={{ fontFamily: "serif" }}>A Legacy <br/> Of <span className="italic font-light text-[#1a365d]">Excellence.</span></h2>
                       <div className="space-y-12">
                          {[
                            { v: "$40B+", l: "Transaction Volume Handled", d: "Expertise in large-scale corporate consolidation and global capital flows." },
                            { v: "98%", l: "Trial Success Rate", d: "Preparation is our strongest weapon. We never step into a courtroom we haven't already mastered." },
                            { v: "14", l: "Global Jurisdictions", d: "A truly international reach with local expertise in key financial hubs." }
                          ].map((s, idx) => (
                            <div key={idx} className="flex gap-10">
                               <div className="text-5xl font-bold text-[#1a365d] shrink-0 w-32">{s.v}</div>
                               <div>
                                  <h4 className="text-sm font-bold uppercase tracking-widest mb-2">{s.l}</h4>
                                  <p className="text-sm text-black/40 font-light leading-relaxed">{s.d}</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </Reveal>
                 </div>
                 <Reveal delay={0.3}>
                    <div className="aspect-[4/5] relative border border-black/5 p-4 bg-[#fafafa]">
                       <ParallaxImg src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200" alt="Legal Gavel" />
                       <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#1a365d] flex items-center justify-center text-white p-8 text-center rounded-sm shadow-2xl">
                          <div className="text-[9px] font-bold uppercase tracking-[0.3em]">Established 1984</div>
                       </div>
                    </div>
                 </Reveal>
              </div>
           </div>
        </section>

        {/* ── CTA ───────────────────── */}
        <section className="py-40 bg-[#1a365d] text-white text-center">
          <div className="max-w-4xl mx-auto px-6">
            <Reveal>
              <h2 className="text-6xl md:text-9xl font-bold uppercase tracking-tighter leading-[0.8] mb-12" style={{ fontFamily: "serif" }}>
                Define Your <br/> <span className="italic font-light text-white/60">Defense.</span>
              </h2>
              <p className="text-xl text-white/60 font-light mb-16 leading-relaxed">
                Contact our intake team for a strictly confidential consultation. We handle the complexities so you can focus on your legacy.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <button className="px-16 py-6 bg-white text-[#1a365d] font-bold uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all duration-700 shadow-2xl">
                   Request Initial Brief
                </button>
                <button className="px-16 py-6 border border-white/20 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all">
                   Global Offices
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-white pt-32 pb-12 px-6 border-t border-black/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-16 mb-32">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-[#1a365d] flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tighter text-[#1a365d]">Lumina<span className="font-light">Law</span></span>
            </Link>
            <p className="text-black/30 max-w-sm leading-relaxed mb-10 text-sm font-light italic" style={{ fontFamily: "serif" }}>
              "The law is a shield for the righteous and a sword for the strategic. We provide both."
            </p>
            <div className="flex gap-10">
               {["LinkedIn", "Journal", "Archive", "Contact"].map(s => (
                 <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-black/30 hover:text-[#1a365d] transition-colors">{s}</Link>
               ))}
            </div>
          </div>
          
          {[
            { t: "The Firm", l: ["Our History", "Expertise", "Partners", "Culture"] },
            { t: "Expertise", l: ["Litigation", "Corporate", "M&A", "Real Estate"] },
            { t: "Resources", l: ["Insights", "Case Studies", "Press", "Alumni"] },
          ].map((col, i) => (
            <div key={i} className="space-y-10">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#1a365d]">{col.t}</h4>
              <ul className="space-y-6">
                {col.l.map(link => <li key={link}><Link href="#" className="text-xs text-black/30 hover:text-black transition-colors">{link}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-[1400px] mx-auto pt-12 border-t border-black/5 flex flex-col md:row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-black/10">
          <span>© 2026 LUMINA LAW GLOBAL PARTNERSHIP. STRENGTH IN TRUTH.</span>
          <div className="flex gap-12">
             <Link href="#" className="hover:text-black transition-colors flex items-center gap-2"><Globe className="w-3 h-3" /> LONDON · NEW YORK · SINGAPORE</Link>
             <Link href="#" className="hover:text-black transition-colors flex items-center gap-2"><FileText className="w-3 h-3" /> LEGAL TERMS</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
