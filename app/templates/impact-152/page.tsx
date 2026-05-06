"use client"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Globe, ArrowRight, MapPin, Star, Calendar, Heart, Plane, Sun, Camera, Compass, Menu, ChevronRight, Mail, Users } from "lucide-react"
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

const DESTINATIONS = [
  { name: "Kyoto, Japan", desc: "Ancient temples and cherry blossom trails through timeless gardens.", img: "https://images.unsplash.com/photo-1488085061851-e223e31e6d0c?auto=format&fit=crop&q=80&w=1200", tag: "Culture" },
  { name: "Patagonia", desc: "Glacial valleys and jagged peaks at the edge of the world.", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=1200", tag: "Adventure" },
  { name: "Amalfi Coast", desc: "Sun-drenched cliffs, limoncello, and azure Mediterranean waters.", img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1200", tag: "Romance" },
  { name: "Morocco", desc: "Spice-laden souks, desert camps, and Berber hospitality.", img: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=1200", tag: "Explorer" },
]

const FEATURES = [
  { icon: Compass, title: "Curated Itineraries", desc: "Hand-crafted routes by local experts who know every hidden path." },
  { icon: Camera, title: "Photo Journeys", desc: "Dedicated photographer guides to capture your perfect moments." },
  { icon: Sun, title: "Slow Travel", desc: "Deep immersion stays of 5-14 days in a single remarkable place." },
  { icon: Users, title: "Small Groups", desc: "Maximum 12 travelers per journey for intimate, authentic experiences." },
]

const TESTIMONIALS = [
  { text: "Wanderer Mag planned our honeymoon through Japan and it was genuinely the best two weeks of our lives. Every detail was perfect.", author: "Claire & Thomas B.", trip: "Kyoto & Hokkaido" },
  { text: "I've used luxury travel agencies before. This is different — they actually understand culture, not just hotels.", author: "Michael Engström", trip: "Morocco Explorer" },
  { text: "The small group format changed everything. We made lifelong friends and experienced things most tourists never see.", author: "Priya Kapoor", trip: "Patagonia Trek" },
]

export default function WandererMagPage() {
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
    <div className="bg-[#faf8f4] text-[#2a2420] font-sans min-h-screen selection:bg-amber-600 selection:text-white overflow-x-hidden">

      {/* ── NAVBAR ────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#faf8f4]/90 backdrop-blur-xl border-b border-amber-800/10 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Compass className="w-6 h-6 text-amber-700" />
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "Georgia, serif" }}>Wanderer</span>
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-[#2a2420]/40">
            {["Destinations", "Stories", "Journeys", "About"].map(l => (
              <Link key={l} href="#" className="hover:text-amber-700 transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <button className="hidden md:block px-8 py-3 bg-[#2a2420] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-amber-700 transition-all duration-500">
              Plan Your Journey
            </button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden"><Menu className="w-6 h-6" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#faf8f4] p-12">
                <div className="flex flex-col gap-8 mt-16">
                  {["Destinations", "Stories", "Journeys", "About"].map(l => (
                    <Link key={l} href="#" className="text-3xl font-light hover:text-amber-700 transition-colors" style={{ fontFamily: "Georgia, serif" }}>{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ────────────────────────────────── */}
        <section className="relative h-[110vh] min-h-[800px] flex items-end overflow-hidden">
          <motion.div style={{ y: heroY }} className="absolute inset-0">
            <Image src="https://images.unsplash.com/photo-1488085061851-e223e31e6d0c?auto=format&fit=crop&q=80&w=2400" alt="Travel" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-[#faf8f4] via-[#faf8f4]/20 to-transparent" />
          </motion.div>

          <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-[1600px] w-full mx-auto px-6 md:px-12 pb-24">
            <Reveal>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] w-12 bg-amber-700" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-700">Travel Magazine & Journal</span>
              </div>
            </Reveal>
            <Reveal delay={0.15} y={70}>
              <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-light tracking-tighter leading-[0.85] mb-8" style={{ fontFamily: "Georgia, serif" }}>
                Wander<br/><em className="text-amber-700">Deeper.</em>
              </h1>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="max-w-lg text-lg text-[#2a2420]/50 font-light leading-relaxed">
                Curated travel experiences for the culturally curious. Small groups, deep immersion, unforgettable stories.
              </p>
            </Reveal>
          </motion.div>
        </section>

        {/* ── DESTINATIONS ────────────────────────── */}
        <section className="py-32 bg-[#faf8f4]">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex justify-between items-end mb-20">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-700 block mb-4">Featured</span>
                  <h2 className="text-5xl md:text-7xl font-light tracking-tighter" style={{ fontFamily: "Georgia, serif" }}>
                    Next <em className="text-amber-700">Departures.</em>
                  </h2>
                </div>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {DESTINATIONS.map((d, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-sm mb-6">
                      <ParallaxImg src={d.img} alt={d.name} />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-700" />
                      <div className="absolute top-6 left-6">
                        <span className="px-3 py-1 bg-white/90 text-[10px] font-bold uppercase tracking-widest text-amber-800 rounded-full">{d.tag}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold group-hover:text-amber-700 transition-colors mb-1" style={{ fontFamily: "Georgia, serif" }}>{d.name}</h3>
                        <p className="text-sm text-[#2a2420]/40">{d.desc}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ────────────────────────────── */}
        <section className="py-32 bg-[#2a2420] text-white">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-24">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-400 block mb-4">Why Wanderer</span>
                <h2 className="text-5xl md:text-7xl font-light tracking-tighter" style={{ fontFamily: "Georgia, serif" }}>
                  Travel <em className="text-amber-400">Differently.</em>
                </h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {FEATURES.map((f, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="text-center group">
                    <div className="w-16 h-16 rounded-full border border-amber-400/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-700 group-hover:border-amber-700 transition-all duration-500">
                      <f.icon className="w-6 h-6 text-amber-400 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold mb-3">{f.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ────────────────────────── */}
        <section className="py-32 bg-white">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-20">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-700 block mb-4">Traveler Stories</span>
                <h2 className="text-5xl font-light tracking-tighter" style={{ fontFamily: "Georgia, serif" }}>
                  Words From The <em className="text-amber-700">Road.</em>
                </h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="p-8 bg-[#faf8f4] rounded-sm h-full flex flex-col border border-amber-800/5">
                    <div className="flex gap-1 mb-6">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-amber-600 text-amber-600" />
                      ))}
                    </div>
                    <p className="text-[#2a2420]/60 leading-relaxed flex-1 mb-6 italic" style={{ fontFamily: "Georgia, serif" }}>"{t.text}"</p>
                    <div>
                      <div className="font-bold text-sm">{t.author}</div>
                      <div className="flex items-center gap-1 text-xs text-amber-700 mt-1"><MapPin className="w-3 h-3" /> {t.trip}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── NEWSLETTER CTA ─────────────────────── */}
        <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image src="https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=2400" alt="CTA" fill className="object-cover" />
            <div className="absolute inset-0 bg-amber-900/60" />
          </div>
          <div className="relative z-10 text-center text-white px-6">
            <Reveal>
              <h2 className="text-5xl md:text-7xl font-light tracking-tighter mb-6" style={{ fontFamily: "Georgia, serif" }}>
                Start Your<br/><em>Next Chapter.</em>
              </h2>
              <p className="text-lg text-white/70 font-light max-w-md mx-auto mb-10">
                Get curated travel stories, destination guides, and early access to new journeys.
              </p>
              <form onSubmit={e => e.preventDefault()} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input type="email" placeholder="Your email" className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-4 text-sm backdrop-blur-md outline-none focus:border-white/60 placeholder:text-white/40 transition-colors" />
                <button className="px-8 py-4 bg-white text-[#2a2420] font-bold rounded-full hover:bg-amber-200 transition-colors">Subscribe</button>
              </form>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────────────────────── */}
      <footer className="bg-[#2a2420] text-white pt-24 pb-12 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Compass className="w-5 h-5 text-amber-400" />
              <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "Georgia, serif" }}>Wanderer</span>
            </div>
            <p className="text-sm text-white/30 leading-relaxed">Curated travel experiences for the culturally curious since 2019.</p>
          </div>
          {[
            { title: "Explore", links: ["Destinations", "Stories", "Photo Journals", "Guides"] },
            { title: "Journeys", links: ["Upcoming Trips", "Group Travel", "Private Trips", "Gift Cards"] },
            { title: "Company", links: ["About Us", "Team", "Careers", "Press"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400 mb-6">{col.title}</h4>
              <ul className="space-y-3 text-sm text-white/30">
                {col.links.map(l => <li key={l}><Link href="#" className="hover:text-white transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1400px] mx-auto pt-8 border-t border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/20 flex justify-between">
          <span>© 2026 WANDERER MAGAZINE.</span>
          <span>TRAVEL DEEPER.</span>
        </div>
      </footer>
    </div>
  )
}