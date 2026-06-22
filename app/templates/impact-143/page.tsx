// @ts-nocheck
"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Sofa, ArrowRight, Menu, Star, Palette, Ruler, Eye, Lightbulb, Layers, ChevronRight, MapPin, Phone, Mail, CheckCircle2 } from "lucide-react"
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
  { title: "Villa Serena", type: "Residential", img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200", desc: "Minimalist coastal retreat with organic textures and panoramic ocean views." },
  { title: "Maison Noire", type: "Penthouse", img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1200", desc: "Dark luxury penthouse with travertine, brass accents, and bespoke furniture." },
  { title: "Bureau Lumière", type: "Commercial", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200", desc: "Biophilic office redesign for a tech company prioritizing employee wellbeing." },
]

const SERVICES = [
  { icon: Palette, title: "Concept & Mood", desc: "Material palettes, mood boards, and spatial concepts tailored to your lifestyle." },
  { icon: Ruler, title: "Space Planning", desc: "Functional layouts that flow naturally, maximizing light, movement, and comfort." },
  { icon: Lightbulb, title: "Lighting Design", desc: "Layered lighting schemes that transform atmosphere from morning to evening." },
  { icon: Layers, title: "Furniture Curation", desc: "Sourcing and commissioning bespoke pieces from artisan workshops worldwide." },
]

const TESTIMONIALS = [
  { text: "Atelier transformed our home into something that feels like us, but elevated. Every detail was considered.", author: "Victoria & James R.", project: "Villa Serena" },
  { text: "The attention to material quality is extraordinary. They source things you didn't know existed.", author: "Marc Dubois", project: "Maison Noire" },
  { text: "A masterful understanding of light and space. Our workspace redesign has drastically improved our team productivity and focus.", author: "Elena R.", project: "Bureau Lumière" },
]

export default function AtelierInteriorPage() {
  const [scrolled, setScrolled] = useState(false)
  const [contactSubmitted, setContactSubmitted] = useState(false)

  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "30%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#f5f0eb] text-[#2a2520] font-sans min-h-screen selection:bg-[#8b7355] selection:text-white overflow-x-hidden">

      {/* ── NAVBAR ─────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#f5f0eb]/90 backdrop-blur-xl border-b border-[#8b7355]/10 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="text-xl tracking-[0.2em] uppercase" style={{ fontFamily: "Georgia, serif" }}>
            <span className="font-light">Atelier</span> <span className="font-bold text-[#8b7355]">Interior</span>
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-[#2a2520]/40">
            {["Projects", "Services", "About", "Contact"].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(" ", "")}`} className="hover:text-[#8b7355] transition-colors">{l}</a>
            ))}
          </div>
          <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})} className="hidden md:block px-8 py-3 bg-[#2a2520] text-[#f5f0eb] text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[#8b7355] transition-colors duration-500">
            Book Consultation
          </button>
          <Sheet>
            <SheetTrigger asChild><button className="lg:hidden"><Menu className="w-6 h-6" /></button></SheetTrigger>
            <SheetContent side="right" className="bg-[#f5f0eb] p-12">
              <div className="flex flex-col gap-8 mt-16">
                {["Projects", "Services", "About", "Contact"].map(l => (
                  <a key={l} href={`#${l.toLowerCase().replace(" ", "")}`} className="text-3xl font-light hover:text-[#8b7355] transition-colors" style={{ fontFamily: "Georgia, serif" }}>{l}</a>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <main>
        {/* ── HERO ─────────────── */}
        <section id="hero" className="relative h-[110vh] min-h-[800px] flex items-end overflow-hidden">
          <motion.div style={{ y: heroY }} className="absolute inset-0">
            <Image src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2400" alt="Interior" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-[#f5f0eb] via-[#f5f0eb]/20 to-transparent" />
          </motion.div>
          <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-[1600px] w-full mx-auto px-6 md:px-12 pb-24">
            <Reveal>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] w-12 bg-[#8b7355]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8b7355]">Interior Design Studio</span>
              </div>
            </Reveal>
            <Reveal delay={0.15} y={70}>
              <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-light tracking-tighter leading-[0.85] mb-8" style={{ fontFamily: "Georgia, serif" }}>
                Spaces<br/>That <em className="text-[#8b7355]">Speak.</em>
              </h1>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="max-w-lg text-lg text-[#2a2520]/50 font-light leading-relaxed mb-8">
                Bespoke interior design for discerning clients. We create environments that elevate daily life into something extraordinary.
              </p>
              <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})} className="px-8 py-4 bg-[#2a2520] text-[#f5f0eb] text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#8b7355] transition-colors">
                Book Consultation
              </button>
            </Reveal>
          </motion.div>
        </section>

        {/* ── PROJECTS ─────────── */}
        <section id="projects" className="py-32 bg-[#f5f0eb]">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="mb-20">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8b7355] block mb-4">Portfolio</span>
                <h2 className="text-5xl md:text-7xl font-light tracking-tighter" style={{ fontFamily: "Georgia, serif" }}>
                  Selected <em className="text-[#8b7355]">Spaces.</em>
                </h2>
              </div>
            </Reveal>
            {PROJECTS.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className={`group grid grid-cols-1 lg:grid-cols-2 gap-12 items-center cursor-pointer ${i > 0 ? "mt-24" : ""}`}>
                  <div className={`relative aspect-[4/3] overflow-hidden rounded-sm ${i % 2 !== 0 ? "lg:order-2" : ""}`}>
                    <ParallaxImg src={p.img} alt={p.title} />
                  </div>
                  <div className={i % 2 !== 0 ? "lg:order-1" : ""}>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b7355] block mb-3">{p.type}</span>
                    <h3 className="text-4xl md:text-5xl font-light tracking-tighter mb-6 group-hover:text-[#8b7355] transition-colors" style={{ fontFamily: "Georgia, serif" }}>{p.title}</h3>
                    <p className="text-[#2a2520]/50 leading-relaxed mb-8">{p.desc}</p>
                    <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#8b7355]">
                      View Project <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── SERVICES ─────────── */}
        <section id="services" className="py-32 bg-[#2a2520] text-[#f5f0eb]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-24">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c4a882] block mb-4">What We Offer</span>
                <h2 className="text-5xl md:text-7xl font-light tracking-tighter" style={{ fontFamily: "Georgia, serif" }}>
                  Design <em className="text-[#c4a882]">Services.</em>
                </h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SERVICES.map((s, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="group p-10 bg-white/[0.03] border border-white/5 rounded-sm hover:border-[#c4a882]/30 transition-all duration-500">
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 rounded-full border border-[#c4a882]/20 flex items-center justify-center shrink-0 group-hover:bg-[#8b7355] group-hover:border-[#8b7355] transition-all duration-500">
                        <s.icon className="w-6 h-6 text-[#c4a882] group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "Georgia, serif" }}>{s.title}</h3>
                        <p className="text-sm text-[#f5f0eb]/40 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ────── */}
        <section className="py-32 bg-white">
          <div className="max-w-[1000px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-20">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8b7355] block mb-4">Client Words</span>
                <h2 className="text-5xl font-light tracking-tighter" style={{ fontFamily: "Georgia, serif" }}>
                  Kind <em className="text-[#8b7355]">Words.</em>
                </h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="p-8 bg-[#f5f0eb] rounded-sm border border-[#8b7355]/5">
                    <div className="flex gap-1 mb-6">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-[#8b7355] text-[#8b7355]" />
                      ))}
                    </div>
                    <p className="text-[#2a2520]/60 leading-relaxed mb-6 italic" style={{ fontFamily: "Georgia, serif" }}>"{t.text}"</p>
                    <div className="font-bold text-sm">{t.author}</div>
                    <div className="text-xs text-[#8b7355]">{t.project}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────── */}
        <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=2400" alt="CTA" fill className="object-cover" />
            <div className="absolute inset-0 bg-[#2a2520]/60" />
          </div>
          <div className="relative z-10 text-center text-[#f5f0eb] px-6">
            <Reveal>
              <h2 className="text-5xl md:text-7xl font-light tracking-tighter mb-6" style={{ fontFamily: "Georgia, serif" }}>
                Let's Create Your<br/><em className="text-[#c4a882]">Perfect Space.</em>
              </h2>
              <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})} className="px-12 py-5 bg-[#f5f0eb] text-[#2a2520] font-bold rounded-full hover:bg-[#8b7355] hover:text-white transition-all duration-500">
                Book a Consultation
              </button>
            </Reveal>
          </div>
        </section>

        {/* ── ABOUT ─────────── */}
        <section id="about" className="py-32 bg-[#faf6f0] border-t border-[#8b7355]/10">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <Reveal>
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                  <ParallaxImg src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200" alt="Atelier workspace" />
                </div>
              </Reveal>
              <div>
                <Reveal delay={0.2}>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8b7355] block mb-4">Our Philosophy</span>
                  <h2 className="text-4xl md:text-5xl font-light tracking-tighter mb-6" style={{ fontFamily: "Georgia, serif" }}>Crafting Space With <em className="text-[#8b7355]">Intention.</em></h2>
                  <p className="text-sm text-[#2a2520]/60 leading-relaxed mb-6">
                    At Atelier Interior, we believe your home should be a physical manifestation of your journey. Founded in Paris in 2018, we work closely with local artisans to curate bespoke, tactile environments.
                  </p>
                  <p className="text-sm text-[#2a2520]/60 leading-relaxed">
                    We select organic, sustainably sourced materials—travertine, brass, raw linen, and white oak—to construct spaces that age beautifully and feel deeply authentic.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACT ─────────── */}
        <section id="contact" className="py-32 bg-[#f5f0eb] border-t border-[#8b7355]/10">
          <div className="max-w-[800px] mx-auto px-6 text-center">
            <Reveal>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8b7355] block mb-4">Connect</span>
              <h2 className="text-5xl md:text-6xl font-light tracking-tighter mb-12" style={{ fontFamily: "Georgia, serif" }}>Begin Your <em className="text-[#8b7355]">Project.</em></h2>
            </Reveal>
            <Reveal delay={0.15}>
              {contactSubmitted ? (
                <div className="p-12 bg-white rounded-sm border border-[#8b7355]/20 shadow-sm flex flex-col items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-[#8b7355] mb-4" />
                  <p className="text-xl font-bold text-[#2a2520]">Merci, nous vous répondrons sous 24h.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setContactSubmitted(true); }} className="space-y-4 max-w-md mx-auto text-left">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-[#2a2520]/50 mb-2">Name</label>
                    <input required type="text" placeholder="Your Name" className="w-full px-5 py-3.5 bg-white border border-[#8b7355]/10 rounded-sm text-sm focus:outline-none focus:border-[#8b7355] transition-colors text-[#2a2520]" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-[#2a2520]/50 mb-2">Email</label>
                    <input required type="email" placeholder="you@example.com" className="w-full px-5 py-3.5 bg-white border border-[#8b7355]/10 rounded-sm text-sm focus:outline-none focus:border-[#8b7355] transition-colors text-[#2a2520]" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-[#2a2520]/50 mb-2">Message</label>
                    <textarea required rows={4} placeholder="Tell us about your space and timeline..." className="w-full px-5 py-3.5 bg-white border border-[#8b7355]/10 rounded-sm text-sm focus:outline-none focus:border-[#8b7355] transition-colors text-[#2a2520]" />
                  </div>
                  <button type="submit" className="w-full py-4 bg-[#2a2520] text-[#f5f0eb] font-bold rounded-sm hover:bg-[#8b7355] transition-colors duration-300">
                    Submit Inquiry
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="bg-[#2a2520] text-[#f5f0eb] pt-24 pb-12 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div>
            <span className="text-xl tracking-[0.2em] uppercase mb-6 block" style={{ fontFamily: "Georgia, serif" }}>Atelier <span className="font-bold text-[#c4a882]">Interior</span></span>
            <p className="text-sm text-[#f5f0eb]/30 leading-relaxed">Bespoke interiors crafted with intention and care.</p>
          </div>
          {[
            { title: "Studio", links: ["Projects", "Services", "About", "Contact"] },
            { title: "Connect", links: ["Instagram", "Pinterest", "LinkedIn"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c4a882] mb-6">{col.title}</h4>
              <ul className="space-y-3 text-sm text-[#f5f0eb]/30">
                {col.links.map(l => {
                  let href = "#";
                  if (l === "About") href = "#about";
                  if (l === "Contact") href = "#contact";
                  if (l === "Projects") href = "#projects";
                  if (l === "Services") href = "#services";
                  return <li key={l}><Link href={href} className="hover:text-[#f5f0eb] transition-colors">{l}</Link></li>;
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1200px] mx-auto pt-8 border-t border-[#f5f0eb]/10 text-[10px] font-bold uppercase tracking-widest text-[#f5f0eb]/20 flex flex-col sm:flex-row justify-between gap-4">
          <span>© 2026 ATELIER INTERIOR. PARIS · LONDON · MILAN</span>
          <div className="flex gap-6">
            <Link href="#contact" className="hover:text-[#f5f0eb] transition-colors">Mentions légales</Link>
            <Link href="#contact" className="hover:text-[#f5f0eb] transition-colors">Confidentialité</Link>
            <Link href="#contact" className="hover:text-[#f5f0eb] transition-colors">CGU</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
