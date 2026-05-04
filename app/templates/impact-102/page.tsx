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
  Lock,
  Box,
  Binary,
  Globe,
  Radio,
  Gauge,
  Wind,
  Atom,
  Orbit,
  FlaskConical,
} from "lucide-react";

import "../premium.css";

/* ==========================================================================
   DATA MANIFESTS
   ========================================================================== */

const QUANTUM_MANIFESTS = {
  hero: {
    status: "SUPERPOSITION_STABLE",
    qubits: 124,
    temp: "15mK",
    coherence: "99.98%",
  },
  services: [
    {
      id: "q-cloud",
      name: "QUANTUM // CLOUD",
      desc: "Instant access to superconducting processors via a unified probabilistic API.",
      icon: <Cpu className="w-5 h-5" />,
      features: ["Low-Latency Job Queue", "VQE/QAOA Support", "Error Mitigation v3"],
    },
    {
      id: "q-encrypt",
      name: "QUANTUM // ENCRYPT",
      desc: "Post-quantum cryptographic mesh for secure data persistence and transfer.",
      icon: <Lock className="w-5 h-5" />,
      features: ["Lattice-Based Encryption", "PQC Standard Compliance", "Zero-Knowledge Storage"],
    },
    {
      id: "q-sim",
      name: "QUANTUM // SIM",
      desc: "High-fidelity circuit simulation for pre-deployment validation at scale.",
      icon: <FlaskConical className="w-5 h-5" />,
      features: ["Noise Model Injection", "Distributed GPU Compute", "Circuit Optimization"],
    },
  ],
  prob_data: [
    { state: "00", prob: 0.25, phase: 0 },
    { state: "01", prob: 0.12, phase: 90 },
    { state: "10", prob: 0.38, phase: 180 },
    { state: "11", prob: 0.25, phase: 270 },
  ],
  labs: [
    { city: "Zurich", center: "Lab_01", temperature: "10mK", status: "Operational" },
    { city: "Singapore", center: "Lab_02", temperature: "15mK", status: "Maintenance" },
    { city: "Palo Alto", center: "Lab_03", temperature: "12mK", status: "Operational" },
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
   QUANTUM // COMPUTE COMPONENT
   ========================================================================== */

export default function QuantumComputePage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#030305] text-white font-mono selection:bg-[#7000ff] selection:text-white overflow-x-hidden">
      {/* ── BACKGROUND ARCHITECTURE ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,#0a0514_0%,transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(90deg, #ffffff 1px, transparent 1px), linear-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-[#7000ff]/5 to-transparent" />
      </div>

      {/* ── NAVIGATION ── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#030305]/80 backdrop-blur-2xl py-4 border-b border-white/5 shadow-[0_0_40px_rgba(112,0,255,0.1)]" : "bg-transparent py-10"}`}
      >
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-3 text-xl font-black tracking-tighter"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-[#7000ff] to-[#00f2ff] rounded-full flex items-center justify-center text-black">
              <Atom className="w-5 h-5" />
            </div>
            <span className="group-hover:text-[#7000ff] transition-colors">
              QUANTUM // <span className="text-white/40">COMPUTE</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Processors", "Cryo_Nodes", "Software", "Research"].map((l) => (
              <Link
                key={l}
                href="#"
                className="hover:text-[#7000ff] transition-colors"
              >
                {l}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button className="hidden md:block text-white/30 hover:text-white transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <MagneticBtn className="px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#7000ff] hover:text-white transition-all">
              Initialize_Circuit
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
            className="fixed inset-0 z-[100] bg-[#030305] p-8 flex flex-col pt-32"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8 text-white/40"
            >
              <X className="w-10 h-10" />
            </button>
            <div className="flex flex-col gap-10 text-5xl font-black tracking-tighter uppercase">
              {["Processors", "Cryo_Nodes", "Software", "Research"].map((l) => (
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
        {/* Spectral Wave Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 border border-[#7000ff]/20 rounded-full blur-3xl"
              style={{
                top: `${20 + i * 10}%`,
                left: `${10 + i * 15}%`,
                width: `${40 + i * 10}%`,
                height: `${40 + i * 10}%`,
              }}
            />
          ))}
        </div>

        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-8">
              <Reveal>
                <div className="flex items-center gap-4 mb-8">
                  <div className="px-3 py-1 bg-[#7000ff]/10 border border-[#7000ff]/30 text-[#7000ff] text-[9px] font-bold uppercase tracking-widest">
                    {QUANTUM_MANIFESTS.hero.status}
                  </div>
                  <div className="text-[9px] text-white/30 tracking-widest uppercase">
                    QUBITS: {QUANTUM_MANIFESTS.hero.qubits} // TEMP:{" "}
                    {QUANTUM_MANIFESTS.hero.temp}
                  </div>
                </div>
                <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-black leading-[0.82] tracking-tighter uppercase mb-10">
                  Infinite <br />{" "}
                  <span className="text-[#7000ff]">Probabilities.</span> <br />{" "}
                  <span className="text-white/20">Classical</span> <br />{" "}
                  Ease.
                </h1>
                <p className="max-w-2xl text-xl text-white/40 leading-relaxed font-light mb-12 uppercase tracking-widest italic">
                  Challenging the limits of classical computation through
                  superconducting gate-based quantum systems. Secure, scalable,
                  and coherent.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <button className="px-12 py-5 bg-[#7000ff] text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all shadow-[0_0_50px_rgba(112,0,255,0.3)]">
                    Initialize_Q_Cloud
                  </button>
                  <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">
                    View_Research_Logs
                  </button>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-4 relative hidden lg:block">
              <Reveal delay={0.2}>
                <div className="relative aspect-square bg-[#0a0a0f] border border-white/5 p-10 rounded-3xl overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#7000ff]/5 to-transparent" />

                  {/* Qubit HUD */}
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">
                          COHERENCE_MAP
                        </div>
                        <div className="text-xl font-black text-[#7000ff]">
                          {QUANTUM_MANIFESTS.hero.coherence}
                        </div>
                      </div>
                      <div className="w-10 h-10 border border-white/5 rounded-full flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white/20" />
                      </div>
                    </div>

                    {/* Probabilistic Grid */}
                    <div className="grid grid-cols-2 gap-8 my-10">
                      {QUANTUM_MANIFESTS.prob_data.map((item, i) => (
                        <div key={i} className="space-y-3">
                          <div className="flex justify-between text-[8px] font-bold text-white/20 uppercase tracking-widest">
                            <span>|{item.state}⟩</span>
                            <span>{Math.round(item.prob * 100)}%</span>
                          </div>
                          <div className="relative h-12 flex items-end gap-1">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${item.prob * 100}%` }}
                              transition={{ duration: 1.5, delay: 0.5 + i * 0.1 }}
                              className="w-full bg-gradient-to-t from-[#7000ff]/40 to-[#00f2ff]/40 rounded-sm"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-white/5 flex justify-between items-center text-[8px] font-bold text-white/20 uppercase tracking-widest">
                      <span>SYNC_ACTIVE</span>
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-[#7000ff] rounded-full animate-pulse" />
                        <span>ENTANGLED</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES SECTION ── */}
      <section className="py-40 bg-[#06060a] border-y border-white/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <Reveal>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
                Probabilistic <br />{" "}
                <span className="text-[#7000ff]">Services.</span>
              </h2>
            </Reveal>
            <p className="max-w-md text-sm text-white/30 leading-relaxed uppercase tracking-widest font-light italic">
              From drug discovery to portfolio optimization, our quantum
              processors provide the computational advantage required for
              exponential problems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {QUANTUM_MANIFESTS.services.map((service, i) => (
              <Reveal key={service.id} delay={i * 0.1}>
                <div className="group p-12 bg-[#0a0a0f] border border-white/5 hover:border-[#7000ff]/30 transition-all flex flex-col h-full rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#7000ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="w-14 h-14 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-[#7000ff] mb-12 group-hover:bg-[#7000ff] group-hover:text-white transition-all">
                    {service.icon}
                  </div>
                  <h3 className="text-3xl font-black uppercase mb-6 tracking-tighter group-hover:text-[#7000ff] transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed mb-12 flex-1 italic">
                    "{service.desc}"
                  </p>

                  <div className="space-y-4 pt-8 border-t border-white/5">
                    {service.features.map((f, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-4 text-[9px] font-bold text-white/20 uppercase tracking-widest"
                      >
                        <div className="w-1.5 h-1.5 border border-[#7000ff] rotate-45" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CRYO NETWORK (Data Visualization) ── */}
      <section className="py-40 bg-[#030305]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <Reveal>
                <div className="relative aspect-square bg-[#0a0a0f] border border-white/5 rounded-full overflow-hidden p-1">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#7000ff11_0%,transparent_70%)]" />

                  {/* Concentric HUD Rings */}
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                      transition={{
                        duration: 30 + i * 10,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 border border-white/5 rounded-full"
                      style={{ margin: `${(i + 1) * 10}%` }}
                    />
                  ))}

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl font-black text-white mb-2 italic">
                        {QUANTUM_MANIFESTS.hero.temp}
                      </div>
                      <div className="text-[10px] font-black text-[#7000ff] uppercase tracking-[0.4em]">
                        CRYO_BASELINE
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2">
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#7000ff] mb-6 block">
                  Global_Infrastructure
                </span>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-12 uppercase">
                  Global <br />{" "}
                  <span className="text-white/20">Cryo-Mesh.</span>
                </h2>
                <p className="text-lg text-white/40 leading-relaxed font-light mb-16 uppercase tracking-widest italic">
                  Distributed laboratory infrastructure providing sub-Kelvin
                  environments for stable superconducting qubit processing.
                </p>

                <div className="space-y-8">
                  {QUANTUM_MANIFESTS.labs.map((lab, i) => (
                    <div
                      key={i}
                      className="group flex flex-col md:flex-row justify-between items-center p-8 bg-white/2 border border-white/5 hover:border-[#7000ff]/30 transition-all"
                    >
                      <div className="flex items-center gap-10 mb-6 md:mb-0">
                        <div className="text-2xl font-black uppercase tracking-tighter">
                          {lab.city}
                        </div>
                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                          {lab.center}
                        </div>
                      </div>
                      <div className="flex items-center gap-12 text-[10px] font-bold uppercase tracking-widest">
                        <div className="flex items-center gap-3">
                          <Gauge className="w-4 h-4 text-[#7000ff]" />
                          <span className="text-white/40">TEMP:</span>
                          <span>{lab.temperature}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full ${lab.status === "Operational" ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`}
                          />
                          <span className="text-white/40">STATUS:</span>
                          <span>{lab.status}</span>
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

      {/* ── PERFORMANCE BENCHMARKS ── */}
      <section className="py-40 bg-[#0a0a0f] border-y border-white/5 text-center overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 relative">
          <Reveal>
            <h2 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85] mb-12 text-white/5">
              Quantum <br /> Advantage.
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mt-24">
              {[
                { label: "GATE_FIDELITY", val: "99.98%" },
                { label: "COHERENCE_TIME", val: "1.2ms" },
                { label: "CIRCUIT_DEPTH", val: "800+" },
                { label: "ERROR_RATE", val: "0.02%" },
              ].map((s, i) => (
                <div key={i} className="group">
                  <div className="text-5xl font-black text-white mb-4 group-hover:text-[#7000ff] transition-colors">
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
      <section className="py-40 bg-[#030305]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">
              Transcend <br />{" "}
              <span className="text-[#7000ff]">Limits.</span>
            </h2>
            <p className="max-w-2xl mx-auto text-sm text-white/40 leading-relaxed font-light mb-16 uppercase tracking-widest italic">
              Quantum computing is no longer theoretical. Initialize your first circuit in minutes and experience the advantage of probabilistic processing.
            </p>
            <MagneticBtn className="px-16 py-6 bg-white text-black text-[12px] font-black uppercase tracking-[0.4em] hover:bg-[#7000ff] hover:text-white transition-all shadow-[0_0_60px_rgba(112,0,255,0.2)]">
              Initialize_Quantum_Instance
            </MagneticBtn>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#030305] border-t border-white/5 py-32 px-6 md:px-12">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10">
              <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center">
                <Atom className="w-5 h-5" />
              </div>
              <span>QUANTUM // COMPUTE</span>
            </Link>
            <p className="text-[11px] text-white/20 uppercase tracking-[0.2em] max-w-sm leading-relaxed mb-16 italic">
              Leading the transition to post-classical computation through advanced superconducting gate-based architectures.
            </p>
            <div className="flex gap-8">
              {[Globe, Shield, FlaskConical].map((Icon, i) => (
                <button key={i} className="text-white/20 hover:text-[#7000ff] transition-colors">
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#7000ff]">Infrastructure</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              <li className="hover:text-white transition-colors"><Link href="#">Gate_Architectures</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Q_Cloud_Console</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Circuit_Composer</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Security_Audit</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#7000ff]">Research</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              <li className="hover:text-white transition-colors"><Link href="#">Whitepapers</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Error_Mitigation</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Algorithms</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Status_Logs</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[9px] font-bold text-white/10 uppercase tracking-widest">
          <div className="flex items-center gap-10">
            <span>&copy; 2026 QUANTUM COMPUTE CO. ALL RIGHTS RESERVED.</span>
            <div className="flex gap-10 hidden lg:flex">
              <span>NIST_PQC_COMPLIANT</span>
              <span>ISO_27001_CERTIFIED</span>
            </div>
          </div>
          <div className="flex gap-10 font-mono">
            <span>COHERENCE_STABLE</span>
            <span>U_GATE_OPTIMIZED</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
