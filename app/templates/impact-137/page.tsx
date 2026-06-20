// @ts-nocheck
"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Coffee, Leaf, MapPin, Star, ArrowRight, Menu, Thermometer, Droplets, Mountain, Award, ChevronRight } from "lucide-react"
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

const ORIGINS = [
  { name: "Ethiopian Yirgacheffe", region: "Sidamo, Ethiopia", altitude: "1,800m", process: "Washed", notes: "Jasmine, bergamot, stone fruit", img: "https://picsum.photos/seed/coffee/800/800", score: 92 },
  { name: "Colombian Huila", region: "Huila, Colombia", altitude: "1,650m", process: "Honey", notes: "Chocolate, caramel, citrus", img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800", score: 89 },
  { name: "Kenyan Nyeri AA", region: "Nyeri, Kenya", altitude: "1,700m", process: "Washed", notes: "Blackcurrant, tomato, wine", img: "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?auto=format&fit=crop&q=80&w=800", score: 91 },
  { name: "Guatemala Antigua", region: "Antigua, Guatemala", altitude: "1,500m", process: "Natural", notes: "Dark chocolate, spice, smoke", img: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=800", score: 88 },
]

const PROCESS = [
  { step: "01", title: "Source", desc: "Direct trade with fourth-generation farming families across 14 origins.", icon: Mountain },
  { step: "02", title: "Roast", desc: "Precision-profiled in small 12kg batches on a restored Probat UG22.", icon: Thermometer },
  { step: "03", title: "Cup", desc: "Every lot scored blind by three Q-Graders. Minimum 85 points to pass.", icon: Coffee },
  { step: "04", title: "Ship", desc: "Roasted to order, shipped within 24 hours in fully compostable packaging.", icon: Droplets },
]

export default function TorrefieCoffeePage() {
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
    <div className="bg-[#f5f0ea] text-[#2c1810] font-sans min-h-screen selection:bg-[#6b3a24] selection:text-white overflow-x-hidden">

      {/* ── NAVBAR ────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#f5f0ea]/90 backdrop-blur-xl border-b border-[#6b3a24]/10 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Coffee className="w-6 h-6 text-[#6b3a24]" />
            <span className="text-xl tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
              <span className="font-light">Torré</span><span className="font-bold text-[#6b3a24]">fié</span>
            </span>
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-[#2c1810]/40">
            {["Origins", "Process", "Shop", "About"].map(l => (
              <Link key={l} href="#" className="hover:text-[#6b3a24] transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <button className="hidden md:block px-8 py-3 bg-[#2c1810] text-[#f5f0ea] text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[#6b3a24] transition-colors duration-500">
              Shop Coffee
            </button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden"><Menu className="w-6 h-6" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#f5f0ea] p-12">
                <div className="flex flex-col gap-8 mt-16">
                  {["Origins", "Process", "Shop", "About"].map(l => (
                    <Link key={l} href="#" className="text-3xl font-light hover:text-[#6b3a24] transition-colors" style={{ fontFamily: "Georgia, serif" }}>{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ────────────────────────────── */}
        <section className="relative h-[110vh] min-h-[800px] flex items-center overflow-hidden">
          <motion.div style={{ y: heroY }} className="absolute inset-0">
            <Image src="https://picsum.photos/seed/coffee/2400/1500" alt="Coffee" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-[#f5f0ea] via-[#f5f0ea]/60 to-transparent" />
          </motion.div>

          <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex items-center gap-4 mb-8">
                <Leaf className="w-4 h-4 text-[#6b3a24]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#6b3a24]">Specialty Coffee Roasters — Est. 2016</span>
              </div>
            </Reveal>
            <Reveal delay={0.15} y={70}>
              <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-light tracking-tighter leading-[0.85] mb-8" style={{ fontFamily: "Georgia, serif" }}>
                From Seed<br/>To <em className="text-[#6b3a24]">Soul.</em>
              </h1>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="max-w-lg text-lg text-[#2c1810]/50 font-light leading-relaxed mb-10">
                Single-origin specialty coffee, roasted in small batches in our Bordeaux atelier. Direct trade, traceable, scored 85+.
              </p>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-wrap gap-4">
                <button className="px-10 py-5 bg-[#2c1810] text-[#f5f0ea] font-bold rounded-full hover:bg-[#6b3a24] transition-colors duration-500 flex items-center gap-3">
                  Discover Origins <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </Reveal>
          </motion.div>
        </section>

        {/* ── PROCESS ────────────────────────────── */}
        <section className="py-32 bg-[#2c1810] text-[#f5f0ea]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-24">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c48a5a] block mb-4">The Method</span>
                <h2 className="text-5xl md:text-7xl font-light tracking-tighter" style={{ fontFamily: "Georgia, serif" }}>
                  Our <em className="text-[#c48a5a]">Process.</em>
                </h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {PROCESS.map((p, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="text-center group">
                    <div className="text-5xl font-light text-[#c48a5a]/20 mb-4" style={{ fontFamily: "Georgia, serif" }}>{p.step}</div>
                    <div className="w-14 h-14 rounded-full border border-[#c48a5a]/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#c48a5a] group-hover:border-[#c48a5a] transition-all duration-500">
                      <p.icon className="w-6 h-6 text-[#c48a5a] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold mb-3">{p.title}</h3>
                    <p className="text-sm text-[#f5f0ea]/40 leading-relaxed">{p.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── ORIGINS GRID ─────────────────────── */}
        <section className="py-32 bg-[#f5f0ea]">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex justify-between items-end mb-20">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#6b3a24] block mb-4">Current Selection</span>
                  <h2 className="text-5xl md:text-7xl font-light tracking-tighter" style={{ fontFamily: "Georgia, serif" }}>
                    Single <em className="text-[#6b3a24]">Origins.</em>
                  </h2>
                </div>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {ORIGINS.map((o, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="group cursor-pointer flex flex-col md:flex-row gap-6 p-6 bg-white rounded-sm border border-[#6b3a24]/5 hover:border-[#6b3a24]/20 transition-all duration-500">
                    <div className="relative w-full md:w-48 aspect-square overflow-hidden rounded-sm shrink-0">
                      <Image src={o.img} alt={o.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#6b3a24]">{o.process}</span>
                          <span className="text-[10px] text-[#2c1810]/20">·</span>
                          <span className="text-[10px] text-[#2c1810]/40">{o.altitude}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-1 group-hover:text-[#6b3a24] transition-colors" style={{ fontFamily: "Georgia, serif" }}>{o.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-[#2c1810]/40 mb-3"><MapPin className="w-3 h-3" /> {o.region}</div>
                        <p className="text-sm text-[#2c1810]/50 italic">{o.notes}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#6b3a24]/10">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-[#6b3a24]" />
                          <span className="text-sm font-bold text-[#6b3a24]">SCA {o.score}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#6b3a24] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ──────────────────── */}
        <section className="py-32 bg-[#2c1810] text-[#f5f0ea]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-20">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c48a5a] block mb-4">What Clients Say</span>
                <h2 className="text-5xl md:text-6xl font-light tracking-tighter" style={{ fontFamily: "Georgia, serif" }}>
                  The <em className="text-[#c48a5a]">Reviews.</em>
                </h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { quote: "The Ethiopian Yirgacheffe changed the way I think about coffee. I've tried every specialty roaster in Paris — Torréfié is in a class of its own.", name: "Hélène Duval", location: "Paris, FR", origin: "Ethiopian Yirgacheffe" },
                { quote: "Freshness is unreal. Roasted Tuesday, on my desk Thursday. The Kenyan Nyeri AA is extraordinary — the blackcurrant notes are no marketing gimmick.", name: "James Whitfield", location: "London, UK", origin: "Kenyan Nyeri AA" },
                { quote: "Finally a subscription that actually rotates origins intelligently. My palate has evolved more in three months than in three years.", name: "Rafael Soto", location: "Barcelona, ES", origin: "Colombian Huila" },
              ].map((t, i) => (
                <Reveal key={i} delay={i * 0.12}>
                  <div className="p-10 border border-[#c48a5a]/20 flex flex-col gap-6 h-full">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#c48a5a] text-[#c48a5a]" />)}
                    </div>
                    <p className="text-[#f5f0ea]/60 font-light leading-relaxed italic flex-1" style={{ fontFamily: "Georgia, serif" }}>&ldquo;{t.quote}&rdquo;</p>
                    <div className="pt-6 border-t border-[#c48a5a]/20">
                      <div className="font-bold text-sm" style={{ fontFamily: "Georgia, serif" }}>{t.name}</div>
                      <div className="text-xs text-[#f5f0ea]/30 tracking-widest uppercase mt-1">{t.location}</div>
                      <div className="flex items-center gap-1 text-xs text-[#c48a5a] mt-1"><Coffee className="w-3 h-3" /> {t.origin}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── SUBSCRIPTIONS ─────────────────── */}
        <section className="py-32 bg-[#f5f0ea]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-20">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#6b3a24] block mb-4">Subscribe</span>
                <h2 className="text-5xl md:text-6xl font-light tracking-tighter" style={{ fontFamily: "Georgia, serif" }}>
                  Your <em className="text-[#6b3a24]">Plan.</em>
                </h2>
                <p className="text-lg text-[#2c1810]/40 font-light max-w-md mx-auto mt-4">
                  Roasted to order, shipped every two weeks. Pause or cancel anytime.
                </p>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Découverte", price: "€28", cadence: "/ bi-weekly", qty: "200g", desc: "One single-origin, chosen by our Q-Graders each cycle. Perfect for the curious palate.", features: ["1 origin per cycle", "Tasting notes card", "Compostable packaging"], highlight: false },
                { name: "Connoisseur", price: "€52", cadence: "/ bi-weekly", qty: "400g", desc: "Two carefully paired origins — explore contrasts of terroir, altitude, and process.", features: ["2 origins per cycle", "Brew guide included", "SCA score transparency", "Free shipping"], highlight: true },
                { name: "Maison", price: "€96", cadence: "/ bi-weekly", qty: "1kg", desc: "The full Torréfié experience. Four origins, access to pre-release lots, priority allocation.", features: ["4 origins per cycle", "Pre-release access", "Direct farmer profiles", "Free express shipping", "Private tastings"], highlight: false },
              ].map((plan, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className={`flex flex-col h-full rounded-sm border p-10 ${plan.highlight ? "bg-[#2c1810] text-[#f5f0ea] border-[#6b3a24]" : "bg-white border-[#6b3a24]/10"}`}>
                    <div className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-2 ${plan.highlight ? "text-[#c48a5a]" : "text-[#6b3a24]"}`}>{plan.qty}</div>
                    <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: "Georgia, serif" }}>{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className={`text-4xl font-black ${plan.highlight ? "text-[#c48a5a]" : "text-[#6b3a24]"}`}>{plan.price}</span>
                      <span className={`text-sm font-light ${plan.highlight ? "text-[#f5f0ea]/40" : "text-[#2c1810]/30"}`}>{plan.cadence}</span>
                    </div>
                    <p className={`text-sm leading-relaxed mb-8 ${plan.highlight ? "text-[#f5f0ea]/50" : "text-[#2c1810]/50"}`}>{plan.desc}</p>
                    <ul className="space-y-3 mb-10 flex-1">
                      {plan.features.map(f => (
                        <li key={f} className={`flex items-center gap-3 text-sm ${plan.highlight ? "text-[#f5f0ea]/70" : "text-[#2c1810]/60"}`}>
                          <Leaf className={`w-3 h-3 shrink-0 ${plan.highlight ? "text-[#c48a5a]" : "text-[#6b3a24]"}`} /> {f}
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full py-4 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full transition-all duration-500 ${plan.highlight ? "bg-[#c48a5a] text-white hover:bg-[#f5f0ea] hover:text-[#2c1810]" : "bg-[#2c1810] text-[#f5f0ea] hover:bg-[#6b3a24]"}`}>
                      Start {plan.name}
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────── */}
        <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=2400" alt="CTA" fill className="object-cover" />
            <div className="absolute inset-0 bg-[#2c1810]/70" />
          </div>
          <div className="relative z-10 text-center text-[#f5f0ea] px-6">
            <Reveal>
              <h2 className="text-5xl md:text-7xl font-light tracking-tighter mb-6" style={{ fontFamily: "Georgia, serif" }}>
                Taste The<br/><em>Difference.</em>
              </h2>
              <p className="text-lg text-[#f5f0ea]/60 font-light max-w-md mx-auto mb-10">
                Subscribe and receive freshly roasted single-origin coffee at your door every two weeks.
              </p>
              <button className="px-12 py-5 bg-[#f5f0ea] text-[#2c1810] font-bold rounded-full hover:bg-[#c48a5a] hover:text-white transition-all duration-500">
                Start Your Subscription
              </button>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────────────────── */}
      <footer className="bg-[#2c1810] text-[#f5f0ea] pt-24 pb-12 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Coffee className="w-5 h-5 text-[#c48a5a]" />
              <span className="text-xl tracking-tight" style={{ fontFamily: "Georgia, serif" }}>Torré<span className="font-bold text-[#c48a5a]">fié</span></span>
            </div>
            <p className="text-sm text-[#f5f0ea]/30 leading-relaxed">Specialty coffee, roasted with precision, sourced with conscience.</p>
          </div>
          {[
            { title: "Shop", links: ["All Origins", "Subscriptions", "Equipment", "Gift Sets"] },
            { title: "Learn", links: ["Brew Guides", "Origin Stories", "Q-Grading", "Blog"] },
            { title: "Company", links: ["Our Story", "The Roastery", "Wholesale", "Contact"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c48a5a] mb-6">{col.title}</h4>
              <ul className="space-y-3 text-sm text-[#f5f0ea]/30">
                {col.links.map(l => <li key={l}><Link href="#" className="hover:text-[#f5f0ea] transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1400px] mx-auto pt-8 border-t border-[#f5f0ea]/10 text-[10px] font-bold uppercase tracking-widest text-[#f5f0ea]/20 flex justify-between">
          <span>© 2026 TORRÉFIÉ ROASTERS.</span>
          <span>BORDEAUX, FRANCE</span>
        </div>
      </footer>
    </div>
  )
}
