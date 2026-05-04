"use client";
import { motion, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Satellite, Radio, Signal, Search, Menu, X, ArrowRight, Wifi, MapPin, Antenna, Server, Globe, ShieldCheck, Gauge } from "lucide-react";
import "../premium.css";

const MANIFESTS = {
  hero: { nodes: "12,400", coverage: "99.7%", latency: "4ms", status: "MESH_OPTIMAL" },
  products: [
    { id: "relay", name: "RELAY // NODE", desc: "Self-healing mesh relay for urban infrastructure with adaptive frequency hopping.", icon: <Antenna className="w-5 h-5" />, specs: ["10km Range", "Solar-Powered", "IP68 Rated"] },
    { id: "core", name: "CORE // HUB", desc: "Central orchestration unit for multi-protocol mesh networks and edge compute.", icon: <Server className="w-5 h-5" />, specs: ["1Gbps Backhaul", "Edge ML", "Zero-Trust Auth"] },
    { id: "sense", name: "SENSE // ARRAY", desc: "Environmental sensor grid for air quality, seismic, and hydrological monitoring.", icon: <Gauge className="w-5 h-5" />, specs: ["40+ Sensors", "Sub-ppm Accuracy", "5yr Battery"] },
  ],
  telemetry: [
    { label: "NETWORK_UPTIME", val: 99, color: "#a855f7" },
    { label: "PACKET_INTEGRITY", val: 97, color: "#a855f7" },
    { label: "NODE_HEALTH", val: 94, color: "#a855f7" },
    { label: "EDGE_COMPUTE_LOAD", val: 62, color: "#f59e0b" },
  ],
  deployments: [
    { region: "APAC_GRID", nodes: "4,200", protocol: "LoRa_Mesh", status: "Operational" },
    { region: "EU_WEST", nodes: "3,100", protocol: "NB-IoT", status: "Expanding" },
    { region: "LATAM_SOUTH", nodes: "2,800", protocol: "Hybrid", status: "Active" },
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

export default function SignalMeshPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  const accent = "#a855f7";

  return (
    <div className="premium-theme min-h-screen bg-[#06050a] text-white font-mono selection:bg-[#a855f7] selection:text-black overflow-x-hidden">
      {/* BG */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,#150a20_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `radial-gradient(${accent} 1px, transparent 1px)`, backgroundSize: "50px 50px" }} />
        <div className="absolute bottom-0 w-full h-[50vh] bg-gradient-to-t from-[#a855f7]/5 to-transparent" />
      </div>

      {/* NAV */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#06050a]/90 backdrop-blur-xl py-4 border-b border-white/5" : "bg-transparent py-10"}`}>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-xl font-black tracking-tighter">
            <div className="w-8 h-8 bg-[#a855f7] rounded-sm flex items-center justify-center text-black"><Signal className="w-5 h-5" /></div>
            <span className="group-hover:text-[#a855f7] transition-colors">SIGNAL // <span className="text-white/40">MESH</span></span>
          </Link>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Network_Map", "Hardware", "Deployments", "Telemetry"].map(l => <Link key={l} href="#" className="hover:text-[#a855f7] transition-colors">{l}</Link>)}
          </div>
          <div className="flex items-center gap-6">
            <MagneticBtn className="px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#a855f7] transition-all">Deploy_Node</MagneticBtn>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden text-white/60"><Menu className="w-6 h-6" /></button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>{menuOpen && (
        <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-[100] bg-[#06050a] p-8 flex flex-col pt-32">
          <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-8 text-white/40"><X className="w-10 h-10" /></button>
          <div className="flex flex-col gap-10 text-5xl font-black tracking-tighter uppercase">
            {["Network_Map", "Hardware", "Deployments", "Telemetry"].map(l => <Link key={l} href="#" onClick={() => setMenuOpen(false)}>{l}</Link>)}
          </div>
        </motion.div>
      )}</AnimatePresence>

      {/* HERO */}
      <section className="relative h-screen flex flex-col justify-center pt-20 overflow-hidden">
        {/* Mesh Network Pulse */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div key={i} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 3, opacity: [0, 0.08, 0] }} transition={{ duration: 5, repeat: Infinity, delay: i * 1.2, ease: "easeOut" }} className="absolute w-96 h-96 border border-[#a855f7]/20 rounded-full" />
          ))}
        </div>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-8">
              <Reveal>
                <div className="flex items-center gap-4 mb-8">
                  <div className="px-3 py-1 bg-[#a855f7]/10 border border-[#a855f7]/30 text-[#a855f7] text-[9px] font-bold uppercase tracking-widest">{MANIFESTS.hero.status}</div>
                  <div className="text-[9px] text-white/30 tracking-widest uppercase">NODES: {MANIFESTS.hero.nodes} // COVERAGE: {MANIFESTS.hero.coverage}</div>
                </div>
                <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[0.8] tracking-tighter uppercase mb-10">
                  Adaptive <br /> <span className="text-[#a855f7]">Mesh.</span> <br /> Infinite <br /> <span className="text-white/20">Signal.</span>
                </h1>
                <p className="max-w-2xl text-xl text-white/40 leading-relaxed font-light mb-12 uppercase tracking-widest italic">
                  Decentralized infrastructure for planetary-scale IoT. Self-healing mesh networks with edge compute, zero-trust security, and environmental intelligence.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <button className="px-12 py-5 bg-[#a855f7] text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all shadow-[0_0_50px_rgba(168,85,247,0.2)]">Deploy_Network</button>
                  <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">View_Coverage</button>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-4 relative hidden lg:block">
              <Reveal delay={0.2}>
                <div className="relative aspect-square bg-[#0a0810] border border-white/5 p-12 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#a855f7]/5 to-transparent" />
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div><div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">MESH_LATENCY</div><div className="text-xl font-black text-[#a855f7]">{MANIFESTS.hero.latency}</div></div>
                      <div className="w-10 h-10 border border-white/5 rounded-full flex items-center justify-center"><Wifi className="w-5 h-5 text-white/20 animate-pulse" /></div>
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
                      <span>MESH_PROTOCOL_V3</span>
                      <div className="flex items-center gap-2 text-[#a855f7]"><div className="w-1.5 h-1.5 bg-[#a855f7] rounded-full animate-ping" /><span>ALL_NODES_UP</span></div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-40 bg-[#08070d] border-y border-white/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">Hardware <br /> <span className="text-[#a855f7]">Fleet.</span></h2></Reveal>
            <p className="max-w-md text-sm text-white/30 leading-relaxed uppercase tracking-widest font-light italic">Ruggedized, solar-powered mesh hardware engineered for decade-long autonomous deployment in any environment.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {MANIFESTS.products.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.1}>
                <div className="group p-12 bg-[#0a0810] border border-white/5 hover:border-[#a855f7]/30 transition-all flex flex-col h-full rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#a855f7]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-[#a855f7] mb-12 group-hover:bg-[#a855f7] group-hover:text-white transition-all">{p.icon}</div>
                  <h3 className="text-3xl font-black uppercase mb-6 tracking-tighter group-hover:text-[#a855f7] transition-colors">{p.name}</h3>
                  <p className="text-sm text-white/40 leading-relaxed mb-12 flex-1 italic">"{p.desc}"</p>
                  <div className="space-y-5 pt-10 border-t border-white/5">
                    {p.specs.map((s, j) => <div key={j} className="flex items-center gap-4 text-[9px] font-bold text-white/20 uppercase tracking-widest"><div className="w-1.5 h-1.5 bg-[#a855f7] rotate-45" />{s}</div>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DEPLOYMENTS */}
      <section className="py-40 bg-[#06050a]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center">
            <div className="lg:col-span-6">
              <Reveal>
                <div className="relative aspect-video bg-[#0a0810] border border-white/5 rounded-2xl overflow-hidden p-8">
                  <div className="absolute top-6 left-6 text-[8px] font-bold text-white/20 tracking-widest uppercase">GLOBAL_MESH_MAP</div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    {[...Array(24)].map((_, i) => (
                      <motion.div key={i} animate={{ opacity: [0.1, 0.6, 0.1], scale: [1, 1.3, 1] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.12 }}
                        className="absolute w-2 h-2 bg-[#a855f7] rounded-full" style={{ left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 80}%` }} />
                    ))}
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-[8px] font-bold text-white/20 tracking-widest uppercase">
                    <span>REGIONS: 3</span><div className="text-[#a855f7]">MESH_SYNCED</div>
                  </div>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-6">
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#a855f7] mb-6 block">Active_Regions</span>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-12 uppercase">Global <br /> <span className="text-white/20">Coverage.</span></h2>
                <div className="space-y-8">
                  {MANIFESTS.deployments.map((d, i) => (
                    <div key={i} className="group flex flex-col md:flex-row justify-between items-center p-8 bg-white/2 border border-white/5 hover:border-[#a855f7]/30 transition-all">
                      <div className="flex items-center gap-10 mb-6 md:mb-0">
                        <div className="text-2xl font-black uppercase tracking-tighter">{d.region}</div>
                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{d.nodes} NODES // {d.protocol}</div>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                        <div className={`w-1.5 h-1.5 rounded-full ${d.status === "Operational" ? "bg-green-500 animate-pulse" : "bg-purple-400"}`} />
                        <span className="text-white/40">STATUS:</span><span>{d.status}</span>
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
      <section className="py-40 bg-[#08070d] border-y border-white/5 text-center overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal>
            <h2 className="text-7xl md:text-[12rem] font-black tracking-tighter uppercase leading-[0.85] mb-12 text-white/5">Mesh <br /> Scale.</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mt-24">
              {[{ label: "ACTIVE_NODES", val: "12,400" }, { label: "COVERAGE_AREA", val: "2.1M km²" }, { label: "UPTIME_SLA", val: "99.97%" }, { label: "DATA_THROUGHPUT", val: "48TB/day" }].map((s, i) => (
                <div key={i} className="group"><div className="text-5xl font-black text-white mb-4 group-hover:text-[#a855f7] transition-colors">{s.val}</div><div className="text-[10px] font-black text-white/20 uppercase tracking-widest">{s.label}</div></div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 bg-[#06050a]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">Extend <br /> <span className="text-[#a855f7]">Signal.</span></h2>
            <p className="max-w-2xl mx-auto text-sm text-white/40 leading-relaxed font-light mb-16 uppercase tracking-widest italic">Connect the unconnected. Deploy adaptive mesh infrastructure for resilient, planet-scale IoT coverage.</p>
            <MagneticBtn className="px-16 py-6 bg-white text-black text-[12px] font-black uppercase tracking-[0.4em] hover:bg-[#a855f7] hover:text-white transition-all shadow-[0_0_60px_rgba(168,85,247,0.15)]">Initialize_Mesh_Deploy</MagneticBtn>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#06050a] border-t border-white/5 py-32 px-6 md:px-12">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10"><div className="w-8 h-8 bg-white text-black rounded-sm flex items-center justify-center"><Signal className="w-5 h-5" /></div><span>SIGNAL // MESH</span></Link>
            <p className="text-[11px] text-white/20 uppercase tracking-[0.2em] max-w-sm leading-relaxed mb-16 italic">Engineering decentralized connectivity infrastructure for resilient planetary-scale sensor networks.</p>
            <div className="flex gap-8">{[Radio, Globe, ShieldCheck].map((Icon, i) => <button key={i} className="text-white/20 hover:text-[#a855f7] transition-colors"><Icon className="w-5 h-5" /></button>)}</div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#a855f7]">Hardware</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {["Relay_Nodes", "Core_Hubs", "Sense_Arrays", "Edge_Compute"].map(l => <li key={l} className="hover:text-white transition-colors"><Link href="#">{l}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#a855f7]">Network</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {["Live_Map", "API_Docs", "Security_Audit", "Status_Page"].map(l => <li key={l} className="hover:text-white transition-colors"><Link href="#">{l}</Link></li>)}
            </ul>
          </div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[9px] font-bold text-white/10 uppercase tracking-widest">
          <span>&copy; 2026 SIGNAL MESH SYSTEMS. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-10 font-mono"><span>MESH_STABLE</span><span>NODE_SYNC_OK</span></div>
        </div>
      </footer>
    </div>
  );
}
