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
  Dna,
  Microscope,
  FlaskConical,
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
  Database,
  Lock,
  Box,
  Fingerprint,
  Waves,
  Crosshair,
  Beaker,
  TestTube,
  Thermometer,
  Wind,
  Droplets,
  Container,
} from "lucide-react";

import "../premium.css";

/* ==========================================================================
   DATA MANIFESTS
   ========================================================================== */

const SYNTH_MANIFESTS = {
  hero: {
    growth_rate: "4.2mm/hr",
    purity: "99.98%",
    batch_id: "SC-982-ALPHA",
    status: "BIOREACTOR_OPTIMAL",
  },
  platforms: [
    {
      id: "mycelium",
      name: "MYCEL // UNIT",
      desc: "Industrial-scale fungal architecture for sustainable structural material growth.",
      icon: <Layers className="w-5 h-5" />,
      specs: ["High-Density Growth", "Carbon-Negative", "Self-Healing Core"],
    },
    {
      id: "protein",
      name: "PROT // FORGE",
      desc: "Precision protein synthesis for advanced pharmaceutical and metabolic engineering.",
      icon: <TestTube className="w-5 h-5" />,
      specs: ["Sub-Angstrom Res", "Enzymatic Catalysis", "Rapid Folding"],
    },
    {
      id: "tissue",
      name: "TISSUE // MESH",
      desc: "Scaffolded cellular growth for organoid development and regenerative bio-logistics.",
      icon: <Dna className="w-5 h-5" />,
      specs: ["3D-Bioprinting", "Vascularization", "Immune-Compatibility"],
    },
  ],
  growth_telemetry: [
    { label: "CELLULAR_DENSITY", val: 92, color: "#00ff88" },
    { label: "NUTRIENT_SATURATION", val: 88, color: "#00ff88" },
    { label: "THERMAL_STABILITY", val: 100, color: "#00ff88" },
    { label: "PH_EQUILIBRIUM", val: 74, color: "#ffaa00" },
  ],
  batches: [
    { id: "B-24", material: "Silk-Polymer", yield: "94%", status: "Harvesting" },
    { id: "B-25", material: "Bone-Scaffold", yield: "62%", status: "Incubating" },
    { id: "B-26", material: "Neural-Mesh", yield: "Nominal", status: "Seeding" },
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
   SYNTH // CELL COMPONENT
   ========================================================================== */

export default function SynthCellPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#050806] text-white font-mono selection:bg-[#00ff88] selection:text-black overflow-x-hidden">
      {/* ── BACKGROUND ARCHITECTURE ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#0a180f_0%,transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#00ff88 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-[#00ff88]/5 to-transparent" />
      </div>

      {/* ── NAVIGATION ── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#050806]/90 backdrop-blur-xl py-4 border-b border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]" : "bg-transparent py-10"}`}
      >
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-3 text-xl font-black tracking-tighter"
          >
            <div className="w-8 h-8 bg-[#00ff88] rounded-full flex items-center justify-center text-black">
              <FlaskConical className="w-5 h-5" />
            </div>
            <span className="group-hover:text-[#00ff88] transition-colors">
              SYNTH // <span className="text-white/40">CELL</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Synthesis", "Platforms", "Biometrics", "Incubation"].map((l) => (
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
              Initialize_Seeding
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
            className="fixed inset-0 z-[100] bg-[#050806] p-8 flex flex-col pt-32"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8 text-white/40"
            >
              <X className="w-10 h-10" />
            </button>
            <div className="flex flex-col gap-10 text-5xl font-black tracking-tighter uppercase">
              {["Synthesis", "Platforms", "Biometrics", "Incubation"].map((l) => (
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
                    {SYNTH_MANIFESTS.hero.status}
                  </div>
                  <div className="text-[9px] text-white/30 tracking-widest uppercase">
                    RATE: {SYNTH_MANIFESTS.hero.growth_rate} // BATCH:{" "}
                    {SYNTH_MANIFESTS.hero.batch_id}
                  </div>
                </div>
                <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[0.8] tracking-tighter uppercase mb-10">
                  Biological <br />{" "}
                  <span className="text-[#00ff88]">Synthesis.</span> <br />{" "}
                  Lab-Grown <br />{" "}
                  <span className="text-white/20">Future.</span>
                </h1>
                <p className="max-w-2xl text-xl text-white/40 leading-relaxed font-light mb-12 uppercase tracking-widest italic">
                  Challenging the extraction model. High-fidelity synthetic 
                  biology for sustainable material growth, protein engineering, 
                  and regenerative medicine.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <button className="px-12 py-5 bg-[#00ff88] text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_50px_rgba(0,255,136,0.15)]">
                    Explore_Synthesis
                  </button>
                  <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">
                    View_Growth_Logs
                  </button>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-4 relative hidden lg:block">
              <Reveal delay={0.2}>
                <div className="relative aspect-square bg-[#0a0f0a] border border-white/5 p-12 rounded-3xl overflow-hidden group shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00ff88]/5 to-transparent" />

                  {/* Growth HUD */}
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">
                          BATCH_PURITY
                        </div>
                        <div className="text-xl font-black text-[#00ff88]">
                          {SYNTH_MANIFESTS.hero.purity}
                        </div>
                      </div>
                      <div className="w-10 h-10 border border-white/5 rounded-full flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white/20 animate-pulse" />
                      </div>
                    </div>

                    {/* Progress Metrics */}
                    <div className="space-y-10 my-10">
                      {SYNTH_MANIFESTS.growth_telemetry.map((stat, i) => (
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
                      <span>BIO_SAFETY_LEVEL_4</span>
                      <div className="flex items-center gap-2 text-[#00ff88]">
                        <div className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-ping" />
                        <span>GROWTH_ACTIVE</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── PLATFORMS SECTION ── */}
      <section className="py-40 bg-[#080a08] border-y border-white/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <Reveal>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
                Growth <br />{" "}
                <span className="text-[#00ff88]">Platforms.</span>
              </h2>
            </Reveal>
            <p className="max-w-md text-sm text-white/30 leading-relaxed uppercase tracking-widest font-light italic">
              Modular bio-manufacturing. Select the specific synthesis platform required for your material or therapeutic objective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {SYNTH_MANIFESTS.platforms.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.1}>
                <div className="group p-12 bg-[#0a0f0a] border border-white/5 hover:border-[#00ff88]/30 transition-all flex flex-col h-full rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00ff88]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-[#00ff88] mb-12 group-hover:bg-[#00ff88] group-hover:text-black transition-all">
                    {p.icon}
                  </div>
                  <h3 className="text-3xl font-black uppercase mb-6 tracking-tighter group-hover:text-[#00ff88] transition-colors">
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

      {/* ── BATCH MONITOR (Data Visualization) ── */}
      <section className="py-40 bg-[#050806]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center">
            <div className="lg:col-span-6">
              <Reveal>
                <div className="relative aspect-video bg-[#0a0f0a] border border-white/5 rounded-2xl overflow-hidden p-8 group">
                  <div className="absolute top-6 left-6 text-[8px] font-bold text-white/20 tracking-widest uppercase">
                    BIOREACTOR_ALPHA_STREAM
                  </div>
                  {/* Cellular Growth Visualization */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <div className="relative w-full h-full">
                      {[...Array(30)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            x: [Math.random() * 400, Math.random() * 400],
                            y: [Math.random() * 200, Math.random() * 200],
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.4, 0.1],
                          }}
                          transition={{
                            duration: 10 + Math.random() * 10,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                          className="absolute w-4 h-4 bg-[#00ff88]/20 rounded-full blur-sm"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-[8px] font-bold text-white/20 tracking-widest uppercase">
                    <div className="flex gap-10">
                      <span>PH: 7.24</span>
                      <span>TEMP: 37.0°C</span>
                    </div>
                    <div className="text-[#00ff88]">METABOLIC_LOCK</div>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-6">
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#00ff88] mb-6 block">
                  Active_Incubation
                </span>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-12 uppercase">
                  Batch <br />{" "}
                  <span className="text-white/20">Logistics.</span>
                </h2>
                <div className="space-y-8">
                  {SYNTH_MANIFESTS.batches.map((batch, i) => (
                    <div
                      key={i}
                      className="group flex flex-col md:flex-row justify-between items-center p-8 bg-white/2 border border-white/5 hover:border-[#00ff88]/30 transition-all"
                    >
                      <div className="flex items-center gap-10 mb-6 md:mb-0">
                        <div className="text-2xl font-black uppercase tracking-tighter">
                          {batch.id}
                        </div>
                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                          {batch.material}
                        </div>
                      </div>
                      <div className="flex items-center gap-12 text-[10px] font-bold uppercase tracking-widest">
                        <div className="flex items-center gap-3">
                          <Droplets className="w-4 h-4 text-[#00ff88]" />
                          <span className="text-white/40">YIELD:</span>
                          <span>{batch.yield}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${batch.status === "Harvesting" ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`}
                          />
                          <span className="text-white/40">STATUS:</span>
                          <span className={batch.status === "Harvesting" ? "text-green-500" : ""}>{batch.status}</span>
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

      {/* ── SUSTAINABILITY METRICS ── */}
      <section className="py-40 bg-[#0a0f0a] border-y border-white/5 text-center overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 relative">
          <Reveal>
            <h2 className="text-7xl md:text-[12rem] font-black tracking-tighter uppercase leading-[0.85] mb-12 text-white/5">
              Net <br /> Zero.
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mt-24">
              {[
                { label: "CARBON_SEQ", val: "100%" },
                { label: "WASTE_REDUCTION", val: "94.2%" },
                { label: "WATER_SAVINGS", val: "820kL" },
                { label: "BIO_HAZARD_LVL", val: "ZERO" },
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
      <section className="py-40 bg-[#050806]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">
              Unlock <br />{" "}
              <span className="text-[#00ff88]">Growth.</span>
            </h2>
            <p className="max-w-2xl mx-auto text-sm text-white/40 leading-relaxed font-light mb-16 uppercase tracking-widest italic">
              The future is grown, not extracted. Initialize your synthetic biology and bio-manufacturing strategy today with Synth Cell Systems.
            </p>
            <MagneticBtn className="px-16 py-6 bg-white text-black text-[12px] font-black uppercase tracking-[0.4em] hover:bg-[#00ff88] transition-all shadow-[0_0_60px_rgba(0,255,136,0.15)]">
              Initialize_Batch_Alpha
            </MagneticBtn>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#050806] border-t border-white/5 py-32 px-6 md:px-12">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10">
              <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center">
                <FlaskConical className="w-5 h-5" />
              </div>
              <span>SYNTH // CELL</span>
            </Link>
            <p className="text-[11px] text-white/20 uppercase tracking-[0.2em] max-w-sm leading-relaxed mb-16 italic">
              Engineering the biological foundation for the next century of sustainable manufacturing and health.
            </p>
            <div className="flex gap-8">
              {[Dna, Microscope, TestTube].map((Icon, i) => (
                <button key={i} className="text-white/20 hover:text-[#00ff88] transition-colors">
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#00ff88]">Platforms</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              <li className="hover:text-white transition-colors"><Link href="#">Mycelium_Units</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Protein_Forge</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Tissue_Mesh</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Incubation_SLA</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#00ff88]">Telemetry</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              <li className="hover:text-white transition-colors"><Link href="#">Live_Biometrics</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Batch_Tracking</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">API_Access</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Security_Logs</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[9px] font-bold text-white/10 uppercase tracking-widest">
          <div className="flex items-center gap-10">
            <span>&copy; 2026 SYNTH CELL BIOSYSTEMS. ALL RIGHTS RESERVED.</span>
            <div className="flex gap-10 hidden lg:flex">
              <span>FDA_COMPLIANT</span>
              <span>ISO_9001_CERTIFIED</span>
            </div>
          </div>
          <div className="flex gap-10 font-mono">
            <span>METABOLIC_STABLE</span>
            <span>CELL_SYNC_COMPLETE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
