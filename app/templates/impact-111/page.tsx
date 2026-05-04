"use client";
import { motion, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Orbit, Rocket, Satellite, Search, Menu, X, ArrowRight, Radio, Telescope, Atom, Hexagon, ScanEye, CircuitBoard, Radar, Waypoints, Shield } from "lucide-react";
import "../premium.css";

const MANIFESTS = {
  hero: { probes: "1,842", range: "4.2 AU", bandwidth: "120 Gbps", status: "RELAY_LOCK_ACQUIRED" },
  missions: [
    { id: "helios", name: "HELIOS // PROBE", desc: "Solar-orbit telemetry relay for deep-space communications and heliospheric weather monitoring.", icon: <Orbit className="w-5 h-5" />, specs: ["0.3 AU Perihelion", "Thermal Shield V3", "Photon Sail Backup"] },
    { id: "artemis", name: "ARTEMIS // ARRAY", desc: "Cislunar sensor constellation providing continuous surface mapping and resource prospecting.", icon: <Satellite className="w-5 h-5" />, specs: ["24-Sat Mesh", "LiDAR + Radar", "Autonomous Nav"] },
    { id: "voyager", name: "VOYAGER // LINK", desc: "Interstellar relay network extending communication reach beyond the heliopause boundary.", icon: <Radio className="w-5 h-5" />, specs: ["Deep-Space Band", "Quantum Encrypt", "100yr Mission Life"] },
  ],
  telemetry: [
    { label: "SIGNAL_LOCK", val: 99, color: "#06b6d4" },
    { label: "ORBIT_ACCURACY", val: 97, color: "#06b6d4" },
    { label: "POWER_RESERVE", val: 82, color: "#22c55e" },
    { label: "DATA_THROUGHPUT", val: 91, color: "#06b6d4" },
  ],
  active_probes: [
    { name: "HELIOS-7", orbit: "Solar L1", distance: "0.01 AU", status: "Nominal" },
    { name: "ARTEMIS-12", orbit: "Lunar Polar", distance: "384,400 km", status: "Mapping" },
    { name: "DEEP-RELAY-3", orbit: "Mars Transfer", distance: "1.2 AU", status: "Transit" },
    { name: "VOYAGER-X1", orbit: "Heliosheath", distance: "122 AU", status: "Transmitting" },
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

export default function OrbitRelayPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#040608] text-white font-mono selection:bg-[#06b6d4] selection:text-black overflow-x-hidden">
      {/* BG */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_20%,#051520_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(#06b6d4 0.5px, transparent 0.5px)`, backgroundSize: "40px 40px" }} />
        <div className="absolute top-0 w-full h-[50vh] bg-gradient-to-b from-[#06b6d4]/3 to-transparent" />
        {/* Stars */}
        {[...Array(40)].map((_, i) => (
          <motion.div key={i} animate={{ opacity: [0.1, 0.7, 0.1] }} transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 5 }}
            className="absolute w-px h-px bg-white rounded-full" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} />
        ))}
      </div>

      {/* NAV */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#040608]/90 backdrop-blur-xl py-4 border-b border-white/5" : "bg-transparent py-10"}`}>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-xl font-black tracking-tighter">
            <div className="w-8 h-8 bg-[#06b6d4] rounded-sm flex items-center justify-center text-black"><Orbit className="w-5 h-5" /></div>
            <span className="group-hover:text-[#06b6d4] transition-colors">ORBIT // <span className="text-white/40">RELAY</span></span>
          </Link>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Mission_Control", "Fleet_Status", "Deep_Link", "Telemetry"].map(l => <Link key={l} href="#" className="hover:text-[#06b6d4] transition-colors">{l}</Link>)}
          </div>
          <div className="flex items-center gap-6">
            <MagneticBtn className="px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#06b6d4] transition-all">Launch_Mission</MagneticBtn>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden text-white/60"><Menu className="w-6 h-6" /></button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>{menuOpen && (
        <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-[100] bg-[#040608] p-8 flex flex-col pt-32">
          <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-8 text-white/40"><X className="w-10 h-10" /></button>
          <div className="flex flex-col gap-10 text-5xl font-black tracking-tighter uppercase">
            {["Mission_Control", "Fleet_Status", "Deep_Link", "Telemetry"].map(l => <Link key={l} href="#" onClick={() => setMenuOpen(false)}>{l}</Link>)}
          </div>
        </motion.div>
      )}</AnimatePresence>

      {/* HERO */}
      <section className="relative h-screen flex flex-col justify-center pt-20 overflow-hidden">
        {/* Orbital rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div key={i} animate={{ rotate: 360 }} transition={{ duration: 60 + i * 30, repeat: Infinity, ease: "linear" }}
              className="absolute border border-[#06b6d4]/10 rounded-full" style={{ width: `${300 + i * 200}px`, height: `${300 + i * 200}px` }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#06b6d4] rounded-full shadow-[0_0_10px_#06b6d4]" />
            </motion.div>
          ))}
        </div>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-8">
              <Reveal>
                <div className="flex items-center gap-4 mb-8">
                  <div className="px-3 py-1 bg-[#06b6d4]/10 border border-[#06b6d4]/30 text-[#06b6d4] text-[9px] font-bold uppercase tracking-widest">{MANIFESTS.hero.status}</div>
                  <div className="text-[9px] text-white/30 tracking-widest uppercase">PROBES: {MANIFESTS.hero.probes} // RANGE: {MANIFESTS.hero.range}</div>
                </div>
                <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[0.8] tracking-tighter uppercase mb-10">
                  Deep <br /> <span className="text-[#06b6d4]">Space.</span> <br /> Linked. <br /> <span className="text-white/20">Always.</span>
                </h1>
                <p className="max-w-2xl text-xl text-white/40 leading-relaxed font-light mb-12 uppercase tracking-widest italic">
                  Interplanetary communication infrastructure. Autonomous relay constellations maintaining signal continuity from low Earth orbit to the heliopause and beyond.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <button className="px-12 py-5 bg-[#06b6d4] text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_50px_rgba(6,182,212,0.2)]">Access_Mission_Control</button>
                  <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">View_Fleet_Map</button>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-4 relative hidden lg:block">
              <Reveal delay={0.2}>
                <div className="relative aspect-square bg-[#060a0d] border border-white/5 p-12 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#06b6d4]/5 to-transparent" />
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div><div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">RELAY_BANDWIDTH</div><div className="text-xl font-black text-[#06b6d4]">{MANIFESTS.hero.bandwidth}</div></div>
                      <div className="w-10 h-10 border border-white/5 rounded-full flex items-center justify-center"><Radar className="w-5 h-5 text-white/20 animate-pulse" /></div>
                    </div>
                    <div className="space-y-10 my-10">
                      {MANIFESTS.telemetry.map((s, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest mb-3"><span className="text-white/40">{s.label}</span><span style={{ color: s.color }}>{s.val}%</span></div>
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${s.val}%` }} transition={{ duration: 2, delay: 0.5 + i * 0.1 }} className="h-full" style={{ backgroundColor: s.color }} /></div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-6 border-t border-white/5 flex justify-between items-center text-[8px] font-bold text-white/20 uppercase tracking-widest">
                      <span>DEEP_SPACE_NETWORK</span>
                      <div className="flex items-center gap-2 text-[#06b6d4]"><div className="w-1.5 h-1.5 bg-[#06b6d4] rounded-full animate-ping" /><span>SIGNAL_LOCK</span></div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* MISSIONS */}
      <section className="py-40 bg-[#060a0d] border-y border-white/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">Active <br /> <span className="text-[#06b6d4]">Missions.</span></h2></Reveal>
            <p className="max-w-md text-sm text-white/30 leading-relaxed uppercase tracking-widest font-light italic">Autonomous spacecraft constellations designed for decade-long autonomous operations across the inner and outer solar system.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {MANIFESTS.missions.map((m, i) => (
              <Reveal key={m.id} delay={i * 0.1}>
                <div className="group p-12 bg-[#060a0d] border border-white/5 hover:border-[#06b6d4]/30 transition-all flex flex-col h-full rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#06b6d4]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-[#06b6d4] mb-12 group-hover:bg-[#06b6d4] group-hover:text-black transition-all">{m.icon}</div>
                  <h3 className="text-3xl font-black uppercase mb-6 tracking-tighter group-hover:text-[#06b6d4] transition-colors">{m.name}</h3>
                  <p className="text-sm text-white/40 leading-relaxed mb-12 flex-1 italic">"{m.desc}"</p>
                  <div className="space-y-5 pt-10 border-t border-white/5">
                    {m.specs.map((s, j) => <div key={j} className="flex items-center gap-4 text-[9px] font-bold text-white/20 uppercase tracking-widest"><div className="w-1.5 h-1.5 bg-[#06b6d4] rotate-45" />{s}</div>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FLEET STATUS */}
      <section className="py-40 bg-[#040608]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center">
            <div className="lg:col-span-6">
              <Reveal>
                <div className="relative aspect-video bg-[#060a0d] border border-white/5 rounded-2xl overflow-hidden p-8">
                  <div className="absolute top-6 left-6 text-[8px] font-bold text-white/20 tracking-widest uppercase">ORBITAL_TRACK_VIEW</div>
                  {/* Orbital visualization */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_30px_rgba(250,204,21,0.4)]" />
                    {[80, 140, 200, 280].map((r, i) => (
                      <motion.div key={i} animate={{ rotate: 360 }} transition={{ duration: 10 + i * 8, repeat: Infinity, ease: "linear" }}
                        className="absolute border border-white/5 rounded-full" style={{ width: r, height: r }}>
                        <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#06b6d4] rounded-full shadow-[0_0_6px_#06b6d4]"
                          animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
                      </motion.div>
                    ))}
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-[8px] font-bold text-white/20 tracking-widest uppercase">
                    <span>PROBES_TRACKED: 4</span><div className="text-[#06b6d4]">ALL_NOMINAL</div>
                  </div>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-6">
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#06b6d4] mb-6 block">Active_Fleet</span>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-12 uppercase">Probe <br /> <span className="text-white/20">Status.</span></h2>
                <div className="space-y-8">
                  {MANIFESTS.active_probes.map((p, i) => (
                    <div key={i} className="group flex flex-col md:flex-row justify-between items-center p-8 bg-white/2 border border-white/5 hover:border-[#06b6d4]/30 transition-all">
                      <div className="flex items-center gap-10 mb-6 md:mb-0">
                        <div className="text-2xl font-black uppercase tracking-tighter">{p.name}</div>
                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{p.orbit}</div>
                      </div>
                      <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-white/30">{p.distance}</span>
                        <div className="flex items-center gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full ${p.status === "Nominal" ? "bg-green-500 animate-pulse" : p.status === "Transmitting" ? "bg-cyan-400 animate-pulse" : "bg-yellow-400"}`} />
                          <span>{p.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="py-40 bg-[#060a0d] border-y border-white/5 text-center overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal>
            <h2 className="text-7xl md:text-[12rem] font-black tracking-tighter uppercase leading-[0.85] mb-12 text-white/5">Signal <br /> Reach.</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mt-24">
              {[{ label: "ACTIVE_PROBES", val: "1,842" }, { label: "MAX_RANGE", val: "122 AU" }, { label: "UPTIME_SLA", val: "99.998%" }, { label: "DATA_RELAYED", val: "2.4 PB" }].map((s, i) => (
                <div key={i} className="group"><div className="text-5xl font-black text-white mb-4 group-hover:text-[#06b6d4] transition-colors">{s.val}</div><div className="text-[10px] font-black text-white/20 uppercase tracking-widest">{s.label}</div></div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 bg-[#040608]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">Extend <br /> <span className="text-[#06b6d4]">Reach.</span></h2>
            <p className="max-w-2xl mx-auto text-sm text-white/40 leading-relaxed font-light mb-16 uppercase tracking-widest italic">Humanity's furthest signal relay. Join the mission to build persistent communication infrastructure across the solar system.</p>
            <MagneticBtn className="px-16 py-6 bg-white text-black text-[12px] font-black uppercase tracking-[0.4em] hover:bg-[#06b6d4] transition-all shadow-[0_0_60px_rgba(6,182,212,0.15)]">Initialize_Deep_Link</MagneticBtn>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#040608] border-t border-white/5 py-32 px-6 md:px-12">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10"><div className="w-8 h-8 bg-white text-black rounded-sm flex items-center justify-center"><Orbit className="w-5 h-5" /></div><span>ORBIT // RELAY</span></Link>
            <p className="text-[11px] text-white/20 uppercase tracking-[0.2em] max-w-sm leading-relaxed mb-16 italic">Engineering the communication backbone of interplanetary civilization.</p>
            <div className="flex gap-8">{[Satellite, Telescope, Waypoints].map((Icon, i) => <button key={i} className="text-white/20 hover:text-[#06b6d4] transition-colors"><Icon className="w-5 h-5" /></button>)}</div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#06b6d4]">Missions</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {["Helios_Probe", "Artemis_Array", "Voyager_Link", "Deep_Relay"].map(l => <li key={l} className="hover:text-white transition-colors"><Link href="#">{l}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#06b6d4]">Network</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {["Fleet_Tracker", "Signal_Map", "API_Portal", "Status_Board"].map(l => <li key={l} className="hover:text-white transition-colors"><Link href="#">{l}</Link></li>)}
            </ul>
          </div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[9px] font-bold text-white/10 uppercase tracking-widest">
          <span>&copy; 2026 ORBIT RELAY SYSTEMS. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-10 font-mono"><span>DSN_ONLINE</span><span>SIGNAL_INTEGRITY_OK</span></div>
        </div>
      </footer>
    </div>
  );
}
