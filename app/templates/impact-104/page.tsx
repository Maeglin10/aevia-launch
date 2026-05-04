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
import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  Radio,
  Zap,
  Shield,
  Layers,
  Search,
  Menu,
  X,
  ArrowRight,
  ChevronRight,
  Cpu,
  Activity,
  Box,
  Binary,
  Gauge,
  Navigation,
  Satellite,
  Orbit,
  Signal,
  Wind,
  Target,
  Telescope,
} from "lucide-react";

import "../premium.css";

/* ==========================================================================
   DATA MANIFESTS
   ========================================================================== */

const ORBIT_MANIFESTS = {
  hero: {
    altitude: "420km",
    velocity: "7.6km/s",
    inclination: "51.6°",
    status: "ORBIT_LOCK_STABLE",
  },
  platforms: [
    {
      id: "low-earth",
      name: "LEO // CARRIER",
      desc: "High-frequency deployment for small-sat constellations with rapid re-entry capability.",
      icon: <Satellite className="w-5 h-5" />,
      specs: ["500kg Payload", "Sun-Sync Orbit", "98.5% Reliability"],
    },
    {
      id: "geosync",
      name: "GEO // STATIC",
      desc: "Deep-space relay systems for global telecommunications and secure signal persistence.",
      icon: <Radio className="w-5 h-5" />,
      specs: ["36,000km Altitude", "Dual-Band Relay", "15 Year Lifespan"],
    },
    {
      id: "deep-space",
      name: "DEEP // PROBE",
      desc: "Autonomous logistics for lunar and martian surface replenishment and telemetry.",
      icon: <Target className="w-5 h-5" />,
      specs: ["AI-Navigation", "Solar-Thermal Prop", "Long-Range Comms"],
    },
  ],
  telemetry: [
    { label: "ORBITAL_STABILITY", val: 98, color: "#ffaa00" },
    { label: "SIGNAL_INTEGRITY", val: 94, color: "#00f2ff" },
    { label: "FUEL_RESERVE", val: 62, color: "#ffaa00" },
    { label: "THERMAL_SHIELD", val: 100, color: "#00f2ff" },
  ],
  flights: [
    { mission: "ORB-24", payload: "Starlink-V3", destination: "LEO", status: "In-Flight" },
    { mission: "LUNAR-7", payload: "Habitat-A", destination: "Lunar South", status: "Preparing" },
    { mission: "GEO-91", payload: "Comms-Alpha", destination: "GTO", status: "Nominal" },
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
   ORBIT // STATION COMPONENT
   ========================================================================== */

export default function OrbitStationPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#050608] text-white font-mono selection:bg-[#ffaa00] selection:text-black overflow-x-hidden">
      {/* ── BACKGROUND ARCHITECTURE ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#0f1218_0%,transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
        <div className="absolute bottom-0 left-0 w-full h-[60vh] bg-gradient-to-t from-[#ffaa00]/5 to-transparent" />
      </div>

      {/* ── NAVIGATION ── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#050608]/90 backdrop-blur-xl py-4 border-b border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]" : "bg-transparent py-10"}`}
      >
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-3 text-xl font-black tracking-tighter"
          >
            <div className="w-8 h-8 bg-[#ffaa00] rounded flex items-center justify-center text-black">
              <Orbit className="w-5 h-5" />
            </div>
            <span className="group-hover:text-[#ffaa00] transition-colors">
              ORBIT // <span className="text-white/40">STATION</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Missions", "Fleet", "Telemetry", "Logistics"].map((l) => (
              <Link
                key={l}
                href="#"
                className="hover:text-[#ffaa00] transition-colors"
              >
                {l}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button className="hidden md:block text-white/30 hover:text-white transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <MagneticBtn className="px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#ffaa00] transition-all">
              Initialize_Launch
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
            className="fixed inset-0 z-[100] bg-[#050608] p-8 flex flex-col pt-32"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8 text-white/40"
            >
              <X className="w-10 h-10" />
            </button>
            <div className="flex flex-col gap-10 text-5xl font-black tracking-tighter uppercase">
              {["Missions", "Fleet", "Telemetry", "Logistics"].map((l) => (
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
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-8">
              <Reveal>
                <div className="flex items-center gap-4 mb-8">
                  <div className="px-3 py-1 bg-[#ffaa00]/10 border border-[#ffaa00]/30 text-[#ffaa00] text-[9px] font-bold uppercase tracking-widest">
                    {ORBIT_MANIFESTS.hero.status}
                  </div>
                  <div className="text-[9px] text-white/30 tracking-widest uppercase">
                    ALT: {ORBIT_MANIFESTS.hero.altitude} // VEL:{" "}
                    {ORBIT_MANIFESTS.hero.velocity}
                  </div>
                </div>
                <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[0.8] tracking-tighter uppercase mb-10">
                  Orbital <br />{" "}
                  <span className="text-[#ffaa00]">Logistics.</span> <br />{" "}
                  Static <br />{" "}
                  <span className="text-white/20">Persistence.</span>
                </h1>
                <p className="max-w-2xl text-xl text-white/40 leading-relaxed font-light mb-12 uppercase tracking-widest italic">
                  Challenging the gravitational barrier. Autonomous orbital
                  infrastructure and payload delivery for the next generation of
                  space commerce. Precision. Stability. Persistence.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <button className="px-12 py-5 bg-[#ffaa00] text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_50px_rgba(255,170,0,0.2)]">
                    Schedule_Payload
                  </button>
                  <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">
                    View_Telemetry_Live
                  </button>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-4 relative hidden lg:block">
              <Reveal delay={0.2}>
                <div className="relative aspect-square bg-[#0a0a0f] border border-white/5 p-12 rounded-3xl overflow-hidden group shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ffaa00]/5 to-transparent" />

                  {/* Orbital HUD */}
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">
                          INCLINATION_LOCK
                        </div>
                        <div className="text-xl font-black text-[#ffaa00]">
                          {ORBIT_MANIFESTS.hero.inclination}
                        </div>
                      </div>
                      <div className="w-10 h-10 border border-white/5 rounded-full flex items-center justify-center">
                        <Signal className="w-5 h-5 text-white/20 animate-pulse" />
                      </div>
                    </div>

                    {/* Progress Metrics */}
                    <div className="space-y-10 my-10">
                      {ORBIT_MANIFESTS.telemetry.map((stat, i) => (
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
                      <span>AUTO_CORRECT_ON</span>
                      <div className="flex items-center gap-2 text-[#ffaa00]">
                        <div className="w-1.5 h-1.5 bg-[#ffaa00] rounded-full animate-ping" />
                        <span>TRACKING_ACTIVE</span>
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
      <section className="py-40 bg-[#08080a] border-y border-white/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <Reveal>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
                Fleet <br />{" "}
                <span className="text-[#ffaa00]">Capabilities.</span>
              </h2>
            </Reveal>
            <p className="max-w-md text-sm text-white/30 leading-relaxed uppercase tracking-widest font-light italic">
              From LEO constellations to deep-space logistics, our modular platform architecture handles every stage of orbital deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {ORBIT_MANIFESTS.platforms.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.1}>
                <div className="group p-12 bg-[#0a0a0f] border border-white/5 hover:border-[#ffaa00]/30 transition-all flex flex-col h-full rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#ffaa00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-[#ffaa00] mb-12 group-hover:bg-[#ffaa00] group-hover:text-black transition-all">
                    {p.icon}
                  </div>
                  <h3 className="text-3xl font-black uppercase mb-6 tracking-tighter group-hover:text-[#ffaa00] transition-colors">
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
                        <div className="w-1.5 h-1.5 bg-[#ffaa00] rotate-45" />
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

      {/* ── LIVE TRACKING (Data Visualization) ── */}
      <section className="py-40 bg-[#050608]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center">
            <div className="lg:col-span-6">
              <Reveal>
                <div className="relative aspect-video bg-[#0a0a0f] border border-white/5 rounded-2xl overflow-hidden p-8 group">
                  <div className="absolute top-6 left-6 text-[8px] font-bold text-white/20 tracking-widest uppercase">
                    GLOBAL_TELEMETRY_STREAM
                  </div>
                  {/* Orbit Path Visualizer */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <div className="relative w-full h-full">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 m-20 border-[0.5px] border-dashed border-[#ffaa00] rounded-full"
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 m-10 border-[0.5px] border-dashed border-white/10 rounded-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Globe className="w-20 h-20 text-white/5" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-[8px] font-bold text-white/20 tracking-widest uppercase">
                    <div className="flex gap-10">
                      <span>LAT: 34.05°N</span>
                      <span>LNG: 118.24°W</span>
                    </div>
                    <div className="text-[#ffaa00]">SIGNAL_LOCKED</div>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-6">
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#ffaa00] mb-6 block">
                  Active_Operations
                </span>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-12 uppercase">
                  Launch <br />{" "}
                  <span className="text-white/20">Telemetry.</span>
                </h2>
                <div className="space-y-8">
                  {ORBIT_MANIFESTS.flights.map((flight, i) => (
                    <div
                      key={i}
                      className="group flex flex-col md:flex-row justify-between items-center p-8 bg-white/2 border border-white/5 hover:border-[#ffaa00]/30 transition-all"
                    >
                      <div className="flex items-center gap-10 mb-6 md:mb-0">
                        <div className="text-2xl font-black uppercase tracking-tighter">
                          {flight.mission}
                        </div>
                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                          {flight.payload}
                        </div>
                      </div>
                      <div className="flex items-center gap-12 text-[10px] font-bold uppercase tracking-widest">
                        <div className="flex items-center gap-3">
                          <Navigation className="w-4 h-4 text-[#ffaa00]" />
                          <span className="text-white/40">DEST:</span>
                          <span>{flight.destination}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${flight.status === "In-Flight" ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`}
                          />
                          <span className="text-white/40">STATUS:</span>
                          <span className={flight.status === "In-Flight" ? "text-green-500" : ""}>{flight.status}</span>
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

      {/* ── RELIABILITY METRICS ── */}
      <section className="py-40 bg-[#0a0a0f] border-y border-white/5 text-center overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 relative">
          <Reveal>
            <h2 className="text-7xl md:text-[12rem] font-black tracking-tighter uppercase leading-[0.85] mb-12 text-white/5">
              Zero <br /> Failure.
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mt-24">
              {[
                { label: "LAUNCH_SUCCESS", val: "99.9%" },
                { label: "RECOVERY_RATE", val: "94.2%" },
                { label: "ORBIT_PRECISION", val: "0.01mm" },
                { label: "TOTAL_FLIGHTS", val: "420+" },
              ].map((s, i) => (
                <div key={i} className="group">
                  <div className="text-5xl font-black text-white mb-4 group-hover:text-[#ffaa00] transition-colors">
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
      <section className="py-40 bg-[#050608]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">
              Reach <br />{" "}
              <span className="text-[#ffaa00]">Escape.</span>
            </h2>
            <p className="max-w-2xl mx-auto text-sm text-white/40 leading-relaxed font-light mb-16 uppercase tracking-widest italic">
              Space is open for commerce. Initialize your orbital logistics strategy today with the world's most precise launch and tracking platform.
            </p>
            <MagneticBtn className="px-16 py-6 bg-white text-black text-[12px] font-black uppercase tracking-[0.4em] hover:bg-[#ffaa00] transition-all shadow-[0_0_60px_rgba(255,170,0,0.15)]">
              Initialize_Mission_Alpha
            </MagneticBtn>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#050608] border-t border-white/5 py-32 px-6 md:px-12">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10">
              <div className="w-8 h-8 bg-white text-black rounded flex items-center justify-center">
                <Orbit className="w-5 h-5" />
              </div>
              <span>ORBIT // STATION</span>
            </Link>
            <p className="text-[11px] text-white/20 uppercase tracking-[0.2em] max-w-sm leading-relaxed mb-16 italic">
              Engineering the orbital infrastructure for the next century of space commerce and exploration.
            </p>
            <div className="flex gap-8">
              {[Satellite, Globe, Telescope].map((Icon, i) => (
                <button key={i} className="text-white/20 hover:text-[#ffaa00] transition-colors">
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#ffaa00]">Missions</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              <li className="hover:text-white transition-colors"><Link href="#">Launch_Schedule</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Payload_Guide</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Recovery_Stats</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Pricing_Calculator</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#ffaa00]">Telemetry</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              <li className="hover:text-white transition-colors"><Link href="#">Live_Tracking</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Signal_Integrity</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">API_Access</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Status_Logs</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[9px] font-bold text-white/10 uppercase tracking-widest">
          <div className="flex items-center gap-10">
            <span>&copy; 2026 ORBIT STATION LOGISTICS. ALL RIGHTS RESERVED.</span>
            <div className="flex gap-10 hidden lg:flex">
              <span>FAA_LICENSED</span>
              <span>ISO_9001_CERTIFIED</span>
            </div>
          </div>
          <div className="flex gap-10 font-mono">
            <span>ORBIT_LOCKED</span>
            <span>TLE_SYNC_COMPLETE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
