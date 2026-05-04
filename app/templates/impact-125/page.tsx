"use client";
import { motion, useInView, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Zap, Scan, Layers, Menu, X, ArrowRight, MousePointer2, Fingerprint, Globe, Radio, Activity, Wifi, Signal, Cpu, Eye, Radar } from "lucide-react";
import "../premium.css";

const MANIFESTS = {
  hero: { experiences: "86", patents: "12", studios: "Berlin + Seoul", status: "LAB_OPEN" },
  projects: [
    { id: "tactile", name: "TACTILE // FIELD", desc: "Pressure-sensitive floor installation spanning 400m². Visitors' footsteps generate real-time generative audio-visual compositions projected on surrounding walls.", category: "INSTALLATION", tech: "Lidar + Max/MSP" },
    { id: "resonance", name: "RESONANCE // WALL", desc: "Kinetic wall of 2,400 motorized tiles that responds to ambient sound. Each tile moves independently, creating a living surface that breathes with the city.", category: "KINETIC", tech: "Arduino + Custom PCB" },
    { id: "phantom", name: "PHANTOM // TOUCH", desc: "Mid-air haptic interface using focused ultrasound. Users feel invisible buttons, textures, and shapes — no screen, no wearable, no contact.", category: "HAPTIC", tech: "Ultrasound Array" },
    { id: "echo", name: "ECHO // SPACE", desc: "Spatial audio environment where sound objects exist in 3D space. Walk through a room of invisible instruments — each one plays as you pass.", category: "SPATIAL_AUDIO", tech: "Ambisonic + Tracking" },
  ],
  research: [
    { name: "HAPTIC // COMPUTING", icon: <Fingerprint className="w-5 h-5" />, items: ["Mid-air Feedback", "Ultrasonic Arrays", "Tactile Rendering", "Force Fields"] },
    { name: "SPATIAL // SENSING", icon: <Radar className="w-5 h-5" />, items: ["Lidar Mapping", "Depth Cameras", "Body Tracking", "Gesture Recognition"] },
    { name: "GENERATIVE // SYSTEMS", icon: <Cpu className="w-5 h-5" />, items: ["Neural Audio", "Procedural Visuals", "Autonomous Agents", "Self-Organizing"] },
  ],
  telemetry: [
    { label: "LATENCY_MS", val: 4, max: 20, color: "#22d3ee" },
    { label: "TRACKING_FPS", val: 120, max: 144, color: "#22d3ee" },
    { label: "HAPTIC_RES", val: 0.5, max: 1, color: "#22d3ee", unit: "mm" },
    { label: "SPATIAL_ACC", val: 99.2, max: 100, color: "#22d3ee", unit: "%" },
  ],
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

// Custom cursor aura
function CursorAura() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const springX = useSpring(useMotionValue(0), { stiffness: 100, damping: 20 });
  const springY = useSpring(useMotionValue(0), { stiffness: 100, damping: 20 });
  useEffect(() => {
    const move = (e: MouseEvent) => { setPos({ x: e.clientX, y: e.clientY }); springX.set(e.clientX); springY.set(e.clientY); setVisible(true); };
    const leave = () => setVisible(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseleave", leave); };
  }, [springX, springY]);
  if (!visible) return null;
  return (
    <motion.div className="fixed pointer-events-none z-[200] mix-blend-difference" style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}>
      <div className="w-32 h-32 rounded-full bg-[#22d3ee]/20 blur-xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#22d3ee]/60" />
    </motion.div>
  );
}

