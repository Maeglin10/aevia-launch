// @ts-nocheck
"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Watch, ArrowRight, Menu, Star, Sparkles, Shield, Clock, Award, Hammer, Compass, ChevronRight, Play, BookOpen, History, Cpu, Wrench } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function Reveal({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"])
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1])
  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden">
      <motion.div style={{ y, scale }} className="absolute inset-[-20%] w-[140%] h-[140%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  )
}

const COLLECTION = [
  { name: "Horology One", series: "Precision Series", price: "€14,500", img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=1200", desc: "Brushed titanium case with a 72-hour power reserve and sapphire crystal." },
  { name: "Deep Sea", series: "Oceanic Series", price: "€18,200", img: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=1200", desc: "Professional diver's watch water resistant to 1000m with helium escape valve." },
  { name: "Lunar Phase", series: "Astral Series", price: "€22,900", img: "https://images.unsplash.com/photo-1522337360744-47309047ffcf?auto=format&fit=crop&q=80&w=1200", desc: "Perpetual moon phase complication with 18k rose gold hand-engraved dial." },
]

const CRAFT = [
  { icon: Hammer, title: "Artisan Hand-Assembly", desc: "Over 200 hours of precision assembly by master horologists in our Swiss atelier." },
  { icon: Compass, title: "Navigational Precision", desc: "Calibrated to +/- 1 second per day, surpassing traditional COSC standards." },
  { icon: Shield, title: "Indestructible Materials", desc: "Grade 5 titanium and scratch-proof sapphire with multi-layer anti-reflective coating." },
]

type ActivePage = "home" | "atelier" | "collection" | "concierge" | "legal" | "craftsmanship" | "heritage" | "innovation" | "journal" | "support";

export default function ChronosLuxuryPage() {
  const [page, setPage] = useState<ActivePage>("home");
  const goTo = (p: ActivePage) => {
    setPage(p);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#050505] text-[#d4af37] font-sans min-h-screen selection:bg-[#d4af37] selection:text-black overflow-x-clip">
      
      {/* ── NAVBAR ────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${scrolled ? "bg-[#050505]/95 backdrop-blur-xl border-b border-[#d4af37]/10 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div onClick={(e) => { e.preventDefault(); goTo("home"); }} className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 border border-[#d4af37]/30 flex items-center justify-center group-hover:rotate-45 transition-transform duration-700">
              <Watch className="w-5 h-5 text-[#d4af37]" />
            </div>
            <span className="text-xl font-light tracking-[0.4em] uppercase text-white">Chronos</span>
          </div>
          <div className="hidden lg:flex gap-10 text-[9px] font-bold uppercase tracking-[0.4em] text-[#d4af37]/40">
            {[
              { name: "The Atelier", page: "atelier" },
              { name: "Collection", page: "collection" },
              { name: "Craftsmanship", page: "craftsmanship" },
              { name: "Heritage", page: "heritage" },
              { name: "Innovation", page: "innovation" },
              { name: "Journal", page: "journal" },
            ].map(l => (
              <a key={l.name} href="#" onClick={(e) => { e.preventDefault(); goTo(l.page as any); }} className={`transition-colors hover:text-[#d4af37] ${page === l.page ? "text-[#d4af37] font-extrabold" : ""}`}>{l.name}</a>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <button onClick={() => goTo("concierge")} className={`hidden md:block text-[9px] font-bold uppercase tracking-widest transition-colors ${page === "concierge" ? "text-[#d4af37]" : "text-[#d4af37]/60 hover:text-[#d4af37]"}`}>Private Concierge</button>
            <button onClick={() => goTo("collection")} className="px-8 py-3 border border-[#d4af37] text-[#d4af37] text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-[#d4af37] hover:text-black transition-all duration-700">Explore</button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden"><Menu className="w-6 h-6 text-[#d4af37]" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#050505] border-[#d4af37]/10 p-12 overflow-y-auto">
                <div className="flex flex-col gap-8 mt-16 text-left">
                  {[
                    { name: "Home", page: "home" },
                    { name: "Atelier", page: "atelier" },
                    { name: "Collection", page: "collection" },
                    { name: "Craftsmanship", page: "craftsmanship" },
                    { name: "Heritage", page: "heritage" },
                    { name: "Innovation", page: "innovation" },
                    { name: "Journal", page: "journal" },
                    { name: "Concierge", page: "concierge" },
                    { name: "Client Care", page: "support" },
                  ].map(l => (
                    <a key={l.name} href="#" onClick={(e) => { e.preventDefault(); goTo(l.page as any); }} className={`text-xl font-light uppercase tracking-[0.3em] hover:text-[#d4af37] transition-colors ${page === l.page ? "text-[#d4af37]" : "text-white"}`}>{l.name}</a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {page === "home" && (
          <>
            {/* ── HERO ──────────────────── */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0">
                <Image src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=2400" alt="Chronos Watch" fill className="object-cover opacity-40 scale-105" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                <div className="absolute inset-0 bg-black/40" />
              </div>

              <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
                <Reveal>
                  <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-[#d4af37]/60 block mb-10 italic">Defining Time Since 1924</span>
                </Reveal>
                <Reveal delay={0.2} y={70}>
                  <h1 className="text-7xl md:text-[9rem] font-extralight tracking-tighter leading-[0.85] text-white mb-12 uppercase" style={{ fontFamily: "serif" }}>
                    Mastery In <br/> <span className="text-[#d4af37] italic">Motion.</span>
                  </h1>
                </Reveal>
                <Reveal delay={0.4}>
                  <div className="flex flex-col items-center justify-center gap-12">
                    <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-[#d4af37]/40 to-transparent" />
                    <div className="flex flex-wrap justify-center gap-8">
                      <button onClick={() => goTo("collection")} className="px-12 py-5 bg-[#d4af37] text-black font-bold uppercase tracking-widest text-[10px] hover:px-14 transition-all duration-700">
                        View Collection
                      </button>
                      <button onClick={() => goTo("atelier")} className="px-12 py-5 border border-white/20 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all flex items-center gap-3">
                        <Play className="w-3 h-3 fill-current" /> Watch Film
                      </button>
                    </div>
                  </div>
                </Reveal>
              </div>
            </section>

            {/* ── QUOTE ─────────────────── */}
            <section className="py-40 bg-[#050505] text-center border-y border-white/5">
               <div className="max-w-4xl mx-auto px-6">
                  <Reveal>
                     <h2 className="text-3xl md:text-5xl font-light italic leading-relaxed text-white/80" style={{ fontFamily: "serif" }}>
                        "A watch does not simply tell the time; it tells a story of patience, precision, and the pursuit of perfection."
                     </h2>
                     <div className="mt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4af37]">Leo Aris — Master Horologist</div>
                  </Reveal>
               </div>
            </section>

            {/* ── COLLECTION ────────────── */}
            <section className="py-32 bg-[#050505]">
              <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                <Reveal>
                  <div className="flex items-end justify-between mb-24 border-b border-white/5 pb-12">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4af37] block mb-4">The Collection</span>
                      <h2 className="text-5xl md:text-7xl font-extralight uppercase text-white" style={{ fontFamily: "serif" }}>Selected <span className="italic">Series.</span></h2>
                    </div>
                    <button onClick={() => goTo("collection")} className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]/60 hover:text-[#d4af37] transition-colors flex items-center gap-4 group">
                       Browse All <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </Reveal>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {COLLECTION.map((c, i) => (
                    <Reveal key={i} delay={i * 0.2}>
                      <div onClick={() => goTo("collection")} className="group cursor-pointer">
                        <div className="relative aspect-[4/5] mb-8 overflow-hidden">
                          <ParallaxImg src={c.img} alt={c.name} />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-700" />
                          <div className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                            <Star className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                             <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#d4af37] mb-1">{c.series}</div>
                             <h3 className="text-2xl font-light uppercase text-white tracking-widest">{c.name}</h3>
                          </div>
                          <div className="text-xl font-bold italic">{c.price}</div>
                        </div>
                        <p className="text-sm text-white/40 leading-relaxed font-light">{c.desc}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

            {/* ── CRAFT ─────────────────── */}
            <section className="py-32 relative bg-[#080808]">
              <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                  <Reveal>
                    <div className="relative aspect-square">
                      <ParallaxImg src="https://images.unsplash.com/photo-1522337360744-47309047ffcf?auto=format&fit=crop&q=80&w=1200" alt="Atelier Detail" />
                      <div className="absolute -bottom-12 -left-12 p-8 bg-[#050505] border border-white/5 w-64 hidden md:block">
                         <div className="text-3xl font-bold mb-2 text-white">100%</div>
                         <div className="text-[9px] font-bold uppercase tracking-widest text-[#d4af37]">In-House Calibre</div>
                      </div>
                    </div>
                  </Reveal>
                  <div>
                    <Reveal>
                      <h2 className="text-5xl md:text-7xl font-extralight uppercase text-white mb-16 italic" style={{ fontFamily: "serif" }}>Born In <br/>The <span className="not-italic">Alps.</span></h2>
                      <div className="space-y-16">
                        {CRAFT.map((item, i) => (
                          <div key={i} className="flex gap-8 group cursor-pointer" onClick={() => goTo("craftsmanship")}>
                            <div className="w-12 h-12 shrink-0 border border-[#d4af37]/20 flex items-center justify-center group-hover:bg-[#d4af37] group-hover:border-[#d4af37] transition-all duration-700">
                              <item.icon className="w-5 h-5 text-[#d4af37] group-hover:text-black transition-colors" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold uppercase tracking-widest text-white mb-4">{item.title}</h4>
                              <p className="text-sm text-white/40 leading-relaxed max-w-sm">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Reveal>
                  </div>
                </div>
              </div>
            </section>

            {/* ── CONCIERGE ─────────────── */}
            <section className="py-40 bg-[#050505] text-center">
              <div className="max-w-4xl mx-auto px-6">
                <Reveal>
                  <h2 className="text-5xl md:text-8xl font-extralight uppercase text-white mb-12" style={{ fontFamily: "serif" }}>Personal <span className="italic text-[#d4af37]">Curation.</span></h2>
                  <p className="text-xl text-white/40 font-light mb-16 leading-relaxed">
                    Connect with our horological advisors for a private viewing of our latest complications, or to begin the creation of a masterpiece.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                    <button onClick={() => goTo("concierge")} className="px-16 py-6 bg-[#d4af37] text-black font-bold uppercase tracking-widest text-[10px] hover:px-20 transition-all duration-700">
                       Request Private Viewing
                    </button>
                    <button onClick={() => goTo("concierge")} className="px-16 py-6 border border-white/20 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all">
                       Contact Boutique
                    </button>
                  </div>
                </Reveal>
              </div>
            </section>
          </>
        )}

        {page === "atelier" && <AtelierPage />}
        {page === "collection" && <CollectionPage goTo={goTo} />}
        {page === "craftsmanship" && <CraftsmanshipPage />}
        {page === "heritage" && <HeritagePage />}
        {page === "innovation" && <InnovationPage />}
        {page === "journal" && <JournalPage />}
        {page === "concierge" && <ConciergePage />}
        {page === "support" && <SupportPage />}
        {page === "legal" && <LegalPage />}
      </main>

      {/* ── FOOTER ────────────────── */}
      <footer className="bg-black pt-24 pb-12 px-6">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-16 mb-24">
          <div className="md:col-span-2">
            <div onClick={() => goTo("home")} className="flex items-center gap-3 mb-10 cursor-pointer">
              <div className="w-8 h-8 border border-[#d4af37]/30 flex items-center justify-center">
                <Watch className="w-4 h-4 text-[#d4af37]" />
              </div>
              <span className="text-xl font-light tracking-[0.4em] uppercase text-white">Chronos</span>
            </div>
            <p className="text-white/30 max-w-sm leading-relaxed mb-10 text-sm italic" style={{ fontFamily: "serif" }}>
              "Time is the most valuable luxury of all. We simply provide the vessel to measure it."
            </p>
            <div className="flex gap-8">
               {["Camera", "Vimeo", "WeChat", "LinkedIn"].map(s => (
                 <a key={s} href="#" onClick={(e) => e.preventDefault()} className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]/40 hover:text-[#d4af37] transition-colors">{s}</a>
               ))}
            </div>
          </div>
          
          {[
            { t: "Explore", l: ["All Series", "Bespoke Service", "Pre-Owned", "Accessories"] },
            { t: "Discover", l: ["Our Atelier", "Heritage", "Innovation", "Journal"] },
            { t: "Client Care", l: ["Servicing", "Authentication", "Warranty", "Contact"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4af37] mb-10">{col.t}</h4>
              <ul className="space-y-6">
                {col.l.map(link => {
                  let onClickHandler = (e: React.MouseEvent) => e.preventDefault();
                  if (link === "All Series" || link === "Pre-Owned" || link === "Accessories") {
                    onClickHandler = (e) => { e.preventDefault(); goTo("collection"); };
                  } else if (link === "Bespoke Service" || link === "Contact") {
                    onClickHandler = (e) => { e.preventDefault(); goTo("concierge"); };
                  } else if (link === "Our Atelier") {
                    onClickHandler = (e) => { e.preventDefault(); goTo("atelier"); };
                  } else if (link === "Heritage") {
                    onClickHandler = (e) => { e.preventDefault(); goTo("heritage"); };
                  } else if (link === "Innovation") {
                    onClickHandler = (e) => { e.preventDefault(); goTo("innovation"); };
                  } else if (link === "Journal") {
                    onClickHandler = (e) => { e.preventDefault(); goTo("journal"); };
                  } else if (link === "Servicing" || link === "Authentication" || link === "Warranty") {
                    onClickHandler = (e) => { e.preventDefault(); goTo("support"); };
                  }
                  return (
                    <li key={link}>
                      <a href="#" onClick={onClickHandler} className="text-xs text-white/40 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-[1600px] mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-white/20">
          <span>© 2026 CHRONOS HOROLOGY SA. GENÈVE.</span>
          <div className="flex gap-10">
             <a href="#" onClick={(e) => { e.preventDefault(); goTo("legal"); }} className="hover:text-[#d4af37] transition-colors">Legal Mention</a>
             <a href="#" onClick={(e) => { e.preventDefault(); goTo("legal"); }} className="hover:text-[#d4af37] transition-colors">Privacy Circle</a>
             <a href="#" onClick={(e) => { e.preventDefault(); goTo("legal"); }} className="hover:text-[#d4af37] transition-colors">Cookies Policy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ─────────────────────────────────────────────
   SUB-PAGE COMPONENTS
───────────────────────────────────────────── */

function AtelierPage() {
  return (
    <section className="py-40 bg-[#050505] min-h-screen text-[#f0f0f0] border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-6 font-sans">
        <div className="text-center mb-24">
          <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-[#d4af37]/60 block mb-6 italic">Since 1924</span>
          <h1 className="text-5xl md:text-7xl font-extralight uppercase text-white mb-8" style={{ fontFamily: "serif" }}>
            The Swiss <span className="italic text-[#d4af37]">Atelier</span>
          </h1>
          <div className="w-[1px] h-12 bg-[#d4af37]/30 mx-auto mb-8" />
          <p className="text-lg text-white/40 max-w-2xl mx-auto leading-relaxed font-light">
            Deep in the Jura Mountains, our master horologists combine century-old methods with cutting-edge micro-mechanics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
          <div className="relative aspect-[4/3] border border-white/10 p-2">
            <img src="https://images.unsplash.com/photo-1522337360744-47309047ffcf?auto=format&fit=crop&q=80&w=1200" alt="Watchmaker hands" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-3xl font-extralight text-white uppercase tracking-widest mb-6" style={{ fontFamily: "serif" }}>
              Artisan Hand-Assembly
            </h2>
            <p className="text-sm text-white/50 leading-relaxed font-light mb-6">
              Every Chronos movement is fully assembled and adjusted by a single watchmaker. A minimum of 200 hours of dedication is spent on each timepiece, ensuring the perfect balance of friction and freedom within the gear train.
            </p>
            <p className="text-sm text-white/50 leading-relaxed font-light">
              Bridges are hand-beveled, dials are carefully guillochéed, and every casing is tested under extreme conditions to guarantee a legacy that outlasts generations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { title: "28 Years of Legacy", desc: "Constant refinement of the classic tourbillon complication." },
            { title: "COSC Calibrated", desc: "Exceeding traditional chronometer testing standards." },
            { title: "Swiss Sourced", desc: "100% of our movements and casings are crafted in Geneva." },
          ].map((item, i) => (
            <div key={i} className="border border-white/5 p-10 bg-[#080808]">
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-[#d4af37] mb-4">{item.title}</h4>
              <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CollectionPage({ goTo }: { goTo: (p: ActivePage) => void }) {
  const collectionList = [
    { name: "Horology One", series: "Precision Series", price: "€14,500", img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=1200", calibre: "CH-01 Manual", power: "72 Hours", case: "Titanium Grade 5", water: "50m", desc: "Brushed titanium case with a 72-hour power reserve and sapphire crystal." },
    { name: "Deep Sea", series: "Oceanic Series", price: "€18,200", img: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=1200", calibre: "CH-09 Auto", power: "60 Hours", case: "Stainless Steel 904L", water: "1000m", desc: "Professional diver's watch water resistant to 1000m with helium escape valve." },
    { name: "Lunar Phase", series: "Astral Series", price: "€22,900", img: "https://images.unsplash.com/photo-1522337360744-47309047ffcf?auto=format&fit=crop&q=80&w=1200", calibre: "CH-12 Lunar", power: "65 Hours", case: "18k Rose Gold", water: "30m", desc: "Perpetual moon phase complication with 18k rose gold hand-engraved dial." },
    { name: "Tourbillon Prestige", series: "Grand Complication", price: "€85,000", img: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=1200", calibre: "CH-50 Tourbillon", power: "80 Hours", case: "Platinum 950", water: "30m", desc: "Flying tourbillon with manual winding, hand-beveled titanium cage, and power reserve indicator." }
  ];

  return (
    <section className="py-40 bg-[#050505] min-h-screen text-white border-t border-white/5">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 font-sans">
        <div className="text-center mb-20">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4af37] block mb-4">The Collection</span>
          <h2 className="text-5xl md:text-7xl font-extralight uppercase text-white" style={{ fontFamily: "serif" }}>
            Timepiece <span className="italic text-[#d4af37]">Catalogue</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {collectionList.map((c, i) => (
            <div key={i} className="border border-white/5 bg-[#080808] p-8 rounded-lg flex flex-col md:flex-row gap-8 items-center">
              <div className="relative w-full md:w-1/2 aspect-[4/5] overflow-hidden">
                <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
              </div>
              <div className="w-full md:w-1/2 flex flex-col h-full justify-between">
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#d4af37] mb-1">{c.series}</div>
                  <h3 className="text-3xl font-light uppercase text-white tracking-wider mb-2">{c.name}</h3>
                  <div className="text-xl font-bold italic text-[#d4af37] mb-4">{c.price}</div>
                  <p className="text-sm text-white/50 leading-relaxed font-light mb-6">{c.desc}</p>
                </div>

                <div className="border-t border-white/10 pt-4 mb-6 space-y-2">
                  <div className="flex justify-between text-xs"><span className="text-white/30">Calibre</span><span>{c.calibre}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-white/30">Case</span><span>{c.case}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-white/30">Power Reserve</span><span>{c.power}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-white/30">Water Resistance</span><span>{c.water}</span></div>
                </div>

                <button onClick={() => goTo("concierge")} className="w-full py-4 border border-[#d4af37] text-[#d4af37] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#d4af37] hover:text-black transition-all duration-700">
                  Request Viewing
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CraftsmanshipPage() {
  return (
    <section className="py-40 bg-[#050505] min-h-screen text-white border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-6 font-sans">
        <div className="text-center mb-24">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#d4af37] block mb-4">Savoir-Faire</span>
          <h1 className="text-5xl md:text-7xl font-extralight uppercase text-white mb-6" style={{ fontFamily: "serif" }}>
            The Art Of <span className="italic text-[#d4af37]">Craftsmanship</span>
          </h1>
          <p className="text-base text-white/40 max-w-2xl mx-auto leading-relaxed">
            Every step in creating a Chronos watch is guided by absolute devotion to horological perfection. Here, we outline the key stages of our craft.
          </p>
        </div>

        <div className="space-y-32">
          {[
            {
              num: "01",
              title: "Guillochage & Dial Artistry",
              desc: "Our solid gold and silver dials are hand-engraved using mechanical rose engine lathes dating back to the early 20th century. This precise art form requires intense concentration, where a single slip of the wrist can ruin days of precision labor.",
              img: "https://images.unsplash.com/photo-1522337360744-47309047ffcf?auto=format&fit=crop&q=80&w=1200"
            },
            {
              num: "02",
              title: "Anglage & Decorative Finishing",
              desc: "Bridges, plates, and steel parts undergo meticulous hand-beveling (anglage). Using boxwood pegs and diamond paste, our craftsmen polish every internal angle until it reflects light flawlessly, creating a striking contrast with the circular-grained mainplate.",
              img: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=1200"
            },
            {
              num: "03",
              title: "Dynamic Chronometer Calibration",
              desc: "Before a watch leaves our atelier, it is tested in five different positions at temperatures ranging from 8°C to 38°C. This dynamic testing simulates real-world movements and pressure, ensuring the timepiece maintains steady rate stability.",
              img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=1200"
            }
          ].map((item, idx) => (
            <div key={idx} className={`flex flex-col lg:flex-row gap-16 items-center ${idx % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
              <div className="w-full lg:w-1/2 aspect-[16/10] relative border border-white/10 p-2 bg-[#0c0c0c]">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="w-full lg:w-1/2">
                <span className="text-4xl md:text-5xl font-light italic text-[#d4af37] block mb-4" style={{ fontFamily: "serif" }}>{item.num}</span>
                <h3 className="text-2xl md:text-3xl font-extralight uppercase text-white tracking-widest mb-6" style={{ fontFamily: "serif" }}>{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed font-light">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeritagePage() {
  return (
    <section className="py-40 bg-[#050505] min-h-screen text-white border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-6 font-sans">
        <div className="text-center mb-24">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#d4af37] block mb-4">Our Legacy</span>
          <h1 className="text-5xl md:text-7xl font-extralight uppercase text-white mb-6" style={{ fontFamily: "serif" }}>
            Century Of <span className="italic text-[#d4af37]">Heritage</span>
          </h1>
          <p className="text-base text-white/40 max-w-2xl mx-auto leading-relaxed">
            Time is not only measured but lived. Discover the key chapters that defined the Chronos legacy from the early 20th century to the modern day.
          </p>
        </div>

        <div className="relative border-l border-[#d4af37]/20 pl-8 md:pl-16 max-w-3xl mx-auto space-y-24">
          {[
            {
              year: "1924",
              title: "The Founding Father",
              desc: "Master horologist Leo Aris opens his first tiny workshop in Geneva, Switzerland. Inspired by astronomical movements, he creates his first perpetual lunar complication, laying the foundation for our signature series."
            },
            {
              year: "1952",
              title: "Deep Sea Exploration",
              desc: "Chronos is commissioned to create a mechanical timepiece capable of withstand extreme underwater pressure. The 'Oceanic' prototype goes down to 1000m, establishing our mastery in robust diving cases."
            },
            {
              year: "1988",
              title: "The Flying Tourbillon",
              desc: "We introduce a revolutionary rose gold flying tourbillon, featuring a cage mounted only on one side. This design remains a reference in watchmaking circles, admired for its lightness and elegance."
            },
            {
              year: "2026",
              title: "Titanium Evolution",
              desc: "Embracing space-age alloys, Chronos introduces Grade 5 titanium casings, combining maximum durability with minimal weight, keeping the spirit of Leo Aris alive in a modern casing."
            }
          ].map((milestone, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[41px] md:-left-[73px] top-1 w-5 h-5 rounded-full bg-[#050505] border border-[#d4af37] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              </div>
              <span className="text-3xl md:text-4xl font-extralight text-[#d4af37] italic block mb-2" style={{ fontFamily: "serif" }}>{milestone.year}</span>
              <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-4">{milestone.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed font-light">{milestone.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InnovationPage() {
  return (
    <section className="py-40 bg-[#050505] min-h-screen text-white border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-6 font-sans">
        <div className="text-center mb-24">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#d4af37] block mb-4">Engineering Future</span>
          <h1 className="text-5xl md:text-7xl font-extralight uppercase text-white mb-6" style={{ fontFamily: "serif" }}>
            Technical <span className="italic text-[#d4af37]">Innovation</span>
          </h1>
          <p className="text-base text-white/40 max-w-2xl mx-auto leading-relaxed">
            While respecting our heritage, we push mechanical limits. Our watchmakers develop state-of-the-art materials and complications that redefine reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Cpu,
              title: "Silicon Escapement",
              desc: "Using monocrystalline silicon for the escape wheel and pallet lever, our movements achieve unmatched friction reduction. This allows them to run without lubrication, significantly increasing servicing intervals."
            },
            {
              icon: Clock,
              title: "Micro-Rotor System",
              desc: "Our ultra-thin automatic calibres utilize a hand-engraved 22k gold micro-rotor. This reduces movement thickness to just 4.2mm, allowing for exceptionally sleek and elegant casing profiles."
            },
            {
              icon: Shield,
              title: "Carbon-Silicon Alloys",
              desc: "By merging carbon fiber matrices with silicon, we've developed balance springs that are completely immune to magnetic interference, one of the leading causes of rate variation."
            }
          ].map((item, i) => (
            <div key={i} className="border border-white/5 p-12 bg-[#080808] flex flex-col items-center text-center">
              <div className="w-16 h-16 border border-[#d4af37]/20 flex items-center justify-center mb-8">
                <item.icon className="w-6 h-6 text-[#d4af37]" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-widest text-white mb-4">{item.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-24 border border-white/5 p-12 bg-[#0c0c0c] flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/3 aspect-square relative">
            <img src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=1200" alt="Innovation Detail" className="w-full h-full object-cover" />
          </div>
          <div className="w-full md:w-2/3">
            <h3 className="text-3xl font-extralight uppercase text-[#d4af37] mb-6" style={{ fontFamily: "serif" }}>Dynamic Pressure Chambers</h3>
            <p className="text-sm text-white/50 leading-relaxed font-light mb-6">
              Our professional dive watches are subjected to intense static and dynamic water pressure tests. Utilizing custom-engineered hyperbaric chambers, we test each model at 125% of its rated depth to ensure absolute safety in the deepest oceans.
            </p>
            <div className="flex gap-12">
              <div>
                <span className="text-2xl font-bold text-white block">125%</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#d4af37]">Safety Buffer</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-white block">100 Bar</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#d4af37]">Pressure Limit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function JournalPage() {
  const articles = [
    {
      title: "The Art of Anglage: Hand-Beveling",
      cat: "Craftsmanship",
      date: "May 14, 2026",
      desc: "An exploration of the technique of hand-polishing sharp edges in high watchmaking.",
      img: "https://images.unsplash.com/photo-1522337360744-47309047ffcf?auto=format&fit=crop&q=80&w=1200"
    },
    {
      title: "Helium Escape Valves: Deep Oceanic Design",
      cat: "Engineering",
      date: "April 28, 2026",
      desc: "How our watches survive the decompression phase of professional saturation diving.",
      img: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=1200"
    },
    {
      title: "Restoring a 1930 Perpetual Calendar",
      cat: "Restoration",
      date: "March 10, 2026",
      desc: "A behind-the-scenes look at reviving one of Leo Aris's early lunar complications.",
      img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=1200"
    }
  ];

  return (
    <section className="py-40 bg-[#050505] min-h-screen text-white border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-6 font-sans">
        <div className="text-center mb-24">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#d4af37] block mb-4">Chronos Journal</span>
          <h1 className="text-5xl md:text-7xl font-extralight uppercase text-white mb-6" style={{ fontFamily: "serif" }}>
            Essays In <span className="italic text-[#d4af37]">Horology</span>
          </h1>
          <p className="text-base text-white/40 max-w-2xl mx-auto leading-relaxed">
            Read our notes on mechanical history, technical discoveries, and behind-the-scenes insights from the Geneva atelier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art, idx) => (
            <div key={idx} className="border border-white/5 bg-[#080808] p-6 hover:border-[#d4af37]/30 transition-all duration-500 cursor-pointer">
              <div className="aspect-[16/10] relative mb-6 overflow-hidden">
                <img src={art.img} alt={art.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-[#d4af37] mb-4">
                <span>{art.cat}</span>
                <span className="text-white/30">{art.date}</span>
              </div>
              <h3 className="text-xl font-light uppercase text-white mb-4 tracking-wide leading-snug" style={{ fontFamily: "serif" }}>{art.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed mb-6 font-light">{art.desc}</p>
              <span className="text-[9px] font-bold uppercase tracking-widest text-white hover:text-[#d4af37] transition-colors flex items-center gap-2">
                Read Article <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConciergePage() {
  return (
    <section className="py-40 bg-[#050505] min-h-screen text-white border-t border-white/5">
      <div className="max-w-3xl mx-auto px-6 font-sans">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4af37] block mb-4">Concierge Desk</span>
          <h2 className="text-5xl md:text-7xl font-extralight uppercase text-white" style={{ fontFamily: "serif" }}>
            Acquisition <span className="italic text-[#d4af37]">Enquiry</span>
          </h2>
          <p className="text-white/40 mt-6 text-sm font-light leading-relaxed">
            Please submit your preferred contact coordinates. Our horological advisors will contact you within 4 hours.
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-8 border border-white/5 bg-[#080808] p-10 md:p-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-widest text-[#d4af37] mb-3">Full Name</label>
              <input type="text" placeholder="Your name" className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm focus:border-[#d4af37] outline-none text-white transition-colors" />
            </div>
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-widest text-[#d4af37] mb-3">Email Address</label>
              <input type="email" placeholder="name@domain.com" className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm focus:border-[#d4af37] outline-none text-white transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-widest text-[#d4af37] mb-3">Timepiece of Interest</label>
              <select className="w-full bg-black/40 border border-[#d4af37]/20 px-4 py-3 text-sm focus:border-[#d4af37] outline-none text-[#d4af37] transition-colors">
                <option value="horology1">Horology One</option>
                <option value="deepsea">Deep Sea</option>
                <option value="lunar">Lunar Phase</option>
                <option value="tourbillon">Tourbillon Prestige</option>
                <option value="bespoke">Bespoke Complication</option>
              </select>
            </div>
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-widest text-[#d4af37] mb-3">Request Type</label>
              <select className="w-full bg-black/40 border border-[#d4af37]/20 px-4 py-3 text-sm focus:border-[#d4af37] outline-none text-[#d4af37] transition-colors">
                <option value="viewing">Private Viewing (Geneva)</option>
                <option value="purchase">Acquisition Request</option>
                <option value="custom">Bespoke Customization Commission</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-bold uppercase tracking-widest text-[#d4af37] mb-3">Additional Details</label>
            <textarea rows={4} placeholder="Please describe any customization requests or preferred contact hours..." className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm focus:border-[#d4af37] outline-none text-white transition-colors resize-none" />
          </div>

          <button type="submit" className="w-full py-5 bg-[#d4af37] text-black font-bold uppercase tracking-widest text-[10px] hover:bg-[#d4af37]/90 transition-colors">
            Submit Private Enquiry
          </button>
        </form>
      </div>
    </section>
  );
}

function SupportPage() {
  return (
    <section className="py-40 bg-[#050505] min-h-screen text-white border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-6 font-sans">
        <div className="text-center mb-24">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#d4af37] block mb-4">Client Care</span>
          <h1 className="text-5xl md:text-7xl font-extralight uppercase text-white mb-6" style={{ fontFamily: "serif" }}>
            Servicing & <span className="italic text-[#d4af37]">Support</span>
          </h1>
          <p className="text-base text-white/40 max-w-2xl mx-auto leading-relaxed">
            Your Chronos timepiece is designed to function flawlessly across generations. Discover our support services, authentication standards, and warranty policies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Wrench,
              title: "Regular Servicing",
              desc: "We recommend a complete service every 5 to 7 years. Our watchmakers completely disassemble the movement, clean every component ultrasonically, apply modern synthetic lubricants, replace all gaskets, and recheck accuracy."
            },
            {
              icon: Shield,
              title: "Official Authentication",
              desc: "Only our Geneva atelier can issue an official Certificate of Authenticity for vintage Chronos timepieces. We check historical serial databases, calibrate caliber numbers, and verify hand engravings to ensure origins."
            },
            {
              icon: Award,
              title: "Lifetime Warranty",
              desc: "Chronos offers a lifetime warranty for the original purchaser, covering manufacturing defects and material failures. For secondary owners, we provide a transferable 5-year warranty from the last certified service date."
            }
          ].map((item, idx) => (
            <div key={idx} className="border border-white/5 bg-[#080808] p-10 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 border border-[#d4af37]/20 flex items-center justify-center mb-8">
                  <item.icon className="w-5 h-5 text-[#d4af37]" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-widest text-white mb-4">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed font-light mb-8">{item.desc}</p>
              </div>
              <button className="text-[9px] font-bold uppercase tracking-widest text-[#d4af37] hover:underline text-left">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LegalPage() {
  return (
    <section className="py-40 bg-[#050505] min-h-screen text-white border-t border-white/5">
      <div className="max-w-3xl mx-auto px-6 font-sans">
        <h1 className="text-4xl md:text-6xl font-extralight uppercase text-white mb-12" style={{ fontFamily: "serif" }}>
          Legal <span className="italic text-[#d4af37]">Information</span>
        </h1>

        <div className="space-y-12 text-sm text-white/50 leading-relaxed font-light">
          <div className="border border-white/10 bg-[#080808] p-8 rounded">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#d4af37] mb-4">Publisher & Host</h3>
            <p className="space-y-1">
              <strong>Publisher:</strong> Aevia WS — Valentin Milliand<br />
              Sole Proprietorship — SIREN 852 546 225 — RCS Bourg-en-Bresse<br />
              <strong>Email:</strong> contact@aevia.io<br />
              <strong>Address:</strong> communicated upon request<br />
              <strong>Host:</strong> Vercel Inc.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.1em] text-white mb-4">Intellectual Property</h4>
            <p>
              The design, structure, code, graphics, images, logos, and written content of this website are the sole property of Chronos Horology SA. Any reproduction or unauthorized use is strictly prohibited and subject to legal action.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.1em] text-white mb-4">Horological Disclaimers</h4>
            <p>
              Prices listed are subject to Swiss VAT and regional import taxes. Technical specifications (balance spring calibrations, depth ratings) are based on controlled laboratory conditions and may vary slightly between individually handcrafted timepieces.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
