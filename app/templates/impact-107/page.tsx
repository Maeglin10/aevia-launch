"use client";
import { motion, useInView, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Compass, Map, Mountain, Menu, X, ArrowRight } from "lucide-react";
import "../premium.css";

const CHAPTERS = [
  { id: "ch1", num: "01", title: "THE SOUTHERN RIDGE", location: "Patagonia, Argentina", desc: "We set out at 4 AM, headlamps cutting through pre-dawn frost. The Torres del Paine massif materialized slowly — first as silhouettes, then as walls of granite catching the first amber light.", color: "#0d9488" },
  { id: "ch2", num: "02", title: "ICE CATHEDRAL", location: "Vatnajökull, Iceland", desc: "Inside the glacier cave, every surface refracted blue. Not sky-blue or ocean-blue — a blue that exists nowhere else on Earth. The ice groaned above us, a living architecture reshaping itself.", color: "#0ea5e9" },
  { id: "ch3", num: "03", title: "THE SILK ROAD", location: "Samarkand, Uzbekistan", desc: "The Registan square at golden hour is overwhelming. Three madrasas facing each other across six centuries of ambition, their turquoise tilework still impossibly vivid.", color: "#d97706" },
  { id: "ch4", num: "04", title: "ABOVE THE CLOUDS", location: "Annapurna Circuit, Nepal", desc: "At 5,416 meters, Thorong La Pass strips everything to essentials: breath, step, breath, step. Prayer flags snapped in thin air. Below, the world fell away in every direction.", color: "#dc2626" },
];

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, delay }}>{children}</motion.div>;
}