export default function AuraInteractivePage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="premium-theme min-h-screen bg-[#050608] text-white font-mono selection:bg-[#22d3ee] selection:text-black overflow-x-hidden cursor-none">
      <CursorAura />
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#061520_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(#22d3ee 0.5px, transparent 0.5px)`, backgroundSize: "40px 40px" }} />
        {/* Radar sweep */}
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.04]"
          style={{ background: "conic-gradient(from 0deg, transparent 0deg, #22d3ee 15deg, transparent 30deg)" }} />
      </div>

      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 cursor-auto ${scrolled ? "bg-[#050608]/90 backdrop-blur-xl py-4 border-b border-white/5" : "bg-transparent py-10"}`}>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-xl font-black tracking-tighter cursor-pointer">
            <div className="w-8 h-8 bg-[#22d3ee] rounded-full flex items-center justify-center text-black"><Radio className="w-4 h-4" /></div>
            <span className="group-hover:text-[#22d3ee] transition-colors">AURA // <span className="text-white/40">INTERACTIVE</span></span>
          </Link>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Projects", "Research", "Lab", "Connect"].map(l => <Link key={l} href="#" className="hover:text-[#22d3ee] transition-colors cursor-pointer">{l}</Link>)}
          </div>
          <div className="flex items-center gap-6">
            <MagneticBtn className="px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#22d3ee] transition-all cursor-pointer">Collaborate</MagneticBtn>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden text-white/60 cursor-pointer"><Menu className="w-6 h-6" /></button>
          </div>
        </div>
      </nav>

      <AnimatePresence>{menuOpen && (
        <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-[100] bg-[#050608] p-8 flex flex-col pt-32 cursor-auto">
          <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-8 text-white/40"><X className="w-10 h-10" /></button>
          <div className="flex flex-col gap-10 text-5xl font-black tracking-tighter uppercase">
            {["Projects", "Research", "Lab", "Connect"].map(l => <Link key={l} href="#" onClick={() => setMenuOpen(false)}>{l}</Link>)}
          </div>
        </motion.div>
      )}</AnimatePresence>

      {/* HERO */}
      <motion.section ref={heroRef} style={{ opacity: heroOpacity }} className="relative h-screen flex flex-col justify-center pt-20 overflow-hidden">
        {/* Expanding sensor rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div key={i} animate={{ scale: [0.3, 2.5], opacity: [0.15, 0] }} transition={{ duration: 5, repeat: Infinity, delay: i * 1 }}
              className="absolute w-40 h-40 border border-[#22d3ee]/20 rounded-full" />
          ))}
        </div>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
          <Reveal>
            <div className="flex items-center gap-4 mb-8">
              <div className="px-3 py-1 bg-[#22d3ee]/10 border border-[#22d3ee]/30 text-[#22d3ee] text-[9px] font-bold uppercase tracking-widest">{MANIFESTS.hero.status}</div>
              <div className="text-[9px] text-white/30 tracking-widest uppercase">EXPERIENCES: {MANIFESTS.hero.experiences} // PATENTS: {MANIFESTS.hero.patents}</div>
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[0.8] tracking-tighter uppercase mb-10">
              Touch <br /> <span className="text-[#22d3ee]">The</span> <br /> Invisible. <br /> <span className="text-white/15">Aura.</span>
            </h1>
            <p className="max-w-2xl text-xl text-white/40 leading-relaxed font-light mb-12 uppercase tracking-widest italic">
              An interactive design lab building haptic interfaces, spatial installations, and generative environments that respond to the human body.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="px-12 py-5 bg-[#22d3ee] text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_50px_rgba(34,211,238,0.2)] cursor-pointer">Enter_Lab</button>
              <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all cursor-pointer">View_Work</button>
            </div>
          </Reveal>
        </div>
      </motion.section>

      {/* PROJECTS */}
      <section className="py-40 bg-[#080a10] border-y border-white/5 cursor-auto">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">Active <br /> <span className="text-[#22d3ee]">Projects.</span></h2></Reveal>
            <p className="max-w-md text-sm text-white/30 leading-relaxed uppercase tracking-widest font-light italic">Installations, kinetic sculptures, and haptic interfaces at the boundary of physical and digital.</p>
          </div>
          <div className="space-y-2">
            {MANIFESTS.projects.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}>
                <div className="group flex flex-col md:flex-row justify-between items-center p-10 md:p-14 border-b border-white/5 hover:bg-[#22d3ee] hover:text-black transition-all duration-500 cursor-pointer"
                  onMouseEnter={() => setHoveredProject(p.id)} onMouseLeave={() => setHoveredProject(null)}>
                  <div className="flex-1 mb-6 md:mb-0">
                    <div className="flex items-center gap-6 mb-4">
                      <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">{p.name}</h3>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/20 group-hover:text-black/40">{p.category}</span>
                    </div>
                    <p className="text-sm text-white/40 group-hover:text-black/50 leading-relaxed max-w-2xl italic transition-colors">&ldquo;{p.desc}&rdquo;</p>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="text-[10px] font-bold text-white/20 group-hover:text-black/40 uppercase tracking-widest">{p.tech}</span>
                    <motion.div animate={{ x: hoveredProject === p.id ? 5 : 0 }} className="opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight className="w-5 h-5" /></motion.div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* RESEARCH */}
      <section className="py-40 bg-[#050608] cursor-auto">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-start">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#22d3ee] mb-6 block">Research_Areas</span>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-12 uppercase">Core <br /> <span className="text-white/20">Research.</span></h2>
                <p className="text-sm text-white/30 leading-relaxed uppercase tracking-widest font-light italic">Three interconnected research streams converging at the intersection of sensing, computation, and human perception.</p>
              </Reveal>
              {/* Telemetry panel */}
              <Reveal delay={0.2}>
                <div className="mt-16 p-10 bg-[#080a10] border border-white/5 rounded-2xl">
                  <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest mb-8">SYSTEM_TELEMETRY</div>
                  <div className="space-y-8">
                    {MANIFESTS.telemetry.map((t, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest mb-3">
                          <span className="text-white/40">{t.label}</span>
                          <span style={{ color: t.color }}>{t.val}{t.unit || ""}</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${(t.val / t.max) * 100}%` }} transition={{ duration: 2, delay: 0.5 + i * 0.1 }} viewport={{ once: true }}
                            className="h-full" style={{ backgroundColor: t.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 gap-12">
                {MANIFESTS.research.map((r, i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <div className="group p-12 bg-[#080a10] border border-white/5 hover:border-[#22d3ee]/30 transition-all rounded-3xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#22d3ee]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-start gap-8">
                        <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-[#22d3ee] shrink-0 group-hover:bg-[#22d3ee] group-hover:text-black transition-all">{r.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-3xl font-black uppercase mb-6 tracking-tighter group-hover:text-[#22d3ee] transition-colors">{r.name}</h3>
                          <div className="grid grid-cols-2 gap-4">
                            {r.items.map((item, j) => <div key={j} className="flex items-center gap-3 text-[9px] font-bold text-white/20 uppercase tracking-widest"><div className="w-1.5 h-1.5 bg-[#22d3ee] rotate-45" />{item}</div>)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="py-40 bg-[#080a10] border-y border-white/5 text-center overflow-hidden cursor-auto">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal>
            <h2 className="text-7xl md:text-[12rem] font-black tracking-tighter uppercase leading-[0.85] mb-12 text-white/5">Sense.</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mt-24">
              {[{ label: "EXPERIENCES_BUILT", val: "86" }, { label: "PATENTS_FILED", val: "12" }, { label: "RESEARCH_PAPERS", val: "34" }, { label: "LAB_VISITORS", val: "280K" }].map((s, i) => (
                <div key={i} className="group"><div className="text-5xl font-black text-white mb-4 group-hover:text-[#22d3ee] transition-colors">{s.val}</div><div className="text-[10px] font-black text-white/20 uppercase tracking-widest">{s.label}</div></div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 bg-[#050608] cursor-auto">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">Feel <br /> <span className="text-[#22d3ee]">More.</span></h2>
            <p className="max-w-2xl mx-auto text-sm text-white/40 leading-relaxed font-light mb-16 uppercase tracking-widest italic">We collaborate with museums, brands, and research institutions to create experiences that redefine how humans interact with technology.</p>
            <MagneticBtn className="px-16 py-6 bg-white text-black text-[12px] font-black uppercase tracking-[0.4em] hover:bg-[#22d3ee] transition-all shadow-[0_0_60px_rgba(34,211,238,0.15)] cursor-pointer">Start_Collaboration</MagneticBtn>
          </Reveal>
        </div>
      </section>

      <footer className="bg-[#050608] border-t border-white/5 py-32 px-6 md:px-12 cursor-auto">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10"><div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center"><Radio className="w-4 h-4" /></div><span>AURA // INTERACTIVE</span></Link>
            <p className="text-[11px] text-white/20 uppercase tracking-[0.2em] max-w-sm leading-relaxed mb-16 italic">Interactive design lab. Haptic computing, spatial sensing, generative systems. Berlin + Seoul.</p>
            <div className="flex gap-8">{[Fingerprint, Signal, Eye].map((Icon, i) => <button key={i} className="text-white/20 hover:text-[#22d3ee] transition-colors"><Icon className="w-5 h-5" /></button>)}</div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#22d3ee]">Work</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {["Installations", "Haptic_Interfaces", "Kinetic_Sculpture", "Spatial_Audio"].map(l => <li key={l} className="hover:text-white transition-colors"><Link href="#">{l}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#22d3ee]">Lab</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {["Research", "Publications", "Open_Source", "Residencies"].map(l => <li key={l} className="hover:text-white transition-colors"><Link href="#">{l}</Link></li>)}
            </ul>
          </div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[9px] font-bold text-white/10 uppercase tracking-widest">
          <span>&copy; 2026 AURA INTERACTIVE. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-10 font-mono"><span>BERLIN_DE</span><span>SEOUL_KR</span></div>
        </div>
      </footer>
    </div>
  );
}
