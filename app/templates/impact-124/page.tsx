"use client";
import { motion, useInView, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Play, Clapperboard, Film, Menu, X, ArrowRight, Video, Monitor, Aperture, Palette, Wand2, Box, Layers, Sparkles, Camera, Eye } from "lucide-react";
import "../premium.css";

const MANIFESTS = {
  hero: { projects: "220+", awards: "34", studios: "LA + London", status: "ACCEPTING_BRIEFS" },
  reel: [
    { id: "apex", name: "APEX // TITLE", desc: "Main title sequence for HBO limited series. Liquid metal typography dissolving through tectonic landscapes. 90 seconds.", category: "TITLE_SEQUENCE", client: "HBO" },
    { id: "nova", name: "NOVA // LAUNCH", desc: "Product launch film for next-gen EV reveal. Real-time ray-traced environment with procedural particle systems.", category: "BRAND_FILM", client: "Rivian" },
    { id: "echo", name: "ECHO // LIVE", desc: "Real-time generative visual system for world tour. Reactive to audio, MIDI, and crowd biometrics.", category: "LIVE_VISUAL", client: "Massive Attack" },
    { id: "flux", name: "FLUX // RETAIL", desc: "Immersive retail installation — 360° projection mapping with depth-sensor interaction across a 4-story atrium.", category: "INSTALLATION", client: "Gucci" },
  ],
  capabilities: [
    { name: "MOTION // DESIGN", icon: <Play className="w-5 h-5" />, items: ["Title Sequences", "Brand Films", "UI Animation", "Explainers"] },
    { name: "REAL-TIME // 3D", icon: <Box className="w-5 h-5" />, items: ["Unreal Engine", "TouchDesigner", "Notch", "Custom GLSL"] },
    { name: "INTERACTIVE", icon: <Wand2 className="w-5 h-5" />, items: ["Installations", "WebGL / Three.js", "AR Filters", "Projection Mapping"] },
  ],
  clients: ["HBO", "Apple", "Nike", "Gucci", "Rivian", "Spotify", "Massive Attack", "Netflix"],
};

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}>{children}</motion.div>;
}

function MagneticBtn({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 }), sy = useSpring(y, { stiffness: 300, damping: 20 });
  const ref = useRef<HTMLButtonElement>(null);
  return <motion.button ref={ref} style={{ x: sx, y: sy }} onMouseMove={(e) => { const r = ref.current?.getBoundingClientRect(); if (r) { x.set((e.clientX - r.left - r.width / 2) * 0.4); y.set((e.clientY - r.top - r.height / 2) * 0.4); }}} onMouseLeave={() => { x.set(0); y.set(0); }} className={className}>{children}</motion.button>;
}

