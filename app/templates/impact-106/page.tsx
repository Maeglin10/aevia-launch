"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  Zap,
  Shield,
  Layers,
  Search,
  Menu,
  X,
  ArrowRight,
  ChevronRight,
  Cpu,
  Binary,
  Waves,
  Navigation,
  Wind,
  Target,
  Telescope,
  Anchor,
  Droplets,
  Gauge,
  LifeBuoy,
  Radar,
  Thermometer,
} from "lucide-react";

import "../premium.css";

/* ==========================================================================
   DATA MANIFESTS
   ========================================================================== */

const VOID_MANIFESTS = {
  hero: {
    depth: "11,034m",
    pressure: "1,086bar",
    temperature: "1.2°C",
    status: "ABYSSAL_DESCENT_ACTIVE",
  },
  platforms: [
    {
      id: "leviathan",
      name: "LEVIATHAN // CLASS",
      desc: "Heavy-payload deep-submergence vehicle for thermal vent resource extraction.",
      icon: <Anchor className="w-5 h-5" />,
      specs: ["12,000m Rated", "Hydraulic Slicers", "Bio-Luminescent Array"],
    },
    {
      id: "phantom",
      name: "PHANTOM // SCOUT",
      desc: "Autonomous swarm units for high-resolution bathymetric mapping and sonar scouting.",
      icon: <Radar className="w-5 h-5" />,
      specs: ["48hr Endurance", "Piezoceramic Sensors", "Sub-Decimeter Res"],
    },
    {
      id: "abyssal",
      name: "ABYSSAL // HUB",
      desc: "Stationary research architecture for long-term ecological monitoring and seismic tracking.",
      icon: <Layers className="w-5 h-5" />,
      specs: ["Nuclear Battery", "Fiber-Optic Uplink", "Modular Lab Shells"],
    },
  ],
  telemetry: [
    { label: "STRUCTURAL_INTEGRITY", val: 99, color: "#00f2ff" },
    { label: "OXYGEN_RESERVE", val: 84, color: "#00f2ff" },
    { label: "SONAR_CLARITY", val: 92, color: "#00f2ff" },
    { label: "ENERGY_CORE", val: 68, color: "#ffaa00" },
  ],
  logistics: [
    { sector: "Hadal_01", vehicle: "LV-09", task: "Vent_Sample", status: "Operational" },
    { sector: "Midnight_A", vehicle: "PH-22", task: "Bio_Mapping", status: "Nominal" },
    { sector: "Trench_Beta", vehicle: "AB-HUB", task: "Seismic_Log", status: "Active" },
  ],
};

/* ==========================================================================
   UTILITY COMPONENTS
   ========================================================================== */

