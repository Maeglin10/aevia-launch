// @ts-nocheck
"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Home, ArrowRight, Menu, Star, MapPin, Bed, Bath, Maximize2, Phone, Mail, Building, Award, ChevronRight, Heart, DollarSign } from "lucide-react"
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

const PROPERTIES = [
  { title: "The Belvedere Penthouse", location: "Upper East Side, NY", price: "$12.5M", beds: 5, baths: 4, sqft: "6,200", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200", tag: "Exclusive" },
  { title: "Château des Vignes", location: "Provence, France", price: "€8.9M", beds: 7, baths: 5, sqft: "9,400", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200", tag: "New Listing" },
  { title: "Marina Bay Residence", location: "Singapore", price: "S$18.2M", beds: 4, baths: 3, sqft: "4,800", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200", tag: "Penthouse" },
  { title: "Hampstead Manor", location: "London, UK", price: "£14.7M", beds: 8, baths: 6, sqft: "11,200", img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200", tag: "Heritage" },
]

const SERVICES = [
  { icon: Building, title: "Acquisition Advisory", desc: "End-to-end guidance from search to closing on residential and commercial assets." },
  { icon: DollarSign, title: "Investment Strategy", desc: "Portfolio construction for ultra-high-net-worth individuals seeking trophy real estate." },
  { icon: Award, title: "Off-Market Access", desc: "Exclusive pre-market listings and pocket deals from our global broker network." },
]

export default function HavenEstatesPage() {
  const [scrolled, setScrolled] = useState(false)

  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "30%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#faf9f6] text-[#1a1a1a] font-sans min-h-screen selection:bg-[#b8860b] selection:text-white overflow-x-hidden">

      {/* ── NAVBAR ────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#faf9f6]/90 backdrop-blur-xl border-b border-[#b8860b]/10 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="#hero" className="flex items-center gap-3">
            <Home className="w-5 h-5 text-[#b8860b]" />
            <span className="text-xl font-light tracking-[0.15em] uppercase" style={{ fontFamily: "Georgia, serif" }}>Haven <span className="font-bold text-[#b8860b]">Estates</span></span>
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-[#1a1a1a]/40">
            {["Properties", "Services", "About", "Journal"].map(l => (
              <Link key={l} href="#services" className="hover:text-[#b8860b] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <button className="hidden md:block px-8 py-3 bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[#b8860b] transition-colors duration-500">
              Private Inquiry
            </button>
            <Sheet>
              <SheetTrigger className="lg:hidden"><Menu className="w-6 h-6" /></SheetTrigger>
              <SheetContent side="right" className="bg-[#faf9f6] p-12">
                <div className="flex flex-col gap-8 mt-16">
                  {["Properties", "Services", "About", "Contact"].map(l => (
                    <Link key={l} href="#services" className="text-3xl font-light hover:text-[#b8860b] transition-colors" style={{ fontFamily: "Georgia, serif" }}>{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ────────────────────────── */}
        <section id="hero" className="relative h-[110vh] min-h-[800px] flex items-end overflow-hidden">
          <motion.div style={{ y: heroY }} className="absolute inset-0">
            <Image src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2400" alt="Estate" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f6] via-[#faf9f6]/20 to-transparent" />
          </motion.div>

          <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-[1600px] w-full mx-auto px-6 md:px-12 pb-24">
            <Reveal>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] w-12 bg-[#b8860b]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#b8860b]">Luxury Real Estate — Global Portfolio</span>
              </div>
            </Reveal>
            <Reveal delay={0.15} y={70}>
              <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-light tracking-tighter leading-[0.85] mb-8" style={{ fontFamily: "Georgia, serif" }}>
                Exceptional<br/><em className="text-[#b8860b]">Residences.</em>
              </h1>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="max-w-lg text-lg text-[#1a1a1a]/50 font-light leading-relaxed">
                Curated trophy properties for discerning clients worldwide. Off-market access. Discretion guaranteed.
              </p>
            </Reveal>
          </motion.div>
        </section>

        {/* ── PROPERTIES ────────────────────── */}
        <section className="py-32 bg-[#faf9f6]">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex justify-between items-end mb-20">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#b8860b] block mb-4">Current Portfolio</span>
                  <h2 className="text-5xl md:text-7xl font-light tracking-tighter" style={{ fontFamily: "Georgia, serif" }}>
                    Featured <em className="text-[#b8860b]">Listings.</em>
                  </h2>
                </div>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {PROPERTIES.map((p, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-sm mb-6">
                      <ParallaxImg src={p.img} alt={p.title} />
                      <div className="absolute top-6 left-6 flex gap-2">
                        <span className="px-3 py-1 bg-[#b8860b] text-white text-[10px] font-bold uppercase tracking-widest rounded-full">{p.tag}</span>
                      </div>
                      <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart className="w-4 h-4 text-[#1a1a1a]" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="flex gap-6 text-white/80 text-xs font-bold">
                          <span className="flex items-center gap-1"><Bed className="w-3 h-3" /> {p.beds} Beds</span>
                          <span className="flex items-center gap-1"><Bath className="w-3 h-3" /> {p.baths} Baths</span>
                          <span className="flex items-center gap-1"><Maximize2 className="w-3 h-3" /> {p.sqft} sqft</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold group-hover:text-[#b8860b] transition-colors mb-1" style={{ fontFamily: "Georgia, serif" }}>{p.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-[#1a1a1a]/40"><MapPin className="w-3 h-3" /> {p.location}</div>
                      </div>
                      <div className="text-xl font-bold text-[#b8860b]">{p.price}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── SERVICES ────────────────────── */}
        <section id="services" className="py-32 bg-[#1a1a1a] text-white">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-24">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#b8860b] block mb-4">Advisory</span>
                <h2 className="text-5xl md:text-7xl font-light tracking-tighter" style={{ fontFamily: "Georgia, serif" }}>
                  Private <em className="text-[#b8860b]">Services.</em>
                </h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {SERVICES.map((s, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="text-center group p-8">
                    <div className="w-16 h-16 rounded-full border border-[#b8860b]/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#b8860b] group-hover:border-[#b8860b] transition-all duration-500">
                      <s.icon className="w-6 h-6 text-[#b8860b] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold mb-3" style={{ fontFamily: "Georgia, serif" }}>{s.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ──────────────────── */}
        <section id="realisations" className="py-32 bg-[#faf9f6]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-20">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#b8860b] block mb-4">Client Voices</span>
                <h2 className="text-5xl md:text-6xl font-light tracking-tighter" style={{ fontFamily: "Georgia, serif" }}>
                  Trusted by the <em className="text-[#b8860b]">World&apos;s Best.</em>
                </h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { quote: "Haven Estates found our Hampstead estate entirely off-market. Their discretion and global network are simply unmatched.", name: "Lord A. Thornton", role: "London · Private Estate" },
                { quote: "The team navigated our Singapore acquisition with extraordinary professionalism. We closed in under three weeks.", name: "S. Nakamura", role: "Singapore · Penthouse" },
                { quote: "Three continents, one advisor. Haven managed our entire portfolio consolidation seamlessly and discreetly.", name: "E. Volkov", role: "Geneva · Multi-Property" },
              ].map((t, i) => (
                <Reveal key={i} delay={i * 0.12}>
                  <div className="p-10 border border-[#b8860b]/10 rounded-sm flex flex-col gap-6 h-full">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#b8860b] text-[#b8860b]" />)}
                    </div>
                    <p className="text-[#1a1a1a]/60 font-light leading-relaxed italic flex-1" style={{ fontFamily: "Georgia, serif" }}>&ldquo;{t.quote}&rdquo;</p>
                    <div className="pt-6 border-t border-[#b8860b]/10">
                      <div className="font-bold text-sm" style={{ fontFamily: "Georgia, serif" }}>{t.name}</div>
                      <div className="text-xs text-[#1a1a1a]/40 tracking-widest uppercase mt-1">{t.role}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY HAVEN ─────────────────────── */}
        <section className="py-32 bg-[#1a1a1a] text-white">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <Reveal>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#b8860b] block mb-4">Our Difference</span>
                <h2 className="text-5xl md:text-6xl font-light tracking-tighter mb-8" style={{ fontFamily: "Georgia, serif" }}>
                  The Haven <em className="text-[#b8860b]">Advantage.</em>
                </h2>
                <p className="text-lg text-white/40 font-light leading-relaxed max-w-md">
                  Founded by former principals at Sotheby&apos;s Realty and Christie&apos;s International, Haven Estates brings institutional expertise to private hands — with complete discretion.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="grid grid-cols-2 gap-px bg-[#b8860b]/10">
                  {[
                    { v: "$4.2B+", l: "In Transactions" },
                    { v: "280+", l: "Trophy Properties" },
                    { v: "38", l: "Countries Served" },
                    { v: "18yr", l: "Advisory Record" },
                  ].map((s, i) => (
                    <div key={i} className="bg-[#1a1a1a] p-10 text-center">
                      <div className="text-3xl font-black text-[#b8860b] mb-2" style={{ fontFamily: "Georgia, serif" }}>{s.v}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-white/20">{s.l}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────── */}
        <section id="contact" className="relative h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=2400" alt="CTA" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="relative z-10 text-center text-white px-6">
            <Reveal>
              <h2 className="text-5xl md:text-7xl font-light tracking-tighter mb-6" style={{ fontFamily: "Georgia, serif" }}>
                Find Your<br/><em className="text-[#b8860b]">Haven.</em>
              </h2>
              <button className="px-12 py-5 bg-white text-[#1a1a1a] font-bold rounded-full hover:bg-[#b8860b] hover:text-white transition-all duration-500">
                Schedule Private Viewing
              </button>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────────────── */}
      <footer className="bg-[#1a1a1a] text-white pt-24 pb-12 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Home className="w-5 h-5 text-[#b8860b]" />
              <span className="text-xl font-light tracking-[0.15em] uppercase" style={{ fontFamily: "Georgia, serif" }}>Haven <span className="font-bold text-[#b8860b]">Estates</span></span>
            </div>
            <p className="text-sm text-white/30 leading-relaxed">Discreet luxury real estate advisory for the world's most exceptional properties.</p>
          </div>
          {[
            { title: "Properties", links: ["New York", "London", "Paris", "Singapore"] },
            { title: "Services", links: ["Acquisition", "Investment", "Off-Market", "Valuation"] },
            { title: "Company", links: ["About", "Team", "Press", "Contact"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#b8860b] mb-6">{col.title}</h4>
              <ul className="space-y-3 text-sm text-white/30">
                {col.links.map(l => <li key={l}><Link href={col.title === "Properties" ? "#realisations" : col.title === "Services" ? "#services" : l === "About" ? "#hero" : "#contact"} className="hover:text-white transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1400px] mx-auto pt-8 border-t border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/20 flex justify-between">
          <span>© 2026 HAVEN ESTATES.</span>
          <span>NEW YORK · LONDON · PARIS · SINGAPORE</span>
        </div>
      </footer>
    </div>
  )
}
