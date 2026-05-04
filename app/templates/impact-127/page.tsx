"use client";
import { motion, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Music, Ticket, Radio, Menu, X, ArrowRight, Mic2, Volume2, Zap, Star, Play, Clock } from "lucide-react";
import "../premium.css";

const EVENTS = [
  { id: "neon", title: "NEON // PULSE", artist: "Bonobo", venue: "Warehouse 9", date: "MAR 22", time: "22:00", status: "SOLD_OUT", accent: "#ec4899" },
  { id: "bass", title: "BASS // RITUAL", artist: "Floating Points", venue: "Fabric London", date: "APR 05", time: "23:00", status: "FEW_LEFT", accent: "#a855f7" },
  { id: "dawn", title: "DAWN // CHORUS", artist: "Bicep Live", venue: "Printworks", date: "APR 18", time: "14:00", status: "ON_SALE", accent: "#06b6d4" },
  { id: "void", title: "VOID // SYSTEM", artist: "Aphex Twin", venue: "Barbican Centre", date: "MAY 02", time: "20:00", status: "ON_SALE", accent: "#22c55e" },
];

const STATS = [{ label: "EVENTS_PRODUCED", val: "340+" }, { label: "ARTISTS_BOOKED", val: "1.2K" }, { label: "TOTAL_ATTENDANCE", val: "2.4M" }, { label: "CITIES", val: "28" }];

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay }}>{children}</motion.div>;
}

