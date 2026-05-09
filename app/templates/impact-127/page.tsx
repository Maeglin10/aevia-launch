"use client"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Music, ArrowRight, Menu, Star, Calendar, Clock, MapPin, Ticket, Users, Heart, ChevronRight, Volume2 } from "lucide-react"
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

function EqBars({ active = false }: { active?: boolean }) {
  return (
    <div className="flex items-end gap-[2px] h-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-pink-500"
          animate={active
            ? { height: ["20%", "90%", "40%", "80%", "20%"] }
            : { height: "20%" }
          }
          transition={active
            ? { duration: 1 + Math.random() * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }
            : { duration: 0.3 }
          }
        />
      ))}
    </div>
  )
}

const EVENTS = [
  { title: "NEON PULSE", artist: "Nova Collective", date: "May 24, 2026", time: "21:00", venue: "Warehouse IX", city: "Berlin", img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=1200", price: "€45", status: "On Sale", genre: "Electronic" },
  { title: "MIDNIGHT CRESCENDO", artist: "The Archivists", date: "Jun 7, 2026", time: "20:00", venue: "Royal Albert Hall", city: "London", img: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80&w=1200", price: "£65", status: "Selling Fast", genre: "Orchestral" },
  { title: "BASS COMMUNION", artist: "Drift Engine", date: "Jun 21, 2026", time: "23:00", venue: "Fabric", city: "London", img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=1200", price: "£35", status: "On Sale", genre: "Techno" },
  { title: "AURORA SESSIONS", artist: "Pale Waves", date: "Jul 5, 2026", time: "19:30", venue: "Olympia", city: "Paris", img: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=1200", price: "€55", status: "Limited", genre: "Indie" },
]

export default function PulseEventsPage() {
  const [scrolled, setScrolled] = useState(false)
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null)

  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "30%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="bg-[#08050a] text-white font-sans min-h-screen selection:bg-pink-500 selection:text-white overflow-x-hidden">

      {/* ── NAVBAR ─────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#08050a]/90 backdrop-blur-xl border-b border-pink-500/10 py-4" : "bg-transparent py-8"}`}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center relative">
              <Music className="w-5 h-5 text-white" />
              <motion.div className="absolute inset-0 rounded-full border-2 border-pink-500" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
            </div>
            <span className="text-xl font-black tracking-tight">PULSE</span>
          </Link>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Events", "Artists", "Venues", "About"].map(l => (
              <Link key={l} href="#" className="hover:text-pink-400 transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:block px-8 py-3 bg-pink-500 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-white hover:text-black transition-all duration-500">
              Get Tickets
            </button>
            <Sheet>
              <SheetTrigger asChild><button className="lg:hidden"><Menu className="w-6 h-6 text-white" /></button></SheetTrigger>
              <SheetContent side="right" className="bg-[#08050a] border-pink-500/10 p-12">
                <div className="flex flex-col gap-8 mt-16">
                  {["Events", "Artists", "Venues", "Tickets"].map(l => (
                    <Link key={l} href="#" className="text-3xl font-light uppercase tracking-widest hover:text-pink-400 transition-colors">{l}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <main>
        {/* ── HERO ─────────────────────── */}
        <section className="relative h-[110vh] min-h-[800px] flex items-center overflow-hidden">
          <motion.div style={{ y: heroY }} className="absolute inset-0">
            <Image src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=2400" alt="Concert" fill className="object-cover opacity-50" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-[#08050a] via-[#08050a]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08050a] to-transparent" />
          </motion.div>

          <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 w-full">
            <Reveal>
              <div className="flex items-center gap-4 mb-8">
                <motion.div className="w-3 h-3 rounded-full bg-pink-500" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-pink-400">Live Events — Tickets On Sale Now</span>
              </div>
            </Reveal>
            <Reveal delay={0.1} y={70}>
              <h1 className="text-7xl md:text-[8rem] lg:text-[11rem] font-black tracking-tighter leading-[0.8] mb-10 uppercase">
                Feel<br/>The <span className="text-pink-500">Pulse.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.25}>
              <p className="text-xl text-white/40 font-light max-w-lg leading-relaxed mb-10">
                Curated live music experiences in the world's most iconic venues. Electronic, orchestral, indie — all unforgettable.
              </p>
            </Reveal>
            <Reveal delay={0.35}>
              <button className="px-10 py-5 bg-pink-500 text-white font-bold rounded-full hover:bg-white hover:text-black transition-all duration-500 flex items-center gap-3">
                <Ticket className="w-5 h-5" /> Browse All Events
              </button>
            </Reveal>
          </motion.div>
        </section>

        {/* ── EVENTS LIST ──────────────── */}
        <section className="py-32 bg-[#08050a]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="flex justify-between items-end mb-16 border-b border-white/5 pb-8">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Upcoming <span className="text-pink-500">Events</span></h2>
              </div>
            </Reveal>

            <div className="space-y-6">
              {EVENTS.map((ev, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div
                    className={`group grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 p-6 rounded-2xl border transition-all duration-500 cursor-pointer ${hoveredEvent === i ? "bg-white/[0.03] border-pink-500/30" : "bg-white/[0.01] border-white/5 hover:border-white/10"}`}
                    onMouseEnter={() => setHoveredEvent(i)}
                    onMouseLeave={() => setHoveredEvent(null)}
                  >
                    <div className="relative aspect-[16/9] lg:aspect-auto overflow-hidden rounded-xl">
                      <Image src={ev.img} alt={ev.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${ev.status === "Limited" ? "bg-red-500/90 text-white" : ev.status === "Selling Fast" ? "bg-amber-500/90 text-black" : "bg-white/90 text-black"}`}>{ev.status}</span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-4 mb-3">
                          <span className="px-3 py-1 bg-white/5 text-white/40 text-[10px] font-bold uppercase tracking-widest rounded-full">{ev.genre}</span>
                          <EqBars active={hoveredEvent === i} />
                        </div>
                        <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-tight mb-2 transition-colors ${hoveredEvent === i ? "text-pink-400" : ""}`}>{ev.title}</h3>
                        <div className="text-lg text-white/50 mb-4">{ev.artist}</div>
                      </div>
                      <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/5">
                        <span className="flex items-center gap-2 text-xs text-white/40"><Calendar className="w-3 h-3" /> {ev.date}</span>
                        <span className="flex items-center gap-2 text-xs text-white/40"><Clock className="w-3 h-3" /> {ev.time}</span>
                        <span className="flex items-center gap-2 text-xs text-white/40"><MapPin className="w-3 h-3" /> {ev.venue}, {ev.city}</span>
                        <span className="ml-auto text-xl font-black text-pink-400">{ev.price}</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────── */}
        <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=2400" alt="CTA" fill className="object-cover" />
            <div className="absolute inset-0 bg-pink-900/60 mix-blend-multiply" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 text-center px-6">
            <Reveal>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-8">
                Never Miss<br/>A <span className="text-pink-400">Beat.</span>
              </h2>
              <form onSubmit={e => e.preventDefault()} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input type="email" placeholder="Your email" className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-4 text-sm backdrop-blur-md outline-none focus:border-pink-400 placeholder:text-white/40 transition-colors" />
                <button className="px-8 py-4 bg-pink-500 text-white font-bold rounded-full hover:bg-white hover:text-black transition-all">Join Waitlist</button>
              </form>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ─────────────────────── */}
      <footer className="bg-[#050308] pt-24 pb-12 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center"><Music className="w-4 h-4 text-white" /></div>
              <span className="font-black tracking-tight">PULSE</span>
            </div>
            <p className="text-sm text-white/30 leading-relaxed">Curated live music experiences in iconic venues worldwide.</p>
          </div>
          {[
            { title: "Discover", links: ["All Events", "By Genre", "By City", "Artists"] },
            { title: "Info", links: ["About", "FAQ", "Accessibility", "Press"] },
            { title: "Follow", links: ["Camera", "MessageSquare", "Spotify", "YouTube"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-pink-400 mb-6">{col.title}</h4>
              <ul className="space-y-3 text-sm text-white/30">
                {col.links.map(l => <li key={l}><Link href="#" className="hover:text-white transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1200px] mx-auto pt-8 border-t border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/20 flex justify-between">
          <span>© 2026 PULSE EVENTS.</span>
          <span>FEEL THE FREQUENCY.</span>
        </div>
      </footer>
    </div>
  )
}
