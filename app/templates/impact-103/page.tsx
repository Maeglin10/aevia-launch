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
  Radio,
  Gauge,
  Dna,
  Microscope,
  FlaskConical,
  Brain,
  Pulse,
  Heart,
  Eye,
  Waves,
} from "lucide-react";

import "../premium.css";

/* ==========================================================================
   DATA MANIFESTS
   ========================================================================== */

const NEURAL_MANIFESTS = {
  hero: {
    sync: "99.98%_SYNC",
    latency: "0.8ms",
    bandwidth: "42Tbps",
    status: "CORTICAL_LINK_ACTIVE",
  },
  layers: [
    {
      id: "neocortex",
      name: "NEO // CORTEX",
      desc: "High-bandwidth interface for cognitive expansion and real-time knowledge synthesis.",
      icon: <Brain className="w-5 h-5" />,
      stats: ["Layer IV Resolution", "12k Micro-Channels", "Zero-Latent Feedback"],
    },
    {
      id: "motor",
      name: "MOTOR // LINK",
      desc: "Precision motor control interface for exoskeleton telemetry and limb substitution.",
      icon: <Zap className="w-5 h-5" />,
      stats: ["0.2ms Delay", "Sub-Millimeter Accuracy", "Multi-Threaded Control"],
    },
    {
      id: "sensory",
      name: "SENSORY // MESH",
      desc: "Full-spectrum sensory augmentation with multispectral visual and auditory overlays.",
      icon: <Eye className="w-5 h-5" />,
      stats: ["IR/UV Integration", "Spatial Audio Synthesis", "Haptic Re-mapping"],
    },
  ],
  synaptic_data: [
    { region: "Frontal", activity: 84, frequency: "12Hz" },
    { region: "Parietal", activity: 62, frequency: "24Hz" },
    { region: "Occipital", activity: 91, frequency: "40Hz" },
    { region: "Temporal", activity: 45, frequency: "15Hz" },
  ],
  trials: [
    { phase: "Phase I", title: "Biocompatibility", status: "Verified" },
    { phase: "Phase II", title: "Neural Synthesis", status: "Verified" },
    { phase: "Phase III", title: "Human Deployment", status: "Active" },
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
   NEURAL // LINK COMPONENT
   ========================================================================== */

export default function NeuralLinkPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#050505] text-white font-mono selection:bg-[#00ff88] selection:text-black overflow-x-hidden">
      {/* ── BACKGROUND ARCHITECTURE ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0a140a_0%,transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#00ff88 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />
        <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-[#00ff88]/5 to-transparent" />
      </div>

      {/* ── NAVIGATION ── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#050505]/90 backdrop-blur-xl py-4 border-b border-white/5 shadow-[0_0_40px_rgba(0,255,136,0.05)]" : "bg-transparent py-10"}`}
      >
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-3 text-xl font-black tracking-tighter"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-[#00ff88] to-[#0066ff] rounded flex items-center justify-center text-black">
              <Brain className="w-5 h-5" />
            </div>
            <span className="group-hover:text-[#00ff88] transition-colors">
              NEURAL // <span className="text-white/40">LINK</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Interface", "Augmentation", "Deployment", "Ethics"].map((l) => (
              <Link
                key={l}
                href="#"
                className="hover:text-[#00ff88] transition-colors"
              >
                {l}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button className="hidden md:block text-white/30 hover:text-white transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <MagneticBtn className="px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#00ff88] transition-all">
              Initialize_Sync
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
            className="fixed inset-0 z-[100] bg-[#050505] p-8 flex flex-col pt-32"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8 text-white/40"
            >
              <X className="w-10 h-10" />
            </button>
            <div className="flex flex-col gap-10 text-5xl font-black tracking-tighter uppercase">
              {["Interface", "Augmentation", "Deployment", "Ethics"].map((l) => (
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
                  <div className="px-3 py-1 bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] text-[9px] font-bold uppercase tracking-widest">
                    {NEURAL_MANIFESTS.hero.status}
                  </div>
                  <div className="text-[9px] text-white/30 tracking-widest uppercase">
                    SYNC: {NEURAL_MANIFESTS.hero.sync} // BANDWIDTH:{" "}
                    {NEURAL_MANIFESTS.hero.bandwidth}
                  </div>
                </div>
                <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[0.8] tracking-tighter uppercase mb-10">
                  Human <br />{" "}
                  <span className="text-[#00ff88]">Augmented.</span> <br />{" "}
                  Neural <br />{" "}
                  <span className="text-white/20">Synthesis.</span>
                </h1>
                <p className="max-w-2xl text-xl text-white/40 leading-relaxed font-light mb-12 uppercase tracking-widest italic">
                  Beyond the biological barrier. High-bandwidth cortical
                  interfaces for cognitive expansion, motor control, and sensory
                  augmentation. Engineering the future of consciousness.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <button className="px-12 py-5 bg-[#00ff88] text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all shadow-[0_0_50px_rgba(0,255,136,0.2)]">
                    Initialize_Link
                  </button>
                  <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all">
                    View_Safety_Protocol
                  </button>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-4 relative hidden lg:block">
              <Reveal delay={0.2}>
                <div className="relative aspect-square bg-[#0a0a0f] border border-white/5 p-12 rounded-3xl overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00ff88]/5 to-transparent" />

                  {/* Brain Activity Simulation */}
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">
                          SYNAPTIC_PULSE
                        </div>
                        <div className="text-xl font-black text-[#00ff88]">
                          {NEURAL_MANIFESTS.hero.latency}
                        </div>
                      </div>
                      <Waves className="w-5 h-5 text-white/20 animate-pulse" />
                    </div>

                    {/* Frequency Bars */}
                    <div className="flex items-end justify-between h-40 gap-4 mb-10">
                      {NEURAL_MANIFESTS.synaptic_data.map((item, i) => (
                        <div
                          key={i}
                          className="flex-1 flex flex-col items-center gap-4"
                        >
                          <div className="text-[8px] font-bold text-white/10 rotate-90 mb-8 whitespace-nowrap">
                            {item.region}
                          </div>
                          <div className="relative w-full h-full bg-white/5 rounded-t-sm overflow-hidden">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${item.activity}%` }}
                              transition={{
                                duration: 1.5,
                                delay: 0.5 + i * 0.1,
                                repeat: Infinity,
                                repeatType: "reverse",
                              }}
                              className="w-full bg-gradient-to-t from-[#00ff88]/40 to-[#0066ff]/40"
                            />
                          </div>
                          <div className="text-[8px] font-bold text-[#00ff88]">
                            {item.frequency}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-white/5 flex justify-between items-center text-[8px] font-bold text-white/20 uppercase tracking-widest">
                      <span>BIO_ENCRYPT_ON</span>
                      <div className="flex items-center gap-2 text-[#00ff88]">
                        <div className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-ping" />
                        <span>LINK_STABLE</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERFACE LAYERS ── */}
      <section className="py-40 bg-[#08080a] border-y border-white/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <Reveal>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
                Interface <br />{" "}
                <span className="text-[#00ff88]">Shells.</span>
              </h2>
            </Reveal>
            <p className="max-w-md text-sm text-white/30 leading-relaxed uppercase tracking-widest font-light italic">
              Modular cortical engagement. Select the specific interface layer
              required for your objective, from cognitive expansion to high-dexterity control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {NEURAL_MANIFESTS.layers.map((layer, i) => (
              <Reveal key={layer.id} delay={i * 0.1}>
                <div className="group p-12 bg-[#0a0a0f] border border-white/5 hover:border-[#00ff88]/30 transition-all flex flex-col h-full rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00ff88]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-[#00ff88] mb-12 group-hover:bg-[#00ff88] group-hover:text-black transition-all">
                    {layer.icon}
                  </div>
                  <h3 className="text-3xl font-black uppercase mb-6 tracking-tighter group-hover:text-[#00ff88] transition-colors">
                    {layer.name}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed mb-12 flex-1 italic">
                    "{layer.desc}"
                  </p>

                  <div className="space-y-5 pt-10 border-t border-white/5">
                    {layer.stats.map((s, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-4 text-[9px] font-bold text-white/20 uppercase tracking-widest"
                      >
                        <div className="w-1.5 h-1.5 bg-[#00ff88] rotate-45" />
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

      {/* ── BIO-TELEMETRY (Animated Visualization) ── */}
      <section className="py-40 bg-[#050505]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center">
            <div className="lg:col-span-6 relative">
              <Reveal>
                <div className="relative aspect-video bg-[#0a0a0f] border border-white/5 rounded-2xl overflow-hidden p-8 group">
                  <div className="absolute top-6 left-6 text-[8px] font-bold text-white/20 tracking-widest uppercase">
                    CORTICAL_SCAN // DEPTH: 1.2mm
                  </div>
                  {/* Pulse Waveform */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      viewBox="0 0 400 100"
                      className="w-full h-full overflow-visible"
                    >
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        d="M 0 50 L 50 50 L 60 20 L 70 80 L 80 50 L 150 50 L 160 10 L 170 90 L 180 50 L 250 50 L 260 30 L 270 70 L 280 50 L 400 50"
                        fill="none"
                        stroke="#00ff88"
                        strokeWidth="0.5"
                        strokeOpacity="0.4"
                      />
                    </svg>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-[8px] font-bold text-white/20 tracking-widest uppercase">
                    <div className="flex gap-10">
                      <span>HRV: 82ms</span>
                      <span>O2_SAT: 99.4%</span>
                    </div>
                    <div className="text-[#00ff88]">LINK_NOMINAL</div>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-6">
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#00ff88] mb-6 block">
                  Safety_Protocols
                </span>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-12 uppercase">
                  Biological <br />{" "}
                  <span className="text-white/20">Validation.</span>
                </h2>
                <div className="space-y-10">
                  {NEURAL_MANIFESTS.trials.map((trial, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-8 bg-white/2 border border-white/5 hover:border-[#00ff88]/30 transition-all"
                    >
                      <div className="flex items-center gap-10">
                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                          {trial.phase}
                        </div>
                        <div className="text-2xl font-black uppercase tracking-tighter">
                          {trial.title}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[#00ff88]">
                        <div className="w-1.5 h-1.5 bg-[#00ff88] rounded-full" />
                        {trial.status}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── AUGMENTATION METRICS ── */}
      <section className="py-40 bg-[#0a0a0f] border-y border-white/5 text-center overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 relative">
          <Reveal>
            <h2 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85] mb-12 text-white/5">
              Beyond <br /> Biological.
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mt-24">
              {[
                { label: "SYNC_ACCURACY", val: "99.98%" },
                { label: "NEURAL_LATENCY", val: "0.8ms" },
                { label: "CHANNEL_COUNT", val: "42,000" },
                { label: "POWER_DRAW", val: "0.4W" },
              ].map((s, i) => (
                <div key={i} className="group">
                  <div className="text-5xl font-black text-white mb-4 group-hover:text-[#00ff88] transition-colors">
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
      <section className="py-40 bg-[#050505]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">
              Unlock <br />{" "}
              <span className="text-[#00ff88]">Synthesis.</span>
            </h2>
            <p className="max-w-2xl mx-auto text-sm text-white/40 leading-relaxed font-light mb-16 uppercase tracking-widest italic">
              Humanity is a platform. Begin your cognitive expansion journey today with the world's most advanced neural interface system.
            </p>
            <MagneticBtn className="px-16 py-6 bg-white text-black text-[12px] font-black uppercase tracking-[0.4em] hover:bg-[#00ff88] transition-all shadow-[0_0_60px_rgba(0,255,136,0.15)]">
              Schedule_Deployment
            </MagneticBtn>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#050505] border-t border-white/5 py-32 px-6 md:px-12">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10">
              <div className="w-8 h-8 bg-white text-black rounded flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <span>NEURAL // LINK</span>
            </Link>
            <p className="text-[11px] text-white/20 uppercase tracking-[0.2em] max-w-sm leading-relaxed mb-16 italic">
              Pioneering the safe integration of high-bandwidth neural interfaces for cognitive expansion and biological harmony.
            </p>
            <div className="flex gap-8">
              {[Activity, Shield, FlaskConical].map((Icon, i) => (
                <button key={i} className="text-white/20 hover:text-[#00ff88] transition-colors">
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#00ff88]">Interface</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              <li className="hover:text-white transition-colors"><Link href="#">Cortical_Layers</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Sync_Protocol</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Bio_Compatibility</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Safety_SLA</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#00ff88]">Developers</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              <li className="hover:text-white transition-colors"><Link href="#">SDK_Reference</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Neural_API</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Circuit_Composer</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Audit_Reports</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[9px] font-bold text-white/10 uppercase tracking-widest">
          <div className="flex items-center gap-10">
            <span>&copy; 2026 NEURAL LINK SYSTEMS. ALL RIGHTS RESERVED.</span>
            <div className="flex gap-10 hidden lg:flex">
              <span>HIPAA_COMPLIANT</span>
              <span>ISO_27701_VERIFIED</span>
            </div>
          </div>
          <div className="flex gap-10 font-mono">
            <span>LINK_STABLE_V9</span>
            <span>NODE_SYNC_COMPLETE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