export default function PulseEventsPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#08060c] text-white font-mono selection:bg-[#ec4899] selection:text-black overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#ec489920_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(#ec4899 0.5px, transparent 0.5px)`, backgroundSize: "32px 32px" }} />
      </div>

      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#08060c]/90 backdrop-blur-xl py-4 border-b border-white/5" : "bg-transparent py-10"}`}>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-xl font-black tracking-tighter">
            <div className="w-8 h-8 bg-[#ec4899] rounded-full flex items-center justify-center text-black"><Radio className="w-4 h-4" /></div>
            <span className="group-hover:text-[#ec4899] transition-colors">PULSE // <span className="text-white/30">EVENTS</span></span>
          </Link>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
            {["Events", "Artists", "Venues", "About"].map(l => <Link key={l} href="#" className="hover:text-[#ec4899] transition-colors">{l}</Link>)}
          </div>
          <button className="px-6 py-2.5 bg-[#ec4899] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all hidden md:block">Get_Tickets</button>
          <button onClick={() => setMenuOpen(true)} className="lg:hidden text-white/60"><Menu className="w-6 h-6" /></button>
        </div>
      </nav>

      <AnimatePresence>{menuOpen && (
        <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-[100] bg-[#08060c] p-8 flex flex-col pt-32">
          <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-8 text-white/40"><X className="w-10 h-10" /></button>
          {["Events", "Artists", "Venues", "About"].map(l => <Link key={l} href="#" onClick={() => setMenuOpen(false)} className="text-5xl font-black tracking-tighter uppercase mb-10">{l}</Link>)}
        </motion.div>
      )}</AnimatePresence>

      {/* HERO */}
      <section className="relative h-screen flex flex-col justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div key={i} animate={{ scale: [0.5, 3], opacity: [0.2, 0] }} transition={{ duration: 4, repeat: Infinity, delay: i * 1 }}
              className="absolute w-32 h-32 border border-[#ec4899]/20 rounded-full" />
          ))}
        </div>
        {/* Equalizer bars */}
        <div className="absolute bottom-0 left-0 w-full h-40 flex items-end justify-center gap-1 pointer-events-none opacity-20">
          {[...Array(60)].map((_, i) => (
            <motion.div key={i} animate={{ height: [Math.random() * 20 + 5, Math.random() * 100 + 20, Math.random() * 20 + 5] }}
              transition={{ duration: Math.random() * 0.8 + 0.4, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 bg-gradient-to-t from-[#ec4899] to-[#a855f7] rounded-full" />
          ))}
        </div>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
          <Reveal>
            <div className="flex items-center gap-4 mb-8">
              <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-2.5 h-2.5 bg-[#ec4899] rounded-full" />
              <div className="text-[9px] text-[#ec4899] font-bold uppercase tracking-widest">LIVE_NOW</div>
              <div className="text-[9px] text-white/20 tracking-widest uppercase">EVENTS: 340+ // CITIES: 28</div>
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[0.8] tracking-tighter uppercase mb-10">
              Feel <br /> The <br /> <span className="text-[#ec4899]">Sound</span> <br /> <span className="text-white/10">Live.</span>
            </h1>
            <p className="max-w-xl text-lg text-white/30 leading-relaxed font-light uppercase tracking-widest italic mb-12">
              Curated live music experiences. Underground venues. World-class artists.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="px-12 py-5 bg-[#ec4899] text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_50px_rgba(236,72,153,0.2)]">Browse_Events</button>
              <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">Watch_Recap</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* EVENT LIST */}
      <section className="py-40 bg-[#0a0812] border-y border-white/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] mb-24">Upcoming <span className="text-[#ec4899]">Shows.</span></h2></Reveal>
          <div className="space-y-2">
            {EVENTS.map((ev, i) => (
              <Reveal key={ev.id} delay={i * 0.05}>
                <div className="group flex flex-col md:flex-row justify-between items-center p-10 md:p-14 border-b border-white/5 hover:bg-[#ec4899] hover:text-black transition-all duration-500 cursor-pointer"
                  onMouseEnter={() => setHoveredEvent(ev.id)} onMouseLeave={() => setHoveredEvent(null)}>
                  <div className="flex-1 mb-6 md:mb-0">
                    <div className="flex items-center gap-6 mb-3">
                      <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">{ev.title}</h3>
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border ${ev.status === "SOLD_OUT" ? "border-red-500/30 text-red-400 group-hover:text-black/60 group-hover:border-black/20" : "border-white/10 text-white/20 group-hover:text-black/40 group-hover:border-black/20"}`}>{ev.status}</span>
                    </div>
                    <p className="text-sm text-white/40 group-hover:text-black/50 transition-colors italic">{ev.artist} — {ev.venue}</p>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-white/40 group-hover:text-black/50 uppercase tracking-widest">{ev.date}</div>
                      <div className="text-[9px] text-white/20 group-hover:text-black/30">{ev.time}</div>
                    </div>
                    <motion.div animate={{ x: hoveredEvent === ev.id ? 5 : 0 }} className="opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight className="w-5 h-5" /></motion.div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-40 bg-[#08060c]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-24 uppercase">What We <span className="text-[#ec4899]">Do.</span></h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[{ name: "EVENT // PRODUCTION", icon: <Zap className="w-6 h-6" />, items: ["Venue Curation", "Stage Design", "Sound Engineering", "Lighting"] },
              { name: "ARTIST // MANAGEMENT", icon: <Mic2 className="w-6 h-6" />, items: ["Booking", "Tour Routing", "PR & Press", "Branding"] },
              { name: "EXPERIENCE // DESIGN", icon: <Star className="w-6 h-6" />, items: ["Immersive Visuals", "Interactive Zones", "VIP Programs", "After-Parties"] }
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group p-12 bg-[#0c0a14] border border-white/5 hover:border-[#ec4899]/30 transition-all rounded-3xl">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-[#ec4899] mb-8 group-hover:bg-[#ec4899] group-hover:text-black transition-all">{s.icon}</div>
                  <h3 className="text-2xl font-black uppercase mb-8 tracking-tighter group-hover:text-[#ec4899] transition-colors">{s.name}</h3>
                  <div className="space-y-5 pt-8 border-t border-white/5">
                    {s.items.map((item, j) => <div key={j} className="flex items-center gap-4 text-[9px] font-bold text-white/20 uppercase tracking-widest"><div className="w-1.5 h-1.5 bg-[#ec4899] rotate-45" />{item}</div>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-40 bg-[#0a0812] border-y border-white/5 text-center">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
              {STATS.map((s, i) => (
                <div key={i} className="group"><div className="text-4xl md:text-5xl font-black text-white mb-4 group-hover:text-[#ec4899] transition-colors">{s.val}</div><div className="text-[9px] font-black text-white/15 uppercase tracking-widest">{s.label}</div></div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 bg-[#08060c] text-center">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">Join The <span className="text-[#ec4899]">Pulse.</span></h2>
            <p className="max-w-xl mx-auto text-sm text-white/30 leading-relaxed font-light mb-16 uppercase tracking-widest italic">Subscribe for early access, pre-sale codes, and exclusive event invitations.</p>
            <button className="px-16 py-6 bg-[#ec4899] text-black text-[12px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_60px_rgba(236,72,153,0.15)]">Subscribe</button>
          </Reveal>
        </div>
      </section>

      <footer className="bg-[#08060c] border-t border-white/5 py-32 px-6 md:px-12">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10"><div className="w-8 h-8 bg-[#ec4899] text-black rounded-full flex items-center justify-center"><Radio className="w-4 h-4" /></div><span>PULSE // EVENTS</span></Link>
            <p className="text-[11px] text-white/15 uppercase tracking-[0.2em] max-w-sm leading-relaxed italic">Curated live music experiences. Underground to arena.</p>
          </div>
          <div><h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#ec4899]">Events</h4><ul className="space-y-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">{["Upcoming", "Past_Shows", "Festivals", "Private"].map(l => <li key={l}><Link href="#">{l}</Link></li>)}</ul></div>
          <div><h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#ec4899]">Social</h4><ul className="space-y-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">{["Instagram", "Spotify", "YouTube", "TikTok"].map(l => <li key={l}><Link href="#">{l}</Link></li>)}</ul></div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 text-center text-[9px] font-bold text-white/10 uppercase tracking-widest">&copy; 2026 PULSE EVENTS</div>
      </footer>
    </div>
  );
}
