"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Scale, ArrowRight, Menu, Star, Shield, Gavel, Briefcase, Globe, Award, ChevronRight, PenTool, BookOpen } from "lucide-react"
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
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"])
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden rounded-sm">
      <motion.div style={{ y }} className="absolute inset-[-15%] w-[130%] h-[130%]">
        <Image src={src} alt={alt} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
      </motion.div>
    </div>
  )
}

export default function OnyxLawPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#080808] text-[#c0c0c0] font-sans min-h-screen selection:bg-[#c9a96e] selection:text-black overflow-x-hidden">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${scrolled ? "bg-black/95 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-10"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 border border-[#c9a96e]/40 flex items-center justify-center group-hover:border-[#c9a96e] transition-all duration-700">
              <Scale className="w-5 h-5 text-[#c9a96e]" />
            </div>
            <span className="text-xl font-light tracking-[0.3em] uppercase text-white">Onyx <span className="font-bold">Law</span></span>
          </Link>
          <div className="hidden lg:flex gap-12 text-[10px] font-bold uppercase tracking-[0.5em] text-white/30">
            {["Practice", "Cases", "Advisors", "Legacy"].map(l => (
              <Link key={l} href="#" className="hover:text-[#c9a96e] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors underline underline-offset-8 decoration-[#c9a96e]/20">Client Access</button>
            <button className="px-10 py-3.5 border border-[#c9a96e]/40 text-[#c9a96e] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#c9a96e] hover:text-black transition-all duration-700">Inquire</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden p-2"><Menu className="w-6 h-6 text-white" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-black border-white/5 p-12 text-white">
                <div className="flex flex-col gap-10 mt-16 text-left">
                  {["Practice", "Insights", "Company", "Book"].map(l => (
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
             <Image src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2400" alt="Law Office" fill className="object-cover opacity-20 scale-105" priority />
             <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
            <Reveal>
              <div className="flex items-center justify-center gap-8 mb-16 opacity-30">
                 <div className="w-16 h-[1px] bg-[#c9a96e]" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white">The Standard of Litigation</span>
                 <div className="w-16 h-[1px] bg-[#c9a96e]" />
              </div>
            </Reveal>
            <Reveal delay={0.2} y={70}>
              <h1 className="text-7xl md:text-[10rem] font-light tracking-tighter leading-[0.8] text-white mb-16 uppercase" style={{ fontFamily: "serif" }}>
                Power <br/> <span className="italic">Protected.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-col items-center justify-center gap-16">
                <p className="text-2xl text-white/40 font-light max-w-2xl leading-relaxed italic">
                  Defending global enterprise and high-net-worth interests through surgical legal precision and unshakeable resolve.
                </p>
                <div className="flex flex-wrap justify-center gap-12">
                  <button className="px-16 py-6 bg-[#c9a96e] text-black font-bold uppercase tracking-widest text-[10px] hover:px-20 transition-all duration-700">
                    Request Strategic Brief
                  </button>
                  <button className="px-16 py-6 border border-white/10 text-white/40 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-all flex items-center gap-4">
                    <Award className="w-4 h-4 text-[#c9a96e]" /> View Global Record
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
          
          <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end text-[9px] font-bold uppercase tracking-[0.4em] text-white/10 italic">
            <span>OFFICES: LONDON / ZUG / NEW YORK / SINGAPORE</span>
            <span>EST. 1974</span>
          </div>
        </section>

        {/* ── PRACTICE ──────────────── */}
        <section className="py-40 bg-[#080808]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex flex-col lg:flex-row items-end justify-between mb-32 gap-8 border-b border-white/5 pb-16">
                <div className="max-w-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c9a96e] block mb-6">Sectors of Excellence</span>
                  <h2 className="text-6xl md:text-[9vw] font-light uppercase tracking-tighter text-white leading-none" style={{ fontFamily: "serif" }}>Surgical <br/> <span className="italic font-bold opacity-30">Defense.</span></h2>
                </div>
                <Link href="#" className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest hover:text-[#c9a96e] text-white/30 transition-colors group italic">
                  Full Practice List <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-white/5">
              {[
                { icon: Gavel, t: "Complex Litigation", d: "High-stakes trial advocacy for international corporate disputes and asset recovery." },
                { icon: Briefcase, t: "M&A Strategy", d: "Surgical execution of multi-jurisdictional acquisitions and structural divestment." },
                { icon: Shield, t: "Crisis Response", d: "Immediate, high-bandwidth intervention for reputational and structural threats." }
              ].map((item, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className={`p-20 flex flex-col h-full border-white/5 group hover:bg-white/[0.02] transition-all duration-700 ${i < 2 ? "lg:border-r" : ""}`}>
                    <div className="w-16 h-16 border border-[#c9a96e]/20 flex items-center justify-center mb-16 group-hover:bg-[#c9a96e] group-hover:text-black transition-all duration-700">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-white/20 mb-4 italic">Branch 0{i+1}</div>
                    <h3 className="text-3xl font-bold uppercase mb-8 tracking-widest text-white">{item.t}</h3>
                    <p className="text-white/30 leading-relaxed text-sm font-light mb-12 italic">{item.d}</p>
                    <Link href="#" className="mt-auto flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest group-hover:gap-8 transition-all hover:text-[#c9a96e]">
                       Consult Advisor <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── THE RECORD ────────────── */}
        <section className="py-60 bg-black relative border-y border-white/5">
           <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                 <Reveal>
                    <div className="aspect-square relative grayscale group overflow-hidden">
                       <ParallaxImg src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=1200" alt="Legal Library" />
                       <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-1000" />
                    </div>
                 </Reveal>
                 <div>
                    <Reveal>
                       <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c9a96e] block mb-12">The Track Record</span>
                       <h2 className="text-6xl md:text-8xl font-light uppercase tracking-tighter text-white leading-tight mb-16 italic" style={{ fontFamily: "serif" }}>Absolute <br/> <span className="not-italic font-bold opacity-30">Precedent.</span></h2>
                       <div className="space-y-16">
                          {[
                            { v: "$4.2B", l: "TOTAL ASSETS RECOVERED", d: "Across 42 international jurisdictions over the last decade." },
                            { v: "98%", l: "TRIAL SUCCESS RATE", d: "Dedicated to the absolute resolution of complex commercial conflict." }
                          ].map((stat, i) => (
                            <div key={i} className="flex gap-12 group">
                               <div className="text-5xl font-bold text-[#c9a96e] italic shrink-0 w-32">{stat.v}</div>
                               <div>
                                  <h4 className="text-xs font-black uppercase tracking-widest mb-4 text-white/40">{stat.l}</h4>
                                  <p className="text-sm font-light leading-relaxed text-white/20 italic">{stat.d}</p>
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
        <section className="py-60 bg-[#c9a96e] text-black text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-black rotate-12" />
          </div>
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <Reveal>
              <h2 className="text-7xl md:text-[14vw] font-light uppercase tracking-tighter leading-[0.8] mb-16 italic" style={{ fontFamily: "serif" }}>
                Begin Your <br/> <span className="font-bold not-italic opacity-20">Advocacy.</span>
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                <button className="px-20 py-8 bg-black text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:px-24 transition-all duration-700 italic">
                   Request Private Consultation
                </button>
                <button className="px-20 py-8 border-2 border-black text-black font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-black hover:text-white transition-all duration-700 italic">
                   View Client Portal
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-[#080808] pt-32 pb-12 px-6 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-20 mb-40">
           <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-4 mb-10 group">
                <div className="w-10 h-10 border border-[#c9a96e]/40 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-[#c9a96e]" />
                </div>
                <span className="text-xl font-light tracking-[0.3em] uppercase text-white">Onyx Law</span>
              </Link>
              <p className="text-white/20 max-w-sm leading-relaxed mb-12 text-sm font-light italic">
                 "Power requires a defense that is as absolute as its exercise. We are the guardians of legacy."
              </p>
              <div className="flex gap-10">
                 {["LinkedIn", "Journal", "Whitepapers", "Contact"].map(s => (
                   <Link key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-[#c9a96e] transition-colors italic">{s}</Link>
                 ))}
              </div>
           </div>
           
           {[
             { t: "PRACTICE", l: ["Litigation", "M&A", "Cyber-Legal", "Private Wealth"] },
             { t: "ADVISORS", l: ["The Partners", "Our Legacy", "Locations", "Journal"] },
             { t: "ENTITY", l: ["Terms", "Privacy", "Security Hub", "SLA"] }
           ].map((col, i) => (
             <div key={i} className="space-y-12">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/20">{col.t}</h4>
                <ul className="space-y-6">
                   {col.l.map(link => (
                     <li key={link} className="text-xs font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors italic">
                        <Link href="#">{link}</Link>
                     </li>
                   ))}
                </ul>
             </div>
           ))}
        </div>
        <div className="max-w-[1400px] mx-auto flex flex-col md:row justify-between items-center gap-8 border-t border-white/5 pt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/10 italic">
           <span>© 2026 ONYX LAW GLOBAL ADVISORS AG. ALL RIGHTS RESERVED.</span>
           <div className="flex gap-12">
              <Link href="#" className="hover:text-white transition-all">SLA: VERIFIED</Link>
              <Link href="#" className="hover:text-white transition-all">GLOBAL_REACH: NOMINAL</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}