function Reveal({
  children,
  delay = 0,
  y = 20,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

function MagneticBtn({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      x.set((e.clientX - rect.left - rect.width / 2) * 0.4);
      y.set((e.clientY - rect.top - rect.height / 2) * 0.4);
    }
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMouse}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

/* ==========================================================================
   VOID // CORE COMPONENT
   ========================================================================== */

export default function VoidCorePage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#020408] text-white font-mono selection:bg-[#00f2ff] selection:text-black overflow-x-hidden">
      {/* ── BACKGROUND ARCHITECTURE ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#0a1420_0%,transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,242,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,242,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute bottom-0 left-0 w-full h-[60vh] bg-gradient-to-t from-[#00f2ff]/5 to-transparent" />
      </div>

      {/* ── NAVIGATION ── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#020408]/90 backdrop-blur-xl py-4 border-b border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]" : "bg-transparent py-10"}`}
      >
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-3 text-xl font-black tracking-tighter"
          >
            <div className="w-8 h-8 bg-[#00f2ff] rounded-sm flex items-center justify-center text-black">
              <Radar className="w-5 h-5" />
            </div>
            <span className="group-hover:text-[#00f2ff] transition-colors">
              VOID // <span className="text-white/40">CORE</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Abyssal_Fleet", "Biolytics", "Trench_Sync", "Research"].map((l) => (
              <Link
                key={l}
                href="#"
                className="hover:text-[#00f2ff] transition-colors"
              >
                {l}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button className="hidden md:block text-white/30 hover:text-white transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <MagneticBtn className="px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#00f2ff] transition-all">
              Initialize_Descent
            </MagneticBtn>
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden text-white/60 hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-[100] bg-[#020408] p-8 flex flex-col pt-32"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8 text-white/40"
            >
              <X className="w-10 h-10" />
            </button>
            <div className="flex flex-col gap-10 text-5xl font-black tracking-tighter uppercase">
              {["Abyssal_Fleet", "Biolytics", "Trench_Sync", "Research"].map((l) => (
                <Link key={l} href="#" onClick={() => setMenuOpen(false)}>
                  {l}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO SECTION ── */}
      <section className="relative h-screen flex flex-col justify-center pt-20 overflow-hidden">
        {/* Sonar Pulse Simulation */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 4, opacity: [0, 0.1, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 1.3,
                ease: "easeOut",
              }}
              className="absolute w-full h-full border border-[#00f2ff]/20 rounded-full"
            />
          ))}
        </div>

        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-8">
              <Reveal>
                <div className="flex items-center gap-4 mb-8">
                  <div className="px-3 py-1 bg-[#00f2ff]/10 border border-[#00f2ff]/30 text-[#00f2ff] text-[9px] font-bold uppercase tracking-widest">
                    {VOID_MANIFESTS.hero.status}
                  </div>
                  <div className="text-[9px] text-white/30 tracking-widest uppercase">
                    DEPTH: {VOID_MANIFESTS.hero.depth} // PRESSURE:{" "}
                    {VOID_MANIFESTS.hero.pressure}
                  </div>
                </div>
                <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[0.8] tracking-tighter uppercase mb-10">
                  Total <br />{" "}
                  <span className="text-[#00f2ff]">Submergence.</span> <br />{" "}
                  Abyssal <br />{" "}
                  <span className="text-white/20">Discovery.</span>
                </h1>
                <p className="max-w-2xl text-xl text-white/40 leading-relaxed font-light mb-12 uppercase tracking-widest italic">
                  Engineering the transition to Hadal-zone industrialization. 
                  Pressure-resistant architectures for deep-sea resource extraction, 
                  biological surveying, and tectonic monitoring.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <button className="px-12 py-5 bg-[#00f2ff] text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_50px_rgba(0,242,255,0.2)]">
                    Initialize_Fleet
                  </button>
                  <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">
                    View_Sonar_Logs
                  </button>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-4 relative hidden lg:block">
              <Reveal delay={0.2}>
                <div className="relative aspect-square bg-[#05080c] border border-white/5 p-12 rounded-3xl overflow-hidden group shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00f2ff]/5 to-transparent" />

                  {/* Submergence HUD */}
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">
                          BATHY_TEMP_EXT
                        </div>
                        <div className="text-xl font-black text-[#00f2ff]">
                          {VOID_MANIFESTS.hero.temperature}
                        </div>
                      </div>
                      <div className="w-10 h-10 border border-white/5 rounded-full flex items-center justify-center">
                        <Gauge className="w-5 h-5 text-white/20 animate-pulse" />
                      </div>
                    </div>

                    {/* Telemetry Metrics */}
                    <div className="space-y-10 my-10">
                      {VOID_MANIFESTS.telemetry.map((stat, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest mb-3">
                            <span className="text-white/40">{stat.label}</span>
                            <span style={{ color: stat.color }}>{stat.val}%</span>
                          </div>
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${stat.val}%` }}
                              transition={{ duration: 2, delay: 0.5 + i * 0.1 }}
                              className="h-full"
                              style={{ backgroundColor: stat.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-white/5 flex justify-between items-center text-[8px] font-bold text-white/20 uppercase tracking-widest">
                      <span>CRUSH_SHIELD_ON</span>
                      <div className="flex items-center gap-2 text-[#00f2ff]">
                        <div className="w-1.5 h-1.5 bg-[#00f2ff] rounded-full animate-ping" />
                        <span>HULL_STABLE</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── FLEET SECTION ── */}
      <section className="py-40 bg-[#04060a] border-y border-white/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <Reveal>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
                Abyssal <br />{" "}
                <span className="text-[#00f2ff]">Platforms.</span>
              </h2>
            </Reveal>
            <p className="max-w-md text-sm text-white/30 leading-relaxed uppercase tracking-widest font-light italic">
              From heavy-duty extraction to autonomous swarm mapping, our fleet is engineered for the harshest environments on Earth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {VOID_MANIFESTS.platforms.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.1}>
                <div className="group p-12 bg-[#05080c] border border-white/5 hover:border-[#00f2ff]/30 transition-all flex flex-col h-full rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00f2ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-[#00f2ff] mb-12 group-hover:bg-[#00f2ff] group-hover:text-black transition-all">
                    {p.icon}
                  </div>
                  <h3 className="text-3xl font-black uppercase mb-6 tracking-tighter group-hover:text-[#00f2ff] transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed mb-12 flex-1 italic">
                    "{p.desc}"
                  </p>

                  <div className="space-y-5 pt-10 border-t border-white/5">
                    {p.specs.map((s, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-4 text-[9px] font-bold text-white/20 uppercase tracking-widest"
                      >
                        <div className="w-1.5 h-1.5 bg-[#00f2ff] rotate-45" />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE DATA (Sonar Streams) ── */}
      <section className="py-40 bg-[#020408]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center">
            <div className="lg:col-span-6">
              <Reveal>
                <div className="relative aspect-video bg-[#05080c] border border-white/5 rounded-2xl overflow-hidden p-8 group">
                  <div className="absolute top-6 left-6 text-[8px] font-bold text-white/20 tracking-widest uppercase">
                    HADAL_ZONE_RECON_STREAM
                  </div>
                  {/* Waveform Visualization */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible">
                      {[...Array(50)].map((_, i) => (
                        <motion.rect
                          key={i}
                          initial={{ height: 10 }}
                          animate={{ height: [10, Math.random() * 80 + 10, 10] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.02 }}
                          x={i * 8}
                          y={50 - (Math.random() * 40)}
                          width="2"
                          fill="#00f2ff"
                        />
                      ))}
                    </svg>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-[8px] font-bold text-white/20 tracking-widest uppercase">
                    <div className="flex gap-10">
                      <span>SEC: B-09</span>
                      <span>COORD: 11.34N 142.12E</span>
                    </div>
                    <div className="text-[#00f2ff]">SCAN_LOCKED</div>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-6">
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#00f2ff] mb-6 block">
                  Active_Logistics
                </span>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-12 uppercase">
                  Trench <br />{" "}
                  <span className="text-white/20">Operations.</span>
                </h2>
                <div className="space-y-8">
                  {VOID_MANIFESTS.logistics.map((log, i) => (
                    <div
                      key={i}
                      className="group flex flex-col md:flex-row justify-between items-center p-8 bg-white/2 border border-white/5 hover:border-[#00f2ff]/30 transition-all"
                    >
                      <div className="flex items-center gap-10 mb-6 md:mb-0">
                        <div className="text-2xl font-black uppercase tracking-tighter">
                          {log.sector}
                        </div>
                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                          {log.vehicle} // {log.task}
                        </div>
                      </div>
                      <div className="flex items-center gap-12 text-[10px] font-bold uppercase tracking-widest">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${log.status === "Active" ? "bg-green-500 animate-pulse" : "bg-cyan-500"}`}
                          />
                          <span className="text-white/40">STATUS:</span>
                          <span className={log.status === "Active" ? "text-green-500" : ""}>{log.status}</span>
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

      {/* ── PERFORMANCE METRICS ── */}
      <section className="py-40 bg-[#05080c] border-y border-white/5 text-center overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 relative">
          <Reveal>
            <h2 className="text-7xl md:text-[12rem] font-black tracking-tighter uppercase leading-[0.85] mb-12 text-white/5">
              Deep <br /> Silence.
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mt-24">
              {[
                { label: "MAX_DEPTH_RATING", val: "11,500m" },
                { label: "PRESSURE_THRESHOLD", val: "1.2kBar" },
                { label: "BATTERY_LIFE", val: "720hrs" },
                { label: "COMM_LATENCY", val: "1.8ms" },
              ].map((s, i) => (
                <div key={i} className="group">
                  <div className="text-5xl font-black text-white mb-4 group-hover:text-[#00f2ff] transition-colors">
                    {s.val}
                  </div>
                  <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA / INITIALIZE ── */}
      <section className="py-40 bg-[#020408]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">
              Begin <br />{" "}
              <span className="text-[#00f2ff]">Descent.</span>
            </h2>
            <p className="max-w-2xl mx-auto text-sm text-white/40 leading-relaxed font-light mb-16 uppercase tracking-widest italic">
              The ocean floor is the final frontier on Earth. Initialize your abyssal exploration and research strategy today with Void Core Systems.
            </p>
            <MagneticBtn className="px-16 py-6 bg-white text-black text-[12px] font-black uppercase tracking-[0.4em] hover:bg-[#00f2ff] transition-all shadow-[0_0_60px_rgba(0,242,255,0.15)]">
              Initialize_Abyssal_Unit
            </MagneticBtn>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#020408] border-t border-white/5 py-32 px-6 md:px-12">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10">
              <div className="w-8 h-8 bg-white text-black rounded-sm flex items-center justify-center">
                <Radar className="w-5 h-5" />
              </div>
              <span>VOID // CORE</span>
            </Link>
            <p className="text-[11px] text-white/20 uppercase tracking-[0.2em] max-w-sm leading-relaxed mb-16 italic">
              Engineering the infrastructure for sustainable deep-sea exploration and resource management.
            </p>
            <div className="flex gap-8">
              {[Anchor, Droplets, Gauge].map((Icon, i) => (
                <button key={i} className="text-white/20 hover:text-[#00f2ff] transition-colors">
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#00f2ff]">Fleet</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              <li className="hover:text-white transition-colors"><Link href="#">Vehicle_Specs</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Payload_Matrix</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Swarm_Coordination</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Battery_SLA</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#00f2ff]">Telemetry</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              <li className="hover:text-white transition-colors"><Link href="#">Live_Sonar</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Thermal_Vents</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Ecological_Logs</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">System_Status</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[9px] font-bold text-white/10 uppercase tracking-widest">
          <div className="flex items-center gap-10">
            <span>&copy; 2026 VOID CORE EXPLORATION. ALL RIGHTS RESERVED.</span>
            <div className="flex gap-10 hidden lg:flex">
              <span>UN_SEA_COMPLIANT</span>
              <span>ISO_14001_CERTIFIED</span>
            </div>
          </div>
          <div className="flex gap-10 font-mono">
            <span>SONAR_SYNCED</span>
            <span>H hull_integrity_99%</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