export default function MeridianJourneyPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="premium-theme min-h-screen bg-[#0a0f0d] text-white font-mono selection:bg-[#0d9488] selection:text-black overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.015]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30Z' fill='none' stroke='%230d9488' stroke-width='0.5'/%3E%3C/svg%3E")`, backgroundSize: "60px 60px" }} />

      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#0a0f0d]/90 backdrop-blur-xl py-4 border-b border-white/5" : "bg-transparent py-10"}`}>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-xl font-black tracking-tighter">
            <div className="w-8 h-8 bg-[#0d9488] rounded-full flex items-center justify-center text-black"><Compass className="w-4 h-4" /></div>
            <span className="group-hover:text-[#0d9488] transition-colors">MERIDIAN // <span className="text-white/30">JOURNEY</span></span>
          </Link>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
            {["Expeditions", "Stories", "Gear", "About"].map(l => <Link key={l} href="#" className="hover:text-[#0d9488] transition-colors">{l}</Link>)}
          </div>
          <button className="px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#0d9488] transition-all hidden md:block">Join_Expedition</button>
          <button onClick={() => setMenuOpen(true)} className="lg:hidden text-white/60"><Menu className="w-6 h-6" /></button>
        </div>
      </nav>

      <AnimatePresence>{menuOpen && (
        <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-[100] bg-[#0a0f0d] p-8 flex flex-col pt-32">
          <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-8 text-white/40"><X className="w-10 h-10" /></button>
          {["Expeditions", "Stories", "Gear", "About"].map(l => <Link key={l} href="#" onClick={() => setMenuOpen(false)} className="text-5xl font-black tracking-tighter uppercase mb-10">{l}</Link>)}
        </motion.div>
      )}</AnimatePresence>

      {/* HERO */}
      <motion.section ref={heroRef} style={{ opacity: heroOpacity }} className="relative h-screen flex flex-col justify-end pb-32 pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d9488]/10 via-transparent to-[#0a0f0d]" />
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
          <Reveal>
            <div className="flex items-center gap-4 mb-8">
              <div className="px-3 py-1 bg-[#0d9488]/10 border border-[#0d9488]/30 text-[#0d9488] text-[9px] font-bold uppercase tracking-widest">EXPEDITION_LIVE</div>
              <div className="text-[9px] text-white/20 tracking-widest uppercase">COUNTRIES: 38 // SUMMITS: 12</div>
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[0.8] tracking-tighter uppercase mb-10">
              Beyond <br /> The <br /> <span className="text-[#0d9488]">Known</span> <br /> <span className="text-white/10">Path.</span>
            </h1>
            <p className="max-w-2xl text-lg text-white/30 leading-relaxed font-light uppercase tracking-widest italic">
              Long-form expedition narratives from the world&apos;s most remote landscapes.
            </p>
          </Reveal>
        </div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-[8px] uppercase tracking-[0.4em] text-white/20">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </motion.section>

      {/* CHAPTERS */}
      <section className="relative">
        {CHAPTERS.map((ch, i) => (
          <div key={ch.id} className="border-t border-white/5">
            <div className="max-w-[1500px] mx-auto px-6 md:px-12 py-40">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-start">
                <div className="lg:col-span-4 lg:sticky lg:top-40">
                  <Reveal>
                    <span className="text-[10px] uppercase tracking-[0.5em] font-bold mb-6 block" style={{ color: ch.color }}>CHAPTER_{ch.num}</span>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] mb-6 uppercase">{ch.title}</h2>
                    <div className="flex items-center gap-3 text-[10px] text-white/20 uppercase tracking-widest mb-12">
                      <Map className="w-3.5 h-3.5" style={{ color: ch.color }} /><span>{ch.location}</span>
                    </div>
                    <div className="w-full h-px mb-12" style={{ background: `linear-gradient(90deg, ${ch.color}40 0%, transparent 100%)` }} />
                    <div className="w-full aspect-[4/3] rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${ch.color}20, ${ch.color}05)` }}>
                      <Mountain className="w-16 h-16 opacity-10" style={{ color: ch.color }} />
                    </div>
                  </Reveal>
                </div>
                <div className="lg:col-span-8">
                  <Reveal delay={0.15}>
                    <p className="text-xl md:text-2xl text-white/50 leading-[1.8] font-light italic mb-16">&ldquo;{ch.desc}&rdquo;</p>
                    <p className="text-base text-white/30 leading-[2] mb-12">{ch.desc} The light shifted constantly, painting new versions of the same landscape every few minutes. We shot twelve rolls of medium format film. Some moments resist documentation — they exist only in the nervous system of those present.</p>
                    <div className="flex items-center gap-6 pt-8 border-t border-white/5">
                      <button className="px-8 py-3 text-[9px] font-black uppercase tracking-widest border border-white/10 hover:bg-white hover:text-black transition-all" style={{ color: ch.color }}>Read_Full</button>
                      <span className="text-[9px] text-white/10 uppercase tracking-widest">12 MIN READ</span>
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* GEAR */}
      <section className="py-40 bg-[#070b09] border-y border-white/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-24 uppercase">Field <span className="text-[#0d9488]">Kit.</span></h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[{ name: "NAVIGATION", items: ["Satellite GPS", "Topo Maps", "Compass Set", "Beacon"] }, { name: "DOCUMENTATION", items: ["Medium Format", "Drone System", "Audio Recorder", "Journal"] }, { name: "SURVIVAL", items: ["Alpine Kit", "Water Purifier", "Emergency Shelter", "First Aid"] }].map((g, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group p-12 bg-[#0d120f] border border-white/5 hover:border-[#0d9488]/30 transition-all rounded-3xl">
                  <h3 className="text-2xl font-black uppercase mb-8 tracking-tighter group-hover:text-[#0d9488] transition-colors">{g.name}</h3>
                  <div className="space-y-5 pt-8 border-t border-white/5">
                    {g.items.map((item, j) => <div key={j} className="flex items-center gap-4 text-[9px] font-bold text-white/20 uppercase tracking-widest"><div className="w-1.5 h-1.5 bg-[#0d9488] rotate-45" />{item}</div>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-40 bg-[#0a0f0d] text-center">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
              {[{ label: "DISTANCE_KM", val: "142K" }, { label: "DAYS_IN_FIELD", val: "1,840" }, { label: "STORIES", val: "64" }, { label: "PHOTO_ARCHIVE", val: "380K" }].map((s, i) => (
                <div key={i} className="group"><div className="text-4xl md:text-5xl font-black text-white mb-4 group-hover:text-[#0d9488] transition-colors">{s.val}</div><div className="text-[9px] font-black text-white/15 uppercase tracking-widest">{s.label}</div></div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 bg-[#070b09] border-t border-white/5 text-center">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">Write <span className="text-[#0d9488]">With Us.</span></h2>
            <p className="max-w-2xl mx-auto text-sm text-white/30 leading-relaxed font-light mb-16 uppercase tracking-widest italic">We fund two writers per year to join expeditions. Applications open January.</p>
            <button className="px-16 py-6 bg-white text-black text-[12px] font-black uppercase tracking-[0.4em] hover:bg-[#0d9488] transition-all">Apply_Now</button>
          </Reveal>
        </div>
      </section>

      <footer className="bg-[#070b09] border-t border-white/5 py-32 px-6 md:px-12">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10"><div className="w-8 h-8 bg-[#0d9488] text-black rounded-full flex items-center justify-center"><Compass className="w-4 h-4" /></div><span>MERIDIAN // JOURNEY</span></Link>
            <p className="text-[11px] text-white/15 uppercase tracking-[0.2em] max-w-sm leading-relaxed italic">Long-form expedition narratives. Written in the field.</p>
          </div>
          <div><h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#0d9488]">Explore</h4><ul className="space-y-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">{["Expeditions", "Photo_Archive", "Notes", "Map"].map(l => <li key={l}><Link href="#">{l}</Link></li>)}</ul></div>
          <div><h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#0d9488]">Connect</h4><ul className="space-y-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">{["Instagram", "Newsletter", "Podcast", "Press"].map(l => <li key={l}><Link href="#">{l}</Link></li>)}</ul></div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 text-center text-[9px] font-bold text-white/10 uppercase tracking-widest">&copy; 2026 MERIDIAN JOURNEY</div>
      </footer>
    </div>
  );
}
