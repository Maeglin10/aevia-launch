"use client";
import { motion, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Dna, Microscope, Beaker, Search, Menu, X, FlaskConical, Pill, Heart, Syringe, Activity, Stethoscope, Brain, ScanLine, FileText, ShieldCheck } from "lucide-react";
import "../premium.css";

const MANIFESTS = {
  hero: { trials: "2,841", compounds: "12,400", accuracy: "94.7%", status: "PIPELINE_ACTIVE" },
  platforms: [
    { id: "genesis", name: "GENESIS // FOLD", desc: "Protein structure prediction engine using transformer-based folding models for novel therapeutic targets.", icon: <Dna className="w-5 h-5" />, specs: ["AlphaFold-3 Core", "Sub-Angstrom", "Multi-Chain Complex"] },
    { id: "catalyst", name: "CATALYST // SCREEN", desc: "High-throughput virtual screening platform evaluating millions of compounds against validated targets.", icon: <FlaskConical className="w-5 h-5" />, specs: ["10M Compounds/hr", "ADMET Prediction", "Hit-to-Lead Auto"] },
    { id: "sentinel", name: "SENTINEL // TRIAL", desc: "AI-powered clinical trial design and real-time patient stratification for adaptive protocol management.", icon: <Activity className="w-5 h-5" />, specs: ["Adaptive Phase I-III", "Biomarker Matching", "Real-Time Monitoring"] },
  ],
  telemetry: [
    { label: "FOLD_ACCURACY", val: 94, color: "#10b981" },
    { label: "SCREEN_THROUGHPUT", val: 88, color: "#10b981" },
    { label: "TRIAL_ENROLLMENT", val: 76, color: "#f59e0b" },
    { label: "PIPELINE_VELOCITY", val: 91, color: "#10b981" },
  ],
  pipeline: [
    { compound: "GEN-4821", target: "KRAS_G12C", phase: "Phase II", status: "Enrolling" },
    { compound: "CAT-1103", target: "PD-L1/TIM3", phase: "Phase I", status: "Dosing" },
    { compound: "SEN-7740", target: "CDK4/6", phase: "Preclinical", status: "Lead Opt" },
    { compound: "GEN-9215", target: "EGFR_Ex20", phase: "Phase III", status: "Pivotal" },
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

export default function GenesisPharmPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  return (
    <div className="premium-theme min-h-screen bg-[#040806] text-white font-mono selection:bg-[#10b981] selection:text-black overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,#041a10_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(16,185,129,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.1) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
        {/* DNA Helix animation */}
        <div className="absolute right-0 top-0 h-full w-32 opacity-[0.04]">
          {[...Array(20)].map((_, i) => (
            <motion.div key={i} animate={{ x: [0, 20, 0, -20, 0] }} transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}
              className="absolute w-2 h-2 bg-[#10b981] rounded-full" style={{ top: `${i * 5}%`, right: "50%" }} />
          ))}
        </div>
      </div>

      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#040806]/90 backdrop-blur-xl py-4 border-b border-white/5" : "bg-transparent py-10"}`}>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-xl font-black tracking-tighter">
            <div className="w-8 h-8 bg-[#10b981] rounded-sm flex items-center justify-center text-black"><Dna className="w-5 h-5" /></div>
            <span className="group-hover:text-[#10b981] transition-colors">GENESIS // <span className="text-white/40">PHARM</span></span>
          </Link>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            {["Pipeline", "Platforms", "Clinical_Data", "Publications"].map(l => <Link key={l} href="#" className="hover:text-[#10b981] transition-colors">{l}</Link>)}
          </div>
          <div className="flex items-center gap-6">
            <MagneticBtn className="px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#10b981] transition-all">Partner_Portal</MagneticBtn>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden text-white/60"><Menu className="w-6 h-6" /></button>
          </div>
        </div>
      </nav>

      <AnimatePresence>{menuOpen && (
        <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-[100] bg-[#040806] p-8 flex flex-col pt-32">
          <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-8 text-white/40"><X className="w-10 h-10" /></button>
          <div className="flex flex-col gap-10 text-5xl font-black tracking-tighter uppercase">
            {["Pipeline", "Platforms", "Clinical_Data", "Publications"].map(l => <Link key={l} href="#" onClick={() => setMenuOpen(false)}>{l}</Link>)}
          </div>
        </motion.div>
      )}</AnimatePresence>

      {/* HERO */}
      <section className="relative h-screen flex flex-col justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div key={i} animate={{ y: [0, -30, 0], opacity: [0.02, 0.08, 0.02] }} transition={{ duration: 6, repeat: Infinity, delay: i * 1 }}
              className="absolute h-px bg-gradient-to-r from-transparent via-[#10b981]/30 to-transparent" style={{ top: `${20 + i * 12}%`, width: "100%" }} />
          ))}
        </div>
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-8">
              <Reveal>
                <div className="flex items-center gap-4 mb-8">
                  <div className="px-3 py-1 bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] text-[9px] font-bold uppercase tracking-widest">{MANIFESTS.hero.status}</div>
                  <div className="text-[9px] text-white/30 tracking-widest uppercase">TRIALS: {MANIFESTS.hero.trials} // COMPOUNDS: {MANIFESTS.hero.compounds}</div>
                </div>
                <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-[0.8] tracking-tighter uppercase mb-10">
                  Drug <br /> <span className="text-[#10b981]">Discovery.</span> <br /> AI <br /> <span className="text-white/20">Powered.</span>
                </h1>
                <p className="max-w-2xl text-xl text-white/40 leading-relaxed font-light mb-12 uppercase tracking-widest italic">
                  Accelerating therapeutic discovery through protein folding prediction, virtual screening, and AI-optimized clinical trial design. From target to patient in record time.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <button className="px-12 py-5 bg-[#10b981] text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_50px_rgba(16,185,129,0.2)]">View_Pipeline</button>
                  <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">Research_Portal</button>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-4 relative hidden lg:block">
              <Reveal delay={0.2}>
                <div className="relative aspect-square bg-[#060a08] border border-white/5 p-12 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/5 to-transparent" />
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div><div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">FOLD_ACCURACY</div><div className="text-xl font-black text-[#10b981]">{MANIFESTS.hero.accuracy}</div></div>
                      <div className="w-10 h-10 border border-white/5 rounded-full flex items-center justify-center"><Microscope className="w-5 h-5 text-white/20 animate-pulse" /></div>
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
                      <span>GMP_COMPLIANT</span>
                      <div className="flex items-center gap-2 text-[#10b981]"><div className="w-1.5 h-1.5 bg-[#10b981] rounded-full animate-ping" /><span>SCREENING</span></div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORMS */}
      <section className="py-40 bg-[#060a08] border-y border-white/5">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <Reveal><h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">Discovery <br /> <span className="text-[#10b981]">Platforms.</span></h2></Reveal>
            <p className="max-w-md text-sm text-white/30 leading-relaxed uppercase tracking-widest font-light italic">End-to-end computational drug discovery from target identification through clinical trial optimization.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {MANIFESTS.platforms.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.1}>
                <div className="group p-12 bg-[#060a08] border border-white/5 hover:border-[#10b981]/30 transition-all flex flex-col h-full rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#10b981]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-[#10b981] mb-12 group-hover:bg-[#10b981] group-hover:text-black transition-all">{p.icon}</div>
                  <h3 className="text-3xl font-black uppercase mb-6 tracking-tighter group-hover:text-[#10b981] transition-colors">{p.name}</h3>
                  <p className="text-sm text-white/40 leading-relaxed mb-12 flex-1 italic">"{p.desc}"</p>
                  <div className="space-y-5 pt-10 border-t border-white/5">
                    {p.specs.map((s, j) => <div key={j} className="flex items-center gap-4 text-[9px] font-bold text-white/20 uppercase tracking-widest"><div className="w-1.5 h-1.5 bg-[#10b981] rotate-45" />{s}</div>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PIPELINE */}
      <section className="py-40 bg-[#040806]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center">
            <div className="lg:col-span-6">
              <Reveal>
                <div className="relative aspect-video bg-[#060a08] border border-white/5 rounded-2xl overflow-hidden p-8">
                  <div className="absolute top-6 left-6 text-[8px] font-bold text-white/20 tracking-widest uppercase">MOLECULAR_VIZ</div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {[...Array(16)].map((_, i) => {
                      const angle = (i / 16) * Math.PI * 2;
                      const r = 60 + Math.random() * 40;
                      return (
                        <motion.div key={i} animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.15 }}
                          className="absolute w-3 h-3 bg-[#10b981]/30 rounded-full border border-[#10b981]/20"
                          style={{ left: `calc(50% + ${Math.cos(angle) * r}px)`, top: `calc(50% + ${Math.sin(angle) * r}px)` }} />
                      );
                    })}
                    <div className="w-6 h-6 bg-[#10b981] rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)]" />
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-[8px] font-bold text-white/20 tracking-widest uppercase">
                    <span>BONDS: 48</span><div className="text-[#10b981]">FOLD_STABLE</div>
                  </div>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-6">
              <Reveal>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#10b981] mb-6 block">Active_Compounds</span>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-12 uppercase">Clinical <br /> <span className="text-white/20">Pipeline.</span></h2>
                <div className="space-y-8">
                  {MANIFESTS.pipeline.map((c, i) => (
                    <div key={i} className="group flex flex-col md:flex-row justify-between items-center p-8 bg-white/2 border border-white/5 hover:border-[#10b981]/30 transition-all">
                      <div className="flex items-center gap-10 mb-6 md:mb-0">
                        <div className="text-2xl font-black uppercase tracking-tighter">{c.compound}</div>
                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{c.target}</div>
                      </div>
                      <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest">
                        <span className={`px-2 py-1 rounded text-[8px] ${c.phase === "Phase III" ? "bg-green-500/20 text-green-400" : c.phase === "Phase II" ? "bg-blue-500/20 text-blue-400" : c.phase === "Phase I" ? "bg-yellow-500/20 text-yellow-400" : "bg-white/5 text-white/40"}`}>{c.phase}</span>
                        <div className="flex items-center gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full ${c.status === "Pivotal" ? "bg-green-500 animate-pulse" : "bg-[#10b981]"}`} />
                          <span>{c.status}</span>
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
      <section className="py-40 bg-[#060a08] border-y border-white/5 text-center overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12">
          <Reveal>
            <h2 className="text-7xl md:text-[12rem] font-black tracking-tighter uppercase leading-[0.85] mb-12 text-white/5">Cure <br /> Code.</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mt-24">
              {[{ label: "COMPOUNDS_SCREENED", val: "12.4M" }, { label: "TARGETS_VALIDATED", val: "840" }, { label: "ACTIVE_TRIALS", val: "47" }, { label: "TIME_SAVED", val: "4.2yr" }].map((s, i) => (
                <div key={i} className="group"><div className="text-5xl font-black text-white mb-4 group-hover:text-[#10b981] transition-colors">{s.val}</div><div className="text-[10px] font-black text-white/20 uppercase tracking-widest">{s.label}</div></div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 bg-[#040806]">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">Accelerate <br /> <span className="text-[#10b981]">Cures.</span></h2>
            <p className="max-w-2xl mx-auto text-sm text-white/40 leading-relaxed font-light mb-16 uppercase tracking-widest italic">Every compound screened brings us closer. Partner with Genesis Pharm to transform computational biology into life-saving therapeutics.</p>
            <MagneticBtn className="px-16 py-6 bg-white text-black text-[12px] font-black uppercase tracking-[0.4em] hover:bg-[#10b981] transition-all shadow-[0_0_60px_rgba(16,185,129,0.15)]">Request_Partnership</MagneticBtn>
          </Reveal>
        </div>
      </section>

      <footer className="bg-[#040806] border-t border-white/5 py-32 px-6 md:px-12">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter mb-10"><div className="w-8 h-8 bg-white text-black rounded-sm flex items-center justify-center"><Dna className="w-5 h-5" /></div><span>GENESIS // PHARM</span></Link>
            <p className="text-[11px] text-white/20 uppercase tracking-[0.2em] max-w-sm leading-relaxed mb-16 italic">AI-driven drug discovery accelerating the path from molecule to medicine.</p>
            <div className="flex gap-8">{[Microscope, Brain, ShieldCheck].map((Icon, i) => <button key={i} className="text-white/20 hover:text-[#10b981] transition-colors"><Icon className="w-5 h-5" /></button>)}</div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#10b981]">Science</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {["Genesis_Fold", "Catalyst_Screen", "Sentinel_Trial", "Data_Vault"].map(l => <li key={l} className="hover:text-white transition-colors"><Link href="#">{l}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-[#10b981]">Research</h4>
            <ul className="space-y-5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {["Publications", "Clinical_Data", "API_Access", "Compliance"].map(l => <li key={l} className="hover:text-white transition-colors"><Link href="#">{l}</Link></li>)}
            </ul>
          </div>
        </div>
        <div className="max-w-[1500px] mx-auto mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[9px] font-bold text-white/10 uppercase tracking-widest">
          <span>&copy; 2026 GENESIS PHARMACEUTICALS. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-10 font-mono"><span>GMP_CERTIFIED</span><span>FDA_IND_ACTIVE</span></div>
        </div>
      </footer>
    </div>
  );
}