export default function MorphStudioPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="premium-theme min-h-screen bg-[#060608] text-white font-mono selection:bg-[#e879f9] selection:text-black overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,#1a0820_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(#e879f9 0.5px, transparent 0.5px)`, backgroundSize: "45px 45px" }} />
        {/* Scanning lines */}
        {[...Array(3)].map((_, i) => (
          <motion.div key={i} animate={{ y: ["-100%", "200%"] }} transition={{ duration: 8, repeat: Infinity, delay: i * 2.5, ease: "linear" }}
            className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-[#e879f9]/10 to-transparent" />
        ))}
      </div>

      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#060608]/90 backdrop-blur-xl py-4 border-b border-white/5" : "bg-transparent py-10"}`}>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-xl font-black tracking-tighter">
            <div className="w-8 h-8 bg-[#e879f9] rounded-sm flex items-center justify-center text-black"><Play className="w-4 h-4 ml-0.5" /></div>
            <span className="group-hover:text-[#e879f9] transition-colors">MORPH // <span className="text-white/40">STUDIO</span></span>
          </Link>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Reel", "Capabilities", "About", "Contact"].map(l => <Link key={l} href="#" className="hover:text-[#e879f9] transition-colors">{l}</Link>)}
          </div>
          <div className="flex items-center gap-6">
            <MagneticBtn className="px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#e879f9] transition-all">Send_Brief</MagneticBtn>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden text-white/60"><Menu className="w-6 h-6" /></button>
          </div>
        </div>
      </nav>

      <AnimatePresence>{menuOpen && (
        <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-[100] bg-[#060608] p-8 flex flex-col pt-32">
          <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-8 text-white/40"><X className="w-10 h-10" /></button>
          <div className="flex flex-col gap-10 text-5xl font-black tracking-tighter uppercase">
            {["Reel", "Capabilities", "About", "Contact"].map(l => <Link key={l} href="#" onClick={() => setMenuOpen(false)}>{l}</Link>)}
          </div>
        </motion.div>
      )}</AnimatePresence>

      {/* HERO */}
      <motion.section ref={heroRef} style={{ scale: heroScale, opacity: heroOpacity }} className="relative h-screen flex flex-col justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {/* Morphing shape */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div animate={{ borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "70% 30% 30% 70% / 70% 70% 30% 30%", "30% 70% 70% 30% / 30% 30% 70% 70%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="w-[400px] h-[400px] bg-gradient-to-br from-[#e879f9]/10 via-[#a855f7]/5 to-transparent border border-[#e879f9]/10" />
          </div>
        </div>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
          <Reveal>
            <div className="flex items-center gap-4 mb-8">
              <div className="px-3 py-1 bg-[#e879f9]/10 border border-[#e879f9]/30 text-[#e879f9] text-[9px] font-bold uppercase tracking-widest">{MANIFESTS.hero.status}</div>
              <div className="text-[9px] text-white/30 tracking-widest uppercase">PROJECTS: {MANIFESTS.hero.projects} // AWARDS: {MANIFESTS.hero.awards}</div>
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[0.8] tracking-tighter uppercase mb-10">
              Motion <br /> <span className="text-[#e879f9]">Design.</span> <br /> Real <br /> <span className="text-white/20">Time.</span>
            </h1>
            <p className="max-w-2xl text-xl text-white/40 leading-relaxed font-light mb-12 uppercase tracking-widest italic">
              A motion and real-time studio creating title sequences, brand films, live visuals, and immersive installations for culture-shaping brands.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="px-12 py-5 bg-[#e879f9] text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_50px_rgba(232,121,249,0.2)]">Watch_Reel</button>
              <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">View_Work</button>
            </div>
          </Reveal>
        </div>
      </motion.section>

      {/* REEL / PROJECTS */}
      <section className="py-40 bg-[#080810] border-y border-white/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">Selected <br /> <span className="text-[#e879f9]">Work.</span></h2></Reveal>
            <p className="max-w-md text-sm text-white/30 leading-relaxed uppercase tracking-widest font-light italic">A selection from our portfolio spanning title design, brand film, live visual, and spatial installation.</p>
          </div>
          <div className="space-y-2">
            {MANIFESTS.reel.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.05}>
                <div className="group flex flex-col md:flex-row justify-between items-center p-10 md:p-14 border-b border-white/5 hover:bg-[#e879f9] hover:text-black transition-all duration-500 cursor-pointer"
                  onMouseEnter={() => setHoveredProject(r.id)} onMouseLeave={() => setHoveredProject(null)}>
                  <div className="flex-1 mb-6 md:mb-0">
                    <div className="flex items-center gap-6 mb-4">
                      <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">{r.name}</h3>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/20 group-hover:text-black/40">{r.category}</span>
                    </div>
                    <p className="text-sm text-white/40 group-hover:text-black/50 leading-relaxed max-w-2xl italic transition-colors">"{r.desc}"</p>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="text-[10px] font-bold text-white/20 group-hover:text-black/40 uppercase tracking-widest">{r.client}</span>
                    <motion.div animate={{ x: hoveredProject === r.id ? 5 : 0 }} className="opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight className="w-5 h-5" /></motion.div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="py-40 bg-[#060608]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal>
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#e879f9] mb-6 block">What_We_Do</span>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-24 uppercase">Core <br /> <span className="text-white/20">Skills.</span></h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {MANIFESTS.capabilities.map((c, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group p-12 bg-[#080810] border border-white/5 hover:border-[#e879f9]/30 transition-all flex flex-col h-full rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#e879f9]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-[#e879f9] mb-12 group-hover:bg-[#e879f9] group-hover:text-black transition-all">{c.icon}</div>
                  <h3 className="text-3xl font-black uppercase mb-8 tracking-tighter group-hover:text-[#e879f9] transition-colors">{c.name}</h3>
                  <div className="space-y-5 pt-8 border-t border-white/5">
                    {c.items.map((item, j) => <div key={j} className="flex items-center gap-4 text-[9px] font-bold text-white/20 uppercase tracking-widest"><div className="w-1.5 h-1.5 bg-[#e879f9] rotate-45" />{item}</div>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section className="py-40 bg-[#080810] border-y border-white/5 text-center overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal>
            <h2 className="text-7xl md:text-[12rem] font-black tracking-tighter uppercase leading-[0.85] mb-12 text-white/5">Clients.</h2>
            <div className="flex flex-wrap justify-center gap-12 mt-24">
              {MANIFESTS.clients.map((c, i) => (
                <motion.div key={i} whileHover={{ scale: 1.1, color: "#e879f9" }}
                  className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white/15 transition-colors cursor-default">{c}</motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 bg-[#060608]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">Start <br /> <span className="text-[#e879f9]">Moving.</span></h2>
            <p className="max-w-2xl mx-auto text-sm text-white/40 leading-relaxed font-light mb-16 uppercase tracking-widest italic">We partner with brands who understand that motion is the most powerful design language. Send us your brief.</p>
            <MagneticBtn className="px-16 py-6 bg-white text-black text-[12px] font-black uppercase tracking-[0.4em] hover:bg-[#e879f9] transition-all shadow-[0_0_60px_rgba(232,121,249,0.15)]">Send_Brief</MagneticBtn>
          </Reveal>
        </div>
      </section>

      <footer className="bg-[#060608] border-t border-white/5 py-32 px-6 md:px-12">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10"><div className="w-8 h-8 bg-white text-black rounded-sm flex items-center justify-center"><Play className="w-4 h-4 ml-0.5" /></div><span>MORPH // STUDIO</span></Link>
            <p className="text-[11px] text-white/20 uppercase tracking-[0.2em] max-w-sm leading-relaxed mb-16 italic">Motion design, real-time 3D, and immersive experiences. LA + London.</p>
            <div className="flex gap-8">{[Film, Camera, Eye].map((Icon, i) => <button key={i} className="text-white/20 hover:text-[#e879f9] transition-colors"><Icon className="w-5 h-5" /></button>)}</div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#e879f9]">Work</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {["Title_Sequences", "Brand_Films", "Live_Visuals", "Installations"].map(l => <li key={l} className="hover:text-white transition-colors"><Link href="#">{l}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#e879f9]">Studio</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {["About", "Careers", "Press", "Contact"].map(l => <li key={l} className="hover:text-white transition-colors"><Link href="#">{l}</Link></li>)}
            </ul>
          </div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[9px] font-bold text-white/10 uppercase tracking-widest">
          <span>&copy; 2026 MORPH STUDIO. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-10 font-mono"><span>LA_STUDIO</span><span>LONDON_STUDIO</span></div>
        </div>
      </footer>
    </div>
  );
}
