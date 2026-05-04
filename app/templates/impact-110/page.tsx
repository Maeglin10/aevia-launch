"use client";
import { motion, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Flame, Wind, Thermometer, Search, Menu, X, Mountain, TreePine, Droplets, Cloud, Sun, Compass, MapPin, ShieldAlert, Eye, Radio } from "lucide-react";
import "../premium.css";

const MANIFESTS = {
  hero: { fires_tracked: "2,841", drones: "380", accuracy: "99.2%", status: "SENTINEL_ACTIVE" },
  systems: [
    { id: "eye", name: "HAWK // EYE", desc: "Orbital thermal imaging array for early wildfire detection across continental forested zones.", icon: <Eye className="w-5 h-5" />, specs: ["IR + Multispectral", "3m Resolution", "15min Revisit"] },
    { id: "swarm", name: "SWARM // WING", desc: "Autonomous drone formations for real-time perimeter mapping and suppression coordination.", icon: <Wind className="w-5 h-5" />, specs: ["48hr Endurance", "FLIR Payload", "AI Path-Planning"] },
    { id: "shield", name: "FIRE // SHIELD", desc: "Predictive ignition modeling using topography, vegetation moisture, and atmospheric telemetry.", icon: <ShieldAlert className="w-5 h-5" />, specs: ["72hr Forecast", "ML Ensemble", "Wind-Vector Sim"] },
  ],
  telemetry: [
    { label: "DETECTION_SPEED", val: 98, color: "#f97316" },
    { label: "SUPPRESSION_RATE", val: 87, color: "#f97316" },
    { label: "DRONE_FLEET_READY", val: 94, color: "#f97316" },
    { label: "SATELLITE_UPLINK", val: 100, color: "#22c55e" },
  ],
  active_fires: [
    { zone: "Sierra_NV_04", severity: "High", hectares: "1,200", status: "Containing" },
    { zone: "Cascadia_OR_11", severity: "Medium", hectares: "340", status: "Monitored" },
    { zone: "Boreal_BC_02", severity: "Low", hectares: "85", status: "Suppressed" },
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

export default function PyroSentinelPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#0a0604] text-white font-mono selection:bg-[#f97316] selection:text-black overflow-x-hidden">
      {/* BG */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_90%,#1a0a04_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(249,115,22,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.1) 1px, transparent 1px)`, backgroundSize: "70px 70px" }} />
        <div className="absolute bottom-0 w-full h-[40vh] bg-gradient-to-t from-[#f97316]/5 to-transparent" />
      </div>

      {/* NAV */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#0a0604]/90 backdrop-blur-xl py-4 border-b border-white/5" : "bg-transparent py-10"}`}>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-xl font-black tracking-tighter">
            <div className="w-8 h-8 bg-[#f97316] rounded-sm flex items-center justify-center text-black"><Flame className="w-5 h-5" /></div>
            <span className="group-hover:text-[#f97316] transition-colors">PYRO // <span className="text-white/40">SENTINEL</span></span>
          </Link>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Fire_Map", "Fleet_Status", "Forecasting", "Command"].map(l => <Link key={l} href="#" className="hover:text-[#f97316] transition-colors">{l}</Link>)}
          </div>
          <div className="flex items-center gap-6">
            <MagneticBtn className="px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#f97316] transition-all">Access_Command</MagneticBtn>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden text-white/60"><Menu className="w-6 h-6" /></button>
          </div>
        </div>
      </nav>

      {/* MOBILE */}
      <AnimatePresence>{menuOpen && (
        <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-[100] bg-[#0a0604] p-8 flex flex-col pt-32">
          <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-8 text-white/40"><X className="w-10 h-10" /></button>
          <div className="flex flex-col gap-10 text-5xl font-black tracking-tighter uppercase">
            {["Fire_Map", "Fleet_Status", "Forecasting", "Command"].map(l => <Link key={l} href="#" onClick={() => setMenuOpen(false)}>{l}</Link>)}
          </div>
        </motion.div>
      )}</AnimatePresence>

      {/* HERO */}
      <section className="relative h-screen flex flex-col justify-center pt-20 overflow-hidden">
        {/* Heat shimmer effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div key={i} animate={{ y: [0, -20, 0], opacity: [0.02, 0.06, 0.02] }} transition={{ duration: 4, repeat: Infinity, delay: i * 0.8 }}
              className="absolute w-full h-32 bg-gradient-to-r from-transparent via-[#f97316]/10 to-transparent" style={{ bottom: `${i * 15}%` }} />
          ))}
        </div>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-8">
              <Reveal>
                <div className="flex items-center gap-4 mb-8">
                  <div className="px-3 py-1 bg-[#f97316]/10 border border-[#f97316]/30 text-[#f97316] text-[9px] font-bold uppercase tracking-widest">{MANIFESTS.hero.status}</div>
                  <div className="text-[9px] text-white/30 tracking-widest uppercase">FIRES: {MANIFESTS.hero.fires_tracked} // DRONES: {MANIFESTS.hero.drones}</div>
                </div>
                <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[0.8] tracking-tighter uppercase mb-10">
                  Wildfire <br /> <span className="text-[#f97316]">Defense.</span> <br /> Autonomous <br /> <span className="text-white/20">Response.</span>
                </h1>
                <p className="max-w-2xl text-xl text-white/40 leading-relaxed font-light mb-12 uppercase tracking-widest italic">
                  AI-driven wildfire detection, prediction, and suppression coordination. Protecting forests, communities, and ecosystems with orbital and drone-based sentinel networks.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <button className="px-12 py-5 bg-[#f97316] text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_50px_rgba(249,115,22,0.2)]">Launch_Sentinel</button>
                  <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">View_Fire_Map</button>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-4 relative hidden lg:block">
              <Reveal delay={0.2}>
                <div className="relative aspect-square bg-[#0d0806] border border-white/5 p-12 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#f97316]/5 to-transparent" />
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div><div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">DETECTION_ACC</div><div className="text-xl font-black text-[#f97316]">{MANIFESTS.hero.accuracy}</div></div>
                      <div className="w-10 h-10 border border-white/5 rounded-full flex items-center justify-center"><Thermometer className="w-5 h-5 text-white/20 animate-pulse" /></div>
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
                      <span>THERMAL_SCAN_ON</span>
                      <div className="flex items-center gap-2 text-[#f97316]"><div className="w-1.5 h-1.5 bg-[#f97316] rounded-full animate-ping" /><span>MONITORING</span></div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* SYSTEMS */}
      <section className="py-40 bg-[#0d0806] border-y border-white/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">Defense <br /> <span className="text-[#f97316]">Systems.</span></h2></Reveal>
            <p className="max-w-md text-sm text-white/30 leading-relaxed uppercase tracking-widest font-light italic">From orbital detection to ground-level suppression, an integrated defense stack engineered for sub-minute wildfire response.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {MANIFESTS.systems.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.1}>
                <div className="group p-12 bg-[#0d0806] border border-white/5 hover:border-[#f97316]/30 transition-all flex flex-col h-full rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#f97316]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-[#f97316] mb-12 group-hover:bg-[#f97316] group-hover:text-black transition-all">{p.icon}</div>
                  <h3 className="text-3xl font-black uppercase mb-6 tracking-tighter group-hover:text-[#f97316] transition-colors">{p.name}</h3>
                  <p className="text-sm text-white/40 leading-relaxed mb-12 flex-1 italic">"{p.desc}"</p>
                  <div className="space-y-5 pt-10 border-t border-white/5">
                    {p.specs.map((s, j) => <div key={j} className="flex items-center gap-4 text-[9px] font-bold text-white/20 uppercase tracking-widest"><div className="w-1.5 h-1.5 bg-[#f97316] rotate-45" />{s}</div>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ACTIVE FIRES */}
      <section className="py-40 bg-[#0a0604]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center">
            <div className="lg:col-span-6">
              <Reveal>
                <div className="relative aspect-video bg-[#0d0806] border border-white/5 rounded-2xl overflow-hidden p-8">
                  <div className="absolute top-6 left-6 text-[8px] font-bold text-white/20 tracking-widest uppercase">THERMAL_OVERLAY_LIVE</div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {[...Array(12)].map((_, i) => (
                      <motion.div key={i} animate={{ opacity: [0.05, 0.3, 0.05], scale: [1, 1.5, 1] }} transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: i * 0.2 }}
                        className="absolute w-6 h-6 bg-[#f97316]/30 rounded-full blur-md" style={{ left: `${15 + Math.random() * 70}%`, top: `${15 + Math.random() * 70}%` }} />
                    ))}
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-[8px] font-bold text-white/20 tracking-widest uppercase">
                    <span>HOTSPOTS: 12</span><div className="text-[#f97316]">IR_LOCKED</div>
                  </div>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-6">
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#f97316] mb-6 block">Active_Incidents</span>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-12 uppercase">Fire <br /> <span className="text-white/20">Status.</span></h2>
                <div className="space-y-8">
                  {MANIFESTS.active_fires.map((f, i) => (
                    <div key={i} className="group flex flex-col md:flex-row justify-between items-center p-8 bg-white/2 border border-white/5 hover:border-[#f97316]/30 transition-all">
                      <div className="flex items-center gap-10 mb-6 md:mb-0">
                        <div className="text-2xl font-black uppercase tracking-tighter">{f.zone}</div>
                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{f.hectares} HA</div>
                      </div>
                      <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest">
                        <span className={`px-2 py-1 rounded text-[8px] ${f.severity === "High" ? "bg-red-500/20 text-red-400" : f.severity === "Medium" ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}`}>{f.severity}</span>
                        <div className="flex items-center gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full ${f.status === "Containing" ? "bg-orange-500 animate-pulse" : f.status === "Suppressed" ? "bg-green-500" : "bg-yellow-500"}`} />
                          <span>{f.status}</span>
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
      <section className="py-40 bg-[#0d0806] border-y border-white/5 text-center overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal>
            <h2 className="text-7xl md:text-[12rem] font-black tracking-tighter uppercase leading-[0.85] mb-12 text-white/5">Zero <br /> Burn.</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mt-24">
              {[{ label: "FIRES_PREVENTED", val: "1,400+" }, { label: "RESPONSE_TIME", val: "<8min" }, { label: "AREA_PROTECTED", val: "12M ha" }, { label: "COMMUNITIES_SAFE", val: "2,200" }].map((s, i) => (
                <div key={i} className="group"><div className="text-5xl font-black text-white mb-4 group-hover:text-[#f97316] transition-colors">{s.val}</div><div className="text-[10px] font-black text-white/20 uppercase tracking-widest">{s.label}</div></div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 bg-[#0a0604]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">Protect <br /> <span className="text-[#f97316]">Earth.</span></h2>
            <p className="max-w-2xl mx-auto text-sm text-white/40 leading-relaxed font-light mb-16 uppercase tracking-widest italic">Every minute matters. Deploy AI-driven wildfire defense systems to protect forests, wildlife, and communities before ignition spreads.</p>
            <MagneticBtn className="px-16 py-6 bg-white text-black text-[12px] font-black uppercase tracking-[0.4em] hover:bg-[#f97316] transition-all shadow-[0_0_60px_rgba(249,115,22,0.15)]">Deploy_Sentinel_Grid</MagneticBtn>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0a0604] border-t border-white/5 py-32 px-6 md:px-12">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10"><div className="w-8 h-8 bg-white text-black rounded-sm flex items-center justify-center"><Flame className="w-5 h-5" /></div><span>PYRO // SENTINEL</span></Link>
            <p className="text-[11px] text-white/20 uppercase tracking-[0.2em] max-w-sm leading-relaxed mb-16 italic">AI-powered wildfire defense infrastructure protecting planetary forests and communities.</p>
            <div className="flex gap-8">{[Mountain, TreePine, Cloud].map((Icon, i) => <button key={i} className="text-white/20 hover:text-[#f97316] transition-colors"><Icon className="w-5 h-5" /></button>)}</div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#f97316]">Systems</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {["Hawk_Eye", "Swarm_Wing", "Fire_Shield", "Command_Hub"].map(l => <li key={l} className="hover:text-white transition-colors"><Link href="#">{l}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#f97316]">Intel</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {["Live_Fire_Map", "Forecast_API", "Research_Papers", "System_Status"].map(l => <li key={l} className="hover:text-white transition-colors"><Link href="#">{l}</Link></li>)}
            </ul>
          </div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[9px] font-bold text-white/10 uppercase tracking-widest">
          <span>&copy; 2026 PYRO SENTINEL SYSTEMS. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-10 font-mono"><span>THERMAL_SCAN_ON</span><span>ALL_ZONES_MONITORED</span></div>
        </div>
      </footer>
    </div>
  );
}
