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
  Database,
  Binary,
  Code2,
  Lock,
  Box,
  Fingerprint,
  Waves,
  Crosshair,
  Beaker,
} from "lucide-react";

import "../premium.css";

/* ==========================================================================
   DATA MANIFESTS
   ========================================================================== */

const GENE_MANIFESTS = {
  hero: {
    sequence_rate: "4.2Tb/hr",
    accuracy: "99.999%",
    cost_per_genome: "$98",
    status: "SEQUENCER_ONLINE",
  },
  services: [
    {
      id: "wgs",
      name: "WHOLE // GENOME",
      desc: "Full-spectrum sequencing with deep-coverage analysis for complex genetic identification.",
      icon: <Dna className="w-5 h-5" />,
      stats: ["30x Coverage", "Variant Discovery", "Phasing Analysis"],
    },
    {
      id: "epigen",
      name: "EPI // GENETICS",
      desc: "Mapping DNA methylation and chromatin accessibility for environmental response tracking.",
      icon: <Fingerprint className="w-5 h-5" />,
      stats: ["Methylation Maps", "ATAC-Seq Support", "Temporal Analysis"],
    },
    {
      id: "rna",
      name: "RNA // TRANSCRIPT",
      desc: "Real-time gene expression profiling for dynamic cellular state monitoring and research.",
      icon: <Waves className="w-5 h-5" />,
      stats: ["Single-Cell Res", "Differential Expression", "Isoform Mapping"],
    },
  ],
  sequence_data: [
    { base: "A", density: 24, drift: 0.1 },
    { base: "C", density: 26, drift: -0.2 },
    { base: "T", density: 24, drift: 0.1 },
    { base: "G", density: 26, drift: 0.3 },
  ],
  pipeline: [
    { step: "S_01", task: "Ligation", status: "Nominal" },
    { step: "S_02", task: "Amplification", status: "Nominal" },
    { step: "S_03", task: "Base_Calling", status: "Active" },
    { step: "S_04", task: "Alignment", status: "Pending" },
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
   GENE // SEQ COMPONENT
   ========================================================================== */

export default function GeneSeqPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#050605] text-white font-mono selection:bg-[#00ff88] selection:text-black overflow-x-hidden">
      {/* ── BACKGROUND ARCHITECTURE ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,#0a140a_0%,transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(45deg, #00ff88 0.5px, transparent 0.5px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-[#00ff88]/5 to-transparent" />
      </div>

      {/* ── NAVIGATION ── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#050605]/90 backdrop-blur-xl py-4 border-b border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]" : "bg-transparent py-10"}`}
      >
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-3 text-xl font-black tracking-tighter"
          >
            <div className="w-8 h-8 bg-[#00ff88] rounded-sm flex items-center justify-center text-black">
              <Dna className="w-5 h-5" />
            </div>
            <span className="group-hover:text-[#00ff88] transition-colors">
              GENE // <span className="text-white/40">SEQ</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Sequencing", "Analysis", "Biosphere", "Pipeline"].map((l) => (
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
              Initialize_Run
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
            className="fixed inset-0 z-[100] bg-[#050605] p-8 flex flex-col pt-32"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-10 right-8 text-white/40"
            >
              <X className="w-10 h-10" />
            </button>
            <div className="flex flex-col gap-10 text-5xl font-black tracking-tighter uppercase">
              {["Sequencing", "Analysis", "Biosphere", "Pipeline"].map((l) => (
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
                    {GENE_MANIFESTS.hero.status}
                  </div>
                  <div className="text-[9px] text-white/30 tracking-widest uppercase">
                    RATE: {GENE_MANIFESTS.hero.sequence_rate} // COST:{" "}
                    {GENE_MANIFESTS.hero.cost_per_genome}
                  </div>
                </div>
                <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[0.8] tracking-tighter uppercase mb-10">
                  Molecular <br />{" "}
                  <span className="text-[#00ff88]">Precision.</span> <br />{" "}
                  Sequence <br />{" "}
                  <span className="text-white/20">Truth.</span>
                </h1>
                <p className="max-w-2xl text-xl text-white/40 leading-relaxed font-light mb-12 uppercase tracking-widest italic">
                  Challenging the complexity of the genome. High-throughput
                  sequencing, automated pipeline analysis, and structural variant
                  discovery at the speed of light. Engineering the biological blueprint.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <button className="px-12 py-5 bg-[#00ff88] text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all shadow-[0_0_50px_rgba(0,255,136,0.15)]">
                    Explore_Analysis_Portal
                  </button>
                  <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">
                    View_Data_Manifests
                  </button>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-4 relative hidden lg:block">
              <Reveal delay={0.2}>
                <div className="relative aspect-square bg-[#0a0a0f] border border-white/5 p-12 rounded-3xl overflow-hidden group shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00ff88]/5 to-transparent" />

                  {/* Sequencing HUD */}
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">
                          BASE_CALL_ACCURACY
                        </div>
                        <div className="text-xl font-black text-[#00ff88]">
                          {GENE_MANIFESTS.hero.accuracy}
                        </div>
                      </div>
                      <div className="w-10 h-10 border border-white/5 rounded-full flex items-center justify-center">
                        <Microscope className="w-5 h-5 text-white/20 animate-pulse" />
                      </div>
                    </div>

                    {/* Progress Metrics */}
                    <div className="space-y-10 my-10">
                      {GENE_MANIFESTS.sequence_data.map((item, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest mb-3">
                            <span className="text-white/40">BASE_{item.base}_DENSITY</span>
                            <span className="text-[#00ff88]">{item.density}%</span>
                          </div>
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.density}%` }}
                              transition={{ duration: 2, delay: 0.5 + i * 0.1 }}
                              className="h-full bg-[#00ff88]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-white/5 flex justify-between items-center text-[8px] font-bold text-white/20 uppercase tracking-widest">
                      <span>ALIGNMENT_SYNC_ON</span>
                      <div className="flex items-center gap-2 text-[#00ff88]">
                        <div className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-ping" />
                        <span>RUN_ACTIVE</span>
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
      <section className="py-40 bg-[#08080a] border-y border-white/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <Reveal>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
                Bio-Informatics <br />{" "}
                <span className="text-[#00ff88]">Ecosystem.</span>
              </h2>
            </Reveal>
            <p className="max-w-md text-sm text-white/30 leading-relaxed uppercase tracking-widest font-light italic">
              From population-scale genomics to single-cell dynamics, our unified sequencing platform provides the resolution required for breakthrough discoveries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {GENE_MANIFESTS.services.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.1}>
                <div className="group p-12 bg-[#0a0a0f] border border-white/5 hover:border-[#00ff88]/30 transition-all flex flex-col h-full rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00ff88]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-[#00ff88] mb-12 group-hover:bg-[#00ff88] group-hover:text-black transition-all">
                    {s.icon}
                  </div>
                  <h3 className="text-3xl font-black uppercase mb-6 tracking-tighter group-hover:text-[#00ff88] transition-colors">
                    {s.name}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed mb-12 flex-1 italic">
                    "{s.desc}"
                  </p>

                  <div className="space-y-5 pt-10 border-t border-white/5">
                    {s.stats.map((spec, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-4 text-[9px] font-bold text-white/20 uppercase tracking-widest"
                      >
                        <div className="w-1.5 h-1.5 bg-[#00ff88] rotate-45" />
                        {spec}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANALYSIS PIPELINE (Data Visualization) ── */}
      <section className="py-40 bg-[#050605]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center">
            <div className="lg:col-span-6">
              <Reveal>
                <div className="relative aspect-video bg-[#0a0a0f] border border-white/5 rounded-2xl overflow-hidden p-8 group">
                  <div className="absolute top-6 left-6 text-[8px] font-bold text-white/20 tracking-widest uppercase">
                    REALTIME_SEQUENCE_FLOW
                  </div>
                  {/* Helix Waveform Simulation */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <svg
                      viewBox="0 0 400 100"
                      className="w-full h-full overflow-visible"
                    >
                      {[...Array(20)].map((_, i) => (
                        <motion.circle
                          key={i}
                          initial={{ cx: i * 20, cy: 50 }}
                          animate={{
                            cy: [50, 20, 80, 50],
                            cx: [i * 20, i * 20 + 5, i * 20],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                          r="2"
                          fill="#00ff88"
                        />
                      ))}
                      {[...Array(20)].map((_, i) => (
                        <motion.circle
                          key={`b-${i}`}
                          initial={{ cx: i * 20, cy: 50 }}
                          animate={{
                            cy: [50, 80, 20, 50],
                            cx: [i * 20, i * 20 - 5, i * 20],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                          r="2"
                          fill="#00ff88"
                          opacity="0.3"
                        />
                      ))}
                    </svg>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-[8px] font-bold text-white/20 tracking-widest uppercase">
                    <div className="flex gap-10">
                      <span>VAR_DISC: 1,420</span>
                      <span>HET_RATIO: 0.82</span>
                    </div>
                    <div className="text-[#00ff88]">SEQUENCING_LOCKED</div>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-6">
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#00ff88] mb-6 block">
                  Processing_Pipeline
                </span>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-12 uppercase">
                  Automated <br />{" "}
                  <span className="text-white/20">Alignment.</span>
                </h2>
                <div className="space-y-8">
                  {GENE_MANIFESTS.pipeline.map((p, i) => (
                    <div
                      key={i}
                      className="group flex flex-col md:flex-row justify-between items-center p-8 bg-white/2 border border-white/5 hover:border-[#00ff88]/30 transition-all"
                    >
                      <div className="flex items-center gap-10 mb-6 md:mb-0">
                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                          {p.step}
                        </div>
                        <div className="text-2xl font-black uppercase tracking-tighter">
                          {p.task}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[#00ff88]">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${p.status === "Active" ? "bg-[#00ff88] animate-pulse" : "bg-white/20"}`}
                        />
                        <span className={p.status === "Active" ? "text-[#00ff88]" : "text-white/20"}>{p.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRECISION METRICS ── */}
      <section className="py-40 bg-[#0a0a0f] border-y border-white/5 text-center overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 relative">
          <Reveal>
            <h2 className="text-7xl md:text-[12rem] font-black tracking-tighter uppercase leading-[0.85] mb-12 text-white/5">
              Molecular <br /> Truth.
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mt-24">
              {[
                { label: "CALL_ACCURACY", val: "99.999%" },
                { label: "GENOME_TIME", val: "1.4hrs" },
                { label: "S_INDEX_RATIO", val: "1:420" },
                { label: "ERROR_OFFSET", val: "0.001%" },
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
      <section className="py-40 bg-[#050605]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">
              Decode <br />{" "}
              <span className="text-[#00ff88]">Biology.</span>
            </h2>
            <p className="max-w-2xl mx-auto text-sm text-white/40 leading-relaxed font-light mb-16 uppercase tracking-widest italic">
              The blueprint of life is written in code. Decode it with the world's most precise high-throughput sequencing platform.
            </p>
            <MagneticBtn className="px-16 py-6 bg-white text-black text-[12px] font-black uppercase tracking-[0.4em] hover:bg-[#00ff88] transition-all shadow-[0_0_60px_rgba(0,255,136,0.15)]">
              Initialize_Sequencing_Run
            </MagneticBtn>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#050605] border-t border-white/5 py-32 px-6 md:px-12">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10">
              <div className="w-8 h-8 bg-white text-black rounded flex items-center justify-center">
                <Dna className="w-5 h-5" />
              </div>
              <span>GENE // SEQ</span>
            </Link>
            <p className="text-[11px] text-white/20 uppercase tracking-[0.2em] max-w-sm leading-relaxed mb-16 italic">
              Engineering the molecular foundation for the next century of genomic discovery and personalized health.
            </p>
            <div className="flex gap-8">
              {[FlaskConical, Microscope, Beaker].map((Icon, i) => (
                <button key={i} className="text-white/20 hover:text-[#00ff88] transition-colors">
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#00ff88]">Services</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              <li className="hover:text-white transition-colors"><Link href="#">WGS_Sequencing</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Transcriptomics</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Epigenetic_Maps</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Custom_Panels</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#00ff88]">Analytics</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              <li className="hover:text-white transition-colors"><Link href="#">Pipeline_Access</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Variant_Viewer</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Bio_Compute_SLA</Link></li>
              <li className="hover:text-white transition-colors"><Link href="#">Status_Logs</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[9px] font-bold text-white/10 uppercase tracking-widest">
          <div className="flex items-center gap-10">
            <span>&copy; 2026 GENE SEQ RESEARCH. ALL RIGHTS RESERVED.</span>
            <div className="flex gap-10 hidden lg:flex">
              <span>CLIA_CERTIFIED</span>
              <span>ISO_13485_VERIFIED</span>
            </div>
          </div>
          <div className="flex gap-10 font-mono">
            <span>SEQUENCE_STABLE</span>
            <span>DATA_SYNC_COMPLETE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